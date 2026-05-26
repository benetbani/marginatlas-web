/**
 * src/lib/economic_profile/wages.ts
 *
 * Source-of-truth wage module — closes the structural wage-drift
 * problem identified in the 2026-05-26 data fidelity audit.
 *
 * Before this module: the wage fallback used by extrapolateWage,
 * cost-engine modifiers, and the cell-page payroll estimator read a
 * hardcoded COUNTRY_MEDIAN_WAGE_USD table in
 * src/lib/extrapolations/fill_missing.ts. That table predated the
 * May 2026 wage overhaul (task #129) and disagrees with the
 * overhaul output by 5-33% across sampled countries (Brazil +33%,
 * Switzerland -20%, India +19%, Australia -14%, Spain +11%).
 *
 * After this module: the source-of-truth file
 * data/economics/median_monthly_wage_usd_v1.json drives every
 * wage lookup. The hardcoded table is retained as a fallback for
 * the handful of countries the JSON file does not yet cover, but
 * the JSON wins by default.
 *
 * A prebuild gate (verify_wage_source_consistency) flags any
 * country where the hardcoded fallback drifts more than 10% from
 * the JSON value, so future drift can't be reintroduced silently.
 *
 * Reads:
 *   data/economics/median_monthly_wage_usd_v1.json
 *
 * Public API:
 *   getMedianAnnualWageUsd(iso2): number | null
 *   getMedianMonthlyWageUsd(iso2): number | null
 *   getWageQualityGrade(iso2): "A" | "B" | "C" | null
 *
 * Pure, no I/O at call time (JSON loaded once at module import).
 */

import wageJson from "../../../data/economics/median_monthly_wage_usd_v1.json";

type CountryWage = {
  median_monthly_wage_usd: number;
  source_quality?: "A" | "B" | "C";
  notes?: string;
};

type WageFile = {
  version: string;
  anchor: string;
  convention: string;
  default_fallback?: { median_monthly_wage_usd: number };
  countries: Record<string, CountryWage>;
};

const FILE = wageJson as unknown as WageFile;

/**
 * Look up the median monthly wage in USD for a country.
 * Returns null when the country is not in the source file.
 */
export function getMedianMonthlyWageUsd(
  iso2: string | null | undefined,
): number | null {
  if (!iso2) return null;
  const c = FILE.countries[iso2.toUpperCase()];
  return c?.median_monthly_wage_usd ?? null;
}

/**
 * Look up the median annual wage in USD for a country. Computes
 * monthly × 12. Returns null when the country is not in the source.
 */
export function getMedianAnnualWageUsd(
  iso2: string | null | undefined,
): number | null {
  const monthly = getMedianMonthlyWageUsd(iso2);
  if (monthly == null) return null;
  return monthly * 12;
}

/**
 * Source-quality grade for a country's wage value. A = primary
 * official statistic; B = inferred from peer; C = modeled.
 */
export function getWageQualityGrade(
  iso2: string | null | undefined,
): "A" | "B" | "C" | null {
  if (!iso2) return null;
  return FILE.countries[iso2.toUpperCase()]?.source_quality ?? null;
}

/**
 * Default fallback annual wage when neither the JSON file nor the
 * legacy hardcoded table has a value for a country. Conservative;
 * used only when both sources miss.
 */
export const DEFAULT_FALLBACK_ANNUAL_USD = 12000;

/** Count of countries in the JSON file. For audit + verify gate. */
export function getCoveredCountryCount(): number {
  return Object.keys(FILE.countries).length;
}

/** ISO2 codes present in the JSON file. For audit + verify gate. */
export function getCoveredCountryCodes(): string[] {
  return Object.keys(FILE.countries);
}
