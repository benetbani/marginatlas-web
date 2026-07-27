/**
 * Chapter 11 , your first year.
 *
 * The cash curve is drawn from the three figures the file publishes: the
 * deepest hole, the month it lands, and the month the room stops losing
 * money. The horizontal span stretches to fit the breakeven month rather than
 * pinning to twelve, because a curve whose labelled crossing sits off its own
 * axis is the defect M7 exists to catch. The mockup's second, unlabelled
 * dashed series is gone: every mark on this page carries its name (M6).
 */
import * as React from "react";

import { Statblock } from "@/components/spine2/Statblock";
import type { StatRow } from "@/components/spine2/Statblock";
import type { GlyphId } from "@/components/spine2/glyphs";
import type { FirstYearModel } from "@/lib/cells/spine2_adapter";

const X0 = 52;
const X1 = 540;
const Y_ZERO = 42;
const Y_BOTTOM = 214;

export function Ch11FirstYear({ firstYear }: { firstYear: FirstYearModel }) {
  const rows: StatRow[] = firstYear.rows.map((r) => ({
    icon: r.icon as GlyphId | undefined,
    label: r.label,
    sub: r.sub,
    value: r.value,
    unit: r.unit,
    answer: r.answer,
  }));

  const span = firstYear.spanMonths;
  const x = (m: number) => X0 + (m / span) * (X1 - X0);
  const yMid = (Y_ZERO + Y_BOTTOM) / 2;
  const xDeep = x(firstYear.deepestMonth);
  const xCross = x(firstYear.breakevenMonth);

  const c1 = X0 + (xDeep - X0) * 0.45;
  const c2 = X0 + (xDeep - X0) * 0.8;
  const c3 = xDeep + (xCross - xDeep) * 0.35;
  const c4 = xDeep + (xCross - xDeep) * 0.72;

  const line =
    `M${X0.toFixed(0)},${Y_ZERO} C${c1.toFixed(0)},${(Y_ZERO + 90).toFixed(0)} ` +
    `${c2.toFixed(0)},${Y_BOTTOM} ${xDeep.toFixed(0)},${Y_BOTTOM} ` +
    `C${c3.toFixed(0)},${Y_BOTTOM} ${c4.toFixed(0)},${(Y_ZERO + 70).toFixed(0)} ` +
    `${xCross.toFixed(0)},${Y_ZERO} L${X1},${(Y_ZERO - 12).toFixed(0)}`;
  const area = `${line} L${X1},${Y_BOTTOM} L${xDeep.toFixed(0)},${Y_BOTTOM} Z`;

  return (
    <div className="grid g21">
      <div
        className="panel pad rise"
        style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <Statblock header={{ label: "The cash story", icon: "bank" }} rows={rows} />
        <p className="note" style={{ marginTop: 16 }}>
          <b>Most people budget the fit-out and nothing else.</b> The thin
          months after opening are what close them, and they show up on no
          opening-cost list.
        </p>
      </div>
      <div className="panel pad-lg rise chart" style={{ animationDelay: ".08s" }}>
        <div className="lab" style={{ marginBottom: 8 }}>
          Cash in the bank, month by month
        </div>
        <svg
          viewBox="0 0 560 240"
          role="img"
          aria-label={`Cash falls to minus ${firstYear.cashBeforeOpenDisplay} around month ${firstYear.deepestMonth}, then climbs back above zero at month ${firstYear.breakevenMonth}.`}
        >
          <line className="gridline" x1={X0 - 8} y1={Y_ZERO} x2={X1 + 8} y2={Y_ZERO} />
          <line className="axis" x1={X0 - 8} y1={yMid} x2={X1 + 8} y2={yMid} />
          <text className="axlbl" x={X0 - 12} y={Y_ZERO + 4} textAnchor="end">
            $0
          </text>
          <text className="axlbl" x={X0 - 12} y={yMid + 4} textAnchor="end">
            −{firstYear.halfDisplay}
          </text>
          <text className="axlbl" x={X0 - 12} y={Y_BOTTOM + 4} textAnchor="end">
            −{firstYear.cashBeforeOpenDisplay}
          </text>
          <path d={area} fill="rgba(194,58,34,.07)" stroke="none" />
          <path d={line} fill="none" className="serie" />
          <circle cx={xDeep} cy={Y_BOTTOM} r={4.5} fill="var(--terra)" stroke="var(--white)" strokeWidth={2.5} />
          <text className="ptlbl a" x={xDeep} y={Y_BOTTOM + 20} textAnchor="middle" fontSize={11}>
            deepest, −{firstYear.cashBeforeOpenDisplay}
          </text>
          <circle cx={xCross} cy={Y_ZERO} r={4.5} fill="var(--ink)" stroke="var(--white)" strokeWidth={2.5} />
          <text className="ptlbl" x={xCross} y={Y_ZERO - 10} textAnchor="middle" fontSize={11}>
            month {firstYear.breakevenMonth}
          </text>
          <text className="axlbl" x={X0} y={Y_BOTTOM + 20}>
            open
          </text>
          <text className="axlbl" x={X1} y={Y_BOTTOM + 20} textAnchor="end">
            month {span}
          </text>
        </svg>
      </div>
    </div>
  );
}
