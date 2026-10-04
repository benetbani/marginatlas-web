# R2. Mobile tables and spacing at 375px: what design systems and research say, and a phone layout for each UK table

Research note, 2026-10-04. Read-only: no project source file was edited. Written for whoever builds the phone rendering of the UK country page.

Tags used everywhere below:

- **[P]** published guidance, published code or a published study, with its URL.
- **[M]** my measurement: glyph widths read from the font files with fontTools, or plain arithmetic on published numbers.
- **[J]** my judgement, built on [P] and [M] but not itself published anywhere.

Method. I read the GOV.UK Design System (pages, the GOV.UK Frontend SCSS, and the 2018 to 2026 table backlog thread), the NHS, ONS and US Web Design System table components, Salesforce Lightning, Material (M1 pages, the Material Components Web SCSS, the Compose Material 3 tokens), Apple's Human Interface Guidelines (the JSON behind the live pages), IBM Carbon, Shopify Polaris (docs source and CSS), Atlassian, Bootstrap, the FT's Origami o-table, Datawrapper, Nielsen Norman Group, Baymard, UXmatters (Steven Hoober, Matteo Penzo), A List Apart (Jessica Enders twice, Richard Rutter), Butterick, Matt Ström-Awn, the UK Government Analysis Function, Smashing Magazine, Adrian Roselli, CSS-Tricks and the WCAG 2.2 Understanding documents. I then measured Geist (the copy bundled in Next.js) and Space Grotesk (its open-source Glyphs source) so the guidance turns into pixels at 375.

The honest limit. I found no controlled experiment that compares phone table patterns (sideways scroll versus cards versus split tables) on comprehension. The only measured evidence in this field is Enders' zebra-stripe studies, Baymard's spec-sheet and comparison testing, Penzo's form-label eye tracking and the touch-target studies. Everything else (NN/g included) is expert guidance from observation, and the design systems are expert practice.

---

## 0. The short version

1. **The frame is 343px**: 375 minus two 16px gutters. 16px is what Material, iOS and the NHS use on phones (GOV.UK uses 15px). [P]
2. **Figures are narrow, heads are wide.** A Space Grotesk tabular figure is 0.62em, 8.7px at 14px, so this site's cells are 17 to 47px wide. The five peer heads at 12px semibold Geist are 66 to 107px on one line and 40 to 58px on two. The heads, not the numbers, set the column widths. [M]
3. **Beside a 112px country column, three numeric columns fit** at 375 (two-line heads, 16px gaps). Four fit only without flags and with 12px gaps. Five fit only if the country name moves onto its own line. With one-line heads, only two fit. [M]
4. **Rows**: 36px for a read-only row (8 + 20 + 8), at least 44px when the row is a tap target. Line heights: 20px for 14px text, 16px for 12px text. [P + J]
5. **Heads**: wrap to at most two lines, bottom-aligned, right-aligned over numbers, unit last. Never truncate. [P]
6. **Separation**: 1px hairline rules between rows. No zebra stripes: GOV.UK dropped them after users read meaning into the background colour, and the home row's tint is the one background on this page that does carry meaning. [P + J]
7. **Rhythm**: 16px gutter, 16px from a section heading to its content, 24px between groups inside a section, 48px between sections. [J on P]
8. **Peer comparison**: two tables (three money columns, then two time and pay columns), countries in the same order in both, heads said once per table. Alternative: one table with each country's name on its own line above its five figures. [J]
9. **Legal forms**: one row per form, the name wraps inside a 119px column, the figures sit on the name's first line, the whole row is the plus. [J]
10. **Bars**: the name and its figure on one line, the bar on its own full-width line under them. **Facts 2x2**: stays two-up at 375 while every note fits in two lines; otherwise one column. [J]

---

## 1. The numbers

### 1.1 The frame

| # | Number | What it is | Source |
|---|---|---|---|
| F1 | 375 CSS px | iPhone SE (3rd generation) viewport: 750 device px at 2x, 326 ppi. One CSS px is 0.156 mm on this phone [M] | https://support.apple.com/en-us/111866 |
| F2 | 16 dp | Material screen-edge margin, left and right, on mobile | https://m1.material.io/layout/metrics-keylines.html |
| F3 | 16 pt / 20 pt | iOS minimum root-view layout margin at compact / regular width (secondary source describing UIKit) | https://useyourloaf.com/blog/changing-root-view-layout-margins/ |
| F4 | 15 px / 30 px | GOV.UK page gutter below / from the 641px tablet breakpoint (half / full of a 30px gutter) | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/helpers/_width-container.scss and https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_measurements.scss |
| F5 | 16 px | NHS page gutter on mobile (half of a 32px gutter) | https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/src/nhsuk/core/settings/_globals.scss |
| F6 | 343 px / 335 px | Content width at 375 with 16px / 20px gutters [M] | arithmetic on F1 |
| F7 | 8 dp / 4 dp | Material baseline grid for components / for type | https://m1.material.io/layout/metrics-keylines.html |

### 1.2 Type and line height

| # | Number | What it is | Source |
|---|---|---|---|
| T1 | 14/20, 12/16, 12/16, 11/16 | Material 3 Body Medium, Body Small, Label Medium, Label Small (size / line height) | https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt |
| T2 | 14/18, 14/20, 12/16 | Carbon body-compact-01, body-01, label-01 (and helper-text-01) | https://carbondesignsystem.com/elements/typography/type-sets/ |
| T3 | 15/20, 13/18, 12/16, 11/13 | iOS Subhead, Footnote, Caption 1, Caption 2 at the default Large size | https://developer.apple.com/design/human-interface-guidelines/typography |
| T4 | 11 pt (17 default) | iOS minimum text size | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| T5 | 16/20 and 19/25 | GOV.UK 16px and 19px text on mobile; tables are 19px, with a modifier (Frontend 5.2+) that drops data-heavy tables to 16px below the tablet breakpoint | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_typography-responsive.scss and https://design-system.service.gov.uk/components/table/ |
| T6 | 1.5x | WCAG 1.4.12: the layout must survive a user override to line height 1.5 (authors need not set it) | https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html |
| T7 | line-height 1; padding 0.125em 0.5em 0.25em | Rutter: table cells can drop extra leading because their lines are short | https://alistapart.com/article/web-typography-tables/ |
| T8 | 4.5:1 | WCAG 1.4.3 minimum contrast for text under 24px regular (applies to 12px muted heads) | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html |

### 1.3 Widths measured for this site [M]

