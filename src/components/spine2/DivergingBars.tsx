/**
 * DivergingBars , how far each row sits from the average, either side of centre.
 *
 * RATIFIED 2026-08-09 after two rounds of his corrections. Both rounds are
 * recorded because the second one caught five separate mistakes of mine.
 *
 * ROUND ONE, replacing my option C: "you should put the average on the center,
 * and then from the average say how far you'd lie on the right side ... and on
 * the left side, minus that. That's the actual difference."
 *
 * ROUND TWO, on the drawing itself, and every point was right:
 *
 *   1. "the bars should be in light gray. You have made them in dark gray,
 *       which is very wrong." , THE NEUTRAL RAMP RUNS DARK TO LIGHT, --n1
 *      darkest through --n5 lightest, and I had it backwards: --n1 on the TRACK
 *      and --n4 on the negative fill. Track is now --n5 and the negative fill
 *      is --n1, which is what he asked for and the opposite of what I shipped.
 *
 *   2. "you have pushed the at least forty three percent to the absolute
 *       maximum, which is not true." , the scale was normalised to the largest
 *      deviation in the set, so the biggest row always filled its half whatever
 *      it actually was. A 43% difference drawn as a full bar is a lie about the
 *      size of the difference.
 *
 *   3. "if the terracotta goes to the absolute limit of the bar, it means that
 *       it should be one hundred percent plus. The limit is never reached
 *       almost." , THE SCALE IS ABSOLUTE. Half the track is 100%. A +43% row
 *      fills 43% of its half and no more. Reaching the end means doubling the
 *      average, which is the point: the end has a meaning now.
 *
 *   4. "the length of the bar should be proportional to their percentage."
 *      Follows from 3, and is why no normalisation is left anywhere.
 *
 *   5. "the percentage points should be inside the bar, not written on the
 *       other side." , the figure sits in the bar it belongs to.
 *
 *   And the ends are named for a reader rather than for me: cheap on the left,
 *   average at the centre, expensive on the right.
 *
 * SO THE COLOUR RULE, in his words: "The background is in light gray. The
 * negative part is in dark gray, and the positive part is in terracotta."
 * One fill per row, never three colours in a row.
 *
 * WHY IT BEATS THE TRAFFIC LIGHT IT REPLACES: green/amber/red asserts a verdict
 * and hides the reasoning, and nothing ever said why 66 was bad and 65 was not.
 * A distance from the average states the difference and lets the reader judge.
 *
 * BOUNDS STAY MARKED. A row whose underlying value sits on a model clip is a
 * floor, not a reading, so it renders "at least". Three London districts sit on
 * the 3.0 ceiling and reading them as a genuine tie is the defect the 2026-08-08
 * clamp work fixed; this must not reintroduce it.
 */

export type DivergingRow = {
  label: string;
  /** The raw quantity. The average and every deviation are derived from these. */
  value: number;
  /** True when `value` sits on a model bound, so it is a floor not a reading. */
  clipped?: boolean;
};

/** Half the track equals this much deviation. Reaching the end means doubling. */
const FULL_SCALE_PCT = 100;

/** Rows, dearest first, each carrying its signed percentage from the mean. */
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
  cheapLabel = "cheap",
  averageLabel = "average",
  expensiveLabel = "expensive",
  labelWidth = 132,
}: {
  rows: DivergingRow[];
  cheapLabel?: string;
  averageLabel?: string;
  expensiveLabel?: string;
  labelWidth?: number;
}) {
  const data = toDeviations(rows);
  if (data.length === 0) return null;

  return (
    <div style={{ maxWidth: "60%" }}>
      {/* The three words that make the drawing readable without a caption. */}
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <span style={{ width: labelWidth, flex: "none" }} />
        <span style={{ flex: 1, position: "relative", fontSize: 11.5, color: "var(--muted)", height: 16 }}>
          <span style={{ position: "absolute", left: 0 }}>{cheapLabel}</span>
          <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>{averageLabel}</span>
          <span style={{ position: "absolute", right: 0 }}>{expensiveLabel}</span>
        </span>
      </div>

      {data.map((d) => {
        const positive = d.pct >= 0;
        /* ABSOLUTE, not normalised. Half the track is FULL_SCALE_PCT, so a bar's
           length is its own percentage and nothing else. Clamped only so a row
           past the full scale cannot overrun the track. */
        const halfPct = (Math.min(Math.abs(d.pct), FULL_SCALE_PCT) / FULL_SCALE_PCT) * 50;
        const text = `${d.clipped ? "at least " : ""}${positive ? "+" : ""}${d.pct}%`;
        return (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span
              style={{
                width: labelWidth, flex: "none", fontSize: 12.5, textAlign: "right",
                color: "var(--ink)",
              }}
            >
              {d.label}
            </span>

            {/* Background: the LIGHTEST neutral. */}
            <span style={{ flex: 1, height: 24, background: "var(--n5)", borderRadius: "var(--r-xs)", position: "relative" }}>
              {/* The centre: the average every bar is measured against. */}
              <span style={{ position: "absolute", left: "50%", top: -2, bottom: -2, width: 1, background: "var(--n3)" }} />
              <span
                style={{
                  position: "absolute", top: 0, bottom: 0,
                  left: positive ? "50%" : `${50 - halfPct}%`,
                  width: `${halfPct}%`,
                  /* Terracotta above the average, dark grey below it. */
                  background: positive ? "var(--terra)" : "var(--n1)",
                  borderRadius: "var(--r-xs)",
                  display: "flex", alignItems: "center",
                  justifyContent: positive ? "flex-end" : "flex-start",
                  paddingLeft: 6, paddingRight: 6,
                  overflow: "hidden",
                }}
              >
                {/* Inside its own bar. Paper on terracotta and on --n1 both
                    clear AA at this weight. */}
                <span
                  className="fig"
                  style={{
                    fontSize: 12, fontWeight: 600, color: "var(--paper)",
                    fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
