# UI/UX and Interaction Guidelines for marginatlas.com

**Compiled:** 2026-08-19
**Scope:** external research only. No site code was read for the purpose of changing it, and nothing was modified.
**Purpose:** assemble a checkable rule set for a text-and-number-heavy editorial data site, then convert the highest-value rules into automated gates.

---

## How to read this document

Every rule is given in the same shape:

> **ID. The rule as an imperative sentence.**
> `CHECKABLE` or `JUDGMENT` · Source: Name, URL
> **Check:** what a script would measure in the rendered DOM/CSSOM (checkable rules only).

`CHECKABLE` means a script with a headless browser (this repo already runs Playwright in `scripts/lib/design_linter.mjs`) could decide pass/fail without a human looking. `JUDGMENT` means a person has to look. A few rules are marked `PARTIAL`: a script can catch the gross violations but not adjudicate the tasteful cases.

Rule IDs are prefixed by section (L = layout, T = typography, C = color, I = interaction, P = pointer targets, M = motion, F = forms, D = data/tables, V = visualization, R = responsive, X = performance, A = accessibility).

### A note on honesty

Where the sources genuinely disagree, this document says so and names both positions rather than inventing a consensus. Those disputes are collected in the appendix at the end. The most important one is minimum font size: **WCAG sets no minimum font size at all.** Anyone who tells you "WCAG requires 16px" is wrong. The 16px figure is platform and industry convention, and there is a separate, real 16px rule that applies only to form inputs on iOS. Both are covered in section 2.

---

## Sources

| Source | URL |
|---|---|
| Web Interface Guidelines (Rauno Freiberg) | https://interfaces.rauno.me |
| Web Interface Guidelines, agent checklist (Vercel Labs) | https://github.com/vercel-labs/web-interface-guidelines |
| NN/g, 10 Usability Heuristics | https://www.nngroup.com/articles/ten-usability-heuristics/ |
| NN/g, Response Time Limits | https://www.nngroup.com/articles/response-times-3-important-limits/ |
| NN/g, Skeleton Screens | https://www.nngroup.com/articles/skeleton-screens/ |
| NN/g, Placeholders in Form Fields | https://www.nngroup.com/articles/form-design-placeholders/ |
| WCAG 2.2 Quick Reference | https://www.w3.org/WAI/WCAG22/quickref/ |
| WCAG 2.2, Understanding 1.4.3 Contrast (Minimum) | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |
| WCAG 2.2, Understanding 1.4.11 Non-text Contrast | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html |
| WCAG 2.2, Understanding 1.4.10 Reflow | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| WCAG 2.2, Understanding 1.4.4 Resize Text | https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html |
| WCAG 2.2, Understanding 2.5.8 Target Size (Minimum) | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| WCAG 2.2, Understanding 2.4.11 Focus Not Obscured | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html |
| WCAG 2.2, Understanding 2.4.13 Focus Appearance | https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html |
| WCAG 2.2, Understanding 2.3.3 Animation from Interactions | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html |
| W3C WAI, Tables Tutorial | https://www.w3.org/WAI/tutorials/tables/ |
| W3C WAI-ARIA APG, Landmark Regions | https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/ |
| MDN, ARIA Live Regions | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions |
| MDN, `:focus-visible` | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible |
| MDN, `prefers-reduced-motion` | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion |
| MDN, Container Queries | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries |
| web.dev, Web Vitals | https://web.dev/articles/vitals |
| web.dev, Cumulative Layout Shift | https://web.dev/articles/cls |
| web.dev, Interaction to Next Paint | https://web.dev/articles/inp |
| Apple Human Interface Guidelines | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| Apple, UI Design Dos and Don'ts | https://developer.apple.com/design/tips/ |
| Material Design 3, Accessibility and structure | https://m3.material.io/foundations/designing/structure |
| APCA, Why APCA | https://git.apcacontrast.com/documentation/WhyAPCA.html |
| Smashing Magazine, Accessible Text Over Images | https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/ |
| WebAIM, Contrast and Color Accessibility | https://webaim.org/articles/contrast/ |

Additional sources for typography, tables and charts are cited inline in sections 2, 8 and 9.

---

## 1. Layout and spacing

**L1. Place every element deliberately against a grid, baseline or edge; nothing lands by accident.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines, https://github.com/vercel-labs/web-interface-guidelines

**L2. Quantise all spacing values to a single scale, and use a 4px half-step only where the 8px step is too coarse.**
`CHECKABLE` · Source: Material Design 8dp/4dp baseline grid, https://m3.material.io/foundations/designing/structure ; Designsystems.com, https://www.designsystems.com/space-grids-and-layouts/
**Check:** collect computed `margin-*`, `padding-*`, `gap`, `row-gap`, `column-gap` on every visible element. Flag any value that is not a multiple of 4 (excluding 0, `auto`, percentages, and values inherited from user-agent styles for `<p>`/`<ul>`). Report the histogram: a healthy system shows a handful of distinct values, a broken one shows dozens.

**L3. Correct alignment optically rather than geometrically when perception and arithmetic disagree, adjusting by roughly 1px.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines
*Note: this is the explicit exception to L1 and L2. It is why an alignment gate must warn rather than block.*

**L4. Never allow horizontal scrolling on the document; fix the overflow rather than hiding it.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines ("Avoid unwanted scrollbars; fix overflows")
**Check:** at each test width, assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1`. When it fails, walk visible elements and report those whose `getBoundingClientRect().right` exceeds `clientWidth`. *This repo already implements a stronger version in `scripts/audit_overflow.mjs` (ink-level BREACH and FLUSH detection).*

**L5. Keep all painted content inside its container's border box, with a minimum breathing gap at the edge.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines (overflow), reinforced by the local `audit_overflow.mjs` rationale
**Check:** already implemented locally. Walk leaf elements that actually paint (text nodes, elements with a background or border), compare their rects to the nearest sheet ancestor, and report BREACH (outside the border box) separately from FLUSH (inside but within N px of the edge).

**L6. Respect device safe areas using `env(safe-area-inset-*)` for any fixed or full-bleed element.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** for every element with computed `position: fixed` that touches a viewport edge, assert its padding or inset references `env(safe-area-inset-*)` in the authored CSS. Requires reading the CSSOM rules, not just computed values, because `env()` resolves to 0 on desktop.

**L7. Verify layout at mobile, laptop and ultra-wide; simulate ultra-wide by viewing at 50% zoom.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** run the layout gates at a minimum of three widths. See R1 for the specific width set. *The local `design_linter.mjs` currently runs at 1440 and 390; 320 and an ultra-wide width are missing.*

**L8. Build layout with flex and grid rather than JavaScript measurement.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines
**Check:** a source-level scan can flag `getBoundingClientRect()`, `offsetWidth`, `clientHeight` reads inside render paths or resize handlers in component files. High false-positive rate: legitimate uses exist (virtualisation, chart sizing).

**L9. Nest corner radii concentrically, so a child's radius never exceeds its parent's.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** for each element with a non-zero computed `border-radius`, find the nearest ancestor with a non-zero radius and assert `childRadius <= parentRadius`. Ideally assert the concentric relation `childRadius === parentRadius - gap`, but the tolerant form (child never larger) catches the visible defect.

**L10. Give containers no dead space: a card that is 90px taller than its content is a defect.**
`CHECKABLE` · Source: local `design_linter.mjs` VOID-BOTTOM / VOID-MIDDLE rationale, derived from the Vercel and NN/g minimalism principles
**Check:** already implemented locally. Measure the gap between the last painted descendant's bottom and the container's content-box bottom; flag above a threshold.

**L11. Cap line length by constraining the text container, not by hoping the viewport does it.**
`CHECKABLE` · Source: see T3 for the measure numbers and the disagreement between sources
**Check:** for every block containing more than ~200 characters of text, compute characters per line as `elementContentWidth / averageGlyphWidth`, where average glyph width is measured by rendering a reference string in the element's computed font via `canvas.measureText`. Flag blocks above the chosen ceiling.

**L12. Use two-up bands rather than one full-width section per row wherever the content allows.**
`JUDGMENT` · Source: project-specific founder direction (recorded in project memory, 2026-06-18), consistent with NN/g's aesthetic and minimalist design heuristic, https://www.nngroup.com/articles/ten-usability-heuristics/
*Included because it is a standing local constraint, not because an external source mandates it.*

**L13. Add `scroll-margin-top` to every heading that can be an anchor target, sized to clear the sticky header.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** for every `h1`-`h6` with an `id`, assert computed `scroll-margin-top` is at least the height of any element with `position: sticky`/`fixed` pinned to the top of the viewport.

**L14. Do not let fixed or sticky furniture cover content or the focused element.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum), Level AA, https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
**Check:** see A9. This is a real risk on this site: there is a fixed jump rail at `z-index: 15` pinned to the right edge and a fixed sticky mast at `z-index: 20`.

---

## 2. Typography

### 2a. The hard positions, stated first

Two questions get asked constantly and are usually answered wrongly. Here are the honest answers.

**T1. Do not cite WCAG for a minimum font size. WCAG has no minimum font size, at any level.**
`N/A` · Source: WebAIM, Typefaces and Fonts, https://webaim.org/techniques/fonts/ ; WCAG 2.2 SC 1.4.4, https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
*What WCAG requires instead is that text can be **resized to 200%** without loss of content or functionality (SC 1.4.4, Level AA). That is a scalability requirement, not a size requirement. WebAIM states flatly that WCAG has no minimum font size requirement.*

**T2. Where the platforms do set minimums, they are roughly half the web convention, and they disagree with each other.**
The full honest picture:

| Source | Stated floor | Notes |
|---|---|---|
| WCAG 2.2 | **none** | only 200% resize (1.4.4) and the 1.4.12 spacing overrides |
| Apple, UI Design Dos and Don'ts | **11pt** (about 14.7px) | https://developer.apple.com/design/tips/ ; iOS Body is 17pt at the default Dynamic Type setting |
| Material 3 type scale | **11sp** (labelSmall); bodySmall 12sp; bodyMedium 14sp | scale values verified via Flutter's `TextTheme` implementation of the M3 2021 spec, https://api.flutter.dev/flutter/material/TextTheme-class.html , because m3.material.io is JS-rendered and could not be fetched |
| Butterick, Practical Typography | **15px** floor for web body (15 to 25px range) | https://practicaltypography.com/point-size.html |
| Browser default | 16px = 1rem | https://developer.mozilla.org/en-US/docs/Web/CSS/font-size ; this is a **default**, not a published minimum |

**The position to adopt for this site:** body copy at **16px minimum**, secondary and tabular text at **14px minimum**, and an absolute floor of **12px** for footnotes, units and source lines, with a hard ban below that. Justify it as a *product* decision grounded in NN/g's reading research (section 2c) and the fact that this site's entire value is figures the reader must read accurately. Do not justify it as a WCAG requirement, because it is not one. The single font-size number that IS a real technical requirement is **16px on form inputs**, and that is an iOS Safari auto-zoom behavior, not accessibility (see F7).
`CHECKABLE` · **Check:** collect computed `font-size` for every element with a non-whitespace text node; assert `>= 12px` universally, `>= 16px` for elements inside the article/body region, and report the full distribution so drift is visible.

**T3. Set body measure between 45 and 75 characters per line, and treat 66 as the target.**
`CHECKABLE` · **Sources disagree; here is the spread:**

| Source | Recommended CPL | URL |
|---|---|---|
| Bringhurst, via Elements of Typographic Style Applied to the Web | **45 to 75, ideal 66**; 40 to 50 for multi-column | http://webtypography.net/2.1.2 |
| Butterick, Practical Typography | **45 to 90**, or the "two to three alphabets" test | https://practicaltypography.com/line-length.html |
| Baymard Institute | **50 to 75** (cites Ruder's 50 to 60) | https://baymard.com/blog/line-length-readability |
| WCAG 2.2 SC 1.4.8 Visual Presentation (**AAA**) | **80 max** (40 for CJK) | https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html |
| Smashing Magazine | 45 to 75 print, **45 to 85** web | https://www.smashingmagazine.com/2014/09/balancing-line-length-font-size-responsive-web-design/ |

*No two sources agree on both endpoints. The only value in every range is the band **50 to 75**, and 66 is the only widely repeated single number. Butterick's 90 exceeds the WCAG AAA ceiling of 80; Butterick's 45 is below Baymard's 50. Adopt 45 to 75 with a hard warn above 80, which is the one number with a standards body behind it.*
**Check:** see L11. Note the `ch` unit measures the advance width of the "0" glyph, not an average letter, so `max-width: 70ch` is not 70 characters of real prose (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_values_and_units/Numeric_data_types).

**T4. Set body line-height to at least 1.5, unitless.**
`CHECKABLE` · **Sources disagree; 1.5 is the only value that satisfies all of them.**
Butterick recommends **1.20 to 1.45** (https://practicaltypography.com/line-spacing.html), which is *below* the accessibility floor. WCAG 2.2 SC 1.4.8 (AAA) requires at least space-and-a-half within paragraphs and paragraph spacing at least 1.5x the line spacing. WCAG 2.2 SC 1.4.12 (AA) requires the page to survive a user override to **1.5**. MDN's accessibility note gives a **minimum of 1.5** for main paragraph content. NN/g gives the practical form: leading **4 to 6px greater than the font size**, and increase it as the measure lengthens (https://www.nngroup.com/articles/legibility-readability-comprehension/).
*Resolution: 1.5 for body copy, Butterick's tighter 1.2 to 1.3 for headings and display, where the accessibility requirement does not bite the same way.*
**Check:** assert computed `line-height / font-size >= 1.5` on paragraph-level text; assert `line-height` is authored unitless so descendants recompute rather than inheriting a fixed length (https://developer.mozilla.org/en-US/docs/Web/CSS/line-height).

### 2b. Numeric typography, which is the whole game here

**T5. Apply `font-variant-numeric: tabular-nums` to every number that sits in a column, a table, or a slot where the value can change.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric ; Butterick, Alternate Figures, https://practicaltypography.com/alternate-figures.html ; Sebastian De Deyne, Tabular Numbers, https://sebastiandedeyne.com/tabular-numbers/ ; Vercel Labs Web Interface Guidelines
**When tabular figures are MANDATORY**, combining the two authorities: Butterick supplies the static case (**vertically aligned columns of numbers**), De Deyne supplies the dynamic case (**any number updated in place**, so the value does not jump horizontally). Together that means: table cells, financial columns, right-aligned numeric columns, leaderboards, ranked lists, timers, countdowns, and any figure that re-renders. Both agree tabular figures are **wrong in running prose**, where proportional figures space more evenly.
**Check:** for every element whose text content matches a numeric pattern AND which is a `<td>`, is right-aligned, or is a sibling of other numeric elements in a repeated row structure, assert computed `font-variant-numeric` contains `tabular-nums`. This is cheap, precise, and directly protects the site's core promise. See gate G3.

**T6. Write `font-variant-numeric`, not `font-feature-settings`.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
**Check:** MDN is unambiguous that `font-feature-settings` is a low-level escape hatch for features with no other access, and that the higher-level properties give more predictable results. Grep authored CSS for `font-feature-settings: "tnum"` and require `font-variant-numeric: tabular-nums` instead.

**T7. Pick one value per numeric category; the categories are mutually exclusive internally.**
`CHECKABLE` · Source: MDN, font-variant-numeric
**Check:** the categories are figure style (`lining-nums`/`onum` vs `oldstyle-nums`), spacing (`proportional-nums` vs `tabular-nums`), and fractions (`diagonal-fractions` vs `stacked-fractions`), plus the independent `ordinal` and `slashed-zero`. Assert no rule sets both members of a pair.

**T8. Use lining figures alongside capitals and in tabular settings; reserve oldstyle figures for lowercase prose.**
`JUDGMENT` · Source: Butterick, https://practicaltypography.com/alternate-figures.html
*Mild disagreement noted: Butterick says lining figures can be used anywhere; the broader typographic tradition prefers oldstyle in body copy because lining figures disrupt lowercase rhythm. Butterick is the more permissive source.*

**T9. Enable `slashed-zero` wherever 0 and O must be distinguished.**
`CHECKABLE` · Source: MDN, font-variant-numeric
**Check:** assert on identifier and code-like strings.

**T10. Bind every figure to its unit with a non-breaking space.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines. See A23 for the check.

**T11. Format numbers with `Intl.NumberFormat` and keep decimal places consistent within a comparison: zero or two, never mixed.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines (README, copywriting section)
**Check:** for numeric siblings within the same column or comparison set, assert the count of decimal places is uniform. Mixed precision inside one column is a direct credibility defect on a benchmarks site.

### 2c. Scale, fluidity and rendering

**T12. Derive every type size from a single ratio.**
`CHECKABLE` · Source: Modular Scale, https://www.modularscale.com/ ; Typescale, https://typescale.com/
**Check:** common ratios are minor second **1.067**, major second **1.125**, minor third **1.2**, major third **1.25**, perfect fourth **1.333**, augmented fourth **1.414**, perfect fifth **1.5**, golden section **1.618**, major sixth 1.667, octave 2. Collect the distinct computed `font-size` values on a page and assert consecutive ratios cluster around the chosen constant. *Honest note: no source prescribes how many steps a scale should have. Modular Scale lists 17 ratios, Typescale exposes 8, Utopia offers 12. Any "a scale should have N steps" rule is unsourced.*

**T13. Keep the ratio conservative on phones and reserve the dramatic ratio for large screens.**
`JUDGMENT` · Source: Utopia, Designing with fluid type scales, https://utopia.fyi/blog/designing-with-fluid-type-scales (their worked example moves from 1.2 at 320px to 1.333 at 1500px).

**T14. Build fluid type as `clamp(min, rem-term + vw-term, max)` and never with viewport units alone.**
`CHECKABLE` · Source: Utopia calculator, https://utopia.fyi/type/calculator/ ; Smashing Magazine, https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/ ; **WCAG 2.2 Technique F94**, https://www.w3.org/WAI/WCAG22/Techniques/failures/F94
**Check:** F94 is a documented WCAG *failure* for sizing text with viewport units alone, because the text then ignores the user's browser font-size setting and stops scaling under zoom. The preferred value must contain a `rem` term. Slope formula: `v = 100 x (y2 - y1) / (x2 - x1)`, intersection `r = (x1*y2 - x2*y1) / (x1 - x2)`. Mechanically: grep for `font-size` declarations whose value contains `vw`/`vi` with no `rem` anywhere in the expression, and separately re-run the layout gates at 200% zoom (see R4).
*Sources disagree on the whole technique. Adrian Roselli's position (https://adrianroselli.com/2019/12/responsive-type-and-zoom.html) is to avoid viewport units for text entirely and use only %, em and rem. Utopia and Smashing both ship `vw` inside `clamp()`, with the rem term as mitigation, and Smashing concedes testing at 200% and 300% is still required. CSS-Tricks' fluid typography article raises no accessibility caveat at all, which is a gap in that source rather than a resolved dispute.*

**T15. Never set font weights below 400.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert computed `font-weight >= 400` everywhere. One line, zero false positives.

**T16. Use a weight of 500 to 600 for medium headings.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me
*Interacts with the local ban on bold display type; the effect is that headings should be distinguished by size and colour, not weight.*

**T17. Apply `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert both on the root. *Caveat worth recording: `text-rendering: optimizeLegibility` has known performance and rendering side effects on large bodies of text, and `-webkit-font-smoothing: antialiased` thins glyphs on macOS, which is a taste call rather than a correctness one.*

