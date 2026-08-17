/**
 * src/components/ui/pill.tsx
 *
 * Canonical pill / chip / tag primitive. Consolidates the ~6 ad-hoc
 * chip patterns scattered across the codebase (CategoryChip,
 * TurnoverBandChip, AuPrimaryDataBadge, CellWarningChips, etc.).
 *
 * Variants cover the semantic intents we actually use:
 *   - neutral : default, cream-100 surface
 *   - accent  : vermillion fill (atlas-700 surface, cream text)
 *   - subtle  : ghost — atlas-50 surface with atlas-700 text
 *   - success : moss tone (positive YoY, "good" indicator)
 *   - warning : amber tone for caution chips
 *   - danger  : clay tone (negative YoY, error, suppression)
 *   - outline : transparent surface, ink-200 border (less weight)
 *
 * Sizes:
 *   - sm: very small inline chips (10px text)
 *   - md: standard chip (12px text) — DEFAULT
 *   - lg: prominent badges (14px text)
 *
 * Polymorphic via `asChild` so it can wrap a `<Link>`, `<button>`,
 * or any other element while keeping the pill styling.
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        neutral: "bg-cream-100 text-cocoa-700 border border-parchment",
        accent: "bg-atlas-700 text-white",
        subtle: "bg-atlas-50 text-atlas-700 border border-atlas-200",
        // Terracotta, not moss: green is banned outright (founder 2026-08-09).
        // It sits a step above `subtle` on the same ramp, which is what the two
        // variants always meant relative to each other.
        success: "bg-atlas-100 text-atlas-700 border border-atlas-300/60",
        warning: "bg-cream-100 text-atlas-700 border border-atlas-200",
        danger: "bg-clay-100 text-clay-700 border border-clay-300/60",
        outline: "bg-transparent text-cocoa-700 border border-ink-200",
      },
      size: {
        sm: "text-[10px] tracking-[0.06em] uppercase px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  asChild?: boolean;
}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref as React.Ref<HTMLSpanElement>}
        className={cn(pillVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Pill.displayName = "Pill";

export { Pill, pillVariants };
