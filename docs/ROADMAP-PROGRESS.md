# Beta roadmap: progress log

Where the work from the business plan stands. Newest session first. The next session starts at **Up next**.

## Session 3 — October 1, 2026 (branch `clinical-review`)

Sessions 1–2 merged to `main` (PR #1) and live.

### Done
- **Clinical review workflow** (`src/review.js`, `site/review.html`, `tools/decisions.py`, guide in `docs/CLINICAL-REVIEW.md`).
  - `/review/` and `/review/<shift>/`: a reviewer checklist with every patient (history, report, labs, meds, orders), every scored decision (points, skill, NCLEX step, rationale, source line), the unit's floor calls, and Accurate / Needs change / Not sure with comments. Drafts save in the reviewer's browser. Submissions go to PostHog as `feedback` with `kind = clinical_review` (email fallback), stamped with the shift's content version.
  - Each shift has a content hash computed at build time. The game shows **Awaiting clinical review**, **Clinically reviewed** (with reviewer names and references), or **Updated since its last review** if content changed after sign-off. Entry points: home screen footer and Menu → Clinical review.
  - New `tests/review.py`; full suite clean.

### Needs Nick
- Recruit reviewers (table in `docs/CLINICAL-REVIEW.md`) and send them `https://the-shift-claude-rework.vercel.app/review/<shift>/`. You're a credentialed psych RN, so you could review Quiet voices yourself, but an outside reviewer carries more weight with schools.
- Merge `clinical-review`: https://github.com/nforell/TheShiftClaudeRework/compare/main...clinical-review
- Reviews only arrive in PostHog once the PostHog key is in `src/config.js`; until then they come by email.

### Up next
1. Guided first room (60 seconds) for pre-licensure students.
2. Jurisdiction setting for psych law.
3. New shifts that score Evaluate outcomes.

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
