/**
 * EACH FACT PRINTS ONCE, THE READING (plan 2026-10-12 rhythm-air-inside, Task 1B; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * sections 2.3 and 3 item 2): scripts/lib/fact_once.mjs's in-page function over jsdom fixtures, the page's own grammar never read as a repeat (a
 * table's members of one value, a ledger's dates, a hidden twin form, a pill round a figure), and the wiring the fixtures cannot see.
 * BLIND SPOT, stated: jsdom has no layout, so every element is marked laid out and only what an element's own style hides is hidden; the pages
 * are the `fact-once` gate's, in a browser.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/fact_once.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { factOnceInPage } from "../../scripts/lib/fact_once.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "fact-once-reader";
const LIB = "scripts/lib/fact_once.mjs";
const GATE = "scripts/harness/check_fact_once.mjs";
const PAGES = "scripts/harness/pages.json";
const REMEDY = "read one fact as the spec does (scripts/lib/fact_once.mjs header): the same printed figure under one provenance; two provenances are two facts; a section's own grammar is no repeat";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* THE FUNCTION RUNS FROM ITS SOURCE ON DISK, NOT FROM THE IMPORT'S toString (as tests/spine/trade_head.test.ts runs the plain-copy check's inPage): this test is a .ts,
   which tsx runs as CommonJS, and its esbuild pass wraps every inner arrow of the imported function in a `__name` helper that does not exist inside a page ("__name is not
   defined", the first run of this test); the gate is an .mjs entry, runs as ESM, and hands Playwright the function as written, which is the text read here. */
const libText = readFileSync(LIB, "utf8");
const srcFrom = libText.indexOf("function factOnceInPage(");
const srcLen = srcFrom === -1 ? -1 : libText.slice(srcFrom).search(/\r?\n\}\r?\n/);
if (srcFrom === -1 || srcLen === -1) { red({ rule: RULE, file: LIB, detail: "no `function factOnceInPage(` ending at a closing brace in column 0", remedy: "keep the in-page reading one function declaration, whole, so the fixtures can run the source the gate hands the page" }); process.exit(1); }
const inPageSrc = `${libText.slice(srcFrom, srcFrom + srcLen)}\n}`;

type Red = { rule: string; figure: string; where: string; src: string | null };
const run = (body: string): { figures: number; reds: Red[] } => {
  const dom = new JSDOM(`<!doctype html><html><body><main>${body}</main></body></html>`, { runScripts: "outside-only" });
  try {
    const win = dom.window as unknown as { eval: (s: string) => unknown; Element: { prototype: { getClientRects: () => unknown[] } } };
    win.Element.prototype.getClientRects = function () { return [{}]; };
    return JSON.parse(JSON.stringify(win.eval(`(${inPageSrc})()`))) as { figures: number; reds: Red[] };
  } finally { dom.window.close(); }
};
const sec = (block: string, inner: string) => `<div data-block="${block}">${inner}</div>`;
const fig = (t: string, extra = "") => `<span class="fig"${extra}>${t}</span>`;
const rules = (r: { reds: Red[] }) => r.reds.map((x) => `${x.rule}:${x.figure}:${x.where}`).sort().join(" | ");

