/**
 * src/components/buy/BuyVsStartHero.tsx
 *
 * The masthead of the buy-or-start page: a clean-data-tool hero, not a magazine
 * cover. No image, no gradient. It leads with the QUESTION, then sets the two
 * headline cash figures side by side, the cash to START fresh and the cash to BUY
 * an existing one, so the reader gets the whole decision in a glance. The honest
 * one-line verdict sits beneath, and a quiet link points back to the full cell
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
import type { BuyVsStart } from "@/lib/open/buy_vs_start";

export function BuyVsStartHero({ page }: { page: BuyVsStart }) {
  const lower = page.businessName.toLowerCase();

  return (
    <header className="pb-2">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
        Buy or start
      </div>
      <h1 className={T_H1}>
        Buy an existing {lower} in {page.placeName}, or start one fresh?
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
          <div className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-900 md:text-5xl">
            {fmtUSD(page.buy.cashNeededUsd)}
          </div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
            To buy one, modeled
          </div>
        </div>
      </div>

      {/* The honest verdict, one quiet paragraph that names the catch on both
          sides. */}
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
        {page.verdict}
      </p>

      {/* Quiet link back to the full economics. */}
      <Link
        href={page.cellHref}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
      >
        See the full economics &rarr;
      </Link>
    </header>
  );
}
