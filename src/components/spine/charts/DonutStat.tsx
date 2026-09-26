/**
 * DonutStat, A WHOLE AS A RING WITH ITS FIGURE IN THE MIDDLE (2026-09-25; his shadcn blocks' chart-card5, "a donut chart card with
 * centre stat display and a legend list", drawn on the server). The largest part in the accent, the next in its tint, the rest in
 * the neutrals; the legend beside the ring lists every part with its share, so the ring is read and then checked. Five parts at most
 * (his B9: "max 1 per page", and the pie's five-slice cap).
 */
import * as React from "react";
import { Marks } from "@/components/spine/interact/Marks";
import { Fig } from "@/components/spine/kit";
import { partTones } from "@/components/spine/charts/part_tones";

export type DonutSlice = { key: string; name: string; share: number };

/* The parts' tones are the shared ramp (part_tones.ts, 2026-09-26): the neutrals step dark to light by how many there are. */

export function DonutStat({ parts, center, centerWords, aria }: { parts: DonutSlice[]; center: string; centerWords: string; aria: string }) {
  const live = parts.filter((p) => p && Number.isFinite(p.share) && p.share > 0).sort((a, b) => b.share - a.share).slice(0, 5);
  if (live.length < 2) return null;
  const total = live.reduce((s, p) => s + p.share, 0);
  const tones = partTones(live.length);
  const R = 62, C = 2 * Math.PI * R, GAP = 3;
  let acc = 0;
  return (
    <div className="[container-type:inline-size]">
    {/* A WEDGE AND ITS ROW ARE ONE PART (goal 2026-09-26, M2; his donut of 2026-07-05: "hover highlights the segment"). */}
    <Marks label={aria} data-archetype="donut-stat" data-visual="1" className="flex items-center gap-5 [@container(min-width:420px)]:gap-8">
      <div className="relative h-32 w-32 shrink-0 [@container(min-width:420px)]:h-40 [@container(min-width:420px)]:w-40">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={aria}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--c-soft2)" strokeWidth="18" />
          {live.map((p, i) => {
            const len = Math.max(0, (p.share / total) * C - GAP);
            const el = <circle key={p.key} data-wedge={p.key} data-part-key={p.key} data-readout-figure={`${Math.round(p.share)}%`} data-readout-words={p.name} cx="80" cy="80" r={R} fill="none" stroke={tones[i].c} strokeOpacity={tones[i].o} strokeWidth="18" strokeLinecap="butt" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />;
            acc += (p.share / total) * C;
            return el;
          })}
        </svg>
        <div data-mark-label className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <Fig className="text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]">{center}</Fig>
          <span className="mt-1 max-w-[12ch] text-[length:var(--t-micro)] leading-tight text-[var(--c-muted)]">{centerWords}</span>
        </div>
      </div>
      <ul className="m-0 min-w-0 flex-1 list-none divide-y divide-[var(--c-border)] p-0">
        {live.map((p, i) => (
          <li key={p.key} data-row={p.key} data-part-key={p.key} className="grid max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-3 py-2">
            <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: tones[i].c, opacity: tones[i].o }} />
            <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{p.name}</span>
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{Math.round(p.share)}%</Fig>
          </li>
        ))}
      </ul>
    </Marks>
    </div>
  );
}
