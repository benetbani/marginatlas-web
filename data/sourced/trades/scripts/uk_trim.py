"""The UK trade pages' share of branch data-trades (S-U1, 2026-10-20): the class map's UK SIC 2007 rows and the VAT file's UK rows.

Reads the two whole files from data-trades (git show data-trades:data/sourced/trades/<file>.json > <dir>/<file>.json; pass <dir>) and
writes classes-uk.json and vat-by-activity-uk.json beside this script's parent. Every row is copied as it is; only rows of other
classifications and other countries are left out, so the UK pages carry 1 of the 11 classifications, not the whole 4.4 MB map.
ons-abs.json, ons-business-counts.json and ons-business-demography.json are taken whole (they hold the UK only).

    python3 -I data/sourced/trades/scripts/uk_trim.py /srv/atlas/runs/uk-trade/dt
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, ".."))
src = sys.argv[1]


def write(name, d):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(name, len(d["rows"]), "rows")


classes = json.load(open(os.path.join(src, "classes.json"), encoding="utf-8"))
uk = [r for r in classes["rows"] if r["classification"] == "UK SIC 2007"]
write("classes-uk.json", {
    "id": "trade-classes-uk",
    "source": {"publisher": "Office for National Statistics",
               "title": "UK SIC 2007: the official class or classes each site trade shown by default is counted in",
               "url": "https://www.ons.gov.uk/methodology/classificationsandstandards/ukstandardindustrialclassificationofeconomicactivities/uksic2007",
               "table": "The UK SIC 2007 rows of data-trades' classes.json (212 trades), each with its codes, titles, match and evidence"},
    "retrieved": classes["retrieved"], "rows": uk})

vat = json.load(open(os.path.join(src, "vat-by-activity.json"), encoding="utf-8"))
gb = [r for r in vat["rows"] if r["geo"]["code"] == "GB"]
write("vat-by-activity-uk.json", {
    "id": "trades-vat-by-activity-uk",
    "source": {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "VAT rates on different goods and services",
               "url": "https://www.gov.uk/guidance/rates-of-vat-on-different-goods-and-services"},
    "retrieved": vat["retrieved"], "rows": gb})
