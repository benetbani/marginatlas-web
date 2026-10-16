/**
 * THE LINE RULE, THE READING (plan 2026-10-12 rhythm-air-inside, Task 2C; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, section 2.1;
 * DISTANCES.md section 4's positional test, ruled 2026-10-13): scripts/lib/line_rule.mjs's in-page function over jsdom fixtures with stubbed boxes. Each rule is a red on a
 * planted fixture and a pass on its correct twin: the figure's words 8 under the figure and the next group 24 under the block; a basis 24 under the group above it and the
 * next group 24 below it; a foot or a detail panel 12 under a basis; a basis under a figure that has a drawing under it is the figure's own line in the wrong face; a line with
 * no text is 24 of air holding nothing; and the wiring the fixtures cannot see (the gate, its registration, its scan set).
 * BLIND SPOT, stated: jsdom has no layout, so every box is the one a fixture writes in `data-y="top,bottom"` (a wrapper with none takes the union of its children's) and
 * a box is shown unless its own or an ancestor's inline style says display:none; these fixtures prove the reading, never the pages. The pages are the `line-rule` gate's, in a browser.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/line_rule.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { lineRuleInPage } from "../../scripts/lib/line_rule.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "line-rule-reader";
const LIB = "scripts/lib/line_rule.mjs";
const GATE = "scripts/harness/check_line_rule.mjs";
const CHAIN = "scripts/prebuild_all.ts";
const PAGES = "scripts/harness/pages.json";
const REMEDY = "read a line as scripts/lib/line_rule.mjs's header says: a figure's words 8 under it, the next group 24 under the block, a basis 24 under the group above and 24 above the next, 12 to a foot or a detail panel, no empty line";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* THE FUNCTION RUNS FROM ITS SOURCE ON DISK, NOT FROM THE IMPORT'S toString (as tests/spine/fact_once.test.ts runs fact_once.mjs): this test is a .ts, which tsx runs as
   CommonJS, and its esbuild pass wraps every inner arrow of the imported function in a `__name` helper that does not exist inside a page; the gate is an .mjs entry, runs as ESM,
   and hands Playwright the function as written, which is the text read here. */
const libText = readFileSync(LIB, "utf8");
const srcFrom = libText.indexOf("function lineRuleInPage(");
const srcLen = srcFrom === -1 ? -1 : libText.slice(srcFrom).search(/\r?\n\}\r?\n/);
if (srcFrom === -1 || srcLen === -1) { red({ rule: RULE, file: LIB, detail: "no `function lineRuleInPage(` ending at a closing brace in column 0", remedy: "keep the in-page reading one function declaration, whole, so the fixtures can run the source the gate hands the page" }); process.exit(1); }
const inPageSrc = `${libText.slice(srcFrom, srcFrom + srcLen)}\n}`;

type Red = { rule: string; section: string; line: string; text: string; read: string; got: number | null; want: number | null };
type Read = { lines: number; outside: number; reds: Red[] };
const run = (body: string): Read => {
  const dom = new JSDOM(`<!doctype html><html><body><main>${body}</main></body></html>`, { runScripts: "outside-only" });
  try {
    const win = dom.window as unknown as { eval: (s: string) => unknown; Element: { prototype: Record<string, unknown> } };
    const hidden = (el: Element): boolean => { for (let a: Element | null = el; a; a = a.parentElement) if (/display:\s*none/.test(a.getAttribute("style") ?? "")) return true; return false; };
    const own = (el: Element): [number, number] | null => { const v = el.getAttribute("data-y"); if (!v) return null; const [t, b] = v.split(",").map(Number); return [t, b]; };
    const span = (el: Element): [number, number] | null => {
      const o = own(el);
      if (o) return o;
      let t = Infinity;
      let b = -Infinity;
      for (const k of Array.from(el.children)) { const s = span(k); if (s) { t = Math.min(t, s[0]); b = Math.max(b, s[1]); } }
      return t === Infinity ? null : [t, b];
    };
    win.Element.prototype.getClientRects = function (this: Element) { return hidden(this) ? [] : [{}]; };
    win.Element.prototype.getBoundingClientRect = function (this: Element) { const s = span(this) ?? [0, 0]; return { top: s[0], bottom: s[1], height: s[1] - s[0], left: 0, right: 0, width: 0, x: 0, y: s[0] }; };
    return JSON.parse(JSON.stringify(win.eval(`(${inPageSrc})()`))) as Read;
  } finally { dom.window.close(); }
};

