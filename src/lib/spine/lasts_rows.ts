/**
 * src/lib/spine/lasts_rows.ts
 *
 * HOW MANY LAST, the trade page's `09 lasts` (MODEL.md 8.6; plan step 33,
 * fourth dispatch, 2026-09-18): survival as a series, three figures of one
 * quantity on the metric row (R5), a KvGrid card: still trading after one
 * year, three years, five years. No slope, no myth sentence, no folklore
 * struck on a chart (R5, PART 9 clause 40): the old `#myth` card drew the
 * London file's triple as a line with "9 in 10 fail" struck across it, and
 * both the drawing and the sentence are banned. Pure over the shard,
 * synchronous, so the stories, the copy gates and the harness build it
 * without the database.
 *
 * Each figure with its file and field: `survival.yr1_pct`, `survival.yr3_pct`
 * and `survival.yr5_pct` in data/facts/industry/<id>.json, through
 * src/lib/facts/industry_shard.ts. Counted 2026-09-18: 243 of 243 shards
 * hold all three, 43 tagged held on all three, every triple falling from
 * year one to year five and inside 1 to 100. Never the 20-activity London
 * file (`getLondonEntry().survival`, which fed the old card on London alone).
 * Every shard figure is modelled on the page (R12, item 61), and the foot
 * says so in words because the sample mark is behind his switch.
 *
 * YEAR FIVE LEADS THE CELLS. The composition names it the focal cell at 30 in
 * ink, the answer to the kicker; the fact card with a focal is candidate 1 of
 * FORM-CATALOG's CANDIDATES AWAITING HIS CLICK, so until he clicks the cell
 * draws at the head rung like its siblings (the permits' rule, and the
 * country's and the city's seats). The builder still puts it FIRST, because
 * on an odd count KvGrid's COMPLETE ROWS gives the first cell the card's
 * width, the silhouette the focal would take; `focal` names it so the view
 * can raise it the day the click lands. A triple with a year missing draws
 * nothing rather than a row with a hole: the count is 243 of 243 today, and
 * a shard that loses a year is the data track's to see, not a card to draw
 * two cells of three.
 *
 * ONE BUILDER AT TWO ALTITUDES (MODEL.md 8.7 `01 lasts`; plan step 34's
 * first dispatch, 2026-09-18): the industry page's `01` is this same card
 * off this same builder, the shard's triple for the trade anywhere, and the
 * only thing that changes is the basis line, which drops its city clause
 * because there is no city on that page (`altitude: "world"`). The kicker,
 * the three cells, their order and the foot are one literal each on both
 * pages, so the survival a reader meets on the trade page and the one on
 * its industry page can never be two figures or two sets of words.
 */
import { industryFigure } from "@/lib/facts/industry_shard";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import { COPY } from "@/lib/spine/copy";

export const LASTS_METRICS = { yr1: "survival.yr1_pct", yr3: "survival.yr3_pct", yr5: "survival.yr5_pct" } as const;

/** Where the card stands: "place" on a trade in a city (the basis says what is not this city's), "world" on the industry page (no city to name). */
export type LastsAltitude = "place" | "world";

export type LastsData = {
  industryId: string;
  altitude: LastsAltitude;
  /** Year five first, then one and three: the seat's order. */
  cells: KvCell[];
  /** The candidate's focal, named for the day of his click. */
  focal: { key: "yr5"; value: number };
  values: { yr1: number; yr3: number; yr5: number };
  basis: string;
  foot: string;
  confidence: "modeled";
};

const isPct = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0 && v <= 100;

export function buildLasts(industryId: string | undefined, altitude: LastsAltitude = "place"): LastsData | null {
  if (!industryId) return null;
  const yr1 = industryFigure(industryId, LASTS_METRICS.yr1)?.value;
  const yr3 = industryFigure(industryId, LASTS_METRICS.yr3)?.value;
  const yr5 = industryFigure(industryId, LASTS_METRICS.yr5)?.value;
  if (!isPct(yr1) || !isPct(yr3) || !isPct(yr5)) return null;
  const values = { yr1: Math.round(yr1), yr3: Math.round(yr3), yr5: Math.round(yr5) };
  const cell = (key: "yr5" | "yr1" | "yr3"): KvCell => ({ key, label: COPY.tradeLasts.cells[key], value: `${values[key]}%`, confidence: "modeled" });
  return {
    industryId,
    altitude,
    cells: [cell("yr5"), cell("yr1"), cell("yr3")],
    focal: { key: "yr5", value: values.yr5 },
    values,
    basis: altitude === "world" ? COPY.industryLasts.basis : COPY.tradeLasts.basis,
    foot: COPY.tradeLasts.foot,
    confidence: "modeled",
  };
}
