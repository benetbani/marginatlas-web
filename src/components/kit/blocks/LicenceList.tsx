/**
 * LicenceList - "what you need to open one here". A plain checklist of the
 * permits and licences a place asks for, each with a small pre-formatted cost
 * and a time hint, and a clear visual line between a hard requirement and a
 * recommendation.
 *
 * Required rows carry a solid ink check; recommended rows carry a dashed ring
 * with a quiet plus. Cost is a pre-formatted string the page computes; when it
 * is null or blank the row reads "varies" in muted ink rather than a fabricated
 * figure. Honest empty state when the list is not held: a calm dashed card that
 * says it varies by council, never an invented row.
 *
 * This is a FRAME block: it carries the warmth (eyebrow, hairline-grouped rows,
 * a quiet legend) while every figure stays opaque, high-contrast and tabular.
 * Server-renderable, no client JS. Reduces to a legible 375px form: the label
 * column wraps, the mark and the cost column never shrink, no horizontal scroll.
 *
 * Tokens only, nullable inputs, no raw hex / px / ms, no em-dashes, no source-
 * agency names.
 */
import * as React from "react";
import { hasText } from "@/components/kit/tables/helpers";

/** One permit or licence row. */
export type LicenceItem = {
  /** Plain name of the permit or licence. */
  label: string;
  /** Optional one-line clarifier under the label. */
  note?: React.ReactNode;
  /** Pre-formatted cost string the page computes, or null/blank for "varies". */
  cost?: string | null;
  /** Time hint, e.g. "1 day" or "2 to 3 weeks". */
  time?: string | null;
  /** Hard requirement (solid ink check) vs recommendation (dashed ring). */
  required?: boolean;
};

export type LicenceListProps = {
  items?: LicenceItem[] | null;
  /** Inline eyebrow above the list. */
  title?: string;
  /** Honest line shown when no licences are held for this place. */
  emptyNote?: string;
  className?: string;
};

/** The required-vs-recommended mark, opaque and high-contrast. */
function LicenceMark({ required }: { required: boolean }) {
  if (required) {
    return (
      <span
        aria-hidden="true"
        className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-ink-900 text-white"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6.5 L5 9 L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-cocoa-300 text-[10px] font-bold leading-none text-cocoa-500"
    >
      +
    </span>
  );
}

export function LicenceList({
  items,
  title = "What you need to open one here",
  emptyNote = "We do not hold the licence list for this place yet. It varies by council.",
  className,
}: LicenceListProps) {
  const rows = (items ?? []).filter((it) => it && hasText(it.label));

  if (rows.length === 0) {
    return (
      <section className={className} aria-label={title}>
        {hasText(title) ? (
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
            {title}
          </div>
        ) : null}
        <div className="rounded-md border border-dashed border-paper-400 bg-paper-100 px-5 py-5 text-center text-[13px] leading-relaxed text-cocoa-700">
          {emptyNote}
        </div>
      </section>
    );
  }

  return (
    <section className={className} aria-label={title}>
      {hasText(title) ? (
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
          {title}
        </div>
      ) : null}

      {/* legend: solid square = required, dashed ring = recommended */}
      <div className="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-cocoa-700">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-ink-900" />
          Required
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full border-[1.5px] border-dashed border-cocoa-300"
          />
          Recommended
        </span>
      </div>

      <ul className="m-0 list-none p-0">
        {rows.map((it, i) => {
          const hasCost = hasText(it.cost);
          return (
            <li
              key={i}
              className={[
                "grid grid-cols-[auto_1fr_auto] items-start gap-x-4 gap-y-1 py-3",
                i > 0 ? "border-t border-parchment" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <LicenceMark required={Boolean(it.required)} />

              <div className="min-w-0">
                <div className="text-[14.5px] font-semibold leading-snug text-ink-900">
                  {it.label}
                </div>
                {it.note != null && it.note !== "" ? (
                  <div className="mt-0.5 text-[12.5px] leading-relaxed text-cocoa-700">
                    {it.note}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 whitespace-nowrap text-right">
                <div
                  className={[
                    "text-sm font-bold tabular-nums",
                    hasCost ? "text-ink-900" : "text-cocoa-700",
                  ].join(" ")}
                >
                  {hasCost ? it.cost : "varies"}
                </div>
                {hasText(it.time) ? (
                  <div className="mt-0.5 text-[11.5px] text-cocoa-700">{it.time}</div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
