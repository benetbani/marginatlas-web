/**
 * src/components/ui/motion/Stagger.tsx
 *
 * Wraps a list of children with staggered animation delays so they
 * appear one after another rather than all at once. Each child gets
 * its own `animationDelay` inline style; the children themselves
 * supply the animation class via FadeIn or SlideUp wrappers.
 *
 * Stagger base defaults to 40ms per child (Material Design's
 * recommended 30-50ms range). Capped at 480ms so a 12-item list
 * finishes at the same time as a 100-item list. Long lists never
 * feel sluggish.
 *
 * Reduced-motion: when `prefers-reduced-motion` is set, every
 * child's nested FadeIn/SlideUp cancels its own animation, so the
 * stagger delays still apply but are invisible (every child renders
 * at final state immediately). No special handling needed here.
 *
 * Usage:
 *   <Stagger>
 *     {items.map((item) => (
 *       <FadeIn key={item.id}>
 *         <Card />
 *       </FadeIn>
 *     ))}
 *   </Stagger>
 *
 * Design system Phase 4, 2026-05-27.
 */
import * as React from "react";
import { stagger } from "@/lib/motion";

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  /** Per-child stagger delay in ms. Default 40. */
  baseMs?: number;
  /** Maximum cumulative delay in ms. Default 480. */
  capMs?: number;
}

const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  ({ as: Comp = "div", baseMs = 40, capMs = 480, children, ...props }, ref) => {
    // Walk children and inject `style.animationDelay` into each.
    // Only React elements get the inline style; strings, fragments,
    // and null pass through unchanged.
    const staggered = React.Children.map(children, (child, i) => {
      if (!React.isValidElement(child)) return child;
      const existingStyle =
        (child.props as { style?: React.CSSProperties }).style ?? {};
      return React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
        style: {
          animationDelay: stagger(i, baseMs, capMs),
          ...existingStyle,
        },
      });
    });

    return (
      <Comp ref={ref} {...props}>
        {staggered}
      </Comp>
    );
  },
);
Stagger.displayName = "Stagger";

export { Stagger };
