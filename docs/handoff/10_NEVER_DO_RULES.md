# 10 · Never-Do Rules

> Hard prohibitions. Violating these has tangible negative consequences
> (CI fails, founder annoyed, data leak, money wasted, etc.). Stable
> IDs so other files can reference.

---

## R-001 · NEVER use aquamarine, teal, or cyan in Atlas UI

**Why:** Those colours are reserved for the founder's other product,
Tesseract Stock Agent. Atlas owns the warm-earth-tone palette
exclusively.

**Consequence of violation:** Brand confusion across sibling products;
founder explicit correction.

**Exception:** A single sparse deep teal (`#0F766E`) is allowed
as a "data signature accent" — used <5% of the surface, mostly on
quality-rating star outlines and AtlasScore "Strong" tier chips.

**Where this is enforced:**

- `tailwind.config.ts` — palette only includes warm-earth families
- All component files use only `atlas-*`, `cream-*`, `parchment`, `moss-*`, `clay-*`, `cocoa-*`, `ink-*`, `teal-700` (sparse)
- Reviewer should reject any PR introducing `cyan`, `aquamarine`, `sky`, `azure`, `indigo`, etc.

---

## R-002 · NEVER reveal source agencies in user-visible text

**Why:** Competitive moat. The QualityBadge component maps specific
agency names (Eurostat, Destatis, INSEE, US Census, e-Stat, etc.) to
generic labels ("National business statistics", "European business
statistics", etc.). Competitors with LLM tooling cannot easily
reverse-engineer our sources.

**Consequence of violation:** Free intelligence to competitors.
Methodology lockdown defeated.

**Where this is enforced:**

- `src/components/QualityBadge.tsx` — the `genericSource` function maps every agency keyword to a generic label
- `src/components/StructuredData.tsx` — stripped of `measurementTechnique`, `license`, `sameAs` fields that would leak provenance
- `src/app/about-data/page.tsx` — generic page replacing methodology
- `/methodology` route redirects to `/about-data`
- robots.txt blocks AI training crawlers
- middleware.ts adds extra crawler block

**Pattern to follow when adding a new ingest:**

```python
# In normalize() / per-row mapping:
return {
    ...
    "coverage_source": "National business statistics",  # GENERIC
    # NOT: "coverage_source": "Eurostat sbs_r_nuts06_r2"  # NEVER
    ...
}
```

The internal table can hold an agency-specific string IF and ONLY IF
QualityBadge.tsx has a pattern to map it to a generic label. New
sources need a new pattern added to `genericSource`.

---

## R-003 · NEVER name banking, oil & gas, pharma, telecom, large insurance, hospitals, universities in default UI

**Why:** These industries are bimodal — the typical "small clinic" or
"local insurance broker" sits in the same bucket as a hospital or
Goldman Sachs. The average is meaningless. They live in a Pro-only
gate.

**Consequence of violation:** Product positioning broken; founder
explicit correction; UI feels random / not focused on SMBs.

**Where this is enforced:**

- `src/lib/taxonomy/sectors.json` — five Pro-only sectors have `audience_default: "hidden"`
- `src/lib/taxonomy.ts` — `visibleSectors(gate)` filters them out unless `gate.revealCorp === true`
- `scripts/verify_taxonomy.ts` — fails the build if any default-visible sector has the word "banking" / "mining" / "energy" / "pharma" / "telecom" in its name
- `src/components/NavigatorForm.tsx` — sector dropdown uses `visibleSectors(gate)`
- `src/components/GlobalSearch.tsx` — sector hits use `visibleSectors(gate)`

**Exception:** Direct URL access to a corp_only cell (e.g.
`/us/california/banking`) is allowed — the page renders with a
"large-firm dominated" caveat. But it never appears in default
navigation or search.

---

## R-004 · NEVER use the word "okay" in responses to the founder

**Why:** Founder explicit: "do not use the word okay, now not this".
Flagged twice as annoying.

**Consequence of violation:** Founder annoyance; minor but cumulative.

**Where this matters:** Every single response. Including casual
acknowledgements.

**Alternatives:**

- "Done."
- "Understood."
- "Got it."
- "Will do."
- Or just start with the action / answer

---

## R-005 · NEVER apologise repeatedly

**Why:** Diminishing returns. One acknowledgement is fine; multiple
apologies waste the founder's time.

**Consequence of violation:** Reads as evasive / passive-aggressive.

**Pattern:** If you broke something, one line acknowledging it, then
the fix. Don't dwell.

---

## R-006 · NEVER commit `.env.local` to git

**Why:** Contains all API keys (Supabase service role, Anthropic,
Census, Destatis, e-Stat). Public exposure = security breach.

**Consequence of violation:** Need to rotate every key + audit access
+ explain to founder.

**Where this is enforced:**

- `.gitignore` — `.env*` pattern excludes everything starting with `.env`
- Pre-commit check: `git check-ignore -v .env.local` should output that the file is ignored
- Review any `git add -A` to make sure `.env.local` isn't staged

---

## R-007 · NEVER use `pd.read_csv()` without `chunksize=` on large files

**Why:** Large CSVs (Sirene 6 GB, INEGI DENUE 5M rows, etc.) will
blow the 600 MB RSS cap and crash the dev machine.

**Consequence of violation:** Process killed, founder has to restart,
RAM exhaustion potentially affecting other apps.

**Alternative pattern:**

```python
# WRONG
df = pandas.read_csv("StockUniteLegale.csv")  # 6 GB in memory

# RIGHT — chunked
for chunk in pandas.read_csv("StockUniteLegale.csv", chunksize=50000):
    process(chunk)

# BETTER — DuckDB streaming
duckdb.connect(":memory:")
.execute("SET memory_limit='400MB'")
.execute("""
    INSERT INTO agg
    SELECT codeCommune, NAF3, COUNT(*)
    FROM read_csv('StockUniteLegale.csv', auto_detect=true)
    GROUP BY 1, 2
""")
```

DuckDB spills to disk when memory is exceeded. Python process RSS
stays under 100 MB.

---

## R-008 · NEVER run parallel ingest pipelines

**Why:** RAM constraint (D-055). Founder explicit: "do not exceed
70% RAM" / "don't block the machine".

**Consequence of violation:** Machine hangs; founder loses other
work.

**Pattern:** One country at a time within a phase. One phase at a
time across the run. Use `ScheduleWakeup` to check on a background
task rather than spawning multiple.

---

## R-009 · NEVER exceed 600 MB RSS in any Python script

**Why:** Same as R-008.

**Consequence of violation:** Process killed by `ram_guard`; or worse,
machine hang if the guard isn't installed.

**Pattern:**

```python
from common.ram_guard import RamGuard

with RamGuard(cap_mb=600, label="my-phase") as g:
    for unit in units:
        process(unit)
        g.tick()    # check RSS; raises RamGuardError if over cap
```

Use this in every pipeline.

---

## R-010 · NEVER push to main without `npx tsc --noEmit` passing

**Why:** TypeScript strict mode catches schema drift. Vercel build
will fail anyway, but local catch is faster.

**Consequence of violation:** Vercel deploy fails; production stuck
on previous version until fix lands.

**Pattern:** Before any commit that touches `.ts` / `.tsx`:

```bash
cd /e/atlas/website
npx tsc --noEmit
# fix any errors before git add
```

---

## R-011 · NEVER add Banking / Oil & Gas / Pharma to the visible sector list

**Why:** CI `verify_taxonomy.ts` fails the build if any default-visible
sector has the word "banking", "mining", "energy", "pharma", "telecom"
in its name.

**Consequence of violation:** Vercel build fails before deploy.

**Pattern:** New sectors with these words must have
`audience_default: "hidden"` in `sectors.json`.

---

## R-012 · NEVER use `git push --force` to main

**Why:** Destructive. Rewrites history. Can lose other developers'
commits if any. Even with a single developer, can lose recovery
options.

**Consequence of violation:** Permanently lost commits.

**Exception:** Founder explicit one-time approval AND only after
backup.

---

## R-013 · NEVER skip pre-commit hooks with `--no-verify`

**Why:** Hooks catch problems (taxonomy violations, lint errors,
secrets). Skipping them defeats CI.

**Consequence of violation:** Bad code in main; downstream confusion.

**Pattern:** If a hook fails, fix the underlying issue. Don't bypass.

---

## R-014 · NEVER use the OLD Eurostat / OECD SDMX endpoint URL patterns

**Why:** Both Eurostat and OECD migrated their SDMX endpoints. Old
patterns return 404 (Eurostat) or empty data (OECD).

**Consequence of violation:** Wasted hours of debugging.

**Pattern:**

- Eurostat: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/`
- OECD: `https://sdmx.oecd.org/public/rest/data/` (with new dataflow names)

NOT:

- ❌ `https://ec.europa.eu/eurostat/wdds/rest/data/...`
- ❌ `https://stats.oecd.org/SDMX-JSON/data/...`

---

## R-015 · NEVER pay for Destatis Kreis data without founder explicit OK

**Why:** Phase 1 Eurostat already covers Germany at NUTS-3 (which
is approximately Kreis-level). Paying for Destatis would duplicate
unless we need fields Eurostat doesn't have (wage detail, niche
indicators).

