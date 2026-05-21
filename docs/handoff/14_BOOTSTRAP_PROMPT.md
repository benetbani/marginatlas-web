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
  E:\atlas\website\docs\handoff\15_SESSION_5_UPDATE.md   ← READ LAST; authoritative delta

The file 15_SESSION_5_UPDATE.md overrides 00-14 wherever they conflict.
It captures the 13 commits + Plan v15 + R-003 hotfix shipped on
2026-05-21. Chapters 00-14 were last updated 2026-05-17 so several
"current state" claims in them are stale.

STEP 2 — Operating rules you MUST internalise (chapter 10 + chapter 15 §8):
  - Never use the word "okay". Be direct. No fluff vocabulary.
  - Never reveal source agencies (Eurostat, Census, e-Stat, IBGE, etc.)
    in user-facing copy. Internal docs only.
  - Aquamarine/teal is reserved for Tesseract Stock Agent. Margin Atlas
    uses the warm-earth palette (atlas, cream, parchment, moss, clay,
    cocoa) defined in tailwind.config.ts.
  - Banking sectors stay OFF the default UI (corp_only audience tag).
  - Never commit .env.local. Never echo secret keys back to chat.
  - Python ingest: chunksize streaming only, RSS cap 600 MB, no
    parallel pipelines, resume from progress.json.
  - tsc + lint before every commit. No --no-verify. No force push.
  - Never display calendar years in user-facing copy (D-107 in ch 15).
  - Never use "cell" / "cells" in user-facing copy. Say "benchmark"
    or "snapshot" (D-107).
  - Never use raw `p10/p50/p90` notation. Say "Bottom 10% / Typical /
    Top 10%" (D-107).
  - Never re-add `export const revalidate` AND `await searchParams` to
    the same page — that's R-003, catastrophic 500s. See D-101 ch 15.
  - Never re-enable `withSentryConfig(...)` without verifying SSR doesn't
    crash with RangeError. See D-100 / B-100 ch 15.

STEP 3 — Current state (as of session 5, 2026-05-21):
  - Site is LIVE at https://www.marginatlas.com (DNS B-001 resolved).
  - HEAD: c4d99b4 on main. 13 commits shipped in session 5.
  - Working tree: clean except for auto-generated noise + untracked
    data files listed in chapter 15 §6.
  - All 8 blocks of Plan v15 + R-003 hotfix are shipped.
  - Per-cell narratives cache (2,259 entries) live at
    data/content/cell_narratives_v1.json.
  - Style guide locked at docs/specs/2026-05-19-site-editorial-style-guide.md.
  - Sentry webpack wrapper DISABLED in next.config.js (B-100). Runtime
    init still active in production.
  - Benchmark page (/[country]/[geo]/[industry]) is force-dynamic;
    Next ISR caching is OFF until S-100 lands (B-101).

STEP 4 — Active blockers (chapter 15 §3):
  - B-008 Unsplash production tier still pending approval.
  - B-100 Sentry webpack wrapper disabled (re-enable after upstream fix).
  - B-101 Benchmark pages bypass Next ISR (S-100 restores caching).

STEP 5 — Highest-leverage next steps (chapter 15 §7):
  - S-100 Restore ISR caching on benchmark pages by moving the size/year
    switcher to a client component using useSearchParams.
  - S-101 Rename internal "cell" identifiers (cosmetic).
  - S-102 Bulk-import remaining 185 country anchors from the style guide.
  - S-103 Re-enable Sentry once @sentry/nextjs has a Next 15.5.18 fix.
  - S-104 AskWidget streaming UX.
  - S-105 Quarterly CPI table refresh in src/lib/stats/inflation.ts.

STEP 6 — After reading all 16 files, reply with EXACTLY this format
and nothing else:

  Handoff loaded.
  HEAD: <commit hash from chapter 15 §0>
  Live URL: <www URL from chapter 15 §1>
  Top open follow-up: <S-XXX from chapter 15 §7> — <one sentence why>
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
