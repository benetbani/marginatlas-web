"use client";
/**
 * Client chapters for the city page , the sections that carry count-up-safe motion
 * or a bespoke chart form built page-locally (not in the shared kit):
 *   IncomeCurve       , a labelled median/top10/top1 tick scale (log-x, no invented
 *                       curve between the three known points) plus median/top10%/
 *                       top1% spend-share tiers (replaces the 3-bar ladder that
 *                       erased the median under the top-1% tail; the tiers share the
 *                       same three labels as the ticks , one set of landmarks, two
 *                       lenses). Lives in the Customers chapter (earnings data).
 *   OwnerRunway       , the founder-runway read (monthly personal burn x weeks to
 *                       break-even = savings needed), tied to the first-year timeline.
 *                       Replaces the distorted 72%-of-salary alarm stat.
 *   RentAffordability , a small honest cost/income ratio (one year of one-bed rent
 *                       against the median income), pairs with OwnerRunway in the
 *                       Costs chapter so it is not left thin once IncomeCurve moves
 *                       out to Customers. Omits without both figures.
 *   MarginKept        , the HONEST kept-vs-spent split for the local margin leader
 *                       (hair & beauty). No fabricated rent/staff/stock sub-blocks; the
 *                       one true figure is the net margin. Per-trade margins beside it.
 * All prose from the seed. Terracotta rationed to one decision figure per Box.
 */
import * as React from "react";
import { Box, Head, Rail, Fig, InlineDisclosure, TERRA, TRACK, usd } from "@/components/spine/kit";
import { CountFig, useReducedMotion, useInView } from "./motion";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

/* ---- income distribution curve ----
 * Null-guards (real-data promotion): the whole card omits when no real median is held,
 * so a city without the sanctioned London income spread renders nothing rather than a
 * curve drawn from zeros. The spend-share tiers panel is authored, so it omits when
 * d.income.tiers is absent, leaving the real curve from the London spread alone. */
export function IncomeCurve({ d }: { d: any }) {
  const o = d.income ?? {};
  if (o.median_income_usd == null) return null;
  const med = o.median_income_usd ?? 0, t10 = o.top10_income_usd ?? 0, t1 = o.top1_income_usd ?? 0;
  const tiers: any[] = o.tiers ?? [];
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();

  // only the three real figures are known (median/top10/top1); a log-x scale plots
  // them without the top-1% tail crushing the median, but NO curve is drawn between
  // them , the shape of the distribution in between is not data we hold (S11/D1).
  const W = 320, H = 118, padL = 6, padR = 6, base = H - 20;
  const xmin = Math.log(med * 0.28), xmax = Math.log(t1 * 1.12), span = xmax - xmin || 1;
  const X = (v: number) => padL + ((Math.log(v) - xmin) / span) * (W - padL - padR);
  // ticks are static; `seen`/`reduced` are reserved for a future reveal but the
  // resting render is always the true figures (SSR-safe, never blank).
  void seen; void reduced;

  // the MEDIAN is the terracotta reference , the everyday customer is the page's
  // stated base; the tail ticks stay grey (the extreme is context, not the answer).
  const ticks: Array<[string, number, boolean]> = [["Median", med, true], ["Top 10%", t10, false], ["Top 1%", t1, false]];

  const hasTiers = tiers.length > 0;

  return (
    <Box className="citytop">
      <Head icon="spending-power">What customers earn here</Head>
      <div ref={ref} className={hasTiers ? "grid gap-4 md:grid-cols-[1fr_260px] md:items-center" : "grid gap-4"}>
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Median, top 10 percent, and top 1 percent income marked on a scale" preserveAspectRatio="none">
            <line x1={padL} y1={base} x2={W - padR} y2={base} stroke="#e0dbd6" strokeWidth={1} />
            {ticks.map(([label, v, accent]) => {
              const x = X(v);
              return (
                <g key={label}>
                  <line x1={x} y1={base - 34} x2={x} y2={base} stroke={accent ? TERRA : "#9a9a9a"} strokeWidth={accent ? 1.6 : 1} strokeDasharray={accent ? undefined : "2 2"} />
                  <circle cx={x} cy={base - 34} r={accent ? 3.2 : 2.4} fill={accent ? TERRA : "#6f6f6d"} stroke="#fff" strokeWidth={1} />
                </g>
              );
            })}
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--c-muted)]">
            {ticks.map(([label, v, accent]) => (
              <span key={label} className="flex flex-col"><span className={accent ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span><Fig className={accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}>{money(v)}</Fig></span>
            ))}
          </div>
        </div>
        {/* affordability tiers , shares explicitly labelled as SHARE OF SPEND (a
            top tenth of people carrying 30% of spend is the point, not a miscount).
            Omitted on real-data promotion (authored spend shares); the curve stands alone. */}
        {hasTiers ? (
        <div className="min-w-0 space-y-2">
          <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Spending tiers, share of spend</div>
          {tiers.map((t) => (
            <div key={t.label} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-semibold text-[var(--c-ink)]">{t.label}</span>
                <span className="shrink-0 text-[11px] text-[var(--c-muted)]"><Fig>{t.share}%</Fig> of spend</span>
              </div>
              <div className="mt-0.5 text-[10.5px] leading-tight text-[var(--c-muted)]">{t.note}</div>
            </div>
          ))}
        </div>
        ) : null}
      </div>
      {o.read ? <div className="mt-3 text-[12px] leading-snug text-[var(--c-ink2)]">{o.read}</div> : null}
    </Box>
  );
}

