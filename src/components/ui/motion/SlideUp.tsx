/**
 * src/components/ui/motion/SlideUp.tsx
 *
 * Slide-up + fade-in on mount. Translates 8px → 0 with opacity 0 → 1
 * over 300ms ease-out. The translateY direction implies "this is
 * arriving from below the fold" (Material Motion: forward = upward).
 *
 * Reduced-motion: `motion-reduce:animate-none` cancels both translate
 * and fade so the user sees the final state immediately.
 *
 * Design system Phase 4, 2026-05-27.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface SlideUpProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

const SlideUp = React.forwardRef<HTMLDivElement, SlideUpProps>(
  ({ as: Comp = "div", className, children, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn("animate-ds-slide-up motion-reduce:animate-none", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
SlideUp.displayName = "SlideUp";

export { SlideUp };
