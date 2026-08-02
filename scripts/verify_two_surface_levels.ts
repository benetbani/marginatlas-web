/**
 * scripts/verify_two_surface_levels.ts
 *
 * THERE ARE EXACTLY TWO SURFACE LEVELS, AND THIS HOLDS THEM AT TWO.
 *
 * Founder's rule, 2026-08-01, verbatim: "Text should always be in some form of
 * card, stronger white. When no card we have a lighter version of white which
 * makes the same image in the background more visible. That's it."
 *
 * What it had drifted to before the rule: fourteen distinct white alphas
 * across the spine stylesheet. Fourteen is not a design, it is an absence of
 * one, and it happened one reasonable-looking value at a time. So the fix is
 * held by a gate rather than by memory: every white surface FILL must be
 * var(--card) or var(--air). A raw rgba(255,255,255,x) inside a background
 * declaration is the defect, whatever x is, because a third value is exactly
 * how the fourteenth arrived.
 *
 * WHAT IS DELIBERATELY OUT OF SCOPE. Borders, inset highlights, box-shadows
 * and glyph marks also use white at alpha, and they are edge EFFECTS, not
 * surfaces: they do not create a background level a reader perceives. Text
 * colors (color:) are not surfaces either. Scanning those would flood the
 * gate with legitimate hits and teach everyone to ignore it, which this
 * project has already paid for once.
 *
 * FILES. The generated stylesheet is always checked. The mockup SOURCE lives
 * in the parent repository, which a build server never has, so it is checked
 * when present and skipped with a loud message when not, exactly the pattern
 * scope_atlas_css.mjs uses. The skip is not a pass.
 *
 * Usage: npx tsx scripts/verify_two_surface_levels.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED = resolve(ROOT, "src/styles/atlas-spine.css");
const SOURCE = resolve(ROOT, "../design/mockups/atlas.css");

/** background / background-color / background-image declarations only. A
 * declaration runs to the next ; or }, so a shadow list after it is never
 * swept in. */
const DECL = /background(?:-color|-image)?\s*:[^;}]*/g;
const RAW_WHITE = /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,/;

function check(path: string, label: string): string[] {
  const css = readFileSync(path, "utf8");
  const bad: string[] = [];
  let lineStarts: number[] = [0];
  for (let i = 0; i < css.length; i++) if (css[i] === "\n") lineStarts.push(i + 1);
  const lineOf = (idx: number) => {
    let lo = 0, hi = lineStarts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= idx) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };
  for (const m of css.matchAll(DECL)) {
    if (RAW_WHITE.test(m[0])) {
      bad.push(`${label}:${lineOf(m.index ?? 0)}  ${m[0].slice(0, 90).replace(/\s+/g, " ")}`);
    }
  }
  return bad;
}

const failures: string[] = [];
failures.push(...check(GENERATED, "src/styles/atlas-spine.css"));

if (existsSync(SOURCE)) {
  failures.push(...check(SOURCE, "../design/mockups/atlas.css"));
} else {
  console.log(
    "verify_two_surface_levels: mockup source not in this repository (build\n" +
      "  server), checked the generated stylesheet only. This is not a pass on\n" +
      "  the source.",
  );
}

if (failures.length > 0) {
  console.error(
    `x verify_two_surface_levels: ${failures.length} raw white surface fill(s).\n` +
      `   The rule is TWO levels: var(--card) for anything holding text,\n` +
      `   var(--air) for surfaces that only sit over the background image.\n` +
      `   A third value is how the fourteenth arrived.\n\n` +
      failures.map((f) => `     ${f}`).join("\n"),
  );
  process.exit(1);
}

console.log("verify_two_surface_levels: PASS. Every white surface fill is --card or --air.");
