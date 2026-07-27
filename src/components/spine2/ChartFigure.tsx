/**
 * src/components/spine2/ChartFigure.tsx
 *
 * THE TEXT ALTERNATIVE, done the way the standard actually prescribes.
 *
 * The ratified commitment is "AA contrast and a text alternative for every
 * chart" (DECISIONS-PORT-AND-LAUNCH). The naive reading of that is hidden
 * sr-only prose. Two sources say otherwise and they agree:
 *
 *   W3C WAI, Complex Images , a complex image needs a SHORT alternative that
 *   identifies it plus a LONG description carrying "scales, values,
 *   relationships and trends", and: "Make descriptions available to everyone
 *   rather than hidden, as this benefits people with low vision and learning
 *   disabilities." The tutorial names <figure> + <figcaption> as a recommended
 *   markup approach.
 *   https://www.w3.org/WAI/tutorials/images/complex/
 *
 *   Web Interface Guidelines , "Use semantic HTML before ARIA."
 *
 * These pages already state each chart's finding in a visible note, because the
 * two-second read demanded it for sighted readers. So the honest fix is not to
 * write a second, hidden description: it is to make the note the chart's
 * PROGRAMMATIC description. <figure> + <figcaption> does that natively, with no
 * ARIA, no new visible content, and no double-announcement , the note is
 * announced once, as the figure's caption, instead of once as an orphan
 * paragraph that happens to sit nearby.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * It does not invent a description where none exists. A chart whose note does
 * not state its finding needs COPY, and copy that asserts something the page
 * did not previously assert is a proposal, not a refinement. Such charts render
 * exactly as before (see `caption` omitted) and are logged for the founder.
 *
 * SELF-OMIT (M9). No caption, no <figcaption>, and the figure degrades to a
 * plain wrapper , never an empty caption element, never a dangling "undefined".
 *
 * VISUAL CONTRACT. <figure> carries a browser default margin; the v13 layer in
 * atlas.css resets it to 0 so this element renders pixel-identically to the
 * <div>/fragment it replaces. The mockups do not use <figure>, so that rule is
 * inert there and the frozen visual contract is untouched.
 */
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ChartFigureProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * THE FINDING: what the chart SHOWS. Becomes the <figcaption>.
   *
   * Read this before passing anything, because an audit of the kit's eight
   * existing caption slots found only three carry a finding. The others hold:
   *   - an ENCODING statement , "Heights are exactly proportional" (ColSplit)
   *   - an INSTRUCTION , "Move the slider in the hero" (Hundred)
   *   - a QUALIFIER , "over ten years" (SparkTrend)
   *   - a HEADING , "What each role is paid" (Roster), rendered ABOVE the chart
   *
   * A heading or an instruction in a <figcaption> tells assistive tech "this is
   * what the chart shows" about something that is not what the chart shows.
   * That is the M7 defect (prose disagreeing with the render) wearing a new
   * costume, and it is worse than the orphan paragraph it would replace.
   *
   * Encoding statements are a legitimate PART of a description (W3C: a long
   * description carries "scales, values, relationships and trends"), so they may
   * accompany a finding , but they cannot substitute for one. A chart whose only
   * caption is an encoding statement is not fixed by wiring; it needs a sentence
   * saying what it shows, and that sentence is copy, which is the founder's.
   */
  caption?: React.ReactNode;
  /** Class for the <figcaption>. Defaults to the stylesheet's in-chart note. */
  captionClassName?: string;
  /** Spacing the caption carried before it became a figcaption, so wrapping a
   *  chart never moves a pixel. */
  captionStyle?: React.CSSProperties;
  children: React.ReactNode;
}

const ChartFigure = React.forwardRef<HTMLElement, ChartFigureProps>(
  ({ caption, captionClassName = "note-in", captionStyle, className, children, ...props }, ref) => {
    return (
      <figure ref={ref} className={cn("chartfig", className)} {...props}>
        {children}
        {caption ? (
          <figcaption className={captionClassName} style={captionStyle}>
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  },
);
ChartFigure.displayName = "ChartFigure";

export { ChartFigure };
