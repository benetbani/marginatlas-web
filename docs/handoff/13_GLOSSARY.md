# 13 · Glossary

> Terminology used throughout this project. Industry classifications,
> geographic codes, internal terms, and acronyms.

---

## A · Industry classifications

| Code | Full name | Used by | In our taxonomy |
|---|---|---|---|
| **NAICS** | North American Industry Classification System | US Census, Canada StatCan, Mexico INEGI (as SCIAN) | `naics_3` field on industries (3-digit codes) |
| **NACE** | Statistical Classification of Economic Activities in the European Community (Rev.2) | Eurostat, EU national agencies | `nace_divisions` field (2-digit codes) |
| **ISIC** | International Standard Industrial Classification (Rev.4) | UN, World Bank, generic fallback | `isic_divisions` field (2-digit codes) |
| **JSIC** | Japan Standard Industrial Classification | Japan e-Stat | Bridged via ISIC for now (`isic_to_industry_id`); future dedicated JSIC table |
| **KSIC** | Korean Standard Industrial Classification | KOSIS (impossible to ingest) | Bridged via NACE; minimal use |
| **ANZSIC** | Australia/New Zealand Standard Industrial Classification (2006) | ABS, Stats NZ | `ANZSIC_BRIDGE` constant in `industry_mapper.py` |
| **CNAE** | Brazilian Classification of Economic Activities (2.0) | IBGE | Follows NACE Rev.2 at 4-digit; uses NACE crosswalk |
| **SCIAN** | Sistema de Clasificación Industrial de América del Norte | Mexico INEGI | Same as NAICS at 4-digit |
| **SIC 2007** | UK Standard Industrial Classification | UK ONS NOMIS | Aligned with NACE Rev.2 at 4-digit |
| **WZ-2008** | Wirtschaftszweige (German NACE implementation) | Germany Destatis | 1:1 with NACE Rev.2 |
| **ATECO** | Italian NACE implementation | ISTAT | 1:1 with NACE Rev.2 |
| **CNAE 2009** | Spanish NACE implementation | INE Spain | 1:1 with NACE Rev.2 |
| **NAF** | Nomenclature d'Activités Française | INSEE Sirene | Maps to NACE at 4-digit; 5-digit French extension |
| **MSIC** | Malaysia Standard Industrial Classification | DOSM Malaysia | Aligned with ISIC |
| **PSIC** | Philippine Standard Industrial Classification | PSA Philippines | Aligned with ISIC |
| **KBLI** | Klasifikasi Baku Lapangan Usaha Indonesia (2020) | BPS Indonesia | Aligned with ISIC |
| **VSIC** | Vietnam Standard Industrial Classification (2018) | GSO Vietnam | Aligned with ISIC |
| **NIC-2008** | India National Industrial Classification | India MCA | Based on NACE Rev.2 |
| **GB/T 4754** | Chinese National Standard for Industrial Classification | NBS China | Aligned with ISIC |
| **NMAE 2010** | Moroccan Nomenclature | HCP Morocco | Based on NACE |
| **CIIU** | Clasificación Industrial Internacional Uniforme (LATAM variant) | Argentina INDEC, Chile INE, Colombia DANE, Peru INEI | Spanish for ISIC |
| **CCSC** | (various LATAM) | Varies | Maps to ISIC |

---

## B · Geographic classification codes

