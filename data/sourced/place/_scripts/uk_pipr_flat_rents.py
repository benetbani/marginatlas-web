"""ONS Price Index of Private Rents (16 September 2026 edition), Table 1: the one-bedroom rental price for the seven UK catalog
cities, latest month. Usage: python3 uk_pipr_flat_rents.py <pipr.xlsx> <out.json>"""
import datetime, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import xlsx

URL = ("https://www.ons.gov.uk/file?uri=/economy/inflationandpriceindices/datasets/"
       "priceindexofprivaterentsukmonthlypricestatistics/16september2026/priceindexofprivaterentsukmonthlypricestatistics.xlsx")
SRC = {"publisher": "Office for National Statistics",
       "title": "Price Index of Private Rents, UK: monthly price statistics (16 September 2026 edition), Table 1",
       "url": URL, "table": "Table 1, column 'Rental price one bed'", "licence": "Open Government Licence v3.0"}
# (area code in the workbook, level, our geo name, what the area is)
CITIES = [
    ("E12000007", "city", "Greater London", "the London region (Greater London)"),
    ("E08000003", "city", "Manchester", "the local authority of Manchester"),
    ("E08000025", "city", "Birmingham", "the local authority of Birmingham"),
    ("E08000035", "city", "Leeds", "the local authority of Leeds"),
    ("E06000023", "city", "Bristol", "the local authority of Bristol, City of"),
    ("S33000011", "metro", "Lothian", "the Lothian Broad Rental Market Area, which holds the City of Edinburgh with its neighbours; "
     "the index publishes Scotland by rental market area, never by council"),
    ("S33000009", "metro", "Greater Glasgow", "the Greater Glasgow Broad Rental Market Area, which holds Glasgow City with its "
     "neighbours; the index publishes Scotland by rental market area, never by council"),
]

def main(src, out):
    c = xlsx.cells(src, "Table 1")
    head = {c[(3, k)]: k for (r, k) in c if r == 3}
    kp, kc = head["Rental price one bed"], head["Annual change one bed"]
    rows = []
    for code, level, name, what in CITIES:
        mine = [r for (r, k), v in c.items() if k == 2 and v == code]
        r = max(mine, key=lambda r: c[(r, 1)])
        month = datetime.date(1899, 12, 30) + datetime.timedelta(int(c[(r, 1)]))
        assert c[(r, 3)] in (name, "London", "Bristol, City of"), (code, c[(r, 3)])
        note = (f"{what}; the month of {month:%B %Y}, new and existing tenancies, from administrative rent data; "
                f"official statistics in development; {c[(r, kc)]:.1f}% on a year earlier")
        if code.startswith("S"):
            note += "; Scotland's rents here are mainly advertised new lets (the publisher's note 8)"
        rows.append({"item": "flat_rent_month", "geo": {"level": level, "code": code, "name": name},
                     "value": int(c[(r, kp)]), "unit": "GBP per month", "year": f"{month:%Y-%m}",
                     "measure": "average monthly private rent, one bedroom, as the Price Index of Private Rents publishes it "
                                "(rounded to the nearest pound)",
                     "note": note, "source": SRC})
    d = {"id": "place-uk-flat-rents-pipr-2026", "source": SRC, "retrieved": "2026-10-20", "rows": rows}
    json.dump(d, open(out, "w"), indent=1, ensure_ascii=False)
    for x in rows: print(x["geo"]["name"], x["value"], x["year"])

if __name__ == "__main__":
    main(*sys.argv[1:])
