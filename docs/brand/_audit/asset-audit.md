# Margin Atlas — Visual Asset Audit (2026-06-12)

Audit of the design-tool export sets under `docs/brand/assets/incoming/Margin-Atlas*/`.
Scope: the visual-ASSET files only (icons, pictograms, data-viz, charts, spots,
motion, component CSS, cartographic-motif SVGs, pattern/reform CSS). The designed
page `.tsx`/`.jsx`/`.html` and the page-design `.md` docs are out of scope here.

Authority order used to judge every asset: `docs/brand/brand-identity.md` is the single
source of truth; `docs/brand/design-tool-prompts.md` is the brief the assets were generated
against; `src/lib/design-tokens.ts` is the live token system the adopted assets must conform
to. The exports are RAW MATERIAL, not gospel.

---

## 0. Canonical set decision (the headline)

**CANONICAL ASSET SET: `docs/brand/assets/incoming/Margin-Atlas--5/`** (the loose `atlas-*`
files at the root of that folder).

Why `--5`, definitively:

- The `base -> 1 -> 2 -> 3 -> 4 -> 5` series **accretes** assets. `--5` is the only set that
  carries the FULL suite: `atlas-icons`, `atlas-pictograms`, `atlas-dataviz`, `atlas-charts`,
  `atlas-spots`, `atlas-motion` + `atlas-motion2`, `atlas-components.css`, plus every
  cartographic motif and the pattern/reform CSS. No earlier set is complete (base has no
  pictograms/dataviz/spots/motion/charts; `--1` adds pictograms; `--2` adds dataviz; `--3`
  adds spots; `--4` adds motion.js; `--5` adds motion2.js + charts.js + components.css).
- `--5` is a strict SUPERSET, not a fork: every shared file is **byte-identical** across
  base, `--5`, and `--20` (verified with `cmp` on all motif SVGs, both pattern SVGs,
  `atlas-pattern.css`, `atlas-reform.css`, `atlas-icons.svg`, and `atlas-icons.js`). The
  bundle stabilized early and was carried forward unchanged, so `--5` loses nothing by being
  the latest in the accreting series.
- **Sets 17-20 are page-design iterations, not asset sets.** They carry the designed page
  HTML/MD (Homepage, Cell Page, Comparison, London Roadmap, etc.) and ONLY the cartographic
  motifs + `pattern.css`/`reform.css` (byte-identical to `--5`). They contain NONE of the
  icon / pictogram / dataviz / charts / spots / motion / components bundles. The latest
  (`--20`) was spot-checked and confirmed to add nothing at the asset level.

So `--5` wins on completeness with zero regression risk. Sets 17-20 remain the reference for
page LAYOUT/composition (a separate audit), not for the asset library.

### The one systemic correction the whole `--5` bundle needs

Every accent in the export predates the final brand retone. The assets use a **burnt-orange
ramp** (`#9A3412` / `#C2410C` / `#D7642E` / `#D73A14` / `#E0451F`) wherever the live brand now
uses **vermillion** (`atlas-700 #991600`, `atlas-500 #e62200`). The cartographic motifs use
**cool neutral grays** (`#EEEEEE`, `#E0E0E0`, `#EAEAEA`) where the brand wants **warm taupe**
(`parchment #e4e2dd` = `cream-300`). The `--moss` in the components/charts is `#5F7D55`, off
the token moss `#6f8f25`. Treat this as ONE retone pass (token-map, below), not per-asset
rework. It does not change ADOPT/REFINE verdicts; it is a mechanical conform step applied
during port.

---

## 1. Asset-presence matrix (why `--5` is canonical)

