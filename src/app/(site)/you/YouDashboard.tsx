"use client";

/**
 * YouDashboard - the calm "your Atlas" surface.
 *
 * Aggregates the three durable, client-side things the reader builds as they go:
 *   1. the watch list (shortlisted businesses, places, activities),
 *   2. the standing context profile (the assumptions that follow them),
 *   3. recent comparisons (the matchups they lined up on /compare).
 *
 * None of this is on a server: it all lives in localStorage, so this is a client
 * component that hydrates after mount. Every section has an honest empty state
 * (the founder's rule: never a broken or fabricated card, an intentional "not
 * yet"). One card grammar throughout (BeatCard), tokens only, AA, 44px targets,
 * reduced-motion honored. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { BeatCard } from "@/components/kit";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/taxonomy";
import {
  useWatchList,
  buildCompareHref,
  type WatchKind,
} from "@/lib/watch_store";
import { useProfile } from "@/lib/profile";

const RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2";

/* ------------------------------------------------------------------ */
/* Recent comparisons reader.                                          */
/*                                                                     */
/* The /compare page (owned by the lead) can record each matchup the    */
/* reader lands on into this localStorage key, newest first. We read it  */
/* defensively here: until the compare page writes it, this stays empty  */
/* and the section shows its honest "not yet" state.                     */
/* ------------------------------------------------------------------ */

const RECENT_COMPARES_KEY = "atlas:recent-compares:v1";

type RecentCompare = {
  /** The /compare href that restores this matchup (carries ?q=). */
  href: string;
  /** A human label, e.g. "Restaurants: California vs Texas vs New York". */
  label: string;
  /** When it was last viewed (ms epoch), for recency + display. */
  at: number;
};

function isRecentCompare(v: unknown): v is RecentCompare {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.href === "string" &&
    typeof o.label === "string" &&
    typeof o.at === "number"
  );
}

function useRecentCompares(): { items: RecentCompare[]; hydrated: boolean } {
  const [items, setItems] = React.useState<RecentCompare[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    function read() {
      try {
        const raw = window.localStorage.getItem(RECENT_COMPARES_KEY);
        if (!raw) {
          setItems([]);
          return;
        }
        const parsed: unknown = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed.filter(isRecentCompare) : [];
        setItems([...list].sort((a, b) => b.at - a.at).slice(0, 6));
      } catch {
        setItems([]);
      }
    }
    read();
    setHydrated(true);
    function onStorage(e: StorageEvent) {
      if (e.key === RECENT_COMPARES_KEY || e.key === null) read();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { items, hydrated };
}

/* ------------------------------------------------------------------ */
/* Small shared pieces.                                                */
/* ------------------------------------------------------------------ */

function KindDot({ kind }: { kind: WatchKind }) {
  const tone =
    kind === "cell"
      ? "bg-atlas-500"
      : kind === "city"
        ? "bg-cocoa-500"
        : "bg-ink-900";
  return <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone)} />;
}

function kindWord(kind: WatchKind): string {
  return kind === "cell" ? "Business" : kind === "city" ? "Place" : "Activity";
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-cocoa-700">{children}</p>
  );
}

