/**
 * fetch_activity_images.ts — fill image coverage for ACTIVITIES from Pexels.
 *
 * The industries_manifest.json (read by src/lib/images/industry_heroes.ts) has
 * images for only ~39 of 243 activities, so most activity cards/heroes show a
 * placeholder. This appends a Pexels image record for every missing activity.
 *
 * Pexels (not Unsplash): no inline attribution required, license permits use.
 * We store only the URL + metadata, not the binary, to keep the repo lean.
 * Idempotent: skips activities already in the manifest. Resumable.
 *
 * Env: PEXELS_API_KEY (falls back to PEXELS_FALLBACK_KEY on 429).
 * Run: npx tsx scripts/images/fetch_activity_images.ts
 */
import { config } from "dotenv";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { INDUSTRIES } from "../../src/lib/taxonomy";

config({ path: resolve(process.cwd(), ".env.local") });

const KEY = process.env.PEXELS_API_KEY;
const FALLBACK = process.env.PEXELS_FALLBACK_KEY;
const MANIFEST = resolve(process.cwd(), "data/images/industries_manifest.json");

// The manifest is a DICT keyed by industry_id, each value an array of image
// records (industry_heroes.ts reads value[0]). We append a Pexels record for
// any activity whose key is absent.
type ImageRecord = {
  url: string;
  source: string;
  attribution: string;
  license: string;
  alt: string;
  width: number | null;
  height: number | null;
  query: string;
};
type Manifest = Record<string, ImageRecord[]>;

type PexelsPhoto = {
  src: { large: string; landscape: string };
  width: number;
  height: number;
  alt: string | null;
  photographer: string;
  photographer_url: string;
  url: string;
};

// Search phrase per activity. The activity name is usually a good photo query;
// append a concrete example noun when the name is abstract.
function queryFor(name: string, examples: string[]): string {
  const ex = examples[0];
  // Names like "IT services & hosting" photograph poorly; lean on an example.
  const abstract = /services|consulting|management|holding|other|misc|support|agencies|brokerage|securities|funds/i.test(
    name,
  );
  return (abstract && ex ? `${ex} ${name.split(/[&,]/)[0]}` : name)
    .replace(/&/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function search(q: string, key: string): Promise<{ photo: PexelsPhoto | null; status: number }> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) return { photo: null, status: res.status };
  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return { photo: data.photos[0] ?? null, status: 200 };
}

async function main() {
  if (!KEY) {
    console.error("PEXELS_API_KEY not set");
    process.exit(2);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf-8")) as Manifest;
  const missing = INDUSTRIES.filter((i) => !manifest[i.id] || manifest[i.id].length === 0);

  let added = 0;
  let useFallback = false;
  const log: string[] = [];
  for (const ind of missing) {
    const q = queryFor(ind.name, ind.examples ?? []);
    let { photo, status } = await search(q, useFallback && FALLBACK ? FALLBACK : KEY);
    if (status === 429 && FALLBACK && !useFallback) {
      useFallback = true;
      ({ photo, status } = await search(q, FALLBACK));
    }
    if (status === 429) {
      log.push(`${ind.id}: rate-limited, stopping`);
      break;
    }
    if (!photo) {
      log.push(`${ind.id}: no match for "${q}"`);
      continue;
    }
    manifest[ind.id] = [
      {
        url: photo.src.landscape || photo.src.large,
        source: "pexels",
        attribution: `Photo by <a href="${photo.photographer_url}">${photo.photographer}</a>`,
        license: "Pexels",
        alt: photo.alt || ind.name,
        width: photo.width ?? null,
        height: photo.height ?? null,
        query: q,
      },
    ];
    added++;
    if (added % 10 === 0) writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  const report = `added=${added} missing_before=${missing.length} total_keys=${Object.keys(manifest).length}\n${log.slice(0, 40).join("\n")}\n`;
  writeFileSync(resolve(process.cwd(), "data/images/_activity_fetch_report.txt"), report);
  console.log(report);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
