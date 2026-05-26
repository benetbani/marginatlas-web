/**
 * city_tier.ts — resolve a geo slug to its urban-hierarchy tier.
 *
 * data/cities/city_list_v1.json classifies each of the 252 covered
 * cities into tier 1/2/3:
 *   - tier 1: top 20 mega-metros (NYC, London, Tokyo, Paris, Singapore,
 *     Hong Kong, San Francisco, etc.)
 *   - tier 2: next 50 major metros (Berlin, Madrid, São Paulo, Mumbai)
 *   - tier 3: remaining ~130 cities + wealth-concentrated micros
 *
 * Used by the breakeven engine to apply AOV city-tier multipliers.
 * Returns null when the slug isn't a known city (e.g. a state slug
 * like "california" or a region slug like "lombardia").
 *
 * 2026-05-26.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";

type CityEntry = {
  slug: string;
  tier?: number;
};

const CITIES = (cityListJson as { cities: CityEntry[] }).cities;
const TIER_BY_SLUG: Map<string, 1 | 2 | 3> = (() => {
  const m = new Map<string, 1 | 2 | 3>();
  for (const c of CITIES) {
    if (!c.slug) continue;
    if (c.tier === 1 || c.tier === 2 || c.tier === 3) {
      m.set(c.slug.toLowerCase(), c.tier);
    }
  }
  return m;
})();

/**
 * Resolve a geo slug to its city tier (1/2/3) when it's a known city.
 * Returns null when the slug isn't in the city list — typically a
 * state or region slug. Callers should treat null as "no tier
 * adjustment" rather than a default.
 */
export function getCityTier(geoSlug: string | null | undefined): 1 | 2 | 3 | null {
  if (!geoSlug) return null;
  return TIER_BY_SLUG.get(geoSlug.toLowerCase()) ?? null;
}
