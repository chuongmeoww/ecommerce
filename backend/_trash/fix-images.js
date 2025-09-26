/* eslint-disable no-console */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

function makeImages(seed) {
  return [
    { url: `https://picsum.photos/seed/${seed}-1/800/1000` },
    { url: `https://picsum.photos/seed/${seed}-2/800/1000` },
    { url: `https://picsum.photos/seed/${seed}-3/800/1000` },
  ];
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  const dbName = process.env.DB_NAME || (new URL(uri).pathname.replace(/^\//,'') || 'test');
  await mongoose.connect(uri, { dbName });
  console.log('[db] Connected to', dbName);

  const cursor = Product.find({
    $or: [
      { images: { $exists: false } },
      { images: { $size: 0 } },
      { 'images.0.url': { $exists: false } }
    ]
  }).cursor();

  let fixed = 0;
  for await (const p of cursor) {
    const seed = (p.slug || p._id.toString()).slice(0, 40);
    p.images = makeImages(seed);
    await p.save();
    fixed++;
  }
  console.log(`✓ Backfilled images for ${fixed} product(s).`);

  await mongoose.disconnect();
}

run().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
