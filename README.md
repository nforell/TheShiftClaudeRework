# The Shift

A nursing clinical-judgment simulation. You work a hospital shift (med-surg, then psych): take handoff, triage, assess, give and hold meds, delegate, call providers with SBAR, and live with the consequences in the debrief.

## Play
Open `dist/the-shift.html` in a browser. It's a single self-contained file.

The deployed site (Vercel, serving `dist/`) has a beta landing page at `/` (source: `site/index.html`, screenshots in `site/assets/`) and the game at `/play/`. Run `python3 build.py` to rebuild both.

## Shifts
- **Shift 1 — Days on 4 West** (Orientation, 07:00–): four patients, rooms 412–418.
- **Shift 2 — Evenings on 4 West** (Beginner, 15:00–20:00): COPD CO₂ retainer, alcohol withdrawal, GI bleed with a blood-product mismatch, hyperkalemia, and an appendicitis admission.
- **Shift 3 — Nights on 4 West** (Intermediate, 23:00–04:00): delirium from urinary retention, a DVT that becomes a PE, DKA on an insulin drip, a silent overnight stroke, and PCA by proxy. The CNA is floated at 01:00.
- **Shift 7 — Days on 6 East** (Specialty: Step-down, 07:00–12:00): AF with RVR on a diltiazem drip when the echo shows EF 25%, a retroperitoneal bleed after femoral PCI, HIT on a heparin drip (with a nomogram decision), and a long QT with low K and Mg, a doubled citalopram and a nurse-initiated electrolyte protocol.
- **Shift 10 — Days in the ICU** (Specialty: Critical care, 3 West ICU, 07:00–12:00): septic shock on norepinephrine running in a forearm vein with a central line nobody has confirmed (extravasation, phentolamine, MAP 65 without chasing it, holding home antihypertensives, surrogate consent for source control); ARDS on the ventilator (lung-protective settings, a SAT without an unsafe SBT, delirium and least-restrictive restraint, a mucus plug: bag, check the tube, suction); the day after bypass surgery (chest tubes that go quiet while tamponade builds, electrolytes, insulin protocol); and a family meeting after anoxic brain injury (OPO referral before any withdrawal talk, never raising donation yourself, a son's request to hasten death, comfort care and staying with the family).
- **Shift 8 — Evenings in the ED** (Specialty: Emergency, Pod B, 15:00–20:00): a stroke alert whose "onset" is when his wife found him (last known well was 10:00, so a thrombolytic is out and thrombectomy is in), "indigestion" in a diabetic woman that becomes an inferior STEMI with right ventricular involvement (no nitro), a positive pregnancy test with shoulder-tip pain while radiology is backed up (and a partner who answers for her), anaphylaxis arriving from EMS with diphenhydramine but no epinephrine, and an 81-year-old on warfarin with a slow subdural behind a GCS of 15.
- **Shift 11 — Days in Labor and Delivery** (Specialty: L&D, 2 South, 07:00–12:00): oxytocin tachysystole with late decelerations behind an order that says go up; epidural hypotension with a prolonged deceleration, a full bladder, and a birth the nurse attends before the obstetrician arrives (nuchal cord, drying, skin-to-skin, delayed cord clamping, APGAR, no pulling on the cord); a uterine rupture during a trial of labor after cesarean; GBS prophylaxis and intraamniotic infection. Fetal monitoring is read in words and classified by NICHD category.
- **Shift 9 — Days on 2 North** (Specialty: Mother-baby, 07:00–12:00): postpartum hemorrhage from atony behind a full bladder (asthma rules out carboprost; TXA within 3 hours of birth), magnesium accumulating with oliguria and then severe-range blood pressure with a 60-minute clock, a 4.45 kg infant of a diabetic mother whose glucose is overdue (weight-based dextrose gel, donor milk for a mother who wants to breastfeed only, hepatitis B vaccine site), and a positive depression screen with item 10 marked before a planned discharge, plus Rh immune globulin. Each patient can have their own provider (an OB and a pediatrician).
- **Shift 4 — Days on 3 East** (Specialty: Psych, 3 East, 07:00–12:00): sudden calm before a suicide attempt, escalating mania and the least-restrictive ladder, lithium toxicity passed off as a stomach bug, first-episode psychosis and the right to refuse, and water intoxication on clozapine. California legal framing: 5150, 5250, Riese, LPS. Seclusion and emergency IM come with the order, the one-hour face-to-face, continuous observation, 15-minute checks, a debrief, and signed notes checked claim by claim.
- **Shift 5 — Evenings on 4 North** (Specialty: Teen psych, 4 North, 15:00–20:00): acute dystonia after a first dose of haloperidol that staff call acting out, refeeding syndrome in anorexia (phosphorus under every call threshold), a missed skin check and a contraband shard on self-harm precautions, protecting a teen's name and pronouns on a call with their father, a disclosure of abuse and a visitor who can't come in (mandated reporting), and a "medically cleared" admission who told a peer about an acetaminophen overdose. A hold for an emergency IM that was never charted as a restraint, with its face-to-face still due. California framing: parent-consent admissions and the 5585 hold for minors.
- **Shift 6 — Evenings on 5 South** (Specialty: Peds, 5 South, 15:00–20:00): RSV bronchiolitis on high-flow (suction, feeding thresholds, interpreter use), sickle cell crisis to acute chest syndrome (pain bias), a weight entered in pounds as kilograms (2.2x dosing), sentinel bruising and abusive head trauma in a non-mobile infant (mandated reporting), and a silent-chest asthma trap. Age-based vital sign ranges.

## First time

A brand-new player who taps Start gets an eight-step orientation first (`src/orient.js`): the clock, report, deciding who's first (drag and drop), the station and phone, a room and a medication decision, an SBAR call, delegating, and the debrief, each practiced with three demo patients. It's always available from **How it plays**.

## Every shift

These run on every unit, from `src/flow.js`:

- **Follow-up after a transfer.** A patient who goes to the ICU, PICU, ED, OR or medicine stays on your list. Call report to the receiving nurse, update the family, write the event note, and call for updates as their course plays out. The debrief shows what happened next, including after your shift.
- **Hourly rounds and call lights.** A patient nobody has checked on for a while asks for something. Answer it, round ahead of it, or send your aide, but some requests need a nurse.
- **PRN reassessment.** Every as-needed pain, antiemetic, bronchodilator or sedative dose becomes a "did it work?" task.
- **Report to the oncoming nurse.** In the last hour, give report on everyone still on the unit. Pending work you mention is fine; pending work you don't mention is a miss.
- **Help when you're stuck.** The station names one next step and counts the rooms waiting, not every line item. Every due task is tappable and opens the right tab with the action highlighted. Sit idle for 45 seconds with work waiting and a pointer appears; fall well behind (three overdue, or skipping past overdue work twice) and Nova checks in for free, at most twice a shift. When you're caught up, the station points at the patient you've looked at least recently.
- **Skip ahead.** At the station, the clock runs minute by minute (up to 30) and stops the moment something needs you: a message, a task coming due, an admission, report time. Silent deterioration does not wake you.
- **Floor calls** (`src/floor.js`). Up to five per shift from the rest of the unit: critical values, a colleague's needlestick, a visitor, a dose to check. Each is a timed decision with feedback. The pool is shared plus unit-specific, and which calls come changes every run.
- **Rewards** (`src/reward.js`). Care XP for on-time work and good calls, a streak multiplier (×1.5 to ×3) that anything overdue resets, four shift goals, stars at 58/72/85, a nine-level career ladder and ten badges, all saved to the profile.
- **Achievements.** From the home screen or the debrief: 12 bronze/silver/gold skill tracks (lifetime good calls per domain, lessons fixed, floor calls collected, shifts, stars), 15 milestones, a per-unit summary, and the **lesson log**. Every call to rethink from a finished shift is logged with its reason; replaying that shift without repeating it marks it fixed (+60 XP). Floor-call lessons are fixed by answering that call correctly later.

## Terms of use
`src/terms.json` is the single source for the terms and disclaimer. The game asks every player to agree before their first shift (and again whenever `version` changes); the build also publishes it at `/terms/`. Have a lawyer review it before selling the game.

## Clinical updates
What changed in content, and why, is logged in [docs/CLINICAL-UPDATES.md](docs/CLINICAL-UPDATES.md).

## Beta instrumentation
Analytics, in-game feedback, the landing-page signup and the installable app are set up in `src/config.js` and `src/telemetry.js`. Paste a PostHog project key into `src/config.js` to start receiving data; until then nothing is sent. The debrief can score by skill or by the six NCSBN clinical judgment steps (`src/cjmm.js`, review map in `docs/cjmm-map.csv`). Progress and what's next: [docs/ROADMAP-PROGRESS.md](docs/ROADMAP-PROGRESS.md).

## NCLEX practice and the pocket reference
- **NCLEX practice** (home screen, and Menu): 19 unfolding case studies in the Next Generation NCLEX format (`src/ngn-cases.js`; the chart grows as the case unfolds, six items per case in clinical judgment order), a 250-question bank (`src/ngn-bank.js` plus every shift and focus item) filterable by NCLEX-RN Client Needs category, judgment step, format and status, sets of ten (new questions first, then missed ones), dosage calculations with the working shown, and a readiness view by category and step. Every option of every item explains why it is or isn't right. Tested by `tests/practice.py`.
- **Pocket reference** (`src/ref.js`): 20 quick cards for the floor and the exam.
- **More floor calls** (`src/floor-more.js`): 106 in all, many on the professional and legal side of the first year as an RN.

## Classes, practice questions and the shift pack
- **Practice questions** (`src/ngn.js`): three NCLEX-style items after every debrief (bowtie, matrix, select-all, highlight, drop-down), scored the NCSBN way. After checking, every option shows why it is or isn't correct (`src/ngn-why.js`), with the points worked out part by part and a test-taking tip.
- **Focus practice** (`src/ngn-focus.js`): two questions each for the player's two lowest NCLEX steps that shift, drawn from 20 step-targeted items plus other shifts' items.
- **Showing the working**: the debrief explains how the score was averaged and where the star lines sit, and every skill and NCLEX step opens to show each decision's points (start at 60, +6 per point, −9 per point for the first three points of misses, −4.5 after), plus how the exam tests that step and how to reason through it (`CJ.GUIDE` in `src/cjmm.js`).
- **Instructor dashboard** at `/teach/` (`site/teach.html`): make a class, share the code, see results by NCLEX step and skill, the most-missed decisions, practice-question results, and a CSV. Students join from **Menu → Your class**. Needs `supabase/classes-and-pack.sql`.
- **Shift pack** (`config.pack` in `src/config.js`, off by default): a few shifts free, the rest for one payment through a Stripe Payment Link, recorded by `supabase/functions/stripe-webhook`. A class can carry a school license. Setup steps are in the progress log, Session 9.
- **Email** (`docs/EMAIL-SETUP.md`): sign-in emails use the branded templates in `supabase/email-templates/` and need a real sender (Resend through Supabase custom SMTP); Supabase's built-in mailer only reaches the Supabase team. `supabase/functions/notify` emails copies of signups, reviews and reports (`config.notify`).

## Performance and testing
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the budgets, the built-in guardrails (crash guard, Lite graphics, Settings → Health check or `?health`), and the growth plan. Before pushing, run `python tests/run_all.py`.

## Develop
Source is plain JavaScript on a global `window.Shift` object:

| File | Purpose |
|---|---|
| `src/engine.js` | Clock, state, scoring, debrief, save/load |
| `src/fx.js` | Synthesized sounds and haptics (no audio files) |
| `src/case-*.js` | Case content (patients, meds, events, dialogs, end checks) |
| `src/rig.js` | Procedural SVG character rig driven by vitals |
| `src/art.js` | Room and hallway scenes |
| `src/ui.js` | Screens and interaction |
| `src/styles.css` | Styles and theme tokens |

Rebuild after editing:

```
cd tools/minify && npm ci && cd ../..   # once: installs the pinned minifier (esbuild)
python3 build.py
```

The build minifies the code and ships the NCLEX data (question bank, case studies, rationales) as JSON that's only parsed when practice or a debrief first needs it. `SHIFT_NO_MINIFY=1 python3 build.py` skips minifying for a quick local look, but commit a normal build: the GitHub check rebuilds and compares.

`lab/character-lab.html` is the standalone character playground.
