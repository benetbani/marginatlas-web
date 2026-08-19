# How money gets drawn: practice and evidence

Research date: 2026-08-19. Scope: external only. No site code was read or touched.

## What this document is for

A reviewer should be able to hold this against a specific chart on marginatlas and say
"this should be X instead, because Y", with a name and a URL behind the Y.

It has three parts:

- **Part A** records what real financial products actually draw, with the product named.
- **Part B** records what the perception and design evidence says, including the places
  where sources genuinely disagree.
- **Part C** is a decision table: quantity type, best encoding, second best, what to avoid, why.

Two conventions used throughout:

- Every claim carries its source name and URL.
- Pages that could not be fetched are listed as **unread** in the source ledger at the end and
  are never summarised from memory. Where a finding is known only through a search-result
  snippet rather than a page read, it is marked `[snippet]`.

---

# PART A. WHAT THE PRODUCTS DO

## A.0 The single most useful finding

Across the products where evidence is strongest, the pattern is the same and it is not
"more charts". It is: **a table or list is the primary surface, and charts are summaries
hung above it.**

925 Studios' breakdown of the Stripe Dashboard describes the Payments view as leading with
"a filterable list of recent transactions", with "monochrome sparklines, not coloured bar
charts", and colour "reserved for status signals".
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>)

