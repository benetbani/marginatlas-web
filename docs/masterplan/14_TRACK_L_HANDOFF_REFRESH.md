# 14 · Track L — Handoff Folder Refresh

> Updates `docs/handoff/` so the next session inherits a clean,
> current picture. Always runs last, regardless of how many tracks
> landed.

---

## 1 · Goal

Refresh the canonical handoff package so the next Claude session
picking up this codebase has accurate state.

Specifically:

- `04_CURRENT_STATE.md` reflects new row counts + new countries
- `03_DECISION_LOG.md` captures decisions made this sweep
- `09_BLOCKERS_AND_RESOLUTIONS.md` marks resolved blockers CLOSED
- `11_NEXT_STEPS.md` is re-ordered with done items struck through
- `12_VERIFICATION_URLS.md` extended with new phases' spot-check URLs

---

## 2 · Targets

| Task | Pass criterion |
|---|---|
| L.1 `04_CURRENT_STATE.md` | Reflects new totals |
| L.2 `03_DECISION_LOG.md` | New D-1NN entries appended |
| L.3 `09_BLOCKERS_AND_RESOLUTIONS.md` | Resolved blockers marked CLOSED |
| L.4 `11_NEXT_STEPS.md` | Done items struck through; reordered |
| L.5 `12_VERIFICATION_URLS.md` | New phases' URLs added |
| L.6 Commit + push | Single commit with all handoff changes |

---

## 3 · T-L.1 · Update `04_CURRENT_STATE.md`

### Sections to update

#### §5 Supabase project state — row count tables

```markdown
### Per-table row counts

| Table | Rows | Source |
|---|---|---|
| `cells_master` | ~722,000 | v1.5 US Census SUSB pre-existing data |
| `extrapolated_cells` | 57,816 | Regression-based country estimates (219 country codes) |
| `regional_cells` | **<NEW_TOTAL>** | Sub-national data added across sessions 3-5 |

### regional_cells breakdown (post-sweep)

| Country / source | Rows | Tier | Phase / Track |
|---|---|---|---|
| United States (county-level) | <N> | P | Phase 10 + Track C.3 re-execute |
| EU-27 + EFTA (NUTS-1/2/3) | 43,903 | S | Phase 1 |
| Global city overlay | 41,448 | X | Phase 18 |
| Japan (prefecture + municipality) | 6,951 | P | Phase 8 |
| Brazil (state) | 1,483 | P | Phase 15 |
| Brazil cities | 834 | X | Phase 18b |
| Canada (correct table) | <N> | P | Track C.1 |
| Netherlands gemeenten | <N> | P | Track D.2 |
| Spain municipios | <N> | P | Track D.5 |
| Italy comuni | <N> | P | Track D.8 |
| UK LADs + MSOAs | <N> | P | Track E |
| OECD overlay (KR/IL/CL/MX/NZ) | <N> | S | Track F |
| Australia SA4/SA3 | <N> | P | Track G.2 |
| New Zealand TLA | <N> | P | Track G.4 |
| France communes | <N> | P | Track H |
| Mexico INEGI | <N> | P | Track I.1 |
| Argentina INDEC | <N> | P | Track I.2 |
| Chile INE | <N> | P | Track I.3 |
| Colombia | <N> | P | Track I.4 |
| Peru INEI | <N> | P | Track I.5 |
```

#### §9 What's broken or pending

Mark as resolved or still-open per actual state. Remove any
that landed:

- "France Sirene ingest" → if Track H landed: remove from broken
  table, mark as DONE in handoff §8
- "Auth + Stripe" → still deferred (not in this sweep)
- "Real images" → still deferred
- "EU LAU per-country" → mark NL/ES/IT as DONE
- "OECD regional overlay" → DONE
- "UK NOMIS" → DONE

### Steps

#### T-L.1.1 — Pull current row counts

```bash
python E:\atlas\scripts\audit_regional_coverage.py > delivery/regional/audit_post_sweep.txt
```

#### T-L.1.2 — Update tables

Edit `docs/handoff/04_CURRENT_STATE.md` with the new numbers.
Preserve existing structure.

---

## 4 · T-L.2 · Append to `03_DECISION_LOG.md`

### Section G or new section · Decisions made this sweep

Append D-100 onwards. Examples:

