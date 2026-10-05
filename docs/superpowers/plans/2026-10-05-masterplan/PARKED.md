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

