"use client";

/**
 * ActivitySearch — the interactive half of the /industries directory.
 *
 * The server page (src/app/industries/page.tsx) computes the categorized
 * activity list once, purely from the taxonomy, and hands it here as
 * serializable props. This component owns BOTH the search input and the
 * grouped rendering: it filters the list live as the user types
 * (case-insensitive match on activity name), hides sectors that no longer
 * have a match, and shows a quiet "no matches" line when nothing fits.
 *
 * Client-safe by construction: it imports only next/link and React. No
 * Supabase, no server-only lib. The shapes below are plain data.
 *
 * Site reform v3, Phase B (2026-06-06).
 */
import { useMemo, useState, useId } from "react";
import Link from "next/link";
import { AtlasPictogram } from "@/components/brand/pictograms";
import type { AtlasPictogramId } from "@/components/brand/pictograms";

/** One activity inside a sector. Plain, serializable. `picto` is resolved on
 *  the server by industryPictogramId so this client component stays lean. */
export type ActivityLink = { slug: string; name: string; picto: AtlasPictogramId };

/** A sector and the activities under it, already ordered by the server. */
export type SectorGroup = { sector: string; activities: ActivityLink[] };

export function ActivitySearch({ groups }: { groups: SectorGroup[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const trimmed = query.trim().toLowerCase();

  // Filter per sector; drop any sector with no surviving activity. With an
  // empty query every sector and activity passes through unchanged.
  const filtered = useMemo(() => {
    if (!trimmed) return groups;
    const out: SectorGroup[] = [];
    for (const g of groups) {
      const activities = g.activities.filter((a) =>
        a.name.toLowerCase().includes(trimmed),
      );
      if (activities.length > 0) out.push({ sector: g.sector, activities });
    }
    return out;
  }, [groups, trimmed]);

  const matchCount = useMemo(
    () => filtered.reduce((n, g) => n + g.activities.length, 0),
    [filtered],
  );

  return (
    <div>
      {/* Search bar — real labelled input, white, hairline border. */}
      <div className="mx-auto mb-10 max-w-xl md:mb-12">
        <label
          htmlFor={inputId}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700"
        >
          Search activities
        </label>
        <div className="relative">
          <input
            id={inputId}
            type="search"
            inputMode="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try cafe, plumber, gym, salon"
            className="w-full rounded-xl border border-parchment bg-white px-4 py-3 text-base text-ink-900 shadow-[0_1px_2px_rgba(33,24,16,0.04)] transition-colors placeholder:text-cocoa-500 hover:border-atlas-300 focus-visible:border-atlas-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
          />
        </div>
        {/* Live status: how many activities match. Polite so a screen
            reader hears the count update without stealing focus. */}
        <p
          aria-live="polite"
          className="mt-2 min-h-[1.25rem] text-sm text-cocoa-700/70"
        >
          {trimmed
            ? `${matchCount} ${matchCount === 1 ? "activity" : "activities"} match "${query.trim()}"`
            : ""}
        </p>
      </div>

      {/* Grouped sections. One <section> per sector, heading + activity
          grid, hairline separation between them. */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-base text-cocoa-700/80">
          No activities match that search. Try a broader word.
        </p>
      ) : (
        filtered.map((group, i) => (
          <section
            key={group.sector}
            className={
              i === 0
                ? "py-8 md:py-10"
                : "border-t border-parchment/60 py-8 md:py-10"
            }
          >
            <h2 className="mb-5 font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
              {group.sector}{" "}
              <span className="align-middle text-sm font-normal tabular-nums text-cocoa-700/60">
                {group.activities.length}
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {group.activities.map((a) => (
                <Link
                  key={a.slug}
                  href={`/industries/${a.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-parchment bg-white p-3 shadow-subtle transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cream-100 text-cocoa-700 transition-colors group-hover:bg-atlas-50 group-hover:text-atlas-700">
                    <AtlasPictogram id={a.picto} size={22} />
                  </span>
                  <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700">
                    {a.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
