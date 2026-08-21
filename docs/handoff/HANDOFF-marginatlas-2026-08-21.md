# HANDOFF — marginatlas.com: the conceptual-error sweep, the glass, the fonts, and the screenshot unblock

**Status, 2026-08-21.** 86 commits unpushed on `main`. `npx tsc --noEmit` clean,
`npm run prebuild:serial` **105/105** (3 cell-lattice checks deferred by design,
which are NOT passes). Nothing deployed. The 20-minute loop is **stopped** (cron
`212a6560` cancelled). The live thread is a **founder-directed hunt for conceptual
errors**: figures and labels that look like information and carry none. Three
parallel audits found the class everywhere; eight instances are fixed and a
longer list is open and named.

> **How to use this document.** Read top to bottom once. Then read the files in
> §7 in the given order. Do not start work until you can answer §13. A
> ready-to-paste re-hydration prompt is §14.

---

## 1. TL;DR

marginatlas.com is a global atlas of what a small business earns in a place and
what its owner actually keeps. This session did four things: **promoted the
frosted glass** the founder picked from three rendered variants; **unblocked the
screenshot path** that had made every visual claim unverifiable for twenty ticks;
**ported the site to its own ratified typefaces**; and then, after a sharp
founder rejection, ran **three parallel audits for one class of defect** and
began fixing it.

**The single most important thing to know:** the founder's central complaint is
not styling. It is that the site prints things that *look like data and are not*
— a badge that can only ever say one word, a five-dot rating wired to a constant,
a range built by multiplying the median and labelled "Bottom 10%", a national
population called "your market". He called it *"like someone had a lobotomy"*.
The audits confirmed him at scale. **Fixing this class is the work.**

**Recommended next action:** take the next item from §8's ranked list. The
highest-value is the structured data sent to search engines, which still
publishes fabricated percentiles as measured values.

---

## 2. Mission & success criteria

**Enduring goal**, the founder's framing: a homepage he wakes up to and thinks is
perfect, with the same design carried across every page type.

**Current tactic**, his words on 2026-08-21: *"try to catch these conceptual
errors, these idiotic errors in the whole site, and how they can be corrected.
That's very, very important."*

**His four complaints from that message, verbatim in substance:**

1. *"Saying that coffee in London is in a market of 69.7 million people is
   completely out of touch… the section should have a brain behind them. You are
   just slapping numbers with no regards whatsoever."*
2. *"On the desktop, some icons and sections are very wide for the eye, so the eye
   has to do like an angle to read all of it."*
3. *"In mobile the look is always stacked with one card after another where there
   is a good opportunity that we can put two cards in the same row."*
4. *"A lot of sections are unreadable and unskimmable… too much text, too little
   graphics, and they don't help each other at all."*

**And a fifth, the next day:** *"you are just slapping an Easy on all of them,
which makes the whole thing disgusting… those cards have no character whatsoever,
they are just blank fields."*

**A standing instruction, given twice and worth obeying:** *"you should not talk
to me like I have the code base in my mind. I don't have."* **Report about the
SITE — what a visitor sees — never about files, functions or line numbers.** A
report written in code is a report he cannot read, and he has said so twice.

**Hard constraints:** terracotta plus cool neutrals, ONE accent, no green, no
amber, no brown, no cream. Tokens only, no raw hex/px/ms in components. No
em-dashes in user-visible copy. No source-agency names. No URL slug renames.
Never fabricate a figure. Never raise a ratchet baseline. **Never push.**

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| Branch / commits | `main`, **86 unpushed** | clean fast-forward available |
| `npx tsc --noEmit` | clean | verified at HEAD |
| `npm run prebuild:serial` | **105 / 105**, exit 0 | 3 cell-lattice checks **deferred**, not passed |
| Working tree | clean apart from 3 knowns | `.mcp.json` (never commit), `scratchpad/`, `.agents/` + `skills-lock.json` |
| The 20-minute loop | **STOPPED** | cron `212a6560` cancelled 2026-08-21 |
| Frosted glass | **SHIPPED** | variant B, `.80` + `blur(20px)`, all six page types, 0 leaks |
| Screenshot path | **UNBLOCKED** | Playwright MCP works; the Browser pane never will |
| Typefaces | **PORTED** | Geist + Space Grotesk site-wide, 326 / 67 elements |
| Conceptual-error sweep | 3 audits done, **8 fixed, ~12 open** | §8 has the ranked list |
| Readiness ledger | **3 / 30 criteria MET** | `docs/loop/11-PRODUCTION-READINESS.md` |
| Deployment | not deployed | production is far behind, and that is expected |

