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

/** Slug → industry_id (matches name slug or keyword). */
export function slugToIndustry(slug: string | null | undefined): Industry | null {
  if (!slug) return null;
  const s = slug.toLowerCase().replace(/-/g, " ");
  for (const ind of INDUSTRIES) {
    const nameSlug = ind.name.toLowerCase();
    if (nameSlug === s || nameSlug.includes(s)) return ind;
    if (ind.keywords.some((k) => k === s || k.includes(s) || s.includes(k))) return ind;
  }
  return null;
}

/** Build URL slug from an industry id or name. */
export function industryToSlug(industryId: string): string {
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return industryId;
  return ind.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    case "mixed_caution": return "Mixed — read with caution";
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
  furniture_home_stores: "grocery_stores",
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
  passenger_transport: "trucking_freight",
  // Manufacturing food adjacency
  catering: "food_beverage_mfg",
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

/** Plan v4.0 §2 — sector-level visibility gate. */
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
  { code: "AD", name: "Andorra", quality: "D" },
  { code: "AL", name: "Albania", quality: "D" },
  { code: "AR", name: "Argentina", quality: "D" },
  { code: "AT", name: "Austria", quality: "B" },
  { code: "AU", name: "Australia", quality: "B" },
  { code: "AZ", name: "Azerbaijan", quality: "D" },
  { code: "BE", name: "Belgium", quality: "B" },
  { code: "BG", name: "Bulgaria", quality: "C" },
  { code: "BR", name: "Brazil", quality: "C" },
  { code: "CA", name: "Canada", quality: "B" },
  { code: "CH", name: "Switzerland", quality: "B" },
  { code: "CY", name: "Cyprus", quality: "C" },
  { code: "CZ", name: "Czechia", quality: "C" },
  { code: "DE", name: "Germany", quality: "B" },
  { code: "DK", name: "Denmark", quality: "B" },
  { code: "EE", name: "Estonia", quality: "C" },
  { code: "ES", name: "Spain", quality: "B" },
  { code: "FI", name: "Finland", quality: "B" },
  { code: "FR", name: "France", quality: "B" },
  { code: "GB", name: "United Kingdom", quality: "C" },
  { code: "GE", name: "Georgia", quality: "D" },
  { code: "GR", name: "Greece", quality: "C" },
  { code: "HR", name: "Croatia", quality: "C" },
  { code: "HU", name: "Hungary", quality: "C" },
  { code: "IE", name: "Ireland", quality: "B" },
  { code: "IL", name: "Israel", quality: "D" },
  { code: "IS", name: "Iceland", quality: "C" },
  { code: "IT", name: "Italy", quality: "B" },
  { code: "JP", name: "Japan", quality: "C" },
  { code: "KZ", name: "Kazakhstan", quality: "D" },
  { code: "LI", name: "Liechtenstein", quality: "D" },
  { code: "LT", name: "Lithuania", quality: "C" },
  { code: "LU", name: "Luxembourg", quality: "C" },
  { code: "LV", name: "Latvia", quality: "C" },
  { code: "MC", name: "Monaco", quality: "D" },
  { code: "MT", name: "Malta", quality: "C" },
  { code: "MX", name: "Mexico", quality: "B" },
  { code: "NL", name: "Netherlands", quality: "B" },
  { code: "NO", name: "Norway", quality: "B" },
  { code: "PL", name: "Poland", quality: "B" },
  { code: "PT", name: "Portugal", quality: "B" },
  { code: "RO", name: "Romania", quality: "C" },
  { code: "RU", name: "Russia", quality: "D" },
  { code: "SE", name: "Sweden", quality: "B" },
  { code: "SG", name: "Singapore", quality: "B" },
  { code: "SI", name: "Slovenia", quality: "C" },
  { code: "SK", name: "Slovakia", quality: "C" },
  { code: "SM", name: "San Marino", quality: "D" },
  { code: "US", name: "United States", quality: "A" },
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
