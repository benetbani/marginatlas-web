/**
 * NO FIGURE IS TYPED INTO A PAGE'S MARKUP (truth-fixes round 3D, E3, 2026-10-12). The rule, the owner's and restated in every brief of the
 * pre-launch fixes: every figure comes from its builder with its provenance, never typed. Two figures broke it on /world for months and
 * nothing could see them: the exit row's "$618K" beside the one worked example (the takings of a modelled room in an old cell file, where
 * the trade page it opens prints $374K, the register's median, in its title, its description and its share card) and the statblock's
 * "1" (`reconciled: 1` in src/lib/home/front_page_figures.ts, a constant its own comment says is "maintained by hand", for a kind of page,
 * the reconciled cell file, that retired with the July page). Round 3C's string probe found them by eye. Of the chain's gates, `provenance`
 * counts the figures of the 11 harness pages and the home's, `site-counts` the home's band, `stated-totals` the data files, and
 * `no-hardcoded-place` exempts /world by name: none reads a number typed into a page's markup.
 *
 * WHAT IT READS: every .tsx under src/app and src/components (src/app/dev and src/app/_design skipped by path from the root, the workshop and
 * not the shop, as legacy-method-words skips them), parsed with the TypeScript compiler so a comment is never read. A FIGURE TYPED INTO
 * MARKUP is a JSX text node that is wholly a number-like token ("1", "94%", "$618K", "2.5x"), or a child expression that is nothing but one:
 * `{"94"}`, `{618}`. A built figure (`{count}`, `{usd(v)}`) is an expression and is never read.
 *
 * EXCEPTIONS, each named by file and text with its reason, and each must still match: a code, a scale's end or an axis's zero is not a
 * reading of the world. An exception that no longer matches a finding is red (the list must not rot, as route-chrome-contract's does not).
 *
 * ITS BLIND SPOTS, said once. It reads the shape the defect had, a bare figure between tags. A figure typed inside a sentence ("takes
 * $618K a year"), in a string passed as a prop or a value, in a constant a builder returns, in a template, or spelled in words is not
 * seen; and a number from a builder that is itself a typed constant (the "1" above came through one) passes the moment it is drawn
 * from an expression. Those are the builder's to hold, and the provenance gate's where a page is on the harness list.
 *
 * Run: npx tsx tests/copy/no_typed_figures.test.ts [--list]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "no-typed-figures";
const REMEDY = "draw the figure from its builder with its provenance (data-src and data-kind, src/lib/spine/provenance.ts), or leave it off and keep the label or the link; never type a figure into a page";
const ROOTS = ["src/app", "src/components"];
const SKIP = ["src/app/dev", "src/app/_design"];
let failed = 0;

/** A bare figure: digits with an optional currency sign in front and a unit behind ("1", "94%", "$618K", "2.5x", "1,200"). */
const WHOLE = /^[$£€]?\d[\d,.]*\s?(?:[KMBkmb]|%|x|×)?$/;

type Hit = { file: string; line: number; text: string; how: "JSX text" | "child expression" };

/** Every typed figure in one source text, in order. Exported to itself so the controls below run the same reader as the scan. */
function typedFigures(file: string, text: string): Hit[] {
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits: Hit[] = [];
  const at = (n: ts.Node) => src.getLineAndCharacterOfPosition(n.getStart(src)).line + 1;
  const visit = (n: ts.Node): void => {
    if (ts.isJsxText(n)) {
      const t = n.text.replace(/\s+/g, " ").trim();
      if (t && WHOLE.test(t)) hits.push({ file, line: at(n), text: t, how: "JSX text" });
    } else if (ts.isJsxExpression(n) && n.expression && (ts.isJsxElement(n.parent) || ts.isJsxFragment(n.parent))) {
      /* a CHILD expression only: an attribute's value is code */
      const e = n.expression;
      if (ts.isNumericLiteral(e)) hits.push({ file, line: at(n), text: e.text, how: "child expression" });
      else if ((ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) && WHOLE.test(e.text.trim())) hits.push({ file, line: at(n), text: e.text.trim(), how: "child expression" });
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
  return hits;
}

/* THE READER PROVES ITSELF FIRST, on fixtures of the defect and of what it must leave alone (a reader that sees nothing would pass everything). */
function control(label: string, ok: boolean) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) red({ rule: RULE, file: "tests/copy/no_typed_figures.test.ts", detail: `the reader failed its own control: ${label}`, remedy: "teach the reader the shape again before trusting a pass" });
}
const SPAN = (inner: string) => `export const X = () => (<div><span className="g">${inner}</span></div>);`;
control('the reader sees a typed money figure between tags: <span className="g">$618K</span>', typedFigures("f.tsx", SPAN("$618K")).map((h) => h.text).join() === "$618K");
control('the reader sees a typed count between tags: <span className="v">1</span>', typedFigures("f.tsx", SPAN("1")).map((h) => h.text).join() === "1");
control('the reader sees a typed child expression: {"94"}, {618} and {"12%"}', typedFigures("f.tsx", SPAN('{"94"}') + SPAN("{618}") + SPAN('{"12%"}')).map((h) => h.text).join() === "94,618,12%");
control("the reader leaves a built figure, a sentence with a number in it, a step label and an attribute's number alone", typedFigures("f.tsx", `export const X = (p: { n: number }) => (<div data-n="3" aria-label="2 of 5"><span className="v">{p.n}</span><span>{usd(p.n)}</span><p>Every country, and 94 of them</p><b>Step 2 of 4</b></div>);`).length === 0);
control("the reader leaves a comment alone: {/* $618K */} and // 1", typedFigures("f.tsx", `export const X = () => (<div>{/* $618K */}<span>words</span></div>); // 1`).length === 0);

