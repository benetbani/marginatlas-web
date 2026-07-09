/**
 * src/lib/scores/country_board.ts
 *
 * Pure synthesis for the data board that leads the country page (/gb, /de, /jp).
 * It is the country-altitude sibling of cell_board.ts and follows the exact
 * same contract, so a reader who has learned the cell board reads this one for
 * free:
 *
 *   - Every section and every row is ALWAYS present, in a fixed order. A datum
 *     we do not hold is emitted as a null value, which the board's StatGrid
 *     renders as the MISSING dash. The board is a scaffold, not a data-shaped
 *     silhouette: its shape never depends on which figures exist, so a blank
 *     reads as "we do not have this field" rather than "this page is broken".
 *   - Honest dashes beat invented numbers. The country page holds only a small
 *     set of real country-level figures (the economics snapshot plus the two
 *     tax rates the page already loads); every row beyond those is null, never
 *     a fabricated stand-in.
 *   - Sections that lean on modeled / directional inputs carry `modeled: true`,
 *     which renders one quiet footnote per section, not a badge per row.
 *
 * Sections, in fixed order, ALWAYS emitted:
 *   demand     Demand depth (modeled): market size, purchasing power, customer wealth
 *   labor      Labor and skills (modeled): wages, skills
 *   market     Market structure (modeled): informality, concentration
 *   friction   Institutional friction (modeled)
 *   survival   Survival baseline (modeled): country-level business survival
 *
 * The tax + registration read (sales tax, the small-business regime, and the
 * days to register a business) is NOT a board section. It lives once, in the
 * CountryTaxReality panel further down the page, which carries the richest
 * worked-figure treatment. The board used to duplicate those rows in a
 * "climate" section; that section was removed so the figures appear in exactly
 * one place.
 *
 * Pure module: no Supabase, no fs, no runtime side effects. The board consumes
 * numbers the country page has already computed (the economics snapshot, the
 * SMB tax regime, the headline sales tax) and shapes them into rows; it does
 * not fetch. Kit types are type-only imports, exactly like cell_board.ts, so
 * this stays trivially testable and cannot trip the layering gate (which only
 * walks src/app + src/components). No chart is attached at the country level
 * today, so the module stays plain TypeScript with no React dependency.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD } from "@/components/board/format";
import type { Cell } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import {
  timeToOpenWeeks,
  placeAdjustedPermitsUsd,
} from "@/lib/markets/opening_archetypes";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import { displayDensityPer10k } from "@/lib/finance/margin_floor";
import { getCityCostOfLivingIndex, getCityPopulation } from "@/lib/cities/city_tier";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { getLondonEntry } from "@/lib/scores/cell_board";
import {
  computeBreakInRating,
  type BreakInBand,
} from "@/lib/scores/break_in_rating";

/**
 * The country-level economics the board reads. This is the shape the country
 * page already holds from getCountryEconomicsSnapshot, narrowed to the fields
 * the board uses. Every field is nullable; a null becomes a dash.
 */
export interface CountryBoardEcon {
  /** GDP per capita, USD, latest year. */
  gdpPerCapita: number | null;
  /** Average gross monthly salary, USD. */
  avgMonthlySalary: number | null;
  /** Median net wealth per adult, USD. */
  netWealthPerAdult: number | null;
  /** Self-employment share of total employment, percent (0..100). */
  selfEmploymentPct: number | null;
  /** Typical days to register a sole-trader business. */
  daysToStart: number | null;
  /** CPI year-over-year, percent (e.g. 2.4 for 2.4%). */
  inflationPctYoy: number | null;
}

