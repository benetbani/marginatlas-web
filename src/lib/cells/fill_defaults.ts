/**
 * Synthesis engine for "always render a cell".
 *
 * `synthesizeCell(iso2, industrySlug, opts)` returns a complete Cell
 * populated with plausible per-firm revenue, percentiles, payroll,
 * employees, and margins. Used when no actual row exists in
 * regional_cells / cells_master / extrapolated_cells / sector fallback.
 *
 * Hierarchy of inputs:
 *
 *   1. Per-industry revenue envelope from REVENUE_PER_FIRM_BOUNDS
 *      (midpoint of conservative SMB bounds).
 *   2. Per-country scale + payroll baseline from
 *      country_smb_baseline.json.
 *   3. Per-industry margin profile from industry_margins.json.
 *   4. Log-normal percentile spread anchored at the typical revenue
 *      (p50 = 1x, p10 = 0.25x, p25 = 0.55x, p75 = 1.85x, p90 = 3.4x).
 *
 * Output cells are tagged:
 *   - coverage_tier = "X"
 *   - quality_score = 20  (1-dot in the QualityDots system)
 *   - is_synthetic = true
 *
 * The render layer must read `is_synthetic` and show an "Estimated"
 * badge + disclosure so users don't mistake synthesized numbers for
 * measurements.
 *
 * Critical safety: synthesis is render-layer only. No DB writes. The
 * underlying tables stay untouched.
 */
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
} from "../qa/smb_bounds";
import {
  getCatastropheCeiling,
  isRelativeRevenueOutlier,
} from "../qa/plausibility_suppression";
import {
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "../taxonomy";
import { iso2ToIso3, iso2ToName } from "../countries";
import industryMarginsJson from "../finance/industry_margins.json";
import countryEconJson from "../finance/country_industry_economics.json";
import countryBaselineJson from "./country_smb_baseline.json";
import type { Cell } from "../cells";
import { getIndustryAnchorRevenue } from "@/lib/economic_profile/industry_medians";

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
  notes?: string;
};

const MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

type CountryBaselineRow = {
  payroll_per_employee_usd: number;
  revenue_multiplier: number;
  currency: string;
};

const COUNTRY_BASELINE = countryBaselineJson as unknown as {
  default_fallback: CountryBaselineRow;
  countries: Record<string, CountryBaselineRow>;
};

/** Global SMB median revenue baseline (USD). Country multiplier × this = typical local revenue. */
const GLOBAL_SMB_BASELINE_USD = 300_000;

/** Log-normal-ish percentile multipliers, anchored at p50 = 1x. */
const PCT_MULTIPLIERS = {
  p10: 0.25,
  p25: 0.55,
  p50: 1.0,
  p75: 1.85,
  p90: 3.4,
};

/** Default employees-per-firm for SMB synthesis. */
const DEFAULT_EMPLOYEES = 4;

function lookupCountry(iso2: string): CountryBaselineRow {
  return (
    COUNTRY_BASELINE.countries[iso2.toUpperCase()] ||
    COUNTRY_BASELINE.default_fallback
  );
}

function lookupIndustryMargin(industryId: string): IndustryMarginRow {
  return MARGINS.industries[industryId] || MARGINS.default_fallback;
}

type CountryEconRow = {
  net_margin: number;
  gross_margin: number;
  operating_margin: number;
  cost_structure: { cogs: number; labor: number; rent: number; other: number };
  firm_distribution: Record<string, number>;
};

const COUNTRY_ECON = countryEconJson as unknown as Record<string, CountryEconRow>;

type ResolvedEcon = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  cost_structure: { cogs: number; labor: number; rent: number; other: number } | null;
  firm_distribution: Record<string, number> | null;
};

/**
 * Country-specific economics from the research drops, falling back to the
 * generic per-industry margin profile when there is no (country, industry)
 * entry. Keyed `${ISO2}:${industry_id}`. This is what makes a Kenyan salon
 * show Kenyan margins + a Kenyan cost split instead of a global average.
 */
