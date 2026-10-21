"""Eurostat sts_setu_m: monthly turnover index, food and beverage services (I56), not seasonally adjusted, 2021=100."""
import collections, os, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sts_setu_m"
       "?nace_r2=I56&s_adj=NSA&unit=I21&indic_bt=NETTUR&sinceTimePeriod=2023-01")
path = os.path.join(DL, "sts_setu_m_I56.json")
urllib.request.urlretrieve(URL, path)
SKIP = {"EU28", "EA19", "EA20"}  # closed aggregates
SRC = {"publisher": "Eurostat", "title": "Turnover in services, monthly data (sts_setu_m)",
       "url": "https://ec.europa.eu/eurostat/databrowser/view/sts_setu_m/default/table"}
by_geo = collections.defaultdict(list)
for k, v, s, lab in jsonstat(path):
    if k["geo"] in SKIP:
        continue
    by_geo[k["geo"]].append((k["time"], v, s, lab["geo"][k["geo"]]))
rows = []
for g, pts in sorted(by_geo.items()):
    pts.sort()
    for t, v, s, name in pts[-24:]:
        for trade, cls_note in (("restaurants", None),
                                ("cafes", "The division holds restaurants, cafes and bars together; no class below it is published monthly.")):
            r = {"item": "turnover_index_month", "trade": trade,
                 "officialClass": "NACE Rev. 2 I56: Food and beverage service activities",
                 "geo": geo_eu(g, name), "value": v, "unit": "index, 2021=100", "year": t,
                 "measure": f"net turnover index, not seasonally or calendar adjusted, {t}"}
            notes = [n for n in (cls_note, flagnote(s)) if n]
            if notes:
                r["note"] = " ".join(notes)
            rows.append(r)
write("business", "eurostat-sts-turnover-month.json", {
    "id": "eurostat-sts-turnover-month",
    "source": dict(SRC, table="sts_setu_m, indic_bt NETTUR, nace_r2 I56, s_adj NSA, unit I21; the latest 24 months each country publishes",
                   licence="Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"),
    "retrieved": RETRIEVED, "rows": rows})
print({g: (p[-1][0], len(p)) for g, p in by_geo.items()})
