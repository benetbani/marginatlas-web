/**
 * src/components/ui/spinner.tsx
 *
 * Indeterminate spinner for sub-300ms operations only. For anything
 * longer than 300ms, ui-ux-pro-max says use a skeleton instead so
 * users see the shape of what's loading rather than a blank wait.
 *
 * Hard rules:
 *   - Always wrap in role="status" and provide an sr-only label
 *     (default: "Loading...")
 *   - Respects prefers-reduced-motion: pauses the spin when the
 *     user has reduced motion enabled
 *   - Color is currentColor by default so consumers tint via
 *     parent text color (text-atlas-700, text-cocoa-700, etc.)
 *
 * Design system Phase 2, 2026-05-27.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  // Animate, then drop the animation under reduced-motion so the
  // spinner stops moving but stays visible (giving users feedback
  // that something is loading without inducing motion sickness).
  "inline-block animate-spin motion-reduce:animate-none rounded-full border-current border-t-transparent align-[-0.125em]",
  {
    variants: {
      size: {
        sm: "size-3 border-2",
        md: "size-4 border-2",
        lg: "size-6 border-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Screen reader label. Default: "Loading...". */
  srLabel?: string;
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, srLabel = "Loading...", ...props }, ref) => {
    return (
      <span ref={ref} role="status" className="inline-flex items-center" {...props}>
        <span aria-hidden="true" className={cn(spinnerVariants({ size }), className)} />
        <span className="sr-only">{srLabel}</span>
      </span>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
