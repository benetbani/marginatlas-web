/**
 * default_region_by_country - v34 sanity sweep §7.
 *
 * When the user picks a country in the navigator but does not pick a
 * region, the form needs to default to SOMETHING for the URL. Previously
 * it picked "first alphabetical region" (so US defaulted to Alabama),
 * which:
 *   a) routes the user to a low-traffic / low-quality cell, AND
 *   b) is not what the user expects when they think "the US default".
 *
 * This table maps each iso2 to the region slug we want as the default.
 * The picked region is whatever has the best data quality + the highest
 * SMB density for that country. Usually the largest economic region.
 *
 * Used by src/components/NavigatorForm.tsx submit(). If a country is
 * not in this table, fall through to first-alphabetical OR country-level
 * slug (existing behavior).
 */

export const DEFAULT_REGION_BY_COUNTRY: Record<string, string> = {
  // US: California has the deepest cell coverage and matches our hero
  // featured tile (California restaurants is the canonical Atlas page).
  US: "california",

  // UK: country-level data is the cleanest for the UK; sub-regions are
  // sparse. Same code as the iso2 lower-case (the canonical GB cell URL
  // is /gb/gb/restaurants).
  GB: "gb",

  // Germany: Berlin is the federal capital and has good SMB data.
  DE: "de30",

  // France: Ile-de-France (the Paris region) has the deepest data.
  FR: "fr10",

  // Spain: Madrid metro has the deepest data.
  ES: "es300",

  // Italy: Lombardy (Milan region) is the economic engine + best data.
  IT: "itc4",

  // Netherlands: country-level is the cleanest.
  NL: "netherlands",

  // Belgium: country-level.
  BE: "belgium",

  // Sweden: country-level.
  SE: "sweden",

  // Norway: country-level.
  NO: "norway",

  // Denmark: country-level.
  DK: "denmark",

  // Finland: country-level.
  FI: "finland",

  // Poland: country-level.
  PL: "poland",

  // Portugal: country-level (Lisbon region slugs are inconsistent).
  PT: "portugal",

  // Switzerland: country-level.
  CH: "switzerland",

  // Austria: country-level.
  AT: "austria",

  // Ireland: country-level.
  IE: "ireland",

  // Japan: country-level (Tokyo prefecture is the alternative if we
  // ever add prefecture-level cells; today country-level is the only
  // consistent option).
  JP: "japan",

  // Canada: Ontario is the largest economy + good SMB data.
  CA: "ontario",

  // Australia: New South Wales (Sydney) is the largest + best data.
  AU: "new-south-wales",

  // Mexico: CDMX (Mexico City).
  MX: "mx-cmx",

  // Brazil: São Paulo state.
  BR: "br-sp",

  // India: Maharashtra (Mumbai).
  IN: "in-mh",

  // China: country-level (subdivisions sparse in our data set today).
  CN: "china",

  // South Korea: country-level.
  KR: "south-korea",

  // Singapore: country-level (city-state, no subdivision).
  SG: "singapore",

  // Hong Kong: country-level.
  HK: "hong-kong",

  // United Arab Emirates: country-level.
  AE: "united-arab-emirates",
};

/** Get the default region slug for a country, falling back to undefined
 * (caller picks alphabetical-first or country-level slug). */
export function getDefaultRegionForCountry(iso2: string): string | undefined {
  return DEFAULT_REGION_BY_COUNTRY[iso2.toUpperCase()];
}
