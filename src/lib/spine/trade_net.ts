/**
 * src/lib/spine/trade_net.ts
 *
 * THE ONE BUILDER FOR A TRADE PAGE'S NET (MODEL.md 8.6, `00 take` and `05
 * split`; PART 9 clause 42, R7: "ONE builder for the page's every net
 * figure, so 17.2 on one card and 6.5 on another for one trade cannot
 * happen"; DATA-REQUIREMENTS item 58; plan step 33's first dispatch,
 * 2026-09-18). Until this file the trade page computed its net twice: the
 * masthead printed the adapter's `margins.net_pct` and `buildMoneyGoes`
 * (cell_view.ts) took its own net for the $100 split. Every reader of a net
 * on the trade page calls this builder now: the masthead's companion cell
 * (this dispatch, through the adapter's `net` block) and `05 split` at its
 * own dispatch. One figure, one branch, one note, whatever card prints it.
 *
 * THREE BRANCHES, IN THIS ORDER, and the order is 8.6's own row:
 *
 *  1. THE ENGINE, where `moneyShown` (cell_view.ts: London, or a trusted
 *     local cell, trust.ts): `netMarginPct` off loadCellView(), which is the
 *     curated London entry's `net_margin_pct` on the exemplar (5, where the
 *     restaurants shard's ladder says 6.5: the engine wins where money is
 *     shown, by the row) and `estimateNetProfit()`'s clamped margin on a
 *     trusted local cell (California restaurants 11.3, Berlin 11.3). A model
 *     over the cell's own revenue and payroll, so the note says "this
 *     city's own figures" and the page's provenance line says modelled.
 *  2. THE SHARD'S LADDER, `margin_ladder.net_margin_pct` off
 *     data/facts/industry/<id>.json through industry_shard.ts, 243 of 243,
 *     189 tagged held, UNLESS the ladder is the file's fill: the identical
 *     triple 42 / 10 / 5 (gross, operating, net) on 38 shards, 15 of them
 *     tagged held (counted 2026-09-18 by this dispatch, the same 38 the
 *     trade spine's PART 0 and item 50 count). A fill value is withheld
 *     (clause 46, R11), so those 38 fall through to the third branch, and
 *     `fill` says so for the record. Marked modelled whatever the tag (R12,
 *     item 61: the held tag verified at 57 percent).
 *  3. THE SECTOR PROFILE'S RESIDUAL, `buildIncomeBreakdown(sector).netPct`
 *     off data/finance/industry_cost_profile_v1.json by the taxonomy's
 *     `sector_id` (25 sectors, every one present), the implied margin one
 *     minus the nine cost shares, the same identity income_rows.ts already
 *     draws. Modelled worldwide, never measured for a place.
 *
 * So every trade resolves a net: the engine's on the cells where money is
 * shown, the ladder's on 205 of 243 trades off them, the profile's on the 38
 * fill shards. There is no net-less mode (R7). COUNTED 2026-09-18 by this
 * dispatch over the 243 taxonomy ids with the engine absent: 205 on the
 * ladder, 38 on the profile, 0 unresolved.
 *
 * ONE FORMATTER. The net prints as a whole percent everywhere on the page
 * (`text`), so the masthead's companion and the split's focal can never
 * show one figure at two precisions.
 *
 * Server only: the shard is read from the file system, and `tradeNet()`
 * loads the cell view (the database). `resolveTradeNet()` is the pure core
 * the copy gates sweep with the engine passed in.
 */
