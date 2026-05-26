/**
 * Plausibility suppression — render-time guard that nulls out values
 * which are catastrophically outside SMB-physical bounds.
 *
 * Background: data/quality/scale_anomalies_v1.json (May 22, 2026) flagged
 * 9,074 cells with revenue_per_firm above the industry's plausible
 * upper bound, and 341 cells with employees_per_firm = 0. The worst
 * offenders are catastrophic:
 *
 *   - Switzerland grocery stores: $1.87B per firm (bound: $10M max)
 *   - Monaco utilities: $8.74B per firm (bound: $50M max)
 *   - Liechtenstein grocery: $1.33B per firm
 *   - Switzerland restaurants: $303M per firm (bound: $5M max)
 *
 * Almost all of these are wrong-aggregation errors (total industry
 * revenue masquerading as per-firm revenue in small countries where
 * the firm count is tiny). This module nulls the bogus values at
 * render time so the page shows "-" instead of a fabricated billion.
 *
 * Suppression policy:
 *
 *   - If revenue_per_firm > industry.hi × CATASTROPHIC_MULTIPLIER (default 10),
 *     null it out. The user sees "-" or the tile is suppressed.
 *   - If employees_per_firm < 1 (zero employees), null it out so the
 *     downstream estimator kicks in.
 *   - If payroll_per_employee > $300K (over the SMB bound × 1.5),
 *     null it out.
 *
 * Conservative thresholds. We're not flagging "this looks high"; we're
 * killing values that are obvious errors.
 *
 * Companion to applyCurrencyCorrection in currency_corrections.ts.
 */

import type { Cell } from "@/lib/cells";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
  PAYROLL_BOUNDS,
} from "@/lib/qa/smb_bounds";

/** A value above industry.hi × this is treated as a catastrophic error. */
const REVENUE_CATASTROPHIC_MULTIPLIER = 10;

/** Payroll above this absolute USD is implausible for SMB-wage averages. */
const PAYROLL_CATASTROPHIC_USD = PAYROLL_BOUNDS.hi * 1.5; // $300K

/** Minimum sensible employees-per-firm; below 1 = data error. */
const MIN_EMPLOYEES_PER_FIRM = 1;

function revenueCatastropheCeiling(industryId: string | null | undefined): number {
  if (!industryId) return DEFAULT_REVENUE_BOUNDS.hi * REVENUE_CATASTROPHIC_MULTIPLIER;
  const bounds = REVENUE_PER_FIRM_BOUNDS[industryId] ?? DEFAULT_REVENUE_BOUNDS;
  return bounds.hi * REVENUE_CATASTROPHIC_MULTIPLIER;
}

/**
 * Catastrophic LOW floor: a real small business operating at <10% of the
 * industry's lower bound isn't a viable benchmark — it's a hobby, a
 * micro-operator that doesn't represent the category, or a data
 * artifact. Suppress so the page renders "-" instead of e.g. "$5K
 * typical Mexican art gallery."
 */
function revenueCatastropheFloor(industryId: string | null | undefined): number {
  if (!industryId) return DEFAULT_REVENUE_BOUNDS.lo / 10;
  const bounds = REVENUE_PER_FIRM_BOUNDS[industryId] ?? DEFAULT_REVENUE_BOUNDS;
  return bounds.lo / 10;
}

/**
 * Pure analysis: which fields of this cell would be suppressed and
 * why? Returns a flags object suitable for persistence to the DB
 * (extrapolated_cells.plausibility_flags column, when shipped) or
 * for the audit pipeline to use.
 *
 * Refactored 2026-05-26 (Backend Phase 4): the previous design
 * mutated the cell directly. The new design separates "what would
 * be suppressed" (this function) from "do the suppression"
 * (applyPlausibilitySuppression below). Two callers use the
 * analysis:
 *   1. The render layer, via applyPlausibilitySuppression, which
 *      acts on the flags.
 *   2. The audit / DB backfill scripts, which use the flags as
 *      the column value without mutating the cell.
 *
 * Both call sites use the same rule. Drift between audit and render
 * is now structurally impossible.
 */
export type PlausibilityFlag =
  | "ok"
  | "revenue_above_ceiling"
  | "revenue_below_floor"
  | "total_revenue_per_firm_above_ceiling"
  | "payroll_above_ceiling"
  | "employees_below_minimum";

