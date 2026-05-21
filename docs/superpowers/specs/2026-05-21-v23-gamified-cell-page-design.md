# Plan v23 — Gamified cell page, typography overhaul, grammar fix

> Brainstormed 2026-05-21 with the brainstorming + ui-styling + copywriting
> skills. Founder approved the design verbatim.

## Goal

Transform benchmark pages from a dashboard-of-numbers into a story-first
editorial flow that guides the eye, reveals data progressively, and reads
as inviting to non-numerical visitors. Sitewide: fix grammar bugs where
city/region names render as ISO codes or misspellings. Polish typography
to match the editorial-broadsheet direction (Plan v18 Phase 4).

## Architecture

Four sub-projects, each self-contained:

1. **Grammar fix.** Override `cell.geo_name` whenever a friendly-slug
   alias is used, so the rendered name always matches the URL.
   Build a sitewide audit (`scripts/audit/geo_name_audit.ts`) that
   reports mismatches between expected and rendered city names. Manual
   override table for cases the source data is genuinely wrong.
2. **Cell page restructure.** Replace the current 6-column / 3-column
   tile dashboard with a top-down editorial flow. One headline number
   in the hero. Narrative paragraph below. Distribution visual instead
   of percentile tiles. Collapsed net-profit waterfall. Inline comparison
   chart. Time-series sparkline. Each section asks a question; numbers
   appear in context, not gridded.
3. **Typography pass.** Bump display-serif sizes one tier. Add drop caps
   on narrative paragraphs. Bigger body text with looser line-height.
   Thin parchment dividers between sections. Number callouts in italic
   serif with atlas-700 underline.
4. **Copy revisions.** Every section header becomes a question. No
   jargon, no "Typical yearly revenue" or "Modeled tail" labels.
   Customer voice throughout. Specific over generic.

## Tech stack

- Next.js 15 App Router + React 19 RC + TypeScript strict
- Tailwind 3.4 with the existing warm-earth palette
- Cormorant Garamond display serif (already loaded via `next/font`)
- No new dependencies

## Components

### 1. Grammar fix

- `src/lib/cities/city_aliases_generated.ts` — extends each city entry
  with the canonical display name (already curated)
- `src/lib/cells.ts` — when `regionalSlugToGeoId` resolves via friendly
  alias, also stash the friendly display name; cell normalization picks
  it up and overrides `cell.geo_name`
- `scripts/audit/geo_name_audit.ts` — new audit crawler
- `data/audit/geo_name_REPORT.md` — output
- `data/audit/city_name_overrides_v1.json` — manual override layer

### 2. Cell page restructure

- `src/app/[country]/[geo]/[industry]/page.tsx` — rebuild the section
  order. Replace `<section id="revenue-tiles">` (3 tile grid) with
  a single hero number block. Replace `<NetProfitWaterfall>` rendering
  with `<NetProfitSummary>` (collapsed) + `<NetProfitDetail>` (expand).
- `src/components/HeroBenchmark.tsx` — NEW. Renders the question
  format ("How much does a {industry} make in {city}?") + ONE giant
  display-serif number underneath.
- `src/components/NarrativeIntro.tsx` — NEW. Single paragraph in
  body-serif with drop cap, embedding the headline numbers inline.
- `src/components/DistributionVisual.tsx` — NEW. Replaces the
  3-tile percentile grid with a single horizontal histogram showing
  Bottom 10% / Typical / Top 10% bands. Hover/tap reveals exact $.
- `src/components/NetProfitSummary.tsx` — NEW. Collapsed view:
  "Owner take-home: $89K" + "see the breakdown" expander.
- `src/components/ComparisonInline.tsx` — NEW. Small horizontal
  chart comparing this cell to country median + 2 same-industry cells
  in other cities/states.
- `src/components/TimeSeriesSentence.tsx` — NEW. Replaces the
  standalone TimeSeriesChart card. Embeds a sentence + inline sparkline.

### 3. Typography

- `tailwind.config.ts` — no changes needed; existing tokens cover
- `src/app/globals.css` — add `.drop-cap` utility for narrative
  paragraphs, plus a `.number-callout` utility for inline number
  emphasis
- All headline-using components — bump one tier in display-serif size

### 4. Copy revisions

Inline edits across the cell page and reusable components. No new
file structure needed.

## Data flow

No data layer changes. The cell page already fetches all the data it
needs via `getCellBySlug` + `getCellVariants` + the existing parallel
fetches. The visual + typography work is purely the rendering layer.

The grammar fix DOES touch the data layer minimally — when the friendly
slug resolves, we stash an override. But it's a small change in
`regionalSlugToGeoId` to also return the friendly display name as a
side channel, picked up by `normalizeRegionalRow`.

## Error handling

- If the new components fail to render (e.g. cell data has unexpected
  shape), the section is suppressed, the rest of the page renders
- Distribution visual gracefully degrades if any percentile is null —
  renders only the bands we have data for
- Net-profit summary collapses to "Estimate not available" when the
  underlying calculation can't produce a positive figure (already
  shipped in Plan v16 Block A6)

## Testing

- `npx tsc --noEmit` passes
- `npm run prebuild` (taxonomy + em-dash + agency-leak + dead-link guards) passes
- `scripts/audit/probe_urls.ts` against production: all cell pages return 200
- Spot-check `/es/barcelona/restaurants`: hero reads "Barcelona", not "ES"
- Spot-check `/jp/tokyo/restaurants`: hero reads "Tokyo", not "Tokoto"
- Visual review on a sample of 10 cell pages: editorial-broadsheet feel,
  no tile-dashboard residue

## Out of scope

- A/B testing infrastructure
- Custom font commission
- Hero illustrations / images (deferred to image manifest expansion)
- Motion design / animations
- Mobile-specific layouts beyond what the responsive Tailwind tier provides

## Founder-approved scope choices

- Direction A (editorial story flow) over Direction B (comparison
  scrubber) for the cell page restructure.
- Typography bump for cell + state pages; homepage already has the
  bigger eyebrow from Plan v19 Block E.
- Grammar fix lives in code, not just data hand-editing.

## Sign-off

Design complete. Next step: writing-plans for the implementation plan
breaking each sub-project into bite-sized commits.
