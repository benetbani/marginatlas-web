"""DESNZ weekly road fuel prices: UK average diesel (ULSD) pump price, the latest week."""
import csv, os, urllib.request
from spines_lib import DL, RETRIEVED, write

URL = "https://assets.publishing.service.gov.uk/media/6acd0403ec9d3aba1e013c7b/CSV__2018_-__.csv"
path = os.path.join(DL, "uk", "roadfuel.csv")
if not os.path.exists(path):
    open(path, "wb").write(urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})).read())
rows_c = list(csv.reader(open(path, encoding="utf-8-sig")))
head, last = rows_c[0], rows_c[-1]
d, m, y = last[0].split("/")
week = f"{y}-{m}-{d}"
pump, duty, vat = float(last[2]), float(last[4]), float(last[6])
rows = [{"item": "diesel_price", "officialClass": "Ultra low sulphur diesel (ULSD)",
         "geo": {"level": "country", "code": "GB", "name": "United Kingdom"}, "value": pump, "unit": "GBP pence per litre", "year": week,
         "measure": f"average UK pump price of diesel, all taxes included, week of {week}",
         "note": f"Of which fuel duty {duty} pence a litre and VAT at {vat:g} percent (both in the same row); a business registered for VAT recovers the VAT."}]
write("business", "desnz-road-fuel-diesel.json", {
    "id": "desnz-road-fuel-diesel",
    "source": {"publisher": "Department for Energy Security and Net Zero", "title": "Weekly road fuel prices",
               "url": "https://www.gov.uk/government/statistics/weekly-road-fuel-prices",
               "table": "CSV 2018 onwards (" + URL + "), column 'ULSD (Ultra low sulphur diesel) Pump price in pence/litre', the latest week",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
