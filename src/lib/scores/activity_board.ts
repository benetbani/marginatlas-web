/**
 * src/lib/scores/activity_board.ts
 *
 * Pure synthesis for the data board that leads the global ACTIVITY page
 * (/industries/restaurants, /industries/legal-services, ...). It is the
 * activity-altitude sibling of country_board.ts, city_board.ts, and
 * cell_board.ts and follows the exact same contract, so a reader who has
 * learned any of those reads this one for free:
 *
 *   - Every section and every row is ALWAYS present, in a fixed order. A datum
 *     we do not hold is emitted as a null value, which the board's StatGrid
 *     renders as the MISSING dash. The board is a scaffold, not a data-shaped
 *     silhouette: its shape never depends on which figures exist, so a blank
 *     reads as "we do not have this field" rather than "this page is broken".
 *   - Honest dashes beat invented numbers. The activity page holds the curated
 *     cost-structure margins (gross / operating / net), which are place-stable
 *     and the same in Berlin or Brazil, plus a representative survival curve for
 *     the activity. Everything else at this altitude is null, never a fabricated
 *     stand-in.
 *   - Sections that lean on modeled / directional inputs carry `modeled: true`,
 *     which renders one quiet footnote per section, not a badge per row.
 *
 * THE ONE RULE THE FOUNDER NAMED: never a single worldwide revenue average.
 * Cross-place aggregation has garbage tails (one country at $11.6M sitting next
 * to another at $118K), so the revenue figure here is a RANGE, computed from a
 * SANE central band (the 10th-to-90th percentile of per-place typical revenue,
 * after the caller has already dropped rows outside the per-industry SMB
 * envelope). When the sample is too thin to defend a band, the range dashes
 * rather than guess. The "typical" anchor is the median of that same trimmed
 * band, not a mean (a mean is what the tails poison).
 *
 * Sections, in fixed order, ALWAYS emitted:
 *   numbers    The economics (structural): margins, revenue range, take-home range
 *   market     Market structure (modeled): typology / concentration / chain
 *   pricing    Pricing power (modeled)
 *   labor      Labor and skills (modeled)
 *   survival   Survival baseline (modeled): representative 1yr / 3yr / 5yr
 *
 * Pure module: no Supabase, no fs, no runtime side effects. The board consumes
 * numbers the activity page has already computed (the curated margins and the
 * already-trimmed per-place revenue band) and shapes them into rows; it does not
 * fetch. Kit types are type-only imports, exactly like the sibling boards, so
 * this stays trivially testable and cannot trip the layering gate (which only
 * walks src/app + src/components). The one chart (the revenue SpreadBar) is
 * built with React.createElement so the module is plain TypeScript (no JSX),
 * keeping it a .ts file and matching cell_board.ts.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import * as React from "react";
import type { BoardSection } from "@/components/board/DataSection";
import type { StatRow } from "@/components/board/StatGrid";
import { fmtUSD, fmtPct } from "@/components/board/format";
import { SpreadBar } from "@/components/board/charts/SpreadBar";
import {
  clampMargin,
  clampNetMarginPct,
  boundSurvivalCurve,
} from "@/lib/finance/margin_floor";
import londonJson from "../../../data/london/london_market_v1.json";

/**
 * The structural margins for the activity. These are place-stable shares
 * (0..1): a restaurant's payroll-as-share-of-revenue is similar across
 * countries, so the cost shape belongs on the worldwide activity page while the
 * absolute dollars belong on the per-place cell page. Every field is nullable;
 * a null becomes a dash.
 */
export interface ActivityBoardMargins {
  /** Gross margin as a share (0..1). */
  grossMargin: number | null;
  /** Operating margin as a share (0..1). */
  operatingMargin: number | null;
  /** Net margin as a share (0..1). */
  netMargin: number | null;
}

/**
 * A defensible per-place revenue band for the activity, already trimmed by the
 * caller to a sane central range (p10 / median / p90 of per-place typical
 * revenue, with obvious outliers dropped). All three are nullable; when the
 * band is absent or too thin the caller passes nulls and every revenue row
 * dashes. The board NEVER recomputes or widens this band; it only formats it.
 */
