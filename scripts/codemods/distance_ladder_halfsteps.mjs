#!/usr/bin/env node
/**
 * THE HALF STEPS, OFF THE PAGES (2026-09-23, QUEUE ui:distance-ladder-migration).
 *
 * DISTANCES.md section 1 holds the ladder: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40,
 * 48, 64. The spine carried 138 uses of the two Tailwind half steps, `1.5`
 * (6px) and `2.5` (10px), and they are the reason two cards that should read
 * alike do not.
 *
 * THE MAPPING, one rule, written before it was run, so every edit can be
 * argued with rather than discovered:
 *   6px  -> 8px  everywhere. It is the nearest rung and it is the rhythm.
 *   10px -> 8px  inside a box (padding), where the smaller value keeps a row
 *                dense and a dense row is what a table is for.
 *   10px -> 12px between boxes (margin, gap, stack), where the larger value is
 *                the rung the ladder gives to "these are different things".
 * That is section 2's table read back: padding belongs to the small range, the
 * space between things to the medium one.
 *
 * WHAT IT DOES NOT TOUCH: heights and widths (`h-[6px]`, a bar's thickness),
 * which are section 3.2's business and their own queue row; anything outside
 * `src/components/spine`; and any value already on the ladder.
 *
 *   node scripts/codemods/distance_ladder_halfsteps.mjs --dry
 *   node scripts/codemods/distance_ladder_halfsteps.mjs --write
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "src/components/spine";
const WRITE = process.argv.includes("--write");

/* padding keeps the tighter rung, spacing between things takes the wider one */
const PAD = new Set(["p", "px", "py", "pt", "pb", "pl", "pr"]);
const RE = /(^|[\s"'`{])(-?)(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(1\.5|2\.5)(?=$|[\s"'`}])/g;

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
})(ROOT);

let changed = 0, edits = 0;
const tally = new Map();
for (const f of files) {
  const src = readFileSync(f, "utf8");
  let n = 0;
  const out = src.replace(RE, (_m, lead, neg, util, step) => {
    const to = step === "1.5" ? "2" : PAD.has(util) ? "2" : "3";
    const from = step === "1.5" ? 6 : 10;
    const px = Number(to) * 4;
    tally.set(`${from}px -> ${px}px (${util})`, (tally.get(`${from}px -> ${px}px (${util})`) ?? 0) + 1);
    n++; edits++;
    return `${lead}${neg}${util}-${to}`;
  });
  if (n) {
    changed++;
    console.log(`  ${relative(process.cwd(), f).split(sep).join("/")}: ${n}`);
    if (WRITE) writeFileSync(f, out, "utf8");
  }
}
console.log(`\n${edits} edit(s) in ${changed} file(s)${WRITE ? ", written" : " (dry run)"}`);
for (const [k, v] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