| asset                     | base | 1 | 2 | 3 | 4 | 5 | 17 | 18 | 19 | 20 |
|---------------------------|:----:|:-:|:-:|:-:|:-:|:-:|:--:|:--:|:--:|:--:|
| atlas-icons (.svg/.js)    |  Y   | Y | Y | Y | Y | Y | -  | -  | -  | -  |
| atlas-pictograms (.svg/.js)| -   | Y | Y | Y | Y | Y | -  | -  | -  | -  |
| atlas-dataviz.js          |  -   | - | Y | Y | Y | Y | -  | -  | -  | -  |
| atlas-spots (.svg/.js)    |  -   | - | - | Y | Y | Y | -  | -  | -  | -  |
| atlas-motion.js           |  -   | - | - | - | Y | Y | -  | -  | -  | -  |
| atlas-motion2.js          |  -   | - | - | - | - | Y | -  | -  | -  | -  |
| atlas-charts.js           |  -   | - | - | - | - | Y | -  | -  | -  | -  |
| atlas-components.css      |  -   | - | - | - | - | Y | -  | -  | -  | -  |
| atlas-reform.css          |  Y   | Y | Y | Y | Y | Y | -  | Y  | Y  | Y  |
| atlas-pattern (.svg/.css) |  Y   | Y | Y | Y | Y | Y | Y  | Y  | Y  | Y  |
| atlas-pattern-dark.svg    |  Y   | Y | Y | Y | Y | Y | Y  | Y  | Y  | Y  |
| motifs (grid/columns/crosshatch/pinstripe/rosette/accent) | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y |

`Y` = present. Every `Y` cell that also appears in `--5` is byte-identical to the `--5` copy.

---

## 2. Per-category assessment

### 2.1 atlas-icons (`.svg` + `.js`) — the UI / section icon system
- **Source:** `Margin-Atlas--5/atlas-icons.svg`, `Margin-Atlas--5/atlas-icons.js`
- **Contains:** exactly **40 line icons**, `ma-`-prefixed, matching PROMPT 1's 40 concepts
  1:1 (startup-cost, owner-keeps, revenue, range, cost-breakdown, wages, break-even,
  seasonality, first-year, competition, taxes, register-cost, red-tape, hiring, min-wage,
  spending-power, commercial-rent, free-zone, airport, tourist, best-areas, neighborhood,
  compare, vs-world, corruption, locals-know, honest-take, contrarian, myth-reality, who-for,
  gut-check, worked-example, operator-voices, freshness, flag, bookmark, watch, calculator,
  methodology, search). `.js` adds clean metadata (id, group, label, blurb) in 5 logical
  groups; `.svg` is a `<symbol>` sprite + a display sheet.
- **Quality / on-brand:** Excellent. One family: 32-unit grid, 1.6 stroke, rounded joins,
  `currentColor`, single vermillion accent via `class="a"` (stroke) / `class="af"` (fill),
  used only where it carries meaning. Quiet, abstract, readable at 20px. This is the
  "fine line, one consistent family" device the brand asks for, executed correctly.
- **Verdict: ADOPT.** Note: the glyphs are colorless (`currentColor`), so the burnt-orange
  hex baked into the `.svg` DISPLAY SHEET (labels/swatches only) does not infect the glyphs.
  The single conform step is to point the accent class (`.a`/`.af`) at the vermillion token,
  not the orange one, when wiring into the repo.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-icons.js` (the structured
  manifest is the better port target than the sprite).

### 2.2 atlas-pictograms (`.svg` + `.js`) — business / venue pictograms
- **Source:** `Margin-Atlas--5/atlas-pictograms.svg`, `Margin-Atlas--5/atlas-pictograms.js`
- **Contains:** **64 marks** = 60 trades + 4 venues (high street, mall, airport, station),
  in 7 groups (Food & drink 13, Health & personal care 11, Retail & shops 12, Trades & home
  services 12, Professional & creative 8, Hospitality & leisure 4, Venues 4). Same `ma-`
  prefix, id/group/label metadata. Trade list maps closely to the real cell taxonomy
  (restaurant, pizzeria, kebab, sushi, cafe, bakery, barber, pharmacy, dentist, gym, grocery,
  florist, auto repair, plumber, law firm, accountant, software studio, hotel, etc.).
- **Quality / on-brand:** Excellent and on-system. Same grid + stroke + `currentColor` as the
  UI icons, so the two families sit together exactly as the brief required. Slightly friendlier
  than the UI set (a touch of character) without becoming cartoonish or clip-arty. Richer than
  the prompt asked (64 vs ~60).
- **Verdict: ADOPT.** Same single conform step (accent class -> vermillion token).
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-pictograms.js`.

