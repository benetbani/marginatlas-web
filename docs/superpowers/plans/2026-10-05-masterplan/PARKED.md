# Parked: what waits for his word

Each entry: the question, two to four options with the recommendation first and its reason, and what is built either way. The
executor adds an entry the moment a step meets a decision only he can make, then continues. Step 40 reads them all into
MORNING-REPORT.md.

## Carried in from before the night

### P0.1 Cookie-free visit counting (milestone 1, live but off)
- **Question:** switch on Vercel Web Analytics?
- **Options:** (a) Recommended: yes: Vercel, the project, Analytics, Enable; then Settings, Environment Variables,
  `NEXT_PUBLIC_WEB_ANALYTICS` = `1` for Production; the next deploy turns it on. (b) Not yet.
- **Built either way:** the script loads only behind the switch (milestone 1, M2).

### P0.2 A named person on the site (QUEUE `cred:founder`)
- **Question:** may the site name its founder on an about page?
- **Options:** (a) Recommended: yes, a short about page with his name and why the site exists (credibility earned in the open,
  CREDIBILITY.md); (b) the site stays unsigned.
- **Built either way:** nothing.

### P0.3 The data pack (QUEUE `cred:data-pack`)
- **Question:** publish the UK data pack (`E:/atlas/cache/uk/pack/2026.10/`, 13 files) at `/data`, and is it free?
- **Options:** (a) Recommended: free and public, cited, as the credibility plan proposes; (b) Pro only; (c) not yet.
- **Built either way:** nothing.

## Added during the night

