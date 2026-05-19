# Impeccable Audit — Homepage v1

**Date:** 2026-05-19
**Auditor:** `impeccable audit` (Plan v14 Wave 6)
**Target:** `http://localhost:3001/` (rendered) and `src/app/page.tsx` (source)
**Context:** `PRODUCT.md` v1, `DESIGN.md` v1 (both at repo root, loaded via `load-context.mjs`)
**Scope:** Read-only diagnostic. No source files modified.
**Founder framing:** Be brutally honest. Don't soften the critique.

---

## TL;DR

The homepage is mid-Tier 1 craft executing a Tier 2 brand strategy. The earth-tone palette is real and the typography intent is right. But the page leaks **eight separate doctrine violations** that flatten the broadsheet voice into a mid-2024 SaaS landing aesthetic: a cinematic dark-hero with backdrop-blur glass card; gradient-bg-to-br on the spotlight component; em dashes (30 in the rendered HTML); `bg-white/60` and `bg-ink-100/30` translucency; identical card grids; the body class loads `bg-ink-50` which contradicts the `cream-50` page background DESIGN.md asserts; a broken Tailwind class (`parchment-100` — not declared); and a sticky header that's another `backdrop-blur` violation.

**The page is shippable today. It is not yet on-brief.**

---

## 1. Register check

**Page register: `brand`.** Confirmed against `PRODUCT.md`: the homepage is at `/`, default to brand. The route is editorial / marketing — it markets the site itself, not a product UI.

**Does the page read as brand?** Partly.
- The featured-cell tiles, the section-headline rhythm, the cream surfaces, and the amber-on-cocoa link tone all read brand. Good.
- The hero, however, reads **product-marketing landing page**. Big translucent hero card centered over a (planned) cinematic background video, a global search bar embedded in the card, big rotating headline. This is the visual grammar of every Series B SaaS site shipped between 2022 and 2026. The brand register the rest of the page is trying for gets undercut in the first 600px.

**Verdict:** Register-intent right, register-execution wrong above the fold.

---

## 2. Color strategy check

**DESIGN.md asserts:** Restrained — tinted cream neutrals + one accent (atlas amber) on ≤10% of surface.

**What the page actually uses:** Mostly Restrained, with two leakages:

1. **Hero uses Drenched (involuntarily).** The hero is `bg-ink-900` full-bleed, 80vh, with a planned background video at `opacity-60`. That's not Restrained — that's the surface drenched in one color (ink-900) plus a competing visual surface (video). It violates the Single Dark Surface Rule in spirit even though it technically obeys it: one section, yes, but the section is so large and so cinematic it owns the entire above-the-fold experience.

2. **SpotlightCountry uses Full Palette (involuntarily).** `bg-gradient-to-br from-cream-100 via-cream-50 to-parchment-100` — that's a 3-color gradient. Restrained palettes don't gradient between three neutrals as a surface treatment. Also, `parchment-100` is not defined in `tailwind.config.ts` (only flat `parchment`), so this class renders as `undefined` and silently degrades to the previous fallback. **Broken class.**

**Verdict:** The right strategy was chosen; the hero and one component disobey it. Easy to fix.

---

## 3. Layout audit

### Card density and rhythm
The page has roughly **17 distinct sections** stacked vertically: hero, navigator + first-frame strip, coverage strip, recently-added, featured cells (12 tiles), spotlight country, sector menu, cell-of-the-week, tax overlay, ask widget, city picker, quality legend, stats strip, what-you'll-see (3 cards), what's-hot, newsletter. That's a content firehose with no breathing room between content modules.

The `SECTION_TONES` system from `src/lib/page-layout/section-order.ts` only covers cell, country, and industry pages — **the homepage does not get the alternating tone treatment** the design system designed for it. Every homepage section instead defaults to the body's `bg-ink-50` (which is ALSO wrong — see below).

