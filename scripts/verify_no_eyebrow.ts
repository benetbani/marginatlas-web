/**
 * scripts/verify_no_eyebrow.ts
 *
 * Prebuild gate , rulebook v1 rule 11: "Section (Movement) header: muted
 * chapter index plus ONE plain title. No eyebrow." The rulebook's own
 * changelog records this as a deliberate reversal (2026-07-10): every
 * hand-rolled eyebrow was "a vaguer restatement of its heading, a second
 * label carrying no information." Two named repeat offenders: "THE TRADE,
 * WORLDWIDE" over the industry masthead h1, and "THE #1 ATLAS OF LOCAL
 * PROFIT INTELLIGENCE" over the home h1.
 *
 * Heuristic (deliberately not a full JSX/AST parse , tuned against the
 * known cases above):
 *
 *   1. A CANDIDATE eyebrow is an opening <div>/<span>/<p> tag whose
 *      className contains BOTH "uppercase" AND "tracking-", OR whose plain
 *      text content is all-caps and 2+ words. The className check alone
 *      catches both named cases (their literal source text is mixed-case;
 *      the CSS class is what renders them as an eyebrow).
 *   2. From the end of that candidate element, we look ahead (bounded to
 *      LOOKAHEAD_CHARS, roughly a handful of lines, generous enough to
 *      cross a wrapping </div> and a multi-line JSDoc-style {/* comment *\/})
 *      for the next JSX opening tag matching <h1>, <h2>, <Movement,
 *      <Head, or <Rail. If found before any HARD-STOP (the closing tag of
 *      a structural wrapper , Box / section / Full / Even / Row /
 *      WideRail / Triptych / Narrow), the candidate is flagged as an
 *      eyebrow sitting immediately above a title.
 *
 * This intentionally does NOT special-case "but this one is a real
 * breadcrumb, not a vague label" , the rulebook's own example
 * ("Trades and character" over "The trades, the culture and the exit")
 * shows a near-miss is still a miss; a human triages the reported list
 * (Wave 1). What it DOES exempt, per the task brief:
 *   - The Movement/Rail's own internal chapter-index render (kit.tsx is
 *     not a scanned surface file, so this is exempt by scope alone).
 *   - A Kicker that IS the Rail/Movement's own single label: passed as a
 *     `kicker="..."` PROP on a single self-closing <Rail .../> tag, never
 *     a separate sibling JSX element, so it never matches the candidate
 *     scan at all (there is no separate "label element" to find).
 *
 * Comment lines are exempt. To allow a specific use case (e.g. a
 * deliberate wayfinding breadcrumb, not a restated-label eyebrow), add an
 * `// allow-eyebrow` line-tail comment on the candidate element's opening
 * tag line.
 *
 * Run: npx tsx scripts/verify_no_eyebrow.ts
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

/** The spine + home surface files (same scope as verify_bar_budget / verify_no_bold_display),
 * plus the home NavigatorForm if it exists at its current real path (grepped, not the
 * originally-assumed src/components/home/NavigatorForm.tsx). */
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

const CANDIDATE_TAG_RE = /<(div|span|p)\b/g;
const TARGET_TAG_RE = /<(h1|h2|Movement|Head|Rail)\b/;
const HARD_STOP_RE = /<\/(Box|section|Full|Even|Row|WideRail|Triptych|Narrow)>/;
/** Roughly a handful of lines: enough to cross a wrapping close tag + a multi-line
 * {/* ... *\/} JSDoc-style comment block (the home2-view "#1 atlas" case needs ~340
 * characters to clear a 5-line comment), bounded so it cannot bridge whole sections. */
const LOOKAHEAD_CHARS = 700;

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
  return line.includes("allow-eyebrow");
}

/**
 * From `tagStart` (the index of the `<` in `<div`/`<span`/`<p`), return the index
 * just past the opening tag's own closing `>`, tracking quote and `{...}` expression
 * depth so a `>` inside a string or a JSX expression attribute (e.g. `kicker={a > b}`)
 * never terminates the scan early. Mirrors verify_bar_budget's styleObjectEnd brace
 * counting, generalized to tag-close detection. Returns -1 if unbalanced.
 */
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

