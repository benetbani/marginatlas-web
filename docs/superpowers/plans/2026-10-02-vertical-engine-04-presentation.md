# Presentation Maths for the UK Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every figure on the vertical the precision it has earned, columns one decimal count, shares that add to their whole, and ranks that tie where the data cannot separate them.

**Architecture:** Two pure modules under `src/lib/uk/present/`, each with a gate. No data, no rendering: plan 06 calls them where pages print figures. The placement sentence (`src/lib/spine/placement.ts`) is already defended by `tests/spine/placement.test.ts` (every pair up to 200 members) and is not touched.

**Tech Stack:** TypeScript 5 (strict), run by `tsx`; the website's prebuild chain.

---

## Before you start (read once)

- Work in `E:/atlas/website`, its own git repository. Run every command from that folder. The master plan,
  `docs/superpowers/plans/2026-10-02-vertical-engine-00-master.md`, holds the mathematics each task implements; each task
  below repeats the part it needs.
- Tests here are self-running TypeScript scripts, not a framework: `npx tsx tests/<path>.test.ts` prints one `PASS  <label>`
  line per check. On a failure it prints `x <rule> <file>: <label>. Remedy: <remedy>` through `scripts/lib/red` and exits 1.
  That shape is required: the chain's gate-reds ratchet (`node scripts/audit_gate_reds.mjs`) fails when a newly wired test's
  red lacks a file, a rule or a remedy. Every test below has it (checked on 2026-10-02 with the census's own classifier);
  keep it when you edit one.
- A test nothing runs is not coverage: each task wires its test into the `GATES` array of `scripts/prebuild_all.ts`, then
  regenerates the counts. `npx tsx scripts/counts.ts --write` rewrites the counts blocks of `CLAUDE.md`,
  `docs/verification-protocol.md` and `docs/loop/02-ORGANISATION-RESEARCH.md` and the registry `scripts/gates.json`; the
  `counts-fresh` gate fails the chain when they are stale, so those four files are in every wiring commit.
- Never pipe a verification command into a filter (a pipe reports the filter's exit code, not the command's). Run it bare,
  or redirect to a file and read the file.
- The expected figures were computed independently (Python, decimal arithmetic, half-up at the penny) and agreed with this
  code to the penny on 2026-10-02. Never change an expected figure to make a test pass. Fix the code, or stop and report.
- Commits: one per task, never pushed by this plan. The website sits on `main`: before task 1, create the plan's branch
  (`git switch -c vertical-engine`, or switch to it if an earlier plan made it). The controlling session commits; a
  subagent executing a task stops before its commit step and reports. Never `--no-verify`.

## File structure

| File | Responsibility |
|---|---|
| `src/lib/uk/present/precision.ts` | `honestUnit`, `roundToUnit`, `honestRound`, `decimalsForColumn`, `largestRemainder` |
| `src/lib/uk/present/compare.ts` | `rankWithTies`, `medianExcludingFills` |
| `tests/uk/present/*.test.ts` | one test per module, one gate each |

### Task 1: Honest precision

A figure prints no finer than its uncertainty and no more than three significant figures, by the measurement convention:
the half-width `h = (hi - lo) / 2` of its range is good to one digit, so the figure prints at that digit's place,
`u = 10^floor(log10 h)`, and never finer than its third significant figure. The printed figure then lies within its range
widened by half a unit. London restaurants' median 281,900 (rounding range 280,300 to 283,500, h = 1,600) prints 282,000;
Camden's hair and beauty median 76,400 (73,900 to 81,100, h = 3,600) prints 76,000; the London restaurant at the median
keeps 13,756.27, 11,534 to 15,558 across the band shapes (plan 03, task 7), and prints 14,000; an exact law figure such as
28,308.52 prints 28,300 on a card (the itemised bill keeps its pennies). An earlier version rounded to the first power of
ten at least the range's whole width; it printed that take-home as 10,000, a quarter off, and was replaced on 2026-10-02.
A column prints one count of decimals for every row (the most any member needs, capped at one). Shares of a whole print as
integers that sum to the whole by the largest-remainder method: floor every share, then give one to each of the largest
remainders until the total is reached (18.4, 14.2, 11.3, 10.9, 7.1, 6.8, 31.3 print as 19, 14, 11, 11, 7, 7, 31).
Rounding is half away from zero, as pennies rounds, so a loss prints as the same profit does (-4,500 to the 1,000 is -5,000,
where Math.round gives -4,000) and nothing prints as -0. A half-width that is a power of ten in decimal can land a hair below
it in floating point (3,234.14 - 1,234.14 is 1,999.9999999999998), so the unit allows a relative 1e-9. A range must hold its
figure between two finite ends: an infinite end would hang the loop that widens the unit. A column's decimals allow
floating-point noise in proportion to the figure (100 x 299,264.78 is 29,926,478.000000004), and remainders are compared on
a grid of 1e-9, so 4, 1, 1 of 100 prints 67, 17, 16 as the tie rule says (raw floating point gave 66, 17, 17). Four of nine
deliberate faults passed the first version of this test. Its review of 2026-10-03 found 36 more that passed the hardened
one, none printing a wrong figure from the code as written: the column cap and the column's maximum, the significant-figure
cap on losses and below 28,308.52, the allowance from above (half-widths of 950 and 999.5 have a unit of 100; exactly
100,000, and 100,000,000, have their own), both ends of the range, the total and the tie rule's direction. The test now pins
them, and four hardenings went in: a range too wide to measure is refused (-1e308 to 1e308 overflowed the half-width and
the loop never ended); a decimal half stored a hair low rounds up (0.29 x 1,450 prints 421, as 420.5 does); units are
whole numbers; a -0 share prints as 0. The finite-ends clause went, since an infinite end now fails the half-width check.
Its second review found five shapes of a wrong implementation that still passed (the cap skipped when a range is given,
two roundings where one is specified, the tie grid snapped down, the print clamped into its raw range, noise tolerance on a
negative figure): nine checks pin them, and the header says the tie grid is exact for totals up to 100,000 (not a
million). All 50 deliberate faults fail it.

**Files:**
- Create: `src/lib/uk/present/precision.ts`
- Test: `tests/uk/present/precision.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/present/precision.test.ts`:

```ts
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
check("each worked example prints inside its range widened by half its unit, and within half a unit of the figure", ([[281_900, 280_300, 283_500], [76_400, 73_900, 81_100], [13_756.27, 11_534, 15_558], [76_400, 50_000, 110_000]] as const).every(([v, lo, hi]) => { const u = honestUnit(v, lo, hi), p = honestRound(v, lo, hi); return Math.abs(p - v) <= u / 2 && lo - u / 2 <= p && p <= hi + u / 2; }));
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
check("shares may be fractions of a whole: 0.3 and 0.6 print 33 and 67", largestRemainder([0.3, 0.6]).join(",") === "33,67");
check("a unit is a whole number, and one significant figure is allowed: roundToUnit at 2.5 is refused, 13,756 at one significant figure has a unit of 10,000", refuses(() => roundToUnit(740, 2.5)) && honestUnit(13_756, undefined, undefined, 1) === 10_000);
check("the allowances stay a hair: a half-width of 999,999.99 keeps a unit of 100,000 (honestUnit of 0 in -999,999.99 to 999,999.99), and 4,149,999.99 a penny under a half of 100,000 prints 4,100,000", honestUnit(0, -999_999.99, 999_999.99) === 100_000 && honestRound(4_149_999.99, 4_049_999.99, 4_249_999.99) === 4_100_000);
if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/precision: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/present/precision.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/present/precision'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/present/precision.ts`:

```ts
/**
 * src/lib/uk/present/precision.ts
 *
 * How many digits a figure may print, decided by what the figure knows, never by taste.
 *
 * HONEST UNIT, the measurement convention: a figure with an uncertainty range [lo, hi] (rounding in the register, an
 * interval, the spread of a model's assumptions) prints at the place of the leading digit of its half-width
 * h = (hi - lo) / 2, so u = 10^floor(log10 h): the uncertainty is good to one digit, and the figure is printed to that
 * digit's place, no finer. The printed figure is then within the range widened by half a unit. And never more than three
 * significant figures, whatever the range: "281,900" claims a precision a reader cannot use; "282,000" does not.
 *   London restaurants' median 281.9k, range 280.3k to 283.5k (h = 1.6k): u = 1,000, prints 282,000.
 *   Camden's hair and beauty median 76.4k, range 73.9k to 81.1k (h = 3.6k): u = 1,000, prints 76,000.
 *   A London restaurant at the median keeps 13,756, 11,534 to 15,558 across the band shapes (h = 2,012): prints 14,000.
 *   A living-wage hire, exact law, no range: three significant figures, 28,300.
 * A half-width that is a power of ten in decimal can land a hair below it in floating point (3,234.14 - 1,234.14 is
 * 1,999.9999999999998), so the comparison allows a relative 1e-9. A range must hold its figure between two finite ends:
 * one end, an end that is not a finite number (an infinite one would widen the unit forever) or a figure outside its
 * range is refused, never printed as if exact.
 *
 * ROUNDING is half away from zero, as pennies rounds, so a loss rounds as the same profit does (-4,500 to the 1,000 is
 * -5,000, not -4,000), and a figure that rounds to nothing is 0, never -0 (which a formatter prints as "-0"). As pennies
 * adds 1e-7 of a penny, a hair of 1e-9 of the unit is added first, so a decimal half stored a hair low still rounds up
 * (0.29 x 1,450 is 420.49999999999994 in floating point and prints 421, as 420.5 does). Units are whole numbers, 1 at the
 * least: the module prints money-sized figures, and a share is printed through its percentage.
 *
 * ONE COLUMN, ONE DECIMAL COUNT (MODEL PART 5): a column prints every value with the decimals its most precise member
 * needs, up to a cap, so 26 and 28.9 print as 26.0 and 28.9. A value has k decimals when 10^k times it is a whole number
 * to within floating-point noise, which grows with the number: 1e-13 of it, at least 1e-9 (100 x 299,264.78 is
 * 29,926,478.000000004).
 *
 * SHARES THAT ADD UP: largest remainder. Floor every share, then hand the missing units to the largest remainders (ties to
 * the earlier row), so a split of 100 prints as integers that sum to 100. Remainders are compared on a grid of 1e-9, so
 * two that are equal in decimal tie even when floating point leaves them a few ulps apart (4, 1, 1 of 100: each has two
 * thirds over, and the first two rows get the units); the grid is exact for totals up to 100,000 (at a million, three
 * splits in 1.5 million random ones part from the exact rule by a unit). The two 1e-9 allowances can show only at units of
 * ten million and above.
 */
export function honestUnit(value: number, lo?: number, hi?: number, maxSigFigs = 3): number {
  if (!Number.isFinite(value)) throw new RangeError(`honestUnit: not a finite figure (${value})`);
  const ranged = lo !== undefined || hi !== undefined;
  const l = lo ?? Number.NaN, h = hi ?? Number.NaN;
  // a NaN or missing end fails both comparisons; an infinite end makes the half-width infinite, refused below
  if (ranged && !(l <= value && value <= h)) throw new RangeError(`honestUnit: a range needs two ends around its figure (${lo} to ${hi}, figure ${value})`);
  if (!Number.isInteger(maxSigFigs) || maxSigFigs < 1) throw new RangeError(`honestUnit: not a count of significant figures (${maxSigFigs})`);
  const half = ranged ? (h - l) / 2 : 0;
  if (!Number.isFinite(half)) throw new RangeError(`honestUnit: a range with an infinite end, or too wide to measure (${lo} to ${hi})`);
  let u = 1;
  while (u * 10 <= half * (1 + 1e-9)) u *= 10;
  const magnitude = Math.abs(value) > 0 ? Math.floor(Math.log10(Math.abs(value))) : 0;
  const sigUnit = Math.pow(10, Math.max(0, magnitude - maxSigFigs + 1));
  return Math.max(u, sigUnit);
}

export function roundToUnit(value: number, unit: number): number {
  if (!Number.isFinite(value) || !Number.isInteger(unit) || unit < 1) throw new RangeError(`roundToUnit: not a figure and a whole unit (${value}, ${unit})`);
  const q = Math.round(Math.abs(value) / unit + 1e-9) * unit;
  return q === 0 ? 0 : Math.sign(value) * q;
}

export function honestRound(value: number, lo?: number, hi?: number): number {
  return roundToUnit(value, honestUnit(value, lo, hi));
}

export function decimalsForColumn(values: readonly number[], cap = 1): number {
  if (!Number.isInteger(cap) || cap < 0) throw new RangeError(`decimalsForColumn: not a cap (${cap})`);
  let d = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) throw new RangeError(`decimalsForColumn: not a finite figure (${v})`);
    for (let k = 0; k <= cap; k++) {
      const x = v * Math.pow(10, k);
      if (Math.abs(x - Math.round(x)) <= Math.max(1e-9, Math.abs(x) * 1e-13)) {
        d = Math.max(d, k);
        break;
      }
      if (k === cap) d = cap;
    }
  }
  return d;
}

export function largestRemainder(shares: readonly number[], total = 100): number[] {
  if (!Number.isInteger(total) || total < 0) throw new RangeError(`largestRemainder: not a whole total (${total})`);
  for (let i = 0; i < shares.length; i++) {
    const s = shares[i];
    if (!Number.isFinite(s) || s < 0) throw new RangeError(`largestRemainder: share ${i + 1} is not a share (${s})`);
  }
  const sum = shares.reduce((a, b) => a + b, 0);
  if (sum <= 0) return shares.map(() => 0);
  const exact = shares.map((s) => (s / sum) * total);
  const floors = exact.map((e) => Math.floor(e) + 0); // + 0 turns a -0 share into 0
  let missing = total - floors.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: Math.round((e - Math.floor(e)) * 1e9) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const { i } of order) {
    if (missing <= 0) break;
    floors[i] += 1;
    missing -= 1;
  }
  return floors;
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/present/precision.test.ts
```

Expected: 47 lines starting `PASS`, the last line `uk/present/precision: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "facts-confidence", script: "tests/facts/confidence.test.ts" },
```

and add directly below it:

```ts
  /* The UK pages' presentation maths (docs/superpowers/plans/2026-10-02-vertical-engine-04-presentation.md):
     a figure prints no finer than it is known; shares add to their whole; ranks tie when intervals overlap. */
  { name: "uk-present-precision", script: "tests/uk/present/precision.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-present-precision
```

Expected: a line `✓ uk-present-precision` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/present/precision.ts tests/uk/present/precision.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk present: honest precision, one decimal count per column, shares that add to 100 (gate uk-present-precision)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 2: Ranks with ties, and set medians without fill values

A member shares the rank of the group above when its interval overlaps that group's leader's; otherwise it starts a new
group. Overlap is the conservative test (two 95% intervals that do not overlap imply p below about 0.006 for equal standard
errors), so no member is ranked below a leader the data cannot tell it apart from: pubs (24.3 to 27.8 per 1,000) and bars
(23.0 to 28.6) share restaurants' rank, dental practices (0.8 to 1.9) stand alone at the bottom. A set's median uses only members whose figure is
their own; fill values are counted and left out, and a set of fills only has no median (MODEL PART 9, clause 46).
Intervals are closed (two that touch at one point are level); a member is compared with its group's head, not the member
above it (8, 7 to 9, under 9.5, 8.5 to 10.5, under 11, 10 to 12, ranks 3); every interval must hold its figure. An even
count's median is the mean of the middle two, figures sort as numbers (9, 10 and 100 give 10, where a sort by text gives
100), and an own figure that is not a finite number is refused. Five of seven deliberate faults passed the first version of
this test. Its review of 2026-10-03 found the ranks of members with the same figure depending on the order of the rows (a
tie went to whichever came first, and the leader decides who joins; on rates from small counts that changed a rank in
about one set in twenty-five): members with the same figure are now taken lowest-reaching interval first, then
highest-reaching, so a group that starts among them is led by the one that can be told apart from the fewest members below.
It also found the sort key, later groups, the leader's own fields and both sides of the guard unpinned; an interval's
ends must now be finite, and a member must say whether it is a fill. Its re-review found the tie-break's two keys
unpinned (nine variants passed) and a null figure ranked as 0 once the finite-figure clause was dropped as redundant (it is
redundant only for numbers): the clause is back, and each tie-break key and their order are pinned in both row orders,
with two zero rates (0 of 100 and 0 of 400 under 0.02) among them. The header states only what the rule gives: every
member overlaps its own group's leader, no leader overlaps the leader above, a rank never improves down the list; a member can
still overlap a higher member, even a leader, and rank lower (28.9, 12 and 11 with intervals 27.3 to 30.5, 11 to 13 and 2
to 29 rank 1, 2, 2), so a page marks the top group by rank. Its final re-review found the guard's refusals tested on
one-row sets only (a guard that read the first row alone passed): a bad row is now refused first, between good rows and
last. The header no longer claims the tie-break gives the fewest groups (it does up to four members, not always beyond).
All 41 deliberate faults fail it, the scope variants among them.

