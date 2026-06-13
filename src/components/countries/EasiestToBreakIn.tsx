/**
 * src/components/countries/EasiestToBreakIn.tsx
 *
 * The place-level "easiest businesses to break into here" panel. It is the flip
 * side of the across-cities comparison: that surface fixes one business and ranks
 * places; this one fixes one place (a country or a city) and ranks the place's
 * own businesses by the single break-in rating (0..100, higher = easier to break
 * in and win). A buyer who lands on a place sees, at a glance, which activities
 * here are the friendliest to get started in.
 *
 * Every score is the SAME number that business's own cell masthead shows: the
 * rows are computed in the place board builder (buildEasiestToBreakIn) for the
 * exact cell each row links to, through the same break-in path the masthead uses,
 * so the badge here and the badge on that cell page agree. The badge tone is the
 * EXACT moss / atlas / clay scale the break-in masthead, the across comparison,
 * and the cost-to-open rows use, so a reader who has learned the scale reads it
 * here for free.
 *
 * Server component, no client JS. Tokens only, mobile-first, warm only in the one
 * short lead line. Renders nothing when the caller passes fewer than a few rows
 * (the builder already self-omits a thin ranking), so the page degrades cleanly.
 *
 * Design system: application section. Consumes the place-board domain
 * (EasiestBreakInRow from src/lib/scores/country_board). It renders no
 * <section id=> of its own; the caller wraps it in the page's section slot.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only, no raw hex.
 */
import * as React from "react";
import Link from "next/link";
import type { EasiestBreakInRow } from "@/lib/scores/country_board";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { breakInWord } from "@/lib/scores/band_labels";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/** Band to the badge tone. Higher = easier = warmer, the EXACT moss / atlas /
 * clay scale the break-in masthead and the across comparison use, so the badge
 * reads identically here. */
function bandBadge(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "border-moss-300 bg-moss-50 text-moss-700";
    case "manageable":
    case "demanding":
      return "border-atlas-300 bg-atlas-100/60 text-atlas-700";
    case "brutal":
      return "border-clay-300 bg-clay-100/60 text-clay-700";
  }
}

export interface EasiestToBreakInProps {
  /** The ranked rows, easiest first (already sorted + filtered by the builder). */
  rows: EasiestBreakInRow[];
  /** The place name for the warm lead line ("...in Germany"). */
  placeName: string;
  /** How many rows to show. The scannable top set; defaults to 8. */
  limit?: number;
}

/**
 * The panel. A short warm lead, then a scannable set of the place's businesses
 * ranked easiest first: each row is the business name, its band-toned break-in
 * badge (the masthead score), and a quiet link to that business's full read in
 * this place. Rows whose cell has a trusted-local cost-to-open page also show a
 * quiet "Cost to open" link one tap away; rows backed by an aggregate cell (whose
 * /opening would notFound()) omit it. Renders nothing when there are too few rows
 * to rank honestly.
 */
export function EasiestToBreakIn({ rows, placeName, limit = 8 }: EasiestToBreakInProps) {
  if (!rows || rows.length < 3) return null;
  const shown = rows.slice(0, Math.max(3, limit));

  return (
    <div>
      <SectionEyebrow className="mb-2">Easiest to break in</SectionEyebrow>
      <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
        Where it is easiest to get started in {placeName}
      </h2>
      {/* useless-tile-ok: describes the break-in ranking, not a count of things we cover */}
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-graphite">
        The activities here ranked by the break-in rating, the single 0 to 100
        read of how easy it is to break in and win, higher is easier. It is the
        same score each business shows on its own page. Open one for the full
        cost, tax, and what is left for an owner.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((r) => (
          <li key={r.industryId}>
            <Link
              href={r.href}
              className="atlas-card flex h-full items-center justify-between gap-3 px-4 py-3"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">
                  {r.industryName}
                </span>
                <span className="mt-0.5 block text-[11px] text-cocoa-500">
                  See the full read
                </span>
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandBadge(
                  r.band,
                )}`}
              >
                <span className="tabular-nums">{r.score}</span>
                <span>{breakInWord(r.band)}</span>
              </span>
            </Link>
            {r.openingHref && (
              <Link
                href={r.openingHref}
                className="mt-1 inline-flex items-center text-[11px] font-medium text-cocoa-500 transition-colors hover:text-atlas-700"
              >
                Cost to open
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
