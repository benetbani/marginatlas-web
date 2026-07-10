/**
 * /dev/home2 , the thin server route for the rebuilt homepage (Wave 2 Task 6).
 *
 * Awaits the real Margin Index board for restaurants (the SAME resolver run the live
 * /margin-index route uses: slugToIndustry -> rankPlacesForTrade -> toMarginIndexBoard)
 * and the real blog post list, derives one honest headline insight from the board's top
 * row, and hands everything to Home2View. Nothing is invented here: a missing board or a
 * thin blog list is passed straight through, and Home2View's own chapters self-omit.
 *
 * The page owns the outer <main> container; Home2View contributes Full/Narrow fragments
 * (the established convention, see src/app/dev/decide-v2/page.tsx).
 */
import { rankPlacesForTrade, slugToIndustry } from "@/lib/scores/recommend";
import { toMarginIndexBoard } from "@/lib/scores/margin_index";
import { getAllPosts } from "@/lib/blog";
import { Home2View } from "./home2-view";

// Matches /margin-index and the live homepage: a daily-refreshed resolver run, not a
// per-request fetch. This dev route has no request-time params to react to.
export const revalidate = 86400;

export default async function Home2Page() {
  const ind = slugToIndustry("restaurants");
  const result = ind ? await rankPlacesForTrade(ind.id, { budgetUsd: null }) : null;
  const marginIndexBoard = result ? toMarginIndexBoard(result) : null;

  // The one honest headline stat: the board's top row, ONLY when its keep share is real
  // (never a fabricated percentage on a dashed/unknown row).
  const top = marginIndexBoard?.rows[0];
  const insight =
    top && top.keepKnown && top.keepPct != null
      ? `${top.name} keeps ${top.keepPct}% of a restaurant's revenue`
      : null;

  // Real posts only. getAllPosts() already self-guards a missing content dir; the
  // try/catch is extra defense so a malformed post's frontmatter can never break the route.
  let blogPosts: ReturnType<typeof getAllPosts> = [];
  try {
    blogPosts = getAllPosts();
  } catch {
    blogPosts = [];
  }

  return (
    <main className="mx-auto max-w-[1120px] px-4 py-8 md:px-6">
      <Home2View insight={insight} marginIndexBoard={marginIndexBoard} blogPosts={blogPosts} />
    </main>
  );
}
