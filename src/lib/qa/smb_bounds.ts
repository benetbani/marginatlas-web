/**
 * Plan v24 Block 1.1.b — SMB-physical bounds per field.
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
  legal_services: { lo: 100_000, hi: 30_000_000, reason: "Solo-to-mid; $200K-$15M" },
  management_consulting: { lo: 80_000, hi: 30_000_000, reason: "Solo-to-mid; $200K-$15M" },
  accounting_bookkeeping: { lo: 50_000, hi: 10_000_000, reason: "Solo-to-mid; $100K-$5M" },
  // Tech
  software_development: { lo: 80_000, hi: 50_000_000, reason: "Wider tail; SF/Silicon Valley pushes high" },
  custom_software_contract: { lo: 80_000, hi: 30_000_000, reason: "Solo-to-mid shops" },
  web_mobile_dev_shops: { lo: 60_000, hi: 15_000_000, reason: "Most under $5M" },
  // Trades + construction
  residential_construction: { lo: 100_000, hi: 30_000_000, reason: "Solo contractor to mid-sized firm; $200K-$15M typical. Anything above $30M is wrong-scale." },
  auto_repair_shops: { lo: 80_000, hi: 5_000_000, reason: "Independent shop $200K-$2M" },
  // Manufacturing (SMB tier — large firms hidden behind Pro gate)
  fabricated_metal_mfg: { lo: 200_000, hi: 50_000_000, reason: "Wider; Mittelstand pushes higher" },
  primary_metal_mfg: { lo: 500_000, hi: 50_000_000, reason: "Higher capital intensity" },
  machinery_mfg: { lo: 300_000, hi: 50_000_000, reason: "Wider; Mittelstand precision shops" },
  // Health
  doctors_clinics: { lo: 100_000, hi: 10_000_000, reason: "Solo practice to small group; $200K-$5M" },
  dental_practices: { lo: 100_000, hi: 5_000_000, reason: "Solo dentist to multi-doc; $300K-$3M" },
  // Real estate
  real_estate_agencies: { lo: 50_000, hi: 10_000_000, reason: "Solo agent to mid agency; $100K-$5M" },
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
  auto_dealers: { lo: 300_000, hi: 50_000_000, reason: "Auto dealers $1M-$30M per firm; capital-intensive inventory" },
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
};

export const DEFAULT_REVENUE_BOUNDS: SmbBounds = {
  lo: 5_000,
  hi: 50_000_000,
  reason: "Default SMB range: $5K-$50M per firm",
};

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
