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
| 2026-05-27 | [2026-05-27-session-handoff.md](./2026-05-27-session-handoff.md) | Architecture audit + route-conflict outage fix + perf pass + security audit + 6/8 phases of design system v1 |
