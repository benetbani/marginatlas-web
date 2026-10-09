/**
 * ProBand, PRO SAID ONCE, QUIETLY, ON THE HOME PAGE (milestone 3, masterplan step 35; his interview of 2026-09-26, ruling 23: "a
 * quiet band after the search and the UK answers: what Pro opens, the price, one button"). Drawn only while the paywall's switch
 * is on (isPaywallOn): with it off, nothing about Pro prints, as the pricing page and the terms keep today's words until launch
 * day. The pricing page's own lead at the focal rung, the year by the month with how it is billed ("$38 a month, billed yearly";
 * "$38 a month" alone reads as a month-to-month price), with what Pro opens as its one line, then the year's total and the month
 * to month price as its two rows (his decision of 2026-10-09: the year leads), all through the plan
 * (src/lib/monetization/plan.ts, the one-price gate), and one button to /pricing. The button is ink, not the accent: whether
 * it takes the page's third loud moment is step 37's to weigh.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { isPaywallOn } from "@/lib/feature_flags";
import { priceLine, yearlyHeadline } from "@/lib/monetization/plan";
import { COPY } from "@/lib/spine/copy";

/* The lead is longer than a figure and the card is narrow, so at the focal rung it takes two lines. Its last two words are held by
   a no-break space, so the break falls after the comma and never leaves "yearly" alone on a line. */
const LEAD = yearlyHeadline().replace(/ (?=\S+$)/, "\xa0");

export function ProBand() {
  if (!isPaywallOn()) return null;
  const C = COPY.home.pro;
  return (
    <Box id="pro" keep className="flex flex-col">
      <Rail icon="calculator" kicker={C.kicker} />
      {/* TWO COLUMNS FROM 768 (the page filter's WHITE SPACE on the first render, a 365 by 120 blank beside a short card): the year
          by the month, billed yearly, and what Pro opens on the left, the year's total, the month's price and the button on the right. */}
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-12">
        <Focal figure={LEAD} words={C.words} />
        <div className="flex flex-col">
          <FactRows rows={[
            { key: "year", label: C.yearLabel, value: priceLine("year") },
            { key: "month", label: C.monthLabel, value: priceLine("month") },
          ]} />
          <a href="/pricing" className="tap-y mt-4 inline-flex min-h-11 w-fit items-center rounded-full bg-[var(--c-ink)] px-5 text-[length:var(--t-body)] font-semibold text-[var(--c-surface)]">
            {C.button}
          </a>
        </div>
      </div>
    </Box>
  );
}
