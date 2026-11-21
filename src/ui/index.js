/* The Shift — UI entry. src/ui/ is plain ES modules bundled by esbuild (build.py) into one script:
     ctx       engine handles, constants, helpers and the shared mutable state G (imports nothing)
     core      game flow: start, resume, spend time, care XP, the aide
     home      header, home screen, shift picker          handoff   report, cold open, who-first ranking
     floor     the nurses' station, floor calls, follow-up, report to the oncoming nurse
     room      the patient's room, meds, talking, delegation, critical moments and results
     chart     the EHR drawer        sbar     calling the provider        drills   the quick rounds
     debrief   end of shift and the NCLEX review tab    practice  NCLEX items, case studies, bank, reference
     awards    stars, XP, badges     sheets   menu, settings, account, help and the other sheets
     render    one redraw            actions  every data-act handler, input, boot
   Mutable state lives on G (G.s is the shift in progress, G.prof the profile); everything else is imported. */
import { boot, handlers } from './actions.js';
import { G, S, def, lawText, liveDef, ui } from './ctx.js';
import { plugDrills } from './drills.js';
import { nextFor } from './floor.js';
import { bankFiltered } from './practice.js';
import { PERF, render } from './render.js';
import { brainRows } from './room.js';

plugDrills(handlers);
S.ui = { boot, _handlers: handlers, _ui: ui, _state: () => G.s, _render: render, _perf: PERF, _law: lawText,
  // test hooks (tests/round3.py)
  _brainRows: (pid) => { G.RC = null; return brainRows(def(pid), G.s.p[pid]); }, _nextFor: (pid) => { G.RC = null; return nextFor(pid); }, _liveDef: (pid) => liveDef(def(pid)), _bankFiltered: () => bankFiltered() };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
