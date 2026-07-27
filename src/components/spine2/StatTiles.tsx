/**
 * src/components/spine2/StatTiles.tsx
 *
 * The shared figure-tile grid, the BATCH-C merge that collapses four
 * singletons into one component: `tang` (cell 05), `worlds` (cell 15),
 * `statcluster` (city 04) and the `wealth` figs strip (city 05). One
 * skeleton, a bordered grid of big-number tiles; the scoped stylesheet
 * carries each variant's chrome, keyed on the wrapper class this component
 * DERIVES from `columns` + `align`:
 *
 *   columns 3, center  -> .tang         (centred, little pictures)
 *   columns 3, left    -> .worlds       (tones + sentence captions)
 *   columns 2          -> .statcluster  (compact 2-up figures)
 *   columns 4          -> .figs         (the wealth strip; only styled when
 *                                        rendered INSIDE .wealth, which is
 *                                        how Wealth uses it)
 *
 * M7 (caption coupling): a pic is a little picture OF the tile's own number,
 * so its input DERIVES from the figure the tile prints. `fill`/`disc` take
 * only a denominator, the numerator is parsed from `big`; `week` takes
 * nothing, the on-count IS the tile's figure. A pic can never disagree with
 * the number above it.
 *
 * M5/A4: tone 'answer' is the accent and appears on AT MOST ONE tile,
 * asserted (throw in dev, console.error + demote in prod).
 *
 * Self-omit (M9): a tile missing `big` does not render and the grid reflows
 * (per-tile borders). A pic whose derivation fails renders the number
 * without the picture, the picture is garnish, the figure is the row.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export type StatTilePic =
  /** Fill bar: pct derived as big / of (52 orders of 90 covers -> 58%). */
  | { kind: "fill"; of: number }
  /** Conic disc: pct derived as big / of. */
  | { kind: "disc"; of: number }
  /** Week grid: on-count derived from big itself ("6" -> 6 of 7 squares). */
  | { kind: "week" };

export interface StatTileItem {
  /** The figure. Null omits the tile (M9 tile-level). */
  big: string | null;
  /** Small caption under the number (.lab in tang, .k elsewhere). */
  label?: string;
  /** A full sentence (worlds .s only). */
  caption?: string;
  glyph?: GlyphId;
  /**
   * bad = shaded tile, muted figure; answer = terracotta figure, at most one
   * per instance. Tones are styled where the stylesheet carries them
   * (worlds: bad + answer; figs: answer).
   */
  tone?: "plain" | "bad" | "answer";
  /** tang variant only, the little picture of the tile's own number. */
  pic?: StatTilePic;
}

export interface StatTilesProps extends React.HTMLAttributes<HTMLDivElement> {
  items: StatTileItem[];
  columns?: 2 | 3 | 4;
  align?: "left" | "center";
  /**
   * WHICH FIGURE LEADS, by size , distinct from `tone`, which is which figure is
   * MARKED. A chapter whose accent budget is already spent elsewhere still needs
   * one figure to lead, or three equal figures present no answer at all
   * (the HIERARCHY-TIE the design linter fires on).
   *
   * Pass the index of the leading tile. The size step is the component's, not
   * the caller's: callers choose WHICH, never HOW BIG, so the ratio stays one
   * decision across every page and every future place.
   *
   * This exists because the mockups encoded exactly this decision as a
   * per-instance inline `font-size:32px`, and inline styles do not cross a port
   * , the two known regressions (cell ch05, ch15) were invisible until the
   * rendered-design gate caught them. Structure crosses; inline overrides do not.
   */
  lead?: number;
}

/** The one size step for a leading figure. 26px is the tile default in the
 *  stylesheet; the lead takes 32px, the ratio the mockups settled on. */
const LEAD_FONT_PX = 32;

