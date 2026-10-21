"""Brazil, IBGE through the SIDRA API (apisidra.ibge.gov.br, servicodados.ibge.gov.br): CEMPRE 2024 table 9528 (local units by
CNAE class, Brazil and municipalities), PAS 2024 table 10758 (annual services survey, enterprises), Business demography
table 9950 (survival of employer local units, Brazil and states), population estimates table 6579. In /srv/atlas/runs/data-intl/dl/br.
"""
import json
from lib import write, rnd, DL, RETRIEVED

D = f"{DL}/br"
IBGE = "Instituto Brasileiro de Geografia e Estatística (IBGE)"
SRC = {
    "cempre": {"publisher": IBGE, "title": "Cadastro Central de Empresas (CEMPRE) 2024, table 9528: local units, persons employed, by CNAE 2.0 class", "url": "https://sidra.ibge.gov.br/tabela/9528"},
    "pas": {"publisher": IBGE, "title": "Pesquisa Anual de Serviços (PAS) 2024, table 10758: general data of non-financial business services by activity", "url": "https://sidra.ibge.gov.br/tabela/10758"},
    "surv": {"publisher": IBGE, "title": "Demografia das Empresas e Estatísticas de Empreendedorismo, table 9950: births of employer local units and survival rates", "url": "https://sidra.ibge.gov.br/tabela/9950"},
    "pop": {"publisher": IBGE, "title": "Estimativas de População, table 6579: estimated resident population (1 July)", "url": "https://sidra.ibge.gov.br/tabela/6579"},
}
BR = {"level": "country", "code": "BR", "name": "Brazil"}
CITY = {"3550308": "São Paulo", "3304557": "Rio de Janeiro", "5300108": "Brasília", "2927408": "Salvador", "2304400": "Fortaleza",
        "3106200": "Belo Horizonte", "2611606": "Recife", "4314902": "Porto Alegre"}
UF = {"35": "São Paulo (state)", "33": "Rio de Janeiro (state)", "53": "Distrito Federal", "29": "Bahia", "23": "Ceará", "31": "Minas Gerais", "26": "Pernambuco", "43": "Rio Grande do Sul"}


def geo(nc, code):
    if nc == "1":
        return BR
    if nc == "6":
        return {"level": "city", "code": f"BR-{code}", "name": f"{CITY[code]} (municipality)"}
    return {"level": "region", "code": f"BR-UF{code}", "name": UF[code]}


def load(name):
    return json.load(open(f"{D}/{name}.json"))[1:]


def num(v):
    try:
        return float(v)
    except ValueError:
        return None


rows = []
# 1. CEMPRE 2024: local units and persons employed
CL = {"56.11-2": (["restaurants", "cafes"], "CNAE 5611-2 holds restaurants, snack bars, cafés, juice bars and bars together: written under restaurants and under cafes."),
      "96.02-5": (["barbershops"], "CNAE 9602-5: hairdressers, barbers and other beauty treatment."),
      "56": ([None], "CNAE division 56, all food and beverage service."),
      "96": ([None], "CNAE division 96, all other personal services."),
      "Total": (["all"], "All activities (companies and other organisations, public bodies included).")}
cem = {}
for r in load("cempre"):
    cls = r["D4N"].split(" ")[0]
    cem[(r["NC"], r["D1C"], cls, r["D2C"])] = (num(r["V"]), r["D4N"])
for (nc, code, cls, var), (v, lab) in cem.items():
    if var != "706" or v is None or cls not in CL:
        continue
    trades, note = CL[cls]
    oc = "CNAE 2.0, all activities" if cls == "Total" else f"CNAE 2.0 {lab}"
    for t in trades:
        base = dict(officialClass=oc, geo=geo(nc, code), source=SRC["cempre"])
        if t:
            base["trade"] = t
        rows.append(dict(base, item="business_count", value=int(v), unit="local units", year="2024", measure="active local units (establishments) of companies and other organisations registered in the CEMPRE, 2024", note=note))
        p = cem.get((nc, code, cls, "707"), (None,))[0]
        if p:
            rows.append(dict(base, item="persons_per_business", value=round(p / v, 1), unit="persons employed per local unit", year="2024",
                             measure="total persons employed (owners and partners included) per local unit, derived from two published figures of the same table",
                             note=f"{note} {int(p):,} persons over {int(v):,} local units."))

# 2. PAS 2024: enterprises, Brazil
PS = {"1. Total": (["all"], "PAS segment 1, all non-financial business services (services only, not the whole economy)."),
      "2.2 Serviços de alimentação": (["restaurants", "cafes"], "PAS segment 2.2, food services (restaurants, bars, snack bars, catering): no finer class is published."),
      "2.4 Serviços pessoais": (["barbershops"], "PAS segment 2.4, personal services (hairdressing and beauty among laundry, funeral and other personal services): no finer class is published.")}
