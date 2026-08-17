/**
 * src/components/board/StatCard.tsx
 *
 * A titled white card wrapping a short stat list. It is the vertical sibling of
 * StatGrid: where StatGrid lays cells out in a responsive grid, StatCard stacks
 * them as label-left / value-right rows under a heading, with a hairline between
 * each row. Used where a page wants one card per entity (a city, a sector) each
 * carrying a handful of real figures.
 *
 * It speaks the same board language as StatGrid and DataSection by design:
 *   - The micro-label is the same uppercase cocoa-500 treatment.
 *   - Values are tabular display figures; a null or MISSING value renders the
 *     one board dash in a muted tone, so a blank reads as deliberate, not
 *     broken. Same rule as StatGrid: show the number plainly or show a dash.
 *   - An optional footnote is the same quiet modeled note as DataSection, one
 *     per card rather than a badge per row.
 *
 * The title may be a link (pass href) so a card can double as a directory
 * entry. An optional eyebrow sits above the title, and an optional leading
 * slot (e.g. a flag) sits beside it.
 *
 * Server component. Tokens only, mobile-first. The card surface is the site's
 * canonical `.atlas-card`, which carries the fill, the hairline and the seating
 * shadow in one class, matching every other board card.
 */
import * as React from "react";
import Link from "next/link";
import { MISSING } from "./format";

/**
 * One stat in a card. `value` is a pre-formatted string (route numbers through
 * ./format first) or null for a blank. `hint` is an optional sub-label for a
 * unit or qualifier ("per year", "modeled").
 */
export type StatCardStat = {
  label: string;
  value: string | null;
  hint?: string;
};

export interface StatCardProps {
  /** Card title. Rendered as a link when `href` is set, plain text otherwise. */
  title: string;
  /** Optional destination; makes the title a link to a detail page. */
  href?: string;
  /** Optional small uppercase label above the title. */
  eyebrow?: string;
  /** Optional leading node beside the title, e.g. a CountryFlag. */
  leading?: React.ReactNode;
  /** The stat rows, rendered in order. A null value shows the board dash. */
  stats: StatCardStat[];
  /** Optional quiet note at the foot of the card (e.g. a modeled-data line). */
  footnote?: React.ReactNode;
  /** Optional extra classes on the card surface. */
  className?: string;
}

export function StatCard({
  title,
  href,
  eyebrow,
  leading,
  stats,
  footnote,
  className,
}: StatCardProps) {
  return (
    <article
      // Canonical surface: was "rounded-lg border border-parchment bg-cream-50"
      // plus an inline boxShadow from the elevation token. .atlas-card carries
      // the fill, the hairline AND the seating shadow, so the inline style went
      // with it: an inline shadow beats the class and would have pinned this
      // card to a second elevation nobody else uses.
      className={`atlas-card p-4 md:p-5${className ? ` ${className}` : ""}`}
    >
      <div className="flex items-center gap-2.5">
        {leading ? <span className="shrink-0">{leading}</span> : null}
        <div className="min-w-0">
          {eyebrow ? (
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa-500">
              {eyebrow}
            </div>
          ) : null}
          {href ? (
            <Link
              href={href}
              className="font-display text-base md:text-lg font-semibold tracking-tight text-ink-900 transition-colors hover:text-atlas-700"
            >
              {title}
            </Link>
          ) : (
            <span className="font-display text-base md:text-lg font-semibold tracking-tight text-ink-900">
              {title}
            </span>
          )}
        </div>
      </div>

      <dl className="mt-3">
        {stats.map((stat) => {
          const blank = stat.value == null || stat.value === MISSING;
          return (
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
              <dd
                className={
                  blank
                    ? "font-display text-base font-semibold tabular-nums text-cocoa-500"
                    : "font-display text-base font-semibold tabular-nums text-ink-900"
                }
              >
                {blank ? MISSING : stat.value}
              </dd>
            </div>
          );
        })}
      </dl>

      {footnote ? (
        <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
          {footnote}
        </p>
      ) : null}
    </article>
  );
}
