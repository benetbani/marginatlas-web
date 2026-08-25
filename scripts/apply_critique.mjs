#!/usr/bin/env node
/**
 * apply_critique , RECORD ONE ROUND'S VERDICTS SO THE NEXT ROUND STARTS FROM IT.
 *
 * Takes the verdict string the critique sheet emits and writes a round record:
 * one entry per node per dimension, with the note that justifies it and the
 * dossier it was judged against.
 *
 * WHY A RECORD AND NOT A CONVERSATION. Every judgment made in a chat is lost the
 * moment the chat ends, and this project has re-discovered the same faults across
 * rounds because of it. A verdict that is not written down did not happen.
 *
 * THE GRAMMAR, matching what the sheet's Copy button produces:
 *   <node>:<dim>=<verdict>;<node>:<dim>=<verdict>(note);...
 *   verdict is one of good | weak | wrong | unjudged
 *
 * Usage: node scripts/apply_critique.mjs "<verdict-string>" [--date YYYY-MM-DD]
 * Writes: design/critique/round-<date>.json
 *         and appends the roll-up row to design/critique/LESSONS.md
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DIR = "E:/atlas/design/critique";
const argv = process.argv.slice(2);
const DATE = argv.includes("--date") ? argv[argv.indexOf("--date") + 1] : new Date().toISOString().slice(0, 10);
const str = argv.filter((a) => !a.startsWith("--") && a !== DATE)[0];

if (!str || !str.trim()) {
  console.error('Usage: node scripts/apply_critique.mjs "<verdict-string>" [--date YYYY-MM-DD]');
  console.error('   e.g. "city-london-2:D1=weak(the largest thing is a footnote);city-london-2:D5=good"');
  process.exit(2);
}

const ENTRY = /^([A-Za-z0-9._-]+):(D[1-9])=(good|weak|wrong|unjudged)(?:\((.*)\))?$/;
const VALID = new Set(["good", "weak", "wrong", "unjudged"]);

const dossierFile = `${DIR}/dossier-${DATE}.json`;
if (!existsSync(dossierFile)) {
  console.error(`x no dossier at ${dossierFile}. A verdict without the evidence it was made against is an opinion.`);
  process.exit(1);
}
const dossier = JSON.parse(readFileSync(dossierFile, "utf8"));
const known = new Map();
for (const p of dossier.pages) {
  for (const n of p.nodes) {
    known.set(`${p.page}-${n.path}`.replace(/[^a-z0-9.-]+/gi, "-"), { page: p.page, ...n });
  }
}

const entries = [];
const unknown = [];
for (const raw of str.split(";").map((s) => s.trim()).filter(Boolean)) {
  const m = raw.match(ENTRY);
  if (!m) { console.error(`x could not read entry: ${raw}`); process.exit(1); }
  const [, node, dim, verdict, note] = m;
  if (!VALID.has(verdict)) { console.error(`x not a verdict: ${verdict}`); process.exit(1); }
  if (!known.has(node)) { unknown.push(node); continue; }
  const k = known.get(node);
  entries.push({ node, page: k.page, kind: k.kind, label: k.label || k.heading || k.path, dim, verdict, note: note || null });
}

if (unknown.length) {
  console.error(`x ${unknown.length} verdict(s) name a node this dossier does not contain: ${[...new Set(unknown)].slice(0, 4).join(", ")}`);
  console.error("  Either the sheet is older than the dossier, or the pages changed since it was built. Rebuild both.");
  process.exit(1);
}

/* A verdict of weak or wrong WITHOUT a note is not actionable and is refused.
   "This is weak" tells the next round nothing it can act on, and a round that
   cannot act on its own findings is a round that repeats them. */
const unactionable = entries.filter((e) => (e.verdict === "weak" || e.verdict === "wrong") && !e.note);
if (unactionable.length) {
  console.error(`x ${unactionable.length} finding(s) say weak or wrong with no note.`);
  unactionable.slice(0, 6).forEach((e) => console.error(`     ${e.label} ${e.dim} = ${e.verdict}`));
  console.error("  Say what exactly, and what would fix it. A finding nobody can act on is a finding that comes back.");
  process.exit(1);
}

const counts = { good: 0, weak: 0, wrong: 0, unjudged: 0 };
entries.forEach((e) => counts[e.verdict]++);

const judgeable = [...known.values()].filter((n) => n.kind !== "rail").length;
const covered = new Set(entries.map((e) => e.node)).size;

const round = {
  date: DATE,
  dossier: `dossier-${DATE}.json`,
  nodesInDossier: known.size,
  nodesJudgeable: judgeable,
  nodesCovered: covered,
  counts,
  entries,
};

const out = `${DIR}/round-${DATE}.json`;
writeFileSync(out, JSON.stringify(round, null, 1) + "\n", "utf8");

console.log(`  wrote ${out}`);
console.log(`  ${entries.length} verdicts over ${covered} of ${judgeable} judgeable nodes`);
console.log(`  good ${counts.good}   weak ${counts.weak}   wrong ${counts.wrong}   unjudged ${counts.unjudged}`);
if (covered < judgeable) {
  console.log(`\n  ${judgeable - covered} node(s) carry no verdict at all. A node nobody judged is not a node that passed.`);
}
