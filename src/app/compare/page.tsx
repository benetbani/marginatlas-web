import { Suspense } from "react";
import { CompareClient } from "./CompareClient";

export const metadata = {
  title: "Compare cells | Margin Atlas",
  description: "Side-by-side comparison of business benchmarks across countries, industries, and sizes.",
};

export default function ComparePage() {
  return (
    <div>
      <header className="py-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Compare cells side by side
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Pick up to 4 (country, industry) combinations to compare typical
          revenue, employment, and wages.
        </p>
      </header>
      <Suspense fallback={<div className="text-sm text-ink-700">Loading…</div>}>
        <CompareClient />
      </Suspense>
    </div>
  );
}
