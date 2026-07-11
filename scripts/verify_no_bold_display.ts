/**
 * scripts/verify_no_bold_display.ts
 *
 * Prebuild gate — rulebook v1: no very bold display text on the spine
 * + home surfaces. Weight tops out at semibold (600); `font-bold`
 * classes and `fontWeight: 700` inline styles are banned on these
 * files.
 *
 * Comment lines are exempt (not rendered). To allow a specific use
 * case, add an `// allow-bold` line-tail comment (mirrors the
 * em-dash gate's override idiom).
 *
 * Run: npx tsx scripts/verify_no_bold_display.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();

function tsxIn(dir: string): string[] {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join(dir, f).replace(/\\/g, "/"));
}

/** The spine + home surface files (same scope as verify_bar_budget). */
const SURFACE_FILES: string[] = [
  "src/app/dev/spine/page.tsx",
  ...tsxIn("src/app/dev/spine-city"),
  ...tsxIn("src/app/dev/spine-cell"),
  ...tsxIn("src/app/dev/spine-industry"),
  ...tsxIn("src/app/dev/spine-hood"),
  "src/components/spine/NeighborhoodExplorer.tsx",
  "src/components/home/home2-view.tsx",
];

// `font-bold` as a whole class token (font-boldish would not match)
// and `fontWeight: 700` / `fontWeight:700` (optionally quoted).
const BOLD_CLASS = /\bfont-bold\b/;
const BOLD_STYLE = /fontWeight:\s*['"]?700\b/;

function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("*")) return true; // inside /** ... */ block
  if (trimmed.startsWith("/*")) return true;
  if (trimmed.startsWith("{/*")) return true; // JSX comment open
  if (trimmed.startsWith("*/}") || trimmed.endsWith("*/}")) return true; // JSX comment close
  return false;
}

function isAllowed(line: string): boolean {
  return line.includes("allow-bold");
}

let violations = 0;

for (const file of SURFACE_FILES) {
  const abs = resolve(ROOT, file);
  if (!existsSync(abs)) continue;
  const lines = readFileSync(abs, "utf-8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!BOLD_CLASS.test(line) && !BOLD_STYLE.test(line)) continue;
    if (isCommentLine(line)) continue;
    if (isAllowed(line)) continue;
    const what = BOLD_CLASS.test(line) ? "font-bold className" : "fontWeight: 700";
    console.error(`${file}:${i + 1}: ${what}\n  ${line.trim()}`);
    violations++;
  }
}

if (violations > 0) {
  console.error(`\n✗ ${violations} bold-display violation(s) on the spine/home surfaces.`);
  console.error("  Rulebook v1: weight tops out at semibold (600). Use font-semibold");
  console.error("  or fontWeight: 600. To allow, append // allow-bold to the line.");
  process.exit(1);
}

console.log("✓ No bold display text on the spine/home surfaces.");
