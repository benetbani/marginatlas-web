/**
 * src/lib/spine/formats_rows.ts
 *
 * WHAT EACH FORMAT OF THIS TRADE KEEPS, the industry page's `07 formats`
 * (MODEL.md 8.7; plan step 34's third dispatch, 2026-09-19): the universal
 * list card (his B3, MarkList) with no mark and no door (no format has a
 * page, so the navigating row is not used), one row per format of the trade
 * with what it keeps of every $100, highest first, the headline the set's
 * middle at 30 in ink (the form's own law, so the card is never loud and
 * never a candidate for a fourth accent). The band's question from one side:
 * which format of this trade to open. Pure over the shard and the one net
 * builder, synchronous, so the stories, the copy gates and the harness build
 * it without the database.
 *
 * THE FIGURE IS THE TRADE'S NET PLUS EACH FORMAT'S DIFFERENCE, AND THE NET IS
 * THE ONE BUILDER'S (R7, clause 42): `resolveTradeNet(id, engine absent)`,
 * the same call the hero makes for its 40 and the split for its 30, so the
 * page carries one net and the formats stand on it: a format at a delta of
 * zero prints the hero's own figure to the digit (restaurants' cafe and
 * bistro, 7%). On the 38 shards whose ladder is the file's fill the hero
 * prints the sector profile's residual (the builder's third branch), so the
 * formats print residual plus delta, and the basis names the branch, as the
 * hero's does. Never a second net, never the margins file, never a delta
 * printed as a figure of its own (a signed difference in a cell is banned,
 * PART 9 clause 15; the delta is the shard's, the figure is the sum). The
 * one printed form is the one net builder's, a whole percent (`netText`), so
 * the hero's 7% and a format's 7% can never differ in precision.
 *
 * Each figure with its file and field: `subtypes.list.*.name` and
 * `subtypes.list.*.margin_delta_pp` in data/facts/industry/<id>.json, through
 * src/lib/facts/industry_shard.ts. Counted 2026-09-19 over the 243 shards:
 * 243 of 243 hold formats, 221 hold four and 22 hold five, 994 rows, 0
 * tagged held (every row modelled, and the basis says so in words because
 * the sample mark is behind his switch), the deltas from -6 to +20 points,
 * no name printed twice on one shard. `subtypes.list.*.capital_delta_pct`
 * is NOT the ranked figure and is not printed here: its base, the cost to
 * open, is withheld on 90 of the 243 (the archetype table's default, clause
 * 46), so a figure worked from it would stand on a fill. THE NAMES ARE THE
 * SHARD'S OWN and are never shortened: 661 of the 994 run past three words
 * ("Fast food / quick service"; the longest, tiling's "Commercial and
 * specialty (large-format, porcelain, waterproofing)", 65 characters), the
 * data track's to shorten (QUEUE industry:plus-names-over-three's class,
 * item 71); the rendered laws list reports each as ROW SENTENCE on the page
 * that draws it, and the copy gate counts them and does not red them, as it
 * counts the taxonomy's own long names on the benchmark. AND A NAME THAT
 * WRAPS SPILLS ITS ROW: MarkList's rows are one declared line (2.75rem, its
 * law 4), so a name that takes a second line at the seat's width runs 3px
 * past the row into the hairline under it, the archetype's own UNEQUAL
 * reading, MEASURED 2026-09-19 over the 243 shards drawn by id
 * (scratchpad/step34c/formats-spill.json): 55 shards (70 rows) at the 693
 * seat, where the list stands in two columns, and 81 shards (101 rows) at
 * 375, the shortest spilling name 35 characters. PART 5's own ruling: a
 * label over three words is a copy fault, not a taller row, so the card is
 * not changed and the names are the data track's to cut; the copy gate
 * counts the names over 34 characters beside the ones over three words.
 *
 * THE MIDDLE is the LOWER median of the rows, so the headline is a figure
 * some row actually holds (mark_list_rows.ts's own reasoning, rivals_rows.ts's
 * own choice), and its label says which few it is the middle of ("Middle of
 * the five"), because the rows ARE every member: a trade's formats are the
 * whole set, not a slice of a larger one.
 *
 * TWO STATES (the rivals' precedent), and the card ships in both:
 *   list      four or more formats hold a figure: the mark list.
 *   withheld  fewer than four (MarkList's floor, the model's, imported and
 *             not retyped): the card's structure with the stated line where
 *             the list would stand, never a short list with an apology under
 *             it (clause 22). No shard takes that path today (four is the
 *             smallest count on file); a shard holding no formats at all is
 *             null, as the mix builder is null on a trade holding no shard.
 */
