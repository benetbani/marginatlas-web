/**
 * src/components/ui/inline-link.tsx
 *
 * Inline link primitive with the focus + a11y guarantees the design
 * system requires:
 *
 *   - Visible focus ring at 2px+ ring-ring/40 with 2px offset
 *   - aria-label automatically set when `external` is true so
 *     screen readers announce "opens in a new tab"
 *   - rel="noopener noreferrer" auto-applied for external links
 *   - target="_blank" applied for external; never blank-link an
 *     internal route (breaks back-button + scroll restoration)
 *
 * Built on top of Next.js Link for internal hrefs (those starting
 * with "/" or relative paths) and a plain <a> for external. Detection
 * is automatic: pass `external` to override.
 *
 * Design system Phase 3, 2026-05-27.
 */
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inlineLinkVariants = cva(
  "underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 rounded-sm",
  {
    variants: {
      tone: {
        // Vermillion text with hover underline. Default for editorial copy.
        accent: "text-atlas-700 hover:underline",
        // Body-color link with persistent underline. Use in dense data tables.
        body: "text-cocoa-700 underline hover:text-atlas-700",
        // Muted link. Footer / secondary chrome.
        muted: "text-cocoa-700/70 hover:text-atlas-700 hover:underline",
      },
    },
    defaultVariants: {
      tone: "accent",
    },
  },
);

export interface InlineLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    VariantProps<typeof inlineLinkVariants> {
  href: string;
  /** Override external-detection. When true, opens in new tab with rel="noopener". */
  external?: boolean;
  /** Show an outbound arrow icon (default true when external). */
  showExternalIcon?: boolean;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

const InlineLink = React.forwardRef<HTMLAnchorElement, InlineLinkProps>(
  (
    {
      className,
      tone,
      href,
      external,
      showExternalIcon,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isExternal = external ?? isExternalHref(href);
    const finalShowIcon = showExternalIcon ?? isExternal;
    const finalAriaLabel = isExternal && !ariaLabel
      ? `${typeof children === "string" ? children : "Link"} (opens in a new tab)`
      : ariaLabel;

    const content = (
      <>
        {children}
        {finalShowIcon && (
          <ArrowUpRight
            size={12}
            weight="bold"
            aria-hidden="true"
            className="ml-0.5 inline-block align-[-0.0625em]"
          />
        )}
      </>
    );

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={finalAriaLabel}
          className={cn(inlineLinkVariants({ tone }), className)}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        aria-label={finalAriaLabel}
        className={cn(inlineLinkVariants({ tone }), className)}
        {...props}
      >
        {content}
      </Link>
    );
  },
);
InlineLink.displayName = "InlineLink";

export { InlineLink, inlineLinkVariants };
