/**
 * src/components/ui/tier-dot.tsx
 *
 * The canonical coverage-tier indicator: a small colored dot, optionally
 * with its tier word. Reads its color from the `tier` token scale in
 * design-tokens.ts (deep / good / starter / modeled), so every surface that
 * signals data confidence (country scorecard, coverage hub, the cell-page
 * confidence word) shares one warm color language. This retires the ad hoc
 * green / blue dots the unused v2 components hardcoded.
 *
 * Accessibility: a bare dot carries meaning by color alone, so when no label
 * is shown it renders role="img" with an aria-label. With a label, the text
 * carries the meaning and the dot is aria-hidden.
 *
 * Design system, 2026-06-02.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type Tier = "deep" | "good" | "starter" | "modeled";

/** Default human word per tier. Override with the `label` prop. */
export const TIER_LABEL: Record<Tier, string> = {
  deep: "Measured",
  good: "Regional",
  starter: "Thin",
  modeled: "Estimated",
};

const dotVariants = cva("inline-block rounded-full shrink-0", {
  variants: {
    tier: {
      deep: "bg-tier-deep",
      good: "bg-tier-good",
      starter: "bg-tier-starter",
      modeled: "bg-tier-modeled",
    },
    size: {
      sm: "w-1.5 h-1.5",
      md: "w-2 h-2",
      lg: "w-2.5 h-2.5",
    },
  },
  defaultVariants: { tier: "deep", size: "md" },
});

export interface TierDotProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof dotVariants> {
  /** Which confidence tier. Required. */
  tier: Tier;
  /** Show the tier word next to the dot. */
  showLabel?: boolean;
  /** Override the visible / accessible word. Defaults to TIER_LABEL[tier]. */
  label?: string;
}

const TierDot = React.forwardRef<HTMLSpanElement, TierDotProps>(
  ({ className, tier, size, showLabel, label, ...props }, ref) => {
    const word = label ?? TIER_LABEL[tier];

    if (showLabel) {
      return (
        <span
          ref={ref}
          className={cn("inline-flex items-center gap-1.5", className)}
          {...props}
        >
          <span className={dotVariants({ tier, size })} aria-hidden="true" />
          <span className="text-xs font-medium text-cocoa-700">{word}</span>
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(dotVariants({ tier, size }), className)}
        role="img"
        aria-label={`${word} coverage`}
        {...props}
      />
    );
  },
);
TierDot.displayName = "TierDot";

export { TierDot, dotVariants as tierDotVariants };
