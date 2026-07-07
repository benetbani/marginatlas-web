/**
 * Neighborhood HUB , SPINE body (SpineHoodBody), split out of the dev route so the
 * live route src/app/cities/[slug]/neighborhoods/page.tsx can render it with REAL data
 * (buildSpineHoodSeed) behind the flag, while the dev route renders the illustrative
 * seed. Next forbids arbitrary named exports + custom props on a route file, hence this
 * split (thin page.tsx route imports this named body). The body self-wraps in
 * SpineShell (do not double-wrap it at the route).
 *
 * The page that proves the whole product's thesis: same trade, same city, very
 * different outcomes , revenue is the liar, what the owner keeps is the truth. Built
 * to the masterplan publish bar: answer-first two-figure masthead, one dominant keep
 * figure per chapter, a REAL orientation map, a divergence keep-strip on the city
 * baseline, progressive disclosure in the panel (the free/Pro seam), a full-width myth
 * chapter, and a Pro-gated compare with an auto-derived verdict. All prose lives in the
 * seed; every sourceless field is null-guarded so it renders nothing on the real page.
 *
 * As-built chart dictionary (page-level idiom census, cap 2 per family):
 *   big figure: masthead keep hero x1 (the ONE hero-scale figure) + panel keep x1.
 *   divergence bar-list (deviation from 100): KeepStrip x1  , the page hero chart.
 *   real tile map (position): SpineMap x1  , keep-encoded pins (size = keep index,
 *     terracotta = keeps more than the city, ink = keeps less), legended on the map.
 *   marker-on-a-shared-scale: footfall two-marker x1 (omitted on real data) +
 *     walkability Meter x1; price tier renders as a DISCRETE 4-step band.
 *   multiplicative waterfall (running product): "Why the number moves" x1.
 *   rank slope (2-point): myth chapter x1  , revenue rank -> keep rank.
 *   editorial table with drawn in-cell scales: Compare x1 (city-100 / 0% ticks).
 * Terracotta = the answer only; selection + CTAs are neutral ink.
 */
import * as React from "react";
import { spineHoodSeed } from "@/lib/spine-seeds";
import { Movement, Box, Ico } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { SpineShell } from "@/components/spine/shell";
import { NeighborhoodExplorer, NeighborhoodCompare, MythChapter } from "@/components/spine/NeighborhoodExplorer";
import { HoodMasthead } from "./masthead";
import { AtlasMark } from "@/components/spine/marks";

// A London street motif for the hood atmosphere (opacity-only 0.32, set in SpineShell).
const HOOD_BG = "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1920&q=60";

// The illustrative-route provenance line (dev seed fallback). The real adapter supplies
// its own honest meta.provenance_line, which then replaces this on the promoted page.
const DEV_PROVENANCE =
  "Keep index is derived from revenue and rent load against a city baseline of 100. District revenue positions come from modeled commuter, visitor and character multipliers. Figures are illustrative until wired to live neighborhood data.";

// The closing band's canonical-trade links , each maps onto a modeled cell route.
const TRADE_LINKS: Array<{ icon: AtlasIconId; name: string; href: string }> = [
  { icon: "trade-cafe", name: "Cafes and coffee", href: "/gb/london/cafes-coffee" },
  { icon: "trade-restaurant", name: "Restaurants", href: "/gb/london/restaurants" },
  { icon: "trade-bar", name: "Bars and nightclubs", href: "/gb/london/bars-nightclubs" },
  { icon: "trade-grocery", name: "Grocery stores", href: "/gb/london/grocery-stores" },
];

export function SpineHoodBody({ data = spineHoodSeed }: { data?: any }) {
  const d = data;
  const districts: any[] = d.districts ?? [];
  // the loudest (highest-revenue) district , the myth's counter-subject.
  const loudest = districts.slice().sort((a: any, b: any) => b.rev_vs_city_pct - a.rev_vs_city_pct)[0];

  return (
    <SpineShell bg={HOOD_BG} bgPosition="center 40%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* MASTHEAD , answer-first two-figure honest headline (keeps-the-most vs the loud one). */}
        <HoodMasthead d={d} />

        {/* the single, quiet provenance line for the whole page (stated once, under the
            hero). The real adapter supplies an honest modeled-coverage line; the dev
            seed falls back to the illustrative note. */}
        <p className="-mt-2 mb-2 flex items-start gap-1.5 text-[11px] leading-snug text-[var(--c-muted)]">
          <AtlasMark id="modeled" size={13} className="mt-px shrink-0" />
          <span>{d.meta?.provenance_line ?? DEV_PROVENANCE}</span>
        </p>

        {/* 01 , THE MOVEMENT: where the money actually stays. Keep strip + real map + panel. */}
        <Movement index="01" icon="best-areas" eyebrow="Where the money stays" heading="What the owner keeps, ranked" />
        <NeighborhoodExplorer
          districts={districts}
          defaultSlug={d.meta?.default_slug}
          rail={d.meta?.rail}
          mapNote={d.meta?.map_note}
        />

        {/* 02 , THE MYTH: promoted to its own full-width chapter, the honesty moat at real size. */}
        <Movement index="02" icon="myth-reality" eyebrow="The belief to bust" heading="The revenue myth" />
        {d.meta?.myth && loudest ? <MythChapter myth={d.meta.myth} loudest={loudest} districts={districts} /> : null}

        {/* 03 , COMPARE (Pro): hold two or three side by side, with an auto-derived verdict. */}
        <Movement index="03" icon="compare" eyebrow="Compare districts" heading="Two or three, line for line" />
        <NeighborhoodCompare districts={districts} compare={d.meta?.compare} />

        {/* CLOSING , the funnel onward: canonical trades this atlas models in London,
            links only, no figures. One small band, then the page ends. */}
        <Box className="mt-8">
          <div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--c-muted)]">Open a trade in London</div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {TRADE_LINKS.map((t) => (
              <li key={t.href}>
                <a href={t.href} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--c-border)] bg-[var(--c-soft)] px-3 py-2 transition hover:border-[var(--c-line-strong)] hover:bg-[var(--c-soft2)]">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Ico id={t.icon} />
                    <span className="truncate text-[13px] font-semibold text-[var(--c-ink)]">{t.name}</span>
                  </span>
                  <span aria-hidden className="shrink-0 text-[var(--c-muted)]">&#8594;</span>
                </a>
              </li>
            ))}
          </ul>
        </Box>
      </main>
    </SpineShell>
  );
}
