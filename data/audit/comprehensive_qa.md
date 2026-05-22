# Comprehensive QA audit

Generated 2026-05-22T18:48:54.303Z against https://www.marginatlas.com.

## Summary

**107 / 112 pass (95.5%)**

### By category

| Category | Pass | Total | % |
|---|---:|---:|---:|
| A. Routing | 15 | 15 | 100% |
| B. Content | 20 | 20 | 100% |
| C. Consistency | 9 | 10 | 90% |
| D. Data sanity | 10 | 12 | 83% |
| E. SEO | 14 | 15 | 93% |
| F. A11y | 8 | 8 | 100% |
| G. Performance | 7 | 8 | 88% |
| H. Links | 10 | 10 | 100% |
| I. Sitemap | 8 | 8 | 100% |
| J. Mobile | 6 | 6 | 100% |

## Failures

### C. Consistency

- C7: No em-dashes in homepage user-visible text — assertion returned false

### D. Data sanity

- D4: Bottom 10% is below typical — assertion returned false
- D8: Profit waterfall percentages are 0-100 — assertion returned false

### E. SEO

- E4: Homepage has og:title — assertion returned false

### G. Performance

- G7: Speed Insights script wired — assertion returned false

## All assertions (passed + failed)

| ID | Category | Description | Result | Status |
|---|---|---|---|---|
| A1 | A. Routing | Homepage 200 | PASS | 200 |
| A2 | A. Routing | /industries 200 | PASS | 200 |
| A3 | A. Routing | /industries/restaurants 200 | PASS | 200 |
| A4 | A. Routing | /us 200 | PASS | 200 |
| A5 | A. Routing | /de 200 | PASS | 200 |
| A6 | A. Routing | US state cell 200 | PASS | 200 |
| A7 | A. Routing | German city cell 200 | PASS | 200 |
| A8 | A. Routing | French city cell 200 | PASS | 200 |
| A9 | A. Routing | Neighborhood cell 200 | PASS | 200 |
| A10 | A. Routing | Force-synthesis cell 200 | PASS | 200 |
| A11 | A. Routing | Sector page 200 | PASS | 200 |
| A12 | A. Routing | /world 200 | PASS | 200 |
| A13 | A. Routing | /coverage 200 | PASS | 200 |
| A14 | A. Routing | /og/cell returns 200 | PASS | 200 |
| A15 | A. Routing | /admin/data-quality 200 | PASS | 200 |
| B1 | B. Content | Homepage has hero question | PASS | 200 |
| B2 | B. Content | Homepage has at least 6 featured tiles | PASS | 200 |
| B3 | B. Content | Homepage has no 'Click for details' placeholder | PASS | 200 |
| B4 | B. Content | /industries has Popular section | PASS | 200 |
| B5 | B. Content | /industries has By sector section | PASS | 200 |
| B6 | B. Content | /industries has A-Z section | PASS | 200 |
| B7 | B. Content | /industries shows sector emojis | PASS | 200 |
| B8 | B. Content | Cell page has h1 | PASS | 200 |
| B9 | B. Content | Cell page has revenue tiles | PASS | 200 |
| B10 | B. Content | Cell page has distribution visual | PASS | 200 |
| B11 | B. Content | Cell page has profit waterfall section | PASS | 200 |
| B12 | B. Content | Frankfurt page shows 'Frankfurt am Main' label | PASS | 200 |
| B13 | B. Content | Lyon page shows Lyon label | PASS | 200 |
| B14 | B. Content | Synth cell shows Estimated badge | PASS | 200 |
| B15 | B. Content | Neighborhood page shows character chip | PASS | 200 |
| B16 | B. Content | Country page lists industries | PASS | 200 |
| B17 | B. Content | Coverage page renders | PASS | 200 |
| B18 | B. Content | World page renders | PASS | 200 |
| B19 | B. Content | Sector page renders sector name | PASS | 200 |
| B20 | B. Content | Admin dashboard has table inventory | PASS | 200 |
| C1 | C. Consistency | Header brand 'Margin Atlas' on all pages | PASS | 200 |
| C2 | C. Consistency | Cell page has header brand | PASS | 200 |
| C3 | C. Consistency | Footer present on cell page | PASS | 200 |
| C4 | C. Consistency | Tesseract Research credit in footer (homepage) | PASS | 200 |
| C5 | C. Consistency | $ formatting present (not blank) | PASS | 200 |
| C6 | C. Consistency | Currency symbol consistent on country page | PASS | 200 |
| C7 | C. Consistency | No em-dashes in homepage user-visible text | FAIL | 200 |
| C8 | C. Consistency | No source-agency names leak in homepage | PASS | 200 |
| C9 | C. Consistency | No source-agency names leak in cell page | PASS | 200 |
| C10 | C. Consistency | /industries doesn't link to /us/california | PASS | 200 |
| D1 | D. Data sanity | California restaurants revenue is plausible ($30K-$5M) | PASS | 200 |
| D2 | D. Data sanity | Frankfurt restaurants revenue is plausible | PASS | 200 |
| D3 | D. Data sanity | Wage per employee is plausible ($3K-$200K) | PASS | 200 |
| D4 | D. Data sanity | Bottom 10% is below typical | FAIL | 200 |
| D5 | D. Data sanity | Frankfurt page doesn't show 'Hessen' in title | PASS | 200 |
| D6 | D. Data sanity | Manhattan revenue differs from city avg (multiplier applied) | PASS | 200 |
| D7 | D. Data sanity | Synth cell uses positive revenue | PASS | 200 |
| D8 | D. Data sanity | Profit waterfall percentages are 0-100 | FAIL | 200 |
| D9 | D. Data sanity | Across-states strip has multiple states | PASS | 200 |
| D10 | D. Data sanity | Page doesn't say 'NaN' or 'undefined' anywhere visible | PASS | 200 |
| D11 | D. Data sanity | Cross-country chart doesn't include Liechtenstein | PASS | 200 |
| D12 | D. Data sanity | Synthesized cells include disclosure | PASS | 200 |
| E1 | E. SEO | Homepage has <title> | PASS | 200 |
| E2 | E. SEO | Homepage has meta description | PASS | 200 |
| E3 | E. SEO | Homepage has canonical link | PASS | 200 |
| E4 | E. SEO | Homepage has og:title | FAIL | 200 |
| E5 | E. SEO | Homepage has Organization JSON-LD | PASS | 200 |
| E6 | E. SEO | Cell page has dataset JSON-LD | PASS | 200 |
| E7 | E. SEO | Cell page has BreadcrumbList JSON-LD | PASS | 200 |
| E8 | E. SEO | Cell page has robots meta = index, follow | PASS | 200 |
| E9 | E. SEO | Admin dashboard is noindex | PASS | 200 |
| E10 | E. SEO | Robots.txt is text/plain | PASS | 200 |
| E11 | E. SEO | Robots.txt mentions sitemap | PASS | 200 |
| E12 | E. SEO | Country page has proper title | PASS | 200 |
| E13 | E. SEO | Industry page has proper title | PASS | 200 |
| E14 | E. SEO | Cell page title includes city / state name | PASS | 200 |
| E15 | E. SEO | OG image URL points to /og/cell | PASS | 200 |
| F1 | F. A11y | Homepage has lang attribute | PASS | 200 |
| F2 | F. A11y | Cell page has lang attribute | PASS | 200 |
| F3 | F. A11y | Buttons have type attribute | PASS | 200 |
| F4 | F. A11y | Header has navigation landmark | PASS | 200 |
| F5 | F. A11y | Main landmark present | PASS | 200 |
| F6 | F. A11y | Skip-to-content or similar (if present) | PASS | 200 |
| F7 | F. A11y | Color is not the only indicator (CSS check skipped — runtime) | PASS | 200 |
| F8 | F. A11y | Buttons in nav have text content (not icon-only) | PASS | 200 |
| G1 | G. Performance | Homepage response under 5 seconds | PASS | 200 |
| G2 | G. Performance | Homepage HTML size under 500 KB | PASS | 200 |
| G3 | G. Performance | Cell page HTML size under 500 KB | PASS | 200 |
| G4 | G. Performance | Homepage uses font-display: swap (next/font) | PASS | 200 |
| G5 | G. Performance | Cache-Control header on homepage (cdn cacheable) | PASS | 200 |
| G6 | G. Performance | Cache-Control header on cell page | PASS | 200 |
| G7 | G. Performance | Speed Insights script wired | FAIL | 200 |
| G8 | G. Performance | Images use lazy or async loading (where present) | PASS | 200 |
| H1 | H. Links | Homepage has >= 20 internal links | PASS | 200 |
| H2 | H. Links | Cell page has breadcrumb | PASS | 200 |
| H3 | H. Links | Cell page has >= 12 outgoing internal links | PASS | 200 |
| H4 | H. Links | /industries page links to actual industry pages | PASS | 200 |
| H5 | H. Links | Country page links to industries | PASS | 200 |
| H6 | H. Links | Neighborhood page links to sibling neighborhoods | PASS | 200 |
| H7 | H. Links | Footer has navigation links | PASS | 200 |
| H8 | H. Links | Cell page links to country (back-link) | PASS | 200 |
| H9 | H. Links | Neighborhood page links to city | PASS | 200 |
| H10 | H. Links | /industries Popular section has >= 8 links | PASS | 200 |
| I1 | I. Sitemap | Sitemap shard 0 > 1 KB | PASS | 200 |
| I2 | I. Sitemap | Sitemap shard 1 > 1 KB | PASS | 200 |
| I3 | I. Sitemap | Sitemap shard 2 > 1 KB | PASS | 200 |
| I4 | I. Sitemap | Sitemap shard 3 > 1 KB | PASS | 200 |
| I5 | I. Sitemap | Sitemap shard 4 > 1 KB | PASS | 200 |
| I6 | I. Sitemap | Sitemap shard 5 > 1 KB | PASS | 200 |
| I7 | I. Sitemap | Sitemap returns XML content-type | PASS | 200 |
| I8 | I. Sitemap | Robots.txt references sitemap URLs | PASS | 200 |
| J1 | J. Mobile | Viewport meta present | PASS | 200 |
| J2 | J. Mobile | Mobile-tag responsive classes (md:, lg:) used | PASS | 200 |
| J3 | J. Mobile | Hero text scales (h1 has size class) | PASS | 200 |
| J4 | J. Mobile | Hero on cell page is responsive | PASS | 200 |
| J5 | J. Mobile | Grid uses responsive cols | PASS | 200 |
| J6 | J. Mobile | No fixed pixel widths visible (px-300, px-400) | PASS | 200 |
