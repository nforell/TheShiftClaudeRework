# Pilot checklist

What has to be true before a nursing program (Johns Hopkins or another) puts students on The Shift. Built from the v0.6.8 beta audit (October 17, 2026). Everything here needs a person, a real device, a live account or a decision; the code-side items are done (progress log, Session 25, branch `pilot-prep`).

Work top to bottom. Each step says how to tell it passed.

## 1. Merge and deploy (30 min)

- [ ] Play the Vercel preview for **PR #39** (beta audit) and the pilot-prep PR on your phone: 4 West days, watch the sepsis order rise to the top around 07:37; close the tab on the debrief and reopen it (home offers "See your last debrief"); try a second PRN morphine on step-down (blocked).
- [ ] Play the **PR #37** preview (website): tap a shift card, the game opens with that shift picked.
- [ ] Merge #39, then pilot-prep, then #37 (any order works; that one is easiest). Confirm production is on the new build: open **/play/?health** and check the Version row.

## 2. Backend (45 min, once)

- [ ] **Supabase → SQL Editor:** run `supabase/schema.sql`, then `supabase/classes-and-pack.sql`. Both are safe to rerun. Passed when both say "Success. No rows returned". **Rerun `classes-and-pack.sql` after v0.7.0**: it adds `drill_results`. Until then, drill results wait on each student's device and nothing else breaks.
- [ ] **Supabase Pro** ($25/month). Free projects pause after a week idle and have no backups. Do this before students have data in it.
- [ ] **Sign-in email:** follow `docs/EMAIL-SETUP.md` (domain, Resend, custom SMTP, both templates, Site URL and Redirect URLs). Passed when a sign-in link to an address outside the Supabase team arrives within a minute, from your domain, and opens the game signed in.
- [ ] Optional: deploy `supabase/functions/notify`, then set `notify: true` in `src/config.js` so signups and problem reports reach your inbox.

## 3. Real devices (1 hour)

Use two phones you don't develop on: an iPhone (Safari) and an Android phone (Chrome).

- [ ] On each: open the site, play **Days on 4 West** from the walkthrough to the debrief. Lock the phone mid-walkthrough and come back (it should resume at the same step).
- [ ] On each: sign in from the game (**Menu → Your account**) using the emailed link. The link should open the game, signed in, not a Supabase page.
- [ ] Rotate the phone once mid-shift; try the triage drag; give a med with hold-to-give.
- [ ] Afterwards, **PostHog → Activity → Live events**: you should see `app_open`, `shift_start`, `shift_complete` from each phone, and no `error` events. Any `error` or `error_async` from these runs is a bug to fix before the pilot.
- [ ] Submit a beta signup on the landing page with a throwaway address; it should show in PostHog (`beta_signup`) within a minute.

## 4. End-to-end class test (30 min)

Use three throwaway email addresses: Instructor A, Instructor B, Student.

- [ ] Instructor A: **/teach/**, sign in, make a class. Note the code.
- [ ] Student: in the game, **Menu → Your class**, join with the code. Finish a short shift (Skip ahead is fine).
- [ ] Instructor A: the student and their result appear (Overview, Students, Most missed). CSV downloads and opens.
- [ ] Instructor B: sign in and make a different class. The student's result does **not** appear.
- [ ] Student: enter a wrong code 10 times; the 11th try (even the right code) says to wait an hour.
- [ ] Student: leave the class. Instructor A no longer sees the result after a refresh.
- [ ] Student: **Menu → Your account → Delete your account**. Instructor A's roster no longer shows them.

## 5. Content and legal (weeks; start now)

- [ ] **Specialty RN review** for every shift the pilot will use, at least. Send `docs/REVIEWER-GUIDE.md` with the `/review/<shift>/` link; record sign-offs in `src/review.js`. The audit's flagged questions are in the audit doc, section "Clinical content flagged".
- [ ] Keep "not clinically validated" on the site until those sign-offs are in.
- [ ] Lawyer review of `src/terms.json` and `site/privacy.html`.
- [ ] Ask the school whether its **IRB or FERPA office** needs to see the data flow (instructor sees the student's chosen name and results after joining). Send `docs/INSTRUCTOR-GUIDE.md` and the privacy page.

## 6. Decisions only you can make

- [ ] **Psych cue design.** Daniel's suicide risk (3 East) lives in conversation, not the task list, so a student who only follows the pointer can miss it. Keep it as a cue-recognition test, or add a soft prompt after handoff? Decide before students play 3 East or 4 North.
- [ ] **Pain call lights** now get a zero-point debrief note when no pain decision follows. Should that cost points? Ask the med-surg reviewer.
- [ ] **Which shifts the pilot uses.** Suggested: start everyone on Days on 4 West, then two or three more.
- [ ] **What counts as completion** for the pilot (shifts finished, a minimum score, debrief viewed). The dashboard shows finished shifts and scores per student; tell me if it needs a "completed" column.
- [ ] **Pricing / the shift pack** stays off (`config.pack.on: false`) for the pilot unless the school is paying for a license.

## 7. The week of the pilot

- [ ] Send the instructor `docs/INSTRUCTOR-GUIDE.md` and the class code invite.
- [ ] Check PostHog daily for `error` events and for where students stop (`shift_left`).
- [ ] Read every "Report a problem" and feedback note within a day.
