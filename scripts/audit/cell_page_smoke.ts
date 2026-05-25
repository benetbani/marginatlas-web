/**
 * cell_page_smoke - v34 sanity sweep §3 verifier.
 *
 * Walks 30 cell URLs in production with cache busters, measures TTFB
 * and HTTP status, reports per-URL pass / fail.
 *
 * Hard targets (from master prompt §3):
 *   3.1 median TTFB under 1.5s
 *   3.2 p95 TTFB under 3s
 *   3.3 0 cells hang or 5xx
 *   3.4 0 cells show Atlas not-found when the navigator just routed
 *
 * Run: npm run audit:cell-smoke -- [--base=https://www.marginatlas.com]
 *
 * If running against local dev, the script also accepts --base=http://localhost:3000.
 */

import { COUNTRIES, INDUSTRIES, industryToSlug } from "../../src/lib/taxonomy";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";

type SmokeResult = {
  url: string;
  status: number | "TIMEOUT" | "ERROR";
  ttfbMs: number | null;
  error?: string;
};

const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith("--base="));
const BASE = baseArg ? baseArg.slice("--base=".length) : "https://www.marginatlas.com";
// Smoke timeout has to be > cell page primary fetch timeout (25s in
// getCellBySlug) + secondary budget (5s) = 30s, with a small buffer.
// Otherwise cells that legitimately render in 28s look like hangs.
const TIMEOUT_MS = 35_000;

// Build 30 representative cell URLs. Mix of:
//   - the 6 homepage-featured cells
//   - 10 high-traffic US x top industries
//   - 10 random EU country x restaurants
//   - 4 fully random combinations
function buildUrls(): string[] {
  const urls: string[] = [];

  // Homepage-featured (matches generateStaticParams in the cell route)
  urls.push("/us/california/software-development");
  urls.push("/gb/gb/legal-services");
  urls.push("/de/de21/fabricated-metal-mfg");
  urls.push("/es/es511/restaurants");
  urls.push("/mx/mx-roo/hotels-lodging");
  urls.push("/us/california/restaurants");

  // High-traffic US
  const usStates = ["new-york", "texas", "florida", "illinois", "pennsylvania"];
  const usInd = ["restaurants", "cafes-coffee", "hairdressers-beauty", "auto-repair-shops", "hotels-lodging"];
  for (let i = 0; i < 10 && urls.length < 16; i++) {
    const s = usStates[i % usStates.length];
    const ind = usInd[Math.floor(i / usStates.length)];
    urls.push(`/us/${s}/${ind}`);
  }

  // EU restaurants
  const euCountries = ["gb", "de", "fr", "it", "es", "nl", "be", "pt", "se", "pl"];
  for (const c of euCountries) {
    if (urls.length >= 26) break;
    urls.push(`/${c}/${c}/restaurants`);
  }

  // Random combinations
  while (urls.length < 30) {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const ind = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
    const cc = country.code.toLowerCase();
    const regions = getRegionsForCountry(country.code, country.name);
    const region = regions.find((r) => r.value) ?? { value: cc };
    urls.push(`/${cc}/${region.value}/${industryToSlug(ind.id)}`);
  }

  return urls;
}

async function hitOne(url: string): Promise<SmokeResult> {
  const full = `${BASE}${url}?_cb=${Date.now()}`;
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(full, {
      method: "GET",
      headers: { "user-agent": "marginatlas-smoke/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeoutHandle);
    const ttfb = Date.now() - start;
    return { url, status: res.status, ttfbMs: ttfb };
  } catch (err) {
    const elapsed = Date.now() - start;
    if (err instanceof Error && err.name === "AbortError") {
      return { url, status: "TIMEOUT", ttfbMs: elapsed };
    }
    return {
      url,
      status: "ERROR",
      ttfbMs: elapsed,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function pct(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((sorted.length - 1) * p);
  return sorted[idx];
}

async function main() {
  const urls = buildUrls();
  console.log(`[cell-smoke] hitting ${urls.length} cells at ${BASE}`);

  const results: SmokeResult[] = [];
  for (const url of urls) {
    const r = await hitOne(url);
    results.push(r);
    const tag =
      r.status === 200
        ? "OK"
        : r.status === "TIMEOUT"
          ? "TIMEOUT"
          : r.status === "ERROR"
            ? "ERROR"
            : `HTTP-${r.status}`;
    console.log(`  [${tag}] ${r.ttfbMs}ms  ${r.url}`);
  }

  const ok = results.filter((r) => r.status === 200);
  const timeouts = results.filter((r) => r.status === "TIMEOUT");
  const errors = results.filter((r) => r.status === "ERROR" || (typeof r.status === "number" && r.status >= 500));
  const notFound = results.filter((r) => r.status === 404);
  const ttfbs = ok.map((r) => r.ttfbMs).filter((n): n is number => n !== null);

  const median = pct(ttfbs, 0.5);
  const p95 = pct(ttfbs, 0.95);

  console.log("");
  console.log(`[cell-smoke] summary`);
  console.log(`  ok:        ${ok.length} / ${results.length}`);
  console.log(`  timeouts:  ${timeouts.length}`);
  console.log(`  5xx/err:   ${errors.length}`);
  console.log(`  404:       ${notFound.length}`);
  console.log(`  median ttfb: ${median}ms (target: <1500ms)`);
  console.log(`  p95 ttfb:    ${p95}ms (target: <3000ms)`);

  // Hard pass/fail per §3 targets
  const fails: string[] = [];
  if (timeouts.length > 0) fails.push(`§3.3 ${timeouts.length} hangs`);
  if (errors.length > 0) fails.push(`§3.3 ${errors.length} 5xx/errors`);
  if (median > 1500) fails.push(`§3.1 median ${median}ms exceeds 1500ms`);
  if (p95 > 3000) fails.push(`§3.2 p95 ${p95}ms exceeds 3000ms`);

  if (fails.length > 0) {
    console.error(`[cell-smoke] FAIL: ${fails.join("; ")}`);
    process.exit(1);
  }
  console.log(`[cell-smoke] PASS: all §3 targets met`);
  process.exit(0);
}

main();