/** Exceptions: a bare number that is not a reading of the world. Matched by file and text, never by line, so a line move never frees one. */
const EXEMPT: Array<{ file: string; text: string; why: string }> = [
  { file: "src/app/not-found.tsx", text: "404", why: "the error page names its own status code; a code is not a measurement" },
  { file: "src/components/spine2/page/Ch11FirstYear.tsx", text: "$0", why: "the cash chart's zero-line label; the chart's other axis labels are drawn from its figures" },
];

function files(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name).replace(/\\/g, "/");
    if (SKIP.some((s) => p === s || p.startsWith(`${s}/`))) continue;
    if (statSync(p).isDirectory()) files(p, acc);
    else if (/\.tsx$/.test(p)) acc.push(p);
  }
  return acc;
}

const scanned = ROOTS.flatMap((r) => files(r));
const hits: Hit[] = [];
for (const f of scanned) hits.push(...typedFigures(f, readFileSync(f, "utf8")));

/* THE WALK MUST REACH WHAT IT GUARDS: a gate that skips source reports clean about files it never opened (CLAUDE.md, the walk that skipped `coverage`). */
for (const must of ["src/app/world/page.tsx", "src/app/industries/page.tsx", "src/app/not-found.tsx"]) {
  if (scanned.includes(must)) continue;
  failed++;
  red({ rule: RULE, file: must, detail: "the walk did not reach this page", remedy: "check ROOTS and SKIP in tests/copy/no_typed_figures.test.ts: it reads src/app and src/components, skipping src/app/dev and src/app/_design by path from the root" });
}
if (scanned.length < 400) {
  failed++;
  red({ rule: RULE, file: "tests/copy/no_typed_figures.test.ts", detail: `read ${scanned.length} .tsx files, expected 400 or more`, remedy: "check the walk still reaches src/app and src/components" });
}

const used = new Set<number>();
const findings: Hit[] = [];
for (const h of hits) {
  const k = EXEMPT.findIndex((e) => e.file === h.file && e.text === h.text);
  if (k >= 0) used.add(k);
  else findings.push(h);
}
if (process.argv.includes("--list")) for (const h of hits) console.log(`${h.file}:${h.line}  ${JSON.stringify(h.text)}  (${h.how})${EXEMPT.some((e) => e.file === h.file && e.text === h.text) ? "  exempt" : ""}`);

for (const h of findings) {
  failed++;
  red({ rule: RULE, file: h.file, line: h.line, detail: `${JSON.stringify(h.text)} typed as ${h.how}, a figure with no builder and no provenance`, remedy: REMEDY });
}
EXEMPT.forEach((e, k) => {
  if (used.has(k)) return;
  failed++;
  red({ rule: RULE, file: e.file, detail: `the exception for ${JSON.stringify(e.text)} (${e.why}) matches nothing: the figure is gone or the file moved`, remedy: "delete the entry from EXEMPT in tests/copy/no_typed_figures.test.ts, the list must not rot" });
});

if (failed > 0) {
  redSummary(RULE, failed, REMEDY, "typed figures, failed controls or stale exceptions");
  process.exit(1);
}
console.log(`PASS  ${scanned.length} .tsx files read; ${hits.length} bare number(s) in markup, every one a named exception (${EXEMPT.map((e) => e.text).join(", ")}); no figure is typed into a page`);
