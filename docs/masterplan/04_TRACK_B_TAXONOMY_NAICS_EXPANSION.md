# 04 · Track B — NAICS-3 Taxonomy Expansion

> Highest-yield engineering item in the sweep. Unlocks 2-3× the row
> count of every downstream US / Canada / Mexico ingest.

---

## 1 · Goal

Expand `src/lib/taxonomy/industries.json` `naics_3` arrays from the
current **73 codes** to approximately **250 codes** (the full NAICS-3
universe minus codes that are truly non-applicable to SMB
benchmarking).

### Why it matters

The US Census CBP, Canada StatCan, and Mexico INEGI publish business
counts at NAICS-3 (or NAICS-4, which rolls up). Our taxonomy currently
matches only 73 of those codes. When ingest scripts iterate NAICS-3
and check `naics_to_industry_id`, they get `None` for 70%+ of codes
and the data is silently dropped.

Expanding the taxonomy:

- US Phase 10 yield: 87,573 → ~140,000 rows (+52k)
- Canada Phase 11 (after Track C): ~12,000 rows
- Mexico INEGI (Track I.1): ~10,000 rows
- All downstream NAICS-based countries benefit

### Why not just dump all 250 codes blindly

The taxonomy is the heart of the product. Each industry has a
sector_id, audience tag, examples, keywords, and parent_id chain.
Adding a NAICS code to the wrong industry breaks user-facing search
and routing.

This track is methodical, not bulk.

---

## 2 · Targets

| Metric | Current | Target | Hard cap |
|---|---|---|---|
| `naics_3` codes mapped across all industries | 73 | **245-255** | 280 |
| New sub-niche industries added | 0 | **10-30** | 50 |
| `verify_taxonomy.ts` exit | 0 | **0** | 0 |
| `tsc --noEmit` exit | 0 | **0** | 0 |
| US Phase 10 row count on re-run | 87,573 | **140,000+** | — |

---

## 3 · Step-by-step

### T-B.1 · Pull the full NAICS-3 universe

Source: `https://www.census.gov/naics/?input=&year=2022`

Fetch via:

```python
import requests
r = requests.get(
    "https://www.census.gov/cgi-bin/sssd/naics/naicsrch?chart_code=22&search=2022%20NAICS%20Search",
    headers={"User-Agent": "atlas-ingest/1.0"},
)
# Or grab the CSV at:
# https://www.census.gov/naics/2022NAICS/2-6%20digit_2022_Codes.xlsx
```

Easier: download the official XLSX from census.gov:

- File: `2-6 digit_2022_Codes.xlsx`
- Filter to rows where the code is exactly 3 digits
- Yields ~99 NAICS-3 codes for 2022

Cache to `E:\atlas\delivery\taxonomy\naics_3_universe.json`.

### T-B.2 · Inventory existing coverage

Run a one-off audit:

```python
import json
from pathlib import Path

industries = json.loads(Path(r"E:\atlas\website\src\lib\taxonomy\industries.json").read_text(encoding="utf-8"))

covered_naics3 = set()
for ind in industries:
    for code in ind.get("naics_3", []):
        covered_naics3.add(code)

universe = json.loads(Path(r"E:\atlas\delivery\taxonomy\naics_3_universe.json").read_text(encoding="utf-8"))
universe_codes = {entry["code"]: entry["title"] for entry in universe}

uncovered = sorted(set(universe_codes) - covered_naics3)
print(f"Covered: {len(covered_naics3)}")
print(f"Universe: {len(universe_codes)}")
print(f"Uncovered: {len(uncovered)}")
for code in uncovered:
    print(f"  {code}: {universe_codes[code]}")
```

Expected output: ~26 uncovered NAICS-3 codes.

Wait — only 26? Let me recompute. The 99 NAICS-3 codes in the 2022
universe minus the 73 we've covered = 26. But the handoff says "73
covered, ~250 universe". The 250 number includes NAICS-4 codes
that some pipelines pull. So:

- NAICS-3 universe: ~99 codes
- NAICS-4 universe: ~311 codes (rolls up to NAICS-3)
- US Census CBP publishes at NAICS-3, NAICS-4, NAICS-5, NAICS-6 depending on geography

