/**
 * AtlasSpot - the editorial spot-illustration primitive (Fable P1-07).
 *
 * Renders one of the 12 line-and-wash spots: confident ink line (inherits
 * stroke = currentColor from the wrapper, so the caller's text color is the
 * ink) over soft token-retoned colour washes (each wash carries its own fill).
 * Height follows the spot's own viewBox aspect from the given width.
 *
 * Decorative by default (aria-hidden); pass `label` to expose the title. Place
 * at most one spot per page band (design-system 9.3): brand moments, not
 * decoration on every section.
 */
import * as React from "react";
import { ATLAS_SPOTS_BY_ID, type AtlasSpotId } from "./atlas-spots-data";

export interface AtlasSpotProps {
  id: AtlasSpotId;
  /** Render width in px; height follows the spot's aspect ratio. */
  width?: number;
  className?: string;
  /** When set, the spot is exposed as an image with this label; else hidden. */
  label?: string;
}

export const AtlasSpot = React.forwardRef<SVGSVGElement, AtlasSpotProps>(
  function AtlasSpot({ id, width = 200, className, label }, ref) {
    const def = ATLAS_SPOTS_BY_ID[id];
    if (!def) return null;
    const nums = def.vb.split(/\s+/).map(Number);
    const vbW = nums[2] || 1;
    const vbH = nums[3] || 1;
    const height = Math.round((width * vbH) / vbW);
    return (
      <svg
        ref={ref}
        viewBox={def.vb}
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? "img" : undefined}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        className={["atlas-spot", className].filter(Boolean).join(" ")}
        dangerouslySetInnerHTML={{ __html: def.body }}
      />
    );
  },
);
AtlasSpot.displayName = "AtlasSpot";
