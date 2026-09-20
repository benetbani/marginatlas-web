/**
 * PayBars , THE PAY-BARS ARCHETYPE (what staff cost). Two horizontal bars,
 * "Minimum salary" and "Average salary", on ONE track whose right edge is the
 * WORLD'S HIGHEST average salary. The founder's rulings of 2026-09-04: (13)
 * "what staff costs should have its edge on the level of the highest level of
 * the world for that metric, so if Switzerland has the highest then only it
 * touches the right side"; (14) "typical pay should always be at least 10%
 * ahead of the wage floor, replace words with minimum salary and average
 * salary". The builder decides withholding; this draws.
 *
 * THE EDGE IS NO LONGER NAMED (his words, 2026-09-07): "you point the thing
 * which says the world's highest, which is Switzerland. That's very bad. You
 * should never put the limit out there." Keep the track, drop the label: the
 * bar still ends at the world maximum (ruling 13 stands, unrelated to this),
 * and the country holding it is never printed.
 *
 * THE PLACEMENT LINE IS WHAT REPLACED THAT LABEL (MODEL.md PART 6, decision
 * 2, "placement instead of shouting"; PART 9 clause 5; plan step 31's sixth
 * dispatch, 2026-09-18, the work plan step 12 left owed when it stamped the
 * track `data-track="world"`). Beside each bar, at the micro rung in ink2,
 * one fixed sentence says where the figure sits among every country on file:
 * "Higher than {n} countries in ten", "Among the lowest tenth". The builder
 * (pay_rows.ts) writes it off the same sweep that finds the world's highest,
 * through the one site-wide builder (placement.ts); this component draws the
 * string it is handed and composes nothing. A row handed no sentence draws
 * none, which is the withheld pair's case and the one-figure form's. On the
 * staff-cost card this line is the whole answer to a wage floor of about 25k
 * reading as small: the bar is short because the world's top is far away,
 * and the line says plainly that this floor sits above most of the world.
 *
 * THE GEOMETRY IS PART 5's ROW: `[minmax(0,22ch) auto 1fr]`, the label, then
 * the figure in the very next column, then a third column that absorbs every
 * pixel of leftover width, holding the track with the placement line under
 * it. The track's parent is that third column, and that column is the bar's
 * own, so the PLACEMENT check in check_model_laws.mjs (which reads the
 * track's parent for a `[data-placement]`) is satisfied by the structure and
 * not by an attribute moved to where a rule happens to look. The figure used
 * to sit at the far end of the track, which put the row's label and its
 * figure a track's length apart, the fault PART 5's geometry exists to end.
 * ONE GRID FOR BOTH ROWS, so the figure column is sized once by the wider
 * figure and both tracks share one left edge and one length; two rows each
 * carrying the template would size the `auto` column to their own figure and
 * start the two tracks at different points, which on a shared scale is a
 * drawing that lies (RankedBars.tsx's task 13 alignment fault).
 * UNDER 420px OF CARD the row is `[1fr auto]` (PART 5's own phone clause),
 * and the third column's content drops under the pair, spanning both
 * columns: the track at the card's full inner width, the line under it. A
 * CONTAINER QUERY decides, not the viewport (KvGrid's and NoteList's idiom),
 * because the same card is 520 wide in a 1-1 band at 1280 and 344 wide in
 * the same band at 768; the threshold is 380 of the component's own width,
 * which is a 420 card less the card's 20px of padding a side.
 *
 * THE LAW INSIDE IT:
 *  - One scale for both bars, the world's highest average, so a country's
 *    minimum never draws longer than its average and only the world's
 *    highest touches the edge. A fill is clamped to the track.
 *  - The average carries the accent; the minimum the lighter tone.
 *  - A placement line beside every drawn bar, and none where no bar is
 *    drawn.
 *  - A pair the builder withholds (the average under 110 percent of the
 *    minimum) draws no bar: one line says why, and the figures stay unsaid
 *    rather than drawn as a lie. A single figure draws as a figure, no track.
 *  - No figures, nothing drawn.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type PayRow = {
  key: "minimum" | "average";
  label: string;
  value: number;
  /** The placement sentence for this figure, from the builder; null or absent draws no line. */
  placement?: string | null;
  /** THE ON-COST ON THE BAR (his plan for section 9, 2026-09-20, uncorrected): what
   *  the employer adds on top of this pay, as a percent of it, drawn as a darker
   *  piece added to the bar's end so the on-cost is seen as extra length, with
   *  its words under the track; null or absent draws nothing. The piece is
   *  clipped at the track's end, and the words say the figure regardless. */
  extra?: { pct: number; label: string } | null;
};
export type PayBarsProps = {
  rows: PayRow[];
  worldMax: { value: number; name: string } | null;
  withheld?: string | null;
  fmt: (v: number) => string;
};

