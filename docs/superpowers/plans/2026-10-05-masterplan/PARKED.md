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

### P04.2 The UK's peers table
- **Question:** /gb's "Against the peers" prints the UK's sourced row beside Ireland, France, Germany and the Netherlands, whose
  tax, payroll and registration figures are hand-held constants with no source. Tonight the line says "The peers' figures are
  estimates" (the audit's own remedy). Should the peers' figures be sourced, or the rows withheld?
- **Options:** (a) Recommended: keep them, called estimates (built), and source them on the data track (each country's
  published rates). (b) Withhold the peers' rows: the card leaves /gb (a table of one row does not draw).
- **Built either way:** the UK row is the truth pass's sourced figures (commit 172e13bf).

