"""ONS Annual Business Survey 2024 by employment size band: turnover share and turnover per enterprise, sections I and S and the total."""
import os, sys, urllib.request
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, write

PAGE = "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/datasets/uknonfinancialbusinesseconomyannualbusinesssurveyemploymentsizeband"
FILE = "https://www.ons.gov.uk/file?uri=/businessindustryandtrade/business/businessservices/datasets/uknonfinancialbusinesseconomyannualbusinesssurveyemploymentsizeband/current/abssizeband.xlsx"
path = os.path.join(DL, "abs_size.xlsx")
if not os.path.exists(path):
    open(path, "wb").write(urllib.request.urlopen(urllib.request.Request(FILE, headers={"User-Agent": "Mozilla/5.0"})).read())
wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
YEAR = 2024
BANDS = ["1 to 9", "10 to 49", "50 to 249", "250 and over"]
SECT = {"I": (["restaurants", "cafes"], "SIC 2007 section I: Accommodation and food service activities",
              "Section I holds hotels with restaurants, cafes, takeaways, pubs and bars: no division is published by size band."),
        "S": (["barbershops"], "SIC 2007 section S: Other service activities",
              "Section S holds hairdressing and beauty with repair, laundries, funeral and other services: no division is published by size band."),
        "A to S (part)": (["all"], "SIC 2007 sections A to S (part): the UK non-financial business economy", None)}
data = {}
for sheet in BANDS + ["Total"]:
    for r in wb[sheet].iter_rows(values_only=True):
        if r[0] in SECT and r[3] == YEAR:
            data[(r[0], sheet)] = (r[4], r[5])
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
rows = []
for code, (trades, cls, note) in SECT.items():
    ent_t, tur_t = data[(code, "Total")]
    for b in BANDS:
        ent, tur = data[(code, b)]
        for trade in trades:
            base = [note] if note else []
            base.append("Size bands use the business register's employment (the publisher's note 1).")
            rows.append({"item": "turnover_share_by_size", "trade": trade, "officialClass": cls, "geo": GB,
                         "value": round(100 * tur / tur_t, 1), "unit": "percent of the section's total turnover", "year": str(YEAR),
                         "measure": f"share of total turnover made by enterprises with {b} in employment",
                         "note": " ".join(base + [f"Derived: GBP {tur:,} million of GBP {tur_t:,} million total turnover."])})
            rows.append({"item": "sales_per_business_by_size", "trade": trade, "officialClass": cls, "geo": GB,
                         "value": round(tur * 1e6 / ent), "unit": "GBP per enterprise", "year": str(YEAR),
                         "measure": f"mean total turnover per enterprise, enterprises with {b} in employment",
                         "note": " ".join(base + [f"Derived: GBP {tur:,} million total turnover over {ent:,} enterprises."])})
write("business", "ons-abs-size-2024.json", {
    "id": "ons-abs-size-2024",
    "source": {"publisher": "Office for National Statistics",
               "title": "UK non-financial business economy, Annual Business Survey: employment size band",
               "url": PAGE, "table": "abssizeband.xlsx (released 26 May 2026), sheets '1 to 9', '10 to 49', '50 to 249', '250 and over', 'Total', year 2024, columns Number of enterprises and Total turnover",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
