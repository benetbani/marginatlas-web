/**
 * The vertical's money rounding: half-pennies round up, parts add to the total.
 *
 * Run: npx tsx tests/uk/law/money.test.ts
 */
import { pennies, sumPennies, bandedTax } from "../../../src/lib/uk/law/money";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-money";
const FILE = "src/lib/uk/law/money.ts";
const REMEDY = "fix money.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("2,967.675 (0.15 x 19,784.50) rounds up to 2,967.68", pennies(0.15 * 19_784.5) === 2967.68);
check("556.335 (0.03 x 18,544.50) rounds up to 556.34", pennies(0.03 * 18_544.5) === 556.34);
check("a negative half-penny rounds away from zero", pennies(-0.005) === -0.01);
check("an exact amount is unchanged", pennies(24_784.5) === 24_784.5);
check("parts sum as pence: 24,784.50 + 2,967.68 + 556.34 = 28,308.52", sumPennies([24_784.5, 2967.675, 556.335]) === 28_308.52);
check("the raw sum would have said 28,308.51, which the reader cannot rebuild", pennies(24_784.5 + 2967.675 + 556.335) === 28_308.51);
check("banded tax: 1% of NPV above 150,000 on 207,915.13 is 579.15", bandedTax(207_915.13, [{ upTo: 150_000, rate: 0 }, { upTo: 5_000_000, rate: 0.01 }, { upTo: Infinity, rate: 0.02 }]) === 579.15);
let threw = false;
try { pennies(NaN); } catch { threw = true; }
check("NaN is refused, never printed", threw);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/money: all pass");
