/**
 * THE BUY-OR-START PRICE IS HELD, NEVER TYPED (QUEUE open:buy-or-start-typed-multiples, 2026-10-15; the investigation is
 * .superpowers/sdd/integration/typed-multiples-investigation.md). The rule, the site's own: never print a figure nobody can trace; every
 * figure comes from held data through a builder and carries its source stamp (src/lib/spine/provenance.ts: data-src, data-kind).
 *
 * THE DEFECT THIS KEEPS OUT. src/lib/open/buy_vs_start.ts priced a purchase from 153 valuation multiples typed by slug with no source, a
 * blanket default of 2.4, a band, a floor and a ceiling on the price, and an asset floor of 0.4 times the start cost that set the printed
 * price on half the pages the note "about 2x owner earnings" stood beside. None of it was gated: no_typed_figures reads bare numbers
 * between tags and says of a number from a builder that is itself a typed constant that it "passes"; the provenance ratchet reads the
 * harness pages and the home, not this route. The price now is the trade's own sale range in currency (worthPrice, the function the
 * trade page's "What one sells for" card calls), stamped, withheld on an EBITDA basis; the lines below hold it there.
 *
 * WHAT IT READS, AND WHAT EACH REED CAN SEE:
 *  1. SOURCE of src/lib/open/buy_vs_start.ts and src/lib/open/buy_side.ts, comments stripped through scripts/lib/strip_comments and string
 *     text blanked: no number but 0 and 1, no table of numbers by slug (a Record<string,
 *     number>, an index signature, three or more numeric properties), none of the old constants by name, the price built only through
 *     buySideFor and worthPrice. A typed price constant, a floor, a fraction or a multiple is a number in that file, so it reds.
 *  2. SOURCE of every file of the route that can print the buy figure (both named components, any other component under src/components/buy,
 *     and the route page.tsx), parsed with the TypeScript compiler: any element that prints a buy figure (the range, or a value
 *     read off page.buy) carries data-src through provAttrs or a prov prop; Compare's Row spreads provAttrs on the value it prints; no
 *     component reads a multiple or says "owner earnings".
 *  3. THE BUILDER, on every one of the 243 trade shards at one take-home: the buy range equals the trade card's two marks to the dollar
 *     (the same function, so the two pages cannot disagree), its src names the shard file and both keys and its kind is estimate; every
 *     trade whose shard rests on EBITDA prints the card's stated line and no figure; a trade with no take-home prints the other stated line.
 *  4. THE VERDICT (since 2026-10-15, release 2 job A: no start cost is held, so it never leans): on ranges above, below, across and without
 *     a start cash it leans nowhere, says estimate when a range stands, and is one sentence of twelve words or fewer with none of the words
 *     the copy laws refuse.
 *  5. THE META DESCRIPTION (Open Graph and Twitter reuse it), built by buyMetaDescription on a priced and an unpriced trade: the buy range in it
 *     is the range text as an estimate and nothing typed, no digit outside the range, no start cash, no multiple; page.tsx builds it through
 *     that function and reads no buy figure itself.
 *  6. THE RENDER of the two components on a priced trade and on an EBITDA trade: the buy figure carries data-src and data-kind and reads as a
 *     range in the trade page's own grammar; the EBITDA trade prints the stated line, no buy figure and no buy stamp; the START side prints its
 *     stated line and no cash, and its two figures (the longest licence wait, the years to pay back) carry the shard's stamps; no multiple.
 *
 * EACH READER PROVES ITSELF FIRST on a planted copy of the old defect (a reader that sees nothing would pass everything), and the walk
 * must read something: 243 shards, both source files, both components. To watch it red on the real old code, run it against the old text:
 *   git show <old>:src/lib/open/buy_vs_start.ts > a.ts  (and the two components)  then
 *   npx tsx tests/open/buy_price_held.test.ts --static-only --buy=a.ts --hero=h.tsx --compare=c.tsx
 *
 * ITS BLIND SPOTS, said once. It cannot distinguish a price taken from a shard figure that is itself wrong from one that is right: the
 * shard's held tag is a tag and not a verification (R12), which is why the printed word stays estimate. Whether a typed start figure is
 * read anywhere is tests/open/start_side_held.test.ts's business (release 2 job A). It
 * reads source and a render of two components on two fixtures, never a built page, so what a built page draws is for the built page. A
 * typed constant hidden in a module these two files import is not seen by the source read (the price must come through worthPrice, which
 * check 3 holds to the shard).
 *
 * Run: npx tsx tests/open/buy_price_held.test.ts [--static-only] [--buy=<path>] [--hero=<path>] [--compare=<path>]
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { JSDOM } from "jsdom";
import ts from "typescript";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
import { buySideFor, buyVerdict, buyRangeText, buyMetaDescription, type BuySide } from "../../src/lib/open/buy_side";
import { buildWorth, countWorthBases } from "../../src/lib/spine/worth_rows";
import { COPY } from "../../src/lib/spine/copy";
import { BuyVsStartHero } from "../../src/components/buy/BuyVsStartHero";
import { BuyVsStartCompare } from "../../src/components/buy/BuyVsStartCompare";
import type { BuyVsStart, StartSide } from "../../src/lib/open/buy_vs_start";
import { buildPermits, isConditionalLicence } from "../../src/lib/spine/permits_rows";
import { buildOpenFoot } from "../../src/lib/spine/open_rows";

const RULE = "buy-price-held";
const REMEDY = "price the purchase only through worthPrice (src/lib/spine/worth_rows.ts) in currency with its data-src and data-kind, withhold it with the trade card's stated line on an operating-earnings basis, and type no multiple, floor, fraction or table by slug into the buy-or-start builder";
const arg = (name: string): string | undefined => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const STATIC_ONLY = process.argv.includes("--static-only");
const BUY_DIR = "src/components/buy";
const PATHS = {
  buy: arg("buy") ?? "src/lib/open/buy_vs_start.ts",
  buySide: "src/lib/open/buy_side.ts",
  hero: arg("hero") ?? `${BUY_DIR}/BuyVsStartHero.tsx`,
  compare: arg("compare") ?? `${BUY_DIR}/BuyVsStartCompare.tsx`,
  page: arg("page") ?? "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx",
};
let failed = 0;
const fail = (file: string, detail: string, line?: number) => {
  failed++;
  red({ rule: RULE, file, line, detail, remedy: REMEDY });
};

/* ------------------------------------------------------------------------------------------------------------------------------------
 * 1. THE SOURCE OF THE TWO BUILDER FILES
 * ---------------------------------------------------------------------------------------------------------------------------------- */

