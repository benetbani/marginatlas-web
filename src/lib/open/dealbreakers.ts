/**
 * src/lib/open/dealbreakers.ts
 *
 * The one condition that has to be true before you open.
 *
 * For a small set of businesses there is a single condition that dominates the
 * whole decision: get it wrong and nothing else on the page can save you. For
 * those, and ONLY those, we surface a quiet "do not open unless ..." line on the
 * cost-to-open page. Most businesses have no such single make-or-break gate, so
 * they return null here and the page shows nothing.
 *
 * Keys are canonical industry ids (the same ids industryToSlug keys on, the same
 * cell.industry_id the opening builder already resolves). Verified to exist in
 * src/lib/taxonomy/industries.json. We deliberately do NOT list every business:
 * a dealbreaker line on a page that has no real dealbreaker would be noise.
 *
 * The conditions are honest and directional, written in the same warm,
 * plain-spoken voice as the rest of the page. No em-dashes, no source-agency
 * names, tokens-only on the render side.
 */

/**
 * Per-industry dealbreaker conditions, keyed by canonical industry id.
 *
 * Each value is the tail of the sentence "Do not open unless ...", so it reads
 * as one clean line when the prefix is added at the render site.
 */
const DEALBREAKERS: Record<string, string> = {
  // Hospitality and food: footfall and the rent ratio are the whole game.
  restaurants:
    "you can secure a high-footfall location at rent under about 12% of sales",
  cafes_coffee: "you have steady daytime foot traffic",

  // Licensed drinking venues live or die on the license itself.
  bars_nightclubs: "you can actually get the liquor license",

  // Lodging is a heavy fixed base that only occupancy can carry.
  hotels_lodging:
    "you have the rooms and the occupancy to cover a heavy fixed base",

  // Membership businesses: retention above churn is the survival line.
  sports_fitness: "you can hold member retention above the churn line",

  // Licensed clinical trades: the license and the fit-out capital come first.
  dental_practices: "you have the license and the fit-out capital up front",
  doctors_clinics: "you have the license and the fit-out capital up front",
  veterinary_pet_care: "you have the license and the fit-out capital up front",

  // Childcare is gated by ratios and licensing before anything else.
  childcare_social: "you can meet the staff ratios and the licensing",

  // Pharmacies cannot trade without the permit.
  independent_pharmacy: "you can secure the license and permit",

  // Chair-based beauty services: the chairs have to stay booked.
  hairdressers_beauty: "you can keep the chairs booked",
  hair_salons_full: "you can keep the chairs booked",
  barbershops: "you can keep the chairs booked",
};

/**
 * The dealbreaker condition for an industry, or null when the business has no
 * single dominating condition. Returning null is the common case by design:
 * most pages render nothing.
 *
 * @param industryId canonical industry id (e.g. "restaurants"); a slug, an
 *   unknown id, null, or undefined all return null.
 */
export function dealbreakerFor(
  industryId: string | null | undefined,
): string | null {
  if (!industryId) return null;
  return DEALBREAKERS[industryId] ?? null;
}