/** Numeric datum parsed from the printed figure ("$38" -> 38, "52" -> 52). */
function numOf(big: string): number | null {
  const s = big.replace(/[^0-9.]/g, "");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function TilePic({ big, pic }: { big: string; pic: StatTilePic }) {
  const n = numOf(big);
  if (n == null) return null;

  if (pic.kind === "week") {
    const on = Math.max(0, Math.min(7, Math.round(n)));
    return (
      <div className="pic">
        <span className="week">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} className={i < on ? "on" : undefined} />
          ))}
        </span>
      </div>
    );
  }

  if (!Number.isFinite(pic.of) || pic.of <= 0) return null;
  const pct = clampPct((n / pic.of) * 100);

  if (pic.kind === "fill") {
    return (
      <div className="pic">
        <span className="fill">
          <i style={{ width: `${pct}%` }} />
        </span>
      </div>
    );
  }
  return (
    <div className="pic">
      <span className="disc" style={{ "--p": `${pct}%` } as React.CSSProperties} />
    </div>
  );
}

const StatTiles = React.forwardRef<HTMLDivElement, StatTilesProps>(
  ({ items, columns = 3, align = "center", lead, className, ...props }, ref) => {
    /* Resolve the lead by IDENTITY before filtering: `lead` indexes the items
       the caller passed, and a self-omitted tile (M9) shifts every index after
       it. Comparing objects survives the filter; comparing indices would
       silently promote the wrong figure the first time a tile went null , which
       is the same class of bug as an accent flag that outlives its data. */
    const leadItem =
      lead != null && lead >= 0 && lead < items.length ? items[lead] : null;
    /* ONE helper, applied at every variant's figure site. Three variants render
       the big figure through three different branches; a per-branch fix is the
       same fragility that let this defect exist, so the rule lives once. */
    const leadStyle = (t: StatTileItem): React.CSSProperties | undefined =>
      t === leadItem ? { fontSize: LEAD_FONT_PX } : undefined;

    let renderable = items.filter((t) => t.big != null && t.big !== "");
    if (renderable.length === 0) return null;

    // A4/M5: the accent marks the answer, once. Never trust the data to obey.
    const answers = renderable.filter((t) => t.tone === "answer");
    if (answers.length > 1) {
      const msg =
        "StatTiles: at most one tile may carry tone:'answer' (the accent marks the answer, once); got " +
        answers.length;
      if (process.env.NODE_ENV !== "production") throw new Error(msg);
      console.error(msg);
      const first = answers[0];
      renderable = renderable.map((t) =>
        t.tone === "answer" && t !== first ? { ...t, tone: "plain" } : t,
      );
    }

    const variant =
      columns === 2 ? "statcluster" : columns === 4 ? "figs" : align === "left" ? "worlds" : "tang";

    return (
      <div ref={ref} className={cn(variant, className)} {...props}>
        {renderable.map((t, i) => {
          const big = t.big as string;
          if (variant === "tang") {
            return (
              <div className="c" key={i}>
                <div className="big fig" style={leadStyle(t)}>
                  {big}
                </div>
                {t.label ? <div className="lab">{t.label}</div> : null}
                {t.pic ? <TilePic big={big} pic={t.pic} /> : null}
              </div>
            );
          }
          if (variant === "worlds") {
            return (
              <div
                className={cn("w", t.tone === "bad" && "bad", t.tone === "answer" && "now")}
                key={i}
              >
                {t.label ? (
                  <div className="t">
                    {t.glyph ? <GlyphIcon id={t.glyph} size={13} /> : null} {t.label}
                  </div>
                ) : null}
                <div className="n" style={leadStyle(t)}>{big}</div>
                {t.caption ? <div className="s">{t.caption}</div> : null}
              </div>
            );
          }
          // statcluster (.s) and the wealth figs strip (.f)
          const cell = variant === "figs" ? "f" : "s";
          return (
            <div className={cn(cell, variant === "figs" && t.tone === "answer" && "a")} key={i}>
              <div className="n fig" style={leadStyle(t)}>{big}</div>
              {t.label ? (
                <div className="k">
                  {t.glyph ? <GlyphIcon id={t.glyph} size={13} /> : null}
                  {t.label}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
);
StatTiles.displayName = "StatTiles";

export { StatTiles };
