import duckdb, json
c = duckdb.connect()
c.sql("create view r as select * from read_csv('/srv/atlas/runs/data-eucities/dl/cz/res_data.csv', all_varchar=true)")
out = {}
out["datplat"] = c.sql("select max(DATPLAT), min(DATPLAT) from r").fetchall()
base = "from r where OKRESLAU='CZ0100' and DDATZAN is null"
out["all"] = c.sql(f"select count(*) {base}").fetchall()[0][0]
out["nace"] = c.sql(f"select NACE, count(*) {base} and (NACE like '56%' or NACE like '9602%') group by 1 order by 1").fetchall()
out["nace_katpo_known"] = c.sql(f"select NACE, count(*) {base} and (NACE like '56%' or NACE like '9602%') and KATPO not in ('000','') and KATPO is not null group by 1 order by 1").fetchall()
out["all_katpo_known"] = c.sql(f"select count(*) {base} and KATPO not in ('000','') and KATPO is not null").fetchall()[0][0]
out["katpo"] = c.sql(f"select KATPO, count(*) {base} group by 1 order by 1").fetchall()
json.dump(out, open("/srv/atlas/runs/data-eucities/dl/cz/agg.json", "w"), indent=1)
print(json.dumps(out))
