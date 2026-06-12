/**
 * AtlasIcon - the ma- UI icon primitive (Fable P1-05, 2026-06-12).
 *
 * Renders one of the 40 manifest glyphs as inline SVG: 32-unit grid, 1.6
 * stroke, rounded joins, currentColor ink. The single vermillion accent
 * inside a glyph (class "a" stroke / "af" fill) resolves through the
 * `.ma-glyph` rules in globals.css, bound to the atlas-500 token value.
 *
 * Accessibility: pass `aria-label` for icon-only usage (role="img");
 * decorative usage (no label) renders aria-hidden, per design-system 9.1.
 * No SVG sprite ships; the manifest is tree-shaken via the data module.
 */
import * as React from "react";
import { ATLAS_ICONS_BY_ID, type AtlasIconId } from "./atlas-icons-data";

export interface AtlasIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "id" | "children"> {
  /** Glyph id from the ma- manifest (typed; unknown ids do not compile). */
  id: AtlasIconId;
  /** Square render size in px. 16 / 20 / 24 are the sanctioned steps. */
  size?: number;
}

export const AtlasIcon = React.forwardRef<SVGSVGElement, AtlasIconProps>(
  function AtlasIcon({ id, size = 24, className, ...rest }, ref) {
    const def = ATLAS_ICONS_BY_ID[id];
    if (!def) return null;
    const labelled = rest["aria-label"] != null;
    return (
      <svg
        {...rest}
        ref={ref}
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={labelled ? "img" : undefined}
        aria-hidden={labelled ? undefined : true}
        className={["ma-glyph", className].filter(Boolean).join(" ")}
        dangerouslySetInnerHTML={{ __html: def.body }}
      />
    );
  },
);
AtlasIcon.displayName = "AtlasIcon";
