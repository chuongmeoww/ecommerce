import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  name: { type: String, trim: true },                             // nếu khách vãng lai
  rating: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, trim: true },
}, { timestamps: true });

export const Review = mongoose.model('Review', ReviewSchema);
