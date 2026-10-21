"""World Bank Entrepreneurship Database through WDI, IC.BUS.NDNS.ZS: new business density, 2015 to the newest year.

Pull: https://api.worldbank.org/v2/country/all/indicator/IC.BUS.NDNS.ZS?format=json&per_page=20000&date=2010:2025 -> DL/wdi_ndns.json
"""
import json
from lib import DL, RETRIEVED, COUNTRIES, ISO3, geo, write

URL = "https://api.worldbank.org/v2/country/all/indicator/IC.BUS.NDNS.ZS?format=json&per_page=20000&date=2010:2025"
meta = json.load(open(f"{DL}/wdi_ndns_meta.json"))[1][0]
out = []
for r in sorted(json.load(open(f"{DL}/wdi_ndns.json"))[1], key=lambda r: (r["countryiso3code"], r["date"])):
    iso2 = ISO3.get(r["countryiso3code"])
    if not iso2 or r["value"] is None or r["date"] < "2015":
        continue
    out.append({
        "item": "new_business_density",
        "geo": geo(iso2),
        "value": round(r["value"], 2),
        "unit": "new limited liability companies registered per 1,000 people aged 15 to 64",
        "year": r["date"],
        "measure": "new business density: newly registered firms with limited liability per 1,000 working-age people, calendar year",
        "note": "Limited liability companies only (sole traders and partnerships are not counted), from the country's business registry.",
    })
have = {r["geo"]["code"] for r in out}
last = {}
for r in out:
    last[r["geo"]["code"]] = r["year"]
print("countries:", len(have), "missing:", " ".join(sorted(set(COUNTRIES) - have)))
print({y: sum(1 for v in last.values() if v == y) for y in sorted(set(last.values()))})
write("wb-new-business-density.json", {
    "id": "wb-new-business-density",
    "source": {
        "publisher": "World Bank (Entrepreneurship Database, through World Development Indicators)",
        "title": f"{meta['name']}, IC.BUS.NDNS.ZS (last updated 2026-10-08)",
        "url": URL,
        "table": "IC.BUS.NDNS.ZS, annual, 2015 to 2024",
        "licence": "World Bank WDI: Creative Commons Attribution 4.0, https://datacatalog.worldbank.org/search/dataset/0037712/World-Development-Indicators",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
