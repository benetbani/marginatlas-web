# City and Neighborhood Pages: Reform Design (2026-06-08)

Status: DESIGN, awaiting founder review. No implementation has started.

This document captures the decisions from the 2026-06-08 founder interview (the
thirty-question city-pages pass plus a neighborhoods deep-dive) and turns them into
a buildable plan. It is the source of truth for the city, neighborhood, and (where
relocated) country surfaces. Where it conflicts with older notes, this wins. It does
not change code; it pins what we will build and in what order.

Canon it sits under: `docs/strategy/REFORMATION-BIBLE.md` (spec), the
`docs/strategy/2026-06-06-VISION-AND-ROADMAP.md` 2026-06-07 update (clean data tool,
gated depth this year), and `docs/design-system/GUIDELINES.md` (tokens, layering).

---

## 1. Purpose and scope

Reform the city-facing surfaces so the city page becomes a flagship, city-true
decision surface (not a thin router), the neighborhood pages become a genuinely
deeper micro-market extension of it, and the country-level material currently
mislabeled on city pages moves to the country page where it belongs and is brought
onto the brand palette.

Three surfaces are touched:

1. The city page: `/cities/[slug]`.
2. The country page: `/[country]` (receives relocated blocks).
3. The neighborhood pages: `/cities/[slug]/neighborhoods` (hub) and the per
   neighborhood page at `/[country]/[city]/[neighborhood]`.

One page is removed: the city curiosities page `/cities/[slug]/curiosities`.

---

## 2. Settled stance for these surfaces

- The city page is one of the most important pages on the site, a flagship
  destination in its own right. It also orients and routes down into the cell pages,
  but it is not "just a lobby."
- Voice on the city page is an austere data tool: numbers lead, prose is minimal.
  Warmth lives in the visual atmosphere (the light masthead photo on flagship
  cities), not in the words.
- Editorial atmosphere is light and flagship-only: the duotone masthead photo stays
  on Tier 1 cities and self-omits elsewhere. No magazine layer.
- Every graphic across the site wears the brand palette. Color may encode good and
  bad, but only through brand tokens (no off-palette hex, no stock emerald or amber).
  One unified color grammar.
- The no-visibly-wrong-numbers bar holds everywhere: real, or modeled and labeled,
  or dashed, or the surface self-omits. New, hard-to-source figures are curated for
  flagship cities first and modeled for the long tail with a clear estimate label.
- City and neighborhood pages stay fully free for now. The gated-premium-depth layer
  lives on the cell pages, not here.

---

## 3. Surface 1: the city page

### 3.1 Role and section order

The chosen order (decision-first), top to bottom:

1. Masthead and score.
2. Data board (four sections).
3. Signature panel (slimmed).
4. Neighborhoods teaser.
5. Activity ranking (best and hardest).
6. Peer comparison ("cities like this").

The headline verdict the page orbits is "easiest to break in" (the same read the
cell pages use), so the language is consistent across the atlas.

The numbered list above is the authoritative top-to-bottom page order. Subsections
3.2 to 3.10 below are grouped by topic for readability, not in page order.

### 3.2 Masthead and score

- Keep the hero 0-100 city score on the masthead. Cities are the only entity that
  carries a single headline score, by founder choice.
- The score is shown as the number plus its band word only. No component breakdown,
  no "led by X" line. It rests on modeled inputs, flagged by the existing quiet per
  section footnote, not a loud disclaimer.
- Keep the light duotone city photo behind the masthead on flagship (Tier 1) cities;
  it self-omits to plain white elsewhere.

### 3.3 Data board

- Keep the four-section fixed scaffold (Demand depth, Location and rent, Market
  structure, Survival baseline) so it reads identically to the cell and country
  boards.
- Visually de-emphasize the rows we can never fill at city altitude, so a city page
  does not read as broken. The scaffold stays; the empty rows recede.
- Remove the "Informality = X% self-employed" row from the city board. It is a
  country figure and moves to the country page.
- Competition density (the chosen next dataset) lands here as one quiet board row
  (Saturation / Business density), not as a prominent section.

### 3.4 Activity ranking (the big content add)

- Extend the "best and hardest" owner-take-home ranking, currently London-only, to
  every city, sourced from the existing cell engine. Numbers are modeled and
  labeled; nothing is invented from nothing. A city with no resolvable activity data
  still self-omits cleanly.
- Open item (resolve in the city sub-spec): whether to rank this table by the
  break-in rating (to match the "easiest to break in" verdict) or keep the existing
  owner-take-home sort. Lean: break-in, for consistency with the headline verdict,
  with take-home shown as a secondary figure per row.

### 3.5 Signature panel (slimmed to city-true blocks)

- Keep the People block (percent foreign-born, percent foreign-owned SMBs).
- Expand the signature sectors block (the three sectors that characterize the metro),
  each linking to its cell. This is the most city-true, on-brand content; lean into
  it across more cities over time.
- Remove the "where commerce happens" commercial-streets block from the city page.
  Commercial streets move down to the neighborhood level, where street rent and the
  new average-spend metric actually belong.
