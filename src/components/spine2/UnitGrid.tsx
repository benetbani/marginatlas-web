/**
 * src/components/spine2/UnitGrid.tsx
 *
 * The hundred+dots merge (BATCH-B): one unit-mark primitive. `dots` is the
 * degenerate k=1 inline case of `hundred`'s k=3 labelled-block partition, so
 * one primitive with a `layout` variant covers both:
 *
 *   layout: "inline" -> the `.dots` grid: one contiguous grid of `total`
 *     marks, group counts toned from the left, remainder unfilled. The
 *     legend is the caller's job (SwatchLegend) , inline blocks carry no
 *     adjacent labels, so a legend is REQUIRED beside this variant (M6).
 *   layout: "blocks" -> the `.hundred` anatomy: one block per group, each a
 *     label column (.lb: big count + sentence) beside its own marks grid.
 *
 * Interactivity NEVER lives here: the distribution model that recomputes
 * counts (cell 03's slider) is page-store state; this component is a pure
 * render of counts (BATCH-B: "the component is a pure render of three
 * counts").
 *
 * `cols` must divide `total` so the grid is never ragged (the mockup's
 * 15-column workforce grid drew 6.67 rows and "no longer read as a hundred
 * people" , the triage mandates a divisor default: 10 for inline/people,
 * 20 for blocks, matching the `.hundred .grp .marks` stylesheet).
 *
 * The mockup's `.edge` class (terracotta second attribute) is deliberately
 * NOT carried: the country audit removed it (two independent attributes
 * drawn as one partition read as a subset).
 *
 * M9 self-omit: a group with count <= 0 renders nothing; zero renderable
 * marks omit the whole grid.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type UnitTone = "ink" | "terra" | "neutral" | "faint";

export type UnitGroup = {
  count: number;
  /** Tone is stated by the caller's rule (Hundred derives it from `kind`). */
  tone: UnitTone;
  /** blocks: the label column. big = the count line, small = the sentence. */
  label?: { big: string; small: string };
};

export interface UnitGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The whole the marks partition; default 100. */
  total?: number;
  groups: UnitGroup[];
  layout: "inline" | "blocks";
  /** Columns; must divide `total`. Default: inline 10, blocks 20. */
  cols?: number;
}

/** blocks layout keys the stylesheet's `.grp.over/.mid/.none` tone classes. */
const BLOCK_TONE_CLASS: Partial<Record<UnitTone, string>> = {
  terra: "over",
  neutral: "mid",
  faint: "none",
};

/** inline marks: ink has a class; the rest inline-style their fill. */
const INLINE_TONE_STYLE: Partial<Record<UnitTone, React.CSSProperties>> = {
  terra: { background: "var(--terra)" },
  neutral: { background: "var(--n3)" },
};

function defaultCols(total: number, layout: "inline" | "blocks"): number {
  const preferred = layout === "blocks" ? 20 : 10;
  if (total > 0 && total % preferred === 0) return preferred;
  for (let d = preferred; d >= 2; d--) if (total % d === 0) return d;
  return preferred;
}

const UnitGrid = React.forwardRef<HTMLDivElement, UnitGridProps>(
  (
    { total = 100, groups, layout, cols, className, style, children, ...props },
    ref,
  ) => {
    const renderable = groups.filter((g) => g.count > 0);
    const filled = renderable.reduce((s, g) => s + g.count, 0);
    if (filled <= 0) return null;

    const nCols = cols ?? defaultCols(total, layout);
    if (process.env.NODE_ENV !== "production") {
      if (total % nCols !== 0)
        console.error(
          `UnitGrid: cols=${nCols} does not divide total=${total}; the grid will be ragged.`,
        );
      if (filled > total)
        console.error(
          `UnitGrid: group counts (${filled}) exceed total (${total}).`,
        );
    }

    if (layout === "inline") {
      const marks: React.ReactNode[] = [];
      renderable.forEach((g, gi) => {
        for (let i = 0; i < g.count; i++)
          marks.push(
            <i
              key={`${gi}-${i}`}
              className={g.tone === "ink" ? "on" : undefined}
              style={INLINE_TONE_STYLE[g.tone]}
              title={g.label?.small}
            />,
          );
      });
      for (let i = filled; i < total; i++) marks.push(<i key={`rest-${i}`} />);
      return (
        <div
          ref={ref}
          className={cn("dots", className)}
          style={{ gridTemplateColumns: `repeat(${nCols},1fr)`, ...style }}
          {...props}
        >
          {marks}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("hundred", className)} style={style} {...props}>
        {renderable.map((g, gi) => (
          <div className={cn("grp", BLOCK_TONE_CLASS[g.tone])} key={gi}>
            {g.label ? (
              <span className="lb">
                <span className="n fig">{g.label.big}</span>
                <span className="k">{g.label.small}</span>
              </span>
            ) : null}
            <span
              className="marks"
              style={
                nCols !== 20
                  ? { gridTemplateColumns: `repeat(${nCols},1fr)` }
                  : undefined
              }
            >
              {Array.from({ length: g.count }, (_, i) => (
                <i
                  key={i}
                  title={g.label?.small}
                  style={
                    g.tone === "ink" ? { background: "var(--ink)" } : undefined
                  }
                />
              ))}
            </span>
          </div>
        ))}
        {children}
      </div>
    );
  },
);
UnitGrid.displayName = "UnitGrid";

export { UnitGrid };
