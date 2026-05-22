/**
 * Plan v24 Block 3.2 — substitution disclosure banner.
 *
 * Renders ONLY when the cell page's resolved cell carries data from a
 * different industry than the URL requested (the PARENT_FALLBACK_MAP
 * walked from the requested industry to a covered cousin). Tells the
 * user explicitly so they don't read fallback numbers as direct
 * measurements.
 *
 * Sits between the hero and the narrative on the cell page.
 *
 * Server component. Zero client cost.
 */

type Props = {
  /** The industry name the user asked for (from URL). */
  requestedIndustryName: string;
  /** The industry name whose data we're actually showing. */
  actualIndustryName: string;
  /** Optional: link back to the actual-industry page so user can see context. */
  actualIndustryHref?: string | null;
};

export function CellFallbackBanner({
  requestedIndustryName,
  actualIndustryName,
  actualIndustryHref,
}: Props) {
  if (
    !requestedIndustryName ||
    !actualIndustryName ||
    requestedIndustryName.toLowerCase() === actualIndustryName.toLowerCase()
  ) {
    return null;
  }

  return (
    <section className="bg-cream-100 border-l-4 border-l-atlas-700 py-5 md:py-6">
      <div className="text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-atlas-700 mb-2">
        Closest comparable category
      </div>
      <p className="text-base md:text-lg italic text-ink-900 max-w-3xl leading-relaxed">
        Direct data for{" "}
        <strong className="not-italic font-semibold text-atlas-700">
          {requestedIndustryName.toLowerCase()}
        </strong>{" "}
        isn&apos;t covered yet for this location. The numbers below are for{" "}
        {actualIndustryHref ? (
          <a
            href={actualIndustryHref}
            className="not-italic font-semibold text-atlas-700 hover:text-atlas-900 border-b border-atlas-200 hover:border-atlas-500 pb-0.5 transition-colors"
          >
            {actualIndustryName.toLowerCase()}
          </a>
        ) : (
          <strong className="not-italic font-semibold text-atlas-700">
            {actualIndustryName.toLowerCase()}
          </strong>
        )}
        , the closest comparable category we cover.
      </p>
    </section>
  );
}
