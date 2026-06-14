/**
 * CostSplitTable - "where each $100 goes": a labeled bar-table.
 *
 * One row per cost line: a left label, a proportional bar, the figure. Bars are
 * scaled to the largest line so the split reads at a glance. The "owner keeps"
 * line (`keeps: true`) is the one place this table wears the accent: label,
 * bar, and figure go terracotta, so the eye lands on what is kept without a
 * legend.
 *
 * This is a single-column facts table (no leader crowning, no ranking). It
 * self-omits when no rows carry a value. The 375px form is the same table with
 * the bar dropping under the label so nothing scrolls sideways.
 *
 * Tokens only, nullable inputs, server-renderable. No em-dashes, no source-
 * agency names. Figures are tabular.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { hasText, isNum, InlineBar, TableShell } from "./helpers";

export type CostSplitRow = {
  label: string;
  /** The amount on this line (same unit across rows, e.g. dollars per $100). */
  value?: number | null;
  /** The "owner keeps" line: wears the accent. */
  keeps?: boolean;
};

export type CostSplitTableProps = {
  rows: CostSplitRow[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Format a value (default: $-prefixed integer, e.g. $42). */
  format?: (n: number) => string;
  caption?: React.ReactNode;
  framed?: boolean;
  id?: string;
  className?: string;
};

const defaultFormat = (n: number) => `$${Math.round(n)}`;

export function CostSplitTable({
  rows,
  eyebrow,
  heading,
  lede,
  format = defaultFormat,
  caption,
  framed = true,
  id,
  className,
}: CostSplitTableProps) {
  const valid = (rows ?? []).filter((r) => hasText(r.label) && isNum(r.value));
  if (valid.length === 0) return null;

  const max = Math.max(...valid.map((r) => r.value as number)) || 1;

  return (
    <TableShell
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      caption={caption}
      framed={framed}
      id={id}
      className={className}
      ariaLabel="Where the money goes"
    >
      <ul className="space-y-3">
        {valid.map((r) => {
          const accent = !!r.keeps;
          const value = r.value as number;
          return (
            <li
              key={r.label}
              className="grid grid-cols-[minmax(7rem,9rem)_1fr_auto] items-center gap-3 sm:gap-4"
            >
              <span
                className={cn(
                  "text-[13.5px] leading-tight",
                  accent ? "font-bold text-atlas-700" : "font-medium text-cocoa-700",
                )}
              >
                {r.label}
              </span>
              {/* the bar sits in the middle column; it is a proportional read
                  beside the honest figure, so it carries no number itself */}
              <InlineBar pct={(value / max) * 100} accent={accent} />
              <span
                className={cn(
                  "text-right text-sm font-semibold tabular-nums",
                  accent ? "font-bold text-atlas-700" : "text-ink-900",
                )}
              >
                {format(value)}
              </span>
            </li>
          );
        })}
      </ul>
    </TableShell>
  );
}
