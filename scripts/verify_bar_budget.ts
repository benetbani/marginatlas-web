/**
 * scripts/verify_bar_budget.ts
 *
 * Prebuild gate — rulebook v1 bar rationing (2026-07-11 reformation).
 *
 * Counts bar-family GRAPHIC instances per spine page group and fails
 * when a group exceeds its budget. Two kinds of sites are counted:
 *
 *   1. JSX usages of the kit bar primitives (an opening tag like
 *      `<StackBar` — import lines and comment lines never count).
 *   2. Hand-rolled fill bars: an element whose inline style sets a
 *      percent width (`width: `${...}%`` template or a static
 *      `width: "..%"` string) AND sets a background in the same
 *      style object. A width without a background (layout sizing)
 *      is not a bar.
 *
 * A site is a source occurrence. Rows a primitive renders internally
 * do NOT multiply the count.
 *
 * Budgets (rulebook v1): city 3, cell 3, country 8, industry 3,
 * hood 2, home 2.
 *
 * Run: npx tsx scripts/verify_bar_budget.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = process.cwd();

/* FORM-CATALOG.md family alignment (rulebook v1): the budget counts the FILL-bar
 * family only (a value length-encoded as filled width). Marker-on-track forms
 * (EaseScale, SpreadStrip, SpectraTable, dot strips) are the DOT/MARKER family
 * and do not count , they are the July-3 vocabulary the founder ratified. */
const PRIMITIVES = [
  "MiniBar",
  "IndexBar",
  "StackBar",
  "ShareStack",
  "Waterfall",
  "Meter",
  "PhaseBar",
  "RankBars",
  "CellScaleBar",
];

type Group = { name: string; budget: number; files: string[] };

function tsxIn(dir: string): string[] {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join(dir, f).replace(/\\/g, "/"));
}

const GROUPS: Group[] = [
  { name: "country", budget: 8, files: ["src/app/dev/spine/page.tsx"] },
  { name: "city", budget: 3, files: ["src/components/spine/city/city-view.tsx"] },
  { name: "cell", budget: 3, files: ["src/components/spine/cell/cell-view.tsx"] },
  { name: "industry", budget: 3, files: ["src/components/spine/industry/industry-view.tsx"] },
  {
    name: "hood",
    budget: 2,
    files: ["src/components/spine/NeighborhoodExplorer.tsx"],
  },
  { name: "home", budget: 2, files: ["src/components/home/home2-view.tsx"] },
];

function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("*")) return true; // inside /** ... */ block
  if (trimmed.startsWith("/*")) return true;
  if (trimmed.startsWith("{/*")) return true; // JSX comment open
  if (trimmed.startsWith("*/}") || trimmed.endsWith("*/}")) return true; // JSX comment close
  return false;
}

type Site = { file: string; line: number; what: string };

/**
 * From the position right after `style={{` (depth 2 already open),
 * return the index just past the closing `}}`, or -1 if unbalanced.
 * Template-literal `${...}` braces are balanced, so plain counting holds.
 */
function styleObjectEnd(src: string, afterOpen: number): number {
  let depth = 2;
  for (let i = afterOpen; i < src.length; i++) {
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function countFile(relPath: string): Site[] {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) return [];
  const src = readFileSync(abs, "utf-8");
  const lines = src.split("\n");
  const sites: Site[] = [];

  // Offset -> 1-based line number.
  const lineStarts: number[] = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") lineStarts.push(i + 1);
  const lineOf = (idx: number): number => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= idx) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };

  // 1) Kit primitives: opening JSX tags only (never imports, never comments).
  const primRe = new RegExp(`<(${PRIMITIVES.join("|")})\\b`, "g");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCommentLine(line)) continue;
    if (/^\s*import\b/.test(line)) continue;
    let m: RegExpExecArray | null;
    primRe.lastIndex = 0;
    while ((m = primRe.exec(line))) {
      sites.push({ file: relPath, line: i + 1, what: `<${m[1]}>` });
    }
  }

  // 2) Hand-rolled fill bars: style width `${...}%` or "..%" + a background
  //    in the same style object.
  const widthRe = /width:\s*(?:`\$\{|"[^"\n]*%)/g;
  let m: RegExpExecArray | null;
  while ((m = widthRe.exec(src))) {
    const idx = m.index;
    const lineNo = lineOf(idx);
    if (isCommentLine(lines[lineNo - 1])) continue;
    const open = src.lastIndexOf("style={{", idx);
    if (open === -1) continue;
    const end = styleObjectEnd(src, open + "style={{".length);
    if (end === -1 || idx >= end) continue; // width not inside this style object
    const span = src.slice(open, end);
    if (!/\bbackground/.test(span)) continue; // sized layout, not a fill bar
    // Marker-family exemption (FORM-CATALOG): a range bracket or lollipop is a
    // THIN line (<= 4px) carrying a marker dot , dot/marker family, not a fill
    // bar. Real fill bars on these pages are h-2 (8px) and up.
    const elLine = lines[lineNo - 1];
    if (/h-px|h-\[[1-4]px\]|h-1(?![\d.\w])/.test(elLine)) continue;
    sites.push({ file: relPath, line: lineNo, what: "hand-rolled fill bar (width % + background)" });
  }

  // Segment collapse: two fill-bar matches within 3 lines of each other in the
  // same file are segments of ONE graphic (a split bar's two slices), not two
  // graphics. Keep the first, drop the adjacent.
  const collapsed: Site[] = [];
  for (const s of sites.sort((a, b) => a.line - b.line)) {
    const prev = collapsed[collapsed.length - 1];
    if (
      prev &&
      prev.what.startsWith("hand-rolled") &&
      s.what.startsWith("hand-rolled") &&
      s.line - prev.line <= 3
    ) {
      continue;
    }
    collapsed.push(s);
  }
  return collapsed;
}

let overBudget = 0;
const report: string[] = [];

for (const group of GROUPS) {
  const sites = group.files.flatMap(countFile);
  const ok = sites.length <= group.budget;
  report.push(`  ${ok ? "✓" : "✗"} ${group.name.padEnd(8)} ${sites.length}/${group.budget}`);
  if (!ok) {
    overBudget++;
    console.error(`✗ ${group.name}: ${sites.length} bar graphics, budget ${group.budget}. Counted sites:`);
    for (const s of sites) console.error(`    ${s.file}:${s.line}  ${s.what}`);
  }
}

console.log("verify_bar_budget: per-page bar counts");
for (const line of report) console.log(line);

if (overBudget > 0) {
  console.error(`\n✗ ${overBudget} page group(s) over the rulebook v1 bar budget.`);
  console.error("  Cut bars: keep the one decisive bar per idea, replace the rest with");
  console.error("  figures, tables, or prose (rulebook v1 bar rationing).");
  process.exit(1);
}

console.log("✓ All page groups within the bar budget.");
