/**
 * top_industries_aggregation.ts
 *
 * Pure aggregation helpers for getTopIndustriesForCountry's non-US path.
 * Split out of cells.ts so the unit test can import without booting the
 * Supabase client.
 *
 * Country-page rebuild §3 (2026-05-25):
 *   - Pre-filter rows above industry.hi * 3 (countryPagePlausibilityCeiling).
 *   - Group by industry_id and take the MEDIAN of survivors (not MAX).
 *   - Drop industries with fewer than 3 surviving rows (statistical noise).
 *   - Order by a curated SMB-density rank that mirrors how often each
 *     activity actually shows up in small-business populations worldwide
 *     (food / retail / personal services / trades first).
 */

import { CURRENCY_FX_CORRECTIONS } from "../qa/currency_corrections";
import {
  REVENUE_PER_FIRM_BOUNDS,
  DEFAULT_REVENUE_BOUNDS,
} from "../qa/smb_bounds";
import { INDUSTRY_BY_ID, isExcludedFromDiscovery } from "../taxonomy";

export type TopIndustryRow = {
  industry_id: string;
  industry_name: string;
  revenue_per_firm: number | null;
  n_enterprises: number | null;
};

export type ExtrapolatedRow = {
  industry_id: string;
  predicted_rev_per_firm: number | null;
  quality_score?: number | null;
};

/**
 * Curated SMB firm-density rank. Across countries, the same broad
 * categories dominate small-business counts: food service, retail,
 * personal services, trades, then professional services and other.
 * Lower number = denser category = surface first on country pages.
 *
 * Industries not in this table get rank 999 (surfaced last).
 */
/**
 * Industry IDs below match `src/lib/taxonomy/industries.json` exactly.
 * If you add a new industry to the taxonomy, consider adding it here so
 * country pages know where to surface it.
 */
export const SMB_DENSITY_RANK: Record<string, number> = {
  // Food service: typically 8-15% of all SMBs by count
  restaurants: 1,
  sit_down_restaurants: 1,
  fast_casual: 1,
  pizzerias: 2,
  cafes_coffee: 2,
  ice_cream_shops: 3,
  bars_nightclubs: 3,
  pubs_taverns: 3,
  bakeries_retail: 4,
  pastry_dessert: 4,
  food_trucks: 4,
  catering: 4,
  // Personal services: high firm count, low capital intensity
  hairdressers_beauty: 5,
  hair_salons_full: 5,
  barbershops: 6,
  nail_salons: 6,
  brow_lash_studios: 6,
  day_spas: 7,
  med_spas: 7,
  massage_therapy: 7,
  // Retail core
  grocery_stores: 8,
  clothing_stores: 9,
  boutique_clothing: 9,
  designer_fashion: 10,
  independent_pharmacy: 10,
  florist_shops: 11,
  bookstores_indie: 11,
  hardware_stores: 12,
  cosmetics_shops: 12,
  health_beauty_stores: 12,
  furniture_stores: 13,
  home_decor_gift: 13,
  general_merchandise: 14,
  // Auto and transport
  auto_repair_shops: 15,
  auto_body_shops: 15,
  gas_stations: 16,
  // Trades and contractors
  electricians: 17,
  plumbers: 17,
  hvac_services: 18,
  painters_residential: 18,
  carpenters_finish: 18,
  roofers: 19,
  flooring_installers: 19,
  locksmiths: 20,
  // Cleaning and laundry
  cleaning_services: 21,
  residential_cleaning: 21,
  dry_cleaning_laundry: 22,
  landscaping_lawn: 23,
  // Hospitality
  hotels_lodging: 24,
  independent_hotels: 24,
  bnbs: 25,
  guest_houses: 25,
  hostels: 26,
  // Health
  doctors_clinics: 27,
  dental_practices: 28,
  optometry: 29,
  chiropractic: 29,
  physical_therapy: 29,
  // Pets
  pet_stores: 30,
  pet_daycare: 30,
  pet_walking_sitting: 30,
  pet_training: 31,
  // Fitness and recreation
  martial_arts: 32,
  personal_training: 32,
  dance_studios: 32,
  // Education
  daycare_preschool: 33,
  music_schools: 34,
  language_schools: 34,
  driving_schools: 34,
  coding_schools: 35,
  art_classes: 35,
  // Real estate
  real_estate_agencies: 36,
  // Professional services
  accounting_tax: 37,
  sole_accounting: 37,
  insurance_brokers: 38,
  legal_services: 39,
  sole_law_firms: 39,
  management_consulting: 40,
  // Creative and tech
  marketing_design: 41,
  photography_studios: 42,
  it_services_hosting: 43,
  it_services_msp: 43,
  software_development: 44,
  custom_software_contract: 44,
  game_dev_studios: 45,
  // Print + sign
  print_shops: 46,
  sign_shops: 46,
  // Specialty retail
  jewelry_stores: 47,
  custom_jewelers: 47,
  electronics_appliance_stores: 48,
  eyewear_optical: 48,
  shoe_stores: 48,
  music_instrument_shops: 49,
  art_craft_supplies: 49,
  // Services
  event_production: 50,
  funeral_services: 51,
  pest_control_local: 51,
  appliance_repair: 52,
  electronics_repair: 52,
  bike_repair: 52,
  shoe_repair: 53,
  // Construction (lower SMB-page density, higher per-firm revenue)
  residential_construction: 60,
  commercial_construction: 65,
  // Manufacturing trails (lowest SMB density)
  fabricated_metal_mfg: 70,
  primary_metal_mfg: 71,
  machinery_mfg: 72,
  furniture_mfg: 73,
  apparel_mfg: 73,
  food_mfg: 74,
};

