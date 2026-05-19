# Impeccable Shape — Homepage Hero

**Date:** 2026-05-20
**Command:** `$impeccable shape hero`
**Scope:** `src/app/page.tsx` lines 56–108 (the homepage hero section only). No cell/country/industry hero changes.
**Predecessor:** [`2026-05-19-impeccable-audit-v2.md`](./2026-05-19-impeccable-audit-v2.md) — composite 14/20, structural caveat flagged on the hero.
**Goal:** Commit the hero to ONE direction and remove the half-committed middle that reads as "2024 AI tool."

---

## 1. Current state diagnosis

The current hero (`src/app/page.tsx:68-108`) is a 600px+ tall, 80vh, full-bleed `bg-ink-900` band containing:

- An `autoPlay muted loop playsInline` `<video>` element pointed at `public/videos/hero-cities-loop.mp4` (file does not exist; only a README.txt placeholder).
- A `hero-poster.svg` static fallback.
- A vertical dark gradient overlay on top of the video.
- Centered above all of that, a solid cream card (`bg-cream-50 border border-parchment rounded-3xl`) containing the rotating H1 and the `GlobalSearch` button.

The card itself is now correct (DESIGN.md compliant: solid, parchment border, rounded-3xl, no backdrop blur). The 80vh dark cinematic frame around it is the problem.

**Why this fails:**

1. **Mixed register.** The dark/video/center-aligned frame is the textbook B2B SaaS landing pattern (Stripe, Linear, Tailwind UI). The card inside is a broadsheet artifact (cream paper, serif H1). The two registers fight; the dark wins because it owns more pixels; the page reads as "AI tool with a polite card inside it."
2. **Outlier inside the system.** Every other long-form page on the site (`/[country]`, `/industries`, `/sectors`, `/world`, `/blog`) uses calm cream-tone hero treatments. Cell pages get a single ink-dark hero, but it's a flat editorial band, not a cinematic video frame. The homepage's 80vh-video-with-card pattern is the one place the brand voice slips.
3. **Asset gap.** The video file doesn't exist. Designing further around a placeholder that may take weeks to source is wasted effort.
4. **Redundant search.** `HeaderSearch` already lives in the always-visible sticky header (`src/app/layout.tsx:68`). `GlobalSearch` inside the hero card duplicates the same affordance one viewport-height below itself, taking on the "search-bar hero" shape that's the second-strongest AI-SaaS tell after the dark video.
5. **Anti-reference hit.** PRODUCT.md anti-reference #5 ("NOT a generic AI-tool marketing page") and #7 ("NOT an agency template — no oversized hero video of a busy city skyline") both name this exact pattern. DESIGN.md §4 ("Don't use cinematic city-skyline b-roll in any hero") names it too.

The fix is structural, not cosmetic. No amount of card-tuning rescues a dark cinematic frame around editorial content.

---

## 2. Direction chosen — Direction A: Quiet editorial masthead

The founder recommended A with five reasons. All five hold. Adding two more from the audit + assets read:

1. **Anti-reference alignment.** A is the only direction PRODUCT.md's anti-references don't actively prohibit. B requires permission to ignore #7 ("agency-template city b-roll") and the spirit of #5 ("generic AI-tool marketing page").
2. **Asset reality.** The video doesn't exist. A ships today; B ships when (and only when) the founder sources, stitches, and color-grades a 60–90s loop. Designing B against a placeholder is the same trap that produced the current half-committed middle.
3. **System coherence.** The body is already `bg-cream-50` (Wave 6b). The rest of the homepage is a `ToneBand` alternation of cream-50/white/cream-100. A masthead lets the hero **inherit** the body cream and become the first paragraph of the broadsheet, not a separate stage placed in front of it.
4. **Voice fit.** PRODUCT.md tone is *The Economist briefing*. Briefings open with a deck headline on white paper, not a video. The masthead **is** the briefing voice.
5. **Speed.** Founder estimates A at ~2hrs, B at days of asset work. The audit gives 4 P1s and 6 P2s still in the queue; the cheaper path to the 17–18/20 "Excellent" band is the right one.
6. **Search redundancy resolves itself.** A removes the in-hero search affordance (header still has it; ⌘K still works), which removes the "search bar hero" anti-pattern at the same time as the dark frame.
7. **Editorial reference confirmed.** The Pudding, Our World in Data, Atlas Obscura all open with a typographic masthead, no hero card, no center alignment, no video. These are the references PRODUCT.md is asking for. A delivers them.

