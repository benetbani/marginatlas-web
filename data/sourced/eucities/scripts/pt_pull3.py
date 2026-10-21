import json, urllib.request, time, os
os.chdir("/srv/atlas/runs/data-eucities/dl/pt")
def get(url, tries=3):
    for i in range(tries):
        try: return json.load(urllib.request.urlopen(url, timeout=100))
        except Exception as e: print("retry", url, e, flush=True); time.sleep(3)
B = "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&lang=EN&varcd="
out = {g: get(B + f"0008273&Dim1=S7A2022&Dim2={g}&Dim3=T&Dim4=T") for g in ("1701106", "11A1312")}
json.dump(out, open("pulls3.json", "w"), ensure_ascii=False); print("done")
