/**
 * src/lib/spine/uk_trade_typical.ts
 *
 * THE TRADE'S TYPICAL, SAID ON A UK TRADE PAGE (masterplan step 04, 2026-10-05; the labels audit of 2026-10-02, item 10).
 * A London trade page is held to a register region (Greater London, his ruling of 2026-10-04), so it prints a sourced figure or
 * a marked one. Six of its cards print the trade's world figure from the trade's shard, not London's: where each $100 goes,
 * what staff cost, covering the costs, where sales come from, what a customer spends, and the market cluster. No register on disk answers those questions for London, so each card's one supporting line says,
 * once and plainly, that the figure is the trade's typical; never the struck "typical for the trade anywhere".
 *
 * Two of the market's figures change rather than relabel. The city's own density beside the trade's typical was the city
 * shard's count over the 14.3M metro, a modelled figure over the wrong denominator, and no sourced population of Greater
 * London is on disk to divide the register's count by: it leaves. The world's "20 of 100 close a year" gives way to what the
 * register does hold, a different measure with its own words: the UK's company insolvencies for the trade in a year, over its
 * live companies (data/uk/registers/failures.json; the notices of 2025-10-01 to 2026-09-30 over the register of 2026-05-01).
 *
 * Pure over the built cards; the cell view calls it on a page held to a register region and nowhere else.
 */
import failuresJson from "../../../data/uk/registers/failures.json";
import { COPY } from "@/lib/spine/copy";
import { own } from "@/lib/own";
import type { SplitData } from "@/lib/spine/split_rows";
import type { TeamData } from "@/lib/spine/team_rows";
import type { ClearsData } from "@/lib/spine/clears_rows";
import type { MixData } from "@/lib/spine/mix_rows";
import type { TradeCustomersData } from "@/lib/spine/trade_customers_rows";
import type { OpenData } from "@/lib/spine/open_rows";
import type { MarketData } from "@/lib/spine/market_rows";

type FailuresFile = { source: string; trades: Record<string, { uk_rate?: { value?: number; publishable?: boolean } }> };
const FAILURES = failuresJson as unknown as FailuresFile;

/** The UK's company insolvencies for the trade in a year, per 100 live companies to one decimal, or null where the register's
 *  rate is not publishable (too few cases) or the trade is not in the slice. The slice's rate is per 1,000. */
export function ukInsolvencyPer100(tradeSlug: string | null | undefined): number | null {
  const r = own(FAILURES.trades, tradeSlug)?.uk_rate;
  if (!r || r.publishable !== true || typeof r.value !== "number" || !Number.isFinite(r.value) || r.value < 0) return null;
  return Math.round(r.value) / 10;
}

export type UkTradeCards = {
  split: SplitData | null;
  team: TeamData | null;
  clears: ClearsData | null;
  mix: MixData | null;
  customers: TradeCustomersData | null;
  open: OpenData | null;
  market: MarketData | null;
};

/** The same cards, each world-typical line saying so; the market without the metro density and with the UK's insolvencies. */
export function sayTradeTypical(cards: UkTradeCards, tradeSlug: string | null | undefined): UkTradeCards {
  const T = COPY.tradeTypical;
  const { split, team, clears, mix, customers, open, market } = cards;
  const insolvent = ukInsolvencyPer100(tradeSlug);
  return {
    split: split && split.state === "drawn" ? { ...split, basis: split.feed === "profile" ? T.splitProfile : T.split } : split,
    team: team ? { ...team, basis: T.team } : team,
    /* Where money is shown the share is the London engine's, an estimate; off it, the trade's typical from its shard. */
    clears: clears ? { ...clears, basis: clears.branch === "engine" ? T.clearsEstimate : T.clears } : clears,
    /* The mix prints its foot as its one line (its basis is empty), so the foot is the line that says whose figure it is. */
    mix: mix ? { ...mix, foot: T.mix } : mix,
    customers: customers ? { ...customers, basis: T.customers } : customers,
    /* The cost to open keeps its own lines: its baseline card already carries one (the smaller costs in the total), and a
       second would break the card's one supporting line; it is not on the audit's list of item 10. */
    open,
    market: market
      ? {
          ...market,
          here: null,
          firms: "figure" in market.firms ? { ...market.firms, basis: T.market.firms } : market.firms,
          chains: "part" in market.chains ? { ...market.chains, basis: T.market.chains } : market.chains,
          swing: "figure" in market.swing ? { ...market.swing, basis: T.market.swing } : market.swing,
          daypartsBasis: T.market.dayparts,
          insolvent: insolvent != null ? { per100: insolvent, words: T.insolvent } : null,
        }
      : market,
  };
}
