/**
 * THE UK'S TRADE PAGES AND THE UK'S PAGE PRINT A SOURCED FIGURE, A MARKED ONE, OR NONE (masterplan step 04, 2026-10-05, London's
 * trade pages; plan 2026-10-08, every other UK city's; the labels audit of 2026-10-02, items 10, 17 and 18; QUEUE
 * country:cities-region-line).
 *
 * Run: npx tsx tests/spine/uk_pages_sources.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { sayTradeTypical, ukInsolvencyPer100, type UkTradeCards } from "../../src/lib/spine/uk_trade_typical";
import { RivalsCell } from "../../src/components/spine/cell/market";
import { MarketCard } from "../../src/components/spine/city/opening";
import { cityOwnDensity, type MarketData } from "../../src/lib/spine/market_rows";
import { buildCityMarket, perTenThousand } from "../../src/lib/spine/city_market_rows";
import { buildPeerTable } from "../../src/lib/spine/peer_rows";
import { buildLocalsNotes } from "../../src/lib/spine/locals_rows";
import { buildHowToSteps } from "../../src/lib/spine/howto_steps_rows";
import { buildCountryExit } from "../../src/lib/spine/country_exit_rows";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "uk-pages-sources";
const FILE = "src/lib/spine";
const REMEDY = "on a UK page print a sourced figure, say in the card's one line whose figure it is, or withhold it";
/* Where a red is not about a figure's line: the cell view's wiring, and the one rounding the two pages print a density by. */
const VIEW_FILE = "src/components/spine/cell/cell-view.tsx";
const REMEDY_WIRING = "restore the cell view's wiring: a page held to a register region (cityRegisterPlace) takes sayTradeTypical(builtCards, tradeSlug), a page held to sources only (cityHeldToSources) takes sayTradeTypical(builtCards, tradeSlug, { keepHere: true }), every other page keeps builtCards, the place slug lowercased once before both";
const REMEDY_SAME_FIGURE = "round the density the trade page keeps as the city page prints it: sayTradeTypical's keepHere branch takes perTenThousand (src/lib/spine/city_market_rows.ts), the city market card's own fmt, so one figure stands on both pages";
const REMEDY_ESTIMATE_LINE = "a UK city's trade page keeps its density under a line that says estimate: sayTradeTypical sets COPY.tradeTypical.market.firmsHere as hereBasis under keepHere, and the copy key holds a line with the word";
const MARKET_VIEW = "src/components/spine/cell/market.tsx";
const REMEDY_COMPANION = "beside a UK city's own density the companion names the trade's typical in the foot's words: sayTradeTypical sets hereTypicalWords under keepHere to COPY.tradeTypical.market.firmsHereTypical and the rivals cell prints it, falling back to tradeMarket.rivals.typicalWords (which every page outside the UK ships) when the page hands none";
let failed = 0;
let firstRemedy = REMEDY;
const check = (label: string, ok: boolean, remedy = REMEDY, file = FILE) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  if (failed === 0) firstRemedy = remedy;
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
const T = COPY.tradeTypical;

