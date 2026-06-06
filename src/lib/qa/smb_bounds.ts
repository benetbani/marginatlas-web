/**
 * SMB-physical bounds per field.
 *
 * Reference table for the scale-sanity scanner. Any cell value outside
 * these ranges is FLAGGED as logically inconsistent (not silently
 * suppressed; flagged for triage). The bounds are deliberately
 * conservative: they catch obvious data-corruption cases (aggregate
 * revenue posing as per-firm, wrong currency scale, etc.) without
 * flagging legitimate edge cases.
 *
 * Tiers explain WHY a bound exists, not just what it is.
 */

export type SmbBounds = {
  /** Lower bound (inclusive). Values below trigger a "too-low" flag. */
  lo: number;
  /** Upper bound (inclusive). Values above trigger a "too-high" flag. */
  hi: number;
  /** Why this range — for debugging when a value gets flagged. */
  reason: string;
};

/**
 * Per-industry revenue-per-firm bounds. Conservative SMB-physical ranges.
 * Values outside these are usually data-corruption (aggregate vs per-firm,
 * wrong-scale, wrong-currency).
 *
 * Default for unmapped industries: [$5K, $50M].
 */
export const REVENUE_PER_FIRM_BOUNDS: Record<string, SmbBounds> = {
  // Food & drink — high firm density, modest revenue per firm
  restaurants: { lo: 30_000, hi: 5_000_000, reason: "Restaurants typically $50K-$3M per firm" },
  cafes_coffee_shops: { lo: 30_000, hi: 3_000_000, reason: "Cafes typically $100K-$1.5M" },
  bakeries_pastries: { lo: 40_000, hi: 3_000_000, reason: "Bakeries typically $150K-$1.2M" },
  bars_pubs_clubs: { lo: 50_000, hi: 5_000_000, reason: "Bars typically $200K-$2M" },
  // Retail — wide range
  grocery_stores: { lo: 50_000, hi: 10_000_000, reason: "Grocery typically $300K-$5M" },
  clothing_stores: { lo: 40_000, hi: 5_000_000, reason: "Clothing typically $150K-$2M" },
  jewelry_stores: { lo: 80_000, hi: 8_000_000, reason: "Jewelry typically $200K-$3M; outliers higher" },
  // Beauty + personal services
  hairdressers_beauty: { lo: 20_000, hi: 1_000_000, reason: "Single-chair to multi-stylist; $50K-$500K" },
  hair_salons: { lo: 20_000, hi: 1_000_000, reason: "Same as above" },
  barbershops: { lo: 15_000, hi: 800_000, reason: "Barbershops $40K-$400K" },
  nail_salons: { lo: 20_000, hi: 800_000, reason: "Nail salons $50K-$400K" },
  // Hospitality
  hotels_lodging: { lo: 80_000, hi: 25_000_000, reason: "Boutique to mid-size; $200K-$15M" },
  // Professional services
  legal_services: { lo: 100_000, hi: 5_000_000, reason: "Solo-to-mid law firm $200K-$3M per firm; above $5M is wrong-scale (aggregate sector or a national mega-firm, not an SMB benchmark)" },
  management_consulting: { lo: 80_000, hi: 4_000_000, reason: "Solo-to-small advisory $150K-$2M per firm; above $4M is wrong-scale (Big-Four-style aggregate, not an SMB benchmark)" },
  accounting_bookkeeping: { lo: 50_000, hi: 10_000_000, reason: "Solo-to-mid; $100K-$5M" },
  // Tech
  software_development: { lo: 80_000, hi: 8_000_000, reason: "Solo-to-small studio $150K-$4M per firm; above $8M is wrong-scale (a scaled product company, not the SMB benchmark)" },
  custom_software_contract: { lo: 80_000, hi: 30_000_000, reason: "Solo-to-mid shops" },
  web_mobile_dev_shops: { lo: 60_000, hi: 15_000_000, reason: "Most under $5M" },
  it_services_hosting: { lo: 60_000, hi: 6_000_000, reason: "IT services & hosting shop $150K-$3M per firm; above $6M is wrong-scale" },
  // Trades + construction
  residential_construction: { lo: 100_000, hi: 20_000_000, reason: "Solo contractor to mid-sized firm $200K-$12M typical; above $20M is wrong-scale" },
  civil_engineering: { lo: 150_000, hi: 15_000_000, reason: "Civil engineering firm $300K-$8M per firm; above $15M is a major contractor, not an SMB benchmark" },
  specialty_trades: { lo: 60_000, hi: 8_000_000, reason: "Specialty-trade contractor $150K-$4M per firm; above $8M is wrong-scale" },
  auto_repair_shops: { lo: 80_000, hi: 5_000_000, reason: "Independent shop $200K-$2M" },
  // Manufacturing (SMB tier — large firms hidden behind Pro gate)
  fabricated_metal_mfg: { lo: 200_000, hi: 25_000_000, reason: "Fabricated-metal shop $400K-$12M per firm; above $25M is a large plant, not the SMB benchmark" },
  primary_metal_mfg: { lo: 500_000, hi: 50_000_000, reason: "Higher capital intensity" },
  machinery_mfg: { lo: 300_000, hi: 25_000_000, reason: "Machinery shop $600K-$12M per firm; above $25M is a large plant, not the SMB benchmark" },
  chemical_pharma_mfg: { lo: 300_000, hi: 30_000_000, reason: "Chemical/pharma SMB plant $600K-$15M per firm; above $30M is wrong-scale" },
  plastics_rubber_mfg: { lo: 200_000, hi: 25_000_000, reason: "Plastics/rubber products plant $400K-$12M per firm; above $25M is wrong-scale" },
  motor_vehicles_mfg: { lo: 300_000, hi: 30_000_000, reason: "Vehicle/parts SMB supplier $600K-$15M per firm; above $30M is a tier-1 OEM, not an SMB benchmark" },
  food_mfg: { lo: 150_000, hi: 25_000_000, reason: "Food manufacturer $400K-$12M per firm; above $25M is wrong-scale" },
  electrical_equipment_mfg: { lo: 200_000, hi: 25_000_000, reason: "Electrical-equipment plant $400K-$12M per firm; above $25M is wrong-scale" },
  electronics_mfg: { lo: 200_000, hi: 25_000_000, reason: "Electronics/semiconductor SMB plant $400K-$12M per firm; above $25M is wrong-scale" },
  other_transport_mfg: { lo: 300_000, hi: 25_000_000, reason: "Aerospace/other transport SMB plant $600K-$12M per firm; above $25M is wrong-scale" },
  wood_products_mfg: { lo: 150_000, hi: 20_000_000, reason: "Wood-products plant $300K-$10M per firm; above $20M is wrong-scale" },
  furniture_mfg: { lo: 150_000, hi: 20_000_000, reason: "Furniture manufacturer $300K-$10M per firm; above $20M is wrong-scale" },
  textiles_fabric_mfg: { lo: 150_000, hi: 20_000_000, reason: "Textiles/fabric manufacturer $300K-$10M per firm; above $20M is wrong-scale" },
  // Health
  doctors_clinics: { lo: 100_000, hi: 10_000_000, reason: "Solo practice to small group; $200K-$5M" },
  dental_practices: { lo: 100_000, hi: 5_000_000, reason: "Solo dentist to multi-doc; $300K-$3M" },
  // Real estate
  real_estate_agencies: { lo: 50_000, hi: 6_000_000, reason: "Solo agent to small agency $100K-$3M per firm; above $6M is a brokerage chain, not an SMB benchmark" },
  // Pet services
  veterinary_pet_care: { lo: 80_000, hi: 5_000_000, reason: "Solo vet to multi-vet practice" },
  pet_services: { lo: 30_000, hi: 2_000_000, reason: "Grooming + boarding small firms" },
  // Fitness
  fitness_gyms: { lo: 50_000, hi: 8_000_000, reason: "Boutique studio to mid-sized gym" },
  sports_fitness: { lo: 50_000, hi: 8_000_000, reason: "Same range" },

  // v34 sanity sweep section 6: bounds extended to cover the highest
  // traffic industries that were rendering implausible numbers (cleaning
  // services at $37M, auto dealers with bad ranges). All bounds reflect
  // SMB-physical per-firm revenue, NOT aggregate sector revenue.

  // Cleaning + facilities
  cleaning_services: { lo: 20_000, hi: 1_500_000, reason: "Cleaning services typically $50K-$800K per firm. Aggregate sector at the country level can be billions; that does NOT belong on a per-firm chart." },
  janitorial_services: { lo: 30_000, hi: 2_000_000, reason: "Janitorial $80K-$1M per firm" },
  landscaping_lawn: { lo: 30_000, hi: 2_000_000, reason: "Landscaping $80K-$1M per firm" },
  pest_control: { lo: 50_000, hi: 3_000_000, reason: "Pest control $150K-$1.5M per firm" },

  // Auto + transport
  auto_dealers: { lo: 300_000, hi: 30_000_000, reason: "Auto dealers $1M-$20M per firm; capital-intensive inventory. Above $30M is aggregate-vs-per-firm, not a dealership benchmark" },
  // Data-side override: non-US cells store this legacy id (crosswalks to
  // auto_dealers). Keyed here too so the ceiling fires on paths that pass the
  // raw id through without crosswalking.
  auto_dealers_gas: { lo: 300_000, hi: 30_000_000, reason: "Auto dealers (legacy data id), same bound as auto_dealers" },
  gas_stations: { lo: 150_000, hi: 10_000_000, reason: "Gas stations $500K-$5M per firm" },
  auto_parts_retail: { lo: 80_000, hi: 5_000_000, reason: "Auto parts $200K-$2M" },
  taxi_rideshare_local: { lo: 30_000, hi: 1_500_000, reason: "Independent operator small fleet" },

  // Hospitality + tourism
  bed_breakfast_lodging: { lo: 30_000, hi: 2_000_000, reason: "B&B $80K-$800K per firm" },
  travel_agencies: { lo: 40_000, hi: 5_000_000, reason: "Travel agencies $100K-$2M" },
  event_planning: { lo: 30_000, hi: 3_000_000, reason: "Event planners $80K-$1.5M" },

  // Retail (broader)
  bookstores: { lo: 30_000, hi: 2_000_000, reason: "Bookstores $80K-$1M" },
  hardware_stores: { lo: 80_000, hi: 8_000_000, reason: "Hardware $200K-$4M" },
  florists: { lo: 30_000, hi: 1_500_000, reason: "Florists $80K-$800K" },
  pharmacies_drug_stores: { lo: 200_000, hi: 15_000_000, reason: "Pharmacies $500K-$8M; prescription drug volume drives the high end" },

  // Education + childcare
  childcare_daycare: { lo: 30_000, hi: 2_500_000, reason: "Daycare $80K-$1M per firm" },
  tutoring_education: { lo: 20_000, hi: 1_500_000, reason: "Tutoring/test prep $50K-$800K" },
  language_schools: { lo: 50_000, hi: 5_000_000, reason: "Language schools $150K-$2M" },

  // Other high-traffic
  insurance_brokers: { lo: 50_000, hi: 10_000_000, reason: "Insurance brokers $150K-$5M (commission-driven)" },
  it_services_consulting: { lo: 60_000, hi: 15_000_000, reason: "IT consulting $150K-$5M" },
  marketing_agencies: { lo: 50_000, hi: 15_000_000, reason: "Marketing agencies $100K-$5M" },
  graphic_design: { lo: 30_000, hi: 3_000_000, reason: "Graphic design $80K-$1.5M" },
  photography_studios: { lo: 20_000, hi: 1_500_000, reason: "Photography $50K-$800K" },
  printing_services: { lo: 80_000, hi: 8_000_000, reason: "Printing $200K-$3M" },
  electricians: { lo: 50_000, hi: 5_000_000, reason: "Electricians $100K-$2M" },
  plumbers: { lo: 50_000, hi: 5_000_000, reason: "Plumbers $100K-$2M" },
  hvac_contractors: { lo: 80_000, hi: 8_000_000, reason: "HVAC $200K-$3M" },
  roofing_contractors: { lo: 80_000, hi: 5_000_000, reason: "Roofing $200K-$2M" },
  painting_contractors: { lo: 40_000, hi: 3_000_000, reason: "Painting $80K-$1.5M" },
  carpentry_contractors: { lo: 40_000, hi: 3_000_000, reason: "Carpentry $80K-$1.5M" },
  car_washes: { lo: 50_000, hi: 3_000_000, reason: "Car washes $150K-$1.5M" },
  laundromats: { lo: 30_000, hi: 1_500_000, reason: "Laundromats $80K-$800K" },
  dry_cleaning: { lo: 30_000, hi: 2_000_000, reason: "Dry cleaning $80K-$1M" },

  // No-wrong-numbers ceiling tightening (founder-approved). These industries
  // were clamping junk to the $50M/$30M DEFAULT because the bound was missing
  // or too loose. Bounds key on the TAXONOMY id (the id Part 1's crosswalk
  // resolves a legacy cell to); legacy data ids get an explicit override below
  // so the ceiling also fires on read paths that pass the raw id through.

  // Wholesale + logistics
  wholesale_food: { lo: 150_000, hi: 30_000_000, reason: "Food/beverage wholesaler $400K-$15M per firm; above $30M is wrong-scale" },
  warehousing_storage: { lo: 100_000, hi: 15_000_000, reason: "Warehousing & storage operator $300K-$8M per firm; above $15M is wrong-scale" },
  postal_service: { lo: 80_000, hi: 12_000_000, reason: "Postal/courier SMB $200K-$6M per firm; above $12M is a national carrier, not an SMB benchmark" },
  trucking_freight: { lo: 80_000, hi: 15_000_000, reason: "Trucking/freight carrier $200K-$8M per firm; above $15M is a large fleet, not the SMB benchmark" },

  // Real estate leasing
  real_estate_leasing: { lo: 50_000, hi: 20_000_000, reason: "Property leasing/landlord $150K-$10M per firm; above $20M is an institutional portfolio, not an SMB benchmark" },

  // Resources
  mining_quarrying: { lo: 200_000, hi: 30_000_000, reason: "Quarry/small-mine operator $500K-$15M per firm; above $30M is a major miner, not an SMB benchmark" },

  // Business services
  office_support: { lo: 40_000, hi: 4_000_000, reason: "Office & business support $100K-$2M per firm; above $4M is wrong-scale" },
  employment_services: { lo: 60_000, hi: 8_000_000, reason: "Staffing/employment agency $150K-$4M per firm; above $8M is a national staffing chain, not the SMB benchmark" },
  security_services: { lo: 50_000, hi: 6_000_000, reason: "Security-services firm $120K-$3M per firm; above $6M is wrong-scale" },
  engineering_architecture: { lo: 80_000, hi: 6_000_000, reason: "Engineering/architecture practice $150K-$3M per firm; above $6M is a large multidisciplinary firm, not the SMB benchmark" },
  marketing_design: { lo: 40_000, hi: 4_000_000, reason: "Marketing/design agency $100K-$2M per firm; above $4M is wrong-scale" },

  // Media
  news_periodical_publishing: { lo: 50_000, hi: 8_000_000, reason: "News/periodical publisher $120K-$4M per firm; above $8M is a media group, not the SMB benchmark" },

  // Legacy data-side overrides.
  // Non-US cells store these coarse legacy industry_ids (see
  // LEGACY_DB_TO_TAXONOMY). Part 1's crosswalk resolves them to the taxonomy
  // id above, but read paths that pass the raw id through unchanged also need
  // the ceiling, so each legacy id is keyed to the SAME bound as its taxonomy
  // equivalent.
  metal_products_mfg: { lo: 200_000, hi: 25_000_000, reason: "Fabricated-metal (legacy data id), same bound as fabricated_metal_mfg" },
  food_beverage_mfg: { lo: 150_000, hi: 25_000_000, reason: "Food manufacturing (legacy data id), same bound as food_mfg" },
  wood_paper_mfg: { lo: 150_000, hi: 20_000_000, reason: "Wood products (legacy data id), same bound as wood_products_mfg" },
  furniture_other_mfg: { lo: 150_000, hi: 20_000_000, reason: "Furniture (legacy data id), same bound as furniture_mfg" },
  textile_apparel_mfg: { lo: 150_000, hi: 20_000_000, reason: "Textiles/fabric (legacy data id), same bound as textiles_fabric_mfg" },
  property_leasing: { lo: 50_000, hi: 20_000_000, reason: "Property leasing (legacy data id), same bound as real_estate_leasing" },
  postal_courier: { lo: 80_000, hi: 12_000_000, reason: "Postal/courier (legacy data id), same bound as postal_service" },
  media_publishing: { lo: 50_000, hi: 8_000_000, reason: "News/periodical publishing (legacy data id), same bound as news_periodical_publishing" },
};

