"""Household final consumption by purpose, one row per published figure (the country page's 05 Household spending, Part III.3).

Three publishers of the same kind of figure, the national accounts' household final consumption by purpose:
  - Eurostat nama_10_co3_p3, unit PC_TOT (each COICOP division's published share of the total), every country it publishes,
    the latest year with all twelve divisions;
  - ONS Consumer Trends (ct.xlsx), household final consumption, domestic concept, current prices, not seasonally adjusted, GBP
    million, the twelve COICOP divisions and their total, the latest whole year;
  - BEA NIPA Table 2.5.5, personal consumption expenditures by function, households, USD million, the twelve functions, the
    latest year (NipaDataA.txt with SeriesRegister.txt).
Run: python3 -I data/sourced/place/_scripts/household_spending_by_purpose.py <download dir> <out json>
The download dir holds eu_all.json, ct.xlsx, SeriesRegister.txt, NipaDataA.txt (fetched 2026-10-17 from the URLs in SOURCES).
"""
import csv, json, re, sys
sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
import xlsx  # minimal stdlib reader

DL, OUT = sys.argv[1], sys.argv[2]
EU_URL = "https://ec.europa.eu/eurostat/databrowser/view/nama_10_co3_p3/default/table"
SOURCES = {
    "eu": {"publisher": "Eurostat", "title": "Final consumption expenditure of households by consumption purpose (COICOP 3 digit), nama_10_co3_p3, percentage of total", "url": EU_URL, "table": "nama_10_co3_p3"},
    "gb": {"publisher": "Office for National Statistics", "title": "Consumer trends, household final consumption expenditure by COICOP division, domestic concept, current prices, not seasonally adjusted", "url": "https://www.ons.gov.uk/economy/nationalaccounts/satelliteaccounts/datasets/consumertrends", "table": "ct.xlsx"},
    "us": {"publisher": "U.S. Bureau of Economic Analysis", "title": "National Income and Product Accounts, Table 2.5.5, Personal Consumption Expenditures by Function", "url": "https://apps.bea.gov/iTable/?reqid=19&step=2&isuri=1&categories=survey#eyJhcHBpZCI6MTksInN0ZXBzIjpbMSwyLDNdLCJkYXRhIjpbWyJjYXRlZ29yaWVzIiwiU3VydmV5Il0sWyJOSVBBX1RhYmxlX0xpc3QiLCI3NCJdXX0=", "table": "T20505"},
}
ISO = {"EL": "GR", "UK": "GB"}
rows = []

# Eurostat: published shares.
d = json.load(open(f"{DL}/eu_all.json"))
ids, size = d["id"], d["size"]
idx = {k: d["dimension"][k]["category"]["index"] for k in ids}
lab = {k: d["dimension"][k]["category"]["label"] for k in ids}
def eu(c, g, t):
    pos = {"freq": 0, "unit": 0, "coicop": idx["coicop"][c], "geo": idx["geo"][g], "time": idx["time"][t]}
    n = 0
    for i, k in enumerate(ids): n = n * size[i] + pos[k]
    return d["value"].get(str(n))
divs = sorted(idx["coicop"], key=lambda c: idx["coicop"][c])
for g in idx["geo"]:
    if g.startswith("EA") or g == "UK": continue  # the UK from its own office (below); no euro-area aggregates
    years = [t for t in sorted(idx["time"], reverse=True) if all(eu(c, g, t) is not None for c in divs)]
    if not years: continue
    t = years[0]
    level = "eu" if g == "EU27_2020" else "country"
    for c in divs:
        rows.append({"item": "household_spending_share", "officialClass": f"COICOP {c[2:]}", "geo": {"level": level, "code": ISO.get(g, g), "name": lab["geo"][g]},
                     "value": eu(c, g, t), "unit": "percent of household final consumption", "year": t, "measure": lab["coicop"][c],
                     "note": "National accounts, domestic concept: spending in the country by residents and visitors.", "source": SOURCES["eu"]})

# ONS: GBP million by division and the total; the builder computes each share.
cells = xlsx.cells(f"{DL}/ct.xlsx", "data")
cols = max(k for _, k in cells); nrow = max(r for r, _ in cells)
divcol = {}
for k in range(1, cols + 1):
    t = str(cells.get((1, k)) or "").strip('"')
    m = re.match(r"^(\d\d) (.*) CP NSA", t)
    if m and m.group(1) not in divcol: divcol[m.group(1)] = (k, m.group(2).replace(";", ","))
totcol = next(k for k in range(1, cols + 1) if str(cells.get((1, k)) or "").startswith("Household final consumption expenditure: Domestic concept CP NSA"))
yr = max((r for r in range(1, nrow + 1) if re.fullmatch(r"\d{4}", str(cells.get((r, 1)) or ""))), key=lambda r: int(cells[(r, 1)]))
y = str(cells[(yr, 1)])
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
for code, (k, name) in sorted(divcol.items()):
    rows.append({"item": "household_spending", "officialClass": f"COICOP {code}", "geo": GB, "value": cells[(yr, k)], "unit": "GBP million", "year": y, "measure": name,
                 "note": f"CDID {cells.get((2, k))}. National accounts, domestic concept.", "source": SOURCES["gb"]})
rows.append({"item": "household_spending_total", "geo": GB, "value": cells[(yr, totcol)], "unit": "GBP million", "year": y, "measure": "Household final consumption expenditure, domestic concept",
             "note": f"CDID {cells.get((2, totcol))}. The twelve divisions add to it.", "source": SOURCES["gb"]})

# BEA: USD million by function (the twelve under households, before net foreign travel and the nonprofits' sales).
reg = {}
for r in csv.reader(open(f"{DL}/SeriesRegister.txt")):
    if not r or r[0].startswith("%"): continue
    reg[r[0]] = (r[1], r[5], r[6])
funcs = sorted(((c, v[0], int(re.search(r"T20505:(\d+)", v[1]).group(1))) for c, v in reg.items()
                if "T20505:" in v[1] and "DPHCRC" in v[2].split("|") and not v[0].startswith(("Less:", "Net foreign travel"))), key=lambda x: x[2])
vals = {}
want = {c for c, _, _ in funcs}
for r in csv.reader(open(f"{DL}/NipaDataA.txt")):
    if r and r[0] in want: vals.setdefault(r[0], {})[r[1]] = float(r[2].replace(",", ""))
y = max(set.intersection(*(set(vals[c]) for c in want)))
US = {"level": "country", "code": "US", "name": "United States"}
for c, name, line in funcs:
    rows.append({"item": "household_spending", "officialClass": f"NIPA Table 2.5.5 line {line}", "geo": US, "value": vals[c][y], "unit": "USD million", "year": y,
                 "measure": re.sub(r"\s*\(\d+\)$", "", name).replace(";", ","), "note": f"Series {c}. Households' purchases by function, before net foreign travel and the nonprofits' own sales.", "source": SOURCES["us"]})

out = {"id": "household-spending-by-purpose", "source": {"publisher": "National statistical offices and Eurostat (each row names its own)", "title": "Household final consumption by purpose, national accounts", "url": EU_URL},
       "retrieved": "2026-10-17", "rows": rows}
json.dump(out, open(OUT, "w"), ensure_ascii=False, indent=2)
print(f"wrote {OUT}: {len(rows)} rows")
