/**
 * THE SHARED FORMS' SMALL PROPS FOR THE HOME (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 3): each does what the
 * home needs where it is passed and changes nothing where it is not.
 *   - Rail `level={2}`: the title an h2 (the home's outline, one h2 a section and none skipped), with the classes and the
 *     data-rail-title the zones' title rule and the model laws read; without it the h3 as before.
 *   - FactRows `step`: the step's numeral where the row's glyph stands, in ink on the soft tile with tabular figures, never a figure
 *     (no fig class, no provenance) and never the accent; without it the glyph as before.
 *   - Ring `size="lead"`: the figure inside at the lead rung (16) in a 96px ring, so a card's one 30 stays its focal; a caption may
 *     hold a stamped figure; without it the 144px ring and its 30.
 *   - BarList `quiet`: the marked bar in ink2 and no terracotta in the bars (PART 6: a card with no accent figure marks its leader in
 *     ink2); without it the accent's gradient.
 *   - The copy gate reads a card's title from a Rail's h2 where the card has one, else from its h3.
 *
 * Run: npx tsx tests/spine/home_forms.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Fig, Rail } from "../../src/components/spine/kit";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { Ring } from "../../src/components/spine/archetypes/Ring";
import { BarList } from "../../src/components/spine/charts/BarList";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-forms";
const REMEDY = "keep each shared form's new prop to what plan 2026-10-09 (home introduction, Task 3) gives it, and its default byte-identical";
let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

/* RAIL */
const KIT = "src/components/spine/kit.tsx";
const h3 = renderToStaticMarkup(React.createElement(Rail, { icon: "taxes", kicker: "Tax, rule by rule" }));
const h2 = renderToStaticMarkup(React.createElement(Rail, { icon: "taxes", kicker: "Tax, rule by rule", level: 2 }));
check("a Rail draws its title as an h3 by default", /<h3 data-typography="custom" data-rail-title=""/.test(h3) && !/<h2/.test(h3), KIT, "keep Rail's default title an h3 (level defaults to 3)");
check("a Rail at level 2 draws an h2 and changes nothing else", /<h2 data-typography="custom" data-rail-title=""/.test(h2) && !/<h3/.test(h2) && h2.replace(/<(\/?)h2/g, "<$1hx") === h3.replace(/<(\/?)h3/g, "<$1hx"), KIT, "Rail's level 2 swaps the tag and nothing else");

/* FACTROWS' STEP */
const FACT = "src/components/spine/archetypes/FactRows.tsx";
const stepped = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "registered", step: "1", label: "Registered businesses", value: "7,865", note: "Counted in the business register, Greater London, March 2026.", prov: { src: "uk/registers/turnover.json:restaurants:E12000007", kind: "counted" } }] }));
const glyphed = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "copies", icon: "filings", label: "Register copies", value: "2" }] }));
const mark = /<span data-step="1" aria-hidden="true" class="([^"]*)">1<\/span>/.exec(stepped);
check("a stepped row draws its numeral where the glyph stands, and no glyph", !!mark && !/spine-ic/.test(stepped), FACT, "draw StepMark in place of the glyph when a row carries a step");
check("the numeral is ink2 on the soft tile with tabular figures, never a figure and never the accent", !!mark && /\btabular-nums\b/.test(mark[1]) && /text-\[var\(--c-ink2\)\]/.test(mark[1]) && /bg-\[var\(--c-soft\)\]/.test(mark[1]) && !/\bfig\b/.test(mark[1]) && !/terra/.test(mark[1]), FACT, "StepMark (kit.tsx): ink2 on --c-soft, tabular-nums, no fig class, no terracotta");
check("a row with no step draws its glyph as before, and no numeral", /spine-ic/.test(glyphed) && !/data-step=/.test(glyphed), FACT);
check("the stepped row's figure keeps its stamp", /data-src="uk\/registers\/turnover\.json:restaurants:E12000007" data-kind="counted">7,865</.test(stepped), FACT);

/* RING'S SIZE AND CAPTION */
const RING = "src/components/spine/archetypes/Ring.tsx";
const big = renderToStaticMarkup(React.createElement(Ring, { value: 38.4, figure: "38%", caption: "of new firms, after 5 years" }));
const caption = React.createElement(React.Fragment, null, "of ", React.createElement(Fig, { prov: { src: "home/method.json:names", kind: "counted" }, children: "31,376" }), " names found in the register");
const lead = renderToStaticMarkup(React.createElement(Ring, { value: 97.2, figure: "30,510", size: "lead", prov: { src: "home/method.json:matched_names", kind: "counted" }, caption }));
check("a ring by default is 144px with its figure at the focal rung", /class="relative h-36 w-36"/.test(big) && /width="144"/.test(big) && /class="fig text-\[length:var\(--t-focal\)\] leading-none/.test(big), RING, "keep the default ring 144px and its figure at --t-focal");
check("a lead ring is 96px with its figure at the lead rung, stamped", /class="relative h-24 w-24"/.test(lead) && /width="96"/.test(lead) && /class="fig text-\[length:var\(--t-lead\)\] font-semibold leading-none text-\[var\(--c-ink\)\]" data-src="home\/method\.json:matched_names" data-kind="counted">30,510</.test(lead) && !/--t-focal/.test(lead), RING, "Ring size lead: a 96px ring (h-24 w-24) and its figure at --t-lead, semibold");
check("a ring's caption may hold a stamped figure", /data-mark-label="true"[^>]*>of <span class="fig " data-src="home\/method\.json:names" data-kind="counted">31,376<\/span> names found in the register</.test(lead), RING, "Ring's caption is a node drawn as given");

/* BARLIST'S QUIET */
const BARS = "src/components/spine/charts/BarList.tsx";
const items = [{ key: "leeds", label: "Leeds", value: 41.8, display: "41.8", href: "/cities/leeds" }, { key: "glasgow", label: "Glasgow", value: 40.2, display: "40.2", href: "/cities/glasgow" }];
const loud = renderToStaticMarkup(React.createElement(BarList, { items, max: 100, look: "plain", mark: "leeds", fill: true, reference: { value: 38.4, label: "The UK" } }));
const quiet = renderToStaticMarkup(React.createElement(BarList, { items, max: 100, look: "plain", mark: "leeds", fill: true, quiet: true, reference: { value: 38.4, label: "The UK" } }));
const barStyles = (html: string) => [...html.matchAll(/data-bar="true"[^>]*style="([^"]*)"/g)].map((m) => m[1]);
check("a list's marked bar is the accent's gradient by default", /data-marked="1"[^>]*style="[^"]*var\(--terra\)/.test(loud), BARS, "keep the default marked bar in the accent's gradient");
check("a quiet list's marked bar is ink2 and no bar holds terracotta", /data-marked="1"[^>]*style="[^"]*background-color:var\(--c-ink2\)/.test(quiet) && barStyles(quiet).every((s) => !/terra/.test(s)), BARS, "BarList quiet: the marked bar's background var(--c-ink2)");
check("quiet changes the marked bar's colour and nothing else", loud.replace(/style="width:[^"]*"/g, "") === quiet.replace(/style="width:[^"]*"/g, ""), BARS);

/* THE COPY GATE'S TITLE */
const GATE = "scripts/harness/check_copy_plain.mjs";
check("the copy gate reads a card's title from a Rail's h2 where it has one, else its h3", /card\.querySelector\("h2\[data-rail-title\]"\) \?\? card\.querySelector\("h3"\)/.test(readFileSync(GATE, "utf8")), GATE, 'read the title as card.querySelector("h2[data-rail-title]") ?? card.querySelector("h3")');

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/home_forms: all pass");
