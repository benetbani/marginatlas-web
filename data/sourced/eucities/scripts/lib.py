import json, os
OUT = "/srv/atlas/wc/wt-data-eucities/data/sourced/eucities"
RETRIEVED = "2026-10-18"
os.makedirs(OUT, exist_ok=True)
def write(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", path, len(obj["rows"]), "rows")
