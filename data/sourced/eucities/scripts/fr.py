import json, sys, csv
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
agg = json.load(open("/srv/atlas/runs/data-eucities/dl/fr/agg.json"))
COM = {"75056": "Paris", "69123": "Lyon", "13055": "Marseille", "44109": "Nantes", "06088": "Nice", "31555": "Toulouse"}
ARR = {"75056": " The 20 arrondissements (751xx) are summed into the commune.", "69123": " The 9 arrondissements (6938x) are summed into the commune.",
       "13055": " The 16 arrondissements (132xx) are summed into the commune."}
NAF = {"56.10A": ("Restauration traditionnelle (traditional restaurants)", "restaurants"),
       "56.10B": ("Cafétérias et autres libres-services (cafeterias and other self-service)", None),
       "56.10C": ("Restauration de type rapide (fast food)", None),
       "56.30Z": ("Débits de boissons (beverage serving: bars and cafes)", "cafes"),
       "96.02A": ("Coiffure (hairdressing)", "barbershops"),
       "96.02B": ("Soins de beauté (beauty treatment)", None)}
SRC = {"publisher": "Insee (Institut national de la statistique et des études économiques)",
       "title": "Base Sirene des entreprises et de leurs établissements (SIREN, SIRET), fichier StockEtablissement, 1 octobre 2026 (parquet)",
       "url": "https://www.data.gouv.fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/"}
MEAS = "number of active establishments (etatAdministratifEtablissement = A) whose main activity (APE, NAF rév. 2) is the class, by the commune of the establishment's address, stock of 1 October 2026"
MEASE = MEAS + ", of which employers (caractereEmployeurEtablissement = O)"
rows = []
tot = {}
emp = {}
for com, a, n, t, e, p in agg:
    tot[com] = tot.get(com, 0) + t
    emp[com] = emp.get(com, 0) + e
for com, a, n, t, e, p in sorted(agg):
    if a not in NAF: continue
    lab, trade = NAF[a]
    for item, val, meas in (("business_count", t, MEAS), ("business_count_employer", e, MEASE)):
        note = f"Commune de {COM[com]}." + ARR.get(com, "")
        if item == "business_count":
            note += " The register holds every establishment declared active, sole traders and micro-entrepreneurs without staff included."
            if p: note += f" {p} of them are partially diffusible (address detail hidden, commune kept)."
        r = {"item": item, "officialClass": f"NAF rév. 2, {a}: {lab}", "geo": {"level": "city", "code": com, "name": f"{COM[com]} (commune)"},
             "value": val, "unit": "establishments", "year": "2026-10", "measure": meas, "note": note}
        if trade: r["trade"] = trade
        rows.append(r)
for com in sorted(COM):
    for item, val, meas in (("business_count", tot[com], MEAS), ("business_count_employer", emp[com], MEASE)):
        rows.append({"item": item, "trade": "all", "officialClass": "All activities (whole Sirene register)",
                     "geo": {"level": "city", "code": com, "name": f"{COM[com]} (commune)"}, "value": val, "unit": "establishments",
                     "year": "2026-10", "measure": meas,
                     "note": f"Commune de {COM[com]}." + ARR.get(com, "") + " Every active establishment, including property holding companies (SCI) and registered offices without premises, so the whole count is far above the number of shopfronts."})
PSRC = {"publisher": "Insee (Institut national de la statistique et des études économiques)",
        "title": "Populations de référence 2023 (en vigueur au 1er janvier 2026), DS_POPULATIONS_REFERENCE",
        "url": "https://api.insee.fr/melodi/file/DS_POPULATIONS_REFERENCE/DS_POPULATIONS_REFERENCE_2023_CSV_FR"}
for r in csv.DictReader(open("/srv/atlas/runs/data-eucities/dl/fr/mel/DS_POPULATIONS_REFERENCE_2023_data.csv"), delimiter=";"):
    if r["GEO_OBJECT"] == "COM" and r["GEO"] in COM and r["POPREF_MEASURE"] == "PMUN":
        rows.append({"item": "population", "geo": {"level": "city", "code": r["GEO"], "name": f"{COM[r['GEO']]} (commune)"},
                     "value": int(r["OBS_VALUE"]), "unit": "persons", "year": r["TIME_PERIOD"],
                     "measure": "population municipale (usual residents), reference date 1 January 2023, in force from 1 January 2026",
                     "note": "Same commune boundary as the establishment counts in this file. Three years older than the register stock.",
                     "source": PSRC})
write("fr-sirene-2026.json", {"id": "eucities-fr-sirene-2026",
    "source": {**SRC, "table": "stock-stocketablissement-parquet.parquet, file of 1 October 2026 (https://static.data.gouv.fr/resources/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/20261001-073823/stock-stocketablissement-parquet.parquet); counts made by grouping the file, script /srv/atlas/runs/data-eucities/scripts/fr_counts.py",
               "licence": "Licence Ouverte / Open Licence 2.0 (Etalab)"},
    "retrieved": RETRIEVED, "rows": rows})
