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
 */

/**
 * Country median annual wage in USD (full-time employed). Sourced from
 * OECD / ILO labor statistics, rounded. Used as the wage-per-employee
 * fallback when source data has no payroll figure.
 */
export const COUNTRY_MEDIAN_WAGE_USD: Record<string, number> = {
  US: 56000,
  GB: 42000,
  DE: 50000,
  FR: 45000,
  IT: 36000,
  ES: 32000,
  PT: 24000,
  IE: 51000,
  NL: 53000,
  BE: 50000,
  LU: 70000,
  AT: 48000,
  CH: 75000,
  SE: 51000,
  NO: 65000,
  DK: 60000,
  FI: 46000,
  IS: 60000,
  GR: 22000,
  CZ: 30000,
  SK: 26000,
  SI: 28000,
  EE: 27000,
  LV: 22000,
  LT: 21000,
  PL: 22000,
  HU: 18000,
  HR: 19000,
  RO: 17000,
  BG: 13000,
  CY: 27000,
  MT: 26000,
  JP: 38000,
  KR: 41000,
  TW: 32000,
  SG: 58000,
  HK: 52000,
  AU: 56000,
  NZ: 45000,
  CA: 48000,
  MX: 11000,
  BR: 10000,
  AR: 8500,
  CL: 14000,
  CO: 6500,
  PE: 7500,
  UY: 13000,
  EC: 6000,
  PY: 5500,
  IN: 4500,
  CN: 14000,
  ID: 4500,
  TH: 8000,
  VN: 4000,
  PH: 4500,
  MY: 9500,
  TR: 11000,
  IL: 38000,
  AE: 35000,
  SA: 22000,
  QA: 32000,
  KW: 30000,
  BH: 22000,
  OM: 18000,
  EG: 4500,
  ZA: 14000,
  NG: 3500,
  KE: 3000,
  GH: 2500,
  MA: 7000,
  TN: 5000,
  RU: 11000,
  UA: 5500,
  BY: 6500,
  KZ: 8500,
  GE: 5500,
  AM: 4500,
  AZ: 5500,
  RS: 9000,
  BA: 7500,
  ME: 9500,
  MK: 7000,
  AL: 6500,
};

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
 */
export function estimateWagePerEmployee(
  iso2: string | null | undefined,
  industryId: string | null | undefined,
): number | null {
  if (!iso2) return null;
  const country = COUNTRY_MEDIAN_WAGE_USD[iso2.toUpperCase()];
  if (!country) return null;
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
