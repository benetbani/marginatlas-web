/**
 * WHO SPENDS ON IT, BY INCOME (2026-09-25; his message that night: "By purchasing power, poor middle class, wealthy,
 * millionaire"). Page-agnostic, keyed by country and a trade's URL slug.
 *
 * THE FILE, data/sections/spend_by_income.json: a household's average weekly spend on one item for each gross income tenth, as
 * published, the households a tenth, and which item each trade's customers buy. This module converts each average to dollars
 * through the one pinned rate (finance/fx.ts) and computes one thing, the richest fifth's share of the item's spending (each
 * tenth's average times its households, over the ten); nothing else is added. The survey stops at the richest tenth, so the card
 * never names a millionaire: a class it cannot see is not drawn.
 *
 * NOTHING IS DRAWN FROM A GAP: a trade the file does not map, an item with a tenth missing, or a rate that does not convert, and
 * the builder returns null.
 */
import spendJson from "../../../../data/sections/spend_by_income.json";
import { convertToUsd } from "@/lib/finance/fx";
import { COPY } from "@/lib/spine/copy";

type FileItem = { code: string; tenths: Array<number | null>; all: number };
type FileCountry = { currency: string; period: string; households: number[]; items: Record<string, FileItem>; trades: Record<string, string> };

export type SpendTenth = { tenth: number; usd: number; rich: boolean };
export type SpendByIncome = { iso2: string; trade: string; item: string; figure: string; words: string; tenths: SpendTenth[]; allUsd: number };

const countryOf = (iso2: string): FileCountry | null => {
  const c = (spendJson as unknown as Record<string, FileCountry | string>)[iso2.toUpperCase()];
  return c && typeof c === "object" ? c : null;
};
const isAmount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

export function buildSpendByIncome(iso2: string, trade: string): SpendByIncome | null {
  const c = countryOf(iso2);
  const key = c?.trades?.[trade];
  const item = key ? c?.items?.[key] : undefined;
  const label = key ? (COPY.spendByIncome.items as Record<string, string>)[key] : undefined;
  if (!c || !key || !item || !label || !Array.isArray(item.tenths) || item.tenths.length !== 10 || c.households?.length !== 10) return null;
  if (!item.tenths.every(isAmount) || !c.households.every(isAmount) || !isAmount(item.all)) return null;
  const spend = item.tenths as number[];
  const total = spend.reduce((n, v, i) => n + v * c.households[i], 0);
  const richest = spend[8] * c.households[8] + spend[9] * c.households[9];
  const tenths: SpendTenth[] = [];
  for (let i = 0; i < 10; i++) {
    const usd = convertToUsd(c.currency, spend[i]);
    if (usd == null || !(usd > 0)) return null;
    tenths.push({ tenth: i + 1, usd, rich: i >= 8 });
  }
  const allUsd = convertToUsd(c.currency, item.all);
  if (allUsd == null) return null;
  return {
    iso2: iso2.toUpperCase(),
    trade,
    item: key,
    figure: `${Math.round((richest / total) * 100)}%`,
    words: COPY.spendByIncome.focalWords.replace("{item}", label),
    tenths,
    allUsd,
  };
}

/** Every country and trade the file maps, for the stories: one trade an item, the first the file names. */
export function listSpendByIncome(): Array<{ iso2: string; trade: string }> {
  const out: Array<{ iso2: string; trade: string }> = [];
  for (const [iso2, v] of Object.entries(spendJson as unknown as Record<string, FileCountry | string>)) {
    if (iso2.startsWith("_") || typeof v !== "object") continue;
    const seen = new Set<string>();
    for (const [trade, item] of Object.entries(v.trades)) {
      if (seen.has(item)) continue;
      seen.add(item);
      out.push({ iso2, trade });
    }
  }
  return out;
}
