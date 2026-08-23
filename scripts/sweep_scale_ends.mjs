/**
 * sweep_scale_ends , marks placed by percentage with nothing keeping them inside
 * the box.
 *
 * A mark or a label centred on its own value at the very end of a scale has half
 * of it outside the card. FOUR separate scales in this codebase have had it, and
 * it is the most repeated fault this loop has found. The signature is a left
 * offset written as a percentage together with a half-width translate, and no
 * sign of a clamp.
 *
 * WHAT THIS CANNOT DISTINGUISH: a scale whose values can never reach either end
 * from one whose values can. It reports the SHAPE, not the risk.
 *
 * THE DANGEROUS DIRECTION IS THE OTHER ONE, and the first version had it. It
 * asked whether a clamp appeared ANYWHERE IN THE FILE, so a Math.max used for
 * something unrelated three hundred lines away marked a scale as handled. That
 * is a sweep that reassures instead of checking. A clamp now only counts when it
 * sits WITHIN 400 CHARACTERS of the placement it is supposed to protect.
 *
 *   node scripts/sweep_scale_ends.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (extname(p) === ".tsx") files.push(p);
  }
})("src/components");

/* A clamp is a comparison of the position against a threshold near an end, a
   Math.min/max around it, or an explicit pin to one side. */
const CLAMP = /Math\.(min|max)\s*\(|[<>]=?\s*(?:8[0-9]|9[0-9])\b|\bedge\s*===?\s*"(?:right|left)"|\b(?:right|left):\s*0\b/;

const flagged = [];
const protectedFiles = [];

for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  const spots = [...s.matchAll(/left:\s*`\$\{[^`]*\}%`/g)];
  if (!spots.length) continue;
  if (!/-translate-x-1\/2/.test(s)) continue;

  let unprotected = 0;
  for (const m of spots) {
    const near = s.slice(Math.max(0, m.index - 400), m.index + 400);
    if (!CLAMP.test(near)) unprotected++;
  }
  if (unprotected) flagged.push([rel, unprotected, spots.length]);
  else protectedFiles.push([rel, spots.length]);
}

console.log(`\n  ${flagged.length} file(s) place a centred mark by percentage with NO clamp within reach of it\n`);
for (const [f, bad, all] of flagged) {
  console.log(`    ${String(bad).padStart(2)} of ${String(all).padStart(2)} placement(s) unprotected   ${f}`);
}

console.log(`\n  ${protectedFiles.length} file(s) do the same and have a clamp beside every placement\n`);
for (const [f, n] of protectedFiles) console.log(`    ${String(n).padStart(2)} placement(s)   ${f}`);

console.log(
  `\n  This reports a SHAPE, not a defect: a scale whose values never reach an end\n` +
    `  is safe without a clamp. Open each and check what its data can actually do.\n`,
);
