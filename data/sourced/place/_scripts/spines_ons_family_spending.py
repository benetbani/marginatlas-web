"""ONS Family Spending FYE 2025, workbook 1 table A6: catering services (COICOP 11.1) by gross income decile, GBP a week a household."""
import os, sys, urllib.request
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, write

PAGE = "https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/familyspendingworkbook1detailedexpenditureandtrends"
FILE = "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/familyspendingworkbook1detailedexpenditureandtrends/fye2025/workbook1detailedexpenditureandtrends.xlsx"
path = os.path.join(DL, "fs1_fye2025.xlsx")
if not os.path.exists(path):
    open(path, "wb").write(urllib.request.urlopen(urllib.request.Request(FILE, headers={"User-Agent": "Mozilla/5.0"})).read())
rows_x = list(openpyxl.load_workbook(path, read_only=True, data_only=True)["A6"].iter_rows(values_only=True))
num = lambda s: float(str(s).replace(",", ""))
DEC = ["lowest tenth", "second tenth", "third tenth", "fourth tenth", "fifth tenth", "sixth tenth", "seventh tenth",
       "eighth tenth", "ninth tenth", "highest tenth", "all households"]
cat = next(r for r in rows_x if r[0] == "11.1")
meals = next(r for r in rows_x if r[1] == "11.1.1")
total = next(r for r in rows_x if r[0] and str(r[0]).strip() == "Total expenditure")
mean_inc = next(r for r in rows_x if r[0] and str(r[0]).startswith("Mean of group"))
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
out = []
for i, d in enumerate(DEC):
    c = 4 + i
    group = f"households in the {d} by gross income" if i < 10 else "all households"
    inc = f" Mean gross income of the group: GBP {mean_inc[c]} a week." if i < 10 else ""
    base = {"item": "eating_out_by_income", "officialClass": "COICOP 11.1: Catering services",
            "geo": GB, "year": "2025", "decile": i + 1 if i < 10 else None}
    out.append(dict(base, value=num(cat[c]), unit="GBP per week per household",
                    measure=f"average weekly household spending on catering services (restaurants, cafes, takeaways, canteens), {group}, financial year ending March 2025",
                    note="Living Costs and Food Survey, gross income decile groups." + inc))
    out.append(dict(base, value=num(meals[c]), unit="GBP per week per household", officialClass="COICOP 11.1.1: Restaurant and café meals",
                    measure=f"average weekly household spending on restaurant and cafe meals, {group}, financial year ending March 2025",
                    note="A part of catering services (11.1): sit-down meals only, takeaways and alcoholic drinks out are other lines." + inc))
    out.append(dict(base, value=round(100 * num(cat[c]) / num(total[c]), 1), unit="percent of household expenditure",
                    measure=f"catering services as a share of total household expenditure, {group}, financial year ending March 2025",
                    note=f"Derived from the same table: GBP {cat[c]} of GBP {total[c]} total expenditure a week (total expenditure counts net rent)." + inc))
for r in out:
    if r["decile"] is None:
        del r["decile"]
write("place", "ons-family-spending-eating-out-2025.json", {
    "id": "ons-family-spending-eating-out-2025",
    "source": {"publisher": "Office for National Statistics", "title": "Family spending workbook 1: detailed expenditure and trends, financial year ending 2025",
               "url": PAGE, "table": "workbook1detailedexpenditureandtrends.xlsx (edition fye2025), table A6 'Detailed household expenditure by gross income decile group', rows 11.1, 11.1.1 and Total expenditure",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": out})
