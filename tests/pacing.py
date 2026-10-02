"""Pacing and stuck-player help, every shift. A player who falls behind gets pointed somewhere (a free check-in
from Nova, at most two a shift, never using up a tip); the station counts rooms, not line items; every due task
in the brain can be tapped; missed doses fold into one lesson per patient; a struggling domain doesn't zero out.
Usage: python tests/pacing.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)
CLOSE = "Shift.ui._ui.ov&&Shift.ui._handlers[Shift.ui._ui.ov==='crit'?'crit-x':Shift.ui._ui.ov==='result'?'res-close':'close']({dataset:{}})"
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    pg = b.new_page(viewport={'width': 390, 'height': 844}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    st = lambda e: pg.evaluate('(()=>{const s=Shift.ui._state();return ' + e + '})()')
    for case in pg.evaluate("Object.keys(Shift.engine.cases)"):
        t = f'{case}:'
        H('home'); H('pick-case', id=case); H('new')
        if pg.evaluate("Shift.ui._ui.ov") == 'confirm': H('new-yes')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); H('rank-submit'); H('rank-go'); pg.wait_for_timeout(100)
        credits = st('s.nova')
        # Fall behind: skip ahead without doing anything.
        maxn = 0
        for i in range(10):
            pg.evaluate(CLOSE); pg.evaluate("document.querySelectorAll('.ff').forEach(n=>n.remove())")
            if st('s.ended'): break
            H('skip'); pg.wait_for_timeout(20)
            pg.evaluate(CLOSE)
            if pg.evaluate("Shift.ui._ui.view") == 'station':
                n = pg.evaluate("(()=>{const e=document.querySelector('.cmd-n');return e?+e.textContent:0})()"); maxn = max(maxn, n)
        pts = st("Shift.engine.api(s).c.patients.length")
        check(maxn <= pts, f'{t} the station counts rooms waiting ({maxn}), never more than the {pts} patients')
        help = st("s.inbox.filter(m=>m.help)")
        check(1 <= len(help) <= 2, f'{t} a player who falls behind gets {len(help)} free check-in(s) from Nova')
        check(all(m.get('replies') and m['replies'][0]['label'].startswith('Go to') for m in help), f'{t} each check-in offers a way straight to the room')
        check(st('s.nova') == credits, f'{t} the check-ins did not use up a tip')
        # Every due task in every room can be tapped (blocked or in-progress rows excepted).
        stuck = []
        for pid in st("Object.keys(s.p).filter(k=>{const A=Shift.engine.api(s),d=A.def(k),P=s.p[k];return (!d.arrives||P.arrived)&&!P.out&&!P.gone&&!P.icu})"):
            pg.evaluate(CLOSE); H('goto', pid=pid); pg.evaluate(CLOSE)
            if pg.evaluate("Shift.ui._ui.view") != 'room': continue
            H('dock', id='brain')
            stuck += pg.evaluate("[...document.querySelectorAll('.pane .b-row.over.static, .pane .b-row.now.static')].map(e=>e.textContent.trim().slice(0,60))")
        check(not stuck, f'{t} every due task is tappable {stuck[:3]}')
        # Idle nudge: a pointer appears on the station when work is waiting.
        pg.evaluate(CLOSE); H('back'); pg.evaluate(CLOSE)
        pg.evaluate("Shift.ui._ui.stuck=true;Shift.ui._render()")
        check(pg.locator('.cmd .stuck-tip').count() == 1 or st('s.ended'), f'{t} an idle player sees where to start')
        # End: missed doses fold into one judgment per patient.
        pg.evaluate("(()=>{const s=Shift.ui._state();s.t=Shift.engine.api(s).c.length-1;Shift.engine.finish(s)})()")
        by = st("(()=>{const o={};s.judg.filter(j=>j.domain==='meds'&&/never given or held/.test(j.text)).forEach(j=>{o[j.pid]=(o[j.pid]||0)+1});return o})()")
        check(all(v == 1 for v in by.values()), f'{t} one missed-dose lesson per patient {by}')
        dom = pg.evaluate("(()=>{const d=Shift.engine.debrief(Shift.ui._state());return d.dom.filter(x=>x.score!==null).map(x=>x.score)})()")
        check(all(5 <= x <= 100 for x in dom), f'{t} domain scores in range')
    # The score curve: four one-point misses in a domain leave 60-27-4.5 = 28.5, not 24.
    sc = pg.evaluate("(()=>{const s=Shift.engine.newGame('medsurg-4w-1');['a','b','c','d'].forEach(k=>s.judg.push({key:k,t:0,domain:'safety',delta:-1,text:k,why:''}));return Shift.engine.debrief(s).dom.find(d=>d.id==='safety').score})()")
    check(sc == 29, f'misses past three points count half (safety {sc})')
    check(not errs, f'no JS errors {errs[:2]}')
    b.close()
print('PACING ' + ('CLEAN' if not fails else f'FAILED {len(fails)}'))
sys.exit(1 if fails else 0)
