/**
 * src/components/board/RankRow.tsx
 *
 * One ranked row of a board list: a rank numeral in a quiet badge, a label, a
 * right-aligned figure, and an optional one-word texture. It is the horizontal
 * counterpart to a StatGrid cell, for ordered "top N" strips (the cities with
 * the most extreme visitor-to-resident ratio, the deepest markets, and so on).
 *
 * Same board language as the rest of the kit:
 *   - The value is a tabular display figure, so a column of values aligns on
 *     the digit. Pass a pre-formatted string (route numbers through ./format).
 *   - The rank badge is a quiet token circle, not a loud brand chip: the rank
 *     orders the row, it does not grade it.
 *   - The label is a link when `href` is set, plain text otherwise, so a row
 *     can double as a directory entry.
 *   - Rows are separated by the same warm-taupe hairline used everywhere else;
 *     a list of these reads as one continuous ledger.
 *
 * Server component. Tokens only, mobile-first.
 */
import * as React from "react";
import Link from "next/link";

export interface RankRowProps {
  /** 1-based rank shown in the badge. */
  rank: number;
  /** Row label. Rendered as a link when `href` is set. */
  label: string;
  /** Optional destination; makes the label a link. */
  href?: string;
  /** Pre-formatted value string (route numbers through ./format first). */
  value: string;
  /** Optional one-word texture, e.g. "seasonal", "deep". */
  texture?: string;
}

export function RankRow({ rank, label, href, value, texture }: RankRowProps) {
  return (
    <div className="flex items-baseline gap-3 border-t border-parchment py-3 first:border-t-0 first:pt-0">
      <span
        aria-hidden="true"
        className="inline-flex h-6 w-6 shrink-0 translate-y-0.5 items-center justify-center rounded-full border border-parchment bg-cream-50 font-display text-[12px] font-semibold tabular-nums text-cocoa-700"
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        {href ? (
          <Link
            href={href}
            className="font-display text-[15px] md:text-base font-semibold text-ink-900 transition-colors hover:text-atlas-700"
          >
            {label}
          </Link>
        ) : (
          <span className="font-display text-[15px] md:text-base font-semibold text-ink-900">
            {label}
          </span>
        )}
      </div>

      {texture ? (
        <span className="hidden shrink-0 text-[13px] capitalize text-cocoa-500 sm:inline">
          {texture}
        </span>
      ) : null}

      <span className="shrink-0 text-right font-display text-[15px] md:text-base font-semibold tabular-nums text-ink-900">
        {value}
      </span>
    </div>
  );
}
