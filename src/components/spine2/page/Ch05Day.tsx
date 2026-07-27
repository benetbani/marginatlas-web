/**
 * Chapter 05 , a normal day.
 *
 * Three inputs of the modelled room, in the form a reader can picture. All
 * three are stated assumptions rather than measurements, which the chapter
 * says once underneath rather than three times in the tiles.
 */
import * as React from "react";

import { StatTiles } from "@/components/spine2/StatTiles";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { DayModel } from "@/lib/cells/spine2_adapter";

export function Ch05Day({ day }: { day: DayModel }) {
  return (
    <>
      <StatTiles
        className="rise"
        columns={3}
        align="center"
        items={[
          {
            big: String(day.ordersPerDay),
            label: "orders a day",
            pic: { kind: "fill", of: day.ordersOf },
          },
          {
            big: `$${day.spendPerHead}`,
            label: "average spend a head",
            pic: { kind: "disc", of: day.spendOf },
          },
          {
            big: String(day.daysAWeek),
            label: "days a week open",
            pic: { kind: "week" },
          },
        ]}
      />
      <p className="note" style={{ marginTop: 16 }}>
        <span className="lowconf" style={{ marginRight: 10 }}>
          <GlyphIcon id="confidence" size={13} />
          Stated inputs
        </span>
        Nobody publishes covers, spend a head or trading days for independent
        rooms. These three are the model&apos;s own inputs, and the two
        pictures behind them are each drawn against the top of the range the
        calculator lets you move them through.
      </p>
    </>
  );
}
