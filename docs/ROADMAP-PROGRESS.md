# Beta roadmap: progress log

Where the work from the business plan stands. Newest session first. The next session starts at **Up next**.

## Session 2 — September 30, 2026 (same branch)

### Done
- **Accounts and cloud saves** (`src/cloud.js`, `supabase/schema.sql`). Email-link sign-in, no passwords. Progress and the shift in progress sync to one row per player in Supabase, with row level security. Signing in on a second device merges both devices' progress (nothing earned is lost); a new device can resume a shift started elsewhere. Sessions refresh themselves; an expired link explains itself. Entry points: "Save your progress" on the home screen and in the menu. Privacy page updated. New `tests/cloud.py` (against a stand-in for Supabase's API; the build sandbox can't reach Supabase itself).
- Supabase project: `omcorltahsnnmpifefpm`, schema run by Nick.

### Needs Nick
- In Supabase → Authentication → URL Configuration: Site URL = the live game address; Redirect URLs include `<live address>/play/` and the branch preview URL with `/**`.
- Before inviting many testers: Supabase's built-in email sender is only for light testing and is heavily rate-limited. Connect a real email sender (Authentication → Emails → SMTP; Resend has a free tier) before a big beta push.
- First real test: open the Vercel preview on your phone, Save your progress, tap the emailed link, then sign in on your laptop and check your shifts appear.

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
