/**
 * THE CARD'S ONE FIGURE, at the focal rung, with the words that say what it is (PART 4: one figure at 30 a section card). Moved out
 * of country-view.tsx (masterplan step 23) so a card in its own file draws the same focal; a figure with a source stamps it
 * (src/lib/spine/provenance.ts).
 */
import * as React from "react";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";

export function Focal({ figure, words, placement, prov }: { figure: string; words: string; placement?: string | null; prov?: Provenance | null }) {
  return (
    <div className="mb-4">
      <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]" {...provAttrs(prov)}>{figure}</div>
      <p data-focal-words="" className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{words}</p>
      {/* The site's one placement sentence (placement.ts), under the figure's words, where the section's figure stands on a scale
          of the countries (PART 6, "Higher than {n} countries in ten."). */}
      {placement ? <p data-placement="" className="mt-1 text-[length:var(--t-micro)] leading-4 text-[var(--c-ink2)]">{placement}</p> : null}
    </div>
  );
}
