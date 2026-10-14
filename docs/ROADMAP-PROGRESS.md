# Beta roadmap: progress log

Where the work from the business plan stands. Newest session first. The next session starts at **Up next**.

## Session 20 — October 14, 2026 (branch `playtest-fixes`)

Nick's ask: an AI playtester (Muse) played all 11 shifts end to end and wrote a report. Fix what it found and improve where it makes sense.

### Done
- **Hold-to-give.** One duration everywhere (0.6 s), a progress fill that survives the screen redrawing under your finger (a toast or the clock used to cancel the hold silently and hide its progress), sliding off cancels but jitter doesn't, and **tap twice** works as an alternative to holding. The button now says what it does: "Give Gentamicin", "Set the pump: Decrease to 1 g/h". It used to print the dose option's number as milligrams ("Hold to give 3 mg" on microgram drugs and on "stop the heparin").
- **Discontinued orders aren't tasks.** The station list, the patient strip, the oncoming-nurse report and the "no late doses" goal now skip orders that were replaced or discontinued (Leo's 2.2× wrong-weight doses kept showing as due and late after the corrected orders). Transferred patients' scheduled meds and shift assessment leave the task list too (Baby Nguyen after the NICU). Spironolactone leaves the MAR once the provider discontinues it; heparin leaves once comfort orders are carried out (714).
- **Stale replies and banners.** Choosing "I'll go see her" retires the other replies; placing the call a message asked for retires it; questions asked about a patient before they left the unit stop offering answers ("First day, babies sleep" after the NICU). Banners that need an answer (call lights, questions) stay up until answered or dismissed instead of vanishing after 7 seconds and then counting as missed.
- **Patient headers follow the shift** (`d.live(s, P)` in a case, read through `liveDef()`): 714's code status after the family meeting (DNR, comfort care), lines and breathing-tube portrait after extubation, 222's problem after the birth, 301's legal status after the 5250. L&D 221 and 222 show "Looks settled" when they are.
- **Floated CNA.** On nights, once Dee is floated the team bar says so, call lights come from Nova and don't offer "Dee, can you take it?"
- **Debrief accuracy.** Floor calls say they were someone else's patient ("Floor call (bed 715, not your patient)"); floor-call characters and rooms no longer share names or room numbers with your patients (a "Kowalski" in 414 on a day with your own 414). Handoff-cue feedback lists which critical lines were missed and which flags weren't critical. Epilogue stories match the outcome that was scored (212, 214, 216, 605). Fixed: Jaylen's dystonia call not counting when the player asked for the anticholinergic directly; the advance directive "read before the meeting" when it wasn't; "no glucose check" when there was one; "sodium stopped falling" when it hadn't; Mateo's "RR down from the 70s" and "rapid response" when it was a phone call; baby girl/boy mix-ups in L&D transfers; `{cna}` in missed floor-call text.
- **State-aware providers.** A second magnesium call answers from where things stand (already on 1 g/h with a level of 8.6 and oliguria: stop it) instead of repeating the first order. Peds repeat calls on Mateo and Zoe escalate on the second call with findings.
- **Missing mechanics surfaced.** Stopping heparin for HIT now says to call and adds "call for a non-heparin anticoagulant" to the task list (the option used to say "stop and call" but only stopped). Kayla's disclosure adds "call the child abuse hotline yourself" to the task list. Noah's mandated report can still be made by phone after he goes to the PICU.
- **Hold parameters.** Holding a dose "outside the hold parameter" when every check is inside it gets one warning first. An unjustified metoprolol hold on nights is scored, with the link to the BP and the thrombolytic threshold. Questionable holds can be reported on the SBAR's medication-error section.
- **Readability.** Last-done text is shortened at a word ("Pain 9 out of 1…" was a cut-off "10"); the vitals strip and bedside monitor expose their numbers to screen readers.
- New `tests/playtest.py`. v0.6.5-beta.

### Not changed, on purpose
- Prioritization scoring for clinically defensible choices (teen psych) and the PCA-by-proxy debrief ordering: design calls for the clinical reviewers.
- ED handoff "left out what happened" for a checked box could not be reproduced (clicking every box gives a clean report); worth a look if a real tester sees it.

## Session 19 — October 12, 2026 (branch `email-polish`)

Nick's ask: does the backend work (sign-up emails etc.)? The sign-in email he tried looked sketchy.

### Done
- **Finding:** sign-in used Supabase's built-in test mailer. It delivers only to the Supabase team ("Email address not authorized" for everyone else), sends 2 emails an hour, and links to `omcorltahsnnmpifefpm.supabase.co`. Beta signups, reviews and reports reach PostHog only; nothing reaches an inbox.
- **Branded sign-in email** (`supabase/email-templates/`): The Shift header, one "Sign in" button, plain explanation. The button links to the game page itself (`#token_hash=…&type=email`); the game trades the token for a session (`POST /auth/v1/verify`) and clears it from the address bar. Scanners that pre-open links can't use the token up. Old-style links still work.
- **Plain-English errors** in the game and the teach dashboard: not open to everyone yet, too many emails, bad address, used or expired link (the sign-in sheet opens and says so).
- **Inbox copies** (`supabase/functions/notify`): each beta signup, clinical review, problem report and feedback note emailed to one fixed address through Resend, with reply-to set to the sender. Off until deployed (`config.notify`).
- `docs/EMAIL-SETUP.md`: the dashboard steps. New `tests/email_link.py`. v0.6.4-beta.

### Needs Nick (before inviting testers to sign in)
- Follow `docs/EMAIL-SETUP.md`: a domain, Resend, Supabase custom SMTP, paste the two templates, set the Site URL and Redirect URLs. Until then, tell testers to play without an account.
- Optional: deploy `notify` and set `notify: true`.

## Session 18 — October 10 to 11, 2026 (branches `nclex-debrief-tab`, `sbar-done-actions`, `safari-crash-fix`, `stability-pass`, `faster-start`)

Nick's asks: make NCLEX review prominent, make SBAR reflect what you did, stop the crashes, make the game very playable, then make it load faster and bring the docs up to date.

