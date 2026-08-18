/**
 * src/lib/scores/cell_board.ts
 *
 * Resolves ONE figure: a cell's break-in rating, the single 0-100 headline
 * score the cell masthead, the opening page and the spine adapter all read. It
 * folds the real one-time entry cost (or the place-adjusted modeled archetype),
 * the modeled permits and calendar, the real-or-modeled competitor density, and
 * the cell's real after-tax owner take-home into `computeBreakInRating`, and
 * hands back the rating or null.
 *
 * Everything is derived ONCE here rather than at each of the four call sites,
 * which is the point of the module: the masthead score, the opening page's
 * score, the spine adapter's score and the cell view's phrase are the same
 * number by construction and cannot drift apart.
 *
 * THE A-J SECTION BOARD USED TO LIVE HERE AND WAS DELETED 2026-08-18.
 * `buildCellBoard` also returned `sections`, ten fixed sections of stat rows
 * with five charts attached, about 350 lines of it. All four callers
 * destructured `breakInRating` alone, checked at every one, so those rows were
 * built on every cell render and dropped. They had already been retired
 * deliberately into the content-map sections (WS3) and the cell page said so in
 * a comment; what was left behind was the production of data nobody consumed,
 * which is how a retired surface gets rendered again by someone who assumes it
 * was meant to be there.
 *
 * Deleted, not left: the rows, the five charts, the revenue triple, the margin
 * ladder and its London floor guard, the cost split, the survival triple, the
 * paywall redaction branch, and the thirteen inputs that fed only those.
 *
 * WHAT THE DELETION COULD NOT HAVE CHANGED, measured rather than argued. The
 * rating was snapshotted over a deterministic 4,000-combination grid that
 * varies EVERY input field, including the thirteen believed not to feed it, so
 * a missed dependency surfaces as a diff instead of as an assumption. The two
 * runs generate identical rating-relevant inputs (same seeded sequence) and the
 * second simply does not pass the deleted ones. 3,476 of the 4,000 produce a
 * rating, across 47 distinct scores, and the output is byte-identical.
 *
 * Pure module: no Supabase, no fs, no React, no runtime side effects. Cell is a
 * type-only import; the taxonomy helper and the static London JSON are pure
 * lookups, so this stays trivially testable and cannot trip the layering gate.
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE AND STAYS THERE.
 * Reclassified 2026-08-18 after the deletion above, because the old evidence
 * described a printed surface that no longer exists. verify_take_home_identity
 * matches a module that names a take-home, does not import the resolver, and
 * reaches for one of its derive signals. This one still matches on
 * `net_margin_pct`, which survives ONLY as a field of the `LondonEntry` type
 * describing the curated JSON's shape. It is not read here any more: after the
 * deletion the module touches exactly two London economics fields,
 * `owner_take_home` and `firms`. `clampMargin` and `clampNetMarginPct` went
 * with the margin rows, so the module no longer clamps, formats or prints any
 * margin at all.
 *
 * It receives rather than derives. All four callers pass `ownerTakeHome`
 * straight out of `resolveOwnerTakeHome` and it reaches the rating untouched;
 * on a London cell the curated `owner_take_home` is preferred, and that figure
 * is re-derived as revenue x net_margin_pct at load by src/lib/london/market.ts
 * precisely so it cannot contradict its own margin.
 */
import type { Cell } from "@/lib/cells";
import { industryToSlug } from "@/lib/taxonomy";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import {
  timeToOpenWeeks,
  placeAdjustedPermitsUsd,
} from "@/lib/markets/opening_archetypes";
import {
  computeBreakInRating,
  type BreakInRating,
} from "@/lib/scores/break_in_rating";
import { displayDensityPer10k } from "@/lib/finance/margin_floor";
import { LONDON_MARKET } from "@/lib/london/market";

/**
 * One curated London activity entry. Modeled from national business
 * demography (see the JSON's source_note); treated as directional on the page.
 * Re-exported from here so this module is the single owner of the shape now
 * that cell_dashboard.ts is retired. Most of these fields are consumed by other
 * surfaces, not here: this module reads `economics.owner_take_home` and
 * `economics.firms` and nothing else.
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
   * cells; when present the rating PREFERS `owner_take_home` over the passed
   * take-home, and `firms` over the cell's own count.
   *
   * `owner_take_home` here is ALWAYS revenue x net_margin_pct: the raw file
   * stores a fourth, independent figure that contradicted its own margin on all
   * twenty activities, and src/lib/london/market.ts re-derives it at load. Read
   * that module before trusting or changing either number.
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

const LONDON = LONDON_MARKET as LondonFile;

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

/**
 * Everything the rating needs, and nothing else. Thirteen further fields lived
 * here until 2026-08-18 (the revenue triple, the three margins, the two
 * break-even counts, headcount and wage, the corporate tax rate, the cost
 * split and the paywall's cellRef) and every one fed only the deleted section
 * rows. Each call site was computing some of them purely to fill this argument.
 */
