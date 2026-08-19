# How serious codebases stop documentation from rotting

Research capture for `docs/loop/02-ORGANISATION-RESEARCH.md` step 3.
All pages read **2026-08-19** in one session. Every URL in section 1 was fetched
in that session; three fetches failed and are listed as unread in section 4,
not summarised.

The defect this serves: one quantity, the prebuild gate count, is stated at four
different values in four documents. The question is not "how do we write better
documents" but "what structure makes that arithmetically impossible".

---

## 1. Sources, and the one thing each actually recommends

| # | Source | URL | Read | The recommendation, in its own terms |
|---|---|---|---|---|
| 1 | Nygard, *Documenting Architecture Decisions* (2011-11-15) | https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions | 2026-08-19 | Keep decision records in the repo at `doc/arch/adr-NNN.md`, "numbered sequentially and monotonically", numbers never reused. When a decision is reversed, "keep the old one around, but mark it as superseded". The record is never edited away. |
| 2 | MADR (Markdown ADR template) | https://adr.github.io/madr/ | 2026-08-19 | Filename `NNNN-title-with-dashes.md`. Optional YAML front matter carrying `status`, `date`, `decision-makers`, `consulted`, `informed`. Status is an enumeration: proposed, rejected, accepted, deprecated, or `superseded by ADR-0123`. Supersession is a pointer to a number, not prose. |
| 3 | adr-tools (npryce) | https://raw.githubusercontent.com/npryce/adr-tools/master/README.md | 2026-08-19 | Make supersession an **operation, not a convention**. `adr new -s <n> "title"` writes the new record AND rewrites the old record's status so it says it is superseded by the new one. Default directory `doc/adr`. |
| 4 | adr.github.io (index) | https://adr.github.io/ | 2026-08-19 | Read but thin: it defines ADRs and defers all conventions to `/adr-templates/`, `/adr-tooling/`, `/ad-practices/`. Its own recommendation is to adopt an existing template rather than invent one; it names the Y-statement format from Zdun et al. |
| 5 | Rust RFCs README | https://raw.githubusercontent.com/rust-lang/rfcs/master/README.md | 2026-08-19 | RFC text at `text/NNNN-my-feature.md`, the number taken from the PR issue number. "In general, once accepted, RFCs should not be substantially changed." A substantial change is a **new RFC, with a note added to the original**. Also candid that a merged RFC may not reflect the final implementation. |
| 6 | Kubernetes KEP process README | https://raw.githubusercontent.com/kubernetes/enhancements/master/keps/README.md | 2026-08-19 | KEPs live in SIG subdirectories, prefixed with their tracking issue number, so the breadcrumb "where is the current state of this" is mechanical rather than remembered. Notably lists "presubmit checks for KEPs around metadata format and markdown validity" as a **wanted** improvement. |
| 7 | Kubernetes `kep.yaml` template | https://raw.githubusercontent.com/kubernetes/enhancements/master/keps/NNNN-kep-template/kep.yaml | 2026-08-19 | Put status in a machine-readable sidecar, not in the prose. Required fields: `title`, `kep-number`, `authors`, `owning-sig`, `status` (provisional/implementable/implemented/deferred/rejected/withdrawn/replaced), `creation-date`, `stage` (alpha/beta/stable), `latest-milestone`. Optional: `replaces`, `see-also`, `milestone`, `feature-gates`. |
| 8 | Diataxis, home + compass + tutorials-vs-how-to | https://diataxis.fr/ , https://diataxis.fr/compass/ , https://diataxis.fr/tutorials-how-to/ | 2026-08-19 | Decide each document's single type with a two-question compass: does it inform **action or cognition**, and does it serve **acquisition or application** of skill. Action plus acquisition = tutorial, action plus application = how-to, cognition plus application = reference, cognition plus acquisition = explanation. "the single most common conflation" is tutorial with how-to guide, and a document that tries to teach while also guiding a real procedure is, in its clinical analogy, a deadly one. |
| 9 | Write the Docs, *Docs as Code* | https://www.writethedocs.org/guide/docs-as-code/ | 2026-08-19 | Run docs on the code toolchain: issue tracker, version control, plain-text markup, code review, automated tests. The concrete lever it names: "You can block merging of new features if they don't include documentation". |
| 10 | Google docguide, *Best Practices* | https://google.github.io/styleguide/docguide/best_practices.html | 2026-08-19 | "Change your documentation in the same CL as the code change." Plus: "A small set of fresh and accurate docs is better than a large assembly of 'documentation' in various states of disrepair", "Delete dead documentation", and under *Duplication is evil*, link to the canonical guide rather than writing your own. |
| 11 | Google docguide, *READMEs* | https://google.github.io/styleguide/docguide/READMEs.html | 2026-08-19 | A README is "a short summary of the contents of a directory". It belongs in the top-level directory of the actual codebase and "must not be located inside your product or library's documentation directory". It **links** to the documentation rather than reproducing it. |
| 12 | GitLab, documentation development | https://docs.gitlab.com/development/documentation/ | 2026-08-19 | Declares the documentation "the single source of truth (SSoT) for information about how to configure, use, and troubleshoot" the product. One authority per topic, stated as policy. |
| 13 | GitLab, docs page metadata | https://docs.gitlab.com/development/documentation/metadata/ | 2026-08-19 | Every page carries required front matter: `stage`, `group`, `info`, `title`. Ownership is then **derived**: a Rake task reads the `group` metadata and populates `CODEOWNERS` from it. Pages with an unrecognised group are treated as unassigned. |
| 14 | Keep a Changelog 1.1.0 | https://keepachangelog.com/en/1.1.0/ | 2026-08-19 | One file, "Call it `CHANGELOG.md`". Pending work sits in a single `Unreleased` section at the top and moves down into a version at release. "Don't let your friends dump git logs into changelogs", because a commit log is "full of noise". Changelogs are "for humans, not machines". |
| 15 | GitHub, setting contribution guidelines | https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors | 2026-08-19 | `CONTRIBUTING.md` is discovered from exactly three locations, `.github/` then repository root then `docs/`, first found wins. GitHub then surfaces it automatically at pull-request and issue time and as a Contributing tab. Location is decided by the platform, not by the reader. |
| 16 | GitHub, about code owners | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners | 2026-08-19 | `CODEOWNERS` in `.github/`, root, or `docs/`, first found wins. Owners "are automatically requested for review when someone opens a pull request that modifies code that they own", and owner approval can be made mandatory. Patterns may target documentation paths (`/docs/ @doctocat`). |
| 17 | lychee link checker | https://raw.githubusercontent.com/lycheeverse/lychee/master/README.md | 2026-08-19 | Check every hyperlink in the docs as a build step. Scans `md, markdown, mdx, html, htm, css, txt, xml` and others by default; **exit code 2** means at least one non-excluded link failed, which fails CI. Action: `lycheeverse/lychee-action`. |
| 18 | Vale prose linter | https://docs.vale.sh/ (301 from https://vale.sh/docs/) | 2026-08-19 | Bring "code-like linting to prose". Rules are YAML files in a style, with extension points such as `substitution`, a message and a severity. Rules set to `error` severity "will cause CI builds to fail". It enforces a chosen guideline, explicitly not general correctness. |
| 19 | cog (Ned Batchelder) | https://cog.readthedocs.io/en/latest/ and https://cog.readthedocs.io/en/latest/running.html | 2026-08-19 | Put the generator **inside** the file. Code between `[[[cog` and `]]]`, its output between `]]]` and `[[[end]]]`. `--check` = "Check that the files would not change if run again". `--diff` shows what failed the check. `--check-fail-msg MSG` tells the developer how to regenerate. `-r` rewrites in place. |
| 20 | HashiCorp tfplugindocs | https://raw.githubusercontent.com/hashicorp/terraform-plugin-docs/main/README.md | 2026-08-19 | Generate reference documentation from the machine's own description of itself. `generate` exports schema information from the provider and "sync[s] the schema with the reference documents"; `validate` checks the docs against the registry's guidelines. Subcommands: `migrate`, `validate`, `generate`. |

