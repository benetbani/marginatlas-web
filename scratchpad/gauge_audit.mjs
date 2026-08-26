/**
 * How many distinct DIALS does this site actually have?
 *
 * A dial is a component where an ARC LENGTH or a NEEDLE ANGLE encodes a value.
 * That is different from using Math.PI to lay things out around a circle, and
 * different from a dashed decorative stroke, and both of those were being
 * counted by a naive search.
 *
 * The readiness ledger claims "9 gauge geometries". Three of its other figures
 * have been measured wrong today, so this counts rather than repeats.
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
  const s = readFileSync(p, "utf8");

  /* An arc whose length is computed from something, not a constant. */
  const dashExpr = [...s.matchAll(/strokeDasharray=\{([^}]{1,120})\}/g)].map((m) => m[1].trim());
  const valueDriven = dashExpr.filter((e) =>
    /[a-z]/.test(e) && !/^["'`][\d\s,.]+["'`]$/.test(e),
  );

  /* A needle: a rotation or a point placed by an angle derived from a value. */
  const needle = /rotate\(\$\{|transform=\{`rotate\(|Math\.cos\([^)]*(value|pct|score|v\b)/.test(s);

  if (valueDriven.length || needle) {
    rows.push({
      rel,
      workshop: rel.startsWith("src/app/dev/") || rel.includes("/_design/"),
      arcs: valueDriven.length,
      needle,
      samples: valueDriven.slice(0, 2),
    });
  }
}

console.log(`  ${rows.length} file(s) draw a value-encoding dial\n`);
for (const r of rows) {
  console.log(`  ${r.workshop ? "[workshop]" : "[reader]  "} ${r.rel}`);
  console.log(`      value-driven arcs: ${r.arcs}   needle: ${r.needle}`);
  r.samples.forEach((x) => console.log(`      arc expr: ${x.slice(0, 80)}`));
}
