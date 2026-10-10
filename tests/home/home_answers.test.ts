/**
 * THE WORKED EXAMPLE AND THE THIRD PROOF ON THE HOME PAGE (the spec docs/superpowers/specs/2026-10-09-home-introduction-design.md in
 * the design repo, sections 2 and 4, approved as written on 2026-10-09; plan docs/superpowers/plans/2026-10-09-home-introduction.md,
 * Tasks 6, 7, 8 and 10). The picker's own case, restaurants in London, answered in four steps, each figure the London page's own under
 * the same name, from the same builder, with its kind; the case whole (break-even and its share print, every tenth placed, an exact
 * failure code, one survival group); the picker's default and the first rotating word name it; the one 40 is step 3; the tax proof is
 * /gb's masthead figure, its line naming the profit and the year's rules. Holds the builders (src/lib/home/worked_example.ts,
 * src/lib/home/proofs.ts), the drawings (HomeExample.tsx, HomeProofs.tsx) and, where the harness wrote them, the renders of the home,
 * London restaurants and /gb.
 *
 * Run: npx tsx tests/home/home_answers.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { buildWorkedExample, exampleCaseWhole, exampleCaseClauses, EXAMPLE_TRADE } from "../../src/lib/home/worked_example";
import { londonTradeHero, londonTradeStrip, londonShareAbove, PREMISES_NOUN } from "../../src/lib/spine/london_trade_hero";
import { ukInsolvencyPer100 } from "../../src/lib/spine/uk_trade_typical";
import { CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { HERO_BUSINESSES } from "../../src/lib/hero-words";
import { industryToSlug } from "../../src/lib/taxonomy";
import { usd } from "../../src/lib/spine/money";
import { COPY } from "../../src/lib/spine/copy";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePlace, HomePays } from "../../src/components/spine/home/HomeExample";
import { buildProofs } from "../../src/lib/home/proofs";
import { ProofTax } from "../../src/components/spine/home/HomeProofs";
import { SEGMENT_BAR_CELLS } from "../../src/components/spine/archetypes/SegmentBar";
import { RivalsCell } from "../../src/components/spine/cell/market";
import type { MarketData } from "../../src/lib/spine/market_rows";
import type { Provenance } from "../../src/lib/spine/provenance";
import { buildHeroBoard } from "../../src/lib/spine/hero_board";
import { ukTaxOnProfit } from "../../src/lib/spine/uk_tax_on_profit";
import { UK_2026_27 } from "../../src/lib/uk/law/params_2026_27";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-answers";
const FILE = "src/lib/home/worked_example.ts";
const REMEDY = "print on the home page each figure the London restaurant page prints, from the same builder, under the same name, stamped with its kind; the tax proof the figure /gb's masthead prints";
const COPY_FILE = "src/lib/spine/copy.ts";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
/** A string as React writes it into markup. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Markup reduced to its text runs, each between bars. */
const text = (h: string) => h.replace(/<[^>]+>/g, "|").replace(/\|+/g, "|");

/* THE CASE (Task 6): the picker's own, whole. */
const pick = CASCADE_PREFILLS[0];
check(`the picker opens on the example's case (${pick.country} ${pick.city} ${pick.business})`, pick.country === "GB" && pick.city === "london" && industryToSlug(pick.business) === EXAMPLE_TRADE, { file: "src/lib/home/search_cascade.ts", remedy: "keep CASCADE_PREFILLS[0] restaurants in London, the worked example's case" });
check(`the first rotating word names it ("${HERO_BUSINESSES[0]}")`, HERO_BUSINESSES[0] === "restaurant", { file: "src/lib/hero-words.ts", remedy: "keep \"restaurant\" first in HERO_BUSINESSES (his yes of 2026-10-09, order only)" });
/* THE CASE IS WHOLE, CLAUSE BY CLAUSE (fix round B). exampleCaseWhole is five clauses (exampleCaseClauses names them). The trade the
   example works holds every one; and a trade of today's slices that fails each clause shows the clause is there, so a clause dropped
   or weakened leaves its trade whole, or its name missing, and turns a check below red. These are facts of the slices, which move: the
   remedy for a red here is another default trade, or the slice restored. */
