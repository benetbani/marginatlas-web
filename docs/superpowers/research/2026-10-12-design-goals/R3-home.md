# R3: the home, from introduction to catalog (2026-10-12)

Read only. Website repo at c35e42a7 (branch truth-fixes, the main the brief names); design repo read where cited. No build, browser,
network or install. Free memory read 758 MB, under the 1,000 MB floor, so no Node probe ran: counts are grep and perl over files.

Blind spots, stated first:
- Words and figures come from the newest render's `<main>` with tags stripped (`website/scratchpad/harness/pages/home-gb.html`,
  2026-10-12 07:29). This cannot tell visible text from screen-reader text (the city rows' "a year" is spoken only), so word counts
  run a few high. The harness renders the body without SiteChrome (handoff 2026-10-11:243-244).
- Heights come from `website/scratchpad/home-reform/shots/p16-home-1280.jpeg` and `-375.jpeg` (the built page from `next start`,
  2026-10-11 06:02; home-critique-4.md:9-10), read by eye on a downscale: plus or minus 15px a zone. The 07:29 render holds the same
  five zones and words, so the frame still shows the page.
- Index pages: `website/scratchpad/r3d/world_after-top-1280.jpeg` and `industries_after-top-1280.jpeg` (2026-10-12 01:52) and their code.

On disk, newest first: harness `home-gb.html` (10-12 07:29); shots `final-thin-foot-{375,1280}`, `final-toggle-focus-375` (10-11 09:43);
`f3-*`, `f3b-*` foot and ask crops (10-11 08:53 to 09:15); `f2-p24-strip-home-{375,1280}` (10-11 07:37); **`p16-home-{375,768,1024,1280}`,
the only whole-page frames** (10-11 06:02); `d1-p12-home-bar-*`, `d1-p13-home-top-*` (10-10 22:22 to 22:30); `t5-band-*`, `t6-*`
(10-10 14:35 to 14:52); harness `d1-`, `d2-`, `f1-`, `f2-`, `p3-` home renders (10-10 22:15 to 10-11 07:37).

## 1. The home today, top to bottom

`NEXT_PUBLIC_HOME_REFORM` defaults on (src/lib/feature_flags.ts:139-141), so `/` draws SpineHomeBody (src/app/page.tsx:266-275;
src/components/spine/home/home-view.tsx:110-147). Five zones; a sixth, Pro, only while the paywall is on (home-view.tsx:121).

| # | Zone (file) | Job | Visual weight | Figures | Words | Height at 1280 | Kind |
|---|---|---|---|---|---|---|---|
| 1 | Search (home-view.tsx:74-90) | ask his question, take the case, say what the site is | hero: h1 at 60px on two set lines, two red words fading in place, a white picker card with an ink button, the Try line, the definition | 0 | 37 | ~490px, 19% | instrument |
| 2 | Worked example (HomeExample.tsx:78-120) | answer the picker's case in four steps | story: two halves; $740K at 40 in the text red (loud seat 1), a log strip, 100 units with 32 lit | 7 (+2 ticks); 2 drawings | 90 | ~546px, 22% | show-off |
| 2b | Pro (ProBand.tsx:23-45) | the price, once | a 2-1 card with an ink button | 2 | | absent: paywall off | sell |
| 3 | Proofs (HomeProofs.tsx:68-132) | what the site reads, keeps, works out | board: three boxed cards, each a 30 figure, a drawing (ring, month columns, stacked bar), fact rows | 11 (+5 in notes); 3 drawings | 104 | ~513px, 20% | show-off (method) |
| 4 | Read from the record (HomeRecord.tsx:69-98) | the site's own counts | full-bleed terracotta, four counts at 30 behind rules (loud seat 2) | 4 (two "of 138") | 39 | ~243px, 10% | show-off (stats) |
| 5 | Foot (home-view.tsx:100-108, 124; WhereNext.tsx) | the doors | two lists on a 56px pitch: 7 UK cities as grey photo rows with typical pay and an "All UK cities" box; 8 text doors | 7 | 67 | ~620px, 25% | catalog |
| | Under the zones (home-view.tsx:143-144) | licence, sources, Report a mistake, "Checked 6 October 2026" | two 12px muted lines | 1 date | 21 | ~107px, 4% | imprint |

Then the newsletter bar and the black footer (src/components/SiteChrome.tsx:194, 213-285). Percentages are of the body (hero to foot lines).

Totals: about 29 figures, 5 drawings, 7 thumbnails, about 358 words and 27 links in `<main>`. **Split: show-off 3 zones and 52% of
the height (example, proofs, band); catalog 1 zone and 25% (the foot); the hero 19%.** The loud-seat ledger agrees: pays LIT,
record FIELD, foot "NO HONEST CANDIDATE" (home-view.tsx:61-65).

Where the catalog sits: "Every country", "Every city" and "Every trade" are 14px ink2 rows (src/lib/spine/door_look.ts:19;
WhereNext.tsx:26), the quietest type on the foot beside 20px city names (CityRows.tsx:115), at about y 2,076 of a 3,138px page at
1280, under three show-off zones. At 375 the cities begin about y 3,400 of 5,264.

How it got here: on 2026-10-09 he called the earlier home "here is what we have", a run of unrelated data sections (home-view.tsx:4-5;
spec 2026-10-09-home-introduction-design.md:12, 32). The introduction plan answered with one case, three proofs and a quiet foot, and
the critique loop ended at 93/100 with a keep list (home-critique-4.md:37, 235-257). The new brief moves weight back to the doors.
Two of his earlier words bound it: a catalog that "should not be slammed like a list of elements" (2026-08-09, src/app/page.tsx:468-470),
and not "here is what we have".

## 2. What a catalog home can index

| Shelf | What exists (the code's own list) | Index page | On the home today |
|---|---|---|---|
| Countries | 195 country pages (HELD_COUNTRIES, src/lib/nav.ts:97-105, held equal to COUNTRIES); /world prints 94 "Countries with figures" (src/app/world/page.tsx:202-206, the r3d shot) | /countries: a folded card per continent, North America and Europe open, flag and name only ((site)/countries/page.tsx:10-13); /world: a ledger, then regions | door "Every country" (src/lib/home/next_doors.ts:18); masthead; /world not linked |
| Cities | 252 (data/cities/city_list_v1.json; (site)/cities/page.tsx:31); 7 UK cities rebuilt | /cities: map, 12 metro cards, a region link grid | 7 photo rows and "All UK cities" (home-view.tsx:100-108); door "Every city"; masthead |
| Trades | 138 live trade pages (src/lib/taxonomy.ts:208; tests/home/site_counts.test.ts:51); /industries prints 128 in 20 sectors (src/app/industries/page.tsx:92-103) | /industries: a ledger, then sector columns | door "Every trade"; masthead "Trades"; the Try line (gyms, salons, cafés in London) |
| Tools | 3 on /tools: Decide, Check, Calculator ((site)/tools/page.tsx:4-6); Compare kept off the hub (:10-12); /you | /tools | masthead "Tools", "Compare"; Calculator in the footer |
| Reading | 54 learn articles in three tracks (src/lib/learn/articles.ts, families 20, 19, 15; (site)/learn/page.tsx:13-15); 10 blog posts (content/blog/) | /learn, /blog | door "From the blog". **/learn is linked nowhere in the chrome or the home**: the footer's "Learn" column omits it (SiteChrome.tsx:248-256) |
| Method, trust | /about-data (#reading, #sources, #archive, #failures), /methodology/key-benchmarks, /faq, /coverage, /corrections, /status, /data, /about | | proofs and band to /about-data anchors (src/lib/home/proofs.ts:69, 95; HomeRecord.tsx:82); doors "About the figures", "Free UK data"; the rest footer only |
| Openings, extremes | /new-businesses (noindex), /extremes | | a door; masthead "Extremes" |

Parts already built that a catalog needs: CityRows (photo rows with a figure and an "All" cell), WhereNext (door rows), FactRows
(label, value, note under hairlines: the spine's form of the index pages' ledger), CountryFlag at one fixed width (GUIDELINES.md:133-134),
a pictogram crosswalk that gives every trade a mark, falling back to a storefront (src/lib/brand/industry_pictogram.ts:4-12, 127),
the Atlas icon family, and the kit's muted chapter index (src/components/spine/kit.tsx:481-502).

What binds any catalog direction:
- **No country, city or trade-list count on the home**: his 2026-10-07 ruling, after the picker's "195 COUNTRIES / 128 ACTIVITIES"
  counter, which he called wrong because global coverage is not built (memory `feedback_2026-10-07_stop_questions_countries_home.md`,
  `project_2026-10-08_home_sections.md`); next_doors.ts:7, site_counts.ts:7-8, handoff 2026-10-11:81-83, 257. Shelves show members
  and doors, never a total.
- The totals already disagree across pages: trades 138 (the home's band), 128 (/industries, "Trades with a page"), 78 (/world, "Trades
  mapped across them", world/page.tsx:209-213); countries 195 (/countries) against 94 (/world). If he lifts the ruling, one builder per
  total comes first.
- /countries: never all 195 at once, North America then Europe, flag and name, nothing else (countries/page.tsx:10-13).
- Trades are rows with their own figure, never wrapped chips; a row that navigates carries an arrow (MODEL.md PART 9, items 21 and 23,
  lines 958, 960); no two adjacent sections share a form (MODEL.md:598).
- No carousel, pager, modal, drawer, toast, loader or filter chip (spec 2026-10-09:185); full width for the hero and the band only, three
  loud seats at most, two quiet cards between loud ones (handoff 2026-10-11:81-82, 248-250; GUIDELINES.md:63); no eyebrow above a title
  (gate no-eyebrow, scripts/prebuild_all.ts:994; kit.tsx:487-489); headings of four words, labels of three (handoff:252); no "we" (PRODUCT.md:68).
- tests/trust/home_shape.test.ts holds the zone order and LOUD_SEATS the seats (home-view.tsx:24, 61-65): any reorder edits both.

## 3. Established-business cues: what exists, what the home uses

| Cue | Exists, where | On the home |
|---|---|---|
| Mark and wordmark | compass rose in a circle (src/components/brand/LogoMark.tsx:2); "Margin" ink, "Atlas" #e62200 (LogoWordmark.tsx:2-3) | yes: masthead at 40 (SiteChrome.tsx:113-120), footer at 22 (:216). No logo in structured data: the mark is under the 112px one needs (src/components/StructuredData.tsx:298) |
| Method, source note | licence line and "Sources and licences" (src/components/spine/SourcesFoot.tsx); each step's line says how its figure was made (src/lib/spine/copy.ts:2838-2844); "See every source" (HomeRecord.tsx:81-86) | yes |
| "About the figures" | door (next_doors.ts:23), footer Learn (SiteChrome.tsx:251), phone sheet (nav.ts:85-88) | yes |
| Dates | "Checked 6 October 2026" (home-view.tsx:144), "counted in October 2026", "Greater London, March 2026", "October 2025 to September 2026" | yes, scattered, 12px at the foot. A dateline in the bar was declined on purpose: his ruling puts the date at the foot (home-critique.md:441-442) |
| Coverage counts | the band's four evidence counts with denominators (src/lib/home/site_counts.ts) | yes: the only counts his ruling allows |
| Press, usage, testimonials, client logos | **none in source**: the one quote-shaped block (src/components/kit/blocks/OperatorVoices.tsx) is imported by nothing; PRODUCT.md:80, 85 refuse "trusted by" walls and "as seen in" strips | no, and none can be added honestly |
| The maker | /about: "Margin Atlas is made by Benet Bani." ((site)/about/page.tsx:23); PRODUCT.md:89, 121: no byline, no human name as the site's voice | footer "Who runs this" only; keep it there (home-critique.md:458) |
| Trust pages | /corrections, a dated log whose first state is "No corrections yet" ((site)/corrections/page.tsx:1-4); /status ((site)/status/page.tsx:2); /coverage; /faq; /data | footer only (SiteChrome.tsx:248-276) |
| Footer depth | wordmark, four columns, 20 links, "© 2026 Margin Atlas", "Covering small businesses worldwide · free to browse" (SiteChrome.tsx:213-285) | yes; its "Learn" column has no /learn |
| Iconography | Atlas Modern icons, 122 ids, one terracotta accent each (src/components/brand/icons/atlas-icons-data.ts:1-8); 64 trade pictograms (pictograms/atlas-pictograms-data.ts:2) with the crosswalk above, drawn on /industries/[industry] only ((site)/industries/[industry]/page.tsx:357, 477); 12 editorial spots (spots/atlas-spots-data.ts:2); 220 spine2 glyphs (src/components/spine2/glyphs.ts:7); flags | six 28px terracotta circles on section titles (kit.tsx:86-91, 1143-1144); no pictogram, no flag, no spot; the 8 doors and "All UK cities" carry no mark. Two icon families are live: Atlas icons on the home, spine2 glyphs on the index ledgers (world/page.tsx:198; industries/page.tsx:91) |
| Number styling | Space Grotesk, tabular lining numerals, weight 600 on every figure (src/app/globals.css:1100-1105; GUIDELINES.md:42) | yes |
| Rules and rows | hairline fact rows; the column head "Typical pay" (copy.ts:2747) | yes |
| Ledger panel | /world "How far the map goes" (world/page.tsx:196-214), /industries "What is in here" (industries/page.tsx:92-103): an icon head, hairline rows, right-aligned tabular figures, a short note a row | **no** |
| Section index | Movement prints a muted index before a chapter's h2 (kit.tsx:481-502), as the UK pages number chapters | **no** (only the worked example's steps 1 to 4) |
| Kickers above titles | banned site-wide (no-eyebrow) | correctly absent: do not add |

The five strongest gaps, all from parts the site owns: (1) catalog marks, pictograms and flags, on bare text doors; (2) shelves for
the inventory above the second screen, with /learn linked at all; (3) the ledger panel; (4) a ruled colophon that gathers what now sits
in 12px lines and the footer: sources link, licence, corrections log, status, the dated check (links only: no agency names, PRODUCT.md:117;
no byline; no press); (5) a muted section index and one row anatomy (mark, name, figure, arrow) for every list on the page.

## 4. Three directions

**A. The shelves: catalog first, two show-off seats.** Hero kept whole (his h1, the picker, the definition). Then two levels of
shelves, 1-1 even. Level one: "The UK's cities" (the seven photo rows and "All UK cities", as built) beside "UK trades" (eight rows
on the same 56px pitch: the trade's pictogram, its name, London's typical yearly sales from the builder the London pages use, an arrow;
last row "Every trade"). Level two: "Countries" (flag and name rows, North America then Europe, last row "Every country", his /countries
form) beside "Tools and reading" (Decide, Check, Calculator, Compare as icon rows, then the three learn tracks and the newest posts with
dates). Then one answer level: "Does it pay?" ($740K at 40 and its 100 units, the door to /gb/london/restaurants) beside a quiet method
card of the three proofs' figures as fact rows with their doors (31,926 notices matched, 12 months kept, 18% tax). Then the band,
unchanged, then the colophon. Keeps: hero, city rows, step 3, the band, the proofs' figures and doors, the foot lines. Cuts: steps 1, 2
and 4 with the log strip (kept on the London page), the three proof drawings (kept on /about-data, where the doors lead), Where to next
as its own list (its doors end each shelf). Cues: one row anatomy, pictograms and flags as the marks, a muted index 01 to 04 on the
shelves, the colophon. Watch: adjacent shelves share the row form (MODEL.md:598), so vary the mark and the figure's place; pick the eight
trades by a stated rule from the 111 that print a sales figure; no "we" in the method card's title.

**B. The contents page: an atlas's table of contents, one show-off seat.** Hero kept. Then two levels of three numbered departments,
1-1-1 even: 01 Countries, 02 Cities, 03 Trades, then 04 Tools, 05 Reading, 06 The method. Each department: its mark (three flags, three
grey city thumbnails, three trade pictograms, an Atlas icon for the last three), a title of four words or fewer, one plain line on what is
inside, three member rows and an "All" door. Then the band, the page's only show-off, then the colophon. Keeps: hero, band, foot lines,
the city photographs (three inside 02), every current door (as a department or a member). Cuts: the worked example and the proofs as
sections; the picker still opens on the London restaurant case, one click from its answer, and the method is department 06's door.
Cues: the strongest institutional front page of the three, every shelf inside the first two screens at 1280, the shortest page.
Watch: it undoes the concept introduction he approved on 2026-10-09 (spec:5-9); six equal blocks are the "list of elements" he warned
against unless marks and member rows carry the weight; the page laws (FOCAL, NO LEAD, no blank in a card; GUIDELINES.md:44-45, 73-74)
decide whether a department is a boxed card with one honest figure at 30 or an open list like today's foot.

**C. The introduction kept, the catalog raised, the stamps added: the smallest step.** Hero, then the worked example whole (seat 1),
then the foot's two lists moved up to third and dressed: each of the eight doors takes a mark (the UK's flag on "The United Kingdom", an
Atlas icon or pictogram on the rest), the door names rise toward the city names' weight, and "Where new businesses open" (a noindex page)
gives its slot to Tools or the knowledge base, which no page of the chrome links. Then the band (seat 2), then the proofs, quiet, as the
close for the curious (or folded into one fact-row card), then the colophon, with the muted index on every zone. Keeps: nearly the whole
keep list of critique pass 4 (home-critique-4.md:235-257). Cuts: one door, and the proofs' height if folded. Cues: marks, index, colophon,
door weight. Watch: two quiet cards must still stand between seat 1 and the band (GUIDELINES.md:63), which the cities' box alone does not
make; home_shape and LOUD_SEATS change (seat 3 leaves the foot); it may read as the same page reordered.

Fit to his words: A answers "a catalog, show-off only in a few places" most directly; B is the boldest and most institutional but
reverses the 2026-10-09 introduction; C keeps the 93/100 work and adds the cues. None needs new data; each needs his word before a build.