/**
 * Country-page plausibility ceiling. Returns industry.hi * 3, the same
 * revenue ceiling the site-wide suppression chokepoint now uses
 * (REVENUE_CATASTROPHIC_MULTIPLIER = 3), so every revenue path agrees:
 * anything above 3x the per-industry bound is treated as a wrong-aggregation
 * row, dropped here before the median and dashed elsewhere on read.
 */
export function countryPagePlausibilityCeiling(industryId: string): number {
  const bounds = REVENUE_PER_FIRM_BOUNDS[industryId] ?? DEFAULT_REVENUE_BOUNDS;
  return bounds.hi * 3;
}

/**
 * Pure aggregation. Takes raw extrapolated_cells rows + country iso2
 * and returns the deduped TopIndustryRow list ordered by SMB-density rank.
 */
export function aggregateExtrapolatedByIndustry(
  rows: ExtrapolatedRow[],
  iso2: string,
  limit = 12,
): TopIndustryRow[] {
  const country = iso2.toUpperCase();
  const fxScale = CURRENCY_FX_CORRECTIONS[country]
    ? 1 / CURRENCY_FX_CORRECTIONS[country]
    : 1;

  // Group by industry, collecting FX-corrected, pre-filtered values.
  // Pre-filter kills rows above 3x the industry's plausible ceiling
  // BEFORE computing the median, so wrong-aggregation tail values
  // cannot skew the result. This is the fix for the "$43M software
  // dev in Albania" class of bugs.
  type Group = { values: number[]; quality: number[] };
  const groups = new Map<string, Group>();
  for (const r of rows) {
    const id = r.industry_id;
    if (!id) continue;
    const rawRev = r.predicted_rev_per_firm ?? 0;
    if (rawRev <= 0) continue;
    const rev = rawRev * fxScale;
    const ceiling = countryPagePlausibilityCeiling(id);
    if (rev > ceiling) continue;
    if (!groups.has(id)) groups.set(id, { values: [], quality: [] });
    const g = groups.get(id)!;
    g.values.push(rev);
    g.quality.push(r.quality_score ?? 40);
  }

  type ScoredRow = TopIndustryRow & { _rank: number; _quality: number };
  const scored: ScoredRow[] = [];
  for (const [id, g] of groups.entries()) {
    // Statistical-noise floor: a single point estimate is not a benchmark.
    if (g.values.length < 3) continue;
    const ind = INDUSTRY_BY_ID[id];
    if (!ind) continue;
    if (isExcludedFromDiscovery(ind)) continue;
    const audience = ind.audience || "smb_friendly";
    if (audience !== "smb_core" && audience !== "smb_friendly") continue;
    const sorted = [...g.values].sort((a, b) => a - b);
    const med = sorted[Math.floor(sorted.length / 2)];
    const avgQuality =
      g.quality.reduce((acc, q) => acc + q, 0) / g.quality.length;
    scored.push({
      industry_id: id,
      industry_name: ind.name,
      revenue_per_firm: med,
      n_enterprises: null,
      _rank: SMB_DENSITY_RANK[id] ?? 999,
      _quality: avgQuality,
    });
  }

  // Order: curated SMB-density rank asc, then quality desc, then name asc.
  scored.sort((a, b) => {
    if (a._rank !== b._rank) return a._rank - b._rank;
    if (a._quality !== b._quality) return b._quality - a._quality;
    return a.industry_name.localeCompare(b.industry_name);
  });

  return scored.slice(0, limit).map((r) => ({
    industry_id: r.industry_id,
    industry_name: r.industry_name,
    revenue_per_firm: r.revenue_per_firm,
    n_enterprises: r.n_enterprises,
  }));
}
