I used the uploaded Margin Atlas brief as the governing spec for the product goals, stack, brand direction, page density, and required output structure. 

# Part A - Resource catalog

## 1. North-star reference products and sites

* Name: Financial Times Visual and Data Journalism plus Visual Vocabulary

* Type: reference site

* URL: [https://www.ft.com/visual-and-data-journalism](https://www.ft.com/visual-and-data-journalism) and [https://ft-interactive.github.io/visual-vocabulary/](https://ft-interactive.github.io/visual-vocabulary/)

* Repo: [https://github.com/ft-interactive/visual-vocabulary](https://github.com/ft-interactive/visual-vocabulary)

* License: Reference site n/a · Maintained: active 2026 for FT visual journalism; Visual Vocabulary remains a widely used newsroom training resource. ([Financial Times][1])

* Stack fit: reference only

* Why it fits Margin Atlas: FT is the clearest model for professional trust under density: strong headline hierarchy, restrained color, compact annotations, and charts that explain rather than decorate. The Visual Vocabulary is especially useful because it maps analytical intent to chart families, which is exactly what Margin Atlas needs for distributions, ranges, peers, thresholds, and time series.

* Install: n/a - reference only

* How we'd use it: Make it the internal “chart choice law” for every section template, then adapt the vocabulary into a Margin Atlas chart-pattern matrix.

* Priority: must-have

* Name: Our World in Data and Grapher

* Type: reference site

* URL: [https://ourworldindata.org/](https://ourworldindata.org/)

* Repo: [https://github.com/owid/owid-grapher](https://github.com/owid/owid-grapher)

* License: OWID content and charts are generally reusable under CC BY unless otherwise stated; Grapher source is public but has project-specific licensing details · Maintained: active 2026. ([Our World in Data][2])

* Stack fit: reference only, with open-source charting architecture worth studying

* Why it fits Margin Atlas: OWID shows how to make global data feel legible without flattening nuance. Its strongest lesson is the pairing of calm prose, chart-first explanation, source transparency, and reusable visual patterns.

* Install: n/a - reference only

* How we'd use it: Study Grapher’s treatment of global comparisons, source notes, downloads, and chart-level methodology disclosure for country and industry pages.

* Priority: must-have

* Name: Datawrapper

* Type: reference site

* URL: [https://www.datawrapper.de/](https://www.datawrapper.de/)

* Repo: n/a

* License: commercial SaaS with free tier; reference use only · Maintained: active 2026. ([Datawrapper][3])

* Stack fit: reference only

* Why it fits Margin Atlas: Datawrapper’s editorial style is a direct fit: plain-language titles, minimal legends, accessible palettes, and charts that are designed for publishing rather than dashboards. Its chart type guide is one of the most practical resources for choosing visual forms under deadline pressure. ([Datawrapper][4])

* Install: n/a - reference only

* How we'd use it: Use as the house standard for chart titles, subtitles, source captions, compact legends, and mobile chart behavior.

* Priority: must-have

* Name: The Economist Graphic Detail

* Type: reference site

* URL: [https://www.economist.com/graphic-detail](https://www.economist.com/graphic-detail)

* Repo: n/a

* License: publisher reference · Maintained: active 2026. ([The Economist][5])

* Stack fit: reference only

* Why it fits Margin Atlas: The Economist’s data work is valuable because it remains editorial and compact even when the subject is technical. Its design guidance favors limited palettes, high contrast, and one dominant color, all of which match the proposed Margin Atlas “single loud accent” rule. ([Economist Education][6])

* Install: n/a - reference only

* How we'd use it: Borrow the discipline of terse chart titles, small explanatory notes, and restrained color hierarchy.

* Priority: strong

* Name: The Pudding

* Type: inspiration

* URL: [https://pudding.cool/](https://pudding.cool/)

* Repo: n/a

* License: reference only, varies by story · Maintained: active 2026. ([The Pudding][7])

* Stack fit: reference only

* Why it fits Margin Atlas: The Pudding is less “financial reference work” and more narrative data essay, but it is excellent at guided reading. It shows how to move a reader through a sequence of claims using section pacing, annotations, and visual reveals.

* Install: n/a - reference only

* How we'd use it: Use selectively for the “prose story,” operator voices, and first-year ramp sections where pacing matters.

* Priority: strong

* Name: Reuters Graphics

* Type: reference site

* URL: [https://www.reuters.com/graphics/](https://www.reuters.com/graphics/)

* Repo: n/a

* License: publisher reference · Maintained: active 2026. ([Reuters][8])

* Stack fit: reference only

* Why it fits Margin Atlas: Reuters is a good model for fast professional comprehension: plain labels, sober hierarchy, and no ornamental clutter. It is especially useful for risks, geography, and “what changed” explainers.

* Install: n/a - reference only

* How we'd use it: Use as a reference for concise risk visuals, severity ordering, and source-forward trust blocks.

* Priority: strong

---

## 2. Open-source design systems and component libraries

* Name: shadcn/ui, pinned to the Tailwind 3-compatible CLI path

* Type: component lib

* URL: [https://ui.shadcn.com/](https://ui.shadcn.com/)

* Repo: [https://github.com/shadcn-ui/ui](https://github.com/shadcn-ui/ui)

* License: MIT · Maintained: active 2026; current shadcn docs specifically note using `shadcn@2.3.0` for Tailwind v3 projects. ([GitHub][9])

* Stack fit: Excellent for Next 15, React 19, TypeScript, Tailwind 3 if pinned to the Tailwind 3 install path; components are copied into the app, so tokens and markup remain owned by Margin Atlas. React 19 npm installs may prompt for peer dependency handling. ([Shadcn][10])

* Why it fits Margin Atlas: It gives the team accessible, editable component code without importing a heavy visual opinion. That matters because the Margin Atlas brand needs a custom editorial skin, not a generic SaaS kit.

* Install: `npx shadcn@2.3.0 init` then `npx shadcn@2.3.0 add button card badge accordion tabs table dialog popover select tooltip separator sheet skeleton`

* How we'd use it: Use for accordions, dialogs, popovers, selectors, calculators, methodology disclosure, comparison controls, and responsive nav primitives.

* Priority: must-have

* Name: Radix Primitives

* Type: component lib

* URL: [https://www.radix-ui.com/primitives](https://www.radix-ui.com/primitives)

* Repo: [https://github.com/radix-ui/primitives](https://github.com/radix-ui/primitives)

* License: MIT · Maintained: active 2026. ([GitHub][11])

* Stack fit: Strong fit for React, TypeScript, accessibility, and unstyled primitives; use mostly through shadcn/ui to avoid duplicating abstraction layers.

* Why it fits Margin Atlas: Radix solves hard interaction accessibility without imposing a visual style. It is ideal for dense pages where disclosure, comparison controls, tooltips, popovers, tabs, and dialogs must remain robust.

* Install: `npm install @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-tabs @radix-ui/react-tooltip`

* How we'd use it: Underpin methodology accordions, calculator popovers, role-pay tabsets, and mobile section navigation.

* Priority: must-have

* Name: Base UI

* Type: component lib

* URL: [https://base-ui.com/](https://base-ui.com/)

* Repo: [https://github.com/mui/base-ui](https://github.com/mui/base-ui)

* License: MIT · Maintained: active 2026, with v1.0 released in late 2025 and active package updates in 2026. ([Base UI][12])

* Stack fit: Good React and Tailwind fit, unstyled and accessible. It is newer than Radix, so I would not switch the whole system now, but it is a strong candidate for future primitives.

* Why it fits Margin Atlas: Base UI has the same “unstyled accessible primitive” philosophy that works for an editorial product. It is especially attractive long term because it comes from teams behind Radix, Floating UI, and MUI.

* Install: `npm install @base-ui/react`

* How we'd use it: Evaluate for future Tailwind 4 migration or for primitives where Radix/shadcn causes friction.

* Priority: optional

* Name: React Aria Components

* Type: component lib

* URL: [https://react-spectrum.adobe.com/react-aria/components.html](https://react-spectrum.adobe.com/react-aria/components.html)

* Repo: [https://github.com/adobe/react-spectrum](https://github.com/adobe/react-spectrum)

* License: Apache-2.0 · Maintained: active 2026. ([React Aria][13])

* Stack fit: Strong accessibility fit, style-free, works with Tailwind, but it is a different component philosophy from Radix/shadcn. ([React Aria][14])

* Why it fits Margin Atlas: It is best-in-class for complex accessible interactions. It becomes especially relevant if Margin Atlas later needs advanced comboboxes, table interactions, date controls, or keyboard-heavy workflows.

* Install: `npm install react-aria-components`

* How we'd use it: Keep as a fallback for controls that are more complex than Radix’s sweet spot, especially search, filtering, and premium-tier analysis tools.

* Priority: optional

* Name: Ark UI

* Type: component lib

* URL: [https://ark-ui.com/](https://ark-ui.com/)

* Repo: [https://github.com/chakra-ui/ark](https://github.com/chakra-ui/ark)

* License: MIT · Maintained: active 2026. ([Ark UI][15])

* Stack fit: Good accessible primitive system across React, Solid, Vue, and Svelte. For this product, it overlaps with Radix and should not be adopted simultaneously as a primary layer.

* Why it fits Margin Atlas: Ark is clean, accessible, and themable, but it is most compelling when paired with a broader Panda CSS or Chakra ecosystem. Margin Atlas already has Tailwind 3 and should avoid a second styling philosophy.

* Install: `npm install @ark-ui/react`

* How we'd use it: Use only if a future rebuild chooses Ark/Panda instead of Radix/shadcn/Tailwind.

* Priority: optional

* Name: Tailwind UI Catalyst

* Type: component lib

* URL: [https://tailwindcss.com/plus/ui-kit](https://tailwindcss.com/plus/ui-kit)

* Repo: n/a

* License: paid Tailwind Plus commercial license · Maintained: active 2026. ([Tailwind CSS][16])

* Stack fit: Good React and Tailwind fit, but paid and visually more app-like than editorial.

* Why it fits Margin Atlas: Catalyst is useful as a high-quality reference for interaction polish and component ergonomics, but its default feel is closer to premium SaaS than warm almanac. It should not define the visual ideology.

* Install: n/a - paid copy-from-account workflow

* How we'd use it: Reference for form density, tables, panels, and responsive component structure, not as the visual base.

* Priority: optional

---

## 3. Chart and data-visualization libraries

* Name: visx

* Type: chart lib

* URL: [https://airbnb.io/visx/](https://airbnb.io/visx/)

* Repo: [https://github.com/airbnb/visx](https://github.com/airbnb/visx)

* License: MIT · Maintained: active 2026, with `@visx/visx` v4 supporting React 18 and 19. ([GitHub][17])

* Stack fit: Best primary fit for Next 15, React 19, TypeScript, server-rendered SVG, and token-driven custom chart components. Avoid client-only helpers like responsive measurement in server components.

* Why it fits Margin Atlas: visx gives low-level primitives rather than canned dashboards, so the team can build a coherent editorial chart language. It is the right choice for bespoke distributions, interval plots, waterfalls, break-even bands, small multiples, and annotated SVG.

* Install: `npm install @visx/visx`

* How we'd use it: Build the Margin Atlas chart kit: `RevenueRange`, `CostWaterfall`, `BreakEvenBand`, `PeerDotPlot`, `SeasonalityLine`, and `RampSequence`.

* Priority: must-have

* Name: Observable Plot

* Type: chart lib

* URL: [https://observablehq.com/plot/](https://observablehq.com/plot/)

* Repo: [https://github.com/observablehq/plot](https://github.com/observablehq/plot)

* License: ISC · Maintained: active, latest stable release in 2025. ([Observable][18])

* Stack fit: Excellent for static SVG generation and analytical prototyping; can server-render SVG/PNG in Node with JSDOM. ([Observable][19])

* Why it fits Margin Atlas: Plot is the fastest way to explore correct chart forms and generate static editorial graphics. It is less ideal as the final interactive React component layer, but excellent for server-rendered charts, research notebooks, and design QA.

* Install: `npm install @observablehq/plot jsdom` and `npm install -D @types/jsdom`

* How we'd use it: Use for rapid chart prototyping, static methodology graphics, and server-generated fallback SVGs.

* Priority: must-have

* Name: D3 modules

* Type: chart lib

* URL: [https://d3js.org/](https://d3js.org/)

* Repo: [https://github.com/d3/d3](https://github.com/d3/d3)

* License: ISC · Maintained: active 2026. ([GitHub][20])

* Stack fit: Excellent as math, scale, format, array, and shape infrastructure inside server-rendered chart components.

* Why it fits Margin Atlas: D3 should be treated as the geometry and data transformation layer, not as a DOM mutation layer. That lets charts stay React/SVG, token-themeable, and RSC-friendly.

* Install: `npm install d3` and `npm install -D @types/d3`

* How we'd use it: Use `d3-array`, `d3-scale`, `d3-format`, and `d3-shape` inside visx-based charts.

* Priority: must-have

* Name: Recharts

* Type: chart lib

* URL: [https://recharts.org/](https://recharts.org/)

* Repo: [https://github.com/recharts/recharts](https://github.com/recharts/recharts)

* License: MIT · Maintained: active 2026. ([GitHub][21])

* Stack fit: Good for client-side React charts and conventional lines/bars; less ideal for a bespoke editorial chart grammar. React 19 compatibility appears to be an active concern but generally supported in current discussions. ([GitHub][22])

* Why it fits Margin Atlas: Recharts is productive for common charts, but the default look can drift toward dashboard if not heavily styled. It is a fallback for internal tools, not the public visual language.

* Install: `npm install recharts`

* How we'd use it: Use only for internal/admin charts or quick prototypes where custom SVG control is less important.

* Priority: optional

* Name: Unovis

* Type: chart lib

* URL: [https://unovis.dev/](https://unovis.dev/)

* Repo: [https://github.com/f5/unovis](https://github.com/f5/unovis)

* License: Apache-2.0 · Maintained: active 2026. ([GitHub][23])

* Stack fit: Good multi-framework chart library with CSS-variable theming and tree-shakable packages; public-page SSR fit should be tested chart by chart.

* Why it fits Margin Atlas: Unovis has useful polished components and a modern theming story. It is not as bespoke as visx, but it could be a fallback for heavier interactive visualizations.

* Install: `npm install @unovis/react @unovis/ts`

* How we'd use it: Evaluate for premium-tier interactive dashboards, not for the core static editorial page.

* Priority: optional

* Name: nivo

* Type: chart lib

* URL: [https://nivo.rocks/](https://nivo.rocks/)

* Repo: [https://github.com/plouc/nivo](https://github.com/plouc/nivo)

* License: MIT · Maintained: active but with known Next/RSC friction. ([GitHub][24])

* Stack fit: Strong for polished React/D3 chart components, but many Next App Router uses require client boundaries. That conflicts with the brief’s server-rendered/static-first requirement.

* Why it fits Margin Atlas: nivo is visually appealing and broad, but it pushes the product toward a component-gallery chart style. Use only if a client-only premium exploration view needs a ready-made chart quickly.

* Install: `npm install @nivo/core @nivo/bar @nivo/line`

* How we'd use it: Optional fallback for client-only premium modules, not the public page chart foundation.

* Priority: optional

* Name: Tremor

* Type: chart lib

* URL: [https://www.tremor.so/](https://www.tremor.so/)

* Repo: [https://github.com/tremorlabs/tremor](https://github.com/tremorlabs/tremor)

* License: Apache-2.0 · Maintained: maintenance risk for React 19/Tailwind-current stacks. ([Tremor][25])

* Stack fit: Tailwind and React friendly in concept, but not recommended for this production stack due to maintenance and compatibility concerns.

* Why it fits Margin Atlas: Tremor is a useful reference for fast dashboard assembly, but Margin Atlas explicitly should not feel like a generic analytics dashboard. It also gives less control over editorial chart grammar than visx.

* Install: `npm install @tremor/react`

* How we'd use it: Do not adopt; reference only for chart/card density patterns.

* Priority: optional

---

## 4. Typography

* Name: Newsreader plus Inter

* Type: font

* URL: [https://fonts.google.com/specimen/Newsreader](https://fonts.google.com/specimen/Newsreader) and [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter)

* Repo: [https://github.com/productiontype/Newsreader](https://github.com/productiontype/Newsreader) and [https://github.com/rsms/inter](https://github.com/rsms/inter)

* License: SIL Open Font License · Maintained: active/open-source. Newsreader is designed for content-rich screen reading; Inter is designed for computer screens with tabular numbers and other UI-oriented OpenType features. ([GitHub][26])

* Stack fit: Excellent with Next 15 via `next/font/google` or Fontsource self-hosting; supports variable typography and tabular numerals.

* Why it fits Margin Atlas: This pairing already matches the brief: warm editorial authority from Newsreader, high-density UI clarity from Inter. The mistake to avoid is using the serif everywhere; make it the masthead and sectional voice, not the whole interface.

* Install: `npm install @fontsource-variable/newsreader @fontsource-variable/inter`

* How we'd use it: Newsreader for mastheads, verdicts, pull numbers, and section openers; Inter for body, controls, captions, tables, labels, and all data.

* Priority: must-have

* Name: Source Serif 4 plus Source Sans 3

* Type: font

* URL: [https://fonts.google.com/specimen/Source+Serif+4](https://fonts.google.com/specimen/Source+Serif+4) and [https://fonts.google.com/specimen/Source+Sans+3](https://fonts.google.com/specimen/Source+Sans+3)

* Repo: [https://github.com/adobe-fonts/source-serif](https://github.com/adobe-fonts/source-serif) and [https://github.com/adobe-fonts/source-sans](https://github.com/adobe-fonts/source-sans)

* License: SIL Open Font License · Maintained: active/open-source. Source Serif was designed to complement Source Sans, and Source Sans was designed to work well in UI environments. ([Google Fonts][27])

* Stack fit: Strong via Google Fonts or Fontsource; good for a slightly more neutral reference-work voice.

* Why it fits Margin Atlas: This is the best fallback if Newsreader feels too literary or distinctive. It gives a warmer editorial register than many SaaS fonts while staying sober.

* Install: n/a via built-in `next/font/google`; import `Source_Serif_4` and `Source_Sans_3`

* How we'd use it: Use only if the brand shifts toward institutional reference over magazine-like warmth.

* Priority: strong

* Name: IBM Plex family

* Type: font

* URL: [https://www.ibm.com/plex/](https://www.ibm.com/plex/)

* Repo: [https://github.com/IBM/plex](https://github.com/IBM/plex)

* License: SIL Open Font License · Maintained: active, with IBM Plex variable-font updates continuing into 2025. ([GitHub][28])

* Stack fit: Strong for data products because Sans, Serif, Mono, and Condensed live in one coherent family.

* Why it fits Margin Atlas: Plex is the strongest alternative if Margin Atlas wants to feel more institutional, technical, and global. It is less warm than Newsreader/Inter, but extremely coherent for mixed tables, labels, and analysis.

* Install: `npm install @ibm/plex`

* How we'd use it: Consider IBM Plex Mono for source IDs, methodology metadata, and compact table numerals, even if the main pairing remains Newsreader/Inter.

* Priority: optional

* Name: Fontsource

* Type: font

* URL: [https://fontsource.org/](https://fontsource.org/)

* Repo: [https://github.com/fontsource/fontsource](https://github.com/fontsource/fontsource)

* License: Font packages usually preserve upstream open font licenses, commonly OFL · Maintained: active. ([Fontsource][29])

* Stack fit: Excellent for self-hosted fonts in Next/Vercel when you want package-managed assets instead of Google-hosted delivery.

* Why it fits Margin Atlas: Fontsource makes font delivery explicit and versionable, which suits a production design system. It also avoids surprises from remote font loading changes.

* Install: `npm install @fontsource-variable/newsreader @fontsource-variable/inter`

* How we'd use it: Use if the team wants all font assets version-pinned through npm rather than relying on `next/font/google`.

* Priority: strong

---

## 5. Color and design tokens

* Name: Style Dictionary

* Type: token tool

* URL: [https://styledictionary.com/](https://styledictionary.com/)

* Repo: [https://github.com/amzn/style-dictionary](https://github.com/amzn/style-dictionary)

* License: Apache-2.0 · Maintained: active 2026. Style Dictionary defines tokens once and exports them to platform-specific targets. ([GitHub][30])

* Stack fit: Excellent for Tailwind, CSS variables, TypeScript token exports, and future multi-platform needs.

* Why it fits Margin Atlas: It enforces the “no raw hex in components” rule and gives the team one source of truth for color, spacing, type, borders, and chart tokens. It also makes the warm editorial system durable as more page types are added.

* Install: `npm install -D style-dictionary`

* How we'd use it: Generate `tokens.css`, `tailwind.tokens.ts`, and `chartTokens.ts` from the same OKLCH-based source.

* Priority: must-have

* Name: Radix Colors

* Type: token tool

* URL: [https://www.radix-ui.com/colors](https://www.radix-ui.com/colors)

* Repo: [https://github.com/radix-ui/colors](https://github.com/radix-ui/colors)

* License: MIT · Maintained: active. ([GitHub][31])

* Stack fit: Strong for accessible scales and UI states; can be imported into Tailwind config or used as a reference when creating custom warm scales.

* Why it fits Margin Atlas: Radix Colors is useful as a scaffold for tonal steps, hover states, focus states, and neutral surfaces. Do not adopt Radix colors wholesale because Margin Atlas needs custom parchment, terracotta, moss, and warm ink.

* Install: `npm install @radix-ui/colors`

* How we'd use it: Use as a calibration reference for 12-step scales and interaction states while building custom OKLCH token ramps.

* Priority: strong

* Name: Culori

* Type: token tool

* URL: [https://culorijs.org/](https://culorijs.org/)

* Repo: [https://github.com/Evercoder/culori](https://github.com/Evercoder/culori)

* License: MIT · Maintained: active. Culori supports modern CSS color spaces, interpolation, color differences, and color manipulation. ([GitHub][32])

* Stack fit: Excellent for Node-based palette generation and token audits.

* Why it fits Margin Atlas: Culori is the right utility for building perceptually sane OKLCH ramps instead of hand-picked hex values. It helps keep terracotta, cream, moss, and amber harmonious across light/dark or high-contrast variants.

* Install: `npm install culori`

* How we'd use it: Generate and audit OKLCH token ramps, then output semantic tokens through Style Dictionary.

* Priority: must-have

* Name: Adobe Leonardo

* Type: token tool

* URL: [https://leonardocolor.io/](https://leonardocolor.io/)

* Repo: [https://github.com/adobe/leonardo](https://github.com/adobe/leonardo)

* License: Apache-2.0 · Maintained: active enough for palette prototyping. Leonardo is built for accessible UI and data-visualization color systems. ([GitHub][33])

* Stack fit: Good as a palette prototyping and contrast-system reference; not required in the runtime stack.

* Why it fits Margin Atlas: Leonardo is useful for proving that the warm palette can meet contrast requirements without becoming muddy. It is especially helpful for amber caution and moss positive scales, where contrast mistakes are common.

* Install: `git clone https://github.com/adobe/leonardo.git`

* How we'd use it: Use during design-token development, not as a production dependency.

* Priority: strong

* Name: Datawrapper Color in Data Visualization Style Guides

* Type: article/book

* URL: [https://www.datawrapper.de/blog/colors-for-data-vis-style-guides](https://www.datawrapper.de/blog/colors-for-data-vis-style-guides)

* Repo: n/a

* License: reference article · Maintained: published 2025. ([Datawrapper][34])

* Stack fit: reference only

* Why it fits Margin Atlas: The article is practical for turning brand colors into chart colors without ruining legibility. It reinforces the need to document palette use, accessibility, and examples rather than just listing swatches.

* Install: n/a - reference only

* How we'd use it: Create the Margin Atlas “chart color constitution”: primary, neutral, positive, caution, comparison, and disabled states.

* Priority: must-have

* Name: USWDS Color System

* Type: token tool

* URL: [https://designsystem.digital.gov/design-tokens/color/overview/](https://designsystem.digital.gov/design-tokens/color/overview/)

* Repo: [https://github.com/uswds/uswds](https://github.com/uswds/uswds)

* License: public domain/CC0 for many USWDS assets; verify per asset · Maintained: active

* Stack fit: reference only unless adopting USWDS tokens directly

* Why it fits Margin Atlas: USWDS is not visually right for Margin Atlas, but its contrast-grade way of thinking is useful. It gives the team a disciplined way to discuss foreground/background pairings instead of relying on taste alone. ([U.S. Web Design System (USWDS)][35])

* Install: n/a - reference only

* How we'd use it: Use as an accessibility mental model while building custom OKLCH tokens.

* Priority: optional

---

## 6. Layout, grid, density, and hierarchy

* Name: Edward Tufte, The Visual Display of Quantitative Information

* Type: article/book

* URL: [https://www.edwardtufte.com/tufte/books_vdqi](https://www.edwardtufte.com/tufte/books_vdqi)

* Repo: n/a

* License: paid book/reference · Maintained: canonical reference

* Stack fit: reference only

* Why it fits Margin Atlas: Tufte remains central for reducing chart junk, increasing data density, and using small multiples. The relevant lesson is not minimalism for its own sake, but giving every mark a job. ([Edward Tufte][36])

* Install: n/a - book

* How we'd use it: Apply to chart QA: remove decorative marks, prefer direct labels, and use small multiples for peer/country comparisons.

* Priority: must-have

* Name: Jacques Bertin, Semiology of Graphics

* Type: article/book

* URL: [https://www.esri.com/en-us/esri-press/browse/semiology-of-graphics](https://www.esri.com/en-us/esri-press/browse/semiology-of-graphics)

* Repo: n/a

* License: paid book/reference · Maintained: canonical reference

* Stack fit: reference only

* Why it fits Margin Atlas: Bertin is the foundation for encoding data with position, size, value, texture, color, orientation, and shape. This is crucial for a product that should not overuse color to carry meaning.

* Install: n/a - book

* How we'd use it: Build the chart-token rules around encoding hierarchy: position first, length second, color only when it clarifies role or status.

* Priority: must-have

* Name: FT Visual Vocabulary

* Type: article/book

* URL: [https://ft-interactive.github.io/visual-vocabulary/](https://ft-interactive.github.io/visual-vocabulary/)

* Repo: [https://github.com/ft-interactive/visual-vocabulary](https://github.com/ft-interactive/visual-vocabulary)

* License: reference repo · Maintained: stable newsroom training resource. ([GitHub][37])

* Stack fit: reference only

* Why it fits Margin Atlas: It gives a shared vocabulary for chart selection, which prevents page templates from becoming a random mix of bars, cards, and prose. It is the best single resource for “right visual for each statistic.”

* Install: n/a - reference only

* How we'd use it: Convert into a Margin Atlas decision tree for range, ranking, correlation, part-to-whole, change, distribution, and flow.

* Priority: must-have

* Name: Datawrapper 40 Chart Types Guide

* Type: article/book

* URL: [https://www.datawrapper.de/blog/40-chart-types](https://www.datawrapper.de/blog/40-chart-types)

* Repo: n/a

* License: reference article · Maintained: published 2025. ([Datawrapper][4])

* Stack fit: reference only

* Why it fits Margin Atlas: This is the pragmatic complement to FT’s vocabulary. It is useful for PMs, editors, and engineers because it explains chart choices in production terms.

* Install: n/a - reference only

* How we'd use it: Use during template reviews to prevent inappropriate chart choices, especially pie/donut misuse and overcomplicated comparisons.

* Priority: strong

* Name: Nielsen Norman Group, Visual Hierarchy and Scanning

* Type: article/book

* URL: [https://www.nngroup.com/articles/visual-hierarchy-ux-definition/](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)

* Repo: n/a

* License: reference article · Maintained: active UX research site. ([Nielsen Norman Group][38])

* Stack fit: reference only

* Why it fits Margin Atlas: NN/g is helpful for translating editorial taste into testable UX principles: eye guidance, grouping, contrast, scale, and predictable placement. Dense pages need visible prioritization, not equal-weight sections.

* Install: n/a - reference only

* How we'd use it: QA every page band against a simple question: what does the eye see first, second, and third?

* Priority: must-have

* Name: Nielsen Norman Group, Whitespace and Grids

* Type: article/book

* URL: [https://www.nngroup.com/articles/whitespace/](https://www.nngroup.com/articles/whitespace/) and [https://www.nngroup.com/articles/using-grids-in-interface-designs/](https://www.nngroup.com/articles/using-grids-in-interface-designs/)

* Repo: n/a

* License: reference article · Maintained: active UX research site. ([Nielsen Norman Group][39])

* Stack fit: reference only

* Why it fits Margin Atlas: These resources support the page-level fix: density should be organized by rhythm and grouping, not solved by shrinking everything. The grid must guide reading and comparison while remaining responsive at 375 px.

* Install: n/a - reference only

* How we'd use it: Define a 12-column desktop grid, 6-column tablet grid, and 4-column mobile grid, with section banding and consistent vertical rhythm.

* Priority: strong

---

## 7. Motion, icons, and inspiration galleries

* Name: Motion

* Type: component lib

* URL: [https://motion.dev/](https://motion.dev/)

* Repo: [https://github.com/motiondivision/motion](https://github.com/motiondivision/motion)

* License: MIT · Maintained: active. Motion is the successor branding around Framer Motion’s animation library. ([Motion][40])

* Stack fit: Good for React 19 client components; use sparingly and never as a requirement for understanding data.

* Why it fits Margin Atlas: Motion can make dense pages feel guided through gentle disclosure, section transitions, and calculator state changes. It should never animate charts for spectacle.

* Install: `npm install motion`

* How we'd use it: Use for accordion reveal, calculator transitions, sticky index affordances, and reduced-motion-safe microinteractions.

* Priority: strong

* Name: Lucide

* Type: icon set

* URL: [https://lucide.dev/](https://lucide.dev/)

* Repo: [https://github.com/lucide-icons/lucide](https://github.com/lucide-icons/lucide)

* License: ISC · Maintained: active 2026. ([GitHub][41])

* Stack fit: Excellent for React, Next, and Tailwind; tree-shakable SVG icons.

* Why it fits Margin Atlas: Lucide is clean, consistent, and restrained enough for an editorial data product. It will not overpower typography or charts.

* Install: `npm install lucide-react`

* How we'd use it: Use for section labels, risk markers, role/pay metadata, methodology notes, and navigation.

* Priority: must-have

* Name: Phosphor Icons

* Type: icon set

* URL: [https://phosphoricons.com/](https://phosphoricons.com/)

* Repo: [https://github.com/phosphor-icons/react](https://github.com/phosphor-icons/react)

* License: MIT · Maintained: active. ([GitHub][42])

* Stack fit: Good React fit; larger expressive family than Lucide.

* Why it fits Margin Atlas: Phosphor is warmer and more illustrative than Lucide, which could help editorial modules. The risk is inconsistency if mixed with Lucide.

* Install: `npm install @phosphor-icons/react`

* How we'd use it: Use only if the brand needs softer, more human pictograms; do not mix freely with Lucide.

* Priority: optional

* Name: Iconoir

* Type: icon set

* URL: [https://iconoir.com/](https://iconoir.com/)

* Repo: [https://github.com/iconoir-icons/iconoir](https://github.com/iconoir-icons/iconoir)

* License: MIT · Maintained: active. ([GitHub][43])

* Stack fit: Good React package and broad icon coverage.

* Why it fits Margin Atlas: Iconoir has a slightly more editorial and less SaaS-like feel than many outline sets. It is a viable alternate icon direction if Lucide feels too generic.

* Install: `npm install iconoir-react`

* How we'd use it: Evaluate as an icon-system alternative, not alongside Lucide.

* Priority: optional

* Name: Data Viz Project

* Type: inspiration

* URL: [https://datavizproject.com/](https://datavizproject.com/)

* Repo: n/a

* License: reference site · Maintained: active enough as a visualization taxonomy. ([Data Viz Project][44])

* Stack fit: reference only

* Why it fits Margin Atlas: It is a broad visual taxonomy for chart forms beyond dashboard defaults. Useful when a statistic needs a better visual metaphor than a card or bar chart.

* Install: n/a - reference only

* How we'd use it: Use during design exploration for uncommon patterns like ranges, deviations, uncertainty, and sequence.

* Priority: strong

* Name: Observable Plot Gallery and D3 Gallery

* Type: inspiration

* URL: [https://observablehq.com/plot/gallery](https://observablehq.com/plot/gallery) and [https://observablehq.com/@d3/gallery](https://observablehq.com/@d3/gallery)

* Repo: [https://github.com/observablehq/plot](https://github.com/observablehq/plot) and [https://github.com/d3/d3](https://github.com/d3/d3)

* License: ISC for Plot and D3 libraries · Maintained: active galleries. ([Observable][45])

* Stack fit: reference plus implementation inspiration

* Why it fits Margin Atlas: These galleries are useful because they connect visual ideas to real implementation patterns. They are especially valuable for small multiples, dot plots, distributions, and annotated time series.

* Install: `npm install @observablehq/plot d3`

* How we'd use it: Use as implementation reference for the Margin Atlas chart kit, then restyle through tokens.

* Priority: strong

* Name: Information is Beautiful Awards

* Type: inspiration

* URL: [https://www.informationisbeautifulawards.com/](https://www.informationisbeautifulawards.com/)

* Repo: n/a

* License: reference gallery · Maintained: active awards program. ([Data Visualization Society][46])

* Stack fit: reference only

* Why it fits Margin Atlas: The gallery is useful for seeing where editorial data visualization is going visually. Use it for inspiration, not for production patterns, because some award work is too bespoke for a repeatable product system.

* Install: n/a - reference only

* How we'd use it: Bookmark for quarterly design reviews and concept exploration.

* Priority: optional

---

# Part B - The recommended ideology

## Margin Atlas Visual Ideology

**Design thesis:** Margin Atlas should feel like a calm, premium business almanac: one unmistakable answer, one structural reason, one honest tradeoff, with every visual mark earning trust.

## Grid and density philosophy

The page should not be an 18-section stack. It should be a guided reference spread broken into **six narrative bands**:

1. **The answer:** revenue masthead, distribution spread, calculator.
2. **The verdict:** honest take, tangible units, quick “why this number” explainer.
3. **The economics:** P&L, cost levers, owner keeps, break-even.
4. **The operating reality:** risks, pay by role, cost to open, seasonality, first-year ramp.
5. **The comparison field:** comparable places, versus the world, related links.
6. **The trust layer:** operator voices, prose story, one-line takeaway, methodology.

Use a **12-column desktop grid**, a **6-column tablet grid**, and a **4-column mobile grid**. At 1280 px and above, use three reading lanes: a quiet left rail for section identity and source/method cues, a central editorial column for the main claim and chart, and a right rail for calculators, benchmark cards, or comparison summaries. At 375 px, collapse to one column, preserve section order, and use a compact sticky section index only if it does not obscure reading.

The governing rule is **one idea per band**. Each band gets one dominant visual, one crisp claim, one explanatory paragraph, and one trust cue. Dense information becomes calm when hierarchy is visible: title first, number second, reason third, caveat fourth.

## Type system

Keep **Newsreader plus Inter**.

Use **Newsreader** for the parts that make the product feel like an almanac: page mastheads, section openers, verdicts, story pullouts, and the largest revenue number. Use **Inter** for everything that must be scanned: body, UI, captions, chart labels, tables, controls, methodology, and navigation.

Set all numeric UI with tabular figures:

```css
.numeric,
[data-numeric="true"] {
  font-variant-numeric: tabular-nums lining-nums;
}
```

Recommended scale:

```ts
const typeScale = {
  hero: "clamp(2.75rem, 6vw, 5.25rem)",
  h1: "clamp(2rem, 4vw, 3.5rem)",
  h2: "clamp(1.5rem, 2.5vw, 2.25rem)",
  h3: "clamp(1.125rem, 1.5vw, 1.375rem)",
  body: "1rem",
  small: "0.875rem",
  micro: "0.75rem",
}
```

## Color and token law

Margin Atlas should use a **warm restraint palette**, not a dashboard palette.

Token law:

* **Ink:** warm brown-black for primary text.
* **Paper:** cream/parchment surfaces.
* **Sand:** subtle section bands, rules, and cards.
* **Terracotta:** the only loud accent; use for the answer, selected state, and key callouts.
* **Moss:** positive or “owner keeps” only.
* **Amber:** caution only.
* **Red:** risk or negative only, and used less often than amber.
* **No raw hex in components.** Components consume semantic tokens only.
* **One loud color per viewport.** If terracotta is already carrying the main story, comparisons use ink, tint, texture, labels, or position before adding more hues.

Token structure:

```ts
tokens.color = {
  surface: {
    paper: "...",
    parchment: "...",
    sand: "...",
    raised: "...",
  },
  text: {
    ink: "...",
    muted: "...",
    faint: "...",
    inverse: "...",
  },
  accent: {
    terracotta: "...",
    terracottaMuted: "...",
    terracottaWash: "...",
  },
  semantic: {
    positive: "...",
    caution: "...",
    risk: "...",
    neutral: "...",
  },
  chart: {
    primary: "var(--color-accent-terracotta)",
    kept: "var(--color-semantic-positive)",
    caution: "var(--color-semantic-caution)",
    baseline: "var(--color-text-muted)",
    grid: "var(--color-border-subtle)",
  },
}
```

Build ramps in OKLCH with Culori, export with Style Dictionary, and audit contrast against WCAG AA.

## Chart language

Primary renderer: **visx** for product charts.
Secondary renderer: **Observable Plot plus JSDOM** for static generated charts, prototypes, and methodology visuals.
Math and formatting: **D3 modules**.

Chart mapping:

* **Revenue distribution:** interval dot plot, percentile band, histogram, or compact box/violin hybrid.
* **Revenue spread:** min/median/high band with labeled percentile anchors.
* **Make it yours calculator:** controlled inputs plus live range band, not a separate dashboard.
* **Tangible units:** pictorial comparison only when it clarifies scale; otherwise use a compact equivalence card.
* **Cost-structure P&L:** waterfall for flow from revenue to owner take; stacked bar only for part-to-whole summary.
* **Cost levers:** ranked sensitivity bars or tornado chart.
* **Owner keeps:** large retained amount plus moss-highlighted take-home band.
* **Break-even:** threshold band or bullet chart with fixed cost marker.
* **Risks:** severity/probability matrix, ordered list, or amber risk ladder.
* **Pay by role:** aligned table with role bands and local wage context.
* **Cost to open:** range bar with category callouts.
* **Seasonality:** 12-month line or heat strip, not a decorative calendar.
* **First-year ramp:** step sequence plus cumulative line.
* **Comparable places:** ranked dot plot or small multiple cards.
* **Versus the world:** percentile dot plot, not a choropleth unless geography itself matters.
* **Operator voices:** quote cards with metadata, not icons pretending to be evidence.
* **Methodology:** source table, confidence badge, and calculation lineage.

## The 5 north stars to steal from

1. **Financial Times:** steal the disciplined chart vocabulary, restrained color, and “explain the claim first” visual journalism.
2. **Our World in Data:** steal global comparison clarity, source transparency, and reusable chart modules.
3. **Datawrapper:** steal chart titles, annotations, accessible color practice, and publisher-grade defaults.
4. **The Economist:** steal one-color discipline, compact editorial confidence, and high information density without visual noise.
5. **The Pudding:** steal guided pacing for the sections that need narrative momentum, especially ramp, operator voices, and story.

---

# Part C - Adopt-list and combined install plan

## Minimum coherent stack, in priority order

1. **shadcn/ui pinned to `shadcn@2.3.0`**: editable accessible component code for Tailwind 3.
2. **Radix Primitives**: accessibility foundation behind disclosures, dialogs, popovers, tabs, and tooltips.
3. **visx**: primary server-renderable SVG chart foundation.
4. **Observable Plot plus JSDOM**: static chart generation and fast visual prototyping.
5. **D3**: scales, formats, arrays, shapes, and statistical helpers.
6. **Style Dictionary**: design-token pipeline.
7. **Culori**: OKLCH palette generation and contrast-aware color work.
8. **Newsreader plus Inter**: existing brand typography, self-hostable through Fontsource or via `next/font`.
9. **Lucide React**: restrained icon system.
10. **Motion**: light, purposeful client-only motion.

## Combined install block

```bash
# Keep Tailwind 3 for this project.
# If Tailwind is already installed, do not rerun this line.
npm install -D tailwindcss@3 postcss autoprefixer

# Tailwind 3-compatible shadcn setup.
npx shadcn@2.3.0 init
npx shadcn@2.3.0 add button card badge accordion tabs table dialog popover select tooltip separator sheet skeleton

# UI helpers, icons, and Tailwind 3-safe class utilities.
npm install lucide-react class-variance-authority clsx tailwind-merge@2.6.0 tailwindcss-animate

# Chart stack.
npm install @visx/visx @observablehq/plot d3 jsdom
npm install -D @types/d3 @types/jsdom

# Tokens and color generation.
npm install -D style-dictionary
npm install culori @radix-ui/colors

# Motion.
npm install motion

# Optional self-hosted fonts through npm.
# Use this instead of next/font/google if you want package-pinned font assets.
npm install @fontsource-variable/newsreader @fontsource-variable/inter
```

How they fit together: shadcn/Radix provides the accessible interaction layer, but the visual system remains owned by Margin Atlas through local component code and semantic tokens. Style Dictionary and Culori generate the warm palette, type, spacing, border, and chart tokens; Tailwind consumes those tokens without raw hex. visx uses the same tokens for SVG charts, D3 supplies scale and formatting math, and Observable Plot is used for prototypes or server-generated static assets. Lucide stays quiet and editorial; Motion is limited to client components where it clarifies state changes.

---

# Part D - Open questions and tradeoffs

**Tailwind 3 now vs Tailwind 4 migration now:**
Recommendation: stay on Tailwind 3.4 now. Pin shadcn to `2.3.0` and avoid pulling the current Tailwind 4-oriented workflow into this project until the visual ideology is stable.

**visx-only vs visx plus Observable Plot:**
Recommendation: use both. visx is the product chart component system; Observable Plot is the newsroom/research tool for quickly proving chart choices and generating static SVGs.

**Newsreader/Inter vs Source Serif/Source Sans:**
Recommendation: keep Newsreader/Inter. It is warmer and more distinctive. Switch to Source only if the brand needs to become more neutral and institutional.

**Radix/shadcn vs Base UI:**
Recommendation: Radix/shadcn now, Base UI later. Base UI is promising and active, but switching primitives while also fixing visual ideology adds unnecessary system risk.

**Single accent vs richer categorical palettes:**
Recommendation: enforce single-accent discipline on editorial pages. Add extra categorical hues only for true multi-category comparisons, and require labels, order, or position to carry meaning before color does.

**Motion vs static calm:**
Recommendation: static first. Use Motion only for state transitions, calculator changes, disclosure, and orientation. Respect reduced motion and never make animation necessary to understand a number.

**Warm editorial vs premium fintech:**
Recommendation: choose warm editorial. Margin Atlas should feel like an atlas/almanac with modern data rigor, not like a trading terminal or SaaS dashboard.

[1]: https://www.ft.com/visual-and-data-journalism?utm_source=chatgpt.com "Visual and data journalism"
[2]: https://ourworldindata.org/?utm_source=chatgpt.com "Our World in Data"
[3]: https://www.datawrapper.de/?utm_source=chatgpt.com "Datawrapper: Create charts, maps, and tables"
[4]: https://www.datawrapper.de/blog/chart-types-guide?utm_source=chatgpt.com "A friendly guide to choosing a chart type"
[5]: https://www.economist.com/topics/graphic-detail?utm_source=chatgpt.com "Graphic detail"
[6]: https://education.economist.com/insights/interviews/tips-for-visualising-data-like-the-economist?utm_source=chatgpt.com "Tips for visualising data like The Economist"
[7]: https://pudding.cool/?utm_source=chatgpt.com "The Pudding"
[8]: https://www.reuters.com/graphics/?utm_source=chatgpt.com "Graphics"
[9]: https://github.com/shadcn-ui/ui?utm_source=chatgpt.com "Shadcn/UI"
[10]: https://v3.shadcn.com/docs/react-19?utm_source=chatgpt.com "Next.js 15 + React 19 - shadcn/ui"
[11]: https://github.com/radix-ui/primitives?utm_source=chatgpt.com "radix-ui/primitives"
[12]: https://base-ui.com/?utm_source=chatgpt.com "Unstyled UI components for accessible design systems · Base UI"
[13]: https://react-aria.adobe.com/?utm_source=chatgpt.com "React Aria Components - Adobe"
[14]: https://react-aria.adobe.com/getting-started?utm_source=chatgpt.com "Getting started | React Aria - Adobe"
[15]: https://ark-ui.com/?utm_source=chatgpt.com "Ark UI: Home"
[16]: https://tailwindcss.com/plus/ui-kit?utm_source=chatgpt.com "Catalyst - Tailwind CSS Application UI Kit"
[17]: https://github.com/airbnb/visx?utm_source=chatgpt.com "airbnb/visx - visualization components"
[18]: https://observablehq.com/plot/?utm_source=chatgpt.com "Plot | The JavaScript library for exploratory data visualization"
[19]: https://observablehq.com/plot/getting-started?utm_source=chatgpt.com "Getting started | Plot"
[20]: https://github.com/d3/d3?utm_source=chatgpt.com "d3/d3: Bring data to life with SVG, Canvas and HTML. : ..."
[21]: https://github.com/recharts/recharts?utm_source=chatgpt.com "recharts/recharts: Redefined chart library built with React ..."
[22]: https://github.com/recharts/recharts/discussions/5698?utm_source=chatgpt.com "Should we drop React 16 compatibility? #5698"
[23]: https://github.com/f5/unovis?utm_source=chatgpt.com "f5/unovis: Modular data visualization framework for React, ..."
[24]: https://github.com/plouc/nivo?utm_source=chatgpt.com "plouc/nivo: nivo provides a rich set of dataviz components ..."
[25]: https://tremor.so/?utm_source=chatgpt.com "Tremor – Copy-and-Paste Tailwind CSS UI Components for ..."
[26]: https://github.com/productiontype/Newsreader?utm_source=chatgpt.com "Newsreader"
[27]: https://fonts.google.com/specimen/Source%2BSerif%2B4?utm_source=chatgpt.com "Source Serif 4"
[28]: https://github.com/IBM/plex?utm_source=chatgpt.com "IBM Plex® typeface"
[29]: https://fontsource.org/?utm_source=chatgpt.com "Fontsource"
[30]: https://github.com/style-dictionary/style-dictionary?utm_source=chatgpt.com "style-dictionary/style-dictionary: A build system for creating ..."
[31]: https://github.com/radix-ui/colors?utm_source=chatgpt.com "radix-ui/colors: A gorgeous, accessible color system."
[32]: https://github.com/evercoder/culori?utm_source=chatgpt.com "Evercoder/culori: A comprehensive color library for ..."
[33]: https://github.com/adobe/leonardo?utm_source=chatgpt.com "adobe/leonardo: Generate colors based on a desired ..."
[34]: https://www.datawrapper.de/blog/colors-for-data-vis-style-guides?utm_source=chatgpt.com "A detailed guide to colors in data vis style guides"
[35]: https://designsystem.digital.gov/design-tokens/color/overview/?utm_source=chatgpt.com "Using color | U.S. Web Design System (USWDS)"
[36]: https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/?utm_source=chatgpt.com "The Visual Display of Quantitative Information"
[37]: https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md?utm_source=chatgpt.com "Financial Times Visual Vocabulary"
[38]: https://www.nngroup.com/articles/visual-hierarchy-ux-definition/?utm_source=chatgpt.com "Visual Hierarchy in UX: Definition"
[39]: https://www.nngroup.com/videos/whitespace/?utm_source=chatgpt.com "What is Whitespace? (Video) - NN/G"
[40]: https://motion.dev/?utm_source=chatgpt.com "Motion: JavaScript & React animation library"
[41]: https://github.com/lucide-icons/lucide?utm_source=chatgpt.com "lucide-icons/lucide: Beautiful & consistent icon toolkit ..."
[42]: https://github.com/phosphor-icons/react?utm_source=chatgpt.com "phosphor-icons/react: A flexible icon family for React"
[43]: https://github.com/iconoir-icons/iconoir?utm_source=chatgpt.com "Iconoir"
[44]: https://datavizproject.com/?utm_source=chatgpt.com "Data Viz Project | Collection of data visualizations to get ..."
[45]: https://observablehq.com/%40observablehq/plot-gallery?utm_source=chatgpt.com "Plot Gallery"
[46]: https://www.datavisualizationsociety.org/iib-awards?utm_source=chatgpt.com "IIB Awards — Data Visualization Society"
