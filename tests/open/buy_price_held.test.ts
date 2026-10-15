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
 *     text blanked: no number but 0 and 1 and the one dead-band (const DEAD_BAND = 0.15), no table of numbers by slug (a Record<string,
 *     number>, an index signature, three or more numeric properties), none of the old constants by name, the price built only through
 *     buySideFor and worthPrice. A typed price constant, a floor, a fraction or a multiple is a number in that file, so it reds.
 *  2. SOURCE of the two components, parsed with the TypeScript compiler: any element that prints a buy figure (the range, or a value
 *     read off page.buy) carries data-src through provAttrs or a prov prop; Compare's Row spreads provAttrs on the value it prints; no
 *     component reads a multiple or says "owner earnings".
 *  3. THE BUILDER, on every one of the 243 trade shards at one take-home: the buy range equals the trade card's two marks to the dollar
 *     (the same function, so the two pages cannot disagree), its src names the shard file and both keys and its kind is estimate; every
 *     trade whose shard rests on EBITDA prints the card's stated line and no figure; a trade with no take-home prints the other stated line.
 *  4. THE VERDICT, on the edges of the dead-band: it leans only when the whole range is outside it, says estimate when a range stands,
 *     and each line is one sentence of twelve words or fewer with none of the words the copy laws refuse.
 *  5. THE RENDER of the two components on a priced trade and on an EBITDA trade: the figure carries data-src and data-kind and reads as a
 *     range in the trade page's own grammar; the EBITDA trade prints the stated line, no figure and no stamp; no multiple anywhere.
 *
 * EACH READER PROVES ITSELF FIRST on a planted copy of the old defect (a reader that sees nothing would pass everything), and the walk
 * must read something: 243 shards, both source files, both components. To watch it red on the real old code, run it against the old text:
 *   git show <old>:src/lib/open/buy_vs_start.ts > a.ts  (and the two components)  then
 *   npx tsx tests/open/buy_price_held.test.ts --static-only --buy=a.ts --hero=h.tsx --compare=c.tsx
 *
 * ITS BLIND SPOTS, said once. It cannot distinguish a price taken from a shard figure that is itself wrong from one that is right: the
 * shard's held tag is a tag and not a verification (R12), which is why the printed word stays estimate. It does not read the START side
 * (src/lib/markets/startup_capital_archetypes.ts, opening_archetypes.ts), which is one typed capital per trade and its own ticket. It
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
import { buySideFor, buyVerdict, buyRangeText, type BuySide } from "../../src/lib/open/buy_side";
import { buildWorth, countWorthBases } from "../../src/lib/spine/worth_rows";
import { COPY } from "../../src/lib/spine/copy";
import { BuyVsStartHero } from "../../src/components/buy/BuyVsStartHero";
import { BuyVsStartCompare } from "../../src/components/buy/BuyVsStartCompare";
import type { BuyVsStart } from "../../src/lib/open/buy_vs_start";

const RULE = "buy-price-held";
const REMEDY = "price the purchase only through worthPrice (src/lib/spine/worth_rows.ts) in currency with its data-src and data-kind, withhold it with the trade card's stated line on an operating-earnings basis, and type no multiple, floor, fraction or table by slug into the buy-or-start builder";
const arg = (name: string): string | undefined => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const STATIC_ONLY = process.argv.includes("--static-only");
const PATHS = {
  buy: arg("buy") ?? "src/lib/open/buy_vs_start.ts",
  buySide: "src/lib/open/buy_side.ts",
  hero: arg("hero") ?? "src/components/buy/BuyVsStartHero.tsx",
  compare: arg("compare") ?? "src/components/buy/BuyVsStartCompare.tsx",
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

/** The numbers a builder file may hold: zero and one, and the one dead-band on its own declaration. Nothing else is a number of this page's price. */
const ALLOWED = (tok: string, line: string) => tok === "0" || tok === "1" || (tok === "0.15" && /^\s*const DEAD_BAND = 0\.15;\s*$/.test(line));
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
  if (numeric.length >= 3) out.push({ line: numeric[0], detail: `${numeric.length} numeric properties in a row of an object: a table of numbers by key` });
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
  control("source reader: sees the numeric record and the table of numbers by key", has(/Record<string, number>/) && has(/numeric properties in a row/));
  control("source reader: sees the old constants by name and a builder that does not price through buySideFor", has(/SDE_MULTIPLE_BY_SLUG|SDE_MULTIPLE_DEFAULT/) && has(/ASSET_FLOOR_FRACTION/) && has(/buySideFor/));
  control("source reader: a number inside a comment or a string is not read (the comment's 2.4, the template's 2.4)", !f.some((x) => (x.line === 1 && !/buySideFor/.test(x.detail)) || x.line === 11));
  const clean = ["const DEAD_BAND = 0.15;", "function f(n: number) { return n > 0 && n + 1 > startCash * (1 + DEAD_BAND); }", 'const s = "twelve 12 words";', "const t = `${a * (1 - DEAD_BAND)} costs 99`;"].join("\n");
  control("source reader: leaves zero, one, the dead-band, a string's digits and a template's text alone", scanBuilder(clean, "vs").filter((x) => !/buySideFor/.test(x.detail)).length === 0);
  control("source reader: reads a number inside a template's ${ } expression", scanBuilder("const t = `${price * 0.4}`;", "vs").some((x) => /number 0\.4\b/.test(x.detail)));
}

