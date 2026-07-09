/**
 * /dev/decide-v2 , the thin server route rendering a REAL resolver run.
 *
 * Wave 1 Task 7. Resolves the "restaurants" trade slug to an industryId and calls
 * rankPlacesForTrade (the real async orchestrator, src/lib/scores/recommend.ts) so
 * the ranked answer on this page is production data, not the DEV_SEED illustrative
 * fixture recommend-view.tsx ships for standalone preview.
 *
 * force-static: this dev route has no request-time searchParams wiring yet, so it
 * renders one fixed default query (restaurants, places-for-trade). The client
 * island (./recommend-client) only edits the URL's query string for a later,
 * live (non-static) route to read; it never re-fetches client-side here.
 */
import { rankPlacesForTrade, slugToIndustry } from "@/lib/scores/recommend";
import { RecommendView } from "./recommend-view";
import { RecommendControls } from "./recommend-client";

export const dynamic = "force-static";

export default async function DecideV2Page() {
  const ind = slugToIndustry("restaurants");
  const result = ind ? await rankPlacesForTrade(ind.id, { budgetUsd: null }) : null;
  return (
    <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
      <RecommendControls />
      {result ? <RecommendView result={result} /> : <p>No covered places yet.</p>}
    </main>
  );
}
