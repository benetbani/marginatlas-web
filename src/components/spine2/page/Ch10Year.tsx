/**
 * Chapter 10 , through the year.
 *
 * The weakest section on the page and it says so at the top of its own note:
 * no monthly revenue series is published for this trade in this city, so the
 * shape is a trade pattern, tagged, not a forecast. The peak and trough
 * sentences are derived by the component's own summary so the prose cannot
 * name a month the bars do not draw.
 */
import * as React from "react";

import { MonthDeviation, monthDeviationSummary } from "@/components/spine2/MonthDeviation";
import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import type { YearModel } from "@/lib/cells/spine2_adapter";
import { More } from "./ChapterHead";

export function Ch10Year({ year }: { year: YearModel }) {
  const summary = monthDeviationSummary(year.months);
  const rows: StatRow[] = year.seasonRows.map((r) => ({
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  return (
    <div className="panel pad rise">
      <MonthDeviation
        months={year.months}
        header={{ title: "Revenue, month by month", sub: "indexed to the year average" }}
      />
      {summary ? (
        <p className="note" style={{ marginTop: 16 }}>
          <span className="lowconf" style={{ marginRight: 10 }}>
            <GlyphIcon id="confidence" size={13} />
            Pattern, not a forecast
          </span>
          {summary.peak.name} runs about {summary.peak.pctAbove}% above the year
          and {summary.trough.name} about {summary.trough.pctBelow}% below.{" "}
          <b>The lull lands right after the peak, when the rent has not moved.</b>
        </p>
      ) : null}
      <More glyph="seasonality" summary="Show the season by season index" count="the pattern">
        <Statblock
          style={{ marginTop: 4 }}
          rail={false}
          header={{ label: "Revenue index by season" }}
          rows={rows}
        />
        <p className="note" style={{ marginTop: 12 }}>
          Office-district rooms and neighbourhood rooms run opposite shapes.
          Which one you are decides how much of the peak you hold back.
        </p>
      </More>
    </div>
  );
}
