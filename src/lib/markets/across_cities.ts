/**
 * src/lib/markets/across_cities.ts
 *
 * Server-side data builder for the programmatic "one business across the
 * world's cities" comparison (route /industries/[industry]/across). It is the
 * STATIC, single-business sibling of the interactive /compare grid: where that
 * lets a reader pick three arbitrary cells, this one fixes the activity and
 * shows it side by side across a curated slate of major world cities, with the
 * best place marked per decisive row.
 *
 * DATA INTEGRITY is the whole job here. Cross-country extrapolated reads are
 * poisoned (inflated tails, plus World-Bank aggregate non-places), so this
 * builder NEVER ranks raw country aggregates. It resolves each (city, activity)
 * pair through getCellBySlug and keeps a city ONLY when the resolved cell is a
 * real measurement of THIS activity: it must resolve, carry the expected
 * industry_id, and not be synthetic. That is the exact guard pattern the
 * homepage beats use (src/lib/home/beats.ts), reused verbatim so the two
 * surfaces agree on what "trustworthy" means. A city that misses any guard
 * self-omits, so a comparison only ever shows the business across the places
 * where the data is genuinely real.
 *
 * Every figure is computed the same way the cell page, the activity board, and
 * the homepage beats compute it: typical revenue straight off the resolved
 * cell; owner take-home and net margin from the shared tax-aware estimator
 * (London-curated economics preferred where present), floored by the shared
 * margin clamp; break-even from the shared estimator with the city's urban
 * tier; competitor density only for a genuinely local cell, sanity-capped;
 * survival from the curated archetype where one is held. So the comparison
 * speaks the board's language and can never disagree with a city's own page.
 *
 * Build-safe by construction: every read is wrapped in withBudget(), so a slow
 * or failed query degrades that one city to "did not resolve" (it omits) rather
 * than hanging the route. Supabase access stays in the lib layer.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import {
  getCellBySlug,
  cellUrl,
  withBudget,
  type Cell,
} from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { clampMargin, clampNetMarginPct, boundSurvivalCurve, displayDensityPer10k } from "@/lib/finance/margin_floor";
import { computeBreakeven } from "@/lib/economics/breakeven";
import { getCityTier, getCityCostOfLivingIndex } from "@/lib/cities/city_tier";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import { getLondonEntry } from "@/lib/scores/cell_board";
import { getActivitySurvivalArchetype } from "@/lib/scores/activity_board";
import { INDUSTRY_BY_ID, industryToSlug } from "@/lib/taxonomy";

/**
 * The curated major-world-city slate the comparison draws from. Each entry is
 * the city's friendly URL slug (the geo part of a cell URL, e.g. /us/miami/...)
 * plus the country it sits in and the resident population used for the density
 * read. Drawn from the canonical top-cities list (top100.json ids); a deliberate
 * spread across regions and price tiers so a business reads honestly worldwide,
 * not just across one continent. Cities that do not resolve cleanly for a given
 * activity self-omit, so over-providing here is safe.
 */
export interface CityRef {
  /** Friendly geo slug, the {geo} segment of /{country}/{geo}/{activity}. */
  slug: string;
  /** ISO2 country slug, lowercased for the cell lookup. */
  country: string;
  /** Display fallback when a resolved cell carries no geo_name. */
  name: string;
  /** Resident population (metro), for the firms-per-10k density read. */
  population: number;
}

export const MAJOR_CITIES: CityRef[] = [
  { slug: "new-york", country: "us", name: "New York", population: 19_500_000 },
  { slug: "los-angeles", country: "us", name: "Los Angeles", population: 13_200_000 },
  { slug: "chicago", country: "us", name: "Chicago", population: 9_400_000 },
  { slug: "miami", country: "us", name: "Miami", population: 6_300_000 },
  { slug: "toronto", country: "ca", name: "Toronto", population: 6_400_000 },
  { slug: "london", country: "gb", name: "London", population: 9_500_000 },
  { slug: "paris", country: "fr", name: "Paris", population: 11_200_000 },
  { slug: "madrid", country: "es", name: "Madrid", population: 6_700_000 },
  { slug: "barcelona", country: "es", name: "Barcelona", population: 5_600_000 },
  { slug: "berlin", country: "de", name: "Berlin", population: 3_700_000 },
  { slug: "amsterdam", country: "nl", name: "Amsterdam", population: 2_500_000 },
  { slug: "tokyo", country: "jp", name: "Tokyo", population: 37_400_000 },
  { slug: "sydney", country: "au", name: "Sydney", population: 5_400_000 },
  { slug: "dubai", country: "ae", name: "Dubai", population: 3_500_000 },
  { slug: "singapore", country: "sg", name: "Singapore", population: 5_900_000 },
];

