# R3. Sections and bands: separating twenty sections without a card around each

Research note, 2026-10-04. Read-only: no project source file was edited. Written for whoever designs the next round of the United Kingdom country page.

---

## 0. The short version

### What was asked

The country page draws about twenty data sections, each in its own white card (border, soft shadow) on the light grey ground, two to a row on desktop and one on a phone. The founder says the bento is failing and asks for "a more traditional thing where the sections have alternating background colours, maybe just by a little bit", with some cards kept, so the page can open up; he also says the page feels blank and stale. This note reports how strong data and editorial sites separate sections without boxing each one, and proposes a band system built on the site's own tokens.

### The answer in eight lines

1. **Data pages with many sections separate them with headings, spacing and hairline rules, and keep cards for things a reader operates or opens.** Where they alternate backgrounds they do it per chapter, not per section: Data USA's California profile has a dark intro band and then six chapters on two alternating pale tints, six colour changes for 52 leaf sections. (Measured)
2. **Neighbouring bands differ by 1.04 to 1.13:1 (WCAG ratio) against white, clustered at 1.06 to 1.09.** Apple's #f5f5f7 and Notion's warm #f6f5f4 are both 1.089. (Measured)
3. **No band in the study is visible by APCA's floor for non-text (Lc 15), and WCAG 1.4.11 does not ask it to be**, because sections are identified by their headings. The band is atmosphere; headings, spacing and rules carry the boundary. (Published, Measured)
4. **Proposal: two surfaces, paper #ffffff and tint #f6f6f5 (today's `--c-ground`), 1.081:1 apart, plus a reserve #f1f1f0 for at most one zone.** On the tint every text token clears 4.5:1 (accent text 4.79, muted 5.92). (Judgement on measured numbers)
5. **One band per chapter, alternating:** the masthead on tint (his board unchanged), 01 paper, 02 tint, 03 paper, 04 tint, the close on paper. Five colour changes on the page. (Judgement)
6. **Band padding 64 top and bottom at 1280, 40 at 375.** Levels inside a band split by a 1px hairline with 32px either side; a 64px column gutter; the chapter header is a number and a 24px title, no standfirst. (Judgement)
7. **Cards stay for the two levers, the cover picker, the sortable peers table and the city link cards:** about 5 of the UK page's 21 sections. Everything read rather than operated goes open on the band. (Judgement on NN/g, Atlassian and measured practice)
8. **Contents without a drawer:** a sticky chapter bar on tablet and desktop (Data USA, Our World in Data and Stripe do this); on a phone, a contents list in the body under the masthead plus one fixed "Contents" link back to it (GOV.UK's pattern). (Measured, Published)

### How to read this file

- **Measured**: read off a live page on 2026-10-04 by the script described below.
- **Published**: stated by a standard, a design system or a research body. Sources marked **[read]** were fetched and read in this session; **[snippet]** are known only from search-result text.
- **Judgement**: mine. Every proposal in section 3 is judgement unless it says otherwise.

### Method, and what it cannot see

- 24 public pages loaded in headless Chrome (the project's Playwright 1.60 driving system Chrome) at 1280 x 900 and 375 x 812. A script read computed styles: the effective background every 8px down the page at the left edge (x = 3) and at the centre; the colour runs this gives ("bands"); the distance from each band edge to its first and last text or image ("inset"); every h1 to h3 with size, weight and the gaps above and below; horizontal borders wider than 40% of the viewport ("rules"); and card-like boxes (corner radius 6px or more with a border, a shadow or a fill of their own) with the surface behind them. A second script recorded every fixed or sticky bar at 35% and 70% of the page's height and counted its in-page links. Colour maths: WCAG 2 relative luminance and contrast ratio, APCA 0.0.98G-4g, CIELAB L*, OKLCH chroma.
- **Blind spots.** The sampler cannot see backgrounds painted by pseudo-elements or by layers with `pointer-events: none`. A band edge is exact where the band's own element was found and otherwise rounded to 8px. "Inset" is text-to-edge distance, not CSS padding: a band that opens with an image or a large margin reads larger than its padding. The Economist and the FT served a security-check page to the headless browser and Ramp rendered no content; none of this was worked around. FT colours come from FT's published Origami palette; the Economist is not measured. Pages change; these are the numbers of 2026-10-04.
- **A naming warning.** In `src/components/spine/kit.tsx` a `Band` is one horizontal level of cards. In this note a band is a full-width background zone. The new component needs another name (suggestion: `Chapter`), or every rule written about levels becomes ambiguous.

---

## 1. Reference sites

### 1a. Sites measured on 2026-10-04

Step = WCAG contrast ratio of the band against white (#ffffff). Inset = text-to-band-edge distance in px, top / bottom, median where a page has several bands.

| Site and page | Band surfaces | Step | Form | Inset at 1280 | Inset at 375 | Cards inside |
|---|---|---|---|---|---|---|
| Apple, MacBook Air | #ffffff, #f5f5f7 | 1.089 | full bleed; 4 colour changes in 32,700px | 112 / 93 (bands 106 to 120 top) | 71 / 75 | 42 boxes, 41 of them the opposite surface (white on #f5f5f7, #f5f5f7 on white), radius 28, no border, no shadow |
| Apple, iPhone | #ffffff, #f5f5f7, #fafafc | 1.089, 1.042 | full bleed | 105 / 92 | 52 / 77 | same rule |
| Stripe, Payments | #ffffff, #f6f9fc, one dark #0a2540 | 1.057 | full bleed; colour changes every section (13) | 121 / 135 (110 to 130 top) | 73 / 77 | white cards with shadow on #f6f9fc (20); white with a hairline on white (13); radius 8 |
| Stripe, home | #ffffff, #f8fafd, dark #0d1738 | 1.046 | full bleed | 93 / 96 | 55 / 52 | pale tiles |
| Data USA, California profile | #eff3fd and #e4e8f3 alternating per chapter; dark intro #141b2e | 1.111 and 1.226 (1.103 between the two tints) | full bleed; 7 chapter bands, 6 changes | CSS padding 60 / 25 per chapter | not isolated (bands too long) | white panels (padding 18) round some charts; most leaf sections open |
| Notion, home | #ffffff, #f6f5f4 (warm) | 1.089 | full bleed | 172 / 183 | 64 / 73 | white with a 10% black hairline on white |
| Airbnb, host page | #ffffff, #f7f7f7 | 1.071 | full bleed | 113 / 36 | 61 / 32 | #f7f7f7 cards with shadow on white, radius 30 |
| USAFacts, home | #ffffff, #f7f7f3, plus magenta, blue and near-black bands | 1.074 | full bleed | 120 / 144 | 80 / 148 | opposite surface: #f7f7f3 on white (27), white on #f7f7f3 (12), radius 12, no shadow |
| Wise, Business | #ffffff, dark green #163300, one #f1f1ed | 13.9; 1.132 | full bleed | 75 / 124 | 60 / 81 | pale green cards on white |
| Our World in Data, topic page | #ffffff with contained panels #f2f2f2, #f0f4fa, #fbf9f3 | 1.119, 1.104, 1.053 | panels inside a 1232px column | panels hug their content | same | almost none |
| Vercel, home | one ground #fafafa | 1.044 | no bands | n/a | n/a | white panels on the ground |
| Linear, home (dark theme) | #08090a, #0f1011 | 1.046 between them | full bleed, dark | 98 / 91 | n/a | dark cards with 8% white hairlines |
| Monzo, Business | #ffffff only | 1.000 | no bands; about 203px above each heading (123 on a phone) | n/a | n/a | pale tinted cards #f2f8f3, radius 32 to 64 |
| GOV.UK, VAT Notice 700 | #ffffff; #f4f8fb only in header and footer | 1.068 | no bands; numbered headings and rules | heading: 20px padding above, 20px below; about 41px from the previous text | heading 21px, same spacing | none; rules 1px #cecece |
| Census Reporter, California | ground #f7f8f3 behind a white sheet; footer #e0e4d4 | 1.067 | one ground, no bands inside | each row: 1px rule #eff1e9, 28px above the content, 28px below the row | same | none |
| Wikipedia, United Kingdom | #ffffff; chrome #f8f9fa | 1.054 | no bands | heading: 12px padding above, 1px rule #a2a9b1 under it, about 36px from the previous text | same | none |
| World Bank, United Kingdom | #ffffff; chrome #f2f3f6 | 1.110 | no bands | 50 to 59px above each heading | 52 to 80px | none; rules #e4e9ec |
| PwC Tax Summaries, United Kingdom | #ffffff, one #f5f7f8 strip | 1.075 | rules under headings (1px #dedede) | 21 to 51px above headings | same | none |
| Financial Times | page ground "paper" #fff1e5; "wheat" #f2dfce; rules "black-20" #ccc1b7 (Origami palette) | 1.107 (paper) | rules, not bands | not measured (security page) | | |
| The Economist | not measured (security page) | | | | | |
| Ramp, Mercury | Ramp rendered no content headless; Mercury is a dark gradient | | | | | |

### 1b. Design systems (published)

| System | Light surfaces | Step vs white | The rule | Source |
|---|---|---|---|---|
| Material Design 3 | surface-container-lowest tone 100, low 96, container 94, high 92, highest 90; surface 98; dim 87. Baseline hex: #ffffff, #f7f2fa, #f3edf7, #ece6f0, #e6e0e9; surface #fef7ff | 1.103 (low), 1.150, 1.225, 1.296; surface 1.052 | Five container roles from lowest to highest, each a fixed tone of the neutral palette: neighbouring containers sit 2 tone (L*) units apart, the first 4 units below white | material-color-utilities `color_spec_2021.ts` **[read]**; m3.material.io colour roles |
| IBM Carbon | White theme: background #ffffff, layer-01 #f4f4f4, layer-02 #ffffff, layer-03 #f4f4f4. Gray 10 theme reverses the order | 1.100 | Light themes alternate between White and Gray 10 with each added layer; dark themes step one shade lighter per layer | carbondesignsystem.com, Color overview **[read]** |
| Atlassian | surface #FFFFFF; surface.sunken #F8F8F8; surface.raised #FFFFFF with a shadow; surface.overlay #FFFFFF with a shadow; surface.hovered #F0F1F2 | sunken 1.062 | Sunken is a well that groups content on the default surface (board columns); raised, with its shadow, is reserved for cards that can be moved; flat cards on the default surface take a border | atlassian.design Elevation **[read]**; `@atlaskit/tokens` 20.2.0 light theme **[read]** |
| Apple HIG (iOS) | systemBackground #ffffff, secondary #f2f2f7, tertiary #ffffff; grouped: #f2f2f7, #ffffff, #f2f2f7 | 1.116 | Primary for the overall view, secondary to group content within it, tertiary to group within the secondary: the grouped set alternates | HIG Color, iOS platform notes **[read]**; hex values from UIKit references **[snippet]** |

### 1c. This site's tokens, measured the same way

| Token | Hex | Step vs white | L* | OKLCH chroma, hue | Note |
|---|---|---|---|---|---|
| card | #ffffff | 1.000 | 100.0 | 0 | |
| ground | #f6f6f5 | 1.081 | 96.9 | 0.0013, 106 | the near-white ground since 2026-09-25 |
| soft | #f6f4f2 | 1.097 | 96.3 | 0.0034, 68 | more chroma than the banned cream #f7f6f4 (0.0029) |
| soft2 | #efebe8 | 1.185 | 93.3 | 0.0059, 60 | accent text on it reads 4.37:1, under AA |
| hairline | #e7e2df | 1.285 | 90.2 | 0.0068, 53 | |
| strong line | #d8d0cb | 1.521 | 84.0 | 0.0112, 54 | the card's outer border today |
| accent soft | #fff1ed | 1.102 | 96.1 | 0.0161, 37 | |
| earlier grey ground (recorded 2026-09-08) | #e3ded8 | 1.337 | 88.7 | 0.0098, 73 | replaced by the near-white ground after he objected to the grey |
| banned creams (no-cream gate) | #fbfaf7, #f7f6f4, #efeeeb, #faf4ec | 1.044 to 1.160 | 94.1 to 98.3 | 0.0029 to 0.0124, 75 to 91 | |

---

## 2. The seven questions

### Q1. How much do neighbouring bands differ?

**Measured.** Against white, light bands on good sites run from 1.04 (Stripe home #f8fafd, Vercel #fafafa, Apple #fafafc) to 1.13 (Wise #f1f1ed). Most cluster at 1.06 to 1.09: Stripe Payments #f6f9fc 1.057, Census Reporter #f7f8f3 1.067, GOV.UK #f4f8fb 1.068, Airbnb #f7f7f7 1.071, USAFacts #f7f7f3 1.074, PwC #f5f7f8 1.075, Apple #f5f5f7 and Notion #f6f5f4 1.089. A stronger group sits at 1.10 to 1.12: Our World in Data's panels, World Bank's chrome, Data USA's lighter tint (1.111). In lightness that is 1.7 to 5 L* units below white; Apple and Notion are 3.4. Every one is near-neutral (OKLCH chroma 0.007 or less) except bands tinted to a brand: Data USA's blue (0.014 to 0.016) and the FT's salmon paper (0.022). The one site that alternates two tints without white, Data USA, keeps them 1.103 apart. Linear's dark pair, for comparison, is 1.046 apart.

**Published.** No standard gives a number for a decorative band. Design systems express the step as tone: Material 3 puts its first container 4 L* units below white (1.103:1) and its containers 2 units apart; Carbon's alternate layer #f4f4f4 is 1.100:1; Atlassian's sunken surface #F8F8F8 is 1.062:1; Apple's grouped background #f2f2f7 is 1.116:1.

**Can anyone see the band? (Published.)**
- **WCAG 1.4.11 Non-text Contrast** asks 3:1 only for visual information needed to identify a user-interface component or its state, and for parts of graphics needed to understand content. Its Understanding document says a visible boundary is required only when nothing else shows that a control is there, and exempts graphics that are there for looks. A section introduced by a real heading needs no 3:1 band: the heading identifies it (1.3.1, Info and Relationships, carries the structure in the markup). **[read]**
- **APCA**, the contrast method drafted for WCAG 3, sets Lc 15 as the floor for any non-text element that must be discernible and tells designers to treat anything lower as invisible to many users. Every band pair in this study scores Lc 0 because it falls under APCA's low-contrast clip (white against #f5f5f7 is about Lc 6 before the clip). For scale: the site's hairline #e7e2df on white is Lc 14, the strong line #d8d0cb Lc 24. **[read]**
- **Forced colours** (Windows contrast themes): author background colours are replaced by the system canvas colour, box shadows are removed, border colours are forced to a system colour. Bands and shadow-only edges vanish; borders survive. **[read]** (MDN)
- **Low vision** (W3C Accessibility Requirements for People with Low Vision): people with reduced contrast sensitivity, or who set their own background and text colours, lose colour-only distinctions; spacing that groups related things and separates unrelated ones is one of the listed user needs. **[read]**

**Judgement.** A step of about 1.07 to 1.10 is the useful window: lighter steps tend to disappear on phones outdoors; stronger steps start to read as grey, and the founder has already moved the ground off a grey once. Whatever the step, the band can never be the only boundary.

### Q2. Full bleed or contained? How much padding?

**Measured.** Full bleed is the norm wherever backgrounds alternate: Apple, Stripe, Notion, Airbnb, Data USA, USAFacts, Wise. Contained panels appear where the page is a grid of modules (Our World in Data, Vercel) or a single sheet on a ground (Census Reporter).

Insets split cleanly by kind of page:

| Kind | 1280 | 375 | Examples |
|---|---|---|---|
| Marketing bands | 93 to 135 (Notion up to 183) | 52 to 80 | Apple 112 / 93 and 71 / 75; Stripe 121 / 135 and 73 / 77; USAFacts 120 and 80 |
| Data bands | 25 to 60 | similar | Data USA 60 top, 25 bottom per chapter |
| Pages without bands | 36 to 59 above a heading | 21 to 80 | Wikipedia 36; GOV.UK about 41; Census Reporter 28 + 28 around a rule; World Bank 50 to 59 |

Desktop insets shrink by about 1.5 to 1.7 on a phone: Apple 112 to 71, Stripe 121 to 73, USAFacts 120 to 80.

**Published.** GOV.UK's responsive spacing scale steps from 60px on large screens to 40px on small ones for its largest unit, and from 50 to 30 for the next; its extra-large section break uses that 50 / 30 margin above and below. **[read]**

**Judgement.** Full bleed, with the content kept inside the existing 1120px column and its splits. A contained band (a big rounded panel per chapter) is just a larger card and brings back the box the founder wants gone.

### Q3. Section header anatomy

**Measured.**

| Site | Header | What follows |
|---|---|---|
| Data USA | chapter H2 42px regular, 15px below it; sub-topic H3 28px upper case with 45px above; leaf H4 26px | a one-sentence finding with its figures, 17px, about 17px under the H2 |
| Apple | the section's name as a small H2 (24px semibold, 21px on a phone), then an 80px claim 4px below (48px on a phone) | content 40 to 150px later |
| Stripe Payments | the section's name as a small coloured H2 (18px, weight 500), a 38px claim 23px below | |
| GOV.UK | numbered H2 ("1. Overview"), 24px bold (21px on a phone), 20px to the text | body text |
| Wikipedia | H2 24px serif regular with a 1px rule under it, 18px to the text | |
| Census Reporter | H2 14px bold as a column head; the figure (31px) 10px below | |
| World Bank | H2 20px semibold (24px on a phone), about 20px to the content | |

Two anatomies, then. Reference and data pages use a plain title, often numbered, followed directly by the figure or by one sentence of finding. Marketing pages pair a small section name with a large claim. None of the data pages puts a paragraph standfirst under every section.

**Judgement.** This site has already ruled on most of the anatomy: the eyebrow is banned (a gate hunts small upper-case labels above a title), the chapter header is the muted index plus one plain heading, icons live at section level, terracotta never sits on a heading. The Data USA and GOV.UK pattern, a number and a title and then the content, is the one that fits those rulings.

### Q4. Sub-sections inside a band

**Measured.**
- **Data USA**: each chapter band holds 2 to 4 sub-topics (19 in all) and about 7 leaf sections (52 in all). Leaves are separated by whitespace, not rules: 45px above each sub-topic, 30px margins round the white chart panels.
- **Census Reporter**: 17 sections on one ground, each row topped by a 1px rule (#eff1e9) with 28px above the content and 28px under the row; columns inside a row, no vertical rules.
- **GOV.UK and Wikipedia**: headings and whitespace; Wikipedia adds a rule under each H2.
- **Apple**: inside one white run of 11,360px, four H2 sections about 2,800px apart, separated by about 240px of whitespace.
- Band lengths: Data USA's chapter bands run 2,160 to 7,096px at 1280 (2.4 to 8 screens), each with 2 to 4 sub-heads.

**Published.**
- Refactoring UI: use fewer borders; a box shadow, a difference in background colour or extra spacing usually separates better, and a group needs more space around it than inside it. **[read]** (book notes; the original Medium article refused the fetch)
- NN/g, The Principle of Common Region (Harley, 2020): containers are a strong grouping cue that can overpower proximity and similarity; whitespace alone often groups well enough, so add a container only where proximity fails. **[read]**
- GOV.UK: the visible section break is a 1px border inside the responsive margins above. **[read]**

**Judgement.** Inside a band, a level of two or three sections separated by a wide gutter, and levels separated by a hairline. How many fit: about four levels (eight sections). The colour of a band registers at its edges; once both edges are off-screen the reader no longer sees it, so a band over about three screens needs a sub-head inside it, as Data USA does.

### Q5. When does a card still earn its place, and on what?

**Published.**
- NN/g, Cards: UI-Component Definition (Laubheimer, 2016): cards suit heterogeneous content and entry points to fuller detail; they are a poor fit when people scan, search or compare, because they weaken ranking and are less scannable than a list; they should not be used as a modern-looking replacement for a list. **[read]**
- Atlassian: raised surfaces (with their shadow) are reserved for cards that can be moved; a flat card on the default surface pairs with a border; the sunken surface is a well for grouping. **[read]**
- Carbon: whatever sits on a layer takes the next layer's colour: grey on white, white on grey. **[read]**
- Apple HIG: the secondary background groups content within the primary; the tertiary groups within the secondary. **[read]**

**Measured.** The opposite-surface rule is how Apple (white on #f5f5f7 25 times, #f5f5f7 on white 16 times) and USAFacts (27 and 12) place every card, with no border and no shadow. Stripe puts white cards with a shadow on its tint and white cards with a hairline on white. Data USA wraps some charts, not all, in white panels on its tinted chapters. GOV.UK, Wikipedia, Census Reporter and the World Bank use no cards at all.

Three combinations work:
1. White card on a tinted band (Stripe, Apple, USAFacts, Data USA).
2. Tinted panel on a white band, no border (Apple, USAFacts): a 1.07 to 1.09 step is enough once the panel has a corner radius.
3. White card with a hairline on a white band (Stripe, Notion), usually for things you operate.

**Judgement.** A card earns its place when the reader operates something in it (a lever, a picker, a switch, a sort), when it is a door to another page, or when it must read as one object beside open content. A figure, a bar list, a ring, a key-value grid or a list of notes is read, not operated, and goes open.

### Q6. Sticky in-page navigation

**Measured.**

| Site | 1280 | 375 |
|---|---|---|
| Data USA | fixed 45px bar under a 40px header: six chapter links plus the current chapter's sub-topics and sections (21 links); the current chapter and section highlighted as you scroll | none: the bar is hidden |
| Our World in Data, topic | sticky 56px bar, five section links, current one highlighted | sticky 48px bar, same links, scrolls sideways inside the bar |
| Stripe, Payments | fixed 64px bar, five section links | same bar, plus a 75px call-to-action bar at the bottom |
| Apple, MacBook Air | sticky 52px bar: product name, links to the product's other pages, current page marked | 48px; the links fold into a menu |
| Wikipedia | sticky contents in the left rail, 51 in-page links | desktop skin served; mobile skin not measured |
| GOV.UK, VAT Notice 700 | contents list in the body at the top; once scrolled past, a fixed "Contents" link at the bottom of the viewport (59px) jumps back to it | same, 49px |
| World Bank | floating back-to-top button | same |
| Census Reporter, Notion, USAFacts, PwC | none | none |

**Published.**
- NN/g, Table of Contents: The Ultimate Design Guide (Wang and Brown, 2023): a contents list helps long pages because attention concentrates at the top; a sticky list in a side rail works when it highlights the current section; a sticky list in the main body is discouraged because it stacks under the global navigation; on mobile, sticky contents buttons were often not noticed in testing, and a list placed in the body at the top adapts to every screen. **[read]**
- NN/g, Anchors OK? Re-Assessing In-Page Links (Schade, 2017): label them as on-page, make the link text match the heading, land the heading near the top without hiding it under a sticky bar, highlight the current section if the list is sticky, and use them only where the page is genuinely long. **[read]**
- Wikimedia (Vector 2022): in user tests in three countries, readers strongly preferred persistent access to the contents, valued the current section in bold, and did not want the list to overlap the content; the companion sticky-header A/B test cut scrolls back to the top by 15% per session for logged-in users on 15 pilot wikis. **[read]**
- GOV.UK publishing components: "contents list with body" pairs the contents list with a sticky back-to-contents link. **[read]**

**Judgement.** It helps on a 21-section page, and the site has almost none of it today: the grouped rail only draws at 1536px and wider, so readers at 1280 and on phones get no in-page navigation at all. Drawers are banned, so on a phone the GOV.UK form is the one that fits: a list in the body and one fixed link back to it. The Our World in Data phone bar scrolls sideways inside itself; that keeps to the letter of the ban on horizontal page scroll but reads like the banned chips, so it is not a model.

### Q7. Rhythm across 15 to 20 sections without monotony

**Measured.** Colour changes per page: Stripe Payments 13 (one per section, a marketing page of about ten short sections); Data USA 6 (one per chapter); USAFacts 5; Apple MacBook Air 4 in 32,700px (colour marks special modules, not a strict alternation); Notion 2; Airbnb 1; GOV.UK, Wikipedia, Census Reporter and the World Bank 0. Data and reference pages change colour at chapter level or never. Per-section alternation appears only on marketing pages with short sections.

**Published.** NN/g, The Illusion of Completeness (Flaherty, 2016): a page-wide horizontal break and very large gutters between sections can make a page look finished above the real end; content should peek across the fold. NN/g's Common Region article makes the same point about full-width coloured blocks acting as false floors. **[read]**

**Judgement.** Rhythm comes from three sources, and the colour is only one of them:
1. Chapters alternate surfaces: five changes on the UK page, each one a real turn in the argument.
2. Inside a chapter the level splits already vary (3-2, 1-1, 2-1, 2-3), which flips the eye's entry point level to level.
3. The loud moments stay with the content: the masthead figure, the margins chart, the survival curve.

Never alternate per section (twenty changes become stripes that fight the bars and rings), never add a dark or brand-coloured band (the palette law), and keep a third surface to one zone at most.

---

## 3. Proposed band system for marginatlas

All of section 3 is judgement, built on the measurements above.

### 3.1 Surfaces

| Role | Proposed token | Hex | vs white | L* | OKLCH chroma, hue | Where |
|---|---|---|---|---|---|---|
| Paper | `--band-paper` (an alias of `--c-card`) | #ffffff | 1.000 | 100.0 | 0 | chapters 01 and 03, the close |
| Tint | `--band-tint` (an alias of `--c-ground`) | #f6f6f5 | 1.081 | 96.9 | 0.0013, 106 | the masthead, chapters 02 and 04 |
| Reserve | `--band-deep` (new, optional) | #f1f1f0 | 1.130 (1.045 against the tint) | 95.1 | 0.0013, 106 | at most one zone; not needed for a first build |

Why the tint is today's ground and nothing new:
1. It is already the page's ground: the near-white that replaced the grey on 2026-09-25 after his objection, live since.
2. Its step, 1.081, sits with Apple and Notion (1.089) in the measured cluster.
3. Its chroma (0.0013) is below every banned cream (0.0029 and up) and well below `--c-soft` (0.0034).
4. It adds no new literal for the no-cream gate to miss.

If he wants the tint a touch warmer, #f6f5f4 is the ceiling: 1.089, chroma 0.0017, hue 68 (the ramp's own hue, and Notion's band). Never `--c-soft` #f6f4f2 as a band (more chroma than a banned cream) and never `--c-soft2` #efebe8 (accent text fails on it). If the reserve is used and terracotta text sits on it, it may go no darker than #f0f0ef (accent text 4.54:1).

### 3.2 Contrast on each surface (WCAG ratio)

| Token | on paper #ffffff | on tint #f6f6f5 | on reserve #f1f1f0 |
|---|---|---|---|
| ink #1b1b1a | 17.24 | 15.94 | 15.25 |
| ink2 #565654 | 7.36 | 6.80 | 6.51 |
| muted #5f5f5d | 6.40 | 5.92 | 5.66 |
| accent text #c2410c | 5.18 | 4.79 | 4.58 |
| accent fill #fb8469 (non-text) | 2.44 | 2.26 | 2.16 |
| accent border #ffc7ba (non-text) | 1.49 | 1.37 | 1.31 |
| hairline #e7e2df (rule) | 1.29 | 1.19 | 1.14 |
| strong line #d8d0cb | 1.52 | 1.41 | 1.35 |
| soft #f6f4f2 (hover row, icon tile) | 1.10 | 1.01 | 1.03 |
| accent soft #fff1ed | 1.10 | 1.02 | 1.03 |

Every text token clears 4.5:1 on all three surfaces; the tightest is accent text on the reserve, 4.58. APCA on the tint: ink Lc 98.7, muted Lc 76.4, accent text Lc 69.1. Two things fall out of the table. The accent fill is under 3:1 on every surface; that is an existing fact about the palette, and the tint takes it from 2.44 to 2.26. And `--c-soft` and `--terra-soft` disappear on the tint (1.01 and 1.02), so every part that uses them needs an on-tint value (3.9).

### 3.3 Chapters to bands on the UK page

```
[ tint  ]  Masthead: his board, unchanged (a white card on this same ground today)
[ paper ]  01  What it costs to open, and to run     7 sections, 4 levels
[ tint  ]  02  Red tape, borrowing and getting paid  4 sections, 2 levels
[ paper ]  03  What to open, and where               8 sections, 4 levels
[ tint  ]  04  The first years                       2 sections, 1 level
[ paper ]  Close: the sources line and the onward doors
```

| Zone | Section ids (`country-view.tsx`) | Surface |
|---|---|---|
| Masthead | take | tint |
| 01 | setup, entry-bill, hiring, employment, running-costs, insurance, peers | paper |
| 02 | character, paperwork, financing, banking | tint |
| 03 | money, exit, age-mix, job-market, cities, locals, spend, character-people | paper |
| 04 | first-years, obstacles | tint |
| Close | (the Close block) | paper |

Why the masthead takes the tint: his board of 2026-09-20 is a white card (`HeroBoard` draws a `Box`) and has stood on this ground since 2026-09-25, so it stays exactly as ratified, and chapter 01 opens onto paper straight after it. The reader sees the page open up at the first scroll. A country with fewer chapters keeps the order: masthead on tint, then alternate starting from paper. Chapters 01 and 03 are both at the four-level ceiling (3.6).

### 3.4 Spacing

| Distance | 1280 | 375 | Today (`kit.tsx`) |
|---|---|---|---|
| Band padding, top and bottom | 64 / 64 | 40 / 40 | 48 above a chapter header |
| Chapter number to title | 8 | 8 | 8 |
| Chapter header to the first level | 32 | 24 | 12, then 32 to the first band of cards |
| Between levels | 32, a 1px hairline, 32 | n/a (stacked) | 32 between cards, each with 20 of padding |
| Between stacked sections on a phone | n/a | 24, a 1px hairline, 24 | 32 between cards |
| Column gutter | 64 (48 at 768) | n/a | 32 between cards |
| Inside a section: kicker to figure, figure to drawing | 16, 12 | 12, 12 | unchanged |
| Card padding, for the cards that stay | 20 (28 for a lead card) | 16 | 16, 20, 28 by density |

Every value is on the ladder (0 2 4 8 12 16 20 24 32 40 48 64). Content-to-content distances stay close to today's (72px between levels and between columns today; 65 and 64 proposed), so the page does not grow; what changes is that the space is no longer boxed, and a colour change now marks the chapter edge. On a phone the gain is width: a section's content goes from about 301px inside a card (375, less two 16px gutters, two 20px paddings and two borders) to 343px open, 14% wider for every drawing.

### 3.5 Header anatomy

The chapter opener, at the top of each band:

```
01                                      14px, semibold, muted, tabular figures
  8
What it costs to open, and to run       24px, semibold, ink
  32 (24 on a phone)
first level
```

- The title moves from 20px to 24px, the `--t-section` rung that `globals.css` already reserves for the chapter opener. On a bandless page a 20px title was enough; as the anchor of a whole coloured zone it needs the next rung.
- **No standfirst by default.** If a chapter ever needs one: one line, 90 characters at most, 16px ink2, 8px under the title (his one-supporting-line rule).
- Kept from the rulings: no eyebrow, no icon at chapter level, no terracotta on the heading.
- The section opener inside the band is unchanged (MODEL.md, The Opener: the 28px icon tile and the 12px kicker), except that the tile's fill turns white on tint bands (3.9).

### 3.6 Inside a band

- Levels keep today's splits (1-1, 2-1, 3-2, 2-3, 1-1-1), chosen by the content.
- Between levels: one 1px hairline (#e7e2df) across the 1120px column, 32px above and 32px below.
- Between two sections in one level: a 64px gutter (48px at 768), no vertical rule, the two openers on one line.
- On a phone the sections stack, each separated from the next by 24px, a hairline and 24px. The last section in a band takes no rule, since the band padding follows.
- At most four levels (eight sections) per band. Past that, put a 20px sub-head inside the band with a level's spacing round it, or split the chapter.
- No nested tints: a band holds open sections and white cards; a card holds nothing tinted beyond what it holds today (empty tracks, disclosure panels).

### 3.7 Where cards remain

**The test (any one):** the reader operates something in it; it is a door to another page; it must read as one object beside open content.

On the UK page that keeps five cards out of 21:

| Section | Why it stays a card |
|---|---|
| hiring | the hire lever (`interact/HireLever.tsx`) |
| financing | the loan lever (`interact/LoanLever.tsx`) |
| insurance | the cover picker (`interact/CoverPicker.tsx`) |
| peers | the sortable table (`interact/SortTable.tsx`) |
| cities | doors to the city pages |

Readouts on a drawing (`interact/Marks.tsx`) do not make a section a card. A blocked seat follows its section's form: open where the section is open.

**Surface, recommended:** the one card surface everywhere: white, the border, the July-3 shadow pair, radius 12. This respects rulebook v2 rule 36 (exactly one card surface) and his repeated request for the shadow. On a tint band it floats as cards do today; on paper it reads as a bordered object, as Stripe's and Notion's white-on-white cards do. With five cards instead of 21, the shadow stops being noise. (Atlassian would reserve shadows for movable cards; his ruling outranks that here.)

**Option for his ruling:** opposite-surface panels, the Apple and Carbon pattern: on paper bands a card becomes a tint panel (#f6f6f5, radius 12, no border, no shadow). Fewer edges, but a second card look on one page.

### 3.8 Contents without a drawer

- **768 to 1535px: a sticky chapter bar.** 44px tall, white with a bottom hairline, under the site header, shown once the masthead has scrolled away. Four in-page links with their numbers, for example "01 Costs, 02 Red tape, 03 Where, 04 First years" (the short labels are his to approve). The current chapter in ink, semibold, with a 2px ink underline; the others in ink2. Anchor targets are offset by the bar's height so a landing heading is never hidden.
- **1536px and wider:** the existing grouped rail instead of the bar, never both.
- **Under 768px: GOV.UK's pattern.** Under the masthead, a contents list in the body: the four chapters, numbered, each row at least 44px tall, hairlines between. Once it has scrolled away, one fixed "Contents" link (44px, bottom left, white with a top hairline) jumps back to it. No drawer, no menu, no sideways scrolling, no chips. The page's bottom padding grows by the link's height so the link never covers the close.
- The bar and the link stay white whichever band is beneath them, so nothing flickers as bands pass.

### 3.9 What has to change with it

Nothing below was edited; this is the list for the build.

- **Tokens.** `--band-paper` and `--band-tint` as aliases of `--c-card` and `--c-ground`; optionally `--band-deep`. On-tint values for every part filled with `--c-soft` or `--terra-soft`: the icon tile, row hover, chips inside cards (suggested `--tile-bg` and `--row-hover`, each resolving to white on a tint band). This is Carbon's per-layer token idea at the smallest scale.
- **Forced colours.** Under `@media (forced-colors: active)`, a 1px `CanvasText` rule on each band edge, because the backgrounds disappear there.
- **Checks keyed to cards.** `Box` stamps `data-card` and `data-block`; BLOCK FLOOR counts `data-block`, and the emptiness and equal-height checks read card boxes. An open section must stamp `data-block` from its own wrapper, or the floor reads empty.
- **The full-width gate** walks section landmarks against the content column. A full-bleed band must be a presentational wrapper outside the column, or the gate will read it as a full-width section.
- **The no-cream gate** reads literal values. Reusing `--c-ground` keeps the band at a known, allowed value.

---

## 4. Pitfalls

1. **Colour as the only boundary.** APCA scores every band pair 0; forced colours remove backgrounds; phones outdoors flatten near-whites; people who set their own colours never see the band. Fix: numbered chapter headings, 64 / 40 band padding, hairlines between levels, and the forced-colours rule above.
2. **A false floor under the masthead.** A full-width colour change near the fold can look like the end of the page (NN/g). Chapter 01's number and title must show above the fold at 1280 x 800 and at 375 x 812, or the masthead must not end exactly at the fold. Check both with a screenshot.
3. **Stripes.** Stripe changes colour every section: that suits ten short marketing sections. On 21 data sections it becomes zebra striping that competes with the bars. Change colour per chapter only.
4. **Parts that vanish on the tint.** The soft fill (row hover, icon tile) reads 1.01:1 against the tint and the accent soft 1.02:1. Give them on-tint values (3.9).
5. **Lighter fills get weaker on the tint.** The accent fill drops from 2.44 to 2.26:1 and the accent border from 1.49 to 1.37:1. Drawings that depend on the lightest fills read best in a white card or on paper.
6. **Cream drift.** `--c-soft` carries more chroma than a banned cream and `--c-soft2` fails accent text; neither may become a band. The no-cream gate checks literals only and would not catch a new near-cream band value.
7. **Shadow-only edges vanish in forced colours.** The cards that remain keep their 1px border.
8. **Full bleed is not full width.** His full-width ban (2026-08-25 and 2026-08-27) is about a finding stretched across the row. The band is background only; the sections stay in the column and its splits. MODEL.md PART 9 clause 36 (exactly three full widths: the opening, one table, the close) counts blocks, not backgrounds, so a band spends none of them.
9. **Two navigations at once.** The bar and the 2xl rail must never both show. Sticky bars stacked under a site header eat a phone's height (NN/g), which is why the phone gets the in-body list and one link.
10. **Long bands lose their colour.** Once both edges are off-screen the reader no longer sees which band they are in. Over about three screens, a band needs a sub-head inside it.
11. **The naming collision.** `Band` already means a level in `kit.tsx`; name the new zone something else before any rule is written about it.
12. **Equal heights without boxes.** His equal-heights law was written for boxes. Open sections hide a short section beside a tall one better than boxes do, but a hairline under a level still shows a much shorter column. Fix it with the split, never by stretching a figure.
13. **Dark or brand bands.** Stripe, Wise, Data USA and USAFacts use dark or saturated bands for emphasis. The palette law (terracotta plus warm neutral greys, light theme only) rules them out.

---

## Sources

Measured pages (all read with the script on 2026-10-04):
- Apple: https://www.apple.com/macbook-air/ and https://www.apple.com/iphone/
- Stripe: https://stripe.com/payments and https://stripe.com/
- Data USA: https://datausa.io/profile/geo/california
- Our World in Data: https://ourworldindata.org/co2-and-greenhouse-gas-emissions (the old country URL, https://ourworldindata.org/country/united-kingdom, now redirects to search)
- Notion: https://www.notion.com/
- Airbnb: https://www.airbnb.com/host/homes
- USAFacts: https://usafacts.org/
- Wise: https://wise.com/gb/business/
- Vercel: https://vercel.com/
- Linear: https://linear.app/
- Monzo: https://monzo.com/business-banking
- Mercury: https://mercury.com/
- Ramp: https://ramp.com/ (no content rendered)
- GOV.UK: https://www.gov.uk/guidance/vat-guide-notice-700 and https://www.gov.uk/set-up-business
- Census Reporter: https://censusreporter.org/profiles/04000US06-california/
- Wikipedia: https://en.wikipedia.org/wiki/United_Kingdom
- World Bank: https://data.worldbank.org/country/united-kingdom
- PwC Tax Summaries: https://taxsummaries.pwc.com/united-kingdom
- FT and The Economist: https://www.ft.com/ and https://www.economist.com/ (security pages only)

Published guidance:
- FT Origami palette (paper, wheat, black-20): https://unpkg.com/@financial-times/o-colors/src/scss/_palette.scss **[read]**
- Material 3 tones: https://github.com/material-foundation/material-color-utilities/blob/main/typescript/dynamiccolor/color_spec_2021.ts **[read]**; colour roles: https://m3.material.io/styles/color/roles
- IBM Carbon layering: https://carbondesignsystem.com/elements/color/overview/ **[read]**
- Atlassian elevation: https://atlassian.design/foundations/elevation **[read]**; tokens: https://unpkg.com/@atlaskit/tokens/dist/esm/artifacts/themes/atlassian-light.js **[read]**
- Apple HIG, Color: https://developer.apple.com/design/human-interface-guidelines/color **[read]**; UIKit values: https://noahgilmore.com/blog/dark-mode-uicolor-compatibility **[snippet]**
- WCAG 2.2 Understanding 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html **[read]**
- APCA in a Nutshell: https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html **[read]**
- W3C, Accessibility Requirements for People with Low Vision: https://www.w3.org/TR/low-vision-needs/ **[read]**
- MDN, forced-colors: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors **[read]**
- NN/g, Cards: https://www.nngroup.com/articles/cards-component/ **[read]**
- NN/g, Common Region: https://www.nngroup.com/articles/common-region/ **[read]**
- NN/g, Illusion of Completeness: https://www.nngroup.com/articles/illusion-of-completeness/ **[read]**
- NN/g, Table of Contents: https://www.nngroup.com/articles/table-of-contents/ **[read]**
- NN/g, In-Page Links: https://www.nngroup.com/articles/in-page-links/ **[read]**
- Refactoring UI, use fewer borders: https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886 **[snippet]**; book notes: https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5 **[read]**
- Wikimedia, table of contents: https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements/Features/Table_of_contents **[read]**; sticky header A/B: https://www.mediawiki.org/wiki/Reading/Web/Desktop_Improvements/Updates/2022-07_for_the_largest_wikis **[read]**
- GOV.UK spacing: https://design-system.service.gov.uk/styles/spacing/ **[read]**; section break source: https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/core/_section-break.mixin.scss **[read]**; contents list with body: https://components.publishing.service.gov.uk/component-guide/contents_list_with_body **[read]**
- Creative Boom, trends creatives are over in 2026 (bento grids, number 9): https://www.creativeboom.com/insight/10-trends-creatives-are-so-over-in-2026/ **[read]**

Project files read (not edited): `src/app/globals.css` (tokens), `src/components/spine/kit.tsx` (Movement, Band, Box, CARD_SURFACE), `src/components/spine/country/country-view.tsx` (the UK page's order and its rail), `src/lib/spine/copy.ts` (chapter titles), `scripts/verify_no_cream.ts`, `scripts/verify_token_contrast.mjs`, `scripts/verify_full_width_sitewide.mjs`, `E:/atlas/design/loop/build/briefs/MODEL.md` (The Opener).