export const DEFAULT_REVENUE_BOUNDS: SmbBounds = {
  lo: 5_000,
  hi: 50_000_000,
  reason: "Default SMB range: $5K-$50M per firm",
};

/**
 * Brain-skeleton informal-share adjustment.
 *
 * In countries where a large share of the economy is informal (Bolivia
 * 60%+, Nigeria 50%+, etc.), the per-firm revenue measured in formal
 * statistics is systematically biased LOW: the smallest, cash-only,
 * unregistered firms never show up. Widening the lower bound for
 * those countries prevents us from suppressing a legitimately tiny
 * formal-sector firm as "implausible".
 *
 * Multiplier formula: 1 + (informalPct / 100). A country at 40%
 * informal gets a 1.4x downward widening on its lower bound.
 *
 * Source: data/external/brain-skeleton/informal_share.csv (latest year
 * per country). Read via getBrainInformalShareByIso2().
 */
export function widenBoundsForInformality(
  bounds: SmbBounds,
  informalPct: number | null,
): SmbBounds {
  if (informalPct == null || informalPct <= 10) return bounds;
  const widen = 1 + informalPct / 100;
  return {
    lo: bounds.lo / widen,
    hi: bounds.hi,
    reason: `${bounds.reason} (lower bound widened ${widen.toFixed(2)}x for ${informalPct.toFixed(0)}% informal economy)`,
  };
}

