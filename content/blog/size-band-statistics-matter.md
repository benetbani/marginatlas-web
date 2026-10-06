---
title: "London businesses turning over less than a hundred thousand pounds, by trade"
date: "2026-10-06"
excerpt: "Of the trades the site follows in London, couriers have the highest share of registered businesses turning over less than a hundred thousand pounds a year, 75%, and pharmacies the lowest, 5%."
author: "Margin Atlas"
category: "counts and turnover"
ai: true
figures:
  - text: "75%"
    file: trades_by_borough.csv
    where: { trade: "couriers-messengers", geography_code: "E12000007" }
    column: under_100k_share
    as: pct
  - text: "4,270"
    file: trades_by_borough.csv
    where: { trade: "couriers-messengers", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "$59K"
    file: trades_by_borough.csv
    where: { trade: "couriers-messengers", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "63%"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: under_100k_share
    as: pct
  - text: "9,695"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "$104K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "5%"
    file: trades_by_borough.csv
    where: { trade: "pharmacies-health-stores", geography_code: "E12000007" }
    column: under_100k_share
    as: pct
  - text: "1,395"
    file: trades_by_borough.csv
    where: { trade: "pharmacies-health-stores", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "1,710"
    file: trades_by_borough.csv
    where: { trade: "pharmacies-health-stores", geography_code: "E12000007" }
    column: local_units
    as: int
  - text: "$1.0M"
    file: trades_by_borough.csv
    where: { trade: "pharmacies-health-stores", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "6%"
    file: trades_by_borough.csv
    where: { trade: "grocery-stores", geography_code: "E12000007" }
    column: under_100k_share
    as: pct
  - text: "6,935"
    file: trades_by_borough.csv
    where: { trade: "grocery-stores", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "8,980"
    file: trades_by_borough.csv
    where: { trade: "grocery-stores", geography_code: "E12000007" }
    column: local_units
    as: int
  - text: "$472K"
    file: trades_by_borough.csv
    where: { trade: "grocery-stores", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "54%"
    kind: note
    key: uk.turnover.under100k
behind:
  - { label: "Couriers in London", href: "/gb/london/couriers-messengers" }
  - { label: "Pharmacies in London", href: "/gb/london/pharmacies-health-stores" }
  - { label: "Hairdressers in London", href: "/gb/london/hairdressers-beauty" }
data: [trades_by_borough.csv, ledger.json]
method: { label: "What the figures leave out", href: "/about-data#leave-out" }
---

The business register sorts registered businesses into bands by their yearly turnover. A hundred thousand pounds is one of the band edges, and the share of a trade's businesses below it shows how much of that trade is small.

Here it is for London, trade by trade: one place across trades, on one definition. The businesses are those on the VAT or the PAYE register, in the register's snapshot of March 2026, and turnover is from their VAT returns for the latest year the register holds. A trade with under forty registered businesses in London prints no share and is left out. Money is in US dollars, at the rate the site's UK pages use; the band edge stays in pounds.

## The highest shares

- **Couriers:** 75% of 4,270 businesses turn over less than a hundred thousand pounds. The middle one turns over $59K a year.
- **Hairdressing and beauty:** 63% of 9,695 businesses. The middle one turns over $104K, which is still under a hundred thousand pounds. Barbers, hairdressers, and nail, brow and lash studios share one industry code, so this figure is the whole code's.

## The lowest shares

- **Pharmacies:** 5% of 1,395 businesses. The middle one turns over $1.0M a year.
- **Grocery stores:** 6% of 6,935 businesses. The middle one turns over $472K.

Both have more premises than businesses: 1,710 pharmacy premises and 8,980 grocery premises. Some of these businesses run several shops, and a business's turnover is the whole business's, every branch counted together.

## Why the middle figure is the one to compare with

An average adds up every business's takings and divides by the number of businesses, so a few large ones can lift it well above what most of the trade takes. The middle figure, the median, is the business with as many above it as below it, and a few large businesses barely move it. The post on [the median and the average](/blog/median-vs-average) shows the arithmetic.

The share under the band edge also says where the middle sits. When more than half of a trade turns over less than a hundred thousand pounds, its middle business does too: that holds for couriers and for hairdressing. Where only 5% do, as in pharmacies, the middle business sits far above the edge.

So an owner comparing a business with its trade learns more from the middle figure and the share under the edge than from an average. Those two describe the businesses the owner actually stands among; an average can be set by a few of the largest.

## What the shares leave out

- **Unregistered businesses.** Those on neither register, 54% of UK businesses and most of them sole traders, are not counted. The middle figure is the middle of registered businesses and sits above the middle of all, and for the same reason the share under a hundred thousand pounds would be higher if every business were counted.
- **Where the business trades.** A business is counted at its registered address, not where it trades, so one registered in London brings its takings from everywhere it trades, and an area full of accountants' and formation agents' offices carries other areas' turnover.
- **Rounding.** The statistics office rounds every count to the nearest five.

Each trade's figures are on its London page: [couriers](/gb/london/couriers-messengers), [pharmacies](/gb/london/pharmacies-health-stores) and [hairdressers](/gb/london/hairdressers-beauty).
