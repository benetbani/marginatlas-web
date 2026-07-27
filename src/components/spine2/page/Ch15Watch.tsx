/**
 * Chapter 15 , what to watch.
 *
 * The mockup's three-worlds tiles are gone: nothing in the data grounds a bad
 * year and a good year for this room, and inventing a spread to fill the
 * frame is the exact defect this build exists to stop. What remains is real:
 * four shocks, each run through the page's own five lines, and the split
 * between what an owner sets and what is set for them.
 *
 * The bite accent is DERIVED, not authored: a shock bites when it leaves the
 * owner below the same wage rung the calculator's note ladder uses.
 */
import * as React from "react";

import { Ctl } from "@/components/spine2/Ctl";
import type { WatchModel } from "@/lib/cells/spine2_adapter";

export function Ch15Watch({ watch }: { watch: WatchModel }) {
  return (
    <div className="grid g12">
      <div className="panel pad-lg rise" style={{ display: "flex", flexDirection: "column" }}>
        <div className="lab" style={{ marginBottom: 16 }}>
          One thing goes wrong, and nothing else changes
        </div>
        <div className="stress">
          {watch.shocks.map((s) => (
            <div className="s" key={s.q}>
              <div className="q">
                {s.q}
                <span>{s.sub}</span>
              </div>
              <span className={s.bite ? "a bite" : "a"}>{s.answer}</span>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: 18, maxWidth: "72ch" }}>
          Nothing about the room changes in any of those rows. Almost every cost
          underneath is already committed, so a single move of a few per cent
          lands whole on the owner.{" "}
          <b>
            {watch.bitesBelowWage} of the {watch.shocks.length} leave the owner
            below {watch.wageRung} a year.
          </b>
        </p>
      </div>
      <div className="panel pad rise" style={{ animationDelay: ".08s" }}>
        <Ctl you={watch.you} not={watch.not} />
        <p className="note" style={{ marginTop: 16 }}>
          Four of the five on the right move against you over time, and none
          move back.
        </p>
      </div>
    </div>
  );
}
