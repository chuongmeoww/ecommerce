import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  image: { type: String },
  description: { type: String },
  sourceUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Collection', collectionSchema);