/* Item 10: the world-typical cards say so on a London trade page. Fixtures in each builder's shape, the fields the rule reads. */
const fixture = {
  split: { state: "drawn", feed: "shard", basis: "Out of every $100 in sales." },
  team: { basis: "" },
  clears: { branch: "shard", basis: "Of each day's sales, the part that pays the costs." },
  mix: { basis: "", foot: "Out of every $100 in sales." },
  customers: { basis: "Spend per visit, times visits a year." },
  open: { basis: "" },
  market: {
    firms: { figure: "16", basis: "", tag: "modeled", value: 16 },
    chains: { part: 30, whole: 100, basis: "Out of every 100 firms.", tag: "modeled", value: 30 },
    close: { part: 20, whole: 100, basis: "Out of every 100 firms.", tag: "modeled", value: 20 },
    swing: { figure: "20%", basis: "The busiest month over the quietest.", tag: "modeled", value: 20 },
    here: { value: 9.1, tag: "modeled" },
  },
} as unknown as UkTradeCards;
const said = sayTradeTypical(fixture, "restaurants");
check(`the split says the trade's typical: "${said.split?.basis}"`, said.split?.basis === T.split);
check("a split off the sector profile says so", sayTradeTypical({ ...fixture, split: { ...(fixture.split as object), feed: "profile" } } as unknown as UkTradeCards, "restaurants").split?.basis === T.splitProfile);
check(`the team says whose roles and pay: "${said.team?.basis}"`, said.team?.basis === T.team);
check("the share off the shard is the trade's typical", said.clears?.basis === T.clears);
check("the share off the London engine is an estimate", sayTradeTypical({ ...fixture, clears: { ...(fixture.clears as object), branch: "engine" } } as unknown as UkTradeCards, "restaurants").clears?.basis === T.clearsEstimate);
check("the mix's line and the customer's year say the trade's typical", said.mix?.foot === T.mix && said.customers?.basis === T.customers);
check("the cost to open keeps its own lines", said.open === fixture.open);
check("the market drops the metro density", said.market?.here === null);
check(`the market's insolvencies are the register's: ${said.market?.insolvent?.per100} of 100 for restaurants`, said.market?.insolvent?.per100 === 2.9 && said.market?.insolvent?.words === T.insolvent);
check("the market cells say the trade's typical", !!said.market && "figure" in said.market.firms && said.market.firms.basis === T.market.firms && "part" in said.market.chains && said.market.chains.basis === T.market.chains && said.market.daypartsBasis === T.market.dayparts);
check("an unknown trade has no insolvency figure", ukInsolvencyPer100("zz-no-such-trade") === null);
/* Every other UK city's trade page (plan 2026-10-08, uk:cities-sourced-or-marked): the same lines; the city's own density stays,
   its line saying it is an estimate (its city page prints the same figure as one). London's still leaves. */
const kept = sayTradeTypical(fixture, "restaurants", { keepHere: true });
check(`a UK city's trade page keeps the city's own density (${kept.market?.here?.value})`, kept.market?.here?.value === 9.1);
/* A string, the copy's own line, and one that says "estimate": a deleted, renamed or reworded key leaves both sides undefined or a line that no longer says it. */
check(`and says it is an estimate: "${kept.market?.hereBasis}"`, typeof kept.market?.hereBasis === "string" && kept.market.hereBasis === T.market.firmsHere && /estimat/i.test(kept.market.hereBasis), REMEDY_ESTIMATE_LINE);
check("its other cards say the trade's typical as London's do", kept.split?.basis === T.split && kept.team?.basis === T.team && kept.mix?.foot === T.mix && kept.customers?.basis === T.customers && kept.clears?.basis === T.clears && kept.market?.insolvent?.per100 === 2.9);
check("London's drops the density and carries no density line or companion words", said.market?.here === null && said.market?.hereBasis === undefined && said.market?.hereTypicalWords === undefined);
const rivalsSrc = readFileSync("src/components/spine/cell/market.tsx", "utf8");
check("the rivals cell prints the line the page hands it", /market\.here \? market\.hereBasis \?\? R\.basisHere : firms\.basis/.test(rivalsSrc));
check("and the companion words the page hands it, the copy's otherwise", /words: market\.hereTypicalWords \?\? R\.typicalWords/.test(rivalsSrc), REMEDY_COMPANION, MARKET_VIEW);

/* THE RIVALS CELL AS A READER MEETS IT: the real component to markup, the focal figure and the companions' words read off it. */
const asRead = (html: string) => html.replace(/&#x27;/g, "'");
const rivalsOf = (market: unknown) => asRead(renderToStaticMarkup(React.createElement(RivalsCell, { market: market as MarketData })));
const leadOf = (html: string) => /<span class="fig block[^"]*">([^<]*)<\/span>/.exec(html)?.[1] ?? null;
const companionsOf = (html: string) => [...html.matchAll(/data-companion="true"[^>]*><span class="fig[^"]*">[^<]*<\/span><span class="[^"]*">([^<]*)<\/span>/g)].map((m) => m[1]);
const keptWith = (here: { value: number; tag: string } | null) => sayTradeTypical({ ...fixture, market: { ...(fixture.market as object), here } } as unknown as UkTradeCards, "restaurants", { keepHere: true });