check("the lib exports factOnceInPage, the function the gate imports and hands the page", typeof factOnceInPage === "function");
let r = run(sec("take", `<span data-figure="">$133</span>`) + sec("setup", fig("$133")));
check(`one figure in two sections, unstamped, is one fact twice: ACROSS (${rules(r)})`, rules(r) === "ACROSS:$133:setup and take");
r = run(sec("setup", fig("$133") + fig("$133")));
check(`two members of one value in one table are the table's grammar, never a repeat (${rules(r) || "none"})`, r.reds.length === 0);
r = run(sec("entry-bill", `<div data-focal="1" class="fig" style="font-size:30px">$133</div>` + fig("$133")));
check(`a section's focal figure printed again in that section: FOCAL AGAIN (${rules(r)})`, rules(r) === "FOCAL AGAIN:$133:entry-bill");
r = run(sec("take", fig("7%", ' data-src="a.json:net"')) + sec("split", fig("7%", ' data-src="b.json:growth"')));
check(`two provenances are two facts, wherever they print (${rules(r) || "none"})`, r.reds.length === 0);
r = run(sec("take", fig("7%", ' data-src="a.json:net"')) + sec("split", fig("7%", ' data-src="a.json:net"')));
check(`one provenance printed twice: SAME STAMP (${rules(r)})`, rules(r) === "SAME STAMP:7%:split and take");
r = run(sec("setup", fig("$133", ' data-src="a.json:llc"') + fig("$133", ' data-src="a.json:joint-stock"')));
check(`a table's two members of one value, each under its own data-src, are two facts (${rules(r) || "none"})`, r.reds.length === 0);
r = run(sec("setup", fig("$133", ' data-src="a.json:fee"') + fig("$133", ' data-src="a.json:fee"')));
check(`two members of one value under ONE data-src are one fact twice, even in one table: SAME STAMP, so each member carries its own (${rules(r)})`, rules(r) === "SAME STAMP:$133:setup");
r = run(sec("changes", fig("6\u00a0Apr\u00a02026")) + sec("staff", fig("6 Apr 2026")) + sec("a", fig("Free")) + sec("b", fig("Free")));
check(`a date and a figure slot holding no digit are no quantity (${rules(r) || "none"})`, r.reds.length === 0);
r = run(sec("peers", `<div style="display:none">${fig("$62K")}</div>${fig("$62K")}`));
check(`a twin form the page hides (the phone list beside its table) is no printing (${rules(r) || "none"}; ${r.figures} read)`, r.reds.length === 0 && r.figures === 1);
r = run(sec("take", fig("$62K")) + sec("customers", `<details><summary>more</summary>${fig("$62K")}</details>`));
check(`a figure inside a closed <details> is not read, as R1 read the page (${rules(r) || "none"})`, r.reds.length === 0);
r = run(sec("take", `<span data-figure="">1 <span>day</span></span>`) + sec("setup", fig("1 day")));
check(`the hero board's row value (data-figure, its unit nested) reads as its whole text: "1 day" (${rules(r)})`, rules(r) === "ACROSS:1 day:setup and take");
r = run(sec("similar", `<span class="rounded-full">${fig("7%")}</span>`) + sec("take", `<div class="fig" style="font-size:40px">7%</div>`));
check(`a pill round a Fig is one printing, read at the Fig (${rules(r)}; ${r.figures} read)`, rules(r) === "ACROSS:7%:similar and take" && r.figures === 2);
r = run(sec("from-abroad", fig("£100, 1 day")) + sec("setup", fig("1 day")));
check(`the stated blind spot: a Fig holding two values reads as one text, so a lone figure equal to one of them is no repeat of it (${rules(r) || "none"})`, r.reds.length === 0 && r.figures === 2);
/* THE COUNT THE GATE'S EMPTY-READ RED STANDS ON (the review of Task 1A, carried into Task 1B): a render whose marks all hold no digit, or that carries no mark, reads figures 0. */
r = run(sec("take", `<p>no mark here</p>`) + sec("setup", fig("Free")));
check(`a render with no printed figure reads figures 0, the count the gate reds on, never a pass (${r.figures} read; ${rules(r) || "none"})`, r.figures === 0 && r.reds.length === 0);

/* THE WIRING the fixtures cannot see. */
const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("the gate guards its browser, reads both widths, the spine surfaces and the allowance list, and hands the page the in-page function", /await requireBrowser\(/.test(gate) && /\[1280, 375\]/.test(gate) && /\["country", "city", "cell", "industry", "hood"\]/.test(gate) && /fact_once_allow\.json/.test(gate) && /page\.evaluate\(factOnceInPage\)/.test(gate), GATE, "call requireBrowser first, read 1280 and 375 over the spine surfaces of scripts/harness/pages.json, filter by scripts/harness/fact_once_allow.json, and evaluate factOnceInPage in each page");
const allow = JSON.parse(readFileSync("scripts/harness/fact_once_allow.json", "utf8")) as Array<Record<string, unknown>>;
check(`every allowance entry names its page, figure, place, the law that forces the second print and a reason (${allow.length})`, Array.isArray(allow) && allow.every((e) => ["page", "figure", "where", "law", "reason"].every((k) => typeof e[k] === "string" && String(e[k]).trim().length > 0)), "scripts/harness/fact_once_allow.json", 'give each entry { "page", "figure", "where", "law", "reason" }: the standing law that forces the second print, named');
const hero = stripCommentLines(readFileSync("src/components/spine/archetypes/HeroBoard.tsx", "utf8").split(/\r?\n/)).join("\n");
check("the hero board's row value carries data-figure, so the gate reads a figure printed in the body face", /<span data-figure="" className="whitespace-nowrap text-right/.test(hero), "src/components/spine/archetypes/HeroBoard.tsx", "mark the hero row's value span data-figure");

/* THE GATE CANNOT PASS HAVING READ NOTHING (the controller's ruling after the review of Task 1A): a spine surface the list holds no page of is a red, and so is a
   listed render that reads no printed figure at a width. The surfaces are read from the gate's own SPINE, not retyped here, and each must occur in the harness list's pages. */
check("the gate reds a spine surface the list holds no page of and a render that reads no printed figure at a width", /SPINE\.filter\(\(s\) => !pages\.some\(/.test(gate) && /\.figures === 0/.test(gate), GATE, `red each SPINE surface with no page in the list (naming ${PAGES}) and each listed render whose factOnceInPage reads figures 0`);
const spineNames = (/const SPINE = \[([^\]]*)\]/.exec(gate)?.[1] ?? "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
const harnessPages = (JSON.parse(readFileSync(PAGES, "utf8")) as { pages: Array<{ surface: string }> }).pages;
const unlisted = spineNames.filter((s) => !harnessPages.some((p) => p.surface === s));
check(`every spine surface the gate names (${spineNames.join(", ")}) occurs in ${PAGES}'s pages, so the gate cannot pass having read no render (missing: ${unlisted.join(", ") || "none"})`, spineNames.length > 0 && unlisted.length === 0, PAGES, `add a page of each spine surface the gate reads (${spineNames.join(", ")}) to ${PAGES}`);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/fact_once: all pass");
