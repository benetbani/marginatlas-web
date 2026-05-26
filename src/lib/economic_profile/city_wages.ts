/**
 * src/lib/economic_profile/city_wages.ts
 *
 * Goldmines Wave 2 — wire data/economics/city_wage_premium_v1.json
 * into the render layer. Previously: 156 cities of per-metro primary
 * wage data sat unread on disk. After: cell pages and city pages can
 * use city-specific wages instead of country-level fallback.
 *
 * The city-level wages are anchored to primary sources per city:
 *   - US metros: BLS OEWS data
 *   - UK: ONS ASHE
 *   - Japan: MIC Basic Wage Survey
 *   - India: MOSPI PLFS
 *   - etc.
 *
 * Public API:
 *   getCityMonthlyWageUsd(citySlug): number | null
 *   getCityAnnualWageUsd(citySlug): number | null
 *   getCityWageQualityGrade(citySlug): "A" | "B" | "C" | null
 *
 * The classify-by-city helper for cells:
 *   getCellWageEstimate(iso2, citySlug, industryId): number | null
 *
 * Pure module, no I/O at call time.
 */

import cityWageJson from "../../../data/economics/city_wage_premium_v1.json";
import { getMedianAnnualWageUsd } from "./wages";

type CityWage = {
  avg_monthly_wage_usd: number;
  source_quality?: "A" | "B" | "C";
  notes?: string;
};

type CityWageFile = {
  version: string;
  cities: Record<string, CityWage>;
};

const FILE = cityWageJson as unknown as CityWageFile;

/** Look up the average monthly wage in USD for a given city slug. */
export function getCityMonthlyWageUsd(
  citySlug: string | null | undefined,
): number | null {
  if (!citySlug) return null;
  const c = FILE.cities[citySlug.toLowerCase()];
  return c?.avg_monthly_wage_usd ?? null;
}

/** Annual = monthly × 12. */
export function getCityAnnualWageUsd(
  citySlug: string | null | undefined,
): number | null {
  const monthly = getCityMonthlyWageUsd(citySlug);
  if (monthly == null) return null;
  return monthly * 12;
}

/** Quality grade of the city wage anchor. */
export function getCityWageQualityGrade(
  citySlug: string | null | undefined,
): "A" | "B" | "C" | null {
  if (!citySlug) return null;
  return FILE.cities[citySlug.toLowerCase()]?.source_quality ?? null;
}

/**
 * Returns the best annual wage anchor for a (country, city) tuple.
 *
 * Priority:
 *   1. City-level primary wage from city_wage_premium_v1.json.
 *   2. Country-level primary wage from median_monthly_wage_usd_v1.json.
 *   3. null.
 *
 * Used by the cell-page wage fallback so San Francisco cells see
 * SF-specific wages, not California averages.
 */
export function resolveAnchorAnnualWageUsd(
  iso2: string | null | undefined,
  citySlug: string | null | undefined,
): number | null {
  const cityAnnual = getCityAnnualWageUsd(citySlug);
  if (cityAnnual != null) return cityAnnual;
  return getMedianAnnualWageUsd(iso2);
}

/** Count of cities in the source file. For audit + verify gate. */
export function getCoveredCityCount(): number {
  return Object.keys(FILE.cities).length;
}

/** Slugs present in the source file. For audit + verify gate. */
export function getCoveredCitySlugs(): string[] {
  return Object.keys(FILE.cities);
}
