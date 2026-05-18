# 44 · Track NN — Public API + SDK + Webhooks

> Ecosystem play. Third parties (consultants, fintech apps, journalism
> tools) can integrate via REST/GraphQL with proper docs + SDKs.

---

## 1 · Goal

A documented, rate-limited, monetized public API. Python + JS SDKs
for easy integration. Webhooks for data updates.

---

## 2 · Sub-tracks

### NN.1 — REST API design

Endpoints:
- `GET /api/v1/cells` — list with filters (country, region, industry, size)
- `GET /api/v1/cells/{country}/{geo}/{industry}` — single cell
- `GET /api/v1/countries` — list of covered countries
- `GET /api/v1/industries` — list of taxonomy industries
- `GET /api/v1/sectors` — list of sectors
- `GET /api/v1/cities` — list of top-1000 cities
- `POST /api/v1/ask` — programmatic /ask access (Pro only)
- `GET /api/v1/tax-rates/{country}` — country tax overlay rates
- `GET /api/v1/coverage` — per-country quality scorecard

All return JSON. Consistent error shape.

Effort: 4 hr.

### NN.2 — Rate limiting + auth

API key per user (generated in /account/api):
- Free tier: 100 requests/hour
- Pro tier: 10,000 requests/hour
- Enterprise: unlimited

Auth via `X-API-Key` header. Rate limit via middleware.

Effort: 2 hr.

### NN.3 — OpenAPI spec

Generate `openapi.yaml` from route definitions. Host at `/api/openapi.json`.
Auto-generate Swagger UI at `/api/docs`.

Effort: 2 hr.

### NN.4 — Python SDK

`pip install margin-atlas`:
```python
from margin_atlas import Atlas
atlas = Atlas(api_key="...")
cell = atlas.cell(country="us", region="california", industry="restaurants")
print(cell.revenue_per_firm)
```

Repo: `github.com/benetbani/margin-atlas-python`. Public.

Effort: 4 hr.

### NN.5 — JavaScript SDK

`npm install margin-atlas`:
```ts
import { Atlas } from 'margin-atlas';
const atlas = new Atlas({ apiKey: '...' });
const cell = await atlas.cell({ country: 'us', region: 'california', industry: 'restaurants' });
```

Repo: `github.com/benetbani/margin-atlas-js`. Public.

Effort: 3 hr.

### NN.6 — Webhooks

When new ingest lands or quality scores change significantly:
- Send POST to user-registered webhook URL
- Payload: `{ event: "cell.updated", country: "us", ..., changes: {...} }`

Use cases:
- Third-party apps refresh their cache when data changes
- Internal Slack notifications for big quality shifts

Effort: 3 hr.

### NN.7 — Postman collection + curl examples

Pre-built Postman collection + curl examples in /api/docs.

Effort: 1 hr.

### NN.8 — Embed widgets

`<script src="https://marginatlas.com/embed.js" data-cell="us/california/restaurants"></script>`

Renders a small read-only cell card. For blogs / news sites.

Effort: 3 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| NN.1 REST endpoints | 4 hr |
| NN.2 Auth + rate limit | 2 hr |
| NN.3 OpenAPI spec | 2 hr |
| NN.4 Python SDK | 4 hr |
| NN.5 JS SDK | 3 hr |
| NN.6 Webhooks | 3 hr |
| NN.7 Postman + curl | 1 hr |
| NN.8 Embed widgets | 3 hr |
| **Total** | **~22 hr** |

---

## 4 · Verification gate

- All REST endpoints return valid JSON
- Rate limit triggers correctly for free vs Pro users
- Python SDK example works end-to-end
- JS SDK example works
- Webhook fires on test event
- Embed widget renders on a sample external page

---

## 5 · What this unlocks

- Pro+ revenue tier (API access is a strong upgrade driver)
- Third-party ecosystem (apps integrating Margin Atlas data)
- Press / journalism use cases (embed widgets on news articles)
