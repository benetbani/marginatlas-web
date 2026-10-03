/**
 * Honest precision: a figure prints no finer than its uncertainty and no more than three significant figures; one
 * decimal count per column; shares of a whole as integers that add to the whole (largest remainder).
 *
 * Run: npx tsx tests/uk/present/precision.test.ts
 */
import { decimalsForColumn, honestRound, honestUnit, largestRemainder, roundToUnit } from "../../../src/lib/uk/present/precision";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-present-precision";
const FILE = "src/lib/uk/present/precision.ts";
const REMEDY = "fix precision.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("London restaurants' median 281,900 (280,300 to 283,500, half-width 1,600) prints 282,000", honestRound(281_900, 280_300, 283_500) === 282_000);
check("Camden's hair and beauty median 76,400 (73,900 to 81,100, half-width 3,600) prints 76,000", honestRound(76_400, 73_900, 81_100) === 76_000);
check("the London restaurant at the median keeps 13,756.27 (11,534 to 15,558 across the band shapes) and prints 14,000", honestRound(13_756.27, 11_534, 15_558) === 14_000);
check("a figure known only to 50,000 to 110,000 prints to the 10,000: 76,400 prints 80,000", honestRound(76_400, 50_000, 110_000) === 80_000);
check("the printed figure stays inside its range widened by half a unit", Math.abs(honestRound(281_900, 280_300, 283_500) - 281_900) <= honestUnit(281_900, 280_300, 283_500) / 2 && 282_000 >= 280_300 - 500 && 282_000 <= 283_500 + 500);
check("an exact law figure keeps three significant figures: 28,308.52 prints 28,300", honestRound(28_308.52) === 28_300);
check("a small exact figure keeps its pounds: 740 prints 740", honestRound(740) === 740);
check("the unit never goes below 1", honestUnit(3.2) === 1);
check("26 and 28.9 in one column print with one decimal each", decimalsForColumn([26, 28.9, 1.3]) === 1);
check("whole numbers stay whole", decimalsForColumn([12, 40, 7]) === 0);
const split = largestRemainder([18.4, 14.2, 11.3, 10.9, 7.1, 6.8, 31.3]);
check("a spending split prints as integers that sum to 100", split.reduce((a, b) => a + b, 0) === 100);
check("largest remainder: floors 18,14,11,10,7,6,31 (97), the three largest remainders (.9, .8, .4) get one each", split.join(",") === "19,14,11,11,7,7,31");
check("the unit is the leading digit of the half-width: 13,756 known to 13,156 to 14,356 (half-width 600) prints 13,800, not 14,000", honestRound(13_756, 13_156, 14_356) === 13_800);
check("a half-width of 1,000 in decimal gives a unit of 1,000 when floating point puts it a hair below: 2,234.14 (1,234.14 to 3,234.14, 1,999.9999999999998 apart) prints 2,000", honestRound(2_234.14, 1_234.14, 3_234.14) === 2_000);
check("a loss rounds as the same profit does, half away from zero: -4,500 (-6,000 to -3,000) prints -5,000 as 4,500 prints 5,000; -300 at a unit of 1,000 is 0, never -0", honestRound(-4_500, -6_000, -3_000) === -5_000 && honestRound(4_500, 3_000, 6_000) === 5_000 && Object.is(roundToUnit(-300, 1_000), 0));
check("ties go to the earlier row in decimal, not in floating point: 4, 1, 1 of 100 (66.67, 16.67, 16.67, two thirds over each) prints 67, 17, 16", largestRemainder([4, 1, 1]).join(",") === "67,17,16");
check("nothing to split prints zeros", largestRemainder([0, 0, 0]).join(",") === "0,0,0");
check("a two-decimal figure above 100,000 reads as two decimals under a cap of 3 (100 x 299,264.78 is 29,926,478.000000004)", decimalsForColumn([299_264.78], 3) === 2);
/** The guards throw a RangeError; a missing guard shows as a hang, a plain Error, or a figure printed as if exact. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("a range needs two finite ends around its figure: one end, an end that is not a number, an infinite end (which would widen the unit forever), ends the wrong way round and a figure outside them are refused", refuses(() => honestUnit(76_400, 73_900)) && refuses(() => honestUnit(76_400, Number.NaN, 81_100)) && refuses(() => honestUnit(5, -Infinity, 10)) && refuses(() => honestUnit(76_400, 81_100, 73_900)) && refuses(() => honestUnit(90_000, 73_900, 81_100)));
check("a figure must be finite and the significant figures a whole count of at least one, and a unit a positive finite number: honestUnit of NaN, 0 or 2.5 significant figures, and roundToUnit at a unit of 0, -10 or NaN or of a NaN figure are refused", refuses(() => honestUnit(Number.NaN)) && refuses(() => honestUnit(740, undefined, undefined, 0)) && refuses(() => honestUnit(740, undefined, undefined, 2.5)) && refuses(() => roundToUnit(740, 0)) && refuses(() => roundToUnit(740, -10)) && refuses(() => roundToUnit(740, Number.NaN)) && refuses(() => roundToUnit(Number.NaN, 10)));
check("a column must hold finite figures and a whole cap of at least 0: NaN in a column, a cap of -1 or 1.5 are refused", refuses(() => decimalsForColumn([26, Number.NaN])) && refuses(() => decimalsForColumn([26], -1)) && refuses(() => decimalsForColumn([26], 1.5)));
check("shares must be finite and not negative, and the total whole: -1, NaN, a hole and a total of 99.5 are refused", refuses(() => largestRemainder([50, -1, 51])) && refuses(() => largestRemainder([50, Number.NaN])) && refuses(() => largestRemainder(new Array<number>(3))) && refuses(() => largestRemainder([50, 50], 99.5)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/precision: all pass");
