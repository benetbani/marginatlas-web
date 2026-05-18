# 21 · Track R — Aggressive Country Extrapolation Blitz

> Founder direction (2026-05-18): "start an aggressive process of
> extrapolating for countries. For all the countries that we can,
> you should extrapolate as fuck."
>
> Cover every viable country via the Phase 18 / Wave 3 city overlay
> pattern. Use proxy countries for seeding when extrapolated_cells
> baseline is missing. Track quality 1-10; skip countries where the
> guess is too uncertain to be useful.

---

## 1 · Goal

By end of Track R, **every country with population > 500k AND not
sanctioned/conflict-blocked** has at least:

- A `COUNTRIES` entry
- Country signature line
- ≥ 1 representative city in regional_cells (Phase 18 / Wave 3 style)
- A computed quality score (1-10)
- Tax overlay rates in `country_rates_2024.json` (already done for 64
  countries in Track P; extend to ~120)

Target country count: **~120 covered** (currently 49).

---

## 2 · Quality 1-10 scoring framework

```
10 — Direct measurement (US Census CBP, EU NUTS via Eurostat, IBGE,
     ABS CABEE, INEGI Censos, CBS Netherlands, INE Spain, UK NOMIS)
 9 — Direct measurement with minor gaps (e.g. coarse SBI sections only)
 8 — Re-published by international body (OECD overlay, when activated)
 7 — Country-level extrapolation from regression on anchor countries
 6 — City overlay derived from country extrapolation × population share
 5 — Proxy country × small GDP-per-capita scaling (e.g. Andorra ← AND
     data, well-fit)
 4 — Proxy country × significant scaling (e.g. Albania ← MNE × 0.65,
     ALB GDP differs from MNE by ~35%)
 3 — Proxy country × heavy scaling (e.g. Switzerland ← MNE × 10x —
     SCHE GDP 5-7x MNE, multipliers extrapolated past their tested range)
 2 — Very loose proxy (e.g. small Pacific island ← regional aggregate)
 1 — Pure guess (avoid; do not ship)
```

Cells with quality ≥ 4 ship in default UI. Cells with quality < 4
get a warning chip or are hidden.

---

## 3 · Country tiers for extrapolation

### Tier R.1 — Western Europe completion (HIGH priority)

Existing measured: DE/FR/IT/ES/NL/BE/AT/CH/SE/NO/FI/DK/IE/PT/GR + UK.
Already covered or in pipeline.

**Add via Wave 3 overlay**:
- Iceland (ISL) — small economy, EU-adjacent
- Cyprus (CYP) — small EU member
- Malta (MLT) — small EU member
- Luxembourg city + Luxembourg overall (already covered)

### Tier R.2 — Eastern Europe + Balkans (MEDIUM-HIGH)

Add countries currently missing:
- Bosnia and Herzegovina (BIH)
- Serbia (SRB)
- Kosovo (XKX) — not in standard ISO; skip or use special handling
- North Macedonia (MKD)
- Moldova (MDA)
- Belarus (BLR)
- Ukraine (UKR)

Quality 5-6 expected (proxy from Romania/Bulgaria/Croatia).

### Tier R.3 — Asia expansion (HIGH)

Currently covered: JP (P), IN (X), CN (X), KR (X via city overlay).

Add or extend:
- Pakistan (PAK)
- Bangladesh (BGD)
- Vietnam (VNM) — already mentioned in plan
- Thailand (THA)
- Indonesia (IDN) — Phase 18 city overlay only; BPS bulk-CSV deferred
- Malaysia (MYS)
- Philippines (PHL)
- Singapore (SGP) — already covered
- Myanmar (MMR) — politically risky, skip
- Sri Lanka (LKA)
- Nepal (NPL)
- Cambodia (KHM)

### Tier R.4 — Middle East + North Africa (MEDIUM)

Currently: IL, AE, EG, MA, SA. Add:
- Jordan (JOR)
- Lebanon (LBN) — economic instability; quality 2-3, may skip
- Qatar (QAT)
- Kuwait (KWT)
- Bahrain (BHR)
- Oman (OMN)
- Tunisia (TUN)
- Algeria (DZA)
- Iraq (IRQ) — quality 2; skip
- Iran (IRN) — quality 4-5; ship

### Tier R.5 — Sub-Saharan Africa (LOWER)

Currently: NG, KE, ZA. Add:
- Ghana (GHA)
- Senegal (SEN)
- Côte d'Ivoire (CIV)
- Ethiopia (ETH)
- Tanzania (TZA)
- Uganda (UGA)
- Rwanda (RWA)
- Botswana (BWA)
- Zambia (ZMB)

Most quality 3-5. Some war-zone (skip): South Sudan, Sudan, DRC,
Somalia, CAR.

