# City-Data Fill Pipeline, Runbook

This is the operational spec for the recurring pipeline that fills each city page's
real, city-specific data. It is BOTH the human reference and the exact task a single
scheduled run (every 30 minutes) executes. One run fills ONE city as fully as the
evidence allows, stages the result for review, and stops. Nothing this pipeline
produces reaches the live site unattended.

## Prime directive (inherits the product's #1 bar)

No visibly-wrong numbers, ever. Every value is one of:
- REAL: found in a credible source and cited.
- MODELED: a careful extrapolation from real signals, labeled "estimated".
- OMITTED: left absent (the page already self-omits or dashes), when neither holds.

Never fabricate. A thin city stays thin rather than carry an invented figure. When
two sources disagree beyond a tolerance, take the more credible, widen the band, and
drop the confidence grade; if they cannot be reconciled, omit the field.

## Safety model: stage, never auto-publish

Each run writes a STAGING file under `data/cities/_staged/<slug>.json` and commits it
to the review branch `pipeline/city-data-staging`. It NEVER edits the live JSON
(`data/cities/city_signature_v1.json`, `city_list_v1.json`, etc.). A human reviews
the staged file and promotes it (see Review and promote). This honors the founder's
"always show before a data change" rule: the loop proposes, a human disposes.

## One run, step by step

1. Regenerate the backlog: `npx tsx scripts/pipeline/audit_city_coverage.ts`
   (writes `data/cities/_pipeline/coverage.json`).
2. Read the pipeline state `data/cities/_pipeline/state.json` (tracked in git).
   It records, per city: `pending | staged | promoted | skipped` and the last run.
3. Pick the next city: the first backlog entry whose state is `pending` (backlog is
   already ordered flagship-tier first, then thinnest first). If none, exit cleanly.
4. Gather what we already hold for that city (its `city_list` record, its existing
   `city_signature` override, its country baseline, its neighborhood scheme).
5. For EACH missing fill target (from the city's `missing` list), run the research in
   the "Targets" section below: search, cross-check, validate, grade confidence,
   attach sources. Fill what is defensible; mark the rest `skipped` with a reason.
6. Write the staging file (schema below). Update `state.json`: set the city to
   `staged`, stamp the run.
7. Commit the staging file + state to `pipeline/city-data-staging`. Do not touch the
   live data files. Do not deploy.

## Research method (deep-research discipline, per field)

Use multiple independent sources. Prefer official statistics offices, city economic
development bodies, reputable encyclopedias and primary reporting; avoid SEO content
farms and anything uncited. Cross-check at least two sources for any headline number.
Convert everything to the units the schema expects (USD, percent). Record every URL
used. For a derived/extrapolated value, record the inputs and the reasoning in
`notes`, and grade it `estimated`. Do not name a source agency in any field that ends
up rendered as user-facing copy (the live gate forbids it); sources live in the
staging metadata only, for the reviewer.

## Targets

### board_economics  (-> data/cities/city_list_v1.json record)
Fields: `avg_gross_salary_usd_year`, `cost_of_living_index` (a leading metro indexes
near 100), `tourist_arrivals_m` (annual, millions). Plausibility:
`avg_gross_salary_usd_year` in [2000, 250000]; `cost_of_living_index` in [15, 200];
`tourist_arrivals_m` in [0, 120]. Only fill a field that is currently absent.

### demographics  (-> city_signature_v1.json override: foreign_born_pct, foreign_owned_pct)
The city's OWN share of foreign-born residents and of small businesses with a foreign
owner. Plausibility: `foreign_born_pct` in [0, 70]; `foreign_owned_pct` in [0, 60].
These must be CITY-specific; if only a national figure exists, mark `estimated` and
note it (the country baseline already provides a generic fallback, so a weak national
number is not worth staging over it).

### sectors  (-> city_signature_v1.json override: signature_sectors[3])
The three economic sectors that actually characterize THIS city (not its country).
Each: `{ label, industry_slug, blurb }`. `industry_slug` MUST resolve in the taxonomy
(`src/lib/taxonomy.ts` INDUSTRIES); if a sector has no taxonomy match, pick the nearest
covered industry or drop that sector. `blurb` is one or two plain sentences, no
em-dashes, no source-agency names, warm-but-spare. Validate: exactly 3, distinct,
each slug resolves.

### nbhd_economics  (-> data/economics/neighborhood_economics_v1.json, a LIVE target)
LIVE as of 2026-06-08 (no longer held): promote merges the staged `neighborhoods`
map into `data/economics/neighborhood_economics_v1.json` under `.neighborhoods`, keyed
`${citySlug}.${neighborhoodSlug}`. The neighborhood page (NeighborhoodOverview) reads
it via `getNeighborhoodEconomics` and renders the prime-streets section. For each
neighborhood in the city's scheme, research/extrapolate the micro-market profile
designed 2026-06-08: prime commercial streets (`name`, `sells`), the street's rent
level vs the city (`rent_vs_city`, a multiplier near 1.0), the average consumer spend
per visit (`spend_per_visit_usd`), and (for the legacy row form) the demand-driver mix
(commuter / tourist / resident / student shares summing to 100) and time-of-day/week
rhythm. Stage the map form the promote step merges: `values.neighborhoods` =
`{ "<city>.<nbhd>": { "prime_streets": [{ "name", "sells", "rent_vs_city"?,
"spend_per_visit_usd"? }], "notes"? } }`. `rent_vs_city` and `spend_per_visit_usd` are
optional and self-omit on the page when absent. Most of this is hard to source
directly: fill streets from real local knowledge where findable, and EXTRAPOLATE
spend/rent from the city's cost index and the neighborhood character, always graded
`estimated`. Omit a neighborhood's economics rather than guess wildly. (This target
lands last per city because it is the most extrapolation-heavy; a city can be promoted
on the other three first.)

