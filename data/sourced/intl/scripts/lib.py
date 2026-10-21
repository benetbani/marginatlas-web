import json, os

OUT = "/srv/atlas/wc/wt-data-intl/data/sourced/intl"
DL = "/srv/atlas/runs/data-intl/dl"
RETRIEVED = "2026-10-18"


def write(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", path, len(obj["rows"]), "rows")


def rnd(v):
    """Round a mean money figure: to 100 below ten million units, to 1,000 above."""
    return int(round(v, -2)) if abs(v) < 1e7 else int(round(v, -3))
