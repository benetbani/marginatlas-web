# HANDOFF: marginatlas.com, releases on the build server (2026-10-16)

Production is `main` 0beeee9a (release 2, live 2026-10-16 shortly after midnight Tirane; release 1 19e4072a live 2026-10-15 22:05). Release 3
is in flight on the build server as two headless jobs. The laptop session is only the controller now: it writes briefs, reads
reports, rules, and pushes. This supersedes `HANDOFF-marginatlas-2026-10-15.md` (read that one only for history).

> **How to use this document.** Read it once, then the files in section 7 in order. Do not act until you can answer section 13.
> The re-hydration prompt is section 14.

## 1. TL;DR

Margin Atlas ("the reference atlas of small-business earnings", repo `E:\atlas\website`, GitHub `benetbani/marginatlas-web`,
public) shipped the four design fronts of 2026-10-12/13 in two releases: the quiet editorial homepage, the free cost simulator
(/calculator), every country page rebuilt from a slot model with the green-to-red signal, and the rhythm reform through Task 5
(air, 14px reader text, each fact once, bare 32px openers, no row tiles); plus data-honesty fixes (buy prices from each trade's own
sale range; typed start capitals off every live page). All heavy work now runs on a netcup server (<server-ip>) as headless Claude
Code jobs in tmux, because the laptop app restarted five times on 2026-10-15/16 and killed agents each time. **The single most
important thing:** the owner wants short plain answers (under 100 words) and his word per push to main/deploy. **Next action:**
when the two release 3 jobs end, tell the film session "atlas: ready for snapshot" (section 8 A), then review, merge, check and
photograph release 3 and ask his deploy word.

## 2. Mission & success criteria

Enduring goal (his words): a trustworthy reference site for small-business economics that "looks already established", phone
first, programmatic for any country, earning through Pro once he switches it on; "push forward with the project heavily,
efficiently"; "just move forward with the server work towards our goals" (2026-10-16). Launch day (his 2026-09-26 interview): one
day, early to mid November 2026, Pro on; its 13 switches are all his (`docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md`).
Done for a release: every gate green on the reference machine (the server) with browser gates, typecheck 0, next build and
postbuild 0, viewport photographs read by the controller and sent to him, his deploy word, deploy watched, production probed.

## 3. Current state

| Component | Status | Where |
|---|---|---|
| Production | LIVE release 2 | `origin/main` 0beeee9a |
| Release 3 job A `held-bill` | running (tmux `heldbill`) | server `/srv/atlas/wt-start`, branch held-bill; brief `/srv/atlas/held-bill-brief.md`; report `/srv/atlas/reports/held-bill.md` |
| Release 3 job B `rhythm-t6` | running (tmux `rhythmt6`) | server `/srv/atlas/wt-rhythm`, branch rhythm-t6; brief `/srv/atlas/rhythm-t6-brief.md`; report `/srv/atlas/reports/rhythm-t6.md` |
| Snapshot of the server | waiting on our two jobs | the film session asked; we promised "atlas: ready for snapshot" when both tmux sessions end, and no new jobs until then |
| Laptop main checkout | branch `integration` at 19e4072a, clean, BEHIND main | `E:\atlas\website` (do not commit here; the server is where work happens) |
| GitHub check workflow | DISABLED on his word (2026-10-16) | `gh workflow enable checks -R benetbani/marginatlas-web` restores it |
| Vercel previews | off for seven named branches (vercel.json `git.deploymentEnabled`) | new branch names are NOT covered: never push a work branch to GitHub; push only main (on his word) |
| Design repo E:\atlas | p4-seam, no remote; STATE.md and MODEL.md updated for release 2 (c172f41) | `E:\atlas\design\loop\build\STATE.md` |

## 4. Decision trail (2026-10-15/16)

1. Took over from the session that wrote the 2026-10-15 handoff; its two agents died with it. Owner: "Let them finish", then "go".
2. Merged the fronts on branch `integration` (home + simulator, then rhythm + country). Country final review fixed: the signal
   (narrow arrowhead), two lost figures, honesty marks, LEVEL HEIGHT law, alternating lone zones (controller ruling; his eye invited
   via photos, never answered).
3. Owner rulings: Q5 "Let them drop" (/cu, /lk, /mo, /nr, /to noindex); "Yes, stop them" (Vercel previews off); "Deploy now" x2;
   "Yes, switch it off" (GitHub checker).
4. Laptop restarts killed agents five times; the server became the reference machine and the agent host. The laptop's FIGURE FACE
   pass was false (Geist and Space Grotesk share tabular digit widths; the check now uses classic face detection).
5. The 124 US state trade pages "falling under the floor" was not a regression: production already noindexes them (P1-B); the
   indexnow pin moved to the measured set.
