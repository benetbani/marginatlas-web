/**
 * Chapter 12 , business survival, year by year.
 *
 * The corrected cohort track: the page used to draw 74 / 52 / 41, which was
 * nobody's figure, and its myth line corrected the claim with a two-year rate
 * wearing a one-year label. Both come off the data file now, and the fix
 * sentence interpolates the same first reading the top bar draws.
 */
import * as React from "react";

import { Myth } from "@/components/spine2/Myth";
import { ShrinkBars } from "@/components/spine2/ShrinkBars";
import { Late } from "@/components/spine2/Late";
import type { SurvivalModel } from "@/lib/cells/spine2_adapter";

export function Ch12Survival({ survival }: { survival: SurvivalModel }) {
  return (
    <div className="grid g12">
      <div className="panel pad-lg rise">
        <Myth
          style={{ marginBottom: 20 }}
          claim={survival.claim}
          fix={survival.reality}
        />
        <ShrinkBars
          start={100}
          stages={survival.stages}
          variant="track"
          inBarFmt={(v) => `${Math.round(v)}%`}
          firstBarFmt={(v) => `${Math.round(v)}% still trading`}
        />
        <p className="note" style={{ marginTop: 16 }}>
          Survival is measured on the business, not the room: one that moves or
          is sold survives. Year one is the safest year in the whole series, and
          the thinning that follows is quiet.
        </p>
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        <div className="lab" style={{ marginBottom: 12 }}>
          When they close, and why
        </div>
        <Late items={survival.late} />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          Each of these has a cash cause, and each one is visible a year before
          it happens.
        </p>
      </div>
    </div>
  );
}
