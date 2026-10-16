/**
 * NO TYPED MONEY FIGURE ON THE OPENING SURFACES (release 3 job A, 2026-10-16; QUEUE uk:held-bill-provenance, the start-side job's
 * leftovers). The rule, the site's own: never print a figure nobody can trace; every figure comes from held data through a builder and
 * carries its stamp (src/lib/spine/provenance.ts), the words saying estimate where it is one.
 *
 * THE DEFECTS THIS KEEPS OUT. (1) The bill to open (`cell.setup_costs`): three SQL files typed by hand on 2026-05-24
 * (scripts/import/deepening/gb/restaurants.sql, us/restaurants.sql, us/cafes_coffee.sql, grade B) and the bulk template's sixteen
 * (grade C, typed US baselines times a typed country factor). None names a measurement, and the UK's nine lines ($426K) printed on
 * 325 trade pages and on /calculator as "A UK-wide estimate". A bill now prints only where its block names the measurement its lines
 * were read from (`measured_src`, src/lib/spine/setup_items.ts). (2) /opening's dealbreaker "at rent under about 12% of sales", a
 * threshold typed into src/lib/open/dealbreakers.ts, and its "Directional" disclaimer; the held rent share now stands under it.
 *
 * WHAT IT READS, four ways:
 *  A. EVERY WRITER OF THE BILL: each `SET setup_costs = ...` in every .sql under scripts/import/deepening (a JSON literal is parsed;
 *     a jsonb_build_object is read key by key, a CASE total by its US branch), fed to setupItemsFromCell as a GB and a US row. A typed
 *     block that prints a line is a red. Floor: 19 files, 3 JSON blocks, 16 built blocks (the two US tables of each bulk file count once).
 *  B. THE SURFACES' SOURCE: the builders and components of the trade page's `04 open`, /calculator's money to open, /opening and
 *     /buy-or-start (FILES below), comments removed through scripts/lib/strip_comments; a string literal holding a money or percent
 *     figure ("$426K", "12% of sales", "£100") is a red, and so is the word "directional" in one. Floor: every file present, 300 string
 *     literals read.
 *  C. THE WORDS THE BUILDERS RETURN: COPY.tradeOpen, COPY.opening, COPY.buyOrStart and every trade's dealbreaker hold no figure; a
 *     dealbreaker's held figure carries a shard stamp, an estimate. Floor: 138 trades asked.
 *  D. THE RENDERS the chain draws first (pages-fresh: the London restaurants and barbershops trade pages, the London calculator): no
 *     element stamped `setup_costs:`. Floor: the three renders exist, each over 10,000 bytes with 20 stamped figures or more.
 *
 * IT PROVES ITSELF FIRST on planted inputs: the GB file's block as a JSON literal and a bulk block as jsonb_build_object, each printed
 * by a reader with no measurement rule; a typed "$426K" and "about 12% of sales" in a string, read as reds; the same inside a comment,
 * read as nothing. To watch it red on the code before this change, point it at that tree:
 *   git archive 0beeee9a | tar -x -C /tmp/before && npx tsx tests/open/held_bill.test.ts --root=/tmp/before
 *
 * ITS BLIND SPOT, said once. It cannot tell a measured bill from a typed one that claims a measurement: a writer that sets
 * `measured_src` to anything passes A, and its figures are the writer's to hold. B reads string literals in the files listed: a figure
 * built by arithmetic on a typed constant (`rate * 100`) or typed in a file not on the list is not seen (no-typed-figures reads bare
 * figures in markup, start-side-held the two deleted tables, and the provenance ratchet unstamped figures on the harness pages).
 *
 * Run: npx tsx tests/open/held_bill.test.ts [--root=<a checkout to read instead of this one>]
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "held-bill";
const REMEDY = "print a bill only where its block names a measurement (measured_src, src/lib/spine/setup_items.ts); draw every figure from held data through a builder with its stamp; never type a money or percent figure into these surfaces";
const ROOT = (process.argv.find((a) => a.startsWith("--root="))?.slice("--root=".length) ?? process.cwd()).replace(/\/$/, "");
let failed = 0;
const fail = (file: string, detail: string) => { failed++; red({ rule: RULE, file, detail, remedy: REMEDY }); };
const control = (label: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  control: ${label}`);
  if (!ok) { failed++; red({ rule: RULE, file: "tests/open/held_bill.test.ts", detail: `the reader failed its own control: ${label}`, remedy: "teach the reader the shape again before trusting a pass" }); }
};

type Block = Record<string, unknown>;
type Items = { items: Array<{ name: string; usd: number }>; scope: string } | undefined;
type Reader = (cell: { setup_costs?: Block; country?: string; _fromParentIndustry?: string }) => Items;

/* ---------- A. every writer of the bill ---------- */

