/**
 * THE SHARED FORMS' SMALL PROPS FOR THE HOME (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 3): each does what the
 * home needs where it is passed and changes nothing where it is not.
 *   - Rail `level={2}`: the title an h2 (the home's outline, one h2 a section and none skipped), with the classes and the
 *     data-rail-title the zones' title rule and the model laws read; without it the h3 as before.
 *   - (FactRows took a `step` here until the closing cleanup of plan 2026-10-10, item 1: nothing passed one, the worked example draws
 *     StepMark itself, so the prop and its branch are gone and the numeral is held on StepMark directly, below.)
 *   - Ring `size="lead"`: the figure inside at the lead rung (16) in a 96px ring, so a card's one 30 stays its focal; a caption may
 *     hold a stamped figure; without it the 144px ring and its 30.
 *   - BarList `quiet`: the marked bar in ink2 and no terracotta in the bars (PART 6: a card with no accent figure marks its leader in
 *     ink2); without it the accent's gradient.
 *   - The copy gate reads a card's title from a Rail's h2 where the card has one, else from its h3.
 *   - (plan 2026-10-10, home reform, Task 3) StepMark the numeral alone, 16 semibold in the muted grey, no tile; a Rail's chip a circle
 *     by its own class; RangeStrip's `oneRow` (the names never step) and `decades` (a log track's powers of ten as round values, none
 *     within 4 percent of the track of any mark, so no figure is printed twice side by side); CountUnits' `fine` (2px apart under
 *     1024, 4 from it). Each off by default. (`headless`, a mark with no figure, is gone: the home's typical prints its figure.)
 *   - (plan 2026-10-10, home reform, critique pass 2, P0.2) RangeStrip's `namesAbove`: every mark's name over its figure above the
 *     track, the round values alone under it, so no column holds two figures one under the other; off by default.
 *   - (the same pass, P0.1) Ring `layout="row"` (the caption beside the ring, left-aligned at 14 in ink2), FactRows' `swatch` (a 10px
 *     key square in the glyph's place) and SegmentBar's `parts` (one continuous bar of named parts and the rest, in place of the
 *     cells); each off by default, so the default drawings are what they were.
 *   - (the closing cleanup of the same plan) MonthBars `prov`: the drawing's root stamped with where its twelve counts came from
 *     (data-src, data-kind); without it the drawing is what it was.
 *
 * Run: npx tsx tests/spine/home_forms.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { Fig, Rail, StepMark } from "../../src/components/spine/kit";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { Ring } from "../../src/components/spine/archetypes/Ring";
import { MonthBars } from "../../src/components/spine/archetypes/MonthBars";
import { SegmentBar } from "../../src/components/spine/archetypes/SegmentBar";
import { BarList } from "../../src/components/spine/charts/BarList";
import { RangeStrip } from "../../src/components/spine/archetypes/RangeStrip";
import { CountUnits } from "../../src/components/spine/archetypes/BentoBand";
import { usd } from "../../src/lib/spine/money";
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

/* STEPMARK, AND FACTROWS WITHOUT A STEP (the closing cleanup of plan 2026-10-10, item 1). The numeral is held on StepMark itself, as
   the worked example draws it; FactRows takes no step, and a row handed one anyway draws its glyph. */
const FACT = "src/components/spine/archetypes/FactRows.tsx";
const stamped = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "registered", icon: "filings", label: "Registered businesses", value: "7,865", note: "Counted in the business register, Greater London, March 2026.", prov: { src: "uk/registers/turnover.json:restaurants:E12000007", kind: "counted" } }] }));
const glyphed = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "copies", icon: "filings", label: "Register copies", value: "2" }] }));
const handed = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "registered", icon: "filings", step: "1", label: "Registered businesses", value: "7,865" } as never] }));
const factCode = stripCommentLines(readFileSync(FACT, "utf8").split("\n")).join("\n");
check("FactRows takes no step: a row handed one draws its glyph and no numeral, and the file names neither the prop nor StepMark", /spine-ic/.test(handed) && !/data-step=/.test(handed) && !/\bstep\b/.test(factCode) && !/StepMark/.test(factCode), FACT, "delete FactRows' step prop, its branch and its StepMark import: nothing has passed one since the worked example draws StepMark itself (HomeExample.tsx)");
const mark = /<span data-step="1" aria-hidden="true" class="([^"]*)">1<\/span>/.exec(renderToStaticMarkup(React.createElement(StepMark, { n: "1" })));
check("the numeral stands alone in the 28px column: 16 semibold in the muted grey, tabular figures, no tile, never a figure and never the accent", !!mark && /\bh-7\b/.test(mark[1]) && /\bw-7\b/.test(mark[1]) && /--t-lead/.test(mark[1]) && /\bfont-semibold\b/.test(mark[1]) && /\btabular-nums\b/.test(mark[1]) && /text-\[var\(--c-muted\)\]/.test(mark[1]) && !/\bbg-/.test(mark[1]) && !/\bborder\b/.test(mark[1]) && !/\bfig\b/.test(mark[1]) && !/terra/.test(mark[1]), KIT, "StepMark (kit.tsx): the numeral alone, font-serif at --t-lead semibold in --c-muted, tabular-nums, h-7 w-7, no bg, no border, no fig class, no terracotta");
check("a row draws its glyph and never a numeral", /spine-ic/.test(glyphed) && !/data-step=/.test(glyphed), FACT);
check("a row's figure keeps its stamp", /data-src="uk\/registers\/turnover\.json:restaurants:E12000007" data-kind="counted">7,865</.test(stamped), FACT);

