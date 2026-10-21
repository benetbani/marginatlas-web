import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
wb = openpyxl.load_workbook("/srv/atlas/runs/data-business/dl/uk/bd2024.xlsx", read_only=True)
TR = {"561": "restaurants", "563": "cafes", "960": "barbershops", "Total": "all"}
NOTE = {"561": "Group 56.1: restaurants, cafes and takeaways together.", "563": "Group 56.3: beverage serving (pubs, bars, clubs).",
        "960": "Group 96.0: all other personal services (hairdressing and beauty, laundries, funeral, wellbeing and others).",
        "Total": "All industries."}
rows = []
for sheet, born in (("Table 5.2a", 2019), ("Table 5.2b", 2020), ("Table 5.2c", 2021), ("Table 5.2d", 2022), ("Table 5.2e", 2023)):
    for r in wb[sheet].iter_rows(values_only=True):
        if not r or not r[0]:
            continue
        lab = str(r[0]).strip()
        code = lab.split(" : ")[0]
        if code not in TR:
            continue
        births = r[1]
        for age in (1, 2, 3, 5):
            surv = r[2 * age]
            if not isinstance(surv, (int, float)) or not births:
                continue
            rows.append({"item": f"survival_{age}y", "trade": TR[code],
                         "officialClass": "All industries (Total)" if code == "Total" else f"SIC 2007 group {lab}",
                         "geo": {"level": "country", "code": "GB", "name": "United Kingdom"},
                         "value": round(100 * surv / births, 1), "unit": "percent of enterprises born", "year": str(born + age),
                         "measure": f"{age}-year survival rate of enterprises born in {born} (reference year {born + age})",
                         "note": f"{NOTE[code]} {surv} of {births} enterprises born in {born} still active {age} year{'s' if age > 1 else ''} later (counts rounded to 5 by the publisher). No London figure by industry is published."})
write("ons-business-demography-2024.json", {
    "id": "ons-business-demography-2024",
    "source": {"publisher": "Office for National Statistics", "title": "Business demography, UK: 2024, reference tables (businessdemographyexceltables2024.xlsx), tables 5.2a to 5.2e",
               "url": "https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/datasets/businessdemographyreferencetable",
               "table": "Tables 5.2a-5.2e, survival of newly born enterprises by SIC 2007 group, births 2019 to 2023; published 20 November 2025",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
for x in rows:
    if x["year"] == "2024": print(x["trade"], x["item"], x["value"])
