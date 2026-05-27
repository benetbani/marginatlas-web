/**
 * src/components/ui/skeleton.tsx
 *
 * Low-level skeleton primitive. Renders a calm pulsing placeholder
 * shape; consumers compose these into page-layout skeletons.
 *
 * Use this directly for one-off placeholders. For full page skeletons
 * (cell-page hero, card grid, list, single block), see
 * `src/components/LoadingSkeleton.tsx` which composes this primitive
 * into the canonical page layouts.
 *
 * Accessibility: this primitive renders only the visual shape. The
 * parent that owns the loading state should set role="status" and
 * aria-live="polite" once around the whole loading region, with a
 * single sr-only "Loading..." label. Don't repeat that per shape.
 *
 * Design system Phase 2, 2026-05-27.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  // Atlas pulse animation (1.8s ease-in-out infinite, opacity 0.55-0.85);
  // see tailwind.config.ts keyframes.atlasPulse.
  "animate-atlasPulse bg-cream-200",
  {
    variants: {
      variant: {
        // Thin horizontal bar; default for inline text placeholders.
        text: "h-3 rounded",
        // Larger filled block; default for full-width content.
        block: "h-24 rounded-lg",
        // Circular avatar / icon placeholder.
        circle: "rounded-full aspect-square",
        // Chart placeholder; reserves space at 16:9.
        chart: "rounded-lg aspect-[16/9]",
        // Card placeholder; reserves space at 4:3 with stronger border.
        card: "rounded-lg aspect-[4/3] border border-parchment",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Optional explicit width override. Pass as CSS string (e.g. "60%",
   * "12rem", "200px"). For text/circle variants leave undefined and
   * size via className width utilities instead.
   */
  width?: string | number;
  /**
   * Optional explicit height override.
   */
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(skeletonVariants({ variant }), className)}
        style={{
          ...(width != null ? { width } : {}),
          ...(height != null ? { height } : {}),
          ...style,
        }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
