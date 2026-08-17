/**
 * VisitorSplit - "who the money comes from" (design-system 10.1, charts family).
 * One honest proportion bar (never a pie) splitting takings between the steady
 * resident-and-worker trade and passing visitors. The dominant slice carries the
 * lone vermillion accent, matching the copy that residents are the steady money:
 * the accent points at whoever actually pays the rent, not at a fixed side.
 *
 * This is DATA: one opaque bar, the share figures sit inside their slices, direct
 * labels below, no legend. Reduces to a legible 375px form (the bar keeps its
 * height; a slim slice keeps its figure readable, dropping below the bar when it
 * is too narrow to hold the number). Filled + empty states. Server-renderable.
 *
 * Section: feeds the "who the money comes from" block on the city +
 * neighbourhood pages (resident vs visitor demand).
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { isNonNeg, hasText, ChartEmpty, ChartEyebrow } from "./helpers";

export type VisitorSplitProps = {
  /** Resident + worker share (any unit; the two are normalised to 100%). */
  resident: number | null | undefined;
  /** Visitor share (same unit as `resident`). */
  visitor: number | null | undefined;
  /** @default "Residents & workers" */
  residentLabel?: string;
  /** @default "Visitors" */
  visitorLabel?: string;
  /** Inline chart eyebrow above the bar. @default "Who the money comes from" */
  eyebrow?: string | null;
  /** Optional one-line clarifier below the bar. */
  note?: string | null;
  className?: string;
};

export function VisitorSplit({
  resident,
  visitor,
  residentLabel = "Residents & workers",
  visitorLabel = "Visitors",
  eyebrow = "Who the money comes from",
  note,
  className,
}: VisitorSplitProps) {
  const have = isNonNeg(resident) && isNonNeg(visitor) && resident + visitor > 0;
  if (!have) {
    return (
      <ChartEmpty
        eyebrow={eyebrow}
        note="Not held yet. The demand split appears once this place is measured."
        className={className}
      />
    );
  }

  const total = resident + visitor;
  const rPct = Math.round((resident / total) * 100);
  const vPct = 100 - rPct;
  const resDominant = resident >= visitor;

  // A slice too narrow to seat its figure carries it just below instead, so the
  // number never clips on a 375px column.
  const rInside = rPct >= 18;
  const vInside = vPct >= 18;

  return (
    <figure
      role="img"
      aria-label={`${eyebrow ?? "Who the money comes from"}. ${residentLabel} ${rPct}%, ${visitorLabel} ${vPct}%.`}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(eyebrow) ? <ChartEyebrow className="mb-3">{eyebrow}</ChartEyebrow> : null}

      <div className="flex h-11 overflow-hidden rounded-lg border border-parchment">
        <div
          className={[
            "flex items-center pl-3.5",
            resDominant ? "bg-chart-primary text-white" : "bg-paper-400 text-ink-900",
          ].join(" ")}
          style={{ width: `${rPct}%` }}
        >
          {rInside ? <span className="font-sans text-base font-bold tabular-nums">{rPct}%</span> : null}
        </div>
        <div
          className={[
            "flex items-center justify-end pr-3.5",
            !resDominant ? "bg-chart-primary text-white" : "bg-parchment text-ink-900",
          ].join(" ")}
          style={{ width: `${vPct}%` }}
        >
          {vInside ? <span className="font-sans text-base font-bold tabular-nums">{vPct}%</span> : null}
        </div>
      </div>

      {/* direct labels below, the dominant side tinted; slim-slice figures land here */}
      <div className="mt-3 flex justify-between gap-4">
        <span className="inline-flex items-center gap-2 text-[13px] text-ink-700">
          <span
            className={["h-2.5 w-2.5 rounded-sm", resDominant ? "bg-chart-primary" : "bg-paper-400"].join(" ")}
            aria-hidden="true"
          />
          <span className={resDominant ? "font-bold text-atlas-700" : "font-medium text-ink-700"}>
            {residentLabel}
          </span>
          {!rInside ? <span className="font-sans font-semibold tabular-nums text-ink-900">{rPct}%</span> : null}
        </span>
        <span className="inline-flex items-center gap-2 text-[13px] text-ink-700">
          {!vInside ? <span className="font-sans font-semibold tabular-nums text-ink-900">{vPct}%</span> : null}
          <span className={!resDominant ? "font-bold text-atlas-700" : "font-medium text-ink-700"}>
            {visitorLabel}
          </span>
          <span
            className={["h-2.5 w-2.5 rounded-sm", !resDominant ? "bg-chart-primary" : "bg-parchment"].join(" ")}
            aria-hidden="true"
          />
        </span>
      </div>

      {hasText(note) ? (
        <figcaption className="mt-3 text-[11px] leading-relaxed text-cocoa-700">{note}</figcaption>
      ) : null}
    </figure>
  );
}
