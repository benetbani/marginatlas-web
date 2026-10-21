"""ASHE 2025 provisional, Table 15 (4).1a, weekly gross pay, FULL-TIME employee jobs, by place of work in London, for the occupations
ons-ashe-2025.json reads hourly (the same table family, Table 15 by region and 4-digit SOC 2020). Written for the trade page's pay a
month (ruling 4 of 2026-10-20: weekly x 52 / 12, said "a month"; a job with no published weekly median stays an hour). The publisher
suppresses an estimate whose CV is above 20 percent ('x'); such a job gets no row here.
Run: python3 -I data/sourced/business/scripts/ashe_weekly.py <the unzipped Table 15 folder> (writes data/sourced/business/ons-ashe-weekly-2025.json)."""
import json, os, re, sys
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
D = sys.argv[1].rstrip("/") + "/"
F = D + "PROV - Work Region Occupation SOC20 (4) Table 15 (4).1a   Weekly pay - Gross 2025.xlsx"
FCV = D + "PROV - Work Region Occupation SOC20 (4) Table 15 (4).1b   Weekly pay - Gross 2025 CV.xlsx"
SOC = {"1222": "restaurants", "5434": "restaurants", "5435": "restaurants", "5436": "restaurants", "9263": "restaurants", "9264": "restaurants",
       "9261": None, "9265": None, "9266": "cafes", "6221": "barbershops", "1253": "barbershops", "6222": None}
SHEET = "Full-Time"
def read(f):
    out = {}
    for r in openpyxl.load_workbook(f, read_only=True)[SHEET].iter_rows(values_only=True):
        m = re.match(r"London, (.+)", str(r[0] or "").strip())
        if m and str(r[1]) in SOC:
            out[str(r[1])] = (m.group(1), r)
    return out
val, cv = read(F), read(FCV)
rows = []
for code, (occ, r) in sorted(val.items()):
    med = r[3]
    c = cv.get(code, (None, [None] * 4))[1][3]
    if not isinstance(med, (int, float)):
        print("no published median, stays an hour:", code, occ, med); continue
    # A printed median with no CV beside it ('.'): the publisher printed it, so its CV is within its 20 percent rule; said so.
    q = None if not isinstance(c, (int, float)) else "precise" if c <= 5 else "reasonably precise" if c <= 10 else "acceptable"
    row = {"item": "pay_weekly", "officialClass": f"SOC 2020 {code}: {occ}", "geo": {"level": "region", "code": "TLI", "name": "London"},
           "value": med, "unit": "GBP per week", "year": "2025",
           "measure": f"median gross weekly pay, full-time employee jobs, April 2025 (provisional): {occ}",
           "note": f"Employees only, by place of work; self-employed workers are not covered. {f"Coefficient of variation {c} percent ({q})." if q else "No coefficient of variation printed for the median (the publisher prints a median only within its 20 percent rule)."} Mean {r[5]} GBP."}
    if SOC[code]: row["trade"] = SOC[code]
    rows.append(row)
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ons-ashe-weekly-2025.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump({"id": "ons-ashe-weekly-2025",
               "source": {"publisher": "Office for National Statistics", "title": "Annual Survey of Hours and Earnings (ASHE) 2025 provisional, Table 15: region by occupation (4-digit SOC 2020), table 15 (4).1a weekly pay, gross, full-time",
                          "url": "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/datasets/regionbyoccupation4digitsoc2010ashetable15",
                          "table": "ashetable152025provisional.zip, file 'Table 15 (4).1a Weekly pay - Gross 2025', sheet Full-Time; quality from table 15 (4).1b (CV); estimates with CV above 20 percent are suppressed by the publisher",
                          "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
               "retrieved": "2026-10-20", "rows": rows}, f, ensure_ascii=False, indent=1)
    f.write("\n")
for x in rows: print(x.get("trade"), x["officialClass"], x["value"], x["note"][-70:])
