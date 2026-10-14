/**
 * STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C; spec sections 2 and 3; R5 section 5, slots 3 to 5, and 5b by the
 * controller's ruling on Q1): customers city by city (the national typical pay at 30, one row of city cards, the cities past the row behind
 * the plus, the tenths behind theirs), what households spend on (the UK's form, the share bar, on every country; the people file's ages
 * behind the plus), what trades take (London's sales, the UK's alone, MONEY), what trades keep (the net margins where the seed holds them,
 * SHARE, never on the UK), on the UK, Cambodia, Afghanistan and Germany; each slot read clean by the answer-type gate; no city's pay printed
 * twice.
 * BLIND SPOT, stated: the builders and the components' markup; the page's order and layout are Task 4's gates'. Germany's margins are read
 * from the harness snapshot (data/archetypes/net_margin_snapshot.json), standing in for the seed's live rows.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_market.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildCustomersSlot, buildSpendSlot, buildTradesSlot, buildMarginsSlot, CITY_CARDS_SHOWN, cardsShown } from "../../src/lib/spine/slots/market";
import { CustomersSlot, SpendSlot, TradesSlot, MarginsSlot } from "../../src/components/spine/country/slots/StageMarket";
import { buildCityCards } from "../../src/lib/spine/city_cards";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { marginCardFromSnapshot } from "../../src/lib/spine/margin_rows";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { usd } from "../../src/lib/spine/money";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-market";
const FILE = "src/lib/spine/slots/market.ts";
const REMEDY = "build the market's slots from today's builders: each its lead of the slot's type, its folds of one type each, every figure once, the slot omitted where its data is absent";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const clean = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);

check("the row of cards: every city up to five (a fold of one is no fold), four past that", cardsShown(1) === 1 && cardsShown(4) === 4 && cardsShown(5) === 5 && cardsShown(6) === CITY_CARDS_SHOWN && cardsShown(8) === CITY_CARDS_SHOWN);
for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const c = buildCustomersSlot(iso2);
  const typical = Math.round(getCountryProfile(iso2).median_wage_full_time_usd as number);
  check(`${iso2} slot 3 draws, its lead the national typical pay (${c?.lead?.figure})`, !!c && c.lead?.figure === usd(typical));
  const all = buildCityCards(iso2)?.cards.length ?? 0;
  const drawn = c?.drawing.cards?.cards.length ?? 0;
  const folded = c?.more.find((m) => m.key === "cities")?.rows ?? [];
  check(`${iso2} slot 3: ${all} covered cities, ${drawn} as cards and ${folded.length} behind the plus, none in both, each fold of money rows`, !!c && drawn === cardsShown(all) && drawn + folded.length <= all && !folded.some((r) => (c.drawing.cards?.cards ?? []).some((k) => k.id === r.key)) && c.more.every((m) => m.type === "money"));
  if (c) { const f = clean(read(React.createElement(CustomersSlot, { model: c }))); check(`${iso2} slot 3 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageMarket.tsx"); }
  const s = buildSpendSlot(iso2);
  check(`${iso2} slot 4 leads with the food money's share and folds shares alone`, !!s && /%$/.test(s.lead?.figure ?? "") && s.more.every((m) => m.type === "share"));
  if (s) { const doc = read(React.createElement(SpendSlot, { model: s })); const f = clean(doc); check(`${iso2} slot 4 reads clean, its bar's rows declared shares (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('[data-slot="spend"] [data-answer="share"]'), "src/components/spine/country/slots/StageMarket.tsx"); }
}
check("Afghanistan: no covered city, so the national typical alone", buildCustomersSlot("AF")?.thin === true && buildCustomersSlot("AF")?.drawing.cards === null);
check("Cambodia: its one city in the row", buildCustomersSlot("KH")?.drawing.cards?.cards.length === 1);
const gbCities = buildCityCards("GB")?.cards ?? [];
const gbFold = buildCustomersSlot("GB")?.more.find((m) => m.key === "cities");
check(`the UK: ${gbCities.length} cities, four cards, the rest with a pay of their own behind the plus, each a door to its page`, gbCities.length > CITY_CARDS_SHOWN + 1 && gbFold?.rows.length === gbCities.slice(CITY_CARDS_SHOWN).filter((k) => typeof k.payUsd === "number").length && (gbFold?.rows ?? []).every((r) => typeof r.href === "string" && r.href.startsWith("/")));
const gbTrades = buildTradesSlot("GB");
const sales = buildLondonTradeSales();
check(`the UK draws slot 5: London's trades, the drawn and the folded together every trade the list holds (${sales?.rows.length})`, !!gbTrades && !!sales && gbTrades.drawing.drawn.length + (gbTrades.more[0]?.rows.length ?? 0) === sales.rows.length && gbTrades.more.every((m) => m.rows.length <= 8));
if (gbTrades) { const f = clean(read(React.createElement(TradesSlot, { model: gbTrades }))); check(`the UK's slot 5 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageMarket.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 5 (no money figure for their trades)", !buildTradesSlot("KH") && !buildTradesSlot("AF") && !buildTradesSlot("DE"));

/* SLOT 5b (Q1): Germany's margins draw as shares; the UK never; a country with no margins none. */
const deCard = marginCardFromSnapshot("DE");
const de = buildMarginsSlot("DE", deCard);
const mids = (deCard?.rows ?? []).map((r) => r.margin).sort((a, b) => a - b);
const mid = mids.length % 2 ? mids[(mids.length - 1) / 2] : (mids[mids.length / 2 - 1] + mids[mids.length / 2]) / 2;
check(`Germany draws slot 5b from its margins, the middle trade's share at 30 (${de?.lead?.figure})`, !!de && de.lead?.figure === `${Math.round(mid * 100)}%`);
if (de) {
  const doc = read(React.createElement(MarginsSlot, { model: de }));
  const f = clean(doc);
  check(`Germany's slot 5b is the margin card, stamped as the slot, read clean (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('#margins[data-slot="margins"][data-stage="2"][data-answer="share"][data-archetype="ranked-bars"]'), "src/components/spine/country/slots/StageMarket.tsx");
}
check("the UK draws no slot 5b even with margins handed in; a country with none draws none", !buildMarginsSlot("GB", marginCardFromSnapshot("GB")) && !buildMarginsSlot("KH", null) && !buildMarginsSlot("AF", marginCardFromSnapshot("AF")));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_market: all pass");
