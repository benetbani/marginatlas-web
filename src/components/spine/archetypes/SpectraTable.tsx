/**
 * SpectraTable , THE SPECTRA-TABLE ARCHETYPE (the character of a place). The
 * founder's personal keep since 2026-06-18: six named traits, each a track
 * between two explanatory poles with the worse end for a business on the left
 * and the better on the right, a dot placed by the read; ink dots when the
 * table is about the state, terracotta when it is about people ("that's the
 * feeling", 2026-08-30); a foot figure under the table. The loop photographed
 * the kept build on 2026-09-03 and found his six orders in it; this component
 * draws the same picture with the law inside instead of beside it.
 *
 * THE LAW INSIDE IT:
 *  - Every row is one height by construction: a grid with equal rows, each
 *    row the name on one line, the track, the two poles on one line. A pole
 *    that wraps is a copy fault the harness reports, not a taller row.
 *  - The dot is placed by its value on the whole track and stays inside it at
 *    0 and at 1: the track keeps a dot's radius clear at each end, so nothing
 *    is clamped and a read of ten sits at the end, not at 95.
 *  - The midpoint tick marks the cut the poles name; the dot's colour is the
 *    table's, one colour per table, declared once on the set (I1).
 *  - The accessible name says what the drawing says: leans left pole, leans
 *    right pole, or in the middle.
 *  - Fewer than two rows is not a table and draws nothing.
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type SpectraRow = { key: string; name: string; left: string; right: string; position: number };
export type SpectraTableProps = {
  rows: SpectraRow[];
  dot?: "ink" | "terra";
  /** THE FOUNDER'S RECORDED CORRECTION (2026-07-11, rule 34, on the city's quick reads: "text too small"). The named form sets the trait name and the pole words at micro in muted grey; on the quick reads he rejected exactly that, and the card has read at body size since. `scale="body"` lifts the name and the poles a rung and takes the poles to ink2. It defaults to micro so the character tables render what he kept on 2026-08-30. The build loop's run 16 moved it from the kit's table into this archetype, so the correction is a construction the caller chooses once, not a default a caller can undo by forgetting. */
  scale?: "micro" | "body";
  /** One figure under a hairline (foreign-owned firms, born abroad). */
  foot?: { value: string; label: string } | null;
};

const DOT = 11; // px, the dot's diameter; the track keeps half of it clear at each end

export function SpectraTable({ rows, dot = "ink", foot, scale = "micro" }: SpectraTableProps) {
  const live = rows.filter((r) => Number.isFinite(r.position));
  if (live.length < 2) return null;
  const dotBg = dot === "terra" ? "var(--terra)" : "var(--c-ink)";
  return (
    <div data-archetype="spectra-table" data-idea="I1" data-dot={dot} data-scale={scale} data-rows={String(live.length)}>
      <div className="grid auto-rows-fr divide-y divide-[var(--c-border)]">
        {live.map((r) => {
          const pos = Math.max(0, Math.min(1, r.position));
          const pct = Math.round(pos * 1000) / 10;
          const lean = pct < 50 ? r.left : pct > 50 ? r.right : null;
          return (
            <div key={r.key} data-spectrum-row={r.key} className="py-2.5">
              <div data-label className={scale === "body" ? "truncate text-[length:var(--t-body)] font-medium leading-tight text-[var(--c-ink)]" : "truncate text-[length:var(--t-micro)] font-medium leading-tight text-[var(--c-ink)]"}>{r.name}</div>
              <div
                data-track
                role="img"
                aria-label={`${r.name}: ${r.left} to ${r.right}: ${lean ? `leans ${lean}` : "in the middle"}`}
                className="relative mt-1.5 block h-[6px] rounded-full bg-[var(--c-soft2)]"
              >
                <span aria-hidden className="absolute -bottom-[3px] -top-[3px] left-1/2 w-px bg-[var(--c-border)]" />
                {/* THE DOT'S CENTRE runs from a radius in at the left to a radius in at the right, so a read of 0 or 1 sits inside the track and nothing is clamped. */}
                <span
                  data-dot
                  aria-hidden
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)]"
                  style={{ left: `calc(${DOT / 2}px + (100% - ${DOT}px) * ${pos})`, width: DOT, height: DOT, background: dotBg, boxShadow: "0 0 0 1px var(--c-border)" }}
                />
              </div>
              <div className={scale === "body" ? "mt-1 flex justify-between gap-3 text-[length:var(--t-body)] leading-tight text-[var(--c-ink2)]" : "mt-1 flex justify-between gap-3 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]"}>
                <span data-pole="left">{r.left}</span>
                <span data-pole="right" className="text-right">{r.right}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* THE FOOT IS ONE LINE OF TEXT, NOT A FLEX ROW (run 16): photographed at 347
          wide with the quick reads' foot, a flex row wrapped the whole label under
          the figure and left a lone "1" on a line of its own; inline, the words
          wrap after the figure and the figure keeps its first words beside it. */}
      {foot ? (
        <div data-foot className="border-t border-[var(--c-border)] pt-3 leading-snug">
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{foot.value}</Fig>{" "}
          <span className={scale === "body" ? "text-[length:var(--t-body)] text-[var(--c-ink2)]" : "text-[length:var(--t-micro)] text-[var(--c-muted)]"}>{foot.label}</span>
        </div>
      ) : null}
    </div>
  );
}
