/**
 * neighborhood_cards.ts -- resolves the homepage neighborhood cards from the
 * real flavor data (src/lib/cities/neighborhood_flavor.ts). No invented detail:
 * a candidate with no flavor entry is dropped. Pure (reads a static JSON import).
 */
import { getNeighborhoodFlavor } from "@/lib/cities/neighborhood_flavor";

export type NeighborhoodCard = {
  name: string;        // display name
  city: string;        // display city
  href: string;        // /cities/{citySlug}/neighborhoods
  knownFor: string;    // signature businesses, joined
  dontMiss: string;    // the one specific deeper detail
  priceTier: string;   // luxury | expensive | mid | affordable | budget
};

// Candidate (citySlug, neighborhoodSlug, display name, display city). The loader
// keeps the first up-to-6 that have real flavor data. All slugs must exist in
// data/cities/neighborhood_flavor_v1.json.
//
// ONE DISTRICT PER CITY, BY CONSTRUCTION. This list used to name eight districts
// across four cities, New York and Paris twice each, and the comment above it
// claimed "across distinct cities for variety" while the loader did nothing of
// the kind. It simply took the first six, so the band rendered Queens and
// Manhattan side by side, and Le Marais next to Montmartre. Making the list
// itself one per city is what actually holds the rule, rather than a loader
// check that has to be remembered.
//
// NO PHOTOGRAPHS, DELIBERATELY. An earlier pass ordered this list by which
// cities had an editorial hero in city_heroes. Those heroes are Pexels stock
// photographs and "no stock imagery" is a hard constraint here, so the card
// head is a designed field for every city and the ordering below owes nothing
// to imagery. See the comment in NeighborhoodCards.tsx.
//
// THE SPREAD IS THE POSITION. Six slots now read Paris, Tokyo, Berlin, Shenzhen,
// New York and Mexico City: two in Europe, two in Asia, two in the Americas. The
// previous four were three Western capitals and Tokyo, on the homepage of an
// atlas whose third deepest country is Mexico. London sits seventh as the
// standby, so it fills in if a city above it ever loses its flavor entry.
//
// PRICE TIER IS PART OF THE VARIETY. Each card prints its tier, and the first
// pass at this list returned Expensive four times out of six, which reads as one
// kind of place seen six times. These six run luxury, expensive, expensive, mid,
// mid, affordable. The range is the honest picture of what the atlas covers, and
// a reader deciding where to open something needs the cheap end on screen as
// much as the dear end.
//
// WHY THESE DISTRICTS AND NOT THE POSTCARD ONES. Two were chosen against the
// obvious pick because the detail is about commerce rather than scenery:
// Huaqiangbei in Luohu is the largest electronics wholesale market in the world,
// and Masaryk in Polanco is the most expensive shopping street in Latin America.
// Both say more on a business atlas than a skyline view does. Kreuzberg was
// dropped despite being the better known Berlin name because its one detail
// describes the East Side Gallery, which is across the river in Friedrichshain,
// and a "don't miss" that sits in another district undercuts the card it heads.
const CANDIDATES: { citySlug: string; hood: string; name: string; city: string }[] = [
  { citySlug: "paris",       hood: "marais",          name: "Le Marais",       city: "Paris" },
  { citySlug: "tokyo",       hood: "shitamachi",      name: "Shitamachi",      city: "Tokyo" },
  { citySlug: "berlin",      hood: "prenzlauer-berg", name: "Prenzlauer Berg", city: "Berlin" },
  { citySlug: "shenzhen",    hood: "luohu",           name: "Luohu",           city: "Shenzhen" },
  { citySlug: "new-york",    hood: "bronx",           name: "The Bronx",       city: "New York" },
  { citySlug: "mexico-city", hood: "polanco",         name: "Polanco",         city: "Mexico City" },
  { citySlug: "london",      hood: "east-london",     name: "East London",     city: "London" },
];

function titleCaseTier(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function loadNeighborhoodCards(): NeighborhoodCard[] {
  const out: NeighborhoodCard[] = [];
  for (const c of CANDIDATES) {
    if (out.length >= 6) break;
    const f = getNeighborhoodFlavor(c.citySlug, c.hood);
    if (!f) continue; // no real data -> drop, never invent
    const knownFor = (f.signature_businesses || []).slice(0, 3).join(", ");
    if (!knownFor || !f.dont_miss) continue;
    out.push({
      name: c.name,
      city: c.city,
      href: `/cities/${c.citySlug}/neighborhoods`,
      knownFor,
      dontMiss: f.dont_miss,
      priceTier: titleCaseTier(f.price_tier),
    });
  }
  return out;
}
