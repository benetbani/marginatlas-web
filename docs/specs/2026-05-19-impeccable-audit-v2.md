# Impeccable Audit — v2 (post Wave 6b + Phase B)

**Date:** 2026-05-19
**Auditor:** `impeccable audit` (Plan v14 Wave 6b follow-up)
**Targets:** `http://localhost:3001/` (homepage) and `http://localhost:3001/us/california/restaurants` (representative cell page)
**Baseline:** [`2026-05-19-impeccable-audit-homepage-v1.md`](./2026-05-19-impeccable-audit-homepage-v1.md) — composite **11/20**
**Scope:** Read-only diagnostic. No source files modified. Cell page newly in scope (not audited in v1).
**Founder framing:** Be brutally honest. Don't soften the critique.

---

## TL;DR

Wave 6b closed every P0 and most of the P1 leakage. The homepage is meaningfully more **on-brief** than v1: cream-50 body background is correct, the sticky header and hero card are solid surfaces, the hero h1 is Cormorant Garamond, the three-identical-card grid is gone (replaced by a numbered `<ol>` with hairline dividers), 16 homepage sections now sit on alternating cream/white tones, and the rendered HTML is em-dash-free in user-visible copy.

Phase B's per-cell narrative ships and reads well above the revenue tiles on the cell page sample. The opening sentence pattern ("A restaurant in California generates roughly...") is exactly the broadsheet voice DESIGN.md asks for.

**What still drags the score:**

