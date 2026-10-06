---
title: "Hairdressing and beauty businesses in each London borough"
date: "2026-10-06"
excerpt: "London has 9,695 registered hairdressing and beauty businesses. Borough by borough, the middle one turns over from $91K a year in Barking and Dagenham to $175K in Kensington and Chelsea."
author: "Margin Atlas"
category: "counts and turnover"
ai: true
figures:
  - text: "9,695"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "9,895"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: local_units
    as: int
  - text: "$104K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "63%"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: under_100k_share
    as: pct
  - text: "640"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000033" }
    column: enterprises
    as: int
  - text: "445"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000003" }
    column: enterprises
    as: int
  - text: "445"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000007" }
    column: enterprises
    as: int
  - text: "445"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000010" }
    column: enterprises
    as: int
  - text: "140"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000002" }
    column: enterprises
    as: int
  - text: "$175K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000020" }
    column: median_turnover_k
    as: usd_k
  - text: "$147K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000033" }
    column: median_turnover_k
    as: usd_k
  - text: "$120K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000004" }
    column: median_turnover_k
    as: usd_k
  - text: "$92K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000010" }
    column: median_turnover_k
    as: usd_k
  - text: "$92K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000022" }
    column: median_turnover_k
    as: usd_k
  - text: "$91K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000002" }
    column: median_turnover_k
    as: usd_k
  - text: "40%"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000020" }
    column: under_100k_share
    as: pct
  - text: "47%"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000033" }
    column: under_100k_share
    as: pct
  - text: "75%"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E09000002" }
    column: under_100k_share
    as: pct
behind:
  - { label: "Hairdressers in London", href: "/gb/london/hairdressers-beauty" }
  - { label: "Barbershops in London", href: "/gb/london/barbershops" }
data: [trades_by_borough.csv]
method: { label: "What the figures leave out", href: "/about-data#leave-out" }
---

London's business register holds 9,695 hairdressing and beauty businesses. The middle one turns over $104K a year; borough by borough, it runs from $91K to $175K.

Three things to know before the figures. Hairdressers, barbers, and nail, brow and lash studios share one industry code in the register, so every figure here is the whole code's: all of them together, and a borough with many barbers and few nail bars looks the same as one with the reverse. The businesses are registered ones, those on the VAT or the PAYE register, in the register's snapshot of March 2026, and turnover is from their VAT returns for the latest year the register holds. Money is in US dollars, at the rate the site's UK pages use.

## London as a whole

- **Businesses:** 9,695
- **Premises:** 9,895 (close to one for each business, so most of them run a single site)
- **The middle business:** $104K a year, the one with as many registered businesses above it as below it
- **Turning over less than a hundred thousand pounds:** 63%

The middle business's $104K is still under a hundred thousand pounds: more than half of these businesses sit below that line, so the middle one does too.

## Where the businesses are

Westminster has the most, 640. Barnet, Camden and Enfield come next with 445 each. Of the thirty-two boroughs, Barking and Dagenham has the fewest, 140.

The middle figure prints only where an area holds forty or more of these businesses. Every borough does, so each one has its own.

## What the middle business turns over

- Kensington and Chelsea: $175K
- Westminster: $147K
- Bexley: $120K
- London as a whole: $104K
- Enfield and Lambeth: $92K
- Barking and Dagenham: $91K

Most boroughs sit close to London's figure. The top two are both central, but the third is Bexley, an outer borough, so the pattern is not simply the centre against the suburbs. The three at the bottom are too close to rank: every count is rounded, and that alone could reorder them.

The share turning over less than a hundred thousand pounds moves the other way: 40% in Kensington and Chelsea, 47% in Westminster and 75% in Barking and Dagenham. Where the middle business takes more, fewer businesses sit under the line.

For a salon owner, the borough's middle business is a closer comparison than London's. London's figures are on the page for [hairdressers in London](/gb/london/hairdressers-beauty), and the page for [barbershops in London](/gb/london/barbershops) reads the same code, so it shows the same ones. Each borough's row is in the [free data pack](/data).

## Reading the borough figures

- **A business is counted at its registered address**, not where it trades, and its turnover is the whole business's. An area full of accountants' and formation agents' offices carries other areas' turnover, so read the two central boroughs at the top with that in mind.
- **Only registered businesses are counted.** Those on neither the VAT nor the PAYE register, most of them sole traders, are not in these figures, so the middle figure is the middle of registered businesses and sits above the middle of all.
- **Counts are rounded** to the nearest five by the statistics office.
