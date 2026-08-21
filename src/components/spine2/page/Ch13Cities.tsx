/**
 * Chapter 13 , the same trade in other cities.
 *
 * Self-omitting by construction: `comparisons.cities` in the data file is a
 * NullFigure at launch (no peer cell files for Manchester or Edinburgh yet),
 * so `buildCities` in the adapter hands this component `null` and it never
 * mounts. This file exists so that once those peer cell files are built the
 * same way as this one, the chapter appears with no further code.
 *
 * The strip is AxisDots' "line" track , the component's own doc names this
 * chapter as its reference use. The five-column table underneath is
 * hand-rolled `table.tb`, the same way Matrix and Fitgrid hand-roll their
 * own table shapes; no shared primitive in the kit renders this one.
 *
 * The qualifier under the label ("<city> is the marker on the <side>")
 * names the current-city dot and reads its side off the same domain math
 * the strip itself positions by (M5: derived, never typed) , it can never
 * name a side the dot does not actually sit on. The closing note is the one
 * sentence this component does not author: it is an optional prop, and
 * renders nothing until the page that supplies it exists.
 */
import * as React from "react";

import { AxisDots } from "@/components/spine2/AxisDots";
import type { AxisStop } from "@/components/spine2/AxisDots";
import type { CitiesModel } from "@/lib/cells/spine2_adapter";
import { More } from "./ChapterHead";

/**
 * The strip's domain: half the observed spread padded onto each end, so the
 * extreme dots never draw flush with the axis ends. On the mockup's own
 * illustrative reading (39/40/41/43) this reproduces its 37..45 axis
 * exactly. A degenerate all-equal set falls back to a small fixed pad so
 * the axis is never zero-width.
 */
function ownerKeepsDomain(values: number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  if (!(hi > lo)) {
    const pad = Math.max(1, Math.abs(lo) * 0.1);
    return [lo - pad, hi + pad];
  }
  const pad = (hi - lo) / 2;
  return [lo - pad, hi + pad];
}

export function Ch13Cities({
  cities,
  note,
}: {
  cities: CitiesModel | null;
  /** The closing note under the table. Founder copy, not authored here;
   * renders nothing until a page supplies it. */
  note?: React.ReactNode;
}) {
  if (cities == null || cities.rows.length < 2) return null;

  const current = cities.rows.filter((r) => r.isCurrent);
  if (current.length !== 1) return null;
  const here = current[0];

  const [lo, hi] = ownerKeepsDomain(cities.rows.map((r) => r.ownerKeepsValue));
  const side = (here.ownerKeepsValue - lo) / (hi - lo) >= 0.5 ? "right" : "left";

  const stops: AxisStop[] = cities.rows.map((r) => ({
    value: r.ownerKeepsValue,
    display: r.ownerKeepsDisplay,
    label: r.city,
    role: r.isCurrent ? "subject" : undefined,
  }));

  return (
    <div className="panel pad rise">
      <div className="lab" style={{ marginBottom: 6 }}>
        What an owner keeps, city by city{" "}
        <span
          style={{
            textTransform: "none",
            letterSpacing: 0,
            color: "var(--muted)",
            fontWeight: 400,
          }}
        >
          {here.city} is the marker on the {side}
        </span>
      </div>
      <AxisDots stops={stops} domain={[lo, hi]} track="line" />
      <More
        glyph="compare"
        summary="Show revenue and competition per city"
        count={`${cities.rows.length} cities`}
      >
        <div className="scroll-x">
          <table className="tb">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">Revenue</th>
                <th scope="col">Owner keeps</th>
                <th scope="col">Per 10k people</th>
                <th scope="col">Break in</th>
              </tr>
            </thead>
            <tbody>
              {cities.rows.map((r) => (
                <tr key={r.city} className={r.isCurrent ? "on" : undefined}>
                  <td>{r.city}</td>
                  <td>{r.revenueDisplay}</td>
                  <td className={r.isCurrent ? "k" : undefined}>{r.ownerKeepsDisplay}</td>
                  <td>{r.per10kPeople}</td>
                  <td>{r.breakIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note ? (
          <p className="note" style={{ marginTop: 12 }}>
            {note}
          </p>
        ) : null}
      </More>
    </div>
  );
}