6. Typed figures removed: 153 SDE multiples and the 0.4 asset floor (release 1); typed start capitals and two typed tables, gate
   `start-side-held` (release 2). Left: the typed $426K UK restaurant bill and /opening's typed rent warning (release 3 job A).

## 5. Hard-won truths

- **The server is the only full checker.** Chain with `ATLAS_BROWSER_GATES=1 --concurrency=4`, real fonts, real database. 14 checks
  "defer" there: 7 home checks now run (input files copied), 4 `dispositions` need his Search Console inventory, 3 `cell-lattice`
  need data no machine has. Deferred is not passed: say so in every report.
- **Headless job pattern:** brief file in `/srv/atlas/*.md`; `tmux new -d -s <name> "cd <worktree> && claude -p '<read brief>'
  --dangerously-skip-permissions > /srv/atlas/runs/<name>.log 2>&1"`; fix rounds resume the same conversation with
  `claude --continue -p` in the same worktree; reviews run as `claude -p --model sonnet` with `/srv/atlas/review-brief.md`; a waiter
  on the laptop: `ssh ... 'while tmux has-session -t X; do sleep 60; done; tail log'` in the background.
- **Moving code:** the server has NO GitHub login. Laptop: `git fetch server <branch>` (remote `server` =
  ssh://atlas@<server-ip>/srv/atlas/website), then push main from the laptop on his word:
  `git push origin refs/remotes/server/<branch>:refs/heads/main` after checking it fast-forwards.
- **Deploy watch:** `MSYS_NO_PATHCONV=1 node scripts/deploy_watch.mjs --marker='<new string>' --url=<page> --minutes=40`, then probe
  with `curl --ssl-no-revoke` and a browser user agent.
- **Full-page screenshots lie** (a fixed background layer 1000px tall): photographs are viewport captures only.
- Agents writing `census.ts --write` touch the shared design copy unless given `--pages=<scratch copy>`.

## 6. Dead ends

| Tried | Why dead |
|---|---|
| Laptop as reference machine / agent host | app restarts kill agents; 600-800 MB free; false FIGURE FACE pass |
| GitHub Actions as checker | placeholder database: always "failure"; emailed him; disabled |
| `gh auth login` on the server | device code expired twice; abandoned: the laptop pushes |
| Pushing work branches to GitHub | starts Vercel previews (names not in the opt-out) and failure emails |
| The simulator's opening bill as the start cost | falls back to the same typed table off England (start-capitals investigation) |
| Vertical bars for /gb/london's market list | MODEL PART 9 item 20: six or more rows never stand as columns |

## 7. Files, in reading order

| # | Path | Role |
|---|---|---|
| 1 | this file | the snapshot |
| 2 | `E:\atlas\website\CLAUDE.md` | rules, working method, hard constraints |
| 3 | `E:\atlas\website\.superpowers\sdd\progress.md` (last ~80 lines) | the ledger: every ruling and result since the takeover |
| 4 | `C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md` (top entries) | his rulings; `project-2026-10-15-release1-deployed.md`, `feedback-2026-10-15-commit-as-you-go.md` |
| 5 | server `/srv/atlas/release1-brief.md` | the machine facts and standing rules every server brief points to |
| 6 | server `/srv/atlas/held-bill-brief.md`, `/srv/atlas/rhythm-t6-brief.md` | release 3's two jobs |
| 7 | `E:\atlas\website\.superpowers\sdd\integration\` | reports and reviews of every job (release1/2 server reports, investigations, contact sheets) |
| 8 | `E:\atlas\design\loop\build\QUEUE.md`, `STATE.md` | open rows (73 TODO, 22 his), state of record |

## 8. Open threads

**A. Release 3 (committed next step).** When both tmux jobs end: (1) send "atlas: ready for snapshot" to the film session (its
address from `ListAgents`, name "Tesseract IG/Shorts film factory handoff"), start no server job until it says the server is back;
(2) read both reports; review each job with `/srv/atlas/review-brief.md` (extend REVIEW_JOB to `held-bill` and `rhythm-t6`, paths as
in section 3); one fix round each; (3) merge both into a `release-3` branch from origin/main on the server, regenerate counts and the
census (scratch PAGES.md), whole chain + typecheck + build, viewport contact sheets; the release-3 job also commits this dossier (copied to the server as
`/srv/atlas/HANDOFF-marginatlas-2026-10-16.md`) into `docs/handoff/` and makes it the CURRENT entry of CLAUDE.md's "Latest handoff"
list (the list still names 2026-10-11 as current: stale); (4) controller reads the sheets, sends them,
asks his deploy word (AskUserQuestion, recommended first), pushes main, watches, probes; (5) records: ledger, STATE.md, memory.
Rhythm Task 7's parent-repo texts arrive in job B's report: apply them in `E:\atlas` (MODEL, DISTANCES, FOUNDER-VERDICTS: only his words).

**B. Launch prep (needs one batch of his decisions).** Pro switch-on and price page, Search Console exports (also unblocks
`dispositions`), the launch-switches list, the homepage's held items (band sentence, three reds on the first screen), the simulator's
Manchester barbershops default (-20.8% margin), API credits for agents (`/login` to his Console account).

**C. Quality rows seen on the photographs (small, batch them):** Cambodia's "Illustrative photo" stand-in looks Mediterranean;
London city page "No deposit figure for this city yet."; London restaurants /opening answers 200 "Nothing at this address" (a soft
404); 28 failure stories with semicolons on 14 unrendered industry pages (rewrites, data files); /calculator compact header ellipsis
at 375; the hire card's dollars beside pound rules; the calculator's moves bars as dots at 768.

**D. Someday:** the London trade picker (his next design goal, needs a short design session with him), the buyer layer (needs
downloads: his word), `E:\atlas` has no remote (back it up).

## 9. Guardrails and preferences

Replies under 100 words, plain, tell him what to click; AskUserQuestion with the recommendation first for his decisions; never ask
what the code can answer. His word per action for: push to main, deploy, purchases, downloads, Stripe/Supabase/Vercel/DNS settings,
migrations, emails, posts. Never print or copy .env values (he copies them). Never raise a ratchet baseline; never invent a figure;
replace, never cut; copy rules (four-word headings, twelve words a line, no semicolon, no em-dash, never "modelled", "withheld",
"on file", no agency names, no "we"). The film session shares the server: never touch sshd, ufw, fail2ban, swap or user films;
coordinate system-wide installs by message. Every brief says "commit as you go".

## 10. Environment

Server: Debian 13, 12 cores, 32 GB, `ssh -i ~/.ssh/id_ed25519 atlas@<server-ip>` (key-only; root by key only). Node 22 (NodeSource),
gh, Claude Code (logged in, his account), Playwright Chromium, Geist / Space Grotesk / Geist Mono in /usr/local/share/fonts/atlas.
Layout: `/srv/atlas/website` (reference clone; branches release-2 etc.), worktrees `/srv/atlas/wt-start`, `/srv/atlas/wt-rhythm`
(node_modules and `E:` are symlinks; each holds a copied `.env.local`), `/srv/atlas/design`, `/srv/atlas/rules`, archive and
macro/us/registers input files copied from the laptop, `/srv/atlas/runs` (logs), `/srv/atlas/reports`, `/srv/atlas/shots`.

## 11. Landmines

- The Claude app on the laptop restarts without warning: background waiters die; server jobs survive. Re-arm waiters after a restart.
- `cd` into a worktree switches this session's directory; use absolute paths (fix with `mcp__ccd_directory__change_directory`).
- `country-view.tsx` and `city-view.tsx` are git `-text` CRLF: byte-level edits only.
- A new branch name pushed to GitHub builds a Vercel preview.
- Python edits of design-repo files: keep `newline=''` writes; autocrlf is on (checked: only the edited lines change).

## 12. Glossary

reference machine: the server; release-N: a branch from main merging that round's jobs; the controller: this laptop session; a
job: one headless `claude -p` run with a brief; slot/stage: the country page's 17 sections in 7 journey stages; deferred check: a
gate that could not run (not a pass).

## 13. Successor verification checklist

1. What is live, at which commit, and what did releases 1 and 2 ship?
2. Where does work run, how do you start a job, and how does code reach GitHub?
3. What must happen, and in what order, when release 3's two jobs end (snapshot first)?
4. Which pushes are allowed without asking, and which need his word?
5. Why are 14 checks "deferred", and how do you report them?
6. Which three of his decisions does launch prep need first?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com (Margin Atlas): releases built on the build server
Working directory: E:\atlas\website
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-10-16.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   - E:\atlas\website\CLAUDE.md
   - E:\atlas\website\.superpowers\sdd\progress.md (last ~80 lines)
   - C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md (top entries) and the two 2026-10-15 files it marks NEWEST
   - on the server (ssh -i ~/.ssh/id_ed25519 atlas@<server-ip>): /srv/atlas/release1-brief.md, /srv/atlas/held-bill-brief.md,
     /srv/atlas/rhythm-t6-brief.md, and `tmux ls` plus the tails of /srv/atlas/reports/held-bill.md and rhythm-t6.md
3. Do not edit anything, run anything destructive, or make decisions until steps 1–2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5–10 lines: the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight.
5. Flag any contradiction or gap you find between the dossier and the actual files:
   the dossier is a point-in-time snapshot and git, the server and the reports are ground truth.
6. Then continue thread A (release 3) without waiting: it is pre-authorized up to the deploy
   question. Main, deploys and anything paid still need my word.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly: answer me in under 100 words.
```
