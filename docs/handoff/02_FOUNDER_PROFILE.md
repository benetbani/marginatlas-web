# 02 · Founder Profile and Communication Protocol

> The founder communicates differently than a typical engineering
> manager. The patterns below are corrected across multiple sessions.
> Honour them strictly. Misreading them wastes time on both sides.

---

## 1 · Identity

| Field | Value |
|---|---|
| Email | `benet@researchtesseract.com` |
| Display name on registrations | "Atlas Tesseract Research" or "Tesseract Research" |
| Company URL | `https://marginatlas.com` |
| GitHub | `benetbani` |
| Dev machine | Windows, paths begin `E:\atlas\…` and `E:\Archive\Projects\UI-UX\…` |
| Language | English, but voice-dictated paragraphs are common — often run-on |
| Time pattern | Long unsupervised work sessions; will say "I'm not here for hours" |

---

## 2 · Communication style

The founder writes in voice-dictated paragraphs. Sentences run on.
Punctuation is informal. Words are sometimes phonetic. Parse the
substance, ignore the filler.

### Recurrent linguistic patterns and what they mean

| Phrase pattern | Translation |
|---|---|
| "Just do it, just do it, just do it" | Permission granted. Stop asking. Execute. |
| "Don't bitch about X" / "don't be boring about it" | Skip the safety disclaimer; do the thing |
| "Give me a very direct answer" / "be very direct, not fluffy" | Lead with yes/no/the number/the choice. Explain after. |
| "Tell me what the fuck to do, click by click" | Walk through the screen with exact button labels |
| "I'm not here for the next few hours" | Make autonomous decisions; report at the end |
| "Be ambitious, be aggressive" | Push for breadth; don't sandbag the plan |
| "Don't overload the RAM" / "don't block the machine" | Cap at 600 MB RSS, sequential pipelines |
| "I haven't decided X yet" | Stop pitching X; wait |
| "Wait a little" | Pause, but stay loaded |
| "We have time to think about that for later" | Defer indefinitely |
| "Now what the fuck to do" | They lost the thread; restate the next concrete step |
| "Where is the file" / "you give me explanations without the file" | They want an exact path now, not later |
| "Such a thing" / "things like that" | Fill in the obvious detail yourself; don't ask |

### Recurrent corrections (do NOT repeat these mistakes)

| The mistake | The correction |
|---|---|
| Using the word "okay" in responses | Founder explicit: "do not use the word okay, now not this" — this has been flagged twice |
| Hedging with "it depends" / "it may be a good idea to" | Be direct |
| Pitching them on something they already approved | Stop pitching; execute |
| Asking a clarifying question before executing | Try to make the decision yourself; only ask if genuinely blocked |
| Apologising more than once | One acknowledgement, then move on |
| Restating what they just said | Save the tokens |
| Using fluffy adjectives ("comprehensive", "robust", "leverages") | Plain language |
| Describing process instead of result | Show the result first, process below |

---

## 3 · Decision-making style

| Aspect | Pattern |
|---|---|
| Speed | Wants fast iteration; prefers shipping then refining |
| Detail | Will tolerate (and ask for) deep documentation — proven across multiple plan docs |
| Money | Cautious but rational. $25/month Supabase upgrade: yes. $300 Supastarter or $3-5k images: not yet. |
| Quality | "Should be a work of the highest quality" — appears in long unattended work briefs |
| Risk | Comfortable with calculated technical risks; intolerant of operational mess |
| Disagreement | Will push back if you're wrong; expects you to push back if they're wrong |

---

## 4 · What blocks the founder

| Blocker | Workaround |
|---|---|
| RAM pressure on dev machine | Cap any script at 600 MB RSS, sequential not parallel |
| Korean phone for KOSIS | Confirmed impossible; skip permanently |
| Editorial tone | Hasn't decided; don't push, don't generate editorial content |
| Manual API key registration | Tolerable, but give exact URLs + form-field values |
| Manual file downloads (Sirene 6 GB) | Yes when there's no API alternative |
| Operational chaos (broken DNS, mistyped form) | Hates this. Detect early, give precise recovery steps. |

---

## 5 · What to do when uncertain

### Default behaviour matrix

