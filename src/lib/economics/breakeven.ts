/**
 * breakeven.ts
 *
 * Computes Average Order Value (AOV) and breakeven orders per month
 * for a small business, given:
 *   - The activity (industry_id) -> baseline AOV in USD
 *   - The cell's revenue per firm (drives implied fixed-cost scale)
 *   - The industry's cost structure (rent + payroll + utilities +
 *     insurance + regulatory share of revenue from industry_baselines)
 *
 * Formula:
 *   monthlyRevenue = annualRevenue / 12
 *   fixedCostsMonthly = monthlyRevenue * (rent + payroll + utilities
 *     + insurance + regulatory)
 *   grossMargin = 1 - cost_of_goods_sold share
 *   breakevenRevenueMonthly = fixedCostsMonthly / grossMargin
 *   breakevenOrdersMonthly = breakevenRevenueMonthly / AOV
 *   breakevenOrdersDaily = breakevenOrdersMonthly / 30
 *
 * Why this matters: a $2M restaurant in NYC needs ~73 orders a day to
 * break even; a $1M restaurant in Lagos needs ~22 orders a day. The
 * absolute revenue number doesn't tell the operator that. This one
 * does.
 *
 * Founder spec 2026-05-26 (deferred from earlier data-expansion ask).
 */

import aovJson from "../../../data/economics/activity_aov_v1.json";
import cityTierMultJson from "../../../data/economics/aov_city_tier_multipliers_v1.json";
import { INDUSTRY_BASELINES } from "../qa/industry_baselines";
import { INDUSTRY_BY_ID } from "../taxonomy";

type AovFile = {
  values_usd: Record<string, number>;
  sector_defaults_usd: Record<string, number>;
};

type CityTierMultFile = {
  by_sector: Record<
    string,
    { tier_1: number; tier_2: number; tier_3: number }
  >;
};

const AOV = aovJson as AovFile;
const CITY_TIER_MULT = cityTierMultJson as CityTierMultFile;

/**
 * Pick the AOV city-tier multiplier for an activity and a city tier.
 * Looks up the activity's sector, finds the per-tier multiplier from
 * aov_city_tier_multipliers_v1.json. Returns 1.0 (neutral) when:
 *   - No cityTier is supplied (caller doesn't know — regional/state page).
 *   - The sector has no entry and "default" isn't present.
 */
export function getAovCityTierMultiplier(
  activityId: string,
  cityTier: 1 | 2 | 3 | null | undefined,
): number {
  if (cityTier !== 1 && cityTier !== 2 && cityTier !== 3) return 1.0;
  const ind = INDUSTRY_BY_ID[activityId];
  const sectorId = ind?.sector_id || "default";
  const sectorRow =
    CITY_TIER_MULT.by_sector[sectorId] || CITY_TIER_MULT.by_sector["default"];
  if (!sectorRow) return 1.0;
  const key = `tier_${cityTier}` as "tier_1" | "tier_2" | "tier_3";
  const m = sectorRow[key];
  return typeof m === "number" && m > 0 ? m : 1.0;
}

export type BreakevenBreakdown = {
  /** Average order value for the activity at this city tier, in USD.
   *  This is the tier-adjusted AOV — the global baseline scaled by
   *  the per-sector city-tier multiplier when a tier is known. */
  aov: number;
  /** The un-adjusted global baseline AOV for the activity (before the
   *  city-tier multiplier was applied). Surfaced for transparency. */
  baselineAov: number;
  /** Multiplier applied to baselineAov to get aov. 1.0 when no tier
   *  is known or sector has no entry. */
  cityTierMultiplier: number;
  /** Whether the AOV came from the curated table or a sector default. */
  aovSource: "curated" | "sector-default" | "default";
  /** Annual revenue per firm (input). */
  annualRevenue: number;
  /** Monthly revenue derived. */
  monthlyRevenue: number;
  /** Sum of fixed-cost shares (rent + payroll + utilities + insurance + regulatory). */
  fixedCostShare: number;
  /** Fixed costs per month in USD. */
  fixedCostsMonthly: number;
  /** Gross margin (1 - COGS share). */
  grossMargin: number;
  /** Revenue needed each month just to cover fixed costs at gross margin. */
  breakevenRevenueMonthly: number;
  /** Orders needed each month to hit breakeven. */
  breakevenOrdersMonthly: number;
  /** Same as above, expressed daily. */
  breakevenOrdersDaily: number;
  /** Daily orders implied by the cell's actual revenue (for comparison). */
  currentOrdersDaily: number;
  /** Headroom: currentOrdersDaily / breakevenOrdersDaily. 1.0 = at breakeven. */
  coverageRatio: number;
};