/** A finite, positive real. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/** A finite real (allows zero and negatives). */
function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Typical revenue for a cell: the median-firm figure, exactly as the cell page,
 * the activity table, and the homepage beats read it.
 */
function typicalRevenueOf(cell: Cell): number | null {
  const r = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
  return isPos(r) ? r : null;
}

/**
 * After-tax owner take-home and net margin (fraction, 0..1) for a cell,
 * computed exactly as src/lib/home/beats.ts ownerEconomicsOf: prefer the
 * curated London economics when present, else the shared tax-aware net-profit
 * estimator, with the shared net-margin floor applied so a sub-3% net can never
 * surface. The larger-firm take-home floor is intentionally not applied (an
 * all-sizes cell carries a null size band, so that floor never fired on the
 * cell page either).
 */
function ownerEconomicsOf(cell: Cell): {
  takeHome: number | null;
  netMarginFraction: number | null;
} {
  const revenue = typicalRevenueOf(cell);
  if (revenue == null) return { takeHome: null, netMarginFraction: null };

  const london = getLondonEntry(cell)?.economics ?? null;
  if (london) {
    return {
      takeHome: isPos(london.owner_take_home) ? london.owner_take_home : null,
      netMarginFraction: Number.isFinite(london.net_margin_pct)
        ? clampNetMarginPct(london.net_margin_pct, cell.industry_id ?? null) / 100
        : null,
    };
  }

  const net = estimateNetProfit({
    iso2: cell.country.toUpperCase(),
    geoId: cell.geo_id || null,
    industryId: cell.industry_id || null,
    sectorId: cell.sector_id || null,
    grossRevenue: revenue,
    payroll: null,
  });
  const takeHome = isPos(net.net_profit) ? net.net_profit : null;
  const netMarginFraction =
    net.net_margin != null
      ? clampMargin(net.net_margin, "net", cell.industry_id || null)
      : null;
  return { takeHome, netMarginFraction };
}

/**
 * Competitors per 10k residents for a cell, or null. Mirrors the cell-page
 * board (cell_board.ts): a real LOCAL firm count is required, so a cell that
 * fell back to the country level carries a national count, not a local one, and
 * the density is suppressed rather than implied under a city title. London is
 * the documented exception: its curated economics supply a real local firm
 * count even though the underlying cell falls back to the country level. The
 * figure is sanity-capped for display so a wrong-scale artifact dashes.
 */
function densityPer10kOf(cell: Cell, population: number): number | null {
  if (!isPos(population)) return null;
  const london = getLondonEntry(cell)?.economics ?? null;
  const isLocalCell = london != null || cell.geo_level !== "country";
  if (!isLocalCell) return null;
  const competitors = london ? london.firms : (cell.n_enterprises ?? null);
  if (!isPos(competitors)) return null;
  const per10k = competitors / (population / 10_000);
  return displayDensityPer10k(Math.round(per10k * 10) / 10);
}

/** One resolved city column: the decisive figures for this activity here. */
export interface CityColumn {
  /** Display name, the resolved cell's geo_name where present, else the ref. */
  name: string;
  /** ISO2 country slug (lowercased), for a small flag. */
  country: string;
  /** Link to this city's full cell page for the activity. */
  href: string;
  /** Typical (median-firm) yearly revenue, USD. */
  revenue: number | null;
  /** Bottom-decile / top-decile revenue anchors, for the spread bar. */
  revP10: number | null;
  revP90: number | null;
  /** After-tax owner take-home, USD. */
  takeHome: number | null;
  /** Net margin as a fraction (0..1), floored. */
  netMarginFraction: number | null;
  /** Competitors per 10k residents (local cells only), else null. */
  densityPer10k: number | null;
  /**
   * The modeled, place-adjusted one-time cost to open this activity here, USD.
   * The per-industry archetype scaled by this city's cost-of-living index (NYC =
   * 100) inside the capped multiplier band. Always present and bounded (it is a
   * pure model, never a per-place measurement), so it ranks cleanly across the
   * trusted slate without dashing. Directional, labelled modeled where shown.
   */
  startupCostUsd: number | null;
  /** Break-even orders per day, and the typical daily count, where held. */
  breakevenDaily: number | null;
  typicalDaily: number | null;
  /** Five-year survival percent (curated archetype), where held. */
  survivalYr5: number | null;
}

