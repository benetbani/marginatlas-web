/**
 * Reformation idea #4 — comparable-cities recommendation.
 *
 * Given a city slug, find 3 peer cities elsewhere in the world with
 * similar scale (population × GDP × wealth). The cell page renders
 * these as cards: "If you liked X's restaurants, look at Y's."
 *
 * Algorithm:
 *   - Look up the seed city in city_list_v1.json
 *   - Score every other city by similarity: weighted distance on
 *     (log_pop, log_gdp, wealth_z)
 *   - Prefer cities in a DIFFERENT country (more interesting to
 *     wander to)
 *   - Slight boost for same continent (cultural fit)
 *   - Skip Tier 3 / city-only entries when seed is Tier 1+2
 *
 * Pure synchronous JSON lookup. Zero Supabase calls. Zero RAM
 * concern.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";

type CityEntry = {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  gdp_b: number;
  wealth_z: number;
};

const CITIES = (cityListJson as { cities: CityEntry[] }).cities;
const BY_SLUG: Record<string, CityEntry> = {};
for (const c of CITIES) BY_SLUG[c.slug] = c;

function logSafe(v: number): number {
  return Math.log10(Math.max(0.01, v));
}

/**
 * Compute a similarity score between two cities. Lower score = more
 * similar. Each axis gets unit weight; same-continent bonus subtracts
 * 0.3 from the distance (favoring nearer-culture peers).
 */
function similarityDistance(a: CityEntry, b: CityEntry): number {
  const dPop = Math.abs(logSafe(a.pop_m) - logSafe(b.pop_m));
  const dGdp = Math.abs(logSafe(a.gdp_b) - logSafe(b.gdp_b));
  const dWealth = Math.abs(a.wealth_z - b.wealth_z);
  let score = dPop + dGdp + 0.5 * dWealth;
  if (a.continent === b.continent) score -= 0.3;
  if (a.iso2 === b.iso2) score += 1.5; // penalty for same country
  return score;
}

/**
 * Get the top N comparable cities for a seed city. Returns up to N
 * city entries (may be fewer if pool is small). Excludes the seed
 * itself. Falls back gracefully if seed isn't in the list.
 */
export function getComparableCities(
  citySlug: string | null | undefined,
  limit = 3,
): CityEntry[] {
  if (!citySlug) return [];
  const seed = BY_SLUG[citySlug.toLowerCase()];
  if (!seed) return [];
  const candidates = CITIES.filter((c) => c.slug !== seed.slug)
    .map((c) => ({ city: c, score: similarityDistance(seed, c) }))
    .sort((a, b) => a.score - b.score);
  // Deduplicate by country (max 1 city per country in the result)
  const seenCountries = new Set<string>();
  const out: CityEntry[] = [];
  for (const { city } of candidates) {
    if (seenCountries.has(city.iso2)) continue;
    seenCountries.add(city.iso2);
    out.push(city);
    if (out.length >= limit) break;
  }
  return out;
}
