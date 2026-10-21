import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
UK = {"publisher": "GOV.UK (HM Government)", "title": "National Minimum Wage and National Living Wage rates", "url": "https://www.gov.uk/national-minimum-wage-rates"}
LA = {"publisher": "City of Los Angeles, Bureau of Contract Administration, Office of Wage Standards",
      "title": "July 1, 2026 Minimum Wage Ordinance wage rate increase (memo of January 30, 2026)",
      "url": "https://wagesla.lacity.gov/sites/g/files/wph1941/files/2026-04/2026%20MWR%20Increase%20Memo%2001-30-26%20ADA%20Final.pdf"}
HU = {"publisher": "Nemzeti Jogszabálytár (Hungarian national legislation database)",
      "title": "426/2025. (XII. 23.) Korm. rendelet a kötelező legkisebb munkabér (minimálbér) és a garantált bérminimum megállapításáról",
      "url": "https://njt.jog.gov.hu/jogszabaly/2025-426-20-22"}
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
HUG = {"level": "country", "code": "HU", "name": "Hungary"}
rows = []
for band, v, label in (("21 and over", 12.71, "National Living Wage"), ("18 to 20", 10.85, "National Minimum Wage"),
                       ("under 18", 8.0, "National Minimum Wage"), ("apprentice", 8.0, "National Minimum Wage, apprentice rate")):
    rows.append({"item": "minimum_wage", "geo": GB, "value": v, "unit": "GBP per hour", "year": "2026-04-01",
                 "measure": f"statutory minimum hourly rate, workers aged {band}" if band != "apprentice" else "statutory minimum hourly rate, apprentices",
                 "note": f"{label}, in force from 1 April 2026. The rates change on 1 April every year." + (" Apprentices: aged under 19, or 19 and over in the first year of the apprenticeship." if band == "apprentice" else ""),
                 "source": UK})
rows.append({"item": "minimum_wage", "geo": {"level": "city", "code": "E600000US0603744000", "name": "Los Angeles city, California"},
             "value": 18.42, "unit": "USD per hour", "year": "2026-07-01",
             "measure": "City of Los Angeles minimum wage, hourly, from 1 July 2026",
             "note": "Applies to employees who work at least two hours a week within the City's boundaries; raised by 0.55 USD on 1 July 2026, indexed each 1 July to the local consumer price index (Los Angeles Municipal Code 187.02(d)).",
             "source": LA})
for v, unit, per in ((322800, "HUF per month", "monthly"), (74210, "HUF per week", "weekly"), (14850, "HUF per day", "daily"), (1856, "HUF per hour", "hourly")):
    rows.append({"item": "minimum_wage", "geo": HUG, "value": v, "unit": unit, "year": "2026-01-01",
                 "measure": f"statutory minimum wage (minimálbér), full-time, {per} rate, from 1 January 2026",
                 "note": "Government Decree 426/2025. (XII. 23.), section 2(1).", "source": HU})
for v, unit, per in ((373200, "HUF per month", "monthly"), (85800, "HUF per week", "weekly"), (17160, "HUF per day", "daily"), (2145, "HUF per hour", "hourly")):
    rows.append({"item": "minimum_wage", "geo": HUG, "value": v, "unit": unit, "year": "2026-01-01",
                 "measure": f"guaranteed wage minimum (garantált bérminimum), full-time, {per} rate, from 1 January 2026",
                 "note": "For jobs that require at least a secondary school education or a secondary vocational qualification. Government Decree 426/2025. (XII. 23.), section 2(2).",
                 "source": HU})
rows.append({"item": "minimum_wage", "geo": {"level": "country", "code": "IT", "name": "Italy"}, "value": None, "unit": "EUR per month", "year": "2026",
             "measure": "statutory minimum wage",
             "note": "Italy has no statutory minimum wage. Pay floors are set by national collective agreements per sector (for restaurants and bars, the contract for pubblici esercizi, ristorazione collettiva e commerciale e turismo); the agreement's own pay table could not be read from its text, so no floor is given here.",
             "source": {"publisher": "Eurostat", "title": "Monthly minimum wages, bi-annual data (earn_mw_cur): no value for Italy, which has no national minimum wage (series flag m)",
                        "url": "https://ec.europa.eu/eurostat/databrowser/view/earn_mw_cur/default/table"}})
write("minimum-wages-2026.json", {
    "id": "minimum-wages-2026",
    "source": {**UK, "table": "Each row names its government page: GOV.UK, the City of Los Angeles Office of Wage Standards, the Hungarian legislation database; Italy has none",
               "licence": "GOV.UK content: Open Government Licence v3.0; City of Los Angeles and Hungarian legislation: official public notices and legal text"},
    "retrieved": RETRIEVED, "rows": rows})
