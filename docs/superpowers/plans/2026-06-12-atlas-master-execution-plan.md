# Atlas Master Execution Plan (2026-06-12)

> The campaign to make marginatlas.com the world leader in local profit intelligence and a friendly human brand. Built from 120 founder decisions across three quiz rounds, captured in `docs/superpowers/specs/2026-06-11-page-content-map.md` (the 3-layer blueprint: content / brand+experience / design+aliveness+originality).

**North star:** every visitor leaves a page feeling "I finally understand this, and I can trust it." Every page carries at least one thing nobody else has, or it is not done.

---

## 0. How to read this plan
This is the ROADMAP altitude: phases, sub-projects, tasks, dependencies. Each sub-project gets its own detailed task-by-task plan (with full code) when it is executed, the way the homepage passes were done. Nothing ships without a Vercel preview, a common-sense pass, and a screenshot. High-stakes surfaces (the live primary CTA, anything that reworks core data) get a founder try before production.

## 1. Operating rules (non-negotiable, apply to every task)
1. **Common-sense check on every element.** Does this number / comparison actually make sense? No absolute rankings mixing business type and geography. No badmouthing industries. Consulting + PE are clients, never subjects.
2. **Like-for-like only.** Comparisons hold one axis constant (same business across comparable places, or several businesses within one place). Reuse the distinctness guard already built for the homepage.
3. **No fabrication.** Real data, or an honest LABELED placeholder. Architecture-first: COUNTRY / INDUSTRY / CITY new sections may use `N/A` / lorem placeholders during the skeleton phase and be filled later. BUSINESS/CELL, NEIGHBORHOOD, LEARN, COMPARE get real data now. Never a fake real-looking number.
4. **Voice:** a sharp friend with the numbers. Talk to "you." Honest opinions, backed by data. Dry, occasional wit. No metaphors. Operator language, never consultant-speak. One plain term everywhere: "what the owner keeps."
5. **Tokens only**, no raw hex/px. No em-dashes in user-facing source. No source-agency names. No slug renames. Preview-verified; no local builds.