### Tier R.6 — Latin America completion (MEDIUM)

Currently: MX, BR, AR, CL, CO, PE. Add:
- Uruguay (URY)
- Ecuador (ECU)
- Bolivia (BOL)
- Paraguay (PRY)
- Costa Rica (CRI)
- Panama (PAN)
- Dominican Republic (DOM)
- Guatemala (GTM)
- Honduras (HND)
- El Salvador (SLV)
- Cuba (CUB) — info access limited; quality 2; skip
- Venezuela (VEN) — quality 2 due to hyperinflation; skip

### Tier R.7 — Oceania + small (MEDIUM-LOW)

Add: PNG, FJI; skip Polynesian micro-states.

### Tier R.8 — Central Asia + Caucasus (DONE in Wave 3)

KZ, AZ, GE already covered. Add:
- Uzbekistan (UZB)
- Kyrgyzstan (KGZ)
- Tajikistan (TJK)
- Turkmenistan (TKM) — info access limited
- Armenia (ARM)

---

## 4 · Implementation pattern

For each country to add:

```python
# scripts/ingest/city_overlay/fetch_wave4.py (new)
# Same pattern as fetch_wave3.py but for new tier
WAVE4_COUNTRIES = {
    "IS": {"iso3":"ISL", "proxy_iso3":"AUT", "proxy_scale":0.85,
           "cities":[("Reykjavik", 0.65, 1.30)]},
    "MT": {"iso3":"MLT", "proxy_iso3":"PRT", "proxy_scale":0.80,
           "cities":[("Valletta", 0.40, 1.10), ("Sliema", 0.10, 1.05)]},
    "VN": {"iso3":"VNM", "proxy_iso3":"THA", "proxy_scale":0.50,
           "cities":[("Ho Chi Minh", 0.30, 1.30), ("Hanoi", 0.20, 1.25), ("Da Nang", 0.05, 1.05)]},
    # ... 60+ more
}
```

Per country:
1. If proxy_iso3 not in extrapolated_cells: skip OR find nested proxy
2. Seed target country's extrapolated_cells from proxy × scale (one-time)
3. Derive city cells (Wave 3 pattern)
4. Compute quality_score per cell based on |1 - scale|:
   - scale 0.9-1.1: quality 7
   - scale 0.5-0.9 or 1.1-2.0: quality 5
   - scale 0.3-0.5 or 2.0-5.0: quality 4
   - scale < 0.3 or > 5.0: quality 3 (warn) or skip

Update `taxonomy.ts` COUNTRIES list with new entries.

---

## 5 · Steps

| Step | What | Time |
|---|---|---|
| R.1 | Audit current extrapolated_cells coverage; list all countries with data | 30 min |
| R.2 | Per-tier proxy + scale decision table | 1 hr |
| R.3 | Write `fetch_wave4.py` extension with all WAVE4_COUNTRIES | 2-3 hr |
| R.4 | Run pipeline; expect +30-50k rows | 30 min |
| R.5 | Update COUNTRIES in taxonomy.ts with all new entries (~60+) | 1 hr |
| R.6 | Update top100.json with major cities from each new country (or extend to top200) | 1 hr |
| R.7 | Extend `country_rates_2024.json` from 64 to ~120 countries | 2-3 hr |
| R.8 | Per-cell quality_score 1-10 backfill via SQL update or one-time script | 1.5 hr |
| R.9 | UI: warning chip for cells with quality < 4 | 30 min |
| R.10 | Verify spot-check 20 random new-country cells render | 30 min |
| **Total** | | **~10-12 hr** |

---

## 6 · Verification gate

- ≥ 100 distinct countries in COUNTRIES list
- ≥ 80 countries with ≥ 1 cell in regional_cells
- All cells have computed quality_score 1-10
- `verify_taxonomy.ts` passes
- `tsc --noEmit` passes
- Smoke test: 20 random URLs from new countries all render

---

## 7 · RAM guard

This is the riskiest track for RAM: copying extrapolated_cells × ~60
proxies × city derivations could pile up rows. Budget:

- Per-country proxy seeding: ~264 rows × 60 countries = 16k rows in memory ≈ 5 MB
- Per-city derivations: ~10k rows total ≈ 3 MB
- Total RAM headroom: well under 100 MB peak

Safe.

---

## 8 · What this unlocks

- ~120 countries listed in dropdowns
- /pk, /bd, /vn, /th, /id (extend), /tn, /jo, /qa, /omn, /kw, /bh,
  /is, /mt, /cy, /uy, /pa, /cr, /do, /uz, /am, /bih, /mkd, /mda,
  /by, /ua etc. all render
- Tax overlay coverage matches country coverage
- Quality_score 1-10 makes data quality legible to users
- Founder's "extrapolate as fuck" directive realised
