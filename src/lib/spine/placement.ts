/**
 * src/lib/spine/placement.ts
 *
 * THE PLACEMENT SENTENCE, ONE BUILDER FOR EVERY PAGE (MODEL.md PART 6,
 * "PLACEMENT INSTEAD OF SHOUTING", decision 2; PART 9 clause 37, R2; plan
 * step 31's sixth dispatch, 2026-09-18). Wherever a figure is drawn against
 * a world track, the card carries one line beside it saying where the figure
 * sits among every member on file, in one fixed wording used identically on
 * every page of the site:
 *
 *     Higher than {n} countries in ten.        n from one to nine, in words
 *     Among the lowest tenth.                  the bottom tenth
 *
 * and on a city page the noun is "cities". ONE DIRECTION ALWAYS: the sentence
 * never turns into "Lower than ..." for a low figure, so the same words mean
 * the same rank on every page and nothing is a judgment. NO COINED TIER
 * WORDS: no "midpoint", no "quarter", no "upper middle", nothing that would
 * come out true for most countries. The top clamps to nine in ten (a figure
 * can never be higher than every member of a set it belongs to) and the
 * bottom tenth prints its own sentence, which was the crack in PART 6's first
 * wording ("Lower than nine countries in ten" was a second direction).
 *
 * THE ARITHMETIC, and it is the whole of it. `strictlyLower` is how many
 * members of the set hold a figure strictly below this one; `total` is how
 * many members hold a figure at all, this one included. A TIE COUNTS AS NOT
 * LOWER: two countries printing the same figure are not "higher than" each
 * other, so a tie never lifts either. n is the tenth the share falls in,
 * `floor(10 * strictlyLower / total)`, clamped to one through nine; a share
 * under one tenth is the lowest tenth. A set that holds nothing, or a count
 * that cannot be (negative, or more lower than there are members), builds NO
 * sentence: a placement line is a claim about a set, and a claim with no set
 * behind it is a plausible number, which this repo forbids.
 *
 * "ONE" TAKES THE SINGULAR: "Higher than one country in ten." A reader reads
 * every string aloud (PART 5), and "one countries" is a copy fault a person
 * stops at; the wording is clause 37's, the grammar is English's. Every other
 * n takes the plural the clause writes.
 *
 * Callers: the staff-cost card's two bars (pay_rows.ts computes both ranks
 * from the one sweep `worldMaxAverage()` already runs). The bill to register,
 * the running-costs cells and the world-seat card name this builder in their
 * census notes and take it up when their own dispatches land. Nothing else
 * composes this sentence; a second wording anywhere is the fault clause 37
 * names.
 *
 * Defended by tests/spine/placement.test.ts (`placement-sentence` in the
 * chain) on the pure function, and by the PLACEMENT rule in
 * scripts/harness/check_model_laws.mjs on the rendered page (a world track
 * with no line beside it), and by the PAY BARS rule in check_archetypes.mjs
 * (a line beside every drawn bar, none beside a withheld pair, the shape).
 */
import { COPY } from "@/lib/spine/copy";

export type PlacementNoun = "countries" | "cities";

/** The tenths, in words: PART 6's own "nine in ten"; a digit beside the word "ten" reads as a fraction. */
const TENTHS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"] as const;
const SINGULAR: Record<PlacementNoun, string> = { countries: "country", cities: "city" };

/**
 * The sentence for a figure that `strictlyLower` of `total` members sit
 * strictly below. Null when there is no honest set to place it in.
 */
export function placementSentence(strictlyLower: number, total: number, noun: PlacementNoun): string | null {
  if (!Number.isInteger(strictlyLower) || !Number.isInteger(total)) return null;
  if (total <= 0 || strictlyLower < 0 || strictlyLower > total) return null;
  /* The share as an integer numerator over the total, so a share exactly on a
     boundary (20 of 100) lands on its tenth and never a hair under it. */
  const tenth = Math.floor((10 * strictlyLower) / total);
  if (tenth < 1) return COPY.placement.lowest;
  const n = Math.min(9, tenth);
  return COPY.placement.higher.replace("{n}", TENTHS[n]).replace("{noun}", n === 1 ? SINGULAR[noun] : noun);
}

/**
 * The two counts for a figure among a set of figures, the set including the
 * figure's own member. A tie is not lower. A value that is not a finite
 * number, or a set that holds none, gives a total of zero, which
 * `placementSentence` turns into no line.
 */
export function placementRank(value: number, values: readonly number[]): { strictlyLower: number; total: number } {
  if (!Number.isFinite(value)) return { strictlyLower: 0, total: 0 };
  let strictlyLower = 0, total = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    total++;
    if (v < value) strictlyLower++;
  }
  return { strictlyLower, total };
}

/** The rank and the sentence in one call, for a figure among the set it belongs to. */
export function placementOf(value: number, values: readonly number[], noun: PlacementNoun): string | null {
  const { strictlyLower, total } = placementRank(value, values);
  return placementSentence(strictlyLower, total, noun);
}
