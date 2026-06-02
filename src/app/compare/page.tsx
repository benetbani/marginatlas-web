import { Suspense } from "react";
import { CompareClient } from "./CompareClient";
import { MoreDepthBanner } from "@/components/monetization";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata = {
  title: "Compare snapshots | Margin Atlas",
  description: "Side-by-side comparison of business benchmarks across countries, industries, and sizes.",
};

export default function ComparePage() {
  return (
    <div>
      <header className="py-8">
        <SectionEyebrow size="md" className="mb-2">Compare</SectionEyebrow>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Compare snapshots side by side
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Pick up to 4 (country, industry) combinations to compare typical
          revenue, employment, and wages.
        </p>
      </header>
      {/* v34 Phase C — Compare side-by-side is a Premium feature
         (Part 4.1). The compare tool stays visible as a preview;
         the banner directs to the paywall. Phase D will swap to
         the full BlurredOverlay gating once Stripe is wired. */}
      <MoreDepthBanner
        headline="Side by side comparison of every quartile is a Premium feature."
        tier="premium"
        entry="compare_side_by_side"
      />
      <Suspense fallback={<div className="text-sm text-ink-700">Loading…</div>}>
        <CompareClient />
      </Suspense>
    </div>
  );
}
