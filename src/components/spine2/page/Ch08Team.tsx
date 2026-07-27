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
        <Statblock header={{ label: "What hiring actually costs", icon: "hiring" }} rows={rows} />
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
