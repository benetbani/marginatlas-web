/**
 * src/components/ui/motion/FadeIn.tsx
 *
 * Simple fade-in on mount. Pure CSS animation (no framer-motion);
 * works in Server Components without a "use client" boundary.
 *
 * Reduced-motion: the `motion-reduce:animate-none` Tailwind variant
 * cancels the animation for users with `prefers-reduced-motion`,
 * which means they see the final state immediately (opacity 1) with
 * no transition. No layout shift either way.
 *
 * Design system Phase 4, 2026-05-27.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Element to render. Default "div". Pass "section", "li", etc.
   * when the surrounding HTML demands it.
   */
  as?: React.ElementType;
}

const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({ as: Comp = "div", className, children, ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn("animate-ds-fade-in motion-reduce:animate-none", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
FadeIn.displayName = "FadeIn";

export { FadeIn };