/* ---- owner runway ----
 * Null-guards (real-data promotion): the whole card omits when no founder cost-of-living
 * figures are held (the seed's rent/groceries/transport are placeholders), so it renders
 * nothing rather than a $0 runway. */
export function OwnerRunway({ d }: { d: any }) {
  const o = d.owner_runway ?? {};
  if (o.rent_1bed_usd_mo == null && o.groceries_usd_mo == null && o.transport_usd_mo == null) return null;
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
      <Rail icon="cost-breakdown" kicker="What you'll spend to live while you build this" />
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

/* ---- rent affordability ----
 * A small, honest cost/income ratio: one year of a one-bed rent against the median
 * income. Fills the Costs chapter's Even slot beside OwnerRunway now that IncomeCurve
 * has moved to the Customers chapter, so the chapter is not left thin with one lone
 * box. Null-guards: omits without BOTH a real one-bed rent figure and a real median
 * income , the ratio needs both sides to be honest, never one side assumed. */
export function RentAffordability({ d }: { d: any }) {
  const rentMo = d.owner_runway?.rent_1bed_usd_mo;
  const income = d.income?.median_income_usd;
  if (rentMo == null || income == null) return null;
  const pct = Math.round(((rentMo * 12) / income) * 100);
  return (
    <Box className="citytop">
      <Head icon="commercial-rent">Rent against income</Head>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Fig className="text-3xl text-[var(--terra-text)]">{pct}%</Fig>
        <span className="text-[13px] text-[var(--c-ink2)]">of the median income, a year of one-bed rent.</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: TERRA }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-[var(--c-muted)]">
        <span>{money(rentMo)}/mo rent</span>
        <span>{money(income)}/yr median income</span>
      </div>
    </Box>
  );
}

/* ---- margin kept (honest kept vs spent for the local leader) ---- */
export function MarginKept({ d }: { d: any }) {
  const t = d.trades ?? {};
  const arr: any[] = t.list ?? [];
  // the margin leader: highest net margin on the slate (all six canonical trades are local).
  const local = arr.filter((x) => x.local !== false && x.net_margin_pct != null);
  // Null-guard (real-data promotion): omit when no local trade carries a real margin.
  if (local.length === 0) return null;
  const lead = local.slice().sort((a, b) => (b.net_margin_pct ?? 0) - (a.net_margin_pct ?? 0))[0] ?? {};
  const kept = Math.max(0, Math.min(100, Number(lead.net_margin_pct ?? 0)));
  return (
    <Box className="citytop md:flex-[3]">
      <Head icon="margin">Where the money goes, for {String(lead.name ?? "").toLowerCase()}</Head>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
        <CountFig value={kept} fmt={(n) => `${Math.round(n)}%`} className="text-3xl text-[var(--terra-text)]" />
        <span className="text-[13px] text-[var(--c-ink2)]">of sales reaches the owner, before tax.</span>
      </div>
      {/* HONEST split: only the one true figure (kept vs spent). No fabricated cost
          blocks. Ink labels on both segments (white on the soft terracotta fails AA). */}
      <div className="flex h-7 overflow-hidden rounded-lg border border-[var(--c-border)]" role="img" aria-label={`Owner keeps ${kept} percent, costs take ${100 - kept} percent`}>
        <div className="flex h-full items-center pl-2" style={{ width: `${kept}%`, background: TERRA }}><span className="fig text-[11px] font-semibold text-[#1b1b1a]">{kept}%</span></div>
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