/* THE FIXTURES' VOCABULARY: every box says where it stands, in pixels from the card's top. */
const at = (t: number, b: number) => ` data-y="${t},${b}"`;
const card = (inner: string, id = "s") => `<div class="spine-card" id="${id}">${inner}</div>`;
const figure = (top = 0, text = "$42") => `<div data-focal="1"${at(top, top + 30)} style="font-size:30px">${text}</div>`;
const words = (top: number, text = "a year, full time") => `<p data-focal-words=""${at(top, top + 20)} style="font-size:14px">${text}</p>`;
const placement = (top: number) => `<p data-placement=""${at(top, top + 16)} style="font-size:12px">Higher than 7 in 10.</p>`;
const basis = (top: number, text = "What the figure counts.") => `<p data-basis=""${at(top, top + 16)} style="font-size:12px">${text}</p>`;
const rows = (top: number, h = 100) => `<div${at(top, top + h)} style="font-size:14px">Rows of figures</div>`;
const foot = (top: number) => `<div data-foot=""${at(top, top + 20)} style="font-size:12px">A foot line</div>`;
const panel = (top: number) => `<div data-archetype="detail-panel"${at(top, top + 44)} style="font-size:14px">The plus</div>`;
/** The kit's Focal: a wrapper holding the figure (0 to 30) and its words `above` under it; then what `next` draws `below` under the words (the placement, when given, is part of the block). */
const focalThen = (above: number, below: number | null, next: (top: number) => string = rows, withPlacement = false) => {
  const wTop = 30 + above;
  const wBot = wTop + 20;
  const pBot = withPlacement ? wBot + 4 + 16 : wBot;
  return `<div>${figure()}${words(wTop)}${withPlacement ? placement(wBot + 4) : ""}</div>${below === null ? "" : next(pBot + below)}`;
};
/** A group above (0 to 100), the basis `gapAbove` under it, then what `next` draws `gapBelow` under the basis (nothing when null). */
const basisThen = (gapAbove: number, gapBelow: number | null, next: (top: number) => string = rows) => {
  const bTop = 100 + gapAbove;
  return `${rows(0, 100)}${basis(bTop)}${gapBelow === null ? "" : next(bTop + 16 + gapBelow)}`;
};
/** A figure (0 to 30), the basis `gapAbove` under it, then what `next` draws `gapBelow` under the basis (nothing when null). */
const figureThenBasis = (gapAbove: number, gapBelow: number | null, next: (top: number) => string = rows) => {
  const bTop = 30 + gapAbove;
  return `${figure()}${basis(bTop)}${gapBelow === null ? "" : next(bTop + 16 + gapBelow)}`;
};
/** Moves every box a fixture writes down by `dy` pixels, to stand two fixtures one under the other. */
const shift = (html: string, dy: number) => html.replace(/data-y="(-?[\d.]+),(-?[\d.]+)"/g, (_m, a: string, b: string) => `data-y="${Number(a) + dy},${Number(b) + dy}"`);
const rules = (r: Read) => r.reds.map((x) => `${x.rule}:${x.section}:${x.read}`).join(" | ") || "none";

check("the lib exports lineRuleInPage, the function the gate imports and hands the page", typeof lineRuleInPage === "function");