### Done
- **NCLEX review tab** in the debrief, next to *Your shift*. The shift tab opens with an NCLEX card (weakest step, the six step scores, questions waiting). The tab has the six-step strip, a plan for the shift, this shift's questions and focus practice as cards, where thinking slipped, each step's guide and traps, and matching case studies. In-shift feedback names the NCLEX step each decision tests; shift cards show the NCLEX questions and case studies that come with them.
- **SBAR: What you've already done.** Every call lists this shift's actions for that patient from the log (interventions, meds given, held or declined, calls), in the past tense, skipping what a case finding already says. The reply acknowledges them.
- **iPhone crash fixed.** Safari rejects audio resume/suspend and clipboard writes; those rejected promises reached the crash guard and showed "Something went wrong" mid-shift. They're swallowed now; unhandled rejections are logged (`error_async` in PostHog, Health check) without the card. Thrown errors in game code still show it.
- **Stability pass** (random real-tap play on all 11 shifts plus hostile conditions): fixed a crash when the home screen's selected shift differed from the saved one, a crash giving report with nobody left on the unit, profiles with null fields breaking every redraw (profiles are now repaired on load), and "undefined" labels in the floor-call collection.
- **Faster start.** The build minifies with a pinned esbuild (`tools/minify`, `npm ci` once), ships the NCLEX data as JSON parsed on first use, and draws shift-card portraits below the fold as they scroll in. On a mid-range phone profile (4x CPU slowdown, 4G): home screen ready in about 2.3 s, down from 3.1 s; download 1.0 MB compressed.
- **Report a problem with this question** on every practice question, for reviewers and players.
- New tests: `tests/robust.py` (blocked and full storage, corrupted saves and profiles, offline, 320px, mid-game shift switch, report with nobody left), `tests/safari.py`, `tests/sbar_done.py`. The layout audit no longer flags buttons whose center is off screen.
- `docs/REVIEWER-GUIDE.md`: the one-pager to send nurses with their review link.

### Needs Nick
- **Clinical sign-off.** No shift is marked reviewed yet. Send the reviewer guide with a `/review/<shift>/` link to one nurse per specialty, and record each sign-off in `src/review.js` (see docs/CLINICAL-REVIEW.md).
- **Real iPhones.** The Safari fixes were tested by simulating Safari's refusals; have testers play a full shift on iPhone, then check PostHog `error` and `error_async`.
- Lawyer review of `src/terms.json`; decide pricing and the free shifts before turning on the pack (`config.pack`), which still lists 3 free of 11.

### Up next
1. Read PostHog for where testers stop (report, the first med pass, before the debrief) and simplify there.
2. Record clinical sign-offs as they come in, and fix what reviewers flag.
3. If the game grows past about 14 shifts: load each shift's case file on demand (see docs/ARCHITECTURE.md, option 3).

## Session 17 — October 10, 2026 (branch `ld-shift`, built on `icu-shift`)

### Done
- **Shift 11: Days in Labor and Delivery** (`src/case-ld1.js`, `src/stories/ld1.js`), Advanced. Oxytocin tachysystole with a resident asking to go up; epidural hypotension and a birth before the doctor arrives (with APGAR scoring); a TOLAC uterine rupture; GBS prophylaxis and intraamniotic infection. Every strip read is a scored NICHD category decision. OB tech Renee replaces the aide; OR follow-up and report for emergency cesareans.
- A **Labor and delivery** specialty (brick red) on the home screen, landing page and practice hub; L&D whiteboards; labor rooms' bedside monitor shows the fetal heart rate.
- Three NCLEX items for the shift with full rationales; NCLEX step filing for L&D decisions reviewed by hand; `docs/cjmm-map.csv` regenerated.
- New `tests/ld.py` (careful run: all four good, score 91; skipper: all go badly, score 20). L&D added to the sweep and follow-up lists.

### Needs Nick
- L&D nurse review (`/review/ld-2s-1/`): oxytocin restart rule, terbutaline dose and criteria, phenylephrine dose, gentamicin dosing, and the unattended-birth sequence.

## Session 16 — October 10, 2026 (branch `icu-shift`, built on `nclex-prep`)

### Done
- **Shift 10: Days in the ICU** (`src/case-icu1.js`, `src/stories/icu1.js`), Expert. Four patients, each with a hidden deterioration, real orders with traps, family conversations, story arcs and end-of-shift outcomes (see README and docs/CLINICAL-UPDATES.md). The ICU tech replaces the aide; four ICU floor calls; three NCLEX items with full rationales; an oncoming ICU nurse; OR follow-up for a missed tamponade.
- A **Critical care** specialty (deep teal) on the home screen, landing page and practice hub. Whiteboards in ICU rooms read "Tech" and "Visiting: open".
- Intubated patients now show an **endotracheal tube** (rig extra `ett`), and patients on a ventilator are never offered "wants to talk".
- NCLEX step filing for ICU decisions reviewed by hand (OVERRIDE in `src/cjmm.js`); `docs/cjmm-map.csv` regenerated.
- New `tests/icu.py` (careful run: all four good, score 92; skipper: all four go badly, score 22). ICU added to the sweep and follow-up lists.

### Needs Nick
- Critical care nurse review (`/review/icu-3w-1/`): the SBT screen thresholds, vasopressin trigger, insulin protocol steps, and the OPO trigger wording.

## Session 15 — October 9 to 10, 2026 (branch `nclex-prep`)

Nick's goal: as much clinical-grade content as possible, so the game genuinely prepares people for the NCLEX and the move into the RN role.

### Done
- **NCLEX practice hub** from the home screen: unfolding case studies (19) with a growing chart and tabs that flag new entries; a question bank (250) filterable by Client Needs, step, format and status; sets of ten; calculations scored by the rounding the question asks for; set and case results by step; readiness by category and step. Progress lives in the profile and syncs to a class like the debrief questions.
- **Pocket reference** (20 cards) from the home screen, the hub and the menu.
- **Floor calls** 36 → 106, weighted to the professional, legal and teamwork judgment new grads say school didn't cover. The floor-call collection track's gold tier is now 50 (it was the pool size).
- Phones: the home and hub headers keep a Menu button so Settings and How it plays stay reachable.
- New `tests/practice.py` (every item well-formed; the hub, a case study, a set, readiness and the reference with real clicks at 390 and 1280). Full suite clean.

