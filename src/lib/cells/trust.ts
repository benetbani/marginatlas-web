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
 * helper centralises the FULL guard, first copied verbatim from the
 * across-cities builder, and every surface that resolves an arbitrary cell
 * uses it, so they all agree on what "trustworthy" means. There is no second
 * gate anywhere: a surface that wants a different answer changes this one.
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
 *      industry_id (guards the friendly-slug to NAICS misroute);
 *   6. ITS HEADLINE REVENUE WAS READ OFF THE ROW, NOT SUPPLIED (`_revenueFilled`
 *      not set). Added 2026-09-19 (QUEUE trust:revenue-filled, launch-blocking).
 *      A row that holds a firm count and no revenue of its own gets a headline
 *      from fillMissingFields (src/lib/cells/fill_defaults.ts), a per-industry,
 *      per-country anchor: one ladder of city constants times a trade base
 *      (Amsterdam and Toronto 725,000, Berlin 700,000, London 675,000, Paris
 *      650,000, Tokyo 600,000, Madrid and Barcelona 500,000) or the trade's
 *      global median shared to the cent (restaurants in every European city
 *      and Tokyo at 433,168.58). The row's tier and level say where the FIRM
 *      COUNT came from, so guards 3 and 4 pass it, and until this guard the
 *      trade page printed the engine's take-home over that anchor as the
 *      city's own figure. Measured by plan step 34's third dispatch over the
 *      fifteen-city slate times the 243 trades: of 1,029 rows the five guards
 *      passed, 945 were filled and 22 more sat on the margin clamp's floor;
 *      New York holds a revenue of its own on 48 trades and London's curated
 *      entry covers 14. A fill value is withheld (MODEL.md PART 9 clause 46,
 *      R11), so a filled cell is not a measurement and is not trusted. The
 *      marker is transient and set only by fillMissingFields, which the
 *      accessor runs on every resolved row, so a cell that reaches a surface
 *      without it either carried its own revenue or had it suppressed
 *      (`_revenueSuppressed`, a null revenue, which the surfaces dash).
 *
 * Curated London is tier P at lad level; its rows are filled, so the gate
 * refuses them too, and the curated entry (getLondonEntry) is the one path by
 * which a London figure still prints: cell_view.ts's `moneyShown` reads the
 * entry first and this gate second.
 *
 * WHAT THIS GATE STILL CANNOT SEE: a margin the clamp raised to its floor
 * (margin_floor.ts). That is the engine's business, not the row's, and
 * cell_view.ts withholds the money on it beside this gate (`netMarginFloored`).
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import type { Cell } from "@/lib/cells";

/**
 * True when `cell` is a real, local, non-synthetic measurement of the expected
 * activity whose headline revenue is its own, false otherwise. The conditions
 * are the across-cities comparison's (industry_id, is_synthetic, coverage_tier
 * "X", geo_level "country") plus the fill mark (`_revenueFilled`), so every
 * surface that gates an arbitrary-cell read shares one definition of
 * "trustworthy".
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
  if (cell._revenueFilled === true) return false;
  return true;
}
