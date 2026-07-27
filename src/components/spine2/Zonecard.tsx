/**
 * src/components/spine2/Zonecard.tsx
 *
 * The self-omitting one-liner: a dashed quiet card stating that nothing in
 * this section moves the needle for this reader, and promising the section
 * will speak up if that changes. Country 16. More than a component, it is
 * PORT-CONTRACT M9 PATTERN 1 , the model every mostly-absent section
 * references. BATCH-C.
 *
 * THE TRI-STATE CONTRACT (the one thing to get right): a zonecard renders on
 * a VERIFIED absence , the data layer looked and affirmed nothing applies.
 * On missing data (nobody looked yet) the section omits entirely.
 * Absence-of-knowledge is never rendered as knowledge-of-absence; a zonecard
 * without a data-layer affirmation behind it would be a fabricated claim.
 *
 *   'applies'        -> the section renders its real content (the page's job)
 *   'verified-none'  -> the zonecard renders
 *   'unknown'        -> nothing renders
 *
 * The component takes the presence value itself so the contract is enforced
 * structurally: there is no way to render a zonecard from an 'unknown'.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

/**
 * The tri-state section-presence contract (M9 pattern 1). Sections whose
 * content is genuinely absent in most places carry this instead of a bare
 * nullable: 'applies' holds the real content, 'verified-none' is an
 * affirmed absence, 'unknown' means nobody looked yet.
 */
export type SectionPresence<T> =
  | { state: "applies"; content: T }
  | { state: "verified-none" }
  | { state: "unknown" };

export interface ZonecardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The data layer's answer for this section. Renders ONLY on 'verified-none'. */
  presence: SectionPresence<unknown>;
  glyph: GlyphId;
  /** The bold verdict of absence: "Nothing here moves the needle for a high-street trade." */
  lead: string;
  /** Why, ending in the promise: "If that changes for your trade, this section will say so." */
  explain: string;
}

const Zonecard = React.forwardRef<HTMLDivElement, ZonecardProps>(
  ({ presence, glyph, lead, explain, className, ...props }, ref) => {
    if (presence.state !== "verified-none") return null;
    if (!lead || !explain) return null;

    return (
      <div ref={ref} className={cn("zonecard", className)} {...props}>
        <GlyphIcon id={glyph} size={24} />
        <span className="t">
          <b>{lead}</b> {explain}
        </span>
      </div>
    );
  },
);
Zonecard.displayName = "Zonecard";

export { Zonecard };
