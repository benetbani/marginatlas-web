/**
 * Country editorial anchors (Plan v15 Block 4).
 *
 * Short, character-specific commercial-cultural lines per country, copied
 * verbatim from docs/specs/2026-05-19-site-editorial-style-guide.md §4.
 *
 * Keyed by lowercase iso2. Only the 10 highest-traffic countries are
 * seeded here; the remaining 185 fall through to a generic, country-named
 * fallback until a follow-up wave imports the full set.
 */

const COUNTRY_ANCHORS: Record<string, string> = {
  us: "Entrepreneurial spirit, where small business is both a livelihood and a national identity.",
  gb: "Financial discipline and centuries of trade, now run on a smaller stage.",
  de: "Engineering temperament and a settled belief that quality is not negotiable.",
  fr: "A country that protects its small businesses the way other countries protect industries.",
  jp: "Precision, mastery, and the dignity of small craft refined over generations.",
  br: "The land of samba, of vast distances, of agribusiness and informal hustle in equal measure.",
  in: "A billion-customer interior market industrializing while still poor, with the long arc of an old civilization behind it.",
  mx: "A workshop nation tied to the United States by supply chains and family ties.",
  es: "Climate, sociability, and a tourism economy that bends almost every other industry around it.",
  it: "Family firms, regional pride, and a manufacturing culture organized around the artisan rather than the factory.",
};

/**
 * Return the editorial anchor line for a given country.
 *
 * @param iso2 ISO 3166-1 alpha-2 country code (case-insensitive).
 * @param countryName Display name used in the generic fallback.
 */
export function getCountryAnchor(iso2: string, countryName: string): string {
  const key = iso2.toLowerCase();
  const anchor = COUNTRY_ANCHORS[key];
  if (anchor) return anchor;
  return `Small-business benchmarks across ${countryName}.`;
}
