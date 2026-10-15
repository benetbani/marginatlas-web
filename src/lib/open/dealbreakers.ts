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
 * The conditions are words, written in the same warm, plain-spoken voice as
 * the rest of the page, and carry no figure. No em-dashes, no source-agency
 * names, tokens-only on the render side.
 *
 * NO TYPED FIGURE (release 3 job A, 2026-10-16). The restaurants line read "at
 * rent under about 12% of sales", a threshold typed here with no source, and
 * every line ended "Directional, and worth being honest with yourself about
 * before anything else.", a method disclaimer the copy rules ban. The threshold
 * left the words, and where the trade's shard holds its rent share as a held
 * cost driver (`cost_structure.cost_drivers.<row>.pct_of_revenue`, tagged held)
 * the page prints that figure in the line under the condition, stamped
 * (dealbreakerFigure below); the disclaimer left every line.
 */
import { industryRows } from "@/lib/facts/industry_shard";
import type { Provenance } from "@/lib/spine/provenance";

/**
 * Per-industry dealbreaker conditions, keyed by canonical industry id.
 *
 * Each value is the tail of the sentence "Do not open unless ...", so it reads
 * as one clean line when the prefix is added at the render site.
 */
const DEALBREAKERS: Record<string, string> = {
  // Hospitality and food: footfall and the rent ratio are the whole game.
  restaurants: "you can secure a high-footfall location",
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

/** The shard row whose share of sales stands under a trade's condition: the rent line, for the trades whose condition is the location. */
const HELD_FIGURE: Record<string, string> = { restaurants: "rent_and_occupancy" };
const DRIVERS = "cost_structure.cost_drivers.";

/**
 * The held figure under a trade's condition, or null: the trade's rent share of sales off its shard, only where the shard tags its drivers
 * held (split_rows.ts reads the same tag; a modelled or placeholder driver prints nothing here), stamped with the file and key, an
 * estimate (one figure for the trade, never the place's).
 */
export function dealbreakerFigure(industryId: string | null | undefined): { figure: string; prov: Provenance } | null {
  if (!industryId) return null;
  const row = HELD_FIGURE[industryId];
  if (!row) return null;
  const pct = industryRows(industryId, DRIVERS).find((f) => f.rowKey === row && f.metric === `${DRIVERS}*.pct_of_revenue`);
  if (!pct || pct.tag !== "held" || typeof pct.value !== "number" || !Number.isFinite(pct.value) || pct.value <= 0) return null;
  return { figure: `${Math.round(pct.value)}%`, prov: { src: `data/facts/industry/${industryId}.json:${DRIVERS}${row}.pct_of_revenue`, kind: "estimate" } };
}
