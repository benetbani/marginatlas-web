/**
 * src/components/spine2/Voices.tsx
 *
 * Operator quotes each anchored to one concrete figure: a human line and the
 * number it turns on, side by side. Cell 14 (x2, the second inside a .more
 * disclosure) / city (BATCH-A). v6 A3: the figure column is 150px and
 * left-bordered next to its own quote , carried by the stylesheet.
 *
 * Per BATCH-A, exactly:
 *   - quote-level self-omit (M9): no `say`, no row;
 *   - `who` and `figure` degrade individually: a quote without its figure
 *     keeps the words, and the figure cell simply does not render , never an
 *     empty bordered cell;
 *   - `.fig.a` exists in CSS but no instance uses it after A3/A4 made ink the
 *     default , no accent prop is ported until a page needs one;
 *   - figures are strings ("+31%", "$12K", "3 days"), never numbers;
 *   - text-on-fill (M4): none by construction.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type Voice = {
  say: string;
  /** "Cafe · Hackney"; omits alone. */
  who: string | null;
  /** The anchoring number; the cell does not render if null. */
  figure: string | null;
};

export interface VoicesProps extends React.HTMLAttributes<HTMLDivElement> {
  voices: Voice[];
}

const Voices = React.forwardRef<HTMLDivElement, VoicesProps>(
  ({ voices, className, ...props }, ref) => {
    const renderable = voices.filter((v) => v.say != null && v.say !== "");
    if (renderable.length === 0) return null;

    return (
      <div ref={ref} className={cn("voices", className)} {...props}>
        {renderable.map((v, i) => (
          <div className="q" key={i}>
            <div className="say">
              {v.say}
              {v.who != null && v.who !== "" ? <span className="who">{v.who}</span> : null}
            </div>
            {v.figure != null && v.figure !== "" ? (
              <span className="fig">{v.figure}</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  },
);
Voices.displayName = "Voices";

export { Voices };
