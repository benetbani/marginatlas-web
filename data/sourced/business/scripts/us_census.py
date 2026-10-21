import csv, json, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
from us_cities import US
DL = "/srv/atlas/runs/data-business/dl/us/"
TRADE = {"722511": "restaurants", "722515": "cafes", "812111": "barbershops"}
EC_NAICS = {"722511", "722513", "722515", "812111", "812112"}
LAB2CITY = {v[1]: k for k, v in US.items()}

# ---------- 2022 Economic Census, by city ----------
rows = []
seen = set()
for f, sector in (("EC2272BASIC.dat", "72"), ("EC2281BASIC.dat", "81")):
    F = open(DL + f.replace(".dat", "_FIELDS.txt")).read().split("\n")[1:]
    cols = [l.split("|")[0] for l in F if l]
    for line in open(DL + f, encoding="latin-1"):
        if line.startswith("#"):
            continue
        p = dict(zip(cols, line.rstrip("\n").split("|")))
        if p["GEOTYPE"] not in ("04", "05") or p["GEO_LABEL"] not in LAB2CITY or p["NAICS2022"] not in EC_NAICS:
            continue
        if p.get("TAXSTAT_LABEL", "All establishments") != "All establishments":
            continue
        key = (p["GEO_LABEL"], p["NAICS2022"])
        assert key not in seen, key
        seen.add(key)
        slug = LAB2CITY[p["GEO_LABEL"]]
        geo = {"level": "city", "code": p["GEO_ID"], "name": p["GEO_LABEL"]}
        cls = f"NAICS 2022 {p['NAICS2022']}: {p['NAICS2022_LABEL']}"
        base = {"officialClass": cls, "geo": geo, "year": "2022"}
        if p["NAICS2022"] in TRADE:
            base["trade"] = TRADE[p["NAICS2022"]]
        num = lambda k: int(p[k]) if p[k] != "" and p[k + "_F"] == "" else None
        est, rcp, pay, emp = num("ESTAB"), num("RCPTOT"), num("PAYANN"), num("EMP")
        extra = " Barber shops only (beauty salons are NAICS 812112)." if p["NAICS2022"] == "812111" else ""
        if est is not None:
            rows.append({**base, "item": "business_count", "value": est, "unit": "employer establishments",
                         "measure": "number of establishments with paid employees (nonemployer businesses excluded)",
                         "note": f"Place {p['GEO_LABEL']}.{extra}"})
        if est and rcp is not None:
            rows.append({**base, "item": "sales_per_business", "value": int(round(rcp * 1000 / est, -2)), "unit": "USD",
                         "measure": "mean sales, value of shipments or revenue per employer establishment (receipts divided by establishments), rounded to 100 USD",
                         "note": f"Receipts {rcp} thousand USD over {est} employer establishments.{extra}"})
        if rcp and pay is not None:
            rows.append({**base, "item": "staff_cost_share", "value": round(100 * pay / rcp, 1), "unit": "percent of receipts",
                         "measure": "annual payroll divided by receipts (payroll excludes employer social charges and benefits)",
                         "note": f"Annual payroll {pay} thousand USD over receipts {rcp} thousand USD. Not comparable one-to-one with European employee benefits expense.{extra}"})
        if est and emp is not None:
            rows.append({**base, "item": "persons_per_business", "value": round(emp / est, 1), "unit": "employees per establishment",
                         "measure": "mean paid employees per employer establishment (pay period including March 12; owners not counted)",
                         "note": f"{emp} employees over {est} employer establishments.{extra}"})
missing = set(US) - {LAB2CITY[k[0]] for k in seen}
print("EC cities missing:", missing)
write("us-economic-census-2022.json", {
    "id": "us-economic-census-2022",
    "source": {"publisher": "U.S. Census Bureau", "title": "2022 Economic Census, Selected statistics by geography and industry (EC2272BASIC, EC2281BASIC)",
               "url": "https://www2.census.gov/programs-surveys/economic-census/data/2022/sector72/EC2272BASIC.zip",
               "table": "ECNBASIC2022.EC2272BASIC and EC2281BASIC (https://data.census.gov/table/ECNBASIC2022.EC2272BASIC); sector 81 file https://www2.census.gov/programs-surveys/economic-census/data/2022/sector81/EC2281BASIC.zip; cells flagged D (withheld to avoid disclosure) are not written",
               "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"},
    "retrieved": RETRIEVED, "rows": rows})

# ---------- County names and populations ----------
CO = {}
for r in csv.DictReader(open(DL + "co-est2025-alldata.csv", encoding="latin-1")):
    if r["SUMLEV"] == "050":
        CO[(r["STATE"], r["COUNTY"])] = (f"{r['CTYNAME']}, {r['STNAME']}", int(r["POPESTIMATE2025"]))

# ---------- CBP 2023 and NES 2023, by county ----------
CBP_N = {"------": "all", "722511": "restaurants", "722513": None, "722515": "cafes", "812111": "barbershops", "812112": None}
NES_N = {"00": "all", "722511": "restaurants", "722513": None, "722515": "cafes", "812111": "barbershops", "812112": None}
LABEL = {"------": "Total for all sectors", "00": "Total for all sectors", "722511": "Full-service restaurants", "722513": "Limited-service restaurants",
         "722515": "Snack and nonalcoholic beverage bars", "812111": "Barber shops", "812112": "Beauty salons"}
