/**
 * Statutory redundancy pay and notice (Employment Rights Act 1996 ss. 86 and 162; the weekly cap of 2026-27).
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

check("barber, 30, four years, 500 a week: 2,000.00", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 500 }).pay === 2000);
check("same on 800 a week: the cap of 751 gives 3,004.00", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: 800 }).pay === 3004);
check("62, 25 years, 900 a week: the most anyone gets, 22,530.00", statutoryRedundancyPay({ ageAtDismissal: 62, wholeYears: 25, weeklyPay: 900 }).pay === 22_530);
check("23, three years, 400: two weeks (one year at 22, two under 22) = 800.00", statutoryRedundancyPay({ ageAtDismissal: 23, wholeYears: 3, weeklyPay: 400 }).pay === 800);
check("45, ten years, 600: twelve weeks = 7,200.00", statutoryRedundancyPay({ ageAtDismissal: 45, wholeYears: 10, weeklyPay: 600 }).pay === 7200);
check("under two years: nothing", statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 1, weeklyPay: 500 }).pay === 0);
check("notice: none under a month, one week to two years, a week a year to twelve", [0.5, 12, 24, 60, 200].map(statutoryNoticeWeeks).join(",") === "0,1,2,5,12");
check("42, exactly two years, 333.33 a week: 41 throughout the last year (1.5 weeks), 40 the one before (1): 2.5 weeks = 833.33, the half penny rounded up", (() => { const x = statutoryRedundancyPay({ ageAtDismissal: 42, wholeYears: 2, weeklyPay: 333.33 }); return x.weeks === 2.5 && x.pay === 833.33; })());
check("notice edges: a month gives a week; 35 months is two whole years (2); 143 months is 11, 144 is 12", [1, 35, 143, 144].map(statutoryNoticeWeeks).join(",") === "1,2,11,12");
/** The guards throw a RangeError; pennies throws a plain Error on a NaN, which would hide a missing guard. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("years must be whole and not negative: 2.5 (which would count three) and -1 are refused", refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 2.5, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: -1, weeklyPay: 500 })));
check("an age must be a number and not negative: NaN (which would pay every year at 1.5 weeks) and -1 are refused", refuses(() => statutoryRedundancyPay({ ageAtDismissal: Number.NaN, wholeYears: 4, weeklyPay: 500 })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: -1, wholeYears: 4, weeklyPay: 500 })));
check("a week's pay must be a number and not negative: NaN and -500 are refused", refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: Number.NaN })) && refuses(() => statutoryRedundancyPay({ ageAtDismissal: 30, wholeYears: 4, weeklyPay: -500 })));
check("notice months must be a number and not negative: NaN and -1 are refused", refuses(() => statutoryNoticeWeeks(Number.NaN)) && refuses(() => statutoryNoticeWeeks(-1)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/redundancy: all pass");
