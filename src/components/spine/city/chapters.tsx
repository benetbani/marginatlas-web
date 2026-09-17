"use client";
/**
 * Client chapters for the city page , the sections that carry count-up-safe motion
 * or a bespoke chart form built page-locally (not in the shared kit):
 *   IncomeCurve       , a labelled median/top10/top1 tick scale (log-x, no invented
 *                       curve between the three known points). The 60/30/10 spend-share
 *                       tier cards are CUT (founder C8, 2026-07-11; rulebook v1 §7: the
 *                       split is near-universal, so it says nothing about this city).
 *                       Lives in the Customers chapter (earnings data).
 *   OwnerRunway       , your own living costs (a one-bed flat, groceries, a transport
 *                       pass and a coffee, a month, from the city fact bank since
 *                       2026-09-17) , a PERSONAL cost-of-living read, retitled plainly
 *                       and rehomed beside the first-year/risk material (founder C4,
 *                       2026-07-11). The runway multiplication it was named for is
 *                       gone; the function keeps its name so the census key holds.
 *   RentAffordability , a small honest cost/income ratio (one year of one-bed rent
 *                       over a year of typical pay, the builder's choice of pay),
 *                       placed in the customers chapter so both sides of the ratio
 *                       share one screen with what customers earn (founder C5,
 *                       2026-07-11). Omits without the builder's output.
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

/** A COPY sentence with its figures set in Fig. The template keeps the whole
 *  sentence in one place, where it can be read aloud, and the figures still
 *  wear the figure face like every other number on the page: "{rent}" and
 *  "{coffee}" become Fig spans, the words between them stay text. */
function fillFigs(template: string, figs: Record<string, string>): React.ReactNode[] {
  return template.split(/(\{[a-z]+\})/g).map((part, i) => {
    const m = /^\{([a-z]+)\}$/.exec(part);
    if (!m) return part;
    return <Fig key={i} className="text-[var(--c-ink)]">{figs[m[1]] ?? ""}</Fig>;
  });
}

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

/* ---- your own living costs ----
 * A PERSONAL cost-of-living read (not a business cost): plainly titled and rendered
 * beside the first-year/risk material, never inside the commercial-costs flow
 * (founder C4, 2026-07-11). Null-guards: the whole card omits unless the adapter
 * holds all three monthly figures, so it renders nothing rather than a $0 month.
 *
 * FED BY THE CITY FACT BANK SINCE 2026-09-17 (CITY-PROGRAMME step 1a, research
 * item 21; the builder is buildCityLiving in src/lib/spine/fact_rows.ts, which
 * runs in the adapter because it reads the file system). For two months this
 * card omitted on every real city as "founder placeholders" while the bank held
 * a one-bed rent, groceries, a transport pass and a coffee for 251 of 252.
 *
 * THE FOCAL IS THE MONTH, NOT A RUNWAY, and this is the one change to the form.
 * The card used to print "Savings to reach break-even", a monthly burn times
 * the months to break-even, and the months came off a weeks_to_breakeven that
 * no city holds honestly: a first-year ramp is a trade-level figure with no
 * anchor at city altitude (city-view.tsx's header), and London's 38 was a
 * placeholder. With the builder returning the four figures and no weeks, the
 * old focal would have printed $0 on 252 cities, a label where a number goes.
 * So the focal is the sum the card can stand behind, rent plus food plus the
 * pass, a month, and the line under it says what share of that is the flat.
 * Everything else stays: the micro label over the figure, the count-up, the
 * disclosure with the line items. The coffee joins the items as the fourth
 * figure the bank holds.
 *
 * THE BASIS LINE IS VISIBLE, not behind the disclosure, because it is the only
 * place the word "modelled" or "placeholder" can reach a reader with the sample
 * mark switched off site-wide; the builder composes it and names the city. */
