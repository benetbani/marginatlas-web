"use client";

/**
 * PendingShell - keeps content in control during a server re-derivation
 * (interaction-control foundation, agency principle P2).
 *
 * P2 (respond at the action's tempo): when a change cannot be computed client-
 * side and a server round-trip is needed, the UI must NOT blank the numbers or
 * throw up a full-page spinner. Instead it acknowledges instantly: the old
 * numbers stay on screen, visible but dimmed, with a subtle non-blocking shimmer
 * hint laid over them, and the region marks itself `aria-busy` for assistive
 * tech. The reader keeps their place; the figures just refresh under them.
 *
 * Reduced motion: the shimmer is dropped, leaving a static dim (still clearly
 * "working", no animation). Never blanks, never centers a spinner.
 *
 * Tokens only, no raw color or ms, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type PendingShellProps = {
  /** True while a server re-derivation is in flight. */
  pending: boolean;
  /** Accessible status read out when pending begins. Defaults to "Updating". */
  busyLabel?: string;
  children: React.ReactNode;
  className?: string;
};

export function PendingShell({
  pending,
  busyLabel = "Updating",
  children,
  className,
}: PendingShellProps) {
  return (
    <div
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
      className={cn("relative", className)}
    >
      {/* the live content: dimmed but never removed while pending */}
      <div
        className={cn(
          "transition-opacity duration-200 motion-reduce:transition-none",
          pending ? "opacity-60" : "opacity-100",
        )}
      >
        {children}
      </div>

      {/* the non-blocking shimmer hint, laid over (not replacing) the content.
          A single sweep, gated off under motion-reduce so the dim alone reads. */}
      {pending ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        >
          <div className="atlas-pending-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-cream-50/70 to-transparent motion-reduce:hidden" />
        </div>
      ) : null}

      {/* the quiet status, announced once to assistive tech, hidden visually */}
      {pending ? (
        <span role="status" className="sr-only">
          {busyLabel}
        </span>
      ) : null}
    </div>
  );
}
