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

type Row = { id: string; value: number; lo: number; hi: number };
const show = (xs: readonly (Row & { rank: number; levelWithAbove: boolean })[]) => xs.map((x) => `${x.id}:${x.rank}${x.levelWithAbove ? "=" : ""}`).join(" ");
const ranksById = (xs: readonly { id: string; rank: number }[]) => JSON.stringify(xs.map((x) => [x.id, x.rank]).sort());
const restaurants: Row = { id: "restaurants", value: 28.9, lo: 27.3, hi: 30.5 }, pubs: Row = { id: "pubs", value: 26.0, lo: 24.3, hi: 27.8 };
const bars: Row = { id: "bars", value: 25.7, lo: 23.0, hi: 28.6 }, dental: Row = { id: "dental", value: 1.3, lo: 0.8, hi: 1.9 };
check("listed lowest first, the result is highest first with the same ranks: restaurants 1, pubs 1, bars 1, dental 4", show(rankWithTies([dental, bars, pubs, restaurants])) === "restaurants:1 pubs:1= bars:1= dental:4");
check("the sort key is the figure, not an end or the middle of its interval: 10 (9.9 to 10.1), 9 (8 to 20), 8.5 (8.4 to 8.6) rank 1, 1, 3", show(rankWithTies([{ id: "X", value: 10, lo: 9.9, hi: 10.1 }, { id: "Y", value: 9, lo: 8, hi: 20 }, { id: "Z", value: 8.5, lo: 8.4, hi: 8.6 }])) === "X:1 Y:1= Z:3");
check("a second group of two keeps its own leader: 21, 15, 14.5 and 5 rank 1, 2, 2, 4", show(rankWithTies([{ id: "A", value: 21, lo: 20, hi: 22 }, { id: "B", value: 15, lo: 14, hi: 16 }, { id: "C", value: 14.5, lo: 13.5, hi: 15.5 }, { id: "D", value: 5, lo: 4.5, hi: 5.5 }])) === "A:1 B:2 C:2= D:4");
check("two identical exact figures (each a point interval) are level", show(rankWithTies([{ id: "a", value: 10, lo: 10, hi: 10 }, { id: "b", value: 10, lo: 10, hi: 10 }])) === "a:1 b:1=");
const leader = rankWithTies([restaurants, pubs])[0];
check("the leader ranks 1 and is level with nothing; no members give no ranks", leader.rank === 1 && leader.levelWithAbove === false && rankWithTies([]).length === 0);
const H: Row = { id: "H", value: 10, lo: 8, hi: 12 }, X: Row = { id: "X", value: 5, lo: 4.9, hi: 5.1 }, Y: Row = { id: "Y", value: 5, lo: 1, hi: 9 };
const A: Row = { id: "A", value: 10, lo: 9.5, hi: 10.5 }, B: Row = { id: "B", value: 10, lo: 5, hi: 15 }, C: Row = { id: "C", value: 6, lo: 5.5, hi: 6.5 };
check("members with the same figure rank the same whichever order the rows come in (10, 8 to 12 with two 5s; two 10s with a 6)", ranksById(rankWithTies([H, X, Y])) === ranksById(rankWithTies([H, Y, X])) && ranksById(rankWithTies([A, B, C])) === ranksById(rankWithTies([B, A, C])));
const callers: Row[] = [{ id: "lo", value: 1, lo: 0, hi: 2 }, { id: "hi", value: 9, lo: 8, hi: 10 }];
rankWithTies(callers);
check("the caller's list keeps its order, and a row that already carries a rank gets the computed one", callers.map((r) => r.id).join(",") === "lo,hi" && rankWithTies([{ id: "a", rank: 99, value: 5, lo: 4, hi: 6 }])[0].rank === 1);
check("a figure below its interval, an infinite figure, and an interval with an infinite or a missing end are refused", refuses(() => rankWithTies([{ value: 5, lo: 6, hi: 8 }])) && refuses(() => rankWithTies([{ value: Infinity, lo: 0, hi: Infinity }])) && refuses(() => rankWithTies([{ value: 5, lo: 4, hi: Infinity }])) && refuses(() => rankWithTies([{ value: 5, lo: null as unknown as number, hi: 6 }])));
check("an infinite own figure or a missing one is refused, and so is a member that does not say whether it is a fill", refuses(() => medianExcludingFills([1, 2, Infinity].map((value) => ({ value, isFill: false })))) && refuses(() => medianExcludingFills([{ value: null as unknown as number, isFill: false }, { value: 4, isFill: false }])) && refuses(() => medianExcludingFills([{ value: 1, isFill: undefined as unknown as boolean }])));
const allFills = medianExcludingFills([0.13, 0.13, 0.13].map((value) => ({ value, isFill: true })));
const nanFill = medianExcludingFills([{ value: Number.NaN, isFill: true }, { value: 0.2, isFill: false }]);
check("a set of fills reports every one left out and none used; a fill that is not a number is still counted as left out", allFills.median === null && allFills.used === 0 && allFills.leftOut === 3 && nanFill.median === 0.2 && nanFill.used === 1 && nanFill.leftOut === 1);
const none = medianExcludingFills([]);
check("an empty set has no median; one own figure is its own median", none.median === null && none.used === 0 && none.leftOut === 0 && medianExcludingFills([{ value: 7, isFill: false }]).median === 7);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/compare: all pass");
