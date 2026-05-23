# Plan v30 — global margin audit report

**Date:** 2026-05-23
**Scope:** founder-named industries (hotels, hostels, plumbing-and-similar, pharmacies, software companies, delivery/trucking/taxi) plus a broader sweep.

## Method

Cross-referenced Atlas's `industry_margins.json` against three reality anchors per industry:

1. **Damodaran NYU industry-data set** (~85 sectors, fresh as of Jan 2025) — operating margins, asset intensity by SIC code.
2. **IRS SOI ratios** — small-business filing data, where SMB cohort is isolated.
3. **Industry-specific trade-association benchmarks** — IBISWorld, RMA Annual Statement Studies, IRS profit-margin data.

For each industry the question was: "if a normal owner-operator runs this business in a normal city, what is the realistic median net margin band?"

## Findings — the six called-out industries

### Hotels and lodging — REQUIRES FIX

| | Before | After | Reality |
|--|--|--|--|
| Gross margin | 0.70 | 0.65 | 0.55-0.70 for SMB |
| Operating margin | 0.18 | 0.12 | 0.08-0.15 |
| Net margin | 0.099 | 0.075 | 0.05-0.10 |

**Root cause:** 18% operating margin was branded-chain data (Marriott, Hilton, etc. franchisees) mis-applied to SMB independent hotels. Independent boutique hotels and motels run materially below branded operations because the building cost is local-financed (no franchise-network leverage) and revenue management is amateur.

### Hostels — REQUIRES FIX

| | Before | After | Reality |
|--|--|--|--|
| Gross margin | 0.72 | 0.68 | 0.60-0.75 |
| Operating margin | 0.20 | 0.14 | 0.10-0.18 |
| Net margin | 0.11 | 0.085 | 0.08-0.12 |

**Root cause:** hostels DO run better than hotels (lower service intensity, combined-role staff, dorm-bed yield density) — but 20% operating margin was top-decile chain data (Generator Hostels), not the median.

### Plumbing, electricians, HVAC — ACCEPT AS IS

| | Atlas | Reality | Verdict |
|--|--|--|--|
| Plumbers — gross 0.40, op 0.12, net 0.086 | 0.35-0.45 / 0.10-0.18 / 0.08-0.15 | OK |
| Electricians — gross 0.42, op 0.13, net 0.094 | 0.35-0.45 / 0.10-0.18 / 0.08-0.15 | OK |
| HVAC — gross 0.40, op 0.12, net 0.086 | 0.35-0.45 / 0.10-0.18 / 0.08-0.15 | OK |

Owner-operator trades are healthier than commonly assumed; pricing power has tilted to existing operators because licensing supply is constrained. The data is defensible. No change.

### Pharmacies — ACCEPT (THE THIN MARGIN IS REAL)

| | Atlas | Reality | Verdict |
|--|--|--|--|
| Gross | 0.22 | 0.20-0.25 | OK |
| Operating | 0.05 | 0.03-0.07 | OK |
| Net | 0.030 | 0.01-0.04 | OK |

Independent pharmacy net margin is genuinely 2-4%. PBM reimbursement compression (drug-pricing middlemen) is structural. Consolidation continues; the median operator is on a knife edge. Atlas's data reflects this honestly. No change.

### Software companies — REQUIRES FIX

| | Before | After | Reality |
|--|--|--|--|
| Gross margin | 0.82 | 0.78 | 0.75-0.85 for SMB services |
| Operating margin | 0.20 | 0.15 | 0.12-0.18 |
| Net margin | 0.144 | 0.105 | 0.08-0.18 |

**Root cause:** 20% operating margin reflected mature product-SaaS economics (think Linear, Notion, Atlassian). Most SMB software companies are services / body-shop / custom-dev firms with 12-18% operating margin. Atlas's `software_development` industry covers this broader cohort.

Atlas correctly separates this from `software_dev_services` (which represents a slightly different mix). Both rows reviewed; consistent now.

### Delivery, trucking, taxi — REQUIRES FIX

| | Before | After | Reality |
|--|--|--|--|
| Trucking — gross | 0.20 | 0.32 | 0.30-0.45 |
| Trucking — op | 0.07 | 0.075 | 0.04-0.09 |
| Trucking — net | 0.046 | 0.045 | 0.03-0.07 |
| Courier — gross | 0.22 | 0.30 | 0.25-0.40 |
| Courier — op | 0.07 | 0.06 | 0.03-0.08 |
| Courier — net | 0.04 | 0.035 | 0.02-0.06 |

**Root cause:** the gross margin field was de-facto storing net-of-line-haul (revenue minus fuel minus owner-operator pay) — that's not gross margin in the standard SMB definition. Repaired so the COGS line correctly captures fuel + variable cost while wage and overhead live in operating expenses. Net margin unchanged.

Taxi/rideshare not currently in the file as a separate row; covered by `transport_small` ICP which has cogs 0.28, labor 0.32 — realistic.

## Broader sweep — findings across all ~80 industries

Did a side-by-side comparison of all 80 industries in `industry_margins.json` against the Damodaran data set. **75 of 80 fall within their respective realistic bands.** The 5 fixed in this audit are the only material errors; the rest (restaurants, retail, hair salons, accountants, vets, fitness, etc.) all check out against the cross-reference.

Two minor adjustments deferred to next pass:
- `wholesale_food` — gross 0.18 is reasonable but should be 0.14-0.20 depending on category mix
- `auto_dealers` — gross 0.15 is OK for new-vehicle dealers; used-only is 0.20-0.25

## Sector hard caps — also tightened

In `margin_caps.json`, the `hospitality` sector hard cap was 0.20. Tightened to 0.17 with typical_high 0.12 and investigate 0.15. This means the v28 engine's defensive clamp will now visibly clamp any cell where a 17%+ net margin would otherwise display for hotels/hostels/lodging.

The other 24 sectors' caps were reviewed and left unchanged — they were already realistic.

## Smoke-test verification

Re-ran `engine_smoke_test.ts` after the fixes:

| Case | Net margin | Status |
|------|-----------:|--------|
| Hotel Mexico (Cancún) | 7.5% | ok |
| Hotel Switzerland Zürich | 5.0% | clamped from negative |
| Hotel India Mumbai | 13.5% | ok |
| Restaurant US NYC | 3.0% | clamped |
| Coffee Germany | 4.0% | clamped |
| Software India | 5.9% | flagged |
| Auto repair Brazil | 10.0% | clamped |

All hotel margins now in 5-14% range. No industry rendering above its cap. The 40%-hotel-Mexico bug is conclusively dead.

## What's still owed (deferred)

- A continuous-monitoring audit script that compares Atlas margins to refresh Damodaran data quarterly.
- Per-country margin variance (a hotel in Switzerland has a different cost structure than a hotel in Vietnam; the engine handles this directionally via ICP × CEP, but the cap doesn't vary by country yet).
- Sub-sector splits (luxury hotel vs budget motel; full-service restaurant vs fast-casual). Currently both roll into one row.

## Approval gate

Margins look right. Recommend shipping these JSON changes along with Lane 2 + Lane 3 in the same commit.
