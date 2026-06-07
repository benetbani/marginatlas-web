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
 *   - If revenue_per_firm > industry.hi × REVENUE_CATASTROPHIC_MULTIPLIER
 *     (default 3), null it out. The user sees the board's missing dash; we
 *     NEVER cap-and-show an invented number. This is the shared revenue
 *     chokepoint for every cell read path, so the dash is consistent
 *     everywhere a cell is rendered (cell page, comparison rails, country
 *     and cross-country reads). A value at or below hi × 3 is unchanged.
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
  type SmbBounds,
} from "@/lib/qa/smb_bounds";
import { LEGACY_DB_TO_TAXONOMY } from "@/lib/cells/industry_resolution";
import { getIndustryGlobalMedian } from "@/lib/economic_profile/industry_medians";
import countryBaselineJson from "@/lib/cells/country_smb_baseline.json";

type CountryBaselineRow = { revenue_multiplier: number };
const COUNTRY_BASELINE = countryBaselineJson as unknown as {
  default_fallback: CountryBaselineRow;
  countries: Record<string, CountryBaselineRow>;
};

/**
 * Country wealth / price-tier multiplier (US 1.7, AU 1.55, CA 1.45, QA 1.40,
 * ...). The same scalar synthesis uses to size a country's typical firm. Used
 * here to wealth-normalize the relative-outlier test so a legitimately rich
 * country's high-but-real per-firm revenue is NOT punished. Falls back to the
 * generic emerging-market baseline when the iso2 is unknown.
 */
function countryRevenueMultiplier(iso2: string | null | undefined): number {
  if (!iso2) return COUNTRY_BASELINE.default_fallback.revenue_multiplier;
  return (
    COUNTRY_BASELINE.countries[iso2.toUpperCase()] ||
    COUNTRY_BASELINE.default_fallback
  ).revenue_multiplier;
}

/**
 * Relative-outlier DASH threshold (founder data-quality fix, 2026-06-07).
 *
 * A cell whose per-firm revenue exceeds this multiple of (the industry's GLOBAL
 * median revenue x the country's wealth multiplier) is a wrong-SCALE value, not
 * a rich-country value, and is dashed. This catches the AU/CA/IL/QA-class bug
 * where whole-sector revenue (or a wrong-scale per-country "median") masquerades
 * as per-firm revenue in small / mis-aggregated economies: the absolute hi x 3
 * dash is blind to a 3x-12x RELATIVE overstatement that still lands under the
 * SMB-physical ceiling.
 *
 * Why the GLOBAL median, not the per-country one: the per-country medians in
 * industry_medians_v1.json are exactly the corrupted inputs (CA software
 * $6.3M, QA software $441M, and even the US entry is ~15x off). The GLOBAL
 * median is the cross-country anchor and is robust to that handful of bad rows.
 *
 * Why wealth-normalize: dividing by the country multiplier asks "does this value
 * exceed what this country's wealth predicts", so US grocery / GB+DE software
 * (genuinely high, genuinely rich) pass while a wrong-scale value does not.
 *
 * Threshold = 2.5 sits in a clean gap measured on the live pipeline: the worst
 * KEPT legitimate control is US grocery at 1.51x; the worst DASHED wrong-scale
 * suspect threshold is CA restaurants at 3.11x. 2.5 has margin on both sides.
 * The guard is SKIPPED (no-op) when no global median exists for the industry:
 * with no anchor there is no basis to judge, so we never dash blindly.
 */
export const RELATIVE_OUTLIER_DASH_MULTIPLIER = 2.5;

/**
 * Path-agnostic wealth-normalized relative-outlier test. Returns true when the
 * cell's per-firm revenue is implausibly high RELATIVE to the industry's global
 * median scaled by the country's wealth tier, i.e. it should be dashed.
 *
 * Pure. Returns false (do nothing) whenever there is no basis to judge: a
 * missing/non-positive revenue, or an industry with no global median anchor.
 * Shared by analyzePlausibility (the suppression chokepoint that covers the
 * regional / extrapolated / normalizeRow read paths) and enforceSanity (which
 * covers the sector-fallback path and the final getCellBySlug wrap), so every
 * render path applies the identical rule from one definition.
 */
export function isRelativeRevenueOutlier(
  industryId: string | null | undefined,
  iso2: string | null | undefined,
  revenuePerFirm: number | null | undefined,
): boolean {
  const n = relativeRevenueNormalized(industryId, iso2, revenuePerFirm);
  return n != null && n > RELATIVE_OUTLIER_DASH_MULTIPLIER;
}

/**
 * The wealth-normalized ratio behind isRelativeRevenueOutlier:
 * revenue_per_firm / (industry global median x country wealth multiplier).
 * Returns null when there is no basis to judge (missing/non-positive revenue or
 * no global median). Exposed for audit / attribution so a verify pass can report
 * the exact ratio and isolate relative-outlier dashes from absolute-ceiling ones
 * without re-deriving the formula.
 */
export function relativeRevenueNormalized(
  industryId: string | null | undefined,
  iso2: string | null | undefined,
  revenuePerFirm: number | null | undefined,
): number | null {
  if (typeof revenuePerFirm !== "number" || !(revenuePerFirm > 0)) return null;
  const globalMedian = getIndustryGlobalMedian(industryId);
  if (globalMedian == null || !(globalMedian > 0)) return null;
  const expected = globalMedian * countryRevenueMultiplier(iso2);
  if (!(expected > 0)) return null;
  return revenuePerFirm / expected;
}

