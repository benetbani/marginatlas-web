/**
 * Brain-skeleton loader smoke test. Confirms the CSVs parse, the
 * snapshot maps are populated, and a few key country lookups return
 * sensible numbers.
 *
 * Run: npx tsx scripts/smoke/brain_loader_smoke.ts
 */

import {
  getBrainCountrySnapshot,
  getBrainPopulationByIso2,
  getBrainInformalShareByIso2,
  cpiMultiplier,
} from "../../src/lib/external/brain_data";

console.log("US snapshot:", JSON.stringify(getBrainCountrySnapshot("US"), null, 2));
console.log("MX snapshot:", JSON.stringify(getBrainCountrySnapshot("MX"), null, 2));
console.log("NG snapshot:", JSON.stringify(getBrainCountrySnapshot("NG"), null, 2));
console.log("DE snapshot:", JSON.stringify(getBrainCountrySnapshot("DE"), null, 2));
console.log("---");
console.log("Population map size:", getBrainPopulationByIso2().size);
console.log("Informal map size:", getBrainInformalShareByIso2().size);
console.log("---");
console.log("CPI mult US 2010 -> 2024:", cpiMultiplier("US", 2010, 2024).toFixed(3));
console.log("CPI mult AR 2010 -> 2024:", cpiMultiplier("AR", 2010, 2024).toFixed(3));
console.log("CPI mult DE 2010 -> 2024:", cpiMultiplier("DE", 2010, 2024).toFixed(3));
