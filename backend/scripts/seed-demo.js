/* eslint-disable no-console */
// Seed demo products with images

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';
import { slugify } from '../src/utils/slugify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// --- Config ---
const CATEGORIES = [
  { slug: 'ao-thun',        name: 'Áo thun' },
  { slug: 'ao-polo',        name: 'Áo polo' },
  { slug: 'so-mi',          name: 'Sơ mi' },
  { slug: 'ao-khoac',       name: 'Áo khoác' },
  { slug: 'quan-jeans',     name: 'Quần jeans' },
  { slug: 'quan-tay',       name: 'Quần tây' },
  { slug: 'quan-shorts',    name: 'Quần short' },
  { slug: 'phu-kien',       name: 'Phụ kiện' },
];

const COLLECTIONS = ['the-beginner','the-trainer','basic','y2010'];
const BRANDS = ['YaMe', 'Y2010', 'Basic'];
const SIZES = ['S','M','L','XL'];
const COLORS = ['Đen','Trắng','Xám','Xanh'];

// --- Helpers ---
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rand(0, arr.length - 1)];
function makeImages(seed) {
  return [
    { url: `https://picsum.photos/seed/${seed}-1/800/1000` },
    { url: `https://picsum.photos/seed/${seed}-2/800/1000` },
    { url: `https://picsum.photos/seed/${seed}-3/800/1000` },
  ];
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in backend/.env');
  // Nếu URI đã chứa db (ví dụ /clothing_shop_auth) thì mongoose sẽ dùng luôn,
  // nếu không thì dùng DB_NAME hoặc 'test'
  const dbName = process.env.DB_NAME || (new URL(uri).pathname.replace(/^\//,'') || 'test');
  await mongoose.connect(uri, { dbName });
  console.log('[db] Connected to', dbName);
}

function parseArgs(argv) {
  const out = { perCat: 10, wipe: false };
  for (const s of argv) {
    const t = s.replace(/^-+/, '');
    if (t === 'wipe') out.wipe = true;
    else if (t.startsWith('perCat=')) out.perCat = Number(t.split('=')[1] || 10);
  }
  return out;
}

async function runSeed({ perCat = 10, wipe = false }) {
  if (wipe) {
    await Product.deleteMany({});
    console.log('• Wiped products collection');
  }

  let total = 0;

  for (const cat of CATEGORIES) {
    console.log(`→ Seeding category: ${cat.slug} (x${perCat})`);
    for (let i = 1; i <= perCat; i++) {
      const name = `${cat.name} Demo ${i}`;
      const price = rand(129000, 499000);
      const salePrice = Math.random() < 0.5 ? price - rand(10000, 60000) : 0;
      const seedStr = `${cat.slug}-${i}`; // ✅ Ở TRONG vòng lặp nên có biến cat

      const sizes = SIZES.slice(0, rand(2, SIZES.length));     // vài size ngẫu nhiên
      const colors = COLORS.slice(0, rand(2, COLORS.length));  // vài màu ngẫu nhiên

      const doc = {
        name,
        slug: slugify(name),
        brand: pick(BRANDS),
        description: `Mô tả demo cho ${name}. Chất liệu thoáng, đường may chắc chắn.`,
        images: makeImages(seedStr), // ✅ luôn có ảnh
        price,
        salePrice,
        category: cat.slug,
        collection: Math.random() < 0.7 ? pick(COLLECTIONS) : undefined,
        tags: [cat.slug],
        sizes,
        colors,
        stock: rand(5, 40),
        status: 'active',
      };

      await Product.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
      total++;
    }
  }

  console.log(`✓ Seeded ${total} products across ${CATEGORIES.length} categories`);
}

async function main() {
  await connectDB();
  const args = parseArgs(process.argv.slice(2));
  await runSeed(args);
  await mongoose.disconnect();
  console.log('[db] Disconnected');
}

main().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
