---
title: "How to read a business count"
date: "2026-10-06"
excerpt: "One row of the borough table, column by column: what counts as a business and as a premises, what the middle turnover means, and why a small row leaves the turnover blank."
author: "Margin Atlas"
category: "how we know"
ai: true
figures:
  - { text: "7,865", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E12000007" }, column: "enterprises", as: "int" }
  - { text: "9,560", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E12000007" }, column: "local_units", as: "int" }
  - { text: "$374K", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E12000007" }, column: "median_turnover_k", as: "usd_k" }
  - { text: "18%", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E12000007" }, column: "under_100k_share", as: "pct" }
  - { text: "1,080", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E09000033" }, column: "enterprises", as: "int" }
  - { text: "1,465", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E09000033" }, column: "local_units", as: "int" }
  - { text: "$1.0M", file: "trades_by_borough.csv", where: { trade: "restaurants", geography_code: "E09000033" }, column: "median_turnover_k", as: "usd_k" }
  - { text: "10", file: "trades_by_borough.csv", where: { trade: "small-leather-goods", geography_code: "E09000033" }, column: "enterprises", as: "int" }
  - { text: "5", file: "trades_by_borough.csv", where: { trade: "small-leather-goods", geography_code: "E09000033" }, column: "local_units", as: "int" }
behind:
  - { label: "Restaurants in London", href: "/gb/london/restaurants" }
data: [trades_by_borough.csv]
method: { label: "What the figures leave out", href: "/about-data#leave-out" }
---

A row of the borough table is one trade in one place: a London borough, the City of London, London as a whole, or England. This note reads London's row for restaurants column by column, then the same trade in Westminster, then a row too small to say much. The table is [`trades_by_borough.csv`](/data/uk/2026.10/trades_by_borough.csv) in the [free data pack](/data).

## One row, column by column

London's row is the one whose `geography` reads London.

- `trade`, `match` and `sic` name the trade and the industry code the row reads. For restaurants `match` says exact: the code describes restaurants and little else. It holds licensed restaurants; unlicensed ones are counted with cafes. Other rows say shared, where one code covers several of the site's trades and the figure is the whole group's, or approx, where the nearest code also holds unrelated work.
- `enterprises` is businesses: 7,865 in London. A business is counted once, however many sites it runs.
- `local_units` is premises: 9,560. A business with three restaurants is one business and three premises. The post on [businesses and premises](/blog/difference-between-firm-and-establishment) says more.
- `median_turnover_k` is the middle business's yearly turnover: line every business up by turnover and it is the one halfway along. The file holds it in thousands of pounds. The site prints money in US dollars, at the rate its UK pages use, so London's middle restaurant takes $374K a year.
- `under_100k_share` is the share of businesses taking less than a hundred thousand pounds a year, one of the register's own band edges (the London trade pages print that edge in dollars): 18% in London.
- `thin` says False: London holds enough restaurants for a middle figure.

The two counts come straight from the register. The two turnover columns are worked out: the register publishes no single business's turnover, only how many businesses fall in each turnover band, and the middle is read from inside the band where the middle business sits. [How to read a figure](/about-data#reading) sets out the four kinds. The [London restaurants page](/gb/london/restaurants) takes its count of registered businesses from this row.

## Where a business is counted

Westminster's row for the same trade holds 1,080 businesses and 1,465 premises, and its middle restaurant takes $1.0M a year.

A business is counted at its registered address, with all of its turnover. A group registered in Westminster that runs restaurants across London counts once, in Westminster, with every site's takings, while each of its premises is counted in the borough where it stands. So Westminster's middle figure may carry takings earned in other boroughs, and the table cannot say how much.

A smaller row shows the address on its own. Westminster holds 10 luggage and handbag makers and 5 premises of that trade: more businesses than premises. A business sits at its registered address, which need not be where it makes or sells anything.

## Small numbers

The statistics office rounds every count to the nearest five. London's 7,865 restaurants could be two either side, which makes no difference at that size. The luggage makers' 5 premises could be anything from three to seven.

Where a row holds under forty businesses, `thin` says True and the turnover columns are left blank: too few businesses for the middle figure to print. The luggage row is thin, so it has its counts and no turnover.

Every count here is of businesses on the VAT or PAYE register. [Who the counts leave out](/blog/hidden-economy-solo-proprietors) says who that misses.
