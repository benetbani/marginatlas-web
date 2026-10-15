/**
 * src/components/buy/BuyVsStartHero.tsx
 *
 * The masthead of the buy-or-start page: a clean-data-tool hero, not a magazine
 * cover. No image, no gradient. It leads with the QUESTION, then sets the two
 * headline cash figures side by side, the cash to START fresh and the sale range
 * to BUY an existing one, so the reader gets the whole decision in a glance. One
 * line on the cash sits beneath, and a quiet link points back to the full cell
 * economics.
 *
 * Layout: on a narrow screen the two cash figures stack; from sm they sit side by
 * side, start leading. Figures are the board's display serif with tabular figures
 * so they align with every other money figure on the site.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { fmtUSD } from "@/components/board/format";
import { T_H1 } from "@/lib/ui/typography";
import { tradeNounFor } from "@/lib/taxonomy";
import { provAttrs } from "@/lib/spine/provenance";
import { buyRangeText } from "@/lib/open/buy_side";
import type { BuyVsStart } from "@/lib/open/buy_vs_start";

export function BuyVsStartHero({ page }: { page: BuyVsStart }) {
  /* The business as one count noun, the trade pages' own (tradeNounFor): "an existing restaurant", never the plural display name
     ("an existing restaurants", run 2 of release 1). */
  const noun = tradeNounFor(page.businessName) || "business";
  /* The buy figure is a range in currency, the trade page's own sale range, stamped with where it was read (data-src, data-kind); a trade with
     no price prints the card's stated line in its place and no figure. */
  const buyRange = buyRangeText(page.buy);

  return (
    <header className="pb-2">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
        Buy or start
      </div>
      <h1 className={T_H1}>
        Buy an existing {noun} in {page.placeName}, or start one fresh?
      </h1>

      {/* The two headline cash numbers, side by side. Start leads (the cheaper,
          more common path); buy sits beside it as the alternative. */}
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
        <div className="shrink-0">
          <div className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-900 md:text-5xl">
            {fmtUSD(page.start.cashNeededUsd)}
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
            To start fresh
          </div>
        </div>

        <div className="shrink-0 sm:border-l sm:border-parchment sm:pl-12">
          {buyRange ? (
            <div
              {...provAttrs(page.buy.prov)}
              className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-900 md:text-5xl"
            >
              {buyRange}
            </div>
          ) : (
            <p className="text-sm leading-snug text-cocoa-700">{page.buy.line}</p>
          )}
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
            {buyRange ? "To buy, estimated" : "To buy"}
          </div>
        </div>
      </div>

      {/* The verdict, one quiet line on the cash that leans only outside the dead-band and says estimate (src/lib/open/buy_side.ts); the catch on each side
          stands in the section below the card (BuyVsStartCatches). */}
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
        {page.verdict}
      </p>

      {/* Quiet link back to the full economics, at the address this page was asked at (BuyVsStart.pageHref) and never cellHref: that is cellUrl(cell), the
          cell's label spelling, and for the prerendered flagship /mx/mx-roo/hotels-lodging (labelled "Quintana Roo") it is /mx/quintana-roo/hotels-lodging,
          whose lookup falls to Mexico's country row (review of 2026-10-12, I1). */}
      <Link
        href={page.pageHref}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
      >
        See the full economics &rarr;
      </Link>
    </header>
  );
}
