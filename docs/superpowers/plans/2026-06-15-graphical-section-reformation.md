# Graphical Section Reformation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. This is a DESIGN reformation, so the "test" for each task is the Verification Protocol (gates + SEE-it screenshots at 1280 + 375), not unit tests.

**Goal:** Make every page type skimmable in seconds by reforming every section that currently shows its data as text/bullets/lists into a section that shows its data GRAPHICALLY, each with its own character, so no two sections feel identical and a reader (a PE analyst, an agency, a founder) understands the page at a glance.

**Architecture:** A small set of reusable chart primitives is built FIRST (DRY), then each text-wall section is reformed by composing the right primitive with data that ALREADY exists in the view models. The engraved card grammar (flat hairline cards, Newsreader serif), the fixed section spine per page type (section-constitution.md), and the chart grammar (design-system.md §10) are the law. No section is removed or reordered. No data is fabricated.

**Tech Stack:** Next.js 15.5 / React 19 / TypeScript 5 / Tailwind 3.4, the Atlas Page Kit (`src/components/kit/`), tokens only (`design-tokens.ts`), SVG charts (server-rendered, motion-reduce safe), Playwright MCP for SEE-it.

---

## 0. The law this plan serves (founder directive, 2026-06-15)

1. **Every section earns its place by transmitting its data GRAPHICALLY** — a chart, gauge, map, range strip, bar, diagram, or visual breakdown. The data exists; the section must SHOW it, not tell it.
2. **Every page must be SKIMMABLE** — understood at a glance, in seconds, by the right reader.
3. **Every section has its OWN character** — sections must NOT feel identical to each other. Distinct visual language per beat, within the one cohesive engraved system.
4. **A text / bullet / prose block is a FAILURE STATE** — allowed only when there is genuinely no better option (a verdict, an editorial voice, a navigation rail), and only LOW on the page.
5. **Cohesive, not uniform** — one engraved card grammar and one chart grammar across the site, but each section reads differently. The reader learns the visual vocabulary and skims.

---

## 1. Current-state audit synthesis (grounded, 2026-06-15)

A 6-agent read-only audit cataloged every section of every page type. The honest result:

**Already strong-graphical (KEEP, these are the reference models):**
- Country: scorecard, nine-lens radar, setup stepper (route line), neighbours table, how-far-reach (population + dials), cities grid, character spectrum bars, vs-world bars.
- Cell: money-goes (per-$100 stacked bar), cost-drivers (arrow + impact ticks), seasonality (12-month bars), pay-by-role (wage tracks), vs-world.
- City: masthead + score band, visitor-split bar, owner-keep table, neighbourhood cards, peer comparison bars + cards, vs-peers.
- Industry: hero range strip, money-goes, margin waterfall, cost-drivers.
- Learn: headline-number card, P&L (money-goes), the range strip.
- Compare: revenue-spread range strips, the side-by-side table (correctly dense; a chart would not improve it).
- Home: hero (rotating words), the world map. Directories: the cities world map.

**Two kinds of weakness — handle them DIFFERENTLY:**

- **(A) Genuine design text-walls (data EXISTS, shown as text) — THE REFORM TARGETS.** These are where the work is. See §3 phase tables.
- **(B) Sample-placeholders (data NOT held; design already sound).** Country middle sections (special-zones, licences, same-business-abroad, talent-reality, who-has-money spend-mix, your-life-here, locals-know) and most neighbourhood data sections render honest sample states because upstream data is not held. Their viz design is ALREADY good (engraved dials, scatter, mirror bars). **These are NOT reformed in this plan** — they are design-complete-pending-data; the Sonnet data-fill phase fills them and the existing viz renders. Reforming them now means designing against absent data. We will only VERIFY their sample states read cohesively.

This distinction keeps the plan honest (no fabricated data) and focused (real text-walls with real data).

---

## 2. Phase 0 — the reusable viz primitives (BUILD FIRST, DRY)

Most text-walls are the same shape: "a ranked / compared set of values shown as a list." One primitive kills many. Build these once in `src/components/kit/charts/`, catalog each in `src/app/_design/`, tokens only, nullable-in / silence-out, SVG + mobile-HTML split like RangeStrip, motion-reduce safe.