/** Every `SET setup_costs = <expr>` in one SQL text, as blocks: a JSON literal parsed, a jsonb_build_object read key by key. */
function billBlocks(sql: string): { json: Block[]; built: Block[] } {
  const text = sql.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n");
  const json: Block[] = [];
  const built: Block[] = [];
  for (const m of text.matchAll(/SET\s+setup_costs\s*=\s*'([\s\S]*?)'::jsonb/g)) json.push(JSON.parse(m[1]));
  for (const m of text.matchAll(/SET\s+setup_costs\s*=\s*jsonb_build_object\(([\s\S]*?)\n(?:WHERE|\s*WHERE)/g)) {
    const body = m[1];
    const half = (name: string): Block => {
      const at = body.indexOf(`'${name}', jsonb_build_object(`);
      if (at < 0) return {};
      const rest = body.slice(at);
      const end = rest.search(/\n\s*\),?\s*\n\s*'(registration|capital|payback_months_estimate|refreshed_at|grade)'/);
      const seg = end > 0 ? rest.slice(0, end) : rest;
      const out: Block = {};
      for (const p of seg.matchAll(/'([a-z_]+)',\s*(-?\d+(?:\.\d+)?)/g)) out[p[1]] = Number(p[2]);
      for (const p of seg.matchAll(/'([a-z_]+)',\s*CASE[\s\S]*?WHEN 'US' THEN (\d+(?:\.\d+)?)/g)) out[p[1]] = Number(p[2]);
      return out;
    };
    const grade = body.match(/'grade',\s*'([A-D])'/)?.[1];
    const measured = body.match(/'measured_src',\s*'([^']*)'/)?.[1];
    built.push({ registration: half("registration"), capital: half("capital"), ...(grade ? { grade } : {}), ...(measured ? { measured_src: measured } : {}) });
  }
  return { json, built };
}

/** Every .sql under a directory, by path from the root. */
function sqlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? sqlFiles(p) : n.endsWith(".sql") ? [p] : [];
  });
}

/** The lines a reader prints for one block, as a GB and as a US row, its own trade. */
const printed = (read: Reader, b: Block) => [read({ setup_costs: b, country: "GB" }), read({ setup_costs: b, country: "US" })].filter((x) => x && x.items.length > 0);

/* ---------- B. the surfaces' source ---------- */

const FILES = [
  "src/lib/spine/setup_items.ts",
  "src/lib/spine/open_rows.ts",
  "src/lib/simulator/defaults.ts",
  "src/lib/simulator/cell_facts.ts",
  "src/lib/open/dealbreakers.ts",
  "src/lib/open/opening_page.ts",
  "src/lib/open/buy_side.ts",
  "src/lib/open/buy_vs_start.ts",
  "src/components/open/OpeningHero.tsx",
  "src/components/open/OpeningChecklist.tsx",
  "src/components/open/OpeningComparisons.tsx",
  "src/components/open/OpeningPayback.tsx",
  "src/components/buy/BuyVsStartHero.tsx",
  "src/components/buy/BuyVsStartCompare.tsx",
  "src/components/buy/BuyVsStartCatches.tsx",
  "src/components/sections/SetupCostBlock.tsx",
  "src/app/[country]/[geo]/[industry]/opening/page.tsx",
  "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx",
];

/** A money or percent figure: a currency sign before a digit, a digit before %, or a number with K, M or bn behind it. */
const FIGURE = /[$£€]\s?\d|\d\s?%|\b\d[\d,.]*\s?(?:K|M|bn)\b/;
const METHOD = /\bdirectional\b/i;

