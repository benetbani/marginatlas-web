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
import { Box, Head, Fig, InlineDisclosure, usd } from "@/components/spine/kit";
import { CountFig } from "./motion";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { buildCityCustomersStrip } from "@/lib/spine/range_rows";
import { COPY } from "@/lib/spine/copy";

const money = usd; // ONE money grammar page-set-wide (kit usd: exact below $10,000, $426K, $1.4M)

/* ---- what customers earn here, on the range strip ----
 * THE RANGE-STRIP ARCHETYPE, since the build loop's run 11 (2026-09-06). The
 * card was a bespoke log-scale marker plot drawn in this file, median, top 10%,
 * top 1%, with a spread word beneath it. The country page's customers section
 * had already landed on the strip with bottom tenth, typical, top tenth, and
 * the city now draws the same three marks from its own spread, so the two pages
 * rhyme. The top 1% figure is gone: it was derived twice over from the top
 * tenth and has no mark on the strip. London's spread is multipliers on the
 * city's average pay, so the head wears the sample mark and the note says
 * modelled. A city with no spread of its own draws the country's typical pay,
 * the basis line naming the country and saying the city is not researched on
 * its own yet; a city with neither self-omits. The builder is
 * buildCityCustomersStrip; the spread word rides the strip's extra slot. */
export function IncomeCurve({ d }: { d: any }) {
  const s = buildCityCustomersStrip(d);
  if (!s) return null;
  return (
    <Box id="earnings">
      <Head icon="spread" sample={s.sample}>{COPY.cityCustomers.kicker}</Head>
      <RangeStrip marks={s.marks} scale="linear" fmt={usd} basis={s.basis} note={s.note} extra={s.extra} />
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
  // runway = $3,060 x 9 = $27,540 -> $28K focal, "$3,060 a month for 9 months" subline.
  const burn = (o.rent_1bed_usd_mo || 0) + (o.groceries_usd_mo || 0) + (o.transport_usd_mo || 0);
  const weeks = o.weeks_to_breakeven || 0;
  const months = Math.round((weeks / 52) * 12);
  const runway = burn * months;
  /* THE DECIMAL WORKAROUND IS GONE (C29, 2026-09-02). The subline used to print
     "$" + (burn / 1000).toFixed(1) + "K" because the shared formatter rounded a
     monthly burn to the nearest thousand, so $3,060 read "$3K" and the shown
     mental math ($3K x 9) missed the focal figure by two thousand dollars. The
     founder's ratified grammar prints a figure under $10,000 exactly, so the
     subline is the shared function now and the arithmetic closes on the nose:
     $3,060 x 9 = $27,540, printed "$28K". The three lines behind the disclosure
     were hand-rolled a third and a fourth way in the same card, one with a
     thousands separator and two without, so a four-figure grocery bill would have
     printed "$1200" beside a rent reading "$1,200". */
  const burnLabel = money(burn);
  const items: Array<[string, string]> = [
    [money(o.rent_1bed_usd_mo || 0), "one-bed rent, a month"],
    [money(o.groceries_usd_mo || 0), "groceries, a month"],
    [money(o.transport_usd_mo || 0), "transport, a month"],
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
  /* THE SECOND DECIMAL WORKAROUND, GONE FOR THE SAME REASON (C29, 2026-09-02).
     It kept a decimal ($2.4K rather than a rounded $2K) so the two sides of the
     ratio reconciled with the focal percentage; the ratified grammar prints a
     monthly rent exactly, so they reconcile to the dollar instead of to a
     tenth of a thousand. */
  const rentShown = money(rentMo);
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
          {/* NOT MOVED ONTO THE LADDER, AND THE REASON IS WORTH MORE THAN THE MOVE.
              `text-3xl` and the ladder's focal step are both 30 pixels, so swapping them
              looks free. It is not: the Tailwind step also sets a line height of 36px and
              the ladder token sets a size only, so the swap left the line height to
              inherit and the card grew 9 pixels, measured in a browser. Pairing it with
              `leading-none`, which is what the one other focal call site does, makes the
              card 6 pixels SHORTER instead, and makes this card's leading differ from its
              sibling in the same band. Neither is neutral, and neither is worth it on a
              card no reader reaches. THIS IS THE TRAP IN THE WHOLE LADDER MIGRATION:
              414 declarations wait to be moved and not one of them is a find and
              replace. */}
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
