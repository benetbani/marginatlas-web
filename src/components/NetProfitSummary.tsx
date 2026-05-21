/**
 * Plan v23 Part 2 — collapsed net-profit waterfall.
 *
 * Replaces the previous full waterfall with a SINGLE-LINE summary
 * ("Owner take-home: $89K") + an expand affordance that reveals the
 * full waterfall on click. Per founder: stop slapping the visitor
 * with numbers; reveal them when asked.
 *
 * Client component because it owns the expanded/collapsed state.
 */
"use client";
import { useState } from "react";
import { Money } from "@/components/Money";
import { NetProfitWaterfall } from "@/components/NetProfitWaterfall";

type Props = {
  iso2: string;
  geoId: string | null;
  industryId: string | null;
  sectorId: string | null;
  grossRevenue: number | null;
  payroll: number | null;
  /** The bottom-line take-home estimate. If null, hides the section. */
  takeHome: number | null;
};

export function NetProfitSummary({
  iso2,
  geoId,
  industryId,
  sectorId,
  grossRevenue,
  payroll,
  takeHome,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!takeHome || takeHome <= 0 || !grossRevenue || grossRevenue <= 0) {
    return null;
  }

  return (
    <section id="net-profit" className="py-12 md:py-16">
      <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 mb-3">
        The bottom line
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-ink-900 leading-[1.08] max-w-3xl">
        What ends up in the owner&apos;s pocket
      </h2>

      <div className="mt-8 md:mt-10 flex items-baseline gap-6 md:gap-10 flex-wrap">
        <div>
          <div className="text-xs md:text-sm uppercase tracking-[0.18em] text-cocoa-700/60 font-semibold mb-2">
            Take-home
          </div>
          <div className="font-display text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-atlas-700 leading-none">
            <Money usd={takeHome} />
          </div>
          <div className="mt-2 text-sm text-cocoa-700/70 italic">
            estimate, after typical costs and taxes
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="font-display text-base md:text-lg text-atlas-700 hover:text-atlas-900 italic border-b border-atlas-200 hover:border-atlas-500 pb-0.5 transition-colors"
        >
          {open ? "Hide the breakdown" : "See where every dollar goes →"}
        </button>
      </div>

      {open && (
        <div className="mt-8 md:mt-10">
          <NetProfitWaterfall
            iso2={iso2}
            geoId={geoId}
            industryId={industryId}
            sectorId={sectorId}
            grossRevenue={grossRevenue}
            payroll={payroll}
          />
        </div>
      )}
    </section>
  );
}