export interface ActivityRevenueBand {
  /** 10th-percentile per-place typical revenue, USD. */
  p10: number | null;
  /** Median per-place typical revenue, USD. */
  median: number | null;
  /** 90th-percentile per-place typical revenue, USD. */
  p90: number | null;
}

/**
 * Representative owner take-home band for the activity, USD, after tax, for a
 * typical single-site operator. Same p10..p90 trimmed-band discipline as the
 * revenue band. Nullable end-to-end.
 */
export interface ActivityTakeHomeBand {
  p10: number | null;
  p90: number | null;
}

/**
 * A representative survival curve for the activity (share surviving to year 1,
 * 3, 5). This is a single directional archetype for the activity's fragility,
 * the same curated read the cell and city boards treat as representative, not a
 * worldwide measured average. Null when we hold no curve for the activity.
 */
export interface ActivitySurvival {
  yr1: number | null;
  yr3: number | null;
  yr5: number | null;
}

// --- curated survival archetype (static, the same import the cell + city
// boards use) ----------------------------------------------------------------

type LondonSurvivalEntry = { survival?: { yr1: number; yr3: number; yr5: number } };
type LondonSurvivalFile = { activities: Record<string, LondonSurvivalEntry> };
const LONDON_SURVIVAL = londonJson as unknown as LondonSurvivalFile;

/**
 * The representative survival curve for an activity, keyed by the activity's
 * URL slug (e.g. "restaurants", "cafes-coffee"). Sourced from the same curated
 * dataset the cell and city boards treat as the directional model, so the three
 * surfaces agree. Returns an all-null curve when no entry exists, which dashes
 * the survival rows. This is a single directional archetype for the activity's
 * fragility, NOT a worldwide measured average, and the board labels it modeled.
 *
 * Pure lookup, no side effects. Living in the board lib (not the page) keeps the
 * page off a direct data/*.json import, which the layering gate forbids for
 * src/app.
 */
export function getActivitySurvivalArchetype(
  industrySlug: string | null | undefined,
): ActivitySurvival {
  const empty: ActivitySurvival = { yr1: null, yr3: null, yr5: null };
  if (!industrySlug) return empty;
  const entry = LONDON_SURVIVAL.activities?.[industrySlug];
  const s = entry?.survival;
  if (!s) return empty;
  return {
    yr1: isNum(s.yr1) ? s.yr1 : null,
    yr3: isNum(s.yr3) ? s.yr3 : null,
    yr5: isNum(s.yr5) ? s.yr5 : null,
  };
}

