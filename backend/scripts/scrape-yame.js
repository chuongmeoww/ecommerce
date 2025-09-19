// // backend/scripts/scrape-yame.js
// import 'dotenv/config';
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import slugify from 'slugify';
// import { connectDB } from '../src/config/db.js';
// import { Product } from '../src/models/Product.js';

// /**
//  * Cấu hình cơ bản
//  * - startUrls: có thể thêm nhiều collection của YaMe (collections/...)
//  * - maxPages: hạn chế phân trang (nếu có)
//  * - delayMs: nghỉ giữa các request để lịch sự
//  * - maxProducts: giới hạn số sản phẩm để test
//  */
// const CONFIG = {
//   startUrls: [
//     'https://yame.vn/collections/ao-thun-co-tron-tay-ngan', // ví dụ collection (có ~162 sp) :contentReference[oaicite:1]{index=1}
//     // có thể thêm collection khác vào đây
//   ],
//   maxPages: 3,
//   delayMs: 1200,
//   maxProducts: 60,
//   userAgent:
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
// };

// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// const toAbs = (href, base) => {
//   try { return new URL(href, base).href; } catch { return href; }
// };
// const onlyDigits = (s) => (s || '').replace(/[^\d]/g, '');
// const parsePriceFromText = (text) => {
//   // Lấy số cuối cùng có kèm VND/₫ (thường là "Giá ưu đãi ... VND")
//   const rx = /([\d\.\,\s]+)\s*(?:VND|₫)/gi;
//   let m, last = null;
//   while ((m = rx.exec(text))) last = m[1];
//   return last ? Number(onlyDigits(last)) : 0;
// };

// function slugFromUrl(url) {
//   try {
//     const u = new URL(url);
//     const parts = u.pathname.split('/').filter(Boolean);
//     const i = parts.indexOf('products');
//     if (i >= 0 && parts[i + 1]) return parts[i + 1];
//   } catch {}
//   return null;
// }

// // function normalizeSlug(name, link) {
// //   const fromUrl = slugFromUrl(link);
// //   if (fromUrl) return fromUrl;
// //   const s = slugify(name || '', { lower: true, strict: true, locale: 'vi' });
// //   return s || `sp-${Date.now()}`;
// // }
// function normalizeSlug(name, link) {
//   const fromUrl = slugFromUrl(link);
//   const raw = fromUrl ? decodeURIComponent(fromUrl) : name || '';
//   return slugify(raw, { lower: true, strict: true, locale: 'vi' }) || `sp-${Date.now()}`;
// }

// async function fetchHtml(url) {
//   const { data } = await axios.get(url, {
//     headers: { 'User-Agent': CONFIG.userAgent },
//     timeout: 20000
//   });
//   return data;
// }


// /**
//  * Từ trang collection:
//  * - Lấy tất cả link sản phẩm a[href*="/products/"]
//  * - Thử bắt phân trang: <link rel="next"> hoặc a[href*="?page="] chứa "next/tiếp"> (nếu có)
//  */
// function extractProductLinksAndNext(html, baseUrl) {
//   const $ = cheerio.load(html);
//   const links = new Set();

//   $('a[href*="/products/"]').each((_, a) => {
//     const href = $(a).attr('href');
//     if (!href) return;
//     const abs = toAbs(href, baseUrl);
//     // Lọc link thật sự tới trang chi tiết
//     if (/\/products\//.test(abs)) links.add(abs.split('?')[0]);
//   });

//   // next page ưu tiên <link rel="next">
//   let next = $('link[rel="next"]').attr('href');
//   if (!next) {
//     // fallback tìm a có "?page=" hoặc chữ "Tiếp"/">"
//     const cand = $('a[href*="page="]').filter((_, el) => {
//       const t = $(el).text().toLowerCase();
//       return t.includes('tiếp') || t.includes('next') || t.trim() === '>';
//     }).first().attr('href');
//     if (cand) next = cand;
//   }
//   const nextUrl = next ? toAbs(next, baseUrl) : null;

//   return { productLinks: Array.from(links), nextUrl };
// }

// /**
//  * Trích sản phẩm từ trang chi tiết:
//  * - Ưu tiên JSON-LD Product nếu có
//  * - Fallback: lấy H1, giá từ text chứa "VND/₫", ảnh từ thẻ img (ưu tiên ảnh lớn)
//  */
// function extractProductDetail(html, pageUrl) {
//   const $ = cheerio.load(html);

