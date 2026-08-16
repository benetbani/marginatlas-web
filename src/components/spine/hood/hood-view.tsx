/**
 * Neighborhood HUB , SPINE body (SpineHoodBody), split out of the dev route so the
 * live route src/app/cities/[slug]/neighborhoods/page.tsx can render it with REAL data
 * (buildSpineHoodSeed) behind the flag, while the dev route renders the illustrative
 * seed. Next forbids arbitrary named exports + custom props on a route file, hence this
 * split (thin page.tsx route imports this named body). The body self-wraps in
 * SpineShell (do not double-wrap it at the route).
 *
 * The page that proves the whole product's thesis: same trade, same city, very
 * different outcomes , revenue is the loud number, rent is the knowable one. Every
 * ranked surface runs on RENT LOAD, the seed input an owner can verify (rulebook v1
 * §5, founder 2026-07-11: the derived per-district keep index never renders). Built
 * to the masterplan publish bar: answer-first two-figure masthead, one dominant rent
 * figure per chapter, a REAL orientation map, a divergence rent-strip on the city
 * x1.00 line, progressive disclosure in the panel (the free/Pro seam, unveiled on
 * review builds per §45), and a full-width myth chapter. All prose lives in the
 * seed; every sourceless field is null-guarded so it renders nothing on the real page.
 *
 * As-built chart dictionary (page-level idiom census; bar budget per rulebook v1
 * §25: the rent strip is the ONLY fill-bar graphic):
 *   big figure: masthead rent hero x1 (the ONE hero-scale figure) + panel rent x1.
 *   divergence bar-list (deviation from x1.00): RentStrip x1  , the page hero chart.
 *   real tile map (position): SpineMap x1  , rent-encoded pins (size = how light the
 *     rent runs, terracotta = lighter than the city, ink = heavier), legended.
 *   marker-on-a-shared-scale (neutral, no fill): footfall two-marker x1 (omitted on
 *     real data) + a single walkability marker; price tier is a DISCRETE 4-step band.
 *   multiplier readout (running product, printed figures): "Why the number moves" x1.
 *   rank slope: myth chapter x1  , revenue rank -> rent rank, the myth struck on it.
 *   editorial table, plain figures, color-marked row-best: Compare x1 (no in-cell bars).
 * Terracotta = the answer only; selection + CTAs are neutral ink.
 */
import * as React from "react";
import { spineHoodSeed } from "@/lib/spine-seeds";
import { Movement, Box, Ico, Rail } from "@/components/spine/kit";
import type { AtlasIconId } from "@/components/brand/icons";
import { SpineShell } from "@/components/spine/shell";
import { NeighborhoodExplorer, NeighborhoodCompare, MythChapter } from "@/components/spine/NeighborhoodExplorer";
import { HoodMasthead } from "./masthead";
import { AtlasMark } from "@/components/spine/marks";

// A London street motif for the hood atmosphere (opacity-only 0.32, set in SpineShell).

// The illustrative-route provenance line (dev seed fallback). The real adapter supplies
// its own honest meta.provenance_line, which then replaces this on the promoted page.
const DEV_PROVENANCE =
  "District rent multiples are illustrative, modeled against the city baseline pending live neighborhood data.";

// The closing band's canonical-trade slugs , each maps onto a modeled cell route. The
// slate is site-wide (fixed slugs); the CITY half of the href is never known here, so it
// is resolved per-page below from d.meta, never baked in as a constant.
const CANONICAL_TRADES: Array<{ icon: AtlasIconId; name: string; slug: string }> = [
  // "cafes-coffee" is an ALIAS; the canonical slug is below. The route resolves
  // either, but a cell page builds its canonical tag from the segment it was
  // handed, so linking the alias creates a second URL for one cell, each
  // claiming to be the original.
  { icon: "trade-cafe", name: "Cafes and coffee", slug: "cafes-coffee-shops" },
  { icon: "trade-restaurant", name: "Restaurants", slug: "restaurants" },
  { icon: "trade-bar", name: "Bars and nightclubs", slug: "bars-nightclubs" },
  { icon: "trade-grocery", name: "Grocery stores", slug: "grocery-stores" },
];

