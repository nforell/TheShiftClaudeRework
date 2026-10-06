"""Owning an error: give a contraindicated drug, then check the game lets you tell the provider (SBAR) and the charge
nurse, puts it on the task list until you do, and scores both telling and never telling. Usage: python tests/errors.py"""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri(); fails = []
def check(ok, what):
    print(('ok   ' if ok else 'FAIL ') + what)
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for run in ('tell', 'hide', 'self'):
        pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
        pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced',feedback:'" + ('debrief' if run == 'self' else 'now') + "'},seen:{orient:1,'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        st = lambda e: pg.evaluate("(()=>{const s=Shift.ui._state();return " + e + "})()")
        def close():
            for _ in range(4):
                ov = pg.evaluate("Shift.ui._ui.ov")
                if ov == 'crit': H('crit-x')
                elif ov == 'result': H('res-close')
                elif ov: H('close')
                else: break
        judg = lambda key: st(f"(s.judg.find(j=>j.key==='{key}')||{{}}).delta")
        H('pick-case', id='ed-podb-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        H('h-done'); H('rank-submit'); H('rank-go'); close()
        for _ in range(10):
            if st("s.p['22'].tpaOrder"): break
            H('back'); H('skip'); close()
        H('goto', pid='22'); close(); H('med', id='22-tpa'); H('dose', v='1'); H('med-give'); close()
        check(st("(s.errors||[]).some(e=>e.pid==='22'&&e.base==='22-tpa')"), f'{run}: giving tenecteplase outside the window is logged as an error')
        if run == 'self':
            H('dock', id='brain')
            check(not pg.evaluate("[...document.querySelectorAll('.pane .b-row b')].some(b=>/about the error/.test(b.textContent))"), 'self: with feedback at the debrief, the game does not reveal the error')
            H('dock', id='talk')
            check(pg.locator('.pane [data-act="err-charge"]').count() == 0, 'self: no charge-nurse prompt either')
            H('sbar', pid='22'); t = st("s.meds['22-tpa'].given[0]")
            H('sbar-pick', id=f'rx:22-tpa:{t}'); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply") or ''; close()
            check('Thank you for telling me' in r, f'self: reporting a worrying dose reaches the provider ({r[:60]})')
            check((judg('22-err-md-22-tpa') or 0) > 0, 'self: reporting it is scored')
            H('goto', pid='21'); close(); H('med', id='21-asa'); H('med-give'); close()
            H('sbar', pid='21'); t = st("s.meds['21-asa'].at")
            H('sbar-pick', id=f'rx:21-asa:{t}'); H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply") or ''; close()
            check('ordered and appropriate' in r, f'self: a dose that was fine gets a reassuring answer ({r[:70]})')
            pg.close(); continue
        H('dock', id='brain')
        check(pg.evaluate("[...document.querySelectorAll('.pane .b-row b')].some(b=>/about the error/.test(b.textContent))"), f'{run}: the task list says to tell the provider')
        H('dock', id='talk')
        check(pg.locator('.pane [data-act="err-charge"]').count() == 1, f'{run}: Talk & call offers telling the charge nurse')
        H('sbar', pid='22')
        check(pg.locator('.sbar-err input').count() >= 1, f'{run}: the SBAR has a "Report an error" section')
        if run == 'tell':
            eid = st("s.errors.find(e=>e.pid==='22').id")
            H('sbar-pick', id=f'err:{eid}')
            check(pg.locator('[data-act="sbar-send"]:not([disabled])').count() == 1, 'tell: an error report alone can be sent')
            H('sbar-send'); r = pg.evaluate("Shift.ui._ui.sbar && Shift.ui._ui.sbar.reply") or ''; close()
            check('Thank you for telling me' in r and 'Neuro checks' in r, f'tell: the provider answers with what to do now ({r[:80]})')
            check((judg('22-err-md-22-tpa') or 0) > 0, 'tell: telling the provider fast is scored')
            H('dock', id='brain')
            check(not pg.evaluate("[...document.querySelectorAll('.pane .b-grp:not(.ghosts):not(.done) .b-row b')].some(b=>/about the error/.test(b.textContent))"), 'tell: the task clears once the provider knows')
            H('dock', id='talk'); H('err-charge'); close()
            check((judg('22-err-charge-22-tpa') or 0) > 0, 'tell: telling the charge nurse is scored')
            check(pg.locator('.pane [data-act="err-charge"]').count() == 0, 'tell: the charge-nurse option goes away after')
        else:
            close(); H('end-yes'); pg.wait_for_timeout(300)
            check((judg('22-err-hidden-22-tpa') or 0) < 0, 'hide: never telling the provider is scored at the end')
        pg.close()
    b.close()
for e in errs[:5]: print('FAIL js error', e)
print('ERRORS FAILED' if fails or errs else 'ERRORS CLEAN')
sys.exit(1 if fails or errs else 0)
