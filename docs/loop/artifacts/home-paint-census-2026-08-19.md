# Homepage paint census, 2026-08-19

**The first per-band PAINT measurement this project has taken.** Everything before
it counted what the server emitted. `measure_home_bands.tsx` says so in its own
blind spot 2: *"a band that emits markup can still compute to zero height. That is
a screenshot's question and it is the next tick's."* This is that measurement.

Instrument: `scripts/spikes/render_home_to_scratch.tsx` plus a Tailwind build,
served over HTTP, measured in a browser. **Reloaded after the resize**, because a
resized measurement is fiction (`/blog` once reported 12,282px where a fresh load
of the same file gave 32,114).

---

## 1. The numbers

| | 1280 | 375 |
|---|---:|---:|
| Bands declared | 11 | 11 |
| **Bands painted** | **11** | **11** |
| Bands `position: static` (would be invisible) | **0** | **0** |
| Page height | **5,933px** | **9,848px** |
| Horizontal page scroll | none | none |
| Visible words | **617** | 613 |
| Distinct font families | **2** | 2 |

### Per band

| Band | h @1280 | h @375 | words |
|---|---:|---:|---:|
| hero | 527 | 681 | 50 |
| specimen | 406 | 538 | 54 |
| example-tiles | 351 | 800 | 63 |
| ledger | 393 | 584 | 57 |
| **catalog-plates** | **828** | **1,142** | 68 |
| world-map | 567 | 277 | **10** |
| state-comparison | 461 | 655 | 67 |
| **neighborhoods** | 607 | **1,568** | 68 |
| **audience** | 552 | **1,127** | 72 |
| blog-rail | 407 | 868 | 67 |
| newsletter | 272 | 445 | 41 |

---

## 2. THE WORD COUNT IS 617, NOT 764. The target was already met.

`10-HOMEPAGE.md` and `01-DESIGN-STANDARD.md` both state **764 words**, and the
design standard sets a target of **615**. Measured in a browser: **617 at 1280,
613 at 375.**

The discrepancy is an instrument difference, not a change. The 764 came from
`measure_home_bands.tsx`, which strips tags from the SSR string and counts what
remains. That includes markup that **never paints at a given width** - responsive
duplicates, elements hidden by CSS at that breakpoint. `innerText` counts only
what a reader can see.

**Consequence: the headline P1 goal, "cut 764 words to 615", was already satisfied
before any band was touched.** Any tick that had started cutting words toward 615
would have been cutting below the target while believing it was approaching it.

**Which number is right depends on the question.** For "how much language does
this page contain" the SSR count is defensible. For "how much does a reader read",
which is the founder's question, 617 is the number.

---

## 3. Where the height actually is: three bands, 39% of the page

At 375, three bands carry **3,837px of the 9,848px page**, which is **39%**, for
**208 words between them**:

- `neighborhoods` **1,568px**
- `catalog-plates` **1,142px**
- `audience` **1,127px**

This is the direct confirmation of tick 6's correction. Height on this page is not
in the vertical rhythm, which is already 32/40px and gated at a ceiling of 40. It
is in three bands whose components stack tall on a phone. **Any future "too tall"
work starts here**, and it is a component-layout question rather than a spacing one.

For scale: `/blog` was rejected at 32,114px and `/cities` at 20,459px. The
homepage at 9,848px is not in that category.

---

## 4. Font census: exactly two families, and the tick-4 fix is confirmed painting

**Inter on 171 elements, Newsreader on 61.** Two families, which is what
`09-SITE-CONTINUATION.md` asks for ("two families, or three at most"). Nothing
else on the list, so there is no third family leaking in.

This also confirms `2179bcb2` from the paint side rather than the source side:
display elements resolve to **Newsreader**, not to the body sans. Before that fix
`--font-display` referenced itself and every display heading inherited body type.

**Honest limit:** the webfonts are not loaded in this fixture, so what is really
being confirmed is that the CSS variable chain resolves to the right *family name*
at the right elements. It is not proof of the rendered typeface a reader sees.

---

## 5. A defect class gate 102 does NOT catch, found while building the instrument

Setting the font slots on `<body>` instead of `<html>` produced **every element on
the page falling back to the browser default**, and a page height 69px short.

The cause is worth writing down because it is one step away from the bug tick 4
fixed. `globals.css` declares on `:root`:

```css
--font-body: var(--font-sans), Inter, ui-sans-serif, system-ui, sans-serif;
```

The comma-separated names after `var(--font-sans)` are **font-family fallbacks,
not var() fallbacks.** If `--font-sans` is unset on that element, the `var()` is
invalid at computed-value time and voids the **whole declaration** - it does not
step to `Inter`. Measured: `--font-body` computed to the **empty string** on
`:root`.

Gate 102, `verify_no_self_referential_css_vars`, catches a property that names
*itself*. It does not catch a property that names an **unset sibling with no
`var()` fallback**. The two are the same failure with the same silent symptom.

In production next/font always injects the slot, so this is latent rather than
live. It becomes live the moment the loader does not run.

**Filed, not fixed.** The one-character-class fix is
`var(--font-sans, Inter)`, but changing a live font declaration on a hunch is
exactly what this project's rules forbid, and the correct move is a gate that
reports how many declarations have this shape before any of them are edited.

---

## 6. Two non-findings, recorded so nobody re-files them

**The wide table at 375 is correctly contained.** A `table` computes 328px inside
a 279px parent at 375, which reads as overflow until you look at the parent: it is
`atlas-card overflow-x-auto`, with `overflowX: auto` and `scrollWidth` 328. The
table scrolls inside its own card and the page does not scroll sideways. That is
the prescribed pattern, not a defect.

**`world-map` at 10 words is not a thin band.** It is the model the step file
names: inventory rather than description, and the shape the other bands should
move toward.

---

## 7. Blind spots

1. **No layout, no frame.** `AtlasFrame`'s two fixed z-index-0 layers are absent
   from this fixture, so "does it paint at all against the photograph" is NOT
   answered here. What is answered is that no band computes `position: static`,
   which is the condition that made the footer invisible for weeks.
2. **No real webfonts.** See section 4.
3. **SSR only.** Anything appearing on hydration is invisible.
4. **Data bands self-omit locally** when cell lookups exceed their 4s budget to
   eu-west-1. All eleven bands painted in this run, so that did not bite here, but
   a future short reading of `specimen`, `example-tiles` or `state-comparison` may
   be the budget rather than the design.
5. **No screenshot.** The Browser pane was not displayed, so the page never
   composited frames and every screenshot attempt timed out at 5s. Structure was
   read back through the DOM instead, which is stronger for measurement and weaker
   for "does it look right". The step file asks for shots in
   `artifacts/shots/`; they are not here and that is a gap, not an omission.
