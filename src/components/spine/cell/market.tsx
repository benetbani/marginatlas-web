/**
 * The market for it, `12 market` (MODEL.md 8.6; plan step 33, fifth
 * dispatch, 2026-09-18): his A2 bento, four cells in his B4 forms, the
 * cluster IS the band and the whole of chapter turn three, the page's only
 * bento and its one change of grid shape after six bands of pairs. The
 * tiling is declared here, in source, in the order 8.6's row gives, because
 * the packer is first-fit in declared order: firms per 10,000 people 2 by 1
 * at the top left; held by chains 1 by 1 at the top right; close in a year
 * 1 by 1 at the bottom left; the year's swing 2 by 1 at the bottom right.
 * 2 + 1 + 1 + 2 = 6 of 6 at 1280, two footprints and not four, the wide
 * cells on opposite sides so the two dot grids sit on a diagonal; at 768
 * the firms cell caps to two columns on row one, the two count cells share
 * row two, and the swing takes row three, 6 of 6; under 768 one column in
 * declared order. The component proves both packings and THROWS on a
 * declaration that does not sum (BentoBand.tsx, law 3), so a wrong span
 * fails in the first gate and never reaches a reader.
 *
 * ZERO ACCENT, the fourth explicit decision of 8.6's seat ledger: the page's
 * three are spent above (the take at 40, the total to open at 30, the share
 * of a day at 30), and a fourth would erase the other three (PART 6). So
 * every cell's figure is ink at 30, each cell its own focal, and the two
 * count cells pass `accent={false}` so their units draw in ink on neutral
 * (the fill follows the figure in both directions, BentoCount's note). No
 * cell prints a label under its figure: the opener says what it is. No
 * cell repeats a neighbour: a density, a chain share, a closure share and a
 * seasonal swing are four readings of one subject.
 *
 * The figures and their guard are market_rows.ts's: the shard's
 * `competition.*` and `seasonality.swing_pct`, 243 of 243 (29 and 59 held,
 * every basis saying modelled, R12), a withheld line with its cell where a
 * figure would stand. The old `#seasonality` card (twelve zero-based
 * monthly columns off the London file's multipliers, London only, never on
 * the live route) retired into the swing cell.
 *
 * ONE FUNCTION COMPOSES THE CELLS, `marketCells`, and the story sheet reads
 * it too (stories.tsx, `cell:<handle>:market`), so the story is the card and
 * not a copy of it that can drift. This file holds no `<Box`: the cells draw
 * their own, so the census does not list the cluster, the city premises'
 * precedent. The cluster's root carries `id="market"` and
 * `data-block="market"`, so BLOCK FLOOR counts it once and the checkers
 * address its cells by that id.
 */
import * as React from "react";
import { BentoBand, BentoCount, BentoMetric, type BentoCell } from "@/components/spine/archetypes/BentoBand";
import { MonthLine } from "@/components/spine/archetypes/MonthLine";
import { ShareBar } from "@/components/spine/archetypes/ShareBar";
import { Box, Fig, Ico, SampleTag } from "@/components/spine/kit";
import { densityText, type MarketData, type MarketMetric, type MarketCount } from "@/lib/spine/market_rows";
import { COPY } from "@/lib/spine/copy";
import type { AtlasIconId } from "@/components/brand/icons";

/** The count cells' grid: 100 in twenty columns is five full rows of square units (a whole read as one block, never a ragged last row), about 11px a unit and 70px tall at every width, so a 1 by 1 count cell stands about as tall as the metric cell beside it and neither is stretched into a hole. Ten columns would make the grid as tall as the cell is wide, near 300px at 1280, and the metric cell sharing its row would be three parts air (BentoCount's `columns` note: the grid's height follows the whole and the column count). */
export const MARKET_COUNT_COLUMNS = 20;

