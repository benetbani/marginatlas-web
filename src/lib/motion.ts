/**
 * src/lib/motion.ts
 *
 * Motion vocabulary helpers. The actual duration/easing tokens live
 * in src/lib/design-tokens.ts (so they are part of the single source
 * of truth); this module exposes them in formats the runtime uses:
 *
 *   - CSS strings for inline styles (transition:..., animation:...)
 *   - Stagger-delay calculator for list-item entrance sequences
 *
 * The motion primitives in src/components/ui/motion/* read from
 * here so they all share the same rhythm.
 *
 * Hard rule from ui-ux-pro-max: every motion primitive MUST respect
 * `prefers-reduced-motion`. The Tailwind `motion-reduce:` variant
 * lets us cancel animations declaratively; the primitives apply
 * `motion-reduce:animate-none` so reduced-motion users see instant
 * (no-animation) transitions instead of motion sickness.
 *
 * Design system Phase 4, 2026-05-27.
 */

import { duration, easing } from "./design-tokens";

/**
 * Pre-composed transition strings. Use as `style={{ transition: TRANSITION.fast }}`
 * when the element isn't a standard Tailwind transitioning utility (e.g. when
 * animating a CSS variable or a custom transform).
 */
export const TRANSITION = {
  /** 150ms ease-out. Hover / focus state changes. */
  fast: `all ${duration.fast} ${easing.out}`,
  /** 200ms ease-out. Most state transitions. */
  base: `all ${duration.base} ${easing.out}`,
  /** 300ms ease-out. Enter / exit animations. */
  slow: `all ${duration.slow} ${easing.out}`,
  /** 200ms spring. Bouncy state changes (pressed buttons, toasts). */
  spring: `all ${duration.base} ${easing.spring}`,
} as const;

/**
 * Stagger calculator. Returns a CSS `animation-delay` string for the
 * Nth item in a list, capped so a very long list does not feel slow.
 *
 * Usage:
 *   {items.map((item, i) => (
 *     <FadeIn key={item.id} style={{ animationDelay: stagger(i) }}>...</FadeIn>
 *   ))}
 *
 * The default base is 40ms per index (per Material Design's
 * recommendation: 30-50ms is the sweet spot for staggered reveals).
 * The cap defaults to 480ms so the 12th item lands at the same time
 * as the cap, preventing a sluggish wait on long lists.
 */
export function stagger(index: number, baseMs = 40, capMs = 480): string {
  const delay = Math.min(index * baseMs, capMs);
  return `${delay}ms`;
}

/**
 * Re-exports of the underlying token values so consumers do not have
 * to reach into design-tokens just to read motion timings.
 */
export { duration, easing };