### 2.3 atlas-dataviz.js — the chart-language motif kit
- **Source:** `Margin-Atlas--5/atlas-dataviz.js`
- **Contains:** runtime builders for (1) a distribution curve (histogram + Catmull-Rom smooth
  curve + IQR band + "typical" marker), (2) an engraved-atlas **graticule globe** (real
  cartographic device: parallels, meridians, equator emphasis, vermillion city nodes + a
  dashed great-circle route), and (3) the **sub-type switcher** wiring (the signature feature:
  dine-in / takeaway / delivery reframing the readout). The range-strip, per-$100 stack, and
  like-for-like comparison from PROMPT 3 live as static CSS in `atlas-components.css` (below),
  by design.
- **Quality / on-brand:** Very good, and the best-disciplined of the JS assets: it uses
  `var(--atlas-600)` / `var(--ink-900)` CSS tokens rather than raw hex. The engraved globe is
  squarely the brand's "engraved atlas" signature. The smooth-curve math is sound.
- **Verdict: REFINE.** Adopt the architecture; re-point the `var(--*)` names to the live token
  ladder (the reform.css vars it references carry the orange ramp). De-duplicate against
  `atlas-charts.js`, which re-implements the same distribution chart with raw hex.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-dataviz.js`.

### 2.4 atlas-charts.js — the four-chart grammar
- **Source:** `Margin-Atlas--5/atlas-charts.js`
- **Contains:** 4 chart types in one grammar — distribution histogram, horizontal **ranking**
  bars (like-for-like across comparable places, never a shaming ranking), area **trend** line,
  and a scatter / **positioning quadrant** (revenue x margin). Mounts via `[data-chart]`.
- **Quality / on-brand:** The chart LOGIC is high quality (IQR band, "typical" marker, smooth
  area fill, quadrant median guides, restraint over flash). BUT it is the WEAKEST asset on
  token discipline: it hardcodes raw hex (`SPOT="#C2410C"`, `SPOTD="#9A3412"`, `MOSS="#5F7D55"`,
  `#FBEDE4`, `#E4DBCD`, ...) and hardcodes font names (`Newsreader`, `JetBrains Mono`). It also
  overlaps `atlas-dataviz.js` (the distribution chart is duplicated).
- **Verdict: REFINE.** Keep the four chart-type implementations as the reference for the real
  chart components; retone all literals to tokens; collapse the duplicated distribution into
  one shared builder with `atlas-dataviz.js`.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-charts.js`.

### 2.5 atlas-spots (`.svg` + `.js`) — editorial spot illustrations
- **Source:** `Margin-Atlas--5/atlas-spots.js` (preferred), `Margin-Atlas--5/atlas-spots.svg`
- **Contains:** **12 line-and-wash illustrations** matching PROMPT 4 (the honest take, the four
  audience roles, a neighborhood street, vs the world, opening abroad, free economic zone,
  airport/captive venue, what locals know, the first year, the reality check, the benchmarks
  report cover, the calculator). `.js` exposes each as a self-contained `{ id, title, caption,
  vb, body }` object (ink lines inherit the wrapper stroke; wash shapes carry their own fill +
  fill-opacity). `.svg` is a single rendered POSTER sheet (no `<symbol>` library) and is the
  weaker artifact of the two.
- **Quality / on-brand:** Strong. The hand is genuinely editorial: confident ink line over
  soft, slightly-misregistered colour washes (the warm almanac-print feel the brand wants),
  human and grounded, not corporate stock, not whimsical mascots. Palette is warm vermillion
  `#E0451F` + moss `#5F7D55` + cocoa + cream, with the true brand `#991600` already appearing.
