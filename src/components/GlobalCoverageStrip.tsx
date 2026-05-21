/**
 * GlobalCoverageStrip — quiet editorial scope strip.
 *
 * Plan v15 Block 2: numeric country/cell counts removed per founder
 * R-002 catastrophic-flag. Now shows a featured flag rail with a
 * "Browse" CTA, no false-precision counts.
 */

import { CountryFlag } from "@/components/CountryFlag";

const FEATURED_FLAGS = ["US", "GB", "DE", "FR", "MX", "AU", "BR", "JP", "AL", "ZA"];

export async function GlobalCoverageStrip() {
  return (
    <section className="my-10">
      <div className="rounded-2xl border border-parchment bg-cream-100 p-6 md:p-8">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-semibold text-ink-900 tracking-tight">
            Small businesses, every corner of the world
          </div>
          <div className="mt-2 text-sm text-ink-800">
            From the metropolitan capitals to the smallest economies. One consistent benchmark.
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {FEATURED_FLAGS.map((iso2) => (
            <a
              key={iso2}
              href={`/${iso2.toLowerCase()}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-atlas-100 hover:text-atlas-700 border border-cream-300 text-xs font-medium text-ink-800 transition"
            >
              <CountryFlag iso2={iso2} className="w-4" />
              <span>{iso2}</span>
            </a>
          ))}
          <a
            href="/browse"
            className="inline-flex items-center px-3 py-1 rounded-full bg-atlas-600 hover:bg-atlas-700 text-cream-50 text-xs font-medium transition"
          >
            Browse all →
          </a>
        </div>
      </div>
    </section>
  );
}
