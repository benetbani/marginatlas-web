# Page type: Country  (/[country], e.g. /gb)

## The one job
Answers, for one country: what it costs, what you keep, and how hard it is to run a small business here, so the reader can decide whether the country itself is a yes or a no before drilling into a city or a trade. The single focal point is the country name set large over the faded engraving, with the one defensible headline number (the typical small-business tax burden, or for thin countries the days-to-register fallback) seated immediately beneath the answer line.

## Locked section order

| # | section id | label | data source | realness | block / chart to use | highest-grade treatment |
|---|---|---|---|---|---|---|
| 1 | hero | Hero | `meta.name`, `CountryMastheadImage`, flag, `AddToWatch` | real | kept `EngravedHero` shell re-skinned toward `hero2` proportions; faded `CountryMastheadImage` backdrop, no colour wash | Newsreader country name at the page's largest step; faded engraving at low opacity; one fixed subtitle at 65ch; quiet AddToWatch as the only chrome. Most generous top/bottom padding on the page. |
| 2 | scorecard | Scorecard (8 metrics) | `getCountryEconomicsSnapshot`, profile, `getCountryProfile`, brain pop/GDP | real (per-cell, tagged where not held) | `stats-card1` grid re-skinned over the kept `Scorecard`; 4-up at 1280, 2-up at 375 | Tabular figures, generous cell padding, the quiet word read ("Strong"/"Fair") under each value; null cells show a dash + "not held", never a fabricated number. One calm tint per cell on the clay-to-moss meaning scale, never a loud accent. |
| 3 | (shape) | The country shape: nine lenses | derived 0..1 lenses from held metrics | modeled (Momentum + Path tagged SAMPLE) | kept visx-style `CountryShape` radar (do not swap for Recharts) | One large centred radar, breathing whitespace around it; rim labels in Inter, one-word read per spoke; the two sample spokes carry a small "sample" tag, never a number. A qualitative profile, framed as such in the sub. |
| 4 | decisive | Cost and rules to set up | `getSmbRegime`, `getVatRow`, `getCountryRates`, `getTypicalFormationCostUsd`, snapshot | real (GATE id) | kept `SetupStepper` + `data-table1`-style formation-cost table (`BusinessFormationCosts`) | The page's first heavy card. Stepper as the lead visual; the held tax/payroll/time figures as a clean 2-col `dl` with Newsreader values; the per-tier cost table folded beneath one hairline. Sales-tax note small and low. One down-link in atlas text. |
| 5 | (licences) | Licences | no country-wide licence dataset | placeholder | calm `LicenceCheck` checklist frame in SampleState | Pulled UP into the collapsed "still filling in" strip (see Density). Shown as one calm checklist outline tagged "sample", not a wall. |
| 6 | (cost-signature) | Where the margin leaks | not held | placeholder | re-skinned `chart-card1` 3-bar (rent / labour / tax), biggest flagged, in SampleState | Folded into the collapsed strip. When held later, promotes to a single 3-bar card with the biggest leak flagged in atlas. |
| 7 | hire | Hiring and the cost of a team | `getCountryProfile` wages, `getCountryRates`, view.hire | real (GATE id) | kept `HiringRead` gauge when full set held; else held-fact bullet list; `ComparisonBars` payroll-vs-neighbours | Card. Where the full set is held, the gauge leads; otherwise the real wage bullets lead with no contradicting sample box. The payroll-on-cost `ComparisonBars` carries the honesty caveat (different regimes, no ranking). |
| 8 | (talent) | The talent reality | not held | placeholder | `TalentReality` in SampleState | Folded into the collapsed strip. |
| 9 | (who-has-money) | Who has money to spend | blended wealth/salary/CoL score | modeled | `WhoHasMoney` spending-power read | A single calm rung read ("Comfortable") with the plain-words explanation; the spend-mix stays null/omitted, no fabricated split. |
| 10 | (reach) | How far you can reach | population real; indicators sample | modeled (population real) | `HowFarYouReach`, population real | One real population figure as the lead (Newsreader number), reach indicators self-omit under one honest caveat line. |
| 11 | neighbours | Versus the neighbours | resolved neighbour facts via `gatherFacts` | real (GATE id) | kept `Neighbours` like-for-like FACTS table | Card. The page's most load-bearing comparison. Home column tinted (not crowned), tabular figures, the "different price regimes, never a league table" caveat always present. Generous row height. |
| 12 | (opportunity) | The opportunity gap | trade-level density not held | placeholder | `OpportunityGap` in SampleState | Folded into the collapsed strip. |
| 13 | (here-vs-abroad) | Same business, here vs abroad | like-for-like trade pair not held | placeholder | `SameBusinessAbroad` mirror bars in SampleState | Folded into the collapsed strip. |
| 14 | (special-zones) | Special zones and structures | none curated for most | placeholder | `SpecialZones` cards in SampleState | Folded into the collapsed strip; self-omits cleanly where none exist. |
| 15 | (ground-risk) | The ground under you | corruption + ease real; stability + currency sample | modeled (2 real, 2 sample) | `GroundUnderYou` factor read | Real factors lead with their score bars; the two sample factors carry a "sample" tag; one summary line says which are held. |
| 16 | cities | Cities | `getCitiesForCountry` | real (GATE id) | kept `CitiesGrid`, uniform equal-weight cards | Card. Every card identical weight (climate dot = 3 for all), NEVER ranked. City links as a quiet chip row beneath. Plain heading, generous grid gaps. |
| 17 | break-in | Easiest businesses to break into | `buildEasiestToBreakIn` over resolved cells | modeled (ranked, link-gated) | kept `EasiestToBreakIn` ranked list | Seated card, component owns its header. Ranks ACTIVITIES within the country (allowed), link-gated to trusted-local cells; scores shown only when openingHref exists. |
| 18 | character | Character | `getCountrySignature` | real (GATE id) | kept `CharacterPanel` spectra + stats | Card. Culture/government spectrums as quiet engraved sliders; the two people-stats as small figures. Sample state if no signature. |
| 19 | locals | What locals know | `view.whatLocals` (UK exemplar) | london-exemplar | kept `LocalsKnow` visual list | Short glyph-led list, never a prose wall. UK shows four real beats; everywhere else the calm sample. |
| 20 | (your-life) | What your life looks like here | not held | placeholder | `YourLifeHere` felt bars in SampleState | Folded into the collapsed strip. |
| 21 | vs-world | Versus the world | real GDP per capita vs computed global median | real | kept `VsWorld` `ScoreBand` with global-median tick (the site-wide grammar) | Card. One mirror/score band: this country vs a true global median, with the "not adjusted for local prices" caveat. The chosen site-wide vs-world grammar. |
| 22 | honest-take | The honest take | `view.honestTake` | london-exemplar (small/low) | kept `HonestTake` | Deliberately small and low. One verdict line + held ticks; UK rich, thin countries get the honest "coverage still thin" admission. No big card. |
| 23 | gut-check | One quick gut-check | `buildCountryGutCheck` (3 derived questions) | modeled | kept `GutCheck` framed cards | Three plain framed question cards, calm, generic-but-true, never fabricated specifics. |
| 24 | (one-thing) | One thing to remember | `view.honestTake.verdict` | london-exemplar | kept `OneThing` closing line + `FreshnessStamp` + `FlagIt` | The warm last word, one sentence, freshness stamp and flag-it line beneath. |
| 25 | related | Related countries | static `/compare` CTA | real (GATE id) | re-skinned `cta10` calm accent panel | Card. One calm atlas CTA panel into Compare, the single button on the page besides AddToWatch. |

