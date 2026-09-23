#!/usr/bin/env node
/**
 * unused_fields , WHAT THE FACT BANK HOLDS THAT NO PAGE DRAWS (2026-09-23, for
 * his brief: ten new sections for each page type, each one exclusive,
 * defensible, technical and useful).
 *
 * THE ONE HONEST STARTING POINT for "what else could a page say" is what the
 * files already hold, because a section built on a field we have is defensible
 * the day it is drawn, and a section built on a field we wish we had is a
 * research project wearing a design. This walks the three shard folders,
 * collects every metric name with the number of entities that hold it, then
 * greps `src/lib` for that metric to see whether anything reads it.
 *
 * The precedent: `setup.steps.*` was found this way on 2026-09-23, held by 198
 * of 198 countries and read by nothing, and became the how-to page's sequence
 * the same day.
 *
 * WHAT IT CANNOT SEE, STATED: a metric read through a variable rather than a
 * literal (a builder that composes `setup.steps.*.${field}`) reads as unused.
 * Every hit is therefore a candidate to confirm by opening the file, never a
 * finding on its own.
 *
 *   node scripts/audit/unused_fields.mjs [country|city|industry] [--all]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const KIND = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "country";
const SHOW_ALL = process.argv.includes("--all");
const DIR = join("data", "facts", KIND);

const held = new Map(); // metric -> entities holding it
let files = 0;
for (const name of readdirSync(DIR)) {
  if (!name.endsWith(".json")) continue;
  let shard;
  try { shard = JSON.parse(readFileSync(join(DIR, name), "utf8")); } catch { continue; }
  if (!Array.isArray(shard?.facts)) continue;
  files++;
  const seen = new Set();
  for (const f of shard.facts) {
    const m = f && typeof f.metric === "string" ? f.metric : null;
    if (!m || seen.has(m)) continue;
    seen.add(m);
    held.set(m, (held.get(m) ?? 0) + 1);
  }
}

/* THE SOURCE IS READ ONCE INTO MEMORY and each metric asked of it. A shell
   grep per metric is 400 processes and does not exist on this machine's shell
   anyway; this is one walk and a substring test. */
const SRC = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) SRC.push([p, readFileSync(p, "utf8")]);
  }
})("src");
const used = new Map();
for (const m of held.keys()) {
  const hit = SRC.find(([, body]) => body.includes(m));
  used.set(m, hit ? hit[0].split("\\").join("/") : "");
}

const rows = [...held.entries()]
  .map(([m, n]) => ({ metric: m, entities: n, share: Math.round((n / files) * 100), used: used.get(m) || "" }))
  .sort((a, b) => b.entities - a.entities || a.metric.localeCompare(b.metric));

const unused = rows.filter((r) => !r.used);
console.log(`${KIND}: ${files} shards, ${rows.length} distinct metrics, ${unused.length} read by nothing under src/\n`);
console.log("  held by   metric                                                  read by");
for (const r of SHOW_ALL ? rows : unused) {
  console.log(`  ${String(r.share).padStart(3)}%  ${String(r.entities).padStart(4)}  ${r.metric.padEnd(52)}  ${r.used ? r.used.split("\n")[0] : "(nothing)"}`);
}
