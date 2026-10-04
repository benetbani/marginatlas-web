/**
 * Corporation Tax FY2026: the two rates, marginal relief between them, continuity at both limits.
 *
 * Run: npx tsx tests/uk/law/corporation_tax.test.ts
 */
import { corporationTax } from "../../../src/lib/uk/law/corporation_tax";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-corporation-tax";
const FILE = "src/lib/uk/law/corporation_tax.ts";
const REMEDY = "fix corporation_tax.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("no tax on a loss", corporationTax(-5_000) === 0);
check("nothing on no profit", corporationTax(0) === 0);
check("19% below the lower limit: 30,000 pays 5,700 (the marginal formula would give 4,200)", corporationTax(30_000) === 5_700);
check("19% at 50,000: 9,500", corporationTax(50_000) === 9_500);
check("marginal relief at 100,000: 25,000 - 2,250 = 22,750", corporationTax(100_000) === 22_750);
check("25% at 250,000: 62,500", corporationTax(250_000) === 62_500);
check("25% at 300,000: 75,000", corporationTax(300_000) === 75_000);
check("continuous at 50,000 (a pound more costs 26.5p, not a jump)", Math.abs(corporationTax(50_001) - 9_500 - 0.265) <= 0.011);
check("continuous at 250,000", Math.abs(corporationTax(250_000) - corporationTax(249_999) - 0.265) <= 0.011);
let ok = true;
for (let p = 50_100; p < 250_000; p += 997) {
  const m = corporationTax(p + 100) - corporationTax(p);
  if (Math.abs(m - 26.5) > 0.02) ok = false;
}
check("between the limits every extra 100 pounds costs 26.50", ok);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("a profit that is not finite is refused, never taxed at zero", refuses(() => corporationTax(-Infinity)) && refuses(() => corporationTax(Number.NaN)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/corporation_tax: all pass");
