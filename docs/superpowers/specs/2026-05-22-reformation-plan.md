# Reformation plan — from directory to exploration guide

> Founder feedback 2026-05-22: "the site is very bombarded with things
> like city, country, city, country, region, city, and so it's...
> repetitive and very boring very fast." Goal: turn each cell page
> from a tabular benchmark into a place worth visiting. Tourism /
> exploration aesthetic. Not a database, a guidebook.

## Strategic frame

Three vibes we steal from to escape the directory feeling:

1. **Travel guides (Lonely Planet, Atlas Obscura)** — narrative
   anchored to place, sense of personality per city, photos that
   convey atmosphere, hand-picked highlights, the writer has been
   there. Numbers exist but as part of a story.
2. **The Economist / FT data pages** — dense numbers presented with
   editorial framing, comparison context, "what this means" callouts,
   sparklines instead of giant tables.
3. **Wikipedia city pages** — comprehensive but browsable; sidebar
   facts, sections you can dip into, no overwhelm. Plus actual
   structured citations.

Bad reference points to avoid: Statista (cold), Yellow Pages
(directory feel), Glassdoor city pages (form fields and ads), Niche.com
(comparison-pressure feel).

## What "exploration vibes" actually means in pixels

- **Photography over diagrams.** Every cell page has one strong
  photograph at the top, color-tinted to match Atlas palette.
- **Place-first headlines.** Lead with location, not industry. "Lyon
  bakeries" not "Bakery industry: Lyon, FR".
