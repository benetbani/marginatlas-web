import json, sys, itertools
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/ch/"
BFS = "Bundesamt für Statistik (BFS), Swiss Federal Statistical Office"
U = "https://www.pxweb.bfs.admin.ch/pxweb/de/{0}/-/{0}.px/"
def src(t, title): return {"publisher": BFS, "title": f"{title} ({t})", "url": U.format(t)}
def cells(t):
    d = json.load(open(D + t + ".data.json")); cats = []
    for i in d["id"]:
        idx = d["dimension"][i]["category"]["index"]; lab = d["dimension"][i]["category"]["label"]
        cats.append([lab[k] for k in sorted(idx, key=idx.get)])
    return list(zip(itertools.product(*cats), d["value"]))
COM = {"261 Zürich": ("261", "Zürich"), "351 Bern": ("351", "Bern"), "2701 Basel": ("2701", "Basel"), "6621 Genève": ("6621", "Genève")}
KT = {"Zürich": ("ZH", "Kanton Zürich", "Zürich"), "Bern / Berne": ("BE", "Kanton Bern", "Bern"), "Basel-Stadt": ("BS", "Kanton Basel-Stadt", "Basel"), "Genève": ("GE", "Canton de Genève", "Genève")}
MEAS = "number of workplaces (Arbeitsstätten) of market and non-market enterprises with at least one person subject to old-age insurance contributions, STATENT 2024"
rows = []
S102 = src("px-x-0602010000_102", "STATENT: Arbeitsstätten und Beschäftigte nach Jahr, Gemeinde, Wirtschaftssektor und Beobachtungseinheit")
for (y, g, sec, u), v in cells("px-x-0602010000_102"):
    code, name = COM[g]
    rows.append({"item": "business_count", "trade": "all", "officialClass": "NOGA 2008, all sectors (Wirtschaftssektor - Total)",
                 "geo": {"level": "city", "code": code, "name": f"{name} (Gemeinde)"}, "value": v, "unit": "workplaces", "year": y, "measure": MEAS,
                 "note": "The commune table goes no finer than the three sectors: the trade classes are published by canton only.", "source": S102})
S103 = src("px-x-0602010000_103", "STATENT: Arbeitsstätten und Beschäftigte nach Jahr, Kanton, Wirtschaftsart und Beobachtungseinheit")
TR = {"999999": "all", "561001": "restaurants", "563001": "cafes", "960201": "barbershops"}
for (y, k, cls, u), v in cells("px-x-0602010000_103"):
    code, name, city = KT[k]
    c6 = cls.split(" ")[0]
    note = f"The canton holding {city}, wider than the commune: the finest level at which STATENT publishes the NOGA class."
    if c6 == "561001": note += " Restaurants, snack bars, tea rooms and ice-cream parlours together: Swiss cafes sit in this class."
    if c6 == "563001": note += " Bars only: Swiss cafes are counted with restaurants (561001)."
    if c6 == "960201": note += " Hairdressing salons, barbers included."
    if v is None: continue
    row = {"item": "business_count", "officialClass": "NOGA 2008 " + ("all activities (Wirtschaftsart - Total)" if c6 == "999999" else cls),
           "geo": {"level": "region", "code": f"CH-{code}", "name": name}, "value": v, "unit": "workplaces", "year": y, "measure": MEAS, "note": note, "source": S103}
    if c6 in TR: row["trade"] = TR[c6]
    rows.append(row)
S201 = src("px-x-0102020000_201", "Demografische Bilanz nach institutionellen Gliederungen")
for (y, g, n, s, comp), v in cells("px-x-0102020000_201"):
    if g.startswith("......"):
        code = g[6:].split(" ")[0].lstrip("0"); nm = g[6:].split(" ", 1)[1]
        geo = {"level": "city", "code": code, "name": f"{nm} (Gemeinde)"}
    else:
        k = g[2:]; geo = {"level": "region", "code": "CH-" + KT[k][0], "name": KT[k][1]}
    rows.append({"item": "population", "geo": geo, "value": v, "unit": "persons", "year": y, "measure": "permanent resident population on 31 December 2024",
                 "note": "Same boundary as the workplace rows of this file, the end of the STATENT year.", "source": S201})
S1003 = src("px-x-1003020000_101", "Hotellerie: Ankünfte und Logiernächte der geöffneten Betriebe nach Jahr, Monat, Gemeinde, Herkunftsland und Indikator")
hot = {}
for (y, m, g, h, ind), v in cells("px-x-1003020000_101"):
    hot[(g, h, ind)] = (y, v)
CODE = {"Zürich": "261", "Bern": "351", "Basel": "2701", "Genève": "6621"}
for g in CODE:
    for ind, unit in (("Ankünfte", "arrivals"), ("Logiernächte", "nights")):
        y, tot = hot[(g, "Herkunftsland - Total", ind)]
        _, ch = hot[(g, "Schweiz", ind)]
        base = {"geo": {"level": "city", "code": CODE[g], "name": f"{g} (Gemeinde)"}, "unit": unit, "year": y, "source": S1003}
        rows.append({**base, "item": "visitors_total", "value": tot, "measure": f"hotel {unit} of guests from every country of residence, Switzerland included, annual total {y}",
                     "note": "Hotels and spa establishments open in the period (HESTA). Holiday flats and other lodging are not counted."})
        rows.append({**base, "item": "visitors", "value": tot - ch, "measure": f"hotel {unit} of guests resident outside Switzerland, annual total {y}",
                     "note": f"Two published figures combined: all guests ({tot}) minus guests resident in Switzerland ({ch}). Hotels and spa establishments only (HESTA)."})
write("ch-bfs-2024.json", {"id": "eucities-ch-bfs-2024",
    "source": {"publisher": BFS, "title": "STATENT, structural business statistics 2024; population balance; HESTA hotel accommodation statistics",
               "url": "https://www.pxweb.bfs.admin.ch/", "table": "px-x-0602010000_102 (commune), px-x-0602010000_103 (canton, NOGA 6-digit), px-x-0102020000_201 (population 31 Dec 2024), px-x-1003020000_101 (hotels, commune, 2025); PxWeb API https://www.pxweb.bfs.admin.ch/api/v1/de/",
               "licence": "BFS terms of use (each dataset carries its own OPEN-BY or OPEN-BY-ASK term; source must be given), https://www.bfs.admin.ch/bfs/en/home/fso/swiss-federal-statistical-office/terms-of-use.html"},
    "retrieved": RETRIEVED, "rows": rows})