/* THE SAME FIGURE ON BOTH PAGES (plan 2026-10-08, decision 4): the density the trade page keeps rounds as the city page prints it,
   one decimal and whole where whole, so a shard's 13.95 reads 13.9 on both and never 13.95 on the one. */
for (const [shard, printed] of [[13.95, "13.9"], [11.92, "11.9"], [1.05, "1.1"], [9.1, "9.1"], [5, "5"]] as const) {
  const lead = leadOf(rivalsOf(keptWith({ value: shard, tag: "modeled" }).market));
  check(`a shard's ${shard} reads ${printed} on the trade page and on the city page (${lead} against ${perTenThousand(shard)})`, lead === printed && printed === perTenThousand(shard), REMEDY_SAME_FIGURE);
}
const leedsCard = asRead(renderToStaticMarkup(React.createElement(MarketCard, { market: buildCityMarket("leeds") })));
check("Leeds's city page prints restaurants at 13.9, the card's own markup", leedsCard.includes(">13.9</span>") && !leedsCard.includes("13.95</span>"), REMEDY_SAME_FIGURE);
/* Every trade of the six cities' market cards, the figure the city page prints against the figure the trade page's cell prints
   (the trade page reads the same shard row by the trade's exact name). */
const SIX_CITIES = ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"] as const;
for (const slug of SIX_CITIES) {
  const rows = buildCityMarket(slug)?.rows ?? [];
  check(`${slug}'s city page draws its trades' densities (${rows.length} rows)`, rows.length >= 3, REMEDY_SAME_FIGURE);
  for (const r of rows) {
    const cityPrints = perTenThousand(r.value);
    const own = cityOwnDensity("GB", slug, r.name);
    const tradePrints = own ? leadOf(rivalsOf(keptWith(own).market)) : null;
    check(`${slug}, ${r.name}: the trade page prints ${cityPrints} as the city page does (${tradePrints})`, tradePrints === cityPrints, REMEDY_SAME_FIGURE);
  }
}

/* THE COMPANION BESIDE IT: the foot already says "beside the trade's typical", so the companion names the trade's typical in those
   words and not "the trade anywhere", which would name one figure twice. London's page (no density) and a page outside the UK
   (the cell view hands it the cards unsaid) are unchanged. */
const keptCell = rivalsOf(kept.market);
check(`a UK city's trade page words the trade's figure beside its own density: ${companionsOf(keptCell).join(" | ")}`, typeof T.market.firmsHereTypical === "string" && companionsOf(keptCell)[0] === T.market.firmsHereTypical && T.market.firmsHereTypical === "the trade's typical", REMEDY_COMPANION);
check("and the cell says \"anywhere\" nowhere", !/anywhere/i.test(keptCell), REMEDY_COMPANION);
const londonCell = rivalsOf(said.market);
check(`London's cell keeps its one companion, the register's insolvencies: ${companionsOf(londonCell).join(" | ")}`, companionsOf(londonCell).length === 1 && companionsOf(londonCell)[0] === T.insolvent && leadOf(londonCell) === "16", REMEDY_COMPANION);
const ukFree = rivalsOf(fixture.market);
check(`a page outside the UK keeps "the trade anywhere" beside the city's own density: ${companionsOf(ukFree).join(" | ")}`, COPY.tradeMarket.rivals.typicalWords === "the trade anywhere" && companionsOf(ukFree)[0] === COPY.tradeMarket.rivals.typicalWords && leadOf(ukFree) === "9.1", REMEDY_COMPANION);
for (const w of Object.values(T).flatMap((v) => (typeof v === "string" ? [v] : Object.values(v)))) {
  check(`"${w}" runs twelve words or fewer and never says "anywhere"`, w.split(/\s+/).length <= 12 && !/anywhere/i.test(w));
}
/* THE CELL VIEW'S WIRING, THE WHOLE TERNARY IN ITS ORDER: the register branch first (London, its density leaving), then the sources
   branch with keepHere (the six, their density kept), then the built cards as they are (everywhere else). Two loose patterns passed
   with the branches swapped, or with the last one gone; the one pattern does not. The place slug is lowercased once before both. */
