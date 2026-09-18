"use client";
/**
 * Client chapters for the city page , the sections that carry count-up-safe motion
 * or a bespoke chart form built page-locally (not in the shared kit):
 *   IncomeCurve       , a labelled median/top10/top1 tick scale (log-x, no invented
 *                       curve between the three known points). The 60/30/10 spend-share
 *                       tier cards are CUT (founder C8, 2026-07-11; rulebook v1 §7: the
 *                       split is near-universal, so it says nothing about this city).
 *                       Lives in the Customers chapter (earnings data). 8.3's
 *                       `07 earnings` is the fourth dispatch's; this is today's
 *                       card in the seat.
 * TWO CARDS RETIRED HERE BY PLAN STEP 32's THIRD DISPATCH (2026-09-18):
 *   OwnerRunway       , "Your own living costs", a summed monthly focal off the
 *                       ladder (32/36px) over a disclosure of justify-between
 *                       rows (PART 5's LABEL GAP finding, four rows at 520px),
 *                       fed by the seed's `owner_runway` block. Its seat, 8.3's
 *                       `05 living`, is `Living` in city-view.tsx: a plain
 *                       KvGrid of the four figures off `buildCityLiving`, the
 *                       seat of FORM-CATALOG's candidate 1 until his click.
 *   RentAffordability , "Rent against income", a `text-3xl` percentage over two
 *                       justify-between rows that printed the one-bed rent a
 *                       second time in the band (M1), fed by the seed's
 *                       `rent_ratio`. Its seat, 8.3's `06 runway`, is `Runway`
 *                       in city-view.tsx: one KvGrid row off `buildCityRunway`,
 *                       the seat of candidate 3 until his click.
 *   Neither seed block is built any more (adapt_city.ts), and the illustrative
 *   London seed no longer carries `owner_runway`. The page-local count-up
 *   (`./motion.tsx`, `CountFig`) drew the old living focal and nothing else,
 *   so the render-graph gate found it reached by nothing and it went with the
 *   card; the cell, industry and hood pages carry their own copies of the
 *   same count-up contract, each documented in place.
 * (MarginKept , the city-level owner-keeps % split , was DELETED 2026-07-12: §5 banned
 *  metric + the "fundamentally wrong" horizontal-bar money split, founder C9.)
 * All prose from the seed. Terracotta rationed to one decision figure per Box.
 */
import * as React from "react";
import { Box, Head, usd } from "@/components/spine/kit";
import { RangeStrip } from "@/components/spine/archetypes/RangeStrip";
import { buildCityCustomersStrip } from "@/lib/spine/range_rows";
import { COPY } from "@/lib/spine/copy";

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

/* MarginKept (the city-level owner-keeps % split) was DELETED 2026-07-12: it is net
 * margin by trade within a specific city, a banned unknowable metric (rulebook v1 §5),
 * and its horizontal-bar money split was the founder's "fundamentally wrong" C9 call.
 * LowestBar, the read that stood in for it, left with plan step 32's first dispatch
 * (city-view.tsx's header); 8.3's `10 easiest` is seated, blocked and unrendered. */
