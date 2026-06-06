/**
 * src/lib/scores/city_directory.ts
 *
 * The city-directory read (bible Section 14, the City directory row: "local
 * discovery" with key modules "industries, rent, demand, rankings", whose
 * stated things-to-avoid are "tourism fluff" and, for every directory, an
 * "alphabetical dump only"). This is the directory-altitude sibling of the
 * sector read (src/lib/scores/sector_economics) and the country read
 * (src/lib/scores/country_verdict).
 *
 * White-reset 2026-06-06 (founder): the directory stopped restating figures as
 * qualitative words and now hands the page two concrete shapes instead:
 *
 *   1. topVisitorRatio - the ten cities where visitors most outnumber
 *      residents (tourist_arrivals_m / pop_m), ranked, for a "the customer is a
 *      visitor, not a local" strip. No good/bad floor; it simply surfaces the
 *      most visitor-skewed markets among cities that carry both numbers.
 *   2. showcase - a curated, single-column set of the deepest markets (the top
 *      tier), each carrying three real figures: visitor arrivals, average
 *      salary, and metro GDP. This replaces the old grouped "metropolis / major
 *      / secondary" dump; the long tail stays reachable via the map and the
 *      country pages.
 *
 * It invents NO numbers. It only restates the figures the cities page already
 * loads (metro population, gross salary, visitor arrivals, metro GDP, city
 * scale). Where a city is missing a field, that figure degrades to the board
 * dash at render time, so a thin entry is still an honest, usable card (bible:
 * hide weakness, no apologetic placeholder).
 *
 * Pure module: no Supabase, no network. It consumes only the static city list,
 * so it is trivially testable and cannot trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */

/** The fields of one city the directory actually reads. */
export interface DirectoryCityInput {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  gdp_b?: number | null;
  avg_gross_salary_usd_year?: number | null;
  cost_of_living_index?: number | null;
  tourist_arrivals_m?: number | null;
}

/**
 * A city resolved to the concrete figures the directory renders. No qualitative
 * words: the card shows the real numbers (or the board dash when a field is
 * absent), and the page formats them through the board format helpers.
 */
export interface DirectoryCity {
  slug: string;
  name: string;
  iso2: string;
  tier: number;
  /** Metro population in millions, kept for the showcase ordering. */
  pop_m: number;
  /** Metro GDP in USD billions, or null when unknown. */
  gdp_b: number | null;
  /** Average gross annual salary in USD, or null when unknown. */
  avg_gross_salary_usd_year: number | null;
  /** Visitor arrivals per year in millions, or null when unknown. */
  tourist_arrivals_m: number | null;
  /**
   * Arrivals per resident, when both numbers exist. Surfaces the cities where
   * the demand is mostly visitors rather than locals, which the bible flags as
   * the real tourism signal (Section 5, Section 20) as opposed to fluff.
   */
  touristIntensity: number | null;
}

/** A city placed in the ranked visitor-led strip, with its rank and texture. */
export interface VisitorRankedCity {
  slug: string;
  name: string;
  iso2: string;
  /** 1-based rank by visitor-to-resident ratio (most extreme first). */
  rank: number;
  /** Arrivals per resident; always present in this list (both fields exist). */
  ratio: number;
  /** One-word read of how visitor-skewed the market is. */
  texture: string;
}

// ----------------------------------------------------------------------------
// city tier -> reading depth (kept only for showcase curation)
// ----------------------------------------------------------------------------

/**
 * Map the city-list tier integer to a market-depth band. The directory no
 * longer renders these as groups; the band is used only to decide which cities
 * make the curated showcase (the deepest markets first). 1 = the largest
 * metros, 2 = major and capital cities, 3 = secondary cities.
 */
export type CityTier = "metropolis" | "major" | "secondary";

export function tierGroup(tier: number): CityTier {
  if (tier <= 1) return "metropolis";
  if (tier === 2) return "major";
  return "secondary";
}

// ----------------------------------------------------------------------------
// resolve one city to its rendered figures
// ----------------------------------------------------------------------------

