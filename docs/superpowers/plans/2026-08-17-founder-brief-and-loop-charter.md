# Founder brief, 2026-08-16 review, and the standing charter for the autonomous loop

> **For agentic workers:** this is the authority document for the `/loop 30m`
> that runs unattended. Read it in full before your first action of any tick.
> Every rule here comes from the founder's own words, quoted, so you can tell a
> ruling from an inference.

**Goal:** get marginatlas.com to a homepage the founder wakes up to and thinks is
perfect, and carry the same design across every page type, working only on the
newest version in the repo.

---

## 0. The three rules that override everything

1. **Work on the newest version in the repo. Do NOT chase the live site.**
   Verbatim: *"your challenge is not to put everything in an update... your
   changes to improve the existing model that might not be, that might not be
   even live... Do not worry about the live page."* Production is behind and may
   stay behind. Never revert or redesign because production looks different.

2. **Quality over speed.** Verbatim: *"you're just addressing the fast without,
   you know, thinking about the quality of what you're doing, okay? That's a
   very big problem still."* One considered change beats five fast ones. If a
   tick produces one excellent thing, that tick succeeded.

3. **Measure before you change, and read the module that produces a number
   before acting on it.** Six measurement artifacts have died to this step in
   this project. If you cannot write the sentence "this measurement cannot
   distinguish X from Y", the measurement is not ready to act on.

---

## 1. THE BACKGROUND. He has explained this three times; get it right.

Verbatim, most recent and most precise:

> *"The background should be present on all the page, okay, as a background. It
> should stretch on all the page, and when the person scrolls, the background
> just stays static, but it covers the whole screen except the header. Now, the
> background on the edges is totally visible, like on the left and on the right,
> but on the center, it's also visible, but with some level of opacity, okay?
> Like we use the style of those cards, okay? We put everything in those cards."*

Decomposed into checkable requirements:

| # | Requirement | How to verify |
|---|---|---|
| B1 | The photograph is fixed and does not move on scroll | `position: fixed` on the layer; scroll the page and the image must not translate |
| B2 | It covers the whole screen | `inset: 0`, full viewport |
| B3 | It is NOT behind the header | the masthead sits on its own solid ground; the picture starts below it |
| B4 | Left and right edges show the picture at full strength | no white plate over the gutters |
| B5 | **The centre also shows the picture**, softened | the centre must NOT be an opaque or near-opaque plate |
| B6 | **The softening comes from the CARDS**, not from a band | content lives in cards; the card is what sits over the picture |

**What is currently wrong.** `src/components/AtlasFrame.tsx` implements B1, B2 and
B4 correctly, and gets B5 and B6 wrong: it paints a passe-partout at `.82` white
across the whole content column, which is a near-opaque plate exactly where he
says the picture should still read. It also does not implement B3.

**The correction, stated plainly:** delete the centre plateau. The band becomes
either nothing at all or a very light wash (start at `.16`, the value already
used for the gutters, and judge from a screenshot). Legibility then comes from
putting content in cards, which is what he means by *"we put everything in those
cards"*. Any band or section that still paints a full-width opaque ground is a
bug, not a style choice.

**Consequence you must handle:** with no centre plate, any text NOT in a card
sits directly on the photograph. Every homepage band therefore needs its content
in a card, or it becomes unreadable. That is the real work of this item, and it
is why it cannot be done as a one-line change.

---

## 2. CREAM IS BANNED. Completely.

Verbatim: *"to remove completely this creamy color from the page. That's totally
not allowed."*

This is a palette purge, not a tweak. Cream is currently:

- `--atlas-surface-paper: #fbfaf7` on `body` in `src/app/globals.css`
- the whole `cream` ramp in `src/lib/design-tokens.ts` (50/100/200/300/400...)
- hundreds of `bg-cream-*`, `text-cream-*`, `border-cream-*` utilities across
  `src/components` and `src/app`
- `to-cream-50` gradients, `bg-cream-200` bars, `thead` tints

Do this as a **measured, staged migration**, not a find-and-replace:

1. Count the usages first and write the number down.
2. Decide the replacement per role, not per token: page ground, card surface,
   hairline, muted fill. White and the cool neutrals already in the palette.
3. Migrate one role at a time, gate after each.
4. `cream[50]` is `#ffffff` and is therefore already white; it is a naming
   problem, not a colour problem. Handle it last and separately.

**Do not** leave the ramp defined and unused: a token that still exists will be
used again. Removing it from `design-tokens.ts` is part of done.

---

## 3. THE H1 IS SETTLED. Do not touch it again.

Verbatim: *"you changed the H1 of the homepage, which is a big mistake, it was
just perfect."*

It is restored as of `d82427e3`:

> How much does a **{rotating business}** make in **{rotating city}**?

It asks the visitor's own question in their own words. The declarative BRAND.md
line that replaced it described the product to the reader instead, which is the
"institutional" failure named in §4. **This is now a locked value. Any future
argument for changing it, including "motion competes with the search", has
already been made and rejected.**

---

## 4. THE HOMEPAGE IS INSTITUTIONAL, TEXT-HEAVY AND DETACHED

Verbatim: *"the homepage still feels detached. It doesn't have a lot of, it's a
little bit institutional and not very relevant to the person who might be
visiting, okay? It lacks flavor, it lacks elements. It just has a lot of text,
when it should not."*

And: *"you should think how to make the homepage like how they look when it
comes to the other, you know, similar websites. There is some small signals, the
icons. The thing is that our pages should not be bloated with text."*

Working definitions, so this is actionable rather than a mood:

- **Cut text.** Every band: count the words. A lede over two lines is too long. A
  paragraph under a heading that repeats the heading goes entirely.
- **Add elements.** Icons, marks, small graphics, the numbers themselves set
  large. The existing kit already has `AtlasIcon`, `AtlasSpot`, the trade icons
  and the spine glyphs. Use them; do not invent a new icon language.
