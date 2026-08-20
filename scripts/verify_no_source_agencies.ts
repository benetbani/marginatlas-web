/**
 * Plan v18 — prebuild guard: source-agency leak detector.
 *
 * Walks every .tsx and .ts file under src/ and fails the build if any
 * file contains a known source-agency name OUTSIDE of comments. This
 * enforces R-002 (Plan A lockdown): no source agency named in
 * user-visible text. Internal mapping tables in QualityBadge are allowed
 * because they map agency names to generic labels.
 *
 * To allow a specific use case, append `// allow-source-agency` to the line.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const ROOT = resolve(process.cwd(), "src");

const AGENCY_TOKENS = [
  "Eurostat",
  "Destatis",
  "INSEE",
  "ISTAT",
  "e-Stat",
  "IBGE",
  "INEGI",
  "OECD",
  "ONS NOMIS",
  "StatCan",
  "US Census",
  "Census Bureau",
  "World Bank",
];

// Files allowed to mention agencies (mapping tables, ingest scripts, etc.)
const ALLOWLIST = new Set([
  "src/components/QualityBadge.tsx", // maps agency names to generic labels
  "src/lib/audience.ts",
]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

/* `isCommentLine` deleted 2026-08-20. It was one of eight byte-similar copies and
   it asked whether a line LOOKS like a comment, so any line opening a block
   comment, or closing a JSX one, was skipped whole with its real code. Measured
   across `src/`: 42 lines of real code invisible to the eight, 9,033 lines of
   block-comment prose scanned as code by them. `stripCommentLines` strips the file
   once, in order, and returns the code half of every line; index it by line number.

   The two sequences are spelled out in prose above rather than quoted, because
   writing the JSX closer literally inside a block comment ENDS THE COMMENT at that
   point. That is what happened on the first draft of this note and it broke the
   file, which is a fair illustration of why no gate should hand-roll this. */

let violations = 0;
for (const file of walk(ROOT)) {
  const rel = file.replace(process.cwd(), ".").replace(/\\/g, "/").slice(2);
  if (ALLOWLIST.has(rel)) continue;
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  const code = stripCommentLines(lines);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    /* DETECT on the code half, REPORT and opt out on the raw line. The three are
       deliberately different: `allow-source-agency` is written as a comment, so
       it does not survive stripping, and an error quoting the stripped text would
       show the reader a line that is not in their file. */
    const codeLine = code[i];
    if (line.includes("allow-source-agency")) continue;
    for (const token of AGENCY_TOKENS) {
      if (codeLine.includes(token)) {
        console.error(
          `${rel}:${i + 1}: source-agency leak "${token}"\n  ${line.trim()}`,
        );
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n✗ ${violations} source-agency leak(s) found.`);
  console.error(
    `  Replace with generic terms ("National business statistics", "Regional benchmark", etc.).`,
  );
  console.error(
    `  To allow on a specific line, append // allow-source-agency.`,
  );
  process.exit(1);
}

console.log("✓ No source-agency leaks in user-visible source.");