/* THE CHIP AND THE STRIP'S AND THE UNITS' NEW PROPS (plan 2026-10-10, home reform, Task 3; the critique's P2.1, P0.5 and P1.5). */
check("a Rail's chip is a circle by its own class (rounded-full), not by the radius token that happened to round it", /<span class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"/.test(h2) && !/rounded-lg/.test(h2), KIT, "Ico (kit.tsx): rounded-full on the 28px tile");
const STRIP = "src/components/spine/archetypes/RangeStrip.tsx";
const MARKS = [{ key: "p10", label: "Bottom tenth", value: 76_300 }, { key: "typical", label: "Typical", value: 374_000, lead: true }, { key: "p90", label: "Top tenth", value: 2_550_000 }];
const stripOf = (props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(RangeStrip, { marks: MARKS, fmt: usd, basis: "", ...props }));
/* THE ROUND VALUES PRINT ROUND (critique pass 4, fix round F2, item P2.4; MODEL 10.8: a log track's round values are there to be round): the marks' formatter
   keeps one decimal for millions because "$2.5M" needs it, so a round $1,000,000 came out "$1.0M" under the track, a figure that reads measured; the spec wrote the
   scale "$100K, $1M". The marks are untouched: a typical of $1.04M still prints "$1.0M" (the pharmacies' check below). BLIND SPOT: these are this fixture's own round
   values (MARKS: 76,300, 374,000 and 2,550,000 hold 10^5 and 10^6); the rule is the strip's. */
const ROUND_LABELS = ["$100K", "$1M"];
const plainStrip = stripOf({ scale: "log" });
const homeStrip = stripOf({ scale: "log", oneRow: true, decades: true });
const tops = (h: string) => [...h.matchAll(/data-mark-label="[^"]+"[^>]*top:(\d+)px/g)].map((m) => Number(m[1]));
const scaleLabels = (h: string) => [...h.matchAll(/data-scale-label="true"[^>]*>([^<]*)</g)].map((m) => m[1]);
check("without the new props a strip of three steps its middle name, draws every figure, no round value and its names under the track", new Set(tops(plainStrip)).size === 2 && scaleLabels(plainStrip).length === 0 && /data-mark="typical"/.test(plainStrip) && !/data-names=/.test(plainStrip), STRIP, "RangeStrip: oneRow, decades and namesAbove off by default");
check(`oneRow keeps the three names on one row (tops ${tops(homeStrip).join(", ")})`, tops(homeStrip).length === 3 && new Set(tops(homeStrip)).size === 1, STRIP, "RangeStrip oneRow: every name on the first row");
check(`decades prints the powers of ten inside a log range as round values (${scaleLabels(homeStrip).join(", ")})`, JSON.stringify(scaleLabels(homeStrip)) === JSON.stringify(ROUND_LABELS) && !scaleLabels(homeStrip).some((t) => /\.0[KMB]/.test(t)) && (homeStrip.match(/data-scale-tick="true"/g) ?? []).length === 2, STRIP, "RangeStrip decades: each power of ten strictly inside the range, a 6px tick under the track and its figure at the micro rung, on a log track only");
check("decades draws nothing on a linear track", scaleLabels(stripOf({ scale: "linear", decades: true })).length === 0, STRIP, "RangeStrip decades: on a log track only");
/* NOTHING PASSES `headless` ANY MORE (critique pass 2, P0.2 and its Q2: the home's typical prints its figure at 14 over its tick). The
   prop and its branches are gone, as FactRows' `step` went when nothing passed one: a mark handed it anyway draws its figure. */
const handedHeadless = stripOf({ scale: "log", decades: true, marks: MARKS.map((m) => (m.key === "typical" ? { ...m, headless: true } : m)) as never });
const stripCode = stripCommentLines(readFileSync(STRIP, "utf8").split("\n")).join("\n");
check("RangeStrip takes no headless: a mark handed one draws its figure, and the file's code names no such prop", /data-mark="typical"/.test(handedHeadless) && !/headless/.test(stripCode), STRIP, "delete RangeStrip's headless prop and its branches: nothing passes one since the home's typical prints its figure (HomeExample.tsx)");

/* NAMES ABOVE (plan 2026-10-10, home reform, critique pass 2, P0.2). The strip under step 2 printed "$76K" over the bottom tenth's tick
   and, straight under that tick, "$100K" and then "Bottom tenth", the same size and the same grey: a reader took $100K for the bottom
   tenth. Now each mark is one block over its tick, its name (12, muted) with its figure under it, the track, and under the track only
   the round values, each a 6px tick in ink2 with its figure at 12. Read from the markup's own positions: the page measure (a browser
   probe, scratchpad/home-reform/c1-strip-probe.mjs) reads the same in boxes. */
const topOf = (el: Element | null | undefined) => Number(/\btop:\s*(-?[\d.]+)/.exec(el?.getAttribute("style") ?? "")?.[1] ?? NaN);
const heightOf = (el: Element | null | undefined) => Number(/\bheight:\s*(-?[\d.]+)/.exec(el?.getAttribute("style") ?? "")?.[1] ?? NaN);
const dom = (html: string) => new JSDOM(`<body>${html}</body>`).window.document;
const HOME_MARKS = MARKS.map((m) => (m.key === "typical" ? { ...m, lead: false } : m));
const homeAbove = stripOf({ scale: "log", oneRow: true, decades: true, namesAbove: true, marks: HOME_MARKS });
const tradeAbove = stripOf({ scale: "log", decades: true, namesAbove: true });
const geometry = (html: string) => {
  const d = dom(html);
  const track = [...d.querySelectorAll("div[aria-hidden]")].find((e) => /\bh-px\b/.test(e.getAttribute("class") ?? ""));
  const names = [...d.querySelectorAll("[data-mark-label]")];
  const figures = [...d.querySelectorAll("[data-mark]")];
  const ticks = [...d.querySelectorAll("[data-scale-tick]")];
  const labels = [...d.querySelectorAll("[data-scale-label]")];
  const leaders = d.querySelectorAll("[data-mark-leader]").length;
  return { d, track: topOf(track), names, figures, ticks, labels, leaders };
};
const home = geometry(homeAbove), trade = geometry(tradeAbove);
const key = (e: Element) => e.getAttribute("data-mark-label") ?? e.getAttribute("data-mark");
const aboveTrack = (g: ReturnType<typeof geometry>) => [...g.names, ...g.figures].every((e) => topOf(e) < g.track) && [...g.ticks, ...g.labels].every((e) => topOf(e) > g.track);
const nameThenFigure = (g: ReturnType<typeof geometry>) => g.names.length === 3 && g.names.every((n) => { const f = g.figures.find((x) => key(x) === key(n)); return !!f && topOf(f) - (topOf(n) + 12) === 6; });
const nearestForeign = (g: ReturnType<typeof geometry>) => Math.min(...g.labels.flatMap((l) => g.names.map((n) => topOf(l) - (topOf(n) + 12))));
check(`names above: every name and figure stands over the track and every round value under it (home: track ${home.track}, names ${home.names.map(topOf).join(", ")}, figures ${home.figures.map(topOf).join(", ")}, round values ${home.labels.map(topOf).join(", ")})`, home.names.length === 3 && home.figures.length === 3 && home.labels.length === 2 && aboveTrack(home) && /data-names="above"/.test(homeAbove), STRIP, "RangeStrip namesAbove: the marks' names and figures above the track, only the round values below it");
check("names above: each name is the mark's own, 6px over its figure, 12 muted, and the figure 14 semibold ink with its stamp (the home's typical prints its value like its neighbours)", nameThenFigure(home) && home.d.querySelectorAll("[data-mark-label]").length === 3 && home.figures.every((f) => /--t-body/.test(f.innerHTML) && /font-semibold/.test(f.innerHTML) && /--c-ink\)/.test(f.innerHTML)) && home.names.every((n) => /--t-micro/.test(n.getAttribute("class") ?? "") && /--c-muted/.test(n.getAttribute("class") ?? "")) && /data-mark="typical"[^>]*><span[^>]*>\$374K</.test(homeAbove), STRIP, "RangeStrip namesAbove: the name (12, leading-none, --c-muted) at the block's top, the figure 6px under it at the body rung, semibold, ink");
check(`names above: the one row of the home's three names (tops ${home.names.map(topOf).join(", ")}) and the nearest figure that is not a mark's own, a round value, is ${nearestForeign(home)}px under a name (more than 48)`, new Set(home.names.map(topOf)).size === 1 && nearestForeign(home) > 48, STRIP, "RangeStrip namesAbove: leave more than 48px from any name to the round values under the track (the critique's done-when)");
check(`names above: the round values are 6px ticks in ink2 hanging from the track, their figures 12 muted under them (${home.ticks.map((t) => `${topOf(t)}+${heightOf(t)}`).join(", ")} | ${home.labels.map(topOf).join(", ")})`, home.ticks.length === 2 && home.ticks.every((t) => heightOf(t) === 6 && topOf(t) === home.track + 1 && /--c-ink2/.test(t.getAttribute("class") ?? "")) && home.labels.every((l) => /--t-micro/.test(l.getAttribute("class") ?? "") && /--c-muted/.test(l.getAttribute("class") ?? "") && topOf(l) === home.track + 13) && JSON.stringify(home.labels.map((l) => l.textContent)) === JSON.stringify(ROUND_LABELS), STRIP, "RangeStrip namesAbove: each round value's tick h 6 in --c-ink2 from the track's line, its figure 6px under the tick at the micro rung in --c-muted");
check(`names above on a trade page's strip (the typical the lead, 30): its three blocks stand over the track, the typical's name over its 30 (tops ${trade.names.map((n) => `${key(n)} ${topOf(n)}`).join(", ")}), the end blocks keep a leader hairline down to their ticks (${trade.leaders}) and a one-row strip draws none (${home.leaders})`, aboveTrack(trade) && nameThenFigure(trade) && topOf(trade.names.find((n) => key(n) === "typical")) >= topOf(trade.names.find((n) => key(n) === "p10")) + 12 + 6 + 14 + 6 && /--t-focal/.test(trade.figures.find((f) => key(f) === "typical")?.innerHTML ?? "") && trade.leaders === 2 && home.leaders === 0 && nearestForeign(trade) > 48, STRIP, "RangeStrip namesAbove: a stepped mark's block a row lower, the upper blocks' ticks reaching up to them on a --c-line-strong hairline (data-mark-leader), and none when every name stands on one row");
/* A ROUND VALUE BESIDE A MARK IS NOT DRAWN (fix round 2b of the hero and picker task; the Task 2 re-review). The London pharmacies' typical
   is $1.04M, which prints as "$1.0M", and the power of ten 10^6 stands 1.1 percent of the track from its tick: the strip drew "$1.0M"
   twice. A round value within 4 percent of the track of ANY mark is skipped, on either side of it, not only near the end marks. */
const REMEDY_ROUND = "RangeStrip decades (src/components/spine/archetypes/RangeStrip.tsx): skip a power of ten within 4 percent of the track of any mark, so no figure is printed twice side by side";
const pharmacies = stripOf({ scale: "log", decades: true, marks: [{ key: "p10", label: "Bottom tenth", value: 171_000 }, { key: "typical", label: "Typical", value: 1_040_000, lead: true }, { key: "p90", label: "Top tenth", value: 3_720_000 }] });
const times = (h: string, figure: string) => (h.match(new RegExp(`>${figure.replace("$", "\\$")}<`, "g")) ?? []).length;
check(`a typical of $1.04M draws "$1.0M" once, over its own tick, and no round value beside it (the text ${times(pharmacies, "$1.0M")} times, round values [${scaleLabels(pharmacies).join(", ")}], over the typical's tick ${/data-mark="typical"[^>]*><span[^>]*>\$1\.0M<\/span>/.test(pharmacies)})`, times(pharmacies, "$1.0M") === 1 && scaleLabels(pharmacies).length === 0 && /data-mark="typical"[^>]*><span[^>]*>\$1\.0M<\/span>/.test(pharmacies), STRIP, REMEDY_ROUND);
/* The edge of the rule, on a track from 10^5 to 10^7 where the power of ten 10^6 stands at 50 percent of it (6 percent of padding each end, 88 of track): a middle mark d percent of the track from it. */
const middleAt = (d: number) => 10 ** (5 + 2 * ((44 + d) / 88));
const roundsBeside = (d: number) => scaleLabels(stripOf({ scale: "log", decades: true, marks: [{ key: "low", label: "Low", value: 100_000 }, { key: "mid", label: "Middle", value: middleAt(d) }, { key: "high", label: "High", value: 10_000_000 }] }));
check(`a round value within 4 percent of the track of a middle mark is skipped on either side, and one 4 or more percent away stays (3.9 left [${roundsBeside(-3.9).join(", ")}], 3.9 right [${roundsBeside(3.9).join(", ")}], 4.1 left [${roundsBeside(-4.1).join(", ")}], 4.1 right [${roundsBeside(4.1).join(", ")}])`, roundsBeside(-3.9).length === 0 && roundsBeside(3.9).length === 0 && roundsBeside(-4.1).join() === ROUND_LABELS[1] && roundsBeside(4.1).join() === ROUND_LABELS[1], STRIP, REMEDY_ROUND);
const UNITS = "src/components/spine/archetypes/BentoBand.tsx";
const unitsClass = (props: Record<string, unknown>) => /data-units="100"[^>]*class="([^"]*)"/.exec(renderToStaticMarkup(React.createElement(CountUnits, { whole: 100, filled: 32, columns: 25, aria: "32 of 100", ...props })))?.[1] ?? "";
check("fine units stand 2px apart under 1024 and 4 from it; without it 4px as before", /^grid gap-\[2px\] lg:gap-\[4px\]$/.test(unitsClass({ fine: true })) && /^grid gap-\[4px\]$/.test(unitsClass({})), UNITS, "CountUnits fine: grid gap-[2px] lg:gap-[4px]");

