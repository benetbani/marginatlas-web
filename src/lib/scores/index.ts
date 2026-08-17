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
 * The caller passes the page's AUTHORITATIVE numbers (the tax-aware net
 * margin and net take-home it already computed) through the context, so the
 * scores agree with the rest of the page instead of inventing a second set.
 *
 * THE TAKE-HOME FIGURE COMES FROM THE RESOLVER, NOT FROM HERE. The owner
 * take-home score used to fall back to `netMargin * median` whenever neither
 * the context nor the cell carried a profit figure. That is the same
 * derive-it-locally shape as the two 2026-08-17 defects: it ignores the 3%
 * net-margin floor the rest of the site displays, so a cell shown at "3% net"
 * scored off a raw margin of minus 40%. Swept over 3,024 combinations of
 * revenue, margin, structural profit and industry, the local derivation
 * matched `resolveOwnerTakeHome` in 41.9% of them, and the worst gap was
 * $1,720,000 (it fed minus $1.6M into a score where the resolver reads
 * $120,000). Every input now goes through the resolver, which is a fixed point
 * for a figure the caller has already resolved: `max(resolved, floor)` is
 * `resolved` when `resolved` already clears the floor, so a page passing its
 * own authoritative take-home gets exactly that number back.
 *
 * Pure module: it operates only on Cell fields plus the context numbers, and
 * on the shared take-home resolver (itself pure). No Supabase and no I/O, so
 * it stays trivially testable and cannot trip the layering gate.
 */
import type { Cell } from "@/lib/cells";
import { resolveOwnerTakeHome } from "@/lib/finance/owner_take_home";

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
  /** Authoritative net margin (share, 0..1) the page already computed. */
  netMargin?: number | null;
  /** Authoritative net take-home (USD) the page already computed. */
  netProfit?: number | null;
  /** Local annual wage to normalise owner take-home against, USD. */
  localAnnualWage?: number | null;
  /**
   * Country average annual income (USD), for the resolver's larger-firm floor
   * only. That floor lifts a thin take-home to twice this figure, and it
   * applies to 10+ employee bands ALONE: a 1-4 or 5-9 cell is never floored,
   * whatever is passed here. Omit it and the floor simply never applies, which
   * is the conservative reading, not a different one. This is NOT
   * `localAnnualWage`: that one is the per-employee wage the score divides by,
   * a different quantity, and feeding one into the other would move scores.
   */
  annualIncome?: number | null;
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
// component scores: each takes resolved primitives, returns 0..100 or null
// ----------------------------------------------------------------------------

function profitabilityValue(
  netMargin: number | null,
  cost: Cell["cost_structure"],
): number | null {
  if (netMargin == null || !Number.isFinite(netMargin)) return null;
  // Net margin (share) to score. SMB net margins run roughly 3% (thin) to
  // 22%+ (strong); the curve rewards real bottom-line, not vanity revenue.
  let base = piecewise(netMargin, [
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
  if (cost && Number.isFinite(cost.rent) && Number.isFinite(cost.labor)) {
    const pressure = (cost.rent + cost.labor) / 100;
    if (pressure > 0.62) base -= 6;
    else if (pressure > 0.52) base -= 3;
  }
  return clamp(Math.round(base), 1, 99);
}

function rentHeadroomValue(
  rentPct: number | null,
  cityTier?: 1 | 2 | 3 | null,
): number | null {
  if (rentPct == null || !Number.isFinite(rentPct)) return null;
  // Lower rent share of revenue means more headroom (higher score).
  let base = piecewise(rentPct, [
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
  netProfit: number | null,
  wage: number | null,
): number | null {
  if (netProfit == null || !Number.isFinite(netProfit)) return null;
  if (wage == null || !(wage > 0)) return null;
  const ratio = netProfit / wage;
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

function pushScore(
  scores: Score[],
  id: ScoreId,
  value: number,
  blurb: (band: ScoreBand) => string,
): void {
  const band = bandOf(value);
  scores.push({ id, label: LABELS[id], value, band, blurb: blurb(band) });
}

/**
 * Compute the score set for a cell. Returns only the scores that are
 * defensible from the data on hand; the rest are omitted (hide weakness).
 */
export function computeScores(cell: Cell, ctx: ScoreContext = {}): ScoreSet {
  const scores: Score[] = [];
  const median = cell.revenue_per_firm ?? cell.rev_p50 ?? null;

  const netMargin = ctx.netMargin ?? cell.net_margin ?? null;
  const prof = profitabilityValue(netMargin, cell.cost_structure ?? null);
  if (prof != null && netMargin != null) {
    pushScore(scores, "profitability", prof, (b) =>
      profitabilityBlurb(netMargin, b),
    );
  }

  const rentPct = cell.cost_structure?.rent ?? null;
  const rent = rentHeadroomValue(rentPct, ctx.cityTier ?? null);
  if (rent != null && rentPct != null) {
    pushScore(scores, "rent", rent, (b) => rentBlurb(rentPct, b));
  }

  // The one owner take-home figure, resolved by the single source of truth so
  // this score can never sit below the net margin the page shows beside it.
  // The structural input is the caller's authoritative figure when it has one,
  // else the cell's own stored profit; the resolver then floors it to the
  // dollars the SHOWN (clamped) margin implies. The 2x-income floor is the
  // resolver's, and it is armed only for the 10+ employee bands, exactly the
  // list the cell page uses. Below that band the flag is false and the floor
  // cannot fire, whatever `ctx.annualIncome` holds.
  const isLargerFirm =
    !!cell.size_band && ["10-19", "20-49", "50-99", "100+"].includes(cell.size_band);
  const netProfit = resolveOwnerTakeHome({
    structuralNetProfit: ctx.netProfit ?? cell.net_profit ?? null,
    rawNetMargin: netMargin,
    revenue: median,
    industryId: cell.industry_id ?? null,
    isLargerFirm,
    annualIncome: ctx.annualIncome ?? null,
  });
  const wage =
    ctx.localAnnualWage ??
    (cell.payroll_per_employee && cell.payroll_per_employee > 0
      ? cell.payroll_per_employee
      : null);
  const owner = ownerTakeHomeValue(netProfit, wage);
  if (owner != null) {
    pushScore(scores, "owner_take_home", owner, ownerBlurb);
  }

  // Market room only appears when the caller supplied a peer-derived value.
  if (ctx.marketRoomValue != null && Number.isFinite(ctx.marketRoomValue)) {
    const v = clamp(Math.round(ctx.marketRoomValue), 1, 99);
    pushScore(scores, "market", v, marketBlurb);
  }

  return { scores, opportunity: blendOpportunity(scores) };
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
