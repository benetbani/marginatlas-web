/**
 * ComingSoonPlaceholderCard (legacy entry point)
 * ==============================================
 *
 * Silent placeholder for grid positions where the content is upcoming.
 * Composes the canonical `ui/empty-state` primitive at compact size
 * so the placeholder matches surrounding card chrome.
 *
 * Design system Phase 2 refactor, 2026-05-27. Public API unchanged.
 */

import { Hourglass } from "@phosphor-icons/react/dist/ssr";

import { EmptyState } from "@/components/ui/empty-state";

export type ComingSoonPlaceholderCardProps = {
  /** One-line description, e.g. "Country profile for Paraguay". */
  description: string;
  className?: string;
};

export default function ComingSoonPlaceholderCard({
  description,
  className,
}: ComingSoonPlaceholderCardProps) {
  return (
    <EmptyState
      size="compact"
      noLeftRule
      icon={<Hourglass size={16} weight="regular" />}
      title="Coming soon"
      body={description}
      aria-label={`Coming soon: ${description}`}
      className={["opacity-70 rounded-2xl", className ?? ""].join(" ")}
    />
  );
}