Twenty pages, seventeen distinct projects. Failures in section 4.

---

## 2. The four questions

### 2.1 Where does a RULE live, so that a rule exists exactly once?

**Answer: one file per topic, named for the topic, placed where the platform or
the reader will look for it without being told, and referenced from everywhere
else by link. Every other mention is a link, or it is a duplicate.**

| Support | What it contributes |
|---|---|
| Google docguide best practices (10) | The prohibition. *Duplication is evil*: link to the canonical guide, do not write your own. |
| Google docguide READMEs (11) | The placement. The summary file belongs with the code it summarises, not inside the docs tree, and it links outward. |
| GitLab (12) | The declaration. One body is named SSoT for a topic, so "which is authoritative" is answered once, globally. |
| GitHub CONTRIBUTING (15) and CODEOWNERS (16) | The mechanisation. For the two rule documents the platform knows about, the search path is fixed and first-found-wins, so a stale second copy is inert rather than competing. |
| Diataxis (8) | The discriminator. A rule page is a *reference* or a *how-to*; deciding its single type with the compass stops it silently absorbing explanation and history, which is how one file becomes four. |

**Where the sources disagree.** Google says the summary file lives with the code
and explicitly not in the documentation directory. Diataxis organises by user
need, which at scale pulls documents into a type-first hierarchy away from the
code they describe. These reconcile only if the near-the-code file is a pure
index. That is exactly the split this repo already half-has: `CLAUDE.md` is a
Google-shaped README that has drifted into stating rules and counts, while
`docs/design-system/GUIDELINES.md` is a Diataxis-shaped reference. The rule that
resolves it: **the root file may name authorities and must not restate them.**

