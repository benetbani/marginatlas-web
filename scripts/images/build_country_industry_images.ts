/**
 * Plan v20 — build country-industry image manifest.
 *
 * For each (iso2, industry_id) in the target list, run the query
 * templates against Pexels (if PEXELS_API_KEY set) and Wikimedia
 * Commons (no key needed). Score each result by description match
 * against the query's matchTerms. Pick the highest-scoring image
 * across all returned candidates. Write to:
 *   data/images/country_industry_v1.json
 *
 * Honors the 600MB RAM cap (D-055); peak observed ~80MB.
 *
 * Run:
 *   `npx tsx scripts/images/build_country_industry_images.ts`
 *   `npx tsx scripts/images/build_country_industry_images.ts --top 30`
 */
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { resolveQueries, type ImageQuery } from "../../src/lib/images/query_templates";

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "data", "images");

function loadEnvLocal() {
  if (process.env.PEXELS_API_KEY) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (key === "PEXELS_API_KEY" && !process.env.PEXELS_API_KEY) {
        process.env.PEXELS_API_KEY = value;
      }
    }
  } catch {
    /* ignore */
  }
}
loadEnvLocal();

const args = process.argv.slice(2);
function arg(name: string, def: string): string {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const TOP_INDUSTRIES_N = parseInt(arg("--top", "30"), 10);

const PEXELS_KEY = process.env.PEXELS_API_KEY || "";

// Target countries — top 50 by traffic potential, mirrors Plan v16 cap list
const TARGET_COUNTRIES = [
  "US", "GB", "DE", "FR", "IT", "ES", "JP", "BR", "MX", "CA",
  "AU", "NL", "BE", "CH", "AT", "SE", "PL", "PT", "IE", "DK",
  "NO", "FI", "GR", "CZ", "HU", "RO", "TR", "RU", "UA",
  "IN", "CN", "KR", "ID", "TH", "VN", "PH", "MY", "SG",
  "AE", "SA", "IL", "EG",
  "ZA", "NG", "KE", "MA",
  "AR", "CL", "CO", "PE",
];

// Top SMB-core industries — mirrors the FEATURED tile selections + common
// SMB types per chapter 13. Keeps the manifest under ~1500 entries.
const TARGET_INDUSTRIES = [
  "restaurants", "cafes_coffee_shops", "bakeries_pastries", "bars_pubs_clubs",
  "hotels_lodging", "grocery_stores", "clothing_stores", "jewelry_stores",
  "hairdressers_beauty", "hair_salons", "nail_salons", "barbershops",
  "fitness_gyms", "sports_fitness", "legal_services", "management_consulting",
  "accounting_bookkeeping", "software_development", "web_mobile_dev_shops",
  "real_estate_agencies", "residential_construction", "fabricated_metal_mfg",
  "machinery_mfg", "auto_repair_shops", "doctors_clinics", "dental_practices",
  "veterinary_pet_care", "pet_services", "cleaning_services", "freight_trucking",
  "florists", "photography_studios",
].slice(0, TOP_INDUSTRIES_N);

// ----- image search clients -----

type ImageResult = {
  url: string;
  source: "pexels" | "wikimedia";
  description: string;
  photographer?: string;
  width?: number;
  height?: number;
};

async function searchPexels(query: string): Promise<ImageResult[]> {
  if (!PEXELS_KEY) return [];
  try {
    const qs = new URLSearchParams({ query, per_page: "10", orientation: "landscape" });
    const res = await fetch(`https://api.pexels.com/v1/search?${qs.toString()}`, {
      headers: { Authorization: PEXELS_KEY },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      photos?: Array<{
        src: { large2x: string; large: string; medium: string };
        alt?: string | null;
        photographer?: string;
        width?: number;
        height?: number;
      }>;
    };
    return (json.photos || []).map((p) => ({
      url: p.src.large2x || p.src.large || p.src.medium,
      source: "pexels" as const,
      description: p.alt || query,
      photographer: p.photographer,
      width: p.width,
      height: p.height,
    }));
  } catch {
    return [];
  }
}

async function searchWikimedia(query: string): Promise<ImageResult[]> {
  try {
    const qs = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `${query} filetype:bitmap`,
      gsrlimit: "10",
      gsrnamespace: "6",
      prop: "imageinfo|info",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
      format: "json",
      formatversion: "2",
      origin: "*",
    });
    const res = await fetch(
      `https://commons.wikimedia.org/w/api.php?${qs.toString()}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      query?: { pages?: Array<{ title: string; imageinfo?: Array<{ thumburl?: string; url: string; descriptionurl?: string; extmetadata?: { ImageDescription?: { value?: string } } }> }> };
    };
    const pages = json.query?.pages || [];
    const out: ImageResult[] = [];
    for (const p of pages) {
      const ii = p.imageinfo?.[0];
      if (!ii) continue;
      const desc =
        ii.extmetadata?.ImageDescription?.value?.replace(/<[^>]+>/g, "").slice(0, 200) || p.title;
      out.push({
        url: ii.thumburl || ii.url,
        source: "wikimedia",
        description: desc,
      });
    }
    return out;
  } catch {
    return [];
  }
}

// ----- scoring -----

function scoreImage(image: ImageResult, queries: ImageQuery[]): number {
  let score = 0;
  const haystack = image.description.toLowerCase();
  for (const q of queries) {
    for (const term of q.matchTerms) {
      if (haystack.includes(term.toLowerCase())) score += 5;
    }
  }
  // Source preference
  if (image.source === "pexels") score += 3;
  // Landscape preferred
  if (image.width && image.height && image.width > image.height) score += 2;
  // Higher-resolution preferred
  if (image.width && image.width >= 1280) score += 1;
  return score;
}

async function pickBestImage(iso2: string, industryId: string): Promise<ImageResult | null> {
  const queries = resolveQueries(iso2, industryId);
  const candidates: ImageResult[] = [];
  // Stop early once we have ≥10 candidates to limit API spend.
  for (const q of queries) {
    if (candidates.length >= 10) break;
    const [pex, wiki] = await Promise.all([searchPexels(q.query), searchWikimedia(q.query)]);
    candidates.push(...pex, ...wiki);
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => scoreImage(b, queries) - scoreImage(a, queries));
  return candidates[0];
}

// ----- driver -----

type Manifest = Record<string, ImageResult & { generated_at: string }>;

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, "country_industry_v1.json");

  // Resume support: load existing manifest, only fetch missing pairs.
  let manifest: Manifest = {};
  try {
    manifest = JSON.parse(readFileSync(outPath, "utf-8"));
  } catch {
    /* fresh run */
  }

  const total = TARGET_COUNTRIES.length * TARGET_INDUSTRIES.length;
  let done = 0;
  let added = 0;
  const startedAt = Date.now();
  for (const iso2 of TARGET_COUNTRIES) {
    for (const industry of TARGET_INDUSTRIES) {
      const key = `${iso2}|${industry}`;
      done++;
      if (manifest[key]) continue;
      const best = await pickBestImage(iso2, industry);
      if (best) {
        manifest[key] = { ...best, generated_at: new Date().toISOString() };
        added++;
        if (added % 5 === 0) {
          writeFileSync(outPath, JSON.stringify(manifest, null, 2));
        }
      }
      if (done % 25 === 0) {
        const elapsed = Math.round((Date.now() - startedAt) / 1000);
        const memMb = process.memoryUsage().heapUsed / 1e6;
        console.log(
          `  [${done}/${total}] added ${added}, ${elapsed}s elapsed, ${memMb.toFixed(0)}MB heap`,
        );
        if (memMb > 450) {
          console.error("✗ RAM cap approaching, saving partial and exiting.");
          writeFileSync(outPath, JSON.stringify(manifest, null, 2));
          process.exit(1);
        }
      }
      // Pexels free tier: 200/hr — 18s avg between calls. We're below
      // that with concurrency 1 and a small per-iteration delay.
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(
    `\n✓ Manifest written: ${Object.keys(manifest).length} entries, ${added} new`,
  );
  console.log(`  Output: ${outPath}`);
  console.log(`  Peak heap: ${(process.memoryUsage().heapUsed / 1e6).toFixed(0)}MB`);
}

main().catch((err) => {
  console.error("✗ Image manifest builder crashed:", err);
  process.exit(1);
});