function resolveEconomics(industryId: string, iso2: string): ResolvedEcon {
  const c = COUNTRY_ECON[`${iso2.toUpperCase()}:${industryId}`];
  if (c) {
    return {
      gross_margin: c.gross_margin,
      operating_margin: c.operating_margin,
      net_margin: c.net_margin,
      cost_structure: c.cost_structure ?? null,
      firm_distribution: c.firm_distribution ?? null,
    };
  }
  const m = lookupIndustryMargin(industryId);
  return {
    gross_margin: m.gross_margin,
    operating_margin: m.operating_margin,
    net_margin: m.net_margin,
    cost_structure: null,
    firm_distribution: null,
  };
}

/**
 * Firm-share distribution (share of firms per employee band) for a
 * (country, industry) from the research-drop economics, or null when there is
 * no entry. Exposed so the extrapolated all-sizes read can fold its per-band
 * rows with the SAME weights fill_defaults uses for the cost / margin profile,
 * keeping the headline number and the "who runs these" mix in agreement.
 */
export function getCountryIndustryFirmDistribution(
  industryId: string,
  iso2: string,
): Record<string, number> | null {
  return resolveEconomics(industryId, iso2).firm_distribution;
}

/**
 * Pick a typical revenue-per-firm for (country, industry) within the
 * SMB envelope. Uses the per-industry bounds midpoint scaled by the
 * country's revenue multiplier, clamped back into bounds.
 */
function pickTypicalRevenue(industryId: string, iso2: string): number {
  const bounds = REVENUE_PER_FIRM_BOUNDS[industryId] || DEFAULT_REVENUE_BOUNDS;
  // Goldmines Wave 3 — when a verified industry median exists for this
  // (industry, country) pair, prefer it over the bounds-based synthesis.
  // The verified medians come from data/quality/industry_medians_v1.json
  // which was built as a cross-source check against extrapolated cells.
  // Falls back to the synthesis when no verified median is available.
  const verified = getIndustryAnchorRevenue(industryId, iso2);
  if (verified != null && verified > 0) {
    return Math.max(bounds.lo, Math.min(bounds.hi, verified));
  }
  // Geometric mean is friendlier than arithmetic for a log-distributed range.
  const geoMid = Math.sqrt(bounds.lo * bounds.hi);
  // Scale by country multiplier.
  const country = lookupCountry(iso2);
  const scaled = geoMid * country.revenue_multiplier;
  // Clamp back inside the bounds — synthesis stays within SMB-physical range.
  return Math.max(bounds.lo, Math.min(bounds.hi, scaled));
}

/**
 * Build a complete Cell for (iso2, industrySlug) with no real data.
 * Margins, percentiles, employees, and payroll are all populated. The
 * returned object satisfies every consumer in the cell page.
 */
