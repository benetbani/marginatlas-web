/**
 * TILES ON OPENERS ONLY, READ AS HIS RULE OF 2026-10-13 (plan 2026-10-12 rhythm-air-inside, Task 5; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, section 2.4, and the country spec of 2026-10-13, section 6). His words,
 * reading /gb on a phone: "the icons of the sections cannot be the same as the icons inside the section, they should be bigger and superior with
 * no background." So:
 *   - THE TILE IS GONE. The kit's `Ico` (the 28px circle) is drawn nowhere a spine page draws: not by an opener, not by a row, not by the
 *     answer card's identity seat. Read in the source of every file `scanSpine()` returns (scripts/lib/spine_scan.mjs), comments stripped.
 *   - A SECTION'S OPENER IS ONE BARE GLYPH. Every visible `[data-opener-glyph]` stands in a `[data-rail]` (the kit's Rail, the one opener),
 *     one to a Rail, at 32px and stroke 2 (fix round 1), in terracotta (var(--terra-text)), with no background, border, radius or shadow on it or on anything between it
 *     and its Rail.
 *   - A GLYPH INSIDE A SECTION IS GREY AND NEVER ITS OPENER'S. Every other visible glyph (svg.ma-glyph) in main draws in no terracotta (its own
 *     colour or the nearest one it inherits), carries `spine-ic` or `ma-mono` (so its accent strokes follow its ink, globals.css), sits in no
 *     tile, and its `data-icon` (AtlasIcon stamps it) differs from the opener of the section card (`[data-card]`) it stands in.
 *   - A row draws no glyph at all: FactRows handed an icon draws none.
 * Read on the renders pages-fresh writes for the surfaces whose pages the spine draws with openers (country, city, cell, industry, hood, the
 * calculator) and for the home, whose departments open on no Rail (its contents' marks are read as inner glyphs). Out, as spine_scan's
 * SPINE_OUT names their views: howto and openings (they inherit the Rail's bare glyph, and their inner glyphs are not read here).
 * EMPTY-SCAN REDS: a surface with no page in scripts/harness/pages.json, a missing render, a render whose walk reads no opener (the home: no
 * glyph), and a source scan that reads no file.
 * Each render check is a function, run first on planted fixtures (a red and its passing twin) and then on the real renders.
 *
 * BLIND SPOT, stated: the renders are read statically at 1280 (classes and inline styles, not computed CSS): a tile painted by a stylesheet
 * rule, a colour set by a selector, or a glyph shown only at another width is not read; a glyph drawn by something other than an svg with
 * `ma-glyph` (an img, a pictogram's own id, which carries no `data-icon`) is not compared with its opener; a section is its nearest
 * `[data-card]`, so a glyph standing outside every card is compared with no opener.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/tiles_openers.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { Rail } from "../../src/components/spine/kit";
import { visibleHere } from "../../scripts/lib/type_floor.mjs";
import { scanSpine } from "../../scripts/lib/spine_scan.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "tiles-openers";
const REMEDY = "a section opens on one bare 32px terracotta glyph in its Rail; nothing draws the kit's Ico tile; a glyph inside a section is grey and never its opener's";
const KIT = "src/components/spine/kit.tsx";
let failed = 0;
const check = (label: string, ok: boolean, file = KIT, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* ---------- the checks, as functions ---------- */

/** The lines of a source text that draw the kit's Ico, comments stripped (1-based). */
const icoLines = (text: string) => stripCommentLines(text.split(/\r?\n/)).flatMap((l, i) => (/<Ico\b/.test(l) ? [i + 1] : []));

