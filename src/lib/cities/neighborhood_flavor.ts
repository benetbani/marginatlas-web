/**
 * Neighborhood flavor loader.
 *
 * Provides the deep editorial data per neighborhood: character paragraph,
 * signature businesses, food scene, demographic skew, walkability,
 * history note, price tier, and a single "don't-miss" detail.
 *
 * Used by /cities/{slug}/neighborhoods and the neighborhood cell page.
 * Returns undefined when a neighborhood has no flavor data yet — the
 * caller should fall back gracefully to the basic neighborhood metadata.
 */
import flavorJson from "../../../data/cities/neighborhood_flavor_v1.json";

export type NeighborhoodFlavor = {
  character_paragraph: string;
  signature_businesses: string[];
  food_scene: string;
  demographic_skew: string;
  walkability: "high" | "moderate" | "low";
  history_note: string;
  price_tier: "luxury" | "expensive" | "mid" | "affordable" | "budget";
  dont_miss: string;
};

const FILE = flavorJson as unknown as {
  version: string;
  neighborhoods: Record<string, Record<string, NeighborhoodFlavor>>;
};

const FLAVORS = FILE.neighborhoods;

/** Look up flavor for a (city, neighborhood) pair. Returns undefined if absent. */
export function getNeighborhoodFlavor(
  citySlug: string,
  neighborhoodSlug: string,
): NeighborhoodFlavor | undefined {
  const city = FLAVORS[citySlug];
  if (!city) return undefined;
  return city[neighborhoodSlug];
}

/** List every city that has at least one populated flavor entry. */
export function listFlavoredCities(): string[] {
  return Object.keys(FLAVORS).sort();
}

/** Count of populated neighborhoods. Used by audit and coverage scripts. */
export function flavorCoverageCount(): {
  cities: number;
  neighborhoods: number;
} {
  let nb = 0;
  for (const city of Object.values(FLAVORS)) {
    nb += Object.keys(city).length;
  }
  return { cities: Object.keys(FLAVORS).length, neighborhoods: nb };
}
