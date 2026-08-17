# Cohesion audit, 2026-08-17

Scope: §7 of `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`.
Read-only. No source file was edited. Every claim below carries a `file:line`.

Founder's words: *"you should check about how cohesive all the pages are."* And
separately: *"the country pages, they are totally not updated... the city pages
are also not updated."*

---

## 0. The instrument, and what it cannot see

Two measurements were taken.

**A. Import-graph walk.** For each page entry, the local (`src/`) import graph was
walked and idioms counted per file. Shared chrome (the 83 `.tsx` files reachable
from `SiteChrome.tsx`) was subtracted so a page is not credited with the
masthead's classes. For the "default branch" table the walk also stops at
`src/components/spine*/` and `src/app/dev/`, so the numbers describe the body
that renders **with no environment variables set**, which is what the repo does
today.

**B. Direct reads** of `globals.css`, `atlas-spine.css`, `tailwind.config.ts`,
`design-tokens.ts`, `section-order.ts`, `feature_flags.ts`, and every page entry.

**This measurement cannot distinguish a class a component MENTIONS from a pixel a
reader SEES.** Specifically:

- It cannot tell which of two overlapping grounds wins at paint time. Where that
  mattered (the homepage bands, the hero washes) the CSS was read directly and
  the resolution traced by hand; those are marked as traced, not counted.
- It counts a Tailwind class in source whether or not the branch holding it
  renders. That is why the branch-separated table exists, and why the union
  numbers are reported separately from the default-branch numbers.
- It cannot see runtime data-emptiness. Section 5's count of permanently-sample
  country sections comes from reading literal `null` / `sample` props in the
  source, not from rendering a country.
- **No screenshot was taken.** For "is cream still declared" and "which card
  class is used" these numbers are exact. For "does the page look like the
  others" the instrument is a render, and this audit did not take one.

---

## 1. THE MATRIX

Effective content width is measured at a desktop viewport, after nesting and
padding. `SiteChrome` gives every page it wraps `max-w-content` (1120px) with
`px-6`, so the inner column is **1072px** unless a page adds its own wrapper.
(`tailwind.config.ts:27`, `SiteChrome.tsx:111`.)

| page type | mounts `SpineShell` | reaches `SiteChrome` → `AtlasFrame` | flag | default branch | effective content width |
|---|---|---|---|---|---|
| **home** | only on flag-ON branch (`app/page.tsx:201`) | YES on default (`app/page.tsx:241`); **NO on flag-ON** | `isHomeReformEnabled()` | **OFF** = legacy body | 1072; two bands escape to `w-screen` |
| **country** | only on flag-ON (`[country]/page.tsx:355`) | YES (`[country]/page.tsx:1320`) | `isSpineReformEnabledFor("country")` | **OFF, and the master cannot enable it** (`feature_flags.ts:196`) | 1072 |
| **region** | only on flag-ON (`[geo]/page.tsx:140`) | YES (`[geo]/page.tsx:382`) | `...("region")` | **OFF, master cannot enable** (`feature_flags.ts:193`) | 1072 |
| **cell (legacy)** | no | YES (`[industry]/page.tsx:1414`) | `...("cell")` | **OFF** = legacy body | 1072 |
| **cell (spine-2)** | no, its own shell | **NO. Renders bare** (`[industry]/page.tsx:1410-1414`) | same | dark by default | **996** (`atlas-spine.css:153`, `max-width:1060px` + `padding:0 32px`) |
| **cell (spine-1)** | YES (`[industry]/page.tsx:393`) | YES → **nested `<main>`** (`spine/cell/cell-view.tsx:542`) | same | dark | 1024 |
| **city** | only on flag-ON (`cities/[slug]/page.tsx:238`) | YES, via `(site)/layout.tsx:21` | `...("city")` (adapter is real) | **OFF** = legacy body | **1024** (`cities/[slug]/page.tsx:430`, `max-w-6xl` + a second `px-4 md:px-6`) |
| **industry** | only on flag-ON (`industries/[industry]/page.tsx:191`) | YES via `(site)` | `...("industry")` (real) | **OFF** = legacy body | 1072 |
| **neighbourhood hub** | YES on flag-ON (`spine/hood/hood-view.tsx:80`) | YES via `(site)` → **nested `<main>`** (`hood-view.tsx:81`) | `...("hood")` (real) | **OFF** = legacy body | 976 default (`neighborhoods/page.tsx:145`), 1024 on spine |
| **/coverage** | no | YES via `(site)` | none | n/a | delegated to `CoverageHubV2` |
| **/faq** | no | YES | none | n/a | delegated |
| **/pricing** | no | YES | none | n/a | **1024** (`pricing/page.tsx:64`) |
| **/tools** | no | YES | none | n/a | **976** (`tools/page.tsx:88`) |
| **/learn** | no | YES | none | n/a | **848** (`learn/page.tsx:87`) |
| **/blog** | no | YES | none | n/a | 1072 grid, 720 header (`blog/page.tsx:155`) |
| **/about-data** | no | YES | none | n/a | **672** (`about-data/page.tsx:13`) |