/* RING'S SIZE AND CAPTION */
const RING = "src/components/spine/archetypes/Ring.tsx";
const big = renderToStaticMarkup(React.createElement(Ring, { value: 38.4, figure: "38%", caption: "of new firms, after 5 years" }));
const caption = React.createElement(React.Fragment, null, "of ", React.createElement(Fig, { prov: { src: "home/method.json:names", kind: "counted" }, children: "31,376" }), " names found in the register");
const lead = renderToStaticMarkup(React.createElement(Ring, { value: 97.2, figure: "30,510", size: "lead", prov: { src: "home/method.json:matched_names", kind: "counted" }, caption }));
check("a ring by default is 144px with its figure at the focal rung", /class="relative h-36 w-36"/.test(big) && /width="144"/.test(big) && /class="fig text-\[length:var\(--t-focal\)\] leading-none/.test(big), RING, "keep the default ring 144px and its figure at --t-focal");
check("a lead ring is 96px with its figure at the lead rung, stamped", /class="relative h-24 w-24"/.test(lead) && /width="96"/.test(lead) && /class="fig text-\[length:var\(--t-lead\)\] font-semibold leading-none text-\[var\(--c-ink\)\]" data-src="home\/method\.json:matched_names" data-kind="counted">30,510</.test(lead) && !/--t-focal/.test(lead), RING, "Ring size lead: a 96px ring (h-24 w-24) and its figure at --t-lead, semibold");
check("a ring's caption may hold a stamped figure", /data-mark-label="true"[^>]*>of <span class="fig " data-src="home\/method\.json:names" data-kind="counted">31,376<\/span> names found in the register</.test(lead), RING, "Ring's caption is a node drawn as given");
/* THE LEAD RING'S CAPTION BALANCES ITS LINES (fix round 2b; the Task 4 review's concern 1). "in 100 names found in the register" in the
   22ch box broke as "in 100 names found in the" and "register" at every width. Only the lead ring, which only the home's joins draws,
   takes text-balance, so no other ring's caption moves. */
check("a lead ring's caption balances its lines (text-balance on its element), and a default ring's caption keeps its classes without it", /<div data-mark-label="true" class="[^"]*\btext-balance\b[^"]*">/.test(lead) && /<div data-mark-label="true" class="mt-2 max-w-\[22ch\] text-center text-\[length:var\(--t-micro\)\] leading-snug text-\[var\(--c-muted\)\]">of new firms, after 5 years<\/div>/.test(big), RING, "Ring size lead: text-balance on the caption's element, and nothing added to a default ring's caption");

/* RING'S ROW LAYOUT (critique pass 2, P0.1). The joins' ring stood centred in a left-aligned card with its caption centred under it, and
   the card's spare height opened above it. `layout="row"` draws the 96px ring at the left and the caption beside it, left-aligned at 14
   on 20 in ink2, within 20ch and balanced, the two centred on one another; the default column form is untouched (the checks above). */
const rowRing = renderToStaticMarkup(React.createElement(Ring, { value: 97.2, figure: "97", size: "lead", tone: "ink", layout: "row", caption: "in 100 names found in the register" }));
check("a ring in its row form stands the caption beside the ring (flex items-center gap-4), left-aligned at 14 on 20 in ink2 within 20ch, balanced", /<div data-archetype="ring"[^>]*class="flex items-center gap-4">/.test(rowRing) && /<div data-mark-label="true" class="max-w-\[20ch\] text-balance text-left text-\[length:var\(--t-body\)\] leading-5 text-\[var\(--c-ink2\)\]">in 100 names found in the register<\/div>/.test(rowRing) && /class="relative h-24 w-24"/.test(rowRing) && !/flex-col|text-center/.test(rowRing), RING, "Ring layout row: the root flex items-center gap-4; the caption max-w-[20ch] text-balance text-left at --t-body, leading-5, --c-ink2");
check("a ring's default layout is the column it was: flex flex-col items-center, the caption centred under it", /<div data-archetype="ring"[^>]*class="flex flex-col items-center">/.test(lead) && /<div data-archetype="ring"[^>]*class="flex flex-col items-center">/.test(big), RING, "Ring: layout defaults to column, the root flex flex-col items-center");

/* FACTROWS' SWATCH (critique pass 2, P0.1). A row may carry a colour token, drawn as a 10px key square in the glyph's place, centred on the
   label's first line, so the home's tax rows are the stacked bar's key. A row with a glyph draws the glyph, and one with neither draws
   neither, as before. */
const swatched = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "a", label: "Income tax", value: "14%", note: "20% above the £12,570 allowance", swatch: "var(--c-ink)" }, { key: "b", label: "Both", value: "1", icon: "filings", swatch: "var(--c-ink2)" }, { key: "c", label: "Plain", value: "2" }] }));
const rowOf = (html: string, k: string) => new RegExp(`data-row="${k}"[\\s\\S]*?</dd>`).exec(html)?.[0] ?? "";
check("a row's swatch is a 10px square with 2px radius in its colour before the label, centred on the label's first line; a row with a glyph draws the glyph; a row with neither draws neither", /<span aria-hidden="true" data-swatch="" class="mt-2 h-2\.5 w-2\.5 shrink-0 rounded-\[2px\]" style="background:var\(--c-ink\)"><\/span>/.test(rowOf(swatched, "a")) && /spine-ic/.test(rowOf(swatched, "b")) && !/data-swatch/.test(rowOf(swatched, "b")) && !/data-swatch|spine-ic/.test(rowOf(swatched, "c")) && !/data-swatch/.test(glyphed), FACT, "FactRows swatch: a 10px (h-2.5 w-2.5) square, rounded-[2px], mt-2 (the ladder's 8) to sit on the label's first line, in the glyph's place");
/* THE SWATCH'S MARGIN IS ON THE SPACING LADDER (fix round F1, group G7, the D2 report's concern 1). The square's mt-[9px] was the one use the distance-ladder
   gate read off the ladder (DISTANCES.md section 1: 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64) since round C1, so the chain stood red at 2 uses against a
   baseline of 1. 9 centred the 10px square on the label's 20px first line under its 4px of top padding (4 + 5), measured at the line box's centre to the
   hundredth; 8 sits it 1px higher, which is what the ladder allows (12 would sit it 3px lower). No margin, padding or gap in FactRows is an arbitrary
   pixel value. BLIND SPOT: classes as written; the swatch against its text is measured in a browser (scratchpad/home-reform/f1_g7_swatch.mjs). */