/** The first `</tagName>` at or after `fromIdx`, or null if none (self-closing / unclosed). */
function findClosingTag(src: string, tagName: string, fromIdx: number): { start: number; end: number } | null {
  const re = new RegExp(`</${tagName}\\s*>`, "g");
  re.lastIndex = fromIdx;
  const m = re.exec(src);
  return m ? { start: m.index, end: m.index + m[0].length } : null;
}

/** 1-based line number for a character offset, via binary search over line-start offsets. */
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

/** Strip `{...}` JSX expression interpolations (shallow, non-nested) so the ALL-CAPS
 * text check reads only literal static text, never a dynamic value's runtime content. */
function stripBraces(text: string): string {
  return text.replace(/\{[^{}]*\}/g, " ");
}

function looksAllCapsTwoWords(text: string): boolean {
  const cleaned = stripBraces(text).replace(/&[a-z]+;|&#\d+;/gi, " ").trim();
  if (!cleaned) return false;
  const letters = cleaned.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 4) return false; // need real words, not just punctuation/numbers
  if (cleaned !== cleaned.toUpperCase()) return false;
  if (cleaned === cleaned.toLowerCase()) return false; // no letters at all (numbers/symbols only)
  const words = cleaned.split(/\s+/).filter((w) => /[A-Z]/.test(w));
  return words.length >= 2;
}

let violations = 0;

for (const file of SURFACE_FILES) {
  const abs = resolve(ROOT, file);
  const src = readFileSync(abs, "utf-8");
  const lines = src.split("\n");
  const lineOf = makeLineOf(src);

  CANDIDATE_TAG_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CANDIDATE_TAG_RE.exec(src))) {
    const tagName = m[1];
    const tagStart = m.index;
    const lineNo = lineOf(tagStart);
    const lineText = lines[lineNo - 1];
    if (isCommentLine(lineText)) continue;
    if (isAllowed(lineText)) continue;

    const openEnd = tagOpenEnd(src, tagStart);
    if (openEnd === -1) continue;
    const openTagSpan = src.slice(tagStart, openEnd);
    const selfClosing = /\/\s*>$/.test(openTagSpan);

    const classMatch = /className\s*=\s*"([^"]*)"/.exec(openTagSpan);
    const classVal = classMatch?.[1] ?? "";
    const classEyebrow = classVal.includes("uppercase") && classVal.includes("tracking-");

    let elementEnd = openEnd;
    let matchedText = "";
    let textEyebrow = false;
    if (!selfClosing) {
      const close = findClosingTag(src, tagName, openEnd);
      if (close) {
        matchedText = src.slice(openEnd, close.start);
        textEyebrow = looksAllCapsTwoWords(matchedText);
        elementEnd = close.end;
      }
    }

    if (!classEyebrow && !textEyebrow) continue;

    const searchStart = elementEnd;
    const window = src.slice(searchStart, searchStart + LOOKAHEAD_CHARS);
    const targetMatch = TARGET_TAG_RE.exec(window);
    if (!targetMatch) continue;
    const hardStopMatch = HARD_STOP_RE.exec(window);
    if (hardStopMatch && hardStopMatch.index < targetMatch.index) continue; // left the parent first

    const displayText = (stripBraces(matchedText).trim() || lineText.trim()).slice(0, 80);
    const why = classEyebrow ? "uppercase + tracking- className" : "all-caps 2+ word text";
    console.error(
      `${file}:${lineNo}: hand-rolled eyebrow (${why}) immediately above <${targetMatch[1]}>\n  <${tagName}> "${displayText}"`,
    );
    violations++;
  }
}

if (violations > 0) {
  console.error(`\n✗ ${violations} eyebrow violation(s) on the spine/home surfaces.`);
  console.error("  Rulebook v1 rule 11: no eyebrow above a section/masthead title. Delete the");
  console.error("  label or fold its content into the title/subtitle. To allow a deliberate");
  console.error("  exception (e.g. a real wayfinding breadcrumb), append // allow-eyebrow.");
  process.exit(1);
}

console.log("✓ No hand-rolled eyebrows above a title on the spine/home surfaces.");