export interface CellBoardInput {
  cell: Cell;
  /**
   * After-tax owner take-home (USD) straight out of `resolveOwnerTakeHome`.
   * The dominant term of the rating: without it, or without a capital figure,
   * the rating refuses to score and returns null rather than guessing.
   */
  ownerTakeHome: number | null;
  /** Residents in the geo when it is a known city; null for state/region. */
  cityPopulation: number | null;
  /**
   * The geo's cost-of-living index (NYC = 100) when it is a known city; null
   * for a state/region slug. Place-adjusts the modeled entry capital and the
   * modeled permits so the same business reads higher in a costly metro than in
   * a cheap one. When null, both fall back to the country wage proxy from
   * `econ` before the flat baseline.
   */
  cityCostOfLivingIndex: number | null;
  /**
   * A trustworthy REAL one-time startup / formation cost for this cell (USD), or
   * null when none is held. When present (and the cell passes the trusted-local
   * gate) it is PREFERRED over the modeled place-adjusted archetype, exactly as
   * the density blend prefers a real local density. No such real per-cell source
   * exists yet, so in practice this is null everywhere and the capital is
   * modeled, which is what sets `restsOnModeled` on the rating.
   */
  realStartupCostUsd?: number | null;
  /**
   * Country economics snapshot (getCountryEconomicsSnapshot). Only
   * `avgMonthlySalary` is read, as the country wage proxy behind both
   * place-adjusted figures. The snapshot is accepted whole because every caller
   * already holds it, so narrowing further would save them no work.
   */
  econ: {
    avgMonthlySalary: number | null;
  } | null;
  /** Curated London entry, or null (non-GB / not in dataset). */
  londonEntry: LondonEntry | null;
}

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
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
 * What buildCellBoard hands back. Kept as an object with one field rather than
 * flattened to a bare `BreakInRating | null`, deliberately: all four call sites
 * already read `const { breakInRating } = buildCellBoard(...)`, so the shape
 * costs nothing and flattening it would churn four files for no reader.
 */
export interface CellBoardResult {
  /** The single headline break-in rating, or null when core inputs are missing. */
  breakInRating: BreakInRating | null;
}

/**
 * Resolve a cell's break-in rating. Deterministic and side-effect free: the
 * same inputs always yield the same score, or null when the two figures the
 * rating refuses to guess (a real take-home and a real-or-modeled capital) are
 * not both present.
 */
