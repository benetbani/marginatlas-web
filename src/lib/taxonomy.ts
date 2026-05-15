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
  isic_sections: string[];
  examples: string[];
  icon: string;
  order: number;
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

/** Sectors grouped — for the navigator dropdown. */
export const SECTORS_ORDERED = [...SECTORS].sort((a, b) => a.order - b.order);

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

/** Resolve an industry's parent (returns the industry itself if no parent). */
export function resolveToMeasuredIndustry(ind: Industry | null | undefined): Industry | null {
  if (!ind) return null;
  if (ind.parent_id) {
    const parent = INDUSTRY_BY_ID[ind.parent_id];
    if (parent) return parent;
  }
  return ind;
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

/** Country list — what we expose in the navigator. Quality-ranked. */
export const COUNTRIES: { code: string; name: string; quality: "A" | "B" | "C" | "D" }[] = [
  { code: "US", name: "United States", quality: "A" },
  { code: "CA", name: "Canada", quality: "B" },
  { code: "AU", name: "Australia", quality: "B" },
  { code: "DE", name: "Germany", quality: "B" },
  { code: "FR", name: "France", quality: "B" },
  { code: "IT", name: "Italy", quality: "B" },
  { code: "ES", name: "Spain", quality: "B" },
  { code: "NL", name: "Netherlands", quality: "B" },
  { code: "PL", name: "Poland", quality: "B" },
  { code: "SE", name: "Sweden", quality: "B" },
  { code: "BE", name: "Belgium", quality: "B" },
  { code: "AT", name: "Austria", quality: "B" },
  { code: "PT", name: "Portugal", quality: "B" },
  { code: "IE", name: "Ireland", quality: "B" },
  { code: "CH", name: "Switzerland", quality: "B" },
  { code: "NO", name: "Norway", quality: "B" },
  { code: "FI", name: "Finland", quality: "B" },
  { code: "DK", name: "Denmark", quality: "B" },
  { code: "GR", name: "Greece", quality: "C" },
  { code: "CZ", name: "Czechia", quality: "C" },
  { code: "HU", name: "Hungary", quality: "C" },
  { code: "RO", name: "Romania", quality: "C" },
  { code: "BG", name: "Bulgaria", quality: "C" },
  { code: "HR", name: "Croatia", quality: "C" },
  { code: "SK", name: "Slovakia", quality: "C" },
  { code: "SI", name: "Slovenia", quality: "C" },
  { code: "LT", name: "Lithuania", quality: "C" },
  { code: "LV", name: "Latvia", quality: "C" },
  { code: "EE", name: "Estonia", quality: "C" },
  { code: "LU", name: "Luxembourg", quality: "C" },
  { code: "CY", name: "Cyprus", quality: "C" },
  { code: "MT", name: "Malta", quality: "C" },
  { code: "IS", name: "Iceland", quality: "C" },
  { code: "JP", name: "Japan", quality: "C" },
  { code: "BR", name: "Brazil", quality: "C" },
  { code: "SG", name: "Singapore", quality: "B" },
  { code: "AR", name: "Argentina", quality: "D" },
  { code: "GB", name: "United Kingdom", quality: "C" },
];

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
