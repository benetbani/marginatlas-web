/**
 * TimelineRibbon - a progression as a journey (design-system 10.1, charts family).
 *
 * Some stories are not a number, they are a sequence: a realistic first year runs
 * ramp -> break-even -> stable, and reads truer as a path than as a bullet list.
 * This is the kit's one timeline primitive. A horizontal hairline threads three
 * to five evenly spaced nodes; each node carries a short time tag (e.g. "Mo 1-2"),
 * a label, and an optional note. The one pivotal node (the break-even, the turn)
 * is marked `emphasis` and carries the lone vermillion dot, a touch larger; every
 * other node stays quiet in cocoa. There is never a second accent, so the eye
 * lands on the moment that matters.
 *
 * Color is never the only signal: the emphasis node also reads as the larger dot
 * and is named in the aria-label, so a reader who cannot see the accent still
 * finds the turn. This is DATA, the kit's clean-core law: flat hairline surfaces,
 * no drop-shadow, no gridlines, no legend, direct labels, tabular time tags.
 *
 * Contract (design-system 10.2): nullable in, silence out. Milestones with an
 * empty label are dropped; with fewer than two real milestones the component
 * returns null rather than draw a one-node "journey". Server-renderable (no client
 * JS); the one subtle reveal is the shared `ds-slide-up` keyframe under a
 * `motion-safe:` gate, so a reduced-motion reader simply gets the final state.
 *
 * Responsive: on a phone (< sm) a horizontal row of four tags is illegible, so the
 * ribbon reflows CSS-only to a vertical stepped list. A left rail hairline runs
 * down the column with the nodes stacked on it, the emphasis node still the larger
 * vermillion dot. No layout JS, no hydration: both views render server-side and
 * the breakpoint picks one.
 *
 * Tokens only, no raw hex / px / ms, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { hasText, ChartEyebrow } from "./helpers";

export type TimelineMilestone = {
  /** Short time tag, e.g. "Mo 1-2", "Q3", "Year 1". Shown small + tracked. */
  at: string;
  /** The milestone itself, e.g. "Break-even". The line the eye reads. */
  label: string;
  /** Optional one-line clarifier under the label. */
  note?: string | null;
  /** Marks the pivotal node (e.g. break-even): the lone vermillion dot. */
  emphasis?: boolean;
};

export type TimelineRibbonProps = {
  milestones: TimelineMilestone[];
  /** Quiet plain-voice line under the ribbon (e.g. a modeled-path reminder). */
  caption?: string | null;
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  className?: string;
};

export function TimelineRibbon({
  milestones,
  caption,
  ariaLabel,
  className,
}: TimelineRibbonProps) {
  // Nullable in, silence out: a milestone with no label is not a stop on the
  // journey, and one lone stop is not a journey at all.
  const clean = (milestones ?? []).filter((m) => hasText(m.label));
  if (clean.length < 2) return null;

  // Exactly one accent per view: if the data marks several nodes "emphasis", only
  // the first earns the lone vermillion dot so the accent stays the single spotlight.
  const emphasisIdx = clean.findIndex((m) => m.emphasis);

  // A direct, color-free summary of the path, naming the pivotal stop so the turn
  // survives for a reader who cannot see the accent.
  const pivot = emphasisIdx >= 0 ? clean[emphasisIdx] : null;
  const ariaText =
    ariaLabel ??
    `A ${clean.length}-step progression from ${clean[0].label} to ${
      clean[clean.length - 1].label
    }${pivot ? `, turning at ${pivot.label}` : ""}.`;

  // The dot for a node: the pivotal stop is the larger vermillion dot, every other
  // a small quiet cocoa one. Meaning is carried by size too, never color alone.
  const isHot = (i: number) => i === emphasisIdx;

  return (
    <figure
      role="group"
      aria-label={ariaText}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {/* Desktop (sm and up): the horizontal ribbon. The hairline threads the row
          behind evenly spaced nodes; tags sit above, labels + notes below. */}
      <div
        className="hidden sm:block motion-safe:animate-ds-slide-up"
        role="img"
        aria-label={ariaText}
      >
        <ol className="relative flex items-stretch justify-between gap-3">
          {/* the connecting hairline, threaded behind the nodes. It stops half a
              node in on each end so it never runs past the first / last dot. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[2.35rem] h-px bg-parchment"
            style={{ left: `${50 / clean.length}%`, right: `${50 / clean.length}%` }}
          />
          {clean.map((m, i) => {
            const hot = isHot(i);
            return (
              <li
                key={`${m.at}-${m.label}-${i}`}
                className="relative flex min-w-0 flex-1 flex-col items-center text-center"
              >
                {/* time tag */}
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] tabular-nums text-cocoa-500">
                  {m.at}
                </span>
                {/* node dot, on the threaded hairline */}
                <span className="my-2.5 flex h-4 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className={[
                      "block rounded-full ring-2 ring-cream-50",
                      hot
                        ? "h-3.5 w-3.5 bg-atlas-500"
                        : "h-2.5 w-2.5 bg-cocoa-300",
                    ].join(" ")}
                  />
                </span>
                {/* label + optional note */}
                <span
                  className={[
                    "font-display text-sm leading-tight tracking-tight",
                    hot ? "font-semibold text-atlas-700" : "font-medium text-ink-900",
                  ].join(" ")}
                >
                  {m.label}
                </span>
                {hasText(m.note) ? (
                  <span className="mt-1 text-[11px] leading-relaxed text-cocoa-700">
                    {m.note}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile (below sm): the vertical stepped list. A left rail hairline runs
          down the column with the nodes stacked on it; the row stays legible at a
          phone width where four horizontal tags would not. */}
      <ol
        className="relative block sm:hidden motion-safe:animate-ds-slide-up"
        role="img"
        aria-label={ariaText}
      >
        {/* the left rail, stopping at the first and last dot centers */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[0.3125rem] top-2 bottom-2 w-px bg-parchment"
        />
        {clean.map((m, i) => {
          const hot = isHot(i);
          return (
            <li
              key={`${m.at}-${m.label}-${i}`}
              className="relative flex gap-3.5 pb-5 last:pb-0"
            >
              {/* the node, sat on the rail */}
              <span className="relative mt-1 flex w-2.5 shrink-0 justify-center">
                <span
                  aria-hidden="true"
                  className={[
                    "block rounded-full ring-2 ring-cream-50",
                    hot ? "h-3.5 w-3.5 bg-atlas-500" : "h-2.5 w-2.5 bg-cocoa-300",
                  ].join(" ")}
                />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] tabular-nums text-cocoa-500">
                  {m.at}
                </span>
                <span
                  className={[
                    "mt-0.5 block font-display text-sm leading-tight tracking-tight",
                    hot ? "font-semibold text-atlas-700" : "font-medium text-ink-900",
                  ].join(" ")}
                >
                  {m.label}
                </span>
                {hasText(m.note) ? (
                  <span className="mt-1 block text-[11px] leading-relaxed text-cocoa-700">
                    {m.note}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {hasText(caption) ? (
        <figcaption className="mt-4 text-[11px] leading-relaxed text-cocoa-700">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