export function buildCellBoard(input: CellBoardInput): CellBoardResult {
  const {
    cell,
    ownerTakeHome,
    cityPopulation,
    cityCostOfLivingIndex,
    realStartupCostUsd,
    econ,
    londonEntry,
  } = input;

  const L = londonEntry;
  // Modeled London economics, present only on a London cell. When set, the
  // take-home and the firm count prefer these curated London figures over the
  // country-fallback values the page passed in. When absent (every non-London
  // cell), the resolution behaves exactly as it always has.
  const LE = L?.economics ?? null;

  // Capital to start: the one-time entry capital, and with the take-home the
  // dominant term of the rating's payback. A trustworthy REAL startup /
  // formation cost is preferred, but ONLY when the cell is a trusted local
  // measurement (the shared four-way trust gate), so a country aggregate or an
  // extrapolated cell can never put a "real" figure under a local title.
  // Otherwise the figure is the MODELED per-industry archetype, place-adjusted
  // by the city's cost-of-living index (NYC = 100) when known, else a country
  // wage proxy, else the baseline, all inside a capped multiplier band so
  // neither the cheapest nor the priciest place produces an absurd entry
  // figure. The archetype always returns a finite, bounded value. Taking the
  // modeled branch is what marks the rating as resting on modeled inputs, which
  // is how the surfaces know to read the score as directional.
  const hasRealStartupCost =
    isNum(realStartupCostUsd) &&
    realStartupCostUsd > 0 &&
    isTrustedLocalCell(cell);
  // The country wage proxy (annualised average salary) is the second-choice
  // place signal for every place-adjusted opening figure, used when the geo is a
  // state/region slug with no city cost-of-living index. Derived once here so
  // the capital and the permits place-adjust off the same number.
  const countryWageProxy =
    econ && isNum(econ.avgMonthlySalary) ? econ.avgMonthlySalary * 12 : null;
  const modeledStartupCost = placeAdjustedStartupCapital({
    industryId: cell.industry_id ?? null,
    costOfLivingIndex: cityCostOfLivingIndex,
    avgYearlySalary: countryWageProxy,
  });
  const startupCostIsModeled = !hasRealStartupCost;
  const startupCost = hasRealStartupCost
    ? (realStartupCostUsd as number)
    : modeledStartupCost;

  // Owner take-home, resolved once: the curated London figure when present, else
  // the page's floored after-tax take-home straight out of resolveOwnerTakeHome.
  // Nothing is derived from it here; it is the rating's dominant term and it
  // reaches computeBreakInRating untouched.
  const realTakeHome =
    LE && isNum(LE.owner_take_home)
      ? LE.owner_take_home
      : isNum(ownerTakeHome)
        ? ownerTakeHome
        : null;

  // Permits and the calendar: modeled archetypes, permits place-adjusted off the
  // SAME place signals the capital uses (city cost-of-living index, else the
  // country wage proxy), time to open place-invariant. Both always return a
  // finite, bounded figure.
  const openTimeWeeks = timeToOpenWeeks(cell.industry_id ?? null);
  const openPermitsUsd = placeAdjustedPermitsUsd({
    industryId: cell.industry_id ?? null,
    costOfLivingIndex: cityCostOfLivingIndex,
    avgYearlySalary: countryWageProxy,
  });

  // Density, the "room to enter" term. REAL (firms per 10k residents) when the
  // cell is a trusted local measurement AND both a local firm count and a
  // population are held; otherwise MODELED from the per-industry archetype on
  // the same firms-per-10k scale. The archetype is already a per-10k rate, so it
  // applies directly whether or not this place has a population on file;
  // population only matters for deriving a real count, which we never fabricate.
  // Either way the figure passes the same display sanity cap, so a modeled value
  // can never sit outside the band a real one is allowed to show.
  //
  // A London cell is the documented exception: when modeled London economics are
  // present the firm count and the real density come from the curated London
  // figures, so it counts as local even though the underlying cell falls back to
  // the country level.
  const isLondonLocal = LE != null;
  const trustedLocal = isLondonLocal || isTrustedLocalCell(cell);
  const competitors = isLondonLocal
    ? LE.firms
    : trustedLocal
      ? (cell.n_enterprises ?? null)
      : null;
  const realPer10k = isLondonLocal
    ? densityPer10k(LE.firms, LONDON_POPULATION)
    : trustedLocal
      ? densityPer10k(competitors, cityPopulation)
      : null;
  const realPer10kDisplay = displayDensityPer10k(realPer10k);
  const modeledPer10k = densityArchetypePer10k(cell.industry_id ?? null);
  const densityIsModeled = !isNum(realPer10kDisplay);
  const per10kDisplay = densityIsModeled ? modeledPer10k : realPer10kDisplay;

  // The break-in rating: one 0-100 number, higher = easier to break in and win.
  //   - entry capital: the real trusted cost where held, else the place-adjusted
  //     modeled archetype;
  //   - permits + time: the modeled, place-adjusted opening archetypes;
  //   - density: the real local firms-per-10k where held, else the modeled
  //     archetype;
  //   - annual owner take-home: the cell's REAL after-tax figure (London prefers
  //     its curated one), passed straight through. The module refuses to score
  //     without a real take-home AND a real capital, so a thin cell shows no
  //     score rather than a confident wrong one.
  // restsOnModeled is true when the capital or the density is the modeled branch
  // (it almost always is), which marks the rating directional on the surface.
  const breakInRating = computeBreakInRating({
    startupCapitalUsd: isNum(startupCost) ? startupCost : null,
    permitsUsd: isNum(openPermitsUsd) ? openPermitsUsd : null,
    annualOwnerTakeHomeUsd: realTakeHome,
    timeToOpenWeeks: isNum(openTimeWeeks) ? openTimeWeeks : null,
    densityPer10k: isNum(per10kDisplay) ? per10kDisplay : null,
    restsOnModeled: startupCostIsModeled || densityIsModeled,
  });

  return { breakInRating };
}