### 2.2 Where does a RECORD live, so that history is legible and never mistaken for a rule?

**Answer: a numbered append-only directory, one file per decision, numbers never
reused, and the record immutable except for a single status line whose only job
is to say whether it still binds.**

| Support | What it contributes |
|---|---|
| Nygard (1) | Keep the reversed decision, mark it superseded. Do not delete, do not edit the reasoning. |
| Rust RFCs (5) | Once accepted, do not substantially change. A substantial change is a new record plus a note on the original. |
| MADR (2) | The status field is the mutable part, and it carries a pointer: `superseded by ADR-0123`. |
| adr-tools (3) | The pointer is written by a command that touches both files, so the back-reference cannot be forgotten. |
| Keep a Changelog (14) | Records are grouped under the version that shipped them, written for humans, and are not a git log. |

The convergent finding, across five sources that do not cite each other: **a
record has exactly one mutable field.** A reader landing on a superseded record
meets the pointer before the prose. That single convention is the whole
mechanism behind "history is never mistaken for a rule".

**Where the sources disagree.** Keep a Changelog permits rewriting past entries
("There are always good reasons to improve a changelog"). Rust forbids
substantive edits after acceptance. The disagreement is real but resolves by
kind: a changelog is a *derived* record of shipped facts and may be corrected
toward the facts; an RFC or ADR is the record of *an argument made at a time*,
and correcting it falsifies the argument it exists to preserve.

**Applied here.** The handoffs are records. The three that landed after
2026-08-01 do not make the 2026-08-01 handoff wrong, they supersede it. The
defect is not only that `CLAUDE.md` points at it; it is that the 2026-08-01 file
carries no status line saying it has been superseded, so it reads as current no
matter which door a session arrives through.

### 2.3 Where does STATE live, so that "what is true right now" has exactly one file?

**Answer: a machine-readable data file, one per subject, with status as an
enumerated field. Prose may quote it only if the quote is generated.**

