import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "docs", "data", "items.json");
const endpoint = "https://steamcommunity.com/market/search/render/";
const delayMs = Math.max(0, Number(process.env.REQUEST_DELAY_MS) || 1200);
const maxRetries = 5;
const pageSize = 100;
const maxPagesPerKeyword = Math.max(1, Number(process.env.MAX_PAGES_PER_KEYWORD) || 2);
const keywords = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (process.env.ITEM_KEYWORDS || "AK-47,AWP,Knife,Gloves,Case").split(",").map((word) => word.trim()).filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestPage(keyword, start) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ query: keyword, appid: "730", norender: "1", start: String(start), count: String(pageSize) });

  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "CS2MarketViewer/1.0 (local data fetcher)" } });
    if (response.ok) return response.json();
    if (response.status === 429 && attempt < maxRetries) {
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(60_000, 1000 * 2 ** attempt));
      continue;
    }
    throw new Error(`Steam request failed (${response.status}) for "${keyword}" at offset ${start}`);
  }
}

function normalizeListing(listing) {
  const name = String(listing.name || "").trim();
  if (!name) return null;
  const icon = String(listing.asset_description?.icon_url || listing.icon_url || "").replace(/^\/+/, "");
  const price = listing.sell_price_text || listing.sale_price_text || (listing.sell_price ? `$${(Number(listing.sell_price) / 100).toFixed(2)}` : "Price unavailable");
  return {
    name,
    price,
    quantity: Number(listing.sell_listings ?? listing.asset_description?.market_tradable_restriction ?? 0),
    imageUrl: icon ? `https://community.cloudflare.steamstatic.com/economy/image/${icon}/360fx360f` : "",
  };
}

async function main() {
  if (keywords.length === 0) throw new Error("Provide one or more search keywords.");
  const itemsByName = new Map();
  let requests = 0;

  for (const keyword of keywords) {
    let totalCount = Infinity;
    for (let start = 0, page = 0; start < totalCount && page < maxPagesPerKeyword; start += pageSize, page += 1) {
      if (requests > 0) await sleep(delayMs);
      const payload = await requestPage(keyword, start);
      requests += 1;
      totalCount = Number(payload.total_count) || 0;
      for (const row of payload.results || []) {
        const item = normalizeListing(row);
        if (item) itemsByName.set(item.name, item);
      }
    }
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify([...itemsByName.values()], null, 2)}\n`, "utf8");
  console.log(`Saved ${itemsByName.size} unique items from ${requests} Steam request(s) to ${path.relative(root, outputPath)}.`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
