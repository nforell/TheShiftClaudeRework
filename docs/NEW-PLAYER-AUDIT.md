# New player audit: November 2026 (0.7)

Walked as a brand-new player on a phone (390×844) and desktop (1280×800): landing page → home → quick round → results → home → Choose a shift → orientation → first shift. Compared the orientation and the landing page against what the game now shows after the visual overhaul (#53), the character art pass (#54), the station and room declutter (#58, #59) and the 0.7 loop (#61).

## What worked
- Home is one screen with one obvious action. Terms appear on the first tap that starts something, then the round starts.
- The orientation still triggers for a player who did quick rounds first (rounds don't write `prof.seen`), so it isn't lost.
- Drill card counts on the landing page (50 / 36 / 20 / 22 = 128) and the shift count (11 on 9 units) match the game.
- `tools/screenshots.py` still runs against the lazy-loaded, ES-module build.

## Found and fixed

| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | Orientation, all | The daylight overhaul never reached it: beige room-wall background with floor stripes, flat 1px boxes, folder-style tabs, untinted portraits. It looked like a different, older game. | A daylight layer for `.or-*` at the end of `styles.css`: app background, rounded cards and buttons with a pressed edge, the real dock's tiles, tinted portraits behind practice patients. |
| 2 | Orientation, station | Taught "doors show who's waiting" with the hallway picture. On phones the real station hides the hallway and leads with the blue **Next card** (the core of 0.7), which the walkthrough never mentioned. | Step is now "Follow the Next card": Next card, patient list with each patient's next task, the phone. Hallway shows on wide screens only, as in the game. |
| 3 | Orientation, station | The hallway sign said "4 West" on the practice unit, and drawing it parsed Shift 1 for nothing (lazy cases). | `art.hallway` takes a `unit` label; the walkthrough passes "Practice". |
| 4 | Orientation, room | Tabs were Assess / Care / Meds / Talk; the game has To do / Assess / Care / MAR / Talk & call and a **Next here** bar. Assess text described the old system-by-system flow. | Tabs, labels and Assess copy match the game; a Next here bar sits above them. |
| 5 | Orientation, debrief | Led with a score, three stars and twelve meters. The real debrief leads with the decision that mattered most and outcomes, folds the scoring, and points to a drill. | Mock debrief now matches: decision that mattered most, "Practice next: Med Pass drill", outcomes, scoring folded under one tap. |
| 6 | Orientation, step 1 | Never connected the shift to the quick round, and didn't mention the time-lapse note. | Nova: "A full shift is the quick round's decisions on one unit, with a clock," and mentions the note after a few actions. |
| 7 | Game, all shifts | **Bug:** the "while you were busy" note stayed on screen over the debrief title when a shift ended mid-note (visible in the old debrief screenshot). | `render()` removes `.lapse` when you're off the floor. |
| 8 | Game, results | Quick round called "Daily round" on its results pill; home and the landing page say "Quick round". | Renamed to Quick round. |
| 9 | Terms gate | "Before your first shift…" when it appears before a quick round. | "Before you play your first round or shift…" |
| 10 | Landing, screenshots | All ten predate the character pass and the 0.7 room/station changes. | Regenerated from the current build. |
| 11 | Landing, structure | Never showed the home screen or what a finished round looks like; "daily round / today's round / three-minute round" all named the same thing. | New "Open it and pick your assignment" section with `home.jpg`; `round.jpg` under the drills loop; "quick round" throughout. |
| 12 | Landing, full shift copy | Missing the 0.7 loop: time-lapse note, alerts over chart, debrief → drill, the skippable walkthrough. | One line each, in the sections they belong to. |

## Left for you to decide
- **Orientation length.** Eight steps runs against "keep it simple". A player who already did a few quick rounds has practiced the med, SBAR and delegation decisions. Option: when `drills.rounds > 0`, offer a short version (clock, report, Next card, debrief).
- **Who's First, first card.** A first-ever round opens on "Who first?" with no one-line instruction on how to answer. Testers may tap a card expecting more information.
- **Debrief screenshot.** The scripted teen-psych run ends without giving report, so the landing shows "You left without giving report" as the decision that mattered most. It's honest, but a run that gives report would make a better first impression.
- **Brand mark.** The landing page's mark has 2px corners; the game's rule is "no square corners".
