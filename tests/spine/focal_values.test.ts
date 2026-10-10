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
 *  - SurvivalCurve (src/components/spine/interact/SurvivalCurve.tsx): every point after the start prints its share, the last
 *    (the terracotta dot) too, pinned inside the plot's right edge;
 *  - the source carries no guard that takes the focal mark's label away (`o === top ? null`, `!isLast`);
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
import { SurvivalCurve } from "../../src/components/spine/interact/SurvivalCurve";
import { buildObstacles, buildSurvival } from "../../src/lib/spine/sections/first_years";
import { COPY } from "../../src/lib/spine/copy";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "focal-values";
const OBSTACLES = "src/components/spine/sections/Obstacles.tsx";
const CURVE = "src/components/spine/interact/SurvivalCurve.tsx";
const REMEDY = "print the focal mark's value on the drawing as its neighbours print theirs: Obstacles' top column and top row take their share (the top bar flat --terra), SurvivalCurve labels the last point; the section's figure stays the large one above";
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
  const html = renderToStaticMarkup(React.createElement(SurvivalCurve, { id: "first-years", country: sv.points, regions: sv.regionCurves, best: sv.regions?.best ?? null, worst: sv.regions?.worst ?? null, words }));
  const labels = [...html.matchAll(/<span data-mark-label="true"[^>]*>(\d+)%<\/span>/g)].map((m) => Number(m[1]));
  const want = sv.points.map((p) => Math.round(p.pct));
  check(`every point after the start prints its share, the last (the terracotta dot, ${want[want.length - 1]}%) included (${labels.length} labels for ${sv.points.length} points: ${labels.join(", ")})`, labels.length === sv.points.length && JSON.stringify(labels) === JSON.stringify(want), { file: CURVE });
  const lastLabel = [...html.matchAll(/<span data-mark-label="true" class="([^"]*)" style="([^"]*)">(\d+)%<\/span>/g)].pop();
  check("the last point's label is held inside the plot's right edge (right-aligned to it), and is the same ink and weight as the others", !!lastLabel && /left:100%/.test(lastLabel[2]) && /(^| )-translate-x-full( |$)/.test(lastLabel[1]) && /font-semibold/.test(lastLabel[1]) && /text-\[var\(--c-ink2\)\]/.test(lastLabel[1]), { file: CURVE });
}

/* THE SOURCE CARRIES NO GUARD THAT TAKES THE FOCAL MARK'S LABEL AWAY (read as text, comments stripped). */
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const oSrc = code(OBSTACLES), cSrc = code(CURVE);
check("Obstacles holds no `o === top ? null` guard on a share, and its fill takes no lead", !/o === top\s*\?\s*null/.test(oSrc) && !/const fill = \(lead/.test(oSrc), { file: OBSTACLES });
check("SurvivalCurve labels every point after the start and holds no `!isLast` guard on a label", !/!isLast/.test(cSrc), { file: CURVE });

/* THE RENDER, where the harness wrote it: /gb's chapter 04 draws both. */
const GB = "scratchpad/harness/pages/country-GB.html";
if (existsSync(GB)) {
  const page = readFileSync(GB, "utf8");
  /* A card's markup: from its id to the next card's id (the survival card stands before the obstacles card) or the next zone. */
  const at = (id: string, until: string) => { const i = page.indexOf(`id="${id}"`); if (i < 0) return ""; const j = page.indexOf(until, i + 1); return page.slice(i, j < 0 ? undefined : j); };
  const obsPart = at("obstacles", "<section data-zone");
  const cols = (obsPart.match(/data-col="/g) ?? []).length;
  const colLabels = (obsPart.match(/<span data-mark-label="true"[^>]*>\d+%<\/span>/g) ?? []).length;
  const rowLabels = [...obsPart.matchAll(/<li data-row="[^"]*"[\s\S]*?<\/li>/g)].filter((m) => />\d+%<\/span>/.test(m[0])).length;
  check(`/gb's render prints every obstacle's share in both forms (${colLabels} column labels of ${cols}, ${rowLabels} rows)`, cols > 0 && colLabels === cols && rowLabels === cols, { file: "src/components/spine/country/country-view.tsx", remedy: "render the UK page (bash scratchpad/reform/render_some.sh \"country GB\") after Obstacles prints every share" });
  const svPart = at("first-years", 'id="obstacles"');
  const pts = Number(/data-archetype="survival-curve"[^>]*data-points="(\d+)"/.exec(svPart)?.[1] ?? 0);
  const ptLabels = (svPart.match(/<span data-mark-label="true"[^>]*>\d+%<\/span>/g) ?? []).length;
  check(`/gb's render labels every point after the start (${ptLabels} labels for ${pts} points)`, pts > 0 && ptLabels === pts, { file: "src/components/spine/country/country-view.tsx", remedy: "render the UK page (bash scratchpad/reform/render_some.sh \"country GB\") after SurvivalCurve labels its last point" });
} else console.log(`DEFER  ${GB} is not rendered here; the render checks did not run`);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/focal_values: all pass");
