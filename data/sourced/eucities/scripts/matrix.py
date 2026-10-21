import json, glob, os, collections
D = "/srv/atlas/wc/wt-data-eucities/data/sourced/eucities/"
cat = json.load(open("/srv/atlas/wc/wt-data-eucities/data/cities/city_list_v1.json"))["cities"]
eu = [c for c in cat if c["continent"] == "Europe"]
# map file+geo code to catalog slug
MAP = {"fr-sirene-2026.json": {"75056": "paris", "69123": "lyon", "13055": "marseille", "44109": "nantes", "06088": "nice", "31555": "toulouse"},
       "nl-cbs-2026.json": {"GM0363": "amsterdam", "GM0599": "rotterdam", "CR23": "amsterdam", "CR29": "rotterdam"},
       "ch-bfs-2024.json": {"261": "zurich", "351": "bern", "2701": "basel", "6621": "geneva", "CH-ZH": "zurich", "CH-BE": "bern", "CH-BS": "basel", "CH-GE": "geneva"},
       "pl-gus-2025.json": {"1465011": "warsaw", "1261011": "krakow"},
       "dk-dst-2024.json": {"101": "copenhagen", "DK-PROV-01": "copenhagen"},
       "se-scb-2024.json": {"0180": "stockholm", "SE-AB": "stockholm"},
       "at-statistik-austria.json": {"AT-9": "vienna"},
       "cz-csu-2026.json": {"CZ010": "prague"},
       "no-ssb-2026.json": {"0301": "oslo"},
       "be-statbel-2024.json": {"21004": "brussels", "BE-BRU": "brussels"},
       "es-ine-2025.json": {"08019": "barcelona", "28079": "madrid", "41091": "seville", "46250": "valencia"},
       "pt-ine.json": {"1106": "lisbon", "1312": "porto", "PT1A0": "lisbon", "PT11A": "porto"},
       "de-berlin-urs-2024.json": {"11000": "berlin"},
       "ie-cso-2024.json": {"IE-D": "dublin"},
       "fi-statfin-2024.json": {"091": "helsinki", "FI-MK01": "helsinki"},
       "si-surs-2024.json": {"061": "ljubljana"}}
URB = {"DE001C": "berlin", "DE004C": "cologne", "DE011C": "dusseldorf", "DE005C": "frankfurt", "DE002C": "hamburg", "DE008C": "leipzig", "DE003C": "munich", "DE007C": "stuttgart",
       "FR001C": "paris", "FR002C": "lyon", "FR004C": "marseille", "FR007C": "nantes", "FR008C": "nice", "FR006C": "toulouse", "ES001C": "madrid", "ES002C": "barcelona", "ES004C": "seville",
       "ES003C": "valencia", "CH002C": "zurich", "CH003C": "geneva", "CH004C": "basel", "CH001C": "bern", "NL001C": "amsterdam", "NL037C": "rotterdam", "PL001C": "warsaw", "PL003C": "krakow",
       "PT001C": "lisbon", "PT002C": "porto", "AT001C": "vienna", "BE001C": "brussels", "CZ001C": "prague", "SE001C": "stockholm", "DK001C": "copenhagen", "IE001C": "dublin",
       "EL001C": "athens", "EE001C": "tallinn", "LV001C": "riga", "LT001C": "vilnius", "FI001C": "helsinki", "SI001C": "ljubljana", "SK001C": "bratislava", "RO001C": "bucharest",
       "BG001C": "sofia", "HR001C": "zagreb", "MT001C": "valletta", "CY001C": "nicosia", "NO001C": "oslo"}
LV = {"city": "c", "metro": "m", "county": "k", "region": "r"}
info = collections.defaultdict(lambda: collections.defaultdict(set))
for f in sorted(glob.glob(D + "*.json")):
    n = os.path.basename(f); d = json.load(open(f))
    for r in d["rows"]:
        code = r["geo"]["code"]
        slug = URB.get(code) if n == "eurostat-urban-audit.json" else MAP.get(n, {}).get(code)
        if not slug: continue
        lv = LV.get(r["geo"]["level"], r["geo"]["level"])
        if r["item"] in ("business_count",) and r.get("trade"):
            whole = "whole division" in (r.get("note") or "")
            info[slug][r["trade"]].add(lv + ("*" if whole else ""))
        elif r["item"] == "population":
            info[slug]["pop"].add(lv + ("(UA)" if n == "eurostat-urban-audit.json" else ""))
        elif r["item"] == "visitors":
            info[slug]["vis"].add(lv + ("(UA)" if n == "eurostat-urban-audit.json" else "") + f" {r['year']}")
def cell(s): return ",".join(sorted(s)) if s else "-"
out = ["| City | Country | restaurants | cafes | barbershops | all (businesses by activity) | population | non-resident visitors |", "|---|---|---|---|---|---|---|---|"]
for c in sorted(eu, key=lambda c: (c["iso2"], c["slug"])):
    s = c["slug"]; i = info.get(s, {})
    if c["iso2"] in ("GB", "IT", "HU"):
        out.append(f"| {s} | {c['iso2']} | elsewhere | elsewhere | elsewhere | elsewhere | elsewhere | elsewhere |"); continue
    vis = sorted(i.get("vis", set()), key=lambda x: (x.split(" ")[-1], "(UA)" not in x))
    out.append(f"| {s} | {c['iso2']} | {cell(i.get('restaurants', set()))} | {cell(i.get('cafes', set()))} | {cell(i.get('barbershops', set()))} | {cell(i.get('all', set()))} | {cell(i.get('pop', set()))} | {vis[-1] if vis else '-'} |")
print("\n".join(out))
