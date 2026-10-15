/**
 * NO PAGE OR BUILDER READS A TYPED START FIGURE (2026-10-15, release 2 job A; the controller's ruling on
 * /srv/atlas/reports/start-capitals-investigation.md, option (c)). The rule, the site's own: never print a figure nobody can trace;
 * every figure comes from held data through a builder and carries its source stamp (src/lib/spine/provenance.ts).
 *
 * THE DEFECT THIS KEEPS OUT. Two tables typed by hand with no source, src/lib/markets/startup_capital_archetypes.ts ("directional,
 * drawn from general industry knowledge", 153 capitals by slug and an 80,000 default) and src/lib/markets/opening_archetypes.ts
 * (weeks to open, permits in dollars, first hires and their role hints, each with a default), were read by twenty files and printed
 * on /opening, /buy-or-start, up to 94 London trade pages (the open card, the London hero, the other trades' card), 91 industry
 * pages and /extremes, some stamped with the table's own name as if it were a source. On 2026-10-15 every one of those printings
 * was replaced by a held figure through the trade page's own builder (the licences, the trade's months to break even and years to
 * pay back), and the two tables were deleted.
 *
 * WHAT IT READS. Every .ts, .tsx, .js, .mjs and .cjs file under src/ (the pages and every builder they reach), comments removed
 * through scripts/lib/strip_comments, so a comment that tells this history is not a reading. A line of code that names either table
 * by its module name is a red: an import (one line or the `from` line of a multi-line one), a re-export, a dynamic import or a
 * require, and also a string that stamps a figure with the table's name (`markets/startup_capital_archetypes:<slug>`), which is
 * the figure saying it came from there. The two tables themselves are reds too while they exist: the ruling deletes them once
 * nothing reads them, and a table nobody reads that comes back is the first step of its figures coming back.
 *
 * IT PROVES ITSELF FIRST on planted files (a reader that sees nothing would pass everything): a one-line import, the `from` line of
 * a multi-line import, a dynamic import, a require, a stamp string, each read as a red; the same names inside a line comment and a
 * block comment read as nothing. And the walk must read what it guards: at least 900 source files and at least 3,500 import lines (975 and 4,344 on main, 2026-10-15).
 * To watch it red on the code before this change, point it at that tree:
 *   git worktree add /tmp/before 19e4072a && npx tsx tests/open/start_side_held.test.ts --root=/tmp/before
 *
 * ITS BLIND SPOT, said once. It reads module names, not values: a typed capital copied by hand into another file under another
 * name is not seen here (the no-typed-figures and buy-price-held gates read numbers in their own files, and the provenance ratchet
 * counts unstamped figures on the rendered pages). A file that reaches the tables through a path alias other than their module name
 * would not be seen either; the repo has one alias (`@/`), and the match is on the name after it.
 *
 * Run: npx tsx tests/open/start_side_held.test.ts [--root=<a checkout to read instead of this one>]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "start-side-held";
const REMEDY = "print the held figure through the trade page's own builder instead (buildPermits for the licences and their waits, buildOpenFoot for the months to break even and the years to pay back, both stamped), or say in words that no figure is held; never read src/lib/markets/startup_capital_archetypes.ts or opening_archetypes.ts, and leave them deleted";
const arg = (name: string): string | undefined => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const ROOT = arg("root") ?? process.cwd();
const TABLES = ["src/lib/markets/startup_capital_archetypes.ts", "src/lib/markets/opening_archetypes.ts"];
/** Either table by its module name, wherever a path or a stamp spells it. */
const NAMES = /\b(?:startup_capital_archetypes|opening_archetypes)\b/;
/** A line of code that brings a module in: an import or re-export's `from`, a bare import, a dynamic import, a require. */
const IMPORT_LINE = /\bfrom\s+["'`]|^\s*import\s+["'`]|\bimport\(\s*["'`]|\brequire\(\s*["'`]/;

