/**
 * city_pair.ts , the two cities a comparison page puts side by side.
 *
 * WHY THIS EXISTS AS A LIB MODULE. A page that reads `data/` directly is a
 * layering violation the build gate rejects. The reads live here and the page
 * receives typed figures.
 *
 * WHAT IS COMPARED, AND WHAT IS DELIBERATELY NOT.
 *
 * The city file carries ten fields per city. Only three of them tell anyone
 * anything about opening a business:
 *
 *   what people earn      what a customer can spend, and what staff will cost
 *   cost of living        what the same basket costs to run
 *   people out of work    whether staff are findable
 *
 * `pop_m`, `gdp_b`, `hdi` and `gini` are left out on purpose. The founder's
 * standing rule bans raw population and similar as trivia: "no raw population,
 * no percent urban, no vague comfortable". A bigger city is not a better one to
 * open in, and printing the figure invites exactly that reading.
 *
 * NO COMPOSITE SCORE, AND NO WINNER. Three measures, each shown for both
 * cities, and the reader decides. Collapsing them into one number would mean
 * choosing weights nobody ratified, and it would rank two places against each
 * other on a scale the data cannot support.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import comparisonsJson from "../../../data/cities/city_comparisons_v1.json";

type CityRow = {
  slug?: string;
  name?: string;
  iso2?: string;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  unemployment_pct?: number;
};

type PairRow = { left?: string; right?: string; hook?: string };

const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const PAIRS = (comparisonsJson as { pairs: PairRow[] }).pairs;

export type CompareSide = {
  slug: string;
  name: string;
  iso2: string;
};

export type CompareLine = {
  label: string;
  /** What the figure is per, because a nominal figure without it is theatre. */
  sub: string;
  left: string | null;
  right: string | null;
  /** "12% higher in New York", or null when either side is missing. */
  gap: string | null;
};

export type CityPair = {
  left: CompareSide;
  right: CompareSide;
  /** The editorial line seeded with the pair. The structural reason, in the
   *  file's own words, never authored on the page. */
  hook: string | null;
  lines: CompareLine[];
};

/** Every seeded pair, as slugs, for the index. */
export function seededPairs(): Array<{ left: string; right: string; hook: string | null }> {
  return PAIRS.filter((p) => p.left && p.right).map((p) => ({
    left: p.left as string,
    right: p.right as string,
    hook: p.hook ?? null,
  }));
}

const money = (v?: number) =>
  v == null ? null : `$${Math.round(v / 1000)}K`;

/** How far apart two figures are, named in the direction a reader reads. */
function gapOf(
  a: number | undefined,
  b: number | undefined,
  aName: string,
  bName: string,
): string | null {
  if (a == null || b == null || a === 0 || b === 0) return null;
  const hi = Math.max(a, b);
  const lo = Math.min(a, b);
  const pct = Math.round(((hi - lo) / lo) * 100);
  if (pct === 0) return "the same, near enough";
  return `${pct}% higher in ${a > b ? aName : bName}`;
}

export function cityPair(leftSlug: string, rightSlug: string): CityPair | null {
  const l = CITIES.find((c) => c.slug === leftSlug);
  const r = CITIES.find((c) => c.slug === rightSlug);
  if (!l?.slug || !l.name || !r?.slug || !r.name) return null;

  const seeded = PAIRS.find(
    (p) =>
      (p.left === leftSlug && p.right === rightSlug) ||
      (p.left === rightSlug && p.right === leftSlug),
  );

  const ln = l.name;
  const rn = r.name;

  const lines: CompareLine[] = [
    {
      label: "What people earn",
      sub: "average, before tax, a year",
      left: money(l.avg_gross_salary_usd_year),
      right: money(r.avg_gross_salary_usd_year),
      gap: gapOf(l.avg_gross_salary_usd_year, r.avg_gross_salary_usd_year, ln, rn),
    },
    {
      label: "What it costs to live",
      sub: "the same basket, New York at 100",
      left: l.cost_of_living_index != null ? String(l.cost_of_living_index) : null,
      right: r.cost_of_living_index != null ? String(r.cost_of_living_index) : null,
      gap: gapOf(l.cost_of_living_index, r.cost_of_living_index, ln, rn),
    },
    {
      label: "People out of work",
      sub: "how easily a rota fills",
      left: l.unemployment_pct != null ? `${l.unemployment_pct}%` : null,
      right: r.unemployment_pct != null ? `${r.unemployment_pct}%` : null,
      gap: gapOf(l.unemployment_pct, r.unemployment_pct, ln, rn),
    },
  ];

  return {
    left: { slug: l.slug, name: ln, iso2: l.iso2 ?? "" },
    right: { slug: r.slug, name: rn, iso2: r.iso2 ?? "" },
    hook: seeded?.hook ?? null,
    lines,
  };
}

/** The name of a city slug, for the index. */
export function cityName(slug: string): string | null {
  return CITIES.find((c) => c.slug === slug)?.name ?? null;
}

/** The ISO2 of a city slug, so the index can fly a flag. */
export function cityIso2(slug: string): string | null {
  return CITIES.find((c) => c.slug === slug)?.iso2 ?? null;
}
