#!/usr/bin/env node
/**
 * scripts/audit/moss_amber_sweep.mjs , the deletion-safety check for the moss
 * and amber ramps. Run it BEFORE deleting either from design-tokens.ts:
 *
 *     node scripts/audit/moss_amber_sweep.mjs
 *
 * WHY THIS IS NOT verify_palette_membership. That gate is a RATCHET on a
 * count, and a count is not the question. The question is whether a ramp can be
 * removed without a call site losing its colour in silence, and silence is
 * exactly what happens: Tailwind emits no rule for a token that stopped
 * existing, tsc says nothing, no gate fires, and the element simply renders
 * uncoloured. Nothing anywhere reports it.
 *
 * It is deliberately WIDER than that gate in four directions, and every one of
 * the four hid a real, rendering reference during the 2026-08-17 sweep:
 *   1. ALL of src, not just src/components + src/app + src/styles, which are
 *      the gate's ROOTS. Six references were in src/lib.
 *   2. the design-token JS object, so `colors.moss[700]` counts. That form is
 *      not a hex, not an rgb() and not a class name, so the gate is blind to it
 *      by construction. Nine were property reads, four of them good-versus-bad
 *      scales on live reader-facing pages.
 *   3. CSS custom properties, so `var(--moss-600)` and `--amber-100:` both
 *      count. Twenty-four of these were rendering on /[country], with the USE
 *      in components and the DEFINITION in globals.css, so a scan of either
 *      half found nothing.
 *   4. the identifier anywhere, so a union member typed "moss" or an object key
 *      named `amber` counts too. One key called `amber` had held vermillion for
 *      months, which is how the word survives a purge and how the colour comes
 *      back.
 *
 * BLIND SPOTS, stated because quoting a measurement without them is how six
 * artifacts died in this project. It reads source TEXT, so it cannot see a
 * colour composed at runtime from a name it never reads, it cannot tell a live
 * reference from one behind a flag that is off, and it cannot tell a rendering
 * class from a dead one. It also cannot tell a colour from an English place
 * name: "Amber Valley" in regions_generated.ts is a real English district and
 * a URL slug, and must never be touched. For "is the word still written down
 * somewhere it could resolve to a colour" it is exact, and that is the
 * question a deletion needs answered.
 *
 * Comments are stripped with the same two-pass the gate uses, because a NOTE
 * about moss is not a use of moss and this repo writes long ones.
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src", "scripts"];
const EXTRA = ["tailwind.config.ts", "tailwind.config.js"].filter((p) => fs.existsSync(p));
/* The gate file and its baseline legitimately NAME the banned colours; that is
   their job. Excluded so the sweep reports call sites rather than the rule. */
const EXEMPT = new Set([
  "scripts/verify_palette_membership.mjs",
  "scripts/palette_baseline.json",
  /* And itself. Comment-stripping is not enough here: this file names the two
     colours in a regex and in a string, both of which are code. A checker that
     reports itself is the same class of mistake as the palette gate flagging
     the comment that recorded its own fix. */
  "scripts/audit/moss_amber_sweep.mjs",
]);

const WORD = /\b(moss|amber)\b/i;

function walk(d, out = []) {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css|mjs|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = [...ROOTS.flatMap((r) => walk(r)), ...EXTRA].filter((f) => !EXEMPT.has(f));
let total = 0;
for (const f of files) {
  const src = fs
    .readFileSync(f, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
  const hits = [];
  src.split("\n").forEach((ln, i) => {
    if (WORD.test(ln)) hits.push([i + 1, ln.trim().slice(0, 150)]);
  });
  if (hits.length) {
    total += hits.length;
    console.log(`\n=== ${f}  (${hits.length})`);
    for (const [n, w] of hits) console.log(`  ${String(n).padStart(5)}  ${w}`);
  }
}
console.log(
  total === 0
    ? "\nCLEAR: no moss or amber reference survives. The ramps can be deleted."
    : `\nSURVIVING REFERENCES: ${total}. Deleting the ramps would break these SILENTLY.`,
);
process.exit(total === 0 ? 0 : 1);
