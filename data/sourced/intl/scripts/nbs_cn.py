"""China: National Bureau of Statistics, China Statistical Yearbook 2025, table 17-5 'Main Indicators of Enterprises above
Designated Size of Catering Services by Region (2024)'. The yearbook publishes this table only as an image
(https://www.stats.gov.cn/sj/ndsj/2025/html/E17-05.jpg, copy in /srv/atlas/runs/data-intl/dl/cn): values typed from it."""
from lib import write, rnd, RETRIEVED

SRC = {"publisher": "National Bureau of Statistics of China", "title": "China Statistical Yearbook 2025, table 17-5: Main Indicators of Enterprises above Designated Size of Catering Services by Region (2024)",
       "url": "https://www.stats.gov.cn/sj/ndsj/2025/html/E17-05.jpg"}
OC = "China industrial classification, catering services (餐饮业: formal meals, fast food, beverage and other catering services), corporate enterprises above designated size"
NOTE = ("Only corporate enterprises above the NBS's designated size for catering: most small restaurants and all individual businesses "
        "are outside this count. Catering covers meals, fast food and beverage services (tea and coffee houses) together: written under restaurants and under cafes. "
        "Values typed from the yearbook's table image.")
# region: (geo level, code, name, enterprises, persons, revenue 100m yuan, total profits 100m yuan)
R = [("country", "CN", "China", 74664, 3605373, 11839.2, 288.8),
     ("city", "CN-BJ", "Beijing (municipality)", 3493, 283415, 1158.1, 2.2),
     ("city", "CN-TJ", "Tianjin (municipality)", 888, 65076, 197.4, 6.9),
     ("city", "CN-SH", "Shanghai (municipality)", 2914, 326976, 1357.4, 25.0),
     ("city", "CN-CQ", "Chongqing (municipality, rural counties included)", 1590, 62026, 224.5, 13.4),
     ("region", "CN-JS", "Jiangsu (Nanjing's province)", 7643, 350568, 1193.6, 32.2),
     ("region", "CN-ZJ", "Zhejiang (Hangzhou's province)", 4173, 220279, 802.0, 5.2),
     ("region", "CN-HB", "Hubei (Wuhan's province)", 6134, 182963, 592.2, 33.8),
     ("region", "CN-GD", "Guangdong (Guangzhou, Shenzhen, Dongguan's province)", 10190, 606300, 1806.9, -9.7),
     ("region", "CN-SC", "Sichuan (Chengdu's province)", 4388, 232019, 677.2, 99.8),
     ("region", "CN-SN", "Shaanxi (Xi'an's province)", 2288, 100874, 283.9, 6.3)]
rows = []
for lvl, code, name, n, p, rev, prof in R:
    g = {"level": lvl, "code": code, "name": name}
    for t in ("restaurants", "cafes"):
        b = dict(trade=t, officialClass=OC, geo=g, year="2024", source=SRC)
        rows += [
            dict(b, item="business_count", value=n, unit="corporate enterprises above designated size", measure="number of corporate enterprises above designated size, catering", note=NOTE),
            dict(b, item="sales_per_business", value=rnd(rev * 1e8 / n), unit="CNY", measure="mean business revenue per enterprise above designated size, derived from two published figures",
                 note=f"Business revenue {rev:,.1f} hundred million CNY over {n:,} enterprises. " + NOTE),
            dict(b, item="persons_per_business", value=round(p / n, 1), unit="persons employed per enterprise", measure="persons employed at year-end per enterprise, derived", note=f"{p:,} persons over {n:,} enterprises. " + NOTE),
            dict(b, item="pretax_profit_margin", value=round(100 * prof / rev, 1), unit="percent of business revenue", measure="total profits (before income tax) divided by business revenue, derived. Not a gross operating rate",
                 note=f"Total profits {prof:,.1f} over revenue {rev:,.1f} hundred million CNY. " + NOTE),
        ]
write("nbs-china.json", {"id": "nbs-china", "source": dict(SRC, licence="National Bureau of Statistics of China: published statistics, reuse with citation of the source"),
                         "retrieved": RETRIEVED, "rows": rows})