**Files:**
- Create: `src/lib/uk/present/compare.ts`
- Test: `tests/uk/present/compare.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (one `GATES` entry)
- Modify (generated by counts.ts): `CLAUDE.md`, `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `scripts/gates.json`

- [ ] **Step 1: Write the failing test**

Create `tests/uk/present/compare.test.ts`:

```ts
/**
 * Comparison: members share a rank only when the lower overlaps its group's leader (overlapping intervals tie); set
 * medians over members' own figures, fill values counted and left out.
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

// the tie-break, both keys and their order, each set in both row orders (figures from the rule by hand)
const P: Row = { id: "P", value: 20, lo: 15, hi: 25 }, T1: Row = { id: "T1", value: 10, lo: 5, hi: 12 }, T2: Row = { id: "T2", value: 10, lo: 5, hi: 20 };
check("same figure, same low end, different high ends: the one that reaches the leader is level with it, in either row order (P 1, T2 1, T1 3)", show(rankWithTies([P, T1, T2])) === "P:1 T2:1= T1:3" && show(rankWithTies([P, T2, T1])) === "P:1 T2:1= T1:3");
const Pz: Row = { id: "P", value: 0.02, lo: 0.012, hi: 0.03 }, Z1: Row = { id: "Z1", value: 0, lo: 0, hi: 0.0369 }, Z2: Row = { id: "Z2", value: 0, lo: 0, hi: 0.0092 };
check("two zero rates, 0 of 100 (0 to 0.0369) and 0 of 400 (0 to 0.0092), under 0.02: the wider one is level with the leader, in either row order", show(rankWithTies([Pz, Z1, Z2])) === "P:1 Z1:1= Z2:3" && show(rankWithTies([Pz, Z2, Z1])) === "P:1 Z1:1= Z2:3");
check("lowest-reaching first: 10 (8 to 12) with 5 (1 to 9) and 5 (4.9 to 5.1) rank 1, 1, 3, in either row order", show(rankWithTies([H, X, Y])) === "H:1 Y:1= X:3" && show(rankWithTies([H, Y, X])) === "H:1 Y:1= X:3");
check("two 10s and a 6: the 10 reaching lowest leads, so the 6 is level with it, in either row order", show(rankWithTies([A, B, C])) === "B:1 A:1= C:1=" && show(rankWithTies([B, A, C])) === "B:1 A:1= C:1=");
const Pq: Row = { id: "P", value: 16, lo: 15, hi: 17 }, TF: Row = { id: "TF", value: 10, lo: 1, hi: 10.5 }, TS: Row = { id: "TS", value: 10, lo: 5, hi: 20 };
check("the low end decides before the high end: 16 (15 to 17), 10 (1 to 10.5) and 10 (5 to 20) rank 1, 2, 2, in either row order", show(rankWithTies([Pq, TF, TS])) === "P:1 TF:2 TS:2=" && show(rankWithTies([Pq, TS, TF])) === "P:1 TF:2 TS:2=");
const bad = (value: unknown, lo = 0, hi = 5) => [{ value: value as number, lo, hi }];
check("a figure that is null, a string, a boolean or an array is refused (a null would compare as 0), and so is an interval open at the bottom", refuses(() => rankWithTies(bad(null))) && refuses(() => rankWithTies(bad(null, -1, 1))) && refuses(() => rankWithTies(bad("3", 2, 5))) && refuses(() => rankWithTies(bad(""))) && refuses(() => rankWithTies(bad(true))) && refuses(() => rankWithTies(bad([]))) && refuses(() => rankWithTies([{ value: 5, lo: -Infinity, hi: 6 }])));
const ra: Row = { id: "a", value: 30, lo: 29, hi: 31 }, rb: Row = { id: "b", value: 20, lo: 19, hi: 21 }, rc: Row = { id: "c", value: 10, lo: 9, hi: 11 };
const firstRanking = rankWithTies([ra, rb, rc]);
rankWithTies([rb, rc]);
check("rows are copied, not written to: a ranking keeps its ranks after the same rows are ranked in another set", show(firstRanking) === "a:1 b:2 c:3" && !("rank" in ra) && !("levelWithAbove" in rb));
const flag = (isFill: unknown) => ({ value: 1, isFill: isFill as boolean });
check("a fill flag of null, 0 or a string is refused, and so is a missing one after good ones", refuses(() => medianExcludingFills([flag(null)])) && refuses(() => medianExcludingFills([flag(0)])) && refuses(() => medianExcludingFills([flag("no")])) && refuses(() => medianExcludingFills([{ value: 1, isFill: false }, { value: 100, isFill: undefined as unknown as boolean }, { value: 3, isFill: false }])));
const okA: Row = { id: "a", value: 9, lo: 8, hi: 10 }, okB: Row = { id: "b", value: 5, lo: 4, hi: 6 };
const badRows: Row[] = [{ id: "x", value: null as unknown as number, lo: 0, hi: 5 }, { id: "x", value: Number.NaN, lo: 0, hi: 1 }, { id: "x", value: "3" as unknown as number, lo: 2, hi: 5 }, { id: "x", value: 5, lo: -Infinity, hi: 6 }, { id: "x", value: -3, lo: -5, hi: null as unknown as number }];
check("a bad row is refused wherever it sits: first, between good rows and last (a null, a NaN, a string, a low end of minus infinity, a missing high end)", badRows.every((x) => refuses(() => rankWithTies([x, okA, okB])) && refuses(() => rankWithTies([okA, x, okB])) && refuses(() => rankWithTies([okA, okB, x]))));
check("the rule is about leaders: 28.9 (27.3 to 30.5), 12 (11 to 13) and 11 (2 to 29) rank 1, 2, 2, though the 11 overlaps the 28.9", show(rankWithTies([{ id: "p", value: 28.9, lo: 27.3, hi: 30.5 }, { id: "q", value: 12, lo: 11, hi: 13 }, { id: "r", value: 11, lo: 2, hi: 29 }])) === "p:1 q:2 r:2=");
check("an own figure equal to a fill's value is kept, and a bad own figure in the middle of a set is refused", (() => { const m = medianExcludingFills([{ value: 6, isFill: false }, { value: 6, isFill: true }, { value: 8, isFill: false }]); return m.median === 7 && m.used === 2 && m.leftOut === 1; })() && refuses(() => medianExcludingFills([{ value: 1, isFill: false }, { value: Number.NaN, isFill: false }, { value: 3, isFill: false }])));
if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/present/compare: all pass");
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npx tsx tests/uk/present/compare.test.ts
```

