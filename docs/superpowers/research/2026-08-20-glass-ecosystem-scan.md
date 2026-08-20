# Frosted glass: ecosystem scan

Date: 2026-08-20
Scope: what exists on GitHub and the wider web that is worth borrowing to build a frosted-glass design language for marginatlas.com.
Constraint set this was judged against: Next.js 15.5 App Router, React 19.2, TypeScript 5, Tailwind 3.4, Vercel, server-rendered and largely static, tokens only, terracotta plus cool neutrals with one accent, a fixed full-screen photograph behind every page, dense financial figures that must stay readable, frosted glass but NOT Apple Liquid Glass and NOT high transparency.

Nothing was installed. No site code was changed. Metadata came from the GitHub REST API and the npm registry on 2026-08-20; production CSS was read by fetching the shipped stylesheets of the named products directly.

---

## 0. The one-paragraph landscape

There are two completely different things sharing the word "glass" in 2026, and the popular half is the half we do not want. The high-star repos (5.9k, 2.4k, 1.1k) are all **Apple Liquid Glass clones**: SVG displacement maps, WebGL shaders, chromatic aberration, specular highlights, refraction of live DOM. They are client-side by construction, they animate, and they are the explicit non-goal. The thing we actually want, **frosted glass as a material in a token system**, has almost no repo presence at all: the serious implementations are 12 to 99 stars, and the two best references are not repos but the shipped stylesheets of Apple's own marketing site and Linear. A GitHub search for a Tailwind glass plugin returns literally nothing with traction. That is the finding, not a gap in the search: this is a ten-lines-of-CSS problem that the ecosystem has correctly declined to package.

---

## 1. Repos that implement glass

### 1a. The Liquid Glass wave (the explicit non-goal, listed so it is not re-discovered later)

