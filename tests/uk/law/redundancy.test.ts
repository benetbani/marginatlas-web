/**
 * Statutory redundancy pay and notice (Employment Rights Act 1996 sections 86, 155 and 162; the weekly cap of 2026-27).
 *
 * Run: npx tsx tests/uk/law/redundancy.test.ts
 */
import { statutoryRedundancyPay, statutoryNoticeWeeks } from "../../../src/lib/uk/law/redundancy";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-redundancy";
const FILE = "src/lib/uk/law/redundancy.ts";
const REMEDY = "fix redundancy.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("barber, 30, four years, 500 a week: 2,000.00, at the full 500", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 500 }); return x.pay === 2000 && x.weeklyPayUsed === 500; })());
check("same on 800 a week: the cap of 751 gives 3,004.00 (four weeks of 751)", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 800 }); return x.pay === 3004 && x.weeklyPayUsed === 751 && x.weeks === 4; })());
check("62, 25 years, 900 a week: the most anyone gets, 30 weeks of 751 = 22,530.00", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 62, wholeYears: 25, weeklyPay: 900 }); return x.pay === 22_530 && x.weeks === 30 && x.weeklyPayUsed === 751; })());
check("23, three years, 400: two weeks (one year at 22, two under 22) = 800.00", statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 3, weeklyPay: 400 }).pay === 800);
check("45, ten years, 600: twelve weeks = 7,200.00", statutoryRedundancyPay({ ageAtDismissal: 45, wholeYears: 10, weeklyPay: 600 }).pay === 7200);
check("under two years: nothing and no weeks, with the capped week's pay still reported (500; 751 for 800)", (() => { const a = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 1, weeklyPay: 500 }); const b = statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 1, weeklyPay: 800 }); return a.pay === 0 && a.weeks === 0 && a.weeklyPayUsed === 500 && b.pay === 0 && b.weeks === 0 && b.weeklyPayUsed === 751; })());
check("notice: none under a month, one week to two years, a week a year to twelve", [0.5, 12, 24, 60, 200].map(statutoryNoticeWeeks).join(",") === "0,1,2,5,12");
check("23, exactly two years, 200.19 a week: 22 throughout the last year (1 week), 21 the one before (0.5): 1.5 weeks = 300.29, the half penny rounded up (rounding the binary product gives 300.28); 200.181 gives 300.27 (not up to 300.28) and 200.186 gives 300.28 (the week's pay unrounded: rounding it first gives 300.29)", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 2, weeklyPay: 200.19 }); return x.weeks === 1.5 && x.pay === 300.29 && statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 2, weeklyPay: 200.181 }).pay === 300.27 && statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 2, weeklyPay: 200.186 }).pay === 300.28; })());
check("notice edges: a month gives a week; 35 months is two whole years (2); 143 months is 11, 144 is 12", [1, 35, 143, 144].map(statutoryNoticeWeeks).join(",") === "1,2,11,12");
check("45, 25 years, 900 a week: only the last 20 years count (4 at 1.5, 16 at 1): 22 weeks = 16,522.00 (all 25 would be 26)", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 45, wholeYears: 25, weeklyPay: 900 }); return x.pay === 16_522 && x.weeks === 22; })());
check("the age is the one on the day after the last day of employment: born 1 January, last day 31 December, so 42 the next day and 41 all the last year: two years at 600 a week are 2.5 weeks = 1,500.00", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 42, wholeYears: 2, weeklyPay: 600 }); return x.weeks === 2.5 && x.pay === 1500; })());
check("no upper age: 66, twenty years, 400 a week: 30 weeks = 12,000.00 (the cuts from 64 and the bar at 65 were repealed on 1 October 2006)", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 66, wholeYears: 20, weeklyPay: 400 }); return x.pay === 12_000 && x.weeks === 30; })());
check("zero is allowed where it means something: no whole years, no week's pay and no months of service give nothing", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 0, weeklyPay: 500 }).pay === 0 && statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 0 }).pay === 0 && statutoryNoticeWeeks(0) === 0);
/** The guards throw a RangeError; pennies throws a plain Error on a NaN, which would hide a missing guard. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("years must be whole and not negative: 2.5 (which would count three) and -1 are refused", refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 2.5, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: -1, weeklyPay: 500 })));
check("an age must be a finite number and not negative: NaN and Infinity (which would pay every year at 1.5 weeks) and -1 are refused, and under two years too", refuses(() => statutoryRedundancyPay({ ageAtDismissal: Number.NaN, wholeYears: 1, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: Number.NaN, wholeYears: 4, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: Infinity, wholeYears: 4, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: -1, wholeYears: 4, weeklyPay: 500 })));
check("a week's pay must be a finite number and not negative: NaN, Infinity (which the cap would hide) and -500 are refused, and under two years too", refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: Number.NaN })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: Infinity })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: -500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 1, weeklyPay: Number.NaN })));
check("notice months must be a finite number and not negative: NaN, Infinity and -1 are refused", refuses(() => statutoryNoticeWeeks(Number.NaN)) && refuses(() => statutoryNoticeWeeks(Infinity)) && refuses(() => statutoryNoticeWeeks(-1)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/redundancy: all pass");
