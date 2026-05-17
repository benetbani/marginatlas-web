# 14 — Bootstrap prompt for a fresh Claude Code session

Paste the block below into a new Claude Code session opened at
`E:\atlas\website`. Do not edit it. The new session will read the full
handoff package before doing anything.

---

```
You are picking up the Margin Atlas project mid-flight from a previous
Claude Code session that ran out of context. Do NOT start work yet.

STEP 1 — Read the handoff package in order, fully, before responding:
  E:\atlas\website\docs\handoff\00_README.md
  E:\atlas\website\docs\handoff\01_PROJECT_OVERVIEW.md
  E:\atlas\website\docs\handoff\02_FOUNDER_PROFILE.md
  E:\atlas\website\docs\handoff\03_DECISION_LOG.md
  E:\atlas\website\docs\handoff\04_CURRENT_STATE.md
  E:\atlas\website\docs\handoff\05_DATABASE_SCHEMA.md
  E:\atlas\website\docs\handoff\06_API_KEYS_AND_SECRETS.md
  E:\atlas\website\docs\handoff\07_CODEBASE_TOUR.md
  E:\atlas\website\docs\handoff\08_INGEST_SCRIPTS.md
  E:\atlas\website\docs\handoff\09_BLOCKERS_AND_RESOLUTIONS.md
  E:\atlas\website\docs\handoff\10_NEVER_DO_RULES.md
  E:\atlas\website\docs\handoff\11_NEXT_STEPS.md
  E:\atlas\website\docs\handoff\12_VERIFICATION_URLS.md
  E:\atlas\website\docs\handoff\13_GLOSSARY.md

STEP 2 — Operating rules you MUST internalise from those files:
  - Never use the word "okay". Be direct. No fluff vocabulary.
  - Never reveal source agencies (Eurostat, Census, e-Stat, IBGE, etc.)
    in user-facing copy. Internal docs only.
  - Aquamarine/teal is reserved for Tesseract Stock Agent. Margin Atlas
    uses the warm-earth palette (atlas, cream, parchment, moss, clay,
    cocoa) defined in tailwind.config.ts.
  - Banking sectors stay OFF the default UI (corp_only audience tag).
  - /ask route stays in preview mode until editorial tone is locked.
  - No paid Destatis. No "Coming soon" tiles. No alphabetical sort on
    the sector menu. No image-on-right hero layouts.
  - Never commit .env.local. Never echo secret keys back to chat.
  - Python ingest: chunksize streaming only, RSS cap 600 MB, no
    parallel pipelines, resume from progress.json.
  - tsc + lint before every commit. No --no-verify. No force push.

STEP 3 — Current data state (as of handoff):
  - regional_cells: 179,409 rows live in Supabase
  - cells_master (US state): 722,000 rows
  - extrapolated_cells (country-level): 57,816 rows
  - Phases DONE: 01 EU NUTS (43,903), 08 JP (6,951), 10 US (87,573),
    15a BR (1,483), 18 city overlay (41,448)
  - Phases PARTIAL: 11 CA (65, wrong table), 15 LATAM, 17 OECD+WB
  - Phases DEFERRED: 02, 04-07, 09, 12-14, 16 (see file 11)

STEP 4 — Active blockers requiring founder action (file 09):
  - B-001 Cloudflare DNS: marginatlas.com returns 522, Vercel preview
    works. Founder needs to update nameservers or add A/CNAME.
  - B-002 Editorial tone undecided — blocks /ask live mode + narrative.
  - B-008 Real product images still placeholder.
  - ANTHROPIC_API_KEY exists in .env.local but NOT in Vercel env vars.

STEP 5 — Highest-yield next steps (file 11):
  - S-04 NAICS-3 expansion in US Census pipeline (largest row gain
    per hour of work).
  - S-05 Canada retry on correct table 33-10-0418.
  - S-06 OECD endpoint migration to sdmx.oecd.org/public/rest/data/.
  - S-07 UK NOMIS numeric ID lookup.

STEP 6 — After reading all 14 files, reply with EXACTLY this format
and nothing else:

  Handoff loaded.
  Regional cells: <number from file 04>
  Top blocker: <B-XXX from file 09>
  Next step I recommend: <S-XX from file 11> — <one sentence why>
  Awaiting instruction.

Do NOT summarise the files. Do NOT propose a plan. Do NOT start coding.
Wait for the founder's first instruction after that confirmation line.
```

---

## How to use this

1. Open a new Claude Code session at `E:\atlas\website`.
2. Copy the block between the `---` markers above (including the
   triple-backtick fence) and paste it as your first message.
3. The new session will read all 14 files and reply with the
   five-line confirmation. From there, give it your next instruction
   (e.g. "Do S-04 now" or "Fix B-001 with me click-by-click").
