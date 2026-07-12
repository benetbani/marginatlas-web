/**
 * scripts/verify_subsection_icons.ts
 *
 * Prebuild gate , rulebook v1 rule 12: "Subsection header (Head/Rail): Ico
 * tile (h-7 w-7 rounded-lg AtlasIcon) LEFT of the title. Icons are ON at
 * subsection level (2026-07-11 reversal)." Every <Head> and <Rail> call
 * site on the spine/home surfaces must carry an `icon=` attribute.
 *
 * Tag-scan is multiline-aware (mirrors verify_bar_budget's brace-depth
 * approach, generalized from `}` to the tag's own closing `>`): an opening
 * tag's attributes may in principle span multiple lines, so this finds the
 * FULL extent of `<Head ...>` / `<Rail .../>` before checking for `icon=`,
 * rather than a single-line regex that would miss a wrapped attribute list.
 *
 * This WILL fail now on the known missing sites (rulebook v1 was only
 * reversed 2026-07-11; several call sites predate the icon restore and
 * were never backfilled). That is correct , report them; they feed Wave 1.
 *
 * Comment lines are exempt. To allow a specific call site (a deliberate
 * icon-less subsection), add an `// allow-no-icon` line-tail comment on
 * the tag's opening line.
 *
 * Run: npx tsx scripts/verify_subsection_icons.ts
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

/** The spine + home surface files (same scope as verify_bar_budget / verify_no_bold_display). */
const SURFACE_FILES: string[] = [
  "src/app/dev/spine/page.tsx",
  ...tsxIn("src/app/dev/spine-city"),
  ...tsxIn("src/app/dev/spine-cell"),
  ...tsxIn("src/app/dev/spine-industry"),
  ...tsxIn("src/app/dev/spine-hood"),
  "src/components/spine/NeighborhoodExplorer.tsx",
  "src/components/home/home2-view.tsx",
  "src/components/NavigatorForm.tsx",
].filter((f) => existsSync(resolve(ROOT, f)));

const TAG_RE = /<(Head|Rail)\b/g;

function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("*")) return true;
  if (trimmed.startsWith("/*")) return true;
  if (trimmed.startsWith("{/*")) return true;
  if (trimmed.startsWith("*/}") || trimmed.endsWith("*/}")) return true;
  return false;
}

/** Same brace/quote-depth tag-close scan as verify_no_eyebrow's tagOpenEnd. */
function tagOpenEnd(src: string, tagStart: number): number {
  let braceDepth = 0;
  let quote: string | null = null;
  for (let i = tagStart; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; continue; }
    if (ch === "{") { braceDepth++; continue; }
    if (ch === "}") { braceDepth--; continue; }
    if (ch === ">" && braceDepth === 0) return i + 1;
  }
  return -1;
}

function makeLineOf(src: string): (idx: number) => number {
  const lineStarts: number[] = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") lineStarts.push(i + 1);
  return (idx: number) => {
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= idx) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

let violations = 0;
const report: string[] = [];

for (const file of SURFACE_FILES) {
  const abs = resolve(ROOT, file);
  const src = readFileSync(abs, "utf-8");
  const lines = src.split("\n");
  const lineOf = makeLineOf(src);

  TAG_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_RE.exec(src))) {
    const tagName = m[1];
    const tagStart = m.index;
    const lineNo = lineOf(tagStart);
    const lineText = lines[lineNo - 1];
    if (isCommentLine(lineText)) continue;

    const openEnd = tagOpenEnd(src, tagStart);
    if (openEnd === -1) continue; // unbalanced, skip defensively rather than crash
    const endLineNo = lineOf(openEnd);
    const tagSpan = src.slice(tagStart, openEnd);
    const spanLines = lines.slice(lineNo - 1, endLineNo).join("\n");

    if (/\ballow-no-icon\b/.test(spanLines)) continue;
    if (/\bicon\s*=/.test(tagSpan)) continue; // has an icon attribute (any value)

    report.push(`${file}:${lineNo}: <${tagName}> missing icon=\n  ${lineText.trim()}`);
    violations++;
  }
}

if (violations > 0) {
  console.error("verify_subsection_icons: offenders (rulebook v1 rule 12, icons ON at subsection level):\n");
  for (const line of report) console.error(line);
  console.error(`\n✗ ${violations} <Head>/<Rail> call site(s) missing icon= on the spine/home surfaces.`);
  console.error("  Add icon=\"<AtlasIconId>\" (see src/components/brand/icons.tsx for the id set).");
  console.error("  To allow a deliberate exception, append // allow-no-icon to the tag's opening line.");
  process.exit(1);
}

console.log("✓ Every <Head>/<Rail> on the spine/home surfaces carries an icon.");
