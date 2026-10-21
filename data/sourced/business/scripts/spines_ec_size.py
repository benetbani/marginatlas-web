"""US 2022 Economic Census, firms by employment size (EC2200SIZEEMPFIRM): receipts share and receipts per firm, NAICS 722511, 722515, 812111."""
import os, urllib.request, zipfile
from spines_lib import DL, RETRIEVED, write

URL = "https://www2.census.gov/programs-surveys/economic-census/data/2022/sector00/EC2200SIZEEMPFIRM.zip"
d = os.path.join(DL, "ecsize")
os.makedirs(d, exist_ok=True)
z = os.path.join(d, "EC2200SIZEEMPFIRM.zip")
if not os.path.exists(z):
    open(z, "wb").write(urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})).read())
f = zipfile.ZipFile(z).open("EC2200SIZEEMPFIRM.dat")
lines = f.read().decode("latin-1").splitlines()
head = lines[0].lstrip("#").split("|")
recs = [dict(zip(head, l.split("|"))) for l in lines[1:]]
TRADES = {"722511": "restaurants", "722515": "cafes", "812111": "barbershops"}
BANDS = ["510", "515", "520", "525", "530", "535", "545", "550", "600"]
US = {"level": "country", "code": "US", "name": "United States"}
rows, gaps = [], []
for code, trade in TRADES.items():
    sel = {r["EMPSZFF"]: r for r in recs if r["NAICS2022"] == code and r["GEO_ID"].endswith("US")}
    allf = sel["001"]
    tot = int(allf["RCPTOT"])
    cls = f"NAICS {code}: {allf['NAICS2022_LABEL']}"
    for b in BANDS:
        if b not in sel:
            continue
        r = sel[b]
        lab = r["EMPSZFF_LABEL"]
        words = lab.replace("Firms operated entire year with ", "firms operated the entire year with ").replace("Firms not operated for the entire year", "firms not operated for the entire year")
        if r["RCPTOT_F"] or not r["RCPTOT"] or (int(r["RCPTOT"]) == 0 and r["RCPTOT_F"]):
            gaps.append(f"{code} {lab}: receipts flagged {r['RCPTOT_F'] or 'blank'}")
            continue
        rc = int(r["RCPTOT"])
        base = ("Firms (all establishments of one company together), size by the firm's employees; "
                "the bands cover firms operated the entire year, and firms not operated the entire year are their own row.")
        rows.append({"item": "turnover_share_by_size", "trade": trade, "officialClass": cls, "geo": US,
                     "value": round(100 * rc / tot, 1), "unit": "percent of the class's sales", "year": "2022",
                     "measure": f"share of sales, value of shipments or revenue made by {words}",
                     "note": f"{base} Derived: USD {rc:,} thousand of USD {tot:,} thousand (all firms)."})
        firms = int(r["FIRM"] or 0)
        if firms > 0 and not r["FIRM_F"]:
            rows.append({"item": "sales_per_business_by_size", "trade": trade, "officialClass": cls, "geo": US,
                         "value": round(rc * 1000 / firms), "unit": "USD per firm", "year": "2022",
                         "measure": f"mean sales, value of shipments or revenue per firm, {words}",
                         "note": f"{base} Derived: USD {rc:,} thousand over {firms:,} firms."})
        else:
            gaps.append(f"{code} {lab}: firms {r['FIRM']} flag {r['FIRM_F']!r}, no per-firm figure")
write("business", "us-economic-census-size-2022.json", {
    "id": "us-economic-census-size-2022",
    "source": {"publisher": "U.S. Census Bureau",
               "title": "2022 Economic Census: Employment Size of Firms for the U.S. (EC2200SIZEEMPFIRM)",
               "url": "https://data.census.gov/table/ECNSIZE2022.EC2200SIZEEMPFIRM",
               "table": URL + ", rows NAICS 722511, 722515, 812111, all establishments, EMPSZFF 001 (all firms), 510 to 550 and 600; cells with a flag are not written",
               "licence": "US federal work, public domain"},
    "retrieved": RETRIEVED, "rows": rows})
print("\n".join(gaps))
