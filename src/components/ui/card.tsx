// shadcn Card, atlas skin. Section 1 of master visual upgrade.
// Frontend-design pass 2026-05-25: rebased onto the .atlas-card utility
// from globals.css so the shadcn primitive and every hand-rolled card on
// the site share the same surface, hairline, shadow, and editorial hover
// gesture (2px vermillion top edge fades in, 1px lift). Variant prop
// added so callers can opt into .atlas-card-soft (secondary content) or
// .atlas-card-band (cards sitting on a solid white section). The default
// is the canonical white-paper article-card. CardTitle stays font-display.
// No em-dashes in non-comment lines.
import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "soft" | "band";

const VARIANT_CLASS: Record<CardVariant, string> = {
  default: "atlas-card",
  soft: "atlas-card-soft",
  band: "atlas-card-band",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        VARIANT_CLASS[variant],
        "text-card-foreground",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-display text-xl md:text-2xl tracking-tight text-ink-900",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
