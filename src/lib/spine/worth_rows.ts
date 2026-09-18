/**
 * src/lib/spine/worth_rows.ts
 *
 * WHAT ONE SELLS FOR, the trade page's `14 worth` (MODEL.md 8.6; plan step
 * 33's sixth dispatch, 2026-09-18): the range strip with two marks, linear,
 * the low and the high of what a business like this sells for, IN CURRENCY
 * and never as a multiple (PART 9 clause 15). Two marks is a track, not a
 * figure with a foot; no accent, no lead, so no 30 (a low and a high are
 * siblings, 8.6's row, M3). The page's second and last strip, the bookend
 * to `01 spread`: a year's takings at the top of the page, what the
 * business sells for at the bottom, plotted the same way. The band's
 * question from the other side: if I ever wanted out, what is this worth.
 *
 * THE FIGURES, each with its file and field:
 *  - `sale_exit.multiple_low` and `sale_exit.multiple_high` off
 *    data/facts/industry/<id>.json through industry_shard.ts, 243 of 243,
 *    182 tagged held (counted 2026-09-18 by this dispatch, the same 182 the
 *    row and DATA-REQUIREMENTS item 52 count); no shard holds an equal pair
 *    or a high under its low (counted the same day), so two marks always
 *    stand apart on the track.
 *  - THE TAKE-HOME: `owner.take_home_usd`, the figure `00 take` prints
 *    (trade_hero_facts.ts reads the same field under the same gate), so the
 *    two cards are one figure: low = the low figure times the take-home,
 *    high = the high figure times it, each rounded to the dollar.
 *  - `sale_exit.basis`, a word on every shard: SDE (owner earnings) on 205,
 *    EBITDA (operating earnings) on 38 (counted 2026-09-18; item 52).
 *
 * THREE STATES, and the card ships in all three (8.6: never a lone `13`):
 *   strip      money shown, a take-home, and the shard's figures rest on
 *              owner earnings: the two marks, the basis saying what the
 *              figures are and that they are modelled (R12; the sample mark
 *              is behind his switch).
 *   otherBasis the 38 shards whose figures rest on operating earnings: a
 *              figure worked from an owner's take-home would be the wrong
 *              base and would print a modelled figure as something it is
 *              not (clause 32), so the card holds its structure with the
 *              stated line and NO figure until the data track sets one
 *              basis (item 52). Judged before the money gate, because the
 *              base is wrong whether or not this cell shows money.
 *   withheld   off `moneyShown` (an untrusted cell; no take-home to work
 *              from): the structure with the stated line where the strip
 *              would stand (PART 5: withheld, never dropped; `01 spread`'s
 *              own idiom on this page, the running-costs card's before it).
 *              8.6's row says "labelled sample" here under rule 18; with the
 *              sample mark hidden site-wide a sample figure would print as a
 *              measurement, so the line stands instead, the reading every
 *              withheld card on this page took.
 * A trade with no shard builds nothing, and the band `13 | 14` is gated on
 * both cards, so a sector-average cell seats neither.
 *
 * FOCAL will name this card in every state (RangeStrip is not in
 * EVEN_BY_RULING; PART 4 exempts the strip on the industry page's `14 worth`
 * by that row alone): the row is reported, not exempted here, and the
 * controller rules.
 *
 * Pure over a seed and the local shard; the copy gates sweep it on every
 * shard id without a database.
 */
import { industryFigure, loadIndustryShard, industryEntityId } from "@/lib/facts/industry_shard";
import { factValue } from "@/lib/facts/store";
import type { StripMark } from "@/components/spine/archetypes/RangeStrip";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type WorthState = "strip" | "otherBasis" | "withheld";

export type WorthData = {
  state: WorthState;
  /** Two marks in the strip state, none otherwise. */
  marks: StripMark[];
  /** The basis under the strip, or null when a line stands instead. */
  basis: string | null;
  /** The strip's second line, whose each figure is (the trade's ends, this city's take-home); null when a line stands instead. */
  note: string | null;
  /** The line where the strip would stand, or null in the strip state. */
  withheld: string | null;
  /** The Rail's flag: the sale figures and the take-home are models in every state. */
  sample: true;
  /** The figures for the gates and the record. */
  figures: { multipleLow: number; multipleHigh: number; basisWord: string; held: boolean; takeHome: number | null; moneyShown: boolean };
};

/** The shard's sale basis word, read off the bank; null when the trade holds none. */
function saleBasisWord(industryId: string): string | null {
  if (!loadIndustryShard(industryId)) return null;
  const f = factValue(industryEntityId(industryId), "sale_exit.basis");
  return f && typeof f.value === "string" ? f.value : null;
}

export function buildWorth(seed: any): WorthData | null {
  const meta = seed?.meta;
  const industryId: string | undefined = typeof meta?.industry_id === "string" ? meta.industry_id : undefined;
  if (!industryId) return null;
  const lo = industryFigure(industryId, "sale_exit.multiple_low");
  const hi = industryFigure(industryId, "sale_exit.multiple_high");
  if (!lo || !hi || lo.value <= 0 || hi.value <= lo.value) return null;
  const basisWord = saleBasisWord(industryId) ?? "";
  const held = lo.tag === "held" && hi.tag === "held";
  const moneyShown = meta.money_shown === true;
  const take = seed?.owner?.take_home_usd;
  const takeHome = moneyShown && isNum(take) && take > 0 ? take : null;
  const figures = { multipleLow: lo.value, multipleHigh: hi.value, basisWord, held, takeHome, moneyShown };
  const c = COPY.tradeWorth;
  if (basisWord.toUpperCase() !== "SDE") {
    return { state: "otherBasis", marks: [], basis: null, note: null, withheld: c.otherBasis, sample: true, figures };
  }
  if (takeHome == null) {
    return { state: "withheld", marks: [], basis: null, note: null, withheld: c.withheld, sample: true, figures };
  }
  const marks: StripMark[] = [
    { key: "low", label: c.marks.low, value: Math.round(lo.value * takeHome) },
    { key: "high", label: c.marks.high, value: Math.round(hi.value * takeHome) },
  ];
  return { state: "strip", marks, basis: c.basis, note: c.note, withheld: null, sample: true, figures };
}

/** Every trade's sale basis over the shard ids given, for the gates and the record: how many rest on owner earnings, how many on operating earnings, how many hold neither figure. */
export function countWorthBases(ids: string[]): { sde: number; other: number; none: number; held: number } {
  const out = { sde: 0, other: 0, none: 0, held: 0 };
  for (const id of ids) {
    const lo = industryFigure(id, "sale_exit.multiple_low");
    const hi = industryFigure(id, "sale_exit.multiple_high");
    if (!lo || !hi) { out.none++; continue; }
    if (lo.tag === "held" && hi.tag === "held") out.held++;
    if ((saleBasisWord(id) ?? "").toUpperCase() === "SDE") out.sde++;
    else out.other++;
  }
  return out;
}
