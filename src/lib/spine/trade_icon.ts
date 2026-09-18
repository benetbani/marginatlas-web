/**
 * src/lib/spine/trade_icon.ts
 *
 * THE TRADE'S OWN ICON TILE, BY TAXONOMY ID (MODEL.md 8.7 `00 take`: "the
 * trade's 28px icon tile in the flag's seat (the identity variant)"; PART 5's
 * trade rows: "a 28px icon tile, the trade name"; plan step 34's first
 * dispatch, 2026-09-18). The brand set holds eleven trade icons (the
 * business-type family of 2026-07-08, atlas-icons-data.ts: restaurant,
 * grocery, dental, cafe, gym, auto, salon, bar, childcare, taxi, retail) and
 * its own note says "retail reuses high-street". Until this file every
 * caller kept a private slug-keyed map of the eight everyday trades
 * (city-view.tsx, dev/spine/page.tsx, hood-view.tsx) and fell back to the
 * street; the industry page needs one for every one of the 243 ids, so the
 * map is keyed by the taxonomy id here, once.
 *
 * THE RULE, and it is a mapping and not a guess: a trade takes a family icon
 * only where the icon's own label names the trade (a restaurant icon on the
 * restaurant formats, a bar on the bars, pubs and wine bars, a salon on the
 * hair and nail trades, a cafe on the cafes and tea houses); the retail
 * sector takes the shop front the family draws for it; EVERY OTHER TRADE
 * TAKES THE STREET (`high-street`), the fallback the city's trade rows
 * already draw, so a page never invents a tile that says the wrong trade.
 * Counted 2026-09-18: 23 ids on a family icon, 33 on the shop front, 187
 * on the street.
 */
import type { AtlasIconId } from "@/components/brand/icons";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";

/** The taxonomy ids whose trade the family's icon names, by its own label. */
const BY_ID: Record<string, AtlasIconId> = {
  restaurants: "trade-restaurant",
  sit_down_restaurants: "trade-restaurant",
  fast_casual: "trade-restaurant",
  pizzerias: "trade-restaurant",
  grocery_stores: "trade-grocery",
  specialty_grocery: "trade-grocery",
  dental_practices: "trade-dental",
  cafes_coffee: "trade-cafe",
  tea_houses: "trade-cafe",
  sports_fitness: "trade-gym",
  yoga_pilates: "trade-gym",
  auto_repair_shops: "trade-auto",
  auto_body_shops: "trade-auto",
  automotive_electrical_services: "trade-auto",
  hairdressers_beauty: "trade-salon",
  hair_salons_full: "trade-salon",
  barbershops: "trade-salon",
  nail_salons: "trade-salon",
  bars_nightclubs: "trade-bar",
  wine_bars: "trade-bar",
  pubs_taverns: "trade-bar",
  childcare_social: "trade-childcare",
  daycare_preschool: "trade-childcare",
};

/** The sector whose trades take the family's shop front. */
const RETAIL_SECTOR = "retail_shops";

/** The tile every other trade takes: the street, the city's trade rows' own fallback. */
export const TRADE_ICON_FALLBACK: AtlasIconId = "high-street";

/** The trade's icon tile for one taxonomy id: a family icon where the icon names the trade, the shop front on retail, else the street. */
export function tradeIconFor(industryId: string | null | undefined): AtlasIconId {
  if (!industryId) return TRADE_ICON_FALLBACK;
  const own = BY_ID[industryId];
  if (own) return own;
  if (INDUSTRY_BY_ID[industryId]?.sector_id === RETAIL_SECTOR) return "trade-retail";
  return TRADE_ICON_FALLBACK;
}

/** How the 243 ids fall, counted rather than remembered, for the record. */
export function countTradeIcons(ids: string[]): { family: number; retail: number; street: number } {
  const out = { family: 0, retail: 0, street: 0 };
  for (const id of ids) {
    const icon = tradeIconFor(id);
    if (icon === TRADE_ICON_FALLBACK) out.street++;
    else if (icon === "trade-retail") out.retail++;
    else out.family++;
  }
  return out;
}
