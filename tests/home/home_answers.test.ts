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
import { londonTradeHero, londonTradeStrip, londonShareAbove } from "../../src/lib/spine/london_trade_hero";
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
  check(`its share is the masthead's "${p.above.label}" ${p.above.figure}, ${p.above.part} of 100 drawn`, !!above && p.above.label === above.label && p.above.figure === String(above.value) && String(above.value) === `${londonShareAbove(EXAMPLE_TRADE)} of 100` && p.above.part === londonShareAbove(EXAMPLE_TRADE));
  check(`step 4 is the UK's insolvencies for the trade, ${p.insolvent.figure}, worked out`, rate != null && p.insolvent.figure === `${pageRate(rate)} of 100` && p.insolvent.prov.src === `uk/registers/failures.json:${EXAMPLE_TRADE}` && p.insolvent.prov.kind === "worked out" && p.insolvent.n === "4");
  /* A WHOLE RATE (fix round B): no trade of the slice has one today, so the builder is handed 3, 2.9, 0.5 and 12 and each is read against
     the trade page's own card; the home wrote "3.0" where the page wrote "3" while the builder used toFixed(1). */
  const written = [3, 2.9, 0.5, 12].map((r) => ({ r, home: buildWorkedExample(EXAMPLE_TRADE, r)?.pays.insolvent.figure, page: pageRate(r) }));
  check(`a rate per 100 is written as the London trade page writes it, whole or not (${written.map((w) => `${w.r}: ${w.home} | ${w.page}`).join(", ")})`, written.every((w) => w.page !== "" && w.home === `${w.page} of 100`) && written[0].page === "3", { remedy: "write step 4's rate as String of the number, as src/components/spine/cell/market.tsx prints it (RivalsCell), so a whole rate reads 3 on the home and on the trade page" });
  const lines = [s.registered.line, s.sales.line, p.breakEven.line, p.insolvent.line];
  check(`every step's line is twelve words at most, no semicolon, and says how its figure was made (${lines.map(words).join(", ")} words)`, lines.every((l) => words(l) <= 12 && !l.includes(";")) && /^Counted\b/.test(lines[0]) && /^Worked out\b/.test(lines[1]) && /^An estimate\b/.test(lines[2]) && /worked out/.test(lines[3]), { file: COPY_FILE, remedy: "cut COPY.home.example's lines to twelve words, no semicolon, each opening with its figure's kind as About the figures names it" });
  check(`the two titles are four words at most ("${s.title}", "${p.title}")`, words(s.title) <= 4 && words(p.title) <= 4, { file: COPY_FILE, remedy: "cut COPY.home.example.placeTitle and paysTitle to four words" });
  check(`the left door opens the London page (${ex.href})`, ex.href === `/gb/london/${EXAMPLE_TRADE}`);
}

/* THE DRAWING (Task 7): the halves, each step's numeral where a row's glyph stands, every figure stamped, one 40 (step 3, the page's
   first loud moment), the share as 100 units in ink2, the doors. A red here is HomeExample.tsx's to put right. */
