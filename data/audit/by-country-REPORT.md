# Country page audit (Plan v18 Phase 1)

Probed 198 country pages against `https://www.marginatlas.com`.

## Summary

| Class | Count |
|---|---|
| ok | 51 |
| slow | 38 |
| empty | 4 |
| timeout | 67 |
| leak | 38 |

## Africa (2/54 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| DZ | timeout | 15013 | n | 0 |  |  |
| AO | slow | 10776 | y | 18 |  |  |
| BJ | leak | 14314 | y | 18 |  | OECD |
| BW | leak | 7485 | y | 18 |  | OECD |
| BF | leak | 6670 | y | 18 |  | OECD |
| BI | leak | 5621 | y | 18 |  | OECD |
| CV | leak | 5171 | y | 18 |  | OECD |
| CM | slow | 3099 | y | 18 |  |  |
| CF | leak | 4470 | y | 18 |  | OECD |
| TD | leak | 5045 | y | 18 |  | OECD |
| KM | leak | 9469 | y | 18 |  | OECD |
| CG | leak | 6908 | y | 18 |  | OECD |
| CD | leak | 7800 | y | 18 |  | OECD |
| CI | slow | 6115 | y | 18 |  |  |
| DJ | leak | 5674 | y | 18 |  | OECD |
| EG | slow | 11679 | y | 19 |  |  |
| GQ | leak | 1794 | y | 18 |  | OECD |
| ER | empty | 221 | n | 0 |  |  |
| ET | timeout | 15011 | n | 0 |  |  |
| GA | timeout | 15006 | n | 0 |  |  |
| GM | leak | 2953 | y | 18 |  | OECD |
| GH | slow | 4066 | y | 18 |  |  |
| GN | leak | 2690 | y | 18 |  | OECD |
| GW | timeout | 15012 | n | 0 |  |  |
| KE | timeout | 15001 | n | 0 |  |  |
| LS | timeout | 15011 | n | 0 |  |  |
| LR | timeout | 15008 | n | 0 |  |  |
| LY | timeout | 15011 | n | 0 |  |  |
| MG | timeout | 15002 | n | 0 |  |  |
| MW | timeout | 15015 | n | 0 |  |  |
| ML | timeout | 15013 | n | 0 |  |  |
| MR | timeout | 15017 | n | 0 |  |  |
| MU | timeout | 15009 | n | 0 |  |  |
| MA | timeout | 15010 | n | 0 |  |  |
| MZ | timeout | 15011 | n | 0 |  |  |
| NA | timeout | 15003 | n | 0 |  |  |
| NE | timeout | 15008 | n | 0 |  |  |
| NG | timeout | 15013 | n | 0 |  |  |
| RW | timeout | 15011 | n | 0 |  |  |
| ST | timeout | 15002 | n | 0 |  |  |
| SN | slow | 10067 | y | 18 |  |  |
| SC | timeout | 15005 | n | 0 |  |  |
| SL | leak | 7333 | y | 18 |  | OECD |
| SO | leak | 1933 | y | 18 |  | OECD |
| ZA | timeout | 15010 | n | 0 |  |  |
| SS | empty | 207 | n | 0 |  |  |
| SD | timeout | 15011 | n | 0 |  |  |
| SZ | leak | 13970 | y | 18 |  | OECD |
| TZ | slow | 12252 | y | 18 |  |  |
| TG | leak | 8477 | y | 18 |  | OECD |
| TN | slow | 4576 | y | 18 |  |  |
| UG | ok | 2988 | y | 18 |  |  |
| ZM | ok | 1632 | y | 18 |  |  |
| ZW | slow | 3371 | y | 18 |  |  |