- **Verdict: REFINE.** Adopt the 12-piece `.js` set; retone the raw wash hex to tokens
  (`#E0451F -> #e62200`, `#5F7D55 -> moss token`). Prefer `.js`; treat `.svg` as preview only.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-spots.js`.

### 2.6 atlas-motion.js + atlas-motion2.js — the motion language
- **Source:** `Margin-Atlas--5/atlas-motion.js`, `Margin-Atlas--5/atlas-motion2.js`
- **Contains:** `motion.js` = the 8 core micro-animations from PROMPT 5 (living graticule
  globe with route draw-on + node halos, hero count-up [ease-out cubic], sub-type cross-fade,
  scroll-into-view via IntersectionObserver, replay). `motion2.js` = 20 more interactions
  (radial Atlas-score gauge, determinate loading bar, odometer number roll, sparkline draw-on,
  tab-underline slide, multi-step stepper, copy-confirm).
- **Quality / on-brand:** Strong and disciplined. Durations sit in a 160-440ms budget with a
  single shared ease-out curve; "no bounce, no confetti, paper-soft" is honoured; the header
  states prefers-reduced-motion is guarded in product. These are reference implementations
  whose timing maps cleanly onto `design-tokens.ts` `duration`/`easing`.
- **Verdict: ADOPT** (as reference implementations). Conform step: re-point the inline
  `cubic-bezier(...)` and `440ms` literals to the `easing`/`duration` tokens, and wire the
  `prefers-reduced-motion` guard explicitly at the component boundary.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-motion.js` (+ `atlas-motion2.js`).

### 2.7 atlas-components.css — the page-furniture component library
- **Source:** `Margin-Atlas--5/atlas-components.css`
- **Contains:** the single richest reusable artifact. Token-driven (`var(--*)`) classes for:
  panel shell, pills/markers, generic table, comparison table (columns of places, with a
  `.win` highlight), key/value table, score gauge, sub-score bars, seg-10 meter, scorecard
  grid, KPI band, hero header, range strip, per-$100 cost stack, P&L list, verdict callout,
  at-a-glance strip, featured insight card, breakdown bar list, pricing tiers, top movers,
  methodology callout, for-you/not two-column, country scorecard, chart frame. This maps
  almost 1:1 onto the section list in the page-content-map.
- **Quality / on-brand:** High. Serif tabular numerals, ink + cream structure, cocoa for
  secondary mass, two accents with fixed jobs (vermillion = spotlight/typical/leader; moss =
  kept/positive). Restraint is right. Two flaws: it declares a local `--moss: #5F7D55` (off the
  token moss `#6f8f25`), and every `--atlas-*` it consumes resolves to the orange ramp from
  `reform.css`.
- **Verdict: REFINE — as a SPEC, not a drop-in.** The repo's system is Tailwind + `cva` +
  `forwardRef` primitives reading `design-tokens.ts` (see `CLAUDE.md` / GUIDELINES), NOT a
  plain CSS class library. Use this file as the authoritative blueprint for building the real
  React/Tailwind primitives (it shows exactly which components to build and their measurements),
  but do not ship the `.css` as-is. Conform colours to tokens during the build.
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-components.css`.

### 2.8 atlas-reform.css — the foundational token + primitive dialect
- **Source:** `Margin-Atlas--5/atlas-reform.css`
- **Contains:** the design-tool's own token block (cream/ink/cocoa/atlas ramps, serif/sans/mono
  font vars, radii, shadows) plus base primitives (eyebrow, headings, chips, glyph tiles, stat
  blocks, seg meters, form controls, buttons, cards) and a showcase scaffold.
- **Quality / on-brand:** The STRUCTURE is on-brand (warm, serif numerals, terracotta accent
  used sparingly). But this file is the SOURCE of the stale palette: `--atlas-700: #9A3412`,
  `--atlas-600: #C2410C`, `--atlas-500: #D7642E` (orange, not vermillion), and raw qualitative
  hex (`--good #16A34A`, `--warn #CA8A04`, `--regional #2563EB`, `--bad #B91C1C`) that the live
  token system has already replaced with warm moss/amber/clay equivalents.