const docOf = (html: string) => new JSDOM(html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
const shown = (doc: Document, el: Element) => { const t = doc.createTextNode("x"); el.appendChild(t); const v = visibleHere(t); t.remove(); return v; };
const classes = (el: Element) => (el.getAttribute("class") || "").split(/\s+/).filter(Boolean);
/** A utility with its variants cut off (`md:bg-x` reads `bg-x`); a colon inside brackets belongs to the utility. */
const util = (c: string) => { let d = 0; let cut = -1; for (let i = 0; i < c.length; i++) { if (c[i] === "[") d++; else if (c[i] === "]") d--; else if (c[i] === ":" && d === 0) cut = i; } return cut === -1 ? c : c.slice(cut + 1); };
const TILE_CLASS = /^(bg-|border(-|$)|rounded|shadow|ring(-|$))/;
const TILE_STYLE = /(^|;)\s*(background|border|box-shadow)/i;
const tiled = (el: Element) => classes(el).map(util).some((u) => TILE_CLASS.test(u) && !/^border-(collapse|separate|spacing)/.test(u)) || TILE_STYLE.test(el.getAttribute("style") || "");
/** The colour an element draws in: its own, else the nearest ancestor's (inline color, or a text-colour utility); null when none is set. */
const COLOUR_CLASS = /^text-(\[(?!length:)[^\]]+\]|(atlas|terra|ink|stone|gray|neutral|zinc|slate|red|orange|white|black)(-\d+)?)$/;
function colourOf(el: Element | null): string | null {
  for (let e = el; e; e = e.parentElement) {
    const m = /(?:^|;)\s*color\s*:\s*([^;]+)/i.exec(e.getAttribute("style") || "");
    if (m) return m[1].trim();
    const c = classes(e).map(util).filter((u) => COLOUR_CLASS.test(u)).pop();
    if (c) return c;
  }
  return null;
}
const TERRA = /terra|atlas|orange|red-/;

type Read = { reds: string[]; openers: number; inner: number };
/** One render: the opener glyphs and every other glyph in main. */
function readPage(html: string): Read {
  const doc = docOf(html);
  const reds: string[] = [];
  const main = doc.querySelector("main");
  if (!main) return { reds: ["no main"], openers: 0, inner: 0 };
  const glyphs = [...main.querySelectorAll("svg.ma-glyph, [data-opener-glyph]")].filter((g) => shown(doc, g));
  const openers = glyphs.filter((g) => g.hasAttribute("data-opener-glyph"));
  const where = (g: Element) => `${g.getAttribute("data-icon") ?? "?"} in #${g.closest("[id]")?.id ?? "-"}`;
  for (const g of openers) {
    const rail = g.closest("[data-rail]");
    if (!rail) { reds.push(`OPENER OUTSIDE A RAIL: ${where(g)}`); continue; }
    if (rail.querySelectorAll("[data-opener-glyph]").length !== 1) reds.push(`RAIL WITH ${rail.querySelectorAll("[data-opener-glyph]").length} OPENER GLYPHS: ${where(g)}`);
    if (g.getAttribute("width") !== "32" || g.getAttribute("height") !== "32") reds.push(`OPENER NOT 32px (${g.getAttribute("width")}): ${where(g)}`);
    if (g.getAttribute("stroke-width") !== "2") reds.push(`OPENER STROKE NOT 2 (${g.getAttribute("stroke-width")}): ${where(g)}`);
    const col = colourOf(g);
    if (!col || !/terra-text/.test(col)) reds.push(`OPENER NOT TERRACOTTA (${col}): ${where(g)}`);
    for (let e: Element | null = g; e && e !== rail.parentElement; e = e.parentElement) if (tiled(e)) { reds.push(`OPENER ON A TILE (${e.tagName.toLowerCase()} "${e.getAttribute("class") ?? ""}" ${e.getAttribute("style") ?? ""}): ${where(g)}`); break; }
  }
  const inner = glyphs.filter((g) => !g.hasAttribute("data-opener-glyph"));
  for (const g of inner) {
    const col = colourOf(g);
    if (col && TERRA.test(col)) reds.push(`INNER GLYPH IN TERRACOTTA (${col}): ${where(g)}`);
    if (!classes(g).some((c) => c === "spine-ic" || c === "ma-mono")) reds.push(`INNER GLYPH'S ACCENT NOT ITS INK (no spine-ic or ma-mono): ${where(g)}`);
    if (g.parentElement && tiled(g.parentElement)) reds.push(`INNER GLYPH ON A TILE: ${where(g)}`);
    const card = g.closest("[data-card]");
    const own = card ? [...card.querySelectorAll("[data-opener-glyph]")].find((o) => o.closest("[data-card]") === card) : undefined;
    const id = g.getAttribute("data-icon");
    if (own && id && own.getAttribute("data-icon") === id) reds.push(`INNER GLYPH REPEATS ITS OPENER'S: ${where(g)}`);
  }
  return { reds, openers: openers.length, inner: inner.length };
}

