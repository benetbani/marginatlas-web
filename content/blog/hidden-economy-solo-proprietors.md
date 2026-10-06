---
title: "Who the counts leave out"
date: "2026-10-06"
excerpt: "The site's business counts, takings and survival figures hold only businesses registered for VAT or PAYE, and 54% of UK businesses, most of them sole traders, are on neither register."
author: "Margin Atlas"
category: "how we know"
ai: true
figures:
  - { text: "54%", kind: "note", key: "uk.businesses" }
  - { text: "9,695", file: "trades_by_borough.csv", where: { trade: "hairdressers-beauty", geography_code: "E12000007" }, column: "enterprises", as: "int" }
  - { text: "$104K", file: "trades_by_borough.csv", where: { trade: "hairdressers-beauty", geography_code: "E12000007" }, column: "median_turnover_k", as: "usd_k" }
behind:
  - { label: "Hair and beauty in London", href: "/gb/london/hairdressers-beauty" }
data: [ledger.json, trades_by_borough.csv]
method: { label: "What the figures leave out", href: "/about-data#leave-out" }
---

Every count on the site's UK pages starts from a register, and a register sees only the businesses on it. This note says who is missing, and what that does to the figures.

## Who is on neither register

The business counts, the takings and the survival figures come from the business register. A business gets onto it by registering for VAT, or by running a payroll for PAYE. The data pack's [ledger](/data/uk/2026.10/ledger.json) says 54% of UK businesses are on neither, most of them sole traders.

Being on neither is not hiding. A sole trader whose takings stay under the VAT threshold, and who employs no one, need not register for either: a hairdresser renting a chair, a window cleaner, a private tutor, a builder working alone. The business register never sees them.

## What that does to the figures

The counts are counts of registered businesses. The register holds 9,695 hair and beauty businesses in London, under one industry code that covers barbers, hairdressers, and nail, brow and lash studios. A stylist who works alone and has registered for neither is not among them.

The same goes for the takings. The middle registered hair or beauty business in London takes $104K a year (money on the site is in US dollars, at the rate its UK pages use). That is the middle of the registered businesses. The missing ones are mostly small: in most trades a business taking more than the VAT threshold has to register for VAT. Count them in and the middle of all businesses sits below the middle of the registered ones. No register says by how much. It matters most where many people work alone.

Survival is counted on the same population. A business counts as new, in these figures, when it first appears on the register: a sole trader who registers for VAT after years of trading enters as new, and one who never registers is never counted, opening or closing.

## The company register

Failures, company ages and new companies come from the company register, which holds no sole traders and no ordinary partnerships. Failures count limited companies; company ages and new companies count limited companies and limited liability partnerships. When a sole trader cannot pay their debts, the insolvency is personal, and no failure rate here counts it.

Dormant companies are left out. New companies are counted from those still live on the register of 1 May 2026, so a company that opened and closed before then is missing, and older months look smaller than they were.

## The address and the rounding

Both registers place a business at its registered address, which is not always where it trades. An area full of accountants' and formation agents' offices carries turnover earned elsewhere.

The statistics office rounds the business register's counts to the nearest five. The middle business's takings are not printed where an area holds under forty businesses, and a failure rate is printed only where the year holds ten or more insolvencies.

[What the figures leave out](/about-data#leave-out) keeps this list in short, and [how to read a business count](/blog/reading-eurostat-sbs) walks through one row of the table.
