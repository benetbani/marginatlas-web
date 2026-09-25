/**
 * WorldRange, A FIGURE DRAWN ON THE WORLD'S RANGE (2026-09-25). His words that day: the numbers "you just blast them over there
 * with no relation to each other". A row here is a figure and where it stands: the country's value as a marker on a track that runs
 * from the world's lowest to its highest, the middle half of the countries shaded, the median marked and named. The value is read in
 * the row's head beside its label; the track says whether it is dear or cheap without a sentence. The bullet chart of his shadcn
 * blocks (chart-card26's band and reference line), drawn here in the page's own marks and on the server, so the page carries it in
 * its first byte and the harness reads it.
 *
 * THE LAW: the label, then the figure in the very next column (PART 5's row, never a justify-between gap); the track under them at
 * the row's full width; the world's ends under the track at the micro rung; one marker, terracotta, the only accent in the row.
 * `scale="log"` for a field whose world spans orders of magnitude (pay, prices of a service), linear otherwise.
 */
import * as React from "react";
import { Fig, Ico } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import type { WorldRange } from "@/lib/spine/world_stats";

export type WorldRangeRow = {
  key: string;
  label: string;
  /** The figure as printed, with its unit words after it. */
  display: string;
  unit?: string;
  value: number;
  /** The world's range, or null: the row then prints its figure alone, no track (a figure newer than the world's set is not placed on it). */
  range: WorldRange | null;
  /** The world's two ends and its median, as printed (the same formatter as the figure). */
  fmt: (v: number) => string;
  icon?: AtlasIconId;
  scale?: "linear" | "log";
  /** The level word among the countries, or null. */
  level?: string | null;
  /** No head: the card's own figure above is this row's value (2026-09-25). */
  headless?: boolean;
};

function pos(v: number, r: WorldRange, scale: "linear" | "log"): number {
  const lo = scale === "log" ? Math.log(r.min) : r.min;
  const hi = scale === "log" ? Math.log(r.max) : r.max;
  const x = scale === "log" ? Math.log(Math.max(v, r.min)) : v;
  if (hi <= lo) return 50;
  return Math.max(0, Math.min(100, ((x - lo) / (hi - lo)) * 100));
}

export function WorldRangeRows({ rows, medianWord, headless = false }: { rows: WorldRangeRow[]; medianWord: string; headless?: boolean }) {
  const live = rows.filter((r) => r && Number.isFinite(r.value));
  if (live.length === 0) return null;
  return (
    <div data-archetype="world-range" data-visual="1" data-form={headless || live.every((r) => r.headless) ? "under-figure" : "rows"} data-rows={String(live.length)} className="flex flex-col gap-5">
      {live.map((r) => {
        const scale = r.scale ?? "linear";
        const range = r.range;
        return (
          <div key={r.key} data-row={r.key}>
            {headless || r.headless ? null : <div className="flex items-center gap-3">
              {r.icon ? <Ico id={r.icon} tone="terra" /> : null}
              <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.label}</span>
              <span className="whitespace-nowrap">
                <Fig className="text-[length:var(--t-lead)] font-semibold text-[var(--c-ink)]">{r.display}</Fig>
                {r.unit ? <span className="ml-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.unit}</span> : null}
              </span>
              {r.level ? (
                <span data-level={r.level} className="ml-auto rounded-md border border-[var(--c-border)] bg-[var(--c-soft)] px-2 py-0.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-ink2)]">{r.level}</span>
              ) : null}
            </div>}
            {range ? <Track r={r} range={range} scale={scale} medianWord={medianWord} headless={headless || !!r.headless} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Track({ r, range, scale, medianWord, headless }: { r: WorldRangeRow; range: WorldRange; scale: "linear" | "log"; medianWord: string; headless: boolean }) {
  const at = pos(r.value, range, scale);
  const a = pos(range.p25, range, scale);
  const b = pos(range.p75, range, scale);
  const m = pos(range.median, range, scale);
  return (
          <>
            <div className={`relative ${headless ? "mt-1" : "mt-3"} h-3`} role="img" aria-label={`${r.label}: ${r.display}${r.unit ? ` ${r.unit}` : ""}; the world's median ${r.fmt(range.median)}, from ${r.fmt(range.min)} to ${r.fmt(range.max)}`}>
              <span aria-hidden className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--c-soft2)]" />
              <span aria-hidden data-track-band className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--c-border)]" style={{ left: `${a}%`, width: `${Math.max(1, b - a)}%` }} />
              <span aria-hidden data-track-median className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--c-ink2)]" style={{ left: `calc(${m}% - 1px)` }} />
              <span aria-hidden data-mark="value" className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)] shadow-sm" style={{ left: `${at}%`, background: "var(--terra)" }} />
            </div>
            <div className="relative mt-1.5 h-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">
              <span className="absolute left-0">{r.fmt(range.min)}</span>
              <span className="absolute right-0">{r.fmt(range.max)}</span>
            </div>
            {/* THE MEDIAN ON ITS OWN LINE, under its tick, pulled left by its own share of the way along (so at either end it
                aligns inward): measured at 375, on the ends' line it ran into the lowest figure. */}
            <div className="relative h-4 text-[length:var(--t-micro)] text-[var(--c-ink2)]">
              <span data-mark-label className="absolute whitespace-nowrap" style={{ left: `${m}%`, transform: `translateX(-${m}%)` }}>{medianWord} {r.fmt(range.median)}</span>
            </div>
          </>
  );
}
