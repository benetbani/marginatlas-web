"""Eurostat non-household energy prices: electricity (nrg_pc_205) and natural gas (nrg_pc_203), a kWh, excluding VAT and other
recoverable taxes, bands IA/IB (electricity) and I1/I2 (gas), the latest two semesters each country publishes."""
import collections, os, sys, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

EURO = {"ME", "XK", "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "EL", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"}
SPEC = {
    "nrg_pc_205": ("energy_price_business", "electricity", "eurostat-electricity-business.json",
                   {"MWH_LT20": "band IA, consumption below 20 MWh a year", "MWH20-499": "band IB, consumption 20 to 499 MWh a year"},
                   "Electricity prices for non-household consumers - bi-annual data (from 2007 onwards) (nrg_pc_205)"),
    "nrg_pc_203": ("gas_price_business", "natural gas", "eurostat-gas-business.json",
                   {"GJ_LT1000": "band I1, consumption below 1,000 GJ a year", "GJ1000-9999": "band I2, consumption 1,000 to 9,999 GJ a year"},
                   "Gas prices for non-household consumers - bi-annual data (from 2007 onwards) (nrg_pc_203)"),
}
SKIP = {"EU28", "EA19", "EA20", "EA"}
NAC = {"HU": "HUF", "PL": "PLN", "CZ": "CZK", "SE": "SEK", "DK": "DKK", "RO": "RON", "NO": "NOK", "IS": "ISK", "RS": "RSD",
       "TR": "TRY", "MK": "MKD", "AL": "ALL", "BA": "BAM", "MD": "MDL", "GE": "GEL", "UA": "UAH", "LI": "CHF", "CH": "CHF"}
ds = sys.argv[1]
item, fuel, fname, bands, title = SPEC[ds]
url = (f"https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{ds}?unit=KWH&tax=X_VAT&currency=EUR&currency=NAC"
       + "".join(f"&nrg_cons={b}" for b in bands) + "&sinceTimePeriod=2024-S1")
path = os.path.join(DL, f"{ds}.json")
urllib.request.urlretrieve(url, path)
by = collections.defaultdict(dict)
names = {}
for k, v, s, lab in jsonstat(path):
    if k["geo"] in SKIP:
        continue
    names[k["geo"]] = lab["geo"][k["geo"]]
    by[(k["geo"], k["nrg_cons"])][(k["time"], k["currency"])] = (v, s)
rows = []
for (g, b), d in sorted(by.items()):
    times = sorted({t for t, c in d if c == "EUR"})[-2:]
    for t in times:
        for cur in ("EUR", "NAC"):
            if (t, cur) not in d or (cur == "NAC" and (g in EURO or g.startswith(("EU", "EA")))):
                continue
            v, s = d[(t, cur)]
            unit_cur = "EUR" if cur == "EUR" else NAC.get(g, "national currency")
            n = [f"Non-household consumers, {bands[b]}; excluding VAT and other recoverable taxes and levies (non-recoverable taxes and levies included)."]
            if cur == "NAC":
                n.append("In the country's own currency as Eurostat publishes it.")
            fn = flagnote(s)
            if fn:
                n.append(fn)
            rows.append({"item": item, "officialClass": f"{fuel}, non-household consumers, {bands[b].split(',')[0]}",
                         "geo": geo_eu(g, names[g]), "value": v, "unit": f"{unit_cur} per kWh", "year": t,
                         "measure": f"average {fuel} price a kWh for a business, {bands[b]}, {t.replace('-S1', ' first half').replace('-S2', ' second half')}",
                         "note": " ".join(n), "currency": cur})
write("business", fname, {
    "id": fname[:-5],
    "source": {"publisher": "Eurostat", "title": title, "url": f"https://ec.europa.eu/eurostat/databrowser/view/{ds}/default/table",
               "table": f"{ds}, unit KWH, tax X_VAT, currency EUR and NAC (NAC only where the country is outside the euro), nrg_cons " + ", ".join(bands) + "; the latest two semesters each country publishes",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
