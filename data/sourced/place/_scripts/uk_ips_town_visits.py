"""ONS Overseas residents' visits to the UK, 2025, Table 17 (top 50 GB cities and towns visited): visits and nights by overseas
residents, all purposes, for six UK catalog cities (London's rows are already in visitors.json, read from the same table).
Usage: python3 uk_ips_town_visits.py <osresidents2025annual.xlsx> <out.json>"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import xlsx

SRC = {"publisher": "Office for National Statistics",
       "title": "Overseas residents' visits to the UK: estimates of overseas residents' visits, spending and nights, 2025 "
                "(Table 17: top 50 Great Britain cities and towns visited)",
       "url": "https://www.ons.gov.uk/file?uri=/peoplepopulationandcommunity/leisureandtourism/datasets/"
              "overseasresidentsvisitstotheuk/2025/osresidents2025annual.xlsx",
       "table": "Table 17, columns 'All Purpose of Visit: Visits' and 'All Purpose of Visit: Nights'",
       "licence": "Open Government Licence v3.0"}
TOWNS = [("Manchester", "E08000003", "Manchester"), ("Birmingham", "E08000025", "Birmingham"), ("Leeds", "E08000035", "Leeds"),
         ("Bristol", "E06000023", "Bristol"), ("Edinburgh", "S12000036", "City of Edinburgh"), ("Glasgow", "S12000049", "Glasgow City")]

def main(src, out):
    c = xlsx.cells(src, "17")
    head = {c[(11, k)].replace(" ", "").replace("\n", ""): k for (r, k) in c if r == 11 and c[(r, k)]}
    kv, kn = head["AllPurposeofVisitVisits"], head["AllPurposeofVisitNights"]
    by = {c[(r, 1)]: r for (r, k) in c if k == 1 and r > 11 and c[(r, k)]}
    rows = []
    for town, code, name in TOWNS:
        r = by[town]
        rank = sorted(by.values()).index(r) + 1
        base = (f"{town} as a city visited, the survey's own place name; "
                f"number {rank} of the top 50 by visits (estimates lower in the list rest on smaller samples, the publisher's note 7); International Passenger Survey, 2025 estimates published 16 October 2026")
        geo = {"level": "city", "code": code, "name": name}
        rows.append({"item": "visitors", "geo": geo, "value": int(c[(r, kv)]), "unit": "visits", "year": "2025",
                     "measure": f"visits to {town} by overseas residents (all purposes)",
                     "note": base + "; completed visits, not visitors: anyone coming more than once is counted on each visit (the publisher's definition)", "source": SRC})
        rows.append({"item": "visitors", "geo": geo, "value": int(c[(r, kn)]), "unit": "nights", "year": "2025",
                     "measure": f"nights spent in {town} by overseas residents (all purposes)", "note": base, "source": SRC})
    json.dump({"id": "place-uk-visitors-ips-2025", "source": SRC, "retrieved": "2026-10-20", "rows": rows},
              open(out, "w"), indent=1, ensure_ascii=False)
    for x in rows: print(x["geo"]["name"], x["value"], x["unit"])

if __name__ == "__main__":
    main(*sys.argv[1:])
