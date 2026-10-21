import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/se/"
SCB = "Statistiska centralbyrån (SCB), Statistics Sweden"
U = "https://api.scb.se/OV0104/v1/doris/en/ssd/"
S1 = {"publisher": SCB, "title": "Number of working sites (local kind-of-activity unit) according to Structural Business Statistics by region, industrial classification (NACE Rev. 2), year and observations (NSEBasfaktaLVEngs07)", "url": U + "NV/NV0109/NV0109P/NSEBasfaktaLVEngs07"}
S2 = {"publisher": SCB, "title": "Population by region, year and observations (BefolkningNy)", "url": U + "BE/BE0101/BE0101A/BefolkningNy"}
rows = []
KEEP = {"Total_A-SexklK-O": ("all", "NACE Rev. 2 A-S excluding K, O, T, U (all NACE in the structural business statistics)"),
        "A21_I-55-56": (None, "NACE Rev. 2 section I-55-56 accommodation and food service activities"),
        "A21_S-94-96": (None, "NACE Rev. 2 section S-94-96 other service activities")}
for x in json.load(open(D + "sbs.json"))["data"]:
    reg, sni, y = x["key"]
    if sni not in KEEP: continue
    trade, cls = KEEP[sni]
    r = {"item": "business_count", "officialClass": cls, "geo": {"level": "region", "code": "SE-AB", "name": "Stockholms län (Stockholm county)"},
         "value": int(x["values"][0]), "unit": "working sites", "year": y,
         "measure": "number of working sites (local kind-of-activity units) in the structural business statistics, by county",
         "note": "The county holding Stockholm, 26 municipalities, wider than the city. The open regional table stops at county and NACE section: no municipal or class count is published.",
         "source": S1}
    if trade: r["trade"] = trade
    rows.append(r)
for x in json.load(open(D + "pop.json"))["data"]:
    reg, y = x["key"]
    geo = {"level": "city", "code": "0180", "name": "Stockholm (kommun)"} if reg == "0180" else {"level": "region", "code": "SE-AB", "name": "Stockholms län (Stockholm county)"}
    rows.append({"item": "population", "geo": geo, "value": int(x["values"][0]), "unit": "persons", "year": y, "measure": "population on 31 December 2024",
                 "note": "The county row shares the boundary and year of the working-site rows; the municipality row is the city alone.", "source": S2})
write("se-scb-2024.json", {"id": "eucities-se-scb-2024",
    "source": {"publisher": SCB, "title": "Statistical database: structural business statistics by county; population", "url": "https://www.statistikdatabasen.scb.se/",
               "table": "PxWeb API " + U + ", NSEBasfaktaLVEngs07 (2024, updated 2026-05-13), BefolkningNy (31 December 2024)",
               "licence": "CC BY 4.0 (Statistics Sweden open data), https://www.scb.se/en/services/open-data-api/"},
    "retrieved": RETRIEVED, "rows": rows})
