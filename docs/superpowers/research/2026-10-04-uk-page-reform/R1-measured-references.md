# R1: How data-heavy pages stay digestible, measured (2026-10-04)

Study for the UK page reform (/gb). Every number below was read from the rendered page by a script, at 375px (phone) and 1280px (desktop), on 2026-10-04. Where a number is my reading of a screenshot rather than a script, it says so.

## 0. Method, and what the instrument cannot see

- Browser: Microsoft Edge 154 through Playwright, headless, desktop Edge user agent (as briefed), locale en-GB, light scheme. Phone = 375 x 667 CSS px at 2x; desktop = 1280 x 800 at 1x. One "screen" = 667px on the phone, 800px on desktop.
- Each page was scrolled in 800px steps, fonts awaited, then measured at the top. Nothing was clicked: no consent, no dialogs, no tabs.
- Scripts and raw data: `E:/atlas/website/scratchpad/research-r1/` (`run.js`, `measure-in-page.js`, `summarize.js`, `table.js`, `recheck-tables.js`; one JSON per page and width in `out/`).
- Screenshots: `R1-shots/<site>-<width>-<n>.jpeg` (n = 1 to 3 on the phone, 1 to 2 on desktop), `<site>-375-table.jpeg` = first table on the phone, `-blocked` / `-retired` = evidence of a block. All are under 170 KB.

Definitions and blind spots (read before quoting a number):

- **Bands**: a block at least 90% of the viewport wide whose own background differs from what is behind it. The "sequence" is the deepest band at each 4px of page height. Full-width tinted rows count as bands even when they act as rows (OWID). Background images are flagged, not measured.
- **Neighbour contrast**: WCAG luminance ratio between consecutive light bands at least 100px tall. Dark bands are reported separately.
- **Section padding**: from a band's top edge to the top of the section heading's text box, and from the last content (text or graphic) to the band's bottom edge. It is measured to the font's text box, not to the capital letters, so the visible white space is about 8 to 12px larger at heading sizes. On pages without bands, "gap above heading" = previous content bottom to heading text top.
- **Cards**: border on 3 or more sides or a box shadow, plus a radius of 2px or more, narrower than 95% of the viewport. Rounded blocks with only a tinted fill are counted apart as "panels". "Share" = share of visible main-content characters inside them.
- **Main content** excludes nav, site header and footer, fixed elements and dialogs. "Text under 14px" is by character count of main content.
- **Figures** = numeric tokens in visible main text, years 1900 to 2099 excluded, chart axis labels in SVG excluded.
- **Tables** = `<table>` and ARIA tables. Div grids are only partly caught (by the list detector). Hidden columns = cells set to `display: none` at 375.
- **Tabular digits**: CSS `tabular-nums` / `tnum`, plus a check that the cell font's ten digits have equal widths (single digits, so kerning cannot mislead it; my first pairwise test did, and was replaced).
- Phone layouts come from a desktop user agent in a 375px window, as briefed, without mobile viewport emulation. Two pages differ from a real phone because of this: Wikipedia served its desktop skin (user agent), and Numbeo has no viewport tag, which a real phone answers with a 980px layout; Numbeo was therefore also re-measured with mobile viewport handling (`numbeom`).

### What loaded, what did not

| Page | Result |
|---|---|
| Census Reporter, Data USA, Trading Economics, GOV.UK, Numbeo, Nomads, Baseball Savant, Stripe, Apple, Country Economy | Measured at both widths |
| Our World in Data | Measured. `/country/united-kingdom` now redirects to `/search?countries=United+Kingdom` (topic sections of chart results) |
| World Bank | Measured from the page without interaction. A promotional modal ("record private capital") locked scrolling and covers the screenshots; it is not a cookie wall or a bot check. A small implied-consent cookie strip sits at the bottom |
| OECD | First phone visit: Cloudflare "Just a moment" check, recorded (`oecd-375-blocked.jpeg`). A later visit loaded with no check and was measured |
| CIA World Factbook | Unavailable: retired; the country URL redirects to a farewell story (`factbook-375-retired.jpeg`). Substitute: Wikipedia, United Kingdom (key-facts infobox) |
| Levels.fyi London | 404 with both en-GB and en-US. Substitute: the same template for the San Francisco Bay Area (an app-promotion overlay covers part of the phone shots) |
| Remote.com country explorer (extra) | Blocked: cookie dialog over a dimmed page. Excluded |
| ONS Explore Local Statistics (extra) | Loaded, but the England page holds one sentence, a search box and a map (2 figures). Not used in the cross-site numbers |
| marginatlas.com/gb | Measured as the baseline, not as a reference |

