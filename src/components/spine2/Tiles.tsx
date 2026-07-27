/**
 * src/components/spine2/Tiles.tsx
 *
 * The lattice close, "where to go next": a grid of readings, each a label +
 * figure, each either a DOOR (<a>, chevron, hover-terracotta figure) or a
 * FACT (<span>, no affordance) , PORT-CONTRACT M1 verbatim. Cell 21 / city /
 * country (BATCH-A).
 *
 * Reading[] straight through the existing Reading atom, which carries the
 * whole M1 grammar (element split, chevron via `.tiles>a .t::after`, name and
 * figure colours, hover). This component is only the framed 3-column grid
 * (2-up under 640px, internal hairlines , all stylesheet).
 *
 * Per BATCH-A, exactly:
 *   - self-omit is M1's own rule: a reading is never omitted for want of a
 *     link, only for want of a figure (the atom returns null on a null
 *     figure); the whole grid omits at zero renderable readings;
 *   - `href` is decided by the data layer (a target is linked iff its page is
 *     generated in this build) , neither the atom nor this grid ever invents
 *     or withholds one;
 *   - caption coupling (M7): none , M1 explicitly bans copy explaining door
 *     versus fact;
 *   - text-on-fill (M4): none; hover terracotta is the figure inside a door,
 *     the one permitted hover accent.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { Reading, type ReadingData } from "./Reading";

export interface TilesProps extends React.HTMLAttributes<HTMLDivElement> {
  readings: ReadingData[];
}

const Tiles = React.forwardRef<HTMLDivElement, TilesProps>(
  ({ readings, className, ...props }, ref) => {
    const renderable = readings.filter((r) => r.figure != null && r.figure !== "");
    if (renderable.length === 0) return null;

    return (
      <div ref={ref} className={cn("tiles", className)} {...props}>
        {renderable.map((r, i) => (
          <Reading key={i} {...r} />
        ))}
      </div>
    );
  },
);
Tiles.displayName = "Tiles";

export { Tiles };
