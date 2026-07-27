/**
 * src/components/spine2/Late.tsx
 *
 * "What people find out too late": a numbered/indexed list of hard-won facts,
 * an index tag, a bold line, an optional explanatory sub-line. Cell 04 / cell
 * 12 / city 14 (BATCH-A).
 *
 * Per BATCH-A, exactly:
 *   - the index is DATA, not a counter: ordinals ("01".."04") on cell 04 and
 *     year codes ("Y1"/"Y3"/"Y5") on cell 12 , the component never numbers
 *     for you;
 *   - item-level self-omit (M9 pattern 2): no `title`, no item; `sub` omits
 *     alone; whole component at zero items;
 *   - A4: the index renders --muted via the stylesheet (`.late .l .i`), never
 *     terracotta , no accent prop exists;
 *   - text-on-fill (M4): none by construction, all text on panel white.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type LateItem = {
  /** "01", "Y3" , authored, not auto-numbered. */
  index: string;
  title: string;
  sub?: string | null;
};

export interface LateProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LateItem[];
}

const Late = React.forwardRef<HTMLDivElement, LateProps>(
  ({ items, className, ...props }, ref) => {
    const renderable = items.filter((it) => it.title != null && it.title !== "");
    if (renderable.length === 0) return null;

    return (
      <div ref={ref} className={cn("late", className)} {...props}>
        {renderable.map((it, i) => (
          <div className="l" key={i}>
            <span className="i">{it.index}</span>
            <span className="t">
              {it.title}
              {it.sub != null && it.sub !== "" ? <span>{it.sub}</span> : null}
            </span>
          </div>
        ))}
      </div>
    );
  },
);
Late.displayName = "Late";

export { Late };
