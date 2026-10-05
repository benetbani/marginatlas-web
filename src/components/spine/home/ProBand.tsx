/**
 * ProBand, PRO SAID ONCE, QUIETLY, ON THE HOME PAGE (milestone 3, masterplan step 35; his interview of 2026-09-26, ruling 23: "a
 * quiet band after the search and the UK answers: what Pro opens, the price, one button"). Drawn only while the paywall's switch
 * is on (isPaywallOn): with it off, nothing about Pro prints, as the pricing page and the terms keep today's words until launch
 * day. The monthly price at the focal rung with what Pro opens as its one line, the yearly price as its row, both through the
 * plan (src/lib/monetization/plan.ts, the one-price gate), and one button to /pricing. The button is ink, not the accent: whether
 * it takes the page's third loud moment is step 37's to weigh.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { isPaywallOn } from "@/lib/feature_flags";
import { priceLine } from "@/lib/monetization/plan";
import { COPY } from "@/lib/spine/copy";

export function ProBand() {
  if (!isPaywallOn()) return null;
  const C = COPY.home.pro;
  return (
    <Box id="pro" keep className="flex flex-col">
      <Rail icon="calculator" kicker={C.kicker} />
      {/* TWO COLUMNS FROM 768 (the page filter's WHITE SPACE on the first render, a 365 by 120 blank beside a short card): the price
          and what it opens on the left, the year's price and the button on the right. */}
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-12">
        <Focal figure={priceLine("month")} words={C.words} />
        <div className="flex flex-col">
          <FactRows rows={[{ key: "year", label: C.yearLabel, value: priceLine("year") }]} />
          <a href="/pricing" className="tap-y mt-4 inline-flex min-h-11 w-fit items-center rounded-full bg-[var(--c-ink)] px-5 text-[length:var(--t-body)] font-semibold text-[var(--c-surface)]">
            {C.button}
          </a>
        </div>
      </div>
    </Box>
  );
}