### Needs Nick
- **Clinical review of the new content before launch** (see docs/CLINICAL-UPDATES.md, October 10). The writers flagged judgment calls worth a nurse's eye: SBT screening thresholds, magnesium ranges, CIWA-Ar protocol cutoffs, Parkland 4 vs 2 mL/kg (ABLS now starts adults at 2), air embolism positioning, metformin and contrast.

### Up next
1. Shift 10: ICU (brief written: septic shock on norepinephrine, ventilated ARDS, post-CABG tamponade, a family meeting and comfort care).
2. Labor and delivery.

## Session 14 — October 4, 2026 (branch `talk-in-scene`)

Nick's ask: make it obvious you can talk to people, and show conversations in the room instead of sending you to a button and a pop-up.

### Done
- **Patients speak in the room.** Each patient has a speech bubble by their head with what they're saying right now (it changes with how they're doing) and a button inside it: "Talk with Mrs. Mendes · 3 min", or "Mrs. Mendes wants to talk" with a pulsing dot when there's a new conversation or a story beat waiting. Tapping the patient refreshes what they say. Family at the bedside get their own bubble ("Talk with Lucía"). Newborns and infants say "Pick him up".
- **Conversations happen in the scene.** The patient's line appears in a comic-style speech bubble pointing at them (or at the family member speaking), with spoken words plain and actions in italics. Your replies appear under the scene as speech bubbles you tap (number keys 1–3 work too). What you said stays on screen as your bubble, the next line appears by the patient, and "Why it matters" feedback shows inline. The rest of the room dims and holds still while you talk. No pop-up.
- The old "Talk with…" button floating by the bed is gone; Talk & call still lists conversations, calls and help.
- Phones: the idle bubble sits over the bed (or at the top when the patient is a baby in a crib), and the conversation bubble drops below the scene with its tail pointing up at them.
- Fixed: Baby Nguyen's idle look line said he was limp at baseline (the art read a newborn's normal blood pressure as shock).
- `tests/clarity.py` now checks the bubble, starting a conversation in the room, replies, and ending it, on every shift, phone and desktop. Full suite clean.

## Session 13 — October 3, 2026 (branch `more-shifts`)

Nick's ask: make the "who first" ranking draggable, and give first-time players a real introduction instead of dropping them in.

### Done
- **Drag to reorder.** The triage ranking is now drag and drop. On a computer, grab any card; on a phone, grab the handle on the left so the page still scrolls. Cards slide out of the way, the numbers renumber live while you drag, the list scrolls if you drag to the edge, and the card eases into place on drop. The arrows are still there (smaller) for keyboard and screen-reader players, and a screen-reader message announces the new position. The engine (`sortDown/sortMove/sortUp` in `src/ui.js`) works for any list marked `data-sort`.
- **Orientation** (`src/orient.js`). A full-screen first-day walkthrough on 4 West with Nova and three practice patients. Eight steps on a clipboard checklist, each one played, not read:
  1. How time works: tap actions and a wall clock advances by exactly what each costs.
  2. Take report: highlight the lines that matter on a brain sheet; see what you caught and missed, and why.
  3. Decide who's first: drag magnets on the unit whiteboard into order (practice for the real ranking).
  4. The station: a hallway with a call light, a unit phone with a critical lab and an aide's question to answer, and the team.
  5. In the room: the Assess / Care / Meds / Talk tabs, and a metoprolol dose to give or hold after counting an apical pulse.
  6. Call for help: build an SBAR call from findings and noise; the doctor answers based on what you said.
  7. Your team: assign four tasks to the aide or yourself; scope-of-practice feedback.
  8. The debrief: animated skill and NCLEX-step meters, stars and patient outcomes.
  It opens automatically the first time a brand-new player taps Start (finishing goes straight into that shift; "Skip, I've played before" does too). It's always available from **How it plays** on the home screen and in the menu, and the quick reference is one tap from the last step. Arrow keys move between steps, Escape closes. Works on phones (the clipboard becomes a progress strip), in dark mode, and with reduced motion. Telemetry: `orient_open`, `orient_done`, `orient_skip` (with the step), so PostHog shows where people stop.
- The in-game coach tips and guided first room are unchanged and still run on the first real shift.
- New `tests/orient.py`: plays every orientation step with real clicks and a real mouse drag, checks it starts the shift, checks triage drag-and-drop and the arrows, on phone and desktop. In `run_all.py`.

### Needs Nick
- Play it as a first-timer: Menu → Settings → Intro and tips → Show them again, then go home and start a shift (or open a private window).
- Watch where testers skip (`orient_skip` step number) once PostHog is on.

## Session 12 — October 3, 2026 (branch `more-shifts`, built on `main`)

Nick's ask: more rooms and cases, as robust as possible. Two new specialty shifts, toward 12–15 for the pack.

### Done
- **Shift 9: Days on 2 North** (mother-baby, 07:00–12:00). `src/case-ob1.js`, `src/stories/ob1.js`.
  - 212 Keisha: atony behind a full bladder 2.5 hours after a long oxytocin induction. Fundus, bladder scan and cath, weighed pads (QBL), massage, the PPH order set. Asthma makes carboprost dangerous; leaving it off the call makes the OB suggest it. TXA scores fully only inside 3 hours of birth.
  - 214 Lani: magnesium for severe preeclampsia with 3 hours of oliguria and a rising creatinine. Hourly reflex/RR/LOC/urine checks; a call gets 1 g/h, and the pump has to be changed. Ignored, reflexes go, then breathing (toxicity protocol: stop, calcium gluconate). At 08:35 a severe-range pressure with a headache starts the 60-minute treatment clock (labetalol, hydralazine or nifedipine; acetaminophen for the headache is the trap).
  - 216 Baby Nguyen: 6 hours old, 4.45 kg, mother on insulin. Glucose overdue, no feed since 04:00, a little cool. Dextrose gel by weight (2.2 mL), feed, warm, recheck in an hour; symptoms mean the pediatrician and IV dextrose. His mother wants exclusive breastfeeding: donor milk with her consent. Hepatitis B vaccine with an injection-site choice.
  - 218 Sarah: day 1 after a cesarean, EPDS 15 with item 10 marked, history of depression off sertraline, discharge planned for 14:00. Ask directly, ask about a plan, never promise secrecy, call, hold discharge, safety companion. RhoGAM (IM only, within 72 hours) and intrathecal morphine checks.
  - Each patient can now have their own provider (`provider` on a patient): the OB for mothers, a pediatrician for the baby.