**Seven distinct content widths ship: 1072, 1024, 996, 976, 848, 720, 672.**
None of the pages narrower than 1072 has a stated reason; `max-w-content` exists
precisely so there would be one number, and it is honoured by four page types out
of sixteen.

### Cards

`atlas-card` is the site's canonical surface: white fill, hairline, elevation-1,
and a terracotta top-edge on hover (`globals.css:333-380`). It is also, by a wide
margin, the least used.

Counts are occurrences in `.tsx`, whole repo, then in the default page body only.

| idiom | repo-wide | home | country | region | cell | city | industry | hood | tools/blog |
|---|---|---|---|---|---|---|---|---|---|
| `atlas-card` (canonical) | 56 in 16 files | 5 | 1 | 1 | 2 | 5 | **0** | **0** | 2 / 2 |
| `border-parchment bg-cream-50` hand-roll | 78 in 47 files | 2 | 5 | 3 | 10 | 8 | 5 | 2 | 0 |
| `border-parchment bg-white` hand-roll | 34 in 26 files | 9 | 3 | 3 | 7 | 5 | 3 | 2 | 0 |
| `border-parchment` (any) | 350 in 134 files | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| spine `var(--c-border)` card | 170 in 27 files | 0 (default) | 0 | 0 | 0 | 0 | 0 | 57 (spine) | 0 |
| spine-2 `.card` | its own stylesheet | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

**Four card systems, five if `atlas-card-soft` / `-band` are counted separately.**
Only one of them, spine-2's, is translucent (`--card:rgba(255,255,255,.955)`,
`atlas-spine.css:23`); every other card is fully opaque white or opaque cream.

### Type scale

| page type | h1 | h2 | body base | evidence |
|---|---|---|---|---|
| home | `text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-medium` | `text-2xl md:text-3xl` | Tailwind default 16px | `app/page.tsx:331`, `:543` |
| country | `text-3xl sm:text-4xl md:text-5xl font-semibold` | **`text-xl md:text-2xl`** | 16px | `[country]/page.tsx:881`, `:329` |
| region | `text-4xl md:text-5xl lg:text-6xl font-medium` | `text-2xl md:text-3xl` | 16px | `[geo]/page.tsx:248`, `:287` |
| cell / city / industry (default) | `text-3xl sm:text-4xl font-medium` | varies | 16px | `kit/AnswerFirstMasthead.tsx:126` |
| cell spine-2 | `clamp(32px,4.6vw,48px)` raw | `26px` raw | **14px** | `atlas-spine.css:159,160,126` |
| cell spine-1 | `text-3xl md:text-[2.6rem]` **raw** | n/a | **12px** | `spine/cell/masthead.tsx:42` |
| industry spine | `text-[2.1rem] md:text-[2.75rem]` **raw** | n/a | 12px | `spine/industry/industry-view.tsx:68` |
| city spine / hood spine | `text-3xl md:text-4xl font-semibold` | n/a | 12px | `spine/city/masthead.tsx:36`, `spine/hood/masthead.tsx:72` |
| hood hub default | `text-4xl md:text-5xl font-medium` | n/a | 16px | `neighborhoods/page.tsx:154` |
| /pricing | `text-4xl sm:text-5xl font-semibold` | `text-2xl sm:text-3xl` | 16px | `pricing/page.tsx:66,92` |
| /learn | `text-4xl md:text-5xl font-medium` | n/a | 16px | `learn/page.tsx:100` |
| /tools | `text-3xl md:text-5xl font-medium` | n/a | 16px | `tools/page.tsx:93` |
| /blog | `text-4xl md:text-5xl lg:text-[3.3rem]` **raw** | n/a | 16px | `blog/page.tsx:159` |
| /about-data | `text-4xl font-semibold`, **no `font-display`** | n/a | 16px | `about-data/page.tsx:19` |