const WHOLE_AT = { remedy: "the slices moved under the example's case: choose another default trade (CASCADE_PREFILLS[0] in src/lib/home/search_cascade.ts, then EXAMPLE_TRADE) whose London page prints every figure the example holds, or restore the slice (registers/uk/export_for_site.py)" };
const CLAUSES = ["money", "share", "placed", "exact", "survival"];
const clause = (slug: string, k: string) => (exampleCaseClauses(slug) as Record<string, boolean | undefined>)[k];
check(`the case is whole: break-even and its share print, every tenth placed, an exact failure code, one survival group (${CLAUSES.map((k) => `${k} ${clause(EXAMPLE_TRADE, k)}`).join(", ")})`, exampleCaseWhole(EXAMPLE_TRADE) && JSON.stringify(Object.keys(exampleCaseClauses(EXAMPLE_TRADE))) === JSON.stringify(CLAUSES) && CLAUSES.every((k) => clause(EXAMPLE_TRADE, k) === true), WHOLE_AT);
const NOT_WHOLE: Array<[string, string[], string]> = [
  ["bakeries-retail", ["money", "share", "survival"], "its break-even prints nowhere (its recipe carries no utilities), so no share, and its survival maps to two groups; which is why the example is a restaurant"],
  ["nail-salons", ["placed", "exact"], "a tenth of its strip is not placed and its failures sit on a shared code"],
  ["sports-fitness", ["placed", "exact"], "a tenth of its strip is not placed and its failures sit on a shared code"],
];
for (const [slug, failing, why] of NOT_WHOLE) {
  check(`${slug} is not whole, and fails ${failing.join(", ")} (${why})`, !exampleCaseWhole(slug) && buildWorkedExample(slug) === null && failing.every((k) => clause(slug, k) === false), WHOLE_AT);
}

const ex = buildWorkedExample();
check("the worked example builds", !!ex);
const hero = londonTradeHero(EXAMPLE_TRADE);
const strip = londonTradeStrip(EXAMPLE_TRADE);
/** A rate per 100 as the London trade page writes it: its market card (RivalsCell) rendered with that rate, the companion figure read. */
const pageRate = (per100: number): string => {
  const html = renderToStaticMarkup(React.createElement(RivalsCell, { market: { firms: { withheld: "w" }, here: null, close: { withheld: "w" }, insolvent: { per100, words: "w" } } as unknown as MarketData }));
  return /data-companion[^>]*><span[^>]*class="[^"]*\bfig\b[^"]*"[^>]*>([^<]*)</.exec(html)?.[1] ?? "";
};
const rate = ukInsolvencyPer100(EXAMPLE_TRADE);
if (ex && hero && strip) {
  const firms = hero.cells.find((c) => c.key === "firms");
  const above = hero.cells.find((c) => c.key === "above");
  const typical = strip.marks.find((m) => m.key === "typical");
  const s = ex.place, p = ex.pays;
  check(`step 1 is the London page's registered businesses: "${s.registered.label}" ${s.registered.figure}, counted`, !!firms && s.registered.label === firms.label && s.registered.figure === String(firms.value) && s.registered.prov.src === firms.prov?.src && s.registered.prov.kind === "counted" && s.registered.n === "1");
  check(`step 2 is the strip's typical, ${s.sales.figure}, worked out, under the London pages' own label "${s.sales.label}"`, !!typical && s.sales.figure === usd(typical.value) && s.sales.prov.src === typical.prov.src && s.sales.prov.kind === "worked out" && s.sales.label === COPY.londonTrade.salesLabel && s.sales.n === "2");
  check(`the strip is the London page's own three marks (${s.strip.map((m) => usd(m.value)).join(", ")})`, s.strip.length === 3 && JSON.stringify(s.strip) === JSON.stringify(strip.marks));
  check(`step 3 is the masthead's answer: "${p.breakEven.label}" ${p.breakEven.figure}, an estimate`, p.breakEven.label === hero.answer.label && p.breakEven.figure === hero.answer.value && p.breakEven.prov.src === hero.answer.prov.src && p.breakEven.prov.kind === "estimate" && p.breakEven.n === "3");
  /* THE SAME WORDS ON BOTH PAGES (plan 2026-10-10, home reform, Task 3; the critique's P1.5): the London page stands "Already take that
     much" over its figure, the home runs the same words after its figure, the first letter lowered ("32 of 100 already take that much"). */
  check(`its share is the masthead's "${above?.label}" ${p.above.figure}, said after the figure as "${p.above.label}", ${p.above.part} of 100 drawn`, !!above && /^Already\b/.test(above.label) && p.above.label === above.label.charAt(0).toLowerCase() + above.label.slice(1) && p.above.figure === String(above.value) && String(above.value) === `${londonShareAbove(EXAMPLE_TRADE)} of 100` && p.above.part === londonShareAbove(EXAMPLE_TRADE));
  check(`step 4 is the UK's insolvencies for the trade, ${p.insolvent.figure}, worked out`, rate != null && p.insolvent.figure === `${pageRate(rate)} of 100` && p.insolvent.prov.src === `uk/registers/failures.json:${EXAMPLE_TRADE}` && p.insolvent.prov.kind === "worked out" && p.insolvent.n === "4");
  /* A WHOLE RATE (fix round B): no trade of the slice has one today, so the builder is handed 3, 2.9, 0.5 and 12 and each is read against
     the trade page's own card; the home wrote "3.0" where the page wrote "3" while the builder used toFixed(1). */
  const written = [3, 2.9, 0.5, 12].map((r) => ({ r, home: buildWorkedExample(EXAMPLE_TRADE, r)?.pays.insolvent.figure, page: pageRate(r) }));
  check(`a rate per 100 is written as the London trade page writes it, whole or not (${written.map((w) => `${w.r}: ${w.home} | ${w.page}`).join(", ")})`, written.every((w) => w.page !== "" && w.home === `${w.page} of 100`) && written[0].page === "3", { remedy: "write step 4's rate as String of the number, as src/components/spine/cell/market.tsx prints it (RivalsCell), so a whole rate reads 3 on the home and on the trade page" });
  const lines = [s.registered.line, s.sales.line, p.breakEven.line, p.insolvent.line];
  check(`every step's line is twelve words at most, no semicolon, and says how its figure was made (${lines.map(words).join(", ")} words)`, lines.every((l) => words(l) <= 12 && !l.includes(";")) && /^Counted\b/.test(lines[0]) && /^Worked out\b/.test(lines[1]) && /^An estimate\b/.test(lines[2]) && /worked out/.test(lines[3]), { file: COPY_FILE, remedy: "cut COPY.home.example's lines to twelve words, no semicolon, each opening with its figure's kind as About the figures names it" });
  check(`the two titles are four words at most ("${s.title}", "${p.title}")`, words(s.title) <= 4 && words(p.title) <= 4, { file: COPY_FILE, remedy: "cut COPY.home.example.placeTitle and paysTitle to four words" });
  /* STEP 3'S LINE (plan 2026-10-10, home reform, Task 3; the critique's P2.5): one run of words, no comma, still opening with its kind. */
  check(`step 3's line reads "${p.breakEven.line}"`, p.breakEven.line === COPY.home.example.breakEven.replace("{noun}", PREMISES_NOUN.Restaurants) && !p.breakEven.line.includes(","), { file: COPY_FILE, remedy: "COPY.home.example.breakEven: \"An estimate of the yearly sales that carry an average London {noun}.\", the noun the builder's (PREMISES_NOUN)" });
  check(`the left door opens the London page (${ex.href})`, ex.href === `/gb/london/${EXAMPLE_TRADE}`);
}

