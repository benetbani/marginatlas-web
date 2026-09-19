/**
 * src/lib/spine/hood_scheme.ts
 *
 * THE NEIGHBOURHOOD PAGES' ONE READER OF THE FILES (MODEL.md 8.8; plan step
 * 35, 2026-09-19): which cities hold a spine hub and a district page, and the
 * rows every hood builder draws from. Pure and synchronous over three local
 * files, no seed and no database, so the district route's static params, the
 * city page's cards, the stories and the two copy gates all read one answer.
 *
 * THE ADMISSION GATE, unchanged from adapt_hood.ts's own (its lines 97 to
 * 108 before this step): a city is admitted when its scheme in
 * `data/cities/neighborhoods_v1.json` holds FOUR OR MORE districts that each
 * carry a curated intensity row (`data/economics/neighborhood_intensity_v1.json`,
 * keyed `<city>.<district>`) AND an authored centroid in `CENTROIDS` below,
 * which holds London's seven and nothing else. So the gate admits one city
 * today, London, with seven districts, and a district page exists for
 * exactly those seven (`/cities/london/neighborhoods/<district>`); every other
 * city's hub falls through to the legacy page and its districts have no page.
 * `CENTROIDS` moved here from adapt_hood.ts so the gate has one home; the
 * adapter imports it. The centroids draw nothing on the spine (8.8: no map);
 * they are the authored half of the gate and stay for that reason alone.
 *
 * THE ROWS, each figure with its file and field:
 *  - `slug`, `name`, `description`: `neighborhoods_v1.json`
 *    `cities.<city>.neighborhoods[]`, in the file's own order. The one-word
 *    `character` class is NOT carried: no page prints it (PART 9 clause 19,
 *    his 2026-09-07 ruling on the one-word district summaries).
 *  - `rent_mult`: `rentMultiplier(tags)` over the intensity row's `tags`
 *    against the engine's `TAG_RENT_MULTIPLIER` constant table
 *    (neighborhood_multipliers.ts), a MODEL, not a measurement (item 15),
 *    two decimals as the engine's callers hold it; `rent_clipped` says the
 *    composed value sat on the engine's rent clip (0.5 to 3.0) and is the
 *    bound, not a reading (the West End today: raw 3.10, printed 3.00).
 *  - `tourism`: `tourism_intensity`, annual visitors per resident, overnight
 *    and day-trippers (the file's `convention`), with its `year` (2023 on
 *    London's seven) and `source_quality` ("A" block-level, "B"
 *    district-level, "C" an estimate from the city tier; A or B on the seven).
 *  - `paragraph`, `skew`, `priceTier`: `neighborhood_flavor_v1.json`
 *    `neighborhoods.<city>.<district>.character_paragraph`,
 *    `.demographic_skew`, `.price_tier` (the file's five words: luxury,
 *    expensive, mid, affordable, budget). `walkability` is NEVER read here:
 *    a three-word tier reading "high" on six of seven is the founder's own
 *    named failure, and DATA-REQUIREMENTS item 66 holds the requirement for
 *    a measured score.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import { hasNeighborhoodIntensity, getNeighborhoodRow, rentMultiplier, RENT_CLIP_LO, RENT_CLIP_HI } from "@/lib/economics/neighborhood_multipliers";
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";
import { COUNTRIES } from "@/lib/taxonomy";

type City = { slug: string; name: string; iso2: string };
type Neighborhood = { slug: string; name: string; character?: string; description?: string };
type Scheme = { scheme: string; neighborhoods: Neighborhood[] };

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const SCHEMES = (neighborhoodsJson as { cities: Record<string, Scheme> }).cities;

/** The admission gate's floor: four curated districts with a centroid, or no hub and no district pages. */
export const HOOD_DISTRICTS_FLOOR = 4;

/** THE BENCHMARK TRADE the adapter reconciles its revenue reading with (the
 *  exact activity the legacy neighbourhoods page hardcodes), and the one trade
 *  door the hub's close opens on (close_rows.ts): the route slug and the word
 *  a door prints, held once so the adapter and the close cannot drift. */
export const HOOD_BENCHMARK_TRADE = { slug: "restaurants", name: "restaurants" } as const;

