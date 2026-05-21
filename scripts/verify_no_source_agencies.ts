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

function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("*")) return true;
  if (trimmed.startsWith("/*")) return true;
  if (trimmed.startsWith("{/*")) return true;
  if (trimmed.endsWith("*/}")) return true;
  return false;
}

let violations = 0;
for (const file of walk(ROOT)) {
  const rel = file.replace(process.cwd(), ".").replace(/\\/g, "/").slice(2);
  if (ALLOWLIST.has(rel)) continue;
  const src = readFileSync(file, "utf-8");
  const lines = src.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCommentLine(line)) continue;
    if (line.includes("allow-source-agency")) continue;
    for (const token of AGENCY_TOKENS) {
      if (line.includes(token)) {
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