want = {(US[s][0], c): s for s in US for c in US[s][2]}
crow = []
CBP_SRC = {"publisher": "U.S. Census Bureau", "title": "County Business Patterns 2023, county file (cbp23co)",
           "url": "https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23co.zip"}
NES_SRC = {"publisher": "U.S. Census Bureau", "title": "Nonemployer Statistics 2023, county file (nonemp23co)",
           "url": "https://www2.census.gov/programs-surveys/nonemployer-statistics/datasets/2023/historical-datasets/nonemp23co.zip"}
def cgeo(st, c):
    return {"level": "county", "code": st + c, "name": CO[(st, c)][0]}
for r in csv.DictReader(open(DL + "cbp23co.txt", encoding="latin-1")):
    k = (r["fipstate"], r["fipscty"])
    if k not in want or r["naics"] not in CBP_N:
        continue
    n = r["naics"]
    cls = "NAICS 2017: " + LABEL[n] + ("" if n.startswith("-") else f" ({n})")
    row = {"item": "business_count", "officialClass": cls, "geo": cgeo(*k), "value": int(r["est"]), "unit": "employer establishments",
           "year": "2023", "measure": "number of establishments with paid employees, week of March 12",
           "note": f"County containing the city of {want[k]} (site slug)." + (" One of the five counties (boroughs) of New York City." if want[k] == "new-york" else ""),
           "source": CBP_SRC}
    if CBP_N[n]: row["trade"] = CBP_N[n]
    crow.append(row)
for r in csv.DictReader(open(DL + "nonemp23co.txt", encoding="latin-1")):
    k = (r["ST"], r["CTY"])
    if k not in want or r["NAICS"] not in NES_N:
        continue
    n = r["NAICS"]
    if r["ESTAB_F"] or r["ESTAB"] == "":
        continue
    est = int(r["ESTAB"])
    cls = "NAICS 2022: " + LABEL[n] + ("" if n == "00" else f" ({n})")
    note = f"County containing the city of {want[k]} (site slug)." + (" One of the five counties (boroughs) of New York City." if want[k] == "new-york" else "")
    base = {"officialClass": cls, "geo": cgeo(*k), "year": "2023", "source": NES_SRC}
    if NES_N[n]: base["trade"] = NES_N[n]
    crow.append({**base, "item": "business_count", "value": est, "unit": "nonemployer businesses",
                 "measure": "number of businesses with no paid employees and receipts of 1,000 USD or more (mostly sole proprietors)", "note": note})
    if r["RCPTOT"] and not r["RCPTOT_F"] and est:
        rc = int(r["RCPTOT"])
        crow.append({**base, "item": "sales_per_business", "value": int(round(rc * 1000 / est, -2)), "unit": "USD",
                     "measure": "mean receipts per nonemployer business (receipts divided by businesses), rounded to 100 USD",
                     "note": note + f" Receipts {rc} thousand USD over {est} nonemployer businesses."})
write("us-cbp-nes-2023.json", {
    "id": "us-cbp-nes-2023",
    "source": {**CBP_SRC, "table": "cbp23co (employer establishments) and nonemp23co (nonemployer businesses), the principal county of each US city the site holds (the five boroughs for New York City)",
               "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"},
    "retrieved": RETRIEVED, "rows": crow})

# ---------- populations ----------
pop = []
SUB = list(csv.DictReader(open(DL + "sub-est2025.csv", encoding="latin-1")))
POPSRC = {"publisher": "U.S. Census Bureau", "title": "City and Town Population Totals: 2020-2025 (Vintage 2025, sub-est2025)",
          "url": "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/cities/totals/sub-est2025.csv"}
COSRC = {"publisher": "U.S. Census Bureau", "title": "County Population Totals: 2020-2025 (Vintage 2025, co-est2025-alldata)",
         "url": "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/counties/totals/co-est2025-alldata.csv"}
for s, (st, lab, cos) in US.items():
    name = lab.rsplit(",", 1)[0]
    m = [r for r in SUB if r["STATE"] == st and r["NAME"] == name and r["SUMLEV"] in ("162", "170", "172")]
    if not m and name.endswith(" metropolitan government"):
        m = []
    sel = [r for r in m if r["SUMLEV"] == "170"] or [r for r in m if r["SUMLEV"] == "162"] or m
    if not sel:
        print("NO POP", s, name); continue
    r = sel[0]
    ecid = next(x["geo"]["code"] for x in rows if x["geo"]["name"] == lab)
    pop.append({"item": "population", "geo": {"level": "city", "code": ecid, "name": lab},
                "value": int(r["POPESTIMATE2025"]), "unit": "persons", "year": "2025",
                "measure": "resident population estimate, 1 July 2025 (Vintage 2025)",
                "note": f"Same place as the city rows of us-economic-census-2022.json (population estimates place code {st}{r['PLACE'] if r['SUMLEV'] == '162' else r['CONCIT']})." + (" Consolidated city (whole)." if r["SUMLEV"] == "170" else ""),
                "source": POPSRC})
    for c in cos:
        pop.append({"item": "population", "geo": cgeo(st, c), "value": CO[(st, c)][1], "unit": "persons", "year": "2025",
                    "measure": "resident population estimate, 1 July 2025 (Vintage 2025)",
                    "note": "Same county as the rows of us-cbp-nes-2023.json.", "source": COSRC})
json.dump(pop, open("/srv/atlas/runs/data-business/pop_US.json", "w"), indent=1)
print(len(pop), "pop rows")