- **Verdict: DROP** as a token source (the repo already has the canonical, newer token system
  in `src/lib/design-tokens.ts`). Keep it only as a Rosetta map: its `--atlas-*` / `--ink-*` /
  `--cream-*` var NAMES are the names the other `--5` assets reference, so the conform pass is
  "rebind these names to the live token values" (see token map below).
- **Best path:** `docs/brand/assets/incoming/Margin-Atlas--5/atlas-reform.css` (reference only).

### 2.9 Cartographic-motif SVGs — the through-line device
- **Sources (all in `Margin-Atlas--5/`):** `atlas-grid.svg`, `atlas-columns.svg`,
  `atlas-crosshatch.svg`, `atlas-pinstripe.svg`, `atlas-rosette.svg`, `atlas-accent.svg`.
- **Contains:** six tileable background motifs — dotted measurement grid (40px), newsprint
  vertical rules (60px), pencilled crosshatch (14px), diagonal financial pinstripe (12px), a
  compass-rosette dingbat (160px), and a sparse accent micro-dot field (80px). Tiny, clean,
  hand-authored SVGs.
- **Quality / on-brand:** Conceptually perfect — this IS the brand's "subtle cartographic
  motif running quietly across every page." Restrained, fine, engraved. The ONLY problem is
  colour: they use cool neutral grays (`#E0E0E0`, `#EEEEEE`, `#EAEAEA`, `#ECECEC`, `#EFEFEF`),
  not the warm taupe token (`parchment #e4e2dd` = `cream-300`); `atlas-accent.svg` uses
  `#D73A14` (orange) not vermillion `#e62200`.
- **Verdict: REFINE.** Adopt all six; recolour to the warm-token hairline + vermillion accent.
  Trivial mechanical edit.
- **Best paths:** the six SVGs above (byte-identical across base/`--5`/`--20`, so any copy is
  equivalent; cite `--5` as canonical).

### 2.10 atlas-pattern (`.svg`/`.css`) + atlas-pattern-dark.svg — paper surfaces
- **Sources (all in `Margin-Atlas--5/`):** `atlas-pattern.svg`, `atlas-pattern-dark.svg`,
  `atlas-pattern.css`.
- **Contains:** the star/compass-dingbat paper field (80px) in light and dark, plus
  `atlas-pattern.css` which wires SEVEN paper surfaces (`.atlas-paper`, `-dim`, `-card`, the
  three dark variants, and the six motif utility classes) with a tasteful radial mask edge-fade
  on the card variant.
- **Quality / on-brand:** Good. The "whisper of paper/engraving texture on a clean surface"
  idea executed well; the masked card fade is a nice touch. Issues: `--atlas-paper-bg: #FAFAFA`
  and `--atlas-paper-bg-dark: #3A3A3A` are cool/neutral, not the warm cream
  (`background #f7f6f4` / `card #ffffff`) the tokens define; the pattern marks are the same
  cool gray as the motifs.
- **Verdict: REFINE.** Adopt the seven-surface system and the masking technique; rebind the
  paper-bg vars to warm cream tokens and recolour the marks to warm taupe.
- **Best paths:** the three pattern files above.

---

## 3. The single conform pass (token map) for everything adopted/refined

Apply this map once when porting any `--5` asset. It is purely mechanical and does not change
any verdict above.

