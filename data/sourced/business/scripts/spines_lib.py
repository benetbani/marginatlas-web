"""Helpers for the D8 spines files (the business lib.py writes to another worktree)."""
import itertools, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
SOURCED = os.path.normpath(os.path.join(HERE, "..", ".."))
DL = "/srv/atlas/runs/data-spines/dl"
RETRIEVED = "2026-10-19"
EU_TO_ISO = {"EL": "GR", "UK": "GB"}
FLAG = {"e": "estimated", "p": "provisional", "b": "break in time series", "u": "low reliability",
        "d": "definition differs", "c": "confidential", "s": "Eurostat estimate"}


def jsonstat(path):
    """Yield (dict of dim->code, value, status, labels) for every present value of a Eurostat JSON-stat file."""
    d = json.load(open(path))
    ids = d["id"]
    cats = []
    for i in ids:
        idx = d["dimension"][i]["category"]["index"]
        cats.append(sorted(idx, key=lambda k: idx[k]) if isinstance(idx, dict) else idx)
    vals, st = d["value"], d.get("status", {})
    labels = {i: d["dimension"][i]["category"].get("label", {}) for i in ids}
    for n, combo in enumerate(itertools.product(*cats)):
        v = vals.get(str(n)) if isinstance(vals, dict) else vals[n]
        if v is None:
            continue
        yield dict(zip(ids, combo)), v, st.get(str(n), ""), labels


def geo_eu(code, name):
    if code.startswith("EU") or code.startswith("EA"):
        return {"level": "eu", "code": code, "name": name}
    return {"level": "country", "code": EU_TO_ISO.get(code, code), "name": name}


def flagnote(*flags):
    words = sorted({FLAG[c] for f in flags for c in (f or "") if c in FLAG})
    return ("Eurostat flags this value as: " + ", ".join(words) + ".") if words else None


def write(domain, name, obj):
    path = os.path.join(SOURCED, domain, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", path, len(obj["rows"]), "rows")
