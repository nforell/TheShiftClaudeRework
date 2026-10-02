# Beta roadmap: progress log

Where the work from the business plan stands. Newest session first. The next session starts at **Up next**.

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
- **4 North, Marcus (14):** report now mentions it took three staff to hold him for the 14:30 haloperidol. The day RN's note charts the IM but not the hold as a restraint, has no face-to-face, and says nothing about his mom. Reviewing the record finds all three. Then: call Dr. Adeyemi for the face-to-face (due by 15:30; she charts it and warns it's his first antipsychotic), ask Ben, who was there, to chart the hold before he leaves (charting it yourself from report is scored as charting what you didn't witness), and call his mom (who mentions an uncle whose neck "locked up" on one of those). Missing any of it is scored at the end. The unit policy order spells out the minors' rules (2-hour orders for ages 9 to 17).
- New `tests/restraint.py` plays it five ways: Jasmine by the book with an IM, by the book with seclusion, with every shortcut (no observer, no face-to-face, a vague and false note with a coercive release), and Marcus caught or missed. `tests/teen.py` careful run updated. `docs/cjmm-map.csv` regenerated. Full suite clean.

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
  - 405 Marcus, 14: acute dystonia an hour after his first-ever haloperidol, called "faking" by staff. Diphenhydramine IM, airway check, reassess, report; untreated, it reaches his airway.
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
- Before inviting many testers: Supabase's built-in email sender is only for light testing and is heavily rate-limited. Connect a real email sender (Authentication → Emails → SMTP; Resend has a free tier) before a big beta push.
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
