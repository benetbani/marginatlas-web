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
import cityRivalsJson from "../../../data/cities/city_rivals_v1.json";

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

// --- structured city-page peer set (founder 2026-06-08) ---------------------
// The city page shows three peers with distinct roles, not three nearest-by-size
// metros: a local competitor (same country if possible), the historical rival
// (curated, e.g. London and Paris), and a peer abroad. All within a population
// band, with at most one peer sharing the seed's country (two for the US, China,
// and India, large enough to field two). getComparableCities above is left intact
// for the cell page's comparable-cities ribbon.

const RIVALS = (cityRivalsJson as { rivals: Record<string, string> }).rivals;
const BIG_COUNTRIES = new Set(["US", "CN", "IN"]);

export type PeerRole = "competitor" | "rival" | "international";
export type CityPeerPick = CityEntry & { role: PeerRole };

/** Keep a candidate within a sane population band of the seed (default within 3x
 * either way). A missing population does not exclude, so we never over-filter. */
function withinPopRange(seed: CityEntry, c: CityEntry, ratio = 3): boolean {
  if (!(seed.pop_m > 0) || !(c.pop_m > 0)) return true;
  const r = c.pop_m / seed.pop_m;
  return r >= 1 / ratio && r <= ratio;
}

function rankBySimilarity(seed: CityEntry, pool: CityEntry[]): CityEntry[] {
  return pool
    .map((c) => ({ c, d: similarityDistance(seed, c) }))
    .sort((a, b) => a.d - b.d)
    .map((x) => x.c);
}

export function getCityPeerSet(
  citySlug: string | null | undefined,
): CityPeerPick[] {
  if (!citySlug) return [];
  const seed = BY_SLUG[citySlug.toLowerCase()];
  if (!seed) return [];

  const all = CITIES.filter((c) => c.slug !== seed.slug);
  const inRange = all.filter((c) => withinPopRange(seed, c));
  const pool = inRange.length >= 6 ? inRange : all;

  const picks: CityPeerPick[] = [];
  const usedSlugs = new Set<string>();
  const usedCountries = new Set<string>();
  const sameCountryCap = BIG_COUNTRIES.has(seed.iso2) ? 2 : 1;
  let sameCountryUsed = 0;

  const canTake = (c: CityEntry): boolean => {
    if (usedSlugs.has(c.slug)) return false;
    if (c.iso2 === seed.iso2) return sameCountryUsed < sameCountryCap;
    return !usedCountries.has(c.iso2);
  };
  const take = (c: CityEntry, role: PeerRole): void => {
    picks.push({ ...c, role });
    usedSlugs.add(c.slug);
    if (c.iso2 === seed.iso2) sameCountryUsed += 1;
    else usedCountries.add(c.iso2);
  };

  // 1) Classic rival FIRST, so the competitor step below cannot poach it: the
  //    curated rival if present and takeable (editorial truth, so it ignores the
  //    population band); else the nearest cross-country peer.
  const rivalSlug = RIVALS[seed.slug];
  const rivalEntry = rivalSlug ? BY_SLUG[rivalSlug] : undefined;
  const rival =
    rivalEntry && rivalEntry.slug !== seed.slug && canTake(rivalEntry)
      ? rivalEntry
      : rankBySimilarity(seed, pool.filter((c) => c.iso2 !== seed.iso2)).find(canTake);
  if (rival) take(rival, "rival");

  // 2) Local competitor: nearest same country, else same continent, else anywhere.
  //    The rival is already reserved, so a same-continent competitor is next best.
  const competitor =
    rankBySimilarity(seed, pool.filter((c) => c.iso2 === seed.iso2)).find(canTake) ??
    rankBySimilarity(
      seed,
      pool.filter((c) => c.iso2 !== seed.iso2 && c.continent === seed.continent),
    ).find(canTake) ??
    rankBySimilarity(seed, pool).find(canTake);
  if (competitor) take(competitor, "competitor");

  // 3) Peer abroad: nearest from a different continent than the seed.
  const intl =
    rankBySimilarity(seed, pool.filter((c) => c.continent !== seed.continent)).find(
      canTake,
    ) ?? rankBySimilarity(seed, pool.filter((c) => c.iso2 !== seed.iso2)).find(canTake);
  if (intl) take(intl, "international");

  // Backfill to three if a role could not be filled.
  if (picks.length < 3) {
    for (const c of rankBySimilarity(seed, pool)) {
      if (picks.length >= 3) break;
      if (canTake(c)) take(c, "international");
    }
  }

  // Display in the founder's order regardless of selection order: a local
  // competitor, then the classic rival, then the peer abroad.
  const order: Record<PeerRole, number> = { competitor: 0, rival: 1, international: 2 };
  return picks.sort((a, b) => order[a.role] - order[b.role]).slice(0, 3);
}
