/**
 * src/lib/scores/city_board.ts
 *
 * Pure synthesis for the data board that leads the city page (/cities/london,
 * /cities/new-york, ...). It is the city-altitude sibling of country_board.ts
 * and cell_board.ts and follows the exact same contract, so a reader who has
 * learned either of those reads this one for free:
 *
 *   - Every section and every row is ALWAYS present, in a fixed order. A datum
 *     we do not hold is emitted as a null value, which the board's StatGrid
 *     renders as the MISSING dash. The board is a scaffold, not a data-shaped
 *     silhouette: its shape never depends on which figures exist, so a blank
 *     reads as "we do not have this field" rather than "this page is broken".
 *   - Honest dashes beat invented numbers. The city page holds a small set of
 *     real city-level figures (metro population, average salary, cost-of-living
 *     index, tourist arrivals) plus the country economics snapshot it can read
 *     for the country the city sits in. Every row beyond those is null, never a
 *     fabricated stand-in.
 *   - Sections that lean on modeled / directional inputs carry `modeled: true`,
 *     which renders one quiet footnote per section, not a badge per row.
 *
 * Sections, in fixed order, ALWAYS emitted:
 *   demand     Demand depth: population, households, income proxy, footfall
 *   location   Location and rent (modeled): rent pressure, prime rent, cost tier
 *   market     Market structure (modeled): saturation, density, informality
 *   survival   Survival baseline (modeled): 1yr / 3yr / 5yr survival, closure
 *
 * The London city is the one place a modeled qualitative read is filled. Its
 * curated activity dataset (data/london/london_market_v1.json, the same import
 * the cell board uses) carries a per-activity rent-pressure label and a
 * per-activity survival curve; this module summarises those into a single
 * representative city read (the most common rent-pressure band, the mean
 * survival curve across activities) and labels it as representative. Every
 * other city leaves those rows null, because we do not hold an honest
 * city-level figure for them.
 *
 * Pure module: no Supabase, no fs, no runtime side effects. The board consumes
 * numbers the city page has already loaded (the city record and the country
 * economics snapshot) plus the static London JSON; it does not fetch. Kit types
 * are type-only imports, exactly like country_board.ts, so this stays trivially
 * testable and cannot trip the layering gate (which only walks src/app +
 * src/components). No chart is attached at the city level today, so the module
 * stays plain TypeScript with no React dependency.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtInt, fmtNum } from "@/components/board/format";
import { boundSurvivalCurve, clampNetMarginPct } from "@/lib/finance/margin_floor";
import londonJson from "../../../data/london/london_market_v1.json";

/**
 * The city-level figures the board reads. This is the subset of the city
 * record (data/cities/city_list_v1.json) the board renders, narrowed to the
 * fields it uses. Every field is nullable; a null becomes a dash.
 */
export interface CityBoardCity {
  /** URL slug, e.g. "london". Drives the London-specific summary below. */
  slug: string;
  /** Metro resident population, in millions. */
  popM: number | null;
  /** Metro average gross salary, USD per year. */
  avgGrossSalaryUsdYear: number | null;
  /** Cost-of-living index (a leading metro indexes to 100). */
  costOfLivingIndex: number | null;
  /** Annual tourist arrivals, in millions (a footfall proxy). */
  touristArrivalsM: number | null;
}

/**
 * The country economics the board reads for the country the city sits in. This
 * is the shape getCountryEconomicsSnapshot already returns, narrowed to the two
 * fields the city board uses. Both are nullable; a null becomes a dash.
 */
export interface CityBoardEcon {
  /** Self-employment share of total employment, percent (0..100). */
  selfEmploymentPct: number | null;
  /** Average gross monthly salary, USD (country-level fallback for income). */
  avgMonthlySalary: number | null;
}

export interface CityBoardInput {
  /** City record fields the board renders. */
  city: CityBoardCity;
  /** Country economics snapshot for the city's country, or null. */
  econ: CityBoardEcon | null;
}

// --- curated London dataset (static, the same import the cell board uses) ----

