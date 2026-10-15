/**
 * src/lib/spine/rivals_rows.ts
 *
 * OTHER TRADES TO OPEN, the trade page's `13 rivals` (MODEL.md 8.6; plan
 * step 33's sixth dispatch, 2026-09-18): the universal list card (his B3,
 * MarkList) with no marks, a sibling trade and its typical years to pay back
 * per row, EVERY ROW A DOOR to that trade's page in this city, the headline the
 * set's middle at 30 in ink (the form's own law, so this card can never be
 * loud and is never a candidate for a fourth accent). The band's question
 * from one side: if not this trade, what else could I open here.
 *
 * THE SIBLINGS: the seed's `rivals.list`, which adapt_cell.ts builds from
 * related_links.ts's `otherTradesHere`: every trade that HOLDS a cell at
 * this place, round-tripped through the destination route's own resolver,
 * capped at six (PER_CATEGORY_CAP), so the list holds four to six rows where
 * the place holds that many. Each carries the trade's slug, its name and
 * its verified href; nothing else, and nothing invented.
 *
 * THE FIGURE: each sibling's `first_year.payback_years` off its own shard
 * (data/facts/industry/<id>.json, 243 of 243, 3 held, every one printed as
 * modelled, R12), the same figure the sibling's own page prints under
 * "Earning it back", through the same builder's metric and formatter
 * (open_rows.ts), stamped with its file and key and called an estimate. A
 * TRADE figure, never this place's own (PART 9 clause 38, R3). A sibling whose
 * slug names no live trade or whose shard holds no payback is WITHHELD with
 * the stated line counting it. The rows fall biggest first, the form's order
 * (the slowest to pay back first); the middle is the LOWER median of the
 * siblings that hold a figure, so the headline is a figure some row actually
 * holds (mark_list_rows.ts's own reasoning), and its label says which few it
 * is the middle of ("Middle of the four").
 *
 * UNTIL 2026-10-15 the figure was each sibling's cost to open, read from
 * src/lib/markets/startup_capital_archetypes.ts, a table typed by hand with no
 * source, times the city's cost-of-living factor, stamped with the table's
 * name; a sibling on its 80,000 default was withheld, and a UK place with no
 * city index drew no card. The law is that every figure comes from held data
 * (release 2 job A), so the payback years stand in its place, the trade's
 * own and the same in every place, and the card draws on every page.
 *
 * TWO STATES, and the card ships in both (8.6: never a lone `14`):
 *   list      four or more siblings hold a figure: the mark list, the
 *             unkeyed siblings counted in the withheld line.
 *   withheld  fewer than four hold one (fewer than four siblings resolve,
 *             or the place's siblings sit on the default): the card's
 *             structure with the stated line where the list would stand,
 *             counting what it cannot print, NEVER a short list with an
 *             apology under it (PART 9 clause 22; MarkList's floor is the
 *             model's and is imported, not retyped). The line says how many
 *             of the four the list needs hold a figure; where no sibling
 *             resolves at all it says that instead.
 *
 * BLIND SPOT, stated: this builder cannot tell "no sibling holds a cell
 * here" from "the table did not answer": both arrive as an empty list and
 * both draw the withheld state with the same line. The adapter's query
 * ledger (the `[cells] ... failed, falling back` lines on stderr) is the
 * one instrument that tells them apart.
 *
 * Pure over a seed; the copy gates sweep it on fixtures without a database.
 */
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { OPEN_METRICS, shardProv, yearsFigure } from "@/lib/spine/open_rows";
import { industryFigure } from "@/lib/facts/industry_shard";
import { slugToIndustry, tradeRowName } from "@/lib/taxonomy";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import { countWord } from "@/lib/spine/district_rows";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";

/** Every row lands on a sibling trade's page in this city, "A typical owner keeps" (8.6's doors paragraph): the promise, declared once here (plan step 39). */
export type RivalRow = { key: string; name: string; value: number; href: string; lands: DoorKind; /** Where the figure came from (plan 06, task B5): the sibling's shard file and key, an estimate. */ prov?: Provenance };

export type RivalsData = {
  state: "list" | "withheld";
  /** The siblings that hold a payback, biggest first; empty in the withheld state. */
  rows: RivalRow[];
  /** The lower median of the siblings that hold a payback; null in the withheld state. */
  middle: number | null;
  /** The words over the headline ("Middle of the four"). */
  middleLabel: string;
  /** Siblings whose shard holds no payback, counted (R11). */
  withheld: number;
  /** The line counting them, in the list state; null when none is withheld. */
  withheldLine: string | null;
  /** The line where the list would stand, in the withheld state; null in the list state. */
  stateLine: string | null;
  /** How many siblings resolved at all, and how many of them hold a figure. */
  siblings: number;
  keyed: number;
  kicker: string;
  basis: string;
  head: { name: string; value: string };
  fmt: (v: number) => string;
  /** The Rail's flag: every figure is a trade's typical, modelled (R3). */
  sample: true;
};

/** The lower median: with an even count the lower of the two middle members, so the headline is a figure some row holds. */
function middleOf(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) / 2)];
}

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

export function buildRivals(seed: any): RivalsData | null {
  const meta = seed?.meta;
  if (!meta || typeof meta.trade !== "string") return null;
  const list: Array<{ name?: unknown; slug?: unknown; href?: unknown }> = Array.isArray(seed?.rivals?.list) ? seed.rivals.list : [];
  const siblings = list.filter((l) => typeof l.name === "string" && typeof l.slug === "string" && typeof l.href === "string") as Array<{ name: string; slug: string; href: string }>;
  const keyedRows: RivalRow[] = [];
  let withheld = 0;
  for (const s of siblings) {
    const id = slugToIndustry(s.slug)?.id;
    const pay = id ? industryFigure(id, OPEN_METRICS.payback) : null;
    if (!id || !pay || !(pay.value > 0)) { withheld++; continue; }
    /* The row form of the trade's name (tradeRowName: three words at most, the model's ROW SENTENCE law), as every other card that lists trades prints it. */
    keyedRows.push({ key: s.slug, name: tradeRowName(id, s.name), value: pay.value, href: s.href, lands: SURFACE_ANSWERS.cell, prov: shardProv(id, OPEN_METRICS.payback) });
  }
  keyedRows.sort((a, b) => b.value - a.value);
  const c = COPY.tradeRivals;
  const common = { siblings: siblings.length, keyed: keyedRows.length, kicker: c.kicker, basis: c.basis, head: c.head, fmt: yearsFigure, sample: true as const };
  if (keyedRows.length < MARK_LIST_FLOOR) {
    const stateLine = siblings.length === 0 ? c.stateNone : fill(c.state, { k: keyedRows.length === 0 ? "none" : countWord(keyedRows.length) });
    return { state: "withheld", rows: [], middle: null, middleLabel: "", withheld, withheldLine: null, stateLine, ...common };
  }
  /* Digits in the withheld line, the country money card's and the mark list's own idiom ("6 cities withheld"), which the copy gate holds to a digit. */
  const withheldLine = withheld === 0 ? null : withheld === 1 ? c.withheldOne : fill(c.withheldMany, { n: String(withheld) });
  return {
    ...common,
    state: "list",
    rows: keyedRows,
    middle: middleOf(keyedRows.map((r) => r.value)),
    middleLabel: COPY.markList.middleOfDrawn.replace("{n}", countWord(keyedRows.length)),
    withheld,
    withheldLine,
    stateLine: null,
  };
}
