/**
 * Sanity Section 7 - site-wide hero image fill (cities + countries).
 *
 * Reads the canonical city list (data/cities/city_list_v1.json) and the
 * full set of cities-covered ISO2 country codes. Computes the missing-
 * heroes list dynamically, then fetches one hero image per missing
 * entry from Unsplash (preferred) with Pexels as a fallback. Falls
 * back to a pattern-card hero descriptor for any entry where no good
 * editorial image is found, so no city or country is ever visually
 * blank downstream.
 *
 * Memory + rate hygiene:
 *   - Streams URL fetches; never buffers binary image bodies.
 *     (Image URLs are stored, not downloaded.)
 *   - Batches of 10 with 10s sleep between batches.
 *   - Samples process.memoryUsage() every batch; if RSS > 400 MB it
 *     flushes the partial manifest to disk and exits with code 2 so a
 *     supervisor can restart the process.
 *   - Caps Unsplash API calls at <= 60/minute (free-tier limit).
 *
 * Outputs:
 *   - data/images/city_heroes_v1.json   (existing schema, appended to)
 *   - data/images/country_heroes_v1.json (new file, same shape)
 *
 * Run:
 *   `npx tsx scripts/images/import_unsplash.ts`
 *   `npx tsx scripts/images/import_unsplash.ts --dry-run`
 *   `npx tsx scripts/images/import_unsplash.ts --only cities`
 *   `npx tsx scripts/images/import_unsplash.ts --only countries`
 *   `npx tsx scripts/images/import_unsplash.ts --limit 30`
 */
import { config } from "dotenv";
import { resolve, join } from "node:path";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
config({ path: resolve(process.cwd(), ".env.local") });

export {}; // module marker

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

if (!UNSPLASH_KEY && !PEXELS_KEY) {
  console.error(
    "ESCALATION: Neither UNSPLASH_ACCESS_KEY nor PEXELS_API_KEY found in .env.local. Cannot proceed.",
  );
  process.exit(1);
}
if (!UNSPLASH_KEY) {
  console.warn("UNSPLASH_ACCESS_KEY missing; will use Pexels only.");
}
if (!PEXELS_KEY) {
  console.warn("PEXELS_API_KEY missing; Unsplash only (no fallback).");
}

// ---------- args ----------
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
function arg(name: string, def: string | null): string | null {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
}
const ONLY = arg("--only", "both"); // both | cities | countries
const LIMIT = parseInt(arg("--limit", "0") || "0", 10); // 0 = no cap

// ---------- paths ----------
const ROOT = resolve(process.cwd());
const CITIES_PATH = join(ROOT, "data/cities/city_list_v1.json");
const CITY_OUT = join(ROOT, "data/images/city_heroes_v1.json");
const COUNTRY_OUT = join(ROOT, "data/images/country_heroes_v1.json");

// ---------- types ----------
type CityEntry = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
};

type Hero = {
  // Discriminator: real photo vs. pattern-card fallback
  variant: "photo" | "pattern";
  slug: string;
  name: string;
  iso2: string;
  image_url_full: string;
  image_url_regular: string;
  image_url_small: string;
  image_url_thumb: string;
  blur_hash?: string;
  alt: string;
  photographer_name: string;
  photographer_username: string;
  photographer_url: string;
  source: "unsplash" | "pexels" | "pattern";
  source_url: string;
  download_location: string;
  fetched_at: string;
};

type CityHeroRecord = Hero & { city_slug: string; city_name: string };
type CountryHeroRecord = Hero & { country_iso2: string; country_name: string };

// ---------- rate limiter ----------
class RateLimiter {
  private timestamps: number[] = [];
  constructor(private maxPerMinute: number) {}
  async wait(): Promise<void> {
    const now = Date.now();
    // Drop entries older than 60s
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000);
    if (this.timestamps.length >= this.maxPerMinute) {
      const oldest = this.timestamps[0];
      const sleep = Math.max(0, 60_000 - (now - oldest)) + 100;
      console.log(
        `    [rate] capping at ${this.maxPerMinute}/min, sleeping ${Math.round(sleep / 1000)}s`,
      );
      await new Promise((r) => setTimeout(r, sleep));
    }
    this.timestamps.push(Date.now());
  }
}

