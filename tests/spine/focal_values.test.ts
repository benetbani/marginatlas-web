/**
 * A DRAWING'S FOCAL MARK PRINTS ITS VALUE, SMALL, AS ITS NEIGHBOURS DO (critique pass 2, fix round C2, item P1.5; the controller's
 * decision on the critique's Q2, YES): the mark a section's figure belongs to used to print no value of its own ("the figure says it"),
 * and a reader scanning the drawing met a gap where every other mark has a number. /gb's chapter 04 held two: the Tax row of "What
 * holds firms back", the longest bar and the only one with nothing beside it, drawn in a gradient no other bar has; and year 5 of
 * "Who is still trading", the terracotta dot, the only point with no share. The section's figure stays the large one above the
 * drawing; the label on the drawing is the drawing's key, not a second statement of the figure (the home strip's typical and the
 * London trade page's strip print theirs already: tests/spine/home_forms.test.ts, tests/home/home_answers.test.ts).
 *
 * Holds, on the components and on /gb's render where the harness wrote it:
 *  - Obstacles (src/components/spine/sections/Obstacles.tsx): in the column form every column's share stands over its bar, the
 *    longest included, with room above the plot for it; in the row form every row prints its share, the top row included; the top's
 *    bar is flat --terra in both forms, with no gradient (the others are grey);
 *  - SurvivalCurve (src/components/spine/interact/SurvivalCurve.tsx): every point prints its share, the last (the terracotta dot)
 *    too, pinned inside the plot's right edge, and since critique pass 3, fix round D2, item P2.8 the start too (the whole cohort,
 *    the curve's own first point, never a typed "100%"), pinned inside the plot's left edge; and every one of those labels carries
 *    data-src and data-kind (fix round F1, group G2, the final review's M2), the stamp its builder gave the point (the start's, which
 *    is no share the file holds, worked out from the file's cohort), as Obstacles' labels carry theirs;
 *  - the source carries no guard that takes a mark's label away (`o === top ? null`, `!isLast`, a label behind `i > 0`);
 *  - /gb's render draws all of it in chapter 04.
 * BLIND SPOT: the source guards are read as text, so a label taken away by another route (a class that hides it) is seen only on the
 * render's markup, which counts the label elements and never measures that they are visible: the browser gates (page laws, holes,
 * readability) see what the render draws.
 *
 * Run: npx tsx tests/spine/focal_values.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { Obstacles } from "../../src/components/spine/sections/Obstacles";
import { FirstYears } from "../../src/components/spine/sections/FirstYears";
import { SurvivalCurve } from "../../src/components/spine/interact/SurvivalCurve";
import { buildObstacles, buildSurvival } from "../../src/lib/spine/sections/first_years";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "focal-values";
const OBSTACLES = "src/components/spine/sections/Obstacles.tsx";
const CURVE = "src/components/spine/interact/SurvivalCurve.tsx";
const REMEDY = "print the focal mark's value on the drawing as its neighbours print theirs: Obstacles' top column and top row take their share (the top bar flat --terra), SurvivalCurve labels the start and the last point; the section's figure stays the large one above";
const STAMP_REMEDY = "stamp every point label of SurvivalCurve from the builder, as Obstacles' labels are: buildSurvival (src/lib/spine/sections/first_years.ts) gives each point (and `start`, the whole cohort at year 0, beside them) a prov under sections/survival.json, FirstYears passes start in, and the label spreads provAttrs of its point";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? OBSTACLES, detail: label, remedy: at?.remedy ?? REMEDY }); };

const obs = buildObstacles("GB");
const sv = buildSurvival("GB");
check("the UK's obstacles and survival build", !!obs && !!sv, { file: "src/lib/spine/sections/first_years.ts", remedy: "keep data/sections/survival.json's GB entry whole" });

if (obs) {
  const html = renderToStaticMarkup(React.createElement(Obstacles, { data: obs }));
  const top = obs.items.reduce((a, b) => (b.pct > a.pct ? b : a));
  /* THE COLUMN FORM: each column holds its share as a mark label (text "NN%") over its bar. */
  const cols = [...html.matchAll(/<div data-col="([^"]+)"[^>]*>([\s\S]*?)<\/div>/g)].map((m) => ({ key: m[1], body: m[2] }));
  const shareOf = (k: string) => obs.items.find((i) => i.key === k)?.pct;
  const labelled = cols.filter((c) => new RegExp(`<span data-mark-label="true"[^>]*>${shareOf(c.key)}%</span>`).test(c.body));
  check(`every obstacle's column prints its share over its bar, the longest (${top.label}, ${top.pct}%) included (${labelled.length} of ${obs.items.length})`, cols.length === obs.items.length && labelled.length === obs.items.length);
  /* THE ROW FORM: each row prints its share at the right of its name. */
  const rows = [...html.matchAll(/<li data-row="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)].map((m) => ({ key: m[1], body: m[2] }));
  const rowLabelled = rows.filter((r) => r.body.includes(`>${shareOf(r.key)}%<`));
  check(`every obstacle's row prints its share, the top row (${top.label}) included (${rowLabelled.length} of ${obs.items.length})`, rows.length === obs.items.length && rowLabelled.length === obs.items.length);
  /* EVERY SHARE THE ROW FORM PRINTS IS A STAMPED FIGURE, read from the builder (the provenance ratchet counts the `fig` class: the top
     row's share is a new figure on /gb, and a figure without its stamp raises that page's count). */
  const stamped = [...html.matchAll(/<span class="fig [^"]*" data-src="(sections\/survival\.json:GB:obstacles:[^"]+)" data-kind="looked up">(\d+)%<\/span>/g)];
  check(`every share the row form prints is a figure stamped from the builder, the top row's too (${stamped.length} of ${obs.items.length})`, stamped.length === obs.items.length && obs.items.every((i) => stamped.some((m) => m[1] === i.prov.src && Number(m[2]) === i.pct)));
  /* THE TOP'S BAR IS FLAT --terra, IN BOTH FORMS, AND NO BAR IS DRAWN IN THE TERRACOTTA GRADIENT. */
  const bars = [...html.matchAll(/<span (?:aria-hidden="true" )?data-bar="true"[^>]*style="([^"]*)"/g)].map((m) => m[1]);
  const terraBars = bars.filter((s) => s.includes("var(--terra)"));
  check(`the top's bar is flat --terra in both forms (${terraBars.length} bars, none with a gradient), and no bar draws the terracotta gradient`, terraBars.length === 2 && terraBars.every((s) => !/gradient/.test(s)) && !/gradient\([^)]*var\(--terra/.test(html));
  /* THE COLUMN FORM HAS ROOM ABOVE ITS PLOT FOR THE LONGEST COLUMN'S LABEL. */
  check("the columns' plot keeps 20px above its bars, so the longest column's share stands inside the drawing", /<div class="flex min-h-40 flex-1 items-stretch gap-2 pt-5" role="img"/.test(html));
  /* THE SECTION'S FIGURE STAYS THE LARGE ONE, ONCE. */
  check(`the section's figure is still the large one above the drawing (${top.pct}% at the focal rung, once)`, (html.match(/data-focal="1"/g) ?? []).length === 1 && new RegExp(`data-focal="1" class="[^"]*">${top.pct}%</div>`).test(html));
}

if (sv) {
  const words = { focal: COPY.firstYears.focalWords, focalIn: COPY.firstYears.focalWordsIn, start: COPY.firstYears.start, year: COPY.firstYears.year, regions: COPY.firstYears.regions, choose: COPY.firstYears.choose, country: "The UK", kicker: COPY.firstYears.kicker };
  const html = renderToStaticMarkup(React.createElement(SurvivalCurve, { id: "first-years", country: sv.points, regions: sv.regionCurves, best: sv.regions?.best ?? null, worst: sv.regions?.worst ?? null, words, start: sv.start }));
  const labels = [...html.matchAll(/<span data-mark-label="true"[^>]*>(\d+)%<\/span>/g)].map((m) => Number(m[1]));
  /* THE START IS THE WHOLE COHORT, BY DEFINITION (critique pass 3, fix round D2, item P2.8), AND THE BUILDER GIVES IT (fix round F1, the D2 review's
     Minor 1): the curve begins at year 0 with every firm still trading, and the file's own series begins at year 1, so buildSurvival returns the start
     beside its points, stamped and said to be definitional where it is built, and the component takes it as a prop: no typed 100 in the component and
     none here. The labels' oracle is the builder's start and points, read; the start itself is held by relations, not by a literal of mine: it comes
     before the file's first year and is at least that year's share (a cohort only falls). */
  const start = sv.start as { year: number; pct: number; prov: { src: string; kind: string } } | undefined;
  const want = [Math.round(start?.pct ?? NaN), ...sv.points.map((p) => Math.round(p.pct))];
  check(`every point prints its share, the start (${want[0]}%) and the last (the terracotta dot, ${want[want.length - 1]}%) included (${labels.length} labels for ${sv.points.length + 1} points: ${labels.join(", ")})`, labels.length === sv.points.length + 1 && JSON.stringify(labels) === JSON.stringify(want), { file: CURVE });
  check(`the builder gives the start beside its points: year ${start?.year ?? "none"}, before the file's first year (${sv.points[0].year}), a share (${start?.pct ?? "none"}) at least the first year's (${sv.points[0].pct}) and the cohort whole, and the curve draws no start of its own`, !!start && start.year < sv.points[0].year && start.year === 0 && start.pct >= sv.points[0].pct && start.pct === Math.max(start.pct, ...sv.points.map((p) => p.pct)) && Number.isFinite(start.pct), { file: "src/lib/spine/sections/first_years.ts", remedy: "have buildSurvival return `start` beside `points`: year 0, the whole cohort (definitional, said in a comment where it is built), stamped; FirstYears passes it to SurvivalCurve, which has no START constant of its own" });
  /* EVERY LABEL SAYS WHERE ITS SHARE WAS READ (fix round F1, group G2, the final review's M2): the card's `fig` figure is held to
     the provenance ratchet, the labels (plain spans) are not, so nothing but this check sees a label printed bare. Obstacles' labels
     spread `provAttrs(o.prov)`; the curve's points take their stamp from the builder the same way, the start's too (it is no share the
     file holds, so its stamp, on `start.prov`, says "worked out" from the file's cohort: every share in the file is of that cohort's
     births). The oracle is the builder's own stamps, read, and no src is typed here but the file's name. BLIND SPOT: this reads the country's
     curve, the only one static markup draws (a chosen region lives in the component's state); a region's points are held at the
     builder, and the label element's source for the spread, below. */
  const LEDGER_KINDS = ["counted", "worked out", "looked up", "estimate"];
  /* The stamps are read off the CARD (FirstYears, the way /gb draws it), so the wiring that hands the curve the start's stamp is held too. */
  const card = renderToStaticMarkup(React.createElement(FirstYears, { data: sv }));
  const labelEls = [...card.matchAll(/<span data-mark-label="true"[^>]*>(\d+)%<\/span>/g)].map((m) => ({ src: /data-src="([^"]*)"/.exec(m[0])?.[1], kind: /data-kind="([^"]*)"/.exec(m[0])?.[1] }));
  const labelStamped = labelEls.filter((l) => !!l.src && LEDGER_KINDS.includes(l.kind ?? ""));
  check(`every point label carries data-src and data-kind, the start's too (${labelStamped.length} of ${labelEls.length})`, labelEls.length === sv.points.length + 1 && labelStamped.length === labelEls.length, { file: CURVE, remedy: STAMP_REMEDY });
  const given = [start?.prov, ...sv.points.map((p) => p.prov)];
  check(`each label's stamp is the one the builder gave its point, under sections/survival.json:GB: (the start's worked out from the cohort, the years' looked up), never typed in the component`, labelEls.length === given.length && labelEls.every((l, i) => !!l.src && l.src === given[i]?.src && l.kind === given[i]?.kind && l.src.startsWith("sections/survival.json:GB:")) && given[0]?.kind === "worked out" && given.slice(1).every((g) => g?.kind === "looked up") && new Set(given.map((g) => g?.src)).size === given.length, { file: "src/lib/spine/sections/first_years.ts", remedy: STAMP_REMEDY });
  const regionPoints = sv.regionCurves.flatMap((r) => r.points.map((p) => ({ r, p })));
  check(`every point of every region's curve carries a stamp naming its region and its year (${regionPoints.length} points of ${sv.regionCurves.length} regions), so a chosen region's labels are stamped as the country's are`, regionPoints.length > 0 && regionPoints.every(({ r, p }) => p.prov?.src === `sections/survival.json:GB:regionCurves:${r.key}:${p.year}` && p.prov?.kind === "looked up"), { file: "src/lib/spine/sections/first_years.ts", remedy: STAMP_REMEDY });
  const marked = [...html.matchAll(/<span data-mark-label="true" class="([^"]*)" style="([^"]*)"(?: data-src="[^"]*" data-kind="[^"]*")?>(\d+)%<\/span>/g)];
  const lastLabel = marked[marked.length - 1];
  check("the last point's label is held inside the plot's right edge (right-aligned to it), and is the same ink and weight as the others", !!lastLabel && /left:100%/.test(lastLabel[2]) && /(^| )-translate-x-full( |$)/.test(lastLabel[1]) && /font-semibold/.test(lastLabel[1]) && /text-\[var\(--c-ink2\)\]/.test(lastLabel[1]), { file: CURVE });
  /* THE PICKER ROW STANDS 32PX ABOVE THE PLOT: the start's label stands at the plot's top, above its point, in a box 26px tall (an 18px line
     and `pb-2`). Under the 24px the first year's label had (its point 10px lower) the start's box reached 2px into the picker row's band and
     its text 1px, hanging against the "Region" word (probed at 1280, 768, 375 and 320); 32 clears the row by 6px, 7 to the text, about 10 to
     the glyph. BLIND SPOT: this reads the class, not the pixels; the probe in the round's evidence measures the gap in a browser. */
  check("the picker row stands 32px above the plot (mb-8), so the start's label, which stands at the plot's top, clears the row", /<div class="mb-8 flex items-center gap-3"><label/.test(html), { file: CURVE, remedy: "give SurvivalCurve's picker row mb-8 (it was mb-6, 24px, which the first year's label cleared and the start's, a point higher, did not)" });
  const firstLabel = marked[0];
  check("the start's label is held inside the plot's left edge (left-aligned to it, no shift left of it), above its point, and is the same ink and weight as the others", !!firstLabel && /left:0%/.test(firstLabel[2]) && /top:0%/.test(firstLabel[2]) && !/(^| )-?translate-x-/.test(firstLabel[1]) && /(^| )-translate-y-full( |$)/.test(firstLabel[1]) && /font-semibold/.test(firstLabel[1]) && /text-\[var\(--c-ink2\)\]/.test(firstLabel[1]), { file: CURVE });
}

/* THE SOURCE CARRIES NO GUARD THAT TAKES THE FOCAL MARK'S LABEL AWAY (read as text, comments stripped). */
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const oSrc = code(OBSTACLES), cSrc = code(CURVE);
check("Obstacles holds no `o === top ? null` guard on a share, and its fill takes no lead", !/o === top\s*\?\s*null/.test(oSrc) && !/const fill = \(lead/.test(oSrc), { file: OBSTACLES });
const curveLabels = [...cSrc.matchAll(/<span data-mark-label[\s\S]*?<\/span>/g)].map((m) => m[0]);
check("SurvivalCurve labels every point, the start too: no `!isLast` guard on a label, none behind an index test (`i > 0 ?`, the guard that took the start's away), and its one label element prints `Math.round(p.pct)` read from its own point, never a typed share", !/!isLast/.test(cSrc) && !/\bi\s*(>|!==?)\s*0\s*\?[\s\S]{0,80}data-mark-label/.test(cSrc) && curveLabels.length === 1 && /\{Math\.round\(p\.pct\)\}%<\/span>$/.test(curveLabels[0]), { file: CURVE });
check("SurvivalCurve's one label element spreads provAttrs of its own point (`{...provAttrs(p.prov)}`), so a chosen region's labels are stamped as the country's are, and the start, with its stamp, comes in as the `start` prop: no START constant, no typed `pct: 100`, no survival.json key in the component", curveLabels.length === 1 && curveLabels[0].includes("{...provAttrs(p.prov)}") && /\bstart: CurvePoint\b/.test(cSrc) && !/\bSTART\b/.test(cSrc) && !/\bpct:\s*100\b/.test(cSrc) && !/sections\/survival\.json/.test(cSrc), { file: CURVE, remedy: STAMP_REMEDY });

/* THE RENDER, where the harness wrote it: /gb's chapter 04 draws both. */
const GB = "scratchpad/harness/pages/country-GB.html";
if (existsSync(GB)) {
  const page = readFileSync(GB, "utf8");
  /* A card's markup: from its id to the next card's id (the survival card stands before the obstacles card) or the next zone. */
  const at = (id: string, until: string) => { const i = page.indexOf(`id="${id}"`); if (i < 0) return ""; const j = page.indexOf(until, i + 1); return page.slice(i, j < 0 ? undefined : j); };
  /* THE OBSTACLES BEHIND SLOT 12'S PLUS (plan 2026-10-13 country-page-journey, Task 4): one row each, its share printed. */
  const lasting = page.slice(page.indexOf('data-slot="lasting"'), page.indexOf('data-slot="exit"'));
  const back = lasting.slice(lasting.indexOf(`>${COPY.journey.more.back}<`));
  const shares = (obs?.items ?? []).filter((o) => back.includes(`>${o.pct}%<`)).length;
  check(`/gb's render prints every obstacle's share behind slot 12's plus, one row each (${shares} of ${obs?.items.length ?? 0})`, !!obs && shares === obs.items.length, { file: "src/lib/spine/slots/last.ts", remedy: "keep every obstacle a row of slot 12's plus, its share printed" });
  /* The curve before the slot's first plus. */
  const svPart = lasting.slice(0, lasting.indexOf('data-fold="answer"'));
  const pts = Number(/data-archetype="survival-curve"[^>]*data-points="(\d+)"/.exec(svPart)?.[1] ?? 0);
  const ptLabels = (svPart.match(/<span data-mark-label="true"[^>]*>\d+%<\/span>/g) ?? []).length;
  check(`/gb's render labels every point, the start too (${ptLabels} labels for ${pts} points and the start)`, pts > 0 && ptLabels === pts + 1, { file: "src/components/spine/country/country-view.tsx", remedy: "render the UK page (bash scratchpad/reform/render_some.sh \"country GB\") after SurvivalCurve labels its start and its last point" });
  const ptStamped = (svPart.match(/<span data-mark-label="true"[^>]*data-src="sections\/survival\.json:GB:[^"]*" data-kind="(?:counted|worked out|looked up|estimate)"[^>]*>\d+%<\/span>/g) ?? []).length;
  check(`/gb's render stamps every point label with the survival file's key and a kind (${ptStamped} of ${ptLabels})`, ptLabels > 0 && ptStamped === ptLabels, { file: "src/components/spine/country/country-view.tsx", remedy: "render the UK page (bash scratchpad/reform/render_some.sh \"country GB\") after SurvivalCurve stamps its labels" });
} else console.log(`DEFER  ${GB} is not rendered here; the render checks did not run`);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/focal_values: all pass");
