/**
 * src/lib/spine/district_rows.ts
 *
 * THE CITY'S DISTRICT RANKING (city:districts, the build loop's run 25,
 * 2026-09-07, rebased task 13, 2026-09-10), for the RankedBars archetype with
 * the burden direction: every ranked district as a row, its shop rent as the
 * value; the set's heaviest as the top rule, since a world's best for a
 * burden would be a rule at the floor. The founder's D1 (2026-07-11): rank by
 * rent load, lightest first; the archetype marks the lightest.
 *
 * THE REFERENCE POINT IS A DISTRICT ON THE CARD, NOT AN INVISIBLE AVERAGE,
 * and this is the whole of the change. His words on the old card: "then you
 * say the city average times one which is the baseline. You don't seem to
 * have an idea on how the information should be actually given." He is right
 * about the mechanism, not just the wording. Every figure was a multiple of
 * the city average, and the city average was drawn NOWHERE: a reader met
 * x1.20 and x3.00 with no way to turn either into anything, because the one
 * quantity they were both measured against never appeared on the page. The
 * rows are now measured against the CHEAPEST DISTRICT, which is drawn, named,
 * ranked and marked two inches away, so "West End, two and a half times South
 * London" is a claim the eye can check against the card it is printed on. The
 * string "x1.00" leaves with the old basis, and so does the word that briefly
 * replaced it: the reference district prints NO figure at all and wears the
 * card's one pill on its name instead (`cheapestKey`, RankedBars'
 * `referenceKey`). A cell has to hold a figure or hold nothing; a bare word
 * standing where a figure belongs is PART 5's own ban, and a row saying it is
 * the baseline is rule 17's.
 *
 * WHY REBASING IS HONEST HERE, stated plainly because dividing one modelled
 * number by another usually is not. The multiples are composed from a per-tag
 * constant table with square-root damping
 * (src/lib/economics/neighborhood_multipliers.ts), so both figures in the
 * ratio come off the SAME basis for the SAME city; the basis cancels, and
 * what survives is the ratio between two districts, which is the only thing
 * the model actually claims. What is NOT done, deliberately: these are never
 * multiplied by the premises rent to make money. That figure is a rent by
 * city SIZE, not London's own average, so the product would compound two
 * different modelled quantities into one absolute that would read as measured
 * and would not be. A measured district rent is DATA-REQUIREMENTS.md 15, and
 * until it lands the card stays tagged.
 *
 * Draws only for a city with two or more ranked districts, and the MIDDLE of
 * the ranking needs three (MIDDLE_MIN_DISTRICTS): with two, every member is an
 * end and a "middle" would be one of the ends printed a second time.
 * Synchronous over a seed, so the stories, the verdict card and the view all
 * share one set of numbers and one basis line and cannot drift apart. The
 * multiple prints with two decimals always, the page's one notation for it.
 */
import type { BarRow } from "@/components/spine/archetypes/RankedBars";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type CityDistrictBars = {
  rows: BarRow[];
  worldMax: number;
  tagged: boolean;
  districts: number;
  /** The reference district: cheapest of the set, and what every row is measured against. */
  cheapest: string;
  /** The same district as `cheapest`, by ROW KEY, for the card that has to mark it. */
  cheapestKey: string;
  /** The far end, and the card's own ceiling. */
  dearest: { name: string; value: number };
  /** The middle of the ranking, the thing the two ends cannot say. Null below
   *  MIDDLE_MIN_DISTRICTS, where there is no member that is not an end. */
  middle: { name: string; value: number } | null;
  /** The composed basis line, naming the reference so it is said as well as drawn. */
  basis: string;
};

/** The rent figure's one notation, shared by every card that prints it, and
 *  NOTHING ELSE: two decimals, always, for whatever it is handed.
 *  It used to answer the reference district's own multiple of itself with the
 *  word "cheapest", which PART 5 bans twice over ("any bare word standing where
 *  a figure belongs", and rule 17's "a baseline row written out"); printing
 *  "x1.00" instead would put back the exact string he struck out. Neither is
 *  this formatter's business: the reference row draws NO figure at all, and
 *  which row that is belongs to the card, not to a number's formatter, which
 *  cannot tell 1.00-because-it-is-the-reference from 1.00-because-a-second
 *  district ties it. RankedBars takes `referenceKey` and reserves that one
 *  cell empty; see its header. The guard is gone rather than hidden, so no
 *  future caller handing this a sub-1 multiple gets a word back. */
export const rentMult = (v: number) => `x${v.toFixed(2)}`;

/** THE MIDDLE OF A RANKING NEEDS THREE MEMBERS. With two, every member is an
 *  end: the "middle" would be one of the two districts the basis line already
 *  names, printed a second time. Below this the middle is null and the card
 *  that shows it drops the cell rather than repeating an end. */
export const MIDDLE_MIN_DISTRICTS = 3;

export function buildCityDistrictBars(seed: any): CityDistrictBars | null {
  const list: any[] = Array.isArray(seed?.where_to_trade?.list)
    ? seed.where_to_trade.list.filter((r: any) => r && typeof r.name === "string" && r.name && isNum(r.rent_mult) && r.rent_mult > 0)
    : [];
  if (list.length < 2) return null;
  const ascending = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);
  const base = ascending[0].rent_mult;
  const at = (r: any) => +(r.rent_mult / base).toFixed(2);
  /* ONE KEY FUNCTION, so the row the card marks as the reference and the row it
     draws can never be keyed two different ways. */
  const keyOf = (r: any) => String(r.slug ?? r.name).toLowerCase();
  const rows: BarRow[] = list.map((r) => ({
    key: keyOf(r),
    name: String(r.name),
    value: at(r),
  }));
  const dear = ascending[ascending.length - 1];
  /* The lower middle for an even count, said here rather than left to a
     reader to wonder about: with six districts this is the third cheapest.
     With TWO the same expression returns index 0, the cheapest itself, which
     is why the count is checked and not assumed: see MIDDLE_MIN_DISTRICTS. */
  const mid = ascending.length >= MIDDLE_MIN_DISTRICTS ? ascending[Math.floor((ascending.length - 1) / 2)] : null;
  return {
    rows,
    worldMax: Math.max(...rows.map((r) => r.value)),
    tagged: true,
    districts: rows.length,
    cheapest: String(ascending[0].name),
    cheapestKey: keyOf(ascending[0]),
    dearest: { name: String(dear.name), value: at(dear) },
    middle: mid ? { name: String(mid.name), value: at(mid) } : null,
    basis: COPY.cityDistricts.basis.replace("{district}", String(ascending[0].name)),
  };
}
