# Fable pipeline state

phase: P1 (+ a 2026-06-13 polish round folding forward P1-05/06/07 assets)

round 2026-06-13 (founder preview review, one big batch, one preview at end). DONE:
  - Display face = FRAUNCES (founder-delegated; Literata fallback). Live site-wide.
  - IA: one plain score scale (band_labels.ts: Easy/Doable/Hard/Very hard; Excellent/Good/
    Fair/Hard); insider peer labels removed; commercial streets MERGED into the neighborhood
    model (showStreets gate + streets fold onto neighborhood cards).
  - Assets deployed: industry_pictogram crosswalk -> pictograms on /industries + city/hood
    trade rows; AtlasIcon on board section headers; AtlasSpot (12 spots ported + retoned)
    on the audience band + the what-kills-weak-operators beat; NeighborhoodCover (honest
    gradient + street-grid placeholder image) on city cards + hood hero; survey-grid motif
    on the /countries header.
  - Polish: BarList rank-gradient on the across-states bars; city sections onto seated cards;
    /countries redesigned (header stats + continent cards); DimensionSwitcher gains a working
    Type (sub-niche) select + warm restyle (the SubIndustryPicker stub retired).
  - Plan: ~/.claude/plans/linked-seeking-goblet.md. Review: _pipeline/2026-06-13-polish-round-review.md.
  - Local gates green (em-dash, hex, layering, agencies, typography, section-order) + tsc clean;
    one Vercel preview at end. Production still held.
  - STILL OPEN: masthead motifs (deprioritized), full P2 contracts/Sonnet, long-tail pictogram
    crosswalk widening.

mode: autonomous run 2026-06-12 (founder away; explicit permission to overhaul page-type
  visual outlines completely; direction: more SaaS product surface, less newspaper; warm
  Atlas palette unchanged; everything lands on the branch + previews, production untouched
  until founder try)

direction-amendment (founder, 2026-06-12, verbal):
  The site should read as a modern SaaS product surface, not a static newspaper.
  Editorial bones stay; surface language modernizes: warm app ground, white cards with
  soft layered shadows, generous radii, sans UI + serif reserved for headlines/numbers,
  strong visual hierarchy, elements instantly understood. Reference set:
  docs/brand/assets/incoming/2026-06-12-saas-refresh/ (set-8; atlas-saas.css +
  atlas-system.css as SPEC, retoned to live tokens, never imported).
  Constitution amendments executed in the open per design-system.md section 17.

queue:
  - id: P1-06
    title: Chart grammar consolidation (dataviz+charts -> src/components/charts/)
    status: pending
  - id: P1-07
    title: Spot illustrations staged (retoned)
    status: pending
  - id: P1-08
    title: Catalog stories for the new surface system + showcase on /_design
    status: pending
  - id: P2-KIT
    title: Atlas Page Kit primitives (RangeStrip, HonestTakeBox, AnswerFirstMasthead, ...)
    status: pending
  - id: CITY-PASS
    title: City page bespoke sections onto the card shell (board already inherited)
    status: pending

note: P1-04 (motif SVG recolor) was folded into P1-02 (the public/ SVGs were conformed
  in the sweep). The page-overhaul item is done at the surface-language level; deeper
  template recomposition (content-map reading order, HonestTakeBox, sub-type switcher)
  belongs to P2 with the kit.

