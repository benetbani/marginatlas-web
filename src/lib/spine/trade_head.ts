/**
 * src/lib/spine/trade_head.ts
 *
 * The one figure a trade page's head, meta description and share card may print (plan 06, task A4). Until 2026-10-04 the head
 * read `cell.revenue_per_firm` whatever filled it: on 103 of the 138 London trades that was a constant (the square root of
 * 5,000 times 50,000,000, times the country's 1.35: "~$675K typical revenue" on shoe repair, pet stores, personal training,
 * cafes and yoga alike), and the description promised "bottom-10%, typical, and top-10% benchmarks" the page did not hold.
 *
 * In London (his ruling of 2026-10-04: Greater London) the figure is the register's median yearly sales for the trade's code,
 * read once from the band counts and rounded once through its range after conversion at the site's pound rate; a shared code
 * names its group; an approximate code prints nothing. Off London the row's own revenue prints only where it was read off the
 * row, never where `fillMissingFields` supplied it.
 */
import { londonTradeRegister, londonTradeSales, OPEN_ABOVE_GBP, OPEN_BELOW_GBP } from "@/lib/uk/registers/london_trade";
import { convertToUsd } from "@/lib/finance/fx";
import { honestRound } from "@/lib/uk/present/precision";

export type TradeHeadFigure =
  | {
      kind: "register";
      /** The median in dollars, rounded once; null when it falls in an open band (then `open` says which edge). */
      usd: number | null;
      open: { side: "below" | "above"; edgeUsd: number } | null;
      /** A shared code's group ("hair or beauty business"), or null when the code is the trade's own. */
      group: string | null;
      enterprises: number;
    }
  | { kind: "row"; usd: number };

const toUsd = (gbp: number) => convertToUsd("GBP", gbp) ?? Number.NaN;

export function tradeHeadFigure(o: { isLondon: boolean; slug: string; revenuePerFirm?: number | null; revenueFilled?: boolean }): TradeHeadFigure | null {
  if (o.isLondon) {
    const reg = londonTradeRegister(o.slug);
    const sales = londonTradeSales(o.slug);
    if (!reg || !sales) return null;
    if (sales.q50.open !== false) {
      const edgeUsd = toUsd(sales.q50.open === "below" ? OPEN_BELOW_GBP : OPEN_ABOVE_GBP);
      return { kind: "register", usd: null, open: { side: sales.q50.open, edgeUsd }, group: reg.group, enterprises: reg.enterprises };
    }
    const mid = toUsd(sales.q50.gbp);
    if (!Number.isFinite(mid)) return null;
    const range = sales.medianRangeGbp;
    const rounded = range ? honestRound(mid, toUsd(range[0]), toUsd(range[1])) : honestRound(mid);
    return { kind: "register", usd: rounded, open: null, group: reg.group, enterprises: reg.enterprises };
  }
  if (o.revenueFilled || typeof o.revenuePerFirm !== "number" || !(o.revenuePerFirm > 0)) return null;
  return { kind: "row", usd: o.revenuePerFirm };
}