| export value (stale)        | where it appears                          | live token target (`design-tokens.ts`)        |
|-----------------------------|-------------------------------------------|-----------------------------------------------|
| `--atlas-700` `#9A3412`     | reform.css, components, dataviz, charts   | `atlas-700` `#991600` (accent text/headline)  |
| `--atlas-600` `#C2410C`     | eyebrows, spot accent, chart SPOT         | `atlas-700` `#991600` or `atlas-600` `#c11c00`|
| `--atlas-500` `#D7642E`     | fills, meters, focus ring                 | `atlas-500` `#e62200` (surface accent)        |
| `--atlas-50`  `#FBEDE4`     | tints, IQR band, soft backgrounds         | `atlas-50` `#fff1ee`                          |
| `#D73A14`                   | `atlas-accent.svg` dots                    | `atlas-500` `#e62200`                          |
| `#E0451F`                   | `atlas-spots.js` washes                    | `atlas-500` `#e62200`                          |
| `--moss` `#5F7D55`          | components, charts, spots                  | `moss-500/700` `#6f8f25` / `#4a6018`           |
| `--good #16A34A` etc.       | reform.css qualitative tags               | `moss` (good) / `amber` (warn) / `clay` (bad) |
| `--regional #2563EB`        | reform.css                                | retire blue; use `tier.good` `#e62200`        |
| `#E0E0E0`/`#EEEEEE`/`#EAEAEA`| motif + pattern marks                     | `parchment` `#e4e2dd` (= `cream-300`)         |
| `#FAFAFA` paper-bg          | atlas-pattern.css                         | `background` `#f7f6f4` / `card` `#ffffff`      |
| `#3A3A3A` paper-bg-dark     | atlas-pattern.css                         | `ink-800` `#2c2015` (warm near-black)         |
| `Newsreader` (hardcoded)    | charts.js, spots.svg                      | `var(--font-display)` token                   |
| inline `cubic-bezier`/`ms`  | motion.js, motion2.js                     | `easing.out` / `duration.*` tokens            |

Standing constraints to honour during port: tokens only (no raw hex/px in components), no
em-dashes in user-facing source, no source-agency names, plain operator voice.

---

## 4. Verdict summary table

| category                  | verdict            | canonical source (in `Margin-Atlas--5/`)        |
|---------------------------|--------------------|-------------------------------------------------|
| UI / section icons (40)   | ADOPT              | `atlas-icons.js` (+ `atlas-icons.svg` sprite)   |
| business pictograms (64)  | ADOPT              | `atlas-pictograms.js` (+ `.svg` sprite)         |
| data-viz motif kit        | REFINE (retone/dedupe) | `atlas-dataviz.js`                          |
| chart grammar (4 types)   | REFINE (retone/dedupe) | `atlas-charts.js`                           |
| spot illustrations (12)   | REFINE (retone)    | `atlas-spots.js`                                |
| motion (8 + 20)           | ADOPT (as reference impls) | `atlas-motion.js` + `atlas-motion2.js`  |
| component furniture CSS   | REFINE (use as SPEC, build React) | `atlas-components.css`           |
| reform token/primitive CSS| DROP (reference map only) | `atlas-reform.css`                       |
| cartographic motifs (6)   | REFINE (recolour)  | `atlas-grid/columns/crosshatch/pinstripe/rosette/accent.svg` |
| paper pattern + CSS (3)   | REFINE (rebind warm)| `atlas-pattern.svg` / `-dark.svg` / `atlas-pattern.css` |

---

## 5. Notes for the next builder

- Port from `--5` ONLY. Do not port from sets 17-20 for assets (they carry none); use 17-20
  for page-LAYOUT reference in a separate pass.
- The `.js` manifests (`atlas-icons.js`, `atlas-pictograms.js`, `atlas-spots.js`) are better
  port targets than the matching `.svg` sprite sheets: structured, captioned, grouped.
- The `README.md` inside `--5` references an OLDER palette again (amber `#A55C00`/`#D47706`,
  Bricolage Grotesque). Ignore it; it is stale design-tool output, superseded by the brand and
  by `design-tokens.ts`.
- Build order suggestion: (1) motifs + pattern recolour [trivial, unlocks the through-line],
  (2) icon + pictogram families [adopt, high reuse], (3) component primitives from
  `atlas-components.css` spec [highest leverage], (4) charts/dataviz consolidated, (5) spots,
  (6) motion wired with reduced-motion guards.
