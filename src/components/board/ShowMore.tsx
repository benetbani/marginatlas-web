"use client";

/**
 * src/components/board/ShowMore.tsx
 *
 * The one interactive sliver of the board: a "Show more" / "Show less" toggle
 * that reveals overflow stat rows. Kept in its own tiny client file so the rest
 * of the board (DataSection, StatGrid) stays a pure server render. The extra
 * rows are passed in as already-built children, so this component owns only the
 * open/closed state, nothing about formatting or layout.
 *
 * Accessibility: a real <button> with aria-expanded plus aria-controls wiring
 * to the revealed region, so screen readers announce the collapsed state and
 * the focus ring lands on a focusable control.
 */
import * as React from "react";

export function ShowMore({
  children,
}: {
  /** The pre-rendered overflow rows (a StatGrid of rows 9..n). */
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const regionId = React.useId();

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={regionId}
        className="rounded-sm text-[11px] font-semibold uppercase tracking-wide text-atlas-700 transition-colors hover:text-atlas-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-700 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 motion-reduce:transition-none"
      >
        {open ? "Show less" : "Show more"}
      </button>
      <div id={regionId} hidden={!open} className="mt-3">
        {children}
      </div>
    </div>
  );
}
