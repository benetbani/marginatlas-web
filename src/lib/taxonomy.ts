/**
 * Friendly taxonomy — the bridge between raw codes (NAICS-6, NACE-4, ISIC-4)
 * and user-facing sector + industry labels with bracket examples.
 *
 * Used everywhere the user might see a code.
 */
import sectorsJson from "./taxonomy/sectors.json";
import industriesJson from "./taxonomy/industries.json";

export type Sector = {
  id: string;
  name: string;
  /** v4 fields */
  tagline?: string;
  display_order?: number;
  audience_default?: "visible" | "hidden";
  header_color?: string;
  legacy_aliases?: string[];
  /** Existing fields */
  isic_sections?: string[];
  isic_divisions?: string[];
  examples: string[];
  icon: string;
  /** Deprecated — kept for back-compat. Use display_order. */
  order?: number;
};

export type AudienceTag =
  | "smb_core"
  | "smb_friendly"
  | "mixed_caution"
  | "corp_only";

export type Industry = {
  id: string;
  name: string;
  examples: string[];
  keywords: string[];
  sector_id: string;
  isic_divisions?: string[];
  naics_3?: string[];
  nace_divisions?: string[];
  /** Audience tag (Plan v3.0 §L). Falls back to "smb_friendly" if absent. */
  audience?: AudienceTag;
  /** For SMB sub-niches: parent industry ID with actual measurements. */
  parent_id?: string;
};

export const SECTORS = (sectorsJson as { sectors: Sector[] }).sectors;
export const INDUSTRIES = (industriesJson as { industries: Industry[] }).industries;

export const SECTOR_BY_ID: Record<string, Sector> = Object.fromEntries(
  SECTORS.map((s) => [s.id, s])
);
export const INDUSTRY_BY_ID: Record<string, Industry> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.id, i])
);

/** NAICS-3 → industry_id lookup (US cells). */
export const NAICS_3_TO_INDUSTRY: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const ind of INDUSTRIES) {
    for (const n3 of ind.naics_3 || []) {
      if (!(n3 in m)) m[n3] = ind.id;
    }
  }
  return m;
})();

/** NAICS-6 → industry_id (takes first 3 chars). */
export function naics6ToIndustry(naics6: string | null | undefined): string | null {
  if (!naics6) return null;
  return NAICS_3_TO_INDUSTRY[String(naics6).slice(0, 3)] || null;
}

/**
 * Strip diacritics so "Cafés" slugifies to "cafes" not "caf-s".
 * Uses NFD decomposition + remove combining marks.
 */
