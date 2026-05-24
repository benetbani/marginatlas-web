/**
 * fetch_city_images.ts — pulls candidate city images from Unsplash
 * and Pexels into a local staging area for editorial review.
 *
 * The founder previously rejected Pexels stock photos used as
 * generic decoration (the ExploreCards section). This pipeline is
 * deliberately different:
 *
 *   1. Search is targeted (city name + a curated qualifier list:
 *      skyline, market, street, architecture). No generic queries.
 *   2. Results are STAGED locally — JSON + thumbnail URLs only.
 *      Nothing ships to the public site automatically.
 *   3. Founder reviews each city's candidates and explicitly
 *      whitelists which ones get included.
 *   4. Only whitelisted images get downloaded, optimized, and
 *      added to public/city-images/ for use on city pages.
 *
 * Required env (add to .env.local):
 *   UNSPLASH_ACCESS_KEY=   # from https://unsplash.com/developers
 *   PEXELS_API_KEY=        # from https://www.pexels.com/api/
 *
 * Both APIs are free for non-commercial / attributed use; both
 * have generous rate limits (Unsplash 50/hr demo, 5000/hr prod;
 * Pexels 200/hr free).
 *
 * Run: `npx tsx scripts/import/images/fetch_city_images.ts <city-slug>`
 *
 * Example: `npx tsx scripts/import/images/fetch_city_images.ts tokyo`
 *
 * Output: scripts/import/images/_candidates/<city>.json with the
 * shape:
 *   {
 *     city: "tokyo",
 *     fetched_at: "2026-05-24",
 *     candidates: [
 *       {
 *         id: "unsplash-XXXXX",
 *         source: "unsplash",
 *         photographer: "Name",
 *         photographer_url: "https://...",
 *         thumb_url: "...",
 *         full_url: "...",
 *         alt: "...",
 *         tags: ["skyline", "shibuya"],
 *         editorial_status: "pending"  // founder flips to "approved" / "rejected"
 *       },
 *       ...
 *     ]
 *   }
 *
 * After founder approves, run a separate `download_approved.ts`
 * (not built yet — second-stage script) to fetch full-res, optimize,
 * and place in public/city-images/<city>/<slug>.jpg.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

type Candidate = {
  id: string;
  source: "unsplash" | "pexels";
  photographer: string;
  photographer_url: string;
  thumb_url: string;
  full_url: string;
  alt: string;
  tags: string[];
  editorial_status: "pending" | "approved" | "rejected";
};

type CityCandidatePool = {
  city: string;
  fetched_at: string;
  query_qualifiers: string[];
  candidates: Candidate[];
};

const ROOT = process.cwd();
const OUT_DIR = resolve(ROOT, "scripts/import/images/_candidates");

// Per-city qualifier lists. Tightly curated; no generic "city" searches
// that pull every tourist photo. The qualifier list defines what kind
// of imagery counts as "Tokyo character" vs generic urban filler.
const QUERY_QUALIFIERS: Record<string, string[]> = {
  // Default for any city not listed below
  __default__: ["skyline", "street", "market", "architecture", "neighborhood"],

  tokyo: ["shibuya crossing", "shinjuku", "asakusa temple", "rooftop", "alley izakaya"],
  paris: ["haussmann street", "cafe terrace", "rooftop zinc", "metro entrance", "boulangerie"],
  london: ["thames bridge", "victorian street", "double-decker", "borough market", "city skyline"],
  "new-york": ["brownstone", "rooftop midtown", "deli storefront", "subway entrance", "fire escape"],
  los_angeles: ["palm street", "art deco", "venice canals", "downtown rooftop", "mural"],
  rome: ["cobblestone street", "trastevere", "espresso bar", "piazza", "scooter"],
  istanbul: ["bosphorus", "grand bazaar", "rooftop minaret", "tram", "tea house"],
  bangkok: ["street food", "tuk tuk", "river boat", "rooftop", "market alley"],
  mexico_city: ["mariachi plaza", "colonial street", "market stall", "rooftop", "taqueria"],
  dubai: ["downtown skyline", "souk", "marina", "old town", "spice market"],
};

function loadEnvLocal() {
  if (process.env.UNSPLASH_ACCESS_KEY && process.env.PEXELS_API_KEY) return;
  try {
    const text = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // ignore
  }
}

loadEnvLocal();

async function fetchUnsplash(city: string, qualifier: string): Promise<Candidate[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const q = encodeURIComponent(`${city} ${qualifier}`);
  const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=8&content_filter=high&orientation=landscape`;
  const r = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!r.ok) {
    console.warn(`  ! Unsplash ${qualifier}: ${r.status}`);
    return [];
  }
  const data = (await r.json()) as { results: Array<Record<string, unknown>> };
  return (data.results || []).slice(0, 6).map((p) => ({
    id: `unsplash-${p.id as string}`,
    source: "unsplash" as const,
    photographer: ((p.user as Record<string, unknown>)?.name as string) ?? "Unknown",
    photographer_url: ((p.user as Record<string, unknown>)?.links as Record<string, string>)?.html ?? "",
    thumb_url: ((p.urls as Record<string, string>)?.small) ?? "",
    full_url: ((p.urls as Record<string, string>)?.regular) ?? "",
    alt: ((p.alt_description as string) ?? (p.description as string) ?? qualifier) || "",
    tags: [qualifier],
    editorial_status: "pending",
  }));
}

async function fetchPexels(city: string, qualifier: string): Promise<Candidate[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];
  const q = encodeURIComponent(`${city} ${qualifier}`);
  const url = `https://api.pexels.com/v1/search?query=${q}&per_page=6&orientation=landscape`;
  const r = await fetch(url, {
    headers: { Authorization: key },
  });
  if (!r.ok) {
    console.warn(`  ! Pexels ${qualifier}: ${r.status}`);
    return [];
  }
  const data = (await r.json()) as { photos: Array<Record<string, unknown>> };
  return (data.photos || []).slice(0, 6).map((p) => ({
    id: `pexels-${p.id as number}`,
    source: "pexels" as const,
    photographer: (p.photographer as string) ?? "Unknown",
    photographer_url: (p.photographer_url as string) ?? "",
    thumb_url: ((p.src as Record<string, string>)?.medium) ?? "",
    full_url: ((p.src as Record<string, string>)?.large2x) ?? ((p.src as Record<string, string>)?.large) ?? "",
    alt: ((p.alt as string) ?? qualifier) || "",
    tags: [qualifier],
    editorial_status: "pending",
  }));
}

async function main() {
  const citySlug = process.argv[2];
  if (!citySlug) {
    console.error("\nUsage: npx tsx scripts/import/images/fetch_city_images.ts <city-slug>\n");
    console.error("Example: npx tsx scripts/import/images/fetch_city_images.ts tokyo\n");
    process.exit(1);
  }

  const cityName = citySlug.replace(/_/g, " ").replace(/-/g, " ");
  const qualifiers = QUERY_QUALIFIERS[citySlug] || QUERY_QUALIFIERS["__default__"];
  console.log(`Fetching candidates for "${cityName}" (${qualifiers.length} qualifiers)...`);

  const allCandidates: Candidate[] = [];
  for (const qualifier of qualifiers) {
    const [u, p] = await Promise.all([
      fetchUnsplash(cityName, qualifier),
      fetchPexels(cityName, qualifier),
    ]);
    console.log(`  ${qualifier}: unsplash=${u.length}, pexels=${p.length}`);
    allCandidates.push(...u, ...p);
  }

  // Dedup by id
  const seen = new Set<string>();
  const deduped = allCandidates.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  const pool: CityCandidatePool = {
    city: citySlug,
    fetched_at: new Date().toISOString().slice(0, 10),
    query_qualifiers: qualifiers,
    candidates: deduped,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, `${citySlug}.json`);
  writeFileSync(outPath, JSON.stringify(pool, null, 2), "utf-8");
  console.log(`\n✓ Wrote ${deduped.length} candidates to ${outPath.replace(ROOT, ".")}`);
  console.log(`  Review the file, set editorial_status to "approved" or "rejected" per candidate.`);
  console.log(`  Then run the second-stage download_approved.ts script (not built yet).`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