| Primitive | Shape | Reused by |
|---|---|---|
| `LikeForLikeBars` | Horizontal bars, one per item, length ∝ value (zero-based), the subject/"here" bar the lone accent, peers quiet cocoa; label left, value right (tabular serif). | cell `nearby`, industry `where-it-earns`, learn `other-businesses`, neighbourhood `thrives`, home `state-comparison`, home `example-tiles`. THE highest-leverage primitive. |
| `ThresholdGauge` | A horizontal scale with a marked threshold position + a "you are at" zone; tints below/above the line. | cell `break-even`, city `space` (COL index), neighbourhood `operating-cost` (rent tier). |
| `TimelineRibbon` | A horizontal timeline with 3-4 labeled milestone markers (a progression, not a list). | cell `first-year` ramp. |
| `SeverityGlyph` | A 3-step fill glyph (hollow / half / full) colored by severity (cocoa / amber / clay). | cell `risks`. |
| `MiniRangeStrip` | Use existing `RangeStrip size="compact"`; no new build. Context strip under a lone figure. | cell `owner-take-home`, directory revenue spreads. |
| `TierBar` | A tiny filled bar (parchment track + cocoa/atlas fill) showing a value's position in a range, with an optional `<TierDot>` confidence. | directories (coverage depth, salary position, margin range), industry `related-links` margin badge. |

Reuse existing primitives wherever they fit: `MoneyGoesBreakdown` (stacked bar) for `startup-cost`; the engraved meaning gauges/dials for any 0..1 reads; `ComparisonBars` for ranked scores.

**Phase 0 sanity gate:** each primitive renders in `_design` at 1280 + 375 in default / filled / thin / null states; tokens only (no raw hex/px); motion-reduce safe; tsc + prebuild green; SEEN via Playwright.

---

## 3. The architecture + per-section reform, by page type

For each page type: the spine is FIXED (section-constitution.md). Below, each section carries its target treatment. `KEEP` = strong, no change. `DATA` = sample-placeholder, design-complete-pending-data, not reformed here. `REFORM` = a genuine text-wall to reform (the work).

### 3.1 CELL / activity page (the core product — Phase 1, highest priority)
| Section | Status | Target treatment | Character |
|---|---|---|---|
| honest-take | REFORM (light) | verdict line + one quantified marker chip (a tiny break-in gauge or margin-tier tick) | a framed verdict, not a chart |
| narrative | KEEP-as-text (rare justified) | optional: pull one inline delta badge from the prose | editorial voice |
| plain-terms | REFORM | icon-led unit cards (icon | big number | label), 2-up | tangible, iconographic |
| money | KEEP | per-$100 stacked bar (add a vermillion tick on the kept row) | the cost anatomy |
| cost-drivers | KEEP | arrow + impact ticks | the levers |
| owner-take-home | REFORM | the figure + a `MiniRangeStrip` showing where it lands among peers; moss left-edge accent | the kept money, in context |
| break-even | REFORM | `ThresholdGauge` (covers-cost-at-N-sales-a-day), serif caption | a survival line |
| wages | KEEP | wage tracks | pay by role |
| startup-cost | REFORM | `MoneyGoesBreakdown` re-used for cost categories (stacked bar + line items) | the cost to open |
| seasonality | KEEP | 12-month bars | the year shape |
| first-year | REFORM | `TimelineRibbon` (ramp → break-even → stable) | a progression |
| nearby | REFORM | `LikeForLikeBars` (here accented, peers quiet) | place comparison |
| operator-voices | REFORM (light) | quotes + small trade-pictogram circle per quote | human voice |
| risks | REFORM | title + note + `SeverityGlyph` | the watch list |
| vs-world | KEEP | dual bars + signed delta | global anchor |
| related | KEEP-as-nav | card links + pictograms | routing |
| one-thing | KEEP | warm closer + accent rule | the last word |

### 3.2 INDUSTRY page (Phase 2)
| Section | Status | Target |
|---|---|---|
| hero | REFORM (stats) | keep pictogram + H1 + range strip; replace the three orphaned margin numbers with a mini per-$100 / 3-row margin cascade |
| honest-take | KEEP (light) | verdict + spot; optional icon-labeled levers |
| how-it-works | KEEP / ENHANCE | per-$100 bar stays; optionally fold the signal cards into an integrated cost-stage swimlane |
| money | KEEP | reference per-$100 |
| typical-operator | REFORM | facts + modest visuals (survival gauge, revenue→take-home ratio bar) instead of plain type |
| where-it-earns | REFORM | `LikeForLikeBars` per state (visual rank), value right | the BIG industry text-wall |
| margin-waterfall | KEEP | add "what leaves at each cut" annotations |
| cost-drivers | KEEP | reference |
| related-links | REFORM (light) | pictogram + a `TierBar`/badge of net margin per trade |

