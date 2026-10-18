# Keeping The Shift fast and crash-free

This is the working guide for growing the game without it getting slow or unstable. It records what was measured, the budgets every change should stay inside, the guardrails already built in, and the options for when the game outgrows its current shape.

## Startup on a phone (October 2026)

Measured with `/play/` served compressed, 4x CPU slowdown and a 4G connection (a mid-range phone):

| Measure | Before Oct 11 | Now |
|---|---|---|
| Download (compressed) | 1.08 MB | 1.0 MB |
| Game file (uncompressed) | 3.7 MB | 3.1 MB |
| Scripts parsed and run | ~1.0 s | ~0.7 s |
| Home screen ready to tap | ~3.1 s | ~2.3 s |

What made the difference: the build minifies (pinned esbuild in `tools/minify`); the NCLEX data (bank, case studies, rationales, focus items: about a quarter of the game) ships as JSON blocks parsed the first time practice or a debrief reads them, with the home screen's counts precomputed in `ngnMeta`; and shift-card portraits below the fold are drawn as they scroll into view. Most of what's left is clinical text, which minifying doesn't shrink. The next lever is option 3 below.

## What the game costs today (September 2026, desktop Chromium)

| Measure | Now | Budget |
|---|---|---|
| Download (single HTML file) | ~1.05 MB | under 2 MB for the artifact; no limit that matters on Vercel |
| Memory during a shift | 3–4 MB JS heap, flat across three shifts | under 50 MB |
| Page elements on screen | 700–1,300 | under 3,000 |
| Redraw (whole screen) | 5–20 ms typical, 3% over 50 ms | typical under 16 ms, worst under 100 ms |
| Idle main thread, Full graphics | 12–20% | under 20% |
| Idle main thread, Lite graphics | 8–13% | under 12% |
| Saved data (save + profile) | ~20 KB | under 500 KB (browsers allow ~5 MB) |

Memory is not the constraint. The two costs that matter are:

1. **Idle animation.** Characters breathe and blink, a few CSS effects loop. This is what drains batteries and what an embedded viewer (the Claude artifact frame) will kill if it gets heavy.
2. **Full redraws.** Every action rebuilds the whole screen from a template string. That is simple and robust, but its cost grows with every panel added.

## Rules for new work

- **Animate only transform and opacity.** Never loop an animation on `box-shadow`, `filter`, `backdrop-filter`, `width/height` or SVG geometry across a large area. Those repaint every frame.
- **No backdrop blur on full-screen layers.** Small bars are fine; a full-screen blur over the animated scene is the likeliest cause of the September 29 blank screens.
- **Every loop must stop.** Any `requestAnimationFrame`, `setInterval` or audio loop must stop when its screen is gone and when the tab is hidden. The character loop and the audio already do.
- **Characters: at most about 8 animated on screen.** Extra portraits should be static icons.
- **Compute once per redraw.** Anything derived from state (task rows, statuses) goes through the per-render cache in `ui.js` (`RC`). Do not call `brainRows` in a loop outside render without thinking about cost.
- **Bound anything saved.** Lists written to the profile need a cap (the lesson log keeps at most 300).
- **Content is data.** A new shift is a case file registered with the engine. Engine and UI changes should be rare and tested with the sweep.

## Tasks and follow-up

Every task on a patient's list must lead to something the player can do. `tests/followup.py` enforces it: it plays each shift several ways and taps every overdue or due task; a task fails if it has no button or opens a tab with nothing highlighted.

- **Due tasks** come from a case's `dueExtras(s)`: `{ t, late, text: '<room> ...' }`. The UI routes each to the tab whose action best matches the words. Add `tab` ('care', 'assess', 'meds', 'talk'), `sys` (an assessment, e.g. 'vitals', 'neuro') or `hl` (words of the action to highlight) when the words alone would pick the wrong one.
- **Heads-ups** (results pending, a visitor expected, the doctor on the way) set `info: true`. They show under Coming up and never count as overdue.
- **Ordered checks:** when an order or a provider asks for repeated checks ("vitals every 15 minutes × 4", "recheck glucose in 15 minutes"), call `A.watch(pid, { id, text, every, times, vitals: true | rx: '<action label regex>', tab, sys, from, first })` from the case's `tick`. Each check stays on the list until done; unfinished ones are scored at the end of the shift.
- **PRN reassessment** is automatic for the drug classes in `REASS` in `flow.js`.
- **An order with an action in it needs that action.** If a provider says "give magnesium" or "pads on", the drug or intervention must exist and become available.

## Patient stories

Every patient has a short arc in `src/stories/<case>.js`, run by `src/story.js`. The arcs are plain data and cost nothing at runtime; they're installed into each case's dialog table at boot.

