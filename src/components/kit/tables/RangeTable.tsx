/**
 * RangeTable - a low / median / high range per row, in the range-strip language.
 *
 * One row per item (a role, a band): a label, a low-median-high track with the
 * low and high end-labels and a vivid median tick, and the typical (median)
 * figure. A shared domain across rows (lowest low to highest high present) makes
 * the tracks comparable at a glance.
 *
 * This is the table form of the wages-by-role block. It self-omits when no row
 * carries any of low / median / high. The 375px form drops the end-labels and
 * keeps the track + the typical figure, so a phone column never scrolls.
 *
 * Tokens only, nullable inputs, server-renderable. No em-dashes, no source-
 * agency names. Figures are tabular.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { DASH, hasText, isNum, money as defaultMoney, RangeTrack, TableShell } from "./helpers";

export type RangeTableRow = {
  label: string;
  low?: number | null;
  median?: number | null;
  high?: number | null;
};

export type RangeTableProps = {
  rows: RangeTableRow[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Format a value; defaults to the kit compact money. */
  format?: (n: number) => string;
  /** The label column header. Default "Role". */
  labelHeading?: string;
  /** The typical column header. Default "Typical". */
  typicalHeading?: string;
  /** The typical column sub-line. Default "median". */
  typicalSub?: string;
  caption?: React.ReactNode;
  footnote?: string;
  framed?: boolean;
  id?: string;
  className?: string;
};

export function RangeTable({
  rows,
  eyebrow,
  heading,
  lede,
  format = defaultMoney,
  labelHeading = "Role",
  typicalHeading = "Typical",
  typicalSub = "median",
  caption,
  footnote,
  framed = true,
  id,
  className,
}: RangeTableProps) {
  const valid = (rows ?? []).filter(
    (r) => hasText(r.label) && (isNum(r.low) || isNum(r.median) || isNum(r.high)),
  );
  if (valid.length === 0) return null;

  // Shared domain so every track reads on the same scale.
  const lows = valid.map((r) => r.low).filter(isNum) as number[];
  const highs = valid.map((r) => r.high).filter(isNum) as number[];
  const meds = valid.map((r) => r.median).filter(isNum) as number[];
  const lo = Math.min(...[...lows, ...meds]);
  const hi = Math.max(...[...highs, ...meds]);

  const typical = (r: RangeTableRow): string =>
    isNum(r.median)
      ? format(r.median)
      : isNum(r.low) && isNum(r.high)
        ? `${format(r.low)} to ${format(r.high)}`
        : isNum(r.low)
          ? format(r.low)
          : isNum(r.high)
            ? format(r.high)
            : DASH;

  return (
    <TableShell
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      caption={caption}
      footnote={footnote}
      framed={framed}
      id={id}
      className={className}
      ariaLabel="Pay range by role"
    >
      {/* sm and up: label · track with end-labels · typical */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left" style={{ minWidth: "520px" }}>
          <thead>
            <tr className="border-b border-parchment align-bottom text-[13px] font-bold text-ink-900">
              <th scope="col" className="py-2 pr-4 text-left">
                {labelHeading}
              </th>
              <th scope="col" className="w-[260px] py-2 pr-4 text-left">
                Low to high
                <span className="block text-[11px] font-medium text-cocoa-700">range across the market</span>
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                {typicalHeading}
                <span className="block text-[11px] font-medium text-cocoa-700">{typicalSub}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {valid.map((r) => (
              <tr
                key={r.label}
                className="transition-colors hover:bg-ink-900/[0.035] focus-within:bg-ink-900/[0.035]"
              >
                <th
                  scope="row"
                  className="py-3 pr-4 text-left align-middle text-[13.5px] font-medium text-ink-900"
                >
                  {r.label}
                </th>
                <td className="py-3 pr-4 align-middle">
                  <div className="flex items-center gap-3">
                    <span className="w-9 shrink-0 text-[11px] tabular-nums text-cocoa-700">
                      {isNum(r.low) ? format(r.low) : ""}
                    </span>
                    <RangeTrack
                      low={r.low}
                      median={r.median}
                      high={r.high}
                      domainLow={lo}
                      domainHigh={hi}
                      className="flex-1"
                    />
                    <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-cocoa-700">
                      {isNum(r.high) ? format(r.high) : ""}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right align-middle text-sm font-semibold tabular-nums text-ink-900">
                  {typical(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* below sm: label + typical on one line, the track beneath */}
      <ul className="flex flex-col gap-3.5 sm:hidden">
        {valid.map((r) => {
          const showRail =
            (isNum(r.low) || isNum(r.median)) && (isNum(r.high) || isNum(r.median));
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-ink-900">{r.label}</span>
                <span className="text-sm font-semibold tabular-nums text-ink-900">{typical(r)}</span>
              </div>
              {showRail ? (
                <RangeTrack
                  low={r.low}
                  median={r.median}
                  high={r.high}
                  domainLow={lo}
                  domainHigh={hi}
                  className="mt-1.5"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </TableShell>
  );
}