export function SpineHoodBody({ data = spineHoodSeed }: { data?: any }) {
  const d = data;
  const districts: any[] = d.districts ?? [];
  // the loudest (highest-revenue) district , the myth's counter-subject.
  const loudest = districts.slice().sort((a: any, b: any) => b.rev_vs_city_pct - a.rev_vs_city_pct)[0];

  // The closing trade band's per-city hrefs (S13 universality): both the dev seed and
  // every real adapter (buildSpineHoodSeed) carry iso2 + slug + city on meta, so this
  // resolves for any promoted city, never just London. With either missing there is no
  // honest href to build, so the whole band omits below rather than fall back to London.
  const cityIso2: string | undefined = d.meta?.iso2 ? String(d.meta.iso2).toLowerCase() : undefined;
  const citySlug: string | undefined = d.meta?.slug;
  const cityName: string | undefined = d.meta?.city;
  const tradeLinks = cityIso2 && citySlug
    ? CANONICAL_TRADES.map((t) => ({ ...t, href: `/${cityIso2}/${citySlug}/${t.slug}` }))
    : [];

  return (
    <SpineShell>
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* MASTHEAD , answer-first two-figure honest headline (lightest rent vs heaviest). */}
        <HoodMasthead d={d} />

        {/* the single, quiet provenance line for the whole page (stated once, under the
            hero). The real adapter supplies an honest modeled-coverage line; the dev
            seed falls back to the illustrative note. */}
        <p className="-mt-2 mb-2 flex items-start gap-1.5 text-[11px] leading-snug text-[var(--c-muted)]">
          <AtlasMark id="modeled" size={13} className="mt-px shrink-0" />
          <span>{d.meta?.provenance_line ?? DEV_PROVENANCE}</span>
        </p>

        {/* 01 , THE MOVEMENT: what rent takes, district by district. Rent strip + real
            map + panel. Title pending the founder's one-word confirmation (rulebook v1
            §13: plain, no metric jargon leading a title). */}
        <Movement index="01" icon="best-areas" heading="What rent takes, district by district" />
        <NeighborhoodExplorer
          districts={districts}
          /* The city this page is about, so the "what works here" trade links
             land here rather than in London. cityIso2 and citySlug are the
             same pair the trade band below already resolves from d.meta. */
          placePrefix={cityIso2 && citySlug ? `/${cityIso2}/${citySlug}` : null}
          defaultSlug={d.meta?.default_slug}
          rail={d.meta?.rail}
          mapNote={d.meta?.map_note}
        />

        {/* 02 , THE MYTH: promoted to its own full-width chapter, the honesty moat at real size. */}
        <Movement index="02" icon="myth-reality" heading="The revenue myth" />
        {d.meta?.myth && loudest ? <MythChapter myth={d.meta.myth} loudest={loudest} districts={districts} /> : null}

        {/* 03 , COMPARE (Pro): hold two or three side by side, with an auto-derived verdict. */}
        <Movement index="03" icon="compare" heading="Compare districts" />
        <NeighborhoodCompare districts={districts} compare={d.meta?.compare} />

        {/* CLOSING , the funnel onward: canonical trades this atlas models, links only, no
            figures. Omits entirely (never a London fallback) when the city's iso2 + slug
            are not both known, so an unpromoted or malformed meta never mislinks. */}
        {tradeLinks.length > 0 && cityName ? (
          <Box className="mt-8">
            <Rail icon="high-street" kicker={`Open a trade in ${cityName}`} />
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {tradeLinks.map((t) => (
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
        ) : null}
      </main>
    </SpineShell>
  );
}
