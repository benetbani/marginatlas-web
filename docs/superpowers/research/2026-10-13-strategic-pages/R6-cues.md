# R6: Cues for good and bad, disclosure, answer types, section openers (2026-10-13)

Read-only study of the owner's asks of 2026-10-13. Code read from `main` at c35e42a7 (`git show main:<path>`), never the working
tree; nothing rendered; 14 web fetch attempts and 1 search, sources cited. Unprefixed paths are in `E:/atlas/website`; `E:/atlas/...` paths
are the parent repo; `MODEL.md` is `E:/atlas/design/loop/build/briefs/MODEL.md`.

**Blind spots.** A static read of builders cannot say how many pages print a row: coverage comes from grepping the 198 country
shards on `main`. Contrast is computed from hex values with the WCAG luminance formula, not measured on screen. Colour-blind
figures are a simulation (Machado 2009 at full severity, CIE76 delta E) and cannot replace testing with readers.

## 0. The answers in one screen

- **Triangle:** one solid triangle whose angle is the judgment (up very good, up-left, left middle, down-left, down very poor),
  16px beside a row's figure, 20px beside a 30px figure, a word for screen readers and a one-line key.
- **Colour:** (a) ink and greys holds 5.8:1 or more on every ground and passes every gate; (b) green to red puts three of five
  states under the palette ban, its yellow at 1.40:1, its reds 11.5 to 15.6 delta E from the text red. I recommend (a).
- **Disclosure:** the answer fold: DetailPanel's native `<details>`, the answer in the summary row, the breakdown behind the plus.
- **Answer types:** all figures, all words or all levels. Five live sections mix them, at least three on the UK country page; the
  one check for it reads tables only.
- **Openers:** a bare 32px Atlas glyph in terracotta beside the 20px title; row icons go grey; never the opener's glyph inside.

## 1. The good-or-bad cue

### 1.1 Where the site already judges, and what drives it

| Mechanism | Where | Driven by | Says good or bad? |
|---|---|---|---|
| Placement sentence, "Higher than {n} countries in ten", "Among the lowest tenth" | `src/lib/spine/placement.ts:64-75`, copy `src/lib/spine/copy.ts:676-678`; callers `pay_rows.ts:104-107`, `hero_board.ts:173-201`, `country_exit_rows.ts:176`, `city_hero_board.ts:175` | strict rank among the members holding the field, a tie not lower (`placement.ts:81-91`) | No, by design: "one direction always ... nothing is a judgment" (`placement.ts:14-16`; MODEL.md:266, clause 37 at :977) |
| Level mark: three rising bars; the word High, Medium or Low in aria-label and title only | `src/components/spine/archetypes/HeroBoard.tsx:177-190`; `hero_board.ts:113-124`; copy `copy.ts:360-361` | thirds of the same rank, a set of 20 or more | No: "nothing about good or bad ... the reader knows which" (`hero_board.ts:41-46`). On one card three bars mean slow (days to register) and clean (clean dealing) |
| Level chip, the word | running costs, `src/components/spine/country/country-view.tsx:970` | the same thirds | No |
| Best tick in a table | `CompareTable.tsx:17-28, 219-264`; `interact/SortTable.tsx:17, 25` | each column's `best: "min" / "max" / "none"` | Yes, inside the table: a tick and weight, an underline under 340px of table (`CompareTable.tsx:258-260`) |
| Ranked bars' leader | `RankedBars.tsx:136-141, 208, 396` | `lead: "max"` for a margin, `"min"` for a burden | By order only; no district is featured (MODEL.md:195) |
| Spectra poles | `src/components/spine/archetypes/SpectraTable.tsx:2-5` | a trait's position, 0 to 1 | An unseen convention: worse pole left, better right, on one neutral track |
| Survival regions | `src/lib/spine/sections/first_years.ts:5-6` | `data/sections/survival.json` | Names the best and the worst region |
| Legacy, off the spine | `src/components/kit/charts/ScoreBand.tsx:66-77`, `SeverityGlyph.tsx:58-64`, `src/lib/scores/band_tone.ts:16-30`, `band_labels.ts:17-43` | band keys, forgiving to brutal | Yes, in words (Easy to Very hard) and weight; used by a legacy route and /dev only (`src/app/(site)/cities/[slug]/page.tsx:59`, `src/app/dev/charts/page.tsx:14`) |

