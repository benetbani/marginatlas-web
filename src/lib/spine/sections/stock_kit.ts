/**
 * THE KIT TO OPEN, AT FOUR BUDGETS (2026-09-25; his message that night: "Estimated cost to stock the business for the first
 * time ... The cost to stock the business should be multiple option one, cheap, medium, premium, luxury but with activity based
 * specifics for example for barbers there should be calculations based on 3 machines of different kinds or 3 chairs of different
 * kinds that are popular in that country with attached cost").
 *
 * PAGE-AGNOSTIC: keyed by country and trade, so a country, a city or a trade page may seat it; he decides the seat.
 *
 * THE FILE, data/sections/stock_kit.json, holds its own rules in `_about`: every line a named product on a supplier's own page,
 * priced before VAT on the day read; a category counts only when all four budgets hold it, so the four totals compare like for
 * like; a category bought in two parts is one line; consumables are left out. This module converts each line's pounds to dollars
 * through the one pinned rate (finance/fx.ts, GBP) and adds nothing else: the totals are the lines' sum, never a separate figure.
 *
 * NOTHING IS DRAWN FROM A GAP: a trade the file does not hold, a budget missing, or fewer than three lines a budget, and the
 * builder returns null and the section is not drawn.
 */
import kitJson from "../../../../data/sections/stock_kit.json";
import type { AtlasIconId } from "@/components/brand/icons";
import { convertToUsd } from "@/lib/finance/fx";
import { COPY } from "@/lib/spine/copy";

export const STOCK_TIERS = ["budget", "mid", "premium", "luxury"] as const;
export type StockTierKey = (typeof STOCK_TIERS)[number];

export type StockLine = { cat: string; label: string; icon: AtlasIconId; qty: number; name: string; usd: number };
export type StockTier = { key: StockTierKey; label: string; usd: number; lines: StockLine[] };
export type StockKit = { iso2: string; trade: string; shop: string; tiers: StockTier[]; low: number; high: number };

type FileLine = { cat: string; qty: number; name: string; total_gbp: number };
type FileTrade = { shop: string; currency: string; tiers: Record<StockTierKey, FileLine[]> };

/** One glyph a category (the kit glyphs of atlas-icons-data.ts; the scissors and the card reader reuse the salon's and the payments' glyphs). */
const KIT_ICON: Record<string, AtlasIconId> = {
  chair: "kit-chair",
  clippers: "kit-clipper",
  trimmer: "kit-trimmer",
  foil_shaver: "kit-shaver",
  station: "kit-mirror",
  backwash: "kit-basin",
  hot_towel_cabinet: "kit-towel",
  steriliser: "kit-jar",
  scissors: "trade-salon",
  cape: "kit-cape",
  card_reader: "payments",
  "card-reader": "payments",
  reception_desk: "kit-desk",
  "espresso-machine": "kit-espresso",
  grinder: "kit-grinder",
  "water-filter": "kit-filter",
  "undercounter-fridge": "kit-fridge",
  "display-chiller": "kit-display",
  dishwasher: "kit-dishwasher",
  "batch-brewer": "kit-brewer",
  blender: "kit-blender",
  chairs: "kit-seat",
  tables: "kit-table",
  crockery: "kit-cup",
};

export function buildStockKit(iso2: string, trade: string): StockKit | null {
  const country = (kitJson as unknown as Record<string, Record<string, FileTrade> | string>)[iso2.toUpperCase()];
  if (!country || typeof country === "string") return null;
  const entry = country[trade];
  if (!entry || !entry.tiers) return null;
  const S = COPY.stock;
  const tiers: StockTier[] = [];
  for (const key of STOCK_TIERS) {
    const file = entry.tiers[key];
    if (!Array.isArray(file) || file.length < 3) return null;
    const lines: StockLine[] = [];
    for (const l of file) {
      const label = (S.cats as Record<string, string>)[l.cat];
      const icon = KIT_ICON[l.cat];
      const usd = convertToUsd(entry.currency, l.total_gbp);
      /* A category the copy cannot name, a glyph missing, or a price that does not convert, and the budget is not drawn. */
      if (!label || !icon || usd == null || !(usd > 0) || !(l.qty > 0) || !l.name) return null;
      lines.push({ cat: l.cat, label, icon, qty: l.qty, name: l.name, usd });
    }
    tiers.push({ key, label: S.tiers[key], usd: lines.reduce((n, l) => n + l.usd, 0), lines });
  }
  /* The same categories, in the same order, in every budget: the rows read across. */
  const cats = tiers[0].lines.map((l) => l.cat).join("|");
  if (tiers.some((t) => t.lines.map((l) => l.cat).join("|") !== cats)) return null;
  const totals = tiers.map((t) => t.usd);
  return { iso2: iso2.toUpperCase(), trade, shop: entry.shop, tiers, low: Math.min(...totals), high: Math.max(...totals) };
}

/** Every country and trade the file holds, for the stories. */
export function listStockKits(): Array<{ iso2: string; trade: string }> {
  const out: Array<{ iso2: string; trade: string }> = [];
  for (const [iso2, v] of Object.entries(kitJson as unknown as Record<string, unknown>)) {
    if (iso2.startsWith("_") || !v || typeof v !== "object") continue;
    for (const trade of Object.keys(v as Record<string, unknown>)) out.push({ iso2, trade });
  }
  return out;
}
