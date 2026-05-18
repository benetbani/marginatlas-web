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
  GB: {
    // London — 33 LADs from UK NOMIS (E09 prefix)
    "city-of-london": "GB-E09000001",
    "barking-and-dagenham": "GB-E09000002",
    "barnet": "GB-E09000003",
    "bexley": "GB-E09000004",
    "brent": "GB-E09000005",
    "bromley": "GB-E09000006",
    "camden": "GB-E09000007",
    "croydon": "GB-E09000008",
    "ealing": "GB-E09000009",
    "enfield": "GB-E09000010",
    "greenwich": "GB-E09000011",
    "hackney": "GB-E09000012",
    "hammersmith-and-fulham": "GB-E09000013",
    "haringey": "GB-E09000014",
    "harrow": "GB-E09000015",
    "havering": "GB-E09000016",
    "hillingdon": "GB-E09000017",
    "hounslow": "GB-E09000018",
    "islington": "GB-E09000019",
    "kensington-and-chelsea": "GB-E09000020",
    "kingston-upon-thames": "GB-E09000021",
    "lambeth": "GB-E09000022",
    "lewisham": "GB-E09000023",
    "merton": "GB-E09000024",
    "newham": "GB-E09000025",
    "redbridge": "GB-E09000026",
    "richmond-upon-thames": "GB-E09000027",
    "southwark": "GB-E09000028",
    "sutton": "GB-E09000029",
    "tower-hamlets": "GB-E09000030",
    "waltham-forest": "GB-E09000031",
    "wandsworth": "GB-E09000032",
    "westminster": "GB-E09000033",
    // City-level convenience aliases (route to the province/region)
    "london": "GB-E09000033",  // default to Westminster as city anchor
    "manchester": "GB-E08000003",
    "birmingham": "GB-E08000025",
    "edinburgh": "GB-S12000036",
    "cardiff": "GB-W06000022",
  },
  MX: {
    // CDMX alcaldías (E03=09 + INEGI municipio codes 002-017)
    "azcapotzalco": "MX-09-002",
    "coyoacan": "MX-09-003",
    "cuajimalpa": "MX-09-004",
    "gustavo-a-madero": "MX-09-005",
    "iztacalco": "MX-09-006",
    "iztapalapa": "MX-09-007",
    "magdalena-contreras": "MX-09-008",
    "milpa-alta": "MX-09-009",
    "alvaro-obregon": "MX-09-010",
    "tlahuac": "MX-09-011",
    "tlalpan": "MX-09-012",
    "xochimilco": "MX-09-013",
    "benito-juarez": "MX-09-014",
    "cuauhtemoc": "MX-09-015",
    "miguel-hidalgo": "MX-09-016",
    "venustiano-carranza": "MX-09-017",
    // City-level aliases for major Mexican metros
    "mexico-city": "MX-09",
    "cdmx": "MX-09",
    "guadalajara": "MX-14",
    "monterrey": "MX-19",
    "tijuana": "MX-02",
    "puebla": "MX-21",
  },
  DE: {
    // Major German cities → NUTS regions (no Bezirk-level data yet)
    "berlin": "DE3",
    "munich": "DE21",      // Oberbayern
    "munchen": "DE21",
    "hamburg": "DE6",
    "frankfurt": "DE7",    // Hessen broader
    "cologne": "DEA",      // Nordrhein-Westfalen broader
    "stuttgart": "DE1",    // Baden-Württemberg
  },
  ES: {
    "madrid": "ES-28",
    "barcelona": "ES-08",
    "valencia": "ES-46",
    "seville": "ES-41",
    "sevilla": "ES-41",
    "malaga": "ES-29",
    "zaragoza": "ES-50",
    "bilbao": "ES-48",
    "palma": "ES-07",
  },
  NL: {
    "amsterdam": "NL-GM0363",
    "rotterdam": "NL-GM0599",
    "the-hague": "NL-GM0518",
    "den-haag": "NL-GM0518",
    "utrecht": "NL-GM0344",
    "eindhoven": "NL-GM0772",
  },
  FR: {
    "paris": "FR10",       // Île-de-France until commune-level Sirene lands
    "lyon": "FRK2",
    "marseille": "FRL0",
    "toulouse": "FRJ2",
    "nice": "FRL0",
    "bordeaux": "FRI1",
  },
  BR: {
    "sao-paulo": "BR-CITY-sao-paulo",
    "rio-de-janeiro": "BR-CITY-rio-de-janeiro",
    "rio": "BR-CITY-rio-de-janeiro",
    "brasilia": "BR-DF",
    "salvador": "BR-BA",
    "fortaleza": "BR-CE",
    "belo-horizonte": "BR-MG",
    "curitiba": "BR-CITY-curitiba",
  },
  JP: {
    "tokyo": "JP-13000",
    "osaka": "JP-27100",
    "kyoto": "JP-26100",
    "yokohama": "JP-14100",
    "nagoya": "JP-23100",
    "fukuoka": "JP-40130",
    "sapporo": "JP-01100",
    "kobe": "JP-28100",
  },
  CA: {
    "toronto": "CA-ON",
    "vancouver": "CA-BC",
    "montreal": "CA-QC",
    "calgary": "CA-AB",
    "ottawa": "CA-ON",
    "edmonton": "CA-AB",
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
