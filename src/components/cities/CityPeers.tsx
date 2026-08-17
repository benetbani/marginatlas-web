/**
 * src/components/cities/CityPeers.tsx
 *
 * The "cities like this" peer comparison at the foot of the city page. It
 * replaces the old restaurants-hardcoded sister-cities ribbon with a real peer
 * comparison: a few metros chosen by economic similarity, each shown with its
 * OWN headline 0-100 city score and each linking to that peer's CITY page (not
 * an industry cell). The reader who learned the score on this page's masthead
 * reads the same scale across its peers, and can step sideways to a comparable
 * city rather than bounce.
 *
 * Selection and scoring both live in the domain (buildCityPeers): peers are
 * chosen by similarity on scale and wealth with a different-country preference
 * and at most one per country, and each peer's score runs through the exact path
 * the masthead uses, so a peer's badge reads identically to its own page. A thin
 * peer the score refuses to rate shows its card without a badge rather than a
 * wrong number.
 *
 * Server component, no client JS. Tokens only, mobile-first, warm only in the
 * one short lead line. Self-omits (returns null) when fewer than two peers
 * resolve, so a thin city drops the section cleanly. The card idiom (rounded-2xl
 * border parchment, hover atlas-500) mirrors the ribbon it replaces so the foot
 * of the page reads consistently.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only, no raw hex.
 */
import * as React from "react";
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { buildCityPeers } from "@/lib/scores/city_peers";
import type { BreakInBand } from "@/lib/scores/break_in_rating";
import { climateWord } from "@/lib/scores/band_labels";

/** Band to the score-badge tone, the EXACT moss / atlas / clay scale the city
 * masthead and the country "easiest to break in" panel use, so a peer's badge
 * reads identically here. Higher = a better city = warmer. Tokens only, no hex. */
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

export interface CityPeersProps {
  /** The seed city's slug, used to select its peers. */
  citySlug: string;
  /** The seed city's display name, for the header copy. */
  cityName: string;
}

/**
 * The peer-comparison section. A short header, then a responsive grid of peer
 * cards: each card carries the peer's flag and continent, its name, and a
 * band-toned badge with its own 0-100 city score (omitted for a peer too thin to
 * score), and the whole card links to that peer's city page. Renders nothing when
 * fewer than two peers resolve.
 */
export function CityPeers({ citySlug, cityName }: CityPeersProps) {
  const peers = buildCityPeers(citySlug, 3);
  if (peers.length < 2) return null;

  return (
    /* Canonical surface. Was `rounded-lg border border-parchment bg-cream-50`,
       a flat opaque hand-roll: no elevation, and an opaque fill where the
       canonical card carries the page photograph through at .955. The peer
       CARDS inside stay `bg-white`, because they sit on this card rather than
       on the picture, and nesting a second .atlas-card would double the
       shadow. */
    <section className="atlas-card px-5 py-5 md:px-7 md:py-6">
      <SectionEyebrow className="mb-1">Cities like {cityName}</SectionEyebrow>
      <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl max-w-3xl">
        How {cityName} compares to similar cities
      </h2>
      {/* useless-tile-ok: describes the peer comparison, not a count of things we cover */}
      <p className="mt-3 mb-6 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
        Comparable metros, scored on the same 0 to 100 scale as this page,
        higher means a friendlier place to open a small business.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {peers.map((p) => (
          <Link
            key={`${p.iso2}-${p.slug}`}
            href={`/cities/${p.slug}`}
            className="group block rounded-2xl border border-parchment hover:border-atlas-500 bg-white p-5 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700 font-semibold">
                <CountryFlag iso2={p.iso2} className="w-4" />
                <span>{p.continent}</span>
              </div>
              {p.score != null && p.band != null ? (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${bandBadge(
                    p.band,
                  )}`}
                >
                  <span className="tabular-nums">{p.score}</span>
                  <span>{climateWord(p.band)}</span>
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-cocoa-500">
                  Score pending
                </span>
              )}
            </div>
            <div className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
              {p.name}
            </div>
            <div className="mt-3 text-xs text-cocoa-700 flex items-center gap-1.5 font-medium border-b border-atlas-200 group-hover:border-atlas-500 pb-0.5 transition-colors w-fit">
              See the city
              <span aria-hidden>{"→"}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
