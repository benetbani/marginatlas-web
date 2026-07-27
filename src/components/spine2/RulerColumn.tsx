/**
 * src/components/spine2/RulerColumn.tsx
 *
 * The eight+readcol merge (BATCH-C verdict: readcol IS eight with a bar
 * instead of a dot). One framed zebra column with an icon rail, a ruler
 * header carrying the scale poles, and per-row name | visual | value.
 *
 *   mark: "dot"  -> the `.eight` scorecard lattice (dot vs a mid reference)
 *   mark: "bar"  -> the `.readcol` sorted column (left-anchored track bar)
 *
 * Contract points carried from the triage:
 * - M5: the accent is DERIVED, never a flag from data. `accent` is either
 *   { rule: "extreme", hi, lo } (eight: p >= hi || p <= lo) or
 *   { rule: "atOrAbove", threshold } (readcol: pos >= threshold).
 * - EIGHT_EXTREME = { hi: 90, lo: 10 } is THE one constant resolving the
 *   city-85/15 vs country-90/10 discrepancy in the contract's favour (M5's
 *   own worked example ratifies 90/10).
 * - M7: `caption` is a FUNCTION of the accented set, so the sentence and the
 *   marks interpolate the same derivation and can never drift. Dot mode
 *   renders it in the `.cap` footer; bar mode as the trailing `.note`.
 * - M9 self-omit: a row without a `value` never renders. Dot mode: a row
 *   with a value but a null `pos` keeps its figure and renders the rail
 *   empty (base line only, no dot) , the fact-not-door analog. Bar mode: a
 *   null `pos` omits the row (both columns are the row). The whole section
 *   omits under 3 renderable readings , two dots on a ruler is a comparison
 *   pretending to be a distribution.
 * - `sort: "asc"` orders easiest-first FROM the data (BATCH-A scale note:
 *   ordering is sorted by the component so the caption cannot lie).
 * - M4: bars carry no in-fill text; the value sits in its own column. The
 *   v10 rule (readcol's value stays ink, the bar alone marks) lives in the
 *   stylesheet and this component renders nothing that could override it.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { ChartFigure } from "./ChartFigure";
import { RowLattice } from "./RowLattice";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

/**
 * M5 + M7: the ONE constant the dot derivation, the caption sentence and any
 * page prose interpolate. City's 85/15 variant is superseded (PORT-CONTRACT
 * M5 ratifies 90/10; the city code's own comment claimed "top or bottom
 * tenth" while marking at 85/15).
 */
export const EIGHT_EXTREME = { hi: 90, lo: 10 } as const;

export type RulerReading = {
  glyph?: GlyphId;
  label: string;
  /** Inline quiet qualifier ("a year"); eight uses it, readcol does not. */
  sub?: string;
  /** 0 to 100 on the stated scale; null = no comparison mark (see M9 above). */
  pos: number | null;
  /** Printed figure; null/missing row never renders. */
  value: string | null;
};

export type RulerAccent =
  | { rule: "extreme"; hi: number; lo: number }
  | { rule: "atOrAbove"; threshold: number };

/** The single derivation the marks AND the caption read (M5/M7). */
export function isAccented(r: RulerReading, accent: RulerAccent): boolean {
  if (r.pos == null) return false;
  return accent.rule === "extreme"
    ? r.pos >= accent.hi || r.pos <= accent.lo
    : r.pos >= accent.threshold;
}

export interface RulerColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  readings: RulerReading[];
  /** The ruler header poles; `mid` names the reference (eight's world median). */
  scale: { left: string; mid?: string; right: string };
  /** eight = dot vs midline reference; readcol = left-anchored bar. */
  mark: "dot" | "bar";
  /** readcol sorts easiest first; eight keeps given order. Default "none". */
  sort?: "asc" | "none";
  accent: RulerAccent;
  /** M7: rendered from the SAME accented set the marks derive from. */
  caption?: (accented: RulerReading[]) => React.ReactNode;
  /** Dot mode only: the right-hand `.cap` span ("against every country we hold"). */
  captionSecondary?: React.ReactNode;
  /** Header text over the name column. */
  readingLabel?: string;
  /** Header text over the value column ("value" / "where it lands"). */
  valueLabel?: string;
  /**
   * Cosmetic width of the value column. Dot mode feeds the stylesheet's
   * `--val-col` (default 78); bar mode's 92px is fixed in the stylesheet.
   */
  valueColPx?: number;
}

