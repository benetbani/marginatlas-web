import json, itertools
def jsonstat(path):
    d = json.load(open(path))
    ids = d["id"]; cats=[]
    for i in ids:
        idx = d["dimension"][i]["category"]["index"]
        cats.append(sorted(idx, key=lambda k: idx[k]) if isinstance(idx, dict) else idx)
    vals, st = d["value"], d.get("status", {})
    sizes=d['size']
    # compute flat index directly from value keys
    out=[]
    for key,v in vals.items():
        n=int(key); combo=[]
        for s,c in zip(reversed(sizes),reversed(cats)):
            combo.append(c[n % s]); n//=s
        out.append((dict(zip(ids,reversed(combo))), v, st.get(key,"")))
    return out, {i: d["dimension"][i]["category"].get("label", {}) for i in ids}, d.get("updated")