pas = {}
for v in json.load(open(f"{D}/pas.json")):
    for res in v["resultados"]:
        seg = list(res["classificacoes"][0]["categoria"].values())[0]
        pas[(seg, v["id"])] = num(res["series"][0]["serie"]["2024"])
for seg, (trades, note) in PS.items():
    n, pers, rol, staff, ci, eob = (pas[(seg, k)] for k in ("630", "631", "643", "856", "637", "636"))
    for t in trades:
        base = dict(trade=t, officialClass=f"PAS 2024 activity segment {seg}", geo=BR, source=SRC["pas"], year="2024")
        rows += [
            dict(base, item="business_count", value=int(n), unit="enterprises", measure="enterprises in the survey's scope (non-financial business services)", note=note),
            dict(base, item="sales_per_business", value=rnd(rol * 1000 / n), unit="BRL", measure="mean net operating revenue per enterprise (revenue divided by enterprises), derived from two published figures",
                 note=f"{note} Net operating revenue {rol:,.0f} thousand BRL over {int(n):,} enterprises."),
            dict(base, item="persons_per_business", value=round(pers / n, 1), unit="persons employed per enterprise", measure="persons employed on 31 December per enterprise, derived", note=f"{note} {int(pers):,} persons over {int(n):,} enterprises."),
            dict(base, item="gross_operating_rate", value=round(100 * eob / rol, 1), unit="percent of net operating revenue",
                 measure="gross operating rate: published gross operating surplus (excedente operacional bruto) divided by net operating revenue, before the owner's own pay, depreciation, interest and tax",
                 note=f"{note} {eob:,.0f} over {rol:,.0f} thousand BRL."),
            dict(base, item="staff_cost_share", value=round(100 * staff / rol, 1), unit="percent of net operating revenue", measure="total personnel expenses (wages, owners' drawings, social contributions, benefits) divided by net operating revenue",
                 note=f"{note} {staff:,.0f} over {rol:,.0f} thousand BRL."),
            dict(base, item="purchases_share", value=round(100 * ci / rol, 1), unit="percent of net operating revenue", measure="total intermediate consumption (goods, materials, rent, third-party services, energy and other operating costs) divided by net operating revenue",
                 note=f"{note} {ci:,.0f} over {rol:,.0f} thousand BRL."),
        ]

# 3. Survival of employer local units: latest cohort for each age, Brazil and the catalog cities' states
SV = {"Total": (["all"], None), "I": (["restaurants", "cafes"], "Whole section I, accommodation and food service: hotels as well as restaurants and bars.")}
VAR = {"13235": 1, "13236": 2, "13237": 3, "13239": 5}
best = {}
for r in load("surv"):
    if r["D2C"] not in VAR or num(r["V"]) is None:
        continue
    k = (r["NC"], r["D1C"], r["D4N"].split(" ")[0], VAR[r["D2C"]])
    if k not in best or r["D3N"] > best[k][0]:
        best[k] = (r["D3N"], num(r["V"]), r["D4N"])
for (nc, code, sec, n), (birth, v, lab) in best.items():
    trades, note = SV[sec]
    y = str(int(birth) + n)
    for t in trades:
        rows.append({k: x for k, x in dict(item=f"survival_{n}y", trade=t, officialClass="CNAE 2.0, all activities" if sec == "Total" else f"CNAE 2.0 section {lab}",
                     geo=geo(nc, code), value=round(v, 1), unit="percent of employer local units born", year=y,
                     measure=f"{n}-year survival rate of employer local units (cohort born {birth}, still active in {y})", note=note, source=SRC["surv"]).items() if x is not None})

# 4. Populations, 1 July 2024 and 2025
for r in load("pop"):
    if num(r["V"]) is None:
        continue
    rows.append(dict(item="population", geo=geo(r["NC"], r["D1C"]), value=int(num(r["V"])), unit="persons", year=r["D3N"] + "-07",
                     measure=f"estimated resident population, 1 July {r['D3N']}", note="Same municipal code as the CEMPRE counts." if r["NC"] == "6" else "Brazil.", source=SRC["pop"]))

write("ibge-brazil.json", {
    "id": "ibge-brazil",
    "source": {"publisher": IBGE, "title": "CEMPRE 2024, Pesquisa Anual de Serviços 2024, Demografia das Empresas, Estimativas de População (SIDRA)",
               "url": "https://sidra.ibge.gov.br/", "table": "Each row names its own SIDRA table: 9528, 10758, 9950, 6579",
               "licence": "IBGE: free reuse of published statistics with citation of the source (Lei de Acesso à Informação; IBGE terms of use, https://www.ibge.gov.br/acesso-informacao/institucional/politicas-de-uso.html)"},
    "retrieved": RETRIEVED, "rows": rows})
