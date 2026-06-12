/**
 * AtlasPictogram - the trade/venue pictogram primitive (Fable P1-05).
 *
 * Same family and conventions as AtlasIcon (32-unit grid, 1.6 stroke,
 * currentColor ink, one vermillion accent max via the `.ma-glyph` rules),
 * a touch more character, never cartoonish. Job: trade identity only,
 * category tiles, sub-type switchers, cell-list rows, peer cards; never
 * decoration scattered around prose (design-system 9.2).
 */
import * as React from "react";
import {
  ATLAS_PICTOGRAMS_BY_ID,
  type AtlasPictogramId,
} from "./atlas-pictograms-data";

export interface AtlasPictogramProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "id" | "children"> {
  /** Mark id from the pictogram manifest (typed). */
  id: AtlasPictogramId;
  /** Square render size in px; 32 is the natural grid size. */
  size?: number;
}

export const AtlasPictogram = React.forwardRef<
  SVGSVGElement,
  AtlasPictogramProps
>(function AtlasPictogram({ id, size = 32, className, ...rest }, ref) {
  const def = ATLAS_PICTOGRAMS_BY_ID[id];
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
});
AtlasPictogram.displayName = "AtlasPictogram";