- The culture spectrum and the government scores leave the city page entirely (see
  Surface 2).

### 3.6 Neighborhoods teaser

- The main city page shows a tight teaser (a small top set of neighborhoods), and
  links to the `/neighborhoods` hub. The rich detail lives on the neighborhood
  surface, not duplicated here.

### 3.7 Peer comparison (rebuilt sister cities)

- Replace the current sister-cities ribbon (hardcoded to restaurants) with a genuine
  "cities like this" peer read, comparing the city to its peers by score, size, and
  cost tier. Useful routing to comparable metros.

### 3.8 Cuts and relocations on the city page

- Cut: the decision-wizard CTA (the hardcoded Restaurants / Pharmacies card).
- Cut: the ten-industry mosaic.
- Cut: the curiosities page and its preview block (the preview also mis-promised
  content the page never delivered).
- Relocate to the country page: the culture spectrum, the government scores, the
  business-formation costs, and the informality figure.
- Keep: the quiet coverage / methodology link.

### 3.9 Thin cities

- A thin Tier 2 or Tier 3 city still renders (coverage is the moat), but shows an
  explicit "thin coverage" state so it reads as honest rather than broken.

### 3.10 Visualization

- One branded signature visualization is allowed where it genuinely earns its place
  (for example a demand / rent / room / survival shape), rendered in the site
  palette. Placement and exact form to be decided in the city sub-spec.

---

## 4. Surface 2: the country page relocation

The city page sheds its country-level blocks; they move to `/[country]` and are
brought up to brand standard.

### 4.1 What moves

- The culture spectrum (six dimensions).
- The government-from-a-business-desk scores (six dimensions).
- The business-formation costs by legal tier.
- The informality (self-employment) figure (already a country read).

### 4.2 Rebrand and symbolic language

- Keep the culture-spectrum concept (a position on a left-to-right scale), but
  rebrand the colors to the site palette: the left pole in the brand terracotta /
  brick token, the right pole in a dark-gray brand token. No off-palette hex.
- Government score bars are likewise rebranded onto brand tokens (no stock emerald or
  amber). Color may still signify better and worse, but only through brand tokens.
- Define proper design tokens for these uses rather than inlining values, so the
  tokens-only rule and the hardcoded-hex gate are satisfied.

### 4.3 Layout fix (explicit founder direction)

- The culture column and the government column must be visually consistent. Today the
  culture column uses larger type and more padding while the government column uses
  smaller type and tighter bottom padding, and the bars do not line up across the two
  columns.
- The bars in both columns must share the same height and thickness and sit
  horizontal to each other across the two columns. Harmonize the type sizes and the
  padding. The government column may occupy a bit less width, but element height and
  thickness must match, respecting each section's own labels.

---

## 5. Surface 3: the neighborhood pages

The neighborhood surface is a deep, non-repetitive extension of the city, not a
restatement of it. Hierarchy: city, then neighborhood, then neighborhood-by-industry
cell.

### 5.1 Structure

- One rich page per neighborhood. The `/neighborhoods` hub becomes a clean index into
  those pages.
- Nothing on the neighborhood page repeats what the city page already shows. The
  neighborhood page is a full micro-market profile of the area.

### 5.2 Per-neighborhood section spine

1. Headline: neighborhood name, character chip, price tier, and the revenue
   multiplier versus the city as the area's headline signal. There is no separate
   neighborhood score; the multiplier is the signal. Plus a short character line.
2. Demand drivers: a small share bar of the commuter / tourist / resident / student
   mix, plus a one-line "this area runs on X" read that explains the multiplier.
3. District dynamics: the time-of-day and time-of-week rhythm (day versus night,
   weekday versus weekend), for example an office district that empties on weekends.
4. Local rent and prime commercial streets: a street card per prime street, carrying
   the street name, what it is known for, its rent level versus the city, and the
   average consumer spend per visit on that street.
5. Per-activity revenue multiplier: an activity picker so a user sees the multiplier
   for their business in this neighborhood, with the commuter / tourism / tag
   breakdown behind it.
6. Local winners and routing: the localized best-and-worst activity ranking (the city
   ranking adjusted by the neighborhood multiplier) on top, with the full
   neighborhood-by-industry routing grid beneath it.
7. Light texture: a short character paragraph, walkability, and price tier as
   orienting texture. The fuller flavor (food scene, do-not-miss) is dropped to keep
   the austere register.
8. Sibling neighborhoods for routing.

### 5.3 Definitions

- "Average spend on major streets" means the typical consumer spend per visit at
  businesses on the main commercial streets: a demand-strength signal for opening
  there.
- "District-level dynamics" means the time-of-day and time-of-week rhythm of the
  area.

### 5.4 Coverage and data basis

- Expand neighborhood-scheme coverage beyond the current set (about 23 cities). No
  map; text and number cards only, in keeping with the restraint.
