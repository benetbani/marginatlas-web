/**
 * DonutStat, A WHOLE AS A RING WITH ITS FIGURE IN THE MIDDLE (2026-09-25; his shadcn blocks' chart-card5, "a donut chart card with
 * centre stat display and a legend list", drawn on the server). The largest part in the accent, the next in its tint, the rest in
 * the neutrals; the legend beside the ring lists every part with its share, so the ring is read and then checked. Five parts at most
 * (his B9: "max 1 per page", and the pie's five-slice cap).
 */
import * as React from "react";
import { Fig } from "@/components/spine/kit";

export type DonutSlice = { key: string; name: string; share: number };

/* THE NEUTRALS STEP FROM DARK TO LIGHT BY HOW MANY THERE ARE (2026-09-26, the United Kingdom's payments ring). The third and fourth
   fills were ink2 and muted, about four points of lightness apart: cash and digital wallet read as one grey, on the ring and on the
   legend. Now one neutral is ink2; two are ink2 and line-strong, the ends of the ramp; three put ink2 at half strength between them. */
type Tone = { c: string; o?: number };
const LEADS: Tone[] = [{ c: "var(--terra)" }, { c: "var(--terra-border)" }];
const NEUTRALS: Tone[][] = [[], [{ c: "var(--c-ink2)" }], [{ c: "var(--c-ink2)" }, { c: "var(--c-line-strong)" }], [{ c: "var(--c-ink2)" }, { c: "var(--c-ink2)", o: 0.45 }, { c: "var(--c-line-strong)" }]];
const tonesFor = (n: number): Tone[] => [...LEADS, ...NEUTRALS[Math.max(0, n - LEADS.length)]].slice(0, n);

export function DonutStat({ parts, center, centerWords, aria }: { parts: DonutSlice[]; center: string; centerWords: string; aria: string }) {
  const live = parts.filter((p) => p && Number.isFinite(p.share) && p.share > 0).sort((a, b) => b.share - a.share).slice(0, 5);
  if (live.length < 2) return null;
  const total = live.reduce((s, p) => s + p.share, 0);
  const tones = tonesFor(live.length);
  const R = 62, C = 2 * Math.PI * R, GAP = 3;
  let acc = 0;
  return (
    <div className="[container-type:inline-size]">
    <div data-archetype="donut-stat" data-visual="1" className="flex items-center gap-5 [@container(min-width:420px)]:gap-8">
      <div className="relative h-32 w-32 shrink-0 [@container(min-width:420px)]:h-40 [@container(min-width:420px)]:w-40">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" role="img" aria-label={aria}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--c-soft2)" strokeWidth="18" />
          {live.map((p, i) => {
            const len = Math.max(0, (p.share / total) * C - GAP);
            const el = <circle key={p.key} data-wedge={p.key} cx="80" cy="80" r={R} fill="none" stroke={tones[i].c} strokeOpacity={tones[i].o} strokeWidth="18" strokeLinecap="butt" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-acc} />;
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
          <li key={p.key} data-row={p.key} className="grid max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-3 py-2">
            <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: tones[i].c, opacity: tones[i].o }} />
            <span data-label className="text-[length:var(--t-body)] text-[var(--c-ink)]">{p.name}</span>
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{Math.round(p.share)}%</Fig>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
