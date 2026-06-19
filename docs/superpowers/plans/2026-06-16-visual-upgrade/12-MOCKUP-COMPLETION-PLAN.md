# 12 , Mockup completion plan (enrich all 6 HTML mockups to full, correct, consistent)

> Execution target = the standalone HTML mockups at E:/atlas/*.html (no app). Complete every locked section, fix the graphics bugs (esp. the country radar), apply the rendering standards uniformly. Read 00 (design law) + 01 (component/chart system) first.

## Rendering standards (all pages)

These standards govern how every page-type mockup (`home`, `country-uk`, `city-london`, `cell-london-restaurants`, `industry-restaurants`, `neighbourhood-west-end`) is rendered to its full locked section set. The reference implementation is `E:/atlas/cell-london-restaurants.html`; the design law is `00-ideology-and-design-law.md`; the token map and chart grammar are `01-component-and-chart-system.md`. Where the reference and a spec disagree on a token value, the reference file wins (it is the built, founder-facing artifact). Every page must survive the four QA questions in §00.2 (answer-first, not-cringe, typography-works, can-it-be-quieter) before it is called done.

---

### 1. The locked visual system

#### 1.1 The `:root` warm token map (paste verbatim into every page)
Every page declares this identical block. No raw hex, px, ms, or font-name appears anywhere below `:root`. One accent (terracotta). Moss = kept/positive only. Amber = caution only. Neutrals (cream/ink/cocoa) carry the mass.

```css
:root{
  /* paper + neutral mass */
  --cream-50:#ffffff; --cream-75:#fbfaf7; --cream-100:#f7f6f4; --cream-200:#efeeeb;
  --cream-300:#e4e2dd; --cream-400:#c3bfb7;
  /* ink text ladder (warm near-black) */
  --ink-500:#7d6c58; --ink-600:#5d4d3b; --ink-700:#463726; --ink-800:#2c2015; --ink-900:#211810;
  /* THE one loud accent */
  --atlas-50:#fff1ee; --atlas-300:#fb8469; --atlas-500:#e62200; --atlas-600:#c11c00; --atlas-700:#991600;
  /* muted neutral data */
  --cocoa-300:#c3b39c; --cocoa-500:#87745d;
  /* kept / positive ONLY */
  --moss-300:#bcd96a; --moss-600:#5c781e; --moss-700:#4a6018;
  /* caution ONLY */
  --amber-300:#f5bd5c; --amber-600:#b06a08;
  /* destructive (rare) */
  --clay-700:#5c1813;
  --shadow-card:0 1px 2px rgb(33 24 16 / .04), 0 14px 30px -18px rgb(33 24 16 / .20);
  --shadow-subtle:0 1px 2px rgb(33 24 16 / .05), 0 2px 6px rgb(33 24 16 / .04);
}
```

Chart-role aliases (use these names in chart code so SVG fills map to roles, never to literal colors): subject/spotlight = `--atlas-500`; kept/positive = `--moss-600`; cost-mass = `--cocoa-500` then `--cocoa-300`; tertiary cost = `--ink-700`; "everything else" = `--cream-400`; caution = `--amber-600`/`--amber-300`; track/ground = `--cream-300`/`--cream-200`.

#### 1.2 Type scale (and Newsreader vs Inter)
Two families, loaded by one Google Fonts link: `Inter` (400/500/600/700) for body, labels, UI, and all data values; `Newsreader` (opsz 6..72, 400/500/600) for display only. `font-smoothing:antialiased` + `text-rendering:optimizeLegibility` on `html`.

| Token / class | Family | Size | Weight | Use |
| --- | --- | --- | --- | --- |
| Hero number | Newsreader | `clamp(56px,9vw,92px)`, lh .92 | 500 | the ONE hero figure (`--atlas-700`) |
| Page H1 | Newsreader | `clamp(30px,4.2vw,46px)`, lh 1.08, ls -.015em | 500 | masthead headline, max 18ch |
| Section H2 (`.h`) | Newsreader | `clamp(26px,3.2vw,36px)`, lh 1.12, ls -.01em | 500 | every section heading |
| Big stat (in-section) | Newsreader | 28-30px | 500 | tile `dd`, unit `.big`, legend `dd`, take-home |
| Lead paragraph | Inter | 18px, lh ~1.5 | 400 | section intro under H2 (`--ink-600`, max 60ch) |
| Narrative body | Inter | 18px, lh 1.7 | 400 | prose (`--ink-600`, max 62ch) |
| Eyebrow | Inter | 12px, ls .16em, uppercase | 700 | `--atlas-700`, above every H2 |
| Body / table | Inter | 14-15px | 400-500 | rows, notes, captions |
| Micro-label | Inter | 11-13px | 400-600 | axis ticks, ring labels, chips |

Ratio rule: adjacent steps differ by >= 1.25. Newsreader is reserved for the page headline, section headings, and numbers that are themselves the answer (hero, tile values, take-home, legend amounts). Everything functional is Inter. Never set a number in Newsreader inside a dense table row; tabular Inter reads cleaner there.

#### 1.3 Tabular figures (mandatory on every number)
`.num{ font-variant-numeric:tabular-nums lining-nums }`. Apply `.num` to every digit string: hero, ticks, tiles, legend amounts, wages, percentages, counts, axis labels. Columns of numbers must align on the decimal; ticks under a track must sit at their true proportional x. A number without `.num` is a bug.

#### 1.4 Spacing + section rhythm
- Page container: `.wrap{ max-width:1080px; margin:0 auto; padding:0 24px }`; prose container `.narrow{ max-width:680px }`.
- Section frame: `section.block{ padding:52px 0 }` with `section.block + section.block{ border-top:1px solid var(--cream-300) }`. The hairline between sections is the ONLY divider; no boxes-within-boxes.
- Rhythm varies on purpose: masthead is the heavy top (gradient ground, big padding `30px 24px 60px`); prose/narrative sections are airy and narrow; chart sections give the graphic room (`margin-top:24-30px` under the lead). Never run three identical card-grids back to back; alternate full-bleed chart, narrow prose, tile row.
- Vertical inside a section: eyebrow -> 10px -> H2 -> 14px lead -> 24-30px graphic. Cards: radius 14-18px, padding 16-28px, `--shadow-subtle` for tiles, `--shadow-card` for the one hero/interactive card per page.

#### 1.5 The section-frame + eyebrow + heading pattern (every section, identically)
```html
<section class="block"><div class="wrap">
  <div class="lead">
    <p class="eyebrow">SECTION KICKER</p>
    <h2 class="h" style="margin-top:10px">The plain-language heading</h2>
    <p>Optional one-line lead, max 60ch, ink-600.</p>   <!-- omit if the graphic speaks -->
  </div>
  <!-- graphic / content, margin-top:24-30px -->
