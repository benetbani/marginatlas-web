import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/es/"
INE = "Instituto Nacional de Estadística (INE), Spain"
CITY = {"Barcelona": ("08019", "Barcelona (municipio)", "EOT2662", "EOT2660", "EOT2661", "EOT2659", 2861, "DPOP2665"),
        "Madrid": ("28079", "Madrid (municipio)", "EOT2746", "EOT2744", "EOT2745", "EOT2743", 2881, "DPOP13156"),
        "Sevilla": ("41091", "Sevilla (municipio)", "EOT2854", "EOT2852", "EOT2853", "EOT2851", 2895, "DPOP18571"),
        "Valencia": ("46250", "València (municipio)", "EOT2882", "EOT2880", "EOT2881", "EOT2879", 2903, "DPOP21796")}
SE = {"publisher": INE, "title": "Encuesta de Ocupación Hotelera (EOH): viajeros y pernoctaciones por puntos turísticos (table 75197)", "url": "https://www.ine.es/jaxiT3/Tabla.htm?t=75197"}
rows = []
for city, (code, name, pnr, vnr, pr, vr, ptab, pcod) in CITY.items():
    geo = {"level": "city", "code": code, "name": name}
    for s, item, unit, who in ((pnr, "visitors", "nights", "residents abroad"), (vnr, "visitors", "travellers", "residents abroad"),
                               (pr, "visitors_resident", "nights", "residents of Spain"), (vr, "visitors_resident", "travellers", "residents of Spain")):
        d = json.load(open(D + s + ".json"))
        m = [x for x in d["Data"] if x["Anyo"] == 2025]
        assert len(m) == 12 and all(x["FK_TipoDato"] == 1 for x in m), (s, len(m))
        tot = int(sum(x["Valor"] for x in m))
        rows.append({"item": item, "geo": geo, "value": tot, "unit": unit, "year": "2025",
                     "measure": f"{'nights spent by' if unit=='nights' else 'arrivals of'} {who} in hotel establishments, calendar year 2025",
                     "note": f"Series {s} ({d['Nombre'].strip()}): the sum of the twelve published definitive months of 2025. Hotels only (EOH tourist point = the municipality); flats and hostels outside the survey." + (" A traveller counts once per stay." if unit == "travellers" else ""),
                     "source": {**SE, "url": f"https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/{s}?nult=24"}})
    for x in json.load(open(D + f"pop_{ptab}.json")):
        if x["COD"] == pcod:
            v = x["Data"][0]
            rows.append({"item": "population", "geo": geo, "value": int(v["Valor"]), "unit": "persons", "year": str(v["Anyo"]),
                         "measure": f"official population figure from the municipal register (Padrón), 1 January {v['Anyo']}", "note": f"Series {pcod}.",
                         "source": {"publisher": INE, "title": f"Cifras oficiales de población de los municipios españoles: revisión del Padrón municipal (table {ptab})", "url": f"https://www.ine.es/jaxiT3/Tabla.htm?t={ptab}"}})
write("es-ine-2025.json", {"id": "eucities-es-ine-2025",
    "source": {"publisher": INE, "title": "INEbase: Encuesta de Ocupación Hotelera by tourist point; municipal population (Padrón)", "url": "https://www.ine.es/",
               "table": "API https://servicios.ine.es/wstempus/js/ES/, EOH series EOT2659-2662, 2743-2746, 2851-2854, 2879-2882; DPOP tables 2861, 2881, 2895, 2903",
               "licence": "INE terms: reuse permitted with the source cited, https://www.ine.es/aviso_legal"},
    "retrieved": RETRIEVED, "rows": rows})
