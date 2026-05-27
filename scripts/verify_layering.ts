/**
 * scripts/verify_layering.ts
 *
 * Architecture-audit gate (2026-05-27, strategy G).
 *
 * Enforces a single layering rule:
 *
 *   PRESENTATION (src/app/, src/components/) MUST NOT import directly
 *   from `data/*.json`. All data access goes through `src/lib/`.
 *
 * Why: when components import JSON files directly, the data shape
 * becomes a hard contract for the renderer. A rename in the JSON
 * breaks the component immediately. The domain layer (which exists
 * for exactly this reason) gets bypassed for "convenience".
 *
 * Existing violations are grandfathered via an allowlist below so we
 * don't break production while doing the cleanup. The allowlist
 * shrinks as each violation is refactored to go through a `lib/`
 * module. Adding a new file to the allowlist is intentional and
 * should be flagged in PR review.
 *
 * Run: npx tsx scripts/verify_layering.ts
 * Exit 0 = pass (no new violations), exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PRESENTATION_DIRS = ["src/app", "src/components"];

/**
 * Files that already violate the layering rule and need refactoring.
 * Surfaced in docs/strategy/2026-05-27-architecture-audit.md §2.3.
 * Each entry should be removed as the file is migrated to go through
 * a `src/lib/` module instead. Do not add new entries here without
 * an explicit comment justifying the exception.
 */
const ALLOWLIST = new Set([
  // Pre-audit violations (2026-05-27 architecture audit grandfather list)
  "src/app/cities/page.tsx",
  "src/app/cities/[slug]/page.tsx",
  "src/app/cities/[slug]/neighborhoods/page.tsx",
  "src/app/cities/[slug]/curiosities/page.tsx",
  "src/app/countries/page.tsx",
  "src/app/decide/page.tsx",
  "src/app/decide/[activity]/[city]/page.tsx",
  "src/app/sitemap.ts",
  "src/app/compare/cities/[pair]/page.tsx",
  "src/app/[country]/[city]/[neighborhood]/page.tsx",
  "src/components/cities/BusinessFormationCosts.tsx",
  "src/components/cities/CitySignaturePanel.tsx",
  "src/components/countries/CountrySignaturePanel.tsx",
  "src/components/home/TopCitiesMosaic.tsx",
]);

/**
 * Regex for "imports a JSON file under the top-level data/ directory."
 * Matches both relative (../../../data/foo.json) and absolute alias
 * (@/data/foo.json, /data/foo.json) forms.
 */
const DATA_IMPORT_RE = /(?:from\s+["']|require\(\s*["'])(?:[./]*data\/|@\/data\/)[\w./-]+\.json["']/;

function walk(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === "dist") continue;
      walk(full, files);
    } else if (e.isFile() && (e.name.endsWith(".ts") || e.name.endsWith(".tsx"))) {
      files.push(full);
    }
  }
  return files;
}

const found: Array<{ file: string; line: number; text: string }> = [];

for (const presDir of PRESENTATION_DIRS) {
  const absDir = path.resolve(ROOT, presDir);
  if (!fs.existsSync(absDir)) continue;
  const files = walk(absDir);
  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const text = fs.readFileSync(file, "utf-8");
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (DATA_IMPORT_RE.test(lines[i])) {
        found.push({ file: rel, line: i + 1, text: lines[i].trim() });
      }
    }
  }
}

const grandfathered = found.filter((f) => ALLOWLIST.has(f.file));
const newViolations = found.filter((f) => !ALLOWLIST.has(f.file));

console.log("=== verify_layering ===");
console.log(`  Scanned: ${PRESENTATION_DIRS.join(", ")}`);
console.log(`  Direct data/ imports found: ${found.length}`);
console.log(`  Grandfathered (allowlist): ${grandfathered.length}`);
console.log(`  New violations: ${newViolations.length}`);

if (newViolations.length > 0) {
  console.log("\n  GATE: FAIL");
  console.log("  New layering violations (presentation -> data/):");
  for (const v of newViolations.slice(0, 30)) {
    console.log(`  - ${v.file}:${v.line}`);
    console.log(`      ${v.text}`);
  }
  console.log("");
  console.log("  Fix: move the data access into a src/lib/ module and import");
  console.log("  the typed accessor from your component / page.");
  process.exit(1);
}

if (grandfathered.length > 0) {
  console.log("\n  Grandfathered violations (refactor targets):");
  for (const v of grandfathered) {
    console.log(`  ~ ${v.file}:${v.line}`);
  }
}

console.log("\n  GATE: PASS");