| Repo | Stars | Last push | Licence | What it actually is |
|---|---|---|---|---|
| [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react) | 5,946 | 2025-06-13 | MIT | React component, SVG displacement refraction. **Unmaintained for 14 months, 24 open issues.** |
| [AndrewPrifer/liquid-dom](https://github.com/AndrewPrifer/liquid-dom) | 2,449 | 2026-06-16 | **none** | Refracts live DOM. No licence file, so legally unusable. |
| [shuding/liquid-glass](https://github.com/shuding/liquid-glass) | 1,128 | 2026-03-26 | MIT | Copy-paste SVG shader. A single effect, not a system. |
| [naughtyduk/liquidGL](https://github.com/naughtyduk/liquidGL) | 832 | 2026-08-01 | **none** | WebGL. Active, unlicensed. |
| [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | 694 | 2025-06-12 | MIT | Canvas/JS. Stale. |
| [iyinchao/liquid-glass-studio](https://github.com/iyinchao/liquid-glass-studio) | 605 | 2026-08-19 | MIT | WebGL2/WebGPU playground. |
| [samasante/liquid-glass](https://github.com/samasante/liquid-glass) | 482 | 2026-06-23 | MIT | Headless React "lens". |
| [ybouane/liquidglass](https://github.com/ybouane/liquidglass) | 397 | 2026-04-10 | **none** | WebGL refraction. |
| [huozhi/vaso](https://github.com/huozhi/vaso) | 341 | 2025-12-28 | **none** | React liquid glass. |
| [creativoma/liquid-glass](https://github.com/creativoma/liquid-glass) | 13 | 2026-08-01 | MIT | Tailwind + SVG filters. |

**Verdict on the whole category: IGNORE.** Every one of them is a client component with runtime JS or a WebGL context, which is wrong for a server-rendered static site; every one of them is the aesthetic the founder explicitly ruled out; four of the most popular have no licence at all; and the single most popular has been abandoned since June 2025. Star count here measures a June-2025 news cycle, not durability.

### 1b. Component sets that are actually frosted glass

| Repo | Stars | Last push | Licence | What you get | Verdict |
|---|---|---|---|---|---|
| [glincker/glinui](https://github.com/glincker/glinui) | 30 | 2026-02-20 | MIT | Real monorepo with a `packages/tokens` layer, a documented glass token architecture, 77 components on Radix + **Tailwind 3.4 + React 19 + Next 15**, exactly our stack | **BORROW THE IDEA** (the token shape, not the values, see below) |
| [itsjavi/glasscn-ui](https://github.com/itsjavi/glasscn-ui) | 99 | **2024-11-25** | MIT | shadcn fork with glass variants, Vite + Storybook, Tailwind preset | **IGNORE.** 21 months stale, predates React 19 |
| [kostyniuk/glasscn-components](https://github.com/kostyniuk/glasscn-components) | 71 | 2026-08-09 | MIT | 19 glass components as a **shadcn registry** (`npx shadcn add @glasscn/...`), built on Base UI, Next 16, React 19 | **IGNORE for adoption, worth 20 minutes of reading.** Base UI not Radix, Next 16 not 15, and it is a copy-paste registry so there is no upgrade path anyway |
| [themesberg/glass-ui](https://github.com/themesberg/glass-ui) | 407 | 2026-02-27 | **none** | CSS UI library | **IGNORE.** No licence. Highest-starred "system" in the category and it cannot legally be used |
| [TheOrcDev/glasscn-ui](https://github.com/TheOrcDev/glasscn-ui) | 12 | 2025-06-16 | MIT | Small glass shadcn set | IGNORE |
| [Jaishree2310/GlassyUI-Components](https://github.com/Jaishree2310/GlassyUI-Components) | 112 | 2026-06-10 | **none** | Hacktoberfest project, **274 open issues** | IGNORE |
| [remiangelo/reactGlass](https://github.com/remiangelo/reactGlass) | 12 | 2025-07-31 | MIT | Capability-detecting React glass | IGNORE, demo |
| [Mael-667/Liquid-Glass-CSS](https://github.com/Mael-667/Liquid-Glass-CSS) | 10 | 2025-12-25 | **GPL-3.0** | CSS/JS library | IGNORE. GPL is a licence hazard for a commercial product |
| [miketromba/css.glass](https://github.com/miketromba/css.glass) | 450 | 2025-09-15 | **none** | The css.glass generator (Vue app) | IGNORE as code, the **output** is a fine starting snippet |

**Be sceptical, as instructed: which of these are demos?** All of them except glinui and glasscn-components. `themesberg/glass-ui`, `css.glass` and `GlassyUI-Components` carry the stars in this group and are, respectively, an unlicensed CSS file, a generator app, and a Hacktoberfest components dump with 274 open issues. The two that are genuinely systems (a tokens package, a registry) have 30 and 71 stars. **In this category star count is inversely correlated with usefulness**, because the stars track "pretty demo page" and the systems have nothing to screenshot.

### 1c. The one repo actually worth reading: glinui's token file

`packages/tokens/src/theme.css` in [glincker/glinui](https://github.com/glincker/glinui) separates glass into **four independent axes**, which is the right decomposition and the thing to steal:

```
--glass-blur-sm: 8px;  --glass-blur-md: 16px;  --glass-blur-lg: 24px;  --glass-blur-xl: 40px;
--glass-saturate-base: 180%;      --glass-saturate-subtle-base: 130%;
--glass-border-alpha: 0.20;       --glass-border-strong-alpha: 0.35;
--glass-opacity-1..10: 0.06 ... 0.35;
```

**Take the shape, reject the numbers.** Its surface-alpha ladder tops out at **0.35**, which is built for a dark hero gradient and would destroy a page of financial figures over a photograph (see the measured table in section 3). Its own header comment claims "4.5:1 contrast ratio for text on glass (WCAG AA)", which is not achievable at 0.35 over an arbitrary photo, so the claim is aspirational rather than measured.

Also note a trap inside its own token set: it ships `--glass-gpu-will-change: transform, opacity`. Per the spec (section 5), `will-change` on those properties **creates a Backdrop Root**, which cuts off what a nested `backdrop-filter` can see. Their performance hint can silently disable their own effect.

---

## 2. Tailwind specifics

### How people express a translucency ladder in Tailwind, in practice

Four patterns exist. Ranked for this project:

1. **Semantic CSS variables in `<alpha-value>` form, plus the opacity modifier.** This repo already does exactly this: `tailwind.config.ts` lines 114-146 define `card: "rgb(var(--card) / <alpha-value>)"` and friends, so `bg-card/88` compiles today with zero new code. **This is the ladder mechanism. It is already installed.** The `<alpha-value>` channel-triplet form is required only for CSS-variable colours; hex ramp colours (`paper`, `ink`, `atlas`) already accept `/88` natively because Tailwind converts them at build time. Both halves of the palette work.
2. **Named theme keys** (`backdropBlur: { glass: '20px' }` in `theme.extend`) so the blur ladder is a token rather than an arbitrary value. Four lines of config, no dependency.
3. **Named `boxShadow` keys for the layered border.** This repo already has `elevation.subtle/card/lift/modal` wired into `theme.extend.boxShadow`. Layered glass borders (outer hairline + inset top light + inset bottom light) are just more entries in that same object. **Tailwind 3.4 has no `inset-ring` utility (that is Tailwind 4), so the inset light must be a named `boxShadow` token, not a ring utility.** This is the single Tailwind-version-specific gotcha.
4. **Arbitrary values** (`backdrop-blur-[26px]`, `shadow-[inset_0_1px_0_rgb(255_255_255/0.7)]`). Works, and is what most tutorials show, but it is raw values in components, which this project bans.

### Is there a Tailwind plugin worth a dependency?

**No, and the search result is itself the evidence.** `gh search repos "tailwind glass plugin"` returns an empty array. `gh search repos "tailwindcss glassmorphism"` returns six repos whose star counts are 22, 2, 0, 0, 0, 0. The only real npm package is:

- **[@casoon/tailwindcss-glass](https://www.npmjs.com/package/@casoon/tailwindcss-glass)**, v0.9.7, MIT, last published 2025-09-20. Source repo: the package's declared homepage `github.com/casoon/tailwindcss-effects` **returns 404**; the actual repo appears to be `casoon/casoon-tailwind-effects` with **0 stars**, licence `NOASSERTION`, last push 2025-09-20. Its own description says "for Tailwind CSS **v4**". **IGNORE.** Pre-1.0, Tailwind 4 only, zero stars, a dead homepage link and an unresolved licence, to replace roughly ten lines of CSS.
- `tailwindcss-filters` is frequently cited in tutorials and is obsolete: `backdrop-blur`, `backdrop-saturate` and the rest have been first-party since Tailwind 2.1.

**Ten lines of our own beats it, decisively.** The whole plugin surface is: a blur scale, a saturate value, a surface-alpha scale, a border-alpha scale, and two box-shadow tokens. That is `theme.extend` config, not a dependency. A plugin would also generate hundreds of unused utility permutations and add a build-time dependency with a broken homepage to a project whose entire palette discipline depends on knowing exactly which classes exist. Recall the note already written into `tailwind.config.ts` about deleted ramps still emitting live rules: **adding a utility-generating plugin to this codebase directly re-opens the failure mode that config file was rewritten to close.**

---

## 3. The contrast problem, and the tooling

### Who has solved this: nobody, and there is a spec-level reason

This is the most important negative result in the scan.

- **axe-core does alpha compositing but refuses images.** Its `flattenColors` implements Porter-Duff "over" and it will correctly composite a translucent card down a stack of solid colours. But `lib/checks/color/color-contrast.json` enumerates the ways it gives up, and two of them are ours verbatim: `bgImage`: "Element's background color could not be determined due to a background image", and `bgGradient`: for a gradient. There is no `backdrop-filter` case at all, meaning the filter is simply not modelled. Over a fixed photograph, **axe returns `incomplete`, not a number**. ([axe-core](https://github.com/dequelabs/axe-core), 5.6k+ stars, actively maintained, MPL-2.0.)
- **Lighthouse wraps axe**, so it inherits the same `incomplete` and reports nothing.
- **Chrome DevTools** composites alpha down the element stack for its contrast readout and likewise cannot resolve a photographic backdrop.
- **The W3C has not decided what the correct method even is.** [w3c/wcag issue #3761](https://github.com/w3c/wcag/issues/3761), open since 2024-03-26, is titled "Contrast understanding docs (1.4.3, 1.4.6, 1.4.11) need guidance on when to use pixel-picking". It sets out the two camps, "as-specified" (read the CSS) and "as-rendered" (pixel-pick), and documents that as-rendered has poor inter-tester reliability because of subpixel rendering, zoom, DPI and per-OS text rendering changes. **There is no standard answer, so there is no conforming tool.** Any tool we build is a house rule, and should be labelled as one.
- **GitHub searches for a Playwright pixel-sampling contrast tool return empty.** The nearest thing found in the whole scan is [pixelslop](https://github.com/topics/design-quality), a "browser-first design quality scanner, opens real pages in Playwright, measures actual pixels", at **7 stars**. IGNORE as a dependency; it is confirmation that the niche is empty.

### The colour-science packages, judged

| Package | Version | Licence | Last publish | What it gives us | Verdict |
|---|---|---|---|---|---|
| [culori](https://culorijs.org/) | 4.0.2 | MIT | 2026-04-03 | `blend(colors, 'normal')` for compositing, `wcagLuminance()`, `wcagContrast()`, `average()`. Tree-shakeable, zero deps | **ADOPT** as a devDependency for the gate script. It is the only one with compositing and WCAG in one small package, and it is actively maintained |
| [colorjs.io](https://colorjs.io) | 0.7.1 | MIT | 2026-07-24 | Rigorous, colour-space aware, `contrast()` with multiple algorithms including APCA | BORROW THE IDEA. Correct but heavier and still 0.x; use only if we later want APCA |
| [chroma-js](https://github.com/gka/chroma.js) | 3.2.0 | BSD-3 + Apache-2.0 | 2025-11-28 | Conversions, `chroma.contrast()`. **No alpha compositing helper** | IGNORE. We would write the composite ourselves anyway, so it adds nothing over culori |
| [apca-w3](https://github.com/Myndex/apca-w3) | 0.1.9 | **"Limited W3 License"** | **2022-07-04** | APCA Lc values | IGNORE. Four years unpublished, and a bespoke non-OSI licence is not worth the argument |
| [wcag-contrast](https://github.com/tmcw/wcag-contrast) | 3.0.0 | BSD-2 | 2022-06-28 | Two functions | IGNORE, culori covers it |
| [color-contrast-checker](https://github.com/Qambar/color-contrast-checker) | 2.1.0 | Apache-2.0 | 2022-06-13 | WCAG checks | IGNORE, stale |
| [@adobe/leonardo-contrast-colors](https://github.com/adobe/leonardo) | 1.1.0 | Apache-2.0 | 2026-07-08 | Generates colours **to hit a target contrast ratio** | BORROW THE IDEA. Not for runtime; the inverted framing (choose the ratio, derive the colour) is the right way to pick the surface alpha |

### The recipe that actually works, and it avoids the compositing maths entirely

The obvious approach is: screenshot the page, sample the backdrop pixel, composite the card fill over it in culori, compute contrast. That works, but it re-implements what the browser already did, badly (it cannot model the blur kernel, the saturate, or the border).

**The better recipe: let the browser composite, then measure.** Two passes in Playwright:

1. Navigate. Inject a stylesheet that makes text invisible without changing layout or the glass stack: `* { color: transparent !important; text-shadow: none !important; }`. Do **not** use `visibility` or `display`, which would change what is painted behind.
2. `page.screenshot()`. For each text node of interest, take its `boundingBox()` and read every pixel inside it from the PNG. Those pixels are **the true rendered surface behind the glyphs**: photograph, blur, saturate, tint, grain and border, already composited by the real rendering engine.
3. Compute `wcagContrast(textToken, pixel)` with culori for every sampled pixel and report the **minimum**, not the mean. One dark cloud behind one label is the failure.
4. Gate on the worst pixel per text node, run it at the two or three viewport widths that change the photograph's crop, and store the numbers.

This is roughly 40 lines. It needs `playwright` (already in this repo's toolchain), `pngjs` or `sharp` to read pixels, and `culori`. It sidesteps the entire "as-specified vs as-rendered" argument by being explicitly as-rendered and saying so, and it is the only method that can see a `backdrop-filter` at all.

### The numbers, computed against this project's real tokens

White fill at alpha `a` composited over a backdrop pixel, WCAG 2 contrast against the four text tokens actually in `atlas-spine.css`. Bold = fails 4.5:1.

| alpha | backdrop | ink `#0d0d0e` | ink-2 `#4a4a4d` | muted `#5f5f67` | atlas-700 `#991600` |
|---|---|---|---|---|---|
| 0.55 | pure black (worst case) | 5.80 | **2.63** | **1.89** | **2.54** |
| 0.65 | pure black | 7.96 | **3.62** | **2.59** | **3.48** |
| 0.72 | pure black | 9.75 | **4.43** | **3.18** | **4.27** |
| **0.80** | pure black | 12.10 | 5.50 | **3.94** | 5.30 |
| 0.85 | pure black | 13.73 | 6.24 | **4.47** | 6.01 |
| **0.88** | pure black | 14.77 | 6.72 | 4.81 | 6.47 |
| 0.92 | pure black | 16.24 | 7.38 | 5.29 | 7.11 |
| 0.955 (current `--card`) | pure black | 17.59 | 8.00 | 5.73 | 7.70 |
| 0.80 | mid photo pixel `#7a7a80` | 15.35 | 6.98 | 5.00 | 6.72 |

Four things fall straight out of this and they are the practical answer to "how transparent can we go":

1. **`--muted` is the binding constraint, not `--ink`.** Headlines survive down to 0.55. The 10.5px uppercase label ramp is what breaks first, and it breaks at exactly the alpha the whole industry uses.
2. **0.80, the number Apple and Linear both ship, fails for this site's label token** over a dark photo region (3.94). It passes for body and for the accent. Their 0.80 is safe because their glass carries nav links in near-black, not grey micro-labels.
3. **0.88 is the floor** for any surface that carries muted-tone text over an arbitrary photograph. 0.92 is the comfortable floor.
4. **The current `--card: rgba(255,255,255,.955)` is not "high transparency" by any reading; it lets through 4.5% of the backdrop.** Which means the `blur(26px)` on `.glass` is being paid for in GPU to modulate 4.5% of the pixel. The glass in this site currently reads from its border and its seven inset highlights, not from its blur. That is worth knowing before tuning anything.

The design lever this exposes: **the ladder is not one number, it is a pairing of surface alpha with which text tokens are permitted on it.** A 0.80 rung is legitimate if muted labels are forbidden on it.

---

## 4. Noise and grain

### What this repo already does, and it is the good technique

`src/styles/atlas-spine.css:150` runs `feTurbulence` **once**, inside a 160x160 SVG data URI, rasterised to a tile, then repeated as a `background-image` on a fixed pseudo-element at `opacity:.5; mix-blend-mode:multiply; z-index:1`. That is the correct pattern already: the expensive Perlin generation happens once at 160x160, not as a live filter over a full-screen surface. `numOctaves` is 2, which is right (the consensus is that above 3 or 4 the visual gain does not justify the cost).

### The three options, compared

| Technique | Cost | Quality | Notes |
|---|---|---|---|
| `feTurbulence` in an inline SVG data URI, tiled (current) | One-time raster of a small tile, then a cheap repeat. ~400 bytes of CSS | Best. Fully parametric: `baseFrequency` controls grain size, `type` controls character | Firefox and Chrome differ slightly in turbulence output; not identical across engines |
| `feTurbulence` as a **live** `filter: url(#noise)` over a large element | Expensive and repeated. "Very heavy" is the consistent report; more than four chained primitives collapses on mobile | Same | **Avoid.** This is the version people benchmark and condemn |
| Tiled PNG | Cheapest to render; an extra HTTP request or a large base64 blob. A useful texture PNG is tens of KB versus ~300 bytes of SVG | Identical across engines, which is its one real advantage | Only worth it if cross-engine identity matters more than bytes |
| CSS gradients | Free | Cannot make convincing grain. Banding, not noise | Not a real option |

**Verdict: keep what exists. ADOPT nothing new.**

### How grain interacts with backdrop-filter, and this is the part that bites

Three separate mechanisms, all spec-grounded:

1. **A grain layer behind the glass is erased by the glass.** `backdrop-filter: blur()` blurs everything behind the element. High-frequency noise is precisely what a 20px blur annihilates. Any grain painted below a glass card is invisible inside that card's footprint.
2. **In this repo the grain is also *under* the cards in paint order.** The noise pseudo-element is `z-index: 1`; `.av2 .wrap` is `z-index: 2`. So every card sits above the grain. Combined with (1), the grain is absent from every glass surface twice over. If the intent is textured glass, the grain has to move: either **above everything** (a fixed overlay at the top of the stack) or **inside the card**, as a layer of the card's own background painted above its backdrop-filter.
3. **`mix-blend-mode: multiply` over text costs contrast.** A multiply grain painted above the cards will also multiply over the figures. The measured contrast table above assumes a clean surface. Whatever the grain does to the surface must be re-measured, which the Playwright recipe in section 3 does for free because it samples the final composited pixel.

### The layering gotcha to know before writing any of it

The Filter Effects Level 2 spec is explicit: a `backdrop-filter` value other than `none` "results in the creation of both a stacking context" **and** "a Containing Block for absolute and fixed position descendants". And the Backdrop Root is formed by any element with `filter`, `opacity < 1`, `mask`, `clip-path`, `backdrop-filter`, `mix-blend-mode`, **or `will-change` affecting these**; the backdrop image is only what is painted between the nearest ancestor Backdrop Root and the element.

For this site specifically: **if any wrapper between the root and a glass card acquires `opacity`, a `filter`, a `mix-blend-mode`, a `mask` or a `will-change`, the fixed photograph drops out of that card's backdrop and the glass silently turns into a flat translucent panel over nothing.** This is the single most likely way the effect "mysteriously stops working" during a refactor, and it produces no error. Linear guards against the related stacking problem by putting `isolation: isolate` directly on its header element; that is worth copying as a deliberate marker.

The containing-block half matters too: a `position: fixed` child of a glass card resolves against the card, not the viewport.

---

## 5. Prior art in product, measured from shipped CSS

Not opinion pieces. These are the actual values in the stylesheets served on 2026-08-20.

### Apple, apple.com global nav (`globalheader.css`)

```
--globalnav-backdrop-filter: saturate(180%) blur(20px);
--globalnav-background: rgba(250, 250, 252, .8);    /* light, blur available */
--globalnav-background: rgba(250, 250, 252, .92);   /* light, NO blur */
--globalnav-background: rgba(22, 22, 23, .8);       /* dark, blur available */
--globalnav-background: rgba(22, 22, 23, .88);      /* dark, NO blur */
```
gated by `@supports (backdrop-filter: initial)`. `ac-localnav.built.css` repeats the same `saturate(180%) blur(20px)` and the same `rgba(250, 250, 252, 0.8)`.

**Two things to take.** First, `saturate(180%)` is always paired with the blur; blur alone desaturates the backdrop and reads dead, and this is the correction. Second, and better: **there are two alphas per surface, and the no-blur fallback is MORE opaque** (0.80 with blur, 0.92 without). The fallback is not "the same colour minus the blur", it is a different, safer colour. That is the single most borrowable structural idea in the whole scan.

### Linear, linear.app

```
--header-blur: 20px;
--header-bg: #fffc;          /* = rgba(255,255,255,0.80) */
--header-border: #00000014;  /* 8% black hairline, light theme */
--header-border: #ffffff14;  /* 8% white hairline, dark theme */
.TZTsQG_header { isolation: isolate; ... backdrop-filter: blur(var(--header-blur)); }
```
The glass **button** variant applies `backdrop-filter: blur(8px)` only inside `@media (any-hover: hover)` on `:hover`.

**Three things to take.** Blur is a named token, not a literal. The surface is 80% opaque, independently arriving at Apple's number. And glass is used on **chrome only** (header, mobile menu, buttons) and as an **interaction state** on buttons, never at rest on a content surface. Grepping every CSS bundle Linear ships, `backdrop-filter` appears in exactly two files: `Header` and `Button`.

### Nomad List / nomads.com, the closest prior art we have

The only genuinely **dense, data-heavy, photograph-backed** site found. Its `global.css` uses `blur(4px)`, `blur(5px)`, `blur(12px)` (five times) and one `blur(25px)`, and its card surfaces sit at **`rgba(255,255,255,0.85)` and `rgba(255,255,255,0.9)`**, with a single 0.1 for something decorative.

**This is the empirical answer to the founder's question.** A real site with real tables over real photographs independently lands at 0.85 to 0.90, higher than Apple's and Linear's 0.80 chrome, and in the band the contrast table above says is required. The technique survives dense content **only by getting more opaque as the content gets denser.**

### Stripe, stripe.com

`blur(2.5px)`, `blur(5px)`, `blur(12px)`. A small, restrained ladder. Glass is not a primary material.

### Raycast, raycast.com

`blur(2, 4, 10, 15, 16, 20, 24, 60px)` across four bundles. No ladder discipline at all. **Prior art for what not to do**: this is what happens when the blur value is an arbitrary value at each call site rather than a token.

### Vercel, vercel.com

Only Tailwind's own `--tw-backdrop-*` machinery appears. No bespoke glass language, and no `backdrop-filter` in the inline critical CSS. Nothing to borrow.

### Does the technique survive dense content?

Measured answer: **it survives on chrome at 0.80, and on content surfaces only at 0.85 and above.** Every product examined that puts glass near data raises the opacity. Nobody ships translucent data. As one 2026 write-up puts it plainly, translucency behind numbers is visual noise, and dense information needs opaque backgrounds with clear contrast.

---

## 6. What to avoid, from real reports

- **Nielsen Norman Group, "Liquid Glass Is Cracked, and Usability Suffers in iOS 26"** ([nngroup.com](https://www.nngroup.com/articles/liquid-glass/)). A named usability authority documenting concrete failures: content camouflaged against user-chosen background photographs; icons blending into backgrounds in Maps; "text on top of text" in Mail; motion for its own sake. This is the highest-credibility source in the scan and it is about exactly our failure mode, translucent surfaces over photographs the designer did not choose.
- **Apple shipped a retreat.** iOS 26 beta 2 reduced the effect, and iOS 26.1 beta 4 added a "Tinted" control that flattens it. When the originator of the aesthetic adds an off switch within one point release, that is the strongest available signal about the aesthetic's ceiling. The escape hatch users were pointed to in the meantime was Accessibility, Display and Text Size, Reduce Transparency.
- **`backdrop-filter` measurably costs frame rate.** [vuejs/vitepress#1049](https://github.com/vuejs/vitepress/issues/1049): removing `backdrop-filter` from the navbar **improved frame rate by almost 30%**, measured in the DevTools Rendering tab, on a single blurred navbar. The reporter's diagnosis generalises: when the content behind a blurred element updates rapidly, as during scroll, the page stutters, and it is worse on high-DPI displays because the blur processes far more pixels. [shadcn-ui/ui#327](https://github.com/shadcn-ui/ui/issues/327) is the same finding in a component library: `backdrop-blur-sm` on modals and sheets was a paint problem, not a JS problem, and it was GPU-bound in Chromium while Firefox was unaffected.
- **`prefers-reduced-transparency` will not save us.** Chrome 118+ only. Firefox has it behind a flag, disabled by default. **WebKit has a standards position against implementing it**, citing fingerprinting. So the media query covers maybe half of traffic and specifically **not Safari**, which is where most of the users who set "Reduce Transparency" at the OS level actually are. Ship it as a progressive enhancement, never as the accessibility answer.
- **axe and Lighthouse will pass a page that is unreadable.** They return `incomplete` for backgrounds they cannot resolve, and `incomplete` is not a failure, so a glass-over-photo page that is genuinely illegible produces a clean automated report. This is the quiet one: the gate we already trust will actively certify the problem as absent.
- **`backdrop-filter` breaks `position: fixed` descendants**, per the spec text quoted in section 4. On a site whose defining feature is a fixed full-screen photograph, this is not academic.
- **Firefox `backdrop-filter` has a known bug on `position: sticky`** when ancestors have both `overflow` and `border-radius`. This repo's masthead is `position: sticky` with `border-radius: var(--r-md)` and a `backdrop-filter`, which is exactly that shape. Test it in Firefox specifically.
- **Browser support is 95.69% globally** (caniuse, backdrop-filter, Baseline "newly available" since September 2024; Chrome 76+, Edge 79+, Safari 9+, Firefox 103+). The remaining 4.3% is not the risk. The risk is the `@supports not` branch being untested, because at 0.88 alpha nobody will notice it is missing until the one page where the surface sits over a dark region of the photograph.

---

## 7. The three most worth taking

1. **Apple's two-alpha fallback pattern.** Every glass token gets two surface values: one for when `backdrop-filter` is available, and a **more opaque** one for when it is not, gated with `@supports (backdrop-filter: initial)`. Apple ships 0.80 with blur and 0.92 without. This is four lines, it is battle-tested at the largest possible scale, and it makes the degraded path a designed state rather than an accident. Adapted to our contrast table: roughly 0.88 with blur, 0.94 without, for any surface carrying muted labels.

2. **The rendered-pixel contrast gate.** Playwright, text set to `color: transparent`, screenshot, sample every pixel inside each text node's bounding box, `culori.wcagContrast()` against the text token, gate on the **minimum**. Roughly 40 lines and one devDependency (culori, MIT, actively maintained). Nobody has published this; axe explicitly declines to answer it; and it is the only thing that can measure a `backdrop-filter` at all. It also turns the founder's "not high transparency" instinct into an enforced number instead of a taste argument.

3. **Linear's discipline, which is a rule not a technique.** Blur is a named token (`--header-blur: 20px`), it appears in exactly two of their stylesheets, glass lives on **chrome only**, and on buttons it is a hover state rather than a resting one. Plus `isolation: isolate` on the glass element as a deliberate marker against stacking-context surprises. Combined with Nomad List's measured 0.85 to 0.90 on actual data cards, this gives a two-tier language: chrome may be glassier, data surfaces must be nearly opaque.

## The three most worth avoiding

1. **Every Liquid Glass repo, including the 5,946-star one.** Wrong aesthetic by explicit instruction, wrong architecture for a server-rendered static site (all require runtime JS or WebGL), and the popularity is a June-2025 news cycle rather than durability: the top repo has been untouched for 14 months with 24 open issues, and four of the top ten have **no licence file at all**.

2. **Any Tailwind glass plugin.** The category does not exist at any credible scale, the one npm package is pre-1.0, Tailwind-4-only, zero-star, `NOASSERTION`-licensed with a 404 homepage, and it would replace about ten lines of `theme.extend`. Worse, adding a utility-generating plugin to *this* config re-opens the exact "deleted ramp still emits a live rule" failure that the palette-replacement comment in `tailwind.config.ts` was written to close.

3. **Trusting axe, Lighthouse or DevTools on these surfaces, and trusting `prefers-reduced-transparency` as the accessibility answer.** The first three return `incomplete` over a photographic backdrop, which reads as a pass. The fourth is unimplemented in Safari on principle. Together they would let a genuinely illegible page through a green CI run. Also avoid glinui's *values* while borrowing its token shape: a surface ladder that tops out at 0.35 alpha is roughly two and a half times too transparent for financial figures, and its `will-change` performance hint creates a Backdrop Root that can disable the very effect it is meant to accelerate.

---

## 8. What this scan could not establish

Stated plainly, because several of the conclusions above are softer than they look.

- **Star counts measure popularity, not quality, and here they are actively misleading.** The correlation in section 1b is inverted: the highest-starred "systems" are an unlicensed CSS file and a Hacktoberfest dump with 274 open issues, while the two genuine systems have 30 and 71 stars. Every star figure in this document is a 2026-08-20 snapshot of a June-2025 hype cycle.
- **A repo that renders beautifully on a gradient demo tells us nothing about a page of tables over a photograph.** I did not render a single one of these libraries. Every judgement in section 1 is from source, README, metadata and licence, not from looking at output over our actual content. The demo-versus-system calls are defensible; the aesthetic calls are not, because I did not make any.
- **The measured product CSS proves the values, not the effect.** I read the shipped stylesheets of Apple, Linear, Stripe, Raycast, Nomad List and Vercel, so `saturate(180%) blur(20px)` at `rgba(250,250,252,.8)` is a fact. Whether those surfaces *look* right is not something a grep can tell you, and I did not view any of these pages.
- **The contrast table is WCAG 2 relative luminance, which is a known-imperfect model.** It is the standard we are held to, not a model of perception. APCA disagrees with it, particularly on light backgrounds, and would likely be harsher on the `--muted` token. It also assumes a flat composited surface and therefore does **not** account for the grain layer, the border, the seven inset highlights on `.glass`, or the `saturate()`. Real measured pixels will differ, which is the entire argument for building the gate in section 3 rather than trusting the table.
- **I did not benchmark `backdrop-filter` on this site.** The ~30% frame-rate figure is one reporter's DevTools measurement on VitePress in 2022 on Chrome 103, not ours. The claim that `blur(26px)` under a 0.955 alpha is poor value is an inference from the compositing arithmetic (4.5% of the backdrop reaching the eye), not a profile. It should be profiled before anything is removed on that basis.
- **`gh search repos` returned empty arrays for several multi-word queries** ("tailwind glass plugin", "playwright contrast accessibility pixel", "glass design system tokens"). I have read those as genuine absence because the single-word and two-word variants returned dense results and the npm and web searches agreed, but a GitHub search index quirk cannot be fully ruled out.
- **Firefox is untested.** Both Firefox-specific hazards named in section 6 (the sticky plus overflow plus border-radius bug, and the CPU-versus-GPU rendering difference from the shadcn thread) are reported by others, not reproduced here.
- **Only public marketing surfaces were read.** The dense, authenticated product interiors (the Vercel dashboard, the Linear app itself, Raycast's desktop client) are where dense-data glass would actually be proven, and all of them are behind a login or are not web at all. Nomad List is the only genuinely dense, public, photograph-backed data page I could measure, so a fair amount of section 5's conclusion rests on a single site.
