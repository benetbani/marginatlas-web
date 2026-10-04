# R4. Context and gold nuggets: published patterns, mapped onto the United Kingdom page

Research note, 2026-10-04. Read-only: no project source file was edited. Written for whoever designs the next round of the UK country page.

---

## 0. The short version

### The diagnosis (judgement)

The UK page already carries context of ONE kind: where the UK sits among countries. The world track draws a marker, the middle half of countries shaded and the median ticked and named (`src/components/spine/charts/WorldRange.tsx`); the placement line prints "Higher than {n} countries in ten." (`src/lib/spine/placement.ts`); the peer table sets the best value in a column in bold (MODEL.md PART 5). All of that is world-statistical, and it looks identical on 195 pages. That is why the page can be full of numbers and still read "blank and stale": every card says *where on the ruler*, none says *what is going on in this country*.

Four kinds of context are missing, every one of them specific to the UK, and none of them needs a sentence:

1. **Time**: what the figure was, what it will be, and the country's own record. (Before February 2026 the online incorporation fee was £50; from 1 January 2027 unfair dismissal protection starts after 6 months, not 2 years.)
2. **Rules**: the thresholds, minimums, deadlines and penalties that sit behind a figure. (Employer's liability cover of at least £5 million; £2,500 a day if uninsured.)
3. **Named peers**: the three or four countries a reader actually weighs the UK against, drawn on the same track.
4. **The reader's own units**: the figure in pounds, in hours of the minimum wage, in working days, as "38 of every 100".

### Where context may enter a card (the site's own rules, applied)

Only three places:

- **A mark on the drawing**: a tick, a hollow dot, a hairline, an outline, a label of one to three words.
- **The foot's one companion figure** (MODEL.md PART 7: "a coverage statement or one companion figure"). One per card, so each section below names which pattern gets the foot.
- **Label and figure rows behind the plus** (PART 9 clause 60: a figure carries the fields the file holds around it behind his plus).

Never as a sentence (clause 12), a row written as a sentence (clause 13), a multiple, percent difference or signed difference (clause 15), a named holder of a track's end (clause 4), a second placement wording (clause 37), a third use of one kind of drawing (clause 55) or two of a kind close together (clause 64). Context marks are greys (`--c-ink2`, `--c-soft2`), never terracotta, so the page's three accent seats are untouched.

### The five strongest patterns for this page (judgement, argued in section 1)

1. **P9 + P13, dated change ("Before {date}" / "From {date}")**. The most country-specific nugget available, often news a founder can act on, and printed as absolutes so clause 15 is met.
2. **P20 + P21, the plus as a fact sheet with harm anchors**. Thresholds, deadlines and penalties as label and figure rows: the "details" he asked for, in his own plus.
3. **P1 + P2, a domestic reference tick and named peer ticks on the existing tracks**. The bullet graph's comparative measure: the central bank rate on borrowing, the two statutory rates on tax, the table's own peers on every track.
4. **P3, every country as a hairline on the world track**. Turns the placement line from a claim into visible evidence; the data is already swept by the placement builder.
5. **P17 to P19, the reader's units**. £100 beside $133, "8 hours at the minimum wage", "38 of every 100".

### How to read this file

Every pattern separates **Evidence** (what a source documents, with its URL) from **Judgement** (my application to this site). Sources are marked **[read]** when the page or paper was fetched and read in this session, **[snippet]** when known only from search-result text. UK figures given as examples were checked on 2026-10-04 against the URL beside them; none may print until it is in the site's data files.

---

## 1. The pattern catalogue

Twenty-four patterns in five groups: A, inside the drawing; B, time; C, position; D, the reader's units; E, fine print. Each entry: what it is, examples, evidence, judgement (when to use, when not), data needed, how it renders at 375px (a 343px card), and the words it needs.

### A. Context inside the drawing

#### P1. Reference tick (the bullet graph's comparative measure)

- **What.** A short line across the track at one comparison value: a target, last year, a group median, a policy rate. The figure is read against it without a word.
- **Examples.** Stephen Few, *Bullet Graph Design Specification*, https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf [read]. Datawrapper, annotations in bar, range and dot charts, https://www.datawrapper.de/blog/annotations-in-bar-charts/ [read]. Datawrapper, range highlights and reference lines, https://www.datawrapper.de/academy/range-highlights-and-lines [snippet].
- **Evidence.** Few designed the bullet graph to replace the meters and gauges of dashboards: one featured measure, one or two comparative measures drawn as a short perpendicular line less dominant than the measure, and two to five qualitative ranges in intensities of a single hue, ideally three [read]. Hsee's evaluability hypothesis explains why the tick matters: a value that is hard to judge on its own (is 6.61% a lot?) becomes judgeable once a comparison is present (Hsee 1996, https://papers.ssrn.com/sol3/papers.cfm?abstract_id=930092 [snippet]). Datawrapper recommends reference lines for benchmarks repeated across panels [read].
- **Judgement.** The site's world track is already a bullet graph with one comparative (the world median) and one range (the middle half). The next tick should be domestic: the central bank rate on the borrowing track, the small-profits and main rates on the tax figure, the minimum wage on the pay track. Two labelled ticks per track at most; a third turns into a legend.
- **Data.** The reference value for the same date and unit as the figure.
- **At 375px.** A 1px tick with its label under the track; a third tick stays unlabelled and its name and figure move into the plus.
- **Words.** A noun phrase of one to three words and the figure: "Central bank rate {figure}". Never "vs", never "target".

#### P2. Named peer ticks

- **What.** Small ticks or hollow dots for three or four named comparison countries on the same track or spectrum as the home country.
- **Examples.** World Bank *Doing Business 2020* economy profile for the UK: the starting-a-business score shown in a list of comparators (UK 94.6, Ireland 94.4, France 93.1, United States 91.6, OECD high-income average 91.3, Germany 83.7), https://archive.doingbusiness.org/content/dam/doingBusiness/country/u/united-kingdom/GBR.pdf [read]. Our World in Data country profile for the UK, charts with the UK and its neighbours highlighted, https://ourworldindata.org/profile/population-demography/united-kingdom [read].
- **Evidence.** Reference products answer Tufte's question, "Compared to what?" (*Envisioning Information*, 1990, p. 67, cited at https://en.wikipedia.org/wiki/Small_multiple [read]), with a short, fixed comparison set rather than the whole world alone. OWID's profiles add regional and income-group comparisons to many charts [read].
- **Judgement.** The cheapest way to show the page knows this country. The peers must be the set the page's own "Against the peers" table already uses, so the reason for featuring them is on the page (PART 5: featuring needs a reason a reader would accept). Never name the country holding a track's end, even if it is a peer (clause 4). Skip a track where fewer than three peers hold a figure; two ticks read as a cherry-pick.
- **Data.** The peer set; each peer's figure for the same field and year; a fill flag per figure (a fill value is never drawn as a peer's figure, clause 46).
- **At 375px.** The ticks stay, the names do not fit: ticks unlabelled, the plus lists each peer with its figure as rows.
- **Words.** The peer's short name only ("France").

#### P3. Every country as a hairline (barcode, dot strip, beeswarm)

