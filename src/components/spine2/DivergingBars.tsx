/**
 * DivergingBars , how far each row sits from the average, either side of centre.
 *
 * RATIFIED BY THE FOUNDER, 2026-08-09, correcting option C of
 * /dev/options/scale. His words:
 *
 *   "you should put the average on the center, and then from the average you
 *    should just say, like, how far you'd lie on the right side, for example,
 *    plus fifty percent, eighty percent, whatever. And on the left side, minus
 *    that. So it should be a chart of how different each neighborhood is to the
 *    average. That's the actual difference."
 *
 *   "the more expensive side should be on terracotta, and the cheaper side
 *    should be on that sort of medium gray. So one row can only have two
 *    colours. The row should be on that light gray, but the part where the
 *    outline is should be either terracotta positive, either the medium grey
 *    negative."
 *
 * So: light track, one fill per row, terracotta right, neutral left. Two
 * colours in a row and never three. It replaces the traffic light on the score
 * gauges, which used green / amber / red and is banned by the palette rule.
 *
 * WHY IT BEATS WHAT IT REPLACES, and this is the founder's point restated: a
 * colour band asserts a verdict and hides the reasoning. Nothing on the page
 * ever said why 66 is bad and 65 is not. A distance from the average states the
 * actual difference and lets the reader judge it.
 *
 * THE CENTRE IS THE AVERAGE OF THE ROWS SHOWN, NOT AN EXTERNAL BASELINE, and
 * that was measured rather than assumed. Centring on the city rate produces a
 * one-sided chart: every London district is above it (7 of 7), as is every
 * district in Paris and Tokyo, because 13 of the 14 rent tags push above 1.0.
 * Against the average of the set, London splits 3 right and 4 left, which is
 * the drawing he described.
 *
 * BOUNDS STAY MARKED. A row whose underlying value sat on the model's clip is
 * a floor, not a reading, so it renders "at least". Three London districts sit
 * on the 3.0 ceiling and reading them as a genuine tie is the defect the
 * 2026-08-08 clamp work fixed; this must not reintroduce it.
 */

export type DivergingRow = {
  label: string;
  /** The raw quantity. The average and every deviation are derived from these. */
  value: number;
  /** True when `value` sits on a model bound, so it is a floor not a reading. */
  clipped?: boolean;
};

/** Rows, sorted dearest first, each carrying its signed distance from the mean. */
export function toDeviations(rows: DivergingRow[]): Array<DivergingRow & { pct: number }> {
  if (rows.length === 0) return [];
  const mean = rows.reduce((s, r) => s + r.value, 0) / rows.length;
  if (mean === 0) return rows.map((r) => ({ ...r, pct: 0 }));
  return rows
    .map((r) => ({ ...r, pct: Math.round((r.value / mean - 1) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

export function DivergingBars({
  rows,
  dearerLabel = "dearer than average",
  cheaperLabel = "cheaper than average",
  labelWidth = 132,
}: {
  rows: DivergingRow[];
  dearerLabel?: string;
  cheaperLabel?: string;
  labelWidth?: number;
}) {
  const data = toDeviations(rows);
  if (data.length === 0) return null;

  /* Symmetric scale so the centre is genuinely the middle and a +40 bar and a
     -40 bar are the same length. Scaling each side independently would make
     the drawing lie about which deviation is larger. */
  const max = Math.max(...data.map((d) => Math.abs(d.pct)), 1);

  return (
    <div style={{ maxWidth: "60%" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <span style={{ width: labelWidth, flex: "none" }} />
        <span style={{ flex: 1, display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)" }}>
          <span>{cheaperLabel}</span>
          <span>{dearerLabel}</span>
        </span>
      </div>

      {data.map((d) => {
        const positive = d.pct >= 0;
        /* Half the track each side of centre; the bar grows out from 50%. */
        const halfPct = (Math.abs(d.pct) / max) * 50;
        return (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 7 }}>
            <span
              style={{
                width: labelWidth, flex: "none", fontSize: 12.5, textAlign: "right",
                color: "var(--ink)",
              }}
            >
              {d.label}
            </span>

            <span style={{ flex: 1, height: 24, background: "var(--n1)", borderRadius: 2, position: "relative" }}>
              {/* The centre: the average itself, drawn as a hairline so it reads
                  as the thing every bar is measured against. */}
              <span style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 1, background: "var(--n4)" }} />
              <span
                style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: positive ? "50%" : `${50 - halfPct}%`,
                  width: `${halfPct}%`,
                  background: positive ? "var(--terra)" : "var(--n4)",
                  borderRadius: 2,
                }}
              />
              {/* The figure sits just outside its own bar, so it never fights
                  the fill for contrast and never needs a second colour. */}
              <span
                className="fig"
                style={{
                  position: "absolute", top: "50%", transform: "translateY(-50%)",
                  [positive ? "left" : "right"]: `calc(${50 + halfPct}% + 7px)`,
                  fontSize: 12, fontWeight: 600, color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
                } as React.CSSProperties}
              >
                {d.clipped ? "at least " : ""}
                {positive ? "+" : ""}
                {d.pct}%
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
