/**
 * scripts/verify_comparative_voice.ts
 *
 * ATO Phase 4 — soft gate (warn-only initially) that flags
 * descriptive-voice openers in user-visible source. The ATO framework
 * pushes Margin Atlas from "Typical operators report X" to "Watch
 * your X, typical range is Y-Z".
 *
 * The gate scans .tsx and .ts files under src/ and looks for strings
 * that BEGIN with a descriptive opener at sentence position. Phrases
 * inside paragraphs ("...is typical...") are allowed; the rule is
 * about *sentence-initial* descriptive voice.
 *
 * Banned opener phrases (sentence-initial, case-insensitive):
 *   Typical operators ...
 *   Most operators ...
 *   Average operators ...
 *   Usually operators ...
 *   Most firms ...
 *   Typical firms ...
 *
 * Whitelist:
 *   - Numeric labels and chart axes ("Typical revenue", "Typical
 *     annual revenue") — these are chart labels, not narrative voice
 *   - Comments (// or block) — only string literals are scanned
 *   - Documentation files
 *
 * Default mode: warn (exit 0 with a non-empty findings list).
 * Hard-fail mode: env COMPARATIVE_VOICE_STRICT=1 (Phase 4 will flip
 * the default to strict once the existing copy is migrated).
 *
 * Run: npx tsx scripts/verify_comparative_voice.ts
 * Strict: COMPARATIVE_VOICE_STRICT=1 npx tsx scripts/verify_comparative_voice.ts
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.resolve(ROOT, "src");
const STRICT = process.env.COMPARATIVE_VOICE_STRICT === "1";

// Banned sentence-initial openers. Anchored to ^ in the scanner.
const BANNED_OPENERS = [
  /^typical operators\b/i,
  /^most operators\b/i,
  /^average operators\b/i,
  /^usually operators\b/i,
  /^typical firms\b/i,
  /^most firms\b/i,
  /^the typical operator\b/i,
  /^the average operator\b/i,
];

// Files we never want to scan.
const SKIP_DIR_PARTS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  "__tests__",
  "test",
  "tests",
]);

function walk(dir: string, files: string[] = []): string[] {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    if (e.isDirectory()) {
      if (SKIP_DIR_PARTS.has(e.name)) continue;
      walk(path.join(dir, e.name), files);
    } else if (e.isFile()) {
      if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) {
        files.push(path.join(dir, e.name));
      }
    }
  }
  return files;
}

type Finding = { file: string; line: number; preview: string };
const findings: Finding[] = [];

// Match double-quoted, single-quoted, or backtick string literals.
const STRING_LITERAL_RE = /(["'`])((?:\\.|(?!\1).)*)\1/g;

const files = walk(SRC);
for (const file of files) {
  const text = fs.readFileSync(file, "utf-8");
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comment lines.
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
    // Find every string literal on the line and test its sentence-initial.
    let m: RegExpExecArray | null;
    STRING_LITERAL_RE.lastIndex = 0;
    while ((m = STRING_LITERAL_RE.exec(line)) !== null) {
      const literal = m[2].trim();
      if (literal.length < 8) continue;
      for (const rx of BANNED_OPENERS) {
        if (rx.test(literal)) {
          findings.push({
            file: path.relative(ROOT, file),
            line: i + 1,
            preview: literal.slice(0, 120),
          });
          break;
        }
      }
    }
  }
}

console.log("=== verify_comparative_voice ===");
console.log(`Scanned ${files.length} TS/TSX files under src/.`);
if (findings.length === 0) {
  console.log("  All clear. No descriptive-voice openers in user-visible source.");
  console.log("\n  GATE: PASS");
  process.exit(0);
}
console.log(`  ${findings.length} descriptive-voice opener(s) found.`);
for (const f of findings.slice(0, 30)) {
  console.log(`  - ${f.file}:${f.line}  "${f.preview}"`);
}
if (STRICT) {
  console.log("\n  GATE: FAIL (strict mode)");
  process.exit(1);
}
console.log("\n  GATE: WARN (warn-only; set COMPARATIVE_VOICE_STRICT=1 to hard-fail)");
process.exit(0);
