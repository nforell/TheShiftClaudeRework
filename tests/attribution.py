"""Feedback attribution: the debrief must only ever talk about patients who are on your assignment, and anything from
the rest of the unit must say so. A beta tester was docked for "Mr. Kowalski's Foley" on a shift where Kowalski was
never theirs; this test keeps that whole class of bug out.

1. Floor calls, as filled for each shift: no room number from that shift's roster, and no patient from any shift's
   roster (by name), so a colleague's patient can't be mistaken for yours.
2. A played shift of every unit: every judgment with a patient id names a patient on that roster, no judgment text
   names another shift's patient, and every floor-call judgment is labeled as a floor call.
3. Mealtime insulin on Days on 4 West: a tray checked early and then held is credited as checked.
Usage: python tests/attribution.py"""
import sys, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
from playwright.sync_api import sync_playwright

CASES = ['medsurg-4w-1', 'medsurg-4w-2', 'medsurg-4w-3', 'stepdown-6e-1', 'icu-3w-1', 'ed-podb-1', 'ld-2s-1', 'ob-2n-1', 'psych-3e-1', 'psych-4n-1', 'peds-5s-1']
fails = []

STATIC = r"""(() => {
  const E = Shift.engine, F = Shift.floor, out = [];
  const cases = Object.values(E.cases);
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Everyone on any shift's roster, by the names the game uses for them.
  const people = [];
  cases.forEach((c) => c.patients.forEach((d) => { const sur = d.name.split(' ').slice(-1)[0]; people.push({ cid: c.id, re: new RegExp('(?:Mr|Mrs|Ms|Mx|Dr)\\.? ' + esc(sur) + '\\b|\\b' + esc(d.name) + '\\b') }); }));
  cases.forEach((c) => {
    const k = F.kindOf(c), mine = c.patients.map((d) => String(d.room || d.id));
    F.POOL.filter((x) => x.k.includes(k) || (k === 'icu' && x.k.includes('med') && !x.noIcu)).forEach((it) => {
      const tx = typeof it.text === 'string' ? it.text : (it.text[k] || it.text.med);
      const all = [it.ping, tx, it.q, it.teach, it.miss && it.miss.text, it.miss && it.miss.why].concat(it.opts.map((o) => o.t + ' ' + o.fb)).filter(Boolean).map((x) => F.fill(c, x)).join(' \n ');
      mine.forEach((r) => {
        const re = r.length >= 3 ? new RegExp('(^|[^\\d/.])' + r + '(?![\\d/.])') : new RegExp('(?:bay|bed|room) ' + r + '\\b', 'i');
        if (re.test(all)) out.push(`${c.id}: floor call ${it.id} mentions room ${r}, which is on this shift's assignment`);
      });
      people.forEach((p) => { const m = all.match(p.re); if (m) out.push(`${c.id}: floor call ${it.id} names ${m[0]}, a patient on ${p.cid}`); });
    });
  });
  return out;
})()"""

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1280, 'height': 900})
    fontroute(pg)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto(GAME)
    pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{sound:'off',music:'off',motion:'reduced'},seen:{orient:1,'coach:station':1,'coach:room':1}}))")
    pg.reload(); pg.wait_for_timeout(400)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    st = lambda e: pg.evaluate('(()=>{const s=Shift.ui._state();return ' + e + '})()')
    def Hs(a, **kw):   # the play loop drives the UI blind; a step that doesn't apply right now is skipped
        try: H(a, **kw)
        except Exception: pass

    # 1. Floor-call content.
    for f in pg.evaluate(STATIC): fails.append(f)

    # 2. A played shift on every unit. Floor calls are answered on even loops and left to expire on odd ones, so both
    #    the answered and the missed paths reach the debrief.
    for case in CASES:
        H('pick-case', id=case); H('new'); H('intro-go'); H('h-done'); H('rank-submit'); H('rank-go'); H('coach-skip')
        pids = st("Object.keys(s.p)"); n = 0
        while not st('s.ended') and n < 70:
            q = pids[n % len(pids)]
            if st(f"!(s.p['{q}'].icu||s.p['{q}'].gone)&&(!Shift.engine.api(s).def('{q}').arrives||s.p['{q}'].arrived)"):
                Hs('goto', pid=q); Hs('assess', sys='vitals'); Hs('res-close'); Hs('back')
            if n % 2 == 0:
                for f in st("Shift.floor.open(s).map(x=>x.id)"): Hs('floor', id=f); Hs('floor-pick', i=str(n % 3)); Hs('close')
            Hs('skip'); pg.wait_for_timeout(20)
            ov = pg.evaluate("Shift.ui._ui.ov")
            if ov: Hs('crit-x' if ov == 'crit' else 'res-close' if ov == 'result' else 'close')
            n += 1
        if pg.evaluate("Shift.ui._ui.view") != 'debrief': H('end-yes')
        pg.wait_for_timeout(200)
        bad = pg.evaluate(r"""(() => {
          const s = Shift.ui._state(), E = Shift.engine, c = E.cases[s.caseId], out = [];
          const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const mine = new Set(c.patients.map((d) => d.id));
          const others = [];
          Object.values(E.cases).forEach((k) => { if (k.id === c.id) return; k.patients.forEach((d) => { const sur = d.name.split(' ').slice(-1)[0]; if (c.patients.some((x) => x.name.split(' ').slice(-1)[0] === sur)) return; others.push({ cid: k.id, re: new RegExp('(?:Mr|Mrs|Ms|Mx)\\.? ' + esc(sur) + '\\b|\\b' + esc(d.name) + '\\b') }); }); });
          s.judg.forEach((j) => {
            if (j.pid && !mine.has(j.pid)) out.push(`${c.id}: judgment ${j.key} is filed under ${j.pid}, not on this shift`);
            others.forEach((o) => { const m = (j.text + ' ' + j.why).match(o.re); if (m) out.push(`${c.id}: judgment ${j.key} names ${m[0]} (a patient on ${o.cid}): ${j.text.slice(0, 120)}`); });
            if (/^floor-/.test(j.key || '') && !/^Floor call/.test(j.text)) out.push(`${c.id}: floor-call judgment ${j.key} isn't labeled as a floor call: ${j.text.slice(0, 120)}`);
          });
          return out;
        })()""")
        fails.extend(bad)
        nfl = st("s.judg.filter(j=>/^floor-/.test(j.key||'')).length")
        print(f"{case}: {st('s.judg.length')} judgments, {nfl} from floor calls, {len(bad)} attribution problems")
        H('home')

    # 3. Mealtime insulin: tray checked at 08:20 (too early for a percent), then held. That is a check, not a guess.
    H('pick-case', id='medsurg-4w-1'); H('new'); H('intro-go'); H('h-done'); H('rank-submit'); H('rank-go'); H('coach-skip')
    pg.evaluate("(()=>{const s=Shift.ui._state();Shift.engine.advance(s,80-s.t)})()")
    pg.evaluate("""(()=>{const s=Shift.ui._state(),E=Shift.engine,A=E.api(s),d=A.def('414'),P=s.p['414'];
      const x=d.interventions.find(i=>i.id==='intake'); const t=x.run(s,P,A); A.log('414',t,'find'); s.log[s.log.length-1].label=x.label;
      d.meds.find(m=>m.id==='414-prand').hold(s,P,A,'intake');})()""")
    j = st("s.judg.filter(j=>/^414-prand/.test(j.key)).map(j=>({key:j.key,delta:j.delta,text:j.text}))")
    if not j or any('without checking' in x['text'] for x in j) or not any(x['delta'] > 0 for x in j):
        fails.append(f"insulin: an early tray check followed by a hold was not credited: {j}")
    # ...and once the tray is checked again later, the hold is upgraded to the full credit.
    pg.evaluate("""(()=>{const s=Shift.ui._state(),E=Shift.engine;E.advance(s,95-s.t);const A=E.api(s),d=A.def('414'),P=s.p['414'];
      d.interventions.find(i=>i.id==='intake').run(s,P,A);})()""")
    j2 = st("s.judg.filter(j=>/^414-prand/.test(j.key)).map(j=>({key:j.key,delta:j.delta}))")
    if not any(x['delta'] == 2 for x in j2) or len(j2) != 1:
        fails.append(f"insulin: confirming 20% intake after an early-check hold should leave one +2 judgment, got {j2}")
    print('insulin early-check hold:', j, '->', j2)
    b.close()

fails += [f"JS error: {e}" for e in errs]
for f in fails: print('FAIL', f)
print('ATTRIBUTION FAILED' if fails else 'ATTRIBUTION CLEAN', len(fails))
sys.exit(1 if fails else 0)