| Situation | Default |
|---|---|
| Founder said "go" without specifics | Pick the highest-impact item from `11_NEXT_STEPS.md` Tier 1 |
| Founder said "do everything" | Execute Tier 1 + Tier 2; pause for genuine blockers; report at end |
| You have an idea you think is better than the plan | Make a brief case + ask once; if no answer, defer to the plan |
| You hit an unexpected source-data shape | Try one fix; if still failing, document + move on (don't loop) |
| You hit an API key requirement | Pause; tell the founder which page to register on with exact steps |
| You hit a payment requirement | Stop; ask for explicit founder approval |
| You hit a destructive operation (DROP, force push) | Stop; ask |
| You hit a question only the founder can answer (tone, naming) | Stop; ask one clear question |

### What "0 stops" actually means

When the founder says "execute all of it, 0 stops" they mean:

- DO continue past sub-phase boundaries without asking for approval
- DO move to the next phase if one fails (don't loop on a broken API)
- DO commit and push between phases
- DO scaffold and document what can't be executed
- DO NOT push past blockers that require their input (API keys, downloads, payments)
- DO NOT skip RAM caps to go faster
- DO NOT skip documentation

---

## 6 · How they ask for documentation

When the founder asks for a "massive plan" / "very detailed file" /
"highest quality" they mean:

- Multiple structured `.md` files, not one wall of text
- Numbered sections, tables wherever possible
- Each item self-contained (don't depend on heavy cross-reference)
- Code blocks for paths, commands, queries
- No fluffy language; no "comprehensive" / "robust"
- The doc should be readable by both a human and a machine (next-session LLM)

The current handoff folder (`docs/handoff/`) is the canonical example.

---

## 7 · How to give them operational instructions

When the founder is in an admin panel (Cloudflare, Supabase, Vercel,
Stripe), they want CLICK-BY-CLICK:

- Exact button labels in **bold** or quoted
- Exact field values in code blocks
- Numbered steps (1, 2, 3 …)
- One screen per step block
- Tell them what to ignore on the page
- Tell them what the success indicator looks like ("✅ Success. No rows returned")
- If they can paste a value, give them the value to paste

Example of the right format (from a past session):

> 1. Click in the editor area
> 2. Press **Ctrl+A** then **Delete** to clear anything
> 3. Paste this SQL exactly: ```...```
> 4. Click the green **"Run"** button (bottom-right) or press **Ctrl+Enter**
> 5. Bottom panel should show: ✅ `Success. No rows returned`

---

## 8 · How they handle errors

| Error type | Founder reaction | Your response |
|---|---|---|
| Your script fails | Pragmatic, wants to know cause | Diagnose, fix, move on; don't apologise repeatedly |
| Their click broke something | Frustrated, blames themselves | Walk through recovery without making them feel bad |
| Source API down | Accepts it | Mark PARTIAL, move to next phase |
| Cost overrun | Annoyed | Give cheaper alternative + recommendation |
| Time overrun | Tolerated for unsupervised runs | Report progress; don't sandbagged |

---

## 9 · How they read your output

They are skimmers. The first 3 lines and any bold text get the most
attention. The conclusions matter more than the methodology.

- Lead with the answer / status / number
- Bold the key facts
- Use tables for any 3+ row comparison
- End with the concrete next step

If your output is more than ~30 lines, you should re-read it and ask:
"Could I cut half of this and lose nothing?" Usually yes.

---

## 10 · Personal preferences observed

| Topic | Preference |
|---|---|
| Branding | Bloomberg-Terminal-meets-Stripe aesthetic — warm, premium, restrained |
| Voice | Direct, decisive, analytical, no hype |
| Language | "Slop" not "flop" for bad analysis |
| Em dashes | OK in body, NEVER in headlines unless requested |
| Pronouns | "We" for the product, "you" for the founder |
| Emojis in user-facing UI | Yes for flags + sector icons; nowhere else |
| Emojis in chat with founder | Sparingly, only where they help (status indicators) |
| Plan documents | Long, numbered, tables, every WHY explained |

---

## 11 · Things that have annoyed the founder in past sessions (avoid)

1. Using "okay" repeatedly (flagged twice)
2. Asking for approval mid-phase when they said "execute all of it"
3. Generating editorial content before tone was decided
4. Putting an image on the right side of the hero (corrected)
5. Alphabetical sort of sectors when curated order was needed
6. Showing "Coming soon" tiles on the home page
7. Generic answers when click-by-click was needed
8. Hedging on the Supabase upgrade question instead of giving a direct yes
9. Pretending an API works when it doesn't
10. Disclaimers about the API key they explicitly pasted

---

## 12 · Things that have pleased the founder in past sessions (do more)

1. Executing autonomously when given "0 stops" permission
2. Writing long, structured documentation (PLAN_V3, PLAN_V4, this folder)
3. Catching subtle data-quality issues (NAICS-3 mapping gap, NACE filter bug, etc.)
4. Diagnosing root cause before applying fixes (US ingest rate slowdown, Eurostat JSON-stat parser, etc.)
5. Saying "no" when something is impossible (KOSIS Korean phone)
6. Updating the scoreboard scoreboard in real-time
7. Click-by-click for operational tasks
8. Direct cost-benefit recommendations on infrastructure decisions