/* THE DRAWING (Task 7 of the home introduction; reformed by plan 2026-10-10, the home reformed to ship, Task 3): the halves on one
   anatomy, every step its numeral and its name, its figure flush left, its line, then its drawing (P1.4), a hairline between steps 1
   and 2 and between steps 3 and 4 and none under the titles; every figure stamped; on the left one 30, step 2's, on a line of its own
   over the London page's three marks drawn on a log strip whose names stand on one row, with its round values, the typical printed
   once (P0.5); on the right one 40, step 3's, the page's first loud moment, its share as 100 units in 25 columns, the 32 in the accent
   and the rest in the soft grey (P1.5); the numerals alone (P2.2), the wallet glyph on "Does it pay?" (P2.1), the doors in ink with
   their arrows (P1.7). A red here is HomeExample.tsx's to put right. */
const EXAMPLE_VIEW = "src/components/spine/home/HomeExample.tsx";
const DRAWN_AT = { file: EXAMPLE_VIEW, remedy: "draw the halves as HomeExample holds them: every step its numeral and name, its figure flush left, its line, its drawing; step 2's figure at 30 on its own line over the log strip (oneRow, decades, the typical headless); step 3 the page's one 40 in the accent with its share as 100 units in 25 columns (fine), the 32 in the accent; every figure stamped; the doors in ink at 14, weight 500, an arrow after, underlined on hover only" };
if (ex) {
  const place = renderToStaticMarkup(React.createElement(HomePlace, { ex }));
  const pays = renderToStaticMarkup(React.createElement(HomePays, { ex }));
  const steps = (h: string) => [...h.matchAll(/data-step="(\d)"/g)].map((m) => m[1]).join("");
  check(`the steps run 1 and 2 on the left, 3 and 4 on the right (${steps(place)} | ${steps(pays)})`, steps(place) === "12" && steps(pays) === "34", DRAWN_AT);
  check(`each half's title is its own h2 ("${ex.place.title}", "${ex.pays.title}")`, new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${reEsc(esc(ex.place.title))}</h2>`).test(place) && new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${reEsc(esc(ex.pays.title))}</h2>`).test(pays), DRAWN_AT);
  const figs = (h: string) => [...h.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure on the left says where it came from (${figs(place).length}: the count, step 2's figure and the strip's two ends)`, figs(place).length === 4 && figs(place).every((f) => /data-src="uk\/registers\/turnover\.json:restaurants:E12000007"/.test(f) && /data-kind="/.test(f)), DRAWN_AT);
  check(`every figure on the right says where it came from (${figs(pays).length}: break-even, its share, the insolvencies)`, figs(pays).length === 3 && figs(pays).every((f) => /data-src="/.test(f) && /data-kind="/.test(f)), DRAWN_AT);
  /* EACH FIGURE AS DRAWN IS THE BUILDER'S (fix round B), by its text, its data-src and its data-kind, against the seven triples the builder
     holds: the count, the strip's three marks, break-even, its share, the insolvencies. A figure stamped with another figure's source, or
     with a kind the builder did not give it, passes the two checks above; it does not pass this one. Since plan 2026-10-10 the strip's
     typical is drawn as step 2's own figure line, the same triple. */
  const drawn = (h: string) => [...h.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>[^<]*/g)].map((m) => `${m[0].slice(m[0].lastIndexOf(">") + 1)} | ${/data-src="([^"]*)"/.exec(m[0])?.[1]} | ${/data-kind="([^"]*)"/.exec(m[0])?.[1]}`).sort();
  const held = (steps: Array<[string, Provenance]>) => steps.map(([t, v]) => `${t} | ${v.src} | ${v.kind}`).sort();
  const wantL = held([[ex.place.registered.figure, ex.place.registered.prov], ...ex.place.strip.map((m): [string, Provenance] => [usd(m.value), m.prov])]);
  const wantR = held([[ex.pays.breakEven.figure, ex.pays.breakEven.prov], [ex.pays.above.figure, ex.pays.above.prov], [ex.pays.insolvent.figure, ex.pays.insolvent.prov]]);
  const gotL = drawn(place), gotR = drawn(pays);
  const apart = [...wantL.filter((t) => !gotL.includes(t)).map((t) => `missing left ${t}`), ...gotL.filter((t) => !wantL.includes(t)).map((t) => `drawn left ${t}`), ...wantR.filter((t) => !gotR.includes(t)).map((t) => `missing right ${t}`), ...gotR.filter((t) => !wantR.includes(t)).map((t) => `drawn right ${t}`)];
  check(`each figure drawn is the builder's, by text, data-src and data-kind (${gotL.length + gotR.length} of ${wantL.length + wantR.length})${apart.length ? `: ${apart.join(", ")}` : ""}`, wantL.length + wantR.length === 7 && apart.length === 0, DRAWN_AT);
  /* THE 30 AND THE 40 ARE COUNTED BY THE RUNG EACH FIGURE IS DRAWN AT: one 30 on the left, step 2's; on the right one figure at 30 or 40
     and it is step 3's 40 (a second 30 in a card would be a second loud figure; PART 4). */
  const rung = (h: string, r: string) => figs(h).filter((f) => f.includes(`--t-${r})`)).length;
  check(`the left card holds one figure at 30 (${rung(place, "focal")}) and none at 40; the right holds exactly one at 30 or 40, step 3's 40 (${rung(pays, "focal")} at 30, ${rung(pays, "answer")} at 40)`, rung(place, "focal") === 1 && rung(place, "answer") === 0 && rung(pays, "focal") === 0 && rung(pays, "answer") === 1, DRAWN_AT);
  /* THE NUMERALS ALONE (P2.2): 16 semibold in the muted grey, in the glyph's 28px column, no tile. */
  const numerals = [...`${place}${pays}`.matchAll(/<span data-step="\d" aria-hidden="true" class="([^"]*)">\d<\/span>/g)].map((m) => m[1]);
  check(`each numeral stands alone in the 28px column, 16 semibold in the muted grey (${numerals.length})`, numerals.length === 4 && numerals.every((c) => /\bh-7\b/.test(c) && /\bw-7\b/.test(c) && /--t-lead/.test(c) && /\bfont-semibold\b/.test(c) && /text-\[var\(--c-muted\)\]/.test(c) && !/\bbg-/.test(c) && !/\bborder\b/.test(c) && !/terra/.test(c)), DRAWN_AT);
  /* ONE ANATOMY (P1.4): each step a block, its numeral and name, its figure, its line, in that order. */
  const block = (h: string, n: string) => { const at = h.indexOf(`data-step-block="${n}"`); if (at < 0) return ""; const next = h.indexOf("data-step-block=", at + 1); return h.slice(at, next < 0 ? undefined : next); };
  const inOrder = (b: string, parts: string[]) => parts.every((s, i) => b.indexOf(s) > -1 && (i === 0 || b.indexOf(s) > b.indexOf(parts[i - 1])));
  const STEPS: Array<[string, string, { label: string; figure: string; line: string }]> = [["1", place, ex.place.registered], ["2", place, ex.place.sales], ["3", pays, ex.pays.breakEven], ["4", pays, ex.pays.insolvent]];
  check("every step on one anatomy: its numeral and its name, then its figure, then its line", STEPS.every(([n, h, s]) => inOrder(block(h, n), [`data-step="${n}"`, `>${esc(s.label)}<`, `>${esc(s.figure)}<`, `>${esc(s.line)}<`])), DRAWN_AT);
  /* THE LINE'S RUNG: beside a 16 the third rung (12, muted), with no focal words for the zone's rule to raise to 14; beside a 30 or a 40,
     14 in ink2 (the copy gate's LINES reads 13.5px and under, so each half keeps one small line). */
  const lineOf = (b: string, line: string) => new RegExp(`<p( data-focal-words="")? class="([^"]*)">${reEsc(esc(line))}</p>`).exec(b);
  const third = [lineOf(block(place, "1"), ex.place.registered.line), lineOf(block(pays, "4"), ex.pays.insolvent.line)];
  const body = [lineOf(block(place, "2"), ex.place.sales.line), lineOf(block(pays, "3"), ex.pays.breakEven.line)];
  check("steps 1 and 4 carry their line at the third rung (12, muted, no focal words); steps 2 and 3 at 14 in ink2", third.every((m) => !!m && !m[1] && /--t-micro/.test(m[2]) && /text-\[var\(--c-muted\)\]/.test(m[2])) && body.every((m) => !!m && !!m[1] && /--t-body/.test(m[2]) && /text-\[var\(--c-ink2\)\]/.test(m[2])), DRAWN_AT);
  /* NO ORPHANS (the Task 3 review): step 3's line left "restaurant." alone on a second line at 1024, and step 1's broke between "March"
     and "2026." at 768 and on a 360px phone. Every step's line asks the browser to balance its last line (text-pretty, as the quotes in
     src/components/kit/blocks/OperatorVoices.tsx do), and step 1 writes its month with a no-break space, so a month and its year never
     part. */
  const pretty = [...third, ...body].filter((m) => !!m && /\btext-pretty\b/.test(m[2])).length;
  const joined = /[A-Z][a-z]+\u00A0\d{4}\.$/.test(ex.place.registered.line);
  check(`every step's line asks for a balanced last line (text-pretty on ${pretty} of 4), and step 1 writes its month and year with a no-break space (${joined ? "joined" : `"${ex.place.registered.line}" may break between them`})`, pretty === 4 && joined, { file: EXAMPLE_VIEW, remedy: "add text-pretty to both lines' <p> in HomeExample.tsx's Step, and write the month in src/lib/home/worked_example.ts with a no-break space at the {month} splice (month.replace(\" \", \"\\u00A0\"))" });
  const ruled = (h: string, n: string) => new RegExp(`data-step-block="${n}" class="[^"]*\\bborder-t\\b`).test(h);
  const underTitle = (h: string, n: string) => h.slice(h.indexOf('data-rail=""'), h.indexOf(`data-step-block="${n}"`));
  check("a hairline between steps 1 and 2 and between steps 3 and 4, none under the titles", ruled(place, "2") && ruled(pays, "4") && !ruled(place, "1") && !ruled(pays, "3") && !/border-t/.test(underTitle(place, "1")) && !/border-t/.test(underTitle(pays, "3")), DRAWN_AT);
  /* THE STRIP (P0.5): step 2's figure on its own line at 30, printed once; the London page's three marks on a log track, the names on one
     row, the powers of ten inside the range as round values, read off the strip's own data. */
  const sales = ex.place.sales.figure;
  const salesTimes = (place.match(new RegExp(`>${reEsc(sales)}<`, "g")) ?? []).length;
  check(`step 2's figure stands at 30 on a line of its own, and the strip prints it no second time (${salesTimes})`, new RegExp(`data-step-block="2"[\\s\\S]*?--t-focal\\)\\] leading-none text-\\[var\\(--c-ink\\)\\]" data-src="[^"]+" data-kind="worked out">${reEsc(sales)}<`).test(place) && salesTimes === 1 && !/data-mark="typical"/.test(place), DRAWN_AT);
  const values = ex.place.strip.map((m) => m.value);
  const lo = Math.min(...values), hi = Math.max(...values);
  const decades: number[] = [];
  for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) if (10 ** e > lo && 10 ** e < hi) decades.push(10 ** e);
  const nameTops = [...place.matchAll(/data-mark-label="(?:p10|typical|p90)"[^>]*top:(\d+)px/g)].map((m) => m[1]);
  const rounds = [...place.matchAll(/data-scale-label="true"[^>]*>([^<]*)</g)].map((m) => m[1]);
  check(`the sales on a log strip of three marks, its names on one row (tops ${nameTops.join(", ")}), its round values ${rounds.join(" and ")}`, /data-archetype="range-strip" data-idea="I12" data-marks="3" data-scale="log"/.test(place) && nameTops.length === 3 && new Set(nameTops).size === 1 && decades.length === 2 && JSON.stringify(rounds) === JSON.stringify(decades.map(usd)), DRAWN_AT);
  /* THE UNITS (P1.5): 100 in 25 columns, 2px apart under 1024 and 4 from it, the share in the accent (fills follow their figure, PART 6),
     the rest in the soft grey; the head the figure at 16 semibold in ink, then the words at 14 in ink2. */
  const unitsTag = /<div data-units="(\d+)"[^>]*class="([^"]*)"[^>]*style="([^"]*)"/.exec(pays);
  const inked = (pays.match(/background:var\(--terra\);border-color:var\(--terra\)/g) ?? []).length;
  const soft = (pays.match(/background:var\(--c-soft2\);border-color:var\(--c-border\)/g) ?? []).length;
  check(`the share is ${unitsTag?.[1]} units in 25 columns, the ${inked} that take that much in the accent and ${soft} in the soft grey`, unitsTag?.[1] === "100" && /grid-template-columns:repeat\(25, minmax\(0, 1fr\)\)/.test(unitsTag?.[3] ?? "") && /\bgap-\[2px\] lg:gap-\[4px\]/.test(unitsTag?.[2] ?? "") && inked === ex.pays.above.part && soft === 100 - ex.pays.above.part && !/background:var\(--c-ink2\);border-color/.test(pays), DRAWN_AT);
  check(`the units' head: "${ex.pays.above.figure}" at 16 semibold in ink, then "${ex.pays.above.label}" at 14 in ink2`, new RegExp(`data-units-head=""[^>]*>[\\s\\S]*?--t-lead\\)\\] font-semibold leading-5 text-\\[var\\(--c-ink\\)\\]"[^>]*>${reEsc(ex.pays.above.figure)}</span><span class="text-\\[length:var\\(--t-body\\)\\] leading-5 text-\\[var\\(--c-ink2\\)\\]">${reEsc(esc(ex.pays.above.label))}</span>`).test(pays), DRAWN_AT);
  /* THE DOORS (P1.7): ink at 14, weight 500, an arrow after, underlined on hover only; the words in a span of their own. */
  const door = (h: string, href: string, words: string) => new RegExp(`<a href="${reEsc(href)}" class="([^"]*)"><span>${reEsc(esc(words))}</span><span aria-hidden="true">→</span></a>`).exec(h)?.[1] ?? null;
  const doors = [door(place, ex.href, ex.place.door), door(pays, "#search", ex.pays.door)];
  check("the doors: the London page on the left, the picker on the right, each in ink at 14, weight 500, an arrow after, underlined on hover only", doors.every((c) => c !== null && /text-\[var\(--c-ink\)\]/.test(c) && /--t-body/.test(c) && /\bfont-medium\b/.test(c) && /\bno-underline\b/.test(c) && /\bhover:underline\b/.test(c)), DRAWN_AT);
  /* THE GLYPH (P2.1): "Does it pay?" carries the wallet, money in and out, not break-even's crossing lines. */
  const exampleSrc = readFileSync(EXAMPLE_VIEW, "utf8");
  check("\"Does it pay?\" carries the wallet glyph (owner-keeps), not break-even's cross", /<Rail icon="owner-keeps" kicker=\{P\.title\} level=\{2\} \/>/.test(exampleSrc) && !/icon="break-even"/.test(exampleSrc), DRAWN_AT);
  const accentsL = place.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  const accentsR = pays.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  check(`step 3 is the page's one 40, in the accent, the example's only accent text (${accentsL.length} left, ${accentsR.length} right)`, accentsL.length === 0 && accentsR.length === 1 && (pays.match(/data-hero-figure/g) ?? []).length === 1 && new RegExp(`data-hero-figure[^>]*--t-answer[^>]*terra-text[^>]*data-src="uk/pnl:restaurants:E12000007" data-kind="estimate">${reEsc(ex.pays.breakEven.figure)}<`).test(pays), DRAWN_AT);
}

/* THE THIRD PROOF (Task 8): the formulas, /gb's masthead figure under its own name, its line the profit and the year's rules, the
   masthead's own data, drawn as the segment bar; the home's second loud moment. */
const proofs = buildProofs();
check("the three proofs build", !!proofs, { file: "src/lib/home/proofs.ts", remedy: "build the proofs from buildJoins, buildArchive and buildHomeAnswers' answer" });
const board = buildHeroBoard("GB");
const uk = ukTaxOnProfit();
if (proofs && uk) {
  const t = proofs.tax;
  check(`the tax proof is /gb's masthead: "${t.label}" ${t.figure}, worked out`, t.label === board.answer?.label && t.figure === board.answer?.value && t.prov.src === board.answer?.prov?.src && t.prov.kind === "worked out", { file: "src/lib/home/proofs.ts", remedy: "take the tax proof from buildHomeAnswers' answer, the figure buildHeroBoard prints" });
  check(`its line names the profit and the year's rules ("${t.line}")`, t.line === COPY.home.proofs.tax.words.replace("{profit}", usd(uk.profitUsd)).replace("{year}", UK_2026_27.taxYear) && words(t.line) <= 12 && !t.line.includes(";"), { file: COPY_FILE, remedy: "COPY.home.proofs.tax.words: the profit and the law's year, twelve words at most" });
  const PROOF_DATA_AT = { file: "src/lib/home/proofs.ts", remedy: "take the tax proof's bar and door from buildHomeAnswers' answer" };
  check("its bar takes the masthead's own data (the value, the tax and what is kept)", !!board.answerBar && t.bar.value === board.answerBar.value && t.bar.part === board.answerBar.part && t.bar.rest === board.answerBar.rest, PROOF_DATA_AT);
  check(`its door is /gb's answer (${t.href})`, t.href === "/gb#take", PROOF_DATA_AT);
  const PROOF_AT = { file: "src/components/spine/home/HomeProofs.tsx", remedy: "draw the tax proof as ProofTax holds it: a door card, its title an h2, the figure's name over its 30 in the accent, its line, the masthead's data as the segment bar" };
  const html = renderToStaticMarkup(React.createElement(ProofTax, { p: t }));
  check("it is a door card to /gb's answer", /id="tax"/.test(html) && /data-keep-card=""/.test(html) && /<a href="\/gb#take" data-lands="[a-z-]+"/.test(html), PROOF_AT);
  check(`its title is an h2, "${COPY.home.proofs.tax.kicker}", and the figure's name stands over the figure`, new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${reEsc(esc(COPY.home.proofs.tax.kicker))}</h2>`).test(html) && html.indexOf(`>${esc(t.label)}<`) > -1 && html.indexOf(`>${esc(t.label)}<`) < html.indexOf(`>${t.figure}<`), PROOF_AT);
  const accents = html.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  check(`its figure, at 30, is the card's one accent (${accents.length})`, accents.length === 1 && new RegExp(`data-focal="1" class="fig text-\\[length:var\\(--t-focal\\)\\] leading-none text-\\[var\\(--terra-text\\)\\]" data-src="[^"]+" data-kind="worked out">${reEsc(t.figure)}<`).test(html), PROOF_AT);
  check("its bar is drawn as the segment bar in its split form, under the measure", /data-archetype="segment-bar"/.test(html) && /data-form="split"/.test(html) && /max-w-\[28ch\]/.test(html), PROOF_AT);
  /* THE LINE AND THE BAR AS DRAWN (fix round B): the line stands as the card's one small line, and the bar fills the cells the masthead's
     share asks of it (SEGMENT_BAR_CELLS, the nearest cell), the tax named at its left end and what is kept at its right. */
  const filled = Math.round(Math.max(0, Math.min(1, t.bar.value / 100)) * SEGMENT_BAR_CELLS);
  check(`its line is drawn as the card's one small line ("${t.line}")`, html.includes(`>${esc(t.line)}</p>`), PROOF_AT);
  check(`its bar fills ${filled} of ${SEGMENT_BAR_CELLS} cells for ${t.bar.value.toFixed(1)} of 100, the tax named at the left and what is kept at the right`, html.includes(`data-filled="${filled}"`) && html.includes(`data-segments="${SEGMENT_BAR_CELLS}"`) && !!t.bar.part && !!t.bar.rest && html.includes(`<span data-part="true">${esc(t.bar.part)}</span>`) && html.includes(`<span data-rest="true">${esc(t.bar.rest)}</span>`), PROOF_AT);
}

/* THE RENDERS (Task 10), where the harness wrote them (pages-fresh renders them first in the chain). */
const homeR = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
const cellR = existsSync("scratchpad/harness/pages/cell-gb-london-restaurants.html") ? readFileSync("scratchpad/harness/pages/cell-gb-london-restaurants.html", "utf8") : "";
const gbR = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
if (ex && homeR && cellR) {
  const cellT = text(cellR);
  const five = [ex.place.registered.figure, ex.place.sales.figure, ex.pays.breakEven.figure, ex.pays.above.figure, ex.pays.insolvent.figure.split(" ")[0]];
  check(`London restaurants' page prints the figures the example prints (${five.join(", ")})`, five.every((f) => cellT.includes(`|${f}|`)));
  const card = (id: string) => { const at = homeR.indexOf(`id="${id}"`); if (at < 0) return ""; const next = homeR.indexOf("data-zone-cell", at + 1); return homeR.slice(at, next < 0 ? undefined : next); };
  const place = text(card("place")), pays = text(card("pays"));
  check("the home prints each step in its half", place.includes(`|${ex.place.registered.figure}|`) && place.includes(`|${ex.place.sales.figure}|`) && pays.includes(`|${ex.pays.breakEven.figure}|`) && pays.includes(`|${ex.pays.insolvent.figure}|`));
  check("the home holds one 40, step 3's", (homeR.match(/data-hero-figure/g) ?? []).length === 1 && card("pays").includes("data-hero-figure"));
  /* THE SHARE'S WORDS ON BOTH PAGES (plan 2026-10-10, home reform, Task 3; the critique's P1.5): the London page stands the label over its
     figure, the home runs the same words after its own. */
  const aboveLabel = hero?.cells.find((c) => c.key === "above")?.label ?? "";
  check(`London restaurants' page reads "${aboveLabel}" and the home "${ex.pays.above.label}", the same words`, aboveLabel !== "" && cellT.includes(`|${aboveLabel}|`) && pays.includes(`|${ex.pays.above.label}|`) && aboveLabel.toLowerCase() === ex.pays.above.label.toLowerCase());
  /* THE SALES STRIP ON BOTH PAGES (the Task 3 review; the critique's P0.5: "the London page's 01 spread takes the same scale, so the two
     pages read alike"): the home draws the London page's three marks on a log track, so the page's own strip stands on the same track
     and each tick on both stands at the same place along it. Read off the two renders: the strip's scale, and the left edge of its three
     ticks, which RangeStrip places by one function. */
  const stripOf = (h: string, id: string) => {
    const at = h.indexOf(`id="${id}"`);
    const from = at < 0 ? -1 : h.indexOf('data-archetype="range-strip"', at);
    if (from < 0) return null;
    const s = h.slice(from, from + 8000);
    return { scale: /data-scale="(log|linear)"/.exec(s)?.[1] ?? "", ticks: [...s.matchAll(/class="absolute w-px -translate-x-1\/2" style="left:([0-9.]+)%/g)].slice(0, 3).map((m) => m[1]) };
  };
  const onHome = stripOf(homeR, "place"), onCell = stripOf(cellR, "spread");
  check(`the London page's sales strip stands on the home's log track (${onCell?.scale ?? "no strip"} | ${onHome?.scale ?? "no strip"}; ticks at ${onCell?.ticks.join(", ") ?? "none"} | ${onHome?.ticks.join(", ") ?? "none"} percent, the typical's the middle one)`, !!onHome && !!onCell && onHome.scale === "log" && onCell.scale === "log" && onHome.ticks.length === 3 && onHome.ticks.join() === onCell.ticks.join(), { file: "src/components/spine/cell/cell-view.tsx", remedy: "draw the trade page's `01 spread` strip with scale=\"log\" and decades (cell-view.tsx Spread), as HomeExample.tsx draws the same three marks, so the typical stands where a log scale puts it on both pages" });
}
if (proofs && homeR && gbR) {
  const answerAt = gbR.indexOf('data-answer="1"');
  check(`/gb's render prints the tax proof's figure in its answer, ${proofs.tax.figure}`, answerAt > 0 && text(gbR.slice(answerAt, answerAt + 1200)).includes(`|${proofs.tax.figure}|`));
  const at = homeR.indexOf('id="tax"');
  check("the home prints the tax proof behind its door", at > 0 && text(homeR.slice(at, at + 4000)).includes(`|${proofs.tax.figure}|`) && homeR.slice(at, at + 4000).includes('href="/gb#take"'));
}
if (!homeR || !cellR || !gbR) console.log("DEFER  a harness render (home-gb, cell-gb-london-restaurants or country-GB) is not here; the render checks did not run");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_answers: all pass");
