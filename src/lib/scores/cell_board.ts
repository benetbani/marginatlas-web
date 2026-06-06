/**
 * src/lib/scores/cell_board.ts
 *
 * Pure synthesis for the full A-J data board that leads the cell page. Turns
 * the numbers the page has already computed into the fixed, ten-section board
 * the reader can learn once and read on every page.
 *
 * This is the successor to cell_dashboard.ts. The crucial difference is the
 * board CONTRACT: every section and every row is ALWAYS present, in a fixed
 * order. A datum we do not hold is emitted as a null value, which the board's
 * StatGrid renders as the MISSING dash. The board is a scaffold, not a
 * data-shaped silhouette: its shape never depends on which figures exist, so a
 * blank reads as "we do not have this field" rather than "this page is broken".
 * (cell_dashboard.ts did the opposite, omitting empty rows and sections; that
 * "hide weakness" rule is intentionally dropped for the board.)
 *
 * Sections, in fixed order, ALWAYS emitted:
 *   A  numbers         The money: revenue, margins, take-home, break-even, people
 *   B  market          Competitors, density, structure (modeled)
 *   C  pricing         Pricing power and premium room (modeled)
 *   D  deformation     Market deformation: informality, distortion (modeled)
 *   E  tax             Tax and climate: corporate tax, registration
 *   F  friction        Institutional friction (modeled)
 *   G  demand          Demand depth: income, customers, mix (modeled)
 *   H  location        Location and rent (modeled)
 *   I  labor           Labor and skills (modeled)
 *   J  survival        Survival and fragility (modeled)
 *
 * Charts are attached where the spec calls for them (A: spread + cost bar;
 * B: crowding gauge; H: rent gauge; J: survival curve). Each chart self-omits
 * (returns null) when its core data is absent, so attaching one unconditionally
 * is safe.
 *
 * Pure module: no Supabase, no fs, no runtime side effects. Cell is a type-only
 * import; the taxonomy helper and the static London JSON are pure lookups, so
 * this stays trivially testable and cannot trip the layering gate (which only
 * walks src/app + src/components). Charts are built with React.createElement so
 * the module is plain TypeScript (no JSX), keeping it a .ts file.
 */
import * as React from "react";
import type { Cell } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtPct, fmtInt, fmtNum } from "@/components/board/format";
import { SpreadBar } from "@/components/board/charts/SpreadBar";
import { CostBar } from "@/components/board/charts/CostBar";
import { CrowdingGauge } from "@/components/board/charts/CrowdingGauge";
import { RentGauge } from "@/components/board/charts/RentGauge";
import { SurvivalCurve } from "@/components/board/charts/SurvivalCurve";
import {
  clampMargin,
  clampNetMarginPct,
  boundSurvivalCurve,
  displayDensityPer10k,
} from "@/lib/finance/margin_floor";
import londonJson from "../../../data/london/london_market_v1.json";

/**
 * One curated London activity entry. Modeled from national business
 * demography (see the JSON's source_note); treated as directional on the page.
 * Re-exported from here so the board is the single owner of this shape now that
 * cell_dashboard.ts is retired.
 */
export type LondonEntry = {
  typology: string;
  chain_share_pct: number;
  concentration: string;
  informality: string;
  survival: { yr1: number; yr3: number; yr5: number };
  churn_pct: number;
  pricing_power: string;
  demand_drivers: string[];
  seasonality: string;
  rent_pressure: string;
  labor_pressure: string;
  /**
   * Modeled London economics for this activity (USD). Present only on London
   * cells; when present the board PREFERS these over the country-fallback
   * figures for the money and market rows (see buildCellBoard).
   */
  economics?: {
    revenue: number;
    net_margin_pct: number;
    owner_take_home: number;
    firms: number;
  };
};

type LondonFile = {
  activities: Record<string, LondonEntry>;
  /** London resident population, used for the per-10k density figure. */
  london_population: number;
};

const LONDON = londonJson as LondonFile;

/** London resident population for density math (firms per 10k residents). */
const LONDON_POPULATION = LONDON.london_population;