| Code | Full name | Used by | Example |
|---|---|---|---|
| **ISO 3166-2** | Subdivision codes per country | Universal | `US-CA`, `BR-SP`, `DE-BY` |
| **NUTS** | Nomenclature of Territorial Units for Statistics | Eurostat (EU) | `DE21` (Oberbayern, NUTS-2), `DE212` (Munich, NUTS-3) |
| **LAU** | Local Administrative Units | Eurostat (formerly NUTS-4/5) | Municipalities |
| **FIPS** | Federal Information Processing Standards | US | `06` (California), `06037` (LA County) |
| **CBSA** | Core-Based Statistical Area | US Census | MSA + Micropolitan areas |
| **MSA** | Metropolitan Statistical Area | US Census | `31080` (LA-Long Beach-Anaheim) |
| **AGS** | Allgemeiner Gemeindeschlüssel | Destatis | German 5-digit Kreis code |
| **JIS X 0401** | Japan prefecture codes | e-Stat | `01` Hokkaido through `47` Okinawa |
| **JIS X 0402** | Japan municipality codes | e-Stat | `13101` Chiyoda ward |
| **INSEE commune** | French commune codes | INSEE | `75056` Paris |
| **CCC** | Codice catastale comune | ISTAT Italy | 4-digit comune code |
| **INE provincia** | Spanish provincia codes | INE | 2-digit + 3-digit municipio |
| **ABS SA1/SA2/SA3/SA4** | Australian Statistical Areas levels | ABS | Hierarchical |
| **ASGS** | Australian Statistical Geography Standard | ABS | Parent of SA codes |
| **SGC** | Standard Geographical Classification | StatCan | Canadian geo codes |
| **CMA** | Census Metropolitan Area | StatCan | Canadian metros |
| **CSD** | Census Subdivision | StatCan | Canadian municipalities |
| **LAD** | Local Authority District | UK ONS | English / Welsh / Scottish / NI districts |
| **MSOA** | Middle Super Output Area | UK ONS | Neighbourhoods within LADs |
| **UF** | Unidade Federativa | IBGE Brazil | Brazilian states |
| **DENUE** | Directorio Estadístico Nacional de Unidades Económicas | INEGI Mexico | Mexican firm directory |
| **Régions** | French régions (post-2016 reform) | INSEE | 13 metropolitan + 5 overseas |
| **Départements** | French départements | INSEE | 96 metropolitan + 5 overseas |
| **Communes** | French communes | INSEE | ~35,000 (every village) |
| **Comunidades autónomas** | Spanish autonomous regions | INE | 17 + 2 autonomous cities |
| **Bundesländer** | German federal states | Destatis | 16 |
| **Regierungsbezirke** | German government regions | Destatis | 38 (NUTS-2) |
| **Kreise** | German districts | Destatis | 401 (NUTS-3) |
| **Gemeinden** | German municipalities | Destatis | 10,790 (LAU) |
| **Comuni** | Italian municipalities | ISTAT | 7,904 |
| **Provincie** | Dutch provinces | CBS | 12 |
| **Gemeenten** | Dutch municipalities | CBS | ~340 |
| **Sigungu** | Korean districts (시군구) | KOSIS | 226 |
| **Município** | Brazilian municipality | IBGE | 5,570 |
| **Município (Mexico)** | Mexican municipality | INEGI | 2,469 |
| **Comuna (Chile)** | Chilean commune | INE Chile | 346 |
| **Distrito (Peru)** | Peruvian district | INEI | Varies |

---

## C · World Bank country aggregates (in `extrapolated_cells`)

These ISO-3-style codes are NOT individual countries; they're WB
regional groupings:

