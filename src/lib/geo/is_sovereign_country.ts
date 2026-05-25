/**
 * is_sovereign_country - single source of truth for "is this code a
 * country I should put into a countries chart".
 *
 * Returns false for:
 *   - US states (CA, NY, TX, etc.) when they collide with ISO2 codes
 *   - cities and city slugs (madrid, sao-paulo, mexico-city, ...)
 *   - sub-national region slugs (es511, de21, mx-roo, ...)
 *   - ISO3 codes (USA, GBR, DEU, ...) leaking from non-cleaned data
 *   - World Bank aggregates (EUU, AFE, WLD, OECD, ...)
 *   - empty / null / "unknown"
 *
 * Returns true ONLY for ISO2 codes that appear in src/lib/taxonomy
 * COUNTRIES. This is the canonical set of sovereign countries the
 * site treats as peers in "across the world" comparisons.
 *
 * v34 sanity sweep section 5 + section 1. Used to dedupe and purge
 * city/state contamination from every "top countries" / "across
 * the world" view.
 */

import { COUNTRIES } from "../taxonomy";

// Build a Set of valid sovereign ISO2 codes from the COUNTRIES
// taxonomy. This is the ONLY definition we trust.
const SOVEREIGN_ISO2: Set<string> = new Set(
  COUNTRIES.map((c) => c.code.toUpperCase()),
);

/** True if `code` is a sovereign ISO2 in our taxonomy. False for
 * cities, US states, ISO3, aggregates, empty, or unknown. */
export function isSovereignCountry(code: string | null | undefined): boolean {
  if (!code) return false;
  const upper = String(code).trim().toUpperCase();
  if (upper.length !== 2) return false;
  return SOVEREIGN_ISO2.has(upper);
}

/** Filter an array of rows to only those whose extracted code is a
 * sovereign country. Used to pipe-clean every "across the world" /
 * "top countries" query result. */
export function filterToCountries<T>(
  rows: T[],
  getCode: (r: T) => string | null | undefined,
): T[] {
  return rows.filter((r) => isSovereignCountry(getCode(r)));
}

/** Dedupe an array of rows by their country code (case-insensitive).
 * Keeps the FIRST occurrence. Fixes the "Denmark x3" bug visible on
 * the auto dealers industry page. */
export function dedupeByCountry<T>(
  rows: T[],
  getCode: (r: T) => string | null | undefined,
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const r of rows) {
    const c = getCode(r);
    if (!c) continue;
    const upper = String(c).trim().toUpperCase();
    if (seen.has(upper)) continue;
    seen.add(upper);
    out.push(r);
  }
  return out;
}

/** Convenience: filter AND dedupe in one step. The default behaviour
 * for any "top countries" / "across the world" query. */
export function purifyCountries<T>(
  rows: T[],
  getCode: (r: T) => string | null | undefined,
): T[] {
  return dedupeByCountry(filterToCountries(rows, getCode), getCode);
}
