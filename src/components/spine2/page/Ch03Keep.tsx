/**
 * Chapter 03 , what owners actually keep.
 *
 * The hundred is the page's signature and its most heavily tagged section:
 * the shape is a model output, not a measurement, and the chip inside the
 * store island says so where the marks are, not in a footnote.
 */
import * as React from "react";

import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { KeepModel } from "@/lib/cells/spine2_adapter";
import { HundredBlock } from "./store";

export function Ch03Keep({
  keep,
  noun,
  city,
}: {
  keep: KeepModel;
  noun: string;
  city: string;
}) {
  const rows: StatRow[] = keep.rows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <div className="grid g12">
      <div className="panel pad-lg rise">
        <HundredBlock noun={noun} city={city} />
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        <p className="note">
          Every mark is one {noun}. Almost everything below the line is a real
          business, trading, employing people, and not paying its owner a
          living.
        </p>
        <Statblock
          style={{ marginTop: 16 }}
          rail={false}
          header={{ label: "What separates top from bottom", icon: "spread" }}
          rows={rows}
        />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          The biggest thing dividing the chart is <b>what they signed for the
          room</b>, not what they cooked in it. Nobody publishes the split by
          quarter, so those two rent shares are a range and the page says so.
        </p>
      </div>
    </div>
  );
}
