/**
 * src/components/spine2/Qa.tsx
 *
 * Questions people ask: a framed stack of native <details> rows, question in
 * the summary, the plus-expander, prose answer. Cell 20. BATCH-C.
 *
 * SERVER, ZERO CLIENT JS , this is the point of the form. The disclosure is
 * native <details>/<summary>; the plus-turns-to-cross is pure CSS via the
 * scoped `.exp` and the A6 open-state selector
 * (`.av2 details[open]>summary .exp`), which this markup carries verbatim.
 * @media print shows bodies via the stylesheet.
 *
 * Per BATCH-C, exactly:
 *   - row-level self-omit (M9): no answer, no row;
 *   - the section omits under 2 questions , a single-question "Questions
 *     people ask" is a heading apologising for itself;
 *   - answers are prose and may carry <b>; they render inside the mockups'
 *     .ans > p.note wrapper;
 *   - the merge with defs was examined and rejected (BATCH-C): opposite
 *     disclosure models, shared frame tokens only.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export type QaItem = {
  q: string;
  /** Prose; may carry <b>. Null omits the row. */
  a: React.ReactNode;
};

export interface QaProps extends React.HTMLAttributes<HTMLDivElement> {
  items: QaItem[];
}

const Qa = React.forwardRef<HTMLDivElement, QaProps>(
  ({ items, className, ...props }, ref) => {
    const renderable = items.filter(
      (it) => it.q != null && it.q !== "" && it.a != null && it.a !== "",
    );
    if (renderable.length < 2) return null;

    return (
      <div ref={ref} className={cn("qa", className)} {...props}>
        {renderable.map((it, i) => (
          <details key={i}>
            <summary>
              <span className="q">{it.q}</span>
              <span className="exp">
                <i></i>
              </span>
            </summary>
            <div className="ans">
              <p className="note">{it.a}</p>
            </div>
          </details>
        ))}
      </div>
    );
  },
);
Qa.displayName = "Qa";

export { Qa };
