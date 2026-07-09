/**
 * /margin-index , the fully-free, crawlable keep-ranked leaderboard.
 *
 * Wave 2 Task 4. New route, server component, ISR daily. Resolves a sensible
 * default board (restaurants, places-for-trade) via the recommender resolver
 * (rankPlacesForTrade, src/lib/scores/recommend.ts) reshaped by toMarginIndexBoard
 * (src/lib/scores/margin_index.ts), then renders the controls island + the SSR
 * view inside SpineShell. Server-rendered so the no-JS answer is present
 * (crawlable) and the flag is a soft pre-launch guard, not a hard requirement:
 * this is a new route with no live version to protect, so it defaults to
 * rendering.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { isMarginIndexEnabled } from "@/lib/feature_flags";
import { rankPlacesForTrade, slugToIndustry } from "@/lib/scores/recommend";
import { toMarginIndexBoard } from "@/lib/scores/margin_index";
import { MarginIndexView } from "./margin-index-view";
import { MarginIndexControls } from "./margin-index-controls";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "The Margin Index: where small businesses keep the most",
  alternates: { canonical: "/margin-index" },
};

export default async function MarginIndexPage() {
  // New route: default to rendering (free + crawlable). The flag exists so the
  // founder can keep it dark until launch by setting NEXT_PUBLIC_MARGIN_INDEX=0.
  if (process.env.NEXT_PUBLIC_MARGIN_INDEX === "0" && !isMarginIndexEnabled()) notFound();

  const ind = slugToIndustry("restaurants");
  const result = ind ? await rankPlacesForTrade(ind.id, { budgetUsd: null }) : null;

  return (
    <SpineShell>
      <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
        <MarginIndexControls />
        {result ? (
          <MarginIndexView board={toMarginIndexBoard(result)} />
        ) : (
          <p>The Margin Index is filling in. Check back soon.</p>
        )}
      </main>
    </SpineShell>
  );
}
