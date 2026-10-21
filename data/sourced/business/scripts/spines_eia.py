"""US EIA: commercial electricity (Electric Power Monthly tables 5.6.A and 5.6.B), commercial natural gas (monthly),
No 2 diesel retail (weekly), California and the US, read from the EIA's own HTML tables."""
import html, os, re, urllib.request
from spines_lib import DL, RETRIEVED, write

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
PAGES = {"epm_5_6_a.html": "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a",
         "epm_5_6_b.html": "https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_b",
         "gas_ca.html": "https://www.eia.gov/dnav/ng/hist/n3020ca3m.htm",
         "gas_us.html": "https://www.eia.gov/dnav/ng/hist/n3020us3m.htm",
         "diesel_ca.html": "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMD_EPD2D_PTE_SCA_DPG&f=W",
         "diesel_us.html": "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=EMD_EPD2D_PTE_NUS_DPG&f=W"}


def table(name):
    p = os.path.join(DL, "us", name)
    if not os.path.exists(p):
        open(p, "wb").write(urllib.request.urlopen(urllib.request.Request(PAGES[name], headers=UA)).read())
    s = open(p, encoding="utf-8", errors="replace").read()
    return [[html.unescape(re.sub(r"<[^>]*>", "", x)).replace("\xa0", " ").strip() for x in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", r, re.S)]
            for r in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S)]


GEO = {"California": {"level": "region", "code": "06", "name": "California"}, "U.S. Total": {"level": "country", "code": "US", "name": "United States"}}
MON = {m: i + 1 for i, m in enumerate("January February March April May June July August September October November December".split())}
rows = []
for name, words, tid in (("epm_5_6_a.html", "the month", "5.6.A"), ("epm_5_6_b.html", "the year to date", "5.6.B")):
    t = table(name)
    hdr = next(r for r in t if r and r[0].startswith("Census Division"))
    for r in t:
        if r and r[0] in GEO:
            for col in (3, 4):  # commercial: this year, last year
                lab = hdr[col]
                m = re.match(r"(\w+) (\d{4})( YTD)?", lab)
                yr = f"{m.group(2)}-{MON[m.group(1)]:02d}" if not m.group(3) else f"{m.group(2)}-01 to {m.group(2)}-{MON[m.group(1)]:02d}"
                span = f"{m.group(1)} {m.group(2)}" if not m.group(3) else f"January to {m.group(1)} {m.group(2)}"
                rows.append({"item": "energy_price_business", "officialClass": "electricity, commercial sector (end-use)", "geo": GEO[r[0]],
                             "value": float(r[col]), "unit": "USD cents per kWh", "year": yr,
                             "measure": f"average price of electricity to commercial customers, {span}" + (" (year to date)" if m.group(3) else ""),
                             "note": f"Revenue divided by sales, all commercial customers; preliminary estimates (EIA Electric Power Monthly table {tid}, {words})."})
MSHORT = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
for name, geo, nm in (("gas_ca.html", GEO["California"], "California"), ("gas_us.html", GEO["U.S. Total"], "United States")):
    t = [r for r in table(name) if r and re.match(r"^\d{4}$", r[0])]
    pts = [(f"{r[0]}-{i:02d}", v) for r in t for i, v in enumerate(r[1:13], 1)]
    pts = [(k, v) for k, v in pts if v not in ("", "NA", "W", "-", "--")][-3:]
    for k, v in pts:
        rows.append({"item": "gas_price_business", "officialClass": "natural gas sold to commercial consumers", "geo": geo,
                     "value": float(v), "unit": "USD per thousand cubic feet", "year": k,
                     "measure": f"average price of natural gas sold to commercial consumers, {nm}, {MSHORT[int(k[5:]) - 1]} {k[:4]}",
                     "note": "Published per thousand cubic feet, not per kWh; not converted. Months the EIA marks NA are not written."})
for name, geo, nm in (("diesel_ca.html", GEO["California"], "California"), ("diesel_us.html", GEO["U.S. Total"], "United States")):
    t = [r for r in table(name) if r and re.match(r"^\d{4}-\w{3}$", r[0])]
    last = t[-1]
    pairs = [(last[i], last[i + 1]) for i in range(1, len(last) - 1, 2) if last[i] and last[i + 1]]
    md, v = pairs[-1]
    week = f"{last[0][:4]}-{md[:2]}-{md[3:5]}"
    rows.append({"item": "diesel_price", "officialClass": "No 2 diesel, retail (all types)", "geo": geo, "value": float(v),
                 "unit": "USD per gallon", "year": week,
                 "measure": f"average retail price of No 2 diesel, {nm}, week of {week}",
                 "note": "Retail pump price with all taxes; published per US gallon (3.785 litres), not converted."})
write("business", "us-eia-energy-prices.json", {
    "id": "us-eia-energy-prices",
    "source": {"publisher": "U.S. Energy Information Administration", "title": "Electric Power Monthly; Natural Gas Prices; Gasoline and Diesel Fuel Update",
               "url": "https://www.eia.gov/electricity/monthly/",
               "table": "; ".join(f"{k}: {v}" for k, v in PAGES.items()),
               "licence": "US federal work, public domain (EIA copyright and reuse page)"},
    "retrieved": RETRIEVED, "rows": rows})