/* ---------- fixtures: each red and its passing twin ---------- */
const OPEN = (attrs = 'width="32" height="32" stroke-width="2" style="color:var(--terra-text)"', wrap = "", icon = "margin") =>
  `<div data-rail=""><div class="grid grid-cols-[32px_minmax(0,1fr)] gap-x-1"><span${wrap}><svg class="ma-glyph spine-ic" data-opener-glyph="" data-icon="${icon}" ${attrs}></svg></span><h3 data-rail-title="">T</h3></div></div>`;
const INNER = (style = "color:var(--c-ink2)", cls = "ma-glyph spine-ic", icon = "bank", parent = "") => `<span${parent}><svg class="${cls}" data-icon="${icon}" width="16" height="16" style="${style}"></svg></span>`;
const page = (...parts: string[]) => `<html><body><main><div data-card="" id="s">${parts.join("")}</div></main></body></html>`;
const FIX: { label: string; html: string; red: RegExp | null }[] = [
  { label: "a bare 32px terracotta opener and a grey inner glyph (the twin)", html: page(OPEN(), INNER()), red: null },
  { label: "an opener outside a Rail", html: page(`<svg class="ma-glyph spine-ic" data-opener-glyph="" data-icon="margin" width="32" height="32" stroke-width="2" style="color:var(--terra-text)"></svg>`), red: /OPENER OUTSIDE A RAIL/ },
  { label: "an opener at 18px", html: page(OPEN('width="18" height="18" stroke-width="2" style="color:var(--terra-text)"')), red: /OPENER NOT 32px/ },
  { label: "an opener at the family's 1.6 stroke (fix round 1 rules 2)", html: page(OPEN('width="32" height="32" stroke-width="1.6" style="color:var(--terra-text)"')), red: /OPENER STROKE NOT 2/ },
  { label: "an opener in grey", html: page(OPEN('width="32" height="32" stroke-width="2" style="color:var(--c-ink2)"')), red: /OPENER NOT TERRACOTTA/ },
  { label: "an opener on a tile (a background on its wrapper)", html: page(OPEN(undefined, ' class="rounded-full border" style="background:var(--terra-soft)"')), red: /OPENER ON A TILE/ },
  { label: "a Rail with two opener glyphs", html: page(`<div data-rail="">${["margin", "bank"].map((i) => `<svg class="ma-glyph spine-ic" data-opener-glyph="" data-icon="${i}" width="32" height="32" stroke-width="2" style="color:var(--terra-text)"></svg>`).join("")}</div>`), red: /RAIL WITH 2 OPENER GLYPHS/ },
  { label: "an inner glyph in terracotta (inherited from its wrapper)", html: page(OPEN(), `<span class="text-[var(--terra-text)]">${INNER("")}</span>`), red: /INNER GLYPH IN TERRACOTTA/ },
  { label: "an inner glyph whose accent keeps the terracotta (no spine-ic, no ma-mono)", html: page(OPEN(), INNER(undefined, "ma-glyph")), red: /ACCENT NOT ITS INK/ },
  { label: "an inner glyph on a tile", html: page(OPEN(), INNER(undefined, undefined, undefined, ' class="rounded-full border" style="background:var(--c-soft)"')), red: /INNER GLYPH ON A TILE/ },
  { label: "an inner glyph repeating its opener's id", html: page(OPEN(), INNER(undefined, undefined, "margin")), red: /REPEATS ITS OPENER/ },
  { label: "a hidden tile is not read", html: page(OPEN(), `<div class="hidden">${INNER(undefined, undefined, undefined, ' style="background:var(--c-soft)"')}</div>`), red: null },
];
for (const f of FIX) {
  const r = readPage(f.html);
  check(`fixture: ${f.label} ${f.red ? "reds" : "passes"}${r.reds.length ? ` (${r.reds.join("; ")})` : ""}`, f.red ? r.reds.some((x) => f.red!.test(x)) : r.reds.length === 0, "tests/spine/tiles_openers.test.ts");
}
check("fixture: a source line drawing <Ico reds and the same words in a comment do not", icoLines(`const a = 1;\n  {x ? <Ico id="bank" /> : null}`).join() === "2" && icoLines(`/* <Ico id="bank" />\n   still a comment <Ico */\n// <Ico id="x" />`).length === 0, "tests/spine/tiles_openers.test.ts");

