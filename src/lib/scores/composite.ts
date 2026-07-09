/**
 * src/lib/scores/composite.ts
 *
 * THE unified 0-100 composite score the recommender ranks by (2026-07-07
 * ratification). It blends four ORTHOGONAL axes, each already 0..100, higher =
 * better, so a reader learns one scale:
 *
 *   1. KEEP (40%, the anchor): how much the owner keeps, from net margin %.
 *      This is the product thesis, so it is the heaviest term AND the only one
 *      we refuse to guess: no net margin -> the whole composite is null.
 *   2. EASE (25%): entry friction, taken straight from the break-in rating
 *      (payback + speed + room). Crowding/density lives HERE only.
 *   3. DEMAND (20%): market depth, taken straight from the city-attractiveness
 *      DEMAND leg (population + income + footfall). Not room, not rent.
 *   4. RISK (15%): durability, from 5-year survival % (higher survival = lower
 *      risk = higher score).
 *
 * Density is in EASE only; rent pressure is already reflected in KEEP (margin is
 * after rent) and EASE (payback via take-home); survival becomes RISK. So the
 * four axes do not double-count (the reconciliation the two parent engines
 * needed). Weights are tunable (Pro buys the tuning) and sum to 1.0.
 *
 * MISSING-DATA DISCIPLINE (founder no-wrong-numbers rule): KEEP absent -> null
 * (the surface shows no row rather than a confident wrong rank). The other three
 * DROP from the blend and the weights RENORMALIZE over the axes that are present
 * (never a fabricated neutral). `coverage` reports how many axes were real so the
 * surface can mark thin rows. `restsOnModeled` passes through unchanged.
 *
 * Pure module: pure functions over plain numbers. No Supabase, fs, React, or side
 * effects. Deterministic. No em-dashes, no source-agency names, USD-only.
 */

import type { BreakInBand } from "./break_in_rating";

export interface CompositeInput {
  /** Net margin percent, 0..100 (the keep figure). THE ANCHOR: absent -> null. */
  keepPct: number | null | undefined;
  /** Break-in ease, 0..100, straight from computeBreakInRating().score. */
  breakInScore: number | null | undefined;
  /** Five-year survival percent, 0..100 (drives the risk axis). */
  survivalYr5Pct: number | null | undefined;
  /** Demand leg, 0..100, from cityAttractivenessScore().components.demand. */
  demandScore: number | null | undefined;
  /** True when ANY contributing input is modeled rather than trusted-real. */
  restsOnModeled: boolean;
}

export interface CompositeWeights {
  keep: number;
  ease: number;
  risk: number;
  demand: number;
}

/** Default blend: keep-dominant (the product thesis), the rest split the remainder. */
export const DEFAULT_COMPOSITE_WEIGHTS: CompositeWeights = {
  keep: 0.4,
  ease: 0.25,
  demand: 0.2,
  risk: 0.15,
};

export type CompositeAxes = {
  keep: number | null;
  ease: number | null;
  risk: number | null;
  demand: number | null;
};

export interface CompositeScore {
  /** The single headline number, integer 0..100, higher = better place/trade. */
  score: number;
  /** Coarse band, the SAME scale the two parent engines use. */
  band: BreakInBand;
  /** The four axis sub-scores (0..100 or null when absent), for transparency. */
  axes: CompositeAxes;
  /** How many of the four axes were real (1..4); the surface marks thin rows. */
  coverage: number;
  /** Echo of the caller's modeled flag. */
  restsOnModeled: boolean;
}

function isNum(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

type Anchor = { x: number; y: number };

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
 * KEEP curve: net margin percent onto a keep score. SMB net margins run from the
 * 3% floor to 30%+; the curve spans the scale so a fat-margin trade reads high
 * and a thin one reads thin. 3% -> 8, 12% -> 48, 20% -> 74, 40% -> 100.
 */
const KEEP_ANCHORS: readonly Anchor[] = [
  { x: 3, y: 8 },
  { x: 8, y: 30 },
  { x: 12, y: 48 },
  { x: 16, y: 62 },
  { x: 20, y: 74 },
  { x: 28, y: 88 },
  { x: 40, y: 100 },
];

/**
 * RISK curve: 5-year survival percent onto a durability score (higher survival =
 * higher score = lower risk). A typical SMB 5-year survival sits ~40..60%. 30% is
 * shaky (14), 50% is the middle (48), 70% durable (82), 85%+ tops out.
 */
const RISK_ANCHORS: readonly Anchor[] = [
  { x: 30, y: 14 },
  { x: 40, y: 30 },
  { x: 50, y: 48 },
  { x: 60, y: 66 },
  { x: 70, y: 82 },
  { x: 85, y: 100 },
];

/**
 * Contrast stretch. The four axes anti-correlate somewhat (a cheap easy market
 * often has thin demand), so a plain blend mean-reverts. This is a documented,
 * strictly monotonic stretch around the neutral midpoint 52 that never REORDERS
 * two blends (it is monotonic; the clamped tails may tie, but ranks never
 * reverse) while pulling a strong blend up and a weak one down so the badge
 * differentiates. SPREAD is a single tunable constant; calibrate against the
 * real distribution once coverage widens.
 */
const MID = 52;
const SPREAD = 1.3;
function stretch(raw: number): number {
  return clamp(MID + (raw - MID) * SPREAD, 0, 100);
}

/** Band cutoffs, IDENTICAL to the two parent engines: one scale learned once. */
function bandFor(score: number): BreakInBand {
  if (score >= 78) return "forgiving";
  if (score >= 60) return "manageable";
  if (score >= 40) return "demanding";
  return "brutal";
}

/**
 * Compute the composite for one place/trade, or null when KEEP is absent. The
 * three secondary axes drop-and-renormalize when absent (never neutral-filled).
 * Deterministic and side-effect free.
 */
export function compositeScore(
  input: CompositeInput,
  weights: CompositeWeights = DEFAULT_COMPOSITE_WEIGHTS,
): CompositeScore | null {
  const { keepPct, breakInScore, survivalYr5Pct, demandScore, restsOnModeled } = input;

  // KEEP anchor: no net margin, no composite.
  if (!isNum(keepPct)) return null;
  const keep = clamp(Math.round(interpolate(KEEP_ANCHORS, keepPct)), 0, 100);

  const ease = isNum(breakInScore) ? clamp(Math.round(breakInScore), 0, 100) : null;
  const risk = isNum(survivalYr5Pct)
    ? clamp(Math.round(interpolate(RISK_ANCHORS, survivalYr5Pct)), 0, 100)
    : null;
  const demand = isNum(demandScore) ? clamp(Math.round(demandScore), 0, 100) : null;

  // Blend the axes that are present, renormalizing their weights over the total.
  const legs: Array<{ w: number; v: number }> = [{ w: weights.keep, v: keep }];
  if (ease !== null) legs.push({ w: weights.ease, v: ease });
  if (risk !== null) legs.push({ w: weights.risk, v: risk });
  if (demand !== null) legs.push({ w: weights.demand, v: demand });

  const wSum = legs.reduce((s, l) => s + l.w, 0);
  // A degenerate weight set (e.g. custom weights zeroing the only present axis)
  // would divide by zero. Refuse rather than emit a fabricated NaN score.
  if (!(wSum > 0)) return null;
  const raw = legs.reduce((s, l) => s + l.w * l.v, 0) / wSum;
  const score = clamp(Math.round(stretch(raw)), 0, 100);

  return {
    score,
    band: bandFor(score),
    axes: { keep, ease, risk, demand },
    coverage: legs.length,
    restsOnModeled,
  };
}
