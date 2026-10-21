"""Eurostat sbs_ovw_act 2023: the trades next door to restaurants, NACE Rev. 2 section I (accommodation and food service), every
class but the two already in eurostat-sbs-2023.json (56.10 restaurants, 56.30 beverage serving), for the industry page's
`02 benchmark` (MODEL 8.7: the trade against the four nearest classes of its section, one survey). Same indicators and the same
arithmetic as sbs.py, so a row here reads like a row there. Run: python3 scripts/industry_section_i.py"""
import collections, os, urllib.request
from spines_lib import jsonstat, geo_eu, flagnote, write

DL = "/srv/atlas/runs/data-industry/dl"
os.makedirs(DL, exist_ok=True)
RETRIEVED = "2026-10-21"
TRADE = {"I5510": "hotels", "I5520": "holiday_lets", "I5530": "camping", "I5590": "other_accommodation",
         "I5621": "event_catering", "I5629": "contract_catering"}
IND = ["ENT_NR", "NETTUR_MEUR", "EMP_ENT_NR", "GOR_PC", "EXPN_SAL_BEN_MEUR", "PUR_MEUR"]
URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?time=2023"
       + "".join(f"&nace_r2={n}" for n in TRADE) + "".join(f"&indic_sbs={i}" for i in IND))
path = os.path.join(DL, "sbs_ovw_act_section_I_2023.json")
urllib.request.urlretrieve(URL, path)

D, LAB = collections.defaultdict(dict), {}
for dims, v, s, lab in jsonstat(path):
    D[(dims["nace_r2"], dims["geo"])][dims["indic_sbs"]] = (v, s)
    LAB = lab
rows = []


def row(item, nace, geo, value, unit, measure, note=None):
    r = {"item": item, "trade": TRADE[nace], "officialClass": f"NACE Rev. 2 {nace}: {LAB['nace_r2'][nace]}",
         "geo": geo_eu(geo, LAB["geo"][geo]), "value": value, "unit": unit, "year": "2023", "measure": measure}
    if note:
        r["note"] = note
    rows.append(r)


for (nace, geo), d in sorted(D.items()):
    g = lambda k: d.get(k, (None, ""))
    ent, ents = g("ENT_NR")
    tur, turs = g("NETTUR_MEUR")
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

write("business", "eurostat-sbs-section-i-2023.json", {
    "id": "eurostat-sbs-section-i-2023",
    "source": {"publisher": "Eurostat", "title": "Enterprises by detailed NACE Rev. 2 activity and special aggregates (sbs_ovw_act)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/sbs_ovw_act/default/table",
               "table": "sbs_ovw_act, 2023, NACE Rev. 2 55.10, 55.20, 55.30, 55.90, 56.21, 56.29; indicators " + ", ".join(IND),
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
eu = {r["trade"]: r["value"] for r in rows if r["geo"]["code"] == "EU27_2020" and r["item"] == "gross_operating_rate"}
print("EU gross operating rate:", eu)
print(collections.Counter((r["trade"], r["item"]) for r in rows).most_common(40))
