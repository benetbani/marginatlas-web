/**
 * src/lib/scores/index.ts
 *
 * The proprietary 0 to 100 scores from the Reformation bible (Section 10,
 * "Derived Metrics and Proprietary Scores", and Section 21, the Founder
 * Opportunity blend).
 *
 * Design rules carried straight from the bible:
 *   - Every score is 0 to 100, integer, no decimals.
 *   - Higher always means MORE FAVOURABLE for the operator, so the band
 *     words below read the same direction across every score. The bible's
 *     "Rent Pressure" and "Market Saturation" are therefore framed here as
 *     "Rent headroom" and "Market room": high score = low pressure / more
 *     room. The underlying concept is the bible's; only the sign is fixed
 *     so the 80-to-100-is-strong banding is internally consistent.
 *   - Bands: 80+ strong, 60-79 workable, 40-59 mixed, 20-39 weak, <20 avoid.
 *   - HIDE WEAKNESS (founder answer 3): a score is returned ONLY when it can
 *     be computed from data we actually hold. When an input is missing we
 *     return null and the UI omits that score silently. No "low confidence"
 *     badge, no apologetic placeholder.
 *
 * Pure module: it operates only on the Cell fields plus a few optional
 * context numbers the caller passes in. No Supabase, no other domain
 * modules at runtime (Cell is a type-only import), so it stays trivially
 * testable and cannot trip the layering gate.
 */
import type { Cell } from "@/lib/cells";

export type ScoreBand = "strong" | "workable" | "mixed" | "weak" | "avoid";

export type ScoreId =
  | "profitability"
  | "rent"
  | "market"
  | "owner_take_home"
  | "opportunity";

export interface Score {
  id: ScoreId;
  /** Display title, framed so higher = better. */
  label: string;
  /** 0 to 100, integer. */
  value: number;
  band: ScoreBand;
  /** One plain, slightly blunt line. Constraint-safe: no em-dash, no source names. */
  blurb: string;
}

export interface ScoreSet {
  /** The component scores that were computable, in display order. */
  scores: Score[];
  /** The blended headline score, or null if too little to blend. */
  opportunity: Score | null;
}

export interface ScoreContext {
  /** 1 = major metro, 2 = mid, 3 = small/rural. From getCityTier. */
  cityTier?: 1 | 2 | 3 | null;
  /** Local annual wage to normalise owner take-home against, USD. */
  localAnnualWage?: number | null;
  /**
   * Market-room favourability (0 to 100), computed by the caller from peer
   * density when it has the context. Omit to leave Market room out.
   */
  marketRoomValue?: number | null;
}

// ----------------------------------------------------------------------------
// small numeric helpers
// ----------------------------------------------------------------------------

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Piecewise-linear map. `points` is sorted ascending by input. Values below
 * the first point clamp to its output; above the last clamp to its output.
 */
function piecewise(x: number, points: Array<[number, number]>): number {
  if (x <= points[0][0]) return points[0][1];
  const last = points[points.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i];
    if (x <= x1) {
      const [x0, y0] = points[i - 1];
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return last[1];
}

export function bandOf(value: number): ScoreBand {
  if (value >= 80) return "strong";
  if (value >= 60) return "workable";
  if (value >= 40) return "mixed";
  if (value >= 20) return "weak";
  return "avoid";
}

/** Plain word for a band, for inline copy. */
export function bandWord(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "strong";
    case "workable":
      return "workable";
    case "mixed":
      return "mixed";
    case "weak":
      return "weak";
    case "avoid":
      return "very hard";
  }
}

// ----------------------------------------------------------------------------
// component scores: each returns a raw 0..100 number or null (omit)
// ----------------------------------------------------------------------------

function profitabilityValue(cell: Cell): number | null {
  const net = cell.net_margin;
  if (net == null || !Number.isFinite(net)) return null;
  // Net margin (share) to score. SMB net margins run roughly 3% (thin) to
  // 22%+ (strong); the curve rewards real bottom-line, not vanity revenue.
  let base = piecewise(net, [
    [0, 8],
    [0.03, 25],
    [0.06, 42],
    [0.1, 58],
    [0.15, 72],
    [0.22, 86],
    [0.35, 95],
  ]);
  // Cost-pressure nudge: when rent + labour eat most of revenue, the margin
  // is more fragile than the headline suggests.
  const cs = cell.cost_structure;
  if (cs && Number.isFinite(cs.rent) && Number.isFinite(cs.labor)) {
    const pressure = (cs.rent + cs.labor) / 100;
    if (pressure > 0.62) base -= 6;
    else if (pressure > 0.52) base -= 3;
  }
  return clamp(Math.round(base), 1, 99);
}

function rentHeadroomValue(cell: Cell, cityTier?: 1 | 2 | 3 | null): number | null {
  const rent = cell.cost_structure?.rent;
  if (rent == null || !Number.isFinite(rent)) return null;
  // Lower rent share of revenue means more headroom (higher score).
  let base = piecewise(rent, [
    [3, 92],
    [6, 82],
    [9, 66],
    [12, 52],
    [16, 38],
    [20, 24],
    [28, 10],
  ]);
  // Major metros carry structurally higher lease risk at renewal time.
  if (cityTier === 1) base -= 6;
  else if (cityTier === 2) base -= 2;
  return clamp(Math.round(base), 1, 99);
}

