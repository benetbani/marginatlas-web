import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *

DL = "/srv/atlas/runs/data-business/dl/"
TRADES = {"I56": ["restaurants", "cafes"], "S96": ["barbershops"], "B-S_X_O_S94": ["all"], "B-S_X_K642": ["all"]}
DIVNOTE = {"I56": "Published for the whole division 56 (food and beverage service: restaurants, bars, cafes, catering), not for one class.",
           "S96": "Published for the whole division 96 (other personal services: hairdressing and beauty, laundries, funeral, wellbeing and others), not for one class."}
NEW = {"publisher": "Eurostat", "title": "Business demography by size class and NACE Rev. 2 activity (bd_size)",
       "url": "https://ec.europa.eu/eurostat/databrowser/view/bd_size/default/table"}
OLD = {"publisher": "Eurostat", "title": "Business demography by size class (from 2004 onwards, NACE Rev. 2), closed series (bd_9bd_sz_cl_r2)",
       "url": "https://ec.europa.eu/eurostat/databrowser/view/bd_9bd_sz_cl_r2/default/table"}
rows = []

def add(item, nace, geo, gname, ref, age, v, s, cls, src):
    born = int(ref) - age
    for t in TRADES[nace]:
        note = [f"Enterprises born in {born} still active in {ref}, divided by enterprise births in {born}."]
        if nace in DIVNOTE: note.append(DIVNOTE[nace])
        fn = flagnote(s)
        if fn: note.append(fn)
        rows.append({"item": item, "trade": t, "officialClass": f"NACE Rev. 2 {nace}: {cls}", "geo": geo_eu(geo, gname),
                     "value": v, "unit": "percent of enterprises born", "year": ref,
                     "measure": f"{age}-year survival rate of enterprises (reference year {ref}, cohort born {born})",
                     "note": " ".join(note), "source": src})

lab, upd_new = labels_of(DL + "bd_size_srv.json")
best = {}
for d, v, s, _ in jsonstat(DL + "bd_size_srv.json"):
    k = (d["nace_r2"], d["geo"], d["age"])
    if k not in best or d["time"] > best[k][0]:
        best[k] = (d["time"], v, s)
for (nace, geo, age), (ref, v, s) in sorted(best.items()):
    n = int(age[1:])
    if n not in (1, 2, 3, 5):
        continue
    add(f"survival_{n}y", nace, geo, lab["geo"][geo], ref, n, v, s, lab["nace_r2"][nace], NEW)

lab9, upd_old = labels_of(DL + "bd9_srv.json")
best9 = {}
for d, v, s, _ in jsonstat(DL + "bd9_srv.json"):
    k = (d["nace_r2"], d["geo"])
    if k not in best9 or d["time"] > best9[k][0]:
        best9[k] = (d["time"], v, s)
for (nace, geo), (ref, v, s) in sorted(best9.items()):
    add("survival_5y", nace, geo, lab9["geo"][geo], ref, 5, v, s, lab9["nace_r2"][nace], OLD)

write("eurostat-business-demography.json", {
    "id": "eurostat-business-demography",
    "source": {**NEW, "table": f"bd_size (new series from reference year 2021, updated {upd_new[:10]}), indicator ENT_SRVLR_BRTH_PC; bd_9bd_sz_cl_r2 (closed series to reference year 2020, updated {upd_old[:10]}), indicator V97045; size class total",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
import collections
for k, v in sorted(collections.Counter((r["item"], r["trade"], r["year"]) for r in rows).items()): print(k, v)