let failed = 0;
const fail = (file: string, detail: string, line?: number) => {
  failed++;
  red({ rule: RULE, file, line, detail, remedy: REMEDY });
};
const control = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: "tests/open/start_side_held.test.ts", detail: `control failed: ${label}`, remedy: "the reader cannot see the defect it guards: fix the reader before trusting its pass" });
};

type Finding = { line: number; text: string };

/** Every line of code in one file's text that names either table; and how many import lines it read. */
function scan(text: string): { findings: Finding[]; imports: number } {
  const code = stripCommentLines(text.split(/\r?\n/));
  const findings: Finding[] = [];
  let imports = 0;
  code.forEach((l, i) => {
    if (IMPORT_LINE.test(l)) imports++;
    if (NAMES.test(l)) findings.push({ line: i + 1, text: l.trim() });
  });
  return { findings, imports };
}

/* ------------------------------------------------------------------------------------------------------------------------------------
 * THE READER PROVES ITSELF on planted text.
 * ---------------------------------------------------------------------------------------------------------------------------------- */
{
  const planted = [
    'import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";',
    "import {",
    "  timeToOpenWeeks,",
    '} from "@/lib/markets/opening_archetypes";',
    'const m = await import("../../src/lib/markets/startup_capital_archetypes");',
    'const o = require("@/lib/markets/opening_archetypes");',
    "const prov = { src: `markets/startup_capital_archetypes:${slug}`, kind: \"estimate\" };",
    'export { firstHiresCount } from "./opening_archetypes";',
  ].join("\n");
  const f = scan(planted).findings.map((x) => x.line);
  control("reader: sees a one-line import, the `from` line of a multi-line import, a dynamic import, a require, a stamp string and a re-export", [1, 4, 5, 6, 7, 8].every((n) => f.includes(n)) && f.length === 6);
  const quiet = [
    "// the cost to open came from src/lib/markets/startup_capital_archetypes.ts until 2026-10-15",
    "/* opening_archetypes.ts held the weeks,",
    "   startup_capital_archetypes.ts the capital */",
    'const label = "What it takes to open";',
    "/** A JSDoc line naming opening_archetypes. */",
  ].join("\n");
  control("reader: a line comment, a block comment and a JSDoc that name the tables are not readings", scan(quiet).findings.length === 0);
  control("reader: counts import lines (the walk's own floor reads them)", scan(planted).imports >= 5);
}

/* ------------------------------------------------------------------------------------------------------------------------------------
 * THE WALK: every source file under src/.
 * ---------------------------------------------------------------------------------------------------------------------------------- */
const SRC = join(ROOT, "src");
const walk = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === "node_modules" ? [] : walk(join(d, e.name))) : /\.(tsx?|m?js|cjs)$/.test(e.name) ? [join(d, e.name)] : []));
const files = existsSync(SRC) ? walk(SRC) : [];
let importLines = 0;
let readers = 0;
for (const abs of files) {
  const rel = relative(ROOT, abs).split("\\").join("/");
  const { findings, imports } = scan(readFileSync(abs, "utf8"));
  importLines += imports;
  if (TABLES.includes(rel)) continue;
  if (findings.length > 0) readers++;
  for (const x of findings) fail(rel, `names a typed start table in code: ${x.text.slice(0, 160)}`, x.line);
}
for (const t of TABLES) if (existsSync(join(ROOT, t))) fail(t, "the typed table still exists: the ruling deletes it once nothing reads it");

/* THE WALK MUST REACH WHAT IT GUARDS: a gate that reads nothing passes everything. */
if (files.length < 900) fail("src", `read ${files.length} source files under ${SRC}, expected 900 or more (975 on 2026-10-15)`);
if (importLines < 3500) fail("src", `read ${importLines} import lines, expected 3,500 or more (4,344 on main, 2026-10-15)`);

if (failed > 0) {
  redSummary(RULE, failed, REMEDY, `${readers} file(s) read a typed start table, or a table still exists, or a control failed`);
  process.exit(1);
}
console.log(`PASS  ${files.length} source files under src/ read (${importLines} import lines, comments stripped): none names startup_capital_archetypes or opening_archetypes in code, and neither table exists`);