| Code | Meaning |
|---|---|
| AFE | Africa Eastern and Southern |
| AFW | Africa Western and Central |
| ARB | Arab World |
| EAR | Early-demographic dividend |
| EAS | East Asia & Pacific |
| EAP | East Asia & Pacific (excluding high income) |
| ECA | Europe & Central Asia (excluding high income) |
| ECS | Europe & Central Asia |
| EMU | Euro area |
| EUU | European Union |
| FCS | Fragile and conflict affected situations |
| HIC | High income |
| HPC | Heavily indebted poor countries |
| IBD | IBRD only |
| IBT | IDA & IBRD total |
| IDA | IDA total |
| IDB | IDA blend |
| IDX | IDA only |
| LAC | Latin America & Caribbean (excluding high income) |
| LCN | Latin America & Caribbean |
| LDC | Least developed countries (UN classification) |
| LIC | Low income |
| LMC | Lower middle income |
| LMY | Low & middle income |
| LTE | Late-demographic dividend |
| MEA | Middle East & North Africa |
| MIC | Middle income |
| MNA | Middle East & North Africa (excluding high income) |
| NAC | North America |
| OED | OECD members |
| OSS | Other small states |
| PRE | Pre-demographic dividend |
| PSS | Pacific island small states |
| PST | Post-demographic dividend |
| SAS | South Asia |
| SSA | Sub-Saharan Africa (excluding high income) |
| SSF | Sub-Saharan Africa |
| TEA | East Asia & Pacific (IDA & IBRD) |
| TEC | Europe & Central Asia (IDA & IBRD) |
| TLA | Latin America & Caribbean (IDA & IBRD) |
| TMN | Middle East, North Africa, Afghanistan & Pakistan (IDA & IBRD) |
| TSA | South Asia (IDA & IBRD) |
| TSS | Sub-Saharan Africa (IDA & IBRD) |
| UMC | Upper middle income |
| WLD | World |

These appear as `country_iso3` values but should NOT be treated as
countries in the UI.

---

## D · Quality tier codes

| Tier | Letter | Meaning |
|---|---|---|
| Primary | `P` | Direct measurement from a national statistical office |
| Secondary | `S` | Modelled from primary (e.g. Eurostat re-publishing) |
| Modelled | `M` | Imputed using primary + auxiliary data |
| Tabulated | `T` | Counts only; no distribution |
| Extrapolated | `X` | Regression / inference; not measured |

---

## E · Audience tags on industries

| Tag | Default visibility |
|---|---|
| `smb_core` | Visible (small-business dominated) |
| `smb_friendly` | Visible (has SMB participation + corp tail) |
| `mixed_caution` | Hidden by default (bimodal — average misleads) |
| `corp_only` | Hidden by default (large-firm dominated) |

The 5 Pro-only sectors all have `audience_default: "hidden"` and
contain mostly `corp_only` industries.

---

## F · Internal terms

| Term | Meaning |
|---|---|
| **SMB** | Small and medium business — the target audience |
| **Cell** | A single (country × geo × industry × year × size_band) data point |
| **Cell URL** | `/{country}/{geo}/{industry}` |
| **Geo level** | One of: country, state, province, county, district, prefecture, municipality, kreis, comune, commune, departement, sa2, lad, msoa, city, nuts1, nuts2, nuts3, lau |
| **Size band** | `1`, `2-9`, `10-49`, `50-249`, `250+`, or `total` |
| **Parent fallback** | The PARENT_FALLBACK_MAP that resolves uncovered sub-niches to covered cousins |
| **Gate** | The audience filter passed to visibleSectors/visibleIndustries (`{ revealMixed?, revealCorp? }`) |
| **Pro gate** | URL `?pro=1` or cookie `atlas_pro=1` — flips Gate.revealCorp = true |
| **Tier badge** | The QualityBadge component's 5-star rating |
| **Master menu** | The 20-sector curated grid (SectorMasterMenu component) |
| **Featured cell** | One of the 12 hand-curated tiles on the home page |
| **First-frame strip** | The rotating cell preview directly under the navigator |
| **Cell of the week** | The weekly-rotating editorial card on home |
| **Sister sector** | Other sectors shown at the bottom of a sector page |
| **Across-states strip** | Bar list of same-industry across US states |
| **AtlasScore** | 0-100 composite score per cell |
| **TypicalFirmCard** | Derived ratios card (employees per firm, etc.) |
| **DistributionHistogram** | SVG piecewise-density chart from p10/p25/p50/p75/p90 |
| **DistributionBars** | 5 horizontal tier bars |
| **TimeSeriesChart** | SVG sparkline with YoY pill |
| **CellPageNav** | Sticky right-rail TOC |
| **CellActions** | Save / Copy link / CSV / Embed action row |
| **DimensionSwitcher** | Sticky bar above cell-page hero for in-page pivoting |
| **SmartImage** | next/image wrapper with emoji-glyph placeholder |
| **Methodology lockdown** | Plan v3 Phase A — never reveal source agencies in user-visible text |
| **CRP** / **City overlay** | Phase 18 — derive city cells from extrapolated_cells × population/productivity factors |
| **Anchor country** | A country whose data was used to fit the original extrapolation regression; absent from extrapolated_cells (USA, DEU, FRA, ITA, ESP, GBR, JPN, BRA) |
| **RSS** | Resident Set Size — process memory in MB (what ram_guard checks) |
| **PostgREST** | The REST API layer Supabase puts in front of Postgres |
| **RLS** | Row Level Security — Postgres policy framework Supabase uses |

