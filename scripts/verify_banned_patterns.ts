/**
 * scripts/verify_banned_patterns.ts
 *
 * Prebuild gate — rulebook v1 banned metrics/copy. The 2026-07-11
 * reformation retired the derived "keep index" family and the
 * pre-asserted "Myth, busted" kicker; this gate keeps them from
 * creeping back into user-visible copy.
 *
 * Scope:
 *   - The spine + home surface .tsx files: banned substrings are
 *     checked case-insensitively in rendered lines (JSX text, string
 *     literals, template strings). Comment lines and trailing `//`
 *     comments are exempt (not rendered), as is any line carrying
 *     `// allow-banned-pattern`.
 *   - Seed JSON string VALUES under src/lib/spine-seeds/. Keys that
 *     start with `_` (e.g. _meta, _note) are provenance, not copy:
 *     their whole subtree is exempt. Seeds additionally ban the
 *     standalone crowding-score words ("Crowded" / "crowding" as a
 *     whole value).
 *
 * Run: npx tsx scripts/verify_banned_patterns.ts
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const ROOT = process.cwd();

const BANNED = [
  "keep index",
  "keep spread",
  "takes the most revenue",
  "keeps the most of it",
  "myth, busted",
];

/** Standalone crowding-score words, banned as whole JSON values (seeds only). */
const BANNED_STANDALONE_SEED_VALUES = ["crowded", "crowding"];

function tsxIn(dir: string): string[] {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join(dir, f).replace(/\\/g, "/"));
}

/** The spine + home surface files (same scope as verify_bar_budget). */
const SURFACE_FILES: string[] = [
  "src/app/dev/spine/page.tsx",
  ...tsxIn("src/app/dev/spine-city"),
  ...tsxIn("src/app/dev/spine-cell"),
  ...tsxIn("src/app/dev/spine-industry"),
  ...tsxIn("src/app/dev/spine-hood"),
  "src/components/spine/NeighborhoodExplorer.tsx",
  "src/components/home/home2-view.tsx",
];

const SEEDS_ROOT = resolve(ROOT, "src", "lib", "spine-seeds");

/* `isCommentLine` and `trailingCommentStart` both deleted 2026-08-20, replaced by
   the shared `stripCommentLines`.

   WORTH RECORDING BEFORE IT IS LOST: `trailingCommentStart` ALREADY carried the
   guard `if (i > 0 && line[i - 1] === ":") continue; // https:// etc.` That is
   exactly the defect found in the shared module on the same day, where a `//` in
   a URL opened a comment and hid 4,179 characters across `src/`. This gate knew,
   in a private copy, what the module every other gate depends on did not. That is
   the cost of eight copies stated in one sentence. */

function isAllowed(line: string): boolean {
  return line.includes("allow-banned-pattern");
}


let violations = 0;

// Pass 1: surface .tsx files.
for (const file of SURFACE_FILES) {
  const abs = resolve(ROOT, file);
  if (!existsSync(abs)) continue;
  const lines = readFileSync(abs, "utf-8").split("\n");
  const code = stripCommentLines(lines);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isAllowed(line)) continue;
    /* The code half already excludes both a whole-line comment and a trailing
       one, so the hand-rolled `isCommentLine` and `trailingCommentStart`, plus
       the "is this hit to the right of the comment" arithmetic, all collapse into
       this one lookup. Report on the raw line; a reader needs to see their file. */
    const lower = code[i].toLowerCase();
    for (const pattern of BANNED) {
      if (!lower.includes(pattern)) continue;
      console.error(`${file}:${i + 1}: banned pattern "${pattern}"\n  ${line.trim()}`);
      violations++;
    }
  }
}

// Pass 2: seed JSON string values.
function walkSeedDir(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkSeedDir(p, acc);
    else if (p.endsWith(".json")) acc.push(p);
  }
  return acc;
}

/** Best-effort line number for a JSON string value (JSON strings are single-line). */
function lineOfValue(raw: string, value: string, pattern: string): string {
  let idx = raw.indexOf(JSON.stringify(value));
  if (idx === -1) idx = raw.toLowerCase().indexOf(pattern.toLowerCase());
  if (idx === -1) return "?";
  return String(raw.slice(0, idx).split("\n").length);
}

function walkJson(
  node: unknown,
  keyPath: string,
  onString: (value: string, keyPath: string) => void,
): void {
  if (typeof node === "string") {
    onString(node, keyPath);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => walkJson(item, `${keyPath}[${i}]`, onString));
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("_")) continue; // _meta/_note provenance, exempt
      walkJson(value, keyPath ? `${keyPath}.${key}` : key, onString);
    }
  }
}

for (const abs of walkSeedDir(SEEDS_ROOT)) {
  const rel = abs.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", "");
  const raw = readFileSync(abs, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`${rel}: invalid JSON (${err instanceof Error ? err.message : String(err)})`);
    violations++;
    continue;
  }
  walkJson(parsed, "", (value, keyPath) => {
    const lower = value.toLowerCase();
    for (const pattern of BANNED) {
      if (!lower.includes(pattern)) continue;
      const line = lineOfValue(raw, value, pattern);
      console.error(`${rel}:${line}: banned pattern "${pattern}" in seed value at ${keyPath}`);
      violations++;
    }
    if (BANNED_STANDALONE_SEED_VALUES.includes(lower.trim())) {
      const line = lineOfValue(raw, value, value);
      console.error(`${rel}:${line}: standalone crowding word "${value}" in seed value at ${keyPath}`);
      violations++;
    }
  });
}

if (violations > 0) {
  console.error(`\n✗ ${violations} banned-pattern violation(s) on the spine/home surfaces + seeds.`);
  console.error("  Rulebook v1 retired these metrics/kickers. Rewrite the copy; in .tsx a");
  console.error("  deliberate exception can carry // allow-banned-pattern on the line, and");
  console.error("  in seeds provenance belongs under _meta/_note keys.");
  process.exit(1);
}

console.log("✓ No banned rulebook v1 patterns on the spine/home surfaces or seeds.");
