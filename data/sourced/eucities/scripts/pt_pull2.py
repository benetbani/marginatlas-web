import json, urllib.request, time, os
os.chdir("/srv/atlas/runs/data-eucities/dl/pt")
def get(url, tries=3):
    for i in range(tries):
        try: return json.load(urllib.request.urlopen(url, timeout=100))
        except Exception as e: print("retry", url, e, flush=True); time.sleep(3)
B = "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&lang=EN&varcd="
out = {"8511_11A1312_96": get(B + "0008511&Dim1=S7A2022&Dim2=11A1312&Dim3=96&Dim4=T"),
       "pop_meta": get("https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=0008273&lang=EN")}
json.dump(out, open("pulls2.json", "w"), ensure_ascii=False)
print("done", flush=True)