- **When a story opens.** Talking to a patient shows the clinical conversation first. Once that's had (or when it's only an idle line) and the patient is stable, talking moves their story on instead. Sick patients don't make small talk. `gate`, `idle`, `after` and `watch` on an arc tune this.
- **Trust (0 to 5).** It rises with the warm choice in a beat, answering their call light yourself, sitting with them when they're guarded, and good calls in their other conversations. It falls with dismissive choices. Each beat has a `need`; below it they stay guarded.
- **Some beats carry clinical weight** (`judge` on a choice): Daniel's reasons for living, Aaliyah's chest-pain promise, Travis and never shaking a baby. Those score like any other decision.
- **The debrief** tells what became of each patient. The epilogue depends on trust and on the outcome; an entry can be a function of the patient so it never contradicts what happened clinically (`hard` for poor outcomes, optional `mixed`).
- **Writing rules.** All strings in backticks. Plain words a tired nurse can read in five seconds. Keep one warm choice, one neutral choice and one that closes the door; choice order is shuffled on screen. Don't make the warm choice also the longest every time.

## Guardrails already built in

- **Crash guard** (`safe`/`crashed` in `ui.js`): any error in a click, redraw or timer shows a "Something went wrong" card with Keep playing, Home and Copy details. The error is also stored as `theshift.lastError`.
- **Browser refusals aren't crashes.** A rejected promise (Safari declining audio or the clipboard, a failed network call, the install prompt) is logged to `theshift.lastAsync`, the Health check and PostHog `error_async`, and never shows the crash card. Thrown errors in game code still do; errors from browser-extension scripts are ignored.
- **Profiles are repaired on load** (`cleanProfile` in `engine.js`): wrong types from an older version or a cloud copy can't stop a redraw.
- **The selected card never leaks into a game.** Outside the home screen, `C()` is the shift in progress, and game views resync to it on every render.
- **Never blank:** if a redraw produces nothing, the game falls back to the home screen.
- **Frame monitor:** if the device runs under ~30 fps for a few seconds, Graphics = Auto switches to **Lite** (characters at 12 fps, no looping CSS effects, no header blur). Players can force Full or Lite in Settings.
- **Characters animate at 30 fps**, and only while on screen.
- **Health check:** Settings → Health check, or add `?health` to the URL. It shows frame rate, redraw time (average, worst, slow count), element count, memory, saved-data size, browser and the last error, with Copy details.
- **Redraw timing** is recorded on every render (`Shift.ui._perf`), with the 40 slowest kept in `slowLog`.

## Testing before every push

```
pip install playwright && playwright install chromium
cd tools/minify && npm ci && cd ../..   # the pinned minifier the build uses
python tests/run_all.py     # build, sweep 13 configurations, soak; exits 1 on any problem
python tests/sweep.py peds-5s-1 390          # one shift at phone width
python tests/soak.py                          # three shifts back to back: memory and redraw times
python tests/followup.py ed-podb-1             # every task leads to an action (add --quick for two play styles)
python tests/perf.py medsurg-4w-1             # idle CPU and redraw cost per screen
```

The sweep visits every screen and sheet (home, report, triage, station, every room and pane, chart tabs, meds, SBAR, delegation, floor calls, transfers, report, debrief, achievements). It checks JavaScript errors, sideways overflow, overlapping text, buttons hidden under something else, small tap targets and clipped text. Results land in `tests/out/`.

**Tap targets fail the build.** At phone widths (≤480 px) every button, link and control must be at least 44 px tall and 24 px wide; wider screens need 24 × 24 (WCAG 2.5.5 / 2.5.8). Documented exceptions, in `tests/audit.js`: links inside running text (`p`, `small`, `.set-sub`), inputs that sit inside a larger label, and the hotspots drawn on the room SVG, which each have a full-size "Look at…" chip below the scene. Fix a failure by giving the control padding or `min-height`, never by shrinking the text.

## Options as the game grows

In the order I would take them:

1. **Make Vercel the main way to play; keep the artifact as a demo.** A normal browser tab has more memory and fewer restrictions than an embedded viewer. Nothing changes in the code; it's where you send testers.
2. **Minify the build.** Done (October 2026): pinned esbuild, plus lazily parsed NCLEX data. See *Startup on a phone* above.
3. **Load shifts on demand (Vercel only).** Split the build into the engine and UI (loaded once) plus one file per shift, fetched when chosen, with a service worker for offline play. This keeps the first load small no matter how many units you add. The single-file artifact can keep shipping two or three shifts.
4. **Redraw only what changed.** Swap the whole-screen `innerHTML` for a tiny template library such as lit-html (about 5 KB), which keeps the same template-string style but patches only the parts that changed. This is the biggest structural change, so do it alongside the next large UI feature, not on its own.
5. **Static portraits where they don't need to move.** Pre-render idle character faces for lists (roster, phone, board) as cached SVG, and animate only the patient in the room and the one in a critical moment.
6. **Accounts and cloud saves when you need them.** Browser storage is per device and about 5 MB. When players need progress across devices, or you need cohort data for a school, move the profile to a small backend (Supabase or Firebase) and keep browser storage as the offline cache.
7. **Run the sweep automatically.** Done: `.github/workflows/audit.yml` runs `tests/run_all.py` on every push to `main` and every pull request, checks that `dist/` was rebuilt, and keeps the results for 14 days. A red check on GitHub means something broke; the uploaded `audit-results` show where.
