import json, sys, zipfile, io, csv, collections
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/be/"
STB = "Statbel (Belgian statistical office)"
SV = {"publisher": STB, "title": "Enterprises subject to VAT according to legal form, 2024 (TF_VAT_NACE_2024)", "url": "https://statbel.fgov.be/sites/default/files/files/opendata/btw-plichtige/rechtsvorm/TF_VAT_NACE_2024.zip"}
SP = {"publisher": STB, "title": "Population by place of residence, nationality, marital status, age and sex, 1 January 2025 (TF_SOC_POP_STRUCT_2025)",
      "url": "https://statbel.fgov.be/sites/default/files/files/opendata/bevolking%20naar%20woonplaats%2C%20nationaliteit%20burgelijke%20staat%20%2C%20leeftijd%20en%20geslacht/TF_SOC_POP_STRUCT_2025.zip"}
GEO = {"21004": {"level": "city", "code": "21004", "name": "Bruxelles / Brussel (City of Brussels, commune)"},
       "R04000": {"level": "metro", "code": "BE-BRU", "name": "Région de Bruxelles-Capitale / Brussels Hoofdstedelijk Gewest (19 communes)"}}
a = json.load(open(D + "agg.json"))
TR = {"TOT": "all", "56101": "restaurants", "56301": "cafes", "96021": "barbershops"}
MEAS = "number of enterprises subject to VAT, by the commune of the registered office, active on 31 December 2024 (MS_NUM_VAT)"
rows = []
for k, v in sorted(a["counts"].items()):
    g, n = k.split("|")
    cls = "NACE-BEL 2008, all activities" if n == "TOT" else "NACE-BEL 2008 " + a["labels"][n].split(" | ")[0] + " (" + a["labels"][n].split(" | ")[1].split(" ", 1)[1] + ")"
    note = "Counted at the registered office, not each premises. VAT-liable enterprises only: activities exempt from VAT are missing."
    if g == "R04000": note = "The Brussels-Capital Region, the 19 communes. " + note
    if n == "96021": note += " Hairdressing, barbers included."
    r = {"item": "business_count", "officialClass": cls, "geo": GEO[g], "value": v, "unit": "VAT-registered enterprises", "year": "2024", "measure": MEAS, "note": note, "source": SV}
    if n in TR: r["trade"] = TR[n]
    rows.append(r)
z = zipfile.ZipFile(D + "pop25.zip"); c = collections.Counter()
for r in csv.DictReader(io.TextIOWrapper(z.open(z.namelist()[0]), encoding="utf-8-sig"), delimiter="|"):
    if r["CD_REFNIS"] == "21004": c["21004"] += int(r["MS_POPULATION"])
    if r["CD_RGN_REFNIS"] == "04000": c["R04000"] += int(r["MS_POPULATION"])
for g, v in c.items():
    rows.append({"item": "population", "geo": GEO[g], "value": v, "unit": "persons", "year": "2025", "measure": "population on 1 January 2025 (the sum of the file's cells for the area)",
                 "note": "Same boundary as the VAT rows of this file; 1 January 2025 is the day after their stock date.", "source": SP})
write("be-statbel-2024.json", {"id": "eucities-be-statbel-2024",
    "source": {"publisher": STB, "title": "Statbel open data: enterprises subject to VAT; population structure", "url": "https://statbel.fgov.be/en/open-data",
               "table": "TF_VAT_NACE_2024.txt (CD_MUNTY_REFNIS 21004, CD_RGN_REFNIS 04000, CD_NACE 5-digit, MS_NUM_VAT); TF_SOC_POP_STRUCT_2025.txt",
               "licence": "Statbel open data licence (free reuse with the source given), see https://statbel.fgov.be/en/open-data"},
    "retrieved": RETRIEVED, "rows": rows})
