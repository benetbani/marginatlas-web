/**
 * src/lib/spine/split_rows.ts
 *
 * THE NET PROFIT MARGIN, the trade page's `05 split` (MODEL.md 8.6; plan step
 * 33, third dispatch, 2026-09-18): the income breakdown (B6, R7) for one cell,
 * pure over the seed, the shard, the sector profile and the one net builder.
 * The view and the stories call this and compose nothing of their own.
 *
 * ONE LAW, ONE FEED, ONE NET (PART 9 clause 42, R7):
 *
 *  THE NET is the seed's `net` block, THE ONE BUILDER'S figure (trade_net.ts,
 *    item 58): the engine's where money is shown, the shard's ladder off it
 *    unless the ladder is the 42 / 10 / 5 fill, the sector profile's residual
 *    on those 38. It is the same figure `00 take` prints in its companion
 *    cell, at the same precision (`net.text`), and this card pins it last on
 *    the bar at 30 in ink. THERE IS NO NET-LESS MODE: a seed with no net block
 *    (a sector-average cell resolving to the `default` id, which holds no
 *    shard and no taxonomy row) builds nothing, and the band does not draw,
 *    the same existence condition `03 | 04` already carries.
 *  THE LINES come from the shard's `cost_structure.cost_drivers.*` where the
 *    drivers are tagged held (79 of 243 shards, counted 2026-09-18; the tag
 *    is uniform across a shard's drivers, 79 all held and 164 all modelled),
 *    else from data/finance/industry_cost_profile_v1.json by the trade's
 *    sector (25 sectors, every one present). 8.6's row and R7 say "where
 *    held", and the feed is read off the tag, never off the fact that a
 *    driver exists (every shard holds drivers).
 *  THE SEGMENTS are composed by `composeIncomeSegments` in income_rows.ts,
 *    the profile builder's own law with the net pinned from outside: the
 *    largest few named, the rest one bucket that never outweighs a named
 *    line, the residual NAMED as its own segment when the lines and the net
 *    fall short of a hundred, and the card WITHHELD when they run over it
 *    (never a bar scaled to fit, which is the fabrication the old $100 stack
 *    committed by construction: cell_view.ts's buildMoneyGoes rescaled every
 *    cost to fill whatever the net left).
 *
 * WHAT THE FEED DOES ON THE 243, MEASURED 2026-09-18 with the engine absent
 * (the copy gate re-counts it): 32 trades balance exactly, 198 name a
 * residual (73 shard-fed, 125 profile-fed: a shard's ladder net and the
 * sector's shares are two researchers' figures and rarely close), and 13 run
 * over a hundred by more than the tolerance and are withheld (4 shard-fed:
 * cake shops, carpentry, industrial cleaning, roofing; 9 profile-fed:
 * chiropractic, eyewear, machinery, mental health, nutritionists, soap and
 * candle makers, sole accountants, sole law firms, vintage consignment).
 * DATA-REQUIREMENTS item 60 counted two over-100 shards (game studios,
 * hardware stores) on the shard's drivers for every trade; on this feed
 * those two are profile-fed and balance. On a cell where money is shown the
 * engine's net replaces the ladder's, so a trade withheld here can draw
 * there and the reverse; the state is the cell's, measured on the seed.
 *
 * THE WITHHELD STATE DRAWS THE COSTS ON THEIR OWN BASE (2026-09-24, the goal's
 * B8). Withheld, the card held the net at 30 and the stated line and nothing
 * else, and the team table beside it set the band's height: on London
 * barbershops a blank 572 by 186 at 1280 and 312 by 138 at 768 (the page
 * filter), on eight London trades that day. What the lines on file can still
 * say honestly is how they split AMONG THEMSELVES: each line's share of the
 * lines' own sum, a split of every $100 the trade spends (`mix`), composed by
 * the same law as the sales split (the largest named, the rest one bucket,
 * never a bucket over a named line) with no net in it. That is not the bar
 * scaled to fit the refusal above names: no share of SALES is claimed, the
 * base is stated in the card's own words (COPY.tradeSplit.mixBasis), and the
 * sales split stays withheld with its line. The drawn state carries none.
 *
 * THE PLUS at the foot (DetailPanel, closed on arrival) holds the two shares
 * the plus's law calls its floor: fixed costs and variable costs, the shard's
 * `cost_structure.fixed_pct / variable_pct` (243 of 243, 79 held), printed as
 * shares of the trade's costs, marked modelled in the row's note.
 *
 * EVERY FIGURE OFF THIS BUILDER IS MODELLED (R12, item 61) and the foot says
 * so in words, because the sample mark is behind his switch. The legend's
 * labels are the shard's own driver names where they run to three words and
 * the copy table's short form where they run past it (PART 5's label law;
 * COPY.tradeSplit.lineLabels says why), never a shortened figure.
 */
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { industryFigure, industryRows } from "@/lib/facts/industry_shard";
import { composeIncomeSegments, profileCostLines, sectorProfile, type CostLine, type IncomeSegment } from "@/lib/spine/income_rows";
import { resolveTradeNet, type TradeNet } from "@/lib/spine/trade_net";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { COPY } from "@/lib/spine/copy";

