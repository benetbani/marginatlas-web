---
title: "What a trade's industry code covers"
date: "2026-10-06"
excerpt: "The registers count businesses by industry code, not by trade, so trades that share a code share its figures."
author: "Margin Atlas"
category: "how we know"
ai: true
figures:
  - text: "138"
    file: trades_sic.json
    count: {}
  - text: "74"
    file: trades_sic.json
    count: { match: "exact" }
  - text: "40"
    file: trades_sic.json
    count: { match: "shared" }
  - text: "23"
    file: trades_sic.json
    count: { match: "approx" }
  - text: "1"
    file: trades_sic.json
    count: { match: "none" }
  - text: "4"
    file: trades_sic.json
    count: { sic: "96020" }
  - text: "9,695"
    file: trades_by_borough.csv
    where: { trade: "barbershops", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "9,695"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "$104K"
    file: trades_by_borough.csv
    where: { trade: "barbershops", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "$104K"
    file: trades_by_borough.csv
    where: { trade: "hairdressers-beauty", geography_code: "E12000007" }
    column: median_turnover_k
    as: usd_k
  - text: "14,675"
    file: trades_by_borough.csv
    where: { trade: "pizzerias", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "7,865"
    file: trades_by_borough.csv
    where: { trade: "restaurants", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "6,810"
    file: trades_by_borough.csv
    where: { trade: "food-trucks", geography_code: "E12000007" }
    column: enterprises
    as: int
behind:
  - { label: "Barbershops in London", href: "/gb/london/barbershops" }
  - { label: "Hairdressers and beauty in London", href: "/gb/london/hairdressers-beauty" }
data: [trades_sic.json, trades_by_borough.csv]
method: { label: "What the figures leave out", href: "/about-data#leave-out" }
---

The UK's registers have no line for barbershops. They count businesses under the UK's industry codes, each a short description of an activity, such as "hairdressing and other beauty treatment". The site's trades are the names owners use. To print a register figure for a trade, the site maps each trade onto the code or codes that hold it. The map is in the free data pack as `trades_sic.json`, with a note on every trade, and it rates every match.

## Four kinds of match

The map holds the site's 138 trades:

- **A code of its own** (74 trades). The code describes the trade and little else, so a figure from it is the trade's.
- **A shared code** (40 trades). One code covers this trade and others on the site, so a figure from it is the whole group's, and the page must say so.
- **A near code** (23 trades). The nearest code holds the trade among unrelated activities, so a figure from it is a broad bracket, not the trade.
- **No code** (1 trade, pool servicing). No code isolates it, so the registers cannot speak for it.

## One code for hair and beauty

The hairdressing and beauty code covers 4 of the site's trades: barbershops, hairdressers and beauty salons, nail salons, and brow and lash studios. The register files a barber and a nail salon under the same code, so in the pack's table of trades by borough their London rows carry the same figures. The barbershops row counts 9,695 registered businesses and so does the hairdressers and beauty row. In both, the middle business's yearly sales are $104K, in US dollars at the rate the site's UK pages use.

The pages say so. [Barbershops in London](/gb/london/barbershops) prints "the middle hair or beauty business in London", not the middle barbershop, and [hairdressers and beauty in London](/gb/london/hairdressers-beauty) prints the same figures under the same words. Whether barbers take more or less than nail salons, the register cannot say.

## What each match means for a page

- **Own code.** The London page prints the register's counts and takings as the trade's own, where London holds enough of the trade to print.
- **Shared code.** It prints them under the group's name, as above.
- **Near code.** The pack keeps the row, but the page prints none of its counts or takings, because they describe other businesses too. Pizzerias have no code of their own: sit-down ones are filed as licensed restaurants and delivery ones as takeaways. So the pack's London row for pizzerias counts 14,675 businesses, which is the 7,865 licensed restaurants and the 6,810 takeaways and food stands added together. The pizzerias page leads with an estimate of the cost to open instead.
- **No code.** The pack has no row at all.

Some tables reach wider still. How long new businesses last is published only for groups of codes, so a barbershop's survival figure is that of all other personal services, a group that also holds dry cleaners and funeral directors. The page names the group under the figure. The map and the tables are on the [data page](/data).
