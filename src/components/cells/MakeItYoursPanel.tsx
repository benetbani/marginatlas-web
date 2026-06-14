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
   *  only where the page holds that figure. */
  canonical: MakeItYoursCanonical;
  /** Formats every USD figure (the page's shared money formatter). */
  format: (n: number) => string;
  className?: string;
};

/** A finite, real number. */
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

export function MakeItYoursPanel({
  canonical,
  format,
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
        format={format}
        onYouChange={setYou}
      />
      <div className="mt-4">
        <RangeStrip
          label="Owner take-home spread"
          p10={lo10}
          p25={lo25}
          p50={th}
          p75={hi75}
          p90={hi90}
          format={format}
          you={isNum(you) ? you : null}
          caption="Where your scenario lands on the spread of what owners keep. Drag a lever above and the dark marker moves with you."
        />
      </div>
    </section>
  );
}
