/**
 * src/components/open/OpeningHero.tsx
 *
 * The masthead of the opening page: a clean-data-tool hero, not a magazine
 * cover. No image, no gradient. It leads with the ANSWER, the total one-time
 * cost to open, as the single large figure; the one-line verdict sits beneath,
 * and a quiet link points back to the full cell economics. The 0..100 break-in
 * rating that stood beside the cost left on 2026-10-05 (his ruling 11, "no
 * composite, ever"; masterplan step 02). The figure is the board's display
 * serif with tabular figures so it aligns with every other money figure on the
 * site.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { fmtUSD } from "@/components/board/format";
import { T_H1 } from "@/lib/ui/typography";
import { dealbreakerFor } from "@/lib/open/dealbreakers";
import type { OpeningPage } from "@/lib/open/opening_page";

export function OpeningHero({ page }: { page: OpeningPage }) {
  // The one condition that has to be true, for the handful of businesses where a
  // single condition truly dominates. Null for everything else, so most pages
  // render nothing here.
  const dealbreaker = dealbreakerFor(page.industryId);

  return (
    <header className="pb-2">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
        What it takes to open
      </div>
      <h1 className={T_H1}>
        {page.businessName} in {page.placeName}
      </h1>

      {/* The answer, lead figure: the total to open. */}
      <div className="mt-6">
        <div className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-900 md:text-5xl">
          {fmtUSD(page.totalToOpenUsd)}
        </div>
        <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
          To open
        </div>
      </div>

      {/* The warm verdict, one quiet line. */}
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
        {page.verdict}
      </p>

      {/* The single dealbreaker, only where one condition truly dominates.
          Renders nothing for every other business. */}
      {dealbreaker ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cocoa-700">
          <span className="font-semibold text-ink-900">Do not open unless</span>{" "}
          {dealbreaker}. Directional, and worth being honest with yourself about
          before anything else.
        </p>
      ) : null}

      {/* Quiet links: back to the full economics, and across to the buy-or-start
          companion page (would it be smarter to buy an existing one instead). */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link
          href={page.cellHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
        >
          See the full economics &rarr;
        </Link>
        <Link
          href={`${page.cellHref}/buy-or-start`}
          className="inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
        >
          Buy one instead of starting? &rarr;
        </Link>
      </div>
    </header>
  );
}
