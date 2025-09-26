/* eslint-disable no-console */

// ===== Imports chuẩn =====
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pLimit from 'p-limit';
import * as cheerio from 'cheerio';
import { fetch } from 'undici';

import { Product } from '../src/models/Product.js';
import { slugify } from '../src/utils/slugify.js';

// ===== .env backend/.env =====
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// ===== Config =====
const BASE = 'https://yame.vn';
const CONCURRENCY = 3;
const SEED_CATEGORIES = ['ao-thun','ao-polo','so-mi','ao-khoac','quan-jeans','quan-tay','quan-shorts','phu-kien'];
const SEED_COLLECTIONS = ['the-beginner','the-trainer','basic','y2010'];

// ===== Utils =====
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const num = (s) => Number(String(s ?? '').replace(/[^\d]/g, '')) || 0;

async function fetchHTML(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`GET ${url} ${res.status}`);
  return res.text();
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in backend/.env');
  await mongoose.connect(uri, { dbName: process.env.DB_NAME || 'test' });
  console.log('[db] Connected');
}

async function upsertProduct(doc) {
  const data = { ...doc };
  data.slug = slugify(data.slug || data.name);
  await Product.updateOne({ slug: data.slug }, { $set: data }, { upsert: true });
}
function parseFromHref(href) {
  try {
    const u = new URL(href.startsWith('http') ? href : `${BASE}${href}`);
    const segs = u.pathname.split('/').filter(Boolean); // ['collection','the-beginner'] or ['ao-thun']
    let category = null, collection = null;
    // if (segs[0] === 'collection' && segs[1]) collection = segs[1];
    if (segs[0] === 'collections' && segs[1]) collection = segs[1];
    else if (segs[0]) category = segs[0];
    return { category, collection };
  } catch {
    return { category: null, collection: null };
  }
}
// ===== Discover categories/collections từ trang chủ =====
// THAY KHỐI DISCOVER =>
async function discoverCatsCols() {
  try {
    const html = await fetchHTML(BASE);
    const $ = cheerio.load(html);

    const cats = new Set();
    const cols = new Set();

    const BLOCK = new Set([
      'collections','collection','cart','gio-hang','search','tim-kiem',
      'account','tai-khoan','lien-he','chinh-sach','blog'
    ]);

    $('a').each((_, a) => {
      const href = ($(a).attr('href') || '').trim();

      // /ao-thun, /quan-jeans ...
      if (/^\/[a-z0-9-]+$/.test(href)) {
        const slug = href.slice(1);
        if (!BLOCK.has(slug)) cats.add(slug);
      }

      // /collections/{slug} hoặc /collection/{slug}
      let m = href.match(/^\/collections\/([a-z0-9-]+)/);
      if (m && !BLOCK.has(m[1])) cols.add(m[1]);
      m = href.match(/^\/collection\/([a-z0-9-]+)/);
      if (m && !BLOCK.has(m[1])) cols.add(m[1]);
    });

    const categories = cats.size ? [...cats] : SEED_CATEGORIES;
    const collections = cols.size ? [...cols] : SEED_COLLECTIONS;
    console.log(`[discover] categories=${categories.length}, collections=${collections.length}`);
    return { categories, collections };
  } catch (e) {
    console.warn('[discover] failed → use seeds:', e.message);
    return { categories: SEED_CATEGORIES, collections: SEED_COLLECTIONS };
  }
}


// ===== Scrape list page (theo category + optional collection) =====
// THAY TOÀN BỘ HÀM scrapeList HIỆN TẠI =>
// ===== Scrape list page (theo category + optional collection) =====
async function scrapeList({ category, collection, limit = 10 }) {
  // yame dùng /collections/{slug} cho cả category & collection
  const url = collection
    ? `${BASE}/collections/${collection}`
    : `${BASE}/collections/${category}`;

  const html = await fetchHTML(url);
  const $ = cheerio.load(html);

  const out = [];

  // 1) Ưu tiên: JSON-LD (thường có danh sách Product kèm price, image)
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const txt = $(el).contents().text().trim();
      if (!txt) return;
      const data = JSON.parse(txt);

      const products =
        (Array.isArray(data) ? data : (data['@graph'] || data.itemListElement || data.products || []))
          .flat()
          .filter(x => (x && (x['@type'] === 'Product' || x.item && x.item['@type'] === 'Product')));

      for (const node of products) {
        const p = node['@type'] === 'Product' ? node : node.item;
        const name = p.name || '';
        const href = p.url || p['@id'] || '';
        const img = Array.isArray(p.image) ? p.image[0] : p.image;
        let price = 0, salePrice = 0;

        const offers = p.offers || (Array.isArray(p.offers) ? p.offers[0] : null);
        if (offers) {
          // tuỳ site: price / lowPrice/highPrice / priceSpecification...
          price = Number(offers.price || offers.highPrice || 0) || 0;
          salePrice = Number(offers.lowPrice || offers.price || 0) || 0;
        }

        if (href && name) {
          out.push({
            href: href.startsWith('http') ? href : `${BASE}${href}`,
            name,
            image: img && (img.startsWith('http') ? img : `${BASE}${img}`),
            price: price || salePrice,         // nếu không có giá gốc
            salePrice: salePrice || 0,
          });
        }
      }
    } catch {}
  });

  // 2) Fallback: quét thẻ <a> dẫn tới product detail
  if (out.length === 0) {
    $('a[href]').each((_, a) => {
      const href = ($(a).attr('href') || '').trim();
      if (!/\/(products|product|chi-tiet)\//i.test(href)) return;

      // tên sp
      const name =
        $(a).find('h3,.product-name,.name').first().text().trim() ||
        $(a).attr('title') || '';

      // ảnh
      let img =
        $(a).find('img').first().attr('src') ||
        $(a).find('img').first().attr('data-src') || '';

      // giá (cố gắng vét theo nhiều class phổ biến)
      const priceText =
        $(a).find('.price,.product-price,.new-price,.current-price').first().text() ||
        $(a).closest('.product').find('.price,.product-price,.new-price,.current-price').first().text() || '';
      const oldPriceText =
        $(a).find('.old-price,.original-price,.compare-price').first().text() ||
        $(a).closest('.product').find('.old-price,.original-price,.compare-price').first().text() || '';

      if (href && name) {
        out.push({
          href: href.startsWith('http') ? href : `${BASE}${href}`,
          name,
          image: img ? (img.startsWith('http') ? img : `${BASE}${img}`) : null,
          price: num(oldPriceText) || num(priceText),
          salePrice: num(priceText),
        });
      }
    });
  }

  // 3) Gỡ rác & cắt limit
  const uniq = new Map();
  for (const it of out) {
    const key = it.href;
    if (!uniq.has(key)) uniq.set(key, it);
  }
  const items = Array.from(uniq.values()).slice(0, limit);

  console.log(`[scrapeList] ${url} → found=${items.length}`);
  return items;
}



