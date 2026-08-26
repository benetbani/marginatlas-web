import { readFileSync } from "node:fs";
const items = JSON.parse(readFileSync("scratchpad/sb-registry.json", "utf8")).items;

const want = process.argv[2] || "chart";
const hits = items.filter((i) => (i.name || "").startsWith(want));

console.log(`  ${hits.length} "${want}" blocks\n`);
for (const h of hits.slice(0, Number(process.argv[3] || 25))) {
  const deps = (h.registryDependencies || []).join(", ") || "-";
  const desc = (h.description || h.title || "").replace(/\s+/g, " ").slice(0, 88);
  console.log(`  ${h.name.padEnd(14)} ${desc}`);
  if (deps !== "-") console.log(`                 needs: ${deps}`);
}
