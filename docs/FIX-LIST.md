# Fix list: November 2026 playtest sweep

Working list from the Nov 10 playtest (quick round, orientation, Shift 1 to debrief, phone size). Worked top to bottom on branch `fix/playtest-sweep`. Each fix is its own commit and is pushed when done, so this file is always the current state.

## How to pick this up

1. `git fetch origin fix/playtest-sweep && git checkout fix/playtest-sweep`
2. Read the status column below. The first row that isn't `done` is next. The "Progress" notes under a row say exactly where a partly done item stopped.
3. After each fix: `cd tools/minify && npm ci && cd ../.. && python3 build.py`, run the tests named in the row, tick the row here, commit (source + `dist/` + this file), push.
4. Before opening the pull request: `python3 tests/run_all.py` must end with `ALL CLEAN 0`.

Measuring the answer-length tell (item 5): `node tools/length_tell.js` prints, per drill, how often the right answer is the longest option. It is also enforced by `tests/drills.py`.

## The list

| # | Fix | Where | Status |
|---|---|---|---|
| 1 | **Next bar sends you into a penalty.** A repeated ordered check ("vitals every 15 min, 2 of 4") was offered as "Next here" up to 30 minutes early, and doing it within 8 minutes of the last set cost a point. Repeat checks now wait until 5 minutes before they're due, and a vitals set an order is asking for is never scored as a wasted repeat. Applies to every `A.watch` on every shift. | `src/flow.js` `watchRows`, `src/ui.js` `doAssess` | done |
| 2 | **Outcome ignores whether you escalated.** Mr. Ortiz's bradycardia read "resolving" whether or not the provider was ever told. | `src/case-medsurg1.js` | done (this patient) |
| 3 | **De-escalation ending contradicts the last line.** A round that finished on a line that worked could still end "hold and injection". | `src/drill.js` `outcomeLine` | done |
| 4 | **SBAR correction "no doses"** on a read-back whose model answer has no doses either. | `src/drills-content.js` | done |
| 5 | **The longest answer is the right one.** Start of sweep: SBAR 98%, De-escalation 95%, Med Pass "check first" 78%, Who's First 56% (chance is 25 to 33%). Rewrite wrong options so they are as long and as specific as the right one (a plausible but wrong detail, not padding), and trim right answers that over-explain. Target: 25 to 45% per drill (0% is a tell too: the right answer must sometimes be the longest), and right-to-wrong length ratio between 0.8 and 1.25. | `src/drills-content.js`, `src/drills-more-*.js`, `src/drills-nclex-*.js` | done |
| 6 | Same tell in the full shifts: in-shift SBAR recommendations, dialog choices, floor calls. Not measured yet: these use other shapes (`choices` with `judge`, SBAR `recs`), so `tools/length_tell_all.js` needs a reader for each before it can count them. Measure, then fix the worst files. | `src/case-*.js`, `src/floor*.js`, `src/stories/*.js` | todo |
| 7 | Same tell in NCLEX practice. Measured: the bank's 53 single-answer questions have the right answer longest 64% of the time (ratio 1.37). Not yet measured: case studies, challenge and focus items, and the select-all / matrix / bowtie formats (`tools/length_tell_all.js` only recognizes lists with one `ok` option; extend it per format before rewriting). | `src/ngn-*.js` | bank single-answer done (64% to 28%); other formats and files todo |
| 8 | **Outcome audit, every shift.** For each patient outcome with fixed wording after a player error, check it reads differently when the error was reported and treated versus never called (as item 2 did for one patient). | `src/case-*.js` `outcome()` | done: read all 70 mixed outcomes across the 11 shifts. The other ten already branch on whether the provider was called or the problem reported (`P.called`, `P.reported`); Mr. Ortiz was the only fixed line. No further changes |
| 9 | **Stale result banner.** The last assessment's result ("07:23 → 07:26 · +3 min …") stays at the top of the room tabs after later actions and after a provider call. Clear it on the next action or tab change. | `src/ui.js` | done: the banner goes when the clock moves on (a call, the next action) or on a tab change once it has been up 4 seconds |
| 10 | **Hover styles stick on touch screens.** 71 `:hover` rules, none behind `@media (hover: hover)`; in the phone emulator an answer card under the last tap looks pre-selected. Wrap them. Check on a real phone. | `src/styles.css` | done: all 80 hover selectors apply only under `html.hov`, set at start-up when the device has a real pointer (zero added specificity, via `:where`). Checked in a touch emulator and on desktop; still worth a look on a real phone |
| 11 | **Small art and label fixes.** Newborns drawn with a full head of adult hair (Baby Ito, Baby Cole); SBAR step labels ("Background", "Recommendation") render about 7px on a phone; long patient names wrap in the station list. | `src/drills-*.js`, `src/rig.js`, `src/styles.css` | SBAR step labels done (on a phone only the current step shows its name, at a readable size). Newborns already use the shortest hair the face rig has, so that waits for commissioned art. Station names no longer wrap after item 13 |
| 12 | **Debrief is about 14 phone screens.** Keep on the first view: score, the decision that mattered, best call, each patient's outcome and story, and the three next buttons. Fold the rest (XP, level, badges, medals, lesson log, goals, both score breakdowns) behind one "More from this shift" disclosure. | `src/ui.js` debrief | done: phone debrief went from about 12,400px to 3,800px. First view keeps score, key decision, best call, outcomes and stories, next buttons and the NCLEX card; score working, skills, moments, XP and lessons open from "More from this shift" |
| 13 | **Station is busy on a phone.** Proposal: Next card, skip ahead and the patient list stay; goals, "Everything due", unit phone and the aide/doctor rows fold into the header buttons that already exist for them. | `src/ui.js` station | done: goals fold to one line ("Shift goals, 1 of 4 done") on every screen size; on a phone the side panel shows only unanswered messages and the first-run intro text is gone. "Everything due" was already folded. Ask-aide and call-doctor buttons stay (the header has no call button) |
| 14 | **Room has six tabs and nine assessments.** Proposal: lead with "Full head-to-toe" and "Vital signs", fold the single systems under "Focused assessment". | `src/ui.js` room | done: Assess leads with Vital signs and Full head-to-toe; the seven single systems sit under "Focused assessment", which opens when the Next bar points into it and stays open once one is used on that patient. The six tabs are unchanged |
| 15 | **First run.** The terms sheet is the first thing a new player sees, and the orientation is eight steps with a long first bubble. Proposal: show terms when Play is first tapped (not on load), cut the first orientation bubble to two sentences. Terms wording itself needs a lawyer, not an edit. | `src/ui.js`, `src/orient.js` | done: the agreement now appears on the first tap that starts something (and still can't be dismissed without agreeing; an outdated agreement asks again the same way), then carries on to what was tapped. The orientation's first bubble went from six sentences to two. Terms wording untouched |
| 17 | **Duplicate option.** Med Pass card `mp-pcn` offered "Temperature" twice. Replaced one; add a duplicate-option check to `tests/drills.py` with the item 5 threshold. | `src/drills-content.js` | done |
| 16 | **Clinical sign-offs.** `src/review.js` and `src/review-items.json` have no reviewers: all 11 shifts and every practice item show "Awaiting clinical review". Not a code fix. Everything rewritten under items 5 to 8 changes content, so reviewers should get the links after this branch merges. | Nick, reviewers | open |

## Where this stopped (Nov 12)

Done, built, tested and pushed: items 1 to 5, 9, 10, 12 to 15, 17, and the bank's single-answer questions from item 7. `python3 tests/run_all.py` ended `ALL CLEAN 0` on the commit "First run: terms on first tap"; the two commits after it were checked with ngn, practice, review, terms, safari and a Shift 1 sweep.

Also done since: items 8 and 11.

Left: the rest of item 7 (extend `tools/length_tell_all.js` to case studies, challenge and focus items, then rewrite the worst) and item 6 (full-shift dialogs and SBAR recommendations; needs a reader for those shapes first). Then run the full suite and open the pull request. Item 16 (nurse sign-offs) is Nick's.

## Progress notes

### Item 5 (answer length), by file

Order: SBAR, then De-escalation, then Med Pass checks, then Who's First, file by file. Tick each when its lists are rewritten and `node tools/length_tell.js` shows the file inside target.

- [x] `src/drills-content.js`: sbar
- [x] `src/drills-content.js`: calm
- [x] `src/drills-content.js`: med (check lists), first (now: check 35%, sbar 28%, calm 34%, first 33%)
- [x] `src/drills-more-1.js` (check 35%, first 29%; give/hold/call picks 55%, left as is)
- [x] `src/drills-more-2.js` (now: sbar 38%, calm 44%)
- [x] `src/drills-nclex-1.js`
- [x] `src/drills-nclex-2.js` (now: sbar 35%, calm about 38%)
- [x] any other `src/drills-*.js` (none)
- [x] threshold added to `tests/drills.py` (20 to 50% longest, ratio 0.75 to 1.35, no repeated option)
- [x] `docs/DRILLS-REVIEW.md` regenerated (`node tools/drills_doc.js`)

End state, all drills: Med Pass checks 34%, give/hold/call 32%, Who's First 33%, SBAR 33%, De-escalation 39%. About 430 wrong options were lengthened; no right answer, id or explanation logic changed except four `w` lines that had to follow their option. **These rewrites are new clinical wording and need the same nurse review as the rest (item 16).**

How the rewrites are applied: write a JSON list of `[old text, new text]` pairs (or `[old, new, card id]` for short labels that repeat) and run `python3 tools/apply_rewrites.py src/<file>.js patch.json`. It refuses to write unless every pair matches exactly once, so nothing is half-applied. To see every option with its length: the lists print from `window.Shift.drillData` (see `tools/length_tell.js` for how the files are loaded).

Writing rules for the rewrites: a wrong option stays something a nurse might really say or do; it gets longer by adding a specific that is wrong or beside the point (a real vital sign that isn't the worrying one, a plausible but late plan), never filler. Its `w` explanation must still be true of the new wording. Don't change which option is right, ids, or anything the face/vitals read.
