# Margin Atlas , Execution Constitution (the graphics & section quality law)

Status: ACTIVE, ratified by founder 40-question interview 2026-06-20.
Relationship to the existing `DESIGN-SYSTEM-CONSTITUTION.md`: that doc governs WHAT (which sections, which chart per data relationship). THIS doc governs HOW each graphic and section is executed, and the quality gate it must pass before the founder ever sees it. Where they conflict, this doc's 2026-06-20 decisions win (the supersessions are listed in section 14).

The problem this fixes (founder, verbatim in spirit): the pages read mediocre because graphics are improvised, not governed. No fixed palette, numbers look AI-generated, rhythm is ad hoc, tables look cheap, sections emphasise the wrong thing, and "fix it, iterate it" forever is not affordable. The cure is a small set of perfected primitives + a hard QC gate + a locked visual law.

---

## 0. North Star

**Precise, serious, data-first. Stripe x Bloomberg.** Cool, exact, engineered. A trustworthy financial instrument, not a warm pamphlet and not a loud fintech ad. Every decision below serves this one feeling. When a choice is ambiguous, pick the more restrained, more exact option.

Three running tests for any graphic or section:
1. **The 2-second test.** Zoomed out, on a phone, can a stranger get the point in two seconds?
2. **The plausibility test.** Is the number right, and does it make real-world sense?
3. **The slop test.** Does anything here look auto-generated (rogue colour, gradient mush, over-bold number, decorative icon, restating subtitle, a chart fighting its labels)? If yes, it fails.

---

## 1. Palette Law

**Allowed colours: terracotta + cool neutrals. Nothing else.** Amber/yellow and green are removed sitewide. Good/bad is carried by **words and position**, never by hue.

Background shifts from the old warm cream to a **cool white/grey** base (the Stripe direction).

### Tokens (replace the warm cream/ink ramp)
```
/* neutrals , cool */
--white:    #ffffff;   /* cards, top surfaces */
--grey-50:  #f6f8fa;   /* page background */
--grey-100: #eef1f4;   /* subtle fills, zebra-free row tint if ever needed */
--grey-200: #e3e8ee;   /* hairline borders (the default border) */
--grey-300: #cdd5df;   /* chart neutral, lightest data grey */
--grey-400: #9aa7b6;   /* chart neutral, mid */
--grey-500: #6b7785;   /* secondary text, captions, axis labels */
--grey-600: #4a5563;   /* chart neutral, dark / body on light */
--grey-700: #323a45;   /* strong text */
--grey-800: #1f2530;   /* headings */
--grey-900: #0e1116;   /* primary text / near-black */

/* terracotta , the ONLY accent (existing ramp, extended) */
--atlas-50:  #fff1ee;  /* faint wash, hover bg */
--atlas-100: #ffe1da;
--atlas-200: #ffc7ba;  /* light data terracotta */
--atlas-300: #fb8469;
--atlas-500: #e62200;  /* THE accent, the "point" colour, the key slice */
--atlas-600: #c11c00;  /* hover/pressed */
--atlas-700: #991600;  /* premium tag text, deepest terracotta */
```

### Encoding rules
- **Terracotta = "the point."** The subject row, the key slice, the value the reader is here for. Use it once or twice per section, never as wallpaper.
- **Everything else is neutral grey.** Context, comparison, structure.
- **Good vs bad is not a colour.** It is the calibrated **word** ("Hard", "Thin", "Strong") plus **position** on a scale. A weak number is not red; it is just stated plainly and sits low on its track.
- **Multi-part charts** (money split, stacked bars) use a scale of **terracotta + greys**: the kept/important segment is the strongest terracotta (`--atlas-500`), the rest are steps of grey (`--grey-300/400/600`). Optionally one light terracotta (`--atlas-200`) for a second emphasised part. Never more than two terracotta tones in one chart.
- **No gradients as fills.** Solid only (see 5.3).

---

## 2. Type System

**One premium grotesk everywhere** (Geist Sans; General Sans is the fallback choice). **Geist Mono** (Space Grotesk acceptable) for all marquee figures. Self-host or load via a single font link. Inter is retired as the primary.

