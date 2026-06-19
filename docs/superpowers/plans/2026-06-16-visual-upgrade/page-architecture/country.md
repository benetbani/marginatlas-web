# Page architecture: Country (e.g. United Kingdom)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: the nine-lens radar is REPLACED by a seven-row strength matrix, seven sample cards collapse to one strip). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

## Purpose & the one job

This page answers, for one country, the only question a prospective small-business owner brings to it: **what it costs, what you keep, and how hard it is to run a small business here**, so the reader can decide whether the country itself is a yes or a no before they ever drill into a city or a trade.

The single focal point is the **country name set large in Newsreader over the faded engraving**, with **one defensible headline number** seated immediately beneath the answer line. For the United Kingdom exemplar that anchor is the **typical small-business tax burden (19%)**. For thin countries the anchor falls back, in order, to: days-to-register, then cost-to-register, then self-employed share. The anchor is always a real, like-for-like-safe figure, never raw money that cannot be ranked across geographies.

Everything below the hero is **lens-grouped** (Reward & cost, People, Demand, Comparison & edge, Risk, The place, The close) and skimmable. The page reads as a calm commercial product, almanac-dense in information but never dense to the point of unreadability. Cities are the ONLY scored entity on the site; this page never scores its own cities and never crowns a winner across price regimes.

This file supersedes the locked `03-country.md` on two ratified points: (1) the nine-lens shape is **fully reinvented** (the radar is rejected), and (2) the unheld lenses render as **visible, clearly-labelled "sample / coming soon" cards**, NOT the single collapsed "still filling in" strip. The honesty rules, section order as a subsequence, and the seven real gate-bearing beats are unchanged.

---

## The full section + subsection list (in visual order)

Global chrome (full navbar, rich footer) and universal assets (world-map motif, icon set, section dividers) wrap the whole page. Every content section sits in its OWN bordered card per the ratified global rule.

