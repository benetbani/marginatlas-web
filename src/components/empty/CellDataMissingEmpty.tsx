/**
 * CellDataMissingEmpty (legacy entry point)
 * =========================================
 *
 * Cell-specific empty state for `/[country]/[geo]/[industry]` routes
 * where the cell exists in Atlas's taxonomy but has not been measured
 * yet. Composes the canonical `ui/empty-state` primitive with the
 * domain copy + three deep-link suggestions.
 *
 * Voice: never apologetic, never bureaucratic. Atlas is mapping the
 * world, and this corner is upcoming.
 *
 * Design system Phase 2 refactor, 2026-05-27. Public API unchanged.
 */

import { Compass } from "@phosphor-icons/react/dist/ssr";

import { EmptyState } from "@/components/ui/empty-state";

export type CellDataMissingEmptyProps = {
  /** Industry display name, e.g. "Restaurants". */
  industryName: string;
  /** Geography display name, e.g. "Asunción" or "Madrid". */
  geographyName: string;
  /** The nearest covered city we can route the reader to. */
  nearestCovered: { name: string; slug: string };
  /** Slug for the geography, e.g. "py/asuncion". */
  geoSlug: string;
  /** Slug for the industry, e.g. "restaurants". */
  industrySlug: string;
  /** Optional heading-level override. Default h2. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

export default function CellDataMissingEmpty({
  industryName,
  geographyName,
  nearestCovered,
  geoSlug,
  industrySlug,
  headingLevel = 2,
  className,
}: CellDataMissingEmptyProps) {
  return (
    <EmptyState
      icon={<Compass size={24} weight="regular" />}
      title={`We don't have ${industryName.toLowerCase()} data for ${geographyName} yet.`}
      body={
        <span className="font-display italic text-balance">
          Atlas is still mapping coverage for this corner of the world. We
          expect to publish {industryName.toLowerCase()} numbers for{" "}
          {geographyName} in the next quarterly refresh.
        </span>
      }
      headingLevel={headingLevel}
      suggestions={[
        {
          href: `/${nearestCovered.slug}/${industrySlug}`,
          label: `See ${industryName.toLowerCase()} in ${nearestCovered.name}`,
        },
        {
          href: `/${geoSlug}`,
          label: `See all industries in ${geographyName}`,
        },
        {
          href: "/sectors",
          label: "Try a different industry",
        },
      ]}
      className={className}
    />
  );
}
