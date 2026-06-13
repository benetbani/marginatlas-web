"use client";

/**
 * CountUpNumber - the masthead anchor count-up (design-system 11.2).
 *
 * The ONE count-up on the site: the masthead anchor number eases from a low
 * start to its value on first reveal, settling within `deliberate` (400ms).
 * Everywhere else a number is just typography. Respects prefers-reduced-motion
 * (renders the final value immediately, no animation) and is SSR-safe (the
 * server and first client paint both show the final formatted value, so there
 * is no hydration flash or layout shift; the animation only runs after mount).
 *
 * Tokens only by way of the caller's classes; this owns no color. The format
 * function turns the running number into the display string each frame.
 */
import * as React from "react";
import { duration as DURATION } from "@/lib/design-tokens";
import { formatWithSpec, type NumberFormatSpec } from "./numberFormat";

// The motion budget's longest step, as a number for the rAF math. Pulled from
// the token ("400ms") so there is no raw ms literal in the component.
const DELIBERATE_MS = parseInt(DURATION.deliberate, 10);

export type CountUpNumberProps = {
  /** The target value to count to. */
  value: number;
  /** Serializable format spec (a function cannot cross the server boundary). */
  format: NumberFormatSpec;
  /** Where to start the count from, as a fraction of value (default 0.72). */
  fromFraction?: number;
  className?: string;
};

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CountUpNumber({
  value,
  format,
  fromFraction = 0.72,
  className,
}: CountUpNumberProps) {
  // Start at the final value so SSR and the first paint match (no flash); the
  // effect rewinds and animates only on the client, only when motion is allowed.
  const [display, setDisplay] = React.useState<number>(value);

  React.useEffect(() => {
    if (!Number.isFinite(value)) return;
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    const start = value * fromFraction;
    const durationMs = DELIBERATE_MS;
    let raf = 0;
    let startTs = 0;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / durationMs);
      setDisplay(start + (value - start) * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setDisplay(start);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, fromFraction]);

  return (
    <span className={className} aria-label={formatWithSpec(value, format)}>
      <span aria-hidden="true">{formatWithSpec(display, format)}</span>
    </span>
  );
}
