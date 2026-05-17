# 11 · Next Steps

> Prioritised roadmap. Stable IDs (`S-NN`) so other files can reference.

---

## 1 · Tier 1 · Founder-actionable quick wins

These don't need engineering. Each unblocks downstream work.

### S-01 · Fix Cloudflare DNS for marginatlas.com
- **Owner:** Founder
- **Effort:** 5 minutes
- **Unlocks:** Production URL live
- **How:** See B-001 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** HIGH — production not reachable until done

### S-02 · Decide editorial tone
- **Owner:** Founder
- **Effort:** 30 minutes of thinking
- **Unlocks:** Plan v3 Phases B.5, G, H + /ask live mode
- **How:** See B-002 in `09_BLOCKERS_AND_RESOLUTIONS.md`. Five decisions: per-cell narrative voice, country page voice, sector page voice, blog voice, /ask voice.
- **Priority:** MEDIUM — blocks several features

### S-03 · Paste ANTHROPIC_API_KEY into Vercel env vars
- **Owner:** Founder (after S-02 done)
- **Effort:** 2 minutes
- **Unlocks:** /ask AI route live mode
- **How:** See B-002b in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** LOW — depends on S-02 first

### S-04 · Download France Sirene CSV
- **Owner:** Founder
- **Effort:** 30 minutes (download 600 MB + unzip 6 GB)
- **Unlocks:** Phase 4 France communes ingest (~60,000 cells)
- **How:** See B-003 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** LOW — France already partially covered via Phase 1 Eurostat at NUTS-2/3

### S-05 · Commission real images for 18 surfaces (or accept placeholders)
- **Owner:** Founder
- **Effort:** TBD (decide + brief + wait + integrate)
- **Estimated cost:** $3-5k for high-quality consistent illustration
- **Unlocks:** Premium visual feel
- **Priority:** LOW — current SmartImage placeholders are tasteful

---

## 2 · Tier 2 · High-value engineering, under 1 day each

### S-10 · Expand NAICS-3 coverage in industries.json
- **Owner:** Engineering
- **Effort:** 1-2 hours
- **Estimated impact:** 2-3× yield on US (+50k rows), CA (+12k), MX (+25k when landed)
- **How:** See B-004 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** **HIGHEST among engineering items** — unblocks several downstream ingests

**Concrete steps:**
1. Pull full NAICS-3 list from Census (`https://www.census.gov/naics/`)
2. Compare to existing 73 codes in `industries.json` `naics_3` arrays
3. For each missing NAICS-3 code, decide which industry_id it belongs to OR create a new sub-niche
4. Edit `src/lib/taxonomy/industries.json`
5. Run `npx tsx scripts/verify_taxonomy.ts`
6. Re-run Phase 10 US Census: `rm delivery/regional/us_census/progress.json && python scripts/ingest/us_census/fetch_cbp.py`
7. Re-run Phase 11 Canada (after S-11)
8. Update scoreboard

### S-11 · Re-execute Canada with correct StatCan table
- **Owner:** Engineering
- **Effort:** 1 hour
- **Estimated impact:** +12,000 cells (replaces current 65 partial)
- **How:** Change `table = "33100307"` to `table = "33100418"` in `scripts/ingest/ca_statcan/fetch.py`; clear cache; re-run
- **Priority:** Easy win after S-10

### S-12 · Fix OECD SDMX endpoint
- **Owner:** Engineering
- **Effort:** 2 hours
- **Estimated impact:** +8,000 cells (regional cross-validation + non-EU OECD fills)
- **How:** See B-006 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** Useful for cross-validation

### S-13 · UK NOMIS numeric ID discovery + execute
- **Owner:** Engineering
- **Effort:** 3-4 hours
- **Estimated impact:** +30,000 cells (374 LAD + 500 MSOA)
- **How:** See B-007 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** UK is high-traffic for SEO

### S-14 · Netherlands LAU (CBS Statline)
- **Owner:** Engineering
- **Effort:** 2 hours
- **Estimated impact:** ~10,200 cells (340 gemeenten × 30 industries)
- **How:** CBS table 81588NED works without key; per-gemeente probe needed for the right gemeente-level table
- **Priority:** Easiest EU LAU to pilot

