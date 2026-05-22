/**
 * Plan v28 Lane C — popular-name overrides for geo headlines.
 *
 * Single source of truth for "what does the world call this place?"
 * Used by getCellBySlug() and every page-header label resolver to
 * ensure we never show Quintana Roo when the user expects Cancún.
 */
import overridesJson from "./popular_place_overrides.json";

const OVERRIDES = (overridesJson as { overrides: Record<string, string> }).overrides;

/**
 * Look up the popular name for an (iso2, geoSlug) pair.
 * Returns undefined if no override is registered — caller should use
 * the database-provided geo name in that case.
 */
export function getPopularPlaceName(iso2: string | null | undefined, geoSlug: string | null | undefined): string | undefined {
  if (!iso2 || !geoSlug) return undefined;
  const key = `${iso2.toLowerCase()}/${geoSlug.toLowerCase()}`;
  return OVERRIDES[key];
}

/**
 * Check whether a given (iso2, geoSlug) has an override registered.
 */
export function hasPopularPlaceOverride(iso2: string | null | undefined, geoSlug: string | null | undefined): boolean {
  return getPopularPlaceName(iso2, geoSlug) !== undefined;
}
