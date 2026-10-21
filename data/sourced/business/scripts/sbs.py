import collections, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *

DL = "/srv/atlas/runs/data-business/dl/"
TRADE = {"I5610": "restaurants", "I5630": "cafes", "S9602": "barbershops", "B-S_X_O_S94": "all",
         "I561": "restaurants", "I563": "cafes", "S960": "barbershops"}
FLAG = {"e": "estimated", "p": "provisional", "b": "break in time series", "u": "low reliability", "d": "definition differs"}

def flagnote(*flags):
    words = sorted({FLAG[c] for f in flags for c in f.replace("|", "") if c in FLAG})
    return ("Eurostat flags a component as: " + ", ".join(words) + ".") if words else None

lab, upd = labels_of(DL + "sbs_ovw_2023.json")
D = collections.defaultdict(dict)
for dims, v, s, _ in jsonstat(DL + "sbs_ovw_2023.json"):
    D[(dims["nace_r2"], dims["geo"])][dims["indic_sbs"]] = (v, s)

rows = []
def row(item, nace, geo, value, unit, measure, note=None, cls=None):
    r = {"item": item, "trade": TRADE[nace], "officialClass": cls or f"NACE Rev. 2 {nace}: {lab['nace_r2'][nace]}",
         "geo": geo_eu(geo, lab["geo"][geo]), "value": value, "unit": unit, "year": "2023", "measure": measure}
    if note: r["note"] = note
    rows.append(r)

for (nace, geo), d in sorted(D.items()):
    g = lambda k: d.get(k, (None, ""))
    ent, ents = g("ENT_NR"); tur, turs = g("NETTUR_MEUR")
    if ent:
        row("business_count", nace, geo, ent, "enterprises", "number of enterprises", flagnote(ents))
    if ent and tur:
        row("sales_per_business", nace, geo, int(round(tur * 1e6 / ent, -2)), "EUR",
            "mean net turnover per enterprise (net turnover divided by the number of enterprises), rounded to 100 EUR",
            " ".join(x for x in [f"Net turnover {tur} million EUR over {int(ent)} enterprises.", flagnote(ents, turs)] if x))
    ppe, ppes = g("EMP_ENT_NR")
    if ppe is not None:
        row("persons_per_business", nace, geo, ppe, "persons employed per enterprise",
            "mean persons employed per enterprise, owners and unpaid family workers included, as published (whole number)", flagnote(ppes))
    gor, gors = g("GOR_PC")
    if gor is not None:
        row("gross_operating_rate", nace, geo, gor, "percent of turnover",
            "gross operating rate: gross operating surplus as a share of turnover, before the owner's own pay, depreciation, interest and tax",
            flagnote(gors))
    for k, item, what in [("EXPN_SAL_BEN_MEUR", "staff_cost_share", "employee benefits expense (wages, salaries and employer social charges)"),
                          ("PUR_MEUR", "purchases_share", "total purchases of goods and services (rent included)")]:
        x, xs = g(k)
        if x is not None and tur:
            row(item, nace, geo, round(100 * x / tur, 1), "percent of net turnover", f"{what} divided by net turnover",
                " ".join(y for y in [f"{x} million EUR over net turnover of {tur} million EUR.", flagnote(xs, turs)] if y))

# size classes (enterprises by persons employed); class detail is published at NACE group level only
SC = collections.defaultdict(dict)
lab2, _ = labels_of(DL + "sbs_sc_2023.json")
for dims, v, s, _ in jsonstat(DL + "sbs_sc_2023.json"):
    SC[(dims["nace_r2"], dims["geo"])][dims["size_emp"]] = (v, s)
CLASSES = ["0_1", "2-9", "10-19", "20-49", "50-249", "GE250"]
for (nace, geo), d in sorted(SC.items()):
    tot = d.get("TOTAL", (None, ""))[0]
    if not tot:
        continue
    for c in CLASSES:
        if c not in d:
            continue
        v, s = d[c]
        note = [f"{int(v)} of {int(tot)} enterprises."]
        if nace == "S960":
            note.append("Published for the whole group 96.0 (other personal services, which includes hairdressing and beauty), not for 96.02 alone.")
        fn = flagnote(s, d["TOTAL"][1])
        if fn: note.append(fn)
        r = {"item": "size_class_share", "trade": TRADE[nace],
             "officialClass": f"NACE Rev. 2 {nace}: {lab2['nace_r2'][nace]}",
             "geo": geo_eu(geo, lab2["geo"][geo]), "value": round(100 * v / tot, 1), "unit": "percent of enterprises",
             "year": "2023", "measure": f"share of enterprises with {lab2['size_emp'][c].replace('From ', '').replace('persons employed or more', 'persons employed or more')}",
             "note": " ".join(note)}
        rows.append(r)

write("eurostat-sbs-2023.json", {
    "id": "eurostat-sbs-2023",
    "source": {"publisher": "Eurostat", "title": "Enterprises by detailed NACE Rev. 2 activity and special aggregates (sbs_ovw_act); Enterprise statistics by size class and NACE Rev. 2 activity (sbs_sc_ovw)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/sbs_ovw_act/default/table",
               "table": f"sbs_ovw_act and sbs_sc_ovw, reference year 2023, dataset updated {upd[:10]}; API https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
c = collections.Counter((r["item"], r["trade"]) for r in rows)
for k, v in sorted(c.items()): print(k, v)