/** The four cells in declared order, each a figure or its stated line. A metric cell draws one of the two, never neither and never both (BentoMetric's law 2); nothing here is lit. */
export function marketCells(market: MarketData): BentoCell[] {
  const K = COPY.tradeMarket.kickers;
  const metric = (cell: MarketMetric, icon: AtlasIconId, kicker: string) =>
    "figure" in cell ? (
      <BentoMetric icon={icon} kicker={kicker} figure={cell.figure} basis={cell.basis} sample accent={false} />
    ) : (
      <BentoMetric icon={icon} kicker={kicker} withheld={cell.withheld} />
    );
  const count = (cell: MarketCount, icon: AtlasIconId, kicker: string) =>
    "part" in cell ? (
      <BentoCount icon={icon} kicker={kicker} part={cell.part} whole={cell.whole} basis={cell.basis} sample accent={false} columns={MARKET_COUNT_COLUMNS} />
    ) : (
      /* The count withheld stands as the same opener over its stated line, the drawn withheld seat in the metric cell's withheld form: no figure, no grid, one line saying why. */
      <BentoMetric icon={icon} kicker={kicker} withheld={cell.withheld} />
    );
  /* FOUR CELLS SINCE 2026-09-20 NIGHT, his words on the five-cell photograph
     ("two subsections that have the same sort of graphic close to each
     other"; "a subsection cannot be only with one number": MODEL PART 9
     clauses 64 and 65). THE RIVALS CELL, 2 by 1 at the top left: the trade's
     typical density at 30 with two companions in one row, this city's own
     density where the city shard names the trade exactly (London
     restaurants: 9.1 beside the typical 16) and the share that closes each
     year (20 of 100), so the cell is never one number and the churn's unit
     grid, which stood beside the chains' grid as its twin, is gone; the
     chains' grid stays the cluster's one count drawing at the top right.
     Row two the year's swing with its twelve months as the line (his B30)
     at 2 by 1 and when the week pays as the share bar (his B29) at 1 by 1:
     the grid above the bar are two different sorts, and no two of a sort
     stand in this cluster. 2 + 1 + 2 + 1 = 6 of 6 at 1280; at 768 the
     rivals row one at two columns, the chains and the dayparts row two, the
     line row three, 6 of 6; under 768 one column in declared order. WHERE A
     PERSON EXPECTS THEM (clause 66): how many rivals and how fast they turn
     over first, who owns them beside, then the year and the week under. */
  return [
    { key: "rivals", cols: 2, rows: 1, node: <RivalsCell market={market} /> },
    { key: "chains", cols: 1, rows: 1, node: count(market.chains, "anchor", K.chains) },
    { key: "swing", cols: 2, rows: 1, node: <SwingCell market={market} /> },
    { key: "dayparts", cols: 1, rows: 1, node: <DaypartsCell market={market} /> },
  ];
}

/** THE RIVALS: the trade's typical density at 30, this city's own and the yearly closures as its companions (BentoMetric's `second` row); where the density is withheld the cell states its line and the closures stand as the companion alone. */
export function RivalsCell({ market }: { market: MarketData }) {
  const K = COPY.tradeMarket.kickers;
  const R = COPY.tradeMarket.rivals;
  const firms = market.firms;
  const second: Array<{ figure: string; words: string }> = [];
  if (market.here) second.push({ figure: densityText(market.here.value), words: R.here });
  if ("part" in market.close) second.push({ figure: String(market.close.part), words: R.close });
  if (!("figure" in firms)) return <BentoMetric icon="competition" kicker={K.firms} withheld={firms.withheld} second={second.length > 0 ? second : undefined} />;
  return <BentoMetric icon="competition" kicker={K.firms} figure={firms.figure} basis={market.here ? R.basisHere : firms.basis} sample accent={false} second={second.length > 0 ? second : undefined} />;
}

/** THE SWING WITH ITS YEAR: the metric cell's own composition (opener, figure at 30 in ink, basis) with the month line between the figure and the basis; the figure's withheld line where the swing is not on file, and no line where a month is missing. */
export function SwingCell({ market }: { market: MarketData }) {
  const K = COPY.tradeMarket.kickers;
  const cell = market.swing;
  if (!("figure" in cell)) return <BentoMetric icon="seasonality" kicker={K.swing} withheld={cell.withheld} />;
  return (
    <Box className="flex h-full flex-col" data-archetype="bento-metric" data-bento-kind="metric" data-visual={market.months ? "1" : undefined}>
      <div className="mb-2 flex items-center gap-2">
        <Ico id="seasonality" tone="terra" />
        <h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{K.swing}</h3>
        <SampleTag />
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{cell.figure}</Fig>
        {market.months ? (
          <div className="mt-3">
            <MonthLine points={market.months} />
            <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.tradeMarket.monthsBasis}</p>
          </div>
        ) : null}
      </div>
      <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{cell.basis}</p>
    </Box>
  );
}

/** WHEN THE WEEK PAYS: the stacked share bar over its parts, the opener above and the basis under; the stated line where the shard holds no parts. */
export function DaypartsCell({ market }: { market: MarketData }) {
  const K = COPY.tradeMarket.kickers;
  if (!market.dayparts) return <BentoMetric icon="daily-takings" kicker={K.dayparts} withheld={COPY.tradeMarket.withheld.dayparts} />;
  return (
    <Box className="flex h-full flex-col" data-archetype="share-bar" data-visual="1">
      <div className="mb-2 flex items-center gap-2">
        <Ico id="daily-takings" tone="terra" />
        <h3 data-typography="custom" className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">{K.dayparts}</h3>
        <SampleTag />
      </div>
      <div className="flex flex-1 flex-col justify-center py-2">
        <ShareBar parts={market.dayparts} />
      </div>
      <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{COPY.tradeMarket.daypartsBasis}</p>
    </Box>
  );
}

export function MarketBand({ market }: { market: MarketData | null }) {
  if (!market) return null;
  return <BentoBand id="market" cols={3} cells={marketCells(market)} />;
}
