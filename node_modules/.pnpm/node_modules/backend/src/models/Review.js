// backend/src/models/Review.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // nếu có User
    name: { type: String, required: true },         // fallback khi user ẩn danh
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Review = mongoose.model('Review', ReviewSchema);
