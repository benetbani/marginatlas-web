/**
 * src/components/spine2/Ctl.tsx
 *
 * Two lists in one framed pair: what the operator sets versus what is set
 * for them. Cell 15. BATCH-C: the contrast-pair form ("you" accent header vs
 * "not" shaded column) is not carried by any list primitive; folding it into
 * statblock would cost the side-by-side tension that IS the content.
 *
 * Per BATCH-C, exactly:
 *   - BOTH lists required (M9) , the form is the contrast, so an empty side
 *     omits the whole section rather than rendering a one-armed comparison;
 *   - item-level: empty strings filtered;
 *   - server component; stacks to one column under 560px via the stylesheet.
 *
 * The header glyphs (verdict / red-tape) are the mockup's fixed grammar for
 * the pair and ship with the default headers.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";

export interface CtlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Default "You set these". */
  youHeader?: string;
  /** Default "Set for you". */
  notHeader?: string;
  you: string[];
  not: string[];
}

const Ctl = React.forwardRef<HTMLDivElement, CtlProps>(
  (
    { youHeader = "You set these", notHeader = "Set for you", you, not, className, ...props },
    ref,
  ) => {
    const youItems = you.filter((s) => s != null && s !== "");
    const notItems = not.filter((s) => s != null && s !== "");
    if (youItems.length === 0 || notItems.length === 0) return null;

    return (
      <div ref={ref} className={cn("ctl", className)} {...props}>
        <div className="c you">
          <div className="h">
            <GlyphIcon id="verdict" size={13} /> {youHeader}
          </div>
          <ul>
            {youItems.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="c not">
          <div className="h">
            <GlyphIcon id="red-tape" size={13} /> {notHeader}
          </div>
          <ul>
            {notItems.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);
Ctl.displayName = "Ctl";

export { Ctl };