//   // 1) JSON-LD
//   let name, price = 0, currency = 'VND', images = [], sku, brand;
//   $('script[type="application/ld+json"]').each((_, s) => {
//     try {
//       const json = JSON.parse($(s).contents().text().trim());
//       const arr = Array.isArray(json) ? json : [json];
//       for (const obj of arr) {
//         if (obj && (obj['@type'] === 'Product' || obj['@type']?.includes?.('Product'))) {
//           name = name || obj.name;
//           if (obj.offers) {
//             const offers = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers;
//             price = Number(offers?.price) || price;
//             currency = offers?.priceCurrency || currency;
//           }
//           if (obj.image) {
//             const imgs = Array.isArray(obj.image) ? obj.image : [obj.image];
//             images = images.concat(imgs.filter(Boolean));
//           }
//           sku = sku || obj.sku;
//           brand = brand || (typeof obj.brand === 'string' ? obj.brand : obj.brand?.name);
//         }
//       }
//     } catch {}
//   });

//   // 2) Fallback: H1 + giá trong text
//   if (!name) name = $('h1').first().text().trim() || $('title').text().trim();
//   if (!price) price = parsePriceFromText($.text());

//   // 3) Fallback ảnh: lấy các ảnh lớn trong gallery/figure
//   if (!images.length) {
//     $('img').each((_, img) => {
//       const src = $(img).attr('src') || $(img).attr('data-src');
//       if (src && /\/products\//.test(src)) images.push(toAbs(src, pageUrl));
//     });
//     // nếu vẫn rỗng, lấy ảnh đầu tiên có kích thước tương đối lớn
//     if (!images.length) {
//       const src = $('img').first().attr('src');
//       if (src) images.push(toAbs(src, pageUrl));
//     }
//   }




//   const slug = normalizeSlug(name, pageUrl);
//   return {
//     name: name || 'No name',
//     slug,
//     price: Number.isFinite(price) ? price : 0,
//     currency: currency || 'VND',
//     images: images.filter(Boolean).slice(0, 8).map((u) => ({ url: u })),
//     sku: sku || null,
//     brand: brand || 'YaMe',
//     sourceUrl: pageUrl
//   };
// }

// function toProductDoc(raw) {
//   return {
//     name: raw.name,
//     slug: raw.slug,
//     price: raw.price,
//     images: raw.images,
//     category: 'yame-import',
//     brand: raw.brand || 'YaMe',
//     stock: 0,
//     status: 'active',
//     description: `Imported from ${raw.sourceUrl}`,
//     metadata: {
//       currency: raw.currency,
//       sku: raw.sku
//     },
//     lastScrapedAt: new Date()
//   };
// }

// // async function upsertProduct(doc) {
// //   return Product.findOneAndUpdate(
// //     { slug: doc.slug },
// //     { $set: doc },
// //     { upsert: true, new: true }
// //   ).select('_id slug name');
// // }
// async function upsertProduct(doc) {
//   return Product.updateOne(
//     { slug: doc.slug },
//     {
//       $set: {
//         price: doc.price,
//         images: doc.images,
//         metadata: doc.metadata,
//         lastScrapedAt: doc.lastScrapedAt
//       },
//       $setOnInsert: {
//         name: doc.name,
//         slug: doc.slug,
//         category: doc.category,
//         brand: doc.brand,
//         stock: doc.stock,
//         status: doc.status,
//         description: doc.description
//       }
//     },
//     { upsert: true }
//   );
// }



// async function run() {
//   console.log('[scrape] Connecting DB...');
//   await connectDB();

//   const visitedProduct = new Set();
//   let seen = 0;

//   for (const startUrl of CONFIG.startUrls) {
//     let url = startUrl;
//     let page = 1;

//     while (url && page <= CONFIG.maxPages && seen < CONFIG.maxProducts) {
//       console.log(`[scrape] Collection page ${page}: ${url}`);
//       const html = await fetchHtml(url);
//       const { productLinks, nextUrl } = extractProductLinksAndNext(html, url);

//       console.log(`[scrape] Found ${productLinks.length} product links`);
//       for (const link of productLinks) {
//         if (seen >= CONFIG.maxProducts) break;
//         if (visitedProduct.has(link)) continue;
//         visitedProduct.add(link);

//         try {
//           const pHtml = await fetchHtml(link);
//           const raw = extractProductDetail(pHtml, link); // tên/giá/ảnh… từ trang sp :contentReference[oaicite:2]{index=2}
//           const doc = toProductDoc(raw);
//           await upsertProduct(doc);
//           seen++;
//           console.log(`  [+] ${doc.slug} — ${doc.price} VND`);
//           await sleep(CONFIG.delayMs);
//         } catch (e) {
//           console.warn('  [!] fail product', link, e.message);
//         }
//       }

