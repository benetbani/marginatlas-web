/**
 * probe_tabular_surfaces , how many more tables are built without a table?
 *
 * THREE TIMES in this loop the paid library has been the right answer, and all
 * three times it was the same defect: a section that puts things down the side
 * and measures across the top, with a header row drawn to look like one and no
 * table underneath it. The library's table primitive fixed all three.
 *
 * That makes it the one pattern worth sweeping for rather than waiting for the
 * ledger to reach it. This counts the rest.
 *
 * WHAT THIS INSTRUMENT CANNOT DISTINGUISH: a grid used for tabular data from a
 * grid used for layout. It reports CANDIDATES, and each has to be opened. The
 * signature it looks for is the one all three confirmed cases shared: a fixed
 * grid template, a row of labels styled as column headings, rows produced by a
 * map, and no table element anywhere in the file.
 *
 *   node scripts/probe_tabular_surfaces.mjs
 */
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
  const workshop = rel.startsWith("src/app/dev/") || rel.includes("/_design/");
  const s = readFileSync(p, "utf8");

  const hasTable = /<(table|Table)\b/.test(s);
  if (hasTable) continue;

  /* A grid whose columns are pinned: the shape a table takes when it is not one. */
  const templates = [...s.matchAll(/grid-cols-\[[^\]]+\]/g)].map((m) => m[0]);
  if (!templates.length) continue;

  /* A row of labels dressed as column headings. */
  const headerish =
    /uppercase tracking-wide[^"]*text-\[var\(--c-muted\)\]/.test(s) ||
    /font-semibold uppercase/.test(s);
  /* Rows produced from data rather than written out. */
  const mapped = /\.map\(\(/.test(s);
  if (!headerish || !mapped) continue;

  rows.push({ rel, workshop, templates: [...new Set(templates)].length });
}

const reader = rows.filter((r) => !r.workshop);
const shop = rows.filter((r) => r.workshop);

console.log(`\n  ${reader.length} reader-facing candidate(s), ${shop.length} in workshop routes\n`);
for (const r of reader) console.log(`    ${r.templates} pinned grid(s)   ${r.rel}`);
if (shop.length) {
  console.log(`\n  workshop, not counted:`);
  for (const r of shop) console.log(`    ${r.rel}`);
}
console.log(
  `\n  Each is a CANDIDATE, not a verdict: this cannot tell a grid holding tabular\n` +
    `  data from a grid holding a layout. Every one has to be opened.\n`,
);