/* THE FIGURE'S WORDS: 8 UNDER THE FIGURE (WORDS ABOVE), THE NEXT GROUP 24 UNDER THE BLOCK (WORDS BELOW). */
let r = run(card(focalThen(8, 24)));
check(`a figure's words 8 under it and the next group 24 under them pass (${rules(r)}; ${r.lines} line read)`, r.reds.length === 0 && r.lines === 1);
r = run(card(focalThen(24, 24)));
check(`words 24 under the figure: WORDS ABOVE, the figure's own line standing off it (${rules(r)})`, rules(r) === "WORDS ABOVE:#s:24|24");
r = run(card(focalThen(8, 16)));
check(`words at 8 with the next group 16 under them: WORDS BELOW, a distance that is neither the group step nor a foot's (${rules(r)})`, rules(r) === "WORDS BELOW:#s:8|16");
r = run(card(focalThen(8, 12, foot)));
check(`a foot under the words stands 12, and passes there (${rules(r)})`, r.reds.length === 0);
r = run(card(focalThen(8, 24, foot)));
check(`a foot under the words at 24 is WORDS BELOW, which wants 12 (${rules(r)})`, rules(r) === "WORDS BELOW:#s:8|24");
r = run(card(focalThen(8, 12, panel)));
check(`a detail panel under the figure's block stands 12, and passes there (${rules(r)})`, r.reds.length === 0);
r = run(card(focalThen(8, 24, panel)));
check(`a detail panel at 24 is WORDS BELOW, which wants 12 (${rules(r)})`, rules(r) === "WORDS BELOW:#s:8|24");
r = run(card(focalThen(8, 24, rows, true)));
check(`the placement sentence under the words is part of the block: the next group 24 under IT passes, though 44 under the words (${rules(r)})`, r.reds.length === 0);
r = run(card(focalThen(8, 12, rows, true)));
check(`and 12 under the placement is WORDS BELOW, though 32 under the words (${rules(r)})`, rules(r) === "WORDS BELOW:#s:8|12");
r = run(card(`<div>${figure()}${words(38)}</div>${rows(0, 58)}`));
check(`words with the next group beside them (the same vertical range) pass: a row's arrangement gives the distance (${rules(r)})`, r.reds.length === 0);
r = run(card(focalThen(8, null)));
check(`words that are the last thing in the card pass (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div>${words(0)}</div>${rows(44)}`));
check(`words with no figure before them have nothing to stand 8 under, and are read for the group under them (${rules(r)})`, r.reds.length === 0 && r.lines === 1);

/* A BASIS: 24 UNDER THE GROUP ABOVE (BASIS ABOVE), THE NEXT GROUP 24 BELOW IT (BASIS BELOW), A FOOT OR A DETAIL PANEL 12. */
r = run(card(basisThen(24, 24)));
check(`a basis 24 under the group above and 24 over the next group passes (${rules(r)})`, r.reds.length === 0 && r.lines === 1);
r = run(card(basisThen(8, null)));
check(`a basis 8 under the group above is BASIS ABOVE (a figure's own line is 8, a basis is the card's: 24) (${rules(r)})`, rules(r) === "BASIS ABOVE:#s:8|-");
r = run(card(basisThen(24, null)));
check(`a basis that is the last thing in the card passes (${rules(r)})`, r.reds.length === 0);
r = run(card(basisThen(24, 16)));
check(`a basis with the next group 16 under it: BASIS BELOW (${rules(r)})`, rules(r) === "BASIS BELOW:#s:24|16");
r = run(card(basisThen(24, 12, foot)));
check(`a foot under a basis stands 12, and passes there (${rules(r)})`, r.reds.length === 0);
r = run(card(basisThen(24, 4, foot)));
check(`a foot 4 under a basis: BASIS BELOW (${rules(r)})`, rules(r) === "BASIS BELOW:#s:24|4");
r = run(card(basisThen(24, 24, foot)));
check(`a foot 24 under a basis is BASIS BELOW too: the basis to the foot is 12 (${rules(r)})`, rules(r) === "BASIS BELOW:#s:24|24");
r = run(card(basisThen(24, 12, panel)));
check(`a detail panel under a basis stands 12, and passes there (${rules(r)})`, r.reds.length === 0);
r = run(card(basisThen(24, 24, panel)));
check(`a detail panel 24 under a basis: BASIS BELOW (${rules(r)})`, rules(r) === "BASIS BELOW:#s:24|24");
r = run(card(basisThen(24, 12, (top) => `<div><div${at(top, top + 60)}><div data-foot=""${at(top, top + 20)} style="font-size:12px">A foot line</div></div></div>`)));
check(`a group that starts with a foot, inside two wrappers, is the foot (${rules(r)})`, r.reds.length === 0);
r = run(card(basisThen(24, 2, (top) => `<p${at(top, top)}></p>`)));
check(`a neighbour with no height is no group: a basis over an empty paragraph passes (${rules(r)})`, r.reds.length === 0);
r = run(card(basisThen(24, 24, (top) => `<div${at(top - 4, top - 4)}></div>${rows(top)}`)));
check(`an empty block between a basis and its next group is skipped, and the next group is measured (${rules(r)})`, r.reds.length === 0);