Three body scales ship: **Tailwind default 16px** (no `fontSize` override exists
in `tailwind.config.ts`), **`--t-body: 12px`** for the spine kit
(`globals.css:1871`, consumed by 397 `text-[length:var(--t-…)]` uses across 13
files), and **14px** for spine-2 (`atlas-spine.css:126`).

Raw off-scale type sizes (`text-[Npx]` / `text-[Nrem]`) counted in the default
body: home 65, cell 44, city 39, country 27, industry 26, hood 25, region 21.

Two heading-weight conventions coexist with no rule: `font-medium` (home, region,
learn, tools) and `font-semibold` (country, pricing, blog, about-data, and every
spine masthead).

Two font pairs ship. The root layout loads **Newsreader + Inter**
(`app/layout.tsx:15,31,37`). `SpineShell` loads **Geist + Space Grotesk**
(`spine/shell.tsx:31-32`) and its mastheads carry `data-typography="custom"`, so
no spine heading is ever set in the site's display face. spine-2 loads the same
Geist/Space Grotesk pair a second time through `lib/fonts-spine.ts`.

### Palette

Three terracottas ship, and no two are the same colour:

| system | value | evidence |
|---|---|---|
| site tokens | `atlas-500 #e62200`, `atlas-700 #991600` | `lib/design-tokens.ts:59,61` |
| `SpineShell` | `--terra:#fb8469`, `--terra-text:#c2410c` | `spine/shell.tsx:65` |
| spine-2 | `--terra:#c23a22`, `--terra-deep:#9e2e1b`, `--terra-bright:#d4573c` | `atlas-spine.css:91-93` |

Cream, cross-referenced against `scripts/cream_baseline.json` **as of `662c6b25`**
(517 references across 177 files). That file is moving under this audit: another
agent's working tree already has it at 479 across 167 as the hover-state and
hairline legs of the charter §11 purge land. The shape of the distribution is
what matters here and is stable; the absolute numbers are a snapshot.

| area | cream refs | files | note |
|---|---|---|---|
| `src/components/kit/` | **114** | 46 | the shared kit that country, city, industry and legacy-cell all render through |
| `src/components/ui/` | 15 | 9 | |
| `src/components/cities/` | 12 | 7 | |
| `src/components/spine/` | 7 | 4 | |
| `src/components/countries/` | **0** | 0 | |
| `src/components/spine2/` | **0** | 0 | |
| tertiary pages | 22 | 5 | `/pricing` alone carries 12 |

Measured on the default body (chrome excluded): cell 35 refs in 18 files, home 18
in 13, city 17 in 11, industry 16 in 10, country 12 in 8, region 11 in 8, hood 9
in 7.

The two surfaces with zero cream are the two newest. The single largest carrier
is `components/kit`, which is exactly what the founder is looking at on the
country and city pages.

Two banned hues are also live, inside the hero wash gradients
(`globals.css:637-655`): `.atlas-wash--city` uses amber
`rgba(214,134,15,.18)` / `rgba(245,189,92,.14)`, and `.atlas-wash--country` uses
moss green `rgba(111,143,37,.16)` / `rgba(150,180,72,.12)`. The charter's §8 bans
both. `--country` is currently mounted nowhere, `--city` renders on every city
page.

### Icons

Four icon systems, and a tertiary set with none.

| system | files | who uses it |
|---|---|---|
| `AtlasIcon` / `AtlasSpot` (`components/brand/icons`, `/spots`) | 19 / 9 | **11 JSX call sites site-wide** outside `/dev` and `_design`: 4 in the spine kit, 2 on home (`home2-view.tsx`, `AudienceBand.tsx`), 2 in `components/kit` (`HonestTakeBox`, `editorial`), 2 in `components/board`, 1 in `spine/atlas-index` |
| engraved `Glyph` (`kit/engraved/primitives.tsx:384`) | 20 files pass `glyph=` | the country page's Scorecard, Neighbours, SampleState |
| `AtlasPictogram` | 9 | the industry hero (`industries/[industry]/page.tsx:434`) |
| `GlyphIcon` (`components/spine2/GlyphIcon.tsx`) | 43 | spine-2 only |

`/coverage`, `/faq`, `/pricing`, `/tools`, `/learn`, `/blog`, `/about-data`:
**zero icons of any system.** The charter §4 says the fix for an institutional,
text-heavy page is "icons, marks, small graphics... the existing kit already has
`AtlasIcon`, `AtlasSpot`". The kit exists and is rendered in eleven places.

---

## 2. THE DIVERGENCES THAT MATTER, worst first

