import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
const CITIES = ["london","paris","new-york","tokyo","berlin","lagos","mumbai","dhaka","sao-paulo","istanbul","mexico-city","los-angeles","cairo","jakarta","bangkok"];
void (async () => {
  let rentAff = 0, runway = 0, risks = 0, character = 0, locals = 0, ok = 0;
  for (const c of CITIES) {
    const d: any = await buildSpineCitySeed(c).catch(() => null);
    if (!d) continue; ok++;
    if (d.owner_runway?.rent_1bed_usd_mo != null && d.income?.median_income_usd != null) rentAff++;
    if (d.owner_runway?.rent_1bed_usd_mo != null || d.owner_runway?.groceries_usd_mo != null) runway++;
    if (d.risks?.list?.length) risks++;
    if (d.character?.texture?.length) character++;
    if (d.locals_intel?.length) locals++;
  }
  console.log(`  of ${ok} cities checked:`);
  for (const [n,v] of [["rent against income",rentAff],["owner runway",runway],["risks",risks],["character",character],["locals",locals]])
    console.log(`     ${String(v).padStart(2)}/${ok}  ${n}`);
})();
