"""Eurostat household budget survey hbs_str_t223: catering services (CP111) per mille of consumption expenditure by income quintile,
each country's latest wave."""
import collections, os, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

URL = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/hbs_str_t223?coicop=CP111"
path = os.path.join(DL, "hbs223_cp111.json")
urllib.request.urlretrieve(URL, path)
QW = {"QU1": "the lowest fifth", "QU2": "the second fifth", "QU3": "the third fifth", "QU4": "the fourth fifth", "QU5": "the highest fifth"}
by = collections.defaultdict(dict)
names = {}
for k, v, s, lab in jsonstat(path):
    if k["quant_inc"] in QW and k["geo"] not in ("EU15", "EU25", "EU27_2007"):
        by[(k["geo"], k["time"])][k["quant_inc"]] = (v, s)
        names[k["geo"]] = lab["geo"][k["geo"]]
latest = {}
for (g, t), q in by.items():
    if len(q) == 5 and t > latest.get(g, ""):
        latest[g] = t
rows = []
for g, t in sorted(latest.items()):
    for qc, (v, s) in sorted(by[(g, t)].items()):
        n = [f"Household budget survey wave {t}; households ranked by income into fifths."]
        if t < "2015":
            n.append(f"The country's newest wave with every fifth published is {t}.")
        if t == "2020":
            n.append("The 2020 wave's reference year includes the pandemic closures of restaurants and cafes in most countries.")
        fn = flagnote(s)
        if fn:
            n.append(fn)
        rows.append({"item": "eating_out_by_income", "officialClass": "COICOP CP111: Catering services", "geo": geo_eu(g, names[g]),
                     "value": v, "unit": "per 1,000 of household consumption expenditure", "year": t, "quintile": int(qc[2]),
                     "measure": f"catering services (restaurants, cafes, canteens) per 1,000 of consumption expenditure, households in {QW[qc]} by income, {t}",
                     "note": " ".join(n)})
write("place", "eurostat-hbs-eating-out-by-income.json", {
    "id": "eurostat-hbs-eating-out-by-income",
    "source": {"publisher": "Eurostat", "title": "Structure of consumption expenditure by income quintile and COICOP consumption purpose (hbs_str_t223)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/hbs_str_t223/default/table",
               "table": "hbs_str_t223, coicop CP111, unit PM (per mille), quant_inc QU1 to QU5; each country's latest wave with all five fifths",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
print(sorted(latest.items()))
