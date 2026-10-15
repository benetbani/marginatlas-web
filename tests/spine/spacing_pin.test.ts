/**
 * THE SPACING PIN (plan 2026-10-12 rhythm-air-inside, Task 1C; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, sections 2.1
 * and 3 item 3): inside an open section the title stands 24 above its first content, one group 24 from the next, a fact row 16 above and below, a
 * focal figure 8 above its own line. Read from the kit's shared pieces as they render (Rail, Focal, Basis, FactRows), and the spine read for a page
 * that sets its own: a hand-rolled section opener, focal block or basis line. The spine read is scripts/lib/spine_scan.mjs's: every .tsx under
 * src/components/spine but what it names out with its reason, and its guard is checked here, so no entry goes unread without a word; the guard's red
 * paths (a stale, mis-slashed, outside or reasonless name, an unnamed file at the root, a folder the walk drops) are run at the end of this file on a temp tree.
 * BLIND SPOT, stated: Tailwind classes as written, at their 4px step; a margin that doubles beside a flex sibling, and a distance an archetype sets
 * inside its own layout, are measured on the renders (the plan's scratchpad/rhythm/gaps.mjs), not here.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/spacing_pin.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import * as kit from "../../src/components/spine/kit";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { scanSpine } from "../../scripts/lib/spine_scan.mjs";
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
/* THE 4 UNDER THE TILE BELONGED TO THE TILE (plan 2026-10-12 rhythm-air-inside, Task 4, the German running costs' hole), AND THE TILE IS GONE (Task 5,
   tiles on openers only; this pin follows that ruled change, it is not a raised baseline): no row draws a tile, so every row, one handed an icon or a
   swatch included, stands its label and its figure on the row's padding without the 4; the swatch's own mt-1 sits it on the label's first line. */
const bareRow = rows.slice(rows.indexOf('data-row="a"'), rows.indexOf('data-row="b"'));
const tiledRow = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "t", label: "Tiled", value: "1", icon: "wages" }, { key: "s", label: "Swatched", value: "2", swatch: "#999999" }] }));
check("a fact row without a tile or a swatch stands its label and its figure without the 4 under the tile (no pt-1)", /data-label="true" class="block text-/.test(bareRow) && /<span class="fig block text-/.test(bareRow), FACT);
check("a fact row handed an icon or a swatch stands its label and its figure on the row's padding too (no pt-1; no tile since Task 5)", (tiledRow.match(/data-label="true" class="block text-/g) ?? []).length === 2 && (tiledRow.match(/<span class="fig block text-/g) ?? []).length === 2 && !/\bpt-1\b/.test(tiledRow), FACT);

/* NO PAGE SETS ITS OWN: the spine the pages draw, comments stripped. THE SCAN SET IS ONE HELPER'S (fix round 1 of this task's review): the pin had walked nine
   folders it was handed by name, so home/, openings/, a new folder and every file at the root went unread and the test printed PASS about source it had not
   opened. scripts/lib/spine_scan.mjs returns every .tsx under src/components/spine but what it names out by path with its reason, and its guard reds on any
   entry neither read nor named, which is checked here; the guard's own red paths are run on a temp tree at the end of this file. */
const scan = scanSpine();
if (scan.findings.length === 0) console.log(`PASS  every entry under src/components/spine is read or named out with its reason (${scan.files.length} .tsx read, ${scan.outFiles.length} named out)`);
for (const f of scan.findings) { failed++; red({ rule: RULE, file: f.entry, detail: `the scan set: ${f.detail}`, remedy: f.remedy }); }
/* THE KIT'S OWN FILE IS NOT READ FOR A HAND-ROLL (ruled at the second review of this task: the exclusion stands). The kit's own pieces define the very patterns these three
   scans look for: its Rail (the opener row, `mb-2 flex items-center gap-2` until Task 2A), its Head (the same row; Head is drawn only by the /dev pages) and, from Task 2B,
   its Focal (the `data-focal="1"` block). Read, the kit would red the pin on the definitions themselves, which no page could fix, so the pin could never pass; the three
   checks read "outside the kit". The helper still returns the kit: a test that reads the kit for another reason (the type floor's sizes) takes it from `scan.files`. */
