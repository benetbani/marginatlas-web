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
import usStatesJson from "./tax/us_states_2024.json";
import deSubregionalJson from "./tax/de_subregional_2024.json";
import chSubregionalJson from "./tax/ch_subregional_2024.json";
import gbSubregionalJson from "./tax/gb_subregional_2024.json";
import frSubregionalJson from "./tax/fr_subregional_2024.json";
import itSubregionalJson from "./tax/it_subregional_2024.json";
import esSubregionalJson from "./tax/es_subregional_2024.json";
import caSubregionalJson from "./tax/ca_subregional_2024.json";
import auSubregionalJson from "./tax/au_subregional_2024.json";
import brSubregionalJson from "./tax/br_subregional_2024.json";

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

/* ---------- Sub-regional tax (Plan v10 Track RR + SS) ---------- */

export type UsStateRow = {
  name: string;
  corporate_income_tax: number;
  sales_tax: number;
  pit_top: number;
  employer_suta: number;
  notes: string;
};
type UsStatesTable = {
  states: Record<string, UsStateRow>;
  city_surcharges: Record<string, Array<{ name: string; rate: number; base: string; notes: string }>>;
};
const US_STATES = usStatesJson as unknown as UsStatesTable;

// Map our internal geo_id formats to the two-letter postal code keys
// used in us_states_2024.json. Accepts: "CA", "us-06", "US-06",
// "california", "us-california", etc.
const US_FIPS_TO_POSTAL: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO",
  "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI",
  "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY",
  "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH",
  "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH",
  "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD",
  "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY",
};
const US_NAME_TO_POSTAL: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
  "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
  "district-of-columbia": "DC", "florida": "FL", "georgia": "GA",
  "hawaii": "HI", "idaho": "ID", "illinois": "IL", "indiana": "IN",
  "iowa": "IA", "kansas": "KS", "kentucky": "KY", "louisiana": "LA",
  "maine": "ME", "maryland": "MD", "massachusetts": "MA", "michigan": "MI",
  "minnesota": "MN", "mississippi": "MS", "missouri": "MO", "montana": "MT",
  "nebraska": "NE", "nevada": "NV", "new-hampshire": "NH", "new-jersey": "NJ",
  "new-mexico": "NM", "new-york": "NY", "north-carolina": "NC",
  "north-dakota": "ND", "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
  "pennsylvania": "PA", "rhode-island": "RI", "south-carolina": "SC",
  "south-dakota": "SD", "tennessee": "TN", "texas": "TX", "utah": "UT",
  "vermont": "VT", "virginia": "VA", "washington": "WA", "west-virginia": "WV",
  "wisconsin": "WI", "wyoming": "WY",
};

function normalizeUsStateKey(raw: string): string {
  const s = raw.trim().toLowerCase();
  // Already 2-letter postal?
  const upper = s.toUpperCase();
  if (upper.length === 2 && upper in US_STATES.states) return upper;
  // FIPS like "us-06" or "06"
  const fipsMatch = s.match(/^(?:us-)?(\d{2})$/);
  if (fipsMatch && fipsMatch[1] in US_FIPS_TO_POSTAL) return US_FIPS_TO_POSTAL[fipsMatch[1]];
  // FIPS county like "us-06-037" — take the state portion
  const countyMatch = s.match(/^us-(\d{2})-\d+$/);
  if (countyMatch && countyMatch[1] in US_FIPS_TO_POSTAL) return US_FIPS_TO_POSTAL[countyMatch[1]];
  // Slug name like "california" or "us-california"
  const nameKey = s.replace(/^us-/, "");
  if (nameKey in US_NAME_TO_POSTAL) return US_NAME_TO_POSTAL[nameKey];
  return upper;
}

export function getUsStateTaxRow(stateCode: string): UsStateRow | null {
  const normalized = normalizeUsStateKey(stateCode);
  return US_STATES.states[normalized] || null;
}

export function getUsCitySurcharges(citySlug: string) {
  return US_STATES.city_surcharges[citySlug.toLowerCase()] || [];
}

/** Sub-regional CIT for non-US multi-region countries. Returns null when
 *  iso2 has no sub-regional table or the regionId isn't recognized. */
export type SubregionalRow = {
  name: string;
  capital: string;
  combined_corp_tax?: number;
  corporate_income_tax?: number;
  notes?: string;
};
type SubregionalTable = { regions: Record<string, SubregionalRow> };

const SUBREGIONAL: Record<string, SubregionalTable> = {
  DE: deSubregionalJson as unknown as SubregionalTable,
  CH: chSubregionalJson as unknown as SubregionalTable,
  GB: gbSubregionalJson as unknown as SubregionalTable,
  FR: frSubregionalJson as unknown as SubregionalTable,
  IT: itSubregionalJson as unknown as SubregionalTable,
  ES: esSubregionalJson as unknown as SubregionalTable,
  CA: caSubregionalJson as unknown as SubregionalTable,
  AU: auSubregionalJson as unknown as SubregionalTable,
  BR: brSubregionalJson as unknown as SubregionalTable,
};

export function getSubregionalTaxRow(iso2: string, regionId: string): SubregionalRow | null {
  const table = SUBREGIONAL[iso2.toUpperCase()];
  if (!table) return null;
  const upper = regionId.toUpperCase();
  // 1. Exact match
  if (table.regions[upper]) return table.regions[upper];
  // 2. Try with dash inserted (CHZH → CH-ZH)
  if (upper.length >= 4 && !upper.includes("-")) {
    const dashed = `${upper.slice(0, 2)}-${upper.slice(2)}`;
    if (table.regions[dashed]) return table.regions[dashed];
  }
  // 3. NUTS-2 → NUTS-1 prefix match (DE21 Oberbayern → DE2 Bayern; ITC4
  //    Lombardia stays exact; FR-IDF stays exact)
  for (let len = upper.length - 1; len >= 2; len--) {
    const prefix = upper.slice(0, len);
    if (table.regions[prefix]) return table.regions[prefix];
  }
  return null;
}

/**
 * Combined effective corporate income tax including any sub-regional
 * component. For US, combines federal 21% + state CIT. For DE / CH /
 * etc., returns the sub-regional combined rate directly (those tables
 * already incorporate federal). Falls back to country-level rate.
 */
export function getEffectiveCorporateTaxRate(
  iso2: string,
  regionId?: string | null
): { rate: number; breakdown: string; subregional: boolean } {
  const country = iso2.toUpperCase();
  // US: federal 21% + state CIT
  if (country === "US" && regionId) {
    const us = getUsStateTaxRow(regionId);
    if (us) {
      const combined = 0.21 + us.corporate_income_tax;
      return {
        rate: combined,
        breakdown: `21% federal + ${(us.corporate_income_tax * 100).toFixed(2)}% ${us.name}`,
        subregional: true,
      };
    }
  }
  // Other multi-region countries — use sub-regional combined rate
  if (regionId && SUBREGIONAL[country]) {
    const r = getSubregionalTaxRow(country, regionId);
    if (r) {
      const rate = r.combined_corp_tax ?? r.corporate_income_tax;
      if (rate != null) {
        return {
          rate,
          breakdown: `${(rate * 100).toFixed(2)}% combined (${r.name})`,
          subregional: true,
        };
      }
    }
  }
  // Fallback: country CIT
  const c = getCountryTaxRates(iso2);
  return {
    rate: c.cit,
    breakdown: `${(c.cit * 100).toFixed(2)}% (country rate)`,
    subregional: false,
  };
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
