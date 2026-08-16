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
2. `npm run prebuild` must be 97/97.
3. Render what you changed and read it back. The local dev server is slow and
   dies often; when it does, render the component directly with
   `react-dom/server` and assert on the output. Both techniques are proven in
   this repo.
4. Commit with a message that says what was wrong, what changed, and what was
   measured.
5. **Never push.** The founder pushes.

Known local traps, already paid for:

- Data bands (`ExampleTiles`, `StateComparison`, `Specimen`) self-omit on the
  local dev server because cell lookups exceed the 4s budget from this machine
  to eu-west-1. They render in production. **Do not "fix" this** by raising the
  budget, caching, or softening the self-omit.
- The browser preview pane has a 0x0 hidden viewport: `.focus()` does nothing,
  IntersectionObserver never fires, and layout measurements are all zero.
  Anything interactive must be verified in jsdom instead.
- Bash heredocs eat backslashes. Use the Write tool for anything with a regex.

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
- §1 B3 is DIAGNOSED, not fixed. `.atlas-glass-chrome` in `globals.css` is
  `rgba(251, 250, 247, 0.72)` with a backdrop blur: the masthead is translucent
  cream. Translucent breaks B3, because the photograph reads through the header;
  cream breaks §2. It is the live path, since `isWarmFrameEnabled()` defaults to
  true. One rule fixes both, and it is the highest-value cream usage on the site
  because it renders on every page.
- The H1 is restored (`d82427e3`) and is now a locked value. See §3.

Open and NOT done: §1 B3, §2 entirely, §4 entirely, §6 entirely, §7 entirely.