import { industryRows } from "@/lib/facts/industry_shard";
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { resolveTradeNet, netText, type TradeNetBranch } from "@/lib/spine/trade_net";
import { COPY } from "@/lib/spine/copy";
import { countWord } from "@/lib/spine/district_rows";

export const FORMATS_METRICS = { name: "subtypes.list.*.name", delta: "subtypes.list.*.margin_delta_pp" } as const;

export type FormatRow = { key: string; name: string; /** The trade's net plus this format's delta, unrounded. */ value: number; /** The shard's delta, in points, for the record. */ delta: number };

export type FormatsData = {
  industryId: string;
  state: "list" | "withheld";
  /** Highest first; empty in the withheld state. */
  rows: FormatRow[];
  /** The lower median of the rows; null in the withheld state. */
  middle: number | null;
  /** The words over the headline ("Middle of the five"). */
  middleLabel: string;
  /** The line where the list would stand, in the withheld state; null in the list state. */
  stateLine: string | null;
  /** How many formats the shard holds with a figure, whichever state the card is in. */
  formats: number;
  /** The one net the rows stand on, and the branch that produced it. */
  net: { pct: number; text: string; branch: TradeNetBranch };
  kicker: string;
  basis: string;
  head: { name: string; value: string };
  fmt: (v: number) => string;
  /** The Rail's flag: every figure is modelled (R12). */
  sample: true;
  confidence: "modeled";
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The lower median: with an even count the lower of the two middle members, so the headline is a figure some row holds. */
function middleOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** Null where no id is given, the trade holds no shard, the shard holds no format, or the one builder resolves no net (no trade today). */
export function buildFormats(industryId: string | undefined): FormatsData | null {
  if (!industryId) return null;
  const names = industryRows(industryId, FORMATS_METRICS.name);
  if (names.length === 0) return null;
  const net = resolveTradeNet(industryId, { moneyShown: false, netMarginPct: null });
  if (!net) return null;
  const deltas = new Map(industryRows(industryId, FORMATS_METRICS.delta).map((f) => [f.rowKey, f.value] as const));
  const rows: FormatRow[] = [];
  for (const n of names) {
    const name = typeof n.value === "string" ? n.value.trim() : "";
    const delta = deltas.get(n.rowKey);
    if (!name || !isNum(delta)) continue;
    rows.push({ key: n.rowKey, name, value: net.pct + delta, delta });
  }
  if (rows.length === 0) return null;
  /* Highest first, a stable sort, so two formats at one figure keep the file's order. */
  rows.sort((a, b) => b.value - a.value);
  const c = COPY.industryFormats;
  const common = {
    industryId,
    formats: rows.length,
    net: { pct: net.pct, text: net.text, branch: net.branch },
    kicker: c.kicker,
    basis: net.branch === "profile" ? c.basisProfile : c.basisShard,
    head: c.head,
    fmt: netText,
    sample: true as const,
    confidence: "modeled" as const,
  };
  if (rows.length < MARK_LIST_FLOOR) {
    return { state: "withheld", rows: [], middle: null, middleLabel: "", stateLine: fill(c.state, { k: rows.length === 1 ? "one" : countWord(rows.length) }), ...common };
  }
  return {
    state: "list",
    rows,
    middle: middleOf(rows.map((r) => r.value)),
    middleLabel: COPY.markList.middleOfDrawn.replace("{n}", countWord(rows.length)),
    stateLine: null,
    ...common,
  };
}

/** How the 243 fall, counted rather than remembered, for the gates and the record: by format count, by the net's branch, and the states. */
export function countFormats(ids: string[]): { cards: number; list: number; withheld: number; byCount: Record<number, number>; profile: number; ladder: number; rows: number; longNames: number; wideNames: number; wideShards: number } {
  const out = { cards: 0, list: 0, withheld: 0, byCount: {} as Record<number, number>, profile: 0, ladder: 0, rows: 0, longNames: 0, wideNames: 0, wideShards: 0 };
  for (const id of ids) {
    const f = buildFormats(id);
    if (!f) continue;
    out.cards++;
    if (f.state === "list") out.list++; else out.withheld++;
    out.byCount[f.formats] = (out.byCount[f.formats] ?? 0) + 1;
    if (f.net.branch === "profile") out.profile++; else out.ladder++;
    out.rows += f.formats;
    let wide = 0;
    for (const r of f.rows) {
      if (r.name.split(/\s+/).filter(Boolean).length > 3) out.longNames++;
      if (r.name.length > FORMAT_NAME_FITS) wide++;
    }
    out.wideNames += wide;
    if (wide > 0) out.wideShards++;
  }
  return out;
}

/** The longest format name measured to hold one line at 375 on the mark list (34 characters; the shortest that spilled was 35, the header's measurement). A count, not a rule the card enforces. */
export const FORMAT_NAME_FITS = 34;