/** The real files, or the paths a proof run passed. */
const buyText = readFileSync(PATHS.buy, "utf8");
const sideText = readFileSync(PATHS.buySide, "utf8");
const heroText = readFileSync(PATHS.hero, "utf8");
const compareText = readFileSync(PATHS.compare, "utf8");
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
for (const [file, text] of [[PATHS.hero, heroText], [PATHS.compare, compareText]] as const) {
  for (const f of scanComponent(file, text)) fail(file, f.detail, f.line);
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
const START = 100000;
/** The verdict on the dead-band's edges, and its words. */
function checkVerdict(verdict: (startCash: number, buy: BuySide) => string): string[] {
  const out: string[] = [];
  const cases: Array<[string, BuySide, "more" | "less" | null]> = [
    ["low end 1 over the band", SIDE(115001, 200000), "more"],
    ["low end exactly on the band", SIDE(115000, 200000), null],
    ["high end 1 under the band", SIDE(50000, 84999), "less"],
    ["high end exactly on the band", SIDE(50000, 85000), null],
    ["a range straddling the start cash", SIDE(80000, 120000), null],
    ["a wide range that holds the start cash", SIDE(40000, 300000), null],
    ["no range", SIDE(null, null), null],
  ];
  for (const [label, buy, lean] of cases) {
    const v = verdict(START, buy);
    const says = /more cash/.test(v) ? "more" : /less cash/.test(v) ? "less" : null;
    if (says !== lean) out.push(`${label}: the verdict leans "${says}" where it must lean ${lean === null ? "nowhere" : `"${lean}"`}: "${v}"`);
    if (buy.state === "range" && !/\bestimate\b/i.test(v)) out.push(`${label}: a range stands and the verdict does not say estimate: "${v}"`);
    for (const sentence of v.split(/(?<=[.!?])\s+/).filter(Boolean)) {
      if (sentence.trim().split(/\s+/).length > 12) out.push(`${label}: a sentence over twelve words: "${sentence}"`);
    }
    if (/[;—]|\b(we|our|modell?ed|withheld|on file|multiple)\b/i.test(v)) out.push(`${label}: the verdict holds a semicolon, an em-dash or a word the copy laws refuse: "${v}"`);
  }
  return out;
}

/** The two components rendered on a fixture page; findings are what the render must not do. */
function checkRender(Hero: React.ComponentType<{ page: BuyVsStart }>, Compare: React.ComponentType<{ page: BuyVsStart }>): string[] {
  const out: string[] = [];
  const page = (industryId: string, buy: BuySide): BuyVsStart => ({
    businessName: "Restaurants", industryId, placeName: "California", country: "us",
    cellHref: "/us/california/restaurants", pageHref: "/us/california/restaurants", openingHref: "/us/california/restaurants/opening",
    start: { cashNeededUsd: 328500, timeToOpenWeeks: 20, paybackYears: 2, modeled: true },
    buy, catches: { startUpside: "a", startCatch: "b", buyUpside: "c", buyCatch: "d" }, verdict: buyVerdict(328500, buy),
  });
  const render = (p: BuyVsStart) => {
    const html = renderToStaticMarkup(React.createElement("div", null, React.createElement(Hero, { page: p }), React.createElement(Compare, { page: p })));
    return { doc: new JSDOM(`<body>${html}</body>`).window.document, html };
  };
  const priced = page("restaurants", buySideFor("restaurants", TAKE));
  const rangeText = buyRangeText(priced.buy);
  if (!rangeText) { out.push("restaurants at the test take-home builds no range to render"); return out; }
  const a = render(priced);
  const stamped = [...a.doc.querySelectorAll("[data-src]")];
  if (stamped.length !== 2) out.push(`the priced render holds ${stamped.length} stamped figures, expected 2 (the hero's and the compare card's)`);
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
  if (b.doc.querySelectorAll("[data-src]").length) out.push("the stated render holds a stamped figure, where no figure stands");
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
  const midBand = (s: number, b: BuySide) => (b.state === "range" && ((b.lowUsd! + b.highUsd!) / 2 > s * 1.15 ? "On this estimate, buying costs more cash than starting fresh." : (b.lowUsd! + b.highUsd!) / 2 < s * 0.85 ? "On this estimate, buying costs less cash than starting fresh." : "This estimate overlaps the cost to start, so cash does not decide.")) || "No sale price yet, so cash does not decide this one.";
  control("verdict reader: sees a lean taken from the range's midpoint, inside the band", checkVerdict(midBand).length > 0);
  const longWinded = () => "On this estimate, buying costs more cash than starting fresh; we think so, and it can be worth it here because starting means a long ramp.";
  control("verdict reader: sees a semicolon, a \"we\" and a sentence over twelve words", checkVerdict(longWinded).some((f) => /semicolon/.test(f)) && checkVerdict(longWinded).some((f) => /twelve words/.test(f)));
  const OldHero = ({ page }: { page: BuyVsStart }) => React.createElement("div", { className: "fig" }, `$${(page.buy.lowUsd ?? 0) * 2}`);
  const NoCompare = () => React.createElement("div", null, "about 2.4x owner earnings, an estimate");
  control("render reader: sees an unstamped figure, a multiple and a price on an EBITDA trade", checkRender(OldHero, NoCompare).length >= 3);

  const real = checkPricing(buySideFor);
  counted = { sde: real.sde, ebitda: real.ebitda, none: real.none };
  for (const f of real.findings) fail("src/lib/open/buy_side.ts", f);
  const bases = countWorthBases(ids);
  if (bases.sde !== real.sde || bases.other !== real.ebitda) fail("src/lib/spine/worth_rows.ts", `the card's basis count (${bases.sde} SDE, ${bases.other} other) is not what the buy side read (${real.sde} SDE, ${real.ebitda} other)`);
  for (const f of checkVerdict(buyVerdict)) fail("src/lib/open/buy_side.ts", f);
  for (const f of checkRender(BuyVsStartHero, BuyVsStartCompare)) fail("src/components/buy/BuyVsStartHero.tsx", f);
  /* THE WALK MUST REACH WHAT IT GUARDS: a gate that reads nothing passes everything. */
  if (ids.length < 240) fail("data/facts/industry", `read ${ids.length} trade shards, expected the 243`);
  if (real.sde < 150 || real.ebitda < 30) fail("data/facts/industry", `the buy side read ${real.sde} SDE and ${real.ebitda} operating-earnings shards, expected 150 or more and 30 or more`);
}
if (sourceRead.files < 2 || sourceRead.lines < 100) fail("src/lib/open", `read ${sourceRead.files} builder files and ${sourceRead.lines} code lines, expected both files and 100 or more lines`);

if (failed > 0) {
  redSummary(RULE, failed, REMEDY, "typed prices, unstamped figures, priced EBITDA trades, failed controls or a walk that read too little");
  process.exit(1);
}
console.log(
  STATIC_ONLY
    ? `PASS  static-only: ${sourceRead.files} builder files (${sourceRead.lines} code lines) and 2 components read; no typed price, every buy figure stamped`
    : `PASS  ${ids.length} trade shards priced through worthPrice (${counted.sde} to the dollar as the trade card, ${counted.ebitda} operating-earnings trades on the stated line, ${counted.none} without a pair); the verdict leans only outside the dead-band; ${sourceRead.files} builder files (${sourceRead.lines} code lines) and 2 components read, the figure stamped on a priced render and absent on a stated one`,
);