function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Build URL slug from an industry id or name. */
export function industryToSlug(industryId: string): string {
  const ind = INDUSTRY_BY_ID[industryId];
  const name = ind ? ind.name : industryId;
  return stripDiacritics(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Canonical-slug → Industry lookup. Built at module load from industryToSlug().
 * Exact match wins over any fuzzy fallback — fixes the historical bug where
 * /de/munich/metal-products-mfg resolved to mining_quarrying via keyword
 * substring match.
 */
export const SLUG_TO_INDUSTRY: Record<string, Industry> = (() => {
  const m: Record<string, Industry> = {};
  for (const ind of INDUSTRIES) {
    m[industryToSlug(ind.id)] = ind;
  }
  return m;
})();

/**
 * Hand-curated aliases for shortened or alternate slugs that appear in URLs,
 * outbound links, or user typings. Keys are slug-form (lowercase + dashes);
 * values are canonical industry ids.
 */
export const INDUSTRY_SLUG_ALIASES: Record<string, string> = {
  // Shortened manufacturing slugs
  "metal-products-mfg": "metal_products_mfg",
  "food-beverage-mfg": "food_mfg",
  "food_beverage_mfg": "food_mfg",
  "textile-apparel-mfg": "textile_apparel_mfg",
  "motor-vehicles-mfg": "motor_vehicles_mfg",
  "chemicals-mfg": "chemicals_mfg",
  "pharmaceuticals-mfg": "pharmaceuticals_mfg",
  "plastics-rubber-mfg": "plastics_rubber_mfg",
  "wood-paper-mfg": "wood_paper_mfg",
  // Preserve old broken-accent slug for back-compat
  "caf-s-coffee-shops": "cafes_coffee",
  "cafes-coffee": "cafes_coffee",
  "cafe": "cafes_coffee",
  "cafes": "cafes_coffee",
  // Common singulars and short forms
  "restaurant": "restaurants",
  "lawyer": "legal_services",
  "lawyers": "legal_services",
  "legal": "legal_services",
  "tax-accountant": "accounting_tax",
  "tax-accountants": "accounting_tax",
  "accountant": "accounting_tax",
  "accountants": "accounting_tax",
  "accounting": "accounting_tax",
  "doctor": "doctors_clinics",
  "doctors": "doctors_clinics",
  "clinic": "doctors_clinics",
  "clinics": "doctors_clinics",
  "dentist": "dental_practices",
  "dentists": "dental_practices",
  "dental": "dental_practices",
  "hairdresser": "hairdressers_beauty",
  "hairdressers": "hairdressers_beauty",
  "hair-salon": "hair_salons",
  "barber": "barbershops",
  "barbers": "barbershops",
  "salon": "hair_salons",
  "spa": "day_spas",
  "spas": "day_spas",
  "vet": "veterinary_pet_care",
  "veterinarian": "veterinary_pet_care",
  "plumber": "residential_construction",
  "plumbers": "residential_construction",
  "electrician": "residential_construction",
  "electricians": "residential_construction",
  "trucking": "trucking_freight",
  "freight": "trucking_freight",
  "logistics": "trucking_freight",
  "ecommerce": "ecommerce_mail_order",
  "e-commerce": "ecommerce_mail_order",
  "online-store": "ecommerce_mail_order",
  "grocery": "grocery_stores",
  "supermarket": "grocery_stores",
  "supermarkets": "grocery_stores",
  "bakery": "food_mfg",
  "bakeries": "food_mfg",
  "real-estate": "real_estate_agencies",
  "realtor": "real_estate_agencies",
  "realtors": "real_estate_agencies",
  "insurance-agent": "insurance",
  "fitness": "sports_fitness",
  "gym": "sports_fitness",
  "gyms": "sports_fitness",
  "yoga": "sports_fitness",
  "bar": "bars_nightclubs",
  "bars": "bars_nightclubs",
  "pub": "bars_nightclubs",
  "nightclub": "bars_nightclubs",
  // CC.11 — broader common-language aliases
  "consulting": "management_consulting",
  "consultant": "management_consulting",
  "consultants": "management_consulting",
  "management-consultant": "management_consulting",
  "advisory": "management_consulting",
  "design-studio": "marketing_design",
  "graphic-design": "marketing_design",
  "marketing": "marketing_design",
  "advertising": "marketing_design",
  "agency": "marketing_design",
  "creative-agency": "marketing_design",
  "architect": "architecture_engineering",
  "architects": "architecture_engineering",
  "engineer": "architecture_engineering",
  "engineering": "architecture_engineering",
  "construction": "residential_construction",
  "builder": "residential_construction",
  "general-contractor": "residential_construction",
  "contractor": "residential_construction",
  "remodeling": "residential_construction",
  "renovation": "residential_construction",
  "landscaping": "residential_construction",
  "hvac": "residential_construction",
  "auto-repair": "auto_repair_shops",
  "garage": "auto_repair_shops",
  "mechanic": "auto_repair_shops",
  "car-wash": "auto_repair_shops",
  "clothing": "clothing_stores",
  "boutique": "clothing_stores",
  "apparel": "clothing_stores",
  "footwear": "clothing_stores",
  "shoes": "clothing_stores",
  "jewelry": "clothing_stores",
  "florist": "specialty_food_production",
  "wine": "specialty_food_production",
  "winery": "specialty_food_production",
  "brewery": "beverage_mfg",
  "distillery": "beverage_mfg",
  "butcher": "specialty_food_production",
  "deli": "specialty_food_production",
  "patisserie": "food_mfg",
  "pizzeria": "restaurants",
  "diner": "restaurants",
  "bistro": "restaurants",
  "food-truck": "food_trucks",
  "ice-cream": "restaurants",
  "juice-bar": "cafes_coffee",
  "tea-house": "cafes_coffee",
  "bnb": "hotels_lodging",
  "hostel": "hotels_lodging",
  "guesthouse": "hotels_lodging",
  "bed-and-breakfast": "hotels_lodging",
  "tour-operator": "hotels_lodging",
  "travel-agency": "hotels_lodging",
  "consultancy": "management_consulting",
  "law-firm": "legal_services",
  "law-office": "legal_services",
  "notary": "legal_services",
  "cpa": "accounting_tax",
  "bookkeeping": "accounting_tax",
  "bookkeeper": "accounting_tax",
  "audit": "accounting_tax",
  "real-estate-agent": "real_estate_agencies",
  "broker": "real_estate_agencies",
  "property-management": "real_estate_agencies",
  "rental-agency": "real_estate_agencies",
  "insurance-broker": "insurance",
  "trucker": "trucking_freight",
  "courier": "trucking_freight",
  "delivery": "trucking_freight",
  "warehouse": "wholesale_food",
  "wholesale": "wholesale_general",
  "distributor": "wholesale_general",
  "pet-shop": "veterinary_pet_care",
  "pet-store": "veterinary_pet_care",
  "kennel": "veterinary_pet_care",
  "groomer": "veterinary_pet_care",
  "childcare": "childcare_social",
  "daycare": "childcare_social",
  "preschool": "primary_secondary_schools",
  "school": "primary_secondary_schools",
  "tutor": "vocational_training",
  "tutoring": "vocational_training",
  "language-school": "vocational_training",
  "music-school": "vocational_training",
  "yoga-studio": "sports_fitness",
  "pilates": "sports_fitness",
  "personal-trainer": "sports_fitness",
  "martial-arts": "sports_fitness",
  "dance-studio": "performing_arts",
  "theater": "performing_arts",
  "art-gallery": "museums_cultural",
  "museum": "museums_cultural",
  "library": "museums_cultural",
  "photographer": "marketing_design",
  "photography": "marketing_design",
  "videographer": "marketing_design",
  "tailor": "textile_apparel_mfg",
  "seamstress": "textile_apparel_mfg",
  "carpenter": "wood_paper_mfg",
  "furniture-maker": "wood_paper_mfg",
  "winemaker": "beverage_mfg",
  "farm": "forestry_logging",
  "agriculture": "forestry_logging",
};

/**
 * Tighter fuzzy fallback. Splits both candidate and target into tokens and
 * requires that EVERY query token appears as a complete word in the name
 * or keyword set. Avoids the old `s.includes(k)` substring trap where
 * "metal products mfg" matched mining via the bare "metal" keyword.
 */
function fuzzyIndustryFallback(slugWords: string): Industry | null {
  const queryTokens = slugWords.split(/\s+/).filter((t) => t.length >= 3);
  if (queryTokens.length === 0) return null;

  let bestInd: Industry | null = null;
  let bestScore = 0;

  for (const ind of INDUSTRIES) {
    const nameTokens = new Set(
      stripDiacritics(ind.name)
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
    );
    const kwTokens = new Set<string>();
    for (const k of ind.keywords) {
      for (const t of stripDiacritics(k).toLowerCase().split(/[^a-z0-9]+/)) {
        if (t) kwTokens.add(t);
      }
    }
    let score = 0;
    for (const q of queryTokens) {
      if (nameTokens.has(q)) score += 3;
      else if (kwTokens.has(q)) score += 1;
    }
    // Require ALL query tokens to land somewhere; otherwise drop.
    if (score < queryTokens.length) continue;
    if (score > bestScore) {
      bestScore = score;
      bestInd = ind;
    }
  }
  return bestInd;
}

/** Slug → industry. Order: canonical exact → alias map → tight fuzzy fallback. */
export function slugToIndustry(slug: string | null | undefined): Industry | null {
  if (!slug) return null;
  const norm = stripDiacritics(slug)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!norm) return null;

  // 1. Canonical slug exact match
  if (SLUG_TO_INDUSTRY[norm]) return SLUG_TO_INDUSTRY[norm];

  // 2. Alias map exact match
  const aliasId = INDUSTRY_SLUG_ALIASES[norm];
  if (aliasId && INDUSTRY_BY_ID[aliasId]) return INDUSTRY_BY_ID[aliasId];

  // 3. Tight fuzzy fallback (word-boundary token match, every token required)
  return fuzzyIndustryFallback(norm.replace(/-/g, " "));
}

/**
 * Sectors in curated display order (Plan v4.0 master menu).
 * Falls back to `order` for any sector still on the v3 schema.
 */
export const SECTORS_ORDERED = [...SECTORS].sort((a, b) => {
  const oa = a.display_order ?? a.order ?? 99;
  const ob = b.display_order ?? b.order ?? 99;
  return oa - ob;
});

/** Legacy sector ID → canonical sector ID map (for URL stability). */
export const LEGACY_SECTOR_ALIAS: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const s of SECTORS) {
    for (const alias of s.legacy_aliases || []) {
      if (!(alias in m)) m[alias] = s.id;
    }
  }
  return m;
})();

