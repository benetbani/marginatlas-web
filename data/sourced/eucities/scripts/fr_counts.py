import duckdb, json
c=duckdb.connect()
P="dl/fr/stock-etab.parquet"
q=f"""
with t as (select case when codeCommuneEtablissement like '751%' then '75056'
 when codeCommuneEtablissement between '69381' and '69389' then '69123'
 when codeCommuneEtablissement between '13201' and '13216' then '13055'
 else codeCommuneEtablissement end as com, activitePrincipaleEtablissement a, nomenclatureActivitePrincipaleEtablissement n,
 caractereEmployeurEtablissement e, statutDiffusionEtablissement s
 from '{P}' where etatAdministratifEtablissement='A')
select com, a, n, count(*) tot, count(*) filter (where e='O') emp, count(*) filter (where s='P') part from t
where com in ('75056','69123','13055','44109','06088','31555')
group by all
"""
rows=c.sql(q).fetchall()
json.dump(rows, open('dl/fr/agg.json','w'))
import collections
tot=collections.Counter(); 
for com,a,n,t,e,p in rows: tot[(com,n)]+=t
print(tot)
for com,a,n,t,e,p in sorted(rows):
    if a in ('56.10A','56.10B','56.10C','56.30Z','96.02A','96.02B','56.11Z','56.30Y'): print(com,a,n,t,e,p)
print(c.sql(f"select count(*), count(*) filter (where codeCommuneEtablissement is null) from '{P}' where etatAdministratifEtablissement='A'").fetchall())
