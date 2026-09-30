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

## Every shift

These run on every unit, from `src/flow.js`:

- **Follow-up after a transfer.** A patient who goes to the ICU, PICU, ED, OR or medicine stays on your list. Call report to the receiving nurse, update the family, write the event note, and call for updates as their course plays out. The debrief shows what happened next, including after your shift.
- **Hourly rounds and call lights.** A patient nobody has checked on for a while asks for something. Answer it, round ahead of it, or send your aide, but some requests need a nurse.
- **PRN reassessment.** Every as-needed pain, antiemetic, bronchodilator or sedative dose becomes a "did it work?" task.
- **Report to the oncoming nurse.** In the last hour, give report on everyone still on the unit. Pending work you mention is fine; pending work you don't mention is a miss.
- **Skip ahead.** At the station, the clock runs minute by minute (up to 30) and stops the moment something needs you: a message, a task coming due, an admission, report time. Silent deterioration does not wake you.
- **Floor calls** (`src/floor.js`). Up to five per shift from the rest of the unit: critical values, a colleague's needlestick, a visitor, a dose to check. Each is a timed decision with feedback. The pool is shared plus unit-specific, and which calls come changes every run.
- **Rewards** (`src/reward.js`). Care XP for on-time work and good calls, a streak multiplier (×1.5 to ×3) that anything overdue resets, four shift goals, stars at 58/72/85, a nine-level career ladder and ten badges, all saved to the profile.
- **Achievements.** From the home screen or the debrief: 12 bronze/silver/gold skill tracks (lifetime good calls per domain, lessons fixed, floor calls collected, shifts, stars), 15 milestones, a per-unit summary, and the **lesson log**. Every call to rethink from a finished shift is logged with its reason; replaying that shift without repeating it marks it fixed (+60 XP). Floor-call lessons are fixed by answering that call correctly later.

## Performance and testing
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the budgets, the built-in guardrails (crash guard, Lite graphics, Settings → Health check or `?health`), and the growth plan. Before pushing, run `python tests/run_all.py`.

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