check("FactRows' key square sits on the spacing ladder: mt-2, and no margin, padding or gap of an arbitrary pixel value anywhere in the file", /<span aria-hidden="true" data-swatch="" class="mt-2 /.test(rowOf(swatched, "a")) && !/(?:^|[\s"'`{])-?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[[^\]\s]+\]/.test(factCode), FACT, "give the swatch mt-2 (the ladder's 8) in place of mt-[9px] and write no bracketed distance in FactRows.tsx: put a distance on the ladder (0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64)");

/* SEGMENTBAR'S CONTINUOUS FORM (critique pass 2, P0.1). The tax proof's 50 cells repeated the 18 and showed nothing of the two rules behind
   it: `parts` draws one 12px bar of the named parts, each as wide as its value, the rest in the soft grey with a 1px edge so the whole is
   visible, the two names under it at the micro rung; the cells form is what it was. */
const SEGMENTS = "src/components/spine/archetypes/SegmentBar.tsx";
const stacked = renderToStaticMarkup(React.createElement(SegmentBar, { bare: true, tone: "ink", label: "Of 100 of profit", value: 18, figure: "18%", unit: "", part: "Tax 18%", rest: "You keep 82%", parts: [{ key: "a", value: 14, fill: "var(--c-ink)" }, { key: "b", value: 4, fill: "var(--c-ink2)" }] }));
const cells = renderToStaticMarkup(React.createElement(SegmentBar, { bare: true, tone: "ink", label: "Of 100 of profit", value: 18, figure: "18%", unit: "", part: "Tax", rest: "You keep" }));
check("the stacked bar is one 12px bar, 3px radius, clipped: the parts at 14% in ink and 4% in ink2, the rest in the soft grey with its 1px edge, the two names under it", /<div class="flex h-3 w-full overflow-hidden rounded-\[3px\]" aria-hidden="true"><span data-bar-part="a" class="h-full shrink-0" style="width:14%;background:var\(--c-ink\)"><\/span><span data-bar-part="b" class="h-full shrink-0" style="width:4%;background:var\(--c-ink2\)"><\/span><span data-rest-fill="" class="h-full min-w-0 flex-1" style="background:var\(--c-soft2\);box-shadow:inset 0 0 0 1px var\(--c-line-strong\)"><\/span><\/div>/.test(stacked) && /data-continuous="1"/.test(stacked) && /data-form="split"/.test(stacked) && !/data-segments=/.test(stacked) && /<span data-part="true">Tax 18%<\/span><span data-rest="true">You keep 82%<\/span>/.test(stacked) && /role="img" aria-label="Of 100 of profit"/.test(stacked) && !/data-part-key/.test(stacked), SEGMENTS, "SegmentBar parts: one h-3 rounded-[3px] overflow-hidden bar, each part a span (data-bar-part, never data-part-key: that is Marks' hook and the interact gate reds one outside a listening drawing) as wide as its share in its own fill, the rest --c-soft2 with an inset 1px --c-line-strong edge, the names under at the micro rung");
check("without parts the bar is the cells it was: 25 cells, no continuous form", /data-segments="25"/.test(cells) && (cells.match(/<span class="h-3 min-w-0 flex-1 rounded-\[2px\]"/g) ?? []).length === 25 && !/data-continuous/.test(cells), SEGMENTS, "SegmentBar: parts off by default, the cells form untouched");

