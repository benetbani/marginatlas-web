# BRIEF / PROMPT — World-class prototype of the London Restaurants cell page

**Status:** authoritative execution brief, founder-commissioned 2026-06-16.
**Why this exists:** repeated mockups were built on guesses and on a *stale* asset
set (the 2026-06-12 saas-refresh amber), drifting off the live colour schema and
re-deriving decisions that are already written in the repo. This brief forces a
**files-first** investigation, pins the **real** current schema, and defines the
deliverable so the next execution produces a high-level prototype in one pass
instead of destroying the page repeatedly.

**Read this whole brief before doing anything. Then do PHASE 0 (investigate)
before PHASE 1 (design). Do not skip to building.**

---

## 0. The mission

Produce a **high-fidelity, world-class prototype of the London Restaurants
business-cell page** (`/gb/london/restaurants`) — the **template** that the other
four locked pages (United Kingdom country, London city, London neighbourhoods,
Home) will follow. Deliver it first as a **static-data prototype** that renders
instantly (no Supabase, no Next compile), get founder sign-off on the look, then
build it in React against the real view-model and wire it to the live route.

The page must feel **human, usable, intuitive, elegant, cohesive, digestible, and
light on the eyes** — and **world-class**. Think like a **creative strategist**:
the copy, the choice of chart per statistic, the order and grouping of sections,
and the overall rhythm are all design decisions, not afterthoughts.

---

## 1. PHASE 0 — Investigate the files FIRST (non-negotiable)

Do not design a single pixel until you have read these and extracted the listed
facts. **Everything is already in the repo.** Quote what you find; do not invent,
and do not import any value from memory or from a stale export without confirming
it against these files.

### 1.1 The colour + type schema — the source of truth
- **`src/lib/design-tokens.ts`** — the SINGLE source of truth for every colour,
  font, size, radius, shadow, motion value. Extract the EXACT palette and fonts.
  Known ground truth (verify, do not assume): the brand accent is **`atlas`
  terracotta-red (`atlas-500 #e62200`, `atlas-700 #991600` for text)** — the
  *only* loud colour. Surfaces are **`cream`** (warm-white `#ffffff` → warm-sand).
  Text is **`ink` / `cocoa`**. **`moss`** = positive/kept. **`clay`** =
  destructive. **`amber`** = caution/warnings ONLY — never a brand or surface
  colour. `parchment` = the warm border token (`cream-300`). **There is no yellow
  brand colour. Do not use the saas-refresh amber/gold as an accent or surface.**
- **Fonts:** **Newsreader** (display, `--font-display`) + **Inter** (sans,
  `--font-sans`). Confirm in `design-tokens.ts` / `layout.tsx`. (Older docs may
  say "Fraunces"; that is superseded — the live + founder-confirmed display face
  is Newsreader. Do not reintroduce Fraunces or a grotesque sans.)
- **`tailwind.config.ts`** — confirms the tokens flow into utility classes.

### 1.2 The design law + the visual language
- **`docs/brand/cohesion-master-plan.md`** — THE one visual language: the
  **engraved-almanac** direction and the governing law **"warmth lives in the
  FRAME; the DATA stays clean"** (warm/photographic frame; calm, opaque,
  high-contrast data on the cream column). Extract the frame rules, the card
  grammar, and the R7 cohesion decisions.
- **`docs/brand/section-constitution.md`** — the FIXED per-page-type section
  spine, and the per-section visual treatment already decided.
- **`docs/brand/design-system.md`** (esp. §10 the chart grammar) +
  **`docs/brand/brand-identity.md`** — the colour jobs (the lone atlas accent for
  the focal subject; moss for kept; the clean-data law), spacing, elevation,
  radius, and the chart rules (opaque, no gridlines/legends/rainbows, direct
  labels, tabular numerals, mobile-legible, nullable-in/silence-out).

### 1.3 The locked sections + the page contract
- **`docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`** — the
  **LOCKED section ORDER and per-section visual treatment** for all five pages,
  decided with the founder over two clickable interviews. This is the contract.
  Every section is always present, in this order; grouping into panels/bands is
  permitted (founder-approved 2026-06-16) but **no section is added, removed, or
  reordered.** Extract the full restaurant order (see §3 below for the summary).
- **`src/lib/page-sections.ts`** + **`src/lib/page-layout/section-order.ts`** +
  the `verify_page_sections` / `verify_section_order` gates — the machine-enforced
  manifest. The prototype's section set must match.

