#!/usr/bin/env node
/**
 * verify_no_scaling_drawings , a drawing that carries a measurement must not
 * stretch its own geometry.
 *
 * A fixed viewBox on a full-width element with no fixed height scales
 * EVERYTHING with the card: stroke widths, marker radii, the height of the box.
 * Measured on one card before it was rebuilt, the marker dots went from a 2.5
 * pixel radius on a phone to 6.9 at reading width and the box from 67 pixels
 * tall to 182, for three ticks that needed about fifty.
 *
 * THIS IS A HARD ZERO, NOT A RATCHET. Three charts were rebuilt during the 2026-08
 * loop for this fault and the count reached zero on 2026-08-24. A ratchet is for a
 * large honest starting count that has to come down over time; when the count is
 * already nothing, the right gate is one that refuses to let it grow.
 *
 * WHAT THIS CANNOT DISTINGUISH: a drawing that SHOULD scale (a decorative shape,
 * an icon, a logo) from one that should not. Icons are excluded by size, which is
 * a heuristic: a viewBox of 24 or less is treated as an icon. A genuinely
 * decorative full-bleed drawing should be given an explicit height, which is both
 * the fix and the way to satisfy this gate honestly.
 *
 *   node scripts/verify_no_scaling_drawings.mjs
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
})("src/components");

const bad = [];
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  for (const m of s.matchAll(/<svg\b[^>]*>/g)) {
    const tag = m[0];
    const vb = tag.match(/viewBox=[`"']?\{?[`"']?\s*([\d.\s]+)/);
    if (!vb) continue;
    const nums = vb[1].trim().split(/\s+/).map(Number);
    const [w, h] = [nums[2] ?? 0, nums[3] ?? 0];
    if (w <= 24 && h <= 24) continue; // an icon, meant to scale with its type
    if (!/className=[`"'][^`"']*\bw-full\b/.test(tag)) continue;
    const hasHeight =
      /\bh-\[/.test(tag) || /\bheight=/.test(tag) || /\bh-\d/.test(tag) || /\bh-full\b/.test(tag);
    if (hasHeight) continue;
    bad.push(`${rel}  viewBox ${w}x${h}`);
  }
}

if (bad.length) {
  console.error(`\nFAIL , ${bad.length} full-width drawing(s) with a fixed viewBox and no fixed height.`);
  console.error("Each one stretches its own stroke widths, marker sizes and box height with the card.\n");
  for (const b of bad) console.error(`  ${b}`);
  console.error(
    `\nGive it an explicit height and place its contents by percentage, or, if it is\n` +
      `decorative and meant to stretch, say so with a height class such as h-full.\n`,
  );
  process.exit(1);
}
console.log("PASS no-scaling-drawings , no drawing stretches its own geometry.");
