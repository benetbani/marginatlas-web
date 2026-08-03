/**
 * EmptyState (legacy entry point)
 * ===============================
 *
 * Thin wrapper around the canonical `src/components/ui/empty-state.tsx`
 * primitive (Design system Phase 2, 2026-05-27). Preserves the old
 * default-export shape so existing call sites work unchanged. New
 * code should import from `@/components/ui/empty-state` directly.
 */

import { Compass } from "@phosphor-icons/react/dist/ssr";
import * as Ph from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";

import { EmptyState as EmptyStatePrimitive } from "@/components/ui/empty-state";

export type EmptyStateProps = {
  title: string;
  body: string;
  suggestionHref?: string;
  suggestionLabel?: string;
  /** Phosphor PascalCase name. */
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
  const Icon: PhIcon = ((Ph as unknown) as Record<string, PhIcon>)[iconName] ?? Compass;
  const suggestions =
    suggestionHref && suggestionLabel
      ? [{ href: suggestionHref, label: suggestionLabel }]
      : undefined;

  return (
    <EmptyStatePrimitive
      title={title}
      body={body}
      icon={<Icon size={28} weight="regular" />}
      headingLevel={headingLevel}
      suggestions={suggestions}
      className={className}
    />
  );
}
