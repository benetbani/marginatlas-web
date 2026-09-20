/**
 * src/lib/spine/pays_rows.ts
 *
 * WHAT CARRIES IT UNTIL IT PAYS BACK, the industry page's `05 pays` (MODEL.md
 * 8.7; plan step 34's second dispatch, 2026-09-18): his A2 bento in his B4
 * cells, four readings of one subject, the cluster its own band and turn
 * one's LOUD moment (accent two, the payback years). Pure over the shard,
 * synchronous, in market_rows.ts's idiom, through the trade page's own
 * builders and formatters wherever the same field is printed there, so a
 * figure here is the figure the trade page prints for the same shard.
 *
 * FOUR CELLS, NOT 8.7's THREE, AND THE REASON IS MEASURED. 8.7 declares
 * three cells "tiling two columns by two rows", the crew spanning the top
 * row. BentoBand's own law leaves a three-cell cluster exactly two
 * tilings: a cell two columns wide on a two-column grid, which is a 1072px
 * card at 1280, full width by the section-bands gate's reading and by his
 * ruling ("for every subsection that stretches left to right full width, I
 * think we should ban it except hero section"; the gate reddened it,
 * industry-restaurants 0 to 1, a baseline that may only fall); or the crew
 * as the one tall cell beside two stacked metrics, the premises' idiom,
 * which works there because the whole is always 100 and cannot work here
 * because the crew runs 2 to 38 over the trades in scope (2 to 460 over the
 * 243): a grid of two people cannot fill the height of two metric cells and
 * a grid of thirty-eight overfills it, whatever unit size is chosen, so the
 * cell would hole on the small crews and the metrics beside it on the
 * large. So the cluster takes the trade market's PROVEN tiling (cell/
 * market.tsx, 0 holes at three widths on the sheet and the page): four
 * cells on three columns, two wide metric cells on opposite corners and two
 * one-by-one count cells on the other diagonal, no cell over two thirds of
 * the band. The fourth reading is the shard's own and of the same subject,
 * the fixed part of the costs: what has to be paid whatever it sells is
 * what has to be carried until it pays back. The controller rules on the
 * fourth cell (QUEUE: industry:pays-fourth-cell); every other figure is
 * 8.7's.
 *
 * THE CELLS, IN DECLARED ORDER (the order the packer places them and a
 * phone reads them; the tiling is industry/turn-one.tsx's), each with its
 * file and field in data/facts/industry/<id>.json:
 *  - UNTIL IT PAYS BACK, a metric cell two by one at the top left, CARRYING
 *    THE TURN'S ACCENT (the view lights it; the builder only names the
 *    figure): `first_year.payback_years`, 243 of 243 (3 held), 0.5 to 15,
 *    printed by open_rows.ts's `yearsFigure` (the trade's `04 open` foot
 *    companion, "2.5 years", "1 year"), one formatter for one field.
 *  - THE STARTING CREW, a count you can also see (BentoCount), one by one at
 *    the top right: the sum of `roles.*.headcount_typical` over the roles
 *    team_rows.ts reads (the three key spellings the export filed the
 *    collection under, `roles.list` on 192 shards, `roles.roles` on 33,
 *    `roles.items` on 18, folded there and nowhere else), 243 of 243, 963
 *    role rows, 53 tagged held. The whole IS the crew and every unit is
 *    drawn: the count is the whole, so the cell prints the figure once and
 *    BentoCount says no "of N" beside it (its own zero case). Counted
 *    2026-09-18: the sums run 2 to 460 over the 243 (hospitals 460, higher
 *    education 93, both retired; 2 to 38 over the 138 in scope, nursing and
 *    elderly care the top, restaurants 11, the median 6); 8.7's "4 to 8
 *    people" is the middle of that spread, not its range. THREE SUMS ARE A
 *    FRACTION OF A PERSON (a half-time role: sole law firms 2.5, sole
 *    accountants 2.5, carpet laying 2.3) and are ROUNDED AND SAID: the
 *    drawing needs whole units, and the basis line takes the premises'
 *    idiom, "rounded to whole people". The units are sized to the cell in
 *    up to ten columns (industry/turn-one.tsx `crewColumns`, the reason
 *    measured there), so the grid spans the cell for a crew of two as for a
 *    crew of 38.
 *  - FIXED COSTS, a count in 100 (BentoCount, `columns` the market's
 *    twenty), one by one at the bottom left: `cost_structure.fixed_pct`,
 *    243 of 243 (79 held), 10 to 90, the part of every $100 of costs paid
 *    whatever it sells. The same field stands as a row behind the split's
 *    plus on `03` (the trade page's plus, one literal); a figure twice on
 *    one page, once behind a plus, composed by this cluster and reported.
 *  - WHEN IT CLEARS COSTS, a metric cell two by one at the bottom right, in
 *    ink: `cost_structure.breakeven_utilization_pct`, 243 of 243 (79 held),
 *    45 to 92, printed by clears_rows.ts's `shareFigure`, which the trade's
 *    `08 clears` prints the same field through, one formatter.
 *
 * NO CELL REPEATS A NEIGHBOUR OR `04 open`: a payback in years, a headcount,
 * a share of the cost stack and a share of a day are four readings; the
 * months to break even stand on `04`. EVERY FIGURE IS MODELLED ON THE PAGE
 * (R12) and every basis says so in words, because the cluster has no line
 * of its own and the sample mark is behind his switch. A missing field is
 * withheld with its line standing where the figure would (BentoMetric's law
 * 2), so the cluster still draws four cells and one says why; a fixed share
 * over 100 is not a share and takes its own line (the market's guard); no
 * shard takes either path today. The cluster is null only where the shard
 * holds none of the four.
 */
