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

check("London restaurants' median 281,900 (280,659 to 283,227, half-width 1,284) prints 282,000", honestRound(281_900, 280_659, 283_227) === 282_000);
check("Camden's hair and beauty median 76,400 (74,380 to 80,133, half-width 2,876.5) prints 76,000", honestRound(76_400, 74_380, 80_133) === 76_000);
check("the London restaurant at the median keeps 13,756.27 (11,198 to 16,056 across the band shapes) and prints 14,000", honestRound(13_756.27, 11_198, 16_056) === 14_000);
check("a figure known only to 50,000 to 110,000 prints to the 10,000: 76,400 prints 80,000", honestRound(76_400, 50_000, 110_000) === 80_000);
check("each worked example prints inside its range widened by half its unit, and within half a unit of the figure", ([[281_900, 280_659, 283_227], [76_400, 74_380, 80_133], [13_756.27, 11_198, 16_056], [76_400, 50_000, 110_000]] as const).every(([v, lo, hi]) => { const u = honestUnit(v, lo, hi), p = honestRound(v, lo, hi); return Math.abs(p - v) <= u / 2 && lo - u / 2 <= p && p <= hi + u / 2; }));
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
check("ties go to the earlier row in decimal, not in floating point, even when a later row is bigger: 4, 1, 1 of 100 (66.67, 16.67, 16.67, two thirds over each) prints 67, 17, 16 and 1, 1, 4 prints 17, 17, 66", largestRemainder([4, 1, 1]).join(",") === "67,17,16" && largestRemainder([1, 1, 4]).join(",") === "17,17,66");
check("nothing to split prints zeros", largestRemainder([0, 0, 0]).join(",") === "0,0,0");
check("a two-decimal figure above 100,000 reads as two decimals under a cap of 3 (100 x 299,264.78 is 29,926,478.000000004)", decimalsForColumn([299_264.78], 3) === 2);
/** The guards throw a RangeError; a missing guard shows as a hang, a plain Error, or a figure printed as if exact. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("a range needs two finite ends around its figure: one end, an end that is not a number, an infinite end (which would widen the unit forever), ends the wrong way round and a figure outside them are refused", refuses(() => honestUnit(76_400, 73_900)) && refuses(() => honestUnit(76_400, Number.NaN, 81_100)) && refuses(() => honestUnit(5, -Infinity, 10)) && refuses(() => honestUnit(76_400, 81_100, 73_900)) && refuses(() => honestUnit(90_000, 73_900, 81_100)));
check("a figure must be finite and the significant figures a whole count of at least one, and a unit a positive finite number: honestUnit of NaN, 0 or 2.5 significant figures, and roundToUnit at a unit of 0, -10 or NaN or of a NaN figure are refused", refuses(() => honestUnit(Number.NaN)) && refuses(() => honestUnit(740, undefined, undefined, 0)) && refuses(() => honestUnit(740, undefined, undefined, 2.5)) && refuses(() => roundToUnit(740, 0)) && refuses(() => roundToUnit(740, -10)) && refuses(() => roundToUnit(740, Number.NaN)) && refuses(() => roundToUnit(Number.NaN, 10)));
check("a column must hold finite figures and a whole cap of at least 0: NaN in a column, a cap of -1 or 1.5 are refused", refuses(() => decimalsForColumn([26, Number.NaN])) && refuses(() => decimalsForColumn([26], -1)) && refuses(() => decimalsForColumn([26], 1.5)));
check("shares must be finite and not negative, and the total whole: -1, NaN, a hole and a total of 99.5 are refused", refuses(() => largestRemainder([50, -1, 51])) && refuses(() => largestRemainder([50, Number.NaN])) && refuses(() => largestRemainder(new Array<number>(3))) && refuses(() => largestRemainder([50, 50], 99.5)));

check("exact figures keep three significant figures: 76,400 prints 76,400 and 5,678 prints 5,680", honestRound(76_400) === 76_400 && honestRound(5_678) === 5_680);
check("a loss with no range keeps three significant figures: -28,308.52 prints -28,300", honestRound(-28_308.52) === -28_300);
check("two significant figures when asked: 28,308.52 has a unit of 1,000", honestUnit(28_308.52, undefined, undefined, 2) === 1_000);
check("half-widths of 950 and 999.5 have a unit of 100: 13,756 prints 13,800", honestRound(13_756, 13_000, 14_900) === 13_800 && honestRound(13_756, 13_000.5, 14_999.5) === 13_800);
check("a half-width of exactly 100,000 (99,999.99999999977 in floating point) has a unit of 100,000: 4,110,973.77 prints 4,100,000", honestRound(4_110_973.77, 4_010_973.77, 4_210_973.77) === 4_100_000);
check("the allowance is relative: a half-width of 100,000,000 (612,490,866.91 less 412,490,866.91, halved) has a unit of 100,000,000", honestRound(512_490_866.91, 412_490_866.91, 612_490_866.91) === 500_000_000);
check("a figure at either end of its range, or in a range of no width, is accepted", honestRound(73_900, 73_900, 81_100) === 74_000 && honestRound(81_100, 73_900, 81_100) === 81_000 && honestRound(5_000, 5_000, 5_000) === 5_000);
check("refused: a high end alone, a figure below its range, an infinite high end, a range too wide to measure, an infinite figure, an infinite or a part unit", refuses(() => honestUnit(76_400, undefined, 81_100)) && refuses(() => honestUnit(50_000, 73_900, 81_100)) && refuses(() => honestUnit(5, 0, Infinity)) && refuses(() => honestUnit(0, -1e308, 1e308)) && refuses(() => honestUnit(Infinity)) && refuses(() => roundToUnit(740, Infinity)) && refuses(() => roundToUnit(740, 0.1)) && refuses(() => roundToUnit(Infinity, 10)));
check("a decimal half stored a hair low rounds up: 0.29 x 1,450 (420.49999999999994) prints 421, as 420.5 does", honestRound(0.29 * 1450) === 421 && honestRound(420.5) === 421);
check("the cap binds: [12.34, 56.78] is one decimal, 12.345 under a cap of 2 is two, 12.3456 under a cap of 0 is none", decimalsForColumn([12.34, 56.78]) === 1 && decimalsForColumn([12.345], 2) === 2 && decimalsForColumn([12.3456], 0) === 0);
check("the most precise member sets the column wherever it sits", decimalsForColumn([28.9, 26]) === 1 && decimalsForColumn([26, 28.9, 12]) === 1);
check("noise on a figure is not a decimal: [0.1 + 0.2 - 0.3, 4] and [29.999999999999996, 40] have none, 0.1 + 0.2 under a cap of 4 has one", decimalsForColumn([0.1 + 0.2 - 0.3, 4]) === 0 && decimalsForColumn([29.999999999999996, 40]) === 0 && decimalsForColumn([0.1 + 0.2], 4) === 1);
check("an infinite figure in a column is refused", refuses(() => decimalsForColumn([Infinity])));
check("remainders 3e-7 apart are not a tie: 20.4000001, 20.4000004, 59.1999995 print 20, 21, 59", largestRemainder([20.4000001, 20.4000004, 59.1999995]).join(",") === "20,21,59");
check("the total is used: 1, 1, 1 of 10 is 4, 3, 3 and 1, 2, 3 of 1,000 is 167, 333, 500", largestRemainder([1, 1, 1], 10).join(",") === "4,3,3" && largestRemainder([1, 2, 3], 1000).join(",") === "167,333,500");
check("a negative first share and a negative total are refused, and a -0 share prints as 0", refuses(() => largestRemainder([-1, 50, 51])) && refuses(() => largestRemainder([1, 1], -10)) && Object.is(largestRemainder([-0, 5, 5])[0], 0));
check("the cap of three significant figures holds with a range: 28,308.52 in 28,250 to 28,350 prints 28,300; -13,756.27 in -13,761 to -13,751 prints -13,800; it counts the figure's digits, not the range's: 9,950 in 9,940 to 10,100 prints 9,950; two when asked: 13,756.27 in 13,751 to 13,761 has a unit of 1,000", honestRound(28_308.52, 28_250, 28_350) === 28_300 && honestRound(-13_756.27, -13_761, -13_751) === -13_800 && honestRound(9_950, 9_940, 10_100) === 9_950 && honestUnit(13_756.27, 13_751, 13_761, 2) === 1_000);
check("one rounding, not two: 13,480 in 11,534 to 15,558 prints 13,000, not 14,000 by way of 13,500; 28,349.6 prints 28,300 with or without the range 28,250 to 28,350, not 28,400 by way of 28,350", honestRound(13_480, 11_534, 15_558) === 13_000 && honestRound(28_349.6, 28_250, 28_350) === 28_300 && honestRound(28_349.6) === 28_300);
check("a print may land outside its raw range by less than half a unit and still sits on the unit: 74,200 in 74,200 to 78,200 prints 74,000; 78,800 in 74,200 to 78,800 prints 79,000", honestRound(74_200, 74_200, 78_200) === 74_000 && honestRound(78_800, 74_200, 78_800) === 79_000);
check("remainders equal in decimal tie on the grid whichever side floating point leaves them: 20.4, 14.4, 65.2 (two remainders of .4) print 21, 14, 65", largestRemainder([20.4, 14.4, 65.2]).join(",") === "21,14,65");
check("noise on a negative figure is not a decimal either: -299,264.78 under a cap of 3 has two", decimalsForColumn([-299_264.78], 3) === 2);
check("the cap binds when the capped figure ends in a zero: 12.04 with 40 under a cap of 1 has one decimal; an empty column has none", decimalsForColumn([12.04, 40]) === 1 && decimalsForColumn([]) === 0);
check("whole shares split exactly, a decimal tie a tie wherever floating point leaves it: [13062, 5348, 1547, 523] of 100 is 64, 26, 8, 2 (remainders .78, .11, .55, .55; the earlier of the tied rows gets the unit)", largestRemainder([13062, 5348, 1547, 523]).join(",") === "64,26,8,2");
check("shares may be fractions of a whole: 0.3 and 0.6 print 33 and 67", largestRemainder([0.3, 0.6]).join(",") === "33,67");
check("fractional shares use the total too, and a -0 among them prints as 0: 0.3 and 0.6 of 10 are 3 and 7; -0, 0.25, 0.75 of 4 are 0, 1, 3", largestRemainder([0.3, 0.6], 10).join(",") === "3,7" && (() => { const x = largestRemainder([-0, 0.25, 0.75], 4); return Object.is(x[0], 0) && x.join(",") === "0,1,3"; })());
check("a unit is a whole number, and one significant figure is allowed: roundToUnit at 2.5 is refused, 13,756 at one significant figure has a unit of 10,000", refuses(() => roundToUnit(740, 2.5)) && honestUnit(13_756, undefined, undefined, 1) === 10_000);
check("the allowances stay a hair: a half-width of 999,999.99 keeps a unit of 100,000 (honestUnit of 0 in -999,999.99 to 999,999.99), and 4,149,999.99 a penny under a half of 100,000 prints 4,100,000", honestUnit(0, -999_999.99, 999_999.99) === 100_000 && honestRound(4_149_999.99, 4_049_999.99, 4_249_999.99) === 4_100_000);
if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/precision: all pass");
