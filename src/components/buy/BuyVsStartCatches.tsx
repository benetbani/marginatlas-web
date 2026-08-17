/**
 * src/components/buy/BuyVsStartCatches.tsx
 *
 * The honest catch on each side, spelled out so neither path is sold blind. Two
 * quiet blocks, START and BUY, each pairing the upside with the catch in the same
 * breath: build cheap but wait through the ramp, or buy cash flow but pay for
 * goodwill and inherit the problems. This is the section that keeps the page from
 * ever reading as a sales pitch for one side.
 *
 * The copy comes straight off the data builder's catches object, so the wording
 * is reviewed in one place and reads identically everywhere.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { BuyVsStart } from "@/lib/open/buy_vs_start";

/** One side's honest read: a heading, the upside, and the catch. */
function CatchBlock({
  heading,
  upside,
  catchText,
}: {
  heading: string;
  upside: string;
  catchText: string;
}) {
  // Capitalize the first letter of each clause so they read as sentences without
  // hand-editing the builder's lower-case fragments.
  const cap = (s: string) => (s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s);
  return (
    // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
    <div className="atlas-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-atlas-700">
        {heading}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-900">
        <span className="font-semibold text-moss-700">The upside.</span>{" "}
        {cap(upside)}.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
        <span className="font-semibold text-clay-700">The catch.</span>{" "}
        {cap(catchText)}.
      </p>
    </div>
  );
}

export function BuyVsStartCatches({ page }: { page: BuyVsStart }) {
  const { catches } = page;
  return (
    <section className="mt-10">
      <SectionEyebrow>The honest read on each side</SectionEyebrow>
      <p className="mt-1 text-sm text-cocoa-700">
        Neither path is free. Here is what you trade for what.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CatchBlock
          heading="Start fresh"
          upside={catches.startUpside}
          catchText={catches.startCatch}
        />
        <CatchBlock
          heading="Buy existing"
          upside={catches.buyUpside}
          catchText={catches.buyCatch}
        />
      </div>
    </section>
  );
}
