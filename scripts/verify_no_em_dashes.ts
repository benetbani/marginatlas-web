/**
 * verify_no_em_dashes — prebuild guard for Plan v16 Block G.
 *
 * Scans every .tsx and .ts file under src/ for em-dashes ('—', U+2014) that
 * appear inside JSX text or string literals. Em-dashes in pure comment
 * lines (`//` or `* ` inside `/** ... *\/` blocks) are allowed because
 * they're not rendered.
 *
 * Founder rule (Plan v16): em-dashes banned everywhere on the live site.
 * Body copy and headlines use commas, periods, or colons instead.
 *
 * To allow a specific use case, add an `// allow-em-dash` line-tail comment.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const SRC_ROOT = resolve(process.cwd(), "src");
// content/blog is the only user-rendered markdown: titles + excerpts
// surface on the homepage rail via getAllPosts(), and bodies render on
// /blog/[slug]. The original gate only scanned src/, so em-dashes in
// blog frontmatter leaked to the live homepage (QA failure C7).
// NOTE: content/learn and content/glossary are NOT scanned because the
// site renders /learn from src/lib/learn/articles.ts (a TS module) and
// has no glossary route; their markdown is draft/non-rendered. content/
// superpowers holds internal planning docs that legitimately discuss the
// em-dash rule. Widen this only if those dirs become user-rendered.
const CONTENT_ROOT = resolve(process.cwd(), "content", "blog");
const TARGET = "—"; // em dash

function walk(dir: string, exts: string[], acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, exts, acc);
    else if (exts.some((e) => p.endsWith(e))) acc.push(p);
  }
  return acc;
}

/* `isCommentLine` deleted 2026-08-20, one of eight byte-similar copies. It asked
   whether a line LOOKS like a comment, so a line opening a block comment, or
   closing a JSX one, was skipped whole with its real code on it. Measured across
   `src/`: 42 lines of real code invisible to the eight, 9,033 lines of
   block-comment prose scanned as code. `stripCommentLines` strips the file once,
   in order, and returns the code half of every line; index it by line number. */

function isAllowed(line: string): boolean {
  return line.includes("allow-em-dash");
}

let violations = 0;

// Pass 1: TS/TSX under src/. Comment lines are exempt (not rendered).
for (const file of walk(SRC_ROOT, [".tsx", ".ts"])) {
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  const code = stripCommentLines(lines);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    /* DETECT on the code half, REPORT and opt out on the raw line. The cheap
       `includes` guard now reads `code[i]`, not `line`, and that ordering is not
       cosmetic: with a per-line state machine, a guard testing the raw line first
       would skip lines the machine never sees. `stripCommentLines` strips the
       whole file in order up front, so the guard is free to sit here. */
    if (!code[i].includes(TARGET)) continue;
    if (isAllowed(line)) continue;
    console.error(
      `${file.replace(process.cwd(), ".")}:${i + 1}: em-dash in non-comment line\n  ${line.trim()}`,
    );
    violations++;
  }
}

// Pass 2: markdown under content/. Every line is user-visible (no code
// comments in markdown), so there is no comment exemption. The
// allow-em-dash escape hatch (write it inside an HTML comment, e.g.
// <!-- allow-em-dash -->) still applies for the rare legitimate case.
for (const file of walk(CONTENT_ROOT, [".md", ".mdx"])) {
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(TARGET)) continue;
    if (isAllowed(line)) continue;
    console.error(
      `${file.replace(process.cwd(), ".")}:${i + 1}: em-dash in markdown content\n  ${line.trim()}`,
    );
    violations++;
  }
}

if (violations > 0) {
  console.error(`\n✗ ${violations} em-dash violation(s) under src/.`);
  console.error(`  Em-dashes are banned in user-visible copy. Replace with`);
  console.error(`  comma, period, or colon. To allow, append // allow-em-dash.`);
  process.exit(1);
}

console.log("✓ No em-dashes in user-visible source.");
