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
// keeps the first up-to-6 that have real flavor data, across distinct cities for
// variety. All slugs must exist in data/cities/neighborhood_flavor_v1.json.
const CANDIDATES: { citySlug: string; hood: string; name: string; city: string }[] = [
  { citySlug: "new-york", hood: "queens",      name: "Queens",       city: "New York" },
  { citySlug: "paris",    hood: "marais",      name: "Le Marais",    city: "Paris" },
  { citySlug: "tokyo",    hood: "shitamachi",  name: "Shitamachi",   city: "Tokyo" },
  { citySlug: "london",   hood: "east-london", name: "East London",  city: "London" },
  { citySlug: "new-york", hood: "manhattan",   name: "Manhattan",    city: "New York" },
  { citySlug: "paris",    hood: "montmartre",  name: "Montmartre",   city: "Paris" },
  { citySlug: "london",   hood: "west-london", name: "West London",  city: "London" },
  { citySlug: "new-york", hood: "brooklyn",    name: "Brooklyn",     city: "New York" },
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
