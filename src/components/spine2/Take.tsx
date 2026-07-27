/**
 * src/components/spine2/Take.tsx
 *
 * The verdict: one honest paragraph with the answer bolded, a terracotta
 * spine (the stylesheet's inset box-shadow), and chips restating the page's
 * key figures. Cell 17; INVENTORY H1 names it "the single most reusable
 * section in the system". BATCH-C.
 *
 * Per BATCH-C, exactly:
 *   - the verdict paragraph is REQUIRED , no paragraph, no section (an empty
 *     verdict band is the one absence a reader would notice);
 *   - chips take {glyph, figureId} resolved against the page's figure
 *     registry (./figures.ts) , they never take free text, so a chip can only
 *     restate a figure the page already carries (M7);
 *   - a chip whose figureId resolves to nothing does not render (and
 *     console.errors in dev, via resolveChip); zero chips is legal, the
 *     paragraph carries the section;
 *   - server component, no state;
 *   - text-on-fill (M4): none , ink on the near-white take fill.
 *
 * The registry is passed in because it lands at page assembly (the same
 * registry the number gate reads); the component only consumes it.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";
import { resolveChip, type FigureId, type FigureRegistry } from "./figures";

export type TakeChip = { glyph: GlyphId; figureId: FigureId };

export interface TakeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** One paragraph; <b> marks the answer phrases. Required or the section omits. */
  verdict: React.ReactNode;
  chips: TakeChip[];
  /** The page's figure registry , lands at page assembly (see ./figures.ts). */
  figures: FigureRegistry;
}

const Take = React.forwardRef<HTMLDivElement, TakeProps>(
  ({ verdict, chips, figures, className, ...props }, ref) => {
    if (verdict == null || verdict === "") return null;

    const resolved = chips
      .map((c) => ({ glyph: c.glyph, display: resolveChip(figures, c.figureId) }))
      .filter((c): c is { glyph: GlyphId; display: string } => c.display != null);

    return (
      <div ref={ref} className={cn("take", className)} {...props}>
        <div className="v">{verdict}</div>
        {resolved.length > 0 ? (
          <div className="chips">
            {resolved.map((c, i) => (
              <span className="chip" key={i}>
                <GlyphIcon id={c.glyph} size={13} />
                {c.display}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
Take.displayName = "Take";

export { Take };
