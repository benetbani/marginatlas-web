import { isInScope } from "../src/lib/taxonomy/scope_rules";
import j from "../src/lib/taxonomy/industries.json";

interface I { id: string; name: string; sector_id: string }
const inds = (j as unknown as { industries: I[] }).industries;

const gone = inds.filter((i) => !isInScope(i).inScope);
const kept = inds.filter((i) => isInScope(i).inScope);

const group = (rows: I[]) => {
  const by: Record<string, string[]> = {};
  rows.forEach((i) => { (by[i.sector_id] = by[i.sector_id] || []).push(i.name); });
  return by;
};

console.log(`RETIRING ${gone.length} of ${inds.length}\n`);
const g = group(gone);
Object.keys(g).sort().forEach((k) => {
  console.log(`  ${k}  (${g[k].length})`);
  g[k].forEach((n) => console.log(`      ${n}`));
});

console.log(`\n\nKEEPING ${kept.length}, by sector:\n`);
const kp = group(kept);
Object.keys(kp).sort().forEach((k) => console.log(`  ${String(k).padEnd(26)} ${kp[k].length}`));
