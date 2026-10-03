/**
 * National Insurance 2026-27: Class 4, Class 1 primary and secondary, the Employment Allowance as one budget.
 *
 * Run: npx tsx tests/uk/law/national_insurance.test.ts
 */
import { class4, employeeClass1, employerClass1, employerNiAfterAllowance } from "../../../src/lib/uk/law/national_insurance";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-national-insurance";
const FILE = "src/lib/uk/law/national_insurance.ts";
const REMEDY = "fix national_insurance.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("Class 4 on 30,000: 6% of 17,430 = 1,045.80", class4(30_000) === 1045.8);
check("Class 4 on 60,000: 2,262 + 2% of 9,730 = 2,456.60", class4(60_000) === 2456.6);
check("Class 4 nothing at 12,570", class4(12_570) === 0);
check("employee Class 1 on 30,000: 8% of 17,430 = 1,394.40", employeeClass1(30_000) === 1394.4);
check("employer on 30,000: 15% of 25,000 = 3,750.00", employerClass1(30_000) === 3750);
check("employer on a living-wage year (24,784.50): 2,967.68", employerClass1(24_784.5) === 2967.68);
check("employer on an under-21's 21,157.50: nothing below 50,270", employerClass1(21_157.5, { reliefToUpperSecondary: true }) === 0);
check("employer nothing at the secondary threshold", employerClass1(5_000) === 0);

const four = employerNiAfterAllowance([2967.68, 2967.68, 2967.68, 2967.68], true);
check("four living-wage staff: 11,870.72 of employer NI", four.gross === 11_870.72);
check("the allowance takes 10,500 of it", four.allowanceUsed === 10_500);
check("the business pays 1,370.72", four.net === 1370.72);
check("a sole director cannot claim: pays it all", employerNiAfterAllowance([3750], false).net === 3750);
check("the allowance covers about 3.54 living-wage staff", Math.abs(10_500 / 2967.675 - 3.538) < 0.001);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/national_insurance: all pass");
