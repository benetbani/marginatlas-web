import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (extname(p) === ".tsx") files.push(p);
  }
})("src");

const rows = [];
for (const p of files) {
  const rel = relative(process.cwd(), p).split(sep).join("/");
  const raw = readFileSync(p, "utf8");
  if (!raw.includes("<th")) continue;
  let missing = 0, ok = 0, corner = 0;
  for (const m of raw.matchAll(/<th(\s[^>]*|)(\/?)>/g)) {
    const attrs = m[1] ?? "";
    if (m[2] === "/") { corner++; continue; }
    if (/\bscope\s*=/.test(attrs)) ok++; else missing++;
  }
  if (missing || ok) rows.push({ rel, missing, ok, corner });
}

const bucket = (r) =>
  r.startsWith("src/app/dev/") || r.includes("/_design/") ? "workshop"
  : r.startsWith("src/components/ui/") ? "primitive"
  : r.includes("/admin/") ? "admin"
  : "reader";

const groups = { reader: [], admin: [], workshop: [], primitive: [] };
for (const r of rows) groups[bucket(r.rel)].push(r);

for (const g of ["reader", "admin", "workshop", "primitive"]) {
  const list = groups[g];
  const miss = list.reduce((a, r) => a + r.missing, 0);
  const ok = list.reduce((a, r) => a + r.ok, 0);
  console.log(`\n${g.toUpperCase()}  ${list.length} file(s), ${ok} scoped, ${miss} MISSING`);
  list.filter((r) => r.missing).forEach((r) => console.log(`   ${String(r.missing).padStart(3)} missing  ${r.rel}`));
}
