/**
 * THE INDUSTRY PAGE'S TURN ONE (MODEL.md 8.7; plan step 34's second
 * dispatch, 2026-09-18): the band `03 split | 04 open`, then `05 pays` as
 * its own band, the bento. Each card is drawn ONCE here and mounted by
 * industry-view.tsx on the page and by the archetype stories on the sheet,
 * so the card a story is judged on is the card the page draws (the
 * renderers-agree rule, plan step 25). The view seats them.
 *
 * `03 split` IS THE TRADE PAGE'S OWN CARD, cell/turn-one.tsx's SplitCard,
 * mounted here unchanged: IncomeBreakdown off split_rows.ts at the world
 * altitude (`buildIndustrySplit`, the one net builder with the engine
 * absent, the same figure the hero prints at 40, R7), the residual named as
 * its own segment, the net pinned last at 30 in ink, the withheld line
 * where the bar would stand on the thirteen shards whose lines and net run
 * past a hundred, the plus at the foot (fixed and variable costs, closed on
 * arrival). The card takes no altitude prop and needs none: its kicker is
 * his name for the B6 seat (M15), its basis names the trade or the sector
 * and no city, so every string is one literal on both pages, as `01 lasts`
 * is. QUIET, by the same ruling as on the trade page (his 2026-09-08 word
 * on this exact section; R7 makes an accent here the hero's number lit
 * twice). The page's second bar-family drawing (M10), LEFT, so it never
 * shares a column with `02`'s bars on the right. The census reads it as
 * IncomeBreakdown.
 *
 * `04 open` (OpenCard): a plain KvGrid holding candidate 1's seat, the
 * permits' precedent: three cells at the head rung, the licences to hold
 * first (the card's width on an odd count, the silhouette the focal would
 * take the day he clicks), no 30 until then, so the FOCAL finding on this
 * card stands as the country's, the city's and the trade's seats stand.
 * Under the grid its basis and its foot; at the foot his plus (DetailPanel,
 * closed on arrival, weightless in the hierarchy): the licences by name
 * with their days, the permits' own rows. The builder is
 * industry_open_rows.ts over the trade's permits and open builders. The
 * census reads this Box as KvGrid.
 *
 * `05 pays` (PaysBand): his A2 bento in his B4 cells, `BentoBand` with the
 * tiling DECLARED here in source, because the packer is first-fit in
 * declared order. NOT 8.7's THREE CELLS ON TWO COLUMNS: that declaration
 * makes the crew a 1072px card at 1280 (full width by the section-bands
 * gate and by his ban on any full width but the hero; the gate reddened it
 * on the first render, 0 to 1 on a baseline that may only fall), and the
 * only other three-cell tiling BentoBand allows, the crew as the tall cell,
 * cannot hold a whole that runs 2 to 38 in scope (pays_rows.ts says why,
 * with the numbers). So the cluster takes the trade market's PROVEN tiling
 * (cell/market.tsx, 2+1 over 1+2 on three columns): the years until the
 * capital comes back two by one at the top left, the `BentoMetric` CARRYING
 * THE TURN'S ACCENT (`accent`, the page's second loud moment,
 * `--terra-text`, the one lit cell the cluster's law allows, and the cell
 * the eye meets first); the starting crew one by one at the top right, a
 * `BentoCount` whose part is its whole (every unit drawn and inked,
 * `accent={false}` so the units are ink on neutral and the figure ink, its
 * `columns` following the whole to ten a row, `crewColumns` below); the fixed part of
 * the costs one by one at the bottom left, a `BentoCount` on 100 units in
 * the market's twenty columns, ink; the share of a day that clears the
 * costs two by one at the bottom right, ink. 2 + 1 + 1 + 2 = 6 of 6 at
 * 1024 and up; at 768 the payback caps to two columns on row one, the two
 * count cells share row two and the share takes row three, 6 of 6; under
 * 768 one column in declared order. The component proves both packings and
 * THROWS on a declaration that does not sum (BentoBand.tsx, law 3). No
 * cell prints a label under its figure: the opener says what it is. No
 * cell repeats a neighbour or `04`: a payback, a headcount, a share of the
 * cost stack and a share of a day are four readings of what carries a
 * trade until it pays back. This file holds no `<Box` for the cluster: the
 * cells draw their own, so the census does not list it (the city premises'
 * precedent); the cluster's root carries `id="pays"` and
 * `data-block="pays"`, so BLOCK FLOOR counts it once and the checkers
 * address its cells by that id.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { KvGrid } from "@/components/spine/archetypes/KvGrid";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import { BentoBand, BentoCount, BentoMetric, type BentoCell } from "@/components/spine/archetypes/BentoBand";
import { COPY } from "@/lib/spine/copy";
import type { IndustryOpenData } from "@/lib/spine/industry_open_rows";
import type { PaysData, PaysMetric, PaysCount } from "@/lib/spine/pays_rows";
import type { AtlasIconId } from "@/components/brand/icons";

export { SplitCard } from "@/components/spine/cell/turn-one";

export function OpenCard({ id = "open", open }: { id?: string; open: IndustryOpenData | null }) {
  if (!open) return null;
  return (
    <Box id={id}>
      {/* Every shard figure is modelled (R12), so the opener's mark is on, behind his switch. */}
      <Rail icon="licence-specific" kicker={COPY.industryOpen.kicker} sample />
      {/* THE ROW RESERVE, the permits' own (KvGrid.tsx): at the 347 seat "The
          slowest licence" wraps to two lines and the two-lines reserve is off
          from lg, so on the default reserve its figure dropped 33px under "6
          months" beside it (measured 2026-09-18); on "row" each figure sits on
          its cell's floor and the row's figures share one top whatever the
          labels wrap to (ruling 8 by a different mechanism). No notes, which
          is the reserve's one condition. */}
      <KvGrid cells={open.cells} labelReserve="row" />
      {open.withheldLines.map((line) => (
        <p key={line} className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{line}</p>
      ))}
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{open.basis}</p>
      <p className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{open.foot}</p>
      {open.detail ? <DetailPanel name={`detail-${id}`} summary={open.detail.summary} rows={open.detail.rows} withheldLine={open.detail.withheldLine} /> : null}
    </Box>
  );
}

