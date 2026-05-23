/**
 * CellDataMissingEmpty
 * ====================
 *
 * Shown on any /[country]/[geo]/[industry] route where the cell exists in
 * Atlas's taxonomy but has not been measured yet. Builds on the existing
 * <EmptyState> primitive with three deep-link suggestion chips so the
 * reader always has a one-tap escape that lands them on real numbers.
 *
 * Voice: never apologetic, never bureaucratic. Atlas is mapping the world,
 * and this corner is upcoming.
 */

import Link from "next/link";
import { Compass, CaretRight } from "@phosphor-icons/react/dist/ssr";

export type CellDataMissingEmptyProps = {
  /** Industry display name, e.g. "Restaurants" (used in title-cased copy). */
  industryName: string;
  /** Geography display name, e.g. "Asunción" or "Madrid". */
  geographyName: string;
  /** The nearest covered city we can route the reader to. */
  nearestCovered: { name: string; slug: string };
  /** Slug for the geography itself, e.g. "py/asuncion". */
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
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-atlas-500/85" />

      <div className="flex justify-center text-atlas-700">
        <Compass size={24} weight="regular" aria-hidden="true" />
      </div>

      <Heading className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink-900 leading-[1.2]">
        We don't have {industryName.toLowerCase()} data for {geographyName} yet.
      </Heading>

      <p className="font-display italic mt-2 text-base text-cocoa-700 text-balance leading-relaxed max-w-xl mx-auto">
        Atlas is still mapping coverage for this corner of the world. We expect
        to publish {industryName.toLowerCase()} numbers for {geographyName} in
        the next quarterly refresh.
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <SuggestionChip href={`/${nearestCovered.slug}/${industrySlug}`}>
          See {industryName.toLowerCase()} in {nearestCovered.name}
        </SuggestionChip>
        <SuggestionChip href={`/${geoSlug}`}>
          See all industries in {geographyName}
        </SuggestionChip>
        <SuggestionChip href="/sectors">
          Try a different industry
        </SuggestionChip>
      </div>
    </div>
  );
}

function SuggestionChip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-cream-50 border border-parchment text-cocoa-700 text-sm font-semibold px-3 py-1.5 transition-colors hover:bg-white hover:text-atlas-700"
    >
      <span>{children}</span>
      <CaretRight size={12} aria-hidden="true" />
    </Link>
  );
}
