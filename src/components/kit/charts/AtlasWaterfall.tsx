"use client";

/**
 * src/components/kit/charts/AtlasWaterfall.tsx
 *
 * THE MONEY WATERFALL, built on recharts instead of hand-cut SVG.
 *
 * WHY THIS EXISTS. This site draws the same picture four times: where each $100
 * of sales goes, and what is left for the owner. There is a `Waterfall` in the
 * spine kit, another in the chart kit, a third written inline on a download
 * page, and a `SteppedWaterfall` on the cell page's money chapter. All four are
 * hand-cut SVG. The founder's ruling is the whole reason this file is here:
 * standardising on a proven substrate "removes a lot of errors and pain."
 *
 * THE DEFECTS THAT JUSTIFY THE SWAP, measured rather than asserted. This is not
 * preference: the version being replaced draws into a FIXED 480-unit viewBox and
 * then scales the whole thing with `w-full`, which scales the TEXT with it. That
 * chart's labels are therefore small in a narrow column and oversized in a wide
 * one, and no amount of care in the markup can fix it, because the markup never
 * learns how wide it ended up. It also carries six raw hex values in a repo
 * whose hard constraints forbid raw hex in components.
 *
 *   TAKEN FROM THE LIBRARY   the band scale, the axis tick layout, responsive
 *           measurement (text now sits at a real px size at every width), label
 *           collision handling, and the keyboard accessibility layer.
 *   NOT TAKEN   the default palette, the rounded candy bars, the legend, the
 *           card furniture, and the "Trending up 5.2%" footer. Every one of
 *           those arrives switched on and every one is refused here.
 *
 * DECISIONS MADE HERE, so they are not re-litigated:
 *
 *   NO TOOLTIP. Every value is printed on the chart. A hover is not a carrier
 *   of data on this site, it is a convenience, and a chart that hides its
 *   numbers behind a pointer is unreadable on a phone. Printing them also
 *   removes the hover-and-focus accessibility trap rather than solving it.
 *
 *   THE IDENTITY MUST CLOSE. Start minus the steps has to equal the end, within
 *   half a unit of rounding. A waterfall that does not close is claiming a sum
 *   that is not true, so it renders NOTHING rather than a shape that lies. This
 *   is the same contract the share bar already holds itself to.
 *
 *   ONE ACCENT. Terracotta is the kept slice and nothing else. The opening bar
 *   and every deduction are the cool neutral ramp, so the eye lands on the
 *   answer without a second hue entering the page.
 *
 *   CONNECTORS ARE DRAWN IN THE CHART'S OWN COORDINATE SPACE, reading the real
 *   scales rather than guessing at pixel positions. If a future version of the
 *   library changes that shape, the guard below returns nothing and the chart
 *   loses its connectors: it does not crash, and it never draws them in the
 *   wrong place.
 *
 * IT IS A CLIENT COMPONENT. recharts measures the DOM, so this renders EMPTY in
 * the server-render screenshot harness. Verifying it needs a hydrated page.
 */