## 2. The shape: 8 sequential phases + 3 parallel tracks
- **Phase 0** Foundations (the blocker fix + the shared component kit + the voice/naming pass)
- **Phase 1** The flagship BUSINESS page (the template every other page inherits)
- **Phase 2** City pages (real data)
- **Phase 3** Country + Industry pages (architecture-first, skeleton + placeholders)
- **Phase 4** Neighborhood + Learn + Compare pages (real data)
- **Phase 5** New page types (sub-niche, venue, special-zone, theme; scenario later)
- **Phase 6** The interactive layer (calculator, save/track, compare-anywhere, watch)
- **Phase 7** Homepage (finish + fold in the patterns)
- **Track A** (parallel) Raw-perspectives pipeline (task #36)
- **Track B** (parallel) Visual assets (from the 5 design-tool prompts)
- **Track C** (parallel) Monetization activation (already built dormant; founder flips flags)

---

## PHASE 0 - FOUNDATIONS (unblock + build the vocabulary)

### 0.1 Fix the US wrong-industry bug (THE blocker)
Live cell pages silently show a different industry's data on the US path (`/us/california/legal-services` renders "Software development"). Root cause: the US branch of `getCellBySlugRaw` in `src/lib/cells.ts` (resolveToMeasuredIndustry + a NAICS-3 prefix `.or()` + a fuzzy `industry_description` fallback) falls back to an unrelated measured row and prints it under the requested industry's URL/name with no banner.
- Tasks: write a failing test reproducing legal->software, dental->software, hairdressers->employment, pharmacy->grocery; reshape the fallback so it NEVER shows industry B's data under industry A's name without an explicit, honest substitution banner ("we don't measure legal-services in California yet; here is the closest measured category"), or returns the correctly-named extrapolated cell for the requested industry, or notFound; verify a wide sweep of US fine-grained slugs; dry-run + show the founder before/after on a preview; ship.
- **Gates:** the cross-trade comparisons, the search cascade (SP3), the learn deep-links. Do this first.

### 0.2 The Atlas Page Kit (the shared component vocabulary)
Build the reusable, tokens-only primitives every page composes from. Each accepts nullable inputs and self-omits; each is plain-voiced; each works with sample data until real data/pipeline arrive. This is the single highest-leverage sub-project: build the vocabulary once, compose everywhere.
- `AnswerFirstMasthead` (bottom-line sentence + the key number + the sub-type switcher mount).
- `HonestTakeBox` (THE through-line element; sits right after the headline numbers).
- `RangeStrip` (the 7-gradation spread/distribution, not just low/typ/high).
- `MoneyGoesBreakdown` (plain "for every $100 of revenue: $X food, $Y staff ..."; replaces the technical waterfall).
- `SubTypeSwitcher` (client island; niche switch + venue switch; reframes the page; placed at the title).
- `StickySectionNav` (quiet jump links on long pages).
- `FreshnessStamp` ("checked June 2026").
- `FlagIt` ("see something off?").
- `GutCheck` (the 3-question "should you?").
- `PlainTerms` (tangible-units translation; business pages).
- `RightForWrongFor`, `LocalEdge` ("what locals know"), `ContrarianInsight`, `MythVsReality`.
- `OperatorVoices` (curated, sourced quote block; fed by Track A, degrades gracefully).
- `CountUpNumber` (subtle hero count-up), `ScrollReveal` (gentle fade wrapper), `CaptiveVenueNote`, `FreeZoneNote`.
- Catalog every one in `src/app/_design/` (the design story page) before use. Preview-verify the catalog.

### 0.3 Voice + naming pass
- One plain term site-wide: "what the owner keeps" (codemod the variants).
- Operator-language sweep (kill consultant-speak; plain business names; real units).
- A light plain glossary hub (`/glossary` or a hover layer) for the few unavoidable terms.
- One consistent authority line; the freshness + "how we know -> methodology page" pattern.

---

## PHASE 1 - THE FLAGSHIP BUSINESS PAGE (the template)
Compose the kit + REAL data into the full business/cell page, to masterpiece standard. This page becomes the reference every other page inherits. Order (content map + design layer):
1. `AnswerFirstMasthead`: "A Lisbon cafe keeps about EUR 22k a year." + the key number + the `SubTypeSwitcher` (curated niches for a few flagship categories: restaurants -> pizzeria/kebab/sushi/fine-dining; venue switch where it matters).
2. `HonestTakeBox` (the straight read).
3. The story (narrative) in plain words.
4. The revenue picture + `RangeStrip` (7 gradations).
5. `PlainTerms` ("about 320 coffees a day").
6. `MoneyGoesBreakdown` (per-$100).
7. What the owner keeps (gated).
8. Break-even (survival line).
9. Wages by role.
10. Startup cost (itemized).
11. Seasonality (where real).
12. `GutCheck`.
13. Your realistic first year.
14. Same business a short drive away (like-for-like).
15. `LocalEdge` + `CaptiveVenueNote`/`FreeZoneNote` where they apply + `ContrarianInsight` + `MythVsReality`.
16. `OperatorVoices` (sample until Track A lands).
17. `RightForWrongFor` + a light next-step + a notebook link + the freshness stamp + `FlagIt`.
- Build behind a flag if needed; preview; iterate hard to masterpiece; founder try; ship. This is the one page worth over-investing in.

---

## PHASE 2 - CITY PAGES (real data)
Apply the kit. Keep the Business Climate Score (cities stay the only scored entity). Add the new real-data sections from the content map: who the local customer is (spending power); what shop/office space costs (commercial rent, real-data-gated); tourist vs local money (always on); best areas to set up (which neighbourhood for which business); how the city is changing (smaller, real-trend-gated). Reorder to answer-first; sticky nav; honest-take after the board.

## PHASE 3 - COUNTRY + INDUSTRY PAGES (architecture-first)
Build the SKELETON of the new sections with labeled placeholders where data is missing; fill later.
- Country new sections: compare-to-neighbours (like-for-like); how-hard-to-hire (+ min-wage sub); how-long-to-get-going (steps/days sub). Apply the kit + voice.
- Industry new sections: what-a-typical-one-looks-like; where-this-business-earns-most (ranked, like-for-like only).
- These three page types are explicitly placeholder-friendly per the build rule; do NOT hand-fill data now.

## PHASE 4 - NEIGHBORHOOD + LEARN + COMPARE (real data)
- Neighborhood: what-thrives-here-and-why; who-lives-and-shops-here; how-pricey-to-operate; compare-to-adjacent. All from the real flavor data (`neighborhood_flavor_v1.json`).
- Learn: a worked example / sample P&L; other-businesses-worth-a-look (related). Fix the broken article->cell deep-links (after 0.1).
- Compare: where-each-one-wins (balanced, no badmouthing).

## PHASE 5 - NEW PAGE TYPES (the originality surfaces)
Each reuses the kit; each carries at least one unique thing.
- Sub-niche pages (pizzerias across places) - also strong SEO.
- Venue-type pages (airport businesses, mall businesses).
- Special-zone pages (Dubai free zones), where significant.
- Theme pages (businesses that thrive in tourist / college / oil towns).
- Scenario pages ("opening a cafe in Lisbon as a foreigner") - LATER.

## PHASE 6 - THE INTERACTIVE LAYER (a tool, not a page)
- "Make it yours" calculator on business pages (deepen `/calculator`: adjust rent/staff/prices -> your number updates live).
- Save + track a shortlist (built behind accounts; surface it).
- One-tap "compare this to..." from anywhere.
- "Watch" a business/place + honest change alerts.

## PHASE 7 - HOMEPAGE (finish)
Fold the parked Pass A in; keep the honest US-states data story; add the new patterns (answer-first, the through-line honest-take, sub-type-aware search, a real "vs the world" anchor, the flagship-report weave). Ship.

---

## TRACK A (parallel) - Raw-perspectives pipeline (task #36)
Scrape Reddit/forums + run AI deep research -> curated, SOURCED operator quotes per category/place. Feeds `OperatorVoices`, `ContrarianInsight`, `MythVsReality`, `LocalEdge`. Never fabricated. Runs continuously. Its own infra (separate repo/scripts), staged for review before any quote goes live.

## TRACK B (parallel) - Visual assets
From the 5 design-tool prompts (`docs/design/2026-06-12-design-tool-prompts.md`): a unified icon system, business-category pictograms, a data-viz motif kit, editorial spot illustrations, and restrained micro-animations. Integrate as bundles land; tokens/brand-consistent; image placeholders already in place to receive them.

## TRACK C (parallel) - Monetization activation
Already built dormant (auth, gating, Stripe scaffolding, export gate). Founder flips `NEXT_PUBLIC_*` flags + applies migrations + sets Stripe keys per `docs/handoff/2026-06-09-activation-runbook.md` when ready. No new build needed.

---

## SEQUENCING + DEPENDENCIES
- 0.1 (bug fix) BEFORE any cross-trade comparison, the search cascade, the learn deep-links.
- 0.2 (the kit) BEFORE all page builds (it is the vocabulary).
- Phase 1 (flagship) BEFORE Phases 2-5 (it sets the template + proves the patterns).
- Track A feeds the voice sections; pages degrade gracefully until it lands.
- Track B integrates opportunistically; never blocks a page.
- The fabled-model strategy (separate note) governs WHO does what: Fable for design/voice/bug-root-cause/originality seeds; cheaper models for bulk builds + validation + tests.

## VERIFICATION DISCIPLINE (every sub-project)
Detailed plan -> fresh implementer (subagent) -> common-sense pass -> spec+quality review -> Vercel preview (29 gates + tsc) -> curl + desktop/mobile screenshots -> founder try for high-stakes surfaces -> ship -> record in memory.

## DEFINITION OF DONE (per page)
Answer-first; the honest-take; at least one genuinely unique thing; plain operator voice; real data or labeled placeholder (per the build rule); composed from the kit; the spread shown; preview-verified on desktop + mobile.

---

## SUGGESTED ORDER OF ATTACK (first month)
1. Phase 0.1 (bug fix) - unblocks everything.
2. Phase 0.2 (the kit) - build the vocabulary, catalog it.
3. Phase 1 (flagship business page) - one masterpiece template; founder try.
4. Phase 2 (city) + Phase 4 neighborhood - the real-data wins inherit the template.
5. Phase 3 (country/industry skeletons) + Track B assets start arriving.
6. Phase 7 (homepage finish) + Phase 6 (interactive) + Track A (pipeline) ramp.
7. Phase 5 (new page types) as the data + assets mature.
