"""Eurostat nama_10_fte: average full-time adjusted salary per employee, national, 2023 and 2024."""
import os, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

URL = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10_fte?sinceTimePeriod=2023"
path = os.path.join(DL, "fte.json")
urllib.request.urlretrieve(URL, path)
EURO = {"AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "EL", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"}
NAC = {"HU": "HUF", "PL": "PLN", "CZ": "CZK", "SE": "SEK", "DK": "DKK", "RO": "RON", "NO": "NOK", "IS": "ISK", "CH": "CHF"}
rows = []
for k, v, s, lab in jsonstat(path):
    g = k["geo"]
    if k["unit"] == "NAC" and (g in EURO or g.startswith(("EU", "EA"))):
        continue
    cur = "EUR" if k["unit"] == "EUR" else NAC.get(g, "national currency")
    n = ["National accounts: wages and salaries divided by employees in full-time equivalents (part-time jobs counted as fractions), so it reads as the mean pay of a full-time job, before tax and employee contributions."]
    if k["unit"] == "NAC":
        n.append("In the country's own currency as Eurostat publishes it.")
    fn = flagnote(s)
    if fn:
        n.append(fn)
    rows.append({"item": "average_wage", "officialClass": "All employees, total economy (full-time equivalent)", "geo": geo_eu(g, lab["geo"][g]),
                 "value": v, "unit": f"{cur} per year", "year": k["time"], "currency": k["unit"],
                 "measure": f"average full-time adjusted gross annual salary per employee, {k['time']} (a mean)", "note": " ".join(n)})
write("business", "eurostat-fte-salary.json", {
    "id": "eurostat-fte-salary",
    "source": {"publisher": "Eurostat", "title": "Average full time adjusted salary per employee (nama_10_fte)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/nama_10_fte/default/table",
               "table": "nama_10_fte, unit EUR (and NAC outside the euro), 2023 and 2024",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
