/**
 * Top-100 cities loader (Wave 2 Track M).
 *
 * Canonical list of cities to prioritise UX placement (Track N — country
 * shortcuts), neighborhood drill-down (Track O), and optional-hierarchy
 * navigation (Track Q).
 *
 * Each entry carries tier (1=global metropolis, 2=major regional, 3=secondary),
 * a stable slug used in URLs, the geo_id it maps to in regional_cells (or city
 * overlay), and a data_status flag (measured / extrapolated / missing).
 *
 * The list is "1.0.0-draft" — pending founder review per T-M.2.
 */
import top100 from "./cities/top100.json";

export type CityTier = 1 | 2 | 3;
export type CityDataStatus = "measured" | "extrapolated" | "missing";

export type CityEntry = {
  id: string;
  name: string;
  country: string;          // ISO-2
  country_name: string;
  region: string;
  region_name: string;
  tier: CityTier;
  population: number;
  slug: string;             // URL slug
  geo_id: string;           // regional_cells.geo_id (or extrapolated city overlay)
  data_status: CityDataStatus;
  neighborhood_drill: boolean;
};

type Top100Json = {
  version: string;
  anchor: string;
  review_status: string;
  cities: CityEntry[];
};

const RAW = top100 as Top100Json;

export const TOP_100_CITIES: CityEntry[] = RAW.cities;
export const TOP_100_VERSION: string = RAW.version;
export const TOP_100_REVIEW_STATUS: string = RAW.review_status;

export const TIER_1_CITIES: CityEntry[] = TOP_100_CITIES.filter((c) => c.tier === 1);
export const TIER_2_CITIES: CityEntry[] = TOP_100_CITIES.filter((c) => c.tier === 2);
export const TIER_3_CITIES: CityEntry[] = TOP_100_CITIES.filter((c) => c.tier === 3);

/** Cities indexed by ISO-2 country code (uppercased). */
export const CITIES_BY_COUNTRY: Record<string, CityEntry[]> = (() => {
  const out: Record<string, CityEntry[]> = {};
  for (const c of TOP_100_CITIES) {
    const k = c.country.toUpperCase();
    if (!out[k]) out[k] = [];
    out[k].push(c);
  }
  // Sort each country's list: tier asc, then population desc
  for (const k of Object.keys(out)) {
    out[k].sort((a, b) => a.tier - b.tier || b.population - a.population);
  }
  return out;
})();

/** Cities indexed by city.id (slug-safe identifier). */
export const CITY_BY_ID: Record<string, CityEntry> = Object.fromEntries(
  TOP_100_CITIES.map((c) => [c.id, c])
);

/** Cities indexed by geo_id (uppercased). */
export const CITY_BY_GEO_ID: Record<string, CityEntry> = Object.fromEntries(
  TOP_100_CITIES.map((c) => [c.geo_id.toUpperCase(), c])
);

/** Top cities for a country, sorted tier 1 → 3 then by population. */
export function getCitiesForCountry(iso2: string, limit?: number): CityEntry[] {
  const list = CITIES_BY_COUNTRY[iso2.toUpperCase()] || [];
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

/** Cities flagged for neighborhood drill-down (Track O). */
export const NEIGHBORHOOD_DRILL_CITIES: CityEntry[] = TOP_100_CITIES.filter(
  (c) => c.neighborhood_drill
);

/** Whether a (country, slug) combination resolves to a known city. */
export function lookupCity(country: string, slug: string): CityEntry | null {
  const c = country.toUpperCase();
  const s = slug.toLowerCase();
  for (const city of CITIES_BY_COUNTRY[c] || []) {
    if (city.slug.toLowerCase() === s || city.id === s) return city;
  }
  return null;
}

/**
 * Neighborhood / borough / ward alias map for tier-1 cities (Track O).
 * URL slug -> regional_cells geo_id.
 *
 * Friendly slugs like /us/manhattan/restaurants resolve to the underlying
 * county FIPS (US-36-061) so users don't have to know the cryptic code.
 *
 * Per Track O plan: NYC + Tokyo + London + Paris + Sao Paulo + Moscow +
 * Istanbul are the target cities. First pass ships NYC (5 boroughs from
 * US Census). London arrives natively via UK NOMIS LAD codes. Tokyo
 * wards need additional e-Stat ingest (deferred).
 */
export const NEIGHBORHOOD_ALIASES: Record<string, Record<string, string>> = {
  US: {
    // NYC boroughs (each is a NY county)
    "manhattan": "US-36-061",
    "the-bronx": "US-36-005",
    "bronx": "US-36-005",
    "brooklyn": "US-36-047",
    "queens": "US-36-081",
    "staten-island": "US-36-085",
  },
};

/**
 * Look up a neighborhood slug to its underlying regional_cells geo_id.
 * Returns null if the (country, slug) pair isn't a known neighborhood.
 */
export function lookupNeighborhoodGeoId(country: string, slug: string): string | null {
  const map = NEIGHBORHOOD_ALIASES[country.toUpperCase()];
  if (!map) return null;
  return map[slug.toLowerCase()] || null;
}
