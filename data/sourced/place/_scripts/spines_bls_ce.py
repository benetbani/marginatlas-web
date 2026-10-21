"""BLS Consumer Expenditure Surveys 2024: food away from home by income quintile before taxes (public API v1, annual means)."""
import json, os, urllib.request
from spines_lib import DL, RETRIEVED, write

path = os.path.join(DL, "ce_quintiles.json")
CH = ["01", "02", "03", "04", "05", "06"]
if not os.path.exists(path):
    sids = [f"CXU{it}LB01{c}M" for it in ("FOODAWAY", "TOTALEXP", "INCBEFTX") for c in CH]
    req = urllib.request.Request("https://api.bls.gov/publicAPI/v1/timeseries/data/", method="POST",
                                 data=json.dumps({"seriesid": sids, "startyear": "2024", "endyear": "2024"}).encode(),
                                 headers={"Content-Type": "application/json"})
    open(path, "wb").write(urllib.request.urlopen(req).read())
d = json.load(open(path))
val = {}
for s in d["Results"]["series"]:
    for p in s["data"]:
        if p["year"] == "2024" and p["period"] == "A01":
            val[s["seriesID"]] = float(p["value"])
WORDS = {"01": "all consumer units", "02": "the lowest fifth of consumer units by income before taxes",
         "03": "the second fifth", "04": "the third fifth", "05": "the fourth fifth",
         "06": "the highest fifth of consumer units by income before taxes"}
US = {"level": "country", "code": "US", "name": "United States"}
API = "https://api.bls.gov/publicAPI/v1/timeseries/data/"
rows = []
for c in CH:
    fa, te, inc = val[f"CXUFOODAWAYLB01{c}M"], val[f"CXUTOTALEXPLB01{c}M"], val[f"CXUINCBEFTXLB01{c}M"]
    q = {"quintile": int(c) - 1} if c != "01" else {}
    incn = f" Mean income before taxes of the group: USD {inc:,.0f}." if c != "01" else ""
    rows.append(dict({"item": "eating_out_by_income", "officialClass": "CE item: Food away from home", "geo": US, "value": fa,
                      "unit": "USD per year per consumer unit", "year": "2024",
                      "measure": f"average annual spending on food away from home, {WORDS[c]}, 2024",
                      "note": "Food away from home: meals and snacks at restaurants, cafes, fast food, vending and on trips; a consumer unit is roughly a household." + incn,
                      "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": f"Consumer Expenditure Surveys, series CXUFOODAWAYLB01{c}M", "url": API}}, **q))
    rows.append(dict({"item": "eating_out_by_income", "officialClass": "CE item: Food away from home", "geo": US,
                      "value": round(100 * fa / te, 1), "unit": "percent of average annual expenditures", "year": "2024",
                      "measure": f"food away from home as a share of average annual expenditures, {WORDS[c]}, 2024",
                      "note": f"Derived: USD {fa:,.0f} of USD {te:,.0f} average annual expenditures (series CXUTOTALEXPLB01{c}M)." + incn}, **q))
write("place", "bls-ce-eating-out-2024.json", {
    "id": "bls-ce-eating-out-2024",
    "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": "Consumer Expenditure Surveys: quintiles of income before taxes, annual means, 2024",
               "url": "https://www.bls.gov/cex/tables.htm",
               "table": "public API v1 series CXUFOODAWAYLB0101M to LB0106M, CXUTOTALEXPLB0101M to LB0106M, CXUINCBEFTXLB0101M to LB0106M, year 2024 (the 2025 annual was not yet published)",
               "licence": "US federal work, public domain"},
    "retrieved": RETRIEVED, "rows": rows})
