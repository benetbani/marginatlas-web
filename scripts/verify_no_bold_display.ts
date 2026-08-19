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

/** The spine + home surface files (same scope as verify_bar_budget).
 * 2026-07-12 (four-gates task): added src/components/NavigatorForm.tsx ,
 * the homepage search launcher mounted directly inside home2-view.tsx
 * (`<NavigatorForm />`), which was outside the spine surface list even
 * though it renders on the same masthead. home2-view.tsx was already
 * present; NavigatorForm.tsx was the actual gap. */
/* REPOINTED 2026-08-19 FROM THE DEV WRAPPERS TO THE BODIES THEY RENDER.
   This list used to name src/app/dev/spine-cell|city|industry|hood. Those route
   files are 23 to 27 lines and carry ONE JSX element each: `<SpineCellBody />`
   and its siblings. So the rule was being enforced against a wrapper while the
   1,486-line body it renders, which the live route imports directly, was read by
   nothing. Measured: the four wrappers total 100 lines against 3,695 lines of
   body, and the bodies contain the vocabulary this gate checks (Rail 3 to 13,
   Movement 5 to 8, Head 0 to 10 per file), so the new coverage is real rather
   than vacuous. Dry-run before landing: zero new failures across all four
   sibling gates, which is why this could be a straight repoint and not a ratchet.
   `src/app/dev/spine/page.tsx` stays: it is the authored design reference. */
const SURFACE_FILES: string[] = [
  "src/app/dev/spine/page.tsx",
  "src/components/spine/city/city-view.tsx",
  "src/components/spine/cell/cell-view.tsx",
  "src/components/spine/industry/industry-view.tsx",
  "src/components/spine/NeighborhoodExplorer.tsx",
  "src/components/spine/NeighborhoodExplorer.tsx",
  "src/components/home/home2-view.tsx",
  "src/components/NavigatorForm.tsx",
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
