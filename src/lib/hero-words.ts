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

/* THE SLOTS' WIDTHS, BY DRAWN WIDTH (plan 2026-10-10, home reform, Task 2; the ship audit's 3.6, the critique's P0.2). A slot is as
   wide as its widest word, and the widest word is the one drawn widest, never the one with the most letters: measured from the
   Space Grotesk the site serves, weight 500, tight tracking, "Shanghai?" is 4.86em against "Chicago?" 4.32 and "Istanbul?" 4.29 (the
   letter count chose "Istanbul", and "Shanghai" touched the "?"), and "restaurant" is 4.93em against "pharmacy" 4.66.
   tests/home/hero_words.test.ts measures every word again from the font's advances, so a new word that draws wider fails it. */
export const HERO_WIDEST_CITY = "Shanghai";
export const HERO_WIDEST_BUSINESS = "restaurant";

/* THE HERO'S ONE TIMER (the critique's P0.3; WCAG 2.2.2: moving words beside a form must stop). Both words change together, a tick
   every 3.5 seconds, each change a quarter-second fade out and back in; twelve ticks in all, one lap of the cities. Ticks 1 to 11
   move both words on by one; tick 12 is the last fade, back to the first words ("restaurant", "London", the case the page answers),
   and the words stand still for good. src/components/spine/home/HeroWords.tsx runs it. */
export const HERO_TICK_MS = 3500;
export const HERO_FADE_MS = 250;
export const HERO_TICKS = HERO_CITIES.length;

/** The index both words show after `tick` ticks: the tick itself through the lap, the first words from its last tick on. */
export function heroIndexAt(tick: number): number {
  return tick > 0 && tick < HERO_TICKS ? tick : 0;
}
