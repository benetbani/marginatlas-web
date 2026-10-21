"""uk3: yearly entries and exits at the national rail stations of the seven UK catalog cities, ORR Estimates of station
usage April 2024 to March 2025, Table 1415a, summed over the stations the ORR places in the city's local authority (London:
the London region, Greater London). Usage: python3 -I uk3_orr_stations.py ODS OUT_JSON
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ods

URL = "https://dataportal.orr.gov.uk/media/1908/table-1415-time-series-of-passenger-entries-and-exits-and-interchanges-by-station.ods"
COL = "Apr 2024 to Mar 2025"
CITY = {"London": ("E12000007", ("region", "London")), "Manchester": ("E08000003", ("la", "Manchester")),
        "Birmingham": ("E08000025", ("la", "Birmingham")), "Leeds": ("E08000035", ("la", "Leeds")),
        "Bristol": ("E06000023", ("la", "Bristol, City of")), "Edinburgh": ("S12000036", ("la", "City of Edinburgh")),
        "Glasgow": ("S12000049", ("la", "Glasgow City"))}


def main(path, out):
    R = ods.rows(path, "1415a_Entries_and_Exits")
    h = R[3]
    c, ireg, ila = h.index(COL), h.index("Region"), h.index("Local authority: district or unitary")
    rows = []
    for city, (code, (kind, key)) in CITY.items():
        st = []
        for r in R[4:]:
            if len(r) <= c or r[ireg if kind == "region" else ila] != key:
                continue
            try:
                st.append((float(r[c]), r[1]))
            except ValueError:
                pass  # [x] or [z]: a station with no mainline service that year
        tot = round(sum(v for v, _ in st))
        top = ", ".join(f"{n} {round(v):,}" for v, n in sorted(st, reverse=True)[:3])
        where = ("the stations the ORR places in the London region (Greater London, all 33 boroughs)" if kind == "region"
                 else f"the stations the ORR places in the local authority '{key}'")
        rows.append({"item": "connectivity_rail_passengers", "geo": {"level": "city", "code": code, "name": city},
                     "value": tot, "unit": "entries and exits a year", "year": "2024-25",
                     "measure": "entries and exits a year at the national rail stations inside the city",
                     "note": (f"Computed: the sum over {len(st)} stations of the publisher's own station estimates, {where}; "
                              f"the three largest: {top}; April 2024 to March 2025; a journey counts once where it enters and once "
                              f"where it leaves; national rail only (London Underground-only stations, trams and metros are not in "
                              f"the table; Elizabeth line and Overground stations are); the ORR's estimates come from ticket sales "
                              f"and local ticketing data")})
    d = {"id": "place-uk3-orr-stations-2024-25",
         "source": {"publisher": "Office of Rail and Road",
                    "title": "Estimates of station usage, April 2024 to March 2025, Table 1415a: time series of passenger entries and exits by station, Great Britain (published 4 December 2025)",
                    "url": URL, "table": f"Table 1415a, column '{COL}', grouped by 'Region' (London) or 'Local authority: district or unitary'",
                    "licence": "Open Government Licence v3.0"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in rows: print(r["geo"]["name"], r["value"], r["note"][:60])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
