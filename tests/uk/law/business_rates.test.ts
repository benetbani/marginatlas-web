/**
 * Business rates 2026-27 (England): multipliers, the small business relief taper, the 51,000 cliff.
 *
 * Run: npx tsx tests/uk/law/business_rates.test.ts
 */
import { businessRates } from "../../../src/lib/uk/law/business_rates";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-law-business-rates";
const FILE = "src/lib/uk/law/business_rates.ts";
const REMEDY = "fix business_rates.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const cafe = businessRates({ rateableValue: 13_500, retailHospitalityLeisure: true });
check("cafe, RV 13,500: 5,157.00 before relief, half off, 2,578.50", cafe.gross === 5157 && cafe.reliefFraction === 0.5 && cafe.bill === 2578.5);
check("RV 12,000 pays nothing", businessRates({ rateableValue: 12_000, retailHospitalityLeisure: true }).bill === 0);
check("RV 14,000, not retail: 6,048.00 less a third, 4,032.00", businessRates({ rateableValue: 14_000, retailHospitalityLeisure: false }).bill === 4032);
check("RV 15,000, not retail: no relief, 6,480.00", businessRates({ rateableValue: 15_000, retailHospitalityLeisure: false }).bill === 6480);
check("RV 25,000 retail: 9,550.00", businessRates({ rateableValue: 25_000, retailHospitalityLeisure: true }).bill === 9550);
check("RV 60,000 retail: 43p, 25,800.00", businessRates({ rateableValue: 60_000, retailHospitalityLeisure: true }).bill === 25_800);
check("relief taper continuous at 12,000 and 15,000 (1.53 at 12,001; 5,727.71 at 14,999)", businessRates({ rateableValue: 12_001, retailHospitalityLeisure: true }).bill === 1.53 && businessRates({ rateableValue: 14_999, retailHospitalityLeisure: true }).bill === 5727.71);
check("relief is a share of the printed gross: RV 13,001 retail, 4,966.38 less 3,309.26 = 1,657.12", businessRates({ rateableValue: 13_001, retailHospitalityLeisure: true }).bill === 1657.12);
check("RV 60,000 not retail: the 48p standard multiplier, 28,800.00", businessRates({ rateableValue: 60_000, retailHospitalityLeisure: false }).bill === 28_800);
const below = businessRates({ rateableValue: 50_999, retailHospitalityLeisure: true }).bill;
const at = businessRates({ rateableValue: 51_000, retailHospitalityLeisure: true }).bill;
check("the cliff at 51,000 is the law's: about 2,448 more for one pound of value", Math.abs(at - below - 2448.38) < 0.02);
check("no relief when not eligible (a second property)", businessRates({ rateableValue: 10_000, retailHospitalityLeisure: true, smallBusinessReliefEligible: false }).bill === 3820);
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
check("500,000 and above is high-value and refused, not guessed; 499,999 is charged 239,999.52", refuses(() => businessRates({ rateableValue: 500_000, retailHospitalityLeisure: false })) && businessRates({ rateableValue: 499_999, retailHospitalityLeisure: false }).bill === 239_999.52);
check("a value that is not a number, or negative, is refused", refuses(() => businessRates({ rateableValue: Number.NaN, retailHospitalityLeisure: true })) && refuses(() => businessRates({ rateableValue: -1, retailHospitalityLeisure: true })));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/law/business_rates: all pass");
