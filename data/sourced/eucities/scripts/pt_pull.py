import json, urllib.request, time, os
os.chdir("/srv/atlas/runs/data-eucities/dl/pt")
def get(url, tries=4):
    for i in range(tries):
        try:
            return json.load(urllib.request.urlopen(url, timeout=150))
        except Exception as e:
            print("retry", url, e); time.sleep(5)
    return None
B = "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&lang=EN&varcd="
out = {}
for g in ("1701106", "11A1312"):
    for a in ("TOT", "56", "96"):
        out[f"8511_{g}_{a}"] = get(B + f"0008511&Dim1=S7A2022&Dim2={g}&Dim3={a}&Dim4=T")
for g in ("1A0", "11A"):
    for a in ("TOT", "56101", "56301", "96021"):
        out[f"13838_{g}_{a}"] = get(B + f"0013838&Dim1=S7A2024&Dim2={g}&Dim3={a}")
json.dump(out, open("pulls.json", "w"), indent=1, ensure_ascii=False)
metas = {}
for n in list(range(10730, 10745)) + list(range(9800, 9816)):
    c = f"{n:07d}"
    m = get(f"https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd={c}&lang=EN", tries=2)
    if m: metas[c] = (m[0].get("IndicadorNome"), m[0].get("UltimoPeriodo"))
json.dump(metas, open("metas.json", "w"), indent=1, ensure_ascii=False)
print("done")