/** Authored macro-district centroids, the true geographic centre of each broad
 *  London district (verifiable public geography). ONLY a city present here is
 *  admitted; every other city falls through to the legacy neighbourhoods page. */
export const CENTROIDS: Record<string, Record<string, { lat: number; lng: number }>> = {
  london: {
    "city-of-london": { lat: 51.515, lng: -0.093 },
    "west-end": { lat: 51.513, lng: -0.14 },
    "south-bank": { lat: 51.505, lng: -0.116 },
    "north-london": { lat: 51.552, lng: -0.118 },
    "south-london": { lat: 51.457, lng: -0.117 },
    "east-london": { lat: 51.541, lng: -0.056 },
    "west-london": { lat: 51.499, lng: -0.205 },
  },
};

export type HoodDistrict = {
  slug: string;
  name: string;
  /** The scheme's authored description; never printed while the district holds a character paragraph (a second telling). */
  description: string | null;
  /** The engine's composed rent against the model's neutral district; modelled. */
  rent_mult: number;
  /** True when the composed rent sat on the engine's clip and is the bound, not a reading. */
  rent_clipped: boolean;
  /** Annual visitors per resident, with the row's year and source quality. */
  tourism: { value: number; year: number | null; quality: string | null } | null;
  paragraph: string | null;
  skew: string | null;
  priceTier: string | null;
};

export type HoodCity = { slug: string; name: string; iso2: string; countryName: string };

/** The city the hub is about, or null when the list does not hold the slug. */
export function hoodCity(citySlug: string): HoodCity | null {
  const city = CITIES_BY_SLUG.get(String(citySlug ?? "").trim().toLowerCase());
  if (!city) return null;
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;
  return { slug: city.slug, name: city.name, iso2: city.iso2, countryName };
}

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The admitted districts of a city in the file's order, or null when the city is not admitted (the gate above). */
export function spineHoodDistricts(citySlug: string): HoodDistrict[] | null {
  const key = String(citySlug ?? "").trim().toLowerCase();
  const scheme = SCHEMES[key];
  const centroids = CENTROIDS[key];
  if (!CITIES_BY_SLUG.has(key) || !scheme || !centroids) return null;
  const curated = (Array.isArray(scheme.neighborhoods) ? scheme.neighborhoods : []).filter(
    (n) => n && n.slug && n.name && hasNeighborhoodIntensity(key, n.slug) && centroids[n.slug],
  );
  if (curated.length < HOOD_DISTRICTS_FLOOR) return null;
  return curated.map((n) => {
    const row = getNeighborhoodRow(key, n.slug);
    const tags = row?.tags ?? [];
    const raw = rentMultiplier(tags);
    const flavor = getNeighborhoodFlavor(key, n.slug);
    const tourism = row && isNum(row.tourism_intensity) ? { value: row.tourism_intensity, year: isNum(row.year) ? row.year : null, quality: typeof row.source_quality === "string" ? row.source_quality : null } : null;
    return {
      slug: n.slug,
      name: n.name,
      description: typeof n.description === "string" && n.description.trim() ? n.description.trim() : null,
      rent_mult: +raw.toFixed(2),
      rent_clipped: raw === RENT_CLIP_LO || raw === RENT_CLIP_HI,
      tourism,
      paragraph: flavor?.character_paragraph?.trim() || null,
      skew: flavor?.demographic_skew?.trim() || null,
      priceTier: flavor?.price_tier?.trim() || null,
    };
  });
}

/** Every admitted city, for the district route's static params and the stories. */
export function spineHoodCities(): string[] {
  return Object.keys(CENTROIDS).filter((slug) => spineHoodDistricts(slug) != null);
}

/** The one district of an admitted city, or null: the route's `notFound()` reads this. */
export function spineHoodDistrict(citySlug: string, districtSlug: string): HoodDistrict | null {
  const key = String(districtSlug ?? "").trim().toLowerCase();
  return spineHoodDistricts(citySlug)?.find((d) => d.slug === key) ?? null;
}

/** The hub's URL and a district page's URL, spelled once. */
export const hoodHubHref = (citySlug: string) => `/cities/${citySlug}/neighborhoods`;
export const districtPageHref = (citySlug: string, districtSlug: string) => `${hoodHubHref(citySlug)}/${districtSlug}`;
