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
  /** One figure under a hairline (foreign-owned firms, born abroad). */
  foot?: { value: string; label: string } | null;
};

const DOT = 11; // px, the dot's diameter; the track keeps half of it clear at each end

export function SpectraTable({ rows, dot = "ink", foot }: SpectraTableProps) {
  const live = rows.filter((r) => Number.isFinite(r.position));
  if (live.length < 2) return null;
  const dotBg = dot === "terra" ? "var(--terra)" : "var(--c-ink)";
  return (
    <div data-archetype="spectra-table" data-idea="I1" data-dot={dot} data-rows={String(live.length)}>
      <div className="grid auto-rows-fr divide-y divide-[var(--c-border)]">
        {live.map((r) => {
          const pos = Math.max(0, Math.min(1, r.position));
          const pct = Math.round(pos * 1000) / 10;
          const lean = pct < 50 ? r.left : pct > 50 ? r.right : null;
          return (
            <div key={r.key} data-spectrum-row={r.key} className="py-2.5">
              <div className="truncate text-[length:var(--t-micro)] font-medium leading-tight text-[var(--c-ink)]">{r.name}</div>
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
              <div className="mt-1 flex justify-between gap-3 text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">
                <span data-pole="left">{r.left}</span>
                <span data-pole="right" className="text-right">{r.right}</span>
              </div>
            </div>
          );
        })}
      </div>
      {foot ? (
        <div data-foot className="flex flex-wrap items-baseline gap-x-1.5 border-t border-[var(--c-border)] pt-3">
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{foot.value}</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{foot.label}</span>
        </div>
      ) : null}
    </div>
  );
}