Expected: exit code 1 with `Error: Cannot find module '../../../src/lib/uk/present/compare'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/uk/present/compare.ts`:

```ts
/**
 * src/lib/uk/present/compare.ts
 *
 * Ranking members of a like-for-like set when each figure has an interval.
 *
 * LEVEL WITH. Members are sorted by value, highest first. A member is "level with" the group above it when its interval
 * overlaps the interval of that group's first member, its leader; otherwise it starts a new group. Members of one group
 * share a rank (1, 1, 1, 4), and a page that marks "the highest" marks a group, not a member, when the leader is level with
 * the next. What holds by construction: every member overlaps its own group's leader; no leader overlaps the leader of the
 * group above; a rank never improves down the list. It is a rule about leaders, not about every pair: a member can sit in a lower
 * group while overlapping a member, even a leader, of a higher one (28.9 (27.3 to 30.5), 12 (11 to 13) and 11 (2 to 29)
 * rank 1, 2, 2: the 11 overlaps the 28.9 but comes after the 12, which starts the second group). So levelWithAbove means
 * "level with its group's leader", and a page marks the top group by rank, never by levelWithAbove (two identical rows are
 * level in either order, but which of them carries the flag follows the rows). Intervals are closed: two that touch at one
 * point overlap. Members with the same figure are taken lowest-reaching interval first, then highest-reaching, so a group
 * that starts among them is led by the one that can be told apart from the fewest members below it, and no rank depends on
 * the order of the rows (highest-reaching first would leave a member below a leader it overlaps less often, at the price of
 * more groups). Every row's figure and both ends must be finite numbers, the figure between the ends, wherever the row
 * sits in the list: anything else is refused (a null would otherwise compare as 0, and the overlap test means nothing for
 * it).
 *
 * SET STATISTICS WITHOUT FILLS. A set's median is taken over members whose figure is their own: a member carrying a fill
 * value (a default written in for a missing figure) is left out, and the count left out is returned, so a "world median"
 * can never be the fill value itself (PART 9 clause 46). An own figure that is not a finite number is refused, and so is a
 * member that does not say whether it is a fill.
 */
export type Ranked<T> = T & { rank: number; levelWithAbove: boolean };

export function rankWithTies<T extends { value: number; lo: number; hi: number }>(rows: readonly T[]): Ranked<T>[] {
  for (const r of rows) {
    // all three finite numbers (a null figure would compare as 0), the figure between the ends
    if (!(Number.isFinite(r.value) && Number.isFinite(r.lo) && Number.isFinite(r.hi) && r.lo <= r.value && r.value <= r.hi)) throw new RangeError(`rankWithTies: ${r.value} is not a figure inside its interval ${r.lo} to ${r.hi}`);
  }
  const sorted = [...rows].sort((a, b) => b.value - a.value || a.lo - b.lo || b.hi - a.hi);
  const out: Ranked<T>[] = [];
  let groupHead: T | null = null;
  let rank = 0;
  sorted.forEach((r, i) => {
    // r.lo <= groupHead.hi always holds once sorted (r.lo <= r.value <= head.value <= head.hi); it is kept for the reader
    const overlaps = groupHead !== null && r.hi >= groupHead.lo && r.lo <= groupHead.hi;
    if (!overlaps) {
      groupHead = r;
      rank = i + 1;
    }
    out.push({ ...r, rank, levelWithAbove: overlaps });
  });
  return out;
}

export function medianExcludingFills(values: readonly { value: number; isFill: boolean }[]): { median: number | null; used: number; leftOut: number } {
  if (values.some((v) => typeof v.isFill !== "boolean")) throw new RangeError("medianExcludingFills: every member must say whether its figure is a fill");
  const own = values.filter((v) => !v.isFill).map((v) => v.value);
  if (own.some((x) => !Number.isFinite(x))) throw new RangeError(`medianExcludingFills: an own figure is not a finite number (${own.find((x) => !Number.isFinite(x))})`);
  own.sort((a, b) => a - b);
  const leftOut = values.length - own.length;
  if (own.length === 0) return { median: null, used: 0, leftOut };
  const m = own.length % 2 ? own[(own.length - 1) / 2] : (own[own.length / 2 - 1] + own[own.length / 2]) / 2;
  return { median: m, used: own.length, leftOut };
}
```