```markdown
### D-100 · Expanded NAICS-3 coverage 73 → ~180 codes
- **What:** Added ~80 NAICS-3 codes + ~10 sub-niches to industries.json
- **Why:** Track B; previously the US/CA/MX pipelines silently dropped 70% of rows
- **When:** Sweep 1
- **Status:** active

### D-101 · Canada correct table 33-10-0418-01
- **What:** Migrated from wrong table 33-10-0307 to correct 33-10-0418-01
- **Why:** Original was business dynamics survey; correct is business counts
- **When:** Sweep 1
- **Status:** active

### D-102 · OECD SDMX endpoint migration
- **What:** Migrated from `stats.oecd.org/SDMX-JSON/` to `sdmx.oecd.org/public/rest/data/` with dataflow `DSD_REG_BUS_DEM` (or whichever was locked in F.2)
- **Why:** Old endpoint returns 404
- **When:** Sweep 1
- **Status:** active

### D-103 · CBS gemeenten Open Data table 81588NED
- **What:** Netherlands ingest uses CBS table 81588NED
- **When:** Sweep 1
- **Status:** active

(continue for ES, IT, GB, AU, NZ, FR, MX, AR, CL, CO, PE per actual landings)

### D-110 · ABS API v2 endpoint
- **What:** Australia uses `api.data.abs.gov.au` (v2), not the deprecated `stat.data.abs.gov.au` (v1)
- **When:** Sweep 1
- **Status:** active
```

---

## 5 · T-L.3 · Update `09_BLOCKERS_AND_RESOLUTIONS.md`

### Mark CLOSED where applicable

- B-004 (NAICS-3 taxonomy gap) → CLOSED if Track B landed
- B-005 (Canada wrong table) → CLOSED if Track C.1 landed
- B-006 (OECD endpoint) → CLOSED if Track F landed
- B-007 (UK NOMIS) → CLOSED if Track E landed
- B-012 (EU LAU) → PARTIALLY CLOSED (NL/ES/IT done; DE still deferred)
- B-013 (smaller country pipelines) → PARTIALLY CLOSED (AU/NZ/MX/AR/CL/CO/PE done if Tracks G + I landed)

### Add new blockers if any emerged

Examples that might emerge:

- B-014 OECD endpoint dataflow uses TL2 not TL3 (less granular than hoped)
- B-015 INE Spain rate limit lower than expected
- B-016 INEGI Mexico requires re-registration annually

Each with stable ID + resolution path.

### Founder-action blockers remain OPEN

Don't auto-close A.1 (DNS), A.2 (tone), A.4 (Sirene), A.5 (images)
unless founder explicitly says they're done.

---

## 6 · T-L.4 · Reorder `11_NEXT_STEPS.md`

### Strike through done items

```markdown
### ~~S-10 · Expand NAICS-3 coverage in industries.json~~ **DONE Sweep 1**
### ~~S-11 · Re-execute Canada with correct StatCan table~~ **DONE Sweep 1**
### ~~S-12 · Fix OECD SDMX endpoint~~ **DONE Sweep 1**
### ~~S-13 · UK NOMIS numeric ID discovery + execute~~ **DONE Sweep 1**
### ~~S-14 · Netherlands LAU (CBS Statline)~~ **DONE Sweep 1**
### ~~S-15 · Spain LAU (INE DIRCE municipios)~~ **DONE Sweep 1**
### ~~S-16 · Italy LAU (ISTAT comuni)~~ **DONE Sweep 1**
### ~~S-18 · Mexico INEGI DENUE~~ **DONE Sweep 1**
### ~~S-19 · Australia ABS + New Zealand Stats NZ~~ **DONE Sweep 1**
### ~~S-21 · Sitemap regeneration with regional cells~~ **DONE Sweep 1**
```

### New highest-priority items

After this sweep, the next-highest items become:

- **S-50 · Editorial content production** (now that Track A.2 may be resolved)
- **S-51 · DE Gemeinden** (only paid Destatis path; or pivot to a different source)
- **S-52 · India MCA + China NBS** (large remaining markets)
- **S-53 · SEA cluster** (SG, MY, ID, TH, VN, PH)
- **S-54 · MENA + Africa cluster**
- **S-55 · Auth + Stripe** (PLAN_V4 §28 + §29) — when founder asks
- **S-56 · Real image production** — when founder asks

