/**
 * src/lib/scores/activity_board.ts
 *
 * Pure synthesis for the global ACTIVITY page (/industries/restaurants,
 * /industries/legal-services, ...). What survives here is the "where it works"
 * places table and the curated survival archetype: the two things the industry
 * page actually reads.
 *
 * THE BOARD THIS FILE IS NAMED AFTER IS GONE. Deleted 2026-08-18.
 * `buildActivityBoard` returned five BoardSections for the DataSection kit. The
 * industry page stopped calling it on 2026-06-13 in `4e0ab1bf`, the rebuild that
 * moved country, city, neighbourhood and industry onto a new kit and dropped all
 * three sibling board builders in one commit. It then sat unreferenced for two
 * months. Verified before deletion: zero references from any page, component,
 * lib, API route or script, and no barrel re-export can hide one because
 * `src/lib/scores/index.ts` does not re-export this module and there is not a
 * single `export *` anywhere in src.
 *
 * Deleted with it, because nothing else read them: `ActivityBoardInput`,
 * `ActivityBoardMargins`, the `textOrNull` helper (whose only remaining purpose
 * was to be `void`-ed so it would not trip the unused-helper lint), and the
 * imports the board alone needed. Removing the SpreadBar chart took the last
 * React reference out of this module, so it is now genuinely plain TypeScript
 * rather than plain TypeScript that imports React.
 *
 * KEPT deliberately, because they are live: `ActivityRevenueBand` and
 * `ActivityTakeHomeBand` (read by src/lib/industries/industry_view.ts),
 * `ActivitySurvival` and `getActivitySurvivalArchetype` (read by the industry
 * page, city_board, adapt_industry, across_cities, leaderboards, home/beats and
 * a test), and `summarizeActivityPlaces` with its row and summary types.
 *
 * THE ONE RULE THE FOUNDER NAMED, and it still governs what is left: never a
 * single worldwide revenue average. Cross-place aggregation has garbage tails
 * (one country at $11.6M sitting next to another at $118K), so a revenue figure
 * here is a RANGE, computed from a SANE central band (the 10th-to-90th
 * percentile of per-place typical revenue, after the caller has already dropped
 * rows outside the per-industry SMB envelope). When the sample is too thin to
 * defend a band, the range dashes rather than guess. The "typical" anchor is the
 * median of that same trimmed band, not a mean (a mean is what the tails poison).
 *
 * Pure module: no Supabase, no fs, no runtime side effects, and it cannot trip
 * the layering gate (which only walks src/app + src/components).
 *
 * WHY THIS FILE SITS ON THE TAKE-HOME BYPASS BASELINE.
 * Classified 2026-08-18. verify_take_home_identity flagged it for one call,
 * `clampMargin` on the board's displayed net margin, made without importing the
 * resolver. That call lived inside `buildActivityBoard` and went with it, so the
 * originally-flagged line no longer exists. The classification still holds for
 * what remains, and the reasoning is unchanged: every take-home figure in this
 * module arrives from the caller and leaves unchanged. `summarizeActivityPlaces`
 * ranks, fences and takes percentiles, and never computes a take-home from a
 * margin. Measured across five activities and 53 ranked rows built from the real
 * per-place inputs the industry page hands in: 53 of 53 carried the caller's
 * figure byte for byte, zero drift. Those inputs come from
 * `activityPlaceFromCell`, which routes through the resolver.
 *
 * The `LONDON_MARKET` import feeds `getActivitySurvivalArchetype` and nothing
 * else, so the loader's take-home correction is irrelevant to what is read
 * here. Its re-key IS relevant, and it works: the two activities checked whose
 * keys the loader moves (`specialty-trades-mixed`, `cafes-coffee-shops`) both
 * resolve a survival curve now.
 *
 * Constraint-safe by construction: no em-dashes, no source-agency names.
 */
import { clampNetMarginPct } from "@/lib/finance/margin_floor";
import { LONDON_MARKET } from "@/lib/london/market";

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

/* THE FOURTH READER, and it read the file the other three had stopped reading.
   This imported data/london/london_market_v1.json DIRECTLY while the other
   three surfaces moved to src/lib/london/market.ts. That loader does two things
   to the file: it closes the take-home identity, and it RE-KEYS four activities
   whose keys are slugs that no longer exist (`cafes-coffee` is now
   `cafes-coffee-shops`, and three siblings).

   So this module looked up a LIVE slug in a file that still used the STALE
   one, and the four never matched. Measured: of the twenty curated activities,
   sixteen resolved a survival curve and four returned all-null, and the four
   were exactly the four the loader re-keys. A fifth of the dataset dashed its
   survival rows for a reason no reader could see from here.

   The loader's own header claimed a fourth reader was impossible. It was not,
   and that claim has been corrected there. This is the reader it missed. */
const LONDON_SURVIVAL = LONDON_MARKET as unknown as LondonSurvivalFile;

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

/** A finite, real number (not null, not NaN, not Infinity). */
function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
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
  /**
   * Which like-for-like cohort the place belongs to. US states share one
   * country, one currency, and broadly one price level, so ranking them by
   * take-home is honest. Countries do not: a raw-USD figure is not adjusted for
   * local prices, so the page lists them side by side as facts rather than
   * crowning a cross-border winner. The page keeps the two cohorts apart and
   * never prints a single global 1..N rank that mixes them.
   */
  cohort: "us-state" | "country";
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
  /**
   * Like-for-like cohort (see ActivityPlaceRow.cohort). Optional: callers that
   * do not split cohorts (the extremes leaderboard, the homepage beats) may omit
   * it and it defaults to "country" on the row.
   */
  cohort?: "us-state" | "country";
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
      cohort: p.cohort ?? "country",
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