function relativeTime(at: number): string {
  const diff = Date.now() - at;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

function countryName(code: string | undefined): string | null {
  if (!code) return null;
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

/* ================================================================== */
/* The dashboard.                                                      */
/* ================================================================== */

export function YouDashboard() {
  const { items, count, hydrated: watchHydrated, remove, clear } = useWatchList();
  const { profile, hydrated: profileHydrated, isSet } = useProfile();
  const { items: recents, hydrated: recentsHydrated } = useRecentCompares();

  const compareHref = buildCompareHref(items);

  // Profile summary chips, only the set ones.
  const profileChips: { label: string; value: string }[] = [];
  if (profile.homeCountry) {
    profileChips.push({ label: "Based in", value: countryName(profile.homeCountry)! });
  }
  if (profile.draw) {
    profileChips.push({ label: "Premises", value: profile.draw === "owner" ? "Owner" : "Renting" });
  }
  if (profile.venue) {
    profileChips.push({ label: "Venue", value: prettyVenue(profile.venue) });
  }
  if (profile.budget != null) {
    profileChips.push({ label: "Budget", value: prettyBudget(profile.budget) });
  }
  if (profile.units) {
    profileChips.push({
      label: "Figures",
      value: profile.units === "home" ? "Your currency" : "Local currency",
    });
  }

  return (
    <div className="space-y-5">
      {/* Watch list */}
      <BeatCard eyebrow="Your shortlist" heading="What you are watching" feature>
        {!watchHydrated ? (
          <EmptyLine>Loading your shortlist.</EmptyLine>
        ) : count === 0 ? (
          <div className="space-y-3">
            <EmptyLine>
              Nothing watched yet. As you read a business, place, or activity,
              keep it here to come back to it and line a few up side by side.
            </EmptyLine>
            <a
              href="/countries"
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-full border border-parchment bg-white px-4 text-sm font-medium text-cocoa-700 transition-colors hover:bg-paper-100 hover:text-ink-900",
                RING,
              )}
            >
              Start exploring
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <ul className="divide-y divide-parchment rounded-lg border border-parchment">
              {items.map((it) => (
                <li key={`${it.kind}:${it.slug}`} className="flex items-start gap-3 px-4 py-3">
                  <a href={it.href} className={cn("group min-w-0 flex-1 rounded-md", RING)}>
                    <div className="flex items-center gap-2">
                      <KindDot kind={it.kind} />
                      <span className="truncate text-sm font-medium text-ink-900 group-hover:text-atlas-700">
                        {it.label}
                      </span>
                    </div>
                    <div className="mt-0.5 pl-3.5 text-xs text-cocoa-500">
                      {it.sub ? `${kindWord(it.kind)} · ${it.sub}` : kindWord(it.kind)}
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(it.kind, it.slug)}
                    aria-label={`Remove ${it.label} from your shortlist`}
                    className={cn(
                      "inline-flex min-h-[44px] items-center rounded-full px-3 text-xs font-medium text-cocoa-500 transition-colors hover:text-ink-900",
                      RING,
                    )}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              {compareHref ? (
                <a
                  href={compareHref}
                  className={cn(
                    "inline-flex min-h-[44px] items-center gap-2 rounded-full bg-atlas-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-atlas-700",
                    RING,
                  )}
                >
                  Compare these
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => clear()}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-3 text-sm font-medium text-cocoa-700 transition-colors hover:text-ink-900",
                  RING,
                )}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </BeatCard>

      {/* Standing context */}
      <BeatCard eyebrow="Your context" heading="The assumptions that follow you">
        {!profileHydrated ? (
          <EmptyLine>Loading your context.</EmptyLine>
        ) : !isSet ? (
          <EmptyLine>
            You have not set a context yet. Set where you are based, what you can
            put in, and whether you own or rent, and the figures across the Atlas
            will carry those assumptions for you. Look for the context chip at the
            top of any page.
          </EmptyLine>
        ) : (
          <dl className="flex flex-wrap gap-2">
            {profileChips.map((c) => (
              <div
                key={c.label}
                className="inline-flex items-baseline gap-1.5 rounded-full border border-parchment bg-paper-100 px-3 py-1.5"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-cocoa-500">
                  {c.label}
                </dt>
                <dd className="text-sm font-medium text-ink-900">{c.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </BeatCard>

      {/* Recent comparisons */}
      <BeatCard eyebrow="Recent" heading="Comparisons you looked at">
        {!recentsHydrated ? (
          <EmptyLine>Loading recent comparisons.</EmptyLine>
        ) : recents.length === 0 ? (
          <div className="space-y-3">
            <EmptyLine>
              No comparisons yet. Put the same business in a few places side by
              side and the matchups you look at will show up here.
            </EmptyLine>
            <a
              href="/compare"
              className={cn(
                "inline-flex min-h-[44px] items-center rounded-full border border-parchment bg-white px-4 text-sm font-medium text-cocoa-700 transition-colors hover:bg-paper-100 hover:text-ink-900",
                RING,
              )}
            >
              Open the comparison tool
            </a>
          </div>
        ) : (
          <ul className="divide-y divide-parchment rounded-lg border border-parchment">
            {recents.map((r) => (
              <li key={r.href} className="flex items-center justify-between gap-3 px-4 py-3">
                <a
                  href={r.href}
                  className={cn(
                    "min-w-0 flex-1 truncate text-sm font-medium text-ink-900 hover:text-atlas-700",
                    "rounded-md",
                    RING,
                  )}
                >
                  {r.label}
                </a>
                <span className="shrink-0 text-xs text-cocoa-500">{relativeTime(r.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </BeatCard>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Local label helpers (kept in step with ProfileChip's vocabulary).   */
/* ------------------------------------------------------------------ */

function prettyVenue(venue: string): string {
  const map: Record<string, string> = {
    "high-street": "High street",
    mall: "Shopping centre",
    suburban: "Suburban",
    "out-of-town": "Out of town",
    online: "Mostly online",
  };
  return map[venue] ?? venue;
}

function prettyBudget(budget: number): string {
  if (budget < 50000) return "Under 50k";
  if (budget < 150000) return "50k to 150k";
  if (budget < 350000) return "150k to 350k";
  if (budget < 750000) return "350k to 750k";
  return "Over 750k";
}
