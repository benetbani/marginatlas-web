/**
 * src/lib/scores/break_in_rating.ts
 *
 * The "break-in rating": a SINGLE 0-100 score per business-and-place that
 * answers one question a would-be owner actually asks, "how easy is it to break
 * in and win here?". Higher is easier. It is one number, not a panel of
 * sub-ratings, so a reader learns the scale once and reads it everywhere, the
 * same discipline the board's modeled signals follow.
 *
 * What the number rewards, in priority order:
 *
 *   1. TIME TO BREAK EVEN, above all else. Cheap to enter plus a high owner
 *      take-home means the money comes back fast, and a fast payback is the
 *      single best proxy for "easy to win here". This is the dominant term
 *      (58% of the raw score): the payback in years is mapped onto a 0-100
 *      curve that falls steeply as the road back to profit gets longer.
 *   2. EASE OF ENTRY as friction (24%): how long from the decision to the doors
 *      opening. A quick open is a low barrier; a year-long licensed build is a
 *      high one. (The dollar cost of entry is already inside payback; this term
 *      is the calendar, the part of the barrier money cannot shorten.)
 *   3. ROOM TO ENTER (18%): how crowded the trade is per resident. A sparse
 *      market has room for a new operator; a saturated high street does not.
 *
 * The three fold into one weighted score, payback dominant by design, then a
 * warm, honest one-line headline that names the reality AND the catch.
 *
 * MISSING-DATA DISCIPLINE (the founder no-wrong-numbers rule): the two figures
 * that anchor payback, the owner take-home and the entry capital, are the only
 * ones we refuse to guess. If either is missing or non-positive the function
 * returns null and the surface shows nothing rather than a confident wrong
 * score. The three modeled inputs (permits, time, density) are always available
 * on the board; if one is somehow absent its sub-score falls back to a neutral
 * 50 rather than failing the whole rating.
 *
 * Pure module: a handful of pure functions over plain numbers. No Supabase, no
 * fs, no React, no runtime side effects, so it stays trivially testable and
 * cannot trip the layering gate. The caller (the board / page) supplies the
 * real-or-modeled inputs and sets restsOnModeled; this module only does the
 * math and the copy. Constraint-safe: no em-dashes, no source-agency names,
 * USD-only money.
 */

/** The inputs the rating needs, all numbers the caller has already resolved to
 * USD / weeks / per-10k. The caller supplies real values where it holds a
 * trusted local measurement and modeled archetypes otherwise, and sets
 * restsOnModeled accordingly (true when ANY input is modeled rather than real).
 */
export interface BreakInRatingInput {
  /** One-time entry capital, USD (real trusted cost or modeled archetype). */
  startupCapitalUsd: number | null | undefined;
  /** One-time permits and licensing, USD (modeled, place-adjusted). */
  permitsUsd: number | null | undefined;
  /** Annual owner take-home, USD, after tax (the lead money figure). */
  annualOwnerTakeHomeUsd: number | null | undefined;
  /** Weeks from the decision to open to opening day (modeled). */
  timeToOpenWeeks: number | null | undefined;
  /** Competitors per 10,000 residents (real or modeled archetype). */
  densityPer10k: number | null | undefined;
  /** True when ANY input above is modeled rather than a trusted-real figure. */
  restsOnModeled: boolean;
}

/** Warm band for the headline copy, coarsened from the score. */
export type BreakInBand = "forgiving" | "manageable" | "demanding" | "brutal";

export type BreakInRating = {
  /** The single headline number, integer 0..100, higher = easier to break in. */
  score: number;
  /** Coarse band driving the warm copy. */
  band: BreakInBand;
  /** Years to earn the entry cost back, rounded to one decimal (context figure). */
  paybackYears: number;
  /** The three sub-scores that fed the blend, for transparency / debugging. */
  components: { paybackScore: number; speedScore: number; roomScore: number };
  /** Echo of the caller's modeled flag, so the surface can mark it. */
  restsOnModeled: boolean;
  /** A warm, honest one-liner: names the reality AND the catch. No em-dashes. */
  headline: string;
};

/** A real, finite number we can compute on. */
function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/** Clamp x into [lo, hi]. */
function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/**
 * One anchor point on a piecewise-linear curve: at input `x`, the score is `y`.
 * Anchors are listed in ASCENDING x order in each curve below.
 */
type Anchor = { x: number; y: number };

/**
 * Interpolate a value through a monotonic piecewise-linear curve defined by
 * ascending-x anchors. Below the first anchor returns the first y; above the
 * last returns the last y (clamp-at-ends). Between two anchors interpolates
 * linearly. The y values themselves are not assumed monotonic by the math, but
 * every curve here is monotonic by construction.
 */