const DRAWN_AT = { file: "src/components/spine/home/HomeExample.tsx", remedy: "draw the halves as HomeExample holds them: the steps in order with their numerals, step 2 the card's 30 on the strip, step 3 the page's one 40 in the accent with the share as 100 units in ink2, every figure stamped, the doors to the London page and to #search" };
if (ex) {
  const place = renderToStaticMarkup(React.createElement(HomePlace, { ex }));
  const pays = renderToStaticMarkup(React.createElement(HomePays, { ex }));
  const steps = (h: string) => [...h.matchAll(/data-step="(\d)"/g)].map((m) => m[1]).join("");
  check(`the steps run 1 and 2 on the left, 3 and 4 on the right (${steps(place)} | ${steps(pays)})`, steps(place) === "12" && steps(pays) === "34", DRAWN_AT);
  check(`each half's title is its own h2 ("${ex.place.title}", "${ex.pays.title}")`, new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${reEsc(esc(ex.place.title))}</h2>`).test(place) && new RegExp(`<h2 [^>]*data-rail-title=""[^>]*>${reEsc(esc(ex.pays.title))}</h2>`).test(pays), DRAWN_AT);
  const figs = (h: string) => [...h.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure on the left says where it came from (${figs(place).length}: the count and the strip's three)`, figs(place).length === 4 && figs(place).every((f) => /data-src="uk\/registers\/turnover\.json:restaurants:E12000007"/.test(f) && /data-kind="/.test(f)), DRAWN_AT);
  check(`every figure on the right says where it came from (${figs(pays).length}: break-even, its share, the insolvencies)`, figs(pays).length === 3 && figs(pays).every((f) => /data-src="/.test(f) && /data-kind="/.test(f)), DRAWN_AT);
  /* EACH FIGURE AS DRAWN IS THE BUILDER'S (fix round B), by its text, its data-src and its data-kind, against the seven triples the builder
     holds: the count, the strip's three marks, break-even, its share, the insolvencies. A figure stamped with another figure's source, or
     with a kind the builder did not give it, passes the two checks above; it does not pass this one. */
  const drawn = (h: string) => [...h.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>[^<]*/g)].map((m) => `${m[0].slice(m[0].lastIndexOf(">") + 1)} | ${/data-src="([^"]*)"/.exec(m[0])?.[1]} | ${/data-kind="([^"]*)"/.exec(m[0])?.[1]}`).sort();
  const held = (steps: Array<[string, Provenance]>) => steps.map(([t, v]) => `${t} | ${v.src} | ${v.kind}`).sort();
  const wantL = held([[ex.place.registered.figure, ex.place.registered.prov], ...ex.place.strip.map((m): [string, Provenance] => [usd(m.value), m.prov])]);
  const wantR = held([[ex.pays.breakEven.figure, ex.pays.breakEven.prov], [ex.pays.above.figure, ex.pays.above.prov], [ex.pays.insolvent.figure, ex.pays.insolvent.prov]]);
  const gotL = drawn(place), gotR = drawn(pays);
  const apart = [...wantL.filter((t) => !gotL.includes(t)).map((t) => `missing left ${t}`), ...gotL.filter((t) => !wantL.includes(t)).map((t) => `drawn left ${t}`), ...wantR.filter((t) => !gotR.includes(t)).map((t) => `missing right ${t}`), ...gotR.filter((t) => !wantR.includes(t)).map((t) => `drawn right ${t}`)];
  check(`each figure drawn is the builder's, by text, data-src and data-kind (${gotL.length + gotR.length} of ${wantL.length + wantR.length})${apart.length ? `: ${apart.join(", ")}` : ""}`, wantL.length + wantR.length === 7 && apart.length === 0, DRAWN_AT);
  /* THE 30 AND THE 40 ARE COUNTED BY THE RUNG EACH FIGURE IS DRAWN AT: one 30 on the left, the strip's typical; on the right one figure at
     30 or 40 and it is step 3's 40 (a second 30 in a card would be a second loud figure; PART 4). */
  const rung = (h: string, r: string) => figs(h).filter((f) => f.includes(`--t-${r})`)).length;
  check(`the left card holds one figure at 30 (${rung(place, "focal")}) and none at 40; the right holds exactly one at 30 or 40, step 3's 40 (${rung(pays, "focal")} at 30, ${rung(pays, "answer")} at 40)`, rung(place, "focal") === 1 && rung(place, "answer") === 0 && rung(pays, "focal") === 0 && rung(pays, "answer") === 1, DRAWN_AT);
  check("step 2 is the card's 30, on the strip of three marks", new RegExp(`--t-focal[^"]*"[^>]*>${reEsc(ex.place.sales.figure)}<`).test(place) && /data-archetype="range-strip"/.test(place) && /data-marks="3"/.test(place), DRAWN_AT);
  const accentsL = place.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  const accentsR = pays.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  check(`step 3 is the page's one 40, in the accent, the example's only accent (${accentsL.length} left, ${accentsR.length} right)`, accentsL.length === 0 && accentsR.length === 1 && (pays.match(/data-hero-figure/g) ?? []).length === 1 && new RegExp(`data-hero-figure[^>]*--t-answer[^>]*terra-text[^>]*data-src="uk/pnl:restaurants:E12000007" data-kind="estimate">${reEsc(ex.pays.breakEven.figure)}<`).test(pays), DRAWN_AT);
  const units = /data-units="(\d+)"/.exec(pays)?.[1];
  const inked = (pays.match(/background:var\(--c-ink2\);border-color:var\(--c-ink2\)/g) ?? []).length;
  check(`the share is ${units} units with ${inked} inked in ink2, never the accent`, units === "100" && inked === ex.pays.above.part && !/background:var\(--terra\)/.test(pays), DRAWN_AT);
  check("the doors: the London page on the left, the picker on the right", place.includes(`href="${ex.href}"`) && place.includes(`>${esc(ex.place.door)}<`) && pays.includes('href="#search"') && pays.includes(`>${esc(ex.pays.door)}<`), DRAWN_AT);
  check("steps 2 and 3 carry their line at 14, not a small line (the copy gate's LINES reads 13.5px and under)", [[place, ex.place.sales.line], [pays, ex.pays.breakEven.line]].every(([h, l]) => new RegExp(`<p data-focal-words="" class="[^"]*--t-body[^"]*">${reEsc(esc(l))}</p>`).test(h)), DRAWN_AT);
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
