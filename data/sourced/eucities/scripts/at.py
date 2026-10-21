import csv, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/at/"
STAT = "Statistik Austria"
GEO = {"level": "city", "code": "AT-9", "name": "Wien (Gemeinde and Bundesland)"}
DOM = {"01", "02", "70", "71", "72", "73", "74", "75", "76", "77"}
S1 = {"publisher": STAT, "title": "Ankünfte und Übernachtungen nach Herkunftsländern und Bundesländern ab 1973 (OGD_touextsai_Tour_HKL_1)", "url": "https://data.statistik.gv.at/data/OGD_touextsai_Tour_HKL_1.csv"}
S2 = {"publisher": STAT, "title": "Bevölkerung zu Jahresbeginn ab 2002 nach Gemeinden, Geschlecht und Alter, 2026 (OGD_bevstandjbab2002_BevStand_2026)", "url": "https://data.statistik.gv.at/data/OGD_bevstandjbab2002_BevStand_2026.csv"}
rows = []
agg = {}
for y in ("2024", "2025"):
    a = {"tot": [0, 0], "for": [0, 0], "months": set()}
    for r in csv.DictReader(open(D + "OGD_touextsai_Tour_HKL_1.csv"), delimiter=";"):
        if r["C-W96-0"] != "W96-9" or not r["C-SDB_TIT-0"].startswith(y): continue
        a["months"].add(r["C-SDB_TIT-0"])
        an, ue = int(r["F-ANK"] or 0), int(r["F-UEB"] or 0)
        a["tot"][0] += an; a["tot"][1] += ue
        if r["C-C93-2"] not in DOM: a["for"][0] += an; a["for"][1] += ue
    assert len(a["months"]) == 12, a["months"]
    for k, item, who in (("tot", "visitors_total", "all guests, residents of Austria included"), ("for", "visitors", "guests whose country of origin is outside Austria")):
        for i, unit in ((0, "arrivals"), (1, "nights")):
            rows.append({"item": item, "geo": GEO, "value": a[k][i], "unit": unit, "year": y,
                         "measure": f"{unit} of {who} in accommodation reported to the tourism statistics (all types), calendar year {y}",
                         "note": f"The sum of the twelve published months of {y}" + (" over every origin outside Austria (the Austrian Länder rows left out)" if k == "for" else " over every origin") + ". Vienna is both commune and Land.",
                         "source": S1})
pop = 0
for r in csv.DictReader(open(D + "bev2026.csv"), delimiter=";"):
    if r["C-GRGEMAKT-0"].startswith("GRGEMAKT-9"): pop += int(r["F-ISIS-1"])
rows.append({"item": "population", "geo": GEO, "value": pop, "unit": "persons", "year": "2026", "measure": "population on 1 January 2026",
             "note": "The sum of the published cells of Vienna's 23 districts (Gemeinde codes 901 to 923), every sex and age.", "source": S2})
write("at-statistik-austria.json", {"id": "eucities-at-statistik-austria",
    "source": {"publisher": STAT, "title": "Open Government Data: tourism by origin and Land; population at the start of the year", "url": "https://data.statistik.gv.at/",
               "table": "OGD_touextsai_Tour_HKL_1 (monthly, Land W96-9 Wien), OGD_bevstandjbab2002_BevStand_2026",
               "licence": "Creative Commons Attribution 4.0 (CC BY 4.0), Statistik Austria open data"},
    "retrieved": RETRIEVED, "rows": rows})
