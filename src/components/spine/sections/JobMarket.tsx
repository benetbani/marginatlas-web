/**
 * JobMarket, THE JOB MARKET (2026-09-25; his message that night: "deeper insights in the local job market, unempl, youth unempl,
 * unempl. In that sector"). Page-agnostic, keyed by country (sections/market_jobs.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the whole country's unemployment rate; each other rate (the capital, the young) is a row on one
 *    common scale, the country's rate a tick on every track, so each reads against it without a word; the tick is keyed once
 *    under the scale by the rate's own label (M6, 2026-09-26).
 *  - THE SCALE runs from zero to the next five above the highest rate, the same for every row.
 *  - THE TRADE'S SECTOR under it: its vacancies per hundred jobs and its payroll's change on the year, the direction as an arrow.
 *  - `data-archetype="job-market"`, `data-visual="1"`, `data-rows`; `data-row` and `data-label` on each rate.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { JobMarket as JobMarketData } from "@/lib/spine/sections/market_jobs";

export function JobMarket({ id = "job-market", data }: { id?: string; data: JobMarketData }) {
  const J = COPY.jobMarket;
  const all = data.rates.find((r) => r.key === "all") ?? data.rates[0];
  const rows = data.rates.filter((r) => r !== all);
  const top = Math.ceil(Math.max(...data.rates.map((r) => r.pct)) / 5) * 5;
  const at = (v: number) => Math.min(100, Math.max(0, (v / top) * 100));
  const s = data.sector;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="hiring" kicker={J.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{all.pct}%</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{J.focalWords}</p>
      </div>
      <div data-archetype="job-market" data-visual="1" data-rows={String(rows.length)} className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.key} data-row={r.key}>
            <div className="flex items-baseline gap-3">
              <span data-label className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{r.label}</span>
              <Fig className="text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{r.pct}%</Fig>
            </div>
            <div className="relative mt-2 h-2.5 rounded-full" role="img" aria-label={`${r.label} ${r.pct}%, against ${all.pct}%`}>
              <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
              <span aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.max(2, at(r.pct))}%`, backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(90deg, var(--c-border), var(--c-line-strong))" }} />
              <span aria-hidden data-tick className="absolute -top-1 h-4 w-0.5 rounded-full bg-[var(--c-ink)]" style={{ left: `${Math.min(99, at(all.pct))}%` }} />
            </div>
          </div>
        ))}
        <div aria-hidden className="flex justify-between text-[length:var(--t-micro)] tabular-nums text-[var(--c-muted)]">
          <span>0%</span>
          <span>{top}%</span>
        </div>
        {/* THE TICK NAMED (the goal of 2026-09-26, M6): every track carries the whole country's rate as a tick, and nothing said so;
            the key says it once, in the margins card's form (BarList's reference key), with the rate's own label, never its figure
            again (the figure is the card's). */}
        <div data-ref-key className="flex items-center gap-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          <span aria-hidden className="h-3 w-0.5 rounded-full bg-[var(--c-ink)]" />
          {all.label}
        </div>
      </div>
      {s ? (
        <div data-sector className="mt-5 grid grid-cols-2 gap-4 border-t border-[var(--c-border)] pt-3">
          <div>
            <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{s.label}</div>
            <Fig className="mt-1 block text-[length:var(--t-lead)] font-semibold leading-tight text-[var(--c-ink)]">{s.vacancies}</Fig>
            <div className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{J.vacancies}</div>
          </div>
          <div>
            <div aria-hidden className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">&nbsp;</div>
            <Fig className="mt-1 block text-[length:var(--t-lead)] font-semibold leading-tight text-[var(--c-ink)]">
              <span aria-hidden className="mr-1 text-[var(--c-ink2)]">{s.payrollChange < 0 ? "↓" : "↑"}</span>
              {Math.abs(s.payrollChange)}%
            </Fig>
            <div className="text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{J.payroll}</div>
          </div>
        </div>
      ) : null}
    </Box>
  );
}
