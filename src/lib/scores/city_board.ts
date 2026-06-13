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
 * Mostly pure: buildCityBoard and buildCityScore consume numbers the city page
 * has already loaded (the city record and the country economics snapshot) plus
 * the static London JSON, and do not fetch. The ONE engine-backed export is
 * buildCityActivities, which resolves the city's activity cells through the cell
 * engine (getTopIndustriesForCountry + getCellBySlug) so every city renders a
 * real ranked activity list; it is async and budgeted, the same pattern the
 * country break-in panel uses. No chart is attached at the city level today, so
 * the module stays plain TypeScript with no React dependency, and it cannot trip
 * the layering gate (which only walks src/app + src/components).
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtInt, fmtNum } from "@/components/board/format";
import { boundSurvivalCurve, clampNetMarginPct } from "@/lib/finance/margin_floor";
import {
  cityAttractivenessScore,
  type CityAttractivenessScore,
} from "@/lib/scores/city_attractiveness";
import {
  getCellBySlug,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { industryToSlug, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { breakInForCell } from "@/lib/scores/country_board";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
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
 * is the shape getCountryEconomicsSnapshot already returns, narrowed to the
 * fields the city board uses. All nullable; a null becomes a dash.
 */
export interface CityBoardEcon {
  /** Self-employment share of total employment, percent (0..100). */
  selfEmploymentPct: number | null;
  /** Average gross monthly salary, USD (country-level fallback for income). */
  avgMonthlySalary: number | null;
  /** Median net wealth per adult, USD (national; shown as a city estimate).
   * Optional so score-only callers (peers) may omit it; the board dashes it. */
  netWealthPerAdult?: number | null;
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
  /** Curated London per-activity economics (USD); the sanctioned exemplar source
   * the cell page prefers. Present only for London activities. */
  economics?: {
    revenue: number;
    net_margin_pct: number;
    owner_take_home: number;
    firms: number;
  };
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
  const cityMonthly = isNum(city.avgGrossSalaryUsdYear)
    ? city.avgGrossSalaryUsdYear / 12
    : null;
  const countryMonthly =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary : null;
  const monthlyIncome = cityMonthly ?? countryMonthly;
  // Net wealth per citizen: the national median per adult, scaled by the city's
  // income premium over the national average (a city-level estimate, founder
  // 2026-06-09). The factor is clamped to a sane band so an outlier city salary
  // can never print an absurd figure, and the result rounds to a clean $1,000.
  // Flat national value when the city has no own salary on file.
  const wealthIncomeFactor =
    isNum(cityMonthly) && isNum(countryMonthly) && countryMonthly > 0
      ? Math.max(0.5, Math.min(2.5, cityMonthly / countryMonthly))
      : 1;
  const cityNetWealth =
    econ && isNum(econ.netWealthPerAdult)
      ? Math.round((econ.netWealthPerAdult * wealthIncomeFactor) / 1000) * 1000
      : null;
  const demandRows: StatRow[] = [
    {
      label: "Metro population",
      value: isNum(population) ? fmtInt(population) : null,
      tip: "Resident population of the wider metro area.",
    },
    {
      label: "Average net wealth per citizen",
      value: isNum(cityNetWealth) ? fmtUSD(cityNetWealth) : null,
      tip: "National median net wealth per adult, scaled to this city's income. Estimate.",
    },
    {
      label: "Average salary",
      value: isNum(monthlyIncome) ? `${fmtUSD(monthlyIncome)}/mo` : null,
      tip: "Average gross salary, per month, before tax.",
    },
    {
      label: "Annual visitors",
      value: isNum(city.touristArrivalsM)
        ? `${fmtNum(city.touristArrivalsM)}M`
        : null,
      tip: "Tourist arrivals per year, a proxy for street footfall.",
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
      tip: "The most common rent-pressure level across local trades.",
    },
    {
      label: "Cost of living",
      value: isNum(city.costOfLivingIndex)
        ? fmtNum(city.costOfLivingIndex)
        : null,
      tip: "Cost-of-living index. A leading metro sits at 100.",
    },
  ];

  // -- market. Market structure (modeled). ----------------------------------
  // Saturation and business density are place-and-activity specific and not
  // held at the bare city altitude, so they blank. Informality reads off the
  // country's self-employment share (a broad but correlated proxy, the same
  // read the cell and country boards use), labeled as a country-level figure.
  const marketRows: StatRow[] = [
    {
      label: "Self-employment",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}%`
          : null,
      tip: "Share of workers who are self-employed. A country-level figure.",
    },
  ];

  // -- survival. Survival baseline (modeled). -------------------------------
  // The London representative survival curve (mean across activities) fills the
  // three survival rows for London and blanks them for every other city.
  // Closure rate is not held. The curve is bounded (0 <= yr5 <= yr3 <= yr1 <=
  // 100; non-finite dashes) so an averaged curve can never print a rising or
  // out-of-range survival series; the "representative" hint keys off whether a
  // curve exists at all (London), matching the prior behaviour.
  const survival = boundSurvivalCurve(L?.survival ?? {});
  const survivalRows: StatRow[] = [
    {
      label: "1-year survival",
      value: isNum(survival.yr1) ? `${survival.yr1}%` : null,
      tip: "Share of new businesses still trading after a year. Representative across local trades.",
    },
    {
      label: "3-year survival",
      value: isNum(survival.yr3) ? `${survival.yr3}%` : null,
    },
    {
      label: "5-year survival",
      value: isNum(survival.yr5) ? `${survival.yr5}%` : null,
    },
  ];

  return [
    { key: "demand", title: "Demand depth", rows: demandRows },
    { key: "location", title: "Location and rent", rows: locationRows, modeled: true },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
  ];
}

// --- the city's ONE headline score (the masthead badge) ---------------------

/**
 * Build the city's single 0-100 attractiveness score from the same board inputs.
 * This is the city-altitude sibling of the cell masthead's break-in rating: one
 * number, higher = a better city to open a small business in, banded on the
 * exact same thresholds so the badge reads identically on both mastheads.
 *
 * It maps the board's own signals onto the score's inputs: demand depth
 * (population, the income proxy the demand section already resolves, and the
 * footfall proxy), market structure (the country self-employment share that
 * drives the board's informality row), rent pressure (the cost-of-living index),
 * and the survival baseline (the London representative one-year survival rate
 * where we hold a curve). The pure scoring math, the normalization anchors, and
 * the banding all live in city_attractiveness.ts; this is the thin adapter from
 * the board's input shape to the score's.
 *
 * Returns null when the city carries no demand signal at all, so a thin city
 * shows no badge rather than a confident wrong number. restsOnModeled is true
 * whenever the score leans on a modeled input: the country-level informality
 * proxy and the cost-of-living index are modeled, so any real city scored here
 * rests on modeled inputs and the surface marks it as directional.
 */
export function buildCityScore(
  input: CityBoardInput,
): CityAttractivenessScore | null {
  const { city, econ } = input;
  const L = londonSummary(city.slug);

  // Income proxy mirrors the demand section exactly: the city's own annual gross
  // salary, falling back to the country's annualised monthly salary.
  const cityIncome = isNum(city.avgGrossSalaryUsdYear)
    ? city.avgGrossSalaryUsdYear
    : null;
  const countryIncome =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const incomeProxy = cityIncome ?? countryIncome;

  return cityAttractivenessScore({
    popM: city.popM,
    incomeProxyUsdYear: incomeProxy,
    touristArrivalsM: city.touristArrivalsM,
    costOfLivingIndex: city.costOfLivingIndex,
    selfEmploymentPct: econ?.selfEmploymentPct ?? null,
    survivalYr1Pct: L?.survival?.yr1 ?? null,
    // The score always leans on at least one modeled input for a real city (the
    // country-level informality proxy and the modeled cost-of-living index), so
    // it is directional by construction.
    restsOnModeled: true,
  });
}

// --- ranked activities table (the page's main content, not a board section) --

/**
 * One row of the "activities in this city" table: an activity, its break-in
 * read (the same 0..100 score the activity shows on its own cell masthead),
 * what its owner keeps after tax (USD), an optional net margin, and the cell URL
 * to open for the full numbers. Ranked by breakInScore descending (easiest to
 * break in first) by buildCityActivities.
 */
export interface CityActivityRow {
  /** Display name, e.g. "Dental practices". */
  name: string;
  /** URL slug, e.g. "dental-practices" (already hyphenated). */
  slug: string;
  /** Cell-page href, e.g. "/gb/london/dental-practices". */
  href: string;
  /** Break-in score, integer 0..100, or null when no trusted local cell exists. */
  breakInScore: number | null;
  /** The band word driving the per-row badge tone, or null. */
  breakInBand: BreakInBand | null;
  /** After-tax owner take-home, USD, or null (never invented). */
  takeHome: number | null;
  /** Net margin, percent (0..100), or null. */
  netMarginPct: number | null;
}

/** The minimum number of scored activities before the city table is worth
 * showing. Below this the page omits the section entirely (a one or two row
 * "ranking" is not a ranking), matching the country break-in panel's floor. */
const MIN_CITY_ACTIVITY_ROWS = 3;

/** The ten everyday trades shown on every city, in a stable order. Each resolves
 * to a real industry in the taxonomy. Pharmacies are intentionally absent (not
 * modeled yet, founder 2026-06-08); revisit when a pharmacies industry exists. */
const POPULAR_TRADES: string[] = [
  "restaurants",
  "grocery_stores",
  "doctors_clinics",
  "auto_repair_shops",
  "hairdressers_beauty",
  "clothing_stores",
  "cafes_coffee",
  "bars_nightclubs",
  "dental_practices",
  "sports_fitness",
];

/**
 * The cell's after-tax owner take-home AND its displayed net margin percent,
 * derived EXACTLY as the cell page does (estimateNetProfit + resolveOwnerTakeHome
 * over the cell's own revenue and per-firm payroll, with the same n_employees
 * unit-detection), so the city table never disagrees with the cell page. Returns
 * nulls when no defensible figure exists. The take-home value is the same one the
 * break-in score is computed from, so the badge and the secondary figure agree.
 */
function takeHomeAndMarginForCell(
  cell: Cell,
  annualIncome: number | null,
): { takeHome: number | null; netMarginPct: number | null } {
  const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (!isNum(revenue) || revenue <= 0) {
    return { takeHome: null, netMarginPct: null };
  }

  // Per-firm payroll, with the same unit-detection the cell page uses (a source
  // may store n_employees as a firm total or already per-firm).
  let payroll: number | null = null;
  if (isNum(cell.payroll_per_employee) && isNum(cell.n_employees)) {
    const empPerFirm =
      isNum(cell.n_enterprises) && cell.n_enterprises > 0
        ? cell.n_employees < cell.n_enterprises
          ? cell.n_employees // already per-firm
          : cell.n_employees / cell.n_enterprises
        : cell.n_employees;
    payroll = cell.payroll_per_employee * Math.max(1, empPerFirm);
  }

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: cell.industry_id || null,
    sectorId: cell.sector_id || null,
    grossRevenue: revenue,
    payroll,
  });
  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const takeHome = resolveOwnerTakeHome({
    structuralNetProfit: net.net_profit,
    rawNetMargin: net.net_margin,
    revenue,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });
  // Net margin (percent form) through the same clamp the cell page's margin row
  // applies (net.net_margin is a fraction, clampNetMarginPct takes a percent), so
  // a table row can never surface an implausible or sub-floor margin either.
  const netMarginPct = isNum(net.net_margin)
    ? clampNetMarginPct(net.net_margin * 100, cell.industry_id || null)
    : null;
  return { takeHome, netMarginPct };
}

/**
 * Build the ranked activities table for a city, by owner take-home (highest
 * first). The masthead's 0..100 score already answers "easiest to break in", so
 * this table answers the complementary question, "what earns the most here", and
 * the two never duplicate. The break-in read still travels on every row (shown as
 * a badge) so ease stays visible alongside the income ranking.
 *
 * Every city goes through the cell engine, exactly like the country page's
 * "easiest to break into here" panel does at the country geo. For each of the
 * city's candidate activities we resolve its destination cell under the city's
 * own slug, keep it only when it is a TRUSTED LOCAL measurement of the activity
 * it claims (isTrustedLocalCell drops synthetic, extrapolated tier "X", and
 * national-aggregate cells, so no invented number ever ranks), score it through
 * the SAME break-in path the cell masthead uses (breakInForCell), and compute its
 * owner take-home + net margin through the SAME single source of truth the cell
 * page uses. Rows are deduped by industry, sorted by owner take-home descending
 * (ties by break-in descending), and the whole list self-omits (empty array)
 * when fewer than three activities resolve a defensible score, so a thin city's
 * page drops the section cleanly rather than show a one-row "ranking".
 *
 * Async because it reads the engine (getTopIndustriesForCountry + getCellBySlug,
 * each budgeted so a slow read degrades that one activity, not the page). London
 * is no longer a curated special case for this table: it resolves through the
 * engine like every other city.
 */
export async function buildCityActivities(input: {
  slug: string;
  countryIso2: string;
}): Promise<CityActivityRow[]> {
  const citySlug = input.slug;
  const iso2Upper = input.countryIso2.toUpperCase();
  const iso2Lower = input.countryIso2.toLowerCase();

  // The country wage proxy the break-in score and the larger-firm take-home floor
  // both read, annualised from the monthly salary, exactly as every other surface.
  const econSnap = getCountryEconomicsSnapshot(iso2Upper);
  const annualIncome =
    isNum(econSnap.avgMonthlySalary) ? econSnap.avgMonthlySalary * 12 : null;

  // The fixed slate of everyday trades (founder 2026-06-08), each resolved to its
  // destination cell UNDER THE CITY SLUG. Unlike the old densest-first ranking,
  // the slate is constant so every city shows the same recognisable businesses.
  const resolved = await Promise.all(
    POPULAR_TRADES.map(async (industryId) => {
      const activitySlug = industryToSlug(industryId);
      const cell = await withBudget(
        getCellBySlug(iso2Lower, citySlug, activitySlug, {
          sizeBand: null,
          year: null,
        }),
        null,
        4_000,
        `city-activities:${iso2Lower}/${citySlug}/${industryId}`,
      );
      return { industryId, activitySlug, cell };
    }),
  );

  const rows: CityActivityRow[] = [];
  let withFigures = 0;
  for (const r of resolved) {
    const ind = INDUSTRY_BY_ID[r.industryId];
    const name = ind?.name ?? r.activitySlug.replace(/-/g, " ");
    const base = {
      name,
      slug: r.activitySlug,
      href: `/${iso2Lower}/${citySlug}/${r.activitySlug}`,
    };

    const cell = r.cell;

    // London is the sanctioned fully-filled exemplar. Its per-activity economics
    // live in the curated dataset (the same source the cell page prefers), not in
    // a trusted DB cell, so resolve London's take-home + margin from there and
    // score break-in from the resolved cell when one exists. Without this London's
    // cells fail the trusted-local gate and the flagship city renders emptier than
    // New York (owners-keep dashed, the break-in strip gone).
    if (citySlug === "london") {
      const ec = LONDON.activities[r.activitySlug]?.economics;
      if (ec && isNum(ec.owner_take_home)) {
        const rating = cell ? breakInForCell(cell, citySlug, annualIncome) : null;
        withFigures += 1;
        rows.push({
          ...base,
          breakInScore: rating?.score ?? null,
          breakInBand: rating?.band ?? null,
          takeHome: ec.owner_take_home,
          netMarginPct: isNum(ec.net_margin_pct)
            ? clampNetMarginPct(ec.net_margin_pct, r.industryId)
            : null,
        });
        continue;
      }
    }

    // No wrong numbers: only a trusted local measurement of the exact activity it
    // claims may carry figures (this drops synthetic, extrapolated tier "X", and
    // national-aggregate cells). A trade without one stays on the slate with a
    // dash rather than a borrowed or invented number.
    if (cell && isTrustedLocalCell(cell, r.industryId)) {
      const rating = breakInForCell(cell, citySlug, annualIncome);
      const { takeHome, netMarginPct } = takeHomeAndMarginForCell(cell, annualIncome);
      if (rating != null && isNum(takeHome)) {
        withFigures += 1;
        rows.push({
          ...base,
          breakInScore: rating.score,
          breakInBand: rating.band,
          takeHome,
          netMarginPct,
        });
        continue;
      }
    }
    rows.push({
      ...base,
      breakInScore: null,
      breakInBand: null,
      takeHome: null,
      netMarginPct: null,
    });
  }

  // Common-sense outlier guard. Some "per firm" revenues are establishment
  // aggregates (a US grocery cell read $4.5M per firm, so its owner take-home
  // came out at ~$497K, 5x the next everyday trade and 10x the rest, and topped
  // the ranking). We do not surface a single-site take-home that is wildly out of
  // line with the comparable trades in the SAME city: a figure that is both a
  // large multiple of the cohort median AND above a single-owner-draw ceiling is
  // almost certainly an aggregate, so we dash it rather than rank a wrong number.
  const figured = rows.map((r) => r.takeHome).filter(isNum).sort((a, b) => a - b);
  if (figured.length >= 3) {
    const median = figured[Math.floor(figured.length / 2)];
    const OUTLIER_MULTIPLE = 3;
    const SINGLE_OWNER_CEILING = 250_000;
    for (const row of rows) {
      if (
        isNum(row.takeHome) &&
        row.takeHome > SINGLE_OWNER_CEILING &&
        row.takeHome > median * OUTLIER_MULTIPLE
      ) {
        row.takeHome = null;
        row.netMarginPct = null; // its twin money figure goes too
        withFigures -= 1;
      }
    }
  }

  // A slate of all dashes is not worth showing; require at least three real reads.
  if (withFigures < MIN_CITY_ACTIVITY_ROWS) return [];

  // By owner take-home, highest first, so the most lucrative everyday trades lead;
  // trades without a figure sink to the bottom, break-in score breaking ties.
  rows.sort((a, b) => {
    const ta = a.takeHome ?? -Infinity;
    const tb = b.takeHome ?? -Infinity;
    if (tb !== ta) return tb - ta;
    return (b.breakInScore ?? -Infinity) - (a.breakInScore ?? -Infinity);
  });
  return rows;
}
