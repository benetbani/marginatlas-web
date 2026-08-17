/**
 * src/components/open/OpeningComparisons.tsx
 *
 * Two compact contrast strips, each shown ONLY when its data is non-empty:
 *
 *   1. "Cheaper or dearer to open elsewhere" lays the SAME business out across a
 *      few peer places, each row a place with its flag, the total to open there,
 *      and a small break-in band badge, linking to that place's full cell page.
 *   2. "Easier or harder to break into here" lays a few OTHER common businesses
 *      in THIS place out, each row a business with its band badge, linking to
 *      that business's full cell page.
 *
 * Both strips speak the board's row language: the same warm-taupe hairline
 * between rows, a quiet token badge, a display figure right-aligned on the digit.
 * The band badge reuses the EXACT moss / atlas / clay tones the break-in masthead
 * uses, so a reader learns one color scale and reads it everywhere. Each whole
 * strip self-omits when its array is empty, so the page never shows a one-row
 * "comparison" or an apology for missing data.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtUSD } from "@/components/board/format";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { breakInWord } from "@/lib/scores/band_labels";
import { bandPillTone } from "@/lib/scores/band_tone";
import type {
  OpeningPage,
  PeerPlace,
  OtherBusinessHere,
} from "@/lib/open/opening_page";


/** A small break-in band badge, or nothing when the place/business is unscored. */
function BandBadge({
  score,
  band,
}: {
  score: number | null;
  band: BreakInBand | null;
}) {
  if (score == null || band == null) return null;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandPillTone(
        band,
      )}`}
    >
      <span className="tabular-nums">{score}</span>
      <span>{breakInWord(band)}</span>
    </span>
  );
}

/** One row of the "same business elsewhere" strip: flag, place, total, badge. */
function PeerRow({ peer }: { peer: PeerPlace }) {
  return (
    <Link
      href={peer.href}
      className="flex items-baseline gap-3 border-t border-parchment py-3 transition-colors first:border-t-0 first:pt-0 hover:bg-cream-50"
    >
      <span className="shrink-0 translate-y-0.5">
        <CountryFlag iso2={peer.country.toUpperCase()} className="w-5" />
      </span>
      <span className="min-w-0 flex-1 font-display text-[15px] font-semibold text-ink-900 md:text-base">
        {peer.place}
      </span>
      <BandBadge score={peer.score} band={peer.band} />
      <span className="shrink-0 text-right font-display text-[15px] font-semibold tabular-nums text-ink-900 md:text-base">
        {fmtUSD(peer.totalToOpenUsd)}
      </span>
    </Link>
  );
}

/** One row of the "other businesses here" strip: business, badge. */
function OtherRow({ other }: { other: OtherBusinessHere }) {
  return (
    <Link
      href={other.href}
      className="flex items-baseline gap-3 border-t border-parchment py-3 transition-colors first:border-t-0 first:pt-0 hover:bg-cream-50"
    >
      <span className="min-w-0 flex-1 font-display text-[15px] font-semibold text-ink-900 md:text-base">
        {other.business}
      </span>
      <BandBadge score={other.score} band={other.band} />
    </Link>
  );
}

export function OpeningComparisons({ page }: { page: OpeningPage }) {
  const { sameBusinessElsewhere, otherBusinessesHere } = page.comparisons;
  const hasPeers = sameBusinessElsewhere.length > 0;
  const hasOthers = otherBusinessesHere.length > 0;

  // Both strips empty: render nothing at all, no empty heading.
  if (!hasPeers && !hasOthers) return null;

  return (
    <div className="mt-10 flex flex-col gap-10">
      {hasPeers ? (
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
      ) : null}

      {hasOthers ? (
        <section>
          <SectionEyebrow>Easier or harder to break into here</SectionEyebrow>
          <p className="mt-1 text-sm text-cocoa-700">
            Other common businesses in {page.placeName}, by how hard they are to
            break into.
          </p>
          <div className="mt-3">
            {otherBusinessesHere.map((other) => (
              <OtherRow key={other.href} other={other} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