### S-15 · Spain LAU (INE DIRCE municipios)
- **Owner:** Engineering
- **Effort:** 3 hours
- **Estimated impact:** ~30,000 cells (top 1,000 of 8,131 municipios)
- **How:** INE DIRCE table API; per-table probe needed
- **Priority:** Spain is high-search-volume for SMB queries

### S-16 · Italy LAU (ISTAT comuni)
- **Owner:** Engineering
- **Effort:** 4 hours
- **Estimated impact:** ~30,000 cells (top 1,000 of 7,904 comuni)
- **How:** ISTAT SDMX; per-dataflow probe needed
- **Priority:** Italy has high SEO leverage (Milan boutiques etc.)

### S-17 · Brazil cities (more cities, more variables)
- **Owner:** Engineering
- **Effort:** 2 hours
- **Estimated impact:** +500 cells (add 5-10 more BR cities + variable for employees)
- **How:** Extend `latam_cluster/br_ibge.py` to pull variable 707 (employees) in addition to 2585 (companies)
- **Priority:** Quick win; richer BR data

### S-18 · Mexico INEGI DENUE
- **Owner:** Engineering
- **Effort:** 3-4 hours
- **Estimated impact:** ~10,000 cells (32 states + top 300 municipios)
- **How:** INEGI BIE API requires registration (token-based); SCIAN classification (= NAICS)
- **Priority:** Mexico is the next-largest LATAM economy after Brazil

### S-19 · Australia ABS + New Zealand Stats NZ
- **Owner:** Engineering
- **Effort:** 3-4 hours
- **Estimated impact:** ~22,500 cells (AU SA4/SA3/SA2 + NZ TLA)
- **How:** Both have SDMX APIs; per-dataset key syntax needed
- **Priority:** Anglo bloc; clean APIs

### S-20 · Cell page improvements — coverage badge + last-updated
- **Owner:** Engineering
- **Effort:** 2 hours
- **Impact:** UX polish
- **How:** Add a "Last updated" line to QualityBadge component, pull from cell `year` field. Add coverage tier explanation tooltip.
- **Priority:** Polish

### S-21 · Sitemap regeneration with regional cells
- **Owner:** Engineering
- **Effort:** 1 hour
- **Impact:** SEO discoverability for 179,409 new cells
- **How:** Update `src/app/sitemap.ts` to pull top-5000 cells across regional_cells (not just cells_master). Currently only US states are in the sitemap.
- **Priority:** SEO — unlocks indexing of new cells

### S-22 · TypeScript strict mode tightening
- **Owner:** Engineering
- **Effort:** 1 hour
- **Impact:** Code quality
- **How:** Audit `noUncheckedIndexedAccess`, `noImplicitAny`, etc. in tsconfig.json. Fix the few remaining `any` types.
- **Priority:** Polish

---

## 3 · Tier 3 · Multi-day projects

### S-30 · Supabase Auth (email magic link + Google OAuth)
- **Owner:** Engineering
- **Effort:** 1.5 days
- **Unlocks:** Real user accounts; gates real paid tiers
- **How:** See B-011 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** When founder asks for paid-tier launch

### S-31 · Stripe checkout + webhook
- **Owner:** Engineering
- **Effort:** 1.5 days
- **Unlocks:** Real payments
- **How:** See B-011 in `09_BLOCKERS_AND_RESOLUTIONS.md`
- **Priority:** When founder asks (typically after S-30)

### S-32 · Remaining LATAM ingest (Mexico INEGI + Argentina + Chile + Colombia + Peru)
- **Owner:** Engineering
- **Effort:** 3-5 days (per-country APIs vary)
- **Estimated impact:** +25,000 cells
- **Priority:** When EU LAU is done and footprint expansion is the focus

### S-33 · MENA + Africa ingest cluster
- **Owner:** Engineering
- **Effort:** 5-7 days (9 countries: UAE, SA, IL, TR, EG, ZA, NG, KE, MA)
- **Estimated impact:** ~22,000 cells
- **Priority:** Lower than LATAM; some sources are PDF-only

