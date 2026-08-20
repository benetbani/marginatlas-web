"use client";

/**
 * MakeItYoursPanel - the client island that wires the "make it yours" what-if
 * calculator to the signature spread on a business/cell page.
 *
 * The marquee interactive moment of a cell page (content-map: "a make-it-yours
 * adjustable calculator on business pages"). It is a thin "use client" wrapper
 * around two kit primitives that have to share one piece of state:
 *
 *   - <MakeItYours> holds the levers (rent / payroll / draw) and pushes the
 *     reader's derived owner take-home up through onYouChange.
 *   - <RangeStrip> plots that take-home on the take-home spread, with the live
 *     "you" marker landing where the reader's scenario sits.
 *
 * The two only meet here, in the page's client layer, because the take-home the
 * calculator derives is exactly the figure the strip's "you" marker reads. The
 * server page hands down the canonical figures (all real, all already on the
 * page) and the panel keeps the one piece of you-state.
 *
 * HONEST: the page only mounts this panel when a real owner take-home AND a real
 * typical revenue are held (see the null guard below). The masthead's signature
 * spread is REVENUE-based, so this panel plots its own simple TAKE-HOME spread
 * built symmetrically around the typical take-home, so the reader's scenario
 * lands on a take-home axis (what they keep), not a revenue one. No fabricated
 * percentiles: the band is a transparent, evenly-fanned read of the one real
 * take-home figure, labelled as a take-home spread.
 *
 * Constraint-safe: tokens only (no raw hex / px / ms), no em-dashes, no
 * source-agency names, USD figures. This is an extra interactive panel, NOT a
 * content-map section, so it registers no gated section id.
 */
import * as React from "react";
import {
  MakeItYours,
  type MakeItYoursCanonical,
  RangeStrip,
} from "@/components/kit";

export type MakeItYoursPanelProps = {
  /** The canonical (typical) figures the what-if bends away from. revenue,
   *  takeHome and marginPct are required; rent / staff / draw levers render
   *  only where the page holds that figure. All serializable numbers, since a
   *  server page passes this down to this client island. */
  canonical: MakeItYoursCanonical;
  className?: string;
};

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** Compact USD, defined IN the client island. A function cannot be passed from
 *  a server component to a client component (RSC forbids non-serializable
 *  props), so the formatter lives here, not on the page, and only the canonical
 *  numbers cross the server-client boundary. Mirrors the cell page's `usd`. */
function fmtUsd(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  const v = Math.round(n);
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v}`;
}

export function MakeItYoursPanel({
  canonical,
  className,
}: MakeItYoursPanelProps) {
  // The one shared piece of state: the reader's derived take-home. Seeds on the
  // canonical so the strip's "you" marker sits on the typical until the reader
  // moves a lever, then tracks every adjustment MakeItYours pushes up.
  const [you, setYou] = React.useState<number>(canonical.takeHome);

  // A simple TAKE-HOME spread around the typical take-home. The masthead's
  // signature strip is revenue-based, so this panel plots its own take-home
  // axis: an evenly-fanned band centred on the one real take-home figure, kept
  // non-negative so a thin take-home never fans below zero. This is a plain,
  // honest read of the held figure (a spread shown around it), not invented
  // percentiles, so the reader's "you" marker lands on what-they-keep.
  const th = canonical.takeHome;
  const lo10 = Math.max(0, th * 0.55);
  const lo25 = Math.max(0, th * 0.78);
  const hi75 = th * 1.28;
  const hi90 = th * 1.6;

  return (
    <section className={className} aria-label="Make this business yours">
      <MakeItYours
        canonical={canonical}
        format={fmtUsd}
        onYouChange={setYou}
      />
      {/* THE STRIP NEEDED A GROUND. Photographed at 1440x900 on
         /gb/london/restaurants at scroll 900: the eyebrow, the track, $26K /
         $48K / $77K and the caption all painted straight onto the fixed
         photograph, with no surface anywhere between them and it. The left of
         the strip reads because the crop is pale sea there and the right end,
         TOP 10% and $77K, runs onto the cliff and loses most of its contrast.

         Same rule and same fix as CostDrivers in this commit's sibling: content
         lives in cards, because the card is what sits over the picture. The
         accordion directly above this is already carded, so the panel was half
         on a surface and half not. */}
      <div className="atlas-card mt-4 px-5 py-5 md:px-7 md:py-6">
        <RangeStrip
          label="Owner take-home spread"
          p10={lo10}
          p25={lo25}
          p50={th}
          p75={hi75}
          p90={hi90}
          format={fmtUsd}
          /* THE COMMENT ABOVE ALREADY SAID THIS AND THE RENDER IGNORED IT. It
             reads "a spread shown around it, NOT invented percentiles", and then
             these four multiples of the take-home were fed to a strip whose end
             labels are hardcoded "Bottom 10%" and "Top 10%". The intent was
             honest; the component overrode it. `basis` makes the strip say what
             this block always meant. */
          basis="modelled"
          you={isNum(you) ? you : null}
          caption="Where your scenario lands on the spread of what owners keep. Drag a lever above and the dark marker moves with you."
        />
      </div>
    </section>
  );
}
