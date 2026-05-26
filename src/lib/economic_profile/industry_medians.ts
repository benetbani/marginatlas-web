/**
 * src/lib/economic_profile/industry_medians.ts
 *
 * Goldmines Wave 3 — wire data/quality/industry_medians_v1.json into
 * the render layer.
 *
 * The file contains the GLOBAL median revenue per firm for 44
 * industries (across 87 countries) plus per-country medians. It was
 * built as a cross-check against extrapolated cells and was sitting
 * unread on disk (0 references in src/).
 *
 * This module makes it queryable so cell pages can use the verified
 * industry median as a sanity anchor when extrapolated values look
 * suspicious, or as a fallback when no per-country value exists.
 *
 * Public API:
 *   getIndustryGlobalMedian(industryId): number | null
 *   getIndustryCountryMedian(industryId, iso2): number | null
 *   getIndustryAnchorRevenue(industryId, iso2): number | null
 *     - Prefers per-country, falls back to global.
 */

import mediansJson from "../../../data/quality/industry_medians_v1.json";

type IndustryEntry = {
  global_median: number;
  country_medians: Record<string, number>;
};

type MediansFile = {
  generated_at: string;
  industries: Record<string, IndustryEntry>;
};

const FILE = mediansJson as unknown as MediansFile;

/**
 * Global median revenue per firm (USD per year) for an industry,
 * across all countries with primary data. Returns null when the
 * industry has no entry in the file.
 */
export function getIndustryGlobalMedian(
  industryId: string | null | undefined,
): number | null {
  if (!industryId) return null;
  const e = FILE.industries[industryId];
  return e?.global_median ?? null;
}

/**
 * Country-specific median revenue per firm (USD per year) for an
 * industry × country pair. Returns null when the pair has no entry.
 */
export function getIndustryCountryMedian(
  industryId: string | null | undefined,
  iso2: string | null | undefined,
): number | null {
  if (!industryId || !iso2) return null;
  const e = FILE.industries[industryId];
  return e?.country_medians?.[iso2.toUpperCase()] ?? null;
}

/**
 * Best anchor revenue for an industry × country tuple.
 *
 * Priority:
 *   1. Country-specific median (when available).
 *   2. Global median (the cross-country anchor).
 *   3. null.
 *
 * Used by the cell page as a sanity check against the modeled value
 * and as a fallback when the modeled value is suppressed by the
 * plausibility floor.
 */
export function getIndustryAnchorRevenue(
  industryId: string | null | undefined,
  iso2: string | null | undefined,
): number | null {
  const c = getIndustryCountryMedian(industryId, iso2);
  if (c != null) return c;
  return getIndustryGlobalMedian(industryId);
}

/** Count of industries in the source file. For audit + verify gate. */
export function getCoveredIndustryCount(): number {
  return Object.keys(FILE.industries).length;
}

/** Industry IDs in the file. For audit + verify gate. */
export function getCoveredIndustryIds(): string[] {
  return Object.keys(FILE.industries);
}
