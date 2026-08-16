/**
 * MoneyGoesBreakdown - where each $100 of sales goes (design-system 10.1).
 *
 * A horizontal stacked bar over a ruled line-item table, read per $100 so the
 * shares are tangible (not abstract percentages). The cost rows are quiet warm
 * neutrals; the KEPT row is the one moss moment per the fixed color jobs
 * (profit kept = moss). This replaces the generic net-profit waterfall divs.
 *
 * Input is a list of line items already expressed as dollars per $100 (the page
 * derives them from the cost structure and the net margin). Self-omitting: with
 * fewer than two items, or a total that does not land near $100, it returns null
 * rather than draw a misleading bar.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 * Server-renderable (no client JS).
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export type MoneyGoesItem = {
  /** Row label, e.g. "Payroll", "Rent", "What the owner keeps". */
  label: string;
  /** Dollars out of every $100 of sales. */
  perHundred: number | null | undefined;
  /** The single kept row carries the moss accent. At most one. */
  kept?: boolean;
  /** Optional one-line clarifier shown under the label. */
  hint?: string;
};

export type MoneyGoesBreakdownProps = {
  items: MoneyGoesItem[];
  /** Section eyebrow. */
  eyebrow?: string;
  /** Section heading. */
  heading?: string;
  /** Optional lede under the heading. */
  lede?: string;
  /** Anchor id for the sticky nav. */
  id?: string;
  className?: string;
};

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v) && v >= 0;
}

// Quiet warm neutrals for the cost segments, cycled in order. The kept segment
// is handled separately in moss, so these never carry the accent.
const COST_FILL = [
  "bg-cocoa-300",
  "bg-cream-400",
  "bg-cocoa-100",
  "bg-cream-300",
  "bg-cocoa-500/70",
] as const;

export function MoneyGoesBreakdown({
  items,
  eyebrow = "Where the money goes",
  heading = "Every $100 of sales",
  lede,
  id,
  className,
}: MoneyGoesBreakdownProps) {
  const clean = items.filter(
    (it): it is MoneyGoesItem & { perHundred: number } => isNum(it.perHundred),
  );
  const total = clean.reduce((s, it) => s + it.perHundred, 0);
  // Silence out unless the items form a believable $100 decomposition.
  if (clean.length < 2 || total < 80 || total > 120) return null;

  // Normalise widths to the actual total so the bar always spans full width
  // even if the inputs sum a little off 100 (rounding).
  const widthPct = (v: number) => `${(v / total) * 100}%`;
  const fmt = (v: number) => `$${Math.round(v)}`;

  // The kept slice is the answer the section is really about. Find its centre on
  // the bar so a single vermillion tick can mark it (the one focal-subject accent
  // per the chart grammar; the moss fill carries the "profit" meaning, the tick
  // carries the "look here").
  let acc = 0;
  let keptCenter: number | null = null;
  for (const it of clean) {
    const w = (it.perHundred / total) * 100;
    if (it.kept && keptCenter == null) keptCenter = acc + w / 2;
    acc += w;
  }

  let costIdx = 0;

  return (
    <section
      id={id}
      aria-label={heading}
      className={[
        "rounded-lg border border-parchment bg-cream-50",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
      <h2 className="font-display text-xl font-medium tracking-tight text-ink-900 md:text-2xl">
        {heading}
      </h2>
      {lede ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
          {lede}
        </p>
      ) : null}

      {/* the stacked bar, with a vermillion tick marking the kept slice */}
      <div className={["relative", keptCenter != null ? "mt-9" : "mt-5"].join(" ")}>
        {keptCenter != null ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[1.1rem] z-10 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${Math.max(4, Math.min(96, keptCenter))}%` }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
              Kept
            </span>
            <span className="mt-0.5 block h-2.5 w-[3px] rounded-sm bg-atlas-500 ring-2 ring-white" />
          </div>
        ) : null}
        <div
          className="flex h-5 w-full overflow-hidden rounded-full border border-parchment"
          role="img"
          aria-label="Stacked share of every hundred dollars of sales; the owner's kept slice is marked."
        >
          {clean.map((it, i) => {
            const fill = it.kept
              ? "bg-moss-500"
              : COST_FILL_at(costIdx++);
            return (
              <div
                key={i}
                className={fill}
                style={{ width: widthPct(it.perHundred) }}
                title={`${it.label}: ${fmt(it.perHundred)}`}
              />
            );
          })}
        </div>
      </div>

      {/* the ruled line-item table */}
      <dl className="mt-5 divide-y divide-parchment border-y border-parchment">
        {clean.map((it, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="min-w-0">
              <span
                className={[
                  "text-sm",
                  it.kept
                    ? "font-semibold text-moss-700"
                    : "text-cocoa-700",
                ].join(" ")}
              >
                {it.label}
              </span>
              {it.hint ? (
                <span className="mt-0.5 block text-[11px] text-cocoa-700">
                  {it.hint}
                </span>
              ) : null}
            </dt>
            <dd
              className={[
                "shrink-0 font-display tabular-nums",
                it.kept
                  ? "text-lg font-semibold text-moss-700"
                  : "text-base text-ink-900",
              ].join(" ")}
            >
              {fmt(it.perHundred)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] text-cocoa-700">
        Read as dollars out of every $100 a typical firm takes in. Modeled from
        the cost structure; the local market shifts the exact split.
      </p>
    </section>
  );
}

// Cycle the cost fills without mutating the shared array; defined as a helper so
// the kept segment can break the cycle cleanly above.
function COST_FILL_at(i: number): string {
  return COST_FILL[i % COST_FILL.length];
}
