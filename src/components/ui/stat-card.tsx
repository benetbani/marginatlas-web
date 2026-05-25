/**
 * StatCard — canonical KPI tile for the whole site.
 *
 * Visual upgrade §2 (2026-05-26). One primitive replaces ~4 hand-
 * rolled stat-tile variants scattered across CountryAtAGlance,
 * CountryStatsStrip, the cell page KPI strip, and the coverage page.
 *
 * Shape:
 *   - tiny eyebrow label (cocoa-700/70, uppercase, tracking)
 *   - large value in font-display (tabular-nums) with the canonical
 *     stat color (ink-900 by default; atlas-700 when tone=accent)
 *   - optional guiding-word / sub-caption rendered with a color
 *     prop so the gradient system can drive it
 *
 * Surface inherits the .atlas-card-band / .atlas-card-soft / .atlas-card
 * choice via the variant prop. Default is atlas-card-band (suits the
 * white-band section pattern).
 *
 * Sizing: sm | md (default) | lg. Larger sizes scale type + padding
 * proportionally; the visual rhythm stays consistent across pages.
 *
 * No client JS. Pure server-renderable.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

type Variant = "card" | "soft" | "band";
type Size = "sm" | "md" | "lg";
type Tone = "default" | "accent";

const VARIANT_CLASS: Record<Variant, string> = {
  card: "atlas-card",
  soft: "atlas-card-soft",
  band: "atlas-card-band",
};

const SIZE_PADDING: Record<Size, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
  lg: "px-5 py-4",
};

const SIZE_LABEL: Record<Size, string> = {
  sm: "text-[9px] tracking-[0.14em]",
  md: "text-[10px] tracking-[0.14em]",
  lg: "text-[11px] tracking-[0.16em]",
};

const SIZE_VALUE: Record<Size, string> = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl",
};

const SIZE_SUB: Record<Size, string> = {
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-xs",
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tiny eyebrow label. Always uppercase + tracked. */
  label: string;
  /** Large value. Pass a string; numeric formatting is the caller's job. */
  value: string | React.ReactNode;
  /** Sub-line: guiding word (color from guidingColor) OR a plain caption. */
  sub?: string;
  /** Color for the sub line. When omitted, sub renders in muted cocoa. */
  subColor?: string;
  /** Surface variant. Default "band". */
  variant?: Variant;
  /** Size scale. Default "md". */
  size?: Size;
  /** Tone for the VALUE. "accent" colors it atlas-700. Default "default" (ink-900). */
  tone?: Tone;
  /** Render the "not yet measured" empty state when value is missing. */
  emptyLabel?: string;
}

export function StatCard({
  label,
  value,
  sub,
  subColor,
  variant = "band",
  size = "md",
  tone = "default",
  // useless-tile-ok: legitimate empty-state copy default for the primitive
  emptyLabel = "not measured",
  className,
  ...rest
}: StatCardProps) {
  const isEmpty =
    value == null ||
    (typeof value === "string" && (value.trim() === "" || value === "-"));

  return (
    <div className={cn(VARIANT_CLASS[variant], SIZE_PADDING[size], className)} {...rest}>
      <div
        className={cn(
          "uppercase font-medium leading-none text-ink-700/70",
          SIZE_LABEL[size],
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-display font-semibold tabular-nums leading-tight truncate",
          SIZE_VALUE[size],
          tone === "accent" ? "text-atlas-700" : "text-ink-900",
        )}
      >
        {isEmpty ? "-" : value}
      </div>
      {isEmpty ? (
        <div className={cn("mt-0.5 truncate text-ink-700/40", SIZE_SUB[size])}>
          {emptyLabel}
        </div>
      ) : sub ? (
        <div
          className={cn("mt-0.5 font-medium truncate", SIZE_SUB[size])}
          style={subColor ? { color: subColor } : undefined}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}
