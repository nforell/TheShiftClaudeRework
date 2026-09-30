"""Visit every screen and sheet of one shift and check it: JS errors, sideways overflow, overlapping text,
covered or undersized buttons, clipped text. Usage: python tests/sweep.py <case> <width> [light|dark]"""
import sys, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
GAME = (ROOT / 'dist' / 'the-shift.html').as_uri()
OUT = ROOT / 'tests' / 'out'; OUT.mkdir(exist_ok=True)
from playwright.sync_api import sync_playwright
case=sys.argv[1]; W=int(sys.argv[2]); theme=sys.argv[3] if len(sys.argv)>3 else 'light'
AUD=(ROOT/'tests'/'audit.js').read_text()
res=[]; errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':W,'height':844 if W<600 else 900}, is_mobile=W<600, has_touch=W<600); pg=ctx.new_page()
    pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
    pg.on('pageerror',lambda e:errs.append(str(e)[:200]+' || '+(e.stack or '')[:300]))
    pg.goto(GAME); pg.wait_for_timeout(300)
    pg.evaluate(f"(()=>{{const p=JSON.parse(localStorage.getItem('theshift.profile.v1')||'{{}}');p.settings=Object.assign(p.settings||{{}},{{theme:'{theme}',sound:'off',music:'off',motion:'reduced'}});p.seen={{'coach:station':1,'coach:room':1}};localStorage.setItem('theshift.profile.v1',JSON.stringify(p))}})()")
    pg.reload(); pg.wait_for_timeout(300)
    H=lambda a,**kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})",[a,kw])
    st=lambda e: pg.evaluate('(()=>{const s=Shift.ui._state();return '+e+'})()')
    def A(name, scroll=True):
        pg.wait_for_timeout(120)
        # audit at top and after scrolling through tall pages
        ys=[0]
        if scroll:
            h=pg.evaluate("document.documentElement.scrollHeight"); vh=pg.evaluate("innerHeight"); ys=list(range(0, max(1,h-vh+1), vh))[:6]
        for y in ys:
            pg.evaluate(f"window.scrollTo(0,{y})"); pg.wait_for_timeout(60)
            r=pg.evaluate(AUD); r['state']=name+('@'+str(y) if y else ''); res.append(r)
        pg.evaluate("window.scrollTo(0,0)")
        # scroll inside sheets
        if pg.evaluate("!!document.querySelector('.sheet-b,.chart-b')"):
            n=pg.evaluate("(()=>{const e=document.querySelector('.sheet-b,.chart-b');return Math.ceil(e.scrollHeight/Math.max(1,e.clientHeight))})()")
            for k in range(1, min(n,4)):
                pg.evaluate(f"(()=>{{const e=document.querySelector('.sheet-b,.chart-b');e.scrollTop=e.clientHeight*{k}}})()"); pg.wait_for_timeout(60)
                r=pg.evaluate(AUD); r['state']=name+'#s'+str(k); res.append(r)
    def close():
        ov=pg.evaluate("Shift.ui._ui.ov")
        if ov=='crit': H('crit-x')
        elif ov=='result': H('res-close')
        elif ov: H('close')
    H('pick-case', id=case); A('home')
    H('settings'); A('settings'); close(); H('help'); A('help'); close()
    H('new'); A('intro'); H('intro-go'); A('handoff')
    n=len(st("Shift.engine.api(s).c.patients.filter(p=>!p.arrives)"))
    for i in range(1,n):
        H('flag', k=st(f"Shift.engine.api(s).c.patients.filter(p=>!p.arrives)[{i-1}].id")+':0'); H('h-go', i=str(i)); A(f'handoff{i}', scroll=False)
    H('roster'); A('roster-handoff'); close()
    H('h-done'); A('rank'); H('rk', i='0', d='1'); A('rank-moved', scroll=False); H('rank-peek', pid=st("Shift.ui._ui.rank[0]")); A('rank-peek'); H('rank-submit'); A('rank-done'); H('rank-go')
    A('station')
    H('roster'); A('roster'); close(); H('calls'); A('progress'); close(); H('inbox'); A('inbox'); close()
    H('delegate'); A('deleg'); close(); H('callpick'); A('sbar-pick'); close(); H('nova'); A('nova'); close(); H('menu'); A('menu'); close()
    pids=st("Object.keys(s.p).filter(k=>{const d=Shift.engine.api(s).def(k);return !d.arrives})")
    pid=pids[0]
    H('chart', pid=pid)
    for tab in ['overview','vitals','labs','orders','mar','notes','io']: H('chart', pid=pid, tab=tab); A('chart-'+tab, scroll=False)
    close()
    for q in pids:
        H('goto', pid=q); A('room-'+q)
        for dock in ['assess','care','meds','talk']: H('dock', id=dock); A(f'room-{q}-{dock}', scroll=True)
        H('assess', sys='vitals'); A('result-'+q); close()
        meds=st(f"Shift.engine.api(s).def('{q}').meds.filter(m=>!m.later&&m.initStatus!=='given').map(m=>m.id)")
        if meds: H('dock', id='meds'); H('med', id=meds[0]); A('med-'+q); close()
        H('dock', id='talk'); H('sbar', pid=q); A('sbar-'+q); close()
        tk=pg.evaluate("!!document.querySelector('[data-act=talk]')")
        if tk:
            H('talk'); 
            if pg.evaluate("Shift.ui._ui.ov")=='dialog': A('dialog-'+q, scroll=False)
            close()
    H('back')
    # skip through the shift, stopping at floor calls and transfers
    seenfl=0; seenaway=0; ff=0
    for i in range(40):
        if st('s.ended'): break
        if pg.evaluate("Shift.ui._ui.view")=='room': H('back')
        o=st("Shift.floor.open(s).map(x=>x.id)")
        if o and seenfl<2:
            H('floor', id=o[0]); A('floor-'+o[0], scroll=False); H('floor-pick', i='1'); A('floor-answered', scroll=False); close(); seenfl+=1
            A('station-mid', scroll=False)
        gone=st("Object.keys(s.p).filter(k=>s.p[k].out)")
        if gone and seenaway<1:
            H('away', pid=gone[0]); A('away'); H('away-ho'); A('away-ho'); H('away-back')
            if st(f"!!s.p['{gone[0]}'].out.spec.family"): H('away-fam'); A('away-fam')
            close(); seenaway+=1
        if ff==0:
            pg.evaluate("Shift.ui._handlers.skip({dataset:{}})"); pg.wait_for_timeout(500); r=pg.evaluate(AUD); r['state']='ff-overlay'; res.append(r); ff=1; pg.evaluate("document.querySelectorAll('.ff').forEach(n=>n.remove())")
        else: H('catchup')
        if pg.evaluate("Shift.ui._ui.ov")=='crit': A('crit', scroll=False)
        close()
        if st('s.t')>=st('Shift.engine.api(s).c.length')-55 and not st('s.ended'): break
    if not st('s.ended'):
        A('station-late')
        H('report'); A('report'); 
        if pg.evaluate("!!document.querySelector('[data-act=rep-pick]')"):
            pg.evaluate("document.querySelectorAll('[data-act=rep-pick]')[0]&&Shift.ui._handlers['rep-pick']({dataset:{id:document.querySelectorAll('[data-act=rep-pick]')[0].dataset.id}})")
            H('rep-send'); A('report-sent')
        close()
        H('endask'); A('confirm'); H('end-yes')
    pg.wait_for_timeout(300); A('debrief')
    H('filter', k='bad'); A('debrief-bad', scroll=False)
    H('awards'); A('awards')
    for tb in ['lessons','floor','units']: H('aw-tab', k=tb); A('awards-'+tb)
    H('aw-back'); A('home-after')
    b.close()
json.dump({'case':case,'W':W,'theme':theme,'errs':errs,'res':res}, open(OUT/f'{case}-{W}-{theme}.json','w'))
tot={k:sum(len(r[k]) for r in res) for k in ['off','overlap','covered','small','clipped']}
print(case, W, theme, 'states', len(res), 'errs', len(errs), 'overflow', sum(1 for r in res if r['overflow']), tot)
