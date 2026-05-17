# Phase 3 — Germany: Bundesländer → Regierungsbezirke → Kreise → Gemeinden

> **Goal:** Make Germany the showcase country. The founder specifically
> called out the need to reach Bavaria / Baden-Württemberg / Hessen at
> NUTS-1 level for industrial machinery, and Munich / Berlin / Hamburg
> at city level. This phase delivers a four-tier hierarchy:
> Länder → Reg.bezirke → Kreise → Gemeinden.

---

## 1 · Targets

| Level | German name | Count | Example | Phase |
|---|---|---|---|---|
| Federal state | Bundesland | 16 | Bayern (DE-BY) | Already partial via Eurostat NUTS-1 |
| Government region | Regierungsbezirk | 38 | Oberbayern (DE-BY-OBB) | Eurostat NUTS-2 (Phase 1) |
| District | Kreis | 401 | München Stadt (DE-09162) | THIS PHASE (NUTS-3) |
| Municipality | Gemeinde | 10,790 | Top 1,000 by population | Phase 2 LAU |

Phase 3 lands the **Kreise tier** with full Destatis fidelity beyond what
Eurostat provides, plus refines the **Gemeinden** top-1,000 begun in
Phase 2.

---

## 2 · Why a deep dive on Germany

- The Mittelstand (small/medium manufacturing) is uniquely well-documented in Germany.
- Destatis publishes more granular breakdowns than Eurostat re-publishes.
- Industrial machinery, automotive parts, precision instruments — the categories where Germany leads — are at Kreis level only via Destatis directly.
- Founder priority signal.

---

## 3 · Sources

| Dataset | Destatis code | Granularity | Notes |
|---|---|---|---|
| Companies and persons employed by Kreis × NACE | 52111-0011 | Kreis × NACE-2 | Annual |
| Employment subject to social security by Kreis × NACE | 13312-0006 | Kreis × NACE-3 | Quarterly |
| Turnover statistics by Kreis × industry | 45341-0001 | Kreis × selected NACE | Annual; only certain industries |
| Manufacturing detail by Kreis | 42111-0006 | Kreis × NACE-4 | The Mittelstand goldmine |

API: GENESIS-Online at https://www-genesis.destatis.de/genesisWS/rest/2020/data/

Free; rate-limited at ~200 calls/minute. Pagination via `pagelength` + `startseite`.

---

## 4 · Industry mapping deep-dive

Destatis uses **WZ-2008** which is the German implementation of NACE
Rev.2. Mapping is 1:1 with NACE codes already in our crosswalk. The
only special-handling needed:

- WZ codes 26 (Datenverarbeitungsgeräte) and 27 (elektrische Ausrüstungen) get extra weight on `electronics_mfg` vs `electrical_equipment_mfg`.
- WZ 25.6 (Surface treatment) → `metal_fab_machine_shops` not generic `metal_products_mfg`.
- WZ 28 (Maschinenbau) is the headline Mittelstand category — maps to `machinery_mfg`. Promote display priority.

---

## 5 · Schema mapping

```
geo_id          := 'DE-' + Kreis 5-digit AGS (Allg. Gemeindeschlüssel)
                   e.g. 'DE-09162' for München (Landkreishauptstadt)
geo_level       := 'kreis' for Kreise; 'gemeinde' for the LAU top-1,000
geo_name        := Destatis label (e.g. 'München, Landeshauptstadt')
industry_id     := mapped from WZ-2008 NACE
year            := from query result
size_band       := from Destatis size class where available, else 'total'
n_enterprises   := Destatis BET01 (Anzahl Unternehmen)
n_employees     := Destatis BET05 (sozialversicherungspflichtig Beschäftigte)
revenue_per_firm:= Destatis UMS01 / BET01 (where turnover published)
payroll_per_emp := derived from BES + BET05 where social security data overlaps
quality_score   := 80 (Destatis is direct primary measurement)
coverage_tier   := 'P' (Primary)
coverage_source := 'National business statistics' (Plan v3.0 lockdown)
currency        := 'USD' after EUR→USD via World Bank FX
```

---

## 6 · Implementation steps

