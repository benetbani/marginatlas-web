/**
 * /dev/gold-mine , catalog story for the GoldMineCard (noindex, internal).
 *
 * The constitution's required catalog story before the component is wired into
 * the map sidebar, the recommender, and pages. London examples use the curated
 * exemplar figures. Tokens only, no em-dashes, internal-only route.
 */
import type { Metadata } from "next";
import { GoldMineCard } from "@/components/kit/GoldMineCard";

export const metadata: Metadata = {
  title: "Gold-mine card , catalog",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-cream-75 font-sans text-ink-900 antialiased">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700">Kit catalog</p>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-ink-900">Gold-mine intel card</h1>
        <p className="mt-3 leading-relaxed text-ink-600">
          The signature payoff: one non-obvious conclusion derived from owned data, carrying the
          evidence it binds to and an as-of stamp. Reused on the map sidebar, the recommender, and
          pages. The last card shows the honest not-held state.
        </p>

        <div className="mt-10 grid gap-5">
          <GoldMineCard
            glyph="bulb"
            claim="Nightlife-led and weekend-heavy. A weekday-lunch-only model rarely clears the rent here; the money is after dark."
            evidence={[
              { label: "Rent", value: "80/100" },
              { label: "Footfall", value: "85/100" },
              { label: "Saturation", value: "88/100" },
            ]}
            asOf="June 2026"
          />

          <GoldMineCard
            eyebrow="Local intel"
            glyph="clock"
            claim="A weekday lunch economy: heavy midday spend, quiet after 8pm and on weekends. Plan for a five-day week."
            evidence={[
              { label: "Spend", value: "90/100" },
              { label: "Footfall", value: "80/100" },
            ]}
            asOf="June 2026"
          />

          <GoldMineCard
            glyph="coin"
            claim="Where global wealth parks, not where the middle market shops. Luxury or nothing; price-sensitivity here is near zero."
            evidence={[
              { label: "Spend", value: "98/100" },
              { label: "Rent", value: "98/100" },
            ]}
            asOf="June 2026"
          />

          <GoldMineCard claim={null} />
        </div>
      </div>
    </main>
  );
}