### S-34 · India MCA + China NBS ingest
- **Owner:** Engineering
- **Effort:** 4-6 days
- **Estimated impact:** ~20,000 cells combined
- **Priority:** China requires PDF parsing; India requires manual download

### S-35 · SEA cluster (SG, MY, ID, TH, VN, PH)
- **Owner:** Engineering
- **Effort:** 4-5 days
- **Estimated impact:** ~15,000 cells
- **Priority:** When India is done

---

## 4 · Tier 4 · Polish and growth

### S-40 · Editorial content production
- **Owner:** Founder + content writer
- **Effort:** Continuous (per-cell narratives × thousands of cells)
- **Unlocks:** Plan v3 §B.5 / G / H
- **Blocked on:** S-02 (tone decision)
- **Priority:** Post-launch

### S-41 · OG image generation per cell
- **Owner:** Engineering
- **Effort:** 1 day
- **Unlocks:** Social-share-friendly cells
- **How:** Vercel OG image generation API; render cell headline + numbers
- **Priority:** Post-launch

### S-42 · "Atlas Score" badge embed generator
- **Owner:** Engineering
- **Effort:** 1 day
- **Unlocks:** SEO backlinks
- **How:** Generate static badges for cells; embed code with link back
- **Priority:** Post-launch

### S-43 · Print stylesheet
- **Owner:** Engineering
- **Effort:** 4 hours
- **Unlocks:** Reports
- **Priority:** Post-launch

### S-44 · Status page (`/status` or status.marginatlas.com)
- **Owner:** Engineering
- **Effort:** 1 day
- **Unlocks:** Operational trust
- **Priority:** Post-launch

### S-45 · Press kit + media page
- **Owner:** Founder + Engineering
- **Effort:** 1-2 days
- **Unlocks:** PR
- **Priority:** Post-launch

### S-46 · Blog content cadence
- **Owner:** Founder + content writer
- **Effort:** Weekly cadence
- **Blocked on:** S-02 (tone decision)
- **Priority:** Post-launch growth driver

### S-47 · Reddit / HN soft launch
- **Owner:** Founder
- **Effort:** 1 day prep + day-of
- **Blocked on:** S-01 (production URL working), S-02 (tone decision)
- **Priority:** When the product feels ready to show

---

## 5 · Recommended execution sequence

If founder says "what's next" without specifics, this is the order:

1. **S-01** (DNS fix) — founder, 5 min
2. **S-10** (NAICS-3 expansion) — engineering, 1-2 hours, unlocks S-11 / S-18
3. **S-11** (Canada retry) — engineering, 1 hour, +12k cells
4. **S-14** (Netherlands LAU) — engineering, 2 hours, +10k cells, pilots EU LAU pattern
5. **S-15** (Spain LAU) — engineering, 3 hours, +30k cells
6. **S-16** (Italy LAU) — engineering, 4 hours, +30k cells
7. **S-19** (AU + NZ) — engineering, 3-4 hours, +22k cells
8. **S-13** (UK NOMIS) — engineering, 3-4 hours, +30k cells
9. **S-12** (OECD overlay) — engineering, 2 hours, +8k cells + cross-validation
10. **S-04** (Founder downloads Sirene) → **France execute** — 2 hours pipeline, +60k cells
11. **S-21** (Sitemap regenerate) — 1 hour, SEO win
12. **S-02 + S-03** (tone decision + ANTHROPIC key) — founder, 30 min, unlocks /ask
13. **S-32** (LATAM remaining) — 3-5 days
14. **S-30 + S-31** (Auth + Stripe) — 3 days, when paid-tier launch is the next goal

Total of items 1-11: ~25 hours of engineering work + founder actions, would add ~200,000 cells to regional_cells (from 179k → ~380k) and unlock production URL.

---

## 6 · How to keep this file current

After every meaningful work session:

1. Mark completed items as DONE with a strikethrough or note
2. Reorder priorities if circumstances changed
3. Add new S-NN entries for new ideas
4. Update effort estimates if you learned something
5. Cross-reference back to blockers (B-NNN) and decisions (D-NNN)
6. Commit + push

The file is most valuable when it reflects today's situation, not
last week's.
