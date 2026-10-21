# The two place indices: connectivity and visitor pull

Two figures on a city's hero are indices out of 100 that this site works out from published statistics. This file states
how, before any figure exists, so that the same arithmetic gives London, Sydney and Sao Paulo their numbers. The
figures themselves are in `uk3-connectivity-index-2025.json` and `uk3-visitor-pull-index-2025.json`. Every input row
comes from a publisher's own file, and every index row's `note` names the inputs it was worked from.

The two indices share one log-scale rule. An input `x` between a low anchor `L` and a high anchor `H` scores
`100 x (log10 x - log10 L) / (log10 H - log10 L)`. A score below 0 counts as 0 and a score above 100 counts as 100. The
anchors are fixed and round, chosen once for every city in the world, and are never moved to fit a city. A log scale
is used because these quantities run over several orders of magnitude, so each tenfold rise adds the same number of
points.

## Connectivity (`connectivity_index`, 0 to 100)

**What it measures:** how many people pass through the city by air and by rail in a year. It is a measure of traffic.
It does not measure distance, journey time or the number of destinations.

**Part 1, air (`connectivity_air_passengers`, then `connectivity_air_score`):**
- **Input:** the yearly terminal passengers of the airports serving the city, from the national aviation statistics. In
  the UK that is the Civil Aviation Authority's annual airport data, Table 01 or 09 (terminal passengers). For other
  countries it is the equivalent national publisher (Australia: the Bureau of Infrastructure and Transport Research
  Economics' airport traffic data; Brazil: the national civil aviation agency's yearly airport statistics).
- **Which airports serve a city:** where the publisher groups airports under the city's name, the airports in that group
  (the CAA's "London Area Airports": Heathrow, Gatwick, Stansted, Luton, London City, Southend). Otherwise, the airport or
  airports whose name in the publisher's list carries the city's name (CAA: MANCHESTER, BIRMINGHAM, LEEDS BRADFORD,
  BRISTOL, EDINBURGH, GLASGOW; Sydney: Sydney, plus Western Sydney International once it reports; Sao Paulo:
  Guarulhos and Congonhas, both named for Sao Paulo by the agency). An airport carrying another place's name does not
  count, however close it is (Glasgow Prestwick is listed by the CAA as PRESTWICK, and Liverpool is not Manchester's).
  The rule needs no distance and no judgement.
- **Anchors:** 100,000 passengers a year scores 0. 1,000,000,000 scores 100. Each tenfold rise adds 25 points (1 million
  is 25, 10 million is 50, 100 million is 75).

**Part 2, rail (`connectivity_rail_passengers`, then `connectivity_rail_score`):**
- **Input:** the yearly entries and exits at every national rail station inside the city's boundary, where the country
  publishes station usage. In Great Britain that is the Office of Rail and Road's Estimates of station usage, Table
  1415a, summed over the stations the ORR places in the city's local authority. For London it is summed over the
  stations in the London region, which is Greater London. Metro, underground, tram and bus stops are outside the
  measure in every country, because few publish them station by station (London Underground-only stations are not in
  the ORR's table, but Elizabeth line and Overground stations are).
- **Where a publisher gives entries only:** the part uses entries times two, and the row says so (a journey enters one
  station and leaves another).
- **Anchors:** 1,000,000 entries and exits a year scores 0. 10,000,000,000 scores 100. Each tenfold rise adds 25 points.
  The rail anchors sit one decade above the air anchors because every rail journey is counted twice (in and out) and
  rail trips outnumber flights.

**The index:** the mean of the parts the city has, rounded to a whole number. When the country publishes no station
usage, the index is the air part alone and the row says so. A city with no scheduled airport scores 0 on air, and that
0 is part of the mean.

**The pill:** High from 67, Medium from 34 to 66, Low to 33.

## Visitor pull (`visitor_pull_index`, 0 to 100)

**What it measures:** how many overseas visits the city receives for each person who lives there. A high score means
that visitors weigh heavily on the city's streets compared with its residents. It does not measure tourism spending or
domestic visitors.

- **Inputs:** overseas residents' visits in a year (`visitors` rows with unit `visits`, already held in
  `visitors.json` for London and `uk-visitors-ips-2025.json` for the other UK cities, read from the publisher and never
  copied here) over the city's resident population (`population` rows, `populations.json` in data/sourced/business).
  Visits are counted, not nights and not arrivals at hotels. Where a country publishes only arrivals at accommodation,
  the index is not made and the row says so.
- **Anchors:** 0.1 visits per resident scores 0. 10 visits per resident scores 100. Each tenfold rise adds 50 points (one
  visit per resident is 50).
- **The ratio's own figure** (`visitor_pull_ratio`, visits per resident) is a row beside the index, so the page can say
  "about two visits a year for every resident".
- **Boundary:** the survey names the place visited ("Edinburgh" as a town), while the population is the local authority's.
  The note says so. The index is never made from a visitors figure whose area the publisher does not name.

**The pill:** the same as connectivity's.

## In plain words, for the methodology page

**Connectivity.** This index out of 100 shows how much traffic passes through a city. It has two parts. The first is the
number of passengers a year at the city's airports. The second is the number of trips a year that start or end at the
city's railway stations. Each part is placed on a fixed scale on which every tenfold rise adds 25 points. On the airport
scale, 100,000 passengers is 0 and a billion is 100. On the railway scale, a million trips is 0 and ten billion is 100.
The index is the average of the two. It counts traffic only, not how far or how fast the city's links reach.

**Visitor pull.** This index out of 100 shows how many visits from abroad a city receives for each person who lives
there. One visit a year for every resident scores 50. A tenth of a visit scores 0. Ten visits score 100. It counts visits
from abroad only, not visitors from home or what they spend.
