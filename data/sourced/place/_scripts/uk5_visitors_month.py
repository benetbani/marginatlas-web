"""uk5: London's visitors each month, the three honest readings (brief D11, 2026-10-20). Every value is read from a file kept under
data/raw/uk5-visitors/ (its URL and download date in data/raw/uk5-visitors/SOURCES.md); nothing is typed.

1. uk5-uk-visits-month.json: overseas residents' visits to the UK (Great Britain from January 2024), each month, the latest 24
   months the ONS has published monthly: July 2022 to June 2024. The monthly series stops there: from July 2024 the survey's new
   design is published by quarter only.
2. uk5-london-visits-month-worked.json: London's 2025 quarters (Table 7, region visited) spread over their months by the UK's
   monthly pattern of 2023, the latest calendar year the ONS published monthly in full and final:
   London in month m = London's quarter x (the UK's month m / the UK's quarter). Every row is stamped `worked out` and keeps both
   inputs beside it.
3. uk5-london-airports-month.json: terminal passengers at the six London airports, each month, September 2025 to August 2026,
   the CAA's monthly airport data, Table 09.

Usage (from the repo root): python3 -I data/sourced/place/_scripts/uk5_visitors_month.py
"""
import csv, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from xlsx import cells  # noqa: E402

RAW = "data/raw/uk5-visitors"
OUT = "data/sourced/place"
RETRIEVED = "2026-10-20"
OGL = "Open Government Licence v3.0"
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
ONS = "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/leisureandtourism/datasets"
SRC_V64 = {"publisher": "Office for National Statistics",
           "title": "Monthly overseas travel and tourism reference tables, 2019 to 2023, final monthly estimates (released 17 May 2024), Table 1: overseas residents visits to the UK by month and area of residence",
           "url": f"{ONS}/monthlyoverseastravelandtourismreferencetables/current/previous/v64/referencetables.xlsx",
           "table": "Table 1, column World Total", "licence": OGL}
SRC_2024 = {"publisher": "Office for National Statistics",
            "title": "Monthly overseas travel and tourism reference tables, January to June 2024, provisional monthly estimates (released 18 October 2024), Table 1: overseas residents' visits by month and area of residence",
            "url": f"{ONS}/monthlyoverseastravelandtourismreferencetables/current/overseastravelandtourismmonthlyq22024.xlsx",
            "table": "Table 1, column World Total", "licence": OGL}
SRC_Q2025 = {"publisher": "Office for National Statistics",
             "title": "Estimates of overseas residents' visits, spending and nights, 2025, quarters 1 to 4 (released 16 October 2026), Table 7: visits by region of Great Britain visited",
             "url": f"{ONS}/estimatesofoverseasresidentsvisitsandspendingintheuk/2025/estimatesofoverseasresidentsvisitsandspending2025.xlsx",
             "table": "Table 7, London, Total World", "licence": OGL}
F_V64 = f"{RAW}/ons/ott-monthly-2019-2023-v64-released-2024-05-17.xlsx"
F_2024 = f"{RAW}/ons/ott-monthly-jan-jun-2024-released-2024-10-18.xlsx"
F_Q2025 = f"{RAW}/ons/overseas-residents-visits-2025-quarters-released-2026-10-16.xlsx"
CAA_PAGE = "https://www.caa.co.uk/data-and-analysis/uk-aviation-market/airports/uk-airport-data/uk-airport-data-{y}/{m}-{y}/"
CAA_TERMS = ("CAA conditions on its UK airport data pages: no statistical data provided by CAA may be sold on to a third party, and "
             "CAA insists that it is referenced in any publication that refers to CAA statistics (no open licence is named)")