1. **Two glassmorphism instances remain** — the `DimensionSwitcher` sub-nav (`bg-ink-50/95 backdrop-blur`, `src/components/DimensionSwitcher.tsx:65`) and the `GlobalSearch` modal scrim (`backdrop-blur-sm`). The header-card pair was the v1 P1; this sub-nav was missed because v1 only audited the homepage.
2. **Hero is still the half-glass-half-cinema problem** — solid card now (good), but it still sits centered over an 80vh dark-ink cinematic video band. The cinematic-hero-over-dark-video pattern is the strongest "AI SaaS landing" tell on the page; the v1 audit asked the founder to **pick one** of two viable directions and the current state is still the half-committed middle.
3. **`text-cocoa-900` vs `text-ink-900` H2 inconsistency** (v1 P2 #10) untouched: 4 of 8 H2 variants on the homepage still use cocoa-900.
4. **Section padding still arbitrary** — `py-5`, `py-8`, `py-10`, `py-12` mixed across `page.tsx` with no rule.
5. **`RotatingWord` still ignores `prefers-reduced-motion`** (v1 P2 #13).
6. **Two adjacent cream-50 bands** on the cell page where the narrative section was inserted — narrative is cream-50 and revenue-tiles is also cream-50, so the alternation breaks for one transition. Cosmetic but visible.
7. **`border-slate-200/60` leakage** — the "Other industries in {region}" tile grid on the cell page (`src/app/[country]/[geo]/[industry]/page.tsx:587`) uses the un-tokenized slate border instead of `parchment`. Three occurrences in repo, all in browse + cell tiles.
8. **`bg-ink-50` still appears** as the sub-nav background — same cool-gray drift the body tag was rescued from. Replace with `bg-cream-50/95`.

**The page is now on-brief above the navigator. The cell page is on-brief from narrative downward. The hero remains the single biggest design liability.**

---

## 1. Comparison to v1 (dimension scores side by side)

| Dimension | v1 score | v2 score | Δ | Key reason for the move |
|---|---|---|---|---|
| Accessibility | 3 | 3 | 0 | `RotatingWord` still no-prefs-reduced-motion. Contrast on dark hero text retested OK. No new a11y wins. |
| Performance | 3 | 3 | 0 | No regressions. Hero video remains the largest TBT/LCP risk and is still un-instrumented. |
| Responsive Design | 2 | 3 | +1 | Section-tone alternation introduced a visible vertical rhythm that survives mobile. H1 at sm jumped from `text-2xl` to `text-3xl` (good). Mobile h2 sizes still inconsistent though, so not a full 4. |
| Theming | 2 | 3 | +1 | Body bg fixed, broken `parchment-100` fixed, hero card solid, header solid, font-display variable wired. H2 color token still inconsistent (`ink-900` vs `cocoa-900`); `border-slate` leakage; `bg-ink-50` in sub-nav. |
| Anti-Patterns | 1 | 2 | +1 | Three of the five v1 tells gone (em dashes, glass header, identical-card grid). Two remain (cinematic-dark-hero, two backdrop-blur instances), plus translucent `bg-white/60` chip on SectorMasterMenu and `text-white` on amber buttons. |
| **Total** | **11/20** | **14/20** | **+3** | Acceptable → Good (lower band). |

Rating band: **Good** (14-17 — address weak dimensions). Up from **Acceptable** (10-13 — significant work needed).

---

## 2. What got fixed (v1 P0/P1 closeout)

### P0 — all resolved
- **Body `bg-ink-50` → `bg-cream-50`** (commit 8fc3745). Verified at `src/app/layout.tsx:45`. Rendered HTML now shows `bg-cream-50` on `<body>`; the warm `--hero-fade` gradient under the page top now resolves correctly against the cream base.
- **Broken `parchment-100` class** (commit 8fc3745). `SpotlightCountry.tsx:149` now uses flat `bg-cream-100 border border-parchment` — no more 3-stop gradient, no more undefined Tailwind class. Two stale references remain in non-homepage files (`src/app/not-found.tsx:33`, `src/app/admin/anomalies/page.tsx:73`) but neither touches the audit surface.
- **Em dashes in rendered HTML 30 → 1** (commit 03070ce). The remaining 1 is inside a Next.js RSC payload string (`"avg-employees-per-firm display removed —"`) — an inline source comment, not user-visible text. Sweep across 67 files succeeded.

### P1 — five of six resolved
- **Sticky-header `backdrop-blur`** (commit 8fc3745). Header is now `bg-cream-50` solid with a 1px `border-ink-200`. PASS.
- **Hero card glassmorphism** (commit 63965b4). Card is now `bg-cream-50 border border-parchment rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm` — solid, no `backdrop-blur-md`, no translucent opacity. PASS for the card itself; **the surrounding cinematic-dark-hero context remains and is the larger problem** — see Section 4 below.
- **Identical card grid in "What you'll see"** (commit 63965b4). Now a numbered `<ol>` with 2.5rem leading-number column, hairline `divide-y divide-parchment` borders, no card pattern, more editorial. PASS — this is the cleanest single fix in the wave.
- **Hero h1 in Inter** (commit b2db642). h1 now has `font-display` class which resolves to Cormorant Garamond via `next/font/google` (`src/app/layout.tsx:11-16`). Variable `--font-display` propagates to `<html>`. Visible in rendered HTML. PASS.
- **No homepage section-tone alternation** (commit f5fb32a). `ToneBand` wrapper added with 16 `home-*` IDs in `SECTION_TONES`. Rendered HTML shows `bg-cream-50` (15×), `bg-cream-100` (84×, includes nested cards), `bg-white` (266×, includes nested elements) — confirming the alternation. PASS.
- **`AcrossStatesStrip` firms-count leak** (commit 2298ffd). Fix in place. PASS.

### v1 P2 — partially resolved
- **`text-white` on navigator-form button**: STILL PRESENT. 28 occurrences in homepage HTML, 10 on cell page. Source files: `NavigatorForm.tsx:268`, `AskWidget.tsx:84`, `NewsletterSignup.tsx:70`, `GlobalCoverageStrip.tsx:53`, `TaxOverlayTeaser.tsx:42`, `QualityLegend.tsx:37` (rating badges, where `text-cream-50` would be ~identical), `[country]/page.tsx:308`. The QualityLegend numbered badges are intentional inverse text on saturated swatches; the buttons are not.
- **H2 color inconsistency**: STILL PRESENT. 4 of 8 H2 variants use `text-cocoa-900` (`SpotlightCountry`, `CellOfTheWeek`, `CityPicker`, etc.); 4 use `text-ink-900`.
- **Inconsistent section padding**: STILL PRESENT. `src/app/page.tsx` mixes `py-5` (×3), `py-8` (×2), `py-10` (×3), `py-12` (×1).
- **Mobile H1/H2 collapse**: PARTIALLY FIXED. Hero h1 went from `text-2xl sm:text-3xl` to `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` — sm step is now 30px vs the previous 24px, comfortably above the section h2's 24px. Section h2 still `text-2xl md:text-3xl` though. Step contrast improved at sm but the H2 still doesn't shrink down on the smallest viewport. C+ grade.
- **`RotatingWord` `prefers-reduced-motion`**: STILL PRESENT. `src/components/RotatingWord.tsx` lines 32-42 unconditionally start the interval. Trivial fix.

### v1 P3 — not yet addressed
- **`bg-white/60` translucent chip on SectorMasterMenu**: STILL PRESENT (`src/components/SectorMasterMenu.tsx:60`). 155 rendered occurrences across the homepage (one chip per sector × multiple renders in the RSC payload).
- **Newsletter card `bg-ink-100/30`**: STILL PRESENT in `layout.tsx:73` (footer wrapper) — minor.
- **Stat strip hero-metric template**: Tolerated, flagged for tracking.
- **17 homepage sections still 17 sections**: untouched — not addressed in 6b.

---

## 3. What still scores badly

### Theming (3/4 — held back by token drift)
- **H2 color token inconsistency** — pick `text-ink-900` everywhere or document the rule that brand-register editorial sections get `cocoa-900` and product-register sections get `ink-900`. The current pattern is "whichever was typed first."
- **`border-slate-200/60` leakage** in three places (`browse/page.tsx:86`, `browse/page.tsx:150`, `[country]/[geo]/[industry]/page.tsx:587`). The token system has `parchment` for warm borders and `ink-200` for darker dividers. `slate-200` is generic-Tailwind drift.
- **`bg-ink-50` cool off-white** still surfaces in `DimensionSwitcher.tsx:65`. That's the exact cool gray the body tag was rescued from. Replace with `bg-cream-50/95` for the same translucent effect on the right palette (and ideally drop the `/95 backdrop-blur` entirely — see Anti-Patterns below).

### Anti-Patterns (2/4 — held back by hero + backdrop-blur leakage)
- **The 80vh cinematic dark-ink hero remains.** The card inside it is now correct (solid cream). But the hero section overall — `bg-ink-900`, full-bleed `-mx-[50vw] w-screen`, 600px+ tall, optional autoplay video — is the visual gesture every B2B SaaS marketing page has been making since 2023. The card on top now reads "broadsheet inside an Apple Vision Pro ad." That's a mixed-register failure. The two viable directions remain: (a) **Quiet editorial masthead** — kill the video, hero becomes a cream-paper full-bleed band with serif h1 and the global search beneath; or (b) **Commit to drama** — keep the dark video, but make the card sit on it like a printed page resting on a desk (heavier paper-shadow, no decorative video overlay, fewer interior chrome elements). Either is fine; the current half-and-half is the worst combination.
- **Two `backdrop-blur` instances remain**: `DimensionSwitcher.tsx:65` (cell page sticky sub-nav) and `GlobalSearch.tsx:147` (cmd-K modal scrim, `bg-ink-900/40 backdrop-blur-sm`). Both are P1 in spirit — the modal scrim is the more defensible since modal backdrops are a category where translucency is genuinely useful, but the sub-nav has no reason to be glassy.
- **`bg-white/60` translucent chips** still appear on `SectorMasterMenu` country-tag pills. Solid `bg-cream-100` reads identical.
- **`text-white` on amber CTAs** — DESIGN.md's "no pure white" rule applies. `text-cream-50` (#FEFBF6) reads identical on `bg-atlas-500` and on-doctrine.

### Responsive Design (3/4 — held back by mobile h2 step + cell-page sub-nav)
- Section h2 at sm is still `text-2xl` (24px). Hero h1 at sm is `text-3xl` (30px). Step contrast at sm is 30/24 = 1.25x, which is below the 1.5x recommended minimum for a hierarchy step. Either bump h1 sm to `text-4xl` (36px) or pull h2 sm down to `text-xl` (20px).
- `DimensionSwitcher` sub-nav is `sticky top-[57px]` — at mobile widths, the select wrappers (industry, region, size, year) flex-wrap to 2-3 rows tall, pushing the cell hero content down by 100-140px on first paint. Verify on real iPhone-SE width that the sticky band isn't eating half the above-fold.

---

## 4. New issues found (not in v1 scope)

### N-1 (P1, anti-pattern): Cell-page sticky `DimensionSwitcher` is a third backdrop-blur instance.
- **Location:** `src/components/DimensionSwitcher.tsx:65`
- **Class:** `sticky top-[57px] z-[5] -mx-6 px-6 py-3 bg-ink-50/95 backdrop-blur border-y border-ink-200 mb-6`
- **Impact:** v1 audited the homepage only and missed this; it ships on every cell page (357k+ of them). It compounds two violations — cool-gray `bg-ink-50` (palette drift) and `backdrop-blur` (glassmorphism). On a sample like `/us/california/restaurants`, this sits directly under the header and above the hero, so it's the second visual band a reader meets.
- **Recommendation:** Drop `backdrop-blur`, swap `bg-ink-50/95` for `bg-cream-50` (no opacity needed). Optionally keep a `border-b border-parchment` for separation.

### N-2 (P1, layout): Two adjacent cream-50 sections on cell page break the alternation rhythm.
- **Location:** Cell page (`[country]/[geo]/[industry]/page.tsx:447-455` and `:460`)
- **Issue:** The `narrative` section was inserted between `hero` (ink-dark) and `revenue-tiles` with `SECTION_TONES["narrative"] = "cream-50"` and `SECTION_TONES["revenue-tiles"] = "cream-50"`. Rendered HTML confirms both sections are `bg-cream-50` — no visible break between them.
- **Impact:** The single thing the SECTION_TONES system is supposed to deliver is alternating bands. On the most-trafficked page type, it doesn't deliver across the narrative→tiles join. Reader sees a single cream band that's twice as tall as any other.
- **Recommendation:** Either change `narrative` to `cream-100` (slightly warmer, separates from the tiles below), or change `revenue-tiles` to `white` (cooler-than-cream-50, separates from the narrative above). The latter is preferable because it lifts the tiles visually and matches the existing `revenue-distribution = white` pattern (currently distribution uses `margin-waterfall`'s cream-100 token via a mapping note at `page.tsx:529`).

### N-3 (P2, theming): `border-slate-200/60` leakage on "Other industries in {region}" tile grid.
- **Location:** `src/app/[country]/[geo]/[industry]/page.tsx:587` (cell page bottom)
- **Class:** `block px-4 py-3 rounded-xl border border-slate-200/60 bg-white hover:border-atlas-500 transition`
- **Impact:** Same pattern in `browse/page.tsx:86` and `:150`. Three tiles per page using a generic-Tailwind cool gray border instead of the warm `parchment` token. Subtle but it breaks the consistency of every other border on the page.
- **Recommendation:** Find-and-replace `border-slate-200/60` → `border-parchment` across the three locations.

---

## 5. Top 10 remaining issues (severity-ranked)

### P0 — none remaining (v1 P0s all closed)

### P1 — major (fix before public ship)

1. **The cinematic-dark-hero pattern**. `src/app/page.tsx:68-108`. Pick one of the two viable directions ($impeccable shape hero). The hero card is now correct; the hero context is still the strongest AI-SaaS tell on the site.
2. **`DimensionSwitcher` sticky sub-nav backdrop-blur + ink-50 tone**. `DimensionSwitcher.tsx:65`. Ship on 357k+ cell pages. ($impeccable harden)
3. **Cell-page narrative + revenue-tiles share `bg-cream-50`** — alternation rhythm breaks on the highest-traffic page. Change one of the two tones in `SECTION_TONES`. ($impeccable craft)
4. **H2 color token inconsistency** — four `text-cocoa-900`, four `text-ink-900` across the homepage. Pick one. ($impeccable polish)
5. **Section padding rhythm** — `py-5`/`py-8`/`py-10`/`py-12` mixed in `page.tsx`. Standardize on two values (e.g., `py-10` content, `py-16` marquee). ($impeccable distill or $impeccable adapt)

### P2 — minor (fix in next pass)

6. **`RotatingWord` ignores `prefers-reduced-motion`**. `src/components/RotatingWord.tsx`. Trivial fix; accessibility-relevant. ($impeccable harden)
7. **`text-white` on amber CTAs** in 7+ components. Replace with `text-cream-50`. ($impeccable polish)
8. **`border-slate-200/60` leakage** in 3 locations. Replace with `border-parchment`. ($impeccable polish)
9. **`GlobalSearch` modal scrim uses `backdrop-blur-sm`**. `GlobalSearch.tsx:147`. Modal scrims are the most defensible glassmorphism case but doctrine still says solid. Replace with `bg-ink-900/55`. ($impeccable quieter)
10. **`bg-white/60` chips on SectorMasterMenu**. `SectorMasterMenu.tsx:60`. Solid `bg-cream-100` reads identical. ($impeccable polish)

### P3 — polish (nice-to-fix)

- Footer wrapper `bg-ink-100/40` (`layout.tsx:73`) — translucent again. Replace with `bg-cream-100`.
- Mobile section-h2 step contrast (24px h1 vs 24px h2 at sm — same step as v1).
- Cell page sub-nav wrap height on mobile (visible content shift below 380px).
- 17 homepage sections still 17 sections — distill or move to `/browse`.

---

## 6. Cell-page-specific score

Same dimensions as the homepage, scored on `/us/california/restaurants`:

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 3 | Heading hierarchy intact (h1 once, h2 multiple); good landmark structure; `DimensionSwitcher` selects have aria-labels. `RotatingWord` not on this page so motion issue n/a here. Cell-actions buttons (save, copy, etc.) need keyboard focus verification next pass. |
| 2 | Performance | 3 | RSC-rendered, ISR 6h. Narrative cache lookup is a JSON.parse at module load — fine at 2,259 entries. No layout thrash observed. Future scale risk if narrative cache hits ~30k entries (consider per-route split). |
| 3 | Responsive Design | 2 | `DimensionSwitcher` flex-wraps to 2-3 rows on mobile, eating above-fold height. The narrative section is `max-w-3xl` which is right; revenue tiles `grid grid-cols-1 md:grid-cols-3` is right. Sticky sub-nav vertical creep on iPhone-SE width is the live worry. |
| 4 | Theming | 3 | `border-slate-200/60` on related-cells tiles; `bg-ink-50` on sub-nav; narrative+tiles share `bg-cream-50` (alternation drift). Otherwise on-token. |
| 5 | Anti-Patterns | 2 | `backdrop-blur` on sub-nav. Comparable-cells tiles + related-industries strip + across-states strip are three identical-card grids in a row (`grid md:grid-cols-2 lg:grid-cols-3 gap-3`), all bottom-of-page. The narrative section above the tiles is genuinely good and differentiates this from a generic SaaS detail page. |
| **Total** | | **13/20** | **Acceptable, lower band of Good** |

**Overall flow read:** Hero (dark, atlas-300 accent on industry name) → narrative (cream-50, ~150 words, reads like a Bloomberg sidebar) → revenue-tiles (3 stat cards) → AtlasScore + tax-and-cost-panel → revenue-distribution (smooth log-normal curve) → across-states → related-cells → related-industries → correction form. The narrative-into-tiles read is **better** than v1 implied this template was — the new editorial paragraph gives the page a reason to exist beyond "here are some numbers." The bottom third (three back-to-back link-tile strips) is the weakest part of the cell flow.

---

## 7. Overall v2 score

| # | Dimension | v2 Score | v1 → v2 |
|---|---|---|---|
| 1 | Accessibility | 3 | 3 → 3 |
| 2 | Performance | 3 | 3 → 3 |
| 3 | Responsive Design | 3 | 2 → 3 |
| 4 | Theming | 3 | 2 → 3 |
| 5 | Anti-Patterns | 2 | 1 → 2 |
| **Composite** | | **14/20** | **11 → 14** |

**Rating band:** Good (14-17). Up one band from v1's Acceptable.

---

## 8. Honest verdict

**Is the site launch-ready?**

Yes, with one structural caveat.

The homepage has shed every P0 and most of the P1 leakage. The cell page (which v1 didn't audit) is in the same "Good" band as the homepage. The narrative shipping is the single biggest qualitative improvement — it gives every cell page a reason to be read, not just scanned. That single change moves the site from "yet another data-table-with-CTA SaaS" toward "small-business almanac." It is the differentiator the brand strategy promised.

**Where it still needs work before it scales:**

1. The cinematic-dark-hero is the one piece of design debt that will keep the homepage feeling derivative no matter how many other things get polished. Cell pages and country pages don't suffer from this because their heroes are correctly ink-dark editorial (no video, no centered translucent card, no rotating headline gimmick). The homepage hero is the outlier and the outlier reads more 2024-AI-tool than the rest of the site. **This is the one place a redesign cycle would pay back disproportionately.** Recommend running `$impeccable shape hero` before public launch — it doesn't need a full re-imagination, just a commit to one direction.

2. The two backdrop-blur instances (sub-nav + modal scrim) are not visible to most readers because they're conditional surfaces (modal triggered, sub-nav scrolled into), but they're brand-doctrine violations and easy fixes. Knock them out in the next polish pass.

3. The cell page's three back-to-back link-tile strips at the bottom are a real read-fatigue problem on lower-traffic cells where the data fan-out is leaner. Consider distilling to one (e.g., "Compare across states" only, with "Related industries" promoted to inline links in the narrative or absorbed into a single "Where else to look" card).

**No, the design does not need a full redesign cycle.** The brief is being executed. Wave 6b moved the needle 3 full points on a 20-point scale in one wave of fixes — that's the curve of a system that's close to right and just needs targeted polish, not a re-architecture. One more shape-and-polish pass on the homepage hero plus the four P1 issues above and the site is in the **17-18 / 20 "Excellent" band**, comfortably ready to ship publicly.

**The brand promise — "small-business almanac, not SaaS landing page" — is now ~75% visible. With the hero shape pass, it becomes ~95%.**

---

## 9. Recommended next commands (priority order)

1. **[P1] `$impeccable shape hero`** — commit to one of the two viable hero directions for the homepage. The single highest-leverage change remaining.
2. **[P1] `$impeccable harden`** — fix `DimensionSwitcher` backdrop-blur + ink-50 (1 file), `RotatingWord` reduced-motion (1 file), narrative/tiles tone collision in `SECTION_TONES` (1 file). Three concrete code fixes, no design judgment required.
3. **[P2] `$impeccable polish`** — H2 color inconsistency (homepage), `text-white` → `text-cream-50` (~7 files), `border-slate-200/60` → `border-parchment` (3 files), `bg-white/60` chips on SectorMasterMenu, footer `bg-ink-100/40`, GlobalSearch scrim. One sweep across ~15 files.
4. **[P2] `$impeccable distill`** — section padding rhythm in `page.tsx`; consider trimming 4-5 of the 17 homepage sections.
5. **[P3] `$impeccable adapt mobile`** — section-h2 sm sizing, DimensionSwitcher mobile-wrap height.

After all five, re-run `$impeccable audit` and the composite should land at 17-18/20.

---

## 10. Positive findings to preserve

- **Per-cell narrative shipped and reads well.** This is the single most distinctive thing the site does that no competitor does. Replicate the voice (opens with the SEO phrase pattern, 2 paragraphs, ~120-180 words, concrete numbers in the second sentence) across all 2,259 cells and extend to the remaining ~30k as data fills in.
- **Section-tone alternation system is now homepage-wide.** The `ToneBand` wrapper at `page.tsx:26-32` is a clean pattern — full-bleed background via `-mx-[50vw] w-screen` trick, inner content constrained. Reuse for any new page templates.
- **Cormorant Garamond via next/font** is correctly self-hosted with `display: swap` and CSS variable propagation. Hero h1 now has the broadsheet voice DESIGN.md asks for.
- **Numbered `<ol>` with leading-number column** ("What you'll see on every cell") is the right replacement for the three-identical-card grid. The two-column grid template (`grid-cols-[2.5rem_1fr]`) with hairline `divide-y divide-parchment` borders is a reusable editorial pattern — consider using it for "What's covered" lists on hub pages.
- **Cell-page hero in ink-dark with `text-atlas-300` accent on industry name** is a strong visual gesture and consistent across the cell page template.
- **`min-h-screen bg-cream-50`** on the body now correctly anchors the whole site to the warm cream base. The `--hero-fade` gradient under the page top renders as intended.

---

## 11. What to do with this audit

The founder will read this before any further redesign work. The audit is the new baseline. Re-run `$impeccable audit` after the P1 work lands and watch the score move toward 17-18.

> You can ask me to run the recommended commands one at a time, all at once, or in any order you prefer.
>
> Re-run `$impeccable audit` after fixes to see your score improve.