/**
 * One decisive comparison row. `value` resolves a column to its pre-formatted
 * display number (the caller routes it through the board's format helpers).
 * `numeric` resolves the same column to a raw comparable number (or null) for
 * the per-row best-place mark; `higherIsBetter` says which direction "best"
 * runs for the buyer (more take-home is good, lower density is room to enter).
 */
export interface AcrossMetric {
  key: string;
  label: string;
  hint?: string;
  numeric: (c: CityColumn) => number | null;
  higherIsBetter: boolean;
}

/**
 * The decisive rows, in the cell-board order: the money first, then the market,
 * then the floor (break-even), then durability. Competition density and
 * survival are held only where the data supports them; a column without the
 * figure shows the board dash, and a row with fewer than two real values simply
 * marks no winner.
 */
export const ACROSS_METRICS: AcrossMetric[] = [
  {
    key: "revenue",
    label: "Typical revenue",
    hint: "median firm, per year",
    numeric: (c) => c.revenue,
    higherIsBetter: true,
  },
  {
    key: "take_home",
    label: "Owner take-home",
    hint: "after tax",
    numeric: (c) => c.takeHome,
    higherIsBetter: true,
  },
  {
    key: "net_margin",
    label: "Net margin",
    numeric: (c) => c.netMarginFraction,
    higherIsBetter: true,
  },
  {
    key: "density",
    label: "Competition density",
    hint: "firms per 10k residents",
    numeric: (c) => c.densityPer10k,
    // Fewer competitors per resident is more room for a new operator: the
    // buyer reads low density as the easier place to break in.
    higherIsBetter: false,
  },
  {
    key: "breakeven",
    label: "Break-even",
    hint: "orders per day to cover fixed costs",
    numeric: (c) => c.breakevenDaily,
    // A lower break-even is a more forgiving floor.
    higherIsBetter: false,
  },
  {
    key: "survival",
    label: "5-year survival",
    numeric: (c) => c.survivalYr5,
    higherIsBetter: true,
  },
];

/** Where-to-break-in pick: the city with the best ease + reward balance. */
export interface BreakInPick {
  name: string;
  href: string;
  /** The reward leg (owner take-home) that anchors the pick. */
  takeHome: number;
  /** The ease leg actually used: "density" when held, else "break-even". */
  easeKind: "density" | "breakeven";
  /** The ease figure behind the pick (per-10k density, or orders/day). */
  easeValue: number;
  /** The honest catch: the row where this city is NOT the best place. */
  catch: { label: string; leaderName: string } | null;
}

/** The full payload the across page renders; null when too few cities resolve. */
export interface AcrossCitiesData {
  /** The activity, named for the headline ("Restaurants"). */
  activityName: string;
  /** The activity's URL slug, for the link back to the activity page. */
  activitySlug: string;
  /** The resolved city columns, richest revenue first. */
  cities: CityColumn[];
  /** The decisive rows to render. */
  metrics: AcrossMetric[];
  /**
   * Per-row best column index (into `cities`), or null when a row cannot be
   * ranked (fewer than two real values, or a tie spanning the whole row).
   */
  bestByMetric: Record<string, number | null>;
  /** The where-to-break-in pick, or null when no city carries both legs. */
  breakIn: BreakInPick | null;
}

/**
 * Resolve one city to a clean column for this activity, or null when it does
 * not resolve as a real, non-synthetic measurement of the expected activity.
 * THIS is the trust gate: the same guard the homepage beats apply. A null
 * column is dropped by the caller; it is never rendered as an empty or
 * estimated stand-in.
 */
