/**
 * OrientationHeader - the compact sticky "you are here" bar
 * (interaction-control foundation, agency principle P4).
 *
 * P4 (always oriented): as a reader pivots a cell across trade, place, and
 * altitude, a quiet coordinate row keeps them located. Each coordinate is a link
 * back to its level EXCEPT the current one, which is non-link and emphasized:
 * recognition over recall, the reader sees where they stand without having to
 * remember the path that got them there.
 *
 * No client state: this is a plain server-renderable component (no "use client")
 * so it ships inside the static page and costs nothing to hydrate. The caller
 * passes either the convenience trade/place/altitude trio or an explicit `items`
 * coordinate list (items wins when both are given).
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type OrientationItem = {
  label: string;
  /** Link target for this coordinate. Omit (or mark current) to render as text. */
  href?: string;
  /** The reader's current level: non-link, emphasized. */
  current?: boolean;
};

export type OrientationHeaderProps = {
  /** Convenience: the trade coordinate (e.g. "Italian restaurant"). */
  trade?: string;
  /** Convenience: the place coordinate (e.g. "London"). */
  place?: string;
  /** Convenience: the altitude coordinate (e.g. "City level"), marked current. */
  altitude?: string;
  /** Explicit coordinate list. Takes precedence over trade/place/altitude. */
  items?: OrientationItem[];
  /** Stick to the top of the scroll region. Default true. */
  sticky?: boolean;
  className?: string;
};

function CoordSeparator() {
  return (
    <span aria-hidden="true" className="px-1 text-cocoa-300">
      /
    </span>
  );
}

export function OrientationHeader({
  trade,
  place,
  altitude,
  items,
  sticky = true,
  className,
}: OrientationHeaderProps) {
  // Build the coordinate row. Explicit items win; otherwise compose the trio,
  // marking altitude as the current level (the deepest coordinate).
  const coords: OrientationItem[] =
    items ??
    [
      trade ? { label: trade } : null,
      place ? { label: place } : null,
      altitude ? { label: altitude, current: true } : null,
    ].filter((c): c is OrientationItem => c !== null);

  if (coords.length === 0) return null;

  return (
    <nav
      aria-label="You are here"
      className={cn(
        sticky ? "sticky top-0 z-sticky" : "",
        "flex items-center overflow-x-auto border-b border-parchment/60 bg-cream-75/90 px-4 py-2 text-sm backdrop-blur supports-[backdrop-filter]:bg-cream-75/75",
        className,
      )}
    >
      <ol className="flex min-w-0 items-center whitespace-nowrap">
        {coords.map((c, i) => {
          const isLink = !c.current && typeof c.href === "string" && c.href.length > 0;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center">
              {i > 0 ? <CoordSeparator /> : null}
              {isLink ? (
                <a
                  href={c.href}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-md px-1.5 font-medium text-cocoa-700 transition-colors hover:text-atlas-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
                  )}
                >
                  {c.label}
                </a>
              ) : (
                <span
                  aria-current={c.current ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-[44px] items-center px-1.5",
                    c.current
                      ? "font-semibold text-ink-900"
                      : "font-medium text-cocoa-700",
                  )}
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
