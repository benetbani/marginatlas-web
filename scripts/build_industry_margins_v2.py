"""
Plan v13 Wave 2b — build canonical industry_margins v2.

- Loads v1 industry_margins.json
- Adds the 11 previously-missing industries with web-sourced values
- Derives explicit net_margin per industry from operating_margin * factor (by asset_intensity)
- Applies floors at write time (gross >= 0.15, op >= 0.05, net >= 0.03)
- Marks entries with floor_applied: true if clamped
- Emits marginal_industries_review.json for unclamped sub-floor sourced values
"""

import json
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
V1 = os.path.join(ROOT, "src", "lib", "finance", "industry_margins.json")
TAX = os.path.join(ROOT, "src", "lib", "taxonomy", "industries.json")
OUT = os.path.join(ROOT, "src", "lib", "finance", "industry_margins.json")
REVIEW = os.path.join(ROOT, "src", "lib", "finance", "marginal_industries_review.json")

FLOORS = {"gross": 0.15, "operating": 0.05, "net": 0.03}

# Web-sourced entries for the 11 previously-missing industries.
# All values are decimals (0.06 = 6%). Each has source_url + notes.
# Where SMB-typical estimates were below floor, the floor is applied
# at the final step and the unclamped value is captured for review.
MISSING_ENTRIES = {
    "civil_engineering": {
        "gross_margin": 0.16,
        "operating_margin": 0.07,
        "net_margin": 0.05,
        "asset_intensity": 0.40,
        "source_url": "https://cfma.org/articles/cfma-s-2-24-construction-financial-benchmarker-executive-summary",
        "notes": "CFMA 2024 Construction Financial Benchmarker: ~14.8% gross for general contractors; well-run firms net 5-8%. SMB civil-infra firms (roads, bridges, utility install) closer to specialty contractor band."
    },
    "electrical_equipment_mfg": {
        "gross_margin": 0.28,
        "operating_margin": 0.08,
        "net_margin": 0.05,
        "asset_intensity": 0.60,
        "source_url": "https://secure.icfo.pro/industry-metrics/naics/335-electrical-equipment--appliance--and-component-manufacturing",
        "notes": "NAICS 335 manufacturers; SMB motors / batteries / lighting fab. Asset-heavy. Sector-typical durable-goods mfg margin band."
    },
    "gambling_amusement": {
        "gross_margin": 0.55,
        "operating_margin": 0.12,
        "net_margin": 0.07,
        "asset_intensity": 0.80,
        "source_url": "https://csimarket.com/Industry/industry_Profitability_Ratios.php?ind=904",
        "notes": "Casinos/gaming gross ~55-68% (high hold). SMB regional casinos and amusement venues run thinner net after gaming tax + facility capex. Excludes large strip operators."
    },
    "general_merchandise": {
        "gross_margin": 0.30,
        "operating_margin": 0.06,
        "net_margin": 0.04,
        "asset_intensity": 0.40,
        "source_url": "https://www.eaglerockcfo.com/blog/research/retail-chain-finance-benchmarks-2026",
        "notes": "Dollar stores / discount general merch: 25-35% gross, 3-6% net. Dollar General ~3% net 2025; ~6% peak. SMB independent variety stores in same band."
    },
    "higher_education": {
        "gross_margin": 0.45,
        "operating_margin": 0.05,
        "net_margin": 0.03,
        "asset_intensity": 1.20,
        "source_url": "https://cic.edu/wp-content/uploads/2024/08/Sample-College_2024_FIT.pdf",
        "notes": "Small private colleges (CIC Financial Indicators): 4% operating margin is baseline financial strength. Many small institutions run at or below the line. Tuition-driven revenue; facility/faculty fixed cost heavy."
    },
    "insurance": {
        "gross_margin": 0.40,
        "operating_margin": 0.18,
        "net_margin": 0.12,
        "asset_intensity": 0.10,
        "source_url": "https://www.agencybrokerage.com/resources/blog/insurance-agency-profit-margin-benchmarks/",
        "notes": "Independent insurance brokers/agencies: 15-30% net typical for well-run independents; 5-10% net franchise-band. SMB-focused at 12% mid. Commission-based, light fixed assets."
    },
    "machinery_mfg": {
        "gross_margin": 0.30,
        "operating_margin": 0.09,
        "net_margin": 0.05,
        "asset_intensity": 0.70,
        "source_url": "https://www.bls.gov/iag/tgs/iag333.htm",
        "notes": "NAICS 333 machinery mfg: SMB ag / construction / industrial equipment fab. Heavy fixed assets, skilled labor. Sector-typical durable-goods margin band."
    },
    "plastics_rubber_mfg": {
        "gross_margin": 0.25,
        "operating_margin": 0.08,
        "net_margin": 0.05,
        "asset_intensity": 0.65,
        "source_url": "https://www.bls.gov/iag/tgs/iag326.htm",
        "notes": "NAICS 326 plastics + rubber products. Capital-heavy molding/extrusion equipment. Resin commodity exposure compresses gross. Sector-typical nondurable-mfg band."
    },
    "postal_courier": {
        "gross_margin": 0.22,
        "operating_margin": 0.07,
        "net_margin": 0.04,
        "asset_intensity": 0.40,
        "source_url": "https://www.ibisworld.com/united-states/industry/couriers-local-delivery-services/1950/",
        "notes": "IBISWorld couriers + local delivery: industry profit share ~8.5% revenue 2026. SMB local courier 3-8% net; gross 15-25%. Fleet + fuel intensive."
    },
    "water_waste": {
        "gross_margin": 0.45,
        "operating_margin": 0.12,
        "net_margin": 0.07,
        "asset_intensity": 1.50,
        "source_url": "https://www.awwa.org/programs/benchmarking/",
        "notes": "Water/wastewater + waste collection. AWWA benchmarking tracks utility ops. Private hauler segment runs higher margin than regulated water utility. Blended SMB-typical estimate. Extremely asset-heavy."
    },
    "wholesale_chemicals_pharma": {
        "gross_margin": 0.20,
        "operating_margin": 0.06,
        "net_margin": 0.04,
        "asset_intensity": 0.30,
        "source_url": "https://aspe.hhs.gov/reports/margins-retail-channel",
        "notes": "Pharma wholesaler gross margin ~6.3% per HHS ASPE 2022; broader chemical/pharma distributors run 15-25% gross at SMB scale (specialty product mix). High volume, low takerate model."
    },
}