async function resolveCity(
  city: CityRef,
  industrySlug: string,
  expectIndustryId: string,
  survivalYr5: number | null,
): Promise<CityColumn | null> {
  const cell = await withBudget(
    getCellBySlug(city.country, city.slug, industrySlug, {
      sizeBand: null,
      year: null,
    }),
    null,
    4_000,
    `across:${city.country}/${city.slug}/${industrySlug}`,
  );
  if (!cell) return null;
  // Trust gate: a column must be a real LOCAL measurement of the activity it
  // claims. This is the SHARED four-way guard (src/lib/cells/trust.ts), the same
  // definition the homepage beats and the extremes hub now apply, so every
  // surface agrees on what "trustworthy" means. Here we resolve arbitrary world
  // cities, where getCellBySlug falls back to extrapolated_cells and a
  // country-baseline fill: those cross-country reads are the poisoned source
  // (inflated tails, country aggregates wearing a city name) and carry
  // is_synthetic=false, so the right-activity-plus-not-synthetic guard alone let
  // them through (it did: Dubai/Sydney/Singapore surfaced $30M law firms). The
  // helper excludes FOUR ways, every one a real signal seen in the data:
  //   1. wrong activity   - slug misrouted onto another NAICS
  //   2. synthesized      - the always-render stand-in (is_synthetic)
  //   3. coverage_tier X  - the estimated/extrapolated tier (both the synthesis
  //      path and every extrapolated_cells / baseline path stamp "X"); real
  //      sub-national measurements are tier S or P
  //   4. country level    - a national aggregate resolved under a city slug
  // Curated London is tier P at lad level, so it is unaffected.
  if (!isTrustedLocalCell(cell, expectIndustryId)) return null;

  const revenue = typicalRevenueOf(cell);
  if (revenue == null) return null;

  const { takeHome, netMarginFraction } = ownerEconomicsOf(cell);
  const tier = getCityTier(city.slug);
  const be = cell.industry_id ? computeBreakeven(cell.industry_id, revenue, tier) : null;

  // Revenue spread anchors, London-first (matching the cell board), else the
  // cell's own deciles. A missing median already forced revenue to null above.
  const london = getLondonEntry(cell)?.economics ?? null;
  const revP10 = london ? london.revenue * 0.5 : (isPos(cell.rev_p10) ? cell.rev_p10 : null);
  const revP90 = london ? london.revenue * 1.8 : (isPos(cell.rev_p90) ? cell.rev_p90 : null);

  return {
    name: cell.geo_name || city.name,
    country: city.country,
    href: cellUrl(cell),
    revenue,
    revP10,
    revP90,
    takeHome,
    netMarginFraction,
    densityPer10k: densityPer10kOf(cell, city.population),
    // Modeled, place-adjusted cost to open here: the per-industry archetype
    // scaled by this city's cost-of-living index (NYC = 100), capped. The cell
    // carries the expected industry_id (the trust gate guarantees it), so the
    // archetype is keyed correctly. Always a finite, bounded figure.
    startupCostUsd: placeAdjustedStartupCapital({
      industryId: cell.industry_id || expectIndustryId,
      costOfLivingIndex: getCityCostOfLivingIndex(city.slug),
    }),
    breakevenDaily: be ? be.breakevenOrdersDaily : null,
    typicalDaily: be ? be.currentOrdersDaily : null,
    survivalYr5,
  };
}

/**
 * Best column index for a metric across the resolved cities, or null when it
 * cannot be honestly ranked: fewer than two real values, or every real value
 * tied (no single place wins). Direction follows the metric's higherIsBetter.
 */
