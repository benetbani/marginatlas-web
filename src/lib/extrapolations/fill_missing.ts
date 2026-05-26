/**
 * Plan v19 Block B — fill blank tiles with extrapolations when the source
 * data is null.
 *
 * Founder rule: every benchmark page must show real numbers in >=70% of
 * its tiles. Blank tiles are a "catastrophe". Where source data is
 * missing, we fill from these reference tables. If the extrapolation
 * still can't produce a number, the tile is suppressed by the renderer.
 *
 * These tables are deliberately conservative. The point isn't precision
 * — it's never showing a blank tile.
 *
 * 2026-05-26 (goldmines Wave 1): the COUNTRY_MEDIAN_WAGE_USD table is
 * now a FALLBACK only. The primary wage source is
 * src/lib/economic_profile/wages.ts, which reads
 * data/economics/median_monthly_wage_usd_v1.json. This module preserves
 * the hardcoded values for countries the JSON does not yet cover, and
 * the verify_wage_source_consistency prebuild gate enforces no drift
 * between the two sources for countries present in both.
 */
import { getMedianAnnualWageUsd } from "@/lib/economic_profile/wages";

/**
 * Country median annual wage in USD — DELETED 2026-05-26 (goldmines
 * Wave 1). The legacy hardcoded table that lived here drifted 5-33%
 * from the post-May-2026 source-of-truth file
 * (data/economics/median_monthly_wage_usd_v1.json) because the May
 * wage overhaul (task #129) produced new values but the hardcoded
 * table was never updated. The data fidelity audit
 * (docs/strategy/2026-05-26-data-fidelity-audit.md) flagged the
 * drift; this is the closing edit.
 *
 * The JSON source covers 200 countries (vs the legacy's 83) and ALL
 * 83 legacy entries were duplicates of JSON entries with drift. No
 * country lost coverage by deleting the legacy table.
 *
 * All callers must use getMedianAnnualWageUsd() from
 * src/lib/economic_profile/wages.ts.
 */
// (legacy COUNTRY_MEDIAN_WAGE_USD removed; see comment above)

/**
 * Industry typical headcount per firm (global average from regional cells
 * where employees + enterprises are both populated). When a cell has
 * `n_enterprises` but no `n_employees`, we estimate total headcount as
 * `n_enterprises × typical_per_firm[industry_id]`.
 */
export const INDUSTRY_EMPLOYEES_PER_FIRM: Record<string, number> = {
  restaurants: 9,
  cafes_coffee_shops: 6,
  bakeries_pastries: 5,
  bars_pubs_clubs: 8,
  hotels_lodging: 22,
  grocery_stores: 7,
  clothing_stores: 5,
  jewelry_stores: 3,
  apparel_mfg: 35,
  custom_apparel_mfg: 8,
  textile_apparel_mfg: 30,
  custom_jewelers: 4,
  hairdressers_beauty: 3,
  hair_salons: 3,
  nail_salons: 3,
  barbershops: 2,
  fitness_gyms: 8,
  sports_fitness: 7,
  legal_services: 6,
  management_consulting: 9,
  accounting_bookkeeping: 5,
  software_development: 14,
  custom_software_contract: 11,
  web_mobile_dev_shops: 7,
  real_estate_agencies: 4,
  residential_construction: 7,
  fabricated_metal_mfg: 32,
  primary_metal_mfg: 60,
  machinery_mfg: 45,
  auto_repair_shops: 5,
  motor_vehicles_mfg: 220,
  doctors_clinics: 8,
  dental_practices: 5,
  veterinary_pet_care: 6,
  pet_services: 4,
  cleaning_services: 6,
  freight_trucking: 12,
  food_mfg: 40,
  beverage_mfg: 35,
  craft_beer_mfg: 12,
  print_publishing: 10,
  photography_studios: 3,
  music_recording: 5,
  furniture_home_stores: 7,
  health_beauty_stores: 6,
  pharmacies: 8,
  chemical_pharma_mfg: 75,
  education_instruction: 10,
  transit_ground_passenger: 25,
  scenic_sightseeing_transport: 6,
  florists: 3,
  vegetable_fruit_farming: 5,
  grain_farming: 4,
  livestock_farming: 6,
  forestry_logging: 9,
  fishing_aquaculture: 6,
  hospitals: 250,
  events_planning: 5,
};

