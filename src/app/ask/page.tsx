import { Suspense } from "react";
import { AskClient } from "./AskClient";

export const metadata = {
  title: "Ask Atlas — natural-language data queries | Margin Atlas",
  description: "Ask any question about small-business data in plain English. Powered by Claude with inline source citations.",
};

export default function AskPage() {
  return (
    <div>
      <header className="py-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-atlas-50 text-atlas-700 text-xs font-medium mb-3">
          Preview · Coming Soon
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          Ask Atlas — anything about small business
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Plain-English questions. Cited answers from real statistical-agency
          data. Available on the <strong>Pro plan</strong> when it ships.
        </p>
      </header>
      <Suspense fallback={<div>Loading…</div>}>
        <AskClient />
      </Suspense>
    </div>
  );
}
