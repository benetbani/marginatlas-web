import { COUNTRIES } from "@/lib/taxonomy";
import { getCountryProfile } from "@/lib/economic_profile";

const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
console.log("codes", codes.length);
const rows: { c: string; min: number | null; avg: number | null; tier?: string }[] = [];
for (const c of codes) {
  const p: any = getCountryProfile(c);
  if (String(p.iso2).toUpperCase() !== c) { rows.push({ c, min: null, avg: null, tier: "MISMATCH" }); continue; }
  rows.push({ c, min: Number.isFinite(p.minimum_wage_annual_usd) && p.minimum_wage_annual_usd > 0 ? p.minimum_wage_annual_usd : null, avg: Number.isFinite(p.median_wage_full_time_usd) && p.median_wage_full_time_usd > 0 ? p.median_wage_full_time_usd : null, tier: p.tier });
}
const haveMin = rows.filter(r => r.min != null);
const haveAvg = rows.filter(r => r.avg != null);
console.log("have min", haveMin.length, "have avg", haveAvg.length);
const gb = rows.find(r => r.c === "GB")!;
console.log("GB", gb);
const belowMin = haveMin.filter(r => r.c !== "GB" && (r.min as number) < (gb.min as number)).length;
const belowAvg = haveAvg.filter(r => r.c !== "GB" && (r.avg as number) < (gb.avg as number)).length;
console.log("countries with lower floor:", belowMin, "of", haveMin.length - 1);
console.log("countries with lower average:", belowAvg, "of", haveAvg.length - 1);
const max = haveAvg.reduce((a, b) => ((a.avg as number) > (b.avg as number) ? a : b));
console.log("world max avg", max);
// bucket distribution on the MIN field
const held = haveMin.length;
const buckets = new Array(10).fill(0);
for (const r of haveMin) {
  const below = haveMin.filter(o => o.c !== r.c && (o.min as number) < (r.min as number)).length;
  const n = Math.min(9, Math.floor(below / (held - 1) * 10));
  buckets[n]++;
}
console.log("min buckets 0..9", buckets.join(", "));
const bucketsA = new Array(10).fill(0);
const heldA = haveAvg.length;
for (const r of haveAvg) {
  const below = haveAvg.filter(o => o.c !== r.c && (o.avg as number) < (r.avg as number)).length;
  const n = Math.min(9, Math.floor(below / (heldA - 1) * 10));
  bucketsA[n]++;
}
console.log("avg buckets 0..9", bucketsA.join(", "));
// spot-checks for the universality test
for (const k of ["CD","BD","AL","BO","CU","EG","CH"]) {
  const r = rows.find(x => x.c === k);
  if (!r) { console.log(k, "absent"); continue; }
  const below = r.min != null ? haveMin.filter(o => o.c !== k && (o.min as number) < (r.min as number)).length : -1;
  const n = below >= 0 ? Math.min(9, Math.floor(below / (held - 1) * 10)) : -1;
  console.log(k, "min", r.min, "avg", r.avg, "tier", r.tier, "n(min)", n);
}
// tier spread
const tiers: Record<string, number> = {};
for (const r of rows) tiers[String(r.tier)] = (tiers[String(r.tier)] ?? 0) + 1;
console.log("tiers", tiers);