/**
 * A value above industry.hi × this is implausible per-firm revenue and is
 * suppressed to a dash (never capped to a number).
 *
 * Founder-approved data-quality fix: lowered from 10 to 3 so clearly-
 * implausible revenue DASHES instead of rendering a wrong-looking "typical"
 * figure. This matches countryPagePlausibilityCeiling (already hi × 3), so the
 * cell page and the country / cross-country paths now agree on one ceiling:
 * revenue dashes at hi × 3 on EVERY path. Non-revenue suppression (payroll,
 * employees) is unchanged.
 */
const REVENUE_CATASTROPHIC_MULTIPLIER = 3;

/** Payroll above this absolute USD is implausible for SMB-wage averages. */
const PAYROLL_CATASTROPHIC_USD = PAYROLL_BOUNDS.hi * 1.5; // $300K

/** Minimum sensible employees-per-firm; below 1 = data error. */
const MIN_EMPLOYEES_PER_FIRM = 1;

/**
 * Resolve the revenue bound for a cell's stored industry id.
 *
 * A cell can reach suppression carrying EITHER the taxonomy id (extrapolated
 * read paths label the cell with the display/taxonomy id) OR the raw legacy
 * data id (regional read paths pass `industry_id` through untouched, and
 * `applyTaxonomy` only rewrites it when the id is already a taxonomy entry).
 * The previous lookup keyed `REVENUE_PER_FIRM_BOUNDS[industryId]` on the raw
 * id only, so a legacy-tagged cell (e.g. `auto_dealers_gas`) missed a bound
 * keyed on its taxonomy id (`auto_dealers`) and fell through to the $50M
 * DEFAULT, clamping junk to a wrong-looking "$50M typical".
 *
 * Fix: try the raw id first, then the same `LEGACY_DB_TO_TAXONOMY` crosswalk
 * the rest of the codebase uses, so a taxonomy-keyed bound fires for a cell
 * that stores the legacy/data id. Falls back to DEFAULT only when neither id
 * has a bound.
 */
function resolveRevenueBounds(industryId: string | null | undefined): SmbBounds {
  if (!industryId) return DEFAULT_REVENUE_BOUNDS;
  const direct = REVENUE_PER_FIRM_BOUNDS[industryId];
  if (direct) return direct;
  const taxId = LEGACY_DB_TO_TAXONOMY[industryId];
  if (taxId) {
    const viaCrosswalk = REVENUE_PER_FIRM_BOUNDS[taxId];
    if (viaCrosswalk) return viaCrosswalk;
  }
  return DEFAULT_REVENUE_BOUNDS;
}

function revenueCatastropheCeiling(industryId: string | null | undefined): number {
  return resolveRevenueBounds(industryId).hi * REVENUE_CATASTROPHIC_MULTIPLIER;
}

/**
 * Catastrophic LOW floor: a real small business operating at <10% of the
 * industry's lower bound isn't a viable benchmark — it's a hobby, a
 * micro-operator that doesn't represent the category, or a data
 * artifact. Suppress so the page renders "-" instead of e.g. "$5K
 * typical Mexican art gallery."
 */
function revenueCatastropheFloor(industryId: string | null | undefined): number {
  return resolveRevenueBounds(industryId).lo / 10;
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
  | "revenue_relative_outlier"
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

  // Wealth-normalized relative-outlier DASH. Independent of the absolute hi x 3
  // ceiling above: a value can sit comfortably under the SMB-physical ceiling
  // yet be a 3x-12x RELATIVE overstatement for its (industry, country) wealth
  // tier, the wrong-SCALE class of bug the ceiling cannot see. When the headline
  // revenue trips the relative test we flag the WHOLE revenue group (headline +
  // every present percentile) so the entire waterfall dashes together exactly
  // like the ceiling path; the profit-cascade block below then tags the derived
  // figures, and applyPlausibilitySuppression sets _revenueSuppressed off the
  // headline flag so fillMissingFields never resurrects it. Skipped when the
  // industry has no global median (isRelativeRevenueOutlier returns false).
  const headlineRevenue =
    typeof cell.revenue_per_firm === "number"
      ? cell.revenue_per_firm
      : typeof cell.rev_p50 === "number"
        ? cell.rev_p50
        : null;
  if (isRelativeRevenueOutlier(cell.industry_id, cell.country, headlineRevenue)) {
    // Null the SAME field set the absolute-ceiling path dashes (headline + every
    // percentile + the two total-revenue aggregates), so a relative-outlier cell
    // dashes identically on every read path, including the comparison-rail /
    // variant paths that run applyPlausibilitySuppression WITHOUT a later
    // enforceSanity. Matches the field list enforceSanity uses for its dash.
    for (const field of [
      "revenue_per_firm",
      "rev_p10",
      "rev_p25",
      "rev_p50",
      "rev_p75",
      "rev_p90",
      "total_revenue",
      "total_revenue_usd",
    ] as const) {
      if (typeof cell[field] === "number" && !flags[field]) {
        flags[field] = "revenue_relative_outlier";
      }
    }
    // Ensure the headline carries a flag even when revenue_per_firm is absent
    // and rev_p50 supplied the headline, so the cascade + _revenueSuppressed
    // marker fire on a p50-led cell too.
    if (!flags.revenue_per_firm) {
      flags.revenue_per_firm = "revenue_relative_outlier";
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
  // Mark a headline-revenue suppression so the downstream fill step does not
  // resurrect the dash with a synthesized in-bounds figure. Only the headline
  // matters here: when revenue_per_firm is nulled, fillMissingFields must leave
  // the whole revenue group dashed rather than re-deriving a "typical".
  if (analysis.fields.revenue_per_firm) {
    out._revenueSuppressed = true;
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
