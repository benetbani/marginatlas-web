/**
 * src/lib/cells/trust.ts
 *
 * The single trust gate for "resolve an arbitrary cell" reads.
 *
 * Several surfaces resolve a (place, activity) pair through getCellBySlug and
 * then decide whether the resolved cell is a REAL local measurement they can
 * stand behind, or a poisoned read that must self-omit. The across-cities
 * comparison (src/lib/markets/across_cities.ts) discovered that the weaker
 * homepage/extremes guard (right activity, not synthetic) is INSUFFICIENT:
 * cross-country extrapolated reads carry is_synthetic=false yet are stamped
 * coverage_tier="X", and a national aggregate can resolve under a city slug
 * with geo_level="country". Both slipped through and printed visibly-wrong
 * numbers (e.g. a Dubai "restaurants" read at $5M, $30M law firms). So this
 * helper centralises the FULL four-way guard, copied verbatim from the
 * across-cities builder, and every surface that resolves an arbitrary cell
 * uses it, so they all agree on what "trustworthy" means.
 *
 * A cell is TRUSTED only when every one of these holds:
 *   1. it resolved at all (not null);
 *   2. it is not synthesized (the always-render stand-in, is_synthetic);
 *   3. it is not the estimated/extrapolated tier (coverage_tier "X": both the
 *      synthesis path and every extrapolated_cells / sector-baseline path stamp
 *      "X"; real sub-national measurements are tier S or P);
 *   4. it is not a national aggregate resolved under a sub-national slug
 *      (geo_level "country");
 *   5. when an expected activity id is supplied, the cell carries exactly that
 *      industry_id (guards the friendly-slug to NAICS misroute).
 *
 * Curated London is tier P at lad level, so it is unaffected.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { Cell } from "@/lib/cells";

/**
 * True when `cell` is a real, local, non-synthetic measurement of the expected
 * activity, false otherwise. The conditions are exactly those the across-cities
 * comparison applies (industry_id, is_synthetic, coverage_tier "X",
 * geo_level "country"), so every surface that gates an arbitrary-cell read can
 * share one definition of "trustworthy".
 *
 * @param cell                The resolved cell, or null when nothing resolved.
 * @param expectedIndustryId  Optional. When given, the cell must carry exactly
 *                            this industry_id; omit it to skip the activity check
 *                            (e.g. when the caller already filtered by activity).
 */
export function isTrustedLocalCell(
  cell: Cell | null | undefined,
  expectedIndustryId?: string,
): boolean {
  if (!cell) return false;
  if (expectedIndustryId != null && cell.industry_id !== expectedIndustryId) {
    return false;
  }
  if (cell.is_synthetic) return false;
  if ((cell.coverage_tier ?? "").toUpperCase() === "X") return false;
  if (cell.geo_level === "country") return false;
  return true;
}
