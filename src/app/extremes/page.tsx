/**
 * /extremes - the Extremes hub.
 *
 * The addictive front-of-house: a browsable set of ranked leaderboards of the
 * surprising highs and lows across the small-business data. Each leaderboard is
 * a real "extreme" that rewards browsing, and every row carries a real number
 * and links to a live cell.
 *
 * This page also carries the brand's slightly warmer, more editorial voice: a
 * knowledgeable friend showing you something fascinating, away from the blunt
 * benchmark register. The hard rules stay exactly as everywhere else, though:
 * never imply an upside without naming the catch, and never a fake number. The
 * warmth is in the framing, not in the figures.
 *
 * All numbers are resolved server-side in src/lib/extremes/leaderboards, which
 * reuses the homepage beats' discipline: one bounded across-states read per
 * leaderboard, the activity-page outlier fence, the misroute + is_synthetic
 * guards, and the shared after-tax take-home estimator. Each leaderboard
 * self-omits below five clean rows, and the page itself renders nothing if too
 * few resolve, so the hub never shows a broken or short board.
 *
 * Server component, revalidated daily. White, hairline-separated, mobile-first;
 * same board language (cream-50 card surface, warm-taupe hairlines, card
 * elevation token, font-display figures) as StatCard / RankRow, which it builds
 * on. Tokens only, no em-dashes, no source-agency names.
 */
import type { Metadata } from "next";
import { RankRow } from "@/components/board/RankRow";
import { fmtUSD } from "@/components/board/format";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { elevation } from "@/lib/design-tokens";
import { loadExtremes, type ExtremeLeaderboard } from "@/lib/extremes/leaderboards";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "The extremes: small-business highs and lows | Margin Atlas",
  description:
    "The surprising edges of the small-business world: where owners keep the most, where the same business barely clears, and what the catch is. Real numbers, ranked, each linking to the full benchmark.",
  alternates: { canonical: "/extremes" },
};

/** Smallest number of clean leaderboards worth opening the hub for. */
const MIN_BOARDS = 3;

/**
 * One leaderboard section: a warm eyebrow + title, the editorial intro that
 * names the catch, then the ranked rows on the cream card surface. Each row is
 * a RankRow whose value is the after-tax owner take-home and whose texture is
 * the net margin, so the upside always sits next to the share that survives.
 */
function LeaderboardSection({ board }: { board: ExtremeLeaderboard }) {
  return (
    <section className="border-t border-parchment pt-10 first:border-t-0 first:pt-0">
      <SectionEyebrow size="md" className="mb-2">
        {board.eyebrow}
      </SectionEyebrow>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance text-ink-900 md:text-3xl">
        {board.title}
      </h2>
      <p className="mt-2 mb-5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        {board.intro}
      </p>

      <div
        className="rounded-lg border border-parchment bg-cream-50 p-4 md:p-5"
        style={{ boxShadow: elevation.card }}
      >
        <div className="mb-2 flex items-baseline justify-end">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
            {board.valueCaption}
          </span>
        </div>
        {board.rows.map((row, i) => (
          <RankRow
            key={row.href}
            rank={i + 1}
            label={row.name}
            href={row.href}
            value={fmtUSD(row.takeHome)}
            texture={
              row.netMarginPct != null
                ? `${Math.round(row.netMarginPct)}% net`
                : undefined
            }
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
        Owner take-home is after tax, for a typical single-site operator in each
        state. Same currency, same method, so the states sit side by side
        honestly. Modeled from local business demography. Directional.
      </p>
    </section>
  );
}

export default async function ExtremesPage() {
  const { leaderboards } = await loadExtremes();

  // The hub is data-gated like every other surface: if too few leaderboards
  // resolve cleanly (a wide Supabase outage), render the hero and an honest
  // note rather than a thin or broken page. In normal operation all of them
  // resolve.
  const hasEnough = leaderboards.length >= MIN_BOARDS;

  return (
    <div className="pb-16">
      {/* Warm editorial hero. The eyebrow + a large serif H1 + one inviting
         paragraph establish the hub's warmer register: a curious tour of the
         data's edges, not a benchmark readout. The figures below stay exact. */}
      <header className="pt-8 pb-10 md:pt-10 md:pb-12">
        <SectionEyebrow size="md" className="mb-3">
          A field guide to the edges
        </SectionEyebrow>
        <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
          The extremes
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-cocoa-700 md:text-lg">
          Every small business has a best place and a worst place to run it, and
          the gap between them is wider than you would guess. These are the edges:
          where an owner keeps a surprising amount, and where the very same
          business barely clears once the rent, the staff, and the tax are paid.
          Browse them. Each line is a real number, and every name opens the full
          read for that place.
        </p>
      </header>

      {hasEnough ? (
        <div className="space-y-10">
          {leaderboards.map((board) => (
            <LeaderboardSection key={board.key} board={board} />
          ))}
        </div>
      ) : (
        <p className="max-w-2xl text-sm leading-relaxed text-cocoa-700">
          The leaderboards are refreshing right now. Check back in a moment, or
          browse the activities and cities in the meantime.
        </p>
      )}

      {/* Closing note: the one editorial line that ties the hub together and
         re-states the discipline, in the warmer voice. */}
      {hasEnough ? (
        <p className="mt-12 border-t border-parchment pt-6 max-w-2xl text-sm leading-relaxed text-cocoa-700">
          The lesson the edges keep teaching: revenue is the easy half of the
          story. What an owner actually keeps depends on where the business runs,
          and the same trade can be a comfortable living in one state and a
          knife-edge in another. That is the whole point of looking place by
          place.
        </p>
      ) : null}
    </div>
  );
}