---

## G · External services

| Service | Purpose |
|---|---|
| **Supabase** | Hosted Postgres + PostgREST API + Auth (not used yet) + Storage (not used yet) |
| **Vercel** | Next.js hosting + edge middleware + auto-deploy from GitHub |
| **Cloudflare** | DNS for marginatlas.com + R2 cold-parquet storage (currently private) |
| **GitHub** | Source repo (private) |
| **Anthropic** | claude-sonnet-4-5 for /ask AI route |
| **World Bank** | Free PA.NUS.FCRF currency-conversion series + country-classification metadata |
| **OECD SDMX** | Free regional GVA data (endpoint migrated; not yet integrated) |
| **Eurostat** | Free EU NUTS business statistics (Phase 1 source) |
| **US Census Bureau** | Free CBP / SUSB / ZBP business statistics (Phase 10 source) |
| **Destatis** | Free German national statistics (Kreis-level paid; Länder free) |
| **e-Stat** | Free Japan government statistics (Phase 8 source) |
| **IBGE SIDRA** | Free Brazilian statistics (Phase 15 source) |
| **StatCan WDS** | Free Canadian statistics |
| **ONS NOMIS** | Free UK Office of National Statistics |
| **INSEE** | Free French national statistics |
| **ISTAT** | Free Italian national statistics |
| **INE Spain** | Free Spanish national statistics |
| **CBS Netherlands** | Free Dutch statistics |
| **KOSIS** | Korean statistics (impossible — Korean phone required for API key) |
| **ABS** | Free Australian statistics |
| **Stats NZ** | Free New Zealand statistics |

---

## H · Common abbreviations

| Abbr | Full |
|---|---|
| AI | Artificial intelligence |
| API | Application programming interface |
| CDN | Content delivery network |
| CI | Continuous integration |
| CSV | Comma-separated values |
| DDL | Data Definition Language (SQL CREATE etc.) |
| DNS | Domain Name System |
| FX | Foreign exchange |
| GVA | Gross value added |
| HTTP/HTTPS | Hypertext transfer protocol |
| ID / IDs | Identifier(s) |
| ISIC | (see Section A) |
| ISO | International Organization for Standardization |
| JSON | JavaScript Object Notation |
| LAU | Local Administrative Units |
| NACE | (see Section A) |
| NAICS | (see Section A) |
| NUTS | (see Section B) |
| OECD | Organisation for Economic Co-operation and Development |
| PK | Primary key |
| PR | Pull request |
| REST | Representational State Transfer |
| RLS | Row Level Security |
| RSS | Resident Set Size (memory) |
| SDMX | Statistical Data and Metadata eXchange |
| SEO | Search engine optimisation |
| SMB | Small and medium business |
| SQL | Structured Query Language |
| SSR | Server-Side Rendering |
| TS / TSX | TypeScript / TS with JSX |
| UI / UX | User interface / user experience |
| URL | Uniform Resource Locator |
| UTC | Coordinated Universal Time |
| WB | World Bank |
| WCAG | Web Content Accessibility Guidelines |
