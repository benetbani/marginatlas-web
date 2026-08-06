/**
 * verify_v2_scales.ts , the icon and radius scales hold in the v2 kit.
 *
 * Two scales are decided in DESIGN.md and neither was enforced, so both would
 * drift back. This holds them.
 *
 * WHY THE SCOPE IS NARROW, and this is the part that took the measuring.
 *
 * The obvious version of this gate governs every component that renders an
 * icon. Run that way it fails correct code, because `src/app/dev/spine*`,
 * `spine2-*`, `brand-glyphs` and `spine-kit` are PREVIOUS-GENERATION
 * workbenches. They carry 32px, 26px, 20px and 15px glyphs that were right for
 * the generation they belong to and are not governed by the v2 scale. Failing
 * them would make this gate noise, and a gate that cries wolf gets switched
 * off. So this governs the CURRENT v2 surface only.
 *
 * WHY THE ICON SCALE IS FIVE AND NOT TWO. DESIGN.md said "the scale is 18 and
 * 13" with the rest listed as strays. Measured across the current surface, all
 * five sizes are considered choices on different objects:
 *
 *   18  33 uses  a section or chapter head. The workhorse.
 *   13  16 uses  a glyph inline in a row.
 *   24   3 uses  a chapter number tile and card tiles, where a bigger mark
 *                is the point.
 *   14   2 uses  the pricing matrix tick, which sits in a 74px column and
 *                would crowd it at 18.
 *   16   1 use   the footer social icon, specified at 16 in BRAND.md, with
 *                12px of padding round it to clear the 40px tap floor.
 *
 * A gate asserting two would have failed all six of the last three, which are
 * right. This asserts the five that exist and refuses a sixth.
 *
 * RADIUS. Tokens only: var(--r-lg) 10, var(--r-md) 8, var(--r-sm) 6,
 * var(--r-xs) 4. Also allowed: 999px for a pill on a small control, 50% for a
 * dot, and a literal 0, which is an explicit square and not a drifted value.
 *
 * Usage: npx tsx scripts/verify_v2_scales.ts
 * Exit 1 on any violation.
 */
import fs from "node:fs";
import path from "node:path";

/** The current v2 surface. Everything else is a previous generation. */
const ROOTS = [
  "src/components/spine2",
  "src/components/city2",
  "src/components/country2",
  "src/app/dev/home3",
  "src/app/dev/world2",
  "src/app/dev/compare2",
  "src/app/dev/pricing2",
  "src/app/dev/industries2",
  "src/app/dev/kit2",
];

const ICON_SCALE = new Set([13, 14, 16, 18, 24]);
const RADIUS_OK = /var\(--r-(lg|md|sm|xs)\)|999px|50%|^0$/;

type Violation = { file: string; line: number; what: string };

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r));
const violations: Violation[] = [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  lines.forEach((line, i) => {
    /* A line that is entirely a comment is documentation, not code. */
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    for (const m of line.matchAll(/\bsize=\{(\d+)\}/g)) {
      const n = Number(m[1]);
      if (!ICON_SCALE.has(n)) {
        violations.push({
          file: rel,
          line: i + 1,
          what: `icon size ${n}px is not on the scale (${[...ICON_SCALE].sort((a, b) => a - b).join(", ")})`,
        });
      }
    }

    for (const m of line.matchAll(/borderRadius:\s*([^,\n}]+)/g)) {
      const v = m[1].trim().replace(/["']/g, "");
      if (!RADIUS_OK.test(v)) {
        violations.push({
          file: rel,
          line: i + 1,
          what: `border radius ${v} is not a token (use var(--r-lg|md|sm|xs), 999px, 50% or 0)`,
        });
      }
    }
  });
}

console.log("=== verify_v2_scales ===");
console.log(`  Scanned: ${files.length} files across the current v2 surface`);

if (violations.length === 0) {
  console.log("  Icon sizes and border radii are on the scale.\n");
  console.log("  GATE: PASS");
  process.exit(0);
}

console.log(`  Violations: ${violations.length}\n`);
for (const v of violations) console.log(`  ${v.file}:${v.line}  ${v.what}`);
console.log(
  "\n  A new value needs a reason, and the reason belongs in DESIGN.md before\n" +
    "  it belongs in the scale. Do not widen this set to make a build pass.\n",
);
console.log("  GATE: FAIL");
process.exit(1);
