"""Dead-end check: every task the game puts on a patient's to-do list must lead to an action the player can take.
Plays every shift several ways (doing everything, doing nothing, doing a random half), and at each step opens each
patient's task list and taps every overdue or due task. A task fails if it has no button, or if its button opens a tab
where nothing is highlighted to do it. Usage: python tests/followup.py [--quick] [case ...]"""
import sys, pathlib, random
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
QUICK = '--quick' in sys.argv
CASES = [a for a in sys.argv[1:] if not a.startswith('--')] or ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'ed-podb-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1']
STYLES = ['doer', 'idle'] if QUICK else ['doer', 'idle', 'random1', 'random2']
PROFILE = "localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{orient:1,'coach:station':1,'coach:room':1,tour:1},done:{}}))"

# Open the patient's Brain tab and tap each overdue/due task. Returns [(text, why)] for tasks that lead nowhere.
CHECK = """(pid) => {
  const U = Shift.ui, H = U._handlers, bad = [];
  H.goto({dataset:{pid}}); if (U._ui.ov) H.close({dataset:{}});
  const s = U._state(); if (s.ended || s.loc !== pid) return bad;
  H.dock({dataset:{id:'brain'}});
  const rows = [...document.querySelectorAll('.pane .b-grp.over .b-row, .pane .b-grp.now .b-row')].map((b) => ({
    text: (b.querySelector('b') || b).textContent.trim(), act: b.dataset.act || null, id: b.dataset.id || null, hl: b.dataset.hl || null, sys: b.dataset.sys || '' }));
  for (const r of rows) {
    if (!r.act) { bad.push([r.text, 'no button']); continue; }
    if (r.act !== 'dock') continue;
    H.dock({dataset:{id:r.id, hl:r.hl, sys:r.sys}});
    const hit = document.querySelector('.pane .fs-row.hl, .pane .mar-row.hl');
    if (!hit) bad.push([r.text, 'opens ' + r.id + ', nothing to do there']);
    else if (window.__map) window.__map.push([r.text, r.id + ': ' + ((hit.querySelector('b') || hit).textContent.trim())]);
    H.dock({dataset:{id:'brain'}});
  }
  return bad;
}"""

# One pass of doing things for a patient. mode: 'all' or a probability.
DO = """([pid, p, seed]) => {
  const U = Shift.ui, H = U._handlers; let r = seed; const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  const ok = () => p >= 1 || rnd() < p;
  const close = () => { for (let i = 0; i < 4 && U._ui.ov; i++) { const ov = U._ui.ov; if (ov === 'crit') H['crit-x']({dataset:{}}); else if (ov === 'result') H['res-close']({dataset:{}}); else if (ov === 'dialog' && U._ui.dlg) { const n = Shift.engine.getCase(U._state().caseId).dialogs[U._ui.dlg.id]; if (n && n.choices && n.choices.length) H.dlg({dataset:{i:String(Math.floor(rnd() * n.choices.length))}}); else H.close({dataset:{}}); } else H.close({dataset:{}}); } };
  const s0 = U._state(); if (s0.ended) return;
  H.goto({dataset:{pid}}); close();
  let s = U._state(); if (s.ended || s.loc !== pid) return;
  const A = Shift.engine.api(s), d = A.def(pid), P = s.p[pid];
  s.botDone = s.botDone || {};
  for (const x of (d.interventions || [])) {
    s = U._state(); if (s.ended || s.loc !== pid) return;
    if (x.form || (x.avail && !x.avail(s, s.p[pid], A)) || !ok()) continue;
    const k = pid + 'i' + x.id; if ((s.botDone[k] || 0) >= 3) continue; s.botDone[k] = (s.botDone[k] || 0) + 1;
    H.int({dataset:{id:x.id}}); close();
  }
  for (const m of (d.meds || [])) {
    s = U._state(); if (s.ended || s.loc !== pid) return;
    const st = s.meds[m.id]; if (!st || (m.available && !m.available(s, s.p[pid])) || (m.block && m.block(s, s.p[pid], A)) || st.status === 'given' || st.status === 'held' || st.status === 'verify' || m.later || m.initStatus === 'given' || !ok()) continue;
    const k = pid + 'm' + m.id; if ((s.botDone[k] || 0) >= 1) continue; s.botDone[k] = 1;
    H.med({dataset:{id:m.id}}); if (m.doses) H.dose({dataset:{v:String(m.doses[0].id)}}); H['med-give']({dataset:{}}); close();
  }
  s = U._state();
  if (!s.ended && d.sbar && ok()) {
    const k = pid + 'sbar', last = s.botDone[k]; if (last === undefined || s.t - last >= 60) {
      s.botDone[k] = s.t; H.sbar({dataset:{pid}});
      const items = d.sbar.items(s, s.p[pid], A), reqs = typeof d.sbar.requests === 'function' ? d.sbar.requests(s, s.p[pid], A) : (d.sbar.requests || d.sbar.reqs || []);
      items.filter((i) => i.key && (i.need === undefined || i.need)).forEach((i) => H['sbar-pick']({dataset:{id:i.id}}));
      if (reqs.length) H['sbar-req']({dataset:{id:reqs[Math.floor(rnd() * Math.min(reqs.length, 2))].id}});
      H['sbar-send']({dataset:{}}); close();
    }
  }
  s = U._state();
  if (!s.ended && ok() && s.loc === pid) { try { H.talk({dataset:{}, getBoundingClientRect: () => ({left:0,top:0,width:0,height:0})}); } catch (e) {} close(); }
}"""