/**
 * Payroll per employee — annual USD. Should reflect realistic wages
 * across the income spectrum. Bounded by the lowest-wage developing
 * economies (~$3K/year) and the highest-wage roles (~$200K/year for
 * professional services partners).
 */
export const PAYROLL_BOUNDS: SmbBounds = {
  lo: 3_000,
  hi: 200_000,
  reason: "Wage per employee: $3K (LIC) to $200K (HIC senior pro)",
};

/**
 * Employees per firm (avg). Bounded by sole-trader (1) and large SMB
 * (a few hundred). Above 500 means we're looking at a corporation,
 * not an SMB benchmark.
 */
export const EMPLOYEES_PER_FIRM_BOUNDS: SmbBounds = {
  lo: 0.5,
  hi: 500,
  reason: "Employees-per-firm: 1 (sole trader) to ~500 (large SMB)",
};

/**
 * Sanity check: classify a value against a bound.
 */
export type SanityVerdict =
  | "ok"
  | "too-low"
  | "too-high"
  | "missing";

export function classifyValue(value: number | null | undefined, bounds: SmbBounds): SanityVerdict {
  if (value == null || !isFinite(value) || isNaN(value)) return "missing";
  if (value < bounds.lo) return "too-low";
  if (value > bounds.hi) return "too-high";
  return "ok";
}

/**
 * Severity score for a flagged value. log10(ratio-from-bound) clamped to
 * [0, 4]. Higher = more confidently wrong.
 */
export function severity(value: number, bounds: SmbBounds): number {
  if (value > bounds.hi) {
    return Math.min(4, Math.log10(value / bounds.hi));
  }
  if (value < bounds.lo) {
    return Math.min(4, Math.log10(bounds.lo / value));
  }
  return 0;
}
