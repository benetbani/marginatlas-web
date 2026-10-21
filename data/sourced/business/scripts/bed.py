import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
# Transcribed from the publisher's text files (fetched through the web fetch tool: bls.gov refuses this server).
# Each cohort: birth year (year ended March) -> list of (surviving establishments, printed survival rate since birth), ages 0..n
T = {
 "72": {2020: [(50259, 100.0), (42947, 85.5), (40269, 80.1), (36261, 72.1), (32956, 65.6), (29826, 59.3)],
        2021: [(43571, 100.0), (37728, 86.6), (33286, 76.4), (29841, 68.5), (26924, 61.8)],
        2022: [(53659, 100.0), (46258, 86.2), (40960, 76.3), (36579, 68.2)],
        2023: [(58006, 100.0), (50303, 86.7), (44314, 76.4)],
        2024: [(57581, 100.0), (49090, 85.3)]},
 "81": {2020: [(40638, 100.0), (34617, 85.2), (32122, 79.0), (29196, 71.8), (26628, 65.5), (24374, 60.0)],
        2021: [(43039, 100.0), (35835, 83.3), (32002, 74.4), (28945, 67.3), (26154, 60.8)],
        2022: [(50727, 100.0), (43178, 85.1), (38472, 75.8), (34300, 67.6)],
        2023: [(52757, 100.0), (44897, 85.1), (39460, 74.8)],
        2024: [(50097, 100.0), (41372, 82.6)]},
 "00": {2020: [(767573, 100.0), (621249, 80.9), (554747, 72.3), (488169, 63.6), (439219, 57.2), (394689, 51.4)],
        2021: [(839297, 100.0), (663801, 79.1), (562531, 67.0), (495621, 59.1), (439753, 52.4)],
        2022: [(1065228, 100.0), (812349, 76.3), (690200, 64.8), (599752, 56.3)],
        2023: [(1049106, 100.0), (820039, 78.2), (691774, 65.9)],
        2024: [(988310, 100.0), (769449, 77.9)]},
}
NAME = {"72": "Accommodation and Food Services", "81": "Other Services (except Public Administration)", "00": "Total Private"}
TRADES = {"72": ["restaurants", "cafes"], "81": ["barbershops"], "00": ["all"]}
NOTE = {"72": "Whole sector NAICS 72: hotels and all food and drink places together.", "81": "Whole sector NAICS 81: repair, personal care, laundry, religious and civic organisations and others.", "00": "All private industries."}
rows = []
for n, cohorts in T.items():
    for born, seq in cohorts.items():
        base = seq[0][0]
        for age, (surv, rate) in enumerate(seq):
            assert abs(100 * surv / base - rate) < 0.06, (n, born, age, surv, rate)
            if age not in (1, 2, 3, 5):
                continue
            for t in TRADES[n]:
                rows.append({"item": f"survival_{age}y", "trade": t, "officialClass": f"NAICS {n if n != '00' else ''}{': ' if n != '00' else ''}{NAME[n]}",
                             "geo": {"level": "country", "code": "US", "name": "United States"}, "value": rate,
                             "unit": "percent of establishments opened", "year": str(born + age),
                             "measure": f"{age}-year survival rate since birth of private establishments opened in the year ended March {born} (as of March {born + age})",
                             "note": f"{NOTE[n]} Establishments with employees, not firms. {surv} of {base} establishments still operating.",
                             "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": f"Business Employment Dynamics, Table 7. Survival of private sector establishments by opening year, {NAME[n]}",
                                        "url": f"https://www.bls.gov/bdm/us_age_naics_{n}_table7.txt"}})
write("us-bls-bed.json", {
    "id": "us-bls-bed",
    "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": "Business Employment Dynamics, establishment age and survival data, Table 7",
               "url": "https://www.bls.gov/bdm/bdmage.htm",
               "table": "us_age_naics_72_table7.txt, us_age_naics_81_table7.txt, us_age_naics_00_table7.txt (latest data March 2025); cohorts opened in the years ended March 2020 to March 2024",
               "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"},
    "retrieved": RETRIEVED, "rows": rows})
for r in rows:
    if r["year"] == "2025" and r["trade"] in ("restaurants", "barbershops", "all"): print(r["trade"], r["item"], r["value"])
