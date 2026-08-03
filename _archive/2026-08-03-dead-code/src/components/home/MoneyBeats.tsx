/**
 * src/components/home/MoneyBeats.tsx
 *
 * The three data-rich homepage beats that replaced the featured-tiles grid:
 *
 *   1. Three editorial cards ("the same question, three very different answers")
 *      - each a real industry-in-place with real figures off the resolved cell
 *      and a one-line hook that names the upside AND what kills it.
 *   2. A ranked leaderboard ("where a gym actually pays") built on RankRow.
 *   3. A surprising spread: a humble business out-earning a prestigious one.
 *
 * Pure presentation. All numbers are resolved server-side in src/lib/home/beats
 * and handed in already real; this component only formats and lays them out.
 * Every section self-omits when its data is absent (fewer than two cards, no
 * clean leaderboard, no verified spread), so the homepage never shows a broken
 * card or a "coming soon" stub.
 *
 * White, hairline-separated, mobile-first; same board language (cream-50 card
 * surface, warm-taupe hairlines, card elevation token, font-display figures) as
 * StatCard / RankRow, which it builds on. Tokens only, no em-dashes.
 */
import * as React from "react";
import Link from "next/link";
import { RankRow } from "@/components/board/RankRow";
import { fmtUSD, fmtPct } from "@/components/board/format";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { elevation } from "@/lib/design-tokens";
import type {
  HomepageBeats,
  BeatCard,
  BeatStat,
} from "@/lib/home/beats";

/** Format one resolved stat into a label + display string for the card list. */
function formatStat(stat: BeatStat): { label: string; value: string; hint?: string } {
  if (stat.kind === "usd") {
    return { label: stat.label, value: fmtUSD(stat.value), hint: stat.hint };
  }
  if (stat.kind === "pct") {
    return { label: stat.label, value: fmtPct(stat.value), hint: stat.hint };
  }
  // orders
  return {
    label: stat.label,
    value: `${Math.round(stat.value)} a day`,
    hint: stat.hint,
  };
}

/**
 * One editorial card, built on the StatCard look (same surface tokens) with an
 * added editorial hook and a quiet "See the full read" link. Title links to the
 * resolved cell.
 */
