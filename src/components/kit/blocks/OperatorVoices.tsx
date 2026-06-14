/**
 * OperatorVoices - a quietly framed block of real operator quotes (design-system
 * 9.3, content-map / editorial family).
 *
 * Two to four operator quotes set in the display serif at a readable measure,
 * warm but never a glossy testimonial wall: no avatars, no stars, restrained
 * attribution (role, then place, then years in the trade). A faint vermillion
 * editorial rule on the left of each quote carries the warmth so the figure
 * stays clean. Stacks to one column at 375px.
 *
 * Nullable and self-honest: every quote field may be missing. A quote with no
 * text is dropped. When no quote survives, the block renders its honest empty
 * state, a calm "we are gathering voices" line, never a fabricated quote and
 * never a crash. Server-renderable, no client JS.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** One operator quote: the words plus a restrained attribution. */
export type OperatorQuote = {
  /** The words. A string, or rich nodes when a page needs them. */
  quote: React.ReactNode;
  /** Who said it, in role terms, e.g. "Owner-baker". The one required field. */
  role: string;
  /** Where they operate, e.g. "Lyon". Optional. */
  place?: string | null;
  /** Years in the trade. A non-negative whole number. Optional. */
  years?: number | null;
};

export type OperatorVoicesProps = {
  /** The quotes to show. Two to four read best; any with no words are dropped. */
  quotes: OperatorQuote[] | null | undefined;
  /** The section label above the quotes. */
  title?: string;
  /**
   * Custom empty-state line for when no quote is held, e.g. "gathering voices
   * for restaurants in London". Falls back to a calm generic line.
   */
  gathering?: React.ReactNode;
  /** Anchor id for the sticky section nav. */
  id?: string;
  className?: string;
};

/** A quote counts as real when it has both words and a role. */
function isReal(q: OperatorQuote): boolean {
  const hasWords =
    typeof q.quote === "string" ? hasText(q.quote) : q.quote != null && q.quote !== false;
  return hasWords && hasText(q.role);
}

export function OperatorVoices({
  quotes,
  title = "Operator voices",
  gathering,
  id,
  className,
}: OperatorVoicesProps) {
  const real = (quotes ?? []).filter(isReal);

  if (real.length === 0) {
    return (
      <section
        id={id}
        aria-label={title}
        className={[className].filter(Boolean).join(" ")}
      >
        <SectionEyebrow className="mb-3.5">{title}</SectionEyebrow>
        <div className="max-w-prose rounded-md border border-dashed border-cream-400 bg-cream-100 px-5 py-6">
          <p className="font-display text-lg italic leading-relaxed text-cocoa-700">
            {gathering != null && gathering !== false
              ? gathering
              : "We are gathering operator voices for this trade."}
          </p>
        </div>
      </section>
    );
  }

  // One column reads better for a lone quote; the field stacks at 375px and
  // opens to two columns once there is room.
  const gridClass =
    real.length > 1
      ? "grid gap-x-8 gap-y-6 sm:grid-cols-2"
      : "grid gap-y-6";

  return (
    <section
      id={id}
      aria-label={title}
      className={[className].filter(Boolean).join(" ")}
    >
      <SectionEyebrow className="mb-4">{title}</SectionEyebrow>
      <div className={gridClass}>
        {real.map((q, i) => (
          <figure key={i} className="m-0 border-l-2 border-atlas-300 pl-4">
            <blockquote className="m-0 max-w-prose text-pretty font-display text-lg font-normal leading-snug text-ink-900 md:text-xl">
              {q.quote}
            </blockquote>
            <figcaption className="mt-3 text-[13px] leading-relaxed text-cocoa-700">
              <span className="font-semibold text-ink-900">{q.role}</span>
              {hasText(q.place) ? <span>, {q.place}</span> : null}
              {isNum(q.years) && q.years >= 0 ? (
                <span>
                  {", "}
                  <span className="tabular-nums">{Math.round(q.years)}</span>{" "}
                  {Math.round(q.years) === 1 ? "year" : "years"} in the trade
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
