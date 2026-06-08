/**
 * src/components/board/InfoDot.tsx
 *
 * A tiny "?" affordance that reveals a one-line explanation on hover or keyboard
 * focus. CSS-only (group-hover + group-focus-within), so the static board stays
 * free of client JS. Tokens only, no raw hex. Used by the ruled StatGrid in place
 * of a stacked sub-label, per founder direction 2026-06-08.
 */
import * as React from "react";

export function InfoDot({ tip }: { tip: string }) {
  return (
    <span className="group/info relative ml-1 inline-flex align-middle">
      <span
        tabIndex={0}
        role="note"
        aria-label={tip}
        className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-cocoa-300 text-[9px] font-semibold leading-none text-cocoa-500 select-none"
      >
        ?
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-48 rounded-lg border border-parchment bg-white p-2 text-[11px] font-normal normal-case leading-snug tracking-normal text-cocoa-700 opacity-0 shadow-sm transition-opacity duration-150 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
      >
        {tip}
      </span>
    </span>
  );
}
