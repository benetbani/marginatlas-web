"""Mexico: INEGI Censos Económicos 2024 (reference year 2023), open data for the nation and for Ciudad de México
(https://www.inegi.org.mx/contenidos/programas/ce/2024/datosabiertos/conjunto_de_datos_ce_{nac,cdmx}_2024_csv.zip), and the
Censo de Población y Vivienda 2020 ITER file for Ciudad de México (iter_09_cpv2020_csv.zip). In /srv/atlas/runs/data-intl/dl/mx.
"""
import csv
from lib import write, rnd, DL, RETRIEVED

D = f"{DL}/mx"
BASE = "https://www.inegi.org.mx/contenidos/programas/ce/2024/datosabiertos/"
SRC = {
    "nac": {"publisher": "Instituto Nacional de Estadística y Geografía (INEGI)", "title": "Censos Económicos 2024, open data, national tabulation (conjunto_de_datos_ce_nac_2024)", "url": BASE + "conjunto_de_datos_ce_nac_2024_csv.zip"},
    "cdmx": {"publisher": "Instituto Nacional de Estadística y Geografía (INEGI)", "title": "Censos Económicos 2024, open data, Ciudad de México (conjunto_de_datos_ce_cdmx_2024)", "url": BASE + "conjunto_de_datos_ce_cdmx_2024_csv.zip"},
    "pop": {"publisher": "Instituto Nacional de Estadística y Geografía (INEGI)", "title": "Censo de Población y Vivienda 2020, Principales resultados por localidad (ITER), Ciudad de México", "url": "https://www.inegi.org.mx/contenidos/programas/ccpv/2020/datosabiertos/iter/iter_09_cpv2020_csv.zip"},
}
CLASSES = {
    "722511": ("restaurants", "SCIAN 722511: restaurants serving à la carte or set meals (full service)."),
    "722515": ("cafes", "SCIAN 722515: cafeterias, soda fountains, ice-cream and juice shops."),
    "812110": ("barbershops", "SCIAN 812110: beauty salons and clinics and barber shops (peluquerías) together."),
    "7225": (None, "SCIAN 7225: all restaurants and other places preparing food (full service, takeaway, tacos, cafeterias and the rest)."),
    "TOTAL DE SECTOR": ("all", "All sectors within the census's scope: private sector and state-owned enterprises."),
}
STRATA = {"1": "0 to 10", "2": "11 to 50", "3": "51 to 250", "4": "251 or more"}
MX = {"level": "country", "code": "MX", "name": "Mexico"}
CMX = {"level": "city", "code": "MX-CMX", "name": "Ciudad de México (Mexico City, the federal entity)"}
UNIT = "economic units (establishments)"


def f(x):
    return float(x) if x not in ("", None) else None