export type PlausibilityFlags = {
  /** Overall status; "ok" iff no field-level flags. */
  status: "ok" | "suppressed";
  /** Per-field reason codes. Keys are Cell field names. */
  fields: Partial<Record<
    | "revenue_per_firm"
    | "rev_p10"
    | "rev_p25"
    | "rev_p50"
    | "rev_p75"
    | "rev_p90"
    | "total_revenue"
    | "total_revenue_usd"
    | "payroll_per_employee"
    | "n_employees"
    | "gross_profit"
    | "operating_profit"
    | "net_profit"
    | "gross_margin"
    | "operating_margin"
    | "net_margin",
    PlausibilityFlag
  >>;
  /** Threshold context for audit reporting. */
  thresholds: { ceiling: number; floor: number; payroll_ceiling: number };
};

/**
 * Run the analysis. Pure: does NOT mutate the input cell.
 */
export function analyzePlausibility(cell: Cell): PlausibilityFlags {
  const ceiling = revenueCatastropheCeiling(cell.industry_id);
  const floor = revenueCatastropheFloor(cell.industry_id);
  const flags: PlausibilityFlags["fields"] = {};

  // Revenue fields — every percentile + the headline.
  for (const field of [
    "revenue_per_firm",
    "rev_p10",
    "rev_p25",
    "rev_p50",
    "rev_p75",
    "rev_p90",
  ] as const) {
    const v = cell[field];
    if (typeof v === "number") {
      if (v > ceiling) flags[field] = "revenue_above_ceiling";
      else if (v < floor) flags[field] = "revenue_below_floor";
    }
  }

  // Total revenue: ceiling scaled by enterprise count.
  if (
    typeof cell.total_revenue === "number" &&
    typeof cell.n_enterprises === "number" &&
    cell.n_enterprises > 0 &&
    cell.total_revenue / cell.n_enterprises > ceiling
  ) {
    flags.total_revenue = "total_revenue_per_firm_above_ceiling";
    flags.total_revenue_usd = "total_revenue_per_firm_above_ceiling";
  }

  // Payroll-per-employee.
  if (
    typeof cell.payroll_per_employee === "number" &&
    cell.payroll_per_employee > PAYROLL_CATASTROPHIC_USD
  ) {
    flags.payroll_per_employee = "payroll_above_ceiling";
  }

  // Employees-per-firm.
  if (
    typeof cell.n_employees === "number" &&
    typeof cell.n_enterprises === "number" &&
    cell.n_enterprises > 0 &&
    cell.n_employees / cell.n_enterprises < MIN_EMPLOYEES_PER_FIRM
  ) {
    flags.n_employees = "employees_below_minimum";
  }

  // Profit fields: if the headline revenue would be suppressed, the
  // derived profit fields are also tagged for suppression to keep
  // the waterfall consistent.
  if (flags.revenue_per_firm) {
    if (typeof cell.gross_profit === "number") flags.gross_profit = flags.revenue_per_firm;
    if (typeof cell.operating_profit === "number") flags.operating_profit = flags.revenue_per_firm;
    if (typeof cell.net_profit === "number") flags.net_profit = flags.revenue_per_firm;
    if (typeof cell.gross_margin === "number") flags.gross_margin = flags.revenue_per_firm;
    if (typeof cell.operating_margin === "number") flags.operating_margin = flags.revenue_per_firm;
    if (typeof cell.net_margin === "number") flags.net_margin = flags.revenue_per_firm;
  }

  return {
    status: Object.keys(flags).length > 0 ? "suppressed" : "ok",
    fields: flags,
    thresholds: {
      ceiling,
      floor,
      payroll_ceiling: PAYROLL_CATASTROPHIC_USD,
    },
  };
}

/**
 * Apply suppression in place. Returns the cell with catastrophically
 * implausible values replaced with null. Other values pass through.
 *
 * Designed to be called once per cell, AFTER applyCurrencyCorrection
 * (so we're checking the post-FX values).
 *
 * Refactored 2026-05-26 (Backend Phase 4): now a thin wrapper around
 * analyzePlausibility(). Behavior unchanged.
 */
export function applyPlausibilitySuppression(cell: Cell): Cell {
  const analysis = analyzePlausibility(cell);
  if (analysis.status === "ok") return cell;
  const out: Cell = { ...cell };
  for (const key of Object.keys(analysis.fields) as Array<keyof PlausibilityFlags["fields"]>) {
    // The Cell type ALWAYS allows null for these fields; this is the
    // documented suppression contract. Cast through unknown to satisfy
    // the narrowed union types.
    (out as unknown as Record<string, unknown>)[key] = null;
  }
  return out;
}

/**
 * For audit / introspection. Returns the catastrophe ceiling for a
 * given industry so callers can report what the threshold was.
 */
export function getCatastropheCeiling(industryId: string | null | undefined): number {
  return revenueCatastropheCeiling(industryId);
}