Add these to `11_NEXT_STEPS.md` with proper structure.

---

## 7 · T-L.5 · Extend `12_VERIFICATION_URLS.md`

For each new phase landed, add a new section with 5-10 spot-check
URLs. Examples:

```markdown
## N · Track C — Canada (correct table)

| URL | Province | Industry |
|---|---|---|
| `/ca/ca-on/restaurants` | Ontario | Restaurants |
| ... |

## N+1 · Track D — Netherlands gemeenten

| URL | Gemeente | Industry |
|---|---|---|
| `/nl/nl-gm0363/restaurants` | Amsterdam | Restaurants |
| ... |

## N+2 · Track D — Spain municipios

| URL | Municipio | Industry |
|---|---|---|
| `/es/es-28079/restaurants` | Madrid | Restaurants |
| ... |
```

(One section per landed track from D, E, F, G, H, I.)

---

## 8 · T-L.6 · Single commit

```bash
git add docs/handoff/04_CURRENT_STATE.md \
        docs/handoff/03_DECISION_LOG.md \
        docs/handoff/09_BLOCKERS_AND_RESOLUTIONS.md \
        docs/handoff/11_NEXT_STEPS.md \
        docs/handoff/12_VERIFICATION_URLS.md

git commit -m "$(cat <<'EOF'
handoff: refresh after master plan sweep 1

- Updated row counts: regional_cells <N> (was 179,409)
- Marked B-004/B-005/B-006/B-007 CLOSED
- Marked B-012 + B-013 partially closed
- Added D-100..D-1NN decisions made this sweep
- Struck through S-10..S-21 (done); added S-50..S-56 (next)
- Extended verification URLs with 6 new phase sections

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
git push origin main
```

---

## 9 · Verification gate

| Check | Pass criterion |
|---|---|
| L.1 `04_CURRENT_STATE.md` | Row counts match audit_post_sweep.txt |
| L.2 `03_DECISION_LOG.md` | At least 6 new D-1NN entries |
| L.3 `09_BLOCKERS_AND_RESOLUTIONS.md` | All landed-track blockers CLOSED |
| L.4 `11_NEXT_STEPS.md` | At least 6 items struck through |
| L.5 `12_VERIFICATION_URLS.md` | At least 6 new sections |
| L.6 Commit + push | Single commit with all 5 files |
| Vercel auto-deploy | Green (sanity — handoff edits don't break build) |

When all seven pass: **L is DONE.** Sweep complete.

---

## 10 · Time estimate

| Task | Time |
|---|---|
| L.1 Update current state | 30 min |
| L.2 Append decisions | 20 min |
| L.3 Update blockers | 15 min |
| L.4 Reorder next steps | 20 min |
| L.5 Extend URLs | 30 min |
| L.6 Commit + push | 10 min |
| **Total** | ~2 hours |

---

## 11 · Why this track matters

If Track L is skipped: the next session opens an old handoff
folder, doesn't know about the new countries, re-suggests S-10 +
S-11 + S-13 + etc. as if they're undone, and wastes 30 minutes
discovering they're already done.

If Track L is done: the next session starts from the actual
current state with a clear list of what's next.

This is the most important "boring" track. Do not skip it.

---

## 12 · End-of-sweep ritual

After Track L commit:

1. Verify `https://marginatlas-web-twtl.vercel.app/sitemap.xml` returns the new URL count
2. Verify `https://marginatlas.com` if DNS is resolved (A.1)
3. Post summary to founder:
   ```
   Sweep complete. regional_cells now at <N> rows (+<DELTA> from baseline).
   New countries with measured sub-national: <list>.
   Smoke test pass rate: <%>.
   Handoff folder refreshed. Final report: docs/ingest/FINAL_REPORT_v2.md.
   ```

---

## 13 · If sweep is partial

If only some tracks landed (e.g. only B + C + D before context ran
out):

- Still run Track L
- Update `04_CURRENT_STATE.md` to reflect only the tracks that landed
- Don't strike through items in `11_NEXT_STEPS.md` that didn't actually run
- In `docs/masterplan/PROGRESS.md`, note exact track-by-track status
- Commit message: "handoff: refresh after partial sweep — tracks B+C+D landed, E-K deferred"

The next session can pick up where this one stopped.