Why: the figures ARE the product. A technical mono on the numbers reads "engineered and exact" and kills the generic-Inter feel the founder flagged.

### The scale (px / weight / tracking)
| Role | Font | Size | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| Movement header (H2) | Geist Sans | 22-24 | 600 | -0.02em | `--grey-900` |
| Card title | Geist Sans | 14 | 600 | normal | `--grey-900` |
| Subtitle (conditional) | Geist Sans | 12 | 400 | normal | `--grey-500` |
| Eyebrow / kicker | Geist Sans | 10-11 | 600 | 0.08em, UPPER | `--grey-500` |
| Body | Geist Sans | 13 | 400 | normal | `--grey-700` |
| Caption / caveat | Geist Sans | 11 | 400 | normal | `--grey-500` |
| **Marquee number** | **Geist Mono** | **28-32** | **500** | **-0.01em** | `--grey-900` or `--atlas-500` |
| Stat number | Geist Mono | 22-24 | 500 | -0.01em | `--grey-900` |
| Small data label | Geist Mono | 11-12 | 500 | normal | context |

Rules:
- **All numbers are Geist Mono, weight 500, tabular.** Never 700. Over-bold default weight is a primary cause of the "cheap" look.
- **Tight tracking on numbers** (-0.01 to -0.02em). It reads deliberate.
- **Titles are sans, hierarchy from size + weight only.** No serif anywhere (the editorial-serif option was declined).
- One accent colour on numbers max: terracotta for the single most important figure, near-black for the rest.

---

## 3. Spacing & Rhythm

**Generous and clearly separated.** Each movement is a distinct chapter with real air.

Spacing scale (only these values): `4, 8, 12, 16, 24, 32, 48, 64`.
- Between movements (the big bands): **48-64px**.
- Movement header to first card: **16-24px**.
- Card grid gap: **16px**.
- Card internal padding: **20px**.
- Inside a card, title to chart: **12-16px**.

### Hierarchy , two clear levels only
1. **Bold movement header** introduces each chapter ("Where the money goes"). 22-24px, weight 600.
2. **Quiet card titles** under it. 14px, weight 600.
No third level. No flat single-level grid.

### Subtitle rule
A subtitle appears **only when it states something the title cannot**: the unit, the reading instruction, or a one-line caveat. Never to restate or decorate. Most cards have no subtitle.

### Card density
**One clear point per card.** Important cards get more room (span more columns); minor cards stay small. No multi-fact bento dumps. Never sparse (a near-empty card is a failure), never crammed.

---

## 4. Chart Craft Standards

These apply to every primitive.
1. **Direct labels on the data.** Each bar/slice/point/row carries its own number, right there. No separate legend to decode where a direct label is possible. (The FT method, the single biggest "looks professional" lever.)
2. **Minimal chrome.** At most one baseline/reference line. **No gridlines, no axis ticks, no chart borders.** The shape + direct labels carry it.
3. **Flat solid fills, no gradients.** Solid terracotta + solid greys. Gradients are banned (top source of slop).
4. **A small set of perfected primitives, reused.** The 8 in section 5. No chart type outside that set without ratifying a new primitive here first.
5. **Nothing overflows its card.** SVG labels must sit inside the viewBox and the card padding. Verified in QC.
6. **Subject is terracotta; context is grey.** One clear emphasis per chart.

---

## 5. The Primitive Kit (the locked 8)

Build each ONCE to standard, reuse by reference. Each has a reference anchor from the founder's resource set (FT Visual Vocabulary / PolicyViz / data-to-viz). The kit + a showcase page is the first deliverable; the founder approves each primitive once, then pages assemble from approved blocks.