/* THE KEY'S THIRD PART AND NO CAPTIONS (critique pass 3, fix round D1, item P1.5). The tax card's key stood 50px under its own bar and named two of
   the bar's three parts, and the bar's own captions ("Tax 18%", "You keep 82%") said the figure above and the missing row a second time. The key
   gains its third row, what is kept, whose swatch is the soft grey the bar's rest is drawn in (a 1px inset edge in --c-line-strong, as the rest
   carries one, since the soft grey alone is 1.19 to 1 on a white card), and the bar's continuous form draws no caption row unless it is handed
   words for one. */
/* THE EDGE IS ONE KEY, NOT A STRING COMPARED IN TWO FILES (fix round F1, group G5, the D1 review's Minor 4). FactRows drew the soft grey's edge when
   `r.swatch === "var(--c-soft2)"`, a literal that HomeProofs' TAX_INK writes too, so renaming the token in one file dropped the edge in silence. A row now
   says it carries the edge: `edged`, set where the tax key builds its kept row (HomeProofs.tsx), and the colour decides nothing. Nothing drawn changes: the
   home's key still draws the kept swatch edged (tests/home/home_answers.test.ts renders it). */
const softKey = renderToStaticMarkup(React.createElement(FactRows, { rows: [{ key: "keep", label: "You keep", value: "82%", swatch: "var(--c-soft2)", edged: true }, { key: "tax", label: "Income tax", value: "14%", swatch: "var(--c-ink)" }, { key: "soft", label: "Not the bar's rest", value: "3%", swatch: "var(--c-soft2)" }, { key: "inkEdged", label: "Edged ink", value: "4%", swatch: "var(--c-ink)", edged: true }] }));
const EDGE = ";box-shadow:inset 0 0 0 1px var(--c-line-strong)";
const swatchStyle = (k: string) => /data-swatch="" class="[^"]*" style="([^"]*)"/.exec(rowOf(softKey, k))?.[1] ?? "(none)";
check(`a row marked edged takes the 1px inset --c-line-strong edge whatever its colour; an unmarked row takes none, the soft grey included: the flag is the key and the colour decides nothing (keep "${swatchStyle("keep")}", inkEdged "${swatchStyle("inkEdged")}", tax "${swatchStyle("tax")}", soft "${swatchStyle("soft")}")`, swatchStyle("keep") === `background:var(--c-soft2)${EDGE}` && swatchStyle("inkEdged") === `background:var(--c-ink)${EDGE}` && swatchStyle("tax") === "background:var(--c-ink)" && swatchStyle("soft") === "background:var(--c-soft2)", FACT, "FactRows: add the 1px inset --c-line-strong edge to a swatch when the row's edged is true and in no other case; HomeProofs sets edged on the tax key's kept row, so no colour string is compared in the archetype");
check("FactRows names no colour to compare: neither --c-soft2 nor SOFT_SWATCH is in its code", !/--c-soft2|SOFT_SWATCH/.test(factCode), FACT, "delete SOFT_SWATCH from FactRows.tsx and draw the edge from the row's edged: the archetype compares no colour string the caller also writes");
const bareParts = renderToStaticMarkup(React.createElement(SegmentBar, { bare: true, tone: "ink", label: "Of 100 of profit", value: 18, figure: "18%", unit: "", parts: [{ key: "a", value: 14, fill: "var(--c-ink)" }, { key: "b", value: 4, fill: "var(--c-ink2)" }] }));
check("the stacked bar given no words draws no caption row under it: the bar and its rest alone", /data-continuous="1"/.test(bareParts) && !/data-part|data-rest="|mt-1 flex justify-between/.test(bareParts) && /<span data-rest-fill=""/.test(bareParts), SEGMENTS, "SegmentBar parts: draw the caption row only when part or rest is given");

/* THE RING'S LABEL IS ITS CAPTION'S, AND ITS CAP TURNS AT 90 (the closing cleanup of plan 2026-10-10, the home reformed to ship, item 13).
   The svg was labelled "97 of the whole" beside a caption that says what the 97 is of ("in 100 names found in the register"), so a
   screen reader met two accounts of one drawing. The label is now the figure and the caption's words when a caption is given (a
   caption that is a node is read for its text, a stamped figure in it included), and "of the whole" only when there is none. The cap is
   butt above 90 percent so a nearly closed ring shows no notch at twelve o'clock, round at 90 and under: pinned at its edge. */
const svgLabel = (html: string) => /<svg [^>]*aria-label="([^"]*)"/.exec(html)?.[1] ?? "";
const ringOf = (props: Record<string, unknown>) => renderToStaticMarkup(React.createElement(Ring, { value: 62, figure: "62%", ...props }));
check(`a ring with a caption is labelled by its figure and its caption, a node's text included, and one without by "of the whole" ("${svgLabel(big)}", "${svgLabel(lead)}", "${svgLabel(ringOf({}))}")`, svgLabel(big) === "38% of new firms, after 5 years" && svgLabel(lead) === "30,510 of 31,376 names found in the register" && svgLabel(ringOf({})) === "62% of the whole" && svgLabel(ringOf({ caption: "of the day" })) === "62% of the day", RING, "Ring: the svg's aria-label is the figure then the caption's words when a caption is given (a node by its text), else the figure then \"of the whole\"");
const capOf = (value: number) => /stroke-linecap="(butt|round)"/.exec(ringOf({ value, figure: String(value) }))?.[1] ?? "none";
check(`the sweep's cap is butt above 90 percent and round at 90 and under (91 ${capOf(91)}, 90 ${capOf(90)}, 89.9 ${capOf(89.9)}, 90.1 ${capOf(90.1)}, 100 ${capOf(100)}, 38 ${capOf(38)})`, capOf(91) === "butt" && capOf(90.1) === "butt" && capOf(100) === "butt" && capOf(90) === "round" && capOf(89.9) === "round" && capOf(38) === "round", RING, "Ring: strokeLinecap is butt when the share is over 0.9 and round at 0.9 and under");

/* MONTHBARS' PROV (the closing cleanup of plan 2026-10-10, the home reformed to ship, item 11). The twelve counts a MonthBars draws are
   figures, and the archive's second proof printed them with no data-src and no data-kind: a prov stamps the drawing's root with where
   they came from, as a figure's own element is stamped, and without it the drawing is exactly what it was. */
const MONTHS = "src/components/spine/archetypes/MonthBars.tsx";
const monthPoints = Array.from({ length: 12 }, (_, i) => ({ month: i, value: 1000 + 100 * i }));
const monthCounts = { words: "notices in {month}", aria: "Notices a month, {first} to {last}: {months}" };
const STAMP = { src: "home/archive.json:gazette.months", kind: "counted" as const };
const barsPlain = renderToStaticMarkup(React.createElement(MonthBars, { points: monthPoints, start: "2025-10", tone: "ink", counts: monthCounts }));
const barsStamped = renderToStaticMarkup(React.createElement(MonthBars, { points: monthPoints, start: "2025-10", tone: "ink", counts: monthCounts, prov: STAMP }));
check("a MonthBars given a prov stamps its drawing's root with data-src and data-kind, and one given none stamps nothing", /<div data-archetype="month-bars"[^>]*data-src="home\/archive\.json:gazette\.months" data-kind="counted"/.test(barsStamped) && !/data-src=|data-kind=/.test(barsPlain), MONTHS, "MonthBars prov: provAttrs(prov) on the Marks root, nothing when none is passed");
check("the stamp is the only difference: the drawing with a prov, less its stamps (the root's and the busiest count's), is the drawing without one", barsStamped.split(` data-src="${STAMP.src}" data-kind="${STAMP.kind}"`).join("") === barsPlain, MONTHS, "MonthBars prov changes the stamps' two attributes (the root's, and the busiest count's figure under tone ink) and nothing else");

/* MONTHBARS' LEGIBLE QUIET TONE (critique pass 2, P1.1). The quiet columns were the soft grey alone, 1.19 to 1 on white and without a
   number: tone ink now gives each quiet column a 2px cap in --control-line (3.25 to 1) so every height is drawn at 3:1, the busiest stays
   whole ink2 and prints its count over itself (12 semibold ink, tabular, centred, stamped as a figure is), the label's 16px taken out of
   the columns' height so the drawing is 96 tall as before. The default tone is what it was: the accent peak, the soft grey, no cap, no
   label row, columns 96 tall. */
const plainTone = renderToStaticMarkup(React.createElement(MonthBars, { points: monthPoints }));
const caps = (html: string) => (html.match(/box-shadow:inset 0 2px 0 var\(--control-line\)/g) ?? []).length;
check("a MonthBars in tone ink caps its eleven quiet columns (2px, --control-line), leaves the busiest whole in ink2 and prints its count over it in a 16px row, the columns 80 tall; the default tone has none of it and its columns stay 96 tall", caps(barsPlain) === 11 && /data-peak-row="" class="flex w-full gap-1" style="height:16px"/.test(barsPlain) && /class="flex w-full items-end gap-1" style="height:80px"/.test(barsPlain) && />2,100</.test(barsPlain) && caps(plainTone) === 0 && !/data-peak-row|data-peak-label/.test(plainTone) && /class="flex w-full items-end gap-1" style="height:96px"/.test(plainTone), MONTHS, "MonthBars tone ink: box-shadow inset 0 2px 0 var(--control-line) on each quiet column, a 16px data-peak-row over the columns, the columns' height H less 16; tone accent untouched");

/* BARLIST'S QUIET */
const BARS = "src/components/spine/charts/BarList.tsx";
const items = [{ key: "leeds", label: "Leeds", value: 41.8, display: "41.8", href: "/cities/leeds" }, { key: "glasgow", label: "Glasgow", value: 40.2, display: "40.2", href: "/cities/glasgow" }];
const loud = renderToStaticMarkup(React.createElement(BarList, { items, max: 100, look: "plain", mark: "leeds", fill: true, reference: { value: 38.4, label: "The UK" } }));
const quiet = renderToStaticMarkup(React.createElement(BarList, { items, max: 100, look: "plain", mark: "leeds", fill: true, quiet: true, reference: { value: 38.4, label: "The UK" } }));
const barStyles = (html: string) => [...html.matchAll(/data-bar="true"[^>]*style="([^"]*)"/g)].map((m) => m[1]);
check("a list's marked bar is the accent's gradient by default", /data-marked="1"[^>]*style="[^"]*var\(--terra\)/.test(loud), BARS, "keep the default marked bar in the accent's gradient");
check("a quiet list's marked bar is ink2 and no bar holds terracotta", /data-marked="1"[^>]*style="[^"]*background-color:var\(--c-ink2\)/.test(quiet) && barStyles(quiet).every((s) => !/terra/.test(s)), BARS, "BarList quiet: the marked bar's background var(--c-ink2)");
/* "NOTHING ELSE" IS COMPARED WHOLE. The check stripped every bar's style from both lists (each opens with `width:`), so an unmarked bar's
   recolour, or a wrong width under quiet, could not be seen. Now: each unmarked bar's style whole (the marked bar is the first row, Leeds), the
   marked bar's style apart from its two colour declarations (its width is what is left), and the rest of the markup with the bars' styles out.
   The two lists must show both bars, so a markup this reads nothing from is a red and never a pass. */
