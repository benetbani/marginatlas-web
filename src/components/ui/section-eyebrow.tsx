/**
 * src/components/ui/section-eyebrow.tsx
 *
 * The small uppercase label that sits above a section heading. One primitive
 * so every band (homepage sections, cell-page chapters, sector pages) labels
 * itself the same way instead of each rolling its own tracked-uppercase span.
 *
 * Renders as a <div> by default; this is a label, not a heading, so it never
 * competes with the real <h2>/<h3> below it.
 *
 * Design system, 2026-06-02.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const eyebrowVariants = cva("uppercase font-semibold leading-none", {
  variants: {
    tone: {
      default: "text-atlas-700",
      muted: "text-cocoa-700",
      inverse: "text-atlas-300", // on dark bands (atlas-paper-dark)
      /**
       * ON THE PHOTOGRAPH RATHER THAN ON A CARD, and this is a contrast fix
       * with a measurement behind it rather than a taste choice.
       *
       * AtlasFrame paints the founder's photograph at opacity 0.32 over an
       * opaque white base. Composing that exactly and reading every pixel, the
       * backdrop's DARKEST point is luminance 0.4179. Against it:
       *
       *     atlas-700  #991600   3.79:1   fails AA, which needs 4.5 at 12px
       *     atlas-800  #701000   5.29:1   passes
       *
       * An eyebrow is 12px, so the large-text allowance of 3.0 does not apply.
       * (The homepage H1's rotating words are also atlas-700 on the backdrop
       * and DO pass, at 60px, on that allowance. Size is the whole difference.)
       *
       * `default` is unchanged and stays atlas-700, because most eyebrows on
       * this site sit on a card where it reads 12.8:1 and is the brand accent.
       * This tone is for the ones that do not.
       */
      backdrop: "text-atlas-800",
    },
    size: {
      // 12px is the floor: nothing smaller renders. The old 10px `sm` is gone.
      sm: "text-xs tracking-[0.16em]",
      md: "text-xs tracking-[0.18em]",
    },
  },
  defaultVariants: { tone: "default", size: "sm" },
});

export interface SectionEyebrowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof eyebrowVariants> {}

const SectionEyebrow = React.forwardRef<HTMLDivElement, SectionEyebrowProps>(
  ({ className, tone, size, children, ...props }, ref) => (
    <div ref={ref} className={cn(eyebrowVariants({ tone, size }), className)} {...props}>
      {children}
    </div>
  ),
);
SectionEyebrow.displayName = "SectionEyebrow";

export { SectionEyebrow, eyebrowVariants as sectionEyebrowVariants };
