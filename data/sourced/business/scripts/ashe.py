import re, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
D = "/srv/atlas/runs/data-business/dl/uk/ashe/ashetable152025provisional/ASHE Table 15 (4) 2025 Provisional/"
F = D + "PROV - Work Region Occupation SOC20 (4) Table 15 (4).6a   Hourly pay - Excluding overtime 2025.xlsx"
FCV = D + "PROV - Work Region Occupation SOC20 (4) Table 15 (4).6b   Hourly pay - Excluding overtime 2025 CV.xlsx"
SOC = {"1222": "restaurants", "5434": "restaurants", "5435": "restaurants", "5436": "restaurants", "9263": "restaurants", "9264": "restaurants",
       "9261": None, "9265": None, "9266": "cafes", "6221": "barbershops", "1253": "barbershops", "6222": None}
def read(f):
    out = {}
    for r in openpyxl.load_workbook(f, read_only=True)["All"].iter_rows(values_only=True):
        s = str(r[0] or "").strip()
        m = re.match(r"(London|United Kingdom), (.+)", s)
        if m and str(r[1]) in SOC:
            out[(m.group(1), str(r[1]))] = (m.group(2), r)
    return out
val, cv = read(F), read(FCV)
rows = []
for (place, code), (occ, r) in sorted(val.items()):
    med = r[3]
    if not isinstance(med, (int, float)):
        continue
    c = cv.get((place, code), (None, [None] * 4))[1][3]
    if not isinstance(c, (int, float)):
        print("skipped, no CV for the median:", place, code, occ); continue
    q = "" if not isinstance(c, (int, float)) else (f" Coefficient of variation {c} percent (" + ("precise" if c <= 5 else "reasonably precise" if c <= 10 else "acceptable") + ").")
    geo = {"level": "region", "code": "TLI", "name": "London"} if place == "London" else {"level": "country", "code": "GB", "name": "United Kingdom"}
    row = {"item": "pay_hourly", "officialClass": f"SOC 2020 {code}: {occ}", "geo": geo, "value": med, "unit": "GBP per hour",
           "year": "2025", "measure": f"median gross hourly pay excluding overtime, all employee jobs, April 2025 (provisional): {occ}",
           "note": f"Employees only, by place of work; self-employed workers are not covered.{q} Mean {r[5]} GBP."}
    if SOC[code]: row["trade"] = SOC[code]
    rows.append(row)
write("ons-ashe-2025.json", {
    "id": "ons-ashe-2025",
    "source": {"publisher": "Office for National Statistics", "title": "Annual Survey of Hours and Earnings (ASHE) 2025 provisional, Table 15: region by occupation (4-digit SOC 2020), table 15 (4).6a hourly pay excluding overtime",
               "url": "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/regionbyoccupation4digitsoc2010ashetable15",
               "table": "ashetable152025provisional.zip, file 'Table 15 (4).6a Hourly pay - Excluding overtime 2025', sheet All; quality from table 15 (4).6b (CV); estimates with CV above 20 percent are suppressed by the publisher",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
for x in rows: print(x["geo"]["code"], x.get("trade"), x["officialClass"], x["value"], x["note"][-60:])