Geist was measured at weights 400 and 600 from the variable font bundled in Next.js (`node_modules/next/dist/next-devtools/server/font/geist-latin.woff2`, same family as https://github.com/vercel/geist-font). Space Grotesk was read from its source file (`sources/SpaceGrotesk-v2.glyphs` at https://github.com/floriankarsten/space-grotesk): masters Light 300 and Bold 700, Regular interpolated.

| # | Number | What it is |
|---|---|---|
| W1 | 0.62 em: 8.68 px at 14px, 7.44 px at 12px | Space Grotesk tabular figure, identical in the Light and Bold masters, so a bold best value never changes a column's width |
| W2 | about 0.25 em: 3.5 px at 14px | Space Grotesk comma and period (no tabular variant exists) |
| W3 | 30 / 38 / 47 / 26 / 17 px | 14px figures shaped "00.0", "0,000", "00,000", "000", "00" |
| W4 | 0.60 em: 8.4 px at 14px | Geist tabular figure. Geist's default figures are proportional (the 1 is 0.38 em, the 0 is 0.66 em), so tabular must be switched on wherever Geist prints a number |
| W5 | 89 / 103 / 66 / 79 / 107 px | 12px semibold heads on ONE line: Effective tax %, Payroll on staff %, LLC all-in $, Days to trade, Average salary $K |
| W6 | 54 / 58 / 40 / 44 / 55 px | The same heads on TWO lines, widest line ("Effective", "Payroll on", "all-in $", "Days to", "salary $K") |
| W7 | 104 / 80 / 59 / 45 / 45 px | 14px regular: United Kingdom, Netherlands, Germany, Ireland, France (semibold adds about 4%) |
| W8 | 78 to 83 px | Longest single words likely in a 14px label column: Netherlands 80, Luxembourg 83, Professional 82, Hairdressing 82, Switzerland 78 |
| W9 | 157 / 178 / 72 px | 14px: Private limited company, Limited liability partnership, Sole trader |
| W10 | 64 / 29 / 32 / 38 / 46 px | 12px semibold: Paperwork (one word, cannot wrap), Days, Fee $, Cost $, $ a year |
| W11 | 133 / 156 / 116 px | 14px: Housing and utilities, Regulation and red tape, Access to finance |

### 1.4 Touch

| # | Number | What it is | Source |
|---|---|---|---|
| H1 | 44 x 44 pt (28 x 28 minimum) | Apple default control size on iOS | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| H2 | about 12 pt / about 24 pt | Apple padding around bezeled / non-bezeled elements | same |
| H3 | 24 x 24 CSS px | WCAG 2.5.8 (AA) minimum target, or equivalent spacing | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| H4 | 44 x 44 CSS px | WCAG 2.5.5 (AAA) | https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html |
| H5 | 48 x 48 dp, 8 dp apart | Material touch target and spacing | https://m1.material.io/layout/metrics-keylines.html |
| H6 | 1 cm x 1 cm, about 2 mm apart | NN/g minimum physical target; about 64 CSS px on F1's phone [M] | https://www.nngroup.com/articles/touch-target-size/ |
| H7 | 7 / 11 / 12 mm | Hoober: centre / top / bottom of the screen, sized to hold 95% of observed taps; about 45 / 71 / 77 CSS px on F1's phone [M] | https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php and https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/ |
| H8 | 44 CSS px = 6.9 mm | On F1's phone, so Apple's 44 sits at Hoober's centre-screen 7mm [M] | arithmetic on F1 |

### 1.5 Table rows and cells

| # | Number | What it is | Source |
|---|---|---|---|
| R1 | 24 / 32 / 40 / 48 / 64 px | Carbon row sizes xs / sm / md / lg / xl; md (40) is the default; the head row matches the body size | https://carbondesignsystem.com/components/data-table/usage/ |
| R2 | 16 px | Carbon cell padding on each side | https://carbondesignsystem.com/components/data-table/style/ |
| R3 | 52 / 56 / 36 px, 16 px | Material data table row / head row / minimum dense row; 16px cell padding each side | https://github.com/material-components/material-components-web/blob/master/packages/mdc-data-table/_data-table-theme.scss |
| R4 | 48 dp row; 56 dp between columns; 24 dp edges; 12 sp heads, 13 sp body | Material 1 data table (desktop era) | https://m1.material.io/components/data-tables.html |
| R5 | 8 x 6 px (12 px between columns, 12 px at the outer edges); 6 px dense; 12 px head | Polaris DataTable cell padding; body cells do not wrap except the first column | https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/DataTable/DataTable.module.css and https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/size.ts |
| R6 | 10 px top and bottom, 20 px right, 0 left | GOV.UK table cell padding, 1px bottom border, last cell 0 right; 20px below the table on mobile | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/table/_mixin.scss |
| R7 | 8 px (4 px small) | Bootstrap 5.3 cell padding, both axes | https://getbootstrap.com/docs/5.3/content/tables/ |
| R8 | 4 px (8 px from 641px), 16 px right | NHS compact table cell padding on mobile | https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/src/nhsuk/components/tables/_index.scss |
| R9 | 36 px | Polaris row: 8 + 20 + 8 [M] | arithmetic on R5 |
| R10 | 41 px | GOV.UK row with 16/20 text: 10 + 20 + 10 + 1 [M] | arithmetic on R6 |

### 1.6 Lists and label/value pairs

| # | Number | What it is | Source |
|---|---|---|---|
| L1 | 56 / 72 / 88 dp | Material 3 list items, one / two / three lines; 16 dp leading and trailing; 10 dp top and bottom; 12 dp between elements | https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ListTokens.kt |
| L2 | 48 (dense 40) / 72 (60) / 88 (76) dp | Material 1 list tiles, single / two / three lines | https://m1.material.io/components/lists.html |
| L3 | 5 px, 15 px, 1 px | GOV.UK summary list below 641px: key ABOVE value, 5px key to value, 15px after the value, a 1px rule per row. From 641px: key 30% and actions 20% in one row | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/summary-list/_mixin.scss |
| L4 | 15 px | NHS responsive table below 641px: the head is hidden, each cell shows its heading on the left and its value on the right, rows sit 15px apart, stripes are switched off | https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/src/nhsuk/components/tables/_index.scss |
| L5 | 1 column beats 2 | Baymard: a two-column spec sheet made specs much harder to find and interpret than one column, and some users read it as a comparison. 20% of sites use multiple columns; 23% give no visual aid to rows | https://baymard.com/blog/spec-sheet-scannability |
| L6 | about 50 ms vs about 500 ms | Penzo eye tracking on FORMS: eye travel from a label above the field versus a left-aligned label far from its field | https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php |

### 1.7 Spacing scales and rhythm

| # | Number | What it is | Source |
|---|---|---|---|
| S1 | 2 4 8 12 16 24 32 40 48 64 80 96 160 | Carbon spacing scale (nearly this project's ladder) | https://carbondesignsystem.com/elements/spacing/overview/ |
| S2 | 0-8 / 12-24 / 32-80 px | Atlassian: inside components, table cells included / between grouped items / between page sections | https://atlassian.design/foundations/spacing |
| S3 | 5 10 15 15 15 20 25 30 40 | GOV.UK responsive spacing units 1 to 9 on small screens (5 10 15 20 25 30 40 50 60 on large) | https://design-system.service.gov.uk/styles/spacing/ |
| S4 | 20 px / 15 px | GOV.UK space below a large / a medium or small heading on mobile | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/core/_typography.mixin.scss |
| S5 | 40 px / 60 px | GOV.UK large / extra-large section break on mobile (20 / 30 above and below) | https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/core/_section-break.mixin.scss |
| S6 | 40 px | NHS space below a table on mobile | https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/src/nhsuk/components/tables/_index.scss |
| S7 | 4 8 8 16 24 32 40 48 56 | NHS responsive spacing units 1 to 9 on mobile | https://github.com/nhsuk/nhsuk-frontend/blob/main/packages/nhsuk-frontend/src/nhsuk/core/settings/_spacing.scss |

### 1.8 Columns, comparison and patterns

| # | Number | What it is | Source |
|---|---|---|---|
| C1 | up to 5 items (3 to 4 in compare tools) | NN/g: comparison tables suit up to five options | https://www.nngroup.com/articles/comparison-tables/ |
| C2 | 2 items | NN/g: on a phone a comparison table rarely shows more than two options at once | same |
| C3 | 2 columns | NN/g: with complex entries only two columns may be legible on a narrow phone; number-heavy tables can use narrower columns and show more | https://www.nngroup.com/articles/mobile-tables/ |
| C4 | about 6 columns | Hoober: people struggle to follow more than about half a dozen columns on any screen | https://www.uxmatters.com/mt/archives/2020/07/designing-mobile-tables.php |
| C5 | 1 column; 3 users; 0 users | Baymard mobile testing: in portrait one full product column is visible; only 3 participants used Walgreens' compare tool and nobody used B&H's | https://baymard.com/blog/provide-comparison-features |
| C6 | 450 px | Datawrapper's optional card ("transposed") fallback switches on below this width; the default on phones is sideways scroll; each column can be set to show on desktop, mobile or both | https://www.datawrapper.de/academy/customizing-your-table and https://www.datawrapper.de/blog/new-table-tool-barcharts-fixed-rows-responsive-2 |
| C7 | about 5 segments | Apple: at most about five segments in a segmented control on iPhone | https://developer.apple.com/design/human-interface-guidelines/segmented-controls |
| C8 | 3 modes | FT o-table: overflow (the whole table scrolls), scroll (flipped, heads become a sticky first column), flat (each row becomes its own block with the heads repeated) | https://registry.origami.ft.com/components/o-table |

### 1.9 Evidence on separation and expanding rows

| # | Number | What it is | Source |
|---|---|---|---|
| E1 | 244 people; no accuracy difference; 46% preferred stripes, 33% no preference | Enders, first zebra study (15-row, 9-column table) | https://alistapart.com/article/zebrastripingdoesithelp/ |
| E2 | 2,276 sessions; stripes better on 3 of 8 questions, never worse; one-colour stripes rated most helpful by 31%, least by 4% | Enders, follow-up studies | https://alistapart.com/article/zebrastripingmoredataforthecase/ |
| E3 | stripes removed | GOV.UK's design team recorded that research participants read meaning into alternating backgrounds, so the table component dropped them | https://github.com/alphagov/govuk-design-system-backlog/issues/61 |
| E4 | 136 people | NN/g accordion icons: a caret signals expand-in-place best, a plus about as well, a right arrow no better than no icon; people tap the label and the icon about equally | https://www.nngroup.com/articles/accordion-icons/ |

---

## 2. Answers to the seven questions

### Q1. How many numeric columns fit at 375? Minimum gap between numeric columns? Minimum label column?

**Published [P].**
- NN/g: columns must be legible without zooming; with complex entries perhaps only two fit, and number-heavy tables can go narrower (C3). Hoober: about six columns is hard on any screen (C4).
- GOV.UK's design team (backlog thread, 2023): a table of a few short columns needs no change at narrow widths; columns the reader compares directly are better kept as columns (they suggest scrolling); mixed tables can merge text columns; tables with no comparable columns can become cards (https://github.com/alphagov/govuk-design-system-backlog/issues/61).
- Gaps between columns in published systems: Polaris 12px (R5), Bootstrap 16px (R7), NHS 16px (R8), GOV.UK 20px (R6), Rutter half an em each side, so one em between columns (T7), Carbon and Material 32px (R2, R3), Material 1 at least 56dp on desktop (R4).
- A GOV.UK accessibility contributor reported that very wide gaps make it hard for screen-magnifier users to relate a cell to its row label (same thread, 2018). Too much gap is also a fault.

**Measured [M].** The figures need 17 to 47px (W3). The heads need 66 to 107px on one line and 40 to 58px on two (W5, W6). So head wrapping decides the capacity:

| Label column | Gap | Numeric column | Numeric columns in 343px |
|---|---|---|---|
| 112 px (flag + name) | 16 px | 56 to 64 px (two-line heads) | **3** (112 + 3 gaps + 56 + 60 + 64 = 340) |
| 112 px | 12 px | 48 px | 3 (four would need 352) |
| 88 px (no flag) | 12 px | 48 px | 4 (88 + 4 x 60 = 328) |
| 112 px | 16 px | 66 to 107 px (one-line heads) | 2 |
| none (name on its own line) | inside the column | 68.6 px (343 / 5) | 5 |

With 20px gutters (335px) the three-column row still fits if the gaps drop to 12px.

**Judgement [J].**
- **Three numeric columns beside the label column is the phone maximum for this site.** Two-line heads are not optional; with one-line heads only two columns fit, which is why the current table wraps unpredictably.
- **Gap: 16px by default, 12px minimum.** Keep at least 16px between a left-aligned text column and the first numeric column, because ragged names can run right up to their column edge. Between two right-aligned numeric columns the visible gap is the nominal gap plus the slack inside the column, so 12px is safe there.
- **Minimum label column: 112px with a flag** (20px flag + 8px gap + 84px for the longest unbreakable word, W8), **88px without**. Names wrap at word boundaries and never truncate.

### Q2. Row height and vertical padding (read-only, tappable, dense). Line height for 14px and 12px

**Published [P].** Read-only table rows in published systems sit between 32 and 52px: Carbon 32 or 40 (R1), Polaris 36 (R9), Bootstrap 40 and 32 (R7 padding around its 24px line), GOV.UK 41 to 46 (R10), Material 52 with a 36 minimum (R3). Tap targets: Apple 44pt (H1), WCAG 24px at AA and 44px at AAA (H3, H4), Material 48dp (H5). Lists: Material 3 one-line items 56dp (L1), Material 1 dense single-line 40dp (L2). Line heights: Material, Carbon and Apple agree on 20px for 14px text and 16px for 12px text (T1 to T3); Carbon also offers 14/18 for compact rows. WCAG 1.4.12 means rows must grow, not clip, if a reader forces line height 1.5 (T6).

**Judgement [J].**

| Row kind | Padding | Height | Rule |
|---|---|---|---|
| Read-only table row | 8 px top and bottom | 36 px (8 + 20 + 8) + 1 px rule | hairline |
| Tappable row, one line | 12 px | 44 px | hairline |
| Tappable row, name plus a 12px second line | 12 px | 60 px (12 + 20 + 16 + 12) | hairline |
| Dense list (short sequences, nothing to tap, nothing compared across columns) | 4 px | 28 px | none |

- Line heights: **14px text on 20px, 12px text on 16px**, both on the 4px grid. Two-line heads are a 32px block.
- Never set fixed row heights; set padding and line height so rows grow (T6).
- Body cells: `vertical-align: baseline`, so Geist names and Space Grotesk figures share the first line's baseline even when a name wraps. Head cells: `vertical-align: bottom`.
- If a peer name is a link, stretch its hit area to the full 36px row: that clears WCAG AA (24px) without making every read-only row 44px.

### Q3. When to scroll, stack, split, show one metric, or transpose

| Pattern | Published: use it when | Comparison cost | Other costs | Fit for this page |
|---|---|---|---|---|
| **(a) Scroll inside the table, first column sticky** | Columns must be compared directly and there are too many to split: GOV.UK team (issue 61); NN/g (lock the row labels, C3); Polaris fixed first columns for many-column reports (https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/components/tables/data-table.mdx); Datawrapper default plus a sticky first column (https://www.datawrapper.de/blog/sticky-table-columns); FT overflow (C8); Bootstrap `.table-responsive`; Rutter (a readable table that scrolls beats an unreadable one); Roselli (a focusable, labelled scroll region is the minimal accessible fix, https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html); WCAG 1.4.10 lets the table, not the page, scroll in two directions (https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Low while the columns are in view; columns off-screen cannot be compared at all | Off-screen columns get missed: NN/g found people do not expect sideways scrolling and often miss even strong cues (https://www.nngroup.com/articles/horizontal-scrolling/, a desktop study); cut-off columns and arrows beat dots (C3). Hoober: two-axis scrolling confuses (C4). Baymard: one column visible in portrait, so compare tools went unused (C5). A GOV.UK accessibility contributor: sticky columns can hide data from magnifier users (issue 61). Roselli: no mandatory scroll snap | **No.** The page rule bans it and the founder dislikes hidden content; it is not needed for five numeric columns that can be split. Keep only as a last resort for seven or more numeric columns (none on the UK page) |
| **(b) Stack each row into a card of label/value pairs** | Rows are independent records whose columns are not compared across rows; the task is looking up one row: GOV.UK team (issue 61); Smashing, Bece (https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/); NHS, ONS, USWDS and Salesforce stacked variants (L4; https://service-manual.ons.gov.uk/design-system/components/table; https://designsystem.digital.gov/components/table/; https://v1.lightningdesignsystem.com/components/data-tables/); Datawrapper fallback (C6); FT flat (C8) | High: comparing one column across rows has to be done from memory. NN/g: tabs and lists lose true side-by-side comparison (C1). Hoober: people can no longer run down a column | Every label repeats on every row (25 labels for a 5 x 5 table); page height grows (Bece); `display: block` on table elements has dropped table semantics in some browsers (Roselli; Bece) | **No** for every table here: all six are read by comparing down columns |
| **(c) Split into two narrower tables, label column repeated, heads once per table** | NHS: present the least data you can and organise a lot of it into several tables (https://service-manual.nhs.uk/design-system/components/table). I found no test of this pattern on phones | Low inside each half; a row's full profile spans two tables, so the reader finds the row twice | The label column repeats; mitigate with identical row order, the home tint in both halves and one shared column grid | **Yes for the peer table.** It is the page's own rule and keeps every figure in a true column |
| **(d) One metric at a time behind a segmented control** | NN/g: pre-selecting a subset works when people need to see the data but not compare it; comparing then means memorising and mental arithmetic (C3). NN/g: tabs lose side-by-side comparison (C1). Apple: about five segments at most on iPhone (C7) | High across metrics; zero within one metric | Hides four fifths of the table; extra taps; five labelled segments at 343px get about 68px each while "Effective tax" alone needs 84 to 89px at 14px (regular to semibold) [M] | **No.** Hidden content, and it does not fit |
| **(e) Transpose (swap rows and columns)** | FT scroll mode flips the table with a sticky heads column (C8); Datawrapper's card fallback is called transposed (C6); Datawrapper: tables read more easily with more rows than columns (https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables); UK Analysis Function: put the numbers being compared in columns so units sit above units (https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/) | Raises it: each metric is now compared along a row, where place values no longer stack | Heads become country names of 45 to 104px (W7), so five country columns do not fit beside metric labels | **No** for a 5 x 5 table. Useful only for few items with many attributes (for example 2 items x 8 attributes) |
| **(f) Name on its own line, figures on the line below** (two content lines inside one ruled row) | Hoober describes this "stacked columns" layout as a way to keep a table a table on phones (C4) | Low: figures stay in true columns under one set of heads | The figures line has no label of its own, so proximity carries the meaning (4px name to figures, 16px plus a rule between rows); markup needs a row-group header per country to keep semantics | **Alternative for the peer table** if one read is preferred to two |

**On sideways scrolling inside a table**, the founder's specific question: the research treats it as acceptable for large tables (NN/g, GOV.UK, Polaris, Datawrapper, Rutter, Roselli, WCAG reflow) but costly: hidden columns are often missed, cues must be cut-off columns rather than dots, keyboard users need a focusable region, and magnifier users can lose data behind a sticky column. Every source treats it as the answer for tables that cannot be made narrower. None of the UK page's tables is in that class, so the founder's ban costs nothing here.

### Q4. Header rules

**Published [P].**
- Wrap, do not truncate: Polaris says wrap instead of truncating (data-table docs above); Carbon wraps to two lines, then truncates with a hover tooltip, and asks for one- or two-word titles (R1 page).
- Align heads with their data: right-align numeric heads (Polaris; Rutter T7; Ström-Awn https://mattstromawn.com/writing/tables/; UK Analysis Function; GOV.UK has a numeric header class, R6). Never centre (Polaris; Ström-Awn).
- Bottom-align heads so they sit on the data: Hoober (C4) and a 2024 GOV.UK contributor proposal in issue 61.
- Units belong in the head, not in each cell (Polaris; UK Analysis Function).
- Material 1 offered either sideways scroll or a shortened head with the full name on hover (R4).

**Judgement [J].**
- At most **two lines** at 12/16 (a 32px block). If a head needs three lines, shorten the head. No tooltips: phones have no hover and pop-ups are banned.
- **Bottom-align** every head so the last line sits on the head rule; the column's last line is the one nearest the figures.
- **Right-align numeric heads** flush with the figures' right edge; left-align the label column's head.
- **Unit last**, on the head's last line, directly above the figures: "tax %", "all-in $", "salary $K".
- **Choose the break** instead of leaving it to the browser: a non-breaking space or explicit break keeps "staff %" and "all-in $" together ("Payroll on / staff %", "LLC / all-in $").
- Semibold, muted, but at least 4.5:1 against the background (T8).

### Q5. Label/value lists (key facts) on a phone

**Published [P].**
- Stacked: GOV.UK's summary list puts the key above the value below 641px, 5px apart, 15px after, with a rule per row (L3), and warns that removing row borders hurts many users, especially those who zoom (https://design-system.service.gov.uk/components/summary-list/). iOS subtitle cells put a label above a smaller line (https://developer.apple.com/documentation/uikit/uitableviewcell/cellstyle).
- Inline: NHS's stacked table rows put the heading on the left and the value on the right (L4). iOS Settings uses label left, value right-aligned (the value1 style, same URL). Salesforce offers both stacked and inline variants.
- Baymard: one column beats two; rows need horizontal styling (shading or rules) for the eye to travel from label to value across the gap (L5).
- Penzo (forms, not read-only lists): a label right above its field is read in one movement (L6). NN/g: a label belongs closer to its own value than to anything else (https://www.nngroup.com/articles/gestalt-proximity/).

**Judgement [J].**
- **Inline** (label left, value right-aligned at the 343px edge) for numeric values and lists of three or more pairs: 36px rows, 1px rules. The rules are what bridge a label and a value that can sit 200px apart.
- **Stacked** (label above value) inside narrow containers of 170px or less (the 2x2 tiles), or when values are text longer than about 16 characters: 4px from label to value, 16px between pairs.
- **One column** at 375 for lists. Two columns only for at most four self-contained tiles with short values (see 3.6).
- **Dividers** for inline rows; whitespace for stacked pairs inside tiles.

### Q6. Rules, zebra stripes or whitespace

**Published [P].**
- Measured evidence: Enders found no consistent accuracy or speed gain from stripes in 244 people (E1); her follow-up of 2,276 sessions found stripes better on 3 of 8 questions and never worse, with one-colour stripes the most preferred (E2).
- GOV.UK dropped stripes after research participants read meaning into the background colour (E3).
- For row aids: NN/g says borders, stripes and hover highlighting all help (https://www.nngroup.com/articles/data-tables/); Baymard says shading or lines help (L5); Datawrapper reserves stripes for long tables with many columns and calls them unnecessary or confusing with few columns (Q3 URL); Apple suggests alternating rows for multicolumn tables on macOS (https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).
- Against stripes: Rutter (T7), Ström-Awn (Q4 URL) and Hoober (C4), who also rejects vertical rules. UK Analysis Function: avoid shading where possible, do not overuse gridlines, mark the line under the head row and around totals. Few: gridlines are not essential to a table (https://analyticsconsultores.com.mx/wp-content/uploads/2019/03/Show-Me-the-Numbers-Stephen-Few-Perceptual-Edge-2004.pdf, slide 55).
- NHS switches stripes off on its stacked phone table (L4).

**Judgement [J].** 1px hairline rules in a light warm grey between body rows; a darker 1px rule under the head row and above any total row; no vertical rules; **no stripes anywhere**. The home row's tint is the one background on this page that means something, and GOV.UK's finding says a second, meaningless background would muddy it. Bar lists and tiles separate by whitespace alone.

### Q7. Spacing rhythm on the phone

**Published [P].** Gutters of 15 to 16px (F2 to F5). GOV.UK on mobile: 15 to 20px below headings (S4), 20px below tables (R6), section breaks of 40 or 60px (S5). NHS: 40px below tables (S6). Atlassian: 0 to 8px inside components, 12 to 24px between groups, 32 to 80px between sections (S2). NN/g: a heading sits closer to its own content than to what comes before it (Q5 URL).

**Judgement [J]**, all on the ladder:

| Space | px |
|---|---|
| Page gutter | 16 |
| Section heading to its content | 16 (12 under a 14 or 16px subhead) |
| Between groups inside a section | 24 |
| Between sections | 48 (40 at the least; 64 on desktop) |
| Table to the note under it | 8 |
| Between the two halves of a split table | 24 |
| Inside a tile: padding / between label, value and note | 12 / 4 |

Keep the space above a section heading at least three times the space below it (48 to 16).

---

## 3. A phone layout for each table

Common settings [J]: 375px viewport, 16px gutters, 343px content. Labels 14/20 Geist; figures 14/20 Space Grotesk with tabular figures, the same number of decimals in a column, units only in the head; heads 12/16 Geist semibold, muted, contrast at least 4.5:1. Rules: 1px hairline between rows, 1px darker under the head row. In the sketches `[fl]` is a flag (20px plus an 8px gap), `#` is the best-value tick (12px icon plus 4px gap, set to the left of the figure so right edges stay aligned), `o` and `.` are filled and empty paperwork dots, `[+]` is the plus, `/` marks the home-row tint, and every figure is a shape placeholder, not data.

### 3.1 Peer comparison (5 countries x 5 metrics)

**Pattern: (c) split into two tables.** Table A holds the money columns (Effective tax %, Payroll on staff %, LLC all-in $); table B holds time and pay (Days to trade, Average salary $K). Same five countries in the same order in both, home row first and tinted in both, ticks per column in both.

Why: five numeric columns (44 to 64px each, two-line heads or tick plus figure, whichever is wider) plus a 112px country column and 12px gaps need about 447px (W3, W6, W7); three fit (Q1). The table exists to compare down columns, which rules out cards (b) and transposing (e); sideways scroll (a) is banned and unnecessary; one metric at a time (d) hides four fifths of it.

Table A geometry: country 115 | 16 | Effective tax % 56 | 16 | Payroll on staff % 60 | 16 | LLC all-in $ 64 = 343.

```
|<------------------------------ 343 ------------------------------>|
|<------ 115 ------->|16|<-- 56 -->|16|<--- 60 --->|16|<---- 64 --->|

                          Effective    Payroll on           LLC      12/16 semibold,
 Country                      tax %       staff %      all-in $      bottom + right aligned
=====================================================================  1px darker rule
/[fl] United           #  00.0          00.0           0,000       /  home row: tint bleeds
/     Kingdom                                                      /  8px into each gutter
---------------------------------------------------------------------  1px hairline
 [fl] Ireland             00.0     #    00.0      #      000
---------------------------------------------------------------------
 [fl] France              00.0          00.0           0,000
---------------------------------------------------------------------
 [fl] Germany             00.0          00.0           0,000
---------------------------------------------------------------------
 [fl] Netherlands         00.0          00.0          00,000
```

Table B geometry: its two numeric columns sit exactly under table A's last two, so both tables share one right-hand grid: country 187 | 16 | Days to trade 60 | 16 | Average salary $K 64 = 343.

```
|<------------------- 187 -------------------->|16|<--- 60 --->|16|<---- 64 --->|

                                                      Days to        Average
 Country                                                trade      salary $K
===============================================================================
/[fl] United Kingdom                              #       00            000   /
-------------------------------------------------------------------------------
 [fl] Ireland                                             00     #      000
```

Measurements: head block 32 + 8 + 1 = 41px; rows 37px pitch (36 + 1); each table 41 + 5 x 37 = 226px; 24px between the tables; about 476px in all.

Notes:
- "United Kingdom" (104px) wraps in table A's 87px name box and that row grows to 56px; figures stay on the first line because the cells align on the baseline. If the site has a short name, "UK" avoids the wrap on the UK's own page [J].
- Table B's names sit far from their figures; the hairlines carry the eye across (Baymard, L5). Do not stretch table A's columns to fill space (the magnifier finding in Q1).
- Ticks: a bold Space Grotesk figure is exactly as wide as a regular one (W1), so the bold best value never shifts a column.
- Markup: two plain `<table>` elements with captions, `<th scope="row">` for the country and `<th scope="col">` for the heads; no `display` tricks.

**Alternative (f), one read** [J, Hoober C4]: one table, heads once, five equal columns of 68.6px; each country is a ruled block of a name line and a figures line (8 + 20 + 4 + 20 + 8 = 60px). About 346px in all, and a country's five figures read in one glance. Costs: the figures line has no label of its own; the markup needs a `<tbody>` per country with a row-group header; and a tick on a five-digit LLC figure (16 + 47 = 63px) leaves only 5px in a 68.6px column, so this layout needs the LLC column in $K or the best value marked by weight alone.

```
|<- 68.6 ->|<- 68.6 ->|<- 68.6 ->|<- 68.6 ->|<- 68.6 ->|
  Effective  Payroll on        LLC    Days to    Average
      tax %     staff %   all-in $      trade  salary $K
==========================================================
/[fl] United Kingdom                                     /  name line 14/20
/      00.0       00.0      0,000         00        000  /  figures, 4px below
----------------------------------------------------------
 [fl] Ireland
       00.0       00.0        000         00        000
```

### 3.2 Registering by legal form (3 forms x Fee $, Time (days), Paperwork dots, plus)

**Pattern: one row per form; the name wraps inside its own column; the figures, the dots and the plus sit on the name's first line; the whole row is the button.** This fixes the floating plus and the figures-on-a-second-line problem: every value stays in a true column.

Why: NN/g's accordion study found people tap the label and the icon about equally, so they must do the same thing (E4), and NN/g's mobile accordion guidance makes the whole header tappable (https://www.nngroup.com/articles/mobile-accordions/). Rows are top-aligned (Hoober, C4). Tap rows need 44px or more (H1, H4); these rows are 60 to 80px.

Geometry: form 119 | 12 | Fee $ 48 | 12 | Time (days) 40 | 12 | Paperwork 64 | 12 | plus 24 = 343.

```
|<--- 119 --->|12|<-48->|12|<-40->|12|<--- 64 --->|12|<24>|

                                   Time
 Form                Fee $       (days)      Paperwork
=============================================================
 Private limited     0,000           00          ooo..    [+]   whole row = button,
 company                                                        12px padding
 Ltd                                                            local name 12/16 muted
-------------------------------------------------------------
 Sole trader             0            0          o....    [+]
 (local name)
-------------------------------------------------------------
 Limited liability   0,000           00          oooo.    [+]
 partnership
 LLP
-------------------------------------------------------------
```

Open state: the panel takes the full 343px under the row, 12px below the local name and 16px above the next rule; its contents are inline label/value pairs (36px rows) or short lines, starting at x = 0.

```
 Private limited     0,000           00          ooo..    [x]
 company
 Ltd
                                                                12px
 Label words                                         value      inline pairs
 Label words                                         value
                                                                16px
-------------------------------------------------------------
```

Measurements: rows 60px with a one-line name (12 + 20 + 16 + 12), 80px with a two-line name. Heads: "Time / (days)" on two lines (35px) fits its 40px column; "Paperwork" (64px) cannot wrap and sets its column. Dots: five dots of 6px with 4px gaps (46px), right-aligned, centred on the first line, with a text alternative ("3 of 5"). Plus: a 16px icon right-aligned in a 24px slot, centred on the first line; the button carries `aria-expanded`.

### 3.3 The bill to register (4 numbered steps, each with days and $)

**Pattern: a true four-row table with a total row.** It already fits: two numeric columns leave 187px for step names, and the longest ("Register the company", 143px) stays on one line.

Geometry: number 20 | 8 | step 187 | 16 | Days 40 | 16 | Cost $ 56 = 343.

```
|20|8|<----------------- 187 ----------------->|16|<-40->|16|<-- 56 -->|

                                                     Days       Cost $
=========================================================================
  1  Register the company                               0          000
-------------------------------------------------------------------------
  2  Open a bank account                               00            0
-------------------------------------------------------------------------
  3  Step name                                          0          000
-------------------------------------------------------------------------
  4  Step name                                          0          000
=========================================================================  darker rule
     All in                                            00        0,000     semibold
```

Measurements: one-line heads (16 + 8 + 1 = 25px); rows 36px plus a hairline; the total row has a darker rule above it, as the UK Analysis Function asks for around summary figures (Q3 URL). About 210px in all. The days total must be the bill card's own figure, since steps can run in parallel [J].

### 3.4 Insurance (4 covers with $ a year and a bar)

**Pattern: two lines per cover. The name and its figure share line one; the bar takes the full 343px track on line two.** One head, "$ a year", above the figures, said once.

Why [J]: on one line, "Professional indemnity" (150px) next to a 56px figure column leaves a bar track of about 113px and forces names to wrap. On its own line the bar gets 343px, three times the length to judge by, and no name ever wraps. Datawrapper offers the same move, labels on a separate line, for long bar labels (https://www.datawrapper.de/academy/customizing-your-bar-chart). Bars start at zero on one shared track.

```
|<------------------------------ 343 ------------------------------>|
                                                          $ a year     head 12/16, right
 Employers' liability                                          000     14/20, figure right
 ##########################################.......................     8px bar, 4px below
                                                                       16px
 Public liability                                              000
 ######################...........................................
                                                                       16px
 Professional indemnity                                        000
 #############....................................................
```

Measurements: pitch 48px (20 + 4 + 8 + 16); about 200px for four covers with the head. No rules: the bars separate the rows.

### 3.5 Ranked bars (7 to 8 rows of name + % + bar)

**Pattern: the same as 3.4, tighter.** Name and figure on line one, a full-width bar on line two, 12px between rows, sorted largest first, so position carries the rank and no rank numbers are needed. One small head above the figures, "%" (or "Share %"), says the unit once.

Why [J]: these lists carry labels up to 156px ("Regulation and red tape", W11). A one-line layout (label 112 | 12 | bar | 12 | figure 40) leaves a 167px track and wraps every long label onto two lines; the two-line layout never wraps and keeps all three ranked lists on the page identical.

```
|<------------------------------ 343 ------------------------------>|
                                                              Share %
 Housing and utilities                                           00.0
 ##############################################################.....
                                                                       12px
 Regulation and red tape                                         00.0
 ##############################################...................
                                                                       12px
 Access to finance                                               00.0
 ####################################.............................
```

Measurements: pitch 44px (20 + 4 + 8 + 12); eight rows plus the head is about 364px. If the founder wants it shorter and every label in a list is 104px or less (trade names usually are, W8), the one-line variant at a 32px pitch saves about 85px; use it for all three lists or for none.

### 3.6 A 2x2 grid of facts (icon, label, value, short note)

**Pattern: keep it two-up at 375, label above value inside each tile, as long as every note fits in two lines. Otherwise switch all four to one column of inline rows.**

Why: Baymard's warning against two columns (L5) is about long spec lists, where people read two parallel columns as a comparison. Four self-contained tiles, each with its own icon and label, do not carry that risk, and two-up halves the height. Inside a 141px tile, stacking the label over the value is the GOV.UK mobile pattern (L3). The large empty areas the founder sees come from tall fixed tiles and from label-left, value-far-right pairs on a 343px line; tiles that size to their content and stack their content remove both [J].

Geometry: two tiles of 165.5px with a 12px gap (343 = 165.5 + 12 + 165.5); 12px padding, so a 141.5px inner box; 12px between the two rows of tiles.

```
|<-------- 165.5 -------->|12|<-------- 165.5 -------->|
+-------------------------+  +-------------------------+
| [i] Label words         |  | [i] Label words         |  icon 16 + 8, label 12/16 semibold
| 0,000                   |  | 00.0%                   |  value 24/28 Space Grotesk, 4px below
| Short note, two lines   |  | Short note              |  note 12/16, 4px below, two lines max
| at the most             |  |                         |
+-------------------------+  +-------------------------+
                         12px
+-------------------------+  +-------------------------+
| [i] Label words         |  | [i] Label words         |
| ...                     |  | ...                     |
+-------------------------+  +-------------------------+
```

Measurements: tile 12 + 16 + 4 + 28 + 4 + 32 + 12 = 108px; grid 228px. Fits: a three-word label up to 117px at 12px (for example "Corporation tax" 93px); a value such as "$12,000" at 24px is about 95px; a note of about 44 characters in two lines. Top-align the contents and let the row of tiles take the taller tile's height, so slack lands only under the shorter note. Fallback (any note over two lines or any label over two lines): one column of four inline rows (icon and label on the left, the note under the label, the value right-aligned), 12 + 20 + 2 + 16 + 12 = 62px each with hairlines, 248px in all.

---

## 4. What the research says NOT to do

1. **Do not let one row's figures wrap onto a second line under a second set of heads.** People must be able to run down a column (Hoober, C4; NN/g, C3). That is the peer table's current failure.
2. **Do not truncate heads, names or values**, and do not lean on hover tooltips (Polaris; Carbon's truncation fallback needs hover, which phones lack and the page bans).
3. **Do not centre numbers or numeric heads**; right-align both, with tabular figures (Polaris; Ström-Awn; Rutter; UK Analysis Function).
4. **Do not put units in every cell**; say them once in the head (Polaris; UK Analysis Function).
5. **Do not stripe rows**, least of all next to a tinted row that means something (GOV.UK, E3; Rutter; Hoober). No vertical rules (Hoober).
6. **Do not turn a comparison table into cards**: comparison then runs on memory (NN/g, C1; GOV.UK team; Hoober; Bece).
7. **Do not transpose a table so the numbers being compared run along a row** (UK Analysis Function).
8. **Do not use sideways scroll for five or six numeric columns that can be split.** Where it is ever unavoidable: show a cut-off column rather than dots (NN/g), make the region focusable and labelled (Roselli), no mandatory scroll snap (Roselli), and remember sticky columns can hide data from magnifier users (GOV.UK issue 61).
9. **Do not use a right-pointing arrow as the expand icon**, and do not give the icon and the label different actions (NN/g, E4).
10. **Do not make the plus a small separate target**; the whole row is the button (NN/g accordions; H1, H4).
11. **Do not lay label/value lists out in two columns** beyond a few self-contained tiles (Baymard, L5).
12. **Do not fix row heights**; rows must grow at line height 1.5 (WCAG 1.4.12, T6).
13. **Do not set table elements to `display: block`** without restoring their semantics (Roselli; Bece).
14. **Do not spread columns across the full width to fill space**; wide gaps break the link between a cell and its row label for magnifier users (GOV.UK issue 61, 2018).
15. **Do not ask people to rotate the phone** to read a table (NN/g, C3).

---

## 5. Sources

Design systems and standards
- GOV.UK Design System, Table: https://design-system.service.gov.uk/components/table/
- GOV.UK Design System, Summary list: https://design-system.service.gov.uk/components/summary-list/
- GOV.UK Design System, Spacing: https://design-system.service.gov.uk/styles/spacing/
- GOV.UK Frontend source (table, summary list, typography, section break, width container, measurements): https://github.com/alphagov/govuk-frontend/tree/main/packages/govuk-frontend/src/govuk
- GOV.UK Design System backlog, Table discussion, 2018 to 2026: https://github.com/alphagov/govuk-design-system-backlog/issues/61
- NHS digital service manual, Table: https://service-manual.nhs.uk/design-system/components/table and source https://github.com/nhsuk/nhsuk-frontend/tree/main/packages/nhsuk-frontend/src/nhsuk
- ONS Design System, Table: https://service-manual.ons.gov.uk/design-system/components/table
- US Web Design System, Table: https://designsystem.digital.gov/components/table/
- Salesforce Lightning Design System, Data tables: https://v1.lightningdesignsystem.com/components/data-tables/
- Material 1: https://m1.material.io/components/data-tables.html, https://m1.material.io/components/lists.html, https://m1.material.io/layout/metrics-keylines.html
- Material Components Web, data table theme: https://github.com/material-components/material-components-web/blob/master/packages/mdc-data-table/_data-table-theme.scss
- Material 3 tokens (Compose): ListTokens.kt and TypeScaleTokens.kt under https://github.com/androidx/androidx/tree/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/lists-and-tables, https://developer.apple.com/design/human-interface-guidelines/accessibility, https://developer.apple.com/design/human-interface-guidelines/typography, https://developer.apple.com/design/human-interface-guidelines/segmented-controls; UIKit cell styles: https://developer.apple.com/documentation/uikit/uitableviewcell/cellstyle
- IBM Carbon: https://carbondesignsystem.com/components/data-table/usage/, https://carbondesignsystem.com/components/data-table/style/, https://carbondesignsystem.com/elements/typography/type-sets/, https://carbondesignsystem.com/elements/spacing/overview/
- Shopify Polaris: https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/components/tables/data-table.mdx, https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/DataTable/DataTable.module.css, https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/size.ts
- Atlassian spacing: https://atlassian.design/foundations/spacing
- Bootstrap 5.3 tables: https://getbootstrap.com/docs/5.3/content/tables/
- FT Origami o-table: https://registry.origami.ft.com/components/o-table
- WCAG 2.2 Understanding: reflow https://www.w3.org/WAI/WCAG22/Understanding/reflow.html, text spacing https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html, target size https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html, contrast https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- UK Government Analysis Function, tables: https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-tables/

Research and practice
- NN/g: mobile tables (Schade, 2017) https://www.nngroup.com/articles/mobile-tables/; comparison tables (Moran and Dykes, 2024) https://www.nngroup.com/articles/comparison-tables/; data tables (Laubheimer, 2022) https://www.nngroup.com/articles/data-tables/; touch targets (Harley, 2019) https://www.nngroup.com/articles/touch-target-size/; accordion icons (Laubheimer and Budiu, 2020) https://www.nngroup.com/articles/accordion-icons/; mobile accordions (Budiu, 2015) https://www.nngroup.com/articles/mobile-accordions/; proximity (Harley, 2020) https://www.nngroup.com/articles/gestalt-proximity/; horizontal scrolling (Sherwin, 2014) https://www.nngroup.com/articles/horizontal-scrolling/; big tables on small screens (Budiu, 2021) https://www.nngroup.com/videos/big-tables-small-screens/
- Baymard: comparison tools (Scott, 2022) https://baymard.com/blog/user-friendly-comparison-tools; mobile comparison (Crowley, 2022) https://baymard.com/blog/provide-comparison-features; spec sheets (Scott, 2018) https://baymard.com/blog/spec-sheet-scannability
- UXmatters: Hoober, Designing Mobile Tables (2020) https://www.uxmatters.com/mt/archives/2020/07/designing-mobile-tables.php; Hoober, Design for Fingers, Touch, and People (2017) https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php; Penzo, Label Placement in Forms (2006) https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php
- A List Apart: Enders, Zebra Striping: Does It Really Help? (2008) https://alistapart.com/article/zebrastripingdoesithelp/; Enders, More Data for the Case (2008) https://alistapart.com/article/zebrastripingmoredataforthecase/; Rutter, Designing Tables to be Read, Not Looked At (2017) https://alistapart.com/article/web-typography-tables/
- Butterick, Tables https://practicaltypography.com/tables.html and Alternate figures https://practicaltypography.com/alternate-figures.html
- Ström-Awn, Design better data tables https://mattstromawn.com/writing/tables/
- Datawrapper: https://www.datawrapper.de/blog/guide-what-to-consider-when-creating-tables, https://www.datawrapper.de/academy/customizing-your-table, https://www.datawrapper.de/blog/sticky-table-columns, https://www.datawrapper.de/academy/customizing-your-bar-chart
- Smashing Magazine: Bece, responsive tables parts 1 and 2 (2022) https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/ and https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part2/; Friedman, comparison tables (2017) https://www.smashingmagazine.com/2017/08/designing-perfect-feature-comparison-table/; Friedman, target sizes (2023) https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/
- Roselli, Under-Engineered Responsive Tables (2020) https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html
- Coyier, Responsive Data Tables (2011) https://css-tricks.com/responsive-data-tables/
- Few, Show Me the Numbers slides (2004) https://analyticsconsultores.com.mx/wp-content/uploads/2019/03/Show-Me-the-Numbers-Stephen-Few-Perceptual-Edge-2004.pdf
- Apple, iPhone SE (3rd generation) tech specs https://support.apple.com/en-us/111866; useyourloaf on iOS layout margins https://useyourloaf.com/blog/changing-root-view-layout-margins/
- Fonts measured: Space Grotesk source https://github.com/floriankarsten/space-grotesk; Geist https://github.com/vercel/geist-font

Not found: no documented NYT, Reuters or Economist practice for phone tables turned up in searches; the newsroom practice documented here is the FT's (o-table) and Datawrapper's, which many newsrooms use.

---

## 6. Limits and checks before building

- Widths come from the Geist copy bundled in Next.js and from the Space Grotesk source masters. The Google Fonts builds the site loads may differ by a pixel or so. Check the column widths in the browser with canvas `measureText` at 14px and 12px before fixing them.
- The flag is assumed 20px wide plus an 8px gap. A 16px flag gives the name column 4px more.
- Neither the split (c) nor the name-line layout (f) has been tested with users anywhere I could find. Both rest on design-system practice and Hoober's practitioner guidance.
- The 36px read-only row and the 48px section gap are judgement within the published ranges, not values any source prescribes.
