/**
 * src/lib/spine/market_rows.ts
 *
 * THE MARKET FOR IT, the trade page's `12 market` (MODEL.md 8.6; plan step
 * 33, fifth dispatch, 2026-09-18): four readings of the trade's market, his
 * A2 bento in his B4 cells, the page's only bento and the whole of turn
 * three, ZERO ACCENT (the page's three are spent on the take, the total to
 * open and the share of a day; a fourth would erase the other three). Pure
 * over the shard, synchronous, in premises_bento_rows.ts's idiom, so the
 * archetype harness, the story sheet and the prebuild gates build every
 * trade without the database.
 *
 * FOUR CELLS, IN DECLARED ORDER, each with its file and field, all four in
 * data/facts/industry/<id>.json through industryFigure(); the tiling is
 * cell/market.tsx's (2+1 over 1+2 on three columns):
 *
 *  - FIRMS PER 10,000 PEOPLE, `competition.firms_per_10k_typical`: how many
 *    firms of the trade there are for every 10,000 people. A metric cell,
 *    2 by 1, its figure printed as the file holds it (whole where whole,
 *    else to the file's own decimals, at most three: 16, 4.5, 0.1, 0.003).
 *    207 of 243 carry a fraction and 64 sit under 0.5 (27 of the 138 live
 *    trades; coding schools 0.03, coffee roasters 0.05, hostels 0.08), so a
 *    whole-number print would round a quarter of the live trades to
 *    nothing; a small figure is a real reading of a rare trade and prints
 *    as read.
 *  - HELD BY CHAINS, `competition.chain_vs_independent_share_pct`: of every
 *    100 firms, the share held by chains (the file's own words: "the chain
 *    share of outlets"). A count in 100, 1 by 1, ink on neutral.
 *  - CLOSE IN A YEAR, `competition.annual_churn_pct`: of every 100 firms,
 *    how many close in a year. A count in 100, 1 by 1, ink on neutral.
 *  - THE YEAR'S SWING, `seasonality.swing_pct`: how much more the busiest
 *    month sells than the quietest, a percent. A metric cell, 2 by 1. One
 *    shard runs past 100 (jewelry stores, 120: December alone a fifth of
 *    the year) and prints as read; a swing is not a share of a whole.
 *
 * COUNTED ON 2026-09-18 over all 243 shards: every one holds all four
 * fields numeric and above zero; the three competition fields tagged held
 * on 29, the swing on 59; firms 0.003 to 22, chains 3 to 92, churn 1 to 30,
 * swing 8 to 120. No field is a fill: the modes (chains 30 on the exemplar's
 * sector, churn 10) are the modeller's mid-points, and no two fields agree
 * on every shard. EVERY FIGURE IS MODELLED ON THE PAGE whatever its tag
 * (R12, item 61), and every basis says so in words because the sample
 * mark is behind his switch.
 *
 * A MISSING FIELD IS WITHHELD WITH ITS LINE (PART 5), one line per cell in
 * the premises' idiom, standing where the figure would (BentoMetric's law
 * 2); a share over 100 is not a count of firms and takes its own line
 * rather than a wrong whole (BentoCount would refuse to draw it, and a cell
 * that draws nothing is the hole the cluster exists to stop). No trade
 * takes either path today; the shapes are the builder's, so the day a field
 * goes missing the cluster still draws four cells and one says why. The
 * cluster itself is null only where the trade holds no shard (a
 * sector-average cell): then the subject does not exist for this entity,
 * turn three has no card, and its chapter break waits with it.
 *
 * ONE BUILDER AT TWO ALTITUDES (MODEL.md 8.7 `10 field`; plan step 34's
 * fourth dispatch, 2026-09-19): the industry page's `10` is this same
 * builder over this same shard, the trade's market anywhere, and the only
 * thing that changes is the basis of the three cells whose trade basis
 * carries a city clause (the density and the two counts say "not this
 * city's"; the swing's names no city and is one literal at both altitudes),
 * so `altitude: "world"` swaps those three for `COPY.industryField.cellBasis`
 * (lasts_rows.ts and mix_rows.ts do exactly this). The four cells, their
 * figures, their tags and their order are one computation on both pages, so
 * the density a reader meets on the trade page and the one on its industry
 * page can never be two figures. The industry card DRAWS THREE of the four
 * (the churn cell is 8.7's own cut: beside `01 lasts` it is a second view of
 * one reading); the cut is the card's (industry/turn-three.tsx `fieldCells`),
 * never this builder's, which always builds four so the gate can prove the
 * churn cell is built and not drawn.
 */
import { industryFigure, industryRows, type IndustryBankFigure } from "@/lib/facts/industry_shard";
import type { MonthPoint } from "@/components/spine/archetypes/MonthLine";
import type { SharePart } from "@/components/spine/archetypes/ShareBar";
import type { FactTag } from "@/lib/facts/types";
import type { LastsAltitude } from "@/lib/spine/lasts_rows";
import { COPY } from "@/lib/spine/copy";

/** Where the cluster stands: "place" on a trade in a city (the basis says what is not this city's), "world" on the industry page (no city to name). The survival card's own type, so the cards cannot spell an altitude two ways. */
export type MarketAltitude = LastsAltitude;

export const MARKET_METRICS = {
  firms: "competition.firms_per_10k_typical",
  chains: "competition.chain_vs_independent_share_pct",
  close: "competition.annual_churn_pct",
  swing: "seasonality.swing_pct",
} as const;

