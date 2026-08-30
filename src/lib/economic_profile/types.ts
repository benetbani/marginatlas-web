/**
 * Country Economic Profile (CEP) schema.
 *
 * Single source of truth for what a country's cost structure looks
 * like. Supersedes the old country_smb_baseline.json + country_factors_v1.json
 * pair. Every field is INTERNAL — never named in user-visible copy (R-002).
 */

/** Per-field quality flag — drives the page confidence score. */
export type FieldQuality = "A" | "B" | "C" | "D";

export type CountryEconomicProfile = {
  // ===== Identity =====
  iso2: string;
  iso3: string;
  name: string;
  continent: "NA" | "SA" | "EU" | "Asia" | "Oceania" | "Africa" | "MENA";
  world_bank_region: string;
  currency: string;
  tier: "A" | "B" | "C"; // research depth tier (NOT a quality score for users)

  // ===== GDP & development =====
  gdp_per_capita_usd_nominal: number;
  gdp_per_capita_usd_ppp: number;
  gdp_per_capita_growth_5y_pct: number;
  productivity_index: number; // global median = 1.0

  // ===== Labor cost structure =====
  median_wage_full_time_usd: number;
  /* The quartile pair is NOT measured: recompute_wages_from_median.ts writes it
     as median x 0.65 and median x 1.55, one fixed multiplier for all 197
     countries. It survives only because the cost engine's wage blend reads it.
     It must never reach a reader, and notation N9 bans the words that would
     describe it. */
  wage_p25_usd: number;
  wage_p75_usd: number;
  /* The decile pair IS measured, per country, from a published earnings
     distribution: data/economics/wage_deciles_v1.json holds the research and
     apply_wage_deciles.ts pushes it here. Optional because a country only
     carries deciles once a real source has been read for it; the country page
     draws its spread from these two and shows the typical alone without them. */
  wage_p10_usd?: number;
  wage_p90_usd?: number;
  minimum_wage_annual_usd: number;
  employer_social_pct: number;
  payroll_tax_other_pct: number;
  health_insurance_employer_pct: number;
  fully_loaded_labor_multiplier: number; // 1 + (all employer-side adds)

  // ===== Tax regime =====
  vat_gst_standard_pct: number;
  vat_gst_reduced_pct: number | null;
  corporate_income_tax_combined_pct: number;
  effective_corporate_tax_pct: number;
  dividend_withholding_pct: number;
  personal_income_tax_marginal_50k_pct: number;

  // ===== Real estate / occupancy =====
  commercial_rent_t1_usd_per_sqm_year: number;
  commercial_rent_t2_usd_per_sqm_year: number;
  commercial_rent_t3_usd_per_sqm_year: number;
  property_tax_rate_pct: number;

  // ===== Energy & inputs =====
  electricity_usd_per_kwh_commercial: number;
  natural_gas_usd_per_therm: number;
  diesel_usd_per_liter: number;

  // ===== Capital & finance =====
  bank_lending_rate_pct: number;
  inflation_5y_avg_pct: number;
  exchange_rate_volatility_pct: number;

  // ===== Institutional quality =====
  corruption_perception_index: number;
  ease_of_doing_business_index: number;
  informal_economy_share_pct: number;

  // ===== Trade / openness =====
  imports_pct_of_gdp: number;
  trade_openness_pct: number;

  // ===== Demography / urbanization =====
  urbanization_pct: number;
  median_age: number;
  labor_force_participation_pct: number;

  // ===== Per-field quality (drives page confidence) =====
  quality_flags?: Partial<Record<keyof Omit<CountryEconomicProfile, "iso2" | "iso3" | "name" | "continent" | "world_bank_region" | "currency" | "tier" | "quality_flags">, FieldQuality>>;
};

export type CountryProfileFile = {
  version: string;
  anchor: string;
  convention: string;
  default_fallback: CountryEconomicProfile;
  countries: Record<string, CountryEconomicProfile>; // keyed by ISO-2 uppercase
};
