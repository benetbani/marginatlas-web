/**
 * Sub-industry seed (Plan v32, Sprint G, Phase 0d).
 *
 * The 30 split candidates from the master plan, declared in code so
 * the framework has something to type-check against and the prebuild
 * gate has something to enforce.
 *
 * Every entry starts with data_ready = false. Phase 1 work (founder +
 * agent, no outside researchers) flips entries to true ONE AT A TIME
 * as real primary-source data lands for at least one country.
 *
 * Fabrication policy (founder, hard line): a variant with data_ready
 * = true MUST have a real source cited in the sub_industries DB row
 * for at least one (industry × country) cell. Pure extrapolation from
 * the parent is not enough. Enforced by verify_deepening prebuild
 * gate.
 *
 * To add the SQL rows after the schema migration ran:
 *   npx tsx scripts/sync_sub_industries.ts
 * (script lives alongside the verify gate; reads this file and
 * upserts the rows into the sub_industries table.)
 */

import type { SubIndustry } from "@/lib/types/deepening";

export const SUB_INDUSTRIES_SEED: SubIndustry[] = [
  // ---- Food & drink ----
  {
    id: "restaurants_quick_service",
    parent_industry_id: "restaurants",
    name: "Quick service & fast food",
    description: "Counter-service formats; global brand franchises and independents",
    data_ready: false,
  },
  {
    id: "restaurants_full_service",
    parent_industry_id: "restaurants",
    name: "Sit-down full service",
    description: "Casual to mid-tier dining; table service, alcohol on premises",
    data_ready: false,
  },
  {
    id: "restaurants_fine_dining",
    parent_industry_id: "restaurants",
    name: "Fine dining",
    description: "Premium destination restaurants; higher ticket, higher capital",
    data_ready: false,
  },
  {
    id: "fast_casual_global_brand",
    parent_industry_id: "fast_casual",
    name: "Global brand franchise",
    description: "McDonald's, KFC, Subway and equivalents",
    data_ready: false,
  },
  {
    id: "fast_casual_regional_chain",
    parent_industry_id: "fast_casual",
    name: "Regional fast-casual",
    description: "Chipotle-style local chains, salad bars, build-your-bowl formats",
    data_ready: false,
  },
  {
    id: "fast_casual_traditional_street",
    parent_industry_id: "fast_casual",
    name: "Traditional street-food",
    description: "Kebab, taqueria, food truck, doner, falafel: local-cuisine quick formats",
    data_ready: false,
  },
  {
    id: "bars_nightclubs_neighborhood",
    parent_industry_id: "bars_nightclubs",
    name: "Neighborhood bar / pub",
    description: "Local watering hole, modest food program",
    data_ready: false,
  },
  {
    id: "bars_nightclubs_cocktail_lounge",
    parent_industry_id: "bars_nightclubs",
    name: "Cocktail lounge",
    description: "Higher-margin drinks, premium positioning, longer dwell time",
    data_ready: false,
  },
  {
    id: "bars_nightclubs_nightclub",
    parent_industry_id: "bars_nightclubs",
    name: "Nightclub",
    description: "Late-night, music-driven, cover-charge model",
    data_ready: false,
  },
  {
    id: "bars_nightclubs_sports_bar",
    parent_industry_id: "bars_nightclubs",
    name: "Sports bar",
    description: "TV-driven, food + drink, daytime + evening trade",
    data_ready: false,
  },

  // ---- Hospitality ----
  {
    id: "hotels_lodging_hostel",
    parent_industry_id: "hotels_lodging",
    name: "Budget hostel",
    description: "Dorms, shared facilities, backpacker / youth-travel market",
    data_ready: false,
  },
  {
    id: "hotels_lodging_midmarket",
    parent_industry_id: "hotels_lodging",
    name: "Mid-market hotel",
    description: "3-star equivalent; private rooms, basic amenities",
    data_ready: false,
  },
  {
    id: "hotels_lodging_boutique",
    parent_industry_id: "hotels_lodging",
    name: "Boutique hotel",
    description: "Design-led, 10-50 rooms, premium per-night, distinctive identity",
    data_ready: false,
  },
  {
    id: "hotels_lodging_luxury",
    parent_industry_id: "hotels_lodging",
    name: "Luxury hotel",
    description: "5-star, full service, premium capital footprint",
    data_ready: false,
  },
  {
    id: "hotels_lodging_extended_stay",
    parent_industry_id: "hotels_lodging",
    name: "Extended-stay",
    description: "Apartment-format, weekly+ rentals, kitchenettes",
    data_ready: false,
  },

  // ---- Personal services ----
  {
    id: "hairdressers_beauty_mens",
    parent_industry_id: "hairdressers_beauty",
    name: "Men's barbershop",
    description: "Cuts + shaves, lower average ticket, higher throughput",
    data_ready: false,
  },
  {
    id: "hairdressers_beauty_womens",
    parent_industry_id: "hairdressers_beauty",
    name: "Women's salon",
    description: "Cuts, color, styling; higher average ticket, longer service times",
    data_ready: false,
  },
  {
    id: "hairdressers_beauty_unisex",
    parent_industry_id: "hairdressers_beauty",
    name: "Unisex salon",
    description: "Mixed clientele; covers both ticket profiles",
    data_ready: false,
  },

  // ---- Auto ----
  {
    id: "auto_dealers_used",
    parent_industry_id: "auto_dealers",
    name: "Used-car dealer",
    description: "Independent used-car lots, lower per-unit margin, no manufacturer ties",
    data_ready: false,
  },
  {
    id: "auto_dealers_new_franchise",
    parent_industry_id: "auto_dealers",
    name: "New-car franchise dealer",
    description: "Brand-franchised showroom, service department, higher capital footprint",
    data_ready: false,
  },
  {
    id: "auto_dealers_luxury",
    parent_industry_id: "auto_dealers",
    name: "Luxury / exotic import",
    description: "Premium brands, exotic imports, highest per-unit transaction value",
    data_ready: false,
  },
  {
    id: "auto_repair_shops_independent",
    parent_industry_id: "auto_repair_shops",
    name: "Independent general repair",
    description: "Non-franchised neighborhood shop",
    data_ready: false,
  },
  {
    id: "auto_repair_shops_dealership_service",
    parent_industry_id: "auto_repair_shops",
    name: "Dealership service department",
    description: "Manufacturer-affiliated service bays, higher labor rate",
    data_ready: false,
  },
  {
    id: "auto_repair_shops_specialty",
    parent_industry_id: "auto_repair_shops",
    name: "Specialty (tire / glass / body)",
    description: "Single-discipline specialist (tires, windshields, collision repair)",
    data_ready: false,
  },

  // ---- Professional services ----
  {
    id: "legal_services_corporate",
    parent_industry_id: "legal_services",
    name: "Corporate / commercial",
    description: "Business law, M&A, contracts; higher billable rate",
    data_ready: false,
  },
  {
    id: "legal_services_litigation",
    parent_industry_id: "legal_services",
    name: "Litigation",
    description: "Civil litigation, plaintiff and defense",
    data_ready: false,
  },
  {
    id: "legal_services_family_divorce",
    parent_industry_id: "legal_services",
    name: "Family & divorce",
    description: "Family law, divorce, custody; consumer client base",
    data_ready: false,
  },
  {
    id: "legal_services_immigration",
    parent_industry_id: "legal_services",
    name: "Immigration",
    description: "Visa, residency, asylum work; high volume, lower per-matter fee",
    data_ready: false,
  },
  {
    id: "legal_services_solo_general",
    parent_industry_id: "legal_services",
    name: "Solo general practice",
    description: "One-attorney shop covering multiple matter types",
    data_ready: false,
  },

  // ---- Retail (one set to start; expand later) ----
  {
    id: "clothing_stores_luxury",
    parent_industry_id: "clothing_stores",
    name: "Luxury / designer",
    description: "Premium brands, single-store or boutique chain, very high ticket",
    data_ready: false,
  },
  {
    id: "clothing_stores_midmarket_chain",
    parent_industry_id: "clothing_stores",
    name: "Mid-market chain",
    description: "Zara, H&M, Bershka equivalent; volume-driven",
    data_ready: false,
  },
  {
    id: "clothing_stores_value",
    parent_industry_id: "clothing_stores",
    name: "Value / discount",
    description: "Primark, Walmart apparel equivalent; lowest price tier",
    data_ready: false,
  },
  {
    id: "clothing_stores_vintage_used",
    parent_industry_id: "clothing_stores",
    name: "Vintage / used",
    description: "Thrift, consignment, vintage curation",
    data_ready: false,
  },
];

/**
 * Helper: find variants for a parent industry. Returns only data_ready
 * variants by default (the only ones that should render publicly).
 */
export function variantsForIndustry(
  parentIndustryId: string,
  opts: { includeUnready?: boolean } = {},
): SubIndustry[] {
  return SUB_INDUSTRIES_SEED.filter(
    (v) =>
      v.parent_industry_id === parentIndustryId &&
      (opts.includeUnready || v.data_ready),
  );
}

/** All parent industry ids that have at least one variant in the seed. */
export function parentIndustriesWithVariants(opts: { onlyReady?: boolean } = {}): Set<string> {
  return new Set(
    SUB_INDUSTRIES_SEED
      .filter((v) => !opts.onlyReady || v.data_ready)
      .map((v) => v.parent_industry_id),
  );
}
