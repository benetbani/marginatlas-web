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
 * string "x1.00" leaves with the old basis: no row is a baseline any more,
 * and the cheapest simply reads as the cheapest.
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
 * Draws only for a city with two or more ranked districts. Synchronous over a
 * seed, so the stories, the verdict card and the view all share one set of
 * numbers and one basis line and cannot drift apart. The multiple prints with
 * two decimals always, the page's one notation for it.
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
  /** The far end, and the card's own ceiling. */
  dearest: { name: string; value: number };
  /** The middle of the ranking, the thing the two ends cannot say. */
  middle: { name: string; value: number };
  /** The composed basis line, naming the reference so it is said as well as drawn. */
  basis: string;
};

/** The rent figure's one notation, shared by every card that prints it.
 *  The reference district carries a word, not a multiple: its own multiple of
 *  itself is 1 for every city, forever, by definition, which is the "x1.00 is
 *  the average" he struck out, moved one column over. */
export const rentMult = (v: number) => (v <= 1 ? COPY.cityDistricts.cheapest : `x${v.toFixed(2)}`);

export function buildCityDistrictBars(seed: any): CityDistrictBars | null {
  const list: any[] = Array.isArray(seed?.where_to_trade?.list)
    ? seed.where_to_trade.list.filter((r: any) => r && typeof r.name === "string" && r.name && isNum(r.rent_mult) && r.rent_mult > 0)
    : [];
  if (list.length < 2) return null;
  const ascending = list.slice().sort((a, b) => a.rent_mult - b.rent_mult);
  const base = ascending[0].rent_mult;
  const at = (r: any) => +(r.rent_mult / base).toFixed(2);
  const rows: BarRow[] = list.map((r) => ({
    key: String(r.slug ?? r.name).toLowerCase(),
    name: String(r.name),
    value: at(r),
  }));
  const dear = ascending[ascending.length - 1];
  /* The lower middle for an even count, said here rather than left to a
     reader to wonder about: with six districts this is the third cheapest. */
  const mid = ascending[Math.floor((ascending.length - 1) / 2)];
  return {
    rows,
    worldMax: Math.max(...rows.map((r) => r.value)),
    tagged: true,
    districts: rows.length,
    cheapest: String(ascending[0].name),
    dearest: { name: String(dear.name), value: at(dear) },
    middle: { name: String(mid.name), value: at(mid) },
    basis: COPY.cityDistricts.basis.replace("{district}", String(ascending[0].name)),
  };
}