def month_table(path, header_row_hint):
    """{'YYYY-MM': (world total, period label)} from a monthly workbook's Table 1."""
    c = cells(path, "1")
    hdr = next(r for r in range(1, header_row_hint + 1) if c.get((r, 1)) == "Period")
    col = next(k for k in range(1, 20) if str(c.get((hdr, k)) or "").replace("\n", " ").strip() == "World Total")
    out = {}
    for r in range(hdr + 1, max(k[0] for k in c) + 1):
        lab = str(c.get((r, 1)) or "").strip()
        parts = lab.split()
        if len(parts) >= 2 and parts[0].isdigit() and parts[1] in MONTHS:
            v = c.get((r, col))
            assert isinstance(v, float), (path, lab, v)
            out[f"{parts[0]}-{MONTHS.index(parts[1]) + 1:02d}"] = (int(v), lab)
    return out


def write(name, d):
    with open(f"{OUT}/{name}", "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    print(f"wrote {OUT}/{name}: {len(d['rows'])} rows")


def reading1(v64, m24):
    months = sorted({**v64, **m24})[-24:]
    rows = []
    for ym in months:
        gb = ym in m24
        v, lab = (m24 if gb else v64)[ym]
        rows.append({
            "item": "uk_visits_month",
            "geo": {"level": "country", "code": "GB", "name": "Great Britain" if gb else "United Kingdom"},
            "value": v, "unit": "visits", "year": ym,
            "measure": f"visits to {'Great Britain' if gb else 'the UK'} by overseas residents, a month",
            "note": ((f"'{lab}' in Table 1: a provisional estimate (suffix P); from January 2024 the ONS counts Great Britain only "
                      f"(Northern Ireland's figures moved to NISRA on 1 April 2024); April to June 2024 rest on fewer interviews than "
                      f"usual (the workbook's cover sheet)") if gb else
                     f"'{lab}' in Table 1: a final estimate; the United Kingdom") +
                    f"; rounded by the ONS to the nearest 1,000; read from {F_2024 if gb else F_V64}, downloaded {RETRIEVED}",
            "source": SRC_2024 if gb else SRC_V64})
    write("uk5-uk-visits-month.json", {
        "id": "place-uk5-uk-visits-month", "source": SRC_2024, "retrieved": RETRIEVED,
        "notes": [
            "The latest 24 months the ONS has published as monthly figures: July 2022 to June 2024. The ONS publishes no later month: "
            "from July 2024 the International Passenger Survey runs on a new design published by quarter only (its 2025 quarters were "
            "released 16 October 2026), and the ONS says the old and new designs are not to be compared.",
            "Two releases: July 2022 to December 2023 are final UK estimates (released 17 May 2024); January to June 2024 are provisional "
            "Great Britain estimates (released 18 October 2024). The October 2024 workbook removed the 2019 to 2023 months while the ONS "
            "reviews their quality; the May 2024 workbook is still on the ONS site as a previous version of the same dataset.",
            "Every value: Table 1, World Total, rounded by the ONS to the nearest 1,000. Raw files and their URLs: data/raw/uk5-visitors/SOURCES.md.",
        ],
        "rows": rows})
    return rows


def reading2(v64):
    c = cells(F_Q2025, "7")
    hdr = next(r for r in range(1, 30) if c.get((r, 1)) == "Region of Great Britain visited")
    qcol = {str(c.get((hdr, k))).strip(): k for k in range(1, 12) if str(c.get((hdr, k)) or "").startswith("2025 Q")}
    lrow = next(r for r in range(hdr + 1, max(k[0] for k in c) + 1)
                if c.get((r, 1)) == "London" and c.get((r, 2)) == "Total World")
    lq = {q[-2:]: int(c[(lrow, k)]) for q, k in qcol.items()}
    assert sorted(lq) == ["Q1", "Q2", "Q3", "Q4"], lq
    PATTERN_YEAR = "2023"
    rows = []
    for qi, q in enumerate(["Q1", "Q2", "Q3", "Q4"]):
        ms = [f"{PATTERN_YEAR}-{3 * qi + j + 1:02d}" for j in range(3)]
        uq = sum(v64[m][0] for m in ms)
        for m in ms:
            um = v64[m][0]
            exact = lq[q] * um / uq
            ym = f"2025-{m[5:]}"
            rows.append({
                "item": "visits_month_worked",
                "kind": "worked out",
                "geo": {"level": "city", "code": "E12000007", "name": "Greater London"},
                "value": int(round(exact, -3)), "unit": "visits", "year": ym,
                "measure": "worked out: visits to London by overseas residents, a month (London's quarter spread by the UK's monthly pattern)",
                "note": (f"worked out, not published: London's 2025 {q} ({lq[q]:,} visits, Table 7) x the UK's {MONTHS[int(m[5:]) - 1]} "
                         f"{PATTERN_YEAR} ({um:,}) / the UK's {PATTERN_YEAR} {q} ({uq:,}, the sum of its three months, Table 1) = "
                         f"{exact:,.1f}, rounded to the nearest 1,000 as the ONS rounds its inputs; the ONS publishes no 2025 month, so "
                         f"the pattern is {PATTERN_YEAR}'s, the latest year published monthly in full and final; read from {F_Q2025} and "
                         f"{F_V64}, downloaded {RETRIEVED}"),
                "inputs": {
                    "london_quarter": {"value": lq[q], "period": f"2025-{q}", "unit": "visits", "status": "provisional",
                                       "file": F_Q2025, "url": SRC_Q2025["url"], "table": SRC_Q2025["table"]},
                    "uk_month": {"value": um, "period": m, "unit": "visits", "status": "final", "file": F_V64, "url": SRC_V64["url"],
                                 "table": SRC_V64["table"]},
                    "uk_quarter": {"value": uq, "period": f"{PATTERN_YEAR}-{q}", "months": ms, "unit": "visits",
                                   "how": "the sum of the three UK months of the quarter, Table 1"},
                    "exact": round(exact, 3),
                },
                "source": SRC_Q2025})
    write("uk5-london-visits-month-worked.json", {
        "id": "place-uk5-london-visits-month-worked", "source": SRC_Q2025, "retrieved": RETRIEVED,
        "notes": [
            "WORKED OUT, NOT PUBLISHED. The ONS publishes London's overseas visits by quarter only. Each month here is London's 2025 "
            "quarter shared out in the proportions the UK's visits fell across that quarter's three months: London in month m = "
            "London's quarter x (the UK's month m / the UK's quarter). The three months of a quarter sum back to London's quarter "
            "(up to the rounding to 1,000).",
            "The UK's monthly pattern is 2023's, not 2025's: the ONS has published no month after June 2024. 2023 is the latest "
            "calendar year published monthly in full and as final estimates; Easter fell in April in 2023 as in 2025 (in March in "
            "2024), so the March and April shares compare.",
            "What it assumes: London's visits fall across a quarter's months as the UK's did in 2023. A London-only event (a month "
            "heavier in London than in the rest of the UK) cannot show. The quarters are provisional, under the survey's new design.",
            "Every row keeps both inputs (London's quarter, the UK's month and quarter) and the unrounded result in `inputs`. Raw "
            "files and their URLs: data/raw/uk5-visitors/SOURCES.md.",
        ],
        "rows": rows})
    return rows, lq


def reading3():
    files = sorted(f for f in os.listdir(f"{RAW}/caa") if f.startswith("caa-table09-"))
    assert len(files) == 12, files
    links = {}
    for line in open(f"{RAW}/SOURCES.md", encoding="utf-8"):
        if line.startswith("| caa/"):
            p = [x.strip() for x in line.strip().strip("|").split("|")]
            links[p[0][4:]] = p[1]
    rows = []
    for fn in files:
        ym = fn[len("caa-table09-"):-4]
        y, mo = ym.split("-")
        rin = list(csv.DictReader(open(f"{RAW}/caa/{fn}", encoding="utf-8-sig")))
        assert all(r["this_period"] == f"{y}{mo}" for r in rin), fn
        sel = [r for r in rin if r["reporting_airport_group_name"] == "London Area Airports"]
        assert sorted(r["reporting_airport_name"] for r in sel) == ["GATWICK", "HEATHROW", "LONDON CITY", "LUTON", "SOUTHEND", "STANSTED"], fn
        src = {"publisher": "Civil Aviation Authority",
               "title": f"UK airport data, {MONTHS[int(mo) - 1]} {y}, Table 09: terminal and transit passengers (CSV)",
               "url": links[fn], "table": f"Table 09, column terminal_pax_this_period; listed on {CAA_PAGE.format(y=y, m=MONTHS[int(mo) - 1].lower())}",
               "licence": CAA_TERMS}
        for r in sorted(sel, key=lambda r: r["reporting_airport_name"]):
            name = r["reporting_airport_name"].title()
            rows.append({
                "item": "airport_passengers_month",
                "geo": {"level": "city", "code": "E12000007", "name": "London"},
                "value": int(r["terminal_pax_this_period"]), "unit": "terminal passengers a month", "year": ym,
                "measure": f"terminal passengers at {name} airport, a month",
                "note": (f"{r['reporting_airport_name']} in the CAA's table, group 'London Area Airports'; terminal passengers join or "
                         f"leave a flight at the airport, residents and visitors together (transit passengers, "
                         f"{int(r['transit_pax_this_period']):,} here, are left out); Source: Civil Aviation Authority, UK airport data; "
                         f"read from {RAW}/caa/{fn}, downloaded {RETRIEVED}"),
                "source": src})
        tot = sum(int(r["terminal_pax_this_period"]) for r in sel)
        rows.append({
            "item": "airport_passengers_month_london",
            "geo": {"level": "city", "code": "E12000007", "name": "London"},
            "value": tot, "unit": "terminal passengers a month", "year": ym,
            "measure": "terminal passengers at the six London airports, a month",
            "note": (f"Computed: the sum of this month's six airport rows of this file (Heathrow, Gatwick, Stansted, Luton, London City, "
                     f"Southend: the CAA's group 'London Area Airports'); residents and visitors together; Source: Civil Aviation "
                     f"Authority, UK airport data; read from {RAW}/caa/{fn}, downloaded {RETRIEVED}"),
            "source": src})
    last = rows[-1]["source"]
    write("uk5-london-airports-month.json", {
        "id": "place-uk5-london-airports-month", "source": last, "retrieved": RETRIEVED,
        "notes": [
            "Source: Civil Aviation Authority, UK airport data (monthly), Table 09. The CAA asks to be referenced in any publication "
            "that refers to its statistics, and that its data is never sold on to a third party: any page using this file names the "
            "Civil Aviation Authority as its source.",
            "Terminal passengers are every person joining or leaving a flight at the airport: London's residents flying out and back "
            "count as well as visitors, and a domestic traveller counts at both ends. This is traffic through London's airports, "
            "not a count of visitors.",
            "The six airports are the CAA's own group 'London Area Airports'. The latest 12 months the CAA has published: September "
            "2025 to August 2026 (August 2026 run on 14 October 2026). Raw files and their URLs: data/raw/uk5-visitors/SOURCES.md.",
        ],
        "rows": rows})
    return rows


if __name__ == "__main__":
    v64 = month_table(F_V64, 10)
    m24 = month_table(F_2024, 10)
    assert set(m24) == {f"2024-{i:02d}" for i in range(1, 7)}, sorted(m24)
    assert not (set(v64) & set(m24))
    r1 = reading1(v64, m24)
    r2, lq = reading2(v64)
    # the three months of each quarter sum back to London's quarter before rounding
    for qi, q in enumerate(["Q1", "Q2", "Q3", "Q4"]):
        s = sum(r["inputs"]["exact"] for r in r2[3 * qi: 3 * qi + 3])
        assert abs(s - lq[q]) < 0.01, (q, s, lq[q])
    r3 = reading3()