</div></section>
```
Eyebrow is the category (2-4 words, uppercase, terracotta). H2 is a plain human sentence, not a label. This pattern is invariant across all six pages so the eye learns one rhythm.

#### 1.6 The one-accent rule (enforced)
Terracotta (`--atlas-500/600/700`) is the only saturated color on the page and marks exactly one thing per graphic: the subject, the typical marker, the kept sliver, the emphasized node. If two things are terracotta in one chart, one is wrong. Moss appears only where the meaning is literally "kept/positive" (owner-keeps segment, kept bar, break-even node). Amber appears only for caution (below-break-even fill, watch-level severity). Everything else is cream/ink/cocoa. Gradients are allowed only as the single area fill (terracotta, low opacity) and the masthead ground (`atlas-50 -> cream-75`); no gradient text, no glassmorphism.

#### 1.7 Responsive (the two test widths: 1280 and 375)
- Sticky header collapses its center nav under 820px (`.nav{display:none}`); the dark CTA stays.
- Grids step down at named breakpoints, never with raw values: tiles 3->2 at 560px; legend 5->3 at 760px ->2 at 480px; units/reltiles ->1 at 680px; timeline 4->2 at 680px.
- Every `grid-template-columns:Npx 1fr Mpx` data row (calc, wage, driver, risk, lfl) collapses to `1fr` with left-aligned values under its breakpoint, so nothing clips at 375.
- Hard rule: at 375px there is NO horizontal scroll and no number is clipped. SVG charts use `width:100%` + a fixed `viewBox` so they scale; `preserveAspectRatio="none"` only on the seasonality area (where vertical distortion is acceptable), never on the radar (which must stay circular).
- Tap targets >= 44px; visible focus ring (`--atlas-700`); WCAG AA contrast (ink-600 on cream-75 passes; never put ink-500 on a colored fill).

---

### 2. The chart grammar (one correct, reproducible recipe per statistic)

General correctness law for all charts: **compute geometry numerically, never eyeball an SVG path.** Pick a domain `[min,max]`, map every value with one explicit formula, keep one `viewBox`, and label directly on the mark (no separate legend keyed by color where a direct label fits). Each recipe below states its data shape, the build approach, and a correctness checklist.

#### 2.1 Spread / range (RangeStrip) , revenue distribution
**Data:** `{low, typical, high}` in one currency. **Approach (CSS):** a `.track` (cream-300, h10, pill); a `.span` absolute bar (cocoa-300) from `left = pct(spanStart)` width `pct(spanEnd-spanStart)`; a `.typ` marker (3px terracotta) at `left = (typical-low)/(high-low)*100%`. Ticks row shows low / typical / high at matching x. **pct formula:** `x% = (value - low) / (high - low) * 100`. **Checklist:** typical marker x equals its tick x; span never exceeds the track; three ticks read low<typical<high; one terracotta element only; `.num` on all three; legible at 375 (label row wraps above, not beside).

#### 2.2 Per-$100 split (100%-wide stacked bar) , where the money goes
**Data:** ordered `[{label, dollars}]` summing to 100. **Approach (CSS flex):** `.bar100` flex row, h60, rounded, `overflow:hidden`; each `.seg` `width:{dollars}%`; cost segments in cocoa/ink/cream ramp, the FINAL "owner keeps" segment in `--moss-600` with the dollar value printed inside it (white). A 5-up `.legend` below maps dot->label->amount; the "kept" legend row is bold ink-900. **Checklist:** segment widths sum to exactly 100 (verify arithmetically); only the kept segment is moss, only it carries an inline value; legend order matches bar order; never a pie (banned); at 375 legend reflows to 2-up.

#### 2.3 Break-even (threshold gauge) , covering costs
**Data:** `{breakEven, typical, max}` in the same unit (e.g. covers/day). **Approach (CSS):** `.gauge .t` flex track h14; `.below` (amber-300) width `pct(breakEven)`, `.above` (moss-300) width `pct(max-breakEven)`; a `.be` tick (terracotta, tall) at `left=pct(breakEven)`; a quiet `.typ` tick (ink-700) at `left=pct(typical)`. Captions absolutely positioned at each tick x, `translateX(-50%)`, two lines (name / value). **pct:** `value/max*100`. **Checklist:** below+above widths sum to 100; the terracotta tick sits exactly at the amber/moss seam; typical tick is right of break-even (the gap is "where the owner's pay comes from"); captions don't overlap at 375 (stack or shorten).

#### 2.4 Seasonality (gradient area) , through the year
**Data:** 12 monthly index values. **Approach (static SVG):** `viewBox="0 0 720 180"`, `preserveAspectRatio="none"`, 12 points at `x = i*(720/11)` (i=0..11), `y = 180 - normalized(value)`. Two paths sharing the same point list: a fill path closed to the baseline using `url(#sg)` (terracotta vertical gradient, .28 -> .02 opacity), and a stroke-only line (terracotta, 2.5px, `stroke-linejoin:round`). Month labels in a flex row below. **y formula:** `y = padTop + (1 - (v-min)/(max-min)) * (180 - padTop - padBottom)`. **Checklist:** exactly 12 x-positions evenly spaced; fill path closes `... L720,180 L0,180 Z`; line path has no Z; peak month visibly highest; single series, single accent; no axis chrome (its sweet spot is bare).

#### 2.5 Wages (range / dumbbell rows) , pay by role
**Data:** `[{role, low, median, high}]` plus a shared scale `[scaleMin,scaleMax]` so rows are comparable. **Approach (CSS grid rows):** `150px 1fr 120px` = role / track / value. Track (cream-200, pill); `.fill` (cocoa-300) from `left=pct(low)` width `pct(high-low)`; `.med` dot (terracotta, ringed) at `left=pct(median)`. Value cell prints bold median + "median". **pct uses the SHARED scale**, not per-row, so a head chef's bar is visibly longer than a porter's. **Checklist:** all rows use one scale (a higher-paid role has a longer/righter bar); median dot inside its own fill range; one terracotta dot per row; collapses to stacked at 600px.

#### 2.6 Peers / like-for-like (ranked bars) , the same business nearby
**Data:** `[{place, value}]`, the subject first/flagged, all same currency. **Approach (CSS grid rows):** `120px 1fr 80px`; bar width `= value/maxValue*100%`; the subject row bar is `--atlas-500` and its label terracotta-bold, all peers cocoa-300. A `.caveat` line states same-trade/same-currency/not-cost-adjusted/read-each-on-its-own-terms. **Checklist:** longest bar = max value (subject need not be longest); exactly one terracotta bar (the subject); honesty caveat present and load-bearing; NEVER ranks across business x geography (peers must be the same trade in comparable places); descending or subject-first order is intentional, not accidental.

#### 2.7 First-year (timeline ribbon)
**Data:** 3-5 ordered phases `[{when, label, note, emphasis?}]`. **Approach (CSS grid + absolute line):** a `.tl-line` behind the row (cream-300, inset 6% each side); `.tl-row` of N equal columns; each `.tl` has a node dot centered on the line, an uppercase "when", a bold label, a note. The one break-even phase gets `.em` (terracotta node with `0 0 0 4px atlas-50` halo). **Checklist:** line sits behind nodes at the same y as the node centers; exactly one emphasized node; columns equal-width; reflows 4->2 at 680px with the line still aligned.

#### 2.8 Risks (severity ladder)
**Data:** `[{title, note, level: serious|watch|rare}]`. **Approach (CSS grid rows):** `24px 200px 1fr` = glyph / title / note, hairline-separated. The glyph `.sev` is three rising bars (heights 8/13/18px); `serious` lights all three terracotta, `watch` lights two amber, `rare` lights one cocoa. **Checklist:** bar heights ascend left-to-right; lit count matches level (3/2/1); color matches level (atlas/amber/cocoa) and never invents a fourth level; reflows to glyph+note at 680px; severity is editorial, never a fabricated score.

#### 2.9 Score (0-100 band) , versus the world / climate
**Data:** `{score, globalMedian?, label}`, 0-100. **Approach (CSS):** a horizontal band (track cream-300) with the subject marker (terracotta) at `left=score%` and an optional peer/global-median tick (ink) at `left=median%`; the score printed large (Newsreader) beside it. This is the ONE site-wide "versus the world" grammar (reuse on cell, country, industry). **Checklist:** marker x equals score%; only cities are ever scored (Business Climate Score); a country never scores its own cities; one terracotta marker; peer tick clearly differentiated (ink, thinner).

#### 2.10 The nine-lens RADAR / hexagon (the one that rendered wrong , exact spec)

This is the failure case. In `country-uk.html` the radar is hand-typed with eyeballed coordinates and three concrete bugs: (a) the ring **labels are inverted** , "strong" is printed at r=50 (near the center) and "weak" at r=150 (near the rim), but value-radius grows outward, so a high score lands near the rim where it is labeled "weak"; (b) the polygon vertices do not lie on their spokes (e.g. spoke 9 ends at `72.3,148.5` but the matching vertex is `132.3,162.6`, an arbitrary point); (c) the value-to-radius mapping is applied inconsistently per vertex. The fix is to compute every coordinate from one formula and one origin.

**Canonical geometry (use exactly this).** Let `cx, cy` = center, `R` = max radius (rim), `n` = axis count (9), `values[i]` in `[0,1]`. The angle for axis `i` starts at straight up and steps clockwise:

```
angle_i = -90deg + i * (360/n)        // in degrees; i = 0..n-1
rad_i   = angle_i * PI / 180
// a point at fractional radius f (0..1) on axis i:
x(i,f) = cx + R * f * cos(rad_i)
y(i,f) = cy + R * f * sin(rad_i)       // +sin because SVG y grows downward; -90deg => straight up
```

Build order, all from that formula:
1. **Rings** (3): draw as `<circle r="R*0.33">`, `r="R*0.66"`, `r="R">` OR, to match the polygon shape, as scaled polygons through `point(i, ringFrac)` for all i. Rings are reference only; label them **weak / fair / strong from center outward** (weak nearest center, strong at the rim) , the inverse of the current file.
2. **Spokes** (n): line from `(cx,cy)` to `point(i, 1)` for each i.
3. **Value polygon:** `points = point(0,v0) point(1,v1) ... point(n-1, v_{n-1})`, fill `--atlas-500` at .12 opacity, stroke `--atlas-500` 2px, `stroke-linejoin:round`.
4. **Vertices:** a 3.5px terracotta dot at each `point(i, v_i)` (these MUST equal the polygon points).
5. **Rim labels:** axis name + one-word read at `point(i, 1.08..1.18)` (just outside the rim), `text-anchor` chosen by quadrant (`middle` top/bottom, `start` on the right half, `end` on the left half) so labels don't collide with the circle.
6. **Sample tags:** any axis without trend data gets a small `SAMPLE` caption under its read; the value still plots (honesty: clearly tagged, never blank).

**Worked numbers for the UK page** (cx=220, cy=200, R=150, n=9; values from the file: Reward .56, Cost .55, Entry .80, People .80, Demand .90, Edge .73, Risk .80, Momentum .50 sample, Path .50 sample). Angles: 0:-90, 1:-50, 2:-10, 3:30, 4:70, 5:110, 6:150, 7:190, 8:230 deg. Polygon points (rounded):

```
i0 Reward  (.56): 220.0, 116.0
i1 Cost    (.55): 273.0, 136.8
i2 Entry   (.80): 338.2, 179.2
i3 People  (.80): 323.9, 260.0
i4 Demand  (.90): 266.2, 326.8
i5 Edge    (.73): 182.5, 302.9
i6 Risk    (.80): 116.1, 260.0
i7 Momentum(.50): 146.1, 186.9
i8 Path    (.50): 171.8, 142.6
```

(These replace the current `points="220,116 290.6,159.3 ..."`. Note vertex 0 is unchanged because straight-up math is trivial; every other vertex moves onto its true spoke.) Spokes end at `point(i,1)`: i0 220,50 / i1 334.9,103.6 / i2 367.7,173.9 / i3 350.0,275.0 / i4 278.7,340.9 / i5 161.3,340.9 / i6 90.0,275.0 / i7 72.3,173.9 / i8 105.1,103.6. **Checklist:** every vertex lies on its spoke (vertex_i is a scaled copy of spoke-end_i, same direction); rings labeled weak->strong center->rim; viewBox square and `preserveAspectRatio` left default (stays circular at 375); one terracotta polygon; n labels, none clipped by the viewBox (pad the viewBox to ~440x420 so 1.15R labels fit); sample-tagged axes still plot. Generate these numbers with a tiny script (loop i, compute, print) , never by hand.

---

### 3. Graphics-correctness methodology (so a chart never renders wrong again)

1. **Compute, don't eyeball.** Every coordinate, width%, and angle comes from a stated formula with a stated domain `[min,max]` (or `[0,1]` for the radar). For anything with trig or >4 points (radar, seasonality, multi-row scales), generate the numbers with a throwaway script and paste the output, rather than typing coordinates. The radar bug above happened precisely because points were hand-typed.
2. **One viewBox, one origin, consistent units.** Inside an SVG, never mix viewBox units with px or % positioning for the data marks. Keep `cx,cy,R` (radial) or the `0..720 / 0..180` grid (cartesian) as the only coordinate system. CSS charts use one percentage scale per chart; comparable rows (wages, peers) share ONE scale so lengths are honestly comparable.
3. **Direct-label the mark; verify the mapping invariants.** Put the value on or beside the thing it describes (tick under its position, amount inside its segment, read beside its spoke). After building, check the invariants per chart: ticks sit at true x; stacked widths sum to 100; the typical/median marker is inside its own range; the single accent marks exactly one thing; rings/scales are labeled in the correct direction.
4. **Test at 375 and 1280.** Open at both widths. At 375: no horizontal scroll, no clipped number, every `Npx 1fr Mpx` row collapsed, the radar still circular (not squished), the seasonality area still readable, legends reflowed. At 1280: charts don't stretch past their `max-width` (680-840px for data charts; the radar caps at 560px). If a graphic only "looks right" at one width, it is not done.
5. **Honesty rails survive the visual.** Re-skinning never removes an empty state, a caveat line, a sample tag, or the "still filling in" collapse strip; never crowns a cross-currency or cross-geography leader; never draws a pie; never invents a real-looking number. A graphic that looks premium but breaks an honesty rail fails QA.

---

Files referenced: `E:/atlas/cell-london-restaurants.html` (reference token map + chart vocabulary), `E:/atlas/country-uk.html` (radar bug, lines 487-540), `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/00-ideology-and-design-law.md`, `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/01-component-and-chart-system.md`.

## home completion plan (E:/atlas/home.html)

### Full locked section set vs what is present

| # | section | in current HTML? | graphic/component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 0 | Top nav (`navbar1`) | partial | sticky header bar, wordmark + nav + dark CTA | Present and on-brand. But mobile (≤820px) only `display:none` on `.nav` — no hamburger/sheet, so on a phone the nav links vanish with no replacement. | Add a mobile menu affordance (a static hamburger glyph that, per spec precedent, opens a sheet); at minimum keep the nav reachable. Tap target ≥44px. |
| 1 | `home-hero` (rotating question + search) | yes | `hero2`: centered eyebrow + Newsreader question H1 + Inter sub + frozen `NavigatorForm` | The ONE Newsreader moment, biggest type step, no hero number, no image, no second accent. Question slots ("coffee shop", "Barcelona") in atlas-700. Search card floats just beneath as one section. | Correct as-built. Minor: the `.go` "Show the numbers" submit is a `<span>` not a focusable control. Make it a real `<button type="submit">` (or `role="button"` + `tabindex`) so it is keyboard-reachable and 44px. |
| 2 | `home-featured` (live example tiles) | yes | Stats-Card grid (`stats-card1` shape), 3-up | Business + city in Inter, one real headline number in tabular figures (first numbers on the page, one band down from hero), hairline cards, hover lifts border to atlas, NO change-arrows (absolutes not deltas). | Mostly correct. Verify each headline number is a real/exemplar take-home sanity-floored at $15K and label is consistent. Tighten copy: "Owner keeps about this a year" repeated 3x is fine but the SF $118K and UK $96K must read as the same metric (take-home), which they do. |
| 3 | `home-city-picker` (world map) | yes (bug) | bespoke `WorldMapSection` SVG, full-bleed paper band | Quiet exploratory surface, not a data viz. One accent only on active pins, generous vertical air, plain caption with no coverage vanity counter. | BUG: pin geography is wrong (see below). Africa/Lagos pin sits over the wrong landmass; SF pin sits off the NA blob; Tokyo pin sits at the right edge of the Asia blob, not Japan. Re-place pins onto their continents, or make the map abstract enough that mis-registration reads as intentional. |
| 4 | `home-featured` (state comparison) | yes | kit `LikeForLikeBars` / `ComparisonBars` | Same trade across 4 US states, NO winner crown, NO cross-geography ranking, atlas-500 = subject bar, neutrals for rest, direct end-labels in tabular figures, honesty caveat below. Self-omits when thin. | CORRECTNESS: the subject styling currently crowns California as #1 by making it the atlas bar AND the longest bar, which reads as a league table, the exact thing the honesty rail forbids. Either (a) make NO bar the atlas "subject" (all neutral, since there is no user-chosen subject on the home page), or (b) pick a non-top subject so atlas ≠ "the winner." Keep the caveat. |
| 5 | `home-cities-placeholder` (neighbourhood proof cards) | yes | Gallery cards, 3-up, from flavor data | District + city in small Newsreader, "known for" + one specific "don't miss" + price-tier chip. NO numbers (texture, not a stat block). No fabricated place detail. Self-omits below four. | Correct grammar. Verify every "don't miss" line is real (Flushing Chinatown, Place des Vosges 1612, Yanaka Ginza are real; keep them). Tier chips ("Mid"/"Expensive") must come from real tiering, not invented. |
| 6 | `home-audience` (audience band) | yes | Feature block (`feature43` icon grid), 4-up | Quiet who-it-is-for row, one terracotta icon per card, Newsreader role name, Inter use-line. PE/consulting framed as clients not subjects, lower density than data sections. | Correct and on-message. No fix beyond rhythm (see density). |
| 7 | `home-upgrade` (pricing teaser) | yes | three tier cards, `pricing2` mini | Free / Basic / Premium, prices from `TIERS` so they can't drift, no checkout, ONE CTA to /pricing, tabular price figures, checks in moss, dashes in faint cocoa. | Verify $0 / $37 / $77 match the live `TIERS` constant (PRICING.md / TIERS source) so the mockup can't drift from prod. The off-list dash uses `&#8211;` (en-dash) as a glyph inside a checkmark span: that is a visual tick, not prose, so it does not break the em-dash ban, but confirm it renders as a minus, not a stray dash. |
| 8 | `home-blog-rail` (blog rail) | yes | Blog/Gallery cards, 3-up | Newsreader title, date in tabular figures, two-line excerpt clamp, token-gradient cover when no image, "All posts" quiet text link, even restrained rhythm. | Excerpts are not actually clamped (no `-webkit-line-clamp`); long excerpts could break the even rhythm. Add a 2-line clamp. Cover initials ("T","T","P") are arbitrary; make them the post's first letter intentionally or drop to a clean token-gradient cover with no glyph. |
| 9 | `home-newsletter` (newsletter / free report) | yes | `cta10` / Banner panel + real sample-report preview | White-band close, calm accent panel: Newsreader heading, three plain bullets, lead-magnet form, and a REAL sample-report preview render (never a placeholder slot). One CTA, the quiet exhale before the footer. | The preview is a styled bar placeholder, not a real render. Spec says "never a placeholder image slot." It IS labelled "Sample preview / preview of the layout, not a live read," which satisfies honesty, but to hit the highest grade, replace the abstract bars with a miniature of the real per-$100 stacked bar (the page already has the `.bar100` grammar) so it reads as a true shrunk report, not decoration. The email `<span class="in">` and submit `<span>` are not real inputs/buttons: make them a real `<input>` + `<button>` for tap target + focus. |
| — | Global footer (`footer7`) | yes | dark footer, 4-column, legal strip | Wordmark + blurb + Explore/Product/Company columns + legal line. On-brand. | Correct. Legal line already carries the honesty disclaimer. No fix. |
| — | Collapse strip ("still filling in") | present in CSS, not rendered | `.strip` muted-cream panel, one Inter line, no number/skeleton | Should appear ONLY in the labelled failure-state variant when both self-omitting sections fail. | No fix for the default state (correctly absent). Build the second labelled "failure-state" mockup that shows the single collapsed strip (see density section). |

### Missing sections to add

There are no entirely missing locked sections. The home page already carries all nine in the locked order (0 nav and the footer are present too). What is "missing" is not sections but two things the spec calls for that the file omits:

1. The labelled collapse-state variant. The spec (02-home.md §Density, §375 deliverable) explicitly asks for a SECOND smaller mockup state demonstrating the single collapsed "More comparisons are filling in" `SectionEmpty` strip, clearly labelled as the failure state. The CSS (`.strip`) exists but is never rendered. Add it as a separate small section block (or a separate `home-collapsed.html`) showing sections 4 and 5 folded into ONE calm strip. Data it carries: no numbers, just one Inter-muted line "More comparisons are filling in" inside a muted cream panel.

2. A real sample-report preview render in section 9 (data: a miniature per-$100 split for "Restaurants, Barcelona" using the same `.bar100`/legend grammar as the cell page, so it is a true shrunk report not abstract bars).

Everything else the spec lists is present with correct data.

### Graphics + correctness issues in the current HTML

1. World-map pin mis-registration (the page's analogue of the country radar bug). The continent paths are deliberately abstract, but the four pins are placed by eyeballed coordinates that don't sit on their landmasses:
   - San Francisco `translate(110,150)` sits left of / off the North-America blob (which spans roughly x70–224).
   - Tokyo `translate(770,150)` sits at the far-right edge of the Asia blob, not over a Japan position (Asia blob ends ~x806 but Japan should read as a pin near its eastern edge, currently ambiguous).
   - Lagos `translate(478,262)` and Barcelona `translate(456,138)` are close to the Africa/Europe blobs but not clearly ON them; Barcelona at y138 sits above the Europe path's top edge (~y92–176) acceptably, but Lagos overlaps the Africa path's left edge rather than sitting in West Africa.
   Fix: nudge each pin's transform so its 6px dot center sits visibly inside its continent path (SF ~x150,y150; Tokyo ~x788,y150; Lagos ~x470,y250 within the Africa blob; Barcelona is roughly OK). Because this is a stylized surface, exact cartography isn't required, only that each pin reads as "on that continent." Re-verify visually after nudging.

2. State-comparison reads as a ranked league table (honesty-rail violation). atlas-500 on California + California being the longest bar = a crowned winner ordered top-to-bottom by revenue. The spec forbids ranking across geography and crowning a winner. Fix: drop the `subject` class from California (no bar is the subject on the home page since the user picked nothing), render all four bars in neutral cocoa, keep the direct end-labels and the existing caveat. Optionally shuffle the row order off pure descending so it doesn't read as a ranking.

3. Non-interactive controls dressed as inputs/buttons. The hero "Show the numbers" (`<span class="go">`), the newsletter email field (`<span class="in">`) and "Send me the report" (`<span class="btn">`), and the nav CTA are `<span>`s. In a static mockup that is visually fine, but they fail the QA bar's "visible focus states, 44px tap targets, real form states." Fix: promote the hero submit and newsletter field/submit to real `<button>` / `<input>` (still inert via `onsubmit="return false"`), give them focus-visible styles. This also makes the page keyboard-navigable for the founder's review.

4. Blog excerpts not clamped. `.bexc` has no `-webkit-line-clamp`, so a longer excerpt would unbalance the 3-up rhythm the spec wants "even." Fix: add a 2-line clamp (`display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden`).

5. Sample-report preview is decorative, not a real render. Spec: "a real sample-report preview image (never a placeholder cloudfront slot)" / "never a placeholder image slot." Current `.pbars` are abstract width bars. It is labelled, so honesty holds, but the highest grade is a true miniature. Fix: rebuild the preview body as a small per-$100 stacked bar with 3–4 labelled segments (COGS / payroll / rent / owner's keep) reusing the `.bar100` grammar.

6. Mobile nav disappears with no fallback. `@media(max-width:820px){.nav{display:none}}` and no hamburger. Fix: add a static menu affordance for the ≤820 breakpoint.

7. Minor token/measure checks (no behavior change, verify only):
   - Map continent fills use `var(--cocoa-300)` and pins `var(--atlas-500/600)`: on-brand, single accent. Good.
   - Neighbourhood cover gradients use raw hex (`#463726`, `#991600`, `#345a47`, etc.) inline. The static mockup tolerates this, but for the eventual port these must come from tokens; `#345a47`/`#4d7c64` are greens NOT in the warm token set (no such teal-green token), so that card introduces an off-palette color. Fix: swap the Shitamachi cover to a token gradient (cocoa/ink or moss tokens) so no off-palette green appears. Same check on blog cover `#4a6018→#96b448` (moss-ish, acceptable) and `#8a510a→#eda12f` (amber-ish, acceptable).
   - The `.extile .hl small` and `.unit` etc. carry many unused CSS classes inherited from the cell mockup (`.range`, `.calc`, `.gauge`, `.risks`, `.wages`, `.startup`, `.season`, `.timeline`, `.lfl` partly, `.bar100`, `.drivers`, `.keptbar`). They don't render anything wrong but bloat the file; harmless for review, optionally prune. Note `.bar100` should be KEPT because fix #5 reuses it.

### Density + rhythm + collapse

The page is already close to the spec's rhythm; the work is protecting it as sections get polished, not adding mass.

- Section weighting (keep this cadence, alternate dense/airy so two stat grids never stack):
  - Loud + big: hero question (largest Newsreader step) and the full-bleed map band (largest spatial beat). These are the two anchors.
  - Medium, numeric: example tiles (2) and state-comparison bars (4) — the ONLY two places tabular figures cluster. Keep both 3–4-up, never denser. They are separated by the map (good) so numbers don't stack.
  - Quiet, editorial: neighbourhood cards (5), audience band (6), pricing (7), blog (8), newsletter (9) — all on generous padding, lower contrast, fewer-but-bigger.
- Anti-card-wall defense (the spec's #1 cringe risk): five card-shaped sections in a row. Keep the FOUR distinct card grammars visibly different: stats-cards (numeric, tile 2), gallery-cards (editorial w/ cover, 5), feature-cards (icon, 6), pricing-cards (price+list, 7), blog-cards (cover+title, 8). Interrupt them with the full-bleed map (between 2 and 4) and the panel-shaped newsletter (9) so the eye never sees five clones. This is already the structure; preserve it when restyling.
- Typography guard: only the hero question is Newsreader-large. Every section H2 must step down ≥1.25 ratio below it (current `h2.h` clamp 26–36 vs hero 30–58 is OK at the top of the range but tighten so the largest H2 never approaches the smallest hero size). One display moment, one accent, tabular figures on every number.
- Breathing: the `section.block{padding:52px 0}` plus full-bleed bands give the air; the map and newsletter panel are the exhales. Don't reduce padding to fit more in.
- Collapse rule (the one fold): the home page does NOT carry a long run of unheld sections, so the default mockup shows everything filled and renders NO strip (correctly absent now). The ONLY collapse is the failure state: if BOTH self-omitting sections, section 4 (state comparison) and section 5 (neighbourhood cards), fail to resolve at once, they fold into ONE calm "More comparisons are filling in" `SectionEmpty` strip (muted cream `.strip`, one Inter-muted line, no number, no skeleton, no "coming soon"), never two empty bands. Deliverable: build this as a clearly-labelled second mockup state (or a `home-collapsed.html`) so the founder can see the failure behavior, exactly as the spec asks. In every other case each fragile section self-omits silently and the rest of the page closes up around it.

Source files referenced: E:/atlas/home.html, E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/02-home.md, E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/00-ideology-and-design-law.md, E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/01-component-and-chart-system.md.

## country completion plan (E:/atlas/country-uk.html)

### Full locked section set vs what is present

| # | section | in current HTML? | graphic / component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 1 | hero / masthead | yes | `EngravedHero` reskinned to `hero2` proportions: faded contour engraving, flag, Newsreader name, fixed subtitle, one anchor number, quiet `AddToWatch` | Country name at the page's LARGEST type step; engraving at low opacity, no colour wash; subtitle fixed at 65ch; anchor (19% tax burden) seated under the answer line; AddToWatch the only chrome | Minor: answer line runs to ~75ch and doubles as both subtitle and verdict. Split into the fixed 65ch subtitle + a separate `buildAnswer` verdict line. Otherwise sound. |
| 2 | scorecard (8 metrics) | yes | `stats-card1` grid, 4-up at 1280 / 2-up at 375 | Tabular figures, generous padding, one calm word-read under each value on the clay-to-moss meaning scale | "Cost of living 78/100 = Fair" tinted amber reads as a soft negative on a neutral metric; make it neutral or invert the meaning. Null cells must show "dash + not held"; none modelled here, acceptable for the GB exemplar. |
| 3 | the country shape: nine lenses (radar) | partial (present, BROKEN) | visx-style `CountryShape` radar, do NOT swap for Recharts | One large centred radar, breathing whitespace, rim labels in Inter, one-word read per spoke, two sample spokes tagged | MAJOR. Polygon is hand-eyeballed: 8 of 9 vertices are off their spoke axis (drift up to 47px), plotted radii do not match the stated scores, and ring labels are inverted (outer ring labelled "weak" while high scores plot outward). Recompute all 9 vertices from angle+score; relabel rings. See bug section. |
| 4 | decisive: cost and rules to set up | yes | `SetupStepper` + `data-table1` formation-cost table | The page's FIRST heavy card. Stepper leads; tax/payroll/time as a 2-col Newsreader `dl`; per-tier cost table under one hairline; sales-tax note small/low; one atlas down-link | Sound. The `dl` repeats the salesnote text verbatim below it (the "Sales tax 20%" dd duplicates the paragraph). Drop the duplication; keep one. |
| 5 | licences | no (in strip) | `LicenceCheck` checklist, SampleState | Folded into the "still filling in" strip as a tagged chip | Present as a chip. Correct per Density. |
| 6 | cost-signature (where the margin leaks) | no (in strip) | `chart-card1` 3-bar (rent/labour/tax), biggest flagged, SampleState | Folded into the strip | Present as a chip. Correct. |
| 7 | hire | yes | `HiringRead` gauge (if full set held) else held-fact bullets + `ComparisonBars` payroll-vs-neighbours | Card. GB has wage facts so bullets lead; payroll `ComparisonBars` carries the no-ranking caveat | Sound. France bar at width:100% visually crowns it as worst (loud relative read); the caveat covers it but consider making the home bar the only tinted one (it already is) and keeping the scale honest. Acceptable. |
| 8 | talent | no (in strip) | `TalentReality` SampleState | Folded into the strip | Present as a chip. Correct. |
| 9 | who has money | yes | `WhoHasMoney` spending-power rung read | One calm rung ("Comfortable") + plain-words; spend-mix omitted, no fabricated split | Sound. Modelled read framed correctly. |
| 10 | how far you reach | yes | `HowFarYouReach`, real population lead | One real population figure (Newsreader number); reach indicators self-omit under one caveat | Sound. |
| 11 | neighbours (vs neighbours FACTS table) | yes | `Neighbours` like-for-like FACTS table | Card, the most load-bearing comparison; home column TINTED not crowned; tabular figures; "different regimes, never a league table" caveat | Sound. Confirm no `▲/▼` or rank ornaments anywhere. Header order of neighbour columns differs from the payroll ComparisonBars order (IE/FR/DE/NL vs IE/NL/DE/FR); harmonise neighbour order across the two for scan consistency. |
| 12 | opportunity gap | no (in strip) | `OpportunityGap` SampleState | Folded into the strip | Present as a chip. Correct. |
| 13 | here vs abroad (same business) | no (in strip) | `SameBusinessAbroad` mirror bars, SampleState | Folded into the strip | Present as a chip. Correct. |
| 14 | special zones and structures | no (in strip) | `SpecialZones` cards, SampleState | Folded into the strip; self-omits where none | Present as a chip. Correct. |
| 15 | the ground under you (ground-risk) | yes | `GroundUnderYou` factor read | Real factors lead with bars; 2 sample factors tagged; one summary line says which are held | Sound. The two real bars (71% / 80%) carry no value label, the two sample bars sit at a flat 50% — make the flat-50 read clearly as "no data" not "mediocre"; the SAMPLE tag does this but consider a hatched/ghosted bar fill for the sample rows. |
| 16 | cities | yes | `CitiesGrid` uniform equal-weight cards + chip row | Card; EVERY card identical weight (climate dot = 3 for all); never ranked; quiet chip row beneath; generous gaps | Sound. The three climate dots are decorative-only and identical across all cards (correct, no ranking signal). Keep. |
| 17 | easiest to break into | yes | `EasiestToBreakIn` ranked list | Card; ranks ACTIVITIES within the country (allowed); link-gated to trusted-local cells; scores shown only when openingHref exists | Partial. Rows have no links and the bars/words ("Easy/Fair") show unconditionally. Per the link-gate memory, the readiness bar+word should only render where a trusted-local opening cell exists; otherwise show the activity name alone. Wire the gate or drop the score for ungated rows. |
| 18 | character | yes | `CharacterPanel` spectra + two stats | Card; culture/government spectrums as quiet engraved sliders; two people-stats as small figures | Sound. Five spectra is one more than the radar+character should carry without feeling busy; acceptable. Slider thumbs need a visible value-free read (they do). |
| 19 | what locals know | yes | `LocalsKnow` glyph-led visual list | Short glyph list, never a prose wall; UK shows four real beats | Sound, four beats present. The £ glyph is a literal currency symbol used as an icon, slightly off-brand vs the geometric glyphs; swap for a neutral glyph for consistency. |
| 20 | what your life looks like here | no (in strip) | `YourLifeHere` felt bars, SampleState | Folded into the strip | Present as a chip. Correct. |
| 21 | vs the world | yes | `VsWorld` `ScoreBand` with global-median tick | Card; one mirror/score band, this country vs a true global median; "not adjusted for local prices" caveat | Sound, but it is a 2-row bar, not the site-wide `ScoreBand`-with-median-TICK grammar. Render the global median as a vertical TICK on a single subject bar (the chosen site-wide grammar in 01 §5), not as a second competing bar that visually dwarfs the median. |
| 22 | the honest take | yes | `HonestTake` small/low | Deliberately small and low; one verdict line + held ticks; UK rich version | Sound. Verdict line is identical to the One-thing line (#24); intentional echo but verify it does not read as a third repeat of the masthead answer. |
| 23 | one quick gut-check | yes | `GutCheck` three framed question cards | Three plain framed questions, calm, generic-but-true, no fabricated specifics | Sound. |
| 24 | one thing to remember | yes | `OneThing` closing line + `FreshnessStamp` + `FlagIt` | The warm last word, one sentence; freshness stamp + flag-it beneath | Sound. "Coverage: good" is a soft self-grade; fine for the GB exemplar. |
| 25 | related countries | yes | `cta10` calm accent panel into Compare | Card; one calm atlas CTA into Compare; the only button besides AddToWatch | Sound. Uses `.panel` not the heavy `.card`; acceptable, but it is the closing beat and should carry full-card weight per Density (heavy list). Optional lift. |

Order note: in the HTML, vs-world (21), honest-take (22), gut-check (23), one-thing (24), related (25) all sit AFTER the collapse strip. Section 21 vs-world appearing after the strip is fine, but the constitution order is honest-take(22) → gut-check(23) → one-thing(24); the HTML places vs-world(21) before honest-take(22), which matches. Order holds.

### Missing sections to add

All eight unheld sections are correctly NOT rendered as standalone blocks; seven appear as chips in the collapse strip. The single gap against the spec list:

- **Section 10 reach — sample reach indicators chip.** The spec Density note folds "any sample reach" into the strip alongside the seven placeholder sections. Reach (#10) currently renders as a real-population block (correct), but its sample reach indicators (delivery / online reach) are dropped silently with a caveat line rather than represented in the strip. This is acceptable per the spec ("reach indicators self-omit under one honest caveat line"), so no chip is strictly required. No standalone section is missing.

Therefore: **no locked section is absent.** Every gate-bearing and exemplar section is present; every placeholder is collapsed. The completion work is correctness and treatment, not adding sections. The two real additions of substance are:

1. **A correct radar** (replacing the broken one) carrying GB's nine derived lenses: Reward .56, Cost .55, Entry .80, People .80, Demand .90, Edge .73, Risk .80, Momentum .50 (SAMPLE), Path .50 (SAMPLE) — one-word reads Fair / Fair / Strong / Strong / Excellent / Strong / Strong / Steady / Open.
2. **Wiring the break-in link-gate** so the readiness scores only show on trusted-local activities (data, not visual).

### Graphics + correctness issues in the current HTML

1. **Radar polygon is hand-eyeballed and wrong (the headline bug).** Verified by computing each vertex from its spoke angle (top, then every 40°) and stated score (r = score × 150): only the top vertex (Reward, 220,116) is correct. Every other vertex drifts off its spoke axis — Risk by 47px, Path by 40px, Edge by 38px, Momentum/Demand/People by 35-37px — and the plotted radii do not match the scores (Risk shows r≈98 ⇒ score~0.65 not 0.80; Demand shows r≈108 ⇒ ~0.72 not 0.90). **Fix:** generate all nine `<polygon>` points and nine `<circle class="vtx">` programmatically from `x = 220 + score*150*cos(-90°+40°*i)`, `y = 200 + score*150*sin(...)`. Do the same for the vertex dots and snap rim labels to each spoke direction.

2. **Radar ring labels are inverted.** Labels sit at y=156 ("strong", r≈44 inner), y=106 ("fair", r≈94 mid), y=56 ("weak", r≈144 outer). So the OUTERMOST ring reads "weak" while the polygon plots HIGH scores OUTWARD (Demand .90 lands near the outer ring). A strong score visually lands on the ring labelled "weak". **Fix:** swap the labels so the inner ring = weak, mid = fair, outer = strong, matching outward-is-better. Place them along a single spoke gap, vertically ordered weak(inner)→strong(outer).

3. **Radar rim-label radius is fixed, not spoke-aligned.** Labels were placed by eye (e.g. "Entry" at 392,146; "Risk" at 108,334) and do not all sit at a consistent radius beyond the outer ring, so they crowd unevenly. **Fix:** place each rim label at r=178 along its spoke angle with text-anchor derived from the angle (start on the right half, end on the left, middle at top/bottom).

4. **Decisive `dl` duplicates the salesnote.** The "Sales tax (carried by the customer) 20%" `dd` and the `.salesnote` paragraph carry the same sentence. **Fix:** keep the figure in the `dl` OR the prose note, not both.

5. **vs-world is a two-bar race, not the site-wide median-tick `ScoreBand`.** A full-width UK bar beside a 14%-width "Global median" bar reads as a lopsided contest and risks an implicit "we win" crown. **Fix:** render one subject bar with the global median as a labelled vertical tick (the grammar chosen for cell + country + industry in 01 §5), keeping the no-price-adjustment caveat.

6. **Scorecard "Cost of living 78 = Fair" tinted amber** reads as a negative on a neutral fact. **Fix:** use the neutral read (no pip) or label it plainly; cost-of-living is not a good/bad axis for an owner without context.

7. **Break-in readiness shown ungated.** Bars and "Easy/Fair" words render for all five activities with no opening links, contradicting the trusted-local link-gate (scores shown only when `openingHref` exists). **Fix:** gate the bar+word; show the activity name alone where no trusted-local cell backs it.

8. **Neighbour column order differs between the FACTS table (IE/FR/DE/NL) and the payroll ComparisonBars (IE/NL/DE/FR).** Minor scan-consistency nit. **Fix:** use one neighbour order across both.

9. **Off-brand glyphs.** The locals list uses a literal `£` as an icon and the strip/character mix geometric glyphs with currency/astronomy symbols. **Fix:** standardise on the geometric glyph set for consistency; reserve `£`/`$` for actual figures.

No malformed SVG elsewhere: the flag, the contour engraving pattern, and the seam rosettes render correctly. The radar is the only broken graphic.

### Density + rhythm + collapse

The page must read like ~12 beats, not 25, by weight not subtraction:

- **Heavy (full `.card`, most padding):** hero, decisive, hire, neighbours, cities, vs-world, related. These seven gate-bearing beats carry the rhythm. **Action:** lift `related` from `.panel` to full `.card` weight so the closing beat lands as heavy (currently lighter than its siblings).
- **Medium (open sections, no card chrome):** scorecard, the radar, who-has-money, reach, ground-risk, break-in, character, gut-check. Open, airy, no shell.
- **Quiet (small type, low):** honest-take (in `.narrow`), locals, one-thing (in `.narrow`). Correctly demoted.
- **The collapse (the key move):** the eight unheld sections (licences, cost-signature, talent, opportunity gap, here-vs-abroad, special zones, your-life, plus sample reach) fold into ONE bordered cream `.strip` titled "Still filling in for the United Kingdom" with seven tagged chips and one honest sentence — NOT eight stacked SampleState blocks (the "wall of dashes" the law forbids). Present and correct. It sits mid-page where the constitution's center run lives, so order is preserved as a subsequence while the visual run collapses 8→1.
- **Seams:** `.seam` rosette/contour dividers group the lenses (Reward+Cost, People, Demand, Comparison+Edge, Risk, The place, The close), giving the long page breathing seams. Present and correctly placed.
- **Padding rhythm:** generous → medium → generous; `section.block { padding:52px 0 }` with hairline separators. Hold this; do not let the now-correct radar section tighten — it needs the most surrounding whitespace of the medium beats.
- **One quietening lever if it still reads busy:** demote `who-has-money` and `reach` from medium open-sections into a strip-adjacent "modeled" lane so only fully-held beats carry visual weight, per the spec's own "can it be better" answer. Hold this in reserve; apply only if the founder reads the completed page as dense.

Net: the page is structurally complete and correctly collapsed. The completion work is (a) rebuild the radar from computed geometry with corrected ring labels, (b) de-duplicate the decisive note, (c) convert vs-world to the median-tick ScoreBand, (d) fix the cost-of-living tint and the break-in gate, (e) harmonise neighbour order and glyphs, (f) lift `related` to full-card weight. No locked section needs adding.

## city completion plan (E:/atlas/city-london.html)

### Full locked section set vs what is present

| # | section | in current HTML? | graphic/component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 1 | headline (Hero + Business Climate Score) | partial | `stats-card1` quiet KPI row + KEEP `ScoreBand` (the warm 4-segment band); optional re-skinned radial for the score moment only | Score 78/100 as the page's ONE Newsreader hero number, "United Kingdom" eyebrow + flag glyph, three quiet Inter tabular stats (pop/salary/visitors), ScoreBand below with the four climate words AND peer ticks. At 1280 score+band own the right column; at 375 stack. | Hero, score, stats, band all exist. Missing: the verdict-sentence headline (h1 is the bare place name "London", spec wants "London is a good place to start a small business" as the verdict the score generates). Add a real flag glyph (no source-agency text). Peer ticks on the band are unlabeled bare bars (see bugs). |
| 2 | honest-take | yes | `cta10` calm accent panel, buttons omitted | One atlas-50 panel, Newsreader verdict line, up to three Inter bullets, set apart by whitespace not a stripe, measure ~60ch. | Present and on-grade. Minor: tighten the verdict measure to 60ch and confirm no side-stripe (the `.panel li::before` square is a list bullet, allowed, not a section accent stripe). OK. |
| 3 | customer (Who the local customer is) | partial | Stat pair in a `chart-card1` shell + KEEP visx `RangeStrip` (p10-p90 "what residents earn a year") | Two big tabular stats ($52K median, $220K wealth), then the RangeStrip as the signature spread with p10/median/p90 markers. | Present but the spread is a crude `.range` div (single flat cocoa span left:0 width:92% + one tick) not a true RangeStrip with p10/p90 endpoints + median marker + the gradient density the kit encodes. Upgrade to the RangeStrip primitive used on the cell page. The "typ" marker at left:42% does not align with the $52K tick at the visual midpoint (see bugs). |
| 4 | space (What space costs) | partial | KEEP kit `RealityCheck` (character read) + small 1-2 stat `data-table1`-style dl | Plain-English truth line in Newsreader, the cost-of-living index sits as ONE quiet supporting stat, body explains it is a cost character not a quoted rent. | Prose truth line present and correctly framed as "a cost character, not a quoted figure". MISSING the supporting cost-of-living index stat (the dl). Add one quiet tabular index stat (e.g. "London cost index 132, UK baseline 100") clearly labeled as character not rent. |
| 5 | visitors (Tourist money vs local money) | yes | KEEP kit `VisitorSplit` (one proportion bar, never a pie) | One horizontal proportion bar, dominant resident slice carries the lone atlas accent, visitor slice neutral cocoa, note keeps it honest as footfall not spend. | Present and correct shape. Bug: the visitor slice uses `.g` = `--cream-200` (pale gray), spec says neutral COCOA. Restyle visitor slice to cocoa-300. The "footfall not spend" honesty note is in the lead sub-line, good; keep it. |
| 6 | owners-keep (What owners keep across trades) | partial | KEEP kit `OwnerKeepTable` (Data Table grade) / `LikeForLikeBars` | Trades ranked by take-home, ONE break-in chip per row (easy/moderate/hard), net margin AND take-home as tabular columns, right-aligned money, no zebra, each row links to the cell page. Self-omits below three real rows. | Rows + bars + chips + take-home present. MISSING the net-margin column (spec wants margin AND take-home as two tabular columns). MISSING the per-row cell-page link (each trade should link to its /opening cell, honoring the trusted-local link-gate). Add margin column; make Restaurant row link to cell-london-restaurants.html. |
| 7 | best-areas (Best areas to set up) | yes | Area cards / definition list + a suits pictogram | Four area rows: district (Newsreader), trade it suits (atlas-700), the why (cocoa body). Calm divided list, NOT a card-grid clone of neighbourhoods. | Present as a divided list, on-grade and correctly distinct from section 8. Optional: add the small "suits" pictogram (a tiny trade glyph) the spec mentions; not load-bearing. OK. |
| 8 | neighbourhoods | yes | Cover cards, up to four featured (`NeighborhoodCover`) | 2-col (375) to 4-col (1280) cover-card grid, district + character + up to two prime streets, lift-on-hover, "Explore all" text link. | Present, four covers + hover + "Explore all" link. On-grade. Note: cover links are dead `<a>` with no href; for the real exemplar at least West End should link to neighbourhood-west-end.html. |
| 9 | changing (How the city is changing) | partial | KEEP kit `ContrarianInsight` trend card | One insight verdict + body, optional three-bullet rail, quiet low-contrast. | Verdict + body present (prose-only narrow block). To hit `ContrarianInsight` grade, wrap as the insight card treatment and optionally add the three-bullet rail (e.g. "evening trade up", "weekday lunch down", "flex-daypart trades winning"). Currently reads as plain prose, not the card. |
| 10 | peers (Rival and peer cities) | partial | KEEP kit `ComparisonBars` on shared 0-100 scale + `CityPeers` cover cards; VsWorld rides here | ComparisonBars ranks London (lone accent) vs scored peers on the ONE shared climate scale with the honesty caveat rail. Cover cards below carry flags + step-sideways links. The VsWorld peer-median block rides here. Self-omits below two peers. | ComparisonBars present (London accented, caveat rail present, correct). MISSING: the peer cover cards row (flags + links) below the bars; MISSING the VsWorld peer-median tick/block that the spec says rides in this section. Add both. |
| 11 | one-thing (One thing to remember) | yes | KEEP kit `OneThing` close card | Warm single closing Newsreader line, freshness stamp "June 2026", flag-it affordance, quietest block, full-width, breathing room above. | Present with "June 2026" stamp, on-grade. MISSING the "flag it" affordance (a quiet report-an-error text link). Add it. |

### Missing sections to add

The page already contains all 11 locked anchors in correct order. Nothing is fully absent, but these section PIECES are missing and must be added to reach full-grade:

- **§1 verdict headline** — replace bare h1 "London" with the score-generated verdict sentence ("London is a strong place to start a small business, if you can fund a slow start."), keeping the place name prominent. Add a flag glyph in the eyebrow.
- **§4 cost-of-living stat** — add ONE quiet tabular index stat beside the RealityCheck line: London cost character vs a UK 100 baseline (London exemplar, framed "cost character, not a rent quote").
- **§6 margin column + cell links** — add a net-margin tabular column to the owner-keep rows (e.g. Dental 18%, Law 22%, Accountants 21%, Restaurant 9%, Cafe 7% — illustrative London exemplar), and per-row links to the trade's cell page (Restaurant -> cell-london-restaurants.html), trusted-local link-gate respected.
- **§9 ContrarianInsight card + bullet rail** — re-wrap the "centre tilting to mixed-use" prose as the insight card with an optional three-bullet rail (evening/weekend trade rising, weekday lunch falling, flex-daypart trades gaining).
- **§10 peer cover cards + VsWorld** — add a CityPeers cover-card row under the ComparisonBars (Paris/Amsterdam/Berlin/Dublin, each with a flag glyph + a step-sideways link), and the VsWorld peer-median read (London 78 vs a peer-median tick, e.g. ~72, on the same 0-100 scale) riding in this section with its own honesty note.
- **§11 flag-it affordance** — add a quiet "Spot something off? Flag it" text link beside the June 2026 stamp.

Data to carry is real-where-held / London-exemplar elsewhere, no new invented-looking precise numbers beyond what the page already shows; keep margins/index framed as exemplar.

### Graphics + correctness issues in the current HTML

1. **§1 ScoreBand peer ticks are bare, unlabeled, and bunched (likely wrong).** Four `.pk` ticks sit at 74/73/71/69% with no labels, clustered right next to the 78% marker, reading as visual noise or a smudge rather than "peer cities for context." Fix: label or at least tooltip them (Paris 74, Amsterdam 73, Berlin 71, Dublin 69), space them so they are legibly distinct from the London mark, and confirm they match the §10 peer scores exactly (they do: 74/73/71/69 — keep them consistent).
2. **§1 hero is a bare place name, not a verdict.** Spec is explicit: the headline is the verdict sentence the score generates. Current h1 = "London" only. This is the single biggest fidelity miss. Fix per Missing-sections §1.
3. **§3 income-spread marker mis-aligned.** The `.typ` median marker is hardcoded at `left:42%` while the median tick label "$52K" sits at the visual centre (the 3-tick row is justify-between, so $52K renders at 50%). The marker and its own label disagree. Fix: compute the median position on the real p10-p90 scale ($24K-$140K+ => $52K is at (52-24)/(140-24)=24%, not 42% and not 50%); align marker, span endpoints, and the three ticks to ONE scale. The span `left:0;width:92%` is also eyeballed, not derived from p10/p90.
4. **§3 is a flat bar, not a RangeStrip.** A single solid cocoa span with one marker is not the kit's RangeStrip (which shows the p10-p90 spread with density/endpoints + median). Upgrade to the real primitive so it matches the cell page's signature spread.
5. **§5 visitor slice color is off-token.** Visitor slice uses `--cream-200` (gray); spec mandates neutral cocoa for the non-accented slice. Change `.keptbar .g` background to cocoa-300. (Resident slice atlas-500 is correct.)
6. **§6 owner-keep bar widths are eyeballed vs the take-home values.** Widths are 100/93/76/51/36% for $95K/$88K/$72K/$48K/$34K. Check: $88K/$95K=93% ok, $72K=76% ok, $48K=51% ok, $34K=36% ok — these are consistent, GOOD; keep but verify they stay locked to the values if numbers change. Real gap is the missing margin column and cell links (above), not the bar math.
7. **§6 chip semantics vs honesty rule.** Chips read easy/moderate/hard; the caveat correctly says "read each on its own terms, not as a ranking." Ensure the bar SORT (descending take-home) is not read as "best business" — it currently could. Keep the caveat prominent; consider sorting by trade type rather than take-home, or add a one-line "ordered by take-home, not by what is best" so the descending bars do not imply a cross-trade ranking (the constitution bans ranking across business x geography; same-geography same-metric is allowed, but the label must make that explicit).
8. **§10 ComparisonBars / §1 band score parity.** London 78 vs Paris 74 / Amsterdam 73 / Berlin 71 / Dublin 69 must be byte-identical to the §1 peer ticks. They currently match; lock them to one shared source so they never drift.
9. **No real flag glyphs anywhere.** Eyebrow says "United Kingdom" as text only; spec wants flag + country. Add a small flag glyph (inline SVG or token), no source-agency text, one accent preserved.
10. **Dead links throughout.** Header nav spans, neighbourhood covers, "Explore all", and peer cards are non-href `<a>`/`<span>`. For the standalone exemplar, wire the ones that have a sibling mockup (neighbourhood-west-end.html, cell-london-restaurants.html) so the SEE-it review can click through; leave the rest as visibly inert.
11. **Footer caveat is good, keep it.** "figures are illustrative of the exemplar, not a live read" satisfies the honesty boundary; retain verbatim.
12. **Em-dash / source-agency scan: clean.** No em-dashes, no agency names found in the current copy. Maintain on every added string (margin column labels, VsWorld note, flag-it copy).

### Density + rhythm + collapse

- **Section weighting (keep the heavy/quiet alternation the spec demands).** Big bands: §1 hero+ScoreBand, §3 RangeStrip, §6 OwnerKeepTable, §10 ComparisonBars. Quiet bands: §2 honest-take panel, §4 space RealityCheck, §9 changing. The locked order already alternates data->prose->data; preserve it. Do NOT let the two added pieces (margin column in §6, peer cards in §10) turn those into walls — keep §6 to ~5 rows max, keep §10 to bars + one calm card row, no second grid.
- **Vertical air.** Maintain the `section.block{padding:52px 0}` rhythm and the hairline `border-top` between bands; bump to 6-8 unit gaps around the two quietest bands (§4, §9, §11) so the page reads spacious, per the design law's "breathe" rule. The one-thing close (§11) keeps the most air above it.
- **No repeated card grids.** §7 stays a divided list, §8 stays cover cards, §10 stays bars-then-cards. Adding peer cover cards to §10 is fine because it is bars-FIRST, not a third bare grid; do not also card-ify §6 or §7.
- **The collapse strip (London exemplar = strip mostly NOT triggered).** Because London is the filled exemplar, every section here renders full-grade and the "still filling in" strip does not fire on this page. BUT the spec requires proving the collapse behaviour: add at 1280 a small inset (or a short second mockup block) of a thin non-exemplar city where §2 honest-take (verdict-only), §7 best-areas, and §9 changing are unfilled and consecutive — these fold into ONE calm muted strip with a single line ("We are still filling in the local detail for {city}: the best areas, how it is changing, and operator voices.") and the section ids preserved as anchors inside it. In that inset the §1 score also softens from a confident /100 to a quiet break-in chip (hero leads on the place, not the number). The always-modeled §3 customer / §4 space / §5 visitors still break the strip and render full-grade even on the thin city.
- **375 behaviour.** Everything stacks one column, hero score sits above its band, the §8 neighbourhood grid drops to two columns, the §6 owner-keep and §10 peer rows collapse their right-hand value column under the bar (the existing `@media(max-width:560px)` rules for `.lflrow` already do this; extend the same to the new margin column so no horizontal scroll appears).

## cell completion plan (E:/atlas/cell-london-restaurants.html)

### Full locked section set vs what is present

| # | section (spec id, label) | in HTML? | graphic / component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 0a | masthead , Business + place + anchor revenue | yes | quiet hero + `stats-card1` KPI row + KEEP visx `RangeStrip` | One Newsreader hero number (`$503K`), oversized, tabular; RangeStrip directly under it with a TYPICAL mark + p10/p90 ticks; three calm stat tiles. The page's most whitespace lives here. | RangeStrip is geometrically wrong: TYPICAL mark sits at `left:50%` but $503K is not the midpoint of $252K-$905K (it is ~38% of the way). Span is hardcoded `0-90%` with no relation to the ticks. Recompute mark + span from the real p10/p50/p90. |
| 0b | make-it-yours calculator | yes | bespoke calc card (shadcn `card`+`input`+`switch` shape) | Single-column, "your scenario", resting-state sliders with a worked result; one terracotta tone only on the result line. | Result is decoupled from the inputs (static $48,000 regardless of slider positions, which is fine for a mockup), but the result number should read `$48K`-rounded to match the hero rounding rule, and the masthead says take-home `$48K` while the calc says `$48,000` , unify the rounding. Add one `switch` affordance (e.g. "include owner's draw as a cost") to honor the spec's switch call. |
| 1 | honest-take , The honest take | yes | `cta10` calm accent panel (buttons omitted) + break-in `ScoreBand` | Verdict in Newsreader-adjacent weight, one short line; ScoreBand "easier/harder to break in" tick beside it. Calm atlas-50, never loud. | Missing the modeled-data honesty line the spec mandates ("read the modeled dollars as a starting point, not a measured local number"). Break-in is a bespoke gradient bar, not the site-wide `ScoreBand` grammar , re-skin to the ScoreBand shape (segmented band + tick + label) so it matches country/industry/vs-world. |
| 2 | narrative , In context | yes | quiet prose block, narrow measure | LOWEST visual weight: two sentences at ~65ch, ink-600, generous lead. The page's quietest band. | Compliant. Keep it to two sentences (currently three short clauses , fine). No chart. |
| 3 | plain-terms , In plain terms | yes | `feature43` icon grid re-skinned as unit cards | Icon-led tangible-unit cards (covers/day, average spend, people on payroll). Few, big, airy. | Icons are generic glyphs (`★`, `£`, `●`). Replace with three distinct line icons (plate/cover, coin/spend, people/payroll) so it does not read as filler. "Average spend $12" vs hero math: 140 covers x $12 x 360 days ≈ $605K, but hero revenue is $503K , reconcile the plain-terms numbers so they back-solve to the hero (e.g. ~$10 spend or ~115 covers), or the page fails the common-sense check. |
| 4 | money , Where the money goes | partial | KEEP kit `Waterfall` (+ optional 100%-wide stacked div) | Per-$100 **waterfall**; kept row gets the lone atlas-500 tick, costs in cocoa/ink neutrals. Never a pie. | Currently rendered as a 100%-wide **stacked bar**, not the specified `Waterfall`. Spec wants the waterfall as the primary (the stacked div is the *optional* companion). Add the waterfall (descending steps from $100 down to the $10 kept), keep the stacked bar as the secondary read. Also: kept slice is `moss-600` but labeled as the emphasis , the spec says kept gets the lone **atlas-500** tick in the waterfall; keep moss for the kept *mass* but mark it with the atlas tick. |
| 5 | cost-drivers , What moves the cost | yes | ranked horizontal bars (`ComparisonBars`-family, single-series) | Ranked bars of the largest non-kept lines, lighter, riding off #4 with no competing chart shell. | Compliant and correctly demoted (no card, lighter). Minor: add the rent line's full label and consider a 4th bar ("Everything else $12") so the ranking is complete, or note it is top-3 only. |
| 6 | owner-take-home , What the owner keeps | yes | KEEP `ScoreBand` OR kept-vs-gone single bar; ONE optional radial | Kept-vs-gone bar with kept slice in moss; take-home dollar repeated tabular. Optional margin radial only if it earns the moment. | Present as kept-vs-gone bar (good). The big `$48,000` repeats the take-home (good). Decide on the optional radial: spec allows ONE re-skinned radial for a hero moment , recommend NOT adding it here (the masthead already owns the hero; a radial would be a second focal point). Leave as the bar. |
| 7 | break-even , Break-even | yes | KEEP kit `ThresholdGauge` | Amber-below / moss-above, lone atlas tick at break-even, quiet "typical day" tick to the right. One sentence above. | Scale bug: track implies a max of 200 covers/day (95→47.5%, 140→70%) but the max is undeclared and arbitrary, so the bar's right end is meaningless. Anchor the track to a stated max (e.g. capacity ~180/day) and recompute both ticks; or make break-even the band boundary and typical a proportional tick within a labeled range. Labels currently overlap the track on narrow widths , give the caption row fixed height. |
| 8 | risks , What to watch | yes | KEEP kit `SeverityGlyph` rows | Severity glyph + title + one calm note per row; rare/watch/serious cues, never an alarmist red wall. | Order: spec says risks moved UP to sit right after money/break-even. Currently risks is correct (after break-even). Bug: `.sev.serious` colors all three bars atlas-red but `.sev.watch`/`.sev.rare` only color 1-2 , verify the third "watch" row reads as 2-of-3, not 3-of-3 (CSS looks right; confirm visually). Keep amber for watch, cocoa for rare, atlas for serious only. |
| 9 | wages , Pay by role | yes | NEW compact range / dumbbell primitive (RangeStrip sibling) | Floating range rows per role (low-median-high), median dot in atlas, bar neutral, 3-4 rows, tabular pay. | The rows show a `fill` span + a `med` dot but no low/high end labels, so "low to high with median marked" is not legible , add the low and high values at the bar ends (the dumbbell endpoints), not just the median. The `fill` left/width values are eyeballed against an undeclared axis (what does `left:60%`/`width:37.5%` map to in £?) , declare a shared pay axis (e.g. $0-$80K) and place all three rows on it consistently so head chef visibly sits higher than server/porter on the SAME scale. |
| 10 | startup-cost , Cost to open | yes | stacked cost bar (kit stacked primitive / `chart-card1` stacked) | Single horizontal stacked bar (fit-out / kit / deposits / float), one total in Newsreader weight. Calm cocoa stack, one atlas total. | Math bug: segments are 51+26+11+12 = 100% but the legend values are $180K+$90K+$40K+$40K = $350K, and $180/$350 = 51.4% (ok), $90/$350 = 25.7% (ok), $40/$350 = 11.4% (ok), $40/$350 = 11.4% but the 4th seg is 12% , round consistently so widths sum to 100 AND match the dollar shares. Total `$350K` is Inter, not Newsreader , the spec wants the total in Newsreader weight. |
| 11 | seasonality , Through the year | yes | PORT shadcn `chart-area-gradient` shape, single atlas series | Twelve-month area, soft atlas gradient, stripped axes, one direct "busiest/quietest" label. Serene. | Has the gradient area (good). Missing the single direct in-chart label ("busiest" near Jul/Dec, "quietest" near Jan/Feb) , add one calm annotation instead of relying on the prose. `preserveAspectRatio="none"` will distort the stroke width on wide screens , set it to keep aspect or use vector-effect non-scaling-stroke. Add a baseline/axis hairline so the area has a floor. |
| 12 | first-year , Your first year | yes | KEEP kit `TimelineRibbon` | Four time-tagged milestones; break-even node carries the single atlas dot. Horizontal, airy. | Compliant; break-even node correctly emphasized (`.tl.em`). The connecting `.tl-line` is `left:6%;right:6%` , confirm it visually connects all four nodes (it spans the row, fine). The "30 in 100 do not make it" stat , keep, it is exemplar-tagged. |
| 13 | nearby , The same business nearby | yes | KEEP kit `LikeForLikeBars` (honesty rail load-bearing) | Like-for-like comparable cities only, honesty rail kept, subject (London) in atlas, peers neutral. | Compliant: honesty caveat present, subject in atlas, peers cocoa. This is the strongest section. Keep. Confirm bar widths track the dollar values proportionally (London $503K=100%, Edinburgh $412K should be 82% , 412/503=81.9%, correct; Bristol 392/503=78%, correct; good). |
| 14 | operator-voices , Operator voices | partial (collapsed) | calm `SectionEmpty` / static quote wall on exemplar | On London (this exemplar): the spec says render a quiet static quote wall, no avatars, no fake names presented as data. Off-exemplar: fold into the strip. | Currently folded into the "still filling in" strip as a chip. Because this is the LONDON exemplar (the ceiling), the spec wants the quote wall SHOWN here, not collapsed. Decision needed (see Density section): either add a 2-3 quote static wall (clearly exemplar-tagged, no headshots), or keep it in the strip and accept that the mockup does not demonstrate the wall. Recommend adding a small static wall so the founder sees the ceiling, since the deliverable's job is "show the best self". |
| 15 | vs-world , Versus the world | no (collapsed) | KEEP `ScoreBand` vs global median (one site-wide grammar) | When held: ScoreBand with a global-median peer tick. When not: calm SectionEmpty in the strip. Never a fabricated world number. | Correctly collapsed into the strip (no held global read , honest). Keep in the strip. This is the intended demonstration of the collapse behavior; do NOT invent a world number. |
| 16 | related , Related | yes | `cta10` / quiet gallery grid of links | Plain link tiles to nearby businesses + places, calm hand-off, the page's last breath. | Compliant. Note: the spec says the page's CLOSING LINE is "one thing to remember", reused from the honest-take verdict, rendered just ABOVE related. That line is missing , add a single Newsreader-weight verdict line ("A busy room, a thin margin: the lever is pricing power, not volume.") immediately before the Related grid. |

Also missing globally vs the block menu: a real `navbar1`-shape nav (current header nav items are non-link `<span>`s , the spec block is the mobile-sheet navbar) and a `footer7`-shape footer (current footer is a single line, acceptable for a mockup but thin).

### Missing sections to add

1. **Waterfall (within #4 money)** , the per-$100 figure is currently ONLY the stacked bar. Add the kit `Waterfall`: descending steps starting at $100, stepping down by Cost of goods $30 → Payroll $33 → Rent $15 → Everything else $12, landing on the kept floor $10 marked with the lone atlas-500 tick. Keep the existing stacked bar as the optional companion read directly beneath it.
2. **Operator voices wall (#14)** , because this is the London exemplar (the ceiling shot). Two to three short static pull-quotes, no avatars, no invented attributed names presented as data; tagged as exemplar voices, not a live read. Exemplar content: a line on rent pressure, a line on keeping kitchen staff, a line on pricing power , drawn from the same three honest-take levers so nothing new is fabricated.
3. **"One thing to remember" closing line** , a single Newsreader-weight verdict line just above Related, reused from the honest-take verdict (per spec note line 29). London-exemplar copy: pricing power is the lever, volume is not.
4. **Wage range endpoints (within #9)** , add the low and high pay values at each dumbbell's ends (head chef ~$45K-$78K, server ~$26K-$36K, kitchen porter ~$23K-$26K, illustrative London exemplar), so the "low to high" claim is visible, not just the median dot.
5. **Seasonality annotation (within #11)** , one direct in-chart label ("busiest" ≈ Jul/Dec, "quietest" ≈ Jan/Feb), atlas-toned, replacing reliance on the prose alone.
6. **Switch affordance (within #0b calculator)** , one `switch` row in resting state (e.g. "Count owner's draw as a cost") to honor the shadcn `switch` call in the spec and show the calc is more than three sliders.

(Everything else in the locked set is already present; this page is the most complete of the six.)

### Graphics + correctness issues in the current HTML

1. **RangeStrip TYPICAL mark is geometrically false.** `.typ` is `left:50%` and `.span` is `left:0;width:90%`, both unrelated to the ticks $252K / $679K / $905K. $503K is ~38% of the way from $252K to $905K, not 50%. The mark, the span, and the three ticks must derive from the same p10/p50/p90 scale. Also the middle tick is $679K but the label above says "Typical $503K" , the tick under the TYPICAL mark must be $503K, and the right tick should be the true p90. Fix: pick one axis (p10=$252K=0%, p90=$905K=100%), place TYPICAL at (503-252)/(905-252) ≈ 38.4%, and relabel ticks p10 / p50 / p90 to match.
2. **Break-even gauge uses an undeclared, arbitrary 0-200 scale.** 95/day at 47.5% and 140/day at 70% only works if the max is 200, which is never stated and makes the bar's right edge meaningless. Anchor to a stated capacity (e.g. ~180/day) and recompute, or restructure so break-even is the amber/moss boundary and typical is a labeled tick within a stated range. Caption spans overlap the track at narrow widths , reserve caption height.
3. **Money split is a stacked bar where the spec mandates a Waterfall.** Off-spec primitive choice (see #4 above). Not wrong-looking, but it is not the agreed graphic for this section.
4. **Plain-terms numbers do not back-solve to the hero revenue.** 140 covers x $12 x ~360 days ≈ $605K vs the hero $503K. Two illustrative numbers that contradict the headline fail the common-sense rule. Reconcile (lower the spend or the covers) so day-to-day math reconstructs ~$503K.
5. **Take-home rounding is inconsistent.** Masthead/tiles say `$48K`; calculator and owner-keeps say `$48,000`. The hero-rounding rule is nearest $1,000 with no false precision , present one form site-wide (recommend `$48K` to echo the hero).
6. **Startup-cost segment widths vs dollar shares are inconsistently rounded.** Widths 51/26/11/12 vs shares 51.4/25.7/11.4/11.4. The 4th seg (12%) does not match its $40K share (11.4%) and the 2nd (26%) rounds up from 25.7. Recompute widths from the dollars so the bar is honest. Total `$350K` should be Newsreader weight per spec, currently Inter.
7. **Wage bars have no declared axis.** `left`/`width` percentages are eyeballed; without a shared pay scale the rows are not comparable and the median dots float arbitrarily. Put all three roles on one declared axis and add endpoint labels.
8. **Plain-terms icons are generic placeholder glyphs** (`★`, `£`, `●`) , reads as AI filler. Replace with three distinct, meaningful line icons.
9. **Seasonality SVG `preserveAspectRatio="none"`** will stretch the 2.5px stroke unevenly across viewport widths and the area has no baseline hairline. Use a non-distorting aspect (or `vector-effect:non-scaling-stroke`) and add a faint floor line.
10. **Break-in tick is a bespoke 3-color gradient bar, not the `ScoreBand` grammar.** The spec wants the SAME ScoreBand shape used on country/industry/vs-world (one site-wide grammar). Re-skin to a segmented band + single tick + label so the visual language is consistent.
11. **Honesty: the modeled-data flag is absent.** Sections #2/#3/#4/#5/#7 are modeled-from-national-pattern; the spec requires one honest line in the honest-take body tagging the modeled dollars as directional. It is missing , add it (one calm sentence), or the page over-claims precision.
12. **Header nav items are dead `<span>`s, not links/`<a>`** , fine visually but should be the `navbar1` shape with a mobile sheet for the 375 requirement; at minimum make them anchors with focus states (WCAG/tap-target law).
13. **Minor off-brand check , two color families in one band.** The per-$100 stacked bar uses cocoa-300, cocoa-500, ink-700, cream-400, moss-600 (five fills). That is within the law (neutrals + moss-for-kept) , confirm no atlas-red leaks into a cost segment (it does not, good). Keep it that way in the new waterfall.

### Density + rhythm + collapse

**Section weighting (to keep it spacious, not a wall):**
- **Big (full breathing room, the page's two-and-a-half anchors):** the masthead (#0a, the most whitespace on the page, hero number + RangeStrip + tiles owns the first screen), money/where-it-goes (#4, the one real waterfall + companion stacked bar), and break-even (#7, full-width gauge). These three are the only sections that earn a full chart-card moment.
- **Quiet palate-cleansers (deliberately low weight, between the chart runs):** narrative (#2, two sentences at 65ch, the quietest band), the new "one thing to remember" line (single verdict, just above related), and the "still filling in" strip (low-contrast band). These break up the long visual run so it never reads as nine charts back-to-back.
- **Light continuations (no fresh card shell):** cost-drivers (#5) rides directly off the money chart as a lighter ranked list; plain-terms (#3) is a few big airy unit cards, not a dense grid. Owner-keeps (#6) stays a single bar, not a radial, so it does not become a second focal point against the masthead.
- **Calm one-visual-each rhythm:** risks (#8) → wages (#9) → startup (#10) → seasonality (#11) → first-year (#12) → nearby (#13) each carry exactly ONE visual, alternating between rows/bars (risks, wages, drivers), a stacked bar (startup), an area (seasonality), and a ribbon (first-year) so no two same-shaped charts sit adjacent and no two charts fight on one screen.

**What folds into the ONE "still filling in" strip:**
- On THIS London-exemplar page, the strip carries **vs-world (#15)** only (no held global read , honest, never a fabricated world number). 
- **Operator-voices (#14)** is the judgment call: the spec says show the static quote wall ON London. Recommend pulling operator-voices OUT of the strip and rendering the small static wall (it is the exemplar's ceiling), leaving the strip to demonstrate the collapse with vs-world alone. If the founder prefers the strip stays a two-chip demo, keep both chips , but then the mockup does not show the quote-wall ceiling, which is its job.
- The strip is the mechanism that keeps the page honest without printing dashed empty cards: a single low-contrast band, muted section labels as chips, one honest line ("These fill in as we hold a local read for this place."). Every unheld section routes here, never its own greyed-out shell.
- At 375 the strip and every chart reflow to full width single-column with no horizontal scroll; the RangeStrip, waterfall, gauge, dumbbell rows, and area each go full-width; the stat tiles and unit cards stack; the dumbbell rows must keep their low-median-high endpoint labels legible when stacked.

Files referenced: current mockup `E:/atlas/cell-london-restaurants.html`; spec `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/05-cell.md`, `00-ideology-and-design-law.md`, `01-component-and-chart-system.md`.

## industry completion plan (E:/atlas/industry-restaurants.html)

### Full locked section set vs what is present

| # | section (id) | in current HTML? | graphic / component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 1 | `hero` , verdict model read | **partial** | Answer-hero pattern: Newsreader verdict H1 + one anchor number in display tabular figures + KEEP-kit `RangeStrip` (single thin band) + `AtlasPictogram` eyebrow + `ActivityPlacePicker` + 3 `stats-card1` tiles | Verdict H1 in Newsreader ~clamp(2.5,5vw,3.75rem); one anchor ($1.0M) in display tabular figures; RangeStrip a single thin band; no tier chip, no London fill; place picker the one primary action, full-width on mobile | Present and strong, but RangeStrip tick/typ geometry is wrong (see bugs §); pictogram is a star glyph, not a real `AtlasPictogram`; the secondary "across cities" quiet link called for in the spec is missing; tiles should sit on `stats-card1` rhythm |
| 2 | `honest-take` , the honest take | **yes** | `cta10` reskinned as calm accent panel (buttons omitted) | One short serif verdict line + up to two plain points on warm atlas-50 ground, generous padding, no icons | Sound. Minor: square bullet `::before` reads as a faint side-accent dot; keep but verify it is not mistaken for the banned side-stripe |
| 3 | `how-it-works` , model anatomy | **yes** | `feature43`/`feature108` reskinned as `BeatCard` with a signal-word `dl` | Primary search H2 ("How restaurants make money"); each cost stage one qualitative word in display type, tone-colored (moss/atlas/clay); 2-col desktop, stack mobile; most room of any section | Present and is the page's strongest beat. Stage-3 "Light" uses moss `good`; conceptually fine. Per the bar-soup QA note this must visually own its section, currently it is fine. No fix beyond promoting word size slightly |
| 4 | `money` , where the money goes (per $100) | **yes** | KEEP-kit `Waterfall` shape rendered as one 100%-wide stacked bar (`bar100`) + `MoneyGoesBreakdown` legend | One per-$100 bar, kept row in moss, cost rows cocoa/ink; direct labels, tabular figures, never a pie; shares stated as place-stable | **Numbers do not sum to 100 and contradict the rest of the page** (see bugs §): segments are 30+33+15+12+10 = 100 but COGS is labelled $30 here vs $35 in the cost stack, and "owner keeps $10" here vs net $8 in the waterfall and 7% in the hero. Reconcile to ONE canonical split |
| 5 | `typical-operator` , a typical operator | **partial** | `PlainTerms` (data-table1 sibling) | Plain term/value rows, no fabricated headcount, quiet, lots of line-height, no chart | **Currently rendered with the `wages` range-bar component (`.wage`/`.wtrack`/`.med`), i.e. a chart, which the spec explicitly forbids for this section ("no chart")**. Also the dots at 7% / 30% / 65% / 80% on a shared track invite false comparison. Re-render as a plain term/value `PlainTerms` list |
| 6 | `where-it-earns` , where it earns most | **yes** | KEEP-kit `LikeForLikeBars` over the US-state cohort only + honesty rail | Like-for-like ranking, US states only, ordered by after-tax take-home; honesty rail copy stays; rows open the cell page | Mostly correct. New York is marked `.subject` (atlas highlight) with no reason to be the subject on an activity page with no place picked, reads as an arbitrary spotlight. Bar widths look hand-eyeballed vs the values (see bugs §). Rows are not actual links |
| 7 | `margin-waterfall` , the cost stack | **yes** | KEEP-kit `MarginWaterfall` (true vertical cut-by-cut cascade) | The deepest read; atlas for the surviving bar, cocoa for the cuts; the gap top-to-bottom is the punchline; generous vertical room, direct labels | The cascade is structurally right but the cut bars are positioned as if floating from the previous level when they actually start at left:0 (it is a stacked bar, not a true waterfall offset). The "less running costs" row shows op $18 with a $47 cut beginning at 18% , the visual does not read as "$47 removed from the $65 gross". Make cuts start at the surviving edge of the prior bar (see bugs §) |
| 8 | `cost-drivers` , what moves the cost | **yes** | `CostDrivers` brand block (feature43-style impact rows) | Same per-$100 cost lines recast as levers, ranked by impact, no new numbers; quiet, scannable | Correct shape. Values ($33/$30/$15/$12) must match whatever canonical per-$100 split §4 settles on, currently they match §4 but not §7. Reconcile |
| 9 | `related-links` , go deeper | **yes** | `cta10` / Gallery grid of sibling cards | Taxonomy rail, NOT a ranking; uniform sibling tiles with pictogram + examples; calm hand-off | Correct and on-message. Missing the pictogram per tile the spec calls for; tiles carry no example businesses. Minor enrichment only |
| 10 | `one-thing` , one thing to remember | **yes** | `OneThing` close block | One sentence, serif, lots of air; lastChecked date small + muted | Correct. Good |

Coverage: all 10 locked sections are physically present. The gaps are render-quality and correctness, not missing sections, except that several spec-required sub-elements (real pictogram, secondary hero link, per-tile examples) are absent, and two sections (4 and 7) carry numbers that disagree.

### Missing sections to add

No locked section is absent. What is missing are required sub-elements and the honesty-system proof the spec demands:

- **Sticky section-nav rail (xl/1280)** , the spec's 1280 layout is "left body column + sticky section-nav rail". The current HTML has only a single centered column. Add a right-hand sticky nav rail at >=1280 listing the 10 beats (anchor links), collapsing to a chip row at 375. This is part of the locked deliverable, not optional polish.
- **Hero secondary action** , the quiet "across cities" / "compare" link beside the place picker (spec §22: "the secondary is the quiet across-cities link"). Currently only the primary "See this place" button exists.
- **Real `AtlasPictogram`** in the eyebrow (sections 1 and 9) , currently a `&#9733;` star. Port a small inline-SVG pictogram glyph (fork/knife or plate) on the atlas accent, quiet, replacing the star.
- **Per-tile examples + pictogram in related-links** , each sibling tile should carry a pictogram and one or two example trades, per the spec ("uniform sibling tiles with pictogram + examples").
- **The thin-trade honesty proof** , spec §50 + §27 require ONE thin-trade variant or annotation showing (a) a section collapsed to its calm `SectionEmpty`, and (b) the hero leading with the **kept-share fallback** ("Kept by the owner per $100 of sales, before any place is picked") in the kept/moss treatment, with no dashed number. The current mockup only shows the collapse strip; it does NOT demonstrate the kept-share-fallback hero. Add this as a second annotated hero block (or a small inline "thin-trade variant" panel) so the founder can see the honesty system, not just be told about it. Data: kept-share = the 7-8% net recast as "8 on the dollar" in moss, no revenue figure.

Data the page should carry (real restaurant model / US-state exemplar, all illustrative-of-trade and labelled as such):
- Hero anchor: $1.0M typical annual revenue, band $420K to $2.3M, 7% net, 65% survives direct cost, owner take-home $32K to $190K. (Keep, but reconcile the per-$100 derivation , see below.)
- Where-it-earns: US states only, after-tax take-home, ordered , NY $118K, CA $111K, FL $96K, TX $92K, IL $84K, OH $74K. (Keep; drop the arbitrary NY subject highlight.)
- One canonical per-$100 split used by §4, §7, and §8 (the single most important data fix , see next).

### Graphics + correctness issues in the current HTML

1. **The three per-$100 splits disagree , the single worst correctness bug.** Reconcile to ONE canonical set used everywhere:
   - §4 "Every $100": COGS $30, payroll $33, rent $15, else $12, owner $10 (sums 100, net = $10).
   - §7 cost stack: less direct $35 (so COGS = $35), less running $47, less fixed+tax $10, net = $8.
   - Hero: net 7%; §5: "7% per dollar"; §8 levers: payroll $33, COGS $30, rent $15, else $12 (matches §4, not §7).
   - These cannot all be true. Pick one. Recommended canonical (matches the hero's 7% and the "65% survives direct cost" thesis): COGS $35, payroll $33, rent $12, everything else $13, owner keeps $7. Then §4 owner row = $7 (moss), §7 net = $7, §8 levers reference the same lines. Update the §4 bar segment widths and `$10` key tag, the §7 waterfall final bar (currently 8%) to 7%, and the §8 driver values + bar widths together. **Until these agree the page fails the honesty bar (it shows three different "what the owner keeps" numbers).**

2. **§7 waterfall is a stacked bar, not a true waterfall.** A cut-by-cut waterfall should show each cut starting at the *surviving edge of the prior level* and removing rightward, so the eye sees the bar shrink. Currently every `wf-bar` starts at `left:0`:
   - "Less direct costs" row: gross $65 at left:0 width 65% + cut $35 at left:65% , reads OK by luck.
   - "Less running costs" row: op `$18` bar at left:0 width 18% + cut $47 at left:18% width:47% , this implies running costs are removed from an $18 base, not from the $65 gross. The cut should sit on the gross level (start at 18%, i.e. the new survivor edge) reading as "$65 drops to $18". The geometry is muddled. Rebuild so each row shows: faint full prior-level track, the surviving (new lower) bar in cocoa/atlas, and the removed slice clearly hanging off the right of the new survivor. The final "Net, what is kept" bar must be terracotta and its width must equal the canonical net (7%). The spec's punchline ("the gap between top and bottom bar is the whole game") is currently not legible.

3. **§1 RangeStrip tick placement is eyeballed and inconsistent with its own ticks.** The typical marker `.typ` is at `left:46%` and the ticks read $420K / $1.0M / $2.3M evenly spaced under a band that runs `left:0;width:92%`. If $420K is the band's left edge (0%) and $2.3M is the right edge (92%), then $1.0M should sit at (1.0-0.42)/(2.3-0.42) = 30.8% of the band, i.e. ~28% of full width, not 46%; and the center tick label "$1.0M" printed at the midpoint (50%) does not align with the marker. Recompute: place the band to a real min/max, place the typical marker at the data-proportional position, and align the three tick labels to the actual min / typical / max x-positions (not evenly spaced). Right now a reader who checks the geometry sees a wrong number , the launch bar forbids visibly-wrong numbers.

4. **§5 typical-operator uses a chart and a shared-scale track that invites false comparison.** Four unrelated facts (65% survives, 7% reaches owner, "Light" capital, 80-in-100 open) are drawn as range bars on one shared `.wtrack` width scale, so "7%" looks tiny next to "80 in 100" as if they are the same unit , they are not (a margin %, a survival count, a qualitative word). The spec says PlainTerms, **no chart**. Replace with quiet term/value rows. Also "Light" rendered as a 30%-width bar invents a numeric value for a qualitative fact.

5. **§6 where-it-earns bar widths are hand-eyeballed, not proportional.** NY $118K = 100%, CA $111K should be 94.1% (is 94%, ok), FL $96K should be 81.4% (is 82%), TX $92K = 78% (is 78%, ok), IL $84K = 71.2% (71%, ok), OH $74K = 62.7% (63%, ok). Close enough that it is defensible, but normalize all to one formula (value/118*100) so they are exactly proportional and the small drift is gone. Remove the `.subject` highlight on New York , there is no subject on a no-place activity page, and an arbitrary terracotta spotlight reads as a value judgement / cross-rank crowning, which the honesty law bans. Make each row an actual link to the cell page.

6. **Eyebrow pictogram is a literal star (`&#9733;`), off-brand.** The spec wants `AtlasPictogram` (a sector glyph). The star reads decorative and generic ("AI made that"). Replace with a small quiet inline-SVG sector mark in atlas-700.

7. **§3 stage colors: "Capital to start , Light" uses moss (`good`).** Asset-light is genuinely positive for this trade, so moss is defensible, but verify it is not read as "low number good" inconsistently with stage 1 (input cost "Light" also moss) , both are coherent. No change required; flag only to confirm the tone mapping (moss=good, atlas=bad, cocoa=flat) is applied consistently. Stage 2 "High" and stage 4 "Thin" correctly use atlas `bad`. OK.

8. **No focus/hover affordance on the interactive-looking controls.** The place picker controls, the "See this place" button, the where-it-earns rows, and the related tiles look interactive but only `.reltile` has a hover. For the QA bar (visible focus states, 44px tap targets) add focus-visible rings (atlas-700) and confirm the picker controls and button are >=44px tall (button is 46px via `.go`, ok; controls are 46px, ok). Add hover/focus to the state rows once they become links.

9. **§4 segment with no label inside.** Only the "owner keeps" segment carries an in-bar `$10` tag; the other four segments are bare colored blocks relying on the legend. That is acceptable (direct labels live in the legend), but the largest segment (payroll $33) could carry an in-bar label for instant reading. Minor.

10. **Footer copy says "owner keeps ... per-$100 figures are illustrative."** Good honesty. But it also says "real model margins" while the three margin readings disagree (bug 1). Once reconciled, the claim becomes true; until then the footer overstates accuracy.

### Density + rhythm + collapse

Section weighting (keep the big/quiet contrast the spec mandates , breathing room from whitespace, never from dropping sections):

- **Big (own their screen):** §1 hero (verdict H1 + anchor + RangeStrip, screen one), §3 how-it-works model anatomy (the distinctive move, the most vertical room and the largest signal-word type), §7 the cut-by-cut waterfall (the punchline, generous vertical room, visually owns the "the gap is the whole game" moment). These three are the spine.
- **Quiet (low, scannable, lots of line-height):** §2 honest-take panel, §4 per-$100 bar (one calm horizontal bar inside the how-it-works beat, not a third loud chart), §5 typical-operator PlainTerms, §6 where-it-earns ranked list, §8 cost-drivers levers, §9 related rail, §10 one-thing close.
- **Bar-soup guard (the page-specific QA risk):** §4 (one horizontal 100-unit bar), §6 (ranked like-for-like list), §7 (the only true vertical waterfall) must each have a visibly distinct shape and card rhythm so they do not read as three identical bar grids. Currently §4 and §8 are nearly identical horizontal cocoa bars stacked close together , differentiate by giving §8 the "levers, all down" framing with impact dots/ranking and a different card ground, or move §8 further from §4 with a quiet divider, so the three bar shapes stay distinct.
- **Rhythm:** keep `section.block + section.block` hairline dividers and the ~52px vertical padding; the spec's `space-y-6 md:space-y-8` between beats is already approximated. Promote §3 signal-word type one step so the anatomy clearly outranks §4's bar beneath it.

Collapse (the unheld sections fold into ONE calm "still filling in" strip , already done, keep it):
- The single strip currently carries: Pay by role, Cost to open, Through the year, First-year survival, Operator voices. That is the right set , these are the London-only rich sections (wages, startup cost, seasonality, first-year timeline, locals/testimonials) that an activity page with no place picked cannot fill honestly. Keep them collapsed to the one strip with the calm "Still filling in for restaurants, before a place is picked:" line. Do NOT expand any into a fake-data section.
- One refinement: the strip currently sits between §8 and §9. That placement is good (after the model content, before the hand-off). Keep it as the single collapse point , resist scattering empty boxes, which is the spec's named failure mode for thin trades.
- Honesty-proof addition (from "Missing sections"): the thin-trade kept-share-fallback hero should be shown as a small annotated variant, not woven into the live restaurant hero, so the spacious main page stays intact while still proving the SectionEmpty + fallback system in one place.

Files referenced: page E:/atlas/industry-restaurants.html; spec E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/07-industry.md, 00-ideology-and-design-law.md, 01-component-and-chart-system.md; design-system reference E:/atlas/cell-london-restaurants.html.

## neighbourhood completion plan (E:/atlas/neighbourhood-west-end.html)

### Full locked section set vs what is present

The spec's locked order has 11 numbered sections, but `streets` appears twice (id `streets` at #4 = "Street by street" placeholder, and id `streets (prime)` at #8 = "Prime streets" real). The current HTML also adds a non-locked "Related" closer. The table below lists EVERY locked section in spec order, plus the present extras.

| # | section (id) | in current HTML? | graphic/component to render it | render note (how it should look) | fix needed |
|---|---|---|---|---|---|
| 1 | District hero, answer-first (`headline`) | partial | `AnswerFirstMasthead` + `ScoreBand`-as-multiplier-gauge (0.4x..3.0x track, 1.0x baseline pinned, top-trade marker) + three-kind pill row | District name in Newsreader H1; winner line in big serif; gauge directly under as the ONLY first-screen chart; eyebrow coordinate links quiet; price/tag/character pills as one tinted-vs-cream row | Present but the **gauge geometry is wrong** (the `.span` overshoots, the marker sits literally at `left:100%` off the track edge, the right key label clips). The winner number "2x or more" is in plain `.serif` but should be the single Newsreader hero figure with more air. See bugs below. |
| 2 | The honest take (`honest-take`) | yes | `cta10` calm accent panel (buttons omitted) / `HonestTakeBox` | Single cream-on-cream (here atlas-50) panel, verdict in medium serif, up to 3 plain Inter points, modeled-not-measured caveat as quiet body | Largely correct. Panel uses `atlas-50` tint, acceptable as "calm accent panel." Minor: verify it is not reading as a second loud color block stacked against the hero's atlas gradient (see rhythm). |
| 3 | What thrives here (`thrives`) | yes | `LikeForLikeBars` (rail-clamped) rows clickable into cells + a `stats-card1`-style one-trade decomposition mini-grid | Zero-based bar set, winners on top, the **lone** trade the district truly rewards in atlas fill, rest cocoa; decomposition card scoped to ONE trade | **Correctness bug:** four rows render the atlas/cocoa fill at `width:100%` AND only Hotels carries `.subject` (atlas). Restaurants/Cafes/Bars are at 100% width but cocoa, so four bars are visually identical-length, which is the intended "band" read, but the decomposition card's parts (1.18x, 1.91x, **2.00x**) are false-precise and one (character "2.00x") looks invented. See bugs. |
| 4 | Street by street (`streets`, placeholder) | partial | `StreetCharacter` / `SectionEmpty` empty state, folded into the collapse strip | One compact `SectionEmpty` row inside the "still filling in" strip, never a dashed card, never a fake tag | Present inside the strip ("Per-street character is not mapped yet"). Correct location. Keep as the sole genuinely-thin row. |
| 5 | Who lives and shops here (`who`) | yes | `WhatLocalsKnow` visual list (not prose wall) | 2 to 3 scannable "who the customer is" lines, quiet eyebrow, no chart, breathing room between the two modeled blocks | Present as `.whoknows`. Acceptable, but item 2 and 3 run long (near-paragraph), drifting toward a prose wall; tighten to scannable lines. |
| 6 | Cost to operate (`operating-cost`) | yes | `BreakEvenLine` headline + a single mini horizontal bar vs the 1.0x baseline (one-row `LikeForLikeBars`) | One clear "rent runs about 2x or more vs the rest of the city" sentence + "a revenue lift is not a profit lift" caution; the bar is the only visual, with a pinned 1.0x baseline tick | Present. The baseline row renders at `width:33%` with an `ink-700` fill while the subject is `100%`, no actual **pinned baseline tick** as the spec asks. Acceptable as a two-row like-for-like but consider a real 1.0x tick for fidelity. |
| 7 | Versus next door (`adjacent`) | yes | `LikeForLikeTable` (same rep trade, one city) | This area always column one; up to 3 curated siblings; same rep trade + character rows; leader mark allowed (one city); compact, tabular, footnote explains model; scrolls in its own track at 375 | Present and well-built. **Inconsistency:** South Bank shows a false-precise "+136%" while everything else is rail-clamped to "2x or more" — the clamp must be applied uniformly or "+136%" must be intentional and below-ceiling. The `.leadmark` "leads" CSS pseudo-element is defined but never used in markup, so no leader mark renders. See bugs. |
| 8 | Prime streets (`streets` prime) | partial | 2-col card grid (`feature`-grid skin), per-street rent/spend chips self-omit | Mounts ONLY with a curated record; each card: street name in serif, what it sells, optional rent-vs-city + spend-per-visit as quiet tabular chips | Present with Oxford Street + Covent Garden cards. **Missing the spec's quiet tabular chips** ("Rent and spend chips show where a real figure is held," promised in the section's own lead copy but no chip is rendered). Add chips or drop the promise from the copy. |
| 9 | On the ground, texture (`ground`) | yes | 2-col owned `feature`-style text grid (Food / Don't miss) | Two short columns, a knowledgeable local aside, self-omits when no flavor | Present (Food scene / Don't miss). Correct. Minor duplication: the "one street off the drag" point appears here AND in operating-cost AND in one-thing; vary the wording so it does not read as a copy loop. |
| 10 | Sibling rail, the businesses here (`businesses-here`) | yes | `BeatCard` shell wrapping a uniform tile grid | Uniform equal-weight tiles, each with its plain character word, no ranking/scores, quiet hover to atlas | Present as `.sibgrid` with 6 districts. Correct. Note: it lists "Central London" alongside "City of London" + "West London" — sanity-check the sibling set is real/curated and not overlapping (Central vs City of London could confuse). |
| 11 | One thing to remember (`one-thing`) | yes | `OneThing` closer | Warm last word + freshness ("modeled, June 2026") + flag-it, reuses the held verdict | Present as `.onething` (ink-900 dark card). Correct and on-brand. |
| , | Still filling in strip (collapse mechanism) | yes | stacked `SectionEmpty` rows, one calm band | Unheld sections in locked order, visually unified, dot-plus-words "Not held yet" tag | Present but **only carries ONE row** (street-by-street). Correct for the filled London exemplar, but the spec wants the strip to demonstrate the bare-district grammar; one row is fine since London fills the rest. |
| , | Related (NOT in locked set) | yes (extra) | `cta10` / gallery tile grid | "Where to look next" with zoom-out + city tiles + compare button | This is the page's hand-off closer; not in the locked 11 but consistent with the cell page pattern. Keep, but it is the only place a CTA button appears, which the spec says is allowed only as the deepening hand-off, so it is fine. |

### Missing sections to add

The filled London exemplar is unusually complete: **no entire locked section is absent.** What is missing is treatment/data fidelity within present sections, plus the spec's promised sub-elements:

1. **Prime streets, quiet rent/spend chips (section 8).** The lead copy promises "Rent and spend chips show where a real figure is held," but neither card renders a chip. Add a small tabular chip row per card, e.g. Oxford Street: `Rent vs city 3x+` / `Spend per visit, high` — but ONLY where a real figure is held; otherwise drop the promise line. Data: real West End prime-street records (Oxford Street = flagship/high-street retail; Covent Garden = restaurants/theatre). Consider a third real curated street (Regent Street or Bond Street) to fill the 2-col grid to a fuller set.

2. **Operating-cost pinned 1.0x baseline tick (section 6).** The spec wants the bar "vs a pinned city-baseline tick (1.0x)." Currently it is a second cocoa/ink bar at 33%. Add a real vertical 1.0x marker on a single track so the relative-by-design reading is explicit. Data: `rentMultiplier` for West End rail-clamped to "2x or more" against the pinned 1.0x London baseline.

3. **Adjacent table, leader mark (section 7).** The `.leadmark` "leads" affordance is defined in CSS but never placed. The spec permits one leader mark (one city, comparable prices). Wrap the West End restaurants cell (or whichever sibling genuinely leads) in `<span class="leadmark">` so the affordance renders. Data: curated London siblings on the same rep trade (restaurants) and on character.

4. **Hero winner number as the single Newsreader hero figure (section 1).** The spec calls for "the winner line in big serif, the gauge directly under it," with the top-trade lift as the one hero number. Currently the winner line is a 22–32px serif paragraph. Promote "2x or more" to a larger Newsreader display figure (the page's single hero number), consistent with `.hero-num` already defined in CSS but unused on this page.

### Graphics + correctness issues in the current HTML

1. **Multiplier gauge geometry is broken (section 1, the page's headline chart, top priority).**
   - The track math comment says position = `(val , 0.4) / (3.0 , 0.4)`, so 1.0x = `0.6/2.6` = **23.08%** (markup uses 23.1%, OK) and 3.0x = 100% (OK). But the **span** is `left:23.1%;width:76.9%`, which runs to exactly 100%, i.e. the span ends at the 3.0x ceiling, implying the top trade is pinned at 3.0x. The honest reading is "2x or more" (a clamp), not "3.0x." The span should terminate at the rail-clamp position (the 2.0x mark = `(2.0-0.4)/2.6` = **61.5%**, so `width = 61.5% , 23.1% = 38.4%`) with a clear "clamped, reads as 2x or more" treatment, NOT run to the ceiling implying a precise 3.0x.
   - The `.mark2` dot is at `left:100%`, so its center sits ON the right track edge and (with `translate(-50%,-50%)`) half-hangs past it. Move it to the clamp position (61.5%) or, if intentionally at-ceiling, inset it so it does not clip.
   - The right key label uses `left:97%;text-align:right;transform:translateX(-100%)` to dodge overflow, a hand-eyeballed hack. Re-anchor it to the marker's true position with a clean `translateX(-50%)` and enough right padding so it does not collide with the scale row.
   - **Fix:** recompute span end + marker to the clamp (2x-or-more) position, label the segment beyond as "clamped at the model ceiling," and stop the marker clipping the track. This is the radar-equivalent bug for this page: the hero chart currently overstates the number.

2. **Decomposition card prints false-precise + invented-looking figures (section 3).** The parts read Commuter `1.18x`, Tourism `1.91x`, Character tags `2.00x`. The QA bar's #1 risk for this page is exactly the "+200% / false-precise" cringe. "Character tags 2.00x" is not a measured multiplier and reads as fabricated precision. **Fix:** either (a) carry these verbatim from the actual `getNeighborhoodMultiplier` decomposition if they are real model outputs, or (b) demote to honest bands ("commuter pull, moderate"; "tourism pull, very high"; "tags, combined to ceiling") and show the combined result as the rail-clamped "2x or more." Do not print a hand-typed `2.00x` for a tag bundle.

3. **Mixed clamp discipline in the adjacent table (section 7).** Three cells read "2x or more" (clamped) but South Bank reads "+136%" (false-precise). The spec's load-bearing honesty is the uniform rail-clamp; a lone "+136%" either must be genuinely below the ceiling (then label why it is shown precise while others clamp) or be clamped too. **Fix:** apply the clamp uniformly, or if South Bank is honestly below ceiling, render the others' true sub-ceiling values rather than clamping only some.

4. **Unused `.leadmark` and unused `.hero-num` / other CSS (cleanliness).** `.leadmark` (the "leads" pill) and `.hero-num`/`.hero-fig`/`.hero-cap` are defined but never used; `.range`, `.tiles`, `.calc`, `.bar100`, `.drivers`, `.keptbar`, `.gauge`, `.risks`, `.wages`, `.startup`, `.season`, `.timeline`, `.units`, `.reltiles` (partly), `.narrative` are inherited from the cell stylesheet but most are dead on this page. **Fix:** either wire `.leadmark`/`.hero-num` into the markup (preferred, per spec) or prune the genuinely-dead blocks so the file does not carry the whole cell vocabulary unused. Dead CSS is not a render bug but is off-brand for "lead designer" tidiness.

5. **Thrives bars: cocoa rows at 100% width read as winners but lack the subject accent intentionally, which is correct, but the suppressed rows use raw widths 17%/15%/15% (section 3).** These eyeballed widths for "less than half" trades are fine as relative magnitude, but verify they map to a consistent scale (less-than-half should sit clearly below 50% of the ceiling bar; 15–17% is honest). No fix required beyond confirming they are not arbitrary. The bigger issue is the four ceiling bars are pixel-identical, which is the intended band, so keep the caveat copy that explains "none is crowned."

6. **`who` list icons are decorative glyphs (star/circle/square) with no semantic meaning (section 5).** Three different shapes imply three categories but the copy is "who / what they eat / what works," not a shape taxonomy. **Fix:** use one consistent quiet marker (or meaningful icons) so the shapes do not imply a non-existent legend.

7. **Repeated "one street off the drag" line across three sections (6, 9, 11).** Not a render bug but a copy loop that reads as filler. **Fix:** keep the strongest instance (one-thing closer) and vary or cut the others.

8. **No em-dash / source-agency check passes** in the current copy (good); keep it that way in any added copy. Single accent (atlas terracotta) holds; moss/amber appear only as kept/caution in inherited CSS, not misused on this page.

### Density + rhythm + collapse

**Section weighting (keep two big moments, the rest quiet):**
- **Big, owns the first two screens:** the hero (district name H1 + winner line + corrected multiplier gauge + pill row) and `thrives` (the `LikeForLikeBars` ranking + the one-trade decomposition card). These are the only two data-dense moments; give them the most vertical air above and below.
- **Quiet text-led beats with at most one mini visual:** `honest-take` (calm panel), `who` (short visual list, no chart), `operating-cost` (one mini bar + pinned 1.0x tick), `ground` (two short text columns). These breathe between the two heavy blocks. Tighten the `who` items so they are scannable lines, not paragraphs, to protect the exhale.
- **Compact tabular:** `adjacent` (the `LikeForLikeTable`) is dense but small and self-contained, scrolling in its own track at 375.
- **Calm closers:** sibling rail (uniform equal-weight tiles), one-thing (warm dark card), related (hand-off tiles + the single allowed CTA).

**Avoid the two-loud-blocks-adjacent problem:** the hero uses an `atlas-50 -> cream` gradient masthead and the honest-take is also an `atlas-50` panel; stacked, they can read as two atlas blocks in a row. Insert the full `block` padding rhythm between them (already present) and consider letting the honest-take sit on plain cream with only an atlas hairline so the page does not lead with two pink fields.

**Collapse rule (what folds into ONE "still filling in" strip):** on this filled London exemplar, almost nothing collapses, which is correct. The single genuinely-placeholder section is **street-by-street character** (#4), which is already the lone `SectionEmpty` row in the strip ("Per-street character is not mapped yet, Not held yet"). Keep it as exactly one calm row, in its locked position, not a dashed card. The mockup should also demonstrate the bare-district grammar: the strip is the proof that on an uncurated district `who`, `operating-cost`, `adjacent`, prime `streets`, `ground`, and `businesses-here` would each fold into this same stacked strip as compact rows in locked order, while only hero + honest-take + thrives carry weight. For the West End document, only street-by-street belongs in the strip; the rest render in full because the data is curated. Do not let the strip grow into a wall of dashes, and never substitute a fabricated per-street tag to "fill" it.

