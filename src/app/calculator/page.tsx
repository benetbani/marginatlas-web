/**
 * /calculator — "How does my business compare?" percentile lookup.
 *
 * Wraps the existing /you page idea in a more obvious entry point. Users
 * enter country + industry + their typical revenue, the page renders
 * where they sit in the cell's distribution.
 */
import Link from "next/link";
import { COUNTRIES, INDUSTRIES, industryToSlug, isDefaultVisible } from "@/lib/taxonomy";
import { CalculatorForm } from "@/components/CalculatorForm";
import { MoreDepthBanner } from "@/components/monetization";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "Where do you sit?: Margin Atlas calculator",
  description:
    "Enter your country, industry, and typical revenue: see where your business sits in the distribution of similar firms.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  const countries = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));
  const industries = [...INDUSTRIES]
    .filter(isDefaultVisible)
    .map((i) => ({ id: i.id, name: i.name, slug: industryToSlug(i.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="py-10 max-w-3xl">
      <SectionEyebrow size="md">Calculator</SectionEyebrow>
      <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
        Where do you actually sit?
      </h1>
      <p className="mt-3 text-lg text-ink-800/80 leading-relaxed">
        Pick your country, your industry, and the typical revenue your firm
        does in a year. We&apos;ll show you which percentile that lands in
        for comparable businesses, plus the full benchmark for the deeper read.
      </p>

      <div className="mt-8">
        <CalculatorForm
          countries={countries.map((c) => ({ code: c.code, name: c.name }))}
          industries={industries}
        />
      </div>

      {/* v34 Phase C — calculator result panel shows the percentile
         to free users; Basic unlocks the full p25/p75 bracket position. */}
      <MoreDepthBanner
        headline="See the full p25 and p75 bracket position for your result."
        tier="basic"
        entry="calculator_brackets"
      />

      <section className="mt-12 grid sm:grid-cols-2 gap-3 text-sm">
        <Link
          href="/compare"
          className="block p-4 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition"
        >
          <div className="font-medium text-ink-900">Compare snapshots side-by-side →</div>
          <div className="text-xs text-ink-700/70 mt-1">
            Three benchmarks, one view. Same industry across regions, or three
            different industries in the same place.
          </div>
        </Link>
        <Link
          href="/browse"
          className="block p-4 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition"
        >
          <div className="font-medium text-ink-900">Browse the whole world →</div>
          <div className="text-xs text-ink-700/70 mt-1">
            Start from a place if you&apos;d rather pick a country first.
          </div>
        </Link>
      </section>

      <p className="mt-8 text-xs text-ink-700/60 max-w-2xl">
        The calculator uses the same benchmark data that powers the rest
        of the atlas. It does not collect or store the revenue number you
        enter; the comparison is computed in your browser using the
        bottom-10%, typical, and top-10% values for this industry and place.
      </p>
    </div>
  );
}
