/**
 * Tax overlay data layer (Track P Phase P.1).
 *
 * Country-level corporate income tax + employer social contribution rates.
 * Used by PostTaxToggle component to estimate post-tax owner take-home.
 *
 * Per founder direction (2026-05-18): Option C — country-level is FREE
 * for everyone; regional refinement (US states, DE Länder, etc.) is
 * Pro-only and ships in Phase P.3.
 */

import tableJson from "./tax/country_rates_2024.json";

export type TaxRow = {
  cit: number;             // corporate income tax effective rate, decimal (0.21 = 21%)
  employer_social: number; // employer social contribution rate, decimal
  notes: string;
};

type RawTable = {
  version: string;
  rates: Record<string, TaxRow>;
  default_fallback: TaxRow;
};

const TABLE = tableJson as unknown as RawTable;

export function getCountryTaxRates(iso2: string): TaxRow {
  const key = iso2.toUpperCase();
  return TABLE.rates[key] || TABLE.default_fallback;
}

export function hasCountrySpecificRates(iso2: string): boolean {
  return iso2.toUpperCase() in TABLE.rates;
}

/**
 * Estimate post-tax owner take-home for a single firm.
 *
 * Pre-tax flow:
 *   gross_revenue
 *   - payroll (employees × wage)
 *   = gross_profit
 *
 * Post-tax flow (this function):
 *   gross_revenue
 *   - payroll
 *   - employer_social_contributions = payroll × employer_social_rate
 *   = pre-tax_profit
 *   - corporate_income_tax = pre-tax_profit × cit_rate (only if positive)
 *   = owner_take
 *
 * Returns null when the inputs are insufficient (no revenue or no payroll).
 */
export function estimatePostTax(
  iso2: string,
  grossRevenue: number | null | undefined,
  payroll: number | null | undefined,
): {
  gross_revenue: number;
  payroll: number;
  employer_social_cost: number;
  pre_tax_profit: number;
  cit_owed: number;
  owner_take: number;
  rates: TaxRow;
  country_specific: boolean;
} | null {
  if (!grossRevenue || grossRevenue <= 0) return null;
  const p = payroll ?? 0;
  if (p < 0) return null;
  const rates = getCountryTaxRates(iso2);
  const employer_social_cost = p * rates.employer_social;
  const pre_tax_profit = grossRevenue - p - employer_social_cost;
  const cit_owed = pre_tax_profit > 0 ? pre_tax_profit * rates.cit : 0;
  const owner_take = pre_tax_profit - cit_owed;
  return {
    gross_revenue: grossRevenue,
    payroll: p,
    employer_social_cost,
    pre_tax_profit,
    cit_owed,
    owner_take,
    rates,
    country_specific: hasCountrySpecificRates(iso2),
  };
}