export interface CountryBoardInput {
  /** Country-economics snapshot, or null when the country has no entry. */
  econ: CountryBoardEcon | null;
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

/** A present, non-empty qualitative string, else null (so the row blanks). */
function textOrNull(s: string | null | undefined): string | null {
  return typeof s === "string" && s.trim().length > 0 ? s : null;
}

/**
 * Build the full country board. Deterministic and side-effect free: the same
 * inputs always yield the same five sections, every section and every row
 * present, in the fixed order documented at the top of the file.
 */
export function buildCountryBoard(input: CountryBoardInput): BoardSection[] {
  const { econ } = input;

  // Avoid an unused-helper warning while keeping textOrNull available for the
  // qualitative rows that are null today and will carry words once curated.
  void textOrNull;

  // The tax + registration read (sales tax, the small-business regime, and the
  // days to register a business) is NOT built here. It lives once, in the
  // CountryTaxReality panel further down the page. The former "climate"
  // section is intentionally gone so those figures appear in exactly one place.

  // -- friction. Institutional friction (modeled). -------------------------
  const frictionRows: StatRow[] = [
    { label: "Enforcing contracts", value: null },
    { label: "Bureaucracy", value: null },
    { label: "Permits", value: null },
    { label: "Bribery exposure", value: null },
    { label: "Inspection risk", value: null },
  ];

  // -- demand. Demand depth (modeled). -------------------------------------
  // Market size (population) is not held at country altitude today, so it
  // dashes (a data-phase slot). Purchasing power reads off GDP per capita and
  // customer wealth off the median net wealth per adult; both move here from
  // the labor / market sections so the board leads with the size and depth of
  // the opportunity, mirroring the cell and city boards' demand section.
  const demandRows: StatRow[] = [
    { label: "Market size", value: null, hint: "population" },
    {
      label: "Purchasing power",
      value: econ && isNum(econ.gdpPerCapita) ? fmtUSD(econ.gdpPerCapita) : null,
      hint: "GDP per capita",
    },
    {
      label: "Customer wealth",
      value: econ && isNum(econ.netWealthPerAdult) ? fmtUSD(econ.netWealthPerAdult) : null,
      hint: "net wealth per adult",
    },
  ];

  // -- labor. Labor and skills (modeled). ----------------------------------
  // Average wage comes from the snapshot's monthly salary (annualized for the
  // yearly read). GDP per head moved up to the demand section. Skills and
  // hiring are qualitative rows we do not yet hold, so they blank.
  const annualWage =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const laborRows: StatRow[] = [
    {
      label: "Average wage",
      value: isNum(annualWage) ? fmtUSD(annualWage) : null,
      hint: "per year",
    },
    {
      label: "Monthly salary",
      value: econ && isNum(econ.avgMonthlySalary) ? fmtUSD(econ.avgMonthlySalary) : null,
    },
    { label: "Skills availability", value: null },
    { label: "Hiring difficulty", value: null },
    { label: "Minimum-wage pressure", value: null },
  ];

  // -- survival. Survival baseline (modeled). ------------------------------
  // Country-level business survival is not held today; the rows are present so
  // the field is named, and blank so nothing is invented. Filled in a later
  // sub-project (the data-phase modeled fills).
  const survivalRows: StatRow[] = [
    { label: "1-year survival", value: null },
    { label: "3-year", value: null },
    { label: "5-year", value: null },
    { label: "Closure rate", value: null },
  ];

  // -- market. Market structure (modeled). ---------------------------------
  // Informality reads off the snapshot's self-employment share. Net wealth
  // moved up to the demand section as customer wealth; inflation was dropped
  // (not central to a start-a-business decision). Concentration is a
  // qualitative summary we do not yet hold.
  const marketRows: StatRow[] = [
    {
      label: "Informality",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}% self-employed`
          : null,
    },
    { label: "Concentration", value: null },
    { label: "Chain share", value: null },
  ];

  return [
    { key: "demand", title: "Demand depth", rows: demandRows, modeled: true },
    { key: "labor", title: "Labor and skills", rows: laborRows, modeled: true },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
    { key: "friction", title: "Institutional friction", rows: frictionRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
  ];
}

/* ===========================================================================
 * Easiest businesses to break into here (the place-level break-in ranking)
 * ===========================================================================
 *
 * The flip side of the across-cities comparison: that surface fixes ONE
 * business and ranks PLACES; this one fixes ONE place and ranks the place's own
 * BUSINESSES by the single break-in rating (0..100, higher = easier to break in
 * and win). It answers the question a buyer landing on a country or city asks:
 * "of the activities here, which are the easiest to get started in?".
 *
 * The score is the SAME number the business's own cell masthead shows. It is
 * computed for the EXACT cell the panel links to (the place's destination cell
 * for that activity), through the SAME functions the masthead uses:
 *   - owner take-home: resolveOwnerTakeHome over estimateNetProfit on the cell's
 *     own revenue (London prefers its curated take-home), the single take-home
 *     source of truth;
 *   - entry capital + permits: the place-adjusted modeled archetypes, adjusted by
 *     the city's cost-of-living index when the geo is a known city, else a
 *     country wage proxy, exactly as the cell board does;
 *   - time to open: the place-invariant modeled archetype;
 *   - density: the real local firms-per-10k where the cell is a trusted local
 *     measurement holding both a firm count and a population, else the modeled
 *     per-industry archetype, mirroring the cell board's density blend;
 *   - computeBreakInRating folds them, payback dominant, into the one score.
 * So the badge on this panel and the badge on that cell's masthead are the same.
 *
 * HONESTY GUARD (no wrong numbers): a destination cell enters the ranking only
 * when it is the activity it claims (it carries the expected industry_id, so a
 * slug that misrouted onto a parent or sibling cell is dropped rather than ranked
 * under the requested name) and is not the synthesized always-render stand-in.
 * The rating module itself then refuses to score without a real take-home and a
 * real entry capital, so a thin activity gets a null score and is omitted, never
 * shown as a confident wrong one. The panel self-omits entirely when fewer than a
 * few activities resolve a score, so the page never shows a one-row "ranking".
 *
 * Pure: the cell resolution happens in the page (a bounded, budgeted set of
 * reads, the same pattern across_cities.ts uses); this builder only does the math
 * over already-resolved cells, so country_board.ts stays free of Supabase and the
 * page stays a thin renderer.
 */

/** One resolved destination cell plus the activity it is meant to represent. */
export interface PlaceActivityCell {
  /** The expected taxonomy industry id for this activity (e.g. "restaurants"). */
  industryId: string;
  /** The activity's display name, for the panel row. */
  industryName: string;
  /** The cell getCellBySlug resolved for this place + activity, or null on a miss. */
  cell: Cell | null;
}

/** Country economics the break-in panel needs: the country wage proxy source. */
export interface PlaceBreakInEcon {
  /** Average gross monthly salary, USD (annualized for the place wage proxy). */
  avgMonthlySalary: number | null;
}

export interface EasiestBreakInInput {
  /** ISO2 country slug (lowercased) for the cell-page links. */
  iso2: string;
  /**
   * The geo slug the destination cells were resolved under and the panel links
   * to (e.g. "california" for the US, the country-name slug otherwise). Drives
   * the place cost-of-living adjustment and the real-density population read,
   * exactly as the cell board's geo does, so the score matches that geo's masthead.
   */
  geo: string;
  /** The place's activities, each with its resolved destination cell. */
  activities: PlaceActivityCell[];
  /** Country economics snapshot (for the country wage proxy). */
  econ: PlaceBreakInEcon | null;
}

/** One ranked business in the "easiest to break into here" panel. */
export interface EasiestBreakInRow {
  industryId: string;
  industryName: string;
  /** Friendly URL slug for the cell-page link. */
  industrySlug: string;
  /** The cell-page href for this activity in this place. */
  href: string;
  /** The single break-in score, 0..100, higher = easier. Always present here. */
  score: number;
  /** The band word driving the badge tone (moss / atlas / clay). */
  band: BreakInBand;
  /**
   * The cost-to-open ("/opening") href, set ONLY when the destination cell is a
   * TRUSTED LOCAL measurement (the same isTrustedLocalCell gate buildOpeningPage
   * applies). For aggregate / extrapolated cells the /opening sub-page notFound()s,
   * so this is null and the panel renders no "Cost to open" link for that row. The
   * row itself (its cell-page link and ranking) is still shown, in line with the
   * cell page's own "gate the link, not the surface" rule; only the cross-link
   * that would land on a not-found page is withheld.
   */
  openingHref: string | null;
}

/**
 * The cell's after-tax owner take-home, derived EXACTLY as the cell page does
 * (estimateNetProfit + resolveOwnerTakeHome over the cell's own revenue and
 * per-firm payroll), so the break-in score this feeds matches the masthead. The
 * larger-firm 2x floor uses the country average income; the size band is read
 * off the cell (a place-level destination cell carries a null band, so the floor
 * never fires, matching the masthead). Returns null when no take-home is defensible.
 */
export function ownerTakeHomeForCell(cell: Cell, annualIncome: number | null): number | null {
  const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  if (!isNum(revenue) || revenue <= 0) return null;

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
  return resolveOwnerTakeHome({
    structuralNetProfit: net.net_profit,
    rawNetMargin: net.net_margin,
    revenue,
    industryId: cell.industry_id || null,
    isLargerFirm,
    annualIncome,
  });
}

/**
 * The single break-in rating for one resolved destination cell in a place, or
 * null when it cannot be defended. Mirrors buildCellBoard's break-in inputs
 * exactly (place-adjusted capital + permits, modeled time, real-or-modeled
 * density, the cell's real take-home), so the score equals that cell's masthead.
 */
export function breakInForCell(
  cell: Cell,
  geo: string,
  annualIncome: number | null,
): {
  score: number;
  band: BreakInBand;
  startupCostUsd: number;
  permitsUsd: number;
  densityPer10k: number;
} | null {
  const industryId = cell.industry_id ?? null;
  const costOfLivingIndex = getCityCostOfLivingIndex(geo);
  const avgYearlySalary = isNum(annualIncome) ? annualIncome : null;

  // Owner take-home: London prefers its curated figure (matching the cell board),
  // else the structural take-home over the cell's own revenue.
  const london = getLondonEntry(cell)?.economics ?? null;
  const takeHome =
    london && isNum(london.owner_take_home)
      ? london.owner_take_home
      : ownerTakeHomeForCell(cell, annualIncome);

  // Entry capital + permits: the place-adjusted modeled archetypes (the same
  // figures the "What it takes to open" rows show on the masthead).
  const startupCapitalUsd = placeAdjustedStartupCapital({
    industryId,
    costOfLivingIndex,
    avgYearlySalary,
  });
  const permitsUsd = placeAdjustedPermitsUsd({
    industryId,
    costOfLivingIndex,
    avgYearlySalary,
  });

  // Density: the blended firms-per-10k the cell board feeds the rating. It is
  // REAL (firms divided by residents per 10k) only when the cell is a trusted
  // local measurement holding both a firm count and a population AND the figure
  // passes the same display sanity cap the board applies (a wrong-scale count
  // dashes there and falls back to the archetype, so we mirror that here to stay
  // exactly on the masthead's number); otherwise it is the modeled per-industry
  // archetype. London's curated population path lives on the cell page; the
  // archetype is the safe place-level fallback for a London read here.
  let realPer10k: number | null = null;
  if (london == null) {
    const pop = getCityPopulation(geo);
    if (isTrustedLocalCell(cell) && isNum(cell.n_enterprises) && isNum(pop) && pop > 0) {
      realPer10k = displayDensityPer10k(
        Math.round((cell.n_enterprises / (pop / 10_000)) * 10) / 10,
      );
    }
  }
  const densityPer10k = isNum(realPer10k)
    ? realPer10k
    : densityArchetypePer10k(industryId);

  const rating = computeBreakInRating({
    startupCapitalUsd,
    permitsUsd,
    annualOwnerTakeHomeUsd: takeHome,
    timeToOpenWeeks: timeToOpenWeeks(industryId),
    densityPer10k,
    // The entry capital and crowding lean on modeled estimates, so the rating is
    // directional, matching the board everywhere.
    restsOnModeled: true,
  });
  if (rating == null) return null;
  return {
    score: rating.score,
    band: rating.band,
    startupCostUsd: startupCapitalUsd,
    permitsUsd,
    densityPer10k,
  };
}

/** The minimum number of scored activities before the panel is worth showing. */
const MIN_PANEL_ROWS = 3;

/**
 * Build the "easiest businesses to break into here" ranking for a place, easiest
 * first. Each destination cell is scored through breakInForCell (the masthead's
 * own score), kept only when it is the activity it claims and is not synthesized,
 * and sorted by score descending. Ties keep the input order (the place's own
 * activity order, densest first). Returns an empty array when fewer than a few
 * activities resolve a score, so the caller can self-omit the whole panel.
 *
 * Each row also carries an openingHref: the "/opening" cross-link, set only when
 * the cell passes the stricter isTrustedLocalCell gate (the one buildOpeningPage
 * uses). Aggregate / extrapolated cells render a cell page but their /opening
 * notFound()s, so those rows keep their cell-page link and ranking but withhold
 * the cost-to-open link, instead of being dropped from the panel.
 */
export function buildEasiestToBreakIn(
  input: EasiestBreakInInput,
): EasiestBreakInRow[] {
  const { iso2, geo, activities, econ } = input;
  const annualIncome =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;

  const rows: EasiestBreakInRow[] = [];
  const seen = new Set<string>();
  for (const a of activities) {
    const cell = a.cell;
    if (!cell) continue;
    // Row membership (no wrong numbers): the destination cell must be the activity
    // it claims (no misroute onto a parent/sibling) and must not be the synthesized
    // stand-in. This is deliberately NOT the stricter trusted-local gate: country
    // pages resolve national-aggregate cells that still render a real cell page,
    // and dropping them would empty the panel on most countries. The /opening
    // cross-link is what gets gated below, not the row.
    if (cell.industry_id !== a.industryId) continue;
    if (cell.is_synthetic) continue;
    if (seen.has(a.industryId)) continue;

    const rating = breakInForCell(cell, geo, annualIncome);
    if (rating == null) continue; // null take-home or capital: omit, never guess

    seen.add(a.industryId);
    const slug = industryToSlug(a.industryId);
    const href = `/${iso2.toLowerCase()}/${geo}/${slug}`;
    // The cost-to-open cross-link is gated on the STRICTER isTrustedLocalCell, the
    // exact predicate buildOpeningPage uses. An aggregate / extrapolated cell
    // renders a cell page but its /opening sub-page notFound()s, so for those we
    // withhold the link (openingHref null) rather than drop the row, the same
    // "gate the link, not the surface" rule the cell page's cost-to-open link uses.
    const openingHref = isTrustedLocalCell(cell, a.industryId)
      ? `${href}/opening`
      : null;
    rows.push({
      industryId: a.industryId,
      industryName: a.industryName,
      industrySlug: slug,
      href,
      score: rating.score,
      band: rating.band,
      openingHref,
    });
  }

  if (rows.length < MIN_PANEL_ROWS) return [];
  rows.sort((x, y) => y.score - x.score);
  return rows;
}
