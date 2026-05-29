/**
 * industry_resolution.ts - the bridge between the URL industry vocabulary,
 * the website taxonomy, and the industry_id vocabulary the DATA tables
 * actually use.
 *
 * WHY THIS EXISTS (data activation, 2026-05-29):
 * A reachability audit found that 39% of regional_cells and 46% of
 * extrapolated_cells rows were unreachable. The query functions resolved
 * a URL slug to its MEASURED PARENT (resolveToMeasuredIndustry) BEFORE
 * querying, so a precise sub-niche id present in the DB (e.g.
 * doctors_clinics) was collapsed to a parent (veterinary_pet_care) and
 * the query missed the real row. Separately, ~15 coarse "legacy" ids in
 * the data (metal_products_mfg, food_beverage_mfg, ...) are not in the
 * current taxonomy at all and need an explicit crosswalk.
 *
 * This module produces an ORDERED candidate list of industry_ids to try,
 * exact id first, so the query hits the precise row when it exists and
 * only falls back to the parent on a genuine miss. resolveToMeasuredIndustry
 * itself is left untouched (it is pure and used elsewhere).
 */
import {
  INDUSTRY_BY_ID,
  slugToIndustry,
  resolveToMeasuredIndustry,
  type Industry,
} from "../taxonomy";

/**
 * Legacy data-table industry_ids that are NOT in the current taxonomy,
 * mapped to their closest measured taxonomy id. Every target verified to
 * exist in industries.json (2026-05-29). These are coarser groupings from
 * the load-time vocabulary; the data still lives under the legacy id, so
 * we must query the legacy id AND show the taxonomy equivalent for naming.
 */
export const LEGACY_DB_TO_TAXONOMY: Record<string, string> = {
  metal_products_mfg: "fabricated_metal_mfg",
  food_beverage_mfg: "food_mfg",
  wood_paper_mfg: "wood_products_mfg",
  property_leasing: "real_estate_leasing",
  furniture_other_mfg: "furniture_mfg",
  auto_dealers_gas: "auto_dealers",
  textile_apparel_mfg: "textiles_fabric_mfg",
  broadcasting_telecom: "broadcasting",
  crop_farming: "grain_farming",
  media_publishing: "news_periodical_publishing",
  postal_courier: "postal_service",
  events_entertainment: "performing_arts",
  investment_securities: "securities_brokerage",
  furniture_home_stores: "furniture_stores",
  passenger_transport: "transit_ground_passenger",
};

/** Reverse: taxonomy id -> legacy DB ids that should also be queried. */
export const TAXONOMY_TO_LEGACY_DB: Record<string, string[]> = (() => {
  const m: Record<string, string[]> = {};
  for (const [legacy, tax] of Object.entries(LEGACY_DB_TO_TAXONOMY)) {
    (m[tax] ??= []).push(legacy);
  }
  return m;
})();

/** Normalize a slug the same way the taxonomy layer does. */
function normalizeSlug(slug: string): string {
  return slug
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug form of each legacy id (underscores become dashes), for direct URL match. */
const LEGACY_SLUG_TO_DB_ID: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const legacy of Object.keys(LEGACY_DB_TO_TAXONOMY)) {
    m[normalizeSlug(legacy)] = legacy;
  }
  return m;
})();

/**
 * Ordered, de-duplicated list of industry_id values to query for a given
 * URL industry slug, highest-priority first:
 *   1. exact taxonomy id the slug maps to (fixes the collapse bug)
 *   2. legacy DB ids mapping to that taxonomy id (reverse crosswalk)
 *   3. a directly-matched legacy slug's DB id and its taxonomy id
 *   4. the measured parent (the original behavior, as last resort)
 * The query layer tries each in order; the first with data wins, so the
 * precise row is preferred and the parent is only a fallback.
 */
export function industryQueryCandidates(industrySlug: string): string[] {
  const out: string[] = [];
  const push = (id: string | null | undefined) => {
    if (id && !out.includes(id)) out.push(id);
  };

  const norm = normalizeSlug(industrySlug);

  // Direct legacy-slug match (e.g. "metal-products-mfg" -> metal_products_mfg).
  const legacyDirect = LEGACY_SLUG_TO_DB_ID[norm];
  if (legacyDirect) {
    push(legacyDirect);
    push(LEGACY_DB_TO_TAXONOMY[legacyDirect]);
  }

  // Taxonomy resolution.
  const raw = slugToIndustry(industrySlug);
  if (raw) {
    push(raw.id); // EXACT id first - the core fix.
    for (const legacy of TAXONOMY_TO_LEGACY_DB[raw.id] ?? []) push(legacy);
    const parent = resolveToMeasuredIndustry(raw);
    push(parent?.id); // parent fallback, last.
  }

  return out;
}

/**
 * The taxonomy Industry to use for DISPLAY (naming, sector, examples)
 * given a URL slug, even when the underlying DB row uses a legacy id.
 * Prefers the exact taxonomy match; for a legacy slug returns the mapped
 * taxonomy industry; otherwise falls back to the measured parent.
 */
export function resolveDisplayIndustry(industrySlug: string): Industry | null {
  const raw = slugToIndustry(industrySlug);
  if (raw) return raw;
  const norm = normalizeSlug(industrySlug);
  const legacyDirect = LEGACY_SLUG_TO_DB_ID[norm];
  if (legacyDirect) {
    const taxId = LEGACY_DB_TO_TAXONOMY[legacyDirect];
    if (taxId && INDUSTRY_BY_ID[taxId]) return INDUSTRY_BY_ID[taxId];
  }
  return null;
}
