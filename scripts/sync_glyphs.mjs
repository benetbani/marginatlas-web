/**
 * scripts/sync_glyphs.mjs , regenerate src/components/spine2/glyphs.ts from
 * design/mockups/glyphs.js.
 *
 * WHY THIS EXISTS. `glyphs.ts` carried a header saying "GENERATED from
 * design/mockups/glyphs.js ... Regenerate rather than editing", and no
 * regenerator existed. The two files had simply been kept in step by hand. That
 * is fine for 85 stable glyphs and it stops being fine the moment a batch of new
 * ones arrives, which is exactly what is queued: a commissioned micro-icon set.
 * Hand-porting a hundred escaped SVG path strings is how a typo becomes a
 * rendering bug nobody can find.
 *
 * WHAT IT DOES NOT DO. It does not draw, validate artwork, or judge. It moves
 * path data from the source of truth to the typed consumer, and it refuses
 * loudly rather than writing something wrong.
 *
 * THE CHECKS IT REFUSES ON, and why each one is here:
 *   - a glyph whose body is empty              -> renders an invisible icon
 *   - a `<svg>` wrapper inside a body          -> nested svg, breaks sizing
 *   - a hardcoded stroke-width                 -> breaks optical weight at the
 *                                                 other sizes (the size class
 *                                                 owns stroke-width, not the path)
 *   - a `fill=` attribute                      -> defeats currentColor theming
 *   - more than one accented element           -> two focal points is no focal
 *                                                 point; the accent means
 *                                                 "this is the answer"
 *   - a name that is not kebab-case            -> keys are used as a TS union
 *
 * Usage:
 *   node scripts/sync_glyphs.mjs           write, refusing on any violation
 *   node scripts/sync_glyphs.mjs --check   exit 1 if out of date, write nothing
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "../design/mockups/glyphs.js");
const OUT = resolve(ROOT, "src/components/spine2/glyphs.ts");
const CHECK = process.argv.includes("--check");

/* Evaluate the source the same way a browser does, in a tiny sandbox, rather
   than regex-parsing it. The file assigns window.GLYPHS and then patches one
   more entry in programmatically (wealth-household); a regex over the object
   literal alone would silently drop it, which is precisely the class of bug
   this script exists to prevent. */
const source = readFileSync(SRC, "utf8");
const win = { GLYPHS: null, ico: null };
const doc = { addEventListener() {}, querySelectorAll: () => [] };
try {
  new Function("window", "document", source)(win, doc);
} catch (err) {
  console.error(`x sync_glyphs: could not evaluate ${SRC}\n  ${err.message}`);
  process.exit(1);
}
const glyphs = win.GLYPHS;
if (!glyphs || typeof glyphs !== "object" || !Object.keys(glyphs).length) {
  console.error("x sync_glyphs: source defined no glyphs. Refusing to write an empty module.");
  process.exit(1);
}

const problems = [];
for (const [name, body] of Object.entries(glyphs)) {
  const at = (m) => problems.push(`${name}: ${m}`);
  if (typeof body !== "string" || !body.trim()) at("empty body");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) at("name is not kebab-case");
  if (/<svg|viewBox|xmlns/i.test(body)) at("contains an <svg> wrapper or viewBox");
  if (/stroke-width\s*=/i.test(body)) at("hardcodes stroke-width (the size class owns it)");
  if (/\sfill\s*=/i.test(body)) at("sets a fill attribute (defeats currentColor)");
  const accents = (body.match(/class=\\?"(a|af)\\?"/g) || []).length;
  if (accents > 1) at(`has ${accents} accented elements, max 1`);
}
if (problems.length) {
  console.error(`x sync_glyphs: ${problems.length} violation(s); nothing written.\n`);
  for (const p of problems) console.error("   " + p);
  process.exit(1);
}

const names = Object.keys(glyphs);
const header = `/**
 * src/components/spine2/glyphs.ts
 *
 * GENERATED , do not edit by hand. Run \`node scripts/sync_glyphs.mjs\`.
 * Source of truth: design/mockups/glyphs.js
 *
 * ${names.length} glyphs. Terracotta accent is carried by class "a" (stroke) and
 * "af" (fill), coloured by the scoped stylesheet (.gi .a / .gi .af). Path data
 * only, no colour literals: stroke and fill come from currentColor and those
 * two classes, and stroke-width comes from the size class (gi-13 / gi-16 /
 * gi-22), never from the path.
 */

export const GLYPHS = {
`;
const body = names
  .map((n) => `  ${JSON.stringify(n)}:\n    ${JSON.stringify(glyphs[n])},`)
  .join("\n");
const footer = `
} as const;

export type GlyphId = keyof typeof GLYPHS;

export const GLYPH_IDS = Object.keys(GLYPHS) as GlyphId[];
`;
const next = header + body + footer;

let current = "";
try { current = readFileSync(OUT, "utf8"); } catch {}

if (CHECK) {
  if (current !== next) {
    console.error(
      `x sync_glyphs: ${OUT} is STALE against ${SRC}.\n` +
      `  Run: node scripts/sync_glyphs.mjs`,
    );
    process.exit(1);
  }
  console.log(`ok sync_glyphs: glyphs.ts is current (${names.length} glyphs).`);
  process.exit(0);
}

if (current === next) {
  console.log(`ok sync_glyphs: already current (${names.length} glyphs), not rewritten.`);
  process.exit(0);
}
writeFileSync(OUT, next, "utf8");
console.log(`sync_glyphs: wrote ${OUT} (${names.length} glyphs).`);
