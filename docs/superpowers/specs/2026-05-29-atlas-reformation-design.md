# Margin Atlas Reformation: North-Star Design

**Date:** 2026-05-29
**Status:** Approved (Approach A, foundation-up). Executing sub-project ①.
**Approach:** A "Registry-first foundation" - make the page-section registry the single brain for every page level; fix data reachability first; layer editorial, signature viz, color/imagery, and quiet gamification as registry-driven sections on top.

This document is the durable vision capture from the 2026-05-29 brainstorm. It records the full program and details sub-project ① (the only one being executed now). Sub-projects ② through ⑥ get their own spec when reached.

---

## The problem, in the user's words

The site "feels dull, dead." Visual elements "do not play well together." "No spirit, no editorial undertone." Not a site people return to. And the enrichment is "massively failing": countries with missing stats, cities with missing districts, unclickable links, bad rendering, asymmetric visual hierarchy, dead sections.

Diagnosis from this session's audits found that part of "dead" is not missing data, it is UNREACHED data: 39.2% of `regional_cells` (147,336 rows) and 46.4% of `extrapolated_cells` (111,052 rows) are real, high-quality rows in the database that the page never shows, because the data-access layer queries for the wrong `industry_id`. Fixing reachability is the floor everything else stands on.

---

## Vision decisions (from the 20-question intake)

- **Audience:** equal weight to curious browser, serious researcher, and data-tourist from a link. One skeleton serves all three.
- **Lead emotion:** beautiful and editorial (magazine-grade), with data and trust close behind.
- **Retention:** rankings and leaderboards + new data drops and editorial pieces.
- **Spirit reference:** Pudding.cool (playful, opinionated data journalism).
- **Voice:** 70% authoritative, 30% wry. An anonymous house narrator ("the Atlas") with a point of view.
- **Auto-prose:** every page (cell, city, country, region, neighborhood) carries 1-3 sentences of editorial insight derived from its own data.
- **Opinion:** the Atlas may make judgment calls, clearly framed as its read ("a hard business", "unusually profitable for its size").
- **Skeleton:** one bespoke-but-codified section order per LEVEL (country / region / city / neighborhood / cell), each enforced by a build gate (registry).
- **Cell hero:** hero number + one-line verdict + the signature distribution viz.
- **Cross-linking:** rich, organized into clearly-labeled rails.
- **Gamification:** Atlas Score per cell, rankings/leaderboards, rarity/quality badges, guess-the-number-then-reveal - all rendered SUBTLE (restraint over confetti). Identity via localStorage now, accounts later.
- **Visual lift priority:** richer charts and maps first, then imagery and color, then motion. A small signature viz FAMILY (distribution, ranking bar, choropleth), not a single icon.
- **Imagery:** tasteful atmosphere imagery, never fake data.
- **Honesty:** never a blank or dead section. Show real data, a clearly-labeled estimate, or an honest "not yet" state that links onward. Coverage and quality worn openly as a trust feature.

---

## Program decomposition (6 sub-projects, foundation-up)

| # | Sub-project | Delivers | Depends on |
|---|---|---|---|
| ① | Reachability + Honesty + Canonical Skeleton | Fix the industry-vocabulary reachability bug; per-level section registry with enforced order and "never a dead section" collapse; minimal percentile verdict line; coverage worn openly. | nothing (the floor) |
| ② | Editorial engine (house voice) | Anonymous 70/30 narrator; auto-prose 1-3 sentences per page from the page's own data; judgment calls framed as the Atlas's read. Upgrades ①'s minimal verdict. | ① |
| ③ | Signature visualization family | "Where you'd land" distribution, ranking bar, choropleth map as the brand visual language. | ① |
| ④ | Sector color system + atmosphere imagery | Sector-keyed color language + tasteful city/industry imagery, never fake data. | ①, ③ |
| ⑤ | Quiet gamification | Atlas Score, rankings/leaderboards, rarity badges, optional guess-reveal; localStorage "my atlas". | ①, ③ |
| ⑥ | Enrichment pipeline hardening | Fix the producer side: missing stats, missing districts, broken links, asymmetric coverage. | ① (parallel-able after) |

The thread: ① makes data reachable and consistently placed; ②-⑤ make it alive; ⑥ makes it complete.

---

## Sub-project ① detailed design

### ①.1 Reachability fix (the data floor)

**Root cause.** Query functions in `src/lib/cells.ts` (`getRegionalCell`, `getExtrapolatedCell`, and the variant siblings) resolve the URL industry slug through `slugToIndustry()` then `resolveToMeasuredIndustry()`, which collapses a sub-niche to its measured PARENT before the query runs. They then `.eq("industry_id", parentId)`. But the international tables carry data at the precise (sub-niche) id. So the query asks for the wrong id and misses real rows, falling through to coarse country-level data or, worst case, an unrelated industry (`metal_products_mfg` resolved to `wood_products_mfg`).

**Two classes of break (measured, not assumed):**
1. **In-taxonomy collapse (the majority):** 15 regional + 136 extrapolated ids ARE valid taxonomy ids but get collapsed to a parent before the query. Example: `doctors_clinics` is valid and present in the DB, but resolves to `veterinary_pet_care`. Fix: try the EXACT id first; fall back to the parent only on a genuine miss.
2. **Legacy vocabulary (the rest):** 15 ids are coarser groupings from the load-time vocabulary that are not in the current taxonomy at all (`metal_products_mfg`, `food_beverage_mfg`, `wood_paper_mfg`, `property_leasing`, `furniture_other_mfg`, `auto_dealers_gas`, `textile_apparel_mfg`, `broadcasting_telecom`, `crop_farming`, `media_publishing`, `postal_courier`, `events_entertainment`, `investment_securities`, `furniture_home_stores`, `passenger_transport`). Fix: a curated bidirectional crosswalk to the closest measured taxonomy id (every target verified to exist).

