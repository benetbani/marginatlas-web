/**
 * src/components/spine2/TierPill.tsx
 *
 * The Measured / Built / Thin provenance pill (.tier.*) plus the page-level
 * definitions note. Self-contained rather than built on ui/pill.tsx: that
 * primitive carries the old warm Tailwind palette, while this pill's entire
 * look (soft wash, leading dot, the A8-corrected ramp where Measured is
 * loudest and Thin is dashed-faintest) lives in the scoped v2 stylesheet.
 *
 * Both the pill label and TierDefinitions render from TIER_COPY (M7: pill and
 * definition can never desync).
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TIERS, TIER_COPY, type Tier } from "./tiers";

const tierPillVariants = cva("tier", {
  variants: {
    tier: {
      measured: "measured",
      built: "built",
      thin: "thin",
    },
  },
});

export interface TierPillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    Omit<VariantProps<typeof tierPillVariants>, "tier"> {
  tier: Tier | null | undefined;
}

const TierPill = React.forwardRef<HTMLSpanElement, TierPillProps>(
  ({ tier, className, ...props }, ref) => {
    if (tier == null || !(tier in TIER_COPY)) return null;
    return (
      <span ref={ref} className={cn(tierPillVariants({ tier }), className)} {...props}>
        {TIER_COPY[tier].label}
      </span>
    );
  },
);
TierPill.displayName = "TierPill";

/**
 * The definitions paragraph that follows every ledger:
 * "Measured means... Built means... Thin means..." , generated from
 * TIER_COPY so it is structurally impossible for it to drift from the pills.
 */
const TierDefinitions = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("note", className)} {...props}>
    {TIERS.map((t, i) => (
      <React.Fragment key={t}>
        {i > 0 ? " " : null}
        <b>{TIER_COPY[t].label}</b> means {TIER_COPY[t].means}
      </React.Fragment>
    ))}
  </p>
));
TierDefinitions.displayName = "TierDefinitions";

export { TierPill, TierDefinitions, tierPillVariants };
export type { Tier };
