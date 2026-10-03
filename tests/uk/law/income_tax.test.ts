/**
 * Income tax 2026-27 (rUK): allowance, taper, bands, dividends on top, and the shape of the schedule.
 * Expected values computed independently in Python (design/loop/build/goal-2026-10-02 plan check, 2026-10-02).
 *
 * Run: npx tsx tests/uk/law/income_tax.test.ts
 */
import { incomeTax, personalAllowance } from "../../../src/lib/uk/law/income_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-income-tax";
const FILE = "src/lib/uk/law/income_tax.ts";
const REMEDY = "fix income_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("allowance 12,570 up to 100,000", personalAllowance(100_000) === 12_570);
check("allowance 7,570 at 110,000 (1 pound per 2 above 100,000)", personalAllowance(110_000) === 7_570);
check("allowance 12,570 at 100,001 (no complete 2 pounds yet)", personalAllowance(100_001) === 12_570);
check("allowance gone at 125,140", personalAllowance(125_140) === 0);
check("30,000 of profit: 3,486.00", incomeTax(30_000).total === 3486);
check("60,000: 11,432.00", incomeTax(60_000).total === 11_432);
check("100,000: 27,432.00", incomeTax(100_000).total === 27_432);
check("110,000: 33,432.00", incomeTax(110_000).total === 33_432);
check("125,140: 42,516.00", incomeTax(125_140).total === 42_516);
check("130,000: 44,703.00", incomeTax(130_000).total === 44_703);
check("nothing below the allowance", incomeTax(12_570).total === 0);
check("salary 12,570 and 40,000 of dividends: 4,821.25", incomeTax(12_570, 40_000).total === 4821.25);
check("the first 500 of dividends are free", incomeTax(12_570, 500).total === 0);
check("1,000 of dividends: 500 free, 500 at 10.75% = 53.75", incomeTax(12_570, 1000).total === 53.75);

// The 60% band: between 100,000 and 125,140 a pound of income costs 40p plus 20p of lost allowance.
const m = (incomeTax(110_002).total - incomeTax(110_000).total) / 2;
check("marginal rate 60% inside the taper", Math.abs(m - 0.6) < 1e-9);

// Shape: never decreasing, never a step (a penny of income moves the tax by at most a penny, plus rounding).
let monotone = true;
let continuous = true;
let prev = incomeTax(0).total;
for (let x = 1; x <= 200_000; x += 37) {
  const t = incomeTax(x).total;
  if (t < prev) monotone = false;
  prev = t;
  const step = incomeTax(x + 0.01).total - t;
  if (step < -0.011 || step > 0.011) continuous = false;
}
check("income tax never falls as income rises (0 to 200,000)", monotone);
check("no step anywhere: a penny of income moves the tax by a penny at most", continuous);
let threw = false;
try { incomeTax(-1); } catch { threw = true; }
check("negative income is refused", threw);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/income_tax: all pass");
