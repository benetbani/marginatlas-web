# Plan v14 — Forward Roadmap

**Date**: 2026-05-19
**Context**: Plan v13 (credibility fix) wrapped — site no longer broadcasts brokenness, margins are floored at SMB-realistic ratios, taxonomy is split, hero is alive, 49K extrapolations filled global gaps. This plan covers everything from "stop being embarrassing" → "actively be the best small-business benchmark site on the internet" → "launch + monetize."

## Current State (what's actually shipped)

| Layer | Status | Notes |
|---|---|---|
| Data quality | Mostly clean | Wave 5 normalized 180 outliers + inserted 49K extrapolations. Monaco/Liechtenstein/Burundi edge cases flagged for manual review. `cells_master` (722K US rows) skipped — needs a second pass. |
| Profit waterfall | Defensible | 3%/5%/15% floor + canonical 191-industry table with explicit `net_margin`. Hands-on per-industry web-verification still TODO (Damodaran audit was 8/180 — could go deeper). |
| Industry taxonomy | Mostly clean | 10 mis-bundles split (auto_dealers_gas, broadcasting_telecom, etc.) + URL redirects. 7 more flagged but un-split (textile_apparel_mfg, media_publishing, wood_paper_mfg, furniture_other_mfg, metal_products_mfg, software_development, crop_farming) — need hand-tuned split names. |
| Public hygiene | Clean | No years, no # firms, no avg-staff, no "coverage TBC", no DATA QUALITY 10/10, no warning banners. Silent omission everywhere. |
| Flags | Clean | Flat SVG `<CountryFlag>` across 11 components + header + hero + breadcrumbs. |
| Images | ~5% rebuilt | Wave 4c cities at 30/207 (50 req/hr Unsplash demo throttle). Countries + industries not started. Real hero video file missing. Upload-to-production tier required for >50/hr. |
| Hero | Live but rough | Rotating headline working. Glass card. **Duplicate `GlobalSearch`** (header + hero card). Hero tone `ink-dark` not applied because would make text invisible — needs refactor. Real video file required. |
| Sub-regional discovery | Live | 194/195 countries show admin1 region lists (DE 16, AL 12, FR 13, US 51, SG silent). |
| Cell page sections | Live but legacy IDs | Section tone alternation works. IDs `stats`/`typical-firm`/`distribution`/`comparable` need renaming to canonical `revenue-tiles`/`tax-and-cost-panel`/`revenue-distribution`/`related-cells`. |
| Mobile | Untested | No mobile audit run. Tailwind defaults assumed sufficient. |
| Accessibility | Unknown | No WCAG pass. |
| SEO | Basic | Sitemap with 15K URLs (Plan v11). JSON-LD per cell. Meta descriptions per page. No hreflang. No FAQPage schema. |
| Performance | Unknown | No Lighthouse audit. No bundle analysis. |
| Production | Not deployed | Everything in dev. The bought domain still serves the old site. |
| Monetization | Stub | Pricing page exists. No Stripe. No Pro gating. |
| Analytics | None | No PostHog, Plausible, GA. |

---

## Plan v14 — Six Phases

### Phase A — Polish & Completion (≈3-5 days)

Close out everything Plan v13 left half-done.

**Wave 6a — Image system completion (~2 days)**
- Apply for Unsplash production tier (5000 req/hr unlocks the full rebuild in 30 minutes instead of 12 hours) — requires submitting hotlink-photos/trigger-downloads/attribution screenshots per the dashboard checklist
- Once production tier granted: rerun Wave 4c on countries + industries (~3 hours total wall clock)
- Hand-pick top 30 highest-traffic page hero images via Unsplash+ subscription ($12/mo, 30 premium downloads), drop into `data/images/manual_overrides_v1.json`
- Download a 60-90s Pexels Video loop (NYC + London + Tokyo + Istanbul + Mumbai promenades), host at `public/videos/hero-cities-loop.mp4`
- Self-host all images: download Unsplash CDN URLs → `public/images/{cities,countries,industries}/`, swap manifest URLs to local paths, generate 3 size variants (full 1600w, card 800w, thumb 400w) for performance

