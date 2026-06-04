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
 * Same voice, straight from the bible (Section 25): blunt, practical,
 * skeptical of easy money. It frames the directory so a reader can find a
 * city by the thing that actually moves small-business economics, how deep
 * the local market is, what the locals can pay, and how much of the demand
 * walks in as a visitor.
 *
 * It invents NO numbers. It only restates the figures the cities page already
 * loads (metro population, gross salary, cost-of-living index, visitor
 * arrivals, city scale) as the same qualitative words the city hero and stat
 * tiles use, by reading them through the shared break tables in
 * src/lib/cities/guiding_word. Where a city is missing a field, that clause
 * self-omits, so a thin entry degrades to a plain link instead of a fabricated
 * one (bible: hide weakness, no apologetic placeholder).
 *
 * Pure module: no Supabase, no network. It consumes only the static city list
 * and the guiding-word break tables, so it is trivially testable and cannot
 * trip the layering gate.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import { getGuidingWord } from "@/lib/cities/guiding_word";

/** The fields of one city the directory actually reads. */
export interface DirectoryCityInput {
  slug: string;
  name: string;
  iso2: string;
  continent: string;
  tier: number;
  pop_m: number;
  avg_gross_salary_usd_year?: number | null;
  cost_of_living_index?: number | null;
  tourist_arrivals_m?: number | null;
}

/**
 * One qualitative signal on a city row. Neutral by design: a directory entry
 * is a place to start reading, not a verdict, so the words describe size and
 * pull (atlas tone), they do not grade the city good or bad.
 */
export interface CitySignal {
  /** Short label, e.g. "Market", "Local pay", "Visitors". */
  label: string;
  /** Qualitative word from the shared break tables, e.g. "large", "comfortable". */
  word: string;
}

/** A city resolved to its reading group plus its computable signals. */
export interface DirectoryCity {
  slug: string;
  name: string;
  iso2: string;
  /** Metro population in millions, kept for the in-group ordering. */
  pop_m: number;
  /**
   * Arrivals per resident, when both numbers exist. Surfaces the cities where
   * the demand is mostly visitors rather than locals, which the bible flags as
   * the real tourism signal (Section 5, Section 20) as opposed to fluff.
   */
  touristIntensity: number | null;
  /** Up to three computable qualitative signals, thin fields omitted. */
  signals: CitySignal[];
}

// ----------------------------------------------------------------------------
// reading groups: the editorial spine that replaces the alphabetical dump
// ----------------------------------------------------------------------------

/**
 * The three reading groups the directory sorts cities into, by the depth of
 * the local market. This mirrors the city-list tier field (1 = the largest
 * metros, 2 = major and capital cities, 3 = secondary cities), which is the
 * single signal that most changes how a small business reads a place: a deeper
 * market forgives a narrower concept, a shallow one does not.
 */
export type CityTier = "metropolis" | "major" | "secondary";

export interface CityTierMeta {
  id: CityTier;
  /** Short label for the group heading. */
  title: string;
  /** One blunt line of what unites the group, in the house voice. */
  blurb: string;
}

export const CITY_TIERS: Record<CityTier, CityTierMeta> = {
  metropolis: {
    id: "metropolis",
    title: "Global metropolises",
    blurb:
      "The deepest demand pools on the map. Almost any concept finds enough customers here, which is exactly why the rent and the wage bill come for the margin first. Volume is rarely the problem; keeping what you earn is.",
  },
  major: {
    id: "major",
    title: "Major and capital cities",
    blurb:
      "Enough people and money to support most businesses without the megacity cost base. The middle of the map, where a tight operator has the most room and the competition is real but not yet brutal.",
  },
  secondary: {
    id: "secondary",
    title: "Secondary cities",
    blurb:
      "Smaller markets where demand is shallower and pricing power is thinner, but rent and wages usually are too. A focused concept can own a niche here; a broad one can run out of customers before it runs out of money.",
  },
};

export const CITY_TIER_ORDER: CityTier[] = ["metropolis", "major", "secondary"];

/** Map the city-list tier integer to a reading group. */
export function tierGroup(tier: number): CityTier {
  if (tier <= 1) return "metropolis";
  if (tier === 2) return "major";
  return "secondary";
}

// ----------------------------------------------------------------------------
// signals: restated through the shared break tables, never re-banded here
// ----------------------------------------------------------------------------

