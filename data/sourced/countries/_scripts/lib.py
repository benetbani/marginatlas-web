"""Shared helpers for the data-countries job (D7). Every value is read from the publisher's file; nothing is typed."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(HERE)
DL = "/srv/atlas/runs/data-countries/dl"
RETRIEVED = "2026-10-19"


from countries import COUNTRIES
ISO3 = {v[0]: k for k, v in COUNTRIES.items()}


def geo(iso2):
    return {"level": "country", "code": iso2, "name": COUNTRIES[iso2][1]}


def write(name, obj):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("wrote", path, len(obj["rows"]), "rows")


def xlsx_rows(path, sheet_index=1):
    """Read one worksheet of an .xlsx (no openpyxl on the server): a list of rows, each a dict column-letter -> text."""
    import re, zipfile
    import xml.etree.ElementTree as ET
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % ns["m"])))
    out = []
    for row in ET.fromstring(z.read(f"xl/worksheets/sheet{sheet_index}.xml")).iter("{%s}row" % ns["m"]):
        cells = {}
        for c in row.findall("m:c", ns):
            col = re.match(r"[A-Z]+", c.get("r")).group(0)
            v = c.find("m:v", ns)
            if c.get("t") == "s" and v is not None:
                cells[col] = shared[int(v.text)]
            elif c.get("t") == "inlineStr":
                cells[col] = "".join(t.text or "" for t in c.iter("{%s}t" % ns["m"]))
            elif v is not None:
                cells[col] = v.text
        out.append(cells)
    return out