| Support | What it contributes |
|---|---|
| Kubernetes `kep.yaml` (7) | The cleanest instance. Prose describes the design; a sibling YAML holds `status`, `stage`, `latest-milestone` with enumerated values. Status is parseable and diffable. |
| Keep a Changelog (14) | Pending state has one home: the `Unreleased` section at the top of one named file, emptied at release. |
| GitLab metadata (13) | State declared once on the page, consumed by generation elsewhere: `group` front matter populates `CODEOWNERS` via a task. |
| GitHub first-found-wins (15, 16) | Where two files could both claim to be current, the platform picks deterministically instead of the reader guessing. |

**Where the sources disagree, and it matters most here.** Kubernetes' own KEP
README lists metadata presubmit checks as an improvement they *want*, meaning
that machine-readable status field ran unvalidated. `status: implemented` in YAML
is exactly as capable of lying as the same claim in a sentence. **Putting state
in a data file buys single-location and parseability. It does not buy truth.**
Only a check comparing the field to the thing it describes buys truth.

That is the finding this repo needs. The four disagreeing gate counts are not a
writing-quality problem, and moving them into YAML would not fix them. The gate
chain is the only artifact that knows how many gates there are. Any file stating
the number must obtain it from the chain.

### 2.4 What makes a document STALE ON ITS OWN, without a human noticing?

Four automated mechanisms are attested, in increasing strength:

| Mechanism | What it actually catches | Tool | Confirmed behaviour |
|---|---|---|---|
| Link and reference checking | pointers to files, anchors and URLs that no longer exist | lychee (17) | exit code 2 when a non-excluded link fails |
| Prose linting | banned vocabulary, renamed things, style drift | Vale (18) | rules at `error` severity fail the CI build |
| Regenerate and diff | any embedded value that no longer matches its generator | cog (19) | `--check` verifies the file would not change if run again |
| Derive from the source of truth | reference docs drifting from the code they describe | tfplugindocs (20) | `generate` exports the schema and syncs the reference docs to it |

Two organisational mechanisms, weaker but cheap:

- **Ownership routing.** CODEOWNERS auto-requests the owner when a PR touches a
  documented path (16), and GitLab derives that file from each page's own
  metadata (13), so ownership cannot drift away from the page.
- **Change coupling.** Google: change the doc in the same CL as the code (10).
  Write the Docs: block the merge if a feature arrives without docs (9). This
  makes staleness impossible for documents that describe a change, and does
  nothing for documents no change touches, which is precisely the population
  that rots.

**The honest boundary, and no source states it, so it is mine.** None of these
detects a document that is *fluently wrong*. A link check passes a paragraph
describing an abandoned workflow. Vale passes a confident false number. Only the
regenerate-and-diff family makes a wrong value structurally impossible, and only
for the values it covers. Everything else narrows the surface. This is why the
fix for four gate counts is cog-shaped and not policy-shaped: a policy saying
"keep counts up to date" has already been tried by every project in this table.

---

## 3. The generated-not-typed pattern

Concrete mechanisms real projects use so that a count, a status or a "current"
pointer cannot be stated wrongly.

| Pattern | Mechanism | Tool, confirmed this session | The defect here it maps to |
|---|---|---|---|
| Embed the computed value in the prose file | generator lives between markers inside the document; CI re-runs it and diffs | **cog**: `[[[cog` / `]]]` / `[[[end]]]`; flags `--check`, `--diff`, `--check-fail-msg`, `-r` | the gate count in `CLAUDE.md`, `docs/verification-protocol.md` and the step file |
| Status as an enumerated field, not a sentence | YAML sidecar per record, fixed vocabulary | **Kubernetes `kep.yaml`**: `status`, `stage`, `latest-milestone`, `replaces` | "which handoff is current", superseded specs |
| Derive one file from another file's metadata | a task reads front matter and writes the second file | **GitLab**: `stage`/`group`/`info` front matter, Rake task writes `CODEOWNERS` | who owns a document, and whether it has an owner at all |
| Generate reference docs from the schema | export the machine's own description, sync docs to it | **tfplugindocs** `generate`, `validate` | any document listing routes, components, gates, or sections |
| Make supersession an operation | one command writes both the new record and the old record's status | **adr-tools** `adr new -s <n>` | handoffs, superseded plans and specs |
| Fail the build on a dead reference | link check with a failing exit code | **lychee**, exit 2; `lycheeverse/lychee-action` | pointers to moved or attic'd documents |
| Fail the build on banned prose | YAML rules at error severity | **Vale** | already the shape of this repo's gate chain |
| Fixed discovery path, first found wins | the platform decides which copy is authoritative | **GitHub** CONTRIBUTING and CODEOWNERS resolution order | two files both claiming to be the entry point |

