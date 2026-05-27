/**
 * src/lib/economic_profile/au_industry_map.ts
 *
 * Phase 1b — manual mapping from ATO industry slugs (parsed from the
 * ATO A-Z markdown) to Margin Atlas internal industry_id values
 * (from src/lib/taxonomy/industries.json).
 *
 * The Phase 5 sub-industry splits were designed against this exact
 * list, so most slugs map directly. The remaining ATO entries map
 * to the closest existing MA industry; entries with no clean MA
 * equivalent are mapped to null with a `notes` explaining the
 * decision.
 *
 * The cost-engine override reads this mapping: for each AU cell
 * whose industry_id appears as a value in the map, the override
 * looks up the corresponding ATO entry and uses its ratios as
 * primary data instead of the modelled output.
 *
 * Verification: scripts/verify_au_industry_map.ts ensures every
 * ATO slug in the parsed JSON has either a valid MA industry_id
 * here OR an explicit null + notes.
 */

import auBenchmarksJson from "../../../data/finance/au_primary_benchmarks_v1.json";
import industriesJson from "../taxonomy/industries.json";

export type AuMapEntry = {
  /** MA industry_id to override on AU cells; null = no equivalent. */
  ma_id: string | null;
  /** Why this mapping was chosen, or why ma_id is null. */
  notes?: string;
  /**
   * Confidence: "exact" = same definition, "close" = same business
   * with small scope difference, "approximate" = best-effort
   * mapping where definitions diverge.
   */
  confidence: "exact" | "close" | "approximate" | "none";
};

