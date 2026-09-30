"""Three full shifts back to back in one page: memory, element count, redraw times, errors. Usage: python tests/soak.py"""
import sys, os, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':900})
    fontroute(pg)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
    cdp=pg.context.new_cdp_session(pg); cdp.send('Performance.enable')
    def m():
        cdp.send('HeapProfiler.collectGarbage'); pg.wait_for_timeout(300); cdp.send('HeapProfiler.collectGarbage')
        d={x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}
        return f"heap {d['JSHeapUsedSize']/1e6:.1f}MB nodes {int(d['Nodes'])} listeners {int(d['JSEventListeners'])}"
    pg.goto(GAME); pg.wait_for_timeout(400)
    H=lambda a,**kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})",[a,kw])
    st=lambda e: pg.evaluate('(()=>{const s=Shift.ui._state();return '+e+'})()')
    print('start', m())
    for case in ['medsurg-4w-1','psych-3e-1','peds-5s-1']:
        H('pick-case', id=case); H('new'); H('intro-go'); H('h-done'); H('rank-submit'); H('rank-go'); H('coach-skip')
        pids=st("Object.keys(s.p)")
        n=0
        while not st('s.ended') and n<60:
            q=pids[n % len(pids)]
            if st(f"!(s.p['{q}'].icu||s.p['{q}'].gone)&&(!Shift.engine.api(s).def('{q}').arrives||s.p['{q}'].arrived)"):
                H('goto',pid=q); H('assess',sys='vitals'); H('res-close'); H('dock',id='care'); H('back')
            for f in st("Shift.floor.open(s).map(x=>x.id)"): H('floor',id=f); H('floor-pick',i='0'); H('close')
            H('skip'); pg.wait_for_timeout(60)
            ov=pg.evaluate("Shift.ui._ui.ov")
            if ov: H('crit-x' if ov=='crit' else 'res-close' if ov=='result' else 'close')
            n+=1
        if pg.evaluate("Shift.ui._ui.view")!='debrief': H('end-yes')
        pg.wait_for_timeout(500); H('awards'); H('aw-tab',k='lessons'); H('aw-back'); H('home')
        print(case, 'loops', n, m(), 'perf', pg.evaluate("({avg:+Shift.ui._perf.avg.toFixed(1), worst:+Shift.ui._perf.worst.toFixed(0), slow:Shift.ui._perf.slow, n:Shift.ui._perf.n})"), 'els', pg.evaluate("document.getElementsByTagName('*').length"), 'extra', pg.evaluate("document.querySelectorAll('.ff,.xpop,.zap,.pop-tip,.oops').length"))
    print("slowest", sorted(pg.evaluate("Shift.ui._perf.slowLog") or [], key=lambda x: -x["ms"])[:5])
    print("save KB", pg.evaluate("Math.round(((localStorage.getItem('theshift.save.v1')||'').length+(localStorage.getItem('theshift.profile.v1')||'').length)/1024)"), 'errs', errs)
    b.close()