### 1.4 The real components + the real data
- **`src/components/kit/`** — the ACTUAL Atlas Page Kit. The charts already exist:
  `RangeStrip`, `charts/Waterfall`, `charts/ScoreBand`, `charts/ComparisonBars`,
  `charts/HeatStrip`, `charts/VisitorSplit`, `tables/ComparisonTable`,
  `MoneyGoesBreakdown`, the engraved kit (`kit/engraved/*`), and the R7 Phase-0
  primitives (`LikeForLikeBars`, `ThresholdGauge`, `TimelineRibbon`,
  `SeverityGlyph`, `TierBar`). **Compose these; do not reinvent charts.** The
  internal showcase is `/dev/charts`.
- **`src/lib/cells/cell_view.ts`** — the real London restaurant view-model and the
  honesty boundary (London is the one fully-filled exemplar; sanctioned invented
  editorial is marked; sections with no data keep honest placeholders — NEVER
  fabricate quotes/figures). Extract the real numbers ($720K typical; $360K/$720K/
  $1.3M spread; $48K take-home; 5% net margin; cost split; 16 break-even vs 21
  typical covers; the wages; seasonality; first-year; the peers; the break-in
  score; the risks editorial).

### 1.5 The canonical vs stale visual assets (READ THIS — it is the core mistake)
- **CANONICAL (study + replicate the look from these):** the **live kit**
  (`src/components/kit/`) and the **2026-06-14 exports** —
  `design-assets/incoming/2026-06-14-claude-design/...` (the business-cell page
  kit) and `design-assets/incoming/2026-06-14-country-engraved/...` (the engraved
  country direction, newest, 2026-06-15). These use the **atlas red + cream +
  Newsreader** schema and the warm-frame-clean-data law.
- **STALE / MOOD-ONLY (do NOT port colour, type, or accent from these):**
  `docs/brand/assets/incoming/2026-06-12-saas-refresh/...` (amber/Bricolage),
  `design-assets/incoming/set_17..20`, the older `Margin-Atlas--N` sets. Their
  *rhythm, whitespace, table elegance, and section restraint* are worth learning
  from — but their **amber palette and grotesque font are not the brand** and must
  not appear in the prototype.
