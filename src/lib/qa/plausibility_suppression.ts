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
 * Apply suppression in place. Returns the cell with catastrophically
 * implausible values replaced with null. Other values pass through.
 *
 * Designed to be called once per cell, AFTER applyCurrencyCorrection
 * (so we're checking the post-FX values).
 */
export function applyPlausibilitySuppression(cell: Cell): Cell {
  const out: Cell = { ...cell };
  const ceiling = revenueCatastropheCeiling(cell.industry_id);
  const floor = revenueCatastropheFloor(cell.industry_id);

  // Revenue fields — every percentile + the headline. Suppress both
  // catastrophically high values (wrong-aggregation) and catastrophically
  // low values (non-viable micro-operator that misrepresents the
  // category benchmark).
  for (const field of [
    "revenue_per_firm",
    "rev_p10",
    "rev_p25",
    "rev_p50",
    "rev_p75",
    "rev_p90",
  ] as const) {
    const v = out[field];
    if (typeof v === "number" && (v > ceiling || v < floor)) {
      out[field] = null;
    }
  }

  // Total revenue: scale up the ceiling by enterprise count for the
  // implied "this is the whole industry" comparison.
  if (
    typeof out.total_revenue === "number" &&
    typeof out.n_enterprises === "number" &&
    out.n_enterprises > 0 &&
    out.total_revenue / out.n_enterprises > ceiling
  ) {
    out.total_revenue = null;
    out.total_revenue_usd = null;
  }

  // Payroll-per-employee absolute ceiling
  if (
    typeof out.payroll_per_employee === "number" &&
    out.payroll_per_employee > PAYROLL_CATASTROPHIC_USD
  ) {
    out.payroll_per_employee = null;
  }

  // Employees-per-firm: nullify when the row says 0 employees. The
  // downstream estimator (estimateEmployeesFromFirms) will kick in.
  if (
    typeof out.n_employees === "number" &&
    typeof out.n_enterprises === "number" &&
    out.n_enterprises > 0 &&
    out.n_employees / out.n_enterprises < MIN_EMPLOYEES_PER_FIRM
  ) {
    out.n_employees = null;
  }

  // Profit fields: if revenue is now null but a profit was derived
  // from it, kill the derived profit too. Keeping them out of sync
  // breaks the waterfall.
  if (out.revenue_per_firm == null) {
    out.gross_profit = null;
    out.operating_profit = null;
    out.net_profit = null;
    out.gross_margin = null;
    out.operating_margin = null;
    out.net_margin = null;
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
