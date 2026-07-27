/**
 * src/components/spine2/Band.tsx
 *
 * The one dark signature moment per page: a single takeaway sentence paired
 * with the page's single most important figure. Identical anatomy on all
 * three mockups; the figure size is the only knob (64px on cell, 58px on
 * city/country). BATCH-A.
 *
 * The component ENFORCES NOTHING about frequency , one-per-page is the
 * template's job (BATCH-A verdict, verbatim).
 *
 * Per BATCH-A, exactly:
 *   - whole-component self-omit (M9) when `takeaway` is missing , a
 *     signature band with no sentence is decoration;
 *   - the figure side omits ALONE: `figure` null lets the sentence take the
 *     full width; `figureSub` requires `figure`;
 *   - text-on-fill (M4): white text on --ink, lab at white/60, sub at
 *     white/70, figure in --terra-bright , all measured-safe on ink. No
 *     --muted / --ink-2 token is ever used inside the band (they fail on
 *     ink); the inline colors below are the mockups' own values, verbatim.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface BandProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The sentence. */
  takeaway: string | null;
  /** "1 in 4", "2.1x", "$36". */
  figure: string | null;
  /** "pay the owner a real living". Requires `figure`. */
  figureSub: string | null;
  /** The one size knob: 64 on cell, 58 on city/country. */
  figureSize?: number;
}

const Band = React.forwardRef<HTMLDivElement, BandProps>(
  ({ takeaway, figure, figureSub, figureSize = 58, className, ...props }, ref) => {
    if (takeaway == null || takeaway === "") return null;

    const hasFigure = figure != null && figure !== "";
    const sentence = (
      <div>
        <div className="lab" style={{ marginBottom: 14 }}>
          One thing to remember
        </div>
        <h3 style={{ fontSize: 23, lineHeight: 1.32, maxWidth: "34ch", color: "var(--white)" }}>
          {takeaway}
        </h3>
      </div>
    );

    return (
      <div ref={ref} className={cn("band", className)} {...props}>
        {hasFigure ? (
          <div className="grid g12" style={{ gap: 36, alignItems: "center" }}>
            {sentence}
            <div style={{ textAlign: "center" }}>
              <div
                className="fig"
                style={{
                  fontSize: figureSize,
                  fontWeight: 600,
                  lineHeight: 0.9,
                  color: "var(--terra-bright)",
                }}
              >
                {figure}
              </div>
              {figureSub != null && figureSub !== "" ? (
                <div style={{ color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 10 }}>
                  {figureSub}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          sentence
        )}
      </div>
    );
  },
);
Band.displayName = "Band";

export { Band };