### 1. Two homepage bands still paint a full-viewport opaque white plate over the photograph, and one of them is the band tick 1 was written for

`ToneBand` wraps each band in `left-1/2 right-1/2 -mx-[50vw] w-screen` plus
`getToneClass(tone)` (`app/page.tsx:69`). `getToneClass` reads
`SECTION_TONES[sectionId] || "white"` (`lib/page-layout/section-order.ts:252`),
and `TONE_CLASSES.white` is `"bg-white"` (`:222`).

- `tone="home-ledger"` (`app/page.tsx:407`) **has no entry in `SECTION_TONES`.**
  The table runs `home-hero`, `home-navigator`, `home-city-picker`,
  `home-sectors`, `home-cities-placeholder`, `home-featured`,
  `home-how-it-works`, `home-audience`, `home-upgrade`, `home-blog-rail` at
  `"paper"` (transparent), and `home-ledger` is simply absent
  (`section-order.ts:188-197`). It falls through to `"white"`.
- `tone="home-newsletter"` (`app/page.tsx:580`) is explicitly `"white"`
  (`section-order.ts:210`).

Both therefore render `bg-white border-t border-parchment/60` across the full
viewport width, opaque, on top of the fixed photograph. Charter §10 records that
tick 1 carded `AtlasLedger` and `CatalogPlates` *"because the content is in
cards"* and the plates *"were the worst case, drawn as faint marks on no ground
at all"*. `AtlasLedger` now sits in a card, inside a band that paints the picture
out behind it for the band's full height. The card is invisible as a card and
B5 is violated for two of the ten bands.

**Recommendation:** `"paper"` wins. Add `home-ledger` to `SECTION_TONES` and
retone `home-newsletter`, both to `"paper"`. Every other live homepage tone is
already `"paper"`; these two are the exceptions, not the rule.

### 2. The recorded fix for the country and city page grounds landed on components no route renders

Charter §10 lists as done: *"page grounds removed from `CoverageHubV2`,
`CityHeroV2` and `CountryScorecardV2`"*.

- `CoverageHubV2` is mounted by `(site)/coverage/page.tsx:57` and
  `(site)/coverage/[iso2]/page.tsx`. Real.
- **`CityHeroV2` is imported by exactly one file: `src/app/_design/v2-review/page.tsx`.**
- **`CountryScorecardV2` is imported by exactly one file: the same one.**

`src/app/_design/` is a Next.js private folder. It is not routable. The city page
renders `AnswerFirstMasthead` inside `HeroWash` (`cities/[slug]/page.tsx:436-451`)
and the country page renders its own hand-rolled hero
(`[country]/page.tsx:872-893`). Neither v2 component is on any page a reader can
reach.

Two of the three grounds recorded as removed were removed from components nobody
renders. This is the mechanical reason the founder can look at a country page and
a city page after the fix and see no change.

**Recommendation:** treat both as not done. The live grounds are
`HeroWash`/`.atlas-wash` (item 4) and the country hero block.

### 3. `atlas-card` is the canonical card and is the least-used of four card systems

`atlas-card` is the only surface on the site with the seating shadow
(`--atlas-elev-1`) and the terracotta top-edge on hover
(`globals.css:333-380`). It appears 56 times in 16 files. The pages the founder
is judging use, instead, `rounded-lg border border-parchment bg-cream-50`:
78 occurrences in 47 files, and 5 of them on the country page alone
(`[country]/page.tsx:339` is the wrapper every carded `EngravedSection` uses,
plus `:1160`), 8 on the city page (`cities/[slug]/page.tsx:470,566,820,862,894`
and others). That idiom is flat, has no elevation, and its fill is cream, which
is banned.

Under §1 B6 the card is the whole mechanism of legibility over the photograph. A
flat cream rectangle with a hairline is the weakest available version of that:
no lift, and a fill that is warmer than the ground it sits on.

**Recommendation:** `atlas-card` wins, on merit rather than on count. It is the
only variant with elevation, it already reads white-on-picture correctly, and its
hover gesture is the one the design system documents. The 78 parchment+cream
hand-rolls converge onto it. Do the card migration and the muted-fill leg of the
cream purge (charter §11 step 4) together, since they touch the same lines.

### 4. Seven routes still paint an opaque page-ground band behind their masthead

`.atlas-wash { background: var(--atlas-surface-paper); }` (`globals.css:633-636`).
`--atlas-surface-paper` is `#f7f7f8`, fully opaque. `HeroWash` renders that band
whenever the warm frame is on, which is the default
(`feature_flags.ts:99`, `kit/frame/HeroWash.tsx:49-55`).