/** Resolve a sector slug (possibly legacy) to its canonical Sector. */
export function resolveSector(slug: string): Sector | null {
  if (!slug) return null;
  if (SECTOR_BY_ID[slug]) return SECTOR_BY_ID[slug];
  const aliased = LEGACY_SECTOR_ALIAS[slug];
  if (aliased && SECTOR_BY_ID[aliased]) return SECTOR_BY_ID[aliased];
  return null;
}

/** Audience helpers — Plan v3.0 §L + §P. */

/** Default-visible audiences (what the founder/SMB user actually wants). */
const DEFAULT_VISIBLE: AudienceTag[] = ["smb_core", "smb_friendly"];

export function isDefaultVisible(ind: Industry): boolean {
  const tag = ind.audience || "smb_friendly";
  return DEFAULT_VISIBLE.includes(tag);
}

export function audienceLabel(tag: AudienceTag | undefined): string {
  switch (tag) {
    case "smb_core": return "Small-business core";
    case "smb_friendly": return "SMB-friendly";
    case "mixed_caution": return "Mixed: read with caution";
    case "corp_only": return "Large-firm dominated";
    default: return "";
  }
}

/**
 * Industries filtered by audience visibility.
 * - When `revealMixed` is true, `mixed_caution` is included.
 * - When `revealCorp` is true (Pro), `corp_only` is included.
 */