**Consequence of violation:** Money spent on duplicate coverage.

**Pattern:** Mark Destatis Kreis as DUPLICATE in scoreboard.
Re-evaluate only if founder asks for fields Eurostat doesn't carry.

---

## R-016 · NEVER add "Coming soon" placeholder tiles

**Why:** Founder explicit: "what's the point of coming soon? It looks
broken."

**Consequence of violation:** UI feels under-construction; first
impression weakened.

**Pattern:** `FeaturedCellTile` returns `null` if its cell has no
data — the tile is dropped from the grid entirely.

---

## R-017 · NEVER suggest founder spend money without giving a direct yes/no recommendation + alternatives

**Why:** Founder is cautious but rational with money. Pitching an
upgrade without a clear recommendation feels evasive.

**Consequence of violation:** Founder pushes back ("be very direct,
not fluffy, tell me the plain reality").

**Pattern:**

> **Yes, upgrade Supabase to Pro now.** Math: free tier 500 MB, target 735 MB, won't fit. Pro 8 GB = 9% usage. Alternatives (R2 overflow, hybrid hot/cold, different DB) all add multi-day engineering work for $300/year savings. Not worth the swap. Click here, paste card, done.

Lead with the recommendation. Include alternatives only to show
they've been considered and rejected.

---

## R-018 · NEVER echo API keys in chat responses (unless founder explicitly asks)

**Why:** Chat logs may end up in training data, support tickets, or
other surfaces beyond the founder's session.

**Consequence of violation:** Key exposure → need to rotate
immediately.

**Exception:** If founder asks "what's my Anthropic key" (e.g. to
paste it into Vercel), read it from `.env.local` and paste back in
that response. They asked; they get it.

**Pattern:** Never proactively output a key. Never include in code
comments, error messages, debug output.

---

## R-019 · NEVER use the word "robust" / "comprehensive" / "leverages" / "delve" / "tapestry"

**Why:** Reads as LLM-generated fluff. Founder prefers plain
language.

**Consequence of violation:** Output feels lower quality.

**Alternatives:**

- "robust" → "resilient" / "well-tested" / "proven"
- "comprehensive" → "complete" / "full" / "thorough"
- "leverages" → "uses" / "relies on"
- "delve" → "look at" / "examine"
- "tapestry" → never. Just don't.

---

## R-020 · NEVER use em dashes in headlines (unless founder explicitly requests)

**Why:** Per project rules in CLAUDE.md. Headlines should be clean.

**Consequence of violation:** Visual noise; founder correction.

**Pattern:** Em dashes OK in body text. Headlines use comma, period,
colon.

---

## R-021 · NEVER use the word "slop" replaces "flop" for bad analysis

**Why:** Project lexicon. "Slop" is the founder's preferred term for
bad LLM/AI output. Don't say "flop".

**Where it matters:** Body copy, headlines, error messages.

---

## R-022 · NEVER add a new top-level page route without updating the layout nav

**Why:** Orphan pages are hard to discover.

**Consequence of violation:** Feature exists but no one finds it.

**Pattern:** When adding `/foo` page:

1. Create `src/app/foo/page.tsx`
2. Add link to `src/app/layout.tsx` header nav OR footer
3. Add to `src/app/sitemap.ts` if it should be in the sitemap

---

## R-023 · NEVER use placeholder Lorem Ipsum text in committed files

**Why:** Even temporary. Risks shipping to production.

**Consequence of violation:** Embarrassing.

**Pattern:** Either use real copy or use the SmartImage placeholder
pattern (gradient + emoji) which is intentional design, not filler.

---

## R-024 · NEVER add a new sector or industry without running `verify_taxonomy.ts`

**Why:** Structural invariants may break. CI will catch it on Vercel
build, but local catch is faster.

**Pattern:**

```bash
# After editing sectors.json or industries.json:
cd /e/atlas/website
npx tsx scripts/verify_taxonomy.ts
# expect: ✓ Taxonomy verification passed
```

---

## R-025 · NEVER commit a large file (>5 MB) to git

**Why:** Bloats clone time; eventually hits GitHub's 100 MB hard cap.

**Consequence of violation:** Cleanup is messy (BFG / git-filter-repo).

**Pattern:** Large source files (CSVs, parquet) go in
`E:\atlas\delivery\` (not a git repo). Ingest scripts cache them there.
Never commit.

---

## R-026 · NEVER write editorial / opinion / narrative content before founder decides tone

**Why:** Plan v3 §B.5, G, H deferred specifically waiting on tone
decision (D-040).

**Consequence of violation:** Tone mismatch; will need rewriting.

**Pattern:** Stick to dry-factual phrasing for cell pages, country
pages, sector pages. /ask preview-stub returns a fixed message.

---

## R-027 · NEVER add a new Pro-only sector to the sectors.json without setting `audience_default: "hidden"`

**Why:** CI will fail (R-011).

---

## R-028 · NEVER lose the per-pipeline `progress.json` files

**Why:** They enable resume support for long-running pipelines.

**Consequence of violation:** Re-running US Census from scratch =
1h50m wasted.

**Pattern:** Don't `rm -rf delivery/regional/`. Don't add `delivery/`
to git (it's already not in git). If genuinely re-running, only
delete the specific `<phase>/progress.json` file.

---

## R-029 · NEVER assume a US Census API call returns ALL rows by default

**Why:** Census APIs return only requested geographies. Without
specifying `for=county:*&in=state:06`, you get just the state-level
row.

**Pattern:** Always explicit about geography:

```python
# Right
url = f"{CBP_BASE}?get=NAME,EMP,ESTAB&for=county:*&in=state:{state}&NAICS2017={naics3}&key={KEY}"

# Wrong — returns 0 or weird data
url = f"{CBP_BASE}?get=NAME,EMP,ESTAB&NAICS2017={naics3}&key={KEY}"
```

---

## R-030 · NEVER skip the `Prefer: resolution=merge-duplicates` header on Supabase upserts

**Why:** Without it, PK conflicts return 409 instead of merging. Resume
won't work.

**Pattern:** Use `common/upload_to_supabase.py` which sets this
header by default. Don't roll your own upsert.

---

## Summary table

| ID | One-line rule |
|---|---|
| R-001 | No aquamarine / teal / cyan in UI |
| R-002 | No source agency names in user-visible text |
| R-003 | No banking / oil / pharma / telecom / hospitals in default UI |
| R-004 | No "okay" in responses |
| R-005 | One apology max |
| R-006 | Never commit .env.local |
| R-007 | Never `pd.read_csv` without chunksize on large files |
| R-008 | No parallel ingest pipelines |
| R-009 | RSS cap 600 MB per script |
| R-010 | `tsc --noEmit` before any TS commit |
| R-011 | No banking/mining/energy/pharma/telecom in default sectors |
| R-012 | No force push to main |
| R-013 | No `--no-verify` on git hooks |
| R-014 | Use NEW Eurostat / OECD endpoint URLs |
| R-015 | No paid Destatis without founder OK |
| R-016 | No "Coming soon" tiles |
| R-017 | Money recommendations are direct yes/no |
| R-018 | Never echo API keys (unless asked) |
| R-019 | No fluff vocabulary |
| R-020 | No em dashes in headlines |
| R-021 | "Slop" not "flop" |
| R-022 | New routes get nav links |
| R-023 | No Lorem Ipsum |
| R-024 | `verify_taxonomy.ts` after taxonomy edits |
| R-025 | No large files in git |
| R-026 | No editorial content until tone decided |
| R-027 | New Pro sectors → `audience_default: "hidden"` |
| R-028 | Don't delete progress.json files |
| R-029 | US Census API always specifies geography |
| R-030 | Always `Prefer: resolution=merge-duplicates` on Supabase upserts |
