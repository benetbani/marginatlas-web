# Handoff, 2026-09-19: the plan ended, the site is live, the checkup is on file

Short on purpose; the zero-loss form with the decision trail, the dead ends, the reading order and a re-hydration prompt is `HANDOFF-marginatlas-2026-09-19-dossier.md` beside this file. The checkup of the same day (`E:/atlas/design/loop/build/CHECKUP-2026-09-19.md`) measured the reading tax at about 100,000 words before a first edit; this page is the whole mandatory read for the next session, and it points at the two files that are the state of record.

## Where everything is

- **Website** `E:/atlas/website`, branch `main`; `44877f5e` is pushed and the commits after it (this handoff and its dossier) are docs only, unpushed; production (`marginatlas.com`) serves it since 11:47 UTC (three deploys today: the first failed on three harness gates that stopped for want of a browser on a build server, fixed; the third fixed the how-to page's 404 status). The chain holds 155 gates and runs inside every Vercel build (`vercel.json` pins `npm run build`; the `prebuild` hook is the chain).
- **Parent** `E:/atlas`, branch `p4-seam`, HEAD `a9307fe`, no remote (a backup is owed, see below). The state of record is `design/loop/build/STATE.md` (its `step-in-flight` line says THE GOAL ENDED), `DEBUG.md` section 7 (every baseline and why), `QUEUE.md` (the `launch:*` rows are the next work).
- **The fifty-step plan** (`design/loop/build/plan-2026-09-17/`) is done to its own end clause: `npm run launch:check` printed the launch checklist, NOT READY: 2 reasons (five exemplar pages below their floor, all named; the chain not proven green on this machine because of memory). Every page type is on its spine: country 21 blocks, city 17 less ruling 30, trade 16, industry 12, hub and district pages 7, how-to 6.
- **Two test branches in the website**, unmerged and unpushed, from the day the `checkup` skill was written: `checkup-baseline` (gates spawned without npm's boot; per-icon phosphor imports) and `checkup-green` (the same imports measured cold, tsc 97 to 74 s; scratch folders out of the typecheck; `docs/checkup/2026-09-19.md`). Merge only after `npm run verify:deploy` is green on them.

## What the next session does first, in order

1. On a machine with 1,100 MB free (close the other sessions; the worktrees under `E:/atlas/.claude/worktrees` are 55 GB of stale copies, all zero commits ahead, and can go): `cd /e/atlas/website && npm run verify:deploy`, read `scratchpad/deploy/chain.txt`. The chain at HEAD has not run green end to end on this laptop today; it did on Vercel (161 s, 155 of 155).
2. Then the `launch:*` rows in QUEUE.md: the city's districts and trades blocks draw the blocked seat off London (S), the how-to page's locals seat off GB (S), then `npm run launch:check` again.
3. Nothing else starts before his three answers below are read.

## What he owes (asked, not answered)

1. **The sample marks.** The site is public and indexable with the marks off; "private" is one line in `.env.production` that no page reads. Set `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1` (the launch-day flip in `docs/DEPLOY-PACK-spine-flags.md`) or turn on deployment protection. The checkup's first action.
2. **Ruling 30 or the city's `10 easiest` seat** (London renders 16 of 17 on purpose until then).
3. **The candidate forms' clicks** (fact card with a focal, placement line, derived ratio, ring, donut; `E:/atlas/design/mockups/2026-09-16/index.html`); every seat awaiting them is drawn plain.
4. The checkup's owner decisions: the reading path and the commit form (DOCTRINE sections 1 and 8), the two-tier chain (the 2026-09-17 ruling on live renders per deploy), a remote or a cloud copy for the parent repo, memory for the laptop, and the 90 countries' option A (taken by the loop, reversible by his word).

## The day's rules and traps, for whoever runs next

- Every command carries its own `cd`; the working directory resets between calls.
- Never pipe a verification into a formatter; write it to a file and read the file.
- The Bash tool mangles long heredocs (single quotes, backslashes): write briefs and records through the Write tool (`scratchpad/record_*.py` was the pattern), forward slashes in paths.
- Git Bash rewrites `/gb` in an argument into a Windows path; `MSYS_NO_PATHCONV=1` in front of the command.
- A bare `curl` answers 403 on trade pages (the middleware's scraper rule); fetch with a browser user agent and `Accept-Language`.
- Never claim what production serves without fetching it; read a deploy's status through `gh api repos/<owner>/<repo>/deployments` and its log with `npx vercel inspect <id> --logs`.
- A gate written for the design machine meets a build server only on a push: every browser gate calls `requireBrowser` and skips loudly there.
- A closed `<details>` reports client rects for what it hides; three instruments counted hidden rows as ink until 2026-09-19.
- The preflight refuses the chain under 1,100 MB free; forcing it produces memory deaths, not reds.

## Skills that exist for this project

- `/checkup` (`C:/Users/benet/.claude/skills/checkup/`): the senior-architect audit protocol; its first run is the file named at the top.
- The loop's own doctrine, model and template live under `E:/atlas/design/loop/build/`; read them when a step needs them, not before.
