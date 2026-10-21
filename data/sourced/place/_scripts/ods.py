"""Minimal ods reader on the standard library: a sheet's rows as lists of cell text (repeated cells expanded, capped)."""
import zipfile, xml.etree.ElementTree as ET
T = "{urn:oasis:names:tc:opendocument:xmlns:table:1.0}"
X = "{urn:oasis:names:tc:opendocument:xmlns:text:1.0}"
O = "{urn:oasis:names:tc:opendocument:xmlns:office:1.0}"


def rows(path, sheet, max_cols=60):
    root = ET.fromstring(zipfile.ZipFile(path).read("content.xml"))
    for t in root.iter(T + "table"):
        if t.get(T + "name") != sheet:
            continue
        out = []
        for r in t.iter(T + "table-row"):
            cells = []
            for c in r:
                if c.tag not in (T + "table-cell", T + "covered-table-cell"):
                    continue
                n = min(int(c.get(T + "number-columns-repeated", "1")), max_cols)
                v = c.get(O + "value")
                txt = v if v is not None else "\n".join("".join(p.itertext()) for p in c.iter(X + "p"))
                cells.extend([txt] * n)
                if len(cells) >= max_cols:
                    break
            rr = int(r.get(T + "number-rows-repeated", "1"))
            if rr > 1 and not any(cells):
                continue
            out.append(cells[:max_cols])
        return out
    raise KeyError(sheet)