const unsplashLimiter = new RateLimiter(55); // a bit under 60 for safety

// Unsplash demo tier is 50 req/hr. Once we see a 403 we exhaust the
// budget for the run and skip directly to Pexels for the remainder so
// we don't waste 4 calls per city before falling through.
let unsplashExhausted = false;

// ---------- API clients ----------
async function searchUnsplash(query: string): Promise<{
  photo: unknown;
  source: "unsplash";
} | null> {
  if (!UNSPLASH_KEY) return null;
  if (unsplashExhausted) return null;
  await unsplashLimiter.wait();
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape&content_filter=high`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      if (res.status === 403) {
        if (!unsplashExhausted) {
          console.error(
            `    [unsplash] HTTP 403 - demo-tier rate limit exhausted; falling back to Pexels for the rest of this run.`,
          );
        }
        unsplashExhausted = true;
      } else {
        console.error(`    [unsplash] HTTP ${res.status} for "${query}"`);
      }
      return null;
    }
    const json = (await res.json()) as { results?: unknown[] };
    if (!json.results || json.results.length === 0) return null;
    return { photo: json.results[0], source: "unsplash" };
  } catch (e) {
    console.error(`    [unsplash] error: ${(e as Error).message}`);
    return null;
  }
}

async function searchPexels(query: string): Promise<{
  photo: unknown;
  source: "pexels";
} | null> {
  if (!PEXELS_KEY) return null;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error(`    [pexels] HTTP ${res.status} for "${query}"`);
      return null;
    }
    const json = (await res.json()) as { photos?: unknown[] };
    if (!json.photos || json.photos.length === 0) return null;
    return { photo: json.photos[0], source: "pexels" };
  } catch (e) {
    console.error(`    [pexels] error: ${(e as Error).message}`);
    return null;
  }
}

async function trackUnsplashDownload(downloadLocation: string): Promise<void> {
  if (!UNSPLASH_KEY || !downloadLocation) return;
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    // best-effort
  }
}

// ---------- conversion ----------
function unsplashToHero(
  slug: string,
  name: string,
  iso2: string,
  photo: unknown,
): Hero | null {
  const p = photo as Record<string, unknown>;
  if (!p?.urls) return null;
  const urls = p.urls as Record<string, string>;
  const user = (p.user as Record<string, unknown>) || {};
  const userLinks = (user.links as Record<string, string>) || {};
  const links = (p.links as Record<string, string>) || {};
  return {
    variant: "photo",
    slug,
    name,
    iso2,
    image_url_full: urls.full || urls.raw || "",
    image_url_regular: urls.regular || "",
    image_url_small: urls.small || "",
    image_url_thumb: urls.thumb || "",
    blur_hash: (p.blur_hash as string) || undefined,
    alt:
      (p.alt_description as string) ||
      (p.description as string) ||
      `${name} cityscape`,
    photographer_name:
      (user.name as string) || (user.username as string) || "Unknown",
    photographer_username: (user.username as string) || "",
    photographer_url: userLinks.html || "https://unsplash.com/",
    source: "unsplash",
    source_url: links.html || "",
    download_location: links.download_location || "",
    fetched_at: new Date().toISOString(),
  };
}

function pexelsToHero(
  slug: string,
  name: string,
  iso2: string,
  photo: unknown,
): Hero | null {
  const p = photo as Record<string, unknown>;
  const src = (p.src as Record<string, string>) || {};
  if (!src.large && !src.original) return null;
  const photographerName = (p.photographer as string) || "Unknown";
  const photographerUrl = (p.photographer_url as string) || "https://pexels.com/";
  return {
    variant: "photo",
    slug,
    name,
    iso2,
    image_url_full: src.original || src.large2x || src.large || "",
    image_url_regular: src.large2x || src.large || src.medium || "",
    image_url_small: src.medium || src.small || "",
    image_url_thumb: src.tiny || src.small || "",
    blur_hash: undefined,
    alt: (p.alt as string) || `${name} cityscape`,
    photographer_name: photographerName,
    photographer_username: photographerName,
    photographer_url: photographerUrl,
    source: "pexels",
    source_url: (p.url as string) || "",
    download_location: "",
    fetched_at: new Date().toISOString(),
  };
}

/**
 * Pattern-card fallback: a deterministic gradient placeholder built from
 * the slug. Lives entirely client-side via the variant=pattern flag so
 * downstream renderers can swap in their existing pattern SVG component
 * without a network image.
 */
function patternHero(slug: string, name: string, iso2: string): Hero {
  return {
    variant: "pattern",
    slug,
    name,
    iso2,
    image_url_full: "",
    image_url_regular: "",
    image_url_small: "",
    image_url_thumb: "",
    alt: `${name} pattern card`,
    photographer_name: "",
    photographer_username: "",
    photographer_url: "",
    source: "pattern",
    source_url: "",
    download_location: "",
    fetched_at: new Date().toISOString(),
  };
}

// ---------- query builders ----------
function cityQueries(c: CityEntry): string[] {
  return [
    `${c.name} ${c.iso2} skyline`,
    `${c.name} cityscape`,
    `${c.name} architecture`,
    `${c.name} city`,
  ];
}

function countryQueries(iso2: string, name: string): string[] {
  return [
    `${name} landscape`,
    `${name} landmark`,
    `${name} skyline`,
    `${name} architecture`,
  ];
}

// ---------- hero resolver ----------
async function resolveCityHero(c: CityEntry): Promise<Hero> {
  for (const q of cityQueries(c)) {
    const u = await searchUnsplash(q);
    if (u) {
      const h = unsplashToHero(c.slug, c.name, c.iso2, u.photo);
      if (h) {
        if (h.download_location) void trackUnsplashDownload(h.download_location);
        return h;
      }
    }
  }
  // Pexels fallback
  for (const q of cityQueries(c)) {
    const p = await searchPexels(q);
    if (p) {
      const h = pexelsToHero(c.slug, c.name, c.iso2, p.photo);
      if (h) return h;
    }
  }
  // Pattern fallback so the city is never visually blank.
  return patternHero(c.slug, c.name, c.iso2);
}

async function resolveCountryHero(iso2: string, name: string): Promise<Hero> {
  for (const q of countryQueries(iso2, name)) {
    const u = await searchUnsplash(q);
    if (u) {
      const h = unsplashToHero(iso2, name, iso2, u.photo);
      if (h) {
        if (h.download_location) void trackUnsplashDownload(h.download_location);
        return h;
      }
    }
  }
  for (const q of countryQueries(iso2, name)) {
    const p = await searchPexels(q);
    if (p) {
      const h = pexelsToHero(iso2, name, iso2, p.photo);
      if (h) return h;
    }
  }
  return patternHero(iso2, name, iso2);
}

// ---------- memory guard ----------
function memMB(): number {
  return process.memoryUsage().rss / 1024 / 1024;
}

function logMem(label: string): void {
  const rss = memMB();
  const heap = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(
    `    [mem] ${label}: rss=${rss.toFixed(0)}MB heap=${heap.toFixed(0)}MB`,
  );
}

// ---------- minimal ISO2 -> name map for country pass ----------
// Only used for query building; we read names from existing manifests if available.
const ISO2_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  PT: "Portugal",
  PL: "Poland",
  CZ: "Czechia",
  HU: "Hungary",
  GR: "Greece",
  MC: "Monaco",
  LI: "Liechtenstein",
  JP: "Japan",
  CN: "China",
  KR: "South Korea",
  TW: "Taiwan",
  HK: "Hong Kong",
  SG: "Singapore",
  IN: "India",
  ID: "Indonesia",
  PH: "Philippines",
  TH: "Thailand",
  VN: "Vietnam",
  MY: "Malaysia",
  BD: "Bangladesh",
  PK: "Pakistan",
  LK: "Sri Lanka",
  KZ: "Kazakhstan",
  MN: "Mongolia",
  NP: "Nepal",
  MM: "Myanmar",
  KH: "Cambodia",
  LA: "Laos",
  BR: "Brazil",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  UY: "Uruguay",
  VE: "Venezuela",
  EC: "Ecuador",
  ZA: "South Africa",
  NG: "Nigeria",
  EG: "Egypt",
  KE: "Kenya",
  MA: "Morocco",
  GH: "Ghana",
  ET: "Ethiopia",
  TZ: "Tanzania",
  SN: "Senegal",
  TN: "Tunisia",
  CI: "Cote d'Ivoire",
  AU: "Australia",
  NZ: "New Zealand",
  FJ: "Fiji",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  QA: "Qatar",
  KW: "Kuwait",
  BH: "Bahrain",
  IL: "Israel",
  JO: "Jordan",
  LB: "Lebanon",
  IR: "Iran",
};

// ---------- driver ----------
async function main() {
  if (!existsSync(CITIES_PATH)) {
    console.error(`City list not found: ${CITIES_PATH}`);
    process.exit(1);
  }
  // The city_list_v1.json file shape changed during the §2 sweep (was
  // {cities: [...]} with a _README header, now a bare array). Accept both.
  const rawCities = JSON.parse(readFileSync(CITIES_PATH, "utf-8")) as
    | CityEntry[]
    | { cities: CityEntry[] };
  const cityList: { cities: CityEntry[] } = Array.isArray(rawCities)
    ? { cities: rawCities }
    : rawCities;

  // ---------- CITIES ----------
  let cityHeroes: CityHeroRecord[] = [];
  if (existsSync(CITY_OUT)) {
    try {
      const old = JSON.parse(readFileSync(CITY_OUT, "utf-8")) as {
        heroes?: Array<Partial<CityHeroRecord> & { city_slug: string; city_name: string; iso2: string }>;
      };
      // Normalize old entries (variant may be missing on legacy records)
      cityHeroes = (old.heroes || []).map((h) => ({
        variant: (h.variant as "photo" | "pattern") || "photo",
        slug: h.city_slug,
        name: h.city_name,
        iso2: h.iso2,
        image_url_full: h.image_url_full || "",
        image_url_regular: h.image_url_regular || "",
        image_url_small: h.image_url_small || "",
        image_url_thumb: h.image_url_thumb || "",
        blur_hash: h.blur_hash,
        alt: h.alt || "",
        photographer_name: h.photographer_name || "",
        photographer_username: h.photographer_username || "",
        photographer_url: h.photographer_url || "",
        source: (h.source as "unsplash" | "pexels" | "pattern") || "unsplash",
        source_url: h.source_url || (h as Record<string, string>).unsplash_url || "",
        download_location: h.download_location || "",
        fetched_at: h.fetched_at || new Date().toISOString(),
        city_slug: h.city_slug,
        city_name: h.city_name,
      }));
    } catch {
      /* fresh */
    }
  }
  const cityCached = new Set(cityHeroes.map((h) => h.city_slug));

  const missingCities = cityList.cities.filter((c) => !cityCached.has(c.slug));
  const targetCities = LIMIT > 0 ? missingCities.slice(0, LIMIT) : missingCities;

  const doCities = ONLY === "both" || ONLY === "cities";
  const doCountries = ONLY === "both" || ONLY === "countries";

  let citiesFilled = 0;
  let citiesPattern = 0;

  if (doCities) {
    console.log(
      `\n=== CITIES === ${missingCities.length} missing, will process ${targetCities.length}`,
    );
    const BATCH = 10;
    for (let i = 0; i < targetCities.length; i += BATCH) {
      const batch = targetCities.slice(i, i + BATCH);
      console.log(
        `\nBatch ${Math.floor(i / BATCH) + 1}/${Math.ceil(targetCities.length / BATCH)}: ${batch.map((c) => c.slug).join(", ")}`,
      );
      for (const c of batch) {
        process.stdout.write(`  ${c.name}, ${c.iso2}... `);
        if (DRY_RUN) {
          console.log("would fetch (dry-run)");
          continue;
        }
        const hero = await resolveCityHero(c);
        cityHeroes.push({
          ...hero,
          city_slug: c.slug,
          city_name: c.name,
        });
        if (hero.variant === "pattern") {
          citiesPattern++;
          console.log(`pattern fallback`);
        } else {
          citiesFilled++;
          console.log(`${hero.source} (${hero.photographer_name})`);
        }
      }

      // Flush each batch
      flushCity(cityHeroes);
      logMem(`after batch ${Math.floor(i / BATCH) + 1}`);

      // Memory cap check (RSS) - flush + exit so a supervisor can restart fresh
      if (memMB() > 400) {
        console.error(
          `[mem] RSS over 400MB cap (${memMB().toFixed(0)}MB) - flushed; exit 2 for supervisor restart.`,
        );
        flushCity(cityHeroes);
        process.exit(2);
      }

      // Inter-batch sleep
      if (i + BATCH < targetCities.length) {
        console.log("  [sleep] 10s between batches...");
        await new Promise((r) => setTimeout(r, 10_000));
      }
    }
    flushCity(cityHeroes);
  }

  // ---------- COUNTRIES ----------
  const allCountryIso2 = Array.from(new Set(cityList.cities.map((c) => c.iso2)));

  let countryHeroes: CountryHeroRecord[] = [];
  if (existsSync(COUNTRY_OUT)) {
    try {
      const old = JSON.parse(readFileSync(COUNTRY_OUT, "utf-8")) as {
        heroes?: CountryHeroRecord[];
      };
      countryHeroes = old.heroes || [];
    } catch {
      /* fresh */
    }
  }
  const countryCached = new Set(countryHeroes.map((h) => h.country_iso2));
  const missingCountries = allCountryIso2.filter((iso) => !countryCached.has(iso));
  const targetCountries =
    LIMIT > 0 ? missingCountries.slice(0, LIMIT) : missingCountries;

  let countriesFilled = 0;
  let countriesPattern = 0;

  if (doCountries) {
    console.log(
      `\n=== COUNTRIES === ${missingCountries.length} missing, will process ${targetCountries.length}`,
    );
    const BATCH = 10;
    for (let i = 0; i < targetCountries.length; i += BATCH) {
      const batch = targetCountries.slice(i, i + BATCH);
      console.log(
        `\nBatch ${Math.floor(i / BATCH) + 1}/${Math.ceil(targetCountries.length / BATCH)}: ${batch.join(", ")}`,
      );
      for (const iso2 of batch) {
        const name = ISO2_NAMES[iso2] || iso2;
        process.stdout.write(`  ${name} (${iso2})... `);
        if (DRY_RUN) {
          console.log("would fetch (dry-run)");
          continue;
        }
        const hero = await resolveCountryHero(iso2, name);
        countryHeroes.push({
          ...hero,
          country_iso2: iso2,
          country_name: name,
        });
        if (hero.variant === "pattern") {
          countriesPattern++;
          console.log(`pattern fallback`);
        } else {
          countriesFilled++;
          console.log(`${hero.source} (${hero.photographer_name})`);
        }
      }

      flushCountry(countryHeroes);
      logMem(`after batch ${Math.floor(i / BATCH) + 1}`);

      if (memMB() > 400) {
        console.error(
          `[mem] RSS over 400MB cap (${memMB().toFixed(0)}MB) - flushed; exit 2 for supervisor restart.`,
        );
        flushCountry(countryHeroes);
        process.exit(2);
      }

      if (i + BATCH < targetCountries.length) {
        console.log("  [sleep] 10s between batches...");
        await new Promise((r) => setTimeout(r, 10_000));
      }
    }
    flushCountry(countryHeroes);
  }

  // ---------- summary ----------
  console.log("\n=== SUMMARY ===");
  console.log(`Cities filled (real photo): ${citiesFilled}`);
  console.log(`Cities filled (pattern fallback): ${citiesPattern}`);
  console.log(`Countries filled (real photo): ${countriesFilled}`);
  console.log(`Countries filled (pattern fallback): ${countriesPattern}`);
  console.log(`Peak RSS: ${memMB().toFixed(0)}MB`);
  console.log(`City hero file: ${CITY_OUT}`);
  console.log(`Country hero file: ${COUNTRY_OUT}`);
}

function flushCity(heroes: CityHeroRecord[]): void {
  mkdirSync(join(ROOT, "data", "images"), { recursive: true });
  const out = {
    generated_at: new Date().toISOString(),
    source: "Unsplash API + Pexels (fallback) + pattern (last-resort)",
    total: heroes.length,
    heroes,
  };
  writeFileSync(CITY_OUT, JSON.stringify(out, null, 2));
}

function flushCountry(heroes: CountryHeroRecord[]): void {
  mkdirSync(join(ROOT, "data", "images"), { recursive: true });
  const out = {
    generated_at: new Date().toISOString(),
    source: "Unsplash API + Pexels (fallback) + pattern (last-resort)",
    total: heroes.length,
    heroes,
  };
  writeFileSync(COUNTRY_OUT, JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
