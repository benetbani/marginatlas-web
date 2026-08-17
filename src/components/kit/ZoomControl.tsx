/**
 * ZoomControl - move between altitudes keeping the trade + place sticky
 * (interaction-control foundation, agency principle P4, built on OrientationHeader).
 *
 * A reader looking at one trade in one place often wants the same question at a
 * different resolution: the single shop, the whole city, the country, the exact
 * neighbourhood. ZoomControl is the quiet altitude ladder that lets them step in
 * and out WITHOUT losing the trade or the place. It is the "you are here" bar
 * (OrientationHeader) plus a second, equally quiet row of altitude links: the
 * current altitude is marked and non-link, the adjacent altitudes are plain
 * links to the SAME trade + place at that resolution.
 *
 * Direction is fixed and legible: up = broader (country), down = more specific
 * (neighbourhood). The ladder, broad to specific, is:
 *
 *     country  ->  city  ->  neighbourhood
 *                   |
 *                business      (the trade read at this place)
 *
 * "business" is the trade-at-this-place cell reading; it sits beside city as the
 * activity-specific cut of the same place. Only the altitudes the caller has an
 * href for are shown; the current altitude is always shown (marked, non-link).
 *
 * Reversible by construction: every step is a real link (back-safe, shareable),
 * no client state, no em-dashes, no raw color, no source-agency names. This file
 * is server-renderable (no "use client") so it ships inside the static page.
 *
 * The cross-link emphasis the task calls for, same-trade-nearby and
 * same-place-other-trades, is expressed through this ladder: holding the place
 * and walking the trade up/down its resolution, and holding the trade while the
 * city/country/neighbourhood links keep the place sticky.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  OrientationHeader,
  type OrientationItem,
} from "./controls/OrientationHeader";

/** The four resolutions a trade + place can be read at, broad to specific. */
export type ZoomAltitude = "country" | "city" | "business" | "neighbourhood";

/** Links to the same trade + place at each altitude. Omit one to hide it. The
 *  current altitude renders as a marked, non-link coordinate even without href. */
export type ZoomHrefs = {
  /** Broadest: the trade across the whole country. */
  country?: string;
  /** The trade across the whole city. */
  city?: string;
  /** The single trade-at-this-place cell reading (the "business" altitude). */
  business?: string;
  /** Most specific: the trade in one neighbourhood of the city. */
  neighbourhood?: string;
};

export type ZoomControlProps = {
  /** The trade coordinate held sticky across altitudes (e.g. "Italian restaurant"). */
  trade: string;
  /** The place coordinate held sticky across altitudes (e.g. "London"). */
  place: string;
  /** Which altitude the reader is currently standing at (marked, non-link). */
  altitude: ZoomAltitude;
  /** Same trade + place at adjacent altitudes. Current altitude's href is ignored. */
  hrefs: ZoomHrefs;
  /** Stick to the top of the scroll region (passed to OrientationHeader). Default true. */
  sticky?: boolean;
  className?: string;
};

/** Broad-to-specific order. "business" is the trade-specific cut beside "city",
 *  so it reads one notch deeper than city and one broader than neighbourhood. */
const ALTITUDE_ORDER: readonly ZoomAltitude[] = [
  "country",
  "city",
  "business",
  "neighbourhood",
] as const;

/** Quiet, plain-voiced label for each altitude. The place name is not repeated
 *  here (it already sits sticky in the orientation row above the ladder). */
const ALTITUDE_LABEL: Record<ZoomAltitude, string> = {
  country: "Whole country",
  city: "Whole city",
  business: "This trade here",
  neighbourhood: "By neighbourhood",
};

export function ZoomControl({
  trade,
  place,
  altitude,
  hrefs,
  sticky = true,
  className,
}: ZoomControlProps) {
  const currentIndex = ALTITUDE_ORDER.indexOf(altitude);

  // Build the rungs in fixed broad-to-specific order. Each rung is either the
  // current altitude (marked, non-link) or an adjacent altitude the caller gave
  // a real link for. Altitudes with no href and not current are dropped quietly.
  const rungs = ALTITUDE_ORDER.map((alt) => {
    const isCurrent = alt === altitude;
    const href = hrefs[alt];
    if (!isCurrent && !href) return null;
    return {
      alt,
      isCurrent,
      href: isCurrent ? undefined : href,
      label: ALTITUDE_LABEL[alt],
      // Direction relative to where the reader stands: up = broader.
      direction:
        ALTITUDE_ORDER.indexOf(alt) < currentIndex
          ? ("up" as const)
          : ALTITUDE_ORDER.indexOf(alt) > currentIndex
            ? ("down" as const)
            : ("here" as const),
    };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  // Nothing to move to and no current marker means nothing to render.
  if (rungs.length === 0) return null;

  // The sticky "you are here" coordinate row: trade + place stay fixed, the
  // altitude is the marked current level. This is the same bar the rest of the
  // page uses, so the reader's coordinate never jumps between components.
  const orientationItems: OrientationItem[] = [
    { label: trade },
    { label: place },
    { label: ALTITUDE_LABEL[altitude], current: true },
  ];

  return (
    <div className={cn("w-full", className)}>
      <OrientationHeader items={orientationItems} sticky={sticky} />
      <nav
        aria-label="Change the level of detail for this trade and place"
        className="flex items-center gap-1 overflow-x-auto border-b border-parchment/60 bg-white/80 px-4 py-1.5"
      >
        <span className="mr-1 shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-cocoa-500">
          Zoom
        </span>
        <ol className="flex min-w-0 items-center gap-1 whitespace-nowrap">
          {rungs.map((r) => (
            <li key={r.alt} className="flex items-center">
              {r.isCurrent ? (
                <span
                  aria-current="true"
                  className="inline-flex min-h-[44px] items-center rounded-md px-2 text-sm font-semibold text-ink-900"
                >
                  {r.label}
                </span>
              ) : (
                <a
                  href={r.href}
                  className={cn(
                    "inline-flex min-h-[44px] items-center gap-1 rounded-md px-2 text-sm font-medium text-cocoa-700 transition-colors hover:text-atlas-700",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="text-cocoa-300"
                  >
                    {r.direction === "up" ? "↑" : "↓"}
                  </span>
                  {r.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
