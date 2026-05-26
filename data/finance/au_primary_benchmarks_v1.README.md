# Australia primary benchmarks — drop site

**Status:** Awaiting data file.
**Founder action:** download from ato.gov.au and drop here.

## What to download

From the ATO Small Business Benchmarks page
(`https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/small-business-benchmarks/benchmarks-a-z`),
download EITHER of the following formats:

1. **The "Print all" / Excel-style download** if the ATO exposes one
   (look for a "Download" or "Export" link on the A-Z index page).
   Preferred format. Drop at:
   ```
   data/finance/au_primary_benchmarks_v1.xlsx
   ```

2. **The full A-Z page as a PDF.** Use your browser's "Save as PDF"
   on the A-Z benchmarks index. Drop at:
   ```
   data/finance/au_primary_benchmarks_v1.pdf
   ```

Either works. The parser script detects whichever lands.

## What I need from the data

For each of the ~100 ATO industries, the parser extracts:

- **Industry name** (the ATO heading)
- **ANZSIC code** if present
- **Turnover bands** (the exact AUD thresholds — usually three bands
  per industry, e.g., `$65,001 to $300,000`, `$300,001 to $1,000,000`,
  `$1,000,001 and above`)
- **Key benchmark ratio** (the one the ATO designates as most predictive)
- **Per-band ratios:**
  - Cost of sales / turnover (low-high range)
  - Total expenses / turnover
  - Labour / turnover
  - Rent / turnover
  - Motor vehicle expenses / turnover

This is exactly the shape Margin Atlas's cost engine already
consumes. The parser writes it to
`data/finance/au_primary_benchmarks_v1.json` in our canonical schema.

## What happens after the file lands

1. Parser runs: `npx tsx scripts/data/parse_au_primary_benchmarks.ts`
2. Validates: 100 industries, all ratios in 0-1 range, bands monotonic.
3. Maps ANZSIC → our internal industry IDs (the tricky part; a
   curated map ships with the parser).
4. AUD → USD conversion at a single locked rate (current FX or PPP;
   decision deferred until the file is in hand).
5. Writes `data/finance/au_primary_benchmarks_v1.json` — primary
   data, quality grade A.
6. Cost-engine override layer reads the file and prefers AU primary
   over modelled extrapolations for any AU cell.
7. A new badge surfaces on AU cell pages: "Primary data".
8. Feature flag: `NEXT_PUBLIC_AU_PRIMARY_DATA=1` controls whether
   the override is live. Off by default until you spot-check.

## If the file isn't available in either format

Two fallback paths:

- **Use the Chrome MCP browser**: I navigate ato.gov.au via the
  real browser extension and extract the tables via DOM. Slower, brittle.
- **Skip Phase 1**: ship what's already live. The four other phases
  are already in production.

Let me know which path. In the meantime, the parser skeleton at
`scripts/data/parse_au_primary_benchmarks.ts` is ready and waiting.
