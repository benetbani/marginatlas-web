# Image integrity audit (Plan v24 Block 8)

Generated 2026-05-26T01:49:29.651Z.

Probed 993 unique image URLs across 5 manifests.

## Summary

- ok: **46** (4.6%)
- timeout: **10** (1.0%)
- rate-limited: **937** (94.4%)

## Broken by manifest

### cities_manifest.json

3 broken entries.

- timeout (HTTP 0): `copenhagen` https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Copenhagen_K%C3%B8benhavn_Denmark_2023_10.
- timeout (HTTP 0): `copenhagen` https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Kopenhagen_%28DK%29%2C_Nyhavn_--_2017_--_1
- timeout (HTTP 0): `bucharest` https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bucharest_-_looking_south_past_corner_of_S

### countries_manifest.json

1 broken entries.

- timeout (HTTP 0): `CM` https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Clouds_surround_hill.jpg/1280px-Clouds_sur

### industries_manifest.json

6 broken entries.

- timeout (HTTP 0): `str_management` https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Alberta_Canada-_Your_Vacation_Paradise_whe
- timeout (HTTP 0): `landscaping_lawn` https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Everything_for_the_lawn_%28IA_everythingfo
- timeout (HTTP 0): `dental_practices` https://upload.wikimedia.org/wikipedia/commons/7/76/EFTA00001863_-_Dental_office_with_modern_equipme
- timeout (HTTP 0): `it_services_hosting` https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/BalticServers_data_center.jpg/1280px-Balti
- timeout (HTTP 0): `trucking_freight` https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Freight_transportation_by_road_on_open_tru
- timeout (HTTP 0): `livestock_farming` https://upload.wikimedia.org/wikipedia/commons/a/a3/Livestock_by_the_coast_path_-_geograph.org.uk_-_

## Cleanup mechanism

Broken URLs are listed in `data/quality/broken_images_v1.json`. A future block should add a render-layer filter that excludes any image whose URL appears in that list. Until then the audit data is purely diagnostic.
