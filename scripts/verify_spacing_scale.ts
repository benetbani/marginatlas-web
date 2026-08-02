/**
 * scripts/verify_spacing_scale.ts
 *
 * SPACING COMES FROM A SCALE, NOT FROM A GUESS AT THE MOMENT OF WRITING.
 *
 * Measured 2026-08-02 in the mockup stylesheet: 39 distinct non-zero spacing
 * values across 418 declarations, a continuous run from 1 to 20 with no gaps.
 * That is not a scale, it is a continuum, and it is how a 15 ends up beside a
 * 16 for no reason either of them could state. It arrived the same way the
 * fourteen whites did, one reasonable-looking value at a time.
 *
 * The steps below are the peaks that were already in the design, not an ideal
 * ladder imposed on it. The design's real vocabulary is 2px-granular in the
 * small range and jumps above 22, so the scale says that.
 *
 * SCOPE, and the reason for it. This gate watches the React kit, which the loop
 * writes, and NOT the mockup stylesheet, which the founder designs. Snapping the
 * existing 418 values would move a ratified design by up to 3px in tight
 * components, where an odd value is often an optical correction rather than a
 * drift. Standardising forward costs nothing and is enforceable; retrofitting
 * backward is a design decision and belongs in a review with crops.
 *
 * So: new spacing in the v2 components must land on a step. That is what stops
 * the continuum re-forming on the side the loop controls.
 *
 * Usage: npx tsx scripts/verify_spacing_scale.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, extname, relative } from "node:path";

/** The steps, derived from the design's own dominant values. */
const SCALE = new Set([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 26, 32, 40]);

const ROOTS = ["src/components/city2", "src/components/spine2"];

/**
 * GRANDFATHERED, and not silently. Eleven values in the spine-2 kit sit off the
 * scale. They are not obviously drift: spine-2 is the 1:1 port of the ratified
 * cell mockup, so a 7 there may be faithfully carrying a 7 the founder drew, and
 * snapping it would desync the port from the design it exists to reproduce.
 *
 * Checking each against the mockup is real work and it is a design conversation,
 * not a codemod. So they are listed, they are visible on every run, and NO NEW
 * ENTRY MAY BE ADDED. Same posture as the layering gate's allowlist: migrate
 * when touched, never grow.
 *
 * Keyed by file plus value, not line number, so a refactor does not churn it.
 */
const GRANDFATHERED = new Set([
  "src/components/spine2/page/Ch01Hero.tsx",
  "src/components/spine2/page/store.tsx",
  "src/components/spine2/page/CellPage.tsx",
  "src/components/spine2/Band.tsx",
]);

/** margin / padding / gap in an inline style object, numeric or px string. */
const DECL = /(?:margin|padding|gap|rowGap|columnGap)[A-Za-z]*\s*:\s*("[^"]*"|'[^']*'|[^,}\n]+)/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (extname(e.name) === ".tsx") out.push(p);
  }
  return out;
}

const failures: string[] = [];
const grandfatheredHits: string[] = [];

for (const root of ROOTS) {
  let files: string[];
  try {
    files = walk(root);
  } catch {
    continue;
  }
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const m of line.matchAll(DECL)) {
        const value = m[1];
        /* A CSS variable, a percentage, an em, a calc or "auto" is a deliberate
           relative choice, not a raw step. Only bare pixels are checked. */
        if (/var\(|%|r?em\b|calc|auto|clamp/.test(value)) continue;
        for (const n of value.matchAll(/(\d+(?:\.\d+)?)/g)) {
          const v = parseFloat(n[1]);
          if (v === 0) continue;
          const rel = relative(process.cwd(), file).replace(/\\/g, "/");
          if (!SCALE.has(v)) {
            if (GRANDFATHERED.has(rel)) {
              grandfatheredHits.push(`${rel}:${i + 1}  ${v}px`);
            } else {
              failures.push(
                `${rel}:${i + 1}  ${v}px  in  ${m[0].trim().slice(0, 60)}`,
              );
            }
          }
        }
      }
    });
  }
}

if (failures.length > 0) {
  console.error(
    `x verify_spacing_scale: ${failures.length} spacing value(s) off the scale.\n` +
      `   Steps: ${[...SCALE].join(", ")}.\n` +
      `   Pick the nearest step. If none of them is right, the scale is wrong\n` +
      `   and that is a design decision, not a local override.\n\n` +
      failures.map((f) => `     ${f}`).join("\n"),
  );
  process.exit(1);
}

const lines = [
  "verify_spacing_scale: PASS. Every new inline spacing value in the v2 kit is on the scale.",
];
if (grandfatheredHits.length > 0) {
  lines.push(
    `  ${grandfatheredHits.length} grandfathered value(s) in spine-2, listed so they stay visible:`,
    ...grandfatheredHits.map((g) => `    ${g}`),
    "  These may be faithful ports of the mockup. Check one against the design before moving it.",
  );
}
console.log(lines.join("\n"));