Mounted at: `cities/[slug]/page.tsx:436`, `industries/[industry]/page.tsx:430`,
`[country]/[geo]/[industry]/page.tsx:1133`,
`[country]/[geo]/[industry]/[sub]/page.tsx:557`,
`(site)/compare/CompareClient.tsx:910`, `(site)/learn/[slug]/page.tsx:162`,
`components/NeighborhoodOverview.tsx:365`.

Separately, the region page paints two full-width opaque sections directly:
`<section id="hero" className="py-10 md:py-14 bg-white">` (`[geo]/page.tsx:236`)
and `<section id="neighborhoods" className="py-10 md:py-14 bg-cream-50">`
(`:286`).

Every one of these is the same defect as item 1: an opaque plate exactly where
§1 B5 says the picture must still read, and the top of the page at that.

**Recommendation:** the transparent treatment wins. `HeroWash` should keep its
radial tint and drop the `var(--atlas-surface-paper)` base layer, which also
retires the amber and moss gradients in the same edit. The region page's two
`bg-*` sections become bare and their content goes into cards.

### 5. Three type scales, three terracottas, two font pairs: the spine surfaces and the legacy surfaces are two different design systems, and both ship

Body text is 16px on the legacy pages, 12px on the spine kit
(`globals.css:1871`), 14px on spine-2 (`atlas-spine.css:126`). The accent is
`#e62200`, `#fb8469` and `#c23a22` in the three systems. Headings are Newsreader
on the legacy pages and are deliberately excluded from Newsreader on the spine
pages via `data-typography="custom"`.

This is not drift inside one language; it is two languages. Any convergence
decision made per-property will be relitigated on every page until one of the two
is named as the target.

**Recommendation:** name the target before doing any of the smaller items. On
present evidence the spine-2 system is the stronger candidate: it carries zero
cream, zero hand-rolled parchment cards, the only translucent card surface
(`rgba(255,255,255,.955)`, which is what sitting over a photograph actually
wants), and one internally consistent scale. But it is also the only system with
no site chrome (item 6), so adopting it is a bigger decision than a colour
choice, and it is the founder's to make.

### 6. The flagship cell page renders with no site chrome at all

`[country]/[geo]/[industry]/page.tsx:1410-1414` computes
`bare = isSpineReformEnabledFor("cell") && loadSpine2Cell(...) != null` and, when
bare, returns the body without `SiteChrome`. No `SiteChrome` means no
`AtlasFrame` (`SiteChrome.tsx:64`), so the spine-2 cell page has **no masthead,
no site footer, no watch tray, and no photograph**. It substitutes its own
masthead, its own `JumpNav` (`spine2/page/CellPage.tsx:56-77`) and its own
`SiteFooter` (`spine2/SiteFooter.tsx`).

The reason recorded at that call site is sound for the duplication it was
avoiding. It is not sound as a permanent answer, because the result is that the
single page the redesign exists to prove is the one page that shares nothing with
the rest of the site.

**Recommendation:** the chrome wins. A reader who lands on a trade page and
cannot get to Countries or Cities from the top of it is on a different website.
The duplication should be resolved by giving spine-2 a chromeless *inner* layout
under the shared masthead, not by dropping the masthead.

The same class of problem, smaller: four spine views render `<main>` inside
`SiteChrome`'s `<main>` (`spine/cell/cell-view.tsx:542`,
`spine/city/city-view.tsx:582`, `spine/industry/industry-view.tsx:684`,
`spine/hood/hood-view.tsx:81`), all four with `max-w-[1120px]`, a raw duplicate of
the `max-w-content` token, plus a second `px-4 md:px-6` on top of the chrome's
`px-6`. Nested `<main>` is also an accessibility defect.

### 7. Seven content widths, and `max-w-content` is honoured by four page types of sixteen

See the matrix. The outliers with no stated reason: city 1024
(`cities/[slug]/page.tsx:430`), pricing 1024 (`pricing/page.tsx:64`), tools 976
(`tools/page.tsx:88`), hood hub 976 (`neighborhoods/page.tsx:145`), learn 848
(`learn/page.tsx:87`), about-data 672 (`about-data/page.tsx:13`), spine-2 996
(`atlas-spine.css:153`).

The city one matters most: it is the only page type whose column is narrower
than its siblings purely because of a doubled padding, and it is one of the two
pages the founder called out.

