import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String, description: String
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

const DATA = [
  { name: 'Áo Thun', slug: 'ao-thun' },
  { name: 'Áo Khoác', slug: 'ao-khoac' },
  { name: 'Áo Sơ Mi', slug: 'ao-so-mi' },
  { name: 'Quần Dài', slug: 'quan-dai' },
  { name: 'Quần Short', slug: 'quan-short' },
];

(async () => {
  await mongoose.connect(uri);
  for (const c of DATA) {
    await Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  const count = await Category.countDocuments();
  console.log('Categories count:', count);
  await mongoose.disconnect();
})();
