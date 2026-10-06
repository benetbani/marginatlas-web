---
title: "How to compare your business with your trade in London"
date: "2026-10-06"
excerpt: "Set your year's sales against the middle registered business in your trade, across London and then in your borough, then see how long such businesses last and how often their companies fail."
author: "Margin Atlas"
category: "how we know"
ai: true
figures:
  - text: "$224K"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "6,280"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "26"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E12000007" }
    column: under_100k_share
    as: per100
  - text: "140"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E09000016" }
    column: enterprises
    as: int
  - text: "$240K"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E09000016" }
    column: median_turnover_k
    as: usd_k
  - text: "11"
    file: trades_by_borough.csv
    where: { trade: "cafes-coffee-shops", geography_code: "E09000016" }
    column: under_100k_share
    as: per100
  - text: "94"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_1y
    as: per100
  - text: "29"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: survival_5y
    as: per100
  - text: "39"
    file: survival_by_trade_group.csv
    where: { sic_group: "561" }
    column: cohort_2019_survival_5y
    as: per100
  - text: "1.2"
    file: failures_by_trade.csv
    where: { trade: "cafes-coffee-shops" }
    column: uk_insolvent_per_1000
    as: rate100
  - text: "54%"
    kind: note
    key: uk.turnover.median
behind:
  - { label: "Cafés and coffee shops in London", href: "/gb/london/cafes-coffee-shops" }
data: [trades_by_borough.csv, survival_by_trade_group.csv, failures_by_trade.csv, ledger.json]
method: { label: "How to read a figure", href: "/about-data#reading" }
---

You need one figure of your own: your sales for your last full year, before any costs. The rest is on your trade's London page and in the free data pack. The example here is a cafe. Money is in US dollars, at the rate the site's UK pages use.

## Start with your trade's London page

Open your trade's page, here [cafés and coffee shops in London](/gb/london/cafes-coffee-shops). The top of the page prints three figures from the business register, counted in March 2026:

- **Typical yearly sales: $224K.** This is the median, the middle cafe or unlicensed restaurant in London: half of them take more and half take less.
- **Registered businesses: 6,280.** The businesses those figures describe.
- **Take under** a hundred thousand pounds, which the page shows in dollars: **26 of 100.**

Now set your year against them. If you took more than $224K, you took more than the middle one. If you took under a hundred thousand pounds, you are among the 26 of 100 that did. Just below, the **Sales a year** line shows how far the trade spreads, from the bottom tenth to the top tenth.

A few trades, restaurants among them, open with an estimate of the sales needed to break even instead. There the middle figure is marked **Typical** under Sales a year.

## Then find your borough

The page is London as a whole. Your borough is in the [data pack](/data): its table of trades by borough, `trades_by_borough.csv`, has a row for each trade in each borough. For cafes in Havering it reads:

- 140 registered businesses
- the middle one's yearly sales: $240K
- 11 of 100 taking under a hundred thousand pounds

So Havering's middle cafe takes a little more than London's, and far fewer of its cafes take under a hundred thousand pounds: 11 of 100, against 26 across London. Set your year against both rows. The table gives the middle business's takings in thousands of pounds, so you can read it straight against your books. A borough's figures rest on fewer businesses and are rougher than London's. Where a borough holds under forty businesses of a trade, its row leaves the middle and the share blank.

## How long they last, and how often they fail

Further down, the page prints how many new businesses still trade after one, three and five years. The statistics office publishes this only for wider groups, so a cafe's figure covers all restaurants, cafes and takeaways across the UK. Of 100 that open, 94 still trade after a year and 29 after five, at the closure rates of 2024. Of those that opened in 2019, 39 of 100 were still trading five years on. The group's row is in `survival_by_trade_group.csv`.

The page also prints how often companies fail: per 100 live limited companies in the cafe code across the UK, 1.2 became insolvent in the twelve months to September 2026. A sole trader's insolvency is personal and is not counted. The row is in `failures_by_trade.csv`.

## What the comparison leaves out

Three things, set out in full under [what the figures leave out](/about-data#leave-out):

- **Registered businesses only.** The counts and takings hold businesses registered for VAT or PAYE. The 54% of UK businesses on neither register, most of them sole traders, are not in them, so the middle registered business takes more than the middle of all businesses. If yours is on neither register, it is not in these figures.
- **The registered address.** A business's takings are counted where it is registered, not where it trades. A chain's takings sit in the borough of its registered office, and a borough full of accountants' and formation agents' offices carries takings earned elsewhere.
- **Shared codes.** Cafes share their industry code with tea houses and unlicensed restaurants, so every register figure above is the whole code's, which is why the page says "the middle cafe or unlicensed restaurant". A trade's page prints no register figures where no code fits it closely, as [what a trade's industry code covers](/blog/industry-classification-different-meanings) explains, or where London holds too few of the trade.
