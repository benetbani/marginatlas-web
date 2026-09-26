/**
 * WHO SPENDS ON IT, BY AGE (2026-09-26; his list of 2026-09-25, "customer types", ruled out that night for want of figures and
 * built the next day on the survey's age tables). Page-agnostic, keyed by country and a trade's URL slug.
 *
 * THE FILE, data/sections/spend_by_age.json: a household's average weekly spend on one of the survey's main categories for each
 * age band of the household reference person, as published, the households a band, and which category each trade's customers buy
 * from. This module computes two shares a band and nothing else: its share of the households, and its share of the category's
 * money (its average times its households, over the five). The card's figure is the largest band's share of the money.
 *
 * NOTHING IS DRAWN FROM A GAP: a trade the file does not map, a category or a band missing, and the builder returns null.
 */
import ageJson from "../../../../data/sections/spend_by_age.json";
import { COPY } from "@/lib/spine/copy";

type FileItem = { code: string; weekly: Array<number | null> };
type FileCountry = { currency: string; period: string; bands: string[]; households: number[]; items: Record<string, FileItem>; trades: Record<string, string> };

export type AgeBandShare = { key: string; label: string; households: number; money: number };
export type SpendByAge = { iso2: string; trade: string; item: string; figure: string; words: string; lead: string; bands: AgeBandShare[] };

const countryOf = (iso2: string): FileCountry | null => {
  const c = (ageJson as unknown as Record<string, FileCountry | string>)[iso2.toUpperCase()];
  return c && typeof c === "object" ? c : null;
};
const isAmount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

export function buildSpendByAge(iso2: string, trade: string): SpendByAge | null {
  const c = countryOf(iso2);
  const key = c?.trades?.[trade];
  const item = key ? c?.items?.[key] : undefined;
  const C = COPY.spendByAge;
  const label = key ? (C.items as Record<string, string>)[key] : undefined;
  const n = c?.bands?.length ?? 0;
  if (!c || !key || !item || !label || n < 3 || c.households?.length !== n || item.weekly?.length !== n) return null;
  if (!item.weekly.every(isAmount) || !c.households.every(isAmount)) return null;
  const weekly = item.weekly as number[];
  const money = weekly.map((w, i) => w * c.households[i]);
  const moneyTotal = money.reduce((a, b) => a + b, 0);
  const hhTotal = c.households.reduce((a, b) => a + b, 0);
  const bands: AgeBandShare[] = [];
  for (let i = 0; i < n; i++) {
    const k = c.bands[i];
    const bandLabel = (C.bands as Record<string, string>)[k];
    if (!bandLabel) return null;
    bands.push({ key: k, label: bandLabel, households: (c.households[i] / hhTotal) * 100, money: (money[i] / moneyTotal) * 100 });
  }
  const lead = bands.reduce((a, b) => (b.money > a.money ? b : a), bands[0]);
  const who = (C.who as Record<string, string>)[lead.key];
  if (!who) return null;
  return {
    iso2: iso2.toUpperCase(),
    trade,
    item: key,
    figure: `${Math.round(lead.money)}%`,
    words: C.focalWords.replace("{item}", label).replace("{who}", who),
    lead: lead.key,
    bands,
  };
}

/** Every country and trade the file maps, for the stories: one trade a category, the first the file names. */
export function listSpendByAge(): Array<{ iso2: string; trade: string }> {
  const out: Array<{ iso2: string; trade: string }> = [];
  for (const [iso2, v] of Object.entries(ageJson as unknown as Record<string, FileCountry | string>)) {
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