Decision: **expand to full NAICS-3 universe (99 codes) AND add NAICS-4
codes for the high-volume sub-niches.** Net: ~99 NAICS-3 + ~80
strategic NAICS-4 codes added to industries that already exist =
~180 total new codes in `naics_3` and a new `naics_4` array on
relevant industries.

Cache the analysis to `delivery/taxonomy/uncovered_codes.csv`.

### T-B.3 · Decide per-code mapping

For each of the ~26 uncovered NAICS-3 codes, decide:

| Decision | When | Action |
|---|---|---|
| Map to existing industry | Code is a sub-area of something we already have (e.g. NAICS 454 "Nonstore retailers" → existing `ecommerce_mail_order`) | Add the code to that industry's `naics_3` array |
| Create new sub-niche | Code represents a genuinely distinct SMB category we missed (e.g. NAICS 459 "Sporting Goods, Hobby, Musical Instrument, and Book Stores" sub-categories) | Create new entry in `industries.json` with parent_id pointing to closest sibling |
| Mark non-applicable | Code is corp-only or government (e.g. NAICS 521 "Monetary Authorities" — the Fed) | Skip; add to `delivery/taxonomy/non_applicable.json` |

#### Decision rubric

A NAICS-3 code is **SMB-applicable** if AND ONLY IF:

1. The typical firm has < 100 employees AND
2. The activity can plausibly be run by a single owner or small team AND
3. It's not a regulated monopoly (utilities, broadcasting, etc.) AND
4. It's not government / nonprofit / religious

If all four are yes: visible. If three are yes and one is iffy
(bimodal): `audience: "mixed_caution"`. If two or fewer: `corp_only`.

#### Suggested mapping for the ~26 uncovered codes

Generated from the 2022 NAICS universe minus our current 73 covered.
The list below is a starting decision; the session refines per code.

