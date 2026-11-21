"""The 0.7 loop: shifts load on demand (home parses none; starting one parses only it); a long action leaves a short,
non-blocking note of what changed while you were busy; a PRN whose reassessment is due shows on its door; a line
flagged in report shows its time when it's close; a falling SpO2 and an alarming monitor read as alarms; the debrief
offers the drill for what was missed, one tap away; the chart drawer stays opaque and doesn't replay its entrance;
focus rings show for the keyboard only. Usage: python tests/loop.py  (exit 1 on failure)"""
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
    for W in (390, 1280):
        ctx = b.new_context(viewport={'width': W, 'height': 844 if W < 600 else 900}, is_mobile=W < 600, has_touch=W < 600)
        pg = ctx.new_page(); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
        pg.goto(GAME); pg.wait_for_timeout(200)
        pg.evaluate("(()=>{const p={runs:[],settings:{sound:'off',music:'off',theme:'light'},seen:{'coach:station':1,'coach:room':1,orient:1}};p.terms=Shift.terms&&Shift.terms.version;localStorage.setItem('theshift.profile.v1',JSON.stringify(p))})()")
        pg.reload(); pg.wait_for_timeout(300)
        H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
        tag = f'{W}px'
        # Lazy shifts.
        check(pg.evaluate("(Shift.caseParsed||[]).length") == 0, f'{tag}: home parses no shift scripts')
        H('shifts'); check(pg.evaluate("(Shift.caseParsed||[]).length") == 0 and pg.evaluate("document.querySelectorAll('.sc-pick').length") >= 11, f'{tag}: the shift picker draws every shift without loading one')
        H('pick-case', id='medsurg-4w-1'); H('new')
        if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
        check(pg.evaluate("Shift.caseParsed") == ['medsurg-4w-1'], f'{tag}: starting a shift parses only that shift')
        check(pg.evaluate("Object.keys(Shift.engine.cases).length") == 11 and pg.evaluate("!!Shift.engine.cases['medsurg-4w-1'].dialogs"), f'{tag}: every shift is still listed, and the loaded one is whole')
        H('flag', k='414:2'); H('h-done'); H('rank-submit'); H('rank-go')
        # Flagged report line close to its time.
        pg.evaluate("(()=>{const s=Shift.ui._state();s.t=Math.max(s.t,22)})()"); pg.evaluate("Shift.ui._render(true)")
        check(pg.locator('.pt-row .chip.pin-near').count() == 1 and '07:30' in pg.locator('.pt-row .chip.pin-near').inner_text(), f'{tag}: a flagged line coming due shows its time on the patient list')
        H('roster'); check(pg.locator('.ro-fl li.pin-near').count() == 1, f'{tag}: and pulses on the brain sheet'); H('close')
        # Time-lapse note after a long action.
        H('goto', pid='414'); pg.wait_for_timeout(150)
        pg.evaluate("(()=>{const s=Shift.ui._state();s.t=14})()")
        btn = pg.locator('[data-act="nh-assess"]').first
        if btn.count(): btn.click(); pg.wait_for_timeout(500)
        n = pg.locator('.lapse')
        check(n.count() == 1 and 'while you were busy' in n.inner_text() and '414' in n.inner_text(), f'{tag}: a long action leaves a note of what came due' + (f' ({n.inner_text()[:80]!r})' if n.count() else ''))
        check(n.count() == 1 and pg.evaluate("getComputedStyle(document.querySelector('.lapse')).pointerEvents") == 'none' and pg.evaluate("document.querySelector('.lapse').getAttribute('aria-live')") == 'polite', f'{tag}: the note never takes a tap and is announced politely')
        pg.wait_for_timeout(5600); check(pg.locator('.lapse').count() == 0, f'{tag}: the note goes away on its own')
        # PRN reassessment due: a note on the door.
        pg.evaluate("""(()=>{const s=Shift.ui._state();const d=Shift.engine.cases[s.caseId].patients.find(p=>p.id==='412');const m=d.meds.find(m=>m.prn&&/oxycod/i.test(m.name));s.meds[m.id]=s.meds[m.id]||{pid:'412',given:[]};s.meds[m.id].given.push(s.t-75);})()""")
        H('back'); pg.wait_for_timeout(150)
        check(pg.locator('.door .door-note').count() == 1 and 'PRN' in pg.evaluate("document.querySelector('.door[data-pid=\"412\"]').getAttribute('aria-label')"), f'{tag}: a due PRN reassessment shows on its door and in its label')
        # Chart drawer: opaque, and switching tabs doesn't replay the slide.
        H('chart', pid='412'); pg.wait_for_timeout(300)
        bg = pg.evaluate("getComputedStyle(document.querySelector('.drawer')).backgroundColor")
        check(not bg.startswith('rgba') or bg.endswith(', 1)'), f'{tag}: chart drawer is opaque ({bg})')
        H('chart', pid='412', tab='labs'); check(pg.evaluate("document.querySelector('.drawer').classList.contains('steady')"), f'{tag}: switching chart tabs keeps the drawer still')
        H('close')
        # Focus rings: none after a tap, back with the keyboard.
        pg.locator('.top [data-act="menu"]:visible').first.click(); pg.wait_for_timeout(150); pg.locator('.sheet [data-act="close"]').first.click(); pg.wait_for_timeout(150)
        check(not pg.evaluate("document.documentElement.classList.contains('kbd')"), f'{tag}: a tap leaves focus rings off')
        pg.keyboard.press('Tab'); check(pg.evaluate("document.documentElement.classList.contains('kbd')"), f'{tag}: Tab turns focus rings on')
        # Debrief to drill.
        H('endask'); H('end-yes'); pg.wait_for_timeout(300)
        picks = pg.evaluate("[...document.querySelectorAll('.dd-go')].map(b=>b.dataset.k)")
        check(1 <= len(picks) <= 2 and all(k in ('med', 'first', 'sbar', 'calm') for k in picks), f'{tag}: the debrief offers the drill for what was missed ({picks})')
        if picks:
            pg.locator('.dd-go').first.click(); pg.wait_for_timeout(300)
            check(pg.evaluate("Shift.ui._ui.view") == 'drill' and pg.evaluate("Shift.ui._ui.dr.kind") == picks[0], f'{tag}: one tap starts that drill')
        ctx.close()
    # Mapping: psych misses around agitation point at De-escalation; med misses at Med Pass.
    pg = b.new_page(); fontroute(pg); pg.goto(GAME); pg.wait_for_timeout(200)
    m = pg.evaluate("Shift.ui._handlers && true")
    check(m, 'game loads')
    # The monitor alarms: a tele room with a low SpO2 tints the room and colours the screen.
    pg.evaluate("(()=>{const p={runs:[],settings:{sound:'off',music:'off'},seen:{'coach:station':1,'coach:room':1,orient:1}};p.terms=Shift.terms&&Shift.terms.version;localStorage.setItem('theshift.profile.v1',JSON.stringify(p))})()"); pg.reload(); pg.wait_for_timeout(300)
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    H('pick-case', id='stepdown-6e-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go')
    pid = pg.evaluate("Shift.engine.cases['stepdown-6e-1'].patients[0].id")
    H('goto', pid=pid); check(pg.evaluate("!document.querySelector('.room-top.alarming')"), 'a settled monitor does not alarm')
    pg.evaluate(f"""(()=>{{const E=Shift.engine,a0=E.api;E.api=(s)=>{{const A=a0(s),v0=A.vitals;A.vitals=(id)=>{{const v=Object.assign({{}},v0(id));if(id==='{pid}')v.SpO2=85;return v}};return A}};
      const s=Shift.ui._state(),P=s.p['{pid}'];P.vit.push(Object.assign({{}},P.vit[P.vit.length-1],{{t:s.t,SpO2:86,by:'You'}}));}})()""")
    pg.evaluate("Shift.ui._render(true)")
    check(pg.evaluate("!!document.querySelector('.room-top.alarming') && !!document.querySelector('svg.scene.mon-2')"), 'an SpO2 of 85 on the monitor alarms the room')
    check(pg.evaluate("!!document.querySelector('.vstrip .alarm')") and 'falling' in pg.evaluate("document.querySelector('.vstrip .alarm').innerText"), 'a falling recorded SpO2 reads as an alarm, with the reading before it')
    check(pg.evaluate("![...document.querySelectorAll('.scene *')].some(e=>getComputedStyle(e).filter!=='none'&&e.closest('svg'))"), 'the room scene uses no CSS filters')
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('LOOP ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