export function visibleIndustries(opts: { revealMixed?: boolean; revealCorp?: boolean } = {}): Industry[] {
  return INDUSTRIES.filter((i) => {
    const tag = i.audience || "smb_friendly";
    if (DEFAULT_VISIBLE.includes(tag)) return true;
    if (tag === "mixed_caution" && opts.revealMixed) return true;
    if (tag === "corp_only" && opts.revealCorp) return true;
    return false;
  });
}

/**
 * Hard-coded fallback map for parent industries that themselves are NOT in
 * extrapolated_cells. After Plan v4.0 Step 20 audit identified 102 visible
 * industries that don't resolve, this map points each missing parent to the
 * closest covered industry so the cell page renders a (clearly-labeled)
 * estimate rather than 404'ing.
 *
 * Sources of truth for the "44 covered industries" came from running
 * scripts/audit_extrapolated_coverage.py against the live Supabase table.
 */
export const PARENT_FALLBACK_MAP: Record<string, string> = {
  // Apparel chain: boutique/jewelry/shoes → clothing_stores → textile_apparel_mfg (covered)
  clothing_stores: "textile_apparel_mfg",
  // Beauty services → cleaning_services (closest "personal services" extrapolation)
  hairdressers_beauty: "cleaning_services",
  hair_salons: "cleaning_services",
  barbershops: "cleaning_services",
  nail_salons: "cleaning_services",
  day_spas: "cleaning_services",
  // Education/instruction → media_publishing (covered; closest content/training proxy)
  vocational_training: "media_publishing",
  // Specialty retail aggregate → grocery_stores (closest covered retail anchor)
  general_merchandise: "grocery_stores",
  furniture_stores: "grocery_stores",
  building_garden_stores: "grocery_stores",
  electronics_appliance_stores: "grocery_stores",
  health_beauty_stores: "grocery_stores",
  ecommerce_mail_order: "grocery_stores",
  // Health small clinics → veterinary_pet_care (closest covered small-clinic proxy)
  doctors_clinics: "veterinary_pet_care",
  dental_practices: "veterinary_pet_care",
  // Auto repair → motor_vehicles_mfg (closest automotive vertical)
  auto_repair_shops: "motor_vehicles_mfg",
  // Restaurants sub-niches already inherit from restaurants (covered).
  // Bars → restaurants (closest covered hospitality vertical)
  bars_nightclubs: "restaurants",
  // Other local services → cleaning_services
  dry_cleaning_laundry: "cleaning_services",
  // Education adjacencies
  primary_secondary_schools: "media_publishing",
  childcare_social: "veterinary_pet_care",
  // Recreation → restaurants (closest local-discretionary spending proxy)
  sports_fitness: "restaurants",
  performing_arts: "media_publishing",
  museums_cultural: "media_publishing",
  // Professional adjacencies
  accounting_tax: "legal_services",
  insurance: "real_estate_agencies",
  // Construction sub
  commercial_construction: "residential_construction",
  // Wholesale
  wholesale_durables: "wholesale_food",
  wholesale_general: "wholesale_food",
  // Transport
  transit_ground_passenger: "trucking_freight",
  scenic_sightseeing_transport: "trucking_freight",
  transport_support: "trucking_freight",
  // Manufacturing food adjacency
  catering: "food_mfg",
};

