/**
 * sweep_scaling_svg , drawings that stretch their own geometry with the card.
 *
 * A fixed viewBox on a full-width element scales EVERYTHING: stroke widths,
 * marker radii, the height of the box. Measured on one card before it was
 * rebuilt, the marker dots went from a 2.5 pixel radius on a phone to 6.9 at
 * reading width and the box from 67 pixels tall to 182, for three ticks that
 * needed about fifty. Three charts in this codebase have now been rebuilt for
 * this reason.
 *
 * WHAT THIS CANNOT DISTINGUISH: a drawing that SHOULD scale (a decorative shape,
 * an icon, a logo) from one that should not (anything carrying a measurement).
 * Icons are excluded by size, which is a heuristic and not a rule: a viewBox of
 * 24 or less is treated as an icon.
 *
 * ONE FALSE POSITIVE FOUND ON THE FIRST RUN. The height check looked for a digit
 * after "h-", so it did not recognise "h-full", and it flagged a full-bleed
 * decorative cover that has a height and is meant to stretch. Fixed here. The
 * lesson is the same one this loop keeps paying for: read what the instrument
 * flagged before believing what it counted.
 *
 *   node scripts/sweep_scaling_svg.mjs
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

const flagged = [];
let icons = 0;
let fixed = 0;
let total = 0;

for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  for (const m of s.matchAll(/<svg\b[^>]*>/g)) {
    const tag = m[0];
    const vb = tag.match(/viewBox=[`"']?\{?[`"']?\s*([\d.\s]+)/);
    if (!vb) continue;
    total++;

    const nums = vb[1].trim().split(/\s+/).map(Number);
    const w = nums[2] ?? 0;
    const h = nums[3] ?? 0;
    /* An icon is small and square-ish and is meant to scale with its type size. */
    if (w <= 24 && h <= 24) { icons++; continue; }

    const fullWidth = /className=[`"'][^`"']*\bw-full\b/.test(tag);
    if (!fullWidth) continue;

    /* An explicit height stops the box growing; without one the browser takes
       the height from the viewBox ratio and the whole drawing scales with it. */
    const hasHeight =
      /\bh-\[/.test(tag) || /\bheight=/.test(tag) || /\bh-\d/.test(tag) || /\bh-full\b/.test(tag);
    if (hasHeight) { fixed++; continue; }

    /* A drawing told not to preserve its ratio distorts instead of scaling
       evenly, which is a different fault with the same cause. Called out
       separately so the two are not conflated. */
    const distorts = /preserveAspectRatio=[`"']none/.test(tag);
    flagged.push([rel, `${w}x${h}`, distorts, tag.slice(0, 96)]);
  }
}

console.log(`\n  ${total} drawing(s) with a fixed viewBox across the components`);
console.log(`  ${icons} of them are icon-sized and are meant to scale with their type`);
console.log(`  ${fixed} are full-width AND carry a fixed height, so only the scale stretches`);
console.log(`  ${flagged.length} are full-width with NO fixed height, so the whole drawing stretches\n`);
for (const [f, box, distorts, tag] of flagged) {
  console.log(`    ${box.padEnd(10)} ${distorts ? "and DISTORTS  " : "              "}${f}`);
  console.log(`      ${tag}`);
}
console.log(
  `\n  A drawing that carries a measurement should not scale its own geometry.\n` +
    `  A decorative one may. Open each.\n`,
);