type LondonActivity = {
  rent_pressure?: string;
  survival?: { yr1: number; yr3: number; yr5: number };
};
type LondonFile = {
  activities: Record<string, LondonActivity>;
  london_population: number;
};
const LONDON = londonJson as unknown as LondonFile;

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** A present, non-empty qualitative string, else null (so the row blanks). */
function textOrNull(s: string | null | undefined): string | null {
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

/**
 * A single representative London read, summarised across the curated activity
 * dataset. Returns null for every non-London city. For London it carries the
 * most common rent-pressure band and the mean survival curve across activities;
 * both are honest city-level summaries of figures we already hold, labeled as
 * representative on the board (the rows that use them carry a "representative"
 * hint and the modeled footnote).
 */
function londonSummary(slug: string): {
  rentPressure: string | null;
  population: number | null;
  survival: { yr1: number; yr3: number; yr5: number } | null;
} | null {
  if (slug !== "london") return null;
  const activities = Object.values(LONDON.activities ?? {});
  if (activities.length === 0) {
    return {
      rentPressure: null,
      population: isNum(LONDON.london_population) ? LONDON.london_population : null,
      survival: null,
    };
  }

  // Most common rent-pressure band across activities (the modal read).
  const rentCounts = new Map<string, number>();
  for (const a of activities) {
    const band = textOrNull(a.rent_pressure);
    if (band) rentCounts.set(band, (rentCounts.get(band) ?? 0) + 1);
  }
  let rentPressure: string | null = null;
  let best = 0;
  for (const [band, count] of rentCounts) {
    if (count > best) {
      best = count;
      rentPressure = band;
    }
  }

  // Mean survival curve across activities that carry one. A plain average is an
  // honest representative read for a city baseline; we do not have firm-share
  // weights at this altitude, so we do not imply one.
  let y1 = 0;
  let y3 = 0;
  let y5 = 0;
  let n = 0;
  for (const a of activities) {
    const s = a.survival;
    if (s && isNum(s.yr1) && isNum(s.yr3) && isNum(s.yr5)) {
      y1 += s.yr1;
      y3 += s.yr3;
      y5 += s.yr5;
      n += 1;
    }
  }
  const survival =
    n > 0
      ? {
          yr1: Math.round(y1 / n),
          yr3: Math.round(y3 / n),
          yr5: Math.round(y5 / n),
        }
      : null;

  return {
    rentPressure,
    population: isNum(LONDON.london_population) ? LONDON.london_population : null,
    survival,
  };
}

/**
 * Build the full city board. Deterministic and side-effect free: the same
 * inputs always yield the same four sections, every section and every row
 * present, in the fixed order documented at the top of the file.
 */
export function buildCityBoard(input: CityBoardInput): BoardSection[] {
  const { city, econ } = input;
  const L = londonSummary(city.slug);

  // -- demand. Demand depth. ------------------------------------------------
  // Population is the metro resident count (millions in the record, expanded to
  // a head count). Income proxy prefers the city's own annual gross salary and
  // falls back to the country's annualised monthly salary. Footfall reads off
  // annual tourist arrivals (a proxy, labeled as visitors). Households is not
  // held at this altitude, so it blanks.
  const population = isNum(city.popM) ? Math.round(city.popM * 1_000_000) : null;
  const cityIncome = isNum(city.avgGrossSalaryUsdYear)
    ? city.avgGrossSalaryUsdYear
    : null;
  const countryIncome =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const incomeProxy = cityIncome ?? countryIncome;
  const demandRows: StatRow[] = [
    {
      label: "Population",
      value: isNum(population) ? fmtInt(population) : null,
      hint: "metro residents",
    },
    { label: "Households", value: null },
    {
      label: "Income proxy",
      value: isNum(incomeProxy) ? fmtUSD(incomeProxy) : null,
      hint: "average gross salary per year",
    },
    {
      label: "Footfall",
      value: isNum(city.touristArrivalsM)
        ? `${fmtNum(city.touristArrivalsM)}M visitors/year`
        : null,
    },
  ];

  // -- location. Location and rent (modeled). -------------------------------
  // Rent pressure is the London representative read (most common band across
  // activities) and blank for every other city. Prime rent is not held.
  // Cost tier reads off the cost-of-living index (a leading metro indexes to
  // 100), shown as the index figure with that anchor in the hint.
  const locationRows: StatRow[] = [
    {
      label: "Rent pressure",
      value: L ? textOrNull(L.rentPressure) : null,
      hint: L && L.rentPressure ? "representative across activities" : undefined,
    },
    { label: "Prime rent", value: null },
    {
      label: "Cost tier",
      value: isNum(city.costOfLivingIndex)
        ? fmtNum(city.costOfLivingIndex)
        : null,
      hint: "cost-of-living index, leading metro at 100",
    },
  ];

  // -- market. Market structure (modeled). ----------------------------------
  // Saturation and business density are place-and-activity specific and not
  // held at the bare city altitude, so they blank. Informality reads off the
  // country's self-employment share (a broad but correlated proxy, the same
  // read the cell and country boards use), labeled as a country-level figure.
  const marketRows: StatRow[] = [
    { label: "Saturation", value: null },
    { label: "Business density", value: null },
    {
      label: "Informality",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}% self-employed`
          : null,
      hint:
        econ && isNum(econ.selfEmploymentPct) ? "country-level" : undefined,
    },
  ];

  // -- survival. Survival baseline (modeled). -------------------------------
  // The London representative survival curve (mean across activities) fills the
  // three survival rows for London and blanks them for every other city.
  // Closure rate is not held. The curve is bounded (0 <= yr5 <= yr3 <= yr1 <=
  // 100; non-finite dashes) so an averaged curve can never print a rising or
  // out-of-range survival series; the "representative" hint keys off whether a
  // curve exists at all (London), matching the prior behaviour.
  const hasSurvivalCurve = L?.survival != null;
  const survival = boundSurvivalCurve(L?.survival ?? {});
  const survivalRows: StatRow[] = [
    {
      label: "1-year survival",
      value: isNum(survival.yr1) ? `${survival.yr1}%` : null,
      hint: hasSurvivalCurve ? "representative across activities" : undefined,
    },
    {
      label: "3-year",
      value: isNum(survival.yr3) ? `${survival.yr3}%` : null,
    },
    {
      label: "5-year",
      value: isNum(survival.yr5) ? `${survival.yr5}%` : null,
    },
    { label: "Closure rate", value: null },
  ];

  return [
    { key: "demand", title: "Demand depth", rows: demandRows },
    { key: "location", title: "Location and rent", rows: locationRows, modeled: true },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
  ];
}

// --- ranked activities table (the page's main content, not a board section) --

/**
 * One row of the "activities in this city" table: an activity, what its owner
 * keeps after tax (USD), an optional net margin, and the cell URL to open for
 * the full numbers. Ranked by takeHome descending by buildCityActivities.
 */
export interface CityActivityRow {
  /** Display name, e.g. "Dental practices". */
  name: string;
  /** URL slug, e.g. "dental-practices" (already hyphenated). */
  slug: string;
  /** Cell-page href, e.g. "/gb/london/dental-practices". */
  href: string;
  /** After-tax owner take-home, USD, or null (never invented off London). */
  takeHome: number | null;
  /** Net margin, percent (0..100), or null. */
  netMarginPct: number | null;
}

/**
 * Title-case a London activity slug into a display name, e.g.
 * "hair-salons-full-service" becomes "Hair salons full service". Pure string
 * work; the dataset keys are clean URL slugs, so this is just hyphen-to-space
 * with a leading capital.
 */
function slugToName(slug: string): string {
  const spaced = slug.replace(/-/g, " ").trim();
  if (spaced.length === 0) return slug;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

type LondonActivityEconomics = {
  economics?: { owner_take_home?: number; net_margin_pct?: number };
};
type LondonActivitiesFile = {
  activities: Record<string, LondonActivityEconomics>;
};
const LONDON_ACTIVITIES = londonJson as unknown as LondonActivitiesFile;

/**
 * Build the ranked activities table for a city, best owner take-home first.
 *
 * London (slug "london", country GB) is sourced directly from the curated
 * dataset: every activity, its modeled after-tax owner take-home and net
 * margin, sorted by take-home descending. Each row's href points at that
 * activity's cell page under the city, using the same /{iso2}/{slug}/{activity}
 * shape the rest of the page links with.
 *
 * For every other city this returns an empty array: we do not hold per-activity
 * take-home at the city altitude, and inventing it is forbidden. The page reads
 * the empty array and omits the table cleanly. (A future non-London city with a
 * real per-activity feed can pass its own rows by extending this function; it
 * must never synthesise take-home from nothing.)
 */
export function buildCityActivities(input: {
  slug: string;
  countryIso2: string;
}): CityActivityRow[] {
  const slug = input.slug;
  const iso2 = input.countryIso2.toLowerCase();
  if (slug !== "london") return [];

  const rows: CityActivityRow[] = Object.entries(LONDON_ACTIVITIES.activities ?? {})
    .map(([activitySlug, entry]) => {
      const econ = entry.economics ?? null;
      const takeHome =
        econ && isNum(econ.owner_take_home) ? econ.owner_take_home : null;
      // Net margin (percent form) passes through the shared clamp so a table
      // row can never surface an implausible margin either.
      const netMarginPct =
        econ && isNum(econ.net_margin_pct)
          ? clampNetMarginPct(econ.net_margin_pct)
          : null;
      return {
        name: slugToName(activitySlug),
        slug: activitySlug,
        href: `/${iso2}/${slug}/${activitySlug}`,
        takeHome,
        netMarginPct,
      };
    })
    // Rank by take-home descending. Rows without a take-home (none today on
    // London) sink to the bottom rather than jumping the order.
    .sort((a, b) => (b.takeHome ?? -Infinity) - (a.takeHome ?? -Infinity));

  return rows;
}
