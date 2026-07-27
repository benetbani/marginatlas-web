/**
 * Chapter 07 , what you must take each day.
 *
 * The third mark on the track is the reader's own target, so the track lives
 * in the store island. The side panel ranks the six variables by what one
 * realistic step on each is worth, computed by the same engine the calculator
 * runs, so the two can never disagree about which lever is biggest.
 */
import * as React from "react";

import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { FloorModel } from "@/lib/cells/spine2_adapter";
import { FloorTrack } from "./store";

export function Ch07Floor({ floor }: { floor: FloorModel }) {
  const rows: StatRow[] = floor.rows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <div className="grid g2" style={{ alignItems: "start" }}>
      <div className="panel pad rise">
        <div className="lab" style={{ marginBottom: 16 }}>
          The floor, every day you open
        </div>
        <FloorTrack floor={floor} />
        <p className="note" style={{ marginTop: 26 }}>
          Before a plate is sold the day has already cost you{" "}
          <b>{floor.committedDisplay}</b> in staff, rent and bills. You break
          even at <b>{floor.breakevenDisplay}</b> of takings, because food eats{" "}
          {floor.foodCents} cents of every dollar on the way in. The third mark
          is your own target, and it moves with the slider in the hero.
        </p>
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        <Statblock
          header={{ label: "What one realistic step is worth", icon: "ranking" }}
          rows={rows}
        />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          Ranked by what a single believable move on each is worth in a year,
          from the same arithmetic the calculator runs. Volume sits at the top
          because it is worth the most, not because it is the easiest to find.
        </p>
      </div>
    </div>
  );
}