import * as React from "react";
import { Bar, BarChart, Cell, Customized, LabelList, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export interface WaterfallPoint {
  label: string;
  value: number;
}

export interface AtlasWaterfallProps {
  /** The opening quantity. For the money identity: 100 dollars of sales. */
  start: WaterfallPoint;
  /** The deductions, in the order they should be read. */
  steps: WaterfallPoint[];
  /** What is left. This is the one terracotta bar. */
  end: WaterfallPoint;
  /** Printed before the opening and closing figures, e.g. "$". */
  prefix?: string;
  height?: number;
}

/* The share of each category band left empty on either side of its bar. Pinned
   here AND handed to recharts as barCategoryGap, so the connector geometry
   below is derived rather than guessed. Change one and change both. */
const BAND_GAP = 0.24;

type Row = {
  label: string;
  base: number;
  delta: number;
  kind: "start" | "drop" | "end";
  /** The running level this column leaves behind, where its connector sits. */
  close: number;
  print: string;
};

export function AtlasWaterfall({
  start,
  steps,
  end,
  prefix = "",
  height = 200,
}: AtlasWaterfallProps) {
  /* ONE implementation of the row maths, shared with the proof sheet. Two
     copies of this drifting apart is exactly the class of defect this whole
     migration exists to remove. */
  const { rows, closes } = buildWaterfallRows({ start, steps, end, prefix });

  /* SELF-OMISSION. Nothing to draw, or an identity that does not close. */
  if (!Number.isFinite(start.value) || !Number.isFinite(end.value)) return null;
  if (!closes) return null;

  const config: ChartConfig = { delta: { label: "Share", color: "var(--chart-1)" } };

  const reading = rows
    .map((r) =>
      r.kind === "drop"
        ? `${r.label} takes ${prefix}${r.delta}`
        : `${r.label} ${prefix}${r.delta}`,
    )
    .join(", ");

  return (
    <ChartContainer config={config} style={{ height }} className="w-full">
      {waterfallChart({ rows, max: start.value, reading })}
    </ChartContainer>
  );
}

/**
 * The chart itself, as a bare element.
 *
 * SPLIT OUT ON PURPOSE, and the reason is a real constraint rather than taste.
 * `ChartContainer` wraps its child in a responsive container that measures the
 * DOM, which means the whole chart renders as an empty box outside a browser.
 * The machine this is being built on could not keep a dev server alive long
 * enough to photograph it. Handing this element an explicit width and height
 * renders the same chart, the same scales and the same connector geometry with
 * no browser at all, which is how the standalone proof sheet is produced.
 *
 * So this is not a test-only duplicate of the chart. It IS the chart; the
 * component above is the same element wearing a responsive wrapper.
 */
export function waterfallChart({
  rows,
  max,
  reading,
}: {
  rows: Row[];
  max: number;
  reading?: string;
}) {
  const fill = (k: Row["kind"]) =>
    k === "end" ? "var(--chart-1)" : k === "start" ? "var(--chart-5)" : "var(--chart-4)";

  return (
    <BarChart
      accessibilityLayer
      data={rows}
      barCategoryGap={`${BAND_GAP * 100}%`}
      margin={{ top: 20, right: 2, left: 2, bottom: 0 }}
      role="img"
      aria-label={reading}
    >
      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        interval={0}
        /* ROOM FOR THE SECOND LINE. The axis gutter defaults to 30px, which
           clips a wrapped label's lower line and shows only its first half,
           silently. Caught on the proof sheet: "Food + drink" read "Food +"
           at every width until this was set. */
        height={40}
        tick={<WrappedTick />}
      />
      {/* PINNED TO ZERO. A waterfall whose floor floats is a different claim. */}
      <YAxis hide domain={[0, max]} />
      {/* The zero baseline, drawn, because the reading is "of the total". */}
      <ReferenceLine y={0} stroke="var(--chart-5)" strokeWidth={1} />
      <Customized component={(p: any) => <Connectors {...p} rows={rows} />} />
      {/* The invisible pedestal that floats each deduction to its true level. */}
      <Bar dataKey="base" stackId="a" fill="transparent" isAnimationActive={false} />
      <Bar dataKey="delta" stackId="a" radius={2} isAnimationActive={false}>
        {rows.map((r) => (
          <Cell key={r.label} fill={fill(r.kind)} />
        ))}
        <LabelList
          dataKey="print"
          position="top"
          offset={6}
          className="fill-[var(--chart-2)] tabular-nums"
          fontSize={11}
        />
      </Bar>
    </BarChart>
  );
}

/** The row maths, exported so the proof sheet builds the same shape the page does. */
export function buildWaterfallRows({
  start,
  steps,
  end,
  prefix = "",
}: Omit<AtlasWaterfallProps, "height">): { rows: Row[]; closes: boolean } {
  const clean = (steps ?? []).filter((s) => s && Number.isFinite(s.value) && s.value > 0);
  const rows: Row[] = [
    {
      label: start.label,
      base: 0,
      delta: start.value,
      kind: "start",
      close: start.value,
      print: `${prefix}${start.value.toLocaleString()}`,
    },
  ];
  let level = start.value;
  for (const s of clean) {
    const from = level;
    level -= s.value;
    rows.push({
      label: s.label,
      base: level,
      delta: from - level,
      kind: "drop",
      close: level,
      print: `-${s.value.toLocaleString()}`,
    });
  }
  rows.push({
    label: end.label,
    base: 0,
    delta: end.value,
    kind: "end",
    close: end.value,
    print: `${prefix}${end.value.toLocaleString()}`,
  });
  const residual = start.value - clean.reduce((a, s) => a + s.value, 0);
  return { rows, closes: clean.length > 0 && Math.abs(residual - end.value) <= 0.5 };
}

/**
 * The axis label, wrapped onto a second line rather than run into its neighbour.
 *
 * FOUND BY LOOKING, not by reasoning. At phone width the first proof sheet ran
 * "Food + drink" straight into "Wages", because six categories across 320px
 * leaves about fifty pixels a label and the library will happily draw them all
 * on one line when told to draw them all. Two lines of short words fit; one long
 * line does not.
 *
 * Wrapping beats the alternatives. Dropping labels leaves an unlabelled bar,
 * which on a chart whose whole point is WHICH cost took the money is not a
 * chart. Angling them costs vertical space and legibility. Truncating hides the
 * word the reader came for.
 */
function WrappedTick(props: any) {
  const { x, y, payload } = props;
  const text = String(payload?.value ?? "");
  const words = text.split(/\s+/).filter(Boolean);

  /* Greedy two-line fill. A third line would be taller than the axis gutter, so
     anything that does not fit in two stays on the second and is allowed to be
     the widest thing there: a rare long word is better than a lost label. */
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > 8 && cur && lines.length === 0) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.slice(0, 2).map((ln, i) => (
        <text
          key={ln + i}
          x={0}
          y={0}
          dy={12 + i * 12}
          textAnchor="middle"
          fontSize={11}
          fill="var(--chart-3)"
        >
          {ln}
        </text>
      ))}
    </g>
  );
}

