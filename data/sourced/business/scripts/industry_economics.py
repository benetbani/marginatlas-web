"""Eurostat sbs_ovw_act 2023: how a trade makes its money, for the industry pages' chapter "How it makes money" (his words of
2026-10-21: "where does the margin come from ... how will I actually make money with this business", official figures only).
Restaurants (56.10), beverage serving (56.30), hairdressing and beauty (96.02) and the business economy, every country and the EU.

Items, each read or worked out from the survey's own totals (a worked-out row says how in its note):
  wage_cost_per_hour        employee benefits expense per hour worked by employees (EUR, published)
  value_added_per_hour      value added per hour worked by employees (EUR, published)
  surplus_per_hour          the two above, the second less the first: what an hour of staff time leaves (EUR, worked out)
  surplus_per_business      gross operating surplus over enterprises (EUR, worked out): the year's money left before the owner's
                            own pay, depreciation, interest and tax
  purchases_per_business    purchases of goods and services over enterprises (EUR, worked out)
  staff_cost_per_business   employee benefits expense over enterprises (EUR, worked out)
  employees_per_business    employees over enterprises (worked out); owners_per_business = persons employed less employees, over
                            enterprises (worked out): the owners and unpaid family workers, paid only from the surplus
  fte_share                 employees in full-time equivalents over employees, percent (worked out)
  investment_per_business   gross investment in tangible non-current assets over enterprises (EUR, worked out)
  investment_share_of_surplus  that investment over the gross operating surplus, percent (worked out)
Run: python3 scripts/industry_economics.py"""
import collections, os, urllib.request
from spines_lib import jsonstat, geo_eu, flagnote, write

DL = "/srv/atlas/runs/data-industry/dl"
os.makedirs(DL, exist_ok=True)
TRADE = {"I5610": "restaurants", "I5630": "cafes", "S9602": "barbershops", "B-S_X_O_S94": "all"}
IND = ["ENT_NR", "EMP_NR", "SAL_NR", "SAL_FTE_NR", "NETTUR_MEUR", "PUR_MEUR", "EXPN_SAL_BEN_MEUR", "GOS_MEUR", "GRSINV_TNCA_MEUR",
       "EXPN_SAL_BEN_HW_EUR", "AV_HW_EUR"]
URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_ovw_act?time=2023"
       + "".join(f"&nace_r2={n}" for n in TRADE) + "".join(f"&indic_sbs={i}" for i in IND))
path = os.path.join(DL, "sbs_ovw_act_economics_2023.json")
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
    g = lambda k: d.get(k, (None, ""))[0]
    f = lambda *ks: flagnote(*(d.get(k, (None, ""))[1] for k in ks))
    ent, emp, sal, fte = g("ENT_NR"), g("EMP_NR"), g("SAL_NR"), g("SAL_FTE_NR")
    wh, vh = g("EXPN_SAL_BEN_HW_EUR"), g("AV_HW_EUR")
    if wh is not None:
        row("wage_cost_per_hour", nace, geo, wh, "EUR", "employee benefits expense per hour worked by employees", f("EXPN_SAL_BEN_HW_EUR"))
    if vh is not None:
        row("value_added_per_hour", nace, geo, vh, "EUR", "value added at factor cost per hour worked by employees", f("AV_HW_EUR"))
    if wh is not None and vh is not None:
        row("surplus_per_hour", nace, geo, round(vh - wh, 2), "EUR",
            "what an hour of staff time leaves: value added per hour worked less employee benefits expense per hour",
            " ".join(x for x in [f"Worked out: {vh} less {wh}.", f("EXPN_SAL_BEN_HW_EUR", "AV_HW_EUR")] if x))
    for item, k, what in [("surplus_per_business", "GOS_MEUR", "gross operating surplus (before the owner's own pay, depreciation, interest and tax)"),
                          ("purchases_per_business", "PUR_MEUR", "purchases of goods and services (rent included)"),
                          ("staff_cost_per_business", "EXPN_SAL_BEN_MEUR", "employee benefits expense (wages, salaries, employer social charges)"),
                          ("investment_per_business", "GRSINV_TNCA_MEUR", "gross investment in tangible non-current assets (equipment, fittings, buildings)")]:
        x = g(k)
        if x is not None and ent:
            row(item, nace, geo, int(round(x * 1e6 / ent, -2)), "EUR", f"{what} per enterprise, rounded to 100 EUR",
                " ".join(y for y in [f"Worked out: {x} million EUR over {int(ent)} enterprises.", f(k, "ENT_NR")] if y))
    if sal is not None and ent:
        row("employees_per_business", nace, geo, round(sal / ent, 2), "employees per enterprise", "employees per enterprise",
            " ".join(y for y in [f"Worked out: {int(sal)} employees over {int(ent)} enterprises.", f("SAL_NR", "ENT_NR")] if y))
    if sal is not None and emp is not None and ent:
        row("owners_per_business", nace, geo, round((emp - sal) / ent, 2), "persons per enterprise",
            "persons employed who are not employees (owners and unpaid family workers) per enterprise",
            " ".join(y for y in [f"Worked out: {int(emp)} persons employed less {int(sal)} employees, over {int(ent)} enterprises.", f("EMP_NR", "SAL_NR", "ENT_NR")] if y))
    if fte is not None and sal:
        row("fte_share", nace, geo, round(100 * fte / sal, 1), "percent of employees", "employees in full-time equivalent units over employees",
            " ".join(y for y in [f"Worked out: {int(fte)} full-time equivalents of {int(sal)} employees.", f("SAL_FTE_NR", "SAL_NR")] if y))
    inv, gos = g("GRSINV_TNCA_MEUR"), g("GOS_MEUR")
    if inv is not None and gos:
        row("investment_share_of_surplus", nace, geo, round(100 * inv / gos, 1), "percent of gross operating surplus",
            "gross investment in tangible non-current assets over the gross operating surplus",
            " ".join(y for y in [f"Worked out: {inv} over {gos} million EUR.", f("GRSINV_TNCA_MEUR", "GOS_MEUR")] if y))

write("business", "eurostat-sbs-economics-2023.json", {
    "id": "eurostat-sbs-economics-2023",
    "source": {"publisher": "Eurostat", "title": "Enterprises by detailed NACE Rev. 2 activity and special aggregates (sbs_ovw_act)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/sbs_ovw_act/default/table",
               "table": "sbs_ovw_act, 2023, NACE Rev. 2 56.10, 56.30, 96.02 and B-S_X_O_S94; indicators " + ", ".join(IND),
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": "2026-10-21", "rows": rows})
for r in rows:
    if r["geo"]["code"] == "EU27_2020" and r["trade"] in ("restaurants", "all"):
        print(r["trade"], r["item"], r["value"])