const view = readFileSync(VIEW_FILE, "utf8");
check("the cell view takes the register branch, then the sources branch with keepHere, then the built cards", /cityRegisterPlace\(placeIso2, placeGeo\)\s*\?\s*sayTradeTypical\(builtCards, tradeSlug\)\s*:\s*cityHeldToSources\(placeIso2, placeGeo\)\s*\?\s*sayTradeTypical\(builtCards, tradeSlug, \{ keepHere: true \}\)\s*:\s*builtCards\b/.test(view), REMEDY_WIRING, VIEW_FILE);
check("and lowercases the place slug once, before both predicates", /placeGeo = String\(d\.meta\?\.geo \?\? ""\)\.toLowerCase\(\)/.test(view), REMEDY_WIRING, VIEW_FILE);

/* Item 17: the peers' line says their figures are estimates on the UK's page; elsewhere unchanged. */
check("the UK's peers say their figures are estimates", buildPeerTable("GB")?.caveat === COPY.peers.caveatEstimates);
check("France's peers keep their line", buildPeerTable("FR")?.caveat === COPY.peers.caveat);
/* His ruling of 2026-10-05 on PARKED P04.2 (the peers kept, called estimates): the line is drawn on /gb, not only built (from
   2026-09-25 to 2026-10-05 the view dropped every caveat, so it never printed). Read off the harness's render. */
const gbRender = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8").replace(/&#x27;/g, "'") : "";
if (gbRender) check(`/gb's peers card prints "${COPY.peers.caveatEstimates}"`, gbRender.slice(gbRender.indexOf('id="peers"')).includes(COPY.peers.caveatEstimates));

/* Item 17: the UK's locals notes, each with its source. */
const locals = buildLocalsNotes("GB");
check(`the UK's locals notes each name a source (${locals?.notes.length} notes)`, !!locals && locals.notes.length === 2 && locals.notes.every((n) => typeof n.source === "string" && n.source.length > 0));
check("the unsourced notes are gone", !!locals && !locals.notes.some((n) => /headline rent|payroll is not/i.test(n.label)));

/* Item 18: the bank account's wait, and the total it drove. */
const steps = buildHowToSteps("GB");
const bank = steps?.steps.find((s) => /bank account/i.test(s.name));
check(`the bank account's wait prints the dash, no figure (${bank?.days})`, !!bank && bank.days === "–");
check("no total stands, the line says why, and the count of steps is the figure", !!steps && steps.totalDays === null && steps.basis === COPY.howToSteps.basisNoTotal && steps.count === steps.steps.length);
check("the company's own registration keeps its day", !!steps && steps.steps.some((s) => /register the company/i.test(s.name) && s.days === "1 day"));

/* Item 18: the exit card holds nothing sourced on the UK's page. */
check("the UK's exit card does not draw", buildCountryExit("GB") === null);
check("France's still does", buildCountryExit("FR") !== null);

/* The cities' line: one source, one depth. */
const cards = buildCityCards("GB");
const sub = (slug: string) => cards?.cards.find((c) => c.id === slug)?.sub;
check(`every UK city says its nation (${cards?.cards.map((c) => `${c.id}: ${c.sub}`).join(", ")})`, !!cards && cards.cards.length >= 4 && cards.cards.every((c) => c.sub === "England" || c.sub === "Scotland"));
check("London and Leeds read the same depth", sub("london") === "England" && (sub("leeds") === undefined || sub("leeds") === "England"));

if (failed > 0) { redSummary(RULE, failed, firstRemedy, "checks failed"); process.exit(1); }
console.log("spine/uk_pages_sources: all pass");