function interpolate(anchors: readonly Anchor[], x: number): number {
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (x <= first.x) return first.y;
  if (x >= last.x) return last.y;
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (x >= a.x && x <= b.x) {
      const span = b.x - a.x;
      if (span <= 0) return a.y;
      const t = (x - a.x) / span;
      return a.y + t * (b.y - a.y);
    }
  }
  return last.y;
}

/**
 * PAYBACK curve (the dominant term). Maps payback in YEARS to a 0..100 score
 * that falls steeply as the road back to profit lengthens. A quarter-year
 * payback is as good as it gets (100); a one-year payback is a strong 80; by
 * three years the score sits at a true midpoint (50); five years has fallen to
 * the mid-30s; a decade-plus payback is near the floor. These anchors are the
 * BALANCED calibration: an honest spread where a fast payback scores well, the
 * three-to-five-year middle reads genuinely mid-scale, and a long road lands low.
 *   0.25y->100, 0.5y->93, 0.75y->87, 1y->80, 1.5y->70, 2y->62, 3y->50,
 *   4y->42, 5y->35, 7y->24, 10y->14, 14y->6, >=18y->2.
 */
const PAYBACK_ANCHORS: readonly Anchor[] = [
  { x: 0.25, y: 100 },
  { x: 0.5, y: 93 },
  { x: 0.75, y: 87 },
  { x: 1, y: 80 },
  { x: 1.5, y: 70 },
  { x: 2, y: 62 },
  { x: 3, y: 50 },
  { x: 4, y: 42 },
  { x: 5, y: 35 },
  { x: 7, y: 24 },
  { x: 10, y: 14 },
  { x: 14, y: 6 },
  { x: 18, y: 2 },
];

/**
 * FRICTION curve (the calendar). Maps weeks-to-open to a 0..100 speed score: a
 * near-instant open is a low barrier (100), a year-plus licensed build is a
 * high one (down toward the floor). Anchors: 2wk->100, 8wk->78, 16wk->58,
 * 26wk->42, 52wk->22, >=78wk->10.
 */
const SPEED_ANCHORS: readonly Anchor[] = [
  { x: 2, y: 100 },
  { x: 8, y: 78 },
  { x: 16, y: 58 },
  { x: 26, y: 42 },
  { x: 52, y: 22 },
  { x: 78, y: 10 },
];

/**
 * ROOM curve (crowding). Maps competitors per 10,000 residents to a 0..100 room
 * score where LOW density = high room to enter. The anchors are set against the
 * site's own SMB density scale (see density_archetypes.ts): the sparsest trades
 * the site covers sit near 2 per 10k (a hotel, a dental surgery), the typical
 * urban SMB lands around 8-10, and the densest everyday trades reach the high
 * teens (restaurants at ~18, hairdressers ~14). The crowding gauge on the board
 * already saturates at 25 per 10k, so this curve treats 25+ as a saturated high
 * street and 40+ as fully packed.
 *
 * Chosen anchors and why:
 *   2  per 10k -> 92  sparse, a clinical or lodging trade with real room
 *   6  per 10k -> 68  below-typical, a comfortable entry
 *   10 per 10k -> 52  the typical urban SMB density, neither open nor packed
 *   18 per 10k -> 30  a crowded everyday trade (restaurant-thick)
 *   25 per 10k -> 18  a saturated high street (the gauge's own ceiling)
 *   40+ per 10k -> 10  fully packed, almost no room left
 *
 * The midpoint (10 -> 52) keeps a typical-density trade just above neutral so
 * crowding nudges rather than dominates, since payback already carries the
 * score. The steep fall from 6 to 18 is where most real trades live, so the
 * term has real spread exactly where it matters.
 */
const ROOM_ANCHORS: readonly Anchor[] = [
  { x: 2, y: 92 },
  { x: 6, y: 68 },
  { x: 10, y: 52 },
  { x: 18, y: 30 },
  { x: 25, y: 18 },
  { x: 40, y: 10 },
];

/** Blend weights. Payback DOMINATES (>= 0.55 by spec); the two secondaries
 * split the rest, friction a touch ahead of crowding because the calendar is a
 * harder barrier than density for most trades. They sum to 1.0. */
const WEIGHT_PAYBACK = 0.58;
const WEIGHT_SPEED = 0.24;
const WEIGHT_ROOM = 0.18;

/** A neutral sub-score for a modeled input that is somehow missing. Keeps the
 * rating alive (never fails on a secondary) without rewarding or punishing. */
