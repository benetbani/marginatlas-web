/**
 * LikeForLikeBars - a ranked like-for-like comparison (design-system 10.1, charts
 * family).
 *
 * Replaces the text "list of compared values" block: the same business across
 * nearby places, or a set of trades ranked by margin. A list of numbers buries
 * the story; this draws each value as a horizontal bar to the leader's scale so
 * the reader sees the SPREAD and the LEADER instantly, in one glance.
 *
 * Each row is plain HTML + Tailwind (a label, a parchment track, a filled bar
 * sized value / max as a zero-based percent, and the formatted figure on the
 * right). The one row marked `subject` carries the lone vermillion fill, the
 * single spotlight per view; every other row stays quiet in cocoa. When no row
 * is the subject, all bars read quiet, which keeps "leader" honest when the rows
 * are merely peers with no "here". Rows with an `href` become links that deepen
 * to ink on hover, motion-safe.
 *
 * Order is the CALLER'S: this component never re-sorts, so the page decides the
 * ranking (high-to-low margin, alphabetical, nearest-first) and the bars honor
 * it. The width scale is always zero-based off the largest value, so bar length
 * is a faithful read of magnitude, not a stretched-to-fill distortion.
 *
 * Contract (design-system 10.2): nullable in, silence out. Rows whose value is
 * null are dropped; with fewer than two real rows left there is no spread to
 * show, so the component returns null rather than draw a lone bar. Tokens only,
 * server-renderable, motion-reduce safe, an aria-label summarizing the takeaway,
 * meaning never carried by color alone (the subject also reads in its label
 * weight and a "Here" cue, never the fill hue on its own).
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only figures.
 */
import * as React from "react";
import { isNum, hasText, ChartEyebrow } from "./helpers";

export type LikeForLikeItem = {
  /** Row label, e.g. a city or a trade. Truncates when long. */
  label: string;
  /** The compared value. A null value drops the row from the chart. */
  value: number | null;
  /** Optional link target; when present the whole row becomes a link. */
  href?: string | null;
  /** The one subject row ("here" / the leader): carries the lone accent. */
  subject?: boolean;
};

export type LikeForLikeBarsProps = {
  items: LikeForLikeItem[];
  /** Formatter for the value labels (e.g. fmtUSD). */
  format: (n: number) => string;
  /** Optional uppercase eyebrow above the bars. */
  label?: string | null;
  /** Optional quiet line below the bars. */
  caption?: string | null;
  /** "default" is the full block; "compact" trims the row height for dense lists. */
  size?: "default" | "compact";
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  className?: string;
};

export function LikeForLikeBars({
  items,
  format,
  label,
  caption,
  size = "default",
  ariaLabel,
  className,
}: LikeForLikeBarsProps) {
  // Nullable in, silence out: keep only rows with a real value, in caller order.
  const clean = (items ?? []).filter(
    (it): it is LikeForLikeItem & { value: number } =>
      hasText(it.label) && isNum(it.value),
  );

  // With fewer than two rows there is no spread to read, so draw nothing.
  if (clean.length < 2) return null;

  const compact = size === "compact";

  // Zero-based scale off the largest value, so bar length reads as magnitude.
  // Guard a non-positive max (all zeros) so widths stay finite.
  const max = Math.max(...clean.map((it) => it.value));
  const widthPct = (v: number) =>
    max > 0 ? Math.max(2, (v / max) * 100) : 2;

  // The subject is the lone accent. The leader (by value) is named in the aria
  // summary so the takeaway carries without sight of the bars.
  const subject = clean.find((it) => it.subject);
  const leader = clean.reduce((best, it) =>
    it.value > best.value ? it : best,
  );
  const ariaText: string =
    ariaLabel ??
    (subject
      ? `${clean.length} compared, ${subject.label} at ${format(
          subject.value,
        )}; the highest is ${leader.label} at ${format(leader.value)}.`
      : `${clean.length} compared, from ${leader.label} at ${format(
          leader.value,
        )} down.`);

  // Each row's inner content is identical whether or not it is a link, so the
  // markup is shared and only the wrapping element changes.
  const rowInner = (it: LikeForLikeItem & { value: number }) => {
    const hot = !!it.subject;
    const fill = hot ? "bg-atlas-500" : "bg-cocoa-300";
    const labelColor = hot ? "text-atlas-700" : "text-ink-700";
    const figColor = hot ? "text-atlas-700" : "text-ink-900";
    return (
      <div
        className={[
          // Mobile: label + figure on top, the bar drops full-width beneath so
          // labels never shrink below a legible size. Desktop: one tidy row.
          "grid grid-cols-[1fr_auto] items-center gap-x-3 sm:grid-cols-[minmax(78px,128px)_1fr_minmax(56px,auto)]",
          compact ? "gap-y-1" : "gap-y-1.5",
        ].join(" ")}
      >
        <span
          className={[
            "inline-flex min-w-0 items-center gap-1.5 truncate",
            compact ? "text-[12px]" : "text-[13px]",
            hot ? "font-semibold" : "font-medium",
            labelColor,
          ].join(" ")}
        >
          <span className="truncate">{it.label}</span>
          {hot ? (
            // The subject also reads without color: a quiet "Here" cue so the
            // meaning never rides on the vermillion fill alone.
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-atlas-700">
              Here
            </span>
          ) : null}
        </span>
        <span
          className={[
            "relative order-last col-span-2 overflow-hidden rounded-full bg-cream-200 sm:order-none sm:col-span-1",
            compact ? "h-3" : "h-3.5",
          ].join(" ")}
        >
          <span
            className={["absolute inset-y-0 left-0 rounded-full", fill].join(
              " ",
            )}
            style={{ width: `${widthPct(it.value)}%` }}
          />
        </span>
        <span
          className={[
            "text-right font-display font-semibold tabular-nums",
            compact ? "text-[12.5px]" : "text-[13.5px]",
            figColor,
          ].join(" ")}
        >
          {format(it.value)}
        </span>
      </div>
    );
  };

  return (
    <figure
      role="group"
      aria-label={ariaText}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(label) ? (
        <ChartEyebrow className={compact ? "mb-2" : "mb-3"}>
          {label}
        </ChartEyebrow>
      ) : null}

      <div
        className={[
          "flex flex-col",
          compact ? "gap-1.5" : "gap-2.5",
        ].join(" ")}
      >
        {clean.map((it, i) =>
          hasText(it.href) ? (
            // A linked row: the whole row is the target. Hover deepens the ink
            // and the bar, motion-safe so reduced-motion gets no transition.
            <a
              key={`${it.label}-${i}`}
              href={it.href}
              className={[
                "group block rounded-sm outline-none",
                "transition-colors motion-reduce:transition-none",
                "hover:bg-cream-100 focus-visible:bg-cream-100",
                "-mx-1.5 px-1.5",
                compact ? "py-0.5" : "py-1",
              ].join(" ")}
            >
              {rowInner(it)}
            </a>
          ) : (
            <div key={`${it.label}-${i}`}>{rowInner(it)}</div>
          ),
        )}
      </div>

      {hasText(caption) ? (
        <figcaption
          className={[
            "text-[11px] leading-relaxed text-cocoa-700",
            compact ? "mt-2" : "mt-3",
          ].join(" ")}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
