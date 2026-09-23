import { COUNTRIES } from "../../src/lib/taxonomy";
import { getCountryProfile } from "../../src/lib/economic_profile";
const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
const min: any[] = [], avg: any[] = [];
for (const c of codes) { const p: any = getCountryProfile(c); if (p.iso2.toUpperCase() !== c) continue;
  if (p.minimum_wage_annual_usd > 0) min.push([c, p.minimum_wage_annual_usd]);
  if (p.median_wage_full_time_usd > 0) avg.push([c, p.median_wage_full_time_usd]); }
console.log("codes", codes.length, "min", min.length, "avg", avg.length);
min.sort((a, b) => b[1] - a[1]); avg.sort((a, b) => b[1] - a[1]);
const rk = (a: any[], c: string) => a.findIndex((x) => x[0] === c) + 1;
console.log("GB min rank", rk(min, "GB"), "of", min.length);
console.log("GB avg rank", rk(avg, "GB"), "of", avg.length);
console.log("min max", min[0], "avg max", avg[0]);
const gbMin = 25000, gbAvg = 38400;
console.log("below GB min:", min.filter((x) => x[1] < gbMin).length, "below GB avg:", avg.filter((x) => x[1] < gbAvg).length);
console.log("share min", (min.filter((x) => x[1] < gbMin).length / min.length).toFixed(3), "share avg", (avg.filter((x) => x[1] < gbAvg).length / avg.length).toFixed(3));
console.log("median min", min[Math.floor(min.length/2)], "median avg", avg[Math.floor(avg.length/2)]);