| # | section | subsection(s) | exact chosen visual (shadcnblocks block where applicable) | layout | data | hierarchy weight |
|---|---------|---------------|-----------------------------------------------------------|--------|------|------------------|
| 0a | **Global navbar** (site-wide chrome) | logo; topic dropdowns Countries / Industries / Cities / Compare; search; primary CTA | `navbar1` (Navbar category), full menu with dropdowns + search field + one CTA button | sticky bar, full-bleed | real (nav data) | chrome |
| 0b | **Breadcrumb + world-map motif band** | Home / United Kingdom; the stylized world-map motif with the country lit | thin band; universal world-map SVG motif (country region highlighted in one terracotta) | stacked, full-bleed | real | chrome |
| 1 | **Hero / masthead** | country name; flag; eyebrow; fixed subtitle; answer line; the ONE anchor number; quiet AddToWatch | kept `EngravedHero` shell re-skinned toward `hero2` proportions; faded `CountryMastheadImage` engraving backdrop, no colour wash | card-less full-bleed masthead, stacked; most generous top/bottom padding on the page | real (anchor = typical SMB tax %) | **hero** |
| 2 | **Scorecard (8 metrics)** | GDP/cap, avg salary, net wealth/adult, days to start, ease of business, minimum wage, population, cost of living | **STAT-CARD GRID, `stats-card1`** re-skinned; 4-up at 1280, 2-up at 375; **quiet weak-to-strong band tint per cell** on the clay-to-moss meaning scale | own bordered card; internal grid (4-up / 2-up) | real (per-cell, dash + "not held" where missing) | **primary** |
| 3 | **The country shape: nine lenses** | reward / cost / entry / people / demand / edge / risk / momentum / path | **FULL REINVENTION (radar rejected).** Recommended: **labelled nine-row strength matrix** (see signature graphics for the 3 options + recommendation). A qualitative character profile, never a single score | own bordered card; stacked rows (or two-column small-multiples per the chosen option) | modeled (Momentum + Path tagged SAMPLE) | **primary** |
| — | *Divider: Reward and cost* | rosette/contour `AtlasDivider` seam | universal section divider | full-bleed seam | n/a | seam |
| 4 | **Cost and rules to set up** | the stepper (register & trade); the held tax/payroll/time `dl`; the formation-cost table by legal tier; sales-tax note; one down-link | **STEPPER (`SetupStepper`) + formation-cost table (`data-table1` → `BusinessFormationCosts`)** | own bordered card (the page's first heavy card); two-column inside (stepper + `dl` left/top, table folded beneath a hairline) | real (GATE id `decisive`) | **primary (heaviest)** |
| 5 | **Licences** | what it will show; one calm checklist outline | **visible labelled SAMPLE card**, `LicenceCheck` checklist frame in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| 6 | **Where the margin leaks** (cost signature) | rent / labour / tax 3-bar, biggest flagged | **visible labelled SAMPLE card**, re-skinned `chart-card1` 3-bar in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| — | *Divider: People* | seam | universal section divider | full-bleed seam | n/a | seam |
| 7 | **Hiring and the cost of a team** | wage-floor / typical-pay / on-cost bullets; payroll-on-cost vs neighbours bars | kept `HiringRead` (held facts as bullets) + **`ComparisonBars`** (payroll vs neighbours, honesty caveat) | own bordered card; two-column (bullets left, comparison bars right at ≥880px; stacked at 375) | real (GATE id `hire`) | **primary** |
| 8 | **The talent reality** | what it will show | **visible labelled SAMPLE card**, `TalentReality` in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| — | *Divider: Demand* | seam | universal section divider | full-bleed seam | n/a | seam |
| 9 | **Who has money to spend** | one calm rung read ("Comfortable") + plain-words explanation | kept `WhoHasMoney` spending-power read; rung figure + caption, spend-mix omitted (no fabricated split) | own bordered card, stacked | modeled | secondary |
| 10 | **How far you can reach** | one real population figure (lead); reach indicators self-omit under one caveat | kept `HowFarYouReach`, population real (Newsreader big-figure) | own bordered card, stacked | modeled (population real) | secondary |
| 11 | **The opportunity gap** | what it will show | **visible labelled SAMPLE card**, `OpportunityGap` in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| 12 | **Same business, here vs abroad** | what it will show; mirror bars | **visible labelled SAMPLE card**, `SameBusinessAbroad` mirror bars in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| 13 | **Special zones and structures** | what it will show; self-omits where none exist | **visible labelled SAMPLE card**, `SpecialZones` cards in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| — | *Divider: Comparison and edge* | seam | universal section divider | full-bleed seam | n/a | seam |
| 14 | **Versus the neighbours** | the like-for-like FACTS table; the "never a league table" caveat | **FACTS TABLE** (kept `Neighbours`), **home country (UK) column tinted, never crowned a winner**, `noLeaderMark` | own bordered card (the page's most load-bearing comparison); stacked; table horizontally scroll-contained at 375 | real (GATE id `neighbours`) | **primary** |
| — | *Divider: Risk* | seam | universal section divider | full-bleed seam | n/a | seam |
| 15 | **The ground under you** (ground risk) | low-corruption + ease (real, score bars); political-stability + currency (sample, hatched, tagged); one summary line | kept `GroundUnderYou` factor read; real factors lead, two sample factors carry "sample" tag | own bordered card, stacked | modeled (2 real, 2 sample) | secondary |
| — | *Divider: The place* | seam | universal section divider | full-bleed seam | n/a | seam |
| 16 | **Cities** | uniform equal-weight city cards; quiet city-link chip row beneath | **UNIFORM equal-weight city cards** (kept `CitiesGrid`); climate dot = 3 for ALL; **NEVER ranked** | own bordered card; internal grid (4-up / 2-up / 1-up) | real (GATE id `cities`) | **primary** |
| 17 | **Easiest businesses to break into** | ranked activity list, link-gated readiness | kept `EasiestToBreakIn` ranked list; ranks ACTIVITIES within the country (allowed), link-gated to trusted-local cells; scores shown only where `openingHref` exists | own bordered card, stacked | modeled (ranked, link-gated) | secondary |
| 18 | **Character** | culture/government spectra sliders; two people-stats | kept `CharacterPanel` engraved spectra + stats | own bordered card; two-column (spectra left, stats right at ≥560px) | real (GATE id `character`) | secondary |
| 19 | **What locals know** | short glyph-led beats list | kept `LocalsKnow` visual list; UK shows four real beats, else calm sample | own bordered card, stacked | london-exemplar | quiet |
| 20 | **What your life looks like here** | what it will show; felt bars | **visible labelled SAMPLE card**, `YourLifeHere` felt bars in SampleState, tagged "sample / coming soon" | own bordered card, stacked | sample (placeholder) | quiet |
| — | *Divider: The close* | seam | universal section divider | full-bleed seam | n/a | seam |
| 21 | **Versus the world** | one ScoreBand: subject bar + global-median tick; "not adjusted for prices" caveat | kept `VsWorld` `ScoreBand` with global-median tick (the site-wide vs-world grammar) | own bordered card, stacked | real | **primary** |
| 22 | **The honest take** | one verdict line + held ticks | kept `HonestTake` (re-skinned `cta10` calm panel, buttons omitted) | own bordered card, narrow measure; deliberately small + low | london-exemplar | quiet |
| 23 | **One quick gut-check** | three plain framed question cards | kept `GutCheck` framed cards (3 derived questions) | own bordered card; internal 3-up grid (1-up at 375) | modeled | secondary |
| 24 | **One thing to remember** | closing line; freshness stamp; flag-it link | kept `OneThing` closing line + `FreshnessStamp` + `FlagIt`, on a calm accent panel | own bordered card, narrow measure | london-exemplar | quiet |
| 25 | **Related countries** | one calm Compare CTA panel + the single button | re-skinned `cta10` calm accent panel | own bordered card; two-column (copy left, button right) | real (GATE id `related`) | **primary** |
| F | **Rich multi-column footer** (site-wide chrome) | link columns (Countries / Industries / Cities / Compare / Company); newsletter sign-up; social; legal row | `footer7` (Footer category), multi-column + newsletter + legal | full-bleed, multi-column grid | real | chrome |

Note on order: section ids follow the constitution's locked subsequence (`scorecard`, shape, `decisive`, `hire`, `neighbours`, `cities`, `character`, `related`, plus `vs-world` / `honest-take` / `gut-check` render as literal `<section id>`). The previously-collapsed unheld sections (licences, cost-signature, talent, opportunity, here-vs-abroad, special-zones, your-life) now each render as their own visible sample card per the ratified decision, keeping their constitution positions in order rather than folding into one strip.

---

## Visual hierarchy & density

The page carries 25 content sections plus chrome. It reads as **information-rich and almanac-like** (the ratified density), yet stays readable through weighting, per-section internal layout, and divider seams, not through cutting sections.

**Card-per-section, weighted four ways.** Every section sits in its own bordered card (cream-50 fill, cream-300 hairline, `--shadow-card` on heavy beats, `--shadow-subtle` on quiet ones). The cards are not uniform; weight is carried by padding, type scale, and shadow:

- **Hero** (largest type step on the site, most generous top/bottom padding, faded engraving): the one focal point.
- **Primary** (full `--shadow-card`, generous 28px padding, Newsreader values, the gate-bearing beats): scorecard, shape, decisive (heaviest), hire, neighbours, cities, vs-world, related. These set the rhythm.
- **Secondary** (lighter shadow, 22-24px padding): who-has-money, reach, ground-risk, break-in, character, gut-check.
- **Quiet** (small type, narrow measure, low on the page): licences/cost-signature/talent/opportunity/here-vs-abroad/special-zones/your-life sample cards, locals, honest-take, one-thing.

**Two-column vs stacked, chosen per section.** Per the ratified rule, internal layout is whatever fits the section best:
- **Two-column (text + visual):** decisive (stepper + `dl` beside, table folded beneath a hairline), hire (wage bullets + payroll `ComparisonBars`), character (spectra + people-stats), related (copy + button).
- **Internal grid:** scorecard (4-up), cities (4-up), gut-check (3-up), neighbours (a table, scroll-contained at narrow widths).
- **Stacked:** hero, shape (rows), who-has-money, reach, ground-risk, break-in, vs-world, honest-take, one-thing, and every sample card.

**The denser-with-MORE-sections move (replacing the collapse).** The earlier sparseness fix was a single "still filling in" strip; the ratified decision reverses that. The seven unheld lenses now appear as **seven visible, clearly-labelled "sample / coming soon" cards**, each carrying: a section icon (from the universal set), the section title, a one-line "what this will show" description, the calm placeholder visual (a checklist outline, a ghost 3-bar, ghost mirror bars, etc.) rendered at low contrast, and a single explicit `sample / coming soon` tag in cocoa, never a fabricated number, never a blank. This is denser than the strip on purpose, and it keeps order as a true subsequence. The almanac density is the goal; the discipline is that each sample card looks deliberate and identical in treatment, so the eye reads "more to come here" not "broken".

**Where it breathes.** `AtlasDivider` rosette/contour seams mark the seven lens groups (Reward & cost, People, Demand, Comparison & edge, Risk, The place, The close). The body uses `space-y-10` between heavy beats; padding steps generous-medium-generous so nothing is crammed. Sample cards get medium-quiet padding so a run of them still has air.

**Typography keeps hierarchy over a long page.** Newsreader is reserved for the hero country name, the one hero/decisive numbers, and section h2s; Inter for everything else. Tabular figures everywhere (`.num`). A ≥1.25 step ratio. This is the anti-AI-slop discipline: a flat scale over 25 sections is the tell, so weighting + dividers + reserved display type keep the page legible top to bottom.

**375 behavior.** Scorecard 4→2 columns; the nine-lens matrix stacks to full-width rows; neighbours table is horizontally scroll-contained inside its card (no page horizontal scroll); sample cards stack; all tap targets ≥44px; the navbar collapses to a sheet, the footer columns stack.

---

## The signature graphics (exact spec)

### A. The nine-lens "country shape" — FULL REINVENTION (radar rejected)

The brief requires a fresh, exquisite, information-rich treatment that reads as a **qualitative character profile, never a single score**. The radar is rejected because a nine-spoke polygon reads as a scored verdict, and cities are the only scored entity. Three fresh options, then the recommendation.

**Option 1 (RECOMMENDED): the labelled nine-row strength matrix.**
A vertical stack of nine rows, one per lens, each row a small horizontal "character strip". Per row:
- left gutter: lens icon (from the universal set) + lens name in Inter semibold (Reward, Cost, Entry, People, Demand, Edge, Risk, Momentum, Path);
- centre: a **discrete four-segment meaning bar** (weak / fair / strong / excellent), with the active rung filled in the clay-to-moss meaning scale and the rest left as cream-200 outlines, so the read is categorical, not a continuous score;
- right: the **one-word read** in Newsreader small ("Fair", "Strong", "Excellent", "Steady", "Open");
- below right, for Momentum and Path only: a cocoa `SAMPLE` tag.
A one-line sub frames it: "A character read across the nine questions an owner runs through. Read each lens on its own; this is a profile, never a score." Honesty: discrete rungs labelled weak→excellent (never a number), no aggregate, no single shape that could be mistaken for a verdict, sample lenses tagged.
- **Maps to:** kept kit primitive (a `RangeStrip`/`ScoreBand` sibling rendered nine times), re-skinned; NOT a shadcnblocks chart, because the honesty rail (discrete rungs, no aggregate, sample tag) is load-bearing and a Recharts chart would lose it.
- **Data shape:** `lenses: { id, label, icon, rung: 'weak'|'fair'|'strong'|'excellent', word: string, sample: boolean }[]` (nine items).
- **Computed geometry:** the meaning bar is four equal segments; the active index = `['weak','fair','strong','excellent'].indexOf(rung)`; segments `0..activeIndex` filled, the active segment in the meaning-scale colour (clay→cocoa→moss-600→moss-700), the rest outlined. No trig, so no geometry can drift.
- **Why recommended:** it is the most information-rich (label + categorical strength + word + sample state per lens, all scannable in a column), it cannot be misread as a score, it tints on the same clay-to-moss meaning scale as the scorecard so the two primary cards rhyme, and it degrades cleanly at 375 (rows just stack).

**Option 2: the small-multiples nine-tile grid.**
A 3×3 grid of tiny tiles, one lens each: lens name top, a single quiet rung glyph (a four-dot meter, the active dots filled on the meaning scale) centre, the one-word read beneath. Sample tiles carry the cocoa tag. Reads as a "contact sheet" of the country's character. Honesty identical (categorical, no aggregate). Strength: very compact, very almanac. Weakness: nine tiny tiles can feel busy and the one-word read gets cramped; less room for the framing.

**Option 3: the horizontal stacked "profile" bar set.**
Nine stacked horizontal bars sharing one left-aligned label gutter and one weak→excellent axis at the top, each bar filled to its rung on the meaning scale, the word read at the bar end. Essentially Option 1 with a continuous fill instead of discrete segments and a shared axis. Strength: the shared axis makes the profile shape legible at a glance. Weakness: a continuous fill on a shared axis is one step closer to looking like a score (the exact cringe we avoid), which is why Option 1's discrete rungs are preferred.

**Recommendation: Option 1, the discrete nine-row strength matrix.** It is the richest, the safest against the "radar-as-score" cringe, and it visually rhymes with the band-tinted scorecard. Build Option 1; keep Option 2 as the 375 fallback only if rows feel too tall.

### B. Scorecard — stat-card grid with per-cell band tint

- **Type:** stat-card grid, **`stats-card1`** re-skinned. 4-up at 1280, 2-up at 375.
- **Per cell:** label (Inter caps, ink-500), value (Newsreader, tabular, with a small Inter unit), and a **quiet weak-to-strong band tint** plus a one-word read ("Strong" / "Excellent" / neutral copy) with a coloured pip.
- **Band-tint computation:** each metric maps its value to a meaning rung via fixed per-metric thresholds (e.g. GDP/cap, salary, wealth, ease, days-to-start each have a weak/fair/strong/excellent cut). The cell's background carries a very low-opacity wash of the rung colour (clay→cocoa→moss), one calm tint, never a loud accent. Neutral metrics (population, minimum wage, cost of living) carry no rung colour, just an explanatory neutral line.
- **Honesty:** a null cell shows a dash + "not held", never a fabricated number; the tint is omitted for null cells.

### C. Cost-and-rules — stepper + formation-cost table

- **Stepper (`SetupStepper`):** the lead visual; station(s) for "Register and start trading" with the typical days and fee range as inline figures.
- **`dl` (held facts):** business tax / payroll on staff / time to get going / sales tax, values in Newsreader, each with a one-line plain-words gloss. Sales tax is glossed as carried by the customer, so it is not the owner's burden.
- **Formation-cost table (`data-table1` → `BusinessFormationCosts`):** folded beneath a single hairline; columns Legal form / Government fee / Typical all-in; rows by legal tier (sole trader, private limited company, limited partnership), right-aligned tabular figures.
- **Honesty:** the anchor stat (tax %) and the time figure are de-duped against the hero (the view-model drops the matching chip; the days figure lives in the time step; formation cost shows once, in the table).

### D. Hire — held facts + payroll-vs-neighbours ComparisonBars

- **Bullets:** wage floor (hourly + annual), typical skilled pay, employer on-cost %, and the "floor is rarely the rate you pay" beat, real figures bolded.
- **`ComparisonBars` (kept kit):** employer payroll on-cost, UK + IE/FR/DE/NL. **Bars scaled to the max value (France 36% → 100%); the home bar is the atlas accent, peers are cocoa.** No leader mark.
- **Computed geometry:** each bar width = `value / max(values) * 100%`. UK 14% → 38.9%, IE 11% → 30.6%, FR 36% → 100%, DE 20% → 55.6%, NL 19% → 52.8%.
- **Honesty:** the caveat "different systems fund different things, read each country on its own terms, not as a ranking" is always present; never a league-table ordering.

### E. Neighbours — like-for-like FACTS table

- **Type:** FACTS table (kept `Neighbours`), columns = countries, rows = facts (business tax, payroll on staff, cost to register, time to register).
- **Home tint:** the **United Kingdom column is tinted (atlas-50 fill, atlas-700 text), never crowned** with a winner mark; `noLeaderMark` enforced.
- **Honesty:** the caveat "not adjusted for local prices, read each column on its own terms, not as a league table" is fixed in place. Figures are per-country facts, never ranked across regimes.

### F. Vs-world — ScoreBand with global-median tick (site-wide grammar)

- **Type:** one subject bar + a vertical global-median tick on a fixed scale (GDP per capita, $0→$60K).
- **Computed geometry:** subject fill = `value / scaleMax * 100%` (UK $49K → 81.7%); median tick `left = median / scaleMax * 100%` ($6.9K → 11.5%).
- **Honesty:** "not adjusted for local prices, a bigger number means a richer customer, not an easier market". One subject only; the median is a peer tick, never a second ranked bar.

### G. Cities — uniform equal-weight cards

- **Type:** uniform city cards (kept `CitiesGrid`); every card identical weight, **climate dot fixed at 3 for all cities**, NO ordering signal, NEVER ranked. A quiet city-link chip row sits beneath.
- **Honesty:** a country never scores its own cities; uniformity is the guarantee.

### H. Break-in — ranked activity list, link-gated readiness

- **Type:** ranked list of ACTIVITIES within the country (allowed; this is not cross-geography ranking).
- **Link-gate:** the readiness bar + word read appear ONLY where a trusted-local opening cell backs the activity (`openingHref` exists); ungated rows show "Readiness fills in with a local cell" instead of a score.
- **Honesty:** scores only where backed; ranks activities, never places against places.

### I. Ground risk — factor read with sample hatching

- **Type:** factor rows; real factors (low corruption, ease of operating) lead with moss score bars; sample factors (political stability, currency) show a **hatched bar** + "no data" + a cocoa `SAMPLE` tag.
- **Computed geometry:** real bar width = the held 0-100 score (corruption 71 → 71%, ease 80 → 80%). Sample bars are a 45° repeating hatch, full width, so they read as "not held", never as a mediocre score.

---

## Shared assets used

Per the ratified "shared site-wide visual assets" decision, the page uses all three universal assets:

- **Stylized world-map motif:** appears in the breadcrumb band beneath the navbar (the country region lit in one terracotta accent), and as the faded engraving texture behind the hero (`CountryMastheadImage`, low opacity, no colour wash). It is the page's geographic signature and ties the country page to the rest of the atlas.
- **Consistent icon set:** one shared glyph family used in the nine-lens matrix row gutters, the sample-card titles (licences, cost signature, talent, opportunity, here-vs-abroad, special zones, your life), the "what locals know" beats, the AddToWatch star, and the footer columns. No ad-hoc emoji; one set, one weight.
- **Section dividers:** the `AtlasDivider` rosette/contour seams marking the seven lens groups (Reward & cost / People / Demand / Comparison & edge / Risk / The place / The close), giving the long page breathing seams.

Global chrome assets: the **full navbar** (`navbar1`: logo + Countries/Industries/Cities/Compare dropdowns + search + one primary CTA) and the **rich multi-column footer** (`footer7`: link columns + newsletter + social + legal) wrap every page including this one.

---

## Exemplar data to fill

The mockup is built for the United Kingdom, the one fully-filled exemplar, so every real/exemplar beat shows its richest state. Values are illustrative of the exemplar, not a live read.

**Hero / masthead**
- Country: United Kingdom; flag: Union Jack SVG; eyebrow: "Small-business economics · United Kingdom".
- Subtitle (fixed, 65ch): "What it costs, what you keep, and how hard it is to run a small business here."
- Answer line: "A stable place to set up and a fast one to register. The wage floor and the payroll on-cost, not the headline tax, decide what an owner actually keeps."
- Anchor number: **19%** — "Typical small-business tax burden. The charge that lands on an owner, before the customer's sales tax."
- AddToWatch: "Add the United Kingdom to your watch list".

**Scorecard (8 tiles, with band-tint reads)**
- GDP per capita $49K (Strong) · Average salary $44K (Strong) · Net wealth/adult $172K (Excellent) · Days to start 4 days (Strong) · Ease of business 83/100 (Strong) · Minimum wage $25K/yr (neutral: "Level, set by law") · Population 68.3M (neutral: "The home market") · Cost of living 132 index (neutral: "Above the global baseline of 100").

**Nine-lens shape (Option 1 matrix)**
- Reward — Fair · Cost — Fair · Entry — Strong · People — Strong · Demand — Excellent · Edge — Strong · Risk — Strong · Momentum — Steady (SAMPLE) · Path — Open (SAMPLE).
  (Underlying rungs from the rejected radar: reward .56 / cost .55 → fair; entry .80 / people .80 / risk .80 → strong; demand .90 → excellent; edge .73 → strong; momentum .50 / path .50 → sample.)

**Cost and rules to set up**
- Stepper: "Register and start trading" — 4 days typical, fee $0 to $120.
- `dl`: Business tax 19% · Payroll on staff 14% · Time to get going 4 days · Sales tax 20% (customer-carried).
- Sales-tax note: "Sales tax (Value Added Tax) registration becomes required once turnover passes the threshold."
- Formation-cost table: Sole trader registration — Free / $0; Private limited company — $15 / $120; Limited partnership — $15 / $180.
- Down-link: "See what restaurants typically keep after tax →" (to `cell-london-restaurants.html`).

**Hire**
- Wage floor ≈ $13/hr, ≈ $25,000/yr full-time · typical skilled ≈ $44,000/yr · employer on-cost ≈ 14% · "skilled staff are hard to keep, so the headline floor is rarely the rate you actually pay."
- Payroll on-cost vs neighbours: UK 14% · Ireland 11% · France 36% · Germany 20% · Netherlands 19% (France = the 100% bar).

**Licences (sample card)** — "what this will show": which activities need a national licence and the rough cost. Tag: sample / coming soon.

**Where the margin leaks (sample card)** — ghost 3-bar rent / labour / tax, biggest flagged when held. Tag: sample / coming soon.

**Talent (sample card)** — the depth and cost of the available skill pool. Tag: sample / coming soon.

**Who has money to spend** — rung: "Comfortable"; caption: blended from net wealth, typical pay, local cost of living; spend mix omitted.

**How far you can reach** — population 68.3M (the home market); reach indicators self-omit under one caveat.

**Opportunity gap (sample card)** — where demand outruns the supply of operators. Tag: sample / coming soon.

**Same business, here vs abroad (sample card)** — ghost mirror bars. Tag: sample / coming soon.

**Special zones (sample card)** — any zones or structures that change the maths; self-omits where none exist. Tag: sample / coming soon.

**Neighbours FACTS table (UK column tinted)**
- Business tax: UK 19% · IE 13% · FR 25% · DE 30% · NL 19%.
- Payroll on staff: UK 14% · IE 11% · FR 36% · DE 20% · NL 19%.
- Cost to register: UK $15 · IE $60 · FR $110 · DE $220 · NL $60.
- Time to register: UK 4 days · IE 5 days · FR 4 days · DE 8 days · NL 4 days.

**Ground under you**
- Low corruption 71 (real) · Ease of operating 80 (real) · Political stability — no data (SAMPLE, hatched) · Currency — no data (SAMPLE, hatched).

**Cities (uniform cards, climate dot = 3 for all)** — London (England), Manchester (England), Birmingham (England), Edinburgh (Scotland), Glasgow (Scotland), Bristol (England), Leeds (England), Cardiff (Wales). Chip row links beneath; London → `city-london.html`.

**Easiest to break into (ranked activities, link-gated)** — 1 Cleaning services (ungated) · 2 Hairdressing and barbers (ungated) · 3 Online retail (ungated) · 4 Cafes and coffee shops (readiness Fair, 62%, links to `cell-london-restaurants.html`) · 5 Trades and home repair (ungated).

**Character** — spectra: Insular↔Welcoming 68% · Tradition-bound↔Embraces-the-new 62% · Indirect↔Direct 55% · Erratic↔Predictable 78% · Greased↔Clean-dealing 80%. People-stats: 15% born abroad · 6% foreign-owned firms.

**What locals know (four UK beats)** — sole-trader register online in an afternoon, employer PAYE scheme is the slow step · headline high-street rent understates the real cost (rates + service charge add ~a third) · small-premises rate relief varies a few miles apart · first hire triggers pension auto-enrolment, budget the on-cost from the first payslip.

**Your life looks like here (sample card)** — felt bars on the day-to-day of operating. Tag: sample / coming soon.

**Vs the world** — GDP per capita: UK $49K (81.7% fill) vs global median $6.9K (11.5% tick), $0–$60K scale.

**Honest take** — verdict: "An easy place to start, and a hard place to keep staff cheaply." Ticks: registering a sole trader is quick and nearly free, the real cost arrives with the first hire · the wage floor rises most years, so a low-pay model has a shrinking runway · rent in strong locations takes a bigger bite than tax does.

**Gut check (3 questions)** — 1 Can the local customer actually pay the price your numbers need, week in and week out? · 2 After business tax and payroll on every wage, is there a real margin, or only one at hobby scale? · 3 Registering is the easy part; have you tested demand before committing a lease?

**One thing to remember** — "Cheap to open here, expensive to staff. Plan the business around the second hire, not the first day." Meta: Last checked June 2026 · Coverage: good · "See something off? Flag it".

**Related / Compare CTA** — "Pick any activity and set the United Kingdom side by side with up to three other countries: revenue, the cost stack, and what an owner keeps." Button: "Open Compare" (the single CTA on the page besides AddToWatch).

**Footer (rich, multi-column)** — link columns Countries / Industries / Cities / Compare / Company; newsletter sign-up; social; legal row; brand mark "Margin Atlas".

---

Source files read for grounding: `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\03-country.md` (locked section list), `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\01-component-and-chart-system.md` (chart grammar + token map), `E:\atlas\country-uk.html` (current mockup, source of all exemplar values).

Two deliberate deviations from the locked `03-country.md`, both mandated by the founder's ratified decisions which OVERRIDE it: (1) the nine-lens shape is fully reinvented as the discrete nine-row strength matrix, replacing the kept radar; (2) the seven unheld lenses render as individual visible "sample / coming soon" cards in their constitution positions, replacing the single collapsed "still filling in" strip.
