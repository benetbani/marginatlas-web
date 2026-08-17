/**
 * src/components/open/OpeningPayback.tsx
 *
 * One clean line that ties the two money figures together: how long the entry
 * cost takes to earn back, and the owner take-home it earns back against. It
 * reads the payback straight off the break-in rating and the take-home off the
 * data builder, so both numbers match the cell page exactly.
 *
 * Graceful by construction: with no rating (no payback) AND no take-home there
 * is nothing honest to say, so the component renders nothing. With only one of
 * the two it shows just that half rather than inventing the other.
 *
 * The payback is phrased the same warm way the break-in breakdown phrases it
 * (months under a year so a fast payback never reads "0.4 years"; years to one
 * natural decimal above that), so the two surfaces speak with one voice.
 *
 * Server component. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { fmtUSD } from "@/components/board/format";
import type { OpeningPage } from "@/lib/open/opening_page";

/** A real, finite, positive number. */
function isPos(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n > 0;
}

/**
 * Warm payback phrase. Under a year reads in months so a fast payback does not
 * print "0.4 years"; a year or more reads to one natural decimal. No em-dashes.
 */
function paybackClause(years: number): string {
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return months === 1
      ? "Breaks even in about a month"
      : `Breaks even in about ${months} months`;
  }
  const rounded = Math.round(years * 10) / 10;
  const figure = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `Breaks even in about ${figure} years`;
}

export function OpeningPayback({ page }: { page: OpeningPage }) {
  const hasPayback = page.breakIn != null && isPos(page.breakIn.paybackYears);
  const hasTakeHome = isPos(page.takeHomeUsd);

  // Nothing defensible to say without at least one of the two figures.
  if (!hasPayback && !hasTakeHome) return null;

  let line: string;
  if (hasPayback && hasTakeHome) {
    line = `${paybackClause(
      page.breakIn!.paybackYears,
    )}, on a typical owner take-home of ${fmtUSD(page.takeHomeUsd)} a year.`;
  } else if (hasPayback) {
    line = `${paybackClause(page.breakIn!.paybackYears)} on these numbers.`;
  } else {
    line = `Typical owner take-home runs about ${fmtUSD(
      page.takeHomeUsd,
    )} a year.`;
  }

  return (
    <section className="atlas-card mt-6 p-4 md:p-5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
        Payback
      </div>
      <p className="mt-1.5 text-base leading-relaxed text-ink-900">{line}</p>
    </section>
  );
}
