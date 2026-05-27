/**
 * src/components/ui/error-state.tsx
 *
 * Error-state primitive for unrecoverable or recoverable failures
 * in data fetching, rendering, or user submission. Visually distinct
 * from EmptyState (clay-50 surface with a clay left-rule) so the
 * reader can tell at a glance whether something is missing-by-design
 * (empty) versus broken (error).
 *
 * Three intents:
 *
 *   - default: full hero error state with title, body, retry action
 *   - inline: compact horizontal bar suitable for embedding in a
 *     section that otherwise still has content (e.g. a sidebar
 *     widget failed but the page body is fine)
 *
 * Retry support:
 *   - `onRetry`: an event handler. Renders a Button. Use this when
 *     the parent owns the refetch logic (most common)
 *   - `retryHref`: a URL. Renders a Link. Use this when retrying
 *     means a full navigation (e.g. window.location.href = retryHref
 *     via the link)
 *
 * The component announces itself to assistive tech via role="alert"
 * so screen readers pick it up immediately when injected into the
 * DOM (versus role="status" which is polite, batched).
 *
 * Design system Phase 2, 2026-05-27.
 */
import * as React from "react";
import Link from "next/link";
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const errorStateVariants = cva(
  "relative border border-clay-100 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-clay-50 mx-auto pl-8 pr-6 py-8 sm:pl-10 sm:pr-8 sm:py-10 text-center max-w-2xl",
        inline: "bg-clay-50 p-4 flex items-start gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof errorStateVariants> {
  /** Title (h3 by default for "default" variant, inline span for "inline"). */
  title: React.ReactNode;
  /** Body copy below the title. */
  body?: React.ReactNode;
  /** Phosphor icon (or any ReactNode). Defaults to WarningCircle. */
  icon?: React.ReactNode;
  /** Heading level. Default h3 for default variant. Ignored for inline. */
  headingLevel?: 2 | 3 | 4;
  /** Retry handler. Renders a "Try again" Button. */
  onRetry?: () => void;
  /** Retry href. Renders a "Try again" Link. Wins over onRetry if both set. */
  retryHref?: string;
  /** Override the retry button label. */
  retryLabel?: string;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      variant = "default",
      title,
      body,
      icon,
      headingLevel = 3,
      onRetry,
      retryHref,
      retryLabel = "Try again",
      ...props
    },
    ref,
  ) => {
    const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
    const showLeftRule = variant === "default";
    const defaultIcon = (
      <WarningCircle size={variant === "inline" ? 20 : 28} weight="regular" aria-hidden="true" />
    );

    const retryEl = retryHref ? (
      <Link href={retryHref} className="inline-flex">
        <Button variant="outline" size="sm">
          <ArrowClockwise size={14} aria-hidden="true" />
          {retryLabel}
        </Button>
      </Link>
    ) : onRetry ? (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <ArrowClockwise size={14} aria-hidden="true" />
        {retryLabel}
      </Button>
    ) : null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        className={cn(errorStateVariants({ variant }), className)}
        {...props}
      >
        {showLeftRule && (
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-clay-500/80"
          />
        )}
        {variant === "default" ? (
          <>
            <div className="flex justify-center text-clay-700">{icon ?? defaultIcon}</div>
            <Heading className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink-900 leading-[1.2]">
              {title}
            </Heading>
            {body && (
              <p className="mt-2 text-base text-cocoa-700 leading-relaxed max-w-xl mx-auto">
                {body}
              </p>
            )}
            {retryEl && <div className="mt-4 flex justify-center">{retryEl}</div>}
          </>
        ) : (
          <>
            <div className="text-clay-700 shrink-0 mt-0.5">{icon ?? defaultIcon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-900 leading-tight">{title}</div>
              {body && <div className="text-sm text-cocoa-700 mt-1">{body}</div>}
            </div>
            {retryEl && <div className="shrink-0">{retryEl}</div>}
          </>
        )}
      </div>
    );
  },
);
ErrorState.displayName = "ErrorState";

export { ErrorState, errorStateVariants };
