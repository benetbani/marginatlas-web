/**
 * src/components/ui/empty-state.tsx
 *
 * Single empty-state primitive. Consolidates the four scattered
 * patterns that lived across src/components/EmptyState.tsx and
 * src/components/empty/* into one component with size + tone
 * variants and named slots.
 *
 * Three semantic intents:
 *
 *   - default: data is upcoming or unavailable. White surface,
 *     vermillion left rule, optional suggestion chips below the body
 *   - hatched: this surface is intentionally not measured (e.g. a
 *     sector dominated by corporates). Neutral muted fill with a
 *     diagonal hatch, so users learn it's a category-level decision,
 *     not a data gap
 *   - compact: small inline card for grid positions, no left rule,
 *     no centered hero treatment
 *
 * The two lines above described both surfaces as cream. Neither has been
 * for some time: `default` renders bg-white and the hatch now reads the
 * retoned neutral tokens. A stale sentence about colour is how a banned
 * colour comes back, so it is corrected rather than left as history.
 *
 * Accessibility:
 *   - Title is a real heading at the level the consumer passes
 *     (h2 / h3 / h4); never just a styled <div>
 *   - Icon is aria-hidden because the title carries the meaning
 *   - Suggestion chips are real <a> links inheriting focus rings
 *     from the underlying Next.js Link component
 *
 * Design system Phase 2, 2026-05-27. Supersedes:
 *   - src/components/EmptyState.tsx
 *   - src/components/empty/CellDataMissingEmpty.tsx
 *   - src/components/empty/ComingSoonPlaceholderCard.tsx
 *   - src/components/empty/SectorUnderConstructionEmpty.tsx
 * Those files now re-export from this primitive.
 */
import * as React from "react";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";

const emptyStateVariants = cva(
  "relative border border-parchment rounded-lg mx-auto",
  {
    variants: {
      variant: {
        default: "bg-white",
        hatched: "", // bg applied inline due to repeating-linear-gradient
        muted: "bg-paper-100",
      },
      size: {
        default: "pl-8 pr-6 py-8 sm:pl-10 sm:pr-8 sm:py-10 text-center max-w-2xl",
        compact: "p-5 max-w-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Diagonal hatch for the "intentionally not measured" variant.
 *
 * THESE WERE THE LAST THREE WARM VALUES ON THE SITE, and they survived the
 * whole cream purge by being written out by hand. The ramp's 100 step was
 * retoned from #f7f6f4 to a true neutral and `parchment` from #e4e2dd to
 * #e3e3e3, but this file did not read either token: it spelled the old numbers
 * as rgb() strings, so every retone passed straight over it and it went on
 * painting warm sand under a hatch of warm taupe.
 *
 * Neither gate could see it either. `verify_no_cream` matches the word plus a
 * list of HEX literals, and its rgb net carried exactly one pattern, for a page
 * ground that no longer exists, so it caught nothing at all. Widened in the
 * same commit as this fix, and derived from the warm set rather than hand-kept,
 * so the two lists cannot drift apart again.
 *
 * The comment this replaces cited design-system.md 3.3 to argue that a cool
 * grey was banned and cream was correct. That is now exactly inverted: the
 * founder banned cream outright on 2026-08-16 and the ratified palette is
 * terracotta plus COOL neutrals.
 *
 * Token reads, not literals, which is the point: the next retone reaches this.
 * The `99` suffix is the 0.6 alpha the hatch lines already had, preserved
 * rather than dropped, because full-strength parchment is a visibly heavier
 * rule than a 60% one and this hatch is meant to whisper.
 */
const HATCH_STYLE: React.CSSProperties = {
  backgroundColor: colors.paper[100],
  backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, transparent 14px, ${colors.parchment}99 14px, ${colors.parchment}99 15px)`,
};

export type EmptyStateSuggestion = {
  label: string;
  href: string;
};

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof emptyStateVariants> {
  /** Title rendered as a semantic heading. Required. */
  title: React.ReactNode;
  /** Body copy below the title. */
  body?: React.ReactNode;
  /** Phosphor icon (or any ReactNode). Centered above the title. */
  icon?: React.ReactNode;
  /** Heading level for the title. Default h3 for default size, h4 for compact. */
  headingLevel?: 2 | 3 | 4;
  /** Optional action below the body. Pass a <Link> or <Button>. */
  action?: React.ReactNode;
  /** Optional row of chip-style deep-link suggestions. */
  suggestions?: EmptyStateSuggestion[];
  /** When true, suppress the vermillion left edge rule. Default false. */
  noLeftRule?: boolean;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      title,
      body,
      icon,
      headingLevel,
      action,
      suggestions,
      noLeftRule,
      style,
      ...props
    },
    ref,
  ) => {
    const Heading = `h${headingLevel ?? (size === "compact" ? 4 : 3)}` as
      | "h2"
      | "h3"
      | "h4";
    const showLeftRule = !noLeftRule && size === "default";
    const mergedStyle: React.CSSProperties = {
      ...(variant === "hatched" ? HATCH_STYLE : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ variant, size }), className)}
        style={mergedStyle}
        {...props}
      >
        {showLeftRule && (
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-atlas-500/80"
          />
        )}

        {size === "compact" ? (
          <CompactBody icon={icon} title={title} body={body} Heading={Heading} />
        ) : (
          <DefaultBody
            icon={icon}
            title={title}
            body={body}
            action={action}
            suggestions={suggestions}
            Heading={Heading}
          />
        )}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";

function DefaultBody({
  icon,
  title,
  body,
  action,
  suggestions,
  Heading,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  action?: React.ReactNode;
  suggestions?: EmptyStateSuggestion[];
  Heading: "h2" | "h3" | "h4";
}) {
  return (
    <>
      {icon && (
        <div className="flex justify-center text-atlas-700" aria-hidden="true">
          {icon}
        </div>
      )}
      <Heading className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink-900 leading-[1.2]">
        {title}
      </Heading>
      {body && (
        <p className="mt-2 text-base text-cocoa-700 leading-relaxed max-w-xl mx-auto">
          {body}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-parchment text-cocoa-700 text-sm font-semibold px-3 py-1.5 transition-colors hover:bg-white hover:text-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
            >
              <span>{s.label}</span>
              <CaretRight size={12} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function CompactBody({
  icon,
  title,
  body,
  Heading,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  Heading: "h2" | "h3" | "h4";
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        {icon && (
          <span className="text-atlas-700" aria-hidden="true">
            {icon}
          </span>
        )}
        <Heading className="text-[10px] tracking-[0.18em] uppercase font-semibold text-cocoa-700/70 leading-none">
          {title}
        </Heading>
      </div>
      {body && (
        <p className="mt-4 text-sm text-cocoa-700 leading-snug">{body}</p>
      )}
    </>
  );
}

export { EmptyState, emptyStateVariants };