function EditorialCard({ card }: { card: BeatCard }) {
  const stats = card.stats.map(formatStat);
  return (
    <article
      className="flex flex-col rounded-lg border border-parchment bg-cream-50 p-5 md:p-6"
      style={{ boxShadow: elevation.card }}
    >
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
        {card.eyebrow}
      </div>
      <Link
        href={card.href}
        className="mt-0.5 font-display text-lg font-semibold tracking-tight text-ink-900 transition-colors hover:text-atlas-700"
      >
        {card.title}
      </Link>

      <dl className="mt-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-baseline justify-between gap-4 border-t border-parchment py-2 first:border-t-0 first:pt-0"
          >
            <dt className="text-[11px] uppercase tracking-wide text-cocoa-500">
              {stat.label}
              {stat.hint ? (
                <span className="ml-1.5 normal-case tracking-normal text-cocoa-500/80">
                  {stat.hint}
                </span>
              ) : null}
            </dt>
            <dd className="font-display text-base font-semibold tabular-nums text-ink-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-sm leading-relaxed text-cocoa-700">{card.hook}</p>

      <Link
        href={card.href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-atlas-700 transition-colors hover:text-atlas-900"
      >
        See the full read <span aria-hidden>&rarr;</span>
      </Link>
    </article>
  );
}

export function MoneyBeats({ beats }: { beats: HomepageBeats }) {
  const { cards, leaderboard, spread } = beats;
  const hasCards = cards.length >= 2;
  // Nothing resolved at all: render nothing rather than an empty band.
  if (!hasCards && !leaderboard && !spread) return null;

  return (
    <>
      {/* 1. Three editorial cards: the same question, three very different
          answers. Each is a real industry-in-place with real figures and a hook
          that names the upside and the killer. */}
      {hasCards && (
        <section className="py-10">
          <SectionEyebrow size="md" className="mb-2">
            The same question, three answers
          </SectionEyebrow>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
              "How much does it make?" depends entirely on what and where
            </h2>
            <a
              href="/browse"
              className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
            >
              Browse everything &rarr;
            </a>
          </div>
          <p className="text-sm text-cocoa-700 max-w-2xl mb-6">
            Three businesses people recognize on sight, each with the number that
            actually matters: what the owner keeps after the rent, the staff, and
            the tax are paid. The headline revenue is the easy part.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr">
            {cards.map((card) => (
              <EditorialCard key={card.href} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Ranked leaderboard: where a {business} actually pays. Real US-state
          cells, ranked by owner take-home, garbage tails dropped by the same
          fence the activity page uses. */}
      {leaderboard && (
        <section className="py-10 border-t border-parchment">
          <SectionEyebrow size="md" className="mb-2">
            The leaderboard
          </SectionEyebrow>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 mb-1">
            Where a {leaderboard.business} actually pays
          </h2>
          <p className="text-sm text-cocoa-700 max-w-2xl mb-5">
            The states we cover for this business, ranked by what a typical owner
            keeps after tax. Same currency, same method, best at the top. Open any
            row for the full revenue, cost stack, and survival read.
          </p>
          <div className="rounded-lg border border-parchment bg-cream-50 p-4 md:p-5" style={{ boxShadow: elevation.card }}>
            {leaderboard.rows.map((row, i) => (
              <RankRow
                key={row.href}
                rank={i + 1}
                label={row.name}
                href={row.href}
                value={fmtUSD(row.takeHome)}
                texture={row.netMarginPct != null ? `${Math.round(row.netMarginPct)}% net` : undefined}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] text-cocoa-500">
            Owner take-home is after tax, for a typical single-site operator.
            Modeled from local business demography. Directional.
          </p>
        </section>
      )}

      {/* 3. Surprising spread: one humble business out-earning a prestigious one
          per owner. Both figures are real; the beat omits itself when the humble
          business does not genuinely win. */}
      {spread && (
        <section className="py-10 border-t border-parchment">
          <SectionEyebrow size="md" className="mb-2">
            The surprise
          </SectionEyebrow>
          <div
            className="rounded-lg border border-parchment bg-cream-50 p-6 md:p-8"
            style={{ boxShadow: elevation.card }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 max-w-3xl text-balance">
              A {spread.humble.label} can out-earn a {spread.prestige.label}, to the owner
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 max-w-2xl">
              <Link
                href={spread.humble.href}
                className="group flex items-baseline justify-between gap-3 rounded-md border border-parchment bg-white px-4 py-3 transition-colors hover:border-atlas-500"
              >
                <span className="text-sm font-medium text-ink-900 transition-colors group-hover:text-atlas-700 first-letter:uppercase">
                  {spread.humble.label}
                </span>
                <span className="font-display text-lg font-semibold tabular-nums text-ink-900">
                  {fmtUSD(spread.humble.takeHome)}
                </span>
              </Link>
              <Link
                href={spread.prestige.href}
                className="group flex items-baseline justify-between gap-3 rounded-md border border-parchment bg-white px-4 py-3 transition-colors hover:border-atlas-500"
              >
                <span className="text-sm font-medium text-ink-900 transition-colors group-hover:text-atlas-700 first-letter:uppercase">
                  {spread.prestige.label}
                </span>
                <span className="font-display text-lg font-semibold tabular-nums text-ink-900">
                  {fmtUSD(spread.prestige.takeHome)}
                </span>
              </Link>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cocoa-700 max-w-2xl">
              Same question, opposite reputations. The prestige business grosses
              less and still carries the cost base; the humble one runs on volume
              and keeps more at the bottom. Revenue is not the score. Take-home is.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
