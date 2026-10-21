import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/si/"
SURS = "Statistični urad Republike Slovenije (SURS), Statistical Office of Slovenia"
GEO = {"level": "city", "code": "061", "name": "Ljubljana (municipality)"}
rows = [{"item": "business_count", "trade": "all", "officialClass": "SKD 2008, all activities covered by the enterprise statistics", "geo": GEO,
         "value": json.load(open(D + "d1418807.json"))["value"][0], "unit": "enterprises", "year": "2024",
         "measure": "number of enterprises, by municipality, 2024", "note": "The municipal table gives no activity split: the trade classes are not published for Ljubljana.",
         "source": {"publisher": SURS, "title": "Enterprises by municipalities, annually (1418807S)", "url": "https://pxweb.stat.si/SiStatData/pxweb/en/Data/-/1418807S.px"}},
        {"item": "population", "geo": GEO, "value": json.load(open(D + "pop.json"))["value"][0], "unit": "persons", "year": "2025",
         "measure": "population on 1 January 2025", "note": "Same municipality; 1 January 2025 closes the enterprise year 2024.",
         "source": {"publisher": SURS, "title": "Selected data on municipalities, Slovenia, annually (2640010S)", "url": "https://pxweb.stat.si/SiStatData/pxweb/en/Data/-/2640010S.px"}}]
write("si-surs-2024.json", {"id": "eucities-si-surs-2024",
    "source": {"publisher": SURS, "title": "SiStat database: enterprises by municipality; selected data on municipalities", "url": "https://pxweb.stat.si/SiStatData/",
               "table": "PxWeb API https://pxweb.stat.si/SiStatData/api/v1/en/Data/, tables 1418807S (2024) and 2640010S (2025)",
               "licence": "SURS: free reuse with the source given (https://www.stat.si)"},
    "retrieved": RETRIEVED, "rows": rows})