### P03.1 London's "Rent by district" (step 03, labels audit item 19)
- **Question:** the seven districts' rents are the engine's multipliers (1.00x to 2.50x, a function of each district's tags).
  The valuation statistics give real shop rent by borough, but only the City of London is a whole borough among the seven
  districts (Covent Garden lies in two boroughs, the South Bank in Lambeth and Southwark), so no district figure can replace
  them. What should the card be?
- **Options:** (a) Recommended: keep the seven districts, the line saying "Estimated rents against South London" (built
  tonight), until a district-level rent source exists; the card keeps the page at its block floor of 16 and draws nothing new.
  (b) A "Shop rent by borough" card from the valuation statistics: 33 boroughs, real figures (Westminster about $1,112 a square
  metre, Bexley about $170), but a long list and a new design that is yours to draw. (c) Withdraw the card: the page drops
  under its block floor.
- **Built either way:** London's other cards print the valuation's shop rent ($427, England $219 beside it), the survey's pay
  tenths, no hand-anchored cost of living, and "estimate" in each line that needs it (commit 9f9e1fee).

### P04.1 What UK households spend on (step 04, labels audit item 15)
- **Question:** /gb's "What households spend on" prints the shard's shares (39% of food money on eating out, housing and bills
  18%), with no source. The official shares are in the national statistics office's Family Spending workbooks, which are not on
  disk, and the night may not download anything. May the data track fetch them?
- **Options:** (a) Recommended: yes, the data track downloads the Family Spending tables (the same series as
  `data/sections/spend_by_income.json`) and the card takes them, with their source line. (b) Withhold the card on /gb until
  then. (c) Leave it as it stands.
- **Built either way:** nothing; the card stands as it was.

### P06.1 Apply the two account migrations (step 06)
- **Question:** apply `db/migrations/2026-10-05-pro-subscriptions.sql` (the subscriptions table for one Pro tier, and the
  service-role-only lookup of an account by its checkout email) and `db/migrations/2026-06-08-accounts-saved-cells.sql` (saved
  cells, if accounts open at launch) in the Supabase SQL Editor?
- **Options:** (a) Recommended: apply both on launch day, before the switches (LAUNCH-SWITCHES.md, step 10): the webhook writes
  nothing until then, and the June subscriptions file is marked superseded and must not be applied. (b) Apply now, ahead of
  launch: harmless (additive, idempotent, nothing reads it while billing is off). (c) Not yet.
- **Built either way:** the migration file (commit of step 06); the webhook (step 08) answers 500 until the table exists, so
  Stripe retries rather than losing an event.

### P09.1 Stripe: the product, the terms URL, and VAT (step 09)
- **Question:** three settings only you can make before Pro sells: (1) create the Pro product with two prices, $38 a month and
  $238 a year, then set `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_PRO_ANNUAL` in Vercel; (2) set a terms URL in Stripe's
  checkout settings, then `STRIPE_TERMS_CONSENT=1` (the box asking consent to immediate access, ruling 34; Stripe refuses the box
  without the URL); (3) turn on Stripe Tax for your VAT registration, then `STRIPE_AUTOMATIC_TAX=1` (ruling 16). And: do $38 and
  $238 include VAT for UK buyers?
- **Options for the VAT question:** (a) Recommended: the prices include VAT (prices shown to consumers in the UK must include it),
  so set both Stripe prices as tax-inclusive; the page keeps printing $38 and $238. (b) VAT on top for UK buyers: the page would
  have to say "plus VAT", and Stripe adds it at checkout.
- **Built either way:** the checkout asks for no account and offers no trial; the consent box and Stripe Tax each wait behind
  their switch, off until you turn them on (commit of step 09; LAUNCH-SWITCHES.md lists the order).

### P11.1 Stripe's customer portal (step 11)
- **Question:** set the portal in Stripe (Settings, Customer portal): allow cancelling at the end of the period and updating the
  card, return link `https://www.marginatlas.com/account`?
- **Options:** (a) Recommended: yes, as LAUNCH-SWITCHES.md row 6 says (ruling 34: cancel any time, keep access to the end of the
  period paid for). (b) Cancel at once instead: against ruling 34.
- **Built either way:** the account page's plan (Free, or Pro with its renewal or end date) and its "Manage or cancel" button,
  the portal route, and the welcome page a checkout returns to.

### P04.2 The UK's peers table
- **Question:** /gb's "Against the peers" prints the UK's sourced row beside Ireland, France, Germany and the Netherlands, whose
  tax, payroll and registration figures are hand-held constants with no source. Tonight the line says "The peers' figures are
  estimates" (the audit's own remedy). Should the peers' figures be sourced, or the rows withheld?
- **Options:** (a) Recommended: keep them, called estimates (built), and source them on the data track (each country's
  published rates). (b) Withhold the peers' rows: the card leaves /gb (a table of one row does not draw).
- **Built either way:** the UK row is the truth pass's sourced figures (commit 172e13bf).


### P20.1 The links a locked page takes from a free reader (step 20)
- **Question:** when the paywall is on, a locked level hides its links too. Measured by the paywall-shape gate on the locked
  renders: London restaurants keeps 6 of its 9 internal links (the four sibling trades in "Other trades to open", inside "The
  mix", are gone: grocery stores, legal services, estate agents, software development), and /gb loses its three city cards
  (Manchester, Birmingham, Leeds) and the cities index link. The trade page's links fall under the harness's floor of 8. How
  should a free reader still find the next trade and the next city?
- **Options:** (a) Recommended: a free row of plain doors (names only, no figures) to the other London trades on the trade page,
  and to the UK's city pages on /gb, in each page's free half, so locking never cuts the site's paths; (b) keep "The mix" and
  "The cities" open, so fewer sections lock (7 of 11 levels on /gb would become 6); (c) accept fewer links while the paywall is on.
- **Built either way:** nothing: the paywall is off until you switch it on, so no reader loses a link today. The gate reports
  the count per page on every run.

### P18.1 A build of the night branch (step 18)
- **Question:** step 18 added new route trees under /pro and asked for `npm run build` with at least 3 GB free. From 15:31 to
  17:36 the machine never had 3 GB free (the most seen was about 1.8 GB), so the build was not run tonight, as the step allows
  after two hours of waiting. May it wait for your push?
- **Options:** (a) Recommended: yes. Vercel's chain and build run on every push, so a route conflict fails there before
  anything goes live; or run `npm run build` yourself first with your apps closed. (b) Leave the machine free for a build at
  the start of the next session, before anything is pushed.
- **Built either way:** the mirror routes, the middleware rewrite and their gates (pro-route, top-level-segments,
  route-chrome-contract, page-metadata), all green; the typecheck covers the new route files.