**The cheapest first move consistent with all eight rows:** one script that
prints the counts (gates, tracked files, markdown under `docs/`), one marked
block in every document that states a count, and a `--check` run added to the
chain. After that, no document *states* a number; it only *carries* one, and a
document carrying a stale number turns the chain red on the next tick.

**Transferability note.** cog is Python and this chain is Node/tsx. The pattern
transfers, the tool need not: a short tsx script that regenerates marked blocks
and exits 1 on any diff is the same mechanism with the same guarantee. The part
that must be copied exactly is `--check-fail-msg`, the flag whose entire purpose
is that the failure tells the next reader how to fix it.

---

## 4. Blind spots, and the fetches that failed

**Failed, therefore unread, therefore not summarised anywhere above:**

| URL | Failure | Consequence |
|---|---|---|
| https://diataxis.fr/complex-hierarchies/ | HTTP 404 | Diataxis guidance on structuring *large* hierarchies is NOT captured here. The compass in 2.1 covers per-document typing only. |
| https://pypi.org/project/docdecay/0.1.0/ | page component failed to load, no content returned | A time-decay tool (frontmatter owner plus an age threshold) exists and is UNREAD. Deliberately absent from section 3. The time-based freshness pattern is therefore unverified and is not recommended here. |
| https://vale.sh/docs/ | HTTP 301 | Refetched successfully at https://docs.vale.sh/ and cited under that URL. |

Also read but non-responsive to the question put to them, so not leaned on:
`https://diataxis.fr/foundations/` (explains the two axes, says nothing about
mixing) and `https://adr.github.io/` (index only, defers to sub-pages).

**What this research cannot distinguish:**

1. **Published practice is what a project SAYS it does.** Every source here is a
   policy document. Not one is evidence the policy held over years. The tell is
   inside the sample: Kubernetes' KEP README lists metadata presubmit checks
   under *wanted* improvements, so its machine-readable status field ran
   unvalidated while the document describing it reads as settled. If the best
   documented process in the sample has that gap, the others have gaps I cannot
   see from one page each.
2. **A many-contributor OSS convention may not transfer to a single-operator,
   agent-driven repo.** CODEOWNERS, required review, and "block the merge on
   missing docs" all assume a second party at the review step. Here there is one
   human who does not review every commit and several agents that do not read
   each other. The mechanisms surviving that translation are exactly the fully
   automated ones: link check, prose lint, regenerate-and-diff. That is a
   selection effect produced by this repo's shape, not a neutral finding about
   which mechanisms are best.
3. **One or two pages per project.** A project's real convention may live on
   pages I did not fetch. Where a page failed to answer the question I put to
   it, I recorded that rather than filling the gap from memory.
4. **WebFetch renders each page through a summarising model.** Short quoted
   phrases are reproduced as that model returned them. I did not diff them
   against raw HTML, so a quote could be lightly paraphrased. Treat the quotes as
   accurate in substance, and verify wording before any of them is pasted into a
   rule this repo enforces.
5. **This capture cannot say what any of these projects would do about *this*
   defect**, four values for one quantity across four documents. No source in the
   table addresses a number disagreeing with itself. Sections 2.3 and 3 are my
   synthesis from adjacent mechanisms, not a cited recommendation.
