/**
 * src/lib/markets/density_archetypes.ts
 *
 * A MODELED "typical firms per 10,000 residents" for the small-business
 * activities the site shows. It exists so competition density reads as one
 * consistent signal everywhere: where a place holds a trustworthy local firm
 * count plus a population, density is REAL (firms divided by residents per 10k);
 * where it does not, the board falls back to the per-industry archetype here, on
 * the SAME firms-per-10k scale, clearly labelled modeled. The two never use a
 * different unit, so a reader learns the number once and reads it on every page.
 *
 * These figures are directional, drawn from general industry knowledge of how
 * thick on the ground each trade tends to be in a developed urban market:
 * everyday food and grooming are dense (a coffee shop or a barber on every
 * block); professional and clinical practices are sparse (a handful of law
 * offices or dental surgeries per neighbourhood). They are NOT a measurement of
 * any one place, and the board says so on the row. A sensible default covers the
 * long tail of activities without a specific entry.
 *
 * Keyed by the activity's URL slug (the canonical industryToSlug output, e.g.
 * "restaurants", "cafes-coffee", "barbershops"), the same key the curated
 * London + survival archetypes use, so the three modeled lookups agree on their
 * key space. A by-industry-id helper resolves the id to its slug first, so the
 * cell board (which holds cell.industry_id) and the leaderboards (which hold the
 * slug) can both reach it.
 *
 * Pure module: a static table plus two pure lookups. No Supabase, no fs, no
 * runtime side effects, so it stays trivially testable and cannot trip the
 * layering gate. Constraint-safe: no em-dashes, no source-agency names, the
 * figure is a unit-free density (firms per 10k residents), not a currency value.
 */
import { industryToSlug } from "@/lib/taxonomy";
import { displayDensityPer10k } from "@/lib/finance/margin_floor";

/**
 * The modeled typical-density table, firms per 10,000 residents, keyed by
 * activity URL slug. Directional archetypes for a developed urban market, not a
 * per-place measurement. Grouped by how thick on the ground the trade tends to
 * be; the comment on each block is the reasoning, not a source.
 */
const DENSITY_ARCHETYPE_PER_10K: Record<string, number> = {
  // Everyday food and drink: a storefront on most blocks, the densest tier.
  restaurants: 18,
  "sit-down-restaurants": 9,
  "fast-casual-restaurants": 6,
  pizzerias: 4,
  "chicken-shops": 3,
  "cafes-coffee-shops": 12,
  "tea-houses-matcha-bars": 3,
  "bars-nightclubs": 6,
  "pubs-taverns": 7,
  "wine-bars": 3,
  "bakeries-retail": 6,
  "cake-shops-patisseries": 3,
  "pastry-dessert-shops": 3,
  "ice-cream-frozen-dessert-shops": 3,
  "food-trucks": 4,

  // Grooming and personal care: high-street regulars, repeat custom, dense.
  barbershops: 8,
  "hairdressers-beauty": 14,
  "hair-salons-full-service": 12,
  "nail-salons": 9,
  "brow-lash-studios": 3,
  "day-spas": 4,
  "med-spas-small": 2,
  "massage-therapy-clinics": 5,
  "tanning-salons": 2,
  "tattoo-piercing-studios": 3,

  // Everyday retail: groceries and convenience are common; specialty thins out.
  "grocery-stores": 10,
  "specialty-grocers-delis": 4,
  "wine-liquor-stores": 4,
  "cosmetics-beauty-shops": 3,
  "pharmacies-health-stores": 4,
  "independent-pharmacies": 3,
  "florist-shops": 4,
  "pet-stores": 2,
  "hardware-stores-local": 3,
  "clothing-boutiques": 4,
  "clothing-shoe-stores": 4,
  "jewelry-stores": 3,
  "furniture-stores": 2,
  "book-retailing": 2,
  "gas-stations": 5,

  // Trades and home services: many operators, but spread over a wide catchment.
  electricians: 7,
  plumbers: 7,
  "hvac-services": 5,
  roofers: 4,
  "painters-residential": 5,
  "landscaping-lawn-care": 8,
  "cleaning-services": 8,
  "residential-cleaning-services": 6,
  "pest-control-local": 3,
  locksmiths: 2,
  "junk-removal-small-moving": 3,
  "auto-repair-shops": 7,
  "auto-body-shops": 4,
  "electronics-phone-repair": 3,

  // Professional and clinical: sparse by nature, a few per neighbourhood.
  "legal-services": 5,
  "sole-practitioner-law-firms": 4,
  "accounting-tax": 6,
  "sole-practitioner-accountants": 4,
  "management-consulting": 5,
  "real-estate-agencies": 7,
  "independent-insurance-brokers": 4,
  "marketing-design-agencies": 4,
  "software-development": 3,
  "it-services-msps-small": 3,
  "web-mobile-dev-shops": 3,
  "engineering-architecture": 3,
  "dental-practices": 3,
  "doctors-clinics": 4,
  "physical-therapy-clinics": 3,
  "chiropractic-clinics": 2,
  "optometry-vision-centers": 2,
  "veterinary-pet-care": 2,
  "mental-health-practices-small": 3,

  // Fitness, learning, leisure: a moderate spread of local operators.
  "sports-fitness": 5,
  "yoga-pilates-studios": 4,
  "personal-training": 4,
  "martial-arts-dojos": 3,
  "dance-studios": 3,
  "tutoring-centers": 4,
  "music-schools-private-lessons": 3,
  "driving-schools": 2,
  "photography-studios": 4,
  "childcare-social-services": 5,
  "daycare-preschool": 5,

  // Lodging and laundry: relatively few sites per resident.
  "hotels-lodging": 2,
  "independent-hotels-inns": 2,
  "bed-breakfasts": 2,
  "dry-cleaning-laundry": 5,
};

/**
 * The modeled default for any activity without a specific entry above. A
 * moderate small-business density: not as thick as everyday food, not as sparse
 * as a specialist clinic. Keeps the long tail of activities on the same scale
 * rather than dashing.
 */
export const DENSITY_ARCHETYPE_DEFAULT_PER_10K = 4;

/**
 * Modeled typical firms-per-10k for an activity URL slug, or the moderate
 * default when no specific archetype is held. The figure passes through the same
 * display sanity cap the real density uses, so a modeled value can never sit
 * outside the band a real one is allowed to show. Always returns a finite,
 * directional number (never null), because the whole point is that the density
 * row stops dashing where we can reasonably estimate it.
 */
export function densityArchetypePer10kForSlug(
  slug: string | null | undefined,
): number {
  const raw =
    (slug ? DENSITY_ARCHETYPE_PER_10K[slug.toLowerCase()] : undefined) ??
    DENSITY_ARCHETYPE_DEFAULT_PER_10K;
  // The cap is generous (100 per 10k); every archetype is far below it, so this
  // is belt-and-braces, guaranteeing parity with the real-density display rule.
  return displayDensityPer10k(raw) ?? DENSITY_ARCHETYPE_DEFAULT_PER_10K;
}

/**
 * Modeled typical firms-per-10k for an industry id (e.g. "restaurants",
 * "cafes_coffee"), resolving the id to its URL slug first so callers that hold
 * the id (the cell board) and callers that hold the slug (the leaderboards)
 * reach the same table. Returns the moderate default for an unknown id.
 */
export function densityArchetypePer10k(
  industryId: string | null | undefined,
): number {
  if (!industryId) return DENSITY_ARCHETYPE_DEFAULT_PER_10K;
  return densityArchetypePer10kForSlug(industryToSlug(industryId));
}