// ===== Scrape chi tiết sản phẩm =====
async function scrapeDetail(prodUrl) {
  try {
    const html = await fetchHTML(prodUrl);
    const $ = cheerio.load(html);

    const images = [];
    $('img').each((_, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src');
      if (src && !/data:image/.test(src)) {
        images.push({ url: src.startsWith('http') ? src : `${BASE}${src}` });
      }
    });

    const desc =
      $('.product-description, .desc, .tab-content p')
        .map((_, el) => $(el).text().trim()).get().join('\n') ||
      $('meta[name="description"]').attr('content') || '';

    // Thử vét size/color đơn giản (tuỳ site)
    const sizes = new Set();
    const colors = new Set();
    $('[class*="size"], [data-size]').each((_, el) => {
      const t = $(el).text().trim();
      if (/^(XS|S|M|L|XL|2XL|3XL|\d+)$/.test(t)) sizes.add(t);
    });
    $('[class*="color"], [data-color]').each((_, el) => {
      const t = $(el).text().trim();
      if (t && t.length < 24) colors.add(t);
    });

    return {
      images: images.slice(0, 8),
      description: desc,
      sizes: [...sizes],
      colors: [...colors],
    };
  } catch (e) {
    console.warn('[detail] fail', prodUrl, e.message);
    return { images: [], description: '' };
  }
}

// ===== Scrape 1 combo (category + optional collection) =====
async function runOne({ category, collection, limit }) {
  console.log(
  `→ scrape: ${collection ? `collection=${collection}` : `category=${category}`} | limit=${limit}`
);
  const list = await scrapeList({ category, collection, limit });
  let upserted = 0;

  for (const card of list) {
    const det = await scrapeDetail(card.href);
    const parsed = parseFromHref(card.href);
    const doc = {
      name: card.name,
      slug: slugify(card.name),
      brand: 'Yame',
      description: det.description || '',
      images: det.images?.length ? det.images : (card.image ? [{ url: card.image }] : []),
      price: card.price || 0,
      salePrice: card.salePrice || 0,
      category: category || parsed.category || 'khac',
      collection: collection || parsed.collection || null,
      tags: [category, collection].filter(Boolean),
      sizes: det.sizes || [],
      colors: det.colors || [],
      stock: 20,
      status: 'active',
    };
    await upsertProduct(doc);
    upserted++;
    await sleep(250);
  }

  console.log(`✓ Upserted: ${upserted} | category=${category} | collection=${collection ?? '-'}`);
  return upserted;
}

// ===== CLI =====
function parseArgs(argv) {
  const out = {};
  for (const s of argv) {
    const t = s.replace(/^-+/, '');
    const [k, v] = t.split('=');
    out[k] = v ?? true;
  }
  return out;
}

// ===== Main =====
async function main() {
  await connectDB();

  const args = parseArgs(process.argv.slice(2));
  const limit = Number(args.limit || 10);
  const all = !!args.all;
  const discover = !!args.discover;
  const category = args.category || null;
  const collection = args.collection || null;

  const limitRun = pLimit(CONCURRENCY);

  // Ưu tiên: nếu truyền cụ thể
  if (category) {
    await runOne({ category, collection: collection || null, limit });
    await mongoose.disconnect();
    return;
  }

// TRONG main(), THAY KHỐI --all =>
if (all) {
  const { categories, collections } = discover
    ? await discoverCatsCols()
    : { categories: SEED_CATEGORIES, collections: SEED_COLLECTIONS };

  // categories: /{category}
  await Promise.all(
    categories.map(cat =>
      limitRun(() =>
        runOne({ category: cat, collection: null, limit }).catch(e => {
          console.warn(`[cat:${cat}]`, e.message);
          return 0;
        })
      )
    )
  );

  // collections: /collections/{slug}
  await Promise.all(
    collections.map(col =>
      limitRun(() =>
        runOne({ category: null, collection: col, limit }).catch(e => {
          console.warn(`[col:${col}]`, e.message);
          return 0;
        })
      )
    )
  );

  await mongoose.disconnect();
  return;
}


  // Mặc định: dùng seeds
  await runOne({ category: 'ao-thun', collection: null, limit });
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
