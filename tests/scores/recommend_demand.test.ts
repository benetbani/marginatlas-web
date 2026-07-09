/**
 * Run: npx tsx tests/scores/recommend_demand.test.ts
 * resolveCityDemand replays the live demand-input resolution over bundled data
 * (city_list_v1.json + the country economics snapshot), so it is deterministic
 * and needs no DB. London resolves to a real demand leg; an unknown slug dashes.
 */
import { resolveCityDemand } from "@/lib/scores/recommend";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

{
  const d = resolveCityDemand("london", "GB");
  assert(d !== null, "london resolves a demand leg from bundled data");
  if (d !== null) assert(d >= 0 && d <= 100, "demand leg is a 0..100 sub-score");
  assert(resolveCityDemand("london", "GB") === d, "resolveCityDemand is deterministic");
}

{
  assert(resolveCityDemand("no-such-city-xyz", "GB") === null, "unknown city -> null demand (no fabrication)");
}

if (failures > 0) {
  console.error(`\nrecommend_demand.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("recommend_demand.test: PASS. City demand resolves deterministically over bundled data; unknown dashes.");
