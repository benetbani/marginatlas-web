/**
 * src/components/spine2/Defs.tsx
 *
 * What these words mean: a two-column bordered grid of term cards, glyph +
 * word + plain-English definition, ALWAYS visible (a glossary you scan ,
 * the examined-and-rejected merge with Qa is recorded in BATCH-C: opposite
 * disclosure models, shared frame tokens only). Cell 19. BATCH-C.
 *
 * Per BATCH-C, exactly:
 *   - row-level self-omit (M9): a term without a `plain` does not render (a
 *     definition list that says "Revenue:" and nothing is worse than
 *     silence);
 *   - the section omits under 2 terms , stated per the M9 rule of thumb even
 *     though terms are page-type-level content and this never fires in
 *     practice;
 *   - server component; 1-column under 640px via the stylesheet.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export type Def = {
  term: string;
  glyph: GlyphId;
  plain: string | null;
};

export interface DefsProps extends React.HTMLAttributes<HTMLDivElement> {
  defs: Def[];
}

const Defs = React.forwardRef<HTMLDivElement, DefsProps>(
  ({ defs, className, ...props }, ref) => {
    const renderable = defs.filter(
      (d) => d.term != null && d.term !== "" && d.plain != null && d.plain !== "",
    );
    if (renderable.length < 2) return null;

    return (
      <div ref={ref} className={cn("defs", className)} {...props}>
        {renderable.map((d, i) => (
          <div className="d" key={i}>
            <div className="w">
              <GlyphIcon id={d.glyph} size={18} />
              {d.term}
            </div>
            <div className="x">{d.plain}</div>
          </div>
        ))}
      </div>
    );
  },
);
Defs.displayName = "Defs";

export { Defs };