- The new street, spend, and dynamics figures are hard to source. Ground them by
  curating flagship cities first (the way the signature data was built) and modeling
  the long tail with a clear estimate label. Dash where we cannot defend a number.

---

## 6. New data dependencies

- Competition density (firms per capita / saturation): the chosen next dataset.
  Surfaces as one quiet city-board row and informs the "room" term. Sequenced as its
  own data project.
- Neighborhood street feed: prime streets per neighborhood, street rent versus city,
  average consumer spend per visit, and the demand-driver mix and rhythm. Curated for
  flagship cities, modeled for the tail, always labeled.
- Per-activity neighborhood multiplier: the existing multiplier framework extended to
  an activity picker (already partially present for restaurants).

---

## 7. Decomposition into sub-projects and sequence

This is too large for one change and must ship strictly sequentially. Proposed order,
cheapest-and-highest-leverage first, data-dependent work later:

1. City-page restructure (mostly no new data): the cuts (decision CTA, mosaic,
   curiosities), the decision-first reorder, the board muting and thin-coverage
   state, the activity ranking extended to all cities, the slimmed signature panel,
   and the rebuilt peer comparison. Highest leverage, shippable soonest.
2. Country-page relocation and signature redesign: move culture, government,
   formation costs, and informality onto the country page; rebrand to the palette;
   fix the two-column layout. Depends on Sub-project 1 having removed them from the
   city page.
3. Neighborhood micro-market pages: per-neighborhood pages with the full spine, the
   activity-multiplier picker, the localized winners plus routing grid, and the light
   texture. Depends on the neighborhood data feed (Sub-project 4) for the new rows,
   though the layout and the multiplier picker can land first against existing data.
4. New datasets: competition density (city-board row) and the neighborhood street /
   spend / dynamics / rent feed (curated flagships plus modeled tail). The data
   foundation the above lean on; can run in parallel as data work but renders only
   when its consuming surface ships.

Each sub-project gets its own focused spec and implementation plan, and ships fully
(Vercel-verified, screenshot, fast-forwarded to main, confirmed live) before the next
begins.

---

## 8. Constraints honored

- No visibly-wrong numbers: real, modeled-and-labeled, dashed, or self-omitted.
- RAM budget: no local heavy builds; Vercel is the typecheck and gate.
- Strictly sequential ship discipline; one sub-project at a time.
- Tokens only, no raw hex; the spectrum and score bars get real brand tokens.
- No em-dashes, no source-agency names, no slug renames on user-visible surfaces.
- Austere city voice; light flagship-only atmosphere; one unified brand color grammar.

---

## 9. Open items to resolve in the sub-specs

- City activity ranking sort: by break-in rating (to match the verdict) or by
  owner take-home. Lean break-in, take-home secondary.
- The exact form and placement of the one allowed city signature visualization.
- The neighborhoods teaser size on the city page (how many neighborhoods, what each
  card shows) without duplicating the neighborhood page.
- The data model and source plan for the neighborhood street feed (which fields are
  curated, which modeled, and the plausibility bounds).
- Whether the localized neighborhood winners ranking reuses the city activity engine
  times the multiplier, or a dedicated neighborhood path.

---

## 10. Decision log (interview, 2026-06-08)

City page: reader is a discovery-and-routing flagship that hands off to cells but is
itself one of the most important pages; relationship to the cell page is lobby-plus
(it orients, the cell decides); editorial is light and flagship-only; order is
decision-first.

Structure and cuts: move country-level blocks to the country page; weakest blocks
flagged were the decision CTA, the sister-cities ribbon, and the curiosities preview;
the decision CTA is cut; the ten-industry mosaic is cut.

Data board and score: keep the scaffold but mute blanks; keep the hero score on the
masthead; show the score as number plus band only; informality moves to the country
page; quiet modeled footnote is enough.

Activities and competition: extend the activity ranking to all cities; competition
density is one quiet board row; the headline verdict is "easiest to break in"; thin
cities render with an explicit thin-coverage state.

Signature panel: keep People; expand sectors; cut commercial streets (they move to
the neighborhood level); the culture spectrum stays as a concept but rebrands to the
brand palette and moves to the country page; government scores move to the country
page; the panel colors must be brand tokens, and the two columns must be aligned with
matching bar height and thickness and harmonized type and padding.

Curiosities, viz, voice, money: cut the curiosities page; richer visualization is
allowed where it earns its place; the city voice is an austere data tool; city and
neighborhood pages stay free for now.

Neighborhoods: a full micro-market profile; one rich page per neighborhood with the
hub as an index; unique data is local rent and prime streets, average spend per visit
on major streets, district-level dynamics, local demand drivers, and the per-activity
revenue multiplier; light texture (character line, walkability, price tier), economics
led; expand coverage, no map; data is curated flagships plus a modeled tail; demand
drivers shown as a driver-mix bar plus a one-line read; district dynamics is the
time-of-day and time-of-week rhythm; the prime-streets card carries street, what it
sells, rent versus city, and spend per visit; the neighborhood industry list is the
localized winners on top with the full routing grid below.