Result: 15 reference pages measured, 13 from the list as given plus 2 substitutes (Levels.fyi Bay Area for the London 404, Wikipedia for the retired Factbook); 1 extra blocked. Cross-site medians use the 14 pages with a genuine phone layout (all but Wikipedia).

## 1. Summary table

Desktop / phone where two values are given. "Ratio" = luminance ratio between neighbouring light bands.

| Site | Alternating bands? Colours, ratio | Section padding 1280 / 375 | Text in cards (bordered; with panels) | Text under 14px at 375 | Figures per screen 375 / 1280 | Phone table behaviour | Phone row height | Phone gutter (text starts at) |
|---|---|---|---|---|---|---|---|---|
| Census Reporter | No. Tinted page #f7f8f3 under 5 white chapter sheets (1.067) | No bands; rules. Gap above section heading 59 / 65 | 3%; 93% in 5 sheets | 80% | 11.4 / 30 | No visible tables ("Show data" opens them) | Bar-chart rows 49 | 33 (sheet at 21, text 38) |
| Data USA | Yes, per chapter: #e4e8f3 / #eff3fd (1.103 to 1.111); navy hero #141b2e | Band top to heading 41-45 / 42-45 (4 of 6 bands); bottom 59-100 / 76-299 | 3%; 3% | 19% | 4.4 / 9.3 | No tables | Stat groups, 64 pitch | 25 |
| Our World in Data | Tinted chart rows #f0f4fa between 72px white gaps (1.104); rows, not sections | Gap above topic heading 50 / 49 | 0%; 0% | 40% | 3.6 / 11 | No tables; 4-row mini lists | 25 (mini list) | 16 (28 inside rows) |
| Trading Economics | No. White, #333 header | One tabbed table | 0% | 0% | 10.3 / 35 | Scrolls in a wrapper; 3 of 7 columns hidden by CSS; 3 fit | 41 | 13 (text 29) |
| World Bank | Page #f2f3f6 with white cards and rows (1.11); alternates on the phone | Gap above heading 59 / 66; rules | 22%; 22% | 53% | 2.4 / 4.5 | No tables | Indicator rows 147 (desktop) | 19 |
| OECD | Yes: navy hero, then white / #f6f7f9 / white (1.072) | Band top to heading 76 / 43; bottom 98-102 / 101-156 | 46%; 80% (link tiles) | 19% | 2.7 / 3.5 | No tables | n/a | 24 |
| GOV.UK step by step | No. Light blue header #f4f8fb (1.068), then white with rules | Gap above step heading 43 / 38 | 0% | 0% | 1.5 / 2.4 | No tables | n/a | 15 |
| Levels.fyi (Bay Area) | Yes: #f7f9fb / white (1.055; phone 1.005-1.099) plus dark #4c5d67 bands | Gap above heading 110 / 88 | 22%; 28% | 12% | 4.2 / 8.6 | Fits; 1 of 4 columns hidden; two-line cells | 67 (table), 58 (lists) | 16 |
| Numbeo | No. White | Gap above heading 24 / 24 | 23%; 25% | 11% | 44 / 53 | No viewport tag: phone shows the desktop page at 0.25 scale | 32 (desktop) | 5 (page overflows) |
| Nomads | No. Photo hero, white table | Tabs; n/a | 0% | 10% | 6.3 / 13.3 | Fits: 2 columns (label, bar) | 53 | 14 |
| Baseball Savant | No. White, square teal boxes | Gap above heading 25 / 26 | 0% | 94% | 54 / 160 | Scrolls in a wrapper, sticky first column, 6-8 of 15-23 columns visible | 15-18 | 13 |
| Stripe | Yes: white / #f8fafd / #e5edf5 (1.046 to 1.19) plus navy and violet | Band top to heading 72-90 / 52-55; bottom 64-84 / 26-41 | 16%; 34% | 20% | 2.3 / 5.3 | No tables | Stat blocks 169 pitch | 16 |
| Apple | Yes: white / #f5f5f7 (1.089) | Band top to heading 68-159 / 71-98; bottom 101-186 / 77 | 0%; 13% (tiles) | 1% | 1.8 / 2.4 | No tables | n/a | 23 |
| Country Economy | No. Salmon page #fff1e0 | Gap above heading 21 / 28 | 0% | 64% | 16.3 / 29.4 | Fits: 3 columns (indicator, year, value) | 27.8 | 12 |
| Wikipedia (substitute) | No | Gap above heading 36 / 36 | 0% | 2% | 13.7 / 35.5 | Infobox fits; data tables scroll, 4-5 of 6-8 visible | 31 (infobox), 33-59 | 24 |
| **marginatlas /gb today** | No. Page #f7f7f8, 23 white cards (1.07 to 1.08) | Card to card: 80 / 80 from last text to next card title | 97%; 97% | 43% | 9.8 / 24.2 | No table element on the phone: CSS grid, each country on 3 lines | Peer rows about 94; lists 38-50 | 45 (card at 24) |

