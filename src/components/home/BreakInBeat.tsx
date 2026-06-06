/**
 * src/components/home/BreakInBeat.tsx
 *
 * The homepage's LEAD data beat: the single break-in rating, made the front-page
 * hook. It answers the one question a would-be owner actually asks, "how easy is
 * it to break in and win here?", as one 0-100 number (higher = easier), then
 * shows both ends of that scale right now: the five easiest businesses-in-places
 * to break into, and the five hardest.
 *
 * Pure presentation. Every row is resolved server-side in src/lib/home/beats from
 * the SAME live break-in boards the /extremes hub and the cell mastheads carry
 * (no recomputation here), and handed in already real. This component only
 * formats and lays them out, and self-omits when the beat is absent, so the
 * homepage never shows a broken or one-sided block.
 *
 * Same board language as the rest of the kit (cream-50 card surface, warm-taupe
 * parchment hairlines, the card elevation token, font-display figures), with one
 * deliberate flourish for the shareable hook: the score itself is band-toned
 * (moss for a forgiving room, atlas for the workable middle, clay for a brutal
 * one), exactly the way the cell masthead colors its headline number. Two compact
 * columns on desktop, stacked on mobile. Tokens only, no em-dashes,
 * no source-agency names.
 */
import * as React from "react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { elevation } from "@/lib/design-tokens";
import type { BeatBreakIn, BeatBreakInRow } from "@/lib/home/beats";

/**
 * Band word to the score's text color. Higher reads better (moss), the workable
 * middle reads brand (atlas), the hard end reads the maroon danger token (clay),
 * matching BreakInScore on the cell masthead so the one number looks the same
 * everywhere. Falls back to brand for any unrecognised band so a new band word
 * can never render uncolored.
 */
function scoreTone(band: string): string {
  switch (band) {
    case "forgiving":
      return "text-moss-700";
    case "brutal":
      return "text-clay-700";
    case "manageable":
    case "demanding":
    default:
      return "text-atlas-700";
  }
}

/**
 * One ranked break-in row: a quiet rank badge, the business-in-place as a link to
 * its cell, the one-word band, and the band-toned score on the right. The same
 * hairline + badge language as the board's RankRow, with the score colored so the
 * scale reads at a glance.
 */
function BreakInRowLine({ rank, row }: { rank: number; row: BeatBreakInRow }) {
  return (
    <div className="flex items-baseline gap-3 border-t border-parchment py-3 first:border-t-0 first:pt-0">
      <span
        aria-hidden="true"
        className="inline-flex h-6 w-6 shrink-0 translate-y-0.5 items-center justify-center rounded-full border border-parchment bg-cream-50 font-display text-[12px] font-semibold tabular-nums text-cocoa-700"
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <Link
          href={row.href}
          className="font-display text-[15px] md:text-base font-semibold text-ink-900 transition-colors hover:text-atlas-700"
        >
          {row.label}
        </Link>
      </div>

      <span className="hidden shrink-0 text-[13px] capitalize text-cocoa-500 sm:inline">
        {row.band}
      </span>

      <span
        className={`shrink-0 text-right font-display text-base md:text-lg font-semibold tabular-nums ${scoreTone(
          row.band,
        )}`}
      >
        {row.score}
      </span>
    </div>
  );
}

/**
 * One labelled column of break-in rows on the cream card surface, with a small
 * caption row carrying the column's framing and the shared "break-in rating"
 * value caption above the figures.
 */
function BreakInColumn({
  eyebrow,
  rows,
}: {
  eyebrow: string;
  rows: BeatBreakInRow[];
}) {
  return (
    <div
      className="rounded-lg border border-parchment bg-cream-50 p-4 md:p-5"
      style={{ boxShadow: elevation.card }}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa-700">
          {eyebrow}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
          break-in rating
        </span>
      </div>
      {rows.map((row, i) => (
        <BreakInRowLine key={row.href} rank={i + 1} row={row} />
      ))}
    </div>
  );
}

/**
 * The lead break-in beat. Renders nothing when the beat is absent (the server
 * resolves it to null unless both ends came back clean), so the homepage band
 * collapses gracefully rather than showing a one-sided or empty block.
 */
export function BreakInBeat({ breakIn }: { breakIn: BeatBreakIn | null }) {
  if (!breakIn) return null;
  const { easiest, hardest } = breakIn;

  return (
    <section className="py-10 md:py-14">
      <SectionEyebrow size="md" className="mb-2">
        The break-in rating
      </SectionEyebrow>
      <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-ink-900 text-balance">
          Where it is easiest to break in right now
        </h2>
        <Link
          href="/extremes"
          className="text-sm font-medium text-atlas-700 transition-colors hover:text-atlas-900"
        >
          See the full rankings <span aria-hidden>&rarr;</span>
        </Link>
      </div>
      <p className="max-w-2xl text-sm md:text-base leading-relaxed text-cocoa-700 mb-6">
        One number, from 0 to 100, for how easy it is to break in and win in a
        place. A high score means low money down and a fast payback, with room to
        stand out. A low one means a heavy bill to open and a long road back to
        profit. Here is where that door swings widest today, and where it barely
        opens at all.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <BreakInColumn eyebrow="Easiest to break in" rows={easiest} />
        <BreakInColumn eyebrow="The hardest" rows={hardest} />
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-cocoa-500">
        Higher is easier. Each rating rests on real local earnings and modeled
        entry costs, and every row opens the full read for that place.
        Directional.
      </p>
    </section>
  );
}
