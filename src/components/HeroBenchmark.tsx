/**
 * Plan v23 Part 2 — story-first benchmark hero.
 *
 * Replaces the previous tile-dashboard hero. Single ENORMOUS revenue
 * figure under a question-form headline. Cream-paper background.
 * Display-serif typography. Atlas-700 accent.
 *
 * Server component. No client cost.
 */
import { CountryFlag } from "@/components/CountryFlag";
import { Money } from "@/components/Money";

type Props = {
  iso2: string;
  countryName: string;
  geoName: string;
  industryName: string;
  industryExamples?: string[] | null;
  sectorName?: string | null;
  revenue: number | null;
  currencySymbol?: string;
};

export function HeroBenchmark({
  iso2,
  countryName,
  geoName,
  industryName,
  industryExamples,
  sectorName,
  revenue,
  currencySymbol = "$",
}: Props) {
  return (
    <section id="hero" className="bg-cream-100 py-12 md:py-16 lg:py-20">
      {/* Eyebrow */}
      <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 flex items-center gap-2.5">
        {sectorName && (
          <>
            <span>{sectorName}</span>
            <span className="text-atlas-300">·</span>
          </>
        )}
        <CountryFlag iso2={iso2} className="w-5" />
        <span>{geoName}</span>
        <span className="text-atlas-300">·</span>
        <span>{countryName}</span>
      </div>

      {/* Question */}
      <h1 className="mt-4 md:mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 leading-[1.08] max-w-4xl">
        How much does a{" "}
        <span className="text-atlas-700 italic">{industryName.toLowerCase()}</span>
        {" "}make in {geoName}?
      </h1>

      {industryExamples && industryExamples.length > 0 && (
        <p className="mt-3 text-sm md:text-base text-cocoa-700/70 max-w-3xl">
          Includes: {industryExamples.slice(0, 5).join(" · ")}
        </p>
      )}

      {/* THE ONE NUMBER */}
      {revenue != null ? (
        <div className="mt-8 md:mt-12">
          <div className="text-xs md:text-sm uppercase tracking-[0.18em] text-cocoa-700/60 font-semibold mb-2">
            A typical one earns about
          </div>
          <div className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-ink-900 leading-[0.95]">
            <Money usd={revenue} />
            <span className="text-xl md:text-2xl text-atlas-700 align-baseline ml-2 font-display italic">
              a year
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-8 md:mt-12 text-lg text-ink-800 italic">
          The number for this combination isn&apos;t estimable with confidence yet.
        </div>
      )}
    </section>
  );
}