export function synthesizeCell(
  iso2: string,
  industrySlug: string,
  opts?: { geoSlug?: string; geoName?: string; year?: number },
): Cell {
  const isoUpper = iso2.toUpperCase();
  const rawInd = slugToIndustry(industrySlug);
  const ind = resolveToMeasuredIndustry(rawInd);
  // If the slug doesn't map to a known industry, fall back to a generic
  // SMB stub so the page can still render.
  const industryId = ind?.id || rawInd?.id || "default";
  const industryName = ind?.name || rawInd?.name || "Small business";
  const sectorId = ind?.sector_id || rawInd?.sector_id || null;
  const sectorName = sectorId ? SECTOR_BY_ID[sectorId]?.name || null : null;

  const country = lookupCountry(isoUpper);
  const econ = resolveEconomics(industryId, isoUpper);

  const typicalRevenue = pickTypicalRevenue(industryId, isoUpper);
  const grossMargin = econ.gross_margin;
  const operatingMargin = econ.operating_margin;
  const netMargin = econ.net_margin;

  const grossProfit = typicalRevenue * grossMargin;
  const operatingProfit = typicalRevenue * operatingMargin;
  const netProfit = typicalRevenue * netMargin;

  // Payroll synthesis: country baseline wage. Employees default to 4.
  // Sanity rule: total payroll must not exceed (revenue - gross profit) —
  // i.e. payroll fits within COGS. If our default 4 employees would
  // exceed that, scale employees down so the numbers add up.
  const wage = country.payroll_per_employee_usd;
  const cogs = typicalRevenue - grossProfit;
  const maxEmployeesFromCogs = Math.max(1, Math.floor(cogs / wage));
  const nEmployees = Math.min(DEFAULT_EMPLOYEES, maxEmployeesFromCogs);

  // Percentile spread.
  const p10 = typicalRevenue * PCT_MULTIPLIERS.p10;
  const p25 = typicalRevenue * PCT_MULTIPLIERS.p25;
  const p50 = typicalRevenue;
  const p75 = typicalRevenue * PCT_MULTIPLIERS.p75;
  const p90 = typicalRevenue * PCT_MULTIPLIERS.p90;

  const year = opts?.year || 2024;
  const geoId = opts?.geoSlug?.toUpperCase() || iso2ToIso3(isoUpper) || isoUpper;
  const geoName = opts?.geoName || iso2ToName(isoUpper) || isoUpper;

  const cell: Cell = {
    country: isoUpper,
    geo_id: geoId,
    geo_level: opts?.geoSlug ? "region" : "country",
    geo_name: geoName,
    naics_6: null,
    naics_4: null,
    industry_id: industryId,
    industry_name: industryName,
    industry_examples: ind?.examples,
    sector_id: sectorId || undefined,
    sector_name: sectorName || undefined,
    industry_description: industryName,
    size_band: null,
    year,
    n_enterprises: 100,
    n_employees: nEmployees,
    total_revenue: typicalRevenue * 100,
    total_revenue_usd: typicalRevenue * 100,
    revenue_per_firm: typicalRevenue,
    rev_p10: p10,
    rev_p25: p25,
    rev_p50: p50,
    rev_p75: p75,
    rev_p90: p90,
    payroll_per_employee: wage,
    gross_margin: grossMargin,
    operating_margin: operatingMargin,
    net_margin: netMargin,
    gross_profit: grossProfit,
    operating_profit: operatingProfit,
    net_profit: netProfit,
    cost_structure: econ.cost_structure,
    firm_distribution: econ.firm_distribution,
    quality_score: 20,
    coverage_tier: "X",
    coverage_source: "Estimated from country and industry averages",
    currency: country.currency,
    is_synthetic: true,
  };
  return cell;
}

/**
 * Wage sanity. Catches local-currency-as-USD bugs (e.g., 6,000,000 yen leaked
 * as a $6M wage). Absolute SMB wage ceiling is $250K/yr/employee; floor is
 * $1.2K (anything below is likely a monthly figure mistaken for annual).
 *
 * Mutates the cell in place. Independent of revenue, so it runs on every cell
 * including ones whose revenue was dashed as catastrophic.
 */
function sanitizeWage(out: Cell): void {
  if (out.payroll_per_employee != null) {
    if (out.payroll_per_employee > 250_000) {
      // Looks like a currency or scale error — fall back to country median.
      const cb = COUNTRY_BASELINE.countries[(out.country || "").toUpperCase()] || COUNTRY_BASELINE.default_fallback;
      out.payroll_per_employee = cb.payroll_per_employee_usd;
    } else if (out.payroll_per_employee > 0 && out.payroll_per_employee < 1200) {
      // Possibly monthly. Multiply by 12; if still in range use it, else fall back.
      const annualized = out.payroll_per_employee * 12;
      const cb = COUNTRY_BASELINE.countries[(out.country || "").toUpperCase()] || COUNTRY_BASELINE.default_fallback;
      out.payroll_per_employee = annualized <= 250_000 && annualized >= 1200
        ? annualized
        : cb.payroll_per_employee_usd;
    }
  }
}

