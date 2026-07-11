"use client";
/**
 * Client chapters for the city page , the sections that carry count-up-safe motion
 * or a bespoke chart form built page-locally (not in the shared kit):
 *   IncomeCurve       , a labelled median/top10/top1 tick scale (log-x, no invented
 *                       curve between the three known points). The 60/30/10 spend-share
 *                       tier cards are CUT (founder C8, 2026-07-11; rulebook v1 §7: the
 *                       split is near-universal, so it says nothing about this city).
 *                       Lives in the Customers chapter (earnings data).
 *   OwnerRunway       , the founder-runway read (monthly personal burn x weeks to
 *                       break-even = savings needed) , a PERSONAL cost-of-living read,
 *                       retitled plainly and rehomed beside the first-year/risk
 *                       material (founder C4, 2026-07-11).
 *   RentAffordability , a small honest cost/income ratio (one year of one-bed rent
 *                       against the median income), placed beside "What customers earn
 *                       here" so both sides of the ratio share one screen (founder C5,
 *                       2026-07-11). Omits without both figures.
 *   MarginKept        , the HONEST kept-vs-spent split for the local margin leader.
 *                       No fabricated rent/staff/stock sub-blocks; the city-level
 *                       trade-margin headline is CUT (rulebook v1 §5), the split bar
 *                       carries the read alone.
 * All prose from the seed. Terracotta rationed to one decision figure per Box.
 */
import * as React from "react";
import { Box, Head, Rail, Fig, InlineDisclosure, TERRA, TRACK, usd } from "@/components/spine/kit";
import { CountFig, useReducedMotion, useInView } from "./motion";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

/* ---- income distribution curve ----
 * Null-guards (real-data promotion): the whole card omits when no real median is held,
 * so a city without the sanctioned London income spread renders nothing rather than a
 * curve drawn from zeros. The 60/30/10 spend-share tiers are gone (rulebook v1 §7). */
export function IncomeCurve({ d }: { d: any }) {
  const o = d.income ?? {};
  if (o.median_income_usd == null) return null;
  const med = o.median_income_usd ?? 0, t10 = o.top10_income_usd ?? 0, t1 = o.top1_income_usd ?? 0;
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

  return (
    <Box>
      <Head icon="spending-power">What customers earn here</Head>
      <div ref={ref} className="grid gap-4">
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
      </div>
      {o.read ? <div className="mt-3 text-[12px] leading-snug text-[var(--c-ink2)]">{o.read}</div> : null}
    </Box>
  );
}

/* ---- owner runway ----
 * A PERSONAL cost-of-living read (not a business cost): plainly titled and rendered
 * beside the first-year/risk material, never inside the commercial-costs flow
 * (founder C4, 2026-07-11). Null-guards (real-data promotion): the whole card omits
 * when no founder cost-of-living figures are held (the seed's rent/groceries/transport
 * are placeholders), so it renders nothing rather than a $0 runway. */
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
    <Box>
      <Rail icon="cost-breakdown" kicker="Your own living costs" />
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
 * income. Rendered beside "What customers earn here" so both sides of the ratio share
 * one screen (founder C5, 2026-07-11). Null-guards: omits without BOTH a real one-bed
 * rent figure and a real median income , the ratio needs both sides to be honest,
 * never one side assumed. */
export function RentAffordability({ d }: { d: any }) {
  const rentMo = d.owner_runway?.rent_1bed_usd_mo;
  const income = d.income?.median_income_usd;
  if (rentMo == null || income == null) return null;
  const pct = Math.round(((rentMo * 12) / income) * 100);
  return (
    <Box>
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

/* ---- margin kept (honest kept vs spent for the local leader) ----
 * The city-level trade-margin HEADLINE is cut (rulebook v1 §5, founder 2026-07-11):
 * the kept-vs-costs split bar carries the read alone, its own in-bar labels the
 * only figures. */
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
    <Box>
      <Head icon="margin">Where the money goes, for {String(lead.name ?? "").toLowerCase()}</Head>
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