/**
 * Resolve an industry to the deepest measured ancestor we can reach. Walks
 * parent_id, then PARENT_FALLBACK_MAP, then returns the industry itself if
 * neither path lands on a measured industry.
 */
export function resolveToMeasuredIndustry(ind: Industry | null | undefined): Industry | null {
  if (!ind) return null;
  const visited = new Set<string>();
  let current: Industry | null = ind;
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    // First preference: explicit parent_id
    if (current.parent_id && INDUSTRY_BY_ID[current.parent_id]) {
      current = INDUSTRY_BY_ID[current.parent_id];
      continue;
    }
    // Second preference: hard-coded fallback map
    const fallbackId: string | undefined = PARENT_FALLBACK_MAP[current.id];
    if (fallbackId && INDUSTRY_BY_ID[fallbackId]) {
      current = INDUSTRY_BY_ID[fallbackId];
      continue;
    }
    break;
  }
  return current;
}

/** Alphabetical sort helpers. */
export function industriesAlpha(list: Industry[] = INDUSTRIES): Industry[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export const SECTORS_ALPHA = [...SECTORS].sort((a, b) => a.name.localeCompare(b.name));

/** Industries grouped by sector — for cascading dropdowns. */
export const INDUSTRIES_BY_SECTOR: Record<string, Industry[]> = (() => {
  const out: Record<string, Industry[]> = {};
  for (const s of SECTORS) out[s.id] = [];
  for (const i of INDUSTRIES) {
    if (!out[i.sector_id]) out[i.sector_id] = [];
    out[i.sector_id].push(i);
  }
  return out;
})();

/** Sector-level visibility gate. */
export type Gate = { revealMixed?: boolean; revealCorp?: boolean };

/**
 * Does this sector have ANY industries visible under the given gate?
 * Used to hide whole sectors when all their children are corp_only.
 */
export function sectorHasVisibleIndustries(sectorId: string, gate: Gate = {}): boolean {
  const list = INDUSTRIES_BY_SECTOR[sectorId] || [];
  for (const ind of list) {
    const tag = ind.audience || "smb_friendly";
    if (DEFAULT_VISIBLE.includes(tag)) return true;
    if (tag === "mixed_caution" && gate.revealMixed) return true;
    if (tag === "corp_only" && gate.revealCorp) return true;
  }
  return false;
}

/**
 * Sectors visible to the user under the given gate, in display_order.
 * A sector renders when BOTH:
 *   - its own `audience_default` allows it (or gate overrides)
 *   - it has at least one visible child industry
 */
export function visibleSectors(gate: Gate = {}): Sector[] {
  return SECTORS_ORDERED.filter((s) => {
    const sectorVisible =
      s.audience_default !== "hidden" ||
      gate.revealCorp === true;
    if (!sectorVisible) return false;
    return sectorHasVisibleIndustries(s.id, gate);
  });
}

/** Visible industries inside a specific sector, alphabetical within the sector. */
export function visibleIndustriesInSector(sectorId: string, gate: Gate = {}): Industry[] {
  const list = INDUSTRIES_BY_SECTOR[sectorId] || [];
  return list
    .filter((i) => {
      const tag = i.audience || "smb_friendly";
      if (DEFAULT_VISIBLE.includes(tag)) return true;
      if (tag === "mixed_caution" && gate.revealMixed) return true;
      if (tag === "corp_only" && gate.revealCorp) return true;
      return false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Country list — what we expose in the navigator. Stored alphabetically
 * (Plan v4.0 Step 4.10). Quality remains a field, used only on the
 * country landing page for the coverage badge — not for sort order.
 */
const COUNTRIES_RAW: { code: string; name: string; quality: "A" | "B" | "C" | "D" }[] = [
  { code: "AF", name: "Afghanistan", quality: "D" },
  { code: "AL", name: "Albania", quality: "D" },
  { code: "DZ", name: "Algeria", quality: "D" },
  { code: "AD", name: "Andorra", quality: "D" },
  { code: "AO", name: "Angola", quality: "D" },
  { code: "AG", name: "Antigua and Barbuda", quality: "D" },
  { code: "AR", name: "Argentina", quality: "D" },
  { code: "AM", name: "Armenia", quality: "D" },
  { code: "AU", name: "Australia", quality: "B" },
  { code: "AT", name: "Austria", quality: "B" },
  { code: "AZ", name: "Azerbaijan", quality: "D" },
  { code: "BS", name: "Bahamas", quality: "C" },
  { code: "BH", name: "Bahrain", quality: "D" },
  { code: "BD", name: "Bangladesh", quality: "D" },
  { code: "BB", name: "Barbados", quality: "D" },
  { code: "BY", name: "Belarus", quality: "D" },
  { code: "BE", name: "Belgium", quality: "B" },
  { code: "BZ", name: "Belize", quality: "D" },
  { code: "BJ", name: "Benin", quality: "D" },
  { code: "BT", name: "Bhutan", quality: "D" },
  { code: "BO", name: "Bolivia", quality: "D" },
  { code: "BA", name: "Bosnia and Herzegovina", quality: "D" },
  { code: "BW", name: "Botswana", quality: "D" },
  { code: "BR", name: "Brazil", quality: "C" },
  { code: "BN", name: "Brunei", quality: "D" },
  { code: "BG", name: "Bulgaria", quality: "C" },
  { code: "BF", name: "Burkina Faso", quality: "D" },
  { code: "BI", name: "Burundi", quality: "D" },
  { code: "KH", name: "Cambodia", quality: "D" },
  { code: "CM", name: "Cameroon", quality: "D" },
  { code: "CA", name: "Canada", quality: "B" },
  { code: "CV", name: "Cape Verde", quality: "D" },
  { code: "CF", name: "Central African Republic", quality: "D" },
  { code: "TD", name: "Chad", quality: "D" },
  { code: "CL", name: "Chile", quality: "D" },
  { code: "CN", name: "China", quality: "D" },
  { code: "CO", name: "Colombia", quality: "D" },
  { code: "KM", name: "Comoros", quality: "D" },
  { code: "CR", name: "Costa Rica", quality: "D" },
  { code: "CI", name: "Cote d'Ivoire", quality: "D" },
  { code: "HR", name: "Croatia", quality: "C" },
  { code: "CU", name: "Cuba", quality: "D" },
  { code: "CY", name: "Cyprus", quality: "C" },
  { code: "CZ", name: "Czechia", quality: "C" },
  { code: "CD", name: "DR Congo", quality: "D" },
  { code: "DK", name: "Denmark", quality: "B" },
  { code: "DJ", name: "Djibouti", quality: "D" },
  { code: "DM", name: "Dominica", quality: "D" },
  { code: "DO", name: "Dominican Republic", quality: "D" },
  { code: "EC", name: "Ecuador", quality: "D" },
  { code: "EG", name: "Egypt", quality: "D" },
  { code: "SV", name: "El Salvador", quality: "D" },
  { code: "GQ", name: "Equatorial Guinea", quality: "D" },
  { code: "EE", name: "Estonia", quality: "C" },
  { code: "SZ", name: "Eswatini", quality: "D" },
  { code: "ET", name: "Ethiopia", quality: "D" },
  { code: "FJ", name: "Fiji", quality: "D" },
  { code: "FI", name: "Finland", quality: "B" },
  { code: "FR", name: "France", quality: "B" },
  { code: "GA", name: "Gabon", quality: "D" },
  { code: "GM", name: "Gambia", quality: "D" },
  { code: "GE", name: "Georgia", quality: "D" },
  { code: "DE", name: "Germany", quality: "B" },
  { code: "GH", name: "Ghana", quality: "D" },
  { code: "GR", name: "Greece", quality: "C" },
  { code: "GD", name: "Grenada", quality: "D" },
  { code: "GT", name: "Guatemala", quality: "D" },
  { code: "GN", name: "Guinea", quality: "D" },
  { code: "GW", name: "Guinea-Bissau", quality: "D" },
  { code: "GY", name: "Guyana", quality: "D" },
  { code: "HT", name: "Haiti", quality: "D" },
  { code: "HN", name: "Honduras", quality: "D" },
  { code: "HK", name: "Hong Kong", quality: "B" },
  { code: "HU", name: "Hungary", quality: "C" },
  { code: "IS", name: "Iceland", quality: "C" },
  { code: "IN", name: "India", quality: "C" },
  { code: "ID", name: "Indonesia", quality: "D" },
  { code: "IR", name: "Iran", quality: "D" },
  { code: "IQ", name: "Iraq", quality: "D" },
  { code: "IE", name: "Ireland", quality: "B" },
  { code: "IL", name: "Israel", quality: "D" },
  { code: "IT", name: "Italy", quality: "B" },
  { code: "JM", name: "Jamaica", quality: "D" },
  { code: "JP", name: "Japan", quality: "C" },
  { code: "JO", name: "Jordan", quality: "D" },
  { code: "KZ", name: "Kazakhstan", quality: "D" },
  { code: "KE", name: "Kenya", quality: "D" },
  { code: "KI", name: "Kiribati", quality: "D" },
  { code: "XK", name: "Kosovo", quality: "D" },
  { code: "KW", name: "Kuwait", quality: "D" },
  { code: "KG", name: "Kyrgyzstan", quality: "D" },
  { code: "LA", name: "Laos", quality: "D" },
  { code: "LV", name: "Latvia", quality: "C" },
  { code: "LB", name: "Lebanon", quality: "D" },
  { code: "LS", name: "Lesotho", quality: "D" },
  { code: "LR", name: "Liberia", quality: "D" },
  { code: "LY", name: "Libya", quality: "D" },
  { code: "LI", name: "Liechtenstein", quality: "D" },
  { code: "LT", name: "Lithuania", quality: "C" },
  { code: "LU", name: "Luxembourg", quality: "C" },
  { code: "MO", name: "Macau", quality: "C" },
  { code: "MG", name: "Madagascar", quality: "D" },
  { code: "MW", name: "Malawi", quality: "D" },
  { code: "MY", name: "Malaysia", quality: "D" },
  { code: "MV", name: "Maldives", quality: "D" },
  { code: "ML", name: "Mali", quality: "D" },
  { code: "MT", name: "Malta", quality: "C" },
  { code: "MH", name: "Marshall Islands", quality: "D" },
  { code: "MR", name: "Mauritania", quality: "D" },
  { code: "MU", name: "Mauritius", quality: "D" },
  { code: "MX", name: "Mexico", quality: "B" },
  { code: "FM", name: "Micronesia", quality: "D" },
  { code: "MD", name: "Moldova", quality: "D" },
  { code: "MC", name: "Monaco", quality: "D" },
  { code: "MN", name: "Mongolia", quality: "D" },
  { code: "ME", name: "Montenegro", quality: "D" },
  { code: "MA", name: "Morocco", quality: "D" },
  { code: "MZ", name: "Mozambique", quality: "D" },
  { code: "MM", name: "Myanmar", quality: "D" },
  { code: "NA", name: "Namibia", quality: "D" },
  { code: "NR", name: "Nauru", quality: "D" },
  { code: "NP", name: "Nepal", quality: "D" },
  { code: "NL", name: "Netherlands", quality: "B" },
  { code: "NZ", name: "New Zealand", quality: "B" },
  { code: "NI", name: "Nicaragua", quality: "D" },
  { code: "NE", name: "Niger", quality: "D" },
  { code: "NG", name: "Nigeria", quality: "D" },
  { code: "MK", name: "North Macedonia", quality: "D" },
  { code: "NO", name: "Norway", quality: "B" },
  { code: "OM", name: "Oman", quality: "D" },
  { code: "PK", name: "Pakistan", quality: "D" },
  { code: "PW", name: "Palau", quality: "D" },
  { code: "PS", name: "Palestine", quality: "D" },
  { code: "PA", name: "Panama", quality: "D" },
  { code: "PG", name: "Papua New Guinea", quality: "D" },
  { code: "PY", name: "Paraguay", quality: "D" },
  { code: "PE", name: "Peru", quality: "D" },
  { code: "PH", name: "Philippines", quality: "D" },
  { code: "PL", name: "Poland", quality: "B" },
  { code: "PT", name: "Portugal", quality: "B" },
  { code: "QA", name: "Qatar", quality: "D" },
  { code: "CG", name: "Republic of Congo", quality: "D" },
  { code: "RO", name: "Romania", quality: "C" },
  { code: "RU", name: "Russia", quality: "D" },
  { code: "RW", name: "Rwanda", quality: "D" },
  { code: "KN", name: "Saint Kitts and Nevis", quality: "D" },
  { code: "LC", name: "Saint Lucia", quality: "D" },
  { code: "VC", name: "Saint Vincent and the Grenadines", quality: "D" },
  { code: "WS", name: "Samoa", quality: "D" },
  { code: "SM", name: "San Marino", quality: "D" },
  { code: "ST", name: "Sao Tome and Principe", quality: "D" },
  { code: "SA", name: "Saudi Arabia", quality: "D" },
  { code: "SN", name: "Senegal", quality: "D" },
  { code: "RS", name: "Serbia", quality: "D" },
  { code: "SC", name: "Seychelles", quality: "D" },
  { code: "SL", name: "Sierra Leone", quality: "D" },
  { code: "SG", name: "Singapore", quality: "B" },
  { code: "SK", name: "Slovakia", quality: "C" },
  { code: "SI", name: "Slovenia", quality: "C" },
  { code: "SB", name: "Solomon Islands", quality: "D" },
  { code: "SO", name: "Somalia", quality: "D" },
  { code: "ZA", name: "South Africa", quality: "D" },
  { code: "KR", name: "South Korea", quality: "D" },
  { code: "ES", name: "Spain", quality: "B" },
  { code: "LK", name: "Sri Lanka", quality: "D" },
  { code: "SD", name: "Sudan", quality: "D" },
  { code: "SR", name: "Suriname", quality: "D" },
  { code: "SE", name: "Sweden", quality: "B" },
  { code: "CH", name: "Switzerland", quality: "B" },
  { code: "SY", name: "Syria", quality: "D" },
  { code: "TW", name: "Taiwan", quality: "B" },
  { code: "TJ", name: "Tajikistan", quality: "D" },
  { code: "TZ", name: "Tanzania", quality: "D" },
  { code: "TH", name: "Thailand", quality: "D" },
  { code: "TL", name: "Timor-Leste", quality: "D" },
  { code: "TG", name: "Togo", quality: "D" },
  { code: "TO", name: "Tonga", quality: "D" },
  { code: "TT", name: "Trinidad and Tobago", quality: "D" },
  { code: "TN", name: "Tunisia", quality: "D" },
  { code: "TR", name: "Turkey", quality: "D" },
  { code: "TM", name: "Turkmenistan", quality: "D" },
  { code: "TV", name: "Tuvalu", quality: "D" },
  { code: "UG", name: "Uganda", quality: "D" },
  { code: "UA", name: "Ukraine", quality: "D" },
  { code: "AE", name: "United Arab Emirates", quality: "C" },
  { code: "GB", name: "United Kingdom", quality: "C" },
  { code: "US", name: "United States", quality: "A" },
  { code: "UY", name: "Uruguay", quality: "D" },
  { code: "UZ", name: "Uzbekistan", quality: "D" },
  { code: "VU", name: "Vanuatu", quality: "D" },
  { code: "VE", name: "Venezuela", quality: "D" },
  { code: "VN", name: "Vietnam", quality: "D" },
  { code: "YE", name: "Yemen", quality: "D" },
  { code: "ZM", name: "Zambia", quality: "D" },
  { code: "ZW", name: "Zimbabwe", quality: "D" },
];
export const COUNTRIES = [...COUNTRIES_RAW].sort((a, b) => a.name.localeCompare(b.name));

/** Search countries by a query string (case-insensitive). */
export function searchCountries(query: string): typeof COUNTRIES {
  if (!query) return COUNTRIES;
  const q = query.toLowerCase();
  return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q);
}

/** Employment size bands — what we expose in the navigator. */
export const SIZE_BANDS = [
  { id: "1", label: "Solo (1 person)" },
  { id: "2-9", label: "Very small (2–9 employees)" },
  { id: "10-49", label: "Small (10–49 employees)" },
  { id: "50-249", label: "Medium (50–249 employees)" },
  { id: "250+", label: "Large (250+ employees)" },
];

/** Search industries by query (matches name OR any keyword OR example). */
export function searchIndustries(query: string, sectorFilter?: string): Industry[] {
  let pool = INDUSTRIES;
  if (sectorFilter) pool = pool.filter((i) => i.sector_id === sectorFilter);
  if (!query) return pool;
  const q = query.toLowerCase();
  return pool.filter((i) => {
    if (i.name.toLowerCase().includes(q)) return true;
    if (i.keywords.some((k) => k.includes(q))) return true;
    if (i.examples.some((e) => e.toLowerCase().includes(q))) return true;
    return false;
  });
}
