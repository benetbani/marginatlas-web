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
// Dividends on top of taxable non-savings income (each figure computed independently in Python, 2026-10-03).
check("50,000 and 10,000 of dividends: the free 500 straddles the basic band's edge, 10,882.25", incomeTax(50_000, 10_000).total === 10_882.25);
check("5,000 and 20,000 of dividends: the allowance left after salary covers dividends, 1,282.48", incomeTax(5_000, 20_000).total === 1_282.48);
check("124,000 and 5,000 of dividends: dividends cross 125,140 into the 39.35% rate, 43,807.71", incomeTax(124_000, 5_000).total === 43_807.71);
check("100,000 and 10,000 of dividends: the taper counts dividends, 32,828.25", incomeTax(100_000, 10_000).total === 32_828.25);

// The 60% band: between 100,000 and 125,140 a pound of income costs 40p plus 20p of lost allowance.
const m = (incomeTax(110_002).total - incomeTax(110_000).total) / 2;
check("marginal rate 60% inside the taper", Math.abs(m - 0.6) < 1e-9);

// Shape: never decreasing (sampled every 37 pounds).
let monotone = true;
let prev = incomeTax(0).total;
for (let x = 1; x <= 200_000; x += 37) {
  const t = incomeTax(x).total;
  if (t < prev) monotone = false;
  prev = t;
}
check("income tax never falls as income rises (0 to 200,000)", monotone);
// Shape: the last penny before every whole pound moves the tax by a penny at most, except the taper's steps, where a
// whole pound of allowance goes at once: exactly 40p at each even pound from 100,002 to 125,140.
let steps = 0;
let firstBreak: number | null = null;
for (let x = 1; x <= 200_000; x++) {
  const s = incomeTax(x).total - incomeTax(x - 0.01).total;
  const allowanceStep = x > 100_000 && x <= 125_140 && (x - 100_000) % 2 === 0;
  if (allowanceStep) steps++;
  const ok = allowanceStep ? Math.abs(s - 0.4) < 1e-9 : Math.abs(s) <= 0.011;
  if (!ok && firstBreak === null) firstBreak = x;
}
check(`a penny moves the tax by a penny at most, except ${steps.toLocaleString("en-GB")} taper steps of 40p${firstBreak === null ? "" : ` (first break at ${firstBreak})`}`, firstBreak === null && steps === 12_570);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("negative income is refused", refuses(() => incomeTax(-1)));
check("negative dividends are refused", refuses(() => incomeTax(50_000, -1)));
check("an income that is not a number is refused, never taxed at zero", refuses(() => incomeTax(Number.NaN)) && refuses(() => incomeTax(50_000, Number.NaN)) && refuses(() => personalAllowance(Number.NaN)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/income_tax: all pass");
