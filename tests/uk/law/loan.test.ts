/**
 * The repayment of a fixed-rate loan (the annuity formula), to the penny.
 *
 * Run: npx tsx tests/uk/law/loan.test.ts
 */
import { annuity } from "../../../src/lib/uk/law/loan";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-loan";
const FILE = "src/lib/uk/law/loan.ts";
const REMEDY = "fix loan.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const loan = annuity({ principal: 25_000, annualRatePct: 7.5, months: 60 });
check("25,000 at 7.5% over five years: 500.95 a month", loan.monthly === 500.95);
check("30,056.92 repaid in all, 5,056.92 of interest", loan.totalRepaid === 30_056.92 && loan.interest === 5056.92);
check("no interest: the principal over the months, repaid exactly (1,000 over three months is 333.33 a month and 1,000.00 in all, not 999.99)", (() => { const a = annuity({ principal: 12_000, annualRatePct: 0, months: 24 }); const b = annuity({ principal: 1000, annualRatePct: 0, months: 3 }); return a.monthly === 500 && a.totalRepaid === 12_000 && a.interest === 0 && b.monthly === 333.33 && b.totalRepaid === 1000 && b.interest === 0; })());
check("one month: the principal and a month's interest (1,000 at 12%: 1,010.00, 10.00 of interest)", (() => { const x = annuity({ principal: 1000, annualRatePct: 12, months: 1 }); return x.monthly === 1010 && x.totalRepaid === 1010 && x.interest === 10; })());
check("nothing borrowed: nothing to repay", (() => { const x = annuity({ principal: 0, annualRatePct: 7.5, months: 60 }); return x.monthly === 0 && x.totalRepaid === 0 && x.interest === 0; })());
check("a rate of 1e-13 %, where 1 + r is exactly 1 in floating point: still the principal over the months (416.67 a month, 25,000.00 in all), not a division by zero", (() => { const x = annuity({ principal: 25_000, annualRatePct: 1e-13, months: 60 }); return x.monthly === 416.67 && x.totalRepaid === 25_000 && x.interest === 0; })());
check("tiny rates, where 1 + r keeps only a few digits of r: 25,000 over five years at 1e-12 %, 1.2e-9 % and 1e-10 % is 416.67 a month and 25,000.00 in all (the plain form gives 390.94, 416.63 and 417.00); at 0.0009 % it is 416.68 and 25,000.57, 0.57 of interest, not the principal over the months", [1e-12, 1.2e-9, 1e-10].every((annualRatePct) => { const x = annuity({ principal: 25_000, annualRatePct, months: 60 }); return x.monthly === 416.67 && x.totalRepaid === 25_000 && x.interest === 0; }) && (() => { const x = annuity({ principal: 25_000, annualRatePct: 0.0009, months: 60 }); return x.monthly === 416.68 && x.totalRepaid === 25_000.57 && x.interest === 0.57; })());
check("rounding is to the nearest penny: 5,000 at 8% over five years is 101.38 a month (101.382 exact), 6,082.92 in all (6,082.918), 1,082.92 of interest", (() => { const x = annuity({ principal: 5000, annualRatePct: 8, months: 60 }); return x.monthly === 101.38 && x.totalRepaid === 6082.92 && x.interest === 1082.92; })());
check("a half penny rounds up: 1,021.50 at 12% for a month is 1,031.715, so 1,031.72 and 10.22 of interest (rounding the binary figure gives 1,031.71); 1,001.10 at no interest over 60 months is 16.685, so 16.69, and 1,001.10 in all", (() => { const x = annuity({ principal: 1021.5, annualRatePct: 12, months: 1 }); const z = annuity({ principal: 1001.1, annualRatePct: 0, months: 60 }); return x.monthly === 1031.72 && x.totalRepaid === 1031.72 && x.interest === 10.22 && z.monthly === 16.69 && z.totalRepaid === 1001.1 && z.interest === 0; })());
/** The guards throw a RangeError; pennies throws a plain Error on a NaN or an infinity, which would hide a missing guard. */
const refuses = (f: () => unknown) => { try { f(); return false; } catch (e) { return e instanceof RangeError; } };
check("a principal must be a finite number and not negative: NaN, Infinity and -1 are refused", [Number.NaN, Infinity, -1].every((principal) => refuses(() => annuity({ principal, annualRatePct: 7.5, months: 60 }))));
check("a rate must be a finite number and not negative: NaN, Infinity and -1 are refused", [Number.NaN, Infinity, -1].every((annualRatePct) => refuses(() => annuity({ principal: 25_000, annualRatePct, months: 60 }))));
check("months must be a whole number, at least one: 0, -1, 1.5, NaN and Infinity are refused", [0, -1, 1.5, Number.NaN, Infinity].every((months) => refuses(() => annuity({ principal: 25_000, annualRatePct: 7.5, months }))));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/loan: all pass");
