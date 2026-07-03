# Margin Atlas , Master Execution Plan (2026-06-23)

The single source for moving the whole pipeline forward: maps, POPs, tourism, the recommender, the Margin Index, gold-mine intel, pricing, the homepage. Built entirely on the design + architecture decisions ratified in `PRODUCT-DIRECTION.md` (sections 12-15).

**Governing principle:** ship the smallest thing that earns money on a fully-backed market (London/UK), then let evidence (paid demand) gate every next surface. Revenue as early as defensible; no speculative building.

**The one referee:** every sequencing and A/B call is judged by ONE metric, paid trials started from a decision-tool wall.

---

## Phase 0 , Design and spec (THIS conversation, DONE)
The decision foundation. Ratified and captured so it survives any new session:
- Map spec (§12), 40 design + monetization decisions (§13), POPs spec (§14), 40 system-architecture decisions (§15).
- **Role in the plan:** every later phase IMPLEMENTS decisions made here. No phase re-opens them; they are the contract. This conversation was the cheap, exhaustive thinking that makes the build deterministic.

## The architecture spine (the rails every phase rides, from §15)
- **Data:** 4-tier per-entity JSON (country / city / district / cell) with parent-refs; map inputs as first-class city/district blocks (`_meta`/confidence/`as_of`); derived scores (Margin Index, audience-match, spend-density) batched into `derived/` artifacts, recomputed by input-hash; vintage = block meta + derived rollup; per-feature coverage manifest gates launches; ONE central coverage resolver enforces "not held"; versioned migrations; a canonical district registry (slug + polygon + city_ref) is the join key; serving = static content pages + Supabase for accounts/state/tools.
- **Editorial:** gold-mine intel derived from owned data via cross-dataset synthesis; provenance-bound generation (a claim renders only if bound to a held datum); fully templated prose with a rules + phrasebank voice; verdict-first extractable copy for AEO; coverage-gated programmatic grid; like-for-like linking; build-time blocking copy lint; transparent Margin Index methodology; per-claim as-of; English + local units; name-the-gap honesty.
- **Business:** paywall on ONE axis (depth of decision); first paywall = city map layers (rent free, rest Pro); flat Pro seat; Team = shared workspaces + API/bulk; content free / tools gated; price-lock annual lead; deep-UK-paid / free-world; working-partial teasers; OG/AEO share loop; central flag layer; evidence-gated roadmap; north-star = tool-wall trials; revenue MVP = the London tools bundle.

---

## Execution phases (sequenced, dependency-aware)

### Phase 1 , Foundations (the rails)
**Goal:** stand up the data model + machinery everything needs.
**Ship:** city/district schema + first-class blocks (POPs, tourism, rent, footfall, saturation) + the canonical district registry; the per-feature coverage manifest + central coverage resolver; the `derived/` score scaffold + hash-recompute; versioned-migration discipline; the build-time copy lint; the **gold-mine intel card** component (the ratified "first asset" style wedge, coded engraved SVG) + the engraved glyph set + the dynamic-OG renderer.
**Depends on:** Phase 0 specs. **Gate:** schema locked + lint/coverage gates green + the intel card renders to spec.

### Phase 2 , London exemplar data
**Goal:** the one fully-backed market.
**Ship:** curate London's 15-25 commercial districts into the registry (with polygons); fill rent / footfall / spend / saturation + the 8-archetype POP mix + tourism intensity + one gold-mine intel fact per district via the reuse-drops to validate to ingest pipeline; London Margin Index inputs.
**Depends on:** Phase 1 schema + registry. **Gate:** London clears the per-feature coverage floor for the rent layer + POPs (UK small-area census means district-resolution POPs are valid here).

### Phase 3 , The London map (first flagship)
**Goal:** port the mockup to a real product surface.
**Ship:** `city-london-map.html` to a real MapLibre component on the rails (hybrid polygon + point, colour + printed number, 5 layers default Rent, click to right sidebar with metrics + POP mix + intel card, deep-links to neighbourhood pages, grey "not held"); positron greyscale + terracotta; the engraved-glyph POP layer (colour-by-dominant, lower-income / Other never dominant).
**Depends on:** Phase 1 (registry, blocks, intel card) + Phase 2 (London data). **Gate:** map verified (tsc + prebuild gates + a real screenshot) on a preview.

