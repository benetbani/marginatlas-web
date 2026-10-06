/**
 * THE UK'S HEADLINE ANSWERS ON THE HOME PAGE (milestone 3, masterplan step 34; his ruling 11 of 2026-09-26: "a place-and-trade
 * search, then the UK's headline answers"). Each answer is the same figure, under the same name, in the same unit, as the /gb
 * section it opens, read from the same builder and checked against /gb's own render; each carries where it came from; each
 * section is a door to that section of /gb; the answer is the page's one 40.
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
/* Its rows (masterplan step 37): the masthead's first two other taxes, the same names and rates as /gb's plus, so the three doors
   end level (MODEL PART 10.5); corporation tax says it is a company's, since the answer's basis is a sole trader. */
const others = (board.taxes ?? []).slice(0, 2);
check(`the UK's answer carries the masthead's first two other taxes (${others.map((r) => `${r.label} ${r.value}`).join(", ")}), each stamped`, !!a && others.length === 2 && JSON.stringify(a.rows?.map((r) => [r.label, r.value])) === JSON.stringify(others.map((r) => [r.label, r.value])) && (a.rows ?? []).every((r) => !!r.prov?.src && !!r.prov?.kind));
check("corporation tax says it is a company's; VAT keeps the masthead's threshold", !!a && a.rows?.find((r) => r.key === "corporation_tax")?.note === COPY.home.answerNotes.companyOnly && !!others.find((r) => r.key === "vat")?.note && a.rows?.find((r) => r.key === "vat")?.note === others.find((r) => r.key === "vat")?.note);
const sales = buildLondonTradeSales();
const t = by("trades");
check(`what London's trades take is /gb's middle trade, ${sales ? usd(londonMiddleSales(sales)) : "none"}`, !!t && !!sales && t.figure === usd(londonMiddleSales(sales)) && t.kicker === COPY.londonSales.kicker && t.words === COPY.londonSales.focalWords);
check("its four rows are /gb's first four, the same names, values and sources", !!t && !!sales && JSON.stringify(t.rows?.map((r) => [r.label, r.value, r.prov?.src])) === JSON.stringify(sales.rows.slice(0, 4).map((r) => [r.name, usd(r.value), r.prov?.src])));
const surv = buildSurvival("GB");
const y = by("years");
check(`who is still trading is /gb's, ${surv ? `${Math.round(surv.last.pct)}% after ${surv.last.year} years` : "none"}`, !!y && !!surv && y.figure === `${Math.round(surv.last.pct)}%` && y.kicker === COPY.firstYears.kicker && y.words === COPY.firstYears.focalWords.replace("{n}", String(surv.last.year)));
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
const answerCard = home.slice(home.indexOf('id="answer"'), home.indexOf('id="trades"'));
check(`the answer's card prints the two other taxes (${others.map((r) => r.value).join(", ")})`, others.length === 2 && others.every((r) => text(answerCard).includes(`|${r.value}|`)));
const ia = home.indexOf('id="answer"');
const zs = home.lastIndexOf("<section data-zone", ia);
check("the answers' level ends level: its three doors stretch to one height (MODEL PART 10.5)", ia > 0 && zs >= 0 && /data-zone-even/.test(home.slice(zs, ia)));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_answers: all pass");