/**
 * Common-sense math.
 *
 * Ensures the cell's numbers add up:
 *   - revenue ≥ payroll × employees × 1.4 (40% non-payroll headroom)
 *   - net_profit > 0 (use industry minimum if margins are negative)
 *   - n_employees ≤ revenue / payroll (cap employees so wages fit)
 *
 * Applied to BOTH real and synthesized cells after fillMissingFields.
 * Founder's example: software dev CA $525K revenue, $99K wage, 4
 * employees → $396K payroll. revenue/payroll = 1.33, which falls below
 * the 1.4 floor. The helper trims employees to 3 (revenue $525K covers
 * $297K payroll × 1.4 = $415K easily) so the visual reads sanely.
 */
export function enforceSanity(cell: Cell): Cell {
  const out: Cell = { ...cell };
  // Revenue dash-or-clamp gate at read time. Per-industry SMB bounds govern
  // revenue_per_firm BEFORE downstream consumers (margin estimator, comparator,
  // narrative) see it. This catches extrapolated / regional rows where
  // industry × country produced absurd values (e.g. utilities at SMB-size-band
  // in tax havens, or whole-sector revenue posing as per-firm).
  //
  // Three-way rule, sharing ONE source of truth with the plausibility
  // suppression chokepoint (getCatastropheCeiling = bounds.hi ×
  // REVENUE_CATASTROPHIC_MULTIPLIER, same REVENUE_PER_FIRM_BOUNDS lookup):
  //
  //   - headline revenue > hi × 3 (catastrophic): DASH. Null the whole revenue
  //     group (headline + every percentile) plus the derived profit/margin
  //     fields, so the page shows the board's honest dash, never a number we
  //     are suppressing. This makes the dash decision live at the same place as
  //     the clamp: a catastrophic value can no longer be clamped down to `hi`
  //     and rendered as a clean "typical", which is exactly the bug where the
  //     clamp pre-empted the suppression.
  //   - hi < revenue ≤ hi × 3: clamp to hi (unchanged — a mildly-high value is
  //     still a usable benchmark capped at the industry ceiling).
  //   - revenue ≤ hi: untouched.
  //
  // The catastrophe test reads the headline (revenue_per_firm, or rev_p50 when
  // the headline is absent) so the decision tracks the figure the board prints
  // as "Typical revenue". When it dashes, the range and spread cannot survive
  // as [x, hi]: every percentile is nulled here too, at the data layer.
  const indId = out.industry_id || "default";
  const bounds = REVENUE_PER_FIRM_BOUNDS[indId] || DEFAULT_REVENUE_BOUNDS;
  const catastropheCeiling = getCatastropheCeiling(out.industry_id);
  const headlineRevenue =
    out.revenue_per_firm != null ? out.revenue_per_firm : out.rev_p50 ?? null;
  // Two independent dash tests share ONE cascade below:
  //   - absolute: headline > industry hi x 3 (the long-standing catastrophe gate).
  //   - relative: headline is a wealth-normalized outlier for this (industry,
  //     country), i.e. a 3x-12x wrong-SCALE overstatement that still lands under
  //     the absolute ceiling (the AU/CA/IL/QA-class bug). Same source of truth
  //     as the suppression chokepoint (isRelativeRevenueOutlier), so the
  //     sector-fallback path (which skips applyPlausibilitySuppression) and the
  //     final getCellBySlug wrap dash on the identical rule.
  const revenueIsCatastrophic =
    (headlineRevenue != null && headlineRevenue > catastropheCeiling) ||
    isRelativeRevenueOutlier(out.industry_id, out.country, headlineRevenue);

  if (revenueIsCatastrophic) {
    // Dash the entire revenue waterfall together.
    for (const key of [
      "revenue_per_firm",
      "rev_p10",
      "rev_p25",
      "rev_p50",
      "rev_p75",
      "rev_p90",
      "total_revenue",
      "total_revenue_usd",
      "gross_profit",
      "operating_profit",
      "net_profit",
    ] as const) {
      (out as Record<string, unknown>)[key] = null;
    }
    // Mark the suppression so any later fill step (e.g. the wrapper re-running
    // fillMissingFields) cannot resurrect the dash with a synthesized figure.
    // enforceSanity is normally the last transform, so this is belt-and-braces
    // against future reordering, but it costs nothing and removes the hazard.
    out._revenueSuppressed = true;
    // Early return: with no revenue there is nothing for the clamp,
    // monotonicity, employee-ratio, or profit-floor steps below to act on, and
    // re-deriving any of them would resurrect the figure we just dashed.
    // Wage sanity is independent of revenue, so apply it before returning.
    sanitizeWage(out);
    return out;
  }

  if (out.revenue_per_firm != null && out.revenue_per_firm > bounds.hi) {
    out.revenue_per_firm = bounds.hi;
  }
  // Apply same ceiling to percentiles so they stay consistent.
  for (const key of ["rev_p10", "rev_p25", "rev_p50", "rev_p75", "rev_p90"] as const) {
    const v = out[key as keyof Cell] as number | null | undefined;
    if (v != null && v > bounds.hi) {
      (out as Record<string, unknown>)[key] = bounds.hi;
    }
  }

  // Percentile monotonicity (QA D4). Some real source rows arrive with
  // p10 >= p50 or otherwise out of order, which renders a distribution where
  // "bottom 10%" sits above "typical". Sort the present percentile values
  // ascending and reassign in order so p10 <= p25 <= p50 <= p75 <= p90 always
  // holds. Only reorders values that exist; nulls are left for fillMissingFields.
  {
    const pKeys = ["rev_p10", "rev_p25", "rev_p50", "rev_p75", "rev_p90"] as const;
    const present = pKeys.filter(
      (k) => typeof out[k as keyof Cell] === "number" && (out[k as keyof Cell] as number) > 0,
    );
    if (present.length >= 2) {
      const sorted = present
        .map((k) => out[k as keyof Cell] as number)
        .sort((a, b) => a - b);
      present.forEach((k, i) => {
        (out as Record<string, unknown>)[k] = sorted[i];
      });
    }
  }

  sanitizeWage(out);

  const wage = out.payroll_per_employee || 0;
  const rev = out.revenue_per_firm || 0;
  const empl = out.n_employees || 0;
  const ents = out.n_enterprises || 0;

  // 1. Normalise n_employees to a PER-FIRM count, then cap it so revenue /
  //    (employees × wage) ≥ 1.4 (40% non-payroll headroom).
  //
  //    Unit collision fix. Regional rows store n_employees as the REGION TOTAL
  //    (headcount across every firm), while the documented contract for the
  //    field downstream — the cell page's payroll math and its "People working"
  //    row — is a PER-FIRM count. When the value is a total (n_employees >
  //    n_enterprises, with a real enterprise count) we divide down to per-firm
  //    FIRST, then apply the affordability guard to that per-firm figure. The
  //    old code skipped the divide and applied the guard to the total, which
  //    produced an inflated per-firm ceiling (e.g. a Paris cafe stored as ~20
  //    when the truth is ~4); the page then read that as "already per-firm",
  //    multiplied by the wage, and overstated payroll several-fold, driving net
  //    profit negative. Dividing first makes the stored value honor its
  //    per-firm contract, so the payroll math and the headcount both read true.
  //
  //    When the value is already per-firm (n_employees ≤ n_enterprises) or there
  //    is no enterprise count to divide by, behaviour is unchanged: the guard is
  //    applied to the value as-is. The result is always a per-firm integer ≥ 1.
  if (wage > 0 && empl > 0) {
    const perFirm = ents > 0 && empl > ents ? empl / ents : empl;
    let normalized = perFirm;
    if (rev > 0) {
      const ratio = rev / (perFirm * wage);
      if (ratio < 1.4) {
        normalized = Math.max(1, Math.floor(rev / (wage * 1.4)));
      }
    }
    out.n_employees = Math.max(1, Math.round(normalized));
  }

  // 2. Net profit must be positive. If the inherited net_margin is
  //    non-positive (which happens with broken extrapolations), bump
  //    to the industry default's net_margin floor.
  const industryId = out.industry_id || "default";
  const econ = resolveEconomics(industryId, out.country || "US");
  if (out.net_margin == null || out.net_margin <= 0) {
    out.net_margin = econ.net_margin;
  }
  if (rev > 0 && (out.net_profit == null || out.net_profit <= 0)) {
    out.net_profit = rev * (out.net_margin || econ.net_margin);
  }
  // Attach the country-specific cost split + firm mix if an earlier step did not.
  if (out.cost_structure == null && econ.cost_structure) out.cost_structure = econ.cost_structure;
  if (out.firm_distribution == null && econ.firm_distribution) out.firm_distribution = econ.firm_distribution;

  return out;
}

