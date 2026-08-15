/**
 * Four confidence scales meeting at one seam.
 *
 * Run: npx tsx tests/facts/confidence.test.ts
 */
import { fromTier, fromQualityScore, fromSourceQuality, band } from "../../src/lib/facts/confidence";

let failed = 0;
const check = (label: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };

check("measured tier is held", fromTier("measured") === "held");
check("built tier is modeled", fromTier("built") === "modeled");
check("thin tier is extrapolated", fromTier("thin") === "extrapolated");
check("an unknown tier is placeholder, not a guess", fromTier("nonsense") === "placeholder");

check("quality 90 is held", fromQualityScore(90) === "held");
check("quality 45 is modeled", fromQualityScore(45) === "modeled");
check("quality 10 is extrapolated", fromQualityScore(10) === "extrapolated");
check("quality 0 is placeholder", fromQualityScore(0) === "placeholder");

check("grade A is held", fromSourceQuality("A") === "held");
check("grade B is modeled", fromSourceQuality("B") === "modeled");
check("grade C is extrapolated", fromSourceQuality("C") === "extrapolated");
check("a lowercase grade still works", fromSourceQuality("a") === "held");
check("an unknown grade is placeholder", fromSourceQuality("Z") === "placeholder");

check("held bands as strong", band("held") === "strong");
check("modeled bands as fair", band("modeled") === "fair");
check("extrapolated bands as weak", band("extrapolated") === "weak");
check("placeholder bands as none", band("placeholder") === "none");

if (failed > 0) { console.error(`facts/confidence: ${failed} failures`); process.exit(1); }
console.log("facts/confidence: all pass");
