/**
 * Chapter 06 , where the money goes.
 *
 * The column is the five model lines as shares of one dollar; the keep slice
 * carries the accent because it is the answer. The legend's range is the
 * file's own ownerKeeps range (running costs at 15% against 11%), not a
 * rounded guess, so the slice and the sentence move together.
 */
import * as React from "react";

import { ColSplit } from "@/components/spine2/ColSplit";
import type { ColSeg, ColSplitTone } from "@/components/spine2/ColSplit";
import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { MoneyModel } from "@/lib/cells/spine2_adapter";

const TONES: ColSplitTone[] = ["n1", "n2", "n3", "n4", "n5"];

export function Ch06Money({ money }: { money: MoneyModel }) {
  const segments: ColSeg[] = money.segments.map((s, i) => ({
    label: s.label,
    value: s.value,
    display: s.display,
    tone: s.kept ? "n1" : (TONES[i] ?? "n5"),
    kept: s.kept,
  }));

  const rows: StatRow[] = money.rows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  const lo = Math.round(money.keepLoPct);
  const hi = Math.round(money.keepHiPct);

  return (
    <div className="grid g12" style={{ alignItems: "start" }}>
      <div className="rise">
        <div className="lab" style={{ marginBottom: 12 }}>
          Every dollar of revenue, top to bottom
        </div>
        <ColSplit
          segments={segments}
          legendNote={
            hi > lo
              ? `Heights are exactly proportional. The last slice is a range, ${lo}% to ${hi}%, depending on where running costs land.`
              : "Heights are exactly proportional."
          }
        />
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        <Statblock header={{ label: "What one move is worth", icon: "margin" }} rows={rows} />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          Two thirds of every dollar goes on staff and food, and{" "}
          <b>the {lo}% at the end is all that pays you.</b> The last row is
          worth more than a fifth more customers, and it costs nothing but
          attention.
        </p>
      </div>
    </div>
  );
}