**T18. Set `-webkit-text-size-adjust: 100%` to stop iOS resizing text in landscape.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert the computed value on the root.

**T19. Subset fonts to the content, alphabet or languages actually used.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** compare font file byte size against the character coverage actually rendered.

**T20. Leave `font-optical-sizing` at `auto`.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
**Check:** the initial value is `auto`, it is inherited, and it has been Baseline since March 2020. It only does anything for fonts carrying the `opsz` variation axis, producing thicker strokes and larger serifs at small sizes and finer, higher-contrast strokes at large sizes. Set `none` only to deliberately freeze glyph shapes. Assert the computed value is not `none` unless deliberate.

**T21. Choose `font-display` deliberately and keep fallback metrics matched.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display ; web.dev, https://web.dev/articles/font-best-practices
**Check:** assert every `@font-face` sets `font-display`. Indicative block/swap periods: `block` about 2 to 3s block then infinite swap, `swap` 0ms block then infinite swap, `fallback` 100ms then a 3s swap window, `optional` 100ms then no swap. *Honest caveat: the spec does not mandate exact durations; they are user-agent defined and Firefox exposes them as tunable prefs. Do not treat 3s as normative.* Pair with `font-size-adjust` (Baseline July 2024, formula `u = (m / m') x s`) or `size-adjust`/`ascent-override` to stop the swap shifting layout, which closes the font-related CLS cause in X4.

**T22. Apply `text-wrap: balance` to headings and `text-wrap: pretty` to body copy.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap ; Chrome for Developers, https://developer.chrome.com/blog/css-text-wrap-pretty
**Check:** assert `balance` on headings, captions and pull quotes. Two honest caveats: **the engines cap balancing at different line counts** (Chromium 6 lines, Firefox 10), so the same heading balances in one browser and not another; and **`pretty` fixes orphans and consecutive hyphenated lines but does not fix widows**. Use `text-wrap: stable` in `contenteditable` so earlier lines do not rewrap while typing.

**T23. Letterspace capitals and small caps by 5 to 12 percent, and never letterspace lowercase body text.**
`CHECKABLE` · Source: Butterick, https://practicaltypography.com/letterspacing.html
**Check:** for elements with computed `text-transform: uppercase` or a small-caps setting, assert `letter-spacing` between `0.05em` and `0.12em`; for body-copy elements, assert `letter-spacing` is `normal` or very near zero. *The commonly repeated negative tracking figure for large display type (about -0.01em to -0.03em above 60px) is convention only: no primary typographic authority states a number, and the design blogs that do cite nothing. Flagged as unsourced.*

**T24. Do not justify text.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.8 Visual Presentation (AAA), https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
**Check:** assert computed `text-align` is never `justify` on prose blocks.

**T25. Avoid long passages set entirely in bold, italic or capitals.**
`CHECKABLE` · Source: WebAIM, https://webaim.org/techniques/fonts/
**Check:** flag text runs above a character threshold whose computed style is `font-weight >= 700`, `font-style: italic`, or `text-transform: uppercase`. *One honest contradiction: NN/g's glanceable-reading study (https://www.nngroup.com/articles/glanceable-fonts/) found uppercase outperformed lowercase, with lowercase taking 26% more time and condensed faces 11.2% more. That result is about peripheral, signage-style glancing, not sustained reading, and should not be generalised to body copy.*

**T26. Fix the typewriter habits: one space between sentences, curly quotes and apostrophes, real dashes, a real ellipsis character.**
`CHECKABLE` · Source: Butterick, https://practicaltypography.com/typewriter-habits.html ; Vercel Labs Web Interface Guidelines
**Check:** grep the rendered text for `  ` (double space), `'`/`"` straight quotes inside prose, and `...`. *Local constraint interaction: this project bans the em dash outright, so the "real dashes" rule resolves here to using commas, colons and parentheses instead.*

### 2d. What the reading research says the type has to survive

These are not typography rules, but they set the bar the typography must clear, and they are the strongest empirical numbers in this whole document.

**T27. Assume readers scan rather than read, and design headings to carry the meaning.**
`JUDGMENT` · Source: NN/g, How Users Read on the Web, https://www.nngroup.com/articles/how-users-read-on-the-web/
**79% of users scanned any new page; only 16% read word by word.** Measured usability gains over a control: concise text +58%, scannable layout +47%, objective non-promotional language +27%, **all three together +124%**.

**T28. Assume roughly 20 to 28 percent of the words on a page are read at all.**
`JUDGMENT` · Source: NN/g, How Little Do Users Read?, https://www.nngroup.com/articles/how-little-do-users-read/
Across **45,237 page views** with an average page length of **593 words**, users had time to read at most **28%** of the words, with **20%** the realistic figure. The time model is **about 25 seconds baseline plus 4.4 seconds per additional 100 words**, so at 250wpm each extra 100 words buys roughly 18% readership of that addition. **Users read about half the information only on pages of 111 words or fewer.**

**T29. Design for the layer-cake scanning pattern by supplying strong subheadings; the F-pattern is the failure mode, not a target.**
`JUDGMENT` · Source: NN/g, Text Scanning Patterns, https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ ; NN/g, F-Shaped Pattern, https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
NN/g ranks four patterns: **F-pattern** (worst; occurs specifically in the absence of subheadings and bullets), **spotted**, **layer-cake** (best scanning pattern; the eye rides headings), and **commitment** (near-total reading, high motivation). The F-pattern's three preconditions are unformatted text with no visual hierarchy, users optimising for efficiency, and low motivation. It is confirmed on mobile and mirrors in right-to-left languages.

**T30. Front-load every heading and link, because readers see about the first 11 characters.**
`CHECKABLE` · Source: NN/g, First 2 Words, https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/
**Users see roughly the first 11 characters, about 2 words, of a link or headline when scanning a list.** In NN/g's study a well-front-loaded link reached **85% prediction accuracy and 100% selection accuracy**, while a vague lead word produced **15% selection accuracy**.
**Check:** lint heading and link text for leading filler words ("Introducing", "A look at", "The", "How to") and for the information-carrying term appearing after character 11.