/** The string literals of one file's code, comments removed (scripts/lib/strip_comments), each with its line. */
function stringsOf(text: string): Array<{ line: number; s: string }> {
  const code = stripCommentLines(text.split("\n"));
  const out: Array<{ line: number; s: string }> = [];
  code.forEach((l, i) => {
    /* JSX text is a string a reader sees too: the text after a `>`, a `}` or the line's start up to the next tag, `{` or the line's end, and
       a line of words alone (a JSX text node's continuation line) */
    for (const m of l.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`|(?:^|[>}])([^<>{}"'`]+)(?=<\/|<[A-Za-z]|\{|$)/g)) {
      const s = m[1] ?? m[2] ?? m[3] ?? m[4] ?? "";
      if (s.trim()) out.push({ line: i + 1, s });
    }
    if (/^\s*[A-Za-z][A-Za-z0-9 ,.%$£€'-]*$/.test(l) && /\s/.test(l.trim())) out.push({ line: i + 1, s: l });
  });
  return out;
}

/** The typed figures and method words in one file's strings. A template's `${...}` is code: it is taken out before the figure is looked for. */
function typedIn(text: string): Array<{ line: number; s: string; why: string }> {
  return stringsOf(text).flatMap(({ line, s }) => {
    const bare = s.replace(/\$\{[^}]*\}/g, "");
    if (FIGURE.test(bare)) return [{ line, s, why: "a typed money or percent figure" }];
    if (METHOD.test(bare)) return [{ line, s, why: "the method disclaimer \"directional\"" }];
    return [];
  });
}

/** Words as a reader counts them: a figure such as "8%" is one. */
const wordCount = (line: string) => line.trim().split(/\s+/).filter(Boolean).length;

/* ---------- controls: the reader proves itself first ---------- */

const GB_BLOCK = `UPDATE regional_cells\nSET setup_costs = '{\n  "registration": { "business_registration_fee": 20, "industry_licenses_fee": 1500, "total_estimated": 4000 },\n  "capital": { "property_fitout": 250000, "equipment_initial": 100000, "total_estimated": 422000 },\n  "grade": "B"\n}'::jsonb\nWHERE country = 'GB';`;
const BULK_BLOCK = `UPDATE cells_master\nSET setup_costs = jsonb_build_object(\n  'registration', jsonb_build_object(\n    'business_registration_fee', 200,\n    'total_estimated', CASE country\n      WHEN 'US' THEN 3000\n      ELSE 3000 END\n  ),\n  'capital', jsonb_build_object(\n    'property_fitout', 100000,\n    'equipment_initial', 50000\n  ),\n  'grade', 'C'\n)\nWHERE country = 'US';`;
/* The reader as it stood before this change: grade A or B with a country prints (src/lib/spine/setup_items.ts at 0beeee9a). */
const OLD_READER: Reader = (c) => {
  const s = c.setup_costs as { grade?: string; capital?: Record<string, number> } | undefined;
  if (!s || c._fromParentIndustry || (s.grade !== "A" && s.grade !== "B" && s.grade !== "C") || !c.country) return undefined;
  const items = Object.entries(s.capital ?? {}).filter(([k, v]) => k !== "total_estimated" && v > 0).map(([name, usd]) => ({ name, usd }));
  return items.length ? { items, scope: c.country } : undefined;
};
{
  const a = billBlocks(GB_BLOCK);
  const b = billBlocks(BULK_BLOCK);
  control("A reads the GB file's JSON block (two capital lines, grade B) and a bulk jsonb_build_object block (its CASE total by the US branch, grade C)", a.json.length === 1 && (a.json[0].capital as Block).property_fitout === 250000 && b.built.length === 1 && (b.built[0].registration as Block).total_estimated === 3000 && (b.built[0].capital as Block).equipment_initial === 50000 && b.built[0].grade === "C");
  control("A sees a reader with no measurement rule print the typed blocks", printed(OLD_READER, a.json[0]).length > 0 && printed(OLD_READER, b.built[0]).length > 0);
  const planted = `const DEALBREAKERS = {\n  restaurants: "you can secure a high-footfall location at rent under about 12% of sales",\n};\nconst bill = "$426K";\nconst t = \`\${n} days\`;\n// a comment that says $426K and 12% of sales\n/* and a block comment\n   that says £100 and directional */\nexport const Hero = () => (<p>{x}. Directional, and worth being honest\n  before anything else at about 12% of sales.</p>);`;
  const hits = typedIn(planted);
  if (process.env.HB_DEBUG) console.log(JSON.stringify(hits));
  control("B sees \"12% of sales\" and \"$426K\" in strings, \"Directional\" in JSX text and a figure on a JSX text line of its own, and nothing in a template's code or in the comments", hits.length === 4 && hits.some((h) => h.s.includes("12%") && h.line === 2) && hits.some((h) => h.s === "$426K") && hits.some((h) => /Directional/.test(h.s)) && hits.some((h) => h.line === 10) && !hits.some((h) => h.line >= 6 && h.line <= 8));
}

