/**
 * scripts/verify_banned_vocabulary.ts
 *
 * The founder's banned words, enforced on the REACT SOURCE.
 *
 * WHY THIS EXISTS. The vocabulary ban was already enforced , but only against
 * `design/mockups/*.html`, by `verify_lattice.mjs`, whose PAGES constant reads
 * exactly three mockup files and never opens `src/`. So the ban held for the
 * design artifacts and not for the thing that actually ships.
 *
 * It caught nothing for months and then a real one got through: the trade page
 * rendered "employment costs over turnover for the trade" from
 * `spine2_adapter.ts`, straight to the reader, while 43 gates reported green.
 *
 * WHAT IS BANNED, and why each. These are the founder's, not mine:
 *   turnover              , trade jargon; the page says "revenue"
 *   covers                , restaurant jargon; the page says "orders"
 *   pp / percentage points, unreadable to a non-analyst
 *   net margin            , banned at city and country altitude specifically
 *                           (rulebook rule 5); trade-margin is legitimate, so
 *                           this matches the exact two-word phrase only
 *
 * HOW IT AVOIDS CRYING WOLF. A gate with false positives gets ignored, and this
 * project has already paid for that once. So:
 *   - Only STRING LITERALS are scanned. A comment explaining the ban, a variable
 *     named `turnoverBands`, or a JSON key is not user-facing copy.
 *   - Word boundaries are required, so `turnoverBands` and `coverage` are not
 *     matched by `turnover` and `covers`.
 *   - An allowlist carries the few legitimate uses, each with a reason.
 *
 * Usage: node --experimental-strip-types scripts/verify_banned_vocabulary.ts
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, relative } from "node:path";

/**
 * SCOPE, and it is deliberately narrow.
 *
 * Scanning all of `src/` produced 20+ hits and almost every one was legitimate:
 * `src/lib/tax/` describes real tax regimes where "Turnover Tax" is the literal
 * statutory name in Nigeria and South Africa and cannot be reworded, and
 * `sub_industries_seed.ts` uses "covers" as an ordinary verb ("covers both
 * ticket profiles"). Failing the build on those would teach everyone to ignore
 * this gate, which is the exact failure this project has already paid for once.
 *
 * So the gate covers the SPINE-2 PRODUCT SURFACE, where the founder's rules
 * apply and where the real escape happened. The legacy modules are a previous
 * generation with their own vocabulary and auditing them is separate work,
 * recorded rather than silently skipped.
 */
const SCOPE = [
  "src/components/spine2",
  "src/lib/cells",
];

const BANNED: Array<{ re: RegExp; word: string; say: string }> = [
  { re: /\bturnover\b/i, word: "turnover", say: 'say "revenue"' },
  { re: /\bcovers\b/i, word: "covers", say: 'say "orders"' },
  { re: /\bpercentage points\b/i, word: "percentage points", say: "state both figures instead" },
  { re: /\bpp\b/, word: "pp", say: "state both figures instead" },
  { re: /\bnet margin\b/i, word: "net margin", say: 'say "what the owner keeps"' },
];

/**
 * Allowlist. NOT a place to hide defects , each entry names what is wrong and
 * where it is tracked.
 *
 * `cell_view.ts` is the PREVIOUS generation's view model. It is not imported by
 * anything under `src/components/spine2`, but it shares this directory, and it
 * carries TWO REAL VIOLATIONS that are live on the site today:
 *   line ~148  returns the literal "covers" as a trade's daily unit
 *   line ~216  labels a statistic "Net margin"
 * Both are user-facing and both are banned. They are not fixed here because
 * changing live copy on the previous generation is a separate, larger job than
 * hardening this gate, and doing it silently inside a tooling change would be
 * the wrong way to touch 615 pages. Tracked in BACKLOG2 as L1.
 */
const ALLOWLIST = new Set<string>([
  "src/lib/cells/cell_view.ts",
]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

/**
 * Pull string literals out of a line: single, double and backtick quoted.
 * Deliberately crude and deliberately narrow , it is better to miss an exotic
 * template expression than to flag a comment and teach everyone to ignore this.
 */
function literals(line: string): string[] {
  const out: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) out.push(m[1] ?? m[2] ?? m[3] ?? "");
  return out;
}

const files: string[] = [];
for (const dir of SCOPE) {
  const abs = resolve(process.cwd(), dir);
  if (!existsSync(abs)) {
    console.error(`x verify_banned_vocabulary: scope dir missing: ${dir}. A gate with nothing to read has not passed.`);
    process.exit(1);
  }
  walk(abs, files);
}

const failures: string[] = [];
for (const file of files) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  if (ALLOWLIST.has(rel)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    // Skip whole-line comments outright; the ban is on copy, not on prose about copy.
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    for (const lit of literals(line)) {
      for (const b of BANNED) {
        if (b.re.test(lit)) {
          failures.push(
            `${rel}:${i + 1}  "${b.word}" in user-facing copy , ${b.say}\n      ${lit.slice(0, 90)}`,
          );
        }
      }
    }
  });
}

if (failures.length) {
  console.error(`x verify_banned_vocabulary: ${failures.length} banned word(s) in src/\n`);
  for (const f of failures) console.error("   " + f);
  console.error(
    "\n   These are the founder's bans. If a use is genuinely not user-facing,\n" +
      "   add the file to ALLOWLIST in this script with the reason.",
  );
  process.exit(1);
}
console.log(`verify_banned_vocabulary: PASS. ${files.length} files in the spine-2 surface, no banned vocabulary.`);
