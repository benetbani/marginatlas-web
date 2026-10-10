/**
 * Rotating hero headline words.
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

/* "restaurant" first since his yes of 2026-10-09 (the home introduction's spec, section 5: order only): the server renders the first
   word, so the h1 asks "How much does a restaurant make in London?", the question the picker and the worked example answer. */
export const HERO_BUSINESSES = [
  "restaurant",
  "bakery",
  "pharmacy",
  "barber",
  "hotel",
  "boutique",
  "butcher",
  "gym",
] as const;
