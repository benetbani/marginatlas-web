import { INDUSTRIES } from "../src/lib/taxonomy";

const by: Record<string, Array<{ id: string; name: string }>> = {};
for (const i of INDUSTRIES) (by[i.sector_id] = by[i.sector_id] || []).push({ id: i.id, name: i.name });

console.log(`${INDUSTRIES.length} live activities\n`);
for (const k of Object.keys(by).sort()) {
  console.log(`## ${k}  (${by[k].length})`);
  for (const x of by[k]) console.log(`   ${x.id.padEnd(30)} ${x.name}`);
  console.log("");
}
