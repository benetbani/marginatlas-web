/**
 * What shop space costs here, `04 premises` (MODEL.md 8.3; plan step 32,
 * second dispatch, 2026-09-18): his A2 bento, four cells in his B4 forms,
 * the cluster IS the band and the turn's first band (M1). The tiling is
 * declared here, in source, in the order 8.3's paragraph gives, because the
 * packer is first-fit in declared order and the same four cells in any other
 * order fail to tile at three columns: prime shop rent 2 by 1 at the top
 * left; shops standing empty 1 by 2 down the right, the one tall cell (a
 * grid of 100 is the one drawing); fit-out and deposit 1 by 1 under the
 * rent. 2 + 2 + 1 + 1 = 6 of 6 at 1280; at 768 the rent caps to two columns
 * on row one, the count cell takes rows two and three of column one and the
 * two small cells stack in column two, 6 of 6; under 768 one column in
 * declared order. The component proves both packings and THROWS on a
 * declaration that does not sum (BentoBand.tsx, law 3), so a wrong span
 * fails in the first gate and never reaches a reader.
 *
 * RE-TILED 2026-09-20 EVENING FOR HIS PLUS (MODEL PART 9 clause 60, "prime
 * shop rent $5,000, the fit-out cost, all of these things need details"):
 * the rent and the deposit carry their details on DetailPanel, closed on
 * arrival, which makes each a row taller than a bare figure; with the old
 * tiling the deposit's plus stretched the fit-out cell beside it to 381 with
 * a 228 by 120 blank (the page filter). So the two cells with a plus share
 * row one (rent 2 by 1, deposit 1 by 1), and row two holds the count cell
 * WIDE (shops standing empty 2 by 1, the hundred units in twenty-five
 * columns, four rows) beside the fit-out 1 by 1: 2 + 1 + 2 + 1 = 6 of 6 at
 * 1280; at 768 the rent caps to two columns on row one, the deposit and the
 * fit-out share row two, the count takes row three at two columns, 6 of 6;
 * under 768 one column in declared order. The fit-out and the empty shops
 * have no neighbouring field on any shard (DATA-REQUIREMENTS item 85), so
 * they stand without a plus until the data lands.
 *
 * LOUD 2 (M9): the rent cell's figure in `--terra-text`, lit in the held and
 * the modelled states by the role it plays, unlit only where withheld; the
 * other three cells ink, the count cell `accent={false}` so its units draw in
 * ink on neutral and the cluster keeps one loud cell (the form's own law).
 * No cell prints a label under its figure: the opener says what it is.
 *
 * The figures and their guard are premises_bento_rows.ts's: the shard's
 * `realestate.*`, 252 of 252 (133 held, 119 modelled, the basis saying
 * "modelled for this city"), a null withheld with its line where the figure
 * would stand. The strip of the country's three rents by city size that held
 * this seat since run 13 left with this dispatch: it printed a country
 * average under a city's name (8.3: "The old strip of national tiers
 * leaves"); the country page keeps its own strip and builder.
 *
 * ONE FUNCTION COMPOSES THE CELLS, `premisesCells`, and the story sheet reads
 * it too (stories.tsx, `<slug>:premises`), so the story is the card and not a
 * copy of it that can drift. This file holds no `<Box`: the cells draw their
 * own, so the census does not list the cluster, the country's entry-bill
 * precedent. The cluster's root carries `id="premises"` and
 * `data-block="premises"`, so BLOCK FLOOR counts it once and the checkers
 * address its cells by that id.
 */
import * as React from "react";
import { BentoBand, BentoCount, BentoMetric, type BentoCell } from "@/components/spine/archetypes/BentoBand";
import { DetailPanel } from "@/components/spine/archetypes/DetailPanel";
import type { PremisesBento, PremisesMetric } from "@/lib/spine/premises_bento_rows";
import { COPY } from "@/lib/spine/copy";
import type { AtlasIconId } from "@/components/brand/icons";

/** The count cell's grid since the re-tiling of 2026-09-20: 100 in twenty-five columns is four rows of units, about 100px at the cell's 650px, so the wide count cell stands about as tall as the fit-out cell beside it (BentoCount's `columns` note; fifteen columns and seven rows were the tall 1 by 2 cell's number). */
export const PREMISES_COUNT_COLUMNS = 25;

/** The four cells in declared order, each a figure or its stated line. A metric cell draws one of the two, never neither and never both (BentoMetric's law 2); the accent reaches a printed figure only, a withheld line is never lit. */
export function premisesCells(bento: PremisesBento): BentoCell[] {
  const K = COPY.premisesBento.kickers;
  /* HIS PLUS UNDER A FIGURE (MODEL PART 9 clause 60, 2026-09-20 evening): the
     rows the shard holds around the figure, on DetailPanel, closed on arrival;
     the cell's key names the panel so two open panels never share a name. */
  const metric = (cell: PremisesMetric, icon: AtlasIconId, kicker: string, accent = false, key = "", gloss?: string) =>
    "figure" in cell ? (
      <BentoMetric
        icon={icon}
        kicker={kicker}
        gloss={gloss}
        figure={cell.figure}
        basis={cell.basis}
        sample={cell.sample}
        accent={accent}
        second={cell.second}
        detail={cell.detail ? <DetailPanel name={`premises-${key}`} summary={cell.detail.summary} rows={cell.detail.rows.map((r) => ({ label: r.label, value: r.value }))} /> : undefined}
      />
    ) : (
      <BentoMetric icon={icon} kicker={kicker} gloss={gloss} withheld={cell.withheld} />
    );
  const empty = bento.empty;
  return [
    { key: "rent", cols: 2, rows: 1, node: metric(bento.rent, "commercial-rent", K.rent, true, "rent") },
    { key: "deposit", cols: 1, rows: 1, node: metric(bento.deposit, "startup-cost", K.deposit, false, "deposit") },
    {
      key: "empty",
      cols: 2,
      rows: 1,
      node:
        "part" in empty ? (
          <BentoCount icon="vacancy" kicker={K.empty} part={empty.part} whole={empty.whole} basis={empty.basis} sample={empty.sample} accent={false} columns={PREMISES_COUNT_COLUMNS} />
        ) : (
          /* The count withheld stands as the same opener over its stated line,
             the drawn withheld seat in the metric cell's withheld form: no
             figure, no grid, one line saying why. */
          <BentoMetric icon="vacancy" kicker={K.empty} withheld={empty.withheld} />
        ),
    },
    /* ONE GLOSS ON THIS CARD (2026-09-22, QUEUE ui:the-gloss): "fit-out" is the term on the premises cluster a person taking their first lease will not know, and the cell is named for it. The other three openers are plain words. */
    { key: "fit-out", cols: 1, rows: 1, node: metric(bento.fitOut, "high-street", K.fitOut, false, "fit-out", COPY.glossary.fitOut) },
  ];
}

export function Premises({ bento }: { bento: PremisesBento | null }) {
  if (!bento) return null;
  return <BentoBand id="premises" cols={3} cells={premisesCells(bento)} />;
}