| # | Primitive | Data relationship | Use for | Reference anchor |
|---|---|---|---|---|
| 1 | **Stat / KPI** | Magnitude | Headline figures, verdict row | FT "magnitude" single number |
| 2 | **Ranked bars (horizontal)** | Ranking / comparison | Same business nearby, lift levers, pay by role | FT "ranking" ordered bar |
| 3 | **Category bars (vertical)** | Change over time / category | Seasonality, monthly | FT "change over time" column |
| 4 | **Donut** (LOCKED, used sparingly) | Part-to-whole | The money split only | FT "part-to-whole" donut |
| 5 | **100% stacked bar** | Part-to-whole (linear) | Fixed vs variable, cost-to-open, day-part | FT "part-to-whole" stacked |
| 6 | **Range / threshold track** | Position on a scale | Break-even, margin of safety, exit range, ratings | PolicyViz bullet/range |
| 7 | **Line / area (single series)** | Trend | Payback path, distribution | FT "change over time" line |
| 8 | **Table (minimal financial)** | Multi-dimensional detail | Health check, comparisons | FT/Bloomberg data table |

### 5.1 Stat / KPI
- Geist Mono number (28-32 marquee / 22-24 stat), weight 500, tabular, tight tracking.
- Eyebrow label above OR small grey label below. One only.
- Terracotta number only for the single most important stat; else near-black.
- No icon. No box unless grouping a set (then one bordered card holds the set).

### 5.2 Ranked bars (horizontal)
- Rows sorted by value. Subject row terracotta, others `--grey-300`.
- Label on the left (12px sans), value on the right (Geist Mono 12, tabular). The bar is between; no axis.
- Bar height 12-14px, radius 7px (fully rounded ends) OR 2px , pick one in the kit and never mix.
- Max ~6 rows; beyond that, a table.

### 5.3 Category bars (vertical)
- Equal-width columns, gap 5-6px, radius 3px top.
- One baseline only. Hot/peak column terracotta, rest `--grey-300`.
- Month/category labels in 9-10px grey below. No y-axis.

### 5.4 Donut (LOCKED)
- Used ONLY for the per-$100 money split. One per page, ever.
- Arc maths must sum exactly to the circumference (QC checks this).
- Centre holds the kept figure (Geist Mono) + a one-line label.
- Kept slice `--atlas-500`; cost slices grey steps. Companion 100% bar + direct-labelled legend beside it (the legend here is allowed because the donut cannot carry direct labels cleanly).

### 5.5 100% stacked bar
- Single horizontal bar, segments sum to 100%.
- Labels inside segments when they fit (white text on grey/terracotta), else a direct label line beneath.
- Emphasised segment terracotta; rest grey steps.

