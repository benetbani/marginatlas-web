#!/usr/bin/env node
/**
 * verify_scale_end_clamps , a mark placed by percentage and centred on its own
 * value must not be able to hang off the end of its box.
 *
 * The most repeated visual fault in this codebase: FOUR separate scales have had
 * a dot or a label centred at the very end with half of it outside the card.
 *
 * A RATCHET, NOT A HARD ZERO, and the distinction matters. The honest starting
 * count is around twenty-six placements across fifteen files. Fixing them all at
 * once would be dozens of untested visual edits, which is exactly the situation a
 * ratchet exists for: the number may fall and may never rise.
 *
 * WHAT THIS CANNOT DISTINGUISH: a scale whose values can never reach either end
 * from one whose values can. It reports the SHAPE. A file it names may already be
 * safe, which is why this counts rather than forbids.
 *
 * A NOTE ON WHY THE WINDOW IS SMALL. The first version of this check asked
 * whether a clamp appeared ANYWHERE IN THE FILE, and a Math.max used for
 * something unrelated three hundred lines away marked a scale as handled. It
 * reported one file where the honest answer was fifteen. A clamp only counts
 * within 400 characters of the placement it protects.
 *
 *   node scripts/verify_scale_end_clamps.mjs
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const BASELINE = "scripts/scale_end_baseline.json";
const CLAMP = /Math\.(min|max)\s*\(|[<>]=?\s*(?:8[0-9]|9[0-9])\b|\bedge\s*===?\s*"(?:right|left)"|\b(?:right|left):\s*0\b/;

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (extname(p) === ".tsx") files.push(p);
  }
})("src/components");

const counts = {};
let total = 0;
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  const spots = [...s.matchAll(/left:\s*`\$\{[^`]*\}%`/g)];
  if (!spots.length || !/-translate-x-1\/2/.test(s)) continue;
  let n = 0;
  for (const m of spots) {
    if (!CLAMP.test(s.slice(Math.max(0, m.index - 400), m.index + 400))) n++;
  }
  if (n) { counts[rel] = n; total += n; }
}

if (process.argv.includes("--write")) {
  writeFileSync(BASELINE, JSON.stringify({ total, files: counts }, null, 2) + "\n", "utf8");
  console.log(`wrote ${BASELINE}: ${total} unprotected placement(s)`);
  process.exit(0);
}

let base;
try {
  base = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  console.error(`FAIL , no baseline at ${BASELINE}. Create it with --write.`);
  process.exit(1);
}

if (total > base.total) {
  console.error(`\nFAIL , unprotected scale-end placements rose from ${base.total} to ${total}.`);
  console.error("This baseline may only come DOWN. Do not raise it to make this pass.\n");
  for (const [f, n] of Object.entries(counts)) {
    const was = base.files[f] ?? 0;
    if (n > was) console.error(`  ${f}: ${was} -> ${n}`);
  }
  console.error(
    `\nClamp the placement: pin the outermost marks inside the box instead of\n` +
      `centring them on their own value.\n`,
  );
  process.exit(1);
}
console.log(
  total < base.total
    ? `PASS scale-end-clamps , ${total} unprotected, down from ${base.total}. Run with --write to lower the baseline.`
    : `PASS scale-end-clamps , ${total} unprotected, unchanged.`,
);