**Wave 6b — Hero refinement (~0.5 day)**
- Resolve duplicate `GlobalSearch`: either hide the header search on `/` only OR replace the hero card search with a simpler hero-styled input that submits to the same route
- Fix the potential `w-screen` horizontal scrollbar issue (add `overflow-x: hidden` to `<body>` or scope the hero's full-bleed differently)
- Hero text-on-dark color refactor so the canonical `ink-dark` hero tone can apply across cell/country/industry hero blocks

**Wave 6c — Wave 5 follow-up (~1 day)**
- Manual review of the 7 Monaco/Liechtenstein extreme outliers still above 5× peer cap (legit tax-shelter economics may need different treatment)
- Verify the 0.2× peer floor actually applied to Burundi under-normalized cells; rerun if not
- `WAVE5_INCLUDE_CELLS_MASTER=1` rerun for the 722K US cells skipped due to pagination limits — may require switching to keyset pagination
- Surface remaining 4,330 numeric-bounds flags + 160 distribution-shape flags in /admin/review with one-click "normalize" or "leave alone" actions

**Wave 6d — Taxonomy completion (~0.5 day)**
- Hand-curate split definitions for the 7 remaining flagged bundles (textile_apparel_mfg → textiles + apparel; media_publishing → newspapers/magazines + books; wood_paper_mfg → sawmills + paper; furniture_other_mfg → furniture + other; metal_products_mfg → fabricated metal + machinery; software_development → custom dev + packaged software; crop_farming → grains + vegetables + fruits)
- Execute splits, write redirects

**Wave 6e — Cell-page section ID rename (~0.5 day)**
- Rename legacy IDs to canonical: `stats` → `revenue-tiles`, `typical-firm` → `tax-and-cost-panel`, `distribution` → `revenue-distribution`, `comparable` → `related-cells`
- Remove the comment-based mapping in `SECTION_TONES`
- Verify no broken hash-link navigation

---

### Phase B — Content & Editorial (≈5-7 days)

The site has structure. It needs voice.

**Wave 7a — Per-cell narrative copy (~3 days)**
- For each cell, generate a 1-2 paragraph human-readable analysis: "What does this number mean? How does this geo's restaurant industry compare to peers? What's the typical operator look like?"
- Approach: templated prompts to Claude API, batch-generated, cached as `cell_narratives_v1.json` keyed by `(country, geo_id, industry_id, size_band)`
- ~10K cells × $0.001/call ≈ $10
- Editorial pass on the top 200 most-visited cells

**Wave 7b — "How to read this page" explainer (~0.5 day)**
- Tiny tooltip or section that explains the percentile tiles (what does "bottom 20% earn" mean?) and the margin waterfall
- Visible by default for new visitors, dismissable

**Wave 7c — Methodology page (~1 day)**
- Public page at `/methodology` that explains where the data comes from, how we compute (without revealing source agencies per R-002), what the floor means, what extrapolation means
- Friendly, non-engineering tone

**Wave 7d — About page (~0.5 day)**
- Founder story, mission, target audience (small business owners, accountants, consultants, journalists)

**Wave 7e — Industry / sector pages content depth (~1 day)**
- Currently sparse. Add: industry overview (where the typical firm operates), capital intensity, regulatory landscape (no specific tax/legal advice — directional only)

---

### Phase C — SEO + Performance (≈3-5 days)

**Wave 8a — Schema.org enrichment (~1 day)**
- `Dataset` schema per cell (already partial via `StructuredData.tsx`) — extend with `temporalCoverage`, `spatialCoverage`, `variableMeasured`
- `FAQPage` schema with 5-10 common questions per cell ("What's the typical revenue for…?", "How do margins compare to…?")
- `BreadcrumbList` schema across all hierarchical pages
- `Organization` schema on the homepage with sameAs links

**Wave 8b — hreflang infrastructure (~0.5 day)**
- Even if we don't have i18n content yet, add `<link rel="alternate" hreflang="x-default">` and `hreflang="en"` correctly so search engines know our canonical version

**Wave 8c — Sitemap expansion (~0.5 day)**
- Currently 15K URLs. Add: all 194 country admin1 region pages, all industry split pages, all city pages
- Likely 50-80K URLs total
- Split into multiple sitemap files (Google limit 50K per file)

**Wave 8d — Lighthouse + Core Web Vitals audit (~1 day)**
- Run Lighthouse on top 10 page types
- Address LCP (likely image-heavy hero), CLS (font swaps, image dimensions), INP (the rotating headline must not block render)
- Likely fixes: preload hero image, explicit width/height on images, debounce search input

**Wave 8e — Bundle analysis (~0.5 day)**
- `npm run build` with `@next/bundle-analyzer`
- Remove unused dependencies
- Code-split heavy components (admin/review is heavy)

**Wave 8f — robots.txt + canonical audit (~0.5 day)**
- Block `/admin/*` from crawlers
- Verify every cell page has a canonical URL
- Confirm 308 redirects from Wave 4b splits propagate correctly

---

### Phase D — Mobile + Accessibility (≈3-5 days)

**Wave 9a — Mobile audit (~2 days)**
- Every page type at 375px, 414px, 768px
- Headline, tiles, distribution curve, regions grid, hero card — all need mobile verification
- Likely fixes: hero card padding on small screens, tiles stack vertically, regions grid 2-col on mobile
- Touch target sizes (44×44 minimum)

**Wave 9b — WCAG AA pass (~1.5 days)**
- Color contrast across all text/background combos (tone alternation needs verification, especially atlas-600 on cream-50/85)
- Form labels (search input, calculator inputs)
- Image alt text (currently auto-generated, may need review)
- Heading hierarchy (h1 → h2 → h3, no skips)

**Wave 9c — Keyboard nav + screen reader (~1 day)**
- Tab order through cell page
- Skip links
- ARIA labels on the rotating headline so it doesn't announce on every rotation
- VoiceOver / NVDA spot checks on top 5 page types

---

### Phase E — Data Completeness (≈5-10 days)

**Wave 10a — Sub-regional ingestion (~3-5 days)**
- 70 countries still have ZERO regional cells in DB (admin1 list is visible but clicks lead to extrapolated-only data)
- Priority: LATAM (AR, CL, CO, PE) via national statistics agencies; more European NUTS-2 / NUTS-3
- Each ingestion: ~1 day per country (find source, schema mapping, ingest, validate)

**Wave 10b — Q-scan completion (~2-3 days)**
- Plan v11 Q2 (top 50 plausibility flags via web verification)
- Plan v11 Q4 (sub-regional GDP sanity)
- Plan v11 Q6 (sub-regional tax cross-validation)
- Plan v11 Q8 (property tax cross-validation across 131 countries)
- Plan v11 Q10 (operating cost multiplier sanity)
- These were all explicitly batched for "future pushes" in Plan v11 — time to finish

**Wave 10c — Annual refresh routine (~1 day)**
- Cron job (Vercel cron or GitHub Action) that runs every January:
  - Pulls fresh FX rates from ECB/IMF
  - Pulls updated tax rates from PwC Worldwide Tax Summaries
  - Detects changes, queues founder review
- Russia 2025 → 25% reform is the first test — automated catch

---

### Phase F — Production Launch (≈2-3 days)

**Wave 11a — Vercel deploy (~0.5 day)**
- Connect repo to Vercel
- Set environment variables (Supabase keys, Unsplash key, etc.)
- Build pipeline checks: lint + typecheck + build
- Preview deployment for review

**Wave 11b — DNS cut (~0.5 day)**
- Point marginatlas.com (or the new domain) DNS to Vercel
- TLS cert (auto via Vercel)
- 301 redirects from any old www → apex (or vice versa)
- WWW vs apex decision

**Wave 11c — Analytics (~0.5 day)**
- Plausible.io (privacy-respecting, ~$9/mo for 10K pageviews) OR Vercel Analytics (free with Vercel Pro)
- Page view tracking
- Custom events: search submitted, cell viewed, region clicked, calculator used

**Wave 11d — Error monitoring (~0.5 day)**
- Sentry free tier (5K errors/mo)
- Hook into Next.js error boundaries
- Alert email on uncaught errors

**Wave 11e — Launch checklist (~1 day)**
- Final QA: 20 cell pages across continents, mobile + desktop
- Performance: Lighthouse ≥ 90 on core pages
- Accessibility: WCAG AA verified
- SEO: sitemap submitted to Google Search Console, robots.txt sane
- Smoke test: cell + country + industry + calculator + admin
- Backup of DB before launch

---

### Phase G — Monetization (≈5-10 days, optional)

**Wave 12a — Stripe integration (~2 days)**
- Stripe Checkout (hosted, simpler than Elements)
- Subscription tier (Pro $19/mo or $190/yr)
- Webhook handler for subscription events
- Customer Portal for cancellations

**Wave 12b — Pro vs Free feature gating (~1.5 days)**
- Free: all current functionality (cell pages, regions, basic calculator, comparisons)
- Pro: regional tax overlays (Plan v8 Track P.3 deferred), CSV export, calculator save/share, no rate limits on Ask
- Auth: Clerk or NextAuth + Supabase, free tier sufficient

**Wave 12c — Pricing page polish (~0.5 day)**
- Existing `/pricing` page revamped with the new tier definitions
- Comparison table (Free vs Pro features)
- Testimonials (need to collect post-launch)
- FAQ

**Wave 12d — Newsletter automation (~1 day)**
- `NewsletterSignup` component already exists. Wire to Mailchimp/ConvertKit/Resend
- Welcome sequence (3 emails: about the site, deep-dive on a methodology piece, Pro upsell)
- Weekly digest: "5 cells our users explored this week"

---

## Recommended Sequencing

Strict order (each phase blocks the next, mostly):

1. **Phase A — Polish & Completion** (this week)
2. **Phase D — Mobile + Accessibility** (parallel with A where possible) — mobile is consumer-facing and you can't launch broken on mobile
3. **Phase C — SEO + Performance** — preps the site for crawling and ranking once live
4. **Phase B — Content & Editorial** — adds depth, can run after A while crawling kicks in
5. **Phase F — Production Launch** — ship
6. **Phase E — Data Completeness** — runs continuously post-launch (you don't need 100% coverage to launch)
7. **Phase G — Monetization** — turn on payments after the site has some traffic and SEO traction (2-4 weeks post-launch)

Total time to production launch: **~3-4 weeks** of focused work (Phases A + D + C + F). Phase B content + Phase E data + Phase G monetization continue post-launch.

---

## Open Decision Points (for founder input before each phase)

| Phase | Decision needed |
|---|---|
| A | Apply for Unsplash production tier? (Free, but founder must fill out the dashboard form with attribution screenshots) |
| A | Subscribe to Unsplash+ for $12/mo for premium top-30 manual picks? |
| A | Buy/produce a 60-90s hero video, or commission via Pexels-style stock? |
| B | Per-cell narrative voice: editorial/data-journalism, or terse benchmarking? |
| B | Methodology page tone: "professional" or "approachable"? |
| C | Plausible.io ($9/mo) vs Vercel Analytics (free w/ Vercel Pro) for analytics |
| D | Mobile-first redesign, or keep current desktop-first with responsive tweaks? |
| E | Which countries to prioritize for sub-regional ingestion (LATAM? more EU? Asia?) |
| F | Domain: marginatlas.com or the new domain you bought? Which one is canonical? |
| F | WWW vs apex — preference? |
| G | Pricing: $19/mo or $29/mo? Annual discount? |
| G | Free vs Pro: keep most features free or aggressively gate? |

---

## Out of Scope (Plan v15+)

- Mobile app (iOS/Android)
- API access for third-party developers
- White-label / agency tier
- Industry-specific deep-dives (sector reports)
- Foreign language localization (Spanish for LATAM, Portuguese for BR, etc.)
- Interactive cohort analysis
- "Compare me to peers" social features
- AI assistant ("Ask me anything about my industry") beyond the current AskWidget
