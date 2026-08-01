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
  /* Added 2026-07-29 with the trust pages. They are pure user-facing copy on
     the routes a suspicious reader checks first, and the gate had no scope over
     them at all , the ban held for the data pages and not for the pages that
     defend them. */
  "src/app/(site)/privacy",
  "src/app/(site)/terms",
  "src/app/(site)/cookies",
  "src/components/LegalPage.tsx",
  /* Added 2026-08-01 with the questions page. Same argument as the three
     above, and one more: its prose is copied verbatim into FAQPage structured
     data, so a banned word here does not just reach a reader, it reaches an
     answer engine in a form built to be quoted. */
  "src/app/(site)/faq",
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
for (const entry of SCOPE) {
  const abs = resolve(process.cwd(), entry);
  if (!existsSync(abs)) {
    console.error(`x verify_banned_vocabulary: scope entry missing: ${entry}. A gate with nothing to read has not passed.`);
    process.exit(1);
  }
  // SCOPE holds directories and single files; LegalPage.tsx is one of the latter.
  if (statSync(abs).isDirectory()) walk(abs, files);
  else files.push(abs);
}

/**
 * JSX TEXT , the prose between tags.
 *
 * Added 2026-07-29 after a real miss. The trust pages carry every user-facing
 * sentence as bare JSX text (`<p>We do not sell data.</p>`), not as a string
 * literal. The literal-only scan read those files and reported PASS without
 * having examined one sentence of the copy it exists to police.
 *
 * A gate that gives false confidence is worse than one that is absent, because
 * nobody goes looking behind a green check.
 */
/**
 * MUST run over the WHOLE FILE, not line by line.
 *
 * The first version of this matched `>text<` within a single line and its
 * negative test passed while a banned phrase sat in the copy. Real JSX prose is
 * wrapped by the formatter:
 *
 *     <p>
 *       You can read every page on this site without an account.
 *     </p>
 *
 * Not one of those words sits between a `>` and a `<` on its own line, so a
 * line-scoped regex reads nothing and reports PASS. The gate was giving exactly
 * the false confidence its own comment warns about.
 */
function jsxProse(content: string): Array<{ text: string; offset: number }> {
  const out: Array<{ text: string; offset: number }> = [];
  const re = />([^<>{}]+)</g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const text = m[1].replace(/\s+/g, " ").trim();
    if (text) out.push({ text, offset: m.index });
  }
  return out;
}

/** Strip comments so prose ABOUT the ban is never mistaken for the ban. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
            .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));
}

const lineOf = (content: string, offset: number) =>
  content.slice(0, offset).split("\n").length;

const failures: string[] = [];
for (const file of files) {
  const rel = relative(process.cwd(), file).replace(/\\/g, "/");
  if (ALLOWLIST.has(rel)) continue;
  const raw = readFileSync(file, "utf8");
  const content = stripComments(raw);

  const candidates: Array<{ text: string; offset: number }> = [
    ...jsxProse(content),
  ];
  content.split("\n").forEach((line, i) => {
    const offset = content.split("\n").slice(0, i).join("\n").length + i;
    for (const lit of literals(line)) candidates.push({ text: lit, offset });
  });

  for (const c of candidates) {
    for (const b of BANNED) {
      if (b.re.test(c.text)) {
        failures.push(
          `${rel}:${lineOf(content, c.offset)}  "${b.word}" in user-facing copy , ${b.say}\n      ${c.text.slice(0, 90)}`,
        );
      }
    }
  }
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
console.log(`verify_banned_vocabulary: PASS. ${files.length} files scanned (string literals and JSX prose), no banned vocabulary.`);
