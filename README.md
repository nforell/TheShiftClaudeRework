# The Shift

A nursing clinical-judgment simulation. You work a med-surg shift: take handoff, triage, assess, give and hold meds, delegate, call providers with SBAR, and live with the consequences in the debrief.

## Play
Open `dist/the-shift.html` in a browser. It's a single self-contained file.

## Shifts
- **Shift 1 — First light** (Orientation, 07:00–): four patients, rooms 412–418.
- **Shift 2 — Second wind** (Beginner, 15:00–20:00): COPD CO₂ retainer, alcohol withdrawal, GI bleed with a blood-product mismatch, hyperkalemia, and an appendicitis admission.

## Develop
Source is plain JavaScript on a global `window.Shift` object:

| File | Purpose |
|---|---|
| `src/engine.js` | Clock, state, scoring, debrief, save/load |
| `src/fx.js` | Synthesized sounds and haptics (no audio files) |
| `src/case-*.js` | Case content (patients, meds, events, dialogs, end checks) |
| `src/rig.js` | Procedural SVG character rig driven by vitals |
| `src/art.js` | Room and hallway scenes |
| `src/ui.js` | Screens and interaction |
| `src/styles.css` | Styles and theme tokens |

Rebuild after editing:

```
python3 build.py
```

`lab/character-lab.html` is the standalone character playground.
