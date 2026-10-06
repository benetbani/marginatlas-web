---
title: "Why a business count and a premises count differ"
date: "2026-05-09"
updated: "2026-10-06"
excerpt: "A business is a legal entity. A premises is a place it trades from. One business can run several."
author: "Margin Atlas"
category: "how we know"
ai: true
figures:
  - text: "7,865"
    file: trades_by_borough.csv
    where: { trade: "restaurants", geography_code: "E12000007" }
    column: enterprises
    as: int
  - text: "9,560"
    file: trades_by_borough.csv
    where: { trade: "restaurants", geography_code: "E12000007" }
    column: local_units
    as: int
behind:
  - { label: "Restaurants in London", href: "/gb/london/restaurants" }
data: [trades_by_borough.csv]
method: { label: "How to read a figure", href: "/about-data#reading" }
---

Two counts sit side by side in the register, and they answer different questions.

- **A business** (an enterprise) is one legal entity: a company, a partnership or a sole trader.
- **A premises** (a local unit) is one place a business trades from. A chain is one business with many premises.

London's register holds 7,865 restaurant businesses and 9,560 restaurant premises. The gap is the chains and the owners with a second site.

## Which one the pages use

The UK pages count businesses: the restaurants a London page counts are businesses, not premises. A business's turnover is counted once, for the whole business, at its registered address, so a chain's takings from every site sit where its head office is registered.

A sole trader with one shop is one business and one premises.
