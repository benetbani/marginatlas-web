"""uk3: the connectivity and visitor pull indices of the seven UK catalog cities, worked from rows already held, by the method
of README-uk3-indices.md (fixed log-scale anchors). Usage: python3 -I uk3_indices.py PLACE_DIR BUSINESS_DIR connectivity|visitor
"""
import json, math, os, sys

AIR, RAIL, PULL = (1e5, 1e9), (1e6, 1e10), (0.1, 10.0)
CITIES = [("E12000007", "London"), ("E08000003", "Manchester"), ("E08000025", "Birmingham"), ("E08000035", "Leeds"),
          ("E06000023", "Bristol"), ("S12000036", "Edinburgh"), ("S12000049", "Glasgow")]
CAA = {"publisher": "Civil Aviation Authority", "title": "UK airport data, annual 2025, Table 09 (terminal passengers)",
       "url": "https://www.caa.co.uk/Documents/Download/24007/87fb7670-4e10-4aeb-942d-509238aa25a1/17551"}
ORR = {"publisher": "Office of Rail and Road", "title": "Estimates of station usage, April 2024 to March 2025, Table 1415a",
       "url": "https://dataportal.orr.gov.uk/media/1908/table-1415-time-series-of-passenger-entries-and-exits-and-interchanges-by-station.ods"}
ONS_IPS = {"publisher": "Office for National Statistics", "title": "Overseas residents' visits to the UK 2025 (Table 17), with the ONS mid-2025 population estimates",
           "url": "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/leisureandtourism/datasets/overseasresidentsvisitstotheuk/2025/osresidents2025annual.xlsx"}


def score(x, lo_hi):
    lo, hi = lo_hi
    return max(0.0, min(100.0, 100 * (math.log10(x) - math.log10(lo)) / (math.log10(hi) - math.log10(lo))))


def load(path):
    return json.load(open(path, encoding="utf-8"))


def one(rows, item, code, **kw):
    hit = [r for r in rows if r["item"] == item and r["geo"]["code"] == code and all(r.get(k) == v for k, v in kw.items())]
    assert len(hit) == 1, (item, code, kw, len(hit))
    return hit[0]


def pill(v):
    return "High" if v >= 67 else "Medium" if v >= 34 else "Low"


def connectivity(place):
    air = load(os.path.join(place, "uk3-caa-airports-2025.json"))["rows"]
    rail = load(os.path.join(place, "uk3-orr-stations-2024-25.json"))["rows"]
    rows = []
    for code, name in CITIES:
        a, r = one(air, "connectivity_air_passengers", code), one(rail, "connectivity_rail_passengers", code)
        sa, sr = score(a["value"], AIR), score(r["value"], RAIL)
        idx = round((sa + sr) / 2)
        g = {"level": "city", "code": code, "name": name}
        rows.append({"item": "connectivity_air_score", "geo": g, "value": round(sa, 1), "unit": "points out of 100", "year": "2025",
                     "measure": "air part of the connectivity index",
                     "note": (f"Computed: {a['value']:,} terminal passengers (connectivity_air_passengers, uk3-caa-airports-2025.json) "
                              f"on the log scale from 100,000 (0) to 1,000,000,000 (100), README-uk3-indices.md"), "source": CAA})
        rows.append({"item": "connectivity_rail_score", "geo": g, "value": round(sr, 1), "unit": "points out of 100", "year": "2024-25",
                     "measure": "rail part of the connectivity index",
                     "note": (f"Computed: {r['value']:,} entries and exits (connectivity_rail_passengers, uk3-orr-stations-2024-25.json) "
                              f"on the log scale from 1,000,000 (0) to 10,000,000,000 (100), README-uk3-indices.md"), "source": ORR})
        rows.append({"item": "connectivity_index", "geo": g, "value": idx, "unit": "index out of 100", "year": "2025",
                     "measure": f"connectivity index, the mean of its air and rail parts ({pill(idx)}: High from 67, Medium 34 to 66, Low to 33)",
                     "note": (f"Computed: the mean of the air part {sa:.1f} (airport passengers 2025) and the rail part {sr:.1f} "
                              f"(station entries and exits, April 2024 to March 2025), rounded; its parts are the rows "
                              f"connectivity_air_score and connectivity_rail_score of this file; the year is the newer part's; "
                              f"method in README-uk3-indices.md"),
                     "source": {"publisher": "Civil Aviation Authority and Office of Rail and Road (worked by the method of README-uk3-indices.md)",
                                "title": "Connectivity index: airport passengers (CAA annual 2025, Table 09) and station entries and exits (ORR 2024-25, Table 1415a)",
                                "url": CAA["url"]}})
    return {"id": "place-uk3-connectivity-index-2025",
            "source": {"publisher": "Each row's own issuer (see the row's source); worked by the method of data/sourced/place/README-uk3-indices.md",
                       "title": "Connectivity index of the UK catalog cities, 0 to 100, with its air and rail parts", "url": CAA["url"]},
            "retrieved": "2026-10-20", "rows": rows}


def visitor(place, business):
    vis = load(os.path.join(place, "visitors.json"))["rows"] + load(os.path.join(place, "uk-visitors-ips-2025.json"))["rows"]
    pop = load(os.path.join(business, "populations.json"))["rows"]
    rows = []
    for code, name in CITIES:
        v = one(vis, "visitors", code, unit="visits", year="2025")
        p = one(pop, "population", code, year="2025")
        vf = "visitors.json" if code == "E12000007" else "uk-visitors-ips-2025.json"
        ratio = v["value"] / p["value"]
        s = round(score(ratio, PULL))
        g = {"level": "city", "code": code, "name": name}
        base = (f"{v['value']:,} visits by overseas residents in 2025 (visitors, unit visits, {vf}) over {p['value']:,} residents "
                f"at mid-2025 (population, data/sourced/business/populations.json)")
        bound = (f"the survey names {name} as a town visited, while the population is "
                 f"{'the London region' if code == 'E12000007' else 'the local authority'}'s; the survey does not state its area")
        rows.append({"item": "visitor_pull_ratio", "geo": g, "value": round(ratio, 2), "unit": "overseas visits per resident a year",
                     "year": "2025", "measure": "overseas visits a year for each resident",
                     "note": f"Computed: {base}; {bound}", "source": ONS_IPS})
        rows.append({"item": "visitor_pull_index", "geo": g, "value": s, "unit": "index out of 100", "year": "2025",
                     "measure": f"visitor pull index ({pill(s)}: High from 67, Medium 34 to 66, Low to 33)",
                     "note": (f"Computed: {ratio:.3f} visits per resident (the row visitor_pull_ratio of this file: {base}) on the log "
                              f"scale from 0.1 (0) to 10 (100), one visit per resident scoring 50; {bound}; method in README-uk3-indices.md"),
                     "source": ONS_IPS})
    return {"id": "place-uk3-visitor-pull-index-2025",
            "source": {"publisher": "Office for National Statistics (visits and population); worked by the method of data/sourced/place/README-uk3-indices.md",
                       "title": "Visitor pull index of the UK catalog cities, 0 to 100, with its ratio", "url": ONS_IPS["url"]},
            "retrieved": "2026-10-20", "rows": rows}


if __name__ == "__main__":
    place, business, which = sys.argv[1:4]
    d = connectivity(place) if which == "connectivity" else visitor(place, business)
    out = os.path.join(place, "uk3-connectivity-index-2025.json" if which == "connectivity" else "uk3-visitor-pull-index-2025.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in d["rows"]: print(r["item"], r["geo"]["name"], r["value"])