### Spacing rhythm
- Mixed `py-6`, `py-8`, `py-10`, `py-12` across sections with no apparent rule. The "Featured cells" section uses `py-6`; "What you'll see" uses `py-10`. There's no consistent vertical-rhythm token. The DESIGN.md `spacing.lg = 40px` and `spacing.xl = 80px` aren't enforced.
- "Start with something familiar" headline (`mb-4`) sits 4px above its paragraph (`mb-6`) — tight enough to feel cramped given the surrounding `py-6` section padding.

### Hierarchy
- Three different H2 sizes: `text-xl md:text-2xl`, `text-2xl md:text-3xl`, sometimes with `tracking-tight`, sometimes not. No single canonical H2.
- Some H2s are `text-ink-900`, some are `text-cocoa-900`. Pick one.

### The body class problem (P0)
`<body class="min-h-screen bg-ink-50 text-ink-900 font-sans">` — the body sets `bg-ink-50`. But `globals.css` sets `--background: #FEFBF6` (cream-50) and applies it to `html { background: var(--background); }`. **The body's `bg-ink-50` overrides this**, meaning the page actually renders against `#FAFAF7` (warm off-white), not cream-50. The hero-fade gradient from globals.css starts from `cream-100` and fades to a background the body is hiding. This contradicts DESIGN.md and the warm-page-cream doctrine.

---

## 4. Typography audit

**Scale ratio.** Step contrast varies. The display-class hero is `text-2xl sm:text-3xl md:text-5xl lg:text-6xl` (24px → 60px); section H2 is `text-2xl md:text-3xl` (24px → 30px). The ratio from h2 to body (15px) is ~2.0x, healthy. The ratio from h1 to h2 at desktop is 60/30 = 2.0x, also healthy. Mobile: h1 24, h2 24 — **same size**. The hero and the section headlines collapse at sm breakpoint. That's a hierarchy failure on mobile.

**Line lengths.** "Twelve cells most people recognize on sight..." paragraph uses `max-w-2xl` (672px / ~70ch at 15px). On brief.

**Weight contrast.** Almost everything is `font-semibold` (600) — H1, H2, tile titles, stat numbers, label eyebrows. The body is `font-normal` (400). One contrast step (400 → 600), no 500 in between. Body and headlines feel like two different documents. Add a 500 mid-tier (or shift label eyebrows to medium) to break the binary.

**The Display-Serif-for-Editorial Rule, violated.** The hero headline ("How much does a coffee shop make in Lisbon?") is in Inter. DESIGN.md says editorial moments get Tiempos. The hero of the homepage IS an editorial moment — it's the question the site exists to answer. Wrong font.

**Tabular numbers.** Properly applied throughout. The stat strip, the cell tiles, the spotlight country — all `tabular-nums`. Good.

---

## 5. Motion audit

### The rotating headline (Wave 4e)
- **Duration:** 300ms transition for the word swap; 2000ms interval; 250ms phase-out delay between word changes. Total cycle: ~2.5s per word.
- **Easing:** `ease-out` (Tailwind default — `cubic-bezier(0, 0, 0.2, 1)`).
- **Motion technique:** `translate-y-2` (8px) + opacity 0 → 100. CSS transforms only. No layout property animation.
- **`prefers-reduced-motion` handling:** Not implemented. The `RotatingWord` component animates regardless of OS setting. Other animations (hero rise in `globals.css`, card hover) properly gate on `@media (prefers-reduced-motion: no-preference)`. The hero rotator does not.

**Verdict on easing/duration laws:**
- Don't animate layout properties: PASS (transform only).
- Ease out with exponential curves (quart/quint/expo): MILD FAIL — Tailwind's default `ease-out` is cubic, not exponential. Visually fine but per-doctrine, swap for `ease-[cubic-bezier(0.16,1,0.3,1)]` (matches the hero-rise keyframe).
- No bounce, no elastic: PASS.
- `prefers-reduced-motion`: FAIL.

### Hero-rise headline animation
`globals.css` keyframes h1 (480ms) and h1+p (480ms with 120ms delay) on page load. Easing `cubic-bezier(0.16, 1, 0.3, 1)` — exponential out. Properly gated on `prefers-reduced-motion`. Good — keep.