**Recommendation:** `max-w-content` (1072 inner) wins for every page that is not
a reading page. `/about-data`, `/learn` and `/blog`'s header are genuine prose and
may keep a measure cap, but the cap should be a named token, not four different
`max-w-*` values chosen per file.

### 8. The tertiary set has no icons and no marks

`/coverage`, `/faq`, `/pricing`, `/tools`, `/learn`, `/blog`, `/about-data`:
zero `AtlasIcon`, zero `AtlasSpot`, zero `AtlasPictogram`, zero engraved `Glyph`,
zero `GlyphIcon`. `/about-data`'s h1 does not even use `font-display`
(`about-data/page.tsx:19`), which makes it the only h1 on the site set in the
body face.

These are low-traffic pages and this is correspondingly the lowest-priority item.
It is listed because §4's prescription ("add elements", "small signals, the
icons") is currently unimplementable on seven routes without inventing something,
and it does not need inventing: the kit exists.

---

## 3. THE CALL ON "the country pages are totally not updated... the city pages are also not updated"

He is right about both, and **the two need different fixes**, because only one of
them is a flag problem.

### Country: renders an older design, AND is structurally unflippable

Not a flag problem in the ordinary sense. `isSpineReformEnabledFor("country")`
resolves through `resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_COUNTRY, false)`
(`feature_flags.ts:196`) and the `false` is `masterEnables`, so the global master
**cannot** turn it on by design (`feature_flags.ts:205-210`, and the reason is
stated at `:194-195`: *"Illustrative hero has no honest country-level source"*).
Charter §5 confirms: country is blocked on data, not design.

So what renders is the only thing that can render, and here is precisely what is
old about it:

1. **Its component family is two months older than the current language.**
   `src/components/kit/engraved/primitives.tsx` was last touched **2026-06-15**
   (`7c592e61`, "Engraved foundation"). The route file itself has only had
   mechanical edits since; its last content commit is 2026-08-09.
2. **Its cards are the flat cream hand-roll.** `[country]/page.tsx:339` is the
   wrapper for every carded section: `rounded-lg border border-parchment
   bg-cream-50`. Repeated at `:1160`. No elevation, banned fill.
3. **It has the smallest h2 on the site**, `text-xl md:text-2xl`
   (`[country]/page.tsx:329`), against `text-2xl md:text-3xl` on home and region.
   Its sections read a full step quieter than every other page's.
4. **It carries a SECOND background photograph.** `CountryMastheadImage`
   (`[country]/page.tsx:873`) renders a per-country hero photo inside a
   `rounded-2xl border border-parchment` hero block. That now sits on top of
   `AtlasFrame`'s site-wide skyline. Two photographs, one over the other, on the
   only page type that does this.
5. **It uses no `HeroWash` and no icon kit**, so it also does not match the city
   and industry pages it sits beside in the nav.
6. **Seven of its twenty-two sections can never show anything but an empty
   sample state, for any country**, because the inputs are hardcoded `null` in
   the page itself, not merely unheld for some countries:
   - `reachIndicators` is `null` at `[country]/page.tsx:699`
   - `hireDaysToHire` is `null` at `:670`, which makes `hireHasFull` at `:670-674`
     permanently false, so the `HiringRead` gauge never renders on any country
   - `TalentReality signals={null} culture={null}` (`:1017`)
   - `WhoHasMoney mix={null}` (`:1030`)
   - `OpportunityGap trades={null} sample` (`:1075`)
   - `SameBusinessAbroad trade={null} here={null} abroad={null} sample` (`:1084`)
   - `SpecialZones zones={null}` (`:1093`)
   - `LicenceCheck items={null}` (`:1102`)
   - `YourLifeHere dimensions={null} sample` (`:1226`)
   - two of the four `GroundUnderYou` factors are `score: 0.5, sample: true`
     (`:719-720`)

   That last one is the honest answer to why the page reads as unfinished rather
   than merely old. A third of it is designed placeholders. That is a data
   problem, correctly handled, and it is not fixable by design; but it is what
   a reader sees, so it belongs in the same sentence as the design verdict.

**Fix shape:** design work on the existing engraved body. Cards to `atlas-card`,
h2 to the site step, drop the second photograph or drop `AtlasFrame` behind that
one block, cream out. Do not chase the flag; the flag is correctly closed.

### City: renders an older design, and a newer one exists and is dark

This one **is** a flag problem, and a different one.