REPLY = """(seed) => { const U = Shift.ui, H = U._handlers, s = U._state(); let n = 0;
  for (const m of s.inbox) { if (!m.replies || m.done) continue; H.reply({dataset:{m:String(m.id), i:String(seed % m.replies.length)}}); if (U._ui.ov) H.close({dataset:{}}); if (++n > 6) break; }
  try { (Shift.floor.open(U._state()) || []).forEach((x) => { H.floor({dataset:{id:x.id}}); H['floor-pick']({dataset:{i:String(seed % 2)}}); H.close({dataset:{}}); }); } catch (e) {} }"""

fails = {}
MAP = set()
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for case in CASES:
        for style in STYLES:
            pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e, c=case, st=style: errs.append(f'{c} {st}: {str(e)[:160]} @ {(e.stack or "").splitlines()[1:3]}'))
            pg.goto(GAME); pg.evaluate(PROFILE); pg.reload(); pg.wait_for_timeout(250)
            H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
            st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
            if '--map' in sys.argv: pg.evaluate("window.__map=[]")
            H('pick-case', id=case); H('new')
            if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
            H('h-done'); H('rank-submit'); H('rank-go')
            if pg.evaluate("Shift.ui._ui.ov"): H('close')
            seed = random.Random(case + style).randint(1, 99999)
            prob = {'doer': 1, 'idle': 0, 'random1': .5, 'random2': .35}[style]
            for loop in range(80):
                if st('s.ended'): break
                pg.evaluate(REPLY, seed + loop)
                pids = st("Object.keys(s.p).filter(k=>{const P=s.p[k],d=Shift.engine.api(s).def(k);return (!d.arrives||P.arrived)&&!P.gone&&!P.icu})")
                for pid in pids:
                    if prob: pg.evaluate(DO, [pid, prob, seed + loop])
                    if st('s.ended'): break
                    for text, why in pg.evaluate(CHECK, pid):
                        k = (case, pid, text, why)
                        if k not in fails: fails[k] = (style, st('Shift.engine.clock(s.t)'))
                if st('s.ended'): break
                pg.evaluate("Shift.ui._ui.ov=null"); H('back'); H('skip'); pg.wait_for_timeout(20)
            print(f'{case} {style} done at', st('Shift.engine.clock(s.t)'), flush=True)
            if '--map' in sys.argv:
                for t, h in pg.evaluate("window.__map||[]"): MAP.add((case, t.split(' (')[0], h))
            pg.close()
    b.close()

for m in sorted(MAP): print('MAP', *m, sep=' | ')
for (case, pid, text, why), (style, t) in sorted(fails.items()):
    print(f'FAIL {case} {pid} "{text}": {why} (first in {style} run at {t})')
for e in errs[:10]: print('FAIL js error', e)
print('FOLLOWUP FAILED' if fails or errs else 'FOLLOWUP CLEAN', len(fails) + len(errs))
sys.exit(1 if fails or errs else 0)
