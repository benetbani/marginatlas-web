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
 *     block that prints a line is a red. A block that names a measurement (`measured_src`) must name a file and a key that exist (a
 *     data file, `data/<path>.json:<key>`, or a named register, `uk/registers/<file>.json:<key>`); its lines may print, and its
 *     measurement joins the stamps D accepts. Floor: 19 files, 3 JSON blocks, 16 built blocks (the two US tables of each bulk file count once).
 *  B. THE SURFACES' SOURCE: the builders and components of the trade page's `04 open`, /calculator, /opening and /buy-or-start (FILES
 *     below), comments removed through scripts/lib/strip_comments; a string literal holding a money or percent figure ("$426K", "12% of
 *     sales", "£100") is a red, and so is the word "directional" in one. The list is held to an independent walk of the five directories
 *     these surfaces live in (WALKED): a file there that the list does not name is a red, so a new component is read or argued out.
 *     Floor: every file present, 300 string literals read.
 *  C. THE WORDS THE BUILDERS RETURN: COPY.tradeOpen, COPY.opening, COPY.buyOrStart and COPY.calculator hold no figure; every
 *     dealbreaker holds no figure and runs twelve words or fewer with its lead; its held figure carries a shard stamp, an estimate, and
 *     its line says estimate. Floor: 138 live trades and the table's 13 keys.
 *  D. THE RENDERS the chain draws first (pages-fresh: the London restaurants and barbershops trade pages, the London calculator): no
 *     element stamped `setup_costs:` (the stamp the typed bill carried), and a bill stamp equal to a writer's measurement is accepted.
 *     Floor: the three renders exist, each over 10,000 bytes with 20 stamped figures or more.
 *
 * A RENDER DRAWN FROM FALLBACKS IS NOT READ. pages-fresh renders with the live database, and where a query fails or runs over its budget
 * the adapters fall back and the page renders anyway; such a page cannot show a bill whatever the code does. pages-fresh writes its count
 * of fallbacks beside the renders (render_state.json, the one state file fact-once reads too); where it is above zero D reads nothing and says so the chain's own way, "3
 * deferred", which the summary lists as checks that could not run, never as passes. A and the reader's own test (bill-own-trade) are the
 * guarantee; D is the sight of it on a page.
 *
 * IT PROVES ITSELF FIRST on planted inputs: the GB file's block as a JSON literal and a bulk block as jsonb_build_object, each printed
 * by a reader with no measurement rule; a planted measured block, printed with its measurement as its stamp, and one naming a file that
 * does not exist, refused; a typed "$426K" and "about 12% of sales" in a string, read as reds, the same inside a comment read as nothing;
 * a planted shard for the dealbreaker's held tag; and planted renders: a typed bill stamp red, a measured one accepted, a fallen-back
 * render deferred. To watch it red on the code before this change, point it at that tree:
 *   git archive 0beeee9a | tar -x -C /tmp/before && npx tsx tests/open/held_bill.test.ts --root=/tmp/before
 *
 * ITS BLIND SPOT, said once. It cannot tell a true measurement from a writer's false claim of one: a block naming a file and key that
 * exist passes A whatever the file holds. B reads string literals in the files listed and walked: a figure built by arithmetic on a
 * typed constant (`rate * 100`) or typed in a file outside those directories is not seen (no-typed-figures reads bare figures in markup,
 * start-side-held the two deleted tables, and the provenance ratchet unstamped figures on the harness pages). D reads three renders,
 * never /opening or /buy-or-start (buy-price-held renders those components on fixtures). D's fallback count is a count of the query
 * ledger's `[cells] ... falling back` lines, and withBudget logs on timeout only, so a query that fails fast is silent: this cannot tell
 * zero fallback lines from a fast-failing query, and a render drawn that way reads as read (the floor of 20 stamped figures a render must
 * hold is what limits the harm).
 * D REDS ONLY THE `setup_costs:` STAMP, NOT EVERY OTHER BILL-SHAPED ONE (the re-review's M-3), and here is why: a bill line carries no
 * mark of its own in the markup, only a data-src on an ordinary row, the same as the calculator's built opening lines stamped from the
 * city shard, so a render cannot say which stamps are a bill's. The bill's one door is the reader, setupItemsFromCell, which prints a bill
 * only stamped with its block's measured_src, and A checks every writer's measured_src names a file and key that exist; bill-own-trade
 * proves the reader on a planted measured bill. D is the sight of the typed stamp gone, not the guard on a second door.
 *
 * Run: npx tsx tests/open/held_bill.test.ts [--root=<a checkout to read instead of this one>]
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
import { FRESH_DIR } from "../../scripts/lib/page_renders.mjs";
import { readRenderState } from "../../scripts/lib/render_state.mjs";
import { isMeasuredSource } from "../../src/lib/spine/setup_items";

const RULE = "held-bill";
/* ONE REMEDY PER FINDING CLASS (fix round 1, I-4). */
const REMEDIES = {
  typedBill: "print a bill only where its block names a measurement (measured_src, src/lib/spine/setup_items.ts); never print a typed bill",
  measurement: "name the measurement as a file and a key that exist: data/<path>.json:<key>, or a named register uk/registers/<file>.json:<key>",
  typedFigure: "draw the figure from held data through a builder with its stamp (src/lib/spine/provenance.ts); never type a money or percent figure into these surfaces",
  method: "say the thing plainly or leave the line off; the copy rules ban method disclaimers such as \"directional\"",
  unread: "add the file to FILES in tests/open/held_bill.test.ts so the gate reads it, or move it out of the surfaces' directories",
  floor: "the gate read less than it guards: restore what it reads (the SQL writers, the surface files, the trades, the renders) before trusting a pass",
  words: "hold the line to the copy rules: twelve words or fewer, and the word estimate where the figure is one",
  stamp: "stamp the figure with its source and kind (data-src, data-kind): a shard figure with its file and key, an estimate",
  render: "run pages-fresh first (it runs first in the chain) and read why the render is missing or thin",
} as const;
type Klass = keyof typeof REMEDIES;
const ROOT = (process.argv.find((a) => a.startsWith("--root="))?.slice("--root=".length) ?? process.cwd()).replace(/\/$/, "");
const relRoot = (p: string) => (p.startsWith(`${ROOT}/`) ? p.slice(ROOT.length + 1) : p);
let failed = 0;
let deferredChecks = 0;
const fail = (file: string, detail: string, klass: Klass) => { failed++; red({ rule: RULE, file: relRoot(file), detail, remedy: REMEDIES[klass] }); };
const control = (label: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  control: ${label}`);
  if (!ok) { failed++; red({ rule: RULE, file: "tests/open/held_bill.test.ts", detail: `the reader failed its own control: ${label}`, remedy: "teach the reader the shape again before trusting a pass" }); }
};

type Block = Record<string, unknown>;
type Items = { items: Array<{ name: string; usd: number }>; scope: string; src?: string } | undefined;
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
  "src/components/sections/SetupCostBlock.tsx",
  "src/app/[country]/[geo]/[industry]/opening/page.tsx",
  "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx",
  "src/app/(site)/calculator/page.tsx",
  "src/app/api/calculator/route.ts",
  "src/components/open/OpeningChecklist.tsx",
  "src/components/open/OpeningComparisons.tsx",
  "src/components/open/OpeningHero.tsx",
  "src/components/open/OpeningPayback.tsx",
  "src/components/buy/BuyVsStartCatches.tsx",
  "src/components/buy/BuyVsStartCompare.tsx",
  "src/components/buy/BuyVsStartHero.tsx",
  "src/components/spine/calculator/CalculatorClient.tsx",
  "src/components/spine/calculator/calculator-view.tsx",
  "src/components/spine/calculator/levers.tsx",
  "src/components/spine/calculator/sections.tsx",
  "src/lib/open/buy_side.ts",
  "src/lib/open/buy_vs_start.ts",
  "src/lib/open/dealbreakers.ts",
  "src/lib/open/opening_page.ts",
  "src/lib/open/sub_page_gates.ts",
  "src/lib/simulator/bounds.ts",
  "src/lib/simulator/bundle.ts",
  "src/lib/simulator/cell_facts.ts",
  "src/lib/simulator/defaults.ts",
  "src/lib/simulator/display.ts",
  "src/lib/simulator/engine.ts",
  "src/lib/simulator/load.ts",
  "src/lib/simulator/place.ts",
  "src/lib/simulator/respond.ts",
  "src/lib/simulator/seed.ts",
  "src/lib/simulator/seo.ts",
  "src/lib/simulator/state.ts",
  "src/lib/simulator/uk_model.ts",
];

/** The directories the surfaces live in, walked by path from the root: every .ts and .tsx in them must be on FILES (fix round 1, I-4). */
const WALKED = ["src/components/open", "src/components/buy", "src/components/spine/calculator", "src/lib/open", "src/lib/simulator"];
/** THE WALK'S RED, one function the run and its control share: every walked file that the list does not name. */
function walkedMissing(list: string[], found: string[]): string[] {
  return found.filter((f) => !list.includes(f));
}
function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(n) ? [p] : [];
  });
}

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

/* ---------- A. a named measurement exists ---------- */

/** True when a measured_src names a file and a key that exist under the root: a data file's dotted key (or a fact shard's metric, its `*`
 *  filled by a row key), or a register file's key. */
function measurementExists(root: string, src: string): boolean {
  /* THE SHAPE IS WRITTEN ONCE (the re-review's M-5), in setup_items.ts beside the reader that takes it; this checks only that it exists. */
  if (!isMeasuredSource(src)) return false;
  const at0 = src.trim().indexOf(":");
  const rel = src.trim().slice(0, at0);
  const file = join(root, rel.startsWith("uk/registers/") ? `data/${rel}` : rel);
  if (!existsSync(file)) return false;
  let doc: unknown;
  try { doc = JSON.parse(readFileSync(file, "utf8")); } catch { return false; }
  const key = src.trim().slice(at0 + 1);
  const facts = (doc as { facts?: Array<{ metric: string; rowKey: string }> }).facts;
  if (Array.isArray(facts) && facts.some((f) => f.metric === key || f.metric.replace("*", f.rowKey) === key)) return true;
  let at: unknown = doc;
  for (const part of key.split(".")) { if (at && typeof at === "object" && part in (at as object)) at = (at as Record<string, unknown>)[part]; else return false; }
  return at !== undefined;
}

/* ---------- D. one render judged ---------- */

/** One render against the fallback state and the accepted measurements: read or deferred, and its findings. */
function judgeRender(html: string, fallbacks: number, accepted: Set<string>): { read: boolean; stamps: number; billStamps: number; accepted: number; findings: string[] } {
  if (fallbacks > 0) return { read: false, stamps: 0, billStamps: 0, accepted: 0, findings: [] };
  const srcs = [...html.matchAll(/data-src="([^"]*)"/g)].map((m) => m[1]);
  const typed = srcs.filter((s) => s.startsWith("setup_costs:"));
  const ok = srcs.filter((s) => accepted.has(s));
  const findings: string[] = [];
  if (html.length < 10_000 || srcs.length < 20) findings.push(`the render holds ${html.length} bytes and ${srcs.length} stamped figures, expected over 10,000 and 20 or more`);
  if (typed.length > 0) findings.push(`${typed.length} figures stamped with a typed bill (${typed[0]})`);
  return { read: true, stamps: srcs.length, billStamps: typed.length, accepted: ok.length, findings };
}

/* ---------- controls: the reader proves itself first ---------- */

/** A PLANTED PATH IS BUILT FROM PARTS (the re-review's M-4): counts.ts lists as a gate's reads every string literal that begins with a repo
 *  root, so a negative control's path typed whole ("a file that does not exist") would stand in scripts/gates.json as a file this gate reads. */
const plantedPath = (...parts: string[]) => parts.join("/");

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
  /* D on planted renders: a typed bill stamp reds, a stamp equal to an accepted measurement passes, and a render drawn from fallbacks is not read. */
  const body = (stamp: string) => `<html><body>${"<p>padding</p>".repeat(900)}${Array.from({ length: 24 }, (_, i) => `<span data-src="${plantedPath("data", "facts/industry/restaurants.json:first_year.payback_years")}" data-kind="estimate">${i}</span>`).join("")}<b data-src="${stamp}" data-kind="estimate">$426K</b></body></html>`;
  const PLANTED = plantedPath("data", "facts/country/GB.json:costs.license_setup_usd");
  const typedR = judgeRender(body("setup_costs:restaurants:GB"), 0, new Set([PLANTED]));
  const measuredR = judgeRender(body(PLANTED), 0, new Set([PLANTED]));
  const fallenR = judgeRender(body("setup_costs:restaurants:GB"), 2, new Set([PLANTED]));
  control("D reds a planted render stamped setup_costs:, accepts one stamped with an accepted measurement, and does not read a render drawn from fallbacks", typedR.read && typedR.findings.some((f) => /typed bill/.test(f)) && measuredR.read && measuredR.findings.length === 0 && measuredR.accepted === 1 && !fallenR.read && fallenR.findings.length === 0);
}

/* THE WALK'S RED ON A PLANT (the re-review's M-2): a temp tree holding a listed file and an unlisted one, walked by path, reds the unlisted
   one only, and a .md beside them is not walked. */
{
  const tmp = mkdtempSync(join(tmpdir(), "held-bill-walk-"));
  mkdirSync(join(tmp, "open", "deep"), { recursive: true });
  for (const n of ["open/Listed.tsx", "open/deep/Unlisted.ts", "open/notes.md"]) writeFileSync(join(tmp, n), "export {};\n");
  const found = walk(join(tmp, "open")).map((p) => p.slice(tmp.length + 1)).sort();
  const missing = walkedMissing(["open/Listed.tsx"], found);
  rmSync(tmp, { recursive: true, force: true });
  control("the walk reds a planted unlisted file in a nested directory, not the listed one, and walks no .md", found.length === 2 && missing.length === 1 && missing[0] === "open/deep/Unlisted.ts");
}

/* THE STATE FILE'S FRESHNESS ON PLANTS (the controller's ruling e): a temp directory with one render and its state file; the state written
   after the render reads fresh; the render redrawn after the state, a render older than the run, a page the file names no state for, and
   no file at all, each read as a fault. */
{
  const tmp = mkdtempSync(join(tmpdir(), "held-bill-state-"));
  const render = join(tmp, "cell-x.html");
  writeFileSync(render, "<html></html>");
  const at = (ms: number) => new Date(ms).toISOString();
  const now = Date.now();
  const state = (started: number, written: number, pages: Record<string, unknown>) => writeFileSync(join(tmp, "render_state.json"), JSON.stringify({ started: at(started), written: at(written), fallbacks: 0, pages }));
  const live = { "cell-x": { fallbacks: 0, state: "live" } };
  const t = now / 1000;
  utimesSync(render, t, t);
  state(now - 5_000, now + 100, live);
  const fresh = readRenderState(tmp, ["cell-x"]).faults.length === 0;
  utimesSync(render, t + 60, t + 60);
  const redrawn = readRenderState(tmp, ["cell-x"]).faults.some((f: string) => /after/.test(f));
  utimesSync(render, t - 60, t - 60);
  const older = readRenderState(tmp, ["cell-x"]).faults.some((f: string) => /before the run/.test(f));
  utimesSync(render, t, t);
  state(now - 5_000, now + 100, {});
  const noPage = readRenderState(tmp, ["cell-x"]).faults.some((f: string) => /no state for cell-x/.test(f));
  rmSync(join(tmp, "render_state.json"));
  const none = readRenderState(tmp, ["cell-x"]).faults.some((f: string) => /does not exist/.test(f));
  rmSync(tmp, { recursive: true, force: true });
  control("the state file reads fresh beside its render, and stale when the render was redrawn after it or drawn before its run, when it names no state for the page, and when it is missing", fresh && redrawn && older && noPage && none);
}

/* ---------- run ---------- */

async function main() {
  const mod = <T,>(rel: string): Promise<T> => import(pathToFileURL(join(ROOT, rel)).href) as Promise<T>;
  const { setupItemsFromCell } = await mod<{ setupItemsFromCell: Reader }>("src/lib/spine/setup_items.ts");
  /* A PLANTED MEASURED BLOCK (fix round 1, I-3): a block naming a file and key that exist prints its lines with that measurement as its stamp;
     one naming a file that does not exist is refused by the existence check (the reader checks the shape only). */
  {
    const PLANTED = plantedPath("data", "facts/country/GB.json:costs.license_setup_usd");
    const block: Block = { capital: { property_fitout: 1000 }, grade: "B", measured_src: PLANTED };
    const out = printed(setupItemsFromCell, block);
    control("A: a planted measured block prints its line stamped with its measurement; a file and key that exist pass, a missing file and a bare word do not", out.length === 2 && out.every((o) => o!.src === PLANTED) && measurementExists(ROOT, PLANTED) && !measurementExists(ROOT, plantedPath("data", "facts/country/ZZ.json:costs.license_setup_usd")) && !measurementExists(ROOT, plantedPath("data", "facts/country/GB.json:no.such.key")) && !measurementExists(ROOT, "survey"));
  }
  const accepted = new Set<string>();

  /* A */
  const sqls = sqlFiles(join(ROOT, "scripts/import/deepening"));
  let nJson = 0, nBuilt = 0;
  for (const f of sqls) {
    const { json, built } = billBlocks(readFileSync(f, "utf8"));
    nJson += json.length;
    nBuilt += built.length;
    for (const b of [...json, ...built]) {
      if (typeof b.measured_src === "string" && b.measured_src.trim()) {
        if (!measurementExists(ROOT, b.measured_src)) { fail(f, `a block names a measurement that does not exist: "${b.measured_src}"`, "measurement"); continue; }
        accepted.add(b.measured_src.trim());
        console.log(`note  ${relRoot(f)}: a block names a measurement (${b.measured_src}); its lines may print, stamped with it`);
        continue;
      }
      for (const p of printed(setupItemsFromCell, b)) fail(f, `a typed bill (grade ${String(b.grade ?? "none")}, no measurement named) prints ${p!.items.length} lines, ${p!.items.reduce((a, i) => a + i.usd, 0).toLocaleString("en-US")} in all, as ${p!.scope}'s`, "typedBill");
    }
  }
  console.log(`A: ${sqls.length} SQL files, ${nJson} JSON blocks, ${nBuilt} built blocks read`);
  if (sqls.length < 19) fail("scripts/import/deepening", `read ${sqls.length} SQL files, expected 19 or more (the three typed by hand and the bulk template's sixteen)`, "floor");
  if (nJson < 3) fail("scripts/import/deepening", `read ${nJson} JSON setup_costs blocks, expected 3 or more`, "floor");
  if (nBuilt < 16) fail("scripts/import/deepening/_bulk", `read ${nBuilt} built setup_costs blocks, expected 16 or more`, "floor");

  /* B */
  let nStrings = 0;
  for (const rel of FILES) {
    const p = join(ROOT, rel);
    if (!existsSync(p)) { fail(rel, "a surface file is missing: the list is stale or the file moved", "unread"); continue; }
    const text = readFileSync(p, "utf8");
    nStrings += stringsOf(text).length;
    for (const h of typedIn(text)) fail(`${rel}:${h.line}`, `${h.why} in "${h.s.trim().slice(0, 90)}"`, h.why.startsWith("the method") ? "method" : "typedFigure");
  }
  const walked = WALKED.flatMap((d) => walk(join(ROOT, d))).map(relRoot).sort();
  for (const f of walkedMissing(FILES, walked)) fail(f, "a file in the surfaces' directories that the gate does not read", "unread");
  console.log(`B: ${FILES.length} surface files, ${nStrings} string literals read; ${walked.length} files walked in ${WALKED.length} directories`);
  if (nStrings < 300) fail("tests/open/held_bill.test.ts", `read ${nStrings} string literals over the surfaces, expected 300 or more`, "floor");
  if (walked.length < 25) fail("tests/open/held_bill.test.ts", `walked ${walked.length} files in ${WALKED.join(", ")}, expected 25 or more`, "floor");

  /* C */
  const { COPY } = await mod<{ COPY: Record<string, Record<string, unknown>> }>("src/lib/spine/copy.ts");
  const words = (o: unknown, path: string): Array<[string, string]> => (typeof o === "string" ? [[path, o]] : o && typeof o === "object" ? Object.entries(o).flatMap(([k, v]) => words(v, `${path}.${k}`)) : []);
  const copyLines = ["tradeOpen", "opening", "buyOrStart", "calculator"].flatMap((k) => words(COPY[k], `COPY.${k}`));
  /* EXEMPT, by copy path and words, each with its reason, and each must still match (a stale exemption reds): a law's threshold or a data
     set's scope written into a line is a definition, not a reading of a place. */
  const EXEMPT: Array<{ path: string; has: string; why: string }> = [
    { path: "COPY.calculator.lines.sales.register", has: "under £5m", why: "the turnover register's own scope, the firms it counts, not a reading" },
  ];
  for (const e of EXEMPT) if (!copyLines.some(([path, s]) => path === e.path && s.includes(e.has))) fail("tests/open/held_bill.test.ts", `the exemption for ${e.path} ("${e.has}") no longer matches a line`, "floor");
  for (const [path, s] of copyLines) {
    if (EXEMPT.some((e) => e.path === path && s.includes(e.has))) continue;
    if (FIGURE.test(s.replace(/\{[a-z]+\}/gi, ""))) fail("src/lib/spine/copy.ts", `${path} holds a typed figure: "${s}"`, "typedFigure");
    else if (METHOD.test(s)) fail("src/lib/spine/copy.ts", `${path} holds the method word "directional": "${s}"`, "method");
  }
  if (!COPY.calculator || words(COPY.calculator, "c").length < 50) fail("src/lib/spine/copy.ts", `COPY.calculator holds ${COPY.calculator ? words(COPY.calculator, "c").length : 0} lines, expected 50 or more`, "floor");
  type PlantedRow = { rowKey: string; metric: string; value: number; tag: string };
  const dealMod = await mod<{ dealbreakerFor: (id: string) => string | null; dealbreakerIds?: () => string[]; dealbreakerFigure?: (id: string, rows?: (id: string, prefix: string) => PlantedRow[]) => { figure: string; prov: { src: string; kind: string } } | null }>("src/lib/open/dealbreakers.ts");
  /* THE HELD TAG DECIDES (fix round 1, M-2): a planted shard whose rent driver is tagged modelled prints nothing; tagged held, it prints, stamped. */
  if (dealMod.dealbreakerFigure) {
    const planted = (tag: string) => () => [{ rowKey: "rent_and_occupancy", metric: "cost_structure.cost_drivers.*.pct_of_revenue", value: 9, tag }];
    const asHeld = dealMod.dealbreakerFigure("restaurants", planted("held"));
    control("C: a planted held rent driver prints its figure, stamped; the same driver tagged modelled or placeholder prints nothing", asHeld?.figure === "9%" && /rent_and_occupancy\.pct_of_revenue$/.test(asHeld.prov.src) && dealMod.dealbreakerFigure("restaurants", planted("modeled")) === null && dealMod.dealbreakerFigure("restaurants", planted("placeholder")) === null);
  }
  const { INDUSTRIES } = await mod<{ INDUSTRIES: Array<{ id: string }> }>("src/lib/taxonomy.ts");
  /* every live trade, and every key the table holds (three keys are not live trades: their lines are read all the same) */
  const ids = [...new Set([...INDUSTRIES.map((i) => i.id), ...(dealMod.dealbreakerIds?.() ?? [])])];
  let nDeal = 0;
  for (const id of ids) {
    const d = dealMod.dealbreakerFor(id);
    if (!d) continue;
    nDeal++;
    if (/\d/.test(d)) fail("src/lib/open/dealbreakers.ts", `${id}'s dealbreaker types a figure: "${d}"`, "typedFigure");
    const line = `${String(COPY.opening?.dealbreakerLead ?? "Do not open unless")} ${d}.`;
    if (wordCount(line) > 12) fail("src/lib/open/dealbreakers.ts", `${id}'s dealbreaker runs ${wordCount(line)} words, over the copy rules' twelve: "${line}"`, "words");
    const f = dealMod.dealbreakerFigure?.(id);
    if (f && !(/^data\/facts\/industry\/[a-z_]+\.json:cost_structure\.cost_drivers\.[^.]+\.pct_of_revenue$/.test(f.prov.src) && f.prov.kind === "estimate")) fail("src/lib/open/dealbreakers.ts", `${id}'s held figure ${f.figure} carries no shard stamp: ${JSON.stringify(f.prov)}`, "stamp");
  }
  console.log(`C: ${copyLines.length} copy lines, ${ids.length} trades asked, ${nDeal} dealbreakers read`);
  if (INDUSTRIES.length < 138 || nDeal < 13) fail("src/lib/open/dealbreakers.ts", `asked ${INDUSTRIES.length} live trades and read ${nDeal} dealbreakers, expected 138 and the table's 13 or more`, "floor");
  /* THE HELD FIGURE'S LINE SAYS IT IS AN ESTIMATE (fix round 1, I-2): the figure is stamped an estimate, and the words a reader sees say so too. */
  const figLine = String(COPY.opening?.dealbreakerFigure ?? "");
  if (dealMod.dealbreakerFigure && !/\bestimate|\btypical/i.test(figLine)) fail("src/lib/spine/copy.ts", `COPY.opening.dealbreakerFigure prints an estimate without saying so: "${figLine}"`, "words");
  if (dealMod.dealbreakerFigure && wordCount(figLine.replace("{pct}", "8%")) > 12) fail("src/lib/spine/copy.ts", `COPY.opening.dealbreakerFigure runs over twelve words: "${figLine}"`, "words");
  if (dealMod.dealbreakerFor("restaurants") && !dealMod.dealbreakerFigure?.("restaurants")) fail("src/lib/open/dealbreakers.ts", "restaurants' dealbreaker stands with no held figure under it (the rent share its shard holds)", "stamp");

  /* D */
  const RENDERS = ["cell-gb-london-restaurants", "cell-gb-london-barbershops", "calculator-gb-london-restaurants"];
  /* THE STATE FILE, CHECKED FRESH against these renders (scripts/lib/render_state.mjs): missing or stale is a red, and is not read. */
  const stateRead = readRenderState(join(ROOT, FRESH_DIR), RENDERS) as { file: string; state: { fallbacks?: number } | null; faults: string[] };
  const statePath = stateRead.file;
  for (const f of stateRead.faults) fail(statePath, `the renders' state file: ${f}`, "render");
  const fallbacks = stateRead.faults.length === 0 ? Number(stateRead.state?.fallbacks ?? 0) : 0;
  for (const name of RENDERS) {
    const p = join(ROOT, FRESH_DIR, `${name}.html`);
    if (!existsSync(p)) { fail(p, "the render is missing", "render"); continue; }
    const r = judgeRender(readFileSync(p, "utf8"), fallbacks, accepted);
    if (!r.read) { deferredChecks++; console.log(`D: ${name}: NOT READ, the renders carry ${fallbacks} query fallbacks (${relRoot(statePath)})`); continue; }
    for (const f of r.findings) fail(p, f, /typed bill/.test(f) ? "typedBill" : "render");
    console.log(`D: ${name}: ${r.stamps} stamped figures, ${r.billStamps} from a typed bill, ${r.accepted} from a measured one`);
  }
  if (deferredChecks > 0) console.log(`held-bill: ${deferredChecks} deferred (renders drawn from fallbacks are not read; these are NOT passes)`);

  if (failed > 0) { redSummary(RULE, failed, "each finding above carries its own remedy", "typed bills, typed figures, unread files, long lines, missing stamps or a walk that read too little"); process.exit(1); }
  console.log("held-bill: pass");
}
main().then(() => process.exit(failed > 0 ? 1 : 0), (e) => { console.error(e); process.exit(1); });