### 3.3 CITY page (Phase 3 — mostly strong already)
| Section | Status | Target |
|---|---|---|
| headline, visitors, owners-keep, neighbourhoods, peers, vs-peers | KEEP | strong |
| honest-take, one-thing | KEEP | editorial |
| customer | REFORM (light) | require the income `RangeStrip` on every city that holds income data (today London-only); graceful omit otherwise |
| space | REFORM | `ThresholdGauge` COL index (cheap/moderate/expensive) leading the prose verdict |
| best-areas | REFORM (light) | two-column area cards (area+suits serif / why prose) + icon + hairline rhythm; keep the local-knowledge voice |
| changing | REFORM (light) | a 3-row trend card (direction markers) instead of bullets; honest self-omit when no trend |

### 3.4 COUNTRY page (Phase 4 — strong; mostly DATA + light closers)
| Section | Status | Target |
|---|---|---|
| scorecard, country-shape, decisive, how-far-reach, neighbours, opportunity-gap, ground-under-you, cities, character, vs-world | KEEP | reference-quality engraved viz |
| hire, talent-reality, who-has-money, same-business-abroad, special-zones, licences, locals-know, your-life-here | DATA | design-complete-pending-data; not reformed; verify sample states cohere |
| honest-take | REFORM (light) | verdict in a small stamp/council frame + a spot; ticks as small meaning ticks |
| gut-check | REFORM (light) | 3-card grid, each with a question glyph + tinted frame; keep the prompts |
| one-thing, related | KEEP | editorial closers / CTA |

### 3.5 HOME (Phase 5)
| Section | Status | Target |
|---|---|---|
| hero, world-map | KEEP | the anchors |
| example-tiles | REFORM | `LikeForLikeBars` / revenue bar per example (split-number treatment) |
| state-comparison | REFORM | `LikeForLikeBars` ranked, leader accented |
| neighborhood-cards | REFORM (light) | add a price-tier pill + a tier bar per card |
| audience-band | KEEP | icons + spot are sufficient |
| upgrade-teaser | REFORM | feature matrix → three tier cards with moss-included / muted-excluded bands |
| blog-rail | REFORM (light) | topic pill + thumbnail/initial per post |
| newsletter | REFORM (light) | a sample-PDF preview thumbnail or three proof stat chips |

### 3.6 DIRECTORIES (Phase 6)
| Page | Section | Status | Target |
|---|---|---|---|
| countries | header | KEEP (light) | optional continent breakdown gauge |
| countries | continent-groups | REFORM (light) | per-tile `TierBar` coverage-depth + `<TierDot>` confidence |
| cities | hero (map) | KEEP | the hero |
| cities | by-region | REFORM | per-StatCard `TierBar` per stat (visitors / salary position / GDP) — the BIG directory text-wall |
| industries | hero | REFORM (light) | a mock `RangeStrip` showing "the range you'll see" |
| industries | search-and-groups | REFORM (light) | per-tile micro margin/revenue `TierBar` or tier dot |

### 3.7 LEARN + NEIGHBOURHOOD + COMPARE (Phase 7 — lighter)
| Page | Section | Status | Target |
|---|---|---|---|
| learn | other-businesses | REFORM | per-row `LikeForLikeBars` on the headline metric |
| learn | explanation | KEEP-as-text | the one justified long-form prose; pull a chart only if it claims a trend/comparison |
| neighbourhood | thrives | REFORM | `LikeForLikeBars` of the trade multipliers (0.4x–3x), pictogram left |
| neighbourhood | masthead, prime-streets | REFORM (light) | a multiplier gauge in the masthead; a rent `TierBar` per street card |
| neighbourhood | street, who, operating-cost, adjacent | DATA | design-complete-pending-data; not reformed |
| compare | where-each-wins | REFORM (light) | a win-metric chip per win card |
| compare | compare-grid | KEEP-as-table | dense numbers are correct here |

---

## 4. The phases (subagent-driven, gate-green + SEEN + committed each)

