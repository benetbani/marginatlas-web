# 10. The homepage. Ten sections that earn their place, and none of them bland.

**Founder:** "continuation on the homepage work, homepage should have at least 10
sections, currently very deficitary and bland".

Three slots per cycle, the most of any step, because this is the page he wakes up
to. **One band per tick, finished, rendered and committed.** One excellent band
beats three bland ones, and this project has already proved that three bland ones
get rejected together.

---

## The measured starting position

`src/app/page.tsx` is 791 lines and declares **11 bands**:

| # | Band | Form | Risk |
|---|---|---|---|
| 1 | hero, H1 plus `NavigatorForm` | search | **H1 LOCKED, do not touch** |
| 2 | `Specimen` | one real answer | data band, self-omits locally |
| 3 | `ExampleTiles` | tiles | data band, self-omits locally |
| 4 | `AtlasLedger` | table | carded 2026-08-17 |
| 5 | `CatalogPlates` | marks | carded 2026-08-17 |
| 6 | `WorldMapSection` | map | the map was invisible for weeks, cream on cream |
| 7 | `StateComparison` | comparison | data band, self-omits locally |
| 8 | `NeighborhoodCards` | cards | |
| 9 | `AudienceBand` plus `UpgradeTeaser` | two panels in one band | density pass already done |
| 10 | blog rail | cards | density pass already done |
| 11 | `HomeNewsletter` | form | density pass already done |

**Declared is not rendered.** Three of the eleven self-omit whenever their data
does not resolve, which is why he counts fewer than eleven and calls it
deficient. So the first job of the first homepage tick is to **count what
actually paints**, at 1280 and at 375, and write that number down.

**The target follows from that arithmetic: twelve or thirteen declared bands, so
that ten still render on a bad data day.** Not eleven declared and eight painted.

---

## The two tests every band must pass

**1. Does it earn its place?** A band is one of four things: an **answer**
(a real figure), a **door** (a way into the atlas), a **proof** (why we should be
believed), or **inventory** (the material itself). A band that describes the
product rather than being the product gets cut or shrunk to a line. The models
are Airbnb, airlines and premium rentals: they show inventory, not descriptions
of inventory.

**2. Is it an element, or is it text?** His words: "it lacks flavor, it lacks
elements. It just has a lot of text, when it should not." Count the words in the
band before and after. A lede over two lines is too long. A paragraph under a
heading that repeats the heading goes entirely. Add marks, icons, and the numbers
themselves set large, using the kit that already exists: `AtlasIcon`, `AtlasSpot`,
the trade icons, the spine glyphs. **Do not invent a new icon language.**

---

## Candidate bands, all buildable from things this product already has

Only from real material. No band ships that cannot either render real data or
self-omit honestly, and none ships with a placeholder.

- **Where to open X.** The recommender is the headline tool of the strategy. A
  free top answer on the homepage is the strongest door on the site.
- **Margin index leaderboard.** A keep-ranking, already built, currently unused
  on this page.
- **Extremes.** The route exists and it is the most human material in the atlas.
- **Cost to open.** A real figure with a door into the calculator.
- **Trade chips.** The trade set as a picker, inventory rather than description.
- **How a figure is built.** The proof band, small and quiet, one diagram.
- **What changed this month.** Freshness as a trust signal, generated, never
  typed.

Every candidate that lands must be added to the section registry so the section
gates defend it, and so nobody can silently drop it later.

---

## Rhythm, because eleven bands of the same shape is the definition of bland

- **No two consecutive bands with the same visual form.** Table, then map, then
  chips, then a big number, then cards.
- **Alternate weight.** A heavy data band is followed by a light door.
- **One signature moment per screen and a half.** Something that is not a card
  full of text: the map, a large figure, a spread, a mark.
- **Height budget.** Measure the page height before and after, at both widths.
  `/blog` at 32,114px on a phone and `/cities` at 20,459px are what happens
  without one. Adding a band means cutting text somewhere, not extending the
  scroll.

---

## Constraints that are already settled. Do not re-litigate them.

- **The H1 is locked.** Charter section 3.
- **Do not card the section headings.** Measured: `ink-900` reads 7.78:1 on the
  backdrop's darkest point and clears AAA. A visual pass nearly restructured
  eight bands for nothing.
- **Everything lives in cards**, because the cards are what soften the middle of
  the photograph. `--atlas-surface-card` is `rgba(255,255,255,.955)`, so a
  hand-rolled `bg-white` card is fully opaque and punches a hole through the
  picture.
- **Every new surface must be `relative`.** Static elements are not painted at
  all.
- Terracotta plus cool neutrals. No cream. Terracotta under roughly 24px needs
  `atlas-800` or a card.
- Tokens only, no em-dashes, no source-agency names.

## Verification for every homepage tick

1. Render `/` at 1280 and 375, before and after, with a reload after the resize.
2. Screenshot both, read both, and save them to
   `docs/loop/artifacts/shots/home-<date>-<width>.jpeg`.
3. Report: bands declared, bands painted, page height before and after, words
   added or cut.
4. `tsc` clean, `prebuild` 101/101.

## Done test

**"One band landed, it is an answer, a door, a proof or inventory, it paints at
both widths, and the page is not taller than it was without a reason I can
state."**
