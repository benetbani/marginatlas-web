/**
 * src/components/spine2/RankBarsV2.tsx
 *
 * The spine2 ranked bar list (BATCH-B "ranked", cell ch09), modeled on the
 * ranked spec as a NEW component. The old kit's RankBars (spine/kit-index.tsx)
 * is untouched; its Tailwind-token styling and leader-accent semantics belong
 * to the old system, while this renders the frozen `.ranked` markup.
 *
 * Rows are INDEPENDENT magnitudes (not one shrinking quantity), sorted
 * descending, plus:
 * - an optional range row: [lo, hi] drawn as a left-offset gradient bar
 *   (.rb.wide, the A10-scoped neutral n5 to n2 gradient; min-width 2px floor
 *   per B7 lives in the stylesheet);
 * - an optional total footer ON THE SHARED SCALE. The scale max derives from
 *   max(value | range hi) across rows and the total bar draws against THAT
 *   scale, never its own.
 *
 * Derived marks (M5): terracotta is the total bar only (the answer). Range
 * rows stay neutral gradient. No accent flag is ever accepted from data.
 *
 * Self-omit (M9): a row with neither a finite value nor a valid range omits.
 * THE TOTAL RENDERS ONLY WHEN EVERY ROW SURVIVES: a total over a partial list
 * is a lie, so any omitted row degrades the footer away. Fewer than 2
 * surviving rows omits the component.
 */
import * as React from "react";

export interface RankRowV2 {
  id: string;
  label: string;
  /** Point magnitude. Give either value or range, not both. */
  value?: number | null;
  /** [lo, hi] range magnitude, drawn as the offset gradient bar. */
  range?: [number, number] | null;
  /** The printed figure ("$16K", "90 to 340K"). */
  display: string;
}

export interface RankBarsV2Props {
  rows: RankRowV2[];
  /** Footer on the shared scale; renders only when every row is present. */
  total?: { label: string; value: number | null | undefined; display: string };
  /** Sort descending by magnitude (range hi counts). Default true. */
  sort?: boolean;
}

type LiveRow = RankRowV2 & { magnitude: number };

export function RankBarsV2({ rows, total, sort = true }: RankBarsV2Props) {
  const input = rows ?? [];
  const live: LiveRow[] = [];
  for (const r of input) {
    if (hasRange(r)) live.push({ ...r, magnitude: r.range![1] });
    else if (r.value != null && Number.isFinite(r.value)) live.push({ ...r, magnitude: r.value });
  }
  if (live.length < 2) return null;

  const ordered = sort ? [...live].sort((a, b) => b.magnitude - a.magnitude) : live;
  const max = Math.max(...live.map((r) => r.magnitude));
  if (!(max > 0)) return null;
  const w = (v: number) => `${((v / max) * 100).toFixed(2)}%`;

  /* The total is honest only over the complete list. */
  const complete = live.length === input.length;
  const showTotal =
    complete && total != null && total.value != null && Number.isFinite(total.value);

  return (
    <div className="ranked">
      {ordered.map((r) =>
        hasRange(r) ? (
          <div key={r.id} className="rb wide">
            <span className="nm">{r.label}</span>
            <span className="bar">
              <i
                style={{
                  left: w(r.range![0]),
                  width: `${(((r.range![1] - r.range![0]) / max) * 100).toFixed(2)}%`,
                }}
              />
            </span>
            <span className="v">{r.display}</span>
          </div>
        ) : (
          <div key={r.id} className="rb">
            <span className="nm">{r.label}</span>
            <span className="bar">
              <i style={{ width: w(r.magnitude) }} />
            </span>
            <span className="v">{r.display}</span>
          </div>
        ),
      )}
      {showTotal ? (
        <div className="tot">
          <span className="nm">{total.label}</span>
          <span className="bar">
            <i style={{ width: w(total.value as number) }} />
          </span>
          <span className="v">{total.display}</span>
        </div>
      ) : null}
    </div>
  );
}

function hasRange(r: RankRowV2): boolean {
  return (
    r.range != null &&
    Number.isFinite(r.range[0]) &&
    Number.isFinite(r.range[1]) &&
    r.range[1] > r.range[0] &&
    r.range[0] >= 0
  );
}
