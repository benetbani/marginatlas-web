/**
 * scripts/verify_table_semantics.ts , every table header a reader can reach
 * must say which cells it labels.
 *
 * WHY IT IS A HARD GATE AND NOT A RATCHET. It was measured at zero before it
 * was written. Eleven reader-facing files held a table with no `scope` at all
 * on 2026-08-21; all of them were fixed in the same session, so this starts
 * clean and there is no debt to count down. A ratchet on zero is just a hard
 * gate with extra machinery.
 *
 * WHAT IT IS FOR. `scope` is how a screen reader connects a figure to its
 * heading. Without it a two-dimensional table, metrics down and places across,
 * reads as a bare stream of numbers with no way to say which metric in which
 * place any of them belongs to. The neighbour comparison on every country page
 * is exactly that shape.
 *
 * THE CORNER-CELL EXCEPTION, and it is a real one rather than a loophole. The
 * top-left cell of a metrics-by-places grid labels nothing. It is written
 * `<th className="k" />`, self-closing and empty, and giving it a scope would
 * announce a heading that is not there. Self-closing headers are therefore
 * allowed, and only those: a header with content must declare what it labels.
 *
 * SCOPE OF THE SCAN. Reader-facing only. `/dev` and `_design` are the workshop:
 * `_design` is a Next private folder with no URL at all, and the readiness
 * ledger already records four gates whose counts are inflated by folding
 * workshop paths into the same verdict as reader paths. `src/components/ui` is
 * excluded too, because the shadcn primitive deliberately leaves `scope` to its
 * caller rather than hardcoding one.
 *
 * BLIND SPOT, stated because this gate's PASS will be quoted. It reads source,
 * not a rendered tree. It cannot tell whether a header actually labels the
 * column a reader sees, only that it claims a direction. A header marked
 * `scope="col"` that is really a row header will pass here and still be wrong
 * for a screen reader.
 *
 * Run: npx tsx scripts/verify_table_semantics.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const isWorkshop = (f: string) =>
  f.startsWith("src/app/dev/") ||
  f.includes("/_design/") ||
  f.startsWith("src/components/ui/") ||
  /* ADMIN IS INTERNAL TOOLING, and excluding it is a scope decision worth
     stating rather than hiding. Measured 2026-08-21: the three admin pages hold
     89 unscoped headers between them, 68 in one file, against 3 across every
     reader-facing surface on the site. Folding them in would make this gate
     report a number dominated by a screen no reader ever opens, and the
     readiness ledger already records four gates whose counts are inflated
     exactly that way. If admin ever becomes a product surface, delete this
     line and pay the debt then. */
  f.includes("/admin/");

interface Finding {
  file: string;
  line: number;
  text: string;
}

const findings: Finding[] = [];
let headersChecked = 0;
let filesWithTables = 0;

function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (extname(p) !== ".tsx") continue;

    const rel = relative(process.cwd(), p).split(sep).join("/");
    if (isWorkshop(rel)) continue;

    const raw = readFileSync(p, "utf8");
    if (!raw.includes("<th")) continue;

    /* Comments stripped, or a `<th` written in prose counts as markup. Two
       gates in this chain carry headers about exactly that mistake. */
    const lines = stripCommentLines(raw.split("\n"));
    let sawTable = false;

    lines.forEach((line, i) => {
      if (line.includes("<table") || line.includes("<Table")) sawTable = true;

      /* Every `<th` opening on this line, with what follows it up to the
         closing bracket, so an attribute list spanning one line is seen whole. */
      for (const m of line.matchAll(/<th(\s[^>]*|)>/g)) {
        const attrs = m[1] ?? "";
        /* SELF-CLOSING DETECTION IS A TRAILING SLASH IN THE ATTRIBUTES, not a
           separate capture group. `[^>]*` is greedy and swallows the slash of
           `<th className="k" />`, so the first version of this gate reported the
           empty corner cell it was written to exempt. Caught by auditing the
           gate's own output against a hand count. */
        const selfClosing = /\/\s*$/.test(attrs);
        headersChecked++;

        /* The empty corner cell of a grid. It labels nothing. */
        if (selfClosing) continue;
        if (/\bscope\s*=/.test(attrs)) continue;

        findings.push({
          file: rel,
          line: i + 1,
          text: line.trim().slice(0, 100),
        });
      }
    });

    if (sawTable) filesWithTables++;
  }
}

walk("src");

console.log(
  `\n  ${headersChecked} header(s) across ${filesWithTables} reader-facing file(s) with a table\n`,
);

if (findings.length === 0) {
  console.log("  PASS: every reader-facing table header declares what it labels.\n");
  process.exit(0);
}

console.log(`  FAIL: ${findings.length} header(s) do not say which cells they label:\n`);
for (const f of findings.slice(0, 25)) {
  console.log(`    ${f.file}:${f.line}`);
  console.log(`      ${f.text}`);
}
if (findings.length > 25) console.log(`    ... and ${findings.length - 25} more`);
console.log(
  "\n  Add scope=\"col\" to a column header and scope=\"row\" to a row header.\n" +
    "  A self-closing <th /> is the empty corner cell of a grid and needs neither.\n",
);
process.exit(1);
