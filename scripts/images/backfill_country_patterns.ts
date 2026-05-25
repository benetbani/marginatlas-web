/**
 * Sanity §7 - last-resort pattern fallback backfill for country heroes.
 *
 * For every cities-covered ISO2 that:
 *   - is not present in data/images/country_heroes_v1.json, AND
 *   - is not present in data/images/countries_manifest.json (legacy
 *     Wikimedia fallback consulted by country_heroes.ts)
 * write a pattern-card hero entry so the country is never blank.
 *
 * Idempotent. Safe to re-run. No network calls.
 */
import { resolve, join } from "node:path";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";

const ROOT = resolve(process.cwd());
const CITIES_PATH = join(ROOT, "data/cities/city_list_v1.json");
const COUNTRY_OUT = join(ROOT, "data/images/country_heroes_v1.json");
const LEGACY_PATH = join(ROOT, "data/images/countries_manifest.json");

type CityEntry = { slug: string; name: string; iso2: string; tier: number };

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
  IQ: "Iraq",
  XK: "Kosovo",
  RU: "Russia",
  UA: "Ukraine",
  BY: "Belarus",
  MD: "Moldova",
  RS: "Serbia",
  BA: "Bosnia and Herzegovina",
  ME: "Montenegro",
  MK: "North Macedonia",
  AL: "Albania",
  HR: "Croatia",
  SI: "Slovenia",
  SK: "Slovakia",
  RO: "Romania",
  BG: "Bulgaria",
  LV: "Latvia",
  LT: "Lithuania",
  EE: "Estonia",
  CY: "Cyprus",
  MT: "Malta",
  IS: "Iceland",
  GE: "Georgia",
  AZ: "Azerbaijan",
  AM: "Armenia",
  AO: "Angola",
  OM: "Oman",
  DO: "Dominican Republic",
  PA: "Panama",
  CR: "Costa Rica",
  DZ: "Algeria",
};

function main() {
  if (!existsSync(CITIES_PATH)) {
    console.error("City list not found");
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(CITIES_PATH, "utf-8")) as
    | CityEntry[]
    | { cities: CityEntry[] };
  const cities = Array.isArray(raw) ? raw : raw.cities;
  const allIso2 = Array.from(new Set(cities.map((c) => c.iso2)));

  // Load legacy + new
  let legacy: Record<string, unknown[]> = {};
  if (existsSync(LEGACY_PATH)) {
    legacy = JSON.parse(readFileSync(LEGACY_PATH, "utf-8")) as Record<string, unknown[]>;
  }
  const legacyKeys = new Set(Object.keys(legacy).map((k) => k.toUpperCase()));

  type NewHero = {
    variant: "photo" | "pattern";
    slug?: string;
    name?: string;
    iso2?: string;
    country_iso2?: string;
    country_name?: string;
    [k: string]: unknown;
  };
  let existing: { heroes: NewHero[] } = { heroes: [] };
  if (existsSync(COUNTRY_OUT)) {
    existing = JSON.parse(readFileSync(COUNTRY_OUT, "utf-8")) as { heroes: NewHero[] };
  }
  const existingIso = new Set(
    existing.heroes.map((h) => (h.country_iso2 || h.iso2 || h.slug || "").toUpperCase()),
  );

  // Truly missing = not in legacy AND no photo entry in new file
  const newPhotoIso = new Set(
    existing.heroes
      .filter((h) => h.variant === "photo")
      .map((h) => (h.country_iso2 || h.iso2 || h.slug || "").toUpperCase()),
  );

  const trulyMissing = allIso2.filter(
    (iso) => !legacyKeys.has(iso) && !newPhotoIso.has(iso) && !existingIso.has(iso),
  );

  console.log(`Truly missing countries (need pattern entry): ${trulyMissing.length}`);
  console.log(trulyMissing.join(", "));

  let added = 0;
  for (const iso2 of trulyMissing) {
    const name = ISO2_NAMES[iso2] || iso2;
    existing.heroes.push({
      variant: "pattern",
      slug: iso2,
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
      country_iso2: iso2,
      country_name: name,
    });
    added++;
  }

  mkdirSync(join(ROOT, "data", "images"), { recursive: true });
  const out = {
    generated_at: new Date().toISOString(),
    source: "Unsplash + Pexels + Wikimedia (legacy) + pattern (last-resort)",
    total: existing.heroes.length,
    heroes: existing.heroes,
  };
  writeFileSync(COUNTRY_OUT, JSON.stringify(out, null, 2));
  console.log(`Added ${added} pattern entries. File: ${COUNTRY_OUT}`);
}

main();
