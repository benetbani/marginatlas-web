/**
 * Waterfall - "where the money goes" (design-system 10.1, charts family).
 *
 * Revenue cascades down through each cost to the owner's take-home. Each step is
 * a labeled horizontal bar showing the deduction seated against the running
 * balance; the closing "kept" row reads positive (moss), the one good moment.
 * One cost may carry the lone vermillion accent (`accentKey`) when the page wants
 * to point at the cost that moves the margin.
 *
 * This is DATA: clean, opaque, high-contrast. No gridlines, no legend, direct
 * labels, tabular figures. Color is meaning only (the accented cost, the kept
 * row). Reduces to a single legible 375px column with no horizontal scroll, with
 * the bar dropping under the label rather than sharing the row. Filled + empty
 * states. The cascade does the kit's one subtle reveal on enter via the shared
 * ds-slide-up keyframe, motion-safe-gated (the 300ms house ease-out curve), so
 * the component stays server-renderable with no client JS.
 *
 * Section: feeds the cell page "Where the money goes" block (the per-revenue
 * cost cascade), the richer companion to MoneyGoesBreakdown's per-$100 view.
 * Where MoneyGoesBreakdown reads shares of $100, this reads the dollar cascade
 * from revenue to take-home.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { fmtUsdCompact, isNum, hasText, ChartEmpty, ChartEyebrow } from "./helpers";

export type WaterfallStep = {
  /** Stable key, also matched against `accentKey`. */
  key?: string;
  label: string;
  /** Positive amount deducted at this step. */
  amount: number;
  /** Optional one-line clarifier under the label. */
  hint?: string;
};

export type WaterfallProps = {
  /** Starting value (revenue). */
  start: number | null | undefined;
  /** @default "Revenue" */
  startLabel?: string;
  steps: WaterfallStep[];
  /** @default "Owner take-home" */
  endLabel?: string;
  /** `key` of the step that gets the vermillion accent (e.g. "labor"). */
  accentKey?: string | null;
  /** Compact-USD by default; pass a matching formatter to override. */
  format?: (n: number) => string;
  /** Inline chart eyebrow. @default "Where the money goes" */
  eyebrow?: string | null;
  className?: string;
};

// Quiet warm neutrals for the cost bars, cycled in order. The terracotta kept
// fill is handled separately, so these never carry meaning of their own beyond
// "a cost". That pairing IS the diverging grammar: one hue for what the operator
// keeps, no hue at all for what leaves. The kept bar was moss-500 until
// 2026-08-17, which is banned outright.
const COST_FILL = [
  "bg-ink-700",
  "bg-ink-500",
  "bg-cocoa-500",
  "bg-ink-300",
  "bg-cream-400",
] as const;

export function Waterfall({
  start,
  startLabel = "Revenue",
  steps,
  endLabel = "Owner take-home",
  accentKey = null,
  format = fmtUsdCompact,
  eyebrow = "Where the money goes",
  className,
}: WaterfallProps) {
  const clean = (steps ?? []).filter(
    (s): s is WaterfallStep & { amount: number } => hasText(s.label) && isNum(s.amount) && s.amount >= 0,
  );

  // Nullable in, honest scaffolding out: with no revenue or no steps we hold the
  // place rather than draw a misleading cascade.
  if (!isNum(start) || start <= 0 || clean.length === 0) {
    return (
      <ChartEmpty
        eyebrow={eyebrow}
        note="Not held yet. The cost breakdown appears once this market is modeled."
        className={className}
      />
    );
  }

  const totalCost = clean.reduce((s, x) => s + x.amount, 0);
  const kept = start - totalCost;

  let running = start;
  const rows = clean.map((step) => {
    const before = running;
    running -= step.amount;
    return { ...step, before, after: running };
  });

  const barFill = (key: string | undefined, i: number) =>
    key != null && key === accentKey ? "bg-chart-primary" : COST_FILL[i % COST_FILL.length];

  return (
    <figure
      role="group"
      aria-label={`${eyebrow ?? "Where the money goes"}. ${startLabel} ${format(start)}, ${endLabel} ${format(kept)}.`}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(eyebrow) ? <ChartEyebrow className="mb-3.5">{eyebrow}</ChartEyebrow> : null}

      {/* the one subtle reveal: the cascade rises and fades in on enter via the
          shared keyframe, motion-safe-gated so a reduced-motion reader gets the
          final state with no animation. */}
      <div className="motion-safe:animate-ds-slide-up">
        {/* revenue: the full bar, the top of the cascade */}
        <Row name={startLabel} amount={format(start)} sub="comes in" strong>
          <span className="absolute inset-0 rounded-[3px] bg-ink-900" />
        </Row>

        {rows.map((r, i) => {
          const leftPct = (r.after / start) * 100;
          const widthPct = (r.amount / start) * 100;
          return (
            <Row
              key={r.key || r.label}
              name={r.label}
              amount={`− ${format(r.amount)}`}
              sub={r.hint ?? `${Math.round((r.amount / start) * 100)}% of revenue`}
              amountTone="muted"
            >
              <span
                className={["absolute inset-y-0 min-w-[3px] rounded-[3px]", barFill(r.key, i)].join(" ")}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              />
            </Row>
          );
        })}

        {/* kept: the one terracotta moment, what the owner keeps */}
        <Row
          name={endLabel}
          amount={format(kept)}
          sub={`${Math.round((kept / start) * 100)}% kept`}
          amountTone="pos"
          strong
        >
          <span
            className="absolute inset-y-0 left-0 min-w-[3px] rounded-[3px] bg-atlas-500"
            style={{ width: `${Math.max(0, (kept / start) * 100)}%` }}
          />
        </Row>
      </div>
    </figure>
  );
}

function Row({
  name,
  amount,
  sub,
  children,
  strong = false,
  amountTone = "strong",
}: {
  name: string;
  amount: string;
  sub?: string;
  children: React.ReactNode;
  strong?: boolean;
  amountTone?: "strong" | "muted" | "pos";
}) {
  const amountColor =
    amountTone === "pos" ? "text-atlas-700" : amountTone === "muted" ? "text-cocoa-700" : "text-ink-900";
  return (
    // Desktop: label / track / figure on one grid row. Mobile (below sm): the
    // track drops under the label+figure so labels never shrink and the bar still
    // reads full-width. Labels stay at 13.5px (>= the 11px floor) on both.
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 py-1.5 sm:grid-cols-[minmax(96px,1.1fr)_2fr_minmax(82px,auto)]">
      <div className="min-w-0">
        <div
          className={[
            "truncate text-[13.5px] leading-tight",
            strong ? "font-semibold text-ink-900" : "font-medium text-ink-700",
          ].join(" ")}
        >
          {name}
        </div>
        {hasText(sub) ? <div className="text-[11px] text-cocoa-700">{sub}</div> : null}
      </div>
      {/* The track sits second on desktop (the middle column) and last on mobile
          (full width across both columns). order utilities reorder it per breakpoint. */}
      <div className="relative order-last col-span-2 h-4 rounded-[3px] bg-cream-200 sm:order-none sm:col-span-1">
        {children}
      </div>
      <div
        className={[
          "text-right font-sans tabular-nums",
          strong ? "text-[15px] font-bold" : "text-[14px] font-semibold",
          amountColor,
        ].join(" ")}
      >
        {amount}
      </div>
    </div>
  );
}
