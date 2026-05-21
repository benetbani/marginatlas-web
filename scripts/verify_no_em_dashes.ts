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
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd(), "src");
const TARGET = "—"; // em dash

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) acc.push(p);
  }
  return acc;
}

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
  return line.includes("allow-em-dash");
}

let violations = 0;
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes(TARGET)) continue;
    if (isCommentLine(line)) continue;
    if (isAllowed(line)) continue;
    console.error(
      `${file.replace(process.cwd(), ".")}:${i + 1}: em-dash in non-comment line\n  ${line.trim()}`,
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