const NEUTRAL_SUBSCORE = 50;

/** The owner take-home floor used in the payback ratio, so a tiny or rounding
 * take-home cannot blow the payback up to an absurd number of years. */
const TAKE_HOME_FLOOR_USD = 2_000;

/** Band cutoffs on the final score. Re-set for the BALANCED calibration so the
 * middle reads honestly: a forgiving room clears 78, a manageable one runs the
 * 60s and low-70s, a demanding one sits squarely mid-scale (40s and 50s), and a
 * brutal one falls below 40. */
function bandFor(score: number): BreakInBand {
  if (score >= 78) return "forgiving";
  if (score >= 60) return "manageable";
  if (score >= 40) return "demanding";
  return "brutal";
}

/**
 * Warm, honest one-line headline per band. Mentor voice: names the reality and
 * the catch in one breath, never sugar-coats a brutal room or oversells a
 * forgiving one. No em-dashes, no source-agency names, each under ~140 chars.
 * Kept as a small set per band (not per cell) so the copy stays tight and
 * reviewable; the band already encodes the score's shape.
 */
function headlineFor(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "Low to get into and quick to earn back, this is one of the friendlier rooms to enter, as long as you can stand out in a crowd.";
    case "manageable":
      return "A fair price of entry and a payback you can plan around. Doable on a real budget if you go in with your eyes open.";
    case "demanding":
      return "Earning it back takes a while and the build is real, so come in funded and patient or not at all.";
    case "brutal":
      return "Heavy to open and a long road back to profit, this is a hard room to break into without deep pockets and staying power.";
  }
}

/**
 * Compute the break-in rating for one business-and-place, or null when the two
 * payback anchors (owner take-home and entry capital) are not both present and
 * positive. Deterministic and side-effect free: the same inputs always yield
 * the same score.
 */
export function computeBreakInRating(
  input: BreakInRatingInput,
): BreakInRating | null {
  const {
    startupCapitalUsd,
    permitsUsd,
    annualOwnerTakeHomeUsd,
    timeToOpenWeeks,
    densityPer10k,
    restsOnModeled,
  } = input;

  // No-wrong-numbers gate: the payback math is meaningless without a real entry
  // cost and a real take-home, so refuse to score rather than invent one.
  if (!isNum(annualOwnerTakeHomeUsd) || annualOwnerTakeHomeUsd <= 0) return null;
  if (!isNum(startupCapitalUsd) || startupCapitalUsd <= 0) return null;

  // Permits ride alongside capital in the entry cost; if somehow missing treat
  // the regulatory bill as zero (it is the smaller term) rather than failing.
  const permits = isNum(permitsUsd) && permitsUsd > 0 ? permitsUsd : 0;
  const entryCost = startupCapitalUsd + permits;

  // 1. PAYBACK (dominant). Years to earn the entry cost back from the annual
  // take-home, floored so a tiny take-home cannot produce an absurd payback.
  const paybackYears = entryCost / Math.max(annualOwnerTakeHomeUsd, TAKE_HOME_FLOOR_USD);
  const paybackScore = clamp(Math.round(interpolate(PAYBACK_ANCHORS, paybackYears)), 0, 100);

  // 2. FRICTION (the calendar). Neutral if the (always-modeled) weeks figure is
  // somehow absent, so a missing secondary never fails the rating.
  const speedScore = isNum(timeToOpenWeeks) && timeToOpenWeeks > 0
    ? clamp(Math.round(interpolate(SPEED_ANCHORS, timeToOpenWeeks)), 0, 100)
    : NEUTRAL_SUBSCORE;

  // 3. ROOM (crowding). Neutral if the (always-modeled) density is somehow
  // absent. Density of exactly 0 is a real "no competitors" reading, so it is
  // honoured (maps to the top of the room curve), not treated as missing.
  const roomScore = isNum(densityPer10k) && densityPer10k >= 0
    ? clamp(Math.round(interpolate(ROOM_ANCHORS, densityPer10k)), 0, 100)
    : NEUTRAL_SUBSCORE;

  // Blend, payback dominant, and clamp to the 0..100 integer scale.
  const raw =
    WEIGHT_PAYBACK * paybackScore +
    WEIGHT_SPEED * speedScore +
    WEIGHT_ROOM * roomScore;
  const score = clamp(Math.round(raw), 0, 100);

  const band = bandFor(score);

  return {
    score,
    band,
    paybackYears: Math.round(paybackYears * 10) / 10,
    components: { paybackScore, speedScore, roomScore },
    restsOnModeled,
    headline: headlineFor(band),
  };
}
