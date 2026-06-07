/**
 * src/lib/finance/owner_take_home.ts
 *
 * The single source of truth for the OWNER TAKE-HOME figure used on every
 * surface: the number a reader sees as the lead "Owner take-home" metric AND
 * the number the break-in rating scores. One responsibility: turn the net-profit
 * waterfall result (estimateNetProfit) into that one displayed/score figure.
 *
 * Before this module the derivation lived inline in two places (the cell page
 * and the cost-to-open page builder), which drifted: the cost-to-open surface
 * floored only to the larger-firm 2x-income floor and could therefore print a
 * negative take-home that contradicted the net margin shown right beside it
 * (e.g. NY hotels reading minus a quarter of a million). Centralising it here
 * means the two surfaces can never disagree again.
 *
 * The figure is the LARGER of:
 *   1. the structural after-tax net profit (estimateNetProfit().net_profit), and
 *   2. the dollars implied by the SHOWN net margin: clampMargin(rawNetMargin)
 *      times the revenue the margin was taken on. Because the displayed net
 *      margin is floored to 3% (clampMargin), a cell whose structural profit is
 *      thin or negative still shows a take-home consistent with the margin the
 *      reader sees, so the card can never show "3% net" and a negative take-home
 *      at once.
 * The existing larger-firm floor (2x the country average annual income, for
 * 10+ employee size bands only) then applies on top. A cell whose structural
 * take-home already clears both floors is unchanged. No revenue or margin figure
 * is altered by this; it only resolves the single take-home dollar amount.
 *
 * Pure. Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */
import { clampMargin } from "./margin_floor";

export interface OwnerTakeHomeInput {
  /** estimateNetProfit().net_profit: the structural after-tax owner profit, USD. */
  structuralNetProfit: number | null;
  /** estimateNetProfit().net_margin: the net margin as a fraction (0..1). */
  rawNetMargin: number | null;
  /** The gross revenue the margin was taken on (revenue per firm), USD. */
  revenue: number | null;
  /** Industry id, for the per-industry net-margin clamp band. */
  industryId: string | null;
  /** True when the size band is 10-19 / 20-49 / 50-99 / 100+ (the 2x floor applies). */
  isLargerFirm: boolean;
  /** Country average annual income, USD, for the larger-firm 2x floor. */
  annualIncome: number | null;
}

/**
 * Resolve the one owner take-home figure (display AND break-in score) from a
 * net-profit waterfall result. See the module doc for the full rule. Returns
 * null only when no take-home can be derived at all (no structural figure and
 * no margin-implied figure).
 */
export function resolveOwnerTakeHome(input: OwnerTakeHomeInput): number | null {
  const {
    structuralNetProfit,
    rawNetMargin,
    revenue,
    industryId,
    isLargerFirm,
    annualIncome,
  } = input;

  // The dollars implied by the SHOWN (clamped, 3%-floored) net margin.
  const marginFloorDollars =
    rawNetMargin != null && revenue != null
      ? clampMargin(rawNetMargin, "net", industryId) * revenue
      : null;

  // The take-home before the larger-firm floor: the larger of the structural
  // after-tax profit and the margin-implied dollars, or whichever is present.
  const base =
    structuralNetProfit != null && marginFloorDollars != null
      ? Math.max(structuralNetProfit, marginFloorDollars)
      : structuralNetProfit ?? marginFloorDollars;

  // The larger-firm floor: 2x the country average annual income, for 10+
  // employee bands only. Never applied to 1-4 / 5-9 firms.
  const takeHomeFloor =
    isLargerFirm && annualIncome != null ? annualIncome * 2 : null;

  return takeHomeFloor != null && base != null && base < takeHomeFloor
    ? takeHomeFloor
    : base;
}