/* A BASIS UNDER A FIGURE: WITH A DRAWING UNDER IT, THE FIGURE'S OWN LINE IN THE WRONG FACE (FIGURE ABOVE). */
r = run(card(figureThenBasis(24, 24)));
check(`a basis under a figure with a drawing under it is the figure's own line drawn as a basis: FIGURE ABOVE (${rules(r)})`, rules(r) === "FIGURE ABOVE:#s:24|24");
r = run(card(figureThenBasis(8, 24)));
check(`and 8 under the figure is no cure, the face is the fault: one FIGURE ABOVE, not two reds (${rules(r)})`, rules(r) === "FIGURE ABOVE:#s:8|24");
r = run(card(figureThenBasis(24, null)));
check(`a basis under a figure with nothing under it is the card's basis and keeps its 24 (${rules(r)})`, r.reds.length === 0);
r = run(card(figureThenBasis(8, null)));
check(`a basis 8 under a figure with nothing under it is BASIS ABOVE: only a figure's words stand there (${rules(r)})`, rules(r) === "BASIS ABOVE:#s:8|-");
r = run(card(figureThenBasis(24, 12, foot)));
check(`a basis under a figure with only a foot under it is the card's basis (${rules(r)})`, r.reds.length === 0);
r = run(card(figureThenBasis(24, 12, panel)));
check(`a basis under a figure with only a detail panel under it is the card's basis (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div${at(0, 58)}>${figure()}<p${at(38, 58)} style="font-size:12px">per kWh</p></div>${basis(82)}${rows(122)}`));
check(`a group that ends in a line of words, not in a figure, has no figure above the basis (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div${at(0, 30)}><span${at(0, 30)} style="font-size:30px">$42</span><span${at(12, 30)} style="font-size:12px">/yr</span></div>${basis(54)}${rows(94)}`));
check(`a figure with its unit on the same line is a group that ends in a figure (${rules(r)})`, rules(r) === "FIGURE ABOVE:#s:24|24");
r = run(card(`<div${at(0, 30)}><span${at(0, 30)} style="font-size:29px">$42</span></div>${basis(54)}${rows(94)}`));
check(`a figure under the focal rung (30px) is not a focal figure (${rules(r)})`, r.reds.length === 0);

/* A ROW PASSES PER SIDE ONLY: THE SIDE WHERE THE NEIGHBOUR STANDS IS THE ROW'S ARRANGEMENT AND IS NOT READ; THE OPEN SIDE IS READ FROM THE ROW'S OWN EDGE (Task 2C fix round 1). */
r = run(card(`<div><div>${figure()}${words(38)}</div>${basis(0)}</div>${rows(82)}`));
check(`a two-up head, the figure's block with the basis beside it and the drawing 24 under the taller block (66 under the basis), passes: the open side is measured from the row's far edge (${rules(r)}; ${r.lines} lines read)`, r.reds.length === 0 && r.lines === 2);
r = run(card(`<div><div>${figure()}${words(38)}</div>${basis(0)}</div>${rows(98)}`));
check(`the same head with its drawing 40 under the row is BASIS BELOW: a row excuses the side its neighbour stands on, never the open side (${rules(r)})`, rules(r) === "BASIS BELOW:#s:beside|40");
r = run(card(`<div>${figure()}${words(38)}</div>${basis(82)}${rows(122)}`));
check(`the same head stacked, the basis 24 under the block and the drawing 24 under the basis, passes (${rules(r)})`, r.reds.length === 0);
r = run(card(`${rows(0, 100)}<div><div${at(127, 193)}>${basis(127)}</div><div${at(124, 168)} style="font-size:14px">The plus</div></div>`));
check(`a basis whose cell stands beside the plus, 27 under the group above (24 and 3 of baseline alignment), passes: the group above is measured from the higher of the two, 24 (${rules(r)})`, r.reds.length === 0);
r = run(card(`${rows(0, 100)}<div><div${at(119, 185)}>${basis(119)}</div><div${at(116, 160)} style="font-size:14px">The plus</div></div>`));
check(`the same row 16 under the group above is BASIS ABOVE, 16 from the higher of the two (${rules(r)})`, rules(r) === "BASIS ABOVE:#s:16|beside");
r = run(card(`${rows(0, 100)}${basis(124)}<div${at(124, 168)} style="font-size:14px">The plus</div>`));
check(`a basis with the plus beside it on its right is read from the plus's top: 24 under the group above passes (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div>${figure()}${basis(0)}</div>${rows(54)}`));
check(`a basis beside the figure, with the drawing 24 under the row, reads no FIGURE ABOVE: the row is the arrangement (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div data-focal="1"${at(0, 56)} style="font-size:30px">$42</div>${words(0)}${rows(80)}`));
check(`a figure's words beside the figure (a two-up head): the group under is measured from the taller of the two, 24, and passes (${rules(r)})`, r.reds.length === 0);
r = run(card(`<div data-focal="1"${at(0, 56)} style="font-size:30px">$42</div>${words(0)}${rows(96)}`));
check(`and 40 under the figure is WORDS BELOW, the words' own bottom never the measure (${rules(r)})`, rules(r) === "WORDS BELOW:#s:beside|40");
r = run(card(`<div>${figure()}<div${at(30, 30)}></div>${words(54)}</div>${rows(98)}`));
check(`words 24 under the figure with an empty block between them are still WORDS ABOVE: the figure is the nearest group, the empty block is skipped (${rules(r)})`, rules(r) === "WORDS ABOVE:#s:24|24");
r = run(card(`<div>${figure()}<div${at(30, 30)}></div>${words(38)}</div>${rows(82)}`));
check(`and 8 under the figure past an empty block passes (${rules(r)})`, r.reds.length === 0);

