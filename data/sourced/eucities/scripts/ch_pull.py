import json, urllib.request, os
os.chdir("/srv/atlas/runs/data-eucities/dl/ch")
def q(t, sel):
    body = {"query": [{"code": k, "selection": {"filter": "item", "values": v}} for k, v in sel.items()], "response": {"format": "json-stat2"}}
    req = urllib.request.Request(f"https://www.pxweb.bfs.admin.ch/api/v1/de/{t}/{t}.px", data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    d = json.load(urllib.request.urlopen(req, timeout=120)); json.dump(d, open(t + ".data.json", "w"), ensure_ascii=False); return d
q("px-x-0602010000_102", {"Jahr": ["2024"], "Gemeinde": ["261", "351", "2701", "6621"], "Wirtschaftssektor": ["999"], "Beobachtungseinheit": ["1"]})
q("px-x-0602010000_103", {"Jahr": ["2024"], "Kanton": ["1", "2", "12", "25"], "Wirtschaftsart": ["999999", "561001", "561002", "563001", "960201", "960202"], "Beobachtungseinheit": ["1"]})
q("px-x-0102020000_201", {"Jahr": ["2024"], "Kanton (-) / Bezirk (>>) / Gemeinde (......)": ["173", "365", "952", "2209", "1", "174", "950", "2187"],
   "Staatsangehörigkeit (Kategorie)": ["0"], "Geschlecht": ["0"], "Demografische Komponente": ["16"]})
q("px-x-1003020000_101", {"Jahr": ["2025"], "Monat": ["YYYY"], "Gemeinde": ["261", "351", "2701", "6621"], "Herkunftsland": ["0", "1"], "Indikator": ["1", "2"]})