import { industryFigure } from "@/lib/facts/industry_shard";
import type { FactTag } from "@/lib/facts/types";
import { shardRoles } from "@/lib/spine/team_rows";
import { OPEN_METRICS, yearsFigure } from "@/lib/spine/open_rows";
import { CLEARS_METRIC, shareFigure, shareValue } from "@/lib/spine/clears_rows";
import { SPLIT_METRICS } from "@/lib/spine/split_rows";
import { COPY } from "@/lib/spine/copy";

export const PAYS_METRICS = { payback: OPEN_METRICS.payback, crew: "roles.*.headcount_typical", fixed: SPLIT_METRICS.fixed, share: CLEARS_METRIC } as const;

/** The cells' keys in declared order, the order the cluster tiles and a phone reads. */
export const PAYS_CELLS = ["payback", "crew", "fixed", "share"] as const;

/** The crew: the part is the whole (every unit drawn and inked), the sum as the file holds it and as rounded; or the stated line. */
export type PaysCrew = { part: number; whole: number; sum: number; rounded: boolean; roles: number; basis: string; tag: FactTag } | { withheld: string };
/** A count in 100: the part with its basis and tag, or the stated line. `variable` (2026-09-20 night) is the other part of the same hundred, `cost_structure.variable_pct`, drawn as the second bar of the fixed-costs cell where the shard holds it. */
export type PaysCount = { part: number; whole: 100; value: number; basis: string; tag: FactTag; variable?: number } | { withheld: string };
/** A metric cell: the figure as printed with its basis and tag, or the stated line where the figure would stand. */
export type PaysMetric = { figure: string; value: number; basis: string; tag: FactTag } | { withheld: string };

export type PaysData = {
  industryId: string;
  payback: PaysMetric;
  /** THE PAYBACK'S COMPANION (2026-09-20 night, clause 65: a cell is never one number): `first_year.ramp_to_breakeven_months`, the months until a typical day clears its costs, printed beside the years until the capital comes back; null where the shard holds none. */
  ramp: { figure: string; value: number; tag: FactTag } | null;
  crew: PaysCrew;
  fixed: PaysCount;
  share: PaysMetric;
  /** How many of the four cells stand on a withheld line. */
  withheld: number;
  confidence: "modeled";
};

const TRUST: readonly FactTag[] = ["held", "modeled", "extrapolated", "placeholder"];
const weaker = (a: FactTag, b: FactTag): FactTag => (TRUST.indexOf(a) >= TRUST.indexOf(b) ? a : b);