`isSpineReformEnabledFor("city")` resolves to
`resolveSpinePage(process.env.NEXT_PUBLIC_SPINE_REFORM_CITY, true)`
(`feature_flags.ts:185`). The `true` means the adapter has shipped and the master
*may* enable it. But `NEXT_PUBLIC_SPINE_REFORM_CITY` is set nowhere in the repo
(`.env.local` holds only `NEXT_PUBLIC_WARM_FRAME=1`; `.env.example:70` lists it
commented out), and `isSpineReformEnabled()` defaults to `false`
(`feature_flags.ts:158`). So `buildSpineCitySeed` and `SpineCityBody` exist, are
marked real, and never run.

What renders instead, and what is old about it:

1. **Its masthead sits on an opaque amber band.** `HeroWash category="city"`
   (`cities/[slug]/page.tsx:436`) → `.atlas-wash--city`
   (`globals.css:642-646`), which paints `var(--atlas-surface-paper)` opaque plus
   an amber radial. The photograph is gone at the top of every city page, and
   amber is a banned hue.
2. **It is the only page type with a doubled content padding.**
   `mx-auto max-w-6xl px-4 md:px-6` (`cities/[slug]/page.tsx:430`) inside
   `SiteChrome`'s `max-w-content px-6`, giving 1024 against everyone else's 1072.
3. **Eight flat cream cards** (`:470, :566, :820, :862, :894` and siblings), same
   idiom as the country page.
4. **17 cream references in 11 files** on the default body, second only to the
   cell page.

**Fix shape: two separate decisions, and they must not be conflated.**
(a) A *design* pass on the legacy body, which is what ships today and will keep
shipping until someone sets an environment variable. (b) A *go-live* decision on
`NEXT_PUBLIC_SPINE_REFORM_CITY`, which is the founder's, is a deploy action, and
would replace the body entirely, making (a) wasted. Whichever is chosen, the
other should not be started.

The same fork applies to `industry` and `hood`, whose adapters are also marked
real and also never run. It does not apply to `region`, which like `country` has
`masterEnables: false` (`feature_flags.ts:193`) and renders its legacy body
permanently.

---

## 4. What was NOT measured

- No render, no screenshot. Section 2 items 1 and 4 were traced through the CSS
  by hand; they are the two findings that most want a picture before anyone acts.
- Mobile. Every width above is desktop. The gutters collapse below 768px
  (`AtlasFrame.tsx:129`) and several of the doubled-padding findings may resolve
  or worsen there; unmeasured.
- Density and whitespace rhythm, which §7 also names. Section spacing was not
  counted.
- Whether `verify_palette_membership` sees any of this. Per charter §11 it
  returns legal at lightness ≥ 93%, so `#f7f7f8` and the cream ramp are invisible
  to it; the amber and moss wash gradients are below that threshold and were not
  checked against the gate. Worth a separate look.

---

## 5. THE CITY FORK, RESOLVED. The legacy body wins, and the flag stays dark.

Section 3 left the city as two decisions that "must not be conflated": a design
pass on the legacy body, or a go-live on `NEXT_PUBLIC_SPINE_REFORM_CITY`. This
section closes it. **The legacy body wins on merit, the flag must stay off, and
the spine body is not merely un-flipped: three of its seven chapters cannot
render for any city, ever, on real data.**

### The instrument

Both bodies were rendered for real, for four cities, with `react-dom/server`
against the real loaders (`.env.local` supplied, so `buildCityActivities` reached
Supabase and returned real rows). The legacy body is the route's own default
export awaited directly; the spine body is `SpineCityBody` fed
`await buildSpineCitySeed(slug)`, exactly what the flag-ON branch mounts.

**What this cannot distinguish:** a section that renders from a section that
renders WELL. It counts headings, anchors and visible words in the emitted HTML.
It says nothing about spacing, colour, or whether a rendered chapter is any good.
It also cannot see the two bodies' different chrome: both sit inside
`SiteChrome`, but the spine one adds its own `<main>` and its own font pair, and
that difference is read from source, not from these numbers.

### The measurement

| city | LEGACY sections / headings / words | SPINE chapters / headings / words |
|---|---|---|
| london | 11 / 10 / **1442** | 4 / 5 / **266** |
| tokyo | 11 / 11 / **967** | 3 / 4 / **141** |
| mexico-city | 11 / 11 / **779** | 3 / 4 / **111** |
| abuja (tier 3, thin) | 11 / 10 / **711** | 3 / 4 / **108** |