function ownerTakeHomeValue(
  cell: Cell,
  localAnnualWage?: number | null,
): number | null {
  const net = cell.net_profit;
  if (net == null || !Number.isFinite(net)) return null;
  const wage =
    localAnnualWage && localAnnualWage > 0
      ? localAnnualWage
      : cell.payroll_per_employee && cell.payroll_per_employee > 0
        ? cell.payroll_per_employee
        : null;
  if (wage == null) return null;
  const ratio = net / wage;
  // Net take-home relative to one local wage. Below ~1 the owner is buying
  // themselves a job; above ~2.5 it clears a wage with room to reinvest.
  const base = piecewise(ratio, [
    [0, 6],
    [0.3, 18],
    [0.5, 32],
    [0.8, 46],
    [1.0, 56],
    [1.5, 70],
    [2.5, 85],
    [4, 95],
  ]);
  return clamp(Math.round(base), 1, 99);
}

// ----------------------------------------------------------------------------
// blurbs
// ----------------------------------------------------------------------------

function profitabilityBlurb(net: number, band: ScoreBand): string {
  const pct = Math.round(net * 100);
  switch (band) {
    case "strong":
      return `Healthy economics. Net keeps about ${pct}% of revenue after costs.`;
    case "workable":
      return `Workable margins. Net runs near ${pct}% of revenue, so discipline matters.`;
    case "mixed":
      return `Tight margins near ${pct}%. Pricing and cost control decide the outcome.`;
    default:
      return `Thin margins around ${pct}%. Little room for error on cost or price.`;
  }
}

function rentBlurb(rentPct: number, band: ScoreBand): string {
  const pct = Math.round(rentPct);
  switch (band) {
    case "strong":
      return `Rent is light, near ${pct}% of revenue. It is not the thing that breaks this.`;
    case "workable":
      return `Rent sits around ${pct}% of revenue. Manageable with steady sales.`;
    case "mixed":
      return `Rent runs about ${pct}% of revenue. A soft month gets uncomfortable.`;
    default:
      return `Rent is heavy, near ${pct}% of revenue. It can swallow the margin in a slow season.`;
  }
}

function ownerBlurb(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return `Can support an owner. The take clears a local wage with room to reinvest.`;
    case "workable":
      return `Supports an owner, though it is a job as much as a business. The take is close to a good local wage.`;
    case "mixed":
      return `Owner pay is modest. The take lands near a local wage, not above it.`;
    default:
      return `Hard to live on. The take falls short of a local wage unless volume runs well above typical.`;
  }
}

function marketBlurb(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return `Room to enter. The market is not crowded at typical scale.`;
    case "workable":
      return `Some room, but established operators already hold the easy ground.`;
    case "mixed":
      return `Filling up. New entrants compete for the same customers.`;
    default:
      return `Crowded. Winning share means taking it from someone established.`;
  }
}

function opportunityBlurb(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return `Strong setup overall, for an operator who runs it tight.`;
    case "workable":
      return `A real opportunity with real caveats. Execution is the variable.`;
    case "mixed":
      return `Mixed. The upside is here, but so are the ways to lose.`;
    default:
      return `A hard place to make this pay. It needs an edge most operators do not have.`;
  }
}

// ----------------------------------------------------------------------------
// public entry point
// ----------------------------------------------------------------------------

const LABELS: Record<ScoreId, string> = {
  profitability: "Profitability",
  rent: "Rent headroom",
  market: "Market room",
  owner_take_home: "Owner take-home",
  opportunity: "Opportunity",
};

/**
 * Compute the score set for a cell. Returns only the scores that are
 * defensible from the data on hand; the rest are omitted (hide weakness).
 */
export function computeScores(cell: Cell, ctx: ScoreContext = {}): ScoreSet {
  const scores: Score[] = [];

  const prof = profitabilityValue(cell);
  if (prof != null) {
    const band = bandOf(prof);
    scores.push({
      id: "profitability",
      label: LABELS.profitability,
      value: prof,
      band,
      blurb: profitabilityBlurb(cell.net_margin as number, band),
    });
  }

  const rent = rentHeadroomValue(cell, ctx.cityTier ?? null);
  if (rent != null) {
    const band = bandOf(rent);
    scores.push({
      id: "rent",
      label: LABELS.rent,
      value: rent,
      band,
      blurb: rentBlurb(cell.cost_structure!.rent, band),
    });
  }

  const owner = ownerTakeHomeValue(cell, ctx.localAnnualWage ?? null);
  if (owner != null) {
    const band = bandOf(owner);
    scores.push({
      id: "owner_take_home",
      label: LABELS.owner_take_home,
      value: owner,
      band,
      blurb: ownerBlurb(band),
    });
  }

  // Market room only appears when the caller supplied a peer-derived value.
  if (ctx.marketRoomValue != null && Number.isFinite(ctx.marketRoomValue)) {
    const v = clamp(Math.round(ctx.marketRoomValue), 1, 99);
    const band = bandOf(v);
    scores.push({
      id: "market",
      label: LABELS.market,
      value: v,
      band,
      blurb: marketBlurb(band),
    });
  }

  const opportunity = blendOpportunity(scores);

  return { scores, opportunity };
}

/**
 * Founder Opportunity (bible Section 21) as a weighted blend of the
 * component scores that exist. Re-normalises weights over whatever is
 * present, and refuses to blend from fewer than two components (a single
 * input is not an "opportunity", it is one fact).
 */
function blendOpportunity(scores: Score[]): Score | null {
  if (scores.length < 2) return null;
  const weights: Record<ScoreId, number> = {
    profitability: 0.34,
    owner_take_home: 0.3,
    rent: 0.2,
    market: 0.16,
    opportunity: 0,
  };
  let sum = 0;
  let wsum = 0;
  for (const s of scores) {
    const w = weights[s.id] ?? 0;
    sum += s.value * w;
    wsum += w;
  }
  if (wsum <= 0) return null;
  const value = clamp(Math.round(sum / wsum), 1, 99);
  const band = bandOf(value);
  return {
    id: "opportunity",
    label: LABELS.opportunity,
    value,
    band,
    blurb: opportunityBlurb(band),
  };
}
