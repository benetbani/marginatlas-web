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
  /* POSITION IN PER CENT, SIZE IN PIXELS. This was a fixed 320x84 drawing stretched
     to the width of its card, so every part of it grew with the container: measured
     in a browser, the marker dots went from a 2.5px radius at phone width to 6.9px at
     reading width, the stems from 35px to 95px, and the box from 67px tall to 182px
     for three ticks. The scale is the only thing here that should stretch, so the
     x positions are a percentage and everything else is a fixed size. */
  const xmin = Math.log(med * 0.28), xmax = Math.log(t1 * 1.12), span = xmax - xmin || 1;
  const X = (v: number) => ((Math.log(v) - xmin) / span) * 100;
  // ticks are static; `seen`/`reduced` are reserved for a future reveal but the
  // resting render is always the true figures (SSR-safe, never blank).
  void seen; void reduced;

  /* THREE FIGURES, AND THE CARD LETS ITSELF IN ON ONE. The guard above asks only for
     a median; the two tail figures fall back to zero when absent, and this scale is
     logarithmic, so a zero is not a position at all, it is negative infinity, and the
     mark would be placed outside any possible box. The scale also reads left to
     right, so figures out of order would draw a picture that contradicts its own
     labels. Neither is reached today, checked across ten cities, of which exactly
     ONE draws this card at all. Unreached is not the same as impossible: the card
     draws nothing rather than draw either. */
  if (!(med > 0) || !(t10 >= med) || !(t1 >= t10)) return null;

  // the MEDIAN is the terracotta reference , the everyday customer is the page's
  // stated base; the tail ticks stay grey (the extreme is context, not the answer).
  const ticks: Array<[string, number, boolean]> = [["Median", med, true], ["Top 10%", t10, false], ["Top 1%", t1, false]];

  /* THE SPREAD WORD LIVES HERE NOW, ON THE CHART THAT SHOWS THE SPREAD.
     It had its own card 650px up the page: 356x147px holding one adjective,
     "Somewhat uneven", and a caption. No figure, no visual. Art direction E5, a
     section that is prose with nothing drawn is not a section, and A2, a section
     needs a figure. The chart below it says the same thing properly, three marks
     on a log scale showing how far the top pulls away from the middle.

     So the word joins the chart it describes rather than competing with it from
     another band. Nothing is lost: the reader still gets the word AND the shape,
     and now they are in the same place, which is where a read belongs. */
  const spreadWord = d.demand?.spread_word ?? null;

  return (
    <Box id="earnings">
      {/* THE GLYPH WAS A SHOPPING BAG, ON A CARD ABOUT WHAT PEOPLE EARN. Spending
          power is what a reader does with income, not the income itself, and at
          twenty-eight pixels the bag reads as a bin: a tapered body, a lid line and
          a mark inside it. The column test run on this icon set put it in a
          collision group with a second bag.
          The set already holds the exact drawing this card makes , a low-to-high
          band with the typical point marked , and nothing else on this page uses
          it. The card s own closing line says "is how the money is spread here". */}
      <Head icon="spread" sample={sample}>What customers earn here</Head>
      <div ref={ref} className="grid gap-4">
        <div className="min-w-0">
          {/* The plot. Four raw colours lived in the drawing this replaces; every one
              of them is a token now. */}
          {/* THE STEMS WERE 44px TALL AND ALL THE SAME HEIGHT, so the vertical
              dimension of this plot encoded nothing: position on the scale already
              carries the value, and three equal stems beside it read as three bars
              whose heights a reader tries to compare and cannot. Most of the card's
              height was that false encoding.

              A short tick is different from a bar. It connects a mark to the label
              beneath it and claims nothing, which is what these were always for. */}
          {/* DECLARED I1, WAVE C ROW C9, 2026-09-02. Three real figures as marks on one
              shared log axis is the catalogue's "shared-axis marker plot", and under
              the version-2 idea budget a line with marks positioned along it is a
              HORIZONTAL TRACK. It was drawn here with no idea on it, which is the
              catalogue addendum's "where the sameness actually lives": bespoke inline
              markup in a view file, where no budget could reach it. The shape is right
              for the information (a spread of one quantity, index row "a spread: low,
              typical, high"), so this row is a declaration and not a replacement.
              The page's other track is the six-spectra quick reads, so the city page
              is now AT the cap of two and nothing else on it may be a track. */}
          <div data-idea="I1" className="relative h-[24px]" role="img" aria-label="Median, top 10 percent, and top 1 percent income marked on a scale">
            <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--c-border)]" />
            {ticks.map(([label, v, accent]) => (
              <span key={label} className="absolute bottom-0 top-0" style={{ left: `${X(v)}%` }}>
                <span
                  className="absolute bottom-0 h-[12px] w-0 -translate-x-1/2"
                  style={{
                    borderLeftWidth: accent ? 2 : 1,
                    borderLeftStyle: accent ? "solid" : "dashed",
                    borderLeftColor: accent ? TERRA : "var(--c-line-strong)",
                  }}
                />
                <span
                  className="absolute bottom-[9px] h-[7px] w-[7px] -translate-x-1/2 rounded-full border border-[var(--c-card)]"
                  style={{ background: accent ? TERRA : "var(--c-muted)" }}
                />
              </span>
            ))}
          </div>
          {/* THE LABELS SIT UNDER THEIR OWN MARKS. They used to be spread evenly across
              the row while the marks sat at their real positions on a log scale, so the
              two drifted apart as the card got wider: measured, the median label was 82
              pixels from its mark at phone width and 258 at reading width, which is more
              than a third of the card. Each label now takes its mark's position. A label
              centred on a mark near either end would hang off the edge, the fault this
              loop has now found on four different scales, so the outermost ones are
              pinned inside the box instead of centred. */}
          <div /* THE FIGURES LEAD, NOT THE ADJECTIVE. The verdict word sat at lead size,
              the largest thing on the card, while the three figures it summarises sat
              at micro, the smallest. A card about what customers earn was led by a
              word, and the earnings were a footnote to it. */
          className="relative mt-1 h-[42px] text-[length:var(--t-micro)] text-[var(--c-muted)]">
            {ticks.map(([label, v, accent]) => {
              const x = X(v);
              const edge = x > 88 ? "right" : x < 12 ? "left" : "centre";
              const style: React.CSSProperties =
                edge === "right"
                  ? { right: 0 }
                  : edge === "left"
                    ? { left: 0 }
                    : { left: `${x}%`, transform: "translateX(-50%)" };
              return (
                <span key={label} className={`absolute top-0 flex flex-col whitespace-nowrap ${edge === "right" ? "items-end" : ""}`} style={style}>
                  <span className={accent ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span>
                  {/* THE MEDIAN IS THE ANSWER, THE TAILS ARE THE CONTEXT, and until now all
                      three were printed at one size while the adjective below them and the
                      card title above them were both larger. The card was asking a reader to
                      find the finding. The median steps up a rung; the two tail figures do
                      not, because a reader looking for "what do customers here earn" wants
                      one number and gets a shape for free. */}
                  <Fig className={`font-semibold ${accent ? "text-[length:var(--t-head)] text-[var(--terra-text)]" : "text-[length:var(--t-body)] text-[var(--c-ink)]"}`}>{money(v)}</Fig>
                </span>
              );
            })}
          </div>
        </div>
        {spreadWord ? (
          <div className="flex flex-wrap items-baseline gap-x-2.5 border-t border-[var(--c-border)] pt-3">
            <span className="text-[length:var(--t-lead)] font-semibold leading-none text-[var(--c-ink)]">{spreadWord}</span>
            <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">is how the money is spread here</span>
          </div>
        ) : null}
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
