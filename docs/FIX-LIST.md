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
| 6 | **Same tell in the full shifts, and it is worse.** Measured with `python3 tools/length_tell_dialogs.py` (add `-v` for the worst lines): across 141 in-shift conversations the best-scored reply is the longest 90% of the time, usually 2 to 7 times longer than the others. Bedside conversations in the case files are 100% (42 of 42); floor calls 97% (35 of 36); patient stories 60 to 100%. Fix order: `src/floor.js` first (those calls appear on every shift), then the case files, then stories. Same writing rules as item 5; target 25 to 45%. About 280 wrong replies to lengthen, plus some best replies to trim. | `src/floor.js`, `src/floor-more.js`, `src/case-*.js`, `src/stories/*.js` | done: across all 141 in-shift conversations the best reply is the longest 31% of the time (was 90%). Floor calls 33%, bedside conversations 31%, stories 30%. `tests/drills.py` now fails if this leaves 20 to 45% |
| 7 | Same tell in NCLEX practice. Measured: the bank's 53 single-answer questions have the right answer longest 64% of the time (ratio 1.37). Not yet measured: case studies, challenge and focus items, and the select-all / matrix / bowtie formats (`tools/length_tell_all.js` only recognizes lists with one `ok` option; extend it per format before rewriting). | `src/ngn-*.js` | done: single-answer questions 64% to 28%; dropdowns 57% to 32% (bank 41%, case studies 23%, focus 29%). Answer position is not a tell (options are shuffled per item at run time). Left as is: select-all right options average 1.15 to 1.36 times the length of wrong ones, which is mild; matrix, highlight, ordering and bowtie have no length tell. Measure with `python3 tools/length_tell_ngn.py` |
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

## Where this stopped (Nov 12, second branch)

The first branch was merged to main as pull request #55. This branch, `fix/playtest-sweep-2`, finishes item 6 (every in-shift conversation) and item 7 (NCLEX dropdowns).

`python3 tests/run_all.py` ended `ALL CLEAN 0` on the commit "Patient stories: best reply no longer the longest by default"; the dropdown rewrite after it was checked with ngn, practice, review and drills.

Left: newborn art (item 11, waits for commissioned art), and nurse sign-offs (item 16, Nick's; reviewers should see the wording changed in items 5 to 7).

To list any file's conversations with lengths, adapt `tools/length_tell_dialogs.py -v`; to apply reviewed rewrites, `tools/apply_rewrites.py`.

## Tester feedback, Nov 12 (fresh player, live site, Shift 1, 78/100)

Branch `fix/tester-feedback`. Each row was checked against the code before changing anything.

| # | Report | What was actually wrong | Status |
|---|---|---|---|
| T1 | Floor call missed inside a dialog, still docked 0.5 | Calls arrived only as a toast, and toasts hide while any dialog is open. | done: a waiting call now has its own bar at the top of the station and every room, with minutes left, until answered. A call is only scored as missed if that bar was actually on screen (`q.shown`); the toast is dropped in favor of the bar. Applies to every shift |
| T2a | "You didn't get to know any of your patients" after talking to all of them | The note counted only "Sit and talk" story beats, but trust also rises from ordinary conversations and call lights. | done: note shows only for patients with no story beat and no trust, and says what it means ("sit and talk") |
| T2b | "You didn't reassess Mr. Bell" though the task list says "Done by you" | Two rules: the task list accepted any assessment 20+ min after the dose, the score needed a pain check 25 to 100 min after. A check at 20 to 24 min was done in one and missing in the other. | done: scoring uses the task list's rule. Only Shift 1 had its own rule; the other shifts use the shared one |
| T2c | "cues during handoff" (it was report) | Wording, in all 11 shifts. | done: "during report" |
| T3 | Walkthrough pre-answers Shift 1 (its sepsis case is Mrs. Whitfield with the names changed) | True: orientation's Mrs. Alvarez has confusion, fever, lactate 4.2 and an unhung ceftriaxone. | done (Nick chose a new teaching case): Mrs. Alvarez is now a GI bleed on a blood thinner two days after a hip repair (black stools, rising heart rate, dizzy sitting up, enoxaparin due, critical hemoglobin 7.4), so the walkthrough no longer rehearses Mrs. Whitfield's sepsis. Mr. Ostrowski's hold decision was Mr. Ortiz's exact puzzle too (metoprolol, pulse under 55), so it is now digoxin in atrial fibrillation, hold under 60. Same eight steps, same mechanics. Neither new case is a puzzle on any of the 11 shifts (Shift 2 has a GI bleed patient, but already diagnosed; her puzzle is a transfusion reaction). New clinical wording: add to nurse review |
| T4 | "Next here" opens a tab instead of doing the task | True for every task type. | done for assessments: the bar now does the assessment in one tap and shows what it is and its cost ("Vital signs now · 4 min"). Medications and procedures still open their sheet, because those need a decision |
| T5 | Ceftriaxone "awaiting pharmacy" reads as stuck | The hold is the puzzle (pharmacy needs the allergy history), but the notice didn't say it waits on the player, and after the call it gave no time. | done: notice says it stays on hold until pharmacy gets what they need and where to call; once pharmacy is verifying, it shows the expected release time (`eta` on the med; set for Shift 1's ceftriaxone) |
| T6 | Tray checked in the room didn't count in the insulin dialog | Looking at the tray object showed "20% eaten" but only the Care-tab action recorded it. | done for Mrs. Okafor (Shift 1). **Todo:** look for the same pattern on other shifts (an object you can look at that duplicates a "check" action) |
| T7 | Old toasts linger; "Mark all read" leaves the phone open | Messages with a reply button kept their toast forever. | done: routine toasts go after 20 game minutes (they stay in the phone); "Mark all read" clears them and closes the phone |
| T8 | "Thirty minutes to handoff" after report was given | No check for report already given. | done on all shifts, for the 30- and 60-minute nudges |
| T9 | No build label | True. | done: home footer and debrief header show "v0.7.0-beta · build abc1234". The stamp is a fingerprint of the source, written by `build.py`, so the same source always gives the same stamp |
| T10 | "More from this shift" click failed once with a browser error | Could not reproduce: six real clicks in a row, no page or console error. Possibly the tester's browser tooling. | watch. Separately, since the tester called the moments log the best feedback in the game and it now sits inside that fold, the button is relabeled "Every moment that mattered (38)" |
| T10b | Ending at 11:48 felt odd | By design (nothing due, handoff offered). | no change |

