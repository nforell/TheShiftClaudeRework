"""Hostile conditions: blocked or full storage, corrupted saves and profiles, offline, a 320px screen, switching
shifts mid-game, report with nobody left. None may crash or blank the game."""
import sys, pathlib, json
ROOT=pathlib.Path(__file__).resolve().parent.parent; sys.path.insert(0,str(ROOT/'tests'))
from fonts import fontroute
from playwright.sync_api import sync_playwright
GAME=(ROOT/'dist'/'the-shift.html').as_uri()
OK_PROF="{terms:'9999',runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}"
res=[]
def play(pg, case='medsurg-4w-1', end=True):
    H=lambda a,**kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]&&Shift.ui._handlers[a]({dataset:kw})",[a,kw])
    H('pick-case',id=case); H('new')
    if pg.evaluate("Shift.ui._ui.ov")=='confirm': H('new-yes')
    if pg.evaluate("Shift.ui._ui.ov")=='orient': pg.evaluate("Shift.ui._handlers.or({dataset:{do:'skip'}})")
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    if not pg.evaluate("!!Shift.ui._state()"): raise Exception('no game after new: view=%s ov=%s' % (pg.evaluate("Shift.ui._ui.view"), pg.evaluate("Shift.ui._ui.ov")))
    H('h-done'); H('rank-submit'); H('rank-go')
    for _ in range(3):
        ov=pg.evaluate("Shift.ui._ui.ov")
        if ov=='crit': H('crit-x')
        elif ov=='result': H('res-close')
        elif ov: H('close')
    pid=pg.evaluate("Object.keys(Shift.ui._state().p)[0]")
    H('goto',pid=pid); H('assess',sys='general'); H('res-close'); H('skip'); pg.wait_for_timeout(300)
    if end: H('endask'); H('end-yes'); pg.wait_for_timeout(200); H('dtab',v='nclex'); H('home')
def run(name, init=None, setup=None, offline=False, W=390, case='medsurg-4w-1', ctxkw=None):
    with sync_playwright() as p:
        b=p.chromium.launch(); ctx=b.new_context(viewport={'width':W,'height':700}, **(ctxkw or {})); pg=ctx.new_page(); fontroute(pg); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
        if init: pg.add_init_script(init)
        try:
            pg.goto(GAME); pg.wait_for_timeout(300)
            if setup: pg.evaluate(setup); pg.reload(); pg.wait_for_timeout(400)
            if offline: ctx.set_offline(True)
            blank=pg.evaluate("!document.getElementById('app').innerText.trim()")
            if pg.locator('[data-act="terms-ok"]').count(): pg.click('[data-act="terms-ok"]')
            play(pg, case)
            oops=pg.inner_text('.oops pre')[:300] if pg.locator('.oops').count() else None
            res.append({'test':name,'blank_at_start':blank,'oops':oops,'errs':errs[:3],'view':pg.evaluate("Shift.ui._ui.view")})
        except Exception as ex:
            res.append({'test':name,'exception':str(ex)[:300],'errs':errs[:3]})
        b.close()
NOSTORE="(()=>{const d={get(){throw new DOMException('denied','SecurityError')}};try{Object.defineProperty(window,'localStorage',d)}catch(e){};try{Object.defineProperty(window,'sessionStorage',d)}catch(e){}})()"
FULL="(()=>{const s=Storage.prototype.setItem;window.__raw=(k,v)=>s.call(localStorage,k,v);Storage.prototype.setItem=function(k,v){if(String(k).startsWith('theshift'))throw new DOMException('full','QuotaExceededError');return s.call(this,k,v)}})()"
run('storage blocked (private mode)', init=NOSTORE)
run('storage full', init=FULL, setup=f"window.__raw('theshift.profile.v1',JSON.stringify({OK_PROF}))")
for nm,save in [('save: bad JSON',"'{bad'"),('save: empty object',"'{}'"),('save: unknown shift',"JSON.stringify({caseId:'nope',t:30,p:{}})"),('save: array',"'[]'"),('save: null',"'null'")]:
    run(nm, setup=f"localStorage.setItem('theshift.profile.v1',JSON.stringify({OK_PROF}));localStorage.setItem('theshift.save.v1',{save})")
for nm,prof in [('profile: bad JSON',"'{x'"),('profile: null',"'null'"),('profile: array',"'[]'"),('profile: runs null',"JSON.stringify({terms:'9999',runs:null,settings:null})"),('profile: junk fields',"JSON.stringify({terms:'9999',runs:[{caseId:'gone',score:'x'}],settings:{theme:'purple',text:3},ngn:{'q-nope':{score:'a'}},stars:'x',lessons:[1,2],badges:null,best:7,seen:[]})")]:
    run(nm, setup=f"localStorage.setItem('theshift.profile.v1',{prof})")
run('offline after load', setup=f"localStorage.setItem('theshift.profile.v1',JSON.stringify({OK_PROF}))", offline=True)
run('tiny phone 320px', setup=f"localStorage.setItem('theshift.profile.v1',JSON.stringify({OK_PROF}))", W=320, case='icu-3w-1')
run('reduced motion off, sound on', setup="localStorage.setItem('theshift.profile.v1',JSON.stringify({terms:'9999',runs:[],settings:{theme:'dark',sound:'on',music:'on',motion:'full'},seen:{}}))")


# The selected card on home differs from the shift in progress: game-adjacent screens must not mix them.
def switch_check():
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844}); fontroute(pg); errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)[:200]))
        pg.goto(GAME); pg.evaluate(f"localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({OK_PROF}))"); pg.reload(); pg.wait_for_timeout(300)
        H=lambda a,**kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})",[a,kw])
        play(pg, 'medsurg-4w-1', end=False); H('home'); H('pick-case',id='stepdown-6e-1')
        for a in ['practice','home','awards','home','report']: H(a)
        res.append({'test':'switch shifts mid-game, open practice/awards/report','oops':pg.inner_text('.oops pre')[:300] if pg.locator('.oops').count() else None,'errs':errs[:3]})
        H('pick-case',id='stepdown-6e-1'); H('resume'); pg.evaluate("(()=>{const s=Shift.ui._state();s.t=285;Object.values(s.p).forEach(P=>P.icu=true)})()"); H('back'); H('report')
        res.append({'test':'report with every patient off the unit','oops':pg.inner_text('.oops pre')[:300] if pg.locator('.oops').count() else None,'errs':errs[:3]})
        H('home'); H('awards'); H('aw-tab',k='floor')
        res.append({'test':'floor-call collection labels','oops':'undefined label' if 'undefined' in pg.inner_text('#app') else None,'errs':[]})
        b.close()
switch_check()
bad=[r for r in res if r.get('exception') or r.get('oops') or r.get('errs') or r.get('blank_at_start')]
for r in res: print(('FAIL ' if r in bad else 'ok   ')+r['test']+(': '+str(r.get('exception') or r.get('oops') or r.get('errs'))[:200] if r in bad else ''))
print('ROBUST ' + ('CLEAN' if not bad else 'FAILED'))
sys.exit(1 if bad else 0)
