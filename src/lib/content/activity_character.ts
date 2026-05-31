/**
 * activity_character.ts — write-once, opinionated economics per ACTIVITY.
 *
 * The founder problem: a per-cell editorial line ("hotels in Bolivia") is
 * bland and idiotic at scale. But how a business ACTUALLY makes money is the
 * same everywhere: a hostel's economics are a hostel's economics in La Paz or
 * Lisbon. So we write the character ONCE per activity (~240), keyed by the
 * taxonomy industry_id, and reuse it as a quiet side-note on every geo cell.
 *
 * This is the "tasteful, opinionated info found nowhere else" layer. It is
 * NOT a headline; render it in a secondary slot on the cell page and as the
 * spine of the activity page (/industries/[slug]).
 *
 * Voice: 70% authoritative, 30% wry (the Atlas house voice). Specific, not
 * generic. Says the real thing operators learn the hard way. No em-dashes
 * (gate enforced). No source-agency names. No fake numbers; speak in
 * structure and ratios, let the cell page carry the country figures.
 *
 * Coverage: entries are added over time. getActivityCharacter() returns null
 * for unwritten activities so the UI self-suppresses cleanly (no dead block).
 */

export type ActivityCharacter = {
  /** taxonomy industry_id this describes */
  id: string;
  /** One-line essence. The thing to know if you only read one sentence. */
  hook: string;
  /** How the money actually works. 2-4 sentences. The real economics. */
  economics: string;
  /** What quietly kills operators. 1-2 sentences. */
  watchOut: string;
  /** What separates the top operators from the median. 1-2 sentences. */
  edge: string;
  /** Optional: how it compares within its category (the only safe ranking). */
  categoryNote?: string;
};

/**
 * Hand-written exemplars that LOCK THE VOICE. Everything added later must
 * match this register: concrete, opinionated, structural, a little dry-funny.
 * Draft the rest from the margin + cost-stack data against these three.
 */
export const ACTIVITY_CHARACTER: Record<string, ActivityCharacter> = {
  hostels: {
    id: "hostels",
    hook: "A hostel sells the same bed several times a night and lives or dies on how full it stays.",
    economics:
      "Revenue is beds times nights times occupancy, and the third number is the whole game. Gross margin looks fat because a bunk costs almost nothing to fill once the building is paid for, but the rent or mortgage is fixed whether the dorm is empty or packed. That is why a hostel at 80 percent occupancy prints money and the same hostel at 45 percent quietly bleeds.",
    watchOut:
      "Seasonality and a single bad review cycle. Empty shoulder-season months eat the cash that the summer made, and beds discount faster than rooms do.",
    edge:
      "The best operators run common spaces that make solo travelers stay an extra night and tell a friend. Occupancy is a marketing outcome, not a pricing one.",
    categoryNote:
      "Per bed, a well-run hostel often clears a better margin than a small independent hotel, because it monetizes the same floor area far more densely.",
  },

  restaurants: {
    id: "restaurants",
    hook: "A restaurant is a cash-rich, margin-poor business that punishes every mistake in food and labor.",
    economics:
      "Food cost and labor each eat roughly a third of every dollar before rent, so the operator is steering a business that keeps about a dime on a good day. Volume and table turns are everything: the same kitchen and the same staff cost nearly the same whether the room is half full or slammed, so the profit lives entirely in the busy hours.",
    watchOut:
      "Rent creep and waste. A lease that drifts past the high-single-digit share of sales, or a kitchen that over-orders, turns a thin margin into no margin.",
    edge:
      "Top operators win on consistency and throughput, not on a fancier menu. They protect the busy shifts and cut the dead ones without guilt.",
    categoryNote:
      "Fast-casual and pizzerias usually keep more of each dollar than full-service sit-down rooms, because they spend less on service labor for the same revenue.",
  },

  accounting_tax: {
    id: "accounting_tax",
    hook: "An accounting practice sells trust and hours, and its profit is mostly the owner's own time.",
    economics:
      "There is almost no cost of goods here: revenue is billable hours, and the margin is whatever is left after wages and a small back office. That makes it one of the steadiest cash businesses on the map, but also one that scales only by hiring people you can bill out for more than they cost.",
    watchOut:
      "Owner-dependence and seasonality. If the senior person is the product, growth stalls; and a practice that lives on tax season starves the rest of the year unless it sells advisory work.",
    edge:
      "The strong firms turn one-off filings into recurring monthly retainers. Predictable revenue is worth more than a higher hourly rate.",
    categoryNote:
      "A solo practice keeps a higher share of each dollar than a multi-partner firm, but caps out fast; the firm trades margin for a ceiling worth having.",
  },
};

// Bulk-drafted entries (data-grounded, voice-matched to the exemplars above).
// Generated by scripts/content drafters; reviewed/edited over time. The
// hand-written ACTIVITY_CHARACTER exemplars WIN on key collision so the voice
// anchors are never overwritten by a draft.
import generated from "./activity_character_generated.json";

const GENERATED = generated as Record<string, ActivityCharacter>;
const MERGED: Record<string, ActivityCharacter> = {
  ...GENERATED,
  ...ACTIVITY_CHARACTER,
};

/** Lookup by taxonomy industry_id. Returns null when not yet written. */
export function getActivityCharacter(
  industryId: string | null | undefined,
): ActivityCharacter | null {
  if (!industryId) return null;
  return MERGED[industryId] ?? null;
}

/** Coverage helper for the admin/quality surfaces. */
export function activityCharacterCount(): number {
  return Object.keys(MERGED).length;
}