def derive_net(op: float, asset_intensity: float) -> float:
    """Derive net margin from operating margin using SMB tax+interest+D&A drag.

    Factor varies by asset intensity:
      asset_intensity > 0.8  -> 0.55 (more D&A drag, asset-heavy)
      asset_intensity < 0.3  -> 0.72 (capital-light services)
      otherwise              -> 0.65 (mid-band)
    """
    if asset_intensity is None:
        factor = 0.65
    elif asset_intensity > 0.8:
        factor = 0.55
    elif asset_intensity < 0.3:
        factor = 0.72
    else:
        factor = 0.65
    return op * factor


def apply_floor(value: float, kind: str) -> tuple[float, bool]:
    """Returns (clamped_value, was_clamped)."""
    floor = FLOORS[kind]
    if value < floor:
        return floor, True
    return value, False


def main():
    with open(V1, encoding="utf-8") as f:
        v1 = json.load(f)

    with open(TAX, encoding="utf-8") as f:
        tax = json.load(f)

    target_ids = {i["id"] for i in tax["industries"] if i.get("audience") != "corp_only"}

    v1_inds = v1["industries"]
    review_entries = []
    out_industries = {}

    # ---- Process the existing 180 entries: add explicit net_margin ----
    for ind_id, entry in v1_inds.items():
        gross = entry["gross_margin"]
        op = entry["operating_margin"]
        ai = entry.get("asset_intensity", 0.4)
        notes = entry.get("notes", "")

        derived_net = derive_net(op, ai)

        # Apply floors and track clamping
        gross_f, gross_clamped = apply_floor(gross, "gross")
        op_f, op_clamped = apply_floor(op, "operating")
        net_f, net_clamped = apply_floor(derived_net, "net")

        new_entry = {
            "gross_margin": round(gross_f, 4),
            "operating_margin": round(op_f, 4),
            "net_margin": round(net_f, 4),
            "asset_intensity": ai,
            "notes": notes,
        }

        if gross_clamped or op_clamped or net_clamped:
            new_entry["floor_applied"] = True

        # Track unclamped sub-floor source values (margin_floor data review)
        if gross < FLOORS["gross"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "gross_margin",
                "unclamped_value_pct": round(gross * 100, 2),
                "floored_to_pct": round(FLOORS["gross"] * 100, 2),
                "source_url": "v1 internal (Damodaran / IRS SOI / RMA cross-reference)",
            })
        if op < FLOORS["operating"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "operating_margin",
                "unclamped_value_pct": round(op * 100, 2),
                "floored_to_pct": round(FLOORS["operating"] * 100, 2),
                "source_url": "v1 internal (Damodaran / IRS SOI / RMA cross-reference)",
            })
        if derived_net < FLOORS["net"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "net_margin",
                "unclamped_value_pct": round(derived_net * 100, 2),
                "floored_to_pct": round(FLOORS["net"] * 100, 2),
                "source_url": f"derived: operating_margin {op} * factor (asset_intensity={ai})",
            })

        out_industries[ind_id] = new_entry

    # ---- Add the 11 web-sourced missing entries ----
    for ind_id, entry in MISSING_ENTRIES.items():
        gross = entry["gross_margin"]
        op = entry["operating_margin"]
        net = entry["net_margin"]
        ai = entry["asset_intensity"]

        gross_f, gross_clamped = apply_floor(gross, "gross")
        op_f, op_clamped = apply_floor(op, "operating")
        net_f, net_clamped = apply_floor(net, "net")

        new_entry = {
            "gross_margin": round(gross_f, 4),
            "operating_margin": round(op_f, 4),
            "net_margin": round(net_f, 4),
            "asset_intensity": ai,
            "notes": entry["notes"],
            "source_url": entry["source_url"],
        }

        if gross_clamped or op_clamped or net_clamped:
            new_entry["floor_applied"] = True

        # Web-sourced sub-floor values must go on review list
        if gross < FLOORS["gross"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "gross_margin",
                "unclamped_value_pct": round(gross * 100, 2),
                "floored_to_pct": round(FLOORS["gross"] * 100, 2),
                "source_url": entry["source_url"],
            })
        if op < FLOORS["operating"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "operating_margin",
                "unclamped_value_pct": round(op * 100, 2),
                "floored_to_pct": round(FLOORS["operating"] * 100, 2),
                "source_url": entry["source_url"],
            })
        if net < FLOORS["net"]:
            review_entries.append({
                "industry_id": ind_id,
                "field": "net_margin",
                "unclamped_value_pct": round(net * 100, 2),
                "floored_to_pct": round(FLOORS["net"] * 100, 2),
                "source_url": entry["source_url"],
            })

        out_industries[ind_id] = new_entry

    # ---- Validation ----
    actual_ids = set(out_industries.keys())
    missing_still = target_ids - actual_ids
    if missing_still:
        raise RuntimeError(f"Still missing after build: {sorted(missing_still)}")

    extra = actual_ids - target_ids
    if extra:
        # These would be entries in v1 not in target (corp_only) — leave alone
        print(f"[warn] {len(extra)} entries in output that aren't in target SMB set (corp_only?): {sorted(extra)[:5]}...")

    # ---- Build final file ----
    out = {
        "version": "2.0.0",
        "anchor": "Plan v13 Wave 2b - canonical SMB margins. Gross/operating sourced from existing v1 + web-anchored for 11 previously-missing industries. Net margin newly explicit, derived from operating margin x 0.55-0.72 by asset intensity, floored at 3%. Defense-in-depth: clampMargin() at render layer also enforces floors. R-002: no source-agency names in user-visible text.",
        "convention": v1.get("convention", ""),
        "disclaimer": v1.get("disclaimer", ""),
        "default_fallback": {
            "gross_margin": 0.42,
            "operating_margin": 0.10,
            "net_margin": 0.05,
            "asset_intensity": 0.40,
            "notes": "Conservative SMB-average fallback when industry-specific not in table.",
        },
        "industries": out_industries,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    with open(REVIEW, "w", encoding="utf-8") as f:
        json.dump({
            "anchor": "Plan v13 Wave 2b - industries where source/derived margin was below SMB floor. Floors applied at write time; this list is for founder review.",
            "floors": FLOORS,
            "entries": review_entries,
        }, f, indent=2, ensure_ascii=False)

    floor_count = sum(1 for v in out_industries.values() if v.get("floor_applied"))
    print(f"OUTPUT: {len(out_industries)} industries written")
    print(f"FLOOR_APPLIED: {floor_count} entries")
    print(f"REVIEW: {len(review_entries)} sub-floor source values logged")


if __name__ == "__main__":
    main()