- [ ] **Step 4: Run it and watch it pass**

```bash
npx tsx tests/uk/present/compare.test.ts
```

Expected: 33 lines starting `PASS`, the last line `uk/present/compare: all pass`, exit code 0.

- [ ] **Step 5: Wire it into the chain**

In `scripts/prebuild_all.ts`, find this line in `GATES`:

```ts
  { name: "uk-present-precision", script: "tests/uk/present/precision.test.ts" },
```

and add directly below it:

```ts
  { name: "uk-present-compare", script: "tests/uk/present/compare.test.ts" },
```

Then run:

```bash
npx tsx scripts/counts.ts --write
```

Expected: one line beginning `[counts] wrote 3 carrier(s) and scripts/gates.json:` whose gate count is one higher than before this step.

- [ ] **Step 6: Prove the gate runs in the chain and the ratchet holds**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-present-compare
```

Expected: a line `✓ uk-present-compare` and, at the end, `SUBSET: PASS (not the chain; run without --only for the gate)`.

```bash
node scripts/audit_gate_reds.mjs
```

Expected: the last line starts `gate reds: PASS` and ends `the ratchet holds` (the three counts equal the baseline in `scripts/gate_reds_baseline.json`; a new test must not raise them).

- [ ] **Step 7: Commit**

```bash
git add src/lib/uk/present/compare.ts tests/uk/present/compare.test.ts scripts/prebuild_all.ts CLAUDE.md docs/verification-protocol.md docs/loop/02-ORGANISATION-RESEARCH.md scripts/gates.json
git commit -m "uk present: ranks tie where intervals overlap; set medians leave fill values out and count them (gate uk-present-compare)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Expected: one commit; `git status --short` lists none of the files above.

### Task 3: Prove both

**Files:** none changed.

- [ ] **Step 1: Run both gates, typecheck, and the ratchet**

```bash
npx tsx scripts/prebuild_all.ts --only=uk-present-precision,uk-present-compare
npx tsc --noEmit
node scripts/audit_gate_reds.mjs
```

Expected: two `✓` lines and `SUBSET: PASS`; `tsc` prints nothing; the audit's last line starts `gate reds: PASS` and ends
`the ratchet holds`.

- [ ] **Step 2: Record the result**

No commit: both tasks committed. Report the outputs to the controlling session.
