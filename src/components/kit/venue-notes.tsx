/**
 * venue-notes - the quiet venue-context note slots (design-system 13.x, the
 * specced captive-venue + free-zone note cards).
 *
 * When a reader switches the venue to an airport, a mall, or a special economic
 * zone, the economics shift in ways the numbers alone do not explain: a captive
 * venue charges premium rent and supports premium prices because the footfall has
 * nowhere else to go; a free zone changes the tax and duty footing. These two
 * small presentational cards carry that one note beside the switched figures.
 *
 * They are TEMPLATED: each takes a short { title, body } via props. There is no
 * authored prose baked in and no fabricated figures, the caller supplies the
 * exact words (assembled upstream from held data), so these stay constraint-safe
 * and never invent a number or a place detail.
 *
 * Server-safe (no client hooks). Tokens only, no raw color, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type VenueNoteProps = {
  /** Short heading, e.g. "Why an airport unit costs more". Supplied by the page. */
  title: string;
  /** One or two short sentences. Supplied by the page (no fabricated figures). */
  body: React.ReactNode;
  className?: string;
};

/** A shared shell so both notes read as one card grammar (icon + title + body). */
function VenueNoteShell({
  title,
  body,
  icon,
  iconLabel,
  className,
}: VenueNoteProps & { icon: React.ReactNode; iconLabel: string }) {
  // Self-omit on an empty note rather than render an empty card.
  if (!title?.trim() && !body) return null;

  return (
    <aside
      className={cn(
        // Canonical surface: was "rounded-lg border border-parchment bg-cream-50/60".
        "atlas-card flex gap-3 px-5 py-4",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-parchment bg-paper-100 text-cocoa-700"
      >
        {icon}
        <span className="sr-only">{iconLabel}</span>
      </span>
      <div className="min-w-0">
        {title?.trim() ? (
          <h3 className="text-sm font-semibold tracking-tight text-ink-900">
            {title}
          </h3>
        ) : null}
        {body ? (
          <p className="mt-1 text-sm leading-relaxed text-cocoa-700">{body}</p>
        ) : null}
      </div>
    </aside>
  );
}

/**
 * CaptiveVenueNote - the airport / mall / station premium-economics note. Use it
 * beside the figures when the active venue is a captive one (premium rent and
 * premium prices because the footfall cannot leave).
 */
export function CaptiveVenueNote({ title, body, className }: VenueNoteProps) {
  return (
    <VenueNoteShell
      title={title}
      body={body}
      className={className}
      iconLabel="Captive venue"
      icon={
        // A pin in a ring: a fixed spot the footfall is funnelled through.
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 10 8 14 8 14Z" />
          <circle cx="8" cy="6.5" r="1.6" />
        </svg>
      }
    />
  );
}

/**
 * FreeZoneNote - the special-economic-zone economics note. Use it beside the
 * figures when the active venue sits in a free zone (a different tax and duty
 * footing from the surrounding market).
 */
export function FreeZoneNote({ title, body, className }: VenueNoteProps) {
  return (
    <VenueNoteShell
      title={title}
      body={body}
      className={className}
      iconLabel="Free zone"
      icon={
        // A tag: the zone's special duty / tax footing.
        <svg
          viewBox="0 0 16 16"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 7.4V3.4a1 1 0 0 1 1-1h4l6 6a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4 0l-6-6Z" />
          <circle cx="5.4" cy="5.4" r="0.9" />
        </svg>
      }
    />
  );
}
