# Margin Atlas — Plan v3.0
## The Small-Business Atlas correction, visual identity expansion, and execution roadmap

> Status: written 2026-05-15, after Phase F went live (57,816 extrapolated cells × 219 countries) and after the founder's strategic re-anchor of the product around the SMB audience.

---

## 0 · Table of contents

1. [Where we are right now](#1--where-we-are-right-now)
2. [The strategic re-anchor: SMB-first](#2--the-strategic-re-anchor-smb-first)
3. [Phase L · Taxonomy correction](#3--phase-l--taxonomy-correction)
4. [Phase M · Visual identity expansion](#4--phase-m--visual-identity-expansion)
5. [Phase N · Featured anchors on home](#5--phase-n--featured-anchors-on-home)
6. [Phase O · Empty-state + nudge UX](#6--phase-o--empty-state--nudge-ux)
7. [Phase P · Premium gating for corp-only data](#7--phase-p--premium-gating-for-corp-only-data)
8. [Phase Q · Sub-national data ingest (later)](#8--phase-q--sub-national-data-ingest-later)
9. [Phase R · Auth + tiers wiring (later)](#9--phase-r--auth--tiers-wiring-later)
10. [Color palette expansion — full spec](#10--color-palette-expansion--full-spec)
11. [Image placeholder catalog](#11--image-placeholder-catalog)
12. [Execution order + estimates](#12--execution-order--estimates)
13. [Risks, open questions, watch-fors](#13--risks-open-questions-watch-fors)

---

## 1 · Where we are right now

**Live and working:**
- 722k US state-level cells in `cells_master` (Supabase)
- 57,816 extrapolated cells in `extrapolated_cells` covering **219 countries**
- Cell pages with: dimension switcher, time-series charts, real piecewise-density histogram, YoY badges, typical-firm card, rank line, across-states strip, AtlasScore, save/copy/CSV/embed action row, sticky TOC
- `/compare` (live API, 4-cell side-by-side)
- `/you` (Compare-to-me calculator, privacy-by-design)
- `/saved` (localStorage)
- `/embed/[country]/[geo]/[industry]` (iframe-friendly)
- `/api/cell-lookup`, `/api/export-csv`, `/api/ask` (Ask is preview-gated; key stored in `.env.local`, not in Vercel env, until tone is locked)
- AI-crawler blocks + rate limiting at the edge
- Generic source labels everywhere (Phase A lockdown live)
- Loading skeletons + branded 404

**Pending the user (no engineering needed):**
- marginatlas.com DNS — two CNAMEs at Cloudflare (in progress, separate thread)
- Editorial tone — locks Phase B.5 / G / H out until decided

**Confirmed gaps (the reason for this plan):**
1. **Scope drift** — current taxonomy includes industries that have no business being in an atlas built for the SMB founder (banks, oil & gas extraction, pharmaceutical manufacturing, etc.).
2. **Bland visuals** — palette is technically correct but undifferentiated; warm graphite + burnt amber alone reads flat across many surfaces. Needs more in-family variation.
3. **No country flags / sector icons** — every country and sector list is a wall of text.
4. **Alphabetical ordering not consistent** — countries are quality-ranked, industries are sometimes file-order.
5. **Featured cells are buried** below the fold and only have 6 generic US slots. Should be 12, hand-picked, stereotypical, multi-country, prominent.
6. **Granularity ceiling** — at SMB scale, "boutique clothing" vs "jewelry shop" vs "shoe store" matter enormously; current taxonomy collapses them into "specialty retail".
7. **No country-level landing pages** — `/de`, `/fr` etc. probably 404 or are bare.
8. **No image surfaces** — there are zero photographs or illustrations anywhere. Site reads like a B2B spreadsheet.

---

## 2 · The strategic re-anchor: SMB-first

> **Margin Atlas is for the founder, the operator, the shop owner, the small consultant. It is not for analysts of public companies.**

Implications:

| Audience | What they want | What they don't |
|---|---|---|
| Boutique owner in Milan | "What does a typical clothing shop here actually earn?" | "What's the average revenue of LVMH?" |
| Software dev in Bangalore | "What do 5-person custom-software shops in India bill?" | "What's Infosys' margin?" |
| Aspiring café owner | "Can a café in this town pay rent?" | "Starbucks's Q3 numbers" |
| Wedding photographer | "What do solo photographers in California gross?" | "Getty's revenue" |

The product breaks the moment we put **banks / asset managers / oil majors / pharma giants** in the same UI as bakeries and bike shops, because:
- The distribution is bimodal: 10-person consulting shop sits in the same bucket as McKinsey
- The average is meaningless
- The audience for "What does Goldman make?" already has Bloomberg, S&P, FactSet
- The founder typing "restaurants California" never wanted bank data in the same nav

**The fix is curation, not deletion.** The big-corp data stays in the warehouse. We just don't expose it by default. Pro tier unlocks the wider universe with appropriate firm-size caveats.

---

## 3 · Phase L · Taxonomy correction

**Goal:** Re-tag every industry by audience fit, split bundles that lumped small and large together, add the granular SMB sub-niches the founder actually searches for. Go from 80 industries → ~140 SMB-relevant ones plus ~25 corp-only industries kept on ice.

### L.1 — Tag every industry with an `audience` field

In `src/lib/taxonomy/industries.json`, add a new field per industry:

| Tag | Meaning | Default UI behavior |
|---|---|---|
| `smb_core` | SMBs dominate by count and by economic relevance | Always visible |
| `smb_friendly` | Has a big-corp tail but SMB participation is meaningful | Visible, optional "Best read at small-firm scale" chip when n_employees per firm > 100 |
| `mixed_caution` | Bimodal; average is misleading | Hidden by default; available via `?show_mixed=1` |
| `corp_only` | Large corporations dominate; SMB participation negligible | Hidden by default; **Pro-tier toggle only** |

### L.2 — Flag the corp-only set (initial cut)

These move to `corp_only` and are removed from default nav, search, sectors index:

- Banking
- Investment & securities (asset management, hedge funds, PE — when split out)
- Large insurance carriers (KEEP local insurance brokers as `smb_core`)
- Oil & gas extraction
- Pharmaceutical manufacturing
- Heavy chemicals manufacturing
- Aerospace & defense manufacturing
- Semiconductors & electronics manufacturing
- Mining
- Utilities (electricity / gas distribution)
- Telecom carriers
- Tobacco manufacturing
- Major rail / shipping carriers
- Beverage manufacturing (when "Coca-Cola scale" — keep craft breweries separate as `smb_core`)
- Major automotive OEMs (keep auto repair / body shops as `smb_core`)

### L.3 — Split the bundles that broke

Several current "industries" lump small and big together. Split:

**Manufacturing** (current single bucket → 5 SMB buckets + 1 corp bucket):
- Light manufacturing / custom fabrication → `smb_core`
- Food & beverage production (small batch, craft) → `smb_core`
- Apparel & textile manufacturing → `smb_friendly`
- Furniture & woodworking → `smb_core`
- Metal fabrication → `smb_friendly`
- Heavy industrial manufacturing (the chemicals/pharma/semis/aerospace bundle) → `corp_only`

**Consulting & professional services**:
- Boutique management consulting → `smb_core`
- Marketing & creative agencies → `smb_core`
- IT consulting / MSPs → `smb_core`
- Engineering consulting (small) → `smb_friendly`
- Big-firm professional services → `mixed_caution`

**Construction**:
- Residential construction → `smb_core`
- Light commercial construction → `smb_friendly`
- Specialty trades (electrical, plumbing, roofing, HVAC, painting) → `smb_core` (separate industries)
- Heavy civil → `mixed_caution`

**Software & IT**:
- Web & mobile development shops → `smb_core`
- Custom software / contract dev → `smb_core`
- IT services & MSPs → `smb_core`
- SaaS startups (small) → `smb_friendly`
- Game dev studios → `smb_friendly`
- Big tech / platform companies → `corp_only`

**Finance, insurance & real estate**:
- Real estate agencies → `smb_core`
- Property leasing & rental → `smb_core`
- Local insurance brokers → `smb_core`
- Banking → `corp_only`
- Investment & securities → `corp_only` (with a possible exception for boutique RIAs — flag as `smb_friendly`)

### L.4 — Add granular SMB sub-niches (the premium edge)

These are the queries an SMB owner types. Each becomes its own industry record (with parent links so existing URLs still resolve via fallback).

**Apparel & accessories** (currently 1 industry, becomes 10):
- Boutique clothing
- Streetwear / casual apparel
- Designer fashion
- Children's & maternity clothing
- Plus-size / specialty fit
- Jewelry stores
- Watch shops
- Eyewear / optical retail
- Shoe stores
- Bags & leather goods
- Lingerie / intimates
- Vintage / consignment

**Food & drink** (currently 1 industry, becomes 14):
- Restaurants (sit-down)
- Fast-casual restaurants
- Cafés & coffee shops
- Bakeries
- Pastry & dessert shops
- Bars & pubs
- Wine bars
- Breweries & taprooms
- Pizzerias
- Ice cream / frozen dessert shops
- Food trucks
- Catering services
- Specialty groceries / delis
- Tea houses / matcha bars

**Beauty & personal care** (currently 1 industry, becomes 9):
- Hair salons (full service)
- Barbershops
- Nail salons
- Day spas
- Massage therapy clinics
- Tanning salons
- Brow & lash studios
- Med spas (small)
- Tattoo & piercing studios

**Education & instruction** (currently mostly missing, add 10):
- Tutoring centers
- Test-prep services
- Language schools
- Music schools / private lessons
- Dance studios
- Driving schools
- Martial arts dojos
- Yoga & pilates studios
- Coding bootcamps / coding schools
- Private K-12 schools (small)
- Daycare & preschool
- Art classes & studios

**Specialty retail** (currently 1 industry, becomes 12):
- Bookstores (indie)
- Toy & game stores
- Hardware stores (local)
- Garden centers / nurseries
- Pet stores
- Wine & liquor stores
- Sporting goods (specialty)
- Bike shops
- Art & craft supplies
- Home decor & gift shops
- Stationery & paper goods
- Tobacco & vape shops
- Music instrument shops

**Repair & service** (currently bundled, becomes 9):
- Auto repair shops
- Auto body shops
- Bike repair
- Electronics & phone repair
- Tailoring & alterations
- Watch & jewelry repair
- Shoe repair
- Locksmiths
- Appliance repair

**Wellness & small medical** (currently sparse, becomes 8):
- Private dental practices
- Chiropractic clinics
- Physical therapy clinics
- Optometry / vision centers
- Veterinary clinics (small)
- Mental health practices (small)
- Nutritionist / dietician practices
- Pharmacy (independent)

**Local services & trades** (currently sparse, becomes 11):
- Plumbing services
- Electrical services
- HVAC services
- Painting (residential)
- Cleaning services (residential)
- Cleaning services (commercial, small)
- Landscaping & lawn care
- Pool service & maintenance
- Pest control (local)
- Window washing
- Junk removal & moving (small)

**Creative & professional (solo / boutique)** (currently bundled, becomes 11):
- Photography studios
- Videography services
- Graphic design studios
- Wedding planning & coordination
- Event production (small)
- Florist shops
- Personal training
- Real estate agencies
- Independent insurance brokers
- Sole-practitioner accounting
- Sole-practitioner law firms
- Notary / paralegal services

**Hospitality (SMB)** (currently bundled):
- Independent hotels & inns
- Bed & breakfasts
- Hostels
- Short-term rental management (small)
- Vacation rental owners

**Manufacturing (SMB sub-niches — added value)**:
- Craft breweries
- Specialty food production
- Artisan baked goods (wholesale)
- Coffee roasters
- Soap & candle makers
- Custom furniture builders
- Custom jewelers
- Small leather goods
- Custom apparel
- Sign shops
- Print shops (offset / digital)
- Sign & graphics fabrication

### L.5 — Data backing strategy

Most of these sub-niches won't have direct measurements in SUSB / Eurostat / Destatis. Strategy:

1. Each sub-niche has a **parent industry** field that points to the existing measured industry (e.g. "Boutique clothing" → parent "Specialty retail").
2. On the cell page, if there's no direct measurement for the sub-niche, we render the parent industry's numbers with a small chip: **"Best available — granular data coming"**.
3. The sub-niche taxonomy is ahead of the data on purpose — the names exist for SEO and for the navigator. The cells improve over time as we layer in finer-grained sources (Yelp public counts, IRS SOI, NAICS-6 where it actually has the right detail, scraped specialty trade associations, etc.).

### L.6 — Files affected (Phase L)

- `src/lib/taxonomy/industries.json` — add `audience`, split bundles, add ~80 new sub-niche entries with parent links
- `src/lib/taxonomy/sectors.json` — minor cleanup; sectors mostly stay
- `src/lib/taxonomy.ts` — add `searchIndustries({ audience? })` filter, parent-lookup helper, `slugToIndustry` should also resolve parent fallback for sub-niches with no direct data
- `src/lib/cells.ts` — `getCellBySlug` learns to fall back from sub-niche industry to parent industry when no rows match
- `src/components/NavigatorForm.tsx` — industry dropdown filters out non-`smb_core` + non-`smb_friendly` by default
- `src/components/ComboField.tsx` — alphabetical sort everywhere
- `src/components/GlobalSearch.tsx` — corp_only filtered out unless `?show_large=1`
- New: `src/components/AudienceCaveat.tsx` — chip that appears on `smb_friendly` / `mixed_caution` cells

**Estimated effort:** 1.5–2 days (mostly JSON authorship; code is small).

---

## 4 · Phase M · Visual identity expansion

The site needs three layers of polish in this phase:

- **4.1** — Country flags everywhere a country appears
- **4.2** — Sector icons everywhere a sector appears
- **4.3** — Alphabetical ordering everywhere
- **4.4** — Color palette expansion (see [section 10](#10--color-palette-expansion--full-spec))
- **4.5** — Image surfaces (see [section 11](#11--image-placeholder-catalog))

### 4.1 — Country flags

Use unicode regional indicator pairs — no SVG, no asset bundle, no licensing. Two-line implementation:

```ts
// src/lib/countries.ts
export function flagFromIso2(iso2: string): string {
  const code = iso2.toUpperCase();
  if (code.length !== 2) return "";
  return String.fromCodePoint(...code.split("").map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}
```

**Apply at:**
- `NavigatorForm` country dropdown
- `ComboField` (country options)
- `GlobalSearch` results (country hits)
- Compare slot card
- `AcrossStatesStrip` is US-only so flags don't apply; but **add a `AcrossCountriesStrip` variant** for non-US cells showing the same industry in 6-10 other countries with flags
- Cell page hero — small flag chip next to country/region label
- Breadcrumb — flag next to country segment
- Country landing pages (`/[country]` — see [section 6](#6--phase-o--empty-state--nudge-ux) for the full spec)

**Layout convention:** Flag on the left, name on the right, separated by a single space. Example: `🇩🇪 Germany`. Mobile: same. Cards: flag is its own element with proper margin.

### 4.2 — Sector icons

Use emoji glyphs (same advantage as flags — no asset pipeline). Add `icon` field to each sector in `sectors.json`:

| Sector | Icon | Notes |
|---|---|---|
| Agriculture, fishing, forestry | 🌾 | wheat |
| Mining & utilities | ⛏️ | (corp_only — hidden by default) |
| Manufacturing | 🏭 | factory |
| Construction | 🏗️ | crane |
| Wholesale & retail trade | 🏬 | department store |
| Specialty retail | 🛍️ | shopping bags |
| Hotels, restaurants & food | 🍽️ | plate & utensils |
| Transport & logistics | 🚚 | delivery truck |
| Information & communications | 💻 | laptop |
| Finance & insurance (SMB) | 💼 | briefcase |
| Real estate | 🏘️ | houses |
| Professional services | 📋 | clipboard |
| Education & training | 🎓 | mortarboard |
| Health & social care | 🩺 | stethoscope |
| Arts, entertainment & sports | 🎨 | palette |
| Beauty & personal care | 💇 | haircut |
| Local services & trades | 🛠️ | hammer & wrench |
| Other services | ✨ | sparkles |

**Apply at:** sector dropdown, sector landing pages (`/sectors/[id]`), cell page hero "sector" line, navigator second-stage.

### 4.3 — Alphabetical ordering

- `COUNTRIES`: change from quality-ranked to alphabetical. Keep `quality` as a field, used only for the country-page coverage badge.
- Sectors: alphabetical by display name in dropdowns; `order` field becomes informational only (for sectors index page where we keep the curated order).
- Industries inside a sector: alphabetical.
- Compare slot dropdowns: alphabetical.
- Search results: a search-relevance score still controls top hits, but ties break alphabetically.

### 4.4 / 4.5

See full specs in sections 10 and 11 below.

**Files affected (Phase M, excluding colors/images which are their own sections):**
- `src/lib/countries.ts` — flag helper
- `src/lib/taxonomy/sectors.json` — add `icon`
- `src/lib/taxonomy.ts` — alphabetical sort helpers, `iconForSector` re-export
- `src/components/NavigatorForm.tsx` — render flags + icons
- `src/components/ComboField.tsx` — render flags
- `src/components/GlobalSearch.tsx` — render flags + icons
- `src/components/AcrossStatesStrip.tsx` — flags column in non-US variant
- New: `src/components/AcrossCountriesStrip.tsx`
- `src/app/[country]/[geo]/[industry]/page.tsx` — hero chip
- `src/app/sectors/[sector]/page.tsx` — icon in hero
- `src/app/[country]/page.tsx` — needs to exist; see Phase O.3

**Estimated effort:** 0.5–1 day.

---

## 5 · Phase N · Featured anchors on home

Replace the current 6-tile generic strip with a **prominent 12-tile featured grid placed ABOVE the "What you'll see" section** — i.e. directly under the hero / navigator. This is the primary entry point for first-time visitors.

### 5.1 — The 12 stereotypical anchors

Hand-curated, immediately recognizable to anyone:

| # | Title | URL | Note |
|---|---|---|---|
| 1 | 🇮🇹 Clothing boutiques — Italy | `/it/italy/clothing-boutiques` | "in Milan" once city level lands |
| 2 | 🇺🇸 Real estate agencies — New York | `/us/new-york/real-estate-agencies` | already live |
| 3 | 🇫🇷 Cosmetics shops — France | `/fr/france/cosmetics-shops` | "in Paris" once city level lands |
| 4 | 🇺🇸 Software development — California | `/us/california/software-development` | already live |
| 5 | 🇮🇳 Custom software & IT services — India | `/in/india/custom-software` | "in Bangalore" later |
| 6 | 🇨🇦 Residential construction — Canada | `/ca/canada/residential-construction` | "in Toronto" later |
| 7 | 🇪🇸 Hotels & inns — Spain | `/es/spain/hotels-inns` | "in Barcelona" later |
| 8 | 🇩🇪 Industrial machinery — Germany | `/de/germany/industrial-machinery` | "in Baden-Württemberg" later |
| 9 | 🇺🇸 Management consulting — Washington, D.C. | `/us/district-of-columbia/management-consulting` | already live |
| 10 | 🇧🇷 Craft beer & beverages — Brazil | `/br/brazil/breweries` | |
| 11 | 🇦🇺 Cafés & coffee shops — Australia | `/au/australia/cafes` | "in Melbourne" later |
| 12 | 🇺🇸 Restaurants — California | `/us/california/restaurants` | already live |

### 5.2 — Tile design

Each tile shows:
- The flag (large, 1.5em)
- Industry name (semibold, ink-900)
- Region / country name (lighter, ink-700)
- A 1-line headline number when the cell loads: "Typical: $480K/yr" or "5,200 firms here"
- A subtle hover state: border becomes amber-500
- An optional **stylized industry image at the top of the tile** (see [section 11](#11--image-placeholder-catalog) for the placeholder spec)

### 5.3 — Resilience

For tiles that point to country-level non-US cells (extrapolated, 2-star), the tile still renders with the available number. The title says "Italy" today; when sub-national lands, the URL auto-upgrades to "Milan, Italy" without breaking.

**Files affected:**
- `src/app/page.tsx` — replace popular-pages section with the new 12-tile grid; move above "What you'll see"
- New: `src/components/FeaturedCellTile.tsx`
- New: `src/app/api/cell-snapshot/route.ts` — lightweight endpoint returning just `{ revenue_per_firm, n_enterprises, quality_score, year }` per featured cell (so the home page server-renders all 12 numbers in one round trip)

**Estimated effort:** 0.5 day.

---

## 6 · Phase O · Empty-state + nudge UX

### O.1 — Always serve something

Verify and enforce:
- Navigator: if user picks only country + industry (no region, no size), navigate to the country-level cell. Already works for non-US; verify US falls back to a sensible default state (California for general, or the highest-firm-count state for that industry — even better).
- If a requested size band has no data: silently fall back to all-sizes; show a small chip `Showing all firm sizes`.
- If a sub-niche industry has no direct data: render the parent industry data with chip `Best available — granular data coming` (see Phase L.5).

### O.2 — Top-of-page nudge bar

When the current cell is low-coverage (quality < 50 OR n_enterprises is null), insert a one-line bar above the hero:

> *"Stronger data for this industry in [neighbor]"* → one-click pivot

Examples:
- On `/in/india/custom-software` (extrapolated, qual 40) → nudge to `/us/california/custom-software` and `/de/germany/custom-software`
- On `/us/wyoming/restaurants` (small n) → nudge to `/us/california/restaurants` and `/us/texas/restaurants`

Neighbor logic: pick the cell with the highest `n_enterprises` from the same industry across all covered geographies.

### O.3 — Country landing pages

Right now `/de`, `/fr`, `/it` etc. probably 404. Build a real country page:

**Layout:**
- 🇩🇪 Flag + country name + coverage tier badge ("B" / "C" / "Estimated")
- "Top industries in Germany" — top 10 industries by firm count, with links to cells
- "Featured industry for this country" — hand-curated 1-line map (DE → industrial machinery; FR → cosmetics; CH → watches; IT → fashion/leather; JP → manufacturing; IN → custom software; BR → mining/agriculture; CA → forestry/residential construction; AU → mining/hospitality; UK → financial services boutiques; ES → tourism; PT → tourism; MX → manufacturing; KR → electronics — but pivot away from corp_only categories at display time)
- "All industries we cover in Germany" — grid of links grouped by sector
- An image surface (see [section 11](#11--image-placeholder-catalog))

**Files:**
- New: `src/app/[country]/page.tsx`
- Reuse: `getCellBySlug`, `getSameIndustryAcrossStates` (extend for non-US: `getTopIndustriesForCountry`)
- New helper in `cells.ts`: `getTopIndustriesForCountry(iso2, limit=10)` — for US, queries `cells_master`; for non-US, queries `extrapolated_cells`

### O.4 — Cell page micro-nudges

On a cell page, when a section has no data (e.g. no time series for an extrapolated cell because we only have one year), the section gracefully hides rather than rendering an empty card. Verify all sections short-circuit on empty.

**Estimated effort:** 1 day.

---

## 7 · Phase P · Premium gating for corp-only data

### P.1 — Default UI filter

- Navigator industry dropdown: filter out `audience === "corp_only"`
- GlobalSearch: same
- Sectors index page: a section labeled "For larger firms" appears only when `?show_large=1` query param or `pro=1` cookie is present
- Sector landing pages: the corp_only industries are filtered out of the industry list by default

### P.2 — Direct URL access

Allow direct URL access to corp_only cells (we don't 404 them — they exist for SEO and for people who arrive from search), but show a banner at the top:

> "This industry is dominated by large firms — numbers reflect the whole industry including major corporations and may not be representative of small businesses. **Pro unlocks the segmented view by firm size.**"

### P.3 — Pricing page update

Add to Pro tier features list:
- "Access to large-corporation industries (banking, oil & gas, pharma, etc.) with appropriate caveats"
- "Firm-size segmentation on bimodal industries"
- "Sub-niche granular data (boutique vs jewelry vs specialty retail) as it lands"

**Files affected:**
- `src/components/NavigatorForm.tsx`
- `src/components/GlobalSearch.tsx`
- `src/app/sectors/[sector]/page.tsx`
- `src/app/[country]/[geo]/[industry]/page.tsx` — caveat banner
- `src/app/pricing/page.tsx`
- New: `src/lib/audience.ts` — helper that reads the cookie/query and exposes `isProUI()` server-side

**Estimated effort:** 0.5 day.

---

## 8 · Phase Q · Sub-national data ingest (later — research phase)

Not part of this round, but called out so we know what's coming:

- **US counties** — Census ZBP (ZIP Business Patterns) — already partially built in `/scripts`; needs Supabase landing
- **EU NUTS-2** — Eurostat regional SBS — `sbs_r_nuts06_r2` table family; needs region code mapping
- **JP prefectures** — e-Stat economic census by prefecture (47 of them)
- **FR départements** — INSEE Sirene + REE region tables
- **DE Bundesländer** — Destatis regional 47415 series; we already touched this
- **UK NUTS / ITL** — ONS Business Register & Employment Survey
- **CA provinces** — StatCan Business Register subdivisions
- **AU states & territories** — ABS Business Indicators

For each, the same pipeline applies: ingest → normalize to (country, geo_id, industry, year, size_band) → write to `cells_master` (US-style) or `regional_cells` (new table for non-US sub-national).

Phase N tiles that say "Milan" or "Bangalore" or "Toronto" will auto-upgrade their URLs the moment the underlying region cells land.

---

## 9 · Phase R · Auth + tiers wiring (later)

- Email-magic-link auth via Supabase Auth (free; no Supastarter needed initially)
- Pro tier: Stripe subscription (existing $38 / $78 / $150 ladder)
- Server-side `isProUI()` reads from Supabase auth session and Stripe subscription status
- Saved cells migrate from localStorage to Supabase row per user
- CSV export quotas enforced per tier
- Embed widget gets a personalized footer for Pro+

Not in this round.

---

## 10 · Color palette expansion — full spec

**Constraint:** Stay strictly inside the warm-earth-tone family. No cool colors except the existing single sparse deep teal. Aquamarine is reserved for the founder's other product (Tesseract Stock Agent) and must not appear here.

### 10.1 — Current palette (auditable)

| Token | Hex | Where used |
|---|---|---|
| `atlas-500` | #D97706 | Primary amber, links, hover, buttons |
| `atlas-600` | #C2410C | Deeper amber, pressed states |
| `atlas-100` | (light cream) | Distribution bar fill |
| `ink-900` | #1A1A1A | Headline text |
| `ink-700` | (mid graphite) | Body text |
| `ink-50` | #FAFAF7 | Page background |
| `ink-200` | (border) | Card borders |
| `teal-700` | #0F766E | Sparse data accent (rarely used) |
| `emerald-700` / `rose-700` | (Tailwind defaults) | YoY +/- deltas |

**Issue:** only two real expressive colors (amber + graphite). Everything else is grey-tinted. The eye fatigues fast.

### 10.2 — Proposed expanded palette

Eight in-family tones added, each with 50/100/300/500/700/900 stops where it makes sense. All within warm-earth-tone family:

#### Primary family (amber spine — keep as-is)
| Token | Hex | Usage |
|---|---|---|
| `atlas-50` | `#FEF7ED` | Lightest amber wash for hero gradients |
| `atlas-100` | `#FDE9CC` | Subtle highlight backgrounds |
| `atlas-300` | `#FBBF24` | Tertiary chips, callout fills |
| `atlas-500` | `#D97706` | Primary (current) |
| `atlas-600` | `#C2410C` | Primary pressed (current) |
| `atlas-700` | `#9A3412` | Headline accents |
| `atlas-900` | `#7C2D12` | Deepest amber — top of CTAs, hover-pressed |

#### Sand / parchment layers (replace flat white-on-white)
| Token | Hex | Usage |
|---|---|---|
| `cream-50` | `#FEFBF6` | Page background (warmer than current `#FAFAF7`) |
| `cream-100` | `#F8F2E4` | Card backgrounds in sectioned views |
| `cream-200` | `#EEE6D2` | Hover surface on tiles |
| `parchment` | `#E8DDC7` | Coverage tier badges, soft borders |

#### Moss (positive deltas — replace harsh emerald)
| Token | Hex | Usage |
|---|---|---|
| `moss-100` | `#ECFCCB` | Background of "+ YoY" badge |
| `moss-500` | `#65A30D` | Mid moss for chart positive areas |
| `moss-700` | `#3F6212` | Text for positive YoY (replaces emerald-700) |

#### Clay (negative deltas — replace harsh rose)
| Token | Hex | Usage |
|---|---|---|
| `clay-100` | `#FEE2E2` | Background of "- YoY" badge |
| `clay-500` | `#DC2626` | Mid clay |
| `clay-700` | `#991B1B` | Text for negative YoY (replaces rose-700) |

#### Chocolate (deep text / borders — alternative to pure graphite)
| Token | Hex | Usage |
|---|---|---|
| `cocoa-700` | `#78350F` | Section dividers, deep card borders |
| `cocoa-900` | `#451A03` | Footer text, attribution lines |

#### Slate (cooler grey — for tooltip surfaces only)
| Token | Hex | Usage |
|---|---|---|
| `slate-200` | `#E2E8F0` | Tooltip background (kept Tailwind default) |
| `slate-700` | `#334155` | Tooltip text |

#### Sparse deep teal (data signature accent — UNCHANGED)
| Token | Hex | Usage |
|---|---|---|
| `teal-700` | `#0F766E` | One single role: the "data signature" microaccent that appears on AtlasScore tier chips when score >= 70, the time-series chart tick numbers, and the quality-rating star outline. Used <5% of the surface. |

### 10.3 — Where to apply the expansion (visible places)

| Surface | Current | After |
|---|---|---|
| Page background | `#FAFAF7` flat | `cream-50` (#FEFBF6) with a 600px-tall `cream-100` gradient under the hero |
| Card background | white | `cream-100` for primary cards, white for nested cards |
| Card border | `ink-200` | `parchment` (#E8DDC7) |
| YoY positive | emerald-700 text | `moss-700` text + `moss-100` background chip |
| YoY negative | rose-700 text | `clay-700` text + `clay-100` background chip |
| Stat number on Stat card | ink-900 | unchanged |
| Stat label | ink-700/60 | `cocoa-700` at 70% opacity |
| Section header underline | atlas-500 | gradient: `atlas-500 → atlas-700` |
| Histogram bars | amber gradient | `atlas-300 → atlas-600` gradient (richer) |
| Time-series area fill | atlas amber at 18% | `atlas-300 → cream-200` vertical gradient at 60% / 8% |
| Atlas Score chip — Strong tier | emerald | `moss-100` background, `moss-700` text |
| Atlas Score chip — Solid tier | atlas-100 / atlas-800 | `atlas-100` bg, `atlas-700` text |
| Atlas Score chip — Mixed tier | amber-100 / amber-800 | `parchment` bg, `cocoa-700` text |
| Atlas Score chip — Tough tier | rose | `clay-100` bg, `clay-700` text |
| Sticky page nav active section | atlas-500 left border | `atlas-500 → atlas-700` gradient left border |
| Featured tile hover border | atlas-500 | `atlas-600` |
| Coverage tier badge | (none) | `parchment` bg, `cocoa-900` text, on country pages |
| Dimension switcher dropdown chevron | grey | `atlas-700` |

### 10.4 — Tailwind config update

`tailwind.config.ts` — extend `colors` block with the new keys. Net delta: ~30 lines.

### 10.5 — Files affected (Phase 10)

- `tailwind.config.ts`
- `src/app/globals.css` — page background, gradient under hero
- `src/components/QualityBadge.tsx` — tier colors
- `src/components/AtlasScore.tsx` — tier chips, gradient bar
- `src/components/DistributionHistogram.tsx` — bar gradient
- `src/components/TimeSeriesChart.tsx` — area gradient
- `src/components/DistributionBars.tsx` — bar tones already use atlas-N; switch to the expanded set
- `src/app/[country]/[geo]/[industry]/page.tsx` — Stat label color
- `src/components/CellPageNav.tsx` — active border gradient

**Estimated effort:** 0.5 day.

---

## 11 · Image placeholder catalog

The site reads like a B2B spreadsheet because there are zero photographs or illustrations anywhere. This section identifies every place where an image would lift the page from "data tool" to "premium product."

> **Founder owns image selection.** This catalog identifies surfaces and proposed image briefs. Each entry has:
> - Where (file path + section)
> - What image (brief)
> - Recommended dimensions
> - Treatment notes (frameless per CLAUDE.md, no card wrappers, no fake stages)

### 11.1 — Home page (`/`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| HOME-1 | Hero, right side | Stylized world map illustration with subtle data dots in amber over warm graphite landmasses. Not a photo. Conveys "global benchmarking atlas." | 720×480 | Frameless, transparent background, blends into `cream-50` page bg |
| HOME-2 | Each featured cell tile (12 total — see Phase N) | A small, square, evocative photograph of that industry's archetype: e.g. a boutique mannequin for clothing-Italy, a coffee shop interior for cafés-Australia, an industrial robot arm for machinery-Germany, a salon chair for cosmetics-France, a Toronto residential block for construction-Canada, a Bangalore office for software-India, a Spanish hotel courtyard for hotels-Spain, a NYC brownstone for real-estate-New York, a Washington consulting tower for consulting-DC, a Brazilian craft brewery for beer-Brazil, a California beach restaurant for restaurants-California, a Silicon Valley office for software-California. Warm tones. Documentary feel — no stock-photo cliché. | 320×200 each | Frameless, rounded-xl, sits at top of tile, content below |
| HOME-3 | Footer of "What you'll see" section | Optional: a subtle texture/illustration. Could skip. | 1200×80 | If used: very low contrast, decorative |

### 11.2 — Cell pages (`/[country]/[geo]/[industry]/page.tsx`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| CELL-1 | Hero right side (desktop only, lg breakpoint+) | Industry-themed photograph specific to the cell. Falls back to a sector-level image when no cell-specific image exists. | 480×320 | Frameless, rounded-xl, sits to the right of the hero text |
| CELL-2 | Background of the AtlasScore card | Very subtle (5-8% opacity) industry-themed texture or pattern | 400×200 | Behind the score number, doesn't compete |

### 11.3 — Sector landing pages (`/sectors/[id]`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| SEC-1 | Hero, right side | A wide, atmospheric photo representing the sector. E.g. "Hotels, restaurants & food" → a softly-lit restaurant counter at golden hour. "Construction" → a clean, daytime residential framing scene. "Information & communications" → a small studio with terminals visible. | 720×400 | Frameless |

### 11.4 — Country landing pages (`/[country]`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| CTRY-1 | Hero, right side | A recognizable urban or landscape photo of that country. NOT a tourist-cliché — a working-environment shot. France → a market stall in a regional town, not the Eiffel Tower. Germany → a small-town main street with shops. India → a workshop with skilled workers, not Taj Mahal. | 720×400 | Frameless |

### 11.5 — About-data (`/about-data`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| ABOUT-1 | Right of "What you'll find" | A clean infographic-style illustration showing percentile bars / distribution shapes; same visual language as the histogram on cell pages. | 480×320 | Frameless |
| ABOUT-2 | Right of "Quality ratings" | Five amber stars with subtle gold gradient, or a more designed star-rating illustration | 320×80 | Inline |

### 11.6 — Pricing (`/pricing`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| PRICE-1 | Top of page, full-width subtle band | A horizontal banner image suggesting "atlas across borders" — could be reused from HOME-1 in a wide crop | 1200×240 | Low-saturation, doesn't compete with the tier cards |

### 11.7 — /you (`/you`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| YOU-1 | Right side of input panel | A friendly illustration showing "you (small marker) vs the typical firm (range)". Same visual logic as the percentile bar but as a static illustration. | 480×320 | Frameless |

### 11.8 — Compare (`/compare`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| COMP-1 | Header, right of title | A small illustration showing four columns aligned (matches the slot grid). | 320×200 | Frameless |

### 11.9 — 404 (`/not-found`)

| ID | Location | Brief | Size | Treatment |
|---|---|---|---|---|
| 404-1 | Top of page | A thematic "lost on the map" illustration in warm tones | 480×320 | Frameless |

### 11.10 — Storage strategy

- Images live in `public/images/` (Vercel-hosted; CDN-free, free) OR Cloudflare R2 (which is already set up at `pub-d3565e2ee0a14f2594e742a9e9c9c530.r2.dev`)
- Naming convention: `industry/[industry-id].webp`, `sector/[sector-id].webp`, `country/[iso2].webp`, `home/hero.webp`
- All `.webp` for size; `next/image` for lazy loading
- Each image ≤ 200 KB compressed

### 11.11 — In code (placeholder approach until real images arrive)

In the meantime, every `<Image>` slot renders a CSS-only placeholder: a `cream-100 → cream-200` gradient with a subtle centered glyph (the same emoji used for the sector icon in section 4.2). The component is wired so swapping the placeholder for the real image later is a one-line change per slot.

**Files affected (placeholder framework):**
- New: `src/components/SmartImage.tsx` — wraps `next/image`; falls back to gradient placeholder when `src` is null
- Mount points in all pages above

**Estimated effort (placeholder framework):** 0.5 day. **Real image production: founder-driven, not on engineering timeline.**

---

## 12 · Execution order + estimates

Recommended order (each phase ships on its own and is reverse-proxy safe):

| Order | Phase | Effort | Visibility | Risk |
|---|---|---|---|---|
| 1 | DNS fix (user task) | 5 min | site lives | none |
| 2 | Phase L · Taxonomy correction | 1.5–2 days | very high | low — backward compatible via parent-fallback |
| 3 | Phase M.4 / 10 · Color palette expansion | 0.5 day | high | low — pure CSS |
| 4 | Phase M.1–3 · Flags + sector icons + alpha order | 0.5–1 day | high | none |
| 5 | Phase N · Featured anchors | 0.5 day | high | none |
| 6 | Phase 11 · Image placeholder framework (sans real images) | 0.5 day | medium | none |
| 7 | Phase O · Empty-state + country pages | 1 day | medium | low |
| 8 | Phase P · Premium gating | 0.5 day | medium | low |
| (later) | Phase Q · Sub-national ingest | weeks | very high | medium — per-country pipelines |
| (later) | Phase R · Auth + tiers | days | high | medium |
| (deferred) | Editorial (B.5 / G / H) | — | — | tone undecided |

**Total for this round (phases 2-8):** ~5 working days of engineering + image-asset production on the founder's timeline.

---

## 13 · Risks, open questions, watch-fors

### 13.1 — Risks

- **Taxonomy split + URL stability**: when "specialty retail" splits into 12 sub-niches, the existing URL `/us/california/specialty-retail` must still resolve. Solution: parent-industry fallback in `slugToIndustry`. Verify in tests before deploy.
- **Sub-niche cells with no data**: 80+ new industries will mostly render the parent industry's numbers for the first few months. The "Best available — granular data coming" chip must be unambiguous so users don't think the numbers are specific.
- **Corp-only filter regression**: a power user might search "banking" and not find it. Solution: search results show a one-line "Banking is hidden by default — open with Pro" hit, not a silent omission.
- **Flag emoji rendering on Windows**: Windows Chrome renders flags as `DE` text by default. Solution: use Twemoji font fallback for those characters in `globals.css`. Two-line fix.

### 13.2 — Open questions for the founder

1. **Editorial tone**: still undecided. Locks Phases B.5, G, H. Plan v3.0 does not depend on this, but per-cell narrative copy ("Restaurants in California typically employ X people…") cannot be written without it.
2. **Pro tier coverage scope**: do we expose corp_only industries to Pro at all, or do we keep Atlas strictly SMB and tell Pro users to use Bloomberg? Recommendation: expose corp_only but with strong segmentation caveats and possibly only when firm-size band is selected.
3. **Sub-national priority order**: which country gets ingested first after this round? Recommendation: US counties (cheapest, most search volume), then UK (high search), then DE (high search, founder mentioned Baden-Württemberg).
4. **Image production**: founder-side or commission a designer? Stock photos look like stock photos. Recommendation: brief a single illustrator for the 18 canonical surfaces in section 11; total cost ~$3-5k for high-quality consistent work.

### 13.3 — Watch-fors during execution

- After Phase L deploys, monitor Vercel Analytics for any 404 spike. The parent-fallback should prevent it, but watch.
- After Phase M color update, take screenshots of every page on day 0 and day 1 to confirm no regression in contrast (the WCAG AA check against `cream-50` background should pass; verify on the `moss-700` and `clay-700` text against `moss-100` / `clay-100` backgrounds).
- After Phase N, check that all 12 featured cells return data; for ones that don't, mark them with a "coming soon" chip rather than letting a broken tile ship.

---

## Appendix A — Files touched (consolidated)

Across all phases in this round:

```
src/lib/taxonomy/industries.json      — L (massive rewrite + ~80 new entries)
src/lib/taxonomy/sectors.json         — L, M (audience tags, icons)
src/lib/taxonomy.ts                   — L, M (search filters, alpha sort, parent lookup)
src/lib/countries.ts                  — M (flag helper)
src/lib/cells.ts                      — L (parent fallback), O (top-industries helper)
src/lib/audience.ts                   — P (new — Pro UI gate)
src/components/NavigatorForm.tsx      — L, M, P
src/components/ComboField.tsx         — M
src/components/GlobalSearch.tsx       — M, P
src/components/AcrossStatesStrip.tsx  — M
src/components/AcrossCountriesStrip.tsx — M (new)
src/components/QualityBadge.tsx       — 10
src/components/AtlasScore.tsx         — 10
src/components/DistributionHistogram.tsx — 10
src/components/TimeSeriesChart.tsx    — 10
src/components/DistributionBars.tsx   — 10
src/components/CellPageNav.tsx        — 10
src/components/FeaturedCellTile.tsx   — N (new)
src/components/SmartImage.tsx         — 11 (new)
src/components/AudienceCaveat.tsx     — L (new)
src/app/page.tsx                      — N (featured grid)
src/app/[country]/page.tsx            — O (new — country landing)
src/app/[country]/[geo]/[industry]/page.tsx — L, M, O, P, 11
src/app/sectors/[sector]/page.tsx     — M, 11
src/app/pricing/page.tsx              — P, 11
src/app/about-data/page.tsx           — 11
src/app/you/page.tsx                  — 11
src/app/compare/page.tsx              — 11
src/app/not-found.tsx                 — 11
src/app/api/cell-snapshot/route.ts    — N (new)
src/app/globals.css                   — 10
tailwind.config.ts                    — 10
```

---

## Appendix B — Diff summary

Net code delta after this round:
- ~3,500 lines added
- ~400 lines modified
- 0 lines deleted (backward compatible)
- ~12 new files
- 0 breaking URL changes (parent-industry fallback guarantees old URLs keep working)

---

*End of plan. Next: execute starting with Phase L while founder handles DNS and considers image briefs.*
