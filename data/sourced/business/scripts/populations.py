import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
rows = []
for cc in ("GB", "US", "IT", "HU"):
    rows += json.load(open(f"/srv/atlas/runs/data-business/pop_{cc}.json"))
write("populations.json", {
    "id": "populations",
    "source": {"publisher": "National statistical offices (each row names its own: ONS, U.S. Census Bureau, ISTAT, KSH)",
               "title": "Resident population for the boundaries of the business counts, each from the same country's office",
               "url": "https://www.nomisweb.co.uk/datasets/pestsyoala",
               "table": "Each row carries its own source; a per-10,000 figure may only combine a count and a population of the same country, geo code and boundary"},
    "retrieved": RETRIEVED, "rows": rows})