/**
 * Mutating helper: take a partially-populated real cell and fill in
 * the missing fields with synthesized defaults. Use after a successful
 * regional / extrapolated lookup that left some fields null.
 */
export function fillMissingFields(cell: Cell): Cell {
  const iso2 = (cell.country || "US").toUpperCase();
  const industryId = cell.industry_id || "default";
  const country = lookupCountry(iso2);
  const econ = resolveEconomics(industryId, iso2);

  const out: Cell = { ...cell };
  // Honor an upstream catastrophic-revenue suppression: when the headline
  // revenue was deliberately nulled (raw > industry hi × 3), do NOT resurrect
  // it or its percentiles with a synthesized in-bounds figure. Re-deriving here
  // would launder the suppression into a fabricated "typical" and defeat the
  // dash. The non-revenue defaults (wage, employees, margins) below still fill
  // so the rest of the page renders. This is the data-layer half of the
  // coupling the board also enforces (null median -> null range + omitted bar).
  if (!out._revenueSuppressed) {
    const typical = out.revenue_per_firm || pickTypicalRevenue(industryId, iso2);
    if (out.revenue_per_firm == null) out.revenue_per_firm = typical;
    if (out.rev_p50 == null) out.rev_p50 = typical;
    if (out.rev_p10 == null) out.rev_p10 = typical * PCT_MULTIPLIERS.p10;
    if (out.rev_p25 == null) out.rev_p25 = typical * PCT_MULTIPLIERS.p25;
    if (out.rev_p75 == null) out.rev_p75 = typical * PCT_MULTIPLIERS.p75;
    if (out.rev_p90 == null) out.rev_p90 = typical * PCT_MULTIPLIERS.p90;
  }
  if (out.payroll_per_employee == null)
    out.payroll_per_employee = country.payroll_per_employee_usd;
  if (out.n_employees == null) out.n_employees = DEFAULT_EMPLOYEES;
  if (out.n_enterprises == null) out.n_enterprises = 100;
  if (out.currency == null) out.currency = country.currency;

  // Derived margins — always set so render layer never sees null. Prefer the
  // country-specific economics from the drops; fall back to the generic profile.
  if (out.gross_margin == null) out.gross_margin = econ.gross_margin;
  if (out.operating_margin == null) out.operating_margin = econ.operating_margin;
  if (out.net_margin == null) out.net_margin = econ.net_margin;
  if (out.gross_profit == null && out.revenue_per_firm != null)
    out.gross_profit = out.revenue_per_firm * (out.gross_margin || econ.gross_margin);
  if (out.operating_profit == null && out.revenue_per_firm != null)
    out.operating_profit = out.revenue_per_firm * (out.operating_margin || econ.operating_margin);
  if (out.net_profit == null && out.revenue_per_firm != null)
    out.net_profit = out.revenue_per_firm * (out.net_margin || econ.net_margin);
  if (out.cost_structure == null) out.cost_structure = econ.cost_structure;
  if (out.firm_distribution == null) out.firm_distribution = econ.firm_distribution;
  return out;
}
