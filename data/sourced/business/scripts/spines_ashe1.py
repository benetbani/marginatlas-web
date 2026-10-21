"""ONS ASHE 2025 provisional, table 1.7a: gross annual pay of full-time employee jobs, UK, median and mean."""
import os, sys, urllib.request, zipfile
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, write

URL = "https://www.ons.gov.uk/file?uri=/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/allemployeesashetable1/2025provisional/ashetable12025provisional.zip"
z = os.path.join(DL, "uk", "ashe1.zip")
if not os.path.exists(z):
    open(z, "wb").write(urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})).read())
NAME = "PROV - Total Table 1.7a   Annual pay - Gross 2025.xlsx"
out = os.path.join(DL, "uk", "ashe1_7a.xlsx")
open(out, "wb").write(zipfile.ZipFile(z).read(NAME))
rows_x = list(openpyxl.load_workbook(out, read_only=True, data_only=True)["Full-Time"].iter_rows(values_only=True))
r = next(x for x in rows_x if x[0] == "All Employees")
jobs, median, mean = r[2], r[3], r[5]
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
NOTE = ("Full-time employee jobs on adult rates, in the same job for more than a year, April 2025 (provisional); "
        f"{jobs:,} thousand jobs. Employees only, the self-employed not covered.")
rows = [{"item": "average_wage", "officialClass": "All employees, full-time", "geo": GB, "value": median, "unit": "GBP per year",
         "year": "2025", "measure": "median gross annual pay of full-time employees, UK, tax year to April 2025", "note": NOTE},
        {"item": "average_wage", "officialClass": "All employees, full-time", "geo": GB, "value": mean, "unit": "GBP per year",
         "year": "2025", "measure": "mean gross annual pay of full-time employees, UK, tax year to April 2025", "note": NOTE}]
write("business", "ons-ashe-annual-2025.json", {
    "id": "ons-ashe-annual-2025",
    "source": {"publisher": "Office for National Statistics", "title": "Annual Survey of Hours and Earnings (ASHE) 2025 provisional, Table 1: all employees",
               "url": "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/allemployeesashetable1",
               "table": "ashetable12025provisional.zip, file '" + NAME + "', sheet Full-Time, row All Employees, columns Median and Mean",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
