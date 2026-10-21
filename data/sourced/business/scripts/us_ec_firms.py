"""US 2022 Economic Census, firms by employment size (EC2200SIZEEMPFIRM): the national all-firms line for the trades' classes,
for the industry page's United States row (his word of 2026-10-21: "from its own census: sales, team and how many last").
A firm is all the establishments of one company; employer firms only (businesses without paid staff are not in this census).
Sales a firm = receipts over firms; employees a firm = paid employees over firms (owners are not counted as employees).
Run: python3 scripts/us_ec_firms.py"""
import os, urllib.request, zipfile
from spines_lib import write

DL = "/srv/atlas/runs/data-industry/dl"
os.makedirs(DL, exist_ok=True)
URL = "https://www2.census.gov/programs-surveys/economic-census/data/2022/sector00/EC2200SIZEEMPFIRM.zip"
z = os.path.join(DL, "EC2200SIZEEMPFIRM.zip")
if not os.path.exists(z):
    open(z, "wb").write(urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})).read())
lines = zipfile.ZipFile(z).open("EC2200SIZEEMPFIRM.dat").read().decode("latin-1").splitlines()
head = lines[0].lstrip("#").split("|")
recs = [dict(zip(head, l.split("|"))) for l in lines[1:]]
TRADES = {"7225": "restaurants", "722511": "full_service_restaurants", "722513": "limited_service_restaurants",
          "722515": "cafes", "812111": "barbershops"}
US = {"level": "country", "code": "US", "name": "United States"}
BASE = "Employer firms only (a firm is all the establishments of one company), all firms of the class in 2022."
rows = []
for code, trade in TRADES.items():
    r = [x for x in recs if x["GEO_ID"].endswith("US") and x["NAICS2022"] == code and x["EMPSZFF"] == "001"][0]
    flags = [r[f] for f in ("FIRM_F", "RCPTOT_F", "EMP_F") if r.get(f)]
    assert not flags, (code, flags)
    firms, rcpt, emp = int(r["FIRM"]), int(r["RCPTOT"]), int(r["EMP"])
    cls = f"NAICS 2022 {code}: {r['NAICS2022_LABEL']}"
    common = {"trade": trade, "officialClass": cls, "geo": US, "year": "2022"}
    rows.append({"item": "business_count", **common, "value": firms, "unit": "employer firms", "measure": "number of employer firms",
                 "note": BASE})
    rows.append({"item": "sales_per_business", **common, "value": int(round(rcpt * 1000 / firms, -2)), "unit": "USD",
                 "measure": "mean sales, value of shipments or revenue per employer firm (receipts divided by firms), rounded to 100 USD",
                 "note": f"{BASE} Derived: USD {rcpt:,} thousand over {firms:,} firms."})
    rows.append({"item": "employees_per_business", **common, "value": round(emp / firms, 1), "unit": "paid employees per firm",
                 "measure": "mean paid employees per employer firm (employees divided by firms); owners not counted",
                 "note": f"{BASE} Derived: {emp:,} paid employees over {firms:,} firms."})
write("business", "us-economic-census-2022-firms.json", {
    "id": "us-economic-census-2022-firms",
    "source": {"publisher": "US Census Bureau", "title": "2022 Economic Census: Selected Statistics by Employment Size of Firm (EC2200SIZEEMPFIRM)",
               "url": URL, "table": "EC2200SIZEEMPFIRM, the United States, all firms (employment size code 001)",
               "licence": "US federal work, public domain"},
    "retrieved": "2026-10-21", "rows": rows})
for x in rows:
    print(x["trade"], x["item"], x["value"])
