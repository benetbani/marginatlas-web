/**
 * src/components/open/OpeningPayback.tsx
 *
 * "Earning it back": the trade's months to break even and years to pay back,
 * the trade page's own `04 open` figures (buildOpenFoot, src/lib/spine/
 * open_rows.ts, first_year.* on the trade's shard), each stamped and called an
 * estimate; and beside them the owner take-home at this address, the cell
 * page's own derivation, stamped with where it was worked out.
 *
 * WHAT STOOD HERE UNTIL 2026-10-15 (release 2 job A): "Breaks even in about N
 * years", a payback worked out as a typed capital plus typed permits over the
 * take-home, so its years were only as good as two tables with no source. The
 * shard's two figures stand in its place; the take-home stays, as its own
 * figure, because the trade's years are not worked from it.
 *
 * Graceful by construction: with neither the trade's figures nor a take-home
 * there is nothing honest to say, so the component renders nothing.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { fmtUSD } from "@/components/board/format";
import { CompanionRow } from "@/components/spine/archetypes/BentoBand";
import { provAttrs } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import type { OpeningPage } from "@/lib/open/opening_page";

export function OpeningPayback({ page }: { page: OpeningPage }) {
  const C = COPY.opening;
  const hasEarning = page.earning.length > 0;
  const hasTakeHome = page.takeHomeUsd != null && page.takeHomeUsd > 0;
  if (!hasEarning && !hasTakeHome) return null;

  return (
    <section className="atlas-card mt-6 p-4 md:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
        {C.earningHead}
      </div>
      {hasEarning ? (
        <>
          <div className="mt-2">
            <CompanionRow items={page.earning} />
          </div>
          <p className="mt-1.5 text-[11px] text-cocoa-500">{C.earningLine}</p>
        </>
      ) : null}
      {hasTakeHome ? (
        <div className={hasEarning ? "mt-4 border-t border-parchment pt-3" : "mt-2"}>
          <div
            {...provAttrs(page.takeHomeProv)}
            className="font-display text-lg font-semibold tabular-nums text-ink-900"
          >
            {/* An estimate to the dollar is false precision: printed to the nearest thousand (review Minor 6), the builder's figure untouched (the buy range is worked from it). */}
            {fmtUSD(Math.round((page.takeHomeUsd as number) / 1000) * 1000)}
          </div>
          <div className="text-[11px] text-cocoa-500">{C.takeHomeLabel}</div>
        </div>
      ) : null}
    </section>
  );
}
