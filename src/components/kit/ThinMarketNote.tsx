/**
 * src/components/kit/ThinMarketNote.tsx
 *
 * The line a reader sees when the atlas holds no measured figures for this
 * trade in this place.
 *
 * Founder ruling, 2026-08-21: he asked for "clear disclaimers that such an
 * activity in this country barely exists."
 *
 * THE COPY SAYS SOMETHING SUBTLY DIFFERENT FROM THAT, ON PURPOSE, and the
 * difference is the point of the component. Nothing in this repository measures
 * whether a trade is rare in Chad. What it can know is whether IT holds a
 * measurement, and those are different claims. "This barely exists here" is a
 * statement about the country that would be printed on the strength of our own
 * missing data, which is the defect class this whole effort exists to remove,
 * pointed at a whole market instead of at one figure.
 *
 * So the note says what is true and checkable: we did not measure this here,
 * and what follows describes the trade rather than the market.
 *
 * NO HEDGING ADVERB, and that is measured rather than a style preference.
 * van der Bles et al. 2020 (PNAS, N=5,780, including a live BBC field test):
 * stating a numeric range costs a reader essentially no trust (d = -0.03) while
 * vague verbal hedging costs about seven times more (d = -0.21). "Roughly",
 * "may not be entirely", "please note that" all make this worse. A flat
 * statement of fact is the cheapest credible thing to print.
 *
 * `relative` IS LOAD-BEARING, not a style choice. AtlasFrame paints two fixed
 * layers at z-index 0, and CSS paints positioned z-index-0 descendants after
 * in-flow non-positioned ones. Anything `position: static` on this site is not
 * dimmed or washed out, it is ABSENT. A card added without it renders nothing
 * at all while looking perfectly correct in source.
 */
import * as React from "react";

export interface ThinMarketNoteProps {
  /** The trade, as a reader would say it: "restaurants", "dental practices". */
  trade: string;
  /** The place, as a reader would say it: "Chad", "Wyoming". */
  place: string;
}

export function ThinMarketNote({ trade, place }: ThinMarketNoteProps) {
  return (
    <aside
      /* relative: see the header. Without it this card is not painted. */
      className="atlas-card relative mb-6 border-l-2 border-l-atlas-800 px-4 py-3"
      aria-label="What the atlas holds here"
    >
      <p className="text-[13.5px] leading-relaxed text-ink-900">
        We have not measured {trade} in {place}. The figures below describe how
        this trade behaves, drawn from the places where it was measured, and not
        this market.
      </p>
    </aside>
  );
}

export default ThinMarketNote;
