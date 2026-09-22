/**
 * src/lib/spine/trade_customers_rows.ts
 *
 * WHAT A CUSTOMER SPENDS, the trade page's `16 customers` (MODEL.md 8.6 since
 * the night of 2026-09-20; his word after the push of that day: the main
 * pages hold more sections, from what the files hold, MODEL PART 9 clause
 * 63; his standard of 2026-09-19 for a section, a pain point with its figure
 * and its computation named). The pain point: what one customer is worth to
 * a business like this, before the rent and the wages are set against it.
 *
 * WHERE THE FIGURES COME FROM, each with its file and field, on the industry
 * shard (data/facts/industry/<id>.json through industry_shard.ts):
 *  - `demand.spend_per_head_usd`, what a customer spends in one visit (236 of
 *    243 shards hold a positive figure, 28 held; the business-to-business
 *    trades hold zero, and a zero is not a spend);
 *  - `demand.purchases_per_year`, how often a typical customer buys in a year
 *    (239 of 243, 28 held).
 * The industry page's masthead prints the same two under the same names
 * (industry_hero_facts.ts); one field, one figure, at two altitudes.
 *
 * THE COMPUTATION, named on the cell that carries it (his standard): a year of
 * one regular customer = the spend times the visits, rounded to whole dollars,
 * printed as the grid's third figure, after the two it is made of.
 * Never `demand.venues_per_10k`: the market
 * bento's firms per 10,000 is that reading already (clause 66, the obvious
 * not repeated). The card is a fact card designed to its data (clause 54):
 * three figures, no drawing; its level's visual is the strip beside it.
 *
 * Every shard figure is the trade's typical and modelled (R12): the basis says
 * so. A SHARD MISSING EITHER FIGURE DRAWS NO CARD AT ALL, rather than a card
 * without its year: the year is the focal this form is built around (PART 4,
 * one figure at 30 a card), and half the pair is not the section. 236 of 243
 * shards hold the spend, 239 the visits.
 */
import { industryFigure } from "@/lib/facts/industry_shard";
import type { FactTag } from "@/lib/facts/types";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

export const TRADE_CUSTOMERS_METRICS = { spend: "demand.spend_per_head_usd", visits: "demand.purchases_per_year" } as const;

export type TradeCustomersData = {
  industryId: string;
  /** A year of one regular customer, the spend times the visits; the card's focal. */
  year: { figure: string; value: number };
  /** The two figures the year is made of, in the order they are read. */
  cells: KvCell[];
  basis: string;
  foot: string;
  tag: FactTag;
  confidence: "modeled";
};

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

/** A spend as a person reads it: whole dollars, cents only under ten dollars ("$22", "$5.64"). */
const spendText = (v: number) => (v >= 10 ? usd(Math.round(v)) : `$${v.toFixed(2)}`);
const visitsText = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function buildTradeCustomers(industryId: string | undefined): TradeCustomersData | null {
  if (!industryId) return null;
  const C = COPY.tradeCustomers;
  const spend = industryFigure(industryId, TRADE_CUSTOMERS_METRICS.spend);
  const visits = industryFigure(industryId, TRADE_CUSTOMERS_METRICS.visits);
  const spendOk = spend && isPos(spend.value) ? spend : null;
  const visitsOk = visits && isPos(visits.value) ? visits : null;
  if (!spendOk || !visitsOk) return null;
  /* THE PAIR IN THE ORDER THEY MULTIPLY, under the year they make: the visit,
     then how many of them (his words of 2026-09-20 night on placement, and on
     not saying the obvious twice: the labels are the units, so no note repeats
     them). Each stands at 16, never between 16 and 30, because the year above
     them is this card's one figure at 30 (PART 4, the model laws' FOCAL). */
  const cells: KvCell[] = [
    { key: "spend", label: C.cells.spend, value: spendText(spendOk.value), confidence: "modeled" },
    { key: "visits", label: C.cells.visits, value: visitsText(visitsOk.value), confidence: "modeled" },
  ];
  const year = { figure: usd(Math.round(spendOk.value * visitsOk.value)), value: spendOk.value * visitsOk.value };
  const tag: FactTag = [spendOk, visitsOk].some((f) => f.tag !== "held") ? "modeled" : "held";
  return {
    industryId,
    year,
    cells,
    basis: C.basis,
    foot: C.foot,
    tag,
    confidence: "modeled",
  };
}
