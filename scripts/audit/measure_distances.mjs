#!/usr/bin/env node
/**
 * measure_distances , WHAT DISTANCES THE SPINE ACTUALLY USES TODAY
 * (2026-09-23, his ruling: "do not be afraid to go deeper into defining deeper
 * rules... the ratios, the hierarchy, the way the elements should be placed,
 * the distances, especially the distances, should be clearly defined").
 *
 * The type ladder has been written down since 2026-08-21 and is enforced. The
 * DISTANCE ladder has never been written at all: every component reaches for a
 * Tailwind step by hand. This counts what that has produced, so the ladder that
 * gets written is a decision about real numbers rather than a guess.
 *
 * WHAT IT READS: every className string under src/components/spine (the kit,
 * the archetypes and the five views), for the utilities that produce a
 * distance: padding, margin, gap, space-between, and the inset shorthands.
 * Tailwind's scale is 0.25rem per step, so `p-5` is 20px and `gap-1.5` is 6px;
 * arbitrary values in brackets are read as written.
 *
 * WHAT IT CANNOT SEE, STATED: a distance produced by a style attribute, by a
 * grid template, or by a line-height. Those are real distances and this
 * instrument is blind to them, which is why the spec measures rendered pages as
 * well as source.
 *
 *   node scripts/audit/measure_distances.mjs            (the table)
 *   node scripts/audit/measure_distances.mjs --json     (for a gate to read)
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src/components/spine";
const STEP = 4; // Tailwind's base, in px: 1 unit = 0.25rem = 4px

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
})(ROOT);

/* The utilities that make a distance. `space-` and `divide-` are included
   because a stack's rhythm is a distance even though it is drawn as a margin on
   the children. */
const UTIL = /(?:^|[\s"'`{])(-?)(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(\[[^\]\s]+\]|\d+(?:\.\d+)?|px)(?=$|[\s"'`}])/g;

const counts = new Map();   // "12px" -> { px, uses, where: Map(file -> n), utils: Set }
const arbitrary = new Map(); // the bracketed ones, as written

for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(UTIL)) {
    const [, neg, util, raw] = m;
    let px = null;
    let label = raw;
    if (raw === "px") px = 1;
    else if (raw.startsWith("[")) {
      const inner = raw.slice(1, -1);
      const n = /^(-?\d+(?:\.\d+)?)px$/.exec(inner);
      if (n) px = Number(n[1]);
      label = inner;
      arbitrary.set(inner, (arbitrary.get(inner) ?? 0) + 1);
    } else px = Number(raw) * STEP;
    if (px == null) continue;
    const key = `${neg === "-" ? -px : px}`;
    if (!counts.has(key)) counts.set(key, { px: Number(key), uses: 0, where: new Map(), utils: new Set() });
    const row = counts.get(key);
    row.uses++;
    row.utils.add(util);
    row.where.set(f, (row.where.get(f) ?? 0) + 1);
  }
}

const rows = [...counts.values()].sort((a, b) => a.px - b.px);
const total = rows.reduce((n, r) => n + r.uses, 0);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ total, distinct: rows.length, rows: rows.map((r) => ({ px: r.px, uses: r.uses, utils: [...r.utils], files: r.where.size })) }, null, 1));
} else {
  console.log(`${files.length} files under ${ROOT}; ${total} distance utilities; ${rows.length} DISTINCT distances in use\n`);
  console.log("  px    uses  files  utilities");
  for (const r of rows) console.log(`  ${String(r.px).padStart(4)}  ${String(r.uses).padStart(5)}  ${String(r.where.size).padStart(5)}  ${[...r.utils].sort().join(" ")}`);
  const off = rows.filter((r) => r.px > 0 && r.px % 4 !== 0);
  console.log(`\n  off the 4px base: ${off.length} distance(s), ${off.reduce((n, r) => n + r.uses, 0)} use(s): ${off.map((r) => r.px + "px").join(", ") || "none"}`);
  console.log(`  arbitrary bracket values: ${[...arbitrary.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k} (${v})`).join(", ") || "none"}`);
}
