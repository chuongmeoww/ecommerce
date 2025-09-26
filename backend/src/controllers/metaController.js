// backend/src/controllers/metaController.js
import { Product } from '../models/Product.js';

export const navFacets = async (_req, res) => {
  // Lấy distinct + đếm số sp theo category/collection
  const [byCategory, byCollection] = await Promise.all([
    Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Product.aggregate([
      { $match: { status: 'active', collection: { $ne: null } } },
      { $group: { _id: '$collection', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Chuẩn hóa trả về: mảng {slug, name, count}
  const cats = byCategory
    .filter(x => !!x._id)
    .map(x => ({ slug: x._id, name: x._id.replace(/-/g, ' '), count: x.count }));

  const cols = byCollection
    .filter(x => !!x._id)
    .map(x => ({ slug: x._id, name: x._id.replace(/-/g, ' '), count: x.count }));

  res.json({ categories: cats, collections: cols });
};