(Section ids 5, 6, 8, 10, 12, 13, 14, 20 are unheld/modeled-sample; they keep their constitution order but are visually collapsed, see Density. The gate ids decisive, hire, neighbours, cities, character, related, plus hero/scorecard/vs-world/honest-take/gut-check, all render as literal `<section id>`.)

## Hero + focal point
The eye lands on the country name, set in Newsreader at the largest type step on the site, over the `CountryMastheadImage` engraving faded low (no colour wash). Below it, one fixed subtitle at a 65ch measure: "What it costs, what you keep, and how hard it is to run a small business here." The single hero number is the one defensible country anchor surfaced from `buildCountryView.masthead.anchor`: the typical small-business tax burden as a percent (or, on a thin country, days-to-register, then cost-to-register, then self-employed share, in that fallback order), a real, like-for-like-safe figure, never raw money that cannot be ranked. The only interactive chrome is the quiet `AddToWatch`; there is no loud CTA in the hero. The primary "answer" is the verdict line from `buildAnswer`, set just under the subtitle.

## Density & rhythm
The page has 25 constitution sections; the upgrade makes it feel like ~12 by varying weight, not by cutting.

- Big and heavy (full cards, most padding): hero, decisive, hire, neighbours, cities, vs-world, related. These are the real, gate-bearing beats and they carry the rhythm.
- Medium (open sections, no card chrome): scorecard, the shape radar, who-has-money, reach, ground-risk, break-in, character, gut-check.
- Quiet and low (small type, low on the page): honest-take, locals, one-thing.
- The collapse, the key move for this page: the eight unheld/placeholder sections (licences, cost-signature, talent, opportunity, here-vs-abroad, special-zones, your-life, plus any sample reach) do NOT each render as a full SampleState block down the page (that is the "wall of dashes" the constitution forbids). Instead they fold into ONE calm horizontal strip, a single bordered cream panel titled "Still filling in for {country}", carrying a short row of tagged chips ("Licences", "Cost signature", "Talent", "Opportunity gap", "Here vs abroad", "Special zones", "Your life here"), each a glyph + label + one quiet "sample" tag. One strip, one honest sentence ("These read once {country}'s local data is confirmed"), placed where the constitution's center-of-page run sits, so order is preserved as a subsequence while the visual run collapses from eight blocks to one.
- Rhythm: the `AtlasDivider` rosette/contour dividers mark the lens groups (Reward+Cost, People, Demand, Comparison+Edge, Risk, The place, Close), giving the long page breathing seams. Padding steps generous-medium-generous; nothing is crammed; the body uses `space-y-10` between heavy beats.

