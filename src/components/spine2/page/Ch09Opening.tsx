/**
 * Chapter 09 , what it costs to open.
 *
 * The total is the file's own published sum, and the fit-out point it takes
 * is DERIVED as total minus the fixed rows, never written twice. If any row
 * loses its figure the total footer degrades away by itself: a total over a
 * partial list is a lie.
 */
import * as React from "react";

import { RankBarsV2 } from "@/components/spine2/RankBarsV2";
import type { RankRowV2 } from "@/components/spine2/RankBarsV2";
import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { OpeningModel } from "@/lib/cells/spine2_adapter";

export function Ch09Opening({ opening }: { opening: OpeningModel }) {
  const rows: RankRowV2[] = opening.rows.map((r) => ({
    id: r.id,
    label: r.label,
    value: r.value ?? null,
    range: r.range ?? null,
    display: r.display,
  }));

  const sideRows: StatRow[] = opening.sideRows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <div className="grid g12" style={{ alignItems: "start" }}>
      <div className="panel pad rise">
        <div className="lab" style={{ marginBottom: 16 }}>
          Everything it takes to open the doors
        </div>
        <RankBarsV2 rows={rows} total={opening.total} />
        <p className="note" style={{ marginTop: 18 }}>
          Fit-out dwarfs everything else and it is the one number nobody can
          tell you. The {opening.total.display} total takes it at{" "}
          <b>{opening.assumedFitout}</b>, near the middle of the range. A light
          refresh of a room that already traded as a restaurant sits at the
          bottom of that range. A strip-out to bare brick sits at the top.
        </p>
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        {/* --val-col widened for the block, same reason as chapter 08: the
            fit-out row is a range, "$93 to 353K", and a range is a figure that
            belongs in .v. At the 78px default it was cut mid-figure with no
            ellipsis. Widened for the whole block rather than the one row so the
            column of tabular figures still lines up. */}
        <Statblock
          header={{ label: "Fixed, versus up to you", icon: "spread" }}
          rows={sideRows}
          style={{ ["--val-col" as string]: "96px" }}
        />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          Three of these four are fixed by the law and the market. The fourth is
          a choice, and it swings by a quarter of a million.
        </p>
      </div>
    </div>
  );
}