import { slugToIndustry, ALL_INDUSTRIES, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { industryFigure } from "@/lib/facts/industry_shard";
import type { FactTag } from "@/lib/facts/types";
import { buildIncomeBreakdown } from "@/lib/spine/income_rows";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The file's fill: the identical ladder on 38 of 243 shards, never printed (R11). */
export const LADDER_FILL = { gross: 42, operating: 10, net: 5 } as const;

export type TradeNetBranch = "engine" | "shard" | "profile";

export type TradeNet = {
  /** The taxonomy's industry id the shard is filed under. */
  industryId: string;
  /** The net margin, 0 to 100, unrounded. */
  pct: number;
  /** The one printed form, a whole percent. */
  text: string;
  branch: TradeNetBranch;
  /** The shard's tag on the ladder branch; "engine" or "profile" on the others. Every branch prints as modelled (R12). */
  tag: FactTag | "engine" | "profile";
  /** True on every branch today: the engine is a model, the shard's tag is unverified, the profile is a world baseline. */
  modelled: true;
  /** The companion cell's one qualifier line, from the copy table. */
  note: string;
  /** True when the shard's ladder was the 42 / 10 / 5 fill and was passed over for the profile. */
  fill: boolean;
  /** The file and field, for the gates and the record. */
  field: string;
};

/** The shard's ladder net, or null when the trade holds none; `fill` when it is the file's triple. */
export function shardLadderNet(industryId: string): { pct: number; tag: FactTag; fill: boolean } | null {
  const net = industryFigure(industryId, "margin_ladder.net_margin_pct");
  if (!net) return null;
  const gross = industryFigure(industryId, "margin_ladder.gross_margin_pct");
  const operating = industryFigure(industryId, "margin_ladder.operating_margin_pct");
  const fill = gross?.value === LADDER_FILL.gross && operating?.value === LADDER_FILL.operating && net.value === LADDER_FILL.net;
  return { pct: net.value, tag: net.tag, fill };
}

/** The sector profile's implied net for the trade's sector, or null when the taxonomy holds no such trade or the profile no such sector. */
export function profileResidualNet(industryId: string): { pct: number; sector: string } | null {
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return null;
  const breakdown = buildIncomeBreakdown(ind.sector_id);
  if (!breakdown || !isNum(breakdown.netPct)) return null;
  return { pct: breakdown.netPct, sector: ind.sector_id };
}

/** The one printed form of a net: a whole percent. */
export const netText = (pct: number) => `${Math.round(pct)}%`;

/**
 * THE PURE CORE: the three branches over one trade and the engine's reading
 * as the caller holds it. `engine.netMarginPct` is read only where
 * `engine.moneyShown`; off it the engine's figure is an untrusted cell's and
 * is not a figure for this page. Null only when the trade is not in the
 * taxonomy, which no route reaches.
 */
export function resolveTradeNet(industryId: string, engine: { moneyShown: boolean; netMarginPct: number | null }): TradeNet | null {
  if (engine.moneyShown && isNum(engine.netMarginPct)) {
    return { industryId, pct: engine.netMarginPct, text: netText(engine.netMarginPct), branch: "engine", tag: "engine", modelled: true, note: COPY.tradeNet.notes.engine, fill: false, field: "netMarginPct, loadCellView (the London entry or estimateNetProfit)" };
  }
  const ladder = shardLadderNet(industryId);
  if (ladder && !ladder.fill) {
    return { industryId, pct: ladder.pct, text: netText(ladder.pct), branch: "shard", tag: ladder.tag, modelled: true, note: COPY.tradeNet.notes.shard, fill: false, field: `margin_ladder.net_margin_pct, data/facts/industry/${industryId}.json` };
  }
  const profile = profileResidualNet(industryId);
  if (profile) {
    return { industryId, pct: profile.pct, text: netText(profile.pct), branch: "profile", tag: "profile", modelled: true, note: COPY.tradeNet.notes.profile, fill: !!ladder?.fill, field: `sectors.${profile.sector}, one minus the nine cost shares, data/finance/industry_cost_profile_v1.json` };
  }
  return null;
}

/** The net for one cell by its route, loading the cell view for the engine's reading. Null when the cell does not resolve or the trade is not in the taxonomy. */
export async function tradeNet(country: string, geo: string, trade: string): Promise<TradeNet | null> {
  const { loadCellView } = await import("@/lib/spine/adapt_cell");
  const loaded = await loadCellView(country, geo, trade);
  if (!loaded) return null;
  const industryId = slugToIndustry(trade)?.id ?? loaded.cell.industry_id ?? null;
  if (!industryId) return null;
  return resolveTradeNet(industryId, { moneyShown: loaded.moneyShown, netMarginPct: loaded.netMarginPct });
}

/** Every trade's net with the engine absent, over the 243 ids the shards are filed under (ALL_INDUSTRIES; the 138 in scope are a subset), for the gates and the stories: the branch each lands on and the fill count, measured rather than remembered. */
export function countTradeNets(): { ladder: number; profile: number; fill: number; unresolved: number; total: number } {
  const out = { ladder: 0, profile: 0, fill: 0, unresolved: 0, total: 0 };
  for (const ind of ALL_INDUSTRIES) {
    out.total++;
    const n = resolveTradeNet(ind.id, { moneyShown: false, netMarginPct: null });
    if (!n) { out.unresolved++; continue; }
    if (n.branch === "shard") out.ladder++;
    else out.profile++;
    if (n.fill) out.fill++;
  }
  return out;
}
