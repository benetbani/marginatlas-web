/**
 * src/lib/tax/country_rates.ts
 *
 * Country-level rates for the "set-up and run cost" block on the country page:
 *   - the employer payroll / social-contribution rate (the payroll tax on staff)
 *   - the typical one-time cost to register a small business
 * Both are planning estimates only; regional / state variation is out of scope
 * here. The corporate-income-tax field is also exposed for completeness.
 */
import countryRatesJson from "./country_rates_2024.json";
import formationJson from "../../../data/legal/business_formation_costs_v1.json";

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

type RateRow = { cit?: number; employer_social?: number; notes?: string };
const RATES = (countryRatesJson as { rates: Record<string, RateRow> }).rates;

/** Corporate income tax + employer payroll rates for a country, or nulls. */
export function getCountryRates(iso2: string): {
  cit: number | null;
  employerSocial: number | null;
} {
  const r = RATES[iso2.toUpperCase()];
  return {
    cit: r && isNum(r.cit) ? r.cit : null,
    employerSocial: r && isNum(r.employer_social) ? r.employer_social : null,
  };
}

type FormationRow = { tier?: string; setup_cost_usd?: number };
const FORMATION =
  (formationJson as { countries?: Record<string, FormationRow[]> }).countries ?? {};

/**
 * Typical one-time government cost to register a small business (USD): the Sole
 * Trader tier where present, else the cheapest non-Freelancer tier, else the
 * first tier. Null when the country has no curated formation breakdown.
 */
export function getTypicalFormationCostUsd(iso2: string): number | null {
  const rows = FORMATION[iso2.toUpperCase()];
  if (!rows || rows.length === 0) return null;
  const pick =
    rows.find((r) => r.tier === "Sole Trader") ??
    rows.find((r) => r.tier !== "Freelancer") ??
    rows[0];
  return pick && isNum(pick.setup_cost_usd) ? pick.setup_cost_usd : null;
}