## 2. Per site

### Census Reporter (California profile)
- Bands: dark green header #014948, then one tinted page #f7f8f3 for 95% of the height, footer #e0e4d4. Sections sit in 5 white sheets (radius 4, no border), one per chapter, 17 sections in all; 10 to 11 of the section breaks are thin rules inside a sheet.
- Phone: 17.9 screens; text starts at 33 to 38px. Desktop: 6.8 screens, a 279px label column on the left.
- Type, phone: section headings 14px bold, sub-headings 13px, lead figures 25px bold (31px on desktop), labels 10.5 to 11.6px. 80% of characters under 14px, 50% under 12px.
- Figure anatomy (phone): figure 25.2px/700, label 15.4px 3.8px below, comparison line 12.6px grey 16px below. Desktop: 30.8px, 16.8px (3.4px gap), 12.6px (15.8px gap).
- Under the section heading comes a figure in 12 of 17 sections (14 of 17 on desktop), 11 to 12px below the heading.
- 11 small charts plus a header map for 17 sections (bars with value labels, donuts). Tables are hidden behind "Show data / Embed" links.
- Context (verbatim): "about 10 percent higher than the amount in United States: $45,256"; "a little less than the rate in United States: 12.2%"; "more than double the amount in United States: $360,600". One per lead figure, 15 in total. The line is two-tone on white: the verdict words in #666 bold (5.7:1), the reference value in #777 weight 500 (4.5:1).

### Data USA (California profile)
- Bands: photo hero, navy #141b2e intro band, then chapters alternating #e4e8f3 and #eff3fd (ratio 1.103), with white sub-bands inside (1.111). One band per chapter, 900 to 7,000px tall on desktop.
- Band top to heading text 41 to 45px on desktop (all six bands) and 42 to 45px on 4 of 6 phone bands (91 and 140 on the first two); bottom 59 to 100px on desktop (199 on one).
- Type: chapter headings 42px/400 at both widths, sub-headings 28px uppercase, body 15/22.5px, lead figures 28px/300 (light) on the phone, labels 12px uppercase above the figure.
- Prose share 73% on the phone: a generated sentence follows 6 of 8 chapter headings. 90 screens on the phone, 4.4 figures per screen, 63 charts.
- Text under 14px: 19%. Cards: 3% of text. Gutter 25px phone, 50px desktop.
- Context (verbatim): "0.798% 1-year increase" under the population figure; margins of error as "13.3M ± 9.25k"; in prose, "1.89 times more" for the largest group.

### Our World in Data (United Kingdom, now a filtered search page)
- Ten topic sections (heading 20px/700 desktop, 18px phone), each with 4 chart results. Each result is a full-width #f0f4fa block (no border, no radius) separated by 72px of white; ratio 1.104.
- One repeated unit: chart title (serif), a "Source: ... (2024)" line, a line chart with start and end labels, a 4-row mini list, a map, and the UK figure large ("68.68 million", 24px/600, with "people, 2023" under it).
- Mini lists: rows 25px (phone) to 28px (desktop), label 12px/400, value 12px/700 pushed right with a dotted leader, no rule.
- Text under 14px: 40% (phone). 3.6 figures per phone screen. Gutter 16px; text inside blocks at 28px.
- Context: year stamp on every figure; the selected country listed first in the mini ranking; "Data available for 262 countries and regions"; source line under every title (40 on the page).
- A large non-blocking cookie banner covers 31% of the first phone screen in the shots.

### Trading Economics (United Kingdom indicators)
- One table, tabbed (Overview, GDP, Labour, Prices, Money, Trade, Government, Business, Consumer, Housing, Energy, Health): 21 rows by 7 columns (indicator, Last, Previous, Highest, Lowest, unit, date).
- Desktop: rows 41px, padding 8px all round, 16px Helvetica/Arial, header 15px regular, 1px #dee2e6 rules, no zebra, numbers left-aligned, gap between numeric columns 90px (minimum 62).
- Phone: 3 of 7 columns hidden by CSS, the rest scroll inside a 349px wrapper; 3 columns fit without scrolling; rows 41px, 16px text, numeric gap 40.5px median (minimum 16), label to first number 55px.
- Digits: no CSS setting, but the font's digits are equal width. Negative values in dark red #8b0000.
- 0% of text under 14px. 10.3 figures per phone screen, 35 per desktop screen; 4.2 screens long on the phone.
- Context: the Previous column is the change; Highest and Lowest give the historic range; the date column stamps each row.

