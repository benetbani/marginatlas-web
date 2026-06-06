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
  pop_m?: number;
  cost_of_living_index?: number;
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

// Metro population (residents) by city slug. pop_m is approximate metro
// population in millions; we store it as a raw resident count so callers can
// derive per-capita density directly.
const POP_BY_SLUG: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const c of CITIES) {
    if (!c.slug) continue;
    if (typeof c.pop_m === "number" && Number.isFinite(c.pop_m) && c.pop_m > 0) {
      m.set(c.slug.toLowerCase(), c.pop_m * 1_000_000);
    }
  }
  return m;
})();

// Cost-of-living index by city slug. The city list anchors this to NYC = 100;
// a higher index is a more expensive metro, a lower one cheaper. Used to
// place-adjust the modeled startup-capital ("cost to open") figure, so the same
// business reads higher in a costly city than in a cheap one.
const COL_BY_SLUG: Map<string, number> = (() => {
  const m = new Map<string, number>();
  for (const c of CITIES) {
    if (!c.slug) continue;
    if (
      typeof c.cost_of_living_index === "number" &&
      Number.isFinite(c.cost_of_living_index) &&
      c.cost_of_living_index > 0
    ) {
      m.set(c.slug.toLowerCase(), c.cost_of_living_index);
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

/**
 * Resolve a geo slug to its metro population in residents (a raw count, not
 * millions) when it's a known city. Returns null when the slug isn't in the
 * city list (a state or region slug) or has no population on file. Callers
 * should treat null as "not a city" rather than zero.
 */
export function getCityPopulation(geoSlug: string | null | undefined): number | null {
  if (!geoSlug) return null;
  return POP_BY_SLUG.get(geoSlug.toLowerCase()) ?? null;
}

/**
 * Resolve a geo slug to its cost-of-living index (NYC = 100) when it's a known
 * city. Returns null when the slug isn't in the city list (a state or region
 * slug) or has no index on file. Callers should treat null as "no local cost
 * signal" and fall back to a country proxy rather than assume the baseline.
 */
export function getCityCostOfLivingIndex(
  geoSlug: string | null | undefined,
): number | null {
  if (!geoSlug) return null;
  return COL_BY_SLUG.get(geoSlug.toLowerCase()) ?? null;
}