const files = scan.files.filter((f) => f !== KIT);
const hits = (re: RegExp) => files.flatMap((f) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/)).map((l, i) => (re.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
const list = (h: string[]) => `${h.length}${h.length ? `: ${h.slice(0, 10).join(", ")}${h.length > 10 ? ", ..." : ""}` : ""}`;
const openers = hits(/className="mb-2 flex items-center gap-2"/);
check(`no section opener is hand-rolled outside the kit's Rail (${list(openers)})`, openers.length === 0, openers[0]?.split(":")[0] ?? KIT, "draw a section's title with the kit's Rail (icon, kicker, gloss, sample): its 24 and its title rung come with it");
const focals = hits(/data-focal="1"/).filter((h) => !h.startsWith("src/components/spine/archetypes/RankedBars.tsx:"));
check(`no focal block is hand-rolled outside the kit's Focal (${list(focals)}; RankedBars' slot is its own: its figure stands beside its basis from 560px of card)`, focals.length === 0, focals[0]?.split(":")[0] ?? KIT, "draw a section's figure and its words with the kit's Focal");
const bases = hits(/<p\b[^>]*--c-muted[^>]*>\{[^{}]*basis\}<\/p>/i);
check(`no basis line is hand-rolled outside the kit's Basis (${list(bases)})`, bases.length === 0, bases[0]?.split(":")[0] ?? KIT, "print a section's basis with the kit's Basis, `beside` where it stands beside another group");

/* THE GUARD'S RED PATHS, RUN HERE (fix round 2 of this task's review: "no committed test runs the guard's red paths", so with the guard deleted the pin still printed PASS, and a
   walk that dropped a folder passed with a smaller count). A spine in miniature is built in the OS temp folder, never under src/, and removed after, as
   tests/routing/edge_not_found.test.ts builds its trees; scanSpine runs on it with a crafted `out` and, for the walk's own fault, an injected `skipDir`, and each red must be
   raised on the entry it names. The one red no tree reaches is "the walk returned a file the second listing does not hold": it needs the two enumerations to disagree, as on a
   runtime whose recursive listing is partial. */
const SCAN_LIB = "scripts/lib/spine_scan.mjs";
const SCAN_REMEDY = "keep the guard's red in scripts/lib/spine_scan.mjs: it must name a stale, mis-slashed, outside or reasonless name, an unnamed file at the root and a folder its walk drops, and stay silent on a clean tree";
type Found = { entry: string; detail: string };
const withTree = (then: (root: string) => void): void => {
  const tmp = mkdtempSync(join(tmpdir(), "spine-scan-"));
  try {
    const root = tmp.replace(/\\/g, "/");
    for (const rel of ["a.tsx", "out.tsx", "notes.ts", "sub/b.tsx", "sub/data.ts", "outdir/c.tsx"]) { mkdirSync(dirname(`${root}/${rel}`), { recursive: true }); writeFileSync(`${root}/${rel}`, "export const x = 1;\n"); }
    mkdirSync(`${root}/empty`);
    then(root);
  } finally {
    try { rmSync(tmp, { recursive: true, force: true }); } catch { /* a temporary folder left behind is the system's to clear */ }
  }
};
withTree((root) => {
  const rel = (p: string) => (p.startsWith(`${root}/`) ? p.slice(root.length + 1) : p);
  const say = (f: Found[]) => f.map((x) => `${rel(x.entry)}: ${x.detail.split(root).join("<tree>")}`).join(" | ") || "none";
  const one = (f: Found[], entry: string, detail: RegExp) => f.length === 1 && f[0].entry === entry && detail.test(f[0].detail);
  const outOf = (edit: (m: Map<string, string>) => void = () => undefined) => { const m = new Map<string, string>([[`${root}/outdir/`, "a folder named out"], [`${root}/out.tsx`, "a file named out"], [`${root}/notes.ts`, "a root helper with no markup"]]); edit(m); return m; };
  /* a throw is a red of its own, not a crash: the guard's job is to say what is wrong */
  const tryScan = (opts: Parameters<typeof scanSpine>[0]) => { try { return scanSpine(opts); } catch (e) { return { files: [] as string[], outFiles: [] as string[], findings: [{ entry: "(threw)", detail: (e as Error).message, remedy: "" }] }; } };
  const finds = (out: Map<string, string>) => tryScan({ root, out }).findings;

  const clean = tryScan({ root, out: outOf() });
  check(`a clean tree has no finding: its components are read, its named folder and files left out, its nested .ts and empty folder let be (findings ${say(clean.findings)}; read ${clean.files.map(rel).join(", ")}; named out ${clean.outFiles.map(rel).join(", ")})`, clean.findings.length === 0 && clean.files.map(rel).join() === "a.tsx,sub/b.tsx" && clean.outFiles.map(rel).join() === "out.tsx,outdir/c.tsx", SCAN_LIB, SCAN_REMEDY);
  const staleFile = finds(outOf((m) => m.set(`${root}/gone.tsx`, "gone")));
  const staleFolder = finds(outOf((m) => m.set(`${root}/gone/`, "gone")));
  check(`a stale name reds, a file and a folder named out that are not there (${say(staleFile)}; ${say(staleFolder)})`, one(staleFile, `${root}/gone.tsx`, /no such file/) && one(staleFolder, `${root}/gone/`, /no such folder/), SCAN_LIB, SCAN_REMEDY);
  const noSlash = finds(outOf((m) => { m.delete(`${root}/outdir/`); m.set(`${root}/outdir`, "a folder"); }));
  const slash = finds(outOf((m) => { m.delete(`${root}/out.tsx`); m.set(`${root}/out.tsx/`, "a file"); }));
  check(`a wrong slash reds, a folder named without its slash and a file named with one (${say(noSlash)}; ${say(slash)})`, one(noSlash, `${root}/outdir`, /without its trailing slash/) && one(slash, `${root}/out.tsx/`, /file named with a trailing slash/), SCAN_LIB, SCAN_REMEDY);
  const outside = finds(outOf((m) => m.set("elsewhere/x.tsx", "not under the spine")));
  check(`a name outside the spine's folder reds (${say(outside)})`, one(outside, "elsewhere/x.tsx", /lies outside/), SCAN_LIB, SCAN_REMEDY);
  const emptyReason = finds(outOf((m) => m.set(`${root}/out.tsx`, "")));
  const blankReason = finds(outOf((m) => m.set(`${root}/out.tsx`, "   ")));
  check(`a name with no reason reds, an empty one and one of spaces (${say(emptyReason)}; ${say(blankReason)})`, one(emptyReason, `${root}/out.tsx`, /no reason/) && one(blankReason, `${root}/out.tsx`, /no reason/), SCAN_LIB, SCAN_REMEDY);
  const rootTs = finds(outOf((m) => m.delete(`${root}/notes.ts`)));
  check(`a file at the root that is not a .tsx reds until it is named out (${say(rootTs)})`, one(rootTs, `${root}/notes.ts`, /not a \.tsx/), SCAN_LIB, SCAN_REMEDY);
  const keep = outOf();
  const dropped = tryScan({ root, out: keep, skipDir: (p: string) => p.split("/").pop() === "sub" || keep.has(`${p}/`) });
  check(`a folder the walk drops by its bare name reds, and so does each .tsx in it, though nothing names them out (${say(dropped.findings)}; read ${dropped.files.map(rel).join(", ")})`, dropped.findings.length === 2 && dropped.findings[0].entry === `${root}/sub` && /neither walked nor named out/.test(dropped.findings[0].detail) && dropped.findings[1].entry === `${root}/sub/b.tsx` && /neither read nor named out/.test(dropped.findings[1].detail), SCAN_LIB, SCAN_REMEDY);
  const nowhere = tryScan({ root: `${root}/nope`, out: new Map() });
  check(`a root that is not there reds once and reads nothing (${say(nowhere.findings)}; read ${nowhere.files.length})`, nowhere.files.length === 0 && one(nowhere.findings, `${root}/nope`, /not there/), SCAN_LIB, SCAN_REMEDY);
});

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/spacing_pin: all pass");