| NAICS-3 | Title | Decision | Industry / Sector |
|---|---|---|---|
| 211 | Oil & Gas Extraction | corp_only | mining_energy (Pro) |
| 212 | Mining (except O&G) | corp_only | mining_energy (Pro) |
| 213 | Support for Mining | corp_only | mining_energy (Pro) |
| 221 | Utilities | corp_only | telecom_broadcasting or new `utilities` (Pro) |
| 311 | Food Manufacturing | KEEP (already 311 in food_beverage_mfg) | verify |
| 313 | Textile Mills | smb_friendly | textile_apparel_mfg |
| 314 | Textile Product Mills | smb_friendly | textile_apparel_mfg |
| 315 | Apparel Manufacturing | smb_friendly | textile_apparel_mfg |
| 316 | Leather & Allied Products | smb_friendly | textile_apparel_mfg |
| 322 | Paper Manufacturing | mixed_caution | heavy_industry (Pro) |
| 323 | Printing | smb_core | new `printing_services` |
| 324 | Petroleum & Coal | corp_only | heavy_industry (Pro) |
| 325 | Chemical Manufacturing | corp_only | heavy_industry (Pro) |
| 326 | Plastics & Rubber | mixed_caution | heavy_industry (Pro) |
| 327 | Nonmetallic Mineral | smb_friendly | construction or new `building_materials_mfg` |
| 331 | Primary Metal | corp_only | heavy_industry (Pro) |
| 333 | Machinery Manufacturing | mixed_caution | industrial_machinery_mfg |
| 334 | Computer & Electronic | corp_only | heavy_industry (Pro) |
| 335 | Electrical Equipment | mixed_caution | heavy_industry (Pro) |
| 336 | Transportation Equipment | corp_only | heavy_industry (Pro) |
| 423 | Merchant Wholesale (durable) | mixed_caution | new `wholesale_durable` |
| 424 | Merchant Wholesale (nondurable) | mixed_caution | new `wholesale_nondurable` |
| 425 | Wholesale Electronic Markets | smb_friendly | ecommerce_mail_order |
| 459 | Sporting/Hobby/Books | smb_core | new `sporting_hobby_books` |
| 481 | Air Transportation | corp_only | transport_corp (Pro, new) |
| 482 | Rail Transportation | corp_only | transport_corp (Pro) |
| 483 | Water Transportation | mixed_caution | transport_corp (Pro) |
| 486 | Pipeline Transportation | corp_only | transport_corp (Pro) |
| 487 | Scenic Transportation | smb_friendly | events_entertainment |
| 488 | Support for Transportation | smb_friendly | transport_small |
| 491 | Postal Service | corp_only | (USPS only — non-applicable) |
| 492 | Couriers & Messengers | smb_core | transport_small |
| 493 | Warehousing & Storage | smb_friendly | new `warehousing_storage` |
| 511 | Publishing (except Internet) | smb_friendly | creative_media |
| 512 | Motion Picture & Sound | smb_friendly | creative_media |
| 515 | Broadcasting | corp_only | telecom_broadcasting (Pro) |
| 516 | (Internet Publishing — folded into 519) | n/a | — |
| 517 | Telecommunications | corp_only | telecom_broadcasting (Pro) |
| 518 | Data Processing & Hosting | mixed_caution | software_tech |
| 519 | Web Search & Other Info Services | smb_friendly | software_tech |
| 522 | Credit Intermediation | corp_only | finance_corp (Pro) |
| 523 | Securities, Commodity Contracts | corp_only | finance_corp (Pro) |
| 524 | Insurance Carriers & Related | mixed_caution | real_estate (small brokers only) + finance_corp (Pro) for carriers |
| 525 | Funds, Trusts, Other Financial | corp_only | finance_corp (Pro) |
| 531 | Real Estate | KEEP (verify mapping to real_estate sector) | verify |
| 532 | Rental & Leasing Services | smb_friendly | real_estate or new `rental_leasing` |
| 533 | Lessors of Nonfinancial Intangible | corp_only | non-applicable |
| 541 | Professional, Scientific, Technical | KEEP (verify mapping) | verify |
| 551 | Management of Companies | corp_only | non-applicable (holding companies) |
| 561 | Administrative & Support | KEEP (verify mapping) | verify |
| 562 | Waste Management & Remediation | smb_friendly | trades_home or new `waste_management` |
| 611 | Educational Services | KEEP (verify) | verify |
| 621 | Ambulatory Health Care | KEEP (verify) | verify |
| 622 | Hospitals | corp_only | higher_ed_hospitals (Pro) |
| 623 | Nursing & Residential Care | mixed_caution | health_clinics |
| 624 | Social Assistance | smb_friendly | new `social_assistance` |
| 711 | Performing Arts, Spectator Sports | smb_friendly | events_entertainment |
| 712 | Museums, Historical Sites | smb_friendly | cultural |
| 713 | Amusement, Gambling, Recreation | smb_friendly | events_entertainment |
| 721 | Accommodation | KEEP (hotels_lodging) | verify |
| 722 | Food Services & Drinking | KEEP (restaurants) | verify |
| 811 | Repair & Maintenance | KEEP (verify) | verify |
| 812 | Personal & Laundry Services | KEEP (verify) | verify |
| 813 | Religious, Grantmaking, Civic | non-applicable | skip |
| 814 | Private Households | non-applicable | skip |
| 921-928 | Public Administration (gov) | non-applicable | skip all |

Net additions:

- **~28 NAICS-3 codes** added to existing industries (verification cases)
- **~9 new sub-niches** introduced (printing_services, sporting_hobby_books, wholesale_durable, wholesale_nondurable, warehousing_storage, rental_leasing, waste_management, social_assistance, building_materials_mfg)
- **~4 new Pro-only industries** (transport_corp, utilities aggregator if separate)
- **~12 codes** explicitly skipped (government, religious, holding companies, Fed, USPS)

### T-B.4 · Edit `industries.json`

For each decision, edit `src/lib/taxonomy/industries.json`:

```json
// Example: add 313, 314, 315, 316 to existing textile_apparel_mfg
{
  "id": "textile_apparel_mfg",
  "name": "Textile & apparel manufacturing",
  ...
  "naics_3": ["313", "314", "315", "316"],  // was ["313"]
  "naics_4": ["3131", "3132", "3141", "3149", "3151", "3152", "3159", "3169"]
}
```

```json
// Example: new sub-niche
{
  "id": "printing_services",
  "name": "Printing services",
  "audience": "smb_core",
  "examples": ["commercial printing", "screen printing", "digital printing", "engraving"],
  "keywords": ["printing", "print shop", "copy shop", "engraving"],
  "sector_id": "creative_media",
  "isic_divisions": ["18"],
  "naics_3": ["323"],
  "nace_divisions": ["18"]
}
```