export const SPLIT_METRICS = {
  drivers: "cost_structure.cost_drivers.",
  name: "cost_structure.cost_drivers.*.name",
  pct: "cost_structure.cost_drivers.*.pct_of_revenue",
  fixed: "cost_structure.fixed_pct",
  variable: "cost_structure.variable_pct",
} as const;

/** The most words a legend label may run to (PART 5). */
export const LABEL_WORDS_CAP = 3;

export type SplitFeed = "shard" | "profile";
export type SplitState = "drawn" | "withheld";

export type SplitData = {
  state: SplitState;
  feed: SplitFeed;
  /** The one builder's net, as the seed carries it. */
  net: TradeNet;
  /** The net in percent, unrounded, and its one printed form (`00`'s companion prints the same string). */
  netPct: number;
  netText: string;
  /** The words over the focal: the same label `00`'s companion cell wears. */
  netLabel: string;
  /** The bar's cost segments in the law's order (drawn only; empty when withheld). */
  segments: IncomeSegment[];
  /** WITHHELD ONLY: the lines on file split by every $100 the trade spends (each line over the lines' own sum), composed by the same law, no net; empty in the drawn state and where fewer than two lines can be named. */
  mix: IncomeSegment[];
  /** The named residual's share when the lines and the net fall short, else null. */
  residual: number | null;
  /** The lines' sum in percentage points before composition, for the gates. */
  linesPct: number;
  /** The stated line where the bar would stand (withheld only). */
  withheld: string | null;
  basis: string;
  /** The modelled sentence under the legend; empty in the withheld state, which draws no shares. */
  foot: string;
  /** The plus: two rows, fixed and variable costs, or null where the shard holds neither. */
  detail: { summary: string; rows: DetailRow[] } | null;
  sample: true;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The legend's label for a shard's driver name: the copy table's short form where the name runs past three words, else the name itself. */
export function driverLabel(name: string): string {
  const short = COPY.tradeSplit.lineLabels[name];
  if (short) return short;
  return name;
}

/**
 * The shard's cost drivers as cost lines (fractions of revenue), with the
 * tag they carry: `held` only when every driver on the shard is tagged held.
 * Empty when the shard holds none. A driver with no finite, positive share
 * is not a line (a negative segment is not drawn).
 */
export function shardCostLines(industryId: string): { lines: CostLine[]; held: boolean } {
  const facts = industryRows(industryId, SPLIT_METRICS.drivers);
  const byRow = new Map<string, { name?: string; pct?: number; tags: string[] }>();
  for (const f of facts) {
    const row = byRow.get(f.rowKey) ?? { tags: [] };
    if (f.metric === SPLIT_METRICS.name && typeof f.value === "string") row.name = f.value;
    if (f.metric === SPLIT_METRICS.pct && isNum(f.value)) { row.pct = f.value; row.tags.push(f.tag); }
    byRow.set(f.rowKey, row);
  }
  const lines: CostLine[] = [];
  let held = byRow.size > 0;
  for (const [rowKey, row] of byRow) {
    if (!row.name || !isNum(row.pct)) continue;
    if (!row.tags.every((t) => t === "held")) held = false;
    if (row.pct <= 0) continue;
    lines.push({ key: rowKey, label: driverLabel(row.name), share: row.pct / 100 });
  }
  return { lines, held };
}

/** The sector profile's lines for the trade, or null when the taxonomy or the profile holds none. */
export function sectorCostLines(industryId: string): CostLine[] | null {
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return null;
  const profile = sectorProfile(ind.sector_id);
  if (!profile) return null;
  const lines = profileCostLines(profile);
  return lines.length > 0 ? lines : null;
}

/** The plus's two rows off the shard, or null under two (the panel's own floor). */
export function buildSplitDetail(industryId: string): { summary: string; rows: DetailRow[] } | null {
  const fixed = industryFigure(industryId, SPLIT_METRICS.fixed);
  const variable = industryFigure(industryId, SPLIT_METRICS.variable);
  const rows: DetailRow[] = [];
  if (fixed && fixed.value > 0) rows.push({ label: COPY.tradeSplit.detail.fixed, value: `${Math.round(fixed.value)}%`, note: COPY.tradeSplit.detail.note });
  if (variable && variable.value > 0) rows.push({ label: COPY.tradeSplit.detail.variable, value: `${Math.round(variable.value)}%` });
  return rows.length >= 2 ? { summary: COPY.tradeSplit.detail.summary, rows } : null;
}

/**
 * THE PURE CORE over a trade id and the one builder's net, so the gates can
 * sweep every trade with the engine absent and the stories can build a case
 * off a seed. Null when the trade holds no lines on either feed (no shard
 * and no sector), which no shard id reaches today.
 */
export function resolveSplit(industryId: string, net: TradeNet): SplitData | null {
  const shard = shardCostLines(industryId);
  const feed: SplitFeed = shard.held && shard.lines.length > 0 ? "shard" : "profile";
  const lines = feed === "shard" ? shard.lines : sectorCostLines(industryId);
  if (!lines || lines.length === 0) return null;
  const linesPct = lines.reduce((a, l) => a + l.share * 100, 0);
  const segments = composeIncomeSegments(lines, net.pct);
  const basis = feed === "shard" ? COPY.tradeSplit.basisShard : COPY.tradeSplit.basisProfile;
  const detail = buildSplitDetail(industryId);
  const common = { feed, net, netPct: net.pct, netText: net.text, netLabel: COPY.tradeHero.cells.net, linesPct, basis, foot: COPY.tradeSplit.foot, detail, sample: true as const, confidence: "modeled" as const };
  if (!segments) {
    /* No share of sales is drawn, so the basis names the net alone. The costs
       split among themselves (see the header): each line over the lines' own
       sum, through the same law with a net of nought, so the mix comes to a
       hundred by construction; the mix's own basis says its shares are
       modelled, so the state keeps no foot (one line fewer beside a short
       team table, measured on four London trades at 1280). */
    const lineSum = lines.reduce((a, l) => a + (Number.isFinite(l.share) && l.share > 0 ? l.share : 0), 0);
    const mix = lineSum > 0 ? composeIncomeSegments(lines.map((l) => ({ ...l, share: l.share / lineSum })), 0) ?? [] : [];
    const drawn = mix.length >= 2 ? mix : [];
    return { ...common, state: "withheld", segments: [], mix: drawn, residual: null, withheld: COPY.tradeSplit.withheld, basis: COPY.tradeSplit.basisWithheld, foot: "" };
  }
  const residual = segments.find((s) => s.key === "unallocated")?.share ?? null;
  return { state: "drawn", segments, mix: [], residual, withheld: null, ...common };
}

/** The split for one cell off its seed: the trade's id and the one builder's net block, both carried by the adapter. */
export function buildSplit(seed: any): SplitData | null {
  const industryId: string | null = typeof seed?.meta?.industry_id === "string" ? seed.meta.industry_id : null;
  const net = seed?.net as TradeNet | undefined;
  if (!industryId || !net || !isNum(net.pct) || typeof net.text !== "string") return null;
  return resolveSplit(industryId, net);
}

/**
 * THE SAME CARD AT THE WORLD ALTITUDE, the industry page's `03 split`
 * (MODEL.md 8.7; plan step 34's second dispatch, 2026-09-18), the way
 * lasts_rows.ts serves `01 lasts` off the trade's builder: the same lines
 * (the shard's held drivers, else the sector profile), the same law
 * (`composeIncomeSegments`, the residual named, the over-a-hundred case
 * withheld) and the same net, THE ONE BUILDER'S with the engine absent,
 * which is the figure the industry hero prints at 40
 * (industry_hero_facts.ts calls `resolveTradeNet` the same way), so `00`
 * and `03` on that page can never disagree (R7). Nothing changes with the
 * altitude: the basis names the trade or the sector and no city, so the
 * strings are one literal on both pages. Null only for an id the taxonomy
 * does not hold, which no route reaches.
 *
 * COUNTED 2026-09-18 by this dispatch over the 243 ids with the engine
 * absent (the copy gate re-counts it): 230 draw and 13 are withheld, the
 * same thirteen the header counts for the trade page off `moneyShown`,
 * because off the engine the two pages are one feed; 8.7's row counted two
 * over-a-hundred shards on the shard's drivers for every trade, and on this
 * feed those two are profile-fed and balance.
 */
export function buildIndustrySplit(industryId: string | undefined): SplitData | null {
  if (!industryId) return null;
  const net = resolveTradeNet(industryId, { moneyShown: false, netMarginPct: null });
  return net ? resolveSplit(industryId, net) : null;
}

/** The states over a list of trade ids with a net for each, counted rather than remembered, for the gates and the record. */
export function countSplitStates(ids: string[], netOf: (id: string) => TradeNet | null): { total: number; drawn: number; withheld: number; residual: number; exact: number; shardFed: number; profileFed: number; withheldIds: string[]; noNet: number } {
  const out = { total: ids.length, drawn: 0, withheld: 0, residual: 0, exact: 0, shardFed: 0, profileFed: 0, withheldIds: [] as string[], noNet: 0 };
  for (const id of ids) {
    const net = netOf(id);
    if (!net) { out.noNet++; continue; }
    const s = resolveSplit(id, net);
    if (!s) { out.noNet++; continue; }
    if (s.feed === "shard") out.shardFed++; else out.profileFed++;
    if (s.state === "withheld") { out.withheld++; out.withheldIds.push(id); continue; }
    out.drawn++;
    if (s.residual != null) out.residual++; else out.exact++;
  }
  return out;
}
