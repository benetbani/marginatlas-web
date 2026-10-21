# data/sourced/eucities: city counts and city figures for the catalog's European cities

Written by job D5 (data-eucities), 2026-10-18, in the contract shape of the replicable-pages plan, Task 1. Every value read
from the publisher's own file or API; the scripts that produced each file are in `scripts/` (raw pulls stay on the build
server under /srv/atlas/runs/data-eucities/dl). Checked with `validate_sourced.py`.

Items: `business_count` (with `trade` restaurants, cafes, barbershops or all where the class maps; `officialClass` in the
publisher's words; `unit` names the register's own unit: establishments, enterprises, workplaces, VAT-registered
enterprises, registered entities or seats), `business_count_employer` (France only: of which employers), `population`,
`visitors` (non-residents; `unit` says nights, guests, arrivals, travellers or tourists), `visitors_total` (all guests),
`visitors_resident` (Spain: residents of Spain).

Comparing: counts compare only within one file (one register, one unit, one level, one date). A row whose note says
"the whole division" is division 56 written under both `restaurants` and `cafes` (as data-business did for I56): it must
never be set beside a class count. `geo.level` says the boundary: `city` (municipality), `metro` (COROP, province,
NUTS III, region of Brussels), `county`, `region` (canton, county, Land region). A per-resident figure takes the
population row of the same file and the same geo code.

| File | Cities | Publisher | Licence |
|---|---|---|---|
| fr-sirene-2026.json | 6 FR communes | Insee (Sirene, populations de référence) | Licence Ouverte 2.0 |
| eurostat-urban-audit.json | 47 Urban Audit cities | Eurostat (urb_cpop1, urb_ctour) | CC BY 4.0 |
| nl-cbs-2026.json | Amsterdam, Rotterdam | CBS | CC BY 4.0 |
| ch-bfs-2024.json | Zürich, Bern, Basel, Genève | BFS (STATENT, HESTA) | BFS terms of use |
| pl-gus-2025.json | Warszawa, Kraków | GUS (BDL) | GUS terms |
| dk-dst-2024.json | Copenhagen | Statistics Denmark | DST terms |
| se-scb-2024.json | Stockholm | SCB | CC BY 4.0 |
| at-statistik-austria.json | Wien | Statistik Austria OGD | CC BY 4.0 |
| cz-csu-2026.json | Praha | ČSÚ (RES, OBY02, CRU02) | ČSÚ open data |
| no-ssb-2026.json | Oslo | SSB | CC BY 4.0 |
| be-statbel-2024.json | Brussels | Statbel | Statbel open data |
| es-ine-2025.json | Madrid, Barcelona, Sevilla, Valencia | INE Spain (EOH, Padrón) | INE terms |
| pt-ine.json | Lisboa, Porto | INE Portugal | INE terms |
| de-berlin-urs-2024.json | Berlin | Amt für Statistik Berlin-Brandenburg | CC BY 3.0 DE |
| ie-cso-2024.json | Dublin (county) | CSO | CC BY 4.0 |
| fi-statfin-2024.json | Helsinki | Statistics Finland | CC BY 4.0 |
| si-surs-2024.json | Ljubljana | SURS | SURS terms |
