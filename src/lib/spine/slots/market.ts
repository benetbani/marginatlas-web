/**
 * src/lib/spine/slots/market.ts , STAGE 2, THE MARKET (plan 2026-10-13 country-page-journey, Task 3C; spec sections 2 and 3; R5 section 5,
 * slots 3 to 5, and 5b by the controller's ruling on Q1): "Is there money here, and where?" The market stands before the costs, since a
 * cost reads against the revenue it is set against. Each builder reads today's builders and returns its slot's model, or null where the
 * slot's data is absent (no seat).
 */
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { buildCityCards, type CityCards } from "@/lib/spine/city_cards";
import { buildCustomersStrip } from "@/lib/spine/range_rows";
import { buildCountrySpend, type CountrySpendData } from "@/lib/spine/country_spend_rows";
import { buildAgeMix, listPeoplePlaces } from "@/lib/spine/sections/people";
import { buildLondonTradeSales, londonMiddleSales } from "@/lib/spine/country_depth_rows";
import type { MarginCard } from "@/lib/spine/margin_rows";
import { getCountryProfile } from "@/lib/economic_profile";
import type { Provenance } from "@/lib/spine/provenance";
import { FOLD_MAX, list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;

/** One row of city cards: spec section 5 refuses a carousel, and the cards' pager paged. Four, or every city up to five, since a plus of one
 *  row is no plus (FOLD_MIN); the cities past the row stand behind the plus, each figure printed once. */
export const CITY_CARDS_SHOWN = 4;
export const cardsShown = (n: number): number => (n <= CITY_CARDS_SHOWN + 1 ? n : CITY_CARDS_SHOWN);
/** London's trades drawn as bars: eight at least, the rest (eight at most) behind the plus. */
export const TRADES_SHOWN_MIN = 8;

export type CustomersDrawing = { cards: CityCards | null };
/** SLOT 3, CUSTOMERS CITY BY CITY (MONEY a year): the national typical full-time pay at 30; one row of the covered cities' cards, each its
 *  customers' pay and a door to its page; the cities past the row behind the plus as money rows that open their pages; the bottom and top
 *  tenth behind theirs where the deciles are held. Thin: the national typical alone. */
export function buildCustomersSlot(iso2: string): SlotModel<CustomersDrawing> | null {
  const strip = buildCustomersStrip(iso2);
  const typical = strip?.marks.find((m) => m.key === "typical") ?? null;
  if (!strip || !typical) return null;
  const cards = buildCityCards(iso2);
  const shown = cards ? cardsShown(cards.cards.length) : 0;
  const past: SlotRow[] = (cards?.cards ?? []).slice(shown).filter((c) => typeof c.payUsd === "number" && c.payUsd > 0).map((c) => ({ key: c.id, label: c.name, value: usd(c.payUsd as number), prov: c.payProv ?? null, href: c.href }));
  /* Each pay stamped with the profile field it is read from (the customers strip's own fields, range_rows.ts). */
  const tier = getCountryProfile(iso2).tier;
  const prov = (field: string): Provenance => ({ src: `economic_indicators/country_profile_v2.json:${field}`, kind: tier === "A" ? "looked up" : "estimate" });
  const FIELD: Record<string, string> = { p10: "wage_p10_usd", p90: "wage_p90_usd" };
  const tenths: SlotRow[] = strip.marks.filter((m) => m.key !== "typical").map((m) => ({ key: m.key, label: m.label, value: usd(m.value), prov: FIELD[m.key] ? prov(FIELD[m.key]) : null }));
  return {
    id: "customers",
    lead: { figure: usd(typical.value), words: J.slots.customers.words, prov: prov("median_wage_full_time_usd") },
    rows: null,
    more: present([list("cities", J.more.cities, "money", past), list("tenths", J.more.tenths, "money", tenths)]),
    drawing: { cards: cards ? { ...cards, cards: cards.cards.slice(0, shown) } : null },
    thin: !cards,
    sample: strip.confidence !== "measured",
  };
}

export type SpendDrawing = { spend: CountrySpendData };
/** SLOT 4, WHAT HOUSEHOLDS SPEND ON (SHARE of 100): the food money's share spent eating out at 30; the budget's parts as one share bar, the
 *  UK's form on every country; each band of ages the people file holds for the country behind its own plus. Thin: omit. */
export function buildSpendSlot(iso2: string): SlotModel<SpendDrawing> | null {
  const spend = buildCountrySpend(iso2);
  if (!spend) return null;
  const place = listPeoplePlaces().find((p) => p.iso2 === iso2.toUpperCase())?.city;
  const ages = buildAgeMix(iso2, place, "country");
  const ageLists = (ages?.bars ?? []).map((bar, i) => list(`ages-${i}`, J.ageOf.replace("{place}", bar.name.charAt(0).toUpperCase() + bar.name.slice(1)), "share", bar.bands.map((b) => ({ key: b.key, label: b.label, value: `${Math.round(b.pct)}%` }))));
  return {
    id: "spend",
    lead: { figure: spend.out.figure, words: COPY.countrySpend.outWords, prov: spend.out.prov ?? null },
    rows: null,
    more: present(ageLists),
    drawing: { spend },
    thin: false,
    sample: spend.tag !== "held",
  };
}

type SalesRow = NonNullable<ReturnType<typeof buildLondonTradeSales>>["rows"][number];
export type TradesDrawing = { drawn: SalesRow[]; worldMax: number; middle: number };
/** SLOT 5, WHAT TRADES TAKE (MONEY a year): London's registered trades by their typical yearly sales, the middle trade at 30, the bars each a
 *  door to its trade's London page, the rest behind the plus as rows that open the same pages. The UK's alone: a country whose only trade
 *  figures are net margins draws 5b instead (the controller's ruling on Q1). Thin: omit. */
export function buildTradesSlot(iso2: string): SlotModel<TradesDrawing> | null {
  if (iso2.toUpperCase() !== "GB") return null;
  const sales = buildLondonTradeSales();
  if (!sales || sales.rows.length < 2) return null;
  const middle = londonMiddleSales(sales);
  const n = sales.rows.length;
  const shown = n <= TRADES_SHOWN_MIN + 1 ? n : Math.max(TRADES_SHOWN_MIN, n - FOLD_MAX);
  const rest: SlotRow[] = sales.rows.slice(shown).map((r) => ({ key: r.key, label: r.name, value: usd(r.value), prov: r.prov ?? null, href: r.href }));
  return {
    id: "trades",
    lead: { figure: usd(middle), words: J.slots.trades.words },
    rows: null,
    more: present([list("more", J.more.trades, "money", rest)]),
    drawing: { drawn: sales.rows.slice(0, shown), worldMax: sales.worldMax, middle },
    thin: false,
  };
}

export type MarginsDrawing = { card: MarginCard; tagged: boolean };
/** SLOT 5b, WHAT TRADES KEEP (SHARE of sales; the controller's ruling on Q1, 2026-10-13): the trades' net margins as the margin card draws
 *  them (founder ruling 6, vertical bars), the middle trade's margin at 30, the median of the credible rows drawn (an even count the mean of
 *  the two middle ones). Where the country's seed holds two credible margins or more; never on the UK, whose trade margins are neither
 *  sourced nor marked, so it draws London's sales (slot 5). Thin: omit. */
export function buildMarginsSlot(iso2: string, card: MarginCard | null, tagged = false): SlotModel<MarginsDrawing> | null {
  if (iso2.toUpperCase() === "GB" || !card || card.rows.length < 2) return null;
  const m = card.rows.map((r) => r.margin).sort((a, b) => a - b);
  const mid = m.length % 2 ? m[(m.length - 1) / 2] : (m[m.length / 2 - 1] + m[m.length / 2]) / 2;
  return {
    id: "margins",
    lead: { figure: `${Math.round(mid * 100)}%`, words: J.slots.margins.words },
    rows: null,
    more: [],
    drawing: { card, tagged },
    thin: false,
  };
}