## Asia (19/50 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| AF | leak | 2133 | y | 18 |  | OECD |
| AM | ok | 2201 | y | 18 |  |  |
| AZ | slow | 3802 | y | 18 |  |  |
| BH | ok | 1127 | y | 18 |  |  |
| BD | ok | 1694 | y | 18 |  |  |
| BT | leak | 2385 | y | 18 |  | OECD |
| BN | leak | 6928 | y | 18 |  | OECD |
| KH | slow | 5083 | y | 18 |  |  |
| CN | timeout | 15015 | n | 0 |  |  |
| GE | ok | 2003 | y | 18 |  |  |
| HK | timeout | 15004 | n | 0 |  |  |
| IN | timeout | 15004 | n | 0 |  |  |
| ID | slow | 4598 | y | 19 |  |  |
| IR | leak | 6043 | y | 19 |  | OECD |
| IQ | leak | 2565 | y | 18 |  | OECD |
| IL | slow | 11531 | y | 19 |  |  |
| JP | slow | 8205 | y | 22 |  |  |
| JO | slow | 6090 | y | 18 |  |  |
| KZ | ok | 2164 | y | 18 |  |  |
| KP | empty | 213 | n | 0 |  |  |
| KR | slow | 4942 | y | 20 |  |  |
| KW | ok | 1491 | y | 18 |  |  |
| KG | ok | 1183 | y | 18 |  |  |
| LA | ok | 1876 | y | 18 |  |  |
| LB | ok | 1841 | y | 18 |  |  |
| MO | leak | 1590 | y | 18 |  | OECD |
| MY | slow | 4824 | y | 19 |  |  |
| MV | leak | 989 | y | 18 |  | OECD |
| MN | ok | 927 | y | 18 |  |  |
| MM | ok | 1398 | y | 18 |  |  |
| NP | ok | 1293 | y | 18 |  |  |
| OM | ok | 1122 | y | 18 |  |  |
| PK | ok | 2792 | y | 19 |  |  |
| PS | leak | 1576 | y | 18 |  | OECD |
| PH | ok | 2696 | y | 19 |  |  |
| QA | ok | 893 | y | 18 |  |  |
| SA | slow | 4142 | y | 19 |  |  |
| SG | ok | 2685 | y | 19 |  |  |
| LK | ok | 1003 | y | 18 |  |  |
| SY | leak | 532 | y | 18 |  | OECD |
| TW | timeout | 15002 | n | 0 |  |  |
| TJ | ok | 1465 | y | 18 |  |  |
| TH | timeout | 15009 | n | 0 |  |  |
| TL | leak | 1177 | y | 18 |  | OECD |
| TR | timeout | 15012 | n | 0 |  |  |
| TM | timeout | 15014 | n | 0 |  |  |
| AE | timeout | 15014 | n | 0 |  |  |
| UZ | timeout | 15011 | n | 0 |  |  |
| VN | timeout | 15017 | n | 0 |  |  |
| YE | leak | 7423 | y | 18 |  | OECD |

## Europe (21/45 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| AL | slow | 6570 | y | 18 |  |  |
| AD | slow | 6286 | y | 18 |  |  |
| AT | slow | 8434 | y | 19 |  |  |
| BY | slow | 7333 | y | 18 |  |  |
| BE | timeout | 15007 | n | 0 |  |  |
| BA | ok | 1207 | y | 18 |  |  |
| BG | ok | 2180 | y | 18 |  |  |
| HR | slow | 10509 | y | 18 |  |  |
| CY | slow | 10640 | y | 18 |  |  |
| CZ | timeout | 15002 | n | 0 |  |  |
| DK | timeout | 15001 | n | 0 |  |  |
| EE | slow | 10823 | y | 18 |  |  |
| FI | timeout | 15003 | n | 0 |  |  |
| FR | timeout | 15002 | n | 0 |  |  |
| DE | slow | 13843 | y | 22 |  |  |
| GR | slow | 12639 | y | 19 |  |  |
| HU | slow | 14891 | y | 19 |  |  |
| IS | ok | 1691 | y | 18 |  |  |
| IE | slow | 10569 | y | 19 |  |  |
| IT | slow | 3812 | y | 20 |  |  |
| LV | ok | 745 | y | 18 |  |  |
| LI | ok | 720 | y | 18 |  |  |
| LT | ok | 1724 | y | 18 |  |  |
| LU | ok | 1259 | y | 18 |  |  |
| MT | ok | 1088 | y | 18 |  |  |
| MD | ok | 421 | y | 18 |  |  |
| MC | ok | 556 | y | 18 |  |  |
| ME | ok | 680 | y | 18 |  |  |
| NL | ok | 1135 | y | 20 |  |  |
| MK | ok | 536 | y | 18 |  |  |
| NO | slow | 9552 | y | 19 |  |  |
| PL | ok | 1725 | y | 19 |  |  |
| PT | slow | 9387 | y | 19 |  |  |
| RO | ok | 443 | y | 18 |  |  |
| RU | ok | 2741 | y | 19 |  |  |
| SM | ok | 1113 | y | 18 |  |  |
| RS | ok | 918 | y | 18 |  |  |
| SK | ok | 453 | y | 18 |  |  |
| SI | ok | 944 | y | 18 |  |  |
| ES | slow | 5658 | y | 22 |  |  |
| SE | slow | 11505 | y | 19 |  |  |
| CH | slow | 4137 | y | 19 |  |  |
| UA | ok | 2414 | y | 18 |  |  |
| GB | slow | 6133 | y | 22 |  |  |
| VA | empty | 210 | n | 0 |  |  |

