/**
 * FirstYears, WHO IS STILL TRADING, AND WHAT GETS IN THE WAY (2026-09-25; his message that night: "Decisive factors that decide
 * whether a business survives the 1st year"). Page-agnostic, keyed by country (sections/first_years.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the cohort's share still trading at the curve's last year, and the curve's last point is the one
 *    point drawn in the accent; the years before it print their share at their own point, the last does not (it is the figure).
 *  - THE CURVE is one cohort followed year by year: a line over an area whose accent gradient fades into the card (his "the
 *    gradient is barely used"), a start at the whole and a point a year. The area is SVG stretched to the box; every mark and
 *    label is HTML placed in percentages, so no text stretches, and a point at either end is pinned inside the box.
 *  - THE REGIONS: the best and the worst region on the same last year as a span on a 0 to 100 track, the country's own share as
 *    a tick on it, the two ends named.
 *  - THE OBSTACLES, when the country holds them: what small employers name a major obstacle, as bars ranked by share, the largest
 *    the one bar in the accent (BarList's `mark`).
 *  - `data-archetype="survival-curve"`, `data-visual="1"`, `data-points`.
 */
import * as React from "react";
import { Box, Fig, Rail } from "@/components/spine/kit";
import { BarList } from "@/components/spine/charts/BarList";
import { COPY } from "@/lib/spine/copy";
import type { Obstacles, Survival } from "@/lib/spine/sections/first_years";

export function FirstYears({ id = "first-years", data, obstacles }: { id?: string; data: Survival; obstacles?: Obstacles | null }) {
  const C = COPY.firstYears;
  const pts = [{ year: 0, pct: 100 }, ...data.points];
  const maxYear = data.last.year;
  const x = (year: number) => (year / maxYear) * 100;
  /* The plot's vertical: the whole at the top, a floor under the lowest point with room for its label. */
  const floor = Math.max(0, Math.floor((data.last.pct - 20) / 10) * 10);
  const y = (pct: number) => ((100 - pct) / (100 - floor)) * 100;
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(2)},${y(p.pct).toFixed(2)}`).join(" ");
  const area = `${line} L100,100 L0,100 Z`;
  /* The gradient's id is the card's own plus a suffix: the card and the gradient once shared "first-years-gb", url() found the card
     first, and the area painted nothing. */
  const gid = `${id}-area-fill`;
  const r = data.regions;
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="first-year" kicker={C.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{Math.round(data.last.pct)}%</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{C.focalWords.replace("{n}", String(maxYear))}</p>
      </div>
      <div data-archetype="survival-curve" data-visual="1" data-points={String(data.points.length)}>
        <div className="relative h-44" role="img" aria-label={`${C.kicker}: ${data.points.map((p) => `${C.year.replace("{n}", String(p.year))} ${p.pct}%`).join(", ")}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--terra)", stopOpacity: 0.32 }} />
                <stop offset="100%" style={{ stopColor: "var(--terra)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gid})`} />
            <path d={line} fill="none" stroke="var(--terra)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {pts.map((p, i) => {
            const last = i === pts.length - 1;
            return (
              <React.Fragment key={p.year}>
                <span aria-hidden data-point={p.year} className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)] ${last ? "h-3.5 w-3.5" : ""}`} style={{ left: `${Math.max(2, Math.min(98, x(p.year)))}%`, top: `${y(p.pct)}%`, background: last ? "var(--terra)" : "var(--c-ink2)" }} />
                {i > 0 && !last ? (
                  <span data-mark-label className="absolute -translate-x-1/2 -translate-y-full pb-2 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]" style={{ left: `${Math.max(2, Math.min(98, x(p.year)))}%`, top: `${y(p.pct)}%` }}>{Math.round(p.pct)}%</span>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div aria-hidden className="relative mt-2 h-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {pts.map((p) => (
            <span key={p.year} className="absolute whitespace-nowrap" style={{ left: `${Math.min(100, Math.max(0, x(p.year)))}%`, transform: `translateX(-${Math.min(100, Math.max(0, x(p.year)))}%)` }}>
              {p.year === 0 ? C.start : C.year.replace("{n}", String(p.year))}
            </span>
          ))}
        </div>
      </div>
      {r ? (
        <div data-regions className="mt-5 border-t border-[var(--c-border)] pt-3">
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{C.regions.replace("{n}", String(maxYear))}</div>
          <div className="relative mt-3 h-2 rounded-full" role="img" aria-label={`${r.worst.name} ${r.worst.pct}%, ${r.best.name} ${r.best.pct}%`}>
            <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
            <span aria-hidden className="absolute inset-y-0 rounded-full bg-[var(--c-line-strong)]" style={{ left: `${r.worst.pct}%`, width: `${Math.max(1, r.best.pct - r.worst.pct)}%` }} />
            <span aria-hidden data-tick className="absolute -top-1 h-4 w-0.5 rounded-full bg-[var(--c-ink)]" style={{ left: `${Math.min(99, Math.max(0, data.last.pct))}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">
            <span><Fig className="font-semibold text-[var(--c-ink)]">{Math.round(r.worst.pct)}%</Fig> {r.worst.name}</span>
            <span className="text-right"><Fig className="font-semibold text-[var(--c-ink)]">{Math.round(r.best.pct)}%</Fig> {r.best.name}</span>
          </div>
        </div>
      ) : null}
      {obstacles ? (
        <div data-obstacles className="mt-5 border-t border-[var(--c-border)] pt-3">
          <div className="mb-3 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{C.obstaclesKicker}</div>
          <BarList items={obstacles.items.map((o) => ({ key: o.key, label: o.label, value: o.pct, display: `${o.pct}%` }))} max={100} look="plain" />
        </div>
      ) : null}
    </Box>
  );
}
