# Bootstrap prompt for a new session

> Paste the block below into a fresh Claude Code message to pick up
> Margin Atlas work with full context, without rehashing the previous
> conversation. The new session reads `docs/HANDOFF.md` as its first
> action, which contains everything.

---

## The prompt

```
You're picking up Margin Atlas work mid-flight. The previous session
ran ~5 hours and is being archived. EVERYTHING you need is captured
in repo files — not in prior conversation history.

## STEP 0 — Read these files in order BEFORE doing anything

These are absolute paths on this Windows machine:

1. E:\atlas\website\docs\HANDOFF.md          (master state-of-world; ~800 lines)
2. E:\atlas\website\PLAN_V4.md               (current 30-step plan; most items shipped, some open)
3. E:\atlas\website\docs\ingest\FINAL_REPORT.md  (sub-national ingest comprehensive report)
4. E:\atlas\website\docs\ingest\19_VERIFICATION_QUALITY.md  (per-phase scoreboard)
5. E:\atlas\website\.env.local               (API keys — never commit, never echo to user)
6. E:\Archive\Projects\UI-UX\CLAUDE.md       (project rules)

Then do NOT respond to me yet. Send back exactly one message:
"Read HANDOFF.md + PLAN_V4.md + FINAL_REPORT.md + 19_VERIFICATION_
QUALITY.md + .env.local + CLAUDE.md. Ready. <one-sentence summary of
the current state>."

## STEP 1 — Operating rules (these are in HANDOFF.md §2 but worth restating)

Hard rules:
- NEVER use the word "okay" in any response. Founder has flagged
  this twice as annoying.
- Be direct, no fluff, no sweetening. Plain reality even when
  uncomfortable.
- When asked a yes/no question, lead with yes/no, then explain.
- Click-by-click means exact button names and paths.
- "Execute all of it, 0 stops" means don't pause for sub-phase
  approval, but DO pause for genuine blockers (missing API keys, DDL
  that needs Supabase SQL editor).
- Never reveal source agencies in user-visible text (competitive
  moat); the QualityBadge component generizes "Eurostat" /
  "Destatis" / etc. into generic labels.
- Never use aquamarine in atlas UI — that's reserved for the
  founder's other product, Tesseract Stock Agent. Atlas uses burnt
  amber + warm graphite + cream + moss + clay + cocoa palette.
- Never name banking, oil & gas, pharma, telecom, large insurance,
  large hospitals, universities in the default UI. Those 5 sectors
  are Pro-only behind `?pro=1` or `atlas_pro=1` cookie.
- Never run parallel ingest pipelines. One country at a time.
- Never exceed 600 MB RSS in any Python script. Use the
  scripts/ingest/common/ram_guard.py wrapper.
- Never push to main without `npx tsc --noEmit` passing.
- Never commit `.env.local` to git.

## STEP 2 — What's currently broken or blocking

In priority order from HANDOFF.md §14:

1. Cloudflare DNS for marginatlas.com — 522 error. Founder action:
   delete 2 Namecheap parking records, add 2 Vercel CNAMEs at grey
   cloud (DNS only). Click-by-click in HANDOFF.md §10 Blocker 1.

2. Editorial tone — undecided. Blocks `/ask` live mode + per-cell
   narrative content. Founder owns this.

3. France Sirene — 6 GB CSV needs founder-side download before
   the pipeline can run. Pipeline scaffolded at
   E:\atlas\scripts\ingest\fr_insee\.

4. Korea KOSIS — PERMANENTLY SKIPPED. Registration requires Korean
   mobile phone. Don't waste time on this.

5. Germany Destatis — token works but free tier only Länder, not
   Kreise. Kreis data needs paid subscription. Mark DUPLICATE.

## STEP 3 — Current data state

- regional_cells: 179,409 measured sub-national rows
- cells_master: ~722,000 US state rows (pre-existing v1.5 data)
- extrapolated_cells: 57,816 country-level regression estimates
- Supabase total: ~960k rows, ~360 MB of 8 GB Pro tier

Phases that landed: 1 EU NUTS, 8 JP Economic Census, 10 US Census
counties, 11 CA partial, 15 BR IBGE + BR cities, 18 global city
overlay.

Phases deferred / scaffolded: 2 EU LAU, 3 DE (free tier limit),
4 FR Sirene, 5 IT ISTAT, 6 ES INE, 7 UK NOMIS, 9 KR (impossible),
12 AU+NZ, 13 IN+CN, 14 SEA, 16 MENA+AF, 17 OECD overlay.

## STEP 4 — What to do next

Default behaviour: wait for founder direction. If founder says
"continue" or "go" or "execute" without specifics, the
recommended-next-steps list is HANDOFF.md §12. The single highest-
yield engineering item is:

> Expand NAICS-3 coverage in src/lib/taxonomy/industries.json from
> 73 codes to the full ~250-code universe. This would 2-3× the yield
> of Phases 10 (US), 11 (CA), 15 (MX) on re-run.

Second-highest:

> Re-execute Phase 11 Canada with correct StatCan table 33-10-0418-01
> (the previous run used 33-10-0270 which was the wrong dataset).
> Expected: ~12,000 additional CA county-level cells in ~2 hours.

## STEP 5 — How to use the keys (without echoing them to chat)

All API keys are in .env.local. They are:

- ANTHROPIC_API_KEY     (not in Vercel yet — gated by editorial tone)
- CENSUS_API_KEY        (used by us_census/fetch_cbp.py)
- DESTATIS_API_TOKEN    (limited use)
- ESTAT_APP_ID          (used by jp_estat/fetch.py)
- SUPABASE_SERVICE_ROLE_KEY (already in Vercel)

The Python ingest scripts read them via os.environ with fallback to
hardcoded defaults — meaning they work even without exporting env
vars. The Next.js app reads from .env.local (or Vercel env vars in
production).

NEVER echo a key value in a chat response. If the founder asks for
one, read it from .env.local with the Read tool and paste back —
but only when explicitly asked.

## STEP 6 — How the founder communicates

Voice-dictated, long, run-on paragraphs. Parse substance, ignore
filler. Common phrases that mean "execute":

- "Just do it, just do it"  → permission granted
- "Don't bitch about X"     → skip the disclaimer
- "Give it to me direct"    → no qualifiers
- "I'm not here for hours"  → make autonomous decisions

Common phrases that mean "stop":

- "Wait a little"            → pause, but stay ready
- "I haven't decided yet"    → don't push for approval
- "Let me think"             → no follow-up question this turn

When the founder asks how to do something operationally (Cloudflare,
Supabase, Vercel), they want CLICK-BY-CLICK with exact button names,
not abstract instructions. Look at the screenshot they share and
walk through it step by step.

## STEP 7 — Available tooling

Standard Claude Code tool set: Bash, Read, Write, Edit, Grep, Glob,
WebFetch, WebSearch, TodoWrite, ScheduleWakeup, etc.

Python 3.13 is on PATH. Node + npm + npx available. Git available.
DuckDB installed (used for streaming aggregation of large CSVs).
Supabase REST is reachable. The github.com/benetbani/marginatlas-web
remote is `origin` on the `main` branch of `E:\atlas\website`.

## STEP 8 — Confirm and stop

After reading the 6 files in STEP 0, send the confirmation message
described there. Do NOT start work. Wait for founder direction.

That's the bootstrap. Begin.
```

---

## Notes on this prompt

- ~250 lines of high-density context vs. the previous session's ~500K-token conversation history
- The new session reads 6 files (~2,500 lines total) and has full context in ~5 minutes
- The "Send back exactly one message" instruction prevents the new session from launching into work before the founder confirms it has loaded
- All operating rules are baked in — no need to re-tell the new session about no-aquamarine, no-okay, etc.
- The "what's broken / what's next" sections give the new session a clear sense of where to focus when the founder says "continue"

## How to use

1. Copy the prompt block above (between the triple backticks)
2. Open a fresh Claude Code session
3. Paste
4. Wait for the new session to send back its confirmation message
5. Continue work from there

The HANDOFF.md will keep accumulating context as work continues. Treat
it as the single source of truth — update it after each major batch
of changes so the next handoff is even easier.