- **Relevance beats description.** Speak to the person deciding whether to open
  a business. "How much does a bakery make in Lisbon" is relevant; "what the
  atlas holds" is institutional. Where a band must be institutional (coverage,
  method), make it small and quiet rather than a full band.
- **The models are Airbnb, airlines, premium rentals.** What they share: the
  page shows inventory, not descriptions of inventory; headings are small and
  content carries the weight; and there is very little prose.

---

## 5. OTHER PAGE TYPES ARE NOT UPDATED

Verbatim: *"the country pages, they are totally not updated. They are not
updated, they have the old version. The city pages, the city pages are also not
updated."*

Note this is about the **repo's newest version**, per §0.1, not about which flag
is set in Vercel. Two separate things and you must not confuse them:

- The **spine reform** page bodies exist behind `isSpineReformEnabledFor(page)`
  in `src/lib/feature_flags.ts`. `cell`, `industry`, `city`, `hood` are marked as
  having real adapters; `country` and `region` are marked illustrative and the
  master flag deliberately cannot enable them.
- The **design** (frame, cards, palette, density) is a separate axis and is
  yours to improve on whichever body is current.

`country` is blocked on data, not design: *"Illustrative hero has no honest
country-level source."* Improve its design; do not fabricate its data.

---

## 6. /cities IS BROKEN

Verbatim: *"I went to the cities page, and it's just a big list of cities which
doesn't end, and it's executed completely, completely awful way. And the map of
the world is not even visible."*

Two distinct defects:

1. **The endless list.** `/cities` renders every city with no grouping, no
   hierarchy and no end. It needs structure: group, rank, or paginate, and lead
   with something other than a list.
2. **The missing map.** `WorldMapPicker` fetches `/geo/countries-110m.json` and
   falls back to a plain grid of country codes when that fetch fails. In
   production that file returned **404 with a valid body**, because middleware
   classified `/geo/...` as a country it does not hold. Fixed in `310600c5`.
   **Verify the map actually draws before assuming this is closed**, and check
   `/cities` uses the same picker.

---

## 7. COHESION

Verbatim: *"you should check about how cohesive all the pages are."*

One visual language across home, country, city, cell, industry, neighbourhood
and the tertiary pages: same frame, same card treatment, same type scale, same
palette, same density. When two page types solve the same problem differently,
one of them is wrong; pick the better and converge.

---

## 8. Hard constraints that predate this review and still hold

- No em-dashes in user-visible copy. Gate: `verify_no_em_dashes`.
- No source-agency names in copy. Gate: `verify_no_source_agencies`.
- No URL slug renames.
- No raw hex / px / ms in components; tokens only.
- Terracotta plus cool neutrals ONLY. No green, no amber, no brown, and now no
  cream. Gate: `verify_palette_membership`.
- No stock imagery. Gate: `verify_no_stock_imagery` (a ratchet; never add an
  entry to make it pass).
- Never raise a ratchet baseline to make it pass.
- Never drop or butcher an agreed section.
- `.mcp.json` is intentionally dirty; never commit it.
- `npm run build` is not part of the normal cadence. `npx tsc --noEmit` and
  `npm run prebuild` are.

---

## 9. Verification cadence, every tick, no exceptions

1. `npx tsc --noEmit` must be clean.
2. `npm run prebuild` must be **99/99**. It was 97 when this was written, 98
   when `verify_no_cream` was added, and 99 since `strip-comments` was wired in.
   The loop's own standing prompt still says 97/97; the chain is the authority,
   not the prompt, and a gate count that reads low is how a missing gate hides.
3. Render what you changed and read it back. The local dev server is slow and
   dies often; when it does, render the component directly with
   `react-dom/server` and assert on the output. Both techniques are proven in
   this repo.
4. Commit with a message that says what was wrong, what changed, and what was
   measured.
5. **Never push.** The founder pushes.

### 9.1 THE SCREENSHOT NOW EXISTS. Take one.

Built 2026-08-17 (`b12794d4`). Until then this document said, every tick, that
no screenshot existed and every background claim was verified as *declared*
rather than *seen*. That is closed, and it found a defect on its first run that
nothing else could have.

The recipe, no dev server involved:

