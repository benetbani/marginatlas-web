/**
 * src/components/open/OpeningHero.tsx
 *
 * The masthead of the opening page: a clean-data-tool hero, not a magazine
 * cover. No image, no gradient. It leads with one held figure, the longest
 * licence wait (the trade page's `03 permits` builder), or where the place
 * prints no licence list the trade's months to break even, stamped; the
 * one-line verdict sits beneath, and a quiet link points back to the full cell
 * economics. The total to open that led until 2026-10-15 was a typed capital
 * with no source and left that day (release 2 job A); the 0..100 break-in
 * rating that stood beside it left on 2026-10-05 (his ruling 11, "no
 * composite, ever"). The figure is the board's display serif with tabular
 * figures so it aligns with every other figure on the site.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { provAttrs } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import { T_H1 } from "@/lib/ui/typography";
import { dealbreakerFor } from "@/lib/open/dealbreakers";
import type { OpeningPage } from "@/lib/open/opening_page";
import { buyOrStartDraws, subPageHref } from "@/lib/open/sub_page_gates";

export function OpeningHero({ page }: { page: OpeningPage }) {
  // The one condition that has to be true, for the handful of businesses where a
  // single condition truly dominates. Null for everything else, so most pages
  // render nothing here.
  const dealbreaker = dealbreakerFor(page.industryId);
  const earning = page.earning[0];
  const lead = page.longestWait
    ? { figure: page.longestWait.figure, prov: page.longestWait.prov, label: COPY.opening.leadWait }
    : earning && earning.prov
      ? { figure: earning.figure, prov: earning.prov, label: COPY.opening.leadEarning.replace("{words}", earning.words.charAt(0).toUpperCase() + earning.words.slice(1)) }
      : null;

  return (
    <header className="pb-2">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-atlas-700">
        What it takes to open
      </div>
      <h1 className={T_H1}>
        {page.businessName} in {page.placeName}
      </h1>

      {/* The lead figure: the longest licence wait, else the months to break even, stamped; with neither, the stated line. */}
      <div className="mt-6">
        {lead ? (
          <>
            <div
              {...provAttrs(lead.prov)}
              className="font-display text-4xl font-semibold leading-none tabular-nums text-ink-900 md:text-5xl"
            >
              {lead.figure}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
              {lead.label}
            </div>
          </>
        ) : (
          <p className="text-base leading-snug text-cocoa-700">{COPY.opening.noLead}</p>
        )}
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
        {/* The full economics, at the address this page was asked at (OpeningPage.pageHref) and never cellHref: that is cellUrl(cell), the cell's label
            spelling, and for the prerendered flagship /mx/mx-roo/hotels-lodging (labelled "Quintana Roo") it is /mx/quintana-roo/hotels-lodging, whose
            lookup falls to Mexico's country row (review of 2026-10-12, I1). The door below is spelled the same way. */}
        <Link
          href={page.pageHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
        >
          See the full economics &rarr;
        </Link>
        {/* The buy-or-start companion, only where it draws (plan 2026-10-11, dynamic 404 remains): without a take-home
            its route answers nothing, and a door there opened a skeleton. At the address this page was asked at and never cellHref: that is
            the cell's label spelling (/mx/quintana-roo/... for /mx/mx-roo/...), whose lookup falls to a row the gate refuses (review of
            2026-10-12, I1). */}
        {buyOrStartDraws(page) ? (
          <Link
            href={subPageHref(page.pageHref, "buy-or-start")}
            className="inline-flex items-center gap-1 text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
          >
            Buy one instead of starting? &rarr;
          </Link>
        ) : null}
      </div>
    </header>
  );
}
