// shadcn Badge, atlas skin. Section 1 of master visual upgrade.
// Variants: default = atlas-700 fill, secondary = cream-100 surface,
// destructive = clay-700, outline = ink-200 border. All dark-mode
// selectors stripped. No em-dashes in non-comment lines.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-atlas-800",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-paper-200",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-clay-900",
        outline:
          "border-input bg-transparent text-foreground hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
