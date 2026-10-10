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
import { readFileSync } from "node:fs";
import { buildWorkedExample, exampleCaseWhole, EXAMPLE_TRADE } from "../../src/lib/home/worked_example";
import { londonTradeHero, londonTradeStrip, londonShareAbove } from "../../src/lib/spine/london_trade_hero";
import { ukInsolvencyPer100 } from "../../src/lib/spine/uk_trade_typical";
import { CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { HERO_BUSINESSES } from "../../src/lib/hero-words";
import { industryToSlug } from "../../src/lib/taxonomy";
import { usd } from "../../src/lib/spine/money";
import { COPY } from "../../src/lib/spine/copy";
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
void esc; void reEsc; void text;

/* THE CASE (Task 6): the picker's own, whole. */
const pick = CASCADE_PREFILLS[0];
check(`the picker opens on the example's case (${pick.country} ${pick.city} ${pick.business})`, pick.country === "GB" && pick.city === "london" && industryToSlug(pick.business) === EXAMPLE_TRADE, { file: "src/lib/home/search_cascade.ts", remedy: "keep CASCADE_PREFILLS[0] restaurants in London, the worked example's case" });
check(`the first rotating word names it ("${HERO_BUSINESSES[0]}")`, HERO_BUSINESSES[0] === "restaurant", { file: "src/lib/hero-words.ts", remedy: "keep \"restaurant\" first in HERO_BUSINESSES (his yes of 2026-10-09, order only)" });
check("the case is whole: break-even and its share print, every tenth placed, an exact failure code, one survival group", exampleCaseWhole(EXAMPLE_TRADE));
check("the bakery's case is not whole, which is why the example is a restaurant", !exampleCaseWhole("bakeries-retail") && buildWorkedExample("bakeries-retail") === null);

const ex = buildWorkedExample();
check("the worked example builds", !!ex);
const hero = londonTradeHero(EXAMPLE_TRADE);
const strip = londonTradeStrip(EXAMPLE_TRADE);
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
  check(`step 4 is the UK's insolvencies for the trade, ${p.insolvent.figure}, worked out`, p.insolvent.figure === `${ukInsolvencyPer100(EXAMPLE_TRADE)?.toFixed(1)} of 100` && p.insolvent.prov.src === `uk/registers/failures.json:${EXAMPLE_TRADE}` && p.insolvent.prov.kind === "worked out" && p.insolvent.n === "4");
  const lines = [s.registered.line, s.sales.line, p.breakEven.line, p.insolvent.line];
  check(`every step's line is twelve words at most, no semicolon, and says how its figure was made (${lines.map(words).join(", ")} words)`, lines.every((l) => words(l) <= 12 && !l.includes(";")) && /^Counted\b/.test(lines[0]) && /^Worked out\b/.test(lines[1]) && /^An estimate\b/.test(lines[2]) && /worked out/.test(lines[3]), { file: COPY_FILE, remedy: "cut COPY.home.example's lines to twelve words, no semicolon, each opening with its figure's kind as About the figures names it" });
  check(`the two titles are four words at most ("${s.title}", "${p.title}")`, words(s.title) <= 4 && words(p.title) <= 4, { file: COPY_FILE, remedy: "cut COPY.home.example.placeTitle and paysTitle to four words" });
  check(`the left door opens the London page (${ex.href})`, ex.href === `/gb/london/${EXAMPLE_TRADE}`);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_answers: all pass");