- **What.** All countries drawn as faint marks on the track, the home country the one strong mark. The reader sees where the world crowds and whether the home value sits in the crowd or alone at an edge.
- **Examples.** ONS Explore Local Statistics: a beeswarm in which the chosen area and its comparison value are marked out against grey dots for every other area, with a fixed label under the chart such as "Similar to average in 2023", https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandwellbeing/methodologies/explorelocalstatisticsserviceqmi [read]. FT Visual Vocabulary, "Dot strip plot" and "Barcode plot" under Distribution, https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary [read]. Datawrapper: "Gray is a storytelling tool", https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations/ [read].
- **Evidence.** Cleveland and McGill (1984) found position along a common scale the most accurate of the elementary perceptual judgements (summary at https://priceonomics.com/how-william-cleveland-turned-data-visualization/ [snippet]); a strip keeps every country on that one scale. The ONS label is generated from a rule (one median absolute deviation from the comparison) [read], the same move as the site's placement line.
- **Judgement.** The strongest way to make the placement line feel backed up: the line states the tenth, the strip shows the 198 marks it was counted from. The placement line is already counted from every country's value (`placementRank()` in `placement.ts`), so the data is in hand, and the strip thickens the existing track instead of adding a new kind of drawing. Do not draw fill values: the running-costs file holds 0.13 for 52 countries (`country-view.tsx`, R11), which would draw a false spike at 0.13. Exclude fills and print the count drawn.
- **Data.** Every country's held value for the field, its fill flag, the count drawn.
- **At 375px.** A 12 to 16px strip of 1px hairlines at low opacity; where countries crowd, overlapping marks darken, which is the information. Works on a 311px track.
- **Words.** None on the strip. The basis line names the set: "{n} countries".

#### P4. The typical band (middle half shaded)

- **What.** A shaded range for the usual values behind the marker.
- **Examples.** Google Flights price insights, whether prices are low, typical or high "compared to past averages", https://blog.google/products/travel/google-flights-find-deals/ [read]. Tufte's sparkline notebook, the grey normal-range band in the medical example, https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ [read]. Lab results on a number line with the standard range: Zikmund-Fisher et al., *JAMIA* 2017, https://dx.doi.org/10.1093/jamia/ocw169 [snippet].
- **Evidence.** In a study of 1,620 adults, number-line displays with the standard range reduced misplaced urgency for near-normal results compared with tables, while extreme values still read as extreme [snippet].
- **Judgement.** Already built (WorldRange.tsx: "the middle half of the countries shaded, the median marked and named"). Keep it; P3 makes it more legible because the band then visibly holds half the hairlines. Google colours its bar green, yellow and red; this site's band stays one grey.
- **Data.** p25 and p75 of the held values (already computed).
- **At 375px.** As built.
- **Words.** None on the band; the median tick keeps its existing word.

#### P5. Highlight and grey (the ghost outline)

- **What.** The reference shape (the world's age structure, a peer group's spending mix, other regions' survival) drawn as a thin outline or grey fill behind the home country's shape.
- **Examples.** Datawrapper, "Color is our most powerful tool to control where the reader looks", https://www.datawrapper.de/blog/emphasize-with-color-in-data-visualizations/ [read]. Datawrapper population pyramids, https://academy.datawrapper.de/article/153-how-to-create-a-population-pyramid [snippet]. Data Revelations on overlaying one pyramid as a step outline, https://www.datarevelations.com/population-pyramid/ [snippet].
- **Evidence.** Readers attend to saturated colour first and grey last, so grey context keeps the comparison present without competing [read]. Comparing two populations of different size needs shares, not counts [snippet].
- **Judgement.** The one honest way to compare two whole shapes with no sentence and no percent difference. Use on people by age, household spending, survival. Not when the reference shape is built from fills.
- **Data.** The reference distribution in the same bins and units (shares).
- **At 375px.** A 1px line over the existing bars; adds no width.
- **Words.** One key in the basis line: "Outline: world".

#### P6. Range and percentile strip (low to high; p25, median, p75)

- **What.** A figure shown as its spread: a range bar for "6 to 12 months", or a median with its quartiles.
- **Examples.** Levels.fyi: one large median ("Median Total Comp") with three smaller figures labelled "25th%", "75th%" and "90th%", https://www.levels.fyi/t/software-engineer/locations/united-kingdom [read]. Datawrapper range plots, https://www.datawrapper.de/academy/how-to-create-a-range-plot [snippet]. Census Reporter prints a margin of error with every estimate, https://censusreporter.org/profiles/16000US3651000-new-york-ny/ [read].
- **Evidence.** Census Reporter keeps margins of error rather than discarding them and flags figures that need care (project README, https://github.com/censusreporter/censusreporter [read]). Levels.fyi makes one figure the headline and lets the spread sit beside it [read].
- **Judgement.** Honest spread reads as backed up without a disclaimer. Use for time to sell, net margins, insurance quotes, pay. Print a range as a range ("6 to 12 months"), never with a plus-minus sign, which reads as hedging.
- **Data.** Low and high, or p25, p50 and p75, for one population and year.
- **At 375px.** One row per item; the range a thick segment on a thin track.
- **Words.** "{low} to {high}". The median keeps the site's median word; the quartile band is unlabelled and explained once on the page.

#### P7. Direct labels on the marks

- **What.** Short labels attached to the marks they name (a tick's name, a dot's year) instead of a legend or a caption sentence.
- **Examples.** Datawrapper, "What to consider when using text in data visualizations", https://www.datawrapper.de/blog/text-in-data-visualizations [read]. Stokes, Setlur, Cogley, Satyanarayan and Hearst, "Striking a Balance" (IEEE VIS 2022), https://arxiv.org/abs/2208.01780 [read, abstract].
- **Evidence.** In Stokes et al. (302 participants) readers ranked the most heavily annotated charts highest, and "heavily annotated charts were not penalized"; text placed close to the data helped the elemental and statistical takeaways (their levels 1 and 2), while text in titles drove the trend-level takeaways (level 3) [read, abstract and search summary]. Borkin et al. (2015) found text and redundancy help a chart's message be recalled (https://pubmed.ncbi.nlm.nih.gov/26390488/ [snippet]). Datawrapper converts annotations into a key on mobile [read].
- **Judgement.** This is how the page gets the "more text" that readers prefer without the sentences the founder bans: words as labels on marks (elemental and statistical), never as conclusions. The same research is the evidence for clause 12: title text steers what people take away, and Kong, Liu and Karahalios (CHI 2018) showed slanted titles shift what readers recall (https://experts.illinois.edu/en/publications/frames-and-slants-in-titles-of-visualizations-on-controversial-to/ [snippet]).
- **Data.** Whatever the labelled mark carries.
- **At 375px.** Labels that collide move into the plus as rows, in the drawing's order.
- **Words.** One to three words and a figure or a year.

#### P8. Small multiples

- **What.** The same small drawing repeated per region, rule or edition, on one shared scale.
- **Examples.** Tufte, via https://en.wikipedia.org/wiki/Small_multiple [read]. Eurostat regional yearbook (regions within countries), https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Regional_yearbook_introduction [snippet].
- **Evidence.** Tufte presents small multiples as the direct answer to "Compared to what?", enforcing comparison across objects; the shared scale is what makes them comparable [read].
- **Judgement.** The five-row spectra and the regional survival figures are multiples already. What they lack is a reference repeated across every panel: the same peer ticks on all five spectra rows, the same national line across every region.
- **Data.** One field per panel, one scale.
- **At 375px.** Two columns of panels, or a stacked list.
- **Words.** Panel names only.

### B. Context from time

#### P9. Then and now (the dated earlier value)

- **What.** The figure's earlier value, printed as an absolute with its date, beside the current figure.
- **Examples.** Trading Economics indicator pages: a summary table headed "Actual, Previous, Highest, Lowest, Dates, Unit, Frequency", https://tradingeconomics.com/united-kingdom/unemployment-rate [read]. Redfin market pages, the median sale price with its year-on-year change and the share sold above list price "up 3.2 points year over year", https://www.redfin.com/state/California/housing-market [snippet]. Datawrapper arrow plots, https://www.datawrapper.de/academy/how-to-create-an-arrow-plot [snippet].
- **Evidence.** Market-data products almost always pair the current value with the previous one; Datawrapper built a chart type for change between two dates [snippet].
- **Judgement.** Print both values as absolutes with dates. Redfin's "up 3.2 points" is a signed difference, banned in this site's comparison cells (clause 15) and close to the "Times the cheapest" construction the founder struck; the earlier absolute lets the reader do the comparing, which PART 5 asks for. Use when a rule or price changed in the last five years or is enacted to change within twelve months. Not for a series that wobbles without a cause.
- **Data.** The earlier value, the date it stopped applying, the change date.
- **At 375px.** One foot line.
- **Words.** "Before {month year}: {figure}" and "From {day month year}: {figure}". Example: online incorporation fee, "Before Feb 2026: £50" (rise from £50 to £100 on 1 February 2026, https://www.1stformations.co.uk/blog/companies-house-filing-fees-increase/ [snippet]).

#### P10. The country's own record range

- **What.** The lowest and highest value in the country's own series, with years, beside today's figure.
- **Examples.** Trading Economics, UK unemployment: actual 4.90%, lowest 3.40%, highest 11.90%, series 1971 to 2026, https://tradingeconomics.com/united-kingdom/unemployment-rate [read].
- **Evidence.** The product makes a series' extremes a standing part of every indicator page [read]; extremes give a ruler drawn from the country's own history rather than from other countries.
- **Judgement.** Historical depth is the cheapest gold nugget a country page can carry: "Since 1971" tells the reader the page knows this country's past. Use for unemployment, interest rates, energy prices. Avoid a series whose definition changed partway (a record across a break is false).
- **Data.** Series minimum and maximum, their dates, the first year.
- **At 375px.** A foot line, or a thin grey segment inside the world track spanning the record.
- **Words.** "Since {year}: {low} to {high}".

#### P11. Sparkline with the latest value

- **What.** A word-sized line of five to ten years ending in a dot at today's value.
- **Examples.** Tufte, sparklines as "small intense, simple, word-sized graphics with typographic resolution", https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ [read].
- **Evidence.** Tufte's medical example combines the latest value in colour, the whole series, and a grey normal-range band, and argues sparklines can sit wherever a word or number can [read].
- **Judgement.** Good where the path matters: borrowing rates, unemployment, business electricity after the 2022 price shock. It is a new kind of drawing here, so clause 55 caps it at two on the page and clause 64 keeps the two apart. Not for statutory figures that step once a year (P9 says it better).
- **Data.** Five to ten years, one definition, regular frequency.
- **At 375px.** About 80 by 20px after the figure.
- **Words.** The first year at the left end; the latest figure at the dot.

#### P12. Arrow between two editions

- **What.** A hollow dot at the earlier value, a filled dot at the current one, joined on the same row.
- **Examples.** Datawrapper arrow plot, https://www.datawrapper.de/academy/how-to-create-an-arrow-plot [snippet]. FT Visual Vocabulary, Slope: good when data "can be simplified into 2 or 3 points", https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary [read].
- **Judgement.** Fits the five-row spectra (where the UK stood in an earlier edition) and the obstacles survey (the share naming each obstacle in the previous wave). A new kind of drawing: cap at two, apart.
- **Data.** The same indicator in an earlier edition or wave, same method.
- **At 375px.** Per row; fits.
- **Words.** The earlier year beside the hollow dot ("2016").

#### P13. The dated rule timeline (what changed, what is coming)

- **What.** A short ledger of dated changes to the rules and prices a small firm lives under: date, item, before, from.
- **Examples.** FT Visual Vocabulary, Priestley timeline, "Great when date and duration are key elements of the story", https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary [read]. Acas on the Employment Rights Act 2025: "From 1 January 2027, protection from unfair dismissal will become a right after 6 months", https://www.acas.org.uk/unfair-dismissal-changes-among-biggest-employment-rights-act-2025-challenges-for-bosses [read]. GOV.UK rates for 2026 to 2027, figures that "apply from 6 April 2026 to 5 April 2027", https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027 [read].
- **Evidence.** Governments publish rules as dated tables; the FT names the timeline as the form for dated events [read].
- **Judgement.** The "hot stuff" the founder asked for, and the most country-specific context there is. A future-dated row is news a founder can plan around. Rows print absolutes, so clause 15 is met. Use per card for that card's rule (P9) and page-wide as a device (section 3, D2). Only changes in force, or enacted with a date, print; proposals do not.
- **Data.** Per change: effective date, item, value before, value from, status (in force, enacted with date).
- **At 375px.** A vertical list: date left, item and the two values right.
- **Words.** Column heads "Date", "Before", "From"; items of three words or fewer ("Incorporation fee", "Unfair dismissal", "Sick pay").

### C. Context from position

#### P14. Placement line, and rank with its set size

- **What.** The figure's position among all members, in one fixed wording.
- **Examples.** The site's "Higher than {n} countries in ten." (`placement.ts`). Wikipedia's country infobox prints ranks in brackets, "Total $4.721 trillion (10th)", https://en.wikipedia.org/wiki/United_Kingdom [read]. ONS census area pages, "ranked sixth for total population out of 309 local authority areas", https://www.ons.gov.uk/visualisations/censuspopulationchange/E08000003/ [read]. The CIA World Factbook's per-field "country comparison to the world" (the Factbook was discontinued on 4 February 2026; archive at https://worldfactbookarchive.org/) [snippet]. Spotify Wrapped's "top 1%" listener line, https://irrationallabs.com/blog/spotify-wrapped-behavioral-science/ [snippet].
- **Evidence.** Barrio, Goldstein and Hofman (CHI 2016) include ranks and "in the top x%" among the perspective templates that improved recall, estimation and error detection (https://dangoldstein.com/papers/Barrio_Goldstein_Hofman_Improving_Comprehension_Numbers_News_CHI16.pdf [read]).
- **Judgement.** Already the site's standard; the one action is to hold every card to the one wording. The time-to-sell card's "quicker than in 182 of 198 countries" is a second wording (clause 37); through the builder the same figure prints "Among the lowest tenth." A rank without its set size ("ranked 23rd") never prints.
- **Data.** Count strictly below, count held (already computed).
- **At 375px.** As built.
- **Words.** Fixed.

#### P15. Percentile against a named peer pool

- **What.** The percentile computed among a relevant pool (players at the same position; high-income countries here) rather than among everyone.
- **Examples.** FBref scouting reports compare a player with others at the same position, in pools with a minimum of minutes, https://fbref.com/en/about/scouting-reports-explained [snippet]. Baseball Savant percentile rankings: sliders with the percentile in a bubble on a blue-to-red gradient, https://www.mlb.com/news/baseball-savant-statcast-player-pages-new-look [snippet].
- **Evidence.** FBref's own explanation: a raw rate means little until placed among the same position [snippet]. Savant puts unlike metrics on one 0 to 100 scale so a whole profile reads at a glance [snippet].
- **Judgement.** For the state and people spectra, the reader's real question is "compared with countries like mine". But a pool sentence is a second placement wording (clause 37). Two options for his ruling: keep the world pool and show the peer group as ticks (P2), or rule one more fixed sentence ("Higher than {n} high-income countries in ten."). Savant's colour gradient is out (palette).
- **Data.** Pool membership per country; percentile within the pool.

#### P16. Black ink (the best value in bold)

- **What.** The leading value in a column set in bold.
- **Examples.** Baseball Reference's Bullpen: league leaders are traditionally printed in boldface, https://www.baseball-reference.com/bullpen/Black_Ink [snippet]; the convention became Bill James's "Black Ink" test [snippet].
- **Judgement.** Already the peer table's law (PART 5: the best value in a column at ink weight 600). No change. Do not extend it outside tables: on a card it becomes featuring without a reason.

### D. Context in the reader's own units

#### P17. Re-expression in a familiar unit (perspectives)

- **What.** The figure restated in a unit the reader already budgets in: hours of the minimum wage, working days, per month, a share of a known whole.
- **Examples.** Barrio, Goldstein and Hofman, "Improving Comprehension of Numbers in the News" (CHI 2016), https://dangoldstein.com/papers/Barrio_Goldstein_Hofman_Improving_Comprehension_Numbers_News_CHI16.pdf [read]. Hullman, Kim, Nguyen, Speers and Agrawala, "Improving Comprehension of Measurements Using Concrete Re-expression Strategies" (CHI 2018), https://idl.cs.washington.edu/files/2018-ConcreteReexpression-CHI.pdf [snippet]. Stripe's 2024 letter: payment volume "equivalent to around 1.3% of global GDP", https://stripe.com/newsroom/news/stripe-2024-update [snippet].
- **Evidence.** Across three randomised experiments with over 3,200 participants, a perspective (a ratio, a rank or a unit change) improved recall of numbers read, estimation of numbers not read, and detection of altered numbers; on one item exact recall rose from 40% to nearly 55% [read]. The perspectives were built from ten fixed templates, each with three slots: a scaling factor, an attribute and a reference [read]. Hullman et al. found re-expressions helped people estimate new measurements, and built theirs only from familiar objects mined from Amazon and Wikipedia [snippet].
- **Judgement.** The template finding proves a reusable form across 195 countries is possible. Choose the slots that read naturally and drop the "x times larger" template (the founder struck "Times the cheapest"; clause 15 bans multiples in comparisons). A small-business reader budgets in hours, days and months, so those are the units. Only from figures the site holds; never an object it does not hold (coffees, flights, football pitches).
- **Data.** The two held figures and the arithmetic (fee divided by the hourly minimum wage; hours divided by an 8-hour day).
- **At 375px.** One foot line.
- **Words.** "{n} hours at the minimum wage", "About {n} working days", "{figure} a month".

#### P18. Natural frequency and the unit chart ("38 of every 100")

- **What.** A share said and drawn as a count of a round whole: 38 inked units of 100.
- **Examples.** Galesic, Garcia-Retamero and Gigerenzer, "Using icon arrays to communicate medical risks: overcoming low numeracy", *Health Psychology* 2009, https://pure.mpg.de/view/item_2099767 [snippet]. FT Visual Vocabulary, Isotype: "use only with whole numbers", https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary [read].
- **Evidence.** Icon arrays drew attention to the denominator and improved accuracy, most for low-numeracy readers [snippet].
- **Judgement.** The site owns the form already (BentoCount: the whole drawn as units, the part inked). One use per page region: either who is still trading (38 of 100) or card payments (6 of 10), never on one level or neighbouring levels (clause 64).
- **Data.** The share, rounded to the whole the grid draws.
- **At 375px.** A 10 by 10 grid about 120px square.
- **Words.** "{n} of every 100".

#### P19. The native figure beside the converted one

- **What.** The official local-currency figure next to the dollar conversion.
- **Examples.** Numbeo prints both currencies, e.g. "£8,978.5 ($11,890.2)", https://www.numbeo.com/cost-of-living/compare_cities.jsp?country1=United+Kingdom&city1=London&country2=United+States&city2=New+York%2C+NY [read]. Wise shows the exchange rate and the fee as two separate clear numbers, https://wise.com/us/compare/ [snippet].
- **Evidence.** Nielsen Norman Group's second usability heuristic, match between the system and the real world: speak the users' language (https://www.nngroup.com/articles/ten-usability-heuristics/ [snippet]).
- **Judgement.** "$133" looks computed; "£100" is the number on the government's own fee schedule and reads as checked. The same holds for "$66 a year" (a £50 confirmation statement). Use for statutory fees, wages and penalties; the dollar figure stays the focal figure, for comparability.
- **Data.** The published local figure, the exchange rate and its date.
- **At 375px.** A bracket after the focal figure, at 16px or less.
- **Words.** "$133 (£100)".

### E. Context as fine print

#### P20. Fact sheet behind the plus (margin notes, folded)

- **What.** Label and figure rows revealed in place: thresholds, minimums, deadlines, exceptions.
- **Examples.** Tufte CSS: on small screens margin notes are "hidden until the user toggles them into view", the toggle a ⊕ symbol, https://edwardtufte.github.io/tufte-css/ [read]. Shneiderman's mantra, "overview first, zoom and filter, then details-on-demand", https://www.cs.umd.edu/~ben/papers/Shneiderman1996eyes.pdf [snippet], adopted for OWID's topic pages, https://ourworldindata.org/redesigning-from-posts-and-articles-to-posts-in-articles [read]. Fact grids: Wikipedia's infobox [read]; Trading Economics' summary table [read].
- **Evidence.** Tufte CSS keeps "related but not necessary information" next to the text without breaking its flow, and folds it behind a symbol on phones [read]; OWID put the overview first and the detail on demand [read].
- **Judgement.** This is the founder's own plus (clause 60). Make it a system: every card's plus holds rows of the same kinds in the same order, so a reader learns where to look: the rule's numbers, the deadline, the consequence (P21), the change (P13), the local term (P24). Rows, never sentences.
- **Data.** Per card, the fields the file holds around the figure.
- **At 375px.** Rows in a `--c-soft2` panel, label left, figure right.
- **Words.** Three-word labels and figures with units: "Small profits limit £50,000".

#### P21. Harm anchor (the consequence beside the rule)

- **What.** Beside an obligation, the figure for what happens if it is missed: the fine, the penalty ladder.
- **Examples.** The "harm anchor" in lab-result displays (a line labelled "Many doctors are not concerned until here"), https://doi.org/10.2196/jmir.8889 [snippet]. GOV.UK, employers' liability insurance: "You can be fined £2,500 every day you are not properly insured", https://www.gov.uk/employers-liability-insurance [read]. GOV.UK late filing penalties for company accounts (private companies: £150 up to 1 month late, rising to £1,500 beyond 6 months, doubled if also late the year before), https://www.gov.uk/government/publications/late-filing-penalties-from-companies-house/late-filing-penalties [snippet].
- **Evidence.** Adding a harm anchor improved how people judged the severity of near-normal results [snippet].
- **Judgement.** Turns a dry rule ("9 filings a year") into a stake ("Late accounts £150 to £1,500"). It is a figure, not a warning, so it is not a disclaimer.
- **Data.** The penalty schedule per obligation.
- **At 375px.** A row in the plus.
- **Words.** "Late accounts £150 to £1,500", "Uninsured £2,500 a day".

#### P22. Year and set-size stamp

- **What.** Each figure's year, and the size of the set it is placed in, said once where the unit is said.
- **Examples.** Wikipedia's infobox, "2026 estimate" before the GDP figures [read]. Trading Economics' "Dates" column, 1971 to 2026 [read]. The Factbook's "(est.)" year convention [snippet].
- **Judgement.** Part of "backed up" without naming a source agency (forbidden by R-002 and the `verify_no_source_agencies` gate): the year and the count are provenance a reader can see. The year goes in the basis line or the column head; the set size in the basis line.
- **Data.** Figure year; count held.
- **Words.** Inside the 14-word basis line: "{unit}, {year}, {n} countries".

#### P23. Parent comparison printed as an absolute (Census Reporter, adapted)

- **What.** Each figure accompanied by the same figure for the larger whole it belongs to.
- **Examples.** Census Reporter, New York City: median household income "$81,228 ±$908" followed by "about 80 percent of the amount in the New York-Newark-Jersey City, NY-NJ Metro Area: $99,852"; poverty "about 1.4 times the rate" of the metro area, https://censusreporter.org/profiles/16000US3651000-new-york-ny/ [read]. The project computes "index values" as a share of the parent and uses them "Madlib-style" (README, https://github.com/censusreporter/censusreporter [read]). Doing Business 2020 columns: UK, OECD high income, "Best Regulatory Performance" (time to start: 4.5 days, 9.2 days, 0.5 days New Zealand) [read].
- **Evidence.** Census Reporter limits a profile to at most two parent geographies and keeps margins of error [read].
- **Judgement.** The parent comparison is right; the phrasing is not for this site. "About 1.4 times the rate" is a multiple (clause 15), and one Madlib sentence repeated on twenty cards reads as machine copy. Print the parent's absolute: "World median 13.2%". Doing Business's best-performer column names the country at the frontier, which clause 4 forbids.
- **Data.** The parent's figure, same field and year.
- **At 375px.** A tick label, or the foot line.
- **Words.** "World median {figure}".

#### P24. The local term under the generic label

- **What.** The country's official name for a thing, quietly under the label the site uses everywhere.
- **Examples.** Doing Business: "Private Limited Company (Ltd)" [read]. GOV.UK: "national living wage rate" [read]. The site's own slot, PART 5: "A local term or second name sits under the label at 12px muted".
- **Evidence.** NN/g heuristic 2, match the real world (https://www.nngroup.com/articles/ten-usability-heuristics/ [snippet]).
- **Judgement.** The cheapest country-specific nugget on the page, and one the founder's own grammar already allows. "Minimum wage" with "National Living Wage" under it; "Sick pay" with "SSP"; "Central bank rate" with "Bank Rate"; "Private company" with "Ltd". Names of institutions (the company register, the tax office) need his ruling: the gate bans statistics bodies by name, and R-002's spirit may reach further.
- **Data.** Per country, per concept, the official term.
- **At 375px.** A second line under the label.
- **Words.** The official term as published.

---

## 2. Section by section: the UK page

Each section: what is on the card now (from the brief and `PAGES.md`), the one or two patterns to add, the exact fields needed, where each piece sits (mark, foot, plus), and cautions. "Verified" means checked on 2026-10-04 at the URL given; such values still have to be loaded into the data files before they print. Fields I suspect are not held yet are marked *(likely not held)*.

### 2.1 The tax burden (20% on profit), the opening's accent

- **Add.** P1 (the two statutory rates as reference values) and P9 (the last change).
- **Fields.** Statutory small-profits rate and its profit limit; main rate; marginal relief upper limit; effective date of the current schedule; the previous single rate and its end date. Verified: 19% at £50,000 or less, 25% main rate, marginal relief to £250,000, from 1 April 2023; a single rate applied from 1 April 2015 to 31 March 2023 (https://www.gov.uk/corporation-tax-rates [read]).
- **Where.** If the opening draws a track: ticks "Small profits 19%" and "Main rate 25%", and the effective 20% reads as sitting just above the lower rate, with no sentence. If the opening is fact cells only: two cells, "Main rate 25%" and "Small profits rate 19%" (a figure and at most four words each, clause 9). Foot: "Before Apr 2023: 19%" (the single rate). Plus: "Small profits limit £50,000", "Marginal relief to £250,000", "Tax due 9 months 1 day after year end" (deadline per https://www.gov.uk/pay-corporation-tax [snippet]).
- **Caution.** The accent stays on the effective rate; the ticks are grey.

### 2.2 Registering, by legal form (TiersTable)

- **Add.** P24 (local names on each form row) and P20 (per-form rule rows behind his plus).
- **Fields.** Per form: official name and abbreviation; minimum capital; owner liability; filings a year; whether accounts are public; identity check for directors. Verified: identity verification compulsory for new directors from 18 November 2025 (https://www.gov.uk/government/news/companies-house-confirms-identity-verification-rollout-from-18-november-2025 [snippet]). Optional column: share of new firms by form *(likely not held)*, which answers "what do people here actually choose" as absolutes.
- **Where.** Local term under each form name; plus rows "Minimum capital none", "Accounts public", "Director ID check".
- **Caution.** The table prints absolutes only (clause 15); yes/no attributes live in the plus, not in a figure column.

### 2.3 The bill to register ($133)

- **Add.** P19 (the native fee) and P9 (the last change); P17 in the plus.
- **Fields.** Fee in GBP as published; the date it took effect; the previous fee; exchange rate and date; hourly minimum wage. Verified: the online incorporation fee rose from £50 to £100 on 1 February 2026 (https://www.1stformations.co.uk/blog/companies-house-filing-fees-increase/ [snippet]); minimum wage £12.71 an hour from 6 April 2026 (GOV.UK rates page [read]). If the $133 is the £100 fee converted, £100 / £12.71 = 7.9 hours.
- **Where.** Focal "$133 (£100)"; foot "Before Feb 2026: £50"; plus "8 hours at the minimum wage". P3 hairlines on its world track, if it has one.

### 2.4 What staff cost (PayBars; accent on the average salary)

- **Add.** P9 for the wage floor; P20 for what an employee costs on top of pay; P24 for the local name.
- **Fields.** Hourly minimum, its effective date, the previous rate; employer social contribution rate and threshold with dates; employer pension minimum *(likely not held)*. Verified: £12.71 from 6 April 2026 (previously £12.21, https://www.acs.org.uk/press-releases/national-living-wage-rise-ps1271-april-2026 [snippet]); employer National Insurance 15% above £5,000 a year (GOV.UK 2026 to 2027 [read]), up from 13.8% above £9,100 on 6 April 2025 (https://taxscape.deloitte.com/measures-autumn-budget-2024/increase-to-employer-nic-rate-and-lowering-of-the-secondary-threshold.aspx [snippet]).
- **Where.** "National Living Wage" under the minimum's label (P24); foot "Before Apr 2026: £12.21"; plus "Employer NI 15%", "NI starts at £5,000", "Before Apr 2025: 13.8%". Optional P6: the pay distribution's middle half as the band on the pay track *(wage percentiles likely not held)*.

### 2.5 Employing people (KvGrid: 28 days holiday, sick pay, unfair dismissal after 2 years, maternity 39 weeks)

- **Add.** P13 per row (what is coming) and P20 (the money behind each rule); P24.
- **Fields.** Per rule: current value, effective date, enacted future value and its date, weekly amounts. Verified: unfair dismissal protection after 6 months from 1 January 2027, and the compensation limit removed on the same date (Acas [read]); sick pay from the first day of illness, in force (Acas [read]), previously from the fourth day [snippet]; sick pay £123.25 a week or 80% of average weekly earnings if lower, 2026 to 2027 (GOV.UK rates page [read]); maternity pay for up to 39 weeks, 90% of average weekly earnings for the first 6 weeks, then £194.32 or 90% if lower for 33 weeks (https://www.gov.uk/maternity-pay-leave/pay [read]); holiday 5.6 weeks, at least 28 days for a five-day week, bank holidays may count (https://www.gov.uk/holiday-entitlement-rights [read]).
- **Where.** Each row keeps its figure; under the unfair dismissal row a dated line "From 1 Jan 2027: 6 months". Foot (one only): that same line if the row cannot carry it. Plus: "Sick pay £123.25 a week", "Maternity pay first 6 weeks 90%", "Then £194.32 a week", "Compensation cap removed 1 Jan 2027". Local terms "SSP", "SMP".
- **Caution.** No world track here: paid leave is held for 0 of 195 countries (clause 41), so P3 and P14 wait for the data.

### 2.6 Running costs (electricity $0.32/kWh, the highest band; diesel; cost of living 41/100)

- **Add.** P3 (hairlines for every country) and P10 or P11 (the UK's own path).
- **Fields.** Commercial electricity price for every country with its fill flag (exclude the 52 countries at the 0.13 fill, clause 46); the UK's price series for 5 to 10 years *(likely not held)*; the peers' prices for P2; the date of each diesel price.
- **Where.** On the electricity track, hairlines show the UK alone at the right edge: the "highest band" proved without the level chip having to say it. Foot: "Since {year}: {low} to {high}" for the UK series, or a sparkline (one of the page's two). Diesel: the code already withholds a world track because dates differ (`country-view.tsx`, 2026-09-25); P22 prints the date instead: "Week of 21 Sep 2026".
- **Caution (judgement).** "41/100" is a 1-to-100 scale the site built over covered cities, and it reads as a score; clause 17 bans a coined index used as a reading. Replace the reading with an absolute the scale stands on (a one-bed rent or a basket in currency, if held) and keep the scale as the track. Replace, not cut.

### 2.7 Insurance ($2,200 a year for four covers)

- **Now.** Covers as bars with the legally required one marked and the law's minimum cover as a figure (`country-view.tsx`).
- **Add.** P21 (the fines) and P17 (per month).
- **Fields.** Penalties for no cover and for not displaying the certificate; quote spread per cover *(likely not held)*. Verified: cover of at least £5 million; £2,500 a day if not properly insured; £1,000 for not displaying the certificate (https://www.gov.uk/employers-liability-insurance [read]).
- **Where.** Foot "$183 a month" (2,200 / 12). Plus: "Minimum cover £5 million", "Uninsured £2,500 a day", "Certificate not shown £1,000". Optional P6: each bar's p25 to p75 quote range.

### 2.8 Against the peers (CompareTable)

- **Now.** The home row tinted, the best value in each column bold (P16).
- **Add.** P22 (the year in every column head) and P20 at column level (a plus on each column head with the world median and the count held). Cells stay absolute.
- **Fields.** Each column's year; world median and count per column; the rule that picked the peers.
- **Where.** The peer rule once in the basis line (for example "Peers: the four nearest by income per head", whatever the rule truly is).
- **Caution.** No reference row printed as a value (clause 17), no deltas (clause 15).

### 2.9 Dealing with the state (SpectraTable, five rows)

- **Add.** P12 (where the UK stood in an earlier edition) and P2 (the same peer ticks on all five rows, P8).
- **Fields.** Each indicator's value in an earlier edition, same method; the peers' positions; for the plus, the underlying measure in its own unit where it is a share or a count (not a third-party index score, which cannot be read without naming its maker).
- **Where.** Hollow dot labelled "2016" (or the edition held) on each row; grey peer ticks, unlabelled at 375 with names in the plus.
- **Caution.** The black state dots are the founder's exemption; peer ticks must be visibly lighter.

### 2.10 Legal and admin costs ($66 a year to file, 55 hours of admin, 9 filings) (KvGrid)

- **Add.** P21 (late penalties) and P19 with P9 (the native fee and its change); P17 in the plus.
- **Fields.** The 9 filings with their due rule, fee and penalty. Verified: accounts due 9 months after the year end, tax paid 9 months and 1 day after, tax return 12 months after (https://www.gov.uk/pay-corporation-tax [snippet]); confirmation statement fee £50 from 1 February 2026, previously £34 [snippet]; late accounts £150 to £1,500, doubled for a second late year [snippet].
- **Where.** Focal "$66 (£50)"; foot "Before Feb 2026: £34"; plus "About 7 working days" (55 / 8 = 6.9), "Late accounts £150 to £1,500", and the filings as rows of name and deadline. The filings could instead become the page's year strip (section 3, D3).

### 2.11 Borrowing (6.61% average new small-business loan; world median 13.2%)

- **Add.** P1 (the central bank rate tick) and P11 or P10 (the rate's path).
- **Fields.** The policy rate on the date of the loan figure; 5 to 10 years of the average new small-business loan rate *(likely not held)*; the world values (held, the median already ticks).
- **Where.** A second tick "Central bank rate {figure}", with "Bank Rate" as its local term in the plus; the spread between policy rate and loan rate is then visible without a sentence. Foot: a sparkline ending at 6.61% (the page's second, far from the first), or "Since {year}: {low} to {high}".

### 2.12 Getting paid (60% pay by card) (DonutStat)

- **Add.** P9 (an earlier year's share) and P23 or P2 (peers' shares as absolutes).
- **Fields.** The card share series with years; the peers' card shares; the cash share.
- **Where.** Foot "{year}: {share}%"; plus rows "France {x}%", "Germany {x}%" and so on, absolutes only, from held figures.
- **Caution.** The ring is the drawing; a row of figures in the plus is not a second drawing.

### 2.13 What trades keep (net margin bars, 7 London trades)

- **Add.** P6 (each trade's range behind its bar) and P1 (the same trade's national figure as a tick on its own bar, like for like).
- **Fields.** Per trade: p25, median, p75 margin in London; the same trade's UK-wide median.
- **Caution.** Never compare one trade in London with another trade elsewhere; the tick is always the same trade. Margins come from the engine, so clause 32 applies: only where the figure is credible, and the accent seat stays unlit until R7's builder exists (PART 6).

### 2.14 Time to sell a business (6 to 12 months; "quicker than in 182 of 198 countries")

- **Add.** P6 on P3: each country's midpoint as a hairline, the UK's 6 to 12 months as a segment.
- **Fields.** Low and high months per country.
- **Where.** The placement line through the builder: the UK prints "Among the lowest tenth." (judgement: 15 of 198 strictly quicker would fall in the bottom tenth; the builder decides).
- **Caution.** The current "quicker than in 182 of 198 countries" is a second placement wording (clause 37).

### 2.15 People by age (AgeMix)

- **Add.** P5 (the world's or high-income countries' age shares as an outline) and P14 (median age on a world track).
- **Fields.** Population shares by five-year band for the UK and the reference; median age for every country.
- **Caution.** Shares only: raw population never prints as a figure (clause 34).

### 2.16 The job market (4.9% unemployment; 16.4% under 25) (JobMarket)

- **Add.** P10 (the UK's own record) and P2 (peers' youth rates).
- **Fields.** Unemployment series minimum, maximum and dates; youth unemployment for the peers. Verified example of what the series holds: lowest 3.4%, highest 11.9%, monthly since 1971 (Trading Economics [read]).
- **Where.** Foot "Since 1971: 3.4% to 11.9%" (once loaded and checked); grey peer ticks on the youth figure's track.

### 2.17 Household spending (ShareBar)

- **Add.** P5 (the world or peer median mix as a thin second bar under the UK's, same category order) and P17 (each share as money a month).
- **Fields.** Category shares for the UK and the reference; average household spending a month by category in GBP *(likely not held)*.
- **Where.** The thin ghost bar under the UK bar, labelled once in the basis line ("Thin bar: world median mix"); plus rows "Housing £{x} a month".

### 2.18 Dealing with people (SpectraTable, five rows)

- **Add.** P20 (the raw survey share behind each trait) and P2 (the same peer ticks as the state card).
- **Fields.** For each trait, the underlying share, its year and sample size; the peers' positions.
- **Where.** Plus rows like "Most people can be trusted {x}%" (the label must be the survey's own measure, three words where possible), with "{year}, {n} people asked" in the plus's foot.
- **Caution.** Both spectra cards must carry the identical device (P8), so the pair reads as one system.

### 2.19 Who is still trading (38% of new firms after 5 years, by region) (FirstYears)

- **Add.** P18 (38 of every 100) and P8 (regions as small marks on one scale, the national figure as a line through them).
- **Fields.** Five-year survival nationally and for each region or nation; the cohort's start year; the number of firms in the cohort, for the basis line.
- **Where.** The unit grid as the drawing; regions as a dot strip under it with the national line; basis "Firms started in {year}, still trading 5 years later".
- **Caution.** No region featured without a reason (PART 5); all regions one grey. If P18 is used here, card payments (2.12) must not also take a unit grid nearby (clause 64).

### 2.20 What holds firms back (tax 61%, energy 50%, red tape 44%...) (Obstacles)

- **Add.** P12 (each obstacle's share in the previous wave) and P22 (sample size and date).
- **Fields.** The previous wave's shares and date; sample size.
- **Where.** Hollow dot labelled with the earlier wave's year on each row; basis "Share of {n} small firms naming each, {month year}".

---

## 3. Page-level devices

Five devices that would make the whole page feel richer and more country-specific. Each needs a seat the founder approves (three full widths per page, clause 36; at most three cards on a level, clause 50).

### D1. Where the UK stands (a scouting strip for a country)

- **What.** Ten to fourteen rows, one per figure that has a world track: label, figure, the P3 hairline strip with the UK mark, each row a link to its card.
- **Evidence.** FBref's scouting report and Savant's percentile panel put a whole profile on one scale [snippet]; ONS Explore Local Statistics does it per indicator for a place [read].
- **Data.** Per field: the UK value, every held value, fill flags. All of it is already swept for the placement lines.
- **Needs his ruling.** Clause 5 requires the placement line beside every world track, which would mean ten identical-shaped sentences in a column, and clause 13 forbids a row written as a sentence. Either rule that the strip draws the tenth instead of writing it, or keep D1 off the page. And it needs a seat: the opening band or the close.

### D2. What changed, what is coming (a dated ledger)

- **What.** A four-column table, date, item, before, from, of the changes a small firm here must know. Verified UK rows to start from:

| Date | Item | Before | From | Source checked |
|---|---|---|---|---|
| 1 Apr 2023 | Corporation tax, main rate | 19% | 25% | GOV.UK corporation tax rates [read] |
| 1 Apr 2024 | VAT registration threshold | £85,000 | £90,000 | https://www.gov.uk/government/publications/vat-increasing-the-registration-and-deregistration-thresholds [snippet] |
| 6 Apr 2025 | Employer National Insurance | 13.8% above £9,100 | 15% above £5,000 | Deloitte [snippet]; GOV.UK 2026 to 2027 [read] |
| 18 Nov 2025 | Director identity check | none | required | GOV.UK news [snippet] |
| 1 Feb 2026 | Online incorporation fee | £50 | £100 | formation agents [snippet] |
| 1 Feb 2026 | Confirmation statement fee | £34 | £50 | formation agents [snippet] |
| 6 Apr 2026 | Minimum wage, 21 and over | £12.21 | £12.71 | GOV.UK [read]; ACS [snippet] |
| 6 Apr 2026 | Sick pay starts | day four | day one | Acas [read] |
| 1 Jan 2027 | Unfair dismissal protection | after 2 years | after 6 months | Acas [read] |

- **Evidence.** FT's Priestley timeline for dated events [read]; Trading Economics' "Previous" column [read]; governments publish rules as dated tables [read].
- **Data.** A dated change log per country: effective date, item, before, from, status. Refreshed every April for the UK.
- **Form.** A table (it is a designed text card, clause 54, not a run of sentences). Future rows need no pill: the date says it. At 375px a vertical list. "none" in the identity row is a bare word where a figure goes; print that row as a dated rule in the plus of the registering card instead, or ask for a ruling.

### D3. The year's fixed dates (a year strip)

- **What.** A strip of the dates every UK small firm meets, with the relative deadlines drawn as durations from the year end (a Priestley form: "date and duration").
- **Rows, verified where marked.** Tax year runs 6 April to 5 April (GOV.UK rates page [read]); minimum wage changes each April [read]; accounts 9 months after year end; corporation tax paid 9 months and 1 day after; tax return 12 months after [snippet]; confirmation statement once a year (to verify); Self Assessment for sole traders 31 January (to verify); VAT returns quarterly (to verify).
- **Data.** Fixed dates; relative deadlines as durations; recurrence; the penalty for each (P21).
- **Form.** Desktop: twelve months across, fixed dates as ticks, relative deadlines as bars from "Year end". 375px: a vertical list, date or duration left, item right. It replaces nothing if the legal-and-admin card can carry it (2.10).

### D4. The country facts (masthead fact cells)

- **What.** Six or nine fact cells, each a figure and at most four words (clause 9): the numbers a UK accountant would quote. Candidates: VAT threshold £90,000 [snippet]; corporation tax 19% and 25% [read]; minimum wage £12.71 [read]; employer NI 15% [read]; tax year start 6 April [read]; VAT standard rate 20% (to verify); weekly working limit 48 hours (to verify); currency GBP.
- **Evidence.** Wikipedia's infobox and the Factbook's fields are the canonical country fact grids [read; snippet].
- **Rules.** No raw population (clause 34); three cells resolve in thirds (clause 10); the hero is the founder's design, so this is a proposal for his layout.
- **Data.** Each fact with its year.

### D5. One plus, the same everywhere

- **What.** Every card's plus holds rows of five kinds, always in this order: the rule's numbers, the deadline, the consequence (P21), the change (P13), the local term (P24). Only the kinds a card's file holds appear.
- **Evidence.** Tufte CSS margin notes folded on phones [read]; Shneiderman's details on demand [snippet]; OWID's overview-first pages [read].
- **Why it matters for the whole page (judgement).** The founder's complaint is "not so many details about the country". Most of those details are rules, dates and penalties, which have no natural drawing and no business in the card's face. A consistent plus gives them a home on every card without adding one sentence to any card, and satisfies clause 58 (parts revealed on a click) and clause 60 (a figure carries its fields behind the plus).

---

## 4. Anti-patterns: what reads as AI filler or as simplistic sentences

| Anti-pattern | Example | Why it fails here |
|---|---|---|
| Conclusion caption | "The UK is one of the most expensive places for energy." | Clause 12. Evidence: title text steers the takeaway (Stokes et al. 2022) and slanted titles shift recall (Kong et al. 2018), so the line does the reader's thinking and can mislead; it also repeats the drawing. |
| One Madlib sentence on every card | "{X} is about {n} times the {parent} figure." | Twenty copies of one skeleton read as generated. Multiples are banned (clause 15) and the founder struck "Times the cheapest". Census Reporter and ONS use this form well in their genre; not here. |
| "Did you know?" trivia | National animal, oldest pub, famous founders | Not a figure the decision needs; an invented note (clause 32); pure filler. |
| Vague tier adjectives | "relatively high", "competitive", "business-friendly" | True for most countries, so they say nothing (PART 6 bans coined tier words). |
| Coined composite scores | Nomad List's "Nomad Score" out of 5; Redfin's Compete Score 0 to 100 (https://www.redfin.com/news/introducing-the-redfin-compete-score/ [snippet]); "Business climate 7.2/10" | Clause 17; the weights are opaque and the reader cannot check them. |
| Differences against an invisible base | "2.3x the EU average", "+14% vs average" | Clauses 15 and 17: the base is not drawn and cannot be checked. |
| Traffic-light colour | Google Flights' green, yellow, red; Nomad List's green and red bars; Savant's red-to-blue | Palette (terracotta and greys only, no green) and colour as verdict. |
| Rank without its set | "Ranked 23rd" | Uncheckable; every documented example (Wikipedia, ONS, FBref) names the set or pool. |
| Dateless change marks | "Up 3%" with no period, an arrow with no year | The period is the meaning; P9 and P22. |
| Disclaimers and method notes on cards | "Figures are estimates", "Modelled" | The founder's 2026-09-24 ruling: say how the numbers are made once per page. |
| Key-takeaways lists | Three bullets at the top summarising the cards | Repeats the page (clause 66), sentences (clause 12), the most recognisable AI-summary tell. |
| Invented equivalences | "That's 3,000 flat whites" | Objects the site does not hold (clause 32); Hullman et al. require a familiar, relevant reference, and a founder budgets in hours and months, not coffees. |
| False precision | "$2,213.47", "41.27/100" | Precision beyond the data reads machine-made; the site rounds by rule (for example decision 7 of 2026-10-04). |
| Hype and superlatives | "world-class", "booming", "hot market" | Verdict words; "hot" labels on property sites are coined tiers. |
| Context only on hover | A tooltip with the world median | No hover on a phone (the priority failure point); pop-ups are banned; the plus does the same job in place. |
| The dramatic peer | Comparing with the single most extreme country, or naming the world's maximum | Clause 4; featuring without a reason (PART 5). |
| Restating the figure in words | "The tax burden is 20%." under a 20% | An obvious thing repeated (clause 66). |
| Emoji and decorative glyphs | A flame beside a "hot" figure | Reads as generated; the site's icons live in the opener tile only. |
| A gauge with no reference | A needle with no ticks or band | Few built the bullet graph to replace gauges; a dial without a comparison shows a value, not context (see `2026-08-19-financial-dataviz-practice.md` B.3; the founder's own gauge keeps its home where a whole exists). |
| A second sentence template | ONS's rule-based "Similar to average in 2023" under every chart | One template per chart works on a service with one chart a screen; on a page of twenty cards it drones, and the site already holds its one sanctioned template, the placement line. |

**Considered and set aside.** Predict-then-reveal ("draw your guess, then see the data"): Kim, Reinecke and Hullman (CHI 2017) found it improves recall and comprehension (https://mucollective.northwestern.edu/project/explaining-the-gap [snippet]), but it turns a decision tool into a quiz and adds a step before every answer.

---

## 5. What this research cannot establish

- Most of the evidence comes from news, health and sport. None of it tested a country page for small-business founders, and the perspective and icon-array effects were measured on comprehension, not on trust or on the feeling that a page is backed up.
- I did not look at the live UK page in a browser; the mapping works from the brief's figures and from `country-view.tsx`, `WorldRange.tsx`, `placement.ts`, `MODEL.md` and `PAGES.md` as they stand on branch `vertical-engine`.
- I did not audit which fields the data files hold. "Likely not held" is a guess to be checked against the files and `DATA-REQUIREMENTS.md`.
- UK example values were checked on 2026-10-04; several only through secondary sources ([snippet]). Each must be re-checked against the primary page when it enters the data files.

---

## 6. Source ledger

**Read in this session (fetched and read, or PDF text extracted):** Few, Bullet Graph Design Specification (PDF); Barrio, Goldstein and Hofman, CHI 2016 (PDF); Census Reporter NYC profile and GitHub README; Tufte sparkline notebook; Tufte CSS; Wikipedia, Small multiple; Wikipedia, United Kingdom (infobox); Our World in Data UK population profile and the topic-page redesign post; Levels.fyi UK software engineer page; Trading Economics UK unemployment; Doing Business 2020 UK profile (PDF); Datawrapper posts on text in charts, annotations in bar, range and dot charts, and emphasis with colour; FT Visual Vocabulary (GitHub); Google Flights blog post of 28 August 2023; Stokes et al. abstract (arXiv); Numbeo London to New York comparison; ONS Manchester census page; ONS Explore Local Statistics quality and methodology page; GOV.UK pages on rates and thresholds 2026 to 2027, employers' liability insurance, corporation tax rates, maternity pay and holiday entitlement; Acas on the Employment Rights Act 2025; Baseball Savant percentile leaderboard (thin).

**Known only from search results, marked [snippet] in the body:** FBref scouting-reports explainer (fetch refused, 403); MLB.com article on Savant player pages (fetch refused, 406); Baseball Reference Bullpen on Black Ink; Hsee 1996; Galesic, Garcia-Retamero and Gigerenzer 2009; Zikmund-Fisher et al. 2017 and the harm-anchor study; Hullman et al. 2018; Borkin et al. 2015; Kong et al. 2018; Kim, Reinecke and Hullman 2017; Shneiderman 1996; Cleveland and McGill 1984 (via a summary); Redfin market pages and Compete Score; Nomad List; Stripe 2024 letter; Wise; Spotify Wrapped; NN/g heuristics; Data Revelations (fetch refused, 403); Datawrapper academy pages on arrow, range and dot plots; the Factbook's discontinuation and its comparison fields; Companies House fee rises and late filing penalties; employer National Insurance change of April 2025; VAT threshold change of April 2024; director identity verification from November 2025; the £12.21 to £12.71 minimum wage step.