```json
// Example: new Pro-only
{
  "id": "transport_corp",
  "name": "Large-firm transportation",
  "audience": "corp_only",
  "examples": ["airlines", "freight rail", "ocean carriers"],
  "keywords": ["airline", "rail", "shipping"],
  "sector_id": "transport_corp",  // new Pro-only sector if needed
  "isic_divisions": ["49", "50", "51"],
  "naics_3": ["481", "482", "483", "486"],
  "nace_divisions": ["49", "50", "51"]
}
```

### T-B.5 · Update `sectors.json` if needed

If new sectors needed for Pro-only (`transport_corp`, `utilities`,
`waste_management` if pulled out of trades_home), add to
`sectors.json` with `audience_default: "hidden"`.

Existing sector list per `docs/handoff/03_DECISION_LOG.md` D-012:
25 sectors. Try to fit new industries into existing sectors first.
Only add new sectors if absolutely necessary.

### T-B.6 · Update `PARENT_FALLBACK_MAP` if needed

If a new industry doesn't have direct data in `extrapolated_cells`
or `regional_cells`, add a fallback entry in `src/lib/taxonomy.ts`:

```typescript
export const PARENT_FALLBACK_MAP: Record<string, string> = {
  ...
  printing_services: "creative_media",  // or whatever covered cousin
  sporting_hobby_books: "grocery_stores",
  waste_management: "cleaning_services",
  // etc.
};
```

### T-B.7 · Run verification

```bash
cd E:\atlas\website
npx tsx scripts/verify_taxonomy.ts
npx tsc --noEmit
npm run lint
```

Fix any failures. Common issues:

- A new industry's `sector_id` doesn't match any sector in `sectors.json` — fix sector_id or add sector
- First 3 visible sectors no longer `food_drink`, `retail_shops`, `beauty_wellness` — adjust display_order
- A new Pro-only sector accidentally has `audience_default: "visible"` — change to hidden
- A new sector's name contains "banking", "mining", "energy", "pharma", "telecom" while visible — fix or change audience

### T-B.8 · Commit

```bash
git add src/lib/taxonomy/industries.json src/lib/taxonomy/sectors.json src/lib/taxonomy.ts
git commit -m "$(cat <<'EOF'
taxonomy: expand NAICS-3 coverage to full universe

- 73 → ~180 codes mapped across naics_3 + naics_4 arrays
- 9 new sub-niche industries (printing, sporting, wholesale, etc.)
- 4 new Pro-only industries (transport_corp, utilities)
- 12 NAICS-3 codes explicitly skipped (gov, religious, holding)

Unblocks 2-3x yield on US Census Phase 10 re-run + Canada + Mexico.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git push origin main
```

### T-B.9 · Verify Vercel build passes

Open Vercel dashboard. Watch the auto-deploy. If `prebuild` script
fails (taxonomy CI), the deploy stops — fix and re-push.

### T-B.10 · Document the new industry list

Append to `docs/handoff/13_GLOSSARY.md` Section A (industry
classifications) the new sub-niches. Append to `docs/handoff/04_CURRENT_STATE.md`
the new total industry count.

---

## 4 · Verification gate

| Check | Pass criterion |
|---|---|
| `verify_taxonomy.ts` | exit 0 |
| `tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0 |
| Vercel build | green |
| Industry count | 202 + ~15 = ~217 |
| NAICS-3 codes covered | ≥ 95 of 99 in universe |
| New Pro-only sectors | `audience_default: "hidden"` confirmed |

When all six pass: **B is DONE.** Move to Track C.

---

## 5 · RAM and operations

This track is taxonomy editing only. No Python ingest. No RAM
concerns. Estimated 2 hours of careful JSON editing + verification.

---

## 6 · What this unlocks

| Downstream | Yield |
|---|---|
| Track C.3 US Census re-execute | +52k rows |
| Track C.1 Canada with correct table | +12k rows |
| Track I.1 Mexico INEGI | +10k rows |
| Total unlocked downstream | **+74k rows** |

Plus better UX: more industries surface in search, sector pages,
and Pro-only gated views.