/* AN EMPTY LINE IS 24 OF AIR HOLDING NOTHING. */
r = run(card(`${rows(0, 100)}<p data-basis=""${at(124, 124)}></p>`));
check(`a basis with no text: EMPTY LINE, and nothing else (${rules(r)})`, rules(r) === "EMPTY LINE:#s:24|-");
r = run(card(`${rows(0, 100)}<p data-basis=""${at(124, 124)}>   </p>${foot(124)}`));
check(`a basis of spaces is empty too (${rules(r)})`, rules(r) === "EMPTY LINE:#s:24|0");
r = run(card(`<div>${figure()}<p data-focal-words=""${at(38, 38)}></p></div>${rows(62)}`));
check(`a figure's words with no text: EMPTY LINE (${rules(r)})`, rules(r) === "EMPTY LINE:#s:8|24");

/* WHAT IS READ, AND WHERE. */
r = run(card(`<div${at(0, 100)} style="font-size:14px">Rows of figures and nothing else.</div>`));
check(`a section with no lines reads lines 0, the count the gate reds on, never a pass (${r.lines} read; ${rules(r)})`, r.lines === 0 && r.reds.length === 0);
r = run(`<div style="display:none">${card(basisThen(8, null), "hid")}</div>${card(basisThen(24, null), "shown")}`);
check(`a card the page hides (the twin form) reads no line (${r.lines} read; ${rules(r)})`, r.lines === 1 && r.reds.length === 0);
r = run(card(`<div style="display:none">${basis(0, "A hidden twin.")}</div>${rows(0, 100)}${basis(124)}`));
check(`a line the page hides is not read, and its twin is (${r.lines} read; ${rules(r)})`, r.lines === 1 && r.reds.length === 0);
r = run(`${basis(0)}${card(basisThen(24, null))}`);
check(`a line outside any card is counted as outside, never read (${r.lines} read, ${r.outside} outside)`, r.lines === 1 && r.outside === 1);
r = run(card(focalThen(8, 24) + shift(basisThen(24, 24), 300)));
check(`a card's lines are counted whole: a figure's words and a basis read two lines (${r.lines})`, r.lines === 2);
r = run(card(basisThen(8, null), "first") + card(basisThen(24, 16), "second"));
check(`each red names the card it is in (${rules(r)})`, rules(r) === "BASIS ABOVE:#first:8|- | BASIS BELOW:#second:24|16");
r = run(`<div class="spine-card" id="outer"><div class="spine-card" id="inner">${basisThen(24, 24)}</div></div>`);
check(`a card inside a card is read as its outermost: the section is named by it (${rules(r)}; ${r.lines} read)`, r.lines === 1 && r.reds.length === 0);
r = run(`<div class="spine-card" id="outer"><div class="spine-card" id="inner">${basisThen(8, null)}</div></div>`);
check(`and a red in the inner card names the outer one (${rules(r)})`, rules(r) === "BASIS ABOVE:#outer:8|-");