### Card hover
`transform: translateY(-1px)` + warm-tinted shadow. 180ms ease-out. Properly gated. Good.

### Sticky header backdrop-blur
`bg-ink-50/85 backdrop-blur sticky` — the backdrop-blur is not strictly motion, but it's the same anti-pattern: a decorative blur surface. See "Absolute bans check" below.

---

## 6. AI slop test

### First-order (category-reflex)
**Could someone guess the theme + palette from the category alone?**
- Category: "global business statistics / benchmarks site."
- Naive reflex: dark navy + white + a "data-blue" accent, or a corporate cream-and-deep-green annual-report look.
- Atlas's actual choice: warm earth-tone cream paper + burnt amber. **PASS first-order.** The cream-amber direction is intentionally not the category reflex.

### Second-order (anti-reference reflex)
**Could someone guess the aesthetic from "small-business benchmarks NOT navy-and-blue"?**
- Likely reflexes after the first dodge: warm cream + serif headline + amber accent (the "Mailchimp / Stripe-ish" earth-tone wave of 2022-2024); OR editorial-magazine masthead in deep red + cream; OR Bloomberg-style terminal-but-with-personality.
- Atlas's actual choice: warm cream + amber. **PARTIAL FAIL on second-order.** This IS one of the predicted second-order reflexes. The page does not yet feel distinct enough from "post-Stripe earth-tone fintech." The serif promise (Tiempos) is what would push it further into editorial-broadsheet territory and away from the saturated lane — and the homepage doesn't ship Tiempos in the hero.

### Specific AI tells observed
1. Hero with cinematic background video and centered translucent card: **classic 2024 AI-tool landing reflex.**
2. Three-card "What you'll see on every cell" grid with eyebrow-label + bold title + body text: **classic AI / SaaS feature-card pattern.**
3. `text-white` on the navigator-form button: AI-defaults reflex (against the "no pure white" rule).
4. `bg-white/60` on the country-tag pill inside featured tiles: AI translucent-chip reflex.
5. Rotating-word hero copy: very-2023 SaaS landing-page move; works here because the rotation IS the product, but it's a tell.

**Verdict:** Page passes first-order, partially fails second-order. The fix is to lean harder into the broadsheet promise (Tiempos in the hero, alternating section tones on the homepage, kill the dark-hero cinematic).

---

## 7. Absolute bans check