**Believed but NOT proven.** Whether the prebuild gates run on a Vercel deploy at
all. There is no `vercel.json`, so the build command is a dashboard setting. Open
as a founder question.

**Parallel chain runs are unreliable on this machine.** Three consecutive runs
failed 9, then 1, then 10 gates, a different set each time, every gate passing
alone. The variable is memory: measured **1,247 MB free with 9 node processes
alive**. Kill strays and re-run; `prebuild:serial` is the honest verdict.

---

## 4. How we got here — the decision trail

**The glass came first.** A prior session had established that the site already
contained a complete frosted-glass language, switched off, and that `--card` at
`.955` made the photograph contribute **1.44% of its own signal** — 3.7 levels out
of 255. Rendering the homepage and measuring in a browser confirmed **0 of 1,581
elements carried a `backdrop-filter`**. Three variants were built by runtime CSS
injection on his own homepage and shown as images. He picked **B** ("perfect-wowww"):
cards at `.80` with a real blur, background untouched.

**The screenshot unblock was the enabler.** For twenty ticks no picture of the
site existed. The recorded cause was "the Browser pane will not composite". That
was diagnosed rather than endured: the pane fails **deterministically** and its
error names the cause. The Playwright MCP has no such dependency and worked first
try. `docs/verification-protocol.md` had named it as the sanctioned instrument all
along; nobody had established the pane was the broken half.

**The fonts followed from his own rulebook.** He looked at Dribbble reference
cards and said *"that's the kind of font that we should use on the site"* — and
that is his own standing verdict, *"Geist + Space Grotesk"*, which reached exactly
**one** reader-facing component while the site chrome ran a serif plus Inter.

**Then he rejected the pace and the substance.** *"You are executing things that
are totally… don't make sense. Like someone had a lobotomy."* The specific trigger
was a screenshot **I had looked at and shipped anyway**: eight cards on a country
page all badged "Easy". That badge is a tautology by construction — the section
selects the eight *easiest* businesses and then prints each one's difficulty band.

**That reframed the work.** He asked for agents. Three parallel audits ran against
the homepage/country, cell/industry, and city/cross-site surfaces, hunting one
class. They came back with counts, and the class is everywhere.

---

## 5. Hard-won truths & mental model

**The defect class, named.** *Something that looks like information and carries
none.* Its shapes, all confirmed present:

- a badge or band word identical on every row, or **made identical by the
  section's own selection logic**;
- a rating scale drawn and pinned to a constant;
- a number with nothing to compare it against;
- an invented figure presented as a measurement;
- copy claiming a scope the figure does not have;
- a frame rendered around a value that never arrives;
- an affordance that cannot be used;
- a hardcoded string dressed as provenance;
- helper text describing what the interface already is.

**A rem cap is a width, not a measure.** `max-w-2xl` is a fixed 672px, which is
~97 characters at 11.5px type. Paragraphs that already *looked* capped were the
widest on the page. Cap prose in `ch`, and cap it at the section so a new
paragraph inherits the rule.

**`sm:` is 640px and phones are 375–430.** A two-column layout gated at `sm:`
exists and no phone ever reaches it.

**Two-up must not be bought with truncation.** The first attempt shortened cards
by 29% and turned every name into "Softw…", "Legal …", "Docto…". Let names wrap
and move the badge beneath.

**A figure set at 4rem is a claim of importance** whatever the words beside it
say. Relabelling a number while leaving it huge keeps the same lie in a quieter
font.

**Self-omission is the sanctioned answer** to a figure the site does not hold.
Prefer deleting a false signal to decorating it.

**Green is evidence a gate ran, not that the site is correct.** Several gates in
this chain have been measured lying.

**A measurement that reads empty is an instrument failure far more often than a
finding.** A font check read `--sans` as the empty string and was about to be
reported as "this page ships with no fonts"; the fixture had no stylesheet.

---

## 6. Dead ends — do NOT retry

1. **The Browser pane for screenshots.** Fails deterministically; a hidden pane
   composites no frames. `tabs_select` fronts a TAB inside the pane, not the pane.
   Displaying it is a host-app action only the founder can take. Use Playwright.
2. **Liquid Glass.** Cannot be reproduced on the web; ruled out by name.
3. **`prefers-reduced-transparency` as the accessibility answer.** Safari has never
   supported it through v27; Firefox has it off by default. The default must be
   safe alone; use the `@supports` branch.
4. **Putting the glass alpha on `--atlas-surface-card`.** The engraved family reads
   that token for **chart marks**, so it made bar fills see-through. The alpha
   belongs in the `.atlas-card` rule.
