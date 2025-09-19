// backend/src/controllers/reviewController.js
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';

async function recomputeProductRating(productId) {
  const agg = await Review.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  await Product.findByIdAndUpdate(productId, { $set: { ratingAvg: avg, ratingCount: count } });
}

export const listReviews = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total] = await Promise.all([
    Review.find({ productId }).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
    Review.countDocuments({ productId }),
  ]);
  res.json({ items, pagination: { page: pg, limit: lim, total } });
};

export const createReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, content } = req.body;
  const name = req.user?.name || req.user?.email || req.body.name || 'Khách';

  if (!rating) return res.status(400).json({ message: 'rating is required' });
  const review = await Review.create({ productId, rating, content, name, userId: req.user?.sub || null });
  await recomputeProductRating(productId);
  res.status(201).json({ review });
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const rv = await Review.findByIdAndDelete(reviewId);
  if (rv) await recomputeProductRating(rv.productId);
  res.json({ message: 'Deleted' });
};
