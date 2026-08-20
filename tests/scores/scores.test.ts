/**
 * tests/scores/scores.test.ts
 *
 * WHAT THIS TESTED UNTIL 2026-08-20, and why it does not any more. It exercised
 * `computeScores` across five scenarios: a strong cell, a weak cell, a cell
 * missing `cost_structure`, an empty cell, and a determinism check. Every one of
 * those passed. `computeScores` had zero callers, so this was a wired, green
 * test of code nothing rendered, which is the inverse of the rule CLAUDE.md
 * already states as "a test file that nothing runs is not coverage".
 *
 * The function was deleted in the same change. What survives of the module is
 * the band vocabulary, and that IS worth pinning: `bandOf`'s thresholds are what
 * make "strong" mean the same thing on every surface that prints the word, so a
 * quiet edit to one of them would change published copy across the site with
 * nothing to catch it.
 *
 * Run: npx tsx tests/scores/scores.test.ts
 */
import { bandOf } from "@/lib/scores";

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

/* The five bands, at their boundaries. Each pair is the lowest value that must
   read as the band, and the highest that must not. */
const BOUNDARIES: Array<[number, ReturnType<typeof bandOf>]> = [
  [100, "strong"],
  [80, "strong"],
  [79, "workable"],
  [60, "workable"],
  [59, "mixed"],
  [40, "mixed"],
  [39, "weak"],
  [20, "weak"],
  [19, "avoid"],
  [0, "avoid"],
];

for (const [value, expected] of BOUNDARIES) {
  assert(
    bandOf(value) === expected,
    `bandOf(${value}) should read "${expected}", read "${bandOf(value)}"`,
  );
}

/* The direction rule: higher is always more favourable, so the band a score
   reads as must never improve as the score falls. */
const ORDER = ["avoid", "weak", "mixed", "workable", "strong"];
let previous = -1;
for (let v = 0; v <= 100; v++) {
  const rank = ORDER.indexOf(bandOf(v));
  assert(rank >= previous, `bandOf is not monotonic: it fell back at ${v}`);
  previous = rank;
}

/* Out-of-range inputs must still answer, because a caller that has already
   clamped is not the only caller this can ever have. */
assert(bandOf(1000) === "strong", "a score above 100 should still read strong");
assert(bandOf(-5) === "avoid", "a score below 0 should still read avoid");

console.log("PASS: scores band vocabulary (12 boundaries, monotonic 0-100, 2 out-of-range)");
