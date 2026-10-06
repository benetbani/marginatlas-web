"use client";

/**
 * src/components/kit/charts/AtlasBarChart.tsx
 *
 * A real bar chart, built on the shadcn chart primitive and recharts, wearing
 * this site's locked skin.
 *
 * WHY THIS FILE EXISTS, stated plainly because the reason is a mistake.
 * The founder bought a shadcnblocks licence and it is wired up: components.json
 * registers the `@shadcnblocks` registry with a bearer token, and the key is in
 * the environment. It had NEVER been used, not once, anywhere in src. The
 * shadcn chart component was not installed and recharts was not even a
 * dependency, while twelve chart primitives sat hand-rolled out of divs and
 * inline SVG in the spine kit. FORM-CATALOG has named shadcn/ui, shadcnblocks
 * and Recharts as sanctioned sources since 2026-06-16. Nobody read that as
 * permission to install them.
 *
 * WHAT IS TAKEN FROM SHADCN AND WHAT IS NOT. Rule 0 and the FORM-CATALOG are
 * explicit: "take only chart legibility, direct labels, axis units, one-line
 * legends, no decoration over data, never their aesthetics."
 *
 *   TAKEN   axis handling, tick formatting, the tooltip's positioning and
 *           keyboard/accessibility layer, responsive sizing, the config-driven
 *           colour plumbing. All the fiddly correctness nobody should rewrite.
 *   NOT TAKEN  the default palette, the rounded candy bars, the legend chrome,
 *           the card furniture, the "Trending up 5.2%" footer pattern.
 *
 * THE RULES THIS CHART OBEYS, each one a local ruling rather than a default:
 *   - Bars START AT ZERO. The only chart rule with zero dissent across four
 *     sources, and recharts will happily not do it if you let it.
 *   - ONE ACCENT. Terracotta marks the answer bar and nothing else; every other
 *     bar is the cool neutral ramp. A second live hue is a structural defect.
 *   - DIRECT LABELS, no legend. Five sources agree, and it removes a
 *     colour-matching step a colourblind reader cannot perform.
 *   - NO GLUED SENTENCE. The finding lives on the visual: the answer bar is
 *     marked. A chart that needs a sentence is wrong, not under-captioned.
 *   - TABULAR FIGURES on every value.
 *   - `radius` is 2, not shadcn's 8. Rounded bars are decoration over data and
 *     they make short bars read as taller than they are.
 *
 * IT IS A CLIENT COMPONENT, and that has a consequence worth writing down:
 * recharts measures the DOM, so this renders EMPTY in the server-render
 * screenshot harness this project uses. Verifying it needs a real hydrated
 * page, not the static fixture. That is a limitation of the instrument, not of
 * the chart.
 */
import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface AtlasBar {
  /** The category, as a reader would say it: "Jan", "Rent", "London". */
  label: string;
  value: number | null;
}

export interface AtlasBarChartProps {
  bars: AtlasBar[] | null;
  /** Which label is THE answer. It alone gets terracotta. */
  answer?: string;
  /** Rendered before the value in labels and tooltips. */
  prefix?: string;
  /** Rendered after the value. */
  suffix?: string;
  /** Height in px. */
  height?: number;
  /** Show the value on top of each bar. Off for dense series like 12 months. */
  showValues?: boolean;
}

const fmt = (n: number, prefix = "", suffix = "") =>
  `${prefix}${n.toLocaleString()}${suffix}`;

export function AtlasBarChart({
  bars,
  answer,
  prefix = "",
  suffix = "",
  height = 200,
  showValues = false,
}: AtlasBarChartProps) {
  /* SELF-OMISSION, not an empty frame. A chart drawn around values that never
     arrived is one of the named shapes of the defect this project is removing. */
  const held = (bars ?? []).filter((b) => b.value != null) as Array<{ label: string; value: number }>;
  if (held.length === 0) return null;

  const config: ChartConfig = {
    value: { label: "Value", color: "var(--chart-1)" },
  };

  return (
    <ChartContainer config={config} style={{ height }} className="w-full">
      <BarChart accessibilityLayer data={held} margin={{ top: showValues ? 18 : 6, right: 4, left: 4, bottom: 0 }}>
        {/* Horizontal rules only. Vertical gridlines add ink without adding a
            reading, and this site's whole visual language is hairlines. */}
        <CartesianGrid vertical={false} stroke="var(--chart-5)" strokeOpacity={0.5} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11, fill: "var(--chart-3)" }}
        />
        {/* DOMAIN PINNED TO ZERO. recharts will otherwise pick a floor that
            makes a 4% difference look like a doubling. */}
        <YAxis hide domain={[0, "dataMax"]} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel={false}
              formatter={(v) => fmt(Number(v), prefix, suffix)}
            />
          }
        />
        <Bar dataKey="value" radius={2} isAnimationActive={false}>
          {/* ONE ACCENT. The answer bar is terracotta; everything else is the
              neutral ramp. Never a gradient, never a per-bar hue.

              <Cell>, NOT a nested <Bar>. The first draft of this file nested a
              second Bar per row, which TYPECHECKS FINE because recharts types
              its children loosely, and would have drawn a second full series on
              top of the first. Per-datum styling in recharts is Cell. */}
          {held.map((b) => (
            <Cell
              key={b.label}
              fill={b.label === answer ? "var(--chart-1)" : "var(--chart-4)"}
            />
          ))}
          {showValues ? (
            <LabelList
              dataKey="value"
              position="top"
              offset={6}
              className="fill-[var(--chart-2)] tabular-nums"
              fontSize={11}
              formatter={(v: number) => fmt(v, prefix, suffix)}
            />
          ) : null}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export default AtlasBarChart;