function marketSignal(popM: number | null | undefined): CitySignal | null {
  if (popM == null || !Number.isFinite(popM)) return null;
  const { word } = getGuidingWord("metro_pop_m", popM);
  return word ? { label: "Market", word } : null;
}

function paySignal(salaryYear: number | null | undefined): CitySignal | null {
  if (salaryYear == null || !Number.isFinite(salaryYear) || salaryYear <= 0)
    return null;
  // The break table reads monthly gross; the city list stores annual.
  const { word } = getGuidingWord("gross_salary_usd_mo", salaryYear / 12);
  return word ? { label: "Local pay", word } : null;
}

function visitorSignal(
  arrivalsM: number | null | undefined,
): CitySignal | null {
  if (arrivalsM == null || !Number.isFinite(arrivalsM) || arrivalsM <= 0)
    return null;
  const { word } = getGuidingWord("tourist_arrivals_m", arrivalsM);
  return word ? { label: "Visitors", word } : null;
}

/**
 * Resolve one city to its directory shape: the same qualitative words the city
 * page uses, plus the visitor-to-resident ratio when both numbers exist. Each
 * signal self-omits when its field is missing.
 */
export function buildDirectoryCity(c: DirectoryCityInput): DirectoryCity {
  const signals: CitySignal[] = [];
  const market = marketSignal(c.pop_m);
  if (market) signals.push(market);
  const pay = paySignal(c.avg_gross_salary_usd_year);
  if (pay) signals.push(pay);
  const visitors = visitorSignal(c.tourist_arrivals_m);
  if (visitors) signals.push(visitors);

  const touristIntensity =
    c.tourist_arrivals_m != null &&
    Number.isFinite(c.tourist_arrivals_m) &&
    c.tourist_arrivals_m > 0 &&
    c.pop_m != null &&
    Number.isFinite(c.pop_m) &&
    c.pop_m > 0
      ? c.tourist_arrivals_m / c.pop_m
      : null;

  return {
    slug: c.slug,
    name: c.name,
    iso2: c.iso2,
    pop_m: c.pop_m,
    touristIntensity,
    signals,
  };
}

// ----------------------------------------------------------------------------
// the grouped directory
// ----------------------------------------------------------------------------

export interface DirectoryGroup {
  meta: CityTierMeta;
  cities: DirectoryCity[];
}

export interface CityDirectory {
  /** The reading groups, in order, each already sorted and non-empty. */
  groups: DirectoryGroup[];
  /** Total cities placed (every input is placed; none is dropped). */
  total: number;
  /**
   * The handful of cities where visitors most outnumber residents, the honest
   * tourism signal the bible asks for instead of tourism fluff. Empty when no
   * city carries both an arrivals and a population number.
   */
  visitorLed: DirectoryCity[];
}

/**
 * Build the whole directory from the raw city list. Pure compute: it places
 * every city into a reading group, orders each group by market depth (the
 * deepest markets read first), and surfaces the visitor-led outliers. It owns
 * no visibility policy; the caller decides which cities to pass in.
 */
export function buildCityDirectory(
  input: DirectoryCityInput[],
  opts?: { visitorLedCount?: number; visitorLedMinRatio?: number },
): CityDirectory {
  const visitorLedCount = opts?.visitorLedCount ?? 6;
  const visitorLedMinRatio = opts?.visitorLedMinRatio ?? 3;

  const buckets: Record<CityTier, DirectoryCity[]> = {
    metropolis: [],
    major: [],
    secondary: [],
  };

  const all: DirectoryCity[] = [];
  for (const c of input) {
    const dc = buildDirectoryCity(c);
    all.push(dc);
    buckets[tierGroup(c.tier)].push(dc);
  }

  // Deepest markets first inside each group, then alphabetical so the order is
  // stable and a reader can still scan for a name.
  for (const tier of CITY_TIER_ORDER) {
    buckets[tier].sort(
      (a, b) => b.pop_m - a.pop_m || a.name.localeCompare(b.name),
    );
  }

  const groups: DirectoryGroup[] = CITY_TIER_ORDER.map((tier) => ({
    meta: CITY_TIERS[tier],
    cities: buckets[tier],
  })).filter((g) => g.cities.length > 0);

  const visitorLed = all
    .filter(
      (c) => c.touristIntensity != null && c.touristIntensity >= visitorLedMinRatio,
    )
    .sort((a, b) => (b.touristIntensity ?? 0) - (a.touristIntensity ?? 0))
    .slice(0, visitorLedCount);

  return { groups, total: all.length, visitorLed };
}
