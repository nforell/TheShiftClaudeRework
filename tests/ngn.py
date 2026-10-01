"""NCLEX-style practice items: every shift has three, every item is well-formed and scores correctly (full marks for
the key, NCSBN +/- for select-all and highlight), and the debrief can play all three. Usage: python tests/ngn.py"""
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
    pg = b.new_page(viewport={'width': 1280, 'height': 900}); fontroute(pg); pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(GAME); pg.evaluate("localStorage.clear();localStorage.setItem('theshift.profile.v1',JSON.stringify({runs:[],settings:{theme:'light',sound:'off',music:'off',motion:'reduced'},seen:{'coach:station':1,'coach:room':1,tour:1}}))"); pg.reload(); pg.wait_for_timeout(300)
    res = pg.evaluate("""()=>{const N=Shift.ngn,out=[];const cases=Object.keys(Shift.engine.cases);
      for(const c of cases){const its=N.items(c);out.push(['count',c,its.length]);
        for(const it of its){let key={};
          if(it.type==='bowtie')key={c:it.cond.ans,a:it.actions.ans.slice(),p:it.params.ans.slice()};
          if(it.type==='matrix')key={r:it.rows.map(r=>r.ans)};
          if(it.type==='cloze')key={d:it.parts.filter(x=>typeof x!=='string').map(x=>x.ans)};
          if(it.type==='sata')key={s:it.opts.map((o,i)=>o.ok?i:-1).filter(i=>i>=0)};
          if(it.type==='highlight')key={s:it.parts.map((o,i)=>o.ok?i:-1).filter(i=>i>=0)};
          out.push(['key',it.id,N.score(it,key)===N.max(it)&&N.complete(it,key)]);
          if(it.type==='sata'||it.type==='highlight'){const L=it.type==='sata'?it.opts:it.parts;const all={s:L.map((_,i)=>i)};out.push(['pm',it.id,N.score(it,all)===Math.max(0,L.filter(o=>o.ok).length-L.filter(o=>!o.ok).length)]);}
          out.push(['why',it.id,!!it.why&&!!it.stem&&!!it.q&&!!it.step]);
          if(it.type==='bowtie')out.push(['bt',it.id,it.actions.ans.length===2&&it.params.ans.length===2&&it.cond.opts.length>=4]);}}
      return out}""")
    for r in res:
        if r[0] == 'count': check(r[2] == 3, f'{r[1]} has three items')
        elif not r[2]: check(False, f'{r[0]} {r[1]}')
    check(all(r[2] for r in res if r[0] != 'count'), 'every item is well-formed and the key scores full marks')
    H = lambda a, **kw: pg.evaluate("([a,kw])=>Shift.ui._handlers[a]({dataset:kw})", [a, kw])
    H('pick-case', id='stepdown-6e-1'); H('new')
    if pg.evaluate("Shift.ui._ui.intro!=null"): H('intro-go')
    H('h-done'); H('rank-submit'); H('rank-go'); H('endask'); H('end-yes'); pg.wait_for_timeout(300)
    check(pg.locator('.ngn-sec').count() == 1, 'the debrief offers practice questions')
    H('ngn-open', i='0'); check(pg.locator('.bowtie').count() == 1, 'question 1 is a bowtie')
    for k, v in (('c', 0), ('a', 0), ('a', 1), ('p', 0), ('p', 1)): H('ngn-pick', k=k, v=str(v))
    H('ngn-check'); check('5 of 5' in pg.inner_text('.ngn-res'), 'a correct bowtie scores 5 of 5')
    H('ngn-go', i='1'); check(pg.locator('.ngn-mx').count() == 1, 'question 2 is a matrix')
    for ri in range(6): H('ngn-pick', k='r', row=str(ri), v='1')
    H('ngn-check'); txt = pg.inner_text('.ngn-res'); check('3 of 6' in txt, f'a half-right matrix scores 3 of 6 ({txt.splitlines()[0]})')
    H('ngn-go', i='2')
    for v in range(6): H('ngn-pick', k='s', v=str(v))
    H('ngn-check'); txt = pg.inner_text('.ngn-res'); check('0 of 3' in txt, f'selecting everything scores zero under +/- ({txt.splitlines()[0]})')
    saved = pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('theshift.profile.v1')).ngn||{}).length")
    check(saved == 3, 'results are saved to the profile')
    pg.screenshot(path=str(ROOT / 'tests' / 'out' / 'ngn.png'))
    check(not errs, 'no page errors' + (': ' + errs[0] if errs else ''))
    b.close()
print('NGN ' + ('FAILED ' + str(len(fails)) if fails else 'CLEAN'))
sys.exit(1 if fails else 0)