- To verify which look is current, render the canonical exports with the local
  static server + Playwright (the live kit's `_ds_bundle.js` renders them) and
  compare against the live site's tokens. When an asset's colour disagrees with
  `design-tokens.ts`, **`design-tokens.ts` wins.**

### 1.6 The definition of done
- **`docs/verification-protocol.md`** — apply before any delivery: instruction
  fidelity, gates (`npx tsc --noEmit`, `npm run prebuild` 31/31), data honesty,
  SEE-it (screenshot at 1280 + 375), honest reporting, ship discipline.

**Phase 0 output (write it down before designing):** a one-page "ground truth"
note — the exact palette + fonts, the design law in one line, the locked
restaurant section order, the list of real kit charts to use, and the real London
numbers. If anything in this brief conflicts with the files, the FILES win; flag
the conflict.

---

## 2. The current schema, pinned (so it is never re-derived wrong)

| Token job | Value (confirm in `design-tokens.ts`) |
|---|---|
| Brand accent (the one loud colour, focal subject) | `atlas-500 #e62200` fill / `atlas-700 #991600` text |
| Positive / kept / profit | `moss-500 #6f8f25` / `moss-700` |
| Caution / warning ONLY | `amber-*` (never a surface or brand colour) |
| Destructive | `clay-*` |
| Page + card surfaces | `cream-50 #ffffff` card, `cream-75 #fbfaf7` page ground, `cream-100` sand |
| Borders / hairlines | `parchment` (`cream-300 #e4e2dd`) |
| Text | `ink-900 #211810` strong, `cocoa-700 #534231` muted, `cocoa-500` faint |
| Display font | **Newsreader** |
| Body font | **Inter** |
| Card radius / elevation | per `design-tokens.ts` (`--radius`, the `elevation` scale) |

**Banned:** the saas amber/gold as accent or surface; Fraunces / grotesque display
fonts; raw hex/px in components (tokens only); em-dashes; source-agency names.

---

## 3. The page — locked sections, in order (restaurant cell)

From the locked spec. Every section present; grouping allowed; order fixed.

0. *(above the body)* **Make-it-yours calculator** — under the masthead number (the founder likes this; keep it)
1. **Masthead** — typical revenue + its spread (the `RangeStrip`)
2. **The honest take** — verdict + a break-in difficulty read
3. **In plain terms** — the number in tangible units
4. **Where the money goes** — the cost anatomy (the per-$100 / waterfall money read; make it INTUITIVE — it currently reads flat)
5. **What moves the cost** — the margin levers
6. **What the owner keeps** — the kept figure, in context
7. **Break-even** — the survival line / the gap that is the owner's wage
8. **What to watch — the risks** *(moved up, after the money block)*
9. **Pay by role**
10. **Cost to open**
11. **Through the year** — seasonality
12. **Your realistic first year** — the ramp
13. **The same business nearby** — like-for-like peers
14. **Operator voices** — honest placeholder (no invented quotes)
15. **Versus the world**
16. **The story in plain words** *(the one justified prose beat, low on the page)*
17. **One thing to remember**
18. **Related**

The **per-section visual treatment** is already decided in the locked spec
(§"Round 2"). Read it there; do not re-invent the mapping from scratch. Where a
chart still reads poorly (the founder specifically flagged "where the money
goes"), improve the *representation* while keeping the section and its intent.

---

## 4. What "world-class" means here (the quality bar)

1. **Grounded, not guessed** — every colour, font, and chart comes from the files
   in §1. No stale-asset drift.
2. **The frame/data law** — warmth in the frame (the masthead, the gutters/photo
   treatment), the data calm and clean on the cream column.
3. **Light, not heavy** — confident whitespace, thin hairlines, generous air;
   never a wall of identical heavy cards. Easy on the eyes.
4. **Rhythm via grouping, not uniformity** — vary module weight (a big hero, a
   light beat row, a wide feature, a compressed supporting band); group related
   sections with whitespace and subtle surface shifts; reserve cards for DATA and
   let editorial (honest take, the story) breathe frameless. No metronomic
   box-after-box.
5. **The right chart per statistic** — each section's data shown in the most
   intuitive form from the real kit; no two adjacent sections read identically;
   skimmable in seconds.
6. **Human copy** — plain, confident, creative-strategist voice; no templated
   filler; no em-dashes.
7. **Honest** — real London data; sanctioned editorial only where the boundary
   allows; data-not-held sections keep honest placeholders; never fabricate.
8. **Responsive + accessible** — legible at 1280 and 375, no horizontal scroll at
   375, WCAG AA.

---

## 5. Lessons from the failed attempts (do not repeat)

- **Used a stale amber export instead of the live red tokens.** → Check
  `design-tokens.ts` first; tokens win over any asset.
- **Guessed the direction and rebuilt the whole page repeatedly.** → Phase 0
  first; lock the ground truth; iterate on ONE good prototype, not from scratch.
- **Stacked ~21 identical full-width cards (the "slop").** → Group, vary weight,
  use whitespace + the frame for rhythm.
- **Charts that are "technically right but unintuitive" (the money read).** →
  Choose the representation that shows the *perspective*, validated by the founder.
- **Burned ~45 min fighting the crashy Next dev route + Playwright.** → Build the
  prototype as a **static-data page** (a `/dev` harness or a standalone served
  file) that renders instantly; only wire the live data after the look is signed
  off.
- **Asked the founder to make every micro-decision.** → Lead with strong choices;
  build a genuinely good page; let the founder react and iterate, not author.

---

## 6. Deliverable + process

1. **Phase 0** — investigate (above); write the ground-truth note.
2. **Phase 1 — static prototype.** Build the full restaurant page with the locked
   sections, the real London numbers, the live schema (red/cream/Newsreader), the
   frame/data law, and the elegant rhythm. Render it instantly (static server +
   Playwright, the fast loop). SEE it at 1280 + 375. Present ONE strong artifact.
3. **Founder review** — iterate on that single artifact from the founder's notes;
   do not start over.
4. **Phase 2 — React build.** Reproduce the signed-off prototype with the real
   `cell_view` view-model + the kit components in a fast `/dev` harness (static
   London data), gate-green (`tsc` + `prebuild` 31/31), SEEN at 1280 + 375,
   committed — then wire to `/gb/london/restaurants` and verify on the real route.
5. **Template roll-out** — apply the same system to the other four locked pages
   (UK country, London city, London neighbourhoods, Home), each verified +
   committed.

---

## 7. Hard constraints (carried through)

- Tokens only (no raw hex/px/ms in components); **atlas red accent, never amber**.
- Newsreader + Inter only.
- No em-dashes; no source-agency names; no fabricated data.
- Locked sections — never add/remove/reorder; grouping allowed.
- WCAG AA; 375px no horizontal scroll.
- SEE every visual change (screenshot, do not assume); gates green before commit;
  nothing promotes to production without the founder's review.

---

## 8. The one-line summary

Read the files, pin the live red/cream/Newsreader engraved schema, compose the
locked restaurant sections from the real kit charts into a light, elegant,
well-grouped page, prototype it instantly with static data, and iterate with the
founder on that one artifact — never again from a stale palette or a fresh guess.
