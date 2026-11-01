# The feedback loop

Students play → they tap three answers at the debrief (or "Report a problem" on any decision) → every note lands as a row in Supabase → you export one CSV → Claude turns it into fixes.

## One-time setup (5 minutes)

1. Supabase → **SQL Editor** → New query → paste all of `supabase/feedback.sql` → **Run**. Passed when it says "Success. No rows returned".
2. Merge the PR. Vercel redeploys on its own.
3. Test it: play any shift on your phone, skip to the debrief, tap one answer, send. In Supabase → **Table Editor → feedback**, your row is there.

Players can only add rows. Nobody can read them with the game's key, only you in the dashboard.

## What each row holds

| Column | What it is |
|---|---|
| `kind` | `debrief` (end-of-shift survey), `decision` (reported a scored decision), `question` (an NCLEX item), `general`, `clinical_review` |
| `shift` | Which shift, e.g. `medsurg-4w-1` |
| `difficulty` | `easy` / `right` / `hard` |
| `helps_nclex` | `yes` / `some` / `no` |
| `would_pay` | `yes` / `maybe` / `no` |
| `problem` | For reports: `clinical`, `unclear`, `scoring`, `bug`, `other` |
| `note` | What they typed |
| `score` | Their shift score |
| `source` | Where they came from (the `utm_source` on the link you shared) |
| `install_id` | Anonymous player id: same id = same person |
| `details` | Everything else (the decision text, question stem, minutes into the shift) |
| `status` | Yours to set: `new`, `fixed`, `wontfix`, `later` |

## Every few days: hand it to Claude

1. Supabase → **Table Editor → feedback** → **Export → Export table as CSV**. (Or, quick look first: SQL Editor → `select * from public.feedback_summary;`.)
2. In the Claude app, start a chat, attach the CSV, and paste:

> Here's the latest feedback export for The Shift (repo nforell/TheShiftClaudeRework). Only look at rows with status `new`.
> 1. Give me a one-screen summary: how many players, per-shift difficulty / NCLEX-help / would-pay counts, and the 3 things players most clearly want.
> 2. Sort every note into: clinical error, confusing, scoring, bug, request, praise. Quote the note and the shift.
> 3. For clinical errors, tell me what you think is wrong and what the fix is, but flag anything I should confirm with a reviewer before changing.
> 4. Propose a short list of changes, smallest and highest-value first. Then make the ones I approve in a PR, with tests.
> 5. Give me the SQL to mark the rows you handled as `fixed` or `later`.

3. After the PR merges, run the SQL Claude gives you, so next export only shows what's new.

## Reading it yourself

- **Too hard** clustered on one shift → its pacing or cues, not the student.
- **NCLEX: not really** → the debrief isn't connecting decisions to the six NGN steps for that shift.
- **Would pay: yes** with a note → those are the people to email first when the shift pack goes live.
- Same `install_id` across several shifts → a real repeat player. Their notes count double.
- `source` tells you which post or class link actually brought people who finished a shift.