const RulerColumn = React.forwardRef<HTMLDivElement, RulerColumnProps>(
  (
    {
      readings,
      scale,
      mark,
      sort = "none",
      accent,
      caption,
      captionSecondary,
      readingLabel = "reading",
      valueLabel = "value",
      valueColPx,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const renderable = readings.filter(
      (r) =>
        r.value != null &&
        r.value !== "" &&
        (mark === "dot" || r.pos != null),
    );
    if (renderable.length < 3) return null;

    const rows =
      sort === "asc"
        ? [...renderable].sort(
            (a, b) => (a.pos ?? Infinity) - (b.pos ?? Infinity),
          )
        : renderable;

    const accented = rows.filter((r) => isAccented(r, accent));

    const headerBand = (
      <div className={mark === "dot" ? "rulerhd" : "rhd"}>
        <span />
        <span>{readingLabel}</span>
        <span className="sc">
          <span>{scale.left}</span>
          {scale.mid ? <span>{scale.mid}</span> : null}
          <span>{scale.right}</span>
        </span>
        <span style={{ textAlign: "right" }}>{valueLabel}</span>
      </div>
    );

    const mergedStyle =
      mark === "dot" && valueColPx != null
        ? ({ "--val-col": `${valueColPx}px`, ...style } as React.CSSProperties)
        : style;

    const frame = (
      <RowLattice
        ref={ref}
        frame={mark === "dot" ? "eight" : "readcol"}
        headerBand={headerBand}
        className={className}
        style={mergedStyle}
        {...props}
      >
        {rows.map((r, i) => {
          const hi = isAccented(r, accent);
          return mark === "dot" ? (
            <div className="e" key={i}>
              {r.glyph ? <GlyphIcon id={r.glyph} size={18} /> : <span />}
              <span className="nm">
                {r.label}
                {r.sub ? <span className="s">{r.sub}</span> : null}
              </span>
              <span className="ax">
                <span className="base" />
                {r.pos != null ? (
                  <>
                    <span className="nat" />
                    <span
                      className={cn("dot", hi && "hi")}
                      style={{ left: `${r.pos}%` }}
                    />
                  </>
                ) : null}
              </span>
              <span className="v fig">{r.value}</span>
            </div>
          ) : (
            <div className={cn("rr", hi && "hard")} key={i}>
              {r.glyph ? <GlyphIcon id={r.glyph} size={18} /> : <span />}
              <span className="nm">
                {r.label}
                {r.sub ? <span className="s">{r.sub}</span> : null}
              </span>
              <span className="tk">
                <i style={{ width: `${r.pos}%` }} />
              </span>
              <span className="v fig">{r.value}</span>
            </div>
          );
        })}
        {mark === "dot" && caption ? (
          <div className="cap">
            <span>{caption(accented)}</span>
            {captionSecondary != null ? <span>{captionSecondary}</span> : null}
          </div>
        ) : null}
      </RowLattice>
    );

    if (mark === "bar" && caption) {
      /* Bar mode's caption is a HYBRID: an encoding clause plus the finding
         ("the N in terracotta are the ones that will actually cost you time or
         money here"). It states what the chart SHOWS, so it becomes the
         figure's description , I-5's taxonomy, applied.

         DOT MODE IS DELIBERATELY NOT WRAPPED. Its footer key carries the mark rule
         and its scope ("a terracotta dot is the top or bottom tenth worldwide"
         / "against every country we hold") , pure encoding, no finding. Making
         that the sole <figcaption> would tell assistive tech that the legend is
         what the chart shows. Country ch02 needs a sentence saying what it
         shows; that is copy, and copy is the founder's (backlog A5). */
      return (
        <ChartFigure
          caption={caption(accented)}
          captionClassName="note"
          captionStyle={{ marginTop: 14, maxWidth: "74ch" }}
        >
          {frame}
        </ChartFigure>
      );
    }
    return frame;
  },
);
RulerColumn.displayName = "RulerColumn";

export { RulerColumn };