export interface ActivityBoardInput {
  /** Structural cost-shape margins for the activity. */
  margins: ActivityBoardMargins;
  /** Already-trimmed central revenue band across covered places, or all-null. */
  revenue: ActivityRevenueBand;
  /** Already-trimmed owner take-home band across covered places, or all-null. */
  takeHome: ActivityTakeHomeBand;
  /** Representative survival curve, or all-null when none is held. */
  survival: ActivitySurvival;
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
 * Build the full activity board. Deterministic and side-effect free: the same
 * inputs always yield the same five sections, every section and every row
 * present, in the fixed order documented at the top of the file.
 */
export function buildActivityBoard(input: ActivityBoardInput): BoardSection[] {
  const { margins, revenue, takeHome, survival } = input;

  // Keep textOrNull available for the modeled qualitative rows that are null at
  // this altitude today and will carry words once a worldwide archetype set is
  // curated, without tripping the unused-helper lint.
  void textOrNull;

  // -- numbers. The economics (structural). --------------------------------
  // The three margins are the curated, place-stable cost shape for the
  // activity. The revenue figure is a RANGE (never a single worldwide
  // average): the trimmed p10..p90 band the caller computed across covered
  // places, with the median as the typical anchor. Owner take-home is the same
  // trimmed-band treatment. Any figure we cannot defend dashes.
  const hasRevenueRange = isNum(revenue.p10) && isNum(revenue.p90) && revenue.p90 > revenue.p10;
  const hasTakeHomeRange =
    isNum(takeHome.p10) && isNum(takeHome.p90) && takeHome.p90 > takeHome.p10;

  const numbersRows: StatRow[] = [
    {
      label: "Gross margin",
      value: isNum(margins.grossMargin)
        ? fmtPct(margins.grossMargin, { fromFraction: true })
        : null,
      hint: "structural, stable across places",
    },
    {
      label: "Operating margin",
      value: isNum(margins.operatingMargin)
        ? fmtPct(margins.operatingMargin, { fromFraction: true })
        : null,
    },
    {
      label: "Net margin",
      // Net margin (fraction) passes through the shared clamp (floor 3%, global
      // net ceiling: this altitude carries no single industry id) so it can
      // never render an implausible value.
      value: isNum(margins.netMargin)
        ? fmtPct(clampMargin(margins.netMargin, "net"), { fromFraction: true })
        : null,
    },
    {
      label: "Revenue range",
      value: hasRevenueRange
        ? `${fmtUSD(revenue.p10)} to ${fmtUSD(revenue.p90)}`
        : null,
      hint: "typical firm, low to high across places",
    },
    {
      label: "Typical revenue",
      value: isNum(revenue.median) ? fmtUSD(revenue.median) : null,
      hint: "median place",
    },
    {
      label: "Owner take-home range",
      value: hasTakeHomeRange
        ? `${fmtUSD(takeHome.p10)} to ${fmtUSD(takeHome.p90)}`
        : null,
      hint: "after tax, low to high across places",
    },
  ];

  // Revenue spread chart: the same trimmed band as the rows above (p10..p90
  // track, median marked). SpreadBar self-omits when the range is absent, so
  // attaching it unconditionally is safe.
  const numbersChart = React.createElement(SpreadBar, {
    p10: revenue.p10,
    median: revenue.median,
    p90: revenue.p90,
  });

  // -- market. Market structure (modeled). ---------------------------------
  // Typology, concentration, and chain archetype are activity-and-place
  // specific; we hold no honest worldwide archetype for them at this altitude,
  // so the rows are present (the fields are named) and blank (nothing is
  // invented). They return when a curated worldwide read exists.
  const marketRows: StatRow[] = [
    { label: "Typology", value: null },
    { label: "Concentration", value: null },
    { label: "Chain share", value: null },
    { label: "Annual churn", value: null },
  ];

  // -- pricing. Pricing power (modeled). -----------------------------------
  const pricingRows: StatRow[] = [
    { label: "Pricing power", value: null },
    { label: "Premium room", value: null },
    { label: "Price dispersion", value: null },
    { label: "Willingness to pay", value: null },
  ];

  // -- labor. Labor and skills (modeled). ----------------------------------
  const laborRows: StatRow[] = [
    { label: "Payroll share of revenue", value: null },
    { label: "Skill intensity", value: null },
    { label: "Hiring difficulty", value: null },
    { label: "Owner-operator dependence", value: null },
  ];

  // -- survival. Survival baseline (modeled). ------------------------------
  // A single representative survival curve for the activity (the curated
  // directional read the cell and city boards also use), labeled
  // representative. Blank when no curve is held. Closure rate is not held.
  // Bound the curve (0 <= yr5 <= yr3 <= yr1 <= 100; non-finite dashes) so it
  // can never print a rising or out-of-range survival series; the
  // "representative" hint keys off the original input so it shows iff a curve
  // was supplied, matching the prior behaviour.
  const hasSurvival = isNum(survival.yr1) || isNum(survival.yr3) || isNum(survival.yr5);
  const boundedSurvival = boundSurvivalCurve(survival);
  const survivalRows: StatRow[] = [
    {
      label: "1-year survival",
      value: isNum(boundedSurvival.yr1) ? `${Math.round(boundedSurvival.yr1)}%` : null,
      hint: hasSurvival ? "representative for the activity" : undefined,
    },
    {
      label: "3-year",
      value: isNum(boundedSurvival.yr3) ? `${Math.round(boundedSurvival.yr3)}%` : null,
    },
    {
      label: "5-year",
      value: isNum(boundedSurvival.yr5) ? `${Math.round(boundedSurvival.yr5)}%` : null,
    },
    { label: "Closure rate", value: null },
  ];

  return [
    { key: "numbers", title: "The economics", rows: numbersRows, chart: numbersChart },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
    { key: "pricing", title: "Pricing power", rows: pricingRows, modeled: true },
    { key: "labor", title: "Labor and skills", rows: laborRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
  ];
}

// --- "where it works" places table (the page's content, not a board section) -

/**
 * One row of the "where it works" table: a covered place, what an owner keeps
 * after tax there (USD) for this activity, an optional net margin, and the cell
 * URL to open for the full numbers. Ranked by takeHome descending by the page.
 */
export interface ActivityPlaceRow {
  /** Display name, e.g. "California" or "Germany". */
  name: string;
  /** Cell-page href, e.g. "/us/california/restaurants". */
  href: string;
  /** After-tax owner take-home, USD, or null (never invented). */
  takeHome: number | null;
  /** Net margin, percent (0..100), or null. */
  netMarginPct: number | null;
}

/**
 * One covered place as the page hands it in: where it is, its cell URL, the
 * activity's typical revenue there, the modeled after-tax owner take-home, and
 * the net margin. The page computes take-home with the same tax-aware estimator
 * the cell page uses (keeping the tax / finance imports out of this pure lib);
 * this module only ranks and trims. Every metric is nullable; rows missing the
 * ranking metric sink rather than guess.
 */
export interface ActivityPlaceInput {
  name: string;
  href: string;
  /** Typical (median) revenue per firm at this place, USD. */
  typicalRevenue: number | null;
  /** After-tax owner take-home at this place, USD. */
  takeHome: number | null;
  /** Net margin, percent (0..100). */
  netMarginPct: number | null;
}

/** The defensible cross-place summary the activity page renders. */
export interface ActivityPlacesSummary {
  /** Trimmed p10 / median / p90 of per-place typical revenue (or all-null). */
  revenue: ActivityRevenueBand;
  /** Trimmed p10 / p90 of per-place owner take-home (or all-null). */
  takeHome: ActivityTakeHomeBand;
  /** Places ranked by owner take-home, best first, for the "where it works" table. */
  rows: ActivityPlaceRow[];
}

/**
 * Linear-interpolated percentile of an already-sorted ascending array. Returns
 * null for an empty array. p is a fraction in [0, 1]. This is the one place the
 * band edges are defined, so the revenue range and the take-home range share
 * exactly the same percentile math.
 */
function percentile(sortedAsc: number[], p: number): number | null {
  const n = sortedAsc.length;
  if (n === 0) return null;
  if (n === 1) return sortedAsc[0];
  const idx = (n - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedAsc[lo];
  const frac = idx - lo;
  return sortedAsc[lo] * (1 - frac) + sortedAsc[hi] * frac;
}

/**
 * The smallest number of covered places we will defend a revenue / take-home
 * band from. Below this the p10..p90 edges are noise (two or three places do
 * not make a distribution), so the whole band dashes and the page falls back to
 * honest blanks. The ranked table can still show those few places; it just does
 * not claim a worldwide spread from them.
 */
const MIN_PLACES_FOR_BAND = 5;

/**
 * Robust outlier fence, expressed as a multiple of the sample MEDIAN. Anything
 * above median * CEILING or below median / FLOOR is treated as a garbage tail
 * and dropped BEFORE the percentile band is taken. The median anchors the fence
 * because it is the one statistic the tails cannot move: a single $11.6M place
 * sitting next to a body around $400K is well above six times the median and
 * falls out, so it can no longer drag the 90th-percentile edge upward on a
 * small sample. The multiples are wide enough that a genuinely high-revenue but
 * legitimate place (a dense-metro operator at three or four times the median)
 * stays in.
 */
const OUTLIER_CEILING_X = 6;
const OUTLIER_FLOOR_X = 6;

/**
 * Drop garbage tails from an ascending-sorted positive series using the
 * median-relative fence above, then return the survivors (still ascending).
 * Empty or tiny inputs pass through unchanged (the band guard handles those).
 */
function clipOutliers(sortedAsc: number[]): number[] {
  const med = percentile(sortedAsc, 0.5);
  if (med == null || med <= 0) return sortedAsc;
  const ceiling = med * OUTLIER_CEILING_X;
  const floor = med / OUTLIER_FLOOR_X;
  return sortedAsc.filter((v) => v >= floor && v <= ceiling);
}

/**
 * Summarise the covered places for an activity into (a) a defensible central
 * revenue band, (b) a defensible owner take-home band, and (c) the ranked
 * "where it works" rows.
 *
 * The bands are the 10th-to-90th percentile of the per-place values AFTER a
 * median-relative outlier clip, NOT raw min-to-max, because cross-place
 * aggregation has garbage tails. The caller is expected to have already dropped
 * rows outside the per-industry SMB revenue envelope; the clip-then-percentile
 * here is the second line of defence, removing whatever extreme survived and
 * then trimming the edges. The "typical" anchor is the median of the same band.
 * When fewer than MIN_PLACES_FOR_BAND places carry the metric, the band is
 * all-null and the board dashes the range rather than invent one.
 *
 * Deterministic and side-effect free.
 */
export function summarizeActivityPlaces(
  places: ActivityPlaceInput[],
): ActivityPlacesSummary {
  // A revenue fence shared by the band AND the table, so a place whose typical
  // revenue is a garbage tail relative to the cohort can never headline "where
  // it works". Built from the median of the valid revenues; when too few places
  // carry a revenue the fence is open (every place is allowed through and the
  // table just ranks on whatever take-home exists).
  const validRevenues = places
    .map((p) => p.typicalRevenue)
    .filter((v): v is number => isNum(v) && v > 0)
    .sort((a, b) => a - b);
  const revMedian = percentile(validRevenues, 0.5);
  const revCeiling =
    revMedian != null && revMedian > 0 ? revMedian * OUTLIER_CEILING_X : Infinity;
  const revFloor =
    revMedian != null && revMedian > 0 ? revMedian / OUTLIER_FLOOR_X : 0;
  const withinFence = (rev: number | null): boolean =>
    !isNum(rev) || (rev >= revFloor && rev <= revCeiling);

  // Ranked rows: best owner take-home first, garbage-tail places removed. Rows
  // without a take-home sink to the bottom rather than jumping the order. Only
  // the display fields ride into the row; the ranking metric stays nullable so
  // a place we cannot model is still listed (it just cannot claim a number).
  const rows: ActivityPlaceRow[] = places
    .filter((p) => withinFence(p.typicalRevenue))
    .map((p) => ({
      name: p.name,
      href: p.href,
      takeHome: isNum(p.takeHome) ? p.takeHome : null,
      // Net margin (percent) through the shared clamp so a table row can never
      // surface an implausible margin either.
      netMarginPct: isNum(p.netMarginPct) ? clampNetMarginPct(p.netMarginPct) : null,
    }))
    .sort((a, b) => (b.takeHome ?? -Infinity) - (a.takeHome ?? -Infinity));

  // Revenue band: drop garbage tails (median-relative fence), then take the
  // trimmed central range of per-place typical revenue. The sample-size gate is
  // checked on the RAW count so a handful of places never claims a worldwide
  // spread; the percentiles run on the clipped survivors.
  const revenuesRaw = validRevenues;
  const revenues = clipOutliers(revenuesRaw);
  const revenue: ActivityRevenueBand =
    revenuesRaw.length >= MIN_PLACES_FOR_BAND && revenues.length > 0
      ? {
          p10: percentile(revenues, 0.1),
          median: percentile(revenues, 0.5),
          p90: percentile(revenues, 0.9),
        }
      : { p10: null, median: null, p90: null };

  // Take-home band: the same clip-then-trim treatment on per-place owner
  // take-home.
  const takeHomesRaw = places
    .map((p) => p.takeHome)
    .filter((v): v is number => isNum(v) && v > 0)
    .sort((a, b) => a - b);
  const takeHomes = clipOutliers(takeHomesRaw);
  const takeHome: ActivityTakeHomeBand =
    takeHomesRaw.length >= MIN_PLACES_FOR_BAND && takeHomes.length > 0
      ? { p10: percentile(takeHomes, 0.1), p90: percentile(takeHomes, 0.9) }
      : { p10: null, p90: null };

  return { revenue, takeHome, rows };
}