5. **Mounting `SubTypeSwitcher`.** It writes to a query param; the site gives every
   sub-type its own URL and slug renames are banned. Mounting it would collapse
   indexed pages into one.
6. **Printing the blog author.** All 70 posts carry the identical value.
7. **`city_rent_multipliers.ts` for a rent comparison.** Values are relative to each
   country's own baseline, so 1.3 in Poland and 1.3 in the US are different rents.
8. **A five-year population ticker.** No population series exists at any geography;
   the file is 266 rows and every row is `year=2024`.
9. **Deleting a mounted gauge.** That deletes a section, and section membership is
   a gated contract.
10. **Shell-quoted `node -e` for anything with a regex.** Cost three times in three
    ticks; one `\b` became a literal backspace character inside a markdown file.
11. **`git stash` / `checkout .` / `reset --hard`.** All tree-wide.

---

## 7. Critical files & artifacts — the map and reading order

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md` | **THE authority.** His own quoted rulings, the screenshot recipe, the paint rule | READ FIRST, IN FULL |
| 2 | `E:\atlas\rules\DESIGN-RULEBOOK.md` | **Rule 0: "The founder designs. The AI ports. The AI never invents visuals."** | Essential |
| 3 | `E:\atlas\rules\FORM-CATALOG.md` | The legal visual vocabulary. A form not in here needs 3 steps and one click | Essential |
| 4 | `E:\atlas\rules\FOUNDER-VERDICTS.md` | 90-entry corpus of his documented reactions | Essential |
| 5 | `docs/adr/0001-figures-carry-no-visible-origin-mark.md` | The no-marks ruling, and that **an invented Band SHOULD be marked** | Essential |
| 6 | `CONTEXT.md` | Domain language: Figure, Origin, Band, Regime, self-omission | Essential |
| 7 | `scripts/shoot.mjs` | **The screenshot instrument.** Its header is the whole recipe | **High** |
| 8 | `docs/loop/11-PRODUCTION-READINESS.md` | 30 criteria, each a number that moves one way | High |
| 9 | `docs/superpowers/plans/2026-08-19-masterplan/01-DESIGN-STANDARD.md` | The 25 ranked rules; rule 1 and rule 4 govern this work | High |
| 10 | `docs/superpowers/plans/2026-08-19-masterplan/05-ERROR-LEDGER.md` | Traps already paid for, incl. C9/C10/C11 added this session | High |
| 11 | `docs/loop/artifacts/*.jpeg` | 15 rendered shots: the glass A/B/C, the fonts, the mobile fix | Reference |
| 12 | `docs/loop/DECISIONS-NEEDED.md` | 10 open founder questions | Reference |
| 13 | `CLAUDE.md` | Working method, hard constraints, the generated counts block | Reference |

---

## 8. Open threads & next steps

### The conceptual-error backlog, ranked. All three audits confirmed these with counts.

| # | What a visitor sees | Why it carries nothing | Verify by |
|---|---|---|---|
| 1 | Search engines receive `"Bottom 10% ~ 108,292 USD; top 10% ~ 1,472,773 USD"` under a key named **"Measured"** | Those are 0.25x and 3.4x the typical — the fabricated constants. Syndicated as measurement | render a cell page, read the structured-data block |
| 2 | The homepage world map, all ~195 countries one colour | It has the shape of a choropleth and its colour encodes nothing; the site knows 94 of 195 have pages | count distinct fills |
| 3 | Two cell sections + two city sections: a heading and "Not held yet", on every page | **No data path exists** for any of them. 502 dead nav entries on the city side | grep for a producer; there is none |
| 4 | Country page: a numbered stepper with **one** step, then "Total time 1 day / Total cost $0" | A sum over one item restates the row above it | render `/gb`, `/de` |
| 5 | Country page: 2 of 4 "ground under you" factors read **"Workable"** for every country on earth | Both are a hardcoded `0.5` | render 3 countries |
| 6 | Cell pages: "The same business nearby" shows 4 cities | All four are the revenue x 0.7 / 0.82 / 0.68 / 0.78, same multipliers for a restaurant and a dental practice, no caveat | arithmetic against the render |
| 7 | Cell pages: "Pay by role" under "local pay" | 4 hardcoded wage tables picked by keyword on the slug. Every café, bar, bakery and restaurant prints identical chef/server/porter pay | read the four arrays |
| 8 | Cell pages: a risk card whose severity chip reads "rare" | It is a literal. **20 of 20 trades.** A chip that can never say anything else | count across trades |
| 9 | Cell pages: a risk note asserting the trade "leans on the warmer months" | Printed verbatim on accounting (peaks in January) and dental (seasonality "Low"), contradicting the seasonality section three cards up | render two trades |
| 10 | Industry pages: "What a typical operator looks like" | 4 of 5 tiles restate figures printed 400px above | render `/industries/restaurants` |
| 11 | Industry pages: one net margin printed as **7%, $6, and 6.5%** on one page | A reader sees the owner's share change twice | render and count |
| 12 | City pages: the last line of the page is the first line, word for word, on **252 pages**; on 227 of them that sentence is a coverage disclaimer | The close is the open | diff the masthead against the sign-off |
| 13 | City pages: a visitor/resident bar | **155 of 246 cities land exactly on the clamp floor or ceiling** — the bar draws a bound, not a reading | count distinct values |
| 14 | City pages: a district "Character" multiplier printed to two decimals | Reads **1.00x on 1,216 of 1,266 districts** — precision saying "no effect" 96% of the time | count |
| 15 | Country pages: break-in scores identical across countries | The page passes the **country name** where a city slug is expected, so cost-of-living and density resolve to nothing. Heading now neutral, **the input is still wrong** | render 2 countries |

### Blocked on the founder

- **Two SQL migrations**, written, idempotent, never applied. `newsletter_signups`
  and `corrections` do not exist, so every signup and reader correction is
  silently discarded while the form reports success. `db/migrations/2026-08-16-*.sql`.
  **This is live and losing data.**
- **Two candidate forms await one click**: commercial rent across a country's
  cities (8 UK cities, London $1,050 to Leeds $320) and country inflation
  (19 real yearly points, 2006–2024). Built with real data, mounted nowhere.
  Shots in `docs/loop/artifacts/CANDIDATE*.jpeg`.
- **10 questions** in `docs/loop/DECISIONS-NEEDED.md`, including the type floor.

### Optional / someday

- Twelve gauge implementations in five sweep geometries remain (two retired).
  Three are mounted and permanently fed `notHeld()`.
- 17 horizontal-bar implementations, 19 stat strips (5 are copies of one block),
  14 city cards, 13 switches. The problem is multiplicity, not quality.

---

## 9. Constraints, guardrails & operator preferences

- **Never push.** He pushes. This has held for 86 commits.
- **Never deploy**, never run `npm run build`, never touch Vercel.
- **Never raise a ratchet baseline.** The cream ratchet caught a `#ffffff` added
  this session and was right; the baseline was not touched.
- **Never fabricate a figure.** Self-omission is always the sanctioned answer.
- **Never touch the homepage H1.** Settled and locked.
- **Report about the SITE, not the code.** Stated twice. No file paths, no
  function names, no line numbers in anything he reads.
- **He wants to SEE things.** Images and standalone pages, not a dev server.
- **Boldness over caution:** nobody visits the site yet. The risk is a mediocre
  product, not a regression.
- **He works by voice, in bursts, often one word.** When he says he does not know,
  give concrete options with consequences attached, not open design questions.
- `.mcp.json` is intentionally dirty. Never commit it.

---

## 10. Environment & reproduction

Working directory `E:\atlas\website` — its own git repo on `main`, remote
`github.com/benetbani/marginatlas-web`. The parent `E:\atlas\` is the data
pipeline, on `p4-seam`, no remote. Next.js 15.5, React 19.2, TypeScript 5,
Tailwind 3.4, Supabase (eu-west-1), Vercel.

```bash
cd /e/atlas/website
npx tsc --noEmit
npm run prebuild:serial        # parallel is unreliable here; see §3
node scripts/loop_status.mjs   # whole orientation, one process
```

**To see a page** (no dev server):

```bash
node scripts/shoot.mjs <outdir> <port>     # homepage: render, compile, serve
```

For any other route, render it directly, then compile the stylesheet **after**,
then append `src/styles/atlas-spine.css`, then serve:

```bash
npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
  scripts/spikes/render_home_to_scratch.tsx <outdir> "<route module>" '<json params>'
npx tailwindcss -i src/app/globals.css -o <outdir>/site.css --minify
```

Route modules that work: `page` · `[country]/page` `{"country":"gb"}` ·
`[country]/[geo]/page` `{"country":"us","geo":"california"}` ·
`[country]/[geo]/[industry]/page` `{"country":"gb","geo":"london","industry":"restaurants"}` ·
`(site)/industries/[industry]/page` `{"industry":"restaurants"}` ·
`(site)/cities/[slug]/page` `{"slug":"london"}`.

Then drive it with the **Playwright MCP**: `browser_resize`, `browser_navigate`,
`browser_evaluate`, `browser_take_screenshot` with `type: "jpeg"`.

---

## 11. Landmines & gotchas

- **The Bash CWD resets to `E:\atlas`.** Prefix every command with `cd /e/atlas/website`.
- **Screenshots land in `E:\atlas`**, the PARENT repo, not where you asked.
- **Reload after every resize**, or the height you measure is fiction.
- **Playwright blanks the page** on a long `browser_evaluate` after a resize. Keep
  evaluates short; navigate again if the URL reads `about:blank`.
- **Compile the stylesheet AFTER writing the file.** Tailwind emits only classes it
  can see.
- **`globals.css` does not import `atlas-spine.css`.** The harness appends it; a
  fixture without it has zero `.av2` rules and every spine measurement is wrong.
- **The render fixture hardcodes the fonts** `next/font` would supply. It was
  updated to Geist + Space Grotesk; if the faces change again, change it too or the
  screenshot shows the old typography.
- **`ch` in CSS is the width of "0"**, not `fontSize x 0.5`. Measuring with the
  wrong unit overstates by about a third.
- **A JSX comment cannot be a sibling of the returned element** — it gives the
  return two children. Put it above the `return`.
- **Do not write `*/}` inside a block comment.** It closes the comment and breaks
  the file. Cost once, in a note about comment parsing.
- **Use the Write/Edit tools for anything with a regex.** Shell-quoted `node -e`
  ate backslashes three times.
- **`prefers-reduced-transparency` and the a11y report**: the report is now
  deterministic (no timestamp), so a diff on it means a finding actually moved.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Cell** | country x geography x industry x sub-industry. The flagship page type |
| **Take-home** | what the owner keeps after costs and tax. Resolved by a FLOOR, not an equality |
| **Figure** | one published number with its unit and period |
| **Origin** | where a Figure came from, per figure, never per cell |
| **Band** | the spread of a Figure across firms, p10 to p90 |
| **Regime** | which rule produced a Band. Nine code paths produce one and they disagree by ~15x |
| **Self-omission** | rendering nothing rather than a placeholder. Ratified; never soften it |
| **The frame** | `AtlasFrame`, the fixed full-screen photograph. Anything `position: static` is not drawn |
| **The workshop** | `/dev` and `_design`. `_design` is a Next private folder and has NO URL |
| **Gate / ratchet** | one check in the prebuild chain / a baseline that may only shrink |
| **Tautology** | a label made constant by its own section's selection logic |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. What is the defect class the founder is asking you to hunt, and what are three
   of its shapes?
2. Why did eight cards all read "Easy", and why was showing the score only half a
   fix?
3. Why can the Browser pane never take a screenshot here, and what works instead?
4. Where does the glass alpha live, and why is it NOT on the card surface token?
5. What is wrong with `max-w-2xl` on a paragraph, and what replaces it?
6. Which two things are losing data or awaiting a click from the founder right now?
7. Name three dead ends from §6 and why each was ruled out.
8. What must you never do with the 86 commits, and how must you write your report
   to him?

---

## 14. Re-hydration prompt

    You are resuming an in-progress effort. Another session prepared a complete handoff
    so you can continue with zero context loss. Do NOT start work yet.

    Project: marginatlas.com — the conceptual-error sweep
    Working directory: E:\atlas\website
    Handoff dossier (read this FIRST, in full):
      E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-21.md

    Follow these steps exactly:
    1. Read the dossier at the path above, top to bottom.
    2. Then read these files, in this order (the dossier explains why each matters):
       - docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md (IN FULL)
       - E:\atlas\rules\DESIGN-RULEBOOK.md  (Rule 0 governs everything)
       - E:\atlas\rules\FORM-CATALOG.md
       - docs/adr/0001-figures-carry-no-visible-origin-mark.md
       - CONTEXT.md
       - scripts/shoot.mjs  (read its header in full: it is the screenshot recipe)
       - docs/loop/11-PRODUCTION-READINESS.md
       - docs/superpowers/plans/2026-08-19-masterplan/01-DESIGN-STANDARD.md
    3. Do not edit anything, run anything destructive, or make decisions until
       steps 1 and 2 are done.
    4. Then prove you are oriented: answer the "Successor verification checklist"
       in section 13 of the dossier in 5-10 lines. Keep it tight; this is a
       checkpoint, not an essay.
    5. Flag any contradiction or gap between the dossier and the actual files. The
       dossier is a point-in-time snapshot; the code is ground truth.
    6. Then stop and wait for my go.

    Honor the operator preferences and guardrails in the dossier as if they were
    given to you directly. Above all: NEVER push, never raise a ratchet baseline,
    never fabricate a figure, never touch the homepage H1, and NEVER write your
    report to me in code — no file paths, no function names, no line numbers. I do
    not have the codebase in my head. Tell me what a visitor sees.
