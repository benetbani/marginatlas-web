/**
 * THE UK'S HEADLINE ANSWERS ON THE HOME PAGE (milestone 3, masterplan step 34; his ruling 11 of 2026-09-26: "a place-and-trade
 * search, then the UK's headline answers"). Each answer is the same figure, under the same name, in the same unit, as the /gb
 * section it opens, read from the same builder and checked against /gb's own render; each carries where it came from; each
 * section is a door to that section of /gb; the answer is the page's one 40. Since his instruction of 2026-10-07 ("reform home
 * drastically"): one name, one figure, one line a card, no rows, and each figure drawn (the masthead's bar, the range of
 * London's trades, a ring), so no card is a lone figure (clause 65).
 *
 * Run: npx tsx tests/home/home_answers.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { buildHomeAnswers } from "../../src/lib/spine/home_answers";
import { buildHeroBoard } from "../../src/lib/spine/hero_board";
import { buildLondonTradeSales, londonMiddleSales } from "../../src/lib/spine/country_depth_rows";
import { buildSurvival } from "../../src/lib/spine/sections/first_years";
import { usd } from "../../src/lib/spine/money";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-answers";
const FILE = "src/lib/spine/home_answers.ts";
const REMEDY = "print on the home page the figure /gb prints, from the same builder, under the same name, stamped, as a door to its section";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const answers = buildHomeAnswers("GB");
check(`three answers, in the page's order (${answers.map((a) => a.key).join(", ")})`, JSON.stringify(answers.map((a) => a.key)) === JSON.stringify(["answer", "trades", "years"]));
const by = (k: string) => answers.find((a) => a.key === k);

const board = buildHeroBoard("GB");
const a = by("answer");
check(`the UK's answer is the masthead's: "${board.answer?.label}" ${board.answer?.value}, ${board.answerBasis}`, !!a && a.kicker === board.answer?.label && a.figure === board.answer?.value && a.words === board.answerBasis && a.prov?.src === board.answer?.prov?.src);
check("the UK's answer is drawn with the masthead's own bar", !!a && !!a.bar && !!board.answerBar && a.bar.value === board.answerBar.value && a.bar.part === board.answerBar.part && a.bar.rest === board.answerBar.rest);
const sales = buildLondonTradeSales();
const t = by("trades");
check(`what London's trades take is /gb's middle trade, ${sales ? usd(londonMiddleSales(sales)) : "none"}`, !!t && !!sales && t.figure === usd(londonMiddleSales(sales)) && t.kicker === COPY.londonSales.kicker && t.words === COPY.londonSales.focalWords);
const sorted = sales ? sales.rows.map((r) => r.value).sort((x, z) => x - z) : [];
check(`it is drawn on the range of /gb's ${sorted.length} London trades, their lowest to their highest, every trade a hairline, the marker at the middle`, !!t?.range && !!sales && t.range.range.min === sorted[0] && t.range.range.max === sorted[sorted.length - 1] && t.range.range.median === londonMiddleSales(sales) && t.range.range.count === sorted.length && JSON.stringify(t.range.values) === JSON.stringify(sorted) && t.range.range.p25 <= t.range.range.median && t.range.range.median <= t.range.range.p75);
const surv = buildSurvival("GB");
const y = by("years");
check(`who is still trading is /gb's, ${surv ? `${Math.round(surv.last.pct)}% after ${surv.last.year} years` : "none"}`, !!y && !!surv && y.figure === `${Math.round(surv.last.pct)}%` && y.kicker === COPY.firstYears.kicker && y.words === COPY.firstYears.focalWords.replace("{n}", String(surv.last.year)));
check("its share is drawn as a ring, the cohort's own last point", !!y && !!surv && y.ring === surv.last.pct);
check("every answer says where its figure came from", answers.every((x) => !!x.prov?.src && !!x.prov?.kind));
check("each is a door to its section of /gb (#take, #money, #first-years)", JSON.stringify(answers.map((x) => x.href)) === JSON.stringify(["/gb#take", "/gb#money", "/gb#first-years"]));

/* Against the renders: /gb prints the same figures, and the home page prints them stamped, as doors, with one 40. */
const text = (h: string) => h.replace(/<[^>]+>/g, "|").replace(/\|+/g, "|");
const gb = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
const after = (h: string, marker: string, n = 1200) => { const i = h.indexOf(marker); return i < 0 ? "" : text(h.slice(i, i + n)); };
check("/gb's render prints the same three figures", !!a && !!t && !!y && after(gb, 'data-answer="1"').includes(`|${a.figure}|`) && after(gb, 'id="money"').includes(`|${t.figure}|`) && after(gb, 'id="first-years"').includes(`|${y.figure}|`));
for (const x of answers) {
  const card = home.slice(home.indexOf(`id="${x.id}"`), home.indexOf(`id="${x.id}"`) + 4000);
  check(`the home page's ${x.key} prints ${x.figure}, stamped, behind a door to ${x.href}`, home.includes(`id="${x.id}"`) && text(card).includes(`|${x.figure}|`) && new RegExp(`data-src="${x.prov.src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(card) && card.includes(`href="${x.href}"`) && /data-lands="[a-z-]+"/.test(card));
}
check("the home page holds one 40, the UK's answer", (home.match(/data-hero-figure/g) ?? []).length === 1);
/* One figure a card and its drawing (his instruction of 2026-10-07; clause 65): no rows, a drawing in each. */
const cardOf = (id: string, next: string | null) => home.slice(home.indexOf(`id="${id}"`), next ? home.indexOf(`id="${next}"`) : home.indexOf(`id="${id}"`) + 6000);
const cardsHtml = [cardOf("answer", "trades"), cardOf("trades", "years"), cardOf("years", null)];
check("no answer card prints rows (FactRows), and each holds a drawing", cardsHtml.every((c) => !/data-archetype="fact-rows"/.test(c) && /data-visual="1"/.test(c)));
check("the answer's bar, the trades' range and the years' ring are drawn", /data-archetype="segment-bar"/.test(cardsHtml[0]) && /data-archetype="world-range"/.test(cardsHtml[1]) && /data-archetype="ring"/.test(cardsHtml[2]));
const ia = home.indexOf('id="answer"');
const zs = home.lastIndexOf("<section data-zone", ia);
check("the answers' level ends level: its three doors stretch to one height (MODEL PART 10.5)", ia > 0 && zs >= 0 && /data-zone-even/.test(home.slice(zs, ia)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_answers: all pass");
