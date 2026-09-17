/**
 * The placement sentence is one wording, one direction, one builder
 * (MODEL.md PART 6, decision 2; PART 9 clause 37, R2; plan step 31's sixth
 * dispatch, 2026-09-18).
 *
 * WHY THIS EXISTS. Wherever a figure sits on a world track the card says in
 * words where it sits among every member on file, and the site has exactly
 * one sentence for it: "Higher than {n} countries in ten." with "Among the
 * lowest tenth." for the bottom. PART 6's first wording had two directions
 * ("Lower than nine countries in ten" at the bottom), which is two sentences
 * meaning one rank, the crack R2 closed. A second builder, a flipped
 * direction or a coined tier word ("midpoint", "upper quarter") would not be
 * caught by any other gate, because each is a perfectly well-formed string.
 *
 * WHAT IS PROVED, on the pure builder in src/lib/spine/placement.ts:
 *   1. THE TOP prints nine in ten (194 of 195, and the clamp when a caller
 *      counts every member lower).
 *   2. THE BOTTOM prints the lowest tenth (0 of 195, and 9 of 100, a hair
 *      under the first tenth).
 *   3. ONE IN TEN prints the singular noun ("one country", "one city").
 *   4. A TIE COUNTS AS NOT LOWER: a set with two equal figures ranks the
 *      figure by the members strictly below it, and the tie lifts nothing.
 *   5. A SHARE EXACTLY ON A BOUNDARY lands on its tenth (20 of 100 is two, 10
 *      of 100 is one, 90 of 100 is nine), never a hair under.
 *   6. ONE DIRECTION, ONE SHAPE: every sentence the builder can produce over a
 *      sweep of every (lower, total) pair up to 200 matches the fixed shape
 *      and never says "Lower than", and no coined tier word appears.
 *   7. NO SET, NO LINE: a total of zero, a negative count, more lower than
 *      members, or a non-finite value builds null, never a sentence.
 *
 * NEGATIVE-TESTED by a plant on 2026-09-18 (the clamp raised to ten), seen
 * red by name before this file was trusted.
 */
import { placementSentence, placementRank, placementOf } from "../../src/lib/spine/placement";
import { COPY } from "../../src/lib/spine/copy";
import { red } from "../../scripts/lib/red";

const RULE = "placement-sentence";
const BUILDER = "src/lib/spine/placement.ts";
/** Every red names the rule, the file it is in and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const fail = (detail: string, remedy = "fix placementSentence in placement.ts so the one wording holds; never add a second wording, a second direction or a tier word") => {
  red({ rule: RULE, file: BUILDER, detail, remedy });
  process.exit(1);
};

/** The fixed shape, the same pattern the PAY BARS harness rule keeps by hand in scripts/harness/check_archetypes.mjs. */
const SHAPE = /^(Higher than (one (country|city)|(two|three|four|five|six|seven|eight|nine) (countries|cities)) in ten\.|Among the lowest tenth\.)$/;
const COINED = /\b(midpoint|quarter|median|average|typical|upper|middle|top|bottom half|tier)\b/i;

const expect = (name: string, got: string | null, want: string | null) => {
  if (got !== want) fail(`${name}: built ${got === null ? "null" : `"${got}"`}, expected ${want === null ? "null" : `"${want}"`}`);
};

/* ---- 1. THE TOP ----------------------------------------------------------- */
expect("the top, 194 of 195", placementSentence(194, 195, "countries"), "Higher than nine countries in ten.");
expect("the clamp, every member counted lower (100 of 100)", placementSentence(100, 100, "countries"), "Higher than nine countries in ten.");
expect("99 of 100", placementSentence(99, 100, "countries"), "Higher than nine countries in ten.");

/* ---- 2. THE BOTTOM -------------------------------------------------------- */
expect("the bottom, 0 of 195", placementSentence(0, 195, "countries"), "Among the lowest tenth.");
expect("9 of 100, a hair under the first tenth", placementSentence(9, 100, "countries"), "Among the lowest tenth.");
expect("19 of 195 (0.097)", placementSentence(19, 195, "countries"), "Among the lowest tenth.");
expect("the bottom, cities", placementSentence(0, 40, "cities"), "Among the lowest tenth.");

/* ---- 3. ONE IN TEN, THE SINGULAR ----------------------------------------- */
expect("one in ten, countries (20 of 195)", placementSentence(20, 195, "countries"), "Higher than one country in ten.");
expect("one in ten, cities (5 of 40)", placementSentence(5, 40, "cities"), "Higher than one city in ten.");
expect("two in ten, cities (8 of 40)", placementSentence(8, 40, "cities"), "Higher than two cities in ten.");

