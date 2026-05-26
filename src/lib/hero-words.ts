/**
 * Plan v13 Wave 4e — rotating hero headline words.
 * Curated by founder. Cities ordered to alternate continents/feel.
 * Businesses are popular, recognizable SMB types.
 *
 * 2026-05-26: founder tightened the lists to avoid 2-word entries that
 * forced the H1 to wrap to a second line on desktop. Replaced "New
 * York" → "Chicago", "Barcelona" → "Shanghai"; dropped "coffee shop",
 * "dental clinic", "flower shop", "grocery shop" (already covered by
 * "bakery", "barber", "pharmacy" — short single words). All remaining
 * tokens are <= 9 characters so the reserved slot is compact and the
 * H1 never reflows.
 */

export const HERO_CITIES = [
  "London",
  "Paris",
  "Istanbul",
  "Tokyo",
  "Sydney",
  "Berlin",
  "Milan",
  "Mumbai",
  "Dubai",
  "Lagos",
  "Chicago",
  "Shanghai",
] as const;

export const HERO_BUSINESSES = [
  "bakery",
  "pharmacy",
  "barber",
  "hotel",
  "restaurant",
  "boutique",
  "butcher",
  "gym",
] as const;
