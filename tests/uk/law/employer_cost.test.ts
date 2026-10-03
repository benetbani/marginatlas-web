/**
 * One hire all in (Pro section 77), against the law research's worked examples of 2026-10-02.
 *
 * Run: npx tsx tests/uk/law/employer_cost.test.ts
 */
import { annualGross, hireAllIn } from "../../../src/lib/uk/law/employer_cost";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-employer-cost";
const FILE = "src/lib/uk/law/employer_cost.ts";
const REMEDY = "fix employer_cost.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const nlw = annualGross(12.71, 37.5);
check("living wage, 37.5 hours, 52 weeks: 24,784.50", nlw === 24_784.5);
const a = hireAllIn({ gross: nlw, age: 30 });
check("employer NI 2,967.68, pension 556.34", a.employerNi === 2967.68 && a.pension === 556.34);
check("all in without the allowance: 28,308.52", a.allIn === 28_308.52);
const b = hireAllIn({ gross: nlw, age: 30, allowanceRemaining: 10_500 });
check("all in with the allowance: 25,340.84", b.allIn === 25_340.84 && b.allowanceUsed === 2967.68);
const c = hireAllIn({ gross: 30_000, age: 40 });
check("30,000: 3,750.00 NI, 712.80 pension, 34,462.80 all in", c.employerNi === 3750 && c.pension === 712.8 && c.allIn === 34_462.8);
check("30,000 with the allowance: 30,712.80", hireAllIn({ gross: 30_000, age: 40, allowanceRemaining: 10_500 }).allIn === 30_712.8);
const d = hireAllIn({ gross: annualGross(10.85, 37.5), age: 20 });
check("an 18 to 20 year old at 10.85: 21,157.50, no employer NI, no pension", d.gross === 21_157.5 && d.employerNi === 0 && d.pension === 0 && d.allIn === 21_157.5);
const e = hireAllIn({ gross: annualGross(8, 30), age: 23, apprentice: true });
check("an apprentice of 23: no employer NI below 50,270", e.employerNi === 0);
check("a part-timer on 9,000 is not auto-enrolled", hireAllIn({ gross: 9_000, age: 30 }).pension === 0);
check("the allowance never makes the bill smaller than the pay", hireAllIn({ gross: 6_000, age: 30, allowanceRemaining: 10_500 }).allIn === 6_000);
// Every boundary, on 30,000 of pay unless stated (figures computed independently in Python, 2026-10-03).
check("the under-21 relief ends at 21: 20 pays no employer NI, 21 pays 3,750.00", hireAllIn({ gross: 30_000, age: 20 }).employerNi === 0 && hireAllIn({ gross: 30_000, age: 21 }).employerNi === 3750);
check("an apprentice's relief ends at 25: 24 pays no employer NI, 25 pays 3,750.00", hireAllIn({ gross: 30_000, age: 24, apprentice: true }).employerNi === 0 && hireAllIn({ gross: 30_000, age: 25, apprentice: true }).employerNi === 3750);
check("auto-enrolment starts at 22: 21 has no pension, 22 has 712.80", hireAllIn({ gross: 30_000, age: 21 }).pension === 0 && hireAllIn({ gross: 30_000, age: 22 }).pension === 712.8);
check("auto-enrolment ends at State Pension age: 65 has 712.80, 66 has none", hireAllIn({ gross: 30_000, age: 65 }).pension === 712.8 && hireAllIn({ gross: 30_000, age: 66 }).pension === 0);
check("auto-enrolment needs more than 10,000: none at 10,000.00, 112.80 at 10,000.01", hireAllIn({ gross: 10_000, age: 30 }).pension === 0 && hireAllIn({ gross: 10_000.01, age: 30 }).pension === 112.8);
const top = hireAllIn({ gross: 60_000, age: 40 });
check("the pension stops at 50,270: on 60,000 it is 3% of 44,030 = 1,320.90; NI 8,250.00; all in 69,570.90", top.pension === 1320.9 && top.employerNi === 8250 && top.allIn === 69_570.9);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("an age that is not a number, and a negative pay, are refused", refuses(() => hireAllIn({ gross: 30_000, age: Number.NaN })) && refuses(() => hireAllIn({ gross: -100, age: 30 })));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/employer_cost: all pass");