AdminLTE's comparative analysis of nine fintech products says Stripe "leads with tables and
treats charts as summaries", with "right-aligned tabular figures" and a "neutral palette where
color only ever means state (succeeded, refunded, failed)". Its summary of Ramp is blunter:
"finance dashboards are to-do lists wearing charts."
(<https://adminlte.io/blog/fintech-dashboard-design-examples/>)

This is the opposite of the instinct to reach for a chart per section. For an atlas whose job
is lookup ("what is the margin for a bakery in Lisbon"), it is also the correct instinct;
see Part B.7 on lookup versus comparison.

## A.1 How a P&L or cost breakdown is drawn

**The accounting products draw a table, not a chart.** Xero's Income Statement keeps a fixed
section structure (Income, Cost of Goods Sold, Operating Expenses, Other Income/Expense) with
accounts moved between groups via a layout editor, revenue rows, expense rows, subtotals,
gross profit and net income, plus optional comparison columns. `[snippet]`
(<https://central.xero.com/0/article/Profit-and-Loss-New-US>, page itself **unread**, timed out)

QuickBooks adds proportion as a **column, not a chart**: "% of Income" is a customisation under
"Add Subcolumns for Comparison", calculating every expense as a percentage of income. Notably
it only adds that column at the far right and cannot show a prior-year % of income column
alongside. `[snippet]` (<https://quickbooks.intuit.com/learn-support/en-us/help-article/report-management/run-profit-loss-comparison-report/L6GthoBhe_US_en_US>)

**The lighter tools add one summary chart above the statement.** FreshBooks' dashboard shows a
Profit and Loss graph "broken down into income, expenses, and net profit" with hoverable monthly
revenue and expense bars and a net-profit dot per month, i.e. combined columns plus a line, and
a separate cash-based Total Profit graph. Wave offers P&L, balance sheet, cash flow overview and
an expense breakdown chart, with a Summary tab carrying income, COGS, gross profit, operating
expenses and net profit. `[snippet]`
(<https://support.freshbooks.com/hc/en-us/articles/115015407988-How-do-I-use-my-dashboard>,
<https://support.waveapps.com/hc/en-us/articles/115005085723-Understanding-your-Reports-page>)

**Waterfall is the specialist tool, and it is contested.** Sigma Computing's case for waterfalls
is that they are "ideal when you need to tell a story about change" and show "both absolute
values and relative impact", naming "the journey from gross sales to net income" as the case.
Sigma also names the limits: comparisons are "difficult without a common baseline", waterfalls
"falter when depicting parallel processes", they are "poor predictors of the future" because
they are "inherently retrospective", they may "puzzle audiences outside" finance, and they risk
becoming "cluttered and confusing" with too many categories.
(<https://www.sigmacomputing.com/blog/waterfall-charts-data-visualization>)

Kamil Franek's comparison of seven income-statement chart types is the most useful single page
found. His verdicts: the waterfall is good for "full income statement overviews" but "sucks in
visualizing trends" and is poor for non-finance audiences; small-multiple bar charts are good
for "trends & changes in time" but show only one P&L component at a time; the stacked area chart
shows "proportions and their changes in time" but "can be confusing to interpret without absolute
numbers"; and formatted tables are "great for detailed dive-ins" but make proportions less
evident and are "not a good idea" for general audiences.
(<https://www.kamilfranek.com/best-charts-for-income-statement-presentation-and-analysis/>)

**The Sankey advocacy case, flagged as advocacy.** SankeyArt (a vendor of Sankey software)
argues a Sankey shows "the complete information of the income statement" in one visualisation
and reveals grouping structure a waterfall hides, since a waterfall does not show "that, for
example, operating expenses contain both, costs for R&D and costs associated with selling".
It concedes that year-over-year change has "no simple way to add this information visually".
Franek independently rates the Sankey good for high and medium level overviews but poor for
losses and for "detailed comparisons across several years". Treat the strong claim as
commercially motivated; the structural point about grouping is fair.
(<https://www.sankeyart.com/content/blog/why-a-sankey-diagram-is-the-best-way-to-visualize-an-income-statement/>)

**Verdict for A.1:** nobody serious draws a cost base as a pie. The accounting products use a
table with a percentage column. The finance-literate presentation layer uses a waterfall for the
revenue-to-profit walk specifically, and accepts that it fails at trends and at unfamiliar
audiences.

## A.2 How a margin percentage sits next to an absolute amount

The dominant pattern is **the percentage as a small subordinate line under or beside a large
absolute number**, not as its own chart.

925 Studios on Stripe: "every metric on the home screen shows the current period alongside the
previous period in smaller text", and the home screen carries roughly five numbers (gross volume,
net volume, new customers, successful payments).
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>)

ChartMogul's MRR Movements tooltip carries "the movement amount and the number of movements with
percentage changes in parentheses as well as the date range", i.e. absolute first, percentage
parenthesised second.
(<https://help.chartmogul.com/hc/en-us/articles/6245832909852-Chart-MRR-Movements>)

QuickBooks' answer is structural: the percentage is a column in the same row as the amount, so
the two are read on one line. `[snippet]`

**Verdict for A.2:** absolute amount dominant, percentage subordinate and adjacent, on the same
line or the line below. No product found gives the percentage its own graphic when an absolute
amount is present.

## A.3 How one entity is compared to a benchmark or peer set

This is the weakest-served pattern in the products studied, which is a real opportunity.

Baremetrics Benchmarks anonymises and aggregates customer data and segments peers by ARPU, then
shows "metric values for the lower, median, and upper quartiles, as well as how your company
stacks up". So: **three peer numbers plus your position**, not a distribution curve. `[snippet]`
(<https://help.baremetrics.com/en/articles/5379918-benchmarks>,
<https://baremetrics.com/blog/how-to-use-benchmarks-by-baremetrics>)

ProfitWell Metrics (now folded into Paddle) includes benchmarking from a large company panel,
alongside cohort retention tracked by signup month. `[snippet]`
(<https://www.paddle.com/profitwell-metrics>)

The design literature's answer is much more specific than any product's: Stephen Few's bullet
graph exists precisely for one measure against one or two comparatives plus qualitative bands.
See Part B.3.

**Verdict for A.3:** products show a quartile triple and a "you are here". Nobody found draws a
peer set well. The best available form for this is the bullet graph, and it is under-used.

## A.4 How ranked lists and leaderboards are drawn

Direct product evidence here is thin: the FT Visual Vocabulary is the strongest source and it is
editorial rather than SaaS. The FT's ranking category is defined as "use where an item's position
in an ordered list is more important than its absolute or relative value", and its listed forms
are ordered bar, ordered column, ordered proportional symbol, dot strip plot, slope, and lollipop
chart. Note what is absent: no pie, no treemap, no colour-coded table.
(<https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md>)

Koyfin, the closest thing studied to a markets-grade screen, presents "charts, tables, matrices,
heatmaps" as resizable widgets, with watchlist tables as the core object and a performance graph
showing "cumulative % change since the first day on the graph". So the ranked object is a table,
and the chart is beside it. `[snippet]`
(<https://www.koyfin.com/help/mydashboards-myd/>, <https://www.koyfin.com/features/custom-dashboards/>)

## A.5 How distributions (p25/p50/p75) are shown, if at all

**Mostly they are not shown as a distribution at all.** Baremetrics reduces the distribution to
three labelled numbers (lower quartile, median, upper quartile) plus the user's position.
`[snippet]` No product studied was observed drawing a box plot or a violin to a business
audience. The FT does list histogram, boxplot, violin, dot strip plot, dot plot, barcode plot
and cumulative curve under distribution, but the FT is writing for a newspaper graphics desk.
(<https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md>)

This matters because the evidence in Part B.6 says box plots are misread even by experts. The
products' instinct to print three numbers is defensible.

## A.6 How a single headline number is presented, and what surrounds it

The consistent recipe is: **large number, small label, small comparison, optional monochrome
sparkline.**

- Stripe: five numbers on the home screen, largest size and highest weight for the primary
  metric number, current period alongside previous period in smaller text, "small sparkline
  charts show the trend direction", monochrome.
  (<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>)
- ChartMogul: summary metrics sit above the graph showing "how your metric has changed
  (increased or decreased) at key intervals in the past year: 30, 60, 180 and 365 days ago",
  with period comparison selectable as DoD, WoW, MoM, QoQ or YoY.
  (<https://help.chartmogul.com/article/282-getting-started-with-charts-in-chartmogul>)
- Mercury's marketing page is pure headline numbers with no charts at all (300K+, 1 in 3, $20B+,
  4.9, $5M), plus two decorative illustrations standing in for charts.
  (<https://mercury.com/>)

The dashboard-design literature states the same recipe explicitly: metric cards should carry
"a large, readable number with a clear label and contextual indicator like a sparkline, trend
arrow, or comparison to the prior period". `[snippet]`
(<https://uxpilot.ai/blogs/dashboard-design-principles>)

**Verdict for A.6:** a headline number is never alone. It carries a label, a comparison anchor,
and at most one word-sized graphic.

## A.7 Where they use a TABLE instead of a chart, and how they decide

The decision rule that emerges is **precision and lookup go to the table; shape and change go to
the chart; and the table is usually underneath the chart rather than instead of it.**

- ChartMogul pairs every chart with a Chart Data table that breaks the metric down by movement
  type with totals and customer counts per interval, and cells are clickable through to the
  underlying subscriptions.
  (<https://help.chartmogul.com/article/282-getting-started-with-charts-in-chartmogul>)
- Pilot's reports are explicitly not static: line items click through to underlying transactions
  and can be filtered and compared over time. `[snippet]`
  (<https://pilot.com/platform/financial-reports>)
- Stripe Sigma's entire output surface is tabular SQL results (charge IDs, dates, amounts,
  statuses, balance summaries with running totals), with charts described only as an optional
  transformation: users can "easily visualize your data by transforming reports into dynamic
  charts". Charts are the derivative; the table is the artefact.
  (<https://stripe.com/sigma>)
- Franek's rule for income statements: tables "mainly for detail breakdowns", and explicitly
  "not a good idea" for a general audience.
  (<https://www.kamilfranek.com/best-charts-for-income-statement-presentation-and-analysis/>)

## A.8 Density: how many figures per screen, and how they avoid a wall

Two opposed and both-defensible strategies were found.

**Strategy 1, ruthless subtraction.** Stripe's home screen carries about five numbers, and the
stated principle is to "show exactly what you need to act, not everything they could show".
Brex's approach is described as "surface exceptions instead of everything". Ramp puts the work
queue (bills, expenses, close progress) in prime position and pushes "analytics one level down".
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>,
<https://adminlte.io/blog/fintech-dashboard-design-examples/>)

**Strategy 2, embraced density with a strict grammar.** The Bloomberg Terminal is the reference
case: extreme data density for power users, held together by a rigid monospace grid (the original
9x19 mono font was copied pixel-by-pixel from the terminal hardware), with the design job framed
by Bloomberg itself as concealing complexity rather than removing data. When the font was later
changed, users reacted strongly enough to report headaches, which is evidence of how load-bearing
the typographic grid is when density is high. `[snippet]`
(<https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceal-complexity/>,
<https://news.ycombinator.com/item?id=40430904>)

The mechanism that makes density survivable in both strategies is the same and it is
**typographic, not chromatic**: hierarchy "enforced through typography and whitespace, not
colour", roughly six distinct sizes and weights, right-aligned tabular figures, and colour
withheld so that a coloured mark still means something when it appears.
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>,
<https://adminlte.io/blog/fintech-dashboard-design-examples/>)

**Verdict for A.8:** density is not the enemy; undifferentiated density is. The tool for
differentiating is type scale and alignment, and the budget you spend on colour is spent once.

---

# PART B. WHAT THE EVIDENCE SAYS

## B.1 Cleveland and McGill 1984: the backbone, and its limits

**The paper.** William S. Cleveland and Robert McGill, "Graphical Perception: Theory,
Experimentation, and Application to the Development of Graphical Methods", *Journal of the
American Statistical Association* 79(387), 1984.
(<https://www.tandfonline.com/doi/abs/10.1080/01621459.1984.10478080>, publisher page **unread**,
403. The ranking below is taken from secondary sources that state it.)

**The ranking**, most to least accurate:

1. Position along a common scale
2. Position along non-aligned scales
3. Length, direction, angle
4. Area
5. Volume, curvature
6. Shading, colour saturation

(<https://vizdata.org/slides/24/24-graphical-perception.html>)

**It replicates.** Heer and Bostock re-ran the experiment on Mechanical Turk and recovered the
same order, position then length then angle then area, with crowdsourced results closely aligned
to the 1984 lab study. Their paper also studied rectangular area judgements, gridline contrast,
and the effect of chart size and gridline spacing.
(<http://idl.cs.washington.edu/files/2010-MTurk-CHI.pdf>)

**Now the limits, honestly stated.**

- *It measures one thing.* The hierarchy applies to "extracting precise quantitative values",
  not to memorability, engagement, or whether a reader trusts the display.
  (<https://vizdata.org/slides/24/24-graphical-perception.html>)
- *The underlying channel attributions have shifted.* Zeng and Battle's CHI 2023 review of 59
  graphical-perception papers observes "significant changes and contradictions in encoding
  guidelines as knowledge in graphical perception continues to evolve", and gives a concrete
  example: "Cleveland and McGill treated pie charts as primarily angle encodings; however, more
  recent work suggests that pie charts are perceived more as area encodings."
  (<https://arxiv.org/pdf/2109.01271>)
- *Even bar length is not a clean constant.* The same review reports that the systematic bias in
  bars is related to bar aspect ratio: "No systematic bias is shown with square bars, while wide
  bars are overestimated, and tall bars are underestimated" (Ceja et al.), and records outright
  contradictory results between similar experiments (Godau et al. versus Xiong et al.) on
  perceived average position.
  (<https://arxiv.org/pdf/2109.01271>)
- *The literature is not tidy.* The review's own framing names "inconsistent reporting of findings
  and a lack of shared data across studies" as the two barriers to turning this body of work into
  design rules.
  (<https://arxiv.org/pdf/2109.01271>)

**How to use it.** As a tie-breaker, not a law. When two encodings both fit the message, prefer
the one higher in the ranking. Do not use it to override a task requirement, and do not cite it
as proof that a chart is "wrong" when the reader's task is lookup rather than magnitude estimation.

## B.2 Waterfall charts

**Genuinely good at:** a sequential walk from one total to another where the intermediate steps
are additive and ordered, which is exactly the revenue-to-net-income structure. Sigma: they answer
"How did X change Y between points A and B?" and reveal "where you started, ended, and how you got
there".
(<https://www.sigmacomputing.com/blog/waterfall-charts-data-visualization>)

**Documented failure modes:**

- No common baseline for the intermediate bars, so comparing two middle steps to each other is
  hard. Sigma: comparisons are "difficult without a common baseline". Independently: "it is hard
  to interpret and compare values when there is no common axis for factors appearing between the
  beginning and end". `[snippet]`
- Fails when the start and end values are large and the steps between them are small, because the
  steps become invisible slivers. `[snippet]`
- Fails at trends. Franek: it "sucks in visualizing trends" over time; Sigma: it is "inherently
  retrospective" and a poor forecast display.
- Fails with unfamiliar audiences. Sigma says it may "puzzle audiences outside" finance and
  project management; Franek independently flags it as poor for non-finance audiences.
- Degrades fast with category count; Sigma warns of becoming "cluttered and confusing".
- It hides grouping. The Sankey critique is fair on this narrow point: a waterfall does not show
  that a step contains sub-components.
  (<https://www.sankeyart.com/content/blog/why-a-sankey-diagram-is-the-best-way-to-visualize-an-income-statement/>)

**Position for an atlas read by non-accountants:** a waterfall is defensible once, for the single
revenue-to-take-home walk, and only if each step is directly labelled with its own number so the
reader never has to estimate a floating bar against a distant axis. It is the wrong tool for a
cost breakdown that the reader wants to compare across places.

## B.3 Gauges and dials

**This one has real disagreement, so here is the honest position rather than a consensus.**

**The case against is strong, consistent, and expert.**

- Stephen Few designed the bullet graph explicitly "to replace the meters and gauges that are
  often used on dashboards", stating that its "linear design not only gives it a small footprint,
  but also supports more efficient reading than radial meters".
  (<https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf>)
- The standard summary of gauges attributed to Few is that they "say little and do so poorly", and
  that gauges and meters "typically display too little information, require too much space, and
  are cluttered with useless and distracting decorations".
  (<https://en.wikipedia.org/wiki/Bullet_graph>, <https://www.staceybarr.com/measure-up/why-dashboard-dials-and-gauges-are-useless-for-kpis/> `[snippet]`)
- Peltier: gauge charts are "particularly ineffective in the display of information" because
  viewers cannot compare angles as well as lengths, and they show an instantaneous snapshot with
  no historical or situational context.
  (<https://peltiertech.com/not-gauges-again/>)
- The colour argument, which is the one that bites hardest for a one-accent palette: a dial's
  banded zones mean "our eyes are attracted to colors of greatest contrast: the red and orange
  blocks", so warning zones capture attention permanently even when nothing needs action.
  (<https://thoughtbot.com/blog/lets-talk-about-dials>)

**The credible case for is narrower than its defenders claim, but it is not zero.**

- Peltier concedes exactly one domain: aviation, where pilots have "extensive training and
  experience" plus sensory feedback that supplies the missing context. He does not extend this to
  business dashboards.
  (<https://peltiertech.com/not-gauges-again/>)
- thoughtbot concedes that dials work for "real-time analog contexts like speedometers", where
  "we only care about the current speed and the direction the speed is going", and allows a modern
  dial where "the color of the dial can change to reflect the state of the value".
  (<https://thoughtbot.com/blog/lets-talk-about-dials>)
- The perceptual case against is specifically against *angle*. Skau and Kosara found angle to be
  "the least important visual cue" in pie and donut charts, which cuts the other way too: a radial
  form read as **arc length** rather than needle angle is not carrying the weak channel.
  (<https://eagereyes.org/publications/Skau-EuroVis-2016>)

**Honest verdict on the three gauge components.** No head-to-head controlled study was found
showing that gauges cause worse *decisions*; the case against rests on expert judgement plus the
perceptual ranking plus a space-efficiency argument. That is strong evidence but it is not an RCT,
and anyone claiming otherwise is overstating. The defensible line is:

- A radial form may **restate** a value that is already printed exactly next to it, as texture.
- A radial form may **not be the only place** the value exists, and must not carry tick marks that
  imply readable precision.
- The zone bands must be one hue at varying intensity, never a red/amber/green ring, because the
  contrast argument above is the one that survives regardless of chart type.
- If the component's job is "this value against a target or a peer", a bullet graph strictly
  dominates it and should replace it.

## B.4 Donut and pie

Skau and Kosara tested arc length, centre angle and segment area separately. Findings: angle is
"the least important visual cue" for both forms, and "the donut chart [is] as accurate as the
traditional pie chart", so removing the centre (and with it the angle cue) does not hurt.
Relying on angle to read a part-to-whole "leads to high rates of decoding error".
(<https://eagereyes.org/publications/Skau-EuroVis-2016>, published in *Computer Graphics Forum*
35(3), EuroVis 2016)

Cleveland and McGill's own remedy was to propose alternatives to pie charts that "employ
higher-order perceptual tasks". `[snippet]` Few is categorical for part-to-whole: "Bars only
(horizontal or vertical)", with stacked bars used "only when you must display measures of the
whole as well as the parts".
(<https://www.perceptualedge.com/articles/ie/the_right_graph.pdf>)

The one genuine concession in the literature is that pies read gross proportions well: pie charts
"can show 'roughly half' well".
(<https://vizdata.org/slides/24/24-graphical-perception.html>)

**When a single-value arc is still acceptable.** When there is exactly one proportion, the reader
only needs the gross magnitude ("about a third"), the exact number is printed inside or beside the
arc, and it is read as arc length rather than as an angle between two radii. That is a progress
ring, not a pie. As soon as there are two or more slices to compare against each other, the
evidence says use bars.

## B.5 Zero baselines: bars versus lines

**The practitioner rule.** Bar charts must start at zero because the bar's length is the encoding;
line charts may crop because position and slope are the encoding. Observable states it plainly:
we read bar charts "by comparing the length of bars", so cropping distorts the comparison, and
area charts follow the same rule where area is meaningful. The standard escape hatch is Gelman's:
"if zero is in the neighborhood, invite it in!"
(<https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is>)

**The evidence disagrees with the second half of that rule.** Correll, Bertini and Franconeri
("Truncating the Y-Axis: Threat or Menace?", CHI 2020) ran three experiments. Truncation
"consistently inflated perceived effect severity" across *both* bar and line charts, with "no
significant difference" between the two visualisation types. Explicit visual indicators of
truncation, broken axes and gradient fills, did not rescue it: "neither intervention had a
consistent impact on perceived severity". Nor did making people read the numbers: "accurate
estimation of values does not seem to counteract the visual magnification of difference". Their
conclusion is not a new rule but a rejection of rule-following: there is "no obvious way for
designers to relinquish the responsibility of considering effect size", and designers should
"consider the scale of the meaningful effect sizes and variation they intend to communicate,
regardless of the visual encoding".
(<https://ar5iv.labs.arxiv.org/html/1907.02035>)

A later systematic exploration exists, "To Cut or Not To Cut? A Systematic Exploration of Y-Axis
Truncation", CHI 2024 (<https://dl.acm.org/doi/10.1145/3613904.3642102>), but it is **unread**
here (403) and its findings are deliberately not summarised.

**The honest position.**

- For bars, the rule is uncontested. Start at zero. There is no serious dissent.
- For lines, the practitioner rule permits cropping, but the strongest experiment says readers
  are misled anyway and that warning them does not help. So cropping a line is a choice to
  overstate, and the burden is to justify the range chosen, not to add a break marker and
  consider the problem solved.
- The practical instruction that follows from Correll et al. is: pick the axis range from the
  size of the effect that actually matters (for net margin, a few percentage points is a real
  difference), and hold that range constant across comparable charts so the reader can compare
  between them.

## B.6 Tables versus charts for lookup

The task split is the finding, and it is old and stable.

- **Lookup favours tables.** Tasks performed by reading individual data points are done "as well
  as or better than with graphs" using tables; accuracy was higher and reaction time faster with
  tables than with line graphs when reading off individual values. `[snippet]`
- **Comparison favours charts.** Performance was better with graphs than tables for tasks
  requiring comparison of differences between pairs of data points. `[snippet]`
  (Both via <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3876463/>)

Gelman's discussion paper "Why Tables Are Really Much Better Than Graphs" (*Journal of
Computational and Graphical Statistics*) is a satirical title arguing the reverse, but his
concessions are the useful part: tables win when precise values matter, when the dataset is small
with many variables, and when the task is looking up a specific data point. Discussants push back
that tables encourage passive reading.
(<https://sites.stat.columbia.edu/gelman/research/published/tables5.pdf>)

**Application.** An atlas page whose reader arrives asking "what is the number for my trade in my
city" is a lookup surface. That argues for the number, in a table or a labelled row, as the
primary object, with charts earning their place only where the reader's job is genuinely
comparison (this place versus others, this trade versus others, now versus then).

## B.7 Bar chart ordering

Sort by value unless the categories carry a real order. Few is explicit for the ranking message:
"Bars only", and "To highlight high values, sort in descending order; to highlight low values,
sort in ascending order".
(<https://www.perceptualedge.com/articles/ie/the_right_graph.pdf>)

The cost of not sorting is cognitive: an unordered chart "forces the viewer to exert cognitive
effort, jumping haphazardly between bars to compare magnitudes". `[snippet]`

Two legitimate exceptions:

1. The category has an intrinsic order (age bands, poor/fair/good, time). Few's nominal versus
   ordinal versus interval distinction governs this; time is ordinal and must never be re-sorted
   by value.
2. The reader's task is lookup of a known label in a long list, for example finding their own
   country among fifty. Then alphabetical wins because the task is lookup, which is B.6 again.
   `[snippet]` (<https://blogs.sas.com/content/iml/2023/11/13/avoid-alphabetical-order.html>,
   <https://data.europa.eu/apps/data-visualisation-guide/sorting-bars>)

## B.8 Small multiples versus one dense chart

Tufte's claim: small multiples "answer directly by visually enforcing comparisons of changes, of
the differences among objects, of the scope of alternatives", and "for a wide range of problems
in data presentation, small multiples are the best design solution". `[snippet]`
(<https://en.wikipedia.org/wiki/Small_multiple>)

Measured support exists but is task-specific: in a comparison of visualisations for correlation
over space and time, completion time was faster with small multiples, with single bar charts
slower by roughly 27 to 32 seconds on geographic tasks and with higher error rates. `[snippet]`
(<https://arxiv.org/pdf/1907.06399>)

Franek's income-statement application is the concrete version: small-multiple bar charts are the
right tool for "trends & changes in time", with the honest cost that each panel shows one P&L
component and "all other items are out of focus".
(<https://www.kamilfranek.com/best-charts-for-income-statement-presentation-and-analysis/>)

**Rule:** when the question is "how do these many things compare on one measure", use small
multiples with a shared scale. When the question is "how do these few series relate within one
frame", one chart. Never solve "many series" by adding colours; that is B.11.

## B.9 Direct labelling versus legends

Direct labelling wins, and the mechanism is eye movement: with a legend, viewers' eyes "zig-zag
back and forth" between the mark and the key, which is time-consuming. The goal of direct
labelling is to place the label "as close as possible to the actual line" so that round trip
disappears. `[snippet]`
(<https://depictdatastudio.com/directly-labeling-line-graphs/>,
<https://www.practicalreporting.com/blog/2024/9/17/avoid-legends-footnotes-and-other-forms-of-indirect-labeling-in-your-charts-whenever-possible>)

Note the interaction with B.11: a legend is a colour-lookup device, so removing legends and
removing categorical colour are the same move. A directly labelled chart usually needs one hue.

ChartMogul supports this in product form: it offers an explicit "Show Labels" toggle to print
values on the plotted points.
(<https://help.chartmogul.com/article/282-getting-started-with-charts-in-chartmogul>)

## B.10 Sparklines

**Tufte's original claim.** A sparkline is "a small, intense, simple, word-sized graphic with
typographic resolution" (*Beautiful Evidence*, 2006). His framing: sparklines are "datawords",
they can go "everywhere a word or number can be", and they carry no frames, tick marks or
non-data paraphernalia, with a data-ink ratio of 1.0. `[snippet]`
(<https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/>)

**The evidence since is a split verdict, and the split is the useful part.** Users can use
sparklines to perceive patterns, compare patterns across time and discover anomalies at
reasonable rates of success, but they "performed more poorly using sparklines for tasks requiring
precise data lookup". Their condensed form presents a great deal of information "albeit at low
precision". `[snippet]`
(<https://www.microsoft.com/en-us/research/wp-content/uploads/2010/01/sparkclouds_infovis2010.pdf>;
also an accounting-specific study, "Testing the feasibility of small multiples of sparklines to
display semimonthly income statement data", *International Journal of Accounting Information
Systems*, <https://www.sciencedirect.com/science/article/abs/pii/S1467089512000590>, which is
**unread**, 403)

**Rule:** a sparkline is a shape cue attached to a number, never a substitute for it. Stripe's
usage is the correct model: monochrome, unframed, next to the figure it describes.
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>)

## B.11 Colour

**The three scale types.** Sequential for ordered data low to high, where "lightness steps
dominate the look of these schemes"; diverging for data with a meaningful midpoint, putting
"equal emphasis on mid-range critical values and extremes at both ends"; qualitative for nominal
categories, where hue does the separating and no magnitude is implied.
(<https://colorbrewer2.org/learnmore/schemes_full.html>)

**How many categories a reader can hold.** The commonly stated practical ceiling is six to eight
distinct hues, beyond which viewers stop reliably matching legend to mark; some guidance stretches
to ten, and Adobe Spectrum's position is that categorical colour becomes harder at six and
"extremely difficult" at twelve. The recommendation when you exceed it is to merge categories or
change chart type, not to add hues. `[snippet]`
(<https://policyviz.com/2023/05/31/why-are-six-colors-common-in-color-palettes-for-data-visualization/>,
<https://www.atlassian.com/data/charts/how-to-choose-colors-data-visualization>)

**Colour is the weakest quantitative channel.** It sits last in Cleveland and McGill (shading,
colour saturation). Few is blunt: you can tell one shape is darker than another "but it's
difficult to tell by how much", and using colour to represent quantitative values "results in a
visual puzzle that's very difficult for most people to interpret".
(<https://www.perceptualedge.com/articles/ie/the_right_graph.pdf>)

**Never encode meaning by colour alone.** WCAG 2 Success Criterion 1.4.1 requires that colour is
not the only visual means of conveying information. Roughly 1 in 12 men and 1 in 200 women have
some colour vision deficiency, so charts need labels, patterns, position or text as a redundant
channel. `[snippet]`
(<https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-without-color.html>)

**The single-hue-intensity rule has an authoritative source.** Few's bullet graph specification
requires exactly this for the qualitative bands: "Rather than using distinct hues, which might not
be distinguishable by those who are colorblind, encode these ranges as distinct intensities from
dark to light of a single hue." He gives the exact values (three ranges: 40%, 25% and 10% black)
and caps the number of ranges at five, "ideally three", because more "would require a level of
perceptual reasoning that is not efficient enough for a dashboard".
(<https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf>)

Two further constraints from the same spec worth carrying: darker intensities mean the poor
states and lighter the favourable ones; and when a measure is good-when-low (expenses, defects),
reverse the band sequence rather than switching to a second hue.

**Product corroboration.** Stripe's practice, per the two analyses read, is colour reserved for
state only, with the stated reason: "When every data point is coloured, colour loses meaning."
(<https://www.925studios.co/blog/stripe-dashboard-design-breakdown>)

## B.12 Money formatting

**Tabular figures are not optional in a financial table.** Tabular lining figures (CSS
`font-variant-numeric: lining-nums tabular-nums`) give every digit the same advance width, so a 1
occupies the same space as an 8 and columns align vertically. This is described as the standard
for financial interfaces. `[snippet]`

**Alignment.** Convention is text left, numbers right, because right alignment lets readers
"compare digits by place value", stacking hundreds over hundreds and thousands over thousands.
Headers should match the alignment of the column beneath them. Decimal alignment is the classical
ideal; the practical substitute in a web product is tabular figures plus consistent trailing
zeros (54.00 rather than 54) so nothing shifts. `[snippet]`
(<https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables>,
<https://www.eleken.co/blog-posts/table-design-ux>)

**Negative numbers.** Two live conventions, and which one is correct depends on the register.
Accounting and financial-statement convention wraps negatives in parentheses, and brackets should
sit *outside* the digit alignment so the digits still stack. General numeric convention uses a
leading minus. `[snippet]` For an editorial atlas read by non-accountants, the minus is safer;
parentheses are a genre signal that only pays off with readers who already read statements.
Whichever is chosen, apply it once, everywhere.

**Abbreviation.** No controlled study comparing "47.3k" with "47,300" for accuracy was found, so
this is convention rather than evidence. The defensible line drawn from the density guidance is:
abbreviate in headline and chart-axis positions where the reader needs magnitude, print full
digits wherever the reader might transcribe, compare precisely, or check the figure. Excess
precision is itself a cost: displaying 24.5932% rather than 24.6% "adds cognitive noise" without
improving most decisions. `[snippet]`
(<https://uxpilot.ai/blogs/dashboard-design-principles>)

**Currency placement.** No authoritative source on placement was successfully fetched; the fintech
typography article that covers it returned 403 and is **unread**. Treat placement as a locale
question (symbol before the amount in en-US/en-GB, after in much of Europe) and as a house-style
decision, not as something this research settles.

**Consistency of significant figures within a column** is stated repeatedly as a table rule: keep
the number of decimals constant down a column so the eye can compare place values. `[snippet]`

---

# PART C. THE DECISION TABLE

Read it as: if the quantity is in column 1, draw column 2; if column 2 is impossible, draw
column 3; never draw column 4; and column 5 is the sentence you say in the review.

| Quantity type | Best encoding | Second best | Avoid | Why |
|---|---|---|---|---|
| **Part-to-whole of a cost base** (revenue split into COGS, rent, wages, tax, owner take) | Table of rows with the amount and a percent-of-revenue column, plus a short inline single-hue bar per row on a shared scale | One horizontal 100% stacked bar, directly labelled, if and only if categories are 5 or fewer and only the shape matters | Pie or donut with more than one slice to compare; treemap; a second hue to mean "bad cost" | Few for part-to-whole is "Bars only", stacked "only when you must display measures of the whole as well as the parts"; angle is the least important cue even inside a pie (Skau and Kosara); the percent column is how Xero and QuickBooks actually do it |
| **A sequential walk from one total to another** (revenue down to owner take-home) | Waterfall, each step directly labelled with its own number, at most 6 to 7 steps | Table with a running-balance column | Waterfall used for trends over time, for forecasts, or with many small steps between two large totals | Waterfalls show "where you started, ended, and how you got there" (Sigma) but have no common baseline for intermediate steps and "suck in visualizing trends" (Franek) |
| **A single percentage** (net margin 11.4%) | The number, large, with a comparison anchor beside it in smaller type (peer median or prior period) | The same number plus a thin single-hue bullet bar beneath it | Gauge or dial as the carrier of the value; donut arc with tick marks; the percentage with no anchor | Angle is a weak channel and gauges "say little and do so poorly" (Few); every product studied prints the number large with a smaller comparison beside it (Stripe, ChartMogul) |
| **A currency amount with a range** (take-home $38k, range $24k to $61k) | Point plus range bar on a common horizontal scale, the point and both ends labelled | The number, with the range spelled out in text beneath it | A plain bar whose length is the midpoint; box-plot styling; error bars with no explanation | Position along a common scale is the top-ranked channel; a solid bar implies a precision the range denies; box plots are misread even by experts (B.6) |
| **One value against a benchmark or target** | Bullet graph: measure bar, comparative tick, 3 qualitative bands as intensities of one hue | Paired dot plot, this value and the benchmark on one scale, connected, both labelled | Gauge; red/amber/green bands; a percentage-difference sentence with no scale to place it on | This is the exact case Few designed the bullet graph for, and his spec mandates single-hue intensities for colourblind safety, which matches the one-accent palette constraint |
| **A ranked list of 5 to 20 items** | Horizontal bars sorted by value, zero baseline, one hue, values labelled directly at the bar end | Dot strip or lollipop when values cluster far from zero or bars feel too heavy | Alphabetical order when the task is ranking; truncated axis; a hue per row; pie | Few: ranking is "Bars only", sorted descending to highlight high values; unordered charts force the eye to jump; bars encode length so zero is mandatory (uncontested) |
| **A distribution (p25/p50/p75)** | Three labelled numbers plus a p25-to-p75 range bar with a p50 marker on a common scale | Strip plot of the actual units, or a histogram if there are enough units and the shape carries meaning | Box plot for a general audience; a single average with no spread; violin plots | Box plot misreading is "due to heuristic reasoning and is very difficult to overcome", found in experts too; typically under 20% of even graphically literate audiences can read one; Baremetrics ships three numbers for this reason |
| **Change over time** | Line or connected dots with direct end labels and a constant axis range across comparable charts | Columns when individual periods matter more than the shape; a monochrome sparkline when it lives inside a row or sentence | Dual axes; area fill where the area is not a quantity; truncating the axis and calling a break marker sufficient; re-sorting time by value | Few: lines for pattern, bars for individual values, time always horizontal; Correll et al. found truncation inflates perceived effect in both bars and lines and that break indicators do not fix it |
| **A geographic distribution** | Choropleth for a rate or ratio, sequential single-hue, 5 bins or fewer; proportional symbols for a count or magnitude | A sorted bar chart of places, when precise ranking matters more than location | Choropleth of raw counts; diverging two-hue scale with no real midpoint; more than about 7 bins | The rate-versus-count split is the FT Visual Vocabulary's explicit rule; colour is the weakest quantitative channel, so a map shows pattern and a table must carry the lookup |
| **Two entities compared across many metrics** | Small multiples: one aligned row per metric, both entities on a scale shared within that row, numbers printed | Two-column table with an explicit difference column | Radar or spider chart; one dense multi-series chart mixing units; colour-coded matrices as the only encoding | Small multiples measurably beat single dense charts on comparison time and error; radar encodes by area and angle, both weak channels, and its shape changes arbitrarily with axis order |

### Cross-cutting rules that apply to every row

1. **Print the number.** Every chart in this table assumes the exact figure is visible. None of
   the encodings above is asked to carry precision by itself.
2. **Direct labels, no legend.** If a chart needs a legend, it probably needs to be small
   multiples or a table instead (B.8, B.9).
3. **One hue, intensity for good versus bad.** Sourced, not just a house preference: Few's bullet
   graph spec mandates it, and WCAG 1.4.1 forbids colour-alone encoding (B.11).
4. **Zero baseline for anything whose length or area is the encoding.** Uncontested for bars.
5. **Constant axis range across charts the reader will compare.** This follows from Correll et
   al.: the axis range is an editorial claim about what size of difference matters.
6. **Sort by value unless the category has an intrinsic order or the task is label lookup.**

---

# What this cannot establish

Stated plainly, because several of the limits are severe.

1. **Marketing pages show a best case, not a typical screen.** Almost every Part A product page
   fetched was marketing copy. Mercury's homepage contained no charts at all, only headline
   numbers and two decorative illustrations. Ramp's page contained no visualisations whatsoever.
   Neither tells you what the logged-in product looks like on a Tuesday with messy data.
2. **Much of Part A is second-hand.** The two richest product sources, 925 Studios and AdminLTE,
   are third-party design analyses, not the products. They are consistent with each other and
   with Stripe's own documentation, which is why they are used, but they are commentary. No
   authenticated product screen was viewed for any product in this research.
3. **Perceptual studies measure reading precision, not trust or taste.** Cleveland and McGill
   measures how accurately a reader extracts a magnitude. The founder's question, whether a page
   looks like a premium editorial almanac and feels credible, is not what any study cited here
   measures. The hierarchy applies to "extracting precise quantitative values" and its own
   sources say the "best" chart depends on task and audience.
4. **The perceptual literature is less settled than its popular summary.** Zeng and Battle
   document "significant changes and contradictions in encoding guidelines", contradictory
   results between similar experiments, and bar-length bias that varies with aspect ratio. Anyone
   quoting the 1984 ranking as settled law, including this document's Part C, is compressing a
   contested literature into a heuristic.
5. **Two live questions were not resolved by evidence.** The gauge question rests on expert
   judgement, not a controlled study of decision quality; no head-to-head experiment was found.
   The abbreviation question (47.3k versus 47,300) has no study behind it at all, only convention.
   Both are marked as such in the body.
6. **Register was not tested.** Everything here is about accuracy and convention. Whether a
   waterfall reads as "premium editorial almanac" or as "consulting deck" is an aesthetic
   judgement no source consulted addresses.
7. **The atlas's own reader was not studied.** No source here concerns a small-business owner
   looking up a benchmark. The lookup-versus-comparison evidence (B.6) is the closest proxy and
   it is a generic finding, not a finding about this audience.

---

# Source ledger

## Read in full or substantially

| Source | URL |
|---|---|
| Few, Bullet Graph Design Specification (2013), full text extracted from PDF | <https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf> |
| Few, "Eenie, Meenie, Minie, Moe: Selecting the Right Graph for Your Message" (2004), full text extracted from PDF | <https://www.perceptualedge.com/articles/ie/the_right_graph.pdf> |
| Correll, Bertini, Franconeri, "Truncating the Y-Axis: Threat or Menace?", CHI 2020 | <https://ar5iv.labs.arxiv.org/html/1907.02035> |
| Zeng and Battle, "A Review and Collation of Graphical Perception Knowledge for Visualization Recommendation", CHI 2023, targeted extraction from PDF | <https://arxiv.org/pdf/2109.01271> |
| Heer and Bostock, "Crowdsourcing Graphical Perception", CHI 2010 | <http://idl.cs.washington.edu/files/2010-MTurk-CHI.pdf> |
| Gelman, "Why Tables Are Really Much Better Than Graphs" | <https://sites.stat.columbia.edu/gelman/research/published/tables5.pdf> |
| Skau and Kosara, "Arcs, Angles, or Areas", EuroVis 2016 | <https://eagereyes.org/publications/Skau-EuroVis-2016> |
| FT Visual Vocabulary, all nine categories and chart lists | <https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md> |
| Observable, "It's never okay to crop the y-axis, except when it is" | <https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is> |
| Peltier, "Not Gauges Again!" | <https://peltiertech.com/not-gauges-again/> |
| thoughtbot, "Let's Talk About Dials" | <https://thoughtbot.com/blog/lets-talk-about-dials> |
| Wikipedia, Bullet graph | <https://en.wikipedia.org/wiki/Bullet_graph> |
| Sigma Computing, waterfall charts | <https://www.sigmacomputing.com/blog/waterfall-charts-data-visualization> |
| Franek, best charts for income statement | <https://www.kamilfranek.com/best-charts-for-income-statement-presentation-and-analysis/> |
| SankeyArt, Sankey for income statements (advocacy source, flagged) | <https://www.sankeyart.com/content/blog/why-a-sankey-diagram-is-the-best-way-to-visualize-an-income-statement/> |
| 925 Studios, Stripe Dashboard design breakdown | <https://www.925studios.co/blog/stripe-dashboard-design-breakdown> |
| AdminLTE, nine fintech products analysed | <https://adminlte.io/blog/fintech-dashboard-design-examples/> |
| ChartMogul help, MRR Movements chart | <https://help.chartmogul.com/hc/en-us/articles/6245832909852-Chart-MRR-Movements> |
| ChartMogul help, getting started with charts | <https://help.chartmogul.com/article/282-getting-started-with-charts-in-chartmogul> |
| Stripe Sigma | <https://stripe.com/sigma> |
| ChartMogul homepage | <https://chartmogul.com/> |
| Mercury homepage | <https://mercury.com/> |
| Ramp homepage | <https://ramp.com/> |
| Baremetrics features | <https://baremetrics.com/features> |
| ColorBrewer scheme documentation | <https://colorbrewer2.org/learnmore/schemes_full.html> |
| vizdata.org graphical perception teaching slides (Cleveland and McGill ranking plus caveats) | <https://vizdata.org/slides/24/24-graphical-perception.html> |

## Fetched but thin (little or no visual detail recoverable)

Stripe Sigma, Baremetrics features, Mercury, Ramp, and the Stripe support page on home-page
charts (<https://support.stripe.com/questions/dashboard-home-page-charts-for-business-insights>)
all returned marketing or help copy with almost no description of chart form. Their thinness is
itself reported as a finding in the blind spot section.

## UNREAD (attempted and failed; deliberately not summarised)

| Source | URL | Reason |
|---|---|---|
| Cleveland and McGill 1984, publisher page | <https://www.tandfonline.com/doi/abs/10.1080/01621459.1984.10478080> | 403. The primary paper was **not** read; the ranking is quoted from secondary sources |
| "To Cut or Not To Cut? A Systematic Exploration of Y-Axis Truncation", CHI 2024 | <https://dl.acm.org/doi/10.1145/3613904.3642102> | 403 |
| Correll's own Medium write-up of the truncation study | <https://mcorrell.medium.com/truncating-the-y-axis-threat-or-menace-d0bce66d4d08> | 403 |
| Sparklines for semimonthly income statement data, *Int. J. Accounting Information Systems* | <https://www.sciencedirect.com/science/article/abs/pii/S1467089512000590> | 403 |
| The Economist, "Mistakes, we've drawn a few" | <https://www.economist.com/graphic-detail/2019/03/27/mistakes-weve-drawn-a-few> | Blocked by fetcher |
| Shopify Polaris data visualisation guidance | <https://polaris.shopify.com/design/data-visualizations> | Redirect not followed |
| "The elements of fintech typography, part 1: readable money" | <https://medium.com/design-bootcamp/the-elements-of-fintech-typography-part-1-readable-money-b6c1226acbde> | 403. This is why currency placement is left unresolved |
| Xero Central, Income Statement report | <https://central.xero.com/s/article/Profit-and-Loss-New-US> | Timed out |
| Stripe dashboard getting-started doc | <https://docs.stripe.com/get-started/dashboard> | 404 |

## Known only via search snippets, marked `[snippet]` in the body

Xero P&L structure, QuickBooks "% of Income" column, FreshBooks dashboard graphs, Wave reports,
Pilot dashboards and reports, Baremetrics Benchmarks quartiles, ProfitWell/Paddle metrics, Koyfin
widgets, Bloomberg Terminal density and typography, PitchBook and tearsheet composition, Runway
and Causal, box-plot misinterpretation research, small-multiples timing results, bar-ordering
guidance, colour-count ceilings, WCAG 1.4.1, table alignment conventions, sparkline evaluation
results, and number-abbreviation guidance.

## Requested but not covered at all

Brex, Xero and QuickBooks product screens (only help-doc snippets), Bench, Pry and Finmark (no
usable source found), and any direct read of a Bloomberg Terminal or PitchBook screen.