### World Bank (United Kingdom)
- Page #f2f3f6; themes in white cards (1px #e4e9ec, radius 2, 38px top padding); ratio 1.11. Rules between indicator rows.
- Indicator row (desktop): label 18px, value 32px/600, year in brackets 14px, line chart at the right; row pitch 147px. Phone: label 14.5px, value 28px.
- Text under 14px: 53% (phone); body 12 to 13px; prose share 51 to 56% (indicator names are long sentences).
- 2.4 figures per phone screen. Gutter 19px phone, 64px desktop.
- Context: year stamp "(2024)" beside every value; sparkline-style trend chart per indicator.

### OECD (United Kingdom)
- Sequence: navy hero #101d40 (748px desktop, 540 phone), white intro, #f6f7f9 indicators band (ratio 1.072), white publications band, footer #f0f4f8.
- Band top to heading text 76px desktop, 43px phone; bottom 98 to 102px desktop.
- Section headings 28px/800 desktop, 24px/800 phone. Indicator charts sit in white cards (1px #dee3e9, radius 4) in a carousel; publication tiles carry grey chips ("Report", "Country note").
- 46 to 53% of text in cards (80% with panels): a portal of tiles, not a data page. 2.7 to 3.5 figures per screen.
- Context: each chart card names its measure and period ("Annual growth rate (%), 2025 or latest year available").

### GOV.UK (Set up a limited company, step by step)
- White page, 12 numbered steps, 1px rules between them; step headings 24px/700 desktop, 19px phone; body 19/25px; 0% of text under 14px.
- Gap above and below each step heading: 43px desktop, 38px phone.
- Gutter 15px on the phone (step text at 60px, beside the step numbers). No cards, almost no figures (1.5 per phone screen).
- Useful here only for the rhythm of a long ordered list (registering steps) and its type size.

### Levels.fyi (software engineer, San Francisco Bay Area; London 404s)
- Page #f7f9fb, white headline card (1px #dedede, radius 8), dark #4c5d67 call-to-action bands; light ratio 1.055 desktop.
- Headline: median figure in green, "MEDIAN TOTAL COMP" uppercase label, then 25th, 75th and 90th percentile values, each under a coloured bar (light to dark green). A sentence below gives the sample size and the update date.
- Table "Recently Submitted Salaries": 4 columns (1 hidden on the phone), two-line cells (company over location and time; level over tag; total over the breakdown), rows 60px desktop and 67px phone, padding 8px, 16px text, numbers right-aligned, zebra rows, 1px #e0e0e0 rules; the header is 105px tall on the phone because its labels wrap.
- Lists: rows 58px pitch, label 16px/700, value 14 to 16px, rules between rows.
- Text under 14px: 12%. Gutter 16px phone. Currency shown in the visitor's local currency.
- Context (verbatim): "25TH%", "75TH%", "90TH%" under the percentile values.

### Numbeo (cost of living, United Kingdom)
- No viewport tag. On a phone the page is laid out at 980px and shown at 0.25 scale, so 16px text appears at about 4px until zoomed (`numbeom-375-*.jpeg`). At 375 CSS px without mobile handling the 1,020px table pushes the page to 1,323px.
- Desktop: one long table, 74 rows by 3 columns (item, price, range), rows 32px, 16px Arial, prices right-aligned, category header rows with icons. CSS `tabular-nums` on half of the numeric cells.
- Range column: low and high values with a green bar and a black tick for the average (51 bars).
- Summary box (#fbfbf8, 1px #dde3ec, radius 5) with four bullet facts.
- 53 figures per desktop screen.
- Context (verbatim): "Cost of living in United Kingdom is, on average, 53.2% higher than in Albania." The comparison country is the visitor's own (the test machine geolocates to Albania).

### Nomads (London)
- Photo hero, tab bar, then a 39-row by 2-column score table: emoji and label on the left, a coloured bar on the right with the value written inside ("4.2/5 (Rank #5)", "Good", "Great", "$8,223 / mo").
- Phone: rows 53px, padding 12/14px, 14px text, 1px #f5f5f5 rules; the table is full bleed (x = 0).
- Tooltips on 68 elements. A "Join" banner covers the bottom of the phone screen.
- Context: rank inside the bar; colour (green, yellow, red) carries the judgement.

### Baseball Savant (Shohei Ohtani)
- White page, 13 square boxes with teal borders, no radius; whitespace only between sections (gap 25px).
- Percentile rankings: each metric is a row with a right-aligned label, a red-to-blue bar, the percentile in a circle at the bar's end, and the raw value at the right, under a POOR / AVERAGE / GREAT scale. Rows are about 20px on the phone (read from the screenshot).
- Phone tables: scroll inside a 349px wrapper with a sticky first column; 6 to 8 of 15 to 23 columns visible; rows 15 to 18px; 10.4px Roboto Condensed (equal-width digits); numbers centred; numeric gap 28 to 35px (minimum 18).
- 94% of text under 14px on the phone, 87% under 12px. 54 figures per phone screen, 160 per desktop screen: the densest page measured.
- Context (verbatim): "10th in MLB", "3rd in MLB" under season stats; percentile 0 to 100 on every metric.

### Stripe (home)
- Bands: white, #f8fafd (ratio 1.046), #e5edf5, navy #0d1738, violet #c0b8fd; 9 colour changes on desktop, 27 on the phone (bands of 100px or more).
- Band top to heading text 72 to 90px desktop, 52 to 55px on 3 of 5 phone bands; bottom 64 to 84px desktop where a band ends in text (two end in a graphic flush with the edge), 26 to 41px phone.
- Section headings 32px/300 desktop, 22px/300 phone; body 16/22.4px; labels 10 to 12px (20% of text under 14px).
- Stat blocks: figure 48px/300 desktop (28px phone), label 16px 2 to 6px below ("135+" / "currencies and payment methods supported"). 
- 16% of text in bordered cards (34% with panels), radius 6. 2.3 figures per phone screen.

### Apple (MacBook Air)
- Bands alternate white and #f5f5f7 (ratio 1.089), one band per chapter (600 to 12,000px tall).
- Band top to heading text 68 to 159px desktop where the heading is the first thing in the band, 71 to 98px phone; bottom 101 to 186px on most desktop bands.
- Headings 48px/600 desktop, 32px/600 phone; body 19 to 21px; 1% of text under 14px. Rounded white tiles (radius 28) on grey bands hold 13 to 20% of text.
- 1.8 figures per phone screen, 53 screens long on the phone, 70% prose.
- Context (verbatim): "Up to 9.5x faster than MacBook Air with M1": the multiple set at 48px, the words at 14px.

### Country Economy (United Kingdom)
- Salmon page #fff1e0, blue header #386aaf, no bands; whitespace of 21 to 28px between sections.
- Ticker cards at the top: label 14px/700, value 14px, change with an arrow ("▲0.1") in red-brown.
- Data table: 104 rows by 3 columns (indicator, year, value), rows 27.8px, padding 5px, 11.2px Arial (equal-width digits), values right-aligned, 1px #b8b2ad rules, indicator names as links. Fits at 375; numeric gap 43px (minimum 13).
- 64% of text under 14px on the phone, 60% under 12px. 16.3 figures per phone screen. Gutter 12px.
- Charts have solid blue title bars; 318 elements carry tooltips.

### Wikipedia (United Kingdom; substitute for the retired Factbook)
- Desktop skin at 375 (desktop user agent), so phone figures are indicative only.
- Infobox: 2-column table, rows 31px (phone) to 34px, 14.1px text, bold labels, group rules 1px #a2a9b1.
- Data tables scroll inside a 327px wrapper on the phone, 4 to 5 of 6 to 8 columns visible, 16px, rows 33px, padding 3.2/6.4px, numbers right-aligned, numeric gap 23 to 32px (minimum 13.8).
- Context (verbatim): world rank in brackets after values, "(20th)", "(10th)", "(78th)".

### marginatlas.com/gb today (baseline)
- Page #f7f7f8; 23 white cards (1px #d8d0cb, radius 12, padding 20, soft shadow) on #f6f6f5 and #f7f7f8 grounds, two per row on desktop, 32px apart. 97% of text and 98% of figures inside cards. Card against its ground: ratio 1.07 to 1.08.
- Phone: card at 24px, text at 45px, so the text column is 285px. 20.7 screens for 22 sections plus the hero card.
- Type: chapter headings 20px/600, section titles 16px/600, lead figures 30px/600 (20 to 40), labels 12px; 43% of text under 14px.
- 9.8 figures per phone screen (24.2 desktop), but 1 in the first phone screen (the 20% tax figure and its pie).
- Peer table on the phone (`marginatlas-375-peers.jpeg`): no table element; each country becomes a block of 3 lines (name, then 3 values, then 2 values), about 94px per country, headers wrap to 2 lines beside sort icons.
- Legal-form table on the phone (`marginatlas-375-table.jpeg`): name on its own line, values on a second line, rows about 81px.
- Digits: Space Grotesk's default figures are proportional; `tabular-nums` is set on 85% of peer-table cells.
- Context present: "Higher than nine countries in ten.", "World median $0.13", "quicker than in 182 of 198 countries". One chart, 12 bars, 68 icons.

## 3. Cross-site findings

### 3.1 Measured

**Section backgrounds**
- 6 of 14 references alternate full-width light backgrounds: Data USA, Apple, Stripe, OECD, Levels.fyi, World Bank (phone). Their neighbouring light pairs measure 1.046 to 1.111: Stripe 1.046, Levels.fyi 1.055, OECD 1.072, Apple 1.089, Data USA 1.103, World Bank 1.11. Median about 1.08.
- Dark bands (ratio 6.5 to 17.6 against their neighbours) appear 1 to 3 times per page: hero, one closing band, footer.
- Pages without bands separate sections with thin rules (Census Reporter, GOV.UK, World Bank) or plain space of 21 to 50px (Country Economy, Numbeo, Savant, Wikipedia, OWID).
- Band padding on data pages: heading text 41 to 90px below the band edge on desktop (Data USA 41-45, OECD 76, Stripe 72-90), 42 to 55px on most phone bands; last content 59 to 102px above the next edge on desktop, 26 to 156px on the phone. Apple's 68 to 186px is a marketing outlier.
- Today's page/card pair (1.07 to 1.08) already sits inside the measured band range. What differs is the structure: 23 boxed sections on one page tone instead of full-width bands.

**Cards**
- Median share of text inside bordered or shadowed cards: 2% (0% on 7 of 14 pages). Including tinted panels: 8%. Highest outside portals, panels included: Stripe 34%, Levels.fyi 28%, Numbeo 25%, World Bank 22%. OECD (80%) is a tile portal. Census Reporter puts 93% of its text into 5 chapter sheets, one per 3 to 4 sections. Today: 97% in 23 cards.

**Type on the phone**
- Section headings: median 19px (14 to 42). Body: median 14px (10.5 to 21). Lead figures: 24 to 28px on the data pages (Census Reporter 25, Data USA 28, World Bank 28, OWID 24 on desktop); 48px on Apple. Labels: mostly 12 to 14px (Census Reporter 10.5). Table cells: 16px on the most legible tables (Trading Economics, Levels.fyi, Wikipedia data tables), 10.4 to 11.2px on the densest (Savant, Country Economy).
- Text under 14px: median 19% (0% GOV.UK and Trading Economics; 94% Savant). Today: 43%.

**Density and length**
- Figures per phone screen: median 4.3 across all references; 4 to 16 on readable data pages (Data USA 4.4, Nomads 6.3, Trading Economics 10.3, Census Reporter 11.4, Country Economy 16.3). Savant (54) and Numbeo (44) are dense to the point of 10px type or a 0.25 zoom. Today: 9.8, inside the range.
- First phone screen on data pages: median 8 figures (World Bank 1, Census Reporter 4, OWID 5, Levels.fyi 7, Trading Economics 8, Nomads 8, Country Economy 9, Numbeo 15, Data USA 16, Savant 23). Today: 1.
- Screens per section on the phone: Census Reporter 1.05 (17.9 for 17), Savant 1.3, OWID 1.5, World Bank 1.9. Today: 0.94 (20.7 for 22).
- Charts: Census Reporter 11 plus a header map for 17 sections; Data USA 63; World Bank a trend chart per indicator. Today: 1 chart plus 12 bars.

**Tables on the phone (7 references show one, counting Wikipedia)**
- None stacks or transposes numeric rows. Three scroll inside a wrapper (Trading Economics, also hiding 3 of 7 columns by CSS; Savant with a sticky first column; Wikipedia). Three fit by staying narrow (Country Economy 3 columns; Levels.fyi 3 of 4, one hidden; Nomads 2). Numbeo, without a viewport tag, shows its desktop table at 0.25 scale.
- Columns visible without scrolling: 2 to 4 (Savant 6 to 8 at 10.4px is the outlier).
- Row height: 41px at 16px (Trading Economics), 33px at 16px with 3px padding (Wikipedia), 60 to 67px for two-line cells (Levels.fyi), 53px for bar rows (Nomads), 27.8px at 11.2px (Country Economy), 15 to 18px at 10.4px (Savant).
- Cell padding: 8px all round (Trading Economics, Levels.fyi), 12/14px (Nomads), 5px (Country Economy), 3.2/6.4px (Wikipedia), 0 (Savant).
- Gap between the text of neighbouring numeric columns: medians 23 to 43px, minimums 13 to 18px.
- Alignment: numbers right-aligned in 4 of 6 (Country Economy, Levels.fyi, Wikipedia, Numbeo half), centred in Savant, left in Trading Economics.
- Every reference table font has equal-width default digits (Arial/Helvetica, Roboto Condensed, Roboto Mono, Nunito, system UI). Only Numbeo also sets `tabular-nums`.

**Label/value lists on the phone**
- Inline rows: pitch 25px at 12px (OWID, dotted leader, value right), 31px at 14px (Wikipedia infobox), 38 to 50px at 14px (today), 58px at 16px (Levels.fyi, rules). Weight goes to one side only: OWID and today bold the value (600 to 700); Levels.fyi and the Wikipedia infobox bold the label.
- Stacked stat blocks: figure 25 to 28px over or under a 12 to 16px label with a 3 to 6px gap (Census Reporter 3.8, Stripe 6, Data USA label above at 12px uppercase); Census Reporter adds a 12.6px context line 16px below.

**Gutters on the phone**
- Text starts 12 to 25px from the edge on 11 of 14 references (Country Economy 12, Savant 13, Nomads 14, GOV.UK 15, Stripe 16, OWID 16, Levels.fyi 16, World Bank 19, Apple 23, OECD 24, Data USA 25; Wikipedia 24 too). Trading Economics puts its table at 13px with the text at 29px inside the cells; Numbeo overflows. The only double inset is Census Reporter (38, sheet plus padding); today's is 45.

**What sits under a section heading**
- On data-led pages, a figure, a label row or a chart: Census Reporter a figure under 12 to 14 of 17 headings, Savant a label row under 12 of 14, OWID a chart title under 10 of 10, Trading Economics the table. Sentences come first mainly on prose-led pages: Data USA 6 to 7 of 8 (73% prose), World Bank 2 to 4 of 8. Heading to first content: 11 to 12px (Census Reporter), 18px (Wikipedia), 25 to 33px (Levels.fyi, OWID, Savant).

**Context next to a figure (the "gold nuggets")**
- Comparison with a parent: Census Reporter, one line per lead figure ("about 25 percent higher than the amount in United States: $81,604").
- Comparison with the reader's own country: Numbeo ("53.2% higher than in Albania").
- Rank: Savant ("10th in MLB"), Wikipedia ("(20th)"), Nomads ("Rank #5"); today ("182 of 198 countries").
- Percentile: Savant (0 to 100 circle on a POOR to GREAT bar, every metric), Levels.fyi (25th, 75th, 90th with coloured bars).
- Range: Numbeo (low and high with a bar and an average tick on every row), Trading Economics (Highest, Lowest columns).
- Change: Trading Economics (Previous column), Data USA ("1-year growth" under each headline figure), Country Economy (arrows on ticker cards).
- History: World Bank and OWID (a trend chart per indicator, with start and end labels on OWID).
- Uncertainty: Data USA ("± 9.25k").
- Time stamp: World Bank "(2024)", OWID "people, 2023", Country Economy year column.
- Source line: OWID under every chart title. (Not transferable as such: house rule bans agency names; the year stamp is the part that transfers.)

### 3.2 Judgement

- The pages that read best for this job, in my view: Census Reporter (desktop), Trading Economics, OWID, Levels.fyi, Data USA (in parts) and GOV.UK (phone). What they share: one repeated unit per item (stat block, indicator row, chart block, table row); the figure before the words; one context device per figure; full-width structure with few or no boxes; text close to the screen edge on phones; 14 to 16px reading sizes.
- The densest pages (Savant, Country Economy, Numbeo) prove that a lot of numbers fit, but they pay with 10 to 11px type or a zoomed-out page. Copy their devices (percentile bars, sticky first column, range bars, year column), not their sizes.
- The marketing pages (Apple, Stripe) supply the band rhythm the founder describes, but their padding (up to 186px) and density (2 figures per phone screen) are wrong for a data page. Data USA shows the same rhythm at data-page padding (41 to 45px).
- Today's "blank and stale" feeling does not come from too few numbers per screen (9.8 is above the reference median). It comes from: a first phone screen with 1 figure against a median of 8; every section in an identical card (97% against 2 to 8%); 45px text inset (285px column) against 12 to 25px; 43% of text under 14px against 19%; one chart against about two for every three sections on Census Reporter; and phone tables that turn rows into multi-line blocks, which no reference does.
- Census Reporter is the closest model for "sections with context, not sentences": a heading, the figure, a label, one comparison line, a small chart, a rule. Its weakness is size (80% of text under 14px on the phone), so take its anatomy at larger sizes.

## 4. Ten rules for a 20-section country data page

1. **Bands, not boxes.** Give each section a full-width band and alternate two light tones with a luminance ratio of 1.05 to 1.10 between neighbours. Today's #f7f7f8 against white (1.071) already qualifies as the pair. Use a dark band at most twice (hero, closing). Basis: Stripe 1.046, Levels.fyi 1.055, OECD 1.072, Apple 1.089, Data USA 1.103, World Bank 1.11; dark bands appear 1 to 3 times per page.

2. **Band padding: 48 to 64px above the heading on desktop, 40 to 48px on the phone; 56 to 96px and 32 to 56px below the last content.** Basis: data-page bands put the heading text box 41 to 90px (desktop) and 42 to 55px (most phone bands) below the edge, and end 59 to 102px (desktop) and 26 to 156px (phone) above the next edge (Data USA, OECD, Stripe). Visible space to the capitals is about 8 to 12px more than these figures.

3. **Cards only for units, at most a quarter of the text.** Keep cards for self-contained tools (peer table, pay calculator, payment mix), not for every section. If sections need grouping, use one sheet per chapter with 1px rules between its sections. Basis: reference median 2% of text in bordered cards, 8% with panels, highest non-portal 34% with panels (Stripe); Census Reporter groups 17 sections into 5 sheets; today 97% in 23 cards.

4. **Phone gutter 16 to 20px, no double inset; text column at least 335px on a 375px screen.** Basis: 11 of 14 references start text 12 to 25px from the edge; today text starts at 45px (24 + 1 + 20) and the column is 285px.

5. **Figure, label row or chart first; no sentence under the heading.** Put the lead figure (or the first row, or a small chart) 12 to 24px under each section heading, and give about half the sections a small chart or bar. Basis: Census Reporter has a figure under 12 to 14 of 17 headings at 11 to 12px and 11 charts for 17 sections; Savant 12 of 14 label rows; OWID 10 of 10 chart titles; sentences lead only on prose-led pages (Data USA 6 to 7 of 8).

6. **One context slot under every lead figure.** Fixed anatomy: figure 26 to 30px bold on the phone (30 to 32px on desktop), label 15 to 16px 4px below, one context line 13px about 12 to 16px below, at 4.5:1 contrast or better. Choose one device per metric: peer or parent comparison, rank of the total ("of 198"), percentile bar, low-high range, change since last period, or a year stamp. Basis: Census Reporter 25 to 31px / 15 to 17px at 3 to 4px / 12.6px at 16px, with the verdict words of the context line darker and bold (#666, 5.7:1) and the reference value lighter (#777, 4.5:1); Savant percentile on every metric; Numbeo range on every row; Trading Economics Previous/Highest/Lowest; World Bank and OWID year stamps.

7. **Phone tables keep their rows.** At 375px show the label column plus 2 to 3 numeric columns; put the rest behind a horizontal scroll with a sticky first column, or a column switch. Never reflow a row into stacked lines. For the 5-country by 5-metric peer table: country column sticky, 3 metrics visible, 2 on scroll. Basis: no reference stacks numeric rows; Trading Economics hides 3 of 7 columns, Levels.fyi 1 of 4; Savant and Wikipedia scroll with the first column visible; today's peer rows grow to about 94px per country.

8. **Phone table metrics.** Cells 15 to 16px, rows 40 to 48px (60 to 67px only for two-line cells), cell padding 8px all round, at least 16px between the text of neighbouring numeric columns, numbers right-aligned with equal-width digits (set `tabular-nums` on every numeric cell; Space Grotesk's default figures are proportional). Basis: Trading Economics 16px / 41px / 8px; Wikipedia 16px / 33px; Levels.fyi 16px / 60-67px / 8px; numeric gap medians 23 to 43px, minimums 13 to 18px; right alignment in 4 of 6 phone tables; today `tabular-nums` covers 85% of peer cells.

9. **Phone type scale.** Section heading 20 to 24px, sub-heading 16 to 18px, body 15 to 16px, lead figure 26 to 30px, labels 12 to 13px, table cells 15 to 16px; keep characters under 14px at or below 20%. Label/value rows 40 to 48px pitch at 14 to 16px with the value right-aligned and a 1px rule or a dotted leader. Basis: reference phone medians 19px headings and 14px body, lead figures 24 to 28px on data pages, 19% of text under 14px (today 43%); the most legible phone tables use 16px cells; list pitch 31px at 14px (Wikipedia) to 58px at 16px (Levels.fyi).

10. **Fill the first screen, then pace about one phone screen per section.** Put 6 to 10 figures in the first phone screen (for example the five peer metrics plus the tax figure), keep 5 to 12 figures per phone screen, and plan 20 to 24 phone screens for 20 sections. Basis: data references show a median of 8 figures in the first phone screen (today 1); readable data pages run 4.4 to 16.3 figures per phone screen (today 9.8); Census Reporter runs 1.05 screens per section (today 0.94, so the reform has room to add context lines and small charts without making the page longer than the references).
