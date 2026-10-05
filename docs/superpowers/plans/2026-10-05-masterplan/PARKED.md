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

### P30.1 Your approval of the legal drafts (step 30)
- **Question:** the terms of Pro (with cancelling and refunds at /terms#refunds), privacy and cookies are drafted in plain
  English in `src/lib/legal/pro_legal.ts`, exported for you to read in `E:/atlas/design/loop/build/m2/legal/PRO-LEGAL-DRAFT.md`,
  with the law they follow in `2026-10-05-uk-subscription-law.md` beside it. Do you approve them as they stand?
- **What you are approving, besides the law's parts:** (1) Pro read as digital content, so a reader who ticks the checkout's
  box loses the 14-day right once access begins (the 2013 Regulations, regulation 37, and your ruling 34); a reader who did not
  tick it gets a full refund within 14 days. If a lawyer reads Pro as a service instead, a consenting reader could still cancel
  inside the 14 days and pay for the days used, and one paragraph would change. (2) An email before a yearly plan renews. (3)
  At least 30 days' notice of a new price, with the right to cancel first. (4) Liability limited to what a reader paid in the
  12 months before a claim, never below what consumer law keeps. (5) The 2024 Act's subscription rules (reminders, a renewal
  cooling-off period) are expected in spring 2027 and are not in the drafts.
- **Options:** (a) Recommended: approve as drafted (standard UK subscription terms, and the stricter side wherever the law was
  unclear); (b) approve after a lawyer's review of point (1); (c) send changes, and the module and the export change together.
- **Built either way:** the three pages draw the drafts only when the paywall's switch is on (LAUNCH-SWITCHES.md row 7 comes
  before it); until then they keep their current text. The gate pro-legal holds the drafts to the checkout's consent line and
  the plan's prices.

### P30.2 Your details for the drafts' gaps (step 30)
- **Question:** six gaps in the drafts hold facts only you have, marked `[HIS: ...]`: the VAT wording (with P09.1), your name
  or your company's name and number, the address for legal letters (twice), and the VAT number if registered. What are they?
- **Options:** (a) Recommended: fill them in `src/lib/legal/pro_legal.ts` before the paywall's switch (or send them and the next
  session fills them); the test prints how many gaps remain. (b) Trade under a company first, then fill them with its details.
- **Built either way:** nothing is invented: every gap prints as a marked gap, and the launch list's row 7 asks for none left.

### P30.3 Two Stripe settings the drafts rely on (step 30)
- **Question:** the terms say Stripe's receipt confirms the checkout's consent, and that a yearly plan gets an email before it
  renews. Will you set both in Stripe (LAUNCH-SWITCHES.md row 8)?
- **Why it matters:** the 2013 Regulations ask for the consent to be confirmed on a durable medium (regulation 16); without that
  confirmation a reader who ticked the box can still cancel and bears no cost (regulation 37). The renewal email is good practice
  now and becomes law with the 2024 Act's subscription rules.
- **Options:** (a) Recommended: both, as row 8 says; (b) drop the renewal email from the terms (the module's renewal paragraph)
  and set only the receipt line.
- **Built either way:** the drafts, behind the paywall's switch. Also for you, from the same reading: when you answer a
  customer's complaint, the 2024 Act (section 308(3), in force since 6 April 2026) asks you to say whether a dispute scheme is
  available if they are unhappy with your answer.

### P31.1 A public corrections log and a changelog (step 31; QUEUE cred:about-figures)
- **Question:** the credibility doctrine of 2026-10-02 has the site show a dated corrections page and a changelog of data
  releases, with a promise to answer a report in two working days and fix a figure in five. Both are promises you make in public.
  Do you want them, and from when?
- **Options:** (a) Recommended: a corrections page from launch day, each correction with its date and "no corrections yet" as
  its honest first state, and no changelog until there is a data release to list; (b) both from launch day; (c) neither yet,
  only the report link and the form.
- **Built either way:** "Report a mistake" on the foot of every spine page, carrying the page's own path to /corrections/new
  (never indexed), where the site's correction form posts to the corrections table. Nothing public lists the reports. The
  "Checked [date]" line is wired to the register slices' build date, which the export does not write yet, so no page prints it
  (QUEUE data:uk-register-built-date).

### P36.1 Which posts the home page's notebook shows (step 36)
- **Question:** the notebook shows the research's two "keep" posts (the firm against the establishment, the median against the
  average) from `src/lib/home/notebook.ts`. BLOG.md (goal of 2026-10-02) proposes keep 2, rewrite 10 on the UK registers, retire
  58 with a 301 each. Which do you want?
- **Options:** (a) Recommended: keep the two as the notebook now, rewrite the ten on the registers next, retire the 58 before the
  site goes public; (b) keep the two and retire the rest now, rewriting later; (c) a different list, named in the module.
- **Built either way:** the notebook level, each post on its own picture or the UK's photograph, never the old rail's skyline.

### P36.2 The editorial feed's formats on the home page (step 36)
- **Question:** the feed `E:/atlas/registers/uk/tables/editorial_feed.json` (built 2026-10-04) and the seven formats of
  HOMEPAGE-EDITORIAL.md wait for your word; nothing of them is on the home page tonight. Which first?
- **Options:** (a) Recommended: two fresh, like-for-like formats first, "the duel" (from the trades that fail most) and the ranked
  list, each checked against the 45-day rule before it prints; (b) all seven at once; (c) none until the blog's rewrite lands.
- **Built either way:** the home page holds the UK's answers, its cities and what the atlas holds; any format later reads the feed,
  never the document's figures, which drifted from it.

### P36.3 The old home page and its components (step 36)
- **Question:** the new home page stands behind NEXT_PUBLIC_HOME_REFORM (off in production); the old one still serves `/` with its
  Specimen, ExampleTiles, CatalogPlates, AudienceBand (which links the Margin Index, a coined index), UpgradeTeaser and the blog
  rail on the Positano photograph. Once you approve the new page, may the old branch and the components only it uses be deleted?
- **Options:** (a) Recommended: switch NEXT_PUBLIC_HOME_REFORM on with the launch, then delete the old branch in the next session
  after a search for other importers; (b) keep both for a while and compare; (c) keep the old page.
- **Built either way:** the new page, gated and photographed (step 37); the old page untouched.

### P38.1 City pages one block under their floor (step 38)
- **Question:** the launch check's item (a) keeps one reason: Frankfurt and Abidjan draw 15 blocks against the city floor of 16.
  They are not alone: the floor census counts 203 of the 245 city pages outside the UK at 15 (the neighbourhood pager draws only
  on the curated cities), so those pages stay out of the index by the floor rule of milestone 1. What do you want for them?
- **Options:** (a) Recommended: launch with the reason standing: the 203 stay out of the index until their missing block can be
  drawn honestly, and nothing on the pages changes; (b) set the city floor at 15 for a city without curated districts (your word
  on the floor), so the 203 index and the check passes; (c) draw the neighbourhood pager wherever a city holds districts, then
  measure again.
- **Built either way:** the checklist's own faults fixed (it reads the country's floor decision and the trade page's floor line
  again); the 17 other exemplars at their floor, the home page among them (5 of 5).