- **Curated highlights.** A sentence of local context ("Lyon's
  bakery scene is famous for the pain de Lyon and the early-morning
  bouchon culture"). Editorial, not generated.
- **Sister recommendations.** "If you liked Lyon's bakeries, look at
  Bologna's pasta makers."
- **Wandering navigation.** "Other neighborhoods of Lyon" surfaces
  alternatives by feel, not just A-Z list.
- **Sparklines over tables.** Trend at a glance.
- **One number, then context.** Show the typical revenue prominently,
  let everything else fold underneath.

## The 20 enrichment ideas (ranked by impact × effort)

Each idea has: the change, the why, effort, dependency.

### Highest leverage (do first)

**1. Place-first hero with photograph (1 image per Tier 1+2 city)**
- Change: top of every cell page shows a wide hero image of the city,
  tinted with `mix-blend-mode: multiply` + Atlas amber overlay.
- Why: instant atmosphere shift. The number becomes secondary; the
  place comes alive.
- Effort: 1 day (component + image sourcing for ~70 cities).
- Depends on: visual asset strategy (see end of doc).

**2. Editorial city blurb (1-2 paragraphs per Tier 1+2 city)**
- Change: between hero and benchmark, a short paragraph hand-written
  for each city × top industry. "Lyon's bakeries serve a city where
  breakfast is sacred and the morning queue is part of the ritual.
  Typical shops earn..."
- Why: differentiates pages, gives Google something to index that
  isn't templated text.
- Effort: 1-2 hours per (city, top industry). ~30 cities × 5
  industries = 150 blurbs. AI-drafted then human-edited.
- Depends on: nothing.

**3. Trend sparkline beside the typical revenue**
- Change: tiny inline SVG sparkline showing 5-year trend (synthesized
  if not measured), with a one-word direction label ("steady",
  "rising", "softening").
- Why: turns a static number into a moving picture. Even synthesized
  trends communicate something.
- Effort: 4 hours (component + synthesis function).
- Depends on: nothing (synthesis from current point + industry-typical
  growth rate).

**4. Comparable-cities ribbon (algorithmic)**
- Change: under the main benchmark, "Similar to:" with 3 cards. Cities
  with comparable population × wealth × industry score.
- Why: turns each page into a hub that sends you to 3 others.
- Effort: 1 day.
- Depends on: city_list_v1.json (already exists).

**5. Local cost-of-living context box**
- Change: a small sidebar showing rent for a 50 sqm commercial space,
  median wage for the industry, minimum wage in that country, VAT %.
  Sourced from our country_smb_baseline.json.
- Why: anchors abstract revenue numbers in concrete local cost.
- Effort: 4 hours.
- Depends on: nothing.

### High leverage

**6. Sister-industry recommendations**
- Change: at bottom of cell page, "Industries that thrive next door:"
  with cards. Bakeries → cafes, breakfast spots, jewelers (high-street
  neighbors).
- Why: encourages browsing across industry instead of bouncing.
- Effort: 6 hours (handcrafted adjacency table for top 30 industries).
- Depends on: nothing.

**7. Cultural color block (food / language / customs)**
- Change: one card per cell page with the local quirks. "In Lyon
  bakeries you'll see 'fougasse' more than 'baguette'. Most close
  Sunday afternoon."
- Why: turns the page into a mini cultural guide.
- Effort: 2 days. Templatized by country with city overrides.
- Depends on: nothing.

**8. Time-of-day / season heat map**
- Change: small 7×4 grid showing which hours/days the industry is
  busiest. Synthesized from industry archetypes (restaurants =
  lunch + dinner spikes, bakeries = morning).
- Why: visual storytelling. Distinct per industry.
- Effort: 1 day.
- Depends on: nothing.

**9. "Why here?" two-sentence essay per cell**
- Change: a small editorial card explaining WHY this industry exists
  at this scale in this place. "Lyon's bakery density comes from
  Roman-era flour trade routes and a 19th-century guild that
  enforced quality standards still felt today."
- Why: turns Wikipedia-style fact into Margin Atlas voice.
- Effort: 1-2 hours per (city, industry). ~150 hours for full
  Tier 1+2 coverage. AI-drafted + edited.
- Depends on: nothing.

**10. Three-mode page header: View | Compare | Learn**
- Change: tabs at the top of every cell page.
  - View: the current numbers + visuals (default)
  - Compare: drop-down to compare with another city/industry
  - Learn: the editorial story, cultural blurb, why-here essay
- Why: lets data-people skim, lets explorers browse.
- Effort: 1 day.
- Depends on: ideas 2, 7, 9 (Learn tab content).

### Medium leverage

**11. Neighborhood character chips (richer, more visual)**
- Change: replace the current text-only character chip ("central-
  business") with a small illustrated icon + colored backdrop
  (financial = navy, residential = warm tan, industrial = slate).
- Why: makes the neighborhood page feel more place-specific.
- Effort: 6 hours.
- Depends on: nothing.

**12. Mini map (no maps SDK, just inline SVG with one dot)**
- Change: tiny static map showing where in the country / city the
  region is. SVG, no JavaScript map library.
- Why: spatial anchoring without the 200 KB Mapbox payload.
- Effort: 1 day. Country outlines from natural-earth, dot positioned
  by lat/lon.
- Depends on: lat/lon data per city (Wikipedia API or hardcode for
  top 70).

**13. "How much would I make?" inline calculator**
- Change: small interactive next to the typical revenue: drag a
  slider for hours worked / square meters / employees, watch the
  estimated revenue track.
- Why: makes the page interactive. People play.
- Effort: 1 day.
- Depends on: nothing.

**14. Local entrepreneur quote (or stylized testimonial frame)**
- Change: a card with a stylized quote: "Running a Lyon bakery is..."
  attributed to "Pierre, 14 years in the trade." Synthesized for
  flavor; clearly framed as illustrative if not from a real interview.
- Why: human voice in a sea of numbers.
- Effort: 1-2 days. Need to be careful with synthesized quotes
  (label them as illustrative).
- Depends on: voice + tone guidelines.

**15. Industry "starter pack" calculator**
- Change: bottom of the page: "If you wanted to start this business
  in this city tomorrow: estimated rent $X / mo, equipment $Y one-
  time, licensing $Z, expected 1st-year revenue ~$W."
- Why: turns the benchmark into an actionable plan.
- Effort: 1 day. Uses country_smb_baseline + industry margin data.
- Depends on: nothing.

**16. Photo gallery (3-5 images per city + industry combo)**
- Change: small grid of 3-5 images at the bottom: cityscape, industry
  shop fronts, local color. Lazy-loaded.
- Why: visual variety, breaks up text.
- Effort: 1 day (per Tier 1 city, 30 cities).
- Depends on: visual asset strategy.

### Lower leverage but worth scheduling

**17. Weekly editorial — "City of the week"**
- Change: a small homepage strip + a /blog post each week featuring
  one city in depth: photo, 4-paragraph essay, top 5 industries
  with quirks.
- Why: gives returning visitors a reason to come back. RSS-able.
- Effort: 4 hours per week (ongoing).
- Depends on: editorial commitment.

**18. Locally-typed industry names**
- Change: alongside "Restaurants" show "Trattoria" (Italy),
  "Brasserie" (France), "Izakaya" (Japan), "Ramen-ya" (Tokyo). Picks
  what feels local.
- Why: small touch but immediately signals "this place knows the
  place".
- Effort: 6 hours for the top 30 industries × top 30 countries lookup
  table.
- Depends on: nothing.

**19. "Atlas Stories" — long-form articles**
- Change: separate /stories section with 5-15 minute reads about
  global industry patterns ("Why Italy has 300x more pizzaiolas per
  capita than the US", "The 5 cities where jewelry is its own
  economy"). Each story links into multiple cell pages.
- Why: SEO content rich enough to outrank Statista, plus deepens the
  brand.
- Effort: 2-4 hours per story. Aim for 1 / week.
- Depends on: editorial.

**20. Personalization-lite ("for visitors interested in...")**
- Change: cookies remember which industries the user has clicked, and
  the homepage rearranges to surface them first. No login needed.
- Why: returning visitors feel known.
- Effort: 1 day.
- Depends on: cookie + small per-user state store.

## Visual treatment changes (cross-cutting)

These aren't ideas, they're styling shifts that should apply across
all the ideas above:

- **Wider type hierarchy.** Hero question h1 stays large, but body
  text gets a small editorial bump (16px → 17px) and a serif accent
  for pull quotes.
- **More vertical rhythm.** Use 80px of breathing room between major
  sections, not 24px. Pages should feel airy, not packed.
- **Color per page mood.** Default Atlas cream / amber stays, but
  introduce subtle regional accent colors per continent (warm gold
  for South Asia, deep ocean blue for the Pacific, etc.).
- **Photo treatment.** Every hero image gets the same duotone treatment
  (Atlas amber + ink navy). This is the strongest visual signature
  short of bespoke illustration.
- **Pull quotes.** When showing a piece of editorial text > 100 chars,
  set the first sentence in italic display serif.

## Multi-phase rollout

### Phase R1 — Foundation (1 week)
- Photography pipeline (idea 1, set up)
- Editorial blurb template + first 30 cities (idea 2)
- Sparkline component (idea 3)
- Comparable-cities ribbon (idea 4)
- Local cost-of-living box (idea 5)

After R1: most cell pages have a photo, a paragraph of local color,
and a way to wander.

### Phase R2 — Personality (1-2 weeks)
- Sister-industry recommendations (idea 6)
- Cultural color block (idea 7)
- "Why here?" essays for top 50 cells (idea 9)
- Three-mode tabs (idea 10)
- Locally-typed industry names (idea 18)

After R2: pages have voice. Each city feels different from the next.

### Phase R3 — Interactivity (1 week)
- Inline calculator (idea 13)
- Starter-pack calculator (idea 15)
- Personalization-lite (idea 20)

After R3: returning visitors have something to do, not just read.

### Phase R4 — Scale (ongoing)
- Photo galleries (idea 16) — rolling, 5 cities per week
- Weekly editorial (idea 17) — ongoing
- Atlas Stories (idea 19) — ongoing
- Time-of-day heat maps (idea 8) — when bandwidth available

## Quality checks per phase

For each phase, before declaring done:

1. **Visual review** — 10 random cell pages across continents. Does
   it FEEL like a guidebook, not a database?
2. **A11y check** — every new component passes contrast / keyboard /
   screen-reader basic.
3. **Performance check** — Lighthouse mobile LCP stays under 2.5s.
4. **Content check** — no obvious AI-tells in editorial copy. Sample
   10 city blurbs and read out loud. Do they sound like a person
   wrote them?
5. **Cross-link check** — every cell page has ≥ 5 outgoing internal
   links to neighboring cells (city → city, industry → industry, or
   country → country).
6. **Mobile check** — every new component renders correctly at 375px
   width and 768px width.
7. **SEO check** — pages don't lose meta tags, structured data still
   validates, sitemap still includes them.

## What's deliberately NOT in this plan

- **Real human reviews / Yelp-style ratings** — we're not a review
  site, and faking reviews would erode trust.
- **Job board** — different product.
- **Pricing comparison** — different product.
- **Forum** — moderation cost.
- **AI chat** — already have /ask, not expanding it here.
- **Heavy 3D visualizations** — slow on mobile.

## Out of scope (a future plan)

- Multi-language UI
- User accounts / saved comparisons (B-011 still parked)
- Real journalist commissions (Atlas Stories starts AI-drafted)
- Native mobile apps

## Anti-patterns to avoid (specific to this site)

- Adding more numbers next to the existing numbers. The page is
  already number-dense. The fix is fewer-but-stronger, not more.
- Adding decorative icons everywhere. Icons should signal sector
  + character at most. Resist the urge to add little decorations.
- Stock-photo cliches. The hero image for a Mumbai cell page should
  not be a generic curry photo. Find a real Mumbai cityscape.
- Long-form scrolling without anchors. Long pages need a sticky TOC
  or anchor menu (we have CellPageNav already, keep using it).
- Reverting to "data dashboard" defaults — Material UI tables,
  rechart bar charts, Apex pie charts. We have an editorial voice;
  use it.

## Brand checklist for every new component

Before merging any of the 20 ideas:

- [ ] Uses Atlas cream-50 / amber accent palette (not Material blue,
  not Tailwind sky)
- [ ] Headings use the Cormorant Garamond display font (display class)
- [ ] Body uses Inter / system sans
- [ ] No em-dashes in user-visible copy (lint enforces)
- [ ] No source-agency names visible (lint enforces)
- [ ] Negative space > number density
- [ ] Mobile-first markup (responsive utilities, no fixed widths)
- [ ] Image (if any) is duotone-treated to brand
- [ ] Internal link minimum 1 per component (no dead-end widgets)
- [ ] Accessibility: alt text on images, ARIA labels on icons, focus
  ring visible
