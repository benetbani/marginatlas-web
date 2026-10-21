import csv, json, re, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
DL = "/srv/atlas/runs/data-business/dl/it/"
s = open(DL + "ateco.xml", encoding="utf-8").read()
def lab(code):
    m = re.search(r'<structure:Code id="%s"[^>]*>(.*?)</structure:Code>' % code, s, re.S)
    n = dict(re.findall(r'<common:Name xml:lang="(\w+)">([^<]*)', m.group(1)))
    return n["it"], n["en"]
COM = {"058091": "Roma", "015146": "Milano", "063049": "Napoli", "001272": "Torino", "048017": "Firenze"}
PROV = {"ITE43": "Roma", "ITC45": "Milano", "ITF33": "Napoli", "ITC11": "Torino", "ITE14": "Firenze"}
TR3 = {"0010": "all", "561": "restaurants", "563": "cafes"}
TR5 = {"0010": "all", "56101": "restaurants", "56300": "cafes", "9602": "barbershops"}
SRC3 = {"publisher": "ISTAT (Istituto Nazionale di Statistica)", "title": "Local units of active enterprises (ASIA local units), by comune and NACE 3-digit (183_1163_DF_DICA_ASIAULP_TERRIFDATA_3)",
        "url": "https://esploradati.istat.it/SDMXWS/rest/data/IT1,183_1163_DF_DICA_ASIAULP_TERRIFDATA_3,1.0/"}
SRC5 = {"publisher": "ISTAT (Istituto Nazionale di Statistica)", "title": "Local units of active enterprises (ASIA local units), by province and ATECO 5-digit (183_1163_DF_DICA_ASIAULP_TERRIFDATA_2)",
        "url": "https://esploradati.istat.it/SDMXWS/rest/data/IT1,183_1163_DF_DICA_ASIAULP_TERRIFDATA_2,1.0/"}
rows = []
for r in csv.DictReader(open(DL + "asia3.csv")):
    c, n = r["REF_AREA"], r["ECON_ACTIVITY_NACE_2007"]
    it, en = lab(n)
    note = f"Comune di {COM[c]}."
    if n == "561": note += " Includes takeaway and mobile food (ATECO 56.1), not only table-service restaurants."
    if n == "563": note += " The Italian bar is the cafe: coffee and drinks served without a kitchen."
    if n == "960": note += " Hairdressing and beauty cannot be separated at comune level: this is all other personal services."
    row = {"item": "business_count", "officialClass": "ATECO 2007 total" if n == "0010" else f"ATECO 2007 {n[:2]}.{n[2:]}: {it} ({en})",
           "geo": {"level": "city", "code": c, "name": f"{COM[c]} (comune)"}, "value": int(r["OBS_VALUE"]), "unit": "local units",
           "year": r["TIME_PERIOD"], "measure": "number of local units of active enterprises (premises), annual", "note": note, "source": SRC3}
    if n in TR3: row["trade"] = TR3[n]
    assert not r["OBS_STATUS"], r
    rows.append(row)
for r in csv.DictReader(open(DL + "asia5.csv")):
    c, n = r["REF_AREA"], r["ECON_ACTIVITY_NACE_2007"]
    if n not in TR5: continue
    it, en = lab(n)
    note = f"Province (città metropolitana) of {PROV[c]}, wider than the comune."
    if n == "9602": note += " Barbers are not separate: ATECO 96.02 is hairdressing and other beauty treatment together."
    if n == "56300": note += " The Italian bar is the cafe."
    code = n if len(n) < 5 else f"{n[:2]}.{n[2:4]}.{n[4:]}"
    row = {"item": "business_count", "officialClass": "ATECO 2007 total" if n == "0010" else f"ATECO 2007 {code if len(n)==5 else n[:2]+'.'+n[2:]}: {it}" + ("" if it == en else f" ({en})"),
           "geo": {"level": "metro", "code": c, "name": f"{PROV[c]} (province, città metropolitana)"}, "value": int(r["OBS_VALUE"]), "unit": "local units",
           "year": r["TIME_PERIOD"], "measure": "number of local units of active enterprises (premises), annual", "note": note, "source": SRC5}
    row["trade"] = TR5[n]
    rows.append(row)
write("istat-asia-2024.json", {
    "id": "istat-asia-2024",
    "source": {**SRC3, "table": "ASIA local units, DATA_TYPE LU, size class TOTAL, 2023 and 2024 (comune, NACE 3-digit) and 2024 (province, ATECO 5-digit); SDMX REST https://esploradati.istat.it/SDMXWS/rest; browser https://esploradati.istat.it/databrowser/",
               "licence": "Creative Commons Attribution 4.0 (CC BY 4.0), ISTAT legal notes https://www.istat.it/note-legali/"},
    "retrieved": RETRIEVED, "rows": rows})
pop = []
PSRC = {"publisher": "ISTAT (Istituto Nazionale di Statistica)", "title": "Resident population on 1st January (22_289_DF_DCIS_POPRES1_25 all municipalities; 22_289_DF_DCIS_POPRES1_1 provinces)",
        "url": "https://esploradati.istat.it/SDMXWS/rest/data/IT1,22_289_DF_DCIS_POPRES1_25,1.0/"}
for f, names, lvl, suffix in (("pop.csv", COM, "city", " (comune)"), ("popprov.csv", PROV, "metro", " (province, città metropolitana)")):
    for r in csv.DictReader(open(DL + f)):
        if r["SEX"] != "9" or r["AGE"] != "TOTAL" or r["MARITAL_STATUS"] != "99": continue
        c = r["REF_AREA"]
        pop.append({"item": "population", "geo": {"level": lvl, "code": c, "name": names[c] + suffix}, "value": int(r["OBS_VALUE"]),
                    "unit": "persons", "year": r["TIME_PERIOD"], "measure": f"resident population on 1 January {r['TIME_PERIOD']}",
                    "note": "Same boundary as the rows of istat-asia-2024.json.", "source": PSRC})
json.dump(pop, open("/srv/atlas/runs/data-business/pop_IT.json", "w"), indent=1)
print(len(pop))