History that bears on the ask: green and amber carried good-versus-bad on score strips and gauges on three page types when the
palette gate was written (`scripts/verify_palette_membership.mjs:18-31`) and were replaced on 2026-08-17 (`band_tone.ts:16-22`)
by "good-versus-bad with intensity and position instead of hue" (`globals.css:1030-1036`), terracotta at the favourable end.

### 1.2 Which indicators have a direction, and where it is written

| Indicator | Better when | Written where |
|---|---|---|
| Tax on profit; payroll on wages; cost and days to register | lower | `src/lib/spine/peer_rows.ts:33-36` (`best: "min"`) |
| Salary | neither: "cheaper staff and poorer customers at once" | `peer_rows.ts:37`; `CompareTable.tsx:119-120` |
| Shop rent (districts) | lower | `hood_compare_rows.ts:68`; `district_rows.ts:6-9`; `RankedBars.tsx:208` |
| City living cost; customer income; visitors | lower; higher; higher | `peer_rows.ts:141-143`; `hood_compare_rows.ts:69` |
| Owner take-home; net margin; takings | higher | `industry_places_rows.ts:228-229`; `trade_peer_rows.ts:96` |
| Clean dealing; admin ease | higher | `adapt_country.ts:1109` (`direction: "high_good"`); lenses, `adapt_country.ts:564-566` |
| Survival; break-even; competition density | higher; lower; lower | legacy only, `src/lib/markets/across_cities.ts:312-356`; nowhere on the spine |
| Loan rate; card fee; electricity price | lower (implied) | nowhere |

Direction lives per table column in five builders, as a sorting and tick property. A grep of `data/` for a direction field finds
none, and the two places a reader meets a level, the hero board and the world tracks, carry none.

### 1.3 The triangle, designed

| State | Angle (CSS rotate) | Word | His colour |
|---|---|---|---|
| 1 | 0deg, points up | Very good | dark green |
| 2 | -45deg, up and left | Good | green |
| 3 | -90deg, points left | Middle | yellow |
| 4 | -135deg, down and left | Poor | red |
| 5 | 180deg, points down | Very poor | dark red |

