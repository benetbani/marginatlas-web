#!/usr/bin/env node
/**
 * verify_distance_ladder , THE LADDER IS THE LAW AND THE COUNT MAY ONLY FALL
 * (2026-09-23; the ladder is `E:/atlas/design/loop/build/briefs/DISTANCES.md`
 * section 1, written on his ruling that the distances be defined so nothing
 * deviates later).
 *
 * THE LADDER: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Nothing else.
 * Measured the day it was written, the spine held 21 distinct distances and
 * 151 uses of values with no job at all (1, 3, 6, 10, 14, 28, 112).
 *
 * A RATCHET, NOT A HARD ZERO, for the reason every ratchet in this folder
 * exists: 151 uses is a week of visual edits, each of which has to be looked at
 * on three widths, and a rule that fails the build on the day it is written is
 * a rule someone switches off. The number may fall and may never rise.
 *
 * WHAT IT READS: className strings under src/components/spine, for the
 * utilities that make a distance (padding, margin, gap, space-between).
 * Tailwind's step is 4px, so `p-5` is 20 and `gap-1.5` is 6; bracketed values
 * are read as written.
 *
 * WHAT IT CANNOT SEE, STATED: a distance set in a style attribute, in a grid
 * template, or through a line height. Those are real distances and this is
 * blind to them, which is why DISTANCES.md also carries rules the page
 * checkers measure on the rendered page.
 *
 *   node scripts/verify_distance_ladder.mjs
 *   node scripts/verify_distance_ladder.mjs --write   (seed the baseline)
 *   node scripts/verify_distance_ladder.mjs --list    (name every offender)
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "src/components/spine";
const BASELINE = "scripts/distance_ladder_baseline.json";
const LADDER = new Set([0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]);
const STEP = 4;

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
})(ROOT);

const UTIL = /(?:^|[\s"'`{])(-?)(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(\[[^\]\s]+\]|\d+(?:\.\d+)?|px)(?=$|[\s"'`}])/g;

const offenders = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(UTIL)) {
      const [, , util, raw] = m;
      let px = null;
      if (raw === "px") px = 1;
      else if (raw.startsWith("[")) {
        const n = /^(-?\d+(?:\.\d+)?)px$/.exec(raw.slice(1, -1));
        if (n) px = Math.abs(Number(n[1]));
      } else px = Number(raw) * STEP;
      if (px == null || LADDER.has(px)) continue;
      offenders.push({ file: rel, line: i + 1, util, px });
    }
  });
}

const byPx = new Map();
for (const o of offenders) byPx.set(o.px, (byPx.get(o.px) ?? 0) + 1);
const total = offenders.length;

if (process.argv.includes("--write")) {
  writeFileSync(BASELINE, JSON.stringify({ total, byPx: Object.fromEntries([...byPx].sort((a, b) => a[0] - b[0])) }, null, 1) + "\n", "utf8");
  console.log(`wrote ${BASELINE}: ${total} use(s) off the ladder`);
  process.exit(0);
}

if (process.argv.includes("--list")) {
  for (const o of offenders.sort((a, b) => a.px - b.px || a.file.localeCompare(b.file))) console.log(`  ${o.file}:${o.line} ${o.util}-* at ${o.px}px`);
}

let base;
try { base = JSON.parse(readFileSync(BASELINE, "utf8")); }
catch { console.error(`FAIL , no baseline at ${BASELINE}. Seed it with --write, and only on the run that writes DISTANCES.md.`); process.exit(1); }

const shape = [...byPx].sort((a, b) => a[0] - b[0]).map(([px, n]) => `${px}px x${n}`).join(", ") || "none";
console.log(`distance ladder: ${files.length} files, ${total} use(s) off the ladder against a baseline of ${base.total} (${shape})`);

if (total > base.total) {
  console.error(`\nFAIL , distances off the ladder rose from ${base.total} to ${total}.`);
  console.error("The ladder is DISTANCES.md section 1: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.");
  console.error("Run with --list to see every one. Never raise the baseline: put the distance on the ladder.");
  process.exit(1);
}
if (total < base.total) console.log(`  ${base.total - total} fewer than the baseline. Lower it with --write in the same commit.`);
console.log(`PASS verify_distance_ladder , ${total} off the ladder, at or under the baseline.`);