function finite(n: number | null | undefined): number | null {
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

/**
 * Resolve one city to its directory shape: the concrete figures the cards
 * render, plus the visitor-to-resident ratio when both numbers exist.
 */
export function buildDirectoryCity(c: DirectoryCityInput): DirectoryCity {
  const popM = finite(c.pop_m);
  const arrivalsM = finite(c.tourist_arrivals_m);

  const touristIntensity =
    arrivalsM != null && arrivalsM > 0 && popM != null && popM > 0
      ? arrivalsM / popM
      : null;

  return {
    slug: c.slug,
    name: c.name,
    iso2: c.iso2,
    tier: c.tier,
    pop_m: c.pop_m,
    gdp_b: finite(c.gdp_b),
    avg_gross_salary_usd_year: finite(c.avg_gross_salary_usd_year),
    tourist_arrivals_m: arrivalsM,
    touristIntensity,
  };
}

/**
 * A one-word read of how visitor-dominated a market is, from the ratio alone.
 * Neutral and short, for the texture slot on a ranked row: it describes the
 * skew, it does not grade the city.
 */
function visitorTexture(ratio: number): string {
  if (ratio >= 10) return "overwhelming";
  if (ratio >= 7) return "heavy";
  if (ratio >= 4) return "strong";
  return "seasonal";
}

// ----------------------------------------------------------------------------
// the directory
// ----------------------------------------------------------------------------

export interface CityDirectory {
  /** Total cities placed (every input is read; none is dropped from the count). */
  total: number;
  /**
   * The ten cities where visitors most outnumber residents, ranked, with no
   * good/bad floor. Only cities carrying BOTH an arrivals and a population
   * number qualify. Empty when fewer than that exist.
   */
  topVisitorRatio: VisitorRankedCity[];
  /**
   * The curated single-column showcase: the deepest markets (the top tier),
   * sorted by population. The long tail is reachable via the map and the
   * country pages, not dumped here.
   */
  showcase: DirectoryCity[];
}

/** How many cities the ranked visitor-led strip surfaces at most. */
const VISITOR_RANK_COUNT = 10;
/** Floor below which the showcase pulls in the next tier to stay substantial. */
const SHOWCASE_MIN = 24;
/** Ceiling so the showcase stays a showcase, not a dump. */
const SHOWCASE_CAP = 36;

/**
 * Build the whole directory from the raw city list. Pure compute: it ranks the
 * most visitor-skewed markets and curates the deepest-market showcase. It owns
 * no visibility policy beyond the curation cap; the caller decides which cities
 * to pass in.
 */
export function buildCityDirectory(
  input: DirectoryCityInput[],
  opts?: {
    visitorRankCount?: number;
    showcaseMin?: number;
    showcaseCap?: number;
  },
): CityDirectory {
  const visitorRankCount = opts?.visitorRankCount ?? VISITOR_RANK_COUNT;
  const showcaseMin = opts?.showcaseMin ?? SHOWCASE_MIN;
  const showcaseCap = opts?.showcaseCap ?? SHOWCASE_CAP;

  const all = input.map(buildDirectoryCity);

  // 1. Ranked visitor-led strip: top N by ratio among cities with both
  //    numbers, most extreme first, no floor.
  const topVisitorRatio: VisitorRankedCity[] = all
    .filter((c): c is DirectoryCity & { touristIntensity: number } =>
      c.touristIntensity != null,
    )
    .sort((a, b) => b.touristIntensity - a.touristIntensity)
    .slice(0, visitorRankCount)
    .map((c, i) => ({
      slug: c.slug,
      name: c.name,
      iso2: c.iso2,
      rank: i + 1,
      ratio: c.touristIntensity,
      texture: visitorTexture(c.touristIntensity),
    }));

  // 2. Showcase: the deepest markets, sorted by population. Start with the top
  //    tier (metropolis); if that is thin, pull in the next tier until the set
  //    is substantial, then cap so it stays a showcase.
  const byDepthThenPop = (a: DirectoryCity, b: DirectoryCity): number =>
    b.pop_m - a.pop_m || a.name.localeCompare(b.name);

  const metropolis = all
    .filter((c) => tierGroup(c.tier) === "metropolis")
    .sort(byDepthThenPop);

  let showcase = metropolis;
  if (showcase.length < showcaseMin) {
    const major = all
      .filter((c) => tierGroup(c.tier) === "major")
      .sort(byDepthThenPop);
    showcase = [...metropolis, ...major];
  }
  showcase = showcase.slice(0, showcaseCap);

  return { total: all.length, topVisitorRatio, showcase };
}