- **Phase 0 — primitives.** Build `LikeForLikeBars`, `ThresholdGauge`, `TimelineRibbon`, `SeverityGlyph`, `TierBar`; catalog in `_design`. (One subagent per primitive; spec-review + code-review each.)
- **Phase 1 — CELL** (the core product, most reform). One subagent per REFORM section above, composing the Phase-0 primitives + existing data.
- **Phase 2 — INDUSTRY.**
- **Phase 3 — CITY.**
- **Phase 4 — COUNTRY** (the light closers; verify the DATA sample states cohere).
- **Phase 5 — HOME.**
- **Phase 6 — DIRECTORIES.**
- **Phase 7 — LEARN + NEIGHBOURHOOD + COMPARE.**
- **Phase 8 — FINAL COHESION QA + promote (Wave F).** Per-type skim test, the "no two sections identical" check, the data-honesty pass, gates, the comprehensive 1280 + 375 screenshot sweep across every page type, one preview → founder review → single promote (the held engraved country fix ships here).

Each phase: subagent implements → spec-review subagent → code-review subagent → SEE-it (Playwright 1280 + 375) → commit. Watch the server-side rate-limit (keep concurrency modest).

---

## 5. The sanity checks (baked into EVERY section and phase)

**Per section (the section is not done until ALL pass):**
1. **Graphical:** it transmits its data as a visual, not a text/bullet block (or it is a justified exception per §0.4, low on the page).
2. **Skimmable:** a reader gets the section's point in under ~5 seconds without reading prose.
3. **Faithful:** the visual transmits the section's ACTUAL message/data, with no visibly-wrong number, real-or-tagged-sample, like-for-like.
4. **Distinct:** it reads DIFFERENTLY from its neighbours (no two adjacent sections feel identical).
5. **Cohesive:** engraved hairline card, the chart grammar, the color jobs, Newsreader — it belongs to the one system.
6. **Whole:** renders filled AND thin/empty honestly; nullable-in / silence-out; no broken/overlapping/blank.
7. **Gates + SEE-it:** tsc clean, prebuild 31/31 (no section dropped), screenshot 1280 + 375 — looks normal, the named change is present, nothing broken.

**Per phase (the page-level check):**
- The **skim test:** open the page, scroll once at reading speed — can you state what each section says from its visual alone? List any section that fails.
- The **sameness test:** no run of sections that look like the same card with different text. Flag and differentiate.
- The **cohesion test:** the page reads as one designed object (frame, type, chart grammar), yet each beat has character.
- Gates + the 1280 + 375 exemplar (London/UK) + thin-instance screenshots.

**Final (Phase 8):** all of the above across every page type, plus data-honesty (real vs tagged-sample vs deferred stated), then the single cohesive promote.

---

## 6. Hard rules carried through

- No section removed, renamed, or reordered (the constitution + the section gates).
- Tokens only (no raw hex/px/ms), no em-dashes, no source-agency names, WCAG AA, 375px no horizontal scroll.
- No fabricated data: a section reforms only data that EXISTS; sample-placeholder sections keep their honest states.
- DRY: build a primitive once, reuse it; never re-implement a bar five times.
- Verify + commit each section/phase green before the next; nothing promotes before the Phase-8 founder review.

---

## 7. Ambitious goal (the definition of done for the whole reformation)

Every page type — country, city, activity, industry, neighbourhood, learn, compare, home, directories — is **skimmable in seconds**; **every section that holds data shows it graphically**; **no two sections feel the same**; the pages read as one cohesive, distinctive, engraved almanac that a professional can trust and a founder can grasp at a glance. A wall of text survives only where there is genuinely no better way to say it (a verdict, an editorial explanation, a navigation rail) and only low on the page. This is the final reformation of the corresponding pages.

---

## Self-review (run against the founder directive + the audit)

- **Coverage:** every text-wall the audit found has a REFORM row in §3 with a concrete target viz. Sample-placeholders are explicitly excluded (design-complete-pending-data) so we never design against absent data. ✓
- **DRY:** the recurring "ranked/compared list" text-wall is solved once by `LikeForLikeBars` (Phase 0), reused across cell/industry/learn/neighbourhood/home. ✓
- **Distinct-not-identical:** each primitive is a different shape (bars vs gauge vs ribbon vs glyph vs range strip), so reformed sections read differently. ✓
- **Honest:** no fabricated data; tagged samples preserved; the data-dependent sections wait for the data phase. ✓
- **Skimmable + low-text:** text allowed only as the documented exception, low on the page. ✓
- **No placeholders in the plan's intent:** every REFORM names a concrete viz + the data source + the character; the code is written during subagent execution per the verification protocol. ✓