/** The code of a file, one entry per line: comments gone (scripts/lib/strip_comments) and the text of every string and template blanked, the `${ }` expressions of a template kept as code. */
function codeLines(text: string): string[] {
  const stripped = stripCommentLines(text.split("\n")).join("\n");
  let out = "";
  let mode: "code" | "dq" | "sq" | "tpl" = "code";
  const braces: number[] = [];
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === "\n") {
      if (mode === "dq" || mode === "sq") mode = "code";
      out += ch;
      continue;
    }
    if (mode === "code") {
      if (ch === '"') mode = "dq";
      else if (ch === "'") mode = "sq";
      else if (ch === "`") mode = "tpl";
      else if (ch === "{" && braces.length) braces[braces.length - 1]++;
      else if (ch === "}" && braces.length) {
        if (braces[braces.length - 1] === 0) { braces.pop(); mode = "tpl"; out += " "; continue; }
        braces[braces.length - 1]--;
      }
      out += ch;
    } else if (ch === "\\") {
      out += "  ";
      i++;
    } else if ((mode === "dq" && ch === '"') || (mode === "sq" && ch === "'")) {
      mode = "code";
      out += ch;
    } else if (mode === "tpl" && ch === "`") {
      mode = "code";
      out += ch;
    } else if (mode === "tpl" && ch === "$" && stripped[i + 1] === "{") {
      braces.push(0);
      mode = "code";
      out += "  ";
      i++;
    } else out += " ";
  }
  return out.split("\n");
}

/** The numbers a builder file may hold: zero and one. Nothing else is a number of this page's price (the verdict's dead-band left on 2026-10-15 with its lean). */
const ALLOWED = (tok: string, _line: string) => tok === "0" || tok === "1";
const OLD_NAMES = /\b(SDE_MULTIPLE\w*|sdeMultiple\w*|ASSET_FLOOR\w*|SALE_PRICE_(?:FLOOR|CEILING)\w*|MULTIPLE_(?:MIN|MAX)\b)/;

type Finding = { line: number; detail: string };

/** Every way one builder file can hold a typed price. `role` is which of the two files it is, for the wiring checks. */
function scanBuilder(text: string, role: "vs" | "side"): Finding[] {
  const out: Finding[] = [];
  const code = codeLines(text);
  const numeric: number[] = [];
  code.forEach((ln, k) => {
    for (const m of ln.matchAll(/(?<![\w$])\d[\w.]*/g)) {
      if (!ALLOWED(m[0], ln)) out.push({ line: k + 1, detail: `the number ${m[0]} is typed in the buy-or-start builder: a price, floor, fraction or multiple here has no source` });
    }
    if (/Record<\s*string\s*,\s*number\s*>|\[\s*\w+\s*:\s*string\s*\]\s*:\s*number/.test(ln)) out.push({ line: k + 1, detail: "a numeric record keyed by slug (Record<string, number>): the old multiples table" });
    if (/^\s*(?:"[^"]*"|'[^']*'|[A-Za-z_$][\w$-]*)\s*:\s*-?[\d._]+\s*,?\s*$/.test(ln)) numeric.push(k + 1);
    const old = OLD_NAMES.exec(ln);
    if (old) out.push({ line: k + 1, detail: `${old[1]} is one of the typed price constants this page used to hold` });
    if (/\.multiple\b/.test(ln)) out.push({ line: k + 1, detail: "the builder reads a multiple off the buy side, which prints a price and never a multiple" });
  });
  if (numeric.length >= 3) out.push({ line: numeric[0], detail: `${numeric.length} numeric property lines in the file: a table of numbers by key` });
  const joined = code.join("\n");
  if (role === "vs" && !/\bbuySideFor\(/.test(joined)) out.push({ line: 1, detail: "buildBuyVsStart does not price the buy side through buySideFor" });
  if (role === "side") {
    if (!/\bimport\s*\{[^}]*\bworthPrice\b[^}]*\}\s*from\s*"@\/lib\/spine\/worth_rows"/.test(text)) out.push({ line: 1, detail: "buy_side does not import worthPrice from src/lib/spine/worth_rows, the trade page's own sale-range function" });
    if (!/\bworthPrice\(/.test(joined)) out.push({ line: 1, detail: "buy_side does not call worthPrice: the price is not the trade page's own" });
  }
  return out;
}

/* THE READER PROVES ITSELF on a planted copy of the old defect. */
const control = (label: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) fail("tests/open/buy_price_held.test.ts", `the reader failed its own control: ${label}`);
};
const OLD_TABLE = [
  "/** the comment says 2.4 and is not code */",
  "export const SDE_MULTIPLE_DEFAULT = 2.4;",
  "const SDE_MULTIPLE_BY_SLUG: Record<string, number> = {",
  '  restaurants: 2,',
  '  "plumbers": 2.2,',
  "  'dental-practices': 3,",
  "};",
  "const ASSET_FLOOR_FRACTION = 0.4;",
  "const SALE_PRICE_FLOOR_USD = 10_000;",
  "const price = Math.max(takeHome * multiple, 0.4 * start);",
  "const note = `about ${multiple}x owner earnings 2.4`;",
].join("\n");
{
  const f = scanBuilder(OLD_TABLE, "vs");
  const has = (re: RegExp) => f.some((x) => re.test(x.detail));
  control("source reader: sees the typed multiple 2.4, the 0.4 floor and the 10_000 floor as typed numbers", has(/number 2\.4\b/) && has(/number 0\.4\b/) && has(/number 10_000\b/));
  control("source reader: sees the numeric record and the table of numbers by key", has(/Record<string, number>/) && has(/numeric property lines/));
  control("source reader: sees the old constants by name and a builder that does not price through buySideFor", has(/SDE_MULTIPLE_BY_SLUG|SDE_MULTIPLE_DEFAULT/) && has(/ASSET_FLOOR_FRACTION/) && has(/buySideFor/));
  control("source reader: a number inside a comment or a string is not read (the comment's 2.4, the template's 2.4)", !f.some((x) => (x.line === 1 && !/buySideFor/.test(x.detail)) || x.line === 11));
  const clean = ["function f(n: number) { return n > 0 && n + 1 > startCash * (1 + band); }", 'const s = "twelve 12 words";', "const t = `${a * (1 - band)} costs 99`;"].join("\n");
  control("source reader: leaves zero, one, a string's digits and a template's text alone", scanBuilder(clean, "vs").filter((x) => !/buySideFor/.test(x.detail)).length === 0);
  control("source reader: reads a number inside a template's ${ } expression", scanBuilder("const t = `${price * 0.4}`;", "vs").some((x) => /number 0\.4\b/.test(x.detail)));
}

