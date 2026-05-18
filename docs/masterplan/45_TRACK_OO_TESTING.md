# 45 · Track OO — Tests + CI + Visual Regression

> Automated tests so we don't break things when shipping fast. E2E
> smoke tests, CI pipeline polish, visual regression.

---

## 1 · Goal

Catch regressions before they ship. Build confidence in the codebase.

---

## 2 · Sub-tracks

### OO.1 — E2E smoke tests

Playwright suite covering:
- Home page loads
- Navigator submits with valid + invalid params
- Cell page renders with full sections
- /ask returns an answer
- /compare loads + filters
- Sign-in flow (after Track II ships)
- Tax overlay toggle works

Effort: 4 hr.

### OO.2 — Visual regression

Percy or Chromatic snapshots of key pages at 3 viewports:
- 360px, 768px, 1280px
- Home, cell, country, sector, compare, /ask, /coverage

Fails CI if pixel diff > threshold.

Effort: 2 hr setup + ongoing.

### OO.3 — TypeScript strict mode tightening

Audit `tsconfig.json`:
- Enable `noUncheckedIndexedAccess`
- Enable `noPropertyAccessFromIndexSignature`
- Fix all resulting errors

Effort: 3 hr.

### OO.4 — Unit tests for critical helpers

Vitest suite for:
- `score100to10()` — boundary cases
- `regionalSlugToGeoId()` — all alias patterns
- `slugToIndustry()` — common slugs + edge cases
- `estimatePostTax()` — math correctness for all 64 countries
- `getCellBySlug()` — fallback chain behavior

Effort: 3 hr.

### OO.5 — CI pipeline polish

GitHub Actions workflow:
- On PR: lint + type-check + unit tests + visual regression
- On main push: deploy to Vercel (already automatic)
- On schedule (daily): quality scan + broken-link audit

Effort: 2 hr.

### OO.6 — Pre-commit hooks

Husky + lint-staged:
- Format on commit
- Type check changed files
- Reject .env.local in staged diff

Effort: 1 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| OO.1 E2E Playwright | 4 hr |
| OO.2 Visual regression | 2 hr |
| OO.3 TS strict tightening | 3 hr |
| OO.4 Unit tests | 3 hr |
| OO.5 CI pipeline | 2 hr |
| OO.6 Pre-commit hooks | 1 hr |
| **Total** | **~15 hr** |

---

## 4 · Verification gate

- All E2E tests pass
- Visual regression baseline established
- Unit test coverage > 60% on lib/
- CI pipeline runs on every PR
- Pre-commit blocks .env.local stage

---

## 5 · What this unlocks

- Faster shipping with confidence
- Regressions caught in CI not production
- Foundation for team scaling (more contributors safely)
