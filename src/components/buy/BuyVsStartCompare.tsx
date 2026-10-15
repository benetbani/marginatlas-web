/**
 * src/components/buy/BuyVsStartCompare.tsx
 *
 * The side-by-side decision card: two columns, START on the left, BUY on the
 * right, so the reader compares like for like:
 *
 *   - Cash needed up front: on the BUY side the sale range; on the START side
 *     the stated line, because no start cost is held (the typed start cash left
 *     on 2026-10-15, release 2 job A).
 *   - Time: on the START side the longest licence wait and the trade's years to
 *     pay back, the trade page's own figures, stamped (they stand where typed
 *     weeks and a typed payback stood); on the BUY side day one, the whole point
 *     of buying.
 *   - The risk read (where the danger sits on each path).
 *
 * The two columns share one visual language, the board's quiet label / display
 * figure treatment, with a warm-taupe divider between them. The BUY column's cash
 * figure is the trade page's own sale range in currency, stamped with where it was
 * read (data-src, data-kind) and called an estimate, because a sale price here is
 * never a real listing; a trade that cannot be priced prints the card's stated
 * line in the figure's place. Exactly the honesty the rest of the site keeps.
 *
 * Server component. Tokens only, mobile-first (the columns stack on a narrow
 * screen and sit side by side from sm), no raw hex, no em-dashes, no source-agency
 * names.
 */
import * as React from "react";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";
import { buyRangeText } from "@/lib/open/buy_side";
import { COPY } from "@/lib/spine/copy";
import type { BuyVsStart } from "@/lib/open/buy_vs_start";

/** One labelled row inside a column: a quiet label, a value, an optional note. */
function Row({
  label,
  value,
  note,
  prov,
  quiet = false,
}: {
  label: string;
  value: string;
  note?: string;
  /** Where the value was read, when it is a figure with a source (data-src, data-kind on the figure). */
  prov?: Provenance | null;
  /** A stated line where a figure would stand: body text, never the display figure's face. */
  quiet?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-cocoa-500">
        {label}
      </div>
      <div
        {...provAttrs(prov)}
        className={quiet ? "mt-0.5 text-sm leading-snug text-cocoa-700" : "mt-0.5 font-display text-lg font-semibold tabular-nums text-ink-900"}
      >
        {value}
      </div>
      {note ? (
        <div className="mt-0.5 text-[11px] leading-snug text-cocoa-500">{note}</div>
      ) : null}
    </div>
  );
}

export function BuyVsStartCompare({ page }: { page: BuyVsStart }) {
  /* The buy figure is the trade page's own sale range in currency with its stamp; a trade with no price prints the card's stated line in the
     figure's place, and no figure. */
  const buyRange = buyRangeText(page.buy);
  const B = COPY.buyOrStart;
  return (
    <section className="mt-8">
      {/* ONE card, not two half-cards. This was a pair of hand-rolled opaque
          panels stitched at a seam with sm:rounded-r-none / sm:border-r-0.
          Under the canonical card that stitch stops working: .atlas-card
          carries a seating shadow, and two shadowed halves butted together
          crease down the join. So the comparison becomes a single surface with
          an internal divider, which is also what it always was to a reader. */}
      <div className="atlas-card grid grid-cols-1 sm:grid-cols-2">
        {/* START column. */}
        <div className="border-b border-parchment p-5 sm:border-b-0 sm:border-r">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
            Start fresh
          </div>
          <p className="mt-1 text-sm leading-snug text-cocoa-700">
            Build it from nothing, your way.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Row label="Cash needed" value={B.startCash} note={B.startCashNote} quiet />
            {page.start.longestWait ? (
              <Row label={B.waitLabel} value={page.start.longestWait.figure} note={B.waitNote} prov={page.start.longestWait.prov} />
            ) : (
              <Row label={B.waitLabel} value={B.noWait} quiet />
            )}
            {page.start.payback ? (
              <Row label={B.paybackLabel} value={page.start.payback.figure} note={B.paybackNote} prov={page.start.payback.prov} />
            ) : null}
            <Row
              label="Where the risk sits"
              value="The ramp"
              note="no income until you find your feet, and most failures happen early"
            />
          </div>
        </div>

        {/* BUY column. */}
        <div className="p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
            Buy existing
          </div>
          <p className="mt-1 text-sm leading-snug text-cocoa-700">
            Step into a business that already runs.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <Row
              label="Cash needed"
              value={buyRange ?? (page.buy.line ?? "")}
              note={buyRange ? COPY.tradeWorth.basis : undefined}
              prov={buyRange ? page.buy.prov : null}
              quiet={!buyRange}
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

      {/* One quiet line, where a sale range stands: the buy side is an estimate (the struck "modeled" said plainly, masterplan step 02). */}
      {buyRange ? (
        <p className="mt-3 text-[11px] text-cocoa-500">
          The sale price is an estimate, not a real listing.
        </p>
      ) : null}
    </section>
  );
}