## Station declutter (Nov 12, branch `fix/station-declutter`)

Nick: the nurses' station is still overwhelming for a new player. What a first-time player saw on a phone: the four patients twice (room strip and list), the same next task five times (Next card, a count line, a label on every row, strip badges, "Everything due"), Luis four times (header, phone panel, tools, toast), 17 buttons, 1,488px of page.

Changed, on every screen size unless noted:
- The room strip is hidden at the station (it stays in rooms, where it's how you switch).
- The "Work waiting in 4 rooms, 4 tasks" line shows only when something is overdue.
- Patient rows lose the Allergy chip and the Chart button (both one tap away in the room).
- The phone panel shows only when a message needs an answer; on a phone it's gone (header button, toasts and the call bar cover it). On a wide screen the toast no longer repeats what the panel shows.
- Shift goals move below the patients, under the team buttons.
- The tutorial's phone step now points at the header phone button.

Result on a phone: 11 buttons, 998px, all four patients on the first screen under one Next card.

Not changed, worth a decision later: the hallway doors on desktop repeat the patient list (kept for the sense of place); every row saying "NEXT Shift assessment" at 07:15 is true but repetitive.

## Room declutter (Nov 12, branch `fix/room-declutter`)

A first-time player entering a room on a phone met 35 buttons and 1,672px: the scene, the plate, a Next bar, "Look at", six tabs, the open tab, then a second copy of the vitals and a documentation card, with an old station toast on top.

Changed, phone only unless noted:
- The plate's Chart button is hidden (Chart is a tab just below) and so is the "#1 on your list" chip.
- The second vitals grid under the tabs is hidden (the plate shows the same numbers).
- All sizes: a routine toast no longer follows you into a room unless it is about that patient or arrived in the last 3 minutes.

Result: 31 buttons, 1,533px; the first screen is the scene, who this is, the next step and the things to look at, with the tabs peeking.

Not changed: the six tabs. "To do" repeats what the Next bar, MAR and Care show; merging tabs is a bigger design change and would need the tutorial and several tests reworked.

## Station look (Nov 12, branch `fix/station-look`)

Nick: the station is boring to look at. The hallway was four blank brown doors, and on a phone it was hidden.

- Each door's window now shows the patient inside (the same live portrait as everywhere else, so it reflects how they're doing), with a name plate under it and a ceiling light above. An empty window and "Off unit" when they've left.
- The hallway shows on phones too, drawn without the clock panel so the doors fill the width. Doors were already tappable and already blink for a call light.
- `art.hallway(s, doors, compact)`; the door data gains `short` and `face`.

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