**T31. Treat mobile as roughly twice as hard for complex content.**
`JUDGMENT` · Source: NN/g, Mobile Content Is Twice as Difficult, https://www.nngroup.com/articles/mobile-content-is-twice-as-difficult-2011/ ; NN/g, Reading Content on Mobile Devices, https://www.nngroup.com/articles/mobile-content/
Comprehension measured **39.18% on a desktop-sized screen versus 18.93% on an iPhone-sized screen**, so mobile comprehension was **48% of desktop** (50 participants, Cloze tests). The **2016 follow-up refines this honestly**: short, easy passages read at the same speed on both; **hard passages take about 30ms longer per word on mobile**. The mobile penalty is a complexity penalty, not a blanket one. Related: what fits above the fold on a 30-inch monitor takes **5 screenfuls on a 4-inch phone**, and the average mobile session is **72 seconds against 150 on desktop** (https://www.nngroup.com/articles/mobile-ux/).

---

## 3. Color and contrast

The WCAG numbers, stated exactly, because everything else in this section depends on them.

**C1. Give body text a contrast ratio of at least 4.5:1 against its background.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.3 Contrast (Minimum), Level AA, https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
**Check:** resolve each text node's computed `color` and its effective background (see C4 for the compositing problem), compute the WCAG 2 contrast ratio, assert `>= 4.5`. W3C is explicit that **computed values must not be rounded**: 4.499:1 fails.

**C2. Give large text a contrast ratio of at least 3:1, where "large" means at least 18pt, or 14pt bold.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.3
**Check:** W3C states the conversion as `1pt = 1.333px`, so 14pt and 18pt are **approximately 18.5px and 24px**. The test is therefore: `fontSize >= 24px`, or `fontSize >= 18.5px && fontWeight >= 700`. Anything else takes the 4.5:1 bar. Note that this site bans bold display type locally, which means the 18.5px bold branch is largely unavailable and the effective large-text threshold here is 24px.

**C3. Give UI component boundaries, state indicators and meaning-bearing graphics a contrast ratio of at least 3:1 against adjacent colors.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA, https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
**Check:** applies to input borders, focus indicators, checkboxes, toggles, meaningful icons, **and chart lines and slices**. Exempt: inactive/disabled components, purely decorative graphics, and graphics whose exact presentation is essential. For charts, sample the series color against the plot background.

**C4. Compute contrast against the *composited* background, not against the nominal token.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.3, plus WebAIM's guidance to test where contrast is lowest, https://webaim.org/articles/contrast/
**Check:** this is the single most important contrast rule for this site, and the existing token gate does not do it. `--card` is `rgba(255,255,255,.955)`, so a card is 4.5% transparent over a fixed full-screen photograph, and `body::after` lays a noise texture at `opacity: .5` with `mix-blend-mode: multiply` over everything. The nominal white card is therefore never the actual background. The honest measurement is to screenshot the rendered page and sample real pixels behind each text run, taking the worst pixel in the text's bounding box, rather than reading token values from CSS. See gate G1.

**C5. Never rely on color alone to carry meaning; pair every color cue with a text label, icon, or shape difference.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.1 Use of Color, Level A; Vercel Labs Web Interface Guidelines ("Redundant status cues (not color-only)")
**Check:** for elements whose only distinguishing computed property against their siblings is `color` or `background-color`, assert the presence of sibling text, an `aria-label`, or a differing glyph. Heuristic and noisy; better as a warn-level lint on chart legends and status badges specifically.

**C6. Increase contrast on `:hover`, `:active` and `:focus`, never decrease it.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** compute the contrast ratio of each interactive element in its resting state, then force the state (via CDP `Emulation.forcePseudoState` or by adding the class) and recompute. Assert the ratio does not fall.

**C7. Treat APCA as a supplementary target, not as a substitute for WCAG 2 conformance.**
`JUDGMENT` · Source: APCA, https://git.apcacontrast.com/documentation/WhyAPCA.html
*Honest statement of status: Vercel's guidelines say to prefer APCA over WCAG 2. APCA is perceptually uniform and is genuinely better for dark backgrounds, where WCAG 2 overstates contrast. But **APCA is not normative in WCAG 2.2**; it is a candidate for WCAG 3.0. For a public site with any legal or procurement exposure, WCAG 2.2 AA is the conformance target and APCA is the tiebreaker. APCA's own reference levels: Lc 90 preferred for body text, Lc 75 minimum for columns of body text at 18px minimum, Lc 45 minimum for large/heavy text (36px normal or 24px bold), Lc 30 for meaningful non-text, Lc 15 the floor below which an element is effectively invisible.*

**C8. Place a scrim, solid container, or gradient between a photograph and any text laid over it.**
`CHECKABLE` · Source: Smashing Magazine, Designing Accessible Text Over Images, https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/
**Check:** for text whose ancestor chain reaches the fixed photo layer without an intervening opaque or near-opaque fill, require an explicit scrim. This site already solves it structurally: text sits on `.glass` cards at 95.5% white, and the photo is pre-treated with `grayscale(.55) contrast(.82) brightness(1.06)` which compresses its dynamic range. The residual risk is text placed *outside* a card, directly over the photo.

**C9. Keep the number of accent marks per visual chapter under a fixed budget.**
`CHECKABLE` · Source: local design rulebook (ACCENT-INFLATION in `design_linter.mjs`), consistent with NN/g's aesthetic and minimalist design heuristic
**Check:** already implemented locally. Count elements per chapter whose computed `color` or `background-color` matches the accent hue above a size threshold; flag above budget.

**C10. Set `color-scheme` on the root element so browser-rendered UI (scrollbars, form controls) matches the page.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert `getComputedStyle(document.documentElement).colorScheme` is not `normal`.

**C11. Give native `<select>` an explicit `background-color` and `color`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines (a Windows rendering fix)
**Check:** for each `<select>`, assert both computed properties are author-set rather than the initial value.

**C12. Tint borders, shadows and secondary text toward the background hue rather than using neutral grey.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines ("Hue consistency")

**C13. Avoid banding in large dark gradients; use a radial gradient or a background image instead of scaling and blurring a filled rectangle.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines

**C14. Unset gradient text backgrounds in the `::selection` state.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** source-level scan for `background-clip: text` rules lacking a matching `::selection` override.

---

## 4. Interaction and state

**I1. Keep the user informed of system status with feedback delivered in a reasonable time.**
`JUDGMENT` · Source: NN/g Heuristic 1, Visibility of System Status, https://www.nngroup.com/articles/ten-usability-heuristics/

**I2. Show no loading indicator below 1 second, a spinner or skeleton between 2 and 10 seconds, and a percent-done progress bar above 10 seconds.**
`PARTIAL` · Source: NN/g Response Time Limits, https://www.nngroup.com/articles/response-times-3-important-limits/ ; NN/g Skeleton Screens, https://www.nngroup.com/articles/skeleton-screens/
**Check:** the three limits are **0.1s** (feels instantaneous, no feedback needed), **1.0s** (upper bound for uninterrupted flow of thought), and **10s** (limit of attention; requires a progress indicator and a way to cancel). A script can assert that any async boundary in the codebase has *some* pending state, but cannot time real backends.

**I3. Delay a loading indicator by roughly 150 to 300ms and keep it visible for a minimum of roughly 300 to 500ms once shown.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines (README detail)
**Check:** source-level scan of loading components for a show-delay and a minimum-visible-duration constant. Prevents the flicker where a fast response makes a spinner strobe.

**I4. Make skeletons mirror the shape of the final content so nothing shifts when the content arrives.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** render the skeleton state and the loaded state at the same width, and diff the bounding boxes of the top-level children. Large deltas mean the skeleton lies. This also directly protects CLS (see X4).

**I5. Design the empty, sparse, dense and error states of every component, not just the happy path.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines; NN/g Heuristic 9, https://www.nngroup.com/articles/ten-usability-heuristics/

**I6. Make an empty state prompt the next action rather than merely reporting emptiness.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me ("Empty states should prompt to create a new item, with optional templates")

**I7. Leave no dead ends: every state offers a next step or a route to recovery.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**I8. Write error messages in plain language that name what went wrong and what to do about it, with no error codes.**
`PARTIAL` · Source: NN/g Heuristic 9, Help Users Recognize, Diagnose, and Recover from Errors, https://www.nngroup.com/articles/ten-usability-heuristics/ ; Vercel Labs Web Interface Guidelines ("state what went wrong, tell the user how to fix it")
**Check:** lint error-string constants for raw status codes, stack traces and the words "invalid"/"failed" without a following instruction.

**I9. Never attach a tooltip to a disabled control.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ("Disabled buttons should not have tooltips, they are not accessible")
**Check:** assert no element with `disabled` or `aria-disabled="true"` carries `title`, `aria-describedby` pointing at a tooltip, or a tooltip-trigger data attribute. Disabled elements do not fire pointer events, so the tooltip is unreachable by keyboard and often by mouse.

**I10. Keep a submit control enabled until the request actually starts, then disable it and show a spinner while preserving its original label.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert loading buttons render a spinner *alongside* their text rather than replacing the text (label replacement causes a width change, hence a layout shift, and destroys the accessible name).

**I11. Disable a button after submission to prevent duplicate network requests, and back it with an idempotency key.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines (README)

**I12. Confirm destructive actions, or provide an undo window instead.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines; NN/g Heuristic 3, User Control and Freedom

**I13. Show a temporary inline checkmark on a successful copy rather than firing a notification.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**I14. Display feedback next to the control that triggered it.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**I15. Update optimistically and roll back with visible feedback on server error.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines

**I16. Reflect view state in the URL so filters, tabs, pagination and expanded panels are deep-linkable.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** drive each stateful control with Playwright and assert `location.href` changes; then reload and assert the state is restored.

**I17. Restore scroll position on browser Back and Forward.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** scroll, navigate away, go back, assert `window.scrollY` is within a tolerance of the previous value.

**I18. Use `<a>` (or the framework `Link`) for anything that navigates, and never a `div` with an onClick.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** scan the rendered DOM for non-anchor, non-button elements carrying click handlers (detectable via React fibre props, or source-level via a lint rule). Also assert every `<a>` has a real `href`, since `href="#"` and missing `href` both break Cmd-click, middle-click and keyboard activation. *The local linter already blocks DEAD-LINK and EMPTY-TARGET.*

**I19. Make anything that looks clickable actually clickable.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**I20. Disable `user-select` on the inner content of interactive elements.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert computed `user-select: none` on descendants of buttons and similar controls.

**I21. Set `pointer-events: none` on decorative layers such as glows, gradients, grain and photographs so they cannot swallow events.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** for every fixed or absolutely positioned element that covers a large viewport fraction and contains no text or focusable descendant, assert computed `pointer-events: none`. *This site already does this correctly on `.place` and `body::after`.*

**I22. Open dropdown menus on `mousedown` rather than `click` so they appear immediately.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**I23. Delay the first tooltip in a group and show subsequent peers instantly.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

**I24. Keep interactive content out of hover-triggered tooltips.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert no focusable descendants inside tooltip containers.

**I25. Set `overscroll-behavior: contain` on modals and drawers so scrolling them does not scroll the page behind.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert computed `overscroll-behavior` is `contain` or `none` on scrollable dialog and drawer containers.

**I26. Apply toggles immediately without a confirmation step.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**I27. Warn before navigating away from unsaved changes.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

**I28. Style the document selection with `::selection`.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert a `::selection` rule exists in the stylesheet.

**I29. Keep `<title>` accurate to the current page context.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert `document.title` is non-empty, unique across routes, and contains the page's primary subject. *The repo has `verify_page_metadata.ts` already.*

**I30. Support the platform conventions users already know rather than inventing new ones.**
`JUDGMENT` · Source: NN/g Heuristic 4, Consistency and Standards

---

## 5. Touch and pointer targets

This is where the platform guidance and WCAG diverge, so the numbers are given side by side.

**P1. Give every pointer target an interactive area of at least 24 by 24 CSS pixels.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.5.8 Target Size (Minimum), **Level AA**, https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
**Check:** for every focusable or click-handling element, read `getBoundingClientRect()` and assert `width >= 24 && height >= 24`. Where the visual is smaller, the *hit* area must be expanded (pseudo-element, padding, or an absolutely positioned overlay), and the check must measure the hit area, which means hit-testing with `document.elementFromPoint` at the target's corners rather than trusting the rect.

**P2. Where a target is under 24 by 24, ensure a 24px-diameter circle centred on it does not intersect another target or another undersized target's circle.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.5.8, the "spacing" exception
**Check:** this is the escape hatch that makes P1 enforceable in dense UI. For each undersized target, compute the centre of its minimum bounding box, draw a 24px circle, and assert no intersection with any other target's circle or rect. There are four further exceptions: **equivalent** (the same function is available via a conforming control on the page), **inline** (the target sits in a sentence or is constrained by the line-height of surrounding text), **user agent control** (the author did not modify the size), and **essential** (a specific presentation is required or legally mandated). The **inline** exception is the one that matters most here: inline citation links and footnote markers inside body copy are exempt.

**P3. Give touch targets 44 by 44 points on Apple platforms.**
`CHECKABLE` · Source: Apple Human Interface Guidelines, https://developer.apple.com/design/human-interface-guidelines/accessibility ; Apple UI Design Dos and Don'ts, https://developer.apple.com/design/tips/
**Check:** same measurement as P1 with a 44 threshold, applied only at mobile widths. Apple states 44x44pt as the minimum hit region for a button, and 60x60pt on visionOS.

**P4. Give touch targets 48 by 48 dp on Android, separated by at least 8dp.**
`CHECKABLE` · Source: Material Design 3, https://m3.material.io/foundations/designing/structure ; Android Accessibility Help, https://support.google.com/accessibility/android/answer/7101858
**Check:** same measurement with a 48 threshold plus an 8px minimum gap between adjacent targets. Material notes 48dp corresponds to roughly 9mm of physical size regardless of screen density.

> **The honest position on target size.** These three numbers do not conflict; they are different bars. **24px is the legal/conformance floor** (WCAG AA, and it is a genuine requirement). **44px (Apple) and 48px (Material) are usability recommendations** from platform vendors, and both are stricter. Vercel's guidelines split the difference by requiring **>= 24px generally and >= 44px on mobile**, which is the pragmatic synthesis and the one to adopt. Do not claim WCAG requires 44px: WCAG 2.2 requires 44px only at **Level AAA** (SC 2.5.5 Target Size (Enhanced)), not AA.

**P5. Expand the hit area rather than the visual when a control must look small.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** see P1. Measure by hit-testing, not by the visual rect.

**P6. Leave no dead areas between adjacent items in a list; grow their padding until the gaps close.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** for sibling interactive elements in a list, assert the vertical or horizontal gap between their hit rects is zero (or that the gap is itself covered by one of the two targets).

**P7. Make a checkbox or radio and its label a single hit target with no dead zone between them.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert every `input[type=checkbox]`/`[type=radio]` is either wrapped by its `<label>` or referenced by `label[for]`, then hit-test a point inside the label text and assert it resolves to the input.

**P8. Suppress hover states on touch by gating them behind `@media (hover: hover)`.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** scan authored CSS for `:hover` rules that are not nested inside a `@media (hover: hover)` (or `(any-hover: hover)`) block. Some false positives where a hover style is deliberately harmless.

**P9. Set `touch-action: manipulation` on interactive elements to remove the 300ms double-tap-zoom delay.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert computed `touch-action` on buttons and links includes `manipulation`.

**P10. Replace the default iOS tap highlight rather than merely removing it.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** if `-webkit-tap-highlight-color` is set to a transparent value anywhere, assert an `:active` style exists for the same selectors.

**P11. Disable `touch-action` on custom pan and zoom surfaces so native gestures do not fight the component.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me
*Relevant here for any map component.*

**P12. Give every drag, swipe, pinch or path gesture a tap and a keyboard alternative unless the gesture is essential.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines; WCAG 2.2 SC 2.5.1 Pointer Gestures, Level A

---

## 6. Motion

**M1. Honor `prefers-reduced-motion: reduce` by providing a reduced variant or disabling the animation.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion ; WCAG 2.2 SC 2.3.3 Animation from Interactions (**Level AAA**), https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
**Check:** launch the browser with `prefers-reduced-motion: reduce` emulated (Playwright supports this natively), then assert that every element's computed `animation-duration` and `transition-duration` is 0s, or that the authored CSS contains a matching reduced-motion block. **The correct authoring pattern is animate-by-default then reduce inside the media query**, not the reverse, because browsers without support fall through to the default. Note the honest status: SC 2.3.3 is **AAA**, not AA, so honoring reduced motion is best practice rather than an AA conformance requirement. It is still the right thing to do and costs almost nothing.

**M2. Keep interaction animations at or under 200ms so they feel immediate.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** collect computed `transition-duration` and `animation-duration` across all elements; flag values above 200ms on elements that respond to hover, focus or press. Entrance animations for large surfaces (dialogs, drawers) legitimately run longer, so scope the assertion to interaction states.

**M3. Animate only compositor-friendly properties: `transform` and `opacity`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** parse authored CSS for `transition-property` and `@keyframes` bodies; flag any of `top`, `left`, `right`, `bottom`, `width`, `height`, `margin*`, `padding*`. This is cheap, precise and catches a real performance defect.

**M4. Never write `transition: all`; list the properties explicitly.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** grep the built CSS for `transition-property: all` or a `transition` shorthand whose property slot is `all`. Trivially cheap, near-zero false positives.

**M5. Scale animation values proportionally to the size of the thing being animated.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**M6. Fade and scale dialogs from about 0.8, not from 0.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** parse `@keyframes` for `scale(0)` or `scale3d(0,...)` starting values on dialog selectors.

**M7. Scale a pressed button to about 0.96, not to 0.8.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** parse `:active` rules for `transform: scale(n)` and assert `n >= 0.9`.

**M8. Do not animate frequent, low-novelty actions such as opening a context menu, adding or deleting a list item, or hovering a minor button.**
`JUDGMENT` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**M9. Do not change font weight on hover or selection, because it shifts layout.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** compare computed `font-weight` in resting and hover/`aria-current` states. Cheap and precise. *This site bans bold display type anyway, which makes this nearly free to enforce.*

**M10. Suppress transitions and animations while a theme switch is in flight.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**M11. Pause looping animations when they are off screen.**
`PARTIAL` · Source: Web Interface Guidelines, https://interfaces.rauno.me

**M12. Give any auto-playing motion that runs longer than 5 seconds alongside other content a pause, stop or hide control.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.2.2 Pause, Stop, Hide, **Level A**, per the WCAG 2.2 quick reference; Vercel Labs Web Interface Guidelines
**Check:** find elements with `animation-iteration-count: infinite` or `<video autoplay loop>`; if the duration exceeds 5s and the element is not the only content, assert a control exists. This is Level A, which makes it the strictest-status motion rule in this section.

**M13. Set `transform-origin` so motion begins where it physically should, and wrap SVG transforms on a `<g>` with `transform-box: fill-box`.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines
**Check:** for animated SVG children, assert `transform-box: fill-box` is set. This is a real Safari correctness fix, not a nicety.

**M14. Keep animations interruptible and driven by input.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**M15. Prefer CSS, then the Web Animations API, then a JavaScript library.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**M16. Use `scroll-behavior: smooth` for in-page anchor navigation, with an offset that clears sticky furniture.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** combine with L13 (`scroll-margin-top`). Note the interaction with M1: smooth scrolling should be disabled under `prefers-reduced-motion`.

---

## 7. Forms and inputs

Even a mostly-editorial site has search, filters, and any recommender inputs, so these apply.

**F1. Give every input a persistent visible label; never use a placeholder as the label.**
`CHECKABLE` · Source: NN/g, Placeholders in Form Fields Are Harmful, https://www.nngroup.com/articles/form-design-placeholders/ ; WCAG 2.2 SC 3.3.2 Labels or Instructions, Level A
**Check:** assert every form control resolves to a non-empty accessible name from a `<label for>`, a wrapping `<label>`, `aria-label` or `aria-labelledby`, and that this name does not come solely from `placeholder`. NN/g's objections: the hint vanishes on focus, users cannot verify entries before submitting, error correction requires clearing the field, keyboard users tabbing through miss it, placeholders are mistaken for pre-filled values, and contrast is usually poor. *The repo's `a11y_static_audit.ts` already covers the missing-label case at source level but is not wired into prebuild.*

**F2. Focus the input when its label is clicked.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** implied by a correct `for`/`id` pair or a wrapping label; assert the association, then hit-test the label (see P7).

**F3. Wrap inputs in a `<form>` so Enter submits.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert every text input has a `form` ancestor or a `form` attribute.

**F4. Submit on Enter in a single-line input, and on Cmd/Ctrl+Enter in a `<textarea>` where Enter inserts a newline.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

**F5. Set the correct `type` and `inputmode` on every input.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** assert inputs whose label or name matches known patterns (email, tel, url, search, numeric) carry the matching `type`, and that numeric fields carry `inputmode="numeric"` or `"decimal"`.

**F6. Set `autocomplete` and a meaningful `name` on every input.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; WCAG 2.2 SC 1.3.5 Identify Input Purpose, Level AA
**Check:** assert `autocomplete` is present and is a valid token from the HTML spec's list.

**F7. Give inputs a font size of at least 16px on mobile to stop iOS Safari auto-zooming on focus.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** at a mobile viewport, assert computed `font-size >= 16px` on every `input`, `select` and `textarea`. This is cheap, precise, has essentially zero false positives, and is the one place where a hard 16px number is genuinely correct. It is a **rendering-behavior rule, not an accessibility rule**, and should not be confused with the (non-existent) WCAG minimum font size.

**F8. Never disable browser zoom via `user-scalable=no` or `maximum-scale=1`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; WCAG 2.2 SC 1.4.4 Resize Text, Level AA
**Check:** parse the viewport `<meta>` and assert neither token is present. One line, zero false positives.

**F9. Never block paste in an input or textarea.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** source-level scan for `onPaste` handlers calling `preventDefault`.

**F10. Accept free text and validate after input rather than blocking keystrokes.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**F11. Allow an incomplete form to be submitted so validation surfaces, rather than silently disabling submit.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**F12. Show errors inline beside the offending field and move focus to the first error on submit.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; Web Interface Guidelines ("Highlight the relevant input(s) on form error(s)"); WCAG 2.2 SC 3.3.1 Error Identification, Level A
**Check:** submit an invalid form under Playwright, then assert `document.activeElement` is the first invalid control and that an error message element is a sibling or is referenced by `aria-describedby`.

**F13. Mark invalid fields with `aria-invalid` and point at the message with `aria-describedby`.**
`CHECKABLE` · Source: WCAG 2.2 SC 3.3.1; W3C WAI forms guidance
**Check:** after triggering validation, assert both attributes are present on failing controls.

**F14. Use the `required` attribute so native HTML validation participates.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert fields that the app treats as mandatory carry `required` (or `aria-required`).

**F15. Turn off `spellcheck` and `autocomplete` for emails, codes, usernames and other non-prose fields.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** assert `spellcheck="false"` on inputs whose type is `email`/`password`, or whose name matches code/username patterns.

**F16. Position input prefix and suffix decorations absolutely over the field with padding, not as adjacent siblings, and make them focus the input when clicked.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** for icon elements inside an input wrapper, assert `position: absolute` and that the input's padding on that side exceeds the icon's width.

**F17. End placeholders with an ellipsis character and show an example of the expected pattern.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert `placeholder` values end with `…` (U+2026) and not `...`. Note this is a *supplementary* hint, given F1 requires a real label regardless.

**F18. Trim submitted values to absorb trailing whitespace from text expansion and paste.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

**F19. Stay compatible with password managers and 2FA, and allow codes to be pasted.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**F20. Do not autofocus an input on touch devices, because it opens the keyboard and covers the screen.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** at a mobile viewport, assert no element carries `autofocus`. Autofocus on desktop with a single primary input is acceptable.

**F21. Keep inputs hydration-safe so focus and value survive hydration, and pair a `value` prop with an `onChange` (or use `defaultValue`).**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** React will warn at runtime; capture console errors during the Playwright pass and fail on hydration warnings. Cheap and high-signal.

---

## 8. Tables and data display

### 8a. Structure and semantics

**D1. Mark header cells `<th>` and data cells `<td>`, and give every table a `<caption>`.**
`CHECKABLE` · Source: W3C WAI Tables Tutorial, https://www.w3.org/WAI/tutorials/tables/
**Check:** assert every `<table>` has a `<caption>` and at least one `<th>`. A caption identifies the table's topic and W3C says it is useful in most situations.

**D2. Set `scope="col"` or `scope="row"` on every header cell, and `colgroup`/`rowgroup` where a header spans several columns or rows.**
`CHECKABLE` · Source: W3C WAI Tables Tutorial
**Check:** assert every `<th>` carries a `scope`. For multi-level headers that cannot be associated strictly horizontally or vertically, W3C requires explicit `id`/`headers` association instead. Simple tables need only `<th>`/`<td>`; irregular and multi-level tables need the extra attributes.

**D3. Never use a table for layout.**
`CHECKABLE` · Source: W3C WAI Tables Tutorial
**Check:** flag `<table>` elements containing no `<th>` and no `<caption>`, or carrying `role="presentation"`.

### 8b. Reading and comparison

**D4. Design each table against the four user tasks it can serve: find records matching criteria, compare data, view or edit one row, act on records.**
`JUDGMENT` · Source: NN/g, Data Tables: Four Major User Tasks, https://www.nngroup.com/articles/data-tables/

**D5. Make the first column a human-readable identifier, and left-align it.**
`CHECKABLE` · Source: NN/g, Data Tables, https://www.nngroup.com/articles/data-tables/ ; NN/g, B2B Product Specifications, https://www.nngroup.com/articles/b2b-specs/ (NN/g explicitly criticises a right-aligned first column as less scannable)
**Check:** assert the first column's cells are `text-align: left` or `start`.

**D6. Order columns by importance and keep related columns adjacent.**
`JUDGMENT` · Source: NN/g, Data Tables

**D7. Right-align numeric columns and keep alignment consistent within a column.**
`CHECKABLE` · **Source honesty note.** NN/g's actual, fetched guidance is only that alignment must be **consistent within each column** (https://www.nngroup.com/articles/comparison-tables/) and that the label column is left-aligned (https://www.nngroup.com/articles/b2b-specs/). **The widely circulated "right-align numbers, left-align text" rule does not trace to any NN/g page.** The right-alignment convention for numbers is well supported elsewhere, notably the UK Government Analysis Function's charting guidance which specifies right-aligning numeric axis values (https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-colours-in-charts/), and it follows mechanically from tabular figures (T5): right alignment plus tabular figures is what makes digit places line up so magnitudes are comparable at a glance. Adopt it, but cite it correctly.
**Check:** assert numeric columns are `text-align: right` AND carry `tabular-nums`. The two rules only work together.

**D8. Freeze header rows and the leftmost identifier column whenever the table exceeds the screen.**
`CHECKABLE` · Source: NN/g, Data Tables ; NN/g, Mobile Tables, https://www.nngroup.com/articles/mobile-tables/
**Check:** assert `position: sticky` on `thead th` and on the first column's cells for tables taller or wider than the viewport.

**D9. Use zebra striping, row borders or row-hover highlighting as place-keeping aids, especially for numeric tables.**
`CHECKABLE` · Source: NN/g, Data Tables ; NN/g, B2B Product Specifications
**Check:** **NN/g does not rank these against each other**; they are offered as interchangeable devices for keeping the eye on a row, with striping and borders singled out as especially valuable for numeric data. Datawrapper adds a useful narrowing: apply zebra striping **only when the table has many columns** (https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables). Assert at least one of the three is present on any table over ~6 rows.

**D10. Cap a side-by-side comparison at five items, and expect no more than two on mobile.**
`CHECKABLE` · Source: NN/g, Comparison Tables, https://www.nngroup.com/articles/comparison-tables/
**Check:** count columns in comparison tables; flag above 5. This is one of NN/g's few hard numeric limits.

**D11. Keep cell text short and avoid full sentences, with consistent units and terminology across a row.**
`CHECKABLE` · Source: NN/g, Comparison Tables ; NN/g, B2B Product Specifications
**Check:** flag cells above a character threshold. Assert unit strings are uniform within a row. NN/g also says to put units inside the cell and to show ranges and tolerances explicitly.

**D12. Treat missing or inconsistent attribute data as a blocking defect, not a polish item.**
`CHECKABLE` · Source: NN/g, Comparison Tables ("makes a comparison table useless")
**Check:** assert no comparison table has a column or row with more than a threshold fraction of empty cells. *Directly relevant to this site's sample-tagged gap-filling policy: a comparison with holes in it is worse than a smaller complete comparison.*

**D13. Split large specification sets into several tables with category subheadings.**
`JUDGMENT` · Source: NN/g, B2B Product Specifications

**D14. Sort by the data's inherent order, not alphabetically, whenever an inherent order exists.**
`JUDGMENT` · Source: NN/g, Alphabetical Sorting Must (Mostly) Die, https://www.nngroup.com/articles/alphabetical-sorting-must-mostly-die/
*A-Z is acceptable only when users unambiguously know the item's name (countries, states). For sizes, ranges and bands, alphabetical sorting is actively harmful; use ordinal, chronological, logical or frequency order.*

**D15. Keep per-row actions to one or two; move anything more to batch selection.**
`CHECKABLE` · Source: NN/g, Data Tables
**Check:** count interactive elements per row; flag above 2.

**D16. Make column hiding and reordering reachable without drag-and-drop.**
`JUDGMENT` · Source: NN/g, Data Tables (stated as an accessibility requirement)

**D17. Do not use infinite scroll for tabular data.**
`CHECKABLE` · Source: NN/g, Infinite Scrolling: When to Use It, When to Avoid It, https://www.nngroup.com/articles/infinite-scrolling-tips/
**Check:** NN/g restricts infinite scroll to homogeneous, goal-less browsing streams and says to avoid it when users need to find something specific, compare distant items, or inspect only top results, which describes essentially every data table. The documented failures are: the footer becomes unreachable, Back returns to the top instead of restoring position, users assume they have hit the end, keyboard users face excessive tabbing, screen readers see only the first batch, and **crawlers miss below-fold content**, which matters directly for an SEO-driven content site. Prefer pagination or a Load More button. Mechanically: assert paginated or Load More controls exist on long lists, and assert the footer is reachable.

### 8c. Tables on small screens

**D18. Wrap wide tables in a horizontal scroller rather than letting the page scroll sideways.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.10 Reflow exceptions (data tables are explicitly exempt), https://www.w3.org/WAI/WCAG22/Understanding/reflow.html ; NN/g, Mobile Tables
**Check:** see R3. Assert the scroller is keyboard focusable (`tabindex="0"` with a `role="region"` and an accessible name), otherwise keyboard users cannot scroll it.

**D19. Signal horizontal scroll with arrows or a deliberately cut-off element, never with dots.**
`JUDGMENT` · Source: NN/g, Mobile Tables

**D20. Never force landscape rotation.**
`CHECKABLE` · Source: NN/g, Mobile Tables ; WCAG 2.2 SC 1.3.4 Orientation, Level AA
**Check:** assert no CSS or script locks orientation.

**D21. Expect about two columns of wordy content on a narrow phone, but many more when cells are short numbers.**
`JUDGMENT` · Source: NN/g, Mobile Tables (their example shows an 11-column numeric sports table fitting without horizontal scroll, against roughly 2 columns for wordy entries)

**D22. Pre-filter or offer row and column toggles rather than shipping the full matrix to a phone.**
`JUDGMENT` · Source: NN/g, Mobile Tables ; Datawrapper (hide non-essential columns on mobile), https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables

**D23. Build tables with more rows than columns so the reader skims vertically.**
`JUDGMENT` · Source: Datawrapper, https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables

**D24. Put an embedded bar or heat tint on the single most important numeric column only, not on every column.**
`CHECKABLE` · Source: Datawrapper, https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables
**Check:** count columns containing inline bars or background scales; flag above 1. *This aligns with the existing local bar-budget gate.*

### 8d. Presenting a single figure

**D25. Never present a number alone; always give the comparison that makes it mean something.**
`CHECKABLE` · Source: NN/g, Choosing Chart Types: Consider Context, https://www.nngroup.com/articles/choosing-chart-types/
**Check:** NN/g states this flatly, with a worked example: a 24% checkout completion rate means nothing until you learn it was 17% the year before. The two comparison classes are **temporal** (year over year, before and after) and **cross-sectional** (similar products, places or groups). **This is arguably the single most important rule in this entire document for this particular site**, because the product is figures and a figure without a peer or a trend is not a benchmark. Mechanically: assert every headline figure component renders at least one of a peer value, a national or regional median, a prior-period value, or a rank-within-set. See gate G8.

**D26. Rank content by importance before laying out, and keep genuinely important figures above the fold at every device size.**
`CHECKABLE` · Source: NN/g, The Fold Manifesto, https://www.nngroup.com/articles/page-fold-manifesto/
**Check:** the numbers are worth stating precisely: the average difference in how users treat information above versus below the fold is **84%**; across **57,453 fixations**, the 100 pixels just above the fold were viewed **102% more** than the 100 pixels just below; Google's ad data shows **73% viewability above the fold against 44% below**. Mechanically: assert the primary answer figure's bounding box intersects the initial viewport at 390px, 768px and 1440px. Also assert no "false floor" (a full-width band that looks like a page end) sits at the fold.

**D27. Keep the dashboard-style summary to encodings people can actually judge: length and 2D position.**
`JUDGMENT` · Source: NN/g, Dashboards: Making Charts and Graphs Easier to Understand, https://www.nngroup.com/articles/dashboards-preattentive/
*NN/g's position: length and 2D position are the two preattentive attributes that map onto magnitude. Area and angle let people see that a difference exists but not judge its size. **Colour must never encode quantitative magnitude**, only category.*

---

## 9. Charts

### 9a. Choosing the form

**V1. Choose the chart from the intent, not from the data shape.**
`JUDGMENT` · Source: Financial Times Visual Vocabulary, https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary (live: https://ft-interactive.github.io/visual-vocabulary/)
*The FT taxonomy is 72 chart types across nine intents: **Deviation, Correlation, Ranking, Distribution, Change over Time, Part-to-Whole, Magnitude, Spatial, Flow.** Pick the category first, then the chart inside it. The EU Data Visualisation Guide adopts the same taxonomy (https://data.europa.eu/apps/data-visualisation-guide/choosing-charts-the-message).*

**V2. Map the relationship to the form: bars for nominal comparison and ranking, lines for time series, stacked or pie for part-to-whole, bars from a baseline for deviation, histogram or box plot for distribution, scatterplot for correlation, map for geospatial.**
`JUDGMENT` · Source: Stephen Few, Graph Selection Matrix, https://www.perceptualedge.com/articles/misc/Graph_Selection_Matrix.pdf

**V3. Prefer bar charts, line graphs and scatterplots; avoid pie, donut, treemap and gauge where the reader must judge a magnitude.**
`CHECKABLE` · Source: NN/g, Dashboards, https://www.nngroup.com/articles/dashboards-preattentive/ ; NN/g, Choosing Chart Types, https://www.nngroup.com/articles/choosing-chart-types/
**Check:** assert the chart-type registry contains no chart requiring judgment of angle, area or volume for a magnitude comparison. Cheap if chart types are declared in data rather than hand-built.

**V4. Use a horizontal bar chart when the category labels are long.**
`CHECKABLE` · Source: NN/g, Choosing Chart Types
**Check:** flag vertical bar charts whose category labels exceed a character threshold or are rotated.

**V5. Encode rates and ratios in a choropleth, and counts in proportional symbols.**
`JUDGMENT` · Source: FT Visual Vocabulary
*A choropleth of raw counts is a population map, which is the classic mapping error.*

**V6. Keep stacked charts to a few components.**
`JUDGMENT` · Source: FT Visual Vocabulary

**V7. Say explicitly when a correlation is not causal.**
`JUDGMENT` · Source: FT Visual Vocabulary

### 9b. Axes

**V8. Start every bar and column chart at zero, and never break a length-encoded axis.**
`CHECKABLE` · Source: Datawrapper, https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero ; UK Government Analysis Function, Charts: a checklist, https://analysisfunction.civilservice.gov.uk/policy-store/charts-a-checklist/ ; Urban Institute Data Visualization Style Guide, https://urbaninstitute.github.io/graphics-styleguide/ ; Storytelling with Data, https://www.storytellingwithdata.com/blog/2012/09/bar-charts-must-have-zero-baseline
**Check:** assert `yDomain[0] === 0` for every bar and column series. **All four sources agree; this is the one axis rule with no dissent.** The justification is the encoding: bars encode by length, so truncation distorts the comparison directly. Datawrapper disallows it in software, and cites a 2015 study finding readers took the exaggerated reading as the real message.

**V9. Do not claim a settled rule on zero baselines for LINE charts; sources actively disagree.**
`JUDGMENT` · **The honest state of the argument:**
- *Position A, zero not required:* line charts encode by slope and relative position, so the bar rule does not carry over. Storytelling with Data (URL above) and Datawrapper (which also exempts dot plots and range plots).
- *Position A, qualified:* extend the axis down to zero anyway when the data comes close to zero, and up to 100% when a share series approaches it. Datawrapper, https://www.datawrapper.de/blog/line-charts
- *Position B, mostly require zero:* readers decode line height from the baseline much as they do bars; depart only when zero is arbitrary or a small-but-important change would vanish. Chad Skelton, https://www.chadskelton.com/2018/06/bar-charts-should-always-start-at-zero.html
- *Position C, empirical, undermines both:* truncation inflates perceived effect size **across chart types**, and explicit "axis broken" cues **do not fix it**. The authors decline to issue a universal rule and tell designers to set the axis to the effect size that actually matters. Correll, Bertini and Franconeri, CHI 2020, https://arxiv.org/abs/1907.02035
*Recommended local position: zero baseline mandatory for bars (V8, mechanically enforced), and for lines a **declared, visible** axis range with a documented reason, since Correll et al. show a broken-axis marker will not protect the reader.*

**V10. Put between 2 and 8 labels on a numeric or date axis, and cap gridlines at ten.**
`CHECKABLE` · Source: EU Data Visualisation Guide, Axes, grids and legends, https://data.europa.eu/apps/data-visualisation-guide/axes-grids-and-legends ; UK Government Analysis Function, https://analysisfunction.civilservice.gov.uk/policy-store/charts-a-checklist/
**Check:** count rendered tick labels and gridlines per axis; assert within range. Widen the axis interval to thin gridlines rather than shrinking the label type (NN/g, https://www.nngroup.com/articles/clutter-charts/).

**V11. Never rotate axis labels; keep all chart text horizontal.**
`CHECKABLE` · Source: UK Government Analysis Function ; Datawrapper, https://www.datawrapper.de/academy/why-datawrapper-does-not-include-axis-labels-for-many-charts
**Check:** assert no chart text node has a computed `transform` containing a rotation. Cheap and precise. If labels do not fit horizontally, the fix is a horizontal bar chart (V4), not rotation.

**V12. Centre continuous tick labels on the tick and place categorical labels between ticks; show tick marks only on continuous axes.**
`CHECKABLE` · Source: UK Government Analysis Function ; Urban Institute
**Check:** assert categorical bar charts render no tick marks.

**V13. State the unit somewhere the reader will look, and drop the axis title when the chart title already carries it.**
`PARTIAL` · **Sources disagree on the default.** Datawrapper omits axis titles by default and pushes the unit into the title, description or the tick values, reserving explicit axis titles for scatterplots (https://www.datawrapper.de/academy/why-datawrapper-does-not-include-axis-labels-for-many-charts). The EU guide treats an unlabelled axis as unreadable unless enough points are directly labelled (https://data.europa.eu/apps/data-visualisation-guide/axes-grids-and-legends). *Both agree on the underlying condition: the unit must be somewhere obvious. Enforce that, not the placement.*
**Check:** assert every chart exposes a unit string in its title, subtitle, axis title or tick labels.

**V14. Delete axis lines from bar charts and use round increments on time axes.**
`CHECKABLE` · Source: EU Data Visualisation Guide ; Urban Institute (increments of 1, 2, 5, 10)

**V15. Avoid dual-axis charts.**
`CHECKABLE` · Source: Urban Institute, https://urbaninstitute.github.io/graphics-styleguide/
**Check:** assert no chart declares two independent y scales. Urban permits only unit conversions (F/C) and Pareto charts.

### 9c. Labels and legends

**V16. Label the data directly and treat a separate legend as the fallback.**
`CHECKABLE` · Source: NN/g, Clutter-Free Charts, https://www.nngroup.com/articles/clutter-charts/ ; UK Government Analysis Function ; EU Data Visualisation Guide ; Urban Institute ; Datawrapper, https://www.datawrapper.de/blog/color-keys-for-data-visualizations
**Check:** **five independent sources agree**, which makes this one of the strongest consensus rules in the chart literature. Legends force back-and-forth eye movement, and direct labelling also helps colourblind readers. Mechanically: assert charts with 4 or fewer series render inline series labels rather than a legend block. Place line labels at the far right just outside the plot, left-aligned, coloured to match the line.

**V17. Order legend entries to match the visual order of the series.**
`CHECKABLE` · Source: Urban Institute ; Datawrapper color keys ; UK Government Analysis Function
**Check:** compare the DOM order of legend items to the vertical order of the series at the right-hand edge of the plot; assert they match. Sort by category size (largest first) where magnitudes differ a lot, otherwise follow a natural order (temporal, hierarchical, evaluative), never arbitrary.

**V18. Repeat every non-colour encoding in the key: dashes, hatching, stroke weight.**
`CHECKABLE` · Source: Datawrapper color keys, https://www.datawrapper.de/blog/color-keys-for-data-visualizations
**Check:** assert legend swatches reproduce the series' `stroke-dasharray` and `stroke-width`, not just its colour.

**V19. Drop the y-axis labels and gridlines once the bars carry data labels.**
`CHECKABLE` · Source: Urban Institute ; NN/g, Clutter-Free Charts
**Check:** assert a chart does not render both per-bar value labels and a full y-axis scale. Redundant ink.

**V20. Label only the distinguishable steps on a gradient key, plus min, max, and the midpoint for diverging scales.**
`JUDGMENT` · Source: Datawrapper color keys

### 9d. Colour

**V21. Use varying hues only for unordered categories.**
`CHECKABLE` · Source: Datawrapper, Quantitative vs qualitative colour scales, https://www.datawrapper.de/blog/quantitative-vs-qualitative-color-scales
**Check:** assert the palette declared for a categorical series is qualitative, and that no multi-hue gradient is applied to unordered categories, since that fabricates a rank that is not in the data.

**V22. Use one hue at varying lightness for any ordered quantity, including good-versus-bad.**
`CHECKABLE` · Source: Datawrapper (URL above) ; ColorBrewer, https://colorbrewer2.org/learnmore/schemes_full.html ; UK Government Analysis Function, Colours in charts, https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-colours-in-charts/
**Check:** this is the "one hue, varying intensity" convention asked about. Single-hue sequential shades are preferred for ordered data specifically because they **survive greyscale conversion and colourblind viewing**. ColorBrewer's sequential convention is light for low, dark for high. UK guidance gives exact step counts: 3 steps = dark/mid/light blue; 4 = darkest/dark/mid/light; 5 = the full gradient; plus pale grey for "no data". Mechanically: assert sequential scales vary only in lightness (constant hue in OKLCH/HSL within a tolerance) and increase monotonically.

**V23. Use a diverging scale only where a genuinely meaningful midpoint exists, and always ship a key with it.**
`CHECKABLE` · Source: Datawrapper, Diverging vs sequential, https://www.datawrapper.de/blog/diverging-vs-sequential-color-scales ; ColorBrewer
**Check:** a meaningful midpoint means zero, 50%, the mean or median, or an agreed threshold or target. ColorBrewer's convention is light at the critical middle with dark contrasting hues at both extremes. Readers cannot infer which end is high without a key, so assert one is rendered. Choose diverging to emphasise both extremes; choose sequential when the chart should be readable without a key.

**V24. Cap categorical shades of a single hue at two or three.**
`CHECKABLE` · Source: Datawrapper, Quantitative vs qualitative colour scales
**Check:** readers stop tracking at four or more shades of one hue. This is the most specific number any source gives on shade-based categories.

**V25. Cap the number of categorical colours in one chart. The sources give different numbers; the defensible ceiling is 8 and the strictest published rule is 4.**
`CHECKABLE` · **Full spread, honestly reported:**

| Source | Max categorical colours | URL |
|---|---|---|
| UK Government Analysis Function | **4** (also: max 4 lines, 4 bar categories, 5 pie categories) | https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-colours-in-charts/ |
| Datawrapper survey of editorial style guides | **5 to 6** in practice (YouGov trimmed 6 to 5; Economist and FT run 3 to 4 hues with many shades; Quartz runs 2) | https://www.datawrapper.de/blog/colors-for-data-vis-style-guides |
| Urban Institute | **8** core palette; under 7 data series per chart; under 5 pie slices | https://urbaninstitute.github.io/graphics-styleguide/ |
| ColorBrewer | **12** | https://colorbrewer2.org/ |

*ColorBrewer's 12 is a **tool ceiling, not a recommendation**. No source defends more than 8 for reader discrimination. Adopt 6 as the working limit and 8 as the hard fail.*
**Check:** count distinct series colours per chart; warn above 6, fail above 8.

**V26. Never encode meaning by colour alone.**
`CHECKABLE` · Source: UK Government Analysis Function ; NN/g, Clutter-Free Charts ; Datawrapper ; WCAG 2.2 SC 1.4.1, Level A
**Check:** assert every series is distinguished by at least one of: a direct label, a shape, a dash pattern, or hatching, in addition to colour. NN/g's stated budget for why: **up to 4.5% of the general population has some form of colour blindness**, roughly 8% of men against 0.5% of women (https://www.nngroup.com/articles/dashboards-preattentive/ ; https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/). The confusable set is reds, greens, browns and oranges.

**V27. Give categorical colours different lightnesses so the chart survives greyscale, and test it in greyscale.**
`CHECKABLE` · Source: Datawrapper, https://www.datawrapper.de/blog/which-color-scale-to-use-in-data-vis ; UK Government Analysis Function
**Check:** convert each series colour to relative luminance and assert adjacent series differ by a minimum delta. Cheap, deterministic, and a genuinely good proxy for colourblind safety.

**V28. Hold at least 3:1 contrast between adjacent graphical elements and 4.5:1 for chart text.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.11 ; UK Government Analysis Function ; Urban Institute (which names WCAG 2.0 AA explicitly)
**Check:** see C3. Chart lines and slices are explicitly named by W3C as "graphical objects" under 1.4.11.

**V29. Avoid red/green for positive versus negative; use blue/red instead.**
`CHECKABLE` · Source: Datawrapper style-guide survey, https://www.datawrapper.de/blog/colors-for-data-vis-style-guides ; NN/g, Contrast Charts, https://www.nngroup.com/articles/contrast-charts/
**Check:** assert the good/bad palette does not pair a green hue with a red hue. NN/g also warns that red and green carry cultural meaning (red = bad/stop) that can fight the data.

**V30. Reserve grey for missing data, context series, historical comparison and de-emphasised categories.**
`CHECKABLE` · Source: Datawrapper style-guide survey ; Datawrapper line charts
**Check:** assert grey is not used as a primary data colour where any category is emphasised.

**V31. Start the chart in grey, then add one bold colour to the series that carries the point.**
`JUDGMENT` · Source: NN/g, Contrast: One of the 3Cs for Better Charts, https://www.nngroup.com/articles/contrast-charts/
*NN/g adds: do not use solid colours of similar brightness, and vary darkness as well as hue.*

**V32. Raise saturation for small marks and lower it for large areas.**
`JUDGMENT` · Source: Datawrapper style-guide survey
*Lines, dots and symbols need more saturation; bars, pies and choropleths need less.*

**V33. Avoid pure hues and never combine 100% saturation with 100% brightness.**
`CHECKABLE` · Source: Datawrapper, How to choose beautiful colours, https://www.datawrapper.de/blog/beautifulcolors/
**Check:** assert no palette colour sits at exactly 0, 60, 120, 180, 240 or 300 degrees of hue, and none has both S and V at 100%. Keep light backgrounds under about 7% saturation and dark backgrounds under about 20%.

**V34. Never use blue and pink to encode gender.**
`CHECKABLE` · Source: Urban Institute (which substitutes yellow and cyan)

### 9e. Small multiples

**V35. Split into small multiples when lines tangle, when each category's individual shape matters, or when magnitudes differ wildly.**
`JUDGMENT` · Source: Datawrapper, Small multiple line charts, https://www.datawrapper.de/blog/what-to-consider-when-creating-small-multiple-line-charts

**V36. Do not use small multiples when the reader must compare specific values at a specific point in time.**
`JUDGMENT` · Source: Datawrapper (URL above)

**V37. Share one identical scale and one identical panel size across every panel.**
`CHECKABLE` · Source: Urban Institute ; Datawrapper
**Check:** assert all panels declare the same y domain and render at the same pixel dimensions. **This is the highest-value mechanical check in the chart section**, because readers assume a shared axis and will draw false conclusions from per-panel scales. If independent scales are unavoidable, Datawrapper requires saying so in the description AND forcing axis labels visible in every panel.

**V38. Sort panels by a stated logic and write that logic into the description.**
`JUDGMENT` · Source: Datawrapper
*Start value, end value, range or percent change. Alphabetical only when no logic exists (which connects to D14).*

**V39. Use fewer panels than you first planned, and test the mobile scroll length.**
`JUDGMENT` · Source: Datawrapper
*No source gives a hard maximum. The stated test is mobile scroll length, not a count.*

**V40. Repeat all series faintly in each panel's background so limited cross-panel comparison remains possible, and show grid labels only in the first column of panels.**
`JUDGMENT` · Source: Datawrapper, small multiple line and column charts, https://www.datawrapper.de/blog/small-multiple-column-charts

### 9f. Chart junk and titles

**V41. Never use 3D effects, gradients, shadows, textures or decorative striping in a chart.**
`CHECKABLE` · Source: NN/g, Clutter-Free Charts ; Urban Institute ; UK Government Analysis Function
**Check:** assert chart SVG contains no `filter`, no `linearGradient` applied to data marks, and no `pattern` fills used decoratively. Cheap and precise.

**V42. Show major horizontal gridlines only, in light grey, and remove minor gridlines, vertical gridlines, tick marks and axis lines.**
`CHECKABLE` · Source: BBC News data team `bbc_style()`, https://github.com/bbc/bbplot/blob/master/R/bbc_style.R and https://bbc.github.io/rcookbook/ ; EU Data Visualisation Guide ; UK Government Analysis Function (axes at #595959, gridlines at #D9D9D9)
**Check:** this is the BBC's shipped default, which makes it an unusually concrete citation. Assert gridline stroke luminance is above a threshold and that no vertical gridlines render on a time series.

**V43. Maximise the data-ink ratio: erase non-data ink, then redundant data ink, then revise.**
`JUDGMENT` · Source: Tufte via InfoVis Wiki, https://infovis-wiki.net/wiki/Data-Ink_Ratio
*Honest caveat: the minimalist position is dominant but empirically contested. InfoVis Wiki records Inbar et al. (2007), in which 87 students preferred embellished charts to Tufte-minimal ones, and notes that stripping borders can hide a misleading scale. Treat data-ink as a strong default, not a law.*

**V44. Write chart titles that state the finding, not the dataset, and left-align them.**
`CHECKABLE` · Source: Urban Institute ; NN/g, Contrast Charts ; UK Government Analysis Function
**Check:** NN/g's worked example rewrites "Login rates before and after redesign" into a title naming the 29% improvement. UK guidance pairs a formal statistical title (what, where, when) with a headline title carrying the message. Mechanically: lint chart titles for the absence of any number or comparative word. Noisy, so warn rather than block.

**V45. Ship a text alternative with every chart: an accessible data table or a description.**
`CHECKABLE` · Source: UK Government Analysis Function, https://analysisfunction.civilservice.gov.uk/policy-store/charts-a-checklist/ ; Web Interface Guidelines (illustrations need a single `aria-label` rather than exposing the raw DOM tree)
**Check:** assert every chart container resolves to a non-empty accessible name and either references a data table or carries a description. Export as SVG rather than raster so the text scales.

---

## 10. Responsive behavior

**R1. Verify every page at 320, 390, 768, 1024, 1440 and one ultra-wide width, and never at a single width.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.10 Reflow, https://www.w3.org/WAI/WCAG22/Understanding/reflow.html ; Vercel Labs Web Interface Guidelines ("Verify mobile, laptop, ultra-wide")
**Check:** this is a harness rule, not a page rule: run the layout gates in a loop over the width set. **The failure mode being guarded against is precisely that a single-width pass reports green while another width is broken.** *This repo currently runs the rendered linter at 1440 and 390 only; 320 is the conformance-relevant width and is missing.*

**R2. Present content without two-dimensional scrolling at a width equivalent to 320 CSS pixels.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.10 Reflow, **Level AA**
**Check:** set the viewport to 320px wide and assert no horizontal document scroll (see L4). The 320 figure is not arbitrary: W3C states it is **equivalent to a 1280px viewport at 400% zoom**, which is the real scenario being protected. The vertical counterpart is **256 CSS pixels of height** for horizontally-scrolling content.

**R3. Exempt genuinely two-dimensional content from reflow, and confine the exemption to the element itself.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.10, exceptions
**Check:** W3C explicitly lists **data tables** among the content types that require two-dimensional layout and are therefore exempt, alongside maps, diagrams, video, games and presentations. The correct implementation is a horizontally scrollable wrapper around the table (this repo's `.scroll-x`), which the overflow gate must whitelist, while everything outside that wrapper still has to reflow. Do not use the exemption to excuse a page-level horizontal scroll.

**R4. Support 200% text resize without loss of content or functionality.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.4 Resize Text, **Level AA**, https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
**Check:** in Playwright, set the browser's font-size preference or apply a root font-size multiplier of 2, then re-run the overflow and clipping assertions. This catches fixed-height containers and `overflow: hidden` truncation that a width-only test misses.

**R5. Survive the WCAG text-spacing overrides without clipping or overlap.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.4.12 Text Spacing, **Level AA**
**Check:** inject a stylesheet setting `line-height: 1.5`, `margin-bottom: 2em` on paragraphs, `letter-spacing: 0.12em`, `word-spacing: 0.16em` (these are the exact normative multipliers: line height at least **1.5x** font size, paragraph spacing at least **2x**, letter spacing at least **0.12x**, word spacing at least **0.16x**), then assert no clipping or overlap. Cheap to implement and catches brittle fixed-height cards, which is a real risk for a card-based layout.

**R6. Size type fluidly with `clamp()` rather than stepping it at breakpoints.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** assert heading font sizes differ continuously across a viewport sweep rather than jumping. See T-section for the accessibility caveat about viewport-unit-only sizing.

**R7. Use container queries rather than media queries for components that appear in more than one container width.**
`CHECKABLE` · Source: MDN, Container Queries, https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
**Check:** the mechanism is `container-type: inline-size` (query the inline axis only, the common case), `size` (both axes, most containment cost) or `normal` (not a size container), addressed with `@container [name] (width > Npx)`, plus the container-relative units `cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`. A script can flag components rendered in two different container widths whose styling responds only to viewport media queries: render the same component in a narrow and a wide slot and diff the computed styles.

**R8. Choose breakpoints from where the content breaks, not from device names.**
`JUDGMENT` · Source: general responsive practice; corroborated by Material 3's window size classes, https://m3.material.io/foundations/designing/structure

**R9. Let flex children truncate by giving them `min-width: 0`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** for flex children containing text with `text-overflow: ellipsis` or `-webkit-line-clamp`, assert computed `min-width` is `0px`. Without it the child refuses to shrink below its content and blows out the row. Cheap, precise, and a very common real bug.

**R10. Make text containers survive short, average and very long content.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** re-render with a synthetic long string injected into each text slot and re-run overflow assertions. Also assert `overflow-wrap: break-word` (or `break-words`) on containers holding unbroken tokens such as long place names or URLs.

**R11. Test with scrollbars forced visible on macOS.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines (README detail)
*Overlay scrollbars hide a class of layout bug that appears the moment a user has "Show scroll bars: Always" set.*

---

## 11. Performance

Performance here is treated as a UX property, which is what the Core Web Vitals programme measures.

**X1. Keep Largest Contentful Paint at or under 2.5 seconds.**
`CHECKABLE` · Source: web.dev, Web Vitals, https://web.dev/articles/vitals
**Check:** thresholds are **good <= 2.5s, needs improvement 2.5 to 4s, poor > 4s**, assessed at the **75th percentile** of page loads, segmented by device type. Measure in CI with Lighthouse for lab data, and in production with the `web-vitals` library reporting field data.

**X2. Keep Interaction to Next Paint at or under 200 milliseconds.**
`CHECKABLE` · Source: web.dev, INP, https://web.dev/articles/inp
**Check:** thresholds are **good <= 200ms, needs improvement 201 to 500ms, poor > 500ms**. INP replaced First Input Delay as a Core Web Vital in 2024. It counts **clicks, taps and key presses** and explicitly does **not** count scrolling, hovering or zooming. It decomposes into input delay, processing duration and presentation delay, so the fixes are: break up long tasks and yield to the main thread, cut re-render cost, and reduce DOM size.

**X3. Keep Cumulative Layout Shift at or under 0.1.**
`CHECKABLE` · Source: web.dev, CLS, https://web.dev/articles/cls
**Check:** thresholds are **good <= 0.1, needs improvement 0.1 to 0.25, poor > 0.25**, at the 75th percentile. The score of a single shift is `impact fraction x distance fraction`. Measure with a `PerformanceObserver` on `layout-shift` entries during a scripted scroll-through, which is more reproducible than a Lighthouse run.

**X4. Reserve space for every image, chart, embed and late-arriving block so nothing shifts when it lands.**
`CHECKABLE` · Source: web.dev, CLS, https://web.dev/articles/cls
**Check:** the causes web.dev names are **images and video without dimensions, ads/widgets/third-party embeds that resize themselves, dynamically injected content inserted above existing content, web fonts whose fallback metrics differ from the final face, and content that waits on a network response before updating the DOM**. The mechanical check: assert every `<img>` has either both `width` and `height` attributes or a computed `aspect-ratio`, and that every chart container has a reserved height before its data arrives. This is the highest-value CLS check for an image-and-chart-heavy page and it is cheap.

**X5. Preload above-the-fold images and lazy-load the rest.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert images whose initial rect intersects the viewport do **not** carry `loading="lazy"` (lazy-loading an LCP element is a common and costly mistake), and that images below the fold do.

**X6. Preload critical fonts and serve them with `font-display: swap`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert a `<link rel="preload" as="font" crossorigin>` exists for each font used above the fold, and that every `@font-face` sets `font-display`. Pair with `size-adjust`/`ascent-override` on the fallback to keep the swap from shifting layout (this closes the font-related CLS cause in X4).

**X7. Add `<link rel="preconnect">` for third-party origins that serve render-critical assets.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** collect distinct origins from the network log during load; assert each render-blocking one has a preconnect hint.

**X8. Virtualise any list longer than 50 items.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** count rendered children of list containers; flag above 50 where no virtualisation wrapper is present. Note the tension with SEO on a content site: virtualising a list of links removes them from the initial HTML. For this site, prefer pagination or progressive disclosure over virtualisation wherever the items are crawlable links.

**X9. Keep the DOM small; large DOM size inflates style recalculation and hurts INP.**
`CHECKABLE` · Source: web.dev, INP, https://web.dev/articles/inp
**Check:** assert `document.querySelectorAll('*').length` stays under a budget (Lighthouse warns around 1,400 nodes and flags depth beyond 32). Set the budget from the current measured value and ratchet it down.

**X10. Target under 500ms for mutating requests.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines (README detail)

**X11. Prefer a muted, looping, inline `<video>` over an animated GIF, and provide a still fallback for reduced motion.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert no `.gif` is used for motion; assert `<video autoplay>` also carries `muted`, `loop` and `playsinline` (without `muted` and `playsinline`, iOS refuses to autoplay).

**X12. Be careful with large `blur()` and `backdrop-filter` values, which are expensive.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** collect computed `backdrop-filter` and `filter` blur radii; flag values above a threshold and count how many such layers composite at once. **Directly relevant here:** this site uses `backdrop-filter: blur(26px) saturate(1.15)` and `blur(20px) saturate(1.2)` on card surfaces over a fixed full-screen photograph. That is the most expensive compositing pattern on the page, it is repeated per card, and it is a plausible INP and scroll-jank source on mid-range mobile. Worth measuring rather than assuming.

**X13. Profile with CPU and network throttling, and test iOS Low Power Mode and macOS Safari.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**X14. Track and minimise re-renders.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

**X15. Batch DOM reads and writes to avoid forced synchronous layout.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines

---

## 12. Accessibility beyond contrast

**A1. Make everything operable by keyboard, following the WAI-ARIA Authoring Practices pattern for each widget.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines; W3C WAI-ARIA APG, https://www.w3.org/WAI/ARIA/apg/
**Check:** a script can tab through the page and assert every interactive element is reachable and activatable by Enter/Space. It cannot verify the full APG pattern for a complex widget.

**A2. Never remove the focus outline without providing a visible replacement.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; MDN `:focus-visible`, https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
**Check:** grep authored CSS for `outline: none`/`outline: 0` and assert a `:focus-visible` rule exists for the same selector. Then verify empirically: focus each element via keyboard and diff a screenshot of the element's bounding box against its unfocused state; assert the pixels changed. The empirical version is the honest one and is not much more expensive.

**A3. Style focus with `:focus-visible` rather than `:focus`, so mouse users do not see rings they did not ask for.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
**Check:** assert focus styling rules use `:focus-visible`, with an `@supports not selector(:focus-visible)` fallback to `:focus` for old browsers.

**A4. Give the focus indicator at least the area of a 2px perimeter around the component and a 3:1 contrast change between focused and unfocused states.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.4.13 Focus Appearance, **Level AAA**, https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
**Check:** the normative requirement is that the indicator is at least as large as a **2 CSS pixel thick perimeter of the unfocused component**, and has **at least 3:1 contrast between the same pixels in the focused and unfocused states**. W3C gives the perimeter formulas: rectangle `4h + 4w`; circle `4πr`; rounded rectangle `4h + 4w - (16 - 4π)r`. **Honest status: this is AAA, not AA.** The AA requirement is only SC 2.4.7 Focus Visible (some visible indicator exists). Adopt the AAA numbers anyway; they are what make a focus ring actually usable.

**A5. Use `outline` with `outline-offset` for focus rings, not `box-shadow`.**
`CHECKABLE` · Source: MDN, https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
**Check:** *this rule has changed and the sources now disagree with each other by vintage.* Rauno's guidelines say to use box-shadow because outline does not respect border-radius. **That is out of date:** MDN records outline following `border-radius` as widely available since March 2022. Outline is now preferable because it does not participate in the box model and does not get clipped by `overflow: hidden` ancestors. Prefer `outline` + `outline-offset`; treat the box-shadow advice as legacy.

**A6. Keep DOM order in step with visual order so keyboard order is not surprising.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.4.3 Focus Order, Level A
**Check:** collect the tab sequence, read each element's `getBoundingClientRect()`, and assert the sequence is monotonic top-to-bottom then left-to-right within a tolerance. Flag large backward jumps. Some legitimate exceptions (modals, toolbars), so warn rather than block.

**A7. Never set a positive `tabindex`.**
`CHECKABLE` · Source: W3C WAI-ARIA APG
**Check:** assert no element has `tabindex` greater than 0. One line, zero false positives.

**A8. Provide a "Skip to content" link as the first focusable element.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; WCAG 2.2 SC 2.4.1 Bypass Blocks, Level A
**Check:** assert the first element in tab order links to the `main` landmark's id.

**A9. Never let sticky or fixed furniture entirely hide the element that has focus.**
`CHECKABLE` · Source: WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum), **Level AA**, https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
**Check:** the normative bar at AA is that the focused component is **not entirely hidden** by author-created content; the AAA variant (2.4.12) requires that **none** of it is obscured. Mechanically: tab through the page, and for each focused element call `document.elementFromPoint` at its centre and corners, asserting the hit result is the focused element or a descendant. W3C names **sticky headers/footers and cookie banners** as the classic failures. *Concretely relevant here: the site has a fixed jump rail at `z-index: 15` on the right edge and a sticky mast at `z-index: 20`.*

**A10. Prefer native semantics before reaching for ARIA.**
`PARTIAL` · Source: Vercel Labs Web Interface Guidelines
**Check:** flag `role="button"` on a `div`, `role="link"` on a `span`, and similar substitutions where the native element exists.

**A11. Mark up the page with landmarks, and give exactly one `main`.**
`CHECKABLE` · Source: W3C WAI-ARIA APG Landmark Regions, https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
**Check:** assert exactly one `main`; assert `header`/`footer` exist at body level (giving `banner` and `contentinfo`); assert every `nav` beyond the first has a unique accessible name; assert every `section` used as a `region` has a label, since **`region` must have a label** to be exposed as a landmark. Do not include the role word in the label ("Site Navigation Navigation" is wrong).

**A12. Keep headings hierarchical with exactly one `h1` and no skipped levels.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; WCAG 2.2 SC 1.3.1 Info and Relationships, Level A
**Check:** collect all `h1`-`h6` in DOM order; assert exactly one `h1` and that no step increases by more than one level. *The repo has `verify_page_has_h1.ts`; the no-skipped-levels half is missing and is a one-line addition.*

**A13. Give every icon-only interactive element an explicit `aria-label`.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me ; Vercel Labs Web Interface Guidelines
**Check:** assert every `button`/`a` with no text content resolves to a non-empty accessible name. *Covered at source level by `a11y_static_audit.ts`, which is not in prebuild.*

**A14. Give every image an `alt`, using `alt=""` for decorative images rather than omitting the attribute.**
`CHECKABLE` · Source: WCAG 2.2 SC 1.1.1 Non-text Content, Level A; `a11y_static_audit.ts` rationale
**Check:** assert the attribute is *present* on every `<img>`, empty or not. A missing `alt` makes screen readers announce the filename.

**A15. Render images with `<img>` rather than CSS backgrounds where the image carries meaning.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** flag large `background-image` elements that carry no text and have no accessible name. The fixed decorative photograph is correctly *excluded* from this, since it is decoration and is already `aria-hidden` by virtue of being a `pointer-events: none` background layer.

**A16. Hide decorative elements from assistive technology with `aria-hidden`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert purely decorative SVGs and glyph spans carry `aria-hidden="true"` and contain no focusable descendants (an `aria-hidden` ancestor over a focusable element is itself a defect, and axe flags it).

**A17. Give HTML-built illustrations a single `aria-label` instead of exposing their raw DOM tree.**
`CHECKABLE` · Source: Web Interface Guidelines, https://interfaces.rauno.me
**Check:** for chart and diagram containers with many descendants and no accessible name, flag. See V-section for the charting-specific version.

**A18. Announce dynamic status changes through a live region that already exists in the DOM.**
`CHECKABLE` · Source: MDN, ARIA Live Regions, https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions
**Check:** the critical implementation rule is that **the live region must be present in the DOM before the content is inserted**; injecting a `div[aria-live]` together with its message does not announce (the sole exception is `role="alert"`, which has special handling). Mechanically: assert a persistent `[aria-live]` or `role="status"` container exists in the initial HTML. Use `polite` for search results, filter counts and inline validation; reserve `assertive` for genuinely time-critical errors, because it interrupts. `aria-atomic="true"` makes the whole region re-read, which is what you want for a figure that changes. Roles with implicit live behavior: `status` (polite), `alert` (assertive), `log` (polite), `timer` (off), `marquee` (off).

**A19. Use polite live regions for toasts and inline validation.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert toast containers carry `aria-live="polite"` or `role="status"`.

**A20. Set the document language, and mark up any passage in another language.**
`CHECKABLE` · Source: WCAG 2.2 SC 3.1.1 Language of Page, Level A
**Check:** assert `<html lang>` is present and valid.

**A21. Mark brand names, code tokens and identifiers with `translate="no"`.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** assert brand strings in the rendered DOM sit inside `[translate="no"]`. Prevents machine translation garbling figures and place names.

**A22. Format dates, times and numbers with `Intl.DateTimeFormat` and `Intl.NumberFormat` rather than hand-rolling.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** source-level scan for manual number formatting (`toFixed` followed by string concatenation of separators, hand-written month arrays).

**A23. Bind units to their numbers with non-breaking spaces so a figure never wraps away from its unit.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** scan rendered text for a digit followed by a normal space followed by a unit token (`%`, `km`, `m²`, currency codes, `MB`); assert ` ` instead. Cheap, and it matters a lot on a site whose whole product is figures.

**A24. Use the ellipsis character rather than three periods.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines
**Check:** grep rendered text for `...`; assert `…`.

**A25. Give media captions, transcripts or descriptions as applicable, and keep controls keyboard-operable.**
`JUDGMENT` · Source: Vercel Labs Web Interface Guidelines

**A26. Manage focus on dialogs: trap it inside, move it in on open, and return it to the trigger on close.**
`CHECKABLE` · Source: Vercel Labs Web Interface Guidelines; W3C WAI-ARIA APG dialog pattern
**Check:** open a dialog, tab past its last element, assert focus wraps to the first; close it, assert `document.activeElement` is the trigger.

---

## THE 25 THAT MATTER MOST HERE

Ranked for **this** site: a text-and-number-heavy editorial data atlas, with a fixed full-screen background photograph behind translucent cards, whose primary content is figures the reader must trust.

The ranking logic is: anything that damages **trust in a figure** ranks above anything that damages polish; anything that breaks on a **real device or a real assistive technology** ranks above anything that only offends taste; and the signature visual device (translucent cards over a photograph) is treated as the site's largest single source of technical risk, because it is the thing that is hardest to get right and easiest to regress.

| # | Rule | ID | Why it ranks here |
|---|---|---|---|
| 1 | **Never present a number alone; give the comparison that makes it mean something.** | D25 | The product is benchmarks. A figure with no peer, no median and no prior period is not a benchmark, it is trivia. NN/g states it flatly and it is the one rule whose violation destroys the reason the site exists. |
| 2 | **Compute contrast against the composited background, not the nominal token.** | C4 | `--card` is `rgba(255,255,255,.955)` over a fixed photograph, with a `mix-blend-mode: multiply` noise layer at 50% opacity on top. The existing token gate measures against an assumed opaque card and therefore measures a surface that never actually renders. This is a live blind spot, not a hypothetical. |
| 3 | **Apply `tabular-nums` to every number in a column or a slot that can change.** | T5 | Right-aligned columns of figures that do not align digit-for-digit read as sloppy, and sloppy reads as untrustworthy. It is one CSS property and it is the cheapest credibility win available. |
| 4 | **Verify every page at 320, 390, 768, 1024, 1440 and one ultra-wide width.** | R1 | The brief names this failure mode explicitly, and the repo currently checks two widths. 320 is the width WCAG reflow is actually specified at (equivalent to 1280 at 400% zoom) and it is the one missing. |
| 5 | **Present content without two-dimensional scrolling at 320 CSS pixels.** | R2 | Level AA, and the single most common real-world conformance failure on card-and-table layouts. |
| 6 | **Give every pointer target at least 24 by 24 CSS pixels, or satisfy the 24px-circle spacing exception.** | P1, P2 | Level AA in WCAG 2.2 and nothing in the repo measures it. Dense editorial pages with inline source links and jump rails are exactly where this fails. |
| 7 | **Never let sticky or fixed furniture entirely hide the focused element.** | A9 | Level AA. This site has a fixed jump rail at `z-index: 15` and a sticky mast at `z-index: 20`. Two fixed layers over a scrolling page is the textbook 2.4.11 failure. |
| 8 | **Keep body text at 4.5:1 and large text at 3:1, unrounded.** | C1, C2 | The floor. Worth restating because the local ban on bold display type removes the 18.5px-bold route to the 3:1 tier, so the effective large-text threshold here is 24px and everything below it owes 4.5:1. |
| 9 | **Reserve space for every image, chart and late block so nothing shifts.** | X4 | An image-and-chart-heavy page is precisely the CLS profile web.dev describes. A figure that jumps while the reader is reading it is a trust defect, not just a metric. |
| 10 | **Assume 20 to 28 percent of words are read; design headings to carry the meaning.** | T27, T28, T29 | 79% scan, 16% read word by word; users read half the information only on pages of 111 words or fewer. This is the empirical basis for the standing local instruction to cut text by half, and it is the strongest evidence in the document. |
| 11 | **Front-load every heading and link; readers see about 11 characters.** | T30 | Directly actionable, mechanically lintable, and it converts the layer-cake finding into an edit you can make today. |
| 12 | **Keep the primary answer figure above the fold at every device size.** | D26 | The 84% above/below difference and the 102% fixation drop across the fold are large enough to outrank most layout preferences. |
| 13 | **Start every bar and column chart at zero.** | V8 | The only chart rule with zero dissent across four independent sources, and the violation is straightforwardly deceptive on a site whose charts are the evidence. |
| 14 | **Share one scale and one panel size across all small multiples.** | V37 | Readers assume a shared axis. Per-panel scales silently manufacture false conclusions, which is the worst possible failure for this site. |
| 15 | **Label chart data directly rather than with a legend.** | V16 | Five independent sources agree. It also removes the colour-matching step that colourblind readers cannot perform. |
| 16 | **Never encode meaning by colour alone.** | C5, V26 | Level A. Up to 4.5% of the population, about 8% of men. On a site where a colour often means "good margin" or "bad margin", colour-only encoding is a correctness bug. |
| 17 | **Cap categorical chart colours at 6, hard-fail at 8; use one hue at varying lightness for ordered data.** | V22, V25 | The "one hue, varying intensity" convention is the right default for good-versus-bad because it survives greyscale and colourblind viewing. The count ceiling is where sources disagree, so the local number has to be declared rather than assumed. |
| 18 | **Right-align numeric columns AND give them tabular figures; the two only work together.** | D7 | Half the rule is useless without the other half, and the popular version of this rule is misattributed to NN/g, so it is worth stating correctly. |
| 19 | **Freeze table header rows and the identifier column on any table taller or wider than the screen.** | D8 | The reader loses the meaning of a cell the moment the header scrolls away, which on a numbers site means they lose the figure entirely. |
| 20 | **Honor `prefers-reduced-motion`, and animate only `transform` and `opacity`.** | M1, M3, M4 | Cheap, mechanical, and it protects both the vestibular case and the INP budget. `transition: all` is a one-line grep. |
| 21 | **Measure and budget `backdrop-filter` cost.** | X12 | `blur(26px) saturate(1.15)` repeated per card over a fixed full-screen photograph is the most expensive compositing pattern on the page. It is the signature look, so the answer is to measure it and set a budget, not to remove it. |
| 22 | **Survive 200% text resize and the WCAG text-spacing overrides without clipping.** | R4, R5 | Card layouts with fixed heights fail both, and a width-only responsive pass will never catch either. Both are Level AA. |
| 23 | **Hold body measure between 45 and 75 characters and line-height at 1.5.** | T3, T4 | Long-form editorial prose is half the product. 1.5 is the only line-height value every source accepts. |
| 24 | **Keep one `h1`, no skipped heading levels, and real landmarks.** | A11, A12 | The repo checks h1 presence but not hierarchy. Heading structure is how both screen-reader users and search engines read a long editorial page, so it pays twice. |
| 25 | **Do not use infinite scroll for tabular or list data.** | D17 | NN/g's documented failures include crawlers missing below-fold content, which on an SEO-growth site is a direct commercial cost on top of the accessibility one. |

**Deliberately ranked lower than you might expect, with reasons:** the 16px minimum body size (T2) is a real product decision but has no standards backing, so it belongs in the design system rather than near the top of a conformance-weighted list. Optical alignment (L3) and hue-tinted shadows (C12) are genuine craft rules that no gate should ever adjudicate. APCA (C7) is better science than WCAG 2 but is not normative, so it cannot be the conformance target yet.

---

## PROPOSED NEW GATES

Eight candidates for the prebuild or pre-ship gate chain, chosen to **not duplicate what already exists**. For reference, the repo already covers: token contrast against an assumed card surface (`verify_token_contrast.mjs`), ink-level overflow and edge padding at 1440 and 390 (`audit_overflow.mjs`), dead links, empty targets, accent inflation, hierarchy inversion, void space, copy length, figure and glyph repetition (`design_linter.mjs`), plus h1 presence, typography consistency, hardcoded hex, bar budget and no-bold-display. There is also a source-level a11y scan (`a11y_static_audit.ts`) covering missing `alt`, icon-only labels, vague link text and unlabelled inputs, which is **written but not wired into prebuild**; wiring it in is the cheapest single accessibility win available and is assumed as prerequisite work rather than counted as one of the eight.

Each gate below is honest about cost. "Cheap" means it runs in the existing static or Playwright pass with no new infrastructure. "Expensive" means it needs pixel capture, a new dependency, or per-page tuning.

---

### G1. Composited contrast over the background photograph
**Cost: EXPENSIVE. Value: highest.**

- **Rule:** C1, C2, C4. Every text run meets 4.5:1 (or 3:1 if at least 24px) against the pixels actually rendered behind it.
- **What it measures:** screenshot each route at each test width, then for every text node take its bounding box, sample the rendered background pixels immediately around and behind the glyphs (excluding the glyph pixels themselves), take the **worst** sampled pixel, and compute the WCAG 2 contrast ratio against the computed `color`.
- **Failure condition:** worst-pixel ratio below 4.5 for normal text or below 3.0 for text at 24px or larger. No rounding, per W3C.
- **Why it is needed:** the existing token gate compares tokens against an assumed opaque card. The real surface is `rgba(255,255,255,.955)` over a photograph, further multiplied by a 50%-opacity noise layer. The nominal white is never what renders, and the delta varies with the photograph, which changes per page. This is the only gate here that catches a defect the current chain structurally cannot see.
- **False-positive risk: MODERATE.** Anti-aliased glyph edges and the grain texture both produce outlier pixels; sampling the raw worst pixel will flag text that is perfectly legible. Mitigations: sample a percentile (say the 5th percentile of luminance in the box) rather than the absolute worst; exclude pixels within 1px of a glyph edge; and allowlist the decorative photo band where no text should be. Expect a tuning period before it can block rather than warn.
- **Honest caveat:** requires screenshot capture and pixel maths, which is the heaviest thing in this list. Run it in CI and before a ship, not on every build, exactly as `verify_rendered_design.mjs` already does.

---

### G2. Target size and spacing
**Cost: MEDIUM. Value: high.**

- **Rule:** P1, P2, P3, P6, P7.
- **What it measures:** enumerate every focusable element and every element with a click handler. For each, hit-test with `document.elementFromPoint` at the centre and at the four corners of its rect to establish the true hit area (not just the visual rect). Then apply the WCAG 2.5.8 test: at least 24x24, or a 24px-diameter circle centred on the bounding box that intersects no other target's rect or circle.
- **Failure condition:** any target under 24x24 that also fails the spacing exception and is not inline in a sentence. At mobile widths, warn below 44px (Apple) as a separate, non-blocking tier.
- **False-positive risk: MODERATE.** The **inline exception** is the big one: citation markers, footnote links and links inside body prose are legitimately exempt because their size is constrained by the surrounding line-height. The gate must detect "is this target inside a paragraph of running text" and skip it, or it will produce dozens of false failures on every editorial page. Also, `elementFromPoint` returns the topmost element, so a decorative overlay that forgot `pointer-events: none` will make every target under it look unreachable, which is arguably a true positive dressed as a false one.

---

### G3. Tabular figures on numeric columns
**Cost: CHEAP. Value: high.**

- **Rule:** T5, T6, D7, T11.
- **What it measures:** find elements whose text content matches a numeric pattern and which sit in a repeated row structure (a `<td>`, or an element occupying the same grid or flex column position across sibling rows). Assert computed `font-variant-numeric` includes `tabular-nums`. Second assertion: within one column, the count of decimal places is uniform. Third: no `font-feature-settings: "tnum"` where the high-level property should be used.
- **Failure condition:** a numeric column without tabular figures, or a column mixing zero-decimal and two-decimal values.
- **False-positive risk: LOW.** The main risk is a "numeric" string that is actually a year, a rank or an identifier, where proportional figures are fine, and a column mixing text and numbers. Both are handled by requiring the whole column to be numeric before asserting. Detecting "same column across rows" in a CSS grid is slightly fiddly but tractable via `getBoundingClientRect().left` clustering.
- **Why it is worth doing:** it is one CSS property, it is invisible until it is wrong, and it is directly load-bearing for the product's credibility.

---

### G4. Multi-width reflow, zoom and text-spacing survival
**Cost: CHEAP (reuses the existing harness). Value: high.**

- **Rule:** R1, R2, R4, R5, L4.
- **What it measures:** extend the existing overflow pass from two widths to the full set (320, 390, 768, 1024, 1440, plus one ultra-wide), and add two extra passes at 1440: one with the root font size doubled (the 200% resize proxy for SC 1.4.4), and one with the SC 1.4.12 override stylesheet injected (`line-height: 1.5`, paragraph `margin-bottom: 2em`, `letter-spacing: 0.12em`, `word-spacing: 0.16em`). Re-run the existing BREACH and FLUSH assertions in each.
- **Failure condition:** any horizontal document scroll at 320px; any new BREACH under the zoom or spacing passes; any element whose `scrollHeight` exceeds `clientHeight` on a container with `overflow: hidden` (silent clipping).
- **False-positive risk: LOW at 320px, MODERATE under the spacing override.** Deliberate horizontal scrollers (`.scroll-x` around data tables, which WCAG explicitly exempts) must stay whitelisted, and that whitelist already exists. The spacing override legitimately breaks some tightly designed components in ways that are not worth fixing, so start it as a warn tier.
- **Why it is worth doing:** it directly closes the failure mode the brief names, it reuses infrastructure that already exists, and it converts two Level AA criteria from "believed fine" to "measured".

---

### G5. Layout-shift reserve
**Cost: CHEAP. Value: high.**

- **Rule:** X3, X4, X5, I4, T21.
- **What it measures:** three static assertions plus one dynamic. Static: every `<img>` has both `width` and `height` attributes or a computed `aspect-ratio`; every chart or map container has a reserved height before data arrives; every `@font-face` sets `font-display` and has a metric-matched fallback. Dynamic: attach a `PerformanceObserver` for `layout-shift` entries during a scripted load-and-scroll, and sum the session value.
- **Failure condition:** any dimensionless image; any chart container that grows on data arrival; observed CLS above 0.1.
- **False-positive risk: LOW for the static half, MODERATE for the dynamic half.** The static assertions are close to binary. The dynamic measurement is noisier: a local dev server with a warm cache produces different shift behaviour from production, and the scripted scroll must be deterministic or the number wanders run to run. Recommendation: block on the static assertions, ratchet on the observed number.
- **Note:** lazy-loading an above-the-fold image is worth a separate assertion in the same gate. It is a common mistake, it directly harms LCP, and it is a one-line check.

---

### G6. Focus visibility and obstruction
**Cost: MEDIUM. Value: high.**

- **Rule:** A2, A3, A4, A6, A7, A9, L14.
- **What it measures:** tab through the full focus order. At each stop: (a) capture the element's bounding box before and after focus and assert the pixels changed, which is the empirical version of "a visible focus indicator exists" and is far more honest than grepping for `outline: none`; (b) call `document.elementFromPoint` at the focused element's centre and corners and assert the hit result is the element or a descendant, which is the SC 2.4.11 test; (c) assert no element carries a positive `tabindex`; (d) assert the tab sequence is broadly monotonic in reading order.
- **Failure condition:** an element whose focused and unfocused renders are pixel-identical; a focused element entirely covered by another; any positive `tabindex`.
- **False-positive risk: LOW to MODERATE.** The positive-`tabindex` and obstruction checks are near-deterministic. The pixel-diff check can false-negative on a focus ring drawn outside the captured box, so capture a box inflated by a few pixels. The reading-order check has legitimate exceptions (modals, toolbars, the jump rail) and should warn rather than block.
- **Why it is needed:** nothing in the repo currently checks focus at all, and the site has two fixed layers that are exactly the SC 2.4.11 failure pattern W3C names.

---

### G7. Motion hygiene
**Cost: CHEAP. Value: medium-high.**

- **Rule:** M1, M2, M3, M4, M7, M9, M12.
- **What it measures:** mostly static CSS parsing, plus one emulated pass. Static: grep the built CSS for `transition-property: all` or a `transition` shorthand resolving to `all`; parse `transition-property` lists and `@keyframes` bodies for layout properties (`top`, `left`, `width`, `height`, `margin`, `padding`); parse `:active` rules for `transform: scale(n)` with n below 0.9; find `animation-iteration-count: infinite` on anything over 5s without a pause control. Emulated: relaunch with `prefers-reduced-motion: reduce` and assert computed animation and transition durations collapse to 0s. Plus: force `:hover` and assert `font-weight` does not change.
- **Failure condition:** any `transition: all`; any animated layout property; any animation still running under reduced motion.
- **False-positive risk: VERY LOW.** These are close to pure syntax checks. The only real judgement call is which durations count as "interaction" for the 200ms rule (M2), so leave M2 out of the blocking tier and keep it as a report.
- **Why it is worth doing:** it is the cheapest gate in this list, it enforces a genuine performance property, and `transition: all` in particular is the kind of thing that reappears every time someone adds a component.

---

### G8. Every headline figure carries its context
**Cost: MEDIUM. Value: highest for this product specifically.**

- **Rule:** D25, D26, T10, T11.
- **What it measures:** for each component the design registry classifies as a headline or answer figure, assert the rendered output contains at least one of: a peer or comparison value, a national or regional median, a prior-period value, or a rank-within-set. Additionally assert the figure's unit is bound with a non-breaking space, and that the figure's bounding box intersects the initial viewport at 390, 768 and 1440.
- **Failure condition:** a headline figure rendering a bare number with no comparator; a figure whose unit can wrap away from it; a primary answer figure below the fold.
- **False-positive risk: MODERATE, and it depends entirely on how well figures are typed in the data model.** If headline figures are already a declared component type with declared slots, this is close to a schema assertion and is cheap and reliable. If they are hand-composed in JSX per page, the gate has to infer "is this a headline figure" from DOM heuristics (largest numeral on the page, inside a hero card), and inference will misfire. **Be honest about the dependency:** this gate is only worth building if the figure components are typed. If they are not, the higher-value work is typing them, and the gate follows for free.
- **Why it ranks highest on value:** it is the only gate here that checks the thing the site is actually selling. Every other gate protects legibility, conformance or performance. This one protects whether a number means anything.

---

### Gate summary

| Gate | Cost | FP risk | Blocks or warns | Closes a gap the current chain cannot see |
|---|---|---|---|---|
| G1 Composited contrast | Expensive | Moderate | Warn, then block after tuning | **Yes** |
| G2 Target size | Medium | Moderate | Block with inline exemption | **Yes** |
| G3 Tabular figures | Cheap | Low | Block | **Yes** |
| G4 Reflow, zoom, spacing | Cheap | Low to moderate | Block at 320, warn on spacing | Partly (extends existing) |
| G5 Layout-shift reserve | Cheap | Low static, moderate dynamic | Block static, ratchet dynamic | **Yes** |
| G6 Focus visibility | Medium | Low to moderate | Block on obstruction and tabindex | **Yes** |
| G7 Motion hygiene | Cheap | Very low | Block | **Yes** |
| G8 Figure context | Medium | Moderate, model-dependent | Block if figures are typed | **Yes** |

**If only three can be built:** G7 (cheapest, near-zero false positives), G3 (cheap, directly protects credibility), G4 (cheap, reuses existing infrastructure, closes two Level AA criteria). **If only one:** G1, because it is the only one addressing a defect that is structurally invisible to everything currently in the chain, and it guards the site's signature visual device.

---

## Appendix: where the sources genuinely disagree

Collected so that nobody has to rediscover these, and so that no rule in this document is presented as more settled than it is.

1. **Minimum font size.** WCAG: **none at any level**, only 200% resizability. Apple: **11pt** floor. Material 3: **11sp** floor, 14sp body. Butterick: **15px** floor for web body. The common "16px" figure is the **browser default**, not a published minimum, and the common "12px absolute floor" has no authoritative source at all. The platform floors are roughly half the web convention. Anyone claiming a single industry minimum is wrong. *Separately and unrelatedly, 16px on form inputs is a real hard threshold, because iOS Safari auto-zooms below it.*

2. **Optimal measure.** Bringhurst 45 to 75 (ideal 66); Butterick 45 to 90; Baymard 50 to 75; WCAG AAA caps at 80; Smashing says 45 to 85 for web. **No two sources agree on both endpoints.** Butterick's upper bound exceeds the only standards-backed number in the set.

3. **Body line-height.** Butterick recommends 1.20 to 1.45; WCAG 1.4.8 (AAA) and MDN's accessibility note require 1.5. **Butterick's entire range falls below the accessibility floor.** 1.5 is the only value satisfying every source.

4. **Zero baseline on line charts.** Storytelling with Data and Datawrapper say not required (slope encoding); Chad Skelton says required by default; Correll, Bertini and Franconeri (CHI 2020) find truncation inflates perceived effect across chart types **and that explicit broken-axis cues do not fix it**, then decline to issue a rule. Bar charts are the only case where everyone agrees.

5. **Maximum categorical colours.** UK Government Analysis Function: 4. Editorial practice per Datawrapper's survey: 5 to 6. Urban Institute: 8. ColorBrewer: 12, but that is a tool ceiling, not a recommendation. Nobody defends more than 8 for reader discrimination.

6. **Axis titles.** Datawrapper omits them by default and pushes the unit into the title or ticks; the EU guide treats an unlabelled axis as unreadable. Both agree the unit must be stated somewhere obvious, so enforce that rather than the placement.

7. **Focus rings: `outline` or `box-shadow`.** Rauno's guidelines say box-shadow, because outline did not respect `border-radius`. **That advice is now out of date:** MDN records outline following `border-radius` as widely available since March 2022, and outline has the advantage of staying outside the box model and not being clipped by `overflow: hidden` ancestors. Prefer `outline` plus `outline-offset`.

8. **APCA versus WCAG 2 contrast.** Vercel's guidelines say prefer APCA. APCA is perceptually uniform and genuinely better on dark backgrounds, where WCAG 2 overstates contrast. But **APCA is not normative in WCAG 2.2**; it is a WCAG 3.0 candidate. Conform to WCAG 2.2 AA and use APCA as the tiebreaker.

9. **Viewport units in fluid type.** Utopia and Smashing ship `vw` inside `clamp()` with a `rem` term as mitigation. Adrian Roselli says avoid viewport units for text entirely. **WCAG Technique F94 documents viewport-unit-only text sizing as a failure**, which settles the extreme case but not the mitigated one. CSS-Tricks' fluid typography article raises no accessibility caveat at all, which is a gap in that source rather than a resolved dispute.

10. **Data-ink minimalism.** Dominant but empirically contested: InfoVis Wiki records Inbar et al. (2007), in which 87 students preferred embellished charts to Tufte-minimal ones, and notes that stripping borders can conceal a misleading scale.

11. **All-caps legibility.** WebAIM warns against long all-caps passages. NN/g's glanceable-reading study found uppercase **outperformed** lowercase, with lowercase taking 26% more time. The contradiction resolves by context: glancing versus sustained reading. Do not generalise the NN/g result to body copy.

12. **`font-display` timings.** MDN describes the block and swap periods only qualitatively and notes Firefox exposes them as tunable preferences; web.dev gives concrete numbers. **The spec does not mandate exact durations.** Do not treat 3s as normative.

13. **`text-wrap: balance` line caps.** Chromium balances up to 6 lines, Firefox up to 10. The same heading balances in one engine and not the other.

### Sources that could not be verified

Stated so that nothing here rests on an unfetched claim.

- **Apple HIG** and **Material Design 3** are JavaScript-rendered and return title-only to a fetcher. Apple's 44x44pt and 11pt figures were taken from Apple's own **UI Design Dos and Don'ts** page (https://developer.apple.com/design/tips/), which is static. Material's 48dp target and type scale were taken from Google's Android accessibility documentation (https://support.google.com/accessibility/android/answer/7101858) and from Flutter's published implementation of the M3 2021 token table (https://api.flutter.dev/flutter/material/TextTheme-class.html). Both substitutions are flagged rather than passed off as primary.
- **Material Design 3's data visualization accessibility guidance** could not be retrieved, so nothing in section 9 is attributed to it.
- **The FT Visual Vocabulary** live page is JS-rendered; the taxonomy was taken from the FT's own GitHub source of record (https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary).
- **No NN/g article states a characters-per-line number.** Claims that "NN/g recommends 50 to 70 CPL" trace to secondary blogs. Treat that attribution as unsourced.
- **NN/g gives no pixel values** for table column width, row height or density, and **no explicit right-align-numbers rule**. The widely circulated version of that rule is misattributed.
- **No source prescribes how many steps a modular type scale should have.** Any such rule is unsourced.
- **The negative letter-spacing figure for large display type** (about -0.01em to -0.03em) appears only in design blogs that cite nothing. Flagged as convention.