### Phase 4 , First revenue (the paywall)
**Goal:** start charging at the earliest defensible point.
**Ship:** Supabase accounts; the central flag layer; Pro gating on the map (rent free, POPs/saturation/intel/compare Pro); the working-partial teaser; the price-lock annual flow ("2 months free" framing, lead with price-lock); flat Pro seat. This is half the "London tools bundle".
**Depends on:** Phase 3. **Gate:** tool-wall trials instrumented; first paid conversions observed.

### Phase 5 , The recommender (the flagship tool)
**Goal:** complete the payable decision.
**Ship:** the UK-scoped recommender (declare trade + priorities to a ranked shortlist of London/UK places), audience-match sub-score = POP share x spend-power, like-for-like only, working-partial teaser, Pro-gated. Completes the London tools bundle.
**Depends on:** Phase 2 data + Phase 4 paywall infra. **Gate:** recommender trials convert; clears the evidence threshold for the next surface.

### Phase 6 , Margin Index (the POV centrepiece)
**Goal:** the brand + AEO flagship.
**Ship:** the Margin Index as a pure derived artifact (transparent, reproducible "what an owner keeps" methodology), verdict-first extractable pages, the annual full-history gate, the slope dot-plot compare viz.
**Depends on:** enough backed markets to re-rank honestly (UK + the data track's first countries). **Gate:** Index pages cited / shared (OG loop); annual conversions via the history gate.

### Phase 7 , Homepage (the front door)
**Goal:** the decision-engine entry + conversion engine.
**Ship:** hero ("Where business actually pays") + command search + a live recommender demo + the Margin Index + gold-mine intel cards + pricing; lead with the contrarian hook.
**Depends on:** recommender + Index live (Phases 5-6). **Gate:** homepage trial-start rate.

### Phase 8 , Editorial scale + growth engine
**Goal:** turn on the SEO/AEO funnel.
**Ship:** the coverage-gated programmatic grid across geo x business; like-for-like linking; per-page dynamic OG; verdict-first pages; the rules + phrasebank voice at scale; per-claim as-of. Instrument the OG/AEO share loop.
**Depends on:** the data track filling more cells; the rails (lint, resolver, templating). **Gate:** organic + cited traffic feeding tool-wall trials.

### Phase 9 , Expand (evidence-gated)
**Goal:** widen only where money points.
**Ship (each gated by the prior surface clearing a paid-demand threshold):** more cities (data track); the Team tier (shared workspaces + API/bulk); the what-if modeller (3-4 levers); dashboards / watchlist / alerts (rule/tax/visa triggers); then zones / immigration / reports / API as demand proves out.
**Depends on:** the revenue signal from Phases 4-7. **Gate:** each surface earns its build via the evidence gate.

---

## Cross-cutting tracks (run continuously)
- **Data fill:** the deep-research + Sonnet pipeline fills the world (separate track), feeding Phase 8 breadth; never fabricate, honest "not held".
- **QC + verification:** every delivery runs the verification protocol (tsc + prebuild gates + a SEE-it screenshot + honest reporting); the copy lint + coverage resolver enforce the laws mechanically.
- **Design cohesion:** one visual language (engraved frame + clean data core), tokens-only, glass only on floating chrome.

## Honest risks (carry these, do not bury)
1. **Neighbourhood POPs is a rich-country feature**; for most of the world POPs is city-level (London is covered). Never market a "global neighbourhood POP layer".
2. **The data fill is the long pole;** revenue is deliberately scoped to deep-UK first so we never sell thin data.
3. **Over-building** is held off by the evidence gate: no committed surface is built before the live one proves paid demand.
4. **Team's two definitions** (collaboration vs API/bulk) are reconciled: workspaces are the upsell trigger, API/bulk is the ACV lever; both live in Team.