/* ---------- the source: no Ico anywhere the spine draws ---------- */
const scan = scanSpine();
check(`the spine's scan set holds files to read (${scan.files.length}) and its guard finds nothing (${scan.findings.length})`, scan.files.length > 0 && scan.findings.length === 0, "scripts/lib/spine_scan.mjs", "fix the scan set named by spacing-pin's guard");
const drawn = scan.files.flatMap((f: string) => icoLines(readFileSync(f, "utf8")).map((n) => `${f}:${n}`));
check(`the kit's Ico tile is drawn nowhere a spine page draws (${drawn.length}${drawn.length ? `: ${drawn.join(", ")}` : ""})`, drawn.length === 0, drawn[0]?.split(":")[0] ?? KIT);

/* ---------- the components ---------- */
const rows = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "a", icon: "filings", label: "Registered", value: "1" }] }));
check("a fact row given an icon draws no glyph", !/<svg/.test(rows), "src/components/spine/archetypes/FactRows.tsx");
const rail = readPage(`<html><body><main><div data-card="">${renderToStaticMarkup(React.createElement(Rail, { icon: "taxes", kicker: "Tax, rule by rule" }))}</div></main></body></html>`);
check(`the kit's Rail draws one bare 32px terracotta glyph (${rail.openers} opener${rail.reds.length ? `; ${rail.reds.join("; ")}` : ""})`, rail.openers === 1 && rail.inner === 0 && rail.reds.length === 0);
const bare = renderToStaticMarkup(React.createElement(Rail, { kicker: "No icon" }));
check("a Rail with no icon draws no glyph", !/<svg/.test(bare));

/* ---------- the renders ---------- */
const WITH_OPENERS = ["country", "city", "cell", "industry", "hood", "calculator"];
const GLYPHS_ONLY = ["home"];
const all = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as { surface: string; slugs: string[] }[];
for (const s of [...WITH_OPENERS, ...GLYPHS_ONLY]) check(`surface ${s}: ${all.filter((p) => p.surface === s).length} page(s) in scripts/harness/pages.json`, all.some((p) => p.surface === s), "scripts/harness/pages.json", "give the surface a page to render");
for (const p of all.filter((x) => WITH_OPENERS.includes(x.surface) || GLYPHS_ONLY.includes(x.surface))) {
  const name = `${p.surface}-${p.slugs.join("-")}`;
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read`, false, file, "run the pages-fresh gate"); continue; }
  const r = readPage(readFileSync(file, "utf8"));
  const read = GLYPHS_ONLY.includes(p.surface) ? r.inner > 0 : r.openers > 0;
  check(`${name}: ${r.openers} opener glyph(s), ${r.inner} inner glyph(s)${read ? "" : ", NOTHING READ"}${r.reds.length ? `; ${r.reds.length} red(s): ${r.reds.slice(0, 8).join("; ")}${r.reds.length > 8 ? "; ..." : ""}` : ""}`, read && r.reds.length === 0, file);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/tiles_openers: all pass");
