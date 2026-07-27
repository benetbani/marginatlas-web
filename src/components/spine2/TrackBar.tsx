/**
 * src/components/spine2/TrackBar.tsx
 *
 * The `.t` shared-track fill sub-atom of `scale` (BATCH-A: "build scale's
 * track as a TrackBar sub-atom so readcol composes it rather than
 * duplicating it"). A 5px implied track with an inner fill whose width IS
 * the reading, as a percentage of the track.
 *
 * The fill colour is not a prop: it is owned by the row state classes the
 * stylesheet defines (`.r` default n3, `.r.on` ink, `.r.hi` terracotta),
 * so a caller cannot hand-set an accent (M5).
 *
 * `pct` null/non-finite renders nothing (nullable-inputs rule); values are
 * clamped to 0-100 so a bar can never leave its track.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TrackBarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Fill width as a percentage of the shared track (0-100). */
  pct: number | null | undefined;
}

const TrackBar = React.forwardRef<HTMLSpanElement, TrackBarProps>(
  ({ pct, className, ...props }, ref) => {
    if (pct == null || !Number.isFinite(pct)) return null;
    const w = Math.min(100, Math.max(0, pct));
    return (
      <span ref={ref} className={cn("t", className)} {...props}>
        <i style={{ width: `${w}%` }} />
      </span>
    );
  },
);
TrackBar.displayName = "TrackBar";

export { TrackBar };