1. `scripts/ingest/de_destatis/auth.py` — Destatis requires free username; store as env var `DESTATIS_USER`.
2. `scripts/ingest/de_destatis/fetch_kreise.py` — paginated fetch for 52111-0011 across all 401 Kreise × ~30 industries. Stream JSON via `ijson`.
3. `scripts/ingest/de_destatis/fetch_mfg_detail.py` — separate path for 42111-0006 manufacturing detail at NACE-4.
4. `scripts/ingest/de_destatis/fetch_turnover.py` — 45341-0001 turnover data (only ~15 industries have it published at Kreis level).
5. `scripts/ingest/de_destatis/normalize.py` — WZ → industry_id mapping, EUR→USD, derived per-firm metrics.
6. `scripts/ingest/de_destatis/upload.py` — batched upsert with the common helper.
7. `scripts/ingest/de_destatis/run.py` — orchestrator. Sequential per dataset. Per-Kreis logging.
8. `scripts/ingest/de_destatis/ags_lookup.csv` — Kreis AGS → name + parent Land mapping (download once from Destatis metadata).
9. Resume file: `de_destatis_progress.json` tracks which Kreise are done.
10. Verify: 10 Kreise spot-checked manually (Munich, Berlin Mitte, Hamburg, Stuttgart, Frankfurt, Köln, Düsseldorf, Bremen, Leipzig, Dresden).

---

## 7 · Expected output

| Tier | Geos | Industries | Cells |
|---|---|---|---|
| Kreis (all 401) | 401 | ~30 | ~12,000 |
| Kreis × manufacturing NACE-4 | 401 | ~15 | ~6,000 |
| Kreis × turnover | 401 | ~15 | ~6,000 |
| **Total** | | | **~24,000 new cells** |

Time to fetch: ~3 hours (rate-limited; ~200 calls/min × 1,200 calls).
Storage: ~7 MB.

---

## 8 · Spot-check URLs

After this phase:

- `/de/munich/restaurants` (DE-09162) — should show real Munich-Stadt restaurants, not Bavaria-level extrapolation
- `/de/berlin/cafes-coffee-shops` (DE-11000)
- `/de/hamburg/clothing-stores` (DE-02000)
- `/de/stuttgart/metal-products-manufacturing` (DE-08111) — flagship Mittelstand cell
- `/de/baden-wurttemberg/machinery-manufacturing` (Bundesland-level via NUTS-1)
- `/de/bavaria/industrial-machinery` (Bundesland-level)
- `/de/hessen/management-consulting` (Frankfurt area)
- `/de/north-rhine-westphalia/wholesale-food` (Rhine-Ruhr corridor)
- `/de/saxony/textile-apparel-manufacturing`
- `/de/dresden/software-development`

---

## 9 · Risks

| Risk | Mitigation |
|---|---|
| Destatis free-tier quota (~10k rows/day) | Run over 2-3 days; resume support critical |
| Per-Kreis × per-industry combo sometimes empty | Skip silently; don't write NULL rows |
| WZ-2008 codes are still 2008 (not WZ-2025) | Stick with WZ-2008; aligns with NACE Rev.2 our taxonomy uses |
| Kreis renumbering (rare merges/splits) | Use 2023 AGS table; older rows may not resolve |
| Some manufacturing turnover suppressed for confidentiality | Quality tier "T" (Tabulated, redacted); UI shows "Limited disclosure" |

---

## 10 · RAM budget

- Streaming JSON parser; never hold > 5,000 rows in memory.
- DuckDB not needed in this phase (Destatis returns already-aggregated rows).
- Upload batches of 500.
- **Peak: ~70 MB.**

---

## 11 · Definition of done

- [ ] All 401 Kreise have at least 20 industry cells in `regional_cells`
- [ ] 10/10 spot-check URLs render real measured data
- [ ] Munich-Stadt restaurants resolves at exact city, not Bavaria fallback
- [ ] Industrial machinery in Baden-Württemberg / Bavaria / Hessen renders with measured Mittelstand data
- [ ] Coverage audit shows ≥ 24,000 Germany rows
- [ ] Summary in `19_VERIFICATION_QUALITY.md`
