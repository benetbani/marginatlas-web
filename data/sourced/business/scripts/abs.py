import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
DL = "/srv/atlas/runs/data-business/dl/uk/"
GORM = ("gross operating rate, derived: approximate gross value added minus total employment costs, as a share of total turnover "
        "(before the owner's own pay, depreciation, interest and tax; the survey publishes no operating surplus itself)")
rows = []
def shares(base, tur, agva, pur, emp, note):
    if isinstance(pur, (int, float)) and tur:
        rows.append({**base, "item": "purchases_share", "value": round(100 * pur / tur, 1), "unit": "percent of turnover",
                     "measure": "total purchases of goods, materials and services divided by total turnover",
                     "note": f"{note} Purchases {pur} million GBP over turnover {tur} million GBP."})
    if isinstance(emp, (int, float)) and tur:
        rows.append({**base, "item": "staff_cost_share", "value": round(100 * emp / tur, 1), "unit": "percent of turnover",
                     "measure": "total employment costs (wages, salaries, employer social contributions and pensions) divided by total turnover",
                     "note": f"{note} Employment costs {emp} million GBP over turnover {tur} million GBP."})
    if isinstance(agva, (int, float)) and isinstance(emp, (int, float)) and tur:
        rows.append({**base, "item": "gross_operating_rate", "value": round(100 * (agva - emp) / tur, 1), "unit": "percent of turnover",
                     "measure": GORM, "note": f"{note} aGVA {agva} million GBP minus employment costs {emp} million GBP, over turnover {tur} million GBP."})

UKSRC = {"publisher": "Office for National Statistics", "title": "Non-financial business economy, UK: Sections A to S (Annual Business Survey), 2024 results",
         "url": "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/datasets/uknonfinancialbusinesseconomyannualbusinesssurveysectionsas"}
RGSRC = {"publisher": "Office for National Statistics", "title": "Non-financial business economy, UK and regional (Annual Business Survey): Sections A to S, regional results 2024",
         "url": "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/datasets/uknonfinancialbusinesseconomyannualbusinesssurveyregionalresultssectionsas"}
UKC = {"A-S (part)": "all", "56.1": "restaurants", "56.3": "cafes", "96.02": "barbershops", "56": None, "96": None}
wb = openpyxl.load_workbook(DL + "abssectionsas.xlsx", read_only=True)
for sh in ("Sections A to S", "Section I", "Section S"):
    for r in wb[sh].iter_rows(values_only=True):
        sic = str(r[0]).strip() if r[0] else ""
        if r[2] != 2024 or sic not in UKC or (sh == "Sections A to S" and sic != "A-S (part)"):
            continue
        desc = r[1].strip()
        ent, tur, agva, pur, emp = r[3], r[4], r[5], r[6], r[7]
        base = {"officialClass": f"SIC 2007 {sic}: {desc}", "geo": {"level": "country", "code": "GB", "name": "United Kingdom"},
                "year": "2024", "source": UKSRC}
        if UKC[sic]: base["trade"] = UKC[sic]
        note = "UK non-financial business economy." if sic == "A-S (part)" else ""
        if sic == "56.3": note = "Beverage serving: pubs, bars and clubs (UK cafes sit inside 56.1)."
        if sic == "96.02": note = "Barbers are not separate from hairdressing and beauty."
        if sic == "56.1": note = "Restaurants, cafes and takeaways (group 56.1, one class 56.10)."
        rows.append({**base, "item": "business_count", "value": ent, "unit": "enterprises", "measure": "number of enterprises", "note": note or "UK."})
        rows.append({**base, "item": "sales_per_business", "value": int(round(tur * 1e6 / ent, -2)), "unit": "GBP",
                     "measure": "mean total turnover per enterprise (turnover divided by enterprises), rounded to 100 GBP",
                     "note": f"{note} Turnover {tur} million GBP over {ent} enterprises.".strip()})
        shares(base, tur, agva, pur, emp, note)
RC = {"A to S (Exc K)": "all", "56": None, "96": None}
wb = openpyxl.load_workbook(DL + "absregional2024.xlsx", read_only=True)
for sh in wb.sheetnames[3:]:
    if sh in ("All Regions", "Great Britain", "England", "United Kingdom"):
        continue
    for r in wb[sh].iter_rows(values_only=True):
        sic = str(r[0]).strip() if r[0] else ""
        if r[4] != 2024 or sic not in RC:
            continue
        code, name = r[2], r[3]
        lvl = "country" if name in ("United Kingdom", "England", "Wales", "Scotland", "Northern Ireland", "Great Britain") else "region"
        if name == "United Kingdom":
            continue  # the UK lines come from the UK tables above
        base = {"officialClass": f"SIC 2007 {sic}: {r[1].strip()}", "geo": {"level": lvl, "code": code, "name": name + (" (Greater London)" if name == "London" else "")},
                "year": "2024", "source": RGSRC}
        if sic == "56": base["trade"] = "restaurants"
        if sic == "96": base["trade"] = "barbershops"
        if RC[sic]: base["trade"] = RC[sic]
        note = {"56": "Whole division 56 (restaurants, cafes, takeaways, pubs, bars, catering).",
                "96": "Whole division 96 (hairdressing and beauty, laundries, funeral, wellbeing and others)."}.get(sic, "Non-financial business economy.")
        note += " Regional figures are apportioned from enterprise returns by employment."
        shares(base, r[5], r[6], r[7], r[8], note)
        if sic == "56":
            for x in [x for x in rows[-3:] if x["geo"]["code"] == code and x["officialClass"] == base["officialClass"]]:
                rows.append({**x, "trade": "cafes"})
write("ons-abs-2024.json", {
    "id": "ons-abs-2024",
    "source": {**UKSRC, "table": "abssectionsas.xlsx (released 26 May 2026), sheets Sections A to S, Section I, Section S; absregionalsectionas2024.xlsx (released 4 June 2026), one sheet per region; year 2024",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
for x in rows:
    if x["geo"]["code"] in ("GB", "TLI"): print(x["geo"]["code"], x.get("trade"), x["item"], x["value"], x["officialClass"][:40])
