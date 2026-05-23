# Plan v31 — master cleanup before deployment-readiness

**Status:** drafted 2026-05-24, awaiting approval
**Trigger:** founder walkthrough after the color shift to white +
vermillion. Long list of remaining problems. Goal: get Atlas to a
state where a curious operator landing on any page sees a coherent,
calm, credible reference site — not a dump.

## What this plan deliberately does NOT do

Out of scope for this round:
- Auth / Stripe / Pro tier (Plan v32+)
- Recraft / DALL-E illustration kit (deferred per founder)
- Visual regression CI (deferred)
- Per-country research-card markdown for the remaining 48 Tier A
  countries (separate cadence)

In scope: everything that makes the current visible site feel coherent
to a returning visitor.

## Lanes

### Lane A — Five Claude Design commissions (~$0 if user runs them)
Five prompts delivered in conversation. Each one produces one or two
React components the user pastes back as a zip. I integrate.

1. FeaturedCardV2 — homepage "Start with something familiar" cards
2. LondonRoadmap — stylistic SVG visual for the cities section
3. SectorCardV2 — "Browse by category" cards
4. CityHeroV2 — city metropolis page hero (Frankfurt example)
5. CoverageHubV2 + CountryScorecardV2 — coverage page redesign

Each prompt is self-contained. Run order doesn't matter; integration
order is: 1, 3, 4, 5, 2 (visual asset last because it's pure SVG).

### Lane B — Critical UX bugs (already shipped in 12a4857)
- Neighborhood overview page created (was 404, auto-redirected to
  restaurants)
- Hub + metropolis links updated to neighborhood overview
- Kosovo numeric IDs added to ISO mapping (412, 983, 999, -1 -> XK)
- "Top 100 cities placeholder" + CitiesDotsMap removed
- Bottom TopCitiesMosaic removed (was a city-name dump)
- Hero number shrunk from text-7xl to text-5xl
- Navigator/hero gap tightened
- Navigator form outline sharpened with border-2 + clearer shadow

### Lane C — Coverage page sanity (still owed)
The /coverage hub currently lists every country in COUNTRIES; many
of them have zero data. Founder critique: "a lot of countries that are
not existent in this whole interface... all quoted by zero in the
credibility score, something that's not normal."

Fix in two parts:
1. Backend filter: only render countries where `cellCount > 50` OR
   where `tier in (deep, good, starter)`. Drop zero-coverage.
2. Frontend (handled by Lane A prompt 5): tier the rest into Deep /
   Good / Starter / Modeled.

Quality checks:
- After deploy, walk /coverage and confirm no "0" appears.
- Confirm a country known to have no data (e.g., Tuvalu) is absent.
- Confirm Germany / France / US / Mexico render in the Deep tier.

### Lane D — City metropolis page redesign
Wire Lane A prompt 4 output (CityHeroV2) into
`src/app/cities/[slug]/page.tsx`. Replace the giant Unsplash hero +
"Estimated" banner with the dense version.

Quality checks:
- Walk /cities/frankfurt, /cities/charlotte, /cities/buenos-aires
- First frame at 1440x900 shows: city name, country, population,
  GDP, median wage, density, coverage chip, photo
- No "Estimated benchmark" banner unless coverage tier IS estimated
- Mobile: photo above, stats stack vertically, ≤ 100vh hero

### Lane E — Homepage section redesigns
Wire Lane A outputs 1, 2, 3 into homepage:
- FeaturedCardV2 replaces FeaturedCellTile in "Start with something
  familiar" section
- SectorCardV2 replaces existing sector tiles in "Browse by category"
- LondonRoadmap SVG replaces the slot where CitiesDotsMap was (the
  "Top 100 cities, drilled to the neighborhood" band)

The London-roadmap version of the cities section keeps the headline
("Top 100 cities, drilled to the neighborhood") but the visual
becomes the editorial London map per founder direction.

Quality checks:
- Walk the homepage at 1440, 768, 390 viewports
- Each section has visible hierarchy (eye lands somewhere clearly)
- No card height > 200px (density rule)
- All sections share the same palette discipline

### Lane F — Map polish
- Verify ZoomableGroup actually responds to scroll wheel (founder:
  "zoom in doesn't work, it's not existent"). May need to ensure
  the wrapping div doesn't have `overflow-hidden` blocking events.
- Confirm Kosovo renders as clickable post-deploy.
- Verify country borders are visibly pronounced (already done in
  7d7bd39 — graphite stroke 0.9 width).

Quality checks:
- Scroll wheel over the map zooms in/out smoothly
- Click-drag pans
- Kosovo highlights vermillion on hover and navigates to /xk on click

### Lane G — Logo swap (waiting on user)
The two logo assets the user mentioned were referenced but not
attached. When provided:
1. Save big logo to `public/logo.svg` (or .png)
2. Save small logo to `public/logo-small.svg`
3. Update `src/app/layout.tsx` header AND footer to use the new
   logo, replacing the four colored squares + wordmark.
4. Update favicon at `src/app/favicon.ico` from the small logo.
5. Update OG image at `src/app/og/cell/route.tsx` to use the new
   logo where the wordmark currently appears.

Quality checks:
- Header logo renders at correct size on desktop and mobile
- Logo color works on white background (white-on-white check)
- Favicon shows in browser tab
- OG card has the logo

### Lane H — Copy + density audit on the cell page first frame
Founder critique: "a lot of pages of the site, on their first frame,
they show very little."

The DenseCellHero already packs a lot of data, but it could be denser.
Pass with `impeccable` skill OR manual audit:
- Reduce vertical spacing between rows by 8-12px
- Surface the editorial blurb closer to the hero (currently below the
  smart waterfall)
- Sector tag + flag + geo row reads cleanly; verify on long names

### Lane I — Unsplash refresh (deferred)
Re-run `scripts/images/fetch_city_heroes.ts` to cache hero images for
the 20 new US cities + the 47 Tier 1 / Tier 2 cities that still don't
have a cached hero. Founder note: do this only after the day ticks
over so the Unsplash demo-tier rate limit resets.

## Sequencing recommendation

Session 1 (next): User runs the 5 design prompts in parallel Claude
sessions. Drop the zips. I integrate.

Session 2: Lane C coverage filter + Lane D city hero replacement +
Lane E homepage section swaps. Single big PR.

Session 3: Lane F map ZoomableGroup verification + Lane G logo swap
(if logos provided) + Lane H copy density pass.

Session 4: Lane I Unsplash refresh + final walkthrough + any
straggler bugs.

## Quality gates (per session)

Every commit must pass:
1. `npx tsc --noEmit` exit 0
2. `npm run prebuild` all 5 verifiers pass (taxonomy, em-dashes,
   source-agencies, dead-links, featured-tiles)
3. A walkthrough of 5 representative pages (homepage, /cities/{any},
   /us/california/restaurants, /coverage, a knowledge-base article)
4. Memory budget check: no script-level operation > 600MB RAM
5. Vercel deploy succeeds (watch for ENOENT rename, OOM SIGTERM,
   prebuild verifier failure)

## Acceptance criteria

Plan complete when:
- All 5 design commissions integrated and live
- Coverage page hides every country with zero data
- City metropolis pages render the dense V2 hero
- Map zoom verified working in production
- Kosovo clickable on the map AND its country page renders
- No section on the homepage exceeds 200px card height
- No hero number on any page is text-7xl or larger
- Founder confirms walkthrough feels "deployment-ready"

## Risks

- Founder may have more critique after Lane B+C+D+E land. That's
  expected. This plan is "what we know now."
- Design commissions may produce outputs needing manual fix-ups
  (em-dash strip, Phosphor type import, etc.) — pattern is known,
  cheap to fix.
- Vercel build memory: any new heavy components must be checked
  against the OOM-trim already in place. Don't pre-render new
  routes at build time.
