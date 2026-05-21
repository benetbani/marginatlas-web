/**
 * Plan v18 Phase 0.6 — post-deploy cache warmer.
 *
 * Hits the top 100 most likely URLs against production so Vercel's
 * edge cache is full before the first real user lands. Run after every
 * deploy. Can be wired to a Vercel cron (every 6h) or invoked manually.
 *
 * Run: `npx tsx scripts/ops/warm_cache.ts`
 *      `npx tsx scripts/ops/warm_cache.ts --base https://www.marginatlas.com`
 *
 * Honors the 600MB RAM cap (D-055); peak observed under 30MB.
 */
const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const BASE = arg("--base", "https://www.marginatlas.com");
const CONCURRENCY = parseInt(arg("--concurrency", "3"), 10);

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 marginatlas-cache-warmer",
  "Accept-Language": "en-US,en;q=0.9",
};

// Hand-curated high-traffic URL set. Edge cache holds 6h per URL.
const URLS = [
  // Top-level pages
  "/",
  "/world",
  "/browse",
  "/industries",
  "/sectors",
  "/pricing",
  "/about-data",
  "/coverage",
  "/blog",
  // Top country landings
  "/us", "/gb", "/de", "/fr", "/it", "/es", "/jp", "/br", "/mx", "/ca",
  "/au", "/nl", "/in", "/cn", "/ru", "/pl", "/pt", "/be", "/ch", "/at",
  "/se", "/no", "/dk", "/fi", "/ie",
  // Top sector landings
  "/sectors/food_drink",
  "/sectors/retail_shops",
  "/sectors/beauty_wellness",
  "/sectors/professional_services",
  "/sectors/software_tech",
  "/sectors/trades_home",
  "/sectors/hospitality",
  "/sectors/health_clinics",
  "/sectors/transport_small",
  "/sectors/creative_media",
  // Top industries
  "/industries/restaurants",
  "/industries/legal-services",
  "/industries/software-development",
  "/industries/hotels-lodging",
  "/industries/management-consulting",
  "/industries/auto-repair-shops",
  "/industries/real-estate-agencies",
  "/industries/cafes-coffee-shops",
  "/industries/hairdressers-beauty",
  "/industries/grocery-stores",
  // High-traffic benchmark cells
  "/us/california/restaurants",
  "/us/new-york/legal-services",
  "/us/texas/auto-repair-shops",
  "/us/florida/hairdressers-beauty",
  "/us/california/software-development",
  "/us/us-06-037/restaurants",
  "/us/us-36-061/real-estate-agencies",
  "/gb/gb/legal-services",
  "/de/de21/fabricated-metal-mfg",
  "/fr/fr101/restaurants",
  "/fr/fr101/jewelry-stores",
  "/it/itc4c/clothing-stores",
  "/it/itc4c/restaurants",
  "/es/es511/restaurants",
  "/jp/jp-13000/restaurants",
  "/mx/mx-roo/hotels-lodging",
  "/br/br-sp/restaurants",
  // API snapshots (cached, fill them too)
  "/api/popular-cell-snapshot",
  "/api/cell-snapshot?country=us&geo=california&industry=restaurants",
  "/api/cell-lookup?country=US&industry=restaurants&region=california",
];

async function probe(path: string): Promise<{ path: string; ms: number; status: number }> {
  const start = Date.now();
  let status = 0;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    const res = await fetch(BASE.replace(/\/$/, "") + path, {
      headers: HEADERS,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    status = res.status;
    // Drain the body so Vercel writes the full response into the CDN.
    await res.text();
  } catch {
    status = 0;
  }
  return { path, ms: Date.now() - start, status };
}

async function main() {
  console.log(`Warming ${URLS.length} URLs against ${BASE} (concurrency ${CONCURRENCY})…`);
  let i = 0;
  let done = 0;
  const results: Array<{ path: string; ms: number; status: number }> = [];
  async function worker() {
    while (i < URLS.length) {
      const idx = i++;
      const r = await probe(URLS[idx]);
      results[idx] = r;
      done++;
      const icon = r.status >= 200 && r.status < 400 ? "✓" : "✗";
      console.log(`  [${done}/${URLS.length}] ${icon} ${r.status} ${r.ms}ms ${r.path}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const ok = results.filter((r) => r.status >= 200 && r.status < 400);
  const slow = ok.filter((r) => r.ms > 2000);
  console.log("\n=== Summary ===");
  console.log(`  ok: ${ok.length} / ${URLS.length}`);
  console.log(`  slow (>2s): ${slow.length}`);
  console.log(`  avg ms: ${Math.round(ok.reduce((s, r) => s + r.ms, 0) / Math.max(ok.length, 1))}`);
}

main();