//       url = nextUrl;
//       page++;
//       if (url) await sleep(CONFIG.delayMs);
//     }
//   }

//   console.log('[scrape] DONE. Imported/updated:', seen);
//   process.exit(0);
// }

// run().catch((e) => {
//   console.error('[scrape] FATAL', e);
//   process.exit(1);
// });


// // backend/scripts/scrape-yame.js
// import 'dotenv/config';
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import slugify from 'slugify';
// import { connectDB } from '../src/config/db.js';
// import { Product } from '../src/models/Product.js';

// /* ============================ CONFIG ============================ */
// const CONFIG = {
//   startUrls: [
//     'https://yame.vn/collections/ao-thun-co-tron-tay-ngan',
//     // thêm các collections khác nếu cần
//   ],
//   maxPages: 3,            // số trang collection tối đa
//   maxProducts: 60,        // số sản phẩm tối đa (test)
//   delayMs: 1200,          // nghỉ giữa các request
//   userAgent:
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36'
// };

// /* ============================ UTILS ============================ */
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// function fixUrl(u, base) {
//   if (!u) return '';
//   try {
//     const url = new URL(u, base);
//     if (url.protocol === 'http:') url.protocol = 'https:';
//     return url.href;
//   } catch {
//     return u;
//   }
// }

// function onlyDigits(s) {
//   return (s || '').replace(/[^\d]/g, '');
// }

// function parsePriceFromText(text) {
//   // Lấy số cuối cùng đi kèm VND/₫
//   const rx = /([\d\.\,\s]+)\s*(?:VND|₫)/gi;
//   let m, last = null;
//   while ((m = rx.exec(text))) last = m[1];
//   return last ? Number(onlyDigits(last)) : 0;
// }

// function slugFromUrl(url) {
//   try {
//     const u = new URL(url);
//     const parts = u.pathname.split('/').filter(Boolean);
//     const i = parts.indexOf('products');
//     if (i >= 0 && parts[i + 1]) return parts[i + 1];
//   } catch {}
//   return null;
// }

// function normalizeSlug(name, link) {
//   const fromUrl = slugFromUrl(link);
//   const raw = fromUrl ? decodeURIComponent(fromUrl) : (name || '');
//   return slugify(raw, { lower: true, strict: true, locale: 'vi' }) || `sp-${Date.now()}`;
// }

// async function fetchHtml(url) {
//   const { data } = await axios.get(url, {
//     headers: { 'User-Agent': CONFIG.userAgent },
//     timeout: 20000
//   });
//   return data;
// }

// /* ============ COLLECTION: Lấy link sản phẩm & trang kế tiếp ============ */
// function extractProductLinksAndNext(html, baseUrl) {
//   const $ = cheerio.load(html);
//   const links = new Set();

//   // Bắt mọi link tới /products/*
//   $('a[href*="/products/"]').each((_, a) => {
//     const href = $(a).attr('href');
//     if (!href) return;
//     const abs = fixUrl(href, baseUrl);
//     if (/\/products\//.test(abs)) links.add(abs.split('?')[0]);
//   });

//   // Tìm next page: <link rel="next">, nếu không có thì tìm a "?page="
//   let next = $('link[rel="next"]').attr('href');
//   if (!next) {
//     const cand = $('a[href*="page="]')
//       .filter((_, el) => {
//         const t = $(el).text().toLowerCase().trim();
//         return t.includes('tiếp') || t.includes('next') || t === '>';
//       })
//       .first()
//       .attr('href');
//     if (cand) next = cand;
//   }
//   const nextUrl = next ? fixUrl(next, baseUrl) : null;

//   return { productLinks: Array.from(links), nextUrl };
// }

// /* ============================ DETAIL: ẢNH ============================ */
// function extractImages($, pageUrl) {
//   const out = [];

//   // 1) Ảnh lớn trong gallery (thường là thẻ <a href=".../cdn/shop/...jpg">)
//   $('a[href*="/cdn/shop/"]').each((_, a) => {
//     const href = $(a).attr('href');
//     if (!href) return;
//     if (!/\.(jpe?g|png|webp|avif)(\?|$)/i.test(href)) return;
//     if (/logo|favicon|sprite/i.test(href)) return;
//     out.push(fixUrl(href, pageUrl));
//   });

