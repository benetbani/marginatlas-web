/**
 * charts/helpers.tsx - the shared vocabulary for the Atlas chart family.
 *
 * Every chart in this folder is DATA: it lives by the warm-frame-clean-data law,
 * so it stays clean, opaque and high-contrast in the middle (no glass, no imagery
 * behind a number, no gridlines, no legend). These helpers keep that discipline
 * consistent across the family: one number guard, one compact-USD formatter, the
 * shared "not held yet" empty card, and the inline chart eyebrow.
 *
 * The family's one subtle reveal (the bars rising-and-fading on the Waterfall +
 * ComparisonBars) is done with the kit's shared `ds-slide-up` keyframe under a
 * `motion-safe:` gate, not JS, so those charts stay server-renderable and a
 * reduced-motion reader simply gets the final state. A `usePrefersReducedMotion`
 * hook is still exported for any future client chart that needs to branch on it.
 *
 * Tokens only by way of the consumers' classes; this owns no color. No raw hex,
 * no em-dashes, no source-agency names.
 */
import * as React from "react";

/** A finite, real number. */
export function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/** A finite, non-negative real number (for shares, counts, intensities). */
export function isNonNeg(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v) && v >= 0;
}

/** True when a string has visible content. */
export function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/**
 * Compact USD, the family default formatter. Mirrors `formatWithSpec("usd-compact")`
 * but is a plain function so charts can take a `format` override without crossing
 * the server boundary. The dash for a missing value matches the kit's en-dash.
 */
export function fmtUsdCompact(n: number | null | undefined): string {
  if (!isNum(n)) return "–";
  const a = Math.abs(n);
  if (a >= 1_000_000) {
    const v = n / 1_000_000;
    return `$${v.toFixed(v < 10 ? 1 : 0)}M`;
  }
  if (a >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

/** Clamp a fraction into [0, 1]. */
export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * prefers-reduced-motion, read on mount. SSR-safe: returns false on the server
 * and the first client paint, then settles to the real value. The current charts
 * do not need this (their reveal is a CSS `motion-safe:` keyframe); it is exported
 * for any future client chart that must branch on it in JS.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/**
 * The shared "not held yet" empty card. A required chart keeps its place even
 * when this instance holds no data (the founder's always-present rule): a quiet
 * dashed card with the eyebrow and an honest line, never a fabricated bar. The
 * wording reads as intentional scaffolding, not a broken state.
 */
export function ChartEmpty({
  eyebrow,
  note,
  className,
}: {
  eyebrow?: string | null;
  note: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {hasText(eyebrow) ? (
        <div className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700">
          {eyebrow}
        </div>
      ) : null}
      <div className="rounded-md border border-dashed border-cream-400 bg-cream-100 px-5 py-5 text-center text-[13px] leading-relaxed text-cocoa-700">
        {note}
      </div>
    </div>
  );
}

/**
 * The family eyebrow: the small tracked uppercase label above a chart. Inline
 * (not the section-level SectionEyebrow) so a chart can sit inside a section that
 * already has its own heading without nesting two eyebrows. 12px floor.
 */
export function ChartEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "text-xs font-semibold uppercase tracking-[0.16em] text-cocoa-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