export const AU_TO_MA_INDUSTRY_MAP: Record<string, AuMapEntry> = {
  // Trades — Phase 5 was designed against the ATO A-Z list, so these
  // are mostly exact mappings.
  air_conditioning_refrigeration_and_heating_services: { ma_id: "air_conditioning_refrigeration", confidence: "exact" },
  alarm_installation_services_fire_and_security: { ma_id: "alarm_systems_install", confidence: "exact" },
  automotive_electrical_services: { ma_id: "automotive_electrical_services", confidence: "exact" },
  blocklaying_services: { ma_id: "blocklaying_services", confidence: "exact" },
  bricklaying_services: { ma_id: "bricklaying_services", confidence: "exact" },
  cabinet_makers: { ma_id: "cabinet_making", confidence: "close" },
  carpentry_services: { ma_id: "carpentry_services", confidence: "exact" },
  carpet_laying_services: { ma_id: "carpet_laying_services", confidence: "exact" },
  cement_rendering: { ma_id: "cement_rendering_services", confidence: "exact" },
  cleaning_services_building_and_other_industrial: { ma_id: "cleaning_building_industrial", confidence: "exact" },
  cleaning_services_carpet_rug_and_furniture_upholstery: { ma_id: "cleaning_carpet_upholstery", confidence: "close" },
  concreting_services: { ma_id: "residential_construction", confidence: "approximate", notes: "MA bundles concreting under residential_construction" },
  electrical_services: { ma_id: "electricians", confidence: "exact" },
  fence_construction: { ma_id: "residential_construction", confidence: "approximate", notes: "MA bundles fencing under residential_construction" },
  glazing_services: { ma_id: "residential_construction", confidence: "approximate", notes: "MA bundles glazing under residential_construction" },
  landscape_construction: { ma_id: "landscaping_services", confidence: "close" },
  lawn_mowing_and_garden_services: { ma_id: "landscaping_lawn", confidence: "exact" },
  painting_services: { ma_id: "painting_services", confidence: "exact" },
  plastering_and_ceiling_services: { ma_id: "plastering_services", confidence: "close" },
  plumbing_services: { ma_id: "plumbing_services", confidence: "exact" },
  roofing_services: { ma_id: "roofing_services", confidence: "exact" },
  tiling_services_floor_and_wall: { ma_id: "tiling_services", confidence: "exact" },
  timber_floor_sanding: { ma_id: "flooring_installers", confidence: "approximate", notes: "Sub-specialty of flooring; closest MA bucket" },

  // Food & drink
  bakeries_and_hot_bread_shops: { ma_id: "bakeries_retail", confidence: "exact" },
  cake_shops_and_patisseries: { ma_id: "cake_shops_patisseries", confidence: "exact" },
  catering_services: { ma_id: "catering", confidence: "exact" },
  chicken_shops: { ma_id: "chicken_shops", confidence: "exact" },
  coffee_shops: { ma_id: "cafes_coffee", confidence: "close" },
  delicatessen: { ma_id: "specialty_grocery", confidence: "approximate", notes: "Deli format closer to specialty grocery than to restaurant" },
  fish_and_chips_shops: { ma_id: "fast_casual", confidence: "approximate", notes: "Closest takeaway-format MA bucket" },
  ice_cream_retailing: { ma_id: "specialty_food_production", confidence: "approximate" },
  kebab_shops: { ma_id: "fast_casual", confidence: "approximate" },
  pizza_shops_takeaway: { ma_id: "pizzerias", confidence: "exact" },
  pubs_taverns_and_bars: { ma_id: "pubs_taverns", confidence: "exact" },
  restaurants: { ma_id: "restaurants", confidence: "exact" },
  takeaway_food_services: { ma_id: "fast_casual", confidence: "close" },

  // Retail
  book_retailing: { ma_id: "book_retailing", confidence: "exact" },
  bottle_shops_and_liquor_retailing: { ma_id: "wine_liquor_stores", confidence: "close" },
  clothing_retailing: { ma_id: "clothing_stores", confidence: "exact" },
  computer_retailing: { ma_id: "electronics_appliance_stores", confidence: "close" },
  discount_and_variety_stores: { ma_id: "general_merchandise", confidence: "approximate", notes: "AU 'discount variety' = US 'general merchandise dollar stores'" },
  electrical_and_electronic_product_retailing: { ma_id: "electronics_appliance_stores", confidence: "close" },
  fish_and_seafood_retailing_fresh: { ma_id: "specialty_grocery", confidence: "approximate" },
  floor_covering_retailing: { ma_id: "furniture_stores", confidence: "approximate", notes: "Closer to home-furnishings than to construction" },
  florists: { ma_id: "florist_shops", confidence: "exact" },
  footwear_retailing: { ma_id: "clothing_stores", confidence: "approximate", notes: "MA bundles footwear under clothing" },
  fruit_and_vegetable_retailing: { ma_id: "specialty_grocery", confidence: "close" },
  fuel_retailing: { ma_id: "gas_stations", confidence: "exact" },
  furniture_retailing: { ma_id: "furniture_stores", confidence: "exact" },
  garden_supplies_retailing: { ma_id: "garden_centers", confidence: "exact" },
  gift_stores: { ma_id: "general_merchandise", confidence: "approximate" },
  grocery_retailing_and_convenience_stores: { ma_id: "grocery_stores", confidence: "exact" },
  hardware_and_building_supplies_retailing: { ma_id: "hardware_stores", confidence: "exact" },
  health_food_retailing: { ma_id: "specialty_grocery", confidence: "approximate" },
  homewares_retailing: { ma_id: "furniture_stores", confidence: "approximate" },
  lawn_mower_retailing: { ma_id: "hardware_stores", confidence: "approximate" },
  manchester_and_other_textile_goods_retailing: { ma_id: "furniture_stores", confidence: "approximate", notes: "Linens/towels: closest MA bucket" },
  meat_and_poultry_retailing_fresh: { ma_id: "specialty_grocery", confidence: "close", notes: "Butcher shop sub-format" },
  motor_vehicle_parts_and_batteries_retailing: { ma_id: "auto_repair_shops", confidence: "approximate", notes: "MA doesn't have a dedicated auto-parts retail; auto_repair_shops is closest" },
  motor_vehicle_retail_new_and_used: { ma_id: "auto_dealers", confidence: "exact" },
  musical_instruments_retail: { ma_id: "general_merchandise", confidence: "approximate" },
  newsagents: { ma_id: "general_merchandise", confidence: "approximate" },
  pets_and_pet_supply_retailing: { ma_id: "pet_stores", confidence: "approximate" },
  pharmacy: { ma_id: "independent_pharmacy", confidence: "close" },
  picture_framing_retailing: { ma_id: "general_merchandise", confidence: "approximate" },
  sports_camping_and_fishing_retailing: { ma_id: "sporting_goods_specialty", confidence: "close" },
  stationery_goods_retailing: { ma_id: "general_merchandise", confidence: "approximate" },
  tobacco_retailing: { ma_id: "general_merchandise", confidence: "approximate" },
  toy_and_game_retailing: { ma_id: "toy_game_stores", confidence: "exact" },
  tyre_retailing: { ma_id: "auto_repair_shops", confidence: "approximate", notes: "MA bundles tyre retailing into auto_repair_shops" },
  watch_and_jewellery_retailing: { ma_id: "jewelry_stores", confidence: "close" },

  // Services
  architectural_services: { ma_id: "engineering_architecture", confidence: "close" },
  beauty_services: { ma_id: "hairdressers_beauty", confidence: "close" },
  child_care_services: { ma_id: "childcare_social", confidence: "close" },
  chiropractic_and_osteopathic_services: { ma_id: "chiropractic", confidence: "exact" },
  courier_services: { ma_id: "courier_messenger", confidence: "exact" },
  delivery_services: { ma_id: "courier_messenger", confidence: "close" },
  dental_specialists: { ma_id: "dental_practices", confidence: "close", notes: "MA doesn't split orthodontists separately yet" },
  dental_surgeons_general: { ma_id: "dental_practices", confidence: "exact" },
  domestic_appliance_repair_and_maintenance: { ma_id: "appliance_repair", confidence: "exact" },
  driving_schools_and_instructors: { ma_id: "driving_schools", confidence: "exact" },
  furniture_removalists: { ma_id: "junk_removal_moving", confidence: "exact" },
  hairdressers: { ma_id: "hairdressers_beauty", confidence: "close" },
  health_and_fitness_centres: { ma_id: "sports_fitness", confidence: "exact" },
  laundry_and_dry_cleaning_services: { ma_id: "dry_cleaning_laundry", confidence: "exact" },
  machinery_and_equipment_repairs_and_maintenance: { ma_id: "electronics_repair", confidence: "approximate", notes: "Industrial repair bucket; MA doesn't split machinery vs electronics" },
  panel_beating_and_smash_repairs: { ma_id: "auto_repair_shops", confidence: "close" },
  pest_control_services: { ma_id: "pest_control_local", confidence: "exact" },
  physiotherapy_services: { ma_id: "physical_therapy", confidence: "close" },
  printing: { ma_id: "print_shops", confidence: "exact" },
  printing_support_services: { ma_id: "print_shops", confidence: "approximate" },
  road_freight_transport_services: { ma_id: "trucking_freight", confidence: "exact" },
  sports_and_physical_recreation_instruction: { ma_id: "sports_fitness", confidence: "close" },
  towing_services: { ma_id: "auto_repair_shops", confidence: "approximate", notes: "Closest MA bucket; sub-format of auto services" },
  tutoring_and_coaching: { ma_id: "tutoring_centers", confidence: "exact" },
  veterinary_services: { ma_id: "veterinary_pet_care", confidence: "exact" },
};