| Ban | Status | Where |
|---|---|---|
| Side-stripe borders (`border-l` > 1px as colored accent) | **PASS** | Not observed in homepage tree. |
| Gradient text (`bg-clip-text` + gradient) | **PASS (tolerated exception)** | Only in `.gradient-name` on founder wordmark, per DESIGN.md exception. |
| Glassmorphism as default | **FAIL** | (a) Hero card: `bg-cream-50/85 backdrop-blur-md border border-cream-200/50 rounded-3xl shadow-lg`. (b) Sticky header: `bg-ink-50/85 backdrop-blur sticky`. Two separate violations. |
| Hero-metric template (big number + small label + supporting stats + gradient) | **NEAR-FAIL** | The "Stats strip" (`191 countries / 180+ industries / 357k+ cells / Free`) is the closest the system gets. DESIGN.md tolerates this exactly once. Don't repeat it. |
| Identical card grids | **FAIL** | "What you'll see on every cell" is three identical cards with eyebrow + title + body. The pattern is the cliché DESIGN.md flagged. |
| Modal as first thought | **N/A** | `GlobalSearch` is a `Cmd+K`-triggered overlay; legitimate use. |
| Em dashes anywhere | **FAIL** | 30 em dashes (`—`) in rendered HTML. One confirmed in user-visible body copy: `page.tsx:189` "Every cell shows the spread — what the smallest businesses make." Others in source-only JSX comments (don't render) but several render through child components. This is a P0 site-rule violation. |
| First-person voice | **TO VERIFY** | Did not exhaustively scan; spot check on page.tsx clean. |

---

## 8. Severity-ranked issue list

### P0 — Blocking (fix before any redesign work)

1. **Body `bg-ink-50` overrides `cream-50` page background.**
   *Location:* `src/app/layout.tsx` (body className).
   *Impact:* Entire site renders against the wrong page color. `globals.css` sets `--background: #FEFBF6` and the hero-fade gradient assumes that base; body's `bg-ink-50` makes it moot. The page looks 8% colder than DESIGN.md says it should.
   *Fix:* Remove `bg-ink-50` from body; let `html { background: var(--background) }` win. Verify hero-fade still renders.

2. **Broken Tailwind class `parchment-100` in SpotlightCountry.**
   *Location:* `src/components/SpotlightCountry.tsx:149`.
   *Impact:* Class is undefined in `tailwind.config.ts`. Silently degrades to no value. Gradient renders as a 2-stop fade instead of 3. Visual: the spotlight box looks washed out and off-brand.
   *Fix:* Either add `parchment-100/200/...` scale to tailwind config, or rewrite the gradient with the existing single `parchment` value.

3. **Em dashes in user-visible copy.**
   *Location:* `src/app/page.tsx:189` ("Every cell shows the spread — what the smallest businesses make") plus an unknown count in child components rendering to 30 total em dashes in HTML.
   *Impact:* Hard violation of the site's central typographic rule (Section 10 of the editorial style guide).
   *Fix:* Find-and-replace `—` with `;` or `.` or `,` across all user-facing copy. Source-comment em dashes are fine (they don't render).

### P1 — Major (fix in next pass before public ship)

4. **Hero glassmorphism: hero card uses `backdrop-blur-md` over a (planned) cinematic background video.**
   *Location:* `src/app/page.tsx:53-93`.
   *Impact:* The dual violation — glass card + cinematic city-skyline b-roll — is the single most "this looks AI-generated" element on the page. The hero card is what readers see first, and it currently looks more like a 2024 AI-tool marketing page than an editorial briefing.
   *Recommendation:* Two options. (a) **Quieter:** kill the video, replace hero with cream-paper editorial masthead in Tiempos serif. Solid surfaces only. (b) **Reframe:** if the dark-hero stays, the card goes solid cream (`bg-cream-50`, no blur, no translucency) and the video stays. Pick one. Currently both choices are half-made.

5. **Sticky header backdrop-blur.**
   *Location:* `src/app/layout.tsx` (header).
   *Impact:* Second glassmorphism violation. Less critical than the hero card but the same pattern.
   *Fix:* Change to a solid `bg-cream-50` with a 1px parchment border-bottom. Sticky headers don't need to feel like Apple's marketing pages.

6. **Identical card grid in "What you'll see on every cell."**
   *Location:* `src/app/page.tsx:175-221`.
   *Impact:* The three-card pattern (amber eyebrow + bold title + body paragraph) is exactly the SaaS-feature-card cliché DESIGN.md flagged. Three cards. All identical structure. All identical size. All identical visual weight.
   *Fix:* Rewrite as editorial paragraph form with three small inline figures, or as a single horizontal scroller with asymmetric card sizes, or as a left-column heading + right-column three-paragraph essay. Anything but three identical cards.

7. **Hero headline in Inter, not Tiempos.**
   *Location:* `src/app/page.tsx:70` (`<h1 className="...font-semibold...">`).
   *Impact:* DESIGN.md's Display-Serif-for-Editorial Rule says the hero headline of editorial pages gets Tiempos. The homepage hero IS the editorial moment of the site.
   *Fix:* Add `font-serif` to the h1, verify Tiempos loads, recheck rotating-word visual weight in the serif tier.

8. **No homepage section-tone alternation.**
   *Location:* Throughout `src/app/page.tsx`.
   *Impact:* The `SECTION_TONES` system exists for cell/country/industry pages but does nothing on the homepage. Every section sits on the same body background. The "rhythm via alternating cream / white / cream-100" doctrine from DESIGN.md is unimplemented here.
   *Fix:* Add explicit section-level backgrounds: hero = ink-dark, then alternate cream-50 / white / cream-100 down the page. Or commit to all-cream and rely on hairlines for rhythm. Currently neither.

### P2 — Minor (fix when convenient)

9. **`text-white` on the navigator-form primary button.**
   *Location:* `NavigatorForm.tsx` (the visible CTA button class includes `text-white`).
   *Impact:* Violates DESIGN.md's no-pure-white rule. On burnt-amber `bg-atlas-500`, `text-cream-50` (#FEFBF6) would be perceptually identical and on-doctrine.
   *Fix:* Replace `text-white` with `text-cream-50` across all button instances.

10. **Inconsistent H2 color: `text-ink-900` vs `text-cocoa-900`.**
    *Location:* Several H2 headlines across the homepage.
    *Impact:* Visual inconsistency. Two different "dark text" colors used apparently at random.
    *Fix:* Pick one. DESIGN.md implies `text-ink-900` is the canonical primary text. Make all H2s use it.

11. **Inconsistent section vertical padding (`py-6`, `py-8`, `py-10`, `py-12`).**
    *Location:* Throughout `page.tsx`.
    *Impact:* No discernible rhythm. Sections feel arbitrarily packed.
    *Fix:* Standardize on two values (e.g. `py-10` for content sections, `py-16` for marquee sections). Document the rule in DESIGN.md spacing section.

12. **Mobile H1/H2 collapse.**
    *Location:* Hero h1 (`text-2xl sm:text-3xl`), section h2 (`text-2xl md:text-3xl`). At sm, both are 24px.
    *Impact:* Mobile reader loses scroll hierarchy. Everything reads as "title weight."
    *Fix:* Hero h1 at sm should be `text-3xl` minimum; section h2 should stay at `text-xl` on sm to maintain step-down.

13. **`RotatingWord` doesn't respect `prefers-reduced-motion`.**
    *Location:* `src/components/RotatingWord.tsx`.
    *Impact:* Accessibility / motion sensitivity. Other animations in the system gate; this one doesn't.
    *Fix:* Gate the interval and the transform on `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. When reduced, show a single randomized word or the first word, no animation.

### P3 — Polish (nice-to-fix)

14. **`bg-white/60` translucent chip on featured tiles.**
    *Location:* `FeaturedCellTile`-adjacent component (year-tag pill).
    *Impact:* Minor glassmorphism leakage. Solid `bg-cream-100` reads the same.

15. **Newsletter card `bg-ink-100/30` translucency.**
    *Location:* page.tsx, newsletter wrapper.
    *Impact:* Another translucent-surface leakage. Use solid `bg-cream-100`.

16. **Stat strip is the hero-metric template's last tolerable instance.**
    *Location:* `page.tsx:161-173`.
    *Impact:* DESIGN.md tolerates this exactly once. It's tolerated here, but should not be repeated on any future page. Flag for tracking only.

17. **17 sections is a lot.**
    *Location:* `page.tsx` as a whole.
    *Impact:* The page is exhaustive but not selective. A homepage that tries to surface every entry point ends up as a sitemap with cards. Consider whether half these strips should move to `/browse` or `/world`.

---

## 9. Patterns and systemic issues

- **Translucent surfaces appear in 5+ places** (hero card, sticky header, year-tag chip, newsletter card, navigator-form button shadows). The doctrine is "solid surfaces"; the code drifted. One systemic find-and-fix.
- **Border colors are sometimes `parchment`, sometimes `cream-300`, sometimes `cream-200/50`, sometimes `cocoa-700/10`, sometimes `ink-200`.** No canonical border-color token. Pick two (parchment for warm borders, ink-200 for darker dividers).
- **The body class fighting the `--background` CSS variable** is exactly the kind of design-system drift that happens when global CSS is set in two places at once. Consolidate on one source of truth (probably `globals.css`).
- **Em dashes in source code comments are harmless; em dashes in JSX text are P0.** A simple ESLint rule (`no-restricted-syntax` matching em-dash-in-JSXText) would prevent regression.

---

## 10. Positive findings (keep, replicate)

- **Tabular numbers used consistently.** Every figure on the page locks vertically. This is rare in fintech sites and excellent here.
- **Featured cell tiles are the strongest visual element on the page.** Clean cream surface, parchment border, amber on hover, flag + region + denomination. This is the brand voice executed correctly. Replicate this treatment elsewhere.
- **The `.card` resting/hover shadow values are properly warm-tinted** (`rgba(76, 39, 18, 0.04)` / `rgba(120, 53, 15, 0.08)`). No cool gray shadows. Good.
- **The "no Coming soon, render nothing" doctrine is properly enforced** in `FeaturedCellTile` (returns `null` when data is missing). This is the right philosophy.
- **Hero-rise keyframe animation uses the right exponential ease and respects `prefers-reduced-motion`.** This is the canonical motion pattern for the site; document and replicate.
- **Country flags use Twemoji fallback** so Windows clients don't get text pairs. Real attention to cross-platform detail.

---

## 11. Recommended commands (priority order)

1. **[P0] `$impeccable harden`** — fix the body-background bug, the broken `parchment-100` class, and the em-dashes-in-rendered-HTML site-rule violation. Three concrete code-level fixes with zero design judgment required.

2. **[P1] `$impeccable shape hero`** — before any redesign of the homepage hero, run shape to commit to one of the two viable directions (quiet editorial masthead vs solid-cream-card-over-dark-video). The current half-glass-half-cinema is the worst of both.

3. **[P1] `$impeccable distill layout`** — apply to `page.tsx`. The page has 17 sections; the brief is "every gap must feel intentional." Distill should strip the noise (probably 4-5 strips that could live elsewhere) and let the remaining sections breathe.

4. **[P1] `$impeccable typeset hero`** — promote the hero h1 to Tiempos and confirm the rotating word's visual weight survives the font shift. May need to adjust `font-weight` from 600 to 500 in the serif tier.

5. **[P1] `$impeccable adapt mobile`** — fix the H1/H2 collapse at the sm breakpoint, retune the section-padding rhythm on mobile.

6. **[P2] `$impeccable craft section-tone`** — extend `SECTION_TONES` to cover homepage sections and apply the alternating cream-50 / white / cream-100 rhythm the cell-page system already has.

7. **[P2] `$impeccable clarify what-youll-see`** — rewrite the three-identical-card grid as something that isn't three identical cards. Editorial-paragraph form with three inline figures is the most likely answer.

8. **[P3] `$impeccable polish`** — final pass for all the translucency and inconsistent-color leakage, after the structural work above lands.

---

## 12. Audit Health Score (impeccable framework)

| # | Dimension | Score | Key Finding |
|---|---|---|---|
| 1 | Accessibility | 3 | `RotatingWord` ignores prefers-reduced-motion; otherwise clean. Verify text contrast ratios next pass. |
| 2 | Performance | 3 | Server-rendered, no obvious bundle/animation hot spots. Future video hero needs scrutiny. |
| 3 | Responsive Design | 2 | H1/H2 collapse at sm; rhythm of vertical padding inconsistent. |
| 4 | Theming | 2 | Body bg fights `--background`; broken `parchment-100`; mixed border colors. Tokens exist, application drifted. |
| 5 | Anti-Patterns | 1 | Hero glassmorphism + cinematic b-roll + identical-card grid + em dashes + sticky-header blur. 5 distinct AI/SaaS tells. |
| **Total** | | **11/20** | **Acceptable — significant work needed.** |

The score is harder on Anti-Patterns than on the rest because the brand register stands or falls on those tells. Fix the five tells and the score jumps to ~15-16 with zero structural change.

---

## 13. What to do with this audit

The founder will read this before any redesign begins. The audit is the baseline. Re-run `$impeccable audit` after the P0/P1 work lands and watch the score move.

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run `$impeccable audit` after fixes to see your score improve.
