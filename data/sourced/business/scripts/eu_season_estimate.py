"""The EU's restaurants month by month, 2025: an ESTIMATE worked out from two sourced files (Eurostat publishes no monthly index
for the EU's food and drink service). For the industry page's `05 field`, "Busy and quiet months".

The method, in plain words (the method page quotes it): each member's own monthly sales index for food and drink service (not
seasonally adjusted, 2021 = 100, eurostat-sts-turnover-month.json) is divided by its own average month of 2025, so every
country's twelve months read against 100; the countries are then averaged month by month, each weighted by its restaurants'
yearly sales (2023: enterprises times mean sales, eurostat-sbs-2023.json). A member that does not publish all twelve months of
2025 is left out and named. Run: python3 scripts/eu_season_estimate.py (after the two files it reads)."""
import json, os
from spines_lib import SOURCED, write

B = os.path.join(SOURCED, "business")
sts = json.load(open(os.path.join(B, "eurostat-sts-turnover-month.json")))["rows"]
sbs = json.load(open(os.path.join(B, "eurostat-sbs-2023.json")))["rows"]
MEMBERS = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "GR", "ES", "FI", "FR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT",
           "NL", "PL", "PT", "RO", "SE", "SI", "SK"]
NAMES = {}
idx = {}
for r in sts:
    if r["trade"] == "restaurants" and r["year"].startswith("2025-"):
        idx.setdefault(r["geo"]["code"], {})[int(r["year"][5:])] = r["value"]
        NAMES[r["geo"]["code"]] = r["geo"]["name"]
pick = lambda item, g: next((r["value"] for r in sbs if r["item"] == item and r["trade"] == "restaurants" and r["geo"]["code"] == g), None)
for r in sbs:
    NAMES.setdefault(r["geo"]["code"], r["geo"]["name"])
use, left = [], []
for g in MEMBERS:
    n, s = pick("business_count", g), pick("sales_per_business", g)
    if g in idx and len(idx[g]) == 12 and n and s:
        use.append(g)
    else:
        left.append(g)
w = {g: pick("business_count", g) * pick("sales_per_business", g) for g in use}
W = sum(w.values())
eu_sales = pick("business_count", "EU27_2020") * pick("sales_per_business", "EU27_2020")
shape = [sum(w[g] * idx[g][m] / (sum(idx[g].values()) / 12) for g in use) / W * 100 for m in range(1, 13)]
names = lambda gs: ", ".join(NAMES.get(g, g) for g in gs)
note = (f"An estimate: {len(use)} members' own indexes, each over its own average month of 2025, averaged month by month and weighted "
        f"by its restaurants' 2023 sales; together they hold {100 * W / eu_sales:.1f}% of the EU restaurants' sales. "
        f"Left out (no twelve months of 2025, or no sales figure): {names(left) or 'none'}. The index counts restaurants, cafes and "
        f"bars together (division 56: no class below it is published monthly).")
rows = []
for m, v in enumerate(shape, start=1):
    rows.append({"item": "season_index_month", "trade": "restaurants", "officialClass": "NACE Rev. 2 I56: Food and beverage service activities",
                 "geo": {"level": "eu", "code": "EU27_2020", "name": "European Union - 27 countries (from 2020)"},
                 "value": round(v, 1), "unit": "index, the year's average month = 100", "year": f"2025-{m:02d}",
                 "measure": f"estimate: the month's sales against the year's average month, 2025-{m:02d}", "estimate": True, "note": note})
write("business", "eu-season-estimate-2025.json", {
    "id": "eu-season-estimate-2025",
    "source": {"publisher": "Eurostat", "title": "Turnover in services, monthly data (sts_setu_m), weighted by Enterprises by detailed NACE Rev. 2 activity (sbs_ovw_act)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/sts_setu_m/default/table",
               "table": "worked out by Margin Atlas from business/eurostat-sts-turnover-month.json and business/eurostat-sbs-2023.json (scripts/eu_season_estimate.py)",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": "2026-10-21", "rows": rows})
print([r["value"] for r in rows], "swing", round((max(shape) / min(shape) - 1) * 100, 1), "use", len(use), "left", left)
