"use client";

/**
 * SurvivalCurve, WHO IS STILL TRADING WHERE YOU WOULD OPEN (goal 2026-09-26, the plan's M3 on the survival card: "data change as a
 * lever"). The curve the card drew for the whole country since 2026-09-25, with the reader's region a choice: the twelve regions'
 * own curves for the same cohort (the ONS's business demography, the 2019 births and their survival, table 4.1), the country's
 * curve kept as a thin reference line while a region is shown, the card's figure and its words following the choice, and the
 * region's place marked on the best-to-worst strip under the curve.
 *
 * THE LAW (M3): the default is the country, the curve the card printed; a region's figures are the table's own, rounded as the
 * country's are; nothing is computed but the plot's geometry. The choice is a native select, so a phone opens its own picker and
 * a screen reader reads it; the figure is a polite live region.
 */
import * as React from "react";

export type CurvePoint = { year: number; pct: number };
export type RegionCurveData = { key: string; name: string; inName: string; points: CurvePoint[] };
export type SurvivalWords = { focal: string; focalIn: string; start: string; year: string; regions: string; choose: string; country: string; kicker: string };

export function SurvivalCurve({ id, country, regions, best, worst, words }: {
  id: string;
  country: CurvePoint[];
  regions: RegionCurveData[];
  best: { name: string; pct: number } | null;
  worst: { name: string; pct: number } | null;
  words: SurvivalWords;
}) {
  const [key, setKey] = React.useState<string>("");
  const region = regions.find((r) => r.key === key) ?? null;
  const shown = region ? region.points : country;
  const last = shown[shown.length - 1];
  const maxYear = last.year;
  const all = [...country, ...(region ? region.points : [])];
  const lowest = Math.min(...all.map((p) => p.pct));
  const x = (year: number) => (year / maxYear) * 100;
  const floor = Math.max(0, Math.floor((lowest - 20) / 10) * 10);
  const y = (pct: number) => ((100 - pct) / (100 - floor)) * 100;
  const path = (pts: CurvePoint[]) => [{ year: 0, pct: 100 }, ...pts].map((p, i) => `${i ? "L" : "M"}${x(p.year).toFixed(2)},${y(p.pct).toFixed(2)}`).join(" ");
  const line = path(shown);
  const area = `${line} L100,100 L0,100 Z`;
  const pts = [{ year: 0, pct: 100 }, ...shown];
  const gid = `${id}-area-fill`;
  const W = words;
  return (
    <>
      <div className="mb-3">
        <div data-focal="1" aria-live="polite" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{Math.round(last.pct)}%</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{region ? W.focalIn.replace("{n}", String(maxYear)).replace("{region}", region.inName) : W.focal.replace("{n}", String(maxYear))}</p>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <label htmlFor={`${id}-region`} className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{W.choose}</label>
        <select
          id={`${id}-region`}
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="min-w-[10rem] max-w-full cursor-pointer rounded-sm border border-[var(--c-line-strong)] bg-[var(--c-card)] px-2 py-1 text-[length:var(--t-body)] text-[var(--c-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]"
        >
          <option value="">{W.country}</option>
          {regions.map((r) => <option key={r.key} value={r.key}>{r.name}</option>)}
        </select>
      </div>
      <div data-archetype="survival-curve" data-visual="1" data-points={String(shown.length)} className="flex flex-1 flex-col">
        <div className="relative min-h-44 flex-1" role="img" aria-label={`${W.kicker}${region ? `, ${region.name}` : ""}: ${shown.map((p) => `${W.year.replace("{n}", String(p.year))} ${p.pct}%`).join(", ")}`}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--terra)", stopOpacity: 0.32 }} />
                <stop offset="100%" style={{ stopColor: "var(--terra)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gid})`} />
            {region ? <path data-reference d={path(country)} fill="none" stroke="var(--c-ink2)" strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" /> : null}
            <path d={line} fill="none" stroke="var(--terra)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {pts.map((p, i) => {
            const isLast = i === pts.length - 1;
            return (
              <React.Fragment key={p.year}>
                <span aria-hidden data-point={p.year} className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)] ${isLast ? "h-3.5 w-3.5" : ""}`} style={{ left: `${Math.max(2, Math.min(98, x(p.year)))}%`, top: `${y(p.pct)}%`, background: isLast ? "var(--terra)" : "var(--c-ink2)" }} />
                {i > 0 && !isLast ? (
                  <span data-mark-label className="absolute -translate-x-1/2 -translate-y-full pb-2 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]" style={{ left: `${Math.max(2, Math.min(98, x(p.year)))}%`, top: `${y(p.pct)}%` }}>{Math.round(p.pct)}%</span>
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <div aria-hidden className="relative mt-2 h-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {pts.map((p) => (
            <span key={p.year} className="absolute whitespace-nowrap" style={{ left: `${Math.min(100, Math.max(0, x(p.year)))}%`, transform: `translateX(-${Math.min(100, Math.max(0, x(p.year)))}%)` }}>
              {p.year === 0 ? W.start : W.year.replace("{n}", String(p.year))}
            </span>
          ))}
        </div>
        {region ? (
          <div aria-hidden className="mt-2 flex items-center gap-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">
            <span className="inline-block w-4 border-t-2 border-dashed border-[var(--c-ink2)]" />
            {W.country}
          </div>
        ) : null}
      </div>
      {best && worst ? (
        <div data-regions className="mt-5 border-t border-[var(--c-border)] pt-3">
          <div className="text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{W.regions.replace("{n}", String(maxYear))}</div>
          <div className="relative mt-3 h-2 rounded-full" role="img" aria-label={`${worst.name} ${worst.pct}%, ${best.name} ${best.pct}%`}>
            <span aria-hidden className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
            <span aria-hidden className="absolute inset-y-0 rounded-full bg-[var(--c-line-strong)]" style={{ left: `${worst.pct}%`, width: `${Math.max(1, best.pct - worst.pct)}%` }} />
            <span aria-hidden data-tick className="absolute -top-1 h-4 w-0.5 rounded-full bg-[var(--c-ink)]" style={{ left: `${Math.min(99, Math.max(0, country[country.length - 1].pct))}%` }} />
            {region ? <span aria-hidden data-region-dot className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--c-card)] bg-[var(--terra)]" style={{ left: `${Math.min(99, Math.max(1, last.pct))}%` }} /> : null}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)]">
            <span><span className="fig font-semibold text-[var(--c-ink)]">{Math.round(worst.pct)}%</span> {worst.name}</span>
            <span className="text-right"><span className="fig font-semibold text-[var(--c-ink)]">{Math.round(best.pct)}%</span> {best.name}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
