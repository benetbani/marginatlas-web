"""uk3: yearly terminal passengers of the airports serving the seven UK catalog cities, CAA annual airport data 2025, Table 09.

The rule (README-uk3-indices.md): the CAA's own group under the city's name (London Area Airports), else the airport whose
name in the CAA's list carries the city's name. One row an airport, then the city's sum. Usage: python3 -I uk3_caa_airports.py CSV OUT
"""
import csv, json, sys

URL = "https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17551"
PAGE = "https://www.caa.co.uk/data-and-analysis/uk-aviation-market/airports/uk-airport-data/uk-airport-data-2025/annual-2025/"
CITY = {"London": ("E12000007", None), "Manchester": ("E08000003", "MANCHESTER"), "Birmingham": ("E08000025", "BIRMINGHAM"),
        "Leeds": ("E08000035", "LEEDS BRADFORD"), "Bristol": ("E06000023", "BRISTOL"), "Edinburgh": ("S12000036", "EDINBURGH"),
        "Glasgow": ("S12000049", "GLASGOW")}


def main(path, out):
    rows_in = list(csv.DictReader(open(path, encoding="utf-8-sig")))
    assert all(r["this_period"] == "2025" for r in rows_in)
    rows = []
    for city, (code, apt) in CITY.items():
        if apt is None:
            sel = [r for r in rows_in if r["rpt_apt_grp_name"] == "London Area Airports"]
            how = "the CAA's own group 'London Area Airports'"
        else:
            sel = [r for r in rows_in if r["rpt_apt_name"] == apt]
            how = f"the airport the CAA lists as {apt}, the one carrying the city's name"
        assert sel, city
        for r in sel:
            rows.append({"item": "airport_passengers", "geo": {"level": "city", "code": code, "name": city},
                         "value": int(r["term_pax_tp"]), "unit": "terminal passengers a year", "year": "2025",
                         "measure": f"terminal passengers at {r['rpt_apt_name'].title()} airport",
                         "note": (f"{r['rpt_apt_name']} in the CAA's table, group '{r['rpt_apt_grp_name']}'; terminal passengers are "
                                  f"people joining or leaving a flight at the airport (a domestic traveller counts at both ends; transit "
                                  f"passengers, {int(r['tran_pax_tp']):,} here, are left out); calendar year 2025")})
        tot = sum(int(r["term_pax_tp"]) for r in sel)
        parts = ", ".join(f"{r['rpt_apt_name'].title()} {int(r['term_pax_tp']):,}" for r in sel)
        rows.append({"item": "connectivity_air_passengers", "geo": {"level": "city", "code": code, "name": city},
                     "value": tot, "unit": "terminal passengers a year", "year": "2025",
                     "measure": "terminal passengers a year at the airports serving the city",
                     "note": (f"Computed: the sum of {len(sel)} airport row{'s' if len(sel) > 1 else ''} of this file ({parts}); the "
                              f"airports are {how} (README-uk3-indices.md)")})
    d = {"id": "place-uk3-caa-airports-2025",
         "source": {"publisher": "Civil Aviation Authority",
                    "title": "UK airport data, annual 2025, Table 09: terminal and transit passengers 2025 compared with 2024 (CSV)",
                    "url": URL, "table": f"Table 09, column term_pax_tp; listed on {PAGE}",
                    "licence": "CAA conditions on the data page: no statistical data provided by CAA may be sold on to a third party, and CAA insists that it is referenced in any publication that refers to CAA statistics (no open licence is named)"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in rows:
        if r["item"] == "connectivity_air_passengers": print(r["geo"]["name"], r["value"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
