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
| 5 | **The longest answer is the right one.** Start of sweep: SBAR 98%, De-escalation 95%, Med Pass "check first" 78%, Who's First 56% (chance is 25 to 33%). Rewrite wrong options so they are as long and as specific as the right one (a plausible but wrong detail, not padding), and trim right answers that over-explain. Target: under 45% per drill, and right-to-wrong length ratio between 0.8 and 1.25. | `src/drills-content.js`, `src/drills-more-*.js`, `src/drills-nclex-*.js` | **in progress** |
| 6 | Same tell in the full shifts: in-shift SBAR recommendations and dialog choices. Measure first, then fix the worst. | `src/case-*.js`, `src/stories/*.js` | todo |
| 7 | Same tell in NCLEX practice (bank, case studies, challenge and focus items). Measure first. | `src/ngn-*.js` | todo |
| 8 | **Outcome audit, every shift.** For each patient outcome with fixed wording after a player error, check it reads differently when the error was reported and treated versus never called (as item 2 did for one patient). | `src/case-*.js` `outcome()` | todo |
| 9 | **Stale result banner.** The last assessment's result ("07:23 → 07:26 · +3 min …") stays at the top of the room tabs after later actions and after a provider call. Clear it on the next action or tab change. | `src/ui.js` | todo |
| 10 | **Hover styles stick on touch screens.** 71 `:hover` rules, none behind `@media (hover: hover)`; in the phone emulator an answer card under the last tap looks pre-selected. Wrap them. Check on a real phone. | `src/styles.css` | todo |
| 11 | **Small art and label fixes.** Newborns drawn with a full head of adult hair (Baby Ito, Baby Cole); SBAR step labels ("Background", "Recommendation") render about 7px on a phone; long patient names wrap in the station list. | `src/drills-*.js`, `src/rig.js`, `src/styles.css` | todo |
| 12 | **Debrief is about 14 phone screens.** Keep on the first view: score, the decision that mattered, best call, each patient's outcome and story, and the three next buttons. Fold the rest (XP, level, badges, medals, lesson log, goals, both score breakdowns) behind one "More from this shift" disclosure. | `src/ui.js` debrief | todo, **needs Nick's OK on what folds** |
| 13 | **Station is busy on a phone.** Proposal: Next card, skip ahead and the patient list stay; goals, "Everything due", unit phone and the aide/doctor rows fold into the header buttons that already exist for them. | `src/ui.js` station | todo, **needs Nick's OK** |
| 14 | **Room has six tabs and nine assessments.** Proposal: lead with "Full head-to-toe" and "Vital signs", fold the single systems under "Focused assessment". | `src/ui.js` room | todo, **needs Nick's OK** |
| 15 | **First run.** The terms sheet is the first thing a new player sees, and the orientation is eight steps with a long first bubble. Proposal: show terms when Play is first tapped (not on load), cut the first orientation bubble to two sentences. Terms wording itself needs a lawyer, not an edit. | `src/ui.js`, `src/orient.js` | todo, **needs Nick's OK** |
| 16 | **Clinical sign-offs.** `src/review.js` and `src/review-items.json` have no reviewers: all 11 shifts and every practice item show "Awaiting clinical review". Not a code fix. Everything rewritten under items 5 to 8 changes content, so reviewers should get the links after this branch merges. | Nick, reviewers | open |

## Progress notes

### Item 5 (answer length), by file

Order: SBAR, then De-escalation, then Med Pass checks, then Who's First, file by file. Tick each when its lists are rewritten and `node tools/length_tell.js` shows the file inside target.

- [ ] `src/drills-content.js`: sbar
- [ ] `src/drills-content.js`: calm
- [ ] `src/drills-content.js`: med (check lists), first
- [ ] `src/drills-more-1.js`
- [ ] `src/drills-more-2.js`
- [ ] `src/drills-nclex-1.js`
- [ ] `src/drills-nclex-2.js`
- [ ] any other `src/drills-*.js`
- [ ] threshold added to `tests/drills.py`
- [ ] `docs/DRILLS-REVIEW.md` regenerated (`node tools/drills_doc.js`)

Writing rules for the rewrites: a wrong option stays something a nurse might really say or do; it gets longer by adding a specific that is wrong or beside the point (a real vital sign that isn't the worrying one, a plausible but late plan), never filler. Its `w` explanation must still be true of the new wording. Don't change which option is right, ids, or anything the face/vitals read.
