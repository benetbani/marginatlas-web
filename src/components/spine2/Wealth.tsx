/**
 * src/components/spine2/Wealth.tsx
 *
 * Every household by wealth band (city 05): a proportional spread bar with
 * in-fill percentages, a swatch legend carrying the absolute counts, and a
 * figure strip underneath (rendered by StatTiles, columns=4 -> .figs).
 *
 * M5: band tones are DERIVED from order, never a colour passed in. The top
 * (wealthiest) band takes terracotta, the answer band; the neutrals below it
 * descend n1, n2, n4, n5 (n3 is skipped deliberately, it is the ramp's
 * text-dead middle, see M4).
 *
 * M4 (text-on-fill): in-fill text colour derives from which side of the
 * n2/n3 line the fill sits on. n1/n2/terra carry white (the stylesheet's
 * default on .spread i); n3 and lighter carry ink (--ink-2 inline, the
 * mockup's own choice). An in-fill percentage renders only when the segment
 * is wide enough to hold it (~28px, approximated as a 4% share floor since
 * the bar is column-width); below that the figure lives in the legend alone,
 * which always carries it.
 *
 * M7 (caption coupling): legend counts and bar shares must reconcile. Shares
 * are recomputed from the counts; if any band's stated share disagrees with
 * its recomputed share beyond rounding (1 point), the whole spread omits, a
 * partition that contradicts its own legend is a lie.
 *
 * Self-omit (M9): a band missing either sharePct or households kills the
 * whole spread + legend as a unit (a partition with a hole is a lie, and a
 * drawn band without a legend name would fail M6). The figs strip omits
 * tile-by-tile via StatTiles.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { StatTiles, type StatTileItem } from "./StatTiles";

export interface WealthBand {
  label: string;
  /** Share of all households; sums to 100 across bands. */
  sharePct: number | null;
  /** Absolute count, the legend figure and the hover naming. */
  households: number | null;
}

export interface WealthProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The .lab over the spread, e.g. "Every London household, by wealth". */
  label?: string;
  /** Ordered poorest to wealthiest. */
  bands: WealthBand[];
  /** The 4-up figure strip; omits tile-by-tile (StatTiles M9). */
  figs?: StatTileItem[];
}

/** Segments narrower than this share do not carry an in-fill figure (M4). */
const MIN_INFILL_SHARE_PCT = 4;

/** Stated vs recomputed share tolerance, in points (M7). */
const SHARE_TOLERANCE = 1;

/** Fills that carry white text (M4's n2/n3 line); everything else gets ink. */
const WHITE_TEXT_FILLS = new Set(["n1", "n2", "terra"]);

/**
 * M5: tone by order, top band terra, neutrals descending below it with n3
 * skipped (only rescued if a sixth band ever needs it).
 */
function bandTones(count: number): string[] {
  const neutralCount = count - 1;
  const ramp =
    neutralCount <= 4 ? ["n1", "n2", "n4", "n5"] : ["n1", "n2", "n3", "n4", "n5"];
  const tones: string[] = [];
  for (let i = 0; i < count; i++) {
    if (i === count - 1) tones.push("terra");
    else tones.push(ramp[neutralCount - 1 - i] ?? "n5");
  }
  return tones;
}

/** Legend count: 840000 -> "840K", 1090000 -> "1.09M". */
function countShort(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  return `${Math.round(n / 1e3)}K`;
}

/** Hover naming: below a million spelled out, above it the short form. */
function countLong(n: number): string {
  return n >= 1e6 ? countShort(n) : n.toLocaleString("en-US");
}

const Wealth = React.forwardRef<HTMLDivElement, WealthProps>(
  ({ label, bands, figs, className, ...props }, ref) => {
    // M9: the spread renders as a unit or not at all.
    const complete =
      bands.length >= 2 &&
      bands.every(
        (b) =>
          b.sharePct != null &&
          Number.isFinite(b.sharePct) &&
          b.households != null &&
          Number.isFinite(b.households) &&
          b.households > 0,
      );

    // M7: shares must recompute from counts within rounding.
    let reconciled = false;
    if (complete) {
      const total = bands.reduce((sum, b) => sum + (b.households as number), 0);
      reconciled =
        total > 0 &&
        bands.every(
          (b) =>
            Math.abs(((b.households as number) / total) * 100 - (b.sharePct as number)) <=
            SHARE_TOLERANCE,
        );
      if (!reconciled) {
        console.error(
          "Wealth: band shares do not recompute from household counts within rounding; the spread omits (M7).",
        );
      }
    }
    const showSpread = complete && reconciled;

    const hasFigs = (figs ?? []).some((f) => f.big != null && f.big !== "");
    if (!showSpread && !hasFigs) return null;

    const tones = bandTones(bands.length);

    return (
      <div ref={ref} className={cn("wealth", className)} {...props}>
        {showSpread ? (
          <div className="top">
            {label ? (
              <div className="lab" style={{ marginBottom: 14 }}>
                {label}
              </div>
            ) : null}
            <div className="spread">
              {bands.map((b, i) => {
                const share = b.sharePct as number;
                const whiteText = WHITE_TEXT_FILLS.has(tones[i]);
                return (
                  <i
                    key={i}
                    style={{
                      flex: share,
                      background: `var(--${tones[i]})`,
                      ...(whiteText ? null : { color: "var(--ink-2)" }),
                    }}
                    title={`${b.label}, ${countLong(b.households as number)} households`}
                  >
                    {share >= MIN_INFILL_SHARE_PCT ? `${Math.round(share)}%` : null}
                  </i>
                );
              })}
            </div>
            <div className="lgd">
              {bands.map((b, i) => (
                <span className="k" key={i}>
                  <span className="sw" style={{ background: `var(--${tones[i]})` }} />
                  {b.label} <b>{countShort(b.households as number)}</b>
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {hasFigs ? <StatTiles items={figs as StatTileItem[]} columns={4} /> : null}
      </div>
    );
  },
);
Wealth.displayName = "Wealth";

export { Wealth };
