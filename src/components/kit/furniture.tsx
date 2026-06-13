/**
 * Closing furniture - FreshnessStamp and FlagIt (design-system 13.1 #4).
 *
 * The quiet close on every page: when the read was last refreshed, and an honest
 * invitation to push back when a number looks off. Both self-omit on empty input.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { TierDot, type Tier } from "@/components/ui/tier-dot";

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/* ------------------------------------------------------------------ */
/* FreshnessStamp - when this read was last refreshed.                 */
/* ------------------------------------------------------------------ */

export function FreshnessStamp({
  updated,
  tier,
  className,
}: {
  /** A human label, e.g. "June 2026" or "this quarter". */
  updated?: string | null;
  tier?: Tier | null;
  className?: string;
}) {
  if (!hasText(updated) && !tier) return null;
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-cocoa-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasText(updated) ? (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-moss-500"
          />
          Updated {updated}
        </span>
      ) : null}
      {tier ? <TierDot tier={tier} showLabel /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FlagIt - an honest invitation to push back on a number.             */
/* ------------------------------------------------------------------ */

export function FlagIt({
  href = "/about-data",
  label = "See a number that looks off?",
  cta = "How we build these, and how to flag it",
  className,
}: {
  href?: string;
  label?: string;
  cta?: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm text-cocoa-700/80",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span>{label}</span>
      <a
        href={href}
        className="font-medium text-atlas-700 underline decoration-atlas-200 underline-offset-2 transition-colors hover:decoration-atlas-700"
      >
        {cta}
      </a>
    </div>
  );
}
