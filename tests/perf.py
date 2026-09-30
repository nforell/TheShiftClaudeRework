"""Idle CPU and redraw cost per screen. Usage: python tests/perf.py [case]"""
import sys, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
from playwright.sync_api import sync_playwright
case=sys.argv[1] if len(sys.argv)>1 else 'medsurg-4w-1'
with sync_playwright() as p:
    b=p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=b.new_page(viewport={'width':1280,'height':900})
    fontroute(pg)
    cdp=pg.context.new_cdp_session(pg); cdp.send('Performance.enable')
    met=lambda: {x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}
    def idle(label, secs=4):
        a=met(); pg.wait_for_timeout(secs*1000); z=met()
        print(f"{label:28s} script {100*(z['ScriptDuration']-a['ScriptDuration'])/secs:5.1f}%  layout {100*(z['LayoutDuration']-a['LayoutDuration'])/secs:4.1f}%  style {100*(z['RecalcStyleDuration']-a['RecalcStyleDuration'])/secs:4.1f}%  task {100*(z['TaskDuration']-a['TaskDuration'])/secs:5.1f}%  nodes {int(z['Nodes'])} heap {z['JSHeapUsedSize']/1e6:.1f}MB")
    pg.goto(GAME); pg.wait_for_timeout(500)
    H=lambda a,**kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})",[a,kw])
    pg.evaluate("(()=>{const p=Shift.ui._ui;})()")
    H('pick-case', id=case)
    idle('home idle')
    pg.click('[data-act="set"]', trial=True) if False else None
    H('new'); H('intro-go'); idle('handoff idle'); H('h-done'); H('rank-submit'); H('rank-go'); H('coach-skip')
    idle('station idle')
    t=pg.evaluate("(()=>{const t0=performance.now();for(let i=0;i<20;i++)Shift.ui._render();return (performance.now()-t0)/20})()"); print('station render ms', round(t,1))
    pid=pg.evaluate("Object.keys(Shift.ui._state().p)[0]"); H('goto',pid=pid); idle('room idle')
    t=pg.evaluate("(()=>{const t0=performance.now();for(let i=0;i<20;i++)Shift.ui._render();return (performance.now()-t0)/20})()"); print('room render ms', round(t,1))
    H('back')
    t=pg.evaluate("(()=>{const t0=performance.now();Shift.ui._handlers.skip({dataset:{}});return performance.now()-t0})()"); print('skip ms', round(t,1), 't', pg.evaluate("Shift.ui._state().t"))
    pg.evaluate("document.querySelectorAll('.ff').forEach(n=>n.remove())")
    t=pg.evaluate("(()=>{const t0=performance.now();Shift.ui._handlers.catchup({dataset:{}});return performance.now()-t0})()"); print('10-min pass ms', round(t,1))
    # music on
    pg.evaluate("Shift.fx.setMusic(true); Shift.fx.setOn(true); Shift.fx.unlock()")
    idle('station + music', 6)
    print('audio', pg.evaluate("(()=>{const d=Shift.fx._debug();return d.ctx?d.ctx.state+' '+d.ctx.sampleRate:'none'})()"))
    b.close()
