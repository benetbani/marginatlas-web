/**
 * src/lib/regions/world_region.ts
 *
 * The five-bucket world-region read used to group the city directory
 * (/cities). The country-level region tables in this folder
 * (regions-by-country, default_region_by_country) answer a different
 * question (a country's first-level subdivisions). This one answers the
 * directory question: which broad part of the world does a city sit in, so
 * the showcase can group Europe, Asia, Americas, Middle East and Africa, and
 * Oceania.
 *
 * The base region comes from the continent the city list already carries, so
 * the bucketing tracks the data rather than a parallel hand-list of 100-plus
 * iso2 codes that could silently drop a newly added country. Two adjustments
 * sit on top of that base:
 *
 *   - North and South America fold into one "Americas" bucket.
 *   - A small set of Middle Eastern states lift out of the Asia continent
 *     into "Middle East and Africa", which is where a reader looks for them.
 *     Africa is already in that bucket by continent.
 *
 * Pure module: a string in, a string out. No React, no data import, no
 * network. Constraint-safe by construction: no em-dashes, no source names.
 */

/** The five directory buckets, in the order the showcase renders them. */
export const WORLD_REGIONS = [
  "Europe",
  "Asia",
  "Americas",
  "Middle East and Africa",
  "Oceania",
] as const;

export type WorldRegion = (typeof WORLD_REGIONS)[number];

/**
 * Middle Eastern states the city list files under the Asia continent but a
 * reader expects under "Middle East and Africa". Africa already lands in that
 * bucket through its continent, so only the Asian-continent members are listed
 * here. Turkey is transcontinental and is grouped with the Middle East here to
 * keep that bucket whole.
 */
const MIDDLE_EAST_ISO2: ReadonlySet<string> = new Set([
  "AE", // United Arab Emirates
  "BH", // Bahrain
  "IL", // Israel
  "IQ", // Iraq
  "IR", // Iran
  "JO", // Jordan
  "KW", // Kuwait
  "LB", // Lebanon
  "OM", // Oman
  "PS", // Palestine
  "QA", // Qatar
  "SA", // Saudi Arabia
  "SY", // Syria
  "TR", // Turkey
  "YE", // Yemen
]);

/**
 * Resolve a city to its directory bucket from the continent the city list
 * stores plus its iso2 (the iso2 only decides the Middle East lift-out). The
 * continent strings in the list are "Africa", "Asia", "Europe", "North
 * America", "South America", and "Oceania".
 *
 * An unrecognised continent falls back to Asia rather than dropping the city,
 * so a future continent label never silently removes a city from the page;
 * the grouping is meant to lose nothing.
 */
export function worldRegionForCity(
  continent: string,
  iso2: string,
): WorldRegion {
  const code = iso2.toUpperCase();
  switch (continent) {
    case "Oceania":
      return "Oceania";
    case "North America":
    case "South America":
      return "Americas";
    case "Africa":
      return "Middle East and Africa";
    case "Europe":
      return "Europe";
    case "Asia":
      return MIDDLE_EAST_ISO2.has(code) ? "Middle East and Africa" : "Asia";
    default:
      return MIDDLE_EAST_ISO2.has(code) ? "Middle East and Africa" : "Asia";
  }
}
