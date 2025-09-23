import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Review } from '../models/Review.js';

// Recompute ratingAvg & ratingCount for a product
async function recomputeProductRating(productId) {
  const agg = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$productId', count: { $sum: 1 }, avg: { $avg: '$rating' } } },
  ]);
  const { count = 0, avg = 0 } = agg[0] || {};
  await Product.updateOne({ _id: productId }, { $set: { ratingCount: count, ratingAvg: Number(avg.toFixed(2)) } });
}

/** -------- Public APIs -------- */

// GET /products/:idOrSlug/reviews
export const listReviews = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isId ? { _id: idOrSlug } : { slug: idOrSlug })
    .select('_id').lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { page = 1, limit = 10 } = req.query;
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Review.find({ productId: product._id })
      .sort({ createdAt: -1 })
      .skip(skip).limit(lim).lean(),
    Review.countDocuments({ productId: product._id }),
  ]);

  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

// POST /products/:idOrSlug/reviews
// Cho phép khách vãng lai: name + content + rating (Auth sẽ auto điền name nếu có)
export const createReview = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isId ? { _id: idOrSlug } : { slug: idOrSlug })
    .select('_id').lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let { rating, content, name } = req.body;
  rating = Number(rating);
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Invalid rating' });
  if (!content || !content.trim()) return res.status(400).json({ message: 'Content required' });

  const doc = {
    productId: product._id,
    rating,
    content: content.trim(),
  };
  if (req.user) {
    doc.userId = req.user.sub;
    // name ưu tiên từ req.body; nếu không có → lấy từ token user (nếu bạn muốn có thể query User để lấy name thật)
    doc.name = name || req.user.email?.split('@')[0] || 'User';
  } else {
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });
    doc.name = name.trim();
  }

  const review = await Review.create(doc);
  await recomputeProductRating(product._id);
  res.status(201).json({ review });
};

/** -------- Admin APIs -------- */

// GET /admin/reviews
export const adminListReviews = async (req, res) => {
  const { q, productId, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (productId) filter.productId = productId;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, 'i') },
      { content: new RegExp(q, 'i') },
    ];
  }
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
    Review.countDocuments(filter),
  ]);
  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

// DELETE /admin/reviews/:id
export const adminDeleteReview = async (req, res) => {
  const { id } = req.params;
  const rv = await Review.findByIdAndDelete(id);
  if (!rv) return res.status(404).json({ message: 'Review not found' });
  await recomputeProductRating(rv.productId);
  res.json({ message: 'Deleted' });
};
