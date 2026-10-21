import json, itertools, os

OUT = "/srv/atlas/wc/wt-data-business/data/sourced/business"
RETRIEVED = "2026-10-17"

def jsonstat(path):
    """Yield (dict of dim->code, value, status) for every present value of a Eurostat JSON-stat file."""
    d = json.load(open(path))
    ids = d["id"]
    cats = []
    for i in ids:
        idx = d["dimension"][i]["category"]["index"]
        order = sorted(idx, key=lambda k: idx[k]) if isinstance(idx, dict) else idx
        cats.append(order)
    vals, st = d["value"], d.get("status", {})
    labels = {i: d["dimension"][i]["category"].get("label", {}) for i in ids}
    for n, combo in enumerate(itertools.product(*cats)):
        v = vals.get(str(n)) if isinstance(vals, dict) else vals[n]
        if v is None:
            continue
        yield dict(zip(ids, combo)), v, st.get(str(n), ""), labels

def labels_of(path):
    d = json.load(open(path))
    return {i: d["dimension"][i]["category"].get("label", {}) for i in d["id"]}, d.get("updated")

EU_TO_ISO = {"EL": "GR", "UK": "GB"}

def geo_eu(code, name):
    if code.startswith("EU"):
        return {"level": "eu", "code": code, "name": name}
    return {"level": "country", "code": EU_TO_ISO.get(code, code), "name": name}

def write(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", path, len(obj["rows"]), "rows")

FLAG = {"e": "estimated", "p": "provisional", "b": "break in time series", "u": "low reliability", "d": "definition differs"}

def flagnote(*flags):
    words = sorted({FLAG[c] for f in flags for c in f.replace("|", "") if c in FLAG})
    return ("Eurostat flags a component as: " + ", ".join(words) + ".") if words else None
