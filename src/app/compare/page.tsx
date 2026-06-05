import { Suspense } from "react";
import { CompareClient } from "./CompareClient";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata = {
  title: "Compare snapshots | Margin Atlas",
  description:
    "Put the same small business in up to three cities side by side: typical revenue, net margin, owner take-home, rent and labor pressure, and the spread.",
};

export default function ComparePage() {
  return (
    <div>
      <header className="border-b border-parchment/60 py-8 sm:py-10">
        <SectionEyebrow size="md" className="mb-3">
          Compare
        </SectionEyebrow>
        <h1 className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 sm:text-4xl">
          Same business, up to three cities. Which one is worth it?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-graphite">
          Set up to three cities, then read the figures that decide it. The same
          activity earns very different money in different places, and the
          biggest revenue number is rarely the one that leaves an owner the most.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            className="py-10 text-sm text-cocoa-500"
            role="status"
            aria-live="polite"
          >
            Loading the comparison
          </div>
        }
      >
        <CompareClient />
      </Suspense>
    </div>
  );
}