1. Compile the real stylesheet:
   `npx tailwindcss -i src/app/globals.css -o <scratch>/site.css --minify`
   (the CLI does inline `@import`, unlike the project's own postcss config)
2. Render the real route by awaiting its default export, and write
   `<!doctype html>…<style>{that css}</style>…{markup}` to a file.
3. Two shims are required and both are documented traps, not defects:
   `next/font/google` is a build-time transform and is not a function at
   runtime; `useRouter`'s invariant throws with no app router mounted, which
   halts the render inside `GlobalSearch`. Stub the three router hooks ONLY and
   leave `notFound` and `redirect` real, or the harness reports a page as
   rendering when the route 404s. Also stub `.css` and image imports, which the
   CJS loader tries to parse as JavaScript.
4. `file:` is blocked in the browser tools. Serve the scratch dir AND
   `public/` over one tiny static server, so `/spine/_skyline.jpeg` resolves at
   the path the markup asks for.
5. Navigate, `browser_evaluate` to scroll and to read computed values, then
   screenshot as **jpeg** and Read it.

Its blind spots, before it is trusted: SSR pass only, so anything appearing on
hydration is absent; the data bands self-omit from this machine, so their
absence is never a layout finding; and it proves what the browser PAINTS, never
that the founder likes it.

### 9.1.1 WHAT MAY SIT ON THE BACKDROP. Measured, so stop guessing.

Taken 2026-08-17 by composing the backdrop exactly as `AtlasFrame` does, an
opaque white base under `/spine/_skyline.jpeg` at `opacity: 0.32`, then reading
every pixel's relative luminance off a canvas.

| | |
|---|---|
| backdrop luminance, darkest point | **0.4179** |
| backdrop luminance, mean | 0.7207 |
| backdrop luminance, lightest | 0.9962 |

Because the photograph sits at 0.32 over white, even its darkest region is a
light grey. Contrast against that worst case:

| foreground | ratio on the backdrop | verdict |
|---|---|---|
| `ink-900` body and headings | **7.78:1** | passes AA and AAA |
| `atlas-700` at 60px (the H1's rotating words) | 3.79:1 | passes: large-text AA is 3.0 |
| `atlas-700` at 12 to 14px | **3.79:1** | **FAILS**, AA needs 4.5 |
| `atlas-800` at 12 to 14px | 5.29:1 | passes |
| `ink-900` on a card, for scale | 17.46:1 | |

**This settles the question in BOTH directions, which is why it is worth a
table.** A visual pass of the homepage found every section heading sitting bare
on the photograph and nearly restructured eight bands to card them. The
measurement says do not: headings clear AAA where they are, and carding them
would have cost the "backdrop reads between the cards" look §1 exists to
protect, for nothing.

What it does condemn is small terracotta. Nine `atlas-700` elements render on
the backdrop; four are the H1's 60px rotating words and pass on the large-text
rule, which matters because the H1 is locked (§3). The rest fail: two "All ... ->"
links, fixed to `atlas-800`, and the "Free and paid" eyebrow at 12px, **still
open**, because `SectionEyebrow` is shared and most of its uses sit on cards
where `atlas-700` is correct. That one wants a per-call-site override or a
backdrop variant, not a global colour change.

**The rule to carry forward:** ink on the backdrop is fine at any size.
Terracotta on the backdrop is fine only above roughly 24px. Below that it needs
`atlas-800` or a card.

### 9.2 THE PAINT RULE. Read this before touching any background.

`AtlasFrame` paints two `position: fixed` layers at `z-index: 0`, the first an
**opaque white base**. CSS paints positioned z-index-0 descendants AFTER in-flow
non-positioned ones, and that ordering covers **backgrounds and inline text
alike**.

**Therefore anything `position: static` on this site is not drawn at all.** Not
dimmed. Not washed out. Absent.

The site was getting away with it by accident: every homepage band is wrapped in
`ToneBand`, which happens to be `relative`, and every `.atlas-card` is
`relative` by rule. Everywhere neither applied, content vanished:

- the country page's sections were static, which is the mechanical reason the
  founder said that page "is not updated"
- **the entire site footer** and the newsletter bar above it, on every page,
  since the frame went site-wide: black ground, wordmark, all five link columns
  and the copyright, none of it painted

Closed structurally rather than per component: `<main>` in `SiteChrome` is now
`relative`, which lifts every page's whole content subtree into the same paint
step, plus `relative` on the two chrome elements that sit outside `<main>`. Safe
by construction, no offsets so layout is untouched, and `z-index: auto` so no
stacking context is formed and descendant z-indexes still compete in the root
context.

**Nothing in the source was wrong.** Every class correct, every token correct,
98 of 98 gates green, and the page still blank where the footer should be. Only
a rendered pixel can find this class of defect.

### 9.3 PARALLEL AGENTS SHARE ONE WORKING TREE. Three rules follow.

This loop runs three or four specialist agents at once in the SAME checkout,
with non-overlapping FILE ownership. That works for editing and fails for
anything that acts on the tree as a whole. Learned on 2026-08-18, all three
of these actually happened in one tick:

1. **NEVER run `git stash` (or `checkout .`, or `reset --hard`).** Stash is
   tree-wide, not file-wide: one agent stashed to isolate a typecheck and swept
   up two other agents' uncommitted work with it. The blog agent recovered its
   own from `stash@{0}` and checkpoint-committed immediately, which is the only
   reason nothing was lost. To isolate a typecheck, use a separate worktree.

   The residue is its own hazard. A stash holding a PRE-DELETION state is a
   loaded footgun: popping it later silently restores 462 lines that a commit
   had deliberately removed. Before dropping one, prove it is superseded rather
   than assuming: diff each stashed file against the commit that landed it. In
   this case `blog/page.tsx` was byte-identical to its committed checkpoint and
   `cell_board.ts` differed only by the sections `e36784b8` deleted on purpose.

2. **`npx tsc --noEmit` and `npm run prebuild` are also tree-wide.** A failure
   may belong to another agent mid-write, and has: the take-home gate failed
   twice on a baseline another agent was writing at that instant, and passed on
   re-run. Before reporting a red gate, check whether the failing file is yours.
   Verifying in an isolated worktree at HEAD plus your own file is the honest
   way to claim a clean run while the shared tree is dirty.

3. **Commit incrementally, and mean it.** Every agent that batched its work has
   lost some; every agent that checkpoint-committed has kept all of it.

Known local traps, already paid for:

- Data bands (`ExampleTiles`, `StateComparison`, `Specimen`) self-omit on the
  local dev server because cell lookups exceed the 4s budget from this machine
  to eu-west-1. They render in production. **Do not "fix" this** by raising the
  budget, caching, or softening the self-omit.
- The browser preview pane has a 0x0 hidden viewport: `.focus()` does nothing,
  IntersectionObserver never fires, and layout measurements are all zero.
  Anything interactive must be verified in jsdom instead.
- Bash heredocs eat backslashes. Use the Write tool for anything with a regex.
- **RESIZING THE VIEWPORT WITHOUT RELOADING LIES ABOUT HEIGHT.** Measuring
  `/blog` after a resize reported 12,282px where a fresh load of the identical
  file gave **32,114**. Reload after every resize, or the number is fiction.
- **COMPILE THE STYLESHEET AFTER WRITING THE FILE, NOT BEFORE.** Tailwind emits
  only the classes it can see, so a class written after the compile emits NO
  RULE and the element silently renders unstyled. This has now cost twice: a
  `lg:columns-2` index measured TALLER at 1280 than at 768, and an
  `--atlas-header-h` token read as empty because the arbitrary-property class
  post-dated the compile. If a measurement is impossible, suspect this first.

---

## 10. What has already been done, so the loop does not redo it

`AtlasFrame` mounted site-wide in `SiteChrome`; the six Unsplash page
backgrounds replaced by the founder's own `/spine/_skyline.jpeg`; the content
column narrowed to 1120 via `max-w-content`; the homepage's hero-only photograph
removed; the world-map 404 fixed; the `Specimen` band added (one real answer,
$503K in, $57K kept, 11%); the comparison band leading with its spread; the
tiles retitled; page grounds removed from `CoverageHubV2`, `CityHeroV2` and
`CountryScorecardV2`; the H1 restored.

**Added after the first loop tick, 2026-08-17:**

- §1 B5/B6 are DONE (`b144d6b6`). The centre plate went from `.82` to `.35` and
  the gutters from `.16` to `0`, so the edges are the picture at full strength
  and the middle is the same picture softened. That was only safe because the
  content is in cards: eight of the ten homepage bands already wrapped theirs,
  and the two that did not, `AtlasLedger` and `CatalogPlates`, were carded in
  the same commit. The plates were the worst case, drawn as faint marks on no
  ground at all.
  **The `.35` is a first honest value, not a measured one. It wants a
  screenshot.** The constraint: the picture must read through the middle, and
  dark text on the card edges must not fight it.
- §1 B3 is DONE. `.atlas-glass-chrome` was `rgba(251, 250, 247, 0.72)` with a
  14px backdrop blur: the masthead was translucent cream, on every page, since
  `isWarmFrameEnabled()` defaults to true. Translucent broke B3 because the
  photograph read through the header; cream broke §2. Both fixed in one rule:
  the bar is now opaque `var(--atlas-surface-card)`, the blur is gone (it had
  nothing to refract behind an opaque fill), the bottom hairline stays, and the
  `@supports` fallback was deleted because both branches had become identical.
- The H1 is restored (`d82427e3`) and is now a locked value. See §3.

- **§6 DONE.** `/cities` went from 20,459px and 2.54MB to 5,152px and 1.06MB,
  30 screens to 7, with all 252 city URLs kept and prose cut from five blocks to
  two. The world map was drawing all along, invisibly: 177 country paths in
  cream-200 on a cream-400 half-pixel outline against a white card. Now ink at
  0.9px. A visitor figure was dropped from the cards, correctly:
  `tourist_arrivals_m` is stored as country-arrivals-over-divisor, so 21 US
  cities all read 13.4M while Orlando read 8.4M and Las Vegas 6M.

- **THE CREAM BAN IS NOW ENFORCED, and it was not before.** `verify_no_cream` is
  gate 98, a ratchet at **517 references across 177 files**
  (`scripts/cream_baseline.json`). It counts down only: a file may shrink, never
  grow, and an entry reaching zero must be deleted in the same commit.
  This was necessary because **`verify_palette_membership` cannot see cream by
  design.** It returns legal for anything above 93% lightness and its own
  comment names cream as "the cream this site is printed on". `#fbfaf7` measures
  97.6%. Its baseline of 165 was never evidence the purge was working; it could
  not have moved in either direction. Do not try to widen that gate instead:
  lowering the 93 re-catches every warm and cool white on the site.

- **A STACKING RULE EVERY AGENT MUST KNOW.** `AtlasFrame` paints from
  `position: fixed` layers at `z-index: 0`. A `position: static` element with a
  background therefore paints UNDERNEATH the photograph. Any card, panel or
  ground you add must be `relative`, or it silently sinks behind the picture.
  This washed out the `/cities` hero at 1001x820 before it was caught, and the
  two homepage cards added in the same tick were saved only by `ToneBand`
  happening to be positioned.

**§2 IS DONE, 2026-08-17.** All six roles migrated and the ramp renamed; nothing
on this site is called cream and the ratchet stands at 33, all of them hex
literals counted by value rather than by name. The full record, including the
name chosen and why, the two collapses, the four verification instruments and
the two colour defects deliberately left, is the last block of §11. What is
still open under the ban is narrow and written down there rather than here.

Open and NOT done: §5 (country and region page bodies), §7.

**§4 is NOT "open entirely", and that line was stale by several ticks.**
Corrected 2026-08-17. Read the band you are about to cut before cutting it:
`AudienceBand`, `UpgradeTeaser` and `HomeNewsletter` each carry a header comment
recording a density pass already done on them, with the before-and-after word
count measured off rendered markup. `AudienceBand` went from 67 words of pure
description to four real doors; `HomeNewsletter`'s three sentences became four
marked contents lines; `UpgradeTeaser` lost a lede that restated the table two
lines under it. Nine of the ten section headings were unified to
`font-display text-lg md:text-xl` in the same sweep.

What remains under §4 is therefore specific rather than wholesale, and the way
to find it is to measure, not to assume. Two examples closed in `91774cee`: the
blog rail's card titles were set at the section-heading token, so the heading
and its own six cards were typographically identical; and its eyebrow said
"Writing" over a heading reading "From the Atlas notebook". **All six homepage
eyebrows were tested before that one was cut, and the other five survive**, each
carrying something its heading does not: a count, a price, the axis of a table,
the whole comparison. Cutting on the pattern rather than the test would have
taken all six.

The band harness for this is
`scratchpad/measure_home_prose.tsx` (per-band word counts by ROLE, so a figure
and a sentence are never added together) and, new in `91774cee`, a harness that
renders the REAL `src/app/page.tsx` by awaiting `HomePage()` directly. That one
needs two shims, both documented traps: `next/font/google` is a build-time
transform and is not a function at runtime, and `useRouter`'s invariant throws
with no app router mounted, which halts the render inside `GlobalSearch` before
it reaches the page body. Stub only the three router hooks; leave `notFound`
and `redirect` real, or the harness will report a page as rendering when the
route 404s.

---

## 11. The cream purge: measurement, and the plan for the remaining roles

Measured 2026-08-17 by a role classifier that reads the surrounding source line
rather than the token alone, because `bg-cream-100` is a `<thead>` tint in one
place and a page ground in another. **455 cream utility occurrences across 157
files**, plus the CSS-variable grounds in `globals.css`.

By utility family: `bg-cream-*` 338, `text-cream-*` 56, `border-cream-*` 20,
`fill-cream-*` 8, `ring/ring-offset-cream-*` 13, `decoration-cream-*` 5,
`from/via/to-cream-*` 8, `stroke-cream-*` 3, `divide-cream-*` 1.

By step: `cream-50` 226, `cream-100` 127, `cream-200` 34, `cream-300` 29,
`cream-400` 14, `cream-75` 10. **`cream-500` is defined and completely unused**,
so it can be deleted outright with no call-site work.

**By ROLE, which is the axis the migration runs on:**

| role | n | files | what it is | status |
|---|---|---|---|---|
| card surface | 130 | 66 | `bg-cream-50`, i.e. `#ffffff` | naming only, LAST |
| muted fill | 133 | 71 | `<thead>` tints, chips, tracks, bars | open |
| foreground | 64 | 41 | `text-cream-50` white type on dark, icon fills | open |
| hover state | 46 | 35 | `hover:bg-cream-100` and friends | open |
| hairline | 35 | 21 | borders, rings, divides, underlines | open |
| **page ground** | **47** | **31** | body/html/`<main>`/sticky-nav grounds | **DONE** |

**Done this tick (page ground only).** Four edits, all inside the two files the
palette agent owns:

1. `--atlas-surface-paper` `#fbfaf7` -> `#f7f7f8` in `globals.css`. One token,
   12 call sites in that file including `.atlas-frame-gutters`, the centre veil,
   the four `.atlas-wash` grounds and `--atlas-tone-paper`.
2. `--background` `251 250 247` -> `247 247 248`. **This was a SECOND page ground,
   not a duplicate:** `html` paints `rgb(var(--background))` and `body` paints
   `var(--atlas-surface-paper)`, so migrating only the body token would have
   left cream on the html element underneath, visible in the overscroll gutter.
3. `colors.cream[75]` `#fbfaf7` -> `#f7f7f8` in `design-tokens.ts`. Retoned, not
   deleted, because that step has exactly one role: all ten usages were checked
   individually and every one is a ground. One edit migrated all ten with zero
   component churn.
4. `.eng-hero__fade` ran cream through its three visible stops to a final stop of
   `var(--surface-card)`, which is white. Now white throughout.

`#f7f7f8` is not invented: it is `--paper` from `src/styles/atlas-spine.css`,
the v2 system whose first ratified rule reads "NEUTRAL PALETTE. No cream, no
warm tint." The hue flips from h 45 warm to h 240 cool. Contrast was computed,
not assumed, against the eight foreground tokens that sit on this ground: the
new value is a hair darker (l 97.1 vs 98.4), the largest ratio change is 0.42
on a ratio of 16.7, and **zero AA verdicts flip** in either direction.
Converging on this value also serves §7.

**THE PALETTE GATE CANNOT SEE CREAM, and nothing should be read into its 165.**
`verify_palette_membership` returns legal for anything at lightness >= 93%, a
deliberate rule so that paper tones are not judged as colours. `#fbfaf7` is 98%.
So the gate passed on every cream on this site and always would have. The count
sat at 165 before and after this change. **The cream ban is currently NOT
machine-checkable**, which under the working method's rule 4 means it must
either become a gate or be written down as unenforced with the reason. It is
written down here, and the gate is the first item below.

### The order for the remaining roles, and why this order

Take them in ascending blast radius. Each is one tick, gated after.

1. **Add the ratchet gate FIRST, before migrating anything else.** A
   `verify_no_cream` that counts cream token references per file and refuses to
   grow. Without it, every role migrated below can silently come back, and the
   founder has already had rulings return a second time for exactly this reason.
   Note this makes the chain 98 gates, so the expected prebuild line becomes
   98/98, not 97/97.
2. **Hover states (46, 35 files).** Safest of what is left: a hover tint is
   transient, never load-bearing, and a wrong value is visible only under the
   cursor. `hover:bg-cream-100` -> the neutral equivalent.
3. **Hairlines. DONE 2026-08-17.** See "Hairlines, done" below.
4. **Muted fills (133, 71 files).** The largest and the one with the trap: this
   bucket is `<thead>` tints, chips, progress tracks and inset panels. A blind
   `bg-cream-100` -> `bg-white` here deletes table header shading entirely,
   because the tint IS the only thing distinguishing the header row. Replace
   with a cool neutral of the same lightness, do not replace with white.
5. **Foreground (64, 41 files).** Mostly `text-cream-50`, which is `#ffffff`:
   white type on dark grounds. Naming only, no colour change. Fold into 6.
6. **The rename. DONE 2026-08-17.** See "The rename, done" below.

### The rename, done 2026-08-17. Nothing on this site is called cream.

**The name is `paper`, and it was converged on rather than invented.**
`--paper:#f7f7f8` in `src/styles/atlas-spine.css` is the 75 step byte for byte,
and `--atlas-surface-paper` is the body ground: this repo already called this
role paper at this exact value. That file's first ratified rule reads "NEUTRAL
PALETTE. No cream, no warm tint", so the name inherits a rule forbidding warmth
instead of one inviting it, which also serves §7. Tailwind ships no `paper` key.

**Two steps did not come across, because trap 3 was live in both.** `cream-50`
was `#ffffff`, which is `white`; `cream-300` was `#e3e3e3`, which is
`parchment`. Both collapsed onto the existing name rather than renamed, which is
the same call the hairline tick made by hand for twelve sites. A standalone
`white` token carries the four TypeScript reads that cannot write a raw hex from
a component; it is deliberately NOT re-exported to Tailwind, because Tailwind
already has white and re-declaring it rewrites every emitted rule from `#fff` to
`#ffffff` for nothing. `cream-500` was already gone before this tick.

Also deleted: three dead `SectionTone` members, all named after ramp steps and
none selected by any entry since the 2026-06-06 white reset. A tint that returns
through a tone name is a banned colour coming back without anybody choosing it.

**`verify_no_cream` 346 -> 33 across 134 -> 16 files**, in four commits
(`94264a3c`, `c6d8ec79`, `35b73884`, `637e95e2`), 118 baseline entries deleted as
they reached zero. **Zero cream-named utilities remain anywhere in `src`.** The
33 are hex literals the gate counts by VALUE, 28 of them plain `#ffffff`, which
it counts only because `cream-50` used to be white. That reason is now spent, so
a future tick may drop `#ffffff` from `CREAM_LITERALS`; it was left alone here
because loosening a gate is not a rename.

**Verified three ways, because a rename that compiles is not a rename that
renders.**

1. 23 assertions on `globals.css` compiled through the project's own tailwind:
   no selector or property anywhere contains the word, none of the six warm
   values survives in hex or decimal, every renamed utility emits its exact
   prior rgb, and the two collapsed steps do not reappear under the new name.
2. The emitted utility set was captured before and after the comment sweep and
   is identical, which is the only check that catches trap 1.
3. Six routes rendered with `react-dom/server` (`home`, `gb`, `de`,
   `site:pricing`, `site:methodology`, `site:cities`): zero occurrences in any
   `class`, `style`, `fill`, `stroke` or colour attribute. The instrument is
   `scripts/spikes/render_palette_check.tsx`, kept.
4. Every old name's value compared against its new name's value read from the
   base commit: 15 of 15 identical. No colour moved under cover of the rename.

**THE CHECK MUST BE SCOPED TO ATTRIBUTES, NOT THE DOCUMENT.** One of the
businesses this atlas covers is an ICE CREAM shop, and it is visible copy in the
homepage trade chips. A grep of rendered markup for the word fails on the
product's own subject matter, and both ways out of that (weaken the check, or
rename a business) are worse than looking in the right place.

**A BLIND SPOT IN `scripts/lib/strip_comments`, which every source-scanning gate
in the chain depends on. FIXED 2026-08-17 in `23689a14`; kept here because the
lesson outlives the bug.** It was not a lexer, and a `/*` inside a STRING literal
opened a block comment. `src/app/_design/page.tsx:640` carries
`caption="board/charts/* (visx, compact, null-safe)"`, and from there real code
read as prose to every gate in the chain.

**Two details of the original report were wrong and are corrected here**, because
the next person to meet this needs the right shape of it:

- It is **195 lines, not 77.** Of the 451 non-blank lines after that caption, 195
  were invisible: 45 of the file's 104 `className` lines and 34 of its 65
  `text-` lines.
- It does **not** run to end of file. `inBlock` is false at EOF, because an
  unrelated real `*/` closed it 195 lines later. That is worse rather than
  better: the damage window is sized by something with no relationship to the
  bug, and could as easily have been the whole file or three lines.

Why it was a defect and not the documented trade: the header already accepts
`//`-in-a-string, reasoning that the failure direction is "a missed hit rather
than a false accusation". That reasoning is about losing ONE line and it is
sound. A false block OPEN loses an unbounded run and turns a gate's PASS into a
statement about a file it stopped reading. `//` behaviour was deliberately left
untouched so both results stay falsifiable.

Now tested and wired: `tests/lib/strip_comments.test.ts`, nine cases including
the apostrophe false-accusation the fix could have introduced (`const s = "it's";
/* n */` defeats a naive quote count, so the check is a prefix scan that tracks
which quote opened). It is gate 99.

**TWO COLOUR DEFECTS FOUND AND DELIBERATELY LEFT**, because this tick was a
rename and a rename must not carry a colour change:

- `src/components/ui/empty-state.tsx`. **FIXED 2026-08-17 in `d2d057ea`, and it
  was THREE literals, not one:** `rgb(247 246 244)` for the hatch surface, the
  pre-purge 100 step, plus TWO `rgba(228, 226, 221, 0.6)` hatch lines, which are
  the pre-purge `parchment`. Both tokens were retoned during the purge and
  neither retone reached this file, because it spelled the numbers instead of
  reading the token. It now reads `colors.paper[100]` and `colors.parchment`,
  with the 0.6 alpha preserved rather than dropped.

  **And the ratchet's rgb net caught NOTHING AT ALL.** It held one hand-written
  pattern, for a page ground the migration had already deleted: measured across
  all of src, zero hits. So the check contributed a passing line while testing
  for a colour that no longer existed, and the one file still literally painting
  cream was the one file it could not see. It also understood only
  `rgb(a, b, c)`, while the literal that mattered used the `rgb(a b c)` form CSS
  equally accepts. The list is now DERIVED from `WARM_CREAM` and matches both
  separators, so the two lists cannot drift apart again. `#f7f7f8` and `#ffffff`
  are deliberately excluded from the rgb net, measured first: ten and 63 rgb
  appearances respectively, and both are colours the site is supposed to have.
- `--destructive-foreground` in `globals.css` is `255 253 248`, which is
  `#fffdf8`, a warm off-white at h 44, while its comment claimed it was white.
  The comment now says what the value is so the defect is visible; the value is
  untouched.

Left alone and worth knowing: `--paper-100` is declared in BOTH `globals.css`
and `homepage-visual-tokens.css` at the same value, a mirror rather than an
alias, and only the globals declaration has readers. `"ink-dark"` is a fourth
dead `SectionTone`, not cream's business. `scripts/tokens/oklch-audit.mjs` holds
a hardcoded copy of the ramp's pre-purge values; it is not in the prebuild chain
and its own header already says its figures are historical.

### Hairlines, done 2026-08-17. The alias was real, and it was worse than logged.

**The trap, confirmed with numbers.** `parchment` was `#e4e2dd`, h=42.9 s=11.5%
l=88.0%: not "like" cream-300, it was cream-300, the identical hex, and the
token file said so in its own comment. So did three more names nobody had
counted: `--border` and `--input` in `globals.css` (rgb `228 226 221`, the same
colour written in decimal), `--parchment` in `homepage-visual-tokens.css`, and
the `chart.grid` role. **Cream had five names, and 380 hairline uses were spelled with one
that does not contain the word** (362 `border-parchment`, 11
`divide-parchment`, 5 `border-border`/`border-input`, plus `.atlas-rule`). Rewriting
`border-cream-300` onto `border-parchment` alone would have dropped the ratchet
by ten and changed not one pixel.

So the value moved first, in one edit per name, before any call site was
touched: **`#e4e2dd` -> `#e3e3e3`**. Not invented; it is the rail value the v2
spine kit already uses in eleven places, and a true neutral (s=0%), so the
answer to "remove the creamy colour" is no hue rather than a cool tint
substituted for a warm one. Weight is preserved because 380 borders changed at
once and none of them asked to get heavier: luminance 0.7611 -> 0.7534, so
contrast against a white card goes 1.29:1 -> 1.28:1 and against the page ground
1.21:1 -> 1.20:1. Against the seven foregrounds that sit on it as a fill the
largest change is +0.12 on a ratio of 13.49 and **zero AA verdicts flip**.

**The call sites: 45 found, not 35, and classified before being touched.** The
tick-1 classifier undercounted because it reads a role off one source line, and
because its family list had no `stroke-`. Four jobs, four different answers:

| what it actually is | n | replacement | colour change |
|---|---|---|---|
| white halo / white border (`cream-50` = `#ffffff`) | 12 | `border-white`, `ring-white` | none, a naming fix |
| focus ring-offset, i.e. the ground behind a control | 11 | `ring-offset-white` x10, `ring-offset-background` x1 | none for 9; two in `CalculatorForm` were `cream-100` warm sand while the control sits on `.atlas-card`, which is `#ffffff`, so the offset was simply wrong and is now right |
| structural hairline (`cream-300`) | 12 | `border/divide/stroke-parchment` | none, `parchment` moved underneath them |
| **`cream-400` hairlines: DEFERRED** | 10 | none this tick | see below |

**Why `cream-400` was left, measured rather than dodged.** Five
`border-dashed border-cream-400` empty-state boxes and five
`decoration-cream-400` underlines. `cream-400` is `#c3bfb7` and it is *shared
with the chart-mass role*: `bg-cream-400` is the neutral bar in Waterfall,
ComparisonBars, VsWorld, MoneyGoesBreakdown and VisitorSplit. So it cannot be
retoned in a hairline tick the way `parchment` could. And no existing cool token
sits at its weight: it reads 1.79:1 on white, `parchment` reads 1.28:1, so
mapping it across would have made five dashed empty-state boxes and five
underlines close to invisible. **Take it with the muted fills (step 4), where
the bar fills get decided anyway.**

**Verified against the compiled stylesheet, not the source.** 24 assertions on
`globals.css` put through the project's own postcss + tailwind 3.4.19 with the
real content glob: every `parchment` family emits `227 227 227`; no
border-color, divide, ring, outline or stroke declaration carries `#e4e2dd`
anywhere; and all nine retired utilities are absent from the emitted CSS, which
is only possible if the source genuinely stopped using them. Two real defects
came out of that instrument and would have survived a source grep:

- `stroke-cream-300` on `SurvivalCurve` and `SeverityGlyph`, two 1px chart
  baselines that are the hairline role and that the family list had missed.
- **Tailwind's content scan does not strip comments.** Naming a retired utility
  in prose re-emits it into the stylesheet: a comment written in this same
  commit resurrected `.border-cream-300`. Worth knowing before the rename tick,
  which will be almost entirely comment churn.

**Blind spot of that instrument, stated:** the project's postcss has no
`postcss-import` (Next inlines `@import` itself), so nothing reached through an
`@import` is in the compile. `homepage-visual-tokens.css` was asserted from
source instead. It proves what a border is *declared* as; it cannot prove a
border is visible or sits on the element the designer meant.

`verify_no_cream` **517 -> 479 across 167 files**, and the baseline was not
regenerated on trust: the old file was kept, the counter re-run, and a separate
script refused to write unless every entry shrank, held, or vanished. Ten
entries reached zero and were deleted. 38 = 35 utility occurrences + 3 hex
literals (`parchment`, `chart.grid`, `--parchment`).

**What the instrument used here cannot do**, stated so the next tick does not
over-trust it: the classifier reads source lines, so it sees the class a
component MENTIONS, not the pixel a reader SEES. It cannot tell a class behind
an off flag from one that renders, and it cannot resolve which of two
overlapping grounds wins. For "is cream still declared" it is exact. For "does
the page still look warm" the instrument is a screenshot, and this tick did not
take one: the change was verified by compiling `globals.css` through the
project's own tailwind pipeline and asserting on the emitted CSS.

## 12. Card convergence: the real numbers, and a correction

A commit on 2026-08-17 reported "112 atlas-card uses against 41 hand-rolled".
**Both figures were wrong**, and wrong in the way this repository has a shared
tool to prevent: they came from a naive `grep`, which counted the sweep's own
explanatory COMMENTS as both conversions and defects. Two gates in this chain
carry headers about exactly this mistake and the coordinator made it anyway.

Counted properly, with `scripts/lib/strip_comments` applied so only code counts:

| | raw grep | code only |
|---|---|---|
| `atlas-card` uses | 112 | **83** |
| hand-rolled `rounded-* border-* bg-white/cream-50` | 41 | **103** |

And the 103 is itself the wrong question, because a regex cannot tell a card
from an input. Classified:

| what it actually is | n |
|---|---|
| ~~**homepage cards still hand-rolled**~~ ~~**0**~~ **WRONG, see below** | **1, x6** |
| genuine cards on other pages | 69 |
| chips (`rounded-full`), never cards | 20 |
| form inputs inside Form/Field files | 14 |

**THE ZERO WAS WRONG, and the reason generalises.** Corrected 2026-08-17 in
`91774cee`. The classifier above matched `rounded-* ... border-* ... bg-white`
**in that written order**, and the blog rail's card spells
`rounded-md bg-white border border-parchment`, which puts the background before
the border. One class string in a different order and the regex reports zero
with a straight face. It rendered **six times**, and it was the only opaque
white surface left on the page the founder is actually looking at.

Re-measured with a test that asks only whether each family is PRESENT in the
class attribute, in any order, the homepage tree read **10 `atlas-card` against
1 hand-rolled**. Now 11 against 0.

So the §12 method gets a third clause: **count with comments stripped, classify
before converting, and never let the test depend on the ORDER classes are
written in.** Tailwind class strings have no canonical order, so any regex that
assumes one is measuring authorship habits rather than markup.

**So the homepage is done** and 69 real cards remain elsewhere. That matters
because of the two-surface rule: with `--atlas-surface-card` at `.955` and no
centre plate, a hand-rolled `bg-white` card is fully opaque and punches a hole
through the photograph. 69 holes remain, none of them on the page the founder
is looking at.

**Method for the next tick:** count with comments stripped, then CLASSIFY before
converting. Chips and inputs are not cards and must not be forced into one.

---

## 13. THE SMALL TYPE. Two questions, both answerable in one pass.

Measured 2026-08-18 on the real `/gb`, rendered per §9.1 and read in a browser:
**114 text nodes compute to under 12px.** Not 108; the earlier figure predates
two fixes and missed SVG text, which is measured in user units rather than
pixels. The census is by COMPUTED size, so it sees inheritance a source grep
cannot.

| size | n |
|---|---|
| 11px | 51 |
| 11.5px | 17 |
| 10px | 31 |
| 10.5px | 15 |

**There is no site-wide 12px rule being broken.** `SectionEyebrow`'s "12px
floor" comment governs `SectionEyebrow` only; both its variants emit `text-xs`
and none of its 78 call sites overrides the size. Checked, so nobody re-derives
it.

### What the 114 actually are

| role | n | the largest members |
|---|---|---|
| spectrum and scale end words | 29 | `.eng-spec__end` 24 at 10px, the country-shape ring words 3, GroundUnderYou's "Shaky / Firm" 2 |
| the key half of a key/value pair | 32 | `.eng-score__label` 8, `.eng-citycard__ck` 4, `.eng-total__k` 2, three `dt` keys, plus unclassed spans |
| chart rim labels and reads | 12 | `.eng-shape__rim-label` 11.5px, `.eng-shape__rim-read` 10.5px |
| table column headers | 10 | five `th` at 11px, `.eng-neigh__col` at 11.5px |
| captions and caveats under a figure | 8 | `.eng-neigh__cap`, `.eng-vs__cap`, HowFarYouReach's inline caveat, `.eng-citycard__meta` |
| interactive control labels | 14 | `.eng-gutpill` Yes/No buttons at 11px, the trade chips |
| structural and nav labels | 5 | `.eng-divlabel` 4, "On this page" 1 |
| provenance and honesty marks | 4 | `.eng-onething__stamp`, "Updated / June 2026" |

Two of the 114 were NOT scale questions and are already fixed (`def756bf`): the
rosette divider labels failed contrast on the photograph at 2.08:1, and the
country shape's ring words were SVG text that rendered 9.92px on a desktop and
**5.86px on a phone**, because "8.5px" inside a viewBox is 8.5 user units and
scales with the container. Both are recorded there in full.

### QUESTION 1, the floor. What is the smallest size this atlas prints?

Nothing in the repo answers this. The engraved family behaves as if the answer
is 10px, the rest of the site as if it is 12px, and `CountryShape` carries a
private `@media (max-width: 380px)` block that drops its rim read to 9.5px and
its sample tag to 8px, lower than anywhere else on the site. That is the §7
cohesion defect in one sentence: **one page type runs a type scale nobody else
runs, in a `<style>` block inside a component.**

The concrete decision is the 10px step, 31 nodes, 24 of them the character
panel's spectrum end labels. Those words are the only thing saying which end of
each bar is which, so they are load-bearing rather than decorative.

- **A.** 10px stays. The engraved family keeps its own micro step.
- **B.** 10px goes to 10.5px, the size already used by four other engraved
  micro-labels. One value leaves the ladder, nothing new enters.
- **C.** 11px is the floor for anything a reader must read, and 10px survives
  only for marks a reader glances at. This is the largest change and the only
  one that also settles `CountryShape`'s private 9.5px and 8px.

### QUESTION 2, the colour, and it is bigger than the size

**82 of the 114 are one token.** `--text-faint` is `#87745d`, and on this
site's own card it measures **4.48:1 on pure white and 4.35:1 where the card
sits over the darkest part of the photograph.** AA for text under 24px is 4.5.
It misses, everywhere, by about 0.15.

This one cannot be converged, only chosen, which is why it is here rather than
done. The next step down the same ladder is `--text-muted` `#534231` at
**9.58:1**: correct, and so much darker that the quiet tone the engraved system
is built on would collapse into the body tone. Nothing exists between them. So
the options are:

- **A.** Hold the AA floor exactly and darken `--text-faint` by the smallest
  amount that clears it, roughly `#857259`. A reader will not see the change;
  the gate line will.
- **B.** Accept 4.48 and write down that this token is a deliberate 0.15 under
  the floor, with the reason, so it stops being rediscovered every few ticks.
- **C.** Split the token: keep `#87745d` for text at 12px and above, add one
  darker step for everything below. Most work, and the only option that makes
  the distinction the WCAG rule actually draws.

**Recommendation, stated so it can be rejected in one word: B for the colour
and B for the size.** The colour miss is 0.4% and invisible; writing it down
costs one comment and ends the rediscovery. The size answer B moves 31 nodes by
half a pixel, which no reader will notice, and its real value is that the
engraved family stops having a step nothing else has.