/* The container-query classes are written out in full below, never assembled from a constant: the stylesheet compiler scans source for literal class strings and generates nothing for a template. */

export function PayBars({ rows, worldMax, withheld, fmt }: PayBarsProps) {
  const live = rows.filter((r) => Number.isFinite(r.value) && r.value > 0);
  if (withheld) {
    return (
      <div data-archetype="pay-bars" data-withheld="1">
        <p className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{withheld}</p>
      </div>
    );
  }
  if (live.length === 0) return null;
  if (live.length === 1 || !worldMax || !(worldMax.value > 0)) {
    return (
      <div data-archetype="pay-bars" data-bars="0" className="flex flex-wrap gap-x-6 gap-y-1.5">
        {live.map((r) => (
          <span key={r.key} data-pay={r.key} className="flex items-baseline gap-1.5">
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{fmt(r.value)}</Fig>
            <span data-label className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.label}</span>
          </span>
        ))}
      </div>
    );
  }
  const max = worldMax.value;
  return (
    <div data-archetype="pay-bars" data-bars={String(live.length)} data-idea="I2" className="[container-type:inline-size]">
      <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 [@container(min-width:380px)]:grid-cols-[minmax(0,22ch)_auto_1fr]">
        {live.map((r) => {
          const share = Math.max(0, Math.min(1, r.value / max));
          const accent = r.key === "average";
          return (
            <React.Fragment key={r.key}>
              <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.label}</span>
              <Fig className={`text-right text-[length:var(--t-body)] font-semibold ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{fmt(r.value)}</Fig>
              {/* THE THIRD COLUMN, the bar's own: the track and the line under it.
                  The slot rung (8) closes each row; the last row leaves the
                  card's own padding to do it. */}
              <span data-pay-col={r.key} className="col-span-2 block pb-2 last:pb-0 [@container(min-width:380px)]:col-span-1">
                {/* THE TRACK DECLARES WHAT ITS FAR END IS (plan step 12, 2026-09-17):
                    the world's highest average on file (`worldMaxAverage()`), so
                    `data-track="world"`, truthfully, and PART 6's placement line
                    sits under it in the same column. */}
                <span data-track="world" className="relative mt-1 block h-3 overflow-hidden rounded-full bg-[var(--c-soft)]" role="img" aria-label={`${r.label} ${fmt(r.value)} a year, against the world's highest ${fmt(max)}`}>
                  <span data-bar={r.key} aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(share * 100).toFixed(1)}%`, background: accent ? "var(--terra)" : "var(--terra-border)" }} />
                  {r.extra && r.extra.pct > 0 ? <span data-extra={r.key} aria-hidden className="absolute inset-y-0" style={{ left: `${(share * 100).toFixed(1)}%`, width: `${Math.min(100 - share * 100, share * r.extra.pct).toFixed(1)}%`, background: "var(--terra-text)" }} /> : null}
                </span>
                {r.placement || r.extra ? (
                  <span data-placement className="mt-1.5 block text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">
                    {r.placement ?? ""}
                    {r.extra ? <>{r.placement ? " " : ""}<span data-extra-label className="text-[var(--c-ink)]">{r.extra.label}</span></> : null}
                  </span>
                ) : null}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
