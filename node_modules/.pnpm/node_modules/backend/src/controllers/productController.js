

// backend/src/controllers/productController.js
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';
import { slugify } from '../utils/slugify.js';

/** buildFilter: chuyển query FE -> bộ lọc Mongo */
function buildFilter(qs) {
  const {
    q, category, collection, brand, tags, colors, sizes,
    minPrice, maxPrice, inStock, status = 'active',
  } = qs;

  const filter = {};

  if (status) filter.status = status; // public = 'active' (set ở handler)
  if (q) {
    // ưu tiên text search, fallback regex
    filter.$or = [
      { $text: { $search: q } },
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }
  if (category) filter.category = category;
  if (collection) filter.collection = collection;
  if (brand) filter.brand = brand;
  if (tags) {
    const arr = Array.isArray(tags) ? tags : String(tags).split(',').map(s => s.trim()).filter(Boolean);
    filter.tags = { $in: arr };
  }
  if (colors) {
    const arr = Array.isArray(colors) ? colors : String(colors).split(',').map(s => s.trim()).filter(Boolean);
    filter.$or = (filter.$or || []).concat([{ 'variants.color': { $in: arr } }]);
  }
  if (sizes) {
    const arr = Array.isArray(sizes) ? sizes : String(sizes).split(',').map(s => s.trim()).filter(Boolean);
    filter.$or = (filter.$or || []).concat([{ 'variants.size': { $in: arr } }]);
  }
  if (minPrice || maxPrice) {
    const price = {};
    if (minPrice) price.$gte = Number(minPrice);
    if (maxPrice) price.$lte = Number(maxPrice);
    // ưu tiên salePrice nếu có, fallback price
    filter.$or = (filter.$or || []).concat([{ salePrice: { ...price } }, { price }]);
  }
  if (inStock === '1' || inStock === 'true') {
    filter.$or = (filter.$or || []).concat([{ stock: { $gt: 0 } }, { 'variants.stock': { $gt: 0 } }]);
  }

  return filter;
}

// function buildSort(sort) {
//   return ({
//     latest: { createdAt: -1 },
//     price_asc: { salePrice: 1, price: 1 },
//     price_desc: { salePrice: -1, price: -1 },
//     sold_desc: { sold: -1 },
//     rating_desc: { ratingAvg: -1, ratingCount: -1 },
//     featured: { featured: -1, createdAt: -1 },
//   }[sort] || { createdAt: -1 });
// }
function buildSort(sort) {
  switch (sort) {
    case 'latest':        return { createdAt: -1 };
    case 'price_asc':     return { salePrice: 1, price: 1 };
    case 'price_desc':    return { salePrice: -1, price: -1 };
    case 'sold_desc':     return { sold: -1, createdAt: -1 };
    case 'rating_desc':   return { ratingAvg: -1, ratingCount: -1, createdAt: -1 };
    case 'featured':      return { featured: -1, sold: -1, createdAt: -1 };
    case 'a_z':           return { name: 1 };
    case 'z_a':           return { name: -1 };
    default:              return { createdAt: -1 };
  }
}

/** -------- Public APIs -------- */
export const listProducts = async (req, res) => {
  const {
    page = 1, limit = 24, sort = 'latest',
    q, category, collection, brand, tags, colors, sizes,
    minPrice, maxPrice, inStock,
  } = req.query;

  const filter = buildFilter({ q, category, collection, brand, tags, colors, sizes, minPrice, maxPrice, inStock, status: 'active' });
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(60, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total, facets] = await Promise.all([
    Product.find(filter)
      // .select('name slug images price salePrice brand category collection tags sold ratingAvg ratingCount createdAt')
      .select('_id name slug images price salePrice brand category collection tags sold ratingAvg ratingCount createdAt')

      .sort(buildSort(sort))
      .skip(skip).limit(lim).lean(),
    Product.countDocuments(filter),
    // Facets đơn giản (đếm theo category/collection/brand)
    Product.aggregate([
      { $match: filter },
      {
        $facet: {
          byCategory: [{ $group: { _id: '$category', count: { $sum: 1 } } }],
          byCollection: [{ $group: { _id: '$collection', count: { $sum: 1 } } }],
          byBrand: [{ $group: { _id: '$brand', count: { $sum: 1 } } }],
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: { $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price'] } },
                max: { $max: { $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price'] } },
              }
            }
          ]
        }
      },
    ]),
  ]);

  res.json({
    items,
    pagination: { page: pg, limit: lim, total },
    facets: (facets?.[0]) || {},
  });
};

export const getProduct = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isId ? { _id: idOrSlug } : { slug: idOrSlug }).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const relatedProducts = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const base = await Product.findOne(isId ? { _id: idOrSlug } : { slug: idOrSlug }).lean();
  if (!base) return res.status(404).json({ message: 'Product not found' });
  const filter = { status: 'active', _id: { $ne: base._id } };
  if (base.category) filter.category = base.category;
  const items = await Product.find(filter)
    .select('name slug images price salePrice brand category collection sold ratingAvg createdAt')
    .sort({ sold: -1, createdAt: -1 })
    .limit(12).lean();
  res.json({ items });
};

export const suggestions = async (req, res) => {
  // Gợi ý nhanh cho ô search: trả về tên/slug theo q
  const { q } = req.query;
  if (!q) return res.json({ items: [] });
  const items = await Product.find({ name: { $regex: q, $options: 'i' }, status: 'active' })
    .select('name slug images').limit(8).lean();
  res.json({ items });
};

/** -------- Admin APIs -------- */
export const adminList = async (req, res) => {
  const { page = 1, limit = 20, sort = 'latest' } = req.query;
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Product.find({})
      .sort(buildSort(sort))
      .skip(skip).limit(lim).lean(),
    Product.countDocuments({}),
  ]);

  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

export const createProduct = async (req, res) => {
  const data = req.body;
  data.slug = slugify(data.slug || data.name);
  const exists = await Product.findOne({ slug: data.slug });
  if (exists) return res.status(409).json({ code: 'SLUG_TAKEN', message: 'Slug already exists' });
  const product = await Product.create(data);
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const patch = { ...req.body };
  if (patch.slug) patch.slug = slugify(patch.slug);
  const product = await Product.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  // xoá review kèm (nếu muốn)
  await Review.deleteMany({ productId: id });
  res.json({ message: 'Deleted' });
};

export const toggleFeatured = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.featured = !product.featured;
  await product.save();
  res.json({ product });
};

export const bulkUpsert = async (req, res) => {
  // nhập hàng loạt từ CSV/JSON
  const { items = [] } = req.body;
  let upserted = 0;
  for (const raw of items) {
    const data = { ...raw };
    data.slug = slugify(data.slug || data.name);
    await Product.updateOne({ slug: data.slug }, { $set: data }, { upsert: true });
    upserted++;
  }
  res.json({ upserted });
};
