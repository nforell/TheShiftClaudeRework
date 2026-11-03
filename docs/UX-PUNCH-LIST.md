# The Shift — Screen-by-Screen UX Punch List (v1)

**Scope:** the first-time path through Days on 4 West; all changes should work across the shared UI. Marked **P1 shipped in branch** means a proposed style-level improvement, not verified usability. Clinical behavior and existing scores stay untouched.

| Surface | Priority | Concrete issue / user need | Action | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| Home | P1 | New students need a quick way to distinguish quick-round vs full-shift play | Keep the two distinct pathways, clear duration and one primary CTA each; test the first 60 seconds | 5/5 uncoached testers can find Full shift and explain its purpose | Pilot |
| Home | P2 | Rewards and secondary paths can dilute the game's identity | Make the "be the nurse" proposition clear without adding more marketing copy | No additional navigation path to first full shift | Design |
| Handoff | P1 | Players must listen and flag without visual overload | Differentiate active report, selected facts and saved brain sheet; improve spacing and focus states | Flagged text remains legible in both themes; keyboard activation works | Style pass |
| Handoff | P2 | The player needs to know progress without seeing the answer | Explicit but neutral progress for each patient and final Finish report affordance | No hint reveals which clinical cue is correct | Design |
| Station | P1 | Patient roster packs identity, diagnosis, next task and actions into one row | Strengthen typographic order, portrait framing, grouping of actionable state | At 390px no clipped text, at 1440px next action distinguishable from diagnosis | Style pass |
| Station | P1 | Overdue work and immediate action need to be identifiable | Refine existing **Overdue/Now** labels and visual rails; avoid creating severity guesses from ranking | Red only for existing overdue/now status; text always available | Style pass |
| Station | P1 | Keyboard navigation and click hierarchy should be evident | Visible focus-within for actionable rows and messages | All key targets show focus indication | Style pass |
| Station | P2 | Multiple attention channels compete | Check Next card, phone, task list and row emphasis in an observed playtest | First action discoverable without coaching | Pilot |
| Room | P1 | Patient and "what next" must be read in one scan | Improve patient-nameplate contrast, next-action prominence, action/tab focus | Patient remains visible, next action legible on 390px and desktop | Style pass |
| Room | P2 | Character expressions should feel more alive while conveying clinically valid cues | Curated expressive rig updates for 4 West after screenshot review | Distinct, recognizable patients and real-state-driven expressions at 48px | Next pass |
| Room | P2 | Too many alternatives obscure decision-making | Study actual first-10-minute click paths before moving action locations | Fewer false-clicks; no hidden clinically essential actions | Pilot |
| Debrief | P1 | Feedback is dense despite valuable patient-specific content | Visually separate outcome cards; emphasize decision/reason and space skill timeline | Readers can quickly identify outcome, key choice and next goal | Style pass |
| Debrief | P2 | Replay should lead to improvement, not memorized tricks | Test whether feedback motivates a specific alternative decision | 80% of testers can name one action to change on replay | Pilot |
| All | P0 | Broken tests or unreadable controls invalidate visual polish | Run audit suite, visual checks, keyboard/reduced-motion and both themes | Existing tests green and no new console errors | CI pending |
| All | P0 | Clinical content must not gain implied authority from beautiful styling | Keep clinician review state, limits and sources visible | No new unreviewed claim, no more prominent unsourced treatment instruction | Preserved |

## What changed in this pass

- A targeted, token-based CSS layer: stronger patient roster scan order, controlled overdue/immediate emphasis, portrait containers, calmer section separation, clearer room action and debrief presentation.
- A tiny presentation-only change in the debrief markup so good/mixed/poor outcome cards can be styled independently.
- No new patient scenarios, medication orders, scoring logic, rewards or patient trajectories.

## Validations still owed before merge

1. GitHub Actions **Game audit** must complete successfully.
2. Browser visual comparisons on desktop + real/mobile emulation, light/dark and reduced-motion (automated layout checks are not a substitute for human review).
3. Full Days on 4 West scripted route and one deliberately imperfect route.
4. Check long names, multiple chips, phone width and outcomes with multiline explanations.
5. Confirm no branch conflicts with Claude's simultaneous work; rebuild `dist/` from the exact committed source and keep it in sync.

## Metrics for the student pilot

- 60-second: can students find and start a full shift?
- First 10 minutes: how many times do students ask "where do I go?"
- Completion and abandon points by screen; avoid collecting identifiable clinical information.
- One question after debrief: what concrete decision would you change next time?
- Replay rate and voluntary return, not just overall test score.

## Not this pass

A full art replacement, changing patient severity or clinical review status, redesigning the engine, rewriting 11 shifts, adding more NCLEX questions, or claiming validated learning gains.
