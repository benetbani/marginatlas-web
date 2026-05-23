/**
 * EmptyState
 * ==========
 *
 * Reusable container for places in Margin Atlas where a section's data is
 * missing, sparse, or upcoming. Cream background, parchment border, a thin
 * amber rule on the left edge, calm copy, optional CTA.
 *
 * Title is rendered as a real heading. Pass `headingLevel` to set h2 vs h3
 * vs h4 depending on the page's outline.
 */

import { Compass } from "@phosphor-icons/react/dist/ssr";
import * as Ph from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";
import Link from "next/link";

export type EmptyStateProps = {
  title: string;
  body: string;
  suggestionHref?: string;
  suggestionLabel?: string;
  /** Phosphor PascalCase name, e.g. "Compass", "MapPin", "FileSearch". */
  iconName?: string;
  /** Heading level for the title. Default h3. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

export default function EmptyState({
  title,
  body,
  suggestionHref,
  suggestionLabel,
  iconName = "Compass",
  headingLevel = 3,
  className,
}: EmptyStateProps) {
  // Lazy lookup of a Phosphor icon by name, fall back to Compass.
  const Icon: PhIcon = ((Ph as unknown) as Record<string, PhIcon>)[iconName] ?? Compass;
  const Heading = (`h${headingLevel}`) as "h2" | "h3" | "h4";

  return (
    <div
      className={[
        "relative bg-cream-50 border border-parchment rounded-lg",
        "pl-8 pr-6 py-8 sm:pl-10 sm:pr-8 sm:py-10",
        "text-center mx-auto max-w-2xl",
        className ?? "",
      ].join(" ")}
    >
      {/* left-edge amber accent rule */}
      <span
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-atlas-500/80"
      />

      <div className="flex justify-center text-atlas-700">
        <Icon size={28} weight="regular" aria-hidden="true" />
      </div>

      <Heading className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink-900">
        {title}
      </Heading>

      <p className="mt-2 text-base text-cocoa-700 leading-relaxed">
        {body}
      </p>

      {suggestionHref && suggestionLabel && (
        <div className="mt-4">
          <Link
            href={suggestionHref}
            className="text-sm font-semibold text-atlas-700 underline-offset-4 hover:underline"
          >
            {suggestionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