//   // 2) Fallback: ảnh trong thẻ <img> thuộc Shopify CDN
//   if (out.length === 0) {
//     $('img[src*="/cdn/shop/"], img[data-src*="/cdn/shop/"]').each((_, img) => {
//       const src = $(img).attr('src') || $(img).attr('data-src');
//       if (!src) return;
//       if (/logo|favicon|sprite/i.test(src)) return;
//       out.push(fixUrl(src, pageUrl));
//     });
//   }

//   // 3) Fallback cuối: og:image
//   if (out.length === 0) {
//     const og = $('meta[property="og:image"]').attr('content');
//     if (og && !/logo/i.test(og)) out.push(fixUrl(og, pageUrl));
//   }

//   return [...new Set(out)].slice(0, 10).map((u) => ({ url: u }));
// }

// /* ============================ DETAIL: THÔNG TIN ============================ */
// function extractProductDetail(html, pageUrl) {
//   const $ = cheerio.load(html);

//   let name, price = 0, currency = 'VND', sku, brand;

//   // Ưu tiên JSON-LD Product (nếu có)
//   $('script[type="application/ld+json"]').each((_, s) => {
//     try {
//       const json = JSON.parse($(s).contents().text().trim());
//       const arr = Array.isArray(json) ? json : [json];
//       for (const obj of arr) {
//         if (!obj) continue;
//         const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
//         if (types.includes('Product')) {
//           name = name || obj.name;
//           if (obj.offers) {
//             const offers = Array.isArray(obj.offers) ? obj.offers[0] : obj.offers;
//             price = Number(offers?.price) || price;
//             currency = offers?.priceCurrency || currency;
//           }
//           sku = sku || obj.sku;
//           brand = brand || (typeof obj.brand === 'string' ? obj.brand : obj.brand?.name);
//         }
//       }
//     } catch {}
//   });

//   // Fallback: h1 + quét text lấy giá
//   if (!name) name = $('h1').first().text().trim() || $('title').text().trim();
//   if (!price) price = parsePriceFromText($.text());

//   // Ảnh
//   const images = extractImages($, pageUrl);

//   const slug = normalizeSlug(name, pageUrl);
//   return {
//     name: name || 'No name',
//     slug,
//     price: Number.isFinite(price) ? price : 0,
//     currency: currency || 'VND',
//     images,
//     sku: sku || null,
//     brand: brand || 'YaMe',
//     sourceUrl: pageUrl
//   };
// }

// /* ============================ MAP & UPSERT ============================ */
// function toProductDoc(raw) {
//   return {
//     name: raw.name,
//     slug: raw.slug,
//     price: raw.price,
//     images: raw.images,
//     category: 'yame-import',
//     brand: raw.brand || 'YaMe',
//     stock: 0,
//     status: 'active',
//     description: `Imported from ${raw.sourceUrl}`,
//     metadata: { currency: raw.currency, sku: raw.sku, sourceUrl: raw.sourceUrl },
//     lastScrapedAt: new Date()
//   };
// }

// async function upsertProduct(doc) {
//   return Product.updateOne(
//     { slug: doc.slug },
//     {
//       $set: {
//         price: doc.price,
//         images: doc.images,
//         metadata: doc.metadata,
//         lastScrapedAt: doc.lastScrapedAt
//       },
//       $setOnInsert: {
//         name: doc.name,
//         slug: doc.slug,
//         category: doc.category,
//         brand: doc.brand,
//         stock: doc.stock,
//         status: doc.status,
//         description: doc.description
//       }
//     },
//     { upsert: true }
//   );
// }

// /* ============================ MAIN ============================ */
// async function run() {
//   console.log('[scrape] Connecting DB...');
//   await connectDB();

//   const visited = new Set();
//   let seen = 0;

//   for (const startUrl of CONFIG.startUrls) {
//     let url = startUrl;
//     let page = 1;

//     while (url && page <= CONFIG.maxPages && seen < CONFIG.maxProducts) {
//       console.log(`[scrape] Collection page ${page}: ${url}`);
//       const html = await fetchHtml(url);
//       const { productLinks, nextUrl } = extractProductLinksAndNext(html, url);
//       console.log(`[scrape] Found ${productLinks.length} product links`);

//       for (const link of productLinks) {
//         if (seen >= CONFIG.maxProducts) break;
//         if (visited.has(link)) continue;
//         visited.add(link);

//         try {
//           const pHtml = await fetchHtml(link);
//           const raw = extractProductDetail(pHtml, link);
//           const doc = toProductDoc(raw);
//           await upsertProduct(doc);
//           seen++;
//           console.log(`  [+] ${doc.slug} — ${doc.price} VND  (imgs: ${doc.images.length})`);
//           await sleep(CONFIG.delayMs);
//         } catch (e) {
//           console.warn('  [!] fail product', link, e.message);
//         }
//       }

