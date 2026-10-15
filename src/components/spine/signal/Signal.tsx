/**
 * THE SIGNAL (plan 2026-10-13 country-page-journey, Task 2; spec section 4; his ruling of 2026-10-13, "Green to red, only in the signal").
 * One solid triangle whose angle carries the state (src/lib/spine/signal.ts, SIGNAL_ANGLE): up very good, tilted up-left good, pointing left
 * middle, down-left poor, pointing down very poor. Its colour repeats the angle, from the five tokens of ./tokens.ts. Never colour alone: the
 * angle carries the state, the accessible label and the title say its word (COPY.journey.signal.words), and the page's key line says what the
 * angles mean. 16px beside a row's figure, 20px beside a section's 30px figure, its own box right after the figure. The polygon is a narrow
 * arrowhead, its apex about 39 degrees (final review C1, 2026-10-15: the near-equilateral drawing looked alike every 120 degrees, so poor
 * read as very good and good as very poor), and its centroid is the box's centre, so every angle turns in place.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { SIGNAL_ANGLE, type SignalState } from "@/lib/spine/signal";
import type { MeasureKey } from "@/lib/spine/owner_direction";
import { SIGNAL_FILL } from "./tokens";

export function Signal({ state, measure, size = "row" }: { state: SignalState; measure: MeasureKey; size?: "row" | "focal" }) {
  const word = COPY.journey.signal.words[state];
  return (
    <span data-signal={String(state)} data-measure={measure} role="img" aria-label={word} title={word} className={`inline-flex shrink-0 self-center ${size === "focal" ? "h-5 w-5" : "h-4 w-4"}`}>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" className="h-full w-full">
        <polygon points="8,0.5 12,11.75 4,11.75" transform={`rotate(${SIGNAL_ANGLE[state]} 8 8)`} fill={SIGNAL_FILL[state]} />
      </svg>
    </span>
  );
}

/** THE PAGE'S ONE KEY (spec section 4: "each page carries a one-line key"): what the angles mean. */
export function SignalKey() {
  return <p data-signal-key="" data-line="" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{COPY.journey.signal.key}</p>;
}