const uncoloured = (style: string) => style.split(";").filter((d) => !/^background-(?:color|image):/.test(d.trim())).join(";");
const withoutBarStyles = (html: string) => html.replace(/(data-bar="true"[^>]*) style="[^"]*"/g, "$1");
const apart = [
  ...(barStyles(loud).length !== items.length || barStyles(quiet).length !== items.length ? ["the bars it reads"] : []),
  ...(JSON.stringify(barStyles(loud).slice(1)) !== JSON.stringify(barStyles(quiet).slice(1)) ? ["an unmarked bar's style"] : []),
  ...(uncoloured(barStyles(loud)[0] ?? "") !== uncoloured(barStyles(quiet)[0] ?? "") ? ["the marked bar's width"] : []),
  ...(withoutBarStyles(loud) !== withoutBarStyles(quiet) ? ["the rest of the markup"] : []),
];
check(`quiet changes the marked bar's colour and nothing else${apart.length ? `: apart on ${apart.join(", ")}` : ""}`, apart.length === 0, BARS, "BarList quiet may change the marked bar's background-color and background-image only: no other bar's style, not the marked bar's width, nothing else in the markup");

/* THE COPY GATE'S TITLE, EVALUATED (fix round B). The gate's own line is read comment-stripped (a commented-out copy is no line) and run on
   jsdom cards: a level-2 Rail, a default Rail, an h2 that is no Rail's, a card with no heading, a Rail's h2 before an h3, and an h2 that
   is no Rail's before an h3. A regex over the raw source passed a gate that read the wrong heading, or none. */