### 5.6 Range / threshold track
- A neutral grey track (`--grey-200`) with: a terracotta **marker** (the subject's position), an optional darker tick (a reference like "typical"), and end labels.
- Replaces the old amber/moss two-tone gauge. **No fill colours signalling good/bad**, the position + the word do that.
- Ratings ("Hard to break in") use this: marker on the track + the plain word above. Subject marker terracotta.

### 5.7 Line / area (single series)
- One line, weight 2px, terracotta or grey-700. Area fill, if any, is a flat low-opacity solid (no gradient), or omit fill entirely (stroke-only is acceptable per the kit choice).
- One baseline. Key points get a dot + a direct label placed safely inside the frame.
- For payback: the zero line is the baseline; the deepest point and the crossing get direct labels, both inside the viewBox.

### 5.8 Table (minimal financial)
- **Strong header rule** (2px `--grey-900` bottom border under the header row).
- **Hairline row separators** (`1px --grey-200`), **no vertical lines**, no full grid.
- Numbers **right-aligned, Geist Mono, tabular**. Text left-aligned sans.
- No zebra striping. Row hover may lift to `--grey-50`.
- Header labels 10px uppercase grey.

---

## 6. Emphasis, Icons, Imagery, Motion

- **Emphasis: let the chart carry the point.** No forced hero-number-in-a-box per section. The visualization's punchline IS the focal point; terracotta marks it.
- **Icons: only when functional** (search, nav, the `?` help affordance). **No decorative stat icons.** Decorative icons are slop.
- **Imagery: hero only.** One beautiful place photo at the top sets the scene (the founder loves this). Data sections stay clean, no photos. Hero gradient is a flat dark-left overlay for legibility (cool, not warm).
- **Motion: functional only.** Interactive controls work (the calculator). Hover gives subtle feedback (border/elevation shift). No scroll-triggered draw-ins, no count-ups. Respect `prefers-reduced-motion`.

---

## 7. Language & Furniture

- **Voice: plain, short, concrete, zero jargon.** Sentences a busy owner reads in one pass.
- **No finance jargon on the surface.** "Monthly health check", never "covenant". "How far sales can fall", never "margin of safety ratio". If a real term is unavoidable, define it inline or in a `?` tooltip.
- **Caveats: quiet, at the section edge.** A small low-contrast line + tooltip where relevant ("held vs modeled", "flag it"). Honest, never shouting, never cluttering.
- **No conclusion sentences, no restating subtitles, no appended title phrases.**
- **Footer: slim.** Brand line + a few real navigation links + one data-honesty legal line. Nothing decorative or worthless.

---

## 8. The QC System (the anti-slop engine)

Every graphic passes **both** a checklist and an independent critique before the founder sees it. On failure: **auto-fix, re-check, and only surface what passes.** The founder should never be the one catching slop.

### 8.1 Per-graphic checklist (ALL must pass)
1. **Math + plausibility.** Value computed correctly AND sane against a known benchmark. No visibly-wrong numbers. (Donut arcs sum to circumference; percentages sum to 100; ratios are right.)
2. **Right primitive** for the data relationship (per the kit table).
3. **2-second zoomed-out legibility** (small, mobile). The point lands instantly.
4. **Palette + type + spacing compliant.** Terracotta + neutrals only; Geist Sans + Geist Mono; weight 500 numbers; spacing scale; 8px radius; hairline border, no shadow.
5. **Direct labels present; nothing overflows the card/viewBox; no orphan legend** (except the locked donut).
6. **One clear point; the right thing is emphasised** (terracotta on the subject, not on noise).
7. **Plain language, no jargon.**
8. **Honest.** Modeled vs held tagged; no fabricated local detail.

### 8.2 The critique pass
A separate reviewer (a subagent in the build workflow) is prompted adversarially: *"What about this graphic reads cheap, generic, or auto-generated? What would a senior data-designer at the FT reject?"* It must return either "ship" or specific defects. Defects route back to auto-fix.

### 8.3 Reference anchoring
Each primitive is pinned to its reference example (section 5 table). A build must match the reference's standard of clarity and restraint, not just the checklist letter.

### 8.4 The section QC gate (section-level, before assembly)
- **One job.** The section makes a single point.
- **Earns its place.** Relevant, useful, or at least genuinely interesting, AND visualizable well. If not, cut it (the founder's sloppy-section filter).
- **Not sparse, not crammed.** Sized to its importance.
- **Title/subtitle obey section 3.** Subtitle only if it earns it.
- **No worthless footer or conclusion.**
- **Low repetition.** The fact appears once, on the page where it is most true; elsewhere it links.

---

## 9. Process & Rollout

1. **Build the locked kit (8 primitives) + a showcase page** that displays each primitive to standard, in isolation. (Standalone HTML the founder opens, per house rule, no browser automation.)
2. **Founder approves each primitive once.** That becomes the bar.
3. **Rebuild pages from approved blocks**, in order: cell (flagship) , city , country. Pages assembled from approved primitives need only a light look.
4. **The component kit is the single source per primitive.** Fix once, every page improves. No per-page re-improvisation.
5. **Build mechanics (ultracode):** each primitive is built, then run through the critique pass, fixed, and only the passing version lands in the showcase. The same gate runs when assembling pages.

---

## 10. Anti-Slop Laws (the explicit "never")

- No amber/yellow. No green. No colour outside terracotta + cool neutrals.
- No gradients as fills.
- No drop-shadow cards (hairline border only).
- No number heavier than weight 500; no number not in Geist Mono; no non-tabular figure.
- No serif. No second accent font.
- No decorative icons.
- No gridlines, axis ticks, or chart borders.
- No legend where a direct label works (donut is the sole exception).
- No chart type outside the locked 8.
- No SVG label overflowing its card or viewBox.
- No restating subtitle, no conclusion sentence, no appended title phrase.
- No jargon on the surface ("covenant", "DSCR", "EBITDA multiple" unexplained).
- No fabricated local detail. No em-dashes. No source-agency names.
- No photo outside the hero.

---

## 11. What changes from the cell pilot v2 (concrete before/after)

- Warm cream/ink ramp -> cool white/grey ramp.
- moss (green) "good" + amber "caution" -> removed; words + position carry good/bad.
- Inter everywhere -> Geist Sans + Geist Mono (numbers).
- Semibold/bold numbers -> Geist Mono 500, tight tracking.
- 14px radius, soft shadow -> 8px radius, hairline border, no shadow.
- Gradient area/donut washes -> flat solid fills.
- Two-tone amber/moss gauges -> neutral track + terracotta marker + word.
- Zebra/weak tables -> minimal financial tables.
- Decorative `?`-everywhere and dense tags -> functional only.
- "Covenant watchlist" -> "Monthly health check" (already renamed; this codifies it).

---

## 12. Open / deferred

- Exact font licensing/self-hosting choice (Geist Sans + Geist Mono are OFL/MIT, safe). Confirm at kit build.
- Whether ranked-bar ends are fully-rounded or 2px , decide when building primitive #2 in the showcase, then lock.
- Whether area charts keep a flat low-opacity fill or go stroke-only , decide at primitive #7, then lock.

---

## 13. Authority

Founder-ratified via the 40-question interview, 2026-06-20. This doc is the execution authority. The next action is to build the primitive kit + showcase for founder sign-off; nothing rebuilds until the showcase is approved.

---

## 14. Supersessions (amends `DESIGN-SYSTEM-CONSTITUTION.md`)

- **L2 Foundation B** (warm cream, 14px radius, soft shadow, all-sans Inter): SUPERSEDED. New base = cool white/grey, 8px radius, hairline border no shadow, Geist Sans + Geist Mono.
- **Good/bad colour system** (moss=good, amber=caution): SUPERSEDED. Removed; words + position only.
- **Number formatting (L17):** retained (abbreviated + rounded), now rendered in Geist Mono 500 tabular.
- **Donut (L7):** retained, LOCKED, one per page, money split only.
- **Chart vocabulary / simplicity rule:** retained and tightened into the locked 8 (section 5).
- **"No graphic type more than twice per page":** relaxed in favour of "a small set of perfected primitives, reused" , consistency now outranks variety. Reuse a primitive as often as the data warrants, provided each instance passes QC.

---

# PART TWO , Brand & Product System

Ratified by the founder's second 40-question interview, 2026-06-20. This is the layer beneath and around the graphics grammar: identity, the signature, the full token/grid/component/nav/a11y system, and the design-ops that let us move fast without drift. Goal stated by founder: a brand system "the same length as major companies", a masterpiece of beauty, functionality and originality, and a setup that lets us move quicker.

## 15. Brand Identity

- **Personality: the trusted instrument.** Exact, quiet, authoritative. A precision tool you rely on. Every word and pixel serves this. No hype, confidence through restraint.
- **Logo: wordmark + a simple ownable glyph.** A clean Geist wordmark plus one small geometric symbol that survives at 16px and works as favicon, app icon, social avatar. The glyph is derived from the contour signature (below).
- **Tagline / positioning: "What a business really earns."** Plain, declarative, zero spin.
- **Voice:** plain, short, concrete, zero jargon (already in section 7). The instrument never shouts.

## 16. The Signature , the Topographic Contour Motif

**The one ownable thing.** Atlas = maps; fine elevation/contour lines are the brand's signature texture. It is what makes Margin Atlas instantly recognisable, the way pink paper is the FT.

Rules:
- Appears as a **subtle, recurring detail**, never loud decoration: faint section dividers, hero photo backdrop edge, the loading shimmer, the empty state, the favicon/glyph, auto-generated share cards.
- Always low-contrast, neutral or single-terracotta line work. Never competes with data.
- Used sparingly enough to stay "signature", not wallpaper. If it ever reads as decoration, it is overused.
- This is the "final 1%" finishing detail: one idea threaded through everything so the brand feels authored, not assembled.

## 17. Colour Depth (extends section 1)

- **Dark mode: none.** Light only. We do NOT carry dark-mode token overhead, this buys speed. (If ever revisited, it is a deliberate later project.)
- **Accent ratio: ~90% neutral / ~10% terracotta** on a typical page. Terracotta is precious: the subject, the key number, the one marker.
- **System states without green/amber:** terracotta carries **error / needs-attention**; **success is neutral + a check mark**, never green. Works because forms are small and labelled.
- **Dense categorical charts:** an official ramp of **terracotta (key) + up to 5 graded greys** (`--grey-300 -> --grey-700`). Past that, redesign the chart. Never a rainbow.
- **Semantic colour tokens** (role layer, see section 24): `bg=grey-50, surface=white, border=grey-200, text-primary=grey-900, text-secondary=grey-500, accent=atlas-500, accent-text=atlas-700, accent-hover=atlas-600, error=atlas-500, focus=atlas-500, data-1=atlas-500, data-2..6=grey-300..700`.

## 18. Typography Depth (extends section 2)

- **Modular scale, ratio 1.2 (minor third).** Calm, dense, harmonious. Approximate steps (px): `11, 13, 14, 16, 19, 22, 26, 32`. Numbers may step above for marquees. Every size comes from the scale, no eyeballed values.
- **Measure: cap reading text at ~60 to 70 characters.** Body and captions never run edge-to-edge on wide cards.
- **Fluid responsive type:** sizes use `clamp()` to interpolate between mobile and desktop, no jumpy per-breakpoint steps.
- **Currency & numbers: everything normalised to USD**, one global yardstick across all places. (This resolves the earlier London-in-$ question: $ is correct under this rule. A future per-place currency toggle is possible but not launch.) Abbreviated + rounded, Geist Mono 500 tabular.

## 19. Layout & Grid

- **12-column grid** with bento cards claiming spans. Divides cleanly into halves/thirds/quarters/sixths.
- **Container max-width ~1080px** (wide tier may reach ~1200), centred, generous margins.
- **Four breakpoints:** mobile `<640`, tablet `640-1023`, desktop `1024-1279`, wide `>=1280`. Every component designs against these named tiers, no ad-hoc queries.
- **Mobile-first.** Design the phone layout first, enhance up. Non-negotiable given the mobile priority.
- **Charts on mobile reflow to one column and simplify** (drop secondary labels/ticks, stack), so the 2-second test holds on a phone. Never shrink-in-place into collisions.

## 20. Component Kit (beyond charts)

- **Buttons, 3 tiers:** primary (terracotta fill), secondary (hairline border), ghost/text. One terracotta primary per context.
- **Paywall / premium gate:** a **blurred preview of the real content** behind a crisp unlock card. The reader glimpses real value (converts better than a blank lock). Consistent component, used everywhere gating happens.
- **Form kit (unified):** inputs, selects, sliders, toggles share one height, hairline border, and a **terracotta focus ring**. The calculator is built from this kit so it feels designed, not assembled.
- **Badges / tags / pills:** a small system , neutral badge, terracotta badge, and the segmented type-picker , one shape and size. Premium tag + confidence chips use it.
- Also specced as needed against these rules: tooltips/popovers (the `?` help), modals/sheets, the search palette. All inherit the state system (section 22).

## 21. Navigation & Wayfinding

- **Top bar:** wordmark + a few real links (Countries, Cities, Industries, Compare) + search affordance + one terracotta CTA. Calm and complete.
- **In-page section rail:** sticky, **tracks scroll position** and highlights the current movement. Persistent sense of place on long pages.
- **Cross-page:** **breadcrumbs** (UK / London / Restaurants) + **contextual "related" links** routing up to city/country/global-trade. Powers the link-don't-repeat model and SEO.
- **Search:** a **command-style search** (type a place or trade, jump straight there) is the primary entry, with category browse as backup. Pairs with the Cmd-K palette (section 22).

## 22. Interaction & States

- **One state system** across every interactive element: subtle hover, **terracotta focus-visible ring** (keyboard), clearly styled disabled.
- **The calculator (hero):** live recompute on drag + 6 type presets + **editable number fields** for exact entry. Fast, tactile, precise.
- **Data states:** prefer an **explicit, honest "not enough data yet"** state over a silent blank, transparency about gaps. (NOTE: this amends the production app's default "graceful silent omission / return null". Reconciliation: never a sad broken placeholder; an intentional, quiet, branded empty state where a section is expected but unfilled. Truly irrelevant sections still simply don't appear.) Designed skeletons only for genuine async loads (search).
- **Keyboard + command palette** (press `/` or Cmd-K): full keyboard operability plus a power-user palette. Signals "serious instrument".
- **Motion tokens:** durations `~120 / 180 / 240ms`, one signature easing `cubic-bezier(.16,1,.3,1)`, always `prefers-reduced-motion` aware. Purposeful and quick, never gratuitous.

## 23. Accessibility (the floor)

- **WCAG AA across the board:** contrast, keyboard, labels, focus.
- **Terracotta contrast rule:** bright `--atlas-500` (#e62200) for large text, marks, bars and fills only; **small terracotta text uses `--atlas-700` (#991600)** which passes AA. Never body-size text in the bright shade.
- **44px minimum touch targets** for anything tappable (sliders, chips, links).
- **Every chart carries a plain-text takeaway + an aria-label**, a one-line human summary of its point. Doubles as the 2-second-test sentence and an SEO asset.

## 24. Imagery, Maps & Data-as-Art

- **Hero photos: one consistent grade** , cool dark-left gradient, slight desaturation, unified tone , so varied stock reads as one brand. Hero only (section 6).
- **Maps: a custom minimal style in brand tones** , greyscale base, terracotta markers, Geist labels, never the default Google/Mapbox look. The cartographic identity made literal; the biggest masterpiece lever after the contour motif. For city/neighbourhood pages.
- **One signature showpiece visualization per page type**, built to a higher craft bar than the kit primitives (the calculator on cell; a distinctive hero viz on country/city). The thing people screenshot.
- **Auto-generated branded share cards (OG images):** each page renders a share image with its headline stat on a contour-textured branded card. Designed link previews at zero per-page effort.

## 25. Design Ops (so we move fast without drift)

- **Two-layer tokens:** primitives (raw values: `grey-900`, `atlas-500`) feed **semantic tokens** (role-based: `text-primary`, `accent`, `border`). Change a role once, it propagates correctly. This is what enables speed and safe edits.
- **Code is the single source of truth:** the living component showcase IS the spec; this constitution is the law. No Figma to drift out of sync (no separate designer). 
- **Versioning:** the showcase + constitution are the versioned artefacts; primitives are approved once, then reused. Fix a primitive once, every page improves.

## 26. The Masterpiece Standard (the bar)

Every page must clear all three, or it is not done:
1. **Beauty.** Passes the slop test; would not look out of place next to Stripe, Linear, or the FT.
2. **Functionality.** Passes the 2-second test on a phone; the reader gets the point and can act.
3. **Originality.** Carries the Atlas signature (contour motif, cartographic maps, the instrument voice) , unmistakably ours, not a template.

## 27. Build order (updated)

1. **Tokens (two-layer) + the contour motif + the glyph/wordmark** , the identity substrate.
2. **The 8 chart primitives + the component kit (buttons, forms, badges, paywall, nav, search palette) + states** , built into ONE standalone showcase page the founder opens.
3. **Founder approves the showcase** (primitives + components + the signature), locking the two open kit choices from section 12.
4. **Rebuild pages from approved blocks:** cell (flagship, with the calculator showpiece) -> city (with the custom map) -> country.
5. Each step runs the QC gate (section 8): checklist + adversarial critique + auto-fix, surfacing only passing work.
