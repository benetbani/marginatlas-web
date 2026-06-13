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