/**
 * The dashed rules that carry the running level from one column to the next.
 *
 * recharts hands this component the chart's internal state, which includes the
 * real band and value scales. Every access is guarded: if the shape is not what
 * this expects, the connectors are omitted and the chart still reads.
 */
function Connectors({ xAxisMap, yAxisMap, rows }: any) {
  const xAxis: any = xAxisMap ? Object.values(xAxisMap)[0] : null;
  const yAxis: any = yAxisMap ? Object.values(yAxisMap)[0] : null;
  const xs = xAxis?.scale;
  const ys = yAxis?.scale;
  if (typeof xs !== "function" || typeof ys !== "function") return null;
  if (typeof xs.bandwidth !== "function") return null;

  const band = xs.bandwidth();
  if (!Number.isFinite(band) || band <= 0) return null;
  const inset = (band * BAND_GAP) / 2;

  const out: React.ReactNode[] = [];
  for (let i = 0; i < rows.length - 1; i++) {
    const a = xs(rows[i].label);
    const b = xs(rows[i + 1].label);
    const y = ys(rows[i].close);
    if (![a, b, y].every((n: number) => Number.isFinite(n))) continue;
    out.push(
      <line
        key={rows[i].label}
        x1={a + band - inset}
        y1={y}
        x2={b + inset}
        y2={y}
        stroke="var(--chart-5)"
        strokeWidth={1}
        strokeDasharray="2 2"
      />,
    );
  }
  return <g>{out}</g>;
}

export default AtlasWaterfall;
