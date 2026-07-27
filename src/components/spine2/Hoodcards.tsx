/**
 * src/components/spine2/Hoodcards.tsx
 *
 * The districts as one framed column (city 10): glyph, name plus a one-line
 * character, a rent-multiple bar on a shared track, and the figure. Each row
 * is a DOOR or a FACT per PORT-CONTRACT M1:
 *
 *   href present -> <a>, chevron (stylesheet .hoodcards>a .nm::after),
 *                   hover lift + figure accent;
 *   href absent  -> <span>, no chevron, name in --ink-2, no hover. The
 *                   target page does not exist in this build.
 *
 * The stylesheet's v9 layer states the grid on `.hoodcards>*` precisely so
 * both elements share ONE grid; this component renders both from the same
 * inner markup. At launch every row is a fact and the block must read as a
 * data table, not broken nav (verified: city-mock/10, all six rows facts).
 *
 * M5: the terracotta bar is DERIVED, the minimum-figure row (the cheapest
 * way onto a high street) takes .hi. Never an isHighlighted flag from data.
 *
 * Self-omit (M9, M1's own rule): a row is never omitted for want of a link,
 * only for want of a figure. `blurb` absent renders a single-line row.
 * Section omits below 2 districts.
 */
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export interface HoodReading {
  name: string;
  /** One-line character; absent renders a single-line row. */
  blurb?: string;
  glyph?: GlyphId;
  /** ALWAYS rendered when present (M1); null omits the whole row. */
  figure: string | null;
  /** Bar width on the shared track; the bar omits when absent. */
  barPct?: number;
  /** ABSENT means the district page does not exist in this build (M1). */
  href?: string;
}

export interface HoodcardsProps extends React.HTMLAttributes<HTMLDivElement> {
  readings: HoodReading[];
}

/** The figure's numeric datum ("x1.1" -> 1.1), for the derived minimum. */
function figureValue(figure: string): number | null {
  const s = figure.replace(/[^0-9.]/g, "");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const Hoodcards = React.forwardRef<HTMLDivElement, HoodcardsProps>(
  ({ readings, className, ...props }, ref) => {
    const rows = readings.filter((r) => r.figure != null && r.figure !== "");
    if (rows.length < 2) return null;

    // M5: the accent marks the minimum figure, derived from the figures the
    // rows themselves print, never passed in.
    let minIdx = -1;
    let minVal = Infinity;
    rows.forEach((r, i) => {
      const v = figureValue(r.figure as string);
      if (v != null && v < minVal) {
        minVal = v;
        minIdx = i;
      }
    });

    return (
      <div ref={ref} className={cn("hoodcards", className)} {...props}>
        {rows.map((r, i) => {
          const inner = (
            <>
              {r.glyph ? <GlyphIcon id={r.glyph} size={18} /> : <span />}
              <span className="nm">
                {r.name}
                {r.blurb ? <span className="s">{r.blurb}</span> : null}
              </span>
              {r.barPct != null && Number.isFinite(r.barPct) ? (
                <span className="bar">
                  <i
                    className={i === minIdx ? "hi" : undefined}
                    style={{ width: `${Math.max(0, Math.min(100, r.barPct))}%` }}
                  />
                </span>
              ) : (
                <span aria-hidden />
              )}
              <span className="v">{r.figure}</span>
            </>
          );
          return r.href ? (
            <Link href={r.href} key={i}>
              {inner}
            </Link>
          ) : (
            <span key={i}>{inner}</span>
          );
        })}
      </div>
    );
  },
);
Hoodcards.displayName = "Hoodcards";

export { Hoodcards };