/* ---------- run ---------- */

async function main() {
  const mod = <T,>(rel: string): Promise<T> => import(pathToFileURL(join(ROOT, rel)).href) as Promise<T>;
  const { setupItemsFromCell } = await mod<{ setupItemsFromCell: Reader }>("src/lib/spine/setup_items.ts");

  /* A */
  const sqls = sqlFiles(join(ROOT, "scripts/import/deepening"));
  let nJson = 0, nBuilt = 0;
  for (const f of sqls) {
    const { json, built } = billBlocks(readFileSync(f, "utf8"));
    nJson += json.length;
    nBuilt += built.length;
    for (const b of [...json, ...built]) {
      if (typeof b.measured_src === "string" && b.measured_src.trim()) { console.log(`note  ${f.slice(ROOT.length + 1)}: a block names a measurement (${b.measured_src}); its lines may print`); continue; }
      for (const p of printed(setupItemsFromCell, b)) fail(f.slice(ROOT.length + 1), `a typed bill (grade ${String(b.grade ?? "none")}, no measurement named) prints ${p!.items.length} lines, ${p!.items.reduce((a, i) => a + i.usd, 0).toLocaleString("en-US")} in all, as ${p!.scope}'s`);
    }
  }
  console.log(`A: ${sqls.length} SQL files, ${nJson} JSON blocks, ${nBuilt} built blocks read`);
  if (sqls.length < 19) fail("scripts/import/deepening", `read ${sqls.length} SQL files, expected 19 or more (the three typed by hand and the bulk template's sixteen)`);
  if (nJson < 3) fail("scripts/import/deepening", `read ${nJson} JSON setup_costs blocks, expected 3 or more`);
  if (nBuilt < 16) fail("scripts/import/deepening/_bulk", `read ${nBuilt} built setup_costs blocks, expected 16 or more`);

  /* B */
  let nStrings = 0;
  for (const rel of FILES) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) { fail(rel, "a surface file is missing: the list is stale or the file moved"); continue; }
    const text = readFileSync(p, "utf8");
    nStrings += stringsOf(text).length;
    for (const h of typedIn(text)) fail(`${rel}:${h.line}`, `${h.why} in "${h.s.trim().slice(0, 90)}"`);
  }
  console.log(`B: ${FILES.length} surface files, ${nStrings} string literals read`);
  if (nStrings < 300) fail("tests/open/held_bill.test.ts", `read ${nStrings} string literals over the surfaces, expected 300 or more`);

  /* C */
  const { COPY } = await mod<{ COPY: Record<string, Record<string, unknown>> }>("src/lib/spine/copy.ts");
  const words = (o: unknown, path: string): Array<[string, string]> => (typeof o === "string" ? [[path, o]] : o && typeof o === "object" ? Object.entries(o).flatMap(([k, v]) => words(v, `${path}.${k}`)) : []);
  const copyLines = ["tradeOpen", "opening", "buyOrStart"].flatMap((k) => words(COPY[k], `COPY.${k}`));
  for (const [path, s] of copyLines) if (FIGURE.test(s) || METHOD.test(s)) fail("src/lib/spine/copy.ts", `${path} holds a typed figure or method word: "${s}"`);
  const dealMod = await mod<{ dealbreakerFor: (id: string) => string | null; dealbreakerIds?: () => string[]; dealbreakerFigure?: (id: string) => { figure: string; prov: { src: string; kind: string } } | null }>("src/lib/open/dealbreakers.ts");
  const { INDUSTRIES } = await mod<{ INDUSTRIES: Array<{ id: string }> }>("src/lib/taxonomy.ts");
  /* every live trade, and every key the table holds (three keys are not live trades: their lines are read all the same) */
  const ids = [...new Set([...INDUSTRIES.map((i) => i.id), ...(dealMod.dealbreakerIds?.() ?? [])])];
  let nDeal = 0;
  for (const id of ids) {
    const d = dealMod.dealbreakerFor(id);
    if (!d) continue;
    nDeal++;
    if (/\d/.test(d)) fail("src/lib/open/dealbreakers.ts", `${id}'s dealbreaker types a figure: "${d}"`);
    const line = `${String(COPY.opening?.dealbreakerLead ?? "Do not open unless")} ${d}.`;
    if (wordCount(line) > 12) fail("src/lib/open/dealbreakers.ts", `${id}'s dealbreaker runs ${wordCount(line)} words, over the copy rules' twelve: "${line}"`);
    const f = dealMod.dealbreakerFigure?.(id);
    if (f && !(/^data\/facts\/industry\/[a-z_]+\.json:cost_structure\.cost_drivers\.[^.]+\.pct_of_revenue$/.test(f.prov.src) && f.prov.kind === "estimate")) fail("src/lib/open/dealbreakers.ts", `${id}'s held figure ${f.figure} carries no shard stamp: ${JSON.stringify(f.prov)}`);
  }
  console.log(`C: ${copyLines.length} copy lines, ${ids.length} trades asked, ${nDeal} dealbreakers read`);
  if (INDUSTRIES.length < 138 || nDeal < 13) fail("src/lib/open/dealbreakers.ts", `asked ${INDUSTRIES.length} live trades and read ${nDeal} dealbreakers, expected 138 and the table's 13 or more`);
  /* THE HELD FIGURE'S LINE SAYS IT IS AN ESTIMATE (fix round 1, I-2): the figure is stamped an estimate, and the words a reader sees say so too. */
  const figLine = String(COPY.opening?.dealbreakerFigure ?? "");
  if (dealMod.dealbreakerFigure && !/\bestimate|\btypical/i.test(figLine)) fail("src/lib/spine/copy.ts", `COPY.opening.dealbreakerFigure prints an estimate without saying so: "${figLine}"`);
  if (dealMod.dealbreakerFigure && wordCount(figLine.replace("{pct}", "8%")) > 12) fail("src/lib/spine/copy.ts", `COPY.opening.dealbreakerFigure runs over twelve words: "${figLine}"`);
  if (dealMod.dealbreakerFor("restaurants") && !dealMod.dealbreakerFigure?.("restaurants")) fail("src/lib/open/dealbreakers.ts", "restaurants' dealbreaker stands with no held figure under it (the rent share its shard holds)");

  /* D */
  const RENDERS = ["cell-gb-london-restaurants", "cell-gb-london-barbershops", "calculator-gb-london-restaurants"];
  for (const name of RENDERS) {
    const p = join(ROOT, "scratchpad/harness/pages", `${name}.html`);
    if (!existsSync(p)) { fail(p, "the render is missing: run pages-fresh first (it runs first in the chain)"); continue; }
    const html = readFileSync(p, "utf8");
    const stamps = html.match(/data-src="[^"]*"/g) ?? [];
    if (html.length < 10_000 || stamps.length < 20) fail(p, `the render holds ${html.length} bytes and ${stamps.length} stamped figures, expected over 10,000 and 20 or more`);
    const bill = stamps.filter((s) => s.startsWith('data-src="setup_costs:'));
    if (bill.length > 0) fail(p, `${bill.length} figures stamped with a typed bill (${bill[0]})`);
    console.log(`D: ${name}: ${stamps.length} stamped figures, ${bill.length} from a bill`);
  }

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "findings"); process.exit(1); }
  console.log("held-bill: pass");
}
main().then(() => process.exit(failed > 0 ? 1 : 0), (e) => { console.error(e); process.exit(1); });