## Staging file schema  (data/cities/_staged/<slug>.json)

```
{
  "slug": "barcelona",
  "name": "Barcelona",
  "iso2": "ES",
  "schema": "1",
  "targets": {
    "demographics": {
      "status": "filled" | "skipped",
      "confidence": "high" | "medium" | "estimated",
      "values": { "foreign_born_pct": 21, "foreign_owned_pct": 9 },
      "sources": ["<url>", "<url>"],
      "notes": "..."
    },
    "sectors": {
      "status": "filled",
      "confidence": "high",
      "values": { "signature_sectors": [
        { "label": "...", "industry_slug": "...", "blurb": "..." }, ... x3
      ] },
      "sources": ["<url>"],
      "notes": "..."
    },
    "board_economics": { "status": "...", "values": { ... }, "sources": [...], "notes": "..." },
    "nbhd_economics":   { "status": "...", "values": { ... }, "sources": [...], "notes": "..." }
  }
}
```
`researched_at` is stamped by the runner at write time (not hardcoded).

## Validation gate

Before writing, every staged value passes `npx tsx scripts/pipeline/validate_staged.ts
<slug>`: bounds per field (above), taxonomy resolution for every `sectors` slug, the
no-em-dash / no-source-agency check on every rendered string (`blurb`s and street
`sells`), the driver-mix-sums-to-100 check (legacy row form), and the prime-streets
shape (each street: `name` and `sells` non-empty, optional `spend_per_visit_usd` in
[1, 5000], optional `rent_vs_city` in [0.2, 5]). A failing field is downgraded to
`skipped`, not shipped.

## Review and promote (human-gated)

- List staged cities + a readable diff vs live: `npx tsx scripts/pipeline/review_staged.ts`.
- Promote one reviewed city into the live JSON: `npx tsx scripts/pipeline/promote_staged.ts
  <slug>`. This merges only `status: filled` targets, re-runs the validation gate, writes
  the live files, sets state to `promoted`, and leaves the change unstaged for the normal
  ship loop (the founder commits + ships it like any other data change).
- A reviewer may reject a field; promote skips `skipped`/rejected targets.

## The schedule

A durable agent runs `this runbook for the next pending city` every 30 minutes until
the backlog is empty. It needs only the repo and web access (no database: every fill
target is curated JSON, not cell data). It commits staged files to
`pipeline/city-data-staging` for review; it never deploys and never writes live data.
