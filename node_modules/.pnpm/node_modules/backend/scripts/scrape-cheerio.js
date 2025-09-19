// backend/scripts/scrape-cheerio.js
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import slugify from 'slugify';

// ⚠️ Sửa đường dẫn nếu cấu trúc khác
// import connectDB from '../src/config/db.js';
import { connectDB } from '../src/config/db.js';

import { Product } from '../src/models/Product.js';
// ============ CẤU HÌNH ============
// Chỉ cần đổi startUrl + selector cho khớp website mục tiêu.
const CONFIG = {
  startUrl: 'https://example.com/products', // TODO: đổi sang trang thật
  maxPages: 5,                               // chống lạc vô hạn
  delayMs: 1000,                             // lịch sự giữa các request
  selectors: {
    item: '.product-card',
    name: '.product-title',
    price: '.price',
    image: 'img',
    link: 'a'
  },
  // Nếu có phân trang: selector cho "link trang kế"
  nextPage: '.pagination a.next'
};

// ============ HÀM TIỆN ÍCH ============
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function toAbsUrl(href, base) {
  try { return new URL(href, base).href; } catch { return href; }
}

function parsePrice(text) {
  if (!text) return 0;
  // Lấy số từ chuỗi "199.000đ" / "199,000 VND" / " $25.90 "
  const digits = text.replace(/[^\d]/g, '');
  return Number(digits || 0);
}

// Map dữ liệu cào -> schema Product của bạn
function mapToProductDoc(raw) {
  const slug = slugify(raw.name || '', { lower: true, strict: true }) || `sp-${Date.now()}`;
  return {
    name: raw.name?.trim() || 'No name',
    slug,
    price: raw.price ?? 0,
    images: raw.image ? [{ url: raw.image }] : [],
    category: raw.category || 'imported',
    brand: raw.brand || 'N/A',
    stock: Number.isFinite(raw.stock) ? raw.stock : 0,
    status: 'active',
    description: raw.link ? `Imported from: ${raw.link}` : ''
  };
}

// ============ LOGIC CÀO ============
async function fetchPage(url) {
  const res = await axios.get(url, {
    headers: {
      // Một UA lịch sự, tránh bị chặn vặt
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'
    },
    timeout: 20000
  });
  return res.data;
}

function extractItems(html, baseUrl) {
  const $ = cheerio.load(html);
  const { item, name, price, image, link } = CONFIG.selectors;
  const out = [];
  $(item).each((_, el) => {
    const nameText = $(el).find(name).text();
    const priceText = $(el).find(price).text();
    const img = $(el).find(image).attr('src') || $(el).find(image).attr('data-src');
    const href = $(el).find(link).attr('href');

    out.push({
      name: nameText?.trim(),
      price: parsePrice(priceText),
      image: img ? toAbsUrl(img, baseUrl) : null,
      link: href ? toAbsUrl(href, baseUrl) : null
    });
  });
  // Tìm link trang kế (nếu có)
  const nextHref = CONFIG.nextPage ? $(CONFIG.nextPage).attr('href') : null;
  const nextUrl = nextHref ? toAbsUrl(nextHref, baseUrl) : null;
  return { items: out, nextUrl };
}

async function upsertProducts(items) {
  let created = 0, updated = 0;
  for (const raw of items) {
    const doc = mapToProductDoc(raw);
    const result = await Product.findOneAndUpdate(
      { slug: doc.slug },
      { $set: doc },
      { upsert: true, new: true }
    ).select('_id slug name');
    if (result.createdAt && (Date.now() - result.createdAt.getTime()) < 5000) created++;
    else updated++;
  }
  return { created, updated };
}

async function run() {
  console.log('[scrape] Connecting DB...');
  await connectDB();

  let url = CONFIG.startUrl;
  let page = 1;
  let total = 0;

  while (url && page <= CONFIG.maxPages) {
    console.log(`[scrape] Page ${page}: ${url}`);
    try {
      const html = await fetchPage(url);
      const { items, nextUrl } = extractItems(html, url);
      console.log(`[scrape] Found ${items.length} items on page ${page}`);
      const { created, updated } = await upsertProducts(items);
      total += items.length;
      console.log(`[scrape] Upserted: +${created} new, ~${updated} updated (total seen: ${total})`);
      url = nextUrl;
      page++;
      if (url) await sleep(CONFIG.delayMs);
    } catch (e) {
      console.error('[scrape] ERROR at', url, e.message);
      break;
    }
  }

  console.log('[scrape] DONE. Total seen:', total);
  process.exit(0);
}

run().catch(err => {
  console.error('[scrape] FATAL', err);
  process.exit(1);
});