- **Shift 8: Evenings in the ED** (Pod B, 15:00–20:00). `src/case-ed1.js`, `src/stories/ed1.js`. Three in beds and two arrivals.
  - 22 Gerald: stroke alert. EMS's "onset 14:30" is when his wife found him; she last saw him normal at 10:00, so the window had already closed when she found him. A tenecteplase order arrives at 15:24 based on the EMS time. Asking her, and calling, cancels it and sends him to thrombectomy for an M1 clot. BP under 185/110, swallow screen before anything by mouth.
  - 21 Rosalind: diabetic woman with "indigestion" and no aspirin at triage. The repeat ECG (on time, or when her pain moves to her jaw) shows an inferior STEMI; V4R shows the right ventricle, so nitroglycerin crashes her pressure. Ignored, she fibrillates.
  - 23 Alicia: positive hCG, waiting on a backed-up ultrasound while she bleeds: shoulder-tip pain, dizziness, a heart rate that climbs. Her boyfriend answers for her; talking to her alone surfaces bruising and a disclosure, with a right and two wrong responses.
  - 24 Kenji (arrives 16:10): anaphylaxis; EMS gave diphenhydramine, no epinephrine. IM thigh epinephrine fast, a second dose, fluids; IV push of 1 mg/mL is a scored error. Later he wants to leave: observation, two autoinjectors, teach-back.
  - 25 Harold (arrives 17:30): fall on warfarin, GCS 15. A slow subdural shows up on neuro checks about 40 minutes in; 4-factor PCC and IV vitamin K stop it. Ondansetron for new vomiting without a neuro check, and his 18:00 warfarin, are traps.
- Every new patient has a story arc, transfer follow-ups (L&D, NICU, cath lab, IR, OR, ICU) and new receiving nurses, three NCLEX-style items per shift, floor calls for each unit (infant security, baby blues vs. depression, a cool newborn, safe sleep; a gray man in the lobby, leaving AMA, EMTALA, an escalating visitor), unit flavor for call lights and rounds, and a STEMI rhythm on the monitor.
- Admissions can now be labeled per patient ("Arrival from EMS", "from triage") instead of always "Admission from the ED"; newborns get "Pick him up" instead of "Talk with".
- New tests: `tests/ob.py` and `tests/ed.py` (careful run: every patient good, Evaluate outcomes scored; skip-ahead run: every patient bad). Both shifts added to the sweep in `tests/run_all.py`. `docs/cjmm-map.csv` regenerated.

### Needs Nick
- Clinical review: send `/review/ob-2n-1/` to a mother-baby or L&D nurse and `/review/ed-podb-1/` to an ED nurse. Specific things to check: the PPH order set allowing nurse-initiated uterotonics, the magnesium toxicity thresholds, the newborn glucose protocol numbers, the EPDS follow-up workflow, the ED heparin bolus (60 units/kg, max 4,000), and the stroke workflow using tenecteplase.
- Play each once. The ED is rated Advanced: two arrivals land while the first three are still active.
- The shift pack: both new shifts are paid by default (only the three listed in `config.pack.free` are free).

## Session 11 — October 1, 2026 (branch `psych-documentation`, built on `clarity-pass`)

Nick's ask: on the psych units, lean into the documentation and justification that seclusion, restraint and emergency IM medication require, including the provider's in-person check.

