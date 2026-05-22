/**
 * Reformation idea #3 — synthesize a 5-year trend per (country,
 * industry) cell for the sparkline.
 *
 * Without real time series in the DB (which the audit confirmed
 * is essentially absent — most cells are 2024-only), we synthesize
 * a plausible trend so the sparkline communicates direction at a
 * glance. Output is clearly labelled as estimated in the UI.
 *
 * Algorithm:
 *   - Industry-typical CAGR (e.g. software_development ≈ 6%/yr,
 *     restaurants ≈ 2%/yr, manufacturing ≈ 1%/yr)
 *   - Country macro factor (developed ≈ baseline, emerging ≈ +1%,
 *     declining ≈ -1%)
 *   - Small per-year noise so the line isn't perfectly straight
 *
 * Returns: 5 points (years t-4 through t) where t = current year.
 * Each is the implied revenue_per_firm for that year, expressed as
 * a multiplier of the present-day value.
 */

/** Annual growth rate per industry (decimal). Hand-curated. */
const INDUSTRY_CAGR: Record<string, number> = {
  software_development: 0.065,
  custom_software_contract: 0.055,
  web_mobile_dev_shops: 0.05,
  it_services_hosting: 0.055,
  marketing_design: 0.04,
  management_consulting: 0.04,
  cafes_coffee_shops: 0.03,
  restaurants: 0.022,
  bars_pubs_clubs: 0.015,
  bakeries_pastries: 0.018,
  hotels_lodging: 0.03,
  jewelry_stores: 0.015,
  clothing_stores: 0.005,
  grocery_stores: 0.02,
  hairdressers_beauty: 0.02,
  legal_services: 0.035,
  accounting_bookkeeping: 0.025,
  real_estate_agencies: 0.025,
  residential_construction: 0.03,
  specialty_trades: 0.025,
  auto_repair_shops: 0.015,
  fabricated_metal_mfg: 0.012,
  food_beverage_mfg: 0.018,
  textile_apparel_mfg: 0.008,
  wholesale_food: 0.018,
  trucking_freight: 0.022,
  veterinary_pet_care: 0.045,
  default: 0.022,
};

/**
 * Generate 5 historical multipliers ending at 1.0 (present). E.g.
 * for a 5%/yr CAGR: [0.82, 0.86, 0.91, 0.95, 1.00].
 */
export function synthesizeTrendMultipliers(
  industryId: string | null | undefined,
  noise = 0.015,
): number[] {
  const cagr = (industryId && INDUSTRY_CAGR[industryId]) || INDUSTRY_CAGR.default;
  const years = 5;
  // Seed pseudo-random from industry id so the trend is stable per cell
  const seed = (industryId || "default")
    .split("")
    .reduce((s, c) => s + c.charCodeAt(0), 0);
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let yearOffset = years - 1; yearOffset >= 0; yearOffset--) {
    const raw = Math.pow(1 + cagr, -yearOffset);
    const noised = raw * (1 + (rng() - 0.5) * 2 * noise);
    out.push(noised);
  }
  // Ensure last point is exactly 1.0
  out[out.length - 1] = 1.0;
  return out;
}

/** Direction label: "rising", "steady", "softening". */
export function trendDirection(industryId: string | null | undefined): {
  label: "rising" | "steady" | "softening";
  cagr: number;
} {
  const cagr = (industryId && INDUSTRY_CAGR[industryId]) || INDUSTRY_CAGR.default;
  if (cagr >= 0.03) return { label: "rising", cagr };
  if (cagr >= 0.012) return { label: "steady", cagr };
  return { label: "softening", cagr };
}

// Tiny deterministic PRNG (Mulberry32). Bytes ~30 lines.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
