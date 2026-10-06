---
title: "Do most new restaurants close within five years?"
date: "2026-10-06"
excerpt: "Yes. On the closure rates of 2024, 29 of 100 new restaurants, cafes, takeaways and food stalls in the UK would still be trading after five years."
author: "Margin Atlas"
category: "survival and failure"
ai: true
figures:
  - text: "94"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_1y
    as: per100
  - text: "70"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_2y
    as: per100
  - text: "50"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_3y
    as: per100
  - text: "38"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_4y
    as: per100
  - text: "29"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_5y
    as: per100
  - text: "18,105"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: births_2019
    as: int
  - text: "39"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: cohort_2019_survival_5y
    as: per100
  - text: "1,259"
    file: failures_by_trade.csv
    where: { trade: "restaurants" }
    column: uk_insolvent
    as: int
  - text: "43,634"
    file: failures_by_trade.csv
    where: { trade: "restaurants" }
    column: uk_live_companies
    as: int
  - text: "2.9"
    file: failures_by_trade.csv
    where: { trade: "restaurants" }
    column: uk_insolvent_per_1000
    as: rate100
  - text: "357"
    file: failures_by_trade.csv
    where: { trade: "restaurants" }
    column: london_insolvent
    as: int
behind:
  - { label: "Restaurants in London", href: "/gb/london/restaurants" }
data: [survival_by_trade_group.csv, failures_by_trade.csv]
method: { label: "How to read a figure", href: "/about-data#reading" }
---

Yes, though not in their first year. On the closure rates of 2024, 94 of 100 new restaurants, cafes, takeaways and food stalls in the UK would still be trading a year after opening, and 29 after five. Most of the closing comes in years two to four.

## A year at a time

Of 100 that open, on the closure rates of 2024, the number still trading:

- after one year: 94
- after two years: 70
- after three years: 50
- after four years: 38
- after five years: 29

The biggest fall is in the second year. By the end of the third, half have closed.

These are not one group of businesses followed for five years. The figures take the share of businesses of each age that closed in 2024, from those in their first year to those in their fifth, and apply those shares in turn to a hundred new ones. They show what a new owner faces if closures run as they did in the latest year the figures hold.

The real record of one year's starters sits beside it. Of the 18,105 that opened in 2019, 39 of 100 were still trading five years later. That is more than the recent rates give: those starters lived through years that closed businesses more slowly than 2024 did. Both figures answer the question the same way. Most do not reach five years.

## Closing is not the same as going bust

An insolvency is one way to close, not the only one. An owner who retires or simply stops trading, and pays what is owed, never appears in the insolvency figures. Those figures count limited companies only: a sole trader's insolvency is personal data and is not counted.

In the year to September 2026, 1,259 UK restaurant companies became insolvent, out of 43,634 live ones: 2.9 of 100 UK restaurant companies a year. No trade in the insolvency figures has a higher rate. Of those companies, 357 had their registered office in London.

This count is restaurants alone. Cafes and takeaways are counted under trades of their own, so this rate and the survival figures above cover different businesses, and one cannot be read off the other.

## Whose figures these are

- The survival figures count registered businesses, those registered for VAT or running a payroll. A business on neither is not in them.
- They are the whole group's: restaurants, cafes, takeaways and food stalls together, across the UK. No figure exists for one trade in one borough.
- The counts behind them are rounded to the nearest five, and the shares are worked out from the rounded counts.
- The insolvency figures match each notice to the register by company name, and a notice that does not match is left out.

The London restaurants page prints the same UK survival figures beside London's own counts: [restaurants in London](/gb/london/restaurants). What each table leaves out is set down on [About the figures](/about-data#leave-out).
