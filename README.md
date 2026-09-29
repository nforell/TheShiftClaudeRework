# The Shift

A nursing clinical-judgment simulation. You work a hospital shift (med-surg, then psych): take handoff, triage, assess, give and hold meds, delegate, call providers with SBAR, and live with the consequences in the debrief.

## Play
Open `dist/the-shift.html` in a browser. It's a single self-contained file.

The deployed site (Vercel, serving `dist/`) has a beta landing page at `/` (source: `site/index.html`, screenshots in `site/assets/`) and the game at `/play/`. Run `python3 build.py` to rebuild both.

## Shifts
- **Shift 1 — First light** (Orientation, 07:00–): four patients, rooms 412–418.
- **Shift 2 — Second wind** (Beginner, 15:00–20:00): COPD CO₂ retainer, alcohol withdrawal, GI bleed with a blood-product mismatch, hyperkalemia, and an appendicitis admission.
- **Shift 3 — Small hours** (Intermediate, 23:00–04:00): delirium from urinary retention, a DVT that becomes a PE, DKA on an insulin drip, a silent overnight stroke, and PCA by proxy. The CNA is floated at 01:00.
- **Shift 4 — Quiet voices** (Specialty: Psych, 3 East, 07:00–12:00): sudden calm before a suicide attempt, escalating mania and the least-restrictive ladder, lithium toxicity passed off as a stomach bug, first-episode psychosis and the right to refuse, and water intoxication on clozapine. California legal framing: 5150, 5250, Riese, LPS.
- **Shift 5 — Small voices** (Specialty: Peds, 5 South, 15:00–20:00): RSV bronchiolitis on high-flow (suction, feeding thresholds, interpreter use), sickle cell crisis to acute chest syndrome (pain bias), a weight entered in pounds as kilograms (2.2x dosing), sentinel bruising and abusive head trauma in a non-mobile infant (mandated reporting), and a silent-chest asthma trap. Age-based vital sign ranges.

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
