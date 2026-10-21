import sys, openpyxl, json
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
from js import jsonstat
D = "/srv/atlas/runs/data-eucities/dl/de/"
ABB = "Amt für Statistik Berlin-Brandenburg"
S = {"publisher": ABB, "title": "Statistischer Bericht D II 1 – j / 24: Rechtliche Einheiten und Niederlassungen im Land Berlin 2024 (Stand: Unternehmensregister 30.09.2025), table 14",
     "url": "https://download.statistik-berlin-brandenburg.de/b95aaa817d45ec56/891f6493c29b/SB_D02-01-00_2024j01_BE.xlsx"}
GEO = {"level": "city", "code": "11000", "name": "Berlin (Land and city)"}
wb = openpyxl.load_workbook(D + "SB_BE_2024.xlsx", read_only=True, data_only=True)
T = {}
for r in wb["T14"].iter_rows(values_only=True):
    c = [x for x in r if x is not None]
    if c: T[str(c[0]).strip()] = c
KEEP = [("Insgesamt", "all", "WZ 2008, all sections (Insgesamt)", ""),
        ("56.10", "restaurants", None, " Restaurants, inns, snack bars, cafés and ice-cream parlours together: German cafés sit in this class."),
        ("56.30", "cafes", None, " Bars and pubs serving drinks (Ausschank von Getränken)."),
        ("96.02", "barbershops", None, " Hairdressing and beauty salons together: barbers are not counted apart."),
        ("56", None, None, ""), ("96.0", None, None, "")]
rows = []
for code, trade, cls, extra in KEEP:
    c = T[code]
    v = c[1] if code == "Insgesamt" else c[2]
    label = cls or f"WZ 2008 {code}: {' '.join(str(c[1]).split())}"
    r = {"item": "business_count", "officialClass": label, "geo": GEO, "value": int(v), "unit": "establishments (Niederlassungen)", "year": "2024",
         "measure": "number of establishments (Niederlassungen) with employees subject to social insurance and/or taxable turnover in 2024, statistical business register as of 30 September 2025",
         "note": "Units with neither employees nor turnover above the VAT threshold are not in the register's count." + extra + " Methodological changes with reporting year 2024 (the report's own warning).", "source": S}
    if trade: r["trade"] = trade
    rows.append(r)
obs, lab, upd = jsonstat("/srv/atlas/runs/data-eucities/dl/urb_cpop1.json")
for o, v, s in obs:
    if o["cities"] == "DE001C" and o["indic_ur"] == "DE1001V" and o["time"] == "2025":
        rows.append({"item": "population", "geo": GEO, "value": int(v), "unit": "persons", "year": "2025", "measure": "population on 1 January 2025",
                     "note": "Eurostat Urban Audit city DE001C (Berlin), from the German statistical offices; 1 January 2025 closes the register's reporting year 2024. The state office's own table sits in the login-only regional database.",
                     "source": {"publisher": "Eurostat", "title": "Urban Audit: Population on 1 January by age groups and sex - cities and greater cities (urb_cpop1)", "url": "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/urb_cpop1?format=JSON&lang=EN"}})
write("de-berlin-urs-2024.json", {"id": "eucities-de-berlin-urs-2024",
    "source": {**S, "table": "SB_D02-01-00_2024j01_BE.xlsx, sheet T14 (Niederlassungen nach ausgewählten Gliederungsebenen der WZ2008)",
               "licence": "Creative Commons Namensnennung 3.0 Deutschland (CC BY 3.0 DE), stated in the report's Impressum"},
    "retrieved": RETRIEVED, "rows": rows})
