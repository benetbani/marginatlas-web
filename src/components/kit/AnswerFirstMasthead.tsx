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

        {/* The title block: the switcher mounts AT the title, so a sub-type +
            venue switch reads as part of the headline (the business name with a
            switchable type, set on its terms), not as a floating control row. The
            switcher slot sits directly above the H1 with tight spacing; it wraps
            to its own line on narrow screens. When absent, the block collapses to
            just the headline (self-omitting). */}
        <div className="mt-4">
          {switcher ? (
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              {switcher}
            </div>
          ) : null}

          {/* serif headline: a question or an assertion */}
          <h1 className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-balance text-ink-900 sm:text-4xl">
            {title}
          </h1>
        </div>

        {/* the one-line answer */}
        {answer ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite">
            {answer}
          </p>
        ) : null}

        {/* THE ANCHOR NUMBER, THEN THE SPREAD ON ITS OWN LINE.

           THE SPREAD WAS BEING PRINTED AT SIX AND A HALF PIXELS. RangeStrip is
           an SVG with a fixed `viewBox="0 0 760 96"` and `w-full`, so every unit
           inside it, text included, scales by rendered-width over 760. Squeezed
           into the second column of this grid it got nowhere near 760, and the
           figures are the product:

             /industries/restaurants   column 361px   scale 0.474
               $351K / $397K / $524K   authored 14px  painted 6.6px
               BOTTOM 10% / TOP 10%    authored 11.5  painted 5.5px
             /gb/london/restaurants    column 494px   scale 0.649
               $720K                   authored 17px  painted 11.0px
               $360K / $1.3M           authored 14px  painted 9.1px

           Measured in a browser at 1440x900, not inferred: rendered width over
           viewBox width, times each <text> element's own font-size attribute.
           Nothing in the source says 6.6px anywhere, which is why this survived
           every gate and every read of the markup.

           The two-up composition could not be rescued by rebalancing the
           columns. The labels only reach a legible ~11px at scale 0.78, which
           needs 594px of the 794 this card holds, and the anchor's own caption
           ("Typical revenue a year, across the US markets we measure") is
           already 409px wide. There is no split that leaves both readable.

           So the anchor keeps the top line and the strip takes the full column
           beneath it, which puts the scale at roughly 1.0 and paints every
           figure at the size it was authored. Nothing is dropped and nothing is
           added; the same two elements are stacked instead of columned. This is
           the shared masthead, so the fix lands on the cell, neighbourhood-cell,
           industry, city and trade pages at once. */}
        {anchor && isNum(anchor.value) ? (
          <div className="mt-7">
            <div>
              <div className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ink-900 sm:text-5xl">
                {anchor.countUp === false ? (
                  formatWithSpec(anchor.value, anchor.format)
                ) : (
                  <CountUpNumber value={anchor.value} format={anchor.format} />
                )}
              </div>
              <div className="mt-1.5 text-sm font-medium text-cocoa-700">
                {anchor.label}
              </div>
            </div>
            {hasSpread ? (
              <div className="mt-6 min-w-0">
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

        {/* break-in demoted to a quiet chip, placed AFTER the anchor so the
            headline number leads the eye (answer-first): the figure comes before
            any difficulty judgment. */}
        {breakIn ? (
          <div className="mt-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-parchment bg-paper-100 px-3 py-1 text-xs font-medium text-cocoa-700">
              {breakIn}
            </span>
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
