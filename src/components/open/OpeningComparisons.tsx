/**
 * src/components/open/OpeningComparisons.tsx
 *
 * "The same business elsewhere" lays the SAME business out across a few peer
 * places, each row a place with its flag and what a typical owner keeps a year
 * there (the across page's own column figure, stamped), linking to that place's
 * full cell page. Until 2026-10-15 each row printed a typed capital adjusted for
 * the place (release 2 job A); the take-home is the held figure in its place. It speaks the board's row language: the
 * warm-taupe hairline between rows, a display figure right-aligned on the digit,
 * and self-omits when its array is empty.
 *
 * WHAT LEFT ON 2026-10-05 (his ruling 11, "no composite, ever"; masterplan step
 * 02): the 0..100 break-in badge on every row, and the second strip, "Easier or
 * harder to break into here", whose rows held nothing but that badge. The data
 * builder stopped resolving both on 2026-10-15: the scores stood on the typed
 * capital.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtUSD } from "@/components/board/format";
import { provAttrs } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import type { OpeningPage, PeerPlace } from "@/lib/open/opening_page";

/** One row of the "same business elsewhere" strip: flag, place, owner take-home. */
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
      <span
        {...provAttrs(peer.prov)}
        className="shrink-0 text-right font-display text-[15px] font-semibold tabular-nums text-ink-900 md:text-base"
      >
        {fmtUSD(peer.takeHomeUsd)}
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
        <SectionEyebrow>{COPY.opening.peersHead}</SectionEyebrow>
        <p className="mt-1 text-sm text-cocoa-700">
          {COPY.opening.peersLine}
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