/** Source-of-truth: every ATO industry id parsed from the JSON. */
type BenchmarksFile = { industries: Record<string, unknown> };
const PARSED = auBenchmarksJson as unknown as BenchmarksFile;

/** Existing MA industry ids (for the verify gate). */
type Taxonomy = { industries: Array<{ id: string }> };
const MA_IDS = new Set((industriesJson as Taxonomy).industries.map((i) => i.id));

/**
 * Look up the MA industry_id that corresponds to a given ATO slug.
 * Returns null when the ATO industry has no MA equivalent.
 */
export function getAuMaIndustryId(atoSlug: string): string | null {
  return AU_TO_MA_INDUSTRY_MAP[atoSlug]?.ma_id ?? null;
}

/**
 * Reverse lookup: given a MA industry_id, return the ATO slug that
 * maps to it (or null). Used by the cost-engine override.
 */
export function getMaToAuSlug(maId: string): string | null {
  for (const [slug, entry] of Object.entries(AU_TO_MA_INDUSTRY_MAP)) {
    if (entry.ma_id === maId) return slug;
  }
  return null;
}

/** All MA industry_ids covered by AU primary data. */
export function getCoveredMaIds(): string[] {
  const out = new Set<string>();
  for (const entry of Object.values(AU_TO_MA_INDUSTRY_MAP)) {
    if (entry.ma_id) out.add(entry.ma_id);
  }
  return [...out];
}

/** Audit helpers used by the verify gate. */
export function getAtoSlugsInJson(): string[] {
  return Object.keys(PARSED.industries);
}
export function getAtoSlugsInMap(): string[] {
  return Object.keys(AU_TO_MA_INDUSTRY_MAP);
}
export function isKnownMaId(id: string): boolean {
  return MA_IDS.has(id);
}
