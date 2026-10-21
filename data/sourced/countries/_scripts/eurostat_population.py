"""Eurostat demo_pjan: population on 1 January 2023, every country Eurostat publishes and the EU, for the industry page's
`10 field` (restaurants for every 10,000 people: the 2023 enterprise count of eurostat-sbs-2023.json over this population).
Its own item name, `population_1jan`, so a loader never confuses it with a country office's count in business/populations.json.
Run: python3 _scripts/eurostat_population.py"""
import os, sys, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.normpath(os.path.join(HERE, "..", "..", "business", "scripts")))
from spines_lib import jsonstat, geo_eu, flagnote, write  # noqa: E402

DL = "/srv/atlas/runs/data-industry/dl"
os.makedirs(DL, exist_ok=True)
URL = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?sex=T&age=TOTAL&time=2023"
path = os.path.join(DL, "demo_pjan_2023.json")
urllib.request.urlretrieve(URL, path)
rows = []
for d, v, s, lab in jsonstat(path):
    g = d["geo"]
    if g in {"DE_TOT", "FX"} or (g.startswith(("EA", "EEA", "EFTA", "EU")) and g != "EU27_2020"):
        continue   # the aggregates other than the EU of 27, and the two historical boundaries
    r = {"item": "population_1jan", "trade": "all", "officialClass": "Population on 1 January, both sexes, all ages",
         "geo": geo_eu(g, lab["geo"][g]), "value": v, "unit": "persons", "year": "2023", "measure": "population on 1 January 2023"}
    n = flagnote(s)
    if n:
        r["note"] = n
    rows.append(r)
write("countries", "eurostat-population-2023.json", {
    "id": "eurostat-population-2023",
    "source": {"publisher": "Eurostat", "title": "Population on 1 January by age and sex (demo_pjan)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table",
               "table": "demo_pjan, sex T, age TOTAL, 2023",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": "2026-10-21", "rows": rows})
print({r["geo"]["code"]: r["value"] for r in rows if r["geo"]["code"] in ("EU27_2020", "DE", "GR", "FR", "RO", "CZ")})