/* ---- 4. A TIE COUNTS AS NOT LOWER ---------------------------------------- */
{
  const r = placementRank(20, [10, 20, 20, 30]);
  if (r.strictlyLower !== 1 || r.total !== 4) fail(`a tie: rank of 20 in [10, 20, 20, 30] is ${r.strictlyLower} of ${r.total}, expected 1 of 4 (the equal member is not lower)`);
  expect("a tie: the sentence for 20 in [10, 20, 20, 30]", placementOf(20, [10, 20, 20, 30], "countries"), "Higher than two countries in ten.");
  /* Counted with the tie, 2 of 4 would print five in ten; the tie must not lift it. */
  expect("a tie: the top member of an all-equal set is the lowest tenth", placementOf(5, [5, 5, 5, 5, 5], "countries"), "Among the lowest tenth.");
  const own = placementRank(38000, [27000, 38000, 95000]);
  if (own.total !== 3 || own.strictlyLower !== 1) fail(`the figure's own member is in the set: 38000 in [27000, 38000, 95000] ranks ${own.strictlyLower} of ${own.total}, expected 1 of 3`);
}

/* ---- 5. A SHARE EXACTLY ON A BOUNDARY ----------------------------------- */
expect("20 of 100, exactly two tenths", placementSentence(20, 100, "countries"), "Higher than two countries in ten.");
expect("10 of 100, exactly one tenth", placementSentence(10, 100, "countries"), "Higher than one country in ten.");
expect("90 of 100, exactly nine tenths", placementSentence(90, 100, "countries"), "Higher than nine countries in ten.");
expect("3 of 30, exactly one tenth", placementSentence(3, 30, "countries"), "Higher than one country in ten.");
expect("7 of 70, exactly one tenth", placementSentence(7, 70, "countries"), "Higher than one country in ten.");
expect("39 of 195, exactly two tenths", placementSentence(39, 195, "countries"), "Higher than two countries in ten.");

/* ---- 6. ONE DIRECTION, ONE SHAPE, over every pair up to 200 -------------- */
{
  let built = 0;
  const seen = new Set<string>();
  for (let total = 1; total <= 200; total++) {
    for (let lower = 0; lower <= total; lower++) {
      for (const noun of ["countries", "cities"] as const) {
        const s = placementSentence(lower, total, noun);
        if (s === null) { fail(`${lower} of ${total} (${noun}) built no sentence; every honest pair builds one`); continue; }
        if (!SHAPE.test(s)) fail(`${lower} of ${total} (${noun}) built "${s}", off the one shape`);
        if (/lower than/i.test(s)) fail(`${lower} of ${total} (${noun}) built "${s}", a second direction`);
        if (COINED.test(s)) fail(`${lower} of ${total} (${noun}) built "${s}", a coined tier word`);
        seen.add(s);
        built++;
      }
    }
  }
  /* Nine tenths for each noun, and the lowest tenth, which names no noun and
     is one sentence for both: nineteen distinct sentences and no more. */
  if (seen.size !== 19) fail(`the builder produced ${seen.size} distinct sentences over ${built} pairs; the one wording allows exactly 19 (nine tenths for each of two nouns, and the one lowest-tenth sentence)`);
  if (COPY.placement.higher !== "Higher than {n} {noun} in ten." || COPY.placement.lowest !== "Among the lowest tenth.") fail(`COPY.placement reads "${COPY.placement.higher}" / "${COPY.placement.lowest}"; the wording is clause 37's and is not reworded`, "restore the two strings in src/lib/spine/copy.ts; clause 37 fixes the wording");
}

/* ---- 7. NO SET, NO LINE -------------------------------------------------- */
expect("a total of zero", placementSentence(0, 0, "countries"), null);
expect("a negative count", placementSentence(-1, 10, "countries"), null);
expect("more lower than members", placementSentence(11, 10, "countries"), null);
expect("a fractional count", placementSentence(1.5, 10, "countries"), null);
expect("a non-finite value", placementOf(Number.NaN, [1, 2, 3], "countries"), null);
expect("an empty set", placementOf(5, [], "countries"), null);
{
  const r = placementRank(5, [Number.NaN, 1, Number.POSITIVE_INFINITY]);
  if (r.total !== 1 || r.strictlyLower !== 1) fail(`a set with a NaN and an Infinity: ranked ${r.strictlyLower} of ${r.total}, expected 1 of 1 (only the finite member counts)`);
}

console.log(`PASS placement_sentence. One wording, one direction: 19 distinct sentences over every pair up to 200 members, the top nine in ten, the bottom the lowest tenth, one in ten singular, a tie not lower, boundaries on their tenth, and no line without a set.`);
process.exit(0);
