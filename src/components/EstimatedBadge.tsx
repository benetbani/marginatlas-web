/**
 * Plan v25 Block 11 — "Estimated" disclosure badge for synthesized cells.
 *
 * Renders ONLY when the cell carries `is_synthetic = true` (set by
 * synthesizeCell() in src/lib/cells/fill_defaults.ts). Tells the user
 * the numbers are extrapolated from country and industry averages, not
 * measured directly.
 *
 * Sits between the hero and the narrative on the cell page, in the
 * same band as the substitution disclosure.
 *
 * Server component. Zero client cost.
 */

type Props = {
  isSynthetic: boolean;
  industryName?: string | null;
  geoName?: string | null;
};

export function EstimatedBadge({
  isSynthetic,
  industryName,
  geoName,
}: Props) {
  if (!isSynthetic) return null;
  const ind = industryName?.toLowerCase() || "this industry";
  const where = geoName || "this region";
  return (
    <section className="bg-cream-100 border-l-4 border-l-cocoa-500 py-5 md:py-6">
      <div className="text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-cocoa-700 mb-2">
        Estimated benchmark
      </div>
      <p className="text-base md:text-lg italic text-ink-900 max-w-3xl leading-relaxed">
        Direct measurements for{" "}
        <strong className="not-italic font-semibold text-cocoa-700">
          {ind}
        </strong>{" "}
        in{" "}
        <strong className="not-italic font-semibold text-cocoa-700">
          {where}
        </strong>{" "}
        aren&apos;t covered yet. The numbers below are synthesized from
        country and industry averages: useful as a starting point, not
        a precise reading of this exact cell.
      </p>
    </section>
  );
}