done:
  - P1-01 de9315ec Token reconciliation + SaaS surface layer. cream-75 #fbfaf7 app
    ground token; elevation retoned to warm ink layered profile (subtle/card/lift/modal) and
    exposed as Tailwind shadow-subtle/card/lift/modal; .atlas-card radius 6px -> var(--radius)
    16px (reverses 2026-05-26 "not SaaS" call per founder 2026-06-12); body off .atlas-paper
    onto the app ground; atlas-pattern dark bg conformed to ink-800; design-system.md amended
    (Article 4, cream table, section 7) in the open. Verified on dev preview: ground
    #fbfaf7, cards white 16px layered shadows. Evidence: evidence/p1/.
  - P1-02 8b941759 Repo-wide stale-palette sweep. Every functional banned hex in src/ +
    public/ conformed to live tokens: delta ladders (decide, neighborhood-cell,
    guiding_word) -> colors.delta/moss; v2 cards off cool dialect-B; LondonRoadmap retoned
    per section 8.2; map palettes warmed (WorldMapPicker, CitiesWorldMap, CitiesDotsMap);
    charts onto color jobs (profit kept = moss; softening = amber); blog/home gradients
    token-anchored (navy pair -> teal); OG route, welcome email, motif SVGs conformed.
    Remaining grep hits are comments only.
  - P1-03 4b6f2499 Font showcase live at /dev/font-showcase. Newsreader (incumbent) vs
    Fraunces / Literata / Besley / Source Serif 4 on one identical business-page mock:
    masthead question, split-number anchor + italic suffix, section head, pull quote,
    numeral batteries, 20px floor. FOUNDER DECISION OPEN: pick the face; swap is one
    --font-display slot change.
  - FOUNDATION-BUG 2cf5f8a6 US wrong-industry bug FIXED. New
    src/lib/cells/us_industry_match.ts validates rows against the requested industry
    (name+keywords, specificity tiers: specific naics rows beat sector aggregates; TRUE
    parent_id inheritance allowed, proxy fallback map excluded). Matched industry stamped
    onto the cell (kills the naics-3 rename); variants restricted to the canonical
    industry; "Showing X" banner now compares request vs cell, slug-normalized. Dry-run
    evidence in scripts/audit/dryrun_us_industry_fix.ts: CA legal -> "Legal Services"
    $520K (was 541 aggregate labeled software), dental -> "Offices of Dentists", pharmacy
    -> honest modeled cell, sit-down -> "Full-Service Restaurants". CROSS-TRADE WORK
    UNGATED.
  - FLAGSHIP 1a9d26d2 Business/cell page onto SaaS surface. DataSection = seated white
    card with serif heading; StatGrid values to display weight; BoardHero H1 to 3xl/4xl;
    tail sections conformed (AcrossStatesStrip, FailureCards, related-cells, read-more).
    Board shared -> country + city boards inherit. Desktop + 375px verified.
  - HOMEPAGE 14c22784 home-* tones "white" -> "paper": warm ground runs the page, modules
    carry separation as cards (navigator, tiles, neighborhood cards, comparison, blog).
  - COUNTRY+INDUSTRY c6788fe7 bespoke lower sections onto the card shell on both pages;
    serif section anchors unified.
  - P1-05 a801bf01 ma- glyph families ported: 40 icons + 64 pictograms as typed
    manifests + AtlasIcon/AtlasPictogram primitives (currentColor ink, vermillion
    accent via .ma-glyph token-bound rules, aria contract). Catalog section on
    /_design; ungated preview /dev/brand-glyphs. NOTE: the /_design ADMIN_KEY gate
    404s on local dev (pre-existing, affects untouched sibling pages too); verify
    the catalog on a deployed preview.

decisions:
  - 2026-06-12 founder: SaaS-not-newspaper surface direction; page-type overhauls fully
    authorized; founder away for hours, review pack on return.
  - 2026-06-12 founder: Mobbin subscription postponed (trigger: mobile/interaction
    research need).

notes:
  - First run creates this file. Previous chat's handoff: docs/handoff/2026-06-12-session-handoff.md.
  - Deploy: vercel deploy --yes --cwd "E:/atlas/website" (remote build runs all gates).
    No local build/prebuild/tsc without founder permission.
  - Ship = founder-gated. Nothing pushed to main this run.
  - SP3 search cascade + HP-v2 Pass A are parked on the branch; homepage overhaul should
    fold their learnings, not duplicate them.
