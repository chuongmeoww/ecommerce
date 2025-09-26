// backend/scripts/discover-yame.js
import axios from "axios";
import cheerio from "cheerio";

async function main() {
  const url = "https://yame.vn/";
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const categories = [];
  const collections = [];

  // Menu chính (category)
  $("nav a").each((i, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href || !text) return;

    // lọc link /collections/xxx
    if (href.includes("/collections/")) {
      const slug = href.split("/collections/")[1]?.split("?")[0];
      if (slug) {
        categories.push({ name: text, slug, url: "https://yame.vn/collections/" + slug });
      }
    }
  });

  // Collection đặc biệt (trong trang chính)
  $(".home-collection a, .nav-collection a").each((i, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    if (!href || !text) return;
    if (href.includes("/collections/")) {
      const slug = href.split("/collections/")[1]?.split("?")[0];
      if (slug) {
        collections.push({ name: text, slug, url: "https://yame.vn/collections/" + slug });
      }
    }
  });

  console.log("✅ Categories:", categories.length);
  console.table(categories.slice(0, 10));
  console.log("✅ Collections:", collections.length);
  console.table(collections.slice(0, 10));
}

main().catch(console.error);
