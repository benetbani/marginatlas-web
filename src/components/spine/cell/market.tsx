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
import type { MarketData, MarketMetric, MarketCount } from "@/lib/spine/market_rows";
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
  return [
    { key: "firms", cols: 2, rows: 1, node: metric(market.firms, "competition", K.firms) },
    { key: "chains", cols: 1, rows: 1, node: count(market.chains, "anchor", K.chains) },
    { key: "close", cols: 1, rows: 1, node: count(market.close, "vacancy", K.close) },
    { key: "swing", cols: 2, rows: 1, node: metric(market.swing, "seasonality", K.swing) },
  ];
}

export function MarketBand({ market }: { market: MarketData | null }) {
  if (!market) return null;
  return <BentoBand id="market" cols={3} cells={marketCells(market)} />;
}
