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
 *   - With `muteEmpty`, a blank row recedes further (the whole cell drops in
 *     contrast), so a board that is mostly blanks at a given altitude (the city
 *     board off the flagship cities) reads calm rather than broken. Opt-in, so
 *     the cell and country boards are unchanged.
 *
 * Server component. Tokens only, mobile-first (two columns, three from md).
 */
import * as React from "react";
import { MISSING } from "./format";
import { InfoDot } from "./InfoDot";

/**
 * One cell of the board. `value` is a pre-formatted string (route numbers
 * through ./format first) or null for a blank. `hint` is an optional sub-label
 * for units or qualifiers ("per firm", "of revenue").
 */
export type StatRow = {
  label: string;
  value: string | null;
  hint?: string;
  /** Optional one-line explanation shown as a "?" tooltip (ruled variant only). */
  tip?: string;
};

export function StatGrid({
  rows,
  muteEmpty = false,
  variant = "grid",
}: {
  rows: StatRow[];
  muteEmpty?: boolean;
  variant?: "grid" | "ruled";
}) {
  if (variant === "ruled") {
    return (
      <dl className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
        {rows.map((row) => {
          const blank = row.value == null || row.value === MISSING;
          return (
            <div
              key={row.label}
              className={`flex items-baseline justify-between gap-3 border-b border-parchment py-2.5 ${
                blank && muteEmpty ? "opacity-60" : ""
              }`}
            >
              <dt className="flex items-center text-[13px] text-cocoa-700">
                <span>{row.label}</span>
                {row.tip ? <InfoDot tip={row.tip} /> : null}
              </dt>
              <dd
                className={
                  blank
                    ? "font-display text-[15px] font-semibold tabular-nums text-cocoa-400"
                    : "font-display text-[15px] font-semibold tabular-nums text-ink-900"
                }
              >
                {blank ? MISSING : row.value}
              </dd>
            </div>
          );
        })}
      </dl>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
      {rows.map((row) => {
        const blank = row.value == null || row.value === MISSING;
        return (
          <div
            key={row.label}
            className={blank && muteEmpty ? "opacity-60" : undefined}
          >
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