**The crosswalk (verified targets):**
| Legacy DB id | Taxonomy target |
|---|---|
| metal_products_mfg | fabricated_metal_mfg |
| food_beverage_mfg | food_mfg |
| wood_paper_mfg | wood_products_mfg |
| property_leasing | real_estate_leasing |
| furniture_other_mfg | furniture_mfg |
| auto_dealers_gas | auto_dealers |
| textile_apparel_mfg | textiles_fabric_mfg |
| broadcasting_telecom | broadcasting |
| crop_farming | grain_farming |
| media_publishing | news_periodical_publishing |
| postal_courier | postal_service |
| events_entertainment | performing_arts |
| investment_securities | securities_brokerage |
| furniture_home_stores | furniture_stores |
| passenger_transport | transit_ground_passenger |

**Design.** A new isolated module `src/lib/cells/industry_resolution.ts`:
- `LEGACY_DB_TO_TAXONOMY` and its reverse `TAXONOMY_TO_LEGACY_DB`.
- `industryQueryCandidates(industrySlug): string[]` - returns an ordered, de-duplicated list of `industry_id` values to try, priority: [exact taxonomy id, legacy aliases mapping to it, measured parent]. Also recognizes a legacy slug directly.
- `resolveDisplayIndustry(industrySlug): Industry | null` - the taxonomy industry to show for naming, even when the DB row uses a legacy id.

Query functions change from a single `.eq("industry_id", parentId)` to: try each candidate id in priority order, first candidate that returns rows wins. On a hit this is one query; on a full miss it is at most ~3 queries before the existing synthesis fallback. No function signature changes. `resolveToMeasuredIndustry` is left untouched (it is pure and used elsewhere); the exact-first behavior lives in the candidate list.

**Quality gate.** The existing read-only audits are the regression checks:
- `scripts/audit/industry_vocab_gap.ts` - re-run after the fix; unreachable-rows percentage must drop toward zero. Updated to evaluate the new `industryQueryCandidates` resolver rather than the old single-resolve round-trip.
- `scripts/audit/probe_live_data.ts` - re-run; round-trip probes that were classified `country` (coarse fallthrough) must become `regional` (the real sub-national row), and `synthetic` must stay 0 where real data exists.
- A unit test `tests/cells/industry_resolution.test.ts` asserts the resolver returns the exact id first for the in-taxonomy class and includes the legacy id for the crosswalk class.

### ①.2 Honesty (never a dead section)

The section resolver already supports collapse: a section with missing required data renders nothing (`section-order.ts` documents "Sections with no usable data render NOTHING"). ① formalizes the THREE allowed states per section, replacing silent void with intent:
1. **Real data** - render normally.
2. **Labeled estimate** - when a confident model exists, render with a visible "estimated" badge (the `is_synthetic` / low-quality path already carries this signal; ① ensures every estimate is badged).
3. **Honest "not yet"** - when there is genuinely nothing, render a compact state that links to what IS covered nearby (turns a dead end into navigation), never a blank gap.

Coverage worn openly: every page surfaces its quality grade, sample size ("based on N firms" where available), and data vintage year, as a visible trust element rather than hidden metadata.

### ①.3 Canonical skeleton (per level, enforced)

Extend the existing `section-order.ts` (currently cell / country / industry) to all five levels: **country, region, city, neighborhood, cell**. Each level gets a fixed, ordered section list. A prebuild gate (`scripts/verify_section_order.ts`, the 26th gate) asserts that each level's page composes its sections in the registered order and that no page introduces an unregistered section or omits a required one. This is what guarantees "a skeleton respected by all new entries or modifications."

Canonical cell-page order (the reference): `hero` (number + verdict + signature distribution), `narrative` (verdict slot; minimal in ①, full editorial in ②), `revenue-tiles`, `revenue-distribution`, `margin-waterfall`, `tax-and-cost-panel`, `comparisons` (labeled rails), `related-cells`, `methodology/coverage`. Order is identical across sister pages; thin-data sections collapse per ①.2.

The verdict slot in ① ships a minimal percentile-derived one-liner (e.g. "Typical revenue lands above N% of peers in this industry"); sub-project ② replaces it with full house-voice editorial.

---

## What ① explicitly does NOT include (deferred)

- Full editorial house voice and per-page auto-prose (②).
- The signature visualization family redesign (③).
- Sector color system and atmosphere imagery (④).
- Atlas Score, rankings, badges, guess-reveal, localStorage identity (⑤).
- Producer-side enrichment of missing stats / districts (⑥).

① delivers a site where real data appears where it was silently dropped, every page has a consistent enforced skeleton, no section is ever a dead void, and coverage is worn openly. That is the floor the rest builds on.

---

## Risks and mitigations

- **cells.ts is the data-access spine.** Mitigation: the reachability logic lives in an isolated, unit-tested module; query functions change minimally (candidate loop, no signature change); each change is proven by the live probe before commit; a code-review subagent reviews the spine edits.
- **Slug stability / SEO.** No URL slug is renamed. The crosswalk makes BOTH the taxonomy slug and any legacy slug resolve to the same data; existing URLs keep working.
- **Per-level skeleton enforcement could be over-rigid.** Mitigation: the registry already supports per-section `appliesTo` predicates and data requirements, so collapse is graceful; the gate checks order and membership, not presence of optional sections.
