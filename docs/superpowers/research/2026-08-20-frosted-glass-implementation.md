# Frosted glass on the web: implementation research

**Date:** 2026-08-20
**For:** marginatlas.com, a premium editorial almanac of small-business financial benchmarks
**Constraint set given:** a fixed full-screen photograph behind every page; terracotta plus cool neutrals, one accent, no green, no amber, no brown; the content is figures a reader must trust; explicitly NOT Apple Liquid Glass; explicitly NOT high transparency; the founder wants "a moving level of transparency that gives the design breathing".

**Already established upstream, not re-derived here:** Liquid Glass cannot be reproduced on the web because the refraction is native to Apple's rendering stack. The material anatomy is a two-layer stack, an outer shell plus an inner stabilized plate that protects content, with four edge cues: a thin border breaking the edge, a controlled highlight band implying light direction, an optional inner stroke, and a subtle shadow.

Everything below was fetched during this session unless explicitly marked UNREAD.

---

## 0. Source register

### Fetched and read

| Source | URL |
| --- | --- |
| MDN, `backdrop-filter` | https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter |
| MDN, `prefers-reduced-transparency` | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency |
| W3C / CSSWG, Filter Effects Module Level 2 | https://drafts.csswg.org/filter-effects-2/ |
| W3C / CSSWG, Compositing and Blending Level 1 | https://drafts.csswg.org/compositing-1/ |
| W3C WAI, Technique G18 | https://www.w3.org/WAI/WCAG22/Techniques/general/G18 |
| W3C WAI, Understanding SC 1.4.3 Contrast (Minimum) | https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html |
| Can I Use, `css-backdrop-filter` | https://caniuse.com/css-backdrop-filter |
| Can I Use, `prefers-reduced-transparency` | https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency |
| Chrome for Developers, "CSS prefers-reduced-transparency" | https://developer.chrome.com/blog/css-prefers-reduced-transparency |
| Microsoft Learn, Acrylic material | https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic |
| Microsoft Learn, Mica material | https://learn.microsoft.com/en-us/windows/apps/design/style/mica |
| Fluent 2 Design System, Material | https://fluent2.microsoft.design/material |
| Josh W. Comeau, "Next-level frosted glass with backdrop-filter" | https://www.joshwcomeau.com/css/backdrop-filter/ |
| Smarative, "Realistic Frosted Glassmorphism in CSS With Gradient Borders" | https://smarative.com/blog/realistic-frosted-glassmorphism-css-gradient-borders |
| rampstackco/glassmorphism-theme (README, `tokens/tokens.css`, `components/components.css`, `verify/contrast.js`, read from raw.githubusercontent) | https://github.com/rampstackco/glassmorphism-theme |
| Mozilla Bugzilla 1718471, backdrop-filter blur laggy with many elements | https://bugzilla.mozilla.org/show_bug.cgi?id=1718471 |
| Mozilla Bugzilla 1736914, Firefox `prefers-reduced-transparency` | https://bugzilla.mozilla.org/show_bug.cgi?id=1736914 |
| WebKit Bug 176830, `mix-blend-mode` plus `-webkit-backdrop-filter` | https://bugs.webkit.org/show_bug.cgi?id=176830 |
| w3c/fxtf-drafts issue 374, backdrop clipping with `edgeMode="duplicate"` | https://github.com/w3c/fxtf-drafts/issues/374 |
| w3c/fxtf-drafts issue 408, backdrop-filter containing block | https://github.com/w3c/fxtf-drafts/issues/408 |
| mfreed7/backdrop-filter-feature, Chromium implementation explainer | https://github.com/mfreed7/backdrop-filter-feature |
| public-fxtf archive, Markus Stange on backdrop definitions and isolation | https://lists.w3.org/Archives/Public/public-fxtf-archive/2018Apr/0095.html |
| Havn, "Chromium and Nested Backdrop-Filters" | https://havn.blog/2024/03/14/chromium-and-nested.html |
| ThisDevTool, "Backdrop-Filter Not Working in Safari? 5 Real Fixes" | https://thisdevtool.com/blog/backdrop-filter-not-working-safari-fix |
| COSESAI / flowrust, "Glass, But the Browser Doesn't Speak It" | https://blog.flowrust.com/2026/07/15/backdrop-filter-stack-glassmorphism-survives-safari/ |
| W3Tweaks, "CSS filter and backdrop-filter: The Complete Visual Guide" | https://www.w3tweaks.com/css/css-filter-backdrop-filter/ |
| Axess Lab, "Glassmorphism Meets Accessibility" | https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/ |
| Smashing Magazine, "Designing Accessible Text Over Images, Part 1" | https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/ |
| WebKit blog, "News from WWDC26: WebKit in Safari 27 beta" | https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/ |

### Attempted and UNREAD

These are named because their absence changes what can be claimed. Do not treat any statement here as sourced to them.