- **Drawing.** `<svg viewBox="0 0 16 16"><polygon points="8,0.7 14,11.7 2,11.7" transform="rotate(A 8 8)"/></svg>`: centroid
  at the box centre, so every angle turns in place. Solid fill; only the middle state is hollow, at a 2px stroke, because
  WCAG 1.4.11 warns that thin lines render fainter than their colour (https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- **Size.** A 16px box beside a 14 or 16px row figure; a 20px box beside a section's 30px figure (MODEL.md:246).
- **Seat.** Its own column right after the figure, 8px away: the hero board's fourth column already holds the level mark
  (`HeroBoard.tsx:145`), and PART 5's third column takes "a bar, a placement line, or nothing" (MODEL.md:177). Under 420px it
  shares the figure's cell. Never before the label, where the row's glyph stands.
- **Arithmetic.** The placement rank (`placement.ts:81-91`), turned by the direction: for `max` the share of members strictly
  below, for `min` the share strictly above. Fifths: 0.8 and up very good, 0.6 good, 0.4 middle, 0.2 poor, under 0.2 very
  poor; on a `max` row these are the placement sentence's tenths read in pairs. No triangle for a `none` column, a set under 20
  (`hero_board.ts:113-114`), or a fill value (`src/lib/spine/world_stats.ts:12-18`; clause 74, MODEL.md:1080). Computed at
  render, never stored, as the derived-accents rule asks (`docs/design-system/GUIDELINES.md:60`).
- **Never by colour alone.** The angle is the visual carrier; colour may repeat it (WCAG 1.4.1:
  https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html). For a screen reader: `role="img"` and
  `aria-label="Good for a business"` on the wrapper, the SVG `aria-hidden`; where a row has the Marks readout
  (`HeroBoard.tsx:142-147`) the readout says the word, then the placement sentence. For sight: the word beside the 30px figure,
  and one key line under a list ("Triangles: up is better for a business, down is worse.", 10 words) in the seat of today's
  "Marks rank the countries." (`HeroBoard.tsx:163`). Carbon asks a status to combine at least three of colour, shape, symbol
  and text, and prefers a label beside every icon (https://carbondesignsystem.com/patterns/status-indicator-pattern/).

**What he has to rule on before it is built.**
1. It reverses "nothing is a judgment" (`placement.ts:14-16`; MODEL.md:266; `hero_board.ts:41-46`). The sentence can keep its
   one direction; the triangle carries the judgment. On a burden the two read apart ("Higher than one country in ten" beside an
   up triangle), and the key line has to say why.
2. On a money page, up and down triangles read as "went up" and "went down". The site already draws a triangle as the
   borrowing track's reference mark (`src/components/spine/charts/WorldRange.tsx:44-47`; `country-view.tsx:637`) and holds a
   dormant up triangle meaning "more" (`src/components/spine/forms-v2.tsx:229-243`). Keep one triangle meaning: give the
   reference another mark. A down triangle is also the dropdown sign readers know (WCAG's 1.4.11 page lists a menu's open and
   closed arrow as a state indicator), so the plus stays the site's only disclosure sign.
3. One triangle per indicator, never a verdict on a whole country: composite scores are refused
   (`docs/superpowers/plans/2026-10-05-masterplan/01-PROTOCOL.md:62-63`).
4. The hiring row prints the shard's word (Easy, Moderate, Hard) and no figure (`hero_board.ts:188-191`): it either becomes a
   level row or leaves the figure list (section 3).

### 1.4 Two colour variants, with contrast on the site's grounds

Grounds: white `#ffffff` (`--c-card`), tint `#f6f6f5` (`--c-ground`, `globals.css:2791`), app `#f7f7f8` (`globals.css:54`),
soft `#f6f4f2` (`--c-soft`, `globals.css:2751`). WCAG 1.4.11 asks 3:1 for a graphic needed to understand the content.

| State | (a) ink and greys | white / tint | (b) his green to red | white / tint | Palette gate on (b) |
|---|---|---|---|---|---|
| Very good | `--c-ink` `#1b1b1a`, solid | 17.24 / 15.94 | dark green `#1b5e20` | 7.87 / 7.28 | banned, hue 124.5 |
| Good | `--c-ink2` `#565654`, solid | 7.36 / 6.80 | green `#2e7d32` | 5.13 / 4.74 | banned, hue 123.0 |
| Middle | hollow, 2px `--c-muted` `#5f5f5d` | 6.40 / 5.92 | yellow `#fdd835` | 1.40 / 1.29, fails alone: needs a 1.5px ink edge | banned, hue 48.9 |
| Poor | `#565654`, solid | 7.36 / 6.80 | red `#c62828` | 5.62 / 5.20 | legal hue (0), delta E 15.6 from `#991600` |
| Very poor | `#1b1b1a`, solid; (a2) `--terra-text` `#991600` | 17.24 / 15.94; (a2) 8.50 / 7.86 | dark red `#7f0000` | 11.04 / 10.21 | legal hue (0), delta E 11.5 from `#991600` |

- Lowest across all four grounds: (a) 5.83, (a2) 7.75, (b) 1.27 for the yellow and 4.67 for the green. The drawn answer's fill,
  `--terra` `#fb8469`, gives 2.44 / 2.26 and cannot be a state. A darker yellow that passes, `#8a6d00` (4.92 on white), reads
  olive and is banned too (hue 47.4). Gate rule: neutrals, terracotta hue 0 to 25, the ink ladder 25 to 45 at low saturation
  (`scripts/verify_palette_membership.mjs:104-164`).
- Colour vision: (a)'s neutrals do not move under the protan or deutan simulation. In (b) dark green and red become `#605519`
  and `#5b5226` for a protan reader, delta E 8.3 against 96.2 for normal vision; green against red falls from 100.8 to 18.9
  (protan) and 16.2 (deutan). About 8% of European men and 0.5% of women have a red-green deficiency, red does not read as
  danger to them, and same-lightness red and green are the hard pair (https://www.datawrapper.de/blog/colorblindness-part1/).
- **What (a) does to terracotta:** nothing. It keeps the drawn answer (`--terra`, `globals.css:2772`, `--chart-1` at :2683) and
  the accent text (`--terra-text`, `globals.css:2777`; three a page, MODEL.md:248), and the judgment lives in ink.
- **What (a2) does:** terracotta gains "worst", the opposite of the standing "kept/positive = TERRACOTTA"
  (`docs/handoff/2026-06-23-session-handoff.md:62`), of band_tone's best step (`band_tone.ts:23-30`) and of `--pos`, "above par"
  (`globals.css:1037`). The page's answer, 40px in `#991600` (MODEL.md:150), would share its colour with "very poor".
- **What (b) does:** it needs his ruling to reverse "No exceptions" (`verify_palette_membership.mjs:7-9`; GUIDELINES.md:54) and
  a named allowlist in that gate, never a raised baseline (website CLAUDE.md). Its reds sit inside terracotta's own hue band,
  so "very poor" and "the answer" read as one family, and a saturated green would outshout the page's three accents
  (GUIDELINES.md:58). Precedent: his references of 2026-09-10 were blue, purple and green, and "STRUCTURE ports while COLOUR does not"
  (`E:/atlas/rules/FOUNDER-VERDICTS.md:1026-1029`). Scope if he chooses it: one component, five tokens declared once, the glyph's
  fill only (never text, a bar, a row tint or a chart), a GUIDELINES 0.2 line and the allowlist naming that one file.

### 1.5 Recommendation (his decision)

Variant (a), pure ink. It passes every gate today, survives every colour-vision type by construction, holds 5.8:1 or more on
every ground where 3:1 is asked, satisfies 1.4.1 by shape and word, and leaves terracotta's meaning untouched. Its cost: no
instant traffic-light read, so the angle is learnt from the word and the key line. If he wants an alarm on the worst state,
(a2) is a smaller step than (b), but it inverts the site's terracotta-is-positive convention.

## 2. Disclosure inside a section ("click to explore more")

### 2.1 What the rules allow and refuse

- Wanted: his plus, "the person clicks a plus and some more info appears" (2026-09-08, `DetailPanel.tsx:5-9`); clause 58, a
  section with several parts reveals them on a click (MODEL.md:1001); clause 60, a lone figure carries its fields behind the
  plus (MODEL.md:1006).
- Native `<details>`/`<summary>` is the ratified exception: it works server-rendered and with script off (`kit.tsx:9-11`).
- Refused: pop-up, modal, drawer, toast, carousel, loader, filter chip, pagination (his answer of 2026-09-22, interview 22,
  `docs/superpowers/plans/2026-10-05-masterplan/01-PROTOCOL.md:61`). The brief places this list in PART 9; it is not there, and
  clause 58 still names "a pop-up". The one pop-up kept is the "?" gloss, one a card (`kit.tsx:1173-1182`).
- Never a drawing behind a disclosure: "Disclosures exist only to move BULLET TEXT out of the first view" (`kit.tsx:1013-1020`;
  `interact/Switch.tsx:7-9`); DetailPanel takes rows, not children (`DetailPanel.tsx:12-18`).
- Never a section's main rows folded: tried on the fact rows on 2026-10-04 and withdrawn that day (MODEL.md:1041).
- Live tensions: CardPager still pages a city's neighbourhoods past four cards (`CardPager.tsx:3-5, 37`;
  `city/city-view.tsx:725`), against the pagination refusal; InlineDisclosure's summary turns terracotta on hover and its plus
  when open (`kit.tsx:1049`), against "terracotta never on a hover state" (MODEL.md:260; GUIDELINES.md:62).

### 2.2 What exists on `main`

| Pattern | Component | Where | Without script | Browser checks, closed |
|---|---|---|---|---|
| Rows behind a plus | `DetailPanel` over `InlineDisclosure` (native details) | 12 seats, e.g. `HeroBoard.tsx:111`, `cell/turn-one.tsx:146`, `country-view.tsx:798, 903, 920`, `city/premises.tsx:81`, `industry/turn-one.tsx:119`, `MarkList.tsx:489` | works | skipped by most; opened by two (2.3) |
| "N more" run | `DatedChanges` over `InlineDisclosure` | `DatedChanges.tsx:83-89` | works | skipped by most; read by the copy walk only |
| Expandable rows | `TiersTable`, `<button aria-expanded>`, prose only | `TiersTable.tsx:17-22, 38-41` | closed rows only | n/a |
| Views | `Switch`, WAI tabs, 2 to 4 views | `country-view.tsx:1122` | first view whole | first view |
| Row readout | `Marks` on tap, hover or focus | `HeroBoard.tsx:142-147` | key line stays | n/a |
| Gloss | `InfoTip`, one "?" a card | `kit.tsx:1173-1182` | n/a | n/a |
| Pager | `CardPager` | `city-view.tsx:725` | n/a | n/a |

### 2.3 One pattern for the site: the answer fold

- **Closed:** one row that reads like the rows above it: the label (14, Geist, ink2), the section's answer in its column (a
  `Fig` at 14 in ink, or a word if the section answers in words), the plus at the row's end as TiersTable draws it
  (`TiersTable.tsx:95-104`), not at the start as InlineDisclosure does. The answer is what the rows explain: their total,
  their count or their largest part. Closed on arrival (`DetailPanel.tsx:19-20`).
- **Open:** 2 to 8 rows under it, label and figure, one answer type, the unit said once; the plus turns to a cross; no drawing,
  no fold inside a fold. Two levels at most, and the trigger's words must say what is behind it
  (https://www.nngroup.com/articles/progressive-disclosure/). Hide only what some readers need
  (https://design-system.service.gov.uk/components/details/).
- **Accessibility:** native details, so Enter and Space toggle with no script. The summary's text is its accessible name, so it
  must hold the answer ("Licence fees, $X"). The plus is `aria-hidden` (TiersTable's is, `TiersTable.tsx:102`; InlineDisclosure's
  is not, `kit.tsx:1049`). A `name` unique per section, so panels never close each other (`DetailPanel.tsx:57-66`). No link
  styling: GOV.UK found some users avoid the control fearing it leaves the page, and some voice-control users must call it a
  button (https://design-system.service.gov.uk/components/details/).
- **Phone:** the whole summary row is the target, 44px at least (`DetailPanel.tsx:37-50`); it opens in place with no scroll
  jump, closed by default (https://www.nngroup.com/articles/mobile-accordions/); rows take PART 5's `[1fr auto]` under 420px
  (MODEL.md:177); 8 rows at most keeps the open panel near one screen.
- **Static render:** the closed rows are in the server HTML, so text gates and search read them.
- **Browser checks:** these skip what a closed details hides: `check_model_laws.mjs:399-418`, `check_page_holes.mjs:149-157`,
  `check_page_laws.mjs:147`, `probe_page.mjs:31-32`, `verify_art_direction.mjs:59`, `verify_full_width_sitewide.mjs:149`,
  `verify_gathered_emptiness.mjs:136`. Two open it: the opened pass in `check_archetypes.mjs:582-635`, keyed on
  `[data-archetype='detail-panel']`, and the word walk in `check_copy_plain.mjs:136-141`.
- **To keep the fold measured:** keep the `detail-panel` stamp and `data-rows`; put the answer in the summary, where closed-state
  checks see it; stamp `data-col` on the summary's figure and each row's figure, since UNIT MIX reads `[data-col]` only
  (`check_model_laws.mjs:649-708`); add FOLD ANSWER (a summary without its answer is red) and FOLD ROWS (2 to 8) to
  `check_archetypes.mjs`.

## 3. One answer type per section

**The rule.** A section's answers are all figures, or all words, or all levels; a list never alternates. Half of it is already
law: no bare word where a figure belongs (MODEL.md:183, 199), and a zero prints "$0" in a column of figures (`copy.ts:77-80`).
It is checked only on cells stamped `data-col` (`check_model_laws.mjs:649-708`): CompareTable, TiersTable and two sections.
FactRows, KvGrid, DetailPanel and the hero board carry no stamp, so their mixes pass. FactRows and DetailPanel also set every
value in the figure face (`FactRows.tsx:87`; `DetailPanel.tsx:83`), so "Capped" wears Space Grotesk like "15 years", while
PART 4 keeps that face for figures (MODEL.md:134).

| Section (page) | Values, in order | Source |
|---|---|---|
| If it fails (UK country) | "Can be sold", "Under £X", "£X", "N months", "Capped" or "No cap", "N to N years", "Survives", "N%" | `src/lib/spine/sections/if_it_fails.ts:45-62`; `country/IfItFails.tsx:26` |
| Lease by law (UK country) | "By law", "N days' warning", "N to N months", "N years", "N x rateable value", "N months or less", "Over N years", "Capped", "N% if opted" | `sections/lease_by_law.ts:93-114`; `country/LeaseByLaw.tsx:29` |
| Hero board (every country) | five figures, then "Easy", "Moderate" or "Hard" with no mark | `hero_board.ts:188-191`; `copy.ts:352`; string-valued in 198 of 198 shards, 1 a placeholder |
| Entry bill's plus (country) | the legal form's name, "Free" or "$X", "N days", "N of 5" | `src/lib/spine/entry_bill_rows.ts:204-214` |
| Living costs (city, Belgrade and Richmond) | figures, then "Free" for transit | `src/lib/spine/fact_rows.ts:42-44, 177-179` |
| Built, drawn nowhere today | Getting paid: "N%", "N days", "Yes" or "No", "Quick" to "Slow"; legal and admin: "$X", "N hours", "N months", "Limited" | `country_depth_rows.ts:174-215`; their fields sit in GB's shard alone, and GB takes the sourced cards (`country-view.tsx:1105-1112, 1737`) |

**How each type looks, so the eye never switches mid-list.**
- **Figure:** `.fig`, Space Grotesk 600, tabular lining, ink, 16 in fact rows and 14 in tables, in the figure column; the unit
  once, in the head or at 12 muted 2px after; a zero is "$0"; never a word in this column.
- **Word:** Geist 500 at 14, ink, sentence case, left-aligned, one to three words, never `.fig`. A yes-or-no pair takes the
  StateMark tick or cross before its word (`forms-v2.tsx:435-447`), in a list of words only.
- **Level:** the triangle, or the three bars where direction is `none`, with its word, in a level column, never in the figure
  column.
- **A section with both** (the UK legal sections): two lists under one title, figures then rules, each one type. FactRows
  already draws two lists from 600px, split by halves (`FactRows.tsx:52-56`); split them by type instead.
- **Check:** each section declares `data-answer-type`; its value cells carry `data-col`; UNIT MIX's word test extends to
  FactRows, KvGrid, DetailPanel and the hero board.

## 4. Section icons

**Today.** The opener is the Rail's `Ico`: a 28px circle, `--terra-soft` ground and `--terra-border` ring, an 18px glyph at
stroke 2.4 (1.35px drawn) in `#991600` (`kit.tsx:86-97, 1143-1144`), beside a 20px title on 28px lines on a band
(`globals.css:1399-1405`) or 16px in a kept card (`kit.tsx:1156-1171`). The same tile stands inside sections: `FactRows.tsx:70`,
`KvGrid.tsx:179, 182`, `HeroBoard.tsx:148`, `WorldRange.tsx:102`, `BarList.tsx:50`, `NoteList.tsx:73`, `StockTiers.tsx:75`,
`Thresholds.tsx:45`, `LocalApps.tsx:52`. /gb draws 105 terracotta tiles for 30 sections, London 33 for 16
(`E:/atlas/docs/superpowers/research/2026-10-12-design-goals/R1-rhythm.md:41, 53`). Two UK sections repeat the opener's glyph
inside: the lease (`LeaseByLaw.tsx:27` and `lease_by_law.ts:117, 120`, `commercial-rent`) and getting paid
(`country-view.tsx:762` and :757, `payments`). The documents disagree: MODEL.md:260 and :280 say ink tile and no terracotta on
an icon stroke; his ruling of 2026-09-19, "Terracotta belongs in every section, and first at the icons; the icons are too small
and do not carry" (`E:/atlas/rules/FOUNDER-VERDICTS.md:1142`), is newer and the kit follows it (`kit.tsx:1143`).

**Proposal: the opener glyph.**
- **Family:** Atlas Modern (`src/components/brand/icons/atlas-icons-data.ts:1-8`): 122 glyphs in nine groups, drawn on a
  32-unit grid with one accent part each. No glyph has a simplified body (`atlas-icons-data.ts:157-158`), so every size draws
  the same drawing.
- **Size:** 32px on a band, the family's native grid, one unit a pixel: 1.6 times the 20px title, the step PART 4 asks between
  a card's text sizes (MODEL.md:167). 24px in a kept card, a step AtlasIcon already sanctions (`AtlasIcon.tsx:20`).
- **Stroke:** 1.75 on the grid, drawn at 1.75px, a third heavier than the rows' 1.35px.
- **Ground:** none: no tile, no ring, no fill.
- **Colour:** the whole glyph in `--terra-text`, 8.50:1 on white and 7.86 on the tint, which keeps his 2026-09-19 ruling.
  Alternative: ink lines with the family's one accent in terracotta. The accent was muted because 2 to 5 pixels of it read as
  a smudge at 14px (`globals.css:643-659`); at 32px it is a shape.
- **Relation to the title:** left of it, centred on the title's first 28px line, 12px apart (a ladder value,
  `E:/atlas/design/loop/build/briefs/DISTANCES.md:63-65`; its "icon to words: 4" at :94 is for small icons and needs a line).
  A wrapped title hangs under itself, never under the glyph (a `32px 1fr` grid). On a 375 phone the title keeps 299px.
- **Distinct from every icon inside:** rows move to the `Ico`'s existing ink tone (`kit.tsx:91-94`: `--c-soft` ground, ink2
  glyph) or drop their glyph where the label already names the row. The two then differ in size (32 against 18), ground (none
  against a tile), colour (terracotta against grey) and identity: the opener's id may appear in no row of its section. /gb
  falls from 105 terracotta marks to about 30, one a section.
- **Gate, static:** the Rail stamps `data-opener-icon`, the `Ico` stamps `data-icon` and its tone; a chain check reds a row
  glyph equal to its section's opener, a terracotta row tile, or an opener in a tile. It reads server HTML, so it also runs on
  Vercel, where the browser gates skip (website CLAUDE.md).

## 5. Digestibility at large: ten rules for a phone-first data page

| Rule | Source | The site today |
|---|---|---|
| 1. Overview first, then zoom and filter, then details on demand: the answer leads, its breakdown waits | https://ourworldindata.org/redesigning-from-one-to-two-columns | One focal 30 a section (MODEL.md:246) and the plus at the foot; but no answer says whether it is good (section 1) |
| 2. Write for the scan: 79% of users scan and 16% read word by word; plain headings, keywords, one idea a block | https://www.nngroup.com/articles/how-users-read-on-the-web/ | Labels of 3 words, titles of 4 (MODEL.md:175, 280); /gb still holds 1,601 words over 30 sections (R1-rhythm.md:41, 46) |
| 3. Cut the words by half: concise, scannable and neutral text tested 124% more usable | same NN/g article | One helping line of 12 words (MODEL.md:1016); words a section average 53 on /gb, 125 on the lease (R1-rhythm.md:47) |
| 4. Hide only what some readers need, never what most need | https://design-system.service.gov.uk/components/details/ ; https://design-system.service.gov.uk/components/accordion/ | Kept: a section's rows never fold (MODEL.md:1041) |
| 5. Two levels at most, and the trigger says what is behind it | https://www.nngroup.com/articles/progressive-disclosure/ | One level; summaries are labels, not answers ("The other taxes", `copy.ts:354`) |
| 6. Folds closed on arrival, opened in place, no jump | https://www.nngroup.com/articles/mobile-accordions/ | Kept (`DetailPanel.tsx:19-20`, native details) |
| 7. A status combines at least three of colour, shape, symbol and text; colour never carries it alone | https://carbondesignsystem.com/patterns/status-indicator-pattern/ ; https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html | The table tick: tick, weight, underline (`CompareTable.tsx:253-260`); the level mark's word is in aria-label and title only (`HeroBoard.tsx:182-190`) |
| 8. A mark needed to read the figure holds 3:1 on its ground, and avoids thin lines | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | The level mark's and paperwork dots' empty steps are `--c-soft2`, 1.19:1 on white and 1.10 on the tint (`HeroBoard.tsx:188`; `TiersTable.tsx:87-91`), so "one of three" reads as one short bar |
| 9. Pick the form by the relationship (deviation, ranking, distribution...); good or bad is a deviation from a reference | https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary | World tracks show the spread and the rank (`WorldRange.tsx:38-47`); no form shows a judgment, and medians left the tracks (MODEL.md:1064) |
| 10. Never red against green alone: same-lightness pairs collapse for about 8% of men | https://www.datawrapper.de/blog/colorblindness-part1/ | No green today (GUIDELINES.md:54); variant (b) would bring the pair back |

Also: Excel's icon sets sort values into three to five classes by threshold, reversible so the first icon means the lower values
(https://support.microsoft.com/en-us/office/use-conditional-formatting-to-highlight-information-fed60dfa-1d3f-4e13-9ecb-f1951ff89d7f),
the triangle's fifths and its `min` direction; GOV.UK writes accordion headings like short button text, as the fold's summary.

## 6. What he decides, in order

(1) Whether directed indicators now carry a judgment (1.3). (2) Variant (a), (a2) or (b), and the five words (1.3, 1.4). (3) Up
for better and his left sweep, given the change-arrow and dropdown readings (1.3). (4) The answer fold, and the CardPager's pages
(2). (5) Figures and rules split in the UK legal sections; the hiring word (3). (6) Opener colour; grey row tiles (4).

## Sources

NN/g: https://www.nngroup.com/articles/progressive-disclosure/ , https://www.nngroup.com/articles/mobile-accordions/ ,
https://www.nngroup.com/articles/how-users-read-on-the-web/ . GOV.UK: https://design-system.service.gov.uk/components/details/ ,
https://design-system.service.gov.uk/components/accordion/ . W3C: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html ,
https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html . FT: https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary .
OWID: https://ourworldindata.org/redesigning-from-one-to-two-columns . Carbon: https://carbondesignsystem.com/patterns/status-indicator-pattern/ .
Datawrapper: https://www.datawrapper.de/blog/colorblindness-part1/ . Microsoft: the conditional-formatting page cited in section 5.
The Economist's "Mistakes, we've drawn a few" could not be fetched (medium.economist.com refused) and is not used.
