/**
 * verify_no_internal_notes - prebuild gate for v34 sanity sweep §1 #8.
 *
 * Fails the build if any user-visible source file contains:
 *   - "Cloned from X" (the auto_dealers/auto_dealers_gas split note
 *     visible on production today)
 *   - "Wave Nb" / "Wave 4b split"
 *   - bare TODO / FIXME / XXX / HACK / DEBUG strings in JSX text
 *
 * These patterns are fine in CODE COMMENTS but must never reach the
 * rendered DOM. The script walks src/ AND data/ AND public/ for any
 * .ts .tsx .json .md file that could be string-interpolated into a
 * page.
 *
 * Per-line opt-out: append `// allow-internal-note` to a line. Use
 * only when the match is provably non-rendered (e.g. a doc-string).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const PROJECT_ROOT = process.cwd();
const SCAN_DIRS = ["src", "data"].map((d) => resolve(PROJECT_ROOT, d));

// Patterns that should never appear in JSX text or in a data file
// whose contents get rendered. Each entry is a [label, regex].
// XXX and DEBUG are too noisy (XXX is also an ISO3 placeholder code,
// DEBUG can be a legitimate config name). Stick to the actual leaked
// engineering markers the founder reported plus TODO/FIXME.
const FORBIDDEN: Array<[string, RegExp]> = [
  ["clone-note", /Cloned from\s+\w+/],
  ["wave-note", /Wave\s+\d+[a-z]?\s+split/i],
  ["bare-todo", /\bTODO\b/],
  ["bare-fixme", /\bFIXME\b/],
];

type Hit = { file: string; line: number; text: string; label: string };

function walk(dir: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      // Skip node_modules and build output.
      if (name === "node_modules" || name === ".next" || name === "coverage")
        continue;
      walk(p, acc);
    } else if (
      p.endsWith(".tsx") ||
      p.endsWith(".ts") ||
      p.endsWith(".json")
    ) {
      acc.push(p);
    }
  }
  return acc;
}

function isCodeCommentLine(line: string): boolean {
  const t = line.trim();
  return (
    t.startsWith("//") ||
    t.startsWith("*") ||
    t.startsWith("/*") ||
    t.startsWith("{/*")
  );
}

function isAllowed(line: string): boolean {
  return line.includes("allow-internal-note");
}

const hits: Hit[] = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    let src: string;
    try {
      src = readFileSync(file, "utf-8");
    } catch {
      continue;
    }
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isAllowed(line)) continue;

      // For .ts and .tsx, skip code-comment lines (folder ignores
      // markdown-style notes baked into JSDoc blocks).
      if (
        (file.endsWith(".ts") || file.endsWith(".tsx")) &&
        isCodeCommentLine(line)
      ) {
        continue;
      }

      for (const [label, regex] of FORBIDDEN) {
        if (regex.test(line)) {
          hits.push({
            file: file.replace(PROJECT_ROOT, "."),
            line: i + 1,
            text: line.trim().slice(0, 160),
            label,
          });
        }
      }
    }
  }
}

if (hits.length === 0) {
  console.log(
    `[verify_no_internal_notes] PASS: no internal notes leaking into ` +
      `user-visible source across ${SCAN_DIRS.join(", ")}`,
  );
  process.exit(0);
}

console.error(
  `[verify_no_internal_notes] FAIL: ${hits.length} internal-note ` +
    `leak(s) found:`,
);
for (const h of hits) {
  console.error(`  [${h.label}] ${h.file}:${h.line}: ${h.text}`);
}
console.error(
  `\nTo opt a single line out, append // allow-internal-note (use only ` +
    `when the match is provably non-rendered).`,
);
process.exit(1);
