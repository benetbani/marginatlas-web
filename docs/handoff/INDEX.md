# Session Handoffs

Each entry is a self-contained snapshot of where the codebase stood at
the end of a long working session, with explicit pickup instructions
for the next conversation. The pattern exists because long Claude
sessions accumulate context that doesn't survive a new conversation —
this folder is where the durable knowledge lands.

## Conventions

- Filename: `YYYY-MM-DD-session-handoff.md`
- Always include: what shipped, what's pending, manual actions, the
  starter prompt for the next conversation, and known gotchas
- Each handoff supersedes the previous one only for items it touches;
  older handoffs remain authoritative for anything they covered

## Entries

| Date | Handoff | Focus |
|---|---|---|
| 2026-06-16 | [2026-06-16-session-handoff.md](./2026-06-16-session-handoff.md) | **CURRENT.** The design reformation + the PIVOT: founder designs each page, AI ports it 1:1, never invents visuals (a week of AI-invented slop rejected). The Brand Design Constitution + 25-phase plan (`docs/superpowers/plans/2026-06-16-reformation/`), the Foundation (F1-F5) built + committed, the P1 prototype rejected. Every file's role explained; paste-in bootstrap prompt in section 8. |
| 2026-06-14 | [2026-06-14-session-handoff.md](./2026-06-14-session-handoff.md) | R6.5 live + the engraved-almanac cohesion direction held on the branch (superseded by 2026-06-16) |
| 2026-06-02 | [2026-06-02-session-handoff.md](./2026-06-02-session-handoff.md) | THE BIG ONE: full repo map (both repos, every folder) + intensive read-everything bootstrap prompt. Deep-research data pipeline (19 drops loaded), Sentry free-tier, visual reform (Atlas Score killed, longform blog, gated free/paid design), Supabase NANO outage + index recovery, production deploy |
| 2026-05-31 | [2026-05-31-error-hunt.md](./2026-05-31-error-hunt.md) | Plausible-error hunt + reachability fixes |
| 2026-05-27 | [2026-05-27-session-handoff.md](./2026-05-27-session-handoff.md) | Architecture audit + route-conflict outage fix + perf pass + security audit + 6/8 phases of design system v1 |