/** The real files, or the paths a proof run passed. */
const buyText = readFileSync(PATHS.buy, "utf8");
const sideText = readFileSync(PATHS.buySide, "utf8");
const sourceRead = { lines: 0, files: 0 };
for (const [file, text, role] of [[PATHS.buy, buyText, "vs"], [PATHS.buySide, sideText, "side"]] as const) {
  sourceRead.files++;
  sourceRead.lines += codeLines(text).filter((l) => l.trim()).length;
  for (const f of scanBuilder(text, role)) fail(file, f.detail, f.line);
}

/* ------------------------------------------------------------------------------------------------------------------------------------
 * 2. THE SOURCE OF THE TWO COMPONENTS
 * ---------------------------------------------------------------------------------------------------------------------------------- */

const STAMPED = (el: ts.JsxOpeningLikeElement): boolean =>
  el.attributes.properties.some((p) =>
    (ts.isJsxAttribute(p) && (p.name.getText() === "data-src" || p.name.getText() === "prov")) ||
    (ts.isJsxSpreadAttribute(p) && /\bprovAttrs\(/.test(p.expression.getText())));

/** Does this expression print a buy figure: the range text, or a value read off page.buy (the old cash, sale price, take-home or multiple)? A conditional is the elements' own business. */
function printsBuyFigure(e: ts.Node): boolean {
  if (ts.isConditionalExpression(e)) return false;
  let hit = false;
  const visit = (n: ts.Node): void => {
    if (ts.isIdentifier(n) && n.text === "buyRange") hit = true;
    else if (ts.isCallExpression(n) && /^buyRangeText$/.test(n.expression.getText())) hit = true;
    else if (ts.isPropertyAccessExpression(n) && /\bbuy\.(lowUsd|highUsd|cashNeededUsd|salePriceUsd|ownerTakeHomeUsd|multiple)$/.test(n.getText())) hit = true;
    if (!hit) ts.forEachChild(n, visit);
  };
  visit(e);
  return hit;
}

/** The buy figures a component source prints without a stamp, and the Row value that is not stamped: (line, detail) in order. */
function scanComponent(file: string, text: string): Finding[] {
  const out: Finding[] = [];
  const src = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const at = (n: ts.Node) => src.getLineAndCharacterOfPosition(n.getStart(src)).line + 1;
  const visit = (n: ts.Node): void => {
    const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : null;
    if (opening) {
      const children = ts.isJsxElement(n) ? n.children : [];
      const printsFigure =
        children.some((c) => ts.isJsxExpression(c) && c.expression && printsBuyFigure(c.expression)) ||
        opening.attributes.properties.some((p) => ts.isJsxAttribute(p) && !/^(className|key|prov|data-.*)$/.test(p.name.getText()) && p.initializer && printsBuyFigure(p.initializer));
      if (printsFigure && !STAMPED(opening)) out.push({ line: at(n), detail: "an element prints the buy figure with no data-src: spread provAttrs(page.buy.prov) on it, or pass prov to the Row that prints it" });
      /* The Row that prints a value it is handed: the element whose child is the bare `value` must spread provAttrs. */
      const printsValue = children.some((c) => ts.isJsxExpression(c) && c.expression && ts.isIdentifier(c.expression) && c.expression.text === "value");
      if (printsValue && !STAMPED(opening)) out.push({ line: at(n), detail: "the Row's value element is not stamped: spread provAttrs(prov) on the element that prints value" });
    }
    ts.forEachChild(n, visit);
  };
  visit(src);
  const code = codeLines(text);
  code.forEach((ln, k) => {
    if (/\bmultiple\b/.test(ln)) out.push({ line: k + 1, detail: "a component reads or names a multiple: the page prints a range in currency, never a multiple (clause 15)" });
    if (/fmtUSD\(\s*page\.buy\b/.test(ln)) out.push({ line: k + 1, detail: "a component prints page.buy through fmtUSD, the old single figure" });
  });
  /* "owner earnings" lives in a string, which codeLines blanks: read the comment-stripped text itself. */
  stripCommentLines(text.split("\n")).forEach((ln, k) => {
    if (/owner earnings/i.test(ln)) out.push({ line: k + 1, detail: 'a component says "owner earnings": the old note that sat beside a price the floor had set' });
  });
  return out;
}

const OLD_COMPONENT = [
  'import { fmtUSD } from "@/components/board/format";',
  "function Row({ label, value, note }: { label: string; value: string; note?: string }) {",
  "  return <div><div>{label}</div><div className=\"v\">{value}</div></div>;",
  "}",
  "export function X({ page }: { page: any }) {",
  "  return (<section>",
  "    <div className=\"big\">{fmtUSD(page.buy.cashNeededUsd)}</div>",
  "    <Row label=\"Cash needed\" value={fmtUSD(page.buy.cashNeededUsd)} note={`about ${page.buy.multiple}x owner earnings, an estimate`} />",
  "  </section>);",
  "}",
].join("\n");
{
  const f = scanComponent("fixture.tsx", OLD_COMPONENT);
  control("component reader: sees a buy figure printed with no stamp, in an element and in a Row's value prop", f.filter((x) => /no data-src/.test(x.detail)).length === 2);
  control("component reader: sees a Row whose value element is not stamped", f.some((x) => /Row's value element/.test(x.detail)));
  control("component reader: sees a multiple, \"owner earnings\" and the old fmtUSD(page.buy)", f.some((x) => /names a multiple/.test(x.detail)) && f.some((x) => /owner earnings/.test(x.detail)) && f.some((x) => /fmtUSD/.test(x.detail)));
  const good = [
    'import { provAttrs } from "@/lib/spine/provenance";',
    "function Row({ value, prov }: { value: string; prov?: any }) { return <div {...provAttrs(prov)}>{value}</div>; }",
    "export function X({ page }: { page: any }) {",
    "  const buyRange = buyRangeText(page.buy);",
    "  return (<section>{buyRange ? (<div {...provAttrs(page.buy.prov)}>{buyRange}</div>) : (<p>{page.buy.line}</p>)}",
    "    <Row value={buyRange ?? \"\"} prov={page.buy.prov} /></section>);",
    "}",
  ].join("\n");
  control("component reader: passes a stamped figure, a stamped Row and a stated line", scanComponent("good.tsx", good).length === 0);
}
/* EVERY FILE OF THE ROUTE THAT CAN PRINT THE BUY FIGURE: the two named components, any other component under src/components/buy (a new one is read
   the day it is added), and the route's page.tsx, which prints the range in its description. */
const ROUTE_FILES: string[] = [
  PATHS.hero,
  PATHS.compare,
  ...readdirSync(BUY_DIR).filter((n) => n.endsWith(".tsx") && n !== "BuyVsStartHero.tsx" && n !== "BuyVsStartCompare.tsx").map((n) => `${BUY_DIR}/${n}`),
  PATHS.page,
];
for (const file of ROUTE_FILES) {
  for (const f of scanComponent(file, readFileSync(file, "utf8"))) fail(file, f.detail, f.line);
}
/* page.tsx builds its description through buyMetaDescription and never reads or formats a buy figure itself. */
{
  const pageCode = stripCommentLines(readFileSync(PATHS.page, "utf8").split("\n")).join("\n");
  if (!/\bbuyMetaDescription\(/.test(pageCode)) fail(PATHS.page, "the page does not build its description through buyMetaDescription: the buy range in it is not the stamped range");
  if (/\bbuy(?:Range|Clause)\b|\bpage\.buy\.(?:lowUsd|highUsd)\b/.test(pageCode)) fail(PATHS.page, "the page reads the buy range itself: the description must come from buyMetaDescription");
}

/* ------------------------------------------------------------------------------------------------------------------------------------
 * 3 to 5. THE BUILDER, THE VERDICT AND THE RENDER (not in a static-only proof run)
 * ---------------------------------------------------------------------------------------------------------------------------------- */

const ids = readdirSync("data/facts/industry").filter((n) => n.endsWith(".json")).map((n) => n.slice(0, -5)).sort();
/** One take-home for every trade: a test value, never a measurement. */
const TAKE = 57000;
type Pricer = (industryId: string, takeHome: number | null | undefined) => BuySide;
const worthOf = (id: string, take: number | null) => buildWorth({ meta: { industry_id: id, money_shown: take != null }, owner: take != null ? { take_home_usd: take } : {} });

/** Every shard: the buy side against the trade card's own, to the dollar. Returns the findings and what it counted. */
function checkPricing(price: Pricer): { findings: string[]; sde: number; ebitda: number; none: number } {
  const findings: string[] = [];
  let sde = 0, ebitda = 0, none = 0;
  for (const id of ids) {
    const card = worthOf(id, TAKE);
    const b = price(id, TAKE);
    if (!card) {
      none++;
      if (b.state !== "stated" || b.line !== COPY.tradeWorth.otherBasis || b.lowUsd != null || b.prov) findings.push(`${id}: no pair on the shard, and the buy side prints something other than the card's stated line`);
      continue;
    }
    if (card.state === "otherBasis") {
      ebitda++;
      if (b.state !== "stated" || b.lowUsd != null || b.highUsd != null || b.prov) findings.push(`${id}: the shard rests on ${card.figures.basisWord}, and the buy side prints a price instead of the stated line`);
      else if (b.line !== COPY.tradeWorth.otherBasis) findings.push(`${id}: an operating-earnings trade prints "${b.line}" and not the card's own stated line`);
      continue;
    }
    sde++;
    const [lo, hi] = card.marks.map((m) => m.value);
    if (b.state !== "range" || b.lowUsd !== lo || b.highUsd !== hi) findings.push(`${id}: the buy range ${b.lowUsd} to ${b.highUsd} is not the trade card's ${lo} to ${hi}`);
    if (b.state === "range" && !(b.lowUsd! < b.highUsd!)) findings.push(`${id}: the low end is not under the high end`);
    if (b.line !== null) findings.push(`${id}: a range stands and a stated line stands with it`);
    if (!b.prov || b.prov.kind !== "estimate") findings.push(`${id}: the range carries no stamp, or a kind other than estimate`);
    else if (!b.prov.src.includes(`data/facts/industry/${id}.json`) || !b.prov.src.includes("sale_exit.multiple_low") || !b.prov.src.includes("sale_exit.multiple_high")) findings.push(`${id}: the stamp "${b.prov.src}" does not name the shard file and both keys`);
    const text = buyRangeText(b);
    if (!text || /multiple|\d\s?x\b/i.test(text)) findings.push(`${id}: the range prints as "${text}", which is not a plain range in currency`);
  }
  /* no take-home: the card's other stated line */
  const sdeId = ids.find((id) => worthOf(id, TAKE)?.state === "strip");
  if (sdeId) {
    const b = price(sdeId, null);
    if (b.state !== "stated" || b.lowUsd != null || b.line !== COPY.tradeWorth.withheld) findings.push(`${sdeId}: with no take-home the buy side prints something other than the card's stated line`);
  } else findings.push("no SDE-basis shard found to test the no-take-home line on");
  return { findings, sde, ebitda, none };
}

const SIDE = (lo: number | null, hi: number | null): BuySide => (lo == null || hi == null ? { state: "stated", lowUsd: null, highUsd: null, line: COPY.tradeWorth.otherBasis, prov: null } : { state: "range", lowUsd: lo, highUsd: hi, line: null, prov: { src: "x", kind: "estimate" } });
/** The verdict on ranges every side of a start cash it no longer holds, and its words: it leans nowhere (2026-10-15). */
function checkVerdict(verdict: (buy: BuySide) => string): string[] {
  const out: string[] = [];
  const cases: Array<[string, BuySide]> = [
    ["a high range", SIDE(400000, 900000)],
    ["a low range", SIDE(20000, 40000)],
    ["a middling range", SIDE(80000, 120000)],
    ["no range", SIDE(null, null)],
  ];
  for (const [label, buy] of cases) {
    const v = verdict(buy);
    if (/\b(more|less) cash\b|\bcheaper\b|\bdearer\b|\bcosts (more|less)\b/i.test(v)) out.push(`${label}: the verdict leans on the cash where no start cost is held: "${v}"`);
    if (buy.state === "range" && !/\bestimate\b/i.test(v)) out.push(`${label}: a range stands and the verdict does not say estimate: "${v}"`);
    const sentences = v.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length !== 1) out.push(`${label}: the verdict is ${sentences.length} sentences, not one line: "${v}"`);
    for (const sentence of sentences) {
      if (sentence.trim().split(/\s+/).length > 12) out.push(`${label}: a sentence over twelve words: "${sentence}"`);
    }
    if (/\d/.test(v)) out.push(`${label}: the verdict holds a figure: "${v}"`);
    if (/start cost|cost to open/i.test(v)) out.push(`${label}: the verdict says again that no start cost is held (the hero says it once): "${v}"`);
    if (/[;\u2014]|\b(we|our|modell?ed|withheld|on file|multiple)\b/i.test(v)) out.push(`${label}: the verdict holds a semicolon, an em-dash or a word the copy laws refuse: "${v}"`);
  }
  return out;
}

/** The meta description (Open Graph and Twitter reuse it) on a priced and an unpriced trade: the buy range in it is the range text and nothing typed, and no multiple. */
function checkDescription(describe: (noun: string, place: string, buy: BuySide) => string): string[] {
  const out: string[] = [];
  for (const [id, label] of [["restaurants", "priced"], ["dental_practices", "unpriced"]] as const) {
    const buy = buySideFor(id, TAKE);
    const d = describe("restaurant", "California", buy);
    const range = buyRangeText(buy);
    if (range && !d.includes(`Buying might cost ${range}, an estimate.`)) out.push(`${label}: the description does not carry the range as an estimate: "${d}"`);
    if (!range && (/Buying might cost/.test(d) || /\$[\d.,]+[KM]?\s+to\s+\$/.test(d))) out.push(`${label}: the description prints a buy figure where no price stands: "${d}"`);
    /* what is left once the range is taken out holds no digit: no start cash, nothing else in it is a figure */
    const rest = range ? d.split(range).join("") : d;
    if (/\d/.test(rest)) out.push(`${label}: a digit stands in the description outside the range: "${d}"`);
    if (/\brestaurants\b/.test(d)) out.push(`${label}: the description reads the trade by its plural name, not its count noun: "${d}"`);
    if (/multiple|owner earnings|\bx\b|[;\u2014]|\b(we|our|modell?ed|withheld|on file)\b/i.test(d)) out.push(`${label}: the description names a multiple or holds a word the copy laws refuse: "${d}"`);
  }
  return out;
}

/** The START side as buildBuyVsStart builds it (buy_vs_start.ts cannot load here: it imports the Supabase client), from the same two builders. */
function startFor(industryId: string): StartSide {
  const permits = buildPermits(industryId, "US");
  /* the longest REQUIRED wait, as opening_page.ts reads it: never a conditional licence (fix round 1, M-3) */
  const lead = permits?.longestRequired ? permits.cells.find((c) => c.key === permits.longestRequired!.key) : null;
  return {
    cashLine: COPY.buyOrStart.startCash,
    longestWait: lead && lead.prov && typeof lead.value === "string" ? { figure: lead.value, prov: lead.prov } : null,
    payback: buildOpenFoot(industryId).find((c) => c.prov?.src.endsWith(":first_year.payback_years")) ?? null,
  };
}

/** The START side in a render: the stated line, no cash figure, and its two figures stamped with the shard's keys. */
function checkStart(doc: Document, where: string, start: StartSide): string[] {
  const out: string[] = [];
  const text = doc.body.textContent ?? "";
  /* SAID ONCE (fix round 1, ruling 2): the absence of a start cost is stated once on the page: in the compare card's cash row where the hero leads
     with a held figure, in the hero where it holds none (release 3 job A). */
  const said = text.split(COPY.buyOrStart.startCash).length - 1;
  if (said !== 1) out.push(`${where}: the start side's stated line prints ${said} times, not once`);
  if (/no start cost|no cost to open/i.test(text.split(COPY.buyOrStart.startCash).join(""))) out.push(`${where}: the absence of a start cost is said again in other words`);
  const src = (re: RegExp) => [...doc.querySelectorAll("[data-src]")].filter((el) => re.test(el.getAttribute("data-src") ?? ""));
  /* EACH FIGURE ONCE (fix round 1, M-2): the wait and the payback each print exactly once, stamped, between the hero and the card. */
  const waits = src(/^data\/facts\/industry\/[a-z_]+\.json:licensing\.licences\.[^.]+\.typical_days$/);
  const paybacks = src(/^data\/facts\/industry\/[a-z_]+\.json:first_year\.payback_years$/);
  if (start.longestWait && waits.filter((el) => el.textContent?.trim() === start.longestWait!.figure).length !== 1) out.push(`${where}: the longest required licence wait "${start.longestWait.figure}" prints ${waits.filter((el) => el.textContent?.trim() === start.longestWait!.figure).length} times stamped, not once`);
  if (!start.longestWait && waits.length > 0) out.push(`${where}: a licence wait prints where the start side holds none`);
  if (start.payback && paybacks.filter((el) => el.textContent?.trim() === start.payback!.figure).length !== 1) out.push(`${where}: the years to pay back "${start.payback.figure}" print ${paybacks.filter((el) => el.textContent?.trim() === start.payback!.figure).length} times stamped, not once`);
  if (!start.payback && paybacks.length > 0) out.push(`${where}: a payback prints where the start side holds none`);
  return out;
}

/**
 * THE THREE BRANCHES OF THE START SIDE (fix round 1, M-2): the hero leads with the longest required wait where one is held, else with the
 * years to pay back, else it keeps the stated line; in each, every figure and the stated line print once. Rendered on the restaurants start
 * side with the wait, then the payback, taken out.
 */
function checkBranches(Hero: React.ComponentType<{ page: BuyVsStart }>, Compare: React.ComponentType<{ page: BuyVsStart }>): string[] {
  const out: string[] = [];
  const full = startFor("restaurants");
  if (!full.longestWait || !full.payback) return ["restaurants' start side holds no required wait or no payback to branch on"];
  const buy = buySideFor("restaurants", TAKE);
  const branches: Array<[string, StartSide, "wait" | "payback" | "stated"]> = [
    ["the required-wait branch", full, "wait"],
    ["the payback branch", { ...full, longestWait: null }, "payback"],
    ["the neither-held branch", { ...full, longestWait: null, payback: null }, "stated"],
  ];
  for (const [where, start, leads] of branches) {
    const p: BuyVsStart = { businessName: "Restaurants", industryId: "restaurants", placeName: "California", country: "us", cellHref: "/us/california/restaurants", pageHref: "/us/california/restaurants", openingHref: "/us/california/restaurants/opening", start, buy, catches: { startUpside: "a", startCatch: "b", buyUpside: "c", buyCatch: "d" }, verdict: buyVerdict(buy) };
    const doc = new JSDOM(`<body>${renderToStaticMarkup(React.createElement("div", null, React.createElement(Hero, { page: p }), React.createElement(Compare, { page: p })))}</body>`).window.document;
    const hero = new JSDOM(`<body>${renderToStaticMarkup(React.createElement(Hero, { page: p }))}</body>`).window.document;
    out.push(...checkStart(doc, where, start));
    const heroStamps = [...hero.querySelectorAll("[data-src]")].map((el) => [el.getAttribute("data-src") ?? "", el.textContent?.trim() ?? ""] as const).filter(([src]) => !/sale_exit/.test(src));
    const heroText = hero.body.textContent ?? "";
    if (leads === "wait" && !heroStamps.some(([src, t]) => /licensing\.licences\./.test(src) && t === start.longestWait!.figure)) out.push(`${where}: the hero does not lead with the required wait`);
    if (leads === "payback" && !heroStamps.some(([src, t]) => /first_year\.payback_years$/.test(src) && t === start.payback!.figure)) out.push(`${where}: the hero does not lead with the years to pay back`);
    if (leads === "stated" && (!heroText.includes(COPY.buyOrStart.startCash) || heroStamps.length > 0)) out.push(`${where}: the hero does not keep the stated line alone`);
    if (leads !== "stated" && heroText.includes(COPY.buyOrStart.startCash)) out.push(`${where}: the hero says the gap where it leads with a figure`);
  }
  return out;
}

/** The two components rendered on a fixture page; findings are what the render must not do. */
function checkRender(Hero: React.ComponentType<{ page: BuyVsStart }>, Compare: React.ComponentType<{ page: BuyVsStart }>): string[] {
  const out: string[] = [];
  const page = (industryId: string, buy: BuySide): BuyVsStart => ({
    businessName: "Restaurants", industryId, placeName: "California", country: "us",
    cellHref: "/us/california/restaurants", pageHref: "/us/california/restaurants", openingHref: "/us/california/restaurants/opening",
    start: startFor(industryId),
    buy, catches: { startUpside: "a", startCatch: "b", buyUpside: "c", buyCatch: "d" }, verdict: buyVerdict(buy),
  });
  const render = (p: BuyVsStart) => {
    const html = renderToStaticMarkup(React.createElement("div", null, React.createElement(Hero, { page: p }), React.createElement(Compare, { page: p })));
    return { doc: new JSDOM(`<body>${html}</body>`).window.document, html };
  };
  const priced = page("restaurants", buySideFor("restaurants", TAKE));
  const rangeText = buyRangeText(priced.buy);
  if (!rangeText) { out.push("restaurants at the test take-home builds no range to render"); return out; }
  const a = render(priced);
  /* THE HERO LEADS WITH A HELD FIGURE (release 3 job A, 2026-10-16): where the start side holds the longest licence wait or the years to pay back, the
     hero's start side prints that figure, stamped, and not the stated line; the gap is said once, lower down (startLead, src/lib/open/buy_side.ts). */
  const heroOnly = new JSDOM(`<body>${renderToStaticMarkup(React.createElement(Hero, { page: priced }))}</body>`).window.document;
  const leadFig = priced.start.longestWait?.figure ?? priced.start.payback?.figure ?? null;
  if (leadFig && (heroOnly.body.textContent ?? "").includes(COPY.buyOrStart.startCash)) out.push("the hero leads the start side with the stated line where a held figure stands (the longest licence wait or the years to pay back)");
  if (leadFig && ![...heroOnly.querySelectorAll("[data-src]")].some((el) => el.textContent?.trim() === leadFig && /licensing\.licences\.|first_year\.payback_years/.test(el.getAttribute("data-src") ?? ""))) out.push(`the hero's start side does not lead with the held figure "${leadFig}", stamped`);
  const all = [...a.doc.querySelectorAll("[data-src]")];
  const stamped = all.filter((el) => /sale_exit/.test(el.getAttribute("data-src") ?? ""));
  if (stamped.length !== 2) out.push(`the priced render holds ${stamped.length} stamped buy figures, expected 2 (the hero's and the compare card's)`);
  out.push(...checkStart(a.doc, "the priced render", priced.start));
  for (const el of all.filter((e) => !stamped.includes(e) && !/licensing\.licences\.|first_year\.payback_years/.test(e.getAttribute("data-src") ?? ""))) out.push(`the priced render stamps a figure that is neither the buy range nor the start side's two: "${el.getAttribute("data-src")}"`);
  for (const el of stamped) {
    if (el.textContent?.trim() !== rangeText) out.push(`a stamped element prints "${el.textContent?.trim()}", not the range "${rangeText}"`);
    if (el.getAttribute("data-kind") !== "estimate") out.push(`a stamped figure has data-kind "${el.getAttribute("data-kind")}", not estimate`);
    if (!/data\/facts\/industry\/restaurants\.json:sale_exit\.multiple_low/.test(el.getAttribute("data-src") ?? "")) out.push(`a stamped figure's data-src does not name the shard file and key: "${el.getAttribute("data-src")}"`);
  }
  const text = a.doc.body.textContent ?? "";
  if (!/\bestimate/i.test(text)) out.push("the priced render never says estimate");
  if (/multiple|owner earnings|\d\.?\d?x\b/i.test(text)) out.push("the priced render prints a multiple or \"owner earnings\"");
  const stated = page("dental_practices", buySideFor("dental_practices", TAKE));
  const b = render(stated);
  if (stated.buy.state !== "stated") out.push("an EBITDA trade (dental_practices) built a price");
  if ([...b.doc.querySelectorAll("[data-src]")].some((el) => /sale_exit/.test(el.getAttribute("data-src") ?? ""))) out.push("the stated render holds a stamped buy figure, where no figure stands");
  out.push(...checkStart(b.doc, "the stated render", stated.start));
  if (!(b.doc.body.textContent ?? "").includes(COPY.tradeWorth.otherBasis)) out.push("the stated render does not print the card's stated line");
  if (/\$[\d.,]+[KM]?\s+to\s+\$/.test(b.doc.body.textContent ?? "")) out.push("the stated render prints a range where no price stands");
  return out;
}

let counted = { sde: 0, ebitda: 0, none: 0 };
if (!STATIC_ONLY) {
  /* THE BUILDER'S CONTROL: the old defect as a pricer: a typed 2.4 multiple, a floor, a price on every trade, no stamp. */
  const planted: Pricer = (_id, th) => ({ state: "range", lowUsd: Math.round((th ?? 0) * 2.4 * 0.8), highUsd: Math.round((th ?? 0) * 2.4 * 1.2), line: null, prov: null });
  const bad = checkPricing(planted);
  control("builder reader: sees a typed-multiple price on every trade (EBITDA priced, marks missed, no stamp)", bad.findings.some((f) => /instead of the stated line/.test(f)) && bad.findings.some((f) => /not the trade card's/.test(f)) && bad.findings.some((f) => /no stamp|names the shard/.test(f)));
  /* The old verdict, leaning on a typed start cash of 328,451 (California restaurants), as it stood before 2026-10-15. */
  const twice = (b: BuySide) => (b.state === "range" ? "The buy price is an estimate, and no start cost is held." : "No sale price or start cost is held, so cash cannot decide.");
  control("verdict reader: sees the verdict say again that no start cost is held", checkVerdict(twice).some((f) => /again/.test(f)));
  const leaning = (b: BuySide) => (b.state === "range" && b.lowUsd! - 328451 > 328451 * 0.15 ? "On this estimate, buying costs more cash than starting fresh." : b.state === "range" && 328451 - b.highUsd! > 328451 * 0.15 ? "Estimate: buying costs less cash than starting, so check what you buy." : b.state === "range" ? "This estimate overlaps the cost to start, so cash does not decide." : "Cash does not decide this one without a sale price.");
  control("verdict reader: sees the old lean on a typed start cash", checkVerdict(leaning).some((f) => /leans on the cash/.test(f)));
  const longWinded = () => "On this estimate, buying costs more cash than starting fresh; we think so, and it can be worth it here because starting means a long ramp.";
  control("verdict reader: sees a semicolon, a \"we\" and a sentence over twelve words", checkVerdict(longWinded).some((f) => /semicolon/.test(f)) && checkVerdict(longWinded).some((f) => /twelve words/.test(f)));
  const typedDescription = (noun: string, place: string) => `Is it smarter to buy an existing ${noun}s in ${place} or start one fresh? About $328.5K to start, $131.4K to buy in at about 2x owner earnings.`;
  control("description reader: sees a typed buy figure, a multiple and a figure where no price stands", checkDescription(typedDescription).length >= 3);
  const OldHero = ({ page }: { page: BuyVsStart }) => React.createElement("div", { className: "fig" }, `$${(page.buy.lowUsd ?? 0) * 2} to start, ${page.start.cashLine.length} weeks`);
  const NoCompare = () => React.createElement("div", null, "about 2.4x owner earnings, an estimate");
  control("render reader: sees an unstamped figure, a multiple, a price on an EBITDA trade and a start side with no stated line and no stamped wait", checkRender(OldHero, NoCompare).length >= 3 && checkRender(OldHero, NoCompare).some((f) => /stated line/.test(f)) && checkRender(OldHero, NoCompare).some((f) => /longest required licence wait/.test(f)));

  /* The hero as it stood before 2026-10-16: the start side's stated line where the held wait could lead; the real card beside it. */
  const StatedHero = ({ page }: { page: BuyVsStart }) => React.createElement("header", null, React.createElement("p", null, page.start.cashLine), React.createElement("div", null, "To start fresh"));
  control("render reader: sees a hero that leads the start side with the stated line where the held wait stands", checkRender(StatedHero, BuyVsStartCompare).some((f) => /leads the start side with the stated line/.test(f)) && checkRender(StatedHero, BuyVsStartCompare).some((f) => /does not lead with the held figure/.test(f)));

  const real = checkPricing(buySideFor);
  counted = { sde: real.sde, ebitda: real.ebitda, none: real.none };
  for (const f of real.findings) fail("src/lib/open/buy_side.ts", f);
  const bases = countWorthBases(ids);
  if (bases.sde !== real.sde || bases.other !== real.ebitda) fail("src/lib/spine/worth_rows.ts", `the card's basis count (${bases.sde} SDE, ${bases.other} other) is not what the buy side read (${real.sde} SDE, ${real.ebitda} other)`);
  for (const f of checkVerdict(buyVerdict)) fail("src/lib/open/buy_side.ts", f);
  for (const f of checkDescription(buyMetaDescription)) fail("src/lib/open/buy_side.ts", f);
  for (const f of checkRender(BuyVsStartHero, BuyVsStartCompare)) fail("src/components/buy/BuyVsStartHero.tsx", f);
  for (const f of checkBranches(BuyVsStartHero, BuyVsStartCompare)) fail("src/components/buy/BuyVsStartCompare.tsx", f);
  /* THE HERO NEVER LEADS WITH A CONDITIONAL LICENCE (fix round 1, M-3; widened at release 3, the re-review's I-1): the reader of the
     condition on known names, the eight live trades' own names the re-review found leading, then every shard's lead read against
     NAMED_CONDITION, a word list kept here apart from isConditionalLicence, so a lead the function let through is seen by a reading that
     did not choose it. Each lead is printed, so a reviewer can read them. */
  control("conditional reader: a licence \"(if serving alcohol)\", \"(only if serving)\", \"(where required)\" and \"(armed guards only)\" are conditional; \"(federal)\", \"(malpractice) insurance\" and a plain name are not", ["Liquor licence (if serving alcohol)", "Liquor licence (only if serving)", "Sign permit (where required)", "Firearms permit (armed guards only)"].every(isConditionalLicence) && !["Firearms licence (federal)", "Professional liability (malpractice) insurance", "Food service permit"].some(isConditionalLicence));
  const EIGHT: Array<[string, string]> = [
    ["bookstores_indie", "Food and hygiene permit where a cafe is run"],
    ["carpenters_finish", "Trade or contractor licence where required"],
    ["event_production", "Temporary alcohol and food-service permits where served"],
    ["eyewear_optical", "Optician or optical-establishment licence where required"],
    ["landscaping_lawn", "Landscaping or contractor licence where required"],
    ["marketing_design", "General liability and employer cover where staffed"],
    ["pet_training", "Professional certification (voluntary)"],
    ["tutoring_centers", "Private-instruction or premises permit where required"],
  ];
  control("conditional reader: the eight live trades' optional or conditional names (pet training's \"(voluntary)\", \"where required\", \"where served\", \"where staffed\") are conditional, and \"Optional installer certification\" and \"a bonded facility, optional\" too", EIGHT.every(([, n]) => isConditionalLicence(n)) && isConditionalLicence("Optional installer certification / trade credential") && isConditionalLicence("Customs bond for a bonded facility, optional"));
  const NAMED_CONDITION = /\b(?:optional|voluntary|if|where|when|unless)\b|\bonly\)|\(only\b|-required\b|\bnot legally\b/i;
  control("the independent reading sees what the function must not let lead", EIGHT.every(([, n]) => NAMED_CONDITION.test(n)) && !NAMED_CONDITION.test("Food service permit"));
  let leadsChecked = 0;
  const leads: string[] = [];
  for (const id of ids) {
    const pm = buildPermits(id, "US");
    if (!pm?.longestRequired) continue;
    leadsChecked++;
    const cell = pm.cells.find((c) => c.key === pm.longestRequired!.key);
    const label = String(cell?.label ?? "");
    leads.push(`${id}: ${label} (${pm.longestRequired.days} days)`);
    if (!cell || NAMED_CONDITION.test(label)) fail("src/lib/spine/permits_rows.ts", `${id}: the start side's lead "${cell?.label}" names a condition (optional, voluntary, or needed only if, where or when)`);
  }
  for (const [id, n] of EIGHT) if (leads.some((l) => l.startsWith(`${id}: ${n} (`))) fail("src/lib/spine/permits_rows.ts", `${id} still leads with "${n}"`);
  if (process.argv.includes("--leads")) for (const l of leads) console.log(`lead ${l}`);
  if (startFor("restaurants").longestWait?.figure === "75 days") fail("src/lib/open/opening_page.ts", "restaurants leads with the 75 days of the liquor licence (if serving alcohol)");
  if (leadsChecked < 200) fail("data/facts/industry", `checked ${leadsChecked} shards' required lead, expected 200 or more`);
  /* A CARD THAT PRINTS THE WAIT AGAIN is seen (the regression the review named: the wait row back in the card beside the hero's lead). */
  const TwiceCompare = ({ page }: { page: BuyVsStart }) => React.createElement("div", null, React.createElement(BuyVsStartCompare, { page }), page.start.longestWait ? React.createElement("div", { "data-src": page.start.longestWait.prov.src, "data-kind": "estimate" }, page.start.longestWait.figure) : null);
  control("branch reader: sees the wait printed twice when the card prints it again beside the hero's lead", checkBranches(BuyVsStartHero, TwiceCompare).some((f) => /prints 2 times/.test(f)));
  /* THE WALK MUST REACH WHAT IT GUARDS: a gate that reads nothing passes everything. */
  if (ids.length < 240) fail("data/facts/industry", `read ${ids.length} trade shards, expected the 243`);
  if (real.sde < 150 || real.ebitda < 30) fail("data/facts/industry", `the buy side read ${real.sde} SDE and ${real.ebitda} operating-earnings shards, expected 150 or more and 30 or more`);
}
if (ROUTE_FILES.length < 4) fail(BUY_DIR, `read ${ROUTE_FILES.length} route files, expected the hero, the card, the catches and the page`);
if (sourceRead.files < 2 || sourceRead.lines < 100) fail("src/lib/open", `read ${sourceRead.files} builder files and ${sourceRead.lines} code lines, expected both files and 100 or more lines`);

if (failed > 0) {
  redSummary(RULE, failed, REMEDY, "typed prices, unstamped figures, priced EBITDA trades, failed controls or a walk that read too little");
  process.exit(1);
}
console.log(
  STATIC_ONLY
    ? `PASS  static-only: ${sourceRead.files} builder files (${sourceRead.lines} code lines) and ${ROUTE_FILES.length} route files read; no typed price, every buy figure stamped`
    : `PASS  ${ids.length} trade shards priced through worthPrice (${counted.sde} to the dollar as the trade card, ${counted.ebitda} operating-earnings trades on the stated line, ${counted.none} without a pair); the verdict leans nowhere; ${sourceRead.files} builder files (${sourceRead.lines} code lines) and ${ROUTE_FILES.length} route files read, the figure stamped on a priced render and absent on a stated one, the description built from the range`,
);
