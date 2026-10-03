/**
 * Comparison: members ranked apart only when their intervals separate (ties share a rank); set medians over members'
 * own figures, fill values counted and left out.
 *
 * Run: npx tsx tests/uk/present/compare.test.ts
 */
import { medianExcludingFills, rankWithTies } from "../../../src/lib/uk/present/compare";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-present-compare";
const FILE = "src/lib/uk/present/compare.ts";
const REMEDY = "fix compare.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const ranked = rankWithTies([
  { id: "restaurants", value: 28.9, lo: 27.3, hi: 30.5 },
  { id: "pubs", value: 26.0, lo: 24.3, hi: 27.8 },
  { id: "bars", value: 25.7, lo: 23.0, hi: 28.6 },
  { id: "dental", value: 1.3, lo: 0.8, hi: 1.9 },
]);
check("pubs (24.3 to 27.8) overlap restaurants (27.3 to 30.5): level, the same rank", ranked[1].levelWithAbove === true && ranked[1].rank === 1);
check("bars are level with the head of that group (23.0 to 28.6 overlaps 27.3 to 30.5)", ranked[2].rank === 1);
check("dental stands alone at the bottom with its own rank", ranked[3].rank === 4 && !ranked[3].levelWithAbove);
const med = medianExcludingFills([
  { value: 0.13, isFill: true }, { value: 0.13, isFill: true }, { value: 0.32, isFill: false }, { value: 0.07, isFill: false }, { value: 0.21, isFill: false },
]);
check("the median of own figures is 0.21, the two fills left out and counted", med.median === 0.21 && med.leftOut === 2 && med.used === 3);
check("a set of fills only has no median", medianExcludingFills([{ value: 0.13, isFill: true }]).median === null);
const touching = rankWithTies([{ id: "a", value: 28.9, lo: 27.3, hi: 30.5 }, { id: "b", value: 26.0, lo: 25.0, hi: 27.3 }]);
check("intervals that touch at one point are level (25.0 to 27.3 against 27.3 to 30.5)", touching[1].levelWithAbove === true && touching[1].rank === 1);
const chain = rankWithTies([{ id: "a", value: 11, lo: 10, hi: 12 }, { id: "b", value: 9.5, lo: 8.5, hi: 10.5 }, { id: "c", value: 8, lo: 7, hi: 9 }]);
check("level with the member above but not with the group's head starts a new group: 8 (7 to 9) under 9.5 (8.5 to 10.5) under 11 (10 to 12) ranks 3", chain[1].rank === 1 && chain[2].rank === 3 && chain[2].levelWithAbove === false);
check("an even count takes the mean of the middle two: 0.07, 0.21, 0.32 and 0.40 give 0.265", medianExcludingFills([0.4, 0.07, 0.32, 0.21].map((value) => ({ value, isFill: false }))).median === 0.265);
check("figures sort as numbers: 9, 10 and 100 give 10 (a sort by text puts 100 before 9 and gives 100)", medianExcludingFills([100, 9, 10].map((value) => ({ value, isFill: false }))).median === 10);
/** The guards throw a RangeError; a missing guard shows as a rank or a median of a figure that is not one. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("an interval must hold its figure: NaN, an interval the wrong way round and a figure outside are refused", refuses(() => rankWithTies([{ value: Number.NaN, lo: 0, hi: 1 }])) && refuses(() => rankWithTies([{ value: 5, lo: 6, hi: 4 }])) && refuses(() => rankWithTies([{ value: 9, lo: 6, hi: 8 }])));
check("an own figure that is not a number is refused; a fill that is not one is left out like any fill", refuses(() => medianExcludingFills([{ value: Number.NaN, isFill: false }])) && medianExcludingFills([{ value: Number.NaN, isFill: true }, { value: 0.2, isFill: false }]).median === 0.2);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/compare: all pass");
