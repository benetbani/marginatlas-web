/**
 * src/components/open/OpeningComparisons.tsx
 *
 * "Cheaper or dearer to open elsewhere" lays the SAME business out across a few
 * peer places, each row a place with its flag and the total to open there,
 * linking to that place's full cell page. It speaks the board's row language: the
 * warm-taupe hairline between rows, a display figure right-aligned on the digit,
 * and self-omits when its array is empty.
 *
 * WHAT LEFT ON 2026-10-05 (his ruling 11, "no composite, ever"; masterplan step
 * 02): the 0..100 break-in badge on every row, and the second strip, "Easier or
 * harder to break into here", whose rows held nothing but that badge. The data
 * builder still resolves both (an audit script reads them); nothing prints them.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtUSD } from "@/components/board/format";
import type { OpeningPage, PeerPlace } from "@/lib/open/opening_page";

/** One row of the "same business elsewhere" strip: flag, place, total. */
function PeerRow({ peer }: { peer: PeerPlace }) {
  return (
    <Link
      href={peer.href}
      className="flex items-baseline gap-3 border-t border-parchment py-3 transition-colors first:border-t-0 first:pt-0 hover:bg-white"
    >
      <span className="shrink-0 translate-y-0.5">
        <CountryFlag iso2={peer.country.toUpperCase()} className="w-5" />
      </span>
      <span className="min-w-0 flex-1 font-display text-[15px] font-semibold text-ink-900 md:text-base">
        {peer.place}
      </span>
      <span className="shrink-0 text-right font-display text-[15px] font-semibold tabular-nums text-ink-900 md:text-base">
        {fmtUSD(peer.totalToOpenUsd)}
      </span>
    </Link>
  );
}

export function OpeningComparisons({ page }: { page: OpeningPage }) {
  const { sameBusinessElsewhere } = page.comparisons;
  // Empty: render nothing at all, no empty heading.
  if (sameBusinessElsewhere.length === 0) return null;

  return (
    <div className="mt-10">
      <section>
        <SectionEyebrow>Cheaper or dearer to open elsewhere</SectionEyebrow>
        <p className="mt-1 text-sm text-cocoa-700">
          The same business, what it costs to open in other places.
        </p>
        <div className="mt-3">
          {sameBusinessElsewhere.map((peer) => (
            <PeerRow key={peer.href} peer={peer} />
          ))}
        </div>
      </section>
    </div>
  );
}
