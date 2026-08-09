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
 * (MarginKept , the city-level owner-keeps % split , was DELETED 2026-07-12: §5 banned
 *  metric + the "fundamentally wrong" horizontal-bar money split, founder C9.)
 * All prose from the seed. Terracotta rationed to one decision figure per Box.
 */
import * as React from "react";
import { Box, Head, Fig, InlineDisclosure, TERRA, usd } from "@/components/spine/kit";
import { CountFig, useReducedMotion, useInView } from "./motion";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

/* ---- income distribution curve ----
 * Null-guards (real-data promotion): the whole card omits when no real median is held,
 * so a city without the sanctioned London income spread renders nothing rather than a
 * curve drawn from zeros. The 60/30/10 spend-share tiers are gone (rulebook v1 §7). */
export function IncomeCurve({ d }: { d: any }) {
  const o = d.income ?? {};
  if (o.median_income_usd == null) return null;
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
  const med = o.median_income_usd ?? 0, t10 = o.top10_income_usd ?? 0, t1 = o.top1_income_usd ?? 0;
  const reduced = useReducedMotion();
  const { ref, seen } = useInView<HTMLDivElement>();

  // only the three real figures are known (median/top10/top1); a log-x scale plots
  // them without the top-1% tail crushing the median, but NO curve is drawn between
  // them , the shape of the distribution in between is not data we hold (S11/D1).
  // H tightened (was 118): the markers only rise 44px off the baseline, so a taller box
  // left a dead band above the plot (rule 17, one-sided white space). The box now hugs the
  // marker stems, and the chart is the wide leg of a WideRail beside the rent-ratio rail.
  const W = 320, H = 84, padL = 6, padR = 6, base = H - 20;
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
      <Head icon="spending-power" sample={sample}>What customers earn here</Head>
      <div ref={ref} className="grid gap-4">
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Median, top 10 percent, and top 1 percent income marked on a scale" preserveAspectRatio="none">
            <line x1={padL} y1={base} x2={W - padR} y2={base} stroke="#e0dbd6" strokeWidth={1} />
            {ticks.map(([label, v, accent]) => {
              const x = X(v);
              return (
                <g key={label}>
                  <line x1={x} y1={base - 44} x2={x} y2={base} stroke={accent ? TERRA : "#9a9a9a"} strokeWidth={accent ? 1.6 : 1} strokeDasharray={accent ? undefined : "2 2"} />
                  <circle cx={x} cy={base - 44} r={accent ? 3.2 : 2.4} fill={accent ? TERRA : "#6f6f6d"} stroke="#fff" strokeWidth={1} />
                </g>
              );
            })}
          </svg>
          {/* direct labels carry the read , no glued verdict paragraph (§14/§26). */}
          <div className="mt-1 flex justify-between text-[length:var(--t-micro)] text-[var(--c-muted)]">
            {ticks.map(([label, v, accent]) => (
              <span key={label} className="flex flex-col"><span className={accent ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span><Fig className={accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink2)]"}>{money(v)}</Fig></span>
            ))}
          </div>
        </div>
      </div>
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
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled";
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
      <Head icon="cost-breakdown" sample={sample}>Your own living costs</Head>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Savings to reach break-even</div>
          <CountFig value={runway} fmt={(n) => money(n)} className="text-[32px] leading-none text-[var(--terra-text)] md:text-[36px]" />
          <div className="mt-1 text-[length:var(--t-body)] text-[var(--c-ink2)]">about <Fig className="text-[var(--c-ink)]">{burnLabel}</Fig> a month for <Fig className="text-[var(--c-ink)]">{months} months</Fig>.</div>
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
  const sample = d.owner_runway?._meta?.confidence === "placeholder" || d.owner_runway?._meta?.confidence === "modeled" || d.income?._meta?.confidence === "modeled";
  const pct = Math.round(((rentMo * 12) / income) * 100);
  // Show the monthly rent to one decimal ($2.4K, not a rounded $2K) so the two sides
  // of the ratio reconcile with the focal percentage (§26 trust).
  const rentShown = "$" + (rentMo / 1000).toFixed(1) + "K";
  // Rent-against-income is a BURDEN, not an answer: the ratio stays INK (rule 37, accent
  // marks answers only, never a cost) and the terracotta progress bar is DELETED , it read
  // high = good on a burden (rule 29A), it was the second horizontal bar in this band
  // (rule 25), and it manufactured a bar from a lone number (rule 26, that corollary is
  // repealed). The two sides of the ratio render as a schematic breakdown (rule 19) that
  // fills the card; no glued caption, the figures carry the read.
  return (
    <Box>
      {/* fill the stretched WideRail height (the chart beside it is taller): the two
          sides of the ratio anchor to the bottom (mt-auto), so no bottom crater (rule 17). */}
      <div className="flex h-full flex-col">
        <Head icon="commercial-rent" sample={sample}>Rent against income</Head>
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Fig className="text-3xl text-[var(--c-ink)]">{pct}%</Fig>
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">of a median income goes to a year of one-bed rent.</span>
        </div>
        <div className="mt-auto divide-y divide-[var(--c-border)] border-t border-[var(--c-border)] pt-4">
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">One-bed rent</span>
            <span className="whitespace-nowrap"><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{rentShown}</Fig> <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">a month</span></span>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">Median income</span>
            <span className="whitespace-nowrap"><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{money(income)}</Fig> <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">a year</span></span>
          </div>
        </div>
      </div>
    </Box>
  );
}

/* MarginKept (the city-level owner-keeps % split) was DELETED 2026-07-12: it is net
 * margin by trade within a specific city, a banned unknowable metric (rulebook v1 §5),
 * and its horizontal-bar money split was the founder's "fundamentally wrong" C9 call.
 * The "What to open" chapter now carries the ease + cost-to-open read alone (LowestBar). */
