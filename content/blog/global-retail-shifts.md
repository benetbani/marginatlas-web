---
title: "Shop rents across London's boroughs"
date: "2026-10-06"
excerpt: "The official estimate of a shop's yearly rent runs from $170 a square metre in Bexley to $1,112 in Westminster, valued at April 2021."
author: "Margin Atlas"
category: "premises, rent and rates"
ai: true
figures:
  - text: "$1,112"
    file: rateable_value_by_borough.csv
    where: { area: "Westminster", premises_category: "Shops" }
    column: rateable_value_per_m2
    as: usd
  - text: "$170"
    file: rateable_value_by_borough.csv
    where: { area: "Bexley", premises_category: "Shops" }
    column: rateable_value_per_m2
    as: usd
  - text: "$427"
    file: rateable_value_by_borough.csv
    where: { area: "London", premises_category: "Shops" }
    column: rateable_value_per_m2
    as: usd
  - text: "$219"
    file: rateable_value_by_borough.csv
    where: { area: "England", premises_category: "Shops" }
    column: rateable_value_per_m2
    as: usd
  - text: "259,073"
    file: station_footfall.csv
    where: { station: "Waterloo LU" }
    column: weekday_daily
    as: int
  - text: "239,691"
    file: station_footfall.csv
    where: { station: "King's Cross St. Pancras" }
    column: saturday_daily
    as: int
  - text: "224,090"
    file: station_footfall.csv
    where: { station: "Tottenham Court Road" }
    column: saturday_daily
    as: int
  - text: "191,250"
    file: station_footfall.csv
    where: { station: "Tottenham Court Road" }
    column: weekday_daily
    as: int
  - text: "1.17"
    file: station_footfall.csv
    where: { station: "Tottenham Court Road" }
    column: saturday_vs_weekday
    as: x2
  - text: "1.52"
    file: station_footfall.csv
    where: { station: "Covent Garden" }
    column: saturday_vs_weekday
    as: x2
  - text: "57,642"
    file: station_footfall.csv
    where: { station: "Bank and Monument" }
    column: saturday_daily
    as: int
  - text: "156,760"
    file: station_footfall.csv
    where: { station: "Bank and Monument" }
    column: weekday_daily
    as: int
  - text: "0.37"
    file: station_footfall.csv
    where: { station: "Bank and Monument" }
    column: saturday_vs_weekday
    as: x2
  - text: "46"
    file: survival_by_trade_group.csv
    where: { sic_group: "471" }
    column: survival_5y
    as: per100
  - text: "43"
    file: survival_by_trade_group.csv
    where: { sic_group: "477" }
    column: survival_5y
    as: per100
  - text: "41"
    file: survival_by_trade_group.csv
    where: { sic_group: "472" }
    column: survival_5y
    as: per100
  - text: "40"
    file: survival_by_trade_group.csv
    where: { sic_group: "476" }
    column: survival_5y
    as: per100
  - text: "38"
    file: survival_by_trade_group.csv
    where: { sic_group: "475" }
    column: survival_5y
    as: per100
  - text: "32"
    file: survival_by_trade_group.csv
    where: { sic_group: "474" }
    column: survival_5y
    as: per100
behind:
  - { label: "London", href: "/gb/london" }
  - { label: "Clothing and shoe shops in London", href: "/gb/london/clothing-shoe-stores" }
  - { label: "Grocery stores in London", href: "/gb/london/grocery-stores" }
data: [rateable_value_by_borough.csv, station_footfall.csv, survival_by_trade_group.csv]
method: { label: "How to read a figure", href: "/about-data#reading" }
---

Westminster's shops carry the highest rent estimate in London, at $1,112 a square metre a year, and Bexley's the lowest, at $170. Both come from the official estimate of rent that business rates are charged on, set at 1 April 2021: not what a landlord asks today. Money here is in US dollars, at the rate the site's UK pages use.

## Rent, borough by borough

A shop's rateable value is the official estimate of what it would let for in a year at the valuation date. Divided by floor area, the figure for shops reads:

- Westminster: $1,112 a square metre a year
- London as a whole: $427
- England as a whole: $219
- Bexley: $170

Each is an average over all the area's shops, so one street can sit well above or below its borough. And shops are a wide category: most salons and many cafes are valued as shops too.

## Where the station crowds are

The station counts for 2025 show where people come and go, and on which days. They count station users only, not people walking past.

- Busiest on a weekday: the Underground station at Waterloo, with 259,073 entries and exits.
- Busiest on a Saturday: the Underground station at King's Cross St. Pancras, with 239,691.

For a shop, the shape of the week matters too. Tottenham Court Road counts 224,090 on a Saturday against 191,250 on a weekday: 1.17 times as many. Covent Garden's Saturday is 1.52 times its weekday, the largest rise of any station in the counts. Bank and Monument, in the City, goes the other way: 57,642 on a Saturday against 156,760 on a weekday, or 0.37 times. A shop by those stations sees most of its station crowd on weekdays.

## How long new shops last

These figures are the UK's, not London's: no figure exists for one kind of shop in one borough. Of 100 new shops in each group, on the closure rates of 2024, the number still trading after five years:

- supermarkets, corner shops and other general stores: 46
- clothes, shoe, chemist and other specialist shops: 43
- butchers, bakers, off-licences and other food and drink shops: 41
- book, stationery, sport and toy shops: 40
- hardware, furniture and other household goods shops: 38
- computer, phone and audio shops: 32

Petrol stations, which the figures also count as retail, are left out here. Each figure takes the share of businesses of each age that closed in 2024, from the first year to the fifth, and applies those shares in turn to a hundred new ones. In every one of these groups, the shops that actually opened in 2019 did better over their five years than these rates give: 2024 closed shops faster than the years those starters lived through.

The figures count registered businesses, those registered for VAT or running a payroll, and each is its whole group's. The London pages for [clothes and shoe shops](/gb/london/clothing-shoe-stores) and [grocery stores](/gb/london/grocery-stores) print their group's figures beside London's own counts, and [the London page](/gb/london) prints the rent for London as a whole. What each table leaves out is set down on [About the figures](/about-data#leave-out).
