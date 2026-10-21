"""Indonesia: BPS-Statistics Indonesia, Food and Beverage Service Activities Statistics 2023 (published 23 December 2024),
abstract on the publication page (bps.go.id refuses the server with a Cloudflare challenge: read through the Exa fetch tool).
The publication's provincial tables could not be downloaded (the PDF link needs the site's script). Values typed from the abstract."""
from lib import write, rnd, RETRIEVED

SRC = {"publisher": "BPS-Statistics Indonesia", "title": "Food and Beverage Service Activities Statistics 2023 (Statistik Penyediaan Makanan dan Minuman 2023), catalogue 8204008, abstract",
       "url": "https://www.bps.go.id/en/publication/2024/12/23/f2c7743c4712aaeaa4abf694/food-and-beverage-service-actvities-statistics-2023.html"}
ID = {"level": "country", "code": "ID", "name": "Indonesia"}
OC = "KBLI 2020 food and beverage service activities (restaurants and eateries, mobile food, catering, food stalls, cafes, drink shops and the rest)"
NOTE = ("All food and beverage service businesses, from the 2024 Survey of Food and Beverage Service Activities, reference year 2023. "
        "The abstract rounds the count (4.85 million) and the workers (9.80 million): the derived means carry that rounding. "
        "Restaurants and eateries are 24.75 percent of the businesses. Written under restaurants and under cafes.")
n, w, sales = 4.85e6, 9.80e6, 998.37e12
rows = []
for t in ("restaurants", "cafes"):
    b = dict(trade=t, officialClass=OC, geo=ID, year="2023", source=SRC, note=NOTE)
    rows += [dict(b, item="business_count", value=int(n), unit="businesses", measure="food and beverage service businesses, as published rounded to 4.85 million"),
             dict(b, item="sales_per_business", value=rnd(sales / n), unit="IDR", measure="mean sales per business, derived: 998.37 trillion IDR of sales over 4.85 million businesses (both as published)"),
             dict(b, item="persons_per_business", value=round(w / n, 1), unit="workers per business", measure="workers per business, derived: 9.80 million workers over 4.85 million businesses (both as published, rounded)")]
write("bps-indonesia.json", {"id": "bps-indonesia", "source": dict(SRC, licence="BPS: free use of published statistics with citation of the source (Law 16 of 1997 on Statistics)"),
                             "retrieved": RETRIEVED, "rows": rows})