/** A metric cell: the figure as printed with its basis and tag, or the stated line where the figure would stand. */
export type MarketMetric = { figure: string; basis: string; tag: FactTag; value: number } | { withheld: string };
/** A count cell: the part in 100 with its basis and tag, or the stated line. */
export type MarketCount = { part: number; whole: 100; basis: string; tag: FactTag; value: number } | { withheld: string };

export type MarketData = {
  industryId: string;
  altitude: MarketAltitude;
  firms: MarketMetric;
  chains: MarketCount;
  close: MarketCount;
  swing: MarketMetric;
  /** How many of the four cells stand on a withheld line. */
  withheld: number;
  /** The weakest tag among the printed figures; "held" when nothing prints. Every figure prints as modelled regardless (R12). */
  tag: FactTag;
  confidence: "modeled";
  /** THE YEAR, MONTH BY MONTH (2026-09-20 late evening, his gold standard's B30 on the swing cell): `seasonality_months.months[0..11]`, an index of the busiest month at 100, drawn as the month line under the swing figure; null unless all twelve are on file. */
  months: MonthPoint[] | null;
  /** WHEN THE WEEK'S TAKINGS COME IN (the same evening, his B29): `dayparts.pattern.*` (part, pct), two to four parts of the week's takings, drawn as the stacked share bar in the bento's fifth cell; null under two parts. */
  dayparts: SharePart[] | null;
};

/** The four figure cells' keys in declared order, the order the cluster tiles and a phone reads; the fifth cell (the dayparts, 2026-09-20 late evening) is a share bar and not a figure cell, read off `dayparts`. */
export const MARKET_CELLS = ["firms", "chains", "close", "swing"] as const;

const TRUST: readonly FactTag[] = ["held", "modeled", "extrapolated", "placeholder"];
const weaker = (a: FactTag, b: FactTag): FactTag => (TRUST.indexOf(a) >= TRUST.indexOf(b) ? a : b);

/** A density as the file holds it: whole where whole, else the file's own decimals, at most three ("16", "4.5", "0.003"). */
export const densityText = (v: number): string => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3))));

function metric(fig: IndustryBankFigure | null, basis: string, print: (v: number) => string, withheld: string): MarketMetric {
  if (!fig || fig.value <= 0) return { withheld };
  return { figure: print(fig.value), basis, tag: fig.tag, value: fig.value };
}

function count(fig: IndustryBankFigure | null, basis: string, withheld: string, notAShare: string): MarketCount {
  if (!fig) return { withheld };
  if (fig.value > 100) return { withheld: notAShare };
  return { part: Math.round(fig.value), whole: 100, basis, tag: fig.tag, value: fig.value };
}

export function buildMarket(industryId: string | undefined, altitude: MarketAltitude = "place"): MarketData | null {
  if (!industryId) return null;
  const read = (metric: string) => industryFigure(industryId, metric);
  const firmsFig = read(MARKET_METRICS.firms);
  const chainsFig = read(MARKET_METRICS.chains);
  const closeFig = read(MARKET_METRICS.close);
  const swingFig = read(MARKET_METRICS.swing);
  /* No shard, no cluster: the door answers null on every field when the trade holds nothing. */
  if (!firmsFig && !chainsFig && !closeFig && !swingFig) return null;
  /* The world altitude drops the city clause from the three bases that carry one; the swing's is one literal at both. */
  const B = altitude === "world" ? { ...COPY.industryField.cellBasis, swing: COPY.tradeMarket.basis.swing } : COPY.tradeMarket.basis;
  const W = COPY.tradeMarket.withheld;
  const firms = metric(firmsFig, B.firms, densityText, W.firms);
  const chains = count(chainsFig, B.chains, W.chains, W.chainsNotAShare);
  const close = count(closeFig, B.close, W.close, W.closeNotAShare);
  const swing = metric(swingFig, B.swing, (v) => `${Math.round(v)}%`, W.swing);
  const printed: FactTag[] = [];
  for (const c of [firms, swing]) if ("figure" in c) printed.push(c.tag);
  for (const c of [chains, close]) if ("part" in c) printed.push(c.tag);
  const tag = printed.reduce<FactTag>((w, t) => weaker(w, t), "held");
  /* The twelve months: one figure each, `seasonality_months.months[i]`, read one by one; a year missing a month draws no line. */
  const monthFigs = Array.from({ length: 12 }, (_, i) => read(`seasonality_months.months[${i}]`));
  const months: MonthPoint[] | null = monthFigs.every((f): f is IndustryBankFigure => f != null) ? monthFigs.map((f, i) => ({ month: i, value: f.value })) : null;
  /* The dayparts: the shard's rows, name and share, in the shard's order (the week's order). */
  const partNames = new Map(industryRows(industryId, "dayparts.pattern.*.part").map((f) => [f.rowKey, typeof f.value === "string" ? f.value.trim() : ""] as const));
  const partShares = industryRows(industryId, "dayparts.pattern.*.pct");
  const dayparts: SharePart[] = partShares
    .map((f) => ({ key: `part-${f.rowKey}`, name: partNames.get(f.rowKey) ?? "", share: typeof f.value === "number" ? f.value : NaN }))
    .filter((p) => p.name && Number.isFinite(p.share) && p.share > 0);
  return { industryId, altitude, firms, chains, close, swing, withheld: 4 - printed.length, tag, confidence: "modeled", months, dayparts: dayparts.length >= 2 ? dayparts : null };
}