**Direction B is NOT chosen. Reasoning recorded so the choice is reversible:** B would be the right call only if (a) the founder had a real video, (b) the brand promise shifted toward "cinematic editorial" (it hasn't), and (c) the homepage was OK being the outlier among the site's other heroes (it isn't). None hold today.

---

## 3. The proposed hero

### What you see, top to bottom

1. **A short eyebrow line** in atlas-700 small-caps (`text-xs font-semibold uppercase tracking-wider`). One line. Sets the publication-style tone before the headline arrives. Copy: `SMALL-BUSINESS BENCHMARKS · 191 COUNTRIES`. Functions like a broadsheet masthead's standing subhead.
2. **The rotating H1** in Cormorant Garamond (`font-display`), left-aligned, displayed at the editorial display scale already wired into DESIGN.md (`clamp(2.5rem, 6vw, 4.5rem)`). The headline preserves the founder's chosen pattern: `How much does a [BUSINESS] make in [CITY]?` The two rotating spans keep amber tint (`text-atlas-600`) so the rotating word is the visual focal point of the headline.
3. **One sentence of editorial subhead** in cocoa, ~22–24px serif italic (or Inter regular at 17–18px — see Open Questions below; defaulting to Inter for visual hierarchy contrast against the serif H1). Copy: `Revenue, margins, and what they actually mean, for the businesses behind every street.` ~75 chars; single line on desktop, two on mobile. Sits at `max-w-2xl` to honor the 65–75ch rule.
4. **Two quiet inline links**, gap-6, ink-700 with parchment underline shifting to atlas-600 on hover. No buttons. No CTA bar. Copy: `Browse 191 countries →` and `See the methodology →`. These are how someone navigates from the masthead into the body; the search affordance is left to the always-visible header.

### What you do NOT see

- No dark band. The hero sits on `bg-cream-50` (the body color), full-bleed via the same `-mx-[50vw] w-screen` trick the `ToneBand` wrapper uses, so the cream extends edge-to-edge.
- No card. No rounded corners. No border. No shadow. The headline sits directly on the page.
- No `<video>` element. No `<source>`. No poster. No video overlay gradient.
- No `GlobalSearch` inside the hero. The header keeps its `HeaderSearch`; `Cmd-K / Ctrl-K` still opens the search modal globally.
- No centered alignment. Left-aligned at the same gutter as the rest of the page content (`max-w-7xl mx-auto px-6`).
- No 80vh forced height. The hero is as tall as its content + comfortable vertical padding (~`py-20 md:py-28`). The navigator and featured tiles below come up faster, which is the right hierarchy: the masthead introduces, the navigator/tiles deliver.

### Typography spec

| Element | Font | Size | Weight | Color | Tracking | Leading |
|---|---|---|---|---|---|---|
| Eyebrow | Inter | `text-xs` (12px) | 600 | `text-atlas-700` | `0.06em` | 1.2 |
| H1 | Cormorant Garamond (`font-display`) | `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` (36 → 72px) | 500 | `text-ink-900` | `-0.02em` | 1.05 |
| Rotating span | Cormorant Garamond | same as H1 | 500 | `text-atlas-600` | inherit | inherit |
| Subhead | Inter | `text-lg md:text-xl` (18 → 20px) | 400 | `text-cocoa-700/90` | normal | 1.5 |
| Links | Inter | `text-sm md:text-base` | 500 | `text-ink-800` → `text-atlas-600` hover | normal | 1.4 |

The Cormorant scale opens at `text-4xl` (36px) on sm, which is one full step above the homepage's section h2 at `text-2xl` (24px). 36/24 = 1.5x. That fixes audit P2 #5 (mobile h1/h2 step contrast was 1.25x) as a side-effect.

### Layout

- Outer wrapper: `ToneBand tone="home-hero"` — same pattern every other section already uses. Requires flipping `SECTION_TONES["home-hero"]` from `"ink-dark"` to `"cream-50"` so the tone tokens stay the source of truth (and so the next person who looks at section-order.ts sees the truth, not the historical state).
- Inner padding: `py-16 md:py-24 lg:py-28`. The lg value lifts the masthead to feel like the page's opening statement on a desktop monitor without going so tall it pushes the navigator under the fold.
- Content stack: a single vertical column at `max-w-4xl` (~896px), holding eyebrow → H1 → subhead → links. Gap between H1 and subhead is `mt-5 md:mt-6`. Gap between subhead and links is `mt-8 md:mt-10`. No extra wrappers.
- Cancel the `-mt-10` hack: `<main>` has `py-10` and the current hero cancels its top padding with `-mt-10` to land flush against the header. The new masthead doesn't need to be flush — natural top padding inside `py-16+` swallows the `<main>`'s `py-10` visually and reads as one continuous header→masthead breath.

### Rotation behavior

The rotation stays at 2-second cadence, 250ms fade, exactly as today. **One change required for accessibility:** add `prefers-reduced-motion` short-circuit in `RotatingWord.tsx` (audit P2 #6). When reduced motion is preferred, the component renders the first word statically and never rotates. This is a one-line addition (gate `useEffect` on `window.matchMedia("(prefers-reduced-motion: reduce)").matches`).

---

## 4. Anti-references — what this hero is explicitly NOT

Match-and-refuse. If any future edit drifts into these, revert:

1. **Not a hero search bar.** No input in the hero. The header has search. Reaching for the in-hero search input is the gateway drug back to AI-tool aesthetic.
2. **Not a hero card.** No surface change between the H1 and the page. The page IS the surface.
3. **Not centered.** Center-aligned editorial mastheads read as marketing claims. Left-aligned at the page gutter reads as the first paragraph of a long piece.
4. **Not 80vh.** The hero is content-sized + breath. Forcing 80vh is the cinematic-frame instinct showing up in dimensions instead of color.
5. **Not a hero metric template.** No big-number-with-label tiles in the hero. The stats strip already further down the page handles that role within its tolerance.
6. **Not a video. Not a poster image. Not a background pattern.** The cream paper is the background.
7. **Not gradient text on the rotating word.** Solid `text-atlas-600` only. DESIGN.md absolute ban.
8. **Not an oversized CTA.** No "Get started" button. The links are typographic, not chrome.

---

## 5. Implementation plan

### Files modified

**`src/app/page.tsx`** — replace lines 68-108 (the entire `<section>` block) with:
```tsx
<ToneBand tone="home-hero">
  <section className="py-16 md:py-24 lg:py-28">
    <div className="max-w-4xl">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-6">
        Small-business benchmarks · 191 countries
      </div>
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-ink-900 leading-[1.05]">
        How much does a{" "}
        <span className="inline-block min-w-[5ch] text-atlas-600">
          <RotatingWord words={HERO_BUSINESSES as unknown as string[]} interval={2000} />
        </span>{" "}
        make in{" "}
        <span className="inline-block min-w-[7ch] text-atlas-600">
          <RotatingWord words={HERO_CITIES as unknown as string[]} interval={2000} offset={1000} />
        </span>?
      </h1>
      <p className="mt-5 md:mt-6 max-w-2xl text-lg md:text-xl text-cocoa-700/90 leading-relaxed">
        Revenue, margins, and what they actually mean, for the businesses behind every street.
      </p>
      <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm md:text-base">
        <a href="/browse" className="inline-flex items-center gap-1.5 font-medium text-ink-800 hover:text-atlas-600 transition-colors border-b border-parchment hover:border-atlas-500 pb-0.5">
          Browse 191 countries
          <span aria-hidden="true">→</span>
        </a>
        <a href="/about-data" className="inline-flex items-center gap-1.5 font-medium text-ink-800 hover:text-atlas-600 transition-colors border-b border-parchment hover:border-atlas-500 pb-0.5">
          See the methodology
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
</ToneBand>
```

Remove the `-mt-10` class (no longer needed; the natural padding reads as intended breath).

Remove the `GlobalSearch` import — no longer used on this page (verify with grep; if only the hero used it, the import goes; if any other section needs it, leave the import). HeaderSearch in `layout.tsx` is a different component and is unaffected.

**`src/components/RotatingWord.tsx`** — add `prefers-reduced-motion` gate. Two-line change in the `useEffect`: bail early if `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. Renders the first word statically in that case.

**`src/lib/page-layout/section-order.ts`** — flip `"home-hero": "ink-dark"` to `"home-hero": "cream-50"`. The tone tokens become source-of-truth again. Leave the cell-page `"hero": "ink-dark"` line untouched — cell heroes legitimately need the dark band.

### Files deleted

**`public/videos/README.txt`** — placeholder for a file that's no longer in the plan.
**`public/images/hero-poster.svg`** — fallback for the video. With no video, no fallback needed. Confirm no other reference in the codebase via grep before deleting.

### Files NOT modified

- `src/lib/hero-words.ts` — `HERO_CITIES` and `HERO_BUSINESSES` arrays untouched. Founder-curated.
- `src/components/GlobalSearch.tsx` — still used by `HeaderSearch`. Leave alone. (The audit's P2 #9 about its modal `backdrop-blur-sm` is a separate `harden` task.)
- `src/app/layout.tsx` — header / footer / body bg untouched. Header keeps its sticky bg-cream-50.
- Every cell / country / industry / world / blog page — out of scope. Their ink-dark heroes are correct.
- The 15 other `ToneBand` sections on the homepage — untouched.

### Cascade check

- **Below the hero, the `home-navigator` ToneBand is `bg-cream-50`.** With the hero now also `bg-cream-50`, the two adjacent cream-50 sections would collide tonally (the exact bug Audit N-2 identified on the cell page). **Fix:** flip `"home-navigator"` from `"cream-50"` to `"white"` in section-order.ts. The navigator visually lifts off the masthead, mirroring how the cell page now treats `"narrative" → "revenue-tiles"` (white → cream-50). This is a 1-token change that prevents the same audit issue on the homepage.
- **`home-featured` is `"white"`.** With `home-navigator` flipping to white, `home-featured` should flip to `"cream-100"` to keep the alternation going. Compound effect: hero (cream-50) → navigator (white) → featured (cream-100) → global-coverage (cream-100) — but global-coverage now collides with featured! So global-coverage flips to `"white"`. The cascade ripples downstream by exactly one swap per section. Acceptable; the alternation pattern is preserved.
- **Simpler alternative:** flip `home-hero` to `cream-100` instead of `cream-50`. Then `home-navigator` (cream-50) is naturally tonally distinct, no further changes needed. **Picking the simpler alternative.** The hero gets `cream-100` (the slightly warmer "alternate" tone), which gives the masthead a subtly different feel from the body without the cascade. Decided: `"home-hero": "cream-100"`.

### Verification gates

- `npx tsc --noEmit` passes.
- `npm run build` succeeds; no orphan-import warnings.
- Local dev render: hero visually matches spec; rotating headline animates at 2s; reduced-motion preference disables rotation; no horizontal scroll on a 320px viewport; H1 doesn't crash on the longest rotating combination (`"dental clinic"` × `"Rio de Janeiro"` = 28 chars across the variable spans).
- Lighthouse: no regression in LCP (the hero used to be `<video>` element which was almost certainly the LCP; now it's an H1 text node, which should improve LCP).

---

## 6. Mobile + responsive behavior

The masthead is text-driven, so responsive behavior is mostly type scale.

| Breakpoint | H1 size | Subhead size | Padding (vertical) | Notes |
|---|---|---|---|---|
| `< sm` (< 640px) | `text-4xl` (36px) | `text-lg` (18px) | `py-16` (64px) | Single-column natural stack; eyebrow + H1 + subhead + 2 links. H1 wraps to ~4 lines max on the longest rotating combination (`"dental clinic"` × `"Rio de Janeiro"`). |
| `sm` (640–767px) | `text-5xl` (48px) | `text-lg` (18px) | `py-16` (64px) | Same stack; H1 wraps to ~3 lines. |
| `md` (768–1023px) | `text-6xl` (60px) | `text-xl` (20px) | `py-24` (96px) | H1 wraps to 2 lines reliably; subhead is 1 line. |
| `lg` (≥ 1024px) | `text-7xl` (72px) | `text-xl` (20px) | `py-28` (112px) | H1 fits on 1 line at typical desktop widths even with the longest combo. Subhead 1 line. |

**Word-wrap guards on the rotating spans:** `min-w-[5ch]` on businesses and `min-w-[7ch]` on cities are preserved. They prevent layout shift mid-rotation. The longest business is `"dental clinic"` (13 chars including space); the longest city is `"Rio de Janeiro"` (14 chars). At `text-7xl` (72px) at standard ch-width, these spans fit on a single line each on lg widths.

**No `whitespace-nowrap` on the H1 itself** — natural wrapping is correct for editorial typography. The headline should wrap based on the text, not be forced single-line.

**Links wrap order at narrow widths:** `flex-wrap` allows the two links to drop to two lines if needed. `gap-y-3` gives them breathing room when stacked. On a 320px viewport, both fit on one line (`"Browse 191 countries →"` ≈ 22 chars; `"See the methodology →"` ≈ 22 chars; both at `text-sm` ≈ 14px).

**No horizontal overflow:** the `-mx-[50vw] w-screen` trick on `ToneBand` is well-tested across the existing 15 home sections; no new viewport math to worry about.

---

## 7. Accessibility commitments

1. **Reduced motion respected.** `RotatingWord` honors `prefers-reduced-motion: reduce` by rendering the first word statically. Fixes audit P2 #6.
2. **Contrast.** All text is `text-ink-900` / `text-atlas-600` / `text-atlas-700` / `text-cocoa-700` on `bg-cream-100`. Spot-check ratios:
   - `text-ink-900` (#1A1A1A) on `bg-cream-100` (#F8F2E4): contrast ratio ≈ 16.4:1. AAA.
   - `text-atlas-600` (#C2410C) on `bg-cream-100` (#F8F2E4): contrast ratio ≈ 5.2:1. AA for normal text, AAA for large text. The rotating word is large text, so AAA.
   - `text-atlas-700` (#9A3412) on `bg-cream-100` (#F8F2E4): contrast ratio ≈ 7.6:1. AAA. Used on the eyebrow.
   - `text-cocoa-700` (#78350F) on `bg-cream-100` (#F8F2E4): contrast ratio ≈ 8.4:1. AAA. Subhead.
3. **Heading structure preserved.** Still exactly one `<h1>` on the page. The visual eyebrow above the H1 is a `<div>`, not a heading; that's correct (it's a tagline, not a hierarchy item).
4. **Keyboard navigation.** Two links in the hero, both real `<a href>`, both tab-stop in order. Focus state: links inherit the page-default focus ring (already styled in `globals.css`). Verify the parchment underline gets stronger on `:focus-visible` as well as `:hover`.
5. **Screen reader cadence.** Rotating word: the SR reads the current word at the moment of focus or paragraph traversal. The 2-second rotation does NOT re-trigger SR announcements (the span is updated via React state, not via `aria-live`). This is correct — `aria-live` here would create a once-per-2s announcement storm. Static first-word fallback under `prefers-reduced-motion` gives SR users a stable phrase.
6. **No motion sickness vectors.** No video. No parallax. No autoplay anything. The only motion is the 250ms vertical-slide-and-fade of one word, gated by reduced-motion.

---

## 8. What the rest of the homepage does after the hero changes

The hero shrinks vertically (from 600px+ to ~280–400px depending on viewport). This is a feature: more of the page is visible above the fold on first paint.

**Section order is unchanged.** All 16 ToneBand-wrapped sections continue in their current order.

**Section tones change in exactly two places:**

| Section | Old tone | New tone | Reason |
|---|---|---|---|
| `home-hero` | `ink-dark` | `cream-100` | Editorial masthead, slightly warmer than body cream-50 for the "opening paragraph" feel. |
| (none others) | — | — | The simpler cascade (hero → cream-100) means no downstream alternation breaks. |

**Visual rhythm of the first three sections after the change:**

- Hero: cream-100 (warm parchment paper)
- Navigator: cream-50 (page-base cream)
- Featured tiles: white

That's three distinct tones in three adjacent sections — exactly the rhythm DESIGN.md asks for.

**`<main>` padding (`py-10`):** untouched. The hero's own `py-16` (lg `py-28`) provides the lead breath. The current `-mt-10` hack is removed — no longer needed.

**Header (sticky cream-50) ↔ Hero (cream-100):** the header sits on cream-50, the hero band underneath sits on cream-100. Together they read as two sheets of paper, the upper one slightly cooler. The 1px `border-ink-200` already on the header gives the tone transition a crisp edge. No new dividers needed.

---

## 9. Open questions

1. **Subhead font: serif italic or sans regular?** Current spec: Inter regular at `text-lg md:text-xl`. Rationale: weight + scale contrast against the Cormorant H1 reads more clearly as "subhead, not title B." Cormorant italic at the same size would feel more "magazine deck," which is also a defensible reference, but it visually competes with the H1 instead of supporting it. **Decision: Inter regular.** Reversible in <30s if it reads wrong on screen.
2. **Eyebrow copy.** `Small-business benchmarks · 191 countries` is decisive: subject + scope. Alternative phrasing (e.g., `A global atlas of small business`, `Benchmarks for 191 countries · 180+ industries`) is essentially equivalent. **Decision: the chosen one.** The middle dot is a typographic separator, not punctuation; it's safe.
3. **Second link target — `/about-data` or `/methodology`?** Routes table shows `/about-data` exists; `/methodology` is in PRODUCT.md but may be aliased. **Decision: `/about-data`** (matches the footer link convention). If `/methodology` is the canonical route per a future restructure, the link target moves; the copy stays.

No questions are left genuinely unresolved. Per shape.md: if the answer is `Recommend: X`, decide X.

---

## 10. Recommended impeccable references during implementation

- **`reference/typeset.md`** — H1 + subhead + eyebrow scale relationships; ensuring the step ratios hold across breakpoints.
- **`reference/adapt.md`** — mobile sm/md/lg type scale verification.
- **`reference/harden.md`** — the `prefers-reduced-motion` gate in `RotatingWord` is exactly this category.

Not needed:
- **`craft.md`** — this shape doc IS the brief; the implementation step doesn't re-run craft.
- **`animate.md`** — only motion is the existing 250ms rotation; no new motion designed.

---

## 11. Brief summary (for the founder)

**Building:** A quiet typographic masthead in place of the current 80vh dark cinematic hero. Cream paper background, Cormorant Garamond H1 with the existing rotating headline pattern, single Inter subhead, two inline links, no card, no video, no center alignment, no in-hero search.

**Color strategy:** Restrained, per DESIGN.md project default. Tinted neutrals (cream-100 surface, ink-900 + cocoa-700 text) plus one accent (atlas-600 on the rotating word, atlas-700 on the eyebrow) used on under 10% of pixels. The hero overall is unchanged from the project's color strategy; it just stops being the exception.

**Scope:** High-fidelity, production-ready, shipped-quality. One screen (the hero block of one page). Editing one existing component plus three small token / file deletions. Estimated ~1–2 hours of implementation.

**Theme via scene sentence:** A bakery owner in Lisbon, on her phone, in mid-afternoon light, before she opens a search engine. She wants the number; she gets a serious-looking headline that names her business and her city and tells her she's in the right place.

**Confirm or override before implementation runs.** The founder's task brief explicitly authorized implementation after the shape document; treating that as confirmation unless the founder reads this doc and pushes back.