export function OwnerRunway({ d }: { d: any }) {
  const o = d.owner_runway ?? {};
  if (o.rent_1bed_usd_mo == null || o.groceries_usd_mo == null || o.transport_usd_mo == null) return null;
  const sample = o._meta?.confidence === "placeholder" || o._meta?.confidence === "modeled" || o._meta?.confidence === "extrapolated";
  /* IDENTITY (must close): the focal is the three line items summed. The adapter
     carries monthly_usd from the builder; it is recomputed here from the same
     three figures the disclosure prints, so the card cannot print a total its
     own items do not add to. The seed's figures are rounded to the dollar and
     the shared formatter prints a figure under $10,000 exactly (C29), so the
     sum closes on the nose. */
  const monthly = Math.round(o.rent_1bed_usd_mo + o.groceries_usd_mo + o.transport_usd_mo);
  const coffee: number | null = typeof o.coffee_usd === "number" && Number.isFinite(o.coffee_usd) && o.coffee_usd > 0 ? o.coffee_usd : null;
  /* A COFFEE PRINTS ITS CENTS. The shared grammar rounds to the dollar, which
     turns Frankfurt's $4.36 into $4 and Abidjan's $1.30 into $1: a cup is the
     one figure on this site where the cents are the figure. Two decimals, the
     way the bank holds it, and only here. */
  const cup = (v: number) => "$" + v.toFixed(2);
  const sub = fillFigs(coffee != null ? COPY.cityLiving.sub : COPY.cityLiving.subNoCoffee, {
    rent: money(o.rent_1bed_usd_mo),
    coffee: coffee != null ? cup(coffee) : "",
  });
  /* A FARE-FREE CITY PRINTS THE WORD (blueprint rule, COPY.free: a zero fee is
     the word, never $0). Belgrade and Richmond hold a transport pass of 0,
     tagged held, and both run fare-free transit. */
  const items: Array<[string, string]> = [
    [money(o.rent_1bed_usd_mo), COPY.cityLiving.items.rent],
    [money(o.groceries_usd_mo), COPY.cityLiving.items.groceries],
    [o.transport_usd_mo > 0 ? money(o.transport_usd_mo) : COPY.free, COPY.cityLiving.items.transit],
    ...(coffee != null ? [[cup(coffee), COPY.cityLiving.items.coffee] as [string, string]] : []),
  ];
  return (
    <Box>
      <Head icon="cost-breakdown" sample={sample}>{COPY.cityLiving.kicker}</Head>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{COPY.cityLiving.focal}</div>
          {/* INK, NOT TERRACOTTA. A living cost is a cost the reader will pay, not
              an answer the page recommends (rule 37, accent marks answers only),
              and the page's three accents are already named (MODEL PART 6: the
              customer pay, the leading district, the leading trade). The card
              drew terracotta for two months without anyone seeing it, because it
              never drew; the day it did, the page filter counted five accents
              against a budget of three. The living brief (05-living) rules it
              quiet for the same reason. */}
          <CountFig value={monthly} fmt={(n) => money(n)} className="text-[32px] leading-none text-[var(--c-ink)] md:text-[36px]" />
          <div className="mt-1 text-[length:var(--t-body)] text-[var(--c-ink2)]">{sub}</div>
        </div>
      </div>
      {o.basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{o.basis}</p> : null}
      <InlineDisclosure name="runway" summary={COPY.cityLiving.disclosure}>
        <div className="mt-2 divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
          {items.map(([v, l]) => (
            <div key={l} className="flex items-baseline justify-between gap-3 py-1.5"><span className="text-[11.5px] text-[var(--c-ink2)]">{l}</span><Fig className="text-[13px] text-[var(--c-ink)]">{v}</Fig></div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* ---- rent against income ----
 * A small, honest cost/income ratio: one year of a one-bed rent over a year of
 * typical pay. Rendered in the customers chapter so both sides of the ratio share
 * one screen with what customers earn (founder C5, 2026-07-11). Null-guards: omits
 * without the builder's output, which itself needs BOTH a rent and a pay figure,
 * never one side assumed.
 *
 * READS THE BUILDER'S OUTPUT WHOLE (buildCityRunway, src/lib/spine/fact_rows.ts,
 * 2026-09-17), and no longer divides the seed's rent by d.income.median_income_usd.
 * That income is the London-only spread's midpoint, so this card could never
 * draw for any other city; and the denominator is a choice with a reason, made
 * once in the builder (the held monthly salary times twelve, research item 24)
 * rather than by whichever income happened to be on the seed. The card prints
 * the two sides the ratio was actually taken over, so a reader can check it.
 *
 * "TYPICAL PAY", NEVER "MEDIAN INCOME" (item 24): the pay is modelled for 202 of
 * 252 cities, and one word serves every city. The basis line names which side is
 * modelled or a placeholder, because the sample mark is switched off site-wide. */
export function RentAffordability({ d }: { d: any }) {
  const r = d.rent_ratio;
  if (!r || !Number.isFinite(r.pct) || r.rent?.value == null || r.pay?.value == null) return null;
  const sample = !!r.sample;
  const pct: number = r.pct;
  /* THE SECOND DECIMAL WORKAROUND, GONE FOR THE SAME REASON (C29, 2026-09-02).
     It kept a decimal ($2.4K rather than a rounded $2K) so the two sides of the
     ratio reconciled with the focal percentage; the ratified grammar prints a
     monthly rent exactly, so they reconcile to the dollar instead of to a
     tenth of a thousand. */
  const rentShown = money(r.rent.value);
  const payShown = money(r.pay.value);
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
        <Head icon="commercial-rent" sample={sample}>{COPY.cityRunway.kicker}</Head>
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
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{COPY.cityRunway.focalSub}</span>
        </div>
        {r.basis ? <p className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.basis}</p> : null}
        <div className="mt-auto divide-y divide-[var(--c-border)] border-t border-[var(--c-border)] pt-4">
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{COPY.cityRunway.rows.rent}</span>
            <span className="whitespace-nowrap"><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{rentShown}</Fig> <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{COPY.cityRunway.units.month}</span></span>
          </div>
          <div className="flex items-baseline justify-between gap-3 py-2.5">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{COPY.cityRunway.rows.pay}</span>
            <span className="whitespace-nowrap"><Fig className="text-[length:var(--t-lead)] text-[var(--c-ink)]">{payShown}</Fig> <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{COPY.cityRunway.units.year}</span></span>
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
