# Ledger: the masterplan's steps as they stand

One row per step. Status: TODO, DONE, PARKED (waits for him; the entry is in PARKED.md), BLOCKED (cannot be done honestly
tonight; the evidence is in the note). The executor updates the row and commits this file with the step. The first row not
DONE, PARKED or BLOCKED is the resume point.

| # | Phase | Step | Status | Commits | Gates run | Note |
|---|---|---|---|---|---|---|
| 01 | A | An address for nothing answers 404 at the edge | DONE | a2df88bb, 99cacdf4 | edge-not-found (new, 50 checks), retired-paths, dead-links, doors, robots, indexable, city-path-redirect, top-level-segments, junk-url-rule, counts-fresh; tsc; `next build` exit 0 | A word no trade, city, hub or district answers to now gets a real 404, each shape judged by its own route's resolver; the old `/gb/london/west-end` addresses go to their district page. Decided: the US is left out of the trade rule (its state lookup matches census descriptions by the database's own text; 469 such US pages are declared), and the three-part district addresses get a 308 although no sitemap ever listed them (seven live call sites linked them until 2026-08-16, commit b1496df2). Middleware: 202 kB in the production build (Vercel's edge ceiling 1 MB); this step added 16.6 KB minified (esbuild metafile). |
| 02 | A | No coined score or struck word on any live page | DONE | 1eefdd60 | legacy-method-words (new, ratchet seeded at 126 from 176), copy-no-method-words, no-em-dashes, banned-vocabulary, dead-links, dead-anchors, census-fresh, counts-fresh, doors, archetype-coverage, page-has-h1, no-stock-imagery, uk-sources, search-params-suspense, sitemap-no-redirects, wave2-flags, junk-url-rule, monetization-coverage; tsc; 9 harness pages re-rendered, census rewritten (no content change) | The 0-100 break-in rating and the Margin Index composite are off every live page (region, country legacy branch, /opening, across, /extremes, /margin-index; two coined indexes off /compare/cities); the struck words say "estimated". About and methodology now say what pages print. Decided by ruling 11 (outranks "replace never cut" for a composite): a section holding only the score is withdrawn, one holding figures keeps them. Also fixed: the range strip's aria label never spoke a caller's own label (operator precedence). The residual 126 findings are on legacy branches behind the spine flags, dev pages and census metadata. |
| 03 | A | London's city page: sourced figures or none (audit 19, 22, 23, 24) | DONE | 9f9e1fee | london-city-sources (new, 25 checks, 18 red before), wage-deciles, harness-laws, harness-copy-plain, harness-page-laws, provenance, archetype-copy, model-laws-copy, no-source-agencies, uk-registers, census-fresh, counts-fresh; tsc; city london, country GB and both hood pages re-rendered; 7 photographs in photos/night-A | London's page prints the official shop rent ($427, England $219), the survey's pay tenths ($31.8K, $102.0K), no hand-anchored cost of living (a dash column, said once), and "estimate" in every line that needs it; deposit and empty shops withheld. Decided: no new register slice (premises.json already holds London and England); district rents kept and labelled, because MODEL's block floor of 16 outranks the step's withdrawal and only the City of London is a whole borough (parked P03.1); the peers' column kept as dashes per clause 18 and the step (dropping it opened a LABEL GAP); GB's p10 sits 3.2% under April 2026's floor, a year apart, inside his 5% (C52), named in the wage gate. Not covered: the other six UK cities still print their unsourced premises figures (QUEUE). |
| 04 | A | London trade pages and /gb: the rest of the audit (10, 17, 18) | DONE | 172e13bf | uk-pages-sources (new, 35 checks), london-city-sources, harness-laws, harness-copy-plain, harness-page-laws, provenance, archetype-copy, model-laws-copy, london-trade-hero, london-trade-sales, uk-survival-card, uk-london-trade, copy-no-method-words, legacy-method-words, no-em-dashes, banned-vocabulary, census-fresh, counts-fresh; tsc; country GB, howto GB, two London trade pages and Manchester restaurants rendered; 7 photographs | London's trade cards that print the trade's world figure now say so; the market takes the UK's insolvencies for the trade and drops the metro density; /gb's peers say their figures are estimates, its locals notes keep the two a record backs, the bank account's unsourced 21 days and the total it drove are a dash, the exit card is withheld, every UK city says its nation. Decided: peers relabelled rather than withheld (the audit's own remedy and M9's "estimates, said once"; withholding all peers would empty the card); no firms-per-10,000 for London (no sourced Greater London population on disk); the cost to open left alone (it already holds its one line). Suspicions cleared: Manchester prints no London figure; no tagLabel word prints. Item 15 parked (P04.1). |
| 05 | B | One Pro plan in code; the tier is free or pro | TODO | | | |
| 06 | B | The subscriptions migration for one tier; the email lookup | TODO | | | |
| 07 | B | What a Stripe event does to an account (pure, tested) | TODO | | | |
| 08 | B | The webhook on the core; the account maker | TODO | | | |
| 09 | B | Checkout first; consent and tax behind his settings | TODO | | | |
| 10 | B | The paywall's switch, on only with accounts; LAUNCH-SWITCHES | TODO | | | |
| 11 | B | The welcome page, the account's plan, cancelling | TODO | | | |
| 12 | B | The pricing page sells one plan; no old price anywhere | TODO | | | |
| 13 | B | No pop-up; the monetization gates say why | TODO | | | |
| 14 | C | Which levels lock, one tested function | TODO | | | |
| 15 | C | The locked section | TODO | | | |
| 16 | C | The three UK views draw their locks when told | TODO | | | |
| 17 | C | The UK routes decide the lock | TODO | | | |
| 18 | C | A Pro reader's uncached mirror; the middleware rewrite | TODO | | | |
| 19 | C | The locked parts said to search engines | TODO | | | |
| 20 | C | The gate that holds the paywall to his ruling | TODO | | | |
| 21 | C | Milestone 2 checkpoint: the full chain, photographs | TODO | | | |
| 22 | D | One hire, all in: the builder | TODO | | | |
| 23 | D | One hire, all in: the section | TODO | | | |
| 24 | D | The lease, by law: data and builder | TODO | | | |
| 25 | D | The lease, by law: the section | TODO | | | |
| 26 | D | Opening from abroad: data and builder | TODO | | | |
| 27 | D | Opening from abroad: the section | TODO | | | |
| 28 | D | What failing costs: data and builder | TODO | | | |
| 29 | D | What failing costs: the section; the four closed | TODO | | | |
| 30 | E | Terms, refunds, privacy, cookies drafted for his approval | TODO | | | |
| 31 | E | Report a mistake from every page; milestone 2 closed | TODO | | | |
| 32 | F | The home page's frame on the band page, in the harness | TODO | | | |
| 33 | F | The search lands on pages that exist; no modal search | TODO | | | |
| 34 | F | The UK's headline answers | TODO | | | |
| 35 | F | The UK's cities, what the atlas holds, Pro quietly | TODO | | | |
| 36 | F | The notebook, the newsletter, no terracotta hover | TODO | | | |
| 37 | F | The home page held to the UK page's standard | TODO | | | |
| 38 | G | Ruling 5 in the sample gate; the checklist fixed; the runbook | TODO | | | |
| 39 | G | The launch posts drafted for him | TODO | | | |
| 40 | G | The night's proof and the morning pack | TODO | | | |

## Full chains

| After step | Head | Passed | Reds and their fixes |
|---|---|---|---|
| 21 | | | |
| 31 | | | |
| 40 | | | |
