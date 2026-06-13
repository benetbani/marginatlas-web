/**
 * src/lib/brand/industry_pictogram.ts
 *
 * Crosswalk from a taxonomy industry_id to one of the 64 AtlasPictogram trade
 * marks (Fable, 2026-06-13). The founder asked for the trade pictograms we
 * ported to actually appear on the trade surfaces (activities index, city
 * trades, neighborhood rankings, cell links). Resolution order:
 *   1. a curated, high-confidence DIRECT map for the common trades;
 *   2. a keyword fallback that scores every pictogram against the industry's
 *      name + keywords and takes the best overlap;
 *   3. a neutral storefront mark ("v-high-street") so a row is never iconless.
 *
 * Pure module (taxonomy + the static pictogram manifest, no IO), safe to call
 * from server components and the layering gate.
 */
import {
  ATLAS_PICTOGRAMS,
  type AtlasPictogramId,
} from "@/components/brand/pictograms";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";

const NEUTRAL: AtlasPictogramId = "v-high-street";

/** Curated industry_id -> pictogram id. Precision for the high-traffic trades;
 *  the keyword fallback handles everything else. Every value is a real
 *  pictogram id. */
const DIRECT: Partial<Record<string, AtlasPictogramId>> = {
  restaurants: "restaurant",
  sit_down_restaurants: "restaurant",
  full_service_restaurants: "restaurant",
  fast_food_takeaway: "burger",
  fast_food: "burger",
  pizzerias: "pizzeria",
  catering: "foodtruck",
  cafes_coffee: "cafe",
  coffee_shops: "cafe",
  bars_nightclubs: "bar",
  bakeries: "bakery",
  bakery: "bakery",
  hotels_lodging: "hotel",
  hotels: "hotel",
  pharmacies_drug_stores: "pharmacy",
  independent_pharmacy: "pharmacy",
  pharmacies_health_stores: "pharmacy",
  grocery_stores: "grocery",
  convenience_stores: "convenience",
  fitness_gyms: "gym",
  sports_fitness: "gym",
  hair_salons_full: "salon",
  hairdressers_beauty: "salon",
  nail_salons: "nails",
  spas_wellness: "spa",
  legal_services: "law",
  accounting_tax: "accountant",
  software_development: "software",
  custom_software_contract: "software",
  it_services: "software",
  auto_repair_shops: "auto",
  auto_repair: "auto",
  dental_practices: "dentist",
  doctors_clinics: "clinic",
  medical_practices: "clinic",
  veterinary_pet_care: "vet",
  optometry_optical: "optician",
  real_estate_agencies: "estate",
  real_estate_leasing: "estate",
  architecture_services: "architecture",
  photography: "photography",
  marketing_advertising: "marketing",
  advertising_agencies: "marketing",
  graphic_design: "design",
  florists: "florist",
  bookstores: "bookshop",
  clothing_retail: "clothing",
  apparel_stores: "clothing",
  footwear_stores: "shoes",
  jewelry_stores: "jewellery",
  electronics_retail: "electronics",
  hardware_stores: "hardware",
  gift_shops: "gift",
  plumbing_services: "plumber",
  electrical_services: "electrician",
  residential_construction: "carpenter",
  commercial_construction: "carpenter",
  painting_services: "painter",
  dry_cleaning_laundry: "laundry",
  cleaning_services: "cleaning",
  moving_storage: "movers",
  printing_services: "print",
  travel_agencies: "travel",
};

/** Generic words that prove nothing about a trade. */
const STOP = new Set([
  "and",
  "the",
  "other",
  "services",
  "service",
  "store",
  "stores",
  "shop",
  "shops",
  "general",
  "retail",
  "misc",
  "local",
  "small",
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z]+/)
    .map((w) => (w.endsWith("s") && w.length > 4 ? w.slice(0, -1) : w))
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

/** Pictogram token index, built once: pictogram id + label words. */
const PICTO_TOKENS: Array<{ id: AtlasPictogramId; toks: Set<string> }> =
  ATLAS_PICTOGRAMS.map((p) => ({
    id: p.id,
    toks: new Set([...tokens(p.id), ...tokens(p.label)]),
  }));

/** Resolve an industry_id to a pictogram id, never null. */
export function industryPictogramId(
  industryId: string | null | undefined,
): AtlasPictogramId {
  if (!industryId) return NEUTRAL;
  const direct = DIRECT[industryId];
  if (direct) return direct;

  const ind = INDUSTRY_BY_ID[industryId];
  // The id + display name describe the trade directly, so they outweigh the
  // looser keyword list (which can carry tangents like "boutique" on a hotel
  // and drag the match to the wrong pictogram).
  const strong = new Set<string>([
    ...tokens(industryId.replace(/_/g, " ")),
    ...(ind ? tokens(ind.name) : []),
  ]);
  const weak = new Set<string>((ind?.keywords ?? []).flatMap((k) => tokens(k)));
  if (strong.size === 0 && weak.size === 0) return NEUTRAL;

  let best: AtlasPictogramId = NEUTRAL;
  let bestScore = 0;
  for (const p of PICTO_TOKENS) {
    let score = 0;
    for (const t of p.toks) {
      if (strong.has(t)) score += 3;
      else if (weak.has(t)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = p.id;
    }
  }
  return best;
}
