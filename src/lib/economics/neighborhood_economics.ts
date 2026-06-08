/**
 * neighborhood_economics.ts
 *
 * Per-(city, neighborhood) prime commercial streets and local spend.
 *
 * The data file is data/economics/neighborhood_economics_v1.json, a map keyed
 * `${citySlug}.${neighborhoodSlug}` -> { prime_streets, notes }. Each street
 * carries a name and a one-line "sells" description; rent_vs_city and
 * spend_per_visit_usd are optional and self-omit when the pipeline has not
 * filled them yet. The loader is pure and synchronous (static JSON, no DB), so
 * the neighborhood page can read it during the server render.
 *
 * Mirrors the neighborhood_flavor loader shape: returns null when the pair has
 * no entry, so the caller (NeighborhoodOverview) can silently omit the section.
 */
import economicsJson from "../../../data/economics/neighborhood_economics_v1.json";

export type NeighborhoodStreet = {
  name: string;
  sells: string;
  rent_vs_city?: number;
  spend_per_visit_usd?: number;
};

export type NeighborhoodEconomics = {
  prime_streets: NeighborhoodStreet[];
  notes?: string;
};

const FILE = economicsJson as unknown as {
  version: string;
  neighborhoods: Record<string, NeighborhoodEconomics>;
};

const NEIGHBORHOODS = FILE.neighborhoods;

/**
 * Look up the prime-streets + spend record for a (city, neighborhood) pair.
 * Returns null when absent (no entry, or a malformed entry without streets).
 */
export function getNeighborhoodEconomics(
  citySlug: string,
  neighborhoodSlug: string,
): NeighborhoodEconomics | null {
  const entry = NEIGHBORHOODS[`${citySlug}.${neighborhoodSlug}`];
  if (!entry || !Array.isArray(entry.prime_streets)) return null;
  return entry;
}
