---
title: "Building a global SMB benchmark from 9 statistical agencies"
date: "2026-05-03"
excerpt: "How we combined US Census, Eurostat, Destatis, INSEE, e-Stat, GUS, IBGE, SingStat, and SSB into one queryable database."
author: "Margin Atlas team"
---

Margin Atlas v1.15 pulls primary data from nine government statistical agencies, each with its own access pattern, format, schema, and update cadence.

- US Census Bureau (SUSB, CBP, ZBP): REST APIs + bulk CSV
- Eurostat: JSON-stat REST
- Destatis (Germany): GENESIS-Online with token header auth
- INSEE (France): SIRENE bulk parquet from data.gouv.fr
- e-Stat (Japan): REST + token, decoded via getMetaInfo
- GUS (Poland): BDL JSON
- IBGE (Brazil): SIDRA values
- SingStat (Singapore): Table Builder API
- SSB (Norway): PxWebApi

Each pipeline runs as a Python script, lands in parquet, then gets aggregated into a unified `cells_master_global.parquet` (5.5 MB compressed, 25 MB uncompressed).