- **Apple Human Interface Guidelines, Materials** (https://developer.apple.com/design/human-interface-guidelines/materials). Fetched twice; the response contained only the page title. The page is client-rendered. **UNREAD.**
- **Apple Developer Documentation, `Material` (SwiftUI)** (https://developer.apple.com/documentation/swiftui/material). Same failure, title only. **UNREAD.**
- **Apple HIG legacy iOS Materials page** (https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/materials/). HTTP 404. **UNREAD.**
- **Chromium issue 40666159, "backdrop-filter blurring is too eager"** (https://issues.chromium.org/issues/40666159). The tracker returns a sign-in page to unauthenticated fetches. **UNREAD.** The same artifact is described first-hand in fxtf issue 374, which was read, so section 1.6 rests on that instead.
- **Chromium issue 40794542**, backdrop-filter with mix-blend-mode. Same sign-in wall. **UNREAD.**
- **PubMed 36563495**, "The effect of serifs and stroke contrast on low vision reading". Cookie wall; only the search-result summary was obtained. Treated in section 6 as a secondhand citation and labelled as such.
- **Radix Colors alpha scale documentation.** Two Radix doc pages were fetched and neither contained the alpha-scale material; the statements in section 5 about Radix alpha scales come from search-result summaries of Radix pages, not from a full page read. Labelled inline.

Everything Apple in section 5 therefore comes from secondary summaries and is flagged. **Apple publishes no numeric alpha or blur values for its material levels in any source read here.** If a number for `.regularMaterial` is ever quoted at you, ask where it came from.

---

## 1. The CSS craft of a convincing frosted panel

### 1.1 The one thing that decides whether it reads as glass

Not the blur. The **alpha**. A blur behind a 95.5% opaque fill is doing 4.5% of a job. Section 7 does the arithmetic for our exact stack: at 0.955 over our photograph, the card's ground moves by 3.7 levels out of 255 across the entire black-to-white range of the picture. That is below the threshold at which anyone perceives a material.

Every source that discusses this says the same thing in different words. W3Tweaks: "A fully opaque background white blocks the backdrop entirely, the filter runs, wastes GPU cycles, and you see nothing." Our own `src/app/globals.css` already says it about the masthead: "A backdrop-filter behind an opaque background has nothing to refract and costs a compositor layer on every page to do it."

### 1.2 Border versus `box-shadow: inset`, and the trap between them

They are not interchangeable.

- A `border` occupies layout space and is painted **outside** the padding box. The element's own `background` paints under it by default, because the initial `background-clip` is `border-box`. With a translucent fill and a translucent border you therefore composite the fill under the border and the border reads darker or milkier than authored. The fix is one line: `background-clip: padding-box`.
- An `inset box-shadow` occupies no layout space, is painted **inside** the padding box, can be sub-pixel, can be offset directionally, and can be stacked many times in one declaration. This is why every serious glass recipe draws the catch-light with an inset shadow and the boundary with a border, rather than trying to make one property do both.
- `backdrop-filter` clips to the **border box including border-radius**, per the spec's step 4 ("Clip T' using element B's border box, including border-radius", Filter Effects 2). So the blurred backdrop extends underneath a translucent border. That is usually what you want, and it is another reason a translucent border on top of `background-clip: border-box` double-composites.

```css
/* The correct base. Two separate jobs, two separate properties. */
.glass {
  position: relative;
  border-radius: 16px;

  /* Alpha lives here, NEVER in `opacity`. See 2.3. */
  background-color: rgba(255, 255, 255, 0.72);
  background-clip: padding-box;          /* fill stops at the padding box */

  border: 1px solid rgba(255, 255, 255, 0.34);   /* the boundary */

  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  backdrop-filter: blur(18px) saturate(1.15);

  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.68),   /* catch-light, TOP EDGE ONLY */
    0 12px 32px rgba(20, 16, 12, 0.10);          /* elevation */
}
```

The `inset 0 1px 0 0` is the whole catch-light. Note the geometry: zero blur, zero spread, one pixel of vertical offset. It is a hairline, not a glow.

**The single most useful rule found in this research**, from `components/components.css` in rampstackco/glassmorphism-theme:

> "The inset highlight is a single hairline at the top edge only. A pane picks up the light source above it, so lighting all four sides states two light sources and reads as a glowing rectangle instead of a physical object."

Our current `.av2 .glass` in `src/styles/atlas-spine.css` lights **four** sides:

```css
/* CURRENT, src/styles/atlas-spine.css:175 */
box-shadow:
  0 0 6px rgba(0,0,0,.02),
  0 2px 8px rgba(0,0,0,.04),
  inset  3px  3px .5px -3px rgba(255,255,255,.98),
  inset -3px -3px .5px -3px rgba(255,255,255,.70),
  inset  1px  1px 1px -.5px rgba(255,255,255,.72),
  inset 0 0 8px 8px rgba(255,255,255,.08),
  0 18px 44px -24px rgba(0,0,0,.26);
```

Five inset layers, two of them on opposing corners, one of them an 8px-spread inner glow. That is the "glowing rectangle" failure mode described above, and it is also why the card reads as a soft blob rather than a pane. It is also unfalsifiable at 0.955 alpha, because none of it is visible.

### 1.3 The gradient border, two ways

**Way one, masked pseudo-element.** This is the technique with the widest browser reach and it respects `border-radius`. Verbatim from Smarative:

```css
.container:before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 8px;
  padding: 1px;                       /* the border width */
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0.25)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
          mask-composite: exclude;
}
```

The mask keeps only the 1px ring: two full-coverage masks, one clipped to the content box, subtracted from one clipped to the border box. `padding` sets the ring width. Change `135deg` to `180deg` to get a top-lit rim instead of a diagonal one, which is what a single overhead light source implies.

**Way two, `border-image`.** Not recommended here. `border-image` does not follow `border-radius`; a gradient border drawn with it renders as a square ring around a rounded box. *(This is a widely documented CSS behaviour but I did not fetch a source for it in this session; verify before relying on it.)* The masked pseudo-element has no such limitation and is what every recipe read here uses.

### 1.4 The highlight band

The band is different from the hairline. The hairline is one pixel of specular rim. The band is a broad, low-alpha wash across the top third that says "light arrives from up there".

```css
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.06) 34%,
    rgba(255, 255, 255, 0)    64%
  );
}
```

Three stops, not two. A two-stop gradient from white to transparent across the full height reads as a sheen on a plastic button. Stopping the band at roughly a third and holding transparent for the remainder reads as a light source.

Keep this on `::before` and the ring on `::after` (or vice versa) so they can be tuned independently. Both need `pointer-events: none`.

### 1.5 Layered `box-shadow`: elevation plus inner stroke

Four layers is the ceiling before it turns to mud. In order, outermost first:

```css
box-shadow:
  0 1px 2px rgba(20, 16, 12, 0.06),        /* contact, tight, keeps it off the page */
  0 12px 32px -8px rgba(20, 16, 12, 0.14), /* the soft area light */
  inset 0 1px 0 rgba(255, 255, 255, 0.68), /* catch-light */
  inset 0 0 0 1px rgba(255, 255, 255, 0.10); /* the optional inner stroke */
```

The last one is the "inner stroke" from the anatomy: a full-perimeter 1px ring at very low alpha sitting just inside the boundary, which reads as the inner face of a pane with thickness. It is the only inset that is allowed to be on all four sides, because at 0.10 it does not state a light direction.

rampstack's shadow geometry rule is worth stealing: "Large radius, low opacity, and offset roughly a third of the blur, which is the geometry of a soft area light rather than a point source." Their three tiers: `0 2px 8px rgba(3,5,14,0.28)`, `0 12px 32px rgba(3,5,14,0.4)`, `0 24px 64px rgba(3,5,14,0.52)`. Offset is 2/8, 12/32, 24/64, so 0.25 to 0.375 of the blur. Their justification for having a shadow at all is the sharpest sentence on the subject found anywhere: "The shadow is what puts air between a panel and the ground; without it a frosted surface reads as a hole cut in the page."

### 1.6 The edge artifact nobody warns you about, and the fix

The blur is computed with `edgeMode="duplicate"` and then clipped to the element's quad. From fxtf issue 374, quoting the spec sections involved:

> "Section 3: Backdrop Root step 4 clips the backdrop output to the backdrop's quad, and Section 2.1 specifies that the blur filter is applied with edgeMode='duplicate'."

The consequence, verbatim from the same issue: when the edge of the backdrop filter sits over a small portion of another colour, that colour is duplicated and heavily weighted in the resulting blur, so colours intrude into the blur as the element slides. Over a **photograph**, this is not theoretical. A card whose top edge crosses a hard tonal boundary in the picture will smear that boundary's colour along the whole edge. The proposed spec fix is mirror `edgeMode`; the issue is closed and browsers still do duplicate.

Josh Comeau's technique is the practical answer, and it is the highest-craft thing in this research. Instead of blurring an element that is exactly card-sized, blur an oversized element and mask the overflow away, because **masking happens after filtering**:

```html
<div class="card">
  <div class="backdrop"></div>
  <div class="card-content"> ... </div>
</div>
```

```css
.card { position: relative; }

.backdrop {
  position: absolute;
  inset: 0;
  height: 200%;                 /* reach past the card so nearby pixels feed the blur */
  backdrop-filter: blur(16px);
  mask-image: linear-gradient(
    to bottom,
    black 0% 50%,
    transparent 50% 100%
  );
  pointer-events: none;
  background: linear-gradient(to bottom, hsl(0deg 0% 95%), transparent 50%);
}
```

Comeau's own reasoning for why `mask-image` and not `overflow: hidden`, verbatim: "In Chrome, the overflow trimming occurs *before* the filters are applied." So `overflow: hidden` on a parent removes the very pixels you wanted the blur to sample; a mask removes them after the blur has already used them.

His two caveats matter for us:

- Rounded corners cannot be preserved with a CSS gradient mask on an oversized box. Use an SVG mask with an `rx`/`ry` rect and `mask-image: url(#id)`.
- "Elements outside the viewport never trigger blur recalculation", which produces a flicker at the viewport edge. His mitigation is the gradient background layer fading from opaque to transparent.

He also reports a Firefox quirk: `backdrop-filter` on `position: sticky` fails if ancestors combine `overflow` and `border-radius`, and that flickering sometimes resolves with `overscroll-behavior: none`.

### 1.7 Complete reference panel

Assembled from the above. This is a reference, not a proposal; the numbers for our site are in section 7.

```css
.pane {
  position: relative;
  isolation: isolate;                  /* see 2.4 before copying this line */
  border-radius: 16px;

  background-color: rgba(255, 255, 255, 0.72);
  background-clip: padding-box;
  border: 1px solid rgba(255, 255, 255, 0.34);

  -webkit-backdrop-filter: blur(18px) saturate(1.15);
          backdrop-filter: blur(18px) saturate(1.15);

  box-shadow:
    0 1px 2px rgba(20, 16, 12, 0.06),
    0 12px 32px -8px rgba(20, 16, 12, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    inset 0 0 0 1px rgba(255, 255, 255, 0.10);
}

/* the highlight band */
.pane::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.06) 34%,
    rgba(255, 255, 255, 0) 64%
  );
}

/* the stabilized plate: the inner layer that protects figures */
.pane > .plate {
  position: relative;
  z-index: 1;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);   /* NOT a second backdrop-filter */
  box-shadow: inset 0 0 0 1px rgba(20, 16, 12, 0.05);
}

/* no support, and every browser that has reduced transparency on */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .pane { background-color: rgba(255, 255, 255, 0.95); }
}
@media (prefers-reduced-transparency: reduce) {
  .pane {
    background-color: #ffffff;
    -webkit-backdrop-filter: none;
            backdrop-filter: none;
  }
}
```

Note what the plate does **not** have: its own `backdrop-filter`. See 2.5.

---

## 2. `backdrop-filter` reality

### 2.1 Support, 2026

From Can I Use, `css-backdrop-filter`: **global usage 95.69%**. Unprefixed support in Chrome 76+, Edge 17+, Safari 9+, Firefox 103+, Opera 64+, Samsung Internet 12+, Safari on iOS 9+. No support in Internet Explorer, Opera Mini, QQ Browser, KaiOS Browser. MDN records it as **Baseline "newly available" as of September 2024**.

Filter-function support is not uniform. From the search summary of MDN and the Always Twisted guide: `opacity()` inside `backdrop-filter` has reliable support only in Firefox Nightly and is ignored in Chrome, Edge and Safari; `drop-shadow()` likewise only works in Firefox Nightly. Treat `blur()`, `saturate()`, `brightness()`, `contrast()`, `grayscale()`, `sepia()` and `hue-rotate()` as the usable set. *(This claim comes from search-result summaries of the MDN and Always Twisted pages, not a full read of a compatibility table; verify before shipping a filter other than blur and saturate.)*

### 2.2 The `-webkit-` prefix situation

Still required. ThisDevTool: "Declare both, with the prefixed property first", covering Safari 9 to 17. Prefixed first, unprefixed second, so the unprefixed value wins where both are understood.

**Sources disagree on one specific point.** ThisDevTool states: "`-webkit-backdrop-filter` can fail when its value comes from a CSS custom property, so prefer a literal value like `blur(12px)` on the prefixed line." The flowrust article repeats the same claim. Against that, rampstackco/glassmorphism-theme ships production CSS that does exactly the opposite:

```css
.gl-surface {
  -webkit-backdrop-filter: var(--gl-backdrop-2);
          backdrop-filter: var(--gl-backdrop-2);
}
```

with `--gl-backdrop-2: blur(20px) saturate(1.6)`. I found no bug number, no WebKit changelog entry, and no version range attached to the custom-property claim in any source read here. **Treat it as unverified folklore until someone reproduces it on a named Safari version.** If you want to be safe at zero cost, write the literal on the prefixed line and the `var()` on the unprefixed line; you lose nothing.

### 2.3 What breaks it: the Backdrop Root

This is the mechanism, and it is exact. From CSSWG Filter Effects Module Level 2, a Backdrop Root is formed by:

1. The root element of the document.
2. An element with a `filter` other than `none`.
3. An element with `opacity` less than 1.
4. An element with `mask`, `mask-image`, `mask-border`, or `clip-path` other than `none`.
5. An element with `backdrop-filter` other than `none`.
6. An element with `mix-blend-mode` other than `normal`.
7. An element with `will-change` specifying any property that would create a Backdrop Root.

And the Backdrop Root Image for element E is:

1. Start at the nearest **ancestor** Backdrop Root element.
2. Paint all content in painting order between (and including) that ancestor and element E.
3. Flatten into a 2D screen-space buffer.
4. Clip to E's border box in 2D screen space.

Three consequences follow directly and they are the three ways this fails in practice.

**"Ancestor" is load-bearing.** Only ancestors truncate the sample. A sibling with `opacity: 0.32` does not. This is exactly our situation and section 7 depends on it.

**Painting order is load-bearing.** Only content painted *before* E is in the sample. Anything painted after E is not, no matter what it is.

**MDN's warning, verbatim:** "if a parent element has `opacity: 0.9`, it becomes a backdrop root and any child's `backdrop-filter` will only blur the content between that parent and the child, not the content behind the parent. This is a common source of confusion when `backdrop-filter` appears to have no visible effect despite being correctly applied."

The practical rule that follows: **never put alpha in `opacity` on or above a glass element. Put it in the background colour's alpha channel.** ThisDevTool states the same fix.

### 2.3a Where practitioner articles and the spec disagree: `transform`

The spec is explicit and negative:

> "A Backdrop Root is not formed by elements with z-index applied, fixed or sticky-positioned elements, and elements with transforms applied."

Multiple practitioner articles say the opposite, that a transformed ancestor breaks `backdrop-filter`. rampstack's `components/components.css` header addresses the disagreement head-on and sides with the spec, having tested it:

> "The rule is often quoted with `transform` in the list too; measured on Chromium, a transformed ancestor did not break the blur."

**Verdict: transform is not in the spec's list, and one practitioner reports measuring that it does not break the blur on Chromium.** The confusion probably arises because a transformed ancestor commonly co-occurs with `overflow` clipping and with `will-change: transform`, and `will-change` on a transform is not a backdrop-root trigger either, but `will-change: opacity` and `will-change: filter` are. Do not add `translateZ(0)` hacks on faith.

### 2.3b `overflow` clipping

`overflow: hidden` on an ancestor does not create a Backdrop Root, but it clips the pixels before the filter runs. Comeau, on Chrome specifically: "the overflow trimming occurs *before* the filters are applied". The result is a blur that samples a truncated backdrop. Use `mask-image` instead when you need to trim a filtered surface.

### 2.4 Stacking context, isolation, and the containing-block side effect

Three separate facts, often conflated.

- `backdrop-filter` other than `none` **creates a stacking context**, per Filter Effects 2.
- It also **creates a containing block for absolutely and fixed positioned descendants**, per the same spec. fxtf issue 408 is an open complaint about exactly this: "backdrop-filter apparently requires all child elements to be contained and therefore messes up all absolute/fixed/relative children that previously escaped." If you put `backdrop-filter` on a card, any `position: absolute` child that used to escape the card now cannot. Issue status: open.
- From Compositing and Blending Level 1: in CSS, "everything that creates a stacking context must be considered an 'isolated' group." So a `backdrop-filter` element is an isolation boundary for blending. **A `mix-blend-mode` layer placed inside a glass card can only blend with the card's own content, never with the page behind the card.**

That last point is why `isolation: isolate` in the reference panel in 1.7 is marked "see 2.4": if the element already has `backdrop-filter`, `isolation: isolate` is redundant. Add it only on a surface that has no filter and still needs to contain blending.

### 2.5 Nesting

Per the spec, a `backdrop-filter` element is itself a Backdrop Root. So a nested glass surface samples only the content painted between its glass parent and itself, which is usually nothing, so the blur has no effect and the alphas simply stack.

Chromium goes further than that. From Havn, "Chromium and Nested Backdrop-Filters": "If an element has a backdrop-filter, Chromium won't let its children have it as well", and this renders correctly in Firefox and Safari but not in Chromium. The Chromium position, per that article, is that their interpretation matches the spec and the others are wrong. Their workaround is to swap the parent to an opaque background and drop its filter while the child is active:

```css
header { background: rgba(237, 242, 247, .7); backdrop-filter: blur(20px); }
header:focus-within { background: rgb(237, 242, 247); backdrop-filter: none; }
```

**Design rule, and it is not optional: one `backdrop-filter` per stack.** rampstack states it as rule 1 of four and explains the arithmetic: "Stacking two backdrop-filters means the upper one blurs the lower one's already-composited output, so the alphas multiply rather than add."

Our `src/styles/atlas-spine.css` currently violates this. `.av2 .glass` has `blur(26px) saturate(1.15)` and `.av2 .panel` has `blur(10px)`, and panels sit inside glass cards. In Chromium the panel's filter is doing nothing at all; in Firefox and Safari it is blurring an already-blurred, already-filled surface. Three browsers, three renderings, and the CSS says nothing about which one is intended.

### 2.6 The documented interaction with `mix-blend-mode`, and the direct answer to the question asked

**Question:** does a `multiply` layer above a `backdrop-filtered` element change what the filter samples?

**Answer: no, not what it samples, if it genuinely paints after the element. But four other things happen, and one of them is a silent kill.**

**(a) It is not sampled.** The Backdrop Root Image is "all content in painting order between (and including) the ancestor Backdrop Root and element E". A layer painted after E is outside that range by definition. The filter never sees it.

**(b) It still lands on the result.** `mix-blend-mode` blends with its backdrop, which Compositing 1 defines as "all previous elements composited together". Multiply is `B(Cb, Cs) = Cb x Cs`. So the noise multiplies over the finished card: fill, blurred backdrop, border, catch-light and all. Every highlight you drew gets darkened by the noise. At 50% opacity with a 0.028-alpha noise texture, that is small, but it is not zero, and it moves in the wrong direction: multiply can only darken, so it eats the catch-light preferentially.

**(c) If it is an ANCESTOR rather than a sibling, the blur dies.** A wrapper with `mix-blend-mode: multiply` is a Backdrop Root by rule 6. Every descendant card's `backdrop-filter` collapses to sampling whatever paints between the wrapper and the card, which is normally nothing. The card keeps its fill and quietly loses its blur, with no error and no visual clue other than the effect being absent. This is the single most common cause of "backdrop-filter isn't working".

**(d) If it paints BEFORE the element, it is sampled and blurred.** This is the case in our repo and is covered in section 7.

**(e) The combination has a bug history, and the fixes are recent.** WebKit Bug 176830, "Combining `mix-blend-mode` and `-webkit-backdrop-filter` leads to unexpected results": nine possible state combinations, only four rendering correctly, symptoms including "blend mode works, blur works for border, but square is covered". Status RESOLVED FIXED, but the timeline matters: first fix at commit 268426@main in September 2023, which introduced regression bug 267438 causing backdrop-filter clipping, then a follow-up at 276430@main in March 2024. **So Safari versions before roughly 17.4 render this combination wrong, in at least two different ways depending on version.** Chromium issue 40794542 covers a related failure (UNREAD, sign-in wall).

**(f) The spec knew.** Markus Stange, on the fxtf list in April 2018, argued that `mix-blend-mode` already "has an existing definition for what exactly the backdrop is, and that definition respects isolation", and that "if `backdrop-filter` ends up using a different definition for what the backdrop is, there should be a good justification for the difference." The two definitions did end up different. The Backdrop Root truncates at ancestors with opacity, filter, mask, blend or backdrop-filter; the blending backdrop truncates at isolation groups. Every implementation bug in this area lives in the gap between those two definitions.

**Practical rule for us:** the noise layer and the glass must not be in an ancestor relationship in either direction, and their paint order must be a deliberate decision rather than an accident of `z-index`. See section 7.

---

## 3. Performance, measured

### 3.1 What the browser actually does

From mfreed7/backdrop-filter-feature, the Chromium implementation explainer, the pipeline is five steps:

1. A texture readback captures the Backdrop Image from the destination graphics texture.
2. The specified filters are applied to that captured content.
3. The result is clipped to the element's border-radius rect.
4. The processed image is drawn before any other element contents.
5. Remaining element and child content is rendered.

The performance argument for the Backdrop Root design, verbatim from the same explainer: because the backdrop is bounded at the nearest ancestor render surface, "No additional rasterization needs to take place, and this leads to a performant implementation."

That is the good news and it is real. The cost is not "re-rasterize the page". It is a readback plus a blur pass, per filtered element, per frame in which the sampled region changed.

### 3.2 Real numbers found

Honest inventory. There are not many, and the good ones are old.

- **Firefox, Bugzilla 1718471** ("backdrop-filter: blur is laggy when many elements are rendered"). Reported June 2021 against many DOM elements (table cells) with `blur(5px)`; scrolling "very laggy" on a June 2021 Nightly. Resolved via bug 1765520; by a June 2022 Nightly it was "pretty fast" and "even faster than in Chrome". Measured GPU time after the fix: **around 3ms on a relatively low-end AMD GPU**, with a profile note that "the majority of the time seems to be spent inside the graphics driver". Status RESOLVED FIXED.
- **W3Tweaks**: "backdrop-filter: blur() is the most expensive, it reads pixels from the layer below every frame", and iOS Safari specifically: applying `backdrop-filter` to a `position: fixed` element "causes severe scroll jank, the browser repaints the blurred area on every scroll frame".
- **flowrust / COSESAI**: cap blur at 16px because perceptual gains diminish beyond it; limit simultaneous filter passes to 2 or 3 because six passes degrades 60fps scrolling; "mid-range Android devices may drop 15-25 fps with 12px blur on hero cards". **Single-source, no methodology, no device named. Treat as a directional hint, not a measurement.**
- **Coherent Labs, Prysm global backdrop filter docs** (search summary only, not fully read): the global-filter feature "is best suited where there are lots of elements on screen that have the same backdrop filter effect", which is an engine vendor confirming that N independent filtered elements is the expensive shape.

**What I could not find:** any published, reproducible benchmark of N `backdrop-filter` cards over a fixed background image on named hardware, with frame times. Nothing in the sources read gives paint-versus-composite millisecond splits or GPU memory figures for this case. Section 8 says so plainly.

### 3.3 Does it re-sample on scroll?

Yes, whenever the sampled region changes relative to the element, which for a scrolling page of cards over a **fixed** background is every frame in which the card moves. The fixed background does not move, but the card does, so the region of the backdrop under the card changes and the readback plus blur must be redone.

Two second-order effects worth knowing:

- Comeau: "Elements outside the viewport never trigger blur recalculation", which is why filtered surfaces flicker as they enter the viewport.
- fxtf 374's `edgeMode="duplicate"` artifact is a *scroll* artifact as much as a static one: "As the element slides, new colors suddenly intrude into the blurred output". Over a photograph with hard tonal boundaries, expect the card edges to shimmer during scroll.

Separately, `background-attachment: fixed` has its own well-known paint cost, independent of any filter: it forces a repaint of the image on every scroll because the image must be repainted at a new position relative to the DOM. *(From search-result summaries of the Vehikl and Chen Hui Jing articles, not fully read.)* Our site does not use `background-attachment: fixed`; it uses `position: fixed` layers, which is the better shape.

### 3.4 Mitigations: which are real, which are cargo cult

**Real.**

- **Fewer, larger filtered surfaces.** One filtered element covering a region beats twelve filtered cards inside it. This is the mitigation with the strongest support: the Firefox bug was specifically about many elements, and the Coherent Labs global-filter feature exists precisely because many-elements-same-filter is the pathological case. It is also free: you are not degrading the effect, you are moving where it is computed.
- **Bound the filtered area.** flowrust's first rule. Do not run the filter at 100% x 100% of the viewport when the visible glass is a 1060px column.
- **A static pre-blurred image.** Blur the photograph once, at build time, and position the blurred copy behind the card region with no runtime filter at all. Per-frame cost drops to zero. This is exactly Microsoft's Mica strategy: "Mica is specifically designed for app performance as it only samples the desktop wallpaper once to create its visualization." The cost is that the blur cannot respond to what scrolls past, which for a **fixed** background is a much smaller loss than it sounds, because the background is not scrolling either. **For our site this is the single strongest available optimisation and it is under-considered.**
- **Drop the material entirely on the branches that ask for it.** `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, and `@supports not (backdrop-filter: ...)`. Microsoft goes further and disables Acrylic automatically in Battery Saver mode and on low-end hardware; the web has no equivalent signal, but `(hover: none) and (pointer: coarse)` is a crude proxy and W3Tweaks recommends it for exactly this.
- **Never run a filter behind an opaque fill.** Free win, already documented in our own `globals.css`.

**Cargo cult, or worse.**

- **`will-change: filter` sprinkled on glass elements.** `will-change` is a hint for imminent animation and every promoted layer costs GPU memory. Worse: **`will-change` set to a backdrop-root property actively creates a Backdrop Root.** MDN's own demonstration of the backdrop-root concept uses `will-change: opacity` on a parent purely to break a child's `backdrop-filter`. So `will-change` in this area is at best neutral and at worst the bug. Use it only around an actual animation, and never with `opacity`, `filter`, `mask` or `mix-blend-mode` as the value on anything above a glass surface.
- **`contain: paint`.** **No source read in this session supports `contain: paint` as a `backdrop-filter` optimisation.** It is a clipping and containment primitive, and clipping is the wrong direction: `overflow`-style trimming happens *before* filtering in Chrome (Comeau), so containment that clips is more likely to starve the filter than to speed it up. `backdrop-filter` already establishes a containing block on its own. **Unproven; do not add it on faith.**
- **`transform: translateZ(0)` on the filtered element.** No support found. The spec has to apply inverse transforms when the element is transformed relative to the backdrop root (algorithm step 3), so you are adding work, not removing it.
- **Animating the blur radius.** Search-result summary consensus: animating blur re-triggers compositing every frame. Animate `opacity` on the glass layer instead and hold the blur constant.

---

## 4. Accessibility, and measuring contrast on a translucent surface

### 4.1 `prefers-reduced-transparency`: syntax

```css
/* boolean context, true when the value is `reduce` */
@media (prefers-reduced-transparency) { }

/* explicit */
@media (prefers-reduced-transparency: reduce) { }
@media (prefers-reduced-transparency: no-preference) { }
```

Values are `no-preference` and `reduce`. OS settings that drive it, per MDN: Windows 10/11 Settings > Personalization > Colors > Transparency effects; macOS System Settings > Accessibility > Display > Reduce transparency; iOS Settings > Accessibility > Display and Text Size > Reduce Transparency.

### 4.2 Support, and why this changes the design

From Can I Use, `mdn-css_at-rules_media_prefers-reduced-transparency`: **global usage 73.41%**.

- Chrome 118+, Edge 118+, Opera 104+, Samsung Internet 25+, Chrome for Android 151+, Android Browser 151+, Opera Mobile 80+.
- **Safari: "Not supported" across all versions 3.1 through 27.** Technical Preview status unknown. I fetched the WebKit blog post for Safari 27 beta and searched it: `prefers-reduced-transparency`, `prefers-contrast`, "reduced transparency", `backdrop-filter` and "Liquid Glass" are **not mentioned anywhere** in the 58-features post.
- **Firefox: implemented but disabled by default since 113**, behind `layout.css.prefers-reduced-transparency.enabled`, per Bugzilla 1736914 ("off by default always for now"). A separate bug, 1822176, tracks enabling it. Platform behaviour if enabled: Windows and macOS read a dedicated OS setting; Android and Linux/GTK enable it when `prefers-reduced-motion` is also enabled because no dedicated setting exists.

**The design consequence is severe and it is the most important accessibility finding in this document.** An iPhone or Mac user who has turned Reduce Transparency on, in the operating system, for accessibility reasons, will **not** get your reduced-transparency branch, because Safari does not implement the query. Neither will a default Firefox user.

Therefore: **`prefers-reduced-transparency` is a bonus, not a safety net.** The default rendering must be legible on its own for every user, and the query is an improvement for the roughly 73% who can receive it. Any design whose accessibility depends on the query is broken for the exact population the query exists to serve.

### 4.3 What a correct fallback looks like

Three layers, in this order.

```css
/* 1. The baseline is safe on its own. Alpha lives in a token so it moves in one place. */
:root {
  --glass-alpha: 0.72;
  --glass-blur: blur(18px) saturate(1.15);
}

.pane {
  background-color: rgb(255 255 255 / var(--glass-alpha));
  -webkit-backdrop-filter: var(--glass-blur);
          backdrop-filter: var(--glass-blur);
}

/* 2. No backdrop-filter support: the alpha must carry the whole job alone. */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root { --glass-alpha: 0.95; }
}

/* 3. Reduced transparency: retire the material, keep the hierarchy. */
@media (prefers-reduced-transparency: reduce) {
  :root {
    --glass-alpha: 1;
    --glass-blur: none;
  }
}

/* 4. More contrast: retire it harder. */
@media (prefers-contrast: more) {
  :root {
    --glass-alpha: 1;
    --glass-blur: none;
  }
}
```

The Chrome for Developers article recommends the **additive** framing (build the safe baseline, add transparency under `no-preference`) over the **subtractive** one, and explicitly says the additive strategy "is best when there is good browser support". Given 73.41% and no Safari, support is *not* good, so for us the subtractive form above is correct: the baseline must already be safe.

rampstack's reduced-transparency branch is the best worked example found. It does not merely raise alphas; it **swaps the material and keeps the ladder**:

```css
@media (prefers-reduced-transparency: reduce) {
  :root {
    --gl-ground: #0f1435;
    --gl-orb-alpha: 0;        /* the varied ground goes flat */
    --gl-veil-opacity: 0;

    --gl-surface-1: #171c38;  /* ink 14.74:1 */
    --gl-surface-2: #1e2444;  /* ink 13.35:1 */
    --gl-surface-3: #262d54;  /* ink 11.71:1 */

    --gl-backdrop-1: none;
    --gl-backdrop-2: none;
    --gl-backdrop-3: none;

    /* With no blur to soften them, the edges can come down to hairlines. */
    --gl-edge-boundary: rgba(255, 255, 255, 0.22);
    --gl-edge-strong:   rgba(255, 255, 255, 0.42);
    --gl-highlight:     rgba(255, 255, 255, 0.42);
  }
}
```

Two things to steal. First, **the three tiers survive as three opaque values in the same order**, so hierarchy built from elevation still reads; you do not collapse three surfaces into one white. Second, **the edges get thinner, not thicker**, because there is no blur softening them any more. Most implementations get this backwards.

And their `prefers-contrast: more` branch takes a harder line than most, with a rationale worth quoting: "Glass at any alpha puts a variable backdrop behind the text, and a reader who has asked for more contrast is asking for the variable to go."

Axess Lab's list of what actually fails, for completeness: low contrast over colourful imagery (worst for age-related vision loss and colour blindness), background interference as visual clutter, blur as a trigger for vestibular issues and eye strain, and disrupted information hierarchy for screen-magnifier users.

### 4.4 The crux: how do you measure contrast on a translucent surface?

#### 4.4.1 What WCAG actually says, and what it does not

WCAG 2.x has **no computational method for a non-uniform background.** Understanding SC 1.4.3 says only:

> "For the purpose of Success Criteria 1.4.3 and 1.4.6, contrast is measured with respect to the specified background over which the text is rendered in normal usage."

and

> "It is a failure if no background color is specified when the text color is specified, because the user's default background color is unknown and cannot be evaluated for sufficient contrast."

That second sentence is the whole principle: **an unknown background is a failure, not an unknown.** A translucent card over an arbitrary photograph is, formally, a background you have not specified.

Technique **G18** is the one place the standard addresses variation directly, and its answer is per-letter and local:

> "If the background or the letters vary in relative luminance (or are patterned) then the background around the letters can be chosen or shaded so that the letters maintain a 4.5:1 contrast ratio with the background behind them even if they do not have that contrast ratio with the entire background."

Its test procedure measures against "the background pixels immediately next to the letter", not the whole background. And its worked example is precisely our situation:

> "Text is placed over a picture of the college campus. Since a wide variety of colors and shades appear in the picture, the area behind the text is fogged white so that the picture is very faint and the maximum darkness is still light enough to maintain a 4.5:1 contrast ratio with the black text."

**That is the standard blessing a white translucent card at high alpha.** "Fogging" the picture is what our 0.955 card does. G18 also notes that a border around a letter counts: "the border can add contrast and would be used in calculating the contrast between the letter and its background." A **soft text-shadow** gets no such blessing anywhere in WCAG.

#### 4.4.2 The technique: alpha-composite, then measure

Source-over compositing, per channel, with the surface colour S at alpha a over backdrop pixel D:

```
result = a * S + (1 - a) * D
```

Then relative luminance and ratio exactly as WCAG defines them. The executable form, verbatim from `verify/contrast.js` in rampstackco/glassmorphism-theme:

```js
const toLinear = (v) => {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminance = (c) =>
  0.2126 * toLinear(c[0]) + 0.7152 * toLinear(c[1]) + 0.0722 * toLinear(c[2]);

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** src-over: `top` at alpha `a` composited onto `bottom`. */
const over = (bottom, top, a) => bottom.map((b, i) => b * (1 - a) + top[i] * a);
```

Note that `over` here returns **floats**, not rounded integers. That matters; see 7.4.

The stack for a glass card is two compositions, in this order:

1. Composite the card fill over the backdrop pixel to get the card's actual ground.
2. Composite the text colour (which may itself have alpha) over that ground.
3. Measure ratio between step 2's result and step 1's result.

#### 4.4.3 Worst-case pixel sampling versus worst-case bounding

Two ways to pick the backdrop pixel D.

**Sampling.** Render the page, read pixels, take the extreme. This is what the Colour Contrast Analyser eyedropper does, and what WebAIM and the Chrome DevTools docs describe: these tools "sample live pixels rather than relying on declared CSS values, reading the final pixel color after CSS cascades, opacity, blending modes, background images, and any JavaScript-applied styles resolve." It is correct for a single render and worthless as a gate, because it is a screenshot and screenshots do not run in CI.

**Bounding.** Compute, analytically, the extreme pixel the ground can produce, and measure against that. This is strictly better and rampstack is the only published system found that does it. Their argument, from `tokens/tokens.css`:

> "A ratio quoted against an opaque background is a fact. A ratio quoted against a translucent one is a claim about every pixel the surface might ever sit over, and most of this file exists to make that claim provable."

Their three-step method:

> "1. The ground is built from a base color and a fixed set of orb colors, each painted at `--gl-orb-alpha`. Source-over compositing makes every rendered channel a weighted average of those inputs, so the lightest pixel the ground can produce is computable rather than observed. That ceiling is `--gl-ground-peak`.
> 2. Glass adds white at a known alpha. Compositing white over the ceiling gives the lightest surface any text can land on.
> 3. Every ink ratio in this file is measured against that worst case, not against a screenshot."

**And the theorem that makes this survive the blur, verbatim:**

> "Blur is a weighted average over a neighbourhood, so it cannot exceed the maximum of that neighbourhood either. The bound survives backdrop-filter."

This is the key result of the whole section. **You never have to model the blur.** A Gaussian blur is a convex combination of the pixels in its kernel, so its output is bounded by the min and max of its input. Bound the *ground*, and the bound holds for every blur radius, forever. Their `groundPeak()` function computes the per-channel maximum by pairing the largest input channel with the largest source-over weight, and they verify it against the rendered page: "no pixel of the demo's ground exceeds it on any channel, at either 1280 or 390."

For a **photograph** the bound is even easier than for their gradient orbs: the extremes are just the darkest and lightest pixel in the image file, which you compute once at build time. Our own `globals.css` already did this by hand for the current card (see 7.4).

#### 4.4.4 Tooling that actually does this

Honest assessment. There is very little.

- **Chrome DevTools, axe, WAVE, Lighthouse: cannot do it.** Per the WebAIM and DevTools documentation: automated scanners cannot reliably assess contrast for text on a gradient, a background image, a semi-transparent layer, or complex CSS stacking; these cases require manual inspection. DevTools reports no ratio at all rather than a wrong one, which is the right behaviour and also means your CI is silent about the one surface that needs checking.
- **Colour Contrast Analyser (CCA) desktop app.** Eyedropper on rendered pixels. Manual, correct, not automatable.
- **Optimal Overlay Finder** (a CodePen tool referenced by Smashing Magazine): calculates the overlay opacity needed for WCAG compliance over a given image. Useful for choosing a scrim alpha; single-image, manual.
- **Scrim That** (Figma plugin, same Smashing source): applies scrims automatically in design, not in code.
- **`verify/contrast.js`** in rampstackco/glassmorphism-theme. The only executable, token-level, worst-case-bounding verifier found. It "reads the real token file rather than a copy and exits non-zero when a value drifts away from the ratio", and it re-derives the ground ceiling on every run so a colour change cannot silently invalidate a published ratio. This is the shape our gate should take.
- **APCA** (https://apcacontrast.com/, https://github.com/Myndex/SAPC-APCA). Perceptually uniform lightness-contrast prediction, the WCAG 3 direction. Relevant here because it is sensitive to font weight and size in a way WCAG 2 is not, which is exactly the axis that glass stresses. It does not solve the variable-background problem; you still have to composite first. Use it as a second opinion on small type, not as a replacement for the AA gate.

Their measured numbers, worth having as calibration for how large the effect is:

| Case | Without the fix | With the fix |
| --- | --- | --- |
| Nav link on a tier-2 fill, body text passing under it | **1.24:1** | **5.27:1** (with scrim) |
| Info fill label at decorative alpha 0.20 | **4.47:1** | **6.58:1** (at alpha floor 0.62) |
| Danger fill label at alpha 0.20 | **4.08:1** | **6.37:1** (at alpha floor 0.62) |
| Ink at tier 2, reduced-transparency branch | 5.78:1 | **13.35:1** |

The 1.24:1 case is the one to internalise. That is not a near miss. That is a nav bar whose text is invisible when a paragraph scrolls under it, and rampstack notes it is "not visible in a screenshot of the top of a page, which is where this register's failures like to hide."

---

## 5. The transparency ladder

### 5.1 Apple

**Sourcing caveat first: the Apple HIG Materials page and the SwiftUI `Material` documentation both failed to fetch (title-only responses and a 404). Everything in this subsection comes from search-result summaries of those pages, not from a full read. No numeric values were obtained from any Apple source, and I believe none are published.**

The ladder is **five ordinal steps**, thinnest to thickest: `.ultraThinMaterial`, `.thinMaterial`, `.regularMaterial`, `.thickMaterial`, `.ultraThickMaterial`. The stated semantic is how much of the background shows through, and the stated trade is explicit: **thicker materials give better contrast for text and for elements with fine features.**

The second axis is **vibrancy**, with four levels for labels, fills and separators: primary, secondary, tertiary, quaternary. The cross-product rule is the interesting part: **quaternary vibrancy is not recommended on thin and ultra-thin materials, because the contrast is too low.** And: "Help ensure legibility by using only vibrant colors on top of materials."

So Apple's system is a **two-dimensional table with forbidden cells**, not a one-dimensional alpha scale. Material thickness x vibrancy level, with the thin-plus-faint corner disallowed. That is a materially better idea than a single opacity token, and it is the part of Apple's approach worth taking even though we are explicitly not doing Liquid Glass.

### 5.2 Microsoft Fluent

Fluent 2 names **four materials**: solid, mica, acrylic, smoke. No numeric opacity, blur or tint values appear on the Fluent 2 material page. The Windows docs are richer and contain the real design thinking.

**Acrylic**, the translucent one:

- Two blend types. **Background acrylic** reveals the desktop wallpaper and other windows. **In-app acrylic** reveals only content inside the app frame.
- **It is for transient surfaces only.** "Use background acrylic for transient UI elements", meaning context menus, flyouts, non-modal popups, light-dismiss panes. For vertical panes and sectioning surfaces: "we recommend you use an opaque background instead of acrylic."
- "Don't put desktop acrylic on large background surfaces of your app."
- "Avoid layering multiple acrylic surfaces: multiple layers of background acrylic can create distracting optical illusions." And: "try not to place multiple pieces of acrylic edge-to-edge, this can create an unwanted seam between the two blurred surfaces."
- The recipe, verbatim: "background, blur, exclusion blend, color/tint overlay, noise". Note **noise is part of the material**, and note the **exclusion blend layer**, added, in their words, "to ensure contrast and legibility of UI placed on an acrylic background".
- Legibility: "We've optimized the acrylic resources such that text meets contrast ratios on top of acrylic. We don't recommend placing accent-colored text on your acrylic surfaces because these combinations are likely to not pass minimum contrast ratio requirements at the default 14px font size. Try to avoid placing hyperlinks over acrylic elements."
- Performance and adaptation: "Rendering acrylic surfaces is GPU-intensive, which can increase device power consumption and shorten battery life. Acrylic effects are automatically disabled when a device enters Battery Saver mode." It also falls back to solid when the user turns off Transparency effects, on low-end hardware, on window deactivation, and on Xbox, HoloLens or tablet mode.

**Mica**, the opaque one: tinted by the desktop wallpaper, sampled **once**. "Mica is specifically designed for app performance as it only samples the desktop wallpaper once to create its visualization."

**The layering system is the transferable part.** Mica gives a two-layer model:

- **Base layer:** Mica.
- **Content layer:** picks up the material behind it using `LayerFillColorDefaultBrush`, described as "a low-opacity solid color", in one of two patterns, **Standard** (a contiguous background for large areas) or **Card** (segmented cards).

Mica Alt gives a three-layer model: base (Mica Alt), **commanding layer** (`LayerOnMicaBaseAltFillColorDefaultBrush`), **content layer** (`LayerFillColorDefaultBrush`).

And the hard rules: "**Don't apply backdrop material more than once in an application.**" "Don't apply backdrop material to a UI element. The backdrop material will not appear on the element itself."

**The synthesis of Apple and Microsoft is a single sentence: translucency belongs to the frame and to transient surfaces; content sits on low-opacity solid fills layered on top of it.** Neither vendor puts real content directly on a live-blurred surface. That is the opposite of what most web glassmorphism does, and it is the correct instinct for a page of figures.

### 5.3 A published web design system with real values

rampstackco/glassmorphism-theme is the only one found that publishes a full translucency ladder with derived, verified contrast numbers. Its ground is dark and its fills are white, so the numbers do not transfer directly to our light theme, but the **structure and the reasoning do**.

**Three tiers, not five, not eight:**

```css
--gl-alpha-1: 0.06;  /* recessed: wells, table rows, inline code */
--gl-alpha-2: 0.10;  /* the working surface: cards, panels, the nav */
--gl-alpha-3: 0.14;  /* near: menus, popovers, anything that floats over a panel */

--gl-blur-1: 12px;
--gl-blur-2: 20px;
--gl-blur-3: 32px;

--gl-saturate: 1.6;

--gl-surface-1: rgba(255, 255, 255, 0.06);  /* ink 6.42:1, muted 5.23:1 */
--gl-surface-2: rgba(255, 255, 255, 0.10);  /* ink 5.78:1, muted 4.71:1 */
--gl-surface-3: rgba(255, 255, 255, 0.14);  /* ink 5.77:1, muted 4.70:1 */
```

**Plus two tokens that are not tiers at all:**

```css
--gl-scrim:       rgba(18, 24, 64, 0.82);  /* for surfaces whose backdrop is CONTENT */
--gl-alpha-floor: 0.62;                    /* for any fill carrying text below 14px */
```

**The four rules that govern which surface gets which step:**

1. Alpha and blur rise together. "A surface nearer the viewer occludes more of what is behind it and defocuses it further, so alpha and blur rise together. Move one without the other and the tier stops reading as a distance and starts reading as a style."
2. A tier cannot sit on itself. Same-alpha surfaces create invisible boundaries.
3. **Content-facing surfaces use the scrim, not a tier.** "Every ratio in this file is measured against the ground, and that is sound for a panel sitting on the ground. It says nothing about a surface whose backdrop is the document: a sticky bar with the page scrolling under it, or anything floating over another surface. That backdrop is not bounded by `--gl-ground-peak`. It contains ink."
4. No `opacity` or `filter` between a surface and the ground.

**Why three and not four**, which is the answer to "how many steps":

> "The alphas are low on purpose. Every step up costs ink contrast on the ground: tier 1 carries ink at 6.42:1 and tier 2 at 5.78:1, and a third step on the ground would put the muted ink under AA. That is why tier 3 is scrimmed rather than merely lighter, and why there is no tier 4."

**The number of steps is set by the contrast budget, not by taste.** That is the single most useful idea in this section. You compute how many alpha steps fit between "visible as a distinct tier" and "the muted ink drops under 4.5:1", and that integer is your ladder length.

**Why saturation rises with blur:** "blurring a region pulls its colors toward their average, which drains them. Restoring saturation is what keeps a blurred orb reading as colored light rather than as haze."

**Why the alpha floor exists:** at a decorative alpha of 0.20 their semantic fills put a small label at 4.47:1 and 4.08:1, "which is a failure that only appears where an orb happens to be". At 0.62, "the fill rather than the backdrop sets the label's background", and the same two cases measure 6.58:1 and 6.37:1. Their rule: "Any fill carrying text below `--gl-text-sm` takes this alpha. Nothing else does; a panel at 0.62 is a painted box with a blur behind it that no one can see."

**Their edge tokens are also derived, not chosen:**

```css
--gl-edge:          rgba(255, 255, 255, 0.16);  /* hairline, decorative only, allowed to fail */
--gl-edge-boundary: rgba(255, 255, 255, 0.34);  /* 3.06:1 against the darkest ground */
--gl-edge-strong:   rgba(255, 255, 255, 0.60);  /* 3.49:1 against the lightest panel */
--gl-highlight:     rgba(255, 255, 255, 0.68);  /* the catch-light along a top edge */
```

With the reason the edge has to be drawn at all: "On this ground a tier-1 panel measures 1.17:1 against the darkest ground it can sit over, so a glass fill cannot carry its own boundary at any alpha this register permits. Reaching 3:1 on fill alone needs roughly 0.34 alpha, which is a painted surface. The edge is therefore structural rather than decorative, and it is drawn."

**And their rule about actions, which we should adopt verbatim:** "Both actions are opaque. A translucent call to action inherits the ground's variance and its label's contrast becomes a function of where the reader scrolled to, which is not a trade worth making for one more frosted rectangle."

### 5.4 Radix Colors

*(From search-result summaries of Radix documentation; the two Radix pages I fetched did not contain the alpha material. Treat as secondhand.)*

Every Radix scale ships a matching alpha variant, and the stated design goal is that alpha colours "appear visually the same when placed over the page background", so components can blend into coloured backgrounds without per-context tuning. Radix also ships wide-gamut definitions specifically because "alpha blending works differently in P3 than in sRGB". That last point is a real trap for us: on a P3 display, an alpha-composited surface over a photograph will not land where your sRGB arithmetic says it will. Our contrast gate computes in sRGB, which matches the Filter Effects 2 requirement that "Filter functions must operate in the sRGB color space", so the gate is right; the *rendered* colour on a wide-gamut display may differ slightly. Worth knowing, not worth acting on yet.

### 5.5 What the ladder should look like, in shape

Every system converges on the same shape, whatever the numbers:

| Role | Apple | Microsoft | rampstack |
| --- | --- | --- | --- |
| The ground | the wallpaper / content behind | wallpaper (Mica) | base plus orbs |
| The frame / long-lived surface | thick material | **Mica, opaque** | tier 2 |
| Transient / floating surface | thin material | **Acrylic, translucent** | tier 3 |
| The layer content actually sits on | opaque-ish, vibrancy-restricted | **`LayerFillColorDefaultBrush`, "a low-opacity solid color"** | scrim, or alpha floor 0.62 |
| Steps | 5 ordinal, no numbers published | 2 materials plus 2 or 3 layers | 3 tiers plus scrim plus floor |

**Three steps plus a scrim plus a floor is the shape that survives contact with a contrast gate.** Five steps is Apple's, and Apple can afford five because it controls the compositor and can publish forbidden cells in a two-axis table. On the web, three.

---

## 6. Typography on glass

This section is opinionated, as asked. The founder wants to retire fonts that are not readable; here is the case, and the list.

### 6.1 The structural fact that drives everything else

**A translucent surface spends the contrast budget that an opaque surface spends on typographic hierarchy.**

That is rampstack's finding, and it is the most important sentence in this section:

> "Two inks, and the second one is barely muted, because a translucent surface spends the contrast budget that opaque surfaces spend on typographic hierarchy. On this ground, ink at 5.78:1 and muted ink at 4.71:1 are the two steps available at the worst case. A third, dimmer step exists on paper and fails wherever an orb sits, so the theme does not ship one and pushes secondary emphasis into weight and size instead. That is the register's real cost, and it is a cost in typography rather than in color."

Apple reached the same conclusion by a different route: quaternary vibrancy is forbidden on thin materials because the contrast is too low. Microsoft reached it a third way: do not put accent-coloured text on Acrylic, and avoid hyperlinks over it.

**Three independent systems all say: on glass, you lose your faintest grey.** Plan for it. Hierarchy moves into size, weight and space.

### 6.2 Weight: retire 100 to 300, without exception

*(Sources here are search-result summaries plus one study I could not fetch in full. Flagged accordingly, but the direction is unanimous across every source consulted.)*

- Thin weights (100 to 300) have strokes that disappear or become inconsistent for low-vision readers.
- High-contrast typefaces (thick verticals, thin horizontals) reduce legibility at small sizes; an even or moderately contrasted stroke is more robust.
- The one peer-reviewed study surfaced, "The effect of serifs and stroke contrast on low vision reading" (PubMed 36563495, **UNREAD, cookie wall**, summarised secondhand): in readers with low visual acuity caused by ADOA, **serifs combined with a uniform stroke width** produced better legibility than other combinations of uniform-versus-variable stroke width and presence-versus-absence of serifs.
- Anti-aliasing on OLED screens blurs thin strokes; one source claims a legibility reduction "of up to 25% for low-vision users". **Single, weak source. Directionally right, do not quote the number.**
- Medium weights (regular 400 through semibold 600) are the recommendation everywhere. Very heavy weights fill in counters at small sizes and are also bad.

**The verdict for our stack:**

- **Fraunces is the one to look at hard.** It is a variable serif whose display optical sizes carry real stroke contrast, plus `SOFT` and `WONK` axes that further modulate stroke behaviour. Over a translucent card the thin strokes are competing with a moving backdrop for the same few levels of luminance. **Keep Fraunces for display only, at 30px and above, at 400 or heavier, with the optical-size axis set for text rather than display if you use it below 40px. Do not use it for a table cell, a label, a caption, an axis tick, or any figure under 24px.** That is not a retirement; it is a confinement, and it is the correct one, because a high-contrast serif at 40px on glass is beautiful and the same face at 13px on glass is a smear.
- **Geist and Space Grotesk are both low-stroke-contrast grotesques and both survive glass at text sizes.** Use Geist for the figures. Keep `font-variant-numeric: tabular-nums lining-nums` (already set on `.fig` in `atlas-spine.css`), because on a varying ground, columns that do not align read as noise.
- **Ban weights below 400 everywhere on a translucent surface.** If a design calls for "lighter", the answer is smaller and more spaced, or more white around it, never thinner.
- **Cap at 600 for text.** 700 and above is for display only.

### 6.3 Size floors

rampstack's floors, which match the general UI guidance found:

```css
--gl-text-body: 1rem;      /* 16px, and the floor for form inputs on iOS */
--gl-text-sm:   0.875rem;  /* 14px, the floor for any body content */
--gl-text-xs:   0.75rem;   /* 12px, labels and badges only, never prose */
```

Microsoft's Acrylic legibility note independently pins the same threshold from the other direction: accent-coloured text on Acrylic is "likely to not pass minimum contrast ratio requirements **at the default 14px font size**".

**Our `.lab` class is currently 10.5px** (`src/styles/atlas-spine.css`: `font-size:10.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase`). That is below every floor found in this research. It survives today only because the card is at 0.955 alpha and therefore effectively opaque. **The moment the card becomes real glass, 10.5px uppercase labels are the first thing that fails**, and it will fail invisibly, only where a dark region of the photograph happens to sit. This is the exact failure rampstack's alpha floor exists to prevent.

Two acceptable answers: raise `.lab` to 11.5 or 12px, or give every surface that carries `.lab` an alpha floor. Preferably both.

### 6.4 Letter-spacing

Blur behind type raises the risk of adjacent characters visually merging, because the eye is separating letterforms against a lower effective local contrast.

- **Negative tracking gets worse on glass.** Our headings run `-0.022em` and `.fig` runs `-0.01em`. That is fine at 32 to 48px. It is the wrong direction below 16px and should not be inherited downward.
- **Positive tracking on small uppercase is right and should stay.** `.lab` at `.13em` is correct; uppercase at small sizes needs it, and it needs it more on glass, not less.
- Do not add tracking as a substitute for size or weight. It buys separation, not stroke.

### 6.5 Text shadow versus a stabilizing plate

**The plate. Not the shadow. This is not close.**

The argument in four parts:

1. **No contrast formula counts a soft shadow.** WCAG G18 counts a *border*: "When there is a border around the letter, the border can add contrast and would be used in calculating the contrast between the letter and its background." A one-pixel solid outline is measurable. A `text-shadow: 0 1px 3px rgba(0,0,0,.4)` is not, by any tool. **If you use a shadow to make text readable, you cannot make a contrast claim about it, so you have made your gate lie.**
2. **The accessibility consensus is explicit.** From the sources read: a scrim "instantly quiets the background and creates a consistent, high-contrast surface"; a text shadow "is often not enough on its own to solve a major contrast issue, functioning as a helper, not the hero"; and a poorly designed fuzzy shadow "can actually make the text even harder to read".
3. **WCAG's own worked example is a plate.** G18's college-campus example fogs the area behind the text white. That is a plate.
4. **Both vendors do it.** Microsoft's content layer is `LayerFillColorDefaultBrush`, "a low-opacity solid color", sitting on top of the material. Apple's guidance is to use only vibrant colours on materials and to prefer thicker materials where fine features matter. Neither ships a text shadow.

So: **the inner "stabilized plate" from the anatomy is not a stylistic flourish, it is the accessibility mechanism.** Figures sit on the plate. The plate sits on the glass. The glass sits on the photograph. Text never touches the glass directly.

One legitimate use for a shadow remains: a **1px hard outline** (`text-shadow: 0 0 0 ...` does nothing; use `-webkit-text-stroke` or a four-way 1px shadow) on text that genuinely must sit over an image with no plate, such as a hero caption over a photograph. Even then, measure the outline colour against the worst-case pixel, per G18.

### 6.6 Padding

rampstack again, and it is a real observation nobody else made:

> "Panel padding runs one step wider than an opaque theme would take, because a frosted surface has no hard edge to hold text away from and a cramped glass panel reads as a smudge."

A translucent edge is a gradient, not a line. Text set close to it sits in the gradient. Go one step up the space scale on glass surfaces.

### 6.7 The retirement list, concretely

| Retire | Where | Why |
| --- | --- | --- |
| Any weight below 400 | everywhere on a translucent surface | strokes drop out at low local contrast |
| Fraunces below 24px | tables, labels, captions, ticks, figures | stroke contrast plus a varying ground |
| Fraunces at optical-size display settings below 40px | headings | thin strokes at the wrong optical size |
| Prose below 14px | anywhere | below every published floor |
| Any text below 14px on a fill without the alpha floor | labels, badges, chips | fails only where the photo is dark, so it fails invisibly |
| Accent-coloured text on glass | links, terracotta text | Microsoft's explicit finding at 14px |
| A third, fainter grey | body, caption, meta hierarchy | the budget does not exist on glass |
| Text shadow as a contrast mechanism | everywhere | no formula counts it |

---

## 7. WHAT APPLIES TO A PAGE OF FINANCIAL FIGURES OVER A PHOTOGRAPH

### 7.1 What is actually in the repository right now

Read, not assumed. File and line references are to the working tree at the time of writing.

**The ground, `src/components/AtlasFrame.tsx:117-146`:** two fixed layers at `z-index: 0`. A white base, then the photograph with `opacity: 0.32` and `filter: saturate(0.85) contrast(1.02)`. Same treatment at `src/components/spine/shell.tsx:62` and `src/app/dev/spine/layout.tsx:27`.

**A second, different ground, `src/app/globals.css:553-665`:** `.atlas-frame-gutters` is a `position: fixed` layer carrying `.atlas-placephoto` at `opacity: 0.5` with `filter: saturate(0.82)`. Above it, `.atlas-frame-gutters::after` paints a **cream veil that is fully opaque across the centre column** and fades to transparent in the gutters. So on this path, **a card in the data column has an opaque cream backdrop and the photograph is only in the margins.** Below 1100px both the photo and the veil are `display: none`.

**The card, `src/styles/atlas-spine.css:47` and `:169-186`:** `--card: rgba(255,255,255,.955)`, `backdrop-filter: blur(26px) saturate(1.15)`, `border: 1px solid rgba(255,255,255,.72)`, and the seven-layer `box-shadow` quoted in section 1.2.

**A nested filtered surface, `src/styles/atlas-spine.css:191-197`:** `.panel` also carries `backdrop-filter: blur(10px)`, and panels sit inside `.glass` cards.

**The noise, `src/styles/atlas-spine.css:149-152`:**

```css
.av2::after{
  content:"";position:fixed;inset:0;z-index:1;pointer-events:none;
  opacity:.5;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,...feTurbulence baseFrequency='.85' numOctaves='2'... opacity='.028'...");
}
```

**The masthead, `src/app/globals.css:720-760`:** already correctly retired to opaque `#ffffff` with the blur removed, with a written rationale that matches everything in section 3.4.

### 7.2 Correction to the brief: the noise is below the cards, not above

`.av2::after` is at `z-index: 1`. `.av2 .wrap`, which contains the cards, is at `z-index: 2` (`src/styles/atlas-spine.css:153`). **The noise therefore paints before the cards, which means it is inside the Backdrop Root Image and it is sampled and blurred by every card.**

That reverses the answer to the question asked. Restating both cases precisely:

- **As built (noise below, z-index 1 versus 2):** the noise is part of what the card blurs. The multiply happens once, on the ground, before the card samples it. The card's blur then averages the noise away almost entirely, because a fractal noise at `baseFrequency 0.85` has a spatial period far below a 26px blur kernel. **You are paying for a noise texture that the blur deletes under every card and preserves only in the gaps between them.** That is not necessarily wrong (it is the same crisp-outside, absent-inside effect rampstack deliberately engineers with its veil, and they measured it: standard deviation 0.88 outside a panel, 0 inside one), but it should be a decision, not an accident.
- **If the noise were above (higher z, or later paint):** it would not be sampled, and it would instead multiply over the finished card, darkening the fill, the border and the catch-light. Multiply can only darken, so it would eat the highlight preferentially and the glass would lose its light direction.

**Whichever you choose, write it down as a rule, because the two renderings are different and nothing in the CSS currently states which is intended.**

Two related hazards to record as rules:

- `.av2::after` carries **both** `opacity: .5` and `mix-blend-mode: multiply`, either of which makes it a Backdrop Root. It is harmless today because it is a **sibling** of the content, not an ancestor. **If anyone ever moves the noise onto a wrapper around the page, every card's blur dies silently.**
- Same for the photograph: `opacity: 0.32` plus a `filter` on a sibling layer is fine. On an ancestor it would be fatal.

### 7.3 Why the card is glass in name only, with the arithmetic

The card's ground, per pixel, for the AtlasFrame path (white base, photo at 0.32, card at alpha `a`):

```
photoGround(P) = 0.32 * P + 0.68 * 255
cardGround(P, a) = a * 255 + (1 - a) * photoGround(P)
                 = 255a + (1 - a) * (0.32P + 173.4)
```

At `a = 0.955`:

```
cardGround(0,   0.955) = 251.3     (darkest possible photo pixel)
cardGround(255, 0.955) = 255.0     (lightest possible photo pixel)
```

**Across the entire black-to-white range of the photograph, the card's ground moves by 3.7 levels out of 255. That is 1.44% of the picture's signal.** The photograph contributes 4.5% of 32%, and 4.5% x 32% = 1.44%. That number, not the blur radius, is why it reads as white.

The repository already knows the first half of this. `src/app/globals.css:160-169` states that the darkest pixel in `/spine/_skyline.jpeg` is `rgb(1,2,0)`, which at 0.32 over white gives a backdrop of `rgb(173)`, and that the worst card ground is `rgb(251.3)`, moving body ink from 15.85:1 to 15.36:1. **That is exactly the right method, applied by hand, once.** It just was not turned into a gate, and it was not used to ask the follow-up question.

Here is the follow-up question, answered. Contrast of `--ink-800` `#2c2015` against the **worst-case** card ground, as alpha moves:

| Card alpha | Worst ground (darkest photo pixel) | Ground swing across the whole photo | `--ink-800` worst-case ratio |
| --- | --- | --- | --- |
| 0.955 (today) | rgb(251.3) | **3.7 / 255** | 15.36:1 |
| 0.94 | rgb(250.1) | 4.9 | 15.20:1 |
| 0.90 | rgb(246.8) | 8.2 | 14.78:1 |
| 0.80 | rgb(238.7) | 16.3 | 13.75:1 |
| 0.72 | rgb(232.2) | 22.8 | 12.96:1 |
| 0.62 | rgb(224.0) | **31.0 / 255** | 12.01:1 |
| 0.40 | rgb(206.0) | 49.0 | 10.08:1 |

*(Computed with the WCAG relative-luminance formula in sRGB. The 15.36:1 row reproduces the figure already recorded in `globals.css`, which calibrates the arithmetic.)*

**Read the table. Going from 0.955 to 0.62 multiplies the card's visible variation by 8.4x and costs body ink 3.35 points of a 15-point ratio, leaving it at 12.01:1, which is nearly three times the AA requirement.**

**The contrast budget is not what has been stopping this.** The photograph is already at 0.32 over a white base, which caps how dark the ground can ever go. That cap is doing all the safety work. The 0.955 is not buying accessibility; it is buying nothing.

What *does* constrain the alpha is small type, thin strokes and non-text elements, exactly as sections 5 and 6 predict. Which is what the ladder is for.

### 7.4 The contrast gate: what is wrong with it, exactly

`scripts/verify_token_contrast.mjs` is better than the brief credits it. It **does** alpha-composite:

```js
const paper   = parse(tokens.get("--paper") ?? "#f7f7f8").rgb;
const cardTok = parse(tokens.get("--card")  ?? "rgba(255,255,255,.955)");
const CARD    = over(cardTok.rgb, paper, cardTok.a);
// ...
const r = ratio(over(rgb, CARD, a), CARD);
```

It resolves the card's alpha, and it resolves each text token's alpha. Two defects, one of them severe.

**Defect one, and it is the severe one: `over()` rounds, and the rounding erases the composite.**

```js
const over = (s, d, a) => s.map((c, i) => Math.round(a * c + (1 - a) * d[i]));
```

With `--card: rgba(255,255,255,.955)` and `--paper: #f7f7f8`:

- red: `255 * 0.955 + 247 * 0.045 = 243.525 + 11.115 = 254.64` → `Math.round` → **255**
- green: same → **255**
- blue: `243.525 + 248 * 0.045 = 254.685` → **255**

**`CARD` is exactly `[255, 255, 255]`.** The gate composites the card and then rounds the result back to pure white, so every ratio it reports is a ratio against pure white. The founder's description, "it validates a surface that never renders", is literally true in the code. Compare `verify/contrast.js` in rampstackco/glassmorphism-theme, whose `over()` deliberately returns floats and only rounds at the point of display.

**Defect two: the card's backdrop is assumed to be the flat `--paper` token, not the photograph.** The real worst-case backdrop is `rgb(173)` (globals.css already computed it), not `#f7f7f8`. At 0.955 that difference is small. **At 0.62 it is the whole gate.**

**What the gate should become.** Four changes, in order of importance:

1. **Stop rounding inside `over()`.** One-line fix, and it makes every existing number correct rather than nominal.
2. **Replace the flat `--paper` backdrop with a computed worst-case ground.** Extract, at build time, the darkest and lightest pixel of `/spine/_skyline.jpeg`; composite each through the photograph's `opacity` and `filter`, then through the card's alpha; measure every token against **both** extremes and fail on the worse one. The bound survives the blur, per the theorem in 4.4.3, so the blur radius never enters the calculation.
3. **Measure per tier, not per card.** Once there is a ladder, every token has three or four ratios, not one. Fail on the worst tier the token is permitted to appear on.
4. **Gate the non-text tokens too, and gate the small-type rule.** The gate already reports `--n3`, `--n4`, `--n5` under 3:1 without failing, and it is right to hold that line for a ratified drawing. But it does not check that anything below 14px sits on a fill at or above an alpha floor, which is the failure mode glass introduces.

Also add, because it is currently absent from the entire codebase: **there is no `prefers-reduced-transparency` and no `prefers-contrast` rule anywhere in `src/`.** Grepped; zero hits.

### 7.5 The proposed ladder, with our numbers

Derived from the table in 7.3 and the rules in section 5. **Four levels, one of which is opaque, plus a floor.**

```css
:root {
  /* THE GROUND is the photograph at 0.32 over white. It is not a surface and
     nothing sits directly on it. Its bounds are computed from the image file:
     darkest pixel rgb(1,2,0) composites to rgb(173), lightest to rgb(255). */

  /* L1  OPEN GLASS. Sparse editorial cards: the hero, a quote, a section
         intro. Nothing below 16px lives here. Maximum breathing.       */
  --surface-open:  rgba(255, 255, 255, 0.62);
  --blur-open:     blur(14px) saturate(1.10);

  /* L2  WORKING GLASS. The default card. Figures, prose, most of the page. */
  --surface-card:  rgba(255, 255, 255, 0.80);
  --blur-card:     blur(20px) saturate(1.15);

  /* L3  THE PLATE. The stabilized inner layer that carries tables, the
         headline figure, and anything below 14px. NO backdrop-filter of its
         own: one filter per stack. This is Microsoft's content layer.  */
  --surface-plate: rgba(255, 255, 255, 0.94);

  /* L4  CHROME. Masthead, popovers, anything whose backdrop is CONTENT
         rather than the photograph. Opaque, because that backdrop is not
         bounded by the picture: it contains ink.                        */
  --surface-chrome: #ffffff;

  /* THE FLOOR. Any fill carrying text below 14px takes at least this alpha,
     whatever tier it sits on. Nothing else takes it. */
  --alpha-floor: 0.90;

  /* EDGES. Drawn, because a glass fill cannot carry its own boundary. */
  --edge-hairline: rgba(255, 255, 255, 0.34);
  --edge-boundary: rgba(20, 16, 12, 0.10);
  --highlight:     rgba(255, 255, 255, 0.72);
}
```

**Why alpha and blur rise together here even though a higher alpha means less shows through:** they still rise together, because higher alpha means *nearer*, and a nearer pane both occludes more and defocuses more. L1 is the most recessed surface and the least occluding; L3 is the nearest and effectively opaque. That preserves rampstack's rule in a light theme.

**Which surface gets which step, as a rule rather than a taste call:**

> **Transparency varies with content density, not with decoration.** A card with three sentences and no figures takes L1. A card with a table takes L2 with an L3 plate under the table. Nothing whose backdrop is text takes any glass at all.

That is the "moving level of transparency" the founder asked for, and it means something a reader can feel: **the page opens up where there is nothing to protect and closes down where the numbers are.** It is also self-enforcing, because the gate can check it.

**Verify against the table in 7.3:** at L1 (0.62) the worst ground is rgb(224.0) and body ink is 12.01:1. At L2 (0.80) it is rgb(238.7) and 13.75:1. Both are far above AA, and both are above AAA. The binding constraints will be the small labels and the neutral fills, which is exactly what the floor and the plate exist for.

### 7.6 The terracotta problem, which is not obvious

`saturate()` in a `backdrop-filter` operates on **the photograph's pixels**, not on our tokens. `saturate(1.15)` on a warm skyline pushes whatever hue is in that picture, and a skyline at golden hour contains amber. **The palette ban is a ban on rendered colour, not just on token values, and a saturate on the backdrop is a way to reintroduce banned hues through the glass without any token ever changing.**

Three consequences:

1. The photograph's `filter: saturate(0.85) contrast(1.02)` on the ground layer is pulling saturation **down**, and the card's `saturate(1.15)` is pushing it **back up**. Those two are fighting, and the net is close to neutral, which means the card's `saturate` is mostly buying nothing while costing a filter operation. Consider dropping it and letting the ground layer own saturation.
2. If you keep a saturate on the backdrop, sample the result: composite the photo's most saturated region through the filter chain at each tier and check the resulting hues against the palette. This belongs in the gate.
3. rampstack's reason for raising saturation applies to a dark ground with coloured light sources ("keeps a blurred orb reading as colored light rather than as haze"). Over a desaturated skyline at 32% on white, there is very little chroma left to rescue. **The argument for `saturate()` does not transfer to our ground.**

### 7.7 Performance budget for our routes

- **The single biggest available win is a pre-blurred image.** The background is `position: fixed`; it does not scroll. Blur it once at build time, in the same treatment chain, and place the blurred copy as a second fixed layer. Cards then need **no runtime `backdrop-filter` at all**; they become a translucent fill over a pre-blurred ground, which is Microsoft's Mica strategy exactly ("samples the desktop wallpaper only once"). The one thing you lose is that the blur will not vary with card position, which over a **fixed** ground it barely does anyway. **This should be prototyped before any per-card filter work.**
- **If you keep runtime filters: one per stack.** Remove `backdrop-filter` from `.panel` (`atlas-spine.css:193`). It is inert in Chromium and doing something unintended in Firefox and Safari.
- **Cap blur at 16 to 20px.** 26px is above the point where any source claims a perceptual gain, and it is the most expensive number in the file.
- **Do not add `will-change`.** Section 3.4. It is at best neutral and at worst it creates a Backdrop Root.
- **Do not add `contain: paint`.** No source supports it here.
- **Keep the masthead opaque.** Already done and already reasoned in `globals.css`.
- **Expect edge shimmer on scroll** from the `edgeMode="duplicate"` artifact, over a photograph with hard tonal boundaries. If it shows, Comeau's oversized-plus-masked backdrop is the fix.
- **Consider dropping glass entirely under `(hover: none) and (pointer: coarse)`**, which is also where the global frame already collapses the photograph to a flat wash below 1100px.

### 7.8 Two grounds, one decision needed

The repository has **two different backgrounds** and they produce two different materials:

- **AtlasFrame path:** full-bleed photograph at 0.32 over white, no veil. Cards over this refract the picture. This is what the brief describes.
- **Global frame path (`globals.css`):** photograph at 0.5 inside `.atlas-frame-gutters`, with `::after` painting an **opaque cream veil across the centre column**. Cards in the data column refract flat cream. **A backdrop-filter here has nothing to refract**, which is the same defect the masthead comment already identified and fixed for the header.

A glass language cannot be specified until it is decided which ground it sits on. If the veil stays opaque across the column, the whole ladder is decorative and the honest move is to drop `backdrop-filter` from every card in that path. If the veil becomes translucent over the column, the numbers in 7.3 need recomputing for `opacity: 0.5` rather than 0.32, and the worst-case ground gets darker (`0.5 * 1 + 0.5 * 255 = 128` rather than 173), which shifts every row of the table.

**This is the first thing to settle. Everything else is downstream of it.**

### 7.9 What to keep from the two-layer anatomy, since we are not doing Liquid Glass

The four edge cues, mapped to our tokens and to what each is actually for:

| Cue | Implementation | Job |
| --- | --- | --- |
| Thin border breaking the edge | `border: 1px solid var(--edge-hairline)` plus `background-clip: padding-box` | separates the pane from the ground; must clear 3:1 against the darkest ground it can sit on if it is the only boundary |
| Controlled highlight band | `::before` with a three-stop `linear-gradient(180deg, ...)` | states one light source, from above |
| Optional inner stroke | `inset 0 0 0 1px rgba(255,255,255,0.10)` | implies pane thickness; the only inset allowed on all four sides |
| Subtle shadow | `0 1px 2px` contact plus `0 12px 32px -8px` area light | "puts air between a panel and the ground; without it a frosted surface reads as a hole cut in the page" |

Plus the inner **stabilized plate**, which is not an edge cue but is the accessibility mechanism (6.5), and which must not carry its own `backdrop-filter` (2.5).

And the single correction to what is shipped today: **one catch-light, on the top edge, and delete the other four insets.**

---

## 8. What this research cannot establish

Stated plainly, as required.

1. **Every published CSS glass demo read here is built over a controlled ground.** Smarative's is a gradient. rampstack's is a base colour plus three orbs at a known alpha, and their entire contrast method depends on that ground being *computable*. Comeau's is a gradient. Not one of them is over an uncontrolled photograph. A photograph has hard tonal boundaries, arbitrary hue, and a luminance histogram nobody chose. **The edge artifact in 1.6 and the hue leakage in 7.6 are both photograph-specific and neither appears in any demo.** The bound in 4.4.3 does transfer, because it is arithmetic, but the *look* does not.

2. **Performance numbers from a demo page do not transfer to a route with many cards.** The only measured number in this document is "around 3ms GPU time on a relatively low-end AMD GPU" from a Firefox bug in 2022, on an unnamed test case, on a browser build four years old. The 15 to 25 fps claim is single-source with no methodology and no named device. **I found no published benchmark of N backdrop-filtered cards over a fixed background image on named hardware.** Our real number has to be measured on our routes, on our devices, with a profiler. Nothing here substitutes for that.

3. **Apple publishes no numbers, and I could not read Apple's pages at all.** Three separate Apple URLs returned title-only responses, a 500, and a 404. Everything attributed to Apple in section 5 is secondhand from search summaries. The five material levels and the vibrancy cross-product rule are consistent across multiple summaries and I believe them; **any specific alpha or blur value attributed to an Apple material anywhere on the web is someone's reverse-engineering, not documentation.**

4. **The `-webkit-backdrop-filter` custom-property claim is unresolved.** Two blog sources assert it; one shipped design system contradicts it in production code. No bug number, no version range, no test case. Section 2.2 gives a zero-cost hedge rather than an answer.

5. **`contain: paint` is unproven in this context, in both directions.** I found no source saying it helps and none saying it hurts. Absence of evidence.

6. **Whether the noise should sit above or below the cards is a taste question this research cannot settle.** It can only establish what each choice renders (7.2). Section 6's font verdicts likewise rest on legibility research plus three design systems agreeing; they are strong recommendations, not measurements of *our* faces at *our* sizes over *our* photograph. The Fraunces confinement in particular should be checked by rendering it, at 13px and at 40px, on an L1 card, over the darkest region of the skyline.

7. **The contrast figures in 7.3 are computed for the AtlasFrame path only** (white base, photo at 0.32, `saturate(0.85) contrast(1.02)`), and they treat the photograph's `filter` as not moving the extremes, which is approximately but not exactly true: `contrast(1.02)` pushes both extremes slightly outward. The effect is under half a level at these alphas and does not change any verdict, but the gate should apply the filter chain properly rather than inherit this approximation. They do **not** apply to the global-frame path (7.8), which has a different photo opacity and an opaque veil.

8. **P3 displays are not modelled.** Filter Effects 2 requires filters to operate in sRGB, and our arithmetic is sRGB, but Radix documents that alpha blending behaves differently in P3. The rendered result on a wide-gamut display may not match the computed one. Nobody read here has quantified the delta.

---

## Sources

- MDN Web Docs, `backdrop-filter`. https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- MDN Web Docs, `prefers-reduced-transparency`. https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency
- W3C CSS Working Group, Filter Effects Module Level 2. https://drafts.csswg.org/filter-effects-2/
- W3C CSS Working Group, Compositing and Blending Level 1. https://drafts.csswg.org/compositing-1/
- W3C WAI, Technique G18. https://www.w3.org/WAI/WCAG22/Techniques/general/G18
- W3C WAI, Understanding Success Criterion 1.4.3 Contrast (Minimum). https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Can I Use, `css-backdrop-filter`. https://caniuse.com/css-backdrop-filter
- Can I Use, `prefers-reduced-transparency`. https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency
- Chrome for Developers, "CSS prefers-reduced-transparency". https://developer.chrome.com/blog/css-prefers-reduced-transparency
- Microsoft Learn, "Acrylic material". https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic
- Microsoft Learn, "Mica material". https://learn.microsoft.com/en-us/windows/apps/design/style/mica
- Fluent 2 Design System, "Material". https://fluent2.microsoft.design/material
- Josh W. Comeau, "Next-level frosted glass with backdrop-filter". https://www.joshwcomeau.com/css/backdrop-filter/
- Smarative, "Realistic Frosted Glassmorphism in CSS With Gradient Borders". https://smarative.com/blog/realistic-frosted-glassmorphism-css-gradient-borders
- rampstackco, glassmorphism-theme. https://github.com/rampstackco/glassmorphism-theme (files read: `tokens/tokens.css`, `components/components.css`, `verify/contrast.js`, README)
- Mozilla Bugzilla 1718471, "backdrop-filter: blur is laggy when many elements are rendered". https://bugzilla.mozilla.org/show_bug.cgi?id=1718471
- Mozilla Bugzilla 1736914, "Implement prefers-reduced-transparency media query". https://bugzilla.mozilla.org/show_bug.cgi?id=1736914
- WebKit Bugzilla 176830, "Combining mix-blend-mode and -webkit-backdrop-filter leads to unexpected results". https://bugs.webkit.org/show_bug.cgi?id=176830
- w3c/fxtf-drafts issue 374, "Backdrop filter clipping with edgeMode='duplicate'". https://github.com/w3c/fxtf-drafts/issues/374
- w3c/fxtf-drafts issue 408, "backdrop-filter is way less useful because it requires children to not escape the backdrop rectangle". https://github.com/w3c/fxtf-drafts/issues/408
- mfreed7, backdrop-filter-feature explainer. https://github.com/mfreed7/backdrop-filter-feature
- Markus Stange, public-fxtf archive, April 2018. https://lists.w3.org/Archives/Public/public-fxtf-archive/2018Apr/0095.html
- Havn, "Chromium and Nested Backdrop-Filters". https://havn.blog/2024/03/14/chromium-and-nested.html
- ThisDevTool, "Backdrop-Filter Not Working in Safari? 5 Real Fixes". https://thisdevtool.com/blog/backdrop-filter-not-working-safari-fix
- COSESAI / flowrust, "Glass, But the Browser Doesn't Speak It: The Six-Layer Backdrop-Filter Stack That Survives Safari". https://blog.flowrust.com/2026/07/15/backdrop-filter-stack-glassmorphism-survives-safari/
- W3Tweaks, "CSS filter and backdrop-filter: The Complete Visual Guide". https://www.w3tweaks.com/css/css-filter-backdrop-filter/
- Axess Lab, "Glassmorphism Meets Accessibility: Can Frosted Glass Be Inclusive?". https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive/
- Smashing Magazine, "Designing Accessible Text Over Images (Part 1)". https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/
- WebAIM, "Evaluating Contrast with Chrome DevTools". https://webaim.org/articles/contrast/devtools
- Myndex, SAPC-APCA. https://github.com/Myndex/SAPC-APCA and https://apcacontrast.com/
- WebKit blog, "News from WWDC26: WebKit in Safari 27 beta". https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/

### Cited but UNREAD (see section 0)

- Apple Human Interface Guidelines, Materials. https://developer.apple.com/design/human-interface-guidelines/materials
- Apple Developer Documentation, `Material`. https://developer.apple.com/documentation/swiftui/material
- Chromium issue 40666159. https://issues.chromium.org/issues/40666159
- Chromium issue 40794542. https://issues.chromium.org/issues/40794542
- "The effect of serifs and stroke contrast on low vision reading", PubMed 36563495. https://pubmed.ncbi.nlm.nih.gov/36563495/
- Radix Colors alpha scale documentation. https://www.radix-ui.com/colors