const GATE = "scripts/harness/check_copy_plain.mjs";
const GATE_REMEDY = 'read the title as card.querySelector("h2[data-rail-title]") ?? card.querySelector("h3") in the code of the gate, not in a comment';
const titleExpr = /const title = ([^;\n]+);/.exec(stripCommentLines(readFileSync(GATE, "utf8").split("\n")).join("\n"))?.[1];
const titleOf = (html: string): string | null => {
  const card = new JSDOM(`<body><div>${html}</div></body>`).window.document.body.firstElementChild;
  return (new Function("card", `return ${titleExpr};`)(card) as Element | null)?.textContent ?? null;
};
const TITLE_CARDS: Array<[string, string, string | null]> = [
  ["a level-2 Rail's h2", h2, "Tax, rule by rule"],
  ["a default Rail's h3", h3, "Tax, rule by rule"],
  ["an h2 with no data-rail-title", "<h2>Not a Rail's title</h2>", null],
  ["a card with no heading", "<p>No heading</p>", null],
  ["a Rail's h2 before an h3", `${h2}<h3>An h3 after it</h3>`, "Tax, rule by rule"],
  ["an h2 with no data-rail-title before an h3", "<h2>Not a Rail's title</h2><h3>The h3</h3>", "The h3"],
];
const titleWrong = titleExpr ? TITLE_CARDS.map(([what, html, want]) => ({ what, got: titleOf(html), want })).filter((c) => c.got !== c.want) : [];
check(`the copy gate reads a card's title from a Rail's h2 where it has one, else its h3, evaluated on ${TITLE_CARDS.length} cards${!titleExpr ? ": its code holds no title line" : titleWrong.length ? `: wrong on ${titleWrong.map((c) => `${c.what} (${JSON.stringify(c.got)}, want ${JSON.stringify(c.want)})`).join(", ")}` : ""}`, !!titleExpr && titleWrong.length === 0, GATE, GATE_REMEDY);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/home_forms: all pass");
