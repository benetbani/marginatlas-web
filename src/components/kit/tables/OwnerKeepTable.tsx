/**
 * OwnerKeepTable - trades ranked by what the owner takes home.
 *
 * Rank · trade · break-in ease (a meaning chip) · net margin · owner take-home,
 * sorted by take-home descending. Held trades rank; unheld trades fall to the
 * bottom with honest dashes (never dropped, never a zero). Rank emphasis is
 * WEIGHT, not a loud gradient: the top row reads a touch heavier. A faint
 * take-home bar under the figure is OUTLIER-GUARDED so one runaway number can
 * not flatten everyone else into nothing (the scale caps at ~1.6x the median).
 *
 * NEVER ranks across business x geography (the like-for-like rule): a caller
 * passes one place's trades, or one trade across comparable places, never a mix.
 *
 * Filled, empty (self-omits when nothing is held), and 375px stacked states.
 * Tokens only, nullable inputs, server-renderable. No em-dashes, no source-
 * agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DASH,
  hasText,
  isNum,
  money as defaultMoney,
  percent,
  TableShell,
  MeaningChip,
  type ChipTone,
} from "./helpers";

export type OwnerKeepTrade = {
  /** The trade / business label (the row). */
  trade: string;
  /** A link to that trade's page (optional). */
  href?: string | null;
  /** Break-in ease, drives the chip tone + label. */
  ease?: ChipTone;
  easeLabel?: string;
  /** Net margin, percent (e.g. 13 for 13%). */
  margin?: number | null;
  /** Owner take-home, a year, in the page currency. */
  takeHome?: number | null;
};

export type OwnerKeepTableProps = {
  trades: OwnerKeepTrade[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Money formatter; defaults to the kit compact money. */
  format?: (n: number) => string;
  /** Header for the take-home column's sub-line. Default "a year". */
  takeHomeSub?: string;
  caption?: React.ReactNode;
  framed?: boolean;
  id?: string;
  className?: string;
};

export function OwnerKeepTable({
  trades,
  eyebrow,
  heading,
  lede,
  format = defaultMoney,
  takeHomeSub = "a year",
  caption,
  framed = true,
  id,
  className,
}: OwnerKeepTableProps) {
  const valid = (trades ?? []).filter((t) => hasText(t.trade));
  if (valid.length === 0) return null;

  const held = valid.filter((t) => isNum(t.takeHome));
  const unheld = valid.filter((t) => !isNum(t.takeHome));
  const sorted = [
    ...held.sort((a, b) => (b.takeHome as number) - (a.takeHome as number)),
    ...unheld,
  ];

  // Outlier guard: cap the bar scale at 1.6x the median of held take-homes so a
  // single runaway value can not crush the rest of the column to a sliver.
  const heldVals = held.map((t) => t.takeHome as number).sort((a, b) => a - b);
  const median = heldVals.length ? heldVals[Math.floor(heldVals.length / 2)] : 1;
  const cap = median * 1.6 || 1;
  const barPct = (v: number) => Math.min(100, (v / cap) * 100);

  const fmt = (n: number | null | undefined) => (isNum(n) ? format(n) : DASH);

  return (
    <TableShell
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      caption={caption}
      framed={framed}
      id={id}
      className={className}
      ariaLabel="Trades ranked by owner take-home"
    >
      {/* sm and up: the ranked table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left" style={{ minWidth: "560px" }}>
          <thead>
            <tr className="border-b border-parchment align-bottom text-[13px] font-bold text-ink-900">
              <th scope="col" className="w-9 py-2 pr-2 text-left">
                #
              </th>
              <th scope="col" className="py-2 pr-4 text-left">
                Trade
              </th>
              <th scope="col" className="py-2 pr-4 text-left">
                Break-in
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                Net margin
              </th>
              <th scope="col" className="px-3 py-2 text-right">
                Owner take-home
                <span className="block text-[11px] font-medium text-cocoa-700">{takeHomeSub}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => {
              const isHeld = isNum(t.takeHome);
              const top = isHeld && i === 0;
              return (
                <tr
                  key={t.trade}
                  className="transition-colors hover:bg-ink-900/[0.035] focus-within:bg-ink-900/[0.035]"
                >
                  <td className="py-3 pr-2 text-left align-middle text-xs font-semibold tabular-nums text-cocoa-700">
                    {isHeld ? i + 1 : DASH}
                  </td>
                  <th
                    scope="row"
                    className={cn(
                      "py-3 pr-4 text-left align-middle text-[13.5px]",
                      top ? "font-bold text-ink-900" : "font-medium text-cocoa-700",
                    )}
                  >
                    {hasText(t.href) ? (
                      <a
                        href={t.href}
                        className="rounded-sm text-ink-900 transition-colors hover:text-atlas-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        {t.trade}
                      </a>
                    ) : (
                      <span className="text-ink-900">{t.trade}</span>
                    )}
                  </th>
                  <td className="py-3 pr-4 align-middle">
                    {hasText(t.easeLabel) ? (
                      <MeaningChip tone={t.ease ?? "neutral"}>{t.easeLabel}</MeaningChip>
                    ) : (
                      <span className="text-cocoa-700">{DASH}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right align-middle font-semibold tabular-nums text-ink-900">
                    {isNum(t.margin) ? percent(t.margin) : <span className="text-cocoa-700">{DASH}</span>}
                  </td>
                  <td
                    className={cn(
                      "relative px-3 py-3 text-right align-middle tabular-nums",
                      top ? "text-[15px] font-bold text-ink-900" : "font-semibold text-ink-900",
                      !isHeld && "font-medium text-cocoa-700",
                    )}
                  >
                    {fmt(t.takeHome)}
                    {isHeld ? (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute bottom-1.5 right-3 h-0.5 max-w-[120px] rounded-full",
                          top ? "bg-atlas-500" : "bg-ink-900/[0.18]",
                        )}
                        style={{ width: `${barPct(t.takeHome as number)}%` }}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* below sm: one card per trade, no horizontal scroll */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {sorted.map((t, i) => {
          const isHeld = isNum(t.takeHome);
          const top = isHeld && i === 0;
          return (
            <li
              key={t.trade}
              className="border-t border-parchment pt-3 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="inline-flex items-baseline gap-2 min-w-0">
                  <span className="text-xs font-semibold tabular-nums text-cocoa-700">
                    {isHeld ? i + 1 : DASH}
                  </span>
                  <span
                    className={cn(
                      "truncate text-sm",
                      top ? "font-bold text-ink-900" : "font-medium text-ink-900",
                    )}
                  >
                    {hasText(t.href) ? (
                      <a href={t.href} className="hover:text-atlas-700">
                        {t.trade}
                      </a>
                    ) : (
                      t.trade
                    )}
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 text-right text-sm tabular-nums",
                    top ? "font-bold text-ink-900" : "font-semibold text-ink-900",
                    !isHeld && "font-medium text-cocoa-700",
                  )}
                >
                  {fmt(t.takeHome)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                {hasText(t.easeLabel) ? (
                  <MeaningChip tone={t.ease ?? "neutral"}>{t.easeLabel}</MeaningChip>
                ) : (
                  <span className="text-[11px] text-cocoa-700">Break-in {DASH}</span>
                )}
                <span className="text-[11px] tabular-nums text-cocoa-700">
                  {isNum(t.margin) ? `${percent(t.margin)} net` : `Net ${DASH}`}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </TableShell>
  );
}
