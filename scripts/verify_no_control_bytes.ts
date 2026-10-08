/**
 * scripts/verify_no_control_bytes.ts
 *
 * No source or document file holds a literal control byte: an escape written as `\u0000` or `\b` stays an escape.
 *
 * WHY (the checkup of 2026-10-08). The trap is written down three times (DOCTRINE 13, the 2026-10-05 and 2026-10-06 entries
 * of the dev gotchas): a shell heredoc or the Write tool turns `\b`, `\u0000` or an em dash's escape into the character itself. It was
 * a manual step ("scan touched files for control characters before committing"), and four scripts carried the bytes anyway:
 * scripts/counts.ts (a NUL in a regex: grep printed "Binary file matches" and the Grep tool found nothing in it), scripts/
 * verify_no_stock_imagery.ts (NULs early enough that git stored the gate as binary, so its diffs never showed), scripts/
 * harness/check_page_links.mjs (a backspace where a word boundary was meant: a clause that could never fire) and scripts/
 * verify_paragraph_budget.mjs. The repo's working method, rule 4: a lesson becomes a gate in the same session.
 *
 * WHAT IT READS. The text files (by extension) under src, scripts, tests, db, content and docs, and the text files at the
 * root. Skipped by path from the root, never by a bare name: node_modules, .next, .git, scratchpad, scratch, _archive,
 * design-assets, coverage. data/ is not read: a raw control byte inside a JSON string fails to parse, and the gates that
 * read data parse it. Tab, line feed and carriage return are text; every other byte under 32, and 127, is a red.
 *
 * BLIND SPOT: it cannot tell a byte someone meant from one a tool made; a file that needs one (none does today) writes the
 * escape instead. It reads the working tree, so an untracked file under a scanned folder is read too.
 *
 * usage: npx tsx scripts/verify_no_control_bytes.ts
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { red } from "./lib/red";

const RULE = "no-control-bytes";
const ROOT = process.cwd();
const FOLDERS = ["src", "scripts", "tests", "db", "content", "docs"];
const SKIP_PATHS = new Set(["node_modules", ".next", ".git", "scratchpad", "scratch", "_archive", "design-assets", "coverage"]);
const TEXT = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|json|md|mdx|css|scss|sql|py|sh|yml|yaml|txt)$/i;
const NAMES: Record<number, string> = { 0: "NUL", 8: "backspace", 11: "vertical tab", 12: "form feed", 27: "escape", 127: "delete" };

function walk(rel: string, out: string[]): void {
  const abs = path.join(ROOT, rel);
  for (const name of readdirSync(abs)) {
    const r = rel ? `${rel}/${name}` : name;
    if (SKIP_PATHS.has(r)) continue;
    const s = statSync(path.join(ROOT, r));
    if (s.isDirectory()) walk(r, out);
    else if (TEXT.test(name)) out.push(r);
  }
}

const files: string[] = [];
for (const f of FOLDERS) if (existsSync(path.join(ROOT, f))) walk(f, files);
for (const name of readdirSync(ROOT)) {
  if (TEXT.test(name) && statSync(path.join(ROOT, name)).isFile()) files.push(name);
}

let reds = 0;
for (const file of files) {
  const bytes = readFileSync(path.join(ROOT, file));
  let line = 1;
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i];
    if (c === 10) { line++; continue; }
    if ((c < 32 && c !== 9 && c !== 13) || c === 127) {
      const hex = c.toString(16).padStart(2, "0");
      red({
        rule: RULE,
        file,
        line,
        detail: `a literal control byte 0x${hex}${NAMES[c] ? ` (${NAMES[c]})` : ""}`,
        remedy: `write its escape instead (\\u00${hex}, or \\b where a word boundary was meant); a heredoc or the Write tool turned an escape into the byte`,
      });
      reds++;
    }
  }
}

if (reds > 0) {
  console.error(`\n  GATE: FAIL, ${reds} control byte(s) in ${files.length} text files read.`);
  process.exit(1);
}
console.log(`  GATE: PASS, no control byte in ${files.length} text files (src, scripts, tests, db, content, docs, the root).`);