function bestIndexFor(cities: CityColumn[], metric: AcrossMetric): number | null {
  const present = cities
    .map((c, i) => ({ i, v: metric.numeric(c) }))
    .filter((r): r is { i: number; v: number } => isNum(r.v));
  if (present.length < 2) return null;
  const values = present.map((r) => r.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return null; // flat row: no winner to mark
  const target = metric.higherIsBetter ? max : min;
  const winner = present.find((r) => r.v === target);
  return winner ? winner.i : null;
}

/**
 * The where-to-break-in pick. The buyer wants the best balance of ease of entry
 * and reward, so among cities that carry BOTH an ease read (low competition
 * density, else a forgiving break-even) and a reward read (owner take-home), it
 * picks the one whose reward-per-unit-of-difficulty is highest. The pick names
 * its honest catch: a decisive row where the chosen city is NOT the leader, so
 * the call to action never oversells.
 */
function pickBreakIn(
  cities: CityColumn[],
  bestByMetric: Record<string, number | null>,
): BreakInPick | null {
  type Cand = {
    idx: number;
    name: string;
    href: string;
    takeHome: number;
    easeKind: "density" | "breakeven";
    easeValue: number;
    score: number;
  };
  let best: Cand | null = null;

  for (let i = 0; i < cities.length; i++) {
    const c = cities[i];
    if (!isPos(c.takeHome)) continue;
    // Ease leg: prefer competition density (room in the market), fall back to
    // the break-even floor when density is not held. Both run "lower is easier".
    let easeKind: "density" | "breakeven" | null = null;
    let easeValue: number | null = null;
    if (isPos(c.densityPer10k)) {
      easeKind = "density";
      easeValue = c.densityPer10k;
    } else if (isPos(c.breakevenDaily)) {
      easeKind = "breakeven";
      easeValue = c.breakevenDaily;
    }
    if (easeKind == null || easeValue == null) continue;
    // Reward per unit of difficulty. Higher take-home and lower difficulty both
    // raise it, so the winner is the genuinely easiest-and-most-rewarding place.
    const score = c.takeHome / easeValue;
    if (!best || score > best.score) {
      best = { idx: i, name: c.name, href: c.href, takeHome: c.takeHome, easeKind, easeValue, score };
    }
  }
  if (!best) return null;

  // The catch: the first decisive row where the pick is genuinely beaten, named
  // honestly with whoever leads it. The pick optimises a RATIO (take-home per
  // unit of difficulty), so it is often not the raw leader on revenue, margin,
  // or durability, and naming that is the honest counterweight that stops the
  // call to action overselling. We skip only the two legs the pick directly
  // optimised: its own reward (take-home) and the ease leg it actually used
  // (density or break-even). Everything else is a fair catch, checked in the
  // order a buyer cares about: headline size, then profitability, then staying
  // power.
  const skip = new Set<string>(["take_home", best.easeKind === "density" ? "density" : "breakeven"]);
  let theCatch: { label: string; leaderName: string } | null = null;
  for (const key of ["revenue", "net_margin", "survival", "breakeven", "density"]) {
    if (skip.has(key)) continue;
    const leaderIdx = bestByMetric[key];
    if (leaderIdx == null || leaderIdx === best.idx) continue;
    const metric = ACROSS_METRICS.find((m) => m.key === key);
    if (!metric) continue;
    theCatch = { label: metric.label, leaderName: cities[leaderIdx].name };
    break;
  }

  return {
    name: best.name,
    href: best.href,
    takeHome: best.takeHome,
    easeKind: best.easeKind,
    easeValue: best.easeValue,
    catch: theCatch,
  };
}

/**
 * Build the full across-cities comparison for an activity, or null when fewer
 * than three cities resolve cleanly (the page self-omits gracefully rather than
 * showing a one- or two-column "comparison"). Resolves the curated slate
 * concurrently; each city self-omits on a miss. Cities are ordered richest
 * typical revenue first so the strongest market reads at the left.
 */
export async function buildAcrossCities(
  industryId: string,
): Promise<AcrossCitiesData | null> {
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return null;
  const activitySlug = industryToSlug(industryId);
  const survivalYr5 = boundSurvivalCurve(
    getActivitySurvivalArchetype(activitySlug) ?? {},
  ).yr5;

  const resolved = await Promise.all(
    MAJOR_CITIES.map((city) =>
      resolveCity(city, activitySlug, industryId, survivalYr5),
    ),
  );
  const cities = resolved
    .filter((c): c is CityColumn => c !== null)
    .sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));

  // Self-omit on thin data: a comparison needs at least three real places.
  if (cities.length < 3) return null;

  const bestByMetric: Record<string, number | null> = {};
  for (const metric of ACROSS_METRICS) {
    bestByMetric[metric.key] = bestIndexFor(cities, metric);
  }

  return {
    activityName: ind.name,
    activitySlug,
    cities,
    metrics: ACROSS_METRICS,
    bestByMetric,
    breakIn: pickBreakIn(cities, bestByMetric),
  };
}
