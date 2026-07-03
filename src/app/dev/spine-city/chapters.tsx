"use client";
/**
 * Client chapters for the city page , the sections that carry count-up-safe motion
 * or a bespoke chart form built page-locally (not in the shared kit):
 *   IncomeCurve   , a small income-distribution curve with median/top10/top1 ticks
 *                   and mass/comfortable/premium affordability tiers (replaces the
 *                   3-bar ladder that erased the median under the top-1% tail).
 *   OwnerRunway   , the founder-runway read (monthly personal burn x weeks to
 *                   break-even = savings needed), tied to the first-year timeline.
 *                   Replaces the distorted 72%-of-salary alarm stat.
 *   MarginKept    , the HONEST kept-vs-spent split for the local margin leader
 *                   (hair & beauty). No fabricated rent/staff/stock sub-blocks; the
 *                   one true figure is the net margin. Per-trade margins beside it.
 * All prose from the seed. Terracotta rationed to one decision figure per Box.
 */
import * as React from "react";
import { Box, Head, Rail, Fig, InlineDisclosure, TERRA, TRACK } from "@/components/spine/kit";
import { CountFig, useReducedMotion, useInView } from "./motion";

const money = (v: number) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "K");

/* ---- income distribution curve ---- */
export function IncomeCurve({ d }: { d: any }) {
  const o = d.income ?? {};
  const med = o.median_income_usd ?? 0, t10 = o.top10_income_usd ?? 0, t1 = o.top1_income_usd ?? 0;
  const tiers: any[] = o.tiers ?? [];
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();

  // a right-skewed log-normal-ish density sampled across the earnings range, plotted
  // on a log-x so the median is not crushed by the top-1% tail. Ticks at med/t10/t1.
  const W = 320, H = 118, padL = 6, padR = 6, base = H - 20;
  const xmin = Math.log(med * 0.28), xmax = Math.log(t1 * 1.12), span = xmax - xmin || 1;
  const X = (v: number) => padL + ((Math.log(v) - xmin) / span) * (W - padL - padR);
  const mu = Math.log(med), sigma = 0.62;
  const dens = (v: number) => Math.exp(-Math.pow(Math.log(v) - mu, 2) / (2 * sigma * sigma));
  const N = 60;
  const samples = Array.from({ length: N + 1 }, (_, i) => {
    const lv = xmin + (i / N) * span;
    const v = Math.exp(lv);
    return { x: X(v), y: dens(v) };
  });
  const ymax = Math.max(...samples.map((s) => s.y)) || 1;
  const Y = (y: number) => base - (y / ymax) * (base - 8);
  // curve is static; `seen`/`reduced` are reserved for a future tick-reveal but the
  // resting render is always the true distribution (SSR-safe, never blank).
  void seen; void reduced;
  const linePts = samples.map((s) => `${s.x.toFixed(1)},${Y(s.y).toFixed(1)}`);
  const line = "M " + linePts.join(" L ");
  const area = `M ${padL},${base} L ` + linePts.join(" L ") + ` L ${(W - padR)},${base} Z`;

  const ticks: Array<[string, number, boolean]> = [["Median", med, false], ["Top 10%", t10, false], ["Top 1%", t1, true]];

  return (
    <Box className="citytop">
      <Head icon="spending-power">What customers earn here</Head>
      <div ref={ref} className="grid gap-4 md:grid-cols-[1fr_260px] md:items-center">
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Income distribution with median, top 10 percent, and top 1 percent marked" preserveAspectRatio="none">
            <path d={area} fill={TERRA} opacity={0.1} />
            <path d={line} fill="none" stroke="#c8c8c6" strokeWidth={1.6} strokeLinejoin="round" />
            {ticks.map(([label, v, top]) => {
              const x = X(v);
              return (
                <g key={label}>
                  <line x1={x} y1={Y(dens(v))} x2={x} y2={base} stroke={top ? TERRA : "#9a9a9a"} strokeWidth={top ? 1.6 : 1} strokeDasharray={top ? undefined : "2 2"} />
                  <circle cx={x} cy={Y(dens(v))} r={top ? 3.2 : 2.4} fill={top ? TERRA : "#6f6f6d"} stroke="#fff" strokeWidth={1} />
                </g>
              );
            })}
            <line x1={padL} y1={base} x2={W - padR} y2={base} stroke="#e0dbd6" strokeWidth={1} />
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--c-muted)]">
            {ticks.map(([label, v, top]) => (
              <span key={label} className="flex flex-col"><span className={top ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span><Fig className={top ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}>{money(v)}</Fig></span>
            ))}
          </div>
        </div>
        {/* affordability tiers , who can afford what */}
        <div className="min-w-0 space-y-2">
          {tiers.map((t, i) => (
            <div key={t.label} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-[12px] font-semibold ${i === tiers.length - 1 ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{t.label}</span>
                <Fig className="text-[11px] text-[var(--c-muted)]">{t.share}%</Fig>
              </div>
              <div className="mt-0.5 text-[10.5px] leading-tight text-[var(--c-muted)]">{t.note}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-[12px] leading-snug text-[var(--c-ink2)]">{o.read}</div>
    </Box>
  );
}

/* ---- owner runway ---- */
export function OwnerRunway({ d }: { d: any }) {
  const o = d.owner_runway ?? {};
  // IDENTITY (must close): runway = monthly burn x months to break-even.
  // burn = rent + groceries + transport = $3,060; months = round(38wk / 52 x 12) = 9;
  // runway = $3,060 x 9 = $27,540 -> $28K focal, "$3.1K a month for 9 months" subline.
  const burn = (o.rent_1bed_usd_mo || 0) + (o.groceries_usd_mo || 0) + (o.transport_usd_mo || 0);
  const weeks = o.weeks_to_breakeven || 0;
  const months = Math.round((weeks / 52) * 12);
  const runway = burn * months;
  // subline burn keeps a decimal ($3.1K, not $3K) so the shown mental math
  // ($3.1K x 9 = ~$28K) reproduces the focal figure.
  const burnLabel = "$" + (burn / 1000).toFixed(1) + "K";
  const items: Array<[string, string]> = [
    [`$${(o.rent_1bed_usd_mo || 0).toLocaleString("en-US")}`, "one-bed rent, a month"],
    [`$${o.groceries_usd_mo}`, "groceries, a month"],
    [`$${o.transport_usd_mo}`, "transport, a month"],
  ];
  return (
    <Box className="citytop">
      <Rail icon="cost-breakdown" kicker="What you'll spend to live while you build this" verdict={o.read} />
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Savings to reach break-even</div>
          <CountFig value={runway} fmt={(n) => money(n)} className="text-[32px] leading-none text-[var(--terra-text)] md:text-[36px]" />
          <div className="mt-1 text-[12px] text-[var(--c-ink2)]">about <Fig className="text-[var(--c-ink)]">{burnLabel}</Fig> a month for <Fig className="text-[var(--c-ink)]">{months} months</Fig>, from signing to the week the till clears costs.</div>
        </div>
      </div>
      <InlineDisclosure name="runway" summary="See the monthly burn">
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {items.map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-3 py-1.5"><span className="text-[11.5px] text-[var(--c-ink2)]">{l}</span><Fig className="text-[13px] text-[var(--c-ink)]">{v}</Fig></div>
          ))}
          <div className="py-1.5 text-[11px] text-[var(--c-muted)]">{o.runway_note}</div>
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* ---- margin kept (honest kept vs spent for the local leader) ---- */
export function MarginKept({ d }: { d: any }) {
  const t = d.trades ?? {};
  const arr: any[] = t.list ?? [];
  // the local margin leader (excludes location-agnostic online retail): highest net margin among local trades.
  const local = arr.filter((x) => x.local !== false);
  const lead = local.slice().sort((a, b) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const kept = Math.max(0, Math.min(100, Number(lead.net_margin_pct ?? 0)));
  return (
    <Box className="citytop md:flex-[3]">
      <Head icon="margin">Where the money goes, for {String(lead.name ?? "").toLowerCase()}</Head>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={kept} fmt={(n) => `${Math.round(n)}%`} className="text-3xl text-[var(--terra-text)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">of sales reaches the owner, before tax.</span>
      </div>
      {/* HONEST split: only the one true figure (kept vs spent). No fabricated cost blocks. */}
      <div className="flex h-7 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Owner keeps ${kept} percent, costs take ${100 - kept} percent`}>
        <div className="flex h-full items-center pl-2" style={{ width: `${kept}%`, background: TERRA }}><span className="fig text-[11px] font-semibold text-white">{kept}%</span></div>
        <div className="flex h-full items-center justify-end pr-2" style={{ width: `${100 - kept}%`, background: TRACK }}><span className="fig text-[11px] font-medium text-[var(--c-ink2)]">{100 - kept}% costs</span></div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--c-ink2)]">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: TERRA }} />Owner keeps</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: TRACK }} />Rent, staff, stock and the rest</span>
      </div>
      <div className="mt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">{t.margin_read}</div>
    </Box>
  );
}