## Realness handling
Per the table:
- real (hero, scorecard, decisive, hire, neighbours, cities, vs-world, related): real figures only; any single missing cell (e.g. a scorecard metric) shows a dash + "not held", never a fabricated number. The `moneyShown`/trusted-local gate governs the break-in link visibility and any cross-link.
- london-exemplar (locals, honest-take, one-thing): the UK is the one filled exemplar with rich beats; every other country shows the calm derived line or `LocalsKnow` sample. The exemplar invented detail is sanctioned for GB only.
- modeled (shape, who-has-money, reach, ground-risk, break-in, gut-check): qualitative reads derived from held metrics, framed AS character/profile reads, never as scores. The shape's Momentum + Path spokes and ground-risk's stability + currency carry an explicit "sample" tag. Cities stay the only scored entity; a country never scores its own cities.
- placeholder (licences, cost-signature, talent, opportunity, here-vs-abroad, special-zones, your-life): each reads as a calm `SampleState` (glyph + what + reason + "sample" tag), and on the live page they are gathered into the single "still filling in" strip rather than eight stacked empties. Never a fake number, never a blank.

## The static-HTML mockup deliverable
A single self-contained `country.html` (precedent: `london-prototype-v1.html`), Newsreader + Inter via a Google Fonts link, the section-2 token map declared in `:root`, openable by double-click, legible at 1280 and 375. It is built for GB (United Kingdom), the one fully-filled exemplar, so every real/exemplar beat shows its richest state:

Hand-ported, filled with real/exemplar GB data:
- Hero with the faded engraving, "United Kingdom", the fixed subtitle, and the anchor (typical small-business tax %).
- Scorecard 8 tiles (`stats-card1` grid) with real GB figures and word reads.
- The nine-lens radar (`CountryShape`) with GB's derived lenses, Momentum + Path tagged "sample".
- The decisive card: stepper + tax/payroll/time `dl` + a 3-row formation-cost table.
- The hire card: the held GB wage bullets + the payroll-vs-neighbours `ComparisonBars` (GB, IE, FR, DE, NL).
- The neighbours FACTS table (GB vs IE/FR/DE/NL), home column tinted, caveat present.
- Cities grid (uniform cards) + chip row.
- vs-world `ScoreBand` (GB GDP/cap vs global median).
- locals (four UK beats), honest-take (UK verdict + ticks), gut-check (three questions), one-thing + freshness + flag-it, related CTA.

Collapsed (shown as the ONE strip, not eight blocks): licences, cost-signature, talent, opportunity, here-vs-abroad, special-zones, your-life, rendered as the single "Still filling in" panel with tagged chips, to prove the collapse reads calm.

At 375: scorecard 4 to 2 columns, radar full-width centred, neighbours table horizontally scroll-contained (no page horizontal scroll), the strip wraps its chips, all tap targets >=44px.

## Lead-designer QA (page-specific)
Specific risks for THIS page and how the design avoids them:
- The wall of placeholders (the #1 risk). Eight unheld sections stacked = the exact almanac density we reject and a parade of "sample" boxes that screams unfinished. Avoided by the single "still filling in" strip; order preserved as a subsequence, eight empties become one calm panel.
- Radar-as-score cringe. A nine-spoke radar reads like a scored verdict, but cities are the only scored entity. Avoided: rings labelled weak/fair/strong (never numbers), framed in the sub as "a character read, never a score", sample spokes tagged.
- Cross-geography ranking. Neighbours and payroll-compare must never crown a winner across price regimes. Avoided: home column tinted not crowned, `noLeaderMark`, the "read each on its own terms, never a league table" caveat fixed in place.
- Country ranking its own cities. Avoided: every city card is uniform equal-weight (climate dot fixed), no ordering signal.
- Number repetition. The anchor stat and a scorecard/decisive figure could print twice. Avoided: the view-model already de-dups (anchorPromotedFrom drops the matching chip; the days figure lives only in the time step; the formation cost shows once in the table).
- Typography flattening over 25 sections. A flat scale on a long page is the AI-slop tell. Avoided: Newsreader reserved for the hero name and the single hero/decisive numbers; >=1.25 step ratio; tabular figures everywhere; the dividers and the big/medium/quiet weighting keep hierarchy legible top to bottom.
- No-em-dash / no-source-agency / tokens-only carried throughout; the strip and all copy obey.

Four questions:
1. Sense at a glance? Yes, country name + one defensible anchor + the answer line is the focal point; everything below is lens-grouped and skimmable via the sticky nav.
2. Cringe? No, the collapse, the uniform city cards, the radar framed as a profile, and the restrained one-accent palette keep it from reading as a busy AI almanac; it reads as a calm commercial product.
3. Typography? Works, Newsreader display reserved, Inter elsewhere, tabular figures, stepped scale, generous measure; the long page holds hierarchy via weighting and dividers.
4. Can it be better? Yes, and applied: collapsing eight placeholders into one strip is the single biggest quietening lever; reserving cards for only the seven real beats stops the page from reading as an undifferentiated grid. If it can be quieter still, the next pass would demote who-has-money and reach into the strip-adjacent "modeled" lane so only fully-held beats carry full cards.
