"""Shared autoplayer for tests that play a whole shift: a profile with tips off, one pass of doing things for a
patient (DO), answering messages and floor calls (REPLY), and play() to run a shift start to finish."""
import pathlib, random
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
PROFILE = "localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'debrief'},seen:{orient:1,'coach:station':1,'coach:room':1,tour:1},done:{}}))"

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


STYLE_P = {'doer': 1, 'idle': 0, 'random1': .5, 'random2': .35}

def start(pg, case):
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    pg.goto(GAME); pg.evaluate(PROFILE); pg.reload(); pg.wait_for_timeout(250)
    H('pick-case', id=case); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go')
    if pg.evaluate("Shift.ui._ui.ov"): H('close')
    return H

def play(pg, case, style, each=None, loops=80):
    """Play `case` in `style` until the shift ends. each(pid) runs after every patient pass."""
    H = start(pg, case)
    st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
    seed = random.Random(case + style).randint(1, 99999); prob = STYLE_P[style]
    for loop in range(loops):
        if st('s.ended'): break
        pg.evaluate(REPLY, seed + loop)
        pids = st("Object.keys(s.p).filter(k=>{const P=s.p[k],d=Shift.engine.api(s).def(k);return (!d.arrives||P.arrived)&&!P.gone&&!P.icu})")
        for pid in pids:
            if prob: pg.evaluate(DO, [pid, prob, seed + loop])
            if st('s.ended'): break
            if each: each(pid)
        if st('s.ended'): break
        pg.evaluate("Shift.ui._ui.ov=null"); H('back'); H('skip'); pg.wait_for_timeout(20)
    return H, st
