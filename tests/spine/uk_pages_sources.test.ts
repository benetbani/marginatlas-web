/**
 * THE UK'S TRADE PAGES AND THE UK'S PAGE PRINT A SOURCED FIGURE, A MARKED ONE, OR NONE (masterplan step 04, 2026-10-05, London's
 * trade pages; plan 2026-10-08, every other UK city's; the labels audit of 2026-10-02, items 10, 17 and 18; QUEUE
 * country:cities-region-line).
 *
 * Run: npx tsx tests/spine/uk_pages_sources.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { sayTradeTypical, ukInsolvencyPer100, type UkTradeCards } from "../../src/lib/spine/uk_trade_typical";
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
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
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
check(`and says it is an estimate: "${kept.market?.hereBasis}"`, kept.market?.hereBasis === T.market.firmsHere);
check("its other cards say the trade's typical as London's do", kept.split?.basis === T.split && kept.team?.basis === T.team && kept.mix?.foot === T.mix && kept.customers?.basis === T.customers && kept.clears?.basis === T.clears && kept.market?.insolvent?.per100 === 2.9);
check("London's drops the density and carries no density line", said.market?.here === null && said.market?.hereBasis === undefined);
const rivalsSrc = readFileSync("src/components/spine/cell/market.tsx", "utf8");
check("the rivals cell prints the line the page hands it", /market\.here \? market\.hereBasis \?\? R\.basisHere : firms\.basis/.test(rivalsSrc));
for (const w of Object.values(T).flatMap((v) => (typeof v === "string" ? [v] : Object.values(v)))) {
  check(`"${w}" runs twelve words or fewer and never says "anywhere"`, w.split(/\s+/).length <= 12 && !/anywhere/i.test(w));
}
const view = readFileSync("src/components/spine/cell/cell-view.tsx", "utf8");
check("the cell view says it on a page held to a register region", /cityRegisterPlace\([^;]*\) \? sayTradeTypical\(builtCards/.test(view));
check("and on every other UK city's trade page, the city's density kept", /cityHeldToSources\(placeIso2, placeGeo\) \? sayTradeTypical\(builtCards, tradeSlug, \{ keepHere: true \}\)/.test(view));

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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_pages_sources: all pass");