The legacy body renders the identical eleven anchors on all four:
`headline, honest-take, customer, space, visitors, owners-keep, best-areas,
neighbourhoods, changing, peers, one-thing`. That is the agreed city section
spine, complete, on a tier-3 African city with almost no held data, because every
section either fills or falls to a calm `SectionEmpty` rather than vanishing.

The spine body renders `What space costs`, `Who buys, and when` and `The next
move` on all four, plus `Where to trade` on London alone.

### Three chapters are STRUCTURALLY unreachable, not merely empty

This is the finding that settles it, and it is a code fact, not a data fact:

1. **`What to open, and what it costs`.** `city-view.tsx:577` gates the chapter on
   `t.break_in_0_100 != null && t.cost_to_open_usd != null`. `adapt_city.ts:189`
   says in its own comment: *"cost_to_open_usd / saturation_0_100 DELIBERATELY
   absent (no honest source)."* The predicate can never be true.
   The cost is not that the chapter is missing. It is that the adapter **computes
   the whole real trade leaderboard and throws it away**: 8 real rows for London,
   8 for Tokyo, each carrying a real take-home, net margin and break-in score,
   and `LowestBar` filters every one of them out on the missing cost field. The
   legacy body renders those same rows, in full, as `OwnerKeepTable`.
2. **`What to watch`** (`:578`) needs `risks`, `character`, `locals_intel` or
   `owner_runway`. `adapt_city.ts:424-426` lists all four as OMITTED.
3. **`The city's conditions`** (`:601`) needs `lenses.scales`. Same list.

So the spine city page is a four-chapter page at its London best and a
three-chapter page everywhere else, and no amount of new city data changes that
without adapter work. `where_to_trade` is London-only by construction
(`adapt_city.ts:327`, `isLondon &&`), and `income` needs the London-only
sanctioned spread, so 251 of the 252 cities lose the verdict, the district map
and the income curve as well.

### What the flag would also cost, beyond the sections

- The spine body opens `<main className="mx-auto max-w-[1120px] px-4 md:px-6">`
  (`city-view.tsx:582`) INSIDE `SiteChrome`'s `<main class="max-w-content px-6">`.
  That is a nested `<main>`, an accessibility defect, and it re-creates the
  doubled content padding that this same audit named at `cities/[slug]/page.tsx:430`
  as the site's only instance. Flipping the flag would not fix that defect; it
  would move it.
- `SpineShell` supplies `--c-card:#ffffff`, fully opaque (`shell.tsx:65`). Every
  spine `Box` is therefore an opaque hole in the fixed photograph, which is the
  founder's most repeated complaint. `.atlas-card` is `rgba(255,255,255,.955)`.
- It brings the second font pair, the 12px body scale and the third terracotta
  (`#c2410c`) onto a page that currently carries the site's own, which is a
  divergence this audit's item 5 exists to close, not to widen.

### The verdict

**Work the legacy body. Leave `NEXT_PUBLIC_SPINE_REFORM_CITY` unset.** It is not
"the old version" in any sense the founder would endorse: it is the only body
that renders the agreed sections, the only one that renders them for every city
rather than for London, and the only one already on the site's own card, font and
palette. The spine body is the newer *drawing*; on real data it is the thinner
*page*.

**What the spine body would need before this is worth revisiting**, stated so the
decision is falsifiable rather than a preference: an honest source for
cost-to-open (unblocks a chapter and 8 already-computed real rows per city), for
the four risk/character/locals/runway blocks (unblocks a second chapter), and for
the lens positions (a third); district coordinates and per-city district sets
beyond London; then the nested `<main>`, the opaque `--c-card` and the second
font pair resolved against the site's chrome. That is adapter and data work, not
design work, and none of it is in this scope.

### Already closed, verified in the same render

Both defects section 3 lists against the legacy city body were fixed by
`4acfb611` and are confirmed absent from the emitted HTML: `atlas-wash` appears
**0** times for all four cities (the hero is one `.atlas-card` now,
`cities/[slug]/page.tsx:455`), and the `max-w-6xl px-4 md:px-6` wrapper is gone,
so the column is the site's 1072.

`.atlas-wash--city` (`globals.css:642`) is now **dead code with no call site**:
`HeroWash category="city"` appears nowhere in `src/`. It carries the banned amber
`rgba(214,134,15,.18)`. Deleting it belongs to whoever owns `globals.css`; it is
reported here rather than done.

What the same render says is still wrong, and is the work below: **29 to 36
`bg-cream-*` occurrences and 12 to 14 hand-rolled `bg-white` surfaces per city
page**, against 10 to 15 `.atlas-card`.
