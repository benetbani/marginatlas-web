import { readFileSync } from "node:fs";
const d = JSON.parse(readFileSync("scratchpad/sb-registry.json", "utf8"));
console.log("  top-level:", Object.keys(d).slice(0, 8).join(", "));
const items = d.items || d.blocks || d.registry || [];
console.log("  items:", items.length);
if (!items.length) { console.log(JSON.stringify(d).slice(0, 400)); process.exit(0); }

console.log("  sample item keys:", Object.keys(items[0]).join(", "));
console.log("  sample name:", items[0].name, "| type:", items[0].type);

const fam = new Map();
for (const it of items) {
  const m = /^([a-z]+)/.exec(it.name || "");
  const k = m ? m[1] : "(other)";
  fam.set(k, (fam.get(k) || 0) + 1);
}
console.log("\n  families:");
for (const [k, v] of [...fam.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(v).padStart(4)}  ${k}`);
}
