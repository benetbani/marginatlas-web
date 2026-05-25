/**
 * find_useless_tiles.ts
 *
 * Country-page rebuild §7 (2026-05-25): the founder identified a
 * persistent class of bug — "fake stats / counts of things / internal
 * metadata exposed as user-facing tiles". E.g. "44 industries covered",
 * "Cities ranked 0", "Rate source: Country-specific", "Fallback".
 *
 * This script walks src/components/ and src/app/ for the patterns
 * below, emits coverage/useless-tiles.csv with one row per match,
 * and exits 1 when un-whitelisted matches are found.
 *
 * Whitelist: append `/* useless-tile-ok: <reason> *\/` immediately
 * before the matching line (same line or the line above) to suppress
 * a deliberate exception. The reason is logged in the CSV.
 *
 * Patterns (matched case-insensitively in source text):
 *   - "industries covered", "cities ranked", "countries tracked", etc.
 *   - "rate source", "data quality"
 *   - "country-specific" / "regional benchmark fallback" combos
 *   - any `label: "...Estimated:..."` / `label: "...Verified:..."`
 *
 * The script does NOT lint general use of "estimated" or "fallback"
 * in comments/docs/internal code — only label-shaped occurrences in
 * the JSX-rendered string positions.
 *
 * Run: npx tsx scripts/audit/find_useless_tiles.ts
 */

import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { readdirSync } from "node:fs";

const ROOT = process.cwd();
const SCAN_DIRS = [resolve(ROOT, "src/components"), resolve(ROOT, "src/app")];
const REPORT = resolve(ROOT, "coverage/useless-tiles.csv");

type Hit = {
  file: string;
  line: number;
  matched: string;
  rule: string;
  whitelisted: boolean;
  reason: string;
};

const RULES: Array<{
  name: string;
  regex: RegExp;
}> = [
  {
    name: "count-of-things",
    regex:
      /\b(industries|cities|countries|regions|sectors|activities|states)\s+(covered|ranked|tracked|listed|indexed)\b/i,
  },
  {
    name: "rate-source-tile",
    regex: /\brate\s+source\b/i,
  },
  {
    name: "data-quality-tile",
    regex: /\bdata.quality\b\s*[:=]/i,
  },
  {
    name: "fallback-as-label",
    regex: /(?:label|title|name)\s*[:=]\s*['"`][^'"`\n]*\bfallback\b/i,
  },
  {
    name: "rate-fallback-pair",
    regex: /["'`]\s*Country-specific\s*["'`]|Regional\s+benchmark\s+fallback/i,
  },
  {
    name: "verified-as-tile-value",
    regex:
      /(?:label|value|title)\s*[:=]\s*['"`][^'"`\n]{0,30}\b(verified|measured|approximate)\b/i,
  },
];

function isCodeFile(name: string): boolean {
  return (
    name.endsWith(".tsx") ||
    name.endsWith(".ts") ||
    name.endsWith(".jsx") ||
    name.endsWith(".js")
  );
}

function walk(dir: string, out: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else if (isCodeFile(name)) out.push(full);
  }
}

/**
 * Check if the matching line or any of the 3 lines above it has the
 * whitelist marker `useless-tile-ok: <reason>`. Returns the reason
 * when present, empty string when not whitelisted.
 *
 * 3-line lookback handles JSX patterns where the whitelist comment
 * sits above an opening tag and the matching text is on a following
 * line, plus JSDoc blocks where the comment is on a `* ` line above
 * another `* ` line.
 */
function whitelistReason(lines: string[], lineIdx: number): string {
  const re = /useless-tile-ok\s*:\s*(.+?)(?:\*\/|\*\*\/|$)/i;
  for (let k = 0; k <= 3; k++) {
    const idx = lineIdx - k;
    if (idx < 0) break;
    const m = (lines[idx] || "").match(re);
    if (m) return m[1].trim();
  }
  return "";
}

const files: string[] = [];
for (const d of SCAN_DIRS) walk(d, files);

// Track which lines are inside a JSDoc block opener (slash-star-star).
// JSDoc is documentation about a function or component; it routinely
// mentions removed tile labels in "this replaces X" context. Matches
// inside JSDoc are skipped entirely.
function jsdocLineMask(text: string): boolean[] {
  const lines = text.split(/\r?\n/);
  const mask: boolean[] = new Array(lines.length).fill(false);
  let inside = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inside && /\/\*\*/.test(line)) inside = true;
    if (inside) mask[i] = true;
    if (inside && /\*\//.test(line)) inside = false;
  }
  return mask;
}

const hits: Hit[] = [];
for (const file of files) {
  let text: string;
  try {
    text = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const lines = text.split(/\r?\n/);
  const docMask = jsdocLineMask(text);
  for (let i = 0; i < lines.length; i++) {
    if (docMask[i]) continue;
    const line = lines[i];
    for (const rule of RULES) {
      const m = line.match(rule.regex);
      if (!m) continue;
      const reason = whitelistReason(lines, i);
      hits.push({
        file: relative(ROOT, file),
        line: i + 1,
        matched: m[0],
        rule: rule.name,
        whitelisted: reason.length > 0,
        reason,
      });
    }
  }
}

// Always write the report; whitelisted rows still appear so the
// founder can audit what's been deliberately allowed.
try {
  mkdirSync(resolve(ROOT, "coverage"), { recursive: true });
} catch {
  // ignore
}
const header = "file,line,rule,whitelisted,matched,reason";
const rows = hits.map(
  (h) =>
    [
      h.file.replace(/\\/g, "/"),
      h.line,
      h.rule,
      h.whitelisted ? "yes" : "no",
      JSON.stringify(h.matched),
      JSON.stringify(h.reason || ""),
    ].join(","),
);
writeFileSync(REPORT, [header, ...rows].join("\n") + "\n", "utf-8");

const violations = hits.filter((h) => !h.whitelisted);

if (violations.length > 0) {
  console.error(
    `\nverify_no_useless_tiles: FAIL with ${violations.length} un-whitelisted tile(s).`,
  );
  console.error(`Report written to ${relative(ROOT, REPORT)}.`);
  console.error("");
  for (const h of violations.slice(0, 30)) {
    console.error(
      `  ${h.file.replace(/\\/g, "/")}:${h.line} [${h.rule}] ${h.matched}`,
    );
  }
  if (violations.length > 30) {
    console.error(`  ... and ${violations.length - 30} more.`);
  }
  console.error("");
  console.error(
    "These tile patterns expose internal metadata or count-of-things",
  );
  console.error(
    "trivia as user-facing content. Replace with information that helps",
  );
  console.error(
    "a person evaluating a small-business decision, OR mark the line",
  );
  console.error(
    "with /* useless-tile-ok: <reason> */ above it if the surfacing is",
  );
  console.error("deliberate.");
  process.exit(1);
}

const whitelisted = hits.filter((h) => h.whitelisted);
console.log(
  `verify_no_useless_tiles: PASS. 0 un-whitelisted matches across ${files.length} files (${whitelisted.length} whitelisted).`,
);
