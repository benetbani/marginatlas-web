/**
 * THE SPACING PIN (plan 2026-10-12 rhythm-air-inside, Task 1C; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, sections 2.1
 * and 3 item 3): inside an open section the title stands 24 above its first content, one group 24 from the next, a fact row 16 above and below, a
 * focal figure 8 above its own line. Read from the kit's shared pieces as they render (Rail, Focal, Basis, FactRows), and the spine read for a page
 * that sets its own: a hand-rolled section opener, focal block or basis line.
 * BLIND SPOT, stated: Tailwind classes as written, at their 4px step; a margin that doubles beside a flex sibling, and a distance an archetype sets
 * inside its own layout, are measured on the renders (the plan's scratchpad/rhythm/gaps.mjs), not here.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/spacing_pin.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import * as kit from "../../src/components/spine/kit";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "spacing-pin";
const KIT = "src/components/spine/kit.tsx";
const FACT = "src/components/spine/archetypes/FactRows.tsx";
const REMEDY = "take the in-section distances from the kit's pieces: Rail (its title 24 above the first content), Focal (24 to the next group, its line 8 under the figure), Basis (24 above), FactRows (16 above and below a row); a page sets none of its own";
let failed = 0;
const check = (label: string, ok: boolean, file = KIT, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/** The pixels a Tailwind spacing class sets on the 4px step: `mb-6` is 24, `py-4` 16; none is 0. */
const step = (cls: string, util: string): number => { const m = new RegExp(`(?:^|\\s)${util}-(\\d+(?:\\.5)?)(?=\\s|$)`).exec(cls); return m ? Number(m[1]) * 4 : 0; };
const classOf = (html: string, re: RegExp): string => re.exec(html)?.[1] ?? "";

/* THE HEAD. */
const rail = renderToStaticMarkup(React.createElement(kit.Rail, { icon: "taxes", kicker: "Tax" }));
const railWrap = classOf(rail, /^<div class="([^"]*)" data-rail="">/);
const railRow = classOf(rail, /data-rail=""><div class="([^"]*)">/);
check(`a section's title stands 24 above its first content, one margin on the Rail's wrapper (wrapper ${step(railWrap, "mb")}, title row ${step(railRow, "mb")})`, step(railWrap, "mb") === 24 && step(railRow, "mb") === 0);

/* THE GROUPS AND THE FOCAL LINE. */
const K = kit as unknown as Record<string, unknown>;
check("the kit exports Focal, the focal block (moved from src/components/spine/country/focal.tsx)", typeof K.Focal === "function");
check("the kit exports Basis, the basis line", typeof K.Basis === "function");
if (typeof K.Focal === "function") {
  const Focal = K.Focal as React.FC<Record<string, unknown>>;
  const f = renderToStaticMarkup(React.createElement(Focal, { figure: "$1", words: "the words" }));
  const wrap = classOf(f, /^<div class="([^"]*)"><div data-focal="1"/);
  const words = classOf(f, /<p data-focal-words="" class="([^"]*)">/);
  check(`the focal block stands 24 above the next group (${step(wrap, "mb")}) and its words 8 under the figure (${step(words, "mt")})`, step(wrap, "mb") === 24 && step(words, "mt") === 8);
  check("a focal block beside another group takes no margin of its own", /^<div><div data-focal="1"/.test(renderToStaticMarkup(React.createElement(Focal, { figure: "$1", words: "w", beside: true }))));
  check("the figure keeps the attribute order the home's tests and verify_interact read (data-focal, aria-live when live, class, data-src)", /^<div class="mb-6"><div data-focal="1" aria-live="polite" class="fig text-\[length:var\(--t-focal\)\] leading-none text-\[var\(--c-ink\)\]" data-src="x" data-kind="counted">\$1<\/div><p data-focal-words=""/.test(renderToStaticMarkup(React.createElement(Focal, { figure: "$1", words: "w", live: true, prov: { src: "x", kind: "counted" } }))));
}
if (typeof K.Basis === "function") {
  const Basis = K.Basis as React.FC<Record<string, unknown>>;
  const b = classOf(renderToStaticMarkup(React.createElement(Basis, null, "What is measured.")), /^<p data-basis="" class="([^"]*)">/);
  const beside = classOf(renderToStaticMarkup(React.createElement(Basis, { beside: true }, "x")), /^<p data-basis="" class="([^"]*)">/);
  check(`the basis line stands 24 under the group above it (${step(b, "mt")}), and none beside another group (${step(beside, "mt")})`, step(b, "mt") === 24 && step(beside, "mt") === 0);
}

/* THE ROWS. */
const rows = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "a", label: "One", value: "1" }, { key: "b", label: "Two", value: "2" }] }));
const rowCls = [...rows.matchAll(/data-row="[ab]" class="([^"]*)"/g)].map((m) => m[1]);
check(`a fact row stands 16 above and below its words (${rowCls.map((c) => step(c, "py")).join(", ")})`, rowCls.length === 2 && rowCls.every((c) => step(c, "py") === 16), FACT);

/* NO PAGE SETS ITS OWN: the spine the pages draw, comments stripped. */
const SCOPE = ["archetypes", "sections", "cell", "city", "country", "industry", "hood", "interact", "charts"].map((d) => `src/components/spine/${d}`);
const SKIP = new Set(["src/components/spine/archetypes/stories.tsx", "src/components/spine/country/how-to-view.tsx"]);
const files: string[] = [];
const walk = (d: string) => { for (const e of readdirSync(d)) { const p = join(d, e).replace(/\\/g, "/"); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(p) && !SKIP.has(p)) files.push(p); } };
SCOPE.forEach(walk);
const hits = (re: RegExp) => files.flatMap((f) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/)).map((l, i) => (re.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
const list = (h: string[]) => `${h.length}${h.length ? `: ${h.slice(0, 10).join(", ")}${h.length > 10 ? ", ..." : ""}` : ""}`;
const openers = hits(/className="mb-2 flex items-center gap-2"/);
check(`no section opener is hand-rolled outside the kit's Rail (${list(openers)})`, openers.length === 0, openers[0]?.split(":")[0] ?? KIT, "draw a section's title with the kit's Rail (icon, kicker, gloss, sample): its 24 and its title rung come with it");
const focals = hits(/data-focal="1"/).filter((h) => !h.startsWith("src/components/spine/archetypes/RankedBars.tsx:"));
check(`no focal block is hand-rolled outside the kit's Focal (${list(focals)}; RankedBars' slot is its own: its figure stands beside its basis from 560px of card)`, focals.length === 0, focals[0]?.split(":")[0] ?? KIT, "draw a section's figure and its words with the kit's Focal");
const bases = hits(/<p\b[^>]*--c-muted[^>]*>\{[^{}]*basis\}<\/p>/i);
check(`no basis line is hand-rolled outside the kit's Basis (${list(bases)})`, bases.length === 0, bases[0]?.split(":")[0] ?? KIT, "print a section's basis with the kit's Basis, `beside` where it stands beside another group");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/spacing_pin: all pass");
