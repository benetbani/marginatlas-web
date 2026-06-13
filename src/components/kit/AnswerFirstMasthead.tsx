/**
 * AnswerFirstMasthead - the page-opening band (design-system 13.1 #1 / Article 5).
 *
 * Every Atlas page opens the same way: a coordinate eyebrow and a confidence
 * tier chip, a serif headline that is a question or an assertion, the one-line
 * answer, then the anchor number sized to anchor (not to shout) WITH its spread
 * beside it (the signature RangeStrip, never a lone average). The sub-type
 * switcher mounts at the title; break-in demotes to a quiet secondary chip; a
 * faint survey-grid motif threads behind the band. Answer-first, always.
 *
 * Server component: it composes the client islands it is handed (the count-up
 * anchor, the switcher) without becoming one itself. Every part self-omits when
 * its data is absent, so a thin page still opens cleanly with just an eyebrow
 * and a headline.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { TierDot, type Tier } from "@/components/ui/tier-dot";
import { RangeStrip } from "./RangeStrip";
import { CountUpNumber } from "./CountUpNumber";
import { formatWithSpec, type NumberFormatSpec } from "./numberFormat";

export type MastheadAnchor = {
  /** What the number is, e.g. "Typical revenue a year". */
  label: string;
  value: number;
  /** Serializable format spec (the count-up is a client island). */
  format: NumberFormatSpec;
  /** Count up on first reveal (the one count-up on the site). Default true. */
  countUp?: boolean;
};

export type MastheadSpread = {
  p10: number | null;
  p25?: number | null;
  p50: number | null;
  p75?: number | null;
  p90: number | null;
  format: (n: number) => string;
};

export type MastheadStat = { label: string; value: string | null };

export type AnswerFirstMastheadProps = {
  /** Coordinate line: category, place, country. A node so callers can style it. */
  eyebrow: React.ReactNode;
  /** Confidence tier chip, quiet, top-right. */
  tier?: Tier | null;
  /** The serif H1: a question or an assertion. */
  title: string;
  /** The one-line answer, right under the headline. */
  answer?: string | null;
  /** The anchor number with its label. */
  anchor?: MastheadAnchor | null;
  /** The spread shown beside the anchor (the signature). */
  spread?: MastheadSpread | null;
  /** A quiet supporting stat row. */
  stats?: MastheadStat[] | null;
  /** The sub-type switcher mount (a client island), shown at the title. */
  switcher?: React.ReactNode;
  /** Break-in / difficulty, demoted to a secondary chip. */
  breakIn?: string | null;
  /** Render the faint survey-grid motif behind the band. Default true. */
  motif?: boolean;
  id?: string;
};

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

export function AnswerFirstMasthead({
  eyebrow,
  tier,
  title,
  answer,
  anchor,
  spread,
  stats,
  switcher,
  breakIn,
  motif = true,
  id,
}: AnswerFirstMastheadProps) {
  const cleanStats = (stats ?? []).filter(
    (s) => typeof s.value === "string" && s.value.trim().length > 0,
  );
  const hasSpread =
    spread != null && isNum(spread.p10) && isNum(spread.p50) && isNum(spread.p90);

  return (
    <header
      id={id}
      className="relative overflow-hidden border-b border-parchment/60 py-8 sm:py-10"
    >
      {motif ? (
        <div
          aria-hidden="true"
          className="atlas-masthead-motif pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
      ) : null}

      <div className="relative">
        {/* coordinate eyebrow + tier chip */}
        <div className="flex items-start justify-between gap-4">
          <SectionEyebrow size="md">{eyebrow}</SectionEyebrow>
          {tier ? <TierDot tier={tier} showLabel /> : null}
        </div>

        {/* the switcher mounts at the title */}
        {switcher ? <div className="mt-4">{switcher}</div> : null}

        {/* serif headline: a question or an assertion */}
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-balance text-ink-900 sm:text-4xl">
          {title}
        </h1>

        {/* the one-line answer */}
        {answer ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite">
            {answer}
          </p>
        ) : null}

        {/* break-in demoted to a quiet chip */}
        {breakIn ? (
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-parchment bg-cream-100 px-3 py-1 text-xs font-medium text-cocoa-700">
              {breakIn}
            </span>
          </div>
        ) : null}

        {/* the anchor number with its spread */}
        {anchor && isNum(anchor.value) ? (
          <div className="mt-7 grid gap-6 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:items-end md:gap-10">
            <div>
              <div className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ink-900 sm:text-5xl">
                {anchor.countUp === false ? (
                  formatWithSpec(anchor.value, anchor.format)
                ) : (
                  <CountUpNumber value={anchor.value} format={anchor.format} />
                )}
              </div>
              <div className="mt-1.5 text-sm font-medium text-cocoa-700/80">
                {anchor.label}
              </div>
            </div>
            {hasSpread ? (
              <div className="min-w-0">
                <RangeStrip
                  p10={spread!.p10}
                  p25={spread!.p25 ?? null}
                  p50={spread!.p50}
                  p75={spread!.p75 ?? null}
                  p90={spread!.p90}
                  format={spread!.format}
                />
              </div>
            ) : null}
          </div>
        ) : hasSpread ? (
          <div className="mt-7 max-w-2xl">
            <RangeStrip
              p10={spread!.p10}
              p25={spread!.p25 ?? null}
              p50={spread!.p50}
              p75={spread!.p75 ?? null}
              p90={spread!.p90}
              format={spread!.format}
            />
          </div>
        ) : null}

        {/* the quiet supporting stat row */}
        {cleanStats.length > 0 ? (
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {cleanStats.map((s, i) => (
              <div key={i}>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500">
                  {s.label}
                </dt>
                <dd className="mt-0.5 font-display text-lg font-medium tabular-nums text-ink-900">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </header>
  );
}