/**
 * Look up the curated London entry for a cell. Only GB cells qualify; the
 * activity is keyed by the cell industry's URL slug. Returns null for non-GB
 * cells and for GB activities not present in the dataset.
 */
export function getLondonEntry(cell: Cell): LondonEntry | null {
  if (cell.country !== "GB") return null;
  if (!cell.industry_id) return null;
  const slug = industryToSlug(cell.industry_id);
  return LONDON.activities[slug] ?? null;
}

export interface CellBoardInput {
  cell: Cell;
  /** Typical (median) revenue per firm, display currency (USD on the board). */
  typicalRevenue: number | null;
  /** Bottom-decile and top-decile revenue anchors, for the range + spread. */
  revP10: number | null;
  revP90: number | null;
  /** Industry margins (shares, 0..1). */
  grossMarginPct: number | null;
  operatingMarginPct: number | null;
  netMarginPct: number | null;
  /** After-tax owner take-home (USD), already floored by the page. */
  ownerTakeHome: number | null;
  /** Break-even and typical daily order counts (from computeBreakeven). */
  breakevenOrdersDaily: number | null;
  typicalOrdersDaily: number | null;
  /** People working at a typical firm and the wage per employee (USD). */
  peopleWorking: number | null;
  wagePerEmployee: number | null;
  /** Residents in the geo when it is a known city; null for state/region. */
  cityPopulation: number | null;
  /** Country economics snapshot (getCountryEconomicsSnapshot). */
  econ: {
    gdpPerCapita: number | null;
    avgMonthlySalary: number | null;
    daysToStart: number | null;
  } | null;
  /** Effective corporate income-tax rate (share, 0..1) from net_profit, or null. */
  corporateTaxRate: number | null;
  /** cell.cost_structure: percent (0..100) or fraction (0..1) shares. */
  costStructure: { cogs: number; labor: number; rent: number; other: number } | null;
  /** Curated London entry, or null (non-GB / not in dataset). */
  londonEntry: LondonEntry | null;
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
 * Normalise a cost share to a whole-number percent (0..100). The cell
 * cost_structure may arrive as percentages (0..100) or fractions (0..1); a
 * value at or below 1 is treated as a fraction and scaled. Non-finite returns
 * null.
 */
function pctShare(v: number | null | undefined): number | null {
  if (!isNum(v)) return null;
  const pct = v <= 1 ? v * 100 : v;
  return Math.round(pct);
}

/**
 * Competitors per 10k residents, or null when either input is missing. The
 * same density math cell_dashboard used: firms divided by (residents / 10k).
 */
function densityPer10k(
  competitors: number | null | undefined,
  cityPopulation: number | null | undefined,
): number | null {
  if (!isNum(competitors)) return null;
  if (!isNum(cityPopulation) || cityPopulation <= 0) return null;
  const per10k = competitors / (cityPopulation / 10000);
  return Math.round(per10k * 10) / 10;
}

/**
 * Map a density-per-10k figure onto a 0..100 crowding score for the gauge,
 * where higher means MORE crowded. Saturates at 25 firms per 10k residents
 * (a dense high-street category). Null in, null out, so the gauge self-omits.
 */
function crowdingScore(per10k: number | null): number | null {
  if (!isNum(per10k)) return null;
  return Math.max(0, Math.min(100, Math.round((per10k / 25) * 100)));
}

/**
 * Build the full A-J board for a cell. Deterministic and side-effect free:
 * the same inputs always yield the same ten sections, every section and every
 * row present, in the fixed order documented at the top of the file.
 */
export function buildCellBoard(input: CellBoardInput): BoardSection[] {
  const {
    cell,
    typicalRevenue,
    revP10,
    revP90,
    grossMarginPct,
    operatingMarginPct,
    netMarginPct,
    ownerTakeHome,
    breakevenOrdersDaily,
    typicalOrdersDaily,
    peopleWorking,
    wagePerEmployee,
    cityPopulation,
    econ,
    corporateTaxRate,
    costStructure,
    londonEntry,
  } = input;

  const L = londonEntry;
  // Modeled London economics, present only on a London cell. When set, the
  // money rows (A) and the market rows (B) prefer these real London figures
  // over the country-fallback values the page passed in. When absent (every
  // non-London cell), the board behaves exactly as before.
  const LE = L?.economics ?? null;

  // London revenue anchors drive both the A revenue row and the SpreadBar:
  // p10 = half the median, p90 = 1.8x the median, median = the modeled figure.
  const lonRevenue = LE ? LE.revenue : null;
  const lonRevP10 = LE ? LE.revenue * 0.5 : null;
  const lonRevP90 = LE ? LE.revenue * 1.8 : null;

  // Effective revenue triple (median, p10, p90), London-first then the
  // country fallback, computed ONCE so the "Typical revenue" row, the
  // "Revenue range" row, and the SpreadBar always read the same numbers and
  // can never disagree.
  //
  // Suppression coupling (founder data-quality rule): per-firm revenue above
  // the industry plausibility ceiling is nulled upstream by the shared
  // plausibility chokepoint, so an implausible cell arrives here with a null
  // median. When the median is missing we MUST NOT show a range or a spread
  // around a number we are dashing: a null median forces the p10/p90 anchors
  // to null too, so the range row dashes and the SpreadBar self-omits. London
  // medians (LE.revenue) are always present and well inside the ceiling, so
  // London is unaffected. The dash is honest, never a capped/invented figure.
  const effMedian = isNum(lonRevenue) ? lonRevenue : isNum(typicalRevenue) ? typicalRevenue : null;
  const effRevP10 =
    effMedian == null ? null : isNum(lonRevP10) ? lonRevP10 : isNum(revP10) ? revP10 : null;
  const effRevP90 =
    effMedian == null ? null : isNum(lonRevP90) ? lonRevP90 : isNum(revP90) ? revP90 : null;

  // -- A. The numbers --------------------------------------------------------
  // Revenue per employee, derived once (typical revenue spread over the people
  // working at a typical firm).
  const revenuePerEmployee =
    isNum(effMedian) && isNum(peopleWorking) && peopleWorking > 0
      ? effMedian / peopleWorking
      : null;

  const rentSharePct = costStructure ? pctShare(costStructure.rent) : null;
  const laborSharePct = costStructure ? pctShare(costStructure.labor) : null;

  // Net-margin sanity clamp. The displayed net margin always passes through the
  // shared margin clamp (floor 3%, per-industry hard ceiling) so it can never
  // render an implausible value, whichever shape it arrived in: the curated
  // London figure is a whole-number percent (clampNetMarginPct), the country
  // fallback is a fraction (clampMargin). Computed once here as a FRACTION and
  // formatted in the row below, so an out-of-band net margin is impossible.
  const netMarginFraction =
    LE && isNum(LE.net_margin_pct)
      ? clampNetMarginPct(LE.net_margin_pct, cell.industry_id ?? null) / 100
      : isNum(netMarginPct)
        ? clampMargin(netMarginPct, "net", cell.industry_id ?? null)
        : null;

  // Margin-ladder guard. On a London cell the net margin is the modeled London
  // figure while gross and operating stay on the structural inputs, so a
  // high-net activity could otherwise print net above operating (or gross). The
  // net floor suppresses any structural margin that would sit below it, so the
  // displayed ladder is always gross >= operating >= net. Off London cells the
  // floor is null and both margins show unchanged. The floor uses the CLAMPED
  // London net fraction, so the guard tracks the same bounded number the net
  // row prints (scope unchanged: still null on every non-London cell).
  const netFloorFraction =
    LE && isNum(LE.net_margin_pct) ? netMarginFraction : null;
  const showOperatingMargin =
    isNum(operatingMarginPct) &&
    (netFloorFraction == null || operatingMarginPct >= netFloorFraction);
  const showGrossMargin =
    isNum(grossMarginPct) &&
    (netFloorFraction == null || grossMarginPct >= netFloorFraction) &&
    (!showOperatingMargin ||
      (isNum(operatingMarginPct) && grossMarginPct >= operatingMarginPct));

  const numbersRows: StatRow[] = [
    {
      label: "Typical revenue",
      value: isNum(effMedian) ? fmtUSD(effMedian) : null,
      hint: "median firm",
    },
    {
      label: "Revenue range",
      value:
        isNum(effRevP10) && isNum(effRevP90)
          ? `${fmtUSD(effRevP10)} to ${fmtUSD(effRevP90)}`
          : null,
      hint: "bottom tenth to top tenth",
    },
    {
      label: "Gross margin",
      value: showGrossMargin
        ? fmtPct(grossMarginPct, { fromFraction: true })
        : null,
    },
    {
      label: "Operating margin",
      value: showOperatingMargin
        ? fmtPct(operatingMarginPct, { fromFraction: true })
        : null,
    },
    {
      label: "Net margin",
      value: isNum(netMarginFraction)
        ? fmtPct(netMarginFraction, { fromFraction: true })
        : null,
    },
    {
      label: "Owner take-home",
      value: LE && isNum(LE.owner_take_home)
        ? fmtUSD(LE.owner_take_home)
        : isNum(ownerTakeHome)
          ? fmtUSD(ownerTakeHome)
          : null,
    },
    {
      label: "Break-even",
      value: isNum(breakevenOrdersDaily)
        ? `${Math.round(breakevenOrdersDaily)} orders/day`
        : null,
      hint: isNum(typicalOrdersDaily)
        ? `vs ${Math.round(typicalOrdersDaily)} typical`
        : undefined,
    },
    {
      label: "People working",
      value: isNum(peopleWorking) ? fmtInt(peopleWorking) : null,
    },
    {
      label: "Revenue per employee",
      value: isNum(revenuePerEmployee) ? fmtUSD(revenuePerEmployee) : null,
    },
    {
      label: "Wage per employee",
      value: isNum(wagePerEmployee) ? fmtUSD(wagePerEmployee) : null,
    },
  ];

  // Two charts for A: the revenue spread (p10..median..p90) and, when the cost
  // split is present, a single stacked cost bar. The board renders one chart
  // node per section, so stack both in a fragment; each self-omits when empty.
  const costShares = costStructure
    ? [
        { label: "COGS", pct: pctShare(costStructure.cogs) ?? 0 },
        { label: "Labor", pct: laborSharePct ?? 0 },
        { label: "Rent", pct: rentSharePct ?? 0 },
        { label: "Other", pct: pctShare(costStructure.other) ?? 0 },
      ]
    : null;

  const numbersChart = React.createElement(
    React.Fragment,
    null,
    React.createElement(SpreadBar, {
      // Same effective triple as the rows above: a suppressed (null) median
      // forces p10/p90 to null, so the bar self-omits rather than drawing a
      // spread around a number we are dashing.
      p10: effRevP10,
      median: effMedian,
      p90: effRevP90,
    }),
    React.createElement(CostBar, { shares: costShares }),
  );

  // -- B. The market (modeled) ----------------------------------------------
  // Competitor COUNT is place-specific and real-only. A cell that fell back to
  // the country level (geo_level "country"), or is synthesized / extrapolated,
  // carries a national or estimated firm count, not a local one, so the absolute
  // "Competitors" figure is suppressed there rather than implying a local count
  // under a city title. It returns only for a genuinely local measurement.
  //
  // A London cell is the documented exception: when modeled London economics are
  // present (LE), the firm count and the REAL density come from the curated
  // London figures, so it is treated as local even though the underlying cell
  // falls back to the country level.
  //
  // DENSITY is the blended "room to enter" signal and aims NOT to dash. It is
  // REAL (firms per 10k residents) when the cell is a trusted local measurement
  // (the shared four-way trust gate) AND both a local firm count and a
  // population are held; otherwise it is MODELED from the per-industry archetype
  // on the same firms-per-10k scale, labelled modeled on the row. The archetype
  // is already a per-10k rate, so it applies directly whether or not this place
  // has a population on file; population only matters for deriving a real count,
  // which we never fabricate. Either way the figure passes the same display
  // sanity cap, so a modeled value can never sit outside the band a real one is
  // allowed to show.
  const isLondonLocal = LE != null;
  // Real local firm count: London's curated figure, else the cell's own count
  // but ONLY when the cell is a trusted local measurement of this activity (not
  // a country aggregate, not synthesized, not the extrapolated tier).
  const trustedLocal = isLondonLocal || isTrustedLocalCell(cell);
  const competitors = isLondonLocal
    ? LE.firms
    : trustedLocal
      ? (cell.n_enterprises ?? null)
      : null;
  // Real density: only from a trusted-local cell holding both a firm count and a
  // population. London uses its curated population; every other cell uses the
  // city population the page resolved (null for a state/region slug).
  const realPer10k = isLondonLocal
    ? densityPer10k(LE.firms, LONDON_POPULATION)
    : trustedLocal
      ? densityPer10k(competitors, cityPopulation)
      : null;
  const realPer10kDisplay = displayDensityPer10k(realPer10k);
  // Modeled fallback: the per-industry archetype, used for the Density row (and
  // the crowding gauge) wherever a real local density is not available. Directional.
  const modeledPer10k = densityArchetypePer10k(cell.industry_id ?? null);
  // The figure the row + gauge actually use: real where we have it, else modeled.
  const densityIsModeled = !isNum(realPer10kDisplay);
  const per10kDisplay = densityIsModeled ? modeledPer10k : realPer10kDisplay;
  // The gauge reads the same blended density (real raw where held, else modeled),
  // so it saturates on a real reading but is no longer empty on a modeled one.
  const gaugePer10k = densityIsModeled ? modeledPer10k : realPer10k;

  const marketRows: StatRow[] = [
    {
      label: "Competitors",
      value: isNum(competitors) ? fmtInt(competitors) : null,
      hint: "firms in this market",
    },
    {
      label: "Density",
      value: isNum(per10kDisplay)
        ? `${fmtNum(per10kDisplay)} per 10k residents`
        : null,
      // Quiet honesty marker: when the density is the per-industry archetype
      // rather than this place's own firm count, the row says so.
      hint: densityIsModeled && isNum(per10kDisplay) ? "modeled" : undefined,
    },
    { label: "Market structure", value: L ? textOrNull(L.typology) : null },
    { label: "Concentration", value: L ? textOrNull(L.concentration) : null },
    {
      label: "Chain share",
      value: L && isNum(L.chain_share_pct) ? `${L.chain_share_pct}% of the market` : null,
    },
    {
      label: "Annual churn",
      value: L && isNum(L.churn_pct) ? `${L.churn_pct}% per year` : null,
    },
  ];
  const marketChart = React.createElement(CrowdingGauge, {
    value: crowdingScore(gaugePer10k),
  });

  // -- C. Pricing power (modeled) -------------------------------------------
  const pricingRows: StatRow[] = [
    { label: "Pricing power", value: L ? textOrNull(L.pricing_power) : null },
    { label: "Premium room", value: null },
    { label: "Willingness to pay", value: null },
    { label: "Price dispersion", value: null },
    { label: "Tourism premium", value: null },
  ];

  // -- D. Market deformation (modeled) --------------------------------------
  const deformationRows: StatRow[] = [
    { label: "Informality", value: L ? textOrNull(L.informality) : null },
    { label: "Tax-evasion normalization", value: null },
    { label: "Rent speculation", value: null },
    { label: "Tourism distortion", value: null },
    { label: "Platform-fee drag", value: null },
    { label: "Enforcement", value: null },
    { label: "Cash-economy share", value: null },
  ];

  // -- E. Tax and climate ----------------------------------------------------
  const taxRows: StatRow[] = [
    {
      label: "Corporate tax",
      value: isNum(corporateTaxRate)
        ? fmtPct(corporateTaxRate, { fromFraction: true })
        : null,
    },
    { label: "VAT", value: null },
    { label: "Payroll tax", value: null },
    { label: "Effective tax wedge", value: null },
    {
      label: "Days to register",
      value: econ && isNum(econ.daysToStart) ? `${Math.round(econ.daysToStart)} days` : null,
    },
    { label: "Licensing cost", value: null },
    { label: "Permit complexity", value: null },
  ];

  // -- F. Institutional friction (modeled) ----------------------------------
  const frictionRows: StatRow[] = [
    { label: "Bribery exposure", value: null },
    { label: "Inspection risk", value: null },
    { label: "Permit bottlenecks", value: null },
    { label: "Contract enforceability", value: null },
  ];

  // -- G. Demand depth (modeled) --------------------------------------------
  const localIncome =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const demandRows: StatRow[] = [
    {
      label: "Local income",
      value: isNum(localIncome) ? fmtUSD(localIncome) : null,
      hint: "per year",
    },
    {
      label: "Addressable customers",
      value: isNum(cityPopulation) ? fmtInt(cityPopulation) : null,
      hint: "residents",
    },
    { label: "Tourism intensity", value: null },
    {
      label: "Commuter/student/office mix",
      value:
        L && Array.isArray(L.demand_drivers) && L.demand_drivers.length > 0
          ? L.demand_drivers.join(", ")
          : null,
    },
    { label: "B2B density", value: null },
    { label: "Search/footfall proxy", value: null },
  ];

  // -- H. Location and rent (modeled) ---------------------------------------
  const locationRows: StatRow[] = [
    {
      label: "Rent share of revenue",
      value: isNum(rentSharePct) ? fmtPct(rentSharePct) : null,
    },
    { label: "Rent pressure", value: L ? textOrNull(L.rent_pressure) : null },
    { label: "Commercial rent level", value: null },
    { label: "High-street viability", value: null },
    { label: "Tourist-zone premium", value: null },
    { label: "Catchment", value: null },
  ];
  // Gauge value: rent share of revenue read directly as a 0..100 pressure
  // figure (rent share is already a percent). Null when unknown.
  const rentChart = React.createElement(RentGauge, {
    value: isNum(rentSharePct) ? Math.max(0, Math.min(100, rentSharePct)) : null,
  });

  // -- I. Labor and skills (modeled) ----------------------------------------
  const laborRows: StatRow[] = [
    {
      label: "Payroll share of revenue",
      value: isNum(laborSharePct) ? fmtPct(laborSharePct) : null,
    },
    { label: "Labor pressure", value: L ? textOrNull(L.labor_pressure) : null },
    { label: "Hiring difficulty", value: null },
    { label: "Turnover", value: null },
    { label: "Owner-operator dependence", value: null },
    { label: "Minimum-wage pressure", value: null },
  ];

  // -- J. Survival and fragility (modeled) ----------------------------------
  // Bound the curve once (0 <= yr5 <= yr3 <= yr1 <= 100; non-finite dashes) so
  // the rows and the chart share one sanitised triple and can never disagree
  // or print an impossible (rising or out-of-range) survival curve.
  const survival = boundSurvivalCurve(L?.survival ?? {});
  const survivalRows: StatRow[] = [
    {
      label: "1-year survival",
      value: isNum(survival.yr1) ? `${survival.yr1}%` : null,
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
    { label: "Seasonality", value: L ? textOrNull(L.seasonality) : null },
    { label: "Minimum viable scale", value: null },
    { label: "Rent-shock sensitivity", value: null },
  ];
  const survivalChart = React.createElement(SurvivalCurve, {
    yr1: survival.yr1,
    yr3: survival.yr3,
    yr5: survival.yr5,
  });

  return [
    { key: "numbers", title: "The numbers", rows: numbersRows, chart: numbersChart },
    { key: "market", title: "The market", rows: marketRows, modeled: true, chart: marketChart },
    { key: "pricing", title: "Pricing power", rows: pricingRows, modeled: true },
    { key: "deformation", title: "Market deformation", rows: deformationRows, modeled: true },
    { key: "tax", title: "Tax and climate", rows: taxRows },
    { key: "friction", title: "Institutional friction", rows: frictionRows, modeled: true },
    { key: "demand", title: "Demand depth", rows: demandRows, modeled: true },
    { key: "location", title: "Location and rent", rows: locationRows, modeled: true, chart: rentChart },
    { key: "labor", title: "Labor and skills", rows: laborRows, modeled: true },
    { key: "survival", title: "Survival and fragility", rows: survivalRows, modeled: true, chart: survivalChart },
  ];
}
