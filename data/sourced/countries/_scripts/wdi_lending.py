"""World Bank WDI FR.INR.LEND, lending interest rate (%), from the IMF's International Financial Statistics, 2016 to 2025.

Pull: https://api.worldbank.org/v2/country/all/indicator/FR.INR.LEND?format=json&per_page=20000&date=2015:2025 -> DL/wdi_lend.json
"""
import json
from lib import DL, RETRIEVED, COUNTRIES, ISO3, geo, write

URL = "https://api.worldbank.org/v2/country/all/indicator/FR.INR.LEND?format=json&per_page=20000&date=2015:2025"
meta = json.load(open(f"{DL}/wdi_lend_meta.json"))[1][0]
data = json.load(open(f"{DL}/wdi_lend.json"))[1]
out = []
for r in sorted(data, key=lambda r: (r["countryiso3code"], r["date"])):
    iso2 = ISO3.get(r["countryiso3code"])
    if not iso2 or r["value"] is None or r["date"] < "2016":
        continue
    out.append({
        "item": "lending_rate",
        "geo": geo(iso2),
        "value": round(r["value"], 2),
        "unit": "% a year",
        "year": r["date"],
        "measure": "lending interest rate: the bank rate that usually meets the short- and medium-term financing needs of the private sector",
        "note": "Differentiated by the borrower's creditworthiness; terms differ by country, which limits comparability (the indicator's own note). Annual.",
    })
have = sorted({r["geo"]["code"] for r in out})
latest = {}
for r in out:
    latest[r["geo"]["code"]] = r["year"]
print("countries:", len(have), "missing:", " ".join(sorted(set(COUNTRIES) - set(have))))
print("latest year:", {y: sum(1 for v in latest.values() if v == y) for y in sorted(set(latest.values()))})
write("wdi-lending-rate.json", {
    "id": "wdi-lending-rate",
    "source": {
        "publisher": "World Bank (World Development Indicators), from the IMF's International Financial Statistics",
        "title": f"{meta['name']}, FR.INR.LEND (last updated 2026-10-08)",
        "url": URL,
        "table": "FR.INR.LEND, annual, 2016 to 2025",
        "licence": "World Bank WDI: Creative Commons Attribution 4.0 (CC BY 4.0), https://datacatalog.worldbank.org/search/dataset/0037712/World-Development-Indicators",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