/** The crew's sum over the shard's roles, or null where the shard holds none. */
export function crewSum(industryId: string): { sum: number; roles: number; tag: FactTag } | null {
  const roles = shardRoles(industryId);
  if (roles.length === 0) return null;
  const sum = roles.reduce((a, r) => a + r.headcount, 0);
  if (!(sum > 0)) return null;
  const tag = roles.map((r) => r.tag as FactTag).reduce<FactTag>((w, t) => weaker(w, TRUST.includes(t) ? t : "modeled"), "held");
  return { sum, roles: roles.length, tag };
}

export function buildPays(industryId: string | undefined): PaysData | null {
  if (!industryId) return null;
  const paybackFig = industryFigure(industryId, PAYS_METRICS.payback);
  const crewFig = crewSum(industryId);
  const fixedFig = industryFigure(industryId, PAYS_METRICS.fixed);
  const shareFig = industryFigure(industryId, PAYS_METRICS.share);
  if (!paybackFig && !crewFig && !fixedFig && !shareFig) return null;
  const B = COPY.industryPays.basis;
  const W = COPY.industryPays.withheld;
  const payback: PaysMetric = paybackFig && paybackFig.value > 0 ? { figure: yearsFigure(paybackFig.value), value: paybackFig.value, basis: B.payback, tag: paybackFig.tag } : { withheld: W.payback };
  const crew: PaysCrew = crewFig
    ? (() => {
        const whole = Math.round(crewFig.sum);
        const rounded = !Number.isInteger(crewFig.sum);
        return { part: whole, whole, sum: crewFig.sum, rounded, roles: crewFig.roles, basis: rounded ? B.crewRounded : B.crew, tag: crewFig.tag };
      })()
    : { withheld: W.crew };
  const variableFig = industryFigure(industryId, SPLIT_METRICS.variable);
  const fixed: PaysCount = !fixedFig || fixedFig.value <= 0 ? { withheld: W.fixed } : fixedFig.value > 100 ? { withheld: W.fixedNotAShare } : { part: Math.round(fixedFig.value), whole: 100, value: fixedFig.value, basis: B.fixed, tag: fixedFig.tag, ...(variableFig && variableFig.value > 0 && variableFig.value <= 100 ? { variable: Math.round(variableFig.value) } : {}) };
  const share: PaysMetric = shareFig && shareFig.value > 0 ? { figure: shareFigure(shareFig.value), value: shareValue(shareFig.value), basis: B.share, tag: shareFig.tag } : { withheld: W.share };
  const rampFig = industryFigure(industryId, "first_year.ramp_to_breakeven_months");
  const ramp = rampFig && rampFig.value > 0 ? { figure: `${Math.round(rampFig.value)} ${Math.round(rampFig.value) === 1 ? COPY.industryPays.ramp.month : COPY.industryPays.ramp.months}`, value: rampFig.value, tag: rampFig.tag } : null;
  const withheld = ["withheld" in payback, "withheld" in crew, "withheld" in fixed, "withheld" in share].filter(Boolean).length;
  return { industryId, payback, ramp, crew, fixed, share, withheld, confidence: "modeled" };
}

/** How the ids fall, counted rather than remembered, for the gates and the record. */
export function countPays(ids: string[]): { total: number; clusters: number; withheldCells: number; rounded: string[]; crewMin: number; crewMax: number; over8: number; under4: number; fixedMin: number; fixedMax: number } {
  const out = { total: ids.length, clusters: 0, withheldCells: 0, rounded: [] as string[], crewMin: Infinity, crewMax: 0, over8: 0, under4: 0, fixedMin: Infinity, fixedMax: 0 };
  for (const id of ids) {
    const p = buildPays(id);
    if (!p) continue;
    out.clusters++;
    out.withheldCells += p.withheld;
    if ("part" in p.crew) {
      if (p.crew.rounded) out.rounded.push(`${id}=${p.crew.sum}`);
      out.crewMin = Math.min(out.crewMin, p.crew.sum);
      out.crewMax = Math.max(out.crewMax, p.crew.sum);
      if (p.crew.sum > 8) out.over8++;
      if (p.crew.sum < 4) out.under4++;
    }
    if ("part" in p.fixed) { out.fixedMin = Math.min(out.fixedMin, p.fixed.value); out.fixedMax = Math.max(out.fixedMax, p.fixed.value); }
  }
  return out;
}
