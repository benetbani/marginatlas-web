/**
 * Low-confidence estimate banner.
 *
 * Renders on cells whose coverage tier is X (extrapolated or synthesized):
 * country-level estimates modeled from indicators rather than measured firm
 * data. Without this, a tier-X cell shows clean numbers with no caveat, because
 * the hero coverage word is intentionally silent on weak tiers. This gives the
 * reader an explicit, quiet signal that the figure is orientation, not a
 * measurement.
 *
 * Styled to match CellFallbackBanner, with a lighter left rule so it reads as a
 * caveat rather than a redirect. Server component, zero client cost.
 */

type Props = {
  /** Display place (geo or country) the cell is for. */
  place?: string | null;
  /** Industry display name. */
  industryName?: string | null;
};

export function LowConfidenceBanner({ place, industryName }: Props) {
  const ind = (industryName || "this activity").toLowerCase();
  const where = place ? ` in ${place}` : "";
  return (
    <section className="bg-cream-100 border-l-4 border-l-atlas-300 py-5 md:py-6">
      <div className="text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-atlas-700 mb-2">
        Low-confidence estimate
      </div>
      <p className="text-base md:text-lg italic text-ink-900 max-w-3xl leading-relaxed">
        We do not have measured data for {ind}
        {where} yet, so these numbers are modeled from country-level indicators
        and kept within a plausible small-business range. Read them as
        orientation, not a precise figure.
      </p>
    </section>
  );
}