/* THE TOLERANCE: A DISTANCE IS ROUNDED TO THE PIXEL AND MAY STAND 1PX OFF. */
r = run(card(`<div><div data-focal="1"${at(0, 30)} style="font-size:30px">$42</div><p data-focal-words=""${at(38.4, 58.4)} style="font-size:14px">a year</p></div>${rows(82.85)}`));
check(`subpixel layout never reds: words 8.4 under the figure and 24.45 over the next group pass (${rules(r)})`, r.reds.length === 0);
r = run(card(`${rows(0, 100)}${basis(124.6)}${rows(164.6, 100)}`));
check(`a basis 24.6 under the group above and 24 over the next passes (${rules(r)})`, r.reds.length === 0);
r = run(card(`${rows(0, 100)}${basis(125.4)}${rows(165.4, 100)}`));
check(`a basis 25.4 under the group above, a pixel off the step, passes (${rules(r)})`, r.reds.length === 0);
r = run(card(`${rows(0, 100)}${basis(127)}${rows(167, 100)}`));
check(`a basis 27 under the group above is not a rounding: BASIS ABOVE (${rules(r)})`, rules(r) === "BASIS ABOVE:#s:27|24");
r = run(card(focalThen(8, 26)));
check(`words with the next group 26 under them: WORDS BELOW (${rules(r)})`, rules(r) === "WORDS BELOW:#s:8|26");

/* THE HEADER STATES THE BLIND SPOT AND THE TOLERANCE (CLAUDE.md working rule 2: "this measurement cannot distinguish X from Y"). */
const header = libText.slice(0, libText.indexOf("export function lineRuleInPage"));
check(`the lib's header states what its measurement cannot distinguish, more than once (${(header.match(/cannot distinguish/g) ?? []).length} times)`, (header.match(/cannot distinguish/g) ?? []).length >= 3, LIB, "write each blind spot as a sentence reading `this measurement cannot distinguish X from Y`");
check("the lib's header says the tolerance and what a line is", /TOLERANCE/.test(header) && /A LINE/.test(header), LIB, "say in the header what a line is (the two markers) and the tolerance a distance is read at");

/* THE WIRING the fixtures cannot see. */
const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("the gate guards its browser, reads 1280, 768 and 375, the spine surfaces, and hands the page the in-page function", /await requireBrowser\(/.test(gate) && /\[1280, 768, 375\]/.test(gate) && /\["country", "city", "cell", "industry", "hood", "calculator"\]/.test(gate) && /page\.evaluate\(lineRuleInPage\)/.test(gate), GATE, "call requireBrowser first, read 1280, 768 and 375 over the spine surfaces of scripts/harness/pages.json, and evaluate lineRuleInPage in each page");
check("the gate reds a spine surface the list holds no page of, a missing render, and a render that reads no line at a width", /SPINE\.filter\(\(s\) => !pages\.some\(/.test(gate) && /existsSync\(file\)/.test(gate) && /\.lines === 0/.test(gate), GATE, `red each SPINE surface with no page in the list (naming ${PAGES}), each missing render, and each listed render whose lineRuleInPage reads lines 0`);
check("the gate reds a line that stands outside any card, which the rule could not place", /r\.outside/.test(gate) && /outside\.size/.test(gate), GATE, "red each render whose lineRuleInPage counts lines outside any card, so a line the rule never measured cannot pass");
const chain = stripCommentLines(readFileSync(CHAIN, "utf8").split(/\r?\n/)).join("\n");
check("the gate and its reader are both in the chain's GATES, so neither runs unseen", /\{ name: "line-rule", script: "scripts\/harness\/check_line_rule\.mjs", args: \["--list"\], browser: true \}/.test(chain) && /\{ name: "line-rule-reader", script: "tests\/spine\/line_rule\.test\.ts" \}/.test(chain), CHAIN, 'add { name: "line-rule", script: "scripts/harness/check_line_rule.mjs", args: ["--list"], browser: true } and { name: "line-rule-reader", script: "tests/spine/line_rule.test.ts" } beside fact-once');
const spineNames = (/const SPINE = \[([^\]]*)\]/.exec(gate)?.[1] ?? "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
const harnessPages = (JSON.parse(readFileSync(PAGES, "utf8")) as { pages: Array<{ surface: string }> }).pages;
const unlisted = spineNames.filter((s) => !harnessPages.some((p) => p.surface === s));
check(`every spine surface the gate names (${spineNames.join(", ")}) occurs in ${PAGES}'s pages, so the gate cannot pass having read no render (missing: ${unlisted.join(", ") || "none"})`, spineNames.length > 0 && unlisted.length === 0, PAGES, `add a page of each spine surface the gate reads (${spineNames.join(", ")}) to ${PAGES}`);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/line_rule: all pass");