/**
 * Industry-specific wage multiplier vs the country median.
 * 1.0 = matches country median. >1 = above-median. <1 = below.
 */
export const INDUSTRY_WAGE_MULTIPLIER: Record<string, number> = {
  legal_services: 1.6,
  management_consulting: 1.5,
  software_development: 1.7,
  custom_software_contract: 1.5,
  web_mobile_dev_shops: 1.3,
  accounting_bookkeeping: 1.2,
  doctors_clinics: 1.8,
  dental_practices: 1.6,
  hospitals: 1.3,
  fabricated_metal_mfg: 1.1,
  primary_metal_mfg: 1.2,
  machinery_mfg: 1.2,
  chemical_pharma_mfg: 1.4,
  motor_vehicles_mfg: 1.3,
  // SMB defaults around 0.7-1.0
  restaurants: 0.55,
  cafes_coffee_shops: 0.5,
  bakeries_pastries: 0.55,
  bars_pubs_clubs: 0.6,
  grocery_stores: 0.6,
  clothing_stores: 0.65,
  jewelry_stores: 0.75,
  hairdressers_beauty: 0.6,
  hair_salons: 0.6,
  nail_salons: 0.55,
  barbershops: 0.55,
  fitness_gyms: 0.7,
  hotels_lodging: 0.7,
  real_estate_agencies: 0.9,
  auto_repair_shops: 0.85,
  residential_construction: 0.95,
  cleaning_services: 0.55,
  pet_services: 0.6,
  pharmacies: 1.1,
  florists: 0.6,
  freight_trucking: 0.95,
  // farming defaults below median
  vegetable_fruit_farming: 0.55,
  grain_farming: 0.6,
  livestock_farming: 0.6,
  forestry_logging: 0.75,
  fishing_aquaculture: 0.7,
};

/**
 * Best-effort wage estimate when cell.payroll_per_employee is null.
 * Returns null if neither country nor industry signal exists.
 *
 * Updated 2026-05-26 (goldmines Wave 1): now prefers the new
 * source-of-truth file (data/economics/median_monthly_wage_usd_v1.json)
 * over the legacy hardcoded COUNTRY_MEDIAN_WAGE_USD table. The
 * legacy table is retained as a fallback for countries not yet in
 * the JSON file. The verify_wage_source_consistency prebuild gate
 * enforces no drift between the two sources.
 *
 * Drift fix: this closes the 5-33% wage drift identified in the
 * 2026-05-26 data fidelity audit
 * (docs/strategy/2026-05-26-data-fidelity-audit.md).
 */
export function estimateWagePerEmployee(
  iso2: string | null | undefined,
  industryId: string | null | undefined,
): number | null {
  if (!iso2) return null;
  const iso = iso2.toUpperCase();
  // Source-of-truth: data/economics/median_monthly_wage_usd_v1.json.
  // The legacy hardcoded fallback table was deleted in goldmines
  // Wave 1; the JSON covers strictly more countries.
  const country = getMedianAnnualWageUsd(iso);
  if (country == null) return null;
  const mult = (industryId && INDUSTRY_WAGE_MULTIPLIER[industryId]) || 0.8;
  return Math.round(country * mult);
}

/**
 * Best-effort headcount estimate when cell.n_employees is null but
 * cell.n_enterprises is populated.
 */
export function estimateEmployeesFromFirms(
  industryId: string | null | undefined,
  nEnterprises: number | null | undefined,
): number | null {
  if (!nEnterprises || nEnterprises <= 0) return null;
  if (!industryId) return null;
  const perFirm = INDUSTRY_EMPLOYEES_PER_FIRM[industryId];
  if (!perFirm) return null;
  return Math.round(nEnterprises * perFirm);
}