LAB = {r["CODIGO"].strip(): r["DESC_CODIGO"].strip() for r in csv.DictReader(open(f"{D}/nac/catalogos/tc_codigo_actividad.csv", encoding="utf-8-sig"))}
rows = []
for key, path, geo in (("nac", "nac/conjunto_de_datos/tr_ce_nac_2024.csv", MX), ("cdmx", "cdmx/conjunto_de_datos/tr_ce_cdmx_2024.csv", CMX)):
    strata = {}
    for r in csv.DictReader(open(f"{D}/{path}", encoding="utf-8")):
        if r["E04"].strip() != "":
            continue  # municipalities (alcaldías) are not written
        code = r["CODIGO"].strip()
        if code not in CLASSES:
            continue
        trade, note = CLASSES[code]
        oc = "SCIAN 2023, all sectors in scope" if code == "TOTAL DE SECTOR" else f"SCIAN 2023 {code}: {LAB.get(code, '')}".rstrip(": ")
        st = r["ID_ESTRATO"].strip()
        if st in STRATA:
            strata.setdefault((code, trade, note, oc), {})[st] = int(f(r["UE"]))
            continue
        if st != "":
            continue
        ue, pers, pay, cons, inc, vab = int(f(r["UE"])), f(r["H001A"]), f(r["J000A"]), f(r["K000A"]), f(r["M000A"]), f(r["A131A"])
        b = {"trade": trade, "officialClass": oc, "geo": geo, "source": SRC[key]}
        if trade is None:
            b.pop("trade")
        y = "2023"
        rows.append(dict(b, item="business_count", value=ue, unit=UNIT, year="2024", measure="economic units counted by the 2024 census (fixed establishments in its scope)", note=note))
        rows.append(dict(b, item="sales_per_business", value=rnd(inc * 1e6 / ue), unit="MXN", year=y,
                         measure="mean income from the supply of goods and services per economic unit (income divided by units), derived from two published figures",
                         note=f"{note} Income {inc:,.3f} million MXN over {ue:,} units."))
        rows.append(dict(b, item="persons_per_business", value=round(pers / ue, 1), unit="persons employed per economic unit", year=y,
                         measure="mean total persons employed per economic unit (owners and unpaid workers included), derived", note=f"{note} {pers:,.0f} persons over {ue:,} units."))
        rows.append(dict(b, item="staff_cost_share", value=round(100 * pay / inc, 1), unit="percent of income from goods and services", year=y,
                         measure="total remuneration (wages, benefits and employer social contributions) divided by income from the supply of goods and services",
                         note=f"{note} {pay:,.3f} million MXN over {inc:,.3f} million MXN."))
        rows.append(dict(b, item="purchases_share", value=round(100 * cons / inc, 1), unit="percent of income from goods and services", year=y,
                         measure="total consumption of goods and services divided by income from the supply of goods and services",
                         note=f"{note} {cons:,.3f} million MXN over {inc:,.3f} million MXN."))
        rows.append(dict(b, item="gross_operating_rate", value=round(100 * (vab - pay) / inc, 1), unit="percent of income from goods and services", year=y,
                         measure="gross operating rate, DERIVED: census gross value added minus total remuneration, divided by income from the supply of goods and services; before the owner's own pay, depreciation, interest and tax",
                         note=f"{note} Gross value added {vab:,.3f}, remuneration {pay:,.3f}, income {inc:,.3f} million MXN."))
    for (code, trade, note, oc), s in strata.items():
        tot = next(x["value"] for x in rows if x["item"] == "business_count" and x["officialClass"] == oc and x["geo"] is geo)
        if sum(s.values()) != tot:
            continue  # a stratum folded for confidentiality: no share
        for st, n in s.items():
            row = dict(item="size_class_share", trade=trade, officialClass=oc, geo=geo, value=round(100 * n / tot, 1), unit=f"percent of {UNIT}", year="2024",
                       measure=f"share of economic units with {STRATA[st]} persons employed", note=f"{n:,} of {tot:,} units.", source=SRC[key])
            if trade is None:
                row.pop("trade")
            rows.append(row)

for r in csv.DictReader(open(f"{D}/iter/iter_09_cpv2020/conjunto_de_datos/conjunto_de_datos_iter_09CSV20.csv", encoding="utf-8-sig")):
    if r["MUN"] == "000" and r["LOC"] == "0000":
        rows.append(dict(item="population", geo=CMX, value=int(r["POBTOT"]), unit="persons", year="2020-03", measure="total population, Population and Housing Census 2020 (15 March 2020)",
                         note="The whole federal entity of Ciudad de México, the same boundary as the economic census rows.", source=SRC["pop"]))

write("inegi-mexico.json", {
    "id": "inegi-mexico",
    "source": {"publisher": "Instituto Nacional de Estadística y Geografía (INEGI)", "title": "Censos Económicos 2024 (reference year 2023) and Censo de Población y Vivienda 2020",
               "url": "https://www.inegi.org.mx/programas/ce/2024/", "table": "Open-data CSVs: national and Ciudad de México economic census; ITER 2020 for Ciudad de México",
               "licence": "INEGI terms of free use of information, https://www.inegi.org.mx/inegi/terminos.html"},
    "retrieved": RETRIEVED, "rows": rows})