### Done
- **A new way to chart: signed notes.** Any intervention can now open a structured note the nurse signs. Every box is a claim, and the case checks each claim against what actually happened that shift. A note gets credit for being specific (the behavior, not a label), complete (what was tried first, the order, the face-to-face, the checks) and true. Charting anything that didn't happen (a check never done, a measure never tried, a face-to-face before the doctor came) is scored as falsification, and the review names exactly what was false. Signed notes go into the patient's chart.
- **3 East, Jasmine (manic, on a 5250):** seclusion and the emergency IM now come with everything they require, modeled on CMS 42 CFR 482.13(e) and California Health & Safety Code 1180:
  - A provider order for each episode (a call made just before counts). A hold to give the IM is a restraint and starts the same clock.
  - **The one-hour face-to-face:** call Dr. Iyer; she comes in about 15 minutes, examines Jasmine and charts her evaluation. If an hour passes without it, it's scored and Nova calls you on it.
  - Continuous observation set up at once (scored; if nobody's assigned, Nova catches it).
  - A charted check at least every 15 minutes in seclusion (breathing, behavior, injury, water, bathroom), scored on any gap.
  - Release when she's safe, not on a timer.
  - Post-IM check (vitals, sedation, breathing, stiffness) within 30 minutes.
  - Two notes: the **seclusion and restraint note** (what was used, the specific behavior, what was tried, order/face-to-face/observation/checks, release criteria; the wrong choices include "when the order runs out", "when she apologizes" and "when she takes her meds") and the **emergency medication note** (why it was an emergency, whether oral came first, that the hold was a restraint, who was told, her response, and that her right to refuse non-emergency meds survives; no Riese ruling).
  - A **debrief** with her afterward, written into her plan.
  - All of it shows on the Brain due list with times, and Nova has hints for it. If the team has to take her down without you, the order and the observer are handled, but the face-to-face call, the checks and both notes are still yours.
- **4 North, Jaylen (14):** report now mentions it took three staff to hold him for the 14:30 haloperidol. The day RN's note charts the IM but not the hold as a restraint, has no face-to-face, and says nothing about his mom. Reviewing the record finds all three. Then: call Dr. Adeyemi for the face-to-face (due by 15:30; she charts it and warns it's his first antipsychotic), ask Ben, who was there, to chart the hold before he leaves (charting it yourself from report is scored as charting what you didn't witness), and call his mom (who mentions an uncle whose neck "locked up" on one of those). Missing any of it is scored at the end. The unit policy order spells out the minors' rules (2-hour orders for ages 9 to 17).
- New `tests/restraint.py` plays it five ways: Jasmine by the book with an IM, by the book with seclusion, with every shortcut (no observer, no face-to-face, a vague and false note with a coercive release), and Jaylen caught or missed. `tests/teen.py` careful run updated. `docs/cjmm-map.csv` regenerated. Full suite clean.

### Needs Nick
- Clinical and regulatory review, ideally by someone who's charted a lot of seclusion: the timing (1-hour face-to-face, 15-minute checks, 4-hour adult and 2-hour minor orders), whether your units let a trained RN do the face-to-face, the parent-notification policy for minors, and the exact wording of the note options. The rules live in `src/case-psych1.js` (`startEp` and the notes) and `src/case-adolpsych1.js` (405).
- Both psych shifts now show "changed since review" on the clinical review page, as they should.

## Session 10 — October 1, 2026 (branch `clarity-pass`, built on `next-four`)

From the first outside player's notes.

### Done
- **Talking to the patient** is now a speech bubble in the room, by the bed: "Talk with Mr. Bell", or "Mr. Bell wants to talk" (filled, with a dot) when they do. It opens the Talk tab.
- **Nova** is in the header as a face with "Ask Nova · Tips · 3 left" instead of three dots. Her sheet says what she's for (where she'd look next, not the answer) and that tips don't lower your score. The button reads "Get a tip".
- **The aide** (Luis, Andre, etc.) is in the header next to Nova, on every screen, with a status: free, busy with N tasks, or how many things they can take. Their sheet now leads with at most three suggestions in the aide's voice (things coming due that are within their scope: vitals, sugars, intake, weights, walks, plus vitals on anyone with an old set), each one tap to send. Everything else, including the things an aide can't do, is folded under "Ask for something else", so the scope-of-practice traps still exist. A line says what an aide can and can't do. The player still decides who's stable enough to hand off.
- **The station** is called "Nurses' station: home base" in the tab bar, has a heading and one line saying what it's for, and the room button says "Back to station". The first-time tips now start with what the station is, and include the team in the header.
- **Aide suggestions, tuned for every shift.** The aide offers, in order: things on the due list that are an aide's job (a glucose check, an admission weight, picking up blood for a transfusion, post-dose vitals), the vitals round (an hour into the shift, then every four hours, starting with your lower-priority patients, since you're seeing the sickest yourself), then routine care (walks, turns every two hours, diapers and I&O, baths when there's time). Each offer is tried on a copy of the shift first, and anything the game would score as a delegation mistake is never suggested (no walk for a confused fall risk, no vitals-only check where the RN has to assess). Judgment-call tasks like a sitter or keeping someone flat are never suggested; they stay in the full list.
- The talk bubble moves below the patient's name card when the card is tall (teen psych).
- New `tests/clarity.py`: every shift, phone and desktop: the station heading, both helpers in the header, the talk bubble placed well in every patient's room, at least one aide suggestion at shift start, and every suggestion sent without a delegation mistake. Full suite clean.

### Needs Nick
- Put the build in front of the same player and see if these four land.

## Session 9 — October 1, 2026 (branch `next-four`, built on `house-style`)

### Done
- **Instructor dashboard** at `/teach/` (`site/teach.html`). An instructor signs in with an email link, makes a class and gets a 6-character code. Students join in the game (**Menu → Your class**) with the code and the name the instructor should see. The dashboard shows how many have played, the class's average by NCLEX clinical judgment step and by skill (latest attempt per student), a roster with each student's best score per shift, each student's attempts with the decisions they missed, the most-missed decisions across the class, practice-question results (first try, lowest first), a filter by shift, and a CSV download. Students can leave; instructors can remove a student.
  - Every finished shift and practice question is saved to the player's account as a result (`results`, `ngn_results`). Results played before signing in wait on the device and upload at sign-in, so a student who joins mid-semester brings their earlier shifts.
  - `supabase/classes-and-pack.sql`: the tables, row level security (instructors read only their own students' results; students read only their own; nobody can write a purchase), and the two functions for making and joining a class. `tests/sql/policies.mjs` runs it on a real Postgres (PGlite) and checks 13 rules.
- **Shift 7: Days on 6 East** (cardiac step-down, 07:00–12:00). A-fib with RVR on a diltiazem drip with an echo that comes back EF 25% (diltiazem has to go; amiodarone instead), a post-cath retroperitoneal bleed that shows up as back pain, a heparin drip with an aPTT of 104 and platelets halved (hold, HIT, argatroban, and the heparin flush is heparin too), and a QTc creeping up from low K and Mg plus citalopram and ondansetron, ending in torsades if missed. Telemetry strips on the room monitor, transfers to CCU and IR, review page `/review/stepdown-6e-1/`. `tests/stepdown.py`: a careful run gets four good outcomes; skipping ahead gets four bad ones.
- **NCLEX-style practice questions** (`src/ngn.js`). Three after every debrief, one per shift for each of bowtie, matrix, select-all, highlight and drop-down, built from that shift's patients. Scored the NCSBN way (0/1 for bowtie, matrix and drop-down; +/- for select-all and highlight). Results save to the profile and, signed in, to the instructor's dashboard. `tests/ngn.py` checks every item's key scores full marks.
- **The shift pack** (`config.pack`, off by default). Three shifts free (Days on 4 West, Evenings on 4 West, Days on 3 East); the other four, and every shift added later, unlock with one payment. Locked shifts still show on the schedule and can be previewed; starting one offers the pack. Buying needs an account, so the purchase follows the player to every device. Payment is a Stripe Payment Link; `supabase/functions/stripe-webhook` checks Stripe's signature and records the purchase (and removes it on a refund). A class can carry a school license (`classes.pack`), which unlocks every shift for its students. `tests/pack.py` covers all of it with a stand-in for Stripe and Supabase.
- Privacy page: what an instructor can see, and that Stripe handles payment.
- `tests/teach.py`, `tests/pack.py` and a shared Supabase stand-in (`tests/standin.py`) that applies the same row level security as the SQL. Full suite clean.

### Needs Nick
1. **Supabase → SQL Editor:** run `supabase/classes-and-pack.sql` (safe to run again).
2. **Supabase → Authentication → URL Configuration → Redirect URLs:** add `https://the-shift-claude-rework.vercel.app/teach/` (the preview wildcard already covers previews).
3. **Try it:** open `/teach/`, make a class, then join it from the game on your phone with a different email and play a shift.
4. **The shift pack**, when you want to charge (Stripe test mode first):
   - Stripe → Product catalog: add "The Shift: shift pack", one-time price. Then Payment Links → New, after payment "Don't show confirmation page" → redirect to `https://the-shift-claude-rework.vercel.app/play/?pack=thanks`.
   - Install the Supabase CLI, then `supabase link --project-ref omcorltahsnnmpifefpm`, `supabase functions deploy stripe-webhook --no-verify-jwt`, and `supabase secrets set STRIPE_SECRET_KEY=sk_test_... STRIPE_WEBHOOK_SECRET=whsec_...`. The Stripe keys and the Supabase service role key stay there: never in `src/`.
   - Stripe → Developers → Webhooks: endpoint `https://omcorltahsnnmpifefpm.supabase.co/functions/v1/stripe-webhook`, events `checkout.session.completed` and `charge.refunded`. Copy its signing secret into the `STRIPE_WEBHOOK_SECRET` above.
   - In `src/config.js`: set `pack.checkoutUrl` to the Payment Link, set `price`, pick the free shifts, set `on: true`, rebuild, commit.
   - School license: in the Table Editor, set `pack` to true on that school's class.
5. Clinical review of Shift 7 and the 21 practice questions (each has a rationale on its answer screen).
6. Merge `next-four` (it includes `house-style`): https://github.com/nforell/TheShiftClaudeRework/compare/main...next-four

### Up next
1. L&D/postpartum, ED triage and an LPN-scope shift (toward 12–15 for the pack).
2. More practice questions per shift, and a practice-only mode from the home screen.
3. Instructor extras when someone asks: assign a shift with a due date, compare two classes.

## Session 8 — October 1, 2026 (branch `house-style`, built on `visual-polish`)

Goal: stop the game from looking AI-made. The direction: make it look like a hospital, not like an app.

### Done
- **Color.** Off the sage-and-teal default. Institutional off-white walls and paper, scrub navy for actions, and color only where hospitals use it: red for allergies, purple for code status, wristband yellow for warnings and the report highlighter. Night shift (dark theme) to match. Room walls warmed to hospital beige.
- **Type.** Atkinson Hyperlegible (built for low-vision readers; slashed zeros like a chart) for text, its mono for vitals and chart values, Barlow Condensed for anything that's a sign (the logo plate, clocks, room numbers, headings), and Kalam handwriting only for things a nurse writes. Squarer corners, fewer shadows, form-style labels instead of tracked-out tiny caps.
- **Hospital things instead of cards.** The report sidebar is a printed brain sheet with your flags in pen and a highlighter on report lines. The chart is an EHR: dark patient banner with allergy/code/weight tags and an MRN, file-folder tabs, dense mono tables. The room whiteboard is written in marker with your aide's name. The station assignment is the unit whiteboard with red magnets for your priority order. The home screen's shift list is a schedule, not a grid of cards. New app icon and favicon (a clock at 07:00) instead of the generic heartbeat line; the intro's heartbeat line is gone.
- **Copy pass.** Shift names are what units call them ("Days on 4 West", "Evenings on 5 South") instead of poetic titles. Rewrote every shift's home-screen and intro text in plain nurse voice. Cut most of the narrator "Nobody…" lines (patient dialogue kept), repeated aphorisms, and middle-dot separators in prose. Shift goals renamed plainly (Everyone seen, Meds on time, Call lights answered, Report given).
- **Debrief.** XP breakdown folded into "Where it came from"; one note about patients you didn't get to know instead of the same boilerplate under every patient; story boxes are plain, not pink.
- **Home.** XP, level and badges collapsed into one line (badges still in Achievements).
- **Phone messages** are smaller and no longer cover the Chart button.
- **Landing page rebuilt**: left-aligned, a "Why I made this" note from Nick on a brain sheet (with a slot for a photo at `site/assets/nick.jpg`), a timeline of a shift instead of feature cards, the shift schedule, no scroll animations. Screenshots regenerated from the current build with `tools/screenshots.py`. Privacy and review pages match.
- Full suite clean.

### Needs Nick
- **Rewrite "Why I made this" on the landing page in your own words** (`site/index.html`, section `#nick`). I kept it to facts you've told me; it should sound like you.
- **Add a photo**: save it as `site/assets/nick.jpg` (portrait, about 400×480) and rebuild. Until then the slot hides itself.
- Merge `house-style` (includes `visual-polish` and everything before it).
- Art, when you're ready: an illustrator for the cast and a few props would be the next biggest step. The rig can animate their designs.

## Session 7 — October 1, 2026 (branch `visual-polish`, built on `teen-psych-shift`)

### Done
- **Room lighting** (`src/art.js`): every room now has a warm ceiling light and a soft glow behind the bed, a wall gradient, a colored wall band per unit (teal med-surg, warm sand psych, sunny peds), a floor sheen, and something on the wall: a "Your care team" whiteboard on med-surg and peds, a painted mural on psych (nothing that can be pulled down). Night shifts keep the patient lit and only darken the edges, instead of a navy veil over everything. Lighter vignette. Dark theme room colors lifted so rooms read as dimly lit, not black.
- **Characters** (`src/rig.js`, app-wide): soft light-from-above shading on faces and clothes, hairline and chin shadows, softer blush, iris rings, eyelid creases, nose highlight and nostrils, inner-ear shading, a hair shine. Animation: the head turns slightly toward where they're looking, lids follow the gaze down, tiny eye movements, and occasional small smiles or raised brows when a patient is comfortable.
- Full suite clean.

### Needs Nick
- Merge `visual-polish` (includes everything since `clinical-review`): https://github.com/nforell/TheShiftClaudeRework/compare/main...visual-polish

## Session 6 — October 1, 2026 (branch `teen-psych-shift`, built on `psych-law-setting`)

### Done
- **New shift: Group chat** (Specialty: Teen psych, 4 North, 15:00–20:00). `src/case-adolpsych1.js`, `src/stories/adolpsych1.js`.
  - 401 Ella, 15: anorexia, refeeding day 4. Phosphorus, potassium and magnesium all under the call thresholds at 16:00; replace, keep feeding, recheck at 19:00. Blind weights, supervised dinner and the hour after, compensatory exercise.
  - 403 Jordan, 16, they/them: self-harm precautions, a skin check day shift missed, fresh cuts after a call with dad, a plastic shard in a shoe, peer contagion in the dayroom, and a call from dad where you must not out them.
  - 405 Jaylen, 14: acute dystonia an hour after his first-ever haloperidol, called "faking" by staff. Diphenhydramine IM, airway check, reassess, report; untreated, it reaches his airway.
  - 407 Kayla, 16: asks you to promise secrecy, then discloses abuse by her mom's partner, who is on tonight's visitor list. Mandated report yourself, change the visitor list, don't tip him off.
  - 409 Eli, 17 (admission at 15:45): "medically cleared" with no acetaminophen level; an empty bottle in his hoodie, and he told Jordan. Ask directly, stat labs, call back with results, transfer for N-acetylcysteine. The admission order set's acetaminophen PRN is a trap.
  - Five things score **Evaluate outcomes** (recheck, reassess, follow-up on results, check back after a report, recheck wounds and the coping plan).
  - Wired everywhere: home screen, landing page (six shifts), clinical review page `/review/psych-4n-1/`, transfer follow-ups, oncoming nurse (Marco), psych-law General US wording (adds 5585). New `tests/teen.py` plays it twice: a careful run gets all five good outcomes and Evaluate outcomes 100; a run that only skips ahead sees every emergency happen. Full suite clean.

### Needs Nick
- Play it once as a psych RN and use **Report a problem** on anything that rings false. Then send `/review/psych-4n-1/` to an adolescent psych nurse.
- The content leans on California law for minors (parent-consent admissions, 5585 holds, 36-hour written CPS report). The General US setting covers the hold wording.

### Up next
1. Telemetry/step-down shift (A-fib with RVR, heparin titration, post-cath bleed).
2. L&D/postpartum, ED triage, LPN-scope shift.

## Session 5 — October 1, 2026 (branch `psych-law-setting`, built on `guided-first-room`)

### Done
- **Psych law setting.** Settings → Psych law: **California** (default, the original wording) or **General US**, which swaps 5150, 5250, Riese, LPS and California-only lines for plain terms that hold in most states (72-hour involuntary hold, extended involuntary certification, petition for court-ordered medication, mental health conservatorship; the peds mandated-report deadline becomes "varies by state"). It's applied at display time, so the content stays written once and the clinical review pages keep the California source. New `tests/law.py` checks every California-specific string and plays the psych shift in both modes.

### Needs Nick
- Sanity-check the General US wording as a psych RN; it's in `src/ui.js` under `LAW`.


## Session 4 — October 1, 2026 (branch `guided-first-room`)

`clinical-review` merged to `main` and live.

### Done
- **Guided first room.** The first time a player walks into a room, a seven-step tour has them do it, not read about it: look at the patient (free, no clock), open Assess, take vitals (see the minutes it costs), read their findings against report, open the chart, then a pointer to care/meds/talk and Nova. "Do it" steps advance only when the player does the action; Skip tour ends it for good. Telemetry: `tour_start`, `tour_step`, `tour_done`, `tour_skip`, so PostHog shows where new players drop out. New `tests/guide.py` (phone and desktop). Full suite clean (it now takes about 6 minutes).

### Needs Nick
- To see the tour yourself: Menu → Settings → Intro and tips → Show them again, then start a shift.

## Session 4 — October 1, 2026 (branch `pacing-pass`)

### Done
- **Pacing and forgiveness.** Missed scheduled doses fold into one lesson per patient (−2 for one, −3 for two, −4 for three or more) instead of −2 each. In each skill (and each NCLEX step), misses past the first three points count half, so one bad stretch doesn't zero a domain. Later doses in the same med pass take 2 minutes, not 5. The shift assessment goes overdue at the same time as the "Everyone seen" goal (90 minutes), not at 60.
- **Stuck players.** Station headline is now "Work waiting in N rooms" with the task count and overdue count underneath, instead of a big "15 things need you". Pharmacy-held doses never sit at the top of the list and say what they're waiting on; the med sheet names the action that unblocks them. Tasks a case didn't route to a tab are now routed by matching the action, and the action is highlighted when you arrive. A 45-second idle pointer (station and room). Free Nova check-ins when you fall behind (max two, don't use tips, don't affect the Solo badge). A caught-up station suggests who to look at next. Skip-ahead no longer calls a half hour "quiet" when work is overdue.
- **UI.** Triage card: "Show report" no longer runs into the diagnosis; a wrong first pick reads amber, not red. Debrief no longer says you "ended early" when you ended in the last 30 minutes (when the End shift button appears). Larger tap area on the logo/menu button.
- New `tests/pacing.py` (every shift); in `run_all.py` and CI.

### Needs Nick
- Play Days on 4 West once on your phone and see if the 09:00 med pass still feels like too much for an Orientation shift. If it does, the next lever is moving a few 09:00 meds to 10:00 in the case file.

## Session 3 — October 1, 2026 (branch `clinical-review`)

Sessions 1–2 merged to `main` (PR #1) and live.

### Done
- **Clinical review workflow** (`src/review.js`, `site/review.html`, `tools/decisions.py`, guide in `docs/CLINICAL-REVIEW.md`).
  - `/review/` and `/review/<shift>/`: a reviewer checklist with every patient (history, report, labs, meds, orders), every scored decision (points, skill, NCLEX step, rationale, source line), the unit's floor calls, and Accurate / Needs change / Not sure with comments. Drafts save in the reviewer's browser. Submissions go to PostHog as `feedback` with `kind = clinical_review` (email fallback), stamped with the shift's content version.
  - Each shift has a content hash computed at build time. The game shows **Awaiting clinical review**, **Clinically reviewed** (with reviewer names and references), or **Updated since its last review** if content changed after sign-off. Entry points: home screen footer and Menu → Clinical review.
  - New `tests/review.py`; full suite clean.

### Needs Nick
- Recruit reviewers (table in `docs/CLINICAL-REVIEW.md`) and send them `https://the-shift-claude-rework.vercel.app/review/<shift>/`. You're a credentialed psych RN, so you could review Quiet voices yourself, but an outside reviewer carries more weight with schools.
- Reviews only arrive in PostHog once the PostHog key is in `src/config.js`; until then they come by email.



## Session 2 — September 30, 2026 (same branch)

### Done
- **Accounts and cloud saves** (`src/cloud.js`, `supabase/schema.sql`). Email-link sign-in, no passwords. Progress and the shift in progress sync to one row per player in Supabase, with row level security. Signing in on a second device merges both devices' progress (nothing earned is lost); a new device can resume a shift started elsewhere. Sessions refresh themselves; an expired link explains itself. Entry points: "Save your progress" on the home screen and in the menu. Privacy page updated. New `tests/cloud.py` (against a stand-in for Supabase's API; the build sandbox can't reach Supabase itself).
- Supabase project: `omcorltahsnnmpifefpm`, schema run by Nick.
- Redirect URLs set (`https://the-shift-claude-rework.vercel.app/play/` and `https://the-shift-claude-rework-*.vercel.app/**`). Nick signed in on the preview with an email link on September 30: real sign-in works.

### Needs Nick
- Before inviting testers to sign in: Supabase's built-in email sender only delivers to the Supabase team. Set up a real sender and the branded templates (docs/EMAIL-SETUP.md).
- Still worth doing once: sign in on a second device and check your shifts appear there.

### Up next
Clinical review workflow, then the guided first room (see the list below; item 1 is done).

## Session 1 — September 30, 2026 (branch `beta-instrumentation`)

### Done
1. **Analytics** (`src/telemetry.js`, `src/config.js`). Anonymous install id, batched events to PostHog, opt-out in Settings, Do Not Track and Global Privacy Control honored, never sends from a local file. Events: `app_open`, `shift_start`, `shift_resume`, `report_done`, `triage_ranked`, `shift_complete` (score, stars, minutes, misses, hints), `shift_left` (the screen a player quit on), `error`, `install_prompt`, `app_installed`, `debrief_steps_view`, `landing_view`, `beta_signup`, `feedback`. Every event carries the campaign that first brought the player (`first_source`, `first_campaign` from utm tags or the referrer). Settings → Health check shows the last events and whether sending is on.
2. **In-game feedback.** A two-question card at the end of every debrief (anything clinically off; would you pay), a **Report a problem** link on every decision in the debrief, and **Send feedback or report a problem** in the menu. Without an analytics key, these open a prefilled email instead.
3. **Landing page.** Beta-list signup (email + role) tied to the player's anonymous id, so the list shows who actually played. New `/privacy/` page.
4. **Installable app.** Manifest, icons, network-first service worker (cache named by app version, so new builds reach players), works offline, install button in the menu, Add to Home Screen help on iPhone.
5. **NCLEX clinical judgment steps.** `src/cjmm.js` files every scored decision under one of the six CJMM steps. The debrief has a Skills / NCLEX steps toggle, and each moment is tagged with its step. `docs/cjmm-map.csv` lists all 478 decisions with their step for clinical review; regenerate with `node tools/cjmm_map.js`.
6. **Tests.** `tests/telemetry.py` (events, feedback, signup, opt-out, campaign attribution, no sending from a file) and `tests/pwa.py` (manifest, icons, service worker, offline). Both run in `tests/run_all.py` and CI. Full suite clean.

### Needs Nick
- **Turn on analytics:** create a free PostHog project (posthog.com, US cloud), copy the Project API key (`phc_…`) into `posthogKey` in `src/config.js`, run `python3 build.py`, commit. Until then nothing is sent and feedback goes to email.
- **Review `docs/cjmm-map.csv`.** The step assignments are rule-based. Any wrong row: add its key to `OVERRIDE` in `src/cjmm.js`.
- **Merge** `beta-instrumentation` into `main` after checking the Vercel preview.

### Found along the way
- Only 7 of 478 decisions score **Evaluate outcomes**. The game asks for reassessment (PRN follow-ups, rechecks) but rarely scores doing it well. New cases should score evaluation explicitly, and existing cases could add a few.
- The psych shift's legal framing (5150, 5250, Riese, LPS) is California-only.

### Up next (in order)
1. Accounts and cloud saves (needs a backend choice: Supabase is the simplest fit; requires Nick to create a project).
2. Clinical review workflow: reviewer sign-off per case, a references list per case, shown on a "Clinical review" page.
3. Guided first room (60 seconds) for pre-licensure students.
4. Jurisdiction setting for psych law (generic involuntary hold, with California as one version).
5. New shifts, toward 12–15 for a paid pack. Candidates: ICU step-down, L&D/postpartum, ED triage, a second psych shift (adolescent unit), LPN-scope shift. Each new case should score Evaluate outcomes.
6. Optional NGN-style items (bowtie, matrix) after the debrief.
