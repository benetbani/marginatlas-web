/**
 * src/components/buy/BuyVsStartCompare.tsx
 *
 * The side-by-side decision card: two columns, START on the left, BUY on the
 * right, each carrying the same three rows so the reader compares like for like:
 *
 *   - Cash needed up front (the lead figure on each side).
 *   - Time to positive cash flow (start = time to open plus the ramp; buy =
 *     day one, the whole point of buying).
 *   - The risk read (where the danger sits on each path).
 *
 * The two columns share one visual language, the board's quiet label / display
 * figure treatment, with a warm-taupe divider between them. The BUY column is
 * marked "modeled" on its cash figure because the sale price is an archetype, not
 * a real listing, exactly the honesty the rest of the site keeps.
 *
 * Server component. Tokens only, mobile-first (the columns stack on a narrow
 * screen and sit side by side from sm), no raw hex, no em-dashes, no source-agency
 * names.
 */
import * as React from "react";
import { fmtUSD, fmtWeeksToOpen } from "@/components/board/format";
import type { BuyVsStart } from "@/lib/open/buy_vs_start";

/** A real, finite, positive number. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/** One labelled row inside a column: a quiet label, a value, an optional note. */
function Row({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-cocoa-500">
        {label}
      </div>
      <div className="mt-0.5 font-display text-lg font-semibold tabular-nums text-ink-900">
        {value}
      </div>
      {note ? (
        <div className="mt-0.5 text-[11px] leading-snug text-cocoa-500">{note}</div>
      ) : null}
    </div>
  );
}

/** The warm "time to positive cash flow" phrase for the START side. */
function startCashFlowPhrase(page: BuyVsStart): string {
  const weeks = fmtWeeksToOpen(page.start.timeToOpenWeeks);
  if (isPos(page.start.paybackYears)) {
    const y = page.start.paybackYears;
    const ramp =
      y < 1
        ? `about ${Math.max(1, Math.round(y * 12))} months`
        : `about ${Number.isInteger(y) ? y : y.toFixed(1)} years`;
    return `${weeks} to open, then ${ramp} of ramp to earn it back`;
  }
  return `${weeks} to open, then a ramp before profit`;
}

export function BuyVsStartCompare({ page }: { page: BuyVsStart }) {
  return (
    <section className="mt-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
        {/* START column. */}
        <div className="rounded-lg border border-parchment bg-cream-50 p-5 sm:rounded-r-none sm:border-r-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
            Start fresh
          </div>
          <p className="mt-1 text-sm leading-snug text-cocoa-700">
            Build it from nothing, your way.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Row
              label="Cash needed"
              value={fmtUSD(page.start.cashNeededUsd)}
              note="capital plus permits to open, modeled"
            />
            <Row
              label="Time to cash flow"
              value={fmtWeeksToOpen(page.start.timeToOpenWeeks)}
              note={startCashFlowPhrase(page)}
            />
            <Row
              label="Where the risk sits"
              value="The ramp"
              note="no income until you find your feet, and most failures happen early"
            />
          </div>
        </div>

        {/* BUY column. */}
        <div className="rounded-lg border border-parchment bg-cream-50 p-5 sm:rounded-l-none">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
            Buy existing
          </div>
          <p className="mt-1 text-sm leading-snug text-cocoa-700">
            Step into a business that already runs.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Row
              label="Cash needed"
              value={fmtUSD(page.buy.cashNeededUsd)}
              note={`about ${page.buy.multiple}x owner earnings, modeled sale price`}
            />
            <Row
              label="Time to cash flow"
              value="Day one"
              note="you inherit the cash flow the day you take the keys"
            />
            <Row
              label="Where the risk sits"
              value="The goodwill"
              note="you pay for it up front and inherit whatever the seller is walking away from"
            />
          </div>
        </div>
      </div>

      {/* One quiet honesty note: the buy side is modeled. */}
      <p className="mt-3 text-[11px] text-cocoa-500">
        The sale price is a modeled earnings multiple, not a real listing.
        Directional, and a starting point for what a real deal might cost.
      </p>
    </section>
  );
}
