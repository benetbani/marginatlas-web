"""Minimal xlsx reader on the standard library: sheet names, and a sheet's cells as {(row, col): value}."""
import re, zipfile, xml.etree.ElementTree as ET
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
def _shared(z):
    try: root = ET.fromstring(z.read("xl/sharedStrings.xml"))
    except KeyError: return []
    return ["".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])) for si in root.findall("m:si", NS)]
def sheets(path):
    z = zipfile.ZipFile(path); wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    target = {r.get("Id"): r.get("Target") for r in rels}
    return [(s.get("name"), "xl/" + target[s.get("{%s}id" % NS["r"])].lstrip("/").replace("xl/", "")) for s in wb.find("m:sheets", NS)]
def col(ref):
    n = 0
    for ch in re.match(r"[A-Z]+", ref).group(0): n = n * 26 + ord(ch) - 64
    return n
def cells(path, sheet_name):
    z = zipfile.ZipFile(path); ss = _shared(z); part = dict(sheets(path))[sheet_name]
    root = ET.fromstring(z.read(part)); out = {}
    for c in root.iter("{%s}c" % NS["m"]):
        ref = c.get("r"); r = int(re.search(r"\d+", ref).group(0)); v = c.find("m:v", NS)
        if v is None:
            t = c.find("m:is/m:t", NS); val = t.text if t is not None else None
        elif c.get("t") == "s": val = ss[int(v.text)]
        else:
            try: val = float(v.text)
            except ValueError: val = v.text
        out[(r, col(ref))] = val
    return out