/** The fixed-cost cell's grid: 100 in twenty columns is five full rows of square units, about 11px a unit and 70px tall at every width (the market's own constant and reason, cell/market.tsx), so the one-by-one count stands about as tall as the metric cell beside it. */
export const PAYS_COUNT_COLUMNS = 20;

/** THE CREW'S COLUMNS FOLLOW ITS WHOLE, capped at ten. At 768 the two
 *  one-by-one counts share a row by the packer's own arithmetic (two wide
 *  cells take whole rows, so the two small cells must share the third), and
 *  the crew is stretched to the fixed-cost cell's five-row grid. On the
 *  component's default 10px units a crew of eleven is one short row, and the
 *  sheet's checker, which measures the cluster as one card, found the blank
 *  right of it 184 by 198 at 768, at its floor exactly (measured 2026-09-18).
 *  With `columns` the units are sized to the cell's width, so the grid spans
 *  it whatever the crew; and the count is capped by the whole so a crew of
 *  two is two units half the cell wide and not two units in a row of ten
 *  empty slots, which would open the same blank to their right. Ten a row
 *  keeps a crew of 38 (the largest in scope) to four rows and the cell about
 *  as tall as the fixed-cost grid beside it; the retired shards over a
 *  hundred (higher education 93, hospitals 460) would overrun it, and no
 *  route reaches them. The tiling is still declared; this sizes one
 *  drawing. */
export const CREW_COLUMNS_CAP = 10;
export const crewColumns = (whole: number) => Math.max(1, Math.min(CREW_COLUMNS_CAP, Math.round(whole)));

/** The four cells in declared order, each a figure or its stated line. A metric cell draws one of the two, never neither and never both (BentoMetric's law 2); the accent reaches the payback's printed figure only, a withheld line is never lit. */
export function paysCells(pays: PaysData): BentoCell[] {
  const K = COPY.industryPays.kickers;
  const metric = (cell: PaysMetric, icon: AtlasIconId, kicker: string, accent = false) =>
    "figure" in cell ? (
      <BentoMetric icon={icon} kicker={kicker} figure={cell.figure} basis={cell.basis} sample accent={accent} />
    ) : (
      <BentoMetric icon={icon} kicker={kicker} withheld={cell.withheld} />
    );
  /* The count withheld stands as the same opener over its stated line, the drawn withheld seat in the metric cell's withheld form: no figure, no grid, one line saying why. */
  const count = (cell: PaysCount, icon: AtlasIconId, kicker: string) =>
    "part" in cell ? (
      <BentoCount icon={icon} kicker={kicker} part={cell.part} whole={cell.whole} basis={cell.basis} sample accent={false} columns={PAYS_COUNT_COLUMNS} />
    ) : (
      <BentoMetric icon={icon} kicker={kicker} withheld={cell.withheld} />
    );
  const crew = pays.crew;
  return [
    { key: "payback", cols: 2, rows: 1, node: metric(pays.payback, "startup-cost", K.payback, true) },
    {
      key: "crew",
      cols: 1,
      rows: 1,
      node:
        "part" in crew ? (
          <BentoCount icon="staffing-rota" kicker={K.crew} part={crew.part} whole={crew.whole} basis={crew.basis} sample accent={false} columns={crewColumns(crew.whole)} />
        ) : (
          <BentoMetric icon="staffing-rota" kicker={K.crew} withheld={crew.withheld} />
        ),
    },
    { key: "fixed", cols: 1, rows: 1, node: count(pays.fixed, "cost-breakdown", K.fixed) },
    { key: "share", cols: 2, rows: 1, node: metric(pays.share, "break-even", COPY.tradeClears.kicker) },
  ];
}

export function PaysBand({ pays }: { pays: PaysData | null }) {
  if (!pays) return null;
  return <BentoBand id="pays" cols={3} cells={paysCells(pays)} />;
}
