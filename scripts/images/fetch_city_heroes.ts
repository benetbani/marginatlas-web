/**
 * Pre-fetch one hero image per Tier 1+2 city from Unsplash + cache
 * the URL + attribution to data/images/city_heroes_v1.json.
 *
 * Idea #1 of the reformation plan: every cell page in a Tier 1+2 city
 * gets a wide cinematic hero image at the top, duotone-tinted to
 * match Atlas amber. The image is fetched ONCE at build time, never
 * at request time.
 *
 * Unsplash's terms require:
 *   - photographer credit visible
 *   - hyperlink to their Unsplash profile
 *   - "on Unsplash" wording
 *   - a download tracking ping per "page view" (we ping when the cache
 *     is built, not on every visit — within Unsplash's guidance)
 *
 * Honors 600 MB RAM cap — fetches one city at a time.
 *
 * Run: `npx tsx scripts/images/fetch_city_heroes.ts`
 *      `npx tsx scripts/images/fetch_city_heroes.ts --tier 1`  (skip Tier 2)
 *      `npx tsx scripts/images/fetch_city_heroes.ts --dry-run`
 */
import { config } from "dotenv";
import { resolve, join } from "node:path";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });

export {}; // module marker

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!UNSPLASH_KEY) {
  console.error("UNSPLASH_ACCESS_KEY missing in .env.local");
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
function arg(name: string, def: string | null): string | null {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const MAX_TIER = parseInt(arg("--tier", "2") || "2", 10);

const ROOT = resolve(process.cwd());
const CITIES_PATH = join(ROOT, "data/cities/city_list_v1.json");
const OUT_PATH = join(ROOT, "data/images/city_heroes_v1.json");

type CityEntry = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
};

type Hero = {
  city_slug: string;
  city_name: string;
  iso2: string;
  image_url_full: string;       // large
  image_url_regular: string;    // 1080 wide
  image_url_small: string;      // 400 wide
  image_url_thumb: string;      // 200 wide
  blur_hash?: string;
  alt: string;
  photographer_name: string;
  photographer_username: string;
  photographer_url: string;
  unsplash_url: string;
  download_location: string;     // for tracking ping
  fetched_at: string;
};

async function searchUnsplash(query: string): Promise<unknown | null> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res.ok) {
      console.error(`  Unsplash HTTP ${res.status} for query "${query}"`);
      return null;
    }
    const json = (await res.json()) as { results?: unknown[] };
    if (!json.results || json.results.length === 0) return null;
    return json.results[0];
  } catch (e) {
    console.error(`  Unsplash error: ${(e as Error).message}`);
    return null;
  }
}

async function trackDownload(downloadLocation: string): Promise<void> {
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
  } catch {
    // best-effort; don't block the script
  }
}

function unsplashToHero(city: CityEntry, photo: unknown): Hero | null {
  const p = photo as Record<string, unknown>;
  if (!p?.urls) return null;
  const urls = p.urls as Record<string, string>;
  const user = (p.user as Record<string, unknown>) || {};
  const userLinks = (user.links as Record<string, string>) || {};
  const links = (p.links as Record<string, string>) || {};
  return {
    city_slug: city.slug,
    city_name: city.name,
    iso2: city.iso2,
    image_url_full: urls.full || urls.raw,
    image_url_regular: urls.regular,
    image_url_small: urls.small,
    image_url_thumb: urls.thumb,
    blur_hash: (p.blur_hash as string) || undefined,
    alt: (p.alt_description as string) || (p.description as string) || `${city.name} cityscape`,
    photographer_name: (user.name as string) || (user.username as string) || "Unknown",
    photographer_username: (user.username as string) || "",
    photographer_url: userLinks.html || `https://unsplash.com/`,
    unsplash_url: links.html || "",
    download_location: links.download_location || "",
    fetched_at: new Date().toISOString(),
  };
}

async function main() {
  if (!existsSync(CITIES_PATH)) {
    console.error(`City list not found: ${CITIES_PATH}`);
    process.exit(1);
  }
  const cityList = JSON.parse(readFileSync(CITIES_PATH, "utf-8")) as {
    cities: CityEntry[];
  };
  const cities = cityList.cities.filter((c) => c.tier <= MAX_TIER);
  console.log(`Fetching heroes for ${cities.length} Tier ${MAX_TIER} cities...\n`);

  // Load any existing cache so we don't refetch already-cached cities.
  const existing: Record<string, Hero> = {};
  if (existsSync(OUT_PATH)) {
    try {
      const old = JSON.parse(readFileSync(OUT_PATH, "utf-8")) as {
        heroes?: Hero[];
      };
      for (const h of old.heroes || []) existing[h.city_slug] = h;
    } catch {
      // start fresh
    }
  }

  const heroes: Hero[] = [];
  let fetched = 0;
  let cached = 0;
  let failed = 0;

  for (let i = 0; i < cities.length; i++) {
    const c = cities[i];
    process.stdout.write(`  [${i + 1}/${cities.length}] ${c.name}, ${c.iso2}... `);

    if (existing[c.slug]) {
      console.log("cached");
      heroes.push(existing[c.slug]);
      cached++;
      continue;
    }

    if (DRY_RUN) {
      console.log("would fetch (dry-run)");
      continue;
    }

    const photo = await searchUnsplash(`${c.name} ${c.iso2} city`);
    const fallback = photo ? null : await searchUnsplash(`${c.name} skyline`);
    const winner = photo || fallback;
    if (!winner) {
      console.log("no result");
      failed++;
      continue;
    }
    const hero = unsplashToHero(c, winner);
    if (!hero) {
      console.log("parse error");
      failed++;
      continue;
    }
    heroes.push(hero);
    fetched++;
    console.log(`fetched (${hero.photographer_name})`);

    // Ping download_location per Unsplash terms
    if (hero.download_location) {
      void trackDownload(hero.download_location);
    }

    // Pace at ~1 req/sec to stay friendly with Unsplash
    await new Promise((res) => setTimeout(res, 1000));
  }

  mkdirSync(join(ROOT, "data", "images"), { recursive: true });
  const out = {
    generated_at: new Date().toISOString(),
    source: "Unsplash API",
    total: heroes.length,
    heroes,
  };
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

  console.log(`\nDone. fetched ${fetched}, cached ${cached}, failed ${failed}`);
  console.log(`→ ${OUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
