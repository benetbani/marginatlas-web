"""ONS Family Spending workbook 3 (FYE2025), Table A35, 3-year average: catering services (COICOP 11.1) over total expenditure for
the five regions that hold the UK catalog cities other than London (London and the UK are in household-spending-eating-out.json,
computed the same way). Usage: python3 uk_family_spending_regions.py <workbook3expenditurebyregion.xlsx> <out.json>"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import xlsx

SRC = {"publisher": "Office for National Statistics",
       "title": "Family spending workbook 3: expenditure by region, financial year ending 2025 (Table A35, detailed expenditure "
                "by region, 3-year average)",
       "url": "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure/datasets/"
              "familyspendingworkbook3expenditurebyregion/fye2025/workbook3expenditurebyregion.xlsx",
       "table": "A35", "licence": "Open Government Licence v3.0"}
REGIONS = [("E12000002", "North West", "Manchester"), ("E12000005", "West Midlands", "Birmingham"),
           ("E12000003", "Yorkshire and The Humber", "Leeds"), ("E12000009", "South West", "Bristol"),
           ("S92000003", "Scotland", "Edinburgh and Glasgow")]

def main(src, out):
    c = xlsx.cells(src, "A35")
    col = {v: k for (r, k), v in c.items() if r == 10 and v}
    row = lambda pred: next(r for (r, k), v in c.items() if k <= 2 and pred(v))
    r111 = row(lambda v: v == 11.1)
    assert c[(r111, 2)] == "Catering services"
    rtot = row(lambda v: isinstance(v, str) and v.strip() == "Total expenditure")
    rows = []
    for code, name, city in REGIONS:
        k = col[code]
        cat, tot = float(c[(r111, k)]), float(c[(rtot, k)])
        rows.append({"item": "eating_out_share", "geo": {"level": "region", "code": code, "name": name},
                     "value": round(100 * cat / tot, 1), "unit": "percent of household expenditure",
                     "year": "2022/23-2024/25",
                     "measure": "catering services (COICOP 11.1) as a share of average weekly household expenditure, household survey",
                     "note": f"computed from the published weekly averages: GBP {cat:.2f} of GBP {tot:.2f} total expenditure; three "
                             f"financial years April 2022 to March 2025 pooled; residents' households only, visitors not counted; "
                             f"the region's figure, said as the region's on {city}'s page (no city figure is published)",
                     "source": SRC})
    json.dump({"id": "place-uk-eating-out-regions-2025", "source": SRC, "retrieved": "2026-10-20", "rows": rows},
              open(out, "w"), indent=1, ensure_ascii=False)
    for x in rows: print(x["geo"]["name"], x["value"], x["note"][:60])

if __name__ == "__main__":
    main(*sys.argv[1:])
