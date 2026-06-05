/**
 * src/components/board/StatGrid.tsx
 *
 * The atomic data grid of the board: a responsive grid of label / value
 * cells. This is the one place a board value becomes pixels, so the typographic
 * treatment (uppercase micro-label, tabular display figure, optional hint)
 * lives here and nowhere else.
 *
 * Contract, by design:
 *   - It renders EVERY row it is given, in order. It never filters, sorts, or
 *     drops a row for being blank. "Show the number plainly or show a dash"
 *     is the board rule, and a dash is information (the reader learns the field
 *     exists and we do not have it). Suppression, when wanted, is the caller's
 *     decision, not this grid's.
 *   - A value that is null or exactly MISSING renders the MISSING token in a
 *     muted tone, so blanks read as deliberate rather than broken.
 *
 * Server component. Tokens only, mobile-first (two columns, three from md).
 */
import * as React from "react";
import { MISSING } from "./format";

/**
 * One cell of the board. `value` is a pre-formatted string (route numbers
 * through ./format first) or null for a blank. `hint` is an optional sub-label
 * for units or qualifiers ("per firm", "of revenue").
 */
export type StatRow = {
  label: string;
  value: string | null;
  hint?: string;
};

export function StatGrid({ rows }: { rows: StatRow[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
      {rows.map((row) => {
        const blank = row.value == null || row.value === MISSING;
        return (
          <div key={row.label}>
            <dt className="text-[11px] uppercase tracking-wide text-cocoa-500">
              {row.label}
            </dt>
            <dd
              className={
                blank
                  ? "font-display text-lg font-semibold tabular-nums text-cocoa-400"
                  : "font-display text-lg font-semibold tabular-nums text-ink-900"
              }
            >
              {blank ? MISSING : row.value}
            </dd>
            {row.hint ? (
              <dd className="mt-0.5 text-[11px] text-cocoa-500">{row.hint}</dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