/**
 * Look up AOV with graceful fallback.
 */
function getAovUsd(activityId: string): { aov: number; source: BreakevenBreakdown["aovSource"] } {
  const curated = AOV.values_usd[activityId];
  if (typeof curated === "number" && curated > 0) {
    return { aov: curated, source: "curated" };
  }
  const ind = INDUSTRY_BY_ID[activityId];
  const sectorId = ind?.sector_id;
  if (sectorId) {
    const sectorDefault = AOV.sector_defaults_usd[sectorId];
    if (typeof sectorDefault === "number" && sectorDefault > 0) {
      return { aov: sectorDefault, source: "sector-default" };
    }
  }
  const fallback = AOV.sector_defaults_usd["default"] ?? 95;
  return { aov: fallback, source: "default" };
}

/**
 * Compute breakeven for an activity + revenue level.
 * Returns null when input is incoherent (no revenue, no baseline).
 *
 * The optional cityTier (1/2/3) lets the caller pass the city's
 * urban-hierarchy tier so the AOV gets scaled correctly. A Manhattan
 * restaurant (tier 1) charges ~60% more per check than the global
 * average; a Lagos one (tier 3) ~30% less. When cityTier is omitted
 * (regional/state page), the multiplier is 1.0 (neutral baseline).
 */
export function computeBreakeven(
  activityId: string,
  annualRevenueUsd: number | null,
  cityTier?: 1 | 2 | 3 | null,
): BreakevenBreakdown | null {
  if (!annualRevenueUsd || annualRevenueUsd <= 0) return null;
  const baseline = INDUSTRY_BASELINES[activityId];
  if (!baseline) return null;

  const { aov: baselineAov, source } = getAovUsd(activityId);
  if (baselineAov <= 0) return null;

  const cityTierMultiplier = getAovCityTierMultiplier(activityId, cityTier);
  const aov = baselineAov * cityTierMultiplier;

  const monthlyRevenue = annualRevenueUsd / 12;

  // Fixed-cost share: rent + payroll + utilities + insurance + regulatory.
  // Marketing and equipment maintenance are semi-variable -> excluded so the
  // breakeven number reflects HARD fixed costs that fire even with zero sales.
  const fixedCostShare =
    baseline.rent_occupancy +
    baseline.payroll_total +
    baseline.utilities +
    baseline.insurance_professional +
    baseline.regulatory_licensing;
  const fixedCostsMonthly = monthlyRevenue * fixedCostShare;

  // Gross margin: 1 - COGS share. For service-only businesses where
  // cost_of_goods_sold is ~0, this approaches 1.0 (everything is gross
  // margin available to cover fixed costs).
  const grossMargin = Math.max(0.1, 1 - baseline.cost_of_goods_sold);

  // Revenue needed each month to cover fixed costs at gross margin.
  const breakevenRevenueMonthly = fixedCostsMonthly / grossMargin;

  // Orders needed at the activity's AOV.
  const breakevenOrdersMonthly = breakevenRevenueMonthly / aov;
  const breakevenOrdersDaily = breakevenOrdersMonthly / 30;

  // For comparison: orders the cell's actual revenue implies (assuming
  // a 30-day month and the same AOV).
  const currentOrdersDaily = monthlyRevenue / aov / 30;
  const coverageRatio =
    breakevenOrdersDaily > 0 ? currentOrdersDaily / breakevenOrdersDaily : 1;

  return {
    aov,
    baselineAov,
    cityTierMultiplier,
    aovSource: source,
    annualRevenue: annualRevenueUsd,
    monthlyRevenue,
    fixedCostShare,
    fixedCostsMonthly,
    grossMargin,
    breakevenRevenueMonthly,
    breakevenOrdersMonthly,
    breakevenOrdersDaily,
    currentOrdersDaily,
    coverageRatio,
  };
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function fmtAov(usd: number): string {
  if (usd >= 1000) return `$${(usd / 1000).toFixed(1)}K`;
  return `$${Math.round(usd)}`;
}

export function fmtOrders(n: number): string {
  if (n >= 10000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}