## North America (9/23 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| AG | leak | 415 | y | 18 |  | OECD |
| BS | ok | 626 | y | 18 |  |  |
| BB | timeout | 15017 | n | 0 |  |  |
| BZ | leak | 6013 | y | 18 |  | OECD |
| CA | slow | 5902 | y | 21 |  |  |
| CR | slow | 4514 | y | 18 |  |  |
| CU | leak | 3422 | y | 18 |  | OECD |
| DM | leak | 1354 | y | 18 |  | OECD |
| DO | ok | 1132 | y | 18 |  |  |
| SV | ok | 954 | y | 18 |  |  |
| GD | leak | 1264 | y | 18 |  | OECD |
| GT | ok | 1264 | y | 18 |  |  |
| HT | leak | 1133 | y | 18 |  | OECD |
| HN | ok | 981 | y | 18 |  |  |
| JM | ok | 873 | y | 18 |  |  |
| MX | timeout | 15003 | n | 0 |  |  |
| NI | ok | 2421 | y | 18 |  |  |
| PA | ok | 1246 | y | 18 |  |  |
| KN | leak | 1456 | y | 18 |  | OECD |
| LC | leak | 444 | y | 18 |  | OECD |
| VC | leak | 658 | y | 18 |  | OECD |
| TT | ok | 1253 | y | 18 |  |  |
| US | timeout | 15004 | n | 0 |  |  |

## South America (0/12 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| AR | timeout | 15004 | n | 0 |  |  |
| BO | timeout | 15013 | n | 0 |  |  |
| BR | timeout | 15011 | n | 0 |  |  |
| CL | timeout | 15012 | n | 0 |  |  |
| CO | timeout | 15002 | n | 0 |  |  |
| EC | timeout | 15013 | n | 0 |  |  |
| GY | timeout | 15013 | n | 0 |  |  |
| PY | timeout | 15012 | n | 0 |  |  |
| PE | timeout | 15014 | n | 0 |  |  |
| SR | timeout | 15010 | n | 0 |  |  |
| UY | timeout | 15005 | n | 0 |  |  |
| VE | timeout | 15008 | n | 0 |  |  |

## Oceania (0/14 ok)

| iso2 | class | ms | h1 | industries | year-leak | source-leak |
|---|---|---|---|---|---|---|
| AU | timeout | 15006 | n | 0 |  |  |
| FJ | timeout | 15015 | n | 0 |  |  |
| KI | timeout | 15012 | n | 0 |  |  |
| MH | timeout | 15007 | n | 0 |  |  |
| FM | timeout | 15015 | n | 0 |  |  |
| NR | timeout | 15002 | n | 0 |  |  |
| NZ | timeout | 15005 | n | 0 |  |  |
| PW | timeout | 15015 | n | 0 |  |  |
| PG | timeout | 15013 | n | 0 |  |  |
| WS | timeout | 15008 | n | 0 |  |  |
| SB | timeout | 15005 | n | 0 |  |  |
| TO | timeout | 15011 | n | 0 |  |  |
| TV | timeout | 15008 | n | 0 |  |  |
| VU | timeout | 15012 | n | 0 |  |  |