//       url = nextUrl;
//       page++;
//       if (url) await sleep(CONFIG.delayMs);
//     }
//   }

//   console.log('[scrape] DONE. Imported/updated:', seen);
//   process.exit(0);
// }

// run().catch((e) => {
//   console.error('[scrape] FATAL', e);
//   process.exit(1);
// });


// backend/scripts/scrape-yame.js
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import pLimit from 'p-limit';
import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';

const BASE = process.env.YAME_BASE || 'https://yame.vn';
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Cho phép truyền category/collection qua args:  --category=ao-thun --collection=the-beginner
const ARGS = Object.fromEntries(
  process.argv.slice(2).map(kv => {
    const [k, v] = kv.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const DEFAULT_CATEGORY = ARGS.category || 'ao-thun';
const DEFAULT_COLLECTION = ARGS.collection || 'the-beginner';

// helpers
const toSlug = (s) => slugify(s || '', { lower: true, locale: 'vi', strict: true });
const parsePriceVND = (txt = '') => {
  const m = txt.match(/([\d\.]+)\s*VND/i);
  return m ? Number(m[1].replace(/\./g, '')) : null;
};

async function fetchHTML(url) {
  const resp = await axios.get(url, {
    timeout: 15000,
    headers: { 'User-Agent': 'KLTN-Scraper/1.0 (+edu only)' },
  });
  return cheerio.load(resp.data);
}

async function listProductsFromCollection(path, max = 24) {
  // ví dụ path: /collections/all
  const $ = await fetchHTML(`${BASE}${path}`);
  const out = [];
  $('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    if (/\/products?\/[^/]+$/i.test(href)) {
      const card = $(a).closest('div');
      const name = ($(a).text() || '').trim() || $(card).find('h2,h3').first().text().trim();
      const text = card.text();
      const price = parsePriceVND(text);
      const img = $(card).find('img').first().attr('src') || $(card).find('img').first().attr('data-src');
      if (name && href) {
        out.push({
          name,
          href: new URL(href, BASE).href,
          price: price ?? null,
          image: img || null,
        });
      }
    }
  });
  // unique + limit
  const seen = new Set();
  const uniq = [];
  for (const it of out) {
    if (seen.has(it.href)) continue;
    seen.add(it.href);
    uniq.push(it);
    if (uniq.length >= max) break;
  }
  return uniq;
}

async function enrichDetail(p) {
  try {
    const $ = await fetchHTML(p.href);
    const title = $('h1,h2').first().text().trim() || p.name;
    const images = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && /(\.jpg|\.jpeg|\.png|\.webp|cdn|\/files\/)/i.test(src) && !images.includes(src)) {
        images.push(src);
      }
    });
    const sale = parsePriceVND($('body').text()) || p.price || 0;
    return { ...p, name: title, images: images.slice(0, 5), salePrice: sale };
  } catch {
    return p;
  }
}

async function main() {
  if (!MONGO_URI) throw new Error('Missing MONGODB_URI in backend/.env');

  await mongoose.connect(MONGO_URI);

  // lấy danh sách từ /collections/all (bạn có thể đổi thành các path khác)
  const paths = ['/collections/all'];
  const raw = [];
  for (const path of paths) {
    const arr = await listProductsFromCollection(path, 24);
    raw.push(...arr);
  }

  // throttle enrich
  const limit = pLimit(3);
  const enriched = await Promise.all(raw.map(r => limit(() => enrichDetail(r))));

  // upsert vào Product
  let count = 0;
  for (const p of enriched) {
    const slug = toSlug(p.name);
    const doc = await Product.findOneAndUpdate(
      { slug },
      {
        $setOnInsert: { createdAt: new Date() },
        $set: {
          name: p.name,
          slug,
          price: p.price || p.salePrice || 0,
          salePrice: p.salePrice || null,
          brand: 'YaMe',
          status: 'active',
          category: DEFAULT_CATEGORY,      // dạng chuỗi/slug
          collection: DEFAULT_COLLECTION,  // dạng chuỗi/slug
          images: (p.images?.length ? p.images : (p.image ? [p.image] : []))
            .filter(Boolean)
            .map(u => ({ url: u, alt: p.name })),
        },
      },
      { upsert: true, new: true }
    );
    if (doc) count++;
  }

  console.log(`Seeded/updated products: ${count} | category=${DEFAULT_CATEGORY} | collection=${DEFAULT_COLLECTION}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
