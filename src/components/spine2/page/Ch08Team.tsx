/**
 * Chapter 08 , what a team costs.
 *
 * Roster derives each line as wage x heads x (1 + on-costs) and totals it,
 * so the total cannot drift from the rows. The on-cost it uses is the
 * EFFECTIVE rate, after the employment allowance a single-site operator
 * qualifies for, which is what makes the derived total reconcile with the
 * staff line the rest of the page spends. The side panel carries both rates,
 * because the marginal one is what a reader will be quoted.
 */
import * as React from "react";

import { Roster } from "@/components/spine2/Roster";
import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import { money } from "@/lib/cells/spine2_adapter";
import type { TeamModel } from "@/lib/cells/spine2_adapter";

export function Ch08Team({ team }: { team: TeamModel }) {
  const rows: StatRow[] = team.rows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <div className="grid g2">
      <div className="panel pad rise">
        <Roster contribPct={team.contribPct} roles={team.roles} />
      </div>
      <div
        className="panel pad rise"
        style={{ animationDelay: ".08s", display: "flex", flexDirection: "column" }}
      >
        {/* --val-col WIDENED FOR THIS BLOCK ONLY, and widened for the BLOCK
            rather than the two rows that need it.

            Two of these figures are ranges: "6.8 to 13.6K" needs 83px and
            "$5.3 to 13.3K" needs 91px against the 78px default, so both were
            being cut mid-figure with no ellipsis. DESIGN.md sanctions exactly
            this: "where the value is genuinely a short phrase rather than a
            figure, widen --val-col on that row, which is what the variable is
            for." A range is a figure, not prose, so it belongs in .v and the
            column moves to fit it.

            BLOCK, NOT ROW, because every number in this kit is tabular-nums so
            that figures line up down a column. Widening two rows out of six
            would fix the clipping and break the alignment that makes the block
            readable, which is trading a visible defect for a subtler one. */}
        <Statblock
          header={{ label: "What hiring actually costs", icon: "hiring" }}
          rows={rows}
          style={{ ["--val-col" as string]: "96px" }}
        />
        <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
          {team.lineCookWage != null && team.lineCookAllIn != null ? (
            <>
              A {money(team.lineCookWage)} line cook really costs{" "}
              <b>{money(team.lineCookAllIn)}</b>.{" "}
            </>
          ) : null}
          About {team.headcountLo} to {team.headcountHi} people is what{" "}
          {team.staffLine} buys here, and that is the whole rota this room can
          afford. The two recruitment routes differ by five times, so which one
          you use is a real decision, not a rounding.
        </p>
      </div>
    </div>
  );
}
